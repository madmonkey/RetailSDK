<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

<#
.SYNOPSIS
    Registers a set of Performance Counters defined in a specific assembly.

.PARAMETER  InstrumentedAssemblyPath
    Path to the assembly containing the PerfCounterManager implementation from which
    to retrieve the set of Performance Counters to register.

.PARAMETER  log
    Log file name. Messages will write to console if this parameter is not specified.
    
#>
PARAM (
    [ValidateNotNullOrEmpty()]
    [string]$InstrumentedAssemblyPath,
    $log
)

$PredefinedPerfCounters = @{
	"TotalCalls" = "NumberOfItems64";
	"TotalCallsPerSecond" = "RateOfCountsPerSecond32";
	"SucceededCalls" = "NumberOfItems64";
	"SucceededCallsPerSecond" = "RateOfCountsPerSecond32";
	"SucceededCallsRatio" = "SampleFraction";
	"SucceededCallsRatioBase" = "SampleBase";
	"FailedCalls" = "NumberOfItems64";
	"FailedCallsPerSecond" = "RateOfCountsPerSecond32";
	"FailedCallsRatio" = "SampleFraction";
	"FailedCallsRatioBase" = "SampleBase";
	"AverageLatencyInMs" = "AverageCount64";
	"AverageLatencyInMsBase" = "AverageBase";
	"LastLatencyInMs" = "NumberOfItems64";
}

<# 
    .Synopsis 
        Retrieves all performance counters defined in the instrumented assembly.
#>
function Write-Log
{
    PARAM ([string]$message)
	
    Write-output $message > $null
    if (![System.String]::IsNullOrWhiteSpace($log)) 
    { 
        Add-content "$log" ("`n[{0}]: {1}`n" -f (Get-Date), $message) > $null
    }
}

<# 
    .Synopsis 
        Retrieves all performance counters defined in the instrumented assembly.
#>         
function Get-PerfCountersFromInstrumentedAssembly
{
    PARAM ([validatenotnullorempty()][string]$InstrumentedAssemblyPath)
    
    Write-Log "Retrieving performance counters from instrumented assembly $InstrumentedAssemblyPath."
    Write-Log "Loading assembly $InstrumentedAssemblyPath."
    $InstrumentedAssembly = [Reflection.Assembly]::LoadFrom($InstrumentedAssemblyPath)

    Write-Log "Retrieving PerfCounterManager class from instrumented assembly."
    $PerfCounterManagerClass = $InstrumentedAssembly.GetTypes() | Where { $_.Name -eq "PerfCounterManager" }
    
    Write-Log "Retrieving Perf Counters from PerfCounterManager class."
    $PerfCounters = [Microsoft.Dynamics.Retail.Diagnostics.PerfCounterManager]::RetrievePerfCountersFromAssembly()
    
    return $PerfCounters
}

<# 
    .Synopsis 
        Creates a single performance counter.
#>  
function Create-PerfCounter
{
    PARAM([validatenotnull()]$PerfCounterCollection,
          [validatenotnullorempty()][string]$PerfCounterName,
          [validatenotnullorempty()][string]$PerfCounterType)
    
    Write-Log "Creating Perf Counter '$PerfCounterName' of type '$PerfCounterType'."
    
    $PerfCounter = New-Object -TypeName System.Diagnostics.CounterCreationData
    $PerfCounter.CounterName = $PerfCounterName
    $PerfCounter.CounterType = $PerfCounterType
    $PerfCounterCollection.Add($PerfCounter) | out-null
}

<# 
    .Synopsis 
        Creates a collection of performance counters for the boundary perf counter category.
