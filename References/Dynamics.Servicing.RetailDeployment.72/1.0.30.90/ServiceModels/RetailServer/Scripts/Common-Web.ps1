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
. $ScriptDir\Common-Configuration.ps1

function Check-CurrentUserIsAdmin {  
    $identity = [System.Security.Principal.WindowsIdentity]::GetCurrent()  
    $principal = new-object System.Security.Principal.WindowsPrincipal($identity)  
    $admin = [System.Security.Principal.WindowsBuiltInRole]::Administrator  
    $principal.IsInRole($admin)  
} 

# For non-SSL bindings, New-WebBinding incorrectly adds *: prefix to binding information.
# More info: http://stackoverflow.com/questions/9424362/why-powershells-new-webbinding-commandlet-creates-incorrect-hostheader
function New-WebBindingSafe(
    $Name,
    $Protocol,
    $Port
) {
    if($Protocol -eq "net.tcp")
    {
        New-ItemProperty -Path "IIS:\sites\$Name" -Name Bindings -value @{protocol="net.tcp"; bindingInformation=""+$port+":*"}
    }
    else
    {
        New-WebBinding -Name $Name -Protocol $Protocol -Port $Port
    }
}

# In Windows Server 2008 Get-WebBinding throws an exception in case if no bindings exist yet.
function Get-WebBindingSafe(
    $Name,
    $Protocol,
    $Port
)
{
    [hashtable]$getWebBindingParameters = @{}
    if($Name)
    {
        $getWebBindingParameters['Name'] = $Name
    }

    if($Protocol)
    {
        $getWebBindingParameters['Protocol'] = $Protocol
    }

    if($Port)
    {
        $getWebBindingParameters['Port'] = $Port
    }

    try
    {
        if ($Protocol -eq "net.tcp")
        {
            # See comment on New-WebBindingSafe
            $bindings = Get-ItemProperty -Path "IIS:\sites\$Name" -Name Bindings
            foreach ($binding in $bindings.Collection) {
              if ($binding.protocol -eq "net.tcp" -and -not $binding.bindingInformation.StartsWith("*")) {
                return $binding;
              }
            }
        }
        else
        {
            $result = Get-WebBinding @getWebBindingParameters
        }
    }
    catch{}

    return $result
}

function Test-IfWebAppPoolExists(
    [string]$Name = $(Throw 'Name parameter required'))
{
    $exists = $false
    try { $exists = Get-WebAppPoolState -Name $AppPoolName } catch{}
    return $exists
}

# Adds binding to website if it doesn't exist yet.
function Add-WebSiteBinding(
    [string]$Name = $(Throw 'Name parameter required'),
    
    [ValidateSet("http","https","net.tcp")]
    [string]$Protocol = $(Throw 'Protocol parameter required'),
    
    [ValidateRange(1,65535)]
    [UInt32]$Port = $(Throw 'Port parameter required'))
{
    Log-ActionItem "Checking if a(n) $Protocol binding using port $Port exists for web site $Name"
    if(-not (Get-WebBindingSafe -Name $Name -Protocol $Protocol -Port $Port))
    {
        Log-ActionResult "No"
        
        Log-ActionItem "Checking if another protocol using port $Port exists for web site $Name"
        if(Get-WebBindingSafe -Name $Name -Port $Port)
        {
            Log-ActionResult "Yes"

            Log-ActionItem "Removing other protocol bindings that use port $Port, to prevent conflicts"
            Remove-WebBinding -Name $Name -Port $Port
            Log-ActionResult "Update complete"
        }
        else
        {
            Log-ActionResult "No"
        }

        Log-ActionItem "Checking if a(n) $Protocol binding exists for web site $Name"
        if(Get-WebBindingSafe -Name $Name -Protocol $Protocol)
        {
            Log-ActionResult "Yes"

            Log-ActionItem "Updating existing $Protocol binding to use port $Port"
            Update-WebBinding -websitename $Name -Protocol $Protocol -PropertyName 'Port' -Value $Port
            Log-ActionResult "Update complete"
        }
        else
        {
            Log-ActionResult "No"
        }
    }
    else
    {
        Log-ActionResult "Yes"
    }

    Log-ActionItem "Checking again if a(n) $Protocol binding using port $Port exists for web site $Name"
    if(-not (Get-WebBindingSafe -Name $Name -Protocol $Protocol -Port $Port))
    {
        Log-ActionResult "No"
        Log-ActionItem "Adding new binding"

        New-WebBindingSafe -Name $Name -Protocol $Protocol -Port $Port
    }
    else
    {
        Log-ActionResult "Yes"
        Log-ActionItem "No further action necessary"
    }

    Log-ActionResult "Complete"
}

function Test-IfWebSiteUsesHttp(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    return (-not ([string]::IsNullOrEmpty($WebSiteConfig.Port)))
}

function Test-IfWebSiteUsesTcp(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    return (-not ([string]::IsNullOrEmpty($WebSiteConfig.PortTcp)))
}

function Test-IfWebSiteUsesSSL(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    return (-not ([string]::IsNullOrEmpty($WebSiteConfig.PortSSL)))
}

###############################
# Function to Add SSL binding #
###############################
function Add-SslBinding(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    Validate-IfWebAdministrationInstalled $true
    
    Log-ActionItem "Check if SSL binding required"
    if(Test-IfWebSiteUsesSSL $WebSiteConfig)
    {
        Log-ActionResult "Yes. Adding SSL binding"
    }
    else
    {
        Log-ActionResult "No. Exiting"
        return
    }

    $HttpsPort = $WebSiteConfig.PortSSL; Validate-NotNull $HttpsPort "HttpsPort"
    $CertRootStore = $WebSiteConfig.ServerCertificateRootStore; Validate-NotNull $CertRootStore "CertRootStore"
    $CertStore = $WebSiteConfig.ServerCertificateStore; Validate-NotNull $CertStore "CertStore"
    $CertThumbprint = $WebSiteConfig.ServerCertificateThumbprint; Validate-NotNull $CertThumbprint "CertThumbprint"
    $CertThumbprint = $CertThumbprint.ToString().ToUpper();
    $SSLCertificatePath = "{0}\{1}\{2}" -f $CertRootStore, $CertStore, $CertThumbprint

    Log-Step "Updating SSL binding for https port [$HttpsPort] and Certificate [$SSLCertificatePath]"
    Log-ActionItem "Check if binding configuration for port [$HttpsPort] already exists"
    $bindingPath = "IIS:\SslBindings\0.0.0.0!$HttpsPort" 
    if (Test-Path $bindingPath)
    {
        Log-ActionResult "Yes"
        $bindingThumbprint = (Get-Item $bindingPath).Thumbprint
        if($CertThumbprint -ne $bindingThumbprint)
        {
            Log-ActionItem "Existing [$bindingPath] thumbprint [$bindingThumbprint] is different from passed certificate thumbprint [$CertThumbprint]. Removing binding."
            Remove-Item $bindingPath -Force
        }
    }
    else
    {
        Log-ActionResult "No"
    }
    
    if(-not (Test-Path $bindingPath))
    {
        Log-ActionItem "Configuring the server certificate for SSL."
        Get-Item cert:\$SSLCertificatePath | New-Item $bindingPath -Force
    }
    
    $UserName = $WebSiteConfig.WebAppPool.ProcessModel_UserName; Validate-NotNull $UserName "WebAppPoolUserName"
    GrantPermission-UserToSSLCert -certThumbprint $CertThumbprint -certRootStore $CertRootStore -certStore $CertStore -appPoolUserName $UserName
    Log-ActionResult "Complete"
}

