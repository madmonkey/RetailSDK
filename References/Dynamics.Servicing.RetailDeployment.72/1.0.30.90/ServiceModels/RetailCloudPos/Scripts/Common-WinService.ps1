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
. "$ScriptDir\Common-Configuration.ps1"

function Get-WindowsServiceConfigFromXmlNode($node)
{
    [hashtable]$ht = @{}
    $ht.Name = Get-XmlAttributeValue $node "Name"
    $ht.DisplayName = Get-XmlAttributeValue $node "DisplayName"

    $ht.LogOnUser = Get-XmlAttributeValue $node "ServiceUser"
    $ht.ExecutionFileName = Get-XmlAttributeValue $node "ServiceExecutableFileName"

    $ht.SourcePath = Get-XmlAttributeValue $node "SourcePath"
    $ht.PhysicalPath = Get-XmlAttributeValue $node "PhysicalPath"

    return $ht;
}

function Check-CurrentUserIsAdmin 
{
    $identity = [System.Security.Principal.WindowsIdentity]::GetCurrent()  
    $principal = new-object System.Security.Principal.WindowsPrincipal($identity)  
    $admin = [System.Security.Principal.WindowsBuiltInRole]::Administrator  
    $principal.IsInRole($admin)  
} 

function ConvertFrom-SecureToPlain(
    [System.Security.SecureString] $SecureString = $(Throw 'SecureString parameter required'))
{
    $strPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
    $plainTextString = [Runtime.InteropServices.Marshal]::PtrToStringAuto($strPointer) 
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($strPointer)
    $plainTextString    
}

function Grant-UserLogonAsServiceRights(
    [string]$userAccount = $(Throw 'userAccount parameter required'))
{
    # In case if User account is in form ".\account", convert it to "ComputerName\account". Otherwise call to .dll method fails
    if($userAccount -like ".\*")
    {
        $userAccount = $env:COMPUTERNAME + "\" + ($userAccount.split("\\")[1])
    }

    try
    {
        # Use script scope of MyInvocation because $MyInvocation.MyCommand.Path is not defined in function.
        $ScriptDir = split-path -parent $script:MyInvocation.MyCommand.Path;
        $dllPath = Join-Path $ScriptDir 'Microsoft.Dynamics.Retail.Deployment.UserAccountRightsManager.dll'
        Log-ActionItem "Trying to load [$dllPath]"

        # Using LoadFile rather than LoadFrom as it has no dependencies on Fusion.
        [System.Reflection.Assembly]::LoadFile($dllPath)
        Log-ActionResult "Complete"
    }
    catch
    {
        Log-ActionResult 'Failed'
        Log-Error $_
        Throw-Error "Failed To Load [$dllPath]"
    }

    try
    {
        Log-ActionItem "Granting log on as service rights to user account [$userAccount]"

        # Works fine if user already has service logon rights.
        $userManagerObject = New-Object -TypeName Microsoft.Dynamics.Retail.Deployment.UserAccountRightsManager.UserManager
        $userManagerObject.AddLogOnAsServiceRightToAccount($userAccount)
        Log-ActionResult 'Success'
    }
    catch
    {
        Log-ActionResult 'Failed'
        Throw-Error "Failed to grant log on as service permission to [$userAccount]"
    }
}

