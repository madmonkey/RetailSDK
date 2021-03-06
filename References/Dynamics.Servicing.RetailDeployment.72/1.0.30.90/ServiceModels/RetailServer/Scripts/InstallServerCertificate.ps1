param([string]$HostName,
      [string]$CertificationAuthorityCerPath,
      [string]$CertificationAuthorityPfxPath,
      [string]$CertificationAuthorityPassword,
      [string]$MakeCertExecutablePath,      
      [string]$CertificationAuthoritySubjectName='Retail Server CA',
      [string]$ServerCertificateRootStore='LocalMachine',
      [string]$ServerCertificateStore='My')

###############################################
# Script specific functions
###############################################

function Log-Step{
    param([int]$number, [string]$message)
    write-host "$number.  $message"
}

function Log-ActionItem{
    param([string]$message)    
    write-host "    - $message ..."
}

function Log-ActionResult{
    param([string]$message)
    write-host "      $message."
}

function Log-Error {
    param([string]$message)
	Write-Host $message -ForegroundColor Red -BackgroundColor Black
}

function Log-Exception {
    param($exception)
	$message = ($exception | fl * -Force | Out-String -Width 4096)
	# If passed object is a string, just log the string.
	if($exception -is [string])
	{
		$message = $exception
	}
    Log-Error $message
}

function Check-CurrentUserIsAdmin {  
    $identity = [System.Security.Principal.WindowsIdentity]::GetCurrent()  
    $principal = new-object System.Security.Principal.WindowsPrincipal($identity)  
    $admin = [System.Security.Principal.WindowsBuiltInRole]::Administrator  
    $principal.IsInRole($admin)  
} 

function Get-Parameter {
    param([string]$parameterName)
    $userInput = read-host "Please enter the $parameterName"
    if ($userInput -eq "")
    {
        write-host "The $parameterName cannot be empty!"
        throw 
    }
    return $userInput
}

function Get-SecureParameter {
    param([string]$parameterName)
    $secureInput = read-host "Please enter the $parameterName" -AsSecureString
    $userInput = ""
    try
    {
        $userInput = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureInput)); 
    }
    catch
    {
        write-host "Error reading $parameterName"
        throw
    }
    
    if ($userInput -eq "")
    {
        write-host "The $parameterName cannot be empty!"
        throw 
    }
    return $userInput
}

###############################################
# Global Variables
###############################################
$PrerequisiteCheckFailed = $false
$InstallFailed = $false
$CerficiationAuthorityImported = $false

###############################################
# Validate parameters
###############################################
try
{
    if ($HostName -eq "")
    {
        $HostName = Get-Parameter "server certificate hostname"
    }
    
    if ($CertificationAuthorityCerPath -eq "")
    {
        $CertificationAuthorityCerPath = Get-Parameter "certification authority cer file path"
    }
    
    if ($CertificationAuthorityPfxPath -eq "")
    {
        $CertificationAuthorityPfxPath = Get-Parameter "certification authority pfx file path"
    }
    
    if ($CertificationAuthorityPassword -eq "")
    {
        $CertificationAuthorityPassword = Get-SecureParameter "certification authority private key password"
    }
    
    if ($MakeCertExecutablePath -eq "")
    {
        $MakeCertExecutablePath = Get-Parameter "make cert executable path"
    }
}
catch
{
    write-host "Error reading parameters. Exit now."
    exit -1
}

write-host
write-host "------------------------------------------"
write-host "Install server certificate"
write-host "------------------------------------------"

###############################################
# Step 1: Pre-requisite check
###############################################
Log-Step 1 "Pre-requisite check"

# Check if this is run under admin privilege
Log-ActionItem "Check if this is run under admin privilege"
$IsAdmin = Check-CurrentUserIsAdmin
if ($IsAdmin)
{
    Log-ActionResult "Yes"
}
else
{
    Log-ActionResult "No"

    # Bailout if the script is not run as admin. 
    Log-Error "Step 1 Failed: Pre-requisite check. The script must be run with Administrator privilege."
    $PrerequisiteCheckFailed = $true
}

# Report results
if ($PrerequisiteCheckFailed)
{
    Log-Error "Step 1 Failed: Pre-requisite check."
     
    write-host "------------------------------------------"
    write-host "Pre-requisite check failed."
    write-host "------------------------------------------"
    exit -1
}