#>  
function Create-BoundaryPerfCounterCollection
{
    PARAM([validatenotnull()]$PerfCounterCollection,
          [validatenotnull()]$PerfCounterCategoryProperties)
    
    Write-Log "Creating the Perf Counter Collection for Perf Counter Category $PerfCounterCategoryName."
    
    foreach ($PredefinedPerfCounter in $PredefinedPerfCounters.GetEnumerator() | Sort-Object Name)
    {
        Create-PerfCounter -PerfCounterCollection $PerfCounterCollection -PerfCounterName $PredefinedPerfCounter.Key -PerfCounterType $PredefinedPerfCounter.Value
    }
    
    foreach ($PerfCounterCategoryProperty in $PerfCounterCategoryProperties)
    {
        if ($PerfCounterCategoryProperty.PerfCounterType -eq "NumberOfItems")
        {
            $PerfCounterAverageName = $PerfCounterCategoryProperty.Name + "Average"
            $PerfCounterAverageBaseName = $PerfCounterCategoryProperty.Name + "AverageBase"
            Create-PerfCounter -PerfCounterCollection $PerfCounterCollection -PerfCounterName $PerfCounterCategoryProperty.Name -PerfCounterType "NumberOfItems64"
            Create-PerfCounter -PerfCounterCollection $PerfCounterCollection -PerfCounterName $PerfCounterAverageName -PerfCounterType "AverageCount64"
            Create-PerfCounter -PerfCounterCollection $PerfCounterCollection -PerfCounterName $PerfCounterAverageBaseName -PerfCounterType "AverageBase"
        }
    }
}

<# 
    .Synopsis 
        Registers a single performance counter category with the OS.
#>  
function Register-PerfCounterCategory
{
    PARAM([validatenotnull()]$PerfCounterCategory)

    $PerfCounterCategoryName = $PerfCounterCategory.Name
    Write-Log "Registering the Perf Counter Category $PerfCounterCategoryName."
    
    if ([System.Diagnostics.PerformanceCounterCategory]::Exists($PerfCounterCategoryName))
    {
        Write-Log "The Performance Counter Category $PerfCounterCategoryName already exists.  Deleting it..."
        [System.Diagnostics.PerformanceCounterCategory]::Delete($PerfCounterCategoryName)
    }
    
    $PerfCounterCategoryName = $PerfCounterCategory.Name
    
    $PerfCounterCollection = New-Object -TypeName System.Diagnostics.CounterCreationDataCollection
    Create-BoundaryPerfCounterCollection -PerfCounterCollection $PerfCounterCollection -PerfCounterCategoryProperties $PerfCounterCategory.Properties
    
    if ($PerfCounterCategory.IsMultiInstance)
    {
        $PerfCounterCategoryType = [System.Diagnostics.PerformanceCounterCategoryType]::MultiInstance
    }
    else
    {
        $PerfCounterCategoryType = [System.Diagnostics.PerformanceCounterCategoryType]::SingleInstance
    }
    [System.Diagnostics.PerformanceCounterCategory]::Create($PerfCounterCategoryName, $PerfCounterCategoryName, $PerfCounterCategoryType, $PerfCounterCollection)
}

<# 
    .Synopsis 
        Initializes a new instance for the performance counter.
#>     
function Initialize-PerfCounterInstance
{
    PARAM([validatenotnull()]$PerfCounterCategoryName,
          [validatenotnull()]$PerfCounterName,
          [validatenotnull()]$InstanceName,
          [validatenotnull()]$ReadOnly)
    
    Write-Log "Creating Perf Counter instance '$InstanceName' inside category '$PerfCounterCategoryName'."
	
    $CounterInstance = New-Object System.Diagnostics.PerformanceCounter
	$CounterInstance.CategoryName = $PerfCounterCategoryName
	$CounterInstance.CounterName = $PerfCounterName
	$CounterInstance.InstanceName = $InstanceName    
	$CounterInstance.InstanceLifetime = [System.Diagnostics.PerformanceCounterInstanceLifetime]::Global
	$CounterInstance.ReadOnly = $ReadOnly
	$CounterInstance.RawValue = 0;
}

<# 
    .Synopsis 
        Creates a default instance of the performance counter.
