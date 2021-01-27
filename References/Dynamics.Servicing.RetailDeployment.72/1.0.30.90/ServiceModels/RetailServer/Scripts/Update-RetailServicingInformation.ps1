<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$RetailChannelDbServerName,
    [Parameter(Mandatory=$true)]
    [string]$RetailChannelDbName,
    
    [PSCredential]$AxDeployUserCredential = (Get-Credential -UserName "axdeployuser" -Message "Enter credentials for axdeployuser"),
    
    [PSCredential]$AxDeployextUserCredential = (Get-Credential -UserName "axdeployextuser" -Message "Enter credentials for axdeployextuser"),
    
    [ValidateNotNullOrEmpty()]
    [string]$AosWebsiteName = 'AOSService',
    [ValidateNotNullOrEmpty()]
    [string]$RetailServerWebsiteName = 'RetailServer',
    [ValidateNotNullOrEmpty()]
    [string]$RetailCloudPosWebsiteName = 'RetailCloudPos',
    [ValidateNotNullOrEmpty()]
    [string]$RetailStorefrontWebsiteName = 'RetailStorefront'
)

Import-Module WebAdministration

$AXConfigEncryptorPath = "bin\Microsoft.Dynamics.AX.Framework.ConfigEncryptor.exe"

function Set-UseDatabaseCredentialInWebConfigForUpgrade
{
    $targetRegistryKeyPath = "HKLM:\SOFTWARE\Microsoft\Dynamics\7.0\RetailChannelDatabase"
    if(-not (Test-Path -Path $targetRegistryKeyPath))
    {
        New-Item -Path $targetRegistryKeyPath -ItemType Directory -Force | Out-Null
    }
    New-ItemProperty -Path $targetRegistryKeyPath -Name 'UseDatabaseCredentialInWebConfigForUpgrade' -Value 'true' -Force | Out-Null
}

function Invoke-AxConfigEncryptorUtility(
    [ValidateNotNullOrEmpty()]
    [string]$AxEncryptionToolPath,
    [ValidateNotNullOrEmpty()]
    [string]$WebConfigPath,
    [ValidateNotNullOrEmpty()]
    [ValidateSet("Encrypt","Decrypt")]
    [string]$Operation
    )
{
    if(-not (Test-Path $AxEncryptionToolPath))
    {
        throw "$AxEncryptionToolPath is not found."
    }
    if(-not (Test-Path $WebConfigPath))
    {
        throw "$WebConfigPath is not found."
    }
    $Global:LASTEXITCODE = 0
    switch($Operation)
    {
        'Encrypt' { & $AxEncryptionToolPath -encrypt $webConfigPath }
        'Decrypt' { & $AxEncryptionToolPath -decrypt $webConfigPath }
    }
    $exitCode = $Global:LASTEXITCODE

    if($exitCode -eq 0)
    {
        Write-Host "$AxEncryptionToolPath completed successfully."
    }
    else
    {
        Write-Warning "$AxEncryptionToolPath failed with exit code: $exitCode"
    }
}

function Update-ChannelDatabaseServicingInformation(
    [ValidateNotNullOrEmpty()]
    [string]$WebConfigPath,
    [ValidateNotNullOrEmpty()]
    [string]$AosWebsiteName,
    [ValidateNotNullOrEmpty()]
    [string]$DbServer,
    [ValidateNotNullOrEmpty()]
    [string]$DbName,
    [ValidateNotNullOrEmpty()]
    [string]$DeployUser,
    [ValidateNotNullOrEmpty()]
    [string]$DeployUserPassword,
    [ValidateNotNullOrEmpty()]
    [string]$DeployExtUser,
    [ValidateNotNullOrEmpty()]
    [string]$DeployExtUserPassword)
{
    [xml]$targetConfigXml = Get-Content $webConfigPath
    $DataEncryptionCertificateThumbprint = $targetConfigXml.configuration.retailServer.cryptography.certificateThumbprint
    
    if($DataEncryptionCertificateThumbprint -eq $null)
    {
        throw 'cannot find data encryption certificate thumbprint from configuration.retailServer.cryptography.certificateThumbprint in RetailServer web.config.'
    }
    
    $appSettings = @{
        'DataAccess.DataEncryptionCertificateThumbprint' = $DataEncryptionCertificateThumbprint
        'DataAccess.DataSigningCertificateThumbprint' = $DataEncryptionCertificateThumbprint
        'CertificateHandler.HandlerType' = 'Microsoft.Dynamics.AX.Configuration.CertificateHandler.LocalStoreCertificateHandler'
        'DataAccess.encryption' = 'true'
        'DataAccess.disableDBServerCertificateValidation' = 'false'
        'DataAccess.Database' = $dbName
        'DataAccess.DbServer' = $dbServer
        'DataAccess.SqlUser' = $deployExtUser
        'DataAccess.SqlPwd' = $deployExtUserPassword
        'DataAccess.AxAdminSqlUser' = $deployUser
        'DataAccess.AxAdminSqlPwd' = $deployUserPassword
    }
    
    foreach ($setting in $appSettings.GetEnumerator()) 
    {
        # Only add a new element if one doesn't already exist.
        if($setting.Value)
        {
            $configElement = $targetConfigXml.configuration.appSettings.add | ?{ $_.key -eq $setting.Name }
            if ($configElement -eq $null)
            {
                $configElement = $targetConfigXml.CreateElement('add')
                $xmlKeyAtt = $targetConfigXml.CreateAttribute("key")
                $xmlKeyAtt.Value = $setting.Name
                $configElement.Attributes.Append($xmlKeyAtt) | Out-Null
                $xmlValueAtt = $targetConfigXml.CreateAttribute("value")
                $xmlValueAtt.Value = $setting.Value
                $configElement.Attributes.Append($xmlValueAtt) | Out-Null
                $targetConfigXml.configuration.appSettings.AppendChild($configElement) | Out-Null
            }
            else
            {
                $configElement.value = $setting.Value
            }
        }
    }

    $targetConfigXml.Save($webConfigPath)
}

