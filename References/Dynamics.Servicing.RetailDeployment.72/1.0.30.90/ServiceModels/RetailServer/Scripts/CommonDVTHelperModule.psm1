<#
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
#>

# Log function
function Log-TimedMessage(
    [string]$logMessage,
    [string]$log)
{
    $timeStamp = Get-TimeStamp
    $logMessage = '[{0}] {1}' -f $timeStamp, $logMessage
    Write-Host $logMessage

    if ($log)
    {
        $logMessage | Out-File -FilePath $log -Append -Force
    }
}

function Log-TimedError(
    [string]$message,
    [string]$log)
{
    Log-TimedMessage -logMessage '############### Error occurred: ###############' -log $log
    Log-TimedMessage -logMessage $message -log $log
}

function Log-Parameter(
    [string]$parameterName, 
    [string]$parameterValue, 
    [string]$log)
{
    $message = 'Parameter Name: {0} Parameter Value: {1}' -f $parameterName, $parameterValue
    Log-TimedMessage -logMessage $message -log $log
}

function Log-Exception(
    $exception,
    [string]$log)
{
    $message = ($exception | fl * -Force | Out-String -Width 4096)
    # If passed object is a string, just log the string.
    if ($exception -is [string])
    {
        $message = $exception
    }

    Log-TimedError -message $message -log $log
}

# Timestamp for logging
function Get-TimeStamp
{
    [string]$timeStamp = [System.DateTime]::Now.ToString("yyyy-MM-dd HH:mm:ss")
    return $timeStamp
}

# Handle DVt Error
function Handle-DvtError(
    $errorObject,
    [string]$log)
{
    Log-Exception -exception $errorObject -log $log
    Throw $errorObject
}

# Convert the raw base64 to a useful string
function Convert-Base64ToString(
    [string]$base64String)
{
    Log-TimedMessage -logMessage 'Converting Base64 string to string' -log $log
    [string]$rawString = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($base64String))
    
    return $rawString
}

# Retrieve values from XML based on XPath
function Get-ServiceModelParameterValue (
   [xml]$serviceModelXml,
   [string]$xPath,
   [string]$paramName)
{
    return (Select-Xml $serviceModelXml -XPath $xPath | Where { $_.Node.Name -eq $paramName }).Node.Value
}

# Make sure the Directory path exists
function New-DirectoryIfNotExists(
    [ValidateNotNullOrEmpty()]
    [string]$dirPath)
{
    if (-not (Test-Path -Path $dirPath))
    {
        New-Item -Path $dirPath -Type Directory -Force | Out-Null
    }
}

function Get-PathLeafNoFileExtenstion(
    [string]$path)
{
    return ([IO.Path]::GetFileNameWithoutExtension($path))
}

# Create DVT local directory
function CreateDirectoryAndCopy-ScriptsToDVTLocalDir(
    [string]$dvtScript,
    [array]$dvtHelperScripts,
    [string]$log)
{
    if (!$env:SERVICEDRIVE)
    {
        $env:SERVICEDRIVE = $env:TEMP
    }

    # Create DVT local directory
    $dvtLocalBinChildPath = Get-PathLeafNoFileExtenstion -path $dvtScript
    $dvtLocalBin = (Join-Path -Path $env:SERVICEDRIVE -ChildPath "DynamicsDiagnostics\$dvtLocalBinChildPath\Input")
    New-DirectoryIfNotExists -DirPath $dvtLocalBin

    # Copy DVT scripts to local directory
    $logMessage = 'Copy DVT Script {0} to local DVT bin {1}' -f $dvtScript, $dvtLocalBin
    Log-TimedMessage -logMessage $logMessage -log $log
    Copy-Item -Path $dvtScript -Destination $dvtLocalBin -Recurse -Force | Out-Null

    # Copy DVT helper scripts to local directory
    foreach ($dvtHelperScript in $dvtHelperScripts)
    {
        $logMessage = 'Copy DVT helper Scripts {0} to local DVT bin {1}' -f $dvtHelperScript, $dvtLocalBin
        Log-TimedMessage -logMessage $logMessage -log $log
        Copy-Item -Path $dvtHelperScript -Destination $dvtLocalBin -Recurse -Force | Out-Null
    }

    return $dvtLocalBin
}

# Add column values to the rows for the XML template
function Add-ColumnToDvtTestResultsXml(
    [string]$columnName,
    [xml]$dvtOutputXmlTemplate,
    [System.Xml.XmlLinkedNode]$row,
    [string]$log)
{
    $column = $dvtOutputXmlTemplate.CreateElement('string')
    $column.InnerText = $columnName
    [void]$row.AppendChild($column)
    Log-TimedMessage -logMessage ('Adding column value: {0}' -f $columnName) -log $log | Out-Null
}

