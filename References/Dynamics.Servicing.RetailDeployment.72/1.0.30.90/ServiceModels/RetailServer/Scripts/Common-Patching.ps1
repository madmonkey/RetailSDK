<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

function Locate-ConfigFile
{
    param(
        [string]$ScriptDirectory = $(Throw 'ScriptDirectory parameter required'),

        [string]$ConfigFileName = $(Throw 'ConfigFileName parameter required'),

        [ValidateSet("RetailServer", "HardwareStation", "AsyncClient", IgnoreCase = $false)]
        [string]$ComponentType = $(Throw 'ComponentType parameter required')
    )

    Log-TimedMessage 'Trying to locate configuration file...'

    $configFilePath = $null;

    switch -Regex ($ComponentType) 
    {
        "RetailServer|HardwareStation|AsyncClient"
        {
            $configFileFolder = Join-Path -Path (Get-Item -Path $ScriptDirectory).Parent.FullName -ChildPath 'Package'
            $configFilePath = Join-Path -Path $configFileFolder -ChildPath $ConfigFileName

            if ((Test-Path -Path $configFilePath))
            {
                Log-TimedMessage ('Found configuration file at {0}' -f $configFilePath)
            }
            else
            {
                throw 'ERROR! Missing configuration file from installation.'
            }
        }

        default 
        {
            throw 'Component not supported.'
        }
    }

    return $configFilePath
}

<#
.SYNOPSIS
Adds element to a .config file:

    <section name="commerceRuntime" type="Microsoft.Dynamics.Commerce.Runtime.Configuration.CommerceRuntimeSection, Microsoft.Dynamics.Commerce.Runtime.ConfigurationProviders, Version=6.3.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, processorArchitecture=MSIL"/>

in the XML section with XPath:
    
    '/configuration/configSections'

The above section sets AutoFlush property of the listener set to true.
#>
function Update-CommerceRuntimeConfigurationSectionClass
{
    param(
        [xml]$ConfigXml = $(Throw 'ConfigXml parameter required'),
        
        [string]$SectionName = 'commerceRuntime'
    )

    Log-TimedMessage 'Updating Commerce Runtime configuration section class...'

    $className = 'Microsoft.Dynamics.Commerce.Runtime.Configuration.CommerceRuntimeSection';
    $namespace = 'Microsoft.Dynamics.Commerce.Runtime.ConfigurationProviders';

    $commerceRuntimeSection = @{
        'xmlDoc' = $ConfigXml;
        'parentXPath' = '/configuration/configSections';
        'childXpath' = ("section[@name='{0}']" -f $SectionName);
        'childName' = "section";
        'attributesHashtable' = @{
            'name' = $SectionName;
            'type' = ('{0}, {1}, Version=6.3.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, processorArchitecture=MSIL' -f $className, $namespace);
        }
    }

    CreateOrUpdateChildXmlNodeWithAttributes @commerceRuntimeSection

    Log-TimedMessage 'Finished updating Commerce Runtime configuration section class.'
}

function SafeEnable-HardwareStationMonitoringLogging
{
    param(
        [xml]$ConfigXml = $(Throw 'ConfigXml parameter required')
    )

    try
    {
        Log-TimedMessage 'Enabling Hardware Station monitoring logging...'

        Enable-ServiceMonitoringLogging -MonitoringEventSourceNameFormat 'Microsoft Dynamics AX Retail Monitoring : Hardware Station {0}' `
            -MonitoringListenerName 'MonitoringEventLogTraceListener' -DefaultInstanceName 'HardwareStation' `
            -MonitoringSourceName 'RetailMonitoringTracer' -EventLogName 'Application' -ConfigXml $ConfigXml

        Log-TimedMessage 'Finished enabling Hardware Station monitoring logging.'
    }
    catch
    {
        Log-TimedError 'Enabling Hardware Station monitoring logging failed.'
        Log-Exception $_
    }
}

function SafeEnable-RetailServerMposMonitoringLogging
{
    param(
        [xml]$ConfigXml = $(Throw 'ConfigXml parameter required')
    )

    try 
    {
        Log-TimedMessage 'Enabling Retail Server Mpos monitoring logging...'

        Enable-ServiceMonitoringLogging -MonitoringEventSourceNameFormat 'Microsoft Dynamics AX Retail Monitoring : Retail Server {0} MPOS' `
            -MonitoringListenerName 'MposMonitoringEventLogTraceListener' -DefaultInstanceName 'RetailServer' `
            -MonitoringSourceName 'RetailMposMonitoringTracer' -EventLogName 'Retail MPOS Devices' -ConfigXml $ConfigXml

        Log-TimedMessage 'Finished enabling Retail Server Mpos monitoring logging.'
    }
    catch
    {
        Log-TimedError 'Enabling Retail Server Mpos monitoring logging failed.'
        Log-Exception $_
    }
}

