<#
.SYNOPSIS
    Makes all the necessary updates to the Retail Server deployment to account
	for a new certificate with respect to the authentication related public keys
	exposed through Retail Server. Makes updates to certs.json and openid-configuration.json 
    files under Retail server auth folder. These files are exposed publicly to comply with openid standard.

.PARAMETER  CertificateThumbprint
    The thumbprint to use to lookup the certificate.

.PARAMETER  RetailServerDeploymentPath
    Path to the Retail Server deployment.
    
#>
PARAM ([validatenotnullorempty()][string] $RetailServerDeploymentPath,
       [validatenotnullorempty()][string] $RetailServerUrl,
       [validatenotnullorempty()][string] $CertificateThumbprint)
   
Write-Host "Retrieving certificates that match the thumbprint '$CertificateThumbprint' ..."
$certificates = Get-ChildItem -Recurse cert:\LocalMachine\ | Where { $_.Thumbprint -eq $CertificateThumbprint }

if ($certificates.Count -eq 0)
{
    throw "Did not find any certificate that matches the thumbprint $CertificateThumbprint."
}

# Assuming that we might find multiple certificates with the same thumbprint
# (these are assumed to be the same certificate).
$certificateSubject = $certificates[0].Subject
Write-Host "Found the certificate that matches the thumbprint '$CertificateThumbprint' with subject '$certificateSubject'. Retrieving all other certificates that match the same subject ..."

$certificates = Get-ChildItem -Recurse cert:\LocalMachine\ | Where { $_.Subject -eq $certificateSubject } | sort-object -Property Thumbprint -Unique 
$numberOfAdditionalCertificates = $certificates.Count
Write-Host "Found $numberOfAdditionalCertificates matching the subject '$certificateSubject'. Started processing all certificates ..."

$keys = @();

foreach ($certificate in $certificates)
{
    $jsonCertThumbprint = $certificate.Thumbprint
    Write-Host "Adding information for certificate with thumbprint '$jsonCertThumbprint' to the Certs.json file."
	
	$exportParameters = $certificate.PublicKey.Key.ExportParameters($false)
	$n = [System.Convert]::ToBase64String($exportParameters.Modulus)
	$e = [System.Convert]::ToBase64String($exportParameters.Exponent)
	
	$certificateElement = (New-Object PSObject |
        Add-Member -PassThru NoteProperty kty 'RSA' |
        Add-Member -PassThru NoteProperty alg 'RS256' |
		Add-Member -PassThru NoteProperty use 'sig' | 
		Add-Member -PassThru NoteProperty kid $jsonCertThumbprint |
		Add-Member -PassThru NoteProperty n $n |
		Add-Member -PassThru NoteProperty e $e )

	$keys += $certificateElement
}

$retailServerCertFilePath = (Join-Path $RetailServerDeploymentPath 'Auth\Certs\Certs.json')
Write-Host "Retrieving the Certs.json file under the following path '$retailServerCertFilePath' ..."

$rsUrl = $RetailServerUrl
$rsUrl = $rsUrl.Trim().TrimEnd('/')

$idxOfCommerce = $rsUrl.IndexOf('/commerce', [System.StringComparison]::OrdinalIgnoreCase)
if ($idxOfCommerce -ne -1)
{
    $rsUrl = $rsUrl.Substring(0, $idxOfCommerce);
}
$retailServerUserAuthUrl = $rsUrl + '/auth'
Write-Host "Using Retail server url: $RetailServerUrl"

if ((Test-Path $retailServerCertFilePath) -eq $false)
{
   Write-Warning "Could not find the Certs.json file $retailServerCertFilePath"
}
else
{
    Write-Host "Writing public cert keys to file '$retailServerCertFilePath' ..."
    $obj = (New-Object PSObject | Add-Member -PassThru NoteProperty keys $keys) | ConvertTo-Json | Out-File $retailServerCertFilePath
}

