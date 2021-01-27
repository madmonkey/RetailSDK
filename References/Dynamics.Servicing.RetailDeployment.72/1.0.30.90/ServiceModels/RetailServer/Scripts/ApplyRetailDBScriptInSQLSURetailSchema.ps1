param(
    [string]$config = $(Throw 'config parameter required'), 
    [string]$log = $(Throw 'log parameter required'),
    [string]$channelDatabaseDacpacFolderOverridePath,
    [string]$customScriptFolderOverridePath
)
function Drop-ExistingChannelDatabaseSchema(
    [string]$serviceModelRootPath = $(Throw 'serviceModelRootPath parameter required'),
    [string]$config = $(Throw 'config parameter required'),
    [string]$log = $(Throw 'log parameter required')
)
{
    $dropChannelDatabaseSchemaScriptPath = Join-Path -Path $serviceModelRootPath -ChildPath 'Scripts\ApplyRetailDBScriptInSQLSUDropObjects.ps1'
    Write-Log -Message 'Dropping existing retail channel database schema'

    $global:LASTEXITCODE = 0
    & $dropChannelDatabaseSchemaScriptPath -config $config -log $log
    $capturedExitCode = $global:LASTEXITCODE

    if ($capturedExitCode -ne 0)
    {
        $errorMessage = "Error dropping existing retail channel database schema, exit code: $capturedExitCode"
        Write-Log -Message  $errorMessage -IsError
    }

    Write-Log -Message 'Successfully dropped existing retail channel database schema'
}

$global:LASTEXITCODE = 0

