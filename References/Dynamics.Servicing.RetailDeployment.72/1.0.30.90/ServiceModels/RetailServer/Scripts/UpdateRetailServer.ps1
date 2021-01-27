<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

<#
.SYNOPSIS
    Allows a user to update Retail Server deployment.

.DESCRIPTION
    This script provides a mechanism to update existing Retail Server deployment on a local system.

.PARAMETER RETAILSERVERWEBSITENAME
    The name of Retail Server website which is deployed on the local system.

.PARAMETER MINSUPPORTEDVERSION
    An optional parameter to specify the minimum supported build version for Retail Server service. If the current installed version is less than this then the script will not support update.

.EXAMPLE 
    # Update the existing Retail Server deployment with minimum supported version "7.0.0.0". 
    .\UpdateRetailServer.ps1 -MinSupportedVersion "7.0.0.0"
#>

param (
    $RetailServerWebSiteName = 'RetailServer',
    $AosWebsiteName = 'AOSService',
    $MinSupportedVersion
)

$ErrorActionPreference = 'Stop'

function LogConnectionString([string] $webConfigPath = $(throw 'webConfigPath is required'))
{ 
    Log-TimedMessage ('The path of web.config is {0}' -f $webConfigPath)
    $connectionString= Extract-ConnectionStringsFromWebConfig -webConfigPath $webConfigPath  
    if($connectionString -ne $null) 
    {
        if($connectionString.length -gt 300)
        {       
            Log-TimedMessage $connectionString.substring(0,300)
        }
        else
        {
            Log-TimedMessage $connectionString
        }
        $connectionStringHash = Generate-MD5-Hash -param $connectionString
        Log-TimedMessage ('MD5 hash of connection string is {0}' -f $connectionStringHash)        
    }
    else
    {
        Log-TimedMessage 'connection string is null'
    }
}

function Generate-MD5-Hash([string] $param = $(throw 'Parameter is required'))
{
    $md5  = new-object -TypeName System.Security.Cryptography.MD5CryptoServiceProvider
    $utf8 = new-object -TypeName System.Text.UTF8Encoding            
    $hash = [System.BitConverter]::ToString($md5.ComputeHash($utf8.GetBytes($param)))      
    return $hash
}