$retailServerOpenIdConfigurationFilePath = (Join-Path $RetailServerDeploymentPath 'Auth\.well-known\openid-configuration\openid-configuration.json')
Write-Host "Retrieving the openid-configuration.json file under the following path '$retailServerOpenIdConfigurationFilePath' ..."
if ((Test-Path $retailServerOpenIdConfigurationFilePath) -eq $false)
{
   Write-Warning "Could not find the openid-configuration.json file $retailServerOpenIdConfigurationFilePath"
}
else
{
    Write-Host "Updating issuer '$retailServerUserAuthUrl' in file '$retailServerOpenIdConfigurationFilePath' ..."

    $jsonData = Get-Content $retailServerOpenIdConfigurationFilePath -raw | ConvertFrom-Json
    $jsonData.issuer = $retailServerUserAuthUrl
    $jsonData.token_endpoint = $retailServerUserAuthUrl + '/token'
    $jsonData.jwks_uri = $retailServerUserAuthUrl + '/certs/Certs.json'
    $jsonData | ConvertTo-Json | Set-Content $retailServerOpenIdConfigurationFilePath
}

Write-Host "Updating retail server web.config with correct certificate thumbprint and issuer ..."
$retailServerWebConfigPath = (Join-Path $RetailServerDeploymentPath 'web.config')
if ((Test-Path $retailServerWebConfigPath) -eq $false)
{
   Write-Warning "Could not find the web.config file $retailServerWebConfigPath"
}
else
{
    $webConfig = New-Object xml
    $webConfig.psbase.PreserveWhitespace = $true
    $webConfig.Load($retailServerWebConfigPath)
    $webConfig.configuration.retailServer.authentication.CertThumbprint = $CertificateThumbprint
    $CommerceTokenIssuer = $webConfig.SelectSingleNode('configuration/appSettings/add[@key="CommerceTokenIssuer"]')
    $CommerceTokenIssuer.Attributes['value'].Value = $retailServerUserAuthUrl
    $webConfig.Save($retailServerWebConfigPath)
}



