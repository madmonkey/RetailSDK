<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

<#
.SYNOPSIS
    Allows a user to update Cloud POS deployment.

.DESCRIPTION
    This script provides a mechanism to update existing Cloud POS deployment on a local system.

.PARAMETER RETAILCLOUDPOSWEBSITENAME
    The name of Cloud POS website which is deployed on the local system.

.PARAMETER MINSUPPORTEDVERSION
    An optional parameter to specify the minimum supported build version for Cloud POS service. If the current installed version is less than this then the script will not support update.

.PARAMETER LOGPATH
    Location where all the logs will be stored.

.EXAMPLE 
    # Update the existing Cloud POS deployment with minimum supported version "7.0.0.0". 
    .\UpdateCloudPos.ps1 -MinSupportedVersion "7.0.0.0"
#>

param (
	$RetailCloudPosWebSiteName = 'RetailCloudPos',
	$MinSupportedVersion,
	[string] $LogPath = $env:TEMP
)

$ErrorActionPreference = 'Stop'

function IsMicrosoftUpdateApplicable(
    [string]$webSitePhysicalPath = $(throw 'webSitePhysicalPath is required'),
    [string]$updatePackageCodeDir)
{
    [bool]$isUpdateApplicable = $false

    $bldverJsonFileDeployed = Join-Path $webSitePhysicalPath 'bldver.json'
    $bldverJsonFileInPackage = Join-Path $updatePackageCodeDir 'bldver.json'
	
	Log-TimedMessage 'Checking if bldver.json file exists.'
	
	if(!(Test-Path $bldverJsonFileDeployed) -or !(Test-Path $bldverJsonFileInPackage))
	{
	    throw 'No. bldver.json file is missing.'
	}
	
	Log-TimedMessage 'Yes. Checking if update is applicable.'
	$fileObjDeployed = "[$(Get-Content $bldverJsonFileDeployed)]" | ConvertFrom-Json
    $fileObjInPackage = "[$(Get-Content $bldverJsonFileInPackage)]" | ConvertFrom-Json
	
	if($fileObjInPackage.publisher -eq 'Microsoft Corporation')
	{
        if($fileObjDeployed.publisher -eq 'Microsoft Corporation')
        {
            Log-TimedMessage 'Yes.'
	        $isUpdateApplicable = $true
        }
        else
	    {
	        Log-TimedMessage 'No. Microsoft update is not applicable for this Retail Cloud Pos deployment.'
	    }	    
	}
    else
    {
        Log-TimedMessage 'Yes.'
	    $isUpdateApplicable = $true
    }	
	
	return $isUpdateApplicable
}

function Update-EnvironmentId(
    [ValidateNotNullOrEmpty()]
	[string]$configFilePath = $(throw 'configFilePath is required')
)
{
    # Check if update config.json file contains environment id
    $config = Get-Content $configFilePath
    $configJsonObject = "[ $config ]" | ConvertFrom-JSON

    # Read from registry
    Log-TimedMessage 'Retrieving LCS Environment Id...'
    $envId = Get-LcsEnvironmentId

    if(![string]::IsNullOrWhiteSpace($envId))
    {
        Log-TimedMessage 'Updating LCS Environment Id in config.json...'

        $configJsonObject | Add-Member -MemberType NoteProperty -Name 'EnvironmentId' -Value $envId -Force

        $configJsonObject | ConvertTo-Json | Out-File $configFilePath -Force

        Log-TimedMessage 'Finished updating LCS Environment Id in config.json...'
    }
    else
    {
        # In case of VHD download scenario, Environment Id doesn't exist.
        Log-TimedMessage 'Skip updating LCS Environment Id since it was not set for this environment.'
    }
}

