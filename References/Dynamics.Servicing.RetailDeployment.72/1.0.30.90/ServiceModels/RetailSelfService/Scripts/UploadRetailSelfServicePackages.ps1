<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

<#
.SYNOPSIS
    Allows a user to upload Retail self-service packages from a machine hosting Microsoft Dynamics AOS server onto the Azure Cloud Storage.

.DESCRIPTION
    This script provides a mechanism to upload a file available on the local file system of a machine hosting Microsoft Dynamics AOS server onto the Azure Cloud Storage.
    These packages can then be downloaded via the web interface of AOS for customers with an activated Retail license subscription.

.PARAMETER PACKAGEFILEPATH
    The full path to the package file which needs to be uploaded to the cloud storage.

.PARAMETER PACKAGEFRIENDLYNAME
    An optional friendly name visible to the user in the AX user-interface. If not provided a default value containing name of the package without extension is used.

.PARAMETER PACKAGEDESCRIPTION
    An optional brief description of the package which will be visible from AOS. If not provided a default value made up of the package name and version is used.

.PARAMETER PACKAGEVERSION
    The package file version.

.PARAMETER PACKAGETYPE
    The type of the package being uploaded. Currently supported types: ModernPosWithOffline, ModernPosWithoutOffline, HardwareStation, AsyncServerConnectorService, RealtimeServiceAX63, Miscellaneous.

.PARAMETER PACKAGEREPLACEMODE
    Specify action to be performed if another package exists of the same name or type but different version. Currently supported types:
    None: If chosen, will not upload the specified package while not touching any other existing package.
    ReplaceExistingByType: If chosen, will remove all existing packages with the same package type, following which this package will be upload.
    ReplaceExistingByName: If chose, will look for all files with the same friendly name as the currently specified package and will remove them, following which this package will be upload.
    Default = None.
    
.PARAMETER ASSIGNTOSTORES
    An optional comma seperated list of stores for which the current package will be set as the default package.

.PARAMETER AOSWEBSITENAME
    The name of the AOS website as shown in IIS. Default = AOSService

.PARAMETER LOGFILE
    Location or name of the file where all the logs will be stored. Default = UploadRetailSelfServicePackages.log

.EXAMPLE 
    # Upload a package located at 'C:\Packages\ModernPOSSetup.exe' with version "7.0.968.0" and PackageType as 'ModernPosWithOffline'. 
    # If there exists a package of the same name but different version in the cloud storage, the existing package will NOT be removed from the storage unless PackageReplaceMode is set to 'ReplaceExistingByName'.
    .\UploadRetailSelfServicePackages.ps1 -PackageFilePath "C:\Packages\ModernPOSSetup.exe" -PackageVersion "7.0.968.0" -PackageType ModernPosWithOffline

.EXAMPLE 
    # Upload a package located at 'C:\Packages\ModernPOSSetup.exe' with version "7.0.968.0" and PackageType as 'ModernPosWithOffline'. 
    # If there exists a package of the same friendly name but different version in the cloud storage, it shall be removed from the storage.
    # The details required to access the cloud storage will be accessed via the configuration file available for the IIS website 'MyCompanyWebsite'.
    .\UploadRetailSelfServicePackages.ps1 -PackageFilePath "C:\Packages\ModernPOSSetup.exe" -PackageVersion "7.0.968.0" -PackageReplaceMode ReplaceExistingByName -PackageType ModernPosWithOffline -AOSWebsiteName "MyCompanyWebsite"
#>

param(
    # Executable parameters
    [ValidateScript({Test-Path -Path $_ -PathType Leaf})]
    [string]$PackageFilePath = $(Throw 'PackageFilePath is required!'),
    
    [string]$PackageFriendlyName,

    [string]$PackageDescription,
    
    [string]$PackageVersion = $(Throw 'PackageVersion is required!'),
    
    [ValidateSet("AsyncServerConnectorService", "ModernPosWithOffline", "ModernPosWithoutOffline", "HardwareStation", "Miscellaneous", "RetailStoreScaleUnit", "ModernPosWindowsPhone", "ModernPosAndroid", "ModernPosiOS", "PeripheralSimulator", "RealtimeServiceAX63")]
    [string]$PackageType = $(Throw 'PackageType is required!'),
    
    [ValidateSet("None", "ReplaceExistingByType", "ReplaceExistingByName")]
    [string]$PackageReplaceMode = "None",
    
    [string]$AssignToStores,
    
    [string]$AOSWebsiteName,
    
    [string]$LogFile = "UploadRetailSelfServicePackages.log"
)

