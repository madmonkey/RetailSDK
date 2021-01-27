<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
. $scriptDir\Common-Web.ps1
. $scriptDir\Common-Configuration.ps1

function CheckIf-CertificateExistInTargetStore(
    [string]$certificateThumbprint = $(throw 'certificateThumbprint is required.'),
    [string]$certificateStore = 'My',
    [string]$certificateRootStore = 'LocalMachine'
)
{
    $queryForCertificateInTargetStore = Get-ChildItem -Path Cert:\$certificateRootStore\$certificateStore | Where Thumbprint -eq $certificateThumbprint
    return ($queryForCertificateInTargetStore -ne $null)
}

function Install-Certificate(
    [ValidateNotNullOrEmpty()]
    [string]$certificateFilePath = $(Throw 'certificateFilePath parameter required.'),

    [Security.SecureString]$secureCertificatePassword = $(Throw 'secureCertificatePassword parameter required.'),
    [string]$certificateStore = 'My',
    [string]$certificateRootStore = 'LocalMachine',
    
    [ValidateNotNullOrEmpty()]
    [string]$expectedThumbprint,
    [string]$logFile = $(Throw 'logFile parameter required.')
)
{
    # Check if pfx file exists.
    if (-not (Test-Path -Path $certificateFilePath))
    {
        Throw-Error ('Unable to locate certificate file {0}' -f $certificateFilePath)
    }

    try
    {
        [int]$keyStorageFlags = 0
        $keyStorageFlags = $keyStorageFlags -bor ([int]([System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable))
        $keyStorageFlags = $keyStorageFlags -bor ([int]([System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::MachineKeySet))
        $keyStorageFlags = $keyStorageFlags -bor ([int]([System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::PersistKeySet))

        # Check if certificate has already been installed.
        $certificateToInstall = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @($certificateFilePath, $secureCertificatePassword, $keyStorageFlags)

        Write-Log ('Check if certificate already exits in target store {0}\{1}.' -f $certificateRootStore, $certificateStore) $logFile
        $doesCertificateExistInTargetStore = CheckIf-CertificateExistInTargetStore -certificateThumbprint $certificateToInstall.Thumbprint -certificateStore $certificateStore

        # Validate that the certificate thumbprint from pfx file matches expectedThumbprint.
        if ($certificateToInstall.Thumbprint -ne $expectedThumbprint)
        {
            throw ('Certificate thumbprint from pfx file {0} did not match expected thumbprint {1}.' -f $certificateToInstall.Thumbprint, $expectedThumbprint)
        }
        
        # If certificate is not present in the store then proceed with installation.
        if (-not($doesCertificateExistInTargetStore))
        {
            Write-Log ('Installing certificate to {0}\{1}.' -f $certificateRootStore, $certificateStore) $logFile
            $X509Store = New-Object System.Security.Cryptography.X509Certificates.X509Store($certificateStore, $certificateRootStore)

            $X509Store.Open([Security.Cryptography.X509Certificates.OpenFlags]::MaxAllowed);
            $X509Store.Add($certificateToInstall);
            $X509Store.Close()
            Write-Log ('Successfully installed certificate with thumbprint {0}.' -f $certificateToInstall.Thumbprint) $logFile
        }
        else
        {
            Write-Log ('Certificate with thumbprint {0} already exists in target store. Skipping install.' -f $certificateToInstall.Thumbprint) $logFile
        }
    }
    catch
    {
        Throw-Error $_
    }
}

function Get-BackupFolderPath(
    [string]$folderToBackup = $(Throw 'folderToBackup parameter is required.')
)
{
    $currentTimeStamp = Get-Date -format "MM-dd-yyyy_HH-mm-ss"
    return (Join-Path -Path $folderToBackup -ChildPath ('Backup_{0}' -f $currentTimeStamp))
}

function ModifyExisting-ChannelDbConnectionString(
    [string]$existingConnectionString = $(throw 'existingConnectionString is required.'),
    [string]$newChannelDbUser = $(throw 'newChannelDbUser is required.'),
    [string]$newChannelDbUserPassword = $(throw 'newChannelDbUserPassword is required.'),
    [string]$newServerName = $(throw 'newServerName is required.'),
    [string]$newDatabaseName = $(throw 'newDatabaseName is required.')
)
{
    $connectionStringBuilderAsReference = New-Object System.Data.SqlClient.SqlConnectionStringBuilder -ArgumentList $existingConnectionString
    $serverNameToUse = $connectionStringBuilderAsReference.'Server'
    $databaseNameToUse = $connectionStringBuilderAsReference.'Database'

    $usePassedServerName = CheckIf-UserProvidedValidSqlServerData -sqlServerDataString $newServerName
    $usePassedDatabaseName = CheckIf-UserProvidedValidSqlServerData -sqlServerDataString $newDatabaseName

    # Use the passed data if it is valid.
    if ($usePassedServerName)
    {
        $serverNameToUse = $newServerName
    }
    if ($usePassedDatabaseName)
    {
        $databaseNameToUse = $newDatabaseName
    }

    $newConnectionString = Generate-ChannelDbConnectionString -serverName $serverNameToUse `
                                                              -databaseName $databaseNameToUse `
                                                              -channelDatabaseUser $newChannelDbUser `
                                                              -channelDatabaseUserPassword $newChannelDbUserPassword `
                                                              -encrypt $connectionStringBuilderAsReference.Encrypt `
                                                              -trustServerCertificate $connectionStringBuilderAsReference.TrustServerCertificate

    return $newConnectionString
}

function Generate-ChannelDbConnectionString(
    [string]$serverName = $(throw 'serverName is required.'),
    [string]$databaseName = $(throw 'databaseName is required.'),
    [string]$channelDatabaseUser = $(throw 'channelDatabaseUser is required.'),
    [string]$channelDatabaseUserPassword = $(throw 'channelDatabaseUserPassword is required.'),
    [string]$encrypt = 'True',
    [string]$trustServerCertificate = 'False'
)
{
    $channelDbConnectionString = 'Application Name=Retail Server;Server="{0}";Database="{1}";User ID="{2}";Password="{3}";Trusted_Connection=False;Encrypt={4};TrustServerCertificate={5};' -f $serverName, `
                                        $databaseName, `
                                        $channelDatabaseUser, `
                                        $channelDatabaseUserPassword, `
                                        $encrypt, `
                                        $trustServerCertificate
    return $channelDbConnectionString
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
    if (-not(Test-Path -Path $targetRegistryKeyPath))
    {
        New-Item -Path $targetRegistryKeyPath -ItemType Directory -Force
    }

    New-ItemProperty -Path $targetRegistryKeyPath -Name $targetPropertyName -Value $servicingDataAsEncryptedString -Force
}
##############################################################
#
#    Rotate Auth data custom deployable package functions.
#
##############################################################
function Load-RotationInfoModule(
    [string]$packageRootPath = $(Throw 'packageRootPath parameter is required.')
)
{
    $serviceTemplateFolderPath = Join-Path -Path $packageRootPath -ChildPath 'RotateConfigData'
    $pathToRotationInfoModuleDllParent = Join-Path -Path $serviceTemplateFolderPath -ChildPath (Join-Path -Path 'Scripts' -ChildPath 'RotationInfo')
    $pathToRotationInfoModuleDll = Join-Path -Path $pathToRotationInfoModuleDllParent -ChildPath 'RotationInfoModule.dll'
    
    if (-not(Test-Path -Path $pathToRotationInfoModuleDll))
    {
        throw 'Unable to locate DLL file RotationInfoModule.'
    }
    
    # Import RotationInfoModule.Dll
    Import-Module $pathToRotationInfoModuleDll
    Add-Type -Path $pathToRotationInfoModuleDll
}

function Get-RotationInfoDecryptor(
    $rotationInfo = $(Throw 'rotationInfo parameter is required.')
)
{
    $rotationInfoDecryptor = New-Object Microsoft.Dynamics.AX.Servicing.Rotation.Decryptor $rotationInfo
    return $rotationInfoDecryptor
}

function Get-RotationInfo(
    [string]$serviceModelName = $(Throw 'serviceModelName parameter required.'),
    [string]$packageRootPath = $(Throw 'packageRootPath parameter required.')
)
{
    # Locate and validate the template file.
    $serviceTemplateFolderPath = Join-Path -Path $packageRootPath -ChildPath 'RotateConfigData'
    $rotationInfo = Get-ServicingRotationInfo -Name $serviceModelName -Path $serviceTemplateFolderPath

    # Check if the rotationInfo object is null or not. If it is null potentially the user did not add it to the template.
    # If it wasn't added to the template we should not be validating the presence of encryption thumbprint.
    if ($rotationInfo -ne $null)
    {
        if ($rotationInfo.EncryptionThumbprint -eq $null)
        {
            throw ('Servicing template information for {0} has not been encrypted.' -f $serviceModelName)
        }
    }
    
    return $rotationInfo
}

function GetValueFor-CertificateThumbprintWithKey(
    [string]$key = $(Throw 'key parameter required.'),
    $rotationInfo = $(Throw 'rotationInfo parameter required.')
)
{
    $certificateThumbprintObject = $rotationInfo.CertificateThumbprints | Where {$_.Key -eq $key}
    return $certificateThumbprintObject.Value
}

function GetValueFor-KeyValuePairWithKey(
    [string]$key = $(Throw 'key parameter required.'),
    $rotationInfo = $(Throw 'rotationInfo parameter required.'),
    $rotationInfoDecryptor = $(Throw 'rotationInfoDecryptor parameter required.')
)
{
    $keyValuePairObject = $rotationInfo.KeyValues | Where {$_.Key -eq $key}
    if ($keyValuePairObject)
    {
        $rotationInfoDecryptor.Decrypt($keyValuePairObject)
        $result = $keyValuePairObject.Value
    }

    return $result
}

function CheckIf-UserProvidedValidCredentialData(
    [string]$credentialString
)
{
    $result = $true
    if ([System.String]::IsNullOrWhiteSpace($credentialString))
    {
        $result = $false
    }
    if (($credentialString -eq '[userId]') -or ($credentialString -eq '[Password]'))
    {
        $result = $false
    }
    
    return $result
}

function CheckIf-UserProvidedValidSqlServerData(
    [string]$sqlServerDataString
)
{
    $result = $true
    if ([System.String]::IsNullOrWhiteSpace($sqlServerDataString))
    {
        $result = $false
    }
    if (($sqlServerDataString -eq '[ChannelDatabaseServerName]') -or ($sqlServerDataString -eq '[ChannelDatabaseName]'))
    {
        $result = $false
    }
    if (($sqlServerDataString.Split("[").Count -ne 1) -or ($sqlServerDataString.Split("]").Count -ne 1))
    {
        $result = $false
    }

    return $result
}

function Update-RetailWebsiteSSLBinding(
    [string]$websiteName = $(Throw 'websiteName parameter required.'),
    [string]$webAppPoolUser = $(Throw 'webAppPoolUser parameter required.'),
    [string]$certificateThumbprint = $(Throw 'certificateThumbprint parameter required.'),
    [string]$logFile = $(Throw 'logFile parameter required.')
)
{
    # Check if any https bindings exist for the website. If any exist we need to update the SSL binding.
    $websiteBindings = Get-WebBindingSafe -Name $websiteName -Protocol 'https'
    if ($websiteBindings)
    {
        foreach ($websiteBinding in $websiteBindings)
        {
            $websiteBindingProperties = Get-WebBindingProperties -Binding $websiteBinding
            $httpsPort = $websiteBindingProperties.Port

            # Update the website SSL binding.
            $websiteConfig = Create-WebSiteConfigMap -httpsPort $httpsPort -certificateThumbprint $certificateThumbprint -websiteAppPoolUsername $webAppPoolUser
            Invoke-ScriptAndRedirectOutput -scriptBlock {Add-SslBinding -WebSiteConfig $websiteConfig} -logFile $logFile
        }
    }
    else
    {
        Write-Log ('Website {0} does not use https. Skipping SSL binding update.' -f $websiteName) -logFile $logFile
    }
}

function InstallCertificatesAndUpdateIIS(
    $rotationInfo = $(Throw 'rotationInfo parameter required.'),
    $rotationInfoDecryptor = $(Throw 'rotationInfoDecryptor parameter required.'),

    [string]$packageRootPath = $(Throw 'packageRootPath parameter required.'),
    [boolean]$updateWebsiteSSLBinding = $false,
    [string]$websiteName,
    [string]$webAppPoolUser,
    [string]$certRootStore = 'LocalMachine',
    [string]$logFile = $(Throw 'logFile parameter required.')
)
{
    $pathToCertsFolder = Join-Path -Path (Join-Path -Path $packageRootPath -ChildPath 'RotateConfigData') -ChildPath 'Cert'

    # Read certificate information and install certificates not previously installed.
    foreach ($certificate in $rotationInfo.Certificates)
    {
        $rotationInfoDecryptor.Decrypt($certificate)
        $secureCertificatePassword = ConvertTo-SecureString $certificate.Password -AsPlainText -Force

        $certificateFilePath = Join-Path -Path $pathToCertsFolder -ChildPath $certificate.PfxFile
        $certificateStore = $certificate.CertStore
        $certificateThumbprint = $certificate.Thumbprint

        # Check if the path to certificate is valid. If invalid, no action required.
        if (Test-Path -Path $certificateFilePath)
        {
            # Import certificate. This will only import certificates not previously installed.
            Install-Certificate -certificateFilePath $certificateFilePath `
                                -secureCertificatePassword $secureCertificatePassword `
                                -certificateStore $certificateStore `
                                -expectedThumbprint $certificateThumbprint `
                                -logFile $logFile

            # Update the website binding, if specified.
            if ($updateWebsiteSSLBinding)
            {
                # Check if any https bindings exist for the website. If any exist we need to update the SSL binding.
                Update-RetailWebsiteSSLBinding -websiteName $websiteName `
                                               -webAppPoolUser $webAppPoolUser `
                                               -certificateThumbprint $certificateThumbprint `
                                               -logFile $logFile
            }
            else
            {
                # If we aren't updating the SSL binding, we still need to update permissions for the certificate.
                GrantPermission-UserToSSLCert -certThumbprint $certificateThumbprint -certRootStore $certRootStore -certStore $certificateStore -appPoolUserName $webAppPoolUser
            }
        }
        else
        {
            $logMessage = 'No valid certificates located. Skipping certificate installation.'
            if ($updateWebsiteSSLBinding)
            {
                $logMessage = 'No valid SSL certificates located. Skipping certificate installation and website SSL binding update.'
            }

            Write-Log $logMessage -logFile $logFile
        }
    }
}

function Get-RobocopyOptions(
    [switch]$includeEmptySubFolders
)
{
    # No job headers, summary and progress. No directory listing and 360 retries with 5 sec waits.
    $robocopyOptions = "/NJS /NP /NJH /NDL /R:360 /W:5"
    
    if ($includeEmptySubFolders)
    {
        $robocopyOptions += " /E"
    }
    
    return $robocopyOptions
}

function Encrypt-WebConfigSection(
    [string]$webConfigSection = $(throw 'webConfigSection is required.'),
    $websiteId = $(throw 'websiteId is required.'),
    [string]$targetWebApplicationPath = '/',
    [string]$logFile = $(throw 'logFile is required.')
)
{
    Write-Log 'Encrypting target web.config .' $logFile
    $global:LASTEXITCODE = 0

    aspnet_regiis -pe $webConfigSection -app $targetWebApplicationPath -Site $websiteId | Tee-Object -FilePath $logFile -Append
    $capturedExitCode = $global:LASTEXITCODE

    if($capturedExitCode -eq 0)
    {
        Write-Log 'Web.config encryption completed successfully.' $logFile
    }
    else
    {
        throw "Web.config encryption failed with encryption exit code: $capturedExitCode"
    }
}

function Decrypt-WebConfigSection(
    [string]$webConfigSection = $(throw 'webConfigSection is required.'),
    $websiteId = $(throw 'websiteId is required.'),
    [string]$targetWebApplicationPath = '/',
    [string]$logFile = $(throw 'logFile is required.')
)
{
    Write-Log 'Decrypting web.config' $logFile
    $global:LASTEXITCODE = 0

    aspnet_regiis -pd $webConfigSection -app $targetWebApplicationPath -Site $websiteId | Tee-Object -FilePath $logFile -Append
    $capturedExitCode = $global:LASTEXITCODE

    if($capturedExitCode -eq 0)
    {
        Write-Log 'Web.config decryption completed successfully.' $logFile
    }
    else
    {
        throw "Web.config decryption failed with decryption exit code: $capturedExitCode"
    }
}

Export-ModuleMember -Function CheckIf-CertificateExistInTargetStore
Export-ModuleMember -Function CheckIf-UserProvidedValidCredentialData
Export-ModuleMember -Function CheckIf-UserProvidedValidSqlServerData
Export-ModuleMember -Function Copy-Files
Export-ModuleMember -Function Decrypt-WebConfigSection
Export-ModuleMember -Function Encrypt-WebConfigSection
Export-ModuleMember -Function Generate-ChannelDbConnectionString
Export-ModuleMember -Function Get-BackupFolderPath
Export-ModuleMember -Function Get-RobocopyOptions
Export-ModuleMember -Function Get-RotationInfo
Export-ModuleMember -Function Get-RotationInfoDecryptor
Export-ModuleMember -Function GetValueFor-CertificateThumbprintWithKey
Export-ModuleMember -Function GetValueFor-KeyValuePairWithKey
Export-ModuleMember -Function Install-Certificate
Export-ModuleMember -Function InstallCertificatesAndUpdateIIS
Export-ModuleMember -Function Invoke-ScriptAndRedirectOutput
Export-ModuleMember -Function Load-RotationInfoModule
Export-ModuleMember -Function Log-TimedMessage
Export-ModuleMember -Function ModifyExisting-ChannelDbConnectionString
Export-ModuleMember -Function Save-ChannelDbServicingDataToRegistry
Export-ModuleMember -Function Update-RetailWebsiteSSLBinding
Export-ModuleMember -Function Write-Log


# SIG # Begin signature block
# MIIkAwYJKoZIhvcNAQcCoIIj9DCCI/ACAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCA+wBpYR7hnTl2o
# +YukRKVWT2AMHSj8JW/osK1eqAwhl6CCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCC4
# UOm8ROJTMlxWul1YG+BxvEf4DGjUzasMnL/uv3H2cDCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAb
# YQnJMXUDe8PlZlYRviFwPN+yCg2WTZZXG0pGKpp1jG4vwJ6PlsON/4YtKOxbG2d+
# ZFG3v0S1dqMtpqihjYNt98MZVrxLT30jvnm2UF3KTx90mHm69GhnMCGzb8qwUv+P
# AVHdZf02bhvdRO6ahMePATPkab+fA6fOLYlXC/m2HINsYW9P1oszA6AnRvQQRL/z
# HOBk2/1VVLaAlEyQoARb1lh1gwi3plP+pTTMaSqhWDf2EHyuhIjmGaGOs8VIVFlw
# o3NxJv3t/lJ7GCuCgVE6uURb7W5Tp/vWEFUxFliGgGsoZATGuojrBg+jz9S7n2NG
# Xc3Tmy0Cx4uRCdUzu9PXoYIS5DCCEuAGCisGAQQBgjcDAwExghLQMIISzAYJKoZI
# hvcNAQcCoIISvTCCErkCAQMxDzANBglghkgBZQMEAgEFADCCAVAGCyqGSIb3DQEJ
# EAEEoIIBPwSCATswggE3AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IHP4qbH7IUpoylSR4XYwpBIdpQpa10J2WjZQhTDQ6lCvAgZfPS1QSN4YEjIwMjAw
# ODIzMDQwMjQ3LjU0WjAEgAIB9KCB0KSBzTCByjELMAkGA1UEBhMCVVMxCzAJBgNV
# BAgTAldBMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
# cG9yYXRpb24xLTArBgNVBAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMg
# TGltaXRlZDEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046M0JENC00QjgwLTY5QzMx
# JTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wggg48MIIE8TCC
# A9mgAwIBAgITMwAAAQvk+b6Pb0wd0AAAAAABCzANBgkqhkiG9w0BAQsFADB8MQsw
# CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
# ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
# b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTEwMjMyMzE5MTVaFw0yMTAx
# MjEyMzE5MTVaMIHKMQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNVBAcT
# B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsGA1UE
# CxMkTWljcm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
# Ex1UaGFsZXMgVFNTIEVTTjozQkQ0LTRCODAtNjlDMzElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
# AQoCggEBAJcC1Z1GMUG4z4PaeFQotW5a/1xlyrX/x6bKRAGmUOKLwOrDAI2cPTMm
# HPuf3ha1aMWxzkov90XyApZMxEfkxVNrl3EIm7pW1mhtz6zO0z7Qk8zlWZxv/sP4
# CUUREYCRAYbE79nh/EcfX8Rxn+LBSKbNp9eME6UhDdFLFQCP3zSWK4DI0KuPwl26
# cZHedVJG/Em1alRm+UhSthjgsOYkmwWwjyCxyHcutyGY94GSjGy/LtGkqFw5C1Nh
# pwPjy/Pt/NPZyJyImoBfFm3t+2HyyCoqJRREJW5KVxQpcFeb/V1xgIqo6hTPZga7
# aLS3gr9fXslZnmN03W/GrNJBr0/g8fECAwEAAaOCARswggEXMB0GA1UdDgQWBBSt
# H9nqHYoenOCYDVBEZf/3bV7e7zAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNo
# WoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
# cGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYI
# KwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5j
# b20vcGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNydDAMBgNVHRMB
# Af8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IBAQAm
# 6KOdqe82tLrd7zsIrSDAiYjwLgl2HEss+cDqb+lRJdZ6X0oJre33k1E07fo2B6YP
# GGyTPutUeJSKBvWkl2b5MHlKGDYOU+LVSF0JNo3mVNZn6scAV8MjiLaB0o7B3K6D
# vebmNrZ2p8NOXYOLlrHBwGAO8axkt8Gb5oa63a9QYEGDVCMwp+pAaowkJjBc8Z0e
# bBE3VQ3kyk5EGROaTYMRZaNGbQspDX95XgpiJTlxXgYLT/z+r9fvXBuvB3IfZnK+
# HaYg4T7hP2ZlzsfQLNnxB2pMd3bFtNPUZI1F55hiWdORaUKIQuNiQicdR/C6YLWk
# K5kx/ghM3DsqN44Y/IoNMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAAAjANBgkqhkiG
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
# HVRoYWxlcyBUU1MgRVNOOjNCRDQtNEI4MC02OUMzMSUwIwYDVQQDExxNaWNyb3Nv
# ZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQDx/fkdMWpT3PCK
# Ej2S2aw+CnAwUqCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
# aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
# cG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEw
# MA0GCSqGSIb3DQEBBQUAAgUA4uxI8jAiGA8yMDIwMDgyMzA5NDYyNloYDzIwMjAw
# ODI0MDk0NjI2WjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi7EjyAgEAMAoCAQAC
# AhPIAgH/MAcCAQACAhGyMAoCBQDi7ZpyAgEAMDYGCisGAQQBhFkKBAIxKDAmMAwG
# CisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEF
# BQADgYEApDUECajln0DpoWV6HzozDMjblcALejta614cFZ8SC1L44wekNbO8pf4G
# mBVi4f/v4MR60kHs32zqsNvR9trmDKTWYBQLG4WAvR3POs+a94uUv81kGzEoqVN8
# bm1Pd4EDCXd8K06+cvWOba4EZZK4ABEiSIqDpLzmSvJB9Bl/TnYxggMNMIIDCQIB
# ATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
# BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
# VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAAQvk+b6Pb0wd
# 0AAAAAABCzANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqGSIb3
# DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCCHqwgeHoXCXZTcLMLTqPNPcQpwZ86qtn4y
# EgGDm9D6ojCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0EIDSP0M4gUz46JJfx
# cCRcBeK9FHQs8cDpxVT8BMATXHOIMIGYMIGApH4wfDELMAkGA1UEBhMCVVMxEzAR
# BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
# Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3Rh
# bXAgUENBIDIwMTACEzMAAAEL5Pm+j29MHdAAAAAAAQswIgQgObnX0NmP1KDyQioO
# Xk0rxHMZzaoDa1LbgmkEyNw3daMwDQYJKoZIhvcNAQELBQAEggEAfoz6tHT6pmCY
# lpB4wz2KuRrry1NJllAa2KZNN5A17A9kTfGdHaPMF8Zn9uc64xTsd35uduIFM2C1
# EhIfuK3hx5gtmTAvIiRsqOe/TvCqSF1ewJYKrVaCIpBVIZM4WGuwg5A6DccyhwFz
# YEpcAygQ0kWcKsxY60pql+p6mF9uUNlvPvY/OWqdcXKP6O8yVx9yL4NSsKZoMMo/
# Z0qf1ixAkmD6/dw6uPEIXqGZdl+9VbQZcUtEDMd26+p0vrYxk7Qs7RrJ3vIQKtFS
# 4mNhEl+DMbJnkV/4lRoP79+Tqm9XNn/nPek2Ck73gZSohXfqNI2BrVkMlOLfbkZp
# pLs3HGZbgA==
# SIG # End signature block
