param(
    $dbServer = $(Throw 'dbServer is required!'), 
    $dbName = $(Throw 'dbName is required!'), 
    $dbUser,
    $dbPassword,
    $AxDbDeploySqlUser,
    $AxDbDeploySqlPwd,
    $AxDeployExtUser,
    $AxDeployExtUserPassword,
    $serviceUri = $(Throw 'serviceUri is required!'),
    $AADTokenIssuerPrefix = $(Throw 'AADTokenIssuerPrefix is required!'),
    $AdminPrincipalName = $(Throw 'AdminPrincipalName is required!'),
    $AllowAnonymousContextRetailServerRequests = $(Throw 'AllowAnonymousContextRetailServerRequests is required!'),
    $RetailCryptographyThumbprint = $(Throw 'RetailCryptographyThumbprint is required!'),
    $RetailRTSAuthenticationCertificateThumbprint = $(Throw 'RetailRTSAuthenticationCertificateThumbprint is required!'),
    $HardwareStationAppInsightsInstrumentationKey = $(Throw 'HardwareStationAppInsightsInstrumentationKey is required!'),
    $ClientAppInsightsInstrumentationKey = $(Throw 'ClientAppInsightsInstrumentationKey is required!'),
    $WindowsPhonePosAppInsightsInstrumentationKey = $(Throw 'WindowsPhonePosAppInsightsInstrumentationKey is required!'),
    $EnvironmentId = $(Throw 'EnvironmentId is required!'),
    $TenantId = $(Throw 'TenantId is required!'),
    $AuthenticationType = "ServiceToServiceAuthentication",

    [string]$azureAuthority,
    # deploymentType, supported type: Cloud, RSSU
    [ValidateSet("Cloud", "RSSU")]
    [string]$deploymentType, 
    [string]$AosUrl,
    [string]$AosSoapUrl,
    [string]$AosWebsiteName,
    [string]$retailWebSiteName = $(Throw 'retailWebSiteName is required!'),
    [string]$validationKey = '',
    [string]$decryptionKey = '',
    [string]$validationMethod = 'SHA1',
    [string]$decryptionMethod = 'AES',
    [string]$RetailChannelStoreName = 'HoustonStore',
    [string]$retailCloudPOSUrl,
    [string]$retailStorefrontUrl,
    [string]$userId,
    $Encryption = $true,
    $DisableDBServerCertificateValidation = 'true',
    [string]$commonConfigurationPath,
    [string]$rsWebPath,
    [string]$registerPerfCountersScriptPath = "$PSScriptRoot\Register-PerfCounters.ps1",
    [string]$InstrumentedAssemblyPath = "$PSScriptRoot\..\ETWManifest\Microsoft.Dynamics.Retail.Diagnostics.dll",
    [string]$encryptConnectionStrings = 'true'
    )

$ErrorActionPreference = 'Stop'

# Generate MachineKey

function Gen-Key(
    [string]$EncryptionCertThumbPrint = $(Throw 'EncryptionCertThumbPrint is required!'),
    [string]$KeyGenerationCertThumbPrint = $(Throw 'KeyGenerationCertThumbPrint is required!')) 
{   
   $keyGenCertThumbprintBytes = [Text.Encoding]::UTF8.GetBytes($KeyGenerationCertThumbPrint)   
   
   $cert = (Get-ChildItem -path 'cert:\LocalMachine\My' | Where {$_.Thumbprint -eq $EncryptionCertThumbPrint})
   
   if (!$cert -or !$cert.PrivateKey)
   {
        throw ('Cannot find encryption certificate with thumbprint {0} or the private key for the certificate does not exist' -f $EncryptionCertThumbPrint)
   }
   
   [System.Security.Cryptography.RSACryptoServiceProvider]$certPrivateKey = $cert.PrivateKey
   $buff = $certPrivateKey.Encrypt($keyGenCertThumbprintBytes, $true)
   
   $sb = New-Object System.Text.StringBuilder(128)
   for($i = 0; ($i -lt $buff.Length); $i++)
   {
       $sb = $sb.AppendFormat("{0:X2}", $buff[$i])
   }
   
   return $sb.ToString()
}

function Remove-NonProductionReleaseFiles(
    [string]$TargetFolder = $(throw 'TargetFolder is required')
)
{
    $filesToRemove = @(
        'Microsoft.Dynamics.Retail.DynamicsOnlineConnector.dll',
        'Microsoft.Dynamics.Retail.DynamicsOnlineConnector.pdb',
        'Microsoft.Dynamics.Retail.DynamicsOnlineConnector.Portable.dll',
        'Microsoft.Dynamics.Retail.DynamicsOnlineConnector.Portable.pdb')
        
    foreach($file in $filesToRemove)
    {
        Remove-Item -Path (Join-Path $TargetFolder $file) -Force -ErrorAction SilentlyContinue
    }
}

