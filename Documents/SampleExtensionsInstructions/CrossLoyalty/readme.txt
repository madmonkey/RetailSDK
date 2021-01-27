Sample overview:
Consider that there are two retailers, AdventureWorks and Contoso. As a part of a deal, the Contoso retailer will accept AdventureWorks loyalty points.
This sample shows how to create a simple new CRT service and call it when a button in MPOS is clicked. It simulates the cross loyalty scenario.

The changes are in AX tables, CDX, Channel DB, CRT, Retail Server, POS (both Modern POS and Cloud POS). This sample supports offline mode for Modern POS.

Setup steps:

0. It is advised that you do these changes on an untouched Retail SDK. Ideally, you would have it under source control (VSO, or similar) with no changes so far. This is ideal, as you could revert at any steps without much work. Also, ideally, you would change some specific settings for your whole org, i.e. versioning, naming, etc. See the Retail SDK documentation for details.

1. AX configuration changes:
    - Create a new POS operation in AX with Name: "AddCrossLoyaltyCard", Id: 1060, and Check User access: True. (Retail and Commerce > Channel setup > POS setup > POS > Operations)
    - Select the POS screen layout "FABMGR16:9". (Retail and Commerce > Channel setup > POS setup > POS > Screen layouts)
    - Expand the "Button grids" section and select the "Actions" grid.
    - Click the "Designer" link in the "Button grids" section. Open and run resulting the application. Login with your credentials.
    - Click on the gift card button (row 4, column 1)
    - Left click in the empty space, right click in the empty space, and click "New button".
    - Right click the new button and click "Button properties".
    - Select the AddCrossLoyaltyCard action and change the button size to 2 columns by 1 row.
    - Close the designer.
    - Run the 1090 download job for Houston. (Retail and Commerce > Retail IT > Distribution schedule)
    - Verify in download sessions (Retail and commerce > Inquiries and reports > Commerce Data Exchange > Download sessions) that the 1090 succeeded (Status = Applied).

Note: The CRT and Retail Server code changes are all part of the RetailSdk\SampleExtensions. Therefore, the steps below refer to how to build, deploy and test these.

2. Enable and test CRT sample code:
    - Open the solution at RetailSdk\SampleExtensions\CommerceRuntime\CommerceRuntimeSamples.sln.
    - Configure the default channel in RetailSdk\Assets\commerceruntime.config:
        <storage defaultOperatingUnitNumber="052" />
    - Register the new CRT assembly in RetailSdk\Assets\commerceruntime.ext.config (Note: Please DO NOT edit commerceruntime.config file. This file is not meant for any customizations.):
        <add source="type" value="Contoso.Commerce.Runtime.CrossLoyaltySample.CrossLoyaltyCardService, Contoso.Commerce.Runtime.CrossLoyaltySample" />
    - Register the new CRT assembly in RetailSdk\BuildTools\customization.settings:
        <ISV_CommerceRuntime_CustomizableFile Include="$(SdkReferencesPath)\Contoso.Commerce.Runtime.CrossLoyaltySample.dll" />
    - Under the Runtime.Extensions.TestHost project, configure the app.config's connection string for Houston to point to a valid database.
    - Uncomment all code in the Runtime.Extensions.TestHost project that is marked with "SDKSAMPLE_CROSSLOYALTY".
    - Run the Runtime.Extensions.TestHost project from Visual Studio with the debugger attached and execute the CrossLoyalty sample code.

3. Enable and test Retail Server sample code:
    - Open the project at RetailSdk\SampleExtensions\RetailServer\Extensions.CrossLoyaltySample\RetailServer.Extensions.CrossLoyaltySample.csproj and compile it.
    - Use inetmgr to find the location of the local Retail Server folder.
    - Register the new Retail Server assembly in web.config file under <extensionComposition> (Note: If there is an assembly registered from a previous sample, then remove it.): 
        <add source="assembly" value="Contoso.RetailServer.CrossLoyaltySample" />
    - Register the new Retail Server assembly in RetailSdk\BuildTools\customization.settings:
        <ISV_RetailServer_CustomizableFile Include="$(SdkReferencesPath)\Contoso.RetailServer.CrossLoyaltySample.dll" />
    - in order to regenerate the proxy code build the Proxies folder from command line (msbuild /t:Rebuild)
    If the build is failing, ensure you've followed the Prerequisite steps in the Retail SDK Handbook (Section 4)

      Note before the previous step: you need to implement the interface method ICustomerManager.GetCrossLoyaltyCardDiscountAction in the CustomerManager class. For now, just add this:

        public Task<decimal> GetCrossLoyaltyCardDiscountAction(string loyaltyCardNumber)
        {
            throw new NotImplementedException();
        }

      We can do this as we do not need this implementation until we implement ModernPos offline.

    - Copy the changes you made to RetailSdk\Assets\commerceruntime.ext.config to the local Retail Server's commerceruntime.ext.config in its bin\ext folder.
        <add source="type" value="Contoso.Commerce.Runtime.CrossLoyaltySample.CrossLoyaltyCardService, Contoso.Commerce.Runtime.CrossLoyaltySample" />
    - Drop both the new CRT and Retail Server assemblies into the local Retail Server bin folder. Alternatively, use the Retail SDK's AfterBuildDropBinariesToRetailServer target for rapid development (Note: If you use the AfterBuildDropBinariesToRetailServer target, then you have to rebuild the 2 assemblies at least once in order to binplace them automatically).
    - Use inetmgr to browse to the Retail Server's $metadata and verify that the CrossLoyalty activity is exposed (i.e. open https://usnconeboxax1ret.cloud.onebox.dynamics.com/Commerce/$metadata and search for "CrossLoyalty" in the XML).

