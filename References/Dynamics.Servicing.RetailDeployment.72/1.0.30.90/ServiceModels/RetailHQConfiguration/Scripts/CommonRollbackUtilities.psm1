Import-Module WebAdministration

function Create-ZipFiles(
    [string] $sourceFolder = $(Throw 'sourceFolder parameter required'),
    [string] $destFile = $(Throw 'destFile parameter required'),
    [string] $filetypesExcluded,
    [string] $folderExcluded,
    [string] $fileFilter)
{
    Set-Variable zipLocation -Option Constant -Value (Join-Path $env:SystemDrive "DynamicsTools\7za.exe")

    if(-Not (Test-Path $sourceFolder))
    {
        throw "Path not found: $sourceFolder"
    }
    
    if(Test-Path $destFile)
    {
        Remove-Item $destFile -Force
    }

    Push-Location $sourceFolder
    $argumentList = "a -r -y"
    
    if(![string]::IsNullOrEmpty($filetypesExcluded))
    {
        $argumentList = $argumentList + " -x!$filetypesExcluded"
    }
    
    if(![string]::IsNullOrEmpty($folderExcluded))
    {
        $argumentList = $argumentList + " -xr!$folderExcluded"
    }

    $argumentList = $argumentList + " $destFile"

    if(![string]::IsNullOrEmpty($fileFilter))
    {
        $argumentList = $argumentList + " $fileFilter"
    }

    $ZipLog = Join-Path $PSScriptRoot tempZipLog.txt
    if(Test-Path $ZipLog)
    {
        Remove-Item $ZipLog
    }

    $process = Start-Process $zipLocation -ArgumentList $argumentList -NoNewWindow -Wait -PassThru -RedirectStandardOutput $ZipLog #7zip doesn't have stderr
    try { if (!($process.HasExited)) { Wait-Process $process } } catch { }

    Pop-Location
    if($process.ExitCode -ne 0)
    {
        throw "fail to generate zip archive: $destFile, check the log file for more detail: $ZipLog"
    }
    if(Test-Path $ZipLog)
    {
        Remove-Item $ZipLog
    }
}

function Unpack-ZipFiles(
    [string] $sourceFile = $(Throw 'sourceFile parameter required'),
    [string] $destFolder = $(Throw 'destFolder parameter required'))
{
    Set-Variable zipLocation -Option Constant -Value (Join-Path $env:SystemDrive "DynamicsTools\7za.exe")

    if(-Not (Test-Path $sourceFile))
    {
        throw "File not found: $sourceFile"
    }    

    if(-Not (Test-Path $destFolder))
    {
        throw "Path not found: $destFolder"
    }
    Push-Location $destFolder
    $argumentList = "x -y $sourceFile"

    $process = Start-Process $zipLocation -ArgumentList $argumentList -NoNewWindow -Wait -PassThru
    try { if (!($process.HasExited)) { Wait-Process $process } } catch { }

    Pop-Location
    if($process.ExitCode -ne 0)
    {
        $argumentList
        throw "fail to extract zip archive: $sourceFile"
    }
}

function Get-WebSitePhysicalPath([string]$Name = $(Throw 'Name parameter required'))
{
    if (Get-Service W3SVC | where status -ne 'Running')
    {
        #IIS service is not running, starting IIS Service.
        Start-Service W3SVC
    }

    $webSitePhysicalPath = (Get-WebSite | Where-Object { $_.Name -eq $Name }).PhysicalPath
    
    return $webSitePhysicalPath	
}

function Get-AosWebSitePhysicalPath()
{
    $websiteName = Get-AosWebSiteName
    if($websiteName)
    {
        $websitePath = Get-WebSitePhysicalPath -Name $websiteName
        if([string]::IsNullOrWhiteSpace($websitePath))
        {
            throw "Failed to find the webroot of AOS Service website."
        }
        return $websitePath
    }
    else
    {
        throw "Failed to find the website name. Unable to determine the physical website path."
    }
}

function Get-AosServicePath()
{
    $websitePath = Get-AosWebSitePhysicalPath
    $aosWebServicePath = "$(split-Path -parent $websitePath)"
    return $aosWebServicePath
}