function Install-WindowsService(
    $WinServiceConfig = $(Throw 'WinServiceConfig parameter required'),
    [System.Management.Automation.PSCredential[]]$Credentials = $(Throw 'Credentials parameter required')
)
{
    $OriginalUserName = $WinServiceConfig.LogOnUser; Validate-NotNull $OriginalUserName "UserName"
    $UserName = Convert-UserNameToADFormat $OriginalUserName
    $ServiceBinarySourceFolder = $WinServiceConfig.SourcePath; Validate-NotNull $ServiceBinarySourceFolder "ServiceBinarySourceFolder"
    $ServiceExeName = $WinServiceConfig.ExecutionFileName; Validate-NotNull $ServiceExeName "ServiceExeName"
    $ServiceName = $WinServiceConfig.Name; Validate-NotNull $ServiceName "ServiceName"
    $DisplayName = $WinServiceConfig.DisplayName; Validate-NotNull $DisplayName "DisplayName"
    $ServiceInstallFolder = $WinServiceConfig.PhysicalPath; Validate-NotNull $ServiceInstallFolder "ServiceInstallFolder"

    Grant-UserLogonAsServiceRights $UserName

    Write-Host "------------------------------------------"
    Write-Host " Installing Windows Service [$ServiceName]"
    Write-Host "------------------------------------------"

    $ExePath = Join-Path -Path $ServiceInstallFolder -ChildPath $ServiceExeName 
    
    Log-ActionItem "Looking up credential for user with name [$OriginalUserName]"
    $foundCredential = $Credentials | Where {$_.Username -like $OriginalUserName}

    $targetCredentials = $null
    $Password = $null
    if ($foundCredential -ne $null)
    {
        $targetCredentials = New-Object System.Management.Automation.PSCredential -ArgumentList $UserName, $foundCredential.Password
        Log-ActionResult "Complete"

        Log-ActionItem "Decrypting password for [$UserName]"
        $Password = $targetCredentials.GetNetworkCredential().Password
        Log-ActionResult "Complete"
    }
        
    Log-ActionItem "Check if service [$ServiceName] already exists"
    if (Get-Service $ServiceName -ErrorAction SilentlyContinue)
    {
        Log-ActionResult "Yes"
        
        Stop-WindowsService $ServiceName
        Copy-WinServiceBinaries $ServiceInstallFolder $ServiceBinarySourceFolder

        Log-ActionItem "Getting details for $ServiceName"
        $service = Get-WmiObject Win32_Service -filter "name='$ServiceName'"
        $currentServiceUser = $service.StartName
        $currentServiceUser = Convert-UserNameToADFormat $currentServiceUser
        Log-ActionResult "configured user: $currentServiceUser"
        
        Log-ActionItem "Change service attributes"
        if ($foundCredential -eq $null)
        {
            if ($currentServiceUser.ToLower() -eq $UserName.ToLower())
            {
                $Password = $null
                Log-ActionItem "Service $ServiceName is currently configured to be run as user $currentServiceUser (same as the one configured for this installation). No password was provided for that user, no service user changes will occurr."
            }
            else
            {
                Throw-Error "Service $ServiceName is configured to run as $currentServiceUser but this installation was requested to change it to $UserName. No password was provided for $UserName. Installation cannot proceed. Please retry providing the password for the user $UserName"
            }
        }
        
        $service.Change($DisplayName,$ExePath,$null,$null,$null,$null,$UserName,$Password,$null,$null,$null)
        Log-ActionResult "Complete"
    }
    else 
    {
        if ($foundCredential -eq $null)
        {
            Throw-Error "Service $ServiceName does not exist and was configured to run as user $OriginalUserName. We were about to create it but no credentials were provided for user with name $OriginalUserName. The script cannot continue."
        }
    
        Log-ActionResult "No"
        Copy-WinServiceBinaries "$ServiceInstallFolder" "$ServiceBinarySourceFolder"

        # Creating windows service using all provided parameters
        Log-ActionItem "Installing service"        
        New-Service -name $ServiceName -binaryPathName $ExePath -displayName $DisplayName -startupType Automatic -description $DisplayName -credential $targetCredentials  
        Log-ActionResult "Complete"
    } 

    Write-Host "------------------------------------------"
    Write-Host "Successfully installed windows service [$ServiceName]"
    Write-Host "------------------------------------------"      
}

