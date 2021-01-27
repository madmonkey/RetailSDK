param
(
	[string]$PackageDirectory = $(Throw 'PackageDirectory is required!'),
    [xml]$ServiceModelXml = $(Throw 'ServiceModelXml is required!'),
    [string]$OutputPath = $(Throw 'OutputPath is required!')
)

# https://connect.microsoft.com/PowerShell/feedback/details/812942/dsc-failure-to-pass-parameters-to-nested-configurations
. "C:\Program Files\WindowsPowerShell\Modules\xDynamics\CommonRetailDSCConfiguration.ps1"

#region service configuration
Configuration RetailServerConfiguration {
    param (
        $MachineName,
        $PackageDirectory,
        [xml] $ServiceModelXml)

    Import-DSCResource -Module xDynamics
    Import-DscResource -Module xWebAdministration  
	
    StartMonitoring -monitoringdll:"$PackageDirectory\ETWManifest\Microsoft.Dynamics.AX7Deployment.Instrumentation.dll"

    Node $MachineName {

        $params = @{Ensure="Present" # Present;Absent
            PackageDirectory=$PackageDirectory
            ServiceModelXml=$ServiceModelXml
            MonitoringAssembly=$global:telemetrydll}

        RetailWebsite CreateRetailServerWebsite @params
    }    
}

