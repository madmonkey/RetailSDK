<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

<#
.SYNOPSIS
    Allows a user to update Retail Storefront deployment.

.DESCRIPTION
    This script provides a mechanism to update existing Retail Storefront deployment on a local system.

.PARAMETER RETAILSTOREFRONTWEBSITENAME
    The name of Retail Storefront website which is deployed on the local system.

.PARAMETER MINSUPPORTEDVERSION
    An optional parameter to specify the minimum supported build version for Retail Storefront service. If the current installed version is less than this then the script will not support update.

.EXAMPLE 
    # Update the existing Retail Storefront deployment with minimum supported version "7.0.0.0". 
    .\UpdateStorefront.ps1 -MinSupportedVersion "7.0.0.0"
#>

param (
	$RetailStorefrontWebsiteName = 'RetailStorefront',
	$MinSupportedVersion
)

$ErrorActionPreference = 'Stop'

function Update-WebConfigCustomConfigSections(
	[string]$sourceWebConfigFilePath = $(throw 'sourceWebConfigFilePath is required'),
	[string]$targetWebConfigFilePath = $(throw 'targetWebConfigFilePath is required'))
{
	if((Test-Path -Path $sourceWebConfigFilePath) -and (Test-Path -Path $targetWebConfigFilePath))
	{
		[xml]$sourceWebConfigFilePathDoc = Get-Content $sourceWebConfigFilePath
		[xml]$targetWebConfigFilePathDoc = Get-Content $targetWebConfigFilePath
		foreach($section in $sourceWebConfigFilePathDoc.configuration.configSections.section)
		{
            ### Start - Add or update Configuration section

			# Check and see if we have one of these elements already.
			$configElement = $targetWebConfigFilePathDoc.configuration.configSections.section | Where-Object { $_.name -eq $section.name }

			# Only add a new element if one doesn't already exist.
			if(!$configElement)
			{
				$configElement = $targetWebConfigFilePathDoc.CreateElement('section')
				$xmlKeyAtt = $targetWebConfigFilePathDoc.CreateAttribute("name")
				$xmlKeyAtt.Value = $section.key
				$configElement.Attributes.Append($xmlKeyAtt)
				$xmlValueAtt = $targetWebConfigFilePathDoc.CreateAttribute("type")
				$xmlValueAtt.Value = $section.value
				$configElement.Attributes.Append($xmlValueAtt)
				$targetWebConfigFilePathDoc.configuration.appSettings.AppendChild($configElement)
			}

            ### End - Add or update Configuration section

            # Update the actual configuration element for RetailConfiguration (identity providers)
            if($section.name -eq "retailConfiguration")
            {
                # Go through all identity providers in deployed config
                foreach($identityProvider in $sourceWebConfigFilePathDoc.configuration.SelectSingleNode($section.name).identityProviders.add)
                {
                    # Check and see if we given identity provider is in new deployment config

			        $configIdentityProviderElement = $targetWebConfigFilePathDoc.configuration.SelectSingleNode($section.name).identityProviders.add | Where-Object { $_.name -eq $identityProvider.name }
                    
                    # If not found then we will add from deployed config to new config
                    if(!$configIdentityProviderElement)
                    {
                        $identityProviderToBeAdded = $targetWebConfigFilePathDoc.ImportNode($identityProvider, $true)
				        $targetWebConfigFilePathDoc.configuration.SelectSingleNode($section.name).identityProviders.AppendChild($identityProviderToBeAdded)
                    }
                    # Else update identity provider from deployed config to new config
                    else
                    {
                        $configIdentityProviderElement = $identityProvider
                    }
                }
            }
            ### End - Add or Update the actual configuration element for EcommerceControls (we only update retailServerUrl and operatingUnitNumber)
		}
		
		Set-ItemProperty $targetWebConfigFilePath -name IsReadOnly -value $false
		$targetWebConfigFilePathDoc.Save($targetWebConfigFilePath)
	}
	else
	{
		throw "either $sourceWebConfigFilePath or $targetWebConfigFilePath doesn't exist"
	}
}

