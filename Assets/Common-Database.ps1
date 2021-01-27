<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

$ErrorActionPreference = "Stop"

<#
.SYNOPSIS
Create user groups and assign database roles.

.DESCRIPTION
Creates the user group on server $serverName if not existing already.
Then creates a login in the SQL SERVER $serverName, for the user, if not existing already.
Then created a database user for the user on $databaseName.
Then associated the database user with the SQL roles defined in the user group mapping object.

.PARAMETER databaseName
The name of the database to be deployed.

.PARAMETER serverName
The name of the server where Windows users should be created. Usually the same server where the database is hosted.

.PARAMETER connectionString
A connection string to the database. It may or may not specify an initial catalog or database.

.PARAMETER groupMappings
An array of groupMapping. A groupMapping is defined with the following properties:
	GroupName				(required)	- the same of the user group, possibly containing a domain (e.g. 'domain\group').
	MappedSqlRoleName		(optinal)	- the SQL role the user group should be mapped to.
#>
function Create-UserGroups()
{
	param(
		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$databaseName,

		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$serverName,

		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$connectionString,

		[Parameter(Mandatory=$true)]
		[ValidateNotNull()]
		[array]$groupMappings
	);

	$database = New-Object Microsoft.Dynamics365.Commerce.Tools.DacValidator.Database -ArgumentList $connectionString, $databaseName

	try
	{
		foreach($group in $groupMappings)
		{
			$groupName = $group.GroupName
			if ($groupName)
			{
				Log-TimedMessage "$databaseName - creating windows group [$groupName] on $serverName, if it doesn't exist yet."

				$groupName = CreateWindowsGroup -windowsLoginGroupName $group.GroupName -serverName $serverName
				$groupName = GetExplicitWindowsUserName -userName $groupName

				$sqlRole = $group.MappedSqlRoleName
				$addToRoleCommand = if ($sqlRole) { "EXEC sp_addrolemember '$sqlRole', '$groupName';" } else { [String]::Empty }

				Log-TimedMessage "$databaseName - creating login for [$groupName] on database '$databaseName' and it will be associated to role '$sqlRole' (if empty, then no role association)."

				$createSqlUserCommand = @"
					IF NOT EXISTS (SELECT * FROM [MASTER].[DBO].[SYSLOGINS] WHERE NAME = '$groupName')
					BEGIN
						CREATE LOGIN [$groupName] FROM WINDOWS WITH DEFAULT_DATABASE = [MASTER];
					END;
					GO
					IF NOT EXISTS (SELECT * FROM SYS.SYSUSERS WHERE NAME = '$groupName')
					BEGIN
						CREATE USER [$groupName] FOR LOGIN [$groupName];
					END;
					GO
					$addToRoleCommand
"@

				$database.ExecuteSqlText($createSqlUserCommand)
			}
			else
			{
				Log-TimedWarning "$databaseName - Create-UserGroups - an entry in the 'groupMappings' array does not define 'GroupName'. Group creation will be skiped for this entry. This may cause certain users to not be able to access the database."
			}
		}
	}
	finally
	{
		if ($database)
		{
			$database.Dispose()
		}
	}
}

<#
.SYNOPSIS
Adds roles to users required for Retail cloud deployments.

.PARAMETER Server
The sql server address/name.

.PARAMETER DatabaseName
The name of the collocated AX/CHANNEL database.

.PARAMETER Credentials
The credentials for accessing the database.
#>
function Set-RolesForCloudRetailChannelDatabase(
    $Server = (Throw 'server parameter required'),
    $DatabaseName = (Throw 'database parameter required'),
    [System.Management.Automation.PSCredential]$Credentials = (Throw 'Credential parameter required'))
{

    $connectionString = Get-ConnectionString -serverName $Server `
                                    -databaseName $DatabaseName `
                                    -credential $Credentials

    $database = New-Object Microsoft.Dynamics365.Commerce.Tools.DacValidator.Database -ArgumentList $connectionString, $DatabaseName

    $retailDbRolesToUserMapping = @{'DataSyncUsersRole' = 'axretaildatasyncuser';
                                    'PublishersRole' = 'axretaildatasyncuser';
                                    'UsersRole' = 'axretailruntimeuser';
                                    'ReportUsersRole' = 'axretailruntimeuser';
                                    'DeployExtensibilityRole' = 'axdeployextuser';
                                    }

    foreach($role in $retailDbRolesToUserMapping.Keys)
    {
        $userAssociatedToCurrentRole = $retailDbRolesToUserMapping[$role]
        $queryToCheckRole = "SELECT [NAME] FROM sys.database_principals WHERE [TYPE] = 'R' and [NAME] = '$role' "

        if(!$database.ExecuteScalar($queryToCheckRole))
        {
            Log-TimedWarning "Role $role doesn't exist in database. Please check the database deployment log for any errors while creating the role."
            continue
        }
        else
        {
            Write-Log "Role $role already exists in the database."
        }

        $queryToCheckUser = "SELECT * FROM dbo.sysusers WHERE name = '$userAssociatedToCurrentRole' AND issqluser = 1"

        if(!$database.ExecuteScalar($queryToCheckUser))
        {
            Log-TimedWarning "User $userAssociatedToCurrentRole doesn't exist in database. Please check the database deployment log for any errors while creating the user."
            continue
        }
        else
        {
            Write-Log "User $userAssociatedToCurrentRole already exists in the database."
        }


        $queryToCheckIfRoleExistsForUser = "select IS_ROLEMEMBER('$role', '$userAssociatedToCurrentRole')"

        if($database.ExecuteScalar($queryToCheckIfRoleExistsForUser))
        {
            Write-Log "User $userAssociatedToCurrentRole already has the role $role"
        }
        else
        {
            Write-Log "User $userAssociatedToCurrentRole does not have the role $role."
            $queryToAddUserToRole = "EXEC sp_addrolemember '$role', '$userAssociatedToCurrentRole'"
            Write-Log ("Associating role $role to user $userAssociatedToCurrentRole")
            $database.ExecuteSqlText($queryToAddUserToRole)
        }
    }
}

<#
.SYNOPSIS
Alters an existing database and set the required parameters.

