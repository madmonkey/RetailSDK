<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

<#
.SYNOPSIS
    Allows a user to update a Retail Self-Service deployment.

.DESCRIPTION
    This script provides a mechanism to upload updated Retail Self-Service packages on a customer tenant storage.

.PARAMETER LOGPATH
    Location where all the logs will be stored.

.EXAMPLE 
    # Upload updated Retail Self-Service packages.
    .\UpdateRetailSelfService.ps1

    # Upload updated Retail Self-Service packages along with a custom log path.
    .\UpdateRetailSelfService.ps1 -logFilePath 'C:\Logs\UpdateRetailSelfService.log'
#>

param(
    [string] $logFilePath = 'UpdateRetailSelfService.log'
)

$ErrorActionPreference = 'Stop'

function Check-IsManifestForHotfix(
    [XML]$manifestContent = $(throw 'manifestContent is a mandatory parameter')
)
{
    $packageVersionNode = Select-Xml "//ServiceModelInstallationInfo/CustomVersion" $manifestContent
    $packageVersion = $packageVersionNode.Node.'#text'
    
    $isManifestForHotfix = [System.String]::IsNullOrWhiteSpace($packageVersion)
    return $isManifestForHotfix
}

function Get-XmlNodeInnerText(
    [XML]$xmlData = $(throw 'xmlData is a mandatory parameter'),
    [string]$targetXPath = $(throw 'targetXPath is a mandatory parameter')
)
{
    $xmlNode = Select-Xml $targetXPath $xmlData
    $nodeInnerText = $xmlNode.Node.'#text'
    
    return $nodeInnerText
}

function Get-InstallationInfoFile([string]$scriptsLocation = $(throw 'scriptsLocation parameter is required'))
{
    $filePath = Join-Path $scriptsLocation 'InstallationInfo.xml'
    $customizedFilePath = Join-Path $scriptsLocation 'CustomizedInstallationInfo.xml'
    
    if(Test-Path -Path $customizedFilePath)
    {
        return $customizedFilePath
    }
    elseif(Test-Path -Path $filePath)
    {
        return $filePath
    }
    else
    {
        throw ('Could not locate InstallationInfo.xml or CustomizedInstallationInfo.xml at location {0}' -f $filePath)
    }
}

