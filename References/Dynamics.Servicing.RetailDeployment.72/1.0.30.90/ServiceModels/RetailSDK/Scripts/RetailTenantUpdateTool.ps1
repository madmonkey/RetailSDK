<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

# Prerequisites:
# Microsoft Online Services Sign-In Assistant for IT Professionals, download link: http://go.microsoft.com/fwlink/?LinkID=286152
# Azure Active Directory Module for Windows PowerShell (64-bit version), download link: http://go.microsoft.com/fwlink/p/?linkid=236297
# This script is intended to patch the Retail component after running AdminUserProvisioning.exe.
# This script requires the administrator credential.

param
(
	[ValidateNotNullOrEmpty()]
    $DefaultRetailWorkerToMap = '000160',

	[ValidateNotNullOrEmpty()]
    $AxDbServer = 'localhost',

	[ValidateNotNullOrEmpty()]
    $AxDbName = 'AxDB',

	[ValidateNotNullOrEmpty()]
    $RetailChannelDbName = 'AxDB',

	[ValidateNotNullOrEmpty()]
	$RetailWebSiteName = 'RetailServer',

    [ValidateNotNullOrEmpty()]
	$RetailCloudPosWebSiteName = 'RetailCloudPos',

	[switch]
	$UseLegacyTenantResolution
)

function ExecuteSql(
	[string] $sqlServer = '(local)',
    [string] $database,
	[string] $sqlStatement)
{
	Write-Host "Running sql statement in server: $sqlServer, DB: $database, sqlStatement: $sqlStatement "
	try
	{
		Invoke-SqlCmd -ServerInstance $sqlServer -Database  $database -Query $sqlStatement -ErrorAction 'Stop'
	}
	catch
	{
		Write-Host  "$($_.Exception.Message)"
		Write-Error "Error while running a SQL command: $sqlServer, DB: $database, sqlStatement: $sqlStatement, error: $($_.Exception.Message) "
	}

	Write-Host "Finished running sql statement in server: $sqlServer, DB: $database, sqlStatement: $sqlStatement, retailReturnCode: $retailReturnCode, LASTEXITCODE: $LASTEXITCODE "
}

function Update-XmlObjAttributeValue([xml]$xml, [string]$xpath, [string]$attributeName, [string]$value)
{
    $node = $xml.SelectSingleNode($xpath);
    if($node -eq $null)
    {
        throw "The node at $xpath could not be found."
    }

    $node.SetAttribute($attributeName, $value);
}

function Get-UserTenantDetailsLegacy()
{
	Write-Host 'Checking prerequisites...'
	$command = Get-Command Connect-MsolService -ErrorAction Ignore
	if(!$command)
	{
		$Host.UI.WriteErrorLine('please download and install below prerequisites:')
		$Host.UI.WriteErrorLine('Microsoft Online Services Sign-In Assistant for IT Professionals, download link: http://go.microsoft.com/fwlink/?LinkID=286152')
		$Host.UI.WriteErrorLine('Azure Active Directory Module for Windows PowerShell (64-bit version), download link: http://go.microsoft.com/fwlink/p/?linkid=236297')
		pause
		exit 1
	}

	$credential = Get-Credential
	$UPN = $credential.UserName
	$AADTenantName = $UPN.ToLower().substring($UPN.indexOf('@') + 1)
	Write-Output $UPN

	Connect-MsolService -Credential $credential

	$company = Get-MsolCompanyInformation
	$AADTenantID = $company.ObjectId
	$AADUserID = ''

	Write-Host ("TenantID: {0}" -f $AADTenantID)

	$users = Get-MsolUser -SearchString "$($credential.username)"

	foreach($u in $users)
	{
		if($u.UserPrincipalName -eq $UPN)
		{
			$AADUserID = $u.ObjectId

			Write-Host "UserId: $($u.ObjectId); UserPrincipalName:$($u.UserPrincipalName);"
		}
	}

	if([string]::IsNullOrWhiteSpace($AADUserID))
	{
		$msg = "Cannot find the user id in this tenant: $UPN "
		Write-Host $msg
		throw $msg
	}

	return @{
		UPN = $UPN
		AADUserId = $AADUserId
		AADTenantID = $AADTenantID
		AADTenantName = $AADTenantName
	}
}