.PARAMETER databaseName
The name of the database to be deployed.

.PARAMETER connectionString
A connection string to the database. It may or may not specify an initial catalog or database.

.PARAMETER maxSqlMemoryLimitRatio
A value between 0 and 1 indicating the percentage of system memorry SQL SERVER can use.

.PARAMETER databaseFileMinSizeMB
A value in MB for the minimum size of the all database files.

.PARAMETER databaseFileGrowthPercentage
A value between 0 and 100 indicating the percentage of databaseFileMinSizeMB to be used for all database file growth.

.PARAMETER databaseAutoClose
A $true or $false value indicating how to set AUTO_CLOSE database parameter. A $null value will not change the parameter.
#>
function Alter-DatabaseParameters
{
	param(
		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$databaseName,

		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$connectionString,

		[Parameter(Mandatory=$false)]
		[Nullable[float]]$maxSqlMemoryLimitRatio,

		[Parameter(Mandatory=$false)]
		[Nullable[long]]$databaseFileMinSizeMB,

		[Parameter(Mandatory=$false)]
		[Nullable[float]]$databaseFileGrowthPercentage,

		[Parameter(Mandatory=$false)]
		[Nullable[bool]]$databaseAutoClose
	);

	# we need to connect to master as we cannot change some of these things while connected directly to the database
	$database = New-Object Microsoft.Dynamics365.Commerce.Tools.DacValidator.Database -ArgumentList $connectionString, 'master'

	try
	{
		# sets sql max memory
		if ($maxSqlMemoryLimitRatio -and $maxSqlMemoryLimitRatio -gt 0 -and $maxSqlMemoryLimitRatio -lt 1)
		{
			Log-TimedMessage "$databaseName - Database parameters - setting MAX SQL memory to $(100*$maxSqlMemoryLimitRatio)% of system memory"

			$cmd = @"
				sp_configure 'show advanced options', 1;
				GO

				RECONFIGURE;
				GO

				DECLARE @MAXMEMORY BIGINT = (SELECT MAX(MEM) FROM
				(
					SELECT CAST(TOTAL_PHYSICAL_MEMORY_KB * 0.5 AS BIGINT) MEM FROM SYS.DM_OS_SYS_MEMORY
					UNION
					SELECT 131072 MEM -- min memory limit 128MB
				) M)
				exec sp_configure 'max server memory', @MAXMEMORY;
				GO

				RECONFIGURE;
"@
			$database.ExecuteSqlText($cmd)
		}

		if ($databaseFileMinSizeMB -and $databaseFileMinSizeMB -gt 0)
		{
			Log-TimedMessage "$databaseName - Database parameters - increasing all database files' size to $databaseFileMinSizeMB MB"
			$cmd = @"
			SELECT [NAME] FROM SYS.MASTER_FILES WHERE
				DATABASE_ID = DB_ID('$databaseName')
				AND (SIZE * 8 / 1024) < $databaseFileMinSizeMB;
"@
			$filenames = $database.ExecuteScalarCollection($cmd)
			foreach ($filename in $filenames)
			{
				$database.Execute("ALTER DATABASE [$databaseName] MODIFY FILE (NAME = '$filename', SIZE = $($databaseFileMinSizeMB)MB)");
			}
		}

		if ($databaseFileGrowthPercentage -and $databaseFileGrowthPercentage -gt 0 -and $databaseFileGrowthPercentage -le 100)
		{
			Log-TimedMessage "$databaseName - Database parameters - setting all database files' size growth to $($databaseFileGrowthPercentage)%"

			$cmd = @"
			SELECT [NAME] FROM SYS.MASTER_FILES WHERE
				DATABASE_ID = DB_ID('$databaseName');
"@
			$filenames = $database.ExecuteScalarCollection($cmd)
			foreach ($filename in $filenames)
			{
				$database.Execute("ALTER DATABASE [$databaseName] MODIFY FILE (NAME = '$filename', FILEGROWTH = $($databaseFileGrowthPercentage)%)");
			}
		}

		# Need to do null check to see whether value was set at all.
		if($databaseAutoClose -ne $null)
		{
			Log-TimedMessage "$databaseName - Database parameters - setting AUTO_CLOSE to $databaseAutoClose"

			$database.Execute("ALTER DATABASE [$databaseName] SET AUTO_CLOSE $(if($databaseAutoClose) { 'ON' } else { 'OFF' })");
		}
	}
	finally
	{
		if ($database)
		{
			$database.Dispose()
		}
	}
}

<#
.SYNOPSIS
Gets a connection string from the database configuration object.

.PARAMETER databaseName
The name of the database.

.PARAMETER serverName
The name of the server to connect to.

.PARAMETER instanceName
Optinal name of the database server instnace to connect to.

