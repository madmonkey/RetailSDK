<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

param(
    [string]$logFile = 'Update-RetailSelfServiceAuthData.log'
)

$ErrorActionPreference = 'Stop'

function Log-TimedMessage([string]$message)
{
    Write-Host ('{0}: {1}' -f (Get-Date -DisplayHint Time), $message)
}

function Create-XmlForSetupUtility(
    [string]$newUsername = $(Throw 'newUsername is required!'),
    [string]$newUserPassword = $(Throw 'newUserPassword is required!'),
    [string]$newSqlServerName = $(Throw 'newSqlServerName is required!'),
    [string]$newDatabaseName = $(Throw 'newDatabaseName is required!')
)
{
    $newEncodedPassword = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($newUserPassword))
    $methodInputXmlString = 
    @'
<?xml version="1.0" encoding="UTF-8"?>
<Configuration>
    <AuthServicingDetails>
        <NewSqlServerName>{0}</NewSqlServerName>
        <NewDatabaseName>{1}</NewDatabaseName>
        <NewUsername>{2}</NewUsername>
        <NewUserPassword>{3}</NewUserPassword>
    </AuthServicingDetails>
</Configuration>
'@  -f $newSqlServerName, $newDatabaseName, $newUsername, $newEncodedPassword

    return $methodInputXmlString
}

function Remove-ItemSafe(
    [string]$path
)
{
    if ($path -and (Test-Path -Path $path))
    {
        Remove-Item -Path $path -Force
    }
}

function Backup-AllAOSWebServiceFiles(
    [string]$backupFolderPath,
    [string]$websiteName,
    [string]$logFile
)
{
    Write-Log ('Backing up all AOS Service files to {0}.' -f $backupFolderPath) $logFile
    Backup-WebSite -Name $websiteName -BackupFolder $backupFolderPath
    Write-Log 'Backing up complete.' $logFile
}

function Update-AOSConfigFiles(
    [string]$AOSWebsitePhysicalPath = $(throw 'AOSWebsitePhysicalPath is required.'),
    [string]$oldRetailRTSAuthenticationCertificateThumbprint = $(throw 'oldRetailRTSAuthenticationCertificateThumbprint is required.'),
    [string]$newRetailRTSAuthenticationCertificateThumbprint = $(throw 'newRetailRTSAuthenticationCertificateThumbprint is required.'),
    [string]$logFile = $(throw 'logFile is required.')
)
{
    # Update wif.config
    $wifConfigPath = Join-Path -Path $AOSWebsitePhysicalPath -ChildPath 'wif.config'
    [xml]$wifConfigContent = Get-Content -Path $wifConfigPath

    $wifThumbprintNode = $wifConfigContent.'system.identityModel'.identityConfiguration.securityTokenHandlers.securityTokenHandlerConfiguration.issuerNameRegistry.authority |
                                                %{$_.keys.add} | where thumbprint -eq $oldRetailRTSAuthenticationCertificateThumbprint
    if ($wifThumbprintNode)
    {
        $wifThumbprintNode.thumbprint = $newRetailRTSAuthenticationCertificateThumbprint
    }

    $wifConfigContent.Save($wifConfigPath)
    Write-Log 'Successfully updated wif.config' $logFile
    
    # Update web.config
    $webConfigPath = Join-Path -Path $AOSWebsitePhysicalPath -ChildPath 'web.config'
    [xml]$webConfigContent = Get-Content -Path $webConfigPath

    $claimIssuerRestrictionsNode = $webConfigContent.configuration.claimIssuerRestrictions.issuerRestrictions.add | where name -eq $oldRetailRTSAuthenticationCertificateThumbprint
    if ($claimIssuerRestrictionsNode)
    {
        $claimIssuerRestrictionsNode.name = $newRetailRTSAuthenticationCertificateThumbprint
    }

    $appSettingsNode = $webConfigContent.configuration.appSettings.add | where key -eq 'Infrastructure.TrustedCertificates'
    $listOfThumbprints = $appSettingsNode.value -split ';'
    $newListOfThumbprints = @()

    foreach($thumbprint in $listOfThumbprints)
    {
        if ($thumbprint -eq $oldRetailRTSAuthenticationCertificateThumbprint)
        {
            $newListOfThumbprints += $newRetailRTSAuthenticationCertificateThumbprint
        }
        else
        {
            $newListOfThumbprints += $thumbprint
        }
    }

    $appSettingsNode.value = ($newListOfThumbprints -join ';')
    $webConfigContent.Save($webConfigPath)
    Write-Log 'Successfully updated web.config' $logFile
}

