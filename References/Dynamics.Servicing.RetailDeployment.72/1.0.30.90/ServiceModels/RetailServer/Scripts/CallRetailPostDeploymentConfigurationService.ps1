<#
.EXAMPLE
E:\RainMain\Test\BVT\Setup\CallRetailPostDeploymentConfigurationService.ps1 -PathToCallerFolder 'C:\CustomerServiceUnit\Dobind\Packages\Cloud\AosWebApplication\AosWebApplication.csx\roles\AosWeb\approot\bin' -BinDirectory 'C:\Packages' -MetadataDirectory 'C:\Packages' -AosDatabaseUser 'sqluser' -AosDatabasePass 'Microsoft1!'

.EXAMPLE
E:\RainMain\Test\BVT\Setup\CallRetailPostDeploymentConfigurationService.ps1 -PathToCallerFolder 'C:\CustomerServiceUnit\Dobind\Packages\Cloud\AosWebApplication\AosWebApplication.csx\roles\AosWeb\approot\bin' -BinDirectory 'C:\Packages' -MetadataDirectory 'C:\Packages' -AosDatabaseServer 'ADS' -AosDatabaseName 'ADN' -AosDatabaseUser 'ADU' -AosDatabasePass 'ADP' -ExecuteRunSeedDataGenerator -ExecuteConfigureAsyncService -ChannelDatabaseServer 'CDS' -ChannelDatabaseName 'CDN' -ChannelDatabaseUser 'CDU' -ChannelDatabasePass 'CDP' -ExecuteConfigureRealTimeService -AosUrl 'https://usncmultiboxax1aos.cloud.onebox.dynamics.com/' -ExecuteRunCdxJobs

.EXAMPLE
E:\RainMain\Test\BVT\Setup\CallRetailPostDeploymentConfigurationService.ps1 -PathToCallerFolder 'C:\ConsoleApplication1\ConsoleApplication1\bin\Debug' -CallerExeName 'ConsoleApplication1.exe' -BinDirectory 'C:\Packages' -MetadataDirectory 'C:\Packages' -AosDatabaseServer 'ADS' -AosDatabaseName 'ADN' -AosDatabaseUser 'ADU' -AosDatabasePass 'ADP' -ExecuteRunSeedDataGenerator -ExecuteConfigureAsyncService -ChannelDatabaseServer 'CDS' -ChannelDatabaseName 'CDN' -ChannelDatabaseUser 'CDU' -ChannelDatabasePass 'CDP' -ExecuteConfigureRealTimeService -AosUrl 'https://usncmultiboxax1aos.cloud.onebox.dynamics.com/'
#>
param(
    # Executable parameters       
    [string]$IsServiceModelDeployment = "false",

    [string]$PathToCallerFolder,

    [string]$CallerExeName = 'Microsoft.Dynamics.AX.Deployment.Setup.exe',

    [string]$BinDirectory,

    [string]$MetadataDirectory = $BinDirectory,

    [string]$AosWebsiteName = 'AOSService',

    [string]$AosDatabaseServer = '.',

    [string]$AosDatabaseName = 'AXDBRAIN',

    [string]$AosDatabaseUser = 'AOSUser',

    [string]$AosDatabasePass = 'AOSWebSite@123',

    [string]$SetupMode = 'RunStaticXppMethod',

    [string]$ClassName = 'RetailPostDeploymentConfiguration',

    [string]$MethodName = 'Apply',

    # Method input parameters
    [switch]$ExecuteRunSeedDataGenerator,

    [switch]$ExecuteConfigureAsyncService,

    [string]$ChannelDatabaseServer = '',

    [string]$ChannelDatabaseName = '',

    [string]$ChannelDatabaseUser = '',

    [string]$ChannelDatabasePass = '',

    [string]$ChannelDatabaseDataSyncUser = '',

    [string]$ChannelDatabaseDataSyncPass = '',

    [string]$DataGroupName = 'Default',

    [string]$DataGroupDescription = 'Default data group',

    [string]$DatabaseProfileName = 'Default',

    [switch]$ExecuteConfigureRealTimeService,

    [string]$AosUrl = 'https://usnconeboxax1aos.cloud.onebox.dynamics.com',
    
    [string]$AosSoapUrl = '',

    [string]$IdentityProvider = 'https://sts.windows.net/',

    [string]$UserId = 'RetailServerSystemAccount@dynamics.com',

    [string]$AosAdminUserId = 'Tusr1@TAEOfficial.ccsctp.net',

    [string]$TenantId = '4dbfcf74-c5a6-4727-b638-d56e51d1f381',

    [string]$AzureAuthority,

    [string]$EnvironmentId = 'Dev-Environment',

    [string]$ClientAppInsightsInstrumentationKey = '7dfb87cf-158c-4cc5-88b5-f4feed355734',

    [string]$HardwareStationAppInsightsInstrumentationKey = 'aaff5098-9b7b-4c78-a801-f7fdb024331f',

    [string]$CloudPosAppInsightsInstrumentationKey = 'f04efaf8-196b-4fe8-a77b-4651e83fa501',

    [string]$RetailServerAppInsightsInstrumentationKey = '6d45bdf2-a67e-46be-99c0-418cb7fe6e71',

    [string]$AsyncClientAppInsightsInstrumentationKey = '01b25652-0ecc-4b50-aa68-5b31916e1a1e',

    [string]$WindowsPhoneAppInsightsInstrumentationKey = 'fdf9fdbc-28e7-4498-8a5d-f5a9f2e095c7',

    [string]$AsyncServerConnectorServiceAppInsightsInstrumentationKey = 'b91c4459-c371-42b5-b8cf-124de39e5941',

    [string]$RealtimeServiceAX63AppInsightsInstrumentationKey = '3b14afd4-35fe-4862-b822-3a7eab4eb6ae',

    [string]$RetailChannelProfileName = 'Default',

    [string]$RetailServerUrl = 'https://usnconeboxax1ret.cloud.onebox.dynamics.com/RetailServer/Commerce',

    [string]$MediaServerUrl = 'https://usnconeboxax1ret.cloud.onebox.dynamics.com/RetailServer/MediaServer',

    [string]$CloudPOSUrl = 'https://usnconeboxax1pos.cloud.onebox.dynamics.com',

    [string]$AudienceUrn = 'spn:00000015-0000-0000-c000-000000000000',

    [string]$RtsProfileId = 'Default',

    [switch]$ExecuteRunCdxJobs,

    [switch]$ConfigureSelfService,

    [string]$RetailSideloadingKey,

    [string]$DisableDBServerCertificateValidation = 'True',

    [string]$ProductSku = "Dynamics365ForOperations",

    [switch]$EnableRetailOnlyModeConfigKey,

    [switch]$DisableOverlayering
)

trap 
{
    Write-Output ($Error | Format-List * -Force | Out-String -Width 1024)
    exit 2
}

$Error.Clear()
$ErrorActionPreference = 'Stop'

Write-Output 'Script started execution.'

if($IsServiceModelDeployment -ne "true") # Read values from registry which will be populated by AxSetup.exe
{
    $DynDeploymentRegistryRoot = 'HKLM:\SOFTWARE\Microsoft\Dynamics\Deployment'
    $PathToCallerFolder = (Get-ItemProperty -Path $DynDeploymentRegistryRoot  `
        | Select-Object -ExpandProperty DeploymentDirectory `
        | Join-Path -ChildPath 'Dobind\Packages\Cloud\AosWebApplication\AosWebApplication.csx\roles\AosWeb\approot\bin')
    $BinDirectory = (Get-ItemProperty -Path $DynDeploymentRegistryRoot | Select-Object -ExpandProperty BinDir)
    $MetadataDirectory = $BinDirectory
}
else # For ServiceModelDeployment the registry values won't be populated in multibox, caller script will read the values from AOS web.config and pass the values in. 
{
}

$pathToCaller = Join-Path -Path $PathToCallerFolder -ChildPath $CallerExeName

if (-not(Test-Path -Path $pathToCaller -PathType Leaf))
{
    $message = 'Executable {0} does not exist in the folder {1}' -f $CallerExeName, $PathToCallerFolder
    throw $message
}

if ($AosAdminUserId.ToLower().EndsWith('.ccsctp.net')) 
{ 
    $IdentityProvider = 'https://sts.windows.net/'
}

$methodInputXmlFilePath = [System.IO.Path]::GetTempFileName();

Write-Output ('Method input xml file is located in {0}' -f $methodInputXmlFilePath)

$configureAsyncServiceSection =
@"
    <ConfigureAsyncService>
        <ChannelDatabaseServer>{0}</ChannelDatabaseServer>
        <ChannelDatabaseName>{1}</ChannelDatabaseName>
        <ChannelDatabaseUser>{2}</ChannelDatabaseUser>
        <ChannelDatabasePass>{3}</ChannelDatabasePass>
        <DataGroupName>{4}</DataGroupName>
        <DataGroupDescription>{5}</DataGroupDescription>
        <DatabaseProfileName>{6}</DatabaseProfileName>
        <TrustServerCertificate>{7}</TrustServerCertificate>
    </ConfigureAsyncService>