try
{
    # Import Common-Configuration module.
    $scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
    $selfServiceScriptsRootPath = (Get-Item $scriptDir).Parent.FullName
    Import-Module (Join-Path -Path $selfServiceScriptsRootPath -ChildPath 'SelfServiceConfiguration.psm1') -DisableNameChecking

    # Setup required parameters for 1) Manifest and 2) Upload script
    $manifestFilePath = Get-InstallationInfoFile -scriptsLocation $selfServiceScriptsRootPath
    $uploadScriptFullPath = Join-Path -Path $selfServiceScriptsRootPath -ChildPath 'UploadRetailSelfServicePackages.ps1'

    # Ensure the upload script exists.
    if (-not(Test-Path -Path $uploadScriptFullPath))
    {
        throw ('Could not locate upload script at location {0}' -f $uploadScriptFullPath)
    }
    
    # Read the manifest file.
    $manifestContent = [XML] (Get-Content -Path $manifestFilePath)
    
    # If this is hotfix scenario
    if ((Check-IsManifestForHotfix -manifestContent $manifestContent))
    {
        $packageVersion                      = Get-XmlNodeInnerText -xmlData $manifestContent -targetXPath "//ServiceModelInstallationInfo/Version"
        $packageDescription                  = 'Microsoft hotfix release'
        $asyncServerConnectorServiceExeName  = 'AsyncServerConnectorServiceSetup.exe'
        $modernPosExeName                    = 'ModernPOSSetup.exe'
        $modernPosOfflineExeName             = 'ModernPOSSetupOffline.exe'
        $hardwareStationExeName              = 'HardwareStationSetup.exe'
        $realtimeServiceAX63ExeName          = 'RealtimeServiceAX63Setup.exe'
        $storeSystemExeName                  = 'StoreSystemSetup.exe'
        $winPhonePosAppFileName              = 'RetailModernPOS_ARM.appx'
        $hardwarePeripheralSimulatorFileName = 'VirtualPeripherals.msi'
    }
    else 
    {
        $packageVersion          = Get-XmlNodeInnerText -xmlData $manifestContent -targetXPath "//ServiceModelInstallationInfo/CustomVersion"
        $packageDescription      = Get-XmlNodeInnerText -xmlData $manifestContent -targetXPath "//ServiceModelInstallationInfo/CustomDescription"
        $modernPosExeName        = Get-XmlNodeInnerText -xmlData $manifestContent -targetXPath "//ServiceModelInstallationInfo/ModernPosExeName"
        $modernPosOfflineExeName = Get-XmlNodeInnerText -xmlData $manifestContent -targetXPath "//ServiceModelInstallationInfo/ModernPosOfflineExeName"
        $hardwareStationExeName  = Get-XmlNodeInnerText -xmlData $manifestContent -targetXPath "//ServiceModelInstallationInfo/HardwareStationExeName"
        $storeSystemExeName      = Get-XmlNodeInnerText -xmlData $manifestContent -targetXPath "//ServiceModelInstallationInfo/StoreSystemExeName"
        $winPhonePosAppFileName  = Get-XmlNodeInnerText -xmlData $manifestContent -targetXPath "//ServiceModelInstallationInfo/MPOSWindowsPhoneFileName"
    }

    $mposAndroidAppFileName = Get-XmlNodeInnerText -xmlData $manifestContent -targetXPath "//ServiceModelInstallationInfo/MPOSAndroidFileName"
    $mposiOSAppFileName = Get-XmlNodeInnerText -xmlData $manifestContent -targetXPath "//ServiceModelInstallationInfo/MPOSiOSFileName"

    # Create a mapping between package names and their descriptions.
    $fileNameToDescriptionMapping = @{
        $modernPosExeName        = ('[Retail Modern POS package] - {0}' -f $packageDescription);
        $modernPosOfflineExeName = ('[Retail Modern POS package with offline support] - {0}' -f $packageDescription);
        $hardwareStationExeName  = ('[Retail Hardware Station package] - {0}' -f $packageDescription);
        $storeSystemExeName      = ('[Retail Store Scale Unit package] - {0}' -f $packageDescription);
    }

    # Create a mapping between package names and their PackageType. 
    # Note: PackageType strings need to match labels associated to them in AX.
    $fileNameToPackageTypeMapping = @{
        $modernPosExeName        = 'ModernPosWithoutOffline';
        $modernPosOfflineExeName = 'ModernPosWithOffline';
        $hardwareStationExeName  = 'HardwareStation';
        $storeSystemExeName      = 'RetailStoreScaleUnit';
    }

    if(-not ([System.String]::IsNullOrWhiteSpace($winPhonePosAppFileName)))
    {
        $fileNameToDescriptionMapping.Add($winPhonePosAppFileName, '[Retail Modern POS package for Windows Phone]')
        $fileNameToPackageTypeMapping.Add($winPhonePosAppFileName, 'ModernPosWindowsPhone')
    }

    if(-not ([System.String]::IsNullOrWhiteSpace($mposAndroidAppFileName)))
    {
        $fileNameToDescriptionMapping.Add($mposAndroidAppFileName, '[Modern POS package for Android]')
        $fileNameToPackageTypeMapping.Add($mposAndroidAppFileName, 'ModernPosAndroid')
    }

    if(-not ([System.String]::IsNullOrWhiteSpace($mposiOSAppFileName)))
    {
        $fileNameToDescriptionMapping.Add($mposiOSAppFileName, '[Modern POS package for iOS]')
        $fileNameToPackageTypeMapping.Add($mposiOSAppFileName, 'ModernPosiOS')
    }
	
    if(-not ([System.String]::IsNullOrWhiteSpace($hardwarePeripheralSimulatorFileName)))
    {
        $fileNameToDescriptionMapping.Add($hardwarePeripheralSimulatorFileName, '[Retail Hardware Peripheral Simulator package]')
        $fileNameToPackageTypeMapping.Add($hardwarePeripheralSimulatorFileName, 'PeripheralSimulator')
    }

    if(-not ([System.String]::IsNullOrWhiteSpace($asyncServerConnectorServiceExeName)))
    {
        $fileNameToDescriptionMapping.Add($asyncServerConnectorServiceExeName, '[Async Server Connector service package]')
        $fileNameToPackageTypeMapping.Add($asyncServerConnectorServiceExeName, 'AsyncServerConnectorService')
    }

    if(-not ([System.String]::IsNullOrWhiteSpace($realtimeServiceAX63ExeName)))
    {
        $fileNameToDescriptionMapping.Add($realtimeServiceAX63ExeName, '[Real-time service for Dynamics AX 2012 R3 package]')
        $fileNameToPackageTypeMapping.Add($realtimeServiceAX63ExeName, 'RealtimeServiceAX63')
    }

    # Locates the Packages directory.
    $serviceModelRootFolder = (Get-Item $scriptDir).Parent.Parent.FullName
    $packagesFolderPath =  Join-Path -Path $serviceModelRootFolder -ChildPath 'Packages'

    $aosWebsiteNameObjectFromRegistry = Get-ItemProperty -Path (Get-SelfServiceRegistryPath) -Name 'AOSWebsiteName' -ErrorAction SilentlyContinue
    $aosWebsiteName = $aosWebsiteNameObjectFromRegistry.AOSWebsiteName
    
    $scriptExecutionFailed = $false
    [System.Collections.ArrayList]$failedPackagesList = @()

    foreach ($packageName in $fileNameToPackageTypeMapping.Keys)
    {
        $packageFilePath = (Join-Path -Path $packagesFolderPath -ChildPath $packageName)

        if ((Test-Path -Path $packageFilePath))
        {
            Write-Log ('Initiating auto package upload for package at location {0}.' -f $packageFilePath) -LogFile $logFilePath
            $Global:LASTEXITCODE = 0

            & $uploadScriptFullPath `
                    -PackageFilePath $packageFilePath `
                    -PackageDescription $fileNameToDescriptionMapping[$packageName] `
                    -PackageVersion $packageVersion `
                    -PackageType $fileNameToPackageTypeMapping[$packageName] `
                    -AOSWebsiteName $aosWebsiteName `
                    -LogFile $logFilePath

            $exitCodeCaptured = $Global:LASTEXITCODE

            if($exitCodeCaptured -ne 0)
            {
                $scriptExecutionFailed = $true
                $failedPackagesList.Add($packageFilePath)
                $failedPackagesList.Add([System.Environment]::NewLine)
            }
        }
        else
        {
            Write-Log ('Package location {0} is not valid. If this package exists please upload the file manually.' -f $packageFilePath) -LogFile $logFilePath
        }
    }

    if($scriptExecutionFailed)
    {
        throw "Following packages could not be uploaded. Please upload them manually. $failedPackagesList"
    }

    Write-Log -objectToLog 'Script execution completed successfully' -logFile $logFilePath
    exit 0
}
catch
{
    Write-Log ($global:error[0] | Format-List * -Force | Out-String -Width 4096) -logFile $logFilePath
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine
    Write-Log ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine) -logFile $logFilePath
    throw ("Script execution failed. Please find the logs at {0}." -f $logFilePath)
}


