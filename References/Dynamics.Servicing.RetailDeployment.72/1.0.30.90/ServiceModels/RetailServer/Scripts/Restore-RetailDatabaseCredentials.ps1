<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$RetailChannelDbServerName,
    [Parameter(Mandatory=$true)]
    [string]$RetailChannelDbName,
    
    [PSCredential]$SqlAdminCredential = (Get-Credential -UserName "sqladmin" -Message "Enter credential for sqladmin"),
    [PSCredential]$AxRetailRuntimeUserCredential = (Get-Credential -UserName "axretailruntimeuser" -Message "Enter credential for axretailruntimeuser"),
    [PSCredential]$AxRetailDatasyncUserCredential = (Get-Credential -UserName "axretaildatasyncuser" -Message "Enter credential for axretaildatasyncuser"),
    
    [ValidateNotNullOrEmpty()]
    [string]$AosWebsiteName = 'AOSService',
    [ValidateNotNullOrEmpty()]
    [string]$RetailServerWebsiteName = 'RetailServer',
    [ValidateNotNullOrEmpty()]
    [string]$RetailCloudPosWebsiteName = 'RetailCloudPos',
    [ValidateNotNullOrEmpty()]
    [string]$RetailStorefrontWebsiteName = 'RetailStorefront',

    [switch]$CreateIfNotExist = $true,
    [switch]$Force
)

Import-Module WebAdministration

$AXConfigEncryptorPath = "bin\Microsoft.Dynamics.AX.Framework.ConfigEncryptor.exe"

function Get-UseDatabaseCredentialInWebConfigForUpgrade
{
    $targetRegistryKeyPath = "HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailChannelDatabase"
    $targetPropertyName = 'UseDatabaseCredentialInWebConfigForUpgrade'
    
    $targetPropertyRegistryObject = Get-ItemProperty -Path $targetRegistryKeyPath -Name $targetPropertyName -ErrorAction SilentlyContinue
    $flagValue = $targetPropertyRegistryObject.$targetPropertyName

    return ($flagValue -ilike 'true')
}

function Get-WebConfigAppSetting(
    [ValidateNotNullOrEmpty()]
    [xml] $WebConfig,
    [ValidateNotNullOrEmpty()]
    [string] $SettingName)
{
    $appSettingElement = $WebConfig.SelectSingleNode("/configuration/appSettings/add[@key='$SettingName']")
    
    if(!$appSettingElement)
    {
        throw "Failed to get app setting from web.config because the key $SettingName doesn't exist"
    }
    
    $appSettingValue = $appSettingElement.Value
    
    if(!$appSettingValue)
    {
        return ""
    }
    
    return $appSettingValue
}

function Create-WebSiteDBConfiguration(
    [ValidateNotNullOrEmpty()]
    [string]$connectionString,
    [ValidateNotNullOrEmpty()]
    [string]$targetPropertyName)
{
    [hashtable]$ht = @{};

    # sample connection string for sql azure "Server=$dbServer;Database=$dbName;User ID=$dbUser;Password=$dbPassword;Trusted_Connection=False;Encrypt=True;"
    $connectionStringObject = New-Object System.Data.Common.DbConnectionStringBuilder
    $connectionStringObject.PSObject.Properties['ConnectionString'].Value = $connectionString
    
    $ht.server = $connectionStringObject['Server']
    $ht.database = $connectionStringObject['Database']
    $ht.sqlUserName = $connectionStringObject['User ID']
    $ht.sqlUserPassword = $connectionStringObject['password']
    $ht.encrypt = $connectionStringObject['encrypt']
    $ht.trustservercertificate = $connectionStringObject['trustservercertificate']
    
    return $ht
}

function Get-AxDatabaseUserFromWebConfig(
    [ValidateNotNullOrEmpty()]
    [xml] $webConfig,
    [ValidateNotNullOrEmpty()]
    [string] $dbUserKey,
    [ValidateNotNullOrEmpty()]
    [string] $dbUserPasswordKey )
{
    $DbServer = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName 'DataAccess.DbServer'
    $Database = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName 'DataAccess.Database'
    $encryption = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName 'DataAccess.encryption'
    $disableDBServerCertificateValidation = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName 'DataAccess.disableDBServerCertificateValidation'
    $dbUser = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName $dbUserKey
    $dbUserPassword = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName $dbUserPasswordKey
    
    if($DbServer -and $Database -and $dbUser -and $dbUserPassword)
    {
        return ('Server="{0}";Database="{1}";User ID="{2}";Password="{3}";Encrypt={4};TrustServerCertificate={5};' -f $DbServer,$Database,$dbUser,$dbUserPassword,$encryption,$disableDBServerCertificateValidation)
    }
    else
    {
        throw "Cannot find the database credential information from web.config with key $dbUserKey and $dbUserPasswordKey"
    }
}