function GrantPermission-UserToSSLCert(
    $certThumbprint = $(Throw 'certThumbprint parameter required'),
    $certRootStore = $(Throw 'certRootStore parameter required'),
    $certStore = $(Throw 'certStore parameter required'),
    $appPoolUserName = $(Throw 'appPoolUserName parameter required')
)
{
    Log-ActionItem "Granting read permissions for certificate with thumbprint $certThumbprint to user $appPoolUserName ..."
    $certPath = "cert:\{0}\{1}" -f $certRootStore, $certStore
    $keyname = (((gci $certPath | ? {$_.thumbprint -like $certThumbprint}).PrivateKey).CspKeyContainerInfo).UniqueKeyContainerName
    $keyPath = Join-Path -Path ${env:ProgramData} -ChildPath "\Microsoft\Crypto\RSA\MachineKeys"
    $fullpath = Join-Path -Path $keypath -ChildPath $keyname
    icacls $fullpath /grant $appPoolUserName`:RX
    Log-ActionResult "Complete"
}

function Get-ProtocolsToEnable(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'),

    [string]$existingProtocolsToUpdate)
{
    $protocolTable = [HashTable] @{};    
    if(Test-IfWebSiteUsesHttp $WebSiteConfig)
    {
        $protocolTable["http"] = 1
    }

    if(Test-IfWebSiteUsesSSL $WebSiteConfig)
    {
        $protocolTable["https"] = 1
    }

    if(Test-IfWebSiteUsesTcp $WebSiteConfig)
    {
        $protocolTable["net.tcp"] = 1
    }
    
     
    if(-not ([string]::IsNullOrEmpty($existingProtocolsToUpdate)))
    {
        $existingProtocolsToUpdate.Split(",") | % { $protocolTable[$_] = 1 } | Out-Null
    }

    return ($protocolTable.Keys -join ",")
}

function Test-IfPathsEqual(
    [string]$firstPath = $(Throw 'firstPath parameter required'),

    [string]$secondPath = $(Throw 'secondPath parameter required'))
{
    $directorySeparator = [IO.Path]::DirectorySeparatorChar
    [Environment]::ExpandEnvironmentVariables($firstPath).TrimEnd($directorySeparator) -eq [Environment]::ExpandEnvironmentVariables($secondPath).TrimEnd($directorySeparator)
}

#####################################
# Web Site Management prerequisites #
#####################################
function Validate-IfCurrentUserIsAdmin
{
    Log-ActionItem "Check if this is run under admin privilege"
    $IsAdmin = Check-CurrentUserIsAdmin
    if ($IsAdmin)
    {
        Log-ActionResult "Yes"
    }
    else
    {
        Log-ActionResult "No"
        Throw-Error "The install script must be run with Administrator privilege."
    }
}

function Validate-IfWebAdministrationInstalled(
    [bool]$InstallDependencies = $(Throw 'InstallDependencies parameter required'))
{
    try
    {
        Log-ActionItem "Check if WebAdministration module is available"
        $webadminModule = Get-Module -Name WebAdministration -ListAvailable
        if ($webadminModule)
        {
            Log-ActionResult "Yes"
            Log-ActionItem "Import web admin module"
            Import-Module WebAdministration
        }
        else
        {
            Log-ActionItem "Try add snapin for older version of Windows"
            # Check if Snap-in is already loaded before loading.
            if ( (Get-PSSnapin -Name WebAdministration -ErrorAction SilentlyContinue) -eq $null )
            {
                Add-PSSnapin -Name WebAdministration
            }
            Log-ActionResult "WebAdministration snapin added"
        }
        Log-ActionResult "Complete"
    }
    catch
    {
        Throw-Error "Unable to import web administration module or snapin. Please install the IIS web administration module or snapin for PowerShell"
    }
}

function Validate-WebManagementPrerequisites(
    [bool]$InstallDependencies = $true)
{
    try
    {
        Log-Step "Check IIS management prerequisites"
        Validate-IfCurrentUserIsAdmin
        Validate-IfWebAdministrationInstalled $InstallDependencies
    }
    catch
    {
        Log-Exception $_
        Throw-Error "IIS management prerequisites validation failed."
    }
}

##########################
# Web Site Setup Helpers #
##########################
function CreateAndConfigure-ApplicationPool(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'),

    [System.Management.Automation.PSCredential[]]$Credentials = $(Throw 'Credentials parameter required'))
{
    $UserName = $WebSiteConfig.WebAppPool.ProcessModel_UserName; Validate-NotNull $UserName "WebAppPoolUserName"
    $AppPoolName = $WebSiteConfig.WebAppPool.Name; Validate-NotNull $AppPoolName "WebAppPoolName"
    $appPoolPath = "IIS:\AppPools\$AppPoolName"
    $Enable32BitApp = $WebSiteConfig.WebAppPool.Enable32BitAppOnWin64;
    try
    {
        Log-Step "Create and configure Application Pool [$AppPoolName]"
        # Create application pool if not already exists
        Log-ActionItem "Check if application pool [$AppPoolName] already exists"
        
        $appPoolExists = $false
        $currentAppPoolUserName = $null
    
        if(Test-IfWebAppPoolExists -Name $AppPoolName)
        {
            Log-ActionResult "Yes"
            $appPoolExists = $true
            
            Log-ActionItem "Getting existing user configured for $appPoolPath"
            
            $appPool = Get-Item $appPoolPath
            $currentAppPoolUserName = $appPool.processModel.identityType.ToString()
            
            if ($currentAppPoolUserName -eq "SpecificUser")
            {
                $currentAppPoolUserName = $appPool.processModel.userName
            }
            
            Log-ActionResult "user is [$currentAppPoolUserName]"
        }
        else
        {
            Log-ActionResult "No"
            
            Log-ActionItem "Create application pool [$AppPoolName]"
            New-WebAppPool $AppPoolName
            Log-ActionResult "Complete"
        }
        
        # Config application pool
        # Always reconfigure user in case of password change (when password provided)
        Log-ActionItem "Looking up credential for user with name [$UserName]"
        $foundCredential = $null
        $skipAppPoolUserConfiguration = $false
        for($i = 0; $i -le $Credentials.length - 1; $i++)
        {
            if($Credentials[$i].UserName -like $UserName)
            {
                $foundCredential = $Credentials[$i]
                break
            }
        }
        
        if($foundCredential -eq $null)
        {
            Log-ActionResult "credentials not provided for user $UserName"
        
            if (-not $appPoolExists)
            {
                Throw-Error "Credential for user with name [$UserName] was not received. The web site does not exist and needs to be configured for user $UserName but no password was provided. Please retry by providing a password for the user."
            }
            
            $currentAppPoolUserNameNormalized = Convert-UserNameToADFormat $currentAppPoolUserName
            $userNameNormalized = Convert-UserNameToADFormat $UserName
            
            if ($currentAppPoolUserNameNormalized.ToLower() -ne $userNameNormalized.ToLower())
            {
                Throw-Error "Credential for user with name [$userNameNormalized] was not received. The web site already exists and is currently configured to run as [$currentAppPoolUserNameNormalized] user. However the installation was requested to change the web site user to [$userNameNormalized]. Please retry providing the password for user [$userNameNormalized]."
            }

            # if we got here that's because website exists and is configured for the same user
            Log-ActionItem "Web site application pool $AppPoolName already exists and is configured to run as user $userNameNormalized (same as requested by this installer). No user changes will occur for this application pool."
            $skipAppPoolUserConfiguration = $true
        }
        else
        {
            Log-ActionResult "Complete"
        }
        
        if (-not $skipAppPoolUserConfiguration)
        {
            Log-ActionItem "Decrypting password for [$UserName]"
            $Password = $foundCredential.GetNetworkCredential().Password
            Log-ActionResult "Complete"
                    
            Log-ActionItem "Config application pool [$AppPoolName] to use custom identity [$Username]"
            Set-ItemProperty -Path $appPoolPath -Name ProcessModel -Value @{IdentityType=3;Username="$UserName";Password="$Password";loadUserProfile="true";setProfileEnvironment="true"} -Force # 3 = Custom
            Log-ActionResult "Complete"
        }

        Log-ActionItem "Config application pool [$AppPoolName] to use .NET 4.0 Runtime"
        Set-ItemProperty -Path $appPoolPath -Name ManagedRuntimeVersion -Value v4.0 -Force
        Log-ActionResult "Complete"

        if($Enable32BitApp -eq $true)
        {
            Log-ActionItem "Config application pool [$AppPoolName] to enable 32bit mode"
            Set-ItemProperty -Path $appPoolPath -Name "enable32BitAppOnWin64" -Value "true" -Force
            Log-ActionResult "Complete"
        }

        # The application pool is not immediately available.  We need to query its state and only if we get a valid state continue and start it
        # We will not infinitely retry to query the state, a minute should be plenty of time. If if fails, we fail the script.
        [Microsoft.IIs.PowerShell.Framework.CodeProperty]$appPoolState = $null
        $loopBeginTime = [Datetime]::Now
        do
        {
            try
            {
                $appPoolState = Get-WebAppPoolState $AppPoolName -ErrorAction SilentlyContinue
            } 
            catch
            {
                if(([Datetime]::Now) -gt ($loopBeginTime + [Timespan]::FromSeconds(60)))
                {
                    Throw-Error "Application pool [$AppPoolName] could not be created and polled in a timely manner."
                }
                Log-ActionItem "Application pool [$AppPoolName] is not ready for use. Sleeping..."
                Start-Sleep -Second 1 
            }
        }
        until($appPoolState -ne $null)
        
        Log-ActionItem "Starting application pool [$AppPoolName]"
        Start-WebAppPool -Name $AppPoolName
        Log-ActionResult "Complete"
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Failed: Create and configure application pool [$AppPoolName]"    
    }
}

function Verify-ApplicationPoolCredentials(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'),

    [System.Management.Automation.PSCredential[]]$Credentials = $(Throw 'Credentials parameter required'))
{
    $UserName = $WebSiteConfig.WebAppPool.ProcessModel_UserName; Validate-NotNull $UserName "WebAppPoolUserName"
    if(-not (Validate-UserIsInCredentialsArray $UserName $Credentials))
    {
        Write-Warning -Message "Credential for user with name [$UserName] was not supplied. Make sure you pass an array with the credential for this user."
        exit ${global:PrerequisiteFailureReturnCode};
    }
    
    return $true
}

function Remove-ApplicationPoolSafe(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    $AppPoolName = $WebSiteConfig.WebAppPool.Name; Validate-NotNull $AppPoolName "WebAppPoolName"
    $WebsiteName = $WebSiteConfig.Name; Validate-NotNull $WebsiteName "WebsiteName"
    try
    {
        Log-Step "Delete application pool [$AppPoolName] if it exists and doesn't contain any applications"

        Log-ActionItem "Check if Application pool [$AppPoolName] exists"
        $appPoolExists = Test-IfWebAppPoolExists -Name $AppPoolName
        if($appPoolExists)
        {
            Log-ActionResult "Yes"
        }
        else
        {
            Log-ActionResult "No. Skip removal"
        }
    
        # Delete non-default AppPool
        if ($appPoolExists -and $AppPoolName.CompareTo("DefaultAppPool"))
        {
            $applicationsWithCurrentPool = (Get-ChildItem "IIS:\Sites\$WebSiteName" -ErrorAction "SilentlyContinue") |
                Where-Object { $_.NodeType -eq "Application" } |
                Where-Object { $_.ApplicationPool -eq $AppPoolName }
            
            if($applicationsWithCurrentPool -eq $null -or $applicationsWithCurrentPool.Count -eq 0)
            {
                # Delete Application Pool
                Log-ActionItem "Delete application pool [$AppPoolName]"
                Remove-WebAppPool $AppPoolName
            }
            else
            {
                Log-ActionItem "Application pool [$AppPoolName] still has applications. Skip removal."
            }
            
            Log-ActionResult "Complete"
        }
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Error : Delete application pool [$AppPoolName]"
    }
}

# Remove extra un-used bindings.
function Remove-UnusedWebsiteBindings(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    Log-Step "Remove unnecessary bindings"
    $websiteName = $WebSiteConfig.Name;
    $webAppProtocolList = @();    
    Get-WebApplication -Site $WebSiteConfig.Name | foreach { $webAppProtocolList += ($_.EnabledProtocols -split ",")}
    Get-Website -Name $WebSiteConfig.Name | foreach { $websiteProtocolList = $_.EnabledProtocols -split ","}
    
    $webAppProtocolList = $webAppProtocolList | sort -unique;
    Log-ActionItem "Checking if website [$websiteName] has any unused bindings"
    
    $bindingsToRemove = Compare-Object $websiteProtocolList $webAppProtocolList -PassThru

    if($bindingsToRemove)
    {
        Log-ActionResult "Yes"
        foreach($protocol in $bindingsToRemove)
        {
            Log-ActionResult "Removing [$protocol] protocol binding."
            $siteProtocolBindings = Get-WebBindingSafe -Name $websiteName -Protocol "$protocol"
            if($siteProtocolBindings)
            {
                $siteProtocolBindings | Remove-WebBinding
            }
        }
        Log-ActionResult "Complete."
        
        $newEnabledProtocols = $webAppProtocolList -join ","
        Set-ItemProperty -Path "IIS:/Sites/$WebsiteName" -Name "enabledProtocols" -Value "$newEnabledProtocols" -Force
    }
    else
    {
        Log-ActionResult "No"
    }
}

function CreateAndConfigure-WebSite(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    $WebsiteName = $WebSiteConfig.Name; Validate-NotNull $WebsiteName "WebsiteName"
    $httpPort = $WebSiteConfig.Port;
    $HttpsPort = $WebSiteConfig.PortSSL;
    $SiteInstallFolder = $WebSiteConfig.PhysicalPath; Validate-NotNull $SiteInstallFolder "SiteInstallFolder"
    $AppPoolName = $WebSiteConfig.WebAppPool.Name; Validate-NotNull $AppPoolName "AppPoolName"
    $TcpPort = $WebSiteConfig.PortTcp;
    
    if((-not (Test-IfWebSiteUsesHttp $WebSiteConfig)) -and (-not (Test-IfWebSiteUsesSSL $WebSiteConfig)))
    {
        Throw-Error "Website [$WebsiteName] does not have a valid http or https port specified. Please specify a port for at least one of these protocols."        
    }
    
    try
    {
        Log-Step "Create and configure Web Site [$WebsiteName]"
    
        # Create website if not already exists
        Log-ActionItem "Check if website [$WebsiteName] already exists"
        $site = Get-WebSiteSafe -Name $WebsiteName
        if($site)
        {
            Log-ActionResult "Yes"                        
            Log-ActionItem "Validating existing website settings with parameters passed to the script"
            $webSitePhysicalPath = $site.PhysicalPath 
            if(-not (Test-IfPathsEqual $webSitePhysicalPath $SiteInstallFolder))
            {
                Throw-Error "Existing site physical path is [$webSitePhysicalPath]. Cannot change it to [$SiteInstallFolder]. Exiting."
            }
            
            Log-ActionResult "Validation has completed successfully"
        }
        else
        {
            Log-ActionResult "No"            
            # Create website directory if not already exists
            Log-ActionItem "Check if directory [$SiteInstallFolder] already exists"
            if (Test-Path -path "$SiteInstallFolder")
            {
                Log-ActionResult "Yes"
            }
            else
            {
                Log-ActionResult "No"
                
                Log-ActionItem "Create application directory [$SiteInstallFolder]"
                New-Item -path "$SiteInstallFolder" -type directory -force
                Log-ActionResult "Complete"
            }
            
            Log-ActionItem "Create website [$WebsiteName]"
            
            # Create a new Website and let it add a default binding, which we proceed to remove and set appropriately
            # Note: Known bug: if no websites exist, ID generation fails for IIS.  So we provide a default ID if no sites exist.
            $webSites = Get-WebSite
            if(-not ($webSites))
            {
                New-WebSite -Name $WebsiteName -PhysicalPath $SiteInstallFolder -ApplicationPool $AppPoolName -ID 1
            }
            else
            {
                New-WebSite -Name $WebsiteName -PhysicalPath $SiteInstallFolder -ApplicationPool $AppPoolName
            }
            
            $siteBindings = Get-WebBindingSafe -Name $WebsiteName
            if($siteBindings)
            {
                $siteBindings| Remove-WebBinding
            }
                        
            if (Get-WebSiteSafe -Name $WebsiteName)
            {
                Log-ActionResult "Complete"
            }
            else
            {
                Throw-Error "Failed to create WebSite [$WebsiteName]"
            }
        }
        
        Log-ActionItem "Configure website [$WebsiteName] to allow anonymous authentication"
        Set-WebConfiguration -value false system.webserver/security/authentication/anonymousAuthentication "IIS:\sites\$WebsiteName" -force
        Log-ActionResult "Complete"
        
        if(Test-IfWebSiteUsesHttp $WebSiteConfig)
        {
            Add-WebSiteBinding -Name $WebsiteName -Protocol "http" -Port $httpPort
        }
        if(Test-IfWebSiteUsesSSL $WebSiteConfig)
        {
            Add-WebSiteBinding -Name $WebsiteName -Protocol "https" -Port $HttpsPort
            Add-SSLBinding -WebSiteConfig $WebSiteConfig
        }
            
        # Tcp port is not used by Retail Server.
        if(Test-IfWebSiteUsesTcp $WebSiteConfig)
        {
            Log-ActionItem "Adding net.tcp binding to port $TcpPort"
            Add-WebSiteBinding -Name $WebsiteName -Protocol "net.tcp" -Port "$TcpPort"            
        }
        
        $webSiteProtocols = Get-ProtocolsToEnable $WebSiteConfig $site.EnabledProtocols
        Log-ActionItem "Configure website to enable [$webSiteProtocols] protocols"
        Set-ItemProperty -Path "IIS:/Sites/$WebsiteName" -Name "enabledProtocols" -Value "$webSiteProtocols" -Force
        Log-ActionResult "Complete"
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Failed: Create and configure website [$WebsiteName]"    
    }

}

function Remove-WebSiteSafe(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    $WebSiteName = $WebSiteConfig.Name; Validate-NotNull $WebsiteName "WebsiteName"

    try
    {
        Log-Step "Remove website if it exists and doesn't contain any applications"
        Log-ActionItem "Check if webSite [$WebSiteName] exists"
        $webSiteExists = Get-WebSiteSafe -Name $WebSiteName
        if($webSiteExists)
        {
            Log-ActionResult "Yes"
        }
        else
        {
            Log-ActionResult "No. Skip removal"
        }
    
        # Delete non-default website
        if ($webSiteExists -and $websiteName.CompareTo("Default Web Site"))
        {
            $applicationPools = (Get-ChildItem "IIS:\Sites\$WebSiteName" -ErrorAction "SilentlyContinue") |
                % { $_.Attributes |
                Where-Object { $_.Name  -eq "applicationpool" }}
            
            if($applicationPools -eq $null -or $applicationPools.Count -eq 0)
            {
                # Remove website
                Log-ActionItem "Remove Website [$WebsiteName]"
                Remove-Website $WebsiteName
            }
            else
            {
                Log-ActionItem "Website [$WebsiteName] contains applications. Skip removal."
            }
            
            Log-ActionResult "Complete"
        }
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Error : Remove Website [$WebSiteName]"
    }
}

function CreateAndConfigure-WebApplication(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    $ServiceBinarySourceFolder = $WebSiteConfig.WebApplication.ServiceBinarySourceFolder; Validate-NotNull $ServiceBinarySourceFolder "ServiceBinarySourceFolder"
    $WebsiteName = $WebSiteConfig.Name; Validate-NotNull $WebsiteName "WebsiteName"
    $AppPoolName = $WebSiteConfig.WebAppPool.Name; Validate-NotNull $AppPoolName "AppPoolName"
    $WebApplicationName = $WebSiteConfig.WebApplication.Name; Validate-NotNull $WebApplicationName "WebApplicationName"
    $WebApplicationWorkingFolder = $WebSiteConfig.WebApplication.PhysicalPath; Validate-NotNull $WebApplicationWorkingFolder "WebApplicationWorkingFolder"
    
    try
    {
        Log-Step "Create and configure web application [$WebApplicationName]"
        # Create application directory if not already exist
        Log-ActionItem "Check if directory [$WebApplicationWorkingFolder] already exists"
        if (Test-Path -path $WebApplicationWorkingFolder)
        {
            Log-ActionResult "Yes"
        }
        else
        {
            Log-ActionResult "No"
            
            Log-ActionItem "Create application directory [$WebApplicationWorkingFolder]"
            New-Item -path "$WebApplicationWorkingFolder" -type directory -force
            Log-ActionResult "Complete"
        }        
        
        Log-ActionItem "Check if application directory and binary source folder are the same."
        if(-not (Test-IfPathsEqual $ServiceBinarySourceFolder $WebApplicationWorkingFolder))
        {
            Log-ActionResult "No"
            # Copy service binaries and config files to the application directory
            Log-ActionItem "Copy server binaries and config files to the application directory [$WebApplicationWorkingFolder]"
            $global:LASTEXITCODE = 0
            & robocopy.exe /E $ServiceBinarySourceFolder $WebApplicationWorkingFolder *
            $capturedExitCode = $global:LASTEXITCODE
            #Robocopy Exit codes related info: http://support.microsoft.com/kb/954404
            if(($capturedExitCode -ge 0) -and ($capturedExitCode -le 8))
            {            
                Log-ActionResult "[Robocopy] completed successfully"
            }
            else
            {
                Throw-Error "[Robocopy] failed with exit code $capturedExitCode"
            }
        }
        else
        {
            Log-ActionResult "Yes"
        }        

        # Check if application already exist
        Log-ActionItem "Check if application [$WebApplicationName] already exists"
        $application = Get-WebApplication -Site $WebsiteName -Name $WebApplicationName
        if($application)
        {
            Log-ActionResult "Yes"
            
            Log-ActionItem "Validating if existing web application can be reconfigured with parameters passed to the script"
            $removeApplication = $false
            $applicationWorkingFolder = $application.PhysicalPath 
            if(-not (Test-IfPathsEqual $applicationWorkingFolder $WebApplicationWorkingFolder))
            {
                Log-ActionResult "Existing application working folder is [$applicationWorkingFolder]. Cannot change it to [$WebApplicationWorkingFolder]. Application will be removed."
                $removeApplication = $true
            }
            
            $applicationPool = $application.ApplicationPool
            if($applicationPool -ne $AppPoolName)
            {
                Log-ActionResult "Existing web application pool is [$applicationPool]. Cannot change it to [$AppPoolName]. Application will be removed."
                $removeApplication = $true
            }
            Log-ActionResult "Validation has completed successfully"
            
            if($removeApplication)
            {
                Remove-WebApplicationSafe -WebSiteConfig $WebSiteConfig
            }
        }

        $application = Get-WebApplication -Site $WebsiteName -Name $WebApplicationName
        if(!$application)
        {
            Log-ActionResult "No"

            # Create application
            Log-ActionItem "Create application [$WebApplicationName]"
            New-WebApplication -Site "$WebsiteName" -Name "$WebApplicationName" -physicalPath "$WebApplicationWorkingFolder" -ApplicationPool "$AppPoolName" -Force
            Log-ActionResult "Complete"
        }

        # Register ASP.NET version with IIS. We will register either .NET 4.0 or .NET 4.5. They cannot be on the box at the same time. The setup/user decides which one should be there.  
        if((-not (IsLocalOSWindows2012OrLater)))
        {
            Log-ActionItem "Register ASP.NET version with IIS"
            $global:LASTEXITCODE = 0
            $isaWidth = Get-WmiObject -Class Win32_Processor | Select-Object AddressWidth
            if ($isaWidth -eq 64)
            {
                & "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\aspnet_regiis.exe" -i
            }
            else
            {
                & "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\aspnet_regiis.exe" -i
            }
            $capturedExitCode = $global:LASTEXITCODE
            if ($capturedExitCode -eq 0)
            {
                Log-ActionResult "Complete"
            }
            else
            {
                Log-ActionResult "Failed"
                Throw-Error "Failed to register ASP.NET version with IIS using [aspnet_regiis.exe]. Return code: $capturedExitCode"
            }
        }
        
        # Configure application to use tcp, https, http protocol
        $applicationProtocols = Get-ProtocolsToEnable $WebSiteConfig
        Log-ActionItem "Configure application to enable [$applicationProtocols] protocols"
        Sleep 3
        Set-ItemProperty -Path "IIS:/Sites/$WebsiteName/$WebApplicationName" -Name "enabledProtocols" -Value "$applicationProtocols" -Force
        Log-ActionResult "Complete"
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Failed: Create and configure application [$WebApplicationName]"
    }
}

function Remove-WebApplicationSafe(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    $WebApplicationName = $WebSiteConfig.WebApplication.Name; Validate-NotNull $WebApplicationName "WebApplicationName"
    $WebsiteName = $WebSiteConfig.Name; Validate-NotNull $WebsiteName "WebsiteName"

    try
    {    
        Log-Step "Delete application [$WebApplicationName] if it exists."
        if(Get-WebApplication -Name $WebApplicationName -Site $WebsiteName)
        {
            # Delete Application
            Log-ActionItem "Delete application [$WebApplicationName]"
            Remove-WebApplication -Site "$WebsiteName" -Name "$WebApplicationName"
        }
        else
        {
            Log-ActionItem "Application [$WebApplicationName] does not exist. Skip removal"
        }
        
        Log-ActionResult "Complete"
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Error: Delete application [$WebApplicationName]"
    }
}

function Check-IfWebApplicationIsUpAndRunning(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    $AppPoolName = $WebSiteConfig.WebAppPool.Name; Validate-NotNull $AppPoolName "AppPoolName"
    $WebsiteName = $WebSiteConfig.Name; Validate-NotNull $WebsiteName "WebsiteName"
    
    try
    {
        Log-Step "Check if web application [$WebApplicationName] on site [$WebsiteName] is up and running"
        Log-ActionItem "Check application pool [$AppPoolName] state"
        $appPoolState = (Get-WebAppPoolState -Name $AppPoolName).Value
        Log-ActionResult "Application pool is in [$appPoolState] state"
        if($appPoolState -ne "Started")
        {
            Start-WebAppPool -Name $AppPoolName
            $appPoolState = (Get-WebAppPoolState -Name $AppPoolName).Value
            if($appPoolState -ne "Started")
            {
                Throw-Error "Application pool [$AppPoolName] is not started. Please check if provided credentials are correct."
            }
        }

        Log-ActionItem "Check web site [$WebsiteName] state"
        $siteState = Get-WebSiteStateSafe -Name $WebsiteName
        Log-ActionResult "Site is in [$siteState] state"
        if($siteState -ne "Started")
        {
            $httpPort = $WebSiteConfig.Port
            $httpsPort = $WebSiteConfig.PortSSL
            $tcpPort = $WebSiteConfig.PortTcp
            
            # List all the listening port
            $portListeningInfo = netstat -aonb
            Log-ActionResult $portListeningInfo

            $startWebSiteAction = {
                Log-ActionItem "Trying to start the website."
                Start-Website -Name $WebsiteName
                Log-ActionResult "Website started successfully."
            }
                        
            Perform-RetryOnDelegate -numTries 10 -numSecondsToSleep 30 -delegateCommand $startWebSiteAction

            $siteState = Get-WebSiteStateSafe -Name $WebsiteName
            if($siteState -ne "Started")
            {
                Throw-Error "Site [$WebsiteName] is not started. Please check if provided ports: http=[$httpPort] https=[$httpsPort] tcp=[$tcpPort] are not used by any other site."
            }
        }
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Site and / or application pool are not Started. Check your configuration."
    }
}

# When we create a website in IIS, there seems to be a time lag
# between execution of the command and IIS actually preparing the
# website, To prevent unwanted code exceptions we're introducing the
# below method to poll IIS at regular intervals.
function Get-WebSiteStateSafe(
    [string]$Name = $(Throw 'Name parameter required'))
{
    $secondsToSleep = 10
    $numOfTries = 7
    for($try = 1;$try -le $numOfTries; ++$try)
    {
        try
        {
            $WebsiteState = (Get-WebSiteState -Name $Name).Value
            break;
        }
        catch
        {
            # If we reach here, the process should sleep for sometime,
            # if we haven't reached the limit to the number of try's.
            if($try -eq $numOfTries)
            {
                $lastTryError = $_
            }
            else
            {
                Start-Sleep -Seconds $secondsToSleep
                $totalWaitTime += $secondsToSleep
            }
        }
    }    
    if($lastTryError)
    {
        Log-Exception $lastTryError
        Throw-Error "Failed to retrieve website [$Name] state after [$totalWaitTime] seconds of waiting."
    }
        
    return $WebsiteState
}

# Removes folder if it exists
function Remove-FolderRecurse(
    [string]$Path = $(Throw 'Path parameter required'))
{
    Log-ActionItem "Checking if [$Path] exists."
    
    if(Test-Path $Path)
    {
        Log-ActionResult "Yes"

        # Files maybe still used by IIS even though application and website were already removed.
        # So removing files may require some time to wait.
        $numTries = 3
        $numSecondsToSleep = 5
        for($try = 1; $try -le $numTries; ++$try)
        {
            Log-ActionItem "Removing [$Path]. Attempt #[$try]"
            try
            {
                $lastTryError = $null
                Remove-Item -Path $Path -Recurse -Force
                Log-ActionResult "Removed successfully from attempt #[$try]"
                break
            }
            catch
            {
                $lastTryError = $_
            }

            if($try -ne $numTries)
            {
                Log-ActionResult "Failed to remove. Sleeping for [$numSecondsToSleep] seconds"
                Start-Sleep -Seconds $numSecondsToSleep
            }
        }

        if($lastTryError)
        {
            Log-Exception $lastTryError
            $totalWaitTime = $numSecondsToSleep * ($numTries - 1)
            Throw-Error "Failed to remove [$Path] after [$totalWaitTime] seconds of waiting"
        }
    }
    else
    {
        Log-ActionResult "No"
    }
    
    Log-ActionResult "Complete"
}

function Remove-FolderIfNotUsedByIIS(
    [string]$Path = $(Throw 'Path parameter required'))
{
    Log-ActionItem "Checking if [$Path] is used by IIS"

    [hashtable]$foldersUsedByIIS = @{}
    Get-WebApplication | % { if ($_.PhysicalPath -ne $null -and $($_.PhysicalPath).Length -gt 0) { $foldersUsedByIIS[$_.PhysicalPath] = 1 } }
    Get-WebSite | % { if ($_.PhysicalPath -ne $null -and $($_.PhysicalPath).Length -gt 0) { $foldersUsedByIIS[$_.PhysicalPath] = 1 } }
    
    # Path is used by IIS if it is a prefix of any IIS folder.
    $Path = [Environment]::ExpandEnvironmentVariables($Path)
    $folderUsedByIIS = ($foldersUsedByIIS.Keys | % { [Environment]::ExpandEnvironmentVariables($_).StartsWith($Path) }) -contains $true
    
    if($folderUsedByIIS)
    {
        Log-ActionResult "Yes. Skip removal"
    }
    else
    {
        Log-ActionResult "No"
        Remove-FolderRecurse -Path $Path
    }
}

function Remove-ServiceBinaries(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    $WebApplicationInstallFolder = $WebSiteConfig.WebApplication.PhysicalPath; Validate-NotNull $WebApplicationInstallFolder "WebApplicationInstallFolder"
    $WebsiteName = $WebSiteConfig.Name; Validate-NotNull $WebsiteName "WebsiteName"
    $WebSiteInstallFolder = $WebSiteConfig.PhysicalPath; Validate-NotNull $WebSiteInstallFolder "WebSiteInstallFolder"
    $ServiceBinarySourceFolder = $WebSiteConfig.WebApplication.ServiceBinarySourceFolder; Validate-NotNull $ServiceBinarySourceFolder "ServiceBinarySourceFolder"

    try
    {
        Log-Step "Remove service binaries"

        if(-not (Test-IfPathsEqual $ServiceBinarySourceFolder $WebApplicationInstallFolder))
        {
            # Delete service binaries
            Log-ActionItem "Delete service binaries from [$WebApplicationInstallFolder]"
            Remove-FolderIfNotUsedByIIS -Path $WebApplicationInstallFolder 
        }
        else
        {
            Log-ActionItem "Web application and service binary folders are the same, binaries will not be removed."
        }

        # Delete website binaries
        Log-ActionItem "Remove $WebsiteName binaries if website does not exist."
        Log-ActionItem "Checking if web site $WebsiteName exists."
        if(Get-WebSiteSafe -Name $WebsiteName)
        {
            Log-ActionResult "Yes"
            Log-ActionItem "Skip removal"
        }
        else
        {
            Log-ActionResult "No"
            Log-ActionItem "Remove service binaries from [$WebSiteInstallFolder]"

            if(-not (Test-IfPathsEqual $ServiceBinarySourceFolder $WebSiteInstallFolder))
            {
                # Delete service binaries
                Log-ActionItem "Delete service binaries from [$WebSiteInstallFolder]"
                Remove-FolderIfNotUsedByIIS -Path $WebSiteInstallFolder
            }
            else
            {
                Log-ActionItem "Website and service binary folders are the same, binaries will not be removed."
            }
        }
    }
    catch
    {
        Log-Exception $_
        throw "Error: Delete service binaries"
    }
}

# Function to set override web site install folder parameter in $WebSiteConfig with existing website install folder.
# And web application working folder with existing web application working folder.
function Update-WebSiteConfigWithInstallFolderOverrides(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    Log-Step "Setting up existing Web Site working folder parameters to WebSiteConfig if any"

    $WebsiteName = $WebSiteConfig.Name; Validate-NotNull $WebsiteName "WebsiteName"
    $WebSiteInstallFolder = $WebSiteConfig.PhysicalPath; Validate-NotNull $WebSiteInstallFolder "WebSiteInstallFolder"

    $webSite = Get-WebSiteSafe -Name $WebsiteName
    if($webSite)
    {
        if(-not (Test-IfPathsEqual $webSite.PhysicalPath $WebSiteInstallFolder))
        {
            Log-ActionItem "Existing Web Site install folder [$($webSite.PhysicalPath)] will override passed [$WebSiteInstallFolder]"
            $WebSiteConfig.PhysicalPath = $webSite.PhysicalPath
        }
    }

    Log-ActionResult "Complete"
}

function Get-WebBindingProperties(
    $binding = @(throw 'Value is required!'))
{
    $bindingInfo = $binding.bindingInformation
    if ($binding.protocol -eq "net.tcp") {
        $bindingInfo = "*:" + $bindingInfo
    }

    $tokens = $bindingInfo.Split(':')

    $result = New-Object PSObject -Prop (@{
        Protocol = $binding.Protocol
        SslFlags = $binding.SslFlags
        IPAddress = $tokens[0..($tokens.Length - 3)] -join ':'
        Port = $tokens[-2]
        HostHeader = $tokens[-1]
    })

    return $result
}

function Update-WebBinding(
    $WebSiteName = $(Throw 'Web site name is required!'),
    $Protocol,
    $Port,
    [ValidateSet('HostHeader','IPAddress','Port', 'Protocol', 'SslFlags')]
    $PropertyName = $(Throw 'Property Name is required!'),
    $Value = $(Throw 'Value is required!')
)
{
    if(-not ($Protocol -or $Port))
    {
        throw 'Either port or protocol should not be null'
    }

    $binding = Get-WebBindingSafe -Name $WebsiteName -Protocol $Protocol -Port $Port

    if($binding)
    {
       if ($binding.protocol -eq "net.tcp")
       {
           if ($PropertyName -ieq "Port") {
                $PortToBeSet = $Value
           }

           # We must iterate over the entire collection since Set-ItemProperty takes a full
           # binding collection. We update in memory only the net.tcp binding then force update
           # the collection in IIS.
           $bindings = Get-ItemProperty -Path "IIS:\sites\$Name" -Name Bindings
           foreach ($iisBinding in $bindings.Collection) {
               $props = Get-WebBindingProperties -binding $iisBinding
               if ($iisBinding.protocol -eq "net.tcp" -and $iisBinding.bindingInformation -eq "" + $props.Port + ":*") {
                 $iisBinding.bindingInformation = "" + $PortToBeSet + ":*";
               }
           }
           Set-ItemProperty -Path "IIS:\sites\$Name" -Name Bindings -Value $bindings -Force
       }
       else
       {
           # This code is needed due to a bug in Remove-WebBinding when using IPv6, and a bug in Set-WebBinding on Windows 7 and Server 2k8
           # See: http://forums.iis.net/t/1159223.aspx?Set+WebBinding+to+change+SSL+port for the Set-WebBinding bug
           # The Remove-WebBinding bug appears to be undocumented, but for now piping Get-WebBinding into Remove-WebBinding fails to remove IPv6 bindings
           $binding | ForEach { `
               $props = Get-WebBindingProperties -Binding $_
               Remove-WebBinding -Name $WebsiteName -Protocol $props.Protocol -Port $props.Port -HostHeader $props.HostHeader
           }
           $binding | ForEach { $props = Get-WebBindingProperties $_; $props.$PropertyName = $Value; $props } | New-WebBinding -Name $WebsiteName
        }
    }
    else
    {
        Log-TimedMessage ("Could not find website binding for website {0}, port {1} and protocol {2}. Skipping update." -f $WebsiteName, $Port, $Protocol)
    }
}

