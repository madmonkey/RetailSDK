Sample overview:
This sample shows how to create a new business entity (StoreHours) across both AX and the channel. 

The changes are in AX tables, CDX, Channel DB, CRT, Retail Server, and POS (both Modern POS and Cloud POS). This sample supports offline mode for Modern POS.

Setup steps:

0. It is advised that you do these changes on an untouched Retail SDK. Ideally, you would have it under source control (VSO, or similar) with no changes so far. This is ideal, as you could revert at any steps without much work. Also, ideally, you would change some specific settings for your whole org, i.e. versioning, naming, etc. See the Retail SDK documentation for details.

1. AX customization:
    - Import the project file AXchanges.axpp, compile the project, and run the job.
    - Populate the database with some data by running the ContosoRetailStoreHoursInsertTestData job (make it a Startup object and hit F5).
    - Create a new operation with ID 3001, add it to a button grid, and run the 1090 Registers job.

2. CDX:
    - Initialize the Retail scheduler. Make sure "Delete existing configuration" is checked as "Yes".

3. Channel DB (manual, just for development, for official change, see deployment below):
    - Find the ChannelDBUpgrade.sql file from /SampleInstructions/StoreHours.
    - Run it and ensure that it succeeds.

4. Verify CDX:
    - Run the 1070 job full sync (channel data group).
    - Make sure the data has arrived through "Download sessions" and the channel DB.

Note: The CRT and Retail Server code changes are all part of the RetailSdk\SampleExtensions. Therefore, the steps below refer to how to build, deploy and test these.

5. Enable and test CRT sample code:
    - Open the solution at RetailSdk\SampleExtensions\CommerceRuntime\CommerceRuntimeSamples.sln.
    - Configure the default channel in RetailSdk\Assets\commerceruntime.config:
        <storage defaultOperatingUnitNumber="052" />
    - Register the new CRT assembly in RetailSdk\Assets\commerceruntime.ext.config (Note: Please DO NOT edit commerceruntime.config file. This file is not meant for any customizations.):
        <add source="assembly" value="Contoso.Commerce.Runtime.StoreHoursSample" />
    - Register the new CRT assembly in RetailSdk\BuildTools\customization.settings:
        <ISV_CommerceRuntime_CustomizableFile Include="$(SdkReferencesPath)\Contoso.Commerce.Runtime.StoreHoursSample.dll" />
    - Configure the app.config's connection string for Houston to point to a valid database.
    - Run the CRT test host project (Runtime.Extensions.TestHost.csproj) in the debugger and execute the code for the store hours sample (part of RunSdkSampleTest() method).

6. Enable and test Retail Server sample code:
    - Open the project at RetailSdk\SampleExtensions\RetailServer\Extensions.StoreHoursSample\RetailServer.Extensions.StoreHoursSample.csproj and compile it.
    - Use inetmgr to find the location of the local Retail Server folder.
    - Register the new Retail Server assembly in web.config file under <extensionComposition> (Note: If there is an assembly registered from a previous sample, then remove it.): 
        <add source="assembly" value="Contoso.RetailServer.StoreHoursSample" />
    - Register the new Retail Server assembly in RetailSdk\BuildTools\customization.settings:
        <ISV_RetailServer_CustomizableFile Include="$(SdkReferencesPath)\Contoso.RetailServer.StoreHoursSample.dll" />
    - Copy the changes you made to RetailSdk\Assets\commerceruntime.ext.config to the local Retail Server's commerceruntime.ext.config in its bin\ext folder.
          <add source="assembly" value="Contoso.Commerce.Runtime.StoreHoursSample" />
    - Drop both the new CRT and Retail Server assemblies into the local Retail Server bin\ext\ folder. Alternatively, use the Retail SDK's AfterBuildDropBinariesToRetailServer target for rapid development (Note: If you use the AfterBuildDropBinariesToRetailServer target, then you have to rebuild the 2 assemblies at least once in order to binplace them automatically).
    - Use inetmgr to browse to the Retail Server's $metadata and verify that the StoreHours entity is exposed (i.e. open https://usnconeboxax1ret.cloud.onebox.dynamics.com/Commerce/$metadata and search for "StoreHours" in the XML).

