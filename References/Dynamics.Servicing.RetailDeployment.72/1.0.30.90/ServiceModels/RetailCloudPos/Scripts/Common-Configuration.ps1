<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

${global:PrerequisiteFailureReturnCode} = 100

function New-ErrorObject(
    [int]$ErrorCode = $(throw 'ErrorCode is required'),
    [string]$ErrorDescription = $(throw 'ErrorDescription is required'),
    [string]$ErrorResolution,
    $InnerErrorObject)
{
    $errorObject = New-Object System.Object
    [void]($errorObject | Add-Member -type NoteProperty -name ErrorCode -value $ErrorCode -Force)
    [void]($errorObject | Add-Member -type NoteProperty -name ErrorDescription -value $ErrorDescription -Force)
    [void]($errorObject | Add-Member -type NoteProperty -name ErrorResolution -value $ErrorResolution -Force)
    [void]($errorObject | Add-Member -type NoteProperty -name InnerErrorObject -value $InnerErrorObject -Force)
    return $errorObject
}

function Test-CustomErrorObject($errorObject)
{
    return $errorObject -and $errorObject.ErrorCode -and $errorObject.ErrorDescription
}

# This table is to be extended with new errors.
function Get-ErrorTable
{
    if($global:__ErrorObjects -eq $null)
    {
        [hashtable]$global:__ErrorObjects = @{
            'ModernPosGpUpdateFailed' = New-ErrorObject -ErrorCode 300001 `
                -ErrorDescription "Installer wasn't able to update group policy. Retail Modern POS has been installed for the administrator account that ran the installer." `
                -ErrorResolution 'Check connectivity to the domain controller. Running "gpupdate /force" from a Command Prompt fixes the issue once connectivity has returned. If this command is not run, Retail Modern POS will not be installed for any other user in the system.'
        }
    }

    return $global:__ErrorObjects;
}

function Get-ErrorObject([string]$errorId = $(throw 'errorId is required'))
{
    $errorTable = Get-ErrorTable
    $result = $errorTable[$errorId]

    if($result -eq $null)
    {
        $result = New-ErrorObject -ErrorCode 300000 -ErrorDescription ('Unknown error code ID "{0}".' -f  $errorId)
    }
    
    $stackTraceString = Get-PsCallStack | Format-Table Command, Location -AutoSize | Out-String -Width 4096
    [void]($result | Add-Member -type NoteProperty -name StackTrace -value $stackTraceString -Force)
    
    return $result
}

function Add-NonTerminatingError([string]$errorId = $(throw 'errorId is required'))
{
    if($global:__NonTerminatingError -eq $null)
    {
        [array]$global:__NonTerminatingError = @()
    }
    
    $errorObject = Get-ErrorObject -errorId $errorId 
    
    # Add to the head similar of what $error variable is.
    $global:__NonTerminatingError = @($errorObject) + $global:__NonTerminatingError
}

function Get-NonTerminatingError
{
    $result = @()
    if($global:__NonTerminatingError)
    {
        $result = $global:__NonTerminatingError.Clone()
    }
    
    return $result
}

function Get-LastNonTerminatingError
{
    return Get-NonTerminatingError | Select-Object -First 1
}

function Expand-VariablesFromSettingsFile([string]$inputXmlFilePath, [string]$settingsXmlFilePath)
{
    if((Test-Path -Path $inputXmlFilePath) -ne $True)
    {
        throw "File $inputXmlFilePath was not found!";
    }

    if((Test-Path -Path $settingsXmlFilePath) -eq $True)
    {
        [xml]$settingsXml = get-content $settingsXmlFilePath;
        $settingsNodes = $settingsXml.selectNodes("Settings/Setting");
        [hashtable]$settingsTable = @{};
        foreach($settingsNode in $settingsNodes)
        {
            $key = $settingsNode.GetAttribute("key");
            $value = $settingsNode.GetAttribute("value");
            $settingsTable.Add($key, $value)
        }
    }
    
    [hashtable]$expandedSettingsTable = $settingsTable
    # Make a multiple passes through the values to expand values, push into new hashtable
    # This is in case if a = 'a', b = [a]\something, c = [b]
    # In this case after first pass, b = 'a\something', c = '[a]\something' 
    # After second pass, b = 'a\something', c='a\something'
    # Let's make 5 passes.
    $MaxPasses = 5
    for($pass = 0; $pass -lt $MaxPasses; ++$pass)
    {
        $settingsTable = $expandedSettingsTable
        $expandedSettingsTable = @{}
        foreach($settingsKey in $settingsTable.Keys)
        {
            $settingsValue = $settingsTable[$settingsKey]
            $updatedSettingsValue = $settingsValue;

            # does the value include a placeholder? If so, update it after looking it up.
            $matches = [System.Text.RegularExpressions.Regex]::Matches($settingsValue, "(\[\w+\])")
            if($matches -ne $null)
            {
                foreach($match in $matches)
                {  
                    $key = ($match.Groups[1].Value).Replace("[", "").Replace("]", "")
                    $value = $settingsTable[$key]
                    $updatedSettingsValue = $updatedSettingsValue.Replace("[" + $key + "]", $value);
                }
            }
            
            $expandedSettingsTable.Add($settingsKey, $updatedSettingsValue);
        }
    }
    
    return Expand-VariablesFromTable $inputXmlFilePath $expandedSettingsTable
}

function Expand-VariablesFromTable([string]$inputXmlFilePath, [hashtable]$settingsTable)
{
    if((Test-Path -Path $inputXmlFilePath) -ne $True)
    {
        throw "File $inputXmlFilePath was not found!";
    }

    [string]$content = get-content $inputXmlFilePath;

    if($settingsTable -ne $null)
    {
        foreach($key in $settingsTable.Keys)
        {
            $value = $settingsTable[$key];
            $content = $content.Replace("[" + $key + "]", $value);
        }
    }

    $content = [System.Environment]::ExpandEnvironmentVariables($content);
    
    $outputXml = New-Object -TypeName System.Xml.XmlDocument;
    $outputXml.LoadXml($content);
    $tempOutputFile = [System.IO.Path]::GetTempFileName()
    $outputXml.Save($tempOutputFile)
    Log-TimedMessage ('Saved topology file at "{0}"' -f $tempOutputFile)
    
    Log-TimedMessage 'Making sure all settings were expanded'
    $matches = [System.Text.RegularExpressions.Regex]::Matches($content, "(\[\w+\])")
    if($matches -ne $null)
    {
        foreach($match in $matches)
        {  
            $values += " " + $match.Groups[1].Value;
        }
    
        throw "Found the following tokens that did not have values supplied:$values!";
    }

    return $outputXml;
}

function Get-DatabaseConfigurationFromXPath([xml]$xmlDocument, [string]$xpath)
{
    $nodelist = $xmlDocument.selectnodes($xpath)
    $firstnode = $nodelist.item(0)
    
    if($nodelist -eq $null)
    {
        throw "Could not find expected node $xpath";
    }
    
    return Get-DatabaseConfiguration $xmlDocument $firstNode
}

function Get-DatabaseConfigurationsFromXmlNodeList([xml]$xmlDocument, $xmlNodeList)
{
    [array]$dbConfigs = @();
    foreach($xmlNode in $xmlNodeList)
    {
        $dbConfig = Get-DatabaseConfiguration $xmlDocument $xmlNode
        $dbConfigs = $dbConfigs + $dbConfig
    }

    # , Forces PowerShell to return empty array instead of null.
    return ,$dbConfigs
}

function Get-DatabaseConfiguration([xml]$xmlDocument, $dbConfigNode)
{
    if($verbose -eq $true)
    {
        Write-Host Found config $dbConfigNode.get_OuterXml();
    }

    [hashtable]$ht = @{};
    $ht.Install = $dbConfigNode.GetAttribute("install");
    $ht.DropIfExists = $dbConfigNode.GetAttribute("dropifexists");
    $ht.ServerName = $dbConfigNode.SelectSingleNode("ServerName").get_InnerXml();
    $ht.InstanceName = $dbConfigNode.SelectSingleNode("ServerNamedInstanceName").get_InnerXml();
    $ht.DatabaseName = $dbConfigNode.SelectSingleNode("DatabaseName").get_InnerXml();
    $ht.InstallationType = $dbConfigNode.SelectSingleNode("Installation/InstallationType").get_InnerXml();
    $installationValueNode  = $dbConfigNode.SelectSingleNode("Installation/InstallationValue");
	$maxSqlServerMemoryLimitRatio = $dbConfigNode.SelectSingleNode("Installation/MaxSqlServerMemoryLimitRatio");
    $upgradeNode = $dbConfigNode.SelectSingleNode("Installation/Upgrades");
    $databaseFilesMinSizeInMB = $dbConfigNode.SelectSingleNode("Installation/DatabaseFilesMinSizeInMB");
    $databaseFilesGrowthRateInPercent = $dbConfigNode.SelectSingleNode("Installation/DatabaseFilesGrowthRateInPercent");
    $databaseAutoClose = $dbConfigNode.SelectSingleNode("Installation/DatabaseAutoClose");
    
	$sqlUserNameNode = $dbConfigNode.SelectSingleNode("SqlUserName")
	if($sqlUserNameNode)
	{
		$ht.SqlUserName = $sqlUserNameNode.get_InnerXml();
	}
	
	if($maxSqlServerMemoryLimitRatio -ne $null)
	{
		$ht.MaxSqlServerMemoryLimitRatio = $maxSqlServerMemoryLimitRatio.get_InnerXml();
	}

	if($databaseFilesMinSizeInMB)
	{
		$ht.DatabaseFilesMinSizeInMB = $databaseFilesMinSizeInMB.get_InnerXml();
	}    
    
	if($databaseFilesGrowthRateInPercent)
	{
		$ht.DatabaseFilesGrowthRateInPercent = $databaseFilesGrowthRateInPercent.get_InnerXml();
	}

    if($ht.ServerName -ilike '*.database.windows.net')
    {
        $ht.IsSqlAzure = $true
    }
    else
    {
        $ht.IsSqlAzure = $false
    }
    if($databaseAutoClose)
    {
        # This is boolean value.
        $ht.DatabaseAutoClose = $databaseAutoClose.get_InnerXml().Trim() -eq 'true'
    }
    
	if($installationValueNode -ne $null)
    {
        $ht.InstallationValue = $installationValueNode.get_InnerXml();
    }
    else
    {
        $ht.InstallationValue = [string]::Empty;
    }

    # sql auth
    [array]$SqlLogins = @();
    foreach($node in $dbConfigNode.SelectNodes("SqlLogin"))
    {
        [hashtable]$sqlLogin = @{};
        $sqlLogin.Id = $node.GetAttribute("id");
        $sqlLogin.Name = $node.GetAttribute("Name");
        $sqlLogin.Password = $node.GetAttribute("Password");
        $sqlLogin.MappedSqlRoleName = $node.GetAttribute("MappedSqlRoleName");
        $SqlLogins = $SqlLogins + $sqlLogin
    }
    $ht.SqlLogins = $SqlLogins

    # windows auth
    [array]$WindowsLogins = @();
    foreach($node in $dbConfigNode.SelectNodes("WindowsLogin"))
    {
        [hashtable]$windowsLogin = @{};
        $windowsLogin.Id = $node.GetAttribute("id");
        $windowsLogin.GroupName = $node.GetAttribute("GroupName");
        $windowsLogin.CreateIfNotExists = $node.GetAttribute("CreateIfNotExists");
        $windowsLogin.UserName = $node.GetAttribute("UserName");
        $windowsLogin.MappedSqlRoleName = $node.GetAttribute("MappedSqlRoleName");
        $WindowsLogins = $WindowsLogins + $windowsLogin
    }
    $ht.WindowsLogins = $WindowsLogins

    # upgrades
    if($upgradeNode -ne $null)
    {
        $RetailScriptPath = $upgradeNode.SelectSingleNode("RetailScriptPath").get_InnerXml();
        $ht.RetailScriptPath = $RetailScriptPath;
        $CustomScriptPath = $upgradeNode.SelectSingleNode("CustomScriptPath").get_InnerXml();
        $ht.CustomScriptPath = $CustomScriptPath;
        $DacpacFilePath = $upgradeNode.SelectSingleNode("DacpacFilePath").get_InnerXml();
        $ht.DacpacFilePath = $DacpacFilePath;
    }

    return $ht;
}

function Get-TrustedIdentityTokenIssuerConfiguration([xml]$xmlDocument, $firstnode)
{
    if($verbose -eq $true)
    {
        Write-Host Found config $firstnode.get_OuterXml();
    }

    [hashtable]$ht = @{};

    $ht.Name = $firstnode.SelectSingleNode("Name").get_InnerXml();
    $ht.Description = $firstnode.SelectSingleNode("Description").get_InnerXml();
    $ht.IdClaimTypeDisplayName = $firstnode.SelectSingleNode("IdClaimTypeDisplayName").get_InnerXml();
    $ht.Realm = $firstnode.SelectSingleNode("Realm").get_InnerXml();
    $ht.SignInUrl = $firstnode.SelectSingleNode("SignInUrl").get_InnerXml();
    $ht.CertificateDirectory = $firstnode.SelectSingleNode("CertificateDirectory").get_InnerXml();
    $ht.CertificateLocalCopyDirectory = $firstnode.SelectSingleNode("CertificateLocalCopyDirectory").get_InnerXml();
    $ht.SigningCertificateCerFileName = $firstnode.SelectSingleNode("SigningCertificateCerFileName").get_InnerXml();
    $ht.SigningCertificatePfxFileName = $firstnode.SelectSingleNode("SigningCertificatePfxFileName").get_InnerXml();
    $ht.SigningCertificatePfxPassword = $firstnode.SelectSingleNode("SigningCertificatePfxPassword").get_InnerXml();
    $ht.SigningCertificateThumbprint = $firstnode.SelectSingleNode("SigningCertificateThumbprint").get_InnerXml();
    $ht.SigningCertificateUser = $firstnode.SelectSingleNode("SigningCertificateUser").get_InnerXml();
    $ht.SslCertificateAuthorityCerFileName = $firstnode.SelectSingleNode("SslCertificateAuthorityCerFileName").get_InnerXml();
    $ht.SslCertificateAuthorityThumbprint = $firstnode.SelectSingleNode("SslCertificateAuthorityThumbprint").get_InnerXml();

    return $ht;
}

function Get-WebApplicationConfiguration([xml]$xmlDocument, $firstnode)
{
    if($verbose -eq $true)
    {
        Write-Host Found config $firstnode.get_OuterXml();
    }

    [hashtable]$ht = @{};
    $ht.Id = $firstnode.GetAttribute("id");
    $ht.Install = $firstnode.GetAttribute("install");
    $ht.DeleteIfExists = $firstnode.GetAttribute("deleteifexists");
    $ht.ApplicationPoolAccount = $firstnode.SelectSingleNode("ApplicationPoolAccount").get_InnerXml();
    $ht.ApplicationPoolName = $firstnode.SelectSingleNode("ApplicationPoolName").get_InnerXml();

    $sslBindingNode = $firstnode.SelectSingleNode("SSLBinding")
    if($sslBindingNode -ne $null)
    {
        $ht.Port = $sslBindingNode.SelectSingleNode("Port").get_InnerXml();
        $ht.IISSiteName = $sslBindingNode.SelectSingleNode("IISSiteName").get_InnerXml();
        $ht.CertificateThumbprint = $sslBindingNode.SelectSingleNode("CertificateThumbprint").get_InnerXml();

        $certificateNode = $sslBindingNode.SelectSingleNode("Certificate")
        if ($certificateNode -ne $null)
        {
            $ht.CertificateDirectory = $certificateNode.SelectSingleNode("CertificateDirectory").get_InnerXml();
            $ht.CertificatePfxFileName = $certificateNode.SelectSingleNode("CertificatePfxFileName").get_InnerXml();
            $ht.CertificateLocalCopyDirectory = $certificateNode.SelectSingleNode("CertificateLocalCopyDirectory").get_InnerXml();
            $ht.CertificatePfxPassword = $certificateNode.SelectSingleNode("CertificatePfxPassword").get_InnerXml();
        }
    }
    
    # zones
    [array]$Zones = @();
    foreach($node in $firstnode.SelectNodes("Zone"))
    {
        [hashtable]$zone = @{};
        $zone.Id = $node.SelectSingleNode("Id").get_InnerXml();
        $zone.Name = $node.SelectSingleNode("Name").get_InnerXml();
        $zone.Url = $node.SelectSingleNode("Url").get_InnerXml();
        $zone.AuthenticationProvider = $node.SelectSingleNode("AuthenticationProvider").get_InnerXml();
        $zone.AllowAnonymousAccess = $node.SelectSingleNode("AllowAnonymousAccess").get_InnerXml();
        $claimsAuthUrlNode = $node.SelectSingleNode("ClaimsAuthenticationRedirectionUrl");
        if($claimsAuthUrlNode -ne $null)
        {
            $zone.ClaimsAuthenticationRedirectionUrl = $claimsAuthUrlNode.get_InnerXml();
        }
        $Zones = $Zones + $zone
    }
    $ht.Zones = $Zones


    return $ht;
}

function Get-SiteCollectionConfiguration([xml]$xmlDocument, $firstnode)
{
    if($verbose -eq $true)
    {
        Write-Host Found config $firstnode.get_OuterXml();
    }

    [hashtable]$ht = @{};
    $ht.Id = $firstnode.GetAttribute("id");
    $ht.Install = $firstnode.GetAttribute("install");
    $ht.DeleteIfExists = $firstnode.GetAttribute("deleteifexists");
    $ht.Url = $firstnode.SelectSingleNode("Url").get_InnerXml();
    $ht.Name = $firstnode.SelectSingleNode("Name").get_InnerXml();
    $ht.OwnerEmail = $firstnode.SelectSingleNode("OwnerEmail").get_InnerXml();
    $ht.OwnerAlias = $firstnode.SelectSingleNode("OwnerAlias").get_InnerXml();
    $ht.Template = $firstnode.SelectSingleNode("Template").get_InnerXml();

    $node = $firstnode.SelectSingleNode("ResultsPageAddress");
    if($node -ne $null)
    {
        $ht.ResultsPageAddress = $node.get_InnerXml();
    }


    $node = $firstnode.SelectSingleNode("DisableVersioning");
    if($node -ne $null)
    {
        $ht.DisableVersioning = $node.get_InnerXml();
    }

    $node = $firstnode.SelectSingleNode("HostHeaderWebApplicationUrl");
    if($node -ne $null)
    {
        $ht.HostHeaderWebApplicationUrl = $node.get_InnerXml();
    }

    $node = $firstnode.SelectSingleNode("LanguageId");
    if($node -ne $null)
    {
        $ht.LanguageId = $node.get_InnerXml();
    }
    
    # site urls
    [array]$SiteUrls = @();
    foreach($node in $firstnode.SelectNodes("SiteUrls/SiteUrl"))
    {
        [hashtable]$siteUrl = @{};
        $siteUrl.Zone = $node.GetAttribute("zone")
        $siteUrl.Url = $node.GetAttribute("url")
        $SiteUrls = $SiteUrls + $siteUrl
    }
    $ht.SiteUrls = $SiteUrls

    # SPWebSettings
    [array]$SPWebSettings = @();
    foreach($node in $firstnode.SelectNodes("SPWebSettings/SPWebSetting"))
    {
        [hashtable]$sPWebSetting = @{};
        $sPWebSetting.Name = $node.GetAttribute("name")
        $sPWebSetting.Value = $node.GetAttribute("value")
        $SPWebSettings = $SPWebSettings + $sPWebSetting
    }
    $ht.SPWebSettings = $SPWebSettings

    # SPWeb AllProperties 
    [array]$SPWebAllProperties = @();
    foreach($node in $firstnode.SelectNodes("SPWebAllProperties/SPWebAllPropertiesItem"))
    {
        [hashtable]$sPWebAllPropertiesItem = @{};
        $sPWebAllPropertiesItem.Name = $node.GetAttribute("name")
        $sPWebAllPropertiesItem.Value = $node.GetAttribute("value")
        $SPWebAllProperties = $SPWebAllProperties + $sPWebAllPropertiesItem
    }
    $ht.SPWebAllProperties = $SPWebAllProperties

    return $ht;
}