Write-Host "Validating parameters."
Write-Host "Validating database credentials."
if(($AxDeployUserCredential -eq $null) -or ($AxdeployextUserCredential -eq $null))
{
    Write-Warning "Credentials for axdeployuser and axdeployextuser cannot be null."
    throw "Credentials for axdeployuser and axdeployextuser cannot be null."
}

$axdeployuserUsername = $AxDeployUserCredential.UserName
$axdeployuserPassword = $AxDeployUserCredential.Password
$axdeployuserBSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($axdeployuserPassword)
$axdeployuserPlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($axdeployuserBSTR)

$axdeployextuserUsername = $AxdeployextUserCredential.UserName
$axdeployextuserPassword = $AxdeployextUserCredential.Password
$axdeployextuserBSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($axdeployextuserPassword)
$axdeployextuserPlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($axdeployextuserBSTR)

if([String]::IsNullOrWhiteSpace($axdeployuserUsername) -or [String]::IsNullOrWhiteSpace($axdeployuserPlainPassword) `
    -or [String]::IsNullOrWhiteSpace($axdeployextuserUsername) -or [String]::IsNullOrWhiteSpace($axdeployextuserPlainPassword) )
{
    Write-Warning "You must provide username and password for axdeployuser and axdeployextuser."
    throw "You must provide username and password for axdeployuser and axdeployextuser."
}

Write-Host "Validation is done for database credentials."

Write-Host "Validating state of the environment."

Write-Host "Validating RetailServer website."
$retailServerWebsite = Get-Website -Name $RetailServerWebsiteName

if($retailServerWebsite -eq $null)
{
    Write-Warning "Cannot find retail server website with name $RetailServerWebsiteName"
    throw "Cannot find retail server website with name $RetailServerWebsiteName"
}

$retailServerWebConfigFilePath = Join-Path $retailServerWebsite.physicalPath 'web.config'

if(-not(Test-Path -Path $retailServerWebConfigFilePath))
{
    Write-Warning "Cannot find retail server web.config with path $retailServerWebConfigFilePath"
    throw "Cannot find retail server web.config with path $retailServerWebConfigFilePath"
}

if((Get-ItemProperty $retailServerWebConfigFilePath -Name IsReadOnly).IsReadOnly)
{
    throw "$retailServerWebConfigFilePath is set to read only, please update the file attribute and retry."
}

Write-Host "Validation is done for RetailServer website."

Write-Host "Validating AOS website."
$aosWebsite = Get-Website -Name $AosWebsiteName

if($aosWebsite -eq $null)
{
    Write-Warning "Cannot find AOS website with name $AosWebsiteName"
    throw "Cannot find AOS website with name $AosWebsiteName"
}

$aosWebPath = $aosWebsite.physicalPath
$axConfigEncryptorUtilityPath = Join-Path $aosWebPath $AXConfigEncryptorPath
if(-not (Test-Path $axConfigEncryptorUtilityPath))
{
    throw "$axConfigEncryptorUtilityPath is not found."
}

Write-Host "Validation is done for AOS website."

# Backup Retail Server web.config first
Write-Host "Backup RetailServer website."
$dateString = Get-Date -format 'yyyy-MM-dd-HH-mm-ss'
$backupFolder = Join-Path (Split-Path $retailServerWebsite.physicalPath) "Backup_$dateString"
Copy-Item -Path $retailServerWebsite.physicalPath -Destination $backupFolder -Recurse

try
{
    Write-Host "Decrypt RetailServer web.config"
    Invoke-AxConfigEncryptorUtility -AxEncryptionToolPath $axConfigEncryptorUtilityPath -WebConfigPath $retailServerWebConfigFilePath -Operation 'Decrypt'

    Write-Host "Updating servicing information."
    Update-ChannelDatabaseServicingInformation -WebConfigPath $retailServerWebConfigFilePath `
                                         -AosWebsiteName $AosWebsiteName `
                                         -DbServer $RetailChannelDbServerName `
                                         -DbName $RetailChannelDbName `
                                         -DeployUser $axdeployuserUsername `
                                         -DeployUserPassword $axdeployuserPlainPassword `
                                         -DeployExtUser $axdeployextuserUsername `
                                         -DeployExtUserPassword $axdeployextuserPlainPassword
                                         
    Set-UseDatabaseCredentialInWebConfigForUpgrade
    Write-Host "Retail servicing information has been updated successfully."
}
catch
{
    $message = ($global:error[0] | format-list * -f | Out-String)
    Write-Host $message
    throw $_
}
finally
{
    Invoke-AxConfigEncryptorUtility -AxEncryptionToolPath $axConfigEncryptorUtilityPath -WebConfigPath $retailServerWebConfigFilePath -Operation 'Encrypt'
}
# SIG # Begin signature block
# MIIkDAYJKoZIhvcNAQcCoIIj/TCCI/kCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAEkwzF7xJB/L85
# TOnExsR/6rv0kVNQe8h30ACoLWl4QqCCDYEwggX/MIID56ADAgECAhMzAAABh3IX
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
# KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIGGdlmQE
# LIM1iH8aBpPtZG3HwU1xZ59XnaF0pu7gdUDbMIG6BgorBgEEAYI3AgEMMYGrMIGo
# oIGJgIGGAFMAaQBtAHAAbABpAGYAeQBDAG8AbQBtAGUAcgBjAGUALgBNAGkAYwBy
# AG8AcwBvAGYAdABEAHkAbgBhAG0AaQBjAHMALgBDAG8AbgBuAGUAYwB0AG8AcgAu
# AFAAbwByAHQAYQBiAGwAZQAuAHIAZQBzAG8AdQByAGMAZQBzAC4AZABsAGyhGoAY
# aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAKkGkXuQ
# FC9FBhz1kg/2wS5XgUvoTgLMZKs9IeVJQFGanlTgDBIX9An4tBNUqPpj5yqIBEVv
# J33reF0+9D1/eacYTwJhVqxsgouziihqT16iBZmp870coPfLyGfNiTImjHLPzRdD
# 6Bt5q6ieTBWiuf1NQGz43EFcoyuUZ/znE/xYeOdGHmIBout3Lqqq/wi/YFc3uwxu
# 83P9DL7OOiJXQuRcrdBqd0Y36+ls1+1aYEbzW56pcm3cLLWxAp5VTkdG7rLpFC2k
# WgB/jYTNcm7n+cwGLzFUZB40pR93/s533jA/+TncaXY1vl2WFHnt8UbdFYDLCGdc
# tYTstq6vpxJoecahghLxMIIS7QYKKwYBBAGCNwMDATGCEt0wghLZBgkqhkiG9w0B
# BwKgghLKMIISxgIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBVQYLKoZIhvcNAQkQAQSg
# ggFEBIIBQDCCATwCAQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQgFb5W
# HPmGBCfQDHUc8pBFq1H3VNtW2HJTaMEhFccauKECBl88B+dBTxgTMjAyMDA4MjMw
# NDAzNDMuMzY5WjAEgAIB9KCB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
# Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
# dCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVl
# cnRvIFJpY28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjREMkYtRTNERC1CRUVG
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIORDCCBPUw
# ggPdoAMCAQICEzMAAAErk9Dtjgr38EcAAAAAASswDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMjE5MDExNTAyWhcNMjEw
# MzE3MDExNTAyWjCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
# EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
# bjEpMCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28xJjAk
# BgNVBAsTHVRoYWxlcyBUU1MgRVNOOjREMkYtRTNERC1CRUVGMSUwIwYDVQQDExxN
# aWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOC
# AQ8AMIIBCgKCAQEAlvqLj8BZWleNACW52AA0cBFIXLMSOW2rtR2zDmxJmjrw3yha
# Qv5ArPzjZGoiKCBOW2bp0dgVyYHVhFGox1fpjuAlP1KnwVUjXQXEYXkjp3oG1AKM
# MFzb+zWKHQTXXVIA2X33kPwWBjx5rm7WeoSiaUIFuN2ipjLcA8RPaEAGkgzqFzAh
# rEK9366CYmcdI/4/Ej/xHEmHyNP8YVHOQvXDL+QPaIyXvXULODcMv/IAde6ypLD3
# mFmZbaa0vsc29LPTiuJ+NnDdCdg/AiLjoJKLfgqv2n10HVVXv75mj1KaB2Oa8Z4W
# MfYm2HfETE+ShQtpau8hupyk6z0TuwBQlMGwHQIDAQABo4IBGzCCARcwHQYDVR0O
# BBYEFCLvaHS4UgO5dJZhY/PQd5KIwJMFMB8GA1UdIwQYMBaAFNVjOlyKMZDzQ3t8
# RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
# LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNy
# bDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9z
# b2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3J0MAwG
# A1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQAD
# ggEBAGc/+dilpj5ulWziMmUftKwSVXhw692mcKeD5ejG1mc2FVuhBCWkuvs5D+bg
# 5zvzvTtEXyifJdNJYky8cNWEEPvioa5jcoWapYbDgwaoYuoQJSdQf//G1+Fk8x2L
# G4wMGZjtK2qRRS5flNFFWHvM11WpLuYT4bMRR53Mjad1NUYm0FQjvdxTvBR7yV58
# gSdfMp/GzJxPFSizSdQjZigoafz1lY8pL9jibflYTdiKuZMyMrnsHkDooQZIGT2+
# rKsY2K8Qaiok36Yw3xlQskko60UvODFWDubPlz8mCwxE+8XBlT3qFZwuCs1XkPd8
# 0CdaaIIsIyOIjw3whCzNm8ASnMgwggZxMIIEWaADAgECAgphCYEqAAAAAAACMA0G
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
# JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjREMkYtRTNERC1CRUVGMSUwIwYDVQQD
# ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQBE
# DDaSD+f/SfrQPt4bL3pZh0NPpqCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
# IFBDQSAyMDEwMA0GCSqGSIb3DQEBBQUAAgUA4uvMTzAiGA8yMDIwMDgyMjIwNTQz
# OVoYDzIwMjAwODIzMjA1NDM5WjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi68xP
# AgEAMAoCAQACAhs+AgH/MAcCAQACAhGoMAoCBQDi7R3PAgEAMDYGCisGAQQBhFkK
# BAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJ
# KoZIhvcNAQEFBQADgYEAEfvOSjRzZvA010ymoGH+SWyCDLgZlniLXEe5hErKud6S
# Ijsy5IuUUqcUnh72gGE833zW5D7WPp+dWNR7j2VP8Zu8YQq4QQvklFdrV0vRwyJr
# oBqj4InVM1zcCrMWr3inmF+1uqs/o+mugj9YMANnCGZ4axXAIGhORSIKNINYnz0x
# ggMNMIIDCQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
# bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
# aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAA
# ASuT0O2OCvfwRwAAAAABKzANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkD
# MQ0GCyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCCcED0+klvxoY4sPcPwQ4Lf
# lnRaldHgKbiDVXxpyIaFzzCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0EIGQn
# OeZKhcJTLFzce9iM4ipYx0bovq1MCDcqwtpdG89fMIGYMIGApH4wfDELMAkGA1UE
# BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
# BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
# IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAErk9Dtjgr38EcAAAAAASswIgQgpaLY
# 8KgshCVeR/QrMB0i8Jep/Z3lj/Ee0orDGX8aq7YwDQYJKoZIhvcNAQELBQAEggEA
# ZwIUow72uVupA72145WoleVbSOInnI9PLMWR1j6Qkq/jeuJsqNx4+fRKO1NNnXlF
# g/41ELW/FMnbjbTNUDnG1JiSDxjDDME+ZpyRi3UG3kbm0GzqXLnRALHgTQbzHnCB
# F16ItuRyOAYgCnimSuVzs789YIdMaNW19Sy/IEcXWB/q/8f6rSrrD5UX38joXRw1
# DPMcAKhXtCuoorNYMdaaY+O6geGowkMvXfv9dqmT5r/FyS8bZsOZnXVG2kdzgC2D
# YU4v8ZMj0Dn8bzytaEB+IzgVIyFGfycMEx/xIiUdX4MmXsttwRxxda6TOkXxDJ+s
# d8hSawcRYm09RGrio5T8lw==
# SIG # End signature block