#>  
function Create-DefaultInstance
{
    PARAM([validatenotnull()]$PerfCounterCategory)
    
    $PerfCounterCategoryName = $PerfCounterCategory.Name
	
    foreach ($PredefinedPerfCounter in $PredefinedPerfCounters.GetEnumerator() | Sort-Object Name)
    {
		Initialize-PerfCounterInstance -PerfCounterCategoryName $PerfCounterCategory.Name -PerfCounterName $PredefinedPerfCounter.Key -InstanceName "Default" -ReadOnly $false
    }
    
    foreach ($PerfCounterCategoryProperty in $PerfCounterCategoryProperties)
    {
        if ($PerfCounterCategoryProperty.PerfCounterType -eq "NumberOfItems")
        {
            $PerfCounterAverageName = $PerfCounterCategoryProperty.Name + "Average"
            $PerfCounterAverageBaseName = $PerfCounterCategoryProperty.Name + "AverageBase"
			
			Initialize-PerfCounterInstance -PerfCounterCategoryName $PerfCounterCategory.Name -PerfCounterName $PerfCounterCategoryProperty.Name -InstanceName "Default" -ReadOnly $false
			Initialize-PerfCounterInstance -PerfCounterCategoryName $PerfCounterCategory.Name -PerfCounterName $PerfCounterAverageName -InstanceName "Default" -ReadOnly $false
			Initialize-PerfCounterInstance -PerfCounterCategoryName $PerfCounterCategory.Name -PerfCounterName $PerfCounterAverageBaseName -InstanceName "Default" -ReadOnly $false
        }
    }
}

<# 
    .Synopsis 
        Registers a list of performance counters categories defined in the instrumented assembly.
#>     
function Register-PerfCounterCategories
{
    PARAM ([validatenotnullorempty()][string]$InstrumentedAssemblyPath)
    
    $PerfCounterCategories = Get-PerfCountersFromInstrumentedAssembly $InstrumentedAssemblyPath
    
    Write-Log "The loaded perf counters from assembly '$PerfCounterCategories'."
    
    foreach ($PerfCounterCategory in $PerfCounterCategories)
    {
        Register-PerfCounterCategory $PerfCounterCategory
        
        if ($PerfCounterCategory.IsMultiInstance)
        {
            Create-DefaultInstance $PerfCounterCategory
        }
    }
}

