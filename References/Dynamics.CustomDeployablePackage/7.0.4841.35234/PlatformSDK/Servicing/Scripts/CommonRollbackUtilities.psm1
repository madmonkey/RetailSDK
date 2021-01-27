param
(
    [parameter(Position=0,Mandatory=$false)][boolean] $useServiceFabric=$false 
)

if(!$useServiceFabric)
{
    Import-Module WebAdministration
}


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

function StopMonitoring()
{
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
    }
}

function StartMonitoring()
{
    # Read the registry key to find the instrumentation folder
    $regPath = "HKLM:\SOFTWARE\Microsoft\Dynamics\AX\Diagnostics\MonitoringInstall"
    $instrumentationPathKey = "ManifestPath"
    $installPathKey = "InstallPath"

    if (Test-Path $regPath) 
    {
        # Run the scheduled task
        $scheduledTask = Get-ScheduledTask | ? {$_.TaskName -eq "MonitoringInstall"}
        If ($scheduledTask -ne $Null)
        {
            Write-Output "ScheduledTask $scheduledTask exists"
            Start-ScheduledTask $scheduledTask.TaskName -TaskPath $scheduledTask.TaskPath
            Write-Output "$scheduledTask triggered."
        }
    } 
}

function Create-ZipFiles-FromFileList(
    [string[]] $fileList = $(Throw 'fileList parameter required'),
    [string] $destFile = $(Throw 'destFile parameter required'))
{
    Set-Variable zipLocation -Option Constant -Value (Join-Path $env:SystemDrive "DynamicsTools\7za.exe")

    foreach ($element in $fileList) 
    {
        if(-Not (Test-Path $element))
        {
            throw "Path not found: $element"
        }
    }
    
    if(Test-Path $destFile)
    {
        Remove-Item $destFile -Force
    }

    $argumentList = "a" + " $destFile"

    foreach ($element in $fileList) 
    {
        $argumentList = $argumentList + " $element"
    }

    $ZipLog = Join-Path $PSScriptRoot tempZipLog.txt
    if(Test-Path $ZipLog)
    {
        Remove-Item $ZipLog
    }

    $process = Start-Process $zipLocation -ArgumentList $argumentList -NoNewWindow -Wait -PassThru -RedirectStandardOutput $ZipLog #7zip doesn't have stderr
    try { if (!($process.HasExited)) { Wait-Process $process } } catch { }

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
Export-ModuleMember -Function Create-ZipFiles-FromFileList
Export-ModuleMember -Function Create-ZipFiles-FromFileList
Export-ModuleMember -Function StopMonitoring
Export-ModuleMember -Function StartMonitoring
# SIG # Begin signature block
# MIIkAAYJKoZIhvcNAQcCoIIj8TCCI+0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBAIckmujoe3qqT
# SrDHHSrx92TUCDNQBT8egxF040FTUqCCDYIwggYAMIID6KADAgECAhMzAAAAww6b
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
# SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFdQwghXQAgEBMIGVMH4xCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jv
# c29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAADDDpun2LLc9ywAAAAAAMMw
# DQYJYIZIAWUDBAIBBQCggcYwGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYK
# KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIIP7tEYr
# qJb7GeYFuHnwRpUGG2RrR+YcCqRebngc4srlMFoGCisGAQQBgjcCAQwxTDBKoCyA
# KgBBAFgAVQBwAGQAYQB0AGUASQBuAHMAdABhAGwAbABlAHIALgBlAHgAZaEagBho
# dHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEAOizer06h
# oaaG7nO7FEe/rkgNUbKjR4VvUDD5C8KIMy+8pxLuv05vCXn0EWtgXfQyZVGxEeAN
# T4Pe91BIxjAdBklkKQfDTLMJUHuD19/n8AxhpR0qWUP/EMxqJQwMvPb3Poslu0+H
# 99bz2e6/lKzB0r+Dm7I1OaVWkQW2LMLTo6dLmgHiNTbGz8FTG1NYS89adkDZhzo9
# XaFN0j2Tsu8gCvu6v4cShixPZoJ/9Iq2UDIBUSOEse4XfyidWbn53VnsHvSaemmi
# FFUGnrnRqCV/2KOTMUhLX9g5lD3EaZOuAtOH8IF1kv3g1EDlboGtsakpkeOLBbUE
# 7dPh9bxe9FQHBKGCE0YwghNCBgorBgEEAYI3AwMBMYITMjCCEy4GCSqGSIb3DQEH
# AqCCEx8wghMbAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggE8BgsqhkiG9w0BCRABBKCC
# ASsEggEnMIIBIwIBAQYKKwYBBAGEWQoDATAxMA0GCWCGSAFlAwQCAQUABCCOLsxV
# 9WJO/r0bsH42j2JxrlBK3JxJJ2uG4eR1+3y54gIGWrKlun4WGBMyMDE4MDMyNTE5
# MTQyNi4xNjFaMAcCAQGAAgH0oIG4pIG1MIGyMQswCQYDVQQGEwJVUzETMBEGA1UE
# CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
# b2Z0IENvcnBvcmF0aW9uMQwwCgYDVQQLEwNBT0MxJzAlBgNVBAsTHm5DaXBoZXIg
# RFNFIEVTTjoxMkU3LTMwNjQtNjExMjElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUt
# U3RhbXAgU2VydmljZaCCDsowggZxMIIEWaADAgECAgphCYEqAAAAAAACMA0GCSqG
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
# AgECAhMzAAAArIohvHrSm3L0AAAAAACsMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
# BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
# HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
# dCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE2MDkwNzE3NTY1NFoXDTE4MDkwNzE3
# NTY1NFowgbIxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
# VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xDDAK
# BgNVBAsTA0FPQzEnMCUGA1UECxMebkNpcGhlciBEU0UgRVNOOjEyRTctMzA2NC02
# MTEyMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjAN
# BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAocT0PKWOczGhF0Fcq3cIt6nRQ6q7
# 39x0+bo1VmqECdipu/tU9xjZxqWzQ+j6JgHMPTX1fgvkTJgq04aVJQVc3rs7DS9i
# 7I/ZjHSvN4sXm2s3p0qwNK1yyIn1gcyh1T+o87EFqPenB7pB2aiPMUad7WIr4Gqb
# eSy65/UZtiZ/hNIdpSgzsObCLXmYq4jjDx9me5rYGF5sgfE4YHQeOqen6zRqXF69
# daWtVZJXZdImOqAQCkEEsSeQZ+De7ouVo+cA5A2cxgIOp9abTD0zyYS9rqLFvOGI
# 50qf9rLjWqd6joyhGF5qRs72rKuasqj8r36n5LDnzQWiZ7X6QvHSAySq5wIDAQAB
# o4IBGzCCARcwHQYDVR0OBBYEFNhHcKiFNYsTYa+HkOhFFyTgmKcNMB8GA1UdIwQY
# MBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6
# Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
# QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0
# dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIw
# MTAtMDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgw
# DQYJKoZIhvcNAQELBQADggEBAEjs6F4nwxsYnF20znZuNwwfXWMcDV2kI9IVtM7Q
# QAnlm1+s8XntcO0yXl0MdSH089QViQH1ZWuxwNaMWtC4hf1H+q30bxBJhph6/cFh
# G698YhK5ZUxRNlf5nWAUhMHY++JvECwXhWN+wo8eExXvgAfxUJct5L36ySg2mGE0
# 10wBWACqYtAHA03BEl2XLISfzvFGbPX69AYKzpuYe6nkNQiTZgzFRKhJULf3BTt3
# caqwCr9xbv57E+RpAAbvryIm4MV+rTZqnHCCFygC4L+8wyGkQAFrV1fS8J5rLQ1G
# yKfHR/6ElZt7T5wj5awd/gtvLz57yXW7SYv8jrhE3fqy5/qhggN0MIICXAIBATCB
# 4qGBuKSBtTCBsjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
# BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEM
# MAoGA1UECxMDQU9DMScwJQYDVQQLEx5uQ2lwaGVyIERTRSBFU046MTJFNy0zMDY0
# LTYxMTIxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2WiJQoB
# ATAJBgUrDgMCGgUAAxUAOXAlixTIed1fDF3pi5yzlJn3HLeggcEwgb6kgbswgbgx
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xDDAKBgNVBAsTA0FP
# QzEnMCUGA1UECxMebkNpcGhlciBOVFMgRVNOOjI2NjUtNEMzRi1DNURFMSswKQYD
# VQQDEyJNaWNyb3NvZnQgVGltZSBTb3VyY2UgTWFzdGVyIENsb2NrMA0GCSqGSIb3
# DQEBBQUAAgUA3mHtNDAiGA8yMDE4MDMyNTA5NDEwOFoYDzIwMTgwMzI2MDk0MTA4
# WjB0MDoGCisGAQQBhFkKBAExLDAqMAoCBQDeYe00AgEAMAcCAQACAicWMAcCAQAC
# AhnOMAoCBQDeYz60AgEAMDYGCisGAQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwGg
# CjAIAgEAAgMW42ChCjAIAgEAAgMHoSAwDQYJKoZIhvcNAQEFBQADggEBAGNX4lg3
# 3h5b0lcfMjw5L0Rizxlz++Prq71mAc3qZ7+nfL14VkuTLAuiz/Pm01p0szFrA76Y
# 2Trcbk5xS8G8yKAy+5qUhGIxJrQooDTUEk/maWhKF/h+JXTgeovREI2ROgwZ5Y3p
# xuHiwBCJRQ4rnhw9pbPWmm3GZe5iKjwgFpYIEApV3pIybWY+qiKvS2lU2fc4Buey
# NxmxnHIHwuovIKGd3RD9KTRTICSgAzdY2YWo8ZwD87vp2eALUFb0oHA6CH/fVHvM
# 1JVEFIBtH+xDviap29ksjy1gdIVbLlmMSKaQ51oXi5281wfj1dmf+W3rNAATUuw/
# OZtujpCAyHUtzoUxggL1MIIC8QIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UE
# CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
# b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQ
# Q0EgMjAxMAITMwAAAKyKIbx60pty9AAAAAAArDANBglghkgBZQMEAgEFAKCCATIw
# GgYJKoZIhvcNAQkDMQ0GCyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCBHZefM
# u0FwHVjRU8K6D0Q6k7cwmA2R4odsyU1/gkFurjCB4gYLKoZIhvcNAQkQAgwxgdIw
# gc8wgcwwgbEEFDlwJYsUyHndXwxd6Yucs5SZ9xy3MIGYMIGApH4wfDELMAkGA1UE
# BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
# BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
# IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAACsiiG8etKbcvQAAAAAAKwwFgQU6M5t
# jmsj2X+o4ctxZjD2NAZDhzgwDQYJKoZIhvcNAQELBQAEggEAmAV8Kjd0MzcFwpNh
# 0VyidPe0QhTD1w8Y1Oiw+nBIFlXYa/slsPt+viYXL3iPNfAhbLZrbPgFTMJWwVks
# eCSTVNT/mBv0Ge0ojeCKQrrHg/OiupMzZgyv50Ah5os5dGQga3xdDyu4y+0qAQRd
# +mJbfBczb1TFvdCpXC67dYptaUeoZP4KK+/LDKi7aCD4NmtzW+ObGgdujPr7AMUl
# +Be4D0NWQ6CAlNXiylkS4sqvNdExSI+xefJaS805gQ3HTPbt5SG2216uafoB8nct
# 1a0D9fObzskCErUd8/zhnUhsfDwYwuRNx6zt6enkzJ320vizWXpUcT3pwkeVyT1c
# zIJXhA==
# SIG # End signature block