function Get-WebSiteBindingUrls(
    [string]$websiteName = $(Throw 'retailWebsiteName parameter required')
)
{
    $site = Get-Website -Name $websiteName
    $hostNames = @()
    
    $bindings = $site.bindings
    foreach($binding in $bindings.Collection)
    {
        $bindingInfo = $binding.bindingInformation
        $bindingInfo = $bindingInfo.Substring($bindingInfo.LastIndexOf(':') + 1)
        if($bindingInfo.IndexOf('sslFlags') -gt 0)
        {       
            $bindingInfo.Substring(0,$bindingInfo.IndexOf('sslFlags'))
        }  
        $hostName =  'https://' + $bindingInfo.Trim()
        $hostNames = $hostNames + @('https://' + $bindingInfo.Trim()) #.Add($hostName)
        # $hostNames =  $hostNames + $hostName
    }

    return $hostNames
}

function Get-AosUrl(
    [string]$aosWebsiteName = $(Throw 'aosWebsiteName parameter required')
)
{
    [array]$hostNames = Get-WebSiteBindingUrls -websiteName $aosWebsiteName
    for($i = 0; $i -lt $hostNames.Length; $i++)
    {
        if($hostNames[$i] -notlike '*soap*')
        {
            return $hostNames[$i]
        }
    }

    return $hostNames[0].trimEnd('/')
}