function Enable-ServiceMonitoringLogging
{
    param(
        [xml]$ConfigXml = $(Throw 'ConfigXml parameter required'),
        [string]$MonitoringEventSourceNameFormat = $(Throw 'MonitoringEventSourceNameFormat parameter required'),
        
        [string]$MonitoringListenerName = $(Throw 'MonitoringListenerName parameter required'),
        [string]$MonitoringSourceName = $(Throw 'MonitoringSourceName parameter required'),
        
        [string]$DefaultInstanceName = $(Throw 'DefaultInstanceName parameter required'),
        [string]$EventLogName = 'Application'
    )

    $instanceName = SafeGet-InstanceName -ConfigXml $ConfigXml -DefaultInstanceName $DefaultInstanceName

    $monitoringEventSourceName = ($MonitoringEventSourceNameFormat -f $instanceName)

    Create-SharedEventLogTraceListener -ConfigXml $ConfigXml -ListenerName $MonitoringListenerName -EventSourceName $monitoringEventSourceName

    Create-TraceSource -ConfigXml $ConfigXml -SourceName $MonitoringSourceName -ListenerNames $MonitoringListenerName

    Update-AutoFlushList -ConfigXml $ConfigXml -ListenerName $MonitoringListenerName
    
    Create-RetailMonitoringEventSource

    Create-EventSource -LogName $EventLogName -Source $monitoringEventSourceName
}

<#
.SYNOPSIS
Derives web application name for the web service from the web.config.

.NOTES
In the case of failure it returns default value provided as a script parameter.
#>
function SafeGet-InstanceName
{
    param(
        [xml]$ConfigXml = $(Throw 'ConfigXml parameter required'),

        [string]$DefaultInstanceName = $(Throw 'DefaultInstanceName parameter required')
    )

    try
    {
        $listenerName = 'EventLogTraceListener';

        # derive the name of the web application name from the ending of the listener
        $listener = $ConfigXml.SelectSingleNode(("/configuration/system.diagnostics/sharedListeners/add[@name='{0}']" -f $listenerName))
        
        if ([bool]$listener)
        {
            $eventSourceName = $listener.GetAttribute('initializeData')
            $instanceName = ($eventSourceName -split ' ' | Select-Object -Last 1)
            if ((-not $instanceName) -and ([string]::IsNullOrEmpty($instanceName.Trim())))
            {
                throw 'instanceName has incorrect value.';
            }
        }
        else
        {
            $message = ('Could not find shared listener with name {0}.' -f $listenerName)
            throw $message;
        }
    }
    catch
    {
        $instanceName = $DefaultInstanceName

        Log-TimedError 'Deriving of the instance name failed.'
        Log-Exception $_
        Log-TimedMessage ('Using default instance name {0}.' -f $instanceName)
    }

    return $instanceName
}

<# 
.SYNOPSIS
Adds section to a .config file:

    <source name="$SourceName" switchValue="$TracingLevel">
        <listeners>
            <add name="$ListenerNames[0]" />
            <!-- ... -->
            <add name="$ListenerNames[n]" />
        </listeners>
    </source>

in the XML section with XPath:
    
    "/configuration/system.diagnostics/sources"

The above section creates trace source and attaches shared listeners to it.
#>    
function Create-TraceSource
{
    param(
        [xml]$ConfigXml = $(Throw 'ConfigXml parameter required'),
        [string]$SourceName = $(Throw 'SourceName parameter required'),
        
        [string[]]$ListenerNames,
        [string]$TracingLevel = 'Information'
    )

    $source = @{
        'xmlDoc' = $ConfigXml;
        'parentXPath' = '/configuration/system.diagnostics/sources';
        'childXpath' = ("source[@name='{0}']" -f $SourceName);
        'childName' = 'source';
        'attributesHashtable' = @{
            'name' = $SourceName;
            'switchValue' = $TracingLevel;
        }
    }

    CreateOrUpdateChildXmlNodeWithAttributes @source

    $sourceListeners = @{
        'xmlDoc' = $ConfigXml;
        'parentXPath' = ("/configuration/system.diagnostics/sources/source[@name='{0}']" -f $SourceName);
        'childXpath' = 'listeners';
        'childName' = 'listeners';
        'attributesHashtable' = @{
        }
    };

    CreateOrUpdateChildXmlNodeWithAttributes @sourceListeners

    $ListenerNames | Attach-SharedListener -ConfigXml $ConfigXml -SourceName $monitoringSourceName
}

