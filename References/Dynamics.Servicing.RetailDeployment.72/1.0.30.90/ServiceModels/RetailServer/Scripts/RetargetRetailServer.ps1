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
    [string]$targetDatabaseProfileName = '',
    [string]$targetRtsProfileName = '',
    [string]$logFile = 'RetargetRetailServer.log' 
)

function Test-RetailRTSProfile
{
    param([hashtable]$settings,
        [string] $targetRtsProfileName
    )
    
    if(![String]::IsNullOrWhiteSpace($targetRtsProfileName))
    {
        $rtsProfileQuery = "SELECT * FROM RETAILTRANSACTIONSERVICEPROFILE WHERE [NAME] = '$targetRtsProfileName' "
        $rtsProfiles = Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                                     -Database $settings.AosDatabaseName `
                                     -Username $settings.AosDatabaseUser `
                                     -Password $settings.AosDatabasePass `
                                     -Query $rtsProfileQuery -ErrorAction Stop
        
        if($rtsProfiles -eq $null)
        {
            throw "Cannot find Retail RTS profile with name $targetRtsProfileName. Please work with support team to create the right profile record."
        }
    }
    else # No RTS profile name is passed, try to find one.
    {
        $targetRtsProfileName = 'Default'
        $rtsProfileQuery = "SELECT * FROM RETAILTRANSACTIONSERVICEPROFILE WHERE [NAME] = '$targetRtsProfileName' "
        $rtsProfiles = Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                                     -Database $settings.AosDatabaseName `
                                     -Username $settings.AosDatabaseUser `
                                     -Password $settings.AosDatabasePass `
                                     -Query $rtsProfileQuery -ErrorAction Stop
        
        if($rtsProfiles -ne $null)
        {
            Log-TimedMessage "Found Default RTS profile, will use it."
        }
        else
        {
            Log-TimedMessage "Didn't find the Default RTS profile."
            
            $rtsProfileQuery = "SELECT count(*) AS [COUNT], MAX([NAME]) AS [NAME] FROM RETAILTRANSACTIONSERVICEPROFILE "
            $rtsProfiles = Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                                         -Database $settings.AosDatabaseName `
                                         -Username $settings.AosDatabaseUser `
                                         -Password $settings.AosDatabasePass `
                                         -Query $rtsProfileQuery -ErrorAction Stop
            
            if($rtsProfiles.COUNT -eq 0)
            {
                throw "No RTS profile found, please check the Retail system is configured correctly. Please work with support team to create the right profile record."
            }
            elseif($rtsProfiles.COUNT -eq 1)
            {
                $targetRtsProfileName = $rtsProfiles.NAME
                Log-TimedMessage "Get only 1 RTS profile, will use this one $targetRtsProfileName"
            }
            else
            {
                # use column ISCUSTOMERRECORD to identify the system RTS profile, but this column only available in later releases,check the existence before trying with this approach.
                $rtsProfileQuery = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'RETAILTRANSACTIONSERVICEPROFILE' AND COLUMN_NAME = 'ISCUSTOMERRECORD'"
                $rtsProfiles = Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                                             -Database $settings.AosDatabaseName `
                                             -Username $settings.AosDatabaseUser `
                                             -Password $settings.AosDatabasePass `
                                             -Query $rtsProfileQuery -ErrorAction Stop
                
                if($rtsProfiles -ne $null) # RETAILTRANSACTIONSERVICEPROFILE contains ISCUSTOMERRECORD column, use it to identify the default profile.
                {
                    $rtsProfileQuery = "SELECT TOP 1 [NAME] FROM RETAILTRANSACTIONSERVICEPROFILE WHERE ISCUSTOMERRECORD = 0 "
                    $rtsProfiles = Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                                                 -Database $settings.AosDatabaseName `
                                                 -Username $settings.AosDatabaseUser `
                                                 -Password $settings.AosDatabasePass `
                                                 -Query $rtsProfileQuery -ErrorAction Stop
                    if($rtsProfiles -ne $null)
                    {
                        $targetRtsProfileName = $rtsProfiles.NAME
                        Log-TimedMessage "Get system created RTS profile, will use this one $targetRtsProfileName"
                    }
                    else
                    {
                        throw "Cannot find system created RTS profile, Please work with support team to create the right profile record."
                    }
                }
            }
        }
    }
    
    $settings.targetRtsProfileName = $targetRtsProfileName
}

function Test-RetailDatabaseProfile
{
    param([hashtable]$settings,
        [string] $targetDatabaseProfileName
    )
    
    if(![String]::IsNullOrWhiteSpace($targetDatabaseProfileName))
    {
        $databaseProfileQuery = "SELECT * FROM RETAILCONNDATABASEPROFILE WHERE [NAME] = '$targetDatabaseProfileName' "
        $databaseProfiles = Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                                          -Database $settings.AosDatabaseName `
                                          -Username $settings.AosDatabaseUser `
                                          -Password $settings.AosDatabasePass `
                                          -Query $databaseProfileQuery -ErrorAction Stop
        
        if($databaseProfiles -eq $null)
        {
            throw "Cannot find Retail channel database profile with name $targetDatabaseProfileName. Please work with support team to create the right profile record."
        }
    }
    else # No channel database profile name is passed, try to find one.
    {
        $targetDatabaseProfileName = 'Default'
        $databaseProfileQuery = "SELECT * FROM RETAILCONNDATABASEPROFILE WHERE [NAME] = '$targetDatabaseProfileName' "
        $databaseProfiles = Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                                          -Database $settings.AosDatabaseName `
                                          -Username $settings.AosDatabaseUser `
                                          -Password $settings.AosDatabasePass `
                                          -Query $databaseProfileQuery -ErrorAction Stop
        
        if($databaseProfiles -ne $null)
        {
            Log-TimedMessage "Found Default channel database, will use it."
        }
        else
        {
            Log-TimedMessage "Didn't find the Default channel database profile."
            
            $databaseProfileQuery = "SELECT count(*) AS [COUNT], MAX([NAME]) AS [NAME] FROM RETAILCONNDATABASEPROFILE "
            $databaseProfiles = Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                                              -Database $settings.AosDatabaseName `
                                              -Username $settings.AosDatabaseUser `
                                              -Password $settings.AosDatabasePass `
                                              -Query $databaseProfileQuery -ErrorAction Stop
            
            if($databaseProfiles.COUNT -eq 0)
            {
                throw "No channel database profile found, Please work with support team to create the right profile record."
            }
            elseif($databaseProfiles.COUNT -eq 1)
            {
                $targetDatabaseProfileName = $databaseProfiles.NAME
                Log-TimedMessage "Get only 1 channel database profile, will use this one $targetDatabaseProfileName"
            }
            else
            {
                Log-TimedMessage "More than 1 channel database profiles found, will try to find the default database profile without SERVER and DATABASE_ property."
                
                $databaseProfileQuery = "SELECT TOP 1 [NAME] FROM RETAILCONNDATABASEPROFILE WHERE LEN(DATABASE_) = 0 AND [SERVER] = 0 ORDER BY RECID DESC "
                $databaseProfiles = Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                                                  -Database $settings.AosDatabaseName `
                                                  -Username $settings.AosDatabaseUser `
                                                  -Password $settings.AosDatabasePass `
                                                  -Query $databaseProfileQuery -ErrorAction Stop
                if($databaseProfiles -ne $null)
                {
                    $targetDatabaseProfileName = $databaseProfiles.NAME
                    Log-TimedMessage "Get system created channel database profile, will use this one $targetDatabaseProfileName"
                }
                else
                {
                    throw "Cannot find system created channel database profile, Please work with support team to create the right profile record."
                }
            }
        }
    }
    
    $settings.targetDatabaseProfileName = $targetDatabaseProfileName
}

function Restore-DatabaseUsers
{
    param([hashtable]$settings,
        [hashtable]$retailUsersToEnsure
    )
    
    foreach($user in $retailUsersToEnsure.Keys)
    {
        $password = $retailUsersToEnsure[$user]
        $queryToEnsureUser = "
            DECLARE @isSqlAzure BIT
            SELECT @isSqlAzure = 0
            
            if (CHARINDEX('SQL Azure',@@VERSION) > 0)
            BEGIN
                SELECT @isSqlAzure = 1
            END
            
            IF (@isSqlAzure = 0) -- Handle non SQL Azure
            BEGIN
                -- Create login if not exists
                IF NOT EXISTS(SELECT 1 FROM dbo.syslogins WHERE [NAME] = '{0}')
                BEGIN
                    CREATE LOGIN {0} WITH PASSWORD = '{1}'
                END
                
                -- Create user from the login
                IF NOT EXISTS (SELECT 1 FROM [sys].[sysusers] WHERE [NAME] = '{0}' AND issqluser = 1)
                BEGIN
                    CREATE USER {0} FOR LOGIN {0} 
                END
                
                ALTER LOGIN {0} WITH PASSWORD = '{1}'
                
                -- Reassociate user and login
                EXEC sp_change_users_login 'Update_One', '{0}', '{0}'
            
            END
            ELSE -- Handle SQL Azure
            BEGIN
                -- We are not creating login in SQL Azure because we don't have permissions and it is supposed to be done at earlier deployment stage.
                
                -- In SQL Azure, user is only stored in current database, but we need to update the password with current value in case the database is restored from another instance
                IF EXISTS(SELECT * FROM DBO.SYSUSERS WHERE [NAME] = '{0}')
                BEGIN
                    ALTER USER {0} WITH PASSWORD = '{1}'
                END
                ELSE
                BEGIN
                    CREATE USER {0} WITH PASSWORD = '{1}'
                END
            END " -f $user, $password
        Log-TimedMessage ('Ensure user {0}' -f $user)
        try
        {
            Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                          -Database $settings.AosDatabaseName `
                          -Username $settings.AosDatabaseUser `
                          -Password $settings.AosDatabasePass `
                          -Query $queryToEnsureUser -ErrorAction Stop
        }
        catch
        {
            $errorMsg = "Error when trying to update user $user in database because the user is broken, please recreate this user in database with the right permission and try again. Detail document are available here: https://go.microsoft.com/fwlink/?linkid=854762"
            $errorMsg += ($global:error[0] | format-list * -f | Out-String)
            $PSBoundParameters.Keys | % { $errorMsg += "Parameter: {0} Value: {1}{2}" -f $_.ToString(), $PSBoundParameters[$_.ToString()], [System.Environment]::NewLine}
            Log-TimedMessage $errorMsg
            throw $errorMsg
        }
    }
}

<# 
 .Synopsis
  Test whether Retail is configured in this environment or not.

 .Description
  This will test whether Retail is configured in this environment or not.
  If Retail RTS profile doesn't exist of Retail database profile doesn't exist, it will return $false indicating Retail is not configured at all.
#>
function Test-RetailConfigured
{
    param(
        [string] $AosDatabaseServer,
        [string] $AosDatabaseName,
        [string] $AosDatabaseUser,
        [string] $AosDatabasePass
    )
    
    $rtsProfileQuery = "SELECT * FROM RETAILTRANSACTIONSERVICEPROFILE "
    $rtsProfiles = Invoke-SqlCmd -ServerInstance $AosDatabaseServer -Database $AosDatabaseName -Username $AosDatabaseUser -Password $AosDatabasePass -Query $rtsProfileQuery

    $databaseProfileQuery = "SELECT * FROM RETAILCONNDATABASEPROFILE "
    $databaseProfiles = Invoke-SqlCmd -ServerInstance $AosDatabaseServer -Database $AosDatabaseName -Username $AosDatabaseUser -Password $AosDatabasePass -Query $databaseProfileQuery

    if(($rtsProfiles -eq $null) -or ($databaseProfiles -eq $null))
    {
        return $false
    }
    
    return $true
}

<# 
 .Synopsis
  Update OnHold jobs and Waiting jobs to Finished to avoid issues during retargeting.

 .Description
  Update OnHold jobs and Waiting jobs to Finished to avoid issues during retargeting.
#>
function Disable-PendingBatchJobs
{
    param(
        [string] $AosDatabaseServer,
        [string] $AosDatabaseName,
        [string] $AosDatabaseUser,
        [string] $AosDatabasePass
    )
    
    Log-TimedMessage "Disable batch job records with Status OnHold or Waiting. There is an known bug in retargeting X++ code that it deletes BatchJobs with status OnHold or Waiting. X++ hot fix is released but if the current environment doesn't have the hot fix, this script fix will help to address this issue "
    
    Log-TimedMessage "Below BatchJobs are going to be updated."
    $targetBatchJobsQuery = "SELECT * FROM BATCHJOB  WHERE STATUS IN (0,1) "
    $result = Invoke-SqlCmd -ServerInstance $AosDatabaseServer -Database $AosDatabaseName -Username $AosDatabaseUser -Password $AosDatabasePass -Query $targetBatchJobsQuery
    $result | Format-Table | Out-String | Write-Host
    
    Log-TimedMessage "Updating BatchJob records."
    # BatchStatus, 8 = Canceled, 0 = Hold, 1 = Waiting.
    $updateBatchJobsQuery = "UPDATE BATCHJOB SET STATUS = 8 WHERE STATUS IN (0,1) "
    Invoke-SqlCmd -ServerInstance $AosDatabaseServer -Database $AosDatabaseName -Username $AosDatabaseUser -Password $AosDatabasePass -Query $updateBatchJobsQuery
}

try
{
    $ErrorActionPreference = 'Stop'    
        
    $scriptDir = Split-Path -parent $PSCommandPath

    . "$scriptDir\Common-Configuration.ps1"
    . "$scriptDir\Common-Web.ps1"
    . "$scriptDir\Common-Upgrade.ps1"

    Import-Module (Join-Path -Path $scriptDir -ChildPath 'Common-Servicing.psm1') -DisableNameChecking
    Import-Module (Join-Path -Path $scriptDir -ChildPath 'CommonRollbackUtilities.psm1') -DisableNameChecking
    Import-Module (Join-Path -Path $scriptDir -ChildPath 'SelfServiceConfiguration.psm1') -DisableNameChecking

    Log-TimedMessage "Retargeting Retail. Last Updated Date: 2017-11-06."

    $serviceModelName = 'RetailServer'  
    
    $retailServerWebSite = Get-WebSiteSafe -Name $retailServerWebsiteName
    
    if($retailServerWebSite -eq $null)
    {
        throw "Cannot find retail website with name $retailServerWebsiteName, please make sure this enviornment is deployed correctly."
    }
    
    & aspnet_regiis -pd "connectionStrings" -app "/" -Site $retailServerWebSite.Id

    $retailServerWebsitePhysicalPath = $retailServerWebSite.physicalPath
    $retailServerWebConfigFilePath = (Join-Path $retailServerWebsitePhysicalPath 'web.config')

    # decrypt retail server web.config with Microsoft.Dynamics.AX.Framework.ConfigEncryptor.exe
    Decrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigFilePath
    
    [xml]$retailServerWebConfigDoc = Get-Content -Path $retailServerWebConfigFilePath

    $appSettingSqlAdminUserElement = $retailServerWebConfigDoc.SelectSingleNode("/configuration/appSettings/add[@key='DataAccess.AxAdminSqlUser']")
    if($appSettingSqlAdminUserElement -eq $null)
    {
        throw "Retail servicing data is not present in the RetailServer web.config, please update it before running retargeting tool. Detail instructions are avaiable here: https://microsoft.sharepoint.com/:o:/r/teams/AXServiceOps/_layouts/15/WopiFrame.aspx?sourcedoc={ae57632e-2f94-415f-ab2a-3625cdc42ca6}&action=edit&wd=target%28Troubleshooting%20Guide%2Eone%7C6301B9E7%2D0E72%2D43CF%2DB29A%2DD2F076D3F2D6%2FUpdate%20Retail%20Servicing%20Data%20for%20JIT%7CA53DADEA%2DF544%2D4ADC%2D916D%2D6EBB9A633F31%2F%29onenote%3Ahttps%3A%2F%2Fmicrosoft%2Esharepoint%2Ecom%2Fteams%2FAXServiceOps%2FShared%20Documents%2FOperations%20Handbook%2FFeature%20guide%2FRetail%2FTroubleshooting%20Guide%2Eone#Update%20Retail%20Servicing%20Data%20for%20JIT&section-id={6301B9E7-0E72-43CF-B29A-D2F076D3F2D6}&page-id={A53DADEA-F544-4ADC-916D-6EBB9A633F31}&end."
    }

    Log-TimedMessage "Retail servicing data exists in retail server web.config."
    # To be compatible with the legacy code, use Get-AxDatabaseUserFromWebConfig to extract the database information from web.config.
    $websiteConnectionStringSettings = Get-AxDatabaseUserFromWebConfig -webConfig $retailServerWebConfigDoc -dbUserKey 'DataAccess.AxAdminSqlUser' -dbUserPasswordKey 'DataAccess.AxAdminSqlPwd'
    $deployDbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSettings
    
    $appSettingSqlUserElement = $retailServerWebConfigDoc.SelectSingleNode("/configuration/appSettings/add[@key='DataAccess.SqlUser']")
    
    if($appSettingSqlUserElement -ne $null)
    {
        Log-TimedMessage "axdeployextuser exists, extract the information."
        $extUserConnectionStringSettings = Get-AxDatabaseUserFromWebConfig -webConfig $retailServerWebConfigDoc -dbUserKey 'DataAccess.SqlUser' -dbUserPasswordKey 'DataAccess.SqlPwd'
        $extUserSetting = Create-WebSiteDBConfiguration -connectionString $extUserConnectionStringSettings
    }
    else
    {
        Log-TimedMessage "axdeployextuser doesn't exist, this is expected in 7.0,7.1 releases."
    }

    $retailChannelDBConnectionString = $retailServerWebConfigDoc.SelectSingleNode("/configuration/connectionStrings/add[@name='StorageLookupDatabase']").connectionString
    $channelDbSetting = Create-WebSiteDBConfiguration -connectionString $retailChannelDBConnectionString   

    [hashtable]$settings = @{}
    $settings.targetDataGroupName = $targetDataGroupName
    $settings.targetDatabaseProfileName = $targetDatabaseProfileName
    $settings.targetRtsProfileName = $targetRtsProfileName
    $settings.AosDatabaseServer = $deployDbSetting.server
    $settings.AosDatabaseName = $deployDbSetting.database
    $settings.AosDatabaseUser = $deployDbSetting.sqlUserName
    $settings.AosDatabasePass = $deployDbSetting.sqlUserPassword
    $settings.ChannelDatabaseServer = $channelDbSetting.server
    $settings.ChannelDatabaseName = $channelDbSetting.database
    $settings.ChannelDatabaseUser = $channelDbSetting.sqlUserName
    $settings.ChannelDatabasePass = $channelDbSetting.sqlUserPassword
    $settings.ChannelDatabaseDataSyncUser = 'axretaildatasyncuser'
    $settings.ChannelDatabaseDataSyncPass = $channelDbSetting.sqlUserPassword
    $settings.DisableDBServerCertificateValidation = $channelDbSetting.trustservercertificate
    
    if($extUserSetting -ne $null)
    {
        $settings.AxDeployExtUser = $extUserSetting.sqlUserName
        $settings.AxDeployExtUserPassword = $extUserSetting.sqlUserPassword
    }
    
    # Check whether Retail is configured or not, if Retail is not configured, skip Retargeting
    Log-TimedMessage "Checking Retail is configured in this environment or not."
    if(-not(Test-RetailConfigured -AosDatabaseServer $settings.AosDatabaseServer -AosDatabaseName $settings.AosDatabaseName -AosDatabaseUser $settings.AosDatabaseUser -AosDatabasePass $settings.AosDatabasePass))
    {
        Log-TimedMessage "Retail is not configured, no RTS profile or database profile was found in this environment, will return now to skip the retargeting process."
        return;
    }
    
    # Validate RTS profile
    Log-TimedMessage "Validating Retail RTS profile."
    Test-RetailRTSProfile -settings $settings -targetRtsProfileName $targetRtsProfileName
    
    # Validate channel database profile
    Log-TimedMessage "Validating Retail database profile."
    Test-RetailDatabaseProfile -settings $settings -targetDatabaseProfileName $targetDatabaseProfileName
    
    # Update all batch job to canceled for retargeting process.    
    Disable-PendingBatchJobs -AosDatabaseServer $settings.AosDatabaseServer -AosDatabaseName $settings.AosDatabaseName -AosDatabaseUser $settings.AosDatabaseUser -AosDatabasePass $settings.AosDatabasePass

    $settings.HardwareStationAppInsightsInstrumentationKey = $retailServerWebConfigDoc.configuration.environment.instrumentation.hardwareStationAppinsightsKey
    $settings.ClientAppInsightsInstrumentationKey = $retailServerWebConfigDoc.configuration.environment.instrumentation.clientAppinsightsKey
    $settings.EnvironmentId = $retailServerWebConfigDoc.configuration.environment.id
    $settings.TenantId = $retailServerWebConfigDoc.configuration.environment.tenant.id
    
    $retailUsersToEnsure = @{$settings.ChannelDatabaseUser = $settings.ChannelDatabasePass;
                             $settings.ChannelDatabaseDataSyncUser = $settings.ChannelDatabaseDataSyncPass}

    Restore-DatabaseUsers -settings $settings -retailUsersToEnsure $retailUsersToEnsure

    $settings.AosUrl = (Get-AosUrl -aosWebsiteName $aosWebsiteName)
    $settings.AosSoapUrl = (Get-AosSoapUrl -aosWebsiteName $aosWebsiteName)
    $settings.RetailServerUrlValue = ([array](Get-WebSiteBindingUrls -websiteName $retailServerWebsiteName))[0]
    $settings.CloudPOSUrl = ([array](Get-WebSiteBindingUrls -websiteName $retailCloudPosWebsiteName))[0]
    
    # Derive AOS web config file path.
    $aosWebsite = Get-WebSiteSafe -Name $aosWebsiteName
    $aosWebsitePhysicalPath = $aosWebsite.physicalPath
    $aosWebConfigFilePath = (Join-Path $aosWebsitePhysicalPath 'web.config')
    Log-TimedMessage ('AOS web.config located at:{0}{1}' -f [System.Environment]::NewLine, $aosWebConfigFilePath)

    Configure-AxDeploymentUtility -aosWebConfigFilePath $aosWebConfigFilePath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath    

    # Get file path to AX deployment setup utility and its config file.
    $AXDeploymentSetupUtilityFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath -UtilityFileName $AxDeploymentSetUpExeName
    Log-TimedMessage ('{0} located at:{1}{2}' -f $AxDeploymentSetUpExeName, [System.Environment]::NewLine, $AXDeploymentSetupUtilityFilePath)

    $aosWebConfigContent = [xml](Get-Content -Path $aosWebConfigFilePath)
    $identityProvider = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Provisioning.AdminIdentityProvider'
    if (-not $identityProvider)
    {
        throw 'Cound not read identityProvider from AOS web.config'
    }
    $settings.IdentityProvider = $identityProvider

    $selfServiceLocationRegistryPath = 'HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailSelfService\Servicing'
    
    Log-TimedMessage "Checking $selfServiceLocationRegistryPath for app insights keys."
    if(Test-Path -Path $selfServiceLocationRegistryPath)
    {
        Log-TimedMessage "Retail Servicing registry key $selfServiceLocationRegistryPath found, using app insights keys from registry."
        
        $settings.CloudPosAppInsightsInstrumentationKey = Get-ItemProperty -Path $selfServiceLocationRegistryPath | Select-Object -ExpandProperty  'CloudPosAppInsightsInstrumentationKey' -ErrorAction Ignore
        $settings.RetailServerAppInsightsInstrumentationKey = Get-ItemProperty -Path $selfServiceLocationRegistryPath | Select-Object -ExpandProperty  'RetailServerAppInsightsInstrumentationKey' -ErrorAction Ignore
        $settings.AsyncClientAppInsightsInstrumentationKey = Get-ItemProperty -Path $selfServiceLocationRegistryPath | Select-Object -ExpandProperty  'AsyncClientAppInsightsInstrumentationKey' -ErrorAction Ignore
        $settings.WindowsPhoneAppInsightsInstrumentationKey = Get-ItemProperty -Path $selfServiceLocationRegistryPath | Select-Object -ExpandProperty  'WindowsPhoneAppInsightsInstrumentationKey' -ErrorAction Ignore
        $settings.AsyncServerConnectorServiceAppInsightsInstrumentationKey = Get-ItemProperty -Path $selfServiceLocationRegistryPath | Select-Object -ExpandProperty  'AsyncServerConnectorServiceAppInsightsInstrumentationKey' -ErrorAction Ignore
        $settings.RealtimeServiceAX63AppInsightsInstrumentationKey = Get-ItemProperty -Path $selfServiceLocationRegistryPath | Select-Object -ExpandProperty  'RealtimeServiceAX63AppInsightsInstrumentationKey' -ErrorAction Ignore
        
        Log-TimedMessage "Done with extracting app insights keys from registry."
    }
    else # Try to get value from database
    {
        Log-TimedMessage "Retail Servicing registry key $selfServiceLocationRegistryPath not found, using app insights keys from table RETAILSHAREDPARAMETERS in database."
        
        $settings.WindowsPhoneAppInsightsInstrumentationKey = $retailServerWebConfigDoc.configuration.environment.instrumentation.windowsPhonePosAppInsightsKey
        
        $retailParametersQuery = "select TOP 1 * from RETAILSHAREDPARAMETERS "
        $retailParameters = Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                                          -Database $settings.AosDatabaseName `
                                          -Username $settings.AosDatabaseUser `
                                          -Password $settings.AosDatabasePass `
                                          -Query $retailParametersQuery -ErrorAction Stop
        
        if($retailParameters -ne $null)
        {
            Log-TimedMessage "Update app insight keys to $selfServiceLocationRegistryPath for future use."
            
            $settings.CloudPosAppInsightsInstrumentationKey = $retailParameters.CLOUDPOSAPPINSIGHTSINSTRUMENTATIONKEY
            $settings.RetailServerAppInsightsInstrumentationKey = $retailParameters.RETAILSERVERAPPINSIGHTSINSTRUMENTATIONKEY
            $settings.AsyncClientAppInsightsInstrumentationKey = $retailParameters.ASYNCCLIENTAPPINSIGHTSINSTRUMENTATIONKEY
            $settings.WindowsPhoneAppInsightsInstrumentationKey = $retailParameters.WINDOWSPHONEAPPINSIGHTSINSTRUMENTATIONKEY
            $settings.AsyncServerConnectorServiceAppInsightsInstrumentationKey = $retailParameters.ASYNCSERVERCONNECTORSERVICEAPPINSIGHTSINSTRUMENTATIONKEY
            $settings.RealtimeServiceAX63AppInsightsInstrumentationKey = $retailParameters.REALTIMESERVICEAX63APPINSIGHTSINSTRUMENTATIONKEY
            
            # Restore registry keys for future use
            New-Item -Path $selfServiceLocationRegistryPath -ItemType Directory -Force
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'IdentityProvider' -Value $settings.IdentityProvider | Out-Null
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'EnvironmentId' -Value $settings.EnvironmentId | Out-Null
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'TenantId' -Value $settings.TenantId | Out-Null
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'ClientAppInsightsInstrumentationKey' -Value $settings.ClientAppInsightsInstrumentationKey | Out-Null
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'HardwareStationAppInsightsInstrumentationKey' -Value $settings.HardwareStationAppInsightsInstrumentationKey | Out-Null
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'CloudPosAppInsightsInstrumentationKey' -Value $settings.CloudPosAppInsightsInstrumentationKey | Out-Null
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'RetailServerAppInsightsInstrumentationKey' -Value $settings.RetailServerAppInsightsInstrumentationKey | Out-Null
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'AsyncClientAppInsightsInstrumentationKey' -Value $settings.AsyncClientAppInsightsInstrumentationKey | Out-Null
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'WindowsPhoneAppInsightsInstrumentationKey' -Value $settings.WindowsPhoneAppInsightsInstrumentationKey | Out-Null
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'AsyncServerConnectorServiceAppInsightsInstrumentationKey' -Value $settings.AsyncServerConnectorServiceAppInsightsInstrumentationKey | Out-Null
            New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'RealtimeServiceAX63AppInsightsInstrumentationKey' -Value $settings.RealtimeServiceAX63AppInsightsInstrumentationKey | Out-Null
        }
        
        Log-TimedMessage "Done with extracting app insights keys from database."
    }
    
    $aadRealm = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Aad.Realm'
    if (-not $aadRealm)
    {
        throw 'Cound not read aadRealm from AOS web.config'
    }

    $AosAdminUserId = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Provisioning.AdminPrincipalName'
    if (-not $AosAdminUserId)
    {
        throw 'Cound not read Provisioning.AdminPrincipalName from AOS web.config'
    }
    $settings.AosAdminUserId = $AosAdminUserId
    $settings.UserId = 'RetailServerSystemAccount@dynamics.com'

    $settings.RetailServerUrl =  ('{0}/Commerce' -f $settings.RetailServerUrlValue)
    $settings.MediaServerUrl = ('{0}/MediaServer' -f $settings.RetailServerUrlValue)

    $methodInputXmlFilePath = [System.IO.Path]::GetTempFileName();

    Log-TimedMessage "Method input xml file is located in $methodInputXmlFilePath"

    $configureAsyncServiceSection =
    "<ChannelDatabaseServer>$($settings.ChannelDatabaseServer)</ChannelDatabaseServer>
    <ChannelDatabaseName>$($settings.ChannelDatabaseName)</ChannelDatabaseName>
    <ChannelDatabaseUser>$($settings.ChannelDatabaseDataSyncUser)</ChannelDatabaseUser>
    <ChannelDatabasePass>$($settings.ChannelDatabaseDataSyncPass)</ChannelDatabasePass>
    <DataGroupName>$($settings.targetDataGroupName)</DataGroupName>
    <DataGroupDescription>Default data group</DataGroupDescription>
    <DatabaseProfileName>$($settings.targetDatabaseProfileName)</DatabaseProfileName>
    <TrustServerCertificate>$($settings.DisableDBServerCertificateValidation)</TrustServerCertificate>"

    $configureRealTimeServiceSection =
    "<AosUrl>$($settings.AosUrl)</AosUrl>
    <AosSoapUrl>$($settings.AosSoapUrl)</AosSoapUrl>
    <IdentityProvider>$($settings.IdentityProvider)</IdentityProvider>
    <UserId>$($settings.UserId)</UserId>
    <AosAdminUserId>$($settings.AosAdminUserId)</AosAdminUserId>
    <RtsProfileId>$($settings.targetRtsProfileName)</RtsProfileId>
    <TenantId>$($settings.TenantId)</TenantId>"

    $configureChannelProfileSection =
    "<RetailChannelProfileName>Default</RetailChannelProfileName>
    <RetailServerUrl>$($settings.RetailServerUrl)</RetailServerUrl>
    <MediaServerUrl>$($settings.MediaServerUrl)</MediaServerUrl>
    <CloudPOSUrl>$($settings.CloudPOSUrl)</CloudPOSUrl>"
    
    $configureSelfServiceSection = 
    "<EnvironmentId>$($settings.EnvironmentId)</EnvironmentId>
    <ClientAppInsightsInstrumentationKey>$($settings.ClientAppInsightsInstrumentationKey)</ClientAppInsightsInstrumentationKey>
    <HardwareStationAppInsightsInstrumentationKey>$($settings.HardwareStationAppInsightsInstrumentationKey)</HardwareStationAppInsightsInstrumentationKey>
    <CloudPosAppInsightsInstrumentationKey>$($settings.CloudPosAppInsightsInstrumentationKey)</CloudPosAppInsightsInstrumentationKey>
    <RetailServerAppInsightsInstrumentationKey>$($settings.RetailServerAppInsightsInstrumentationKey)</RetailServerAppInsightsInstrumentationKey>
    <AsyncClientAppInsightsInstrumentationKey>$($settings.AsyncClientAppInsightsInstrumentationKey)</AsyncClientAppInsightsInstrumentationKey>
    <WindowsPhoneAppInsightsInstrumentationKey>$($settings.WindowsPhoneAppInsightsInstrumentationKey)</WindowsPhoneAppInsightsInstrumentationKey>
    <AsyncServerConnectorServiceAppInsightsInstrumentationKey>$($settings.AsyncServerConnectorServiceAppInsightsInstrumentationKey)</AsyncServerConnectorServiceAppInsightsInstrumentationKey>
    <RealtimeServiceAX63AppInsightsInstrumentationKey>$($settings.RealtimeServiceAX63AppInsightsInstrumentationKey)</RealtimeServiceAX63AppInsightsInstrumentationKey>"
    
    $methodInputXmlString = 
    "<?xml version=`"1.0`" encoding=`"UTF-8`"?>
    <Configuration><RetargetRetail>
        $configureAsyncServiceSection
        $configureRealTimeServiceSection
        $configureChannelProfileSection
        $configureSelfServiceSection</RetargetRetail>
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

    Log-TimedMessage ('Script ended with exit code {0}' -f $exitCode)
    if($exitCode -eq 0)
    {
        Write-Log "Retargeting completed successfully."
    }
    else
    {
        throw "Retargeting tool failed with exit code: $exitCode"
    }
}
catch
{
    Log-TimedMessage ($global:error[0] | format-list * -f | Out-String)
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine
    $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: {0} Value: {1}{2}" -f $_.ToString(), $PSBoundParameters[$_.ToString()], [System.Environment]::NewLine}
    Log-TimedMessage ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine)
    throw "Retargeting failed, please use this wiki for trouble shooting: https://msazure.visualstudio.com/D365/Retail%20Team/_wiki?pagePath=%2FRetail-Team%2FLive-Site-and-Production%2FTSGs%2FTSGs-By-Component%2FCloud-Deployments%2FGeneral-Troubleshooting-Guide"
}
finally
{
    if(![String]::IsNullOrWhiteSpace($methodInputXmlFilePath))
    {
        Remove-Item $methodInputXmlFilePath -Force -ErrorAction SilentlyContinue
    }
    & aspnet_regiis -pe "connectionStrings" -app "/" -Site $retailServerWebSite.Id
    Encrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigFilePath
}
# SIG # Begin signature block
# MIIkAQYJKoZIhvcNAQcCoIIj8jCCI+4CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBTG+xtZuSJ8GER
# kdnUKUSLzUGwLFH4PvtB/iz1CtzIiqCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# cVZOSEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFdIwghXOAgEBMIGVMH4x
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01p
# Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAAGIr1LWuZJt6PkAAAAA
# AYgwDQYJYIZIAWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEE
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBQ
# 4AF5YSCCrqB0DTp+Mz8kogj5GOJ+dPfKAcCNeMLbGzCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAy
# 16+D1AKU7Z8bXMchN2M+BS1rzyQnBHJazmEW3aGTSWQdKF/tZqz7in7EH8o1CdrU
# 98tVo7ruCl+leA2ASKVt57wfeL2X03KPL6uHxCdi6wWJWbHrl84Ob1jWKwXpEDEX
# w2qotjsc36nKI6n2iGQlluc4X3cb2U4cXmg9RFDTdG/lPofmM0Wf15XLGc3Dw2u8
# AJJDdwgpuqJKxP81UQoJsg6QH+UIXLDsnhVA24WuqGjGnsvzEVWpiBoVWRmSv1X5
# VH+HGo1eIK+qFRc+kQV0rG7bSn7NkSvnDqYVFBLBWFXS2TOoseSFfT3OAUjN0eva
# EPtguFlLIv1OgtuozZ3HoYIS4jCCEt4GCisGAQQBgjcDAwExghLOMIISygYJKoZI
# hvcNAQcCoIISuzCCErcCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IFEXgqkDJEy3so8JElDoMLz2+SsKmmXHU0pLGRsp3sgdAgZfPUPRUuoYEzIwMjAw
# ODIzMDQwMjUxLjc2OVowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
# VQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25z
# IExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkEyNDAtNEI4Mi0xMzBF
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOOTCCBPEw
# ggPZoAMCAQICEzMAAAERDQKe7tTtBdQAAAAAAREwDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTIwWhcNMjEw
# MTIxMjMxOTIwWjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
# BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UE
# CxMdVGhhbGVzIFRTUyBFU046QTI0MC00QjgyLTEzMEUxJTAjBgNVBAMTHE1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQCjEtKCE8EbaYuB7gyW5dmUN5sBoMWFWaUb+eRP33MMG53vqHkVD+fP
# BdebUrhTW7FXcA5HnJez5c3OdZ256C9gwxwO0XsllZBWTMVoRTDdsMVV6iqNiZ2P
# c7oISOl3jdDoUSDOazoJ14vQE3YK71zMR4/18V8Z9OcMSP8aoGl7aXtnkc/ujrAk
# Nj6HTanHbG/rqvKnT0VFFZAwPPKiKeIJlZgf11oanY7WdYyGMh9LxFOWNnxzaXB5
# WkcVo/AefxysqDyTI/g6bFnax1bXVdZX/w+tpepDT/FQRibhZU79hibQmeUge/YB
# 8G4XAxwjfdZMmdMfb44LjLRx1RI2dtMvAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
# +nDeQQuodljDEMPQDFdQ37b5AfIwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8Uz
# aFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
# L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoG
# CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
# Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
# AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEA
# j4ZrXUSYruIGFpReV4bBkcMHY7Z+cRo0pz55uONZPfVtGy5CjwwDNRLUVe7e4Ljc
# NoxMP2zPRCXr1E03JPc4lQPs11bhFjslWA3fzPUWr7yBMvZXxZdMrGnXaA42tMG0
# KLh6szITM4BcC4Q9miHgHSC9LhHNPs/gAn3CZGRNYwlxsXsYJB60nqvjeH086+KJ
# NN1G1nPCFR2IYrLg4uZdwJYTOHu2WUwyZlh1yCKROK2Fkde0lBQK8RPeU7qwqmTC
# c1YSvLNN8iODJXV9UXo4rBZR5ruJTblDZazbkYQTYxDrwsIhe+pdes6kbvJXly6Y
# Y4hUwROOI0Hg4HQU5PFGgzCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZI
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
# Hhk4L7zPWAUu7w2gUDXa7wknHNWzfjUeCLraNtvTX4/edIhJEqGCAsswggI0AgEB
# MIH4oYHQpIHNMIHKMQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNVBAcT
# B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsGA1UE
# CxMkTWljcm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
# Ex1UaGFsZXMgVFNTIEVTTjpBMjQwLTRCODItMTMwRTElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAQe7m7bx6J899
# m5OJloYbG1+fdMeggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
# MDANBgkqhkiG9w0BAQUFAAIFAOLsX3cwIhgPMjAyMDA4MjMxMTIyMzFaGA8yMDIw
# MDgyNDExMjIzMVowdDA6BgorBgEEAYRZCgQBMSwwKjAKAgUA4uxfdwIBADAHAgEA
# AgIKTjAHAgEAAgIRnDAKAgUA4u2w9wIBADA2BgorBgEEAYRZCgQCMSgwJjAMBgor
# BgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEBBQUA
# A4GBAIFUUVgsx/C5PJO41pYmLlin7LDp7ZUhmH41qCEWkNOZBsPgEEClJCQXBcRT
# lzCdUl/GU12h3wgLVNQXWTCI0PV8rVvDuU+12Hai7n9rV8dKB2WP7gHD5mxyRfgc
# Tl33EYP1UsJpn3oj9R20ROlwTwri/2EWHwbGKkyn/8jqpVp8MYIDDTCCAwkCAQEw
# gZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
# B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UE
# AxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAERDQKe7tTtBdQA
# AAAAAREwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG9w0B
# CRABBDAvBgkqhkiG9w0BCQQxIgQgGC8NByHvb62jYg0ry2EKMxgbaWDI4x8xf5hR
# 5RFDGEIwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCCOPhKvogUeGkGhaxtC
# ZuN/UtD1T4D+yDxcOwVz6Si2WzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
# IFBDQSAyMDEwAhMzAAABEQ0Cnu7U7QXUAAAAAAERMCIEIHamMxaS0RVnFU7MuRCt
# wJXmPwWjbKm3SVm5jXZolsa3MA0GCSqGSIb3DQEBCwUABIIBAFB1Bw9MBINmdcWi
# IuwmL3unvdngjcIJk73s+f1n42DsHre51TR+fQA0PiiRyTkrkS92RlrFci82hAqD
# dNakddpXk/isstghhzYZT5AYRS2zkT2T5um78F6w9LZIVThSx+U02RrfJzsk3VJU
# 2XXicmn8tgJBNJe79iMciMZVhY5l/gpqrL/v5xEMWNun4llJvMngGWbyjhpbQvyN
# wEEAhVeLho9PDWao7E7Dbfr0ADFcgVxwxXadTc9PiowLMF6f2E86Zk5fVvxBQXE2
# 5BE/cj5L3f7LxUcecnPm4e0Vgt7oUuaspysS2AMchOZ1DY8k+uOy7/prGKKiVcEk
# JZKQ8e8=
# SIG # End signature block
