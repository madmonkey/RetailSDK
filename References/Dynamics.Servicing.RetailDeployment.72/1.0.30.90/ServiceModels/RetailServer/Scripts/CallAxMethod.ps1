<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

param(
    [string]$ClassName = $(Throw 'ClassName parameter required'),
    [string]$MethodName = $(Throw 'MethodName parameter required'),

    [string]$AosWebsiteName,
    [string]$AosDatabaseUser = 'AOSUser',
    [string]$AosDatabasePass = 'AOSWebSite@123',
    $RetryAttempts = 3
)

$ErrorActionPreference = 'Stop'

function Get-AOSWebsitePhysicalPath(
    [string]$AosWebsiteName = $(throw 'AosWebsiteName is required!')
)
{
    $AosWebsite = Get-Website -Name $AosWebsiteName    
    if ($AosWebsite -eq $null)
    {
        throw "Unable to find Aos website with name $AosWebsiteName"
    }

    $AosWebsitePhysicalPath = $AosWebsite.PhysicalPath
    if (-not(Test-Path -Path $AosWebsitePhysicalPath))
    {
        throw ('Unable to locate the web root for AOS at {0}.' -f $AosWebsitePhysicalPath)
    }

    return $AosWebsitePhysicalPath
}

function Update-AXDeploymentUtilityConfigFile(
    [string]$aosWebConfigFilePath = $(throw 'aosWebConfigFilePath is required.'),
    [string]$aosWebsitePhysicalPath = $(throw 'aosWebsitePhysicalPath is required.')
)
{
    $AXDeploymentUtilityConfigFileName = 'Microsoft.Dynamics.AX.Deployment.Setup.exe.config'
    $AXDeploymentUtilityConfigFilePath = Join-Path -Path (Join-Path -Path $aosWebsitePhysicalPath -ChildPath 'bin') -ChildPath $AXDeploymentUtilityConfigFileName

    if (-not (Test-Path -Path $AXDeploymentUtilityConfigFilePath))
    {
        throw 'Could not locate Microsoft.Dynamics.AX.Deployment.Setup.exe.config.'
    }

    Write-Output ('Located AX Deployment Utility config file at {0}.' -f $AXDeploymentUtilityConfigFilePath)
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
            $appSettingElement.Value = [string]$appSettingValue
        }
    }

    $AXDeploymentUtilityConfigFileContent.Save($axDeploymentUtilityConfigFilePath)
}