# SIG # Begin signature block
# MIIkAQYJKoZIhvcNAQcCoIIj8jCCI+4CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBGOlWIilDdPcz6
# WR82qWRtX8t58IriD3Lh4egfJH2vpaCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCDD
# 5Hz6f/QXxFGbEMPSMMzjaPJklSg1Z/NwfjDv03nhNjCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBR
# R8PetZyOoxQ1FEQuYwCJ7OIDS2FLfPjS+uIsTi1UcyTGWSTkoxTMtnSauwSKcHpk
# ReIBUAEMGMnS7zJ+rlIecBLO05wLkxgJolB/2rGuHflvGr0sY3wLvRtvi9rQdb7O
# hkwwPPJ47nEagjPEYQv/4vOQzmb52b+Pl9YDurcIfOLrdAlXiNaw0W8g2zB5ToZ6
# FBdxyQOvTHhIdfTfI9ys06uW42fw3rv3Uf/Qp2UnLXcEIyT7j6mrQNuSvpppo0so
# 2zYjwm6FV3h+CdcvHDGlPAfsEeb1Hj3XiIochlBexJbGNR74ONiWn2rYVZX6mAr8
# 3v/8radUyZOGr78kI9zToYIS4jCCEt4GCisGAQQBgjcDAwExghLOMIISygYJKoZI
# hvcNAQcCoIISuzCCErcCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IEnALBJ84yOIFmK4OFv/Rc5/R//wC39YuMIq3hlD6TvcAgZfPS2zAX0YEzIwMjAw
# ODIzMDQwMjQ3LjU1OVowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
# VQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25z
# IExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjE3OUUtNEJCMC04MjQ2
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOOTCCBPEw
# ggPZoAMCAQICEzMAAAEMqnhu3MxCTMEAAAAAAQwwDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTE2WhcNMjEw
# MTIxMjMxOTE2WjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
# BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UE
# CxMdVGhhbGVzIFRTUyBFU046MTc5RS00QkIwLTgyNDYxJTAjBgNVBAMTHE1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQCrnTXX5epUmZAq2LDf2KB4Qy8ItxnV+itubGwOSmcI3VKtOEoj6fY+
# vfOpPMlWB0kUKgqbWSzWC1Ensdovq0OSs7DxcmZ8lrHJACW4JD57jQ0j4DjD67n0
# bLz0BVjmUk2uYK9rqCjN+DWTHDpptXlZav4+MSk0KyE7iHG/dSqAxwIqdPZhVJnM
# XUbLsA+5vV9jQ/W80S44Uqs0IQS9YgpGuqx7IEHvcbwoPbLDqN/PRUrE1JEB2ElX
# +CE7KsO3lr4voLebWumvyyqKh/eKiG/cA0iA2rDp7H7j4b4Hskxsgdsak915t50v
# p49u4EKduAmgOffjSTRrDqKPbUa+9SeRAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
# CUI6r0MMhrQDSiqAq0zm+O5l4r4wHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8Uz
# aFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
# L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoG
# CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
# Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
# AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEA
# RPfEGD8hn3N05/BsMYrtwreopi3+pQ6VtEHOB42NvfYrzqcZ5EaQF57XR1U4QZZT
# Doq0F5aHUtDvRvrj+0u2Ityx/0nNoDINhvWxGYyLl+NFnvndOq5pPxXs0ntF8S5h
# +9mW5t9APQxVtTi3Ox1l1i7ETftXYn2k3z2PsagU20CdKcKfUxHEQ0AguC31fN5D
# NMQOEVhbQ3YM2mFORE9caOkObCLpa2Qnl+/SJPIHh3AQL7953SUZsUtzK0mgzB9M
# 0x0fqByceUzOyeKiucYVlrk8+JXvxehn0V66kqjxko0aEsssHkZO2p8d7HmejeKh
# VKr422G+FfQj9X6JcmyimjCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZI
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
# Ex1UaGFsZXMgVFNTIEVTTjoxNzlFLTRCQjAtODI0NjElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAyyD0VD2mA8tc
# jYt3nPvENLRABn2ggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
# MDANBgkqhkiG9w0BAQUFAAIFAOLsSVYwIhgPMjAyMDA4MjMwOTQ4MDZaGA8yMDIw
# MDgyNDA5NDgwNlowdDA6BgorBgEEAYRZCgQBMSwwKjAKAgUA4uxJVgIBADAHAgEA
# AgIOsjAHAgEAAgIRjzAKAgUA4u2a1gIBADA2BgorBgEEAYRZCgQCMSgwJjAMBgor
# BgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEBBQUA
# A4GBAEOSj5A3YUUXt6SL+Ip6OURgFyPEvoloK5g3DO407X/7UUfgKvqBF/hw/k89
# CNzqHk3vdGwKjJD5ZDAVVpipwPaRLdPa2QX4vjKorwID41FSLw15FcQc5S8KQS4+
# Fu6Vnog5Pq+ANGSUZ2/tqVbt+vJwrZB+qMXgt25W7TxR9hxuMYIDDTCCAwkCAQEw
# gZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
# B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UE
# AxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEMqnhu3MxCTMEA
# AAAAAQwwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG9w0B
# CRABBDAvBgkqhkiG9w0BCQQxIgQgvuZcEhdENV+tzoijf7IODoBTLh2QN2u0Mw9G
# bLtRahAwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCCDkBYpfszX6bb//5Xu
# qZG+3Ur/DDky67xfMYkGrKBUKTCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
# IFBDQSAyMDEwAhMzAAABDKp4btzMQkzBAAAAAAEMMCIEIF3Bm68SnK04QskPa2Qz
# z043eGNJdB1bHhboXGOIGsM0MA0GCSqGSIb3DQEBCwUABIIBAIHmQNjx5QXCh2ZB
# jypbhqMAW/Jfq3aXYo1z0qHRpsU2ItC0KA4D/RC1VAAqInu6iMiYb5v48NwycX1O
# GQJeHkWfPGg2UWwgN0As6fXhLtV/l0qDSZQjIksF6h8WeF9Xg6aKLG73v0UeIMip
# ixuXfVLK6BOcVTdyUyovlcnXpp6fWfs97MwQnlaOtKZ8gGlg4NigVmKEUQt4p2yT
# HUbT0aKvI+qDwFe8P/RGB444xZMjarClrHECzVe0Eq4iiLRFvJwM/jIm9b3AWA+J
# HFS9r3V1LXt0Gh+G4Teci2eh95cYQekHPLb29kpiU1AdLvLvONu0ZR8vM4x6nozk
# qW4vukc=
# SIG # End signature block