function Get-WspGenerationConfiguration([xml]$xmlDocument, $firstnode)
{
    if($verbose -eq $true)
    {
        Write-Host Found config $firstnode.get_OuterXml();
    }

    [hashtable]$ht = @{};
    $ht.Generate = $firstnode.GetAttribute("generate");
    $ht.Deploy = $firstnode.GetAttribute("deploy");
    $ht.Retract = $firstnode.GetAttribute("retract");
    $ht.InstallScope = $firstnode.SelectSingleNode("InstallScope").get_InnerXml();
    
    $packageIdentifierNode = $firstnode.SelectSingleNode("PackageIdentifier");
    if ($packageIdentifierNode -ne $null)
    {
        $ht.PackageIdentifier = $packageIdentifierNode.get_InnerXml();
    }
    
    if($ht.InstallScope -eq "web")
    {
        $installScopeWebXPathNode = $firstnode.SelectSingleNode("InstallScopeWebAppXPath");
        if($installScopeWebXPathNode -ne $null)
        {
            if($installScopeWebXPathNode.get_InnerXml() -ne "")
            {
                $webApp = $xmlDocument.selectsinglenode($installScopeWebXPathNode.get_InnerText());
                $webAppConfig = Get-WebApplicationConfiguration $xmlDocument $webApp;
                $ht.InstallScopeWebUrl = $webAppConfig.Zones[0].Url;
            }
        }
    }
    
    $ht.RootFolder = $firstnode.SelectSingleNode("RootFolder").get_InnerXml();
    $ht.OutputWspName = $firstnode.SelectSingleNode("OutputWspName").get_InnerXml();
    $ht.InputWspName = $firstnode.SelectSingleNode("InputWspName").get_InnerXml();


    [hashtable]$featureProperties = @{};
    $featurePropertyNodes = $firstnode.selectNodes("FeatureProperties/Property");
    foreach($featurePropertyNode in $featurePropertyNodes)
    {
        $key = $featurePropertyNode.GetAttribute("Key");
        $value = $featurePropertyNode.GetAttribute("Value");
        $featureProperties.Add($key, $value);
    }
    
    $connectionStringPropertyNodes = $firstnode.selectNodes("PropertyForConnectionString");
    foreach($connectionStringPropertyNode in $connectionStringPropertyNodes)
    {
        $property = Get-ConnectionStringPropertyFromConfigurationXmlNode $connectionStringPropertyNode
        $featureProperties.Add($property.Key, $property.Value);
    }
    
    $ht.FeatureProperties = $featureProperties;
    return $ht;
}

function Get-ConnectionStringPropertyFromConfigurationXmlNode($connectionStringPropertyNode)
{
    $key = $connectionStringPropertyNode.GetAttribute("Key");
    $xPath = $connectionStringPropertyNode.GetAttribute("DatabaseXpath");
    $loginId = $connectionStringPropertyNode.GetAttribute("LoginId");
    
    $dbConfig = Get-DatabaseConfigurationFromXPath $connectionStringPropertyNode.OwnerDocument $xpath;
    $connectionString = Build-SqlConnectionString $dbConfig $loginId;

    [hashtable]$property = @{}
    $property.Key = $key
    $property.Value = $connectionString
    return $property
}

function Get-CustomScriptConfiguration($scriptNode)
{
    if($scriptNode.Name -eq "UpdateRetailPublishingJobAppConfig")
    {
        [hashtable]$updateRetailPublishingJobAppConfig = @{};
        $updateRetailPublishingJobAppConfig.ScriptName = $scriptNode.Name
        $updateRetailPublishingJobAppConfig.Generate = $scriptNode.GetAttribute("generate");
        $updateRetailPublishingJobAppConfig.AppConfigFile = $scriptNode.GetAttribute("appConfigFile");
        $updateRetailPublishingJobAppConfig.LoggingServiceName = $scriptNode.GetAttribute("loggingServiceName");
        $updateRetailPublishingJobAppConfig.LoggingCategoryName = $scriptNode.GetAttribute("loggingCategoryName");
        $updateRetailPublishingJobAppConfig.MonitoringEventLogSourceName = $scriptNode.GetAttribute("monitoringEventLogSourceName");
                        
        return $updateRetailPublishingJobAppConfig
    }
    elseif($scriptNode.Name -eq "CreateMobileDeviceChannel")
    {
        [hashtable]$createMobileDeviceChannel = @{};
        $createMobileDeviceChannel.ScriptName = $scriptNode.Name
        $createMobileDeviceChannel.Deploy = $scriptNode.GetAttribute("deploy");
        $createMobileDeviceChannel.Retract = $scriptNode.GetAttribute("retract");
        $createMobileDeviceChannel.ListName = $scriptNode.GetAttribute("listName");
        
        return $createMobileDeviceChannel
    }
    elseif($scriptNode.Name -eq "UpdateWorkflowFoundationConfig")
    {
        [hashtable]$updateWorkflowFoundationConfig = @{};
        $updateWorkflowFoundationConfig.ScriptName = $scriptNode.Name
        $updateWorkflowFoundationConfig.Generate = $scriptNode.GetAttribute("generate");
        $updateWorkflowFoundationConfig.WfConfigFile = $scriptNode.GetAttribute("wfConfigFile");
        $updateWorkflowFoundationConfig.PostInstallationAssetsPath = $scriptNode.GetAttribute("postInstallationAssetsPath");
                
        return $updateWorkflowFoundationConfig;
    }
    elseif($scriptNode.Name -eq "UpdateCommerceRuntimeConfig")
    {
        [hashtable]$updateCommerceRuntimeConfig = @{};
        $updateCommerceRuntimeConfig.ScriptName = $scriptNode.Name
        $updateCommerceRuntimeConfig.Generate = $scriptNode.GetAttribute("generate");
        $updateCommerceRuntimeConfig.CrtConfigFile = $scriptNode.GetAttribute("crtConfigFile");
        $updateCommerceRuntimeConfig.ChannelOperatingUnitNumber = $scriptNode.GetAttribute("channelOperatingUnitNumber");
                
        return $updateCommerceRuntimeConfig;
    }
    else
    {
        throw "Custom script with name $scriptName is not supported."   
    }
}

function Build-SqlConnectionString([hashtable]$databaseConfig, [string]$loginId)
{
    if ($databaseConfig -eq $null)
    {
        Throw "Build-SqlConnectionString: Missing argument databaseConfig."
    };

    if ($true -eq (StringIsNullOrWhiteSpace $loginId))
    {
        Throw "Build-SqlConnectionString: Missing argument loginId."
    };

    [bool]$found = $false;
    [string]$connectionString = "Server=" +$databaseConfig.InstanceName + ";Database=" + $databaseConfig.DatabaseName + ";"
    
    # find the $loginId
    foreach($sqlLogin in $databaseConfig.SqlLogins)
    {
        if($sqlLogin.Id -eq $loginId)
        {
            $connectionString = $connectionString + "User Id=" + $sqlLogin.Name + ";Password=" + $sqlLogin.Password;
            $found = $true;
            break;
        }
    }
    $sqlLogin = $null;
    
    foreach($windowsLogin in $databaseConfig.WindowsLogins)
    {
        if($windowsLogin.Id -eq $loginId)
        {
            $connectionString = $connectionString + "Trusted_Connection=Yes";
            $found = $true;
            break;
        }
    }
    $windowsLogin = $null;
    
    if($verbose -eq $true)
    {
        Write-Host Built connection string: $connectionString
    }
    
    if($found -eq $false)
    {
        Throw "Build-SqlConnectionString: The connection string could not be generated, the login with id $loginId was not found.";
    }
    
    return $connectionString
}