function Get-AosServiceStagingPath()
{
    $aosWebServicePath = Get-AosServicePath
    $stagingFolder = Join-Path  "$(split-Path -parent $aosWebServicePath)" "AosServiceStaging"
    return $stagingFolder
}

function Get-AosServiceBackupPath()
{
    $aosWebServicePath = Get-AosServicePath
    $stagingFolder = Join-Path  "$(split-Path -parent $aosWebServicePath)" "AosServiceBackup"
    return $stagingFolder
}

function Get-AosWebSiteName()
{
    if(test-path "iis:\sites\AosService")
    {
        return "AosService"
    }
    elseif(test-path "iis:\sites\AosServiceDSC")
    {
        return "AosServiceDSC"
    }
    elseif(test-path "iis:\sites\AosWebApplication")
    {
        return "AosWebApplication"
    }
    else
    {
        throw "Failed to find the AOS website name."
    }
}

function Get-AosAppPoolName()
{
    $websiteName=Get-AosWebSiteName
    if($websiteName)
    {
        if($websiteName -eq "AosWebApplication")
        {
            #Non service-model deployments have a different app pool and site name
            return "AOSAppPool"        
        }
        else
        {
            #Service model-based deployments have app pool and site use the same name
            return $websiteName
        }
    }
    else
    {
        throw "Failed to find the AOS website name. Unable to determine application pool name."
    }
}

function Backup-WebSite(
    [ValidateNotNullOrEmpty()]
    [string]$Name = $(Throw 'Name parameter required'),
    
    [string]$BackupFolder)
{
    Write-Output "Executing backup for [$Name] website"
    
    $webroot = Get-WebSitePhysicalPath -Name $Name
    if([string]::IsNullOrEmpty($webroot))
    {
        throw "Failed to locate physical path for [$Name] website."
    }

    if ([string]::IsNullOrEmpty($BackupFolder))
    {
        $BackupFolder = ("$PSScriptRoot\{0}_Backup" -f $Name)
    }

    $webrootBackupFolder = Join-Path $BackupFolder 'webroot'

    if(-not (Test-Path -Path $webrootBackupFolder ))
    {
        New-Item -ItemType Directory -Path $webrootBackupFolder -Force
    }

    Write-Output "Begin backup of [$Name] website at $webroot"
    Create-ZipFiles -sourceFolder $webroot -destFile (Join-Path $webrootBackupFolder 'webroot.zip')
    Write-Output "Finished executing backup for [$Name]"
}

function Restore-WebSite(
    [ValidateNotNullOrEmpty()]
    [string]$Name = $(Throw 'Name parameter required'),
    
    [string]$BackupFolder)
{
    Write-Output "Executing restore for [$Name] website"
    
    $webroot = Get-WebSitePhysicalPath -Name $Name
    if([string]::IsNullOrEmpty($webroot))
    {
        throw "Failed to locate physical path for [$Name] website."
    }

    if ([string]::IsNullOrEmpty($BackupFolder))
    {
        $BackupFolder = ("$PSScriptRoot\{0}_Backup" -f $Name)
    }

    $webrootBackupFolder = Join-Path $BackupFolder 'webroot'

    if(-not (Test-Path -Path $webrootBackupFolder ))
    {
        throw "Failed to find the backup file for website [$Name], restore aborted."
    }

    Write-Output "Removing website data at $webroot"
    Remove-Item -Path "$webroot\*" -Recurse -Force
    
    Write-Output "Restoring website data at $webroot"
    Unpack-ZipFiles -sourceFile "$webrootBackupFolder\webroot.zip" -destFolder $webroot 
    
    Write-Output "Finished executing restore for [$Name] website"
}

function Copy-FullFolder([string] $SourcePath, [string] $DestinationPath)
{
    if (-not (Test-Path $SourcePath))
    {
        throw error "$SourcePath path does not exist"
    }
  
    if (-not (Test-Path $DestinationPath))
    {
        New-Item -ItemType Directory -Path $DestinationPath
    }
    $robocopyOptions = @("/E", "/MT")
    #Bug 3822095:Servicing - in HA env the aos backup step failed with filename or extension too long error message
   
    $cmdArgs = @($robocopyOptions, "$SourcePath", "$DestinationPath")
    & robocopy @cmdArgs >$null
    
}