function Get-ChannelDbRegistryPath
{
    return 'HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailChannelDatabase\Servicing'
}

function Get-ChannelDbExtUserRegistryPath
{
    return 'HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailChannelDatabase\Ext'
}

function Get-ChannelDbServicingPropertyName(
    [int]$propertyIndex = '1'
)
{
    return 'UpgradeServicingData' + $propertyIndex
}

function Save-ChannelDbServicingDataToRegistry(
    [string]$servicingData = $(throw 'servicingData is required.'),
    [string]$targetRegistryKeyPath = $(throw 'targetRegistryKeyPath is required.'),
    [string]$targetPropertyName =  $(throw 'targetPropertyName is required.')
)
{
    # Convert servicing data to secure text.
    $servicingDataAsSecureStringObject = ConvertTo-SecureString -AsPlainText $servicingData -Force
    $servicingDataAsEncryptedString = ConvertFrom-SecureString $servicingDataAsSecureStringObject
    
    # Save encrypted servicing data to the registry
    New-Item -Path $targetRegistryKeyPath -ItemType Directory -Force
    New-ItemProperty -Path $targetRegistryKeyPath -Name $targetPropertyName -Value $servicingDataAsEncryptedString
}

function Get-RTSServiceEndpoint(
    [string]$aosUrl,
    [string]$aosSoapUrl
)
{
    $result = $aosUrl
    if (![System.String]::IsNullOrWhiteSpace($aosSoapUrl))
    {
        $result = $aosSoapUrl
    }

    return $result
}

