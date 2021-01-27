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
# MIIkAAYJKoZIhvcNAQcCoIIj8TCCI+0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCD2VLOGoeF+QXdd
# cp5lHtpWNLW9PKkibMhbCr2/M7YnsKCCDYEwggX/MIID56ADAgECAhMzAAABh3IX
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
# RcBCyZt2WwqASGv9eZ/BvW1taslScxMNelDNMYIV1TCCFdECAQEwgZUwfjELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9z
# b2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAxMQITMwAAAYdyF3IVWUDHCQAAAAABhzAN
# BglghkgBZQMEAgEFAKCCAScwGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYK
# KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIFYzVyy4
# Flibnfl7v0qaoz1Xt7UJjpyn9ksKo3cR9Td8MIG6BgorBgEEAYI3AgEMMYGrMIGo
# oIGJgIGGAFMAaQBtAHAAbABpAGYAeQBDAG8AbQBtAGUAcgBjAGUALgBNAGkAYwBy
# AG8AcwBvAGYAdABEAHkAbgBhAG0AaQBjAHMALgBDAG8AbgBuAGUAYwB0AG8AcgAu
# AFAAbwByAHQAYQBiAGwAZQAuAHIAZQBzAG8AdQByAGMAZQBzAC4AZABsAGyhGoAY
# aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAMXUeRoc
# 9MES66BixL05wuqS10T1jml8WVoqT5fN+d/X4ibRJxxTczklHkxjlb559QBqr1J+
# 3ilt5Sk0B63ETBX1NrziTQ39z5sizMiJzw/nd3wwz1LDktkOuhH7uac9Vq6AjNKY
# u/CYerpoQcZaD9yM0vEiHDVAbRHXklJE9RbtmTGLhZfSz/q4g0t364trtWTwYUuy
# BIc8eKUg4vnvKUBmUF1JLrYYC+2DLe+UP0KBuFwSu3NAoPAYVR7PDmqM1Akv6Vlx
# dDUGqYITqcNYdS1+8Gq5koXkho7jmQlQ4UMVegJQ/uapLe2PPugiO/kjQOGuILKq
# /C2H2YdcxnRO0lmhghLlMIIS4QYKKwYBBAGCNwMDATGCEtEwghLNBgkqhkiG9w0B
# BwKgghK+MIISugIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBUQYLKoZIhvcNAQkQAQSg
# ggFABIIBPDCCATgCAQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQgLXre
# vN24mcUC0njgjaa6aopQaqqm6kctzEGjg8Jgz40CBl861lpDUhgTMjAyMDA4MjMw
# NDAyNDguNzcxWjAEgAIB9KCB0KSBzTCByjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
# Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
# dCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3BlcmF0
# aW9uczEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046NDlCQy1FMzdBLTIzM0MxJTAj
# BgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wggg48MIIE8TCCA9mg
# AwIBAgITMwAAARcxYH4HdjGeCQAAAAABFzANBgkqhkiG9w0BAQsFADB8MQswCQYD
# VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
# MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
# ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTExMTMyMTQwMzRaFw0yMTAyMTEy
# MTQwMzRaMIHKMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
# A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSUw
# IwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25zMSYwJAYDVQQLEx1U
# aGFsZXMgVFNTIEVTTjo0OUJDLUUzN0EtMjMzQzElMCMGA1UEAxMcTWljcm9zb2Z0
# IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
# ggEBAMahUp8trc0Dysh7EVb2E05G4q3LREkdWn1yblL1PPBXWku3ZvQiG5Lfib/p
# 1Pdna0hPGEK4OCmLgwf9lEV/KgFYt+J9gBkA6fLiB88nvFhK55JjPmRXl/cFvSJS
# 1OE7yIpnMPSoO9OzsKT8Jv2mtTo5LJtKxhdudN3XneWtFc6/8teDORTWP1qLw5Wd
# +L8MLxmx2EADkJVWp0G0sNRKDIKDKPoabrUQ4Hp6/5MZ5Pz4vY8WZbKDcjI5phTi
# YIX8ofXspqbrwOkOZCGStS+nxwoSH4tvYXNQfeB8BjIqwT9f5P2f2snqF2MlFYT6
# hWG4/oEU9mJPKMrUYFLcGv6S7SsCAwEAAaOCARswggEXMB0GA1UdDgQWBBSuVNtW
# 34mLD9pOtOS7+Dhk6K3DBTAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNoWoVt
# VTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtp
# L2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYIKwYB
# BQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
# cGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNydDAMBgNVHRMBAf8E
# AjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IBAQBf14UZ
# pXmKXfjfNoPSILBfijNMQdsFTRmU8F91CFMDhN5H6M4ss0FWWY6UjmeF0ZEnxegO
# tgKULhgFLZbIYe8HlB1TY5sqgcX0qbtvm4bBfIovSnEbrtY5AIEW7meMaye/luvX
# QyucieAHTte3AbBT+q53vik7qWhAxfDwZcrhfwt/JmRDum5d4UAZuHfszEQ+07L+
# hjN7gUZMyg7unQFk5LFo09hvOe08lX3DbIhxT9qk9wgkSISL1f+rWfwRUm8gGu1L
# HGoIjs4Zo8lA5kGnbYQoGIEx/fVc8V3L9UUQKNmWxeqDERmyHWH+lHFYu5TTfq91
# 6/4TT/B/ixCzcmeMMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAAAjANBgkqhkiG9w0B
# AQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAG
# A1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIwMTAw
# HhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAxMjE0NjU1WjB8MQswCQYDVQQGEwJVUzET
# MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
# dGFtcCBQQ0EgMjAxMDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKkd
# Dbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX77XxoSyxfxcPlYcJ2tz5mK1vwFVMn
# BDEfQRsalR3OCROOfGEwWbEwRA/xYIiEVEMM1024OAizQt2TrNZzMFcmgqNFDdDq
# 9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0ySwcSmXdFhE24oxhr5hoC732H8
# RsEnHSRnEnIaIYqvS2SJUGKxXf13Hz3wV3WsvYpCTUBR0Q+cBj5nf/VmwAOWRH7v
# 0Ev9buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn9NxkvaQBwSAJk3jN
# /LzAyURdXhacAQVPIk0CAwEAAaOCAeYwggHiMBAGCSsGAQQBgjcVAQQDAgEAMB0G
# A1UdDgQWBBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEEAYI3FAIEDB4KAFMA
# dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAW
# gBTV9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8v
# Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNSb29DZXJBdXRf
# MjAxMC0wNi0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRw
# Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0NlckF1dF8yMDEw
# LTA2LTIzLmNydDCBoAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEEAYI3LgMwgYEwPQYI
# KwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9QS0kvZG9jcy9DUFMv
# ZGVmYXVsdC5odG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AUABvAGwA
# aQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZIhvcNAQELBQADggIB
# AAfmiFEN4sbgmD+BcQM9naOhIW+z66bM9TG+zwXiqf76V20ZMLPCxWbJat/15/B4
# vceoniXj+bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX/1z5Xhc1mCRWS3Tv
# QhDIr79/xn/yN31aPxzymXlKkVIArzgPF/UveYFl2am1a+THzvbKegBvSzBEJCI8
# z+0DpZaPWSm8tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnxzplmkIz/amJ/3cVK
# C5Em4jnsGUpxY517IW3DnKOiPPp/fZZqkHimbdLhnPkd/DjYlPTGpQqWhqS9nhqu
# BEKDuLWAmyI4ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kWumGnEcua2A5HmoDF
# 0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/nMQekkzr3ZUd46PioSKv33nJ+
# YWtvd6mBy6cJrDm77MbL2IK0cs0d9LiFAR6A+xuJKlQ5slvayA1VmXqHczsI5pgt
# 6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnPGUFN4Ib5KpqjEWYw07t0Mkvf
# Y3v1mYovG8chr1m1rtxEPJdQcdeh0sVV42neV8HR3jDA/czmTfsNv11P6Z0eGTgv
# vM9YBS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkSoYICzjCCAjcCAQEwgfih
# gdCkgc0wgcoxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
# VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJTAj
# BgNVBAsTHE1pY3Jvc29mdCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRo
# YWxlcyBUU1MgRVNOOjQ5QkMtRTM3QS0yMzNDMSUwIwYDVQQDExxNaWNyb3NvZnQg
# VGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQCd9GUqHhFR83q4mVyG
# XNpEYzBB0qCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
# dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
# YXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMA0G
# CSqGSIb3DQEBBQUAAgUA4uvsPDAiGA8yMDIwMDgyMzAzMTA1MloYDzIwMjAwODI0
# MDMxMDUyWjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi6+w8AgEAMAoCAQACAhpA
# AgH/MAcCAQACAhGdMAoCBQDi7T28AgEAMDYGCisGAQQBhFkKBAIxKDAmMAwGCisG
# AQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEFBQAD
# gYEAIfXDI9Mw5T/emwe8OvkwIVoe11espfaGo59bdRKCxU+tysr+znIw3bnEuuHi
# lD5M9q86J6xIMccp5cErOE6hF/a8uhj4zBKVRuh+rLpueyyZFZbctUys1kghnvS8
# nfjkBhIQDuEVYqNAMW82cmlSJ09PMcSDo7ApcEoA7OQFiV4xggMNMIIDCQIBATCB
# kzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
# UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQD
# Ex1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAARcxYH4HdjGeCQAA
# AAABFzANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqGSIb3DQEJ
# EAEEMC8GCSqGSIb3DQEJBDEiBCCqF5jMO9nXLHyJxCzysV0siK4vT/yIT4+glfAp
# 6rDetzCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0EIGxpZsjislnMX7qYH49q
# ZTnSzYRECYnf6u44H8ja2F8kMIGYMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNV
# BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
# c29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAg
# UENBIDIwMTACEzMAAAEXMWB+B3YxngkAAAAAARcwIgQgOZQYF3RuXZrE/JKaBWGc
# Co3enoOu0wkRoMQ+SLvX6WswDQYJKoZIhvcNAQELBQAEggEAYUWRJzcs6MtAagiR
# jJBE3snFpb9R+wZdHJTzR+XPuCTH+6+vMQiOTBaLDi36taz2wYKRePGpjL205jdU
# rYGIJCGvof1tWuXf8v4ep6vxiQTWkDA9HYhXMq0QlCCCAlvKIR+j4CIZTbuJ2kHi
# BFyBkslcRDnVfih8oyy8vyYbZOZi4m1+gg3Jp8ypo6Q8x/sCjAHhTsQ5SYbnZbuf
# 2/uxHGSU3GXywHYX8jyTWwTJ+2BpSrj3OJUhn7CdnGo/BRbAqlxqiFS703Zwg0m8
# J+XCtNM9s7Ts0MRniH1R8BfopliJXsUNLf3nkTAT5v2lrwTbE7O7B3QGEP7mRMd1
# FnDx1A==
# SIG # End signature block
