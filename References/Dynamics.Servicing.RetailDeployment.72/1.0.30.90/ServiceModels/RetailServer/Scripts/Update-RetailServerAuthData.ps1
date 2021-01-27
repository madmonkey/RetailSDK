<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

param(
    [string]$logFile = 'Update-RetailServerAuthData.log'
)

$ErrorActionPreference = 'Stop'

function Backup-AllRetailServerFiles(
    [string]$backupFolderPath,
    [string]$websiteName,
    [string]$logFile
)
{
    Write-Log ('Backing up all retail server files to {0}.' -f $backupFolderPath) $logFile
    Backup-WebSite -Name $websiteName -BackupFolder $backupFolderPath
    Write-Log 'Backing up complete.' $logFile
}

function Get-RetailServerWebsite(
    [string]$name = $(throw 'name is required.')
)
{
    $retailServerWebsite = Get-WebSiteSafe -Name $name
    if (-not($retailServerWebsite))
    {
        throw ('Unable to locate {0} website.' -f $name)
    }

    return $retailServerWebsite
}

function Get-RetailServerWebRoot(
    $retailServerWebsiteIISObject = $(throw 'retailServerWebsiteIISObject is required.'),
    $serviceModelName = $(throw 'serviceModelName is required.')
)
{
    $retailServerWebRoot = $retailServerWebsiteIISObject.physicalPath
    if (-not(Test-Path -Path $retailServerWebRoot))
    {
        throw ('Unable to locate {0} website root location.' -f $serviceModelName)
    }

    return $retailServerWebRoot
}

