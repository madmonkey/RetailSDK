Sample overview:
This sample demonstrates how to add a custom attributes on Cart and CartLine entities.

Changes are in CRT and CRT Test Host.

Setup:
1. Add these to the commerceruntime.ext.config (Note: Please DO NOT edit commerceruntime.config file. This file is not meant for any customizations.) :
    <add source="assembly" value="Contoso.Commerce.Runtime.TransactionAttributesSample" />

2. Add the compiled custom assembly to the retail server bin folder.