function Upgrade-RetailCloudPOSWebsite(
    [string] $webSiteName = $(throw 'webSiteName is required'),
    [string] $webSitePhysicalPath = $(throw 'webSitePhysicalPath parameter is required'),
    [string] $updatePackageCodeDir =  $(throw 'updatePackageCodeDir parameter is required'),
    [bool] $isPackageDelta,
    [string] $installationInfoXmlPath,
	[bool]$isMsftUpdateApplicable)
{
	# We want to update the deployment in following cases:
	#	1. If package type is delta then, we want to apply the update no matter whether the current deployment on the machine is ISV deployment or not.
	#	2. If package type is full package and Microsoft update is applicable.
    if(!(!$isPackageDelta -and !$isMsftUpdateApplicable))
	{
        Log-TimedMessage 'Begin updating Retail Clous Pos deployment...'

        # Create a temp working folder
	    $tempWorkingFolder = Join-Path $env:temp ("{0}_Temp_{1}" -f $webSiteName, $(Get-Date -f yyyy-MM-dd_hh-mm-ss))        

        # Get list of all files to be updated
        $fileList = Get-ListOfFilesToCopy -isPackageDelta $isPackageDelta `
                                          -installationInfoXmlPath $installationInfoXmlPath `
                                          -updatePackageCodeFolder $updatePackageCodeDir

        # Copy all the update files to a temp location
        $fileList | % { 
            Copy-Files -SourceDirPath $updatePackageCodeDir `
                         -DestinationDirPath $tempWorkingFolder `
                         -FilesToCopy $_ `
                         -RobocopyOptions '/S /njs /ndl /np /njh' 
        }
	    
        Log-TimedMessage 'Checking if config file needs to be merged.'
        if($fileList -contains 'config.json')
        {
            Log-TimedMessage 'Yes.'

            # Migrate config.json
            Log-TimedMessage 'Merging config file.'
            $reservedSettings = Get-NonCustomizableConfigSettings
            Merge-JsonFile -sourceJsonFile (Join-Path $webSitePhysicalPath 'config.json') -targetJsonFile (Join-Path $tempWorkingFolder 'config.json') -nonCustomizableConfigSettings $reservedSettings
            Update-EnvironmentId -configFilePath (Join-Path $tempWorkingFolder 'config.json')
        }

        # Replace website files from temp working directory to actual working directory
        Replace-WebsiteFiles -webSiteName $webSiteName -newWebFilesPath $tempWorkingFolder

        # Remove the temp working folder
        Log-TimedMessage ('Removing temporary working directory' -f $tempWorkingFolder)
        Remove-Item $tempWorkingFolder -Recurse -Force -ErrorAction SilentlyContinue

        Log-TimedMessage 'Finished updating Retail Clous Pos deployment...'
    }
    else
    {
        Log-TimedMessage '#### Warning: Skipping the update. ####'
        Log-TimedMessage ('Is update package delta - [{0}] and Is Microsoft update applicable - [{1}]' -f $isPackageDelta, $isMsftUpdateApplicable)
    }
}

function Get-NonCustomizableConfigSettings()
{
    $nonCustomizableConfigSettings = @(
    'AppInsightsInstrumentationKey',
    'AADClientId',
    'AADLoginUrl',
    'AdminPrincipalName',
    'EnvironmentId',
    'CommerceAuthenticationAudience',
    'AppInsightsApplicationName',
    'AADRetailServerResourceId',
    'RetailServerUrl')
    
    return $nonCustomizableConfigSettings 
}

try
{
	$ScriptDir = Split-Path -parent $MyInvocation.MyCommand.Path
	. (Join-Path $ScriptDir 'Common-Configuration.ps1')
	. (Join-Path $ScriptDir 'Common-Web.ps1')
	. (Join-Path $ScriptDir 'Common-Upgrade.ps1')

	# Get the service model Code folder from the update package
    Log-TimedMessage 'Getting the Code folder from the deployable update package.'
    $updatePackageCodeDir = (Join-Path (Split-Path (Split-Path (Split-Path $ScriptDir -Parent) -Parent) -Parent) 'Code')
	
	if(!(Check-IfAnyFilesExistInFolder -folderPath $updatePackageCodeDir))
	{
		Log-TimedMessage ('Update Code folder {0} does not exist or is empty. Skipping the update.' -f $updatePackageCodeDir)
		return
	}
	
    Log-TimedMessage ('Found the Code folder from the deployable update package at - {0}.' -f $updatePackageCodeDir)
	
    # Get website physical path.
    Log-TimedMessage ('Getting website physical path for website - {0}' -f $RetailCloudPosWebSiteName)
    $webSitePhysicalPath = Get-WebSitePhysicalPath -webSiteName $RetailCloudPosWebSiteName
    Log-TimedMessage ('Found website physical path - {0}' -f $webSitePhysicalPath)
    
    # Get the installation info manifest file.
    Log-TimedMessage 'Getting installation info XML path.'
	$installationInfoFile = Get-InstallationInfoFilePath -scriptDir $ScriptDir
    Log-TimedMessage ('Found installation info XML path - {0}' -f $installationInfoFile)

    # Determine the package type.
    [bool]$isPackageDelta = Is-PackageDelta -installationInfoFile $installationInfoFile
	
	# Determine is Microsoft Update is applicable
	[bool]$isMsftUpdateApplicable = IsMicrosoftUpdateApplicable -webSitePhysicalPath $webSitePhysicalPath -updatePackageCodeDir $updatePackageCodeDir
	
	# Rename the manifest installation info file if:
    #    1. Package is of type delta
    #    2. If update is not applicable.
    # For each update, the installer updates the deployment version of the machine with values in the installation info file.
    # Renaming this file for above cases will not update the deployment version on the machine.
    if(!$isMsftUpdateApplicable -or $isPackageDelta)
    {
       $installationInfoFile = Rename-InstallationInfoFile -filePath $installationInfoFile
    }

    # Upgrade Retail Cloud POS 
	Upgrade-RetailCloudPOSWebsite -webSiteName $RetailCloudPosWebSiteName `
                                  -webSitePhysicalPath $webSitePhysicalPath `
                                  -updatePackageCodeDir $updatePackageCodeDir `
                                  -isPackageDelta $isPackageDelta `
                                  -installationInfoXmlPath $installationInfoFile `
								  -isMsftUpdateApplicable $isMsftUpdateApplicable
}
catch
{
    Log-Error ($global:error[0] | format-list * -f | Out-String)
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine
    $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: {0} Value: {1}{2}" -f $_.ToString(), $PSBoundParameters[$_.ToString()], [System.Environment]::NewLine}
    Log-TimedMessage ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine)
    throw ($global:error[0] | format-list * -f | Out-String)
}
# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAV20WzQUBKHmBD
# EGYRJIxyU+SQpA+SAnLe+3J8joF0C6CCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCAg
# 7LzwKs3u4HiQdf+eczbIy+/IdPoJTPzZZMlVCLUvbDCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQCA
# jKFkxwWdF6PzGTyifHgMb/R8pf1P6fzy0OsrKLePnox3+eP0K8jIudH3ThcF82Vy
# sd7CB7A8ZB0FEd0W9hZkT1i49OLeFs0TkRjKKemSKxpht0oRWgUsFIF/6ztH//+O
# 6DttQGJBQlmqLMnKevGU3UJGvbOqENR47LY3AukEZw6xetAdBaOZZsLZ81B3OD3K
# WnPLqQDV5n+24YZ96HYLsvaJ0KfWAEGbZVyPdQGNjULsPovros0PE/v1RfRXEzl1
# D3OGmJ2ASsJDBYZreJU5DWAYzNZ4Vs3LvfQhoH4TsP+RLnAJaa7UgaTv8ITukMFO
# jxvIi+Qkw2OQgbkuSv15oYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IBmAS7QEMxnMLcEDh8Z7lMP+QR5RJNvWMw8YdS/iNvhPAgZfPSuXhrgYEzIwMjAw
# ODIzMDQwMjQ4LjE0N1owBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
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
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgiqtlfiH5mxX5d9gjKV32bQSwjsZ0C6xE
# H9ujXL9LihYwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCBXAzYkM7qhDCgN
# 6EbxXbZtR3HNkNZaGSMYHzfL5NKsqjCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABClLIOQFS0XBLAAAAAAEKMCIEIBqZiGzGyIFc26q+
# oooMu/H2aOjzZBnUZTqvwvMjKN1IMA0GCSqGSIb3DQEBCwUABIIBADp8YlvkTsAL
# 1u7Qsq/MJVGlQSP14Lncl84UBmdTYjQR18KeqodOxOai1ilkynFc4s6Fxo38P5No
# sl6US1syqXkbniR0GVmpGmgJhD4VxBqHfDEzmgw/KZx3voOipvMGhxyexbJxNtgA
# 73hwG8nSKa8YJcEFdHq1n6Xpn7P/ixm7pKmKAbmP60DIqzglARAbq4sCyRGSLdq+
# +NaW+Mwq2xM9MxOUPorGdfroZJl8/680Mab4wZfJC6gqvmfh4E5CEWZUOnIdTVN6
# j+eleO3Qqd/rndLkt/JeVT/Xhm8bWRKlFYDS9f1KfuNZyj4g02Bw+wiNzD0Bgrq0
# XF0uz17uxK0=
# SIG # End signature block