# Append XML Rows to Template
function Append-RowToTestResultsXml(
    [string]$testName,
    [string]$testType,
    [string]$testResult,
    [string]$rawResult,
    [string]$timeStamp,
    [xml]$dvtOutputXmlTemplate,
    [string]$log)
{
    Log-TimedMessage -logMessage 'Getting existing rows from XML Template' -log $log
    $rows = $dvtOutputXmlTemplate.SelectSingleNode('CollectionResult/TabularResults/TabularData/Rows')
    Log-TimedMessage -logMessage 'Creating new row' -log $log
    $row = $dvtOutputXmlTemplate.CreateElement('ArrayOfStrings')

    Add-ColumnToDvtTestResultsXml -columnName $testName -dvtOutputXmlTemplate $dvtOutputXmlTemplate -row $row -log $log
    Add-ColumnToDvtTestResultsXml -columnName $testType -dvtOutputXmlTemplate $dvtOutputXmlTemplate -row $row -log $log
    Add-ColumnToDvtTestResultsXml -columnName $testResult -dvtOutputXmlTemplate $dvtOutputXmlTemplate -row $row -log $log
    Add-ColumnToDvtTestResultsXml -columnName $rawResult -dvtOutputXmlTemplate $dvtOutputXmlTemplate -row $row -log $log
    Add-ColumnToDvtTestResultsXml -columnName $timeStamp -dvtOutputXmlTemplate $dvtOutputXmlTemplate -row $row -log $log

    $rows.AppendChild($row)
    $dvtOutputXmlTemplate.CollectionResult.TabularResults.TabularData.AppendChild($rows)
    $dvtOutputXmlTemplate.Save($dvtOutputXmlTemplate)
    Log-TimedMessage -logMessage 'Saved rows to XML Template' -log $log
}

function Check-IsDemoDataLoaded(
    [string]$axDbName = $(throw 'AxDB name is required'),
    [string]$axDbServer = $(throw 'AxDB Server is required'),
    [string]$aosDatabaseUser = $(throw 'AOS Database Username is required'),
    [string]$aosDatabasePass = $(throw 'AOS Database Password is required'),
    [string]$logFile)
{
    [string]$query = "select RECID from DataArea where DataArea.id = 'USRT'"
    [bool]$isDemoDataPresent = $false

    try
    {
        $queryResult = Invoke-Sqlcmd -Query $query -Database $axDbName -ServerInstance $axDbServer -Username $aosDatabaseUser -Password $aosDatabasePass
        $logMessage = ('Sql query result : {0} using Query: {1}, Database Name: {2}, Server Instance: {3}, Username: ****** and Password: ******' `
                    -f $queryResult.RECID, $query, $axDbName, $axDbServer)
        Log-TimedMessage -logMessage $logMessage -log $logFile

        if($queryResult.RECID)
        {
            $isDemoDataPresent = $true
        }
    }
    catch
    {
        Log-Exception -exception $_ -log $logFile
    }	

    return $isDemoDataPresent
}

function Download-ServiceHealthCheckEndpointXML(
    [string]$healthCheckUrl = $(throw 'Endpoint Url is required'),
    [int]$retryHealthCheckAttempts = 1,
    [string]$logFile)
{
    [bool]$healthCheckSuccessful = $false
    [int]$retryHealthCheckAttemptsCounter = 1

    while(($retryHealthCheckAttemptsCounter -le $retryHealthCheckAttempts) -and ($healthCheckSuccessful -eq $false))
    {
        try
        {
            [xml]$healthCheckData = (New-Object System.Net.WebClient).DownloadString($healthCheckUrl)
            $healthCheckSuccessful = $true
            $result = $healthCheckData.SelectNodes("//TestResult/Success")
            Log-TimedMessage -logMessage ('Downloaded Health Check Data: {0}' -f $healthCheckData.InnerXml) -log $logFile
        }
        catch [System.Net.WebException]
        {
            $logExceptionMessage = 'On retry attempt {0} out of {1}, failed to download the XML from the Url: {2}. The exception reported is {3}' `
                                -f $retryHealthCheckAttemptsCounter, $retryHealthCheckAttempts, $healthCheckUrl, $_
            Log-Exception -exception $logExceptionMessage -log $logFile
        }
        $retryHealthCheckAttemptsCounter++
    }

    if(!$healthCheckSuccessful)
    {
        Log-Exception -exception ('Failed to donwload the XML from the health Check Url after retrying {0} times.' -f $retryHealthCheckAttempts) -log $logFile
    }

    return $result
}

function Validate-RetailHealthCheckDVTResult(
    [bool]$isDemoDataPresent = $(throw 'Is Demo data present information is required'),
    [array]$result = $(throw 'Xml Nodes for the test results is required')
)
{
    [bool]$dvtResult = $false

    if($isDemoDataPresent)
    {
        if(($result[0].InnerText -eq 'True') -and ($result[1].InnerText -eq 'True'))
        {
            $dvtResult = $true
        }
    }
    else
    {
        if($result[0].InnerText -eq 'True')
        {
            $dvtResult = $true
        }
    }

    $logMessage = 'DVT execution result {0}' -f $dvtResult
    Log-TimedMessage -logMessage $logMessage -log $logFile

    return $dvtResult
}