function Get-AosSoapUrl(
    [string]$aosWebsiteName = $(Throw 'aosWebsiteName parameter required')
)
{
    [array]$hostNames = Get-WebSiteBindingUrls -websiteName $aosWebsiteName
    for($i = 0; $i -lt $hostNames.Length; $i++)
    {
        if($hostNames[$i] -ilike '*soap*')
        {
            return $hostNames[$i]
        }
    }

    return $hostNames[0].trimEnd('/')
}

function Validate-HttpResponse(
    [string] $Url = $(Throw 'URL is required!')
)    
{
    Log-TimedMessage ("URL to test is {0}" -f $Url)
    
    $request = [System.Net.HttpWebRequest][System.Net.WebRequest]::Create($Url);
    $request.Method = "GET";
    [System.Net.HttpWebResponse]$response = [System.Net.HttpWebResponse]$request.GetResponse();
    $httpStatus = $response.StatusCode
    
    if(-not ($httpStatus -eq 'OK'))
    {
        throw ("Error occurred when trying to validate URL: {0}" -f $Url)
    }
    
    Log-TimedMessage "Finished validating URL."
}

##################################
# Functions to be used by others #
##################################

# Most of the functions in this class work off a website config hashtable, so to enable
# reuse of existing code, we can use this function to generate the required hashtable.
function Create-WebSiteConfigMap(
    [string]$webSiteName,
    [string]$appPoolName,
    [string]$httpsPort,
    [string]$certificateStore = 'My',
    [string]$certificateRootStore = 'LocalMachine',
    [string]$certificateThumbprint,
    [string]$websiteAppPoolUsername
)
{
    $result = @{}
    $result.WebAppPool = @{}
    $result.ServerCertificateRootStore = $certificateRootStore
    $result.ServerCertificateStore = $certificateStore

    if ($webSiteName)
    {
        $result.Name = $webSiteName
    }
    
    if ($appPoolName)
    {
        $result.WebAppPool.Name = $appPoolName
    }
    
    if ($httpsPort)
    {
        $result.PortSSL = $httpsPort
    }

    if ($certificateThumbprint)
    {
        $result.ServerCertificateThumbprint = $certificateThumbprint
    }

    if ($websiteAppPoolUsername)
    {
        $result.WebAppPool.ProcessModel_UserName = $websiteAppPoolUsername
    }

    return $result
}