try
{
    $scriptDir = split-path -parent $MyInvocation.MyCommand.Path;
    . $scriptDir\Common-Configuration.ps1
    . $scriptDir\Common-Web.ps1

    Import-Module WebAdministration
    $doesPassedAOSWebsiteExist = Get-WebSiteSafe $AosWebsiteName
    if (!$doesPassedAOSWebsiteExist)
    {
        $AosWebsiteName = Get-AOSWebsiteName
    }
    
    $aosWebsitePhysicalPath = Get-AOSWebsitePhysicalPath -AosWebsiteName $AosWebsiteName
    
    $aosWebConfigPath = Join-Path -Path $AosWebsitePhysicalPath -ChildPath 'web.config'
    Update-AXDeploymentUtilityConfigFile -aosWebConfigFilePath $aosWebConfigPath -aosWebsitePhysicalPath $aosWebsitePhysicalPath

    $aosWebConfigContent = [xml](Get-Content -Path $aosWebConfigPath)

    # Read value from AOS web.config, sample xml element: <add key="Common.BinDir" value="F:\AosService\PackagesLocalDirectory" />
    $BinDirectory = $aosWebConfigContent.SelectSingleNode("/configuration/appSettings/add[@key='Common.BinDir']").value
    $AosDatabaseServer = $aosWebConfigContent.SelectSingleNode("/configuration/appSettings/add[@key='DataAccess.DbServer']").value
    $AosDatabaseName = $aosWebConfigContent.SelectSingleNode("/configuration/appSettings/add[@key='DataAccess.Database']").value

    $arguments = @(
        "--isemulated", 'false',
        "--bindir", $BinDirectory,
        "--metadatadir", $BinDirectory,
        "--sqlserver", $AosDatabaseServer,
        "--sqldatabase", $AosDatabaseName,
        "--sqluser", $AosDatabaseUser,
        "--sqlpwd", $AosDatabasePass,
        "--setupmode", 'RunStaticXppMethod',
        "--classname", $ClassName,
        "--methodname", $MethodName
    );

    $AxDeploymentSetupExePath = Join-Path -Path $aosWebsitePhysicalPath -ChildPath (Join-Path -Path 'bin' -ChildPath 'Microsoft.Dynamics.AX.Deployment.Setup.exe')

    $executeAxMethodAction = {
        Write-Output ('Trying to execute AxMethod {0} in AXClass {1}.' -f $MethodName, $ClassName)
        Invoke-Executable -executableName $AxDeploymentSetupExePath -arguments $arguments
    }

    Perform-RetryOnDelegate -numTries $RetryAttempts -delegateCommand $executeAxMethodAction
}
catch
{
    Write-Output ($global:error[0] | Format-List * -Force | Out-String -Width 4096)
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine

    # Set a non-zero unique exit code.
    $exitCode = 45345
    Write-Output ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine)
    exit $exitCode
}
# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAEkJsbiBCLqxEx
# NK+19LPwFc71rkn1zAI7lDWFL2jIq6CCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCB7
# dgQ9HCVgoE0gwv6/94c9Z9uYATXjPzSdFe4l3aYaSDCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQB2
# g+jLDbM5RHArwHm4SY9lWb1jlWgipi9gHDco01V62pfT92uoTKUZQ+uEhh9npkfy
# Sli+O50jh9pMSA6ZvtkMkkx0OHplFUrmTT4+ZBg3h744LvNwKCZKiG29N3SlclEs
# Orci5pmaaQiiT6BBhI1QZveUHPwpUXqD9qv2K8QJfp/XJ84XVfIDqmzU2QgeiyTj
# HKLXwpcQM9V2OG3UQOQS3+DhU376tClS11xkvpNlX1TMaHqrWGXcMollxZdDwMmr
# aS5LiojgJ/8vRELrhdcB0d4NbjGaRxs2hgbGA3ZyEUN5RHcQtgqyTKvDEiwY5bnn
# QNb2zYsStf/TXtYDfE44oYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IBhI1svkNVq7vkqO2ba6G/yya6QiRS825o2+9pUATyrgAgZfPVxFK9MYEzIwMjAw
# ODIzMDQwMjQ4LjY3NFowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
# VQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25z
# IExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkZDNDEtNEJENC1EMjIw
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOPDCCBPEw
# ggPZoAMCAQICEzMAAAESJHOjNYZpEw8AAAAAARIwDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTIxWhcNMjEw
# MTIxMjMxOTIxWjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
# BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UE
# CxMdVGhhbGVzIFRTUyBFU046RkM0MS00QkQ0LUQyMjAxJTAjBgNVBAMTHE1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQC7qpkVNy9QRHdwpRC0gj59zrmITeD+fM4UFZeWGrSdq2sSFiIVtqfr
# IHaDreibRBsw04V4wcmpgabdlF+8GBNg4RZ+aPIpK2k25QpMGYVJLFSSsbEOOBWS
# HIqQYfxxybS0Ltun3qGdBqJsfdhlfMq+L4E3aAlyxEwfk9qDZuHUV3y9EyUwfHLD
# hsEpZbCkpNIbjRvFsa7wJd6woZEBBd1pJe7myYmrKMlzeXhv0k3GwjvtvTl+0TCd
# TgjCpYpotp+BANqpUH2ScWZpWeue8FL7aIDditVueTGWXnUKvceE9PAvQiUJsqbK
# flXMpL5MIHtJST56axWt5apNwyP+rx4JAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
# 0jpwHwtMSWArKrTCMswGxnZlW10wHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8Uz
# aFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
# L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoG
# CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
# Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
# AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEA
# OREvr5Gv0gr1Y0WWJy7PoZC5lfdhA5vnnYv7/xAs2WuV/dUBF1EvE/2pz61Ey6Lp
# jTofrExP5ZKHCatVW0tNQREj4a+Rz2FnPv+gx+VRVl7WwPaZXdIiXwhmUKvcot5d
# caUVUQVxxgBzcnTLc/9nCE//E6oZw8QrMPCtrioq6EiIExeTkTubO7YsvTz3dmBd
# Dfc/gIFtfHp7TFajgS/fy2I6tdMratQCed05LJg5oSIWYvFs0xawxi6aoMN1FqnC
# 21xAIRAEmODN09V/0xrrpqkqIp8OU/3zuLQK+BRmbp8rSAP+2BOAHbRq00kaGobd
# 5qt30fFsPaqG6bwn2L1H4DCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZI
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
# Ex1UaGFsZXMgVFNTIEVTTjpGQzQxLTRCRDQtRDIyMDElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAEuAr1oQqvtDy
# nteleDjFzDMCiryggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
# MDANBgkqhkiG9w0BAQUFAAIFAOLrzykwIhgPMjAyMDA4MjMwMTA2NDlaGA8yMDIw
# MDgyNDAxMDY0OVowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA4uvPKQIBADAKAgEA
# AgIfMwIB/zAHAgEAAgIRjzAKAgUA4u0gqQIBADA2BgorBgEEAYRZCgQCMSgwJjAM
# BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEB
# BQUAA4GBACIxEtpHMLKGtGy4ayMjUAjZa08GK6mub5QVJAGkg7Pfwm7rrjTGiHyk
# HYw0ZYgKnHHoqvk8OfubQBuKehBG+gVAWu9o88UChwRPLmKgEyGYESQW+otQ2SQO
# 4YllGBqX2rnLDYWrM/67lkLxaOr7NlnUmeUH+xT60S4dF2Tu4qaLMYIDDTCCAwkC
# AQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
# A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAESJHOjNYZp
# Ew8AAAAAARIwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgoFMaKWslPPMwcKVgYg2GdmwpeR7PK8va
# NXb+MienWvEwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCAkErCCv+giGoqp
# OcgpeGLYpPsnfskYMI+DETR1lzqWUzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABEiRzozWGaRMPAAAAAAESMCIEIIPsPJ1Ph3ucrhsx
# 6ysYf/NGbUI4EY8DaTxh143FJO9UMA0GCSqGSIb3DQEBCwUABIIBAF2HpAmzhngO
# kwH6n5HTTNmzbHVY6TzPoMxdG1g6Y6Y2FHzGJrJUT4KerkxAlGYlIx4o+C8mex00
# 7KiAyhjWJxS5OnMGw+TF6/PQHS1eqjBauKBsYyJSnY/GiiHIVTdFJrg0uD+XoeJ9
# TtWERKZy/mjID9UurTPxtHlCY8N8fTVBojqiGpiJq8fXBl1CWyG1UHM3eY7PHYDl
# Qxlr9geBZeVOwKuQ4y7a548L1koNLpkbwOQ0TyzIn3XA4UAXtrOEoblnbT0MY6ep
# Di94JiAgP7lATT7k0IZSE/ywyFuL5JkVOmobqbWUOjQOOG0MOISDXVl4yvz9JviN
# KITkrm7/rWE=
# SIG # End signature block