function Update-ChannelDbConnectionStringInAxDb(
    $parametersFromAosWebConfig = $(throw 'parametersFromAosWebConfig is required.'),
    [string]$AOSWebsitePhysicalPath = $(throw 'AOSWebsitePhysicalPath is required.'),
    [string]$AOSWebConfigFilePath = $(throw 'AOSWebConfigFilePath is required.'),
    [string]$newRetailDataSyncUser = $(throw 'newRetailDataSyncUser is required.'),
    [string]$newRetailDataSyncUserPassword = $(throw 'newRetailDataSyncUserPassword is required.'),
    [string]$channelDatabaseServerName = $(throw 'channelDatabaseServerName is required.'),
    [string]$channelDatabaseName = $(throw 'channelDatabaseName is required.'),
    [string]$inputXmlFilePath = $(throw 'inputXmlFilePath is required.'),
    [string]$logFile = $(throw 'logFile is required.')
)
{
    # Get file path to AX deployment setup utility and its config file.
    $AXDeploymentSetupUtilityFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $AOSWebsitePhysicalPath -UtilityFileName 'Microsoft.Dynamics.AX.Deployment.Setup.exe'
    Write-Log ('Microsoft.Dynamics.AX.Deployment.Setup.exe located at:{0}{1}' -f [System.Environment]::NewLine, $AXDeploymentSetupUtilityFilePath) -logFile $logFile

    $AXDeploymentUtilityConfigFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $AOSWebsitePhysicalPath -UtilityFileName 'Microsoft.Dynamics.AX.Deployment.Setup.exe.config'
    Write-Log ('Microsoft.Dynamics.AX.Deployment.Setup.exe.config located at:{0}{1}' -f [System.Environment]::NewLine, $AXDeploymentUtilityConfigFilePath) -logFile $logFile

    # Perform AX deployment setup utility config file update with appropriate azure storage connection string from aos web.config
    Update-AXDeploymentUtilityConfigFile -AOSWebConfigFilePath $AOSWebConfigFilePath -AXDeploymentUtilityConfigFilePath $AXDeploymentUtilityConfigFilePath -logFile $logFile

    $usePassedServerName = CheckIf-UserProvidedValidSqlServerData -sqlServerDataString $channelDatabaseServerName
    $usePassedDatabaseName = CheckIf-UserProvidedValidSqlServerData -sqlServerDataString $channelDatabaseName

    # Set the server name and/ or database name to empty string so that AX can recognize it as invalid data.
    if (!$usePassedServerName)
    {
        $channelDatabaseServerName = " "
    }
    if (!$usePassedDatabaseName)
    {
        $channelDatabaseName = " "
    }

    # Generate XML to pass down to AX deployment setup utility.
    $methodInputXmlString = Create-XmlForSetupUtility -newUsername $newRetailDataSyncUser `
                                                      -newUserPassword $newRetailDataSyncUserPassword `
                                                      -newSqlServerName $channelDatabaseServerName `
                                                      -newDatabaseName $channelDatabaseName

    # Save above XML to Temp File and return temp file location
    Set-Content -Value $methodInputXmlString -Path $inputXmlFilePath -Force
    Write-Log ('Saved method input xml to temp location: {0}' -f $inputXmlFilePath) -logFile $logFile

    # Call AX Deployment setup.
    Call-AXDeploymentSetupUtility -parametersFromAosWebConfig $parametersFromAosWebConfig `
                                  -methodInputXmlFilePath $inputXmlFilePath `
                                  -AXDeploymentSetupUtilityFilePath $AXDeploymentSetupUtilityFilePath `
                                  -className 'RetailServicingOrchestrator' `
                                  -methodName 'execute' `
                                  -LogFile $logFile
}