function Start-RetailWebsiteAndAppPool(
    [string]$webSiteName = $(Throw 'webSiteName parameter required'),
    [string]$appPoolName = $(Throw 'appPoolName parameter required')
)
{
    # Define Start web app pool action.
    $startWebAppPoolAction = {
                Log-ActionItem ('Check application pool [{0}] state.' -f $appPoolName)
                $appPoolState = (Get-WebAppPoolState -Name $appPoolName).Value
                Log-ActionResult ('Application pool is in [{0}] state.' -f $appPoolState)
                if ($appPoolState -ne 'Started')
                {
                    Log-ActionItem 'Attempting to start website app pool.'
                    Start-WebAppPool -Name $appPoolName
                    Log-ActionResult 'Website app pool started successfully.'

                    $appPoolState = (Get-WebAppPoolState -Name $appPoolName).Value
                    if ($appPoolState -ne 'Started')
                    {
                        throw ('Attempt to start application pool {0} for website {1} failed.' -f $appPoolName, $websiteName)
                    }
                }
            }

    # Define Start website action.
    $startWebSiteAction = {
                Log-ActionItem ('Check web site [{0}] state.' -f $webSiteName)
                $siteState = Get-WebSiteStateSafe -Name $webSiteName
                Log-ActionResult ('Site is in [{0}] state' -f $siteState)
                if($siteState -ne 'Started')
                {
                    Log-ActionItem 'Attempting to start the website.'
                    Start-Website -Name $websiteName
                    Log-ActionResult 'Website started successfully.'

                    $siteState = Get-WebSiteStateSafe -Name $websiteName
                    if ($siteState -ne 'Started')
                    {
                        throw ('Attempt to start website {0} failed.' -f $websiteName)
                    }
                }
            }

    # Start web app pool and validate.
    Perform-RetryOnDelegate -numTries 10 -numSecondsToSleep 30 -delegateCommand $startWebAppPoolAction
    
    # Start website and validate.
    Perform-RetryOnDelegate -numTries 10 -numSecondsToSleep 30 -delegateCommand $startWebSiteAction
}

