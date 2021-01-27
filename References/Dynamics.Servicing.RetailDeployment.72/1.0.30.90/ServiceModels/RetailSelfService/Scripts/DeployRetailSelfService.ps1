<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

param(
    [string]$config = $(Throw 'config parameter required'),
    [string]$log = $(Throw 'log parameter required'))

function Copy-Files(
    [string]$SourceDirPath = $(Throw 'SourceDirPath parameter required'),
    [string]$DestinationDirPath = $(Throw 'DestinationDirPath parameter required'),
    [string]$FilesToCopy = '*',
    [string]$LogFile)
{
    $global:LASTEXITCODE = 0
    $output = robocopy.exe /E $SourceDirPath $DestinationDirPath $FilesToCopy

    $capturedExitCode = $global:LASTEXITCODE

    Write-Log $output -logFile $LogFile

    #Robocopy Exit codes related info: http://support.microsoft.com/kb/954404
    if(($capturedExitCode -ge 0) -and ($capturedExitCode -le 8))
    {
        Write-Log "[Robocopy] completed successfully." -logFile $LogFile
    }
    else
    {
        throw "[Robocopy] failed with exit code $capturedExitCode"
    }
}

function Copy-SelfServiceArtifacts(
    [string]$TargetPackagesPath = $(Throw 'TargetPackagesPath parameter required'),
    [string]$TargetScriptsPath = $(Throw 'TargetScriptsPath parameter required'),
    [string]$SourceDirectory = $(Throw 'SourceDirectory parameter required'),
    [string]$LogFile)
{
    Write-Log "Starting to copy self service artifacts." -logFile $LogFile

    # Source location for self-service packages and scripts
    $sourceSelfServicePkgLocation = Join-Path -Path $SourceDirectory -ChildPath 'Packages'
    $sourceSelfServiceScriptLocation = Join-Path -Path $SourceDirectory -ChildPath 'Scripts'

    Write-Log ("Copying self-service packages from: '{0}' to: '{1}'" -f $sourceSelfServicePkgLocation, $TargetPackagesPath) -logFile $LogFile
    Copy-Files $sourceSelfServicePkgLocation $TargetPackagesPath -logFile  $LogFile

    Write-Log ("Copying self-service scripts from: '{0}' to: '{1}'" -f $sourceSelfServiceScriptLocation, $TargetScriptsPath) -logFile $LogFile
    Copy-Files $sourceSelfServiceScriptLocation $TargetScriptsPath -logFile  $LogFile

    Write-Log "Finished copying self service artifacts." -logFile $LogFile
}

