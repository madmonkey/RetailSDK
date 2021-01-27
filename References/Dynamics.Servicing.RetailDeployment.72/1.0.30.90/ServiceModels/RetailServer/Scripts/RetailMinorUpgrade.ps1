<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

param(
    [string]$aosWebsiteName = 'AOSService',
    [string]$retailServerWebsiteName = 'RetailServer',
    [string]$retailCloudPosWebsiteName = 'RetailCloudPos',
    [string]$targetDataGroupName = 'Default',
    [string]$targetDataGroupDescription = 'Default data group',
    [string]$targetDatabaseProfileName = 'Default',
    [string]$targetRetailChannelProfileName = 'Default',
    [string]$targetRtsProfileName = 'Default',
    [string]$logFile = 'RetailMinorVersionUpgrade.log'
)

<#
.SYNOPSIS
Validates that PJOBs have been run and that the channel data has been uploaded to AX.
This function will throw an error if there is potential for data loss.

.PARAMETER server
The sql server address/name.

.PARAMETER database
The name of the collocated AX/CHANNEL database.

.PARAMETER Username
The user name to connect to the DB as.

.PARAMETER Password
The password for the username.

.PARAMETER ScriptDir
Path where the retail scripts can be found.
#>
function Validate-PJobs()
{
    param
    (
        [Parameter(Mandatory=$true)][string]$Server,
        [Parameter(Mandatory=$true)][string]$Database,
        [Parameter(Mandatory=$true)][string]$Username,
        [Parameter(Mandatory=$true)][string]$Password,
        [Parameter(Mandatory=$true)][string]$ScriptDir
    )

    # 10 minutes time out
    $queryTimeoutSeconds = 600

    # given that we can only use the DB to communicate, if there is a view in the DB with this name, we use it as a flag to skip this check
    $bypassViewName = "___RETAIL_UPGRADE_IGNORE_DATA_LOSS_CHECKS"

    Log-TimedMessage "Validate-PJobs: Initiating data loss prevention checks on channel database upload data (PJOBS)"
    Log-TimedMessage "Validate-PJobs: This check can be bypassed by creating the following view on the AXDB: 'CREATE VIEW $BYPASSVIEWNAME AS SELECT 1 AS T;'"

    Log-TimedMessage "Validate-PJobs: Checking for retail data loss validation bypass"
    $result = Invoke-SqlCmd -ServerInstance $Server -Database $Database -Username $Username -Password $Password `
      -Query "SELECT COALESCE(OBJECT_ID('$bypassViewName'), 0) AS BYPASS"

    # result should never be $null (checking for safety), if bypass is anything bug 0, then the bypass view exists and we will skip this check
    if ($result -ne $null -and $result.bypass -ne 0)
    {
        Log-TimedWarning "Validate-PJobs: Bypass for retail data loss checks was requested. No data loss checks will be performed. Data loss may occur."
        return
    }

    Log-TimedMessage "Validate-PJobs: Checking whether there are any PJOB data not uploaded on the channel side"
    $result = Invoke-SqlCmd -ServerInstance $Server -Database $Database -Username $Username -Password $Password `
      -InputFile "$ScriptDir\GetUnsynchedUploadTables.sql" -ErrorAction Stop -QueryTimeout $queryTimeoutSeconds

    # if any results exist, then there are tables not synced to AX
    if ($result -ne $null)
    {
        Log-TimedWarning "Validate-PJobs: There is data on the channel database that was not uploaded to AX. Please run CDX PJOBs and retry. The following tables are affected: $($result | Out-String)"
        throw "Data loss may occur. Upgrade was aborted. Not all channel data has been uploaded to AX. A list of affected tables was printed above. Please make sure CDX PJOBs have run successfully."
    }

    Log-TimedMessage "Validate-PJobs: Checking whether there are any upload session in AX that are in progress or failed"
    $result = Invoke-SqlCmd -ServerInstance $Server -Database $Database -Username $Username -Password $Password `
      -InputFile "$ScriptDir\GetNotAppliedUploadSessions.sql" -ErrorAction Stop -QueryTimeout $queryTimeoutSeconds

    # if any results exist, then there are jobs not ran or failed
    if ($result -ne $null)
    {
        Log-TimedWarning "Validate-PJobs: There are upload sessions in AX either currently in progress or in a failed state that need attention before upgrade. The following sessions are affected: $($result | Out-String)"
        throw "Data loss may occur. Upgrade was aborted. Some upload sessions in AX are either in progress or in a failed state. A list of affected sessions was printed above. Please make sure CDX PJOBs have run successfully."
    }

    Log-TimedMessage "Validate-PJobs: All checks passed."
}

<#
.SYNOPSIS
This function is the one that resolves the DACPAC used when upgrading the environment.

.DESCRIPTION
The data upgrade process is as follows:
   1. the old database comes from a previous (likely production) version of the product (say 7.0)
   2. that database is put in place on a newer version of the system (say 7.3, hotfixes on top of the initially deployed version is possible and needs to be supported)
   3. then this script (minor data upgrade) is run on that environment
     3.1. so the AOS/binaries on the environment is on the new version, but database [schema & data] is on the old version

We need to bring the database to the new version/environment, but the original database with the new version (and stored DACPAC) is not available anymore
(it was replaced by the old database that needs upgrade).

This minor upgrade package contains the DACPAC as of the time this package was built, which could be newer or older than the environment's version.
The environment is supposed to have a Data folder with the currently deployed channel DB version under the Retail Server root folder - that's where we will
try to resolve the current channel database version and retrieve the DACPAC from. If it is not found, we will fallback to the current dacpac available here.

Additionally, a schema breaking change happened in 7.3.2 (9.2), which prevents a 7.3.0 deployed environment to work with the latest DACPAC. This function identifies
the current RS version and if possible, picks a DACPAC shipped in the data upgrade package without the breaking change (one version before the breaking change, if
RS is less than or equal to that version).

This function is the one that resolves the DACPAC used when upgrading the environment.

.PARAMETER RetailServerRootPath
The path to the ROOT of the retail server (the one where the web.config and bin folder are).

.PARAMETER ScriptRootPath
The path to the ROOT of this package script folder.

.OUTPUTS
The path of the folder containing the DACPAC or $null if the DACPAC from the minor upgrade package should be used.
#>
function Resolve-ChannelDatabaseDacpacPath()
{
    param
    (
        [Parameter(Mandatory=$true)]
        [string]$RetailServerRootPath,
        [Parameter(Mandatory=$true)]
        [string]$ScriptRootPath
    )

    # get the latest applied dacpac to the environment
    # hotfixes (Due to splitstream) should be storing the deployed DACPACs on the file system
    # the following function know how to resolve the latest applied DACPAC during servicing
    $currentDeployedDacpacPath = Resolve-CurrentlyDeployedChannelDatabaseDacpacPath -retailServerRootPath $retailServerRootPath

    if ([String]::IsNullOrWhitespace($currentDeployedDacpacPath))
    {
        Log-TimedMessage "Resolve-ChannelDatabaseDacpacPath - no dacpac folder was resolved as being the currently deployed DACPAC for this environment. The DACPAC in this data upgrade package will be used instead."

        $retailServerVersion = $noVersion = [Version]"0.0.0.0"

        # resolve Retail Server version
        $retailServerCoreDllPath = Join-Path $retailServerRootPath "bin\Microsoft.Dynamics.Retail.RetailServer.dll"
        if (Test-Path $retailServerCoreDllPath)
        {
            $retailServerCoreDllPath = Resolve-Path $retailServerCoreDllPath
            try
            {
                $retailServerVersion = [Version][System.Diagnostics.FileVersionInfo]::GetVersionInfo($retailServerCoreDllPath).FileVersion
            }
            catch
            {
                Log-TimedWarning "Resolve-ChannelDatabaseDacpacPath - it was not possible to resolve Retail Server version. $_"
            }
        }
        else
        {
            Log-TimedWarning "Resolve-ChannelDatabaseDacpacPath - $retailServerCoreDllPath does not exist. It was not possible to resolve RS version"
        }

        Log-TimedMessage "Resolve-ChannelDatabaseDacpacPath - resolved Retail server version is $retailServerVersion"

        # on version 9.2.18044.4 there was a breaking change that prevents the use of the latest DACPAC
        # thus if the version is less than 9.2.18044.4 we use the latest DACPAC before change, otherwise we use the latest available in this package
        $breakingChangeVersion = [Version]"9.2.18044.4"
        if ($retailServerVersion -lt $breakingChangeVersion)
        {
            # version below is the previous build of 9.2.18044.4
            $previousVersionBeforeBreakingChange = [Version]"9.2.18044.1"

            Log-TimedMessage "Resolve-ChannelDatabaseDacpacPath - current RS version ($retailServerVersion) is older than channel database version containing a breaking change ($breakingChangeVersion). A DACPAC without the breaking change ($previousVersionBeforeBreakingChange) will be prefered, if available."

            # check if dacpac that works around breaking version is available
            $previousVersionDataPath = Join-Path $scriptRootPath "..\Data\Upgrade\Retail\$previousVersionBeforeBreakingChange"
            if (Test-Path $previousVersionDataPath)
            {
                $previousVersionDataPath = Resolve-Path $previousVersionDataPath
                Log-TimedMessage "Resolve-ChannelDatabaseDacpacPath - DACPAC without breaking change available at $previousVersionDataPath and will be used."
                return $previousVersionDataPath
            }
            else
            {
                Log-TimedWarning "Resolve-ChannelDatabaseDacpacPath - DACPAC without breaking change is not available at $previousVersionDataPath. Latest DACPAC will be used. A runtime error during sales transaction operations may occur. In such case, applying the latest Retail binary hotfix is recommended."
                return $null
            }
        }
        else
        {
            Log-TimedMessage "Resolve-ChannelDatabaseDacpacPath - no special DACPAC version is required for this retail server. Latest DACPAC available in this upgrade package will be used."
            return $null
        }
    }
    else
    {
        Log-TimedMessage "Resolve-ChannelDatabaseDacpacPath - a DACPAC for this environment's version was found at $currentDeployedDacpacPath and will be used."
        return $currentDeployedDacpacPath
    }

    return $null
}

<#
.SYNOPSIS
This function gets the DACPAC stored in the filesystem for the latest RS/ChannelDB hotfix applied.

.PARAMETER retailServerRootPath
The path to the ROOT of the retail server (the one where the web.config and bin folder are).

.OUTPUTS
The path of the folder containing the DACPAC or $null if not found.
#>
function Resolve-CurrentlyDeployedChannelDatabaseDacpacPath()
{
    param
    (
        [Parameter(Mandatory=$true)]
        [string]$RetailServerRootPath
    )

    $defaultFallbackMessage = "The DACPAC from this minor upgrade package will be used to deploy/update the channel database."

    $retailServerRootParent = (Get-Item $retailServerRootPath).Parent.FullName
    $retailServerRootParent = Resolve-Path $retailServerRootParent
    $dataFolder = Join-Path $retailServerRootParent 'Data'

    if (-not (Test-Path $dataFolder))
    {
        Log-TimedWarning "Resolve-CurrentlyDeployedChannelDatabaseDacpacPath - $dataFolder does not exist. There is no DACPACs stored in the filesystem to be used. $defaultFallbackMessage"
        return $null
    }

    $versionFilePath = Join-Path $dataFolder "version.txt"

    if (-not (Test-Path $versionFilePath))
    {
        Log-TimedWarning "Resolve-CurrentlyDeployedChannelDatabaseDacpacPath - $versionFilePath does not exist. The version for the currently deployed DACPAC before upgrade is unknown. $defaultFallbackMessage"
        return $null
    }

    $currentDatabaseVersion = [Version](Get-Content $versionFilePath)
    Log-TimedMessage "Resolve-CurrentlyDeployedChannelDatabaseDacpacPath - The current deployed database version (before minor upgrade) is $currentDatabaseVersion (this was defined at $versionFilePath)"

    $versionDataFolder = Join-Path $dataFolder $currentDatabaseVersion
    Log-TimedMessage "Resolve-CurrentlyDeployedChannelDatabaseDacpacPath - Trying to resolve path $versionDataFolder"

    if (-not (Test-Path $versionDataFolder))
    {
        Log-TimedWarning "Resolve-CurrentlyDeployedChannelDatabaseDacpacPath - $versionDataFolder does not exist. Either the version defined in $versionFilePath is incorrect or the folder for that version is missing. $defaultFallbackMessage"
        return $null
    }

    #return the data folder based off the version previously deployed
    $versionDataFolder
}

<#
.SYNOPSIS
This function merges the customization script files to be applied during minor upgrade.

.PARAMETER retailServerRootPath
The path to the ROOT of the retail server (the one where the web.config and bin folder are).

.OUTPUTS
The path of the folder containing the merged customizations or $null if no customizations are backed up on the filesystem.
#>
function Get-MergedDatabaseCustomizations()
{
    param
    (
        [Parameter(Mandatory=$true)]
        [string]$RetailServerRootPath
    )

    Log-TimedMessage "Merging customizations for Minor upgrade."

    $backupFolderRelativePath = [System.IO.Path]::combine( $componentDir, 'Data', 'Custom', 'Backups')
    $defaultFallbackMessage = "Backup customizations are not available. No customizations will be applied. Customer needs apply customization package after this execution."

    $retailServerRootParent = (Get-Item $retailServerRootPath).Parent.FullName
    $retailServerRootParent = Resolve-Path $retailServerRootParent
    $backupFolder = Join-Path $retailServerRootParent $backupFolderRelativePath
    $mergedBackupPath = Join-Path (Split-Path -Path $backupFolder -Parent) (Get-Date -UFormat "Merged%Y-%m-%d_%H-%M-%S")

    if (-not (Test-Path $backupFolder))
    {
        Log-TimedWarning "Get-MergedDatabaseCustomizations - $backupFolder does not exist. $defaultFallbackMessage"
        return $null
    }

    $customizationBackups = Get-ChildItem $BackupFolder | ?{ $_.PSIsContainer }

    if($customizationBackups.Length -eq 0)
    {
        Log-TimedWarning "Get-MergedDatabaseCustomizations - There are no backups in $backupFolder. $defaultFallbackMessage"
        return $null
    }

    Log-TimedMessage "Merging customizations to folder $mergedBackupPath."

    if(Test-Path $mergedBackupPath)
    {
        throw "$mergedBackupPath already exists. Customizations cannot be merged. This should never happen as the timestamp on the folder name is accurate to the second. This is likely caused by a bug in update scripts."
    }

    # During database upgrade, if a script with the same file name is applied, the script is skipped.
    # To create a merged customization scripts folder, we copy all scripts in chronological order with no replace.
    # /xc excludes changed files. /xn excludes newer files./xo excludes older files. Used together, these options copy files with no replace.
    # /e Copies subdirectories including empty ones.
    # /xf *.XML *.TXT excludes *.XML and *.TXT files.
    # We can have problems with this approach if there are 2 scripts with same name, in 2 different backups, but in different sub folders.
    # For example if there are 2 backup folders Backup1 and Backup2  and there are two sql files in those at paths Backup1\script\1.sql and Backup1\customScript\1.sql the scripts will not be applied in a deterministic order.
    $customizationBackups |  ForEach-Object {$_.FullName} | Sort-Object | ForEach-Object -Process { Copy-Files -SourceDirPath $_ -DestinationDirPath $mergedBackupPath -RobocopyOptions "/xc /xn /xo /e /xf *.XML *.TXT" }
    Log-TimedMessage "Successfully merged customizations."

    return $mergedBackupPath
}

<#
.SYNOPSIS
This function gets the version of the deployed channel.

.PARAMETER SqlServerInstanceName
The SQL server instance name.

.PARAMETER DatabaseName
The SQL server database name.

.PARAMETER UserName
The username for accessing the SQL server.

.PARAMETER Password
The password for accessing the SQL server.

.OUTPUTS
The version of the deployed channel database. If the schema is not already present on the database, it will return $null.
#>
function Get-DatabaseVersionNumber(
    [string]$SqlServerInstanceName = $(Throw 'SqlServerInstanceName parameter required'),
    [string]$DatabaseName = $(Throw 'DatabaseName parameter required'),
    [string]$UserName,
    [string]$Password)
{

	$tableVerificationQuery = "SELECT COL_LENGTH('[ax].[DBVERSION]', 'VERSIONSTRING') AS COLUMNLENGTH"
	$tableVerificationResult = Invoke-SqlCmd -ServerInstance $SqlServerInstanceName -Database  $DatabaseName -Username $UserName -Password $Password -Query $tableVerificationQuery -ErrorAction Stop

	if(!$tableVerificationResult -Or ($tableVerificationResult.COLUMNLENGTH -eq [DBNull]::Value))
	{
		Log-TimedWarning "The table [ax].[DBVERSION] does not exist or the VERSIONSTRING column does not exist in the table. This likely means that the channel database schema has been deleted from the database or the database is in an inconsistent state."
		return $null
	}

    $versionQuery = "SELECT TOP 1 VERSIONSTRING FROM [ax].[DBVERSION] WHERE VERSIONTYPE='databaseVersion'"
    $versionresult = Invoke-SqlCmd -ServerInstance $SqlServerInstanceName -Database  $DatabaseName -Username $UserName -Password $Password -Query $versionQuery -ErrorAction Stop

	if(!$versionresult)
	{
		throw "[ax].[DBVERSION] does not have any data. The channel database version caould not be determined."
	}

    return [version]$versionresult.VERSIONSTRING
}

<#
.SYNOPSIS
Sets the RetailServiceAccount as a system account if possible.

.PARAMETER SqlServerInstanceName
The SQL server instance name.

.PARAMETER DatabaseName
The SQL server database name.

.PARAMETER UserName
The username for accessing the SQL server.

.PARAMETER Password
The password for accessing the SQL server.

.OUTPUTS
The version of the deployed channel database. If the schema is not already present on the database, it will return $null.
#>
function Set-RetailServiceAccountAsSystemAccount(
    [string]$SqlServerInstanceName = $(Throw 'SqlServerInstanceName parameter required'),
    [string]$DatabaseName = $(Throw 'DatabaseName parameter required'),
    [string]$UserName,
    [string]$Password)
{
    $setSystemAccountQuery = @"
    SET NOCOUNT ON
    DECLARE @RETAILSERVICEACCOUNT VARCHAR(100);
    SET @RETAILSERVICEACCOUNT = 'RetailServiceAccount';

    IF EXISTS(SELECT 1 FROM SYS.COLUMNS WHERE NAME = N'ISMICROSOFTACCOUNT' AND OBJECT_ID = OBJECT_ID(N'DBO.USERINFO'))
    BEGIN
        PRINT 'SETTING ISMICROSOFTACCOUNT TO 1 FOR ' + @RETAILSERVICEACCOUNT
        EXEC('UPDATE USERINFO SET ISMICROSOFTACCOUNT = 1 WHERE ID = ''' + @RETAILSERVICEACCOUNT + '''')
        SELECT 1
        PRINT @RETAILSERVICEACCOUNT + ' IS NOW A SYSTEM ACCOUNT'
    END
    ELSE
    BEGIN
        PRINT 'ISMICROSOFTACCOUNT IS NOT AVAILABLE IN THIS ENVIRONMENT. PLEASE HAVE THE CUSTOMER UPDATE TO THE LASTEST PLATFORM VERSION AVAILABLE.'
    END
"@
	$result = Invoke-SqlCmd -ServerInstance $SqlServerInstanceName -Database  $DatabaseName -Username $UserName -Password $Password -Query $setSystemAccountQuery -ErrorAction Stop

	if(!$result)
	{
		Log-TimedWarning "USERINFO.ISMICROSOFTACCOUNT column does not exist. It was not possible to set ISMICROSOFTACCOUNT for RetailSystemAccount user. If this step fails, please see https://dynamics.wiki/index.php/Retail_TSG_-_Deployment_-_RetailServiceAccount_is_in_violation_of_segregation_of_duties"
    }
    else
    {
        Log-TimedMessage "ISMICROSOFTACCOUNT set for RetailSystemAccount user"
    }
}

$axBatchServiceStartTypeSnapshot = $null
$currentLocationSnapshot = Get-Location
try
{
    $ErrorActionPreference = 'Stop'

    $scriptDir = Split-Path -parent $PSCommandPath
    $rootDir = Split-Path -parent $scriptDir

    . "$scriptDir\Common-Configuration.ps1"
    . "$scriptDir\Common-Web.ps1"
    . "$scriptDir\Common-Upgrade.ps1"

    Import-Module (Join-Path -Path $scriptDir -ChildPath 'Common-Servicing.psm1') -DisableNameChecking
    Import-Module (Join-Path -Path $scriptDir -ChildPath 'CommonRollbackUtilities.psm1') -DisableNameChecking
    Import-Module (Join-Path -Path $scriptDir -ChildPath 'SelfServiceConfiguration.psm1') -DisableNameChecking

    Log-TimedMessage "Minor version Upgrade: Updating Retail environment data..."

    # resolve path that may not exist
    $logFile = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($logFile)
    Log-TimedMessage "Minor version Upgrade log file: $logFile"

    $retailServerWebSite = Get-WebSiteSafe -Name $retailServerWebsiteName

    if($retailServerWebSite -eq $null)
    {
        throw "$retailServerWebsiteName doesn't exist."
    }

    Decrypt-WebConfigSection -webConfigSection "connectionStrings" -websiteId $retailServerWebSite.Id -logFile $logFile

    $retailServerWebsitePhysicalPath = $retailServerWebSite.physicalPath
    $retailServerWebConfigFilePath = (Join-Path $retailServerWebsitePhysicalPath 'web.config')
    Decrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigFilePath

    [xml]$retailServerWebConfigDoc = Get-Content -Path $retailServerWebConfigFilePath

    $IsDbCredentialInWebConfig = Get-UseDatabaseCredentialInWebConfigForUpgrade
    if($IsDbCredentialInWebConfig)
    {
        Write-Output "Servicing information has been migrated to web.config, extract it from web.config"
        $websiteConnectionStringSettings = Get-AxDatabaseUserFromWebConfig -webConfig $retailServerWebConfigDoc -dbUserKey 'DataAccess.AxAdminSqlUser' -dbUserPasswordKey 'DataAccess.AxAdminSqlPwd'
        $deployDbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSettings

        # Check existence of axdeployextuser, if not present, fall back to use axdeployuser as replacement.
        $appSettingSqlUserElement = $retailServerWebConfigDoc.SelectSingleNode("/configuration/appSettings/add[@key='DataAccess.SqlUser']")

        if($appSettingSqlUserElement -ne $null)
        {
            Write-Output "Information about axdeployextuser doesn't present, use axdeployuser as replacement."
            $extUserConnectionStringSettings = Get-AxDatabaseUserFromWebConfig -webConfig $retailServerWebConfigDoc -dbUserKey 'DataAccess.SqlUser' -dbUserPasswordKey 'DataAccess.SqlPwd'
            $extUserSetting = Create-WebSiteDBConfiguration -connectionString $extUserConnectionStringSettings
        }
        else
        {
            $extUserSetting = $deployDbSetting
        }
    }
    else
    {
        Write-Output "Servicing information has NOT been migrated to web.config, extract it from registry"
        try
        {
            $websiteConnectionStringSettings = (Get-ChannelDbServicingDataFromRegistry)
            $deployDbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSettings

            # Check existence of axdeployextuser, if not present, fall back to use axdeployuser as replacement.
            if(Test-Path -Path Get-ChannelDbExtUserRegistryPath)
            {
                Write-Output "Information about axdeployextuser doesn't present, use axdeployuser as replacement."
               $extUserConnectionStringSettings = Get-ServicingDataFromRegistry -registryPath (Get-ChannelDbExtUserRegistryPath)
               $extUserSetting = Create-WebSiteDBConfiguration -connectionString $extUserConnectionStringSettings
            }
            else
            {
               $extUserSetting = $deployDbSetting
            }

            Write-Output "Migrating servicing information from registry to web.config."
            Update-ChannelDatabaseConfigLocation -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigFilePath
        }
        catch
        {
            # log detailed error message for trouble shooting.
            Log-TimedMessage ($global:error[0] | format-list * -f | Out-String)
            $ScriptLine = $MyInvocation.MyCommand.Path.ToString()
            $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: $($_.ToString()) Value: $($PSBoundParameters[$_.ToString()])"}
            Log-TimedMessage "Executed:$([System.Environment]::NewLine)$ScriptLine$([System.Environment]::NewLine)Exiting with error code $exitCode."

            throw "Retail servicing data in registry is corrupted, please update it and try again. Detail instructions is avaiable here: https://microsoft.sharepoint.com/:o:/r/teams/AXServiceOps/_layouts/15/WopiFrame.aspx?sourcedoc={ae57632e-2f94-415f-ab2a-3625cdc42ca6}&action=edit&wd=target%28Troubleshooting%20Guide%2Eone%7C6301B9E7%2D0E72%2D43CF%2DB29A%2DD2F076D3F2D6%2FUpdate%20Retail%20Servicing%20Data%20for%20JIT%7CA53DADEA%2DF544%2D4ADC%2D916D%2D6EBB9A633F31%2F%29onenote%3Ahttps%3A%2F%2Fmicrosoft%2Esharepoint%2Ecom%2Fteams%2FAXServiceOps%2FShared%20Documents%2FOperations%20Handbook%2FFeature%20guide%2FRetail%2FTroubleshooting%20Guide%2Eone#Update%20Retail%20Servicing%20Data%20for%20JIT&section-id={6301B9E7-0E72-43CF-B29A-D2F076D3F2D6}&page-id={A53DADEA-F544-4ADC-916D-6EBB9A633F31}&end."
        }
    }

    $retailChannelDBConnectionString = $retailServerWebConfigDoc.SelectSingleNode("/configuration/connectionStrings/add[@name='StorageLookupDatabase']").connectionString
    $channelDbSetting = Create-WebSiteDBConfiguration -connectionString $retailChannelDBConnectionString

    [hashtable]$settings = @{}

    $settings.DataGroupName = $targetDataGroupName
    $settings.DataGroupDescription = $targetDataGroupDescription
    $settings.DatabaseProfileName = $targetDatabaseProfileName
    $settings.RetailChannelProfileName = $targetRetailChannelProfileName
    $settings.RtsProfileId = $targetRtsProfileName

    $settings.AosDatabaseServer = $deployDbSetting.server
    $settings.AosDatabaseName = $deployDbSetting.database
    $settings.AosDatabaseUser = $deployDbSetting.sqlUserName
    $settings.AosDatabasePass = $deployDbSetting.sqlUserPassword
    $settings.AosDeploymentDatabaseUser = $deployDbSetting.sqlUserName
    $settings.AosDeploymentDatabasePass = $deployDbSetting.sqlUserPassword
    $settings.ChannelDatabaseServer = $channelDbSetting.server
    $settings.ChannelDatabaseName = $channelDbSetting.database
    $settings.ChannelDatabaseUser = $channelDbSetting.sqlUserName
    $settings.ChannelDatabasePass = $channelDbSetting.sqlUserPassword
    $settings.ChannelDatabaseDataSyncUser = 'axretaildatasyncuser'
    $settings.ChannelDatabaseDataSyncPass = $channelDbSetting.sqlUserPassword
    $settings.DisableDBServerCertificateValidation = $channelDbSetting.trustservercertificate

    $settings.AxDbServer = $deployDbSetting.server
    $settings.AxDbName = $deployDbSetting.database
    $settings.AxDbDeploySqlUser = $deployDbSetting.sqlUserName
    $settings.AxDbDeploySqlPwd = $deployDbSetting.sqlUserPassword
    $settings.dbUser = $channelDbSetting.sqlUserName
    $settings.dbPassword = $channelDbSetting.sqlUserPassword
    $settings.dataSyncDbUser = 'axretaildatasyncuser'
    $settings.dataSyncDbUserPassword = $channelDbSetting.sqlUserPassword
    $settings.AxDeployExtUser = $extUserSetting.sqlUserName
    $settings.AxDeployExtUserPassword = $extUserSetting.sqlUserPassword

    $settings.EnvironmentId = $retailServerWebConfigDoc.configuration.environment.id
    $settings.TenantId = $retailServerWebConfigDoc.configuration.environment.tenant.id

    $AosSoapUrl = (Get-AosSoapUrl -aosWebsiteName $aosWebsiteName)
    $AosSoapUrl = $AosSoapUrl.trimEnd('/')
    $settings.AosWebsiteName = $aosWebsiteName
    $settings.AosSoapUrl = $AosSoapUrl
    $settings.AosUrl = (Get-AosUrl -aosWebsiteName $aosWebsiteName)
    $settings.RetailServerUrlValue = ([array](Get-WebSiteBindingUrls -websiteName $retailServerWebsiteName))[0]
    $settings.RetailServerUrl = $settings.RetailServerUrlValue
    $settings.CloudPOSUrl = (Get-WebSiteBindingUrls -websiteName $retailCloudPosWebsiteName | Select-Object -first 1 )

    Encrypt-WebConfigSection -webConfigSection "connectionStrings" -websiteId $retailServerWebSite.Id -logFile $logFile

    # Derive AOS web config file path.
    $aosWebsite = Get-WebSiteSafe -Name $aosWebsiteName
    $aosWebsitePhysicalPath = $aosWebsite.physicalPath
    $aosWebConfigFilePath = (Join-Path $aosWebsitePhysicalPath 'web.config')
    Log-TimedMessage "AOS web.config located at: $aosWebConfigFilePath"

    Log-TimedMessage "Check if the RetailServiceAccount user is indeed a system account user."
    Set-RetailServiceAccountAsSystemAccount -SqlServerInstanceName $settings.AosDatabaseServer -DatabaseName $settings.AosDatabaseName -UserName $settings.AosDatabaseUser -Password $settings.AosDatabasePass

    Log-TimedMessage "Trying to get channel database version."

	# Channel database version is greater than or equal to 7.3.0.0, the channel database schema should not be dropped. It should be dropped if the version is less than 7.3.0.0
	$databaseVersion = Get-DatabaseVersionNumber -SqlServerInstanceName $settings.AosDatabaseServer -DatabaseName $settings.AosDatabaseName -UserName $settings.AosDatabaseUser -Password $settings.AosDatabasePass
	Log-TimedMessage "The current channel database version is $databaseVersion"

	if ($databaseVersion -and $databaseVersion -ge [Version]"7.3.0.0") {
        Write-Log "$databaseVersion is greater than or equal to 7.3.0.0. Setting SkipDatabaseSchemaDeletion to true."
        $settings.SkipDatabaseSchemaDeletion = "true"

        Log-TimedMessage "Skipping the Validate-PJobs check as the database version is greater than or equal to 7.3.0.0"
    }
	else
	{
		Write-Log "Channel database version could not be retreived or is less than 7.3.0.0. Setting SkipDatabaseSchemaDeletion to false."
        $settings.SkipDatabaseSchemaDeletion = "false"

        # Validate that PJOBs have been run and are applied in AX
        Validate-PJobs -Server $settings.AosDatabaseServer -Database $settings.AosDatabaseName -Username $settings.AosDatabaseUser `
          -Password $settings.AosDatabasePass -ScriptDir $scriptDir
	}

    Configure-AxDeploymentUtility -aosWebConfigFilePath $aosWebConfigFilePath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath

    # Get file path to AX deployment setup utility and its config file.
    $AXDeploymentSetupUtilityFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath -UtilityFileName $AxDeploymentSetUpExeName
    Log-TimedMessage "$AxDeploymentSetUpExeName located at:$AXDeploymentSetupUtilityFilePath"

    $aosWebConfigContent = [xml](Get-Content -Path $aosWebConfigFilePath)
    $settings.IdentityProvider = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Provisioning.AdminIdentityProvider'

    $aadRealm = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Aad.Realm'
    if ($aadRealm -eq $null)
    {
        throw 'Cound not read aadRealm from AOS web.config'
    }

    $settings.AudienceUrn = $aadRealm

    $AosAdminUserId = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Provisioning.AdminPrincipalName'
    if ($AosAdminUserId -eq $null)
    {
        throw 'Cound not read Provisioning.AdminPrincipalName from AOS web.config'
    }
    $settings.AosAdminUserId = $AosAdminUserId

    $aadLoginWsfedEndpointFormat = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Aad.AADLoginWsfedEndpointFormat'
    $aadLoginUrlFormat = $aadLoginWsfedEndpointFormat -replace "/wsfed", ""
    $adminPrincipalDomain = ($AosAdminUserId -split '@')[1]
    $settings.AzureAuthority = $aadLoginUrlFormat -f $adminPrincipalDomain

    $selfServiceLocationRegistryPath = 'HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailSelfService\Servicing'

    # get first registry property with silent error so we can check whether $selfServiceLocationRegistryPath exists
    $settings.EnvironmentId = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'EnvironmentId' -ErrorAction SilentlyContinue

    # if it does exist, we go on and get the remaining properties
    # otherwise we log a warning to inform that these are not available
    if ($settings.EnvironmentId)
    {
        $settings.ClientAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'ClientAppInsightsInstrumentationKey'
        $settings.HardwareStationAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'HardwareStationAppInsightsInstrumentationKey'
        $settings.CloudPosAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'CloudPosAppInsightsInstrumentationKey'
        $settings.RetailServerAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'RetailServerAppInsightsInstrumentationKey'
        $settings.AsyncClientAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'AsyncClientAppInsightsInstrumentationKey'
        $settings.WindowsPhoneAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'WindowsPhoneAppInsightsInstrumentationKey'
        $settings.AsyncServerConnectorServiceAppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'AsyncServerConnectorServiceAppInsightsInstrumentationKey'
        $settings.RealtimeServiceAX63AppInsightsInstrumentationKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'RealtimeServiceAX63AppInsightsInstrumentationKey'
        $settings.RetailSideloadingKey = Get-ItemPropertyValue -Path $selfServiceLocationRegistryPath -Name 'RetailSideloadingKey'

        Log-TimedMessage "Settings retrieved from registry path $selfServiceLocationRegistryPath successfully."
    }
    else
    {
        Log-TimedWarning "$selfServiceLocationRegistryPath does not exist. Skipping retrieval of self service data. Self-service may not work."
    }

    $settings.UserId = 'RetailServerSystemAccount@dynamics.com'
    $settings.RetailServerUrl = "$($settings.RetailServerUrlValue)/Commerce"
    $settings.MediaServerUrl = "$($settings.RetailServerUrlValue)/MediaServer"

    $configForDbUpgrade = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $settings)))

    # Populate Retail Channel Db Schema
    Log-TimedMessage 'Populate Retail Channel Db Schema'

    $channelDatabaseDacpacFolderOverridePath = Resolve-ChannelDatabaseDacpacPath -retailServerRootPath $retailServerWebsitePhysicalPath `
      -scriptRootPath $scriptDir

    $customScriptFolderOverridePath = Get-MergedDatabaseCustomizations -retailServerRootPath $retailServerWebsitePhysicalPath

    & (Join-Path $rootDir 'Scripts\ApplyRetailDBScriptInSQLSURetailSchema.ps1') -config $configForDbUpgrade -log $logFile `
      -channelDatabaseDacpacFolderOverridePath $channelDatabaseDacpacFolderOverridePath -customScriptFolderOverridePath $customScriptFolderOverridePath

    Log-TimedMessage 'Update roles for retail database users.'
    $retailUsersToEnsure = @{'axdeployuser' = 'db_owner';
                            'axretailruntimeuser' = @('UsersRole', 'ReportUsersRole');
                            'axretaildatasyncuser' = 'DataSyncUsersRole';
                            'axdeployextuser' = 'DeployExtensibilityRole'}
    foreach($user in $retailUsersToEnsure.Keys)
    {
        $retailUsersToEnsure[$user] | ForEach {
            $query = "
                    IF EXISTS (select * from sys.database_principals where type = 'S' and name = '$user')
                    BEGIN
                        IF EXISTS (select * from sys.database_principals where type = 'R' and name = '$_')
                        BEGIN
                            EXEC sp_addrolemember '$_', '$user'
                        END
                    END"

            Log-TimedMessage ("Assign role to user $user with query $query")
            try
            {
                Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                              -Database $settings.AosDatabaseName `
                              -Username $settings.AosDatabaseUser `
                              -Password $settings.AosDatabasePass `
                              -Query $query -ErrorAction Stop
            }
            catch
            {
                $errorMsg = "Error when trying to assign role $_ to user $user"
                $errorMsg += ($global:error[0] | format-list * -f | Out-String)
                $PSBoundParameters.Keys | % { $errorMsg += "Parameter: {0} Value: {1}{2}" -f $_.ToString(), $PSBoundParameters[$_.ToString()], [System.Environment]::NewLine}
                Log-TimedMessage $errorMsg
                throw $errorMsg
            }
        }
    }

    # Restart batch service
    $axBatchService = Get-Service 'DynamicsAxBatch'
    $axBatchServiceStartTypeSnapshot = $axBatchService.StartType

    if($axBatchServiceStartTypeSnapshot -eq 'Disabled')
    {
        Write-Output "DynamicsAxBatch is disabled, enabling it."
        Set-Service $axBatchService.Name -StartupType Automatic
    }

    Restart-Service $axBatchService.Name

    # Before we execute the X++ portion of the upgrade, we have to make sure Change Tracking is enabled for the database
    # because RetailServicingOrchestrator executes actions (e.g. regenerate seed data, which require change tracking to be enabled)
    $changeTrackingSqlQuery = "
    IF NOT EXISTS (SELECT * FROM sys.change_tracking_databases WHERE database_id=DB_ID('$($settings.AosDatabaseName)'))
    BEGIN
        print 'Enabling Change Tracking for database ''$($settings.AosDatabaseName)'''
        ALTER DATABASE [$($settings.AosDatabaseName)] SET CHANGE_TRACKING = ON (CHANGE_RETENTION = 6 DAYS, AUTO_CLEANUP = ON)
    END
    ELSE
    BEGIN
        print 'Change tracking already enabled for database ''$($settings.AosDatabaseName)'''

    END"

    try
    {
        Log-TimedMessage "Checking/enabling change tracking prior to running RetailServicingOrchestrator portion"
        Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                      -Database $settings.AosDatabaseName `
                      -Username $settings.AosDatabaseUser `
                      -Password $settings.AosDatabasePass `
                      -Query $changeTrackingSqlQuery -ErrorAction Stop
        Log-TimedMessage "Change tracking check/update done"
    }
    catch
    {
        $errorMsg = "Error when ensuring SQL Change tracking was enabled for database $($settings.AosDatabaseName) in server $($settings.AosDatabaseServer)"
        $errorMsg += ($global:error[0] | format-list * -f | Out-String)
        $errorMsg += $PSBoundParameters.Keys | %{ "Parameter: $($_.ToString()) Value: $($PSBoundParameters[$_.ToString()]) $([System.Environment]::NewLine)"}
        Log-TimedMessage $errorMsg
        throw $errorMsg
    }

    # Doing pre-upgrade step to avoid losing association of the channel databases (RSSU channels to their DBs)
    try
    {
        $preupgradeChannelQuery = @"

-- before running retail upgrade code

DECLARE @PARTITIONRECID BIGINT;
DECLARE @INVALIDPARTITIONRECID BIGINT;

SET @INVALIDPARTITIONRECID = 123456;

SELECT @PARTITIONRECID = RECID FROM DBO.PARTITIONS WHERE PARTITIONKEY = 'initial';

UPDATE DBO.RETAILCDXDATASTORECHANNEL SET PARTITION = @INVALIDPARTITIONRECID WHERE PARTITION = @PARTITIONRECID;
UPDATE DBO.RETAILCHANNELTABLEEXT SET PARTITION = @INVALIDPARTITIONRECID WHERE PARTITION = @PARTITIONRECID;;

"@
        Log-TimedMessage "Setting invalid partition to association records between channels and their respective databases"
        Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                    -Database $settings.AosDatabaseName `
                    -Username $settings.AosDatabaseUser `
                    -Password $settings.AosDatabasePass `
                    -Query $preupgradeChannelQuery -ErrorAction Stop
        Log-TimedMessage "Setting invalid partition successfully"
    }
    catch
    {
        $errorMsg = "Error when doing pre-upgrade step for retail components: $($settings.AosDatabaseName) in server $($settings.AosDatabaseServer)"
        $errorMsg += ($global:error[0] | format-list * -f | Out-String)
        $errorMsg += $PSBoundParameters.Keys | %{ "Parameter: $($_.ToString()) Value: $($PSBoundParameters[$_.ToString()]) $([System.Environment]::NewLine)"}
        Log-TimedMessage $errorMsg
        throw $errorMsg
    }

    # Run Retail Servicing code for minor version upgrade
    $methodInputXmlFilePath = [System.IO.Path]::GetTempFileName();

    Write-Output "Method input xml file is located in $methodInputXmlFilePath"

    $configureAsyncServiceSection =
    "<ConfigureAsyncService>
            <ChannelDatabaseServer>$($settings.ChannelDatabaseServer)</ChannelDatabaseServer>
            <ChannelDatabaseName>$($settings.ChannelDatabaseName)</ChannelDatabaseName>
            <ChannelDatabaseUser>$($settings.ChannelDatabaseDataSyncUser)</ChannelDatabaseUser>
            <ChannelDatabasePass>$($settings.ChannelDatabaseDataSyncPass)</ChannelDatabasePass>
            <DataGroupName>$($settings.DataGroupName)</DataGroupName>
            <DataGroupDescription>$($settings.DataGroupDescription)</DataGroupDescription>
            <DatabaseProfileName>$($settings.DatabaseProfileName)</DatabaseProfileName>
            <TrustServerCertificate>True</TrustServerCertificate>
        </ConfigureAsyncService>"

    $configureRealTimeServiceSection =
    "<ConfigureRealTimeService execute=`"true`">
            <AosUrl>$($settings.AosUrl)</AosUrl>
            <AosSoapUrl>$($settings.AosSoapUrl)</AosSoapUrl>
            <IdentityProvider>$($settings.IdentityProvider)</IdentityProvider>
            <UserId>$($settings.UserId)</UserId>
            <AudienceUrn>$($settings.AudienceUrn)</AudienceUrn>
            <AosAdminUserId>$($settings.AosAdminUserId)</AosAdminUserId>
            <RtsProfileId>$($settings.RtsProfileId)</RtsProfileId>
            <TenantId>$($settings.TenantId)</TenantId>
            <AzureAuthority>$($settings.AzureAuthority)</AzureAuthority>
        </ConfigureRealTimeService>"

    $configureSelfServiceSection =
    "<ConfigureRetailSelfService>
            <RetailSideloadingKey>$($settings.RetailSideloadingKey)</RetailSideloadingKey>
            <EnvironmentId>$($settings.EnvironmentId)</EnvironmentId>
            <ClientAppInsightsInstrumentationKey>$($settings.ClientAppInsightsInstrumentationKey)</ClientAppInsightsInstrumentationKey>
            <HardwareStationAppInsightsInstrumentationKey>$($settings.HardwareStationAppInsightsInstrumentationKey)</HardwareStationAppInsightsInstrumentationKey>
            <CloudPosAppInsightsInstrumentationKey>$($settings.CloudPosAppInsightsInstrumentationKey)</CloudPosAppInsightsInstrumentationKey>
            <RetailServerAppInsightsInstrumentationKey>$($settings.RetailServerAppInsightsInstrumentationKey)</RetailServerAppInsightsInstrumentationKey>
            <AsyncClientAppInsightsInstrumentationKey>$($settings.AsyncClientAppInsightsInstrumentationKey)</AsyncClientAppInsightsInstrumentationKey>
            <WindowsPhoneAppInsightsInstrumentationKey>$($settings.WindowsPhoneAppInsightsInstrumentationKey)</WindowsPhoneAppInsightsInstrumentationKey>
            <AsyncServerConnectorServiceAppInsightsInstrumentationKey>$($settings.AsyncServerConnectorServiceAppInsightsInstrumentationKey)</AsyncServerConnectorServiceAppInsightsInstrumentationKey>
            <RealtimeServiceAX63AppInsightsInstrumentationKey>$($settings.RealtimeServiceAX63AppInsightsInstrumentationKey)</RealtimeServiceAX63AppInsightsInstrumentationKey>
        </ConfigureRetailSelfService>"

    # RealTimeService configuration is skipped because RS does not depend on default profile anymore and it uses the configuration from the commerceRuntime.config instead
    # RealTimeService configuration resets the RTS system account and will fail with seggregation of duties violation for several customers - resetting that account is not necessary because its permissions
    # did not change since AX70 . This is a workaround for Bug 301476: Segregation of duty privileges checks should not be applicable to a user with IsMicrosoftAccount set to true (service accounts)
    # Setting the RTS account as system account is handled above in the function Set-RetailServiceAccountAsSystemAccount
    $operationsToExecute = 'skipRunSeedDataGenerator="False" skipConfigureAsyncService="False" skipConfigureRealTimeService="True" skipRunCdxJobs="False" skipConfigureSelfService="False"'

    $configureChannelProfileSection =
    "<ConfigureChannelProfile>
            <RetailChannelProfileName>$($settings.RetailChannelProfileName)</RetailChannelProfileName>
            <RetailServerUrl>$($settings.RetailServerUrl)</RetailServerUrl>
            <MediaServerUrl>$($settings.MediaServerUrl)</MediaServerUrl>
            <CloudPOSUrl>$($settings.CloudPOSUrl)</CloudPOSUrl>
        </ConfigureChannelProfile>"

    $methodInputXmlString =
    "<?xml version=`"1.0`" encoding=`"UTF-8`"?>
    <Configuration $($operationsToExecute)>
        $configureAsyncServiceSection
        $configureRealTimeServiceSection
        $configureSelfServiceSection
        $configureChannelProfileSection
    </Configuration>"

    $methodInputXml = New-Object System.Xml.XmlDocument;
    $methodInputXml.LoadXml($methodInputXmlString);

    $methodInputXml.Save($methodInputXmlFilePath);

    $AXDeploymentSetupUtilityFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath -UtilityFileName 'Microsoft.Dynamics.AX.Deployment.Setup.exe'
    $parametersFromAosWebConfig = Get-RequisiteParametersFromAosWebConfig -AOSWebConfigFilePath $aosWebConfigFilePath

    $Global:LASTEXITCODE = 0
    # Call AX Deployment setup.
    Call-AXDeploymentSetupUtility -parametersFromAosWebConfig $parametersFromAosWebConfig `
                                  -methodInputXmlFilePath $methodInputXmlFilePath `
                                  -AXDeploymentSetupUtilityFilePath $AXDeploymentSetupUtilityFilePath `
                                  -className 'RetailServicingOrchestrator' `
                                  -methodName 'execute' `
                                  -LogFile $logFile

    $exitCode = $Global:LASTEXITCODE

    Remove-Item $methodInputXmlFilePath  -Force

    Log-TimedMessage ("Script ended with exit code $exitCode")
    exit $exitCode
}
catch
{
    Log-TimedMessage ($global:error[0] | format-list * -f | Out-String)
    $ScriptLine = $MyInvocation.MyCommand.Path.ToString()
    $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: $($_.ToString()) Value: $($PSBoundParameters[$_.ToString()])"}
    Log-TimedMessage "Executed:$([System.Environment]::NewLine)$ScriptLine$([System.Environment]::NewLine)Exiting with error code $exitCode."
    throw ($global:error[0] | format-list * -f | Out-String)
}
finally
{
    #Set the current location to avoid issues when the current location is set to SQLServer, which will breaks below code.
    Set-Location $rootDir

    if($axBatchServiceStartTypeSnapshot -ne $null -and $axBatchServiceStartTypeSnapshot -ne (Get-Service 'DynamicsAxBatch').StartupType)
    {
        #Restore DynamicsAxBatch to initial status.
        Set-Service $axBatchService.Name -StartupType $axBatchServiceStartTypeSnapshot
    }

    Encrypt-WebConfigSection -webConfigSection "connectionStrings" -websiteId $retailServerWebSite.Id -logFile $logFile
    Encrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigFilePath

    Set-Location $currentLocationSnapshot

    # Doing pre-upgrade step to avoid losing association of the channel databases (RSSU channels to their DBs)
    try
    {
        $postupgradeChannelQuery = @"
-- after running retail upgrade code

DECLARE @PARTITIONRECID BIGINT;
DECLARE @INVALIDPARTITIONRECID BIGINT;

SET @INVALIDPARTITIONRECID = 123456;

SELECT @PARTITIONRECID = RECID FROM DBO.PARTITIONS WHERE PARTITIONKEY = 'initial';

UPDATE DBO.RETAILCDXDATASTORECHANNEL SET PARTITION = @PARTITIONRECID WHERE PARTITION = @INVALIDPARTITIONRECID;
UPDATE DBO.RETAILCHANNELTABLEEXT SET PARTITION = @PARTITIONRECID WHERE PARTITION = @INVALIDPARTITIONRECID;
"@
        Log-TimedMessage "Reverting invalid partition value for association records between channels and their respective databases"
        Invoke-SqlCmd -ServerInstance $settings.AosDatabaseServer `
                    -Database $settings.AosDatabaseName `
                    -Username $settings.AosDatabaseUser `
                    -Password $settings.AosDatabasePass `
                    -Query $postupgradeChannelQuery -ErrorAction Stop
        Log-TimedMessage "Reverting invalid partition successful"
    }
    catch
    {
        $errorMsg = "Error when doing pre-upgrade step for retail components: $($settings.AosDatabaseName) in server $($settings.AosDatabaseServer)"
        $errorMsg += ($global:error[0] | format-list * -f | Out-String)
        $errorMsg += $PSBoundParameters.Keys | %{ "Parameter: $($_.ToString()) Value: $($PSBoundParameters[$_.ToString()]) $([System.Environment]::NewLine)"}
        Log-TimedMessage $errorMsg
        throw $errorMsg
    }
}
# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDA858h9RT+j7Lf
# zFxWK84d4OeUMXgwHn/0fEWT7qiyIaCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCAW
# cC4rlfRaGQk2nRQkMnD+SmY64koWy61VtOolNg8f1TCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBq
# MK/2EKEqKWjxKkT6QndMvZR4DTAHEb8ImoXpcEFl0+v7hfQSHJ72uCVzApSZHYOa
# IGRQ1sqJUyhpOD5DYSIw3H7soeuUBBODgM4YqsUxeFn5vwo8IlX4B3UzqoskNzD/
# 2sXIn1b8b/osDK0l/Kn0chFgI2KEPX3D4mHDBw/gG3rgTCS2I9+p7fafAHCSo2pL
# 63Ru3nVB7tD5KbQlSYsyN5HwUT2mEuWjnQtUjVH9s5mti1a2BbOSDhLQMXVNWDsQ
# Oi8LVnQqwRYFWCdPYDu99J0DSCHzBF9QPPuEHzTWLalhjU76GxXRg8UjDHzba20G
# arLcDOUGvFyaKu6ipEXSoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# INYprsN8FaYDPK05T3kCni8GjlBFStWrMn0y/jpdObGjAgZfPS1I1CwYEzIwMjAw
# ODIzMDQwMzQzLjQ1N1owBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
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
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgx2rk95L/YabPV+NsVBSzZU0kCoPEBlZU
# J9TWhG1albcwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCCCVPhhBhtKMjxi
# E2/c3YdDcB3+1eTbswVjXf+epZ1SjzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABCX6CvR5702EiAAAAAAEJMCIEIBjmRjwTerYai/wZ
# tkGQOCOhb1wZicFe6Gbg2GhN5HYlMA0GCSqGSIb3DQEBCwUABIIBAJ0G5OytQLqU
# AvpgZiUTcy2pQxsgJIInOFK8KrTxAGlfOQ3MbGBNqQwSpRoF7YZq1jCL4GINgQdV
# IZkmMQsTwdg4id31RiFENWFQF7GjvGF26Vtmd/qOEMn1l0a/pLMMeSNBguilSVu3
# 4q5WJytwdxF+AZcGcatOYjzk9zQG51cgUeWAXZthfs3QXrP5/h1w/c1l3xvtZOWa
# Q1pVDlajp/9GhxUOwcpHqL1Nzw5FWvPkuT1OxyWfSmozqUpW49T4vOOSXUCtaOys
# XWmwWYRFeHOva3L6B39gYhJ/YGtio1LEhUcapVmApkk5xnze3CwU2AnlFMfZIM4P
# rsoqg4oleG0=
# SIG # End signature block