function Start-IISService 
{
    $iisSvcName = "w3svc"
    $w3svc = Get-Service $iisSvcName -ErrorAction SilentlyContinue


    if ($w3svc -eq $null) 
    {
        throw "IIS Service ($iisSvcName) not found."
    }


    if ($w3svc.Status -ne [System.ServiceProcess.ServiceControllerStatus]::Running) 
    {
        Write-Host "IIS Service ($iisSvcName) is not in 'Running' state, attempting to start"
        Start-Service -Name $iisSvcName

        $startTimeout = 60
        $serviceStarted = $false
        # wait for the service to start
        $pollingSW = [System.Diagnostics.Stopwatch]::StartNew()
        while ($pollingSW.Elapsed.TotalSeconds -lt $startTimeout)
        {
            $w3svc = Get-Service $iisSvcName
            if ($w3svc.Status -eq [System.ServiceProcess.ServiceControllerStatus]::Running)
            {
                Write-Host "IIS Service ($iisSvcName) started."
                $serviceStarted = $true
                break
            }
            Start-Sleep -Seconds 1
        }


        if (!$serviceStarted)
        {
            throw "Unable to start IIS Service ($iisSvcName) within the alloted time ($startTimeout seconds)."
        } 

    }
    else 
    {
        Write-Host "IIS Service ($iisSvcName) is in 'Running' state."
    }

}