function CreateLocalNTGroup($computer, [string]$group, $groupDescription)
{
    if ($true -eq (StringIsNullOrWhiteSpace $computer))
    {
        Throw "CreateLocalNTGroup: Missing argument computer."
    };

    if ($true -eq (StringIsNullOrWhiteSpace $group))
    {
        Throw "CreateLocalNTGroup: Missing argument group."
    };

    if ($true -eq (StringIsNullOrWhiteSpace $groupDescription))
    {
        Throw "CreateLocalNTGroup: Missing argument groupDescription."
    };

    $parsedGroup = $group.Split("\");
    if($parsedGroup.Length -eq 2)
    {
        if($computer -eq $parsedGroup[0])
        {
            $group = $parsedGroup[1];
        }
        else
        {
            Throw "CreateLocalNTGroup: computer and group do not match. $computer, $group";
        }
    }
    
    $computer = GetExplicitComputerName $computer
    
    $ouName = "WinNT://$computer/$group"
    if($false -eq [ADSI]::Exists($ouName))
    {
        Log-TimedMessage "Group $ouName was not found. Creating it now."
        $objOu = [ADSI]"WinNT://$computer"
        $objUser = $objOU.Create("Group", $group)
        [void]$objUser.SetInfo()
        $objUser.description = $groupDescription
        [void]$objUser.SetInfo()
    }
    else
    {
        Log-TimedMessage "Group $ouName was found. Done."
    }
}

function GetTargetUserAdPath($windowsGroupMembershipNode)
{
    [string]$targetMachineName = GetExplicitComputerName $windowsGroupMembershipNode.MachineName
    [string]$localMachineName = GetExplicitComputerName("localhost");

    [string]$userName = $windowsGroupMembershipNode.UserName;

    [string]$domainName = IfDomainControllerGetDomain
    
    $userNameParts = $userName.Split("\")

    # Here we determine if the configured user name should be used 'as is' 
    # or it needs to be qualified with the target machine name (as in workgroup scenario)
    if ($userNameParts.Length -lt 2) 
    {
        $isQualifiedAccountName = $false;
    }
    else 
    {
        if (0 -eq [string]::Compare(".", $userNameParts[0])) 
        {
            $userNameParts[0] = "localhost";
        }

        $userNameParts[0] = GetExplicitComputerName($userNameParts[0]);
        $userName = [string]::join("\", $userNameParts);
        
        if (0 -ne [string]::Compare($localMachineName, $userNameParts[0], $true)) 
        {
            # if the account qualifier is not equal the local machine name we assume its a domain user and use the configured value
            $isQualifiedAccountName = $true;
        }
        elseif (-not [String]::IsNullOrWhiteSpace($domainName))
        {
            # if the local machine is a domain controller then the target machine cannot be in a workgroup (mix of domain and workgroup machines is not supported)
            $isQualifiedAccountName = $true;
        }
        else
        {
            # if the account qualifier is the local machine name then we assume that both machine are in workgroup and we replace account qualifier with target machine name
            # so it can be successfully created / manipulated in the context of the target machine
            $isQualifiedAccountName = $false;
            $userName = $userNameParts[1];
        }
    }

    if($isQualifiedAccountName)
    {
        Log-TimedMessage ("The account $userName is determined to be a qualified account.")
        $userAdPath = "WinNT://" + $userName
    }
    else
    {
        [string]$accLocation = '';
        if ([String]::IsNullOrWhiteSpace($domainName))
        {
            Log-TimedMessage ("The account $userName is determined to be a local account. The target account is located on the target machine $targetMachineName")
            $accLocation = $targetMachineName
        }
        else
        {
            # we only get here if this machine is a domain controller
            Log-TimedMessage ("The account $userName is determined to be a domain account on $domainName domain.")
            $accLocation = $domainName
        }
        
        $userAdPath = "WinNT://" + $accLocation + "/" + $userName
        Log-TimedMessage ("Resolved account: $userAdPath")
    }

    return $userAdPath.Replace("\", "/");
}

function CheckIfADObjectExists([string]$objectAdPath, [string]$adSearchQualifier, [string]$objectDisplayName, [int]$maxAttempts = 5, [int]$sleepBetweenRetriesSecs = 10)
{
    $attemptNumber = 0  
    $objectExists = $null
    
    do 
    {
        $attemptNumber++;
        try
        {
            $objectExists = [ADSI]::Exists($objectAdPath + $adSearchQualifier);
        }
        catch
        {
            Log-Error "Failed to access active directory to find the $objectDisplayName $objectAdPath."
            if ($attemptNumber -ge $maxAttempts)
            {
                throw
            }
        }
        if ($objectExists -eq $null -and $attemptNumber -lt $maxAttempts)
        {
            Log-TimedMessage ("Sleeping for $sleepBetweenRetriesSecs seconds and retrying $objectDisplayName existence check. attemptNumber:$attemptNumber; maxAttempts:$maxAttempts")
            Start-Sleep($sleepBetweenRetriesSecs)
        }
    }
    while ($objectExists -eq $null -and $attemptNumber -lt $maxAttempts)

    if ($objectExists -eq $null)
    {
        throw "Failed to access active directory to find the $objectDisplayName $objectAdPath"  
    }
    return $objectExists;
}

function CheckIfUserExists([string]$userAdPath, [int]$maxAttempts = 4, [int]$sleepBetweenRetriesSecs = 10)
{
    return CheckIfADObjectExists $userAdPath  ",user" "user" $maxAttempts $sleepBetweenRetriesSecs
}

function CheckIfGroupExists([string]$userAdPath, [int]$maxAttempts = 4, [int]$sleepBetweenRetriesSecs = 10)
{
    return CheckIfADObjectExists $userAdPath ",group" "group" $maxAttempts $sleepBetweenRetriesSecs
}

function AddOrRemoveUserToNTGroup($windowsGroupMembershipNode)
{
    $machineName = GetExplicitComputerName $windowsGroupMembershipNode.MachineName
    $userAdPath = GetTargetUserADPath $windowsGroupMembershipNode

    $userExists = CheckIfUserExists $userAdPath
    if($userExists -eq $false)
    {
        throw "User $userAdPath from $windowsGroupMembershipNode.UserName does not exist!"  
    }

    $userDirectoryObject = [ADSI]$userAdPath

    $longWindowsGroupName = (CreateWindowsGroup $windowsGroupMembershipNode.GroupName $machineName)
    $longWindowsGroupNameParts = $longWindowsGroupName.Split('\')
    $groupNameAdPath = "WinNT://" + $longWindowsGroupNameParts[0] + "/" + $longWindowsGroupNameParts[1]

    $groupExists = CheckIfGroupExists $groupNameAdPath
    if($groupExists -eq $false)
    {
        throw "Group $groupNameAdPath does not exist!"  
    }


    $groupDirectoryObject = [ADSI]$groupNameAdPath

    $userDirectoryObjectAdsPath = $userDirectoryObject.AdsPath.ToString()

    $Exists = 0

    # PowerShell 5.0 has a bug in GetType() for COM objects IADSUser. For more details please refer the following link:
    # https://connect.microsoft.com/PowerShell/feedback/details/1437363/powershell-5-bug-in-gettype-for-com-objects-iadsuser
	$groupDirectoryObject.Members() | % {
		$memberDirectoryAdsPath = ([ADSI]$_).InvokeGet("AdsPath")
		
        if ($memberDirectoryAdsPath -ilike $userDirectoryObjectAdsPath)                  
        {                 
            Log-TimedMessage "Found user $userAdPath as a member of the group $groupNameAdPath."
            $Exists = 1
            # No break here! Otherwise caller loop will be terminated.
        }
	}  
    
    if($windowsGroupMembershipNode.Name -ilike "add")
    {
        if($Exists -eq 0)
        {
            try
            {
                Log-TimedMessage ("Adding user $userAdPath to the group $groupNameAdPath")
                $groupDirectoryObject.Add($userAdPath);
            }
            catch [System.UnauthorizedAccessException]
            {
                $message = ("You do not have permission to add the user $userAdPath to the group $groupNameAdPath. Verify that your user account has the correct permissions. If you are using remote workgroup accounts, either enable Remote Management (http://technet.microsoft.com/en-us/library/hh921475.aspx) or manually add the user $userAdPath to the group $groupNameAdPath on the computer $machineName.")
                throw $message
            }
            catch 
            {
                Log-Exception $_
                throw "Failed to add $userAdPath to the group $groupNameAdPath. If you are using remote workgroup accounts, either enable Remote Management (http://technet.microsoft.com/en-us/library/hh921475.aspx) or manually add the user $userAdPath to the group $groupNameAdPath on the computer $machineName."
            }
            Log-TimedMessage ("The user $userAdPath was successfully added to the group $groupNameAdPath.")
        }
        else
        {
            Log-TimedMessage ("The user $userAdPath is already added to the group $groupNameAdPath.")
        }
    }
    
    if($windowsGroupMembershipNode.Name -ilike "remove")
    {
        if($Exists -eq 1)
        {
            $groupDirectoryObject.Remove($userAdPath);
            try
            {
                $groupDirectoryObject.Remove($userAdPath);
            }
            catch [System.UnauthorizedAccessException]
            {
                $message = ("You do not have permission to remove the user $userAdPath from the group $groupNameAdPath. Verify that your user account has the correct permissions. If you are using remote workgroup accounts, either enable Remote Management (http://technet.microsoft.com/en-us/library/hh921475.aspx) or manually remove the user $userAdPath from the group $groupNameAdPath on the computer $machineName.")
                throw $message
            }
            Log-TimedMessage ("The user $userAdPath was successfully removed from the group $groupNameAdPath.")
        }
        else
        {
            Log-TimedMessage ("The user $userAdPath is not member of the group $groupNameAdPath.")
        }
    }
}

# Creates a windows group, locally, remotely or on a DC.
# Returns the name of the group created.
function CreateWindowsGroup([string]$windowsLoginGroupName, [string]$serverName)
{
    # there are 2 code paths here: 1) DB creation also creates the domain groups, 2) app install makes sure domain group exists, if not creates it
    # there are two ways the windowslogingroupname may be specified
        # 1) machinename\groupname was specified
        # 2) groupname was specified

    $parts = $windowsLoginGroupName.Split("\")
    $parsedGroup = $parts[1]
    if(StringIsNullOrWhiteSpace $parsedGroup)
    {
        $parsedGroup = $windowsLoginGroupName
    }

    [string]$longWindowsGroupName = $null
    $domainName = IfDomainControllerGetDomain
    if (-not [String]::IsNullOrWhiteSpace($domainName))
    {
        # we are executing this on a DC
        CreateLocalDomainGroup $parsedGroup
        $longWindowsGroupName = $domainName + "\" + $parsedGroup
    }
    else
    {
        CreateLocalNTGroup $serverName $parsedGroup $parsedGroup
        $longWindowsGroupName = $serverName + "\" + $parsedGroup
    }
    
    return $longWindowsGroupName
}

function Convert-UserNameToADFormat(
    [string]$userName = $(Throw 'userName parameter required')
)
{
    [string]$domainName = IfDomainControllerGetDomain

    if ([String]::IsNullOrWhiteSpace($domainName))
    {
        $qualifiedPrefix = $env:COMPUTERNAME
    }
    else
    {
        $qualifiedPrefix = $domainName
    }
    
    $parsedUsername = $userName.Split("\")
    if ($parsedUsername.Length -eq 1)
    {
        $result = ($qualifiedPrefix + "\" + $userName)
    }
    elseif ($parsedUsername.Length -eq 2)
    {
        # This is potentially a local machine account.
        # If the GetExplicitComputerName call returns data different from the passed data, when the account is a local account.
        # Eg: $userName = localhost\User. $result = <MachineName>\User.
        if ((GetExplicitComputerName $parsedUsername[0]) -ne $parsedUsername[0])
        {
            $result = ($qualifiedPrefix + "\" + $parsedUsername[1])
        }
        # This is potentially an AD account.
        else
        {
            $result = $userName
        }
    }
    else
    {
        throw ('userName {0} is malformed.' -f $userName)
    }

    return $result
}

function GetExplicitComputerName($computerName)
{
    if (($computerName.Trim() -eq 'localhost') -or ($computerName.Trim() -eq '127.0.0.1') -or ($computerName.Trim() -eq '.'))
    {
        return $env:COMPUTERNAME
    }
    else
    {
        return $computerName
    }
}

function GetExplicitWindowsUserName($userName)
{
    $parsedGroup = $userName.Split("\");
    if($parsedGroup.Length -eq 2)
    {
        return (GetExplicitComputerName $parsedGroup[0]) + "\" + $parsedGroup[1];
    }
    else
    {
        Throw "GetExplicitWindowsUserName: $userName was malformed.";
    }
}

function Log-TimedMessage([string]$message)
{
    Write-Host ('{0}: {1}' -f (Get-Date -DisplayHint Time), $message)
}

function Log-TimedWarning([string]$message)
{
    Write-Warning ('{0}: {1}' -f (Get-Date -DisplayHint Time), $message)
}

function Log-TimedError([string]$message)
{
    Write-Host ('{0}: {1}' -f (Get-Date -DisplayHint Time), $message) -ForegroundColor Red -BackgroundColor Black
}

function StringIsNullOrWhiteSpace([string]$s)
{
    return (([string]::IsNullOrEmpty($s)) -or ($s.Trim().Count -eq 0))
}

function Test-IsAdmin 
{
    try 
    {
        $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
        $principal = New-Object Security.Principal.WindowsPrincipal -ArgumentList $identity
        return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    } 
    catch 
    {
        throw "Failed to determine if the current user has elevated privileges. The error was: '{0}'." -f $_
    }
}

function CreateLocalDomainGroup([string]$groupName)
{
    Log-TimedMessage "CreateLocalDomainGroup: called for $groupName"
    
    $adGroup = $null

    try
    {
        Log-TimedMessage "CreateLocalDomainGroup: importing 'ActiveDirectory' powershell module."        
        Import-Module ActiveDirectory
    }
    catch
    {
        Write-Warning -Message "CreateLocalDomainGroup: you are likely missing ActiveDirectory for powershell. Please check if the ActiveDirectory powershell module is installed. See for details: https://technet.microsoft.com/en-us/library/dd378937(v=ws.10).aspx"
        Log-Exception $_
    }
    
    try
    {       
        Log-TimedMessage "CreateLocalDomainGroup: checking for existence of group: $groupName"
        $adGroup = Get-AdGroup -Identity $groupName
    }
    catch
    {
        Log-TimedMessage "Failed to get AD group $groupName - below is the reason. This is not yet an error."
        Log-Exception $_ -asMessage $true
    }

    if ($adGroup -ne $null)
    {
        Log-TimedMessage "CreateLocalDomainGroup: group $groupName found. Checking for required properties."

        if ($adGroup.GroupCategory -ne 'Security')
        {
            throw "CreateLocalDomainGroup: group $groupName exists, but it is not a security group. Delete the group manually and retry. $adGroup";
        }

        if ($adGroup.GroupScope -ne "Global")
        {
            throw "CreateLocalDomainGroup: group $groupName exists, but it is not on a global scope. Delete the group manually and retry. $adGroup";
        }

        Log-TimedMessage "CreateLocalDomainGroup: group $groupName found with all required attributes. Nothing to do."
    }
    else
    {
        Log-TimedMessage "CreateLocalDomainGroup: group $groupName does not exist."

        try
        {
            New-ADGroup -Name $groupName -SamAccountName $groupName -GroupScope Global -GroupCategory Security
            Log-TimedMessage "CreateLocalDomainGroup: group $groupName created."
        }
        catch
        {
            Log-TimedError "CreateLocalDomainGroup: group $groupName creation failed. Error details below. Check whether another user or group account with same name ($groupName) exists, remove it manually and try again."
            throw $_
        }
    }
}

# returns a valid NetBIOS domain name string if this machine is also a domain controller, otherwise $null
function IfDomainControllerGetDomain()
{
    if((Check-IfDomainController) -eq $true)
    {
        $domainName = (gwmi win32_computersystem).Domain
        Log-TimedMessage ('Found domain name: {0}' -f $domainName)
        Import-Module ActiveDirectory  | Out-Null
        $netBIOSDomainName = (Get-ADDomain -Identity $domainName).NetBIOSName
        Log-TimedMessage ('Found NetBIOS name: {0}' -f $netBIOSDomainName)
        return $netBIOSDomainName
    }
    else
    {
        return $null
    }
}

function Check-IfDomainController()
{
    $domainRole = (gwmi win32_computersystem).DomainRole

    # both the (principal) domain controller and a (backup) domain controller are domain controllers (DC)
    # the limitation of a domain controller is that one cannot create local users or user groups on a DC
    if($domainRole -eq 5 -or $domainRole -eq 4)
    {
        Log-TimedMessage ('Found that this machine is a domain controller. DomainRole: {0}' -f $domainRole)
        return $true
    }
    else
    {
        Log-TimedMessage ('Found that this machine is not a domain controller. DomainRole: {0}' -f $domainRole)
        return $false
    }
}

function IsLocalOSVersionGreaterOrEqualTo([System.Version]$lowestVersionAllowed)
{
    $wmi = (Get-WmiObject -computerName localhost -class Win32_OperatingSystem)
    [System.Version]$version = $wmi.Version
    return ($version.CompareTo($lowestVersionAllowed) -gt 0)
}

# Returns a boolean indicating if the current process runs on an OS of Windows Server 2012/Windows 8 or newer.  
function IsLocalOSWindows2012OrLater()
{
    return IsLocalOSVersionGreaterOrEqualTo "6.2"
}

# Returns a boolean indicating if the current process runs on an OS of Windows Server 2008 R2/Windows 7 or newer.  
function IsLocalOSWindows2008R2OrLater()
{
    return IsLocalOSVersionGreaterOrEqualTo "6.1"
}

# Returns a boolean indicating if the current process runs on an OS of Windows Server 2008/Windows Vista or newer.  
function IsLocalOSWindows2008OrLater()
{
    return IsLocalOSVersionGreaterOrEqualTo "6.0"
}

# Updates an xml element's attribute at a certain xpath.
function Update-XmlObjAttributeValue([xml]$xml, [string]$xpath, [string]$attributeName, [string]$value)
{
    Log-TimedMessage ('Updating attribute "{0}" at "{1}" with "{2}".' -f $attributeName, $xpath, $value)
    $node = $xml.SelectSingleNode($xpath);
    if($node -eq $null)
    {
        throw "The node at $xpath could not be found."
    }
    
    $node.SetAttribute($attributeName, $value);
    Log-TimedMessage 'Successfully updated.'
}

# Updates an xml element's value at a certain xpath.
function Update-XmlObjValue([xml]$xml, [string]$xpath, [string]$value)
{
    Log-TimedMessage ('Updating "{0}" with "{1}".' -f $xpath, $value)
    $node = $xml.SelectSingleNode($xpath);
    if($node -eq $null)
    {
        throw "The node at $xpath could not be found."
    }
    
    if ($node -is [System.Xml.XmlAttribute])
    {
        $node.Value = $value
    }
    else
    {
        $node.InnerText = $value
    }
    
    Log-TimedMessage 'Successfully updated.'
}

# Updates the inner xml for an xml element/ node. Also, allows disables logging in case sensitive data is being set.
function Update-XmlObjInnerXml(
    [xml]$xmlContent = $(Throw 'xmlContent parameter required'),
    [string]$targetXPath = $(Throw 'targetXPath parameter required'),
    [string]$value = $(Throw 'value parameter required'),
    [switch]$disableLogging
)
{
    if (!$disableLogging)
    {
        Log-TimedMessage ('Updating xml element at xPath "{0}" with value "{1}".' -f $targetXPath, $value)
    }

    $targetNode = $xmlContent.SelectSingleNode($targetXPath)
    if ($targetNode)
    {
        $targetNode.InnerXml = $value
    }
    else
    {
        throw "Unable to locate any xml element at the target xPath [$targetXPath]"
    }

    if (!$disableLogging)
    {
        Log-TimedMessage 'Successfully updated.'
    }
}

# Updates an xml element's attribute at a certain xpath and saves the changes into an xml file.
function UpdateXmlAttributeValue([string]$XmlFilePath, [string]$OutputXmlFilePath, [string]$xpath, [string]$attributeName, [string]$value)
{
    [xml]$xml = get-content $XmlFilePath;
    Update-XmlObjAttributeValue -xml $xml -xpath $xpath -attributeName $attributeName -value $value
    $OutputXmlFilePath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputXmlFilePath)
    $xml.Save($OutputXmlFilePath)
    Write-Host "$OutputXmlFilePath has been written."
}

# Updates an xml element's attribute at a certain xpath and saves the changes into an xml file.
# Accepts hashtable of key value pairs.
# Applies key to xPath format.
function Update-XmlKeyValuePairs(
    [ValidateNotNullOrEmpty()]
    [ValidateScript({ Test-Path $_ })]
    [string]$XmlFilePath, 

    [ValidateNotNullOrEmpty()]
    [string]$OutputXmlFilePath, 
    
    [ValidateNotNullOrEmpty()]
    [string]$xPathFormat,

    [ValidateNotNull()]
    [hashtable]$KeyValuePairs,

    [ValidateNotNullOrEmpty()]
    [string]$ValueAttributeName = 'value')
{
    [xml]$xml = get-content $XmlFilePath
    
    foreach($key in $KeyValuePairs.Keys)
    {
        [string]$value = $KeyValuePairs[$key]

        $xPath = $xPathFormat -f $key
        $node = $xml.SelectSingleNode($xPath)

        if($node -eq $null)
        {
            throw ('The node at [{0}] could not be found.' -f $xpath)
        }

        $node.SetAttribute($ValueAttributeName, $value)
        Log-TimedMessage ('Updated attribute [{0}] at [{1}] with [{2}]' -f $ValueAttributeName, $xpath, $value)
    }    

    $OutputXmlFilePath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputXmlFilePath)
    $xml.Save($OutputXmlFilePath)
    Log-TimedMessage ('[{0}] has been written.' -f $OutputXmlFilePath)
}

# Updates configuration xml element's attribute with value and saves the changes into an xml file.
function UpdateSettingsXmlAttributeValue(
    [ValidateScript( { Test-Path $_ } )]
    [string]$SettingsXmlFilePath,
    
    [ValidateScript( { -not ([string]::IsNullOrEmpty($_)) } )]
    [string]$attributeName,
    
    [string]$value)
{
    if([string]::IsNullOrEmpty($value))
    {
        Write-Host "Value for [$attributeName] to update settings .xml [$SettingsXmlFilePath] is null. Skipping update"
        return
    }
    UpdateXmlAttributeValue $SettingsXmlFilePath $SettingsXmlFilePath "Settings/Setting[@key='$attributeName']" "value" $value
}

function Get-RetailServerConfigFromXPath([xml]$xmlDocument, [string]$xpath)
{
    $node = $xmlDocument.selectsinglenode($xpath)
    if($node -eq $null)
    {
        throw "Could not find expected node $xpath";
    }
    
    [hashtable]$ht = @{};
    $ht.InstallDependencies = $true
    
    $webSiteNode = $node.SelectSingleNode("WebSite")
    $ht.WebSite = Get-IISWebSiteConfigFromXmlNode $webSiteNode
    
    return $ht
}

function Get-RealtimeServiceConfigFromXPath([xml]$xmlDocument, [string]$xpath)
{
    $node = $xmlDocument.selectsinglenode($xpath)
    if($node -eq $null)
    {
        throw "Could not find expected node $xpath";
    }
    
    [hashtable]$ht = @{};
    $ht.AOSServer = $node.SelectSingleNode("AOSServer").get_InnerXml();
    $ht.EnableMetadataExchange = $node.SelectSingleNode("EnableMetadataExchange").get_InnerXml();
    
    $webSiteNode = $node.SelectSingleNode("WebSite")
    $ht.WebSite = Get-IISWebSiteConfigFromXmlNode $webSiteNode
    
    return $ht
}

function Get-IISAppPoolConfigFromXmlNode($node)
{
    [hashtable]$ht = @{};
    $ht.Name = $node.SelectSingleNode("Name").get_InnerXml();
    $ht.ProcessModel_IdentityType = $node.SelectSingleNode("ProcessModel_IdentityType").get_InnerXml();
    $ht.ProcessModel_UserName = $node.SelectSingleNode("ProcessModel_UserName").get_InnerXml();
    $ht.Enable32BitAppOnWin64 = Get-XmlAttributeValue $node "Enable32BitAppOnWin64"

    return $ht;
}

function Get-XmlAttributeValue($node, $attributeName)
{
    $xmlNode = $node.SelectSingleNode($attributeName);
    [string] $value = ""
    
    if($xmlNode -ne $null)
    {
        $value = $xmlNode.get_InnerXml();
    }
    return $value;
}

function Get-IISWebSiteConfigFromXmlNode($node)
{
    [hashtable]$ht = @{};
    $ht.Name = Get-XmlAttributeValue $node "Name"
    $ht.Port = Get-XmlAttributeValue $node "Port"
    $ht.PortSSL = Get-XmlAttributeValue $node "PortSSL"
    $ht.PortTcp = Get-XmlAttributeValue $node "PortTcp"
    $ht.SSLCertificatePath = Get-XmlAttributeValue $node "SSLCertificatePath"
    $ht.ServerCertificateRootStore = Get-XmlAttributeValue $node "ServerCertificateRootStore"
    $ht.ServerCertificateStore = Get-XmlAttributeValue $node "ServerCertificateStore"
    $ht.ServerCertificateThumbprint = Get-XmlAttributeValue $node "ServerCertificateThumbprint"
    $ht.PhysicalPath = Get-XmlAttributeValue $node "PhysicalPath"   
    $applicationPoolXPath = Get-XmlAttributeValue $node "ApplicationPoolXPath"
    $ht.EnableMetadataExchange = Get-XmlAttributeValue $node "EnableMetadataExchange"
    $appPoolNode = $node.OwnerDocument.SelectSingleNode($applicationPoolXPath)
    if($appPoolNode -eq $null)
    {
        throw "Could not find expected node $applicationPoolXPath";
    }
    $ht.WebAppPool = Get-IISAppPoolConfigFromXmlNode $appPoolNode
    
    $webAppNode = $node.SelectSingleNode("WebApplication")
    if($webAppNode -eq $null)
    {
        throw "Could not find expected node 'WebApplication'";
    }
    $ht.WebApplication = Get-IISWebApplicationConfigFromXmlNode $webAppNode

    return $ht;
}

function Get-IISWebApplicationConfigFromXmlNode($node)
{
    [hashtable]$ht = @{}
    $ht.Name = $node.SelectSingleNode("Name").get_InnerXml();
    $ht.PhysicalPath= $node.SelectSingleNode("PhysicalPath").get_InnerXml();
    $ht.ServiceBinarySourceFolder = $node.SelectSingleNode("ServiceBinarySourceFolder").get_InnerXml();
    
    $nodeFound = $node.SelectSingleNode("RequireSSL");
    if($nodeFound -ne $null)
    {
        $ht.RequireSSL = $nodeFound.get_InnerXml();
    }
    
    $nodeFound = $node.SelectSingleNode("AllowAnonymousMetadata");
    if($nodeFound -ne $null)
    {
        $ht.AllowAnonymousMetadata = $nodeFound.get_InnerXml();
    }
    
    $applicationPoolXPath = $node.SelectSingleNode("ApplicationPoolXPath").get_InnerXml();
    $appPoolNode = $node.OwnerDocument.SelectSingleNode($applicationPoolXPath)
    if($appPoolNode -eq $null)
    {
        throw "Could not find expected node $applicationPoolXPath";
    }
    $ht.WebAppPool = Get-IISAppPoolConfigFromXmlNode $appPoolNode
    $ht.AppSettings = @()
    
    $connStringPropertiesXml = $node.Selectnodes("AppSettings/PropertyForConnectionString")
    if($connStringPropertiesXml -ne $null)
    {
        foreach($propertyXml in $connStringPropertiesXml)
        {
            $ht.AppSettings = $ht.AppSettings + (Get-ConnectionStringPropertyFromConfigurationXmlNode $propertyXml)
        }
    }

    $propertiesXml = $node.Selectnodes("AppSettings/Property")

    if($propertiesXml -ne $null)
    {
        foreach($propertyXml in $propertiesXml)
        {

            $key = $propertyXml.GetAttribute("Key");
            $value = $propertyXml.GetAttribute("Value");
            [hashtable]$property = @{}
            $property.Key = $key
            $property.Value = $value
        
            $ht.AppSettings = $ht.AppSettings + $property
        }
    }

    return $ht;
}

function Log-Step{
    param([string]$message)
    Log-TimedMessage $message
}

function Log-ActionItem{
    param([string]$message)    
    Log-TimedMessage "    - $message ..."
}

function Log-ActionResult{
    param([string]$message)
    Log-TimedMessage "      $message."
}

function Log-Error {
    param([string]$message)
    Log-TimedError -message "############### Error occurred: ###############"
    Log-TimedError -message $message
}

function Log-Exception($exception, $asMessage) {
    
    $message = ($exception | fl * -Force | Out-String -Width 4096)
    # If passed object is a string, just log the string.
    if($exception -is [string])
    {
        $message = $exception
    }

    if ($asMessage -eq $true)
    {
        Log-TimedMessage $message
    }
    else
    {
        Log-Error $message
    }
}

function Throw-Error(
    $errorObject = $(Throw 'errorObject parameter required'))
{
    Log-Exception $errorObject
    Throw $errorObject
}

function Validate-NotNull(
    $argument,

    [string]$argumentName = $(Throw 'argumentName parameter required'))
{
    if($argument -eq $null `
        -or ($argument -is [string] -and (StringIsNullOrWhiteSpace $argument)))
    {
        Throw-Error "[$argumentName] is null."
    }
}

function New-ItemPropertyNotNull(
    $Value,
    
    [string]$Path = $(Throw 'Path parameter required'),
    
    [string]$Name = $(Throw 'Name parameter required'),
    
    [string]$PropertyType = $(Throw 'PropertyType parameter required'))
{
    if($Value -ne $null)
    {
         [void](New-ItemProperty -Path $Path -Name $Name -PropertyType $PropertyType -Value $Value -Force)
    }
}
    

function Add-RegistryEntry(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'),

    [string]$RetailComponentRegistryKey = $(Throw 'RetailComponentRegistryKey parameter required'),
    
    [hashtable]$AdditionalStringProperties)
{
    $WebApplicationName = $WebSiteConfig.WebApplication.Name
    $WebConfigFilePath =  Join-Path ($WebSiteConfig.WebApplication.PhysicalPath) "Web.config"
    
    Log-Step "Enable discovery of Web application [$WebApplicationName] for monitoring purposes"
    try 
    {    
        $WebApplicationRegistryKeyName = Join-Path $RetailComponentRegistryKey $WebApplicationName
        # always overwrite
        Log-ActionItem "Save parameters of the WebApplication [$WebApplicationName] in registry path [$WebApplicationRegistryKeyName]"
        [void](New-Item $WebApplicationRegistryKeyName -Force)
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "UserName" -PropertyType "String" -Value $WebSiteConfig.WebAppPool.ProcessModel_UserName
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "ServiceInstallFolder" -PropertyType "String" -Value $WebSiteConfig.PhysicalPath
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "AppPoolName" -PropertyType "String" -Value $WebSiteConfig.WebAppPool.Name
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "WebsiteName" -PropertyType "String" -Value $WebSiteConfig.Name
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "WebApplicationName" -PropertyType "String" -Value $WebApplicationName
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "HttpPort" -PropertyType "DWord" -Value $WebSiteConfig.Port
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "HttpsPort" -PropertyType "DWord" -Value $WebSiteConfig.PortSSL
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "ApplicationConfigFilePath" -PropertyType "String" -Value $WebConfigFilePath
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "ServerCertificateThumbprint" -PropertyType "String" -Value $WebSiteConfig.ServerCertificateThumbprint
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "ServerCertificateStore" -PropertyType "String" -Value $WebSiteConfig.ServerCertificateStore
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "ServerCertificateRootStore" -PropertyType "String" -Value $WebSiteConfig.ServerCertificateRootStore
        New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name "TcpPort" -PropertyType "DWord" -Value $WebSiteConfig.PortTcp
        
        if($AdditionalStringProperties -ne $null)
        {
            foreach ($additionalStringProperty in $AdditionalStringProperties.GetEnumerator())
            {
                New-ItemPropertyNotNull -Path $WebApplicationRegistryKeyName -Name $additionalStringProperty.Key -PropertyType "String" -Value $additionalStringProperty.Value
            }
        }
    
        Log-ActionResult "Complete"    
    }
    catch
    {
        Log-Exception $_
        Write-Warning -Message "Failed: Enabling discovery of WebApplication [$WebApplicationName] for monitoring purposes"
    }
}

function Disable-WebApplicationMonitoringDiscovery(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'),

    [string]$RetailComponentRegistryKey = $(Throw 'RetailComponentRegistryKey parameter required'))
{
    $WebApplicationName = $WebSiteConfig.WebApplication.Name
    Log-Step "Disable discovery of Web application [$WebApplicationName] for monitoring purposes"
    
    try
    {
        $WebApplicationRegistryKeyName = Join-Path $RetailComponentRegistryKey $WebApplicationName
        Log-ActionItem "Delete registry entry [$WebApplicationRegistryKeyName]"
        if (Test-Path $WebApplicationRegistryKeyName)
        {
            Remove-Item -Path $WebApplicationRegistryKeyName -Recurse -Force
        }
        Log-ActionResult "Complete"
    }
    catch
    {
        Log-Exception $_
        Write-Warning -Message "Failed: Disable discovery of WebApplication [$WebApplicationName] for monitoring purposes"
    }
}

function Add-WindowsGroupMemberships([System.Xml.XmlNodeList]$windowsGroupMembershipsNodes)
{
    foreach($node in $windowsGroupMembershipsNodes)
    {
        if ($true -eq (StringIsNullOrWhiteSpace $node.MachineName))
        {
            throw ("MachineName has not been specified for WindowsGroupMemberShip node")
        }
        if ($true -eq (StringIsNullOrWhiteSpace $node.UserName))
        {
            throw ("UserName has not been specified for WindowsGroupMemberShip node")
        }
        if ($true -eq (StringIsNullOrWhiteSpace $node.GroupName))
        {
            throw ("GroupName has not been specified for WindowsGroupMemberShip node")
        }

        AddOrRemoveUserToNTGroup $node
    }
    
    Log-TimedMessage "All windows group memberships are added."
}

function Create-ApplicationLogEventSource([string]$kLogSourceName)
{
    Create-EventSource -LogName "Application" -Source $kLogSourceName
}

function Create-EventSource
{
    param(
        [string]$LogName = $(Throw 'LogName parameter required'), 
        [string]$Source = $(Throw 'Source parameter required'))
    
    Log-Step "Create Retail Monitoring event source"

    try 
    {
        if (![System.Diagnostics.EventLog]::SourceExists($Source)) 
        {
            Log-ActionItem ("Creating {0} event source in event log {1}" -f $Source, $LogName)
            New-EventLog -Source $Source -LogName $LogName
        } 
        else 
        {
            Log-ActionResult ("{0} already exists on the computer" -f $Source)
        }
        
        Log-ActionResult "Complete"
    }
    catch 
    {
        Log-Exception $_
        Throw "Failed: Create Retail event source with name $Source"
    }
}

function Create-RetailMonitoringEventSource
{
    Create-ApplicationLogEventSource "Microsoft Dynamics AX Retail Monitoring"
}

function Remove-ApplicationLogEventSource([string]$kLogSourceName)
{
    Log-Step "Remove Retail Monitoring event source"

    try 
    {
        if ([System.Diagnostics.EventLog]::SourceExists($kLogSourceName)) 
        {
            Log-ActionItem ("Removing {0} event source" -f $kLogSourceName)
            Remove-EventLog -Source $kLogSourceName
        } 
        else 
        {
            Log-ActionResult ("{0} doesn't exist on the computer" -f $kLogSourceName)
        }
        
        Log-ActionResult "Complete"
    }
    catch 
    {
        Log-Exception $_
        Throw "Failed: Remove Retail event source with name $kLogSourceName"
    }
}

# This method tries to restart the specified web application pool.
# Returns $true if the web app pool could be restarted. Returns $false if the web app pool could not be found.
# The method will fail if the web application pool was found but could not be started.
function Try-RestartWebApplicationPool([string]$webAppPoolName)
{
    Import-Module WebAdministration;
    $appPool = ((dir IIS:\AppPools) | where {$_.Name -match $webAppPoolName})
    if($appPool -ne $null)
    {
        Write-Host "Found application pool by name [$webAppPoolName]."
        $AppPoolName = $appPool.Name
        $latestAppPoolStatus = (Get-WebAppPoolState $AppPoolName).Value;
        
        if ($latestAppPoolStatus -eq 'Stopped')
        {
            Write-Host "Starting application pool [$AppPoolName]."
            Start-WebAppPool -Name $AppPoolName;
        }
        else
        {
            Write-Host "ReStarting application pool [$AppPoolName]."
            Restart-WebAppPool -Name $AppPoolName;
        }
        
        $latestAppPoolStatus = (Get-WebAppPoolState $AppPoolName).Value;
        if ($latestAppPoolStatus -ne 'Started')
        {
            $message = "Web application pool '$AppPoolName' could not be started. ExpectedState:'Started' ActualState:'$latestAppPoolStatus'. This is a requirement for deployment to proceed!"
            Write-Warning -Message $message;
            exit ${global:PrerequisiteFailureReturnCode};
        }
        return $true;
    }
    else
    {
        Write-Host "Did not find application pool by name [$webAppPoolName]."
        return $false;
    }
}

# This method runs some dummy IIS PowerShell commandlets to ensure that the WebAdministration module can be imported correctly.
function Ensure-WebAdminModuleCanBeLoaded()
{
    Try 
    {
        Import-Module WebAdministration;
        Log-TimedMessage "Attemping to run a IIS PowerShell commandlet to verify if WebAdministration was imported correctly.";
        $Websites = Get-ChildItem IIS:\Sites
    } 
    Catch [System.IO.FileNotFoundException]
    {
        # Try again.
        Log-TimedMessage "WebAdministration module might not have loaded in time. This is a bug in PowerShell. Attempting again to run a IIS PowerShell commandlet to verify if WebAdministration was imported correctly..."
        Try
        {
            $Websites = Get-ChildItem IIS:\Sites
            Log-TimedMessage "WebAdministration could be loaded correctly.";
        }
        Catch [System.IO.FileNotFoundException]
        {
            $message = "There seems to be a problem loading the WebAdministration PowerShell module. Please ensure that the module has been installed properly. This is a requirement for deployment to proceed!"
            Write-Warning -Message $message;
            exit ${global:PrerequisiteFailureReturnCode};
        }
    }
}

function Validate-SSLConfigurationParameters(
    $ConfigParameters = $(Throw 'ConfigParameters parameter required'))
{
    $WebSiteConfig = $ConfigParameters.WebSite; Validate-NotNull $WebSiteConfig "WebSiteConfig"
    
    $HttpsPort = $WebSiteConfig.PortSSL;
    $ServerCertificateThumbprint = $WebSiteConfig.ServerCertificateThumbprint;
    
    Validate-NotNull $HttpsPort "HTTPS Port"
    Validate-NotNull $ServerCertificateThumbprint "Server Certificate Thumbprint"
}

function Validate-UserIsInCredentialsArray([string]$UserName, [System.Management.Automation.PSCredential[]]$Credentials)
{
    $foundCredential = $null
    if($Credentials -eq $null)
    {
        return $false
    }

    for($i = 0; $i -le $Credentials.length - 1; $i++)
    {
        if($Credentials[$i].UserName -like $UserName)
        {
            $foundCredential = $Credentials[$i]
            break
        }
    }
    return ($foundCredential -ne $null)
}

function Fix-PowerShellRedirection()
{
    # This function is needed to guard against the PowerShell 2.0 bug in redirection.
    # Look at http://www.leeholmes.com/blog/2008/07/30/workaround-the-os-handles-position-is-not-what-filestream-expected/ for details

    $powerShellMajorVersion = $(Get-Host).Version.Major

    if ($powerShellMajorVersion -eq 2)
    {
        $bindingFlags = [Reflection.BindingFlags] "Instance,NonPublic,GetField"
        $objectRef = $host.GetType().GetField("externalHostRef", $bindingFlags).GetValue($host) 

        $bindingFlags = [Reflection.BindingFlags] "Instance,NonPublic,GetProperty"
        $consoleHost = $objectRef.GetType().GetProperty("Value", $bindingFlags).GetValue($objectRef, @()) 

        [void] $consoleHost.GetType().GetProperty("IsStandardOutputRedirected", $bindingFlags).GetValue($consoleHost, @())
        $bindingFlags = [Reflection.BindingFlags] "Instance,NonPublic,GetField"
        $field = $consoleHost.GetType().GetField("standardOutputWriter", $bindingFlags)
        $field.SetValue($consoleHost, [Console]::Out)
        $field2 = $consoleHost.GetType().GetField("standardErrorWriter", $bindingFlags)
        $field2.SetValue($consoleHost, [Console]::Out)
    }
}

# pass in name of hotfix in format of KB12345678 or 12345678 (simple regular match is done against all hot fixes installed)
function IsKBHotfix-IsInstalled([string] $kbHotfixName)
{
    $hotfix = Get-HotFix | where {$_.HotFixID -match $kbHotfixName}
    if($hotfix -eq $null)
    {
        Log-TimedMessage ("The hotfix '{0}' was not found to be installed." -f $kbHotfixName)
        return $false
    }
    else
    {
        Log-TimedMessage ("The hotfix '{0}' was found to be installed." -f $kbHotfixName)
        return $true
    }
}

function IsKB2701373-InstalledIfNeeded()
{
    if((-not (IsLocalOSWindows2012OrLater)) -and (IsLocalOSWindows2008R2OrLater))
    {
        if((-not (IsKBHotfix-IsInstalled 'KB2701373')) -and ($PSVersionTable.BuildVersion.Revision -lt 22296))
        {
            Write-Warning -Message "Prerequisite check failed: Hot fix KB2701373 is applicable for this OS but was not detected. Install from http://support.microsoft.com/kb/2701373."
            return $false
        }
        else
        {
            Write-Host "Prerequisite check succeeded: Hot fix KB2701373 or newer PowerShell update is correctly installed."
        }
    }
    else
    {
        Write-Host "Prerequisite check succeeded: Hot fix KB2701373 is not applicable for this OS."
    }
    
    return $true
}

# Function checks that the OS is at the appropriate version if it is the primary domain controller. Primary domain controller must be Windows 7 or Windows 2008 R2 or higher.
function CheckOsVersion-IfDomainController()
{
    if((-not (IsLocalOSWindows2008R2OrLater)) -and (IsLocalOSWindows2008OrLater))
    {
        if(Check-IfDomainController)
        {
            Write-Warning -Message "Domain controller installations are not supported on Windows Server 2008."
            return $false
        }
        else
        {
            Write-Host "Prerequisite check succeeded: Machine is not a domain controller."
        }
    }
    else
    {
        Write-Host "Prerequisite check succeeded: No issues found for this OS."
    }
    
    return $true
}

# Function to check if two file paths are equal.
function Test-IfPathsEqual(
    [string]$firstPath = $(Throw 'firstPath parameter required'),
    
    [string]$secondPath = $(Throw 'secondPath parameter required'))
{
    $directorySeparator = [IO.Path]::DirectorySeparatorChar
    [Environment]::ExpandEnvironmentVariables($firstPath).TrimEnd($directorySeparator) -eq [Environment]::ExpandEnvironmentVariables($secondPath).TrimEnd($directorySeparator)
}

# Function to perform any passed delegate function in a retry logic and throw error if it fails even after retries.
function Perform-RetryOnDelegate(
    $delegateCommand = $(Throw 'delegateCommand parameter required'),
    [int]$numTries=3, 
    [int]$numSecondsToSleep=5)
{  
        Log-ActionItem "Performing delegate command in retry logic."
        for($try = 1; $try -le $numTries; ++$try)
        {
            Log-ActionItem "Perform delegate command. Attempt #[$try]"
            try
            {
                $lastTryError = $null
                &$delegateCommand
                Log-ActionResult "Performed successfully from attempt #[$try]"
                break
            }
            catch
            {
               $lastTryError = $_
            }
            
            if($try -ne $numTries)
            {
               Log-ActionResult "Failed to perform. Sleeping for [$numSecondsToSleep] seconds"
               Start-Sleep -Seconds $numSecondsToSleep
            }
        }
        
        if($lastTryError)
        {           
            Log-Exception $lastTryError         
            $totalWaitTime = $numSecondsToSleep * ($numTries - 1)
            Throw-Error "Failed to perform the delegate after [$totalWaitTime] seconds of waiting"
        }
        
        Log-ActionResult "Performed delegate successfully."
}

# Function checks if Microsoft SQL Server package (e.g. System CLR Types, Shared Management Objects)for 2008 R2 msi is installed or not.
function Check-IfSQLPackageInstalled(
    [string]$minVersion = $(Throw 'minVersion parameter required'),
    
    [string]$registryKey = $(Throw 'registryKey parameter required'),
    
    [string]$featureName = $(Throw 'featureName parameter required'),
    
    [string]$installLink)
{   
    [System.Version]$ExpectedVersion = [System.Version]$minVersion
    [bool]$isFeatureInstalled = $false
    
    # Check if the msi is installed by inspecting the registry key.
    Write-Host "Performing a lookup for $featureName version $minVersion"
    if(Test-Path $registryKey)
    {
        # Get the installed version
        $registryValue = Get-ItemProperty -Path $registryKey
        if(($registryValue -eq $null) -or ($registryValue.Version -eq $null))
        {
            Write-Warning -Message "Prerequisite check failed: Registry value for $featureName does not exist."
        }
        else
        {
            $actualVersion = [System.Version]$registryValue.Version
            
            # Compare the actual version with the minimum version.
            if($actualVersion.CompareTo($ExpectedVersion) -ge 0)
            {
                Write-Host "Prerequisite check succeeded: $featureName version [$actualVersion] is installed."
                $isFeatureInstalled = $true
            }
            else
            {
                Write-Warning -Message "Prerequisite check failed: Expected version is [$minVersion]. Actual version found is [$actualVersion]."
            }
        }
    }
    else
    {
        # Pre-requisite check failed. Registry key not found.
        Write-Warning -Message "Prerequisite check failed: $featureName is not installed."
    }
    
    if($isFeatureInstalled -eq $false)
    {
        Write-Warning -Message "Download and install $featureName from $installLink."
    }
    
    return $isFeatureInstalled
}

# Function to check existence of Microsoft SQL Server CMD 
function Check-IfSqlCmdExists()
{
    $pathSysVariable = $ENV:Path.Replace('"','').Split(';')
    
    foreach($sqlCmdPath in $pathSysVariable)
    {
        if(-Not ([String]::IsNullOrEmpty($sqlCmdPath)))
        {
            if(Test-Path (Join-Path $sqlCmdPath "sqlcmd.exe"))
            {  
                Write-Host "Prerequisite check succeeded: SQL Server CMD exists on the machine and is included in the PATH environment variable."
                return $true
            }
        }
    }
    
    Write-Host "Prerequisite check Failed: SQL Server CMD does exists on the machine and is not included in the PATH environment variable."
    return $false
}

function Get-WindowsAccountFromSecurityIdentifier([string]$sid)
{
    $objectSID = New-Object System.Security.Principal.SecurityIdentifier($sid)
    $objUser = $objectSID.Translate([System.Security.Principal.NTAccount])

    if(([String]::IsNullOrEmpty($objUser.Value)))
    {
        Throw-Error "Cannot translate SID $sid to Windows account."
    }

    return $objUser.Value
}

function Invoke-ScriptAndRedirectOutput(
    [ScriptBlock] $scriptBlock = $(Throw 'ScriptBlock parameter required'),
    [string] $logFile = $(Throw 'LogFile parameter required'))
{
    begin
    {
        # Redefine Write-Host function behavior.
        # See http://latkin.org/blog/2012/04/25/how-to-capture-or-redirect-write-host-output-in-powershell for more details.
        function Redefine-WriteFunction(
            [string]$functionName = $(Throw 'functionName parameter required'),

            [string]$argumentToLogName = $(Throw 'argumentToLogName parameter required'))
        {
            # Create $functionName proxy.
            $metaData = New-Object System.Management.Automation.CommandMetaData (Get-Command "Microsoft.PowerShell.Utility\$functionName")
            $proxy = [System.Management.Automation.ProxyCommand]::create($metaData)

            # Change its behavior.
            # Make $functionName to output it's argument to the file.
            $additionalWriteHostBehaviour = 'for($attempt = 1; $attempt -le 3; $attempt++){ try {if($NoNewLine) { [System.IO.File]::AppendAllText("$logFile", $%argPlaceHolder%, [System.Text.Encoding]::Unicode); } else { $%argPlaceHolder% | Out-File "$logFile" -Append }; break}catch{Start-Sleep -seconds 2} }'

            # Replace '$logFile' substring with actual logFile value.
            $additionalWriteHostBehaviour = $additionalWriteHostBehaviour -replace '\$logfile', $logFile

            $additionalWriteHostBehaviour = $additionalWriteHostBehaviour -replace '%argPlaceHolder%', $argumentToLogName

            # Append additional behavior to the beginning of current behavior.
            $content = $proxy -replace '(\$steppablePipeline.Process)', "$additionalWriteHostBehaviour; `$1"

            # Load our version into the global scope.
            Invoke-Expression "function global:$functionName { $content }"	  
        }


        # Cleans up proxy function redefinition from global scope.
        function Cleanup-FunctionRedefinition(
            [string]$functionName = $(Throw 'functionName parameter required'))
        {
           Remove-Item "function:$functionName" -ErrorAction "SilentlyContinue"
        }
    }

    process
    {
        try
        {
            . Redefine-WriteFunction "Write-Host" "Object"
            . Redefine-WriteFunction "Write-Warning" "Message"
            Invoke-ScriptBlock $scriptBlock
        }
        finally
        {
            Cleanup-FunctionRedefinition "Write-Host"
            Cleanup-FunctionRedefinition "Write-Warning"
        }
    }
}

function Invoke-ScriptBlock(
    [ScriptBlock] $scriptBlock = $(Throw 'ScriptBlock parameter required'))
    {
    try
    {
        $capturedExitCode = 0
        $global:lastexitcode = 0
        $output = $scriptBlock.Invoke()
        $capturedExitCode = $global:lastexitcode

        if($output)
        {
            Log-TimedMessage $output
        }
    }
    catch
    {
        # $_ is Dot net invocation exception, we need to get rid of it
        Log-TimedError ($global:error[0] | format-list * -f | Out-String)
        throw $_.Exception.InnerException.ErrorRecord
    }

    if($capturedExitCode -ne 0)
    {
        throw ("Scriptblock exited with error code $capturedExitCode.")
    }
}

function Invoke-Script(
    [ScriptBlock] $scriptBlock = $(Throw 'ScriptBlock parameter required'),	
    [string] $logFile)
{
    if($logFile)
    {
        Invoke-ScriptAndRedirectOutput -scriptBlock $scriptBlock -logFile $logFile
    }
    else
    {
        Invoke-ScriptBlock -scriptBlock $scriptBlock
    }
}

function Invoke-Executable(
    [ValidateNotNullOrEmpty()]
    [string]$executableName = $(throw 'ExecutableName is required!'),
    [array]$arguments = @(),
    [string]$logFile)
{
    [ScriptBlock]$scriptBlock =
    {
        Log-TimedMessage ('Running {0} with arguments:{1}{2}' -f $executableName, [Environment]::NewLine, ($arguments -join [Environment]::NewLine))
        $global:lastexitcode = 0
        &$executableName $arguments
    }
    
    Invoke-Script -scriptBlock $scriptBlock -logFile $logFile
}

function Unregister-EtwManifest(
    [ValidateNotNullOrEmpty()]
    [string]$etwManifestFilePath = $(throw 'etwManifestFilePath is required!'))
{
    Log-TimedMessage 'Unregistering ETW Manifest.'
    Log-TimedMessage ('Checking if ETW Manifest file "{0}" exists.' -f $etwManifestFilePath)
    if(Test-Path $etwManifestFilePath)
    {
        Log-TimedMessage 'Yes. Performing unregistration.'
        $arguments = @('um', $etwManifestFilePath) 
        Invoke-Executable -executableName 'wevtutil' -arguments $arguments
    }
    else
    {
        Log-TimedMessage 'No. No action will be performed.'
    }

    Log-TimedMessage "Finished unregistering ETW Manifest."
}

function Validate-PathExists(
    [ValidateNotNullOrEmpty()]
    [string]$path = $(throw 'path is required!'),
    
    [ValidateNotNullOrEmpty()]
    [string]$errorMessageFormat = $(throw 'errorMessageFormat is required!'))
{
    Log-TimedMessage ('Checking if "{0}" exists.' -f $path)
    if(Test-Path -Path $path -ErrorAction 'SilentlyContinue')
    {
        Log-TimedMessage 'Yes'
    }
    else
    {
        throw ($errorMessageFormat -f $path)
    }
}

function Register-EtwManifest(
    [ValidateNotNullOrEmpty()]
    [string]$etwManifestFilePath = $(throw 'etwManifestFilePath is required!'),
    
    [ValidateNotNullOrEmpty()]
    [string]$etwManifestResourceFilePath = $(throw 'etwManifestResourceFilePath is required!'))
{
    Log-TimedMessage 'Registering ETW Manifest.'
    Validate-PathExists -path $etwManifestFilePath -errorMessageFormat 'ETW Manifest file "{0}" not found'
    Validate-PathExists -path $etwManifestResourceFilePath -errorMessageFormat 'ETW Manifest resource file "{0}" not found'

    Log-TimedMessage 'Unregister manifest first to properly update existing manifest entries'
    Unregister-EtwManifest -etwManifestFilePath $etwManifestFilePath
    
    Log-TimedMessage 'Now register the manifest'
    $arguments = 
    @(
        'im'
        $etwManifestFilePath # No quotes around the path needed!
        '/rf:{0}' -f $etwManifestResourceFilePath # No quotes around the path needed!
        '/mf:{0}' -f $etwManifestResourceFilePath # No quotes around the path needed!
    )

    Invoke-Executable -ExecutableName 'wevtutil' -arguments $arguments
    Log-TimedMessage 'Finished registering ETW Manifest.'
}

# Helper to exit script.
# We are putting the exit code in the pipeline since this is a requirement for ESS scripts to process exit codes.
# With this function, we will cater to both the needs of returning exit codes to caller and actually exiting with exit code.
function Exit-Script($exitCode = 1)
{
    $exitCode
    exit $exitCode
}

function Get-ProductVersionMajorMinor()
{
    [string]  $productVersionMajorMinorString = '7.0'
    return $productVersionMajorMinorString
}

# Note: This function may throw if, for example, security settings prevent removing the specified key
function Drop-SelfServiceRegistryKey (
    [ValidateNotNullOrEmpty()]
    [string] $keyName = $(Throw 'KeyName parameter required'))
{
    $selfServiceRoot = 'HKLM:\SOFTWARE\Microsoft\Dynamics\Setup\SelfServiceDeployment'
    $registryKey = Join-Path $selfServiceRoot $keyName

    Log-ActionItem "Dropping self-service registry key - [$registryKey]"
    if (Test-Path $registryKey)
    {
        Remove-Item -Path $registryKey -Recurse -Force
        Log-ActionResult "Successfully dropped the self-service registry key - [$registryKey]"
    }
    else
    {
        Log-ActionResult "Nothing done, the self-service registry key [$registryKey] does not appear to exist"
    }
}

    function Write-Log(
    $objectToLog,
    [string] $logFile)
{
    try
    {
        $date = (Get-Date -DisplayHint Time)
        $message = "{0}: {1}" -f $date, $objectToLog

        if($logFile)
        {
            $message | Out-File -FilePath $logFile -Append -Force
        }
        else
        {
            Write-Host $message
        }
    }
    catch
    {
        # swallow any log exceptions
    }
}

function Copy-Files(
    [string] $SourceDirPath = $(Throw 'SourceDirPath parameter required'),
    [string] $DestinationDirPath = $(Throw 'DestinationDirPath parameter required'),
    [string] $FilesToCopy = '*',
    [string] $RobocopyOptions = '/e',
    [string] $logFile)
{
    $global:LASTEXITCODE = 0
    
    # if dir path is quoted and ends with '\', robocopy fails.
    $SourceDirPath = $SourceDirPath.TrimEnd('\')
    $DestinationDirPath = $DestinationDirPath.TrimEnd('\')
    $command = 'robocopy.exe "{0}" "{1}" "{2}" {3}' -f $SourceDirPath, $DestinationDirPath, $FilesToCopy, $RobocopyOptions
    Write-Log $command -logFile $logFile
    
    $output = Invoke-Expression $command

    $capturedExitCode = $global:LASTEXITCODE

    Write-Log ($output | Out-String) -logFile $logFile

    #Robocopy Exit codes related info: http://support.microsoft.com/kb/954404
    if(($capturedExitCode -ge 0) -and ($capturedExitCode -le 8))
    {
        Write-Log "[Robocopy] completed successfully." -logFile $logFile
        $global:LASTEXITCODE = 0
    }
    else
    {
        throw "[Robocopy] failed with exit code $capturedExitCode"
    }
}

function Backup-Directory(
    [string] $sourceFolder = $(throw 'sourceFolder is required'),
    [string] $targetFolder)
{
    Write-Log "Begin to backup web folder: $sourceFolder"

    if(-not $targetFolder)
    {
        $sourceFolderShortName = Split-Path $sourceFolder -Leaf
        $targetFolder = Join-Path (Split-Path $sourceFolder -parent) "$sourceFolderShortName-Backup-$(Get-Date -f yyyy-MM-dd_hh-mm-ss)"

        if(Test-Path -Path $targetFolder)
        {
            Remove-Item $targetFolder -Force -Recurse
        }
    }

    Copy-Files $sourceFolder $targetFolder
}

function Get-ChannelDbRegistryRootPath
{
    $majorVersion = Get-ProductVersionMajorMinor
    return "HKLM:\SOFTWARE\Microsoft\Dynamics\$majorVersion\RetailChannelDatabase"
}

function Set-UseDatabaseCredentialInWebConfigForUpgrade
{
    $targetRegistryKeyPath = Get-ChannelDbRegistryRootPath
    if(-not (Test-Path -Path $targetRegistryKeyPath))
    {
        New-Item -Path $targetRegistryKeyPath -ItemType Directory -Force
    }
    New-ItemProperty -Path $targetRegistryKeyPath -Name 'UseDatabaseCredentialInWebConfigForUpgrade' -Value 'true' -Force
}

function Get-UseDatabaseCredentialInWebConfigForUpgrade
{
    $targetRegistryKeyPath = Get-ChannelDbRegistryRootPath
    $flagValue = Read-RegistryValue -targetRegistryKeyPath $targetRegistryKeyPath -targetPropertyName 'UseDatabaseCredentialInWebConfigForUpgrade'
    return ($flagValue -ilike 'true')
}

function Get-WebConfigFilePath(
    [string]$websiteName = $(throw 'websiteName is required.')
)
{
    $websitePhysicalPath = Get-WebSitePhysicalPath -webSiteName $websiteName
    $result = Join-Path -Path $websitePhysicalPath -ChildPath 'web.config'
    return $result
}

function Encrypt-WithAxConfigEncryptorUtility(
    [string]$AosWebsiteName = $(Throw 'AosWebsiteName is required'),
    [string]$webConfigPath = $(Throw 'webConfigPath is required'))
{
    $aosWebPath = Split-Path (Get-WebConfigFilePath -websiteName $AosWebsiteName) -Parent
    $axConfigEncryptorUtilityPath = Join-Path $aosWebPath 'bin\Microsoft.Dynamics.AX.Framework.ConfigEncryptor.exe'
    if(-not (Test-Path $axConfigEncryptorUtilityPath))
    {
        throw "$axConfigEncryptorUtilityPath is not found."
    }
    & $axConfigEncryptorUtilityPath -encrypt $webConfigPath
}

function Decrypt-WithAxConfigEncryptorUtility(
    [string]$AosWebsiteName = $(Throw 'AosWebsiteName is required'),
    [string]$webConfigPath = $(Throw 'webConfigPath is required'))
{
    $aosWebPath = Split-Path (Get-WebConfigFilePath -websiteName $AosWebsiteName) -Parent
    $axConfigEncryptorUtilityPath = Join-Path $aosWebPath 'bin\Microsoft.Dynamics.AX.Framework.ConfigEncryptor.exe'
    if(-not (Test-Path $axConfigEncryptorUtilityPath))
    {
        throw "$axConfigEncryptorUtilityPath is not found."
    }
    & $axConfigEncryptorUtilityPath -decrypt $webConfigPath
}

function Update-ChannelDatabaseConfigLocation(
    [string]$webConfigPath = $(throw 'webConfigPath is required'),
    [string]$AosWebsiteName = $(throw 'AosWebsiteName is required'))
{
    $dbServer = ''
    $dbName = ''
    $deployUser = ''
    $deployUserPassword = ''
    $deployExtUser = ''
    $deployExtUserPassword = ''
    $encryption = ''
    $disableDBServerCertificateValidation = ''
    
    $deployUserConnectionStringSettings = (Get-ChannelDbServicingDataFromRegistry)
    $deployExtUserConnectionStringSettings = Get-ServicingDataFromRegistry -registryPath (Get-ChannelDbExtUserRegistryPath)
    # get the last servicing data and extract database information
    $websiteConnectionStringSetting = $deployUserConnectionStringSettings | Select-Object -Last 1
    $dbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSetting
    $dbServer = $dbSetting.server 
    $dbName = $dbSetting.database 
    $deployUser = $dbSetting.sqlUserName 
    $deployUserPassword = $dbSetting.sqlUserPassword
    $encryption = $dbSetting.Encrypt
    $disableDBServerCertificateValidation = $dbSetting.TrustServerCertificate
    
    $websiteConnectionStringSetting = $deployExtUserConnectionStringSettings | Select-Object -Last 1
    if($websiteConnectionStringSetting)
    {
        $dbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSetting
        $dbServer = $dbSetting.server 
        $dbName = $dbSetting.database 
        $deployExtUser = $dbSetting.sqlUserName 
        $deployExtUserPassword = $dbSetting.sqlUserPassword
        $encryption = $dbSetting.Encrypt
        $disableDBServerCertificateValidation = $dbSetting.TrustServerCertificate
    }
    
    # Old deployment may not have ext user, check the existance before extract the value.
    if($websiteConnectionStringSetting -ne $null)
    {
        $dbSetting = Create-WebSiteDBConfiguration -connectionString $websiteConnectionStringSetting
        $dbServer = $dbSetting.server 
        $dbName = $dbSetting.database 
        $deployExtUser = $dbSetting.sqlUserName 
        $deployExtUserPassword = $dbSetting.sqlUserPassword
        $encryption = $dbSetting.Encrypt
        $disableDBServerCertificateValidation = $dbSetting.TrustServerCertificate
    }
    
    [xml]$targetConfigXml = Get-Content $webConfigPath
    $DataEncryptionCertificateThumbprint = $targetConfigXml.configuration.retailServer.cryptography.certificateThumbprint
    
    $appSettings = @{
        'DataAccess.DataEncryptionCertificateThumbprint' = $DataEncryptionCertificateThumbprint;
        'DataAccess.DataSigningCertificateThumbprint' = $DataEncryptionCertificateThumbprint;
        'CertificateHandler.HandlerType' = 'Microsoft.Dynamics.AX.Configuration.CertificateHandler.LocalStoreCertificateHandler';
        'DataAccess.encryption' = $encryption;
        'DataAccess.disableDBServerCertificateValidation' = $disableDBServerCertificateValidation;
        'DataAccess.Database' = $dbName;
        'DataAccess.DbServer' = $dbServer;
        'DataAccess.SqlUser' = $deployExtUser;
        'DataAccess.SqlPwd' = $deployExtUserPassword;
        'DataAccess.AxAdminSqlUser' = $deployUser;
        'DataAccess.AxAdminSqlPwd' = $deployUserPassword
    }
    
    foreach ($setting in $appSettings.GetEnumerator()) 
    {
        $configElement = $targetConfigXml.configuration.appSettings.add | Where-Object { $_.key -eq $setting.Name }

        # Only add a new element if one doesn't already exist.
        if($true -ne (StringIsNullOrWhiteSpace $setting.Value))
        {
            if ($configElement -eq $null)
            {
                $configElement = $targetConfigXml.CreateElement('add')
                $xmlKeyAtt = $targetConfigXml.CreateAttribute("key")
                $xmlKeyAtt.Value = $setting.Name
                $configElement.Attributes.Append($xmlKeyAtt)
                $xmlValueAtt = $targetConfigXml.CreateAttribute("value")
                $xmlValueAtt.Value = $setting.Value
                $configElement.Attributes.Append($xmlValueAtt)
                $targetConfigXml.configuration.appSettings.AppendChild($configElement)
            }
        
            $configElement.value = $setting.Value
        }
    }
    
    Set-ItemProperty $webConfigPath -name IsReadOnly -value $false
    $targetConfigXml.Save($webConfigPath)
    
    Set-UseDatabaseCredentialInWebConfigForUpgrade
}

function Get-ConfigurationValueFromServiceModelXml
(
	[xml] $ServiceModelXml = $(Throw 'ServiceModelXml is required!'),
	[string] $XPath  = $(Throw 'XPath is required!')
)
{
	$node = $ServiceModelXml.SelectSingleNode($XPath)
	if(-not $node)
	{
		throw ('cannot get value from {0}' -f $XPath)
	}
	return $ServiceModelXml.SelectSingleNode($XPath).getAttribute("Value")
}

function Get-ParametersFromServiceModelXml(
	[xml] $ServiceModelXml = $(Throw 'ServiceModelXml is required!'), 
	[ref] $OutputSettingsHashset  = $(Throw 'OutputSettingsHashset  is required!'), 
	[string] $SettingName = $(Throw 'SettingName is required!'), 
	[string] $ParameterName)
{
	if(-not $ParameterName)
	{
		$ParameterName = $SettingName
	}
	$settingValue = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='$SettingName']")
	$OutputSettingsHashset.Value.Add($ParameterName,$settingValue)
}

function Get-WebConfigAppSetting(
	[xml] $WebConfig = $(Throw 'WebConfig is required!'), 	
	[string] $SettingName = $(Throw 'SettingName is required!'),
    [switch] $Optional)
{
	$appSettingElement = $WebConfig.SelectSingleNode("/configuration/appSettings/add[@key='$SettingName']")
	
	if(!$appSettingElement)
	{
        if($Optional)
        {
            return $null
        }

        # missing item is not optional
		throw "Failed to get app setting from web.config because the key $SettingName doesn't exist"
	}
	
	$appSettingValue = $appSettingElement.Value
		
	if(!$appSettingValue)
	{
		return ""
	}
	
	return $appSettingValue
}

function Set-WebConfigAppSetting(
    [string]$webConfigFilePath = $(Throw 'webConfigFilePath is required'),
    [string]$key = $(Throw 'key is required'),
    [string]$value = $(Throw 'value is required'))
{
    [xml]$doc = Get-Content $webConfigFilePath

    # Check and see if we have one of these elements already.
    $configElement = $doc.configuration.appSettings.add | Where-Object { $_.key -eq $key }

    # Only add a new element if one doesn't already exist.
    if (!$configElement)
    {
        $configElement = $doc.CreateElement('add')
        $xmlKeyAtt = $doc.CreateAttribute("key")
        $xmlKeyAtt.Value = $key
        $configElement.Attributes.Append($xmlKeyAtt)
        $xmlValueAtt = $doc.CreateAttribute("value")
        $xmlValueAtt.Value = $value
        $configElement.Attributes.Append($xmlValueAtt)
        $doc.configuration.appSettings.AppendChild($configElement)
    }

    $configElement.value = $value

    Set-ItemProperty $webConfigFilePath -name IsReadOnly -value $false
    $doc.Save($webConfigFilePath)
}

function Move-ConfigToConfig(
	[xml] $FromConfigXml = $(throw 'FromConfigXml is required'),
	[string] $ToConfigPath = $(throw 'ToConfigPath is required'),
	$KeysToMove = $(throw 'KeysToMove is required')
)
{
	foreach($key in $KeysToMove)
	{
		$appSettingValue = Get-WebConfigAppSetting -WebConfig $FromConfigXml -SettingName $key
		if($appSettingValue)
		{
			Set-WebConfigAppSetting -webConfigFilePath $ToConfigPath -key $key -value $appSettingValue		
		}
	}
}

function AdjustAxSetupConfig(
	[string] $AosWebConfigPath = $(throw 'AosWebConfigPath is required'),
	[string] $AxSetupExeFolder = $(throw 'AxSetupExeFolder is required')
)
{
	$AosWebRootFolder = Split-Path $AosWebConfigPath -parent
	$aosWebConfigContent = [xml](Get-Content -Path $AosWebConfigPath)
	$PostDeploymentUtilityConfigFileName = 'Microsoft.Dynamics.AX.Deployment.Setup.exe.config'
	$PostDeploymentUtilityConfigFilePath = Join-Path -Path $AxSetupExeFolder -ChildPath $PostDeploymentUtilityConfigFileName
	if (-not (Test-Path -Path $PostDeploymentUtilityConfigFilePath))
	{
		throw 'Could not find Microsoft.Dynamics.AX.Deployment.Setup.exe.config'
	}

	[xml] $PostDeploymentUtilityConfigDoc = Get-Content -Path $PostDeploymentUtilityConfigFilePath

	# These four appSettings need to be copied from aos web.config to DB utility config in order to access the enryption api from DB Sync utility context.
	$appSettingKeysForMove = @(
		'Aos.SafeMode',
		'AzureStorage.StorageConnectionString',
		'DataAccess.DataEncryptionCertificateThumbprint',
		'DataAccess.DataSigningCertificateThumbprint')
	
	Move-ConfigToConfig -FromConfigXml $aosWebConfigContent -ToConfigPath $PostDeploymentUtilityConfigFilePath -KeysToMove $appSettingKeysForMove
}

function Set-WebConfigDiagnosticsProperty(
    [string] $webConfigFilePath = $(throw 'webConfigFilePath is required'),
    [string] $sinkClassName = $(throw 'sinksClassName is required'),
    [string] $name = $(throw 'name is required'),
    [string] $value = $(throw 'value is required'))
{
    [xml]$doc = Get-Content $webConfigFilePath

    # Check and see if we have one of these elements already.
    $sinkElement = $doc.configuration.diagnosticsSection.sinks.sink | Where { $_.class -eq $sinkClassName }
    $eventDbPropertyElement = $sinkElement.Properties.Property | Where { $_.name -eq $name }
    if(!$eventDbPropertyElement)
    {
        throw ('Element was not found in {0}' -f $webConfigFilePath)
    }
    $eventDbPropertyElement.value = $value

    Set-ItemProperty $webConfigFilePath -name IsReadOnly -value $false
    $doc.Save($webConfigFilePath)
}

function Merge-WebConfigAppSettings(
    [ValidateNotNullOrEmpty()]
    [string]$sourceWebConfigFilePath = $(throw 'sourceWebConfigFilePath is required'),

    [ValidateNotNullOrEmpty()]
    [string]$targetWebConfigFilePath = $(throw 'targetWebConfigFilePath is required'),

    $nonCustomizableAppSettings,
    [bool]$isMicrosoftPackage = $true)
{
    if ((Test-Path -Path $sourceWebConfigFilePath) -and (Test-Path -Path $targetWebConfigFilePath))
    {
        [xml]$sourceWebConfigFilePathDoc = Get-Content $sourceWebConfigFilePath
        [xml]$targetWebConfigFilePathDoc = Get-Content $targetWebConfigFilePath

        # Iterate over each app setting in the original deployment config.
        foreach($setting in $sourceWebConfigFilePathDoc.configuration.appSettings.add)
        {
            # Check if the app setting exists in the new config.
            $configElement = $targetWebConfigFilePathDoc.configuration.appSettings.add | Where-Object { $_.key -eq $setting.key }
            
            Log-ActionItem ('Checking if the setting with key [{0}] already exists in the new config' -f $setting.key)
            if(!$configElement)
            {
                Log-ActionResult 'No. Check if we need to retain this setting in new config'
                # Note: If the app setting does not exist in the new config but is one of the non-customizable setting, 
                # then retain it from original deployment config into the new config.
                Log-ActionResult 'Yes. Bringing back the app setting from deployed config'

                $configElement = $targetWebConfigFilePathDoc.CreateElement('add')
                $configElement.SetAttribute('key', $setting.key)
                $configElement.SetAttribute('value', $setting.value)

                # Append the new element
                $targetWebConfigFilePathDoc.configuration.appSettings.AppendChild($configElement)
            }
            else
            {
                Log-ActionResult ('Yes. Value is [{0}]' -f $configElement.value)

                # If an app setting is non-customizable, then retain it. Otherwise over-write with a customized value.
                Log-ActionItem ('Checking if this setting can overwrite existing value - [{0}]' -f $setting.value)
                if ($nonCustomizableAppSettings -icontains $setting.key)
                {
                    Log-ActionResult 'No! This is a non-customizable setting. Retaining the existing app setting value'
                    if($isMicrosoftPackage)
                    {
                        Log-ActionResult 'Microsoft Package! This is a non-customizable setting. Retaining the existing app setting value'
                        $configElement.value = $setting.value
                    }
                }
                else
                {
                    Log-ActionResult 'Yes. This setting can over-write the existing value'
                    if(!$isMicrosoftPackage)
                    {
                        Log-ActionResult 'Customized Package! Bring settings from backup'
                        $configElement.value = $setting.value
                    }
                }
            }
        }
        
        Set-ItemProperty $targetWebConfigFilePath -name IsReadOnly -value $false
        $targetWebConfigFilePathDoc.Save($targetWebConfigFilePath)
    }
    else
    {
        throw "Either $sourceWebConfigFilePath or $targetWebConfigFilePath doesn't exist"
    }
}

function Merge-JsonFile(
    [string] $sourceJsonFilePath = $(throw 'sourceJsonFilePath is required'),
    [string] $targetJsonFilePath = $(throw 'targetJsonFilePath is required'),
    $nonCustomizableConfigSettings)
{
    if(-not (Test-Path -Path $sourceJsonFilePath))
    {
        throw "Source json file $sourceJsonFilePath doesn't exist."
    }

    if(-not (Test-Path -Path $targetJsonFilePath))
    {
        throw "Target json file $targetJsonFilePath doesn't exist."
    }

    $sourceJsonString = Get-Content $sourceJsonFilePath
    $sourceJsonObject = "[ $sourceJsonString ]" | ConvertFrom-JSON
    $targetJsonString = Get-Content $targetJsonFilePath
    $targetJsonObject = "[ $targetJsonString ]" | ConvertFrom-JSON
    $properties = $sourceJsonObject | Get-Member -MemberType NoteProperty
          
    foreach($property in $properties)
    {
		# Retain the config setting from source file ONLY IF it is a reserved setting. Else overwrite it from the target file.
		if($nonCustomizableConfigSettings -icontains $property.Name)
		{
			$targetJsonObject | Add-Member -MemberType NoteProperty -Name $property.Name -Value $sourceJsonObject.$($property.Name) -Force
		}
    }

    $targetJsonObject | ConvertTo-Json | Out-File $targetJsonFilePath -Force 
}

# Firewall rules
function New-FirewallRule(
    [ValidateNotNullOrEmpty()]
    [string]$ruleName = $(Throw 'ruleName parameter required'),

    [ValidateSet('allow', 'block', 'bypass')]
    [string]$action = $(Throw 'action parameter required'),
    
    [ValidateSet('in', 'out')]
    [string]$trafficDirection = $(Throw 'trafficDirection parameter required'),

    [ValidateSet('TCP')]
    [string]$protocol = $(Throw 'protocol parameter required'),

    [ValidateRange(1, 65535)]
    [UInt32]$port = $(Throw 'port parameter required'))
{
    Log-TimedMessage ('Creating firewall rule {0} to {1} {2} {3} traffic on port {4}' -f $ruleName, $action, $trafficDirection, $protocol, $port)

    # netsh will gladly add the rule with same name if run twice, so we need to remove rule first.
    Log-TimedMessage 'Removing any existing rule with same name first'
    Remove-FirewallRule -ruleName $ruleName

    $newRuleArguments = @(
        'advfirewall'
        'firewall'
        'add'
        'rule'
        'name={0}' -f $ruleName # no quotes around $ruleName here otherwise it won't work. It handles spaces in name just fine with no quotes.
        'dir={0}' -f $trafficDirection
        'action={0}' -f $action
        'protocol={0}' -f $protocol
        'localport={0}' -f $port
    )

    Invoke-Executable -executableName 'netsh' -arguments $newRuleArguments    
    Log-TimedMessage ('Firewall rule {0} was successfully created' -f $ruleName)
}

function Test-IfFirewallRuleExists(
    [ValidateNotNullOrEmpty()]
    [string]$ruleName = $(throw 'ruleName is required!')
)
{
    Log-TimedMessage ('Checking if firewall rule [{0}] exists' -f $ruleName)
    $global:lastexitcode = 0
    # no quotes around $ruleName here otherwise it won't work. It handles spaces in name just fine with no quotes.
    $output = netsh advfirewall firewall show rule name=$ruleName
    $capturedExitCode = $global:lastexitcode 
    Log-TimedMessage $output
    # If rule does not exist, netsh returns non zero exit code.
    return $capturedExitCode -eq 0
}

function Remove-FirewallRule(
    [ValidateNotNullOrEmpty()]
    [string]$ruleName = $(throw 'ruleName is required!')
)
{
    Log-TimedMessage ('Removing firewall rule [{0}].'-f $ruleName)
    if(Test-IfFirewallRuleExists -ruleName $ruleName)
    {
        Log-TimedMessage ('Firewall rule [{0}] exists. Removing.' -f $ruleName)
        $removeRuleArguments = @(
            'advfirewall'
            'firewall'
            'delete'
            'rule'
            'name={0}' -f $ruleName # no quotes around $ruleName here otherwise it won't work. It handles spaces in name just fine with no quotes.
        )

        Invoke-Executable -executableName 'netsh' -arguments $removeRuleArguments
    }
    else
    {
        Log-TimedMessage ('Firewall rule [{0}] does not exist. Skip removal.' -f $ruleName)
    }
}

function Get-FirewallRuleNamesByPrefix(
    [ValidateNotNullOrEmpty()]
    $ruleNamePrefix = $(throw 'ruleNamePrefix is required!')
)
{
    $result = @()
    # Match prefix until first space or end of line after it
    # (\s matches a character of whitespace (space, tab, carriage return, line feed)).
    # ($ means end of line).
    # (.*?) means lazy match of any characters.
    $ruleNamePrefixMatchRegexp = '{0}.*?(\s|$)' -f ([Regex]::Escape($ruleNamePrefix))

    # Get netsh output that has information about all rules
    $allRulesLines = netsh advfirewall firewall show rule all
    
    # Get only lines that contain information about rule names.
    $ruleNameLines = $allRulesLines | where { $_ -match $ruleNamePrefixMatchRegexp }
    
    if ($ruleNameLines)
    {
        # Get rule names.
        $result = $ruleNameLines | foreach { [void]($_ -match $ruleNamePrefixMatchRegexp); $matches[0] }
        $result = $result | where { $_ }
        $result = $result | foreach { $_.Trim() }
    }
    
    return $result
}

function Remove-FirewallRulesByNamePrefix(
    [ValidateNotNullOrEmpty()]
    $ruleNamePrefix = $(throw 'ruleNamePrefix is required!')
)
{
    # This function is based on raw output parsing.
    # So in case if something goes wrong. We don't want uninstall to fail.
    try
    {
        $ruleNames = Get-FirewallRuleNamesByPrefix -ruleNamePrefix $ruleNamePrefix
        $ruleNames | ForEach { Remove-FirewallRule $_ }
    }
    catch
    {
        Log-TimedError ($global:error[0] | format-list * -f | Out-String)
    }
}

function Check-IfDemoDataLoaded(
    [string] $AxDatabaseName = $(Throw 'AxDatabaseName parameter required'),
    [string] $AxDatabaseServerInstanceName = 'localhost')
{
    # Query the AX database to see if demo data set is loaded or not.
    $returnResult = $false
    $query = "SELECT * from DATAAREA where ID <> 'DAT'"
    $result = Invoke-SqlCmd -Query $query -ServerInstance $AxDatabaseServerInstanceName -Database $AxDatabaseName

    if($result)
    {
        $returnResult = $true
    }
    return $returnResult	
}

function Check-IfPerfDataLoaded(
    [string] $AxDatabaseName = $(Throw 'AxDatabaseName parameter required'),
    [string] $AxDatabaseServerInstanceName = 'localhost')
{
    # Query the AX database to see if demo data set is loaded or not.
    $returnResult = $false
    $query = "SELECT * FROM RETAILSTOREENTITY WHERE STORENUMBER = 'S1001' "
    $result = Invoke-SqlCmd -Query $query -ServerInstance $AxDatabaseServerInstanceName -Database $AxDatabaseName

    if($result)
    {
        $returnResult = $true
    }
    return $returnResult	
}

function Update-HostFileLines(
    [string[]] $HostNames = $(throw "Please provide a list of host names"),
    [string] $IPAddress = '127.0.0.1'
)
{
    $hostFilePath = Join-Path $env:windir 'System32\drivers\etc\hosts'
    $hostFileBackupPath = "{0}{1}" -f $hostFilePath, ([System.Guid]::NewGuid().ToString())

    $originalFileContent = Get-Content $hostFilePath
    Set-Content -Path $hostFileBackupPath -Value $originalFileContent -Force
    [System.Collections.ArrayList]$originalFileContentCopy = $originalFileContent.Clone()

    $HostNames | ForEach `
    {
        $hostName = $_
        $originalFileContent | ForEach  `
        {
            if(!$_.StartsWith('#') -and ($_.IndexOf($hostName) -gt 0))
            {
                    if($_.IndexOf($IPAddress) -ge 0)
                    { 
                        $originalFileContentCopy.Remove($_)
                    }
                    else
                    {
                        $originalFileContentCopy.Remove($_)
                        $originalFileContentCopy.Add("# $_")
                    }
                }
            }
        }

    $HostNames | ForEach  `
    {
        $HostNameLine = "{0} {1}" -f $IPAddress, $_ 
        $originalFileContentCopy.Add($HostNameLine)
    }

    Set-Content -Path $hostFilePath -Value $originalFileContentCopy -Force
}

function IsAosConfiguredWithStorageEmulator([string] $AosWebSiteName = 'AosWebApplication')
{
    Import-Module WebAdministration
    $aosWebsite = Get-WebSiteSafe -Name $AosWebSiteName
    if($aosWebsite)
    {
        $aosWebConfigPath = Join-Path -Path $aosWebsite.PhysicalPath -ChildPath 'web.config'
        $aosWebConfigContent = [xml](Get-Content -Path $aosWebConfigPath)
        
        $AzureStorageStorageConnectionStringKey = 'AzureStorage.StorageConnectionString'
        $AzureStorageStorageConnectionString = $aosWebConfigContent.SelectSingleNode("/configuration/appSettings/add[@key='$AzureStorageStorageConnectionStringKey']").Value
        
        return ($AzureStorageStorageConnectionString -eq 'UseDevelopmentStorage=true')
    }
    else
    {
        return $false
    }
}

function Start-StorageEmulatorSafe
{
    $storageEmulatorRegPath = 'HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows Azure Storage Emulator'
    if(Test-Path -Path $storageEmulatorRegPath)
    {
        $storageEmulatorReg = (Get-ItemProperty -Path $storageEmulatorRegPath)
        if($storageEmulatorReg -and $storageEmulatorReg.InstallPath)
        {
            $storageEmulatorExe = (Join-Path $storageEmulatorReg.InstallPath 'AzureStorageEmulator.exe')
            if((Test-Path -Path $storageEmulatorExe))
            {
                try
                {
                    Write-Output "Trying to stop storage emulator from $storageEmulatorExe"
                    & $storageEmulatorExe stop
                }
                catch
                {
                    # Control will reach here only if the emulator is already stopped. No action required to be performed.
                    Write-Output "Storage emulator is already in stopped state. Continuing ..."
                }
            
                $global:LASTEXITCODE = 0
                try
                {
                    Write-Output "Trying to start storage emulator from $storageEmulatorExe"
                    & $storageEmulatorExe start
                }
                catch
                {
                    Write-Output ($global:error[0] | format-list * -f | Out-String)
                }
                $global:LASTEXITCODE = 0
            }
        }
    }
}

function Get-SelfServiceRegistryPath
{
    return 'HKLM:\SOFTWARE\Microsoft\Dynamics\{0}\RetailSelfService' -f (Get-ProductVersionMajorMinor)
}

function Get-AOSWebsiteName
{
    $aosWebsiteName = 'AOSService'
    $aosWebsiteNameFromRegistry = Read-RegistryValue -targetRegistryKeyPath (Get-SelfServiceRegistryPath) -targetPropertyName 'AOSWebsiteName'
    
    if ($aosWebsiteNameFromRegistry)
    {
        $aosWebsiteName = $aosWebsiteNameFromRegistry
    }

    return $aosWebsiteName
}

# We need this function because get-website has bug in windows server 2008 Datacenter.
# Get-Website -Name "websiteName" returns all websites, not the specific name only.
# There is another bug with Get-Website in Windows Server 2008 R2 SP1 with PowerShell 3.0. 
# We need to retry the Get-Website call if it fails for the first time
function Get-WebSiteSafe(
    [string]$Name = $(Throw 'Name parameter required'))
{
    try
    {
        Log-ActionItem "Trying to get information of the website - $Name"
        Get-WebSite | Where-Object { $_.Name -eq $Name }
    }
    catch [System.IO.FileNotFoundException]
    {
        Log-ActionItem "Re-trying to get information of the website - $Name"
        Get-WebSite | Where-Object { $_.Name -eq $Name }
    }
}

function Get-WebsitePhysicalPath(
    [string]$webSiteName = $(Throw 'webSiteName is required!')
)
{
    $IISWebSiteObject = Get-WebSiteSafe -Name $webSiteName

    if(!$IISWebSiteObject)
    {
        Throw ("Unable to find a website: '{0}'. Verify that the website exists." -f $webSiteName)
    }
    
    return $IISWebSiteObject.physicalPath
}

function Get-AOSWebConfigFilePath(
    [string]$AOSWebsitePhysicalPath = $(Throw 'AOSWebsitePhysicalPath is required!')
)
{
    $webConfigFilePath =  Join-Path -Path $AOSWebsitePhysicalPath -ChildPath 'web.config'

    if(-not(Test-Path -Path $webConfigFilePath))
    {
        Throw ("Unable to locate Web.config for website: '{0}'. Verify that the website exists." -f $AOSWebsiteName)
    }

    return $webConfigFilePath
}
function Get-AXDeploymentUtilityFilesPath(
    [string]$AOSWebsitePhysicalPath = $(Throw 'AOSWebsitePhysicalPath is required!'),
    [string]$UtilityFileName = $(Throw 'UtilityFileName is required!')
)
{  
    # We DO NOT want to edit the file under AOS WebRoot, which may result in the crashing of AOS WebSite, and as a result, it may break the servicing process
    # We can use the same utility under PackagesLocalDirectory\bin, where all the dependencies exist as well.
    $webConfigFilePath =  Join-Path -Path $AOSWebsitePhysicalPath -ChildPath 'web.config'
    if(-not(Test-Path -Path $webConfigFilePath))
    {
        throw "Unable to locate AOS web.config at $webConfigFilePath "
    }
    
    $aosWebConfigContent = [xml](Get-Content -Path $webConfigFilePath)

    $binDirectory = $aosWebConfigContent.SelectSingleNode("/configuration/appSettings/add[@key='Common.BinDir']").value;

    $UtilityFilePath =  Join-Path -Path $binDirectory -ChildPath (Join-Path -Path 'bin' -ChildPath $UtilityFileName)
    if(-not(Test-Path -Path $UtilityFilePath))
    {
        throw "Unable to locate $UtilityFilePath"
    }

    return $UtilityFilePath
}

function Read-RegistryValue(
    [ValidateNotNullOrEmpty()]
    [string]$targetRegistryKeyPath = $(throw 'targetRegistryKeyPath is required'),
    [string]$targetPropertyName = $(throw 'targetPropertyName is required')
)
{
    $targetPropertyRegistryObject = Get-ItemProperty -Path $targetRegistryKeyPath -Name $targetPropertyName -ErrorAction SilentlyContinue
    $result = $targetPropertyRegistryObject.$targetPropertyName

    return $result
}

function Set-SChannelProtocol(
    [ValidateNotNullOrEmpty()]
    [string]$protocolName = $(throw 'protocolName is required'),
    
    [ValidateSet('Server', 'Client')]
    [string]$target = $(throw 'target is required'),
    
    [ValidateSet('Enable', 'Disable')]
    [string]$action = $(throw 'action is required'))
{
    [int]$value = 0
    if ($action -eq 'Enable')
    {
        $value = 1
    }

    $registryPath = 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\{0}\{1}' -f $protocolName, $target
    
    if (!(Test-Path -Path $registryPath -ErrorAction 'SilentlyContinue'))
    {
        New-Item -Path $registryPath -Force
    }

    Set-ItemProperty -Path $registryPath -Name 'Enabled' -Type 'dword' -Value $value -Force

    # Required for Windows 7 to negotiate TLS 1.2, later protocols will be impacted most likely as well.
    # This property also exists in Windows 10, so it is fine to set it for all.
    if ($action -eq 'Enable')
    {
        Set-ItemProperty -Path $registryPath -Name 'DisabledByDefault' -Type 'dword' -Value 0 -Force
    }
}

function Configure-SChannelProtocols(
    [ValidateNotNull()]
    $protocols  = $(throw 'protocols is required'))
{
    foreach($protocol in $protocols)
    {
        $protocolName = $protocol.name
        $target = $protocol.target
        $action = $protocol.action

        Log-TimedMessage ('Setting SChannel protocol {0} for {1} to be {2}' -f $protocolName, $target, $action)
        Set-SChannelProtocol -protocolName $protocolName -target $target -action $action
        Log-TimedMessage 'Set completed successfully'
    }
}

function Configure-SChannel(
    [ValidateNotNull()]
    $TopologyNode = $(throw 'TopologyNode is required'))
{
    Configure-SChannelProtocols -protocols $topologyNode.Protocols.Protocol

    # -ne $null is important since empty node evaluates to false.
    if($TopologyNode.UseStrongCrypto -ne $null)
    {
        Set-UseStrongCrypto
    }
}

function Set-UseStrongCrypto
{
    Log-TimedMessage 'Setting use of strong cryptography'

    $keys = @(
        'HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319'
        'HKLM:\SOFTWARE\Wow6432Node\Microsoft\.NETFramework\v4.0.30319'
    )
    
    $propertyName = 'SchUseStrongCrypto'
    $propertyValue = 1
    
    foreach($key in $keys)
    {
        Log-TimedMessage ('Checking if {0} exists' -f $key)
        if (Test-Path -Path $key -ErrorAction 'SilentlyContinue')
        {
            Log-TimedMessage ('Yes. Setting {0} to {1}' -f $propertyName, $propertyValue)
            Set-ItemProperty -Path $key -Name $propertyName -Value $propertyValue -Type dword -Force
        }
        else
        {
            Log-TimedMessage 'No. Skipping property set.'
        }
    }
    
    Log-TimedMessage 'Successfully set use of strong cryptography'
}

$__ProcessModuleGetterSource = @"
namespace ManagedCode
{
    using System;
    using System.Text;
    using System.Collections.Generic;
    using System.Runtime.InteropServices;

    /// <summary>
    /// Gets x86 and x64 modules of a process.
    /// </summary>
    public static class ProcessModuleGetter
    {
        [DllImport("psapi.dll", SetLastError = true)]
        public static extern bool EnumProcessModulesEx(IntPtr hProcess,
        [MarshalAs(UnmanagedType.LPArray, ArraySubType = UnmanagedType.U4)] [In][Out] IntPtr[] lphModule, 
            int cb, [MarshalAs(UnmanagedType.U4)] out int lpcbNeeded, uint dwFilterFlag);

        [DllImport("psapi.dll", SetLastError = true)]
        public static extern uint GetModuleFileNameEx(IntPtr hProcess, IntPtr hModule, [Out] StringBuilder lpBaseName, 
        [In] [MarshalAs(UnmanagedType.U4)] int nSize);

        [DllImport("kernel32", SetLastError = true)]
        public static extern IntPtr OpenProcess(uint dwDesiredAccess, bool bInheritHandle, uint dwProcessId);

        [DllImport("kernel32.dll", SetLastError=true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool CloseHandle(IntPtr hObject);

        // This is to get x64 and x86 modules of a process.
        public const uint LIST_MODULES_ALL = 0x03;
        
        // Required permission to open process for read.
        public const uint PROCESS_VM_READ = 0x0010;
        
        // Required permission to open process to read process module information.
        public const uint PROCESS_QUERY_INFORMATION = 0x0400;
        
        // Overall permissions for process.
        public const uint PROCESS_OPEN_ACCESS = (uint)(PROCESS_VM_READ | PROCESS_QUERY_INFORMATION);
        
        /// <summary>
        /// Gets x86 and x64 modules paths of a process.
        /// </summary>
        /// <param name="processId">Id of a process to get modules for.</param>
        /// <returns>List of process modules paths.</returns>
        public static List<string> GetProcessModules(uint processId)
        {
            List<string> result = new List<string>();

            IntPtr hProcess = OpenProcess(PROCESS_OPEN_ACCESS, false, processId);
            if (hProcess != IntPtr.Zero)
            {
                IntPtr[] lphModules = new IntPtr[0];
                int lpcbNeeded = 0;

                // Get number of bytes needed to store information.
                EnumProcessModulesEx(hProcess, lphModules, 0, out lpcbNeeded, LIST_MODULES_ALL);

                lphModules = new IntPtr[lpcbNeeded / IntPtr.Size];
                EnumProcessModulesEx(hProcess, lphModules, lphModules.Length * IntPtr.Size, out lpcbNeeded, LIST_MODULES_ALL);

                for (int moduleIdx = 0; moduleIdx < lphModules.Length; moduleIdx++)
                {
                    StringBuilder moduleNameBuilder = new StringBuilder(1024);
                    if(GetModuleFileNameEx(hProcess, lphModules[moduleIdx], moduleNameBuilder, moduleNameBuilder.Capacity) != 0)
                    {
                        result.Add(moduleNameBuilder.ToString());
                    }
                }
            }

            if (hProcess != IntPtr.Zero)
            {
                CloseHandle(hProcess);
            }

            return result;
        }
    }
}
"@

# Gets process modules paths.
function Get-ProcessModules(
    [ValidateNotNull()]
    $processId = $(throw 'ProcessId parameter is mandatory'))
{
    try
    {
        # We need this because in x64 powershell $process.Modules return only x64 modules. But we want x86 modules as well.
        [void](Log-TimedMessage ('Getting modules for process with id [{0}] using native API to get x86 modules as well.' -f $processId))
        [void](Add-Type -TypeDefinition $__ProcessModuleGetterSource -Language CSharp)
        $result = [ManagedCode.ProcessModuleGetter]::GetProcessModules($processId)
    }
    catch
    {
        [void](Log-Exception $_)
        [void](Log-TimedMessage 'Native API failed.')
        $result = $null
    }

    if(!$result)
    {
        [void](Log-TimedMessage 'Native API did not return any modules. Falling back on regular Modules property.')
        $result = Get-Process | Where-Object { $_.Id -eq $processId } | ForEach-Object { $_.Modules } | ForEach-Object { $_.FileName }
    }

    return $result
}

function Kill-ProcessSafe(
    [ValidateNotNull()]
    $process = $(throw 'process parameter is mandatory'))
{
    try
    {
        Log-TimedMessage ('Killing process {0} with id {1}' -f $process.ProcessName, $process.Id)
        $process.Kill()
        Log-TimedMessage 'Kill process succeeded'
    }
    catch
    {
        Log-TimedMessage 'Kill process failed'
        Log-Exception $_
    }
}

# Checks if given process uses any Modern POS files.
function Test-IfProcessIsLockingModernPosFiles(
    [ValidateNotNull()]
    $process = $(throw 'process parameter is mandatory')
)
{
    [void](Log-TimedMessage ('Testing if process [{0}] with id [{1}] is locking Modern POS files' -f $process.ProcessName, $process.Id))
    $processModules = Get-ProcessModules -ProcessId $process.Id

    [void](Log-TimedMessage 'Process is found to be using following modules:')
    [void](Log-TimedMessage ($processModules | Out-String -Width 1024))
    $mposSpecificModules = $processModules | Where-Object { $_ -like '*Microsoft.Dynamics.*' }

    $modernPosModulesMessage = 'None'
    $result = $false
    if($mposSpecificModules) 
    { 
        $result = $true 
        $modernPosModulesMessage = $mposSpecificModules | Out-String -Width 1024
    }
    
    [void](Log-TimedMessage 'Modern POS modules are:')
    [void](Log-TimedMessage $modernPosModulesMessage)
    return $result
}

# Kills all Modern POS processes.
function Kill-ModernPosProcesses
{
    $processesToKillNames = @('wwahost', 'dllhost')

    foreach($processToKillName in $processesToKillNames)
    {
        Log-TimedMessage ('Searching for Modern POS {0} processes to kill.' -f $processToKillName)

        # Get-Process 'name' fails if there is no process with such name, so we need -ErrorAction 'SilentlyContinue'
        $processes = Get-Process $processToKillName -ErrorAction 'SilentlyContinue' | where { Test-IfProcessIsLockingModernPosFiles -process $_ }

        if($processes)
        {
            Log-TimedMessage 'Trying to kill processes.'
            foreach($process in $processes)
            {
                Log-TimedMessage ($process | Out-String -Width 1024)
                Kill-ProcessSafe -process $process
            }
        }
        else
        {
            Log-TimedMessage ('No {0} processes found to kill.' -f $processToKillName)
        }
    }
}

function Deploy-TopologyWebsite(
    [ValidateNotNull()]
    $topologyNode = $(throw 'topologyNode parameter is mandatory'),
    
    [System.Management.Automation.PSCredential[]]$Credentials)
{
    $config = Get-IISWebSiteConfigFromXmlNode $topologyNode
    Install-WebApplication -WebSiteConfig $config -Credentials $Credentials
}

function UnDeploy-TopologyWebsite(
    [ValidateNotNull()]
    $topologyNode = $(throw 'topologyNode parameter is mandatory'))
{
    $config = Get-IISWebSiteConfigFromXmlNode $topologyNode
    Uninstall-WebApplication -WebSiteConfig $config
}

function Run-TopologyScript(
    [ValidateNotNull()]
    $TopologyNode = $(throw 'TopologyNode is required'),

    [System.Management.Automation.PSCredential[]]$Credentials
)
{
    $Path = $TopologyNode.Path
    Log-TimedMessage ('Running {0}' -f $Path)
    
    $parameters = @{}
    $TopologyNode.Parameter | foreach { $parameters[$_.Name] = $_.Value }

    if ($Credentials)
    {
        $parameters['Credentials'] = $Credentials
    }

    Invoke-ScriptBlock -ScriptBlock { &$Path @parameters} 
}

function Configure-TopologyAppConfig(
    [ValidateNotNull()]
    $TopologyNode = $(throw 'TopologyNode is required')
)
{
    $Path = $TopologyNode.path
    Log-TimedMessage ('Configuring values in {0}' -f $Path)
    
    if(!(Test-Path -Path $Path))
    {
        throw ('Could not find path {0}' -f $Path)
    }
    
    $configXml = [xml](Get-Content -Path $Path)
    
    foreach ($appSettingNode in $TopologyNode.AppSetting) 
    {
        $Key = $appSettingNode.Key
        $Value = $appSettingNode.Value
        $appSettingXPath = "/configuration/appSettings/add[@key='{0}']" -f $Key
        Update-XmlObjAttributeValue -xml $configXml -xpath $appSettingXPath -attributeName 'value' -Value $Value
    }
    
    $UseAdfsAuthentication = $false

    foreach ($customSettingNode in $TopologyNode.CustomSetting) 
    {
        $XPath = $customSettingNode.XPath
        $Value = $customSettingNode.Value
        
        Update-XmlObjValue -xml $configXml -xpath $XPath -Value $Value

        if ($XPath -like "*'authenticationType'*" -and ($Value -eq "2" -or $Value -eq "AdfsServiceToServiceClientSecretAuthentication"))
        {
            $UseAdfsAuthentication = $true
        }
    }

    if ($UseAdfsAuthentication -eq $true)
    {
        foreach ($customSettingNode in $TopologyNode.CustomSetting) 
        {
            $XPath = $customSettingNode.XPath
            $Value = $customSettingNode.Value

            if ($XPath -like "*'AzureResource'*") 
            {
                Log-TimedMessage ('ADFS detected, Azure Resource value will be defined based on AOS url without "namespaces/AXSF/" included.')
                $Value = $Value.Replace("namespaces/AXSF/","")
                Log-TimedMessage ('"{0}" has been redefined as: "{1}".' -f $XPath, $Value)
                Update-XmlObjValue -xml $configXml -xpath $XPath -Value $Value
            }
        }
    }
            
    $configXml.Save($Path)
}

function New-TopologyItem(
    [ValidateNotNull()]
    $TopologyNode = $(throw 'TopologyNode is required')
)
{
    Log-TimedMessage ('Checking if item "{0}" esists' -f $TopologyNode.Path)
    if (!(Test-Path -Path $TopologyNode.Path -ErrorAction 'SilentlyContinue'))
    {
        Log-TimedMessage 'Item does not exist. Creating.'
        [hashtable]$arguments = @{ 
            'Path' = $TopologyNode.Path 
            'Force' = $true
        }
        
        if($TopologyNode.ItemType)
        {
            $arguments['ItemType'] = $TopologyNode.ItemType
        }
        
        Log-TimedMessage ('Creating item {0}' -f $TopologyNode.Path)
        New-Item @arguments
    }
    else 
    {
        Log-TimedMessage 'Item exists. Skip creation.'
    }
}

function Preprocess-TopologyXml(
    [ValidateNotNull()]
    $TopologyNode = $(throw 'TopologyNode is required')
)
{	
    $webConfigFilePath = $TopologyNode.Path
    Log-TimedMessage ('Preprocessing XML {0}' -f $WebConfigFilePath)
    
    $definitions = $TopologyNode.Define `
    | where { $_.Value -eq 'true' } `
    | foreach { $_.Name }

    Log-TimedMessage ('Definitions to process: {0}' -f ($definitions -join ', '))

    $definitionMasks = $definitions | foreach { '*${{{0}}}*' -f $_ } 
    Log-TimedMessage ('Definition masks: {0}' -f ($definitionMasks -join ', '))

    $lines = Get-Content $WebConfigFilePath
    $newLines = @()
    $uncommentedLines = @()

    $uncommenting = $false
    foreach ($line in $lines)
    {
        $startUncommenting = $line -like '*<!--*ifdef*' -and ($definitionMasks | where { $line -like $_ }) 
        $endUncommenting = $line -like '*endif*-->*'

        # Do not include first ifdef or uncommented block
        if($startUncommenting) 
        {
            $definitionToUncomment = $line
            Log-TimedMessage ('Started uncommenting definition line: {0}' -f $definitionToUncomment)
            $uncommenting = $true
            continue
        }

        # Do not include last endif of uncommented block
        if($endUncommenting -and $uncommenting)
        {
            Log-TimedMessage ('Ended uncommenting definition line: {0}' -f $definitionToUncomment)
            $newLines += $uncommentedLines
            $uncommentedLines = @()
            $uncommenting = $false
            continue
        }

        if($uncommenting)
        {
            $uncommentedLines += $line
        } 
        else
        {
            $newLines += $line
        }
    }

    Set-ItemProperty $WebConfigFilePath -name IsReadOnly -value $false
    Set-Content -Path $WebConfigFilePath -Value $newLines -Force
    
    Log-TimedMessage ('Preprocessing of XML {0} completed successfully.' -f $WebConfigFilePath)        
}

function Remove-TopologyItem(
    [ValidateNotNull()]
    $TopologyNode = $(throw 'TopologyNode is required')
)
{
    Log-TimedMessage ('Checking if item {0} exits to remove it.' -f $TopologyNode.Path)
    if(Test-Path -Path $TopologyNode.Path -ErrorAction 'SilentlyContinue')
    {
        Log-TimedMessage 'Yes. Removing'
        [hashtable]$arguments = @{ 
            'Path' = $TopologyNode.Path 
            'Force' = $true
            'Recurse' = $true
        }
        
        Remove-Item @arguments
    }
    else
    {
        Log-TimedMessage 'No. Skip removal'
    }
}

function Insert-Data(
    [ValidateNotNull()]
    $TopologyNode = $(throw 'TopologyNode is required')
)
{
    $arguments = @{
        'SqlServerInstanceName' = $TopologyNode.DatabaseServerNamedInstanceName
        'DatabaseName' = $TopologyNode.DatabaseName
        'Rows' = $TopologyNode.Row
        'TableName' = $TopologyNode.TableName
    }
    
    InsertInto-Database @arguments
}

function Deploy-TopologyFirewallRule(
    [ValidateNotNull()]
    $TopologyNode = $(throw 'TopologyNode is required')
)
{
    if ($TopologyNode.RemoveAllWithNamePrefix) 
    {
        return;
    }

    $arguments = @{
        'RuleName' = $topologyNode.RuleName 
        'TrafficDirection' = $topologyNode.TrafficDirection 
        'Action' = $topologyNode.Action 
        'Protocol' = $topologyNode.Protocol 
        'Port' = $topologyNode.Port 
    }

    New-FirewallRule @arguments
}

function UnDeploy-TopologyFirewallRule(
    [ValidateNotNull()]
    $TopologyNode = $(throw 'TopologyNode is required')
)
{
    if ($TopologyNode.RemoveAllWithNamePrefix)
    {
        Remove-FirewallRulesByNamePrefix -ruleNamePrefix $topologyNode.RemoveAllWithNamePrefix
    }
    else
    {
        Remove-FirewallRule -ruleName $topologyNode.RuleName 
    }           
}

function Start-Target(
    [ValidateNotNullOrEmpty()]
    [string]$TargetName = $(throw 'TargetName is required'),

    [ValidateNotNullOrEmpty()]
    [ValidateSet('WindowsService')]
    [string]$TargetType = $(throw 'TargetType is required'))
{
    Start-WindowsService -ServiceName $TargetName
}

function Stop-Target(
    [ValidateNotNullOrEmpty()]
    [string]$TargetName = $(throw 'TargetName is required'),

    [ValidateNotNullOrEmpty()]
    [ValidateSet('WindowsService')]
    [string]$TargetType = $(throw 'TargetType is required'))
{
    Stop-WindowsService -ServiceName $TargetName
}

function Deploy-TopologyNode(
    [ValidateNotNull()]
    $topologyNode = $(throw 'topologyNode parameter is mandatory'),
    
    [System.Management.Automation.PSCredential[]]$Credentials
)
{
    # Need PSBase if $node has descendanct nodes or attributes with name 'Name'.
    $nodeName = $topologyNode.PSBase.Name
    Log-TimedMessage ('Deploying {0} topology node' -f $nodeName)
    switch($nodeName)
    {
        'AppConfig'
        {
            Configure-TopologyAppConfig -TopologyNode $topologyNode
        }

        'Database'
        {
            $dbConfigurations = Get-DatabaseConfigurationsFromXmlNodeList $TopologyXml @($topologyNode)
            Deploy-DatabaseConfiguration -dbConfigurations $dbConfigurations -Credentials $Credentials
        }
        
        'Insert'
        {
            Insert-Data -topologyNode $topologyNode
        }        

        'EtwManifest'
        {
            Register-EtwManifest -etwManifestFilePath $topologyNode.FilePath -etwManifestResourceFilePath $topologyNode.ResourceFilePath
        }

        'EventSource'
        {
            Create-EventSource -LogName $topologyNode.LogName -Source $topologyNode.Source
        }

        'FirewallRule'
        {
            Deploy-TopologyFirewallRule -TopologyNode $topologyNode
        }
        
        'LocalUser'
        {
            Deploy-LocalUser -TopologyNode $topologyNode -Credentials $Credentials
        }        

        'NewItem'
        {
            New-TopologyItem -TopologyNode $topologyNode
        }

        'PreprocessXml'
        {
	        Preprocess-TopologyXml -TopologyNode $topologyNode
        }

        'RunScript'
        {
            Run-TopologyScript -TopologyNode $topologyNode
        }

        'SChannel'
        {
            Configure-SChannel -TopologyNode $topologyNode
        }

        'WebSite' 
        {
            Deploy-TopologyWebsite -TopologyNode $topologyNode -Credentials $Credentials
        }

        'WindowsGroupMemberships'
        {
            Add-WindowsGroupMemberships -windowsGroupMembershipsNodes $topologyNode.ChildNodes
        }

        'WindowsService'
        {
            $config = Get-WindowsServiceConfigFromXmlNode $topologyNode
            Install-WindowsService -WinServiceConfig $config -Credentials $Credentials
        }
        
        'Start'
        {
            Start-Target -TargetName $TopologyNode.TargetName -TargetType $TopologyNode.TargetType
        }
        
        'Stop'
        {
            Stop-Target -TargetName $TopologyNode.TargetName -TargetType $TopologyNode.TargetType
        }
    }
    
    Log-TimedMessage ('Successfully deployed {0} topology node' -f $nodeName)
}

function Get-LocalMachineDirectoryEntry
{
    # domain controllers dont have a local machine directory entry
    [string]$domainName = IfDomainControllerGetDomain

    $target = $env:ComputerName
    if (-not [String]::IsNullOrWhiteSpace($domainName))
    {
        $target = $domainName
    }
    
    return New-Object System.DirectoryServices.DirectoryEntry('WinNT://{0}' -f $target)
}

function Get-LocalUserEntry(
    [ValidateNotNull()]
    [System.DirectoryServices.DirectoryEntry]$localMachineEntry = $('throw localMachineEntry parameter is required'),
    
    [ValidateNotNullOrEmpty()]
    [string]$userName = $('throw userName parameter is required'))
{
    return $localMachineEntry.Children | where { $_.Name -eq $userName }
}

function New-LocalUser(
    [ValidateNotNull()]
    [System.Management.Automation.PSCredential]$Credential = $('throw Credential parameter is required'))
{
    $UserName = $Credential.UserName
    $UserName = Convert-UserNameToADFormat -UserName $UserName
    $UserName = ($UserName.Split('\'))[1]

    $localMachineEntry = Get-LocalMachineDirectoryEntry
    
    Log-TimedMessage ('Checking if user {0} exists.' -f $UserName)
    $userEntry = Get-LocalUserEntry -LocalMachineEntry $localMachineEntry -UserName $UserName
    if (!$userEntry)
    {
        Log-TimedMessage ('No. Creating new user {0}.' -f $UserName)
        $userEntry = $localMachineEntry.Children.Add($UserName, "user")
    }
    else
    {
        Log-TimedMessage ('Yes. User {0} already exists.' -f $UserName)
    }

    Log-TimedMessage ('Updating user {0} properties.' -f $UserName)
    $userEntry.Properties["FullName"].Add('Dynamics 365 for Retail service user.')
    $userEntry.Invoke('SetPassword', $Credential.GetNetworkCredential().Password)
    $userEntry.CommitChanges();    
    
    Log-TimedMessage ('Successfully updated user {0} properties.' -f $UserName)
}

function Remove-LocalUser(
    [ValidateNotNullOrEmpty()]
    [string]$UserName = $('throw UserName parameter is required'))
{
    $UserName = Convert-UserNameToADFormat -UserName $UserName
    $UserName = ($UserName.Split('\'))[1]

    Log-TimedMessage ('Removing local user {0}' -f $UserName)

    $localMachineEntry = Get-LocalMachineDirectoryEntry
    $userEntry = Get-LocalUserEntry -LocalMachineEntry $localMachineEntry -UserName $UserName
    if ($userEntry)
    {
        $localMachineEntry.Children.Remove($userEntry)
        Log-TimedMessage ('Successfully removed local user {0}' -f $UserName)
    }
    else
    {
        Log-TimedMessage ('User {0} does not exist' -f $UserName)
    }
}

function Deploy-LocalUser(
    [ValidateNotNull()]
    $topologyNode = $(throw 'topologyNode parameter is mandatory'),
    
    [ValidateNotNull()]
    [System.Management.Automation.PSCredential[]]$Credentials = $(throw 'Credentials parameter is required')
)
{
    $userCredential = Get-NotNullCredentialByUserName -Credentials $Credentials -UserName $topologyNode.UserName
    New-LocalUser -Credential $userCredential
}

function UnDeploy-LocalUser(
    [ValidateNotNull()]
    $topologyNode = $(throw 'topologyNode parameter is mandatory')
)
{
    Remove-LocalUser -UserName $topologyNode.UserName
}

function UnDeploy-TopologyNode(
    [ValidateNotNull()]
    $topologyNode = $(throw 'topologyNode parameter is mandatory')
)
{
    # Need PSBase if $node has descendanct nodes or attributes with name 'Name'.
    $nodeName = $topologyNode.PSBase.Name
    Log-TimedMessage ('Undeploying {0} topology node' -f $nodeName)
    switch($nodeName)
    {
        'EtwManifest'
        {
            Unregister-EtwManifest -etwManifestFilePath $topologyNode.FilePath
        }
        
        'EventSource'
        {
            Remove-ApplicationLogEventSource -kLogSourceName $topologyNode.Source
        }
        
        'FirewallRule'
        {
            UnDeploy-TopologyFirewallRule -TopologyNode $topologyNode
        }
        
        'LocalUser'
        {
            UnDeploy-LocalUser -TopologyNode $topologyNode
        }        
        
        'NewItem'
        {
            Remove-TopologyItem -TopologyNode $topologyNode
        }
        
        'WebSite' 
        {
            UnDeploy-TopologyWebsite -TopologyNode $topologyNode
        }

        'WindowsService'
        {
            $config = Get-WindowsServiceConfigFromXmlNode $topologyNode
            Uninstall-WindowsService -WinServiceConfig $config
        }
    }
    
    Log-TimedMessage ('Successfully undeployed {0} topology node' -f $nodeName)
}

function Get-NotNullCredentialByUserName( 
    [ValidateNotNullOrEmpty()]
    [string]$UserName = $(throw 'parameter UserName is mandatory'),

    [ValidateNotNull()]
    [System.Management.Automation.PSCredential[]]$Credentials = $(throw 'parameter Credentials is mandatory')
)
{
    $result = $Credentials | where { $_.UserName -eq $UserName }
    if (!$result)
    {
        throw ('Credential with UserName "{0}" was not found' -f $UserName)
    }
    
    return $result
}

function Convert-SecretToSetting(
    [ValidateNotNullOrEmpty()]
    [string]$SecretId = $(throw 'parameter SecretId is mandatory'),

    [ValidateNotNull()]
    [System.Management.Automation.PSCredential[]]$Credentials = $(throw 'parameter Credentials is mandatory')
)
{
    $credential = Get-NotNullCredentialByUserName -UserName $SecretId -Credentials $Credentials
    $result = [Microsoft.Dynamics.Retail.Security.DPAPICipher]::Protect($credential.Password)
    return $result
}

function Get-TopologyParameterValue(
    [ValidateNotNull()]
    $parameter = $(throw 'parameter parameter is mandatory'),
    
    [System.Management.Automation.PSCredential[]]$Credentials
)
{
    $result = $parameter.Value
    
    switch ($parameter.Transform)
    {
        'SecretToSetting'
        {
            if($Credentials)
            {
                $result = Convert-SecretToSetting -SecretId $result -Credentials $Credentials
            }
            else 
            {
                Log-TimedMessage ('Skipping conversion of "{0}" since credentials were not passed.' -f $result)
            }
        }       
    }
    
    return $result 
}

function Expand-TopologyReferences(
    [ValidateNotNull()]
    [xml]$TopologyXml = $(throw 'TopologyXml parameter is mandatory'),
    
    [System.Management.Automation.PSCredential[]]$Credentials    
)
{
    Log-TimedMessage 'Expanding topology references'
    $parametersNameXPathFmt = "//Settings/Parameters/Parameter[@Name='{0}']"
    $parameterRefPrefix = 'param-ref!!'
    $parameterRefAttributes = $TopologyXml.SelectNodes(("//@*[contains(., '{0}')]" -f $parameterRefPrefix))
    
    foreach($parameterRefAttribute in $parameterRefAttributes)
    {
        $referenceValue = $parameterRefAttribute.Value
        Log-TimedMessage ('Expanding {0}' -f $referenceValue)
    
        $parameterName = $parameterRefAttribute.Value.Replace($parameterRefPrefix, '')
        $parameterNameXPath = $parametersNameXPathFmt -f $parameterName
        $parameter = $TopologyXml.SelectSingleNode($parameterNameXPath)
        if (!$parameter)
        {
            throw ('Node is not found under {0}' -f $parameterNameXPath)
        }
        
        $parameterValue = Get-TopologyParameterValue $parameter -Credentials $Credentials
        $parameterRefAttribute.Value = $parameterValue
        
        Log-TimedMessage ('Successfully expanded "{0}" with value "{1}"' -f $referenceValue, $parameterValue)
    }
    
    Log-TimedMessage 'Successfully expanded topology references'
    return $TopologyXml
}

function Import-TopologyDeploymentDependencies(
     [ValidateNotNull()]
     [string]$DependenciesLocation = $(Throw 'DependenciesLocation is required!')
)
{
    $filesToImport = @(
        'Common-Web.ps1'
        'Common-WinService.ps1'
        'Common-Database.ps1'
    )

    foreach($fileToImport in $filesToImport)
    {
        $fullPath = Join-Path $DependenciesLocation $fileToImport
        if (Test-Path $fullPath) 
        {
            Log-TimedMessage ('Dot sourcing "{0}"' -f $fullPath)
            try
            {
                . $fullPath
            }
            catch
            {
                # Need this for Self-service multibox scenario.
                # Dot sourcing of Common-Database imports sqlps which might be not available. And not used at the same time.
                # We can log and ignore this failure since the first invokation to function of failed module will fail.

                $hashesFmt = '#' * 30 + ' {0} ' + '#' * 30
                Log-TimedMessage
                Log-TimedMessage ($hashesFmt -f 'Dot sourcing failed. Some functions might be not available.')
                Log-TimedMessage ($_ | fl * -Force | Out-String -Width 1024)
                Log-TimedMessage
            }
        }
    }
    
    $dependencyLibrariesNames = @(
        'Microsoft.Dynamics.Retail.Security.dll'
    )
    
    foreach($libraryName in $dependencyLibrariesNames) 
    {
        $libraryPath = Join-Path $DependenciesLocation $libraryName
        if (Test-Path $libraryPath)
        {
            Log-TimedMessage ('Loading "{0}"' -f $libraryPath)
            [System.Reflection.Assembly]::LoadFrom($libraryPath)
        }
    }
}

function DeployUnDeploy-Topology(
     [ValidateNotNull()]   
     [string]$TopologyXmlFilePath = $(Throw 'TopologyXmlFilePath is required!'),
     
     [ValidateNotNull()]
     [string]$SettingsXmlFilePath = $(Throw 'SettingsXmlFilePath is required!'),

     [System.Management.Automation.PSCredential[]]$Credentials,

     [ValidateSet('Deploy', 'UnDeploy')]
     [string]$action = $(Throw 'action is required!')
)
{
    [xml]$TopologyXml = Expand-VariablesFromSettingsFile $TopologyXmlFilePath $SettingsXmlFilePath
    $TopologyXml = Expand-TopologyReferences -TopologyXml $TopologyXml -Credentials $Credentials
    foreach($instance in $TopologyXml.Settings.Instances.Instance)
    {
        Log-TimedMessage ('Applying {0} action for instance {1}' -f $action, $instance.id)
        
        $nodesToDeployInOrder = @()
        $preDeploymentNode = $instance.PreDeployment
        if ($preDeploymentNode)
        {
            $nodesToDeployInOrder += $preDeploymentNode.ChildNodes
        }
        
        $nodesToDeployInOrder += ($instance.ChildNodes | where { $_.PSBase.Name -ne $preDeploymentNode.PSBase.Name })
        
        foreach($node in $nodesToDeployInOrder)
        {
            $nodeToDeploy = $node
            $nodeName = $node.PSBase.Name
            
            if($nodeName -eq '#comment')
            {
                continue
            }
            
            # To have new line in the log before each node.
            Log-TimedMessage ''
            
            $deployAllowed = $true
            if($nodeName -eq 'DeploymentItem')
            {
                $nodeToDeploy = $node.ChildNodes[0]
                $deployAllowed = $node.UserAllowed -eq 'true'
            }
            
            switch($action)
            {
                'Deploy'
                {
                    if($deployAllowed)
                    {
                        Deploy-TopologyNode -topologyNode $nodeToDeploy -Credentials $Credentials
                    }
                    else 
                    {
                        Log-TimedMessage ('Skipping deployment of node {0} since it was not allowed' -f $nodeToDeploy.PSBase.Name)
                    }
                }
                
                'UnDeploy'
                {
                    UnDeploy-TopologyNode -topologyNode $nodeToDeploy
                }
            }
        }
        
        Log-TimedMessage ('{0} action for instance {1} was successful.' -f $action, $instance.id)
    }
}

function Deploy-Topology(
     [string]$TopologyXmlFilePath = $(Throw 'TopologyXmlFilePath is required!'),
     [string]$SettingsXmlFilePath = $(Throw 'SettingsXmlFilePath is required!'),
     [System.Management.Automation.PSCredential[]]$Credentials)
{
    DeployUnDeploy-Topology -Action 'Deploy' -TopologyXmlFilePath $TopologyXmlFilePath -SettingsXmlFilePath $SettingsXmlFilePath -Credentials $Credentials 
}

function UnDeploy-Topology(
     [string]$TopologyXmlFilePath = $(Throw 'TopologyXmlFilePath is required!'),
     [string]$SettingsXmlFilePath = $(Throw 'SettingsXmlFilePath is required!'))
{
    DeployUnDeploy-Topology -Action 'UnDeploy' -TopologyXmlFilePath $TopologyXmlFilePath -SettingsXmlFilePath $SettingsXmlFilePath
}

function Configure-AxDeploymentUtility(
    [string]$aosWebConfigFilePath = $(Throw 'aosWebConfigFilePath parameter required'),
    [string]$aosWebsitePhysicalPath = $(Throw 'aosWebsitePhysicalPath parameter required')
)
{
    $axDeploymentUtilityConfigFilePath = Get-AXDeploymentUtilityFilesPath -AOSWebsitePhysicalPath $aosWebsitePhysicalPath -UtilityFileName 'Microsoft.Dynamics.AX.Deployment.Setup.exe.config'
    Log-TimedMessage ('Microsoft.Dynamics.AX.Deployment.Setup.exe.config located at:{0}{1}' -f [System.Environment]::NewLine, $axDeploymentUtilityConfigFilePath)

    # Read AOS Web.Config and Microsoft.Dynamics.AX.Deployment.Setup.exe.config
    [xml]$aosWebConfigContent = Get-Content -Path $aosWebConfigFilePath
    [xml]$AXDeploymentUtilityConfigFileContent = Get-Content -Path $axDeploymentUtilityConfigFilePath

    # These appSettings need to be copied from aos web.config to DB sync utility config in order to access the enryption api from DB Sync utility context.
    $DataAccessFlightingCachePathKey = 'DataAccess.FlightingCachePath'

    $appSettingKeysForMove = @(
        'Infrastructure.WebRoot',
        'Aos.SafeMode',
        'AzureStorage.StorageConnectionString',
        'DataAccess.DataEncryptionCertificateThumbprint',
        'DataAccess.DataSigningCertificateThumbprint',
        'DataAccess.FlightingServiceCacheFolder',
        'DataAccess.FlightingEnvironment',
        'DataAccess.FlightingCertificateThumbprint',
        'DataAccess.FlightingServiceCatalogID',
        $DataAccessFlightingCachePathKey
        )

    
    foreach($key in $appSettingKeysForMove)
    {
        $appSetting = $aosWebConfigContent.SelectSingleNode("/configuration/appSettings/add[@key='$key']")

        if($appSetting -ne $null)
        {
            $appSettingValue = $appSetting.Value

            $appSettingElement = $AXDeploymentUtilityConfigFileContent.configuration.appSettings.add | Where {$_.key -eq $key}

            switch($key)
            {
                'Infrastructure.WebRoot'{ $InfrastructureWebRoot = $appSettingValue}
                'DataAccess.FlightingServiceCacheFolder'{ $DataAccessFlightingServiceCacheFolder = $appSettingValue}
                'DataAccess.FlightingCachePath'{ $DataAccessFlightingCachePath = $appSettingValue}
            }

            # Only add a new element if one doesn't already exist.
            if($appSettingElement -eq $null)
            {
                $appSettingElement = $AXDeploymentUtilityConfigFileContent.CreateElement('add')
                $appSettingElement.SetAttribute('key',$key) 
                $appSettingElement.SetAttribute('value',$appSettingValue)
                $AXDeploymentUtilityConfigFileContent.configuration.appSettings.AppendChild($appSettingElement)
            }
            else
            {
                $appSettingElement.Value = [string]$appSettingValue
            }
        }
    }

    # DataAccess.FlightingCachePath needs special handling.
    if([String]::IsNullOrEmpty($DataAccessFlightingCachePath))
    {
        $appSettingElement = $AXDeploymentUtilityConfigFileContent.configuration.appSettings.add | Where {$_.key -eq $DataAccessFlightingCachePathKey}
        if(-not [String]::IsNullOrEmpty($DataAccessFlightingServiceCacheFolder))
        {
            $appSettingValue = Join-Path $InfrastructureWebRoot $DataAccessFlightingServiceCacheFolder
        }
        else
        {
            $appSettingValue = $InfrastructureWebRoot
        }

        # Only add a new element if one doesn't already exist.
        if(!$appSettingElement)
        {
            $appSettingElement = $AXDeploymentUtilityConfigFileContent.CreateElement('add')
            $appSettingElement.SetAttribute('key',$DataAccessFlightingCachePathKey) 
            $appSettingElement.SetAttribute('value',$appSettingValue)
            $AXDeploymentUtilityConfigFileContent.configuration.appSettings.AppendChild($appSettingElement)
        }
        else
        {
            $appSettingElement.value = [string]$appSettingValue
        }
    }

    $AXDeploymentUtilityConfigFileContent.Save($axDeploymentUtilityConfigFilePath)
    Log-TimedMessage 'Successfully updated Microsoft.Dynamics.AX.Deployment.Setup.exe.config'
}

function Create-Shortut(
     [string]$ShortcutPath = $(Throw 'ShortcutPath is required!'),
     [string]$ShortcutTargetPath = $(Throw 'ShortcutTargetPath is required!'),
	 [string]$ShortcutArguments = $(Throw 'ShortcutArguments is required!'))
{
	$WshShell = New-Object -comObject WScript.Shell
	$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
	$Shortcut.TargetPath = $ShortcutTargetPath
	$Shortcut.Arguments = $ShortcutArguments
	$Shortcut.Save()
}

Fix-PowerShellRedirection

# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDXfhQUqqdr29JN
# 6PO4VVrg3v9N2AqbcAtlBRqm2EUWj6CCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCA4
# Kw7PEPC7kYGBsfXMhXvWmhsXT3Ks7h2GDiw1BOGcdzCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBW
# pPZhYl7MZllWwVXEkxLipFQjVZWX7HaU8KPJjfcxFXEGvo/NIrRpplK2ZQxR8iZt
# 8Flw8a+/6qV5hK2cG8n7DH3AGdhxoWCUJEqHSpFZmFt0qBeQ5HrDrQMGzF2ko8V6
# hPyWtvGQ4xlBREb4GDCtUVekYEDn/s02UQ0Vnro5PUrqmKwb3+Hdv6BoexBv/9G7
# KiUW8M/hSw2vncWsx6CF7ANonJGGGdPCpSBsJZq0G2R3VPPLuASeTLhRTrvkgJnI
# To4My6J4Zs6foSrJaGWENr+ygyYvVIcBKgcfZVTGb++tPZMhhs2q8Nskq38v2PUR
# amJ/uTFPf2pLayFfrGlYoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IHKNIAEl5VVTOXRi0pD/sUKQD2O1FdUIGqCSAUdQk/lIAgZfPUPdP9EYEzIwMjAw
# ODIzMDQwMzQ0LjA0MVowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
# VQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25z
# IExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjg2REYtNEJCQy05MzM1
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOPDCCBPEw
# ggPZoAMCAQICEzMAAAEPgHL2OocIiK0AAAAAAQ8wDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTE4WhcNMjEw
# MTIxMjMxOTE4WjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
# BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UE
# CxMdVGhhbGVzIFRTUyBFU046ODZERi00QkJDLTkzMzUxJTAjBgNVBAMTHE1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQDfTTlAqt7zsZXhYoIINcxBZgfl5YjRGxMb7ZlQjUCdrc6k+8zabHfZ
# x0zltIbHzS7JPC88SgrCAs/MmK9FBxXDrnJ050gKBZinoEQI3CSJEZw4WufCT8O6
# FCAmbn5MaretSdqgOK4l+Vz+BOVD0LioTRavX2Ceg4iJYGTdOylXieYrpDTd9RmT
# iUCYi4Vu4EFZWJoZ2YapTFTYV7wIcuAIZKDosv+EZ/wVJL3xSa1foAYCf/w8qERb
# 8NVialjOH2fE3Lf5oQeg/j/4zVrmJ7xipPyNN3mltxJ7Z1XyGQ7H9kLtmsWvGsAw
# l0QWVa5ZWP7UvXR+iM89DD/fVVTuncMzAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
# 55UhgBltUsagF5bsdqrKlu8Y5XswHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8Uz
# aFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
# L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoG
# CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
# Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
# AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEA
# UIKxNncVWmmhpMsoVq3EeX2fhYTLEeDJ6HiDd3zcbvEsogFfpt7xq8iBr4YphPqh
# gs6yZayK5NEM6yOXEx7DYaPH32JELKHa3kWz3VsXlIAUrJk5FvUXYEZS2o3Og2F3
# RBvGtUQHze4ZR+rpSCNivRvjZYt7HQN/z4ucWiVDCJZeq+yNCggFTcrWKW2Fij5N
# reYcOvBox69xHyNa7fup2gSqO2h7H5toIN5LQ95shRt8HcRGALaym4WOsjQ5O9s/
# 4ypLJs84zKY2nMQJjZe64wEDuF5UkAZQBkr1yx1G0HSP8QsLGbXEBVP9bi5mu25q
# uoDVuB4o832eKwczNk3ZfjCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZI
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
# Ex1UaGFsZXMgVFNTIEVTTjo4NkRGLTRCQkMtOTMzNTElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAJEG7Qp9TlB0W
# edu0oJJBeqFkt2mggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
# MDANBgkqhkiG9w0BAQUFAAIFAOLsX4MwIhgPMjAyMDA4MjMxMTIyNDNaGA8yMDIw
# MDgyNDExMjI0M1owdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA4uxfgwIBADAKAgEA
# AgII0QIB/zAHAgEAAgIRkjAKAgUA4u2xAwIBADA2BgorBgEEAYRZCgQCMSgwJjAM
# BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEB
# BQUAA4GBAHmxtg/hmsHOALDgo+lI3C+Knp8eUCQKzhhkDFOaWpYHrCRxQOVzJf04
# XKuma90AvJB71XtnJ2GUl6uE41/cDXx8LAMpWbeJSoowL6K6lFKBwWC27J5whsl0
# LqQDBrtfDAZNILyVzPDizMwNO06Ppm8wvIKhChLaXEW9B46wNlGRMYIDDTCCAwkC
# AQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
# A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEPgHL2OocI
# iK0AAAAAAQ8wDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgWW1HgQKasYvTGVX71rVrjxIAhcq9YNUf
# Fg7hUZ/Jzv8wgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCA/mr0OeWgtFGzy
# p0EMW9VrRBbgtkv30N6zFN7wdHQ+jjCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABD4By9jqHCIitAAAAAAEPMCIEIG1GtLUyc4GoLtin
# HtLjMhBDoW7SJ7Scfgh2HeLyTZTSMA0GCSqGSIb3DQEBCwUABIIBAKes0wQtRJ08
# n6EBCvvdse9HFzAU5kbSPWYKXpduZm96Mg8GenIWJULL6zAJzkeODyKt1ovmQfqF
# xlhuYSEmvJzySqLkaVRqkPXuRfW+uYve6Q41md4HtPy42muMVDu0h2VTR5sd4NLs
# Ax5tP8epAYE7H6SDTVjqx/JmbUITfA4e1rYVnH2g3iGysQ4vZy21/dPuC1Hwyg4K
# C7O2+0Mz3GGt1DzfyjS8p9ttgDyb5FhOKMKOCVZbyofosk93eqexOYu0sxs434hF
# gNRyO1l6WYKJfSoinw62A9CIl0Ijk2Z8njdBTK9Sf962stPGKxKrMW5KhZ9LUsgG
# dqauT3va3Bc=
# SIG # End signature block