# SIG # Begin signature block
# MIIj/wYJKoZIhvcNAQcCoIIj8DCCI+wCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBUtTd5DsiGpiT6
# tb+MgMecvTA6A4yIr8WT8kMab/Ljl6CCDYEwggX/MIID56ADAgECAhMzAAABh3IX
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
# RcBCyZt2WwqASGv9eZ/BvW1taslScxMNelDNMYIV1DCCFdACAQEwgZUwfjELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9z
# b2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAxMQITMwAAAYdyF3IVWUDHCQAAAAABhzAN
# BglghkgBZQMEAgEFAKCCAScwGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYK
# KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIOcG3DWM
# BEloZHNhIYFWhS071GocXYHswwMKiAtDGAjDMIG6BgorBgEEAYI3AgEMMYGrMIGo
# oIGJgIGGAFMAaQBtAHAAbABpAGYAeQBDAG8AbQBtAGUAcgBjAGUALgBNAGkAYwBy
# AG8AcwBvAGYAdABEAHkAbgBhAG0AaQBjAHMALgBDAG8AbgBuAGUAYwB0AG8AcgAu
# AFAAbwByAHQAYQBiAGwAZQAuAHIAZQBzAG8AdQByAGMAZQBzAC4AZABsAGyhGoAY
# aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAEFBprSA
# nqwLZN9DMCbBOu+0TV/z3M6DsfI9iYWxJslmYFy/V08DZlh40fVllj4dx2mz5fOM
# guHoNrurXpCeWuz4cE7LeLcjEOScr2UzLpviT9JgDuu+x1wF7luRzxhs9Ak1mtQ9
# 4wnJa2nfhi2zI4J23SXUbxBks+HWGK37lB05R54wN1RlPvrXWLnvHvCq6YkOOEsI
# R+owPW/zbvJoxDe7d51cV2s4ekqs1P0tZaASAot1d+6YTSFaaS9eI7ZfcTN/mAPc
# L6Q2TrJXZIho8ETuBiZrMzt5jsoqoxqyBHDh9mYbrl0dKIpKqkfyZq2oVD5Blz/T
# 89IgFHf8BS4p+7yhghLkMIIS4AYKKwYBBAGCNwMDATGCEtAwghLMBgkqhkiG9w0B
# BwKgghK9MIISuQIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBUAYLKoZIhvcNAQkQAQSg
# ggE/BIIBOzCCATcCAQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQgOJuE
# fS79hTMcpAm4NWHU7qWYvlCT6OzeUfZfzaobkfECBl86qc71ahgSMjAyMDA4MjMw
# NDAyNDguODlaMASAAgH0oIHQpIHNMIHKMQswCQYDVQQGEwJVUzETMBEGA1UECBMK
# V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
# IENvcnBvcmF0aW9uMSUwIwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRp
# b25zMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpENkJELUUzRTctMTY4NTElMCMG
# A1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaCCDjwwggTxMIID2aAD
# AgECAhMzAAABHg685UsWogMbAAAAAAEeMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
# BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
# HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
# dCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTExMzIxNDA0MFoXDTIxMDIxMTIx
# NDA0MFowgcoxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
# VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJTAj
# BgNVBAsTHE1pY3Jvc29mdCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRo
# YWxlcyBUU1MgRVNOOkQ2QkQtRTNFNy0xNjg1MSUwIwYDVQQDExxNaWNyb3NvZnQg
# VGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
# AQEAzhO3GBCi/PXwXK6s7fwbdaqVX560sWMJWILN69wv7RpWXhRKJ3MqjmvkUWBk
# H1vqdwCR8AnFh/rGZDjYcOa2mO75wrY7birfG76jUNGnsMV3fbrUecFlVF+cShHs
# 8AiH156cGr4sUfhnekCsvdTXLxPBV0FT3VYQ69xTIszqpKnIch2K4+DPS4LcW5Ig
# 8nGsbGr91+vE7bXMKQXDAp9qGxUmYwmlFcx2xq+hH6C9N03mm8dFmaxHtse0E9GZ
# GEAQmJiUtVF0EgFVY6m9cJzF6+/tR/Hxy63df3bTNg7Efw18J8BKM/WdVKa3n5aY
# d3dVdiG1fcyjnn14KfyAdmkUuwIDAQABo4IBGzCCARcwHQYDVR0OBBYEFIwTKOeR
# eEbgS/t+mz/ZryfaZopbMB8GA1UdIwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1V
# MFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kv
# Y3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNybDBaBggrBgEF
# BQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9w
# a2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3J0MAwGA1UdEwEB/wQC
# MAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBAC5k3I51
# liOQghMiVA0l6HY0hzzdsN6IgEUg74OYyNux9oY+6/Qvv/njFOZH5MyPZkyf95tb
# mlMmhr1jvmhl3xeoU78oRgEKNqHJcLkHHD6lapPvQEayD6bQh0ZhoUAMlhCbo1YL
# Vq1jfyrSixx+hliAZHhMckiRdmk37u4+vXID8+Qw0r5d1JoIVAZdbk11If9DHkLJ
# IXcHyeASlGiztqgAF5pUB+NrUVWrGtKjWDHT5u8RdWEFZa9RAZ75vZVB02m9DalR
# fhLupG59y1LNKIB4FpgQJpEI1jmsrWi8sDCIR3cGDsqe0sGiVB8evXD9VzaznaJJ
# xoVF6HTh0l1+IW0wggZxMIIEWaADAgECAgphCYEqAAAAAAACMA0GCSqGSIb3DQEB
# CwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
# BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYD
# VQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgMjAxMDAe
# Fw0xMDA3MDEyMTM2NTVaFw0yNTA3MDEyMTQ2NTVaMHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqR0N
# vHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvtfGhLLF/Fw+Vhwna3PmYrW/AVUycE
# MR9BGxqVHc4JE458YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs1nMwVyaCo0UN0Or1
# R4HNvyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLBxKZd0WETbijGGvmGgLvfYfxG
# wScdJGcSchohiq9LZIlQYrFd/XcfPfBXday9ikJNQFHRD5wGPmd/9WbAA5ZEfu/Q
# S/1u5ZrKsajyeioKMfDaTgaRtogINeh4HLDpmc085y9Euqf03GS9pAHBIAmTeM38
# vMDJRF1eFpwBBU8iTQIDAQABo4IB5jCCAeIwEAYJKwYBBAGCNxUBBAMCAQAwHQYD
# VR0OBBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQBgjcUAgQMHgoAUwB1
# AGIAQwBBMAsGA1UdDwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8GA1UdIwQYMBaA
# FNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9j
# cmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jvb0NlckF1dF8y
# MDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6
# Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljUm9vQ2VyQXV0XzIwMTAt
# MDYtMjMuY3J0MIGgBgNVHSABAf8EgZUwgZIwgY8GCSsGAQQBgjcuAzCBgTA9Bggr
# BgEFBQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL1BLSS9kb2NzL0NQUy9k
# ZWZhdWx0Lmh0bTBABggrBgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBQAG8AbABp
# AGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkqhkiG9w0BAQsFAAOCAgEA
# B+aIUQ3ixuCYP4FxAz2do6Ehb7Prpsz1Mb7PBeKp/vpXbRkws8LFZslq3/Xn8Hi9
# x6ieJeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/XPleFzWYJFZLdO9C
# EMivv3/Gf/I3fVo/HPKZeUqRUgCvOA8X9S95gWXZqbVr5MfO9sp6AG9LMEQkIjzP
# 7QOllo9ZKby2/QThcJ8ySif9Va8v/rbljjO7Yl+a21dA6fHOmWaQjP9qYn/dxUoL
# kSbiOewZSnFjnXshbcOco6I8+n99lmqQeKZt0uGc+R38ONiU9MalCpaGpL2eGq4E
# QoO4tYCbIjggtSXlZOz39L9+Y1klD3ouOVd2onGqBooPiRa6YacRy5rYDkeagMXQ
# zafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA3+cxB6STOvdlR3jo+KhIq/fecn5h
# a293qYHLpwmsObvsxsvYgrRyzR30uIUBHoD7G4kqVDmyW9rIDVWZeodzOwjmmC3q
# jeAzLhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8ZQU3ghvkqmqMRZjDTu3QyS99j
# e/WZii8bxyGvWbWu3EQ8l1Bx16HSxVXjad5XwdHeMMD9zOZN+w2/XU/pnR4ZOC+8
# z1gFLu8NoFA12u8JJxzVs341Hgi62jbb01+P3nSISRKhggLOMIICNwIBATCB+KGB
# 0KSBzTCByjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjElMCMG
# A1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3BlcmF0aW9uczEmMCQGA1UECxMdVGhh
# bGVzIFRTUyBFU046RDZCRC1FM0U3LTE2ODUxJTAjBgNVBAMTHE1pY3Jvc29mdCBU
# aW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMCGgMVADnJBuPt6asxE/6ON1i6
# ylmMyrDcoIGDMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
# b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
# dGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJ
# KoZIhvcNAQEFBQACBQDi7GheMCIYDzIwMjAwODIzMTIwMDMwWhgPMjAyMDA4MjQx
# MjAwMzBaMHcwPQYKKwYBBAGEWQoEATEvMC0wCgIFAOLsaF4CAQAwCgIBAAICEEIC
# Af8wBwIBAAICEZAwCgIFAOLtud4CAQAwNgYKKwYBBAGEWQoEAjEoMCYwDAYKKwYB
# BAGEWQoDAqAKMAgCAQACAwehIKEKMAgCAQACAwGGoDANBgkqhkiG9w0BAQUFAAOB
# gQA7QPCli36w2i28xtBvY9/yEkEArd+WJZ8mFExCOhrSskhJGJckoeEdRLZhe04z
# H5TPUP2NmQDe2xOGQp/aOSU8uJFupKVnhxcB3gdNIPnyeGY5XGdmFZHzCC5vglUq
# L3CjHo3JHvqMsCg1Dwp43K9LpIf97zii+hXaXNwPsX90nzGCAw0wggMJAgEBMIGT
# MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
# ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
# HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABHg685UsWogMbAAAA
# AAEeMA0GCWCGSAFlAwQCAQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQ
# AQQwLwYJKoZIhvcNAQkEMSIEIFeWin2fH4M92jKwmaP90EhCTxulNdJhVG/YAH8X
# fhhXMIH6BgsqhkiG9w0BCRACLzGB6jCB5zCB5DCBvQQgczvkWMPfcTpR5b2nnzyh
# N3EtzSXVlPH6IgQcD43WX0cwgZgwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UE
# CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
# b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQ
# Q0EgMjAxMAITMwAAAR4OvOVLFqIDGwAAAAABHjAiBCCf9JwyZLc3w4H6XeaJtngU
# tEstEGOqGHH1DNlgjRYJ6zANBgkqhkiG9w0BAQsFAASCAQBsV+j+WJptoYPKQXgf
# O56+j+C3dzWvi/5CnLu529d4091ZDH5xBNXpFoC2kLomJU9qgmGgL8y+KReMll19
# zERc210ZFablzfTf1Ele5Hu/ZrbKKn5uXDsD0QK9V+Z3wmhcVwHXqXzv3Hk8JphH
# yz42t6e7eGl75NLY0FKXoXkLmlvMd8C6CT3P5G4pA3YnBI6VMN7SAWAbl5NsMih7
# o530FuVyibR/QRyIL9Pir/Geck6NjM+FJWIlr2QAfJdCePla4tX6aAfQqk6oCWKc
# ZsXOq1isaRqW68UIW4Sf8qXptVhC1ipyodF6hWWIn5lChuQRnSqUBvSkpeYfMUdF
# PvOj
# SIG # End signature block