function Invoke-AxConfigEncryptorUtility(
    [ValidateNotNullOrEmpty()]
    [string]$AxEncryptionToolPath,
    [ValidateNotNullOrEmpty()]
    [string]$WebConfigPath,
    [ValidateNotNullOrEmpty()]
    [ValidateSet("Encrypt","Decrypt")]
    [string]$Operation
    )
{
    if(-not (Test-Path $AxEncryptionToolPath))
    {
        throw "$AxEncryptionToolPath is not found."
    }
    if(-not (Test-Path $WebConfigPath))
    {
        throw "$WebConfigPath is not found."
    }
    $Global:LASTEXITCODE = 0
    switch($Operation)
    {
        'Encrypt' { & $AxEncryptionToolPath -encrypt $webConfigPath }
        'Decrypt' { & $AxEncryptionToolPath -decrypt $webConfigPath }
    }
    $exitCode = $Global:LASTEXITCODE

    if($exitCode -eq 0)
    {
        Write-Host "$AxEncryptionToolPath completed successfully."
    }
    else
    {
        Write-Warning "$AxEncryptionToolPath failed with exit code: $exitCode"
    }
}

function Get-SQLServerType(
    [ValidateNotNullOrEmpty()][string]$dbServer,
    [ValidateNotNullOrEmpty()][string]$dbName,
    [ValidateNotNullOrEmpty()][string]$dbUser,
    [ValidateNotNullOrEmpty()][string]$dbPassword)
{
    $query = "DECLARE @SQLType INT
            SELECT @SQLType = 0

            if (CHARINDEX('SQL Azure',@@VERSION) > 0)
            BEGIN
                SELECT @SQLType = 1
            END
            
            SELECT @SQLType AS SQLType"
    $result = Invoke-SqlCmd -ServerInstance $dbServer -Database  $dbName -Username $dbUser -Password $dbPassword -Query $query -ErrorAction Stop
    
    return [int]$result.SQLType
}

Write-Host "Validating parameters."
Write-Host "Validating database credentials."
if(($SqlAdminCredential -eq $null) -or ($AxRetailRuntimeUserCredential -eq $null) -or ($AxRetailDatasyncUserCredential -eq $null))
{
    Write-Warning "Credentials for sqladmin,axretailruntimeuser,axretaildatasyncuser cannot be null."
    throw "Credentials for sqladmin,axretailruntimeuser,axretaildatasyncuser cannot be null."
}

$SqlAdminUserName = $SqlAdminCredential.UserName
$SqlAdminPassword = $SqlAdminCredential.Password
$SqlAdminBSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SqlAdminPassword)
$SqlAdminPlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($SqlAdminBSTR)

$AxRetailRuntimeUserName = $AxRetailRuntimeUserCredential.UserName
$AxRetailRuntimeUserPassword = $AxRetailRuntimeUserCredential.Password
$AxRetailRuntimeUserBSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($AxRetailRuntimeUserPassword)
$AxRetailRuntimeUserPlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($AxRetailRuntimeUserBSTR)

$AxRetailDatasyncUserName = $AxRetailDatasyncUserCredential.UserName
$AxRetailDatasyncUserPassword = $AxRetailDatasyncUserCredential.Password
$AxRetailDatasyncUserBSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($AxRetailDatasyncUserPassword)
$AxRetailDatasyncUserPlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($AxRetailDatasyncUserBSTR)

if([String]::IsNullOrWhiteSpace($SqlAdminUserName) -or [String]::IsNullOrWhiteSpace($SqlAdminPlainPassword) `
    -or [String]::IsNullOrWhiteSpace($AxRetailRuntimeUserName) -or [String]::IsNullOrWhiteSpace($AxRetailRuntimeUserPlainPassword) `
    -or [String]::IsNullOrWhiteSpace($AxRetailDatasyncUserName) -or [String]::IsNullOrWhiteSpace($AxRetailDatasyncUserPlainPassword) )
{
    Write-Warning "You must provide username and password for sqladmin,axretailruntimeuser,axretaildatasyncuser."
    throw "You must provide username and password for sqladmin,axretailruntimeuser,axretaildatasyncuser."
}

Write-Host "Validation is done for database credentials."

Write-Host "Validating state of the environment."

Write-Host "Validating RetailServer website."
$retailServerWebsite = Get-Website -Name $RetailServerWebsiteName

if($retailServerWebsite -eq $null)
{
    Write-Warning "Cannot find retail server website with name $RetailServerWebsiteName"
    throw "Cannot find retail server website with name $RetailServerWebsiteName"
}

$retailServerWebConfigFilePath = Join-Path $retailServerWebsite.physicalPath 'web.config'

if(-not(Test-Path -Path $retailServerWebConfigFilePath))
{
    Write-Warning "Cannot find retail server web.config with path $retailServerWebConfigFilePath"
    throw "Cannot find retail server web.config with path $retailServerWebConfigFilePath"
}

if((Get-ItemProperty $retailServerWebConfigFilePath -Name IsReadOnly).IsReadOnly)
{
    throw "$retailServerWebConfigFilePath is set to read only, please update the file attribute and retry."
}

Write-Host "Validation is done for RetailServer website."

Write-Host "Validating AOS website."
$aosWebsite = Get-Website -Name $AosWebsiteName

