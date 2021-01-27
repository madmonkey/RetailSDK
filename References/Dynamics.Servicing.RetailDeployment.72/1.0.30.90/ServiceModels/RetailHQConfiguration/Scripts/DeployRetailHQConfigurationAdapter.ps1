<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

param(
    [string]$config = $(Throw 'config is required!'), 
    [string]$log = $(Throw 'log parameter required')
)

function Configure-DeploymentUtility(
    [string]$aosWebConfigFilePath = $(Throw 'aosWebConfigFilePath parameter required'),
    [string]$aosWebsitePhysicalPath = $(Throw 'aosWebsitePhysicalPath parameter required'),
    [string]$log
)
{
    $axDeploymentUtilityConfigFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath -UtilityFileName 'Microsoft.Dynamics.AX.Deployment.Setup.exe.config'
    Write-Log -objectToLog ('Microsoft.Dynamics.AX.Deployment.Setup.exe.config located at:{0}{1}' -f [System.Environment]::NewLine, $axDeploymentUtilityConfigFilePath) -logFile $log

    # Read AOS Web.Config and Microsoft.Dynamics.AX.Deployment.Setup.exe.config
    [xml]$aosWebConfigContent = Get-Content -Path $aosWebConfigFilePath
    [xml]$AXDeploymentUtilityConfigFileContent = Get-Content -Path $axDeploymentUtilityConfigFilePath

    # These appSettings need to be copied from aos web.config to DB sync utility config in order to access the enryption api from DB Sync utility context.
    $DataAccessFlightingCachePathKey = 'DataAccess.FlightingCachePath'

    $appSettingKeysForMove = @(
        'Infrastructure.WebRoot',
        'Aos.SafeMode',
        'AzureStorage.StorageConnectionString',
        'DataAccess.DataEncryptionCertificateThumbprint',
        'DataAccess.DataSigningCertificateThumbprint',
        'DataAccess.FlightingServiceCacheFolder',
        'DataAccess.FlightingEnvironment',
        'DataAccess.FlightingCertificateThumbprint',
        'DataAccess.FlightingServiceCatalogID',
        $DataAccessFlightingCachePathKey
        )

    foreach($key in $appSettingKeysForMove)
    {
        $appSetting = $aosWebConfigContent.SelectSingleNode("/configuration/appSettings/add[@key='$key']")

        if($appSetting -ne $null)
        {
            $appSettingValue = $appSetting.Value

            $appSettingElement = $AXDeploymentUtilityConfigFileContent.configuration.appSettings.add | Where {$_.key -eq $key}

            switch($key)
            {
                'Infrastructure.WebRoot'{ $InfrastructureWebRoot = $appSettingValue}
                'DataAccess.FlightingServiceCacheFolder'{ $DataAccessFlightingServiceCacheFolder = $appSettingValue}
                'DataAccess.FlightingCachePath'{ $DataAccessFlightingCachePath = $appSettingValue}
            }

            # Only add a new element if one doesn't already exist.
            if($appSettingElement -eq $null)
            {
                $appSettingElement = $AXDeploymentUtilityConfigFileContent.CreateElement('add')
                $appSettingElement.SetAttribute('key',$key)
                $appSettingElement.SetAttribute('value',$appSettingValue)
                $AXDeploymentUtilityConfigFileContent.configuration.appSettings.AppendChild($appSettingElement)
            }
            else
            {
                $appSettingElement.Value = [string]$appSettingValue
            }
        }
        else
        {
            Write-Log -objectToLog "$key is missing from AOS web.config, will skip it." -logFile $log
        }
    }

    # DataAccess.FlightingCachePath needs special handling.
    if([String]::IsNullOrEmpty($DataAccessFlightingCachePath))
    {
        $appSettingElement = $AXDeploymentUtilityConfigFileContent.configuration.appSettings.add | Where {$_.key -eq $DataAccessFlightingCachePathKey}
        if(-not [String]::IsNullOrEmpty($DataAccessFlightingServiceCacheFolder))
        {
            $appSettingValue = Join-Path $InfrastructureWebRoot $DataAccessFlightingServiceCacheFolder
        }
        else
        {
            $appSettingValue = $InfrastructureWebRoot
        }

        # Only add a new element if one doesn't already exist.
        if(!$appSettingElement)
        {
            $appSettingElement = $AXDeploymentUtilityConfigFileContent.CreateElement('add')
            $appSettingElement.SetAttribute('key',$DataAccessFlightingCachePathKey) 
            $appSettingElement.SetAttribute('value',$appSettingValue)
            $AXDeploymentUtilityConfigFileContent.configuration.appSettings.AppendChild($appSettingElement)
        }
        else
        {
            $appSettingElement.Value = [string]$appSettingValue
        }
    }

    $AXDeploymentUtilityConfigFileContent.Save($axDeploymentUtilityConfigFilePath)
    Write-Log 'Successfully updated Microsoft.Dynamics.AX.Deployment.Setup.exe.config' -logFile $log
}