function Update-RetailServerWebConfig(
    [string]$retailServerWebsiteRoot = $(throw 'retailServerWebsiteRoot is required.'),
    [string]$clientAppInsightsKey = $(throw 'clientAppInsightsKey is required.'),
    [string]$hwsAppInsightsKey = $(throw 'hwsAppInsightsKey is required.'),
    [string]$winPhonePosAppInsightsKey = $(throw 'winPhonePosAppInsightsKey is required.'),

    [string]$environmentId = $(throw 'environmentId is required.'),
    [string]$tenantId = $(throw 'tenantId is required.'),
    [string]$retailCryptographyThumbprint = $(throw 'retailCryptographyThumbprint is required.'),
    [string]$overrideConnectionString = $(throw 'overrideConnectionString is required.'),
    $disableDBServerCertificateValidation = $(throw 'disableDBServerCertificateValidation is required.'),

    $dbUser,
    $dbPassword,

    $AxDbDeploySqlUser,
    $AxDbDeploySqlPwd,
    $AxDeployExtUser,
    $AxDeployExtUserPassword,

    [string]$dbServer = $(throw 'dbServer is required.'),
    [string]$dbName = $(throw 'dbServer is required.'),
    [string]$encryption = $(throw 'encryption is required.'),
    [string]$retailChannelStoreName = $(throw 'retailChannelStoreName is required.'),

    [string]$rtsAuthCertificateThumbprint = $(throw 'rtsAuthCertificateThumbprint is required.'),
    $validationKey = $(throw 'validationKey is required.'),
    $decryptionKey = $(throw 'decryptionKey is required.'),
    $validationMethod = $(throw 'validationMethod is required.'),
    $decryptionMethod = $(throw 'decryptionMethod is required.'),
    
    $AdminPrincipalName = $(throw 'AdminPrincipalName is required.'),
    $AADTokenIssuerPrefix = $(throw 'AADTokenIssuerPrefix is required.'),
    $IsAnonymousAccessEnabled = $(throw 'IsAnonymousAccessEnabled is required.'),

    $retailCloudPOSUrl,
    $retailStorefrontUrl
)
{
    $webConfigPath = Join-Path -Path $retailServerWebsiteRoot -ChildPath 'web.config'
    $webConfigContent = [xml](Get-Content -Path $webConfigPath)

    # Update App Insights keys.
     Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/environment/instrumentation/@hardwareStationAppinsightsKey' -value $hwsAppInsightsKey
     Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/environment/instrumentation/@clientAppInsightsKey' -value $clientAppInsightsKey
     Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/environment/instrumentation/@windowsPhonePosAppInsightsKey' -value $winPhonePosAppInsightsKey

     # Update Environment Id and TenantId.
     Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/environment/@id' -value $environmentId
     Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/environment/tenant/@id' -value $tenantId

    # Update cryptography certificate thumbprint.
    Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/retailServer/cryptography/@certificateThumbprint' -value $retailCryptographyThumbprint

    # Update cryptography certificate thumbprint to appSettings
    Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.DataEncryptionCertificateThumbprint']" -attributeName 'value' -value $retailCryptographyThumbprint
    Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.DataSigningCertificateThumbprint']" -attributeName 'value' -value $retailCryptographyThumbprint

    # Set isConnectionStringOverridden appSetting value.
    $isConnectionStringOverriddenKey = "isConnectionStringOverridden"
    $isConnectionStringOverriddenKeyElement = $webConfigContent.SelectSingleNode("//configuration/appSettings/add[@key='$isConnectionStringOverriddenKey']")

    if (!$isConnectionStringOverriddenKeyElement)
    {
        $isConnectionStringOverriddenKeyElement = $webConfigContent.CreateElement('add')
        $webConfigContent.configuration.appSettings.AppendChild($isConnectionStringOverriddenKeyElement) | Out-Null
    }

    Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='$isConnectionStringOverriddenKey']" -attributeName 'value' -value $overrideConnectionString

    # Setup the connectionStrings section.
    if ($dbUser -and $AxDbDeploySqlUser)
    {
        $retailChannelDBConnectionString = ('Server="{0}";Database="{1}";User ID="{2}";Password="{3}";Trusted_Connection=False;Encrypt={4};TrustServerCertificate={5};' `
            -f $dbServer,$dbName,$dbUser,$dbPassword, $encryption, $disableDBServerCertificateValidation)

        Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.Database']" -attributeName 'value' -value $dbName
        Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.DbServer']" -attributeName 'value' -value $dbServer
        Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.encryption']" -attributeName 'value' -value $encryption
        Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.disableDBServerCertificateValidation']" -attributeName 'value' -value $disableDBServerCertificateValidation
        
        # AxDbDeploySqlUser will be stored in retail server web.config with key DataAccess.AxAdminSqlUser
        Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.AxAdminSqlUser']" -attributeName 'value' -value $AxDbDeploySqlUser
        Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.AxAdminSqlPwd']" -attributeName 'value' -value $AxDbDeploySqlPwd

        Write-Log ("Saving extensions user {0} info in web.config." -f $AxDeployExtUser)
        # AxDeployExtUser will be stored in retail server web.config with key DataAccess.SqlUser
        Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.SqlUser']" -attributeName 'value' -value $AxDeployExtUser
        Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.SqlPwd']" -attributeName 'value' -value $AxDeployExtUserPassword
        Write-Log ("Done saving extensions user info in web.config.")
        
        # Set flag in registry to indicate database credentials have been stored in web.config
        Set-UseDatabaseCredentialInWebConfigForUpgrade
    }
    else
    {
        $retailChannelDBConnectionString = ('Server="{0}";Database="{1}";Integrated Security=True;Persist Security Info=False;Pooling=True;Encrypt={2};TrustServerCertificate={3};' `
            -f $dbServer,$dbName, $encryption, $disableDBServerCertificateValidation)
    }

    $nodeconnectionStrings = $webConfigContent.SelectSingleNode("//connectionStrings")

    if (!$nodeconnectionStrings)
    {
        $nodeconnectionStrings = $webConfigContent.CreateElement('connectionStrings')
        $webConfigContent.SelectSingleNode("//configuration").AppendChild($nodeconnectionStrings) | Out-Null
    }
    else
    {
        $nodeconnectionStrings.RemoveAll()
    }

    $nodeStorageLookupDatabase = $webConfigContent.CreateElement('add')
    $nodeStorageLookupDatabase.SetAttribute('name', 'StorageLookupDatabase')
    $nodeStorageLookupDatabase.SetAttribute('connectionString', $retailChannelDBConnectionString)

    $nodeRetailHoustonStore = $webConfigContent.CreateElement('add')
    $nodeRetailHoustonStore.SetAttribute('name', $retailChannelStoreName) 
    $nodeRetailHoustonStore.SetAttribute('connectionString', $retailChannelDBConnectionString)

    $nodeconnectionStrings.AppendChild($nodeStorageLookupDatabase) | Out-Null
    $nodeconnectionStrings.AppendChild($nodeRetailHoustonStore) | Out-Null
    
    # Update MachineKey
    $validationKey = Gen-Key -EncryptionCertThumbPrint $retailCryptographyThumbprint -KeyGenerationCertThumbPrint $retailCryptographyThumbprint
    $decryptionKey = Gen-Key -EncryptionCertThumbPrint $retailCryptographyThumbprint -KeyGenerationCertThumbPrint $rtsAuthCertificateThumbprint

    $machineKeySetting = $webConfigContent.SelectSingleNode("//configuration/system.web/machineKey")

    if ($machineKeySetting -eq $null)
    {
        $machineKeyElement = $webConfigContent.CreateElement('machineKey')
        $machineKeyElement.SetAttribute("validationKey", $validationKey)
        $machineKeyElement.SetAttribute("decryptionKey", $decryptionKey)
        $machineKeyElement.SetAttribute("validation", $validationMethod)
        $machineKeyElement.SetAttribute("decryption", $decryptionMethod)
        $webConfigContent.configuration['system.web'].AppendChild($machineKeyElement)
    }
    else
    {
        Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/system.web/machineKey/@validationKey' -value $validationKey
        Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/system.web/machineKey/@decryptionKey' -value $decryptionKey
        Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/system.web/machineKey/@validation' -value $validationMethod
        Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/system.web/machineKey/@decryption' -value $decryptionMethod
    }

    # Update AppSettings
    $AADStsHost = 'windows.net'
    $deviceActivationAllowedIdentityProviders = 'https://sts.windows.net'
    if ($AdminPrincipalName.ToLower().EndsWith('.ccsctp.net') -or ($AADTokenIssuerPrefix.IndexOf('windows-ppe.net') -gt 0)) 
    { 
        $AADStsHost = 'windows-ppe.net'
        
        # For test environments allowing both AAD PPE and the Commerce identity provider for device activation.
        $deviceActivationAllowedIdentityProviders = 'https://sts.windows.net, https://commerce.dynamics.com/auth'
    }

    if ($AuthenticationType -eq "AdfsServiceToServiceClientSecretAuthentication")
    {
        $newAllowedIdentityProvider = $serviceUri -replace "/commerce", "/auth"
        $deviceActivationAllowedIdentityProviders = -join($deviceActivationAllowedIdentityProviders, ', ', $newAllowedIdentityProvider)
		Log-TimedMessage ('ADFS detected, the new allowed identity provider has been changed from: "{0}" to "{1}".' -f $serviceUri, $newAllowedIdentityProvider)
    }

    $fedMetadataAddressValue = "https://login.{0}/common/FederationMetadata/2007-06/FederationMetadata.xml" -f $AADStsHost
    Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='FederationMetadataAddress']" -attributeName 'value' -value $fedMetadataAddressValue

    $aadTokenIssuerPrefixValue = "https://sts.$AADStsHost/"
    Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='AADTokenIssuerPrefix']" -attributeName 'value' -value $aadTokenIssuerPrefixValue
    Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='IsAnonymousEnabled']" -attributeName 'value' -value $IsAnonymousAccessEnabled
    
    $AllowedOriginsString = ''
    if ($retailCloudPOSUrl)
    {
        $retailCloudPOSUrl = $retailCloudPOSUrl.trimEnd('/')
        $AllowedOriginsString = $AllowedOriginsString +  $retailCloudPOSUrl
    }
    if ($retailStorefrontUrl)
    {
        $retailStorefrontUrl = $retailStorefrontUrl.trimEnd('/')
        $AllowedOriginsString = $AllowedOriginsString +  (';{0}' -f $retailStorefrontUrl)
    }
    if ($AllowedOriginsString)
    {
        Update-XmlObjAttributeValue -xml $webConfigContent -xpath "//configuration/appSettings/add[@key='AllowedOrigins']" -attributeName 'value' -value $AllowedOriginsString
    }

    Update-XmlObjValue -xml $webConfigContent -xpath '//configuration/retailServer/deviceActivation/@allowedIdentityProviders' -value $deviceActivationAllowedIdentityProviders

    Set-ItemProperty $webConfigPath -name IsReadOnly -value $false
    $webConfigContent.Save($webConfigPath)
}