function Get-UserTenantWithAzureAD()
{
	if (!(Get-Module -ListAvailable -Name AzureAD)) {
		$Host.UI.WriteErrorLine('Please install the prerequisites:')
		$Host.UI.WriteErrorLine('AzureAD Powershell Module, documentation link: https://docs.microsoft.com/en-us/powershell/azure/active-directory/install-adv2?view=azureadps-2.0#installing-the-azure-ad-module')
		$Host.UI.WriteErrorLine('You can install AzureAD Powershell Module by opening a new Powershell Administrator Window and entering the following:')
		$Host.UI.WriteErrorLine('    Install-Module AzureAD')
		pause
		exit 1
	}

	Import-Module AzureAD

	Write-Host "Please log in with your Azure AD user name and password for the tenant you want to update this environment to."
	$connection = Connect-AzureAD

	if ($null -eq $connection)
	{
		throw "There was an error resolving your Azure AD connectivity. AzureAD returned an empty result. Please try again and make sure your user name and password are correct."
	}

	Write-Host "Resolving your user object id."
	$user = Get-AzureADUser -ObjectId $connection.Account.Id

	if ($null -eq $user)
	{
		throw "There was an error resolving your Azure AD user. AzureAD returned an empty result. Please try again and make sure your user name and password are correct."
	}

	return @{
		UPN = $connection.Account.Id
		AADUserId = $user.ObjectId
		AADTenantID = $connection.TenantId
		AADTenantName = $connection.TenantDomain
	}
}

