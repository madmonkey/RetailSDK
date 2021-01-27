<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>
param (
     [string]$TopologyXmlFilePath = $(Throw "The file name is required!"),
     [string]$SettingsXmlFilePath = $(Throw "The file name is required!"),
     [System.Management.Automation.PSCredential[]]$Credentials,
     [string]$Verbose = $false
)

$ErrorActionPreference = "Stop"

function Get-ConnectionString(
    $WebSiteConfig = $(Throw 'WebSiteConfig parameter required'))
{
    $result = $null
    foreach($appSetting in $WebSiteConfig.WebApplication.AppSettings)
    {
        if($appSetting.Key -eq "ConnectionString")
        {
            $result = $appSetting.Value
            break
        }
    }
    return $result
}

function Configure-RetailServer(
    $RetailServerConfig = $(Throw 'RetailServerConfig parameter required'))
{
    $WebSiteConfig = $RetailServerConfig.WebSite; Validate-NotNull $WebSiteConfig "WebSiteConfig"
    $WebApplicationWorkingFolder = $WebSiteConfig.WebApplication.PhysicalPath; Validate-NotNull $WebApplicationWorkingFolder "WebApplicationWorkingFolder"
    $ConnectionString = Get-ConnectionString -WebSiteConfig $WebSiteConfig;
    
    $RequireSSL = $WebSiteConfig.WebApplication.RequireSSL;
    $AllowAnonymousMetadata = $WebSiteConfig.WebApplication.AllowAnonymousMetadata;
    $httpsPort = $WebSiteConfig.PortSSL;
    $httpPort = $WebSiteConfig.Port;
    
    Validate-NotNull $RequireSSL "Configuration Key [RequireSSL]"; $RequireSSL = [bool]::Parse($RequireSSL);
    Validate-NotNull $AllowAnonymousMetadata "Configuration Key [AllowAnonymousMetadata]"; $AllowAnonymousMetadata = [bool]::Parse($AllowAnonymousMetadata);
    
    try
    {
        Log-Step "Configuring Retail Server"
        # Set AOS server connection string
        Log-ActionItem "Set DB server connection string [$ConnectionString]"

        # - Load web config
        $WebConfigFilePath = "$WebApplicationWorkingFolder\Web.config"
        Log-ActionItem "Checking if [$WebConfigFilePath] exists"
        if(Test-Path $WebConfigFilePath)
        {
            Log-ActionItem "Yes"
        }
        else
        {
            Log-ActionItem "No. Exiting"
            Throw-Error "Configuration file [$WebConfigFilePath] doesn't exist"
        }
        
        $WebConfigXML = [XML] (gc $WebConfigFilePath)

        # - Update app settings
        $configKeys = $WebConfigXML.SelectNodes("/configuration/appSettings/add")
        $keyFound=$false
        foreach ($configKey in $ConfigKeys)
        {
            if ($configKey.key -eq "AllowAnonymousMetadata")
            {
                $configKey.SetAttribute("value", $AllowAnonymousMetadata)
                Log-ActionItem "Set [AllowAnonymousMetadata] = $AllowAnonymousMetadata"
            }
        }
        
        # -Update RequireSSL setting for cookies
        if((StringIsNullOrWhiteSpace $httpPort) -and (-not(StringIsNullOrWhiteSpace $httpsPort)))
        {
            $cookieConfigNodeString = "/configuration/system.identityModel.services/federationConfiguration/cookieHandler"
            $cookieConfigKeys = $WebConfigXML.SelectNodes($cookieConfigNodeString);
            
            if(-not $cookieConfigKeys)
            {
                Throw-Error "Cookie handler node [$cookieConfigNodeString] was not found in [$WebConfigFilePath]"
            }
            
            foreach($cookieConfigKey in $cookieConfigKeys)
            {
                $cookieConfigKey.SetAttribute("requireSsl", $RequireSSL);
            }
            Log-ActionItem "Set [requireSsl] = $RequireSSL"
        }

        $productVersion = Get-ProductVersionMajorMinor
        $RetailComponentRegistryKey = "HKLM:\Software\Microsoft\Dynamics\{0}\RetailServer" -f $productVersion

        # - Add the registry key
        Add-RegistryEntry `
        -WebSiteConfig $RetailServerConfig.WebSite `
        -RetailComponentRegistryKey $RetailComponentRegistryKey
        
		$nodeconnectionStrings = $WebConfigXML.SelectSingleNode("//connectionStrings")
	
		if(!$nodeconnectionStrings)
		{	
			$nodeconnectionStrings = $WebConfigXML.CreateElement('connectionStrings')
			$WebConfigXML.SelectSingleNode("//configuration").AppendChild($nodeconnectionStrings)
		}
		else
		{
			$nodeconnectionStrings.RemoveAll()
		}	
		
		$nodeStorageLookupDatabase = $WebConfigXML.CreateElement('add')
		$nodeStorageLookupDatabase.SetAttribute('name','StorageLookupDatabase')
		$nodeStorageLookupDatabase.SetAttribute('connectionString',"$ConnectionString")
		
		$nodeRetailHoustonStore = $WebConfigXML.CreateElement('add')
		$nodeRetailHoustonStore.SetAttribute('name',"STORAGEID:HoustonStore") 
		$nodeRetailHoustonStore.SetAttribute('connectionString',"$ConnectionString")
		
		$nodeconnectionStrings.AppendChild($nodeStorageLookupDatabase)
		$nodeconnectionStrings.AppendChild($nodeRetailHoustonStore)
		        
        Set-ItemProperty -Path $WebConfigFilePath -name IsReadOnly -value $false -Force
        $WebConfigXML.Save($WebConfigFilePath)
        Log-ActionResult "Completed setting DB Server connection string"
    }
    catch
    {
        Log-Exception $_
        Throw-Error "Failed: Config retail server"
    }
    
    Log-TimedMessage "Finished Retail Server Configuration successfully."
}