function Create-HealthCheckUrl(
    [string]$retailServerUrl = $(throw 'Retail Server Url is required'),
    [bool]$isDemoDataPresent = $(throw 'Demo Data information is required')
)
{
    [string]$server = $retailServerUrl.Replace('/Commerce','')
    [string]$pathWithDemoData = '/healthcheck?testname=ping&resultformat=xml'
    [string]$pathWithoutDemoData ='/healthcheck?testname=ping&resultformat=xml&co=y'

    if($isDemoDataPresent)
        {
            $appendPath = $pathWithDemoData
        }
        else
        {
            $appendPath = $pathWithoutDemoData
        }

    $healthCheckUrl = '{0}{1}' -f $server, $appendPath

    return $healthCheckUrl
}

# Validate Retail Server EndPoint with and without Demo data
function Validate-RetailHQPostDeployment(
    [string]$retailServerUrl = $(throw 'Retail Server Url is required'),
    [string]$axDbName = $(throw 'AxDB name is required'),
    [string]$axDbServer = $(throw 'AxDB Server is required'),
    [string]$aosDatabaseUser = $(throw 'AOS Database Username is required'),
    [string]$aosDatabasePass = $(throw 'AOS Database Password is required'),
    [string]$logFile)
{
    [int]$maxRetryHealthCheckAttempts = 3
    [bool]$isDvtSuccessful = $false
    $returnResult = 'No Result'

    try
    {   
        $isDemoDataPresent = Check-IsDemoDataLoaded -axDbName $axDbName `
                                                    -axDbServer $axDbServer `
                                                    -aosDatabaseUser $aosDatabaseUser `
                                                    -aosDatabasePass $aosDatabasePass `
                                                    -logFile $logFile
        
        $healthCheckUrl = Create-HealthCheckUrl -retailServerUrl $retailServerUrl -isDemoDataPresent $isDemoDataPresent
        Log-TimedMessage -logMessage ('Health Check Url:  {0}' -f $healthCheckUrl) -log $logFile

        $result = Download-ServiceHealthCheckEndpointXML -healthCheckUrl $healthCheckUrl -retryHealthCheckAttempts $maxRetryHealthCheckAttempts -logFile $logFile
        $isDvtSuccessful = Validate-RetailHealthCheckDVTResult -isDemoDataPresent $isDemoDataPresent -result $result

        if($isDemoDataPresent)
        {
            $returnResult = '{0}  {1}' -f $result[0].InnerText, $result[1].InnerText
        }
        else
        {
            $returnResult = $result[0].InnerText
        }
    }
    catch
    {
        Log-Exception -exception $_ -log $logFile
    }

    if($isDvtSuccessful)
    {
        $returnProperties = @{
            Result=1
            RawResults= $returnResult
        }
    }
    else
    {
        $returnProperties = @{
            Result=0
            RawResults= $returnResult
        }
    }

    $timeStamp = Get-TimeStamp
    $returnProperties.Add("TimeStamp", $timeStamp)
    $resultObject = New-Object PsObject -Property $returnProperties

    return $resultObject
}

# Validation Helper Functions
# Validate appPool is started
function Validate-AppPool(
    [string]$appPoolName,
    [ValidateSet("Started","Stopped")]
    [string]$expectedState,
    [string]$logFile)
{
    [bool]$IsAppPoolInExpectedState = $false

    try
    {
        Log-TimedMessage -logMessage ('Validating AppPool: {0} is {1}' -f $appPoolName, $expectedState) -log $logFile
        Import-Module WebAdministration
        $thisAppPool = Get-WebAppPoolState -Name $appPoolName
        $rawResult = ('AppPoolName: {0}; Status: {1}' -f $thisAppPool.ItemXPath, $thisAppPool.Value)
        $IsAppPoolInExpectedState = $thisAppPool.Value.ToString() -eq $expectedState
        $logMessage = ('AppPool: {0} is {1}' -f $appPoolName, $thisAppPool.Value)
        Log-TimedMessage -logMessage $logMessage -log $logFile
    }
    catch
    {
        Log-Exception -exception $_ -log $logFile
    }

    if ($IsAppPoolInExpectedState)
    {
        $returnProperties = @{
            Result=1;
            RawResults=$rawResult;
        }
    }
    else
    {
        $returnProperties = @{
            Result=0;
            RawResults=$rawResult;
        }
    }

    $timeStamp = Get-TimeStamp
    $returnProperties.Add("TimeStamp", $timeStamp)
    $resultObject = New-Object PsObject -Property $returnProperties
    return $resultObject
}

# Execute DVT Script
function Execute-DVTScript(
    [string]$dvtLocalScript,
    [string]$log,
    [string]$xmlInputPath)
{
    if (Test-Path -Path $dvtLocalScript)
    {
        Log-TimedMessage -logMessage ('Executing DVT Script: {0}' -f $dvtLocalScript) -log $log
        $commandArgs = @{
            "InputXML" = $xmlInputPath;
            "Log" = $log
        }

        $output = & $dvtLocalScript @commandArgs *>&1
        Log-TimedMessage -logMessage $output -log $log
    }
    else
    {
        Throw "$dvtLocalScript was not found."
    }
}