function Get-TransactionServiceAzureAuthority(
    $config = $(Throw 'config is required!')
)
{
    $aadLoginWsfedEndpointFormat = $config.AADLoginWsfedEndpointFormat
    $aadLoginUrlFormat = $aadLoginWsfedEndpointFormat -replace "/wsfed", ""

    $adminPrincipalName = $config.AosAdminUserId
    $adminPrincipalDomain = ($adminPrincipalName -split '@')[1]

    $azureAuthority = $aadLoginUrlFormat -f $adminPrincipalDomain
    return $azureAuthority
}


try
{
    $ErrorActionPreference = 'Stop'

    $scriptDir = Split-Path -parent $PSCommandPath

    . "$scriptDir\Common-Configuration.ps1"
    . "$scriptDir\Common-Web.ps1"
    
    # Load helper functions from the 'ConfigParameterHelpers.ps1' file
    . "$scriptDir\ConfigParameterHelpers.ps1"
    
    
    $productVersion = Get-ProductVersionMajorMinor

    $LogDir = (Split-Path $log -parent)
    $targetScriptName = 'CallRetailPostDeploymentConfigurationService.ps1'
    $targetScript = Join-Path -Path $scriptDir -ChildPath $targetScriptName
    $AxDeploymentSetUpExeName = 'Microsoft.Dynamics.AX.Deployment.Setup.exe'

    $decodedConfig = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($config))
    $settings = ConvertFrom-Json $decodedConfig

    # Set default value for aos website if not provided or if empty string provided
    $aosWebsiteName = $settings.AosWebsiteName

    # Derive AOS web config file path.
    $aosWebsitePhysicalPath = Get-WebsitePhysicalPath -webSiteName $aosWebsiteName
    $aosWebConfigFilePath   = Get-AOSWebConfigFilePath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath
    Write-Log -objectToLog ('AOS web.config located at:{0}{1}' -f [System.Environment]::NewLine, $aosWebConfigFilePath) -logFile $log

    Configure-DeploymentUtility -aosWebConfigFilePath $aosWebConfigFilePath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath -log $log    

    # Get file path to AX deployment setup utility and its config file.
    $AXDeploymentSetupUtilityFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath -UtilityFileName $AxDeploymentSetUpExeName
    Write-Log -objectToLog ('{0} located at:{1}{2}' -f $AxDeploymentSetUpExeName, [System.Environment]::NewLine, $AXDeploymentSetupUtilityFilePath) -logFile $log

    $aosWebConfigContent = [xml](Get-Content -Path $aosWebConfigFilePath)
    $identityProvider = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Provisioning.AdminIdentityProvider'
    if (-not $identityProvider)
    {
        throw 'Cound not read identityProvider from AOS web.config'
    }

    $aadRealm = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Aad.Realm'
    if (-not $aadRealm)
    {
        throw 'Cound not read aadRealm from AOS web.config'
    }

    # Read value from AOS web.config, sample xml element: <add key="Common.BinDir" value="F:\AosService\PackagesLocalDirectory" />
    $BinDirectory = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Common.BinDir'

    $retailServerUrlValue = $settings.RetailServerUrl.Trim().trimEnd('/')

    if($retailServerUrlValue -like '*/Commerce*')
    {
        $retailServerUrlValue = $retailServerUrlValue.substring(0, $retailServerUrlValue.toLower().indexOf('/commerce'))
    }
    
    $selfServiceLocationRegistryPath = 'HKLM:\SOFTWARE\Microsoft\Dynamics\{0}\RetailSelfService\Servicing' -f $productVersion
    Write-Log ("Updating self service keys in registry: '{0}'" -f $selfServiceLocationRegistryPath) -logFile $Log

    New-Item -Path $selfServiceLocationRegistryPath -ItemType Directory -Force
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'IdentityProvider' -Value $identityProvider
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'EnvironmentId' -Value $settings.EnvironmentId
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'TenantId' -Value $settings.TenantId
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'ClientAppInsightsInstrumentationKey' -Value $settings.ClientAppInsightsInstrumentationKey
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'HardwareStationAppInsightsInstrumentationKey' -Value $settings.HardwareStationAppInsightsInstrumentationKey
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'CloudPosAppInsightsInstrumentationKey' -Value $settings.CloudPosAppInsightsInstrumentationKey
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'RetailServerAppInsightsInstrumentationKey' -Value $settings.RetailServerAppInsightsInstrumentationKey
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'AsyncClientAppInsightsInstrumentationKey' -Value $settings.AsyncClientAppInsightsInstrumentationKey
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'WindowsPhoneAppInsightsInstrumentationKey' -Value $settings.WindowsPhoneAppInsightsInstrumentationKey
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'AsyncServerConnectorServiceAppInsightsInstrumentationKey' -Value $settings.AsyncServerConnectorServiceAppInsightsInstrumentationKey
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'RealtimeServiceAX63AppInsightsInstrumentationKey' -Value $settings.RealtimeServiceAX63AppInsightsInstrumentationKey
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name 'RetailSideloadingKey' -Value $settings.RetailSideloadingKey

    # Set environment variables in the session for use by subsequent scripts in the deployment
    $env:_axDeploymentAosWebRoot = $aosWebsitePhysicalPath

    $parameters = @{}

    $parameters.Add('IsServiceModelDeployment',$true)
    $parameters.Add('AosWebsiteName',$aosWebsiteName)
    $parameters.Add('AosDatabaseServer',$settings.AosDatabaseServer)
    $parameters.Add('AosDatabaseName',$settings.AosDatabaseName)
    $parameters.Add('AosDatabaseUser',$settings.AosDatabaseUser)
    $parameters.Add('AosDatabasePass',$settings.AosDatabasePass)
    $parameters.Add('ChannelDatabaseServer',$settings.ChannelDatabaseServer)
    $parameters.Add('ChannelDatabaseName',$settings.ChannelDatabaseName)
    $parameters.Add('ChannelDatabaseUser',$settings.ChannelDatabaseUser)
    $parameters.Add('ChannelDatabasePass',$settings.ChannelDatabasePass)
    $parameters.Add('ChannelDatabaseDataSyncUser',$settings.ChannelDatabaseDataSyncUser)
    $parameters.Add('ChannelDatabaseDataSyncPass',$settings.ChannelDatabaseDataSyncPass)
    $parameters.Add('AosUrl',$settings.AosUrl)
    $parameters.Add('AosSoapUrl',$settings.AosSoapUrl)
    $parameters.Add('UserId',$settings.UserId)
    $parameters.Add('AosAdminUserId',$settings.AosAdminUserId)
    $parameters.Add('CloudPOSUrl',$settings.CloudPOSUrl)
    $parameters.Add('RetailSideloadingKey',$settings.RetailSideloadingKey)
    $parameters.Add('ClientAppInsightsInstrumentationKey',$settings.ClientAppInsightsInstrumentationKey)
    $parameters.Add('HardwareStationAppInsightsInstrumentationKey',$settings.HardwareStationAppInsightsInstrumentationKey)
    $parameters.Add('CloudPosAppInsightsInstrumentationKey',$settings.CloudPosAppInsightsInstrumentationKey)
    $parameters.Add('RetailServerAppInsightsInstrumentationKey',$settings.RetailServerAppInsightsInstrumentationKey)
    $parameters.Add('AsyncClientAppInsightsInstrumentationKey',$settings.AsyncClientAppInsightsInstrumentationKey)
    $parameters.Add('WindowsPhoneAppInsightsInstrumentationKey',$settings.WindowsPhoneAppInsightsInstrumentationKey)
    $parameters.Add('AsyncServerConnectorServiceAppInsightsInstrumentationKey',$settings.AsyncServerConnectorServiceAppInsightsInstrumentationKey)
    $parameters.Add('RealtimeServiceAx2012AppInsightsInstrumentationKey',$settings.RealtimeServiceAX63AppInsightsInstrumentationKey)
    $parameters.Add('EnvironmentId',$settings.EnvironmentId)
    $parameters.Add('TenantId',$settings.TenantId)
    $parameters.Add('AzureAuthority',(Get-TransactionServiceAzureAuthority -config $settings))
    $parameters.Add('RetailServerUrl', ('{0}/Commerce' -f $retailServerUrlValue))
    $parameters.Add('MediaServerUrl', ('{0}/MediaServer' -f $retailServerUrlValue))
    $parameters.Add('PathToCallerFolder', (Split-Path -parent $AXDeploymentSetupUtilityFilePath))
    $parameters.Add('IdentityProvider', $identityProvider)
    $parameters.Add('AudienceUrn', $aadRealm)
    $parameters.Add('MetadataDirectory', $BinDirectory)
    $parameters.Add('BinDirectory', $BinDirectory)
    $parameters.Add('ExecuteRunSeedDataGenerator', (Get-OptionalBoolParameter -ParameterSet $settings -ParameterName "ExecuteRunSeedDataGenerator" -DefaultValue $true -IgnoreEmptyStringValue))
    $parameters.Add('ExecuteConfigureAsyncService', (Get-OptionalBoolParameter -ParameterSet $settings -ParameterName "ExecuteConfigureAsyncService" -DefaultValue $true -IgnoreEmptyStringValue))
    $parameters.Add('ExecuteConfigureRealTimeService', (Get-OptionalBoolParameter -ParameterSet $settings -ParameterName "ExecuteConfigureRealTimeService" -DefaultValue $true -IgnoreEmptyStringValue))
    $parameters.Add('ExecuteRunCdxJobs', (Get-OptionalBoolParameter -ParameterSet $settings -ParameterName "ExecuteRunCdxJobs" -DefaultValue $true -IgnoreEmptyStringValue))
    $parameters.Add('ConfigureSelfService', (Get-OptionalBoolParameter -ParameterSet $settings -ParameterName "ConfigureSelfService" -DefaultValue $true -IgnoreEmptyStringValue))

    $EnableRetailOnlyModeConfigKeyValue = (Get-OptionalBoolParameter -ParameterSet $settings -ParameterName "EnableRetailOnlyModeConfigKey" -DefaultValue $false -IgnoreEmptyStringValue)
    $DisableOverlayeringValue = (Get-OptionalBoolParameter -ParameterSet $settings -ParameterName "DisableOverlayering" -DefaultValue $false -IgnoreEmptyStringValue)
    
    $parameters.Add('EnableRetailOnlyModeConfigKey', $EnableRetailOnlyModeConfigKeyValue)
    $parameters.Add('DisableOverlayering', $DisableOverlayeringValue)
    
    # only add these parameters if they are present in the deserialized "settings", otherwise specifying "null" will override 
    # any defaults in the next script
    Invoke-IfParameterExists -ParameterSet $settings -ParameterName "ProductSku" -ScriptBlock {$parameters.Add("ProductSku", $_)} -IgnoreEmptyStringValue
    
    Write-Log 'Calling Deploy Retail HQ Configuration Service ...' -logFile $log

    Invoke-ScriptAndRedirectOutput -scriptBlock {
        & $targetScript @parameters
    } -logFile $log

    Write-Log ('Calling Deploy Retail HQ Configuration Service finished') -logFile $log
}
catch
{
    Write-Log ($global:error[0] | format-list * -f | Out-String)
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine
    $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: {0} Value: {1}{2}" -f $_.ToString(), $PSBoundParameters[$_.ToString()], [System.Environment]::NewLine}
    Write-Host ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine)
    throw ($global:error[0] | format-list * -f | Out-String)
}
# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAm/I31ERPIlCJE
# PyZcS08Ztbaq8HUZ1J5ye2i5aFUpBqCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBl
# HD7qT3EceIPCTLkLMQr1T60DwAYmFPF/oOyi0i6aGzCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAn
# F9WOo3hyZvTjdYlNzgFY/cdjiztfc+f5C3yH+znz305jWkv3YKFqcMM33xAEOnuB
# QJOgBcr8ziz+YPIaJsiPw9KAIzH8hskMwUVSa2j7gJTs/j8jO4lTntZCklRz81Oo
# PhsAEk81C4KyyVU3R4JUOVOg7DlFUhb3wzr1Bkvxs52mKoL6PuLoqLOGURcnwIqk
# 7HOrK/E1Xy6bvTA/4qmC3Ke/qcEqnQDo7dWrbwRK6iKRTzbqtXVGKeuytfhvzR0w
# 5KYkJYb1cdBJ5U8N1BSIYb5PbZ+ljUOMfzqiJg8l4+I7sqIfqcrx/+QnUYFsMupD
# nr7s+zujooZjnlujGNbZoYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IPq3/b+/mB+WfMNWZ96S9KYphPECYdT+amakYS0KcxRrAgZfO+TbzqkYEzIwMjAw
# ODIzMDQwMjU0LjgyM1owBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
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
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgWsBDzuQodpJ7hK+r
# suhoMtD5hvbNsSXJ4QIbjTrf1WwwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCBd38ayLm8wX/qJfYIOH5V+YvlG+poWQXCW6LKN70H3DjCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABJYvei2xyJjHdAAAAAAElMCIE
# IFyMAnv+fUcjmWSAGq2rLycrpXVbWCMYEJkLrAOY/VnLMA0GCSqGSIb3DQEBCwUA
# BIIBAKF5OXkWcnfPpHMrKYWH9fOKc2Qll510RXuvwTnq5yAYX1u+ASrdqFiNgJEa
# SwpCkmu4PvpdUUjSCQ2jkvVSW4n5cBiE+xmVfTmJ/fhB+MEek+zXqz/ym2yKZU6F
# UIvSW0qeip/4X4WvFmHpV5/RzzlHCEUonOolZJOfgnjFIa/SWOv4d9hjNS2itztS
# Va/HfP6RVRpnOPDator+1+PFy9R4Rs7AJCtNPxLWy3vzM3HZg7pAcCs//SLYPUFv
# bsVlxWa1h6rEPGZ2ipNwX0E+8WkRAaehe7t1r3lpADo1FIgl45OH6eC/EQLQL/xv
# ccvyNpGGGfIQJgpjc7HAdfz5DxQ=
# SIG # End signature block
