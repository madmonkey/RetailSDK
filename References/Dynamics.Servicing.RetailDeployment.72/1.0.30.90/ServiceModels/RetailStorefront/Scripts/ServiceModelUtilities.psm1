<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
. $scriptDir\Common-Web.ps1
. $scriptDir\Common-Configuration.ps1

function Remove-ServiceModelInstallationInfoEntry(
    [string]$serviceModelName = $(throw 'serviceModelName is required.'),
    [ValidateNotNullOrEmpty()]
    [string]$pathToAxInstallationInfoDll = $(throw 'pathToAxInstallationInfoDll is required.'),
    [string]$logFile = $(throw 'logFile is required.')
)
{
    if (-not(Test-Path -Path $pathToAxInstallationInfoDll))
    {
        throw 'Unable to locate required assembly Microsoft.Dynamics.AX.AXInstallationInfo.dll'
    }

    # Load the installationInfo assembly
    Add-Type -Path $pathToAxInstallationInfoDll

    # Get a list of all installed service models and locate target service model entry, if present.
    $installedServiceModelInfoList = [Microsoft.Dynamics.AX.AXInstallationInfo.AXInstallationInfo]::GetInstalledServiceModel()
    $targetServiceModelInfo = $installedServiceModelInfoList | ? {$_.Name -ieq $serviceModelName}

    if ($targetServiceModelInfo)
    {
        $targetedServiceModelInstallInfoEntryPath = $targetServiceModelInfo.InstallationInfoFilePath

        if (Test-Path -Path $targetedServiceModelInstallInfoEntryPath)
        {
            Write-Log ('Located installationInfo entry for service model {0} at path {1}.' -f $serviceModelName, $targetedServiceModelInstallInfoEntryPath) -logFile $log
            
            # targetedServiceModelInstallInfoEntryPath will always be a leaf node.
            Remove-Item -Path $targetedServiceModelInstallInfoEntryPath -Force
            Write-Log ('InstallationInfo entry for service model {0} successfully removed.' -f $serviceModelName) -logFile $log
        }
    }
    else
    {
        Write-Log ('Unable to locate installationInfo entry for service model {0}. Skipping removal.' -f $serviceModelName) -logFile $log
    }
}

function Get-DecodedConfigurationString(
    [string]$encodedConfigString = $(throw 'encodedConfigString is required.'),
    [string]$logFile = $(throw 'logFile is required.')
)
{
    Write-Log -objectToLog ('Input configuration string: {0}' -f $encodedConfigString) -logFile $log
    $jsonConfigString = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($encodedConfigString))

    $decodedConfigurationString = ConvertFrom-Json $jsonConfigString
    return $decodedConfigurationString
}

function Get-ServiceModelXmlAttributeValue(
    [ValidateNotNullOrEmpty()]
    [string]$encodedServiceModelXml = $(throw 'encodedServiceModelXml is required.'),

    [ValidateNotNullOrEmpty()]
    [string]$xPathToTargetAttribute = $(throw 'xPathToTargetAttribute is required.'),
    [string]$logFile = $(throw 'logFile is required.')
)
{
    [xml]$decodedServiceModelXml = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($encodedServiceModelXml))
    $targetXmlNode = $decodedServiceModelXml.SelectSingleNode($xPathToTargetAttribute)

    $result = ''
    if ($targetXmlNode -eq $null)
    {
        Write-Log ('Null valued XML node located at XPath {0}' -f $xPathToTargetAttribute) -logFile $logFile
    }
    else
    {
        $result = $targetXmlNode.GetAttribute('Value')
    }

    return $result
}