function Upgrade-RetailStorefrontWebsite(
    [string] $webSiteName = $(throw 'webSiteName is required'),
    [string] $webSitePhysicalPath = $(throw 'webSitePhysicalPath parameter is required'),
    [string] $scriptDir =  $(throw 'scriptDir parameter is required'),
    [bool] $isPackageDelta,
    [string] $installationInfoXmlPath)
{
    Log-TimedMessage 'Begin updating Retail Storefront deployment...'
    
    # Get the service model Code folder from the update package
    Log-TimedMessage 'Getting the Code folder from the deployable update package.'
    $updatePackageCodeDir = (Join-Path (Split-Path (Split-Path (Split-Path $ScriptDir -Parent) -Parent) -Parent) 'Code')
    if(!(Test-Path $updatePackageCodeDir))
    {
        Log-TimedMessage ('Could not find deployable update package at - {0}. Exiting update.' -f $updatePackageCodeDir)
        return
    }
    else
    {
        Log-TimedMessage ('Found the Code folder from the deployable update package at - {0}.' -f $updatePackageCodeDir)
    }

    $webConfigFileName = 'web.config'   
    $webConfigPath = (Join-Path $webSitePhysicalPath $webConfigFileName)

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
	    
    Log-TimedMessage 'Checking if config file exists so it can merged for app settings and update for custom configuration sections.'
    if($fileList -contains 'web.config')
    {
        Log-TimedMessage 'Yes.'

        # Migrate AppSettings from deployed config to Temp Folder config
        [array]$nonCustomizableAppSettings = Get-NonCustomizableAppSettings
	    Merge-WebConfigAppSettings -sourceWebConfigFilePath $webConfigPath `
                                   -targetWebConfigFilePath (Join-Path $tempWorkingFolder $webConfigFileName) `
                                   -nonCustomizableAppSettings $nonCustomizableAppSettings
        
        # Ecommerce Control and RetailConfiguration elements are updated from deployed config to temp folder config
        Update-WebConfigCustomConfigSections -sourceWebConfigFilePath $webConfigPath -targetWebConfigFilePath (Join-Path $tempWorkingFolder $webConfigFileName)
    }

    # Replace website files from temp working directory to actual working directory
    Replace-WebsiteFiles -webSiteName $webSiteName -newWebFilesPath $tempWorkingFolder

    # Remove the temp working folder
    Log-TimedMessage ('Removing temporary working directory' -f $tempWorkingFolder)
    Remove-Item $tempWorkingFolder -Recurse -Force -ErrorAction SilentlyContinue

    Log-TimedMessage 'Finished updating Retail Storefront deployment...'
}

function Get-NonCustomizableAppSettings()
{
    $nonCustomizableAppSettings = @(
    'RetailServerRoot'
    )
    
    return $nonCustomizableAppSettings 
}

