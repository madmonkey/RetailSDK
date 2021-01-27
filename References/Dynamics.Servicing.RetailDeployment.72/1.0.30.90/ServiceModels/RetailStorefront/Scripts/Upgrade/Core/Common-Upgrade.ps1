<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

# Make script to interrupt if exception is thrown.
$ErrorActionPreference = "Stop"

$ScriptDir = split-path -parent $MyInvocation.MyCommand.Path;
. (Join-Path $ScriptDir 'Common-Configuration.ps1')
. (Join-Path $ScriptDir 'Common-Web.ps1')

function Get-FileVersion(
	[string] $filePath = $(throw 'FilePath is required'))
{
	if(-not (Test-Path -Path $filePath))
	{
		throw "$filePath doesn't exist."
	}
	return [System.Diagnostics.FileVersionInfo]::GetVersionInfo($filePath).FileVersion
}

function Compare-FileVersion(
	[string] $sourceVersion = $(throw 'sourceVersion is required'),
	[string] $targetVersion = $(throw 'targetVersion is required'))
{
	[Version] $sourceVersionValue = $sourceVersion
	[Version] $targetVersionValue = $targetVersion
	
	return $sourceVersionValue.CompareTo($targetVersionValue)
}

function Check-UpgradeEligibility(
	[string] $webSiteName = $(throw 'webSiteName is required'),
	[string] $flagFileSubPathToIdentifyCurrentVersion = $(throw 'flagFileSubPathToIdentifyCurrentVersion is required'),
	[string] $minSupportedVersion = $(throw 'minSupportedVersion is required'))
{
	$webSite = Get-WebSiteSafe -Name $webSiteName

	if(-not $webSite)
	{
		throw "Cannot find website with name: $webSiteName"
	}
	
	# check version support
	$currentVersion = Get-FileVersion -filePath (Join-Path $webSite.physicalPath $flagFileSubPathToIdentifyCurrentVersion)
	
	if((Compare-FileVersion -sourceVersion $currentVersion -targetVersion $minSupportedVersion) -lt 0)
	{
		throw "Current Version $currentVersion is lower than minimum supported version: $minSupportedVersion"
	}
	
	return $true
}

function Get-ChannelDbRegistryPath
{
    return 'HKLM:\SOFTWARE\Microsoft\Dynamics\{0}\RetailChannelDatabase\Servicing' -f (Get-ProductVersionMajorMinor)
}

function Get-ChannelDbExtUserRegistryPath
{
    return 'HKLM:\SOFTWARE\Microsoft\Dynamics\{0}\RetailChannelDatabase\Ext' -f (Get-ProductVersionMajorMinor)
}

function Get-ChannelDbServicingPropertyName(
    [int]$propertyIndex = '1'
)
{
    return 'UpgradeServicingData' + $propertyIndex
}

function Get-ChannelDbServicingDataFromRegistry()
{ 
    $result = Get-ServicingDataFromRegistry -registryPath (Get-ChannelDbRegistryPath)
    return $result
}

function Get-ServicingDataFromRegistry([string] $registryPath = $(throw 'registryPath is required'))
{
    $result = @()
    $propertyIndex = 1
    
    while($true)
    {
        $channelDbServicingPropertyName = (Get-ChannelDbServicingPropertyName -propertyIndex $propertyIndex)
        $channelDbEncryptedServicingData = Read-RegistryValue -targetRegistryKeyPath $registryPath -targetPropertyName $channelDbServicingPropertyName
        
        if($channelDbEncryptedServicingData)
        {
            $servicingDataAsSecureString = ConvertTo-SecureString $channelDbEncryptedServicingData
            $servicingDataAsPlainText = [System.Runtime.InteropServices.marshal]::PtrToStringAuto([System.Runtime.InteropServices.marshal]::SecureStringToBSTR($servicingDataAsSecureString))
            
            $propertyIndex += 1
            $result += $servicingDataAsPlainText
        }
        else
        {
            break;
        }
    }
    
    return $result
}

function Extract-ConnectionStringsFromWebConfig([string] $webConfigPath = $(throw 'webConfigPath is required'))
{
	[xml] $webConfigDoc = Get-Content $webConfigPath

	if($webConfigDoc.configuration.connectionStrings -and $webConfigDoc.configuration.connectionStrings.InnerXml)
	{
		return $webConfigDoc.configuration.connectionStrings.InnerXml
	}
	else
	{
		return $null
	}
}

