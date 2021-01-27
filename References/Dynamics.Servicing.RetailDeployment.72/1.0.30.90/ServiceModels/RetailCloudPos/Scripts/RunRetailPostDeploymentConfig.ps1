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
    [bool]$IsServiceModelDeployment = $false,
    [ValidateScript({ Test-Path -Path $_ -PathType Container})]
    [string]$PathToCallerFolder,
    [string]$CallerExeName = 'Microsoft.Dynamics.AX.Deployment.Setup.exe',

    [ValidateScript({ Test-Path -Path $_ -PathType Container})]
    [string]$BinDirectory,

    [ValidateScript({ Test-Path -Path $_ -PathType Container})]
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

    [switch]$ExecuteConfigureRealTimeService,
    [string]$AosUrl = 'https://usnconeboxax1aos.cloud.onebox.dynamics.com/',

    [string]$IdentityProvider = 'https://sts.windows.net/',
    [string]$UserId = 'user@dynamics.com',

    [string]$AudienceUrn = 'spn:00000015-0000-0000-c000-000000000000',
    [switch]$ExecuteRunCdxJobs,
    [switch]$ExecuteGenerateSelfServicePackages
)

trap 
{
    Write-Output ($Error | Format-List * -Force | Out-String -Width 1024)
    exit 2
}

$Error.Clear()
$ErrorActionPreference = 'Stop'

Write-Output 'Script started execution.'

if(!$IsServiceModelDeployment) # Read values from registry which will be populated by AxSetup.exe
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

$methodInputXmlFilePath = [System.IO.Path]::GetTempFileName();

Write-Output ('Method input xml file is located in {0}' -f $methodInputXmlFilePath)

$configureAsyncServiceSection =
@"
	<ConfigureAsyncService>
        <ChannelDatabaseServer>{0}</ChannelDatabaseServer>
        <ChannelDatabaseName>{1}</ChannelDatabaseName>
        <ChannelDatabaseUser>{2}</ChannelDatabaseUser>
        <ChannelDatabasePass>{3}</ChannelDatabasePass>
    </ConfigureAsyncService>
"@ -f $ChannelDatabaseServer, $ChannelDatabaseName, $ChannelDatabaseUser, $ChannelDatabasePass

$configureRealTimeServiceSection =
@"
	<ConfigureRealTimeService execute="{0}">
        <AosUrl>{0}</AosUrl>
        <IdentityProvider>{1}</IdentityProvider>
        <UserId>{2}</UserId>
        <AudienceUrn>{3}</AudienceUrn>
    </ConfigureRealTimeService>
"@ -f $AosUrl, $IdentityProvider, $UserId, $AudienceUrn

$operationsToExecute = 'skipRunSeedDataGenerator="{0}" skipConfigureAsyncService="{1}" skipConfigureRealTimeService="{2}" skipRunCdxJobs="{3}" skipGenerateSelfServicePackages="{4}"' -f
    (-not $ExecuteRunSeedDataGenerator.ToBool()), (-not $ExecuteConfigureAsyncService.ToBool()), (-not $ExecuteConfigureRealTimeService.ToBool()), 
    (-not $ExecuteRunCdxJobs.ToBool()), (-not $ExecuteGenerateSelfServicePackages.ToBool())

$methodInputXmlString = 
@'
<?xml version="1.0" encoding="UTF-8"?>
<Configuration {0}>
    {1}
    {2}
</Configuration>
'@ -f $operationsToExecute, $configureAsyncServiceSection, $configureRealTimeServiceSection

$methodInputXml = New-Object System.Xml.XmlDocument;
$methodInputXml.LoadXml($methodInputXmlString);

Write-Output 'Saving method input to xml file ...'

$methodInputXml.Save($methodInputXmlFilePath);

Write-Output 'Saved.'

$arguments = @(
    "--isemulated", "true",
    "--bindir", $BinDirectory,
    "--metadatadir", $MetadataDirectory,
    "--sqlserver", $AosDatabaseServer,
    "--sqldatabase", $AosDatabaseName,
    "--sqluser", $AosDatabaseUser,
    "--sqlpwd", $AosDatabasePass,
    "--setupmode", $SetupMode,
    "--classname", $ClassName
    "--methodname", $MethodName
    "--methodinputfile", $methodInputXmlFilePath
);

Write-Output ('Calling {0} ...' -f $pathToCaller)

$ErrorActionPreference = 'Continue'

& $pathToCaller $arguments
$exitCode = $Global:LASTEXITCODE

$ErrorActionPreference = 'Stop'

Write-Output ('Execution completed with exit code {0}' -f $exitCode)

exit $exitCode


# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCCbGScQo+xV6lVY
# OekC5mWXn+c36c8xGlzpCxNbh1g9faCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBa
# U9GIvGjgJFIgwEFIknPmw3n4gfCdANSHS3vSZaeQWzCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBD
# 3loids7NtZ1weg3SBpXriAjZxCNAn3xP9ulbsAnQDjAb5R2BoF4lAfm1tPfcTCZa
# NS00qbZQ4gdqa95WRxCD/mNGs3H5cEsSO5XaH4rFu4jaT8/FKuQT9LWCvm+vcPsB
# 32W9k26Tvd6XbRuRexZ0GnrMdN/TV+rhj+3+XZg0o+SU+MSXI6VcZZC3Ph34vtp2
# AdnZMiGvRhDlrgwEiApNMRWcXpyBiMmb625tcs9IrG+mKgmx3OyhxmJoiNo3zxk7
# elQOVloClefyX0rY47NeW6s8xB3+rwIfv3lkyTJToRN2hACRQWEaoDPL4N3rRiw2
# S4CwNvYJZttRi3ZsHREgoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IC3KgCQ2tEZEXkZFoMcjNaxJRRnBWoDf34Yp+6voG9vNAgZfPS1I028YEzIwMjAw
# ODIzMDQwMjQ4LjI1M1owBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
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
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQg3EnMo0ixVPoTzctuypBp55qDDv92ozU8
# 5AEJpdJS5awwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCCCVPhhBhtKMjxi
# E2/c3YdDcB3+1eTbswVjXf+epZ1SjzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABCX6CvR5702EiAAAAAAEJMCIEIBjmRjwTerYai/wZ
# tkGQOCOhb1wZicFe6Gbg2GhN5HYlMA0GCSqGSIb3DQEBCwUABIIBAF6t5hHy57F2
# zfsG0KUiWAKRz0N2w2TP96+oHJIVIcf0pZVWJk2bA2Vngf9Pju4hSQuH1e0oMYXr
# ma3b7Qo4wD5yccc5Z6V8ysYBghf5PfLv9yKr6GLkYLOAV2rsKGPo766ZFek3+YGu
# S+YV8zdyShYeEFc/vZeS6W0Twch+1lI/L9sQ8qFY5Ny4yeZhs7hOcqBbaQc8vfLN
# pQMnZm8NZ+0QNJBFG6vCNkBLVXekbODTgS11IGb/nO7Df14WeegMywaZeeUlXFVR
# INQz/rJnt5JLair/oYHdIdiXfsBwOPpkSoVukXlzLzaqGLo+f6X+5+Y5GE13J9SS
# SpOa5MICYXI=
# SIG # End signature block