function Run-ServiceModelDVT(
    [string]$serviceModelXml,
    [string]$config,
    [string]$serviceModelDirName,
    [string]$dvtScript,
    [array]$dvtHelperScripts,
    [string]$log)
{
    if (-not($config) -and -not($serviceModelXml)) 
    {
        Throw 'Atleast one of config or serviceModelXml parameters required.'
    }

    Log-TimedMessage -logMessage 'Running DVT Process.' -log $log

    # Create DVT local directory
    [string]$dvtLocalBin = CreateDirectoryAndCopy-ScriptsToDVTLocalDir -dvtScript $dvtScript -dvthelperScripts $dvtHelperScripts -log $log

    # Parse service model parameters and create input XML for on demand DVT
    Log-TimedMessage -logMessage 'Parsing service model parameters, and creating input XML' -log $log

    # Parameters from Service Model
    if ($config)
    {
        Log-TimedMessage -logMessage 'Parsing service model params as JSON' -log $log
        Log-Parameter -parameterName 'Input Config string' -parameterValue $config -log $log

        [string]$jsonString = Convert-Base64ToString -base64String $config
        $dvtParams = $jsonString | ConvertFrom-Json
        $serviceName = $dvtParams.ExpectedDVTServiceName
        $appPoolName = $dvtParams.ExpectedDVTAppPoolName
        $appPoolState = $dvtParams.ExpectedDVTAppPoolState
    }
    elseif ($serviceModelXml)
    {
        Log-TimedMessage -logMessage 'Parsing service model params as XML' -log $log

        [xml]$paramXML = Get-Content $serviceModelXml
        $serviceName = Get-ServiceModelParameterValue -ServiceModelXml $paramXML -XPath '//Configuration/Setting' -ParamName 'ExpectedDVTServiceName'
        $appPoolName = Get-ServiceModelParameterValue -ServiceModelXml $paramXML -XPath '//Configuration/Setting' -ParamName 'ExpectedDVTAppPoolName'
        $appPoolState = Get-ServiceModelParameterValue -ServiceModelXml $paramXML -XPath '//Configuration/Setting' -ParamName 'ExpectedDVTAppPoolState'
    }
    else
    {
        Throw ('Unable to parse settings from service model. Config: {0}' -f $config)
    }

    Log-TimedMessage -logMessage ('Parameters: {0} {1} {2}' -f $serviceName, $appPoolName, $appPoolState) -log $log
    [string]$dvtOutputRoot = (Split-Path -Path $dvtLocalBin -Parent)
    [string]$DVTOutputBin = (Join-Path -Path $dvtOutputRoot -ChildPath 'Output')

# DVT input XML Template
[xml]$xmlTemplate = @"
<?xml version="1.0"?>
<DVTParameters xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<ServiceName>$serviceName</ServiceName>
<AppPoolName>$appPoolName</AppPoolName>
<AppPoolState>$appPoolState</AppPoolState>
<OutputPath>$DVTOutputBin</OutputPath>
</DVTParameters>
"@

    # Calculate Input XML Path
    $xmlInputChildPath =  Get-PathLeafNoFileExtenstion -path $dvtScript
    $xmlInputPath = (Join-Path -Path $dvtLocalBin -ChildPath ('{0}.xml' -f $xmlInputChildPath))
    Log-TimedMessage -logMessage ('Executing DVT XML at: {0}' -f $xmlInputPath) -log $log
    $xmlTemplate.InnerXml | Out-File -FilePath $xmlInputPath -Force -Encoding utf8
    $dvtLocalScript = (Join-Path -Path $dvtLocalBin -ChildPath (Split-Path -Path $dvtScript -Leaf))

    # Execute DVT Script
    Execute-DVTScript -dvtLocalScript $dvtLocalScript -log $log -xmlInputPath $xmlInputPath
}