function Create-WebSiteDBConfiguration(
[string]$connectionString = $(throw 'connectionString is required'))
{
	[hashtable]$ht = @{};

    # sample connection string for sql azure "Server=$dbServer;Database=$dbName;User ID=$dbUser;Password=$dbPassword;Trusted_Connection=False;Encrypt=True;"
    $connectionStringObject = New-Object System.Data.Common.DbConnectionStringBuilder
    $connectionStringObject.PSObject.Properties['ConnectionString'].Value = $connectionString
    
    $ht.server = $connectionStringObject['Server']
    $ht.database = $connectionStringObject['Database']
    $ht.sqlUserName = $connectionStringObject['User ID']
    $ht.sqlUserPassword = $connectionStringObject['password']
	$ht.encrypt = $connectionStringObject['encrypt']
	$ht.trustservercertificate = $connectionStringObject['trustservercertificate']
    
	return $ht
}

function Update-WebsiteConnectionStringSettings(
	[string] $webConfigPath = $(throw 'webConfigPath is required'),
	[string] $connectionStringsXml = $(throw 'connectionStringsXml is required'))
{
	[xml] $webConfigDocNew = Get-Content $webConfigPath
	$webConfigDocNew.SelectSingleNode("//configuration/connectionStrings").InnerXml = $connectionStringsXml
	$webConfigDocNew.Save($webConfigPath)
}

function Replace-WebsiteFiles(
	[string] $webSiteName = $(throw 'webSiteName is required'),
	[string] $newWebFilesPath = $(throw 'newWebFilesPath is required'))
{
    $physicalPath = Get-WebSitePhysicalPath -webSiteName $webSiteName
	
	# Stop website
	Stop-WebSite $webSiteName

    # Back-up the current working directory
	Backup-Directory -sourceFolder $physicalPath
	
	# Replace files. Note: We want to mirror the source directory to remove any redundant binaries for the website.
	Copy-Files -SourceDirPath $newWebFilesPath -DestinationDirPath $physicalPath -RobocopyOptions '/MIR' 
	
	# Start website
	Start-WebSite $webSiteName
}

function Get-AxDatabaseUserFromWebConfig(
    [xml] $webConfig = $(throw 'webConfig is required'),
    [string] $dbUserKey = $(Throw 'dbUserKey is required!'),
    [string] $dbUserPasswordKey = $(Throw 'dbUserPasswordKey is required!')
    )
{
    $DbServer = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName 'DataAccess.DbServer'
    $Database = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName 'DataAccess.Database'
    $encryption = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName 'DataAccess.encryption'
    $disableDBServerCertificateValidation = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName 'DataAccess.disableDBServerCertificateValidation' -Optional
    $dbUser = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName $dbUserKey
    $dbUserPassword = Get-WebConfigAppSetting -WebConfig $webConfig -SettingName $dbUserPasswordKey

    if($disableDBServerCertificateValidation -eq $null)
    {
        # if not specified in the web.config, then only ignore certificate issues for 
        # local db servers (where the server name and the machine name are the same)
        $disableDBServerCertificateValidation = ($DbServer -eq $env:COMPUTERNAME).ToString()
    }
    
    if($DbServer -and $Database -and $dbUser -and $dbUserPassword)
    {
        return ('Server="{0}";Database="{1}";User ID="{2}";Password="{3}";Encrypt={4};TrustServerCertificate={5};' -f $DbServer,$Database,$dbUser,$dbUserPassword,$encryption,$disableDBServerCertificateValidation)
    }
    else
    {
        throw "Cannot find the database credential information from web.config with key $dbUserKey and $dbUserPasswordKey"
    }
}

