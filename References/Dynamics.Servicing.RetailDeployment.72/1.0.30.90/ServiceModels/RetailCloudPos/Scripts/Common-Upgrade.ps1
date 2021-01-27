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
# MIIjpgYJKoZIhvcNAQcCoIIjlzCCI5MCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDOOxAVT64aFiZ1
# 7gm7pfoYdCoUPP2G2sO0UnxkwlMol6CCDYEwggX/MIID56ADAgECAhMzAAABh3IX
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
# RcBCyZt2WwqASGv9eZ/BvW1taslScxMNelDNMYIVezCCFXcCAQEwgZUwfjELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9z
# b2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAxMQITMwAAAYdyF3IVWUDHCQAAAAABhzAN
# BglghkgBZQMEAgEFAKCBzjAZBgkqhkiG9w0BCQMxDAYKKwYBBAGCNwIBBDAcBgor
# BgEEAYI3AgELMQ4wDAYKKwYBBAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgUVqkq0df
# Y7XTlo2C2Qsef1kdkNzAuZAQEZ1b1IVzShkwYgYKKwYBBAGCNwIBDDFUMFKgNIAy
# AFMAdABvAHAALQBSAGUAdABhAGkAbABTAHQAbwByAGUAZgByAG8AbgB0AC4AcABz
# ADGhGoAYaHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIB
# AJbEvMfG7FhhcFGkZVxNP/ywAsueQ1rTIKoifcTQtlAk6kChNJ0KM8P/yTmLywZB
# 1ZkXUFTiKsqdDSN0iRX4Lm0oYWoIUnnARda2+v+/jUKR8fo2RJyg11mYg4j2lqef
# T6w3kbsjKCMWwW4fwI8ePXHq5GL5Ri7HualavfyT/oifwdqiAhGBViXmiOB6ZocJ
# buB8ZaiCczwuXefcUQSe/Cw/3qYJFkFJQlqHNLVAwg7bH/CeFM/0Bqs5C1R2WMg8
# B0J3uCd+a+Z153L6rwBGKEd38OM8uICCJaNCEATaXpSxBTByGDLi64BGz77k6cbu
# HKS96yLUwbUBPCbiq+JuTSmhghLlMIIS4QYKKwYBBAGCNwMDATGCEtEwghLNBgkq
# hkiG9w0BBwKgghK+MIISugIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBUQYLKoZIhvcN
# AQkQAQSgggFABIIBPDCCATgCAQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEF
# AAQgVRJ/X6P0bVwjUUQh2G1zmHXQo589JsIj+Snq52TBCp8CBl86rEq4GBgTMjAy
# MDA4MjMwMjMzNDMuMDMyWjAEgAIB9KCB0KSBzTCByjELMAkGA1UEBhMCVVMxEzAR
# BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
# Y3Jvc29mdCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2Eg
# T3BlcmF0aW9uczEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046N0JGMS1FM0VBLUI4
# MDgxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wggg48MIIE
# 8TCCA9mgAwIBAgITMwAAAR9OJc2sCvS4HwAAAAABHzANBgkqhkiG9w0BAQsFADB8
# MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
# bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1N
# aWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTExMTMyMTQwNDFaFw0y
# MTAyMTEyMTQwNDFaMIHKMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
# bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
# aW9uMSUwIwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25zMSYwJAYD
# VQQLEx1UaGFsZXMgVFNTIEVTTjo3QkYxLUUzRUEtQjgwODElMCMGA1UEAxMcTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEP
# ADCCAQoCggEBAKVMD8xW9z8cjH9OOjC1hQrRcJQqc7tcD4tunKdEGMWtfcm2z5wx
# ftcZY0NaeqV4/oTy00CILFf8SwJw6Cp0Rpqt+y+HklUl4DJgkw2mS2VMCYtw8rEI
# HQl/LsKPnJ5XxnxQmdDs0yFYI7eMGtaFrapINHifv4eAnohn3Un68/Q7PaP85/FV
# qX87HFu7xxYwJk915AE5d2dVCFcYm0g4ThkvnzRG/LcHduEZ/qgaYrUalS2yRny2
# pCDI/XDkV14b2FhsgkH8rj5ljymkNfeImYqli/7P/Qlluft/NfvuzkWvWqrTpg8k
# Qk1Q7xrS0yGZ7AP1iA+0kFcV4KvLuWLbCLMCAwEAAaOCARswggEXMB0GA1UdDgQW
# BBQVox8AOjATYwQ3ZSJbK8E2ifrgwDAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYb
# xTNoWoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5j
# b20vcGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmww
# WgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29m
# dC5jb20vcGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNydDAMBgNV
# HRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IB
# AQCY0UfA3GTiymKryc6Jz1HELAvZfz8LveDL/u5fF9QVtvsyhKgA0/aICQ9zqe3A
# IN8d8em2hC+qsOIcDglN3VlBJsQEuoTulnfBXYv6FGZTOKnrAol/dQ2eT/cV4hA8
# 9VF0MW2ZGPyoHoCQCOAjskCLaS8pRoJpsefF9cuYGFFJpcxB2MAnt1GCwpugBNqj
# fv00OdYcpYpuwTUerNsKiBCYBSxstdWYEiToubUOQaizofsCLWEaq6GUdECDTU2d
# PildKspm2p2KiDInxm3OTPXzXPn9kTZxuDGbzAH7CFFZav9zIa1jf5AyoL7e78dC
# yPzn4NZXBTxT48H7is2LamxEMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAAAjANBgkq
# hkiG9w0BAQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
# EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
# bjEyMDAGA1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
# IDIwMTAwHhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAxMjE0NjU1WjB8MQswCQYDVQQG
# EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
# A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQg
# VGltZS1TdGFtcCBQQ0EgMjAxMDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
# ggEBAKkdDbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX77XxoSyxfxcPlYcJ2tz5m
# K1vwFVMnBDEfQRsalR3OCROOfGEwWbEwRA/xYIiEVEMM1024OAizQt2TrNZzMFcm
# gqNFDdDq9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0ySwcSmXdFhE24oxhr5
# hoC732H8RsEnHSRnEnIaIYqvS2SJUGKxXf13Hz3wV3WsvYpCTUBR0Q+cBj5nf/Vm
# wAOWRH7v0Ev9buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn9NxkvaQB
# wSAJk3jN/LzAyURdXhacAQVPIk0CAwEAAaOCAeYwggHiMBAGCSsGAQQBgjcVAQQD
# AgEAMB0GA1UdDgQWBBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEEAYI3FAIE
# DB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNV
# HSMEGDAWgBTV9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBHhkVo
# dHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNSb29D
# ZXJBdXRfMjAxMC0wNi0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAC
# hj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0NlckF1
# dF8yMDEwLTA2LTIzLmNydDCBoAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEEAYI3LgMw
# gYEwPQYIKwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9QS0kvZG9j
# cy9DUFMvZGVmYXVsdC5odG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcAYQBsAF8A
# UABvAGwAaQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZIhvcNAQEL
# BQADggIBAAfmiFEN4sbgmD+BcQM9naOhIW+z66bM9TG+zwXiqf76V20ZMLPCxWbJ
# at/15/B4vceoniXj+bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX/1z5Xhc1
# mCRWS3TvQhDIr79/xn/yN31aPxzymXlKkVIArzgPF/UveYFl2am1a+THzvbKegBv
# SzBEJCI8z+0DpZaPWSm8tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnxzplmkIz/
# amJ/3cVKC5Em4jnsGUpxY517IW3DnKOiPPp/fZZqkHimbdLhnPkd/DjYlPTGpQqW
# hqS9nhquBEKDuLWAmyI4ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kWumGnEcua
# 2A5HmoDF0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/nMQekkzr3ZUd46Pio
# SKv33nJ+YWtvd6mBy6cJrDm77MbL2IK0cs0d9LiFAR6A+xuJKlQ5slvayA1VmXqH
# czsI5pgt6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnPGUFN4Ib5KpqjEWYw
# 07t0MkvfY3v1mYovG8chr1m1rtxEPJdQcdeh0sVV42neV8HR3jDA/czmTfsNv11P
# 6Z0eGTgvvM9YBS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkSoYICzjCCAjcC
# AQEwgfihgdCkgc0wgcoxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9u
# MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
# b24xJTAjBgNVBAsTHE1pY3Jvc29mdCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNV
# BAsTHVRoYWxlcyBUU1MgRVNOOjdCRjEtRTNFQS1CODA4MSUwIwYDVQQDExxNaWNy
# b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQDUL0SWtlr8
# GKpK0dgWAw6LEl5JDKCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
# YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
# Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
# MDEwMA0GCSqGSIb3DQEBBQUAAgUA4uvCJTAiGA8yMDIwMDgyMzAwMTExN1oYDzIw
# MjAwODI0MDAxMTE3WjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi68IlAgEAMAoC
# AQACAhB+AgH/MAcCAQACAhGVMAoCBQDi7ROlAgEAMDYGCisGAQQBhFkKBAIxKDAm
# MAwGCisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcN
# AQEFBQADgYEAJ7oIxG51P2GnLAqIvRIWRxH4d6e07+8+9Yo8KNPio+RC5C4ikWPk
# oBnnULulDNEoyYjQaLHozx/hcVrobCgfdpgsEnp7HO0vdPLK4MYaEt6dm9KZkW4J
# uwjtwtR7mfu6zJw8YUhq9FQf3PAhn2Y8Q8vxew7uyExB5YIs+6zAZYwxggMNMIID
# CQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
# A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYw
# JAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAAR9OJc2s
# CvS4HwAAAAABHzANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqG
# SIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCByo2dpeWuNKVYtJ90bcjS2/h0CDJOr
# nwPz0i9h1eJG0DCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0EIKqlcPcAW3/5
# O//TcVjn49HhCC0nJgcjRNV+31bBPoOlMIGYMIGApH4wfDELMAkGA1UEBhMCVVMx
# EzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
# FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
# U3RhbXAgUENBIDIwMTACEzMAAAEfTiXNrAr0uB8AAAAAAR8wIgQgC2g1hBrEq+E8
# Mo1U+fMwG2XEPcAvZOC+iIXCQ91FGJAwDQYJKoZIhvcNAQELBQAEggEAfCG8yz1L
# OZU2Qi2V+u2HhQLAj3Ze5WYpGCXREmQ9YGuusJAoUsSCwBsTkWf6pMZag4eltsQi
# Pu3n+GUWgAuJ1m5KE1AP8S2p3uAY4xXFEK8VSBK5ggqcLOtNQDQF0CgZHkPOPno4
# pY+ijN3OTa9QHNBCjjhDcy101B6utlmENqAhg1DFS2WFlHqjRzpFPsJMGn/UNWV4
# /yXcqkYhd6awXsO7rwnAXfmRIJYr3f0px9B9WYUsb9LN23QT59m+fB2qWdpvamFY
# VND0po3Z9F1zfzybv8MMs3KSIfYLN+gsUILixgETrVhEdCRKA6KNxi8oIGXr0MdM
# TNqlEDnJSzJo3Q==
# SIG # End signature block