<# 
.SYNOPSIS
Adds element to a .config file:

    <add name="$ListenerName" type="System.Diagnostics.EventLogTraceListener" initializeData="$EventSourceName" />

in the XML section with XPath:

    '/configuration/system.diagnostics/sharedListeners'

The above section creates a shared event log trace listener with specified name.
#>
function Create-SharedEventLogTraceListener
{
    param(
        [xml]$ConfigXml = $(Throw 'ConfigXml parameter required'),
        
        [string]$ListenerName = $(Throw 'ListenerName parameter required'),
        
        [string]$EventSourceName = $(Throw 'EventSourceName parameter required')
    )

    $sharedListener = @{
        'xmlDoc' = $ConfigXml;
        'parentXPath' = '/configuration/system.diagnostics/sharedListeners';
        'childXpath' = ("add[@name='{0}']" -f $ListenerName);
        'childName' = 'add';
        'attributesHashtable' = @{
            'name' = $ListenerName;
            'type' = 'System.Diagnostics.EventLogTraceListener';
            'initializeData' = $EventSourceName;
        };
    }

    CreateOrUpdateChildXmlNodeWithAttributes @sharedListener
}

<# 
.SYNOPSIS
Adds element to a .config file:

    <add name="$ListenerName" />

in the XML section with XPath:
    
    "/configuration/system.diagnostics/sources/source[@name='$SourceName']/listeners"

The above section attaches shared listener to the trace source.
#>  
function Attach-SharedListener
{
    param(
        [xml]$ConfigXml = $(Throw 'ConfigXml parameter required'),
        
        [string]$SourceName = $(Throw 'SourceName parameter required'),
        
        [Parameter(Mandatory=$true, ValueFromPipeline=$true)]
        [string]$ListenerName
    )

    $attachment = @{
        'xmlDoc' = $ConfigXml;
        'parentXPath' = ("/configuration/system.diagnostics/sources/source[@name='{0}']/listeners" -f $SourceName);
        'childXpath' = ("add[@name='{0}']" -f $ListenerName);
        'childName' = 'add';
        'attributesHashtable' = @{
            'name' = $ListenerName
        }
    }

    CreateOrUpdateChildXmlNodeWithAttributes @attachment
}

<# 
.SYNOPSIS
Adds element to a .config file:

    <add name="$ListenerName" />

in the XML section with XPath:
    
    "/configuration/system.diagnostics/trace[@autoflush='true']/listeners"
	
The above section sets AutoFlush property of the listener set to true.
#>	
function Update-AutoFlushList
{
    param(
        [xml]$ConfigXml = $(Throw 'ConfigXml parameter required'),
        
        [string]$ListenerName = $(Throw 'ListenerName parameter required')
    )

    $autoFlushSwitchForListener = @{
        'xmlDoc' = $ConfigXml;
        'parentXPath' = "/configuration/system.diagnostics/trace[@autoflush='true']/listeners";
        'childXpath' = ("add[@name='{0}']" -f $ListenerName);
        'childName' = 'add';
        'attributesHashtable' = @{
            'name' = $ListenerName
        }
    }
    
    CreateOrUpdateChildXmlNodeWithAttributes @autoFlushSwitchForListener
}

<#
.SYNOPSIS
	Makes sure that a certain child node exists with the correct attributes and attribute values, if it does not, creates it		

.EXAMPLE
PS C:\> $xml = [xml]@"
<a>
    <b name="c">
    </b> 
    <b name="d">
    </b>
</a>
"@
PS C:\> CreateOrUpdateChildXmlNodeWithAttributes -xmlDoc $xml -parentXPath '/a' -childXpath 'e' -childName 'e' -attributesHashtable @{}
PS C:\> $xml.OuterXml
<a><b name="c"></b><b name="d"></b><e /></a>

.EXAMPLE
PS C:\> $xml = [xml]@"
<a>
    <b name="c">
    </b> 
    <b name="d">
    </b>
