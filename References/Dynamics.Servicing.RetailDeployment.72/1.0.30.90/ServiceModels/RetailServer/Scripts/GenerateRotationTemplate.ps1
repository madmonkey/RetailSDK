<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

param(
    [string]$targetLocation = $(throw 'targetLocation is required!')
)

$ErrorActionPreference = 'Stop'

function Generate-RetailServerServicingTemplate
{
    $retailServerRotationInfo = New-Object Microsoft.Dynamics.AX.Servicing.Rotation.RotationInfo

    # Generate key-value pairs for Retail Data Sync user and Retail Runtime user.
    $oldRetailDataSyncUserKeyValuePair = Create-KeyValuePair -key 'OldRetailDataSyncUser.Username' -value '[userId]' -encryptData $false
    $oldRetailRuntimeUserKeyValuePair = Create-KeyValuePair -key 'OldRetailRuntimeUser.Username' -value '[userId]' -encryptData $false

    $retailDataSyncUserKeyValuePair = Create-KeyValuePair -key 'NewRetailDataSyncUser.Username' -value '[userId]' -encryptData $false
    $retailRuntimeUserKeyValuePair = Create-KeyValuePair -key 'NewRetailRuntimeUser.Username' -value '[userId]' -encryptData $false
    $axDeployUserKeyValuePair = Create-KeyValuePair -key 'AxDeployUser.Username' -value '[userId]' -encryptData $false
    $axDeployExtUserKeyValuePair = Create-KeyValuePair -key 'AxDeployExtUser.Username' -value '[userId]' -encryptData $false

    $retailDataSyncUserPasswdKeyValuePair = Create-KeyValuePair -key 'NewRetailDataSyncUser.Password' -value '[Password]' -encryptData $true
    $retailRuntimeUserPasswdKeyValuePair = Create-KeyValuePair -key 'NewRetailRuntimeUser.Password' -value '[Password]' -encryptData $true
    $axDeployUserPasswdKeyValuePair = Create-KeyValuePair -key 'AxDeployUser.Password' -value '[Password]' -encryptData $true
    $axDeployExtUserPasswdKeyValuePair = Create-KeyValuePair -key 'AxDeployExtUser.Password' -value '[Password]' -encryptData $true

    $channelDatabaseServerNameKeyValuePair = Create-KeyValuePair -Key 'ChannelDatabaseServerName' -value '[ChannelDatabaseServerName]' -encryptData $false
    $channelDatabaseNameKeyValuePair = Create-KeyValuePair -Key 'ChannelDatabaseName' -value '[ChannelDatabaseName]' -encryptData $false

    # Generate certificate node for SSL certificate. This object will be re-used for encryption cert.
    $sslCertificate = Create-CertificateNode -pfxFile '[sslCertPfxFile]' -password '[password]' -certStore '[certStore]' -thumbprint '[thumbprint]'
    $encryptionCertificate = Create-CertificateNode -pfxFile '[dataEncryptionCertPfxFile]' -password '[password]' -certStore '[certStore]' -thumbprint '[thumbprint]'
    $rtsAuthPersonalStoreCertificate = Create-CertificateNode -pfxFile '[rtsAuthCertPfxFile]' -password '[password]' -certStore 'My' -thumbprint '[thumbprint]'
    $rtsAuthRootStoreCertificate = Create-CertificateNode -pfxFile '[rtsAuthCertPfxFile]' -password '[password]' -certStore 'Root' -thumbprint '[thumbprint]'

    # Generate certificate thumbprint nodes for SSL and encryption certificates.
    $dataEncryptionCertThumbprint   = Create-CertThumbprintNode -key 'DataAccess.DataEncryptionCertificateThumbprint' -value '[thumbprint]' -position 0
    $retailSSLCertThumbprint        = Create-CertThumbprintNode -key 'NewRetailSSLCertificate' -value '[thumbprint]' -position 0
    $retailRTSAuthCertThumbprint    = Create-CertThumbprintNode -key 'NewRetailRTSAuthenticationCertificate' -value '[thumbprint]' -position 0
    $oldRetailRTSAuthCertThumbprint = Create-CertThumbprintNode -key 'OldRetailRTSAuthenticationCertificate' -value '[thumbprint]' -position 0

    # Add SSL and encryption certificates.
    [void]($retailServerRotationInfo.Certificates.Add($sslCertificate))
    [void]($retailServerRotationInfo.Certificates.Add($encryptionCertificate))
    [void]($retailServerRotationInfo.Certificates.Add($rtsAuthPersonalStoreCertificate))
    [void]($retailServerRotationInfo.Certificates.Add($rtsAuthRootStoreCertificate))

    # Add SSL and encryption certificate thumbprints
    [void]($retailServerRotationInfo.CertificateThumbprints.Add($retailSSLCertThumbprint))
    [void]($retailServerRotationInfo.CertificateThumbprints.Add($dataEncryptionCertThumbprint))
    [void]($retailServerRotationInfo.CertificateThumbprints.Add($retailRTSAuthCertThumbprint))
    [void]($retailServerRotationInfo.CertificateThumbprints.Add($oldRetailRTSAuthCertThumbprint))

    # Add key-value pairs to the template object.
    [void]($retailServerRotationInfo.KeyValues.Add($oldRetailDataSyncUserKeyValuePair))
    [void]($retailServerRotationInfo.KeyValues.Add($oldRetailRuntimeUserKeyValuePair))

    [void]($retailServerRotationInfo.KeyValues.Add($retailDataSyncUserKeyValuePair))
    [void]($retailServerRotationInfo.KeyValues.Add($retailDataSyncUserPasswdKeyValuePair))

    [void]($retailServerRotationInfo.KeyValues.Add($retailRuntimeUserKeyValuePair))
    [void]($retailServerRotationInfo.KeyValues.Add($retailRuntimeUserPasswdKeyValuePair))

    [void]($retailServerRotationInfo.KeyValues.Add($axDeployUserKeyValuePair))
    [void]($retailServerRotationInfo.KeyValues.Add($axDeployUserPasswdKeyValuePair))

    [void]($retailServerRotationInfo.KeyValues.Add($axDeployExtUserKeyValuePair))
    [void]($retailServerRotationInfo.KeyValues.Add($axDeployExtUserPasswdKeyValuePair))

    [void]($retailServerRotationInfo.KeyValues.Add($channelDatabaseServerNameKeyValuePair))
    [void]($retailServerRotationInfo.KeyValues.Add($channelDatabaseNameKeyValuePair))

    return $retailServerRotationInfo
}