7. Register assemblies for use in offline mode (equivalent to RetailServer controller but for local CommerceRuntime when the client is not connected)
    - This sample's Retail Server controller is written using the Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts, meaning the same controller assembly can be used by Retail Server and the offline runtime
    - Navigate to RetailSDK\Assets folder and open RetailProxy.MPOSOffline.ext.config
    - Under the composition section, register your new proxy library name. (The assembly generated after building your proxy project.
 <add source="assembly" value="Contoso.RetailServer.StoreHoursSample" /> 
    - For manual testing, update the RetailProxy.MPOSOffline.ext.config under the C:\Program Files (x86)\Microsoft Dynamics 365\70\Retail Modern POS\ClientBroker\ext with the custom proxy library name under the composition section.
 <add source="assembly" value="Contoso.RetailServer.StoreHoursSample" />
    - Navigate to RetailSDK\Assets folder and open CommerceRuntime.MPOSOffline.ext.config
    - Under the composition section, register your new CRT library name. (The assembly generated after building your proxy project.
 <add source="assembly" value="Contoso.Commerce.Runtime.StoreHoursSample" /> 
    - For manual testing, update the CommerceRuntime.MPOSOffline.ext.config under the C:\Program Files (x86)\Microsoft Dynamics 365\70\Retail Modern POS\ClientBroker\ext with the custom proxy library name under the composition section.
 <add source="assembly" value="Contoso.Commerce.Runtime.StoreHoursSample" />
    - add the proxy extension dll to customization.settings ---> <ISV_RetailProxy_CustomizableFile Include="$(SdkReferencesPath)\Contoso.RetailServer.StoreHoursSample.dll" />

8. Use the Retail Server Test Client to verify that calling the new functionality succeeds.
    - Define a C# proxy so other C# code can consume your Controller's endpoints
        - Open Proxies.RetailProxy.Extensions.CrossLoyaltySample.csproj from RetailSDK\SampleExtensions\RetailProxy\RetailProxy.Extensions.CrossLoyaltySample
        - Add the Contoso.Commerce.Runtime.CrossLoyaltySample.dll and Contoso.RetailServer.CrossLoyaltySample.dll as reference to the project
        - Build the proxy project.
        - Copy the output assembly and paste in RetailSDK\References folder.
    - Open the solution at RetailSdk\SampleExtensions\RetailServer\Extensions.TestClient\RetailServer.Extensions.TestClient.sln.
    - Uncomment all code that is marked with "SDKSAMPLE_STOREHOURS".
    - Add assembly references to Contoso.Commerce.RetailProxy.StoreHoursSample.dll and Contoso.Commerce.Runtime.StoreHoursSample.dll.
    - Compile the solution.
    - Run the Retail Server Test Client.
    - Enter the local Retail Server URL in the text box next to the "Activate New" button.
    - Click the "Activate New" button.
    - Enter the device and register id you would like to activate and click "Activate".
    - Sign in with the AAD credentials that has the needed registration privileges.
    - Wait a few seconds.
    - The Retail Server Test Client should now show that the device is activated.
    - Click the "Logon" button and log on with a workers credentials.
    - Click the "SDK Tests" button in order to call the new functionality.
    - Click the "Debug" button to see whether or not the your validation succeeded.
    Notes:
    - To see a console with errors/logs, use the "Debug" button.

9. Generate contracts for TypeScript code to consume the Controller endpoints set up in step 6 "Enable and test Retail Server sample code"
    - Open the project at "RetailSdk\SampleExtensions\TypeScriptProxy\TypeScriptProxy.Extensions.StoreHoursSample\Proxies.TypeScriptProxy.Extensions.StoreHoursSample.csproj" and compile it
    - This project uses the ExtensionsProxyGenerator package to generate DataService .d.ts files, and has a target that copies the generated DataService TypeScript contracts to "POS\Extensions\StoreHoursSample\DataService"
        - Once the TypeScript proxy is built, those contracts are available for the POS extension code to be compiled

10. Extend and test Modern POS and Cloud POS:
    - Open the solution at RetailSdk\POS\ModernPos.sln in admin mode.
    - Follow the instructions in readme.md under the Pos.Extensions project, adjusting the steps for the StoreHoursSample extension accordingly.

11. (Optional) Extend and test the sample Online Store (Note: These changes will not be included in official deployment packages.):
    - Open the solution at RetailSdk\SampleExtensions\OnlineStore\SampleExtensions.OnlineStore.sln in admin mode.
    - Add assembly references to RetailSdk\References\Contoso.Commerce.Runtime.StoreHoursSample.dll and RetailSdk\References\Contoso.Commerce.RetailProxy.StoreHoursSample.dll for the Platform.Ecommerce.Sdk.Core and Storefront.Portal projects.
    - Uncomment all code that is marked with "SDKSAMPLE_STOREHOURS".
    - Follow the sample Online Store instructions. Run and test the Online Store.

12. Official Deployment:
    - Add the channel DB change file to the database folder and register it in RetailSdk\BuildTools\customization.settings.
    - Run msbuild for the whole RetailSdk (Note: All resulting packages will have all of the appropriate changes).
    - Deploy the resulting packages via LCS or manually.