try
{
    ###############################################
    # Step 2: Import Certification Authority
    ###############################################
    Log-Step 2 "Import Certification Authority"

    try
    {
        Log-ActionItem "Import certification authority [$CertificationAuthorityCerPath]"
		${global:LASTEXITCODE} = 0
        certutil -f -addstore Root $CertificationAuthorityCerPath
		$capturedExitCode = ${global:LASTEXITCODE}
        if ($capturedExitCode -eq 0)
        {
            Log-ActionResult "Complete"
            $CerficiationAuthorityImported = $true
        }
        else
        {
            Log-ActionResult "Failed"
            throw "Failed to install certification authority when using [certutil]. Return code: $capturedExitCode"
        }

        Log-ActionItem "Import certification authority [$CertificationAuthorityPfxPath] to personal store"
		${global:LASTEXITCODE} = 0
        certutil -f -p $CertificationAuthorityPassword -importpfx $CertificationAuthorityPfxPath
        $capturedExitCode = ${global:LASTEXITCODE}
		if ($capturedExitCode -eq 0)
        {
            Log-ActionResult "Complete"
        }
        else
        {
            Log-ActionResult "Failed"
            throw "Failed to install certification authority when using [certutil]. Return code: $capturedExitCode"
        }
    }
    catch
    {
        Log-Exception $_
        Log-Error "Step 2 Failed: Install Certification Authority"
        
        $InstallFailed = $true
    }

    ###############################################
    # Step 3: Install Server Certificate
    ###############################################
    Log-Step 3 "Install Server Certificate"

    try
    {
        Log-ActionItem "Generate & Install Server Certificate"
        $ServerCertificateCommonName = $HostName.ToLower()
		${global:LASTEXITCODE} = 0
        [void](& $MakeCertExecutablePath -n "CN=$ServerCertificateCommonName" -pe -ss $ServerCertificateStore -sr $ServerCertificateRootStore -sky exchange -m 96 -in $CertificationAuthoritySubjectName -is My -ir LocalMachine -a sha1 -eku 1.3.6.1.5.5.7.3.1 ServerCertificate.cer)
        $capturedExitCode = ${global:LASTEXITCODE}
		if ($capturedExitCode -eq 0)
        {
            Log-ActionResult "Complete"
        }
        else
        {
            Log-ActionResult "Failed while using command [$MakeCertExecutablePath]. Return code: $capturedExitCode"
            $InstallFailed = $true
        }
    }
    catch
    {
        Log-Exception $_
        Log-Error "Step 3 Failed: Install Server Certificate"
        
        $InstallFailed = $true
    }

    ###############################################
    # Step 4: Remove Certification Authority from Personal Store
    ###############################################
    Log-Step 4 "Remove Certification Authority from Personal Store"
    try
    {
        if ($CerficiationAuthorityImported)
        {
            # Remove certification authority with private key
            Log-ActionItem "Remove Certification Authority with private key from personal store [$CertificationAuthoritySubjectName]"
            $CertificationAuthority = Get-ChildItem cert:\LocalMachine\My | where-object { $_.Subject -like "CN=$CertificationAuthoritySubjectName*" } | Select-Object -First 1
            if ($CertificationAuthority)
            {
                Log-ActionResult "[$CertificationAuthority.Thumbprint]"
				${global:LASTEXITCODE} = 0
                certutil -delstore My $CertificationAuthority.Thumbprint
                if (${global:LASTEXITCODE} -eq 0)
                {
                    Log-ActionResult "Complete"
                }
                else
                {
                    Log-ActionResult "Failed when using [certutil]. Return code: ${global:LASTEXITCODE}"
                    $InstallFailed = $true
                }
            }
            else
            {
                Log-ActionResult "Failed"
                $InstallFailed = $true
            }
        }
        else
        {
            Log-ActionItem "Certification authority with private key not installed"
        }
    }
    catch
    {
        Log-Exception $_
        Log-Error "Step 4 Failed: Remove Certification Authority from Personal Store"
        
        $InstallFailed = $true
    }
}
catch
{
    Log-Exception $_
    $InstallFailed = $true
}