try
{
    $serviceModelName = 'RetailServer'
    Write-Host ('Generating Auth Rotation Template for {0}.' -f $serviceModelName)

    $retailServerServicingTemplate = Generate-RetailServerServicingTemplate
    Remove-ServicingRotationInfo -Name $serviceModelName -Path $targetLocation

    Add-ServicingRotationInfo -Name $serviceModelName -Value $retailServerServicingTemplate -Path $targetLocation
    Write-Host ('Auth Rotation Template generation for {0} was successful.' -f $serviceModelName)
}
catch
{
    Write-Host ($global:error[0] | Format-List * -Force | Out-String -Width 4096)
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine

    Write-Host ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine)
    exit -1
}
# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAbF0OFPtX1vbx+
# auJAzvFFEPqruYlTNPoXAYKzNxv4nqCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCA+
# xQokpoIpzvnnGdB10q0A58LGSvRiT1NevTTsffB0PTCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQCF
# dRG5XLTUMny7d/hdDo63J5XXmup1jTgWNowuBuE5uVmjFOjvtQ5037j/+WKV/zvU
# 6YeteLSBslGRvCVRSfaa48K49OkbT9S8/Pd+H+orIlfwpDA/DhlkUqHmtU15GKR8
# +neMfGLfjOq+pfr877Vy8E4IjbzV/2oZBeA/DtHFy7bM65MuOOxwGgdB8Sq3JFqC
# jnwnS/HGNiZAu9kBpQh+xEo3xVdGn+z5UI1lEzsn13U6MSeXo2/RtwN9sgNosVMy
# yL8spNx2bwxEulsdf0dmC8twlIYIiaAqBS2E4VsIvksY+BUHUo4O070dKJeSABCE
# 4QvRDiCIiCLcTW7s8jpWoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IAEAZiTkz/V3kpm7fR1y/NrsA+Qoo0fC9JEOXg/Z4mmbAgZfPUPdP5QYEzIwMjAw
# ODIzMDQwMjQ4LjEzOFowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
# VQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25z
# IExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjg2REYtNEJCQy05MzM1
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOPDCCBPEw
# ggPZoAMCAQICEzMAAAEPgHL2OocIiK0AAAAAAQ8wDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTE4WhcNMjEw
# MTIxMjMxOTE4WjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
# BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UE
# CxMdVGhhbGVzIFRTUyBFU046ODZERi00QkJDLTkzMzUxJTAjBgNVBAMTHE1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQDfTTlAqt7zsZXhYoIINcxBZgfl5YjRGxMb7ZlQjUCdrc6k+8zabHfZ
# x0zltIbHzS7JPC88SgrCAs/MmK9FBxXDrnJ050gKBZinoEQI3CSJEZw4WufCT8O6
# FCAmbn5MaretSdqgOK4l+Vz+BOVD0LioTRavX2Ceg4iJYGTdOylXieYrpDTd9RmT
# iUCYi4Vu4EFZWJoZ2YapTFTYV7wIcuAIZKDosv+EZ/wVJL3xSa1foAYCf/w8qERb
# 8NVialjOH2fE3Lf5oQeg/j/4zVrmJ7xipPyNN3mltxJ7Z1XyGQ7H9kLtmsWvGsAw
# l0QWVa5ZWP7UvXR+iM89DD/fVVTuncMzAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
# 55UhgBltUsagF5bsdqrKlu8Y5XswHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8Uz
# aFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
# L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoG
# CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
# Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
# AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEA
# UIKxNncVWmmhpMsoVq3EeX2fhYTLEeDJ6HiDd3zcbvEsogFfpt7xq8iBr4YphPqh
# gs6yZayK5NEM6yOXEx7DYaPH32JELKHa3kWz3VsXlIAUrJk5FvUXYEZS2o3Og2F3
# RBvGtUQHze4ZR+rpSCNivRvjZYt7HQN/z4ucWiVDCJZeq+yNCggFTcrWKW2Fij5N
# reYcOvBox69xHyNa7fup2gSqO2h7H5toIN5LQ95shRt8HcRGALaym4WOsjQ5O9s/
# 4ypLJs84zKY2nMQJjZe64wEDuF5UkAZQBkr1yx1G0HSP8QsLGbXEBVP9bi5mu25q
# uoDVuB4o832eKwczNk3ZfjCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZI
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
# Ex1UaGFsZXMgVFNTIEVTTjo4NkRGLTRCQkMtOTMzNTElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAJEG7Qp9TlB0W
# edu0oJJBeqFkt2mggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
# MDANBgkqhkiG9w0BAQUFAAIFAOLsX4MwIhgPMjAyMDA4MjMxMTIyNDNaGA8yMDIw
# MDgyNDExMjI0M1owdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA4uxfgwIBADAKAgEA
# AgII0QIB/zAHAgEAAgIRkjAKAgUA4u2xAwIBADA2BgorBgEEAYRZCgQCMSgwJjAM
# BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEB
# BQUAA4GBAHmxtg/hmsHOALDgo+lI3C+Knp8eUCQKzhhkDFOaWpYHrCRxQOVzJf04
# XKuma90AvJB71XtnJ2GUl6uE41/cDXx8LAMpWbeJSoowL6K6lFKBwWC27J5whsl0
# LqQDBrtfDAZNILyVzPDizMwNO06Ppm8wvIKhChLaXEW9B46wNlGRMYIDDTCCAwkC
# AQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
# A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEPgHL2OocI
# iK0AAAAAAQ8wDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgV7R1DPHOazakKeRcx6gfQzPwguscDycX
# Vzy3oaxsIogwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCA/mr0OeWgtFGzy
# p0EMW9VrRBbgtkv30N6zFN7wdHQ+jjCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABD4By9jqHCIitAAAAAAEPMCIEIG1GtLUyc4GoLtin
# HtLjMhBDoW7SJ7Scfgh2HeLyTZTSMA0GCSqGSIb3DQEBCwUABIIBACH/8HbUzM2E
# D+MwS3TN5o+GASEK8Z1JOEPuLnM8VAyCJOMvB3HAeHHbOLb+Vy1MYgTivMqWqCPj
# EcZ70o6M+vTEmTAyF6pHoOAwomsVoHijSb2B/KaiAZGuq8LqGaNDAEe7+1oppPq6
# RJqRnjY9bj/UX/e0J0cPPBRTbVHYxbFszIZ3msHVKtoZVLkL7Auum/aoTbsuZ3N8
# 65jwJAoUfqREjEWJzcohcvkk4a2zroP3ec1epz+Stva/A+7b+tbydPH/tcKzkQDi
# knz3p1WvqDsuhMWNwTl0kOM6u3Y8TgqKXOfLchfR0u6mQ4/wRZW4jGg12BfA0qhZ
# G7pQ1grafLo=
# SIG # End signature block