$settings = @{}
try
{
    $decodedConfig = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($config))
    $settings = ConvertFrom-Json $decodedConfig

    $ScriptDir = Split-Path -Parent $PSCommandPath
    . $ScriptDir\Common-Configuration.ps1
    . $ScriptDir\Common-Database.ps1
    
    $dbServer = $settings.AxDbServer
    $dbName = $settings.AxDbName
    $dbUser = $settings.AxDbDeploySqlUser
    $dbPassword = $settings.AxDbDeploySqlPwd
    $retailRunTimeUser = $settings.dbUser
    $retailRunTimeUserPassword = $settings.dbPassword
    $retailDataSyncDbUser = $settings.dataSyncDbUser
    $retailDataSyncDbUserPassword = $settings.dataSyncDbUserPassword
    $retailExtensionsUser = $settings.AxDeployExtUser
    $retailExtensionsUserPassword = $settings.AxDeployExtUserPassword

    Write-Log ('Parameters retrieved from configuration string: dbServer = {0}; dbName = {1}; dbUser = {2}; dbPassword: *******; retailRunTimeUser = {3}; retailRuntimeDbUser = {4}; retailExtensionsUser = {5}' `
            -f $dbServer, $dbName, $dbUser, $retailRunTimeUser, $retailDataSyncDbUser, $retailExtensionsUser)

    $retailUsersToEnsure = @{$retailRunTimeUser = $retailRunTimeUserPassword; $retailDataSyncDbUser = $retailDataSyncDbUserPassword; $retailExtensionsUser = $retailExtensionsUserPassword}
    foreach($user in $retailUsersToEnsure.Keys)
    {
        try
        {
            $password = $retailUsersToEnsure[$user]
            $queryToEnsureUser = "
                DECLARE @isSqlAzure BIT
                SELECT @isSqlAzure = 0
                DECLARE @errorCode INT
                SELECT @errorCode = 0

                if (CHARINDEX('SQL Azure',@@VERSION) > 0)
                BEGIN
                    SELECT @isSqlAzure = 1
                END

                IF (@isSqlAzure = 0) -- Handle non SQL Azure
                BEGIN
                    -- Create login if not exists
                    IF NOT EXISTS(SELECT 1 FROM dbo.syslogins WHERE [NAME] = '$user')
                    BEGIN
                        CREATE LOGIN $user WITH PASSWORD = '$password'
                        SELECT @errorCode = @errorCode | 1
                    END

                    -- Create user from the login
                    IF NOT EXISTS (SELECT 1 FROM [sys].[sysusers] WHERE [NAME] = '$user' AND issqluser = 1)
                    BEGIN
                        CREATE USER $user FOR LOGIN $user
                        SELECT @errorCode = @errorCode | 4
                    END
                    
                    ALTER LOGIN $user WITH PASSWORD = '$password'
                    
                    -- Reassociate user and login
                    EXEC sp_change_users_login 'Update_One', '$user', '$user'

                END
                ELSE -- Handle SQL Azure
                BEGIN
                    -- SQL Azure login creation requires access to master database, we may not have this permission in current context, skip this part for now.
                    -- IF NOT EXISTS (SELECT 1 FROM [master].[sys].[sql_logins] WHERE [NAME] = '$user')
                    -- BEGIN
                    --  CREATE LOGIN $user WITH PASSWORD = '$password'
                    -- END

                    -- Create user if not exists
                    IF NOT EXISTS (SELECT 1 FROM [sys].[sysusers] WHERE [NAME] = '$user' AND islogin = 1 AND issqluser = 1)
                    BEGIN
                        -- For SQL Azure when the user is not available for login then we can't provision it during the script execution
                        -- needs to be provisioned in the 'master' database by DSE
                        -- RAISERROR('User $user not found as a valid login, it will need to be created in the master database, and the user should be created in the $dbName.  In Production environments this should be done by DSE team', 16, 1)
                        SELECT @errorCode = @errorCode | 8
                    END
                END
                SELECT @errorCode AS ErrorCode "
            Write-Log "Ensure user $user"
            $result = Invoke-SqlCmd -ServerInstance $dbServer -Database  $dbName -Username $dbUser -Password $dbPassword -Query $queryToEnsureUser -ErrorAction Stop
            
            if($result.ErrorCode -gt 0)
            {
                # This will leave the environment with a state that the Retail function may not work correctly.
                # But we will just generate a warning here in order not to break the updgrade automation. 
                # Migitation plan has been created to fix this environment with manual steps.
                Write-Warning "WARNING: Login or User '$user' doesn't exist in database, ErrorCode $($result.ErrorCode)."
            }
        }
        catch
        {
            $message = ($global:error[0] | format-list * -f | Out-String)
            Write-Warning "WARNING:$message"
        }
    }

    $PackageDirectory = Split-Path -Parent $ScriptDir
    $dbDeploymentAssetsRoot = Join-Path $PackageDirectory 'Data'
    
    $ChannelDatabaseBaselineScriptPath = Join-Path $dbDeploymentAssetsRoot 'CommerceRuntimeScripts_Create.sql'
    $ChannelDatabaseUpgradeCustomScriptFolderPath = Join-Path $dbDeploymentAssetsRoot 'Upgrade\Custom'
    $ChannelDatabaseUpgradeDacpacFileFolderPath = $dbDeploymentAssetsRoot
    $ChannelDatabaseUpgradeRetailScriptFolderPath = Join-Path $dbDeploymentAssetsRoot 'Upgrade\Retail'

    if (-not [String]::IsNullOrWhitespace($channelDatabaseDacpacFolderOverridePath))
    {
        # we only need to change $ChannelDatabaseUpgradeDacpacFileFolderPath because that is the only path used by Common-Database
        # to retrieve the dacpac used to create/update the database when deploying the channel database
        Write-Log "Channel database dacpac folder path was overriden to: $channelDatabaseDacpacFolderOverridePath"
        $ChannelDatabaseUpgradeDacpacFileFolderPath = $channelDatabaseDacpacFolderOverridePath
    }

    # If $customScriptFolderOverridePath is specified, use it to apply the database customizations.
    if (-not [String]::IsNullOrWhitespace($customScriptFolderOverridePath))
    {
        Write-Log "Channel database custom scripts folder path was overriden to: $customScriptFolderOverridePath"
        $ChannelDatabaseUpgradeCustomScriptFolderPath = $customScriptFolderOverridePath
    }

    # Drop the existing channel database schema before attempting to regenerate it.
    # By default, this step will be executed for initial deployment since the databackup may contains retail schema.
    # For minor version upgrdade, this step will be skipped since we want to perform a in-pleace upgrade.
    if($settings.SkipDatabaseSchemaDeletion -ieq "true")
    {
        Write-Log "SkipDatabaseSchemaDeletion is set to true, will skip the schema deletion."
    }
    else
    {
        Drop-ExistingChannelDatabaseSchema -serviceModelRootPath $PackageDirectory -config $config -log $log
    }
    
    $channelDbTopology = Join-Path $ScriptDir 'channeldb-topology-cloud.xml'
    $channelDbSettingTemplate = Join-Path $ScriptDir 'channeldb-settings-cloud.xml'
    $ChannelDbSettingCloud = Join-Path $ScriptDir 'channeldb-settings-cloudupdated.xml'
    $credentials = New-Object System.Management.Automation.PSCredential($dbUser, (ConvertTo-SecureString $dbPassword -AsPlainText -Force))
    $extensionUserCredentials = New-Object System.Management.Automation.PSCredential($retailExtensionsUser, (ConvertTo-SecureString $retailExtensionsUserPassword -AsPlainText -Force))



    Write-Log "Trying to upgrade Retail Channel database."
    
    Write-Log "setting up $ChannelDbSettingCloud for Microsoft upgrade."

    Set-Location $ScriptDir
    
    Invoke-Script -scriptBlock `
    {
        & (Join-Path $ScriptDir 'Setup-SettingsForDatabaseDeployment.ps1') `
                                -channelDatabaseServerName $dbserver `
                                -channelDatabaseName $dbname `
                                -SqlUserName $dbUser `
                                -ChannelDatabaseBaselineScriptPath $ChannelDatabaseBaselineScriptPath `
                                -ChannelDatabaseUpgradeCustomScriptFolderPath $ChannelDatabaseUpgradeCustomScriptFolderPath `
                                -ChannelDatabaseUpgradeDacpacFileFolderPath $ChannelDatabaseUpgradeDacpacFileFolderPath `
                                -ChannelDatabaseUpgradeRetailScriptFolderPath $ChannelDatabaseUpgradeRetailScriptFolderPath `
                                -SettingsXmlFilePathInput $channelDbSettingTemplate `
                                -SettingsXmlFilePathOutput $ChannelDbSettingCloud
    } -logFile $log
    
    Write-Log "Finished setting up $ChannelDbSettingCloud for Microsoft upgrade."
    Write-Log "Trying to upgrade base version for Retail Channel database."

    Invoke-Script -scriptBlock `
    {
        & (Join-Path $ScriptDir 'Deploy-Databases.ps1') `
                                -TopologyXmlFilePath $channelDbTopology `
                                -SettingsXmlFilePath $ChannelDbSettingCloud `
                                -Credentials $credentials `
                                -Verbose $True `
                                -DeploymentType "ChannelDB"
    } -logFile $log
    
    Write-Log "Finished upgrading base version for Retail Channel database."

    Log-TimedMessage 'Update roles for retail database users.'
    Set-RolesForCloudRetailChannelDatabase `
                            -Server $dbServer `
                            -Database $dbName `
                            -Credentials $credentials
    Log-TimedMessage 'Finished updating roles for retail database users.'

    Write-Log "setting up $ChannelDbSettingCloud for upgrading customizations for Retail Channel database."
    
    Invoke-Script -scriptBlock `
    {
        & (Join-Path $ScriptDir 'Setup-SettingsForDatabaseDeployment.ps1') `
                                -channelDatabaseServerName $dbserver `
                                -channelDatabaseName $dbname `
                                -SqlUserName $retailExtensionsUser `
                                -ChannelDatabaseBaselineScriptPath $ChannelDatabaseBaselineScriptPath `
                                -ChannelDatabaseUpgradeCustomScriptFolderPath $ChannelDatabaseUpgradeCustomScriptFolderPath `
                                -ChannelDatabaseUpgradeDacpacFileFolderPath $ChannelDatabaseUpgradeDacpacFileFolderPath `
                                -ChannelDatabaseUpgradeRetailScriptFolderPath $ChannelDatabaseUpgradeRetailScriptFolderPath `
                                -SettingsXmlFilePathInput $channelDbSettingTemplate `
                                -SettingsXmlFilePathOutput $ChannelDbSettingCloud
    } -logFile $log

    Write-Log "Finished setting up $ChannelDbSettingCloud for upgrading customizations for Retail Channel database."
    Write-Log "Trying to upgrade customizations for Retail Channel database."

    Invoke-Script -scriptBlock `
    {
        & (Join-Path $ScriptDir 'Deploy-Databases.ps1') `
                                -TopologyXmlFilePath $channelDbTopology `
                                -SettingsXmlFilePath $ChannelDbSettingCloud `
                                -Credentials $extensionUserCredentials `
                                -Verbose $True `
                                -DeploymentType "Customizations"
    } -logFile $log
    
    Write-Log "Finished upgrading customizations for Retail Channel database."
    
    
    $capturedExitCode = $global:LASTEXITCODE
    if($capturedExitCode -ne 0)
    {
        $errorMessage = "Error deploying retail channel database, exit code: $capturedExitCode"
        Write-Log -Message  $errorMessage -IsError
        throw $errorMessage
    }

    exit $capturedExitCode
}
catch
{
    # Will throw if the database deployment fails, generally this is a critical failure and it should fail, leave it to the caller to handle it if necessary.
    $exceptionMsg = ($global:error[0] | Format-List * -f | Out-String)
    $errorMsg = "Error executing the script ApplyRetailDBScriptInSQLSURetailSchema: $exceptionMsg."
    Write-Log $errorMsg
    throw $errorMsg
}
# SIG # Begin signature block
# MIIkBAYJKoZIhvcNAQcCoIIj9TCCI/ECAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBb25ipRhR1PNWR
# 1SMmAyb04EwreWZqQb9JgPiEgZ6toqCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBg
# 6v8EtCAa0vniTKZeKzTd80nilgKRBFumufnXwcerQDCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBQ
# P4jbQfykpddrEomjsAFk4pTs8tufl6rR2MEWiUWFoG0Oxw/VV/RtiK2/vos0g3wh
# NO6aYIm5H6BBt+iGiOwPhtdHWwquW5GgVhxIGHf+Xp1+b6/1A1fXmXIJRFs37Xnj
# LVPs0k6VhH8ckt7XPmWD0TcHYSr5rTGiO69GxTYuhLDn3MGyxdrZOfmptW6V7M60
# IgjYvvyTkd3toDJp4qDTpwUVMprFX5mKA8yNfiIsFobg13oMJQRWwyTK/8hW1/mo
# mckIwAaNLkPZHM30TjTk7dTwv4jaiib/nmQuU9RIlNNkQ6XPc1hKuDzB/q7aZjSE
# CGV/xtPPrTDeqJwwKzbToYIS5TCCEuEGCisGAQQBgjcDAwExghLRMIISzQYJKoZI
# hvcNAQcCoIISvjCCEroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3DQEJ
# EAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IEH7gUOSmmdoF63rLOkDWYXbvUSc2vckhb3z2TWtBLQrAgZfPSuXhtEYEzIwMjAw
# ODIzMDQwMjQ5LjI4NFowBIACAfSggdCkgc0wgcoxCzAJBgNVBAYTAlVTMQswCQYD
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
# 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgT6V0JvW/G1tPysFlr21EqEStVZf2NQC5
# OOZUEVg/abcwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCBXAzYkM7qhDCgN
# 6EbxXbZtR3HNkNZaGSMYHzfL5NKsqjCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
# EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
# aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
# YW1wIFBDQSAyMDEwAhMzAAABClLIOQFS0XBLAAAAAAEKMCIEIBqZiGzGyIFc26q+
# oooMu/H2aOjzZBnUZTqvwvMjKN1IMA0GCSqGSIb3DQEBCwUABIIBAK2HZMhb5X8U
# 1V6HIUE5Y/IxoZ7pZOhq3AN3gxP4eB18/2SHgQ5+ttpV3KG48AuwN/9Cx7Nkl/RV
# 28Q4WmArwokbvQrO7hn0EYnQ6fQr8gUcpOj4C1sLtKfxTK5ldHIQ58IW/y3YFMiD
# 2Ncc3ODAwTzSNsxUvtKjTwO2MnefGlM/hxVvqyRETHflP8mLP0UUs0cfS7/Z3G10
# O7gnVHnW8vMECGNDV/8mgRhmz5WP2UvZzq3mA/+ZoNafXo+TeMhW+SxfCFxcij8o
# 8uyYs3NBjqfAR4IDZDkG9N1KI+0RMsPTkggm/T6u6XXkqF/rBkNHo9WKN/oGG9iE
# QIS8QVV0iLU=
# SIG # End signature block