"@ -f $ChannelDatabaseServer, $ChannelDatabaseName, $ChannelDatabaseDataSyncUser, $ChannelDatabaseDataSyncPass, $DataGroupName, $DataGroupDescription, $DatabaseProfileName, $DisableDBServerCertificateValidation

$AosUrl = $AosUrl.trimEnd('/')
$AosSoapUrl = $AosSoapUrl.trimEnd('/')

$configureRealTimeServiceSection =
@"
    <ConfigureRealTimeService execute="{0}">
        <AosUrl>{0}</AosUrl>
        <AosSoapUrl>{1}</AosSoapUrl>
        <IdentityProvider>{2}</IdentityProvider>
        <UserId>{3}</UserId>
        <AudienceUrn>{4}</AudienceUrn>
        <AosAdminUserId>{5}</AosAdminUserId>
        <RtsProfileId>{6}</RtsProfileId>
        <TenantId>{7}</TenantId>
        <AzureAuthority>{8}</AzureAuthority>
    </ConfigureRealTimeService>
"@ -f $AosUrl, $AosSoapUrl, $IdentityProvider, $UserId, $AudienceUrn, $AosAdminUserId, $RtsProfileId, $TenantId, $AzureAuthority

$configureSelfServiceSection =
@"
    <ConfigureRetailSelfService>
        <RetailSideloadingKey>{0}</RetailSideloadingKey>
        <EnvironmentId>{1}</EnvironmentId>
        <ClientAppInsightsInstrumentationKey>{2}</ClientAppInsightsInstrumentationKey>
        <HardwareStationAppInsightsInstrumentationKey>{3}</HardwareStationAppInsightsInstrumentationKey>
        <CloudPosAppInsightsInstrumentationKey>{4}</CloudPosAppInsightsInstrumentationKey>
        <RetailServerAppInsightsInstrumentationKey>{5}</RetailServerAppInsightsInstrumentationKey>
        <AsyncClientAppInsightsInstrumentationKey>{6}</AsyncClientAppInsightsInstrumentationKey>
        <WindowsPhoneAppInsightsInstrumentationKey>{7}</WindowsPhoneAppInsightsInstrumentationKey>
        <AsyncServerConnectorServiceAppInsightsInstrumentationKey>{8}</AsyncServerConnectorServiceAppInsightsInstrumentationKey>
        <RealtimeServiceAX63AppInsightsInstrumentationKey>{9}</RealtimeServiceAX63AppInsightsInstrumentationKey>
    </ConfigureRetailSelfService>
"@ -f $RetailSideloadingKey, $EnvironmentId, $ClientAppInsightsInstrumentationKey, $HardwareStationAppInsightsInstrumentationKey, $CloudPosAppInsightsInstrumentationKey, $RetailServerAppInsightsInstrumentationKey, $AsyncClientAppInsightsInstrumentationKey, $WindowsPhoneAppInsightsInstrumentationKey, $AsyncServerConnectorServiceAppInsightsInstrumentationKey, $RealtimeServiceAX63AppInsightsInstrumentationKey

$operationsToExecute = 'skipRunSeedDataGenerator="{0}" skipConfigureAsyncService="{1}" skipConfigureRealTimeService="{2}" skipRunCdxJobs="{3}" skipConfigureSelfService="{4}"' -f
    (-not $ExecuteRunSeedDataGenerator.ToBool()), (-not $ExecuteConfigureAsyncService.ToBool()), (-not $ExecuteConfigureRealTimeService.ToBool()), 
    (-not $ExecuteRunCdxJobs.ToBool()), (-not $ConfigureSelfService.ToBool())

$configureChannelProfileSection =
@"
    <ConfigureChannelProfile>
        <RetailChannelProfileName>{0}</RetailChannelProfileName>
        <RetailServerUrl>{1}</RetailServerUrl>
        <MediaServerUrl>{2}</MediaServerUrl>
        <CloudPOSUrl>{3}</CloudPOSUrl>
    </ConfigureChannelProfile>
"@ -f $RetailChannelProfileName, $RetailServerUrl, $MediaServerUrl, $CloudPOSUrl

$configureRetailEnvironmentSection = 
@"
    <ConfigureRetailEnvironment>
        <EnableRetailOnlyModeConfigKey>$($EnableRetailOnlyModeConfigKey.ToBool())</EnableRetailOnlyModeConfigKey>
        <DisableOverlayering>$($DisableOverlayering.ToBool())</DisableOverlayering>
        <ProductSku>$($ProductSku)</ProductSku>
    </ConfigureRetailEnvironment>