function Stop-IISExpress
{
    Write-Host "Checking if IIS Express is running..."
    $processes = Get-Process -Name 'iisexpress*' -ErrorAction 'SilentlyContinue'

    if($processes)
    {
        Write-Host 'IIS Express is running. Trying to stop the processes...'
        $processes | Stop-Process -Force
        Write-Host 'Finished stopping the processes.'
    }
    else
    {
        Write-Host 'IIS Express is not running.'
    }
}

function Stop-RetailWebsiteAndAppPool(
    [string]$webSiteName = $(Throw 'webSiteName parameter required'),
    [string]$appPoolName = $(Throw 'appPoolName parameter required')
)
{
    Start-IISService
    # We stop IIS Express so that it does not use the port for Retail services in IIS.
    Stop-IISExpress

    # Define Start web app pool action.
    $stopWebAppPoolAction = {
                Log-ActionItem ('Check application pool [{0}] state.' -f $appPoolName)
                $appPoolState = (Get-WebAppPoolState -Name $appPoolName).Value
                Log-ActionResult ('Application pool is in [{0}] state.' -f $appPoolState)
                if ($appPoolState -ne 'Stopped')
                {
                    Log-ActionItem 'Attempting to stop website app pool.'
                    Stop-WebAppPool -Name $appPoolName
                    Log-ActionResult 'Website app pool stopped successfully.'

                    $appPoolState = (Get-WebAppPoolState -Name $appPoolName).Value
                    if ($appPoolState -ne 'Stopped')
                    {
                        throw ('Attempt to stop application pool {0} for website {1} failed.' -f $appPoolName, $websiteName)
                    }
                }
            }

    # Define Start website action.
    $stopWebSiteAction = {
                Log-ActionItem ('Check web site [{0}] state.' -f $webSiteName)
                $siteState = Get-WebSiteStateSafe -Name $webSiteName
                Log-ActionResult ('Site is in [{0}] state' -f $siteState)
                if ($siteState -ne 'Stopped')
                {
                    Log-ActionItem 'Attempting to stop the website.'
                    Stop-Website -Name $websiteName
                    Log-ActionResult 'Website stopped successfully.'

                    $siteState = Get-WebSiteStateSafe -Name $websiteName
                    if ($siteState -ne 'Stopped')
                    {
                        throw ('Attempt to stop website {0} failed.' -f $websiteName)
                    }
                }
            }

    # Stop web app pool and validate.
    Perform-RetryOnDelegate -numTries 10 -numSecondsToSleep 30 -delegateCommand $stopWebAppPoolAction

    # Stop website and validate.
    Perform-RetryOnDelegate -numTries 10 -numSecondsToSleep 30 -delegateCommand $stopWebSiteAction
}

function Remove-RetailWebsiteAndAssociatedBinaries(
    [string]$webSiteName = $(Throw 'webSiteName parameter required'),
    [string]$appPoolName = $(Throw 'appPoolName parameter required'),
    [string]$webSitePhysicalPath = $(Throw 'webSitePhysicalPath parameter required')
)
{
    $webSiteConfig = Create-WebSiteConfigMap -webSiteName $webSiteName -appPoolName $appPoolName
    
    Remove-ApplicationPoolSafe -WebSiteConfig $webSiteConfig
    Remove-WebSiteSafe -WebSiteConfig $webSiteConfig
    Remove-FolderIfNotUsedByIIS -Path $webSitePhysicalPath
}

#########################
# Main Install function #
#########################
function Install-WebApplication(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'),
    
    [System.Management.Automation.PSCredential[]]$Credentials = $(Throw 'Credentials parameter required')
)
{
    $WebApplicationName = $WebSiteConfig.WebApplication.Name; Validate-NotNull $WebApplicationName "WebApplicationName"
    Write-Host "------------------------------------------"
    Write-Host " Installing web application [$WebApplicationName]"
    Write-Host "------------------------------------------"

    try
    {
        Validate-WebManagementPrerequisites
        Update-WebSiteConfigWithInstallFolderOverrides -WebSiteConfig $WebSiteConfig
        CreateAndConfigure-ApplicationPool -WebSiteConfig $WebSiteConfig -Credentials $Credentials
        CreateAndConfigure-WebSite -WebSiteConfig $WebSiteConfig 
        CreateAndConfigure-WebApplication -WebSiteConfig $WebSiteConfig
        Remove-UnusedWebsiteBindings -WebSiteConfig $WebSiteConfig
        Check-IfWebApplicationIsUpAndRunning -WebSiteConfig $WebSiteConfig 
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Failed to install web application [$WebApplicationName]"
    }
    Write-Host "------------------------------------------"
    Write-Host "Successfully installed web application [$WebApplicationName]"
    Write-Host "------------------------------------------"
}