$ErrorActionPreference = "Stop"

function GenerateAndSave-XmlForSetupUtility(
    [string]$PackageFilePath = $(Throw 'PackageFilePath is required!'),
    [string]$PackageFriendlyName,
    [string]$PackageDescription,
    [string]$PackageVersion = $(Throw 'PackageVersion is required!'),
    [string]$PackageType = $(Throw 'PackageType is required!'),
    [string]$PackageReplaceMode = $(Throw 'PackageReplaceMode is required!'),
    [string]$AssignToStores,
    [string]$LogFile = $(Throw 'LogFile is required!')
)
{
    $methodInputXmlString = 
    @'
<?xml version="1.0" encoding="UTF-8"?>
<RetailSelfServicePackageManager>
    <UploadDetails>
        <PackagePath>{0}</PackagePath>
        <PackageFriendlyName>{1}</PackageFriendlyName>
        <PackageDescription>{2}</PackageDescription>
        <PackageVersion>{3}</PackageVersion>
        <PackageType>{4}</PackageType>
        <PackageReplaceMode>{5}</PackageReplaceMode>
        <AssignToStores>{6}</AssignToStores>
    </UploadDetails>
</RetailSelfServicePackageManager>
'@  -f $PackageFilePath, $PackageFriendlyName, $PackageDescription, $PackageVersion, $PackageType, $PackageReplaceMode, $AssignToStores

    # Save above XML to Temp File and return temp file location
    $methodInputXmlFilePath = [System.IO.Path]::GetTempFileName()
    Set-Content -Value $methodInputXmlString -Path $methodInputXmlFilePath -Force
    
    Write-Log ('Saved method input xml to temp location: {0}' -f $methodInputXmlFilePath) -logFile $LogFile
    return $methodInputXmlFilePath
}

