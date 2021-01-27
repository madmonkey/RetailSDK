Sample overview
===
This sample demonstrates how to read extension properties in the POS client, how to add a new column to a data list, and how to use the new formatters library in POS.


Sync any configured customer attributes and values from HQ
===
Open the Dynamics 365 web interface to the "distribution schedule" page
Run the 1010 "Customers" CDX Job


Set up CRT customizations
===
1. Add these to the commerceruntime.ext.config (Note: Please DO NOT edit commerceruntime.config file. This file is not meant for any customizations.):
-> Add this line within the "composition" node: <add source="assembly" value="Contoso.Commerce.Runtime.CustomerSearchWithAttributesSample" />

The extension code can be viewed here:
"RetailSDK\Code\SampleExtensions\CommerceRuntime\Extensions.CustomerSearchWithAttributesSample\Runtime.Extensions.CustomerSearchWithAttributesSample.csproj"


Set up POS customizations
===
Open "RetailSDK\Code\POS\ModernPos.sln"
Include the "CustomerSearchWithAttributesSample" folder in the SampleExtensions project
Add { "baseUrl": "CustomerSearchWithAttributesSample" } to extensions.json
Comment out this line in tsconfig.json
-> "CustomerSearchWithAttributesSample"
If necessary, set the build's target platform to X86
Rebuild the solution
Run


Try it out!
===
Look up "Berg" in customer search, note that "Marketing opt in" is false
Click on the search result
Click on edit in the app bar
Set "Marketing opt in" to true
Look up "Berg" in customer search again, note that "Marketing opt in" is true now
