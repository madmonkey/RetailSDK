Sample overview:
The sample shows the usage of extension properties to extend an entity. Two configurations were created at HQ (return max days, and service charge percentage) to calculate and append to each transaction returned by Show Journal new extension properties with remaining days to return and service charge amount.
Being dynamic values that change by the day (remaining days) or that is just informational (service charge was not applied yet), extension properties are the recommended way instead of, for example, order attributes.

Changes are in HQ data setup, CRT and POS (both Modern POS and Cloud POS).

Setup steps:

0. It is advised that you do these changes on a untouched Retail SDK. Ideally, you would have it under source control (VSO, or similar) and no files are changed so far. This is ideal, as you could revert at any steps without much work.

1. HQ data setup: 
    - Go to HQ > Retail > Headquartes setup > Parameters > Retail parameters > Configuration parameters
    - Create two configurations with the (exact) names below and (suggested) values:
      - Name: "ReturnMaxDays", Value=31
      - Name: "ServiceChargePercentage", Value=3.25
    - Run the CDX job 1110 - Global configuration
    
Note: The CRT code changes are all part of the RetailSdk\SampleExtensions. Therefore the steps below refer to how to build, deploy and test these. 
            
2. Enable and test WarrantyAndReturn CRT sample code:
    - Open solution at RetailSdk\SampleExtensions\CommerceRuntime\CommerceRuntimeSamples.sln
    - Register the CRT changes in commerceruntime.ext.config (Note: Please DO NOT edit commerceruntime.config file. This file is not meant for any customizations.):
     <add source="assembly" value="Contoso.Commerce.Runtime.WarrantyAndReturnSample" />

    - At RetailSDK\BuildTools add the new CRT extension assembly to customization.settings (@(ISV_CommerceRuntime_CustomizableFile))  
    - Configure the app.config's connection string for Houston to point to a valid database
    - In program.cs function RunSDKSampleTests uncomment the SDKSAMPLE_WARRANTYANDRETURN sample code
    - Run CRT test host project (Runtime.Extensions.TestHost.csproj) in debugger and execute code for WarrantyAndReturn sample.

3. Extend and test ModernPOS and CloudPOS
    - Open solution file ModernPos.sln in admin mode under RetailSdk\Pos.
	- Follow instructions in readme.md under Pos.Extenions project and adjust the example to StoreHoursSample extension accordingly.
        
4. Official Deployment
    - add the channel DB change file to the database folder and register it in customization.settings
    - run msbuild for the whole RetailSdk
    - all packages will have all appropriate changes
    - deploy packages via LCS or manual