try
{
    $scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent

    Import-Module (Join-Path -Path $scriptDir -ChildPath 'SelfServiceConfiguration.psm1') -DisableNameChecking
    Import-Module WebAdministration

    # Set default value for Aos website if not provided or if empty string provided
    if (-not $AOSWebsiteName)
    {
	    $AOSWebsiteName  = Get-AOSWebsiteName
    }

    # Derive AOS web config file path.
    $AOSWebsitePhysicalPath = Get-WebsitePhysicalPath -webSiteName $AOSWebsiteName
    $AOSWebConfigFilePath   = Get-AOSWebConfigFilePath -AOSWebsitePhysicalPath $AOSWebsitePhysicalPath
    Write-Log -objectToLog ('AOS web.config located at:{0}{1}' -f [System.Environment]::NewLine, $AOSWebConfigFilePath) -logFile $LogFile
    
    # Get file path to AX deployment setup utility and its config file.
    $AXDeploymentSetupUtilityFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $AOSWebsitePhysicalPath -UtilityFileName 'Microsoft.Dynamics.AX.Deployment.Setup.exe'
    Write-Log -objectToLog ('Microsoft.Dynamics.AX.Deployment.Setup.exe located at:{0}{1}' -f [System.Environment]::NewLine, $AXDeploymentSetupUtilityFilePath) -logFile $LogFile
    
    $AXDeploymentUtilityConfigFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $AOSWebsitePhysicalPath -UtilityFileName 'Microsoft.Dynamics.AX.Deployment.Setup.exe.config'
    Write-Log -objectToLog ('Microsoft.Dynamics.AX.Deployment.Setup.exe.config located at:{0}{1}' -f [System.Environment]::NewLine, $AXDeploymentUtilityConfigFilePath) -logFile $LogFile
    
    # Perform AX deployment setup utility config file update with appropriate azure storage connection string from aos web.config
    Update-AXDeploymentUtilityConfigFile -AOSWebConfigFilePath $AOSWebConfigFilePath -AXDeploymentUtilityConfigFilePath $AXDeploymentUtilityConfigFilePath -logFile $LogFile

    # Get all the parameters from Aos web.config required to run AX deployment setup utility.
    $parametersFromAosWebConfig = Get-RequisiteParametersFromAosWebConfig -AOSWebConfigFilePath $AOSWebConfigFilePath

    # Generate XML to pass down to AX deployment setup utility.
    $methodInputXmlFilePath = GenerateAndSave-XmlForSetupUtility -PackageFilePath $PackageFilePath `
                                                                 -PackageFriendlyName $PackageFriendlyName `
                                                                 -PackageDescription $PackageDescription `
                                                                 -PackageVersion $PackageVersion `
                                                                 -PackageType $PackageType `
                                                                 -PackageReplaceMode $PackageReplaceMode `
                                                                 -AssignToStores $AssignToStores `
                                                                 -LogFile $LogFile

    # Call AX Deployment setup.
    Call-AXDeploymentSetupUtility -parametersFromAosWebConfig $parametersFromAosWebConfig `
								  -methodInputXmlFilePath $methodInputXmlFilePath `
								  -AXDeploymentSetupUtilityFilePath $AXDeploymentSetupUtilityFilePath `
								  -LogFile $LogFile

    Write-Log -objectToLog 'Script execution completed successfully' -logFile $LogFile
    exit 0
}
catch
{
    Write-Log ($global:error[0] | Format-List * -Force | Out-String -Width 4096) -logFile $logFile
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine
    $exitCode = 24744
    Write-Log ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine) -logFile $logFile
    exit $exitCode
}
# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCCDKi+5MvvnnHiG
# 1/myUVt18FBlL6k+Kpd1/KW7mCohUqCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCB1
# MKJeLmsLSVgse+jqWh0S6FF0TkgrhlZSh2K2j7bv2zCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBa
# D6lrkR4wNzwsHkaPt7MgvyAz8K3SVOXNqiUnbOcWHVBMOm3NiluNKvRyWJNLPJsX
# zrEjFTKdHWPAKrKwEO3xTfgDkcBnr43wBOOP+JBEbBVgbezR+63pFWueK9s7kKNM
# 3KDeZDyoAWawyF/hkMeTRg3mnBf0ffQUP02m882+h7XEL1y8+kT9jjr0NoiWTwDz
# 4a78PmaApXltu5Mec0TP/QJAt//5WK6EjHo0B6SQrOJ1ONQBZFvfhkcThRdxVC/7
# TL8PId4+AYgNlgkkQoE1dX9IamTRG+Y8Ei3WDMUfKo1C/iMT8BIf0g4szdHyp5Rg
# v8AnSHjvkHLs5x1LAH2GoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IAIPDY4MXH13a7IliHUYRujtWPJVuG3W0Lzz6zYhS0XTAgZfPVxFK84YEzIwMjAw
# ODIzMDQwMjQ4LjI0M1owBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
# VQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25z
# IExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkZDNDEtNEJENC1EMjIw
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOPDCCBPEw
# ggPZoAMCAQICEzMAAAESJHOjNYZpEw8AAAAAARIwDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTIxWhcNMjEw
# MTIxMjMxOTIxWjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
# BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UE
# CxMdVGhhbGVzIFRTUyBFU046RkM0MS00QkQ0LUQyMjAxJTAjBgNVBAMTHE1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQC7qpkVNy9QRHdwpRC0gj59zrmITeD+fM4UFZeWGrSdq2sSFiIVtqfr
# IHaDreibRBsw04V4wcmpgabdlF+8GBNg4RZ+aPIpK2k25QpMGYVJLFSSsbEOOBWS
# HIqQYfxxybS0Ltun3qGdBqJsfdhlfMq+L4E3aAlyxEwfk9qDZuHUV3y9EyUwfHLD
# hsEpZbCkpNIbjRvFsa7wJd6woZEBBd1pJe7myYmrKMlzeXhv0k3GwjvtvTl+0TCd
# TgjCpYpotp+BANqpUH2ScWZpWeue8FL7aIDditVueTGWXnUKvceE9PAvQiUJsqbK
# flXMpL5MIHtJST56axWt5apNwyP+rx4JAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
# 0jpwHwtMSWArKrTCMswGxnZlW10wHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8Uz
# aFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
# L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoG
# CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
# Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
# AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEA
# OREvr5Gv0gr1Y0WWJy7PoZC5lfdhA5vnnYv7/xAs2WuV/dUBF1EvE/2pz61Ey6Lp
# jTofrExP5ZKHCatVW0tNQREj4a+Rz2FnPv+gx+VRVl7WwPaZXdIiXwhmUKvcot5d
# caUVUQVxxgBzcnTLc/9nCE//E6oZw8QrMPCtrioq6EiIExeTkTubO7YsvTz3dmBd
# Dfc/gIFtfHp7TFajgS/fy2I6tdMratQCed05LJg5oSIWYvFs0xawxi6aoMN1FqnC
# 21xAIRAEmODN09V/0xrrpqkqIp8OU/3zuLQK+BRmbp8rSAP+2BOAHbRq00kaGobd
# 5qt30fFsPaqG6bwn2L1H4DCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZI
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
# Ex1UaGFsZXMgVFNTIEVTTjpGQzQxLTRCRDQtRDIyMDElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAEuAr1oQqvtDy
# nteleDjFzDMCiryggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
# MDANBgkqhkiG9w0BAQUFAAIFAOLrzykwIhgPMjAyMDA4MjMwMTA2NDlaGA8yMDIw
# MDgyNDAxMDY0OVowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA4uvPKQIBADAKAgEA
# AgIfMwIB/zAHAgEAAgIRjzAKAgUA4u0gqQIBADA2BgorBgEEAYRZCgQCMSgwJjAM
# BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEB
# BQUAA4GBACIxEtpHMLKGtGy4ayMjUAjZa08GK6mub5QVJAGkg7Pfwm7rrjTGiHyk
# HYw0ZYgKnHHoqvk8OfubQBuKehBG+gVAWu9o88UChwRPLmKgEyGYESQW+otQ2SQO
# 4YllGBqX2rnLDYWrM/67lkLxaOr7NlnUmeUH+xT60S4dF2Tu4qaLMYIDDTCCAwkC
# AQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
# A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAESJHOjNYZp
# Ew8AAAAAARIwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgIkTM64G+yjTD/PwLhUENtSTNx/GNn+hl
# 7kbIiIxvrNUwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCAkErCCv+giGoqp
# OcgpeGLYpPsnfskYMI+DETR1lzqWUzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABEiRzozWGaRMPAAAAAAESMCIEIIPsPJ1Ph3ucrhsx
# 6ysYf/NGbUI4EY8DaTxh143FJO9UMA0GCSqGSIb3DQEBCwUABIIBALLg3D7xXKAK
# lDl/vgWMiS83FDMBy+QKbBF5VPDmakONvg5TFW6FussX212e750mIB7SKsojTMDn
# 8fVgYr3JxX9tpGoZp6Z8is8nclUnV876aJ/WuVup/rVy5P3UX/HG0Z0xHCR9TyZI
# AsNkJCos4DbvIdZP2Mon0Y8pCWHdFreKbemBbT5+rLaX/t2lJvvX3yh9ntp3aJUM
# Zpv4U2iqwu1MvcK2yZgX7t/VnYBqsTRUNWlkQpJfZw3iBDaj0KAzsxpo1NSg0Tqp
# QlrCPgA8tIf4Y5x64c3YULAlD0A6sn61gOFSoQLL0Gy9sm3GrbwZpJ1eNmrTrWLH
# FPUkEVOPHhQ=
# SIG # End signature block
