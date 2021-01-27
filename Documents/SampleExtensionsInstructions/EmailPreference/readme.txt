Sample overview:
The sample shows the usage of extension properties to extend an entity. Entity is extended in HQ, persisted in both HQ and Channel databases, and POS UI allows to access the value.  Additionally, the new value is written via the RetailRealtimeTransaction service synchronously to HQ. Customizations are required in CRT to read/write extension properties.

Note: This scenario can now be accomplished using the Customer Attributes feature which support new attributes without code modifications. This sample was kept to showcase the usage of extension properties.

Changes are in HQ forms, HQ tables, HQ RTS client, CDX, Channel DB, POS (both Modern POS and Cloud POS). Offline mode is not supported for this sample. 

Setup steps:

0. It is advised that you do these changes on a untouched RetailSdk. Ideally, you would have it under source control (VSO, or similar) and no files are changed so far. This is ideal, as you could revert at any steps without much work.

1. HQ customization: 
    - With the sealing of application code, the HQ extensibility is being revamped. Please contact Microsoft for more information on how to develop extensions at the HQ.
    
Note: The CRT and RetailServer code changes are all part of the RetailSdk\SampleExtensions. Therefore the steps below refer to how to build, deploy and test these. 
            
2. Verify CDX:
    - run 1010 job full sync (channel data group)
    - check Download sessions and channel DB that the data arrived (should show as "Applied")

3. Channel DB (manual, just for development, for official change, see deployment below):
    - apply schema change from ChannelDBUpgrade.sql to correct channel database. This will add the new table
    
4. Enable and test EmailPreference CRT sample code:
    - open solution at RetailSdk\SampleExtensions\CommerceRuntime\CommerceRuntimeSamples.sln
    - Register the CRT changes in commerceruntime.ext.config (Note: Please DO NOT edit commerceruntime.config file. This file is not meant for any customizations.):
    <add source="type" value="Contoso.Commerce.Runtime.EmailPreferenceSample.CreateOrUpdateCustomerDataRequestHandler, Contoso.Commerce.Runtime.EmailPreferenceSample" />
    <add source="type" value="Contoso.Commerce.Runtime.EmailPreferenceSample.GetCustomerTriggers, Contoso.Commerce.Runtime.EmailPreferenceSample" />

    - at RetailSDK\BuildTools add the new CRT extension assembly to customization.settings (@(ISV_CommerceRuntime_CustomizableFile))  
    - configure the app.config's connection string for Houston to point to a valid database
    - in program.cs function RunSDKSampleTests uncomment the EmailPreference sample code
    - Run CRT test host project (Runtime.Extensions.TestHost.csproj) in debugger and execute code for EmailPreference sample

5. Test the customization's business logic with the RetailServer test client:
    - open project at RetailSdk\SampleExtensions\RetailServer\Extensions.TestClient, compile and run it
    - Enter the RetailServer url in the text box next to the "Activate New" button and hit it.
    - Enter device and register ids and hit Activate.
    - Enter the AAD credentials that has the registration priviledges and hit Ok.
    - Wait a few seconds.
    - Test client should now show what device is registered.
    - Hit login button and login with worker credentials.
    - Hit "Sdk Tests"  button. This will call the new functionality that saves a customer with the EmailOptIn extension property applied.
    - Verify in HQ or database that the customer's EmailOptIn value is stored correctly
    Notes:
    - To see a console with errors/logs, use the "Debug" button.
        
6. Official Deployment
    - add the channel DB change file to the database folder and register it in customization.settings
    - run msbuild for the whole RetailSdk
    - all packages will have all appropriate changes
    - deploy packages via LCS or manual