try
{
	$details = $null

	if ($UseLegacyTenantResolution)
	{
		$details = Get-UserTenantDetailsLegacy
	}
	else
	{
		Write-Host "Using AzureAD module to resolve tenant details."
		$details = Get-UserTenantWithAzureAD
	}

	$UPN = $details.UPN
	$AADUserId = $details.AADUserId
	$AADTenantID = $details.AADTenantID
	$AADTenantName = $details.AADTenantName
	$alias = $UPN.Substring(0,$UPN.IndexOf('@'))

	Write-Host "Resolved the following parameters. UPN: $UPN - Alias: $alias - AAD User Object ID: $AADUserId - DirectoryID: $AADTenantID - DirectoryDomain: $AADTenantName"

	$AADStsHost = 'windows.net'
	$rtsUserSID = 'S-1-19-2668615710-2480941646-1684813103-2026890972-2302207704-2864208061-3273002221-3047239075-1510753007-4079435192'

	if($details.UPN -ilike '*.ccsctp.net')
	{
		$AADStsHost = 'windows-ppe.net'
		$rtsUserSID = 'S-1-19-2668615710-2480941646-1684813103-2026890972-2302207704-1598698826-400483830-1280886117-2147114868-3359996204'
	}

	$identityProvider = "https://sts.{0}/" -f $AADStsHost
    $azureauthority = "https://login.{0}/{1}" -f $AADStsHost,$AADTenantName

	# Update SQL Database
	$insertServicePrincipalToSYSSERVICECONFIGURATIONSETTING = "if not exists (select 1 from SYSSERVICECONFIGURATIONSETTING where [Name] = 'SERVICEPRINCIPAL') begin insert into SYSSERVICECONFIGURATIONSETTING([Value],[Name]) values('$AADServicePrincipalName','SERVICEPRINCIPAL') end "
	ExecuteSql -sqlServer $AxDbServer -database $AxDbName -sqlStatement  $insertServicePrincipalToSYSSERVICECONFIGURATIONSETTING

	$insertTenantIdToSYSSERVICECONFIGURATIONSETTING = "if not exists (select 1 from SYSSERVICECONFIGURATIONSETTING where [Name] = 'TENANTID') begin insert into SYSSERVICECONFIGURATIONSETTING([Value],[Name]) values('$AADTenantID','TENANTID') end "
	ExecuteSql -sqlServer $AxDbServer -database $AxDbName -sqlStatement $insertTenantIdToSYSSERVICECONFIGURATIONSETTING

	$updateTenantIdToSYSSERVICECONFIGURATIONSETTINGToAxDB = "UPDATE SYSSERVICECONFIGURATIONSETTING SET [Value] = '$AADTenantID' where [Name] = 'TENANTID'"
	ExecuteSql -sqlServer $AxDbServer -database $AxDbName -sqlStatement $updateTenantIdToSYSSERVICECONFIGURATIONSETTINGToAxDB

	$updateTenantIdToSYSSERVICECONFIGURATIONSETTINGToChannelDB = "UPDATE ax.SYSSERVICECONFIGURATIONSETTING SET [Value] = '$AADTenantID' where [Name] = 'TENANTID'"
	ExecuteSql -sqlServer $AxDbServer -database $RetailChannelDbName -sqlStatement $updateTenantIdToSYSSERVICECONFIGURATIONSETTINGToChannelDB

	$updateRETAILSTAFFTABLEClean = "UPDATE [dbo].[RETAILSTAFFTABLE] SET [EXTERNALIDENTITYID] = '',[EXTERNALIDENTITYSUBID] = ''  WHERE STAFFID = '$DefaultRetailWorkerToMap' "
	ExecuteSql -sqlServer $AxDbServer -database $AxDbName -sqlStatement $updateRETAILSTAFFTABLEClean

	$clearRETAILSTAFFTABLE = "UPDATE [dbo].[RETAILSTAFFTABLE] SET [EXTERNALIDENTITYID] = '',[EXTERNALIDENTITYSUBID] = '', EXTERNALIDENTITYNAME = '',EXTERNALIDENTITYALIAS = '' "
	ExecuteSql -sqlServer $AxDbServer -database $AxDbName -sqlStatement $clearRETAILSTAFFTABLE

	$updateRETAILSTAFFTABLE = "UPDATE [dbo].[RETAILSTAFFTABLE] SET [EXTERNALIDENTITYID] = '$AADTenantID',[EXTERNALIDENTITYSUBID] = '$AADUserID', EXTERNALIDENTITYNAME = '$UPN',EXTERNALIDENTITYALIAS = '$alias' WHERE STAFFID = '$DefaultRetailWorkerToMap' "
	ExecuteSql -sqlServer $AxDbServer -database $AxDbName -sqlStatement $updateRETAILSTAFFTABLE

	$updateRTSUserSID = "UPDATE USERINFO SET SID = '$rtsUserSID',NETWORKDOMAIN = '$identityprovider' WHERE NETWORKALIAS = 'RetailServerSystemAccount@dynamics.com' "
	ExecuteSql -sqlServer $AxDbServer -database $AxDbName -sqlStatement $updateRTSUserSID

	$updateRTSProfileInAxDB = "UPDATE RETAILTRANSACTIONSERVICEPROFILE set userid = 'RetailServerSystemAccount@dynamics.com',IDENTITYPROVIDER = '$identityprovider', AZUREAUTHORITY = '$azureauthority' "
	ExecuteSql -sqlServer $AxDbServer -database $AxDbName -sqlStatement $updateRTSProfileInAxDB

	$updateRTSProfileInChnDB = "UPDATE ax.RETAILTRANSACTIONSERVICEPROFILE set userid = 'RetailServerSystemAccount@dynamics.com', IDENTITYPROVIDER = '$identityprovider', AZUREAUTHORITY = '$azureauthority' "
	ExecuteSql -sqlServer $AxDbServer -database $RetailChannelDbName -sqlStatement $updateRTSProfileInChnDB

	$updateRetailIdentityProvider = "UPDATE RETAILIDENTITYPROVIDER SET ISSUER = '{0}{1}/' WHERE NAME = 'Azure AD' " -f $identityprovider,$AADTenantID
	ExecuteSql -sqlServer $AxDbServer -database $AxDbName -sqlStatement $updateRetailIdentityProvider

	$updateRetailIdentityProviderAx = "UPDATE ax.RETAILIDENTITYPROVIDER SET ISSUER = '{0}{1}/' WHERE NAME = 'Azure AD' " -f $identityprovider,$AADTenantID
	ExecuteSql -sqlServer $AxDbServer -database $RetailChannelDbName -sqlStatement $updateRetailIdentityProviderAx

	$updateRetailSharedParameters = "UPDATE RETAILSHAREDPARAMETERS SET TENANTID = '$AADTenantID' "
	ExecuteSql -sqlServer $AxDbServer -database $AxDbName -sqlStatement $updateRetailSharedParameters

    # Update RetailServer web.config
	$retailServerWebSite = Get-WebSite -Name $RetailWebSiteName
	$retailServerWebPath = [System.Environment]::ExpandEnvironmentVariables($retailServerWebSite.physicalPath)
	$retailServerWebConfigPath = (Join-Path $retailServerWebPath 'web.config')
	[xml] $retailServerWebConfigDoc = Get-Content $retailServerWebConfigPath
	if ($AADTenantID -and $retailServerWebConfigDoc.configuration.environment.tenant.id)
	{
		$retailServerWebConfigDoc.configuration.environment.tenant.id = $AADTenantID.ToString()
	}

	Update-XmlObjAttributeValue -xml $retailServerWebConfigDoc -xpath "//configuration/appSettings/add[@key='AADTokenIssuerPrefix']" -attributeName 'value' -value $identityProvider
    Update-XmlObjAttributeValue -xml $retailServerWebConfigDoc -xpath "//configuration/appSettings/add[@key='FederationMetadataAddress']" -attributeName 'value' -value "https://login.$AADStsHost/common/FederationMetadata/2007-06/FederationMetadata.xml"

    # <deviceActivation allowedIdentityProviders="https://sts.windows.net, https://commerce.dynamics.com/auth" />
    Update-XmlObjAttributeValue -xml $retailServerWebConfigDoc -xpath '//configuration/retailServer/deviceActivation' -attributeName 'allowedIdentityProviders' -value "https://sts.$AADStsHost, https://commerce.dynamics.com/auth"

	$retailServerWebConfigDoc.Save($retailServerWebConfigPath)

	# Update CommerceRuntime.config
	$commerceConfigPath = (Join-Path $retailServerWebPath '\bin\CommerceRuntime.config')
	[xml] $commerceConfigDoc = Get-Content $commerceConfigPath

	Update-XmlObjAttributeValue -xml $commerceConfigDoc -xpath "//commerceRuntime/realtimeService/settings/add[@key='identityProvider']" -attributeName 'value' -value $identityProvider
	Update-XmlObjAttributeValue -xml $commerceConfigDoc -xpath "//commerceRuntime/realtimeService/settings/add[@key='azureAuthority']" -attributeName 'value' -value ("https://login.{0}/{1}" -f $AADStsHost,$AADTenantName)

	$commerceConfigDoc.Save($commerceConfigPath)

    # Update RetailCloudPos config.json
    $retailCloudPosWebSite = Get-WebSite -Name $RetailCloudPosWebSiteName
	$retailCloudPosPath = [System.Environment]::ExpandEnvironmentVariables($retailCloudPosWebSite.physicalPath)
	$retailCloudPosConfigPath = (Join-Path $retailCloudPosPath 'config.json')

    $jsonConfig = Get-Content $retailCloudPosConfigPath -Raw | ConvertFrom-Json
    $jsonConfig.AADLoginUrl = "https://login.$AADStsHost"

    $jsonConfig | ConvertTo-Json | Out-File $retailCloudPosConfigPath -Force

	Write-Host "Restart iis to refresh configurations."
	IISRESET

	Write-Host "Please run CDX full sync to make sure all the changes will take effect."
	Start-Sleep -s 5
}
catch
{
	Write-Host 'Error when running RetailTenantUpdateTool'
	Write-Host ($global:error[0] | format-list * -f | Out-String)
	pause
	exit 1
}
# SIG # Begin signature block
# MIIkDwYJKoZIhvcNAQcCoIIkADCCI/wCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDRHcWM1HFYrT8Z
# 9OfqiR/lUU4V9IriYTA1JZMnTPDT+qCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# cVZOSEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFeAwghXcAgEBMIGVMH4x
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01p
# Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAAGIr1LWuZJt6PkAAAAA
# AYgwDQYJYIZIAWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEE
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCA/
# P812ByuwZK4+orRTardiKzDRDNjFpZQUpq3wxzvoATCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQA2
# Dcvo79GHAIv0gGIeVRJTBN4DRj4B5TH3Xo8+XA1K/e6dicmSw2CXmdkJt/8hY0VQ
# Vb5JRHQQ72pHIPP6bujFCPg7bdYvkPZvg9Nf59FL5kTspxec1zjLwpc5NtedkrRy
# 2zUHRXtF2ZkEopwnnLHCpGvRak4ncshmvmtGf3+/PwzU0ia4N2nDFKhAaQDagGJ8
# lNP7t8q2NOJDkMhVhC+DieiC0Yg/bxkXG0cuoQ7U6/nDqde/9KLIKb8Is3TwgPxN
# eOc3xHzmorWtW9haehCX2ke+O4Z/bu+bxq/szQftMlVy4DyOFICUSi99A1HSyzKe
# 5fmvorHZhUw3Hhsi7uAAoYIS8DCCEuwGCisGAQQBgjcDAwExghLcMIIS2AYJKoZI
# hvcNAQcCoIISyTCCEsUCAQMxDzANBglghkgBZQMEAgEFADCCAVQGCyqGSIb3DQEJ
# EAEEoIIBQwSCAT8wggE7AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IALr8oBMMN3KHEBgLEblPpQgCPqaOIliJUctHX8ijsmmAgZfO+TbzigYEjIwMjAw
# ODIzMDQwMjUxLjMxWjAEgAIB9KCB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNV
# BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
# c29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMg
# UHVlcnRvIFJpY28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkY3QTYtRTI1MS0x
# NTBBMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIORDCC
# BPUwggPdoAMCAQICEzMAAAEli96LbHImMd0AAAAAASUwDQYJKoZIhvcNAQELBQAw
# fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1Jl
# ZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMd
# TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMjE5MDExNDU4WhcN
# MjEwMzE3MDExNDU4WjCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
# b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
# dGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28x
# JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkY3QTYtRTI1MS0xNTBBMSUwIwYDVQQD
# ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEF
# AAOCAQ8AMIIBCgKCAQEA0HsfY3ZgW+zhycEmJjFKK2TcAHL/Fct+k5Sbs3Fcexvp
# Rards41jjJUjjJJtV6ALifFWeUoQXnQA1wxgysRzWYS7txFvMeaLfyDpOosy05QB
# bbyFzoM17Px2jjO9lxyspDGRwHS/36WbQEjOT2pZrF1+DpfJV5JvY0eeSuegu6vf
# oQ1PtrYxh2hNWVpWm5TVFwYWmYLQiQnetFMmb4CO/7jc3Gn49P1cNm2orfZwwFXd
# uMrf1wmZx2N8l+2bB4yLh6bJfj6Q12otQ8HvadK8gmbJfUjjB3sbSB3vapU27VmC
# fFrVi6B/XRDEMVS55jzwzlZgY+y2YUo4t/DfVac/xQIDAQABo4IBGzCCARcwHQYD
# VR0OBBYEFPOqyuUHJvkBOTQVxgjyIggXQyT4MB8GA1UdIwQYMBaAFNVjOlyKMZDz
# Q3t8RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9z
# b2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAx
# LmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWlj
# cm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3J0
# MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQEL
# BQADggEBAJMcWTxhICIAIbKmTU2ZOfFdb0IieY2tsR5eU6hgOh8I+UoqC4NxUi4k
# 5hlfgbRZaWFLZJ3geI62bLjaTLX20zHRu6f8QMiFbcL15016ipQg9U/S3K/eKVXn
# cxxicy9U2DUMmSQaLgn85IJM3HDrhTn3lj35zE4iOVAVuTnZqMhz0Fg0hh6G6FtX
# Uyql3ibblQ02Gx0yrOM43wgTBY5spUbudmaYs/vTAXkY+IgHqLtBf98byM3qaCCo
# FFgmfZplYlhJFcArUxm1fHiu9ynhBNLXzFP2GNlJqBj3PGMG7qwxH3pXoC1vmB5H
# 63BgBpX7QpqrTnTi3oIS6BtFG8fwe7EwggZxMIIEWaADAgECAgphCYEqAAAAAAAC
# MA0GCSqGSIb3DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
# Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
# cmF0aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRo
# b3JpdHkgMjAxMDAeFw0xMDA3MDEyMTM2NTVaFw0yNTA3MDEyMTQ2NTVaMHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
# MIIBCgKCAQEAqR0NvHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvtfGhLLF/Fw+Vh
# wna3PmYrW/AVUycEMR9BGxqVHc4JE458YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs
# 1nMwVyaCo0UN0Or1R4HNvyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLBxKZd0WET
# bijGGvmGgLvfYfxGwScdJGcSchohiq9LZIlQYrFd/XcfPfBXday9ikJNQFHRD5wG
# Pmd/9WbAA5ZEfu/QS/1u5ZrKsajyeioKMfDaTgaRtogINeh4HLDpmc085y9Euqf0
# 3GS9pAHBIAmTeM38vMDJRF1eFpwBBU8iTQIDAQABo4IB5jCCAeIwEAYJKwYBBAGC
# NxUBBAMCAQAwHQYDVR0OBBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQB
# gjcUAgQMHgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/
# MB8GA1UdIwQYMBaAFNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJ
# oEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01p
# Y1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYB
# BQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljUm9v
# Q2VyQXV0XzIwMTAtMDYtMjMuY3J0MIGgBgNVHSABAf8EgZUwgZIwgY8GCSsGAQQB
# gjcuAzCBgTA9BggrBgEFBQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL1BL
# SS9kb2NzL0NQUy9kZWZhdWx0Lmh0bTBABggrBgEFBQcCAjA0HjIgHQBMAGUAZwBh
# AGwAXwBQAG8AbABpAGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkqhkiG
# 9w0BAQsFAAOCAgEAB+aIUQ3ixuCYP4FxAz2do6Ehb7Prpsz1Mb7PBeKp/vpXbRkw
# s8LFZslq3/Xn8Hi9x6ieJeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/
# XPleFzWYJFZLdO9CEMivv3/Gf/I3fVo/HPKZeUqRUgCvOA8X9S95gWXZqbVr5MfO
# 9sp6AG9LMEQkIjzP7QOllo9ZKby2/QThcJ8ySif9Va8v/rbljjO7Yl+a21dA6fHO
# mWaQjP9qYn/dxUoLkSbiOewZSnFjnXshbcOco6I8+n99lmqQeKZt0uGc+R38ONiU
# 9MalCpaGpL2eGq4EQoO4tYCbIjggtSXlZOz39L9+Y1klD3ouOVd2onGqBooPiRa6
# YacRy5rYDkeagMXQzafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA3+cxB6STOvdl
# R3jo+KhIq/fecn5ha293qYHLpwmsObvsxsvYgrRyzR30uIUBHoD7G4kqVDmyW9rI
# DVWZeodzOwjmmC3qjeAzLhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8ZQU3ghvkq
# mqMRZjDTu3QyS99je/WZii8bxyGvWbWu3EQ8l1Bx16HSxVXjad5XwdHeMMD9zOZN
# +w2/XU/pnR4ZOC+8z1gFLu8NoFA12u8JJxzVs341Hgi62jbb01+P3nSISRKhggLS
# MIICOwIBATCB/KGB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJp
# Y28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkY3QTYtRTI1MS0xNTBBMSUwIwYD
# VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoD
# FQBF0y/hUG3NhvtzF17yESla9qFwp6CBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwMA0GCSqGSIb3DQEBBQUAAgUA4uxR+jAiGA8yMDIwMDgyMzA2
# MjQ1OFoYDzIwMjAwODI0MDYyNDU4WjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi
# 7FH6AgEAMAoCAQACAhz5AgH/MAcCAQACAhGaMAoCBQDi7aN6AgEAMDYGCisGAQQB
# hFkKBAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAw
# DQYJKoZIhvcNAQEFBQADgYEAlPBVSFtvb1MzgQng4F75vOou9Ph8mZSD9ZxFuon7
# l7gJNbTYGKf4HHGk+MbZZHb2AS67vdSfKOKNsg2wBl438y/3O5nx1DIWRLXGIAxD
# HDC+xIqwAq5U4qnGOjoIr7jQgnfTaWlPrp/MLZAKNvITPKXGi8peObwvXQabSGej
# S0cxggMNMIIDCQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
# Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
# cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAIT
# MwAAASWL3otsciYx3QAAAAABJTANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcN
# AQkDMQ0GCyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCAQk6R8Dc5q32VE4s6M
# gAfAuimxfN/DBLai8TMeP6xiIzCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0E
# IF3fxrIubzBf+ol9gg4flX5i+Ub6mhZBcJboso3vQfcOMIGYMIGApH4wfDELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEli96LbHImMd0AAAAAASUwIgQg
# XIwCe/59RyOZZIAarasvJyuldVtYIxgQmQusA5j9WcswDQYJKoZIhvcNAQELBQAE
# ggEAc67XHkwUYB258s82n3iS0lFscrUS23dnGpTRiqzvXAD0MsXi02PHlnHvsoZp
# NQJtu4O2/n8nWTo82nibs8O0he299s35UzxKRPlrmeJUJ5YHyqFpmDkmh+yqbGoa
# uYVKoOQByS2wsKwKq7aqBakFWAyysC959RnsQUeHWZBJgP5Fia0HjyI0snjYEDvk
# qvOOLxrpsP2An38s4W2CKUuhbgC6nRPIzfPOC7qPPUB6u9cofnyyAAcNFfZpbS4M
# UaN1Z1VbR+MeF9wgb9O2CMjEI2DYzB2LhlsSej4Sw/wrTuKuwxU+kobGLNoZUcG2
# PoT/KMvAp4ad0dQS4RQyMFioUQ==
# SIG # End signature block