function Update-CommerceRuntimeConfig(
    [string]$retailServerWebsiteRoot = $(throw 'retailServerWebsiteRoot is required.'),
    [string]$rtsAuthCertificateThumbprint = $(throw 'rtsAuthCertificateThumbprint is required.'),
    [string]$azureAuthority,
    [string]$aosUrl,
    [string]$aosSoapUrl,
    [string]$aosWebsiteName,
    [string]$userId
)
{
    $crtConfigFilePath = Join-Path -Path $retailServerWebsiteRoot -ChildPath (Join-Path -Path 'bin' -ChildPath 'commerceRuntime.config')
    $commerceRuntimeContent = [xml](Get-Content -Path $crtConfigFilePath)

    Update-XmlObjValue -xml $commerceRuntimeContent -xpath '//commerceRuntime/realtimeService/certificate/@thumbprint' -value $rtsAuthCertificateThumbprint

    if ($azureAuthority)
    {
        Update-XmlObjAttributeValue -xml $commerceRuntimeContent -xpath "//commerceRuntime/realtimeService/settings/add[@key='azureAuthority']" -attributeName 'value' -value $azureAuthority
    }

    $rtsServiceEndPoint = Get-RTSServiceEndpoint -aosUrl $aosUrl -aosSoapUrl $aosSoapUrl

    if ($rtsServiceEndPoint)
    {
        Update-XmlObjAttributeValue -xml $commerceRuntimeContent -xpath "//commerceRuntime/realtimeService/settings/add[@key='serviceHostUrl']" -attributeName 'value' -value $rtsServiceEndPoint
    }
    
    if ($aosUrl)
    {
        Update-XmlObjAttributeValue -xml $commerceRuntimeContent -xpath "//commerceRuntime/realtimeService/settings/add[@key='azureResource']" -attributeName 'value' -value $aosUrl
    }

    if ($userId)
    {
        Update-XmlObjAttributeValue -xml $commerceRuntimeContent -xpath "//commerceRuntime/realtimeService/settings/add[@key='userId']" -attributeName 'value' -value $userId
    }
    
    if (![String]::IsNullOrWhiteSpace($aosWebsiteName))
    {
        $aosWebConfigFilePath = Get-WebConfigFilePath -websiteName $aosWebsiteName
        if (Test-Path -Path $aosWebConfigFilePath)
        {
            $aosWebConfigContent = [xml](Get-Content -Path $aosWebConfigFilePath)
            
            $aadRealm = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Aad.Realm'
            $identityProvider = Get-WebConfigAppSetting -WebConfig $aosWebConfigContent -SettingName 'Provisioning.AdminIdentityProvider'
            
            Update-XmlObjAttributeValue -xml $commerceRuntimeContent -xpath "//commerceRuntime/realtimeService/settings/add[@key='audienceUrn']" -attributeName 'value' -value $aadRealm
            Update-XmlObjAttributeValue -xml $commerceRuntimeContent -xpath "//commerceRuntime/realtimeService/settings/add[@key='identityProvider']" -attributeName 'value' -value $identityProvider
        }
        else
        {
            throw "cannot find web.config with path $aosWebConfigFilePath"
        }
    }

    Set-ItemProperty $crtConfigFilePath -name IsReadOnly -value $false
    $commerceRuntimeContent.Save($crtConfigFilePath)
}