try
{
	$ScriptDir = Split-Path -parent $MyInvocation.MyCommand.Path
	. (Join-Path $ScriptDir 'Common-Configuration.ps1')
	. (Join-Path $ScriptDir 'Common-Web.ps1')
	. (Join-Path $ScriptDir 'Common-Upgrade.ps1')

    # Get website physical path.
    Log-TimedMessage ('Getting website physical path for website - {0}' -f $RetailStorefrontWebsiteName)
    $webSitePhysicalPath = Get-WebSitePhysicalPath -webSiteName $RetailStorefrontWebsiteName
    Log-TimedMessage ('Found website physical path - {0}' -f $webSitePhysicalPath)
    
    # Get the installation info manifest file.
    Log-TimedMessage 'Getting installation info XML path.'
	$installationInfoFile = Get-InstallationInfoFilePath -scriptDir $ScriptDir
    Log-TimedMessage ('Found installation info XML path - {0}' -f $installationInfoFile)

    # Determine the package type.
    [bool]$isPackageDelta = Is-PackageDelta -installationInfoFile $installationInfoFile
	
	# Rename the manifest installation info file if - Package is of type delta
	# For each update, the installer updates the deployment version of the machine with values in the installation info file.
    # Renaming this file for above cases will not update the deployment version on the machine.
    if($isPackageDelta)
    {
       $installationInfoFile = Rename-InstallationInfoFile -filePath $installationInfoFile
    }

    # Upgrade Retail Storefront
    Upgrade-RetailStorefrontWebsite -webSiteName $RetailStorefrontWebsiteName `
                                    -webSitePhysicalPath $webSitePhysicalPath `
                                    -scriptDir $ScriptDir `
                                    -isPackageDelta $isPackageDelta `
                                    -installationInfoXmlPath $installationInfoFile
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
# MIIjqgYJKoZIhvcNAQcCoIIjmzCCI5cCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDiHmQtSE1pE9Gk
# YhpA2xGujTfhY4TjKQTp6jISCT4zc6CCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# cVZOSEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFXswghV3AgEBMIGVMH4x
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01p
# Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAAGIr1LWuZJt6PkAAAAA
# AYgwDQYJYIZIAWUDBAIBBQCggc4wGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQw
# HAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIKNy
# 4VXek/IaFtB80wz5f0d5aQ1qm/Ky5DFMkFyLvSpcMGIGCisGAQQBgjcCAQwxVDBS
# oDSAMgBTAHQAbwBwAC0AUgBlAHQAYQBpAGwAUwB0AG8AcgBlAGYAcgBvAG4AdAAu
# AHAAcwAxoRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEF
# AASCAQAXqS/FvtwqHUn/ggaQStDX1TDAP2rj5jhC6j+ye1SoUQH039cRL2yYsv7m
# PUYe0Vfc2IiB7Q+Z/RBLux56U8SbugxLGXLhymRh4eEnFWlMRNw+5dARDT9myVPA
# Nfl1aQN8EheuN3qAoi4azOYyroIriO6lpcZFxG7RRQhZ/PMuK12qKfme1qcH6aRU
# Jx9Vl6BgCCh0+tTakYUxmvB0hkNDTlOSAvN1Rmki+biRFqHlRGzs8cvt1Vh82ZV0
# i0jEBqOyn7IhIKUg+AWkfhN3FtuINxVshIO+XLdLzQbLsxm+VLyFvZoXxJsengUI
# 1MxKcUmcO8SBVbtZe4oM86adyqoEoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIIS
# zQYJKoZIhvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqG
# SIb3DQEJEAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUD
# BAIBBQAEIKAYo0PYQxSA2aac67PrLN0dSJgDmn2HK/Mn1+ASbAEdAgZfOtNP9swY
# EzIwMjAwODIzMDIzMzM5Ljg5MlowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVT
# MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
# ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29mdCBBbWVy
# aWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjIyNjQtRTMz
# RS03ODBDMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIO
# PDCCBPEwggPZoAMCAQICEzMAAAEY/jr32RvUsTMAAAAAARgwDQYJKoZIhvcNAQEL
# BQAwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
# B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UE
# AxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMTEzMjE0MDM1
# WhcNMjEwMjExMjE0MDM1WjCByjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3BlcmF0aW9uczEm
# MCQGA1UECxMdVGhhbGVzIFRTUyBFU046MjI2NC1FMzNFLTc4MEMxJTAjBgNVBAMT
# HE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUA
# A4IBDwAwggEKAoIBAQDC+ANcEX8/NRj1t5YkXYB1ZHPxQSwrhOOfXX1c5aes0t2g
# TI6OeH4ntcwpyTvSk7+9BBVoqTvHwfbDZmb15nQ94q+UPfBqa/8m1tes/6Fbt1Ae
# VHy4By1AVFi6Yi1vWd3bVRyY2SAeVonIzEFGGtQveRv2Yj6jbCHE2+xP3Q+Acgxw
# eE8l6/nAN5S/mTDKV2flHNQg+d5X9SSN7MdLC5OAJgSy374Ii/AnYEKyIgnOFJVk
# IxkLDxOyrnV/gORloaxyVGlDemnLBNahwsxnmkrpChcwvDieAx4g/Z1fJ0+C+wdA
# +EtA7rrgnRkjhKHfWkZj40bmx4GpQdJmF1zAZ0FxAgMBAAGjggEbMIIBFzAdBgNV
# HQ4EFgQU8VvlsC4PYAnYOU/05iPr+LTHKD4wHwYDVR0jBBgwFoAU1WM6XIoxkPND
# e3xGG8UzaFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3Nv
# ZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEu
# Y3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNy
# b3NvZnQuY29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQw
# DAYDVR0TAQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsF
# AAOCAQEAcyWdvg6cgs//AmxoQZm+WASpJzUXEPhMp30bWc5HyCwQB+Ma6YPncSoF
# dct/5V1K4p/rMcMLBn5LzELVH+uztg6ERK48YtbJb9A7Jp+fJZj7loXaP9mVP7tJ
# s2tGuubcXpGbgo5HGCjn7gzMBHY45Q8LScfa1JFQEAiS2gCKKRlrKMsGaIbi+UuB
# tsbQ8JknvmiEwCCwSmRTX0viAZusm4mJVqKBe3Bmj+yBDJVWcv0MyrEYQ74oa0VS
# W3JBc+xSrqT2Jgm2Cc6IlSbm8AsiVE/Vc4yahfmLeeFHfTcrK0flu6VGzjf1GNA1
# SDXR4bUinrBli3lfhwtKhx6x5eRsSjCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIw
# DQYJKoZIhvcNAQELBQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
# dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
# YXRpb24xMjAwBgNVBAMTKU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhv
# cml0eSAyMDEwMB4XDTEwMDcwMTIxMzY1NVoXDTI1MDcwMTIxNDY1NVowfDELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQCpHQ28dxGKOiDs/BOX9fp/aZRrdFQQ1aUKAIKF++18aEssX8XD5WHC
# drc+Zitb8BVTJwQxH0EbGpUdzgkTjnxhMFmxMEQP8WCIhFRDDNdNuDgIs0Ldk6zW
# czBXJoKjRQ3Q6vVHgc2/JGAyWGBG8lhHhjKEHnRhZ5FfgVSxz5NMksHEpl3RYRNu
# KMYa+YaAu99h/EbBJx0kZxJyGiGKr0tkiVBisV39dx898Fd1rL2KQk1AUdEPnAY+
# Z3/1ZsADlkR+79BL/W7lmsqxqPJ6Kgox8NpOBpG2iAg16HgcsOmZzTznL0S6p/Tc
# ZL2kAcEgCZN4zfy8wMlEXV4WnAEFTyJNAgMBAAGjggHmMIIB4jAQBgkrBgEEAYI3
# FQEEAwIBADAdBgNVHQ4EFgQU1WM6XIoxkPNDe3xGG8UzaFqFbVUwGQYJKwYBBAGC
# NxQCBAweCgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8w
# HwYDVR0jBBgwFoAU1fZWy4/oolxiaNE9lJBb186aGMQwVgYDVR0fBE8wTTBLoEmg
# R4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWlj
# Um9vQ2VyQXV0XzIwMTAtMDYtMjMuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEF
# BQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNSb29D
# ZXJBdXRfMjAxMC0wNi0yMy5jcnQwgaAGA1UdIAEB/wSBlTCBkjCBjwYJKwYBBAGC
# Ny4DMIGBMD0GCCsGAQUFBwIBFjFodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vUEtJ
# L2RvY3MvQ1BTL2RlZmF1bHQuaHRtMEAGCCsGAQUFBwICMDQeMiAdAEwAZQBnAGEA
# bABfAFAAbwBsAGkAYwB5AF8AUwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3
# DQEBCwUAA4ICAQAH5ohRDeLG4Jg/gXEDPZ2joSFvs+umzPUxvs8F4qn++ldtGTCz
# wsVmyWrf9efweL3HqJ4l4/m87WtUVwgrUYJEEvu5U4zM9GASinbMQEBBm9xcF/9c
# +V4XNZgkVkt070IQyK+/f8Z/8jd9Wj8c8pl5SpFSAK84Dxf1L3mBZdmptWvkx872
# ynoAb0swRCQiPM/tA6WWj1kpvLb9BOFwnzJKJ/1Vry/+tuWOM7tiX5rbV0Dp8c6Z
# ZpCM/2pif93FSguRJuI57BlKcWOdeyFtw5yjojz6f32WapB4pm3S4Zz5Hfw42JT0
# xqUKloakvZ4argRCg7i1gJsiOCC1JeVk7Pf0v35jWSUPei45V3aicaoGig+JFrph
# pxHLmtgOR5qAxdDNp9DvfYPw4TtxCd9ddJgiCGHasFAeb73x4QDf5zEHpJM692VH
# eOj4qEir995yfmFrb3epgcunCaw5u+zGy9iCtHLNHfS4hQEegPsbiSpUObJb2sgN
# VZl6h3M7COaYLeqN4DMuEin1wC9UJyH3yKxO2ii4sanblrKnQqLJzxlBTeCG+Sqa
# oxFmMNO7dDJL32N79ZmKLxvHIa9Zta7cRDyXUHHXodLFVeNp3lfB0d4wwP3M5k37
# Db9dT+mdHhk4L7zPWAUu7w2gUDXa7wknHNWzfjUeCLraNtvTX4/edIhJEqGCAs4w
# ggI3AgEBMIH4oYHQpIHNMIHKMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
# Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
# cmF0aW9uMSUwIwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25zMSYw
# JAYDVQQLEx1UaGFsZXMgVFNTIEVTTjoyMjY0LUUzM0UtNzgwQzElMCMGA1UEAxMc
# TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAzdeb
# 1yAva2kJJ2mFfDdeSfFJMdyggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UE
# CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
# b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQ
# Q0EgMjAxMDANBgkqhkiG9w0BAQUFAAIFAOLr6TIwIhgPMjAyMDA4MjMwMjU3NTRa
# GA8yMDIwMDgyNDAyNTc1NFowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA4uvpMgIB
# ADAKAgEAAgIcdgIB/zAHAgEAAgIRzjAKAgUA4u06sgIBADA2BgorBgEEAYRZCgQC
# MSgwJjAMBgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqG
# SIb3DQEBBQUAA4GBAEyeJovhhPo+MQXUgNvFILKNbRdFBBAcwkYc98jt2/YvXFZD
# CsMLua/T9BRCJahPQqnB8xmfCRd7zz4ENlRl+e3hkTpUje9V6ajj2x3wTogQBLsX
# NNnnBN8zhh5vUrHBLfMvyzc48e2ZX0tDpNdXKBMu3pgs1m/1TK1OKVCR8GX+MYID
# DTCCAwkCAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
# EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
# bjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEY
# /jr32RvUsTMAAAAAARgwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzEN
# BgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgRjIm0eUCAykAfAhfOMbSYMyp
# 1hA71J8hMcNEucQqO4cwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCCgzwcU
# m6pSA48AVS+9m5Z+k6cHH7WyNjvPil0oMg0H9zCBmDCBgKR+MHwxCzAJBgNVBAYT
# AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
# VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
# aW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABGP4699kb1LEzAAAAAAEYMCIEIOl7Yeto
# cPFlPjLrEhaPKNsoGAiTd29TpryJ5vBtdkb+MA0GCSqGSIb3DQEBCwUABIIBAIVT
# 0PAxJ1x/tDeCDeMeb5ZUsGYlZsvboWSMGT3pqkYAxTCGuTMlED+zHnjgW09EbgDm
# SrrSPs3BS1nXkTIZLAPfJ+B4udfrXQd8g3H03ZAEVevbUWACL8eJo5C1N97Po2pX
# S2zh5Vyqp8RoiS+1JJxMLhqayYIUdA2kqD8a5I4t/32R1/0okkVLvAcy3l3S8U00
# 7f8UvbxvJcdPOJa4t9k7KoQJaSM8HIpxaBSWMFwdZjBQjR4/DLFoj+oGkZLIvbrh
# aZjC1SonApNOHyHi9dnY0H1kpY1YzPbApP9G6aDQff1EEorlLt5e9sf79owlzVt+
# DHPk2mYvs1DvQJgEcHQ=
# SIG # End signature block