function Run-ServiceModelRetailHQConfigurationDVT(
    [string]$serviceModelXml,
    [string]$config,
    [string]$serviceModelDirName,
    [string]$dvtScript,
    [array]$dvtHelperScripts,
    [string]$log)
{
    if(-not($config) -and -not($serviceModelXml)) 
    {
        Throw 'Atleast one of config or serviceModelXml parameters required'
    }

    Log-TimedMessage -logMessage 'Running DVT Process' -log $log

    # Create DVT local directory
    [string]$dvtLocalBin = CreateDirectoryAndCopy-ScriptsToDVTLocalDir -dvtScript $dvtScript -dvthelperScripts $dvtHelperScripts -log $log

    # Parse service model parameters and create input XML for on demand DVT
    Log-TimedMessage -logMessage 'Parsing service model parameters, and creating input XML' -log $log
       
    # Parameters from Service Model
    if($config)
    {
        Log-TimedMessage -logMessage 'Parsing service model params as JSON' -log $log
        Log-Parameter -parameterName 'Input Config string' -parameterValue $config -log $log

        [string]$jsonString = Convert-Base64ToString -base64String $config
        $dvtParams = $jsonString | ConvertFrom-Json
        [string]$retailServerUrl = $dvtParams.RetailServerUrl
        [string]$AosDatabaseName = $dvtParams.AosDatabaseName
        [string]$AosDatabaseServer = $dvtParams.AosDatabaseServer
        [string]$aosDatabaseUser = $dvtParams.AosDatabaseUser
        [string]$aosDatabasePass = $dvtParams.AosDatabasePass
    }
    elseif($serviceModelXml)
    {
        Log-TimedMessage -logMessage 'Parsing service model params as XML' -log $log

        [xml]$paramXML = Get-Content $serviceModelXml
        [string]$retailServerUrl = Get-ServiceModelParameterValue -ServiceModelXml $paramXML -XPath '//Configuration/Setting' -ParamName 'RetailServerUrl'
        [string]$AosDatabaseName = Get-ServiceModelParameterValue -ServiceModelXml $paramXML -XPath '//Configuration/Setting' -ParamName 'AosDatabaseName'
        [string]$AosDatabaseServer = Get-ServiceModelParameterValue -ServiceModelXml $paramXML -XPath '//Configuration/Setting' -ParamName 'AosDatabaseServer'
        [string]$aosDatabaseUser = Get-ServiceModelParameterValue -ServiceModelXml $paramXML -XPath '//Configuration/Setting' -ParamName 'AosDatabaseUser'
        [string]$aosDatabasePass = Get-ServiceModelParameterValue -ServiceModelXml $paramXML -XPath '//Configuration/Setting' -ParamName 'AosDatabasePass'
    }
    else
    {
        Throw ('Unable to parse settings from service model. Config: {0}' -f $config)
    }

    Log-TimedMessage -logMessage ('Parameters: Retail Server Url: {0} , Database Name: {1} , Server Name: {2}' -f $retailServerUrl, $axDbName, $axDbServer) -log $log
    [string]$dvtOutputRoot = (Split-Path -Path $dvtLocalBin -Parent)
    [string]$DVTOutputBin = (Join-Path -Path $dvtOutputRoot -ChildPath "output")

# DVT input XML Template
[xml]$xmlTemplate = @"
<?xml version="1.0"?>
<DVTParameters xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<RetailServerUrl>$retailServerUrl</RetailServerUrl>
<AxDbName>$AosDatabaseName</AxDbName>
<AxDbServer>$AosDatabaseServer</AxDbServer>
<AosDatabaseUser>$aosDatabaseUser</AosDatabaseUser>
<AosDatabasePass>$aosDatabasePass</AosDatabasePass>
<OutputPath>$DVTOutputBin</OutputPath>
</DVTParameters>
"@

    # Calculate Input XML Path
    $xmlInputChildPath =  Get-PathLeafNoFileExtenstion -path $dvtScript
    $xmlInputPath = (Join-Path -Path $dvtLocalBin -ChildPath ('{0}.xml' -f $xmlInputChildPath))
    Log-TimedMessage -logMessage ('Executing DVT XML at: {0}' -f $xmlInputPath) -log $log
    $xmlTemplate.InnerXml | Out-File -FilePath $xmlInputPath -Force -Encoding utf8
    $dvtLocalScript = (Join-Path -Path $dvtLocalBin -ChildPath (Split-Path -Path $dvtScript -Leaf))

    # Execute DVT Script
    Execute-DVTScript -dvtLocalScript $dvtLocalScript -log $log -xmlInputPath $xmlInputPath
}

function Run-NonWebServiceBasedServiceModelDVT(
    [string]$serviceModelXml,
    [string]$config,
    [string]$serviceModelDirName,
    [string]$dvtScript,
    [array]$dvtHelperScripts,
    [string]$log)
{
    if (-not($config) -and -not($serviceModelXml)) 
    {
        Throw 'Atleast one of config or serviceModelXml parameters required.'
    }

    Log-TimedMessage -logMessage 'Running DVT Process.' -log $log

    # Create DVT local directory
    [string]$dvtLocalBin = CreateDirectoryAndCopy-ScriptsToDVTLocalDir -dvtScript $dvtScript -dvthelperScripts $dvtHelperScripts -log $log

    # Parse service model parameters and create input XML for on demand DVT
    Log-TimedMessage -logMessage 'Parsing service model parameters, and creating input XML' -log $log

    # Parameters from Service Model
    if ($config)
    {
        Log-TimedMessage -logMessage 'Parsing service model params as encoded JSON.' -log $log
        Log-Parameter -parameterName 'Input Config string' -parameterValue $config -log $log
        
        $decodedConfig = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($config))
        $settings = ConvertFrom-Json $decodedConfig
        $aosWebsiteName = $settings.AOSWebsiteName
    }
    elseif ($serviceModelXml)
    {
        Log-TimedMessage -logMessage 'Parsing service model params as XML' -log $log

        [xml]$paramXML = Get-Content $serviceModelXml
        $aosWebsiteName = Get-ServiceModelParameterValue -ServiceModelXml $paramXML -XPath '//Configuration/Setting' -ParamName 'AOSWebsiteName'
    }
    else
    {
        Throw ('Unable to parse settings from service model. Config: {0}' -f $config)
    }

    Log-Parameter -parameterName 'AOS Website Name' -parameterValue $aosWebsiteName -log $log
    [string]$dvtOutputRoot = (Split-Path -Path $dvtLocalBin -Parent)
    [string]$DVTOutputBin = (Join-Path -Path $dvtOutputRoot -ChildPath 'Output')

