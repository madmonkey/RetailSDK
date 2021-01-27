$ETWManifestPath = "$(split-Path -parent $PSScriptRoot)\ETWManifest"

$settingsFilePath = Join-Path $PSScriptRoot 'Servicing.settings'
if (Test-Path $settingsFilePath)
{
    $settingsJson = Get-Content $settingsFilePath -Raw | ConvertFrom-Json

    if ($settingsJson.ETWManifestUpdate.Skip)
    {
        Write-Output 'Update is not applicable. Skipping ETW manifest update step.'
        exit 0
    }
    else
    {
        Write-Output 'Update is applicable.'
    }
}

$BackupFolder = "$RunbookBackupFolder"

if ([string]::IsNullOrEmpty($BackupFolder))
{
    $BackupFolder = "$PSScriptRoot\ManualETWManifestBackup"
}

if(-Not(Test-Path -Path $BackupFolder )){
    New-Item -ItemType directory -Path $BackupFolder
}

Write-Output "ETWManifestPath: $($ETWManifestPath)"

# Read the registry key to find the instrumentation folder
$regPath = "HKLM:\SOFTWARE\Microsoft\Dynamics\AX\Diagnostics\MonitoringInstall"
$instrumentationPathKey = "ManifestPath"
$installPathKey = "InstallPath"