function Update-RTSAuthCertificate(
    [string]$scriptDir = $(throw 'scriptDir is required.'),
    [string]$retailServerWebRoot = $(throw 'retailServerWebRoot is required.'),
    [string]$retailRTSAuthCertificateThumbprint = $(throw 'retailRTSAuthCertificateThumbprint is required.'),
    [string]$logFile = $(throw 'logFile is required.')
)
{
    # Call script to update the Retail Server authentication keys in certs.json.
    Invoke-ScriptAndRedirectOutput `
                    -scriptBlock `
                    {
                        & "$scriptDir\UpdateRetailServerAuthenticationKeys.ps1" `
                                    -CertificateThumbprint $retailRTSAuthCertificateThumbprint `
                                    -RetailServerDeploymentPath $retailServerWebRoot
                    } `
                    -logFile $logFile
    Write-Log 'Successfully updated RTS authentication certificate data.' $logFile

    # Step : Update commerceRuntime.config
    $commerceRuntimeConfigPath = Join-Path -Path $retailServerWebRoot -ChildPath "bin\commerceRuntime.config"
    [xml]$commerceRuntimeConfigContent = Get-Content -Path $commerceRuntimeConfigPath

    $commerceRuntimeConfigContent.commerceRuntime.realtimeService.certificate.thumbprint = $retailRTSAuthCertificateThumbprint
    $commerceRuntimeConfigContent.Save($commerceRuntimeConfigPath)
    Write-Log 'Successfully updated commerceRuntime.config' $logFile
}

function Update-RetailServerWebConfig(
    [boolean]$updateConnectionStrings,
    [boolean]$updateEncryptionCert,

    [string]$retailServerWebRoot = $(throw 'retailServerWebRoot is required.'),
    $retailServerWebsiteId = $(throw 'retailServerWebsiteId is required.'),
    [string]$dataEncryptionCertificateThumbprint = $(throw 'dataEncryptionCertificateThumbprint is required.'),
    [string]$newRetailRuntimeUser = $(throw 'newRetailRuntimeUser is required.'),
    [string]$newRetailRuntimeUserPassword = $(throw 'newRetailRuntimeUserPassword is required.'),
    [string]$channelDatabaseServerName = $(throw 'channelDatabaseServerName is required.'),
    [string]$channelDatabaseName = $(throw 'channelDatabaseName is required.'),
    [string]$logFile = $(throw 'logFile is required.')
    
)
{
    if (-not ($updateConnectionStrings -or $updateEncryptionCert))
    {
        Write-Log 'No updatable data was provided for data encryption certificate or RetailRuntimeUser. Skipping update.' -logFile $logFile
        return
    }

    if ($updateConnectionStrings)
    {
        # Decrypt web.config
        Decrypt-WebConfigSection -webConfigSection 'connectionStrings' -websiteId $retailServerWebsiteId -targetWebApplicationPath '/' -logFile $logFile
    }

    # Step : Update web.config
    $webConfigPath = Join-Path -Path $retailServerWebRoot -ChildPath 'web.config'
    [xml]$webConfigContent = Get-Content -Path $webConfigPath

    if ($updateEncryptionCert)
    {
        $webConfigContent.configuration.retailServer.cryptography.certificateThumbprint = $dataEncryptionCertificateThumbprint
    }

    if ($updateConnectionStrings)
    {
        $currentConnectionStrings = $webConfigContent.configuration.connectionStrings.add
        foreach ($currentConnectionString in $currentConnectionStrings)
        {
            $newConnectionString = ModifyExisting-ChannelDbConnectionString -existingConnectionString $currentConnectionString.connectionString `
                                                                            -newServerName $channelDatabaseServerName `
                                                                            -newDatabaseName $channelDatabaseName `
                                                                            -newChannelDbUser $newRetailRuntimeUser `
                                                                            -newChannelDbUserPassword $newRetailRuntimeUserPassword
            $currentConnectionString.connectionString = $newConnectionString
        }
    }

    $webConfigContent.Save($webConfigPath)
    Write-Log 'Successfully updated web.config.' $logFile

    # Step : Encrypt web.config if required.
    if ($updateConnectionStrings)
    {
        # Encrypt web.config
        Encrypt-WebConfigSection -webConfigSection 'connectionStrings' -websiteId $retailServerWebsiteId -targetWebApplicationPath '/' -logFile $logFile
    }
}

function Update-ChannelDbServicingData(
    [string]$newAxDeployUserKey = $(throw 'newAxDeployUserKey is required.'),
    [string]$newAxDeployUser = $(throw 'newAxDeployUser is required.'),
    [string]$newAxDeployUserPasswordKey = $(throw 'newAxDeployUserPasswordKey is required.'),
    [string]$newAxDeployUserPassword = $(throw 'newAxDeployUserPassword is required.'),
    [string]$channelDatabaseServerName = $(throw 'channelDatabaseServerName is required.'),
    [string]$channelDatabaseName = $(throw 'channelDatabaseName is required.'),
    [xml]$retailServerWebConfigContent = $(throw 'retailServerWebConfigContent is required.'),
    [string]$logFile = $(throw 'logFile is required.')
    
)
{
    Update-XmlObjAttributeValue -xml $retailServerWebConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.Database']" -attributeName 'value' -value $channelDatabaseName
    Update-XmlObjAttributeValue -xml $retailServerWebConfigContent -xpath "//configuration/appSettings/add[@key='DataAccess.DbServer']" -attributeName 'value' -value $channelDatabaseServerName
    Update-XmlObjAttributeValue -xml $retailServerWebConfigContent -xpath "//configuration/appSettings/add[@key='$newAxDeployUserKey']" -attributeName 'value' -value $newAxDeployUser
    Update-XmlObjAttributeValue -xml $retailServerWebConfigContent -xpath "//configuration/appSettings/add[@key='$newAxDeployUserPasswordKey']" -attributeName 'value' -value $newAxDeployUserPassword
    
    Write-Log 'Successfully updated channel database servicing data in the registry.' $logFile
}

try
{
    $serviceModelName = 'RetailServer'
    $AosWebsiteName = 'AOSService'
    $scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
    $packageRootPath = Split-Path -Path (Split-Path -Path $scriptDir -Parent) -Parent

    # Import all requisite modules.
    . $scriptDir\Common-Configuration.ps1
    . $scriptDir\Common-Upgrade.ps1

    Import-Module (Join-Path -Path $scriptDir -ChildPath 'Common-Servicing.psm1') -DisableNameChecking
    Import-Module (Join-Path -Path $scriptDir -ChildPath 'CommonRollbackUtilities.psm1') -DisableNameChecking
    Load-RotationInfoModule -packageRootPath $packageRootPath

    # Step 1: Read rotationInfo
    $rotationInfo = Get-RotationInfo -serviceModelName $serviceModelName -packageRootPath $packageRootPath
    if ($rotationInfo -eq $null)
    {
        Write-Log ('Servicing template information not found for {0}. Skipping servicing.' -f $serviceModelName) $logFile
        exit 0
    }

    $rotationInfoDecryptor = Get-RotationInfoDecryptor -rotationInfo $rotationInfo

    # # Step 2: Read certificate information and install certificates not previously installed.
    $retailSSLCertificateThumbprint               = GetValueFor-CertificateThumbprintWithKey -key 'NewRetailSSLCertificate' -rotationInfo $rotationInfo
    $retailRTSAuthenticationCertificateThumbprint = GetValueFor-CertificateThumbprintWithKey -key 'NewRetailRTSAuthenticationCertificate' -rotationInfo $rotationInfo
    $dataEncryptionCertificateThumbprint          = GetValueFor-CertificateThumbprintWithKey -key 'DataAccess.DataEncryptionCertificateThumbprint' -rotationInfo $rotationInfo

    InstallCertificatesAndUpdateIIS -rotationInfo $rotationInfo `
                                    -rotationInfoDecryptor $rotationInfoDecryptor `
                                    -packageRootPath $packageRootPath `
                                    -updateWebsiteSSLBinding $false `
                                    -webAppPoolUser "NETWORK SERVICE" `
                                    -logFile $logFile

    # Check to validate certificate status
    $doesRetailSSLCertExistInTargetStore         = CheckIf-CertificateExistInTargetStore -certificateThumbprint $retailSSLCertificateThumbprint
    $doesDataEncryptionCertExistInTargetStore    = CheckIf-CertificateExistInTargetStore -certificateThumbprint $dataEncryptionCertificateThumbprint
    $doesRTSAuthenticationCertExistInTargetStore = CheckIf-CertificateExistInTargetStore -certificateThumbprint $retailRTSAuthenticationCertificateThumbprint

    # Step 3: Update Retail Server website SSL Binding, if applicable
    if ($doesRetailSSLCertExistInTargetStore)
    {
        # Check if any https bindings exist for the website. If any exist we need to update the SSL binding.
        Update-RetailWebsiteSSLBinding -websiteName $serviceModelName `
                                       -webAppPoolUser "NETWORK SERVICE" `
                                       -certificateThumbprint $retailSSLCertificateThumbprint `
                                       -logFile $logFile
    }
    else
    {
        Write-Log 'No valid SSL certificates were provided. Skipping SSL binding update.' -logFile $logFile
    }

    # Read newRetailRuntimeUser credentials and Channel Db Server and database names and determine if user has provided new values for them.
    $newRetailRuntimeUser          = GetValueFor-KeyValuePairWithKey -key 'NewRetailRuntimeUser.Username' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor
    $newRetailRuntimeUserPassword  = GetValueFor-KeyValuePairWithKey -key 'NewRetailRuntimeUser.Password' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor

    $newAxDeployUser               = GetValueFor-KeyValuePairWithKey -key 'AxDeployUser.Username' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor
    $newAxDeployUserPassword       = GetValueFor-KeyValuePairWithKey -key 'AxDeployUser.Password' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor

    $newAxDeployExtUser            = GetValueFor-KeyValuePairWithKey -key 'AxDeployExtUser.Username' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor
    $newAxDeployExtUserPassword    = GetValueFor-KeyValuePairWithKey -key 'AxDeployExtUser.Password' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor

    $channelDatabaseServerName     = GetValueFor-KeyValuePairWithKey -key 'ChannelDatabaseServerName' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor
    $channelDatabaseName           = GetValueFor-KeyValuePairWithKey -key 'ChannelDatabaseName' -rotationInfo $rotationInfo -rotationInfoDecryptor $rotationInfoDecryptor

    $wereNewRetailRuntimeUserCredentialsSpecified  = CheckIf-UserProvidedValidCredentialData -credentialString $newRetailRuntimeUser
    $wereNewAxDeployUserCredentialsSpecified = CheckIf-UserProvidedValidCredentialData -credentialString $newAxDeployUser
    $wereNewAxDeployExtUserCredentialsSpecified = CheckIf-UserProvidedValidCredentialData -credentialString $newAxDeployExtUser

    # Step 4: Check if user provided any valid NEW retailRuntime credentials OR data encryption certificate OR RTS authentication certificate. IF not exit.
    if (-not($doesDataEncryptionCertExistInTargetStore -or $doesRTSAuthenticationCertExistInTargetStore -or $wereNewRetailRuntimeUserCredentialsSpecified -or $wereNewAxDeployUserCredentialsSpecified -or $wereNewAxDeployExtUserCredentialsSpecified))
    {
        Write-Log 'No updatable data was provided. Skipping update.' -logFile $logFile
        exit 0
    }

    # Step 5: Backup ALL files which might be potentially updated. (web.config, certs.json and commerceRuntime.config)
    $retailServerWebsite = Get-RetailServerWebsite -Name $serviceModelName
    $retailServerWebsiteRootLocation = Get-RetailServerWebRoot -retailServerWebsiteIISObject $retailServerWebsite -serviceModelName $serviceModelName

    #Note: $RunbookBackupFolder variable is populated directly from runbook.
    Backup-AllRetailServerFiles -backupFolderPath $RunbookBackupFolder -websiteName $serviceModelName -logFile $logFile

    # Step 6: If RTS authentication certificate was provided, then
    # 1) Run UpdateRetailServerAuthenticationKeys.ps1 to auto-update Web.config and Certs.json.
    # 2) Update commerceRuntime.config.
    if ($doesRTSAuthenticationCertExistInTargetStore)
    {
        Update-RTSAuthCertificate -scriptDir $scriptDir `
                                  -retailServerWebRoot $retailServerWebsiteRootLocation `
                                  -retailRTSAuthCertificateThumbprint $retailRTSAuthenticationCertificateThumbprint `
                                  -logFile $logFile
    }

    # Step 7: If Data encryption certificate was provided OR new RetailRuntimeUser provided then proceed to update web.config
    Update-RetailServerWebConfig -updateConnectionStrings $wereNewRetailRuntimeUserCredentialsSpecified `
                                 -updateEncryptionCert $doesDataEncryptionCertExistInTargetStore `
                                 -retailServerWebRoot $retailServerWebsiteRootLocation `
                                 -retailServerWebsiteId ($retailServerWebsite.id) `
                                 -dataEncryptionCertificateThumbprint $dataEncryptionCertificateThumbprint `
                                 -newRetailRuntimeUser $newRetailRuntimeUser `
                                 -newRetailRuntimeUserPassword $newRetailRuntimeUserPassword `
                                 -channelDatabaseServerName $channelDatabaseServerName `
                                 -channelDatabaseName $channelDatabaseName `
                                 -logFile $logFile

    # Step 8 : Update the channel database servicing data in web.config.
    $aosWebPath = Split-Path (Get-WebConfigFilePath -websiteName $AosWebsiteName) -Parent
    $retailServerWebConfigPath = Join-Path -Path $retailServerWebsiteRootLocation -ChildPath 'web.config'
    Decrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigPath

    $retailServerWebConfigContent = [xml](Get-Content $retailServerWebConfigPath)
    if ($wereNewAxDeployUserCredentialsSpecified)
    {
        Update-ChannelDbServicingData -newAxDeployUserKey 'DataAccess.AxAdminSqlUser' `
                                      -newAxDeployUser $newAxDeployUser `
                                      -newAxDeployUserPasswordKey 'DataAccess.AxAdminSqlPwd' `
                                      -newAxDeployUserPassword $newAxDeployUserPassword `
                                      -channelDatabaseServerName $channelDatabaseServerName `
                                      -channelDatabaseName $channelDatabaseName `
                                      -retailServerWebConfigContent $retailServerWebConfigContent `
                                      -logFile $logFile
    }

    if ($wereNewAxDeployExtUserCredentialsSpecified)
    {
        Update-ChannelDbServicingData -newAxDeployUserKey 'DataAccess.SqlUser' `
                                      -newAxDeployUser $newAxDeployExtUser `
                                      -newAxDeployUserPasswordKey 'DataAccess.SqlPwd' `
                                      -newAxDeployUserPassword $newAxDeployExtUserPassword `
                                      -channelDatabaseServerName $channelDatabaseServerName `
                                      -channelDatabaseName $channelDatabaseName `
                                      -retailServerWebConfigContent $retailServerWebConfigContent `
                                      -logFile $logFile
    }
    
    $retailServerWebConfigContent.Save($retailServerWebConfigPath)

    Decrypt-WithAxConfigEncryptorUtility -AosWebsiteName $AosWebsiteName -webConfigPath $retailServerWebConfigPath

    Write-Log ('{0} authentication data update complete.' -f $serviceModelName) $logFile
}
catch
{
    Write-Log ($global:error[0] | Format-List * -Force | Out-String -Width 4096) -logFile $logFile
    $ScriptLine = "{0}{1}" -f $MyInvocation.MyCommand.Path.ToString(), [System.Environment]::NewLine

    # RollBackChanges
    Write-Log 'Rolling back changes. Replacing files from the backup folder if any.' -logFile $logFile
    #Note: $RunbookBackupFolder variable is populated directly from runbook.
    Restore-WebSite -Name $serviceModelName -BackupFolder $RunbookBackupFolder

    # Set a non-zero unique exit code for Update-RetailServerAuthData.ps1 failure
    $exitCode = 27002
    Write-Log ("Executed:{0}$ScriptLine{0}Exiting with error code $exitCode." -f [System.Environment]::NewLine) -logFile $logFile
    exit $exitCode
}
# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCCX57INdY8UB6dL
# vltkcCtRngIvswpZk806lOikqNtqWKCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBm
# LWip/yVCmFdfrs0Us/aDzyht03DGmuGnQiBLP5BD1jCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBD
# aZ7pJVB0fSOE9uzGFUTgfZN0CK55RNCY1RW/LyKmfMNpBtkhHnvXXCI4jqNHYUBP
# NEBJqncEuuTlsjzYD8TZ4Wae2L9TWLykftMvxb2Qni74Zyn4QNsOT5RZWZOfeZxg
# Nfd2MAKSjU8efwMptgu0E1lZBxNJaAwFQs3Orkuy/onJ2RMldPGCplZBiOEps524
# G2R1juygP5QITDVEXxmw/lRV4JCNxHNcdOL1OEywNQCphXdWKZ5LBIMR34r85Z9R
# iBaWJtcHASVhyag8zXL5NKbZFx+jew/OiFXXekuB+bQpmkMHf05MTII36om694TE
# xxl8eKFxAIfeRDHaZCgMoYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# ICPewtcXsKnlQUyUNwodtEH522W9rowk+c+cdZU1YCXKAgZfPUQqGNcYEzIwMjAw
# ODIzMDQwMjQ4LjcxNVowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
# VQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25z
# IExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkQwODItNEJGRC1FRUJB
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIOPDCCBPEw
# ggPZoAMCAQICEzMAAAETs3CHPfrwyCQAAAAAARMwDQYJKoZIhvcNAQELBQAwfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTIxWhcNMjEw
# MTIxMjMxOTIxWjCByjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldBMRAwDgYDVQQH
# EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
# BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEmMCQGA1UE
# CxMdVGhhbGVzIFRTUyBFU046RDA4Mi00QkZELUVFQkExJTAjBgNVBAMTHE1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
# ggEKAoIBAQC8rcQdAVz6eZmGC6YSTczoEgLooDUMg9TrtiBFz0MYU0Zxt+VFOhoy
# K89XYNQLrQNMA4jnVUcItYlK0YWxEsM6MDchawFgVqNHuZqBthRPztMR5kYca89g
# VCN6OT6p7kIEqy2qAY2WcQ/JFeW6wiTvbjpb215t0LDODSNb2gxow8/Wt7IRo1KP
# izEqsQXFACIJo7XPutH2ryj5FqQJGqZ+53wpLM3DyixRGTAjPaimFAIe2PupWZju
# dRSVPLGDdszlKifUkwgG3JDHp12CCXcbTMmAlaENumE4BYejqjCCL4/tehOWCMOf
# M9YI667d5VS8rNg6OUMuTGCR1J9sXcYRAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
# 2pmEchsv7hcI75KRFB88I4DOnVIwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8Uz
# aFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
# L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoG
# CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
# Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0T
# AQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEA
# D3nMsICvkd9kiK7P/Wd0a1thXHfPS6Y7ijokx7uYJI/LC2LXI2nq8FN/aAPApD6X
# Zxp6cCbTcjAABbFV3egvrNGXXpvpoM9fHhe30dN1XOnohsGbXSMNl8xodi52OxR9
# GDM4jnmqY8ik98oujxhYqhcp9picL4DHtdmRasKVoJOu+qSK18BoHj9DaUfWVbKA
# K0PdrXXwx+ZdRMHXVfijntVGvmeegrigf3g1ZrP44x46VGojUtwtcO/rK4+7jiUb
# Q3RQSU8s8IcQu3IVhFVS/IUd6vkKistTi4fMARQW6t4IY7MHzDBst0ar/+PJUeM+
# 3f9+QOVK7GFHeI8Fuk1dKDCCBnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZI
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
# Ex1UaGFsZXMgVFNTIEVTTjpEMDgyLTRCRkQtRUVCQTElMCMGA1UEAxMcTWljcm9z
# b2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAPVdWkWDTnYhj
# 0pg4CbITCpe47pWggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
# MDANBgkqhkiG9w0BAQUFAAIFAOLsX9AwIhgPMjAyMDA4MjMxMTI0MDBaGA8yMDIw
# MDgyNDExMjQwMFowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA4uxf0AIBADAKAgEA
# AgID3QIB/zAHAgEAAgIRzTAKAgUA4u2xUAIBADA2BgorBgEEAYRZCgQCMSgwJjAM
# BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEB
# BQUAA4GBAB/JZSSYcl7RTR0jecLkWspmDpKYTX7PskfBoKiEH6L5VfeCDIbFl8p3
# woC/EMLkkl1h9LVrpcwXAPWKBF427E2xqXMEjiQR7/0sWQsO3ju4hVVZBxuPKWU7
# EzgngLZv1Jfac5OKnJxvGsTLCRykC/sQ8x+iIjeF6QsvcMbWJLhAMYIDDTCCAwkC
# AQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
# A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAETs3CHPfrw
# yCQAAAAAARMwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgTeJSA5EVo3tWLm8ver9NfuyJf9tvdvz2
# 1JAwphF2m9IwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCCn2hfEj3sfq1Tl
# V3qpKnRSgc+MkKUZlBsxmvC/a4BbrTCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABE7Nwhz368MgkAAAAAAETMCIEIGg4IUKfBQdZK6qB
# XgWkNW02zmnQPBMXHo47PZyCZ6FwMA0GCSqGSIb3DQEBCwUABIIBAAKC0Jp0bsPP
# thtFKZCyjre0NOfBMvGgF95J0E/753rjACrfe1wSMi0Fzn4+TeZvU2bLS8W2aX2E
# d+Rb1Xg0F8uuFZ6U1BGDd9u1HXB5Phli0aUeDAFbDE2/23rm3d4Pw4G1CJUFQYLZ
# cUtXiKAIZ+esmnRSDeP3n5a0pC7teRC6nHC6RKJsJUjOFoKisrAjYO03qpQckVO9
# 8PISKFPBmhmV0OvoDutDoI/NFKsXrg+xSoDRZvmbFqyD7NdHTzcCm68etf9cegka
# LgOasuoARs+ZJoiE+A225dRGHLRVT86xcS73q7Gmq79hLJqhqQjbZ2TYSVbIyAwr
# 1HN5hC5TdUs=
# SIG # End signature block