# DVT input XML Template
[xml]$xmlTemplate = @"
<?xml version="1.0"?>
<DVTParameters xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<ServiceName>$serviceName</ServiceName>
<AOSWebsiteName>$aosWebsiteName</AOSWebsiteName>
<OutputPath>$DVTOutputBin</OutputPath>
</DVTParameters>
"@

    # Calculate Input XML Path
    $xmlInputChildPath =  Get-PathLeafNoFileExtenstion -path $dvtScript
    $xmlInputPath = (Join-Path -Path $dvtLocalBin -ChildPath ('{0}.xml' -f $xmlInputChildPath))
    Log-TimedMessage -logMessage ('Executing DVT XML at: {0}' -f $xmlInputPath) -log $log
    $xmlTemplate.InnerXml | Out-File -FilePath $xmlInputPath -Force -Encoding utf8
    $dvtLocalScript = (Join-Path -Path $dvtLocalBin -ChildPath (Split-Path -Path $dvtScript -Leaf))

    # Execute DVT Script
    Execute-DVTScript -dvtLocalScript $dvtLocalScript -log $log -xmlInputPath $xmlInputPath
}

function Create-TestResultXML(
    [string]$testName,
    [System.Object]$TestResult,
    [string]$xmlFilePath,
    [string]$logFile)
{
    # Diagnostics Collector XML Template
[xml]$dvtOutputXmlTemplate = @"
<?xml version="1.0"?>
<CollectionResult xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <CollectorName>$collectorName</CollectorName>
    <CollectorType>$collectorType</CollectorType>
    <ErrorMessages />
    <TabularResults>
    <TabularData>
        <TargetName>$targetName</TargetName>
        <Columns>
        <string>TestName</string>
        <string>TestType</string>
        <string>PassResult</string>
        <string>RawResult</string>
        <string>TimeStamp</string>
        </Columns>
        <Rows>
        </Rows>
    </TabularData>
    </TabularResults>
</CollectionResult>
"@
    $logMessage = 'Append-RowToTestResultsXml -TestName {0} -TestType DVT -TestResult {1} -RawResult {2} -TimeStamp {3}' -f $testName, $testResult.Result, $testResult.RawResults, $testResult.TimeStamp
    Log-TimedMessage -logMessage $logMessage -log $logFile 

    Append-RowToTestResultsXml -TestName $testName `
                               -TestType 'DVT' `
                               -TestResult $testResult.Result `
                               -RawResult $testResult.RawResults `
                               -TimeStamp $testResult.TimeStamp `
                               -dvtOutputXmlTemplate $dvtOutputXmlTemplate `
                               -log $logFile | Out-Null

    #Writing XML results
    Log-TimedMessage -logMessage ('Writing DVT results to {0}' -f $xmlFilePath) -log $logFile
    $dvtOutputXmlTemplate.InnerXml | Out-File -FilePath $xmlFilePath -Force -Encoding utf8
}

function Report-TestResults(
    [string]$testName,
    [System.Object]$TestResult,
    [string]$xmlFilePath,
    [string]$logFile)
{
    Create-TestResultXML -testName $testName -TestResult $testResult -xmlFilePath $xmlFilePath -logFile $logFile
    [bool]$dvtResult = $testResult.Result

    if ($dvtResult)
    {
        $exitProperties = @{'ExitCode'= 0}
        $exitObject = New-Object PsObject -Property $exitProperties
        Log-TimedMessage -logMessage ('Service Model {0} DVT script completed, ExitCode: {1}' -f $serviceModelName, $exitObject.ExitCode) -log $logFile
        return $exitObject
    }
    else
    {
        $exitProperties = @{
            'ExitCode'= 1;
            'Message'= ('Service Model {0} DVT Validation failed, see log: {1} for further details, and {2} for test results' -f $serviceModelName, $logFile, $xmlFilePath)
        }
        $exitObject = New-Object PsObject -Property $exitProperties
        Log-TimedMessage -logMessage ('Service Model {0} DVT Script Completed, ExitCode: {1}' -f $serviceModelName, ($exitObject.ExitCode)) -log $logFile
        throw $exitObject
    }
}