function Copy-WinServiceBinaries(
    [string]$ServiceInstallFolder = $(Throw 'ServiceInstallFolder parameter required'),
    [string]$ServiceBinarySourceFolder = $(Throw 'ServiceBinarySourceFolder parameter required')
)
{
   Log-ActionItem "Check if service install folder and binary source folder are the same."
   if(-not (Test-IfPathsEqual $ServiceBinarySourceFolder $ServiceInstallFolder))
   {
        Log-ActionResult "No"
        Log-ActionItem "Check if service path $ServiceInstallFolder exists"
        if (!(Test-Path $ServiceInstallFolder -PathType Container))
        {
            Log-ActionResult "No"
            Log-ActionItem "Create service path $ServiceInstallFolder"
            New-Item "$ServiceInstallFolder" -type directory -force | out-null
            Log-ActionResult "Complete"
        }
        else
        {
           Log-ActionResult "Yes" 
        }

        # Create a copy of the binaries and the config file 
        $serviceBinaryAllFiles = Join-Path -Path $ServiceBinarySourceFolder -ChildPath "\*"
        $copyServiceBinaries = {
                    Log-ActionItem "Copy files from [$ServiceBinarySourceFolder] to [$ServiceInstallFolder]."
                    Copy-Item "$serviceBinaryAllFiles" "$ServiceInstallFolder" -Recurse -Force
                    Log-ActionResult "Copied successfully."
        }

        try
        {
            Perform-RetryOnDelegate $copyServiceBinaries
        }
        catch
        {
            Throw-Error "Failed to copy files from [$ServiceBinarySourceFolder] to [$ServiceInstallFolder]."
        }  
    }
    else
    {
        Log-ActionResult "Yes"
    }

    Log-ActionResult "Complete"
}

function Start-WindowsService(
    [string]$ServiceName = $(Throw 'ServiceName parameter required')
)
{  
    if (Get-Service $ServiceName -ErrorAction SilentlyContinue)
    {
        Log-ActionItem "Start service $ServiceName"
        #Set windows service start mode to Automatic(Delayed)
        & "$env:SystemRoot\System32\sc.exe" config $ServiceName start= 'delayed-auto'
        Start-Service $serviceName        
        # The service will not immediately start.  We need to query its state and only if we get a valid state continue.
        # If it does not start for 60 seconds, fail the script.
        [string]$serviceState = $null
        $loopBeginTime = [Datetime]::Now
        do
        {
            try
            {
                $scService = Get-Service -Name $ServiceName
                $serviceState = $scService.Status
            } 
            catch
            {
                if(([Datetime]::Now) -gt ($loopBeginTime + [Timespan]::FromSeconds(60)))
                {
                    Throw-Error "Service [$ServiceName] could not be started in a timely manner."
                }
                Log-ActionItem "Service [$ServiceName] is not ready for use. Sleeping..."
                Start-Sleep -Second 1 
            }
        }
        until($serviceState -eq "Running")
        
        Log-ActionResult "Service started"  
    }  
}

function Stop-WindowsService(
    [string]$ServiceName = $(Throw 'ServiceName parameter required')
)
{  
    if (Get-Service $ServiceName -ErrorAction SilentlyContinue)
    {
        Log-ActionItem "Stop service $ServiceName"        
        Stop-Service -Name $serviceName -Force #Stop service, ignore dependencies    
        # The service will not immediately stop.  We need to query its state and only if we get a valid state continue.
        # If it does not stop for 60 seconds, fail the script.
        [string]$serviceState = $null
        $loopBeginTime = [Datetime]::Now
        do
        {
            try
            {
                $scService = Get-Service -Name $ServiceName
                $serviceState = $scService.Status
            } 
            catch
            {
                if(([Datetime]::Now) -gt ($loopBeginTime + [Timespan]::FromSeconds(60)))
                {
                    Throw-Error "Service [$ServiceName] could not be stopped in a timely manner."
                }
                Log-ActionItem "Service [$ServiceName] is not ready for use. Sleeping..."
                Start-Sleep -Second 1 
            }
        }
        until($serviceState -eq "Stopped")
        Log-ActionResult "Service stopped"  
    }     
}

function Uninstall-WindowsService(
    $WinServiceConfig = $(Throw 'WinServiceConfig parameter required'))
{
    $ServiceName = $WinServiceConfig.Name; Validate-NotNull $ServiceName "ServiceName"
    Write-Host "------------------------------------------"
    Write-Host " Uninstalling Windows Service [$ServiceName]"
    Write-Host "------------------------------------------"

    try
    {
        Remove-WindowsServiceSafe -ServiceName $ServiceName
        Remove-WinServiceBinaries -WinServiceConfig $WinServiceConfig
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Failed to uninstall windows service [$ServiceName]"
    }
    Write-Host "------------------------------------------"
    Write-Host "Successfully uninstalled windows service [$ServiceName]"
    Write-Host "------------------------------------------"
}

