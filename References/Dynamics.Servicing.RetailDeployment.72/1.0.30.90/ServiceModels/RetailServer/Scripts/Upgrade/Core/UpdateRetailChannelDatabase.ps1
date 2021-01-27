<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

<#
.SYNOPSIS
    Updates Retail Channel database deployment on local or SQL Azure instance.

.DESCRIPTION
    This script provides a mechanism to update existing Retail Channel database deployment.

.EXAMPLE 
    .\UpdateRetailChannelDatabase.ps1
#>

$ErrorActionPreference = 'Stop'

function Run-DatabaseUpgrade(
    $ScriptDir = (Throw 'ScriptDir parameter required'),
    $server = (Throw 'server parameter required'),
    $database = (Throw 'database parameter required'),
    $SqlUserName = (Throw 'SqlUserName parameter required'),
    $SqlUserPassword = (Throw 'SqlUserPassword parameter required'),
    [ValidateSet("ChannelDB", "Customizations")][string]$DeploymentType)
{
    # Get channel database settings and topology xml files.
    $updatePackageRootDir = (Split-Path (Split-Path (Split-Path $ScriptDir -Parent) -Parent) -Parent)
    $dbScriptDirPath = Join-Path $updatePackageRootDir 'Scripts'
    $dbDeploymentAssetsPath = Join-Path $updatePackageRootDir 'Data'
    
    $ChannelDatabaseBaselineScriptPath = Join-Path $dbDeploymentAssetsPath 'CommerceRuntimeScripts_Create.sql'
    
    # ChannelDatabaseBaselineScriptPath should not be set for customization package.
    if(!(Test-Path -Path $ChannelDatabaseBaselineScriptPath))
    {
        $ChannelDatabaseBaselineScriptPath = ''
    }
    
    $ChannelDatabaseUpgradeCustomScriptFolderPath = Join-Path $dbDeploymentAssetsPath 'Upgrade\Custom'
    $ChannelDatabaseUpgradeRetailScriptFolderPath = Join-Path $dbDeploymentAssetsPath 'Upgrade\Retail'

    $dbSettingsXmlFileName = Join-Path $dbScriptDirPath 'channeldb-settings-cloud.xml'
    $dbTopologyXmlFileName = Join-Path $dbScriptDirPath 'channeldb-topology-cloud.xml'
    $dbUpdatedSettingsXmlFileName = Join-Path $dbScriptDirPath 'channeldb-settings-updated.xml'
    
    $deploymentTypeDescription =  "Retail Channel database."

    if($DeploymentType -ieq "Customizations")
    {
        $deploymentTypeDescription =  "customizations for Retail Channel database."
    }

    Write-Log ("Trying to upgrade " + $deploymentTypeDescription) -logFile $logFile
    
    Invoke-Script -scriptBlock `
    {
        & (Join-Path $dbScriptDirPath 'Setup-SettingsForDatabaseDeployment.ps1') `
                                -channelDatabaseServerName $server `
                                -channelDatabaseName $database `
                                -SqlUserName $SqlUserName `
                                -ChannelDatabaseBaselineScriptPath $ChannelDatabaseBaselineScriptPath `
                                -ChannelDatabaseUpgradeCustomScriptFolderPath $ChannelDatabaseUpgradeCustomScriptFolderPath `
                                -ChannelDatabaseUpgradeDacpacFileFolderPath $dbDeploymentAssetsPath `
                                -ChannelDatabaseUpgradeRetailScriptFolderPath $ChannelDatabaseUpgradeRetailScriptFolderPath `
                                -SettingsXmlFilePathInput $dbSettingsXmlFileName `
                                -SettingsXmlFilePathOutput $dbUpdatedSettingsXmlFileName
    }

    $credentials = New-Object System.Management.Automation.PSCredential($SqlUserName, (ConvertTo-SecureString $SqlUserPassword -AsPlainText -Force))

    Invoke-Script -scriptBlock `
    {
        & (Join-Path $dbScriptDirPath 'Deploy-Databases.ps1') `
                                -TopologyXmlFilePath $dbTopologyXmlFileName `
                                -SettingsXmlFilePath $dbUpdatedSettingsXmlFileName `
                                -Credentials $credentials `
                                -Verbose $True `
                                -DeploymentType $DeploymentType
    }

    Write-Log ("Finished upgrading " + $deploymentTypeDescription) -logFile $logFile

    if($DeploymentType -ieq "ChannelDB")
    {
        Log-TimedMessage 'Update roles for retail database users.'
        Set-RolesForCloudRetailChannelDatabase `
                                -server $server `
                                -database $database `
                                -Credentials $credentials
        Log-TimedMessage 'Finished updating roles for retail database users.'
    }
}

# This function will not throw an exception if the path does not exist.
function Get-UnResolvedPath(
    [ValidateNotNullOrEmpty()][string]$path)
{
    return $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($path)
}

function Backup-Customizations()
{
    Log-TimedMessage "Trying to backup channel database customization assets."

    # Go to RetailServer folder in the package structure (Go up 3 levels from UpdateRetailChannelDatabase.ps1 script.).
    $componentDir = (Split-Path (Split-Path (Split-Path $ScriptDir -Parent) -Parent) -Parent)
    $customizationAssetFolder = [io.path]::combine( $componentDir, 'Data', 'Upgrade', 'Custom')
    $customizedInstallationInfoFilePath = Get-CustomizedInstallationInfoFilePath -scriptDir $ScriptDir

    # Customizations will be copied to the data/Custom folder under RetailServer.
    $customizationUpdateBackupRoot = Get-UnResolvedPath([io.path]::combine((Split-Path $webSitePhysicalPath -Parent), 'Data', 'Custom', 'Backups'))
    $customUpdateVersion = Get-Date -UFormat "%Y-%m-%d_%H-%M-%S"
    $customizationUpdateBackupFolder = Get-UnResolvedPath(Join-Path $customizationUpdateBackupRoot "$customUpdateVersion")
    
    if(!(Test-Path $customizationAssetFolder))
    {
        Log-TimedWarning "$customizationAssetFolder does not exist. This likely means that there are no database customizations in this package. Backup of channel database customization assets will be skipped."
        return
    }

    if(Test-Path $customizationUpdateBackupFolder)
    {
        throw "$customizationUpdateBackupFolder already exists. Customizations cannot be backed up. This should never happen as the timestamp on the folder name is accurate to the second. This is likely caused by a bug in update scripts."
    }

    Log-TimedMessage "$customizationAssetFolder will be stored at $customizationUpdateBackupFolder in the file system to support upgrade scenarios"

    # Robocopy options used: 
    # /e Copies subdirectories including empty ones.
    # /njs Specifies that there is no job summary.
    # /ndl 	Specifies that directory names are not to be logged.
    # /np Specifies that the progress of the copying operation will not be displayed.
    # /njh Specifies that there is no job header.
    Copy-Files -SourceDirPath $customizationAssetFolder -DestinationDirPath $customizationUpdateBackupFolder -FilesToCopy '*' -RobocopyOptions '/e /njs /ndl /np /njh'

    if($customizedInstallationInfoFilePath -and (Test-Path $customizedInstallationInfoFilePath))
    {
        Log-TimedMessage "$customizedInstallationInfoFilePath will be stored at $customizationUpdateBackupFolder"
        Copy-Item -Path $customizedInstallationInfoFilePath -Destination $customizationUpdateBackupFolder
        Log-TimedMessage "$customizedInstallationInfoFilePath successfully stored at $customizationUpdateBackupFolder"
    }
    else
    {
        # This file is only added to the directory to aid traceability. So don't fail if it is not found.
        Log-TimedWarning "$customizedInstallationInfoFilePath does not exist. The package is likely not built correctly."
    }

    Log-TimedMessage "Finished backing up channel database customization assets to folder $customizationUpdateBackupFolder"
}

function Backup-ChannelDatabaseDacpac()
{
    Log-TimedMessage "Trying to backup channel database bacpac."

    # Go to RetailServer folder in the package structure (Go up 3 levels from UpdateRetailChannelDatabase.ps1 script.).
    $componentDir = (Split-Path (Split-Path (Split-Path $ScriptDir -Parent) -Parent) -Parent)
    $databaseUpdateAssetFolder = (Join-Path $componentDir 'Data')
    $installationInfoFilePath = Get-InstallationInfoFilePath -scriptDir $ScriptDir
    $installationInfo = [xml](Get-Content $installationInfoFilePath)
    $updateVersion = $installationInfo.ServiceModelInstallationInfo.Version

    # Capture the dacpac that has been deployed to this environment.
    Log-TimedMessage "Retail Channel database assets will be backed up for package version $updateVersion"
    
    # Dacpac will be copied to the data folder under RetailServer.
    $databaseUpdateBackupRoot = Get-UnResolvedPath(Join-Path (Split-Path $webSitePhysicalPath -Parent) 'Data')
    $databaseUpdateBackupFolder = Get-UnResolvedPath(Join-Path $databaseUpdateBackupRoot "$updateVersion")
    $databaseUpdatedVersions = Get-UnResolvedPath(Join-Path $databaseUpdateBackupRoot 'Version.txt')
    
    if (Test-Path $databaseUpdatedVersions)
    {
        $currentVersion = [Version](Get-Content $databaseUpdatedVersions)
    }
    else
    {
        $currentVersion = [Version]"0.0.0.0"
    }

    Log-TimedMessage "Current version of channel database assets stored in the file system is $currentVersion (as defined in $databaseUpdatedVersions)"

    if ($updateVersion -gt $currentVersion)
    {
        Log-TimedMessage "Current version of channel database assets ($currentVersion) is less or equal to what is being updated to ($updateVersion). Storing of updated assets will continue"

        $updateDacpacPath = Join-Path $databaseUpdateAssetFolder "CommerceRuntimeScripts.dacpac"
        $updateAssetsFound = Test-Path $updateDacpacPath

        if(!$updateAssetsFound)
        {
            Log-TimedWarning "$updateDacpacPath does not exist. This likely means this is a customization-only deployable package. Backup of channel database assets will be skipped."
            return
        }
    
        Log-TimedMessage "$databaseUpdateAssetFolder will be stored at $databaseUpdateBackupFolder in the file system to support upgrade scenarios"
                                
        Copy-Files -SourceDirPath $databaseUpdateAssetFolder -DestinationDirPath $databaseUpdateBackupFolder -FilesToCopy '*' -RobocopyOptions '/S /njs /ndl /np /njh /XD ext'
        Out-File -FilePath $databaseUpdatedVersions -InputObject $updateVersion
        Log-TimedMessage "Finished backing up Retail Channel database assets to folder $databaseUpdateBackupFolder"
    }
    else
    {
        # write message we are not doing anything.
        Log-TimedWarning "Current version of channel database assets ($currentVersion) is greater or equal than what is being updated to ($updateVersion). Storing of updated assets will NOT continue. The deployable package was likely rerun or you tried to update the system to an older version."
    }
}

function Upgrade-RetailChannelDatabase(
    [ValidateNotNullOrEmpty()][string]$scriptDir,
    [ValidateNotNullOrEmpty()][string]$AosWebsiteName,
    [ValidateNotNullOrEmpty()][string]$retailServerWebConfigPath,
    [ValidateNotNullOrEmpty()][bool]$IsMicrosoftDatabaseUpgrade,
    [ValidateSet("ChannelDB", "Customizations")][string]$DeploymentType)
{
    $websiteConnectionStringSettings = Get-ServicingInformation -AosWebsiteName $AosWebsiteName -retailServerWebConfigPath $retailServerWebConfigPath -isMicrosoftPackage ($DeploymentType -ieq "ChannelDB") -MigrateIfNeeded

    if($websiteConnectionStringSettings)
    {
        foreach($websiteConnectionStringSetting in $websiteConnectionStringSettings)
        {
            $dbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSetting

            # Upgrade the database
            Run-DatabaseUpgrade -ScriptDir $scriptDir -server $dbSetting.server -database $dbSetting.database -SqlUserName $dbSetting.sqlUserName -SqlUserPassword $dbSetting.sqlUserPassword -DeploymentType $DeploymentType
        }
    }
    else
    {
        throw 'Failed to locate channel database servicing information. In-place update or deployment of customizations of Dynamics AX on a locally deployed VHD is not supported at this time. You may use an LCS deployed developer topology for development scenarios.'
    }
}

try
{
    $ScriptDir = Split-Path -parent $MyInvocation.MyCommand.Path
    . (Join-Path $ScriptDir 'Common-Configuration.ps1')
    . (Join-Path $ScriptDir 'Common-Database.ps1')
    . (Join-Path $ScriptDir 'Common-Upgrade.ps1')

    $RetailServerWebSiteName = 'RetailServer'
    $AosWebsiteName = 'AOSService'

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
    
    # Get the package type
    $isMicrosoftOnlyPackage = Check-IfUpdatePackageIsReleasedByMicrosoft -installationInfoXml $installationInfoFile

    # decrypt retail server web.config with Microsoft.Dynamics.AX.Framework.ConfigEncryptor.exe
    Decrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $webConfigPath

    # Run channel database upgrade
    Log-TimedMessage 'Begin upgrading Retail Channel database'

    # Always run upgrade for Microsoft scripts to accomodate merged packages.
    Upgrade-RetailChannelDatabase -scriptDir $scriptDir -AosWebsiteName $AosWebsiteName -retailServerWebConfigPath $webConfigPath -DeploymentType "ChannelDB"

    # Run upgrade for customizations if the package is not Microsoft only.
    if(!$isMicrosoftOnlyPackage)
    {
        Upgrade-RetailChannelDatabase -scriptDir $scriptDir -AosWebsiteName $AosWebsiteName -retailServerWebConfigPath $webConfigPath -DeploymentType "Customizations"
    }

    Log-TimedMessage 'Finished upgrading Retail Channel database'

    Backup-ChannelDatabaseDacpac
    Backup-Customizations
}
catch
{
    Log-Error ($global:error[0] | format-list * -f | Out-String)
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine
    $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: {0} Value: {1}{2}" -f $_.ToString(), $PSBoundParameters[$_.ToString()], [System.Environment]::NewLine}
    Write-Host ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine)
    throw ($global:error[0] | format-list * -f | Out-String)
}
finally
{
    Encrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $webConfigPath
}
# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAeYjEVeWZn6jZv
# FdxctQng4TwfC476qWFfBMHIcfi4laCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# cVZOSEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFeEwghXdAgEBMIGVMH4x
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01p
# Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAAGIr1LWuZJt6PkAAAAA
# AYgwDQYJYIZIAWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEE
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCCQ
# n5J/TnJ2GKWDuF3LIamqKDqOh2H24vkDRVaoMifGtjCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBO
# mM9+BZDQmhKvpimoQGjbV+1FGWXt3lSghXfkqokPN5M39TrZBg0hErr3mbVcpv2D
# az5CR894LfzlSVq5205TqvCeOqeQsirtg5KLu6rLHzoY5pg1XKKz/nCNbpiA0SBZ
# WgFKuB9tmhhLkORpcNk5n4vTwl7WRnp/3OG4d+w3e+O6a8yoha1Abc3x2L2++juP
# xbLFDf69dcOy7ZQf12o9bPYMLA2k+h0L/DOm+wLuiqL8RnZe5EsEqSuDaug23yyG
# 4cPZ+VL1H4wpiZ0aEi1OnnSnxWozLwFc4rTMvn1tI5DzsTv21uKJURmFcYgzbb8y
# Y7x/mL9aJ6oL6MnhVyNboYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# II8X5OkgJYFGfN4WtkkBTDkbfJcA4a3NFKZ3qcujlFDzAgZfO+WManoYEzIwMjAw
# ODIzMDQwMjQ5LjczOVowBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25z
# IFB1ZXJ0byBSaWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo3ODgwLUUzOTAt
# ODAxNDElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaCCDkQw
# ggT1MIID3aADAgECAhMzAAABKKAOgeE21U/CAAAAAAEoMA0GCSqGSIb3DQEBCwUA
# MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
# ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
# HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTIxOTAxMTUwMFoX
# DTIxMDMxNzAxMTUwMFowgc4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
# dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
# YXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNv
# MSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo3ODgwLUUzOTAtODAxNDElMCMGA1UE
# AxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEB
# BQADggEPADCCAQoCggEBAJ2Rsdb3VNuGPs2/Dgpc9gt77LG0JPkD4VWTlEJLkqzn
# TJl+RoZfiOwN6iWfPu4k/kj8nwY7pvLs1OsBy494yusg4rHLwHNUJPtw1Tc54MOL
# gdcosA4Nxki73fDyqWwDtjOdk6H7kNczBPqADD6B98ot77/wSACBJIxm9qAUudqu
# S5fczCF0++aWUavDu46U3cv6HEjIdV2ZdJTUKg4WUIdTYMQXI082+qSs45WBZjcK
# 98/tIfx8uq8q8ksWF9+zUjGTFiMaKHhn7cSCoEj7E1tVmW08ISpS678WFP2+A0OQ
# waWcJKNACK+J+La7Lz2bGupCidOGz5XDewc1lD9nLPcCAwEAAaOCARswggEXMB0G
# A1UdDgQWBBSE4vKD8X61N5vUAcNOdH9QBMum8jAfBgNVHSMEGDAWgBTVYzpcijGQ
# 80N7fEYbxTNoWoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jv
# c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0w
# MS5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
# Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNy
# dDAMBgNVHRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
# CwUAA4IBAQCLX2ZHGIULgDk/iccHWUywjDyAsBHlhkmtmBp4lldwL3dNo0bXZZHi
# SZB+c2KzvPqY64BlECjS/Pqur2m9UaT1N0BeUowRHQT88wdzd94gYqKXmLDbVR8y
# eVgBkcP/JiVWbXdQzcz1ETHgWrh+uzA8BwUgAaHJw+nXYccIuDgPJM1UTeNl9R5O
# vf+6zR2E5ZI4DrIqvS4jH4QsoMPTn27AjN7VZt4amoRxMLEcQAS7vPT1JUUaRFpF
# HmkUYVln1YMsw///6968aRvy3cmClS44uxkkaILbhh1h09ejZjHhrEn+k9McVkWi
# uY724jJ/57tylM7A/jzIWNj1F8VlhkyyMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAA
# AjANBgkqhkiG9w0BAQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEyMDAGA1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0
# aG9yaXR5IDIwMTAwHhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAxMjE0NjU1WjB8MQsw
# CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
# ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
# b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDCCASIwDQYJKoZIhvcNAQEBBQADggEP
# ADCCAQoCggEBAKkdDbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX77XxoSyxfxcPl
# YcJ2tz5mK1vwFVMnBDEfQRsalR3OCROOfGEwWbEwRA/xYIiEVEMM1024OAizQt2T
# rNZzMFcmgqNFDdDq9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0ySwcSmXdFh
# E24oxhr5hoC732H8RsEnHSRnEnIaIYqvS2SJUGKxXf13Hz3wV3WsvYpCTUBR0Q+c
# Bj5nf/VmwAOWRH7v0Ev9buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn
# 9NxkvaQBwSAJk3jN/LzAyURdXhacAQVPIk0CAwEAAaOCAeYwggHiMBAGCSsGAQQB
# gjcVAQQDAgEAMB0GA1UdDgQWBBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEE
# AYI3FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB
# /zAfBgNVHSMEGDAWgBTV9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEug
# SaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
# aWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsG
# AQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jv
# b0NlckF1dF8yMDEwLTA2LTIzLmNydDCBoAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEE
# AYI3LgMwgYEwPQYIKwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9Q
# S0kvZG9jcy9DUFMvZGVmYXVsdC5odG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcA
# YQBsAF8AUABvAGwAaQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZI
# hvcNAQELBQADggIBAAfmiFEN4sbgmD+BcQM9naOhIW+z66bM9TG+zwXiqf76V20Z
# MLPCxWbJat/15/B4vceoniXj+bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX
# /1z5Xhc1mCRWS3TvQhDIr79/xn/yN31aPxzymXlKkVIArzgPF/UveYFl2am1a+TH
# zvbKegBvSzBEJCI8z+0DpZaPWSm8tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnx
# zplmkIz/amJ/3cVKC5Em4jnsGUpxY517IW3DnKOiPPp/fZZqkHimbdLhnPkd/DjY
# lPTGpQqWhqS9nhquBEKDuLWAmyI4ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kW
# umGnEcua2A5HmoDF0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/nMQekkzr3
# ZUd46PioSKv33nJ+YWtvd6mBy6cJrDm77MbL2IK0cs0d9LiFAR6A+xuJKlQ5slva
# yA1VmXqHczsI5pgt6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnPGUFN4Ib5
# KpqjEWYw07t0MkvfY3v1mYovG8chr1m1rtxEPJdQcdeh0sVV42neV8HR3jDA/czm
# TfsNv11P6Z0eGTgvvM9YBS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkSoYIC
# 0jCCAjsCAQEwgfyhgdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
# aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
# cG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1ZXJ0byBS
# aWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo3ODgwLUUzOTAtODAxNDElMCMG
# A1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIa
# AxUAMT1LG/KAEj0XsiL9n7mxmX1afZuggYMwgYCkfjB8MQswCQYDVQQGEwJVUzET
# MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
# dGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0BAQUFAAIFAOLsUqMwIhgPMjAyMDA4MjMw
# NjI3NDdaGA8yMDIwMDgyNDA2Mjc0N1owdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA
# 4uxSowIBADAKAgEAAgIQLgIB/zAHAgEAAgIRlzAKAgUA4u2kIwIBADA2BgorBgEE
# AYRZCgQCMSgwJjAMBgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYag
# MA0GCSqGSIb3DQEBBQUAA4GBAFX6QEk5BpmvOWrhYzsRYJCzVGarY8OrDigZa6zS
# lBDuTnZU9A02L2iVYPaRhfOTC/aQJAXDm7XFb/gN1NOC2qXzTp00hcaenYE1tiWx
# DiHPTXNEnQ+6ogHSJSTee3+lG5veyvO6LqI7sIiMNwfNowh/oQmZPh5HOMUj/6ej
# Ari7MYIDDTCCAwkCAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAC
# EzMAAAEooA6B4TbVT8IAAAAAASgwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQg4/+mS3hMXB2lDQR8
# MO7aFmwVwGxdbDc5aHpv4zJgI4YwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCC8RWqLrwVSd+/cGxDfBqS4b1tPXhoPFrC615vV1ugU2jCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABKKAOgeE21U/CAAAAAAEoMCIE
# IKu3LANDj6g7/byri2vOJU5Ihv3XDJ6jB6uEWzEk3FREMA0GCSqGSIb3DQEBCwUA
# BIIBAHFGEgXydmDA9gvFivTXinfWzwrYMmRMuC6a7xlkwuEJtgL/ax6GOePk+lM2
# 78BuNQWuI2Bo1UDXzlR5NvmrIAgtqEQIowHyCieSU79t+qBRttrlmFrCR/xVc8/o
# lE+QtVkXUSn5mqNf+YqTymW/f19+MtJK1YQNVjwIvTf/0QKh+KGJGkDzY0FXQcl6
# WSl9cmZlO3ji4e2NeS7TGP8G8A6w3qfcPABD7KflpWTnFz58E2/yck/hQX0qKMkv
# HUsjR7nyszS0G+3n7ikCWrqYly8DhFxhZ4sbdVXjqjSlesUu+i4woPOsrVHo7yoJ
# 58fCoO6NVOVMIouBS4OBw1/rYSo=
# SIG # End signature block