function Execute-ServiceModelPostDeploymentValidation(
    [string]$serviceModelName,
    [string]$retailServerUrl = $(throw 'Retail Server Url is required'),
    [string]$axDbName = $(throw 'AxDB name is required'),
    [string]$axDbServer = $(throw 'AxDB Server is required'),
    [string]$aosDatabaseUser = $(throw 'AOS Database Username is required'),
    [string]$aosDatabasePass = $(throw 'AOS Database Password is required'),
    [string]$logFile,
    [string]$xmlFilePath = $(throw 'XML file path is required'))
{
    # Post Deployment Retail Server EndPoint Validation
    $testName = $serviceModelName + '.PostDeploymentRetailServer-EndPointValidation'

    $retailHQPostDeploymentValidationResult = Validate-RetailHQPostDeployment -retailServerUrl $retailServerUrl `
        -axDbName $axDbName `
        -axDbServer $axDbServer `
        -aosDatabaseUser $aosDatabaseUser `
        -aosDatabasePass $aosDatabasePass `
        -logFile $logFile

    # Reports the test results in an xml and returns the results object
    Report-TestResults -testName $testName -TestResult $retailHQPostDeploymentValidationResult -xmlFilePath $xmlFilePath -logFile $logFile
}

function Execute-ServiceModelAppPoolDVT(
    [string]$serviceModelName,
    [string]$appPoolName,
    [string]$appPoolState,
    [string]$logFile,
    [string]$xmlFilePath)
{
    # IIS AppPool Validation
    $testName = $serviceModelName + '.Validate-AppPool'

    $logMessage = 'Validate-AppPool -AppPoolName {0} -expectedState {1}' -f $appPoolName, $appPoolState
    Log-TimedMessage -logMessage $logMessage -log $logFile 

    $appPoolResult = Validate-AppPool -AppPoolName $appPoolName -expectedState $appPoolState -logFile $logFile

    # Reports the test results in an xml and returns the results object
    Report-TestResults -testName $testName -TestResult $appPoolResult -xmlFilePath $xmlFilePath -logFile $logFile
}

function Validate-RegistryEntry(
    [string]$registryPath,
    [string]$registryKey,
    
    [string]$expectedRegistryValue,
    [switch]$ensureRegistryValueIsValidPath,

    [string]$logFile)
{
    [bool]$isValidationSuccessful = $false

    try
    {
        Log-TimedMessage -logMessage ('Validating existence of registry Key: {0}' -f $registryPath) -log $logFile
        
        # Check if registry path is valid.
        $isValidationSuccessful = Test-Path -Path $registryPath
        $rawResult = 'Registry path = {0} ;' -f $registryPath
        
        if ($isValidationSuccessful)
        {
            # Get the registry key value.
            $actualRegistryValue = (Get-ItemProperty -Path $registryPath -Name $registryKey -ErrorAction SilentlyContinue).$registryKey
            
            Log-TimedMessage -logMessage ('Actual registry value is {0}.' -f $actualRegistryValue) -log $logFile
            $rawResult += 'Actual registry value = {0} ;' -f $actualRegistryValue
            
            # If the registry key value is null, then validation fails.
            if (-not($actualRegistryValue))
            {
                $isValidationSuccessful = $false
            }
            else
            {
                # Validate the registry value if expected to be a valid path.
                if ($ensureRegistryValueIsValidPath)
                {
                    $isValidationSuccessful = Test-Path -Path $actualRegistryValue
                    $rawResult += 'Ensuring registry value is a valid path = {0} ;' -f $isValidationSuccessful
                    
                    Log-TimedMessage -logMessage ('Validation result of registry value {0} as valid path is {1}' -f $actualRegistryValue, $isValidationSuccessful) -log $logFile
                    
                }
                
                # Validate the registry value if expected registry value is not NULL.
                if ($expectedRegistryValue)
                {
                    $isValidationSuccessful = $expectedRegistryValue -eq $actualRegistryValue
                    $rawResult += 'Expected registry value = {0}; Expected registry value validation result = {1}' -f $expectedRegistryValue, $isValidationSuccessful
                    
                    Log-TimedMessage -logMessage ('Validation result for comparison of registry value {0} to expected value {1} is {2}' -f $actualRegistryValue, $expectedRegistryValue, $isValidationSuccessful) -log $logFile
                }
            }
        }
        else
        {
            Log-TimedMessage -logMessage ('Registry path {0} is invalid.' -f $registryPath) -log $logFile
        }
    }
    catch
    {
        Log-Exception -exception $_ -log $logFile
    }

    if ($isValidationSuccessful)
    {
        $returnProperties = @{
            Result=1;
            RawResults=$rawResult;
            TimeStamp= Get-TimeStamp
        }
    }
    else
    {
        $returnProperties = @{
            Result=0;
            RawResults=$rawResult;
            TimeStamp= Get-TimeStamp
        }
    }
    
    $resultObject = New-Object PsObject -Property $returnProperties
    return $resultObject
}

function Execute-RegistryValidationDVT(
    [string]$registryPath,
    [string]$registryKey,
    
    [string]$expectedRegistryValue,
    [switch]$ensureRegistryValueIsValidPath,
    
    [string]$serviceModelName,
    [string]$logFile,
    [string]$xmlFilePath)
{
    $testName = '{0}.Validate-RegistryEntry' -f $serviceModelName
    
    $logMessage = 'Validate-RegistryEntry -registryPath {0} -registryKey {1} -expectedRegistryValue {2} -logFile {3} -xmlFilePath {4}' -f $registryPath, $registryKey, $expectedRegistryValue, $logFile, $xmlFilePath

    if ($ensureRegistryValueIsValidPath)
    {
        $logMessage += '-ensureRegistryValueIsValidPath'
    }
    
    Log-TimedMessage -logMessage $logMessage -log $logFile 

    if ($ensureRegistryValueIsValidPath)
    {
        $testExecutionResults = Validate-RegistryEntry -registryPath $registryPath `
                                                       -registryKey $registryKey `
                                                       -expectedRegistryValue $expectedRegistryValue `
                                                       -ensureRegistryValueIsValidPath `
                                                       -logFile $logFile
    }
    else
    {
        $testExecutionResults = Validate-RegistryEntry -registryPath $registryPath `
                                                       -registryKey $registryKey `
                                                       -expectedRegistryValue $expectedRegistryValue `
                                                       -logFile $logFile
    }

    # Reports the test results in an xml and returns the results object
    Report-TestResults -testName $testName -TestResult $testExecutionResults -xmlFilePath $xmlFilePath -logFile $logFile
}