function Copy-SymbolicLinks([string] $SourcePath, [string] $DestinationPath, [switch] $Move = $false)
{
    if (-not (Test-Path $SourcePath))
    {
        throw error "$SourcePath path does not exist"
    }

    $filesToCopy = @{} # Hashtable for each folder and files inside that folder to copy
    $foldersToCopy = @() # List of folders to copy

    # Parse existing files into folders and files that needs to be copied.
    Get-ChildItem -Recurse $SourcePath | Where-Object { $_.LinkType -eq "SymbolicLink" } | ForEach-Object {
        $dir = Split-Path $_.FullName -Parent
        $fileName = $_.Name


        if ($_.PSIsContainer)
        {
            $foldersToCopy += $_.FullName
        }
        else
        {
            if ($filesToCopy.ContainsKey($dir))
            {
                $fileList = $filesToCopy.Get_Item($dir)
                $fileList += $fileName
                $filesToCopy.Set_Item($dir, $fileList)
            }
            else
            {
                $fileList = @()
                $fileList += $fileName
                $filesToCopy.Add($dir, $fileList)
            }
        }
    }

    # Robocopy files, with each iteration going through a new directory
    $filesToCopy.GetEnumerator() | ForEach-Object {
        $source = $_.Key
        $files = $_.Value
        $relative = Get-RelativePath -ChildPath $source -ParentPath $SourcePath
        $destination = Join-Path $DestinationPath $relative
        
        if (-not (Test-Path $destination))
        {
            New-Item -ItemType Directory -Path $destination
        }
        $robocopyOptions = @("/SL")
        #Bug 3822095:Servicing - in HA env the aos backup step failed with filename or extension too long error message
        foreach ($file in $files)
        {
            $cmdArgs = @($robocopyOptions, "$source", "$destination", @($file))
            & robocopy @cmdArgs >$null
        }
    }

    # Copy symbolic link folders, since robocopy does not support them
    $foldersToCopy | ForEach-Object {
        $source = $_
        $relative = Get-RelativePath -ChildPath $source -ParentPath $SourcePath
        $destination = Join-Path $DestinationPath $relative
        xcopy /b /i $source $destination >$null
    }

    if ($Move)
    {
        $filesToCopy.GetEnumerator() | ForEach-Object {
            $folder = $_.Key
            $_.Value | ForEach-Object{
                $file = $_
                $fullPath = Join-Path $folder $file
                Remove-Item -Force $fullPath
            }
        }

        $foldersToCopy | ForEach-Object {
            [System.IO.Directory]::Delete($_, $true)
        }
    }
}

function Get-RelativePath([string] $ChildPath, [string] $ParentPath)
{
    # Parent path must be resolved to literal
    $parentLiteralPath = Resolve-Path $ParentPath
    $childLiteralPath = Resolve-Path $ChildPath

    $parentMatch = $parentLiteralPath -replace "\\", "\\"
    if ($childLiteralPath -match "^$parentMatch(.+)$")
    {
        return $Matches[1]
    }
    else
    {
        # ChildPath is not a child of ParentPath, return empty string
        return ''
    }
}

Export-ModuleMember -Function Backup-WebSite
Export-ModuleMember -Function Create-ZipFiles
Export-ModuleMember -Function Get-AosAppPoolName
Export-ModuleMember -Function Get-AosWebSiteName
Export-ModuleMember -Function Get-AosWebSitePhysicalPath
Export-ModuleMember -Function Get-WebSitePhysicalPath
Export-ModuleMember -Function Restore-WebSite
Export-ModuleMember -Function Unpack-ZipFiles
Export-ModuleMember -Function Copy-SymbolicLinks
Export-ModuleMember -Function Copy-FullFolder
Export-ModuleMember -Function Get-RelativePath
Export-ModuleMember -Function Get-AosServicePath
Export-ModuleMember -Function Get-AosServiceStagingPath
Export-ModuleMember -Function Get-AosServiceBackupPath



