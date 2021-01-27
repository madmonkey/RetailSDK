Sample overview:
The sample shows how to implement custom receipt fields and custom receipt types.

Setup steps:

Custom Receipt Fields
1. Create labels.
    - In AX search for "Language text".  
    - Go to that page and create three labels: "TipAmount", "ItemNumber" and "TenderId". 
    - Specify a different Text ID to each of them and set Language ID as "en-us".
2. Create custom receipt fields.
    - In AX search for "Custom fields". 
    - Go to that page and create three custom fields: "TipAmount", "ItemNumber" and "TenderId". 
    - Set the Type as Receipt.
    - Assign corresponding Caption text ID you created in previous step to them.
3. Modify the receipt format.
    - In AX search for "receipt format". 
    - Open the designer for receipt type "Receipt". 
    - Now you should be able to see those three new fields you created in previous steps. 
    - Drag and drop them to the canvas and save the receipt format. 
    - Put the TipAmount in the header or footer section. 
    - Put the ItemNumber in the body section. 
    - Put the TenderId on the same line of TenderName or TenderAmount.
4. Run download job 1090 (Registers).
5. Open project at RetailSDK\SampleExtensions\CommerceRuntime\Extensions.ReceiptsSample\CommerceRuntime.Extensions.ReceiptsSample.csproj and compile it.
6. Use inetmgr to find the location of the local Retail Server
7. Copy the Contoso.Commerce.Runtime.ReceiptsSample.dll to the bin folder of RetailServer. This will only work on this development machine. For a real customization dll needs to be added to the deployment package, "register" it in Customizations.settings file (see the Retail Sdk Handbook.pdf for details)
8. Register the CRT change in commerceruntime.ext.config (Note: Please DO NOT edit commerceruntime.config file. This file is not meant for any customizations.): 
    <add source="type" value="Contoso.Commerce.Runtime.ReceiptsSample.GetCustomReceiptFieldsService, Contoso.Commerce.Runtime.ReceiptsSample" />
9. Now make a normal transaction in POS and check out the transaction. Now you should be able to see those values printed on the receipt.
    
Custom Receipt Type
1. Create a new receipt format.
    - In AX search for "Receipt format"
    - Set the Receipt type as CustomReceiptType6.
    - Set the Print behavior as Always print.
    - Give other fields appropriate values.
    - Save the changes.
    - Open the designer for this format. 
    - Put TransactionNumber in the header. Put ItemId in the body. Put some words(Text) in the footer part.
    - Save the changes.
2. Add this receipt format to receipt profile.
    - In AX search for "receipt profile". 
    - Go to that page, select the receipt profile that is currently being used.
    - Click Add button, and select CustomReceiptType6. Select the receipt format you previously created. Save the changes.
4. Run download job 1090 (Registers).
5. Open project at RetailSDK\SampleExtensions\CommerceRuntime\Extensions.ReceiptsSample\CommerceRuntime.Extensions.ReceiptsSample.csproj and compile it.
6. Use inetmgr to find the location of the local Retail Server
7. Copy the Contoso.Commerce.Runtime.ReceiptsSample.dll to the bin folder of RetailServer. This will only work on this development machine. For a real customization dll needs to be added to the deployment package, "register" it in Customizations.settings file (see the Retail Sdk Handbook.pdf for details)
8. Register the CRT change in commerceruntime.ext.config (Note: Please DO NOT edit commerceruntime.config file. This file is not meant for any customizations.): 
    <add source="type" value="Contoso.Commerce.Runtime.ReceiptsSample.GetCustomReceiptsRequestHandler, Contoso.Commerce.Runtime.ReceiptsSample" />
9. Customize POS to print the new receipt type after the standard receipts:
    - Subscribe to PostEndTransaction trigger.
    - At the trigger, execute GetReceiptsClientRequest with ReceiptTypeValue set as CustomReceiptType6 in the ReceiptRetrievalCriteria .
10.In POS make a transaction.
    - Add item 0001, 0002, 81134 and 81135 into cart.
    - Check out the transaction.