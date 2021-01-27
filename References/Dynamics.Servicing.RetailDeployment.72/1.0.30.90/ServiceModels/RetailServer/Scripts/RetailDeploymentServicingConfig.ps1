# Map to store backwords compatible script path for retail servicing process.
$RetailServicingScriptsMap = @{
    "RetailServer" = @{
        "7.0" = "Scripts\7.0\Core\UpdateRetailServer.ps1";
        "7.1" = "Scripts\7.1\Core\UpdateRetailServer.ps1";
        
        # Retail 7.2 servicing scripts will be forward compatible, meaning they will be used for all the servicing process after 7.2 release.
        # Add entries for 7.2, 7.3, 8.0 explicitly instead of Default to avoid issues where customization package with customized version will be redirect to the default version.
        "7.2" = "Scripts\7.2\Core\UpdateRetailServer.ps1";
        "7.3" = "Scripts\7.2\Core\UpdateRetailServer.ps1";
        "8.0" = "Scripts\7.2\Core\UpdateRetailServer.ps1";
    };
    
    "RetailChannelDatabase" = @{
        "7.0" = "N/A"; # 7.0 does not have a separate UpdateRetailChannelDatabase script, and should not fallback to the default
        "7.1" = "Scripts\7.1\Core\UpdateRetailChannelDatabase.ps1";
        
        # Retail 7.2 servicing scripts will be forward compatible, meaning they will be used for all the servicing process after 7.2 release.
        # Add entries for 7.2, 7.3, 8.0 explicitly instead of Default to avoid issues where customization package with customized version will be redirect to the default version.
        "7.2" = "Scripts\7.2\Core\UpdateRetailChannelDatabase.ps1";
        "7.3" = "Scripts\7.2\Core\UpdateRetailChannelDatabase.ps1";
        "8.0" = "Scripts\7.2\Core\UpdateRetailChannelDatabase.ps1";
    };
    
    "RetailCloudPos" = @{
        "7.0" = "Scripts\Upgrade\7.0\UpdateCloudPos.ps1";
        "7.1" = "Scripts\Upgrade\7.1\UpdateCloudPos.ps1";
        
        # Retail 7.2 servicing scripts will be forward compatible, meaning they will be used for all the servicing process after 7.2 release.
        # Add entries for 7.2, 7.3, 8.0 explicitly instead of Default to avoid issues where customization package with customized version will be redirect to the default version.
        "7.2" = "Scripts\Upgrade\7.2\UpdateCloudPos.ps1";
        "7.3" = "Scripts\Upgrade\7.2\UpdateCloudPos.ps1";
        "8.0" = "Scripts\Upgrade\7.2\UpdateCloudPos.ps1";
    };
    
    "RetailStorefront" = @{
        "7.0" = "Scripts\Upgrade\7.0\UpdateStorefront.ps1";
        "7.1" = "Scripts\Upgrade\7.1\UpdateStorefront.ps1";
        
        # Retail 7.2 servicing scripts will be forward compatible, meaning they will be used for all the servicing process after 7.2 release.
        # Add entries for 7.2, 7.3, 8.0 explicitly instead of Default to avoid issues where customization package with customized version will be redirect to the default version.
        "7.2" = "Scripts\Upgrade\7.2\UpdateStorefront.ps1";
        "7.3" = "Scripts\Upgrade\7.2\UpdateStorefront.ps1";
        "8.0" = "Scripts\Upgrade\7.2\UpdateStorefront.ps1";
    };
    
    "RetailHQConfiguration" = @{
        "7.0" = "Scripts\CopyPaymentConnectorFiles.ps1";
        "7.1" = "Scripts\CopyPaymentConnectorFiles.ps1";
        
        # Retail 7.2 servicing scripts will be forward compatible, meaning they will be used for all the servicing process after 7.2 release.
        # Add entries for 7.2, 7.3, 8.0 explicitly instead of Default to avoid issues where customization package with customized version will be redirect to the default version.
        "7.2" = "Scripts\CopyPaymentConnectorFiles.ps1";
        "7.3" = "Scripts\CopyPaymentConnectorFiles.ps1";
        "8.0" = "Scripts\CopyPaymentConnectorFiles.ps1";
    };
    
    "RetailSDK" = @{
        "7.0" = "Scripts\7.0\UpdateRetailSDK.ps1";
        "7.1" = "Scripts\7.1\UpdateRetailSDK.ps1";
        
        # Retail 7.2 servicing scripts will be forward compatible, meaning they will be used for all the servicing process after 7.2 release.
        # Add entries for 7.2, 7.3, 8.0 explicitly instead of Default to avoid issues where customization package with customized version will be redirect to the default version.
        "7.2" = "Scripts\7.2\UpdateRetailSDK.ps1";
        "7.3" = "Scripts\7.2\UpdateRetailSDK.ps1";
        "8.0" = "Scripts\7.2\UpdateRetailSDK.ps1";
    };
    
    "RetailSelfService" = @{
        "7.0" = "Scripts\7.0\UpdateRetailSelfService.ps1";
        "7.1" = "Scripts\7.1\UpdateRetailSelfService.ps1";
        
        # Retail 7.2 servicing scripts will be forward compatible, meaning they will be used for all the servicing process after 7.2 release.
        # Add entries for 7.2, 7.3, 8.0 explicitly instead of Default to avoid issues where customization package with customized version will be redirect to the default version.
        "7.2" = "Scripts\7.2\UpdateRetailSelfService.ps1";
        "7.3" = "Scripts\7.2\UpdateRetailSelfService.ps1";
        "8.0" = "Scripts\7.2\UpdateRetailSelfService.ps1";
    };
}
# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDeTgfUS86vexqC
# nAzdNaGolvlxe3XJtupuzGU99pgWiaCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCAW
# kFFBqZ5Um2mHiJpm9DdMtCYKHTR6uuYOx9slgfzrozCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAQ
# PHXfIpEWHycOfH7ip25Tww383cy+6q6tU3kHoIoO/nVX5YcaYUuGdGTFPFRY0m0X
# ArrY4FX+W4WnFcoNOKP4HH7uuLuNoEwh898jpk6Q7f5Xhy1aPCOUIVigKYVkOuUk
# whJRfN5KuEwdzYuPpWv4jwZvm8IjzONwmfJXxaXcioY37xBN4dqib4z/Y+JFBGVj
# IN8p94fI65dsqA4VbintPAmcfcSqdEtLy7gg6q1vdWnwvXJOrZeRbfIAAv9lPMDj
# 2+UAESNmV+NTL9z7bxW5sEu+Q048cEJqMW99C/Ib1fJScjp2bHN77LSh7tSeohbx
# kMhnhWS+3HFU/5rLkRqioYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IFeZX/iYiiixs8mz9jwtu/a6Yne/wpdUNnTAj+3h2ssCAgZfO+TbzMMYEzIwMjAw
# ODIzMDQwMjQ1LjA2MVowBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
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
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQg/BtYbbwGkFy8BOZF
# eGE2mxX9xjjAKCkh95sTML1OKVQwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCBd38ayLm8wX/qJfYIOH5V+YvlG+poWQXCW6LKN70H3DjCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABJYvei2xyJjHdAAAAAAElMCIE
# IFyMAnv+fUcjmWSAGq2rLycrpXVbWCMYEJkLrAOY/VnLMA0GCSqGSIb3DQEBCwUA
# BIIBAKXmO851p7HuNHszhoc0aCtLlip+9nnsDSJLXyFC1TD1Z2MMMekeRI8NiTF/
# TXFqpngBlmgoIMqFKyLNzlwtIj6o0OC8jcrVZ30v2N/eA3LV+rcpp7OVm8jrZ87W
# PELZH6m2R3z8Ti5FhfWSQe8CzdmmGl74izd05hBmG2VAxf+/KKxSvZMcPaNRvIxu
# +qyHmyLZzmh5oOp1qfG52q0/mrpvvtZm+kVQty+GML56+UVzvMKaFL5I0fwLGQw6
# Xwc1guaBgl2R6fKru1i2MGC0g2rvOo9ijP56eAAV9tdpATPZCVHh07Dz17F8mwkN
# JS/qa4WhfSPV2pDwMWhWlXW9Be8=
# SIG # End signature block