function Upgrade-RetailServer(
    [string] $webSiteName = $(throw 'webSiteName is required'),
    [string] $AosWebsiteName = $(throw 'AosWebsiteName is required'),
    [string] $webConfigPath = $(throw 'webConfigPath is required'),
    [string] $webSitePhysicalPath = $(throw 'webSitePhysicalPath is required'),
    [string] $scriptDir = $(throw 'scriptDir is required'),
    [ValidateNotNullOrEmpty()]
    [string] $installationInfoXmlPath = $(throw 'installationInfoXmlPath is required'))
{
    Log-TimedMessage 'Begin updating Retail Server deployment...'

    $webConfigFileName = 'web.config'
    try
    {
        LogConnectionString -webConfigPath $webConfigPath

        # Decrypt web.config connection strings section.
        Log-TimedMessage 'Decrypt connectionStrings section in web.config'
        $webSiteId = Get-WebSiteId -webSiteName $webSiteName    
        aspnet_regiis -pd "connectionStrings" -app "/" -Site $webSiteId

        $isMicrosoftPackage = Check-IfUpdatePackageIsReleasedByMicrosoft -installationInfoXml $installationInfoXmlPath

        # Get retail server url before update
        $retailServerUrl = Get-RetailServicerUrlFromWebConfig -retailWebsiteName $webSiteName
        Log-TimedMessage ('Found Retail Server URL - {0}' -f $retailServerUrl)
        
        # Create a temp working folder
        $tempWorkingFolder = Join-Path $env:temp ("{0}_Temp_{1}" -f $webSiteName, $(Get-Date -f yyyy-MM-dd_hh-mm-ss))

        # Get the service model Code folder from the update package
        # If Code folder does not exist or is empty, skip the remaining update process.
        Log-TimedMessage 'Getting the Code folder from the deployable update package.'
        $updatePackageCodeDir = (Join-Path (Split-Path (Split-Path (Split-Path $ScriptDir -Parent) -Parent) -Parent) 'Code')
        
        if(Check-IfAnyFilesExistInFolder -folderPath $updatePackageCodeDir)
        {
            Log-TimedMessage ('Found the Code folder from the deployable update package at - {0}.' -f $updatePackageCodeDir)
            $crtConfigFileName = 'commerceruntime.config'

            if($isMicrosoftPackage)
            {
                # Copy all the update files without ext folder to a temp location 
                Copy-Files -SourceDirPath $updatePackageCodeDir `
                           -DestinationDirPath $tempWorkingFolder `
                           -FilesToCopy '*' `
                           -RobocopyOptions '/S /njs /ndl /np /njh /XD ext'
            
                Log-TimedMessage  'Merge web.config with microsoft updates.'
                Merge-WebConfig -tempWorkingFolder $tempWorkingFolder -webConfigPath $webConfigPath
            
                # Migrate the Real-time Service thumbprint in commerceruntime config file
                Log-TimedMessage 'Updating Real-time Service settings in the commerce runtime config file.'
                Retain-RtsSettingsInCrtConfig -sourceCrtConfigFilePath (Join-Path (Join-Path $webSitePhysicalPath 'bin') $crtConfigFileName) `
                                                     -targetCrtConfigFilePath (Join-Path (Join-Path $tempWorkingFolder 'bin') $crtConfigFileName)
                Log-TimedMessage 'Finished updating Real-time Service settings in the commerce runtime config file.'
                
                # Read cert thumbprint before update
                Log-TimedMessage 'Retrieve Retail Server SSL certificate thumbprint from web.config file.'
                $certThumbprint = Get-RetailServerAuthCertThumbPrintFromWebConfig -webConfigPath $webConfigPath
                Log-TimedMessage ('Found Retail Server SSL certificate thumbprint - {0}' -f $certThumbprint)
            
                # Update the Retail Server authentication cert thumbprint, issuer and open-id configuration file.
                Update-RetailServerAuthenticationKeys -scriptDir $ScriptDir `
                                                  -retailServerDeploymentPath $tempWorkingFolder `
                                                  -retailServerAuthCertThumbprint $certThumbprint `
                                                  -retailServerUrl $retailServerUrl
            }
            else
            {
                # Copy all the update files to a temp location 
                Copy-Files -SourceDirPath $updatePackageCodeDir `
                           -DestinationDirPath $tempWorkingFolder `
                           -FilesToCopy '*' `
                           -RobocopyOptions '/S /njs /ndl /np /njh'
                           
                Log-TimedMessage  'Merge web.config with customization.'
                Merge-CustomizedWebConfig -tempWorkingFolder $tempWorkingFolder -webConfigPath $webConfigPath
            }

            # Encrypt web.config connection strings before taking a backup
            aspnet_regiis -pe "connectionStrings" -app "/" -Site $webSiteId

            # Replace website files from temp working directory to actual working directory
            Replace-WebsiteFiles -webSiteName $webSiteName -newWebFilesPath $tempWorkingFolder
        }
    }
    finally
    {
        # Encrypt back web.config connection strings section.
        Log-TimedMessage 'Encrypt connectionStrings section in web.config'
        aspnet_regiis -pe "connectionStrings" -app "/" -Site $webSiteId
        
        LogConnectionString -webConfigPath $webConfigPath

        # Remove the temp working folder
        if($tempWorkingFolder -and (Test-Path -Path $tempWorkingFolder))
        {
            Log-TimedMessage ('Removing temporary working directory {0}' -f $tempWorkingFolder)
            Remove-Item $tempWorkingFolder -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    Log-TimedMessage 'Finished updating Retail Server deployment...' 
}

function Update-RetailServerAuthenticationKeys(
    [string]$scriptDir = $(throw 'scriptDir is required'),
    [string]$retailServerDeploymentPath = $(throw 'retailServerDeploymentPath is required'),
    $retailServerAuthCertThumbprint = $(throw 'retailServerAuthCertThumbprint is required'),
    [string]$retailServerUrl = $(throw 'retailServerUrl is required'))
{
    $deploymentScriptsDir = (Split-Path (Split-Path $ScriptDir -Parent) -Parent)
    $updateRetailServerAuthenticationKeysScriptPath = Join-Path $deploymentScriptsDir 'UpdateRetailServerAuthenticationKeys.ps1'

    if(-not (Test-Path $updateRetailServerAuthenticationKeysScriptPath))
    {
        throw "Cannot find script $updateRetailServerAuthenticationKeysScriptPath."
    }
    
    Invoke-Script -scriptBlock `
    {
        & $updateRetailServerAuthenticationKeysScriptPath -RetailServerDeploymentPath $retailServerDeploymentPath `
                                                          -RetailServerUrl $retailServerUrl `
                                                          -CertificateThumbprint $retailServerAuthCertThumbprint
    }
}

function Get-RetailServerAuthCertThumbPrintFromWebConfig([string]$webConfigPath = $(throw 'webConfigPath is required'))
{
    [xml]$webConfigXml = Get-Content $webConfigPath
    $retailServerAuthCertThumbprint = $webConfigXml.configuration.retailServer.authentication.CertThumbprint

    if(-not $retailServerAuthCertThumbprint)
    {
        throw "Could not find Retail Server authentication thumbprint in web.config file at: $webConfigPath"
    }

    return $retailServerAuthCertThumbprint
}

function Get-RetailServicerUrlFromWebConfig([string]$retailWebsiteName = $(throw 'retailWebsiteName is required'))
{
    # The web.config does not contain the Retail server URL so it has to be created using the commerce token issuer.
    Log-TimedMessage 'Retrieve commerce token issuer from retail server website.'
    $retailServerRootUrl = Get-WebSiteBindingUrls -websiteName $retailWebsiteName | Select-Object -First 1

    if([String]::IsNullOrWhiteSpace($retailServerRootUrl))
    {
        throw "Could not find retailServerRootUrl from retail server website."
    }

    $retailServerUrl = "$retailServerRootUrl/commerce"

    return $retailServerUrl;
}

function Retain-CustomSettings(
    [ValidateNotNullOrEmpty()]
    [xml]$sourceConfigXml = $(throw 'sourceConfigXml is required'),

    [ValidateNotNullOrEmpty()]
    [xml]$targetConfigXml = $(throw 'targetConfigXml is required'))
{
    
    Log-ActionItem 'Check if Retail Server cryptography certificate thumbprint exists in the source web.config file'
    $sourceCryptographyCertThumbprint = $sourceConfigXml.configuration.retailServer.cryptography.certificateThumbprint
        
    if($sourceCryptographyCertThumbprint)
    {
        Log-ActionResult 'Yes. Retain this value in the target web.config'
        $targetConfigXml.configuration.retailServer.cryptography.certificateThumbprint = $sourceCryptographyCertThumbprint
    }
    else
    {
        Log-ActionResult 'No. Skip this step'
    }

    Log-ActionResult 'Finished retaining Retail Server cryptography certificate thumbprint in target web.config'
    
    Log-ActionItem 'Check if Retail Server device activation allowed identity providers exists in the source web.config file'
    $sourceDeviceActivation = $sourceConfigXml.configuration.retailServer.deviceActivation.allowedIdentityProviders
        
    if($sourceDeviceActivation)
    {
        Log-ActionResult 'Yes. Retain this value in the target web.config'
        $targetConfigXml.configuration.retailServer.deviceActivation.allowedIdentityProviders = $sourceDeviceActivation
    }
    else
    {
        Log-ActionResult 'No. Skip this step'
    }
    
    Log-ActionResult 'Finished retaining Retail Server device activation allowed identity providers in target web.config'
}

function Get-NonCustomizableAppSettings()
{
    $nonCustomizableAppSettings = @(
    'AADObjectIdClaimName',
    'AADTenantIdClaimName',
    'AADTokenIssuerPrefix',
    'AADRetailServicePrincipalName',
    'AllowedOrigins',
    'FederationMetadataAddress',
    'isConnectionStringOverridden',
    'RetailServerPackageMetadata',
    'serviceUri',
    'Microsoft.AzureKeyVault.Url',
    'Microsoft.AzureKeyVault.CertificateThumbprint',
    'Microsoft.AzureKeyVault.ClientId',
    'Microsoft.AzureKeyVault.RegistryKey',
    'IsAnonymousEnabled',
    'WebSiteName',
    'CommerceTokenIssuer',
    'DataAccess.disableDBServerCertificateValidation',
    'DataAccess.Database',
    'DataAccess.SqlPwd',
    'DataAccess.DbServer',
    'DataAccess.DataSigningCertificateThumbprint',
    'DataAccess.SqlUser',
    'DataAccess.AxAdminSqlUser',
    'CertificateHandler.HandlerType',
    'DataAccess.DataEncryptionCertificateThumbprint',
    'DataAccess.AxAdminSqlPwd',
    'DataAccess.encryption')
    
    return $nonCustomizableAppSettings 
}

function Merge-WebConfig(
    [string]$tempWorkingFolder = $(throw 'tempWorkingFolder is required'),
    [string]$webConfigPath = $(throw 'webConfigPath is required'))
{
    $tempWebConfigPath = Join-Path $tempWorkingFolder (Split-Path $webConfigPath -Leaf)

    # if the target web config file doesn't exist, meaning there is no customization for this file, return and skip the merge.
    if(-not (Test-Path -Path $tempWebConfigPath))
    {
        Log-TimedMessage "$tempWebConfigPath doesn't exist, skip merging and return."
        return
    }

    # Merge the connection strings
    Log-TimedMessage 'Merging connection strings section in web.config file.'
    $websiteConnectionStringSettings = Extract-ConnectionStringsFromWebConfig -webConfigPath $webConfigPath
    Update-WebsiteConnectionStringSettings -webConfigPath $tempWebConfigPath -connectionStringsXml $websiteConnectionStringSettings
    Log-TimedMessage 'Finished merging connection strings section in web.config file.'       

    # Merge the app settings
    Log-TimedMessage 'Merging app settings section in web.config file.'
       
    [array]$nonCustomizableAppSettings = Get-NonCustomizableAppSettings
    Merge-WebConfigAppSettings -sourceWebConfigFilePath $webConfigPath `
                                -targetWebConfigFilePath $tempWebConfigPath `
                                -nonCustomizableAppSettings $nonCustomizableAppSettings

    Log-TimedMessage 'Finished merging app settings section in web.config file.'
    
    [xml]$sourceWebConfigDoc = Get-Content $webConfigPath
    [xml]$targetWebConfigDoc = Get-Content $tempWebConfigPath
     
    # Merge the environment key
    Merge-XmlNode -sourceConfigXml $sourceWebConfigDoc -targetConfigXml $targetWebConfigDoc -targetXPath '//configuration' -targetNodeName 'environment'

    # Merge the machine key
    Merge-XmlNode -sourceConfigXml $sourceWebConfigDoc -targetConfigXml $targetWebConfigDoc -targetXPath '//configuration/system.web' -targetNodeName 'machineKey'

    # Retain the Retail Server cryptography certificate thumbprint
    Retain-CustomSettings -sourceConfigXml $sourceWebConfigDoc -targetConfigXml $targetWebConfigDoc
    
    # Merge extensionComposition from web.config to tempWebConfigPath
    Merge-XmlNode -sourceConfigXml $sourceWebConfigDoc -targetConfigXml $targetWebConfigDoc -targetXPath '//configuration/retailServer' -targetNodeName 'extensionComposition'
    
    Set-ItemProperty $tempWebConfigPath -name IsReadOnly -value $false
    $targetWebConfigDoc.Save($tempWebConfigPath)
}

function Retain-RtsSettingsInCrtConfig(
    [ValidateNotNullOrEmpty()]
    [string]$sourceCrtConfigFilePath = $(throw 'sourceCrtConfigFilePath is required'),

    [ValidateNotNullOrEmpty()]
    [string]$targetCrtConfigFilePath = $(throw 'targetCrtConfigFilePath is required'))
{
    # if the target crt config file doesn't exist, meaning there is no customization for this file, return and skip the merge.
    if(-not (Test-Path -Path $targetCrtConfigFilePath))
    {
        Log-TimedMessage "$targetCrtConfigFilePath doesn't exist, skip merging and return."
        return
    }

    [xml]$sourceWebConfigFilePathDoc = Get-Content $sourceCrtConfigFilePath
    [xml]$targetCrtConfigFilePathDoc = Get-Content $targetCrtConfigFilePath
    
    Merge-XmlNode -sourceConfigXml $sourceWebConfigFilePathDoc -targetConfigXml $targetCrtConfigFilePathDoc -targetXPath '//commerceRuntime'  -targetNodeName 'realtimeService' -createIfNotExists $false
    Set-ItemProperty $targetCrtConfigFilePath -name IsReadOnly -value $false
    $targetCrtConfigFilePathDoc.Save($targetCrtConfigFilePath)
}

function Merge-CustomizedWebConfig(
    [string]$tempWorkingFolder = $(throw 'tempWorkingFolder is required'),
    [string]$webConfigPath = $(throw 'webConfigPath is required'))
{
    $tempWebConfigPath = Join-Path $tempWorkingFolder (Split-Path $webConfigPath -Leaf)
    $tempWebConfigPathStaging = Join-Path $tempWorkingFolder 'web.config.staging'

    # Merge the app settings
    Log-TimedMessage 'Merging customized app settings section in web.config file.'
    
    Copy-Item $tempWebConfigPath $tempWebConfigPathStaging
    Copy-Item $webConfigPath $tempWebConfigPath
    
    [array]$nonCustomizableAppSettings = Get-NonCustomizableAppSettings
    Merge-WebConfigAppSettings -sourceWebConfigFilePath $tempWebConfigPathStaging `
                                -targetWebConfigFilePath $tempWebConfigPath `
                                -nonCustomizableAppSettings $nonCustomizableAppSettings `
                                -isMicrosoftPackage $false
    
    [xml]$sourceWebConfigDoc = Get-Content $tempWebConfigPathStaging
    [xml]$targetWebConfigDoc = Get-Content $tempWebConfigPath

    Log-TimedMessage 'Finished merging app settings section in web.config file.'
    
    # Merge extensionComposition from staging file to tempWebConfigPath
    Merge-XmlNode -sourceConfigXml $sourceWebConfigDoc -targetConfigXml $targetWebConfigDoc -targetXPath '//configuration/retailServer'  -targetNodeName 'extensionComposition'
    
    Set-ItemProperty $tempWebConfigPath -name IsReadOnly -value $false
    $targetWebConfigDoc.Save($tempWebConfigPath)
    
    Remove-Item $tempWebConfigPathStaging -Force
}

function Merge-XmlNode(
    [xml]$sourceConfigXml = $(throw 'sourceConfigXml is required'),
    [xml]$targetConfigXml = $(throw 'targetConfigXml is required'),
    [string]$targetXPath = $(throw 'targetXPath is required'),
    [string]$targetNodeName = $(throw 'targetNodeName is required'),
    [bool]$createIfNotExists = $true)
{
    $childXPath = $targetXPath + '/' + $targetNodeName
    $sourceNode = $sourceConfigXml.SelectSingleNode($childXPath)
    $targetNode = $targetConfigXml.SelectSingleNode($childXPath)
    $parentNode = $targetConfigXml.SelectSingleNode($targetXPath)

    $importedNode = $targetConfigXml.ImportNode($sourceNode, $true)

    if(!$targetNode -and $createIfNotExists)
    {
        $parentNode.AppendChild($importedNode) >$null
    }
    else
    {
        $parentNode.ReplaceChild($importedNode, $targetNode) >$null
    }
}

try
{    
    $ScriptDir = Split-Path -parent $MyInvocation.MyCommand.Path
    . (Join-Path $ScriptDir 'Common-Configuration.ps1')
    . (Join-Path $ScriptDir 'Common-Web.ps1')
    . (Join-Path $ScriptDir 'Common-Database.ps1')
    . (Join-Path $ScriptDir 'Common-Upgrade.ps1')

    # Get website physical path.
    Log-TimedMessage ('Getting website physical path for website - {0}' -f $RetailServerWebSiteName)
    $webSitePhysicalPath = Get-WebSitePhysicalPath -webSiteName $RetailServerWebSiteName
    Log-TimedMessage ('Found website physical path - {0}' -f $webSitePhysicalPath)
    
    # Get web.config path.
    Log-TimedMessage 'Getting web.config path.'
    $webConfigPath = Join-Path $webSitePhysicalPath 'web.config'
    Log-TimedMessage ('Found web.config path - {0}' -f $webConfigPath)

    # Get the installation info manifest file.
    Log-TimedMessage 'Getting installation info XML path.'
    $installationInfoFile = Get-InstallationInfoFilePath -scriptDir $ScriptDir
    Log-TimedMessage ('Found installation info XML path - {0}' -f $installationInfoFile)

    # Get the update package root folder
    Log-TimedMessage 'Getting the update package root folder from the deployable update package.'
    $updatePackageRootDir = (Split-Path (Split-Path (Split-Path (Split-Path $ScriptDir -Parent) -Parent) -Parent) -Parent)
    $scriptsPath = Join-Path $updatePackageRootDir 'RetailServer\Scripts'
    Log-TimedMessage ('Found update package root directory - {0}' -f $updatePackageRootDir)
    
    # Upgrade Retail Server
    Upgrade-RetailServer -webSiteName $retailServerWebSiteName `
                         -AosWebsiteName $AosWebsiteName `
                         -scriptDir $scriptDir `
                         -webConfigPath $webConfigPath `
                         -webSitePhysicalPath $webSitePhysicalPath `
                         -isPackageDelta $isPackageDelta `
                         -installationInfoXmlPath $installationInfoFile

    # Register perf counters
    $registerPerfCounterScriptPath = Join-Path $scriptsPath 'Register-PerfCounters.ps1'
    $diagDllPath = Join-Path $updatePackageRootDir 'RetailServer\ETWManifest\Microsoft.Dynamics.Retail.Diagnostics.dll'
    if(Test-Path -Path $diagDllPath)
    {
        Log-TimedMessage 'Registering performance counters.'
        Invoke-Script -scriptBlock { & $registerPerfCounterScriptPath -InstrumentedAssemblyPath $diagDllPath }
        Log-TimedMessage 'Finished registering performance counters.'
    }
}
catch
{
    Log-Error ($global:error[0] | format-list * -f | Out-String)
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine
    $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: {0} Value: {1}{2}" -f $_.ToString(), $PSBoundParameters[$_.ToString()], [System.Environment]::NewLine}
    Write-Host ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine)
    throw ($global:error[0] | format-list * -f | Out-String)
}
# SIG # Begin signature block
# MIIkDwYJKoZIhvcNAQcCoIIkADCCI/wCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBz5/tvIkcxf0IL
# 2hgXAGTrUP/Flv/Ukau8k8KYwhagSKCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# cVZOSEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFeAwghXcAgEBMIGVMH4x
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01p
# Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAAGIr1LWuZJt6PkAAAAA
# AYgwDQYJYIZIAWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEE
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCCQ
# 8gUKv5rkowPR8q2inPNXU7IoJpTnZIu4zTCwwFkwmjCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBd
# pm32v9W7E0oz6rqy+QQXaybUjQ0Cs2u+gZyLegMbkbHBbd9MMhnejENe/EtJDFqh
# Uk+puKbD/pNYOCyMSsHFisyNvowZio+zPoSPDC89XuNSdyfPEebBtU56jW+AirNY
# LHTiNiFJCyNP19mhXZQIJ1cyHJHw1odo1C9H9wr84EnSwZZn0E9PZkAMTvji1JQu
# NAg46F+c+IGLTMyxPu1iYt7fh9m0AlCR7I7QEdNTcy/6QBZYmKVVkwBC71UyCbk+
# ufLPkG0oky2vNx/PH7cjA+MhE5giKgCAo/Ajuwk4e5ZqUuTgHoQncny4dED4wvvm
# lfmzrbNokRTALpiqRRFgoYIS8DCCEuwGCisGAQQBgjcDAwExghLcMIIS2AYJKoZI
# hvcNAQcCoIISyTCCEsUCAQMxDzANBglghkgBZQMEAgEFADCCAVQGCyqGSIb3DQEJ
# EAEEoIIBQwSCAT8wggE7AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IEWeZYrRglPtceNRmAh90QVwO9QSRWKYnBZvaf91WT3NAgZfO+TbzjkYEjIwMjAw
# ODIzMDQwMjUxLjYyWjAEgAIB9KCB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNV
# BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
# c29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMg
# UHVlcnRvIFJpY28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkY3QTYtRTI1MS0x
# NTBBMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIORDCC
# BPUwggPdoAMCAQICEzMAAAEli96LbHImMd0AAAAAASUwDQYJKoZIhvcNAQELBQAw
# fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1Jl
# ZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMd
# TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMjE5MDExNDU4WhcN
# MjEwMzE3MDExNDU4WjCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
# b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
# dGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28x
# JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkY3QTYtRTI1MS0xNTBBMSUwIwYDVQQD
# ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEF
# AAOCAQ8AMIIBCgKCAQEA0HsfY3ZgW+zhycEmJjFKK2TcAHL/Fct+k5Sbs3Fcexvp
# Rards41jjJUjjJJtV6ALifFWeUoQXnQA1wxgysRzWYS7txFvMeaLfyDpOosy05QB
# bbyFzoM17Px2jjO9lxyspDGRwHS/36WbQEjOT2pZrF1+DpfJV5JvY0eeSuegu6vf
# oQ1PtrYxh2hNWVpWm5TVFwYWmYLQiQnetFMmb4CO/7jc3Gn49P1cNm2orfZwwFXd
# uMrf1wmZx2N8l+2bB4yLh6bJfj6Q12otQ8HvadK8gmbJfUjjB3sbSB3vapU27VmC
# fFrVi6B/XRDEMVS55jzwzlZgY+y2YUo4t/DfVac/xQIDAQABo4IBGzCCARcwHQYD
# VR0OBBYEFPOqyuUHJvkBOTQVxgjyIggXQyT4MB8GA1UdIwQYMBaAFNVjOlyKMZDz
# Q3t8RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9z
# b2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAx
# LmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWlj
# cm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3J0
# MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQEL
# BQADggEBAJMcWTxhICIAIbKmTU2ZOfFdb0IieY2tsR5eU6hgOh8I+UoqC4NxUi4k
# 5hlfgbRZaWFLZJ3geI62bLjaTLX20zHRu6f8QMiFbcL15016ipQg9U/S3K/eKVXn
# cxxicy9U2DUMmSQaLgn85IJM3HDrhTn3lj35zE4iOVAVuTnZqMhz0Fg0hh6G6FtX
# Uyql3ibblQ02Gx0yrOM43wgTBY5spUbudmaYs/vTAXkY+IgHqLtBf98byM3qaCCo
# FFgmfZplYlhJFcArUxm1fHiu9ynhBNLXzFP2GNlJqBj3PGMG7qwxH3pXoC1vmB5H
# 63BgBpX7QpqrTnTi3oIS6BtFG8fwe7EwggZxMIIEWaADAgECAgphCYEqAAAAAAAC
# MA0GCSqGSIb3DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
# Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
# cmF0aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRo
# b3JpdHkgMjAxMDAeFw0xMDA3MDEyMTM2NTVaFw0yNTA3MDEyMTQ2NTVaMHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
# MIIBCgKCAQEAqR0NvHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvtfGhLLF/Fw+Vh
# wna3PmYrW/AVUycEMR9BGxqVHc4JE458YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs
# 1nMwVyaCo0UN0Or1R4HNvyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLBxKZd0WET
# bijGGvmGgLvfYfxGwScdJGcSchohiq9LZIlQYrFd/XcfPfBXday9ikJNQFHRD5wG
# Pmd/9WbAA5ZEfu/QS/1u5ZrKsajyeioKMfDaTgaRtogINeh4HLDpmc085y9Euqf0
# 3GS9pAHBIAmTeM38vMDJRF1eFpwBBU8iTQIDAQABo4IB5jCCAeIwEAYJKwYBBAGC
# NxUBBAMCAQAwHQYDVR0OBBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQB
# gjcUAgQMHgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/
# MB8GA1UdIwQYMBaAFNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJ
# oEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01p
# Y1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYB
# BQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljUm9v
# Q2VyQXV0XzIwMTAtMDYtMjMuY3J0MIGgBgNVHSABAf8EgZUwgZIwgY8GCSsGAQQB
# gjcuAzCBgTA9BggrBgEFBQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL1BL
# SS9kb2NzL0NQUy9kZWZhdWx0Lmh0bTBABggrBgEFBQcCAjA0HjIgHQBMAGUAZwBh
# AGwAXwBQAG8AbABpAGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkqhkiG
# 9w0BAQsFAAOCAgEAB+aIUQ3ixuCYP4FxAz2do6Ehb7Prpsz1Mb7PBeKp/vpXbRkw
# s8LFZslq3/Xn8Hi9x6ieJeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/
# XPleFzWYJFZLdO9CEMivv3/Gf/I3fVo/HPKZeUqRUgCvOA8X9S95gWXZqbVr5MfO
# 9sp6AG9LMEQkIjzP7QOllo9ZKby2/QThcJ8ySif9Va8v/rbljjO7Yl+a21dA6fHO
# mWaQjP9qYn/dxUoLkSbiOewZSnFjnXshbcOco6I8+n99lmqQeKZt0uGc+R38ONiU
# 9MalCpaGpL2eGq4EQoO4tYCbIjggtSXlZOz39L9+Y1klD3ouOVd2onGqBooPiRa6
# YacRy5rYDkeagMXQzafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA3+cxB6STOvdl
# R3jo+KhIq/fecn5ha293qYHLpwmsObvsxsvYgrRyzR30uIUBHoD7G4kqVDmyW9rI
# DVWZeodzOwjmmC3qjeAzLhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8ZQU3ghvkq
# mqMRZjDTu3QyS99je/WZii8bxyGvWbWu3EQ8l1Bx16HSxVXjad5XwdHeMMD9zOZN
# +w2/XU/pnR4ZOC+8z1gFLu8NoFA12u8JJxzVs341Hgi62jbb01+P3nSISRKhggLS
# MIICOwIBATCB/KGB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJp
# Y28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkY3QTYtRTI1MS0xNTBBMSUwIwYD
# VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoD
# FQBF0y/hUG3NhvtzF17yESla9qFwp6CBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwMA0GCSqGSIb3DQEBBQUAAgUA4uxR+jAiGA8yMDIwMDgyMzA2
# MjQ1OFoYDzIwMjAwODI0MDYyNDU4WjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi
# 7FH6AgEAMAoCAQACAhz5AgH/MAcCAQACAhGaMAoCBQDi7aN6AgEAMDYGCisGAQQB
# hFkKBAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAw
# DQYJKoZIhvcNAQEFBQADgYEAlPBVSFtvb1MzgQng4F75vOou9Ph8mZSD9ZxFuon7
# l7gJNbTYGKf4HHGk+MbZZHb2AS67vdSfKOKNsg2wBl438y/3O5nx1DIWRLXGIAxD
# HDC+xIqwAq5U4qnGOjoIr7jQgnfTaWlPrp/MLZAKNvITPKXGi8peObwvXQabSGej
# S0cxggMNMIIDCQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
# Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
# cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAIT
# MwAAASWL3otsciYx3QAAAAABJTANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcN
# AQkDMQ0GCyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCAeUwdp7ddRX0B65Tla
# Cb3pWT7rJIudx7ZA1D6j9W+AsDCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0E
# IF3fxrIubzBf+ol9gg4flX5i+Ub6mhZBcJboso3vQfcOMIGYMIGApH4wfDELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEli96LbHImMd0AAAAAASUwIgQg
# XIwCe/59RyOZZIAarasvJyuldVtYIxgQmQusA5j9WcswDQYJKoZIhvcNAQELBQAE
# ggEAMZCYKYTEKJUNQEwka85F45WCStEGkW6+2NWlpiyVy47DYYyUfKxdXBtZM8eW
# X2BHS9SuHoycoZsE1/bEDY7039Za4bCyuqJUNmLFnFtocGxDvm8Hbk0v1EERb20M
# Hzdp1YgPgHTC8ZTc9o1BuR1y3qsHDuUbQQhKN1EJdrzmq8gKAhcv+GlAGPO63VPh
# /cVu6TwXfejKhkD1vC0vMMujO6Y2Yj5ziCBg3HHsz3AkV4hwAFhcAKB9oY/3elOK
# jdBA8eN4NCJXVXPvZ7jAixPYBiRYDhtWZ8M3ML6WyZJI+Bd9cYKaODRTKOixOiGo
# fU+a4acKlOQ9HcYQ0PfjELojuA==
# SIG # End signature block
