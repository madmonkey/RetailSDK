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
# MIIkDAYJKoZIhvcNAQcCoIIj/TCCI/kCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAXfZyfzvRfou21
# lYZaAxLQ+NMLO4O5S+Bx+SikXfXWHKCCDYEwggX/MIID56ADAgECAhMzAAABh3IX
# chVZQMcJAAAAAAGHMA0GCSqGSIb3DQEBCwUAMH4xCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25p
# bmcgUENBIDIwMTEwHhcNMjAwMzA0MTgzOTQ3WhcNMjEwMzAzMTgzOTQ3WjB0MQsw
# CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
# ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMR4wHAYDVQQDExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
# AQDOt8kLc7P3T7MKIhouYHewMFmnq8Ayu7FOhZCQabVwBp2VS4WyB2Qe4TQBT8aB
# znANDEPjHKNdPT8Xz5cNali6XHefS8i/WXtF0vSsP8NEv6mBHuA2p1fw2wB/F0dH
# sJ3GfZ5c0sPJjklsiYqPw59xJ54kM91IOgiO2OUzjNAljPibjCWfH7UzQ1TPHc4d
# weils8GEIrbBRb7IWwiObL12jWT4Yh71NQgvJ9Fn6+UhD9x2uk3dLj84vwt1NuFQ
# itKJxIV0fVsRNR3abQVOLqpDugbr0SzNL6o8xzOHL5OXiGGwg6ekiXA1/2XXY7yV
# Fc39tledDtZjSjNbex1zzwSXAgMBAAGjggF+MIIBejAfBgNVHSUEGDAWBgorBgEE
# AYI3TAgBBggrBgEFBQcDAzAdBgNVHQ4EFgQUhov4ZyO96axkJdMjpzu2zVXOJcsw
# UAYDVR0RBEkwR6RFMEMxKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1
# ZXJ0byBSaWNvMRYwFAYDVQQFEw0yMzAwMTIrNDU4Mzg1MB8GA1UdIwQYMBaAFEhu
# ZOVQBdOCqhc3NyK1bajKdQKVMFQGA1UdHwRNMEswSaBHoEWGQ2h0dHA6Ly93d3cu
# bWljcm9zb2Z0LmNvbS9wa2lvcHMvY3JsL01pY0NvZFNpZ1BDQTIwMTFfMjAxMS0w
# Ny0wOC5jcmwwYQYIKwYBBQUHAQEEVTBTMFEGCCsGAQUFBzAChkVodHRwOi8vd3d3
# Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NlcnRzL01pY0NvZFNpZ1BDQTIwMTFfMjAx
# MS0wNy0wOC5jcnQwDAYDVR0TAQH/BAIwADANBgkqhkiG9w0BAQsFAAOCAgEAixmy
# S6E6vprWD9KFNIB9G5zyMuIjZAOuUJ1EK/Vlg6Fb3ZHXjjUwATKIcXbFuFC6Wr4K
# NrU4DY/sBVqmab5AC/je3bpUpjtxpEyqUqtPc30wEg/rO9vmKmqKoLPT37svc2NV
# BmGNl+85qO4fV/w7Cx7J0Bbqk19KcRNdjt6eKoTnTPHBHlVHQIHZpMxacbFOAkJr
# qAVkYZdz7ikNXTxV+GRb36tC4ByMNxE2DF7vFdvaiZP0CVZ5ByJ2gAhXMdK9+usx
# zVk913qKde1OAuWdv+rndqkAIm8fUlRnr4saSCg7cIbUwCCf116wUJ7EuJDg0vHe
# yhnCeHnBbyH3RZkHEi2ofmfgnFISJZDdMAeVZGVOh20Jp50XBzqokpPzeZ6zc1/g
# yILNyiVgE+RPkjnUQshd1f1PMgn3tns2Cz7bJiVUaqEO3n9qRFgy5JuLae6UweGf
# AeOo3dgLZxikKzYs3hDMaEtJq8IP71cX7QXe6lnMmXU/Hdfz2p897Zd+kU+vZvKI
# 3cwLfuVQgK2RZ2z+Kc3K3dRPz2rXycK5XCuRZmvGab/WbrZiC7wJQapgBodltMI5
# GMdFrBg9IeF7/rP4EqVQXeKtevTlZXjpuNhhjuR+2DMt/dWufjXpiW91bo3aH6Ea
# jOALXmoxgltCp1K7hrS6gmsvj94cLRf50QQ4U8Qwggd6MIIFYqADAgECAgphDpDS
# AAAAAAADMA0GCSqGSIb3DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMK
# V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
# IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0
# ZSBBdXRob3JpdHkgMjAxMTAeFw0xMTA3MDgyMDU5MDlaFw0yNjA3MDgyMTA5MDla
# MH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
# ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMT
# H01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTEwggIiMA0GCSqGSIb3DQEB
# AQUAA4ICDwAwggIKAoICAQCr8PpyEBwurdhuqoIQTTS68rZYIZ9CGypr6VpQqrgG
# OBoESbp/wwwe3TdrxhLYC/A4wpkGsMg51QEUMULTiQ15ZId+lGAkbK+eSZzpaF7S
# 35tTsgosw6/ZqSuuegmv15ZZymAaBelmdugyUiYSL+erCFDPs0S3XdjELgN1q2jz
# y23zOlyhFvRGuuA4ZKxuZDV4pqBjDy3TQJP4494HDdVceaVJKecNvqATd76UPe/7
# 4ytaEB9NViiienLgEjq3SV7Y7e1DkYPZe7J7hhvZPrGMXeiJT4Qa8qEvWeSQOy2u
# M1jFtz7+MtOzAz2xsq+SOH7SnYAs9U5WkSE1JcM5bmR/U7qcD60ZI4TL9LoDho33
# X/DQUr+MlIe8wCF0JV8YKLbMJyg4JZg5SjbPfLGSrhwjp6lm7GEfauEoSZ1fiOIl
# XdMhSz5SxLVXPyQD8NF6Wy/VI+NwXQ9RRnez+ADhvKwCgl/bwBWzvRvUVUvnOaEP
# 6SNJvBi4RHxF5MHDcnrgcuck379GmcXvwhxX24ON7E1JMKerjt/sW5+v/N2wZuLB
# l4F77dbtS+dJKacTKKanfWeA5opieF+yL4TXV5xcv3coKPHtbcMojyyPQDdPweGF
# RInECUzF1KVDL3SV9274eCBYLBNdYJWaPk8zhNqwiBfenk70lrC8RqBsmNLg1oiM
# CwIDAQABo4IB7TCCAekwEAYJKwYBBAGCNxUBBAMCAQAwHQYDVR0OBBYEFEhuZOVQ
# BdOCqhc3NyK1bajKdQKVMBkGCSsGAQQBgjcUAgQMHgoAUwB1AGIAQwBBMAsGA1Ud
# DwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8GA1UdIwQYMBaAFHItOgIxkEO5FAVO
# 4eqnxzHRI4k0MFoGA1UdHwRTMFEwT6BNoEuGSWh0dHA6Ly9jcmwubWljcm9zb2Z0
# LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jvb0NlckF1dDIwMTFfMjAxMV8wM18y
# Mi5jcmwwXgYIKwYBBQUHAQEEUjBQME4GCCsGAQUFBzAChkJodHRwOi8vd3d3Lm1p
# Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0NlckF1dDIwMTFfMjAxMV8wM18y
# Mi5jcnQwgZ8GA1UdIASBlzCBlDCBkQYJKwYBBAGCNy4DMIGDMD8GCCsGAQUFBwIB
# FjNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2RvY3MvcHJpbWFyeWNw
# cy5odG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AcABvAGwAaQBjAHkA
# XwBzAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZIhvcNAQELBQADggIBAGfyhqWY
# 4FR5Gi7T2HRnIpsLlhHhY5KZQpZ90nkMkMFlXy4sPvjDctFtg/6+P+gKyju/R6mj
# 82nbY78iNaWXXWWEkH2LRlBV2AySfNIaSxzzPEKLUtCw/WvjPgcuKZvmPRul1LUd
# d5Q54ulkyUQ9eHoj8xN9ppB0g430yyYCRirCihC7pKkFDJvtaPpoLpWgKj8qa1hJ
# Yx8JaW5amJbkg/TAj/NGK978O9C9Ne9uJa7lryft0N3zDq+ZKJeYTQ49C/IIidYf
# wzIY4vDFLc5bnrRJOQrGCsLGra7lstnbFYhRRVg4MnEnGn+x9Cf43iw6IGmYslmJ
# aG5vp7d0w0AFBqYBKig+gj8TTWYLwLNN9eGPfxxvFX1Fp3blQCplo8NdUmKGwx1j
# NpeG39rz+PIWoZon4c2ll9DuXWNB41sHnIc+BncG0QaxdR8UvmFhtfDcxhsEvt9B
# xw4o7t5lL+yX9qFcltgA1qFGvVnzl6UJS0gQmYAf0AApxbGbpT9Fdx41xtKiop96
# eiL6SJUfq/tHI4D1nvi/a7dLl+LrdXga7Oo3mXkYS//WsyNodeav+vyL6wuA6mk7
# r/ww7QRMjt/fdW1jkT3RnVZOT7+AVyKheBEyIXrvQQqxP/uozKRdwaGIm1dxVk5I
# RcBCyZt2WwqASGv9eZ/BvW1taslScxMNelDNMYIV4TCCFd0CAQEwgZUwfjELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9z
# b2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAxMQITMwAAAYdyF3IVWUDHCQAAAAABhzAN
# BglghkgBZQMEAgEFAKCCAScwGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYK
# KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIPl9tqUD
# ZDhEpbC3fhbPyaHD0kY+jDL6WLNiodSBGrPkMIG6BgorBgEEAYI3AgEMMYGrMIGo
# oIGJgIGGAFMAaQBtAHAAbABpAGYAeQBDAG8AbQBtAGUAcgBjAGUALgBNAGkAYwBy
# AG8AcwBvAGYAdABEAHkAbgBhAG0AaQBjAHMALgBDAG8AbgBuAGUAYwB0AG8AcgAu
# AFAAbwByAHQAYQBiAGwAZQAuAHIAZQBzAG8AdQByAGMAZQBzAC4AZABsAGyhGoAY
# aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAILKkNVw
# 8q+nI+JUwKFT5vBjrplP/vuRMgv/BWe3kkNcMkMOn6CJTLJNTbJlh8MMNJyPMsGV
# funDr6xOytq0P4ZqBFa1aQQAbv6EPwe4IxT2GmU2nhC/DkpvJuDbRAbdxCupEBgc
# 671zxcZx+CGqchVKt9qzwO43r1dM1EPbLmkOpAiPoR7Mgs0sSNLX/oVGTYL73wOB
# tmX9mHozxQTzKkVEbLoN3mJwlDzapi8WYPFEmWpn+CFKlqeC4thEoGU7Ce7prl7l
# 3mMOBjLhdQypTwQ08yy6sycrgKwL8Hn9JfwvzCA52XoXG8KVxHR/wKkBRyJNB+rm
# 787NhwCkq4FIQoShghLxMIIS7QYKKwYBBAGCNwMDATGCEt0wghLZBgkqhkiG9w0B
# BwKgghLKMIISxgIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBVQYLKoZIhvcNAQkQAQSg
# ggFEBIIBQDCCATwCAQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg/gYv
# /8zcDqvdRzt3oJWkQBtmwVltp4lMq85I/nxh0EkCBl88B+dBShgTMjAyMDA4MjMw
# NDAzNDMuMDkxWjAEgAIB9KCB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
# Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
# dCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVl
# cnRvIFJpY28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjREMkYtRTNERC1CRUVG
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIORDCCBPUw
# ggPdoAMCAQICEzMAAAErk9Dtjgr38EcAAAAAASswDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMjE5MDExNTAyWhcNMjEw
# MzE3MDExNTAyWjCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
# EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
# bjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28xJjAk
# BgNVBAsTHVRoYWxlcyBUU1MgRVNOOjREMkYtRTNERC1CRUVGMSUwIwYDVQQDExxN
# aWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOC
# AQ8AMIIBCgKCAQEAlvqLj8BZWleNACW52AA0cBFIXLMSOW2rtR2zDmxJmjrw3yha
# Qv5ArPzjZGoiKCBOW2bp0dgVyYHVhFGox1fpjuAlP1KnwVUjXQXEYXkjp3oG1AKM
# MFzb+zWKHQTXXVIA2X33kPwWBjx5rm7WeoSiaUIFuN2ipjLcA8RPaEAGkgzqFzAh
# rEK9366CYmcdI/4/Ej/xHEmHyNP8YVHOQvXDL+QPaIyXvXULODcMv/IAde6ypLD3
# mFmZbaa0vsc29LPTiuJ+NnDdCdg/AiLjoJKLfgqv2n10HVVXv75mj1KaB2Oa8Z4W
# MfYm2HfETE+ShQtpau8hupyk6z0TuwBQlMGwHQIDAQABo4IBGzCCARcwHQYDVR0O
# BBYEFCLvaHS4UgO5dJZhY/PQd5KIwJMFMB8GA1UdIwQYMBaAFNVjOlyKMZDzQ3t8
# RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
# LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNy
# bDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9z
# b2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3J0MAwG
# A1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQAD
# ggEBAGc/+dilpj5ulWziMmUftKwSVXhw692mcKeD5ejG1mc2FVuhBCWkuvs5D+bg
# 5zvzvTtEXyifJdNJYky8cNWEEPvioa5jcoWapYbDgwaoYuoQJSdQf//G1+Fk8x2L
# G4wMGZjtK2qRRS5flNFFWHvM11WpLuYT4bMRR53Mjad1NUYm0FQjvdxTvBR7yV58
# gSdfMp/GzJxPFSizSdQjZigoafz1lY8pL9jibflYTdiKuZMyMrnsHkDooQZIGT2+
# rKsY2K8Qaiok36Yw3xlQskko60UvODFWDubPlz8mCwxE+8XBlT3qFZwuCs1XkPd8
# 0CdaaIIsIyOIjw3whCzNm8ASnMgwggZxMIIEWaADAgECAgphCYEqAAAAAAACMA0G
# CSqGSIb3DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
# bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
# aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3Jp
# dHkgMjAxMDAeFw0xMDA3MDEyMTM2NTVaFw0yNTA3MDEyMTQ2NTVaMHwxCzAJBgNV
# BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
# HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
# dCBUaW1lLVN0YW1wIFBDQSAyMDEwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
# CgKCAQEAqR0NvHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvtfGhLLF/Fw+Vhwna3
# PmYrW/AVUycEMR9BGxqVHc4JE458YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs1nMw
# VyaCo0UN0Or1R4HNvyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLBxKZd0WETbijG
# GvmGgLvfYfxGwScdJGcSchohiq9LZIlQYrFd/XcfPfBXday9ikJNQFHRD5wGPmd/
# 9WbAA5ZEfu/QS/1u5ZrKsajyeioKMfDaTgaRtogINeh4HLDpmc085y9Euqf03GS9
# pAHBIAmTeM38vMDJRF1eFpwBBU8iTQIDAQABo4IB5jCCAeIwEAYJKwYBBAGCNxUB
# BAMCAQAwHQYDVR0OBBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQBgjcU
# AgQMHgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8G
# A1UdIwQYMBaAFNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJoEeG
# RWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jv
# b0NlckF1dF8yMDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUH
# MAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljUm9vQ2Vy
# QXV0XzIwMTAtMDYtMjMuY3J0MIGgBgNVHSABAf8EgZUwgZIwgY8GCSsGAQQBgjcu
# AzCBgTA9BggrBgEFBQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL1BLSS9k
# b2NzL0NQUy9kZWZhdWx0Lmh0bTBABggrBgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwA
# XwBQAG8AbABpAGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkqhkiG9w0B
# AQsFAAOCAgEAB+aIUQ3ixuCYP4FxAz2do6Ehb7Prpsz1Mb7PBeKp/vpXbRkws8LF
# Zslq3/Xn8Hi9x6ieJeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/XPle
# FzWYJFZLdO9CEMivv3/Gf/I3fVo/HPKZeUqRUgCvOA8X9S95gWXZqbVr5MfO9sp6
# AG9LMEQkIjzP7QOllo9ZKby2/QThcJ8ySif9Va8v/rbljjO7Yl+a21dA6fHOmWaQ
# jP9qYn/dxUoLkSbiOewZSnFjnXshbcOco6I8+n99lmqQeKZt0uGc+R38ONiU9Mal
# CpaGpL2eGq4EQoO4tYCbIjggtSXlZOz39L9+Y1klD3ouOVd2onGqBooPiRa6YacR
# y5rYDkeagMXQzafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA3+cxB6STOvdlR3jo
# +KhIq/fecn5ha293qYHLpwmsObvsxsvYgrRyzR30uIUBHoD7G4kqVDmyW9rIDVWZ
# eodzOwjmmC3qjeAzLhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8ZQU3ghvkqmqMR
# ZjDTu3QyS99je/WZii8bxyGvWbWu3EQ8l1Bx16HSxVXjad5XwdHeMMD9zOZN+w2/
# XU/pnR4ZOC+8z1gFLu8NoFA12u8JJxzVs341Hgi62jbb01+P3nSISRKhggLSMIIC
# OwIBATCB/KGB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
# b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
# dGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28x
# JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjREMkYtRTNERC1CRUVGMSUwIwYDVQQD
# ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQBE
# DDaSD+f/SfrQPt4bL3pZh0NPpqCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
# IFBDQSAyMDEwMA0GCSqGSIb3DQEBBQUAAgUA4uvMTzAiGA8yMDIwMDgyMjIwNTQz
# OVoYDzIwMjAwODIzMjA1NDM5WjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi68xP
# AgEAMAoCAQACAhs+AgH/MAcCAQACAhGoMAoCBQDi7R3PAgEAMDYGCisGAQQBhFkK
# BAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJ
# KoZIhvcNAQEFBQADgYEAEfvOSjRzZvA010ymoGH+SWyCDLgZlniLXEe5hErKud6S
# Ijsy5IuUUqcUnh72gGE833zW5D7WPp+dWNR7j2VP8Zu8YQq4QQvklFdrV0vRwyJr
# oBqj4InVM1zcCrMWr3inmF+1uqs/o+mugj9YMANnCGZ4axXAIGhORSIKNINYnz0x
# ggMNMIIDCQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
# bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
# aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAA
# ASuT0O2OCvfwRwAAAAABKzANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkD
# MQ0GCyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCAdtQjSGJ4+cbRN92v4KPe2
# 5w0Xg2Fjx807lX1XkrBhKDCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0EIGQn
# OeZKhcJTLFzce9iM4ipYx0bovq1MCDcqwtpdG89fMIGYMIGApH4wfDELMAkGA1UE
# BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
# BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
# IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAErk9Dtjgr38EcAAAAAASswIgQgpaLY
# 8KgshCVeR/QrMB0i8Jep/Z3lj/Ee0orDGX8aq7YwDQYJKoZIhvcNAQELBQAEggEA
# UoYzNC45fKvjcOHcPYx8R4b1KQMl0PtIj9PL1dAZj8e0gM3pWpobRT7rAk9L2CdO
# qcVD6ogYP0+ugmYlkRsDxcoF11q5fgCd5IvIZHCRUkuygyaNp8v6YvrEYLrPleYe
# fCUxbPIlzZKT5tjs2Qp+fEBD7Yz4TjjJqGNrBrA9NG2E+Rx0vC33Q1OaBhv+1eJq
# 33P3i5O1mrMeoYUBDokZnlVrCw9HoxEtkrdHDQgn4xxz0f014A/+frN/BNOgwqgq
# jU5A5HrDip9qA5W7lRAqXy3SF+/O++XutOSg1dw2vmqwtA16V/px7vKZSUDaKruj
# pYBc+zMCRLo3cJc2Vnx9nA==
# SIG # End signature block