try
{
	$dbserver = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='dbServer']")
    $dbname = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='dbName']")
    $sqlpwd = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='dbPassword']")
    $sqluser = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='dbUser']")
	$deployUser = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='AxDbDeploySqlUser']")
	$deployPassword = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='AxDbDeploySqlPwd']")
    $dbSyncUser = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='dataSyncDbUser']")
	$dbSyncUserPassword = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='dataSyncDbUserPassword']")
	$retailExtensionsUser = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='AxDeployExtUser']")
    $retailExtensionsUserPassword = (Get-ConfigurationValueFromServiceModelXml -ServiceModelXml $ServiceModelXml -XPath "//Configuration/Setting[@Name='AxDeployExtUserPassword']")
	
	$settings = @{}
	$settings.AxDbServer = $dbserver
	$settings.AxDbName = $dbname
	$settings.AxDbDeploySqlUser = $deployUser
	$settings.AxDbDeploySqlPwd = $deployPassword
    $settings.dbUser = $sqluser
    $settings.dbPassword = $sqlpwd
	$settings.dataSyncDbUser = $dbSyncUser
    $settings.dataSyncDbUserPassword = $dbSyncUserPassword
	$settings.AxDeployExtUser = $retailExtensionsUser
	$settings.AxDeployExtUserPassword = $retailExtensionsUserPassword 
	
	$databaseDeploymentScript = (Join-Path $PackageDirectory 'Scripts\ApplyRetailDBScriptInSQLSURetailSchema.ps1')	
	$config = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $settings)))	
	
	$ChannelDbDeploymentLog = (Join-Path -Path $global:logdir -ChildPath 'RetailChannelDatabase.log')
	
	$retailUsersToCreate = @{$sqluser = $sqlpwd;$dbSyncUser = $dbSyncUserPassword; $retailExtensionsUser = $retailExtensionsUserPassword}
	foreach($user in $retailUsersToCreate.Keys)
    {	
		Write-Log ('Create user {0}' -f $user)
		
	    $userPassword = $retailUsersToCreate[$user]	
		$queryToMapUserToLogin = "
		IF NOT EXISTS (SELECT * FROM sys.sql_logins WHERE name = N'$user') BEGIN CREATE LOGIN $user with password = '$userPassword' END
		IF NOT EXISTS(SELECT * FROM SYS.SYSUSERS WHERE [NAME] = '$user' AND ISSQLUSER = 1) BEGIN  CREATE USER $user FROM LOGIN $user END"
		
        Invoke-SqlCmd -ServerInstance $dbServer -Database  $dbName -Username $deployUser -Password $deployPassword -Query $queryToMapUserToLogin -ErrorAction Stop	
	}	
	
	$global:LASTEXITCODE = 0
	Write-Log "Deploying database by calling $databaseDeploymentScript"
	& $databaseDeploymentScript -config $config -log $ChannelDbDeploymentLog
	
	$capturedExitCode = $global:LASTEXITCODE
	if($capturedExitCode -ne 0)
	{
		$errorMessage = "Error running database deployment script, exit code: $capturedExitCode"	
		Write-Output $errorMessage
		throw $errorMessage
	}
	
	$errorsBeforeDSCConfig=$error.Count
	
	RetailServerConfiguration -PackageDirectory $PackageDirectory `
		-MachineName $env:COMPUTERNAME `
		-ServiceModelXml $ServiceModelXml `
		-OutputPath $OutputPath -Verbose

	Start-DscConfiguration -Path $outputpath -Wait -Verbose -force
	$ConfigStatus = Get-DscConfigurationStatus
	$ConfigStatus | Format-List -Property * | Out-File -FilePath (Join-Path -Path $global:logdir -ChildPath 'RetailServiceConfiguration.log') -Force

	$errorsAfterDSCConfig=$error.Count
	
    if($ConfigStatus.Status -eq 'Success' -and $errorsBeforeDSCConfig -eq $errorsAfterDSCConfig)
    {
        exit 0
    }
    else
    {
        throw "Retail server configuration did not complete, Message: $($ConfigStatus.StatusMessage), see log for details"
    }
}
catch
{
    Write-Output ($global:error[0] | Format-List * -Force | Out-String -Width 4096)
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine

    # Set a non-zero unique exit code for deploy failure
    $exitCode = 4001
    Write-Output ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine)
    exit $exitCode
}


# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBAxr3BuI9oqges
# c9IuhJULYArD0kNsANHVFGoCOEANxqCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBu
# mXXzTSRxwxqD+Bmtfja/XvUfCIFhvtan2IVpWen8TTCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQB/
# FQeyKMrxQMDBD+5CsnzmgoLNUCG5/TbI8LTvFZVy/4Rt07sgFEKfVPdOu8Pmz4RV
# b8JlH/4vsGjCX1sVAKypeFt2bNf+X3ru3STuXt3FcAOqI3pGXlXE9Q+8I8W/j5R4
# ExigriqpuUEKFNT8Hizrikd+Esn82uqAN3l7yjIxg4B/qAQ27z9jikmYmMtcM+pZ
# tTRhN+6Yv16mMJ/V3pQHjnOdr8c82eB7FIpC5FmkhWdaL014kvlE67jbPR3jWYtE
# +9xkcsDpMYMJjg1paZgm2DPWJA79wQ8MlRXXD/LWXy9CZ3/tV48BgIKV1J243iuf
# nm6lpoLWxGl0CDXOg/ZEoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IHwBZW4HgEO0lTNNF/kOelvqGifFLaWPqyxkZM3Q+Q8AAgZfPSuXiA0YEzIwMjAw
# ODIzMDQwMzQzLjQ1OFowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
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
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQg4Lxxcn6XIIBnvDq8GUBB6wdJrEwwXBK1
# sVwxCaFqvpwwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCBXAzYkM7qhDCgN
# 6EbxXbZtR3HNkNZaGSMYHzfL5NKsqjCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABClLIOQFS0XBLAAAAAAEKMCIEIBqZiGzGyIFc26q+
# oooMu/H2aOjzZBnUZTqvwvMjKN1IMA0GCSqGSIb3DQEBCwUABIIBAHUP3mwzcOzi
# 9Qpb94teCnrjJXYbhyH8a8P/X5dAQwvEPWp1ebsBe4t9QRdTGFHMoApdfV8yFxsf
# 0M8lkFo7WdDEmUTg6xHar8sVLD9eVN3ZQMpkb6YvgNiIv4UrIT2VJLNm58d8DmCj
# wk/2iyVh7fNrkuHsNhMKhkdjr3t0QnE2YgGmF0bRA9Vla4fHO8+pBpq56Rs24qQ1
# MLu4JFxImFMUibR+BWUcTzQ2gnIZqTy8tGqdupYe8KsCUwD9e2+CnZYswOwTpWF2
# 7psz0O/QIOwyaWfpk5kUlR6YICHXadaALNoYluoeICsmGLoKF/0PfD2D6qFdDXVX
# uoxvYhNaS0E=
# SIG # End signature block