4. Enable the extension controller in offline mode (This makes the Retail Server controller logic available when the the client is not connected)
    - This sample's Retail Server controller is written using the Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts, meaning the same controller assembly can be used by Retail Server and the offline runtime
    - Navigate to RetailSDK\Assets folder and open RetailProxy.MPOSOffline.ext.config
    - Under the composition section, register your Retail Server Controller's DLL name:
 <add source="assembly" value="Contoso.RetailServer.CrossLoyaltySample" /> 
    - For manual testing, update the RetailProxy.MPOSOffline.ext.config under the C:\Program Files (x86)\Microsoft Dynamics 365\70\Retail Modern POS\ClientBroker\ext with the custom proxy library name under the composition section.
 <add source="assembly" value="Contoso.RetailServer.CrossLoyaltySample" />
    - Navigate to RetailSDK\Assets folder and open CommerceRuntime.MPOSOffline.ext.config
    - Under the composition section, register the extension's CRT library name:
 <add source="assembly" value="Contoso.Commerce.Runtime.CrossLoyaltySample" /> 
    - For manual testing, update the CommerceRuntime.MPOSOffline.ext.config under the C:\Program Files (x86)\Microsoft Dynamics 365\70\Retail Modern POS\ClientBroker\ext with the custom proxy library name under the composition section.
 <add source="assembly" value="Contoso.Commerce.Runtime.CrossLoyaltySample" />
    - add the proxy extension dll to customization.settings ---> <ISV_RetailProxy_CustomizableFile Include="$(SdkReferencesPath)\Contoso.RetailServer.CrossLoyaltySample.dll" />

5. Use the RetailServer test client to verify that calling the new functionality succeeds.
    - Define a C# proxy so other C# code can consume your Controller's endpoints
        - Open Proxies.RetailProxy.Extensions.CrossLoyaltySample.csproj from RetailSDK\SampleExtensions\RetailProxy\RetailProxy.Extensions.CrossLoyaltySample
        - Add the Contoso.Commerce.Runtime.CrossLoyaltySample.dll and Contoso.RetailServer.CrossLoyaltySample.dll as reference to the project
        - Build the proxy project.
        - Copy the output assembly and paste in RetailSDK\References folder.
    - Open the solution at RetailSdk\SampleExtensions\RetailServer\Extensions.TestClient\RetailServer.Extensions.TestClient.sln.
    - Uncomment all code that is marked with "SDKSAMPLE_CROSSLOYALTY".
    - Add assembly references to Contoso.Commerce.RetailProxy.CrossLoyaltySample.dll and Contoso.Commerce.Runtime.CrossLoyaltySample.dll.
    - Compile the solution.
    - Run the Retail Server Test Client.
    - Enter the local Retail Server URL in the text box next to the "Activate New" button.
    - Click the "Activate New" button.
    - Enter device and register ids and hit Activate.
    - Enter the device and register id you would like to activate and click "Activate".
    - Sign in with the AAD credentials that has the needed registration privileges.
    - Wait a few seconds.
    - The Retail Server Test Client should now show that the device is activated.
    - Click the "Logon" button and log on with a workers credentials.
    - Click the "SDK Tests" button in order to call the new functionality.
    - Click the "Debug" button to see whether or not the your validation succeeded.
    Notes:
    - To see a console with errors/logs, use the "Debug" button.

6. Official Deployment
    - Run msbuild for the whole RetailSdk (Note: All resulting packages will have all of the appropriate changes).
    - Deploy the resulting packages via LCS or manually.