if ($InstallFailed)
{
    write-host "------------------------------------------"
    write-host "Failed to install server certificate"
    write-host "------------------------------------------"    
    exit 1
}
else
{
    write-host "----------------------------------------------"
    write-host "Successfully installed server certificate"
    write-host "----------------------------------------------"
    exit 0
}
# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDXUl2X7uhtaHSl
# 8GF2980orPHFZFzaHALUG9TfwsR/uaCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBE
# ko+cm5ouKLPnqcWbJK/iCIkcM0GDkpdecH39LGcfFzCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQB0
# AdSwEuKAm2Ivv+klR3KEcCW177tS5n55N9tagveF1Ph5vceuHfigIMmopCUDenrH
# 5A/D2sWV/p8OoEiWsng0WGj3ZZ7LEkzX4x5MWoAjS6Rs2zXANtFhkRLGPOpgyL8m
# NcP4rGt/Dc4u4w5XcKfiOIOTIPlWLUBp4LmQvutYyV5J4EWSnVmx0a9t8Y0u0oMH
# QR+ni+5eSWD+p2ST5mGkemj7bKrEmNZhgjIuPU0xEgZqkcuAwgOzO95qY+19/N+x
# 9demxkGEBvtVxHdlwtjnrGFyvDUgIaVt6W1vq10ViOPqWGx3Oh0eEcd+ra+8PytT
# 1NvO9AxtvFzTNV1g5yHKoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IEWnKESnz0xS3VIB8Pk93i9F2clkkwbrD0R88FisvP3iAgZfPSuXiAwYEzIwMjAw
# ODIzMDQwMzQzLjQ1MVowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
# VQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25z
# IExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjhENDEtNEJGNy1CM0I3
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOPDCCBPEw
# ggPZoAMCAQICEzMAAAEKUsg5AVLRcEsAAAAAAQowDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTE1WhcNMjEw
# MTIxMjMxOTE1WjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
# BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UE
# CxMdVGhhbGVzIFRTUyBFU046OEQ0MS00QkY3LUIzQjcxJTAjBgNVBAMTHE1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQC7PhutlKFwxZ+GePU/V0pMke215HSX8PcLX1hjYUbyCERBFs7/wEwr
# bwMIZdOo7NDqcIUhXXt3kxg1OqBJxuozVcCJ8JwRy/VI79p1ZeLbSv3aMMxouOzo
# qaNL/Dmb8CT9UEcqq3PF18vMv1cZfk8ZphuVSGPM0eWsJvE1kfPXCJsYzsZturq0
# jEI6XBh9hpuKQq8KSXvoqCE37EZWrYWy3uhRJnsrd4Tq2YgYsyWQ/aQF20db73ZW
# wItXG4TUly4IQ0pcQi9/UH3fsVu06q8/yNvc7MfIcmnYOUPOyFMBh0EW519K/mg/
# xYgMhtmZlnzmvHnr5npzJTiwbBuhnwUnAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
# +ESUpf06TE1Q3pH4Oq0BopFxhSgwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8Uz
# aFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
# L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoG
# CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
# Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
# AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEA
# VJeufNQV8t3TcyWq0Su3nVYZfdRcV6isTp0Zj5gjBKZ8VEpE3AR7xyYu3QQ7F7PJ
# NXr7991hPKs9w8O+BHeToXmwd4oTGiGOupyPEBrfJVD1IllqRdlUrNodbNu8y4Dy
# RybOPQn9jr+mTntoWyn+Sv6W7lo13DlXdaCK0linATp+hlCwGtNM81GEhdUwec8S
# Tqzb7ucLpPL1ksgmFh4zKou6K0kYq8SJGEPw9jOQYmcuSOnrUgIOT/TRlVm++Vcu
# ie2HfZmih5n3/7vrSj2DaVSEXyhoscIHWLzZ1QKFd3Nm6VQTBDkJlaHxYiNBlJS6
# 847W9XQV86p03BwPJe4V0jCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZI
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
# Ex1UaGFsZXMgVFNTIEVTTjo4RDQxLTRCRjctQjNCNzElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAOb12pXHRf+5R
# rRVyRXbiGmhj3vmggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
# MDANBgkqhkiG9w0BAQUFAAIFAOLsRzowIhgPMjAyMDA4MjMwOTM5MDZaGA8yMDIw
# MDgyNDA5MzkwNlowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA4uxHOgIBADAKAgEA
# AgIKGgIB/zAHAgEAAgIRljAKAgUA4u2YugIBADA2BgorBgEEAYRZCgQCMSgwJjAM
# BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEB
# BQUAA4GBAEp5xYQX+ih8tX3Gm/YopkkQ1CJyTOUcDe1RqJBb8xq2DzSiKDDMtpGg
# rbpz9xVfEF00tAxZXA9rER4Tu2Tz6YyHU9JxlV+96QO8rGGxj7tj1lzr7/ZDtT84
# a7SYVbn/MiWyakUhpRNdNyKaqLYa3wDdbS072XfQ635ZmeIGQiWhMYIDDTCCAwkC
# AQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
# A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEKUsg5AVLR
# cEsAAAAAAQowDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgP8k708jeCBMKlcjh8jNdR7bBEoU1Y4L9
# pjLAh70SZmAwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCBXAzYkM7qhDCgN
# 6EbxXbZtR3HNkNZaGSMYHzfL5NKsqjCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABClLIOQFS0XBLAAAAAAEKMCIEIBqZiGzGyIFc26q+
# oooMu/H2aOjzZBnUZTqvwvMjKN1IMA0GCSqGSIb3DQEBCwUABIIBAB0kYO+J0S8F
# RYgrJljhmPya3ln9amSdISQfmYPXezWMZibEo/G8QHKzm3imbW0ETuZtWDMCN7TF
# CVSOVQw80mAixVyphecEITfkaG2fcWCI64fQsyAtBZ9THvMjzmW+LehTUW3HkcED
# AhD6GM1TtfRRIJcULcwpiVeAOjaCG19nt8pxtu9+Nt4tAd3rnCTtTsWfuat25fDO
# aawWYYKW6vYOHGCFAGkQWCSUK3nOGCE9hs3GqrPnugFKgjCKLbXYJSxAFbyGALSG
# /nDe6sbz1v6+NWAdDZ6XDmvlwO1I6aggjMYV63ycYDVwFt4OrZ9tWdvf8fnMjG7j
# 3/uyzCBgTPs=
# SIG # End signature block