try
{    
    $parentdir = Split-Path -parent $PSCommandPath
    $grandparentdir = Split-Path -parent $parentdir

    if (!$commonConfigurationPath)
    {
        $commonConfigurationPath = "$grandparentdir\Scripts\Common-Configuration.ps1"
    } 

    . $commonConfigurationPath
    Import-Module WebAdministration

    $defaultSite = Get-WebSite -Name $retailWebSiteName
    if ($defaultSite -eq $null)
    {
        throw "Cannot find website $retailWebSiteName. Please check the deployment logs."
    }
    $rsWebConfigPath = Get-WebConfigFilePath -websiteName $retailWebSiteName
    if (!$rsWebPath)
    {
        $rsWebPath = Split-Path $rsWebConfigPath -Parent
    }

    $overrideConnectionString = 'true'
    $settingIsAnonymousEnabled = 'false'
    if ($AllowAnonymousContextRetailServerRequests -eq 'true')
    {
        $settingIsAnonymousEnabled = 'true'
    }

    Update-RetailServerWebConfig -retailServerWebsiteRoot $rsWebPath `
                                 -clientAppInsightsKey $ClientAppInsightsInstrumentationKey `
                                 -hwsAppInsightsKey $HardwareStationAppInsightsInstrumentationKey `
                                 -winPhonePosAppInsightsKey $WindowsPhonePosAppInsightsInstrumentationKey `
                                 -environmentId $EnvironmentId `
                                 -tenantId $TenantId `
                                 -retailCryptographyThumbprint $RetailCryptographyThumbprint `
                                 -overrideConnectionString $overrideConnectionString `
                                 -disableDBServerCertificateValidation $DisableDBServerCertificateValidation `
                                 -dbUser $dbUser `
                                 -dbPassword $dbPassword `
                                 -AxDbDeploySqlUser $AxDbDeploySqlUser `
                                 -AxDbDeploySqlPwd $AxDbDeploySqlPwd `
                                 -AxDeployExtUser $AxDeployExtUser `
                                 -AxDeployExtUserPassword $AxDeployExtUserPassword `
                                 -dbServer $dbServer `
                                 -dbName $dbName `
                                 -encryption $Encryption `
                                 -retailChannelStoreName $RetailChannelStoreName `
                                 -rtsAuthCertificateThumbprint $RetailRTSAuthenticationCertificateThumbprint `
                                 -validationKey $validationKey `
                                 -decryptionKey $decryptionKey `
                                 -validationMethod $validationMethod `
                                 -decryptionMethod $decryptionMethod `
                                 -AdminPrincipalName $AdminPrincipalName `
                                 -AADTokenIssuerPrefix $AADTokenIssuerPrefix `
                                 -IsAnonymousAccessEnabled $settingIsAnonymousEnabled `
                                 -retailCloudPOSUrl $retailCloudPOSUrl `
                                 -retailStorefrontUrl $retailStorefrontUrl

    # If not test environment then remove the non Production files.
    if (-not ($AdminPrincipalName.ToLower().EndsWith('.ccsctp.net'))) 
    {
        Remove-NonProductionReleaseFiles -TargetFolder (Join-Path $rsWebPath 'bin')
    }

    # Configure Retail Server authentication keys
    Write-Log "Configuring Retail Server authentication keys"
    $global:LASTEXITCODE = 0
    & "$PSScriptRoot\UpdateRetailServerAuthenticationKeys.ps1"  -CertificateThumbprint $RetailRTSAuthenticationCertificateThumbprint `
                                                                -RetailServerDeploymentPath $rsWebPath `
                                                                -RetailServerUrl $serviceUri
    $capturedExitCode = $global:LASTEXITCODE

    if($capturedExitCode -eq 0)
    {
        Write-Log "Finished configuring Retail Server authentication keys."
    }
    else
    {
        throw ("Configuring Retail Server authentication keys failed with exit code {0}" -f $capturedExitCode)
    }

    # update commerceRuntime.config
    Update-CommerceRuntimeConfig -retailServerWebsiteRoot $rsWebPath `
                                 -rtsAuthCertificateThumbprint $RetailRTSAuthenticationCertificateThumbprint `
                                 -azureAuthority $azureAuthority `
                                 -aosUrl $AosUrl `
                                 -aosSoapUrl $AosSoapUrl `
                                 -aosWebsiteName $AosWebsiteName `
                                 -userId $userId

    # Register retail performance counter
    Write-Log "Registering retail performance counter"
    $perfCountersLogFile = [System.IO.Path]::GetTempFileName()
    $global:LASTEXITCODE = 0
    & $registerPerfCountersScriptPath -InstrumentedAssemblyPath $InstrumentedAssemblyPath -log $perfCountersLogFile
    $capturedExitCode = $global:LASTEXITCODE

    $perfCountersScriptOutput = (Get-Content -Path $perfCountersLogFile) -join [Environment]::NewLine
    Write-Log 'Perf counters script output:'
    Write-Log $perfCountersScriptOutput

    if($capturedExitCode -eq 0)
    {
        Write-Log "Registering retail performance counter completed successfully."
    }
    else
    {
        throw "Registering retail performance counter failed with exit code $capturedExitCode"
    }

    Write-Log "Encrypting retail web.config"
    $connectionStringSectionName = "connectionStrings"
    $targetWebApplicationPath = "/"
    $global:LASTEXITCODE = 0

    if($encryptConnectionStrings -eq 'true')
    {
        $output = aspnet_regiis -pe $connectionStringSectionName -app $targetWebApplicationPath -Site $defaultSite.id
        Write-Log $output
    }
    
    Write-Log "Trying to check deploymentType."
    Write-Log "Deployment type is $deploymentType."
    if($deploymentType -eq 'Cloud')
    {
        if(![String]::IsNullOrWhiteSpace($AosWebsiteName))
        {
            $aosSite = Get-WebSite -Name $AosWebsiteName
            if($aosSite -ne $null)
            {
                # encrypt retail server web.config with Microsoft.Dynamics.AX.Framework.ConfigEncryptor.exe
                Encrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $rsWebConfigPath
            }
            else
            {
                throw "Cannot find aos website with name $AosWebsiteName for cloud deployment."
            }
        }
        else
        {
            throw "Cannot find AosWebsiteName from the configuration file."
        }
    }

    $capturedExitCode = $global:LASTEXITCODE

    if($capturedExitCode -eq 0)
    {
        Write-Log "web.config encryption completed successfully."
    }
    else
    {
        throw "web.config encryption failed with connectionString encryption exit code: $capturedExitCode"
    }
}
catch
{
    Write-Log ($global:error[0] | Format-List * -f | Out-String)   
    $exitCode = 2
    Write-Log ("Error executing the script. Exiting with error code $exitCode." -f [System.Environment]::NewLine)
    exit $exitCode
}