</a>
"@
PS C:\> CreateOrUpdateChildXmlNodeWithAttributes -xmlDoc $xml -parentXPath "/a/b[@name='c']" -childXpath 'f' -childName 'f' -attributesHashtable @{'name'='noname'}
PS C:\> $xml.OuterXml
<a><b name="c"><f name="noname" /></b><b name="d"></b></a>

.EXAMPLE
PS C:\> $xml = [xml]@"
<a>
    <b name="c">
    </b> 
    <b name="d">
    </b>
</a>
"@
PS C:\> CreateOrUpdateChildXmlNodeWithAttributes -xmlDoc $xml -parentXPath "/a" -childXpath "b[@name='d']" -childName 'b' -attributesHashtable @{'name'='fi'}
PS C:\> $xml.OuterXml
<a><b name="c"></b><b name="fi"></b></a>
#>
function CreateOrUpdateChildXmlNodeWithAttributes
{    
    param(
        [xml]$xmlDoc = $(Throw 'xmlDoc parameter required'),

        [string]$parentXPath = $(Throw 'parentXPath parameter required'),
    
        [string]$childXpath = $(Throw 'childXpath parameter required'),
    
        [string]$childName = $(Throw 'childName parameter required'),
    
        [hashtable]$attributesHashtable,

        [switch]$UpdateOnly
    )

    $childXPath = $parentXPath + '/' + $childXpath
    $childNode = $xmlDoc.SelectSingleNode($childXPath)

    if ($childNode -eq $null)
    {
        Log-TimedMessage ('Child with XPath {0} was not found.' -f $childXPath)
        
        if ($UpdateOnly)
        {
            Log-TimedMessage 'Leaving function.'
            return;
        }
        else 
        {
            Log-TimedMessage ('Creating child node {0}.' -f $childName)
            
            $parentNode = $xmlDoc.SelectSingleNode($parentXPath)
            $childElement = $xmlDoc.CreateElement($childName)
            $childNode = $parentNode.AppendChild($childElement)
           
            Log-TimedMessage ('Finished creating child node {0}.' -f $childName)
        }
    }
    else
    {
        Log-TimedMessage ('Found element with XPath {0}.' -f $childXPath)
    }

    foreach($attributeKey in $attributesHashtable.Keys)
    {
        $attributeValueToSet = $attributesHashtable[$attributeKey]
        $existingAttributeValue = $childNode.GetAttribute($attributeKey)
        
        if ($existingAttributeValue -eq $null)
        {
            Log-TimedMessage "Creating attribute [$attributeKey] with value = $attributeValueToSet."
            $childNode.SetAttribute($attributeKey, $attributeValueToSet)
        }
        else 
        {
            if ($existingAttributeValue -ne $attributeValueToSet)
            {
                Log-TimedMessage "Setting attribute [$attributeKey] with value = $attributeValueToSet."
                $childNode.SetAttribute($attributeKey, $attributeValueToSet)
            }
            else
            {
                Log-TimedMessage "Attribute [$attributeKey] already has value = $attributeValueToSet."
            }
        }
    }
}

function CreateChildXmlNodeWithoutAttributes
{
    param(
        [xml]$xmlDoc = $(Throw 'xmlDoc parameter required'),

        [string]$parentXPath = $(Throw 'parentXPath parameter required'),
    
        [string]$childXpath = $(Throw 'childXpath parameter required'),
    
        [string]$childName = $(Throw 'childName parameter required'),

        [string]$innerText
    )

    $childXPath = $parentXPath + '/' + $childXpath
    $childNode = $xmlDoc.SelectSingleNode($childXPath)

    if ($childNode -eq $null)
    {
        Log-TimedMessage ('Child with XPath {0} was not found.' -f $childXPath)
        
        Log-TimedMessage ('Creating child node {0}.' -f $childName)
            
        $childElement = $xmlDoc.CreateElement($childName)

        if (-not ([string]::IsNullOrEmpty($innerText)))
        {
            $childElement.InnerText = $innerText
        }

        $parentNode = $xmlDoc.SelectSingleNode($parentXPath)
        [void]$parentNode.AppendChild($childElement)
           
        Log-TimedMessage ('Finished creating child node {0}.' -f $childName)
    }
}

