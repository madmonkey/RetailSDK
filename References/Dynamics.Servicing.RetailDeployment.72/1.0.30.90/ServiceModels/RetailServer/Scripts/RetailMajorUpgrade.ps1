<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

param(
    [string]$aosWebsiteName = 'AOSService',
    [string]$retailServerWebsiteName = 'RetailServer',
    [string]$retailCloudPosWebsiteName = 'RetailCloudPos',
    [string]$targetDataGroupName = 'Default',
    [string]$targetDataGroupDescription = 'Default data group',
    [string]$targetDatabaseProfileName = 'Default',
    [string]$targetRetailChannelProfileName = 'Default',
    [string]$targetRtsProfileName = 'Default',
    [string]$logFile = 'RetailMajorVersionUpgrade.log'
)

$axBatchServiceStartTypeSnapshot = $null
$currentLocationSnapshot = Get-Location
try
{
    $ErrorActionPreference = 'Stop'
        
    $scriptDir = Split-Path -parent $PSCommandPath
    $rootDir = Split-Path -parent $scriptDir

    . "$scriptDir\Common-Configuration.ps1"
    . "$scriptDir\Common-Web.ps1"
    . "$scriptDir\Common-Upgrade.ps1"

    Import-Module (Join-Path -Path $scriptDir -ChildPath 'Common-Servicing.psm1') -DisableNameChecking
    Import-Module (Join-Path -Path $scriptDir -ChildPath 'CommonRollbackUtilities.psm1') -DisableNameChecking
    Import-Module (Join-Path -Path $scriptDir -ChildPath 'SelfServiceConfiguration.psm1') -DisableNameChecking

    Log-TimedMessage "Major version Upgrade: Updating Retail environment data..."

    $retailServerWebSite = Get-WebSiteSafe -Name $retailServerWebsiteName
    
    if($retailServerWebSite -eq $null)
    {
        throw "$retailServerWebsiteName doesn't exist."
    }
    
    Decrypt-WebConfigSection -webConfigSection "connectionStrings" -websiteId $retailServerWebSite.Id -logFile $logFile
    
    $retailServerWebsitePhysicalPath = $retailServerWebSite.physicalPath
    $retailServerWebConfigFilePath = (Join-Path $retailServerWebsitePhysicalPath 'web.config')
    Decrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigFilePath
    
    [xml]$retailServerWebConfigDoc = Get-Content -Path $retailServerWebConfigFilePath
    
    $IsDbCredentialInWebConfig = Get-UseDatabaseCredentialInWebConfigForUpgrade
    if($IsDbCredentialInWebConfig)
    {
        Write-Output "Servicing information has been migrated to web.config, extract it from web.config"
        $websiteConnectionStringSettings = Get-AxDatabaseUserFromWebConfig -webConfig $retailServerWebConfigDoc -dbUserKey 'DataAccess.AxAdminSqlUser' -dbUserPasswordKey 'DataAccess.AxAdminSqlPwd'
        $deployDbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSettings
    
        # Check existence of axdeployextuser, if not present, fall back to use axdeployuser as replacement.
        $appSettingSqlUserElement = $retailServerWebConfigDoc.SelectSingleNode("/configuration/appSettings/add[@key='DataAccess.SqlUser']")
        
        if($appSettingSqlUserElement -ne $null)
        {
            Write-Output "Information about axdeployextuser doesn't present, use axdeployuser as replacement."
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
        Write-Output "Servicing information has NOT been migrated to web.config, extract it from registry"
        try
        {
            $websiteConnectionStringSettings = (Get-ChannelDbServicingDataFromRegistry)
            $deployDbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSettings

            # Check existence of axdeployextuser, if not present, fall back to use axdeployuser as replacement.
            if(Test-Path -Path Get-ChannelDbExtUserRegistryPath)
            {
                Write-Output "Information about axdeployextuser doesn't present, use axdeployuser as replacement."
               $extUserConnectionStringSettings = Get-ServicingDataFromRegistry -registryPath (Get-ChannelDbExtUserRegistryPath)
               $extUserSetting = Create-WebSiteDBConfiguration -connectionString $extUserConnectionStringSettings
            }
            else
            {
               $extUserSetting = $deployDbSetting
            }
            
            Write-Output "Migrating servicing information from registry to web.config."
            Update-ChannelDatabaseConfigLocation -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigFilePath
        }
        catch
        {
            # log detailed error message for trouble shooting.
            Log-TimedMessage ($global:error[0] | format-list * -f | Out-String)
            $ScriptLine = $MyInvocation.MyCommand.Path.ToString()
            $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: $($_.ToString()) Value: $($PSBoundParameters[$_.ToString()])"}
            Log-TimedMessage "Executed:$([System.Environment]::NewLine)$ScriptLine$([System.Environment]::NewLine)Exiting with error code $exitCode."
            
            throw "Retail servicing data in registry is corrupted, please update it and try again. Detail instructions is avaiable here: https://microsoft.sharepoint.com/:o:/r/teams/AXServiceOps/_layouts/15/WopiFrame.aspx?sourcedoc={ae57632e-2f94-415f-ab2a-3625cdc42ca6}&action=edit&wd=target%28Troubleshooting%20Guide%2Eone%7C6301B9E7%2D0E72%2D43CF%2DB29A%2DD2F076D3F2D6%2FUpdate%20Retail%20Servicing%20Data%20for%20JIT%7CA53DADEA%2DF544%2D4ADC%2D916D%2D6EBB9A633F31%2F%29onenote%3Ahttps%3A%2F%2Fmicrosoft%2Esharepoint%2Ecom%2Fteams%2FAXServiceOps%2FShared%20Documents%2FOperations%20Handbook%2FFeature%20guide%2FRetail%2FTroubleshooting%20Guide%2Eone#Update%20Retail%20Servicing%20Data%20for%20JIT&section-id={6301B9E7-0E72-43CF-B29A-D2F076D3F2D6}&page-id={A53DADEA-F544-4ADC-916D-6EBB9A633F31}&end."
        }
    }

    $retailChannelDBConnectionString = $retailServerWebConfigDoc.SelectSingleNode("/configuration/connectionStrings/add[@name='StorageLookupDatabase']").connectionString
    $channelDbSetting = Create-WebSiteDBConfiguration -connectionString $retailChannelDBConnectionString   

    [hashtable]$settings = @{}
    
    $settings.DataGroupName = $targetDataGroupName
    $settings.DataGroupDescription = $targetDataGroupDescription
    $settings.DatabaseProfileName = $targetDatabaseProfileName
    $settings.RetailChannelProfileName = $targetRetailChannelProfileName
    $settings.RtsProfileId = $targetRtsProfileName
    
    $settings.AosDatabaseServer = $deployDbSetting.server
    $settings.AosDatabaseName = $deployDbSetting.database
    $settings.AosDatabaseUser = $deployDbSetting.sqlUserName
    $settings.AosDatabasePass = $deployDbSetting.sqlUserPassword
    $settings.AosDeploymentDatabaseUser = $deployDbSetting.sqlUserName
    $settings.AosDeploymentDatabasePass = $deployDbSetting.sqlUserPassword
    $settings.ChannelDatabaseServer = $channelDbSetting.server
    $settings.ChannelDatabaseName = $channelDbSetting.database
    $settings.ChannelDatabaseUser = $channelDbSetting.sqlUserName
    $settings.ChannelDatabasePass = $channelDbSetting.sqlUserPassword
    $settings.ChannelDatabaseDataSyncUser = 'axretaildatasyncuser'
    $settings.ChannelDatabaseDataSyncPass = $channelDbSetting.sqlUserPassword
    $settings.DisableDBServerCertificateValidation = $channelDbSetting.trustservercertificate

    $settings.AxDbServer = $deployDbSetting.server
    $settings.AxDbName = $deployDbSetting.database
    $settings.AxDbDeploySqlUser = $deployDbSetting.sqlUserName
    $settings.AxDbDeploySqlPwd = $deployDbSetting.sqlUserPassword
    $settings.dbUser = $channelDbSetting.sqlUserName
    $settings.dbPassword = $channelDbSetting.sqlUserPassword
    $settings.dataSyncDbUser = 'axretaildatasyncuser'
    $settings.dataSyncDbUserPassword = $channelDbSetting.sqlUserPassword
    $settings.AxDeployExtUser = $extUserSetting.sqlUserName
    $settings.AxDeployExtUserPassword = $extUserSetting.sqlUserPassword

    $settings.EnvironmentId = $retailServerWebConfigDoc.configuration.environment.id
    $settings.TenantId = $retailServerWebConfigDoc.configuration.environment.tenant.id

    $AosSoapUrl = (Get-AosSoapUrl -aosWebsiteName $aosWebsiteName)
    $AosSoapUrl = $AosSoapUrl.trimEnd('/')
    $settings.AosWebsiteName = $aosWebsiteName
    $settings.AosSoapUrl = $AosSoapUrl
    $settings.AosUrl = (Get-AosUrl -aosWebsiteName $aosWebsiteName)
    $settings.RetailServerUrlValue = ([array](Get-WebSiteBindingUrls -websiteName $retailServerWebsiteName))[0]
    $settings.RetailServerUrl = $settings.RetailServerUrlValue
    $settings.CloudPOSUrl = (Get-WebSiteBindingUrls -websiteName $retailCloudPosWebsiteName | Select-Object -first 1 )
    

    
    # Derive AOS web config file path.
    $aosWebsite = Get-WebSiteSafe -Name $aosWebsiteName
    $aosWebsitePhysicalPath = $aosWebsite.physicalPath
    $aosWebConfigFilePath = (Join-Path $aosWebsitePhysicalPath 'web.config')
    Log-TimedMessage "AOS web.config located at: $aosWebConfigFilePath"

    Configure-AxDeploymentUtility -aosWebConfigFilePath $aosWebConfigFilePath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath

    # Get file path to AX deployment setup utility and its config file.
    $AXDeploymentSetupUtilityFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath -UtilityFileName $AxDeploymentSetUpExeName
    Log-TimedMessage "$AxDeploymentSetUpExeName located at:$AXDeploymentSetupUtilityFilePath"

    $aosWebConfigContent = [xml](Get-Content -Path $aosWebConfigFilePath)
    $settings.IdentityProvider = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Provisioning.AdminIdentityProvider'
    
    $aadRealm = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Aad.Realm'
    if ($aadRealm -eq $null)
    {
        throw 'Cound not read aadRealm from AOS web.config'
    }
    
    $settings.AudienceUrn = $aadRealm
    
    $AosAdminUserId = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Provisioning.AdminPrincipalName'
    if ($AosAdminUserId -eq $null)
    {
        throw 'Cound not read Provisioning.AdminPrincipalName from AOS web.config'
    }
    $settings.AosAdminUserId = $AosAdminUserId
    
    $aadLoginWsfedEndpointFormat = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Aad.AADLoginWsfedEndpointFormat'
    $aadLoginUrlFormat = $aadLoginWsfedEndpointFormat -replace "/wsfed", ""
    $adminPrincipalDomain = ($AosAdminUserId -split '@')[1]
    $settings.AzureAuthority = $aadLoginUrlFormat -f $adminPrincipalDomain

    $selfServiceLocationRegistryPath = 'HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailSelfService\Servicing'
    $settings.EnvironmentId = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'EnvironmentId'
    $settings.ClientAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'ClientAppInsightsInstrumentationKey'
    $settings.HardwareStationAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'HardwareStationAppInsightsInstrumentationKey'
    $settings.CloudPosAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'CloudPosAppInsightsInstrumentationKey'
    $settings.RetailServerAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'RetailServerAppInsightsInstrumentationKey'
    $settings.AsyncClientAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'AsyncClientAppInsightsInstrumentationKey'
    $settings.WindowsPhoneAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'WindowsPhoneAppInsightsInstrumentationKey'
    $settings.AsyncServerConnectorServiceAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'AsyncServerConnectorServiceAppInsightsInstrumentationKey'
    $settings.RealtimeServiceAX63AppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'RealtimeServiceAX63AppInsightsInstrumentationKey'
    $settings.RetailSideloadingKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'RetailSideloadingKey'

    $settings.UserId = 'RetailServerSystemAccount@dynamics.com'

    $settings.RetailServerUrl = "$($settings.RetailServerUrlValue)/Commerce"
    $settings.MediaServerUrl = "$($settings.RetailServerUrlValue)/MediaServer"
    
    $configForDbUpgrade = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $settings)))

    # Populate Retail Channel Db Schema
    Log-TimedMessage 'Populate Retail Channel Db Schema'
    & (Join-Path $rootDir 'Scripts\ApplyRetailDBScriptInSQLSURetailSchema.ps1') -config $configForDbUpgrade -log $logFile

    Log-TimedMessage 'Update roles for retail database users.'
    $retailUsersToEnsure = @{'axdeployuser' = 'db_owner';
                            'axretailruntimeuser' = @('UsersRole', 'ReportUsersRole');
                            'axretaildatasyncuser' = 'DataSyncUsersRole';
                            'axdeployextuser' = 'DeployExtensibilityRole'}
    foreach($user in $retailUsersToEnsure.Keys)
    {
        $retailUsersToEnsure[$user] | ForEach {
            $query = "
                    IF EXISTS (select * from sys.database_principals where type = 'S' and name = '$user')
                    BEGIN
                        IF EXISTS (select * from sys.database_principals where type = 'R' and name = '$_')
                        BEGIN
                            EXEC sp_addrolemember '$_', '$user'
                        END
                    END"

            Log-TimedMessage ("Assign role to user $user with query $query")
            try
            {
                Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                              -Database $settings.AosDatabaseName `
                              -Username $settings.AosDatabaseUser `
                              -Password $settings.AosDatabasePass `
                              -Query $query -ErrorAction Stop
            }
            catch
            {
                $errorMsg = "Error when trying to assign role $_ to user $user"
                $errorMsg += ($global:error[0] | format-list * -f | Out-String)
                $PSBoundParameters.Keys | % { $errorMsg += "Parameter: {0} Value: {1}{2}" -f $_.ToString(), $PSBoundParameters[$_.ToString()], [System.Environment]::NewLine}
                Log-TimedMessage $errorMsg
                throw $errorMsg
            }
        }
    }
    
    # Restart batch service
    $axBatchService = Get-Service 'DynamicsAxBatch'
    $axBatchServiceStartTypeSnapshot = $axBatchService.StartType

    if($axBatchServiceStartTypeSnapshot -eq 'Disabled')
    {
        Write-Output "DynamicsAxBatch is disabled, enabling it."
        Set-Service $axBatchService.Name -StartupType Automatic
    }

    Restart-Service $axBatchService.Name

    # Before we execute the X++ portion of the upgrade, we have to make sure Change Tracking is enabled for the database
    # because RetailServicingOrchestrator executes actions (e.g. regenerate seed data, which require change tracking to be enabled)
    $changeTrackingSqlQuery = "
    IF NOT EXISTS (SELECT * FROM sys.change_tracking_databases WHERE database_id=DB_ID('$($settings.AosDatabaseName)'))
    BEGIN
        print 'Enabling Change Tracking for database ''$($settings.AosDatabaseName)'''
        ALTER DATABASE [$($settings.AosDatabaseName)] SET CHANGE_TRACKING = ON (CHANGE_RETENTION = 6 DAYS, AUTO_CLEANUP = ON)
    END
    ELSE
    BEGIN
        print 'Change tracking already enabled for database ''$($settings.AosDatabaseName)'''
        
    END"

    try
    {
        Log-TimedMessage "Checking/enabling change tracking prior to running RetailServicingOrchestrator portion"
        Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                      -Database $settings.AosDatabaseName `
                      -Username $settings.AosDatabaseUser `
                      -Password $settings.AosDatabasePass `
                      -Query $changeTrackingSqlQuery -ErrorAction Stop
        Log-TimedMessage "Change tracking check/update done"
    }
    catch
    {
        $errorMsg = "Error when ensuring SQL Change tracking was enabled for database $($settings.AosDatabaseName) in server $($settings.AosDatabaseServer)"
        $errorMsg += ($global:error[0] | format-list * -f | Out-String)
        $errorMsg += $PSBoundParameters.Keys | % { "Parameter: $($_.ToString()) Value: $($PSBoundParameters[$_.ToString()]) $([System.Environment]::NewLine)"}
        Log-TimedMessage $errorMsg
        throw $errorMsg
    }



    # Run Retail Servicing code for major version upgrade
    $methodInputXmlFilePath = [System.IO.Path]::GetTempFileName();

    Write-Output "Method input xml file is located in $methodInputXmlFilePath"

    $configureAsyncServiceSection =
    "<ConfigureAsyncService>
            <ChannelDatabaseServer>$($settings.ChannelDatabaseServer)</ChannelDatabaseServer>
            <ChannelDatabaseName>$($settings.ChannelDatabaseName)</ChannelDatabaseName>
            <ChannelDatabaseUser>$($settings.ChannelDatabaseDataSyncUser)</ChannelDatabaseUser>
            <ChannelDatabasePass>$($settings.ChannelDatabaseDataSyncPass)</ChannelDatabasePass>
            <DataGroupName>$($settings.DataGroupName)</DataGroupName>
            <DataGroupDescription>$($settings.DataGroupDescription)</DataGroupDescription>
            <DatabaseProfileName>$($settings.DatabaseProfileName)</DatabaseProfileName>
            <TrustServerCertificate>True</TrustServerCertificate>
        </ConfigureAsyncService>"

    $configureRealTimeServiceSection =
    "<ConfigureRealTimeService execute=`"true`">
            <AosUrl>$($settings.AosUrl)</AosUrl>
            <AosSoapUrl>$($settings.AosSoapUrl)</AosSoapUrl>
            <IdentityProvider>$($settings.IdentityProvider)</IdentityProvider>
            <UserId>$($settings.UserId)</UserId>
            <AudienceUrn>$($settings.AudienceUrn)</AudienceUrn>
            <AosAdminUserId>$($settings.AosAdminUserId)</AosAdminUserId>
            <RtsProfileId>$($settings.RtsProfileId)</RtsProfileId>
            <TenantId>$($settings.TenantId)</TenantId>
            <AzureAuthority>$($settings.AzureAuthority)</AzureAuthority>
        </ConfigureRealTimeService>"

    $configureSelfServiceSection =
    "<ConfigureRetailSelfService>
            <RetailSideloadingKey>$($settings.RetailSideloadingKey)</RetailSideloadingKey>
            <EnvironmentId>$($settings.EnvironmentId)</EnvironmentId>
            <ClientAppInsightsInstrumentationKey>$($settings.ClientAppInsightsInstrumentationKey)</ClientAppInsightsInstrumentationKey>
            <HardwareStationAppInsightsInstrumentationKey>$($settings.HardwareStationAppInsightsInstrumentationKey)</HardwareStationAppInsightsInstrumentationKey>
            <CloudPosAppInsightsInstrumentationKey>$($settings.CloudPosAppInsightsInstrumentationKey)</CloudPosAppInsightsInstrumentationKey>
            <RetailServerAppInsightsInstrumentationKey>$($settings.RetailServerAppInsightsInstrumentationKey)</RetailServerAppInsightsInstrumentationKey>
            <AsyncClientAppInsightsInstrumentationKey>$($settings.AsyncClientAppInsightsInstrumentationKey)</AsyncClientAppInsightsInstrumentationKey>
            <WindowsPhoneAppInsightsInstrumentationKey>$($settings.WindowsPhoneAppInsightsInstrumentationKey)</WindowsPhoneAppInsightsInstrumentationKey>
            <AsyncServerConnectorServiceAppInsightsInstrumentationKey>$($settings.AsyncServerConnectorServiceAppInsightsInstrumentationKey)</AsyncServerConnectorServiceAppInsightsInstrumentationKey>
            <RealtimeServiceAX63AppInsightsInstrumentationKey>$($settings.RealtimeServiceAX63AppInsightsInstrumentationKey)</RealtimeServiceAX63AppInsightsInstrumentationKey>
        </ConfigureRetailSelfService>"

    $operationsToExecute = 'skipRunSeedDataGenerator="False" skipConfigureAsyncService="False" skipConfigureRealTimeService="False" skipRunCdxJobs="False" skipConfigureSelfService="False"'

    $configureChannelProfileSection =
    "<ConfigureChannelProfile>
            <RetailChannelProfileName>$($settings.RetailChannelProfileName)</RetailChannelProfileName>
            <RetailServerUrl>$($settings.RetailServerUrl)</RetailServerUrl>
            <MediaServerUrl>$($settings.MediaServerUrl)</MediaServerUrl>
            <CloudPOSUrl>$($settings.CloudPOSUrl)</CloudPOSUrl>
        </ConfigureChannelProfile>"

    $methodInputXmlString = 
    "<?xml version=`"1.0`" encoding=`"UTF-8`"?>
    <Configuration $($operationsToExecute)>
        $configureAsyncServiceSection
        $configureRealTimeServiceSection
        $configureSelfServiceSection
        $configureChannelProfileSection
    </Configuration>"
    
    $methodInputXml = New-Object System.Xml.XmlDocument;
    $methodInputXml.LoadXml($methodInputXmlString);
    
    $methodInputXml.Save($methodInputXmlFilePath);

    $AXDeploymentSetupUtilityFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath -UtilityFileName 'Microsoft.Dynamics.AX.Deployment.Setup.exe'
    $parametersFromAosWebConfig = Get-RequisiteParametersFromAosWebConfig -AOSWebConfigFilePath $aosWebConfigFilePath

    $Global:LASTEXITCODE = 0
    # Call AX Deployment setup.
    Call-AXDeploymentSetupUtility -parametersFromAosWebConfig $parametersFromAosWebConfig `
                                  -methodInputXmlFilePath $methodInputXmlFilePath `
                                  -AXDeploymentSetupUtilityFilePath $AXDeploymentSetupUtilityFilePath `
                                  -className 'RetailServicingOrchestrator' `
                                  -methodName 'execute' `
                                  -LogFile $logFile
    
    $exitCode = $Global:LASTEXITCODE
    
    Remove-Item $methodInputXmlFilePath  -Force

    Log-TimedMessage ("Script ended with exit code $exitCode")
    exit $exitCode
}
catch
{
    Log-TimedMessage ($global:error[0] | format-list * -f | Out-String)
    $ScriptLine = $MyInvocation.MyCommand.Path.ToString()
    $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: $($_.ToString()) Value: $($PSBoundParameters[$_.ToString()])"}
    Log-TimedMessage "Executed:$([System.Environment]::NewLine)$ScriptLine$([System.Environment]::NewLine)Exiting with error code $exitCode."
    throw ($global:error[0] | format-list * -f | Out-String)
}
finally
{
    #Set the current location to avoid issues when the current location is set to SQLServer, which will breaks below code.
    Set-Location $rootDir
    
    if($axBatchServiceStartTypeSnapshot -ne $null -and $axBatchServiceStartTypeSnapshot -ne (Get-Service 'DynamicsAxBatch').StartupType)
    {
        #Restore DynamicsAxBatch to initial status.
        Set-Service $axBatchService.Name -StartupType $axBatchServiceStartTypeSnapshot
    }
    
    Encrypt-WebConfigSection -webConfigSection "connectionStrings" -websiteId $retailServerWebSite.Id -logFile $logFile
    Encrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigFilePath
    
    Set-Location $currentLocationSnapshot
}
# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCApbWrcqhnOe7RQ
# 4kO0en2HKqQUWVUOJXBXyfpST8pEbKCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCDZ
# KyT0Csnq4DDAvLJBtCi3Mk+BiGqdnY6i6Sw99cfDYTCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAR
# +49rX+n+oI/jYUz3EdyjV8xSJRwGGUjyQYJ2aMFcDbKNTmotk3mkVc+TrJa6hVrr
# CvUgkJez5hd+g4ekYvsSN2XBVNZp7fLRqDvwgLqKnyq1olDy1HPPWG7xuzQw2OoM
# 7LsmZYSfX+Uxz53BWglPfU9Rux/vYfI6LM2B+wRzvdGaP6i7iPI9gyGbIzpNqCwe
# T+2ezRn2AsCD9ytoPKMJc3dDKJjsyxbrz7PkOjA4ij5/FEnjz5p+2QQTzktu4LLH
# Iy8IBWfXIU3NmL17PYnoPfcmRQ9EEcKCvVyJ3v5uCgFZpg9JfbtmTcLvhHehXo2P
# Xgt0kOS0vmdPijOsE7/9oYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IPN+qnSfXV86obGSSFAqZoqBJCVDcAmQI5kq3sa6hRAeAgZfO+TbzhAYEzIwMjAw
# ODIzMDQwMjUwLjk1NVowBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25z
# IFB1ZXJ0byBSaWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpGN0E2LUUyNTEt
# MTUwQTElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaCCDkQw
# ggT1MIID3aADAgECAhMzAAABJYvei2xyJjHdAAAAAAElMA0GCSqGSIb3DQEBCwUA
# MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
# ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
# HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTIxOTAxMTQ1OFoX
# DTIxMDMxNzAxMTQ1OFowgc4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
# dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
# YXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNv
# MSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpGN0E2LUUyNTEtMTUwQTElMCMGA1UE
# AxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEB
# BQADggEPADCCAQoCggEBANB7H2N2YFvs4cnBJiYxSitk3ABy/xXLfpOUm7NxXHsb
# 6UWq3bONY4yVI4ySbVegC4nxVnlKEF50ANcMYMrEc1mEu7cRbzHmi38g6TqLMtOU
# AW28hc6DNez8do4zvZccrKQxkcB0v9+lm0BIzk9qWaxdfg6XyVeSb2NHnkrnoLur
# 36ENT7a2MYdoTVlaVpuU1RcGFpmC0IkJ3rRTJm+Ajv+43Nxp+PT9XDZtqK32cMBV
# 3bjK39cJmcdjfJftmweMi4emyX4+kNdqLUPB72nSvIJmyX1I4wd7G0gd72qVNu1Z
# gnxa1Yugf10QxDFUueY88M5WYGPstmFKOLfw31WnP8UCAwEAAaOCARswggEXMB0G
# A1UdDgQWBBTzqsrlByb5ATk0FcYI8iIIF0Mk+DAfBgNVHSMEGDAWgBTVYzpcijGQ
# 80N7fEYbxTNoWoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jv
# c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0w
# MS5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
# Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNy
# dDAMBgNVHRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
# CwUAA4IBAQCTHFk8YSAiACGypk1NmTnxXW9CInmNrbEeXlOoYDofCPlKKguDcVIu
# JOYZX4G0WWlhS2Sd4HiOtmy42ky19tMx0bun/EDIhW3C9edNeoqUIPVP0tyv3ilV
# 53McYnMvVNg1DJkkGi4J/OSCTNxw64U595Y9+cxOIjlQFbk52ajIc9BYNIYehuhb
# V1Mqpd4m25UNNhsdMqzjON8IEwWObKVG7nZmmLP70wF5GPiIB6i7QX/fG8jN6mgg
# qBRYJn2aZWJYSRXAK1MZtXx4rvcp4QTS18xT9hjZSagY9zxjBu6sMR96V6Atb5ge
# R+twYAaV+0Kaq0504t6CEugbRRvH8HuxMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAA
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
# aWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpGN0E2LUUyNTEtMTUwQTElMCMG
# A1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIa
# AxUARdMv4VBtzYb7cxde8hEpWvahcKeggYMwgYCkfjB8MQswCQYDVQQGEwJVUzET
# MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
# dGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0BAQUFAAIFAOLsUfowIhgPMjAyMDA4MjMw
# NjI0NThaGA8yMDIwMDgyNDA2MjQ1OFowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA
# 4uxR+gIBADAKAgEAAgIc+QIB/zAHAgEAAgIRmjAKAgUA4u2jegIBADA2BgorBgEE
# AYRZCgQCMSgwJjAMBgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYag
# MA0GCSqGSIb3DQEBBQUAA4GBAJTwVUhbb29TM4EJ4OBe+bzqLvT4fJmUg/WcRbqJ
# +5e4CTW02Bin+BxxpPjG2WR29gEuu73UnyjijbINsAZeN/Mv9zuZ8dQyFkS1xiAM
# QxwwvsSKsAKuVOKpxjo6CK+40IJ302lpT66fzC2QCjbyEzylxovKXjm8L10Gm0hn
# o0tHMYIDDTCCAwkCAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAC
# EzMAAAEli96LbHImMd0AAAAAASUwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgAdNmJeWSItxdAfsj
# b1Rr/SQpBLbN7rdFjRhLInGuCFwwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCBd38ayLm8wX/qJfYIOH5V+YvlG+poWQXCW6LKN70H3DjCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABJYvei2xyJjHdAAAAAAElMCIE
# IFyMAnv+fUcjmWSAGq2rLycrpXVbWCMYEJkLrAOY/VnLMA0GCSqGSIb3DQEBCwUA
# BIIBAETavnNtXXUiu4PuIFER+yupnj6dOyQTLgimilPsQG1WZ/hsurviAJ2XqC8L
# 9kcNzOaG1amwQBPgbCQi0RaCTWfBZKmZKn1lHaxj0wo4cmg8OCG9bAmQ8/gcw6nS
# Ur/cVBk6MyRTG3SlEVmGz25j7dn6Q2lYvpuzERZYVNtk3M9DFlDCZkZ31fTTJtPk
# Cxm4Pr/y2CuIBwtYrG5uyQPPGPgYVJf+MWsXVFHSQuJLsPbgz3l7VXIoc1d6TerX
# vajeC6Cvcd/LUUS013c296NZZmSa6mSWWw18SYgZ4CSPBDTrwzbizQm5KHgn1buT
# 0/bz6DUKDiYh6UnV7EsLfHuJeR0=
# SIG # End signature block