try
{
    Register-PerfCounterCategories -InstrumentedAssemblyPath $InstrumentedAssemblyPath
}
catch
{
    Write-Log $_ + "`r`n`r`n"
    
    if ($_.Exception -ne $null)
    {
        Write-Log $_.Exception + "`r`n`r`n"
    }
    
    throw $_
}
# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDN64FaUBG2oBd0
# 9+mKYfDD5U3qqn2SWTh+6QsImpBf9KCCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# cVZOSEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFeEwghXdAgEBMIGVMH4x
# CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
# b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01p
# Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMTECEzMAAAGIr1LWuZJt6PkAAAAA
# AYgwDQYJYIZIAWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEE
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCDx
# /CcVvvq1sCAhVR4EQ+ErJjGNPx333c7ToofaeK2PGzCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQA4
# uPOEQ/2LekyxHLFuo9oWtMIN+O0inlII7BQNnfHKfbH4kL12kk9HzU5BytltfoEe
# u4xwwDFmBcbjf2vINL06wIn5mofCTG0LCJ8S6wp0WwYTDXNR+ih7Hhb05+ithZAv
# pvg+fF/LLgGLP1/cTZYYwqQxu3S98XHpNsv9+xk8qcSXfjdpJFEKG02KXgO26k5B
# z6s4ugVwOP6k0uicv459XY8G486ow4tgU1QlrNb5fEcj06Ul964UNtZgdulnBY6S
# h5dRICbLu0xmFp4tgya/Xlr2SA2zWgf0lMyurzHvZRBWAMJgaLcWFpkKbo2jL+UJ
# nTvi/0hmc/JnDtVP7wjxoYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IHMN+qk5avRMBg9CdV248mex1uVktL/44U6mR/DXIugDAgZfO+Nacr0YEzIwMjAw
# ODIzMDQwMjQ2LjY4NVowBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25z
# IFB1ZXJ0byBSaWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo2MEJDLUUzODMt
# MjYzNTElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaCCDkQw
# ggT1MIID3aADAgECAhMzAAABJt+6SyK5goIHAAAAAAEmMA0GCSqGSIb3DQEBCwUA
# MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
# ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
# HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTIxOTAxMTQ1OVoX
# DTIxMDMxNzAxMTQ1OVowgc4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
# dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
# YXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNv
# MSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo2MEJDLUUzODMtMjYzNTElMCMGA1UE
# AxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEB
# BQADggEPADCCAQoCggEBAJ4wvoacTvMNlXQTtfF/Cx5Ol3X0fcjUNMvjLgTmO5+W
# HYJFbp725P3+qvFKDRQHWEI1Sz0gB24urVDIjXjBh5NVNJVMQJI2tltv7M4/4Ibh
# ZJb3xzQW7LolEoZYUZanBTUuyly9osCg4o5joViT2GtmyxK+Fv5kC20l2opeaept
# d/E7ceDAFRM87hiNCsK/KHyC+8+swnlg4gTOey6zQqhzgNsG6HrjLBuDtDs9izAM
# wS2yWT0T52QA9h3Q+B1C9ps2fMKMe+DHpG+0c61D94Yh6cV2XHib4SBCnwIFZAeZ
# E2UJ4qPANSYozI8PH+E5rCT3SVqYvHou97HsXvP2I3MCAwEAAaOCARswggEXMB0G
# A1UdDgQWBBRJq6wfF7B+mEKN0VimX8ajNA5hQTAfBgNVHSMEGDAWgBTVYzpcijGQ
# 80N7fEYbxTNoWoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jv
# c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0w
# MS5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
# Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNy
# dDAMBgNVHRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
# CwUAA4IBAQBAlvudaOlv9Cfzv56bnX41czF6tLtHLB46l6XUch+qNN45ZmOTFwLo
# t3JjwSrn4oycQ9qTET1TFDYd1QND0LiXmKz9OqBXai6S8XdyCQEZvfL82jIAs9pw
# sAQ6XvV9jNybPStRgF/sOAM/Deyfmej9Tg9FcRwXank2qgzdZZNb8GoEze7f1orc
# TF0Q89IUXWIlmwEwQFYF1wjn87N4ZxL9Z/xA2m/R1zizFylWP/mpamCnVfZZLkaf
# FLNUNVmcvc+9gM7vceJs37d3ydabk4wR6ObR34sWaLppmyPlsI1Qq5Lu6bJCWoXz
# YuWpkoK6oEep1gML6SRC3HKVS3UscZhtMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAA
# AjANBgkqhkiG9w0BAQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEyMDAGA1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0
# aG9yaXR5IDIwMTAwHhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAxMjE0NjU1WjB8MQsw
# CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
# ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
# b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDCCASIwDQYJKoZIhvcNAQEBBQADggEP
# ADCCAQoCggEBAKkdDbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX77XxoSyxfxcPl
# YcJ2tz5mK1vwFVMnBDEfQRsalR3OCROOfGEwWbEwRA/xYIiEVEMM1024OAizQt2T
# rNZzMFcmgqNFDdDq9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0ySwcSmXdFh
# E24oxhr5hoC732H8RsEnHSRnEnIaIYqvS2SJUGKxXf13Hz3wV3WsvYpCTUBR0Q+c
# Bj5nf/VmwAOWRH7v0Ev9buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn
# 9NxkvaQBwSAJk3jN/LzAyURdXhacAQVPIk0CAwEAAaOCAeYwggHiMBAGCSsGAQQB
# gjcVAQQDAgEAMB0GA1UdDgQWBBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEE
# AYI3FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB
# /zAfBgNVHSMEGDAWgBTV9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEug
# SaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
# aWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsG
# AQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jv
# b0NlckF1dF8yMDEwLTA2LTIzLmNydDCBoAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEE
# AYI3LgMwgYEwPQYIKwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9Q
# S0kvZG9jcy9DUFMvZGVmYXVsdC5odG0wQAYIKwYBBQUHAgIwNB4yIB0ATABlAGcA
# YQBsAF8AUABvAGwAaQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZI
# hvcNAQELBQADggIBAAfmiFEN4sbgmD+BcQM9naOhIW+z66bM9TG+zwXiqf76V20Z
# MLPCxWbJat/15/B4vceoniXj+bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX
# /1z5Xhc1mCRWS3TvQhDIr79/xn/yN31aPxzymXlKkVIArzgPF/UveYFl2am1a+TH
# zvbKegBvSzBEJCI8z+0DpZaPWSm8tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnx
# zplmkIz/amJ/3cVKC5Em4jnsGUpxY517IW3DnKOiPPp/fZZqkHimbdLhnPkd/DjY
# lPTGpQqWhqS9nhquBEKDuLWAmyI4ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kW
# umGnEcua2A5HmoDF0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/nMQekkzr3
# ZUd46PioSKv33nJ+YWtvd6mBy6cJrDm77MbL2IK0cs0d9LiFAR6A+xuJKlQ5slva
# yA1VmXqHczsI5pgt6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnPGUFN4Ib5
# KpqjEWYw07t0MkvfY3v1mYovG8chr1m1rtxEPJdQcdeh0sVV42neV8HR3jDA/czm
# TfsNv11P6Z0eGTgvvM9YBS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkSoYIC
# 0jCCAjsCAQEwgfyhgdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
# aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
# cG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRpb25zIFB1ZXJ0byBS
# aWNvMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo2MEJDLUUzODMtMjYzNTElMCMG
# A1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIa
# AxUACmcyOWmZxErpq06B8dy6oMZ6//yggYMwgYCkfjB8MQswCQYDVQQGEwJVUzET
# MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
# dGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0BAQUFAAIFAOLsUGswIhgPMjAyMDA4MjMw
# NjE4MTlaGA8yMDIwMDgyNDA2MTgxOVowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA
# 4uxQawIBADAKAgEAAgIliwIB/zAHAgEAAgIQ9DAKAgUA4u2h6wIBADA2BgorBgEE
# AYRZCgQCMSgwJjAMBgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYag
# MA0GCSqGSIb3DQEBBQUAA4GBALLfixUPtkW1r44t1llI8//i0v5JgRg+v04koPze
# xogNdT+4ATifuJEEirzMj1JBB0gZeYHK0isTu2XVNEGzrd+SCh1erpXJNjfMVGCe
# rf0AELzShVX5FBacGVwaFKkC+WQmAMe29+v7ASXPsGTB3lfkO1JpA7/aXPYR+D4q
# r/ymMYIDDTCCAwkCAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAC
# EzMAAAEm37pLIrmCggcAAAAAASYwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgldApnEg0qM85DyX0
# 8Ovc4HsGunea6hD8MaxBL8tJhYgwgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCA2/c/vnr1ecAzvapOWZ2xGfAkzrkfpGcrvMW07CQl1DzCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABJt+6SyK5goIHAAAAAAEmMCIE
# ICdABdj+RdV3+4DCeZQlEoS7USHGBlLTDpfdPgnzm2q3MA0GCSqGSIb3DQEBCwUA
# BIIBAIU8kHTUSjMawe7/max1Rv8jYiCQumVo/OGwhF5pm+XXVVnGOih4jzEdhs+T
# l09FzhqeNoA3seJVg0y2sqdkTxyzaYoI7Any1kPVw1XsW3MxWWD3pxDT0ttZR9PO
# Ak9Fvj/5zrSiNNfds/1mJDGfsVNKCfDjkHiLlyJ2HdCVuYZ4MC96z0yOp3EMHmPN
# QFSwXFe0XJz2qiRDexQeCpMABQ/hjRPb68uOo4HiIv/0sk4PYQLwYAhWctp1w+1a
# v/bgXzHeBKJ6Pa5i4erAoQOItg/7wsQWEUNh8Su34VCJdA/u0v86pFO1LTTGJJ9f
# HT+8bV91BcfcUnrsiF/YuZZBsa8=
# SIG # End signature block
