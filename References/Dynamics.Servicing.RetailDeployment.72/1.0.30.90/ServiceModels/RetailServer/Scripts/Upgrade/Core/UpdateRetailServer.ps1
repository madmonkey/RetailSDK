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
    $updateRetailServerAuthenticationKeysScriptPath = Join-Path $ScriptDir 'UpdateRetailServerAuthenticationKeys.ps1'

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
# MIIkAAYJKoZIhvcNAQcCoIIj8TCCI+0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAdXO6KIIOEI0eS
# 9uOlYkJ4IsAWZdZbpt1ZQB3rd+wH4KCCDYEwggX/MIID56ADAgECAhMzAAABh3IX
# chVZQMcJAAAAAAGHMA0GCSqGSIb3DQEBCwUAMH4xCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25p
# bmcgUENBIDIwMTEwHhcNMjAwMzA0MTgzOTQ3WhcNMjEwMzAzMTgzOTQ3WjB0MQsw
# CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
# ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMR4wHAYDVQQDExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
# AQDOt8kLc7P3T7MKIhouYHewMFmnq8Ayu7FOhZCQabVwBp2VS4WyB2Qe4TQBT8aB
# znANDEPjHKNdPT8Xz5cNali6XHefS8i/WXtF0vSsP8NEv6mBHuA2p1fw2wB/F0dH
# sJ3GfZ5c0sPJjklsiYqPw59xJ54kM91IOgiO2OUzjNAljPibjCWfH7UzQ1TPHc4d
# weils8GEIrbBRb7IWwiObL12jWT4Yh71NQgvJ9Fn6+UhD9x2uk3dLj84vwt1NuFQ
# itKJxIV0fVsRNR3abQVOLqpDugbr0SzNL6o8xzOHL5OXiGGwg6ekiXA1/2XXY7yV
# Fc39tledDtZjSjNbex1zzwSXAgMBAAGjggF+MIIBejAfBgNVHSUEGDAWBgorBgEE
# AYI3TAgBBggrBgEFBQcDAzAdBgNVHQ4EFgQUhov4ZyO96axkJdMjpzu2zVXOJcsw
# UAYDVR0RBEkwR6RFMEMxKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1
# ZXJ0byBSaWNvMRYwFAYDVQQFEw0yMzAwMTIrNDU4Mzg1MB8GA1UdIwQYMBaAFEhu
# ZOVQBdOCqhc3NyK1bajKdQKVMFQGA1UdHwRNMEswSaBHoEWGQ2h0dHA6Ly93d3cu
# bWljcm9zb2Z0LmNvbS9wa2lvcHMvY3JsL01pY0NvZFNpZ1BDQTIwMTFfMjAxMS0w
# Ny0wOC5jcmwwYQYIKwYBBQUHAQEEVTBTMFEGCCsGAQUFBzAChkVodHRwOi8vd3d3
# Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NlcnRzL01pY0NvZFNpZ1BDQTIwMTFfMjAx
# MS0wNy0wOC5jcnQwDAYDVR0TAQH/BAIwADANBgkqhkiG9w0BAQsFAAOCAgEAixmy
# S6E6vprWD9KFNIB9G5zyMuIjZAOuUJ1EK/Vlg6Fb3ZHXjjUwATKIcXbFuFC6Wr4K
# NrU4DY/sBVqmab5AC/je3bpUpjtxpEyqUqtPc30wEg/rO9vmKmqKoLPT37svc2NV
# BmGNl+85qO4fV/w7Cx7J0Bbqk19KcRNdjt6eKoTnTPHBHlVHQIHZpMxacbFOAkJr
# qAVkYZdz7ikNXTxV+GRb36tC4ByMNxE2DF7vFdvaiZP0CVZ5ByJ2gAhXMdK9+usx
# zVk913qKde1OAuWdv+rndqkAIm8fUlRnr4saSCg7cIbUwCCf116wUJ7EuJDg0vHe
# yhnCeHnBbyH3RZkHEi2ofmfgnFISJZDdMAeVZGVOh20Jp50XBzqokpPzeZ6zc1/g
# yILNyiVgE+RPkjnUQshd1f1PMgn3tns2Cz7bJiVUaqEO3n9qRFgy5JuLae6UweGf
# AeOo3dgLZxikKzYs3hDMaEtJq8IP71cX7QXe6lnMmXU/Hdfz2p897Zd+kU+vZvKI
# 3cwLfuVQgK2RZ2z+Kc3K3dRPz2rXycK5XCuRZmvGab/WbrZiC7wJQapgBodltMI5
# GMdFrBg9IeF7/rP4EqVQXeKtevTlZXjpuNhhjuR+2DMt/dWufjXpiW91bo3aH6Ea
# jOALXmoxgltCp1K7hrS6gmsvj94cLRf50QQ4U8Qwggd6MIIFYqADAgECAgphDpDS
# AAAAAAADMA0GCSqGSIb3DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMK
# V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
# IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0
# ZSBBdXRob3JpdHkgMjAxMTAeFw0xMTA3MDgyMDU5MDlaFw0yNjA3MDgyMTA5MDla
# MH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
# ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMT
# H01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTEwggIiMA0GCSqGSIb3DQEB
# AQUAA4ICDwAwggIKAoICAQCr8PpyEBwurdhuqoIQTTS68rZYIZ9CGypr6VpQqrgG
# OBoESbp/wwwe3TdrxhLYC/A4wpkGsMg51QEUMULTiQ15ZId+lGAkbK+eSZzpaF7S
# 35tTsgosw6/ZqSuuegmv15ZZymAaBelmdugyUiYSL+erCFDPs0S3XdjELgN1q2jz
# y23zOlyhFvRGuuA4ZKxuZDV4pqBjDy3TQJP4494HDdVceaVJKecNvqATd76UPe/7
# 4ytaEB9NViiienLgEjq3SV7Y7e1DkYPZe7J7hhvZPrGMXeiJT4Qa8qEvWeSQOy2u
# M1jFtz7+MtOzAz2xsq+SOH7SnYAs9U5WkSE1JcM5bmR/U7qcD60ZI4TL9LoDho33
# X/DQUr+MlIe8wCF0JV8YKLbMJyg4JZg5SjbPfLGSrhwjp6lm7GEfauEoSZ1fiOIl
# XdMhSz5SxLVXPyQD8NF6Wy/VI+NwXQ9RRnez+ADhvKwCgl/bwBWzvRvUVUvnOaEP
# 6SNJvBi4RHxF5MHDcnrgcuck379GmcXvwhxX24ON7E1JMKerjt/sW5+v/N2wZuLB
# l4F77dbtS+dJKacTKKanfWeA5opieF+yL4TXV5xcv3coKPHtbcMojyyPQDdPweGF
# RInECUzF1KVDL3SV9274eCBYLBNdYJWaPk8zhNqwiBfenk70lrC8RqBsmNLg1oiM
# CwIDAQABo4IB7TCCAekwEAYJKwYBBAGCNxUBBAMCAQAwHQYDVR0OBBYEFEhuZOVQ
# BdOCqhc3NyK1bajKdQKVMBkGCSsGAQQBgjcUAgQMHgoAUwB1AGIAQwBBMAsGA1Ud
# DwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8GA1UdIwQYMBaAFHItOgIxkEO5FAVO
# 4eqnxzHRI4k0MFoGA1UdHwRTMFEwT6BNoEuGSWh0dHA6Ly9jcmwubWljcm9zb2Z0
# LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jvb0NlckF1dDIwMTFfMjAxMV8wM18y
# Mi5jcmwwXgYIKwYBBQUHAQEEUjBQME4GCCsGAQUFBzAChkJodHRwOi8vd3d3Lm1p
# Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0NlckF1dDIwMTFfMjAxMV8wM18y
# Mi5jcnQwgZ8GA1UdIASBlzCBlDCBkQYJKwYBBAGCNy4DMIGDMD8GCCsGAQUFBwIB
# FjNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2RvY3MvcHJpbWFyeWNw
# cy5odG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AcABvAGwAaQBjAHkA
# XwBzAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZIhvcNAQELBQADggIBAGfyhqWY
# 4FR5Gi7T2HRnIpsLlhHhY5KZQpZ90nkMkMFlXy4sPvjDctFtg/6+P+gKyju/R6mj
# 82nbY78iNaWXXWWEkH2LRlBV2AySfNIaSxzzPEKLUtCw/WvjPgcuKZvmPRul1LUd
# d5Q54ulkyUQ9eHoj8xN9ppB0g430yyYCRirCihC7pKkFDJvtaPpoLpWgKj8qa1hJ
# Yx8JaW5amJbkg/TAj/NGK978O9C9Ne9uJa7lryft0N3zDq+ZKJeYTQ49C/IIidYf
# wzIY4vDFLc5bnrRJOQrGCsLGra7lstnbFYhRRVg4MnEnGn+x9Cf43iw6IGmYslmJ
# aG5vp7d0w0AFBqYBKig+gj8TTWYLwLNN9eGPfxxvFX1Fp3blQCplo8NdUmKGwx1j
# NpeG39rz+PIWoZon4c2ll9DuXWNB41sHnIc+BncG0QaxdR8UvmFhtfDcxhsEvt9B
# xw4o7t5lL+yX9qFcltgA1qFGvVnzl6UJS0gQmYAf0AApxbGbpT9Fdx41xtKiop96
# eiL6SJUfq/tHI4D1nvi/a7dLl+LrdXga7Oo3mXkYS//WsyNodeav+vyL6wuA6mk7
# r/ww7QRMjt/fdW1jkT3RnVZOT7+AVyKheBEyIXrvQQqxP/uozKRdwaGIm1dxVk5I
# RcBCyZt2WwqASGv9eZ/BvW1taslScxMNelDNMYIV1TCCFdECAQEwgZUwfjELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9z
# b2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAxMQITMwAAAYdyF3IVWUDHCQAAAAABhzAN
# BglghkgBZQMEAgEFAKCCAScwGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYK
# KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIL0ai0S4
# MxwqUjV3lPLnpWIhKH+sVWOuRusHYM5d+vrGMIG6BgorBgEEAYI3AgEMMYGrMIGo
# oIGJgIGGAFMAaQBtAHAAbABpAGYAeQBDAG8AbQBtAGUAcgBjAGUALgBNAGkAYwBy
# AG8AcwBvAGYAdABEAHkAbgBhAG0AaQBjAHMALgBDAG8AbgBuAGUAYwB0AG8AcgAu
# AFAAbwByAHQAYQBiAGwAZQAuAHIAZQBzAG8AdQByAGMAZQBzAC4AZABsAGyhGoAY
# aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAADaOE4/
# P3tXtapinb3tgC8TW5IfJ8WxD9XzEY8MSWz+4xEewVl1U1qLyBkC87CfizgcR3G4
# zI33B0vn7d+kr8fuFsOKYiHhdcShTP5lJF7N2nwIlFq7xxahgUC8ny/1A0+4xVqG
# AG7rlIOP3hOijmQfD5B6iZqUnX6xg5a7iUEzYXBkhzRnl0GkFpSvEW7EEcdtcwEy
# 2ODaGKchpX2v+Oca6hSSBVzTK8MRnpOKHiGo5O+SGVeqqwCfxoA74/e9DoPDqndg
# 9HAYpJqwaeo6iqrGHc3DeLTq7Xw5wO8ppXx50v5q4LoJl8tGATGsQHXqh2s5+cpo
# CiR9dzN880mapaehghLlMIIS4QYKKwYBBAGCNwMDATGCEtEwghLNBgkqhkiG9w0B
# BwKgghK+MIISugIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBUQYLKoZIhvcNAQkQAQSg
# ggFABIIBPDCCATgCAQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQguMvZ
# n56/TYUF74wM7XkGVp51zJY3mqP1WzsT/xy36/0CBl86qc71WhgTMjAyMDA4MjMw
# NDAyNDcuNzI3WjAEgAIB9KCB0KSBzTCByjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
# Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
# dCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3BlcmF0
# aW9uczEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046RDZCRC1FM0U3LTE2ODUxJTAj
# BgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wggg48MIIE8TCCA9mg
# AwIBAgITMwAAAR4OvOVLFqIDGwAAAAABHjANBgkqhkiG9w0BAQsFADB8MQswCQYD
# VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
# MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
# ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTExMTMyMTQwNDBaFw0yMTAyMTEy
# MTQwNDBaMIHKMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
# A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSUw
# IwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25zMSYwJAYDVQQLEx1U
# aGFsZXMgVFNTIEVTTjpENkJELUUzRTctMTY4NTElMCMGA1UEAxMcTWljcm9zb2Z0
# IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
# ggEBAM4TtxgQovz18FyurO38G3WqlV+etLFjCViCzevcL+0aVl4USidzKo5r5FFg
# ZB9b6ncAkfAJxYf6xmQ42HDmtpju+cK2O24q3xu+o1DRp7DFd3261HnBZVRfnEoR
# 7PAIh9eenBq+LFH4Z3pArL3U1y8TwVdBU91WEOvcUyLM6qSpyHIdiuPgz0uC3FuS
# IPJxrGxq/dfrxO21zCkFwwKfahsVJmMJpRXMdsavoR+gvTdN5pvHRZmsR7bHtBPR
# mRhAEJiYlLVRdBIBVWOpvXCcxevv7Ufx8cut3X920zYOxH8NfCfASjP1nVSmt5+W
# mHd3VXYhtX3Mo559eCn8gHZpFLsCAwEAAaOCARswggEXMB0GA1UdDgQWBBSMEyjn
# kXhG4Ev7fps/2a8n2maKWzAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNoWoVt
# VTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtp
# L2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYIKwYB
# BQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
# cGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNydDAMBgNVHRMBAf8E
# AjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IBAQAuZNyO
# dZYjkIITIlQNJeh2NIc83bDeiIBFIO+DmMjbsfaGPuv0L7/54xTmR+TMj2ZMn/eb
# W5pTJoa9Y75oZd8XqFO/KEYBCjahyXC5Bxw+pWqT70BGsg+m0IdGYaFADJYQm6NW
# C1atY38q0oscfoZYgGR4THJIkXZpN+7uPr1yA/PkMNK+XdSaCFQGXW5NdSH/Qx5C
# ySF3B8ngEpRos7aoABeaVAfja1FVqxrSo1gx0+bvEXVhBWWvUQGe+b2VQdNpvQ2p
# UX4S7qRufctSzSiAeBaYECaRCNY5rK1ovLAwiEd3Bg7KntLBolQfHr1w/Vc2s52i
# ScaFReh04dJdfiFtMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAAAjANBgkqhkiG9w0B
# AQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAG
# A1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIwMTAw
# HhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAxMjE0NjU1WjB8MQswCQYDVQQGEwJVUzET
# MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
# dGFtcCBQQ0EgMjAxMDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKkd
# Dbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX77XxoSyxfxcPlYcJ2tz5mK1vwFVMn
# BDEfQRsalR3OCROOfGEwWbEwRA/xYIiEVEMM1024OAizQt2TrNZzMFcmgqNFDdDq
# 9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0ySwcSmXdFhE24oxhr5hoC732H8
# RsEnHSRnEnIaIYqvS2SJUGKxXf13Hz3wV3WsvYpCTUBR0Q+cBj5nf/VmwAOWRH7v
# 0Ev9buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn9NxkvaQBwSAJk3jN
# /LzAyURdXhacAQVPIk0CAwEAAaOCAeYwggHiMBAGCSsGAQQBgjcVAQQDAgEAMB0G
# A1UdDgQWBBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEEAYI3FAIEDB4KAFMA
# dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAW
# gBTV9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8v
# Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNSb29DZXJBdXRf
# MjAxMC0wNi0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRw
# Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0NlckF1dF8yMDEw
# LTA2LTIzLmNydDCBoAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEEAYI3LgMwgYEwPQYI
# KwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9QS0kvZG9jcy9DUFMv
# ZGVmYXVsdC5odG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AUABvAGwA
# aQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZIhvcNAQELBQADggIB
# AAfmiFEN4sbgmD+BcQM9naOhIW+z66bM9TG+zwXiqf76V20ZMLPCxWbJat/15/B4
# vceoniXj+bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX/1z5Xhc1mCRWS3Tv
# QhDIr79/xn/yN31aPxzymXlKkVIArzgPF/UveYFl2am1a+THzvbKegBvSzBEJCI8
# z+0DpZaPWSm8tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnxzplmkIz/amJ/3cVK
# C5Em4jnsGUpxY517IW3DnKOiPPp/fZZqkHimbdLhnPkd/DjYlPTGpQqWhqS9nhqu
# BEKDuLWAmyI4ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kWumGnEcua2A5HmoDF
# 0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/nMQekkzr3ZUd46PioSKv33nJ+
# YWtvd6mBy6cJrDm77MbL2IK0cs0d9LiFAR6A+xuJKlQ5slvayA1VmXqHczsI5pgt
# 6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnPGUFN4Ib5KpqjEWYw07t0Mkvf
# Y3v1mYovG8chr1m1rtxEPJdQcdeh0sVV42neV8HR3jDA/czmTfsNv11P6Z0eGTgv
# vM9YBS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkSoYICzjCCAjcCAQEwgfih
# gdCkgc0wgcoxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
# VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJTAj
# BgNVBAsTHE1pY3Jvc29mdCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRo
# YWxlcyBUU1MgRVNOOkQ2QkQtRTNFNy0xNjg1MSUwIwYDVQQDExxNaWNyb3NvZnQg
# VGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQA5yQbj7emrMRP+jjdY
# uspZjMqw3KCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
# dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
# YXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMA0G
# CSqGSIb3DQEBBQUAAgUA4uxoXjAiGA8yMDIwMDgyMzEyMDAzMFoYDzIwMjAwODI0
# MTIwMDMwWjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi7GheAgEAMAoCAQACAhBC
# AgH/MAcCAQACAhGQMAoCBQDi7bneAgEAMDYGCisGAQQBhFkKBAIxKDAmMAwGCisG
# AQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEFBQAD
# gYEAO0DwpYt+sNotvMbQb2Pf8hJBAK3fliWfJhRMQjoa0rJISRiXJKHhHUS2YXtO
# Mx+Uz1D9jZkA3tsThkKf2jklPLiRbqSlZ4cXAd4HTSD58nhmOVxnZhWR8wgub4JV
# Ki9wox6NyR76jLAoNQ8KeNyvS6SH/e84ovoV2lzcD7F/dJ8xggMNMIIDCQIBATCB
# kzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
# UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQD
# Ex1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAAR4OvOVLFqIDGwAA
# AAABHjANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqGSIb3DQEJ
# EAEEMC8GCSqGSIb3DQEJBDEiBCAiu0van0TENTZ17PM2G0vZafS8ZiQaiVxSY5LA
# xU7z4DCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0EIHM75FjD33E6UeW9p588
# oTdxLc0l1ZTx+iIEHA+N1l9HMIGYMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNV
# BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
# c29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAg
# UENBIDIwMTACEzMAAAEeDrzlSxaiAxsAAAAAAR4wIgQgn/ScMmS3N8OB+l3mibZ4
# FLRLLRBjqhhx9QzZYI0WCeswDQYJKoZIhvcNAQELBQAEggEAExv3ECyItksRSpHr
# rpp3sSaGKxJ2f1Ad1m7AUzw15S6WkrODA7WVNauN9/xdkN0QXgEO3O1oYcV9GAat
# LGsNDUzGmBJEK0XOs3o5tL36uBw7ZtquMZ9B8Z7GRfeeILcD6wuaSCV4wrvS/Jvc
# gRt7X8kXS69gGMrgA4r3w+yHD2cy9wrurMaL/vVAkRYZEPVd3sDsQtyKGOm4vn3X
# 98LgNbH6cgN3mueHpRPZ2SSFBgKoUKJ0hpKCpWl6HKcpKU1nJvq86QXiXMjOawDa
# kMGJqOr9DxaiK6U7aWO74Ed/+lXBmG19OHGgabpWoCmlOmiOIPkdKiwqXl+7bxSP
# T0bcWw==
# SIG # End signature block