"@

$methodInputXmlString = 
@'
<?xml version="1.0" encoding="UTF-8"?>
<Configuration {0}>
    {1}
    {2}
    {3}
    {4}
    {5}
</Configuration>
'@ -f $operationsToExecute, $configureAsyncServiceSection, $configureRealTimeServiceSection, $configureSelfServiceSection, $configureChannelProfileSection, $configureRetailEnvironmentSection

$methodInputXml = New-Object System.Xml.XmlDocument;
$methodInputXml.LoadXml($methodInputXmlString);

Write-Output 'Saving method input to xml file ...'

$methodInputXml.Save($methodInputXmlFilePath);

Write-Output 'Saved.'

$arguments = @(
    "--isemulated", "false",
    "--bindir", $BinDirectory,
    "--metadatadir", $MetadataDirectory,
    "--sqlserver", $AosDatabaseServer,
    "--sqldatabase", $AosDatabaseName,
    "--sqluser", $AosDatabaseUser,
    "--sqlpwd", $AosDatabasePass,
    "--setupmode", $SetupMode,
    "--classname", $ClassName,
    "--methodname", $MethodName,
    "--methodinputfile", $methodInputXmlFilePath
);

Write-Output ('Calling {0} ...' -f $pathToCaller)

$ErrorActionPreference = 'Continue'

& $pathToCaller $arguments *>&1
$exitCode = $Global:LASTEXITCODE

$ErrorActionPreference = 'Stop'

Remove-Item $methodInputXmlFilePath  -Force

Write-Output ('Execution completed with exit code {0}' -f $exitCode)
if($exitCode -eq 0)
{
	return 0
}
else
{
	throw 'CallRetailPostDeploymentConfigurationService.ps1 exit with non-zero code: {0}'-f $exitCode
}
# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCACMZj6CLrX9WP0
# uWxiy04cKUFpEB60TCoHqXcgHR9zmKCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCAU
# apNILtvE2GFptoJT21gauGm2MpNHsgLt9sh4i3eX4jCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAA
# N2/eA3aWnbP8FLAaPWts37PYXNDHh0+RDCdvTsCs7KVZQFY3Aj6rOaeX54+lp/Id
# OUoiDt3VK1toDIZlmELAMAmdVZTvkpiDj9cjqkO3VtWgBbo6yPHHuo8j7t7OzNJF
# eCVoBkyZdidMCARhqp1DuYIlZfxkwtVXT31pbQfUZheIdrxhioIfZAxryJYSuDsO
# V0+pgZ8L3ek8TiowF+HQA3MAbcjcNbJG0GCrK1h/cp199nDeCBL3lgnTKFS/Y0Zt
# PkVeH32vdmHh4I8MvWuZoNO11Xsf0Fl4zFWPw6G4L1KSDp1ljG09rKkB4IIahz3a
# KW/4WO+NsMgfilnJF32FoYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IIJp8i1+pCrLB02Dc3cu/K5uUSJ1FN6auehIJt+fB5SrAgZfO+WMaqMYEzIwMjAw
# ODIzMDQwMjUxLjE3OFowBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
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
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgJg4lp+S1/FlfkO/J
# vVchYe+cYzYtXKbQ/R8hsttJs6IwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCC8RWqLrwVSd+/cGxDfBqS4b1tPXhoPFrC615vV1ugU2jCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABKKAOgeE21U/CAAAAAAEoMCIE
# IKu3LANDj6g7/byri2vOJU5Ihv3XDJ6jB6uEWzEk3FREMA0GCSqGSIb3DQEBCwUA
# BIIBAIESheH+gQQAxnWDPFHN7M9RiJ6kKoTCMBb1FVygDent0fYkKkKNO17hLIOA
# AT4oLzsy15blb7pTZFzvUWMVyy2/xAWk+5U/jDD9sIhHzGq4l6O7P1u6eeGmfJML
# Ugd09u4Ukn6Wwo/CplHbwnIwLa+/edxaX3bUPM1J554SUj+KahOjTTW1cbkk7l9r
# 3fXrh3iO14cw4Ry+J77V9EdoxszlMOMY9iYVHG7Z8+zDYqCusVH2nbB2b4qfsJkz
# dfoJ9nOJdZbeHnC42//H4D8FW4zF81eOhfifZrE8R0F3LuB1S7Z5e17PmfPQFqDT
# y9gOkwH3ZHBcrEPcnL07qabzVY0=
# SIG # End signature block