# SIG # Begin signature block
# MIIkDAYJKoZIhvcNAQcCoIIj/TCCI/kCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDUxVPW/cXRrQna
# ttMO7AV6E9Eo9kDKrE+DD1p/z/jmWaCCDYEwggX/MIID56ADAgECAhMzAAABh3IX
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
# RcBCyZt2WwqASGv9eZ/BvW1taslScxMNelDNMYIV4TCCFd0CAQEwgZUwfjELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9z
# b2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAxMQITMwAAAYdyF3IVWUDHCQAAAAABhzAN
# BglghkgBZQMEAgEFAKCCAScwGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYK
# KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIAYlsgQn
# Ah8fLYXpmTcC8lbkTUnJGf4Vyv8mHrDzMuniMIG6BgorBgEEAYI3AgEMMYGrMIGo
# oIGJgIGGAFMAaQBtAHAAbABpAGYAeQBDAG8AbQBtAGUAcgBjAGUALgBNAGkAYwBy
# AG8AcwBvAGYAdABEAHkAbgBhAG0AaQBjAHMALgBDAG8AbgBuAGUAYwB0AG8AcgAu
# AFAAbwByAHQAYQBiAGwAZQAuAHIAZQBzAG8AdQByAGMAZQBzAC4AZABsAGyhGoAY
# aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAGk3ZaSD
# Yn7ww9gl568mcNxGxbFZc6diYEHvi5pQMLbUtL9eRuJ49kyRt3SDJQ5qVLnqekGS
# uSz6JB1HSP+mkuisNK6Sst9/md4wlPqjbiiRKzFaY2hBcaPpyQZ5JIN6bJQUR4DI
# 9Xxd6QBsQVuNdL5awYZdhhMl6Q/HFXY4mi8/V7PkGGM2MhK+hJfiIvIoku2BPX8K
# n6SHjOBE10wTDrohv+yKzmnsHKeQGfjBkTAOxdb7lzloG3XHYZV2aobHAXjnUaFd
# OphV6RKti6Ydkyqg5MNkLfH7cDaCu8c4ge7H2HAGJ9bWtZ2SDquwf/Y8+U5ENKLV
# dklOUFnuNUMtxiehghLxMIIS7QYKKwYBBAGCNwMDATGCEt0wghLZBgkqhkiG9w0B
# BwKgghLKMIISxgIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBVQYLKoZIhvcNAQkQAQSg
# ggFEBIIBQDCCATwCAQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQgG7Qx
# 1QDl3CxjJpg0fEgVZuJ9q8URXu3IqFDBXiJ0WcMCBl878Q2+vRgTMjAyMDA4MjMw
# NDAzNDUuMDE0WjAEgAIB9KCB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
# Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
# dCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVl
# cnRvIFJpY28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkM0QkQtRTM3Ri01RkZD
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIORDCCBPUw
# ggPdoAMCAQICEzMAAAEjOLDkrdhakJ0AAAAAASMwDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMjE5MDExNDU2WhcNMjEw
# MzE3MDExNDU2WjCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
# EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
# bjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28xJjAk
# BgNVBAsTHVRoYWxlcyBUU1MgRVNOOkM0QkQtRTM3Ri01RkZDMSUwIwYDVQQDExxN
# aWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOC
# AQ8AMIIBCgKCAQEAnbzQybBkpdwBLvHZm8DhM44LPD7rdez1QsZa11kM3dWX5oZA
# SwzASsiSDNCLR9M7Sw4P03eE7UdpNYehLzQ39BvqgtHZYJmS/9UzhYWdOE6/fIDn
# NK36+4o3CuMQcULSOUwMImppTtK3pYluX+QA/myAzSq2kQRCHG1Vp/wihXmWry+A
# wk2vfQ7iuotgSL9hlZBljBAcCJUy6cJikmJxyc041FF2DYPdPK7bZ4QnA9A/oOR4
# SKgzL16EyYGuSMANU6BBX5PiaKv6EAl4g3KymzrCBE7mqO5Xn6O9zM1BrVabuPGy
# oG/TgYKUink0e+tdCZn2all2PeuPEW5lsqN3cQIDAQABo4IBGzCCARcwHQYDVR0O
# BBYEFIHUbBSA040b+RHCsGjeGRX4DJ4eMB8GA1UdIwQYMBaAFNVjOlyKMZDzQ3t8
# RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
# LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNy
# bDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9z
# b2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3J0MAwG
# A1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQAD
# ggEBAFvlAbeqV+hbqvVXiVP6Q7wtTMXfZLd9R+Cf9LVBAE/M5Gz/q6OPT3K0dY0N
# 857DCRLJrV/xL174FudeScfmXdHqdLYGRFMA21OZfG8wtMLK95h78lAh+iz5neIn
# RvWocNKcSPpCZ1/UzKas8CTmPGHGGKJeXAgtSO8fnrLussfErTCewfXYQ70yeRpI
# 1ck0KZKZ+BQSQM3O7ncLf2Xpc1EA9q7Pb9ayUhRlxfc0MIyC/mFmLaeF330fHJok
# mxyfV/yFlcD75/Uc1urxt2SHc5iBGc2vtB2c74a6+27d3Iaph1AwwY+cC3gvsTD3
# KSPLRSjPrj+vRJtAhFi3Ll4z0zcwggZxMIIEWaADAgECAgphCYEqAAAAAAACMA0G
# CSqGSIb3DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
# bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
# aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3Jp
# dHkgMjAxMDAeFw0xMDA3MDEyMTM2NTVaFw0yNTA3MDEyMTQ2NTVaMHwxCzAJBgNV
# BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
# HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
# dCBUaW1lLVN0YW1wIFBDQSAyMDEwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
# CgKCAQEAqR0NvHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvtfGhLLF/Fw+Vhwna3
# PmYrW/AVUycEMR9BGxqVHc4JE458YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs1nMw
# VyaCo0UN0Or1R4HNvyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLBxKZd0WETbijG
# GvmGgLvfYfxGwScdJGcSchohiq9LZIlQYrFd/XcfPfBXday9ikJNQFHRD5wGPmd/
# 9WbAA5ZEfu/QS/1u5ZrKsajyeioKMfDaTgaRtogINeh4HLDpmc085y9Euqf03GS9
# pAHBIAmTeM38vMDJRF1eFpwBBU8iTQIDAQABo4IB5jCCAeIwEAYJKwYBBAGCNxUB
# BAMCAQAwHQYDVR0OBBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQBgjcU
# AgQMHgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8G
# A1UdIwQYMBaAFNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJoEeG
# RWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jv
# b0NlckF1dF8yMDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUH
# MAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljUm9vQ2Vy
# QXV0XzIwMTAtMDYtMjMuY3J0MIGgBgNVHSABAf8EgZUwgZIwgY8GCSsGAQQBgjcu
# AzCBgTA9BggrBgEFBQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL1BLSS9k
# b2NzL0NQUy9kZWZhdWx0Lmh0bTBABggrBgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwA
# XwBQAG8AbABpAGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkqhkiG9w0B
# AQsFAAOCAgEAB+aIUQ3ixuCYP4FxAz2do6Ehb7Prpsz1Mb7PBeKp/vpXbRkws8LF
# Zslq3/Xn8Hi9x6ieJeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/XPle
# FzWYJFZLdO9CEMivv3/Gf/I3fVo/HPKZeUqRUgCvOA8X9S95gWXZqbVr5MfO9sp6
# AG9LMEQkIjzP7QOllo9ZKby2/QThcJ8ySif9Va8v/rbljjO7Yl+a21dA6fHOmWaQ
# jP9qYn/dxUoLkSbiOewZSnFjnXshbcOco6I8+n99lmqQeKZt0uGc+R38ONiU9Mal
# CpaGpL2eGq4EQoO4tYCbIjggtSXlZOz39L9+Y1klD3ouOVd2onGqBooPiRa6YacR
# y5rYDkeagMXQzafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA3+cxB6STOvdlR3jo
# +KhIq/fecn5ha293qYHLpwmsObvsxsvYgrRyzR30uIUBHoD7G4kqVDmyW9rIDVWZ
# eodzOwjmmC3qjeAzLhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8ZQU3ghvkqmqMR
# ZjDTu3QyS99je/WZii8bxyGvWbWu3EQ8l1Bx16HSxVXjad5XwdHeMMD9zOZN+w2/
# XU/pnR4ZOC+8z1gFLu8NoFA12u8JJxzVs341Hgi62jbb01+P3nSISRKhggLSMIIC
# OwIBATCB/KGB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
# b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
# dGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28x
# JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkM0QkQtRTM3Ri01RkZDMSUwIwYDVQQD
# ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQC6
# F2aN4OKeF8LuDDUoEJ4z+/tXgaCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
# IFBDQSAyMDEwMA0GCSqGSIb3DQEBBQUAAgUA4uxeNTAiGA8yMDIwMDgyMzA3MTcw
# OVoYDzIwMjAwODI0MDcxNzA5WjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi7F41
# AgEAMAoCAQACAiA6AgH/MAcCAQACAhGUMAoCBQDi7a+1AgEAMDYGCisGAQQBhFkK
# BAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJ
# KoZIhvcNAQEFBQADgYEAdvms0nDsKqT3sh9ER9ymPs5fxu9NNlWQngo5jSB6MhyU
# Grq6A3owZdS1TQQPX7E2oQvx2R1p8FGxj+QF4/FR6kamDU/40j+ZnLOj9DJ0tFem
# QPiyjSuFx3eQvk8nnfyn7NVWqngKnLWs34DfT4RPgz7vb1j6T1sT/PVbndU2NScx
# ggMNMIIDCQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
# bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
# aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAA
# ASM4sOSt2FqQnQAAAAABIzANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkD
# MQ0GCyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCAHPRcLxOjWXfulrh1c2/iP
# 2TkD46XFzh/dEN4B2w123TCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0EIBGa
# M4M/+0TMxA2jo6zEpAAMvynAomQzlidcqur7FYGzMIGYMIGApH4wfDELMAkGA1UE
# BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
# BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
# IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEjOLDkrdhakJ0AAAAAASMwIgQg/mZ7
# VjnMP5abTl6e5Li5eRtBV/k3568fnNcCefnOf0AwDQYJKoZIhvcNAQELBQAEggEA
# A251KH7jsTNkPORU4Phb/gABrHEca4GhK3Bg3x1LdJWrAVjwGOVN9I3I2Yx4e7CU
# QDe7orXNcB0ugf2G3kpqCQ8ltHHIBD2H12cujOc8FwG4sRXlhyzsBVLycTpcUY10
# aiHx7FfjfkjlW7XmJrH5fuhlzTqqe8hwOZyaaMwdnFxw5N1PJtj5B2cQ9oyRhFfh
# EB77h/gCRI9iTls7QgRgQjwTEQoQ/0hXBKKMyy/Dtg8M5v5p+fG4HnYq6K5etuux
# DY3L277rtXSLwMHZreYkIq7R14YDvtoh8TTRU3r2MWv8St8wZaphWzyf0c5FiAoz
# aX4TvGWVkaD/6Fnz83KcAg==
# SIG # End signature block
