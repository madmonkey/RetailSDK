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

    # <deviceActivation allowedIdentityProviders="https://sts.windows-ppe.net, https://commerce.dynamics.com/auth" />
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
# MIIjngYJKoZIhvcNAQcCoIIjjzCCI4sCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAt2iYL+VTzxmn3
# fQfJnPXeoptXCvtduQG9Hppt20ZZmKCCDYEwggX/MIID56ADAgECAhMzAAABh3IX
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
# RcBCyZt2WwqASGv9eZ/BvW1taslScxMNelDNMYIVczCCFW8CAQEwgZUwfjELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9z
# b2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAxMQITMwAAAYdyF3IVWUDHCQAAAAABhzAN
# BglghkgBZQMEAgEFAKCBxjAZBgkqhkiG9w0BCQMxDAYKKwYBBAGCNwIBBDAcBgor
# BgEEAYI3AgELMQ4wDAYKKwYBBAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQg8jbu21vv
# hCGbae3+HOcTKfbECA0nCCOWxkc3mMWkrW4wWgYKKwYBBAGCNwIBDDFMMEqgLIAq
# AFYAYQBsAGkAZABhAHQAZQBSAGUAdABhAGkAbABTAEQASwAuAHAAcwAxoRqAGGh0
# dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBT44B+fxA2
# qnpu8IlWgvEiGmQnpOSoYyPpXuufkbauyLPQz/vRpcbd6Fxe5wFJZ9YbAEvsTr2z
# zeT/J7xnx+wpsfdNa9/0ZqYdZNy6dTZXmkTifdK4jbb23aJLpmEElArP7eVUlOzd
# 5V6aMJM3/QBSadV5H4lRXDTSUXuBPd/jd/Zbra7PuyU5ajDPgJlAgdyDJ03K0uam
# cVRkIE912HDBdreZoqhF/eLfx+HB+xPpS7zlepSwktRdRwxYgoSfa4aDCAeCL007
# 2qZueVNmlUuumph32przjUoxvPfUnqCtP3krf/VWyZSuBvLO3p8CstBZt6gV3jAc
# ZU6PmofxBsn/oYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZIhvcNAQcC
# oIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJEAEEoIIB
# QASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAEIMOKSONc
# 2qBfvFQMdF1ZoS7u0YV87Ygi/mDX8RVBoEAPAgZfPVxFCoAYEzIwMjAwODIzMDIz
# OTMxLjUyM1owBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJX
# QTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
# aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25zIExpbWl0
# ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkZDNDEtNEJENC1EMjIwMSUwIwYD
# VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOPDCCBPEwggPZoAMC
# AQICEzMAAAESJHOjNYZpEw8AAAAAARIwDQYJKoZIhvcNAQELBQAwfDELMAkGA1UE
# BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
# BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
# IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTIxWhcNMjEwMTIxMjMx
# OTIxWjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNVBAsTJE1p
# Y3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UECxMdVGhh
# bGVzIFRTUyBFU046RkM0MS00QkQ0LUQyMjAxJTAjBgNVBAMTHE1pY3Jvc29mdCBU
# aW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
# AQC7qpkVNy9QRHdwpRC0gj59zrmITeD+fM4UFZeWGrSdq2sSFiIVtqfrIHaDreib
# RBsw04V4wcmpgabdlF+8GBNg4RZ+aPIpK2k25QpMGYVJLFSSsbEOOBWSHIqQYfxx
# ybS0Ltun3qGdBqJsfdhlfMq+L4E3aAlyxEwfk9qDZuHUV3y9EyUwfHLDhsEpZbCk
# pNIbjRvFsa7wJd6woZEBBd1pJe7myYmrKMlzeXhv0k3GwjvtvTl+0TCdTgjCpYpo
# tp+BANqpUH2ScWZpWeue8FL7aIDditVueTGWXnUKvceE9PAvQiUJsqbKflXMpL5M
# IHtJST56axWt5apNwyP+rx4JAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU0jpwHwtM
# SWArKrTCMswGxnZlW10wHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8UzaFqFbVUw
# VgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9j
# cmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoGCCsGAQUF
# BwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
# aS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0TAQH/BAIw
# ADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEAOREvr5Gv
# 0gr1Y0WWJy7PoZC5lfdhA5vnnYv7/xAs2WuV/dUBF1EvE/2pz61Ey6LpjTofrExP
# 5ZKHCatVW0tNQREj4a+Rz2FnPv+gx+VRVl7WwPaZXdIiXwhmUKvcot5dcaUVUQVx
# xgBzcnTLc/9nCE//E6oZw8QrMPCtrioq6EiIExeTkTubO7YsvTz3dmBdDfc/gIFt
# fHp7TFajgS/fy2I6tdMratQCed05LJg5oSIWYvFs0xawxi6aoMN1FqnC21xAIRAE
# mODN09V/0xrrpqkqIp8OU/3zuLQK+BRmbp8rSAP+2BOAHbRq00kaGobd5qt30fFs
# PaqG6bwn2L1H4DCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZIhvcNAQEL
# BQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xMjAwBgNV
# BAMTKU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eSAyMDEwMB4X
# DTEwMDcwMTIxMzY1NVoXDTI1MDcwMTIxNDY1NVowfDELMAkGA1UEBhMCVVMxEzAR
# BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
# Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3Rh
# bXAgUENBIDIwMTAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCpHQ28
# dxGKOiDs/BOX9fp/aZRrdFQQ1aUKAIKF++18aEssX8XD5WHCdrc+Zitb8BVTJwQx
# H0EbGpUdzgkTjnxhMFmxMEQP8WCIhFRDDNdNuDgIs0Ldk6zWczBXJoKjRQ3Q6vVH
# gc2/JGAyWGBG8lhHhjKEHnRhZ5FfgVSxz5NMksHEpl3RYRNuKMYa+YaAu99h/EbB
# Jx0kZxJyGiGKr0tkiVBisV39dx898Fd1rL2KQk1AUdEPnAY+Z3/1ZsADlkR+79BL
# /W7lmsqxqPJ6Kgox8NpOBpG2iAg16HgcsOmZzTznL0S6p/TcZL2kAcEgCZN4zfy8
# wMlEXV4WnAEFTyJNAgMBAAGjggHmMIIB4jAQBgkrBgEEAYI3FQEEAwIBADAdBgNV
# HQ4EFgQU1WM6XIoxkPNDe3xGG8UzaFqFbVUwGQYJKwYBBAGCNxQCBAweCgBTAHUA
# YgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHwYDVR0jBBgwFoAU
# 1fZWy4/oolxiaNE9lJBb186aGMQwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2Ny
# bC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWljUm9vQ2VyQXV0XzIw
# MTAtMDYtMjMuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDov
# L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNSb29DZXJBdXRfMjAxMC0w
# Ni0yMy5jcnQwgaAGA1UdIAEB/wSBlTCBkjCBjwYJKwYBBAGCNy4DMIGBMD0GCCsG
# AQUFBwIBFjFodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vUEtJL2RvY3MvQ1BTL2Rl
# ZmF1bHQuaHRtMEAGCCsGAQUFBwICMDQeMiAdAEwAZQBnAGEAbABfAFAAbwBsAGkA
# YwB5AF8AUwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3DQEBCwUAA4ICAQAH
# 5ohRDeLG4Jg/gXEDPZ2joSFvs+umzPUxvs8F4qn++ldtGTCzwsVmyWrf9efweL3H
# qJ4l4/m87WtUVwgrUYJEEvu5U4zM9GASinbMQEBBm9xcF/9c+V4XNZgkVkt070IQ
# yK+/f8Z/8jd9Wj8c8pl5SpFSAK84Dxf1L3mBZdmptWvkx872ynoAb0swRCQiPM/t
# A6WWj1kpvLb9BOFwnzJKJ/1Vry/+tuWOM7tiX5rbV0Dp8c6ZZpCM/2pif93FSguR
# JuI57BlKcWOdeyFtw5yjojz6f32WapB4pm3S4Zz5Hfw42JT0xqUKloakvZ4argRC
# g7i1gJsiOCC1JeVk7Pf0v35jWSUPei45V3aicaoGig+JFrphpxHLmtgOR5qAxdDN
# p9DvfYPw4TtxCd9ddJgiCGHasFAeb73x4QDf5zEHpJM692VHeOj4qEir995yfmFr
# b3epgcunCaw5u+zGy9iCtHLNHfS4hQEegPsbiSpUObJb2sgNVZl6h3M7COaYLeqN
# 4DMuEin1wC9UJyH3yKxO2ii4sanblrKnQqLJzxlBTeCG+SqaoxFmMNO7dDJL32N7
# 9ZmKLxvHIa9Zta7cRDyXUHHXodLFVeNp3lfB0d4wwP3M5k37Db9dT+mdHhk4L7zP
# WAUu7w2gUDXa7wknHNWzfjUeCLraNtvTX4/edIhJEqGCAs4wggI3AgEBMIH4oYHQ
# pIHNMIHKMQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsGA1UECxMkTWlj
# cm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQLEx1UaGFs
# ZXMgVFNTIEVTTjpGQzQxLTRCRDQtRDIyMDElMCMGA1UEAxMcTWljcm9zb2Z0IFRp
# bWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAEuAr1oQqvtDynteleDjF
# zDMCiryggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
# bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
# aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDANBgkq
# hkiG9w0BAQUFAAIFAOLrzykwIhgPMjAyMDA4MjMwMTA2NDlaGA8yMDIwMDgyNDAx
# MDY0OVowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA4uvPKQIBADAKAgEAAgIfMwIB
# /zAHAgEAAgIRjzAKAgUA4u0gqQIBADA2BgorBgEEAYRZCgQCMSgwJjAMBgorBgEE
# AYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEBBQUAA4GB
# ACIxEtpHMLKGtGy4ayMjUAjZa08GK6mub5QVJAGkg7Pfwm7rrjTGiHykHYw0ZYgK
# nHHoqvk8OfubQBuKehBG+gVAWu9o88UChwRPLmKgEyGYESQW+otQ2SQO4YllGBqX
# 2rnLDYWrM/67lkLxaOr7NlnUmeUH+xT60S4dF2Tu4qaLMYIDDTCCAwkCAQEwgZMw
# fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1Jl
# ZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMd
# TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAESJHOjNYZpEw8AAAAA
# ARIwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG9w0BCRAB
# BDAvBgkqhkiG9w0BCQQxIgQgaEwCWmx7b/sQ0PhrLx8x1iyJq9lCNBSiQQy1Uc2g
# Pn4wgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCAkErCCv+giGoqpOcgpeGLY
# pPsnfskYMI+DETR1lzqWUzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
# EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
# ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBD
# QSAyMDEwAhMzAAABEiRzozWGaRMPAAAAAAESMCIEIIPsPJ1Ph3ucrhsx6ysYf/NG
# bUI4EY8DaTxh143FJO9UMA0GCSqGSIb3DQEBCwUABIIBAGzjoI2fBrMAFSJ4qKG8
# Owm0tf9tSbs1MnPdox/j/45pgh0A7YkWdaLn6x/OC8m0B4OoSJ5vjXSdOoUdbVpG
# mtFM2pNO1I7ZI5+mIk5VTTApHfqnCaMvHapV4Yc8HrNiTbELJ7SWcCKq51QmlrpP
# 4S8woWyk5h6xu3uozms8BGlIcm/bSGuDO3wnlsBWUVaTLsLb22ND3hGyXTgnvvqG
# nEW4crnBEGboVz7IR6eVQpWLXGzUYR/VlwwvAS31BWPsPQiGJS5uVhrhHYYUswYi
# FficTgpVK3TxlBq+5HIFp8iL8/OPXt2Hg+pta7TNIAmp9s8svQg5NpEn1BpauMpZ
# Ezg=
# SIG # End signature block