function Update-SQLDatabaseUserRoles(
    [boolean]$wereNewRetailDataSyncUserCredentialsSpecified,
    [boolean]$wereNewRetailRuntimeUserCredentialsSpecified,
    
    [string]$oldRetailDataSyncUser = $(throw 'oldRetailDataSyncUser is required.'),
    [string]$newRetailDataSyncUser = $(throw 'newRetailDataSyncUser is required.'),
    [string]$oldRetailRuntimeUser = $(throw 'oldRetailRuntimeUser is required.'),
    [string]$newRetailRuntimeUser = $(throw 'newRetailRuntimeUser is required.'),
    $parametersFromAosWebConfig = $(throw 'parametersFromAosWebConfig is required.'),
    [string]$logFile = $(throw 'logFile is required.')
)
{
    if ($wereNewRetailDataSyncUserCredentialsSpecified)
    {
        Write-Log ('Starting to copy database user roles from {0} to user {1}.' -f $oldRetailDataSyncUser, $newRetailDataSyncUser) -logFile $logFile
        Invoke-ScriptAndRedirectOutput `
                        -scriptBlock `
                        {
                            Copy-DatabaseUserRoles -copyRolesFromUser $oldRetailDataSyncUser `
                                                   -copyRolesToUser $newRetailDataSyncUser `
                                                   -sqlServerInstanceName $parametersFromAosWebConfig['AosDatabaseServer'] `
                                                   -databaseName $parametersFromAosWebConfig['AosDatabaseName'] `
                                                   -dbAccessUser $parametersFromAosWebConfig['AosDatabaseUser'] `
                                                   -dbAccessUserPassword $parametersFromAosWebConfig['AosDatabasePass']
                        } `
                        -logFile $logFile
                        

        Write-Log ('Database user role copy successful for user {0}.' -f $newRetailDataSyncUser) -logFile $logFile
    }

    if ($wereNewRetailRuntimeUserCredentialsSpecified)
    {
        Write-Log ('Starting to copy database user roles from {0} to user {1}.' -f $oldRetailRuntimeUser, $newRetailRuntimeUser) -logFile $logFile
        Invoke-ScriptAndRedirectOutput `
                        -scriptBlock `
                        {
                            Copy-DatabaseUserRoles -copyRolesFromUser $oldRetailRuntimeUser `
                                                   -copyRolesToUser $newRetailRuntimeUser `
                                                   -sqlServerInstanceName $parametersFromAosWebConfig['AosDatabaseServer'] `
                                                   -databaseName $parametersFromAosWebConfig['AosDatabaseName'] `
                                                   -dbAccessUser $parametersFromAosWebConfig['AosDatabaseUser'] `
                                                   -dbAccessUserPassword $parametersFromAosWebConfig['AosDatabasePass']
                        } `
                        -logFile $logFile

        Write-Log ('Database user role copy successful for user {0}.' -f $newRetailRuntimeUser) -logFile $logFile
    }
}

try
{
    $serviceModelName = 'RetailServer'
    $scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
    $packageRootPath = Split-Path -Path (Split-Path -Path $scriptDir -Parent) -Parent

    # Import all requisite modules.
    . $scriptDir\Common-Database.ps1

    Import-Module (Join-Path -Path $scriptDir -ChildPath 'Common-Servicing.psm1') -DisableNameChecking
    Import-Module (Join-Path -Path $scriptDir -ChildPath 'CommonRollbackUtilities.psm1') -DisableNameChecking

    Import-Module (Join-Path -Path $scriptDir -ChildPath 'SelfServiceConfiguration.psm1') -DisableNameChecking
    Load-RotationInfoModule -packageRootPath $packageRootPath

    # Step 1: Read rotationInfo
    $rotationInfo = Get-RotationInfo -serviceModelName $serviceModelName -packageRootPath $packageRootPath
    if ($rotationInfo -eq $null)
    {
        Write-Log ('Servicing template information not found for {0}. Skipping servicing.' -f $serviceModelName) $logFile
        exit 0
    }

    $rotationInfoDecryptor = Get-RotationInfoDecryptor -rotationInfo $rotationInfo

    # Read all required certificate thumbprints
    $newRetailRTSAuthenticationCertificateThumbprint = GetValueFor-CertificateThumbprintWithKey -key 'NewRetailRTSAuthenticationCertificate' -rotationInfo $rotationInfo
    $oldRetailRTSAuthenticationCertificateThumbprint = GetValueFor-CertificateThumbprintWithKey -key 'OldRetailRTSAuthenticationCertificate' -rotationInfo $rotationInfo

    # Check to validate certificate status
    $isNewRTSAuthenticationCertTargettedForInstallation = $false
    if ($newRetailRTSAuthenticationCertificateThumbprint)
    {
        $isNewRTSAuthenticationCertTargettedForInstallation = $rotationInfo.Certificates.Thumbprint.Contains($newRetailRTSAuthenticationCertificateThumbprint)
    }

    # Read all the key value pairs from the rotation template.
    $oldRetailDataSyncUser         = GetValueFor-KeyValuePairWithKey -key 'OldRetailDataSyncUser.Username' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor
    $oldRetailRuntimeUser          = GetValueFor-KeyValuePairWithKey -key 'OldRetailRuntimeUser.Username' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor

    $newRetailDataSyncUser         = GetValueFor-KeyValuePairWithKey -key 'NewRetailDataSyncUser.Username' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor
    $newRetailDataSyncUserPassword = GetValueFor-KeyValuePairWithKey -key 'NewRetailDataSyncUser.Password' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor
    $newRetailRuntimeUser          = GetValueFor-KeyValuePairWithKey -key 'NewRetailRuntimeUser.Username' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor

    $channelDatabaseServerName     = GetValueFor-KeyValuePairWithKey -key 'ChannelDatabaseServerName' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor
    $channelDatabaseName           = GetValueFor-KeyValuePairWithKey -key 'ChannelDatabaseName' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor

    $wereNewRetailDataSyncUserCredentialsSpecified = CheckIf-UserProvidedValidCredentialData -credentialString $newRetailDataSyncUser
    $wereOldRetailDataSyncUserCredentialsSpecified = CheckIf-UserProvidedValidCredentialData -credentialString $oldRetailDataSyncUser
    $wereNewRetailRuntimeUserCredentialsSpecified  = CheckIf-UserProvidedValidCredentialData -credentialString $newRetailRuntimeUser
    $wereOldRetailRuntimeUserCredentialsSpecified  = CheckIf-UserProvidedValidCredentialData -credentialString $oldRetailRuntimeUser
    
    # Step 2: Check if user provided any new RetailDataSyncUser or RetailRuntimeUser
    if (-not($wereNewRetailDataSyncUserCredentialsSpecified -or $wereNewRetailRuntimeUserCredentialsSpecified -or $isNewRTSAuthenticationCertTargettedForInstallation))
    {
        Write-Log 'No updatable data was provided. Skipping update.' -logFile $logFile
        exit 0
    }

    # Step 3 : Perform all required credential and certificate validations.
    if ($wereNewRetailDataSyncUserCredentialsSpecified -and (-not($wereOldRetailDataSyncUserCredentialsSpecified)))
    {
        throw 'Old Retail DataSyncUser has not been specified.'
    }

    if ($wereNewRetailRuntimeUserCredentialsSpecified -and (-not($wereOldRetailRuntimeUserCredentialsSpecified)))
    {
        throw 'Old Retail RuntimeUser has not been specified.'
    }

    if ($isNewRTSAuthenticationCertTargettedForInstallation -and (-not($oldRetailRTSAuthenticationCertificateThumbprint)))
    {
        throw 'OldRetailRTSAuthenticationCertificate thumbprint has not been specified.' 
    }

    # Step 4 : Update database roles for new user.
    # Step 4.1 : We need to read AOS web.config to get requisite data.
    # Derive AOS web config file path.
    $AOSWebsitePhysicalPath = Get-WebsitePhysicalPath -webSiteName (Get-AOSWebsiteName)
    $AOSWebConfigFilePath   = Get-AOSWebConfigFilePath -AOSWebsitePhysicalPath $AOSWebsitePhysicalPath
    Write-Log ('AOS web.config located at:{0}{1}' -f [System.Environment]::NewLine, $AOSWebConfigFilePath) -logFile $logFile

    # Get all the parameters from Aos web.config required to update sql database roles AND run AX deployment setup utility.
    $parametersFromAosWebConfig = Get-RequisiteParametersFromAosWebConfig -AOSWebConfigFilePath $AOSWebConfigFilePath

    # Step 4.2 : Update sql database role updates.
    Update-SQLDatabaseUserRoles -wereNewRetailDataSyncUserCredentialsSpecified $wereNewRetailDataSyncUserCredentialsSpecified `
                                -wereNewRetailRuntimeUserCredentialsSpecified $wereNewRetailRuntimeUserCredentialsSpecified `
                                -oldRetailDataSyncUser $oldRetailDataSyncUser `
                                -newRetailDataSyncUser $newRetailDataSyncUser `
                                -oldRetailRuntimeUser $oldRetailRuntimeUser `
                                -newRetailRuntimeUser $newRetailRuntimeUser `
                                -parametersFromAosWebConfig $parametersFromAosWebConfig `
                                -logFile $logFile

    # Step 5: Update AOS web.config and wif.config with updated RTS authentication certificate thumbprint
    if ($isNewRTSAuthenticationCertTargettedForInstallation)
    {
        # Backup web.config and wif.config before making any changes.
        Write-Log ('Backing up any files which might be modified to {0}.' -f $backupFolderPath) $logFile

        #Note: $RunbookBackupFolder variable is populated directly from runbook.
        Backup-AllAOSWebServiceFiles -backupFolderPath $RunbookBackupFolder -websiteName (Get-AOSWebsiteName) -logFile $logFile

        # Update wif.config and web.config
        Update-AOSConfigFiles -AOSWebsitePhysicalPath $AOSWebsitePhysicalPath `
                              -oldRetailRTSAuthenticationCertificateThumbprint $oldRetailRTSAuthenticationCertificateThumbprint `
                              -newRetailRTSAuthenticationCertificateThumbprint $newRetailRTSAuthenticationCertificateThumbprint `
                              -logFile $logFile
    }

    # Step 6: If new RetailDataSyncUser credentials are provided, then update channel database data in AxDB.
    $methodInputXmlFilePath = [System.IO.Path]::GetTempFileName()
    if ($wereNewRetailDataSyncUserCredentialsSpecified)
    {
        Update-ChannelDbConnectionStringInAxDb -parametersFromAosWebConfig $parametersFromAosWebConfig `
                                               -AOSWebsitePhysicalPath $AOSWebsitePhysicalPath `
                                               -AOSWebConfigFilePath $AOSWebConfigFilePath `
                                               -newRetailDataSyncUser $newRetailDataSyncUser `
                                               -newRetailDataSyncUserPassword $newRetailDataSyncUserPassword `
                                               -channelDatabaseServerName $channelDatabaseServerName `
                                               -channelDatabaseName $channelDatabaseName `
                                               -inputXmlFilePath $methodInputXmlFilePath `
                                               -logFile $logFile
    }

    Write-Log 'Retail SelfService authentication data update complete.' -logFile $logFile
}
catch
{
    Write-Log ($global:error[0] | Format-List * -Force | Out-String -Width 4096) -logFile $logFile
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine

    # RollBackChanges
    Write-Log 'Rolling back changes. Replacing files from the backup folder if any.' -logFile $logFile
    #Note: $RunbookBackupFolder variable is populated directly from runbook.
    Restore-WebSite -Name (Get-AOSWebsiteName) -BackupFolder $RunbookBackupFolder
    
    # Set a non-zero unique exit code for Update-RetailSelfServiceAuthData.ps1 failure
    $exitCode = 27003
    Write-Log ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine) -logFile $logFile
    exit $exitCode
}
finally
{
    Remove-ItemSafe -path $methodInputXmlFilePath
}
# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCD3T3RndR45mEx7
# TAG0/2jznZr5lC/wADboOqkS54D1PKCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# cVZOSEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFdUwghXRAgEBMIGVMH4x
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01p
# Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAAGIr1LWuZJt6PkAAAAA
# AYgwDQYJYIZIAWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEE
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBQ
# O2mLBBW7rSB7+RAvZpu31Dtpm9ep/S8fE5JsU3y9CzCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAT
# 4x1gap3T5SrmaBnmOCogr5Vu8HSCH2gC2dBGnB+0yQuLyypztW7s4xFvgC/l4exn
# SCOTq8x6P0WsVl+zZZ29+oHnmm4m5fBwIk+aCuQlkRYXFavV28F6fXbwLsLGqX4n
# st5MASxLUEHMFQfpYq5PwD286c9kpOaw5I6vz3AsCPXrPyNpLdHLK/tJWT1JG+n+
# UInEluKF86PSaX8CCh3d77ae0oYCecD3qEXiuFMpL+IiOpVXM/m4K0ll9WAAKt6T
# 5RpJ7OBM9B9Af5vnRIFKcr1UtI0D7kvzU2/KV9X54hEs9WEt3M0WkKmoXGDJJgUJ
# JHIoJ4+xjK2lXPrlhucLoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IHsv7j6NYT6C/G6KX4XIOJQUzxXmqSn/teYRqiBN7pUFAgZfPS1I03YYEzIwMjAw
# ODIzMDQwMjQ4Ljk3M1owBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
# VQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25z
# IExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjA4NDItNEJFNi1DMjlB
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOPDCCBPEw
# ggPZoAMCAQICEzMAAAEJfoK9HnvTYSIAAAAAAQkwDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTE0WhcNMjEw
# MTIxMjMxOTE0WjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
# BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UE
# CxMdVGhhbGVzIFRTUyBFU046MDg0Mi00QkU2LUMyOUExJTAjBgNVBAMTHE1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQC4wyEQZQIHGgkuQ/1UnrdT7jela35bXCpB9jYSlc+bFiXDs1LLX1Z7
# 9nkL4ZUfj+wtOrN7OyEqXV2fgiwdi0uZ/W31ozc6OTcY3gF+yGp0ZPTCA463zSdB
# CSpHpGG6c7XyYXig8cRPQuO7Rv5dFpxpPlDypMty1+OlgFcZUYoMSQabW4QUu87y
# M3hZ7MTuTLZsuKx7+dDzJxIAbGwecCNSsPd0D2zE/WwR+LCInse+4UFrrYYPwJKs
# PMifO3UvmCF7Ld/rmyLQbGdrR6xwXMmzc4HBBOT5wyta6Op0CYdnUensxOJ/qgEN
# w/fNTWPXfggms8DLsOJthTYrG2QkDSr3AgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
# paSSc0yDQvxCcYjn1KjvNj9uSUYwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8Uz
# aFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
# L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoG
# CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
# Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
# AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEA
# OFiHA4sHR0uQEq6TTC5G/8luBryoOQ+kFuJU5iXATSXe0BrdSVzlKq3qkE6EHvrc
# XFgzl1KHLFi2bgsh8JiPlDLHfLmfTkFNxLEHr35MFTPwa9J3U4afrCk7aYsYIE0J
# siDF3+RY24HHh6Sw0njIQ1K8yH5PC5+evkj+lh5k6mhQf472m8Vc/fLPPtOsdyec
# zOEw5citXv1zUINJWwHy2m3eQl6ulxA3sgYpAzdm+NQtf/oi0yQ6QmkQSmd+rpbg
# k6tqi1j/iOg0ECRmmK0wtvfaEvjwxU67Ykxwyg188kRLhAAz6d7/S/FGrq+v07zC
# VJxxr0ZEoCtaTFl7zJ/qaDCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZI
# hvcNAQELBQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
# DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
# MjAwBgNVBAMTKU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eSAy
# MDEwMB4XDTEwMDcwMTIxMzY1NVoXDTI1MDcwMTIxNDY1NVowfDELMAkGA1UEBhMC
# VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
# BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRp
# bWUtU3RhbXAgUENBIDIwMTAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
# AQCpHQ28dxGKOiDs/BOX9fp/aZRrdFQQ1aUKAIKF++18aEssX8XD5WHCdrc+Zitb
# 8BVTJwQxH0EbGpUdzgkTjnxhMFmxMEQP8WCIhFRDDNdNuDgIs0Ldk6zWczBXJoKj
# RQ3Q6vVHgc2/JGAyWGBG8lhHhjKEHnRhZ5FfgVSxz5NMksHEpl3RYRNuKMYa+YaA
# u99h/EbBJx0kZxJyGiGKr0tkiVBisV39dx898Fd1rL2KQk1AUdEPnAY+Z3/1ZsAD
# lkR+79BL/W7lmsqxqPJ6Kgox8NpOBpG2iAg16HgcsOmZzTznL0S6p/TcZL2kAcEg
# CZN4zfy8wMlEXV4WnAEFTyJNAgMBAAGjggHmMIIB4jAQBgkrBgEEAYI3FQEEAwIB
# ADAdBgNVHQ4EFgQU1WM6XIoxkPNDe3xGG8UzaFqFbVUwGQYJKwYBBAGCNxQCBAwe
# CgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHwYDVR0j
# BBgwFoAU1fZWy4/oolxiaNE9lJBb186aGMQwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0
# cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWljUm9vQ2Vy
# QXV0XzIwMTAtMDYtMjMuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+
# aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNSb29DZXJBdXRf
# MjAxMC0wNi0yMy5jcnQwgaAGA1UdIAEB/wSBlTCBkjCBjwYJKwYBBAGCNy4DMIGB
# MD0GCCsGAQUFBwIBFjFodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vUEtJL2RvY3Mv
# Q1BTL2RlZmF1bHQuaHRtMEAGCCsGAQUFBwICMDQeMiAdAEwAZQBnAGEAbABfAFAA
# bwBsAGkAYwB5AF8AUwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3DQEBCwUA
# A4ICAQAH5ohRDeLG4Jg/gXEDPZ2joSFvs+umzPUxvs8F4qn++ldtGTCzwsVmyWrf
# 9efweL3HqJ4l4/m87WtUVwgrUYJEEvu5U4zM9GASinbMQEBBm9xcF/9c+V4XNZgk
# Vkt070IQyK+/f8Z/8jd9Wj8c8pl5SpFSAK84Dxf1L3mBZdmptWvkx872ynoAb0sw
# RCQiPM/tA6WWj1kpvLb9BOFwnzJKJ/1Vry/+tuWOM7tiX5rbV0Dp8c6ZZpCM/2pi
# f93FSguRJuI57BlKcWOdeyFtw5yjojz6f32WapB4pm3S4Zz5Hfw42JT0xqUKloak
# vZ4argRCg7i1gJsiOCC1JeVk7Pf0v35jWSUPei45V3aicaoGig+JFrphpxHLmtgO
# R5qAxdDNp9DvfYPw4TtxCd9ddJgiCGHasFAeb73x4QDf5zEHpJM692VHeOj4qEir
# 995yfmFrb3epgcunCaw5u+zGy9iCtHLNHfS4hQEegPsbiSpUObJb2sgNVZl6h3M7
# COaYLeqN4DMuEin1wC9UJyH3yKxO2ii4sanblrKnQqLJzxlBTeCG+SqaoxFmMNO7
# dDJL32N79ZmKLxvHIa9Zta7cRDyXUHHXodLFVeNp3lfB0d4wwP3M5k37Db9dT+md
# Hhk4L7zPWAUu7w2gUDXa7wknHNWzfjUeCLraNtvTX4/edIhJEqGCAs4wggI3AgEB
# MIH4oYHQpIHNMIHKMQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNVBAcT
# B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsGA1UE
# CxMkTWljcm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
# Ex1UaGFsZXMgVFNTIEVTTjowODQyLTRCRTYtQzI5QTElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUACsG8ux1nIgl0
# fkctgBa2jzpieACggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
# MDANBgkqhkiG9w0BAQUFAAIFAOLsSOswIhgPMjAyMDA4MjMwOTQ2MTlaGA8yMDIw
# MDgyNDA5NDYxOVowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA4uxI6wIBADAKAgEA
# AgIcwwIB/zAHAgEAAgIRzDAKAgUA4u2aawIBADA2BgorBgEEAYRZCgQCMSgwJjAM
# BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEB
# BQUAA4GBACk864kO2oACzlWE8RFsxYyeUCjKJY8FLwqXGhDHRh4kwL5AsM8Xmp7i
# fWHoK1atYhnw30iy5HDu/0Gzoq/2+yXUAkcNjHFLNwyiUP4FR6nEq/Qwo4BoyOG3
# CXvvzTlEPZg5Gs/+mmZj4laUpcG4bFVAYkx0cgaPnWr1ENyjCZ66MYIDDTCCAwkC
# AQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
# A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEJfoK9HnvT
# YSIAAAAAAQkwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQg2HmvB1/Ug+/kP0jpkGO7eU+T8bLvQQGU
# djhreQSJM3AwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCCCVPhhBhtKMjxi
# E2/c3YdDcB3+1eTbswVjXf+epZ1SjzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABCX6CvR5702EiAAAAAAEJMCIEIBjmRjwTerYai/wZ
# tkGQOCOhb1wZicFe6Gbg2GhN5HYlMA0GCSqGSIb3DQEBCwUABIIBAH6hHGxQtNwK
# Cj+thxLvXANhbtrKGCPM96Adlg5P+fNiVxqN6XHVGCP00LV7EBPj47bTqf/L/GZM
# 0Z8YY1Y9DkcdkWooYjDygT8kEpklVZJF0MTKxwUsUF74yHodi3kOjsw811LlfDCo
# z2d+mjriQNQXZn07QRmL4I+UhgxPzHdZpxkdSF4btkip9X7+WP/QUYhQJZXzKip9
# QSEupgS8xulbEesMrh7wOuVEw1rW1SFJ/7hJshF4xvqqL+HrSt9QNkgqVU2VJhLX
# Sv4g5jWjM8x47ziAeQ+uYGe3sBF9ZDja9MtLzc1ncKOj3RRuu84mOuEssp6ZhUJT
# PyVKKkt6enY=
# SIG # End signature block