function Get-ServicingInformation(
    [ValidateNotNullOrEmpty()][string]$AosWebsiteName,
    [ValidateNotNullOrEmpty()][string]$retailServerWebConfigPath,
    [bool]$isMicrosoftPackage,
    [switch]$MigrateIfNeeded)
{
    $websiteConnectionStringSettings = @()
    if((Test-Path -Path $retailServerWebConfigPath) -eq $false)
    {
        throw "$retailServerWebConfigPath doesn't exist."
    }   
        
    $IsDbCredentialInWebConfig = Get-UseDatabaseCredentialInWebConfigForUpgrade
    if($IsDbCredentialInWebConfig)
    {
        $retailServerWebConfigDoc = [xml](Get-Content $retailServerWebConfigPath)
        
        Log-TimedMessage "Servicing information has been migrated to web.config, extract it from web.config"
        $appSettingSqlAdminUserElement = $retailServerWebConfigDoc.SelectSingleNode("/configuration/appSettings/add[@key='DataAccess.AxAdminSqlUser']")
        if($appSettingSqlAdminUserElement -eq $null)
        {
            throw "Retail servicing data doesn't present in $retailServerWebConfigPath under /configuration/appSettings/ with key DataAccess.AxAdminSqlUser, please contact support team to restore this information."
        }
        
        if($isMicrosoftPackage)
        {
            Log-TimedMessage "This is a Microsoft package, will use axdeployuser to apply critical database changes."
            $websiteConnectionStringSettings = Get-AxDatabaseUserFromWebConfig -webConfig $retailServerWebConfigDoc -dbUserKey 'DataAccess.AxAdminSqlUser' -dbUserPasswordKey 'DataAccess.AxAdminSqlPwd'
        }
        else
        {
            Log-TimedMessage "This is NOT a Microsoft package, will use axdeployextuser to apply customized database changes."
            $appSettingSqlUserElement = $retailServerWebConfigDoc.SelectSingleNode("/configuration/appSettings/add[@key='DataAccess.SqlUser']")
        
            if($appSettingSqlUserElement -ne $null)
            {
                Log-TimedMessage "Information about axdeployextuser found, use it for customized update."
                $websiteConnectionStringSettings = Get-AxDatabaseUserFromWebConfig -webConfig $retailServerWebConfigDoc -dbUserKey 'DataAccess.SqlUser' -dbUserPasswordKey 'DataAccess.SqlPwd'
            }
            else
            {
                Log-TimedMessage "Information about axdeployextuser doesn't present, this is expected for legacy build, use axdeployuser as replacement."
                $websiteConnectionStringSettings = Get-AxDatabaseUserFromWebConfig -webConfig $retailServerWebConfigDoc -dbUserKey 'DataAccess.AxAdminSqlUser' -dbUserPasswordKey 'DataAccess.AxAdminSqlPwd'
            }
        }
    }
    else
    {
        Log-TimedMessage "Servicing information has NOT been migrated to web.config, extract it from registry"
        try
        {
            $ChannelDbRegistryPath = Get-ChannelDbRegistryPath
            if((Test-Path -Path $ChannelDbRegistryPath) -eq $false)
            {
                throw "Retail servicing data doesn't present in registry, please contact support team to restore this information."
            }
            
            if($isMicrosoftPackage)
            {
                Log-TimedMessage "This is a Microsoft package, will use axdeployuser to apply critical database changes."
                $websiteConnectionStringSettings = (Get-ChannelDbServicingDataFromRegistry)
            }
            else
            {
                Log-TimedMessage "This is NOT a Microsoft package, will use axdeployextuser to apply customized database changes."
                
                $ChannelDbExtUserRegistryPath = Get-ChannelDbExtUserRegistryPath
                if(Test-Path -Path $ChannelDbExtUserRegistryPath)
                {
                   Log-TimedMessage "Information about axdeployextuser found, use it for customized update."
                   $websiteConnectionStringSettings = Get-ServicingDataFromRegistry -registryPath (Get-ChannelDbExtUserRegistryPath)
                }
                else
                {
                    Log-TimedMessage "Information about axdeployextuser doesn't present, this is expected for legacy build, use axdeployuser as replacement."
                   $websiteConnectionStringSettings = (Get-ChannelDbServicingDataFromRegistry)
                }
            }
            
            if($MigrateIfNeeded -and $websiteConnectionStringSettings.Count -gt 0)
            {
                Log-TimedMessage "Migrating servicing information from registry to web.config."
                Update-ChannelDatabaseConfigLocation -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigPath | Out-Null
            }
        }
        catch
        {
            # log detailed error message for trouble shooting.
            Log-TimedMessage ($global:error[0] | format-list * -f | Out-String)
            
            throw "Retail servicing data in registry is corrupted, please contact support team to update it and try again."
        }
    }
    
    return $websiteConnectionStringSettings
}