if (Test-Path $regPath) 
{
    $instrumentationPath = $(Get-ItemProperty $regPath).$instrumentationPathKey 
    $installPath = $(Get-ItemProperty $regPath).$installPathKey

    $timeout = new-timespan -Minutes 15
    $logFileLocked = $true;
    $sw = [diagnostics.stopwatch]::StartNew()
    while ($sw.elapsed -lt $timeout -and $logFileLocked)
    {
        try 
        { 
            [IO.File]::OpenWrite("$installPath\MonitoringInstall\MonitoringInstall.log").close();
            Invoke-Expression "$installPath\MonitoringInstall\MonitoringInstall.exe /stopsessions /log:$installPath\MonitoringInstall\StopSessions.log /append"
            $logFileLocked = $false
        }
        catch 
        {
            start-sleep -seconds 15
        }
    }
    if($logFileLocked)
    {
        throw "fail to stop monitoring sessions"
    }

    $logFileLocked = $true;
    $sw = [diagnostics.stopwatch]::StartNew()
    while ($sw.elapsed -lt $timeout -and $logFileLocked)
    {
        try 
        { 
            [IO.File]::OpenWrite("$installPath\MonitoringInstall\MonitoringInstall.log").close();
            Invoke-Expression "$installPath\MonitoringInstall\MonitoringInstall.exe /stopagents /log:$installPath\MonitoringInstall\StopAgents.log /append"
            $logFileLocked = $false
        }
        catch 
        {
            start-sleep -seconds 15
        }
    }
    if($logFileLocked)
    {
        throw "fail to stop monitoring agents"
    }


    if (![String]::IsNullOrWhiteSpace($instrumentationPath))
    {
        Write-Output "InstrumentationPath: $($instrumentationPath)"
        if (Test-Path $instrumentationPath)
        {
            # Backup instrumentationPath prior to update
            Get-ChildItem -Path $instrumentationPath -Recurse | Copy-Item -Force -Destination {
                if ($_.GetType() -eq [System.IO.FileInfo]) {
                  Join-Path $BackupFolder $_.FullName.Substring($instrumentationPath.length)
                } 
                else {
                  Join-Path $BackupFolder $_.Parent.FullName.Substring($instrumentationPath.length)
                }
            }
            Write-Output "Manifest files copied to backup folder."
        }
        
        if (Test-Path $ETWManifestPath)
        {
            Restart-Service EventLog -Force 
            Copy-Item -Path "$ETWManifestPath\*" -Destination $instrumentationPath –Recurse -force
            Write-Output "Manifest files updated."
        }
    }

    # Run the scheduled task
    $scheduledTask = Get-ScheduledTask | ? {$_.TaskName -eq "MonitoringInstall"}
    If ($scheduledTask -ne $Null)
    {
        Write-Output "ScheduledTask $scheduledTask exists"
        Start-ScheduledTask $scheduledTask.TaskName -TaskPath $scheduledTask.TaskPath
        Write-Output "$scheduledTask triggered."
    }
} 
# SIG # Begin signature block
# MIIkAwYJKoZIhvcNAQcCoIIj9DCCI/ACAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCCOMDxSX3GGfkcd
# UYDTk7IiZ9Jh01mPIRGCHDuV6MgIQaCCDYIwggYAMIID6KADAgECAhMzAAAAww6b
# p9iy3PcsAAAAAADDMA0GCSqGSIb3DQEBCwUAMH4xCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25p
# bmcgUENBIDIwMTEwHhcNMTcwODExMjAyMDI0WhcNMTgwODExMjAyMDI0WjB0MQsw
# CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
# ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMR4wHAYDVQQDExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
# AQC7V9c40bEGf0ktqW2zY596urY6IVu0mK6N1KSBoMV1xSzvgkAqt4FTd/NjAQq8
# zjeEA0BDV4JLzu0ftv2AbcnCkV0Fx9xWWQDhDOtX3v3xuJAnv3VK/HWycli2xUib
# M2IF0ZWUpb85Iq2NEk1GYtoyGc6qIlxWSLFvRclndmJdMIijLyjFH1Aq2YbbGhEl
# gcL09Wcu53kd9eIcdfROzMf8578LgEcp/8/NabEMC2DrZ+aEG5tN/W1HOsfZwWFh
# 8pUSoQ0HrmMh2PSZHP94VYHupXnoIIJfCtq1UxlUAVcNh5GNwnzxVIaA4WLbgnM+
# Jl7wQBLSOdUmAw2FiDFfCguLAgMBAAGjggF/MIIBezAfBgNVHSUEGDAWBgorBgEE
# AYI3TAgBBggrBgEFBQcDAzAdBgNVHQ4EFgQUpxNdHyGJVegD7p4XNuryVIg1Ga8w
# UQYDVR0RBEowSKRGMEQxDDAKBgNVBAsTA0FPQzE0MDIGA1UEBRMrMjMwMDEyK2M4
# MDRiNWVhLTQ5YjQtNDIzOC04MzYyLWQ4NTFmYTIyNTRmYzAfBgNVHSMEGDAWgBRI
# bmTlUAXTgqoXNzcitW2oynUClTBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vd3d3
# Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEt
# MDctMDguY3JsMGEGCCsGAQUFBwEBBFUwUzBRBggrBgEFBQcwAoZFaHR0cDovL3d3
# dy5taWNyb3NvZnQuY29tL3BraW9wcy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIw
# MTEtMDctMDguY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQELBQADggIBAE2X
# TzR+8XCTnOPVGkucEX5rJsSlJPTfRNQkurNqCImZmssx53Cb/xQdsAc5f+QwOxMi
# 3g7IlWe7bn74fJWkkII3k6aD00kCwaytWe+Rt6dmAA6iTCXU3OddBwLKKDRlOzmD
# rZUqjsqg6Ag6HP4+e0BJlE2OVCUK5bHHCu5xN8abXjb1p0JE+7yHsA3ANdkmh1//
# Z+8odPeKMAQRimfMSzVgaiHnw40Hg16bq51xHykmCRHU9YLT0jYHKa7okm2QfwDJ
# qFvu0ARl+6EOV1PM8piJ858Vk8gGxGNSYQJPV0gc9ft1Esq1+fTCaV+7oZ0NaYMn
# 64M+HWsxw+4O8cSEQ4fuMZwGADJ8tyCKuQgj6lawGNSyvRXsN+1k02sVAiPGijOH
# OtGbtsCWWSygAVOEAV/ye8F6sOzU2FL2X3WBRFkWOCdTu1DzXnHf99dR3DHVGmM1
# Kpd+n2Y3X89VM++yyrwsI6pEHu77Z0i06ELDD4pRWKJGAmEmWhm/XJTpqEBw51sw
# THyA1FBnoqXuDus9tfHleR7h9VgZb7uJbXjiIFgl/+RIs+av8bJABBdGUNQMbJEU
# fe7K4vYm3hs7BGdRLg+kF/dC/z+RiTH4p7yz5TpS3Cozf0pkkWXYZRG222q3tGxS
# /L+LcRbELM5zmqDpXQjBRUWlKYbsATFtXnTGVjELMIIHejCCBWKgAwIBAgIKYQ6Q
# 0gAAAAAAAzANBgkqhkiG9w0BAQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
# Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
# dCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNh
# dGUgQXV0aG9yaXR5IDIwMTEwHhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEwOTA5
# WjB+MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
# UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQD
# Ex9NaWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDExMIICIjANBgkqhkiG9w0B
# AQEFAAOCAg8AMIICCgKCAgEAq/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4
# BjgaBEm6f8MMHt03a8YS2AvwOMKZBrDIOdUBFDFC04kNeWSHfpRgJGyvnkmc6Whe
# 0t+bU7IKLMOv2akrrnoJr9eWWcpgGgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato
# 88tt8zpcoRb0RrrgOGSsbmQ1eKagYw8t00CT+OPeBw3VXHmlSSnnDb6gE3e+lD3v
# ++MrWhAfTVYoonpy4BI6t0le2O3tQ5GD2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDst
# rjNYxbc+/jLTswM9sbKvkjh+0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOEy/S6A4aN
# 91/w0FK/jJSHvMAhdCVfGCi2zCcoOCWYOUo2z3yxkq4cI6epZuxhH2rhKEmdX4ji
# JV3TIUs+UsS1Vz8kA/DRelsv1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL5zmh
# D+kjSbwYuER8ReTBw3J64HLnJN+/RpnF78IcV9uDjexNSTCnq47f7Fufr/zdsGbi
# wZeBe+3W7UvnSSmnEyimp31ngOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8Hh
# hUSJxAlMxdSlQy90lfdu+HggWCwTXWCVmj5PM4TasIgX3p5O9JawvEagbJjS4NaI
# jAsCAwEAAaOCAe0wggHpMBAGCSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTl
# UAXTgqoXNzcitW2oynUClTAZBgkrBgEEAYI3FAIEDB4KAFMAdQBiAEMAQTALBgNV
# HQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQF
# TuHqp8cx0SOJNDBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3JsLm1pY3Jvc29m
# dC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNSb29DZXJBdXQyMDExXzIwMTFfMDNf
# MjIuY3JsMF4GCCsGAQUFBwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDovL3d3dy5t
# aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNSb29DZXJBdXQyMDExXzIwMTFfMDNf
# MjIuY3J0MIGfBgNVHSAEgZcwgZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEFBQcC
# ARYzaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9kb2NzL3ByaW1hcnlj
# cHMuaHRtMEAGCCsGAQUFBwICMDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5
# AF8AcwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3DQEBCwUAA4ICAQBn8oal
# mOBUeRou09h0ZyKbC5YR4WOSmUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0ep
# o/Np22O/IjWll11lhJB9i0ZQVdgMknzSGksc8zxCi1LQsP1r4z4HLimb5j0bpdS1
# HXeUOeLpZMlEPXh6I/MTfaaQdION9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtY
# SWMfCWluWpiW5IP0wI/zRive/DvQvTXvbiWu5a8n7dDd8w6vmSiXmE0OPQvyCInW
# H8MyGOLwxS3OW560STkKxgrCxq2u5bLZ2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZ
# iWhub6e3dMNABQamASooPoI/E01mC8CzTfXhj38cbxV9Rad25UAqZaPDXVJihsMd
# YzaXht/a8/jyFqGaJ+HNpZfQ7l1jQeNbB5yHPgZ3BtEGsXUfFL5hYbXw3MYbBL7f
# QccOKO7eZS/sl/ahXJbYANahRr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbSoqKf
# enoi+kiVH6v7RyOA9Z74v2u3S5fi63V4GuzqN5l5GEv/1rMjaHXmr/r8i+sLgOpp
# O6/8MO0ETI7f33VtY5E90Z1WTk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZO
# SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFdcwghXTAgEBMIGVMH4xCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jv
# c29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAADDDpun2LLc9ywAAAAAAMMw
# DQYJYIZIAWUDBAIBBQCggcYwGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYK
# KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIBGzFaz8
# vM9g5UWkoLyiXXMKcOFSqd/0s1Cgg28s+VxvMFoGCisGAQQBgjcCAQwxTDBKoCyA
# KgBBAFgAVQBwAGQAYQB0AGUASQBuAHMAdABhAGwAbABlAHIALgBlAHgAZaEagBho
# dHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEAAlkekP8L
# Ob9ZUXUuMpf7gfB4vizpG1o7pQIQDtepx0aYafQ23mL6AT7bvlfY01rXBwL872L2
# zlzIKLNL64ZndQzCSBuTBgS6UVIcr5ZgZizIT5KXf4wKLAV3mBOhqgW6tJTsW8mC
# MBKMJrT48T3WvG5u1NBRWWaes4aj7Gho+7wY4NsEYfCi7lwFmYnhrfD0thcjYfAq
# MkLSF91DaJWKUe1Oa3rr4WMwVZOwCykN0NHpReFJx6XQSYuW0g8Y23GuW0y0T9Zt
# K3gpPaMvT9Hk3nDYUvTLtTViH0KqYgVDxtJgjKtAZiqL6g13ch1VnSUoFWidMkgD
# GiYRpE1m+TbaA6GCE0kwghNFBgorBgEEAYI3AwMBMYITNTCCEzEGCSqGSIb3DQEH
# AqCCEyIwghMeAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggE8BgsqhkiG9w0BCRABBKCC
# ASsEggEnMIIBIwIBAQYKKwYBBAGEWQoDATAxMA0GCWCGSAFlAwQCAQUABCA38bYu
# pcpNr2wR469fRGmN+Xpr0ZqmrUHtDXWpPXcGQAIGWdrfOzUeGBMyMDE3MTExNzA1
# MTAwMy4yOTlaMAcCAQGAAgH0oIG4pIG1MIGyMQswCQYDVQQGEwJVUzETMBEGA1UE
# CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
# b2Z0IENvcnBvcmF0aW9uMQwwCgYDVQQLEwNBT0MxJzAlBgNVBAsTHm5DaXBoZXIg
# RFNFIEVTTjpEMjM2LTM3REEtOTc2MTElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUt
# U3RhbXAgU2VydmljZaCCDs0wggZxMIIEWaADAgECAgphCYEqAAAAAAACMA0GCSqG
# SIb3DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
# MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
# MTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkg
# MjAxMDAeFw0xMDA3MDEyMTM2NTVaFw0yNTA3MDEyMTQ2NTVaMHwxCzAJBgNVBAYT
# AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
# VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
# aW1lLVN0YW1wIFBDQSAyMDEwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
# AQEAqR0NvHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvtfGhLLF/Fw+Vhwna3PmYr
# W/AVUycEMR9BGxqVHc4JE458YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs1nMwVyaC
# o0UN0Or1R4HNvyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLBxKZd0WETbijGGvmG
# gLvfYfxGwScdJGcSchohiq9LZIlQYrFd/XcfPfBXday9ikJNQFHRD5wGPmd/9WbA
# A5ZEfu/QS/1u5ZrKsajyeioKMfDaTgaRtogINeh4HLDpmc085y9Euqf03GS9pAHB
# IAmTeM38vMDJRF1eFpwBBU8iTQIDAQABo4IB5jCCAeIwEAYJKwYBBAGCNxUBBAMC
# AQAwHQYDVR0OBBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQBgjcUAgQM
# HgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8GA1Ud
# IwQYMBaAFNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJoEeGRWh0
# dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jvb0Nl
# ckF1dF8yMDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKG
# Pmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljUm9vQ2VyQXV0
# XzIwMTAtMDYtMjMuY3J0MIGgBgNVHSABAf8EgZUwgZIwgY8GCSsGAQQBgjcuAzCB
# gTA9BggrBgEFBQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL1BLSS9kb2Nz
# L0NQUy9kZWZhdWx0Lmh0bTBABggrBgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBQ
# AG8AbABpAGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkqhkiG9w0BAQsF
# AAOCAgEAB+aIUQ3ixuCYP4FxAz2do6Ehb7Prpsz1Mb7PBeKp/vpXbRkws8LFZslq
# 3/Xn8Hi9x6ieJeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/XPleFzWY
# JFZLdO9CEMivv3/Gf/I3fVo/HPKZeUqRUgCvOA8X9S95gWXZqbVr5MfO9sp6AG9L
# MEQkIjzP7QOllo9ZKby2/QThcJ8ySif9Va8v/rbljjO7Yl+a21dA6fHOmWaQjP9q
# Yn/dxUoLkSbiOewZSnFjnXshbcOco6I8+n99lmqQeKZt0uGc+R38ONiU9MalCpaG
# pL2eGq4EQoO4tYCbIjggtSXlZOz39L9+Y1klD3ouOVd2onGqBooPiRa6YacRy5rY
# DkeagMXQzafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA3+cxB6STOvdlR3jo+KhI
# q/fecn5ha293qYHLpwmsObvsxsvYgrRyzR30uIUBHoD7G4kqVDmyW9rIDVWZeodz
# OwjmmC3qjeAzLhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8ZQU3ghvkqmqMRZjDT
# u3QyS99je/WZii8bxyGvWbWu3EQ8l1Bx16HSxVXjad5XwdHeMMD9zOZN+w2/XU/p
# nR4ZOC+8z1gFLu8NoFA12u8JJxzVs341Hgi62jbb01+P3nSISRIwggTZMIIDwaAD
# AgECAhMzAAAArg7WTpaJ2wD1AAAAAACuMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
# BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
# HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
# dCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE2MDkwNzE3NTY1NVoXDTE4MDkwNzE3
# NTY1NVowgbIxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
# VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xDDAK
# BgNVBAsTA0FPQzEnMCUGA1UECxMebkNpcGhlciBEU0UgRVNOOkQyMzYtMzdEQS05
# NzYxMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjAN
# BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3pIvw6SVcvU+DWZkw/rm6CIPdIxN
# wZ7HtlS48Y9OfR/7RjC+fMt7ntvEZ1iSL/pUgAafoz6fFyH9qf/wymG9KP0EjifJ
# BlKBWHrDUz7asn/6qIS1ta3C4o4haDCwAR/xg5w24EWR8VRcR1BvijcH33QtAWAt
# 1X6t/trjjvHM0ZY9dIER1NgSvJqEs+d1aNmcBd0zGclYLwL5YObGqzYEcAGMG8Fl
# ucBKqXjgxV9VQP5wHi5I4qwpoPO+TNV4hMj7a1wwBS54Of8uTJQHFDGCenR7kgQ6
# iy14qY42GpEKKQdx9fvbPIsg6ATNOyaj/bueVT+Wtp/yGRTTcCR3gk0rywIDAQAB
# o4IBGzCCARcwHQYDVR0OBBYEFH6P5TQ0RIvyeUC4xqDRnEMeISWxMB8GA1UdIwQY
# MBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6
# Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
# QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0
# dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIw
# MTAtMDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgw
# DQYJKoZIhvcNAQELBQADggEBAD1ZTXjw9Fw0CNG1QWADUwz5jKZN5SIeoDyIpYNI
# SkKWTTAAy25o/pGr9BmXMbVp8KwaEfn6QbLmqMFoMMRMQhwaOpose0S3ibzcjWJQ
# pNiUE/xmvNEkVczgC+TcZbNT6rw24BYIQ3EU5qWTLwA36sHbuUehTciIHnGDaMm+
# wOAKgi31dVsdz6z8ml22rbJJOZk/Dali2C7IQc7dgmtG4SSWX+qkMIOq9oM9aRte
# bnupw6v5o2KU5gg4WM+Om/K8ayJ9LEMZxU5rZ7b89mdYwhrPfZ9a69mRaxlziUuA
# YZ9bcihBcBiY630OBm9qcgPWikcFMivQRyylguWSw9IQGiChggN3MIICXwIBATCB
# 4qGBuKSBtTCBsjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
# BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEM
# MAoGA1UECxMDQU9DMScwJQYDVQQLEx5uQ2lwaGVyIERTRSBFU046RDIzNi0zN0RB
# LTk3NjExJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2WiJQoB
# ATAJBgUrDgMCGgUAAxUAx8G9MHulGJ5kXmd0Nvq745m8aPuggcEwgb6kgbswgbgx
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xDDAKBgNVBAsTA0FP
# QzEnMCUGA1UECxMebkNpcGhlciBOVFMgRVNOOjI2NjUtNEMzRi1DNURFMSswKQYD
# VQQDEyJNaWNyb3NvZnQgVGltZSBTb3VyY2UgTWFzdGVyIENsb2NrMA0GCSqGSIb3
# DQEBBQUAAgUA3biEIzAiGA8yMDE3MTExNjIxMzk0N1oYDzIwMTcxMTE3MjEzOTQ3
# WjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDduIQjAgEAMAoCAQACAgFxAgH/MAcC
# AQACAhmZMAoCBQDdudWjAgEAMDYGCisGAQQBhFkKBAIxKDAmMAwGCisGAQQBhFkK
# AwGgCjAIAgEAAgMW42ChCjAIAgEAAgMehIAwDQYJKoZIhvcNAQEFBQADggEBAG0u
# HC8YL69KefmFDwt/QMDJVFSiwpUR9hXYt86xR/Zv9qfEqNIPQn2fMdehjvJoGH8t
# 8u+gB96hwbi+9OvaPKv6vsxyCHT3IF2+PoRD/h/PNgVyS2E9q70+yTJzbqelrcdb
# p8Yhf4UanlAwftx/SYqOu9did9i6H3w7yqfaX7pGyWJefjxO8BQt5wxNlQgE5ZOS
# xYb5cgH0YABMFmY+IlQrnGzUx7XjsF1kbF/F0q85/yLwkxIAuThlsRLHvT2FYi3B
# ZrSJLrrqpLvezq6k5RBJFJSMkBEBcmNv1NWkb26eazQ2BZkPeWqDLYRP1FgtGul3
# OkiIM0YN5QsIxCr4vFwxggL1MIIC8QIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEG
# A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
# cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFt
# cCBQQ0EgMjAxMAITMwAAAK4O1k6WidsA9QAAAAAArjANBglghkgBZQMEAgEFAKCC
# ATIwGgYJKoZIhvcNAQkDMQ0GCyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCB3
# BsgbZoXmHE9hM8eQtU61fvn5qnSnPCSK9Yoasy+azDCB4gYLKoZIhvcNAQkQAgwx
# gdIwgc8wgcwwgbEEFMfBvTB7pRieZF5ndDb6u+OZvGj7MIGYMIGApH4wfDELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAACuDtZOlonbAPUAAAAAAK4wFgQU
# Lv48tjRM7d9YPoZaUJj8QjvextQwDQYJKoZIhvcNAQELBQAEggEAmHCrn6Ji+gST
# +L7SlEVA8u2h14lQGFnUZ8Ly+OcdYjF1Z5a1DzUt3QK7XpyhT2oYYjBWEW5N1pgY
# ne23ondK6iodKkW78VYYdnNKFySAuiX5rQrTuPoFS9slghuI601oruZVrkMbXCza
# se/XKQbppIkQt9oxbuWurJRfHvXP2Ep0a08IUKOjb6TNEQRa7ypCE1A741fyNy4u
# nBdgiTElonmd46HXk6crgd/rdUlc5bRImjUCrJ09WtsF1JRXSrS2xFWfER/axNxM
# xHAuKgkhw/bHziE6LUGDbjudoGEUBawBjY66HbFYRCbQxBapJoYA6XjqWM9026jW
# OCIc+2jxig==
# SIG # End signature block