function Uninstall-RetailWebService(
    [string]$serviceModelName = $(throw 'serviceModelName is required.'),
    [string]$encodedConfigString = $(throw 'encodedConfigString is required.'),
    [string]$pathToAxInstallationInfoDll = $(throw 'pathToAxInstallationInfoDll is required.'),
    [string]$logFile = $(throw 'logFile is required.')
)
{
    # Decode the input service model configuration xml.
    $decodedConfigurationString = Get-DecodedConfigurationString -encodedConfigString $encodedConfigString -logFile $logFile

    # Retrieve the required values.
    $retailWebServiceWebSiteName = $($decodedConfigurationString.WebSiteName)
    $retailWebServiceRootPath = $($decodedConfigurationString.WebRoot)

    Invoke-ScriptAndRedirectOutput `
                        -scriptBlock `
                        {
                            Remove-RetailWebsiteAndAssociatedBinaries -webSiteName $retailWebServiceWebSiteName `
                                                                      -appPoolName $retailWebServiceWebSiteName `
                                                                      -webSitePhysicalPath $retailWebServiceRootPath

                            Remove-ServiceModelInstallationInfoEntry -serviceModelName $serviceModelName `
                                                                     -pathToAxInstallationInfoDll $pathToAxInstallationInfoDll `
                                                                     -logFile $logFile
                        } `
                        -logFile $logFile
}

Export-ModuleMember -Function Get-ServiceModelXmlAttributeValue
Export-ModuleMember -Function Get-ProductVersionMajorMinor
Export-ModuleMember -Function Log-TimedMessage
Export-ModuleMember -Function Remove-ServiceModelInstallationInfoEntry
Export-ModuleMember -Function Uninstall-RetailWebService
Export-ModuleMember -Function Write-Log


# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDt1mGwBcytKG4L
# mI1AVJYgHRymVqY6pg+EVaacjmUsM6CCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBh
# Dql/+1iUD6b7H8NoeL+x0cKxn7HbJWil2ZxDRCkVljCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBy
# KItsYR5mwKWsFgAPdExrCcqycFqE39P+JIHnGVooWr9ImdSYWtLcOFhUam2MIolI
# vyll9NSattCzeNhq/inSAjp1054wxtyMuldM0PYJUYZRlXb0T0bAug3LNVAJK/JJ
# k0exiaBp7el3NBKeIlOQSudp034eUW6e6QEz2Hy+oPZKO13qKn7svuRlnpEzWfeW
# 8A/dUIzTCIQFytLyYSLcQ6RI7TZsdIjY+RO/WGaNcBv61M1HVoXS9HqTGOnBT2+r
# 0Vr7m/rgKme8vrEoo7zdEoICltnEVrm3PAOqP2dgArAi2KEkMCsK6UQjXNu9YbGP
# aB/7ldLVQa/pAk2gm6UAoYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IPG5zIQerNWeKiX524BJqbS9+wu+s2Qkk9ZY9Q5C0dPFAgZfO+TbzkQYEzIwMjAw
# ODIzMDQwMjUxLjg0OFowBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
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
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgD34mCN8czs5tKz6R
# j8nMd15Bm6+PcBMLZldOA4MhCNYwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCBd38ayLm8wX/qJfYIOH5V+YvlG+poWQXCW6LKN70H3DjCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABJYvei2xyJjHdAAAAAAElMCIE
# IFyMAnv+fUcjmWSAGq2rLycrpXVbWCMYEJkLrAOY/VnLMA0GCSqGSIb3DQEBCwUA
# BIIBAAlyd6skgPqrewoso92CQTorM/cuuaWHWuE3m7TkhDx3yzpFWqEhtchLKVZi
# W7CKRonOIxOkA4tvhuZ/WOSEkbVNIWogW6gz0Zs96d6B5DOLJ+6q4JpXqHLxhpkl
# R6FrDia59LEx+clth4fVfVLQaRk+1ZUgZhbbj1nS+Vo56z8QxBup0FSigapsSBrx
# F0fymnmxrdU9xUiSSg66wOxnwR0GRnC8m3W/PLwjCL7wntulpB2vKVsGcSfkRr+1
# coW1IFxVb7zTSoqdMIhCD5Iz7hVnEvpzku1vihTrNrFpajFP5W4EQF+lQuBbCOeg
# MIbn4AWOcITP9TVd1H/TbJRDil8=
# SIG # End signature block