###########################
# Main Uninstall function #
###########################
function Uninstall-WebApplication(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    $WebApplicationName = $WebSiteConfig.WebApplication.Name; Validate-NotNull $WebApplicationName "WebApplicationName"
    Write-Host "------------------------------------------"
    Write-Host " Uninstalling web application [$WebApplicationName]"
    Write-Host "------------------------------------------"

    try
    {
        Validate-WebManagementPrerequisites
        Update-WebSiteConfigWithInstallFolderOverrides -WebSiteConfig $WebSiteConfig
        Remove-WebApplicationSafe -WebSiteConfig $WebSiteConfig
        Remove-ApplicationPoolSafe -WebSiteConfig $WebSiteConfig
        Remove-WebSiteSafe -WebSiteConfig $WebSiteConfig
        Remove-ServiceBinaries -WebSiteConfig $WebSiteConfig
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Failed to uninstall web application [$WebApplicationName]"
    }
    Write-Host "------------------------------------------"
    Write-Host "Successfully uninstalled web application [$WebApplicationName]"
    Write-Host "------------------------------------------"
}
# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCANCOTzMX68bEJk
# kq8j7hMZv9vNWwqIZOakQTwD4RsjvqCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCCp
# 6AwKBXS0jwJ0pingqXxuBPg3RWR/yr4F0y1UjXSH/DCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBZ
# FgkJzdS99ua4C8GKSoQT8CnhRb9yF9bmso4eBpUPsJiG+oexbnfBN7VCCfDRUz30
# xf4MsQOqOGlVH+j0HHWCYWfGo552L59Ct4jv3cP8lI8j/N0lxzxkvddcKRqiM9/r
# Nk1s6ZwcckqXkAEwhVh04HYZKf9eN8TkOeXnZTVveOehl4xIyhnR4bAXGDKJlehP
# 8P4DAfXfxV+JujQNqXHtxA2GzuATNNgK2luPDi9LnKOgK55BemgsHx/Ae7gLtnjK
# y+N+CvuFQ0S2yHy2EzfKGQnfdIc/lXWTLeTcA0gBUvuV/Beaz6ZPHeo32DsFYRnN
# e2Jgr7zNP03dIcVPpyYkoYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# INFJ33eZtEAWc4ldYfuZrnZ/Elix5TL+hswbHbtscvyVAgZfO+Nac1AYEzIwMjAw
# ODIzMDQwMjUwLjczNVowBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25z
# IFB1ZXJ0byBSaWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo2MEJDLUUzODMt
# MjYzNTElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaCCDkQw
# ggT1MIID3aADAgECAhMzAAABJt+6SyK5goIHAAAAAAEmMA0GCSqGSIb3DQEBCwUA
# MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
# ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
# HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTIxOTAxMTQ1OVoX
# DTIxMDMxNzAxMTQ1OVowgc4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
# dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
# YXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNv
# MSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo2MEJDLUUzODMtMjYzNTElMCMGA1UE
# AxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEB
# BQADggEPADCCAQoCggEBAJ4wvoacTvMNlXQTtfF/Cx5Ol3X0fcjUNMvjLgTmO5+W
# HYJFbp725P3+qvFKDRQHWEI1Sz0gB24urVDIjXjBh5NVNJVMQJI2tltv7M4/4Ibh
# ZJb3xzQW7LolEoZYUZanBTUuyly9osCg4o5joViT2GtmyxK+Fv5kC20l2opeaept
# d/E7ceDAFRM87hiNCsK/KHyC+8+swnlg4gTOey6zQqhzgNsG6HrjLBuDtDs9izAM
# wS2yWT0T52QA9h3Q+B1C9ps2fMKMe+DHpG+0c61D94Yh6cV2XHib4SBCnwIFZAeZ
# E2UJ4qPANSYozI8PH+E5rCT3SVqYvHou97HsXvP2I3MCAwEAAaOCARswggEXMB0G
# A1UdDgQWBBRJq6wfF7B+mEKN0VimX8ajNA5hQTAfBgNVHSMEGDAWgBTVYzpcijGQ
# 80N7fEYbxTNoWoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jv
# c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0w
# MS5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
# Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNy
# dDAMBgNVHRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
# CwUAA4IBAQBAlvudaOlv9Cfzv56bnX41czF6tLtHLB46l6XUch+qNN45ZmOTFwLo
# t3JjwSrn4oycQ9qTET1TFDYd1QND0LiXmKz9OqBXai6S8XdyCQEZvfL82jIAs9pw
# sAQ6XvV9jNybPStRgF/sOAM/Deyfmej9Tg9FcRwXank2qgzdZZNb8GoEze7f1orc
# TF0Q89IUXWIlmwEwQFYF1wjn87N4ZxL9Z/xA2m/R1zizFylWP/mpamCnVfZZLkaf
# FLNUNVmcvc+9gM7vceJs37d3ydabk4wR6ObR34sWaLppmyPlsI1Qq5Lu6bJCWoXz
# YuWpkoK6oEep1gML6SRC3HKVS3UscZhtMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAA
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
# aWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo2MEJDLUUzODMtMjYzNTElMCMG
# A1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIa
# AxUACmcyOWmZxErpq06B8dy6oMZ6//yggYMwgYCkfjB8MQswCQYDVQQGEwJVUzET
# MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
# dGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0BAQUFAAIFAOLsUGswIhgPMjAyMDA4MjMw
# NjE4MTlaGA8yMDIwMDgyNDA2MTgxOVowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA
# 4uxQawIBADAKAgEAAgIliwIB/zAHAgEAAgIQ9DAKAgUA4u2h6wIBADA2BgorBgEE
# AYRZCgQCMSgwJjAMBgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYag
# MA0GCSqGSIb3DQEBBQUAA4GBALLfixUPtkW1r44t1llI8//i0v5JgRg+v04koPze
# xogNdT+4ATifuJEEirzMj1JBB0gZeYHK0isTu2XVNEGzrd+SCh1erpXJNjfMVGCe
# rf0AELzShVX5FBacGVwaFKkC+WQmAMe29+v7ASXPsGTB3lfkO1JpA7/aXPYR+D4q
# r/ymMYIDDTCCAwkCAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAC
# EzMAAAEm37pLIrmCggcAAAAAASYwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgU3lwW8Ex3TuTBs/z
# I2Z3uZdfveVaknt9WFuvrjpCfOAwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCA2/c/vnr1ecAzvapOWZ2xGfAkzrkfpGcrvMW07CQl1DzCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABJt+6SyK5goIHAAAAAAEmMCIE
# ICdABdj+RdV3+4DCeZQlEoS7USHGBlLTDpfdPgnzm2q3MA0GCSqGSIb3DQEBCwUA
# BIIBAHx3hzTVzLgzFizIzP3Y+g5UqPvRz7DwSUgBSu4doq1gTYdZOGA5XKAVNmaB
# pDjTbnEUHJ4n/F0aYkuyGMUrbT9FMl5YAbPm7Hp9XxN59H4lGbRZv8WW/AeF/s4i
# 3OcVUSD896khjrnNU723E5vUeR58gAsThmhoY0oSjDpk7IyoD5xMQZCDD//HWef7
# DUU4YqwPPxF0KuYxmaat/7jQaBmsQLEzs1W18eThs0df6BFfLZNgNy8TBNbZCpGf
# y+jZ3UJ97E56FC+LsSJYZK/dLM/bOVBbRKS0nbdjCKW4ohZhidHQgzz6gneZuc/l
# SdZBK0wf/YcEgCH4saYatRNpDUQ=
# SIG # End signature block