try
{
    $ScriptDir = split-path -parent $MyInvocation.MyCommand.Path;
    . "$ScriptDir\Common-Configuration.ps1"
	. "$ScriptDir\Common-Patching.ps1"
    . "$ScriptDir\Common-Web.ps1"

    [xml]$TopologyXml = Expand-VariablesFromSettingsFile $TopologyXmlFilePath $SettingsXmlFilePath
    $rsConfig = Get-RetailServerConfigFromXPath $TopologyXml "//Settings/RetailServerInstance"

    Log-TimedMessage "Starting prerequisite checks."
    if (-not (IsKB2701373-InstalledIfNeeded))
    {
        # issue detected in dot source file. Assuming error/warning was printed already, just exiting. This will exit the main script.
        exit ${global:PrerequisiteFailureReturnCode};
    }

    if(-not (Verify-ApplicationPoolCredentials -WebSiteConfig $rsConfig.WebSite -Credentials $Credentials))
    {
        # issue detected in dot source file. Assuming error/warning was printed already, just exiting. This will exit the main script.
        exit ${global:PrerequisiteFailureReturnCode};
    }

	[bool]$isClrTypesInstalled = $false
	[string]$regBaseKey = "HKLM:\SOFTWARE\Microsoft"
	$subKeys =  get-childitem -Path $regBaseKey | Where-Object {$_.Name -like "*Microsoft SQL Server*"}
	foreach($subKey in $subKeys)
	{
		[string]$fullKey = Join-Path -Path (Join-Path -Path $regBaseKey  $subKey.PSChildName) "SQL Server System CLR Types\CurrentVersion"
		
		if(Test-Path -Path $fullKey)
		{
			if(Check-IfSQLPackageInstalled -minVersion "10.50.1600.1" -registryKey $fullKey -featureName "Microsoft System CLR Types for SQL Server" -installLink "http://go.microsoft.com/fwlink/?LinkId=391659")
			{
				$isClrTypesInstalled = $true
				break;
			}
		}
	}		

	if ($isClrTypesInstalled -eq $false)
	{
		# issue detected in dot source file. This will exit the main script.
		Write-Warning -Message "Prerequisite check failed: Microsoft System CLR Types for SQL Server is not installed. Download and install Microsoft System CLR Types for SQL Server from http://go.microsoft.com/fwlink/?LinkId=391659."
		exit ${global:PrerequisiteFailureReturnCode};
	}

    Write-Log "Trying to install Retail Channel database."

    # 1. setup db user privileges according to topology (databases would also be installed if RetailServer would have any, Channel DB is installed as part of RetailChannelDatabase.msi)
    ${global:LASTEXITCODE} = 0
    & "$ScriptDir\Deploy-Databases.ps1" -TopologyXmlFilePath "$TopologyXmlFilePath" -SettingsXmlFilePath "$SettingsXmlFilePath" -Verbose $Verbose -DeploymentType "ChannelDB"
    
    Write-Log "Finished installing Retail Channel database."

    if(${global:LASTEXITCODE} -ne 0)
    {
        $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine
        $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: {0} Value: {1}{2}" -f $_.ToString(), $PSBoundParameters[$_.ToString()], [System.Environment]::NewLine}
        $exitCode = 1
        Log-TimedError ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine)
        exit $exitCode
    }
    Log-TimedMessage "Finished Deploy-Databases.ps1 successfully."

    # 2. Install retail server instance
    Install-WebApplication -WebSiteConfig $rsConfig.WebSite -Credentials $Credentials
    Configure-RetailServer -RetailServerConfig $rsConfig
}
catch
{
    Log-Error ($global:error[0] | format-list * -f | Out-String)
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine
    $PSBoundParameters.Keys | % { $ScriptLine += "Parameter: {0} Value: {1}{2}" -f $_.ToString(), $PSBoundParameters[$_.ToString()], [System.Environment]::NewLine}
    $exitCode = 2
    Write-Host ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine)
    exit $exitCode
}


# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAp10wqMQfbJcMm
# 1Jva9Uedp5RG7E1NuqgVBUy3lRiQFqCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCB4
# SaNq+J5ulYhGfUEXAdVZ76avJ1X7H7RqjCVkN/f74TCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBe
# MXqWFAUUQHn0x68JTOpSSD2yedBTTC7V3DgBkBEqZX9N2fIpYIIIGiFteZm9Sqx/
# ok6o+Q7vjGJhN7X8FCBUSv4ZAmOo71ufKFhuLsZMqx4/M/ITm+0d1K6b/6jrEmG0
# BtykneTbqggbsVWc1V8bwL3upbC/OWHZEyJzNDJHpKeiS5JfllPgRmNddOxnDfNu
# qkCE942MX8ESto/RN2YBugeAt3TV07wZwk8A0eTuX2Bx/BCqNlk7fS47XIDBjfv3
# TZ9y1ka4p36bTUdJ+P7uax7fqi/4/lte13nMl8UudEsVf22+QXiz8Ma2pSJtBYLL
# 4gBjuHffRvKuZPCL7hszoYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IOxcLcIGMF0sauRRlop3OTPdrWIIg4t6zo54w1Uw6hqCAgZfO+Nac5cYEzIwMjAw
# ODIzMDQwMjU0LjEzM1owBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
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
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgvIGz4XCuC3ojhqrN
# Bq2qSSScoyHqvNME1vW0JO99kuMwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCA2/c/vnr1ecAzvapOWZ2xGfAkzrkfpGcrvMW07CQl1DzCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABJt+6SyK5goIHAAAAAAEmMCIE
# ICdABdj+RdV3+4DCeZQlEoS7USHGBlLTDpfdPgnzm2q3MA0GCSqGSIb3DQEBCwUA
# BIIBAInYDTLJH7SMuBqgtsMeF+dNat0TivmmC5hD3T6wPYwn8XadELm5RSzC1kwk
# lKgdGzczsynJFnWU5zTP3NO/rDMND+tZV4Bk1hNChMzQnNk4JMBMgsDhazwFfisO
# RxTXi14h4Vpx1OfXGJljByYJ/+q7DhbiKnHGadh44LYXbvh/C3xMwKghqoTxnyKK
# rrIb2+ym9c086wzs5qjtlTFRKletGnEII2as61vipLMrh4/c/MsEuAapgdTARN8w
# 7QnNdpCI3K1zztFI59pSs04FmvJ4Vw6xVx3kdrQ8dOVLpZn00GyJUs1sr/MYXbb7
# FqZST4LJo3qIauLWUNYnbqRUdUM=
# SIG # End signature block