function Get-WebSitePhysicalPath([string]$webSiteName = $(throw 'webSiteName is required'))
{
    $webSite = Get-WebSiteSafe -Name $webSiteName
	
	if(!$webSite)
	{
		throw ("Cannot find the website with name: {0} " -f $webSiteName)
	}

    return $webSite.physicalPath
}

function Get-WebSiteId([string]$webSiteName = $(throw 'webSiteName is required'))
{
    $webSite = Get-WebSiteSafe -Name $webSiteName
	
	if(!$webSite)
	{
		throw ("Cannot find the website with name: {0} " -f $webSiteName)
	}

    return $webSite.Id
}

function Is-PackageDelta(
    [ValidateNotNullOrEmpty()]
    [string]$installationInfoFile = $(throw 'installationInfoFile is required'))
{
    [bool]$isPackageDelta = $false
    
	Log-TimedMessage 'Checking if the current package is of type delta.'

	
	$installInfoContent = [XML] (Get-Content -Path $installationInfoFile)
	$updateFilesNode = $installInfoContent.SelectSingleNode('//ServiceModelInstallationInfo/UpdateFiles')
	
	if($updateFilesNode -and $updateFilesNode.HasChildNodes)
	{
	   Log-TimedMessage 'Yes'
	   $isPackageDelta = $true 
	}
	else
	{
	    Log-TimedMessage 'No'
	}
	
	return $isPackageDelta
}

function Get-InstallationInfoFilePath([string]$scriptDir = $(throw 'scriptDir parameter is required'))
{
    $svcModelScriptsDir = (Split-Path (Split-Path $scriptDir -Parent) -Parent)
    $filePath = Join-Path $svcModelScriptsDir 'InstallationInfo.xml'
    $customizedFilePath = Join-Path $svcModelScriptsDir 'CustomizedInstallationInfo.xml'
    
    if(Test-Path -Path $customizedFilePath)
    {
        return $customizedFilePath
    }
    elseif(Test-Path -Path $filePath)
    {
        return $filePath
    }
    else
    {
        throw ('Could not locate InstallationInfo.xml or CustomizedInstallationInfo.xml at location {0}' -f $filePath)
    }
}

function Get-CustomizedInstallationInfoFilePath([string]$scriptDir = $(throw 'scriptDir parameter is required'))
{
    $svcModelScriptsDir = (Split-Path (Split-Path $scriptDir -Parent) -Parent)
    $filePath = Join-Path $svcModelScriptsDir 'CustomizedInstallationInfo.xml'
    
    if(-not(Test-Path -Path $filePath))
    {
        Log-TimedWarning "Could not locate customized installation info file at location $filePath"
        return $null
    }

    return $filePath
}

function Is-UpdateFileActionInclude(
    [ValidateNotNullOrEmpty()]
    [XML]$xml = $(throw 'xml parameter is required'))
{
    [bool]$isFileActionInclude = $false
    $updateAction = $xml.ServiceModelInstallationInfo.UpdateFiles.updateAction

    if([string]::IsNullOrWhiteSpace($updateAction))
    {
        throw 'File update action missing. Please specify whether you want to include or exclude update files.'
    }

    if($updateAction -eq 'include')
    {
        $isFileActionInclude = $true
    }

    return $isFileActionInclude
}

function Get-ListOfFilesToCopy(
    [bool]$isPackageDelta,
    
    [ValidateNotNullOrEmpty()]
    [string]$installationInfoXmlPath = $(throw 'installationInfoXmlPath parameter is required'),

    [ValidateNotNullOrEmpty()]
    [string]$updatePackageCodeFolder = $(throw 'updatePackageCodeFolder parameter is required'))
{
    if($isPackageDelta)
    {
        $installInfoContent = [XML] (Get-Content -Path $installationInfoXmlPath)
        [bool]$includeFiles = Is-UpdateFileActionInclude -xml $installInfoContent
        
        $filesNode = Select-Xml -XPath '//ServiceModelInstallationInfo/UpdateFiles/File' -Xml $installInfoContent

        if($includeFiles)
        {
            $listOfFilesToCopy = $filesNode | % {$_.Node.Name}
        }
        else
        {
            $filesToExclude = @()
            $filesNode | % {
                $fullPath = (Join-Path $updatePackageCodeFolder ("{0}\{1}" -f $_.Node.RelativePath, $_.Node.Name))
                $filesToExclude += $fullPath
            }

            $listOfFilesToCopy = Get-ChildItem -File -Path $updatePackageCodeFolder -Recurse | ? { $_.FullName -notin $filesToExclude } | % {$_.Name}
        }

    }
    else
    {
        $listOfFilesToCopy = Get-ChildItem -File -Path $updatePackageCodeFolder -Recurse | % {$_.Name}
    }

    return $listOfFilesToCopy
}