# SIG # Begin signature block
# MIIj/gYJKoZIhvcNAQcCoIIj7zCCI+sCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAH5Iqu2SbcYvJt
# LQKblREGal7dyTPY1lhCw1S0c+VfcaCCDYIwggYAMIID6KADAgECAhMzAAAAww6b
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
# SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFdIwghXOAgEBMIGVMH4xCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jv
# c29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAADDDpun2LLc9ywAAAAAAMMw
# DQYJYIZIAWUDBAIBBQCggcYwGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYK
# KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIDE0htR/
# iOE7JBpDZPH+xOEoa1eU39nYMrHSheMN4T5MMFoGCisGAQQBgjcCAQwxTDBKoCyA
# KgBBAFgAVQBwAGQAYQB0AGUASQBuAHMAdABhAGwAbABlAHIALgBlAHgAZaEagBho
# dHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEAJUhNScxf
# kd/7W8HPtDFTdH2aKdxPSE8/Xj6vuEzHnB35ClUPJhHti4wYQv5/aoESnRumBhwc
# wgBXIUXRsDBaQEWYLT6E/ArJr8aD0plWOjXnl5TKC+9/fU64nCVXF4LyQ6Qjb6Tp
# AQSryxTsoYTw20cLNzklxU6Wgqgxk/hLMxIbKw57gQLVNgjRnMT007kkOij9fqxP
# rGyLUSfIt0BKQalPjuOxK81YkV/s3Njrj3Co5rxW446VQjiuSwk1YAFtIxaoq8GQ
# bxNkRYnVo+/wRb5Uy7/PcJog5Y59IDIvSkUdrCeCGk3uEmLgduJCGePx4r18LfN3
# DbdhX6AwOhOg2aGCE0QwghNABgorBgEEAYI3AwMBMYITMDCCEywGCSqGSIb3DQEH
# AqCCEx0wghMZAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggE5BgsqhkiG9w0BCRABBKCC
# ASgEggEkMIIBIAIBAQYKKwYBBAGEWQoDATAxMA0GCWCGSAFlAwQCAQUABCAHDpS0
# gKsa8LN5SiWB38X6KgFb/xzC5GyhOysHXa0y7AIGWdmEcLqJGBEyMDE3MTExNzA1
# MDMxMy41WjAHAgEBgAIB9KCBt6SBtDCBsTELMAkGA1UEBhMCVVMxEzARBgNVBAgT
# Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
# dCBDb3Jwb3JhdGlvbjEMMAoGA1UECxMDQU9DMSYwJAYDVQQLEx1UaGFsZXMgVFNT
# IEVTTjo5NkZGLTRCQzUtQTdEQzElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3Rh
# bXAgU2VydmljZaCCDsswggZxMIIEWaADAgECAgphCYEqAAAAAAACMA0GCSqGSIb3
# DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
# A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTIw
# MAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgMjAx
# MDAeFw0xMDA3MDEyMTM2NTVaFw0yNTA3MDEyMTQ2NTVaMHwxCzAJBgNVBAYTAlVT
# MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
# ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1l
# LVN0YW1wIFBDQSAyMDEwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
# qR0NvHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvtfGhLLF/Fw+Vhwna3PmYrW/AV
# UycEMR9BGxqVHc4JE458YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs1nMwVyaCo0UN
# 0Or1R4HNvyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLBxKZd0WETbijGGvmGgLvf
# YfxGwScdJGcSchohiq9LZIlQYrFd/XcfPfBXday9ikJNQFHRD5wGPmd/9WbAA5ZE
# fu/QS/1u5ZrKsajyeioKMfDaTgaRtogINeh4HLDpmc085y9Euqf03GS9pAHBIAmT
# eM38vMDJRF1eFpwBBU8iTQIDAQABo4IB5jCCAeIwEAYJKwYBBAGCNxUBBAMCAQAw
# HQYDVR0OBBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQBgjcUAgQMHgoA
# UwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8GA1UdIwQY
# MBaAFNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6
# Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jvb0NlckF1
# dF8yMDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0
# dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljUm9vQ2VyQXV0XzIw
# MTAtMDYtMjMuY3J0MIGgBgNVHSABAf8EgZUwgZIwgY8GCSsGAQQBgjcuAzCBgTA9
# BggrBgEFBQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL1BLSS9kb2NzL0NQ
# Uy9kZWZhdWx0Lmh0bTBABggrBgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBQAG8A
# bABpAGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkqhkiG9w0BAQsFAAOC
# AgEAB+aIUQ3ixuCYP4FxAz2do6Ehb7Prpsz1Mb7PBeKp/vpXbRkws8LFZslq3/Xn
# 8Hi9x6ieJeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/XPleFzWYJFZL
# dO9CEMivv3/Gf/I3fVo/HPKZeUqRUgCvOA8X9S95gWXZqbVr5MfO9sp6AG9LMEQk
# IjzP7QOllo9ZKby2/QThcJ8ySif9Va8v/rbljjO7Yl+a21dA6fHOmWaQjP9qYn/d
# xUoLkSbiOewZSnFjnXshbcOco6I8+n99lmqQeKZt0uGc+R38ONiU9MalCpaGpL2e
# Gq4EQoO4tYCbIjggtSXlZOz39L9+Y1klD3ouOVd2onGqBooPiRa6YacRy5rYDkea
# gMXQzafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA3+cxB6STOvdlR3jo+KhIq/fe
# cn5ha293qYHLpwmsObvsxsvYgrRyzR30uIUBHoD7G4kqVDmyW9rIDVWZeodzOwjm
# mC3qjeAzLhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8ZQU3ghvkqmqMRZjDTu3Qy
# S99je/WZii8bxyGvWbWu3EQ8l1Bx16HSxVXjad5XwdHeMMD9zOZN+w2/XU/pnR4Z
# OC+8z1gFLu8NoFA12u8JJxzVs341Hgi62jbb01+P3nSISRIwggTYMIIDwKADAgEC
# AhMzAAAAtotHQ7LMrR8EAAAAAAC2MA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNVBAYT
# AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
# VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
# aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE3MTAwMjIzMDA1MloXDTE5MDEwMjIzMDA1
# MlowgbExCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xDDAKBgNV
# BAsTA0FPQzEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046OTZGRi00QkM1LUE3REMx
# JTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqG
# SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDYiWcXSEsIt0QbkxHDOs9uQUCmqFxiY7Jb
# I0QzNfWe3f3AcsuLSWwweyEAZZKWKUSnDHtTP1lOIHuWbrJYEO+uPRGHfDVmKm+1
# /K/QwkpyrT/OEOPXEAnF5RLjX85g6Nv4akltPyWgaVGno9Ys/EPhQglKND1USEok
# v3zh3aZnC95ssVK4x8jSEZsmdP6cd2AaZmMsDD/YAQTfvnkzCsnqP7ulFHY1hxLZ
# d10yFvHu8vdtYF0ofSdmaR1JF+SV7fgO/rhnm/+8uu0d16TwewmwKARqSnMRJNXz
# yjUTbFbFxhxw1hO1s0YGtCyqSUTnmJUPFbvTpS15CAGAHw2mTMExAgMBAAGjggEb
# MIIBFzAdBgNVHQ4EFgQU823CkAEnINqPMxzAX2hq34EDhdAwHwYDVR0jBBgwFoAU
# 1WM6XIoxkPNDe3xGG8UzaFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2Ny
# bC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIw
# MTAtMDctMDEuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDov
# L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0w
# Ny0wMS5jcnQwDAYDVR0TAQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkq
# hkiG9w0BAQsFAAOCAQEAL9fV6r6YjngcusMqQ6RNTMxlMyhHFeU6lt4W5dc6uz08
# KkDGIyK4QNnY/FFkUhE4g8bvSvnCCCmZgS6WhWUynEXg7KgdhpprKd24sQT/t9/5
# SijbEPASLMyX+dm0qihiyLAqg+ul9dDoCuHqUkLNrEQHKRnuXjGWP/h1t+XY7kR8
# zI/ZRwzWwOjrEI8fyo2wXh+ojmp7qzbk9fMzDHXfKS9kyJ7d230GwxnWNJNpDwda
# S6BUlcAeeU2RaiiXp9VGVHSbuWn1HgM6nGY6t2jrzCfCA4sa6EEFhWGSSZKSAflz
# ZPmtDP7d3dK/H2K+utKHVxJTQAeE20zDrlq3tqxkSKGCA3YwggJeAgEBMIHhoYG3
# pIG0MIGxMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
# BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMQwwCgYD
# VQQLEwNBT0MxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjk2RkYtNEJDNS1BN0RD
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiUKAQEwCQYF
# Kw4DAhoFAAMVAP8WK+8VXLPVtZYrvghLIfxNdAABoIHBMIG+pIG7MIG4MQswCQYD
# VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
# MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMQwwCgYDVQQLEwNBT0MxJzAl
# BgNVBAsTHm5DaXBoZXIgTlRTIEVTTjoyNjY1LTRDM0YtQzVERTErMCkGA1UEAxMi
# TWljcm9zb2Z0IFRpbWUgU291cmNlIE1hc3RlciBDbG9jazANBgkqhkiG9w0BAQUF
# AAIFAN24aXwwIhgPMjAxNzExMTYxOTQ2MDRaGA8yMDE3MTExNzE5NDYwNFowdzA9
# BgorBgEEAYRZCgQBMS8wLTAKAgUA3bhpfAIBADAKAgEAAgI02wIB/zAHAgEAAgIW
# JjAKAgUA3bm6/AIBADA2BgorBgEEAYRZCgQCMSgwJjAMBgorBgEEAYRZCgMBoAow
# CAIBAAIDFuNgoQowCAIBAAIDHoSAMA0GCSqGSIb3DQEBBQUAA4IBAQAtNnXfLBPY
# qzlttlpYuYSvyI8C6SzQOjIdi5Oqz80R2FcLuH6q04FUy3rh5R2elzUN7aH64EnT
# /4ZZYhBRUWykfQaaPG5z1vFOTfNKXfHSfKYD5lnjtnoG68Pxhz7ln6OXXH9+1O3n
# KZe19Tzrvl8ZznvQ6OW/POV+49StDWyy9wD6wlitQbO6BxRVofOb8ZB0K8f2/USF
# cD8JgKjAlc/FZBE9TIQF4VoXGNElzoWFa5xCjPU9DC3EIXZvKeIrmViKFGm3NhFg
# 2f5r8PDeh3qQeYFVRikDIlk4rWodjWaVK8GfvHlyjmWYNyXmKsGc0vRFgyKTmjZ2
# yVeSzWHa9Zv6MYIC9TCCAvECAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
# Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
# dCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
# IDIwMTACEzMAAAC2i0dDssytHwQAAAAAALYwDQYJYIZIAWUDBAIBBQCgggEyMBoG
# CSqGSIb3DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgSWnD2cKL
# VTbPqhLv7Cr60uGtzM7vq2EOaTTLLrLE4sUwgeIGCyqGSIb3DQEJEAIMMYHSMIHP
# MIHMMIGxBBT/FivvFVyz1bWWK74ISyH8TXQAATCBmDCBgKR+MHwxCzAJBgNVBAYT
# AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
# VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
# aW1lLVN0YW1wIFBDQSAyMDEwAhMzAAAAtotHQ7LMrR8EAAAAAAC2MBYEFEysxS8D
# s85wx6JXxgMDmaSh2xqmMA0GCSqGSIb3DQEBCwUABIIBAGLi9cG2j1LpxwMfMfey
# dSIdSbj20VeHiAItV+AbbMRxMZEKf7xMNtwr6LUIXt6Dw1jdYGzB8skp2alPJJdv
# yx7vEgxfC/xAgpBdOrsI8vcu5Qj+wgsKXrWUom7V4OpzVmERF9CDBWxuKEyi55Pq
# IRyPm4lD9rzioSxq7b93vOum8QVt6UITf/ydj/STJlqKmElUp4zMK74IgI8XUHBK
# ZUTFMTRvSYPbQo2R2NnYfFoehatIbJ03KMx16zt29ipXGcKHKomzvmgnSs7qzrqm
# 0TlMd+cdrjlWltGxQQ108s8USuoucJg/j9+nGdPFg7XUCBNECsivcOdJUAyshUen
# BeY=
# SIG # End signature block