if($aosWebsite -eq $null)
{
    Write-Warning "Cannot find AOS website with name $AosWebsiteName"
    throw "Cannot find AOS website with name $AosWebsiteName"
}

$aosWebPath = $aosWebsite.physicalPath
$axConfigEncryptorUtilityPath = Join-Path $aosWebPath $AXConfigEncryptorPath
if(-not (Test-Path $axConfigEncryptorUtilityPath))
{
    throw "$axConfigEncryptorUtilityPath is not found."
}

Write-Host "Validation is done for AOS website."

# Backup Retail Server web.config first
Write-Host "Backup RetailServer website."
$dateString = Get-Date -format 'yyyy-MM-dd-HH-mm-ss'
$backupFolder = Join-Path (Split-Path $retailServerWebsite.physicalPath) "Backup_$dateString"
Copy-Item -Path $retailServerWebsite.physicalPath -Destination $backupFolder -Recurse

try
{
    Write-Host "Decrypt RetailServer web.config"
    Invoke-AxConfigEncryptorUtility -AxEncryptionToolPath $axConfigEncryptorUtilityPath -WebConfigPath $retailServerWebConfigFilePath -Operation 'Decrypt'

    [xml]$retailServerWebConfigDoc = Get-Content -Path $retailServerWebConfigFilePath
    
    $IsDbCredentialInWebConfig = Get-UseDatabaseCredentialInWebConfigForUpgrade
    if($IsDbCredentialInWebConfig)
    {
        Write-Host "Servicing information has been migrated to web.config, extract it from web.config"
        $websiteConnectionStringSettings = Get-AxDatabaseUserFromWebConfig -webConfig $retailServerWebConfigDoc -dbUserKey 'DataAccess.AxAdminSqlUser' -dbUserPasswordKey 'DataAccess.AxAdminSqlPwd'
        $deployDbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSettings
    
        # Check existence of axdeployextuser, if not present, fall back to use axdeployuser as replacement.
        $appSettingSqlUserElement = $retailServerWebConfigDoc.SelectSingleNode("/configuration/appSettings/add[@key='DataAccess.SqlUser']")
        
        if($appSettingSqlUserElement -ne $null)
        {
            Write-Host "Information about axdeployextuser doesn't present, use axdeployuser as replacement."
            $extUserConnectionStringSettings = Get-AxDatabaseUserFromWebConfig -webConfig $retailServerWebConfigDoc -dbUserKey 'DataAccess.SqlUser' -dbUserPasswordKey 'DataAccess.SqlPwd'
            $extUserSetting = Create-WebSiteDBConfiguration -connectionString $extUserConnectionStringSettings
        }
        else
        {
            $extUserSetting = $deployDbSetting
        }
    }
    else
    {
        Write-Host "Servicing information has NOT been migrated to web.config, extract it from registry"
        try
        {            
            $targetPropertyRegistryObject = Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailChannelDatabase\Servicing' -Name 'UpgradeServicingData1' -ErrorAction SilentlyContinue
            $channelDbEncryptedServicingData = $targetPropertyRegistryObject.UpgradeServicingData1
    
            if($channelDbEncryptedServicingData)
            {
                $servicingDataAsSecureString = ConvertTo-SecureString $channelDbEncryptedServicingData
                $websiteConnectionStringSettings = [System.Runtime.InteropServices.marshal]::PtrToStringAuto([System.Runtime.InteropServices.marshal]::SecureStringToBSTR($servicingDataAsSecureString))
                
                $deployDbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSettings
            }            

            # Check existence of axdeployextuser, if not present, fall back to use axdeployuser as replacement.
            if(Test-Path -Path 'HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailChannelDatabase\Ext')
            {
                Write-Host "Information about axdeployextuser doesn't present, use axdeployuser as replacement."
               $extUserConnectionStringSettings = Get-ServicingDataFromRegistry -registryPath (Get-ChannelDbExtUserRegistryPath)

               $targetPropertyRegistryObject = Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailChannelDatabase\Ext' -Name 'UpgradeServicingData1' -ErrorAction SilentlyContinue
                $channelDbEncryptedServicingData = $targetPropertyRegistryObject.UpgradeServicingData1

                if($channelDbEncryptedServicingData)
                {
                    $servicingDataAsSecureString = ConvertTo-SecureString $channelDbEncryptedServicingData
                    $extUserConnectionStringSettings = [System.Runtime.InteropServices.marshal]::PtrToStringAuto([System.Runtime.InteropServices.marshal]::SecureStringToBSTR($servicingDataAsSecureString))
                
                    $extUserSetting = Create-WebSiteDBConfiguration -connectionString $extUserConnectionStringSettings
                }
            }
            if($extUserSetting -eq $null)
            {
               $extUserSetting = $deployDbSetting
            }
        }
        catch
        {
            # log detailed error message for trouble shooting.
            Write-Host ($global:error[0] | format-list * -f | Out-String)
            
            throw "Retail servicing data in registry is corrupted, please contact support team to update it and try again. "
        }
    }
    
    $retailUsersToEnsure = @{$AxRetailRuntimeUserName = $AxRetailRuntimeUserPlainPassword;
        $AxRetailDatasyncUserName = $AxRetailDatasyncUserPlainPassword;
        $deployDbSetting.sqlUserName = $deployDbSetting.sqlUserPassword}
    
    if(![String]::IsNullOrWhiteSpace($extUserSetting.sqlUserName) -and ![String]::IsNullOrWhiteSpace($extUserSetting.sqlUserPassword) `
        -and ($extUserSetting.sqlUserName -ne $deployDbSetting.sqlUserName) `
        -and !$retailUsersToEnsure.ContainsKey($extUserSetting.sqlUserName))
    {
        $retailUsersToEnsure.Add($extUserSetting.sqlUserName,$extUserSetting.sqlUserPassword)
    }
    
    [int]$SQLType = Get-SQLServerType -dbServer $RetailChannelDbServerName -dbName  $RetailChannelDbName -dbUser $SqlAdminUserName -dbPassword $SqlAdminPlainPassword
    foreach($user in $retailUsersToEnsure.Keys)
    {
        $password = $retailUsersToEnsure[$user]
        switch($SQLType)
        {
            0 # This is local SQL Server
            {
                if($Force)
                {
                    Write-Host "Force to drop user and login for $user"
                    $queryToDropUser = "
                        IF EXISTS(SELECT 1 FROM [master].[sys].[sql_logins] WHERE[NAME] = '$user')
                        BEGIN
                            DROP LOGIN $user
                        END
                        IF EXISTS(SELECT 1 FROM dbo.sysusers WHERE name = '$user' AND issqluser = 1
                        BEGIN
                            DROP USER $user 
                        END"
                    
                    Invoke-SqlCmd -ServerInstance $RetailChannelDbServerName -Database  $RetailChannelDbName -Username $SqlAdminUserName -Password $SqlAdminPlainPassword -Query $queryToDropUser -ErrorAction SilentlyContinue
                }

                if($CreateIfNotExist)
                {
                    $queryToEnsureUser = "
                        -- Create login if not exists
                        IF NOT EXISTS(SELECT 1 FROM dbo.syslogins WHERE [NAME] = '$user')
                        BEGIN
                            CREATE LOGIN $user WITH PASSWORD = '$password'
                        END

                        -- Create user from the login
                        IF NOT EXISTS (SELECT 1 FROM [sys].[sysusers] WHERE [NAME] = '$user' AND issqluser = 1)
                        BEGIN
                            CREATE USER $user FOR LOGIN $user 
                        END
                    
                        ALTER LOGIN $user WITH PASSWORD = '$password'
                    
                        -- Reassociate user and login
                        EXEC sp_change_users_login 'Update_One', '$user', '$user' "
                    Write-Host "Ensure user $user with query $queryToEnsureUser"
                    Invoke-SqlCmd -ServerInstance $RetailChannelDbServerName -Database  $RetailChannelDbName -Username $SqlAdminUserName -Password $SqlAdminPlainPassword -Query $queryToEnsureUser -ErrorAction Stop
                }
            }
            1 # This is SQL Azure
            {
                if($Force)
                {
                    Write-Host "Force to drop user and login for $user"
                    $queryToDropLogin = "
                        IF EXISTS (SELECT 1 FROM [master].[sys].[sql_logins] WHERE [NAME] = '$user')
                        BEGIN
                            DROP LOGIN $user
                        END "
                    Invoke-SqlCmd -ServerInstance $RetailChannelDbServerName -Database  "master" -Username $SqlAdminUserName -Password $SqlAdminPlainPassword -Query $queryToDropLogin -ErrorAction SilentlyContinue
                
                    $queryToDropUser = "
                        -- Drop user if not exists
                        IF EXISTS (SELECT 1 FROM [sys].[sysusers] WHERE [NAME] = '$user' AND issqluser = 1)
                        BEGIN
                            DROP USER $user
                        END "
                    Invoke-SqlCmd -ServerInstance $RetailChannelDbServerName -Database  $RetailChannelDbName -Username $SqlAdminUserName -Password $SqlAdminPlainPassword -Query $queryToDropUser -ErrorAction SilentlyContinue
                }
                
                if($CreateIfNotExist)
                {
                    $queryToEnsureLogin = "
                        IF NOT EXISTS (SELECT 1 FROM [master].[sys].[sql_logins] WHERE [NAME] = '$user')
                        BEGIN
                            CREATE LOGIN $user WITH PASSWORD = '$password'
                        END "
                    Write-Host "Ensure user login $user with query $queryToEnsureLogin"
                    Invoke-SqlCmd -ServerInstance $RetailChannelDbServerName -Database  "master" -Username $SqlAdminUserName -Password $SqlAdminPlainPassword -Query $queryToEnsureLogin -ErrorAction Stop
                
                    $queryToEnsureUser = "
                        -- Create user if not exists
                        IF NOT EXISTS (SELECT 1 FROM [sys].[sysusers] WHERE [NAME] = '$user' AND issqluser = 1)
                        BEGIN
                            CREATE USER $user WITH PASSWORD = '$password'
                        END "
                    Write-Host "Ensure user $user with query $queryToEnsureUser"
                    Invoke-SqlCmd -ServerInstance $RetailChannelDbServerName -Database  $RetailChannelDbName -Username $SqlAdminUserName -Password $SqlAdminPlainPassword -Query $queryToEnsureUser -ErrorAction Stop
                }
            }
        }
    }
    
    $retailDbRolesToUserMapping = @{'DataSyncUsersRole' = $AxRetailDatasyncUserName;
                                    'UsersRole' = $AxRetailRuntimeUserName;
                                    'ReportUsersRole' = $AxRetailRuntimeUserName}
    
    if(![String]::IsNullOrWhiteSpace($extUserSetting.sqlUserName) -and ![String]::IsNullOrWhiteSpace($extUserSetting.sqlUserPassword))
    {
        $retailDbRolesToUserMapping.Add('DeployExtensibilityRole',$extUserSetting.sqlUserName)
    }

    foreach($role in $retailDbRolesToUserMapping.Keys)
    {
        $queryToValidateRole = "SELECT * FROM sys.database_principals WHERE [TYPE] = 'R' and [NAME] = '$role' "
        
        Write-Host "Validating role $role with query $queryToValidateRole"
        $roleResult = Invoke-SqlCmd -ServerInstance $RetailChannelDbServerName -Database  $RetailChannelDbName -Username $SqlAdminUserName -Password $SqlAdminPlainPassword -Query $queryToValidateRole -ErrorAction Stop
        
        if($roleResult.COUNT -eq 0)
        {
            Write-Warning "Role $role doesn't exist in database."
        }
        else
        {
            Write-Host "Validation for role $role is done."
        }
        
        $userAssociatedToCurrentRole = $retailDbRolesToUserMapping[$role]
        $queryToAddUserToRole = "IF  EXISTS(SELECT * FROM dbo.sysusers WHERE name = '$role' AND issqlrole = 1) AND EXISTS(SELECT * FROM dbo.sysusers WHERE name = '$userAssociatedToCurrentRole' AND issqluser = 1) BEGIN EXEC sp_addrolemember '$role', '$userAssociatedToCurrentRole' END"

        Write-Host "Associating role $role to user $userAssociatedToCurrentRole with query $queryToAddUserToRole"
        Invoke-SqlCmd -ServerInstance $RetailChannelDbServerName -Database  $RetailChannelDbName -Username $SqlAdminUserName -Password $SqlAdminPlainPassword -Query $queryToAddUserToRole -ErrorAction Stop
    }

    Write-Host "Retail servicing information has been updated successfully."
}
catch
{
    $message = ($global:error[0] | format-list * -f | Out-String)
    Write-Host $message
    throw $_
}
finally
{
    Invoke-AxConfigEncryptorUtility -AxEncryptionToolPath $axConfigEncryptorUtilityPath -WebConfigPath $retailServerWebConfigFilePath -Operation 'Encrypt'
}
# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCA+8S2HRe0gWGiO
# 5UtwBXXkC1sEL7xHqyLLQhpWntOyfqCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
# 1rmSbej5AAAAAAGIMA0GCSqGSIb3DQEBCwUAMH4xCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25p
# bmcgUENBIDIwMTEwHhcNMjAwMzA0MTgzOTQ4WhcNMjEwMzAzMTgzOTQ4WjB0MQsw
# CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
# ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMR4wHAYDVQQDExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
# AQCSCNryE+Cewy2m4t/a74wZ7C9YTwv1PyC4BvM/kSWPNs8n0RTe+FvYfU+E9uf0
# t7nYlAzHjK+plif2BhD+NgdhIUQ8sVwWO39tjvQRHjP2//vSvIfmmkRoML1Ihnjs
# 9kQiZQzYRDYYRp9xSQYmRwQjk5hl8/U7RgOiQDitVHaU7BT1MI92lfZRuIIDDYBd
# vXtbclYJMVOwqZtv0O9zQCret6R+fRSGaDNfEEpcILL+D7RV3M4uaJE4Ta6KAOdv
# V+MVaJp1YXFTZPKtpjHO6d9pHQPZiG7NdC6QbnRGmsa48uNQrb6AfmLKDI1Lp31W
# MogTaX5tZf+CZT9PSuvjOCLNAgMBAAGjggGCMIIBfjAfBgNVHSUEGDAWBgorBgEE
# AYI3TAgBBggrBgEFBQcDAzAdBgNVHQ4EFgQUj9RJL9zNrPcL10RZdMQIXZN7MG8w
# VAYDVR0RBE0wS6RJMEcxLTArBgNVBAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJh
# dGlvbnMgTGltaXRlZDEWMBQGA1UEBRMNMjMwMDEyKzQ1ODM4NjAfBgNVHSMEGDAW
# gBRIbmTlUAXTgqoXNzcitW2oynUClTBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8v
# d3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIw
# MTEtMDctMDguY3JsMGEGCCsGAQUFBwEBBFUwUzBRBggrBgEFBQcwAoZFaHR0cDov
# L3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDEx
# XzIwMTEtMDctMDguY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQELBQADggIB
# ACnXo8hjp7FeT+H6iQlV3CcGnkSbFvIpKYafgzYCFo3UHY1VHYJVb5jHEO8oG26Q
# qBELmak6MTI+ra3WKMTGhE1sEIlowTcp4IAs8a5wpCh6Vf4Z/bAtIppP3p3gXk2X
# 8UXTc+WxjQYsDkFiSzo/OBa5hkdW1g4EpO43l9mjToBdqEPtIXsZ7Hi1/6y4gK0P
# mMiwG8LMpSn0n/oSHGjrUNBgHJPxgs63Slf58QGBznuXiRaXmfTUDdrvhRocdxIM
# i8nXQwWACMiQzJSRzBP5S2wUq7nMAqjaTbeXhJqD2SFVHdUYlKruvtPSwbnqSRWT
# GI8s4FEXt+TL3w5JnwVZmZkUFoioQDMMjFyaKurdJ6pnzbr1h6QW0R97fWc8xEIz
# LIOiU2rjwWAtlQqFO8KNiykjYGyEf5LyAJKAO+rJd9fsYR+VBauIEQoYmjnUbTXM
# SY2Lf5KMluWlDOGVh8q6XjmBccpaT+8tCfxpaVYPi1ncnwTwaPQvVq8RjWDRB7Pa
# 8ruHgj2HJFi69+hcq7mWx5nTUtzzFa7RSZfE5a1a5AuBmGNRr7f8cNfa01+tiWjV
# Kk1a+gJUBSP0sIxecFbVSXTZ7bqeal45XSDIisZBkWb+83TbXdTGMDSUFKTAdtC+
# r35GfsN8QVy59Hb5ZYzAXczhgRmk7NyE6jD0Ym5TKiW5MIIHejCCBWKgAwIBAgIK
# YQ6Q0gAAAAAAAzANBgkqhkiG9w0BAQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNV
# BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
# c29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlm
# aWNhdGUgQXV0aG9yaXR5IDIwMTEwHhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEw
# OTA5WjB+MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
# BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYD
# VQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDExMIICIjANBgkqhkiG
# 9w0BAQEFAAOCAg8AMIICCgKCAgEAq/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+la
# UKq4BjgaBEm6f8MMHt03a8YS2AvwOMKZBrDIOdUBFDFC04kNeWSHfpRgJGyvnkmc
# 6Whe0t+bU7IKLMOv2akrrnoJr9eWWcpgGgXpZnboMlImEi/nqwhQz7NEt13YxC4D
# dato88tt8zpcoRb0RrrgOGSsbmQ1eKagYw8t00CT+OPeBw3VXHmlSSnnDb6gE3e+
# lD3v++MrWhAfTVYoonpy4BI6t0le2O3tQ5GD2Xuye4Yb2T6xjF3oiU+EGvKhL1nk
# kDstrjNYxbc+/jLTswM9sbKvkjh+0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOEy/S6
# A4aN91/w0FK/jJSHvMAhdCVfGCi2zCcoOCWYOUo2z3yxkq4cI6epZuxhH2rhKEmd
# X4jiJV3TIUs+UsS1Vz8kA/DRelsv1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL
# 5zmhD+kjSbwYuER8ReTBw3J64HLnJN+/RpnF78IcV9uDjexNSTCnq47f7Fufr/zd
# sGbiwZeBe+3W7UvnSSmnEyimp31ngOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3
# T8HhhUSJxAlMxdSlQy90lfdu+HggWCwTXWCVmj5PM4TasIgX3p5O9JawvEagbJjS
# 4NaIjAsCAwEAAaOCAe0wggHpMBAGCSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRI
# bmTlUAXTgqoXNzcitW2oynUClTAZBgkrBgEEAYI3FAIEDB4KAFMAdQBiAEMAQTAL
# BgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBRyLToCMZBD
# uRQFTuHqp8cx0SOJNDBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3JsLm1pY3Jv
# c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNSb29DZXJBdXQyMDExXzIwMTFf
# MDNfMjIuY3JsMF4GCCsGAQUFBwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDovL3d3
# dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNSb29DZXJBdXQyMDExXzIwMTFf
# MDNfMjIuY3J0MIGfBgNVHSAEgZcwgZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEF
# BQcCARYzaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9kb2NzL3ByaW1h
# cnljcHMuaHRtMEAGCCsGAQUFBwICMDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkA
# YwB5AF8AcwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3DQEBCwUAA4ICAQBn
# 8oalmOBUeRou09h0ZyKbC5YR4WOSmUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7
# v0epo/Np22O/IjWll11lhJB9i0ZQVdgMknzSGksc8zxCi1LQsP1r4z4HLimb5j0b
# pdS1HXeUOeLpZMlEPXh6I/MTfaaQdION9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/
# KmtYSWMfCWluWpiW5IP0wI/zRive/DvQvTXvbiWu5a8n7dDd8w6vmSiXmE0OPQvy
# CInWH8MyGOLwxS3OW560STkKxgrCxq2u5bLZ2xWIUUVYODJxJxp/sfQn+N4sOiBp
# mLJZiWhub6e3dMNABQamASooPoI/E01mC8CzTfXhj38cbxV9Rad25UAqZaPDXVJi
# hsMdYzaXht/a8/jyFqGaJ+HNpZfQ7l1jQeNbB5yHPgZ3BtEGsXUfFL5hYbXw3MYb
# BL7fQccOKO7eZS/sl/ahXJbYANahRr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbS
# oqKfenoi+kiVH6v7RyOA9Z74v2u3S5fi63V4GuzqN5l5GEv/1rMjaHXmr/r8i+sL
# gOppO6/8MO0ETI7f33VtY5E90Z1WTk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtX
# cVZOSEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFeEwghXdAgEBMIGVMH4x
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01p
# Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAAGIr1LWuZJt6PkAAAAA
# AYgwDQYJYIZIAWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEE
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCDH
# xMGrgOOJk439Po7/Q3kWn4ZPXEG8rkUieRTE3CiiWzCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAm
# zyZxw2iKB+CSi0B8XWSfjP3UF4LfitIaImTWMWOji3Y0i5qjCbpD3DYr8fJlCg/y
# JJqT41vsH6TOZc91mF0ChjF0crU0hFN54aTzDvuebLK/0hwBsQr+EBf2O8KMfjlI
# dKZ8M8FlZ4SEngy1nuJPKodry1PtWDVFyGVwTR/OqrtfRO9ZbXOI3H4b1IxK/+4Y
# k374RuEcTLrS7VjIUSCCX36B64S7ZFonkhdM1M9eUU8b165Ms9cYkdyypJwe9epr
# YeIq+OHRCAOm1w70nN6vjp49cMlF05UcQI2h6OAInoSQC2Nf7hG90w4wfkfchv1a
# tzq2TMVtIhWi2ycEubzdoYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IMuxiSUMsf5LlW8k6cMgwFFOmes25cDCaGGRhTece0E3AgZfO+WMatQYEzIwMjAw
# ODIzMDQwMjUzLjkyOVowBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25z
# IFB1ZXJ0byBSaWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo3ODgwLUUzOTAt
# ODAxNDElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaCCDkQw
# ggT1MIID3aADAgECAhMzAAABKKAOgeE21U/CAAAAAAEoMA0GCSqGSIb3DQEBCwUA
# MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
# ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
# HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTIxOTAxMTUwMFoX
# DTIxMDMxNzAxMTUwMFowgc4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
# dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
# YXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNv
# MSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo3ODgwLUUzOTAtODAxNDElMCMGA1UE
# AxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEB
# BQADggEPADCCAQoCggEBAJ2Rsdb3VNuGPs2/Dgpc9gt77LG0JPkD4VWTlEJLkqzn
# TJl+RoZfiOwN6iWfPu4k/kj8nwY7pvLs1OsBy494yusg4rHLwHNUJPtw1Tc54MOL
# gdcosA4Nxki73fDyqWwDtjOdk6H7kNczBPqADD6B98ot77/wSACBJIxm9qAUudqu
# S5fczCF0++aWUavDu46U3cv6HEjIdV2ZdJTUKg4WUIdTYMQXI082+qSs45WBZjcK
# 98/tIfx8uq8q8ksWF9+zUjGTFiMaKHhn7cSCoEj7E1tVmW08ISpS678WFP2+A0OQ
# waWcJKNACK+J+La7Lz2bGupCidOGz5XDewc1lD9nLPcCAwEAAaOCARswggEXMB0G
# A1UdDgQWBBSE4vKD8X61N5vUAcNOdH9QBMum8jAfBgNVHSMEGDAWgBTVYzpcijGQ
# 80N7fEYbxTNoWoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jv
# c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0w
# MS5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
# Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNy
# dDAMBgNVHRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
# CwUAA4IBAQCLX2ZHGIULgDk/iccHWUywjDyAsBHlhkmtmBp4lldwL3dNo0bXZZHi
# SZB+c2KzvPqY64BlECjS/Pqur2m9UaT1N0BeUowRHQT88wdzd94gYqKXmLDbVR8y
# eVgBkcP/JiVWbXdQzcz1ETHgWrh+uzA8BwUgAaHJw+nXYccIuDgPJM1UTeNl9R5O
# vf+6zR2E5ZI4DrIqvS4jH4QsoMPTn27AjN7VZt4amoRxMLEcQAS7vPT1JUUaRFpF
# HmkUYVln1YMsw///6968aRvy3cmClS44uxkkaILbhh1h09ejZjHhrEn+k9McVkWi
# uY724jJ/57tylM7A/jzIWNj1F8VlhkyyMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAA
# AjANBgkqhkiG9w0BAQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEyMDAGA1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0
# aG9yaXR5IDIwMTAwHhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAxMjE0NjU1WjB8MQsw
# CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
# ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
# b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDCCASIwDQYJKoZIhvcNAQEBBQADggEP
# ADCCAQoCggEBAKkdDbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX77XxoSyxfxcPl
# YcJ2tz5mK1vwFVMnBDEfQRsalR3OCROOfGEwWbEwRA/xYIiEVEMM1024OAizQt2T
# rNZzMFcmgqNFDdDq9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0ySwcSmXdFh
# E24oxhr5hoC732H8RsEnHSRnEnIaIYqvS2SJUGKxXf13Hz3wV3WsvYpCTUBR0Q+c
# Bj5nf/VmwAOWRH7v0Ev9buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn
# 9NxkvaQBwSAJk3jN/LzAyURdXhacAQVPIk0CAwEAAaOCAeYwggHiMBAGCSsGAQQB
# gjcVAQQDAgEAMB0GA1UdDgQWBBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEE
# AYI3FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB
# /zAfBgNVHSMEGDAWgBTV9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEug
# SaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
# aWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsG
# AQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jv
# b0NlckF1dF8yMDEwLTA2LTIzLmNydDCBoAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEE
# AYI3LgMwgYEwPQYIKwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9Q
# S0kvZG9jcy9DUFMvZGVmYXVsdC5odG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcA
# YQBsAF8AUABvAGwAaQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZI
# hvcNAQELBQADggIBAAfmiFEN4sbgmD+BcQM9naOhIW+z66bM9TG+zwXiqf76V20Z
# MLPCxWbJat/15/B4vceoniXj+bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX
# /1z5Xhc1mCRWS3TvQhDIr79/xn/yN31aPxzymXlKkVIArzgPF/UveYFl2am1a+TH
# zvbKegBvSzBEJCI8z+0DpZaPWSm8tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnx
# zplmkIz/amJ/3cVKC5Em4jnsGUpxY517IW3DnKOiPPp/fZZqkHimbdLhnPkd/DjY
# lPTGpQqWhqS9nhquBEKDuLWAmyI4ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kW
# umGnEcua2A5HmoDF0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/nMQekkzr3
# ZUd46PioSKv33nJ+YWtvd6mBy6cJrDm77MbL2IK0cs0d9LiFAR6A+xuJKlQ5slva
# yA1VmXqHczsI5pgt6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnPGUFN4Ib5
# KpqjEWYw07t0MkvfY3v1mYovG8chr1m1rtxEPJdQcdeh0sVV42neV8HR3jDA/czm
# TfsNv11P6Z0eGTgvvM9YBS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkSoYIC
# 0jCCAjsCAQEwgfyhgdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
# aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
# cG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1ZXJ0byBS
# aWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo3ODgwLUUzOTAtODAxNDElMCMG
# A1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIa
# AxUAMT1LG/KAEj0XsiL9n7mxmX1afZuggYMwgYCkfjB8MQswCQYDVQQGEwJVUzET
# MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
# dGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0BAQUFAAIFAOLsUqMwIhgPMjAyMDA4MjMw
# NjI3NDdaGA8yMDIwMDgyNDA2Mjc0N1owdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA
# 4uxSowIBADAKAgEAAgIQLgIB/zAHAgEAAgIRlzAKAgUA4u2kIwIBADA2BgorBgEE
# AYRZCgQCMSgwJjAMBgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYag
# MA0GCSqGSIb3DQEBBQUAA4GBAFX6QEk5BpmvOWrhYzsRYJCzVGarY8OrDigZa6zS
# lBDuTnZU9A02L2iVYPaRhfOTC/aQJAXDm7XFb/gN1NOC2qXzTp00hcaenYE1tiWx
# DiHPTXNEnQ+6ogHSJSTee3+lG5veyvO6LqI7sIiMNwfNowh/oQmZPh5HOMUj/6ej
# Ari7MYIDDTCCAwkCAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAC
# EzMAAAEooA6B4TbVT8IAAAAAASgwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQg8sG5Ks95T1rKCaFx
# rW82FdI1q8nG49mIn+3t2zqSZdcwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCC8RWqLrwVSd+/cGxDfBqS4b1tPXhoPFrC615vV1ugU2jCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABKKAOgeE21U/CAAAAAAEoMCIE
# IKu3LANDj6g7/byri2vOJU5Ihv3XDJ6jB6uEWzEk3FREMA0GCSqGSIb3DQEBCwUA
# BIIBAGFIwwqAPr0UcS4jKyfmRziyGv3wk+rp5X6xtXdZf7R3mP8kfhYfAdAhcv8R
# cAIJRlSOrGdc1uBr2QEBI9q1htUDQXQydtAWyiTRx4b6onx6GNYiWQ2YoEOEBa3h
# iF0BHxWCN6ECUQNWd8hCj9RxIVqBgGL5+oq6tT129S/bAL/5NnSavVZLmZnMFcee
# 0pjYZ1DQTRZJ4cfO2OYWVK/JwOOkeQHel03zmu5KxUi0le8Otl2d7XqJG6UuJbJA
# L1RsC8he0BEexHKAqapr33ubF9xnpIgehd/06ZIskvuQMe4cG40trsWKQE2pe82T
# DuQuGws586S9k5J8JgLiG6tEgzc=
# SIG # End signature block