function Update-RollingXmlWriterTraceListenerTypeName 
{
    param(
        [xml]$ConfigXml = $(Throw 'ConfigXml parameter required')
    )

    Log-TimedMessage 'Updating RollingXmlWriterTraceListener type name...'

    $rollingXmlWriterTraceListener = @{
        'xmlDoc' = $ConfigXml;
        'parentXPath' = '/configuration/system.diagnostics/sharedListeners';
        'childXpath' = ("add[@name='{0}']" -f 'RollingXmlWriterTraceListener');
        'childName' = 'add';
        'attributesHashtable' = @{
            'type' = 'Microsoft.Dynamics.Retail.Diagnostics.Sinks.RollingXmlWriterTraceListener, Microsoft.Dynamics.Retail.Diagnostics.Sinks';
        }
    }

    CreateOrUpdateChildXmlNodeWithAttributes @rollingXmlWriterTraceListener -UpdateOnly

    Log-TimedMessage 'Finished updating RollingXmlWriterTraceListener type name.'
}
# SIG # Begin signature block
# MIIkAAYJKoZIhvcNAQcCoIIj8TCCI+0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCAjO1GquKTGIaxm
# gwGyELTmpquyfm01wOWQtTI1vcH2T6CCDYEwggX/MIID56ADAgECAhMzAAABh3IX
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
# KwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIPzB2oCd
# As3AxtT5C/4oYonRnnELQwIEsX+neT8yQkadMIG6BgorBgEEAYI3AgEMMYGrMIGo
# oIGJgIGGAFMAaQBtAHAAbABpAGYAeQBDAG8AbQBtAGUAcgBjAGUALgBNAGkAYwBy
# AG8AcwBvAGYAdABEAHkAbgBhAG0AaQBjAHMALgBDAG8AbgBuAGUAYwB0AG8AcgAu
# AFAAbwByAHQAYQBiAGwAZQAuAHIAZQBzAG8AdQByAGMAZQBzAC4AZABsAGyhGoAY
# aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBABkudDUd
# ASO8C1fY+SW/cyfC67R4qLUa3BX2+KFYHm94fJzHOHBDzLJfGs2Y+7VGsA1UjS/G
# eHWYheUNIoDdUi8ZAAn37UMjWHllLfU/ijckzdY4NV8yB6viH6gSq/6EM2bBnpun
# 9b5x/C91j00L6KN99Yk8B9ylh81BOzc4FHU020Ar7qfkD4QBVVj7glT8+KZxIuyV
# R44AmbWgmMwg5l0Iwa5u9gegAA2KXhunam03titTnJJXcvtbhcAV/K/pyqIgALsK
# mgoe4+DJrVfoJfzfSivyIainUCbHsqGkRAt/wjfRbK/OXCIyX5ZZert0SaFXCoHp
# 2OeFFgc5EypI0DqhghLlMIIS4QYKKwYBBAGCNwMDATGCEtEwghLNBgkqhkiG9w0B
# BwKgghK+MIISugIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBUQYLKoZIhvcNAQkQAQSg
# ggFABIIBPDCCATgCAQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg9yPm
# 7WQTVkssZW/6diottvNT98M5i1fkGkNy132FrloCBl86qc71XhgTMjAyMDA4MjMw
# NDAyNDguMTQyWjAEgAIB9KCB0KSBzTCByjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
# Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
# dCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3BlcmF0
# aW9uczEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046RDZCRC1FM0U3LTE2ODUxJTAj
# BgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wggg48MIIE8TCCA9mg
# AwIBAgITMwAAAR4OvOVLFqIDGwAAAAABHjANBgkqhkiG9w0BAQsFADB8MQswCQYD
# VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
# MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
# ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTExMTMyMTQwNDBaFw0yMTAyMTEy
# MTQwNDBaMIHKMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
# A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSUw
# IwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25zMSYwJAYDVQQLEx1U
# aGFsZXMgVFNTIEVTTjpENkJELUUzRTctMTY4NTElMCMGA1UEAxMcTWljcm9zb2Z0
# IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
# ggEBAM4TtxgQovz18FyurO38G3WqlV+etLFjCViCzevcL+0aVl4USidzKo5r5FFg
# ZB9b6ncAkfAJxYf6xmQ42HDmtpju+cK2O24q3xu+o1DRp7DFd3261HnBZVRfnEoR
# 7PAIh9eenBq+LFH4Z3pArL3U1y8TwVdBU91WEOvcUyLM6qSpyHIdiuPgz0uC3FuS
# IPJxrGxq/dfrxO21zCkFwwKfahsVJmMJpRXMdsavoR+gvTdN5pvHRZmsR7bHtBPR
# mRhAEJiYlLVRdBIBVWOpvXCcxevv7Ufx8cut3X920zYOxH8NfCfASjP1nVSmt5+W
# mHd3VXYhtX3Mo559eCn8gHZpFLsCAwEAAaOCARswggEXMB0GA1UdDgQWBBSMEyjn
# kXhG4Ev7fps/2a8n2maKWzAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNoWoVt
# VTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtp
# L2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYIKwYB
# BQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
# cGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNydDAMBgNVHRMBAf8E
# AjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IBAQAuZNyO
# dZYjkIITIlQNJeh2NIc83bDeiIBFIO+DmMjbsfaGPuv0L7/54xTmR+TMj2ZMn/eb
# W5pTJoa9Y75oZd8XqFO/KEYBCjahyXC5Bxw+pWqT70BGsg+m0IdGYaFADJYQm6NW
# C1atY38q0oscfoZYgGR4THJIkXZpN+7uPr1yA/PkMNK+XdSaCFQGXW5NdSH/Qx5C
# ySF3B8ngEpRos7aoABeaVAfja1FVqxrSo1gx0+bvEXVhBWWvUQGe+b2VQdNpvQ2p
# UX4S7qRufctSzSiAeBaYECaRCNY5rK1ovLAwiEd3Bg7KntLBolQfHr1w/Vc2s52i
# ScaFReh04dJdfiFtMIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAAAjANBgkqhkiG9w0B
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
# YWxlcyBUU1MgRVNOOkQ2QkQtRTNFNy0xNjg1MSUwIwYDVQQDExxNaWNyb3NvZnQg
# VGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQA5yQbj7emrMRP+jjdY
# uspZjMqw3KCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
# dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
# YXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMA0G
# CSqGSIb3DQEBBQUAAgUA4uxoXjAiGA8yMDIwMDgyMzEyMDAzMFoYDzIwMjAwODI0
# MTIwMDMwWjB3MD0GCisGAQQBhFkKBAExLzAtMAoCBQDi7GheAgEAMAoCAQACAhBC
# AgH/MAcCAQACAhGQMAoCBQDi7bneAgEAMDYGCisGAQQBhFkKBAIxKDAmMAwGCisG
# AQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEFBQAD
# gYEAO0DwpYt+sNotvMbQb2Pf8hJBAK3fliWfJhRMQjoa0rJISRiXJKHhHUS2YXtO
# Mx+Uz1D9jZkA3tsThkKf2jklPLiRbqSlZ4cXAd4HTSD58nhmOVxnZhWR8wgub4JV
# Ki9wox6NyR76jLAoNQ8KeNyvS6SH/e84ovoV2lzcD7F/dJ8xggMNMIIDCQIBATCB
# kzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
# UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQD
# Ex1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAAR4OvOVLFqIDGwAA
# AAABHjANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqGSIb3DQEJ
# EAEEMC8GCSqGSIb3DQEJBDEiBCA8tk+hCU/JM/1bnAQ3yErn7WJrGNZ9KGoEpQR7
# 2W1jSTCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0EIHM75FjD33E6UeW9p588
# oTdxLc0l1ZTx+iIEHA+N1l9HMIGYMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNV
# BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
# c29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAg
# UENBIDIwMTACEzMAAAEeDrzlSxaiAxsAAAAAAR4wIgQgn/ScMmS3N8OB+l3mibZ4
# FLRLLRBjqhhx9QzZYI0WCeswDQYJKoZIhvcNAQELBQAEggEAWINCIzlCHMHT0mv2
# IQYYjOLnVXOfx9UYEHET0RDuqbzBUIIDN0M/bcD5JbyEVXF4ciE4+q+31IMLGfuJ
# AkkOF5D+b844AW6JbzMpTuOMxYS8cVTwGweAv5uQ3YWR9QxeDQFpQ8fDMMUAJbD+
# 9DUtuBNXgFoz0BB2MVX4SkfLrMsdxyu5g9bBOUKgis1mSl+0QsdyzZWAP6PeViaw
# vdd2K9rsxROMagEXXADsyxrwuMneCrOYqFT8y6VAgKwyX0jLZeJjsggKnpXiYrtE
# zY+R3RqZTC8KJTjl01nbUcNVNmXyysIF7MX8ulZ7XM7tHzSx7nATpJhXmjJGcm38
# vCgF7w==
# SIG # End signature block