.PARAMETER credential
Optional credential to access the database. If not provided, integrated security is assumed.
#>
function Get-ConnectionString {
	param(
		[Parameter(Mandatory=$true)]
		[ValidateNotNull()][string]$databaseName,

		[Parameter(Mandatory=$true)]
		[ValidateNotNull()][string]$serverName,

		[Parameter(Mandatory=$false)]
		[ValidateNotNull()][string]$instanceName,

		[Parameter(Mandatory=$false)]
		[System.Management.Automation.PSCredential]$credential
	)
	$server = $serverName
	if ($instanceName)
	{
		# some times instance name contains the server name as well
		$instanceNamePart = $instanceName.split('\', [System.StringSplitOptions]::RemoveEmptyEntries)[1]

		if ($instanceNamePart)
		{
			$instanceName = $instanceNamePart
		}

		# if instance name is same as server name, ignore it, callers may duplicated server name on instance name
		if ($instanceName -ne $server)
		{
			$server = "$server\$instanceName"
		}
	}

	# use a builder for connection string for proper escaping
	$builder = New-Object System.Data.SqlClient.SqlConnectionStringBuilder

	# pooling is disable so connections don't linger
	$builder.Pooling = $false
	$builder["Server"] = $server
	$builder["Connect Timeout"] = 30
	$builder["Application Name"] = "D365RetailDeployment"

	if ($credential)
	{
		$builder["User ID"] = $credential.UserName
		$builder.Password = $credential.GetNetworkCredential().password
	}
	else
	{
		$builder["Integrated Security"] = $true
	}

	$connectionString = $builder.ToString()

	$builderForLog = New-Object System.Data.SqlClient.SqlConnectionStringBuilder -ArgumentList $connectionString
	$builderForLog.Password = $null
	Log-TimedMessage "Created connection string (password is omitted): $builderForLog";

	$connectionString
}

<#
.SYNOPSIS
Deploys customization files against a database.

.DESCRIPTION
All files under 'customizationsBasePath' with extension '.sql' will be considered customization scripts and will be run against the database.
Prior executing each script, the script is checked against the database by file name, to make sure only new customization scripts are executed.

.PARAMETER databaseName
The name of the database to deploy customizations against.

.PARAMETER connectionString
A connection string to the database. It may or may not specify an initial catalog or database.

.PARAMETER customizationsBasePath
Path to the folder containing customization .sql scripts.

.PARAMETER logFolder
A path to a folder were all results will be saved to.
If the path doesn't exist, this script will try to create it.
#>
function Deploy-Customizations
{
	param(
		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$databaseName,

		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$connectionString,

		[Parameter(Mandatory=$false)]
		[string]$customizationsBasePath,

		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$logFolder
	)

	Log-TimedMessage "$databaseName - Preparing to apply customizations to database"

	if (-not $customizationsBasePath -or -not (Test-Path $customizationsBasePath))
	{
		Log-TimedWarning "$databaseName - The base folder for customization scripts: '$customizationsBasePath' does not exist. No customizations will be applied."
		return
	}

	if (-not (Test-Path $logFolder))
	{
		Log-TimedMessage "$databaseName - log folder $logFolder doesn't exist. It will be created now."
		New-Item -ItemType Directory -Path $logFolder -Force | Out-Null
	}

	$logBasePath = Resolve-Path $logFolder

	if (-not (Test-Path $logBasePath -pathType container))
	{
		throw "$databaseName -  The log folder path provided: '$logBasePath' is not a directory."
	}

	$databaseLogFilepath = Join-Path $logBasePath "CustomizationDatabaseLogs.log"
	Log-TimedMessage "$databaseName - database statement execution logs will be available at: $databaseLogFilepath"

	$customizationsBasePath = Resolve-Path $customizationsBasePath
	Log-TimedMessage "$databaseName - Looking for customizations sql files recursively at $customizationsBasePath"

    $scriptFiles = Get-ChildItem -Path $customizationsBasePath -Recurse -Filter "*.sql" | Sort-Object Name
	Log-TimedMessage "$databaseName - Found $($scriptFiles.count) customization SQL script files."

	if (-not $scriptFiles)
	{
		Log-TimedMessage "$databaseName - No customizations found. Nothing to do."
		return
	}

	Log-TimedMessage "$databaseName - Connecting to database to obtain previously applied customization files."
	$database = New-Object Microsoft.Dynamics365.Commerce.Tools.DacValidator.Database -ArgumentList $connectionString, $databaseName, $databaseLogFilepath

	try
	{
		# This table must exist becase we just deployed the database
		$appliedCustomizationFileNames = $database.ExecuteScalarCollection("SELECT FILENAME FROM [crt].[RETAILUPGRADEHISTORY] WHERE UPGRADETYPE='CUSTOM'")
		Log-TimedMessage "$databaseName - Found $($appliedCustomizationFileNames.count) previously applied customizations."

		foreach ($scriptFile in $scriptFiles)
		{
			$filename = $scriptFile.Name
			$filepath = $scriptFile.FullName

			# only run customizations not applied before
			if ($appliedCustomizationFileNames -notcontains $filename)
			{
				Log-TimedMessage "$databaseName - Reading customization file: $filename ($filepath)"
				$scriptContents = Get-Content -Raw $filepath

				try
				{
					Log-TimedMessage "$databaseName - Applying customization file: $filename"
					$database.ExecuteSqlText($scriptContents)
				}
				catch
				{
					Log-Error "An error occurred when running the customization script $filepath against $databaseName. $_"
					throw
				}

				# Update record table right away so we don't rerun scripts in case of failure
				$database.Execute("INSERT [crt].[RETAILUPGRADEHISTORY] (UpgradeType, FilePath, FileName, Build) VALUES ('CUSTOM', '$filepath', '$filename', (SELECT TOP 1 BUILD FROM CRT.RETAILUPGRADEHISTORY WHERE UPGRADETYPE = 'RETAIL' ORDER BY ID DESC))")
				Log-TimedMessage "$databaseName - Customization file $filename applied successfully"

				$appliedCustomizationFileNames += $filename
			}
		}
	}
	finally
	{
		if ($database)
		{
			$database.Dispose()
		}
	}

	Log-TimedMessage "$databaseName - Finished applying customization scripts"
}

<#
.SYNOPSIS
Deploys the database, after validations.

.DESCRIPTION
A new database is created if it doesn't current exist. An existing database is upgraded to the version associated with the database packaged provided.

.PARAMETER databaseName
The name of the database to be deployed.

.PARAMETER connectionString
A connection string to the database. It may or may not specify an initial catalog or database.

.PARAMETER deployableBasePath
Path to the folder containing the DACPAC and other database deployment related artifacts.
The following files are expected to exist under that path:
	CommerceRuntimeScripts.dacpac (required) - the package to be deployed
	DeploymentPublishProfile.xml  (required) - an xml file with deployment configurations
	DeploymentAllowedDrops.txt	  (optional) - a EOL-separated list of database artifacts allowed to be dropped
	DeploymentAllowedMessages.txt (optional) - a EOL-separated list of allowed database deployment warning messages

.PARAMETER logFolder
A path to a folder were all results will be saved to.
If the path doesn't exist, this script will try to create it.

.EXAMPLE
Deploy-Database -databaseName "ChannelDb" -connectionString "Server=localhost;Integrated Security=true;" -logFolder "C:\dbDeployables"
#>
function Deploy-Database
{
	param(
		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$databaseName,

		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$connectionString,

		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$deployableBasePath,

		[Parameter(Mandatory=$true)]
		[ValidateNotNullOrEmpty()]
		[string]$logFolder
	);

	Log-TimedMessage "$databaseName - Preparing to deploy"

	# Pre-flight checks
	if (-not (Test-Path $deployableBasePath))
	{
		Log-TimedWarning "$databaseName - $deployableBasePath does not exist. Deployment of Microsoft artifacts will be skipped"
		return
	}

	$basePath = Resolve-Path $deployableBasePath

	# this is the package we will be deploying
	$packageFilepath =          Join-Path $basePath 'CommerceRuntimeScripts.dacpac'

	if (-not (Test-Path $packageFilepath))
	{
		Log-TimedWarning "$databaseName - $packageFilepath does not exist. Deployment of Microsoft artifacts will be skipped"
		return
	}

    # Deployment options/profile used to be shipped with the product, but now we ship it with the deployment bits
    # To support legacy environments, we still look at the product folder to see if it is there, in case we don't find it
    # along with the deployment bits
    $deploymentOptionsFileName = 'DeploymentPublishProfile.xml'
    $deployOptionsFilepath = Join-Path $PSScriptRoot $deploymentOptionsFileName

	if (-not (Test-Path $deployOptionsFilepath))
    {
        Log-TimedWarning "$databaseName - $deployOptionsFilepath does not exist under deployment scripts folder. Using fallback location."

        $deployOptionsFilepath = Join-Path $basePath $deploymentOptionsFileName

        if (-not (Test-Path $deployOptionsFilepath))
        {
            Log-TimedWarning "$databaseName - $deployOptionsFilepath does not exist under product data folder."
            throw "No deployment profile was found. Please make sure that the deployment profile options file exists."
        }
    }

	if (-not (Test-Path $logFolder))
	{
		Log-TimedMessage "$databaseName - log folder $logFolder doesn't exist. It will be created now."
		New-Item -ItemType Directory -Path $logFolder -Force | Out-Null
	}

	$logBasePath = Resolve-Path $logFolder

	if (-not (Test-Path $logBasePath -pathType container))
	{
		throw "$databaseName - The log folder path provided: '$logBasePath' is not a directory."
	}

	$databaseLogFilepath = Join-Path $logBasePath "DatabaseLogs.log"
	Log-TimedMessage "$databaseName - database statement execution logs will be available at: $databaseLogFilepath"

	Log-TimedMessage "$databaseName - Loading publish options from: $deployOptionsFilepath"
	$publishOptions = [Microsoft.Dynamics365.Commerce.Tools.DacValidator.DacServicesFacade]::LoadDeployOptions($deployOptionsFilepath)

	Log-TimedMessage "$databaseName - Loading the following DAC package to be used for this deployment: $packageFilepath"

	# this is the dacpac that has the upgrade we want to install
	$targetDacpac = [Microsoft.Dynamics365.Commerce.Tools.DacValidator.DacServicesFacade]::LoadDacpac($packageFilepath)
	$currentDacpac = $null

	$database = $null
	$executionSuccessfull = $true
	$newDatabase = $true

	# 30 minutes - each SQL batch will timeout this many minutes when indexes are being applied or tables rebuilt
	# Ideally we should not have long running queries during deployment - however it is best to wait than fail deployment halfway
	$defaultSqlTimeoutSeconds = 1800

	try
	{
		# Check that database exists, otherwise creates a new one
		Log-TimedMessage "$databaseName - check that database exists."

		# first, try to open a connection directly to the database
		# in SQLAzure, we may not have access to master database, so we try to connect to the database directly and check its name
		$database = New-Object Microsoft.Dynamics365.Commerce.Tools.DacValidator.Database -ArgumentList $connectionString, $databaseName, $databaseLogFilepath
		$database.Timeout = $defaultSqlTimeoutSeconds

		try
		{
			$newDatabase = $database.ExecuteScalar("SELECT DB_NAME()") -ne $databaseName
		}
		catch
		{
			Log-TimedMessage "$databaseName - it appears this database doesn't exist."
		}
		finally
		{
			if ($database)
			{
				$database.Dispose()
			}
		}

		if ($newDatabase)
		{
			Log-TimedMessage "$databaseName - database doesn't exist. One will be created now."
			Log-TimedMessage "$databaseName - connecting to master database to issue CREATE DATABASE statement."
			$database = New-Object Microsoft.Dynamics365.Commerce.Tools.DacValidator.Database -ArgumentList $connectionString, '', $databaseLogFilepath
			$database.Timeout = $defaultSqlTimeoutSeconds
			$database.Execute("CREATE DATABASE [$databaseName]")
			# disconnects from master DB
			$database.Dispose();
			Log-TimedMessage "$databaseName - database created."
		}
		else
		{
			Log-TimedMessage "$databaseName - database exists."
		}

		Log-TimedMessage "$databaseName - checking connection against database."
		# makes sure we are connected to the actual database
		$database = New-Object Microsoft.Dynamics365.Commerce.Tools.DacValidator.Database -ArgumentList $connectionString, $databaseName, $databaseLogFilepath
		$database.Timeout = $defaultSqlTimeoutSeconds
		# make a dummy call to make sure we are connected
		$database.Execute("SELECT 1")

		# Check if canary view exists (if it does, we will fail deployment to allow for manual intervention)
		Log-TimedMessage "$databaseName - quering for canary view __RETAIL_CANARY before proceeding. If it exists, we will fail deployment. This can be used to provide manual intervention prior deployment. Run this on the database to create it: CREATE VIEW __RETAIL_CANARY AS SELECT 1 A;"
		$retailCanaryViewExists = $database.ExecuteScalar("SELECT OBJECT_ID('__RETAIL_CANARY')") -ne $null

		if ($retailCanaryViewExists)
		{
			Log-TimedMessage "$databaseName - canary view __RETAIL_CANARY exists."
			throw "$databaseName - canary view __RETAIL_CANARY exists. This means manual intervention was requested. Database deployment will fail. If this was not intended, remove the view from the database."
		}
		else
		{
			Log-TimedMessage "$databaseName - canary view __RETAIL_CANARY not found. Continuing normally."
		}

		# Get current version from database
		Log-TimedMessage "$databaseName - quering current database version against [AX.DBVERSION]."

		# AX.DBVERSION contains DB version. If not set, assume a new DB
		$axDbVersionTableExists = $database.ExecuteScalar("SELECT OBJECT_ID('AX.DBVERSION')") -ne $null

		if ($axDbVersionTableExists)
		{
			$currentDbVersion = [Version]$database.ExecuteScalar("SELECT TOP 1 VERSIONSTRING FROM [ax].[DBVERSION] WHERE VERSIONTYPE='databaseVersion'")
		}

		if (-not $currentDbVersion)
		{
			Log-TimedMessage "$databaseName - no version found. Assuming new database deployment."
			$currentDbVersion = [Version]'0.0.0.0'
		}

		# this is the version we will upgrade to
		[Version]$targetVersion = $targetDacpac.Version

		Log-TimedMessage "$databaseName - current DB version is $currentDbVersion and upgrade package version is $targetVersion."

		# check if DB is up to date
		if ($currentDbVersion -lt $targetVersion)
		{
			# Get src pkg from DB, if doesn't exist, fallback do DACPACs on the filesystem, if not exists, fail as we cannot do anything else
			Log-TimedMessage "$databaseName - retrieving current binary package from database using CRT.RETAILUPGRADEHISTORY."

			$databaseSupportsStoringDacpac = $database.ExecuteScalar("SELECT COL_LENGTH('[CRT].[RETAILUPGRADEHISTORY]', 'DACPACFILE')") -ne $null
			[byte[]]$currentDacpacBytes = $null

			if ($databaseSupportsStoringDacpac)
			{
				$currentDacpacBytes = [byte[]]$database.ExecuteScalar("SELECT TOP 1 DACPACFILE FROM CRT.RETAILUPGRADEHISTORY WHERE UPGRADETYPE = 'RETAIL' ORDER BY ID DESC")
			}
			else
			{
				Log-TimedMessage "$databaseName - database does not support storing/retrieving DACPACs. CRT.RETAILUPGRADEHISTORY doesn't exist or DACPACFILE column is not present."
			}

			if ($currentDacpacBytes)
			{
				Log-TimedMessage "$databaseName - current binary package found in the database."

				try
				{
					$currentDacpac = [Microsoft.Dynamics365.Commerce.Tools.DacValidator.InMemoryPackage]::LoadPackage($currentDacpacBytes)
				}
				catch
				{
					# legacy versions used to store the DACPAC bytes converted to ASCII characters, separated by spaces
					Log-TimedMessage "$databaseName - failed to parse current binary package found in the database. This is not yet an error. Assuming legacy format and trying again. Exception: $_"
					$currentDacpacBytesStr = [string]$database.ExecuteScalar("SELECT TOP 1 CAST(DACPACFILE AS VARCHAR(MAX)) FROM CRT.RETAILUPGRADEHISTORY WHERE UPGRADETYPE = 'RETAIL' ORDER BY ID DESC")
					$currentDacpacBytes = [byte[]]$currentDacpacBytesStr.split(" ")
					$currentDacpac = [Microsoft.Dynamics365.Commerce.Tools.DacValidator.InMemoryPackage]::LoadPackage($currentDacpacBytes)
					Log-TimedMessage "$databaseName - legacy format loaded successfully."
				}
			}
			elseif (-not $axDbVersionTableExists)
			{
				# this is a new database (or at least it seems like it, given the version table doesn't exist), we can generate the upgrade against an empty dacpac
				Log-TimedMessage "$databaseName - this is a new database deployment (because [ax].[DBVESION] table does not exist), binary package is not required."
				$currentDacpac = [Microsoft.Dynamics365.Commerce.Tools.DacValidator.InMemoryPackage]::BuildPackage()
			}
			else
			{
				$legacyDacpackageFilePath = Join-Path $basePath 'Upgrade\Retail' | Join-Path -ChildPath "CommerceRuntimeScripts_$currentDbVersion.dacpac"
				Log-TimedMessage "$databaseName - current binary package not found. Trying to load legacy package from file system path: $legacyDacpackageFilePath"
				if (Test-Path $legacyDacpackageFilePath)
				{
					$currentDacpac = [Microsoft.Dynamics365.Commerce.Tools.DacValidator.DacServicesFacade]::LoadDacpac($legacyDacpackageFilePath)
				}
				else
				{
					Log-TimedMessage "$databaseName - package not found at: $legacyDacpackageFilePath"
					throw "$databaseName - Couldn't find current dacpac associated to current version $currentDbVersion. This is not a new database deployment, please make sure that a DACPAC is available either on the database or at $legacyDacpackageFilePath"
				}
			}

			# Generate script from dacpacs
			Log-TimedMessage "$databaseName - generating creation/upgrade script. This may take several minutes."
			$dacFacade = New-Object Microsoft.Dynamics365.Commerce.Tools.DacValidator.DacServicesFacade -ArgumentList $publishOptions, $targetDacpac
			$script = $dacFacade.GenerateDeployScript($currentDacpac, $databaseName)

			# Remove SQLCMD mode variables not required and not supported by this execution mechanism
			$scriptStartString = "<Begin of Commerce Runtime Scripts>"
			$startIndex = $script.IndexOf($scriptStartString)
			if ($startIndex -ge 0)
			{
				$script = $script.Substring($startIndex + $scriptStartString.Length)
			}

            # Check for legacy version manipulation, i.e. when the post-deployment script would have placeholders in the form 'm4_bld*'
            # And would not handle the RETAIL-PENDING state in the RETAILUPGRADEHISTORY table
			$scriptStartString = "<Begin of versioning database>"
			$startIndex = $script.IndexOf($scriptStartString)
			if ($startIndex -ge 0)
			{
                $m4_bldvermajor_variableName = "m4_bldvermajor"
                $m4_bldverminor_variableName = "m4_bldverminor"
                $m4_bldnummajor_variableName = "m4_bldnummajor"
                $m4_bldnumminor_variableName = "m4_bldnumminor"

                $usesLegacyVersioning = $script.IndexOf($m4_bldvermajor_variableName, $startIndex) -ge 0

                if ($usesLegacyVersioning)
                {
                    Log-TimedMessage "$databaseName - the DACPAC being deployed uses LEGACY VERSIONING. Replacing build numbers on post-deployment script now."
                    $script = $script.Replace($m4_bldvermajor_variableName, $targetVersion.Major.ToString())
                    $script = $script.Replace($m4_bldverminor_variableName, $targetVersion.Minor.ToString())
                    $script = $script.Replace($m4_bldnummajor_variableName, $targetVersion.Build.ToString())
                    $script = $script.Replace($m4_bldnumminor_variableName, $targetVersion.Revision.ToString())

                    Log-TimedMessage "$databaseName - because legacy versioning is being used, storing DACPAC on the database before deployment was disabled. DACPAC will be stored on the database after deployment script has been executed"
                    $databaseSupportsStoringDacpac = $false
                }
			}

			# Replace "$(DatabaseName)" with database name
			$script = $script.Replace('$(DatabaseName)', $databaseName)

			$scriptFileName = "CommerceRuntimeScripts_$($currentDbVersion)_$targetVersion.sql"
			$scriptFilePath = Join-Path $logBasePath $scriptFileName

			# save script to file
			$script | Out-File -FilePath $scriptFilePath
			$script | Out-File -FilePath "$scriptFilePath.log" # most of the infrastructure discriminates .log extensions

			Log-TimedMessage "$databaseName - script created. It can be found at $scriptFilePath"

			# Run script
			# Before we begin, we create a record, which contains the DACPAC file in binary format, indicating that the upgrade has started, but not yet completed successfully
			# After the upgrade script runs, it alters this record's status to complete
			Log-TimedMessage "$databaseName - Storing upgrade DAPAC on the database.";

			[Byte[]]$dacpacFileBytes = [io.file]::ReadAllBytes($packageFilepath)
			$updateDacParams = @{ 'dacpacFileBytes' = $dacpacFileBytes }

			# First we check if DB has table & column to store dacpac, otherwise skip this step
			# Legacy versions of the databse may not have the table or the specific column to store DACPAC
			if ($databaseSupportsStoringDacpac)
			{
				# RETAIL-PENDING means that the upgrade is not yet complete, database script is responsible for moving state to success
				$retailPendingUpgradeType = "RETAIL-PENDING"
				$insertPendingUpgradeRecord = @"
				IF NOT EXISTS (SELECT * FROM [CRT].[RETAILUPGRADEHISTORY] WHERE UPGRADETYPE = '$retailPendingUpgradeType' AND BUILD = '$targetVersion')
					INSERT [crt].[RETAILUPGRADEHISTORY] (UpgradeType, FilePath, FileName, Build, DACPACFILE)
												 VALUES ('$retailPendingUpgradeType', '$scriptFilePath', '$scriptFileName', '$targetVersion', @dacpacFileBytes)
"@
				$database.Execute($updateDacParams, $insertPendingUpgradeRecord)
				Log-TimedMessage "$databaseName - Successfully stored DACPAC on the database.";
			}
			else
			{
				Log-TimedMessage "$databaseName - Database does not support storing DACPACs. DACPAC will be stored after database upgrade adds DACPAC storage support.";
			}


            $pendingDeploymentViewName = '__RETAIL_PENDING_DEPLOYMENT'
            Log-TimedMessage "$databaseName - Checking whether a previous channel database deployment was not deployed successfully. This will be done by checking whether view $pendingDeploymentViewName exists in DBO";
		    $retailPendingDeploymentViewExists = $database.ExecuteScalar("SELECT OBJECT_ID('$pendingDeploymentViewName')") -ne $null

            if ($retailPendingDeploymentViewExists)
            {
                throw "$databaseName - a previous incomplete deployment was identified. The channel database deployment will not continue to prevent corruption of the database. If you see this message during a retry, please check the previous retry logs for the original error message. To ignore this check and force retry (please make sure you know the implications), execute the following script against the database and retry: DROP VIEW $pendingDeploymentViewName;"
            }
            else
            {
                Log-TimedMessage "$databaseName - No previous incomplete deployment was detected. Creating view $pendingDeploymentViewName to signal begining of deployment.";
                $database.Execute("CREATE VIEW $pendingDeploymentViewName AS SELECT 1 A;")
            }

			Log-TimedMessage "$databaseName - Starting script execution. This may take several minutes.";
			$database.ExecuteSqlText($script)
			Log-TimedMessage "$databaseName - Script executed successfully. Removal of $pendingDeploymentViewName will be done next.";

            $database.Execute("IF OBJECT_ID('$pendingDeploymentViewName') IS NOT NULL DROP VIEW $pendingDeploymentViewName;")

			Log-TimedMessage "$databaseName - View $pendingDeploymentViewName was removed.";

			# To support legacy databases that do not support storing DACPACs we need to wait until the end of the upgrade to store the DACPAC
			# This applies to CTP8 and some 7.0 builds before or at 7.0.1265.27563
			if (-not $databaseSupportsStoringDacpac)
			{
				Log-TimedMessage "$databaseName - Legacy database support - Storing DACPAC on database.";
				$database.Execute($updateDacParams, "UPDATE [crt].[RETAILUPGRADEHISTORY] SET DACPACFILE = @dacpacFileBytes WHERE UPGRADETYPE = 'RETAIL' AND BUILD = '$targetVersion'")
				Log-TimedMessage "$databaseName - DACPAC stored on database.";
			}

			$updateDacParams = $null
			$dacpacFileBytes = $null
		}
		else
		{
			Log-TimedMessage "$databaseName - deployment will not continue because database is at same version or newer than upgrade package version."
		}
	}
	catch
	{
		$executionSuccessfull = $false
		throw
	}
	finally
	{
		if ($database)
		{
			$database.Dispose()
		}

		if ($targetDacpac)
		{
			$targetDacpac.Dispose()
		}

		if ($currentDacpac)
		{
			$currentDacpac.Dispose()
		}

		# This is a workaround because we cannot get the log path when running in LCS
		# We need to wait until dispose of database because logs may only be flushed to disk after disposal
		if (-not $executionSuccessfull -and (Test-Path $databaseLogFilepath))
		{
			Log-TimedMessage "$databaseName -------------------- Start of dump of DB logs"
			cat $databaseLogFilepath
			Log-TimedMessage "$databaseName -------------------- End of dump of DB logs"
		}
	}

	Log-TimedMessage "$databaseName - Deployment completed.";
}

<#
.SYNOPSIS
Deploys one or more databases.

.DESCRIPTION
For each configured database in $dbConfigurations, a new database is created if it doesn't current exist.
An existing database is upgraded to the version associated with the database packaged provided in such configuration object.

.PARAMETER dbConfigurations
A collection of dbConfiguration. A dbConfiguration is a dictionary containing the configuration for each database to be deployed.
The following properties are accepted:
	[string]DatabaseName				(required) - the name of the database
	[string]ServerName					(required) - the name (or uri) of the database server
	[stirng]InstanceName				(optional) - the instance of the server database to connect to
	[string]Install						(optional) - if present and equals to "true" the database is deployed, otherwise it is skiped.
	[string]DacpacFilePath				(required) - a path to where the DAC package and associated deployment artifacts are.
	[array]WindowsLogins				(optinal) - a list of window user groups to be created or associated to the database. See Create-UserGroups for details.
	MaxSqlServerMemoryLimitRatio		(optinal) - see Alter-DatabaseParameters function
	DatabaseFilesMinSizeInMB			(optinal) - see Alter-DatabaseParameters function
	DatabaseFilesGrowthRateInPercent	(optinal) - see Alter-DatabaseParameters function
	DatabaseAutoClose					(optinal) - see Alter-DatabaseParameters function

.PARAMETER credentials
A collection of credentials to be used for this deployment. If no credentials are provided, integrated windows authentication with SQL Server
will be used. If credentials is provided, it will only be used if for each entry of dbConfigurations there is a 'SqlUserName' property containing
the user name to be used for SQL authentication.

.PARAMETER logBasePath
A optinal path to a directory where to write additional log files. If not provided, $pwd is assumed.

.EXAMPLE
Deploy-Database -databaseName "ChannelDb" -connectionString "Server=localhost;Integrated Security=true;" -deployableBasePath "C:\dbDeployables"
#>
function Deploy-DatabaseConfiguration(
    [Parameter(Mandatory=$true)]
	[ValidateNotNull()]$dbConfigurations,

    [Parameter(Mandatory=$false)]
	[System.Management.Automation.PSCredential[]]$credentials,

	[Parameter(Mandatory=$false)]
	[string]$logBasePath)
{
	$deploymentWillContinueMessage = "Deployment will continue for other databases, but this deployment will be marked as failed."
	$failedDatabaseDeployments = @()

	# resolve where to log things to
	$logBasePath = @($logBasePath, $global:logdir, $pwd) | where { $_ } | Select-Object -First 1
	$logBasePath = Join-Path $logBasePath "RetailChannelDatabaseLogs" | Join-Path -ChildPath $(Get-Date -f yyyy-MM-dd_hh-mm-ss)
	Log-TimedMessage "Database deployment logs will be available at: $logBasePath"

	$numberOfDatabases = $dbConfigurations.count

    Log-TimedMessage "Deploying $numberOfDatabases databases."

	$dacValidatorToolLookupPaths = @((Join-Path $PSScriptRoot "DacTools\Microsoft.Dynamics365.Commerce.Tools.DacValidator.dll"),
							 (Join-Path $PSScriptRoot "Microsoft.Dynamics365.Commerce.Tools.DacValidator.dll"),
							".\Microsoft.Dynamics365.Commerce.Tools.DacValidator.dll")

	$dacValidatorToolPath = $dacValidatorToolLookupPaths | where { Test-Path $_ } | Select-Object -First 1

	if (-not $dacValidatorToolPath)
	{
		Throw-Error "Microsoft.Dynamics365.Commerce.Tools.DacValidator.dll could not be found. The following paths were used to try to find it: $dacValidatorToolLookupPaths"
	}

	Log-TimedMessage "Loading validation tools from '$dacValidatorToolPath'"
	Add-Type -Path $dacValidatorToolPath

	$index = 0
    foreach($dbConfiguration in $dbConfigurations)
    {
		$index = $index + 1
		[string]$databaseName = [string]$dbConfiguration.DatabaseName
		[string]$serverName = [string]$dbConfiguration.ServerName
		[string]$deployableBasePath = [string]$dbConfiguration.DacpacFilePath
		[string]$customizationsBasePath = [string]$dbConfiguration.CustomScriptPath

		# Topology settings differ, some will provide the path relative to the script path, instead of PWD
		if ($deployableBasePath -and -not (Test-Path $deployableBasePath))
		{
			Log-TimedMessage "$databaseName - Deployable base path not found. Trying to resolve $deployableBasePath relatively to script path at $PSScriptRoot"
			$deployableBasePath = Join-Path $PSScriptRoot $deployableBasePath
		}

		if ($customizationsBasePath -and -not (Test-Path $customizationsBasePath))
		{
			Log-TimedMessage "$databaseName - Customization script base path not found. Trying to resolve $customizationsBasePath relatively to script path at $PSScriptRoot"
			$customizationsBasePath = Join-Path $PSScriptRoot $customizationsBasePath
		}

		Log-TimedMessage "$databaseName - Processing database $index of $numberOfDatabases"

        if($dbConfiguration.Install -eq "true")
        {
			Log-TimedMessage "$databaseName - Deploying database"

			$dbCredential = $null
			$sqlUserName = $dbConfiguration.SqlUserName
			if ($sqlUserName)
			{
				$dbCredential = $credentials | where { $_.UserName -eq $sqlUserName }

				if (-not $dbCredential)
				{
					Log-TimedWarning "$databaseName - was requested to be deployed using user $sqlUserName, but no credentials found for such user. Deployment will try to continue with integrated authentication but may fail."
				}
			}

			$connectionString = Get-ConnectionString -serverName $serverName `
													 -databaseName $databaseName `
													 -instanceName $dbConfiguration.InstanceName  `
													 -credential $dbCredential

			$logFolder = Join-Path $logBasePath $databaseName
			$deploymentFailed = $false

			# Deploy MS artifacts
			try
			{
				if([string]::IsNullOrWhiteSpace($deployableBasePath))
				{
					Log-TimedWarning "$databaseName - deployableBasePath is null or empty. Deployment of Microsoft artifacts will be skipped"
				}
				else
				{
					Deploy-Database -databaseName $databaseName -connectionString $connectionString -deployableBasePath $deployableBasePath -logFolder $logFolder
					Log-TimedMessage "$databaseName - Microsoft artifacts were deployed successfully (or skipped if previous message says so).";
				}
			}
			catch
			{
				Log-Error "$databaseName - An error occurred when deploying database. $deploymentWillContinueMessage"
				Log-Exception $_
				$deploymentFailed = $true
			}

			# Alter DB parametes
			if (-not $deploymentFailed)
			{
				try
				{
					Log-TimedMessage "$databaseName - Altering database parameters.";
					Alter-DatabaseParameters -databaseName $databaseName -connectionString $connectionString `
											-maxSqlMemoryLimitRatio $dbConfiguration.MaxSqlServerMemoryLimitRatio `
											-databaseFileMinSizeMB $dbConfiguration.DatabaseFilesMinSizeInMB `
											-databaseFileGrowthPercentage $dbConfiguration.DatabaseFilesGrowthRateInPercent `
											-databaseAutoClose $dbConfiguration.DatabaseAutoClose
					Log-TimedMessage "$databaseName - Altering database completed.";
				}
				catch
				{
					Log-Error "$databaseName - An error occurred when altering database parameters. $deploymentWillContinueMessage"
					Log-Exception $_
					$deploymentFailed = $true
				}
			}

			# Setup users
			# We only setup windows users if we have $dbCredential NOT set :(
			# This is because deployment topologies that provide $dbCredential are the same topologies that cannot work with integrated Windows authentication
			if (-not $deploymentFailed -and $dbConfiguration.WindowsLogins -and -not $dbCredential)
			{
				# this is only windows users
				Create-UserGroups -databaseName $databaseName -serverName $serverName -connectionString $connectionString -groupMappings $dbConfiguration.WindowsLogins
			}

			# Deploy customizations as last step
			if (-not $deploymentFailed)
			{
				Log-TimedMessage "$databaseName - Deploying customizations";

				try
				{
					if([string]::IsNullOrWhiteSpace($customizationsBasePath))
					{
						Log-TimedWarning "$databaseName - customizationsBasePath is null or empty. Deployment of customizations will be skipped"
					}
					else
					{
						Deploy-Customizations -databaseName $databaseName -connectionString $connectionString -customizationsBasePath $customizationsBasePath -logFolder $logFolder
						Log-TimedMessage "$databaseName - Customization deployment completed successfully.";
					}
				}
				catch
				{
					Log-Error "$databaseName - An error occurred when deploying customizations for database. $deploymentWillContinueMessage"
					Log-Exception $_
					$deploymentFailed = $true
				}
			}

			if ($deploymentFailed)
			{
				$failedDatabaseDeployments += $databaseName
			}

			Log-TimedMessage "$databaseName - Deployment for '$databaseName' finished $(if ($deploymentFailed) { 'with errors' } else { 'successfully' })."
        }
        else
        {
            Log-TimedMessage "$databaseName - Skipping installation for database '$databaseName' because it was not configured for installation."
        }

        $dbConfiguration = $null
    }

	if ($failedDatabaseDeployments)
	{
		Throw-Error "Database upgrade FAILED for the following databases: $($failedDatabaseDeployments -join ', '). You may find more logs under: $logBasePath"
	}
}

# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBvcW4i+0XOMGBl
# /+z9vQqo4MS/OsLS5W2xiSgVTulLnaCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCD/
# Ehzbjn+IMBEI24EwPjkiEluKMshFzwwRpS/JzNdHszCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBI
# c7uVh6FsFMM3OUD1gIKnEzBPznIDYPXeTdWazBcCvlJlydJYtb2YxyHK82k3LSH/
# nK1v4AsUefdAo/O0Xnw22+jcdk9xpShxBS6LAqWhI1eQrF6On8JWPQdqvRQgDJGa
# YxMSAhNBRB5LlKH20jlV/ej4IUVYMuhUCGl0/9E9tC3NCYFh3eiI4ZxhF2tweH7X
# DHGBUmMjKw+U8UMg17mgOZQtQ0w9JI3fZvB4W/ELKUWun27IT8X+IsWsvwOkxcn9
# RkqgpXDtE8X3txFaKtNMfYt59zOVLmWoEYafLq7mvJGr1w4WQHnK4hivIPomCpkP
# a/SGyJ2a56Va6XyqOv5hoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IBshdkLiVHjbzP0ZhUaUW3fkhesSrbUm37Jn2A5ZBmNTAgZfPSuXhtQYEzIwMjAw
# ODIzMDQwMjQ5LjM3NFowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
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
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQg4PqxjpMJEKIbMtqvgbQfzWvm8tRVWKoj
# xZ6hMJpkzPwwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCBXAzYkM7qhDCgN
# 6EbxXbZtR3HNkNZaGSMYHzfL5NKsqjCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABClLIOQFS0XBLAAAAAAEKMCIEIBqZiGzGyIFc26q+
# oooMu/H2aOjzZBnUZTqvwvMjKN1IMA0GCSqGSIb3DQEBCwUABIIBADLklL2o8BR4
# 3z/Pq4ed853WSpL2ki9T8Mt3x6SW8o4ZGs3rfs3NnbXeFPxK5WK3kyjwNWilYApR
# 4K1dM5L7x94SmQMNBQhWyn3w9frgADUKrD/1v9CRxRFk/Dh+F/AVjIkiNJh6/h4w
# TyRS7d/v3emIaCUmtAJXvIENtbZfCwmiWNPB3pKqR10ajpqJwOqRRswyt/sdLzLM
# 0FfUP74JYdkTtrByZmulqUwAh1XqMgv7D2QlAr+gqAXcUG5VJnYoiNrMUGrnf8vK
# 4LIb/bEsjtB3aZt2UPxSyy2I9kkfG8JV1FQnfCqVmcEbWFjss/7MONXirpQiT27B
# vhXd0YD7Ur0=
# SIG # End signature block