function ConvertDomainUser-ToSID(
    [string]$DomainUser = $(Throw 'DomainUser parameter is required')
)
{
    $domainName = $DomainUser.Split('\')[0]
    $userName = $DomainUser.Split('\')[1]

    $userObject = New-Object System.Security.Principal.NTAccount($domainName, $userName)
    $SIDString = $userObject.Translate([System.Security.Principal.SecurityIdentifier])

    return $SIDString.Value
}

function Add-UserPermissionsToFolder(
    [string]$Folder = $(Throw 'Folder parameter is required'),
    [string]$UserSID = $(Throw 'UserSID parameter is required')
)
{
    $identity = New-Object System.Security.Principal.SecurityIdentifier($UserSID)

    $acl = (Get-Item $Folder).GetAccessControl('Access')
    $aclRule = New-Object System.Security.AccessControl.FileSystemAccessRule($identity,'FullControl','ContainerInherit,ObjectInherit','None','Allow')

    $acl.SetAccessRule($aclRule)
    $acl | Set-Acl $Folder
}

function Configure-SelfServicePackages(
    [string]$SelfServicePackagesDirectory = $(Throw 'SelfServicePackagesDirectory parameter required'),
    [string]$SelfServiceScriptsDirectory = $(Throw 'SelfServiceScriptsDirectory parameter required'),
    [string]$AosWebsiteName = $(Throw 'AosWebsiteName parameter required'),
    [string]$AOSServiceUser = $(Throw 'AOSServiceUser parameter required'),
    [string]$LogFile = $(Throw 'LogFile parameter required'))
{
    # Add permissions for IIS_IUSRS and AOSServiceUser to self-service packages folder.
    Write-Log "Granting permissions to IIS_IUSRS." -logFile $LogFile

    Add-UserPermissionsToFolder -Folder $SelfServicePackagesDirectory -UserSID 'S-1-5-32-568'
    Write-Log ("Finished granting permissions to IIS_IUSRS for '{0}'" -f $SelfServicePackagesDirectory) -logFile $LogFile

    if ([System.String]::Equals($AOSServiceUser, "NETWORK_SERVICE", [System.StringComparison]::OrdinalIgnoreCase))
    {
        # "S-1-5-20" is a well-known SID for NETWORK_SERVICE. Please refer: http://msdn.microsoft.com/en-us/library/cc980032.aspx
        Write-Log "Granting permissions to NETWORK_SERVICE." -logFile $LogFile
        
        Add-UserPermissionsToFolder -Folder $SelfServicePackagesDirectory -UserSID 'S-1-5-20'
        Write-Log ("Finished granting permissions to NETWORK_SERVICE for '{0}'" -f $SelfServicePackagesDirectory) -logFile $LogFile
    }
    else
    {
        $userSID = ConvertDomainUser-ToSID -DomainUser  $AOSServiceUser
        Write-Log ("Granting permissions to '{0}'." -f $AOSServiceUser) -logFile $LogFile

        Add-UserPermissionsToFolder -Folder $SelfServicePackagesDirectory -UserSID $userSID
        Write-Log ("Finished granting permissions to '{0}' for '{1}'" -f $AOSServiceUser, $SelfServicePackagesDirectory) -logFile $LogFile
    }

    # Record Self-Service metadata in registry
    $selfServiceLocationRegistryPath = 'HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailSelfService'
    Write-Log ("Updating self service packages location in registry: '{0}'" -f $selfServiceLocationRegistryPath) -logFile $LogFile

    New-Item -Path $selfServiceLocationRegistryPath -ItemType Directory -Force
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name (Get-SelfServicePkgLocationRegKeyName) -Value $SelfServicePackagesDirectory
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name (Get-SelfServiceScriptsLocationRegKeyName) -Value $SelfServiceScriptsDirectory
    New-ItemProperty -Path $selfServiceLocationRegistryPath -Name (Get-SelfServiceAOSWebsiteRegKeyName) -Value $AosWebsiteName

    Write-Log "Finished updating self service packages location in registry." -logFile $LogFile
}

try
{
    $scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
    Import-Module (Join-Path -Path $scriptDir -ChildPath 'SelfServiceConfiguration.psm1') -DisableNameChecking

    $settings = @{}
    if (-not($config))
    {
        Write-Log -objectToLog 'The config parameter cannot be empty!' -logFile $log
        Throw 'The config parameter cannot be empty!'
    }

    # Decode all config values
    Write-Log -objectToLog ("Input configuration string: {0}" -f $config) -logFile $log
    $decodedConfig = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($config))

    $settings = ConvertFrom-Json $decodedConfig
    Write-Log -objectToLog ("Decoded configuration string: {0}" -f $settings) -logFile $log

    # Read all decoded config values
    $AOSWebsiteName = $($settings.AOSWebsiteName)
    $AOSServiceUser = $($settings.AOSServiceUser)

    $targetPackagesFolder = $($settings.PackagesDropLocation)
    $targetScriptsFolder = $($settings.ScriptsDropLocation)

    # Copy Self-Service packages and scripts to correct location
    $retailSelfServiceRootFolder = (Get-Item $scriptDir).Parent.FullName
    Copy-SelfServiceArtifacts -TargetPackagesPath $targetPackagesFolder `
                              -TargetScriptsPath $targetScriptsFolder `
                              -SourceDirectory $retailSelfServiceRootFolder `
                              -LogFile $log

    # Configure Self-Service packages
    Configure-SelfServicePackages -SelfServicePackagesDirectory $targetPackagesFolder `
                                  -SelfServiceScriptsDirectory $targetScriptsFolder `
                                  -AosWebsiteName $AOSWebsiteName `
                                  -AOSServiceUser $AOSServiceUser `
                                  -logFile $log
}
catch
{
    Write-Log ($global:error[0] | Format-List * -Force | Out-String -Width 4096) -logFile $log
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine

    # Set a non-zero unique exit code for RetailSelfService deploy failure
    $exitCode = 24741
    Write-Log ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine) -logFile $log
    exit $exitCode
}


# SIG # Begin signature block
# MIIkAwYJKoZIhvcNAQcCoIIj9DCCI/ACAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDc1RVooPUb/Qn2
# RjtBA4HhdyxywkNfVcE3oEW7dv1Ne6CCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# cVZOSEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFdQwghXQAgEBMIGVMH4x
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01p
# Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAAGIr1LWuZJt6PkAAAAA
# AYgwDQYJYIZIAWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEE
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCDl
# fYQngsUJcuHnOdcA2cem5qlcDcDS2YZ5wGoeTUTBgTCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBL
# Rq+BBuJJY2Fg7+kZJeNhxZN/mk932lCwMwXQmhNG9BOa3Au8EpKb3MpuloODp+Up
# saYUsb/dRpTDu6e1oCdbGWxRa6VSsAK9EXxc9evq21iEYi+qZnENU7DMucwCdhvj
# 4PGu6t+71pL/Pgz11nOSJQ9whTq7KAombswFpMStYPz8yyoAPgnzkmZI1s2CDy3e
# OP5QODzk8d7vtrvVy/lHTJhHImcpPiU9lRnav3O5Ry8nz1UHLkHy4cajqVQEeKMX
# W7nVlZgbIm+trA7bYrb/EacrcsFliPuNtQ99pKJpsBY74JPmnmbR0A1Sj9nSw4Uq
# 8/vl5bb3ikdL60GegpSPoYIS5DCCEuAGCisGAQQBgjcDAwExghLQMIISzAYJKoZI
# hvcNAQcCoIISvTCCErkCAQMxDzANBglghkgBZQMEAgEFADCCAVAGCyqGSIb3DQEJ
# EAEEoIIBPwSCATswggE3AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# ILbVO0DreR8uNTA+JOO5bcJwEK1dWSv4eLSBO37BTevkAgZfPVxFK9gYEjIwMjAw
# ODIzMDQwMjQ5LjI2WjAEgAIB9KCB0KSBzTCByjELMAkGA1UEBhMCVVMxCzAJBgNV
# BAgTAldBMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
# cG9yYXRpb24xLTArBgNVBAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMg
# TGltaXRlZDEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046RkM0MS00QkQ0LUQyMjAx
# JTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wggg48MIIE8TCC
# A9mgAwIBAgITMwAAARIkc6M1hmkTDwAAAAABEjANBgkqhkiG9w0BAQsFADB8MQsw
# CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
# ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
# b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTEwMjMyMzE5MjFaFw0yMTAx
# MjEyMzE5MjFaMIHKMQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNVBAcT
# B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsGA1UE
# CxMkTWljcm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
# Ex1UaGFsZXMgVFNTIEVTTjpGQzQxLTRCRDQtRDIyMDElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
# AQoCggEBALuqmRU3L1BEd3ClELSCPn3OuYhN4P58zhQVl5YatJ2raxIWIhW2p+sg
# doOt6JtEGzDThXjByamBpt2UX7wYE2DhFn5o8ikraTblCkwZhUksVJKxsQ44FZIc
# ipBh/HHJtLQu26feoZ0Gomx92GV8yr4vgTdoCXLETB+T2oNm4dRXfL0TJTB8csOG
# wSllsKSk0huNG8WxrvAl3rChkQEF3Wkl7ubJiasoyXN5eG/STcbCO+29OX7RMJ1O
# CMKlimi2n4EA2qlQfZJxZmlZ657wUvtogN2K1W55MZZedQq9x4T08C9CJQmypsp+
# Vcykvkwge0lJPnprFa3lqk3DI/6vHgkCAwEAAaOCARswggEXMB0GA1UdDgQWBBTS
# OnAfC0xJYCsqtMIyzAbGdmVbXTAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNo
# WoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
# cGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYI
# KwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5j
# b20vcGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNydDAMBgNVHRMB
# Af8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IBAQA5
# ES+vka/SCvVjRZYnLs+hkLmV92EDm+edi/v/ECzZa5X91QEXUS8T/anPrUTLoumN
# Oh+sTE/lkocJq1VbS01BESPhr5HPYWc+/6DH5VFWXtbA9pld0iJfCGZQq9yi3l1x
# pRVRBXHGAHNydMtz/2cIT/8TqhnDxCsw8K2uKiroSIgTF5ORO5s7tiy9PPd2YF0N
# 9z+AgW18entMVqOBL9/LYjq10ytq1AJ53TksmDmhIhZi8WzTFrDGLpqgw3UWqcLb
# XEAhEASY4M3T1X/TGuumqSoinw5T/fO4tAr4FGZunytIA/7YE4AdtGrTSRoaht3m
# q3fR8Ww9qobpvCfYvUfgMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAAAjANBgkqhkiG
# 9w0BAQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
# BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEy
# MDAGA1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIw
# MTAwHhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAxMjE0NjU1WjB8MQswCQYDVQQGEwJV
# UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
# ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGlt
# ZS1TdGFtcCBQQ0EgMjAxMDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
# AKkdDbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX77XxoSyxfxcPlYcJ2tz5mK1vw
# FVMnBDEfQRsalR3OCROOfGEwWbEwRA/xYIiEVEMM1024OAizQt2TrNZzMFcmgqNF
# DdDq9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0ySwcSmXdFhE24oxhr5hoC7
# 32H8RsEnHSRnEnIaIYqvS2SJUGKxXf13Hz3wV3WsvYpCTUBR0Q+cBj5nf/VmwAOW
# RH7v0Ev9buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn9NxkvaQBwSAJ
# k3jN/LzAyURdXhacAQVPIk0CAwEAAaOCAeYwggHiMBAGCSsGAQQBgjcVAQQDAgEA
# MB0GA1UdDgQWBBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEEAYI3FAIEDB4K
# AFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSME
# GDAWgBTV9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBHhkVodHRw
# Oi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNSb29DZXJB
# dXRfMjAxMC0wNi0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5o
# dHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0NlckF1dF8y
# MDEwLTA2LTIzLmNydDCBoAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEEAYI3LgMwgYEw
# PQYIKwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9QS0kvZG9jcy9D
# UFMvZGVmYXVsdC5odG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AUABv
# AGwAaQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZIhvcNAQELBQAD
# ggIBAAfmiFEN4sbgmD+BcQM9naOhIW+z66bM9TG+zwXiqf76V20ZMLPCxWbJat/1
# 5/B4vceoniXj+bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX/1z5Xhc1mCRW
# S3TvQhDIr79/xn/yN31aPxzymXlKkVIArzgPF/UveYFl2am1a+THzvbKegBvSzBE
# JCI8z+0DpZaPWSm8tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnxzplmkIz/amJ/
# 3cVKC5Em4jnsGUpxY517IW3DnKOiPPp/fZZqkHimbdLhnPkd/DjYlPTGpQqWhqS9
# nhquBEKDuLWAmyI4ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kWumGnEcua2A5H
# moDF0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/nMQekkzr3ZUd46PioSKv3
# 3nJ+YWtvd6mBy6cJrDm77MbL2IK0cs0d9LiFAR6A+xuJKlQ5slvayA1VmXqHczsI
# 5pgt6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnPGUFN4Ib5KpqjEWYw07t0
# MkvfY3v1mYovG8chr1m1rtxEPJdQcdeh0sVV42neV8HR3jDA/czmTfsNv11P6Z0e
# GTgvvM9YBS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkSoYICzjCCAjcCAQEw
# gfihgdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJXQTEQMA4GA1UEBxMH
# UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0wKwYDVQQL
# EyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25zIExpbWl0ZWQxJjAkBgNVBAsT
# HVRoYWxlcyBUU1MgRVNOOkZDNDEtNEJENC1EMjIwMSUwIwYDVQQDExxNaWNyb3Nv
# ZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQAS4CvWhCq+0PKe
# 16V4OMXMMwKKvKCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
# aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
# cG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEw
# MA0GCSqGSIb3DQEBBQUAAgUA4uvPKTAiGA8yMDIwMDgyMzAxMDY0OVoYDzIwMjAw
# ODI0MDEwNjQ5WjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi688pAgEAMAoCAQAC
# Ah8zAgH/MAcCAQACAhGPMAoCBQDi7SCpAgEAMDYGCisGAQQBhFkKBAIxKDAmMAwG
# CisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEF
# BQADgYEAIjES2kcwsoa0bLhrIyNQCNlrTwYrqa5vlBUkAaSDs9/CbuuuNMaIfKQd
# jDRliAqcceiq+Tw5+5tAG4p6EEb6BUBa72jzxQKHBE8uYqATIZgRJBb6i1DZJA7h
# iWUYGpfaucsNhasz/ruWQvFo6vs2WdSZ5Qf7FPrRLh0XZO7iposxggMNMIIDCQIB
# ATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
# BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
# VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAARIkc6M1hmkT
# DwAAAAABEjANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqGSIb3
# DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCBDSp+5GbN7j9hkV/4FgTUf79uH7jXEjQd2
# 4oulZMb+NjCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0EICQSsIK/6CIaiqk5
# yCl4Ytik+yd+yRgwj4MRNHWXOpZTMIGYMIGApH4wfDELMAkGA1UEBhMCVVMxEzAR
# BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
# Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3Rh
# bXAgUENBIDIwMTACEzMAAAESJHOjNYZpEw8AAAAAARIwIgQgg+w8nU+He5yuGzHr
# Kxh/80ZtQjgRjwNpPGHXjcUk71QwDQYJKoZIhvcNAQELBQAEggEAnjLa3NSlyAAZ
# koi/4QD+N3vPKwoREYVGN5W0kO9Ykj/HgijrTCX2T2HwYZ6I29LYjayQ2FIkSvmQ
# HbwQO5ZbhYVqxbMd7/zH8BS8xScdlBGFpLsDDa6FQEN1noKALx3H0QqKDBEE0x7I
# /lT7rEstMVhjEfHUUBC00hfKI8G+DRN6tbo5GYfofInGYWKUCStBdazqPD8OIjC5
# ouBnJNPhBo95JjLHBJZ/4IMqCVfTAIx6JaaQxZAx1RvBvWbDHIcVgSWFgNj0MiW0
# +N8wZwvorJu3ejyoJvqfY8LcWvnd+AM6VVKdeBjrFjl555YoR3Ey+TWm+yDdgSy6
# NFD1OOwNJQ==
# SIG # End signature block
