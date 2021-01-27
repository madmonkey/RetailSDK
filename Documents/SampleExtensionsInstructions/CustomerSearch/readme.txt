Sample overview:
This sample demonstrates how to override an existing request handler and call the original request handler from the new request handler. This pattern can be used to add additional functionality to an existing request handler. This example combines the results of customer search with the results of an external customer search service. 

Changes are in CRT and CRT Test Host.

Setup:
1. Add these to the commerceruntime.ext.config (Note: Please DO NOT edit commerceruntime.config file. This file is not meant for any customizations.):
    <add source="type" value="Contoso.Commerce.Runtime.CustomerSearchSample.CustomerSearchRequestHandler, Contoso.Commerce.Runtime.CustomerSearchSample" />

2. Uncomment the SDKSAMPLE_CUSTOMERSEARCH section in Program.cs.

3. Run CRT test host project (Runtime.Extensions.TestHost.csproj) in debugger and execute the code.