Export-ModuleMember -Function Append-RowToTestResultsXml
Export-ModuleMember -Function Convert-Base64ToString
Export-ModuleMember -Function CreateDirectoryAndCopy-ScriptsToDVTLocalDir
Export-ModuleMember -Function Execute-DVTScript
Export-ModuleMember -Function Execute-RegistryValidationDVT
Export-ModuleMember -Function Execute-ServiceModelAppPoolDVT
Export-ModuleMember -Function Execute-ServiceModelPostDeploymentValidation
Export-ModuleMember -Function Get-ServiceModelParameterValue 
Export-ModuleMember -Function Get-TimeStamp
Export-ModuleMember -Function Handle-DvtError
Export-ModuleMember -Function Log-Exception
Export-ModuleMember -Function Log-TimedMessage
Export-ModuleMember -Function New-DirectoryIfNotExists
Export-ModuleMember -Function Run-NonWebServiceBasedServiceModelDVT
Export-ModuleMember -Function Run-ServiceModelDVT
Export-ModuleMember -Function Run-ServiceModelRetailHQConfigurationDVT
Export-ModuleMember -Function Validate-AppPool

# SIG # Begin signature block
# MIIkEAYJKoZIhvcNAQcCoIIkATCCI/0CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCCAvFQFxUgvrPkF
# Qv4FrJ7cxYBiOyf2cXbN/taxITmVH6CCDYUwggYDMIID66ADAgECAhMzAAABiK9S
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
# MBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBd
# HewUD3NjSBx4DQmQ4hXIodJLP5walaGkdwizfqyVwjCBugYKKwYBBAGCNwIBDDGB
# qzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBvAG0AbQBlAHIAYwBlAC4ATQBp
# AGMAcgBvAHMAbwBmAHQARAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
# AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUAcgBjAGUAcwAuAGQAbABs
# oRqAGGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAr
# FjTuububT8jKVvGLLI2WZdcC6ET26LVYVIh56uBZgDPBtSouUR2dnk9oLsI3v123
# iMRDOqw8Zo4CbE8a0E4OU+ag4hguKlIygg4NgyBLkqeBgYasv/LjOwFt8EibhA/w
# SBwPaOzMasdJHBPccYyKESCAwe9Qqu+u8CdimTa2zDDwI5frsXWN7aFqx6T/DsRs
# dt6tU+vYE8uUJkSKTc3FxxQi7TQrpBSjy5KJ/pZ8FDwUgzZ7r2I4c9b1W93VQfFY
# 9BhdDeNqf9FMrWSwil9ytp/5RVotW85PBEyPxsIsKnXEjbieUVr1Ws9j38f6cLTi
# pnlEFig1NA4AKaJ7bXdAoYIS8TCCEu0GCisGAQQBgjcDAwExghLdMIIS2QYJKoZI
# hvcNAQcCoIISyjCCEsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3DQEJ
# EAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAE
# IAKgCpQAtYWj8RZ/vWFqezY+zNvMfASTFCQYAX3ggcDJAgZfO+NacxYYEzIwMjAw
# ODIzMDQwMjQ5LjE1MVowBIACAfSggdSkgdEwgc4xCzAJBgNVBAYTAlVTMRMwEQYD
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
# DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQglOkjb9hV3/KC7VC6
# CSJqjIhuu2l2vpaD6YpISyeazSowgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
# BCA2/c/vnr1ecAzvapOWZ2xGfAkzrkfpGcrvMW07CQl1DzCBmDCBgKR+MHwxCzAJ
# BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
# c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABJt+6SyK5goIHAAAAAAEmMCIE
# ICdABdj+RdV3+4DCeZQlEoS7USHGBlLTDpfdPgnzm2q3MA0GCSqGSIb3DQEBCwUA
# BIIBAB67eS+FOLOfOL9Qg8L+pb9FGMwtMctcXexUX/9k65gno1l9z2vI3SdVo7QO
# En+E58WKdDCV0nuIulo7dRssg7XkjrrUgpGZl97uENfsA9I6SculU2/UKT7N9jp9
# SsB32sE/6CclI84qpjo+9FuvrVwSg8HFnE/eqOO5HDIynPjkPZQyeA+2T05AGNUu
# DCr69DbGaVPSsYMP5/JqrGe+eJMw2JBmbXEVt5BfC/xAwyNF5sf2XptbDx0Ijh9P
# QrinfXU7VC4xFXBvN5CYGfiWU6Y64+PmZDBrMgO4KJ6N2xku7TQKEnofvYX5O8lQ
# yo0KtZs7Ot3Nrm2vtNlGVz9fiAA=
# SIG # End signature block