function Check-IfAnyFilesExistInFolder(
    [string]$folderPath = $(throw 'folderPath parameter is required')
)
{
    if(!(Test-Path -Path $folderPath))
    {
        Log-TimedMessage ("Folder {0} does not exist." -f $folderPath)
        return $false
    }

    $fileList = Get-ChildItem -File $folderPath -Recurse | Measure-Object
    if($fileList.Count -eq 0)
    {
        Log-TimedMessage ("No files exist in the {0} folder." -f $folderPath)
        return $false
    }

    return $true
}

function Check-IfCustomPublisherExistsInInstallInfoXml(
    [string]$installationInfoXml = $(throw 'installationInfoFile is required'))
{
    [xml]$content = Get-Content $installationInfoXml
    
    Log-ActionItem 'Checking if CustomPublisher node is populated in the installation info file'
    $customPublisher = $content.ServiceModelInstallationInfo.CustomPublisher

    if([string]::IsNullOrWhiteSpace($customPublisher))
    {
        Log-ActionResult 'No'
        return $false
    }
    else
    {
        Log-ActionResult ('Yes. Its value is [{0}]' -f $customPublisher)
        return $true
    }
}

function Check-IfCurrentDeploymentOfComponentIsCustomized(
    [string]$componentName = $(throw 'componentName is required'),
    [string]$updatePackageRootDir = $(throw 'installationInfoFile is required'))
{
    [bool]$isCurrentDeploymentCustomized = $false

    Log-ActionItem 'Checking whether the current deployment on the machine is customized'

    # Load the installation info assembly
    $AxInstallationInfoDllPath = Join-Path $updatePackageRootDir 'Microsoft.Dynamics.AX.AXInstallationInfo.dll'
    Add-Type -Path $AxInstallationInfoDllPath

    # Get a list of all service model installation info
    $serviceModelInfoList = [Microsoft.Dynamics.AX.AXInstallationInfo.AXInstallationInfo]::GetInstalledServiceModel()

    $currentServiceModelInfo = $serviceModelInfoList | ? {$_.Name -ieq $componentName}

    if(!([string]::IsNullOrWhiteSpace($currentServiceModelInfo)) -and (Check-IfCustomPublisherExistsInInstallInfoXml -installationInfoXml $currentServiceModelInfo.InstallationInfoFilePath))
    {
        Log-ActionResult 'Yes'
        $isCurrentDeploymentCustomized = $true
    }
    else
    {
        Log-ActionResult 'No'
    }

    return $isCurrentDeploymentCustomized
}

function Check-IfUpdatePackageIsReleasedByMicrosoft(
    [string]$installationInfoXml = $(throw 'installationInfoFile is required'))
{
    return (-not (Check-IfCustomPublisherExistsInInstallInfoXml -installationInfoXml $installationInfoXml))
}

function Rename-InstallationInfoFile(
    [string]$filePath = $(throw 'filePath is required'))
{
    $folderPath = Split-Path $filePath -Parent
    $fileName = Split-Path $filePath -Leaf

    $renamedInstallInfoFilePath = Join-Path $folderPath ('Delta_{0}_{1}' -f $(Get-Date -f yyyy-MM-dd_hh-mm-ss), $fileName)

    Log-TimedMessage ('Renaming the manifest installation info file [{0}] to [{1}]' -f $filePath, $renamedInstallInfoFilePath)
    
    Rename-Item -Path $filePath -NewName $renamedInstallInfoFilePath -Force | Out-Null
    
    Log-TimedMessage 'Done renaming the file.'

    return $renamedInstallInfoFilePath
}