function Remove-WinServiceBinaries(
    $WinServiceConfig = $(Throw 'WinServiceConfig parameter required'))
{
    $ServiceInstallFolder = $WinServiceConfig.PhysicalPath; Validate-NotNull $ServiceInstallFolder "ServiceInstallFolder"
    $ServiceBinarySourceFolder = $WinServiceConfig.SourcePath; Validate-NotNull $ServiceBinarySourceFolder "ServiceBinarySourceFolder"

    Log-ActionItem "Check if service install folder and binary source folder are the same. Do not delete the folder if paths are same."
    if(-not (Test-IfPathsEqual $ServiceBinarySourceFolder $ServiceInstallFolder))
    {
        Log-ActionResult "No"
        
        Log-Step "Remove service binaries"
        # Delete service binaries
        Log-ActionItem "Delete service binaries from [$ServiceInstallFolder]"
        Log-ActionItem "Checking if [$ServiceInstallFolder] exists."
        if(Test-Path $ServiceInstallFolder)
        {
            Log-ActionResult "Yes"

            # Remove binaries from service folders. 
            $deleteServiceBinaries = {
                        Log-ActionItem "Delete files from [$ServiceInstallFolder]."
                        Remove-Item -Path "$ServiceInstallFolder" -Recurse -Force
                        Log-ActionResult "Deleted successfully."
            }
            
            try
            {
                Perform-RetryOnDelegate $deleteServiceBinaries
            }
            catch
            {
                Throw-Error "Failed to delete files from [$ServiceInstallFolder]."
            }
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

    Log-ActionResult "Complete"
}

function Remove-WindowsServiceSafe(
    $ServiceName = $(Throw 'ServiceName parameter required')
)
{
    Log-ActionItem "Check if service [$ServiceName] already exists"

    # Verify if the service already exists, and if yes remove it 
    if (Get-Service $ServiceName -ErrorAction SilentlyContinue)
    {
        Log-ActionResult "Yes"

        # Using WMI to remove Windows service because PowerShell does not have CmdLet for this
        Log-ActionItem "Delete the service $ServiceName"
        Stop-WindowsService -ServiceName $ServiceName

        $serviceToRemove = Get-WmiObject -Class Win32_Service -Filter "name='$ServiceName'"
        $serviceToRemove.Delete()
        Log-ActionResult "Service removed"
    }
    else
    {
        Log-ActionResult "Service does not exist on the system"
    }
}

function Enable-WindowsServiceMonitoringDiscovery(
    $WinServiceConfig = $(Throw 'WinServiceConfig parameter required'),

    [string]$RetailComponentRegistryKey = $(Throw 'RetailComponentRegistryKey parameter required'))
{
    $ServiceName = $WinServiceConfig.Name; Validate-NotNull $ServiceName "ServiceName"

    Log-Step "Enable discovery of Windows Service [$ServiceName] for monitoring purposes"
    try 
    {    
        $WinServiceKeyName = Join-Path $RetailComponentRegistryKey $ServiceName
        # always overwrite
        Log-ActionItem "Save parameters of the Windows Service [$ServiceName] in registry path [$WinServiceKeyName]"
        [void](New-Item $WinServiceKeyName -Force)
        New-ItemPropertyNotNull -Path $WinServiceKeyName -Name "UserName" -PropertyType "String" -Value $WinServiceConfig.LogOnUser
        New-ItemPropertyNotNull -Path $WinServiceKeyName -Name "ServiceName" -PropertyType "String" -Value $ServiceName
        New-ItemPropertyNotNull -Path $WinServiceKeyName -Name "DisplayName" -PropertyType "String" -Value $WinServiceConfig.DisplayName
        New-ItemPropertyNotNull -Path $WinServiceKeyName -Name "ExeName" -PropertyType "String" -Value $WinServiceConfig.ExecutionFileName
        New-ItemPropertyNotNull -Path $WinServiceKeyName -Name "ServiceInstallFolder" -PropertyType "String" -Value $WinServiceConfig.PhysicalPath     

        Log-ActionResult "Complete"    
    }
    catch
    {
        Log-Exception $_
        Write-Warning -Message "Failed: Enabling discovery of Windows Service [$ServiceName] for monitoring purposes"
    }
}

function Disable-WindowsServiceMonitoringDiscovery(
    $WinServiceConfig = $(Throw 'WinServiceConfig parameter required'),

    [string]$RetailComponentRegistryKey = $(Throw 'RetailComponentRegistryKey parameter required'))
{
    $ServiceName = $WinServiceConfig.Name; Validate-NotNull $ServiceName "ServiceName"
    Log-Step "Disable discovery of Windows Service [$ServiceName] for monitoring purposes"

    try
    {
        $WinServiceKeyName = Join-Path $RetailComponentRegistryKey $ServiceName
        Log-ActionItem "Delete registry entry [$WinServiceKeyName]"
        if (Test-Path $WinServiceKeyName)
        {
            Remove-Item -Path $WinServiceKeyName -Recurse -Force
        }
        Log-ActionResult "Complete"
    }
    catch
    {
        Log-Exception $_
        Write-Warning -Message "Failed: Disable discovery of Windows Service [$ServiceName] for monitoring purposes"
    }
}
# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCClRBfADj2RB/zr
# hWdZjQ+NP1GJZasHqGz6flZZdo4SLaCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCDE
# Bkx4yfEbRvwF7tEwxa3iJYWUBm4aEangvyb3qK8ptTCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBC
# vQscYvqqm6Z8h7+S2QjguNYWENImwWgsOStaZb82gshhKNitLAoUF0tJQ4RBjK3z
# nLfa765aRLaYkLWrCrgVZESBHdUjLasRh/b8WnrpIfmXXVW0fyqDOEcSbt+cDcMu
# nFtMQ55/yKJyzZNOw9olE/KBJAnOxLl7cbsm7TE4QeQqig6npos+KppDf2xUT4O6
# zJCfvumNdEWYrJ3m3p2Yhks9kvMPSaqbgoB513n7cRFKqzFqxJya+TkwE+7WV06X
# /vsBjQ1eid1vN1vQuJR8Z3eg3JdAgKKiOC9AraAhHxyMXkzsbf8+lBrNKzxBYhB4
# 5np4bv/0I95OZHh3OrCxoYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IM1TRKbqNxU/3ZWLdgAPCt0H69EdgWKVrrNjP6SYA7pEAgZfO+WManQYEzIwMjAw
# ODIzMDQwMjQ5LjM0OVowBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
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
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgPjFnQhHskdG6PuGv
# VKYXzFW2UiOjo+IflgG4p+bP46swgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCC8RWqLrwVSd+/cGxDfBqS4b1tPXhoPFrC615vV1ugU2jCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABKKAOgeE21U/CAAAAAAEoMCIE
# IKu3LANDj6g7/byri2vOJU5Ihv3XDJ6jB6uEWzEk3FREMA0GCSqGSIb3DQEBCwUA
# BIIBAGcpAu17KcU0zkJUqoLTzX97fCuSnuPIOXyKQO07osgWmlUHZjWDC5Oj9+1s
# RItFqGJrkwDz7LWFX5MJiwXB5SAmNV7ysMm1Us9xOY+Gp/+FYNkQH8Qqg+rRWRON
# 2WfDPlG4JYEURny0gm4mXuPIUGCOBI6iM7Qqv1igu/Om/iyCOOPD9rMYrHODN5MT
# Zes4CeN7P/9syhVxNOaQKMT6ZoWbK9O8ehnFT5wbrTxvzHo0t1tGAos5yVoJMPwh
# bsyXD2VpFhdicnUzGLmdT86hm1sJ9+JAeMn/zawPr5p5ve9NhF8L89hSxaUzpLJG
# zGZpO04MrxqZfBL7hHIvoqeuTEU=
# SIG # End signature block