function Get-LcsEnvironmentId()
{
    $monitoringInstallRegKeyPath = 'HKLM:\SOFTWARE\Microsoft\Dynamics\AX\Diagnostics\MonitoringInstall'
    Log-TimedMessage ('Trying to find LCS Environment Id from registry key - {0}' -f $monitoringInstallRegKeyPath)

    $value = Read-RegistryValue -targetRegistryKeyPath $monitoringInstallRegKeyPath -targetPropertyName 'LCSEnvironmentID'

    if($value)
    {
        Log-TimedMessage ('Found LCS Environment Id - {0}' -f $value)
    }    

    return $value
}

function CreateOrUpdate-ServicingStepSetting(
    [ValidateNotNullOrEmpty()]
    $settingsFilePath = $(throw 'settingsFilePath is required'),
    
    [ValidateNotNullOrEmpty()]
    $runbookStepName = $(throw 'runbookStepName is required'),
    
    [ValidateNotNullOrEmpty()]
    $propertyName = $(throw 'propertyName is required'),
    
    $value = $(throw 'value is required'))
{
    $settingsJson = Get-Content $settingsFilePath -Raw | ConvertFrom-Json

    if(!$settingsJson)
    {
        $settingsJson = New-Object psobject
    }

    Log-TimedMessage ('Check if step [{0}] exists in the file.' -f $runbookStepName)
    if($settingsJson.$runbookStepName -eq $null)
    {
        Log-TimedMessage ('No. Adding Step = [{0}] PropertyName = [{1}] Value = [{2}]' -f $runbookStepName, $propertyName, $value)
        $obj = New-Object psobject | Add-Member -PassThru NoteProperty -Name $propertyName -Value $value -Force
        $settingsJson | Add-Member -MemberType NoteProperty -Name $runbookStepName -Force -Value $obj
    }
    else
    {
        Log-TimedMessage ('Yes. Updating Step = [{0}] PropertyName = [{1}] Value = [{2}]' -f $runbookStepName, $propertyName, $value)
        $settingsJson.$runbookStepName | Add-Member -MemberType NoteProperty -Name $propertyName -Value $value -Force
    }
    
    Log-TimedMessage ('Saving the file {0}' -f $settingsFilePath)
    $settingsJson | ConvertTo-Json | Out-File $settingsFilePath -Force
}

# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDOOxAVT64aFiZ1
# 7gm7pfoYdCoUPP2G2sO0UnxkwlMol6CCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBR
# WqSrR19jtdOWjYLZCx5/WR2Q3MC5kBARnVvUhXNKGTCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAA
# FBs/Oedz1Ma+vGoIamB2VRbKISjSYsxDJFOkBnTrLcEdEJZ6TbzRljFrmWTGjDsv
# 6jcmmm/05WTXDkAKqboPX2/38gcXALsFKKs1OiFHCG86napqV/EDsk5PAmcIb9hF
# FlH/gPhEsS0zi9lpzqZHYTiMTfHfMzfbiCzuD5FXuT1rSH8TP9HmuQy1+r4ZnlHG
# Fca+Ed+hqIt3Uy7jTPFTN4kM8CaaXT93+XIgbfxYL/rPD1jSgT8OIWo3VDAJJIG8
# Jt6W3fE4EYa3WonVQ+JzxmJ5QqaWonVN9ygCkmJGoZdovzrx8RKLB0FYFj+6IKOJ
# wCz4agxvybYp30gJ+8lMoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IE8FLjWKZOvqzUyBmiBAoLBoOJs+0W35Qly9EqXDTKoeAgZfPS1I03QYEzIwMjAw
# ODIzMDQwMjQ4LjgwNFowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
# VQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25z
# IExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjA4NDItNEJFNi1DMjlB
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOPDCCBPEw
# ggPZoAMCAQICEzMAAAEJfoK9HnvTYSIAAAAAAQkwDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTE0WhcNMjEw
# MTIxMjMxOTE0WjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
# BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UE
# CxMdVGhhbGVzIFRTUyBFU046MDg0Mi00QkU2LUMyOUExJTAjBgNVBAMTHE1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQC4wyEQZQIHGgkuQ/1UnrdT7jela35bXCpB9jYSlc+bFiXDs1LLX1Z7
# 9nkL4ZUfj+wtOrN7OyEqXV2fgiwdi0uZ/W31ozc6OTcY3gF+yGp0ZPTCA463zSdB
# CSpHpGG6c7XyYXig8cRPQuO7Rv5dFpxpPlDypMty1+OlgFcZUYoMSQabW4QUu87y
# M3hZ7MTuTLZsuKx7+dDzJxIAbGwecCNSsPd0D2zE/WwR+LCInse+4UFrrYYPwJKs
# PMifO3UvmCF7Ld/rmyLQbGdrR6xwXMmzc4HBBOT5wyta6Op0CYdnUensxOJ/qgEN
# w/fNTWPXfggms8DLsOJthTYrG2QkDSr3AgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
# paSSc0yDQvxCcYjn1KjvNj9uSUYwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8Uz
# aFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
# L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoG
# CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
# Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
# AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEA
# OFiHA4sHR0uQEq6TTC5G/8luBryoOQ+kFuJU5iXATSXe0BrdSVzlKq3qkE6EHvrc
# XFgzl1KHLFi2bgsh8JiPlDLHfLmfTkFNxLEHr35MFTPwa9J3U4afrCk7aYsYIE0J
# siDF3+RY24HHh6Sw0njIQ1K8yH5PC5+evkj+lh5k6mhQf472m8Vc/fLPPtOsdyec
# zOEw5citXv1zUINJWwHy2m3eQl6ulxA3sgYpAzdm+NQtf/oi0yQ6QmkQSmd+rpbg
# k6tqi1j/iOg0ECRmmK0wtvfaEvjwxU67Ykxwyg188kRLhAAz6d7/S/FGrq+v07zC
# VJxxr0ZEoCtaTFl7zJ/qaDCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZI
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
# Ex1UaGFsZXMgVFNTIEVTTjowODQyLTRCRTYtQzI5QTElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUACsG8ux1nIgl0
# fkctgBa2jzpieACggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
# MDANBgkqhkiG9w0BAQUFAAIFAOLsSOswIhgPMjAyMDA4MjMwOTQ2MTlaGA8yMDIw
# MDgyNDA5NDYxOVowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA4uxI6wIBADAKAgEA
# AgIcwwIB/zAHAgEAAgIRzDAKAgUA4u2aawIBADA2BgorBgEEAYRZCgQCMSgwJjAM
# BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEB
# BQUAA4GBACk864kO2oACzlWE8RFsxYyeUCjKJY8FLwqXGhDHRh4kwL5AsM8Xmp7i
# fWHoK1atYhnw30iy5HDu/0Gzoq/2+yXUAkcNjHFLNwyiUP4FR6nEq/Qwo4BoyOG3
# CXvvzTlEPZg5Gs/+mmZj4laUpcG4bFVAYkx0cgaPnWr1ENyjCZ66MYIDDTCCAwkC
# AQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
# A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEJfoK9HnvT
# YSIAAAAAAQkwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQguaHnPl4zVn2BtT8R+uuM1KDBpTIwSE57
# cfsU/z96tOgwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCCCVPhhBhtKMjxi
# E2/c3YdDcB3+1eTbswVjXf+epZ1SjzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABCX6CvR5702EiAAAAAAEJMCIEIBjmRjwTerYai/wZ
# tkGQOCOhb1wZicFe6Gbg2GhN5HYlMA0GCSqGSIb3DQEBCwUABIIBAHSmOrI6AATF
# IRQIxGOACQYJlbr24j9yY5WfbB7mkSKiy5UIIrUN0ONhJjD5mJl4enW95CaKibmX
# hTZx8HvKOhUXnF6ThaNhENlUHV/LQ7n4FY+aUB/sruUrzOrfgNbLJgXA8daNVjO3
# NADXq3UHkrDp9BsQaG9aZJ3PsLG25X00g6ZI7k3qZSlP7YwElA0v4BqgmGZxdJ4F
# M8e+o0W+Pl5sMosN5Ln823wTBBA2xuQ/AI2y2ZrQ4ZpKpPVd+ONPkPFrOOwQxiQ9
# 72j/NdIJSXhl8AtX9iEU4M7b6hAXYzjqo6oKSfDBHIFI1AZuvb5UpZInZAjAgVvJ
# 9f9ty5Rkaow=
# SIG # End signature block
