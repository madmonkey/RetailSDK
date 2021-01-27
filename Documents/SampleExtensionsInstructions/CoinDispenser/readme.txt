Sample overview:
The sample shows how to create OPOS coin dispenser extension using Hardware station and invoke from POS. 
The coin dispenser extension can be tested using virtual peripherals, the extensions are also available through virtual peripherals for testing. 

Setup steps:

0. It is advised that you do these changes on a untouched RetailSdk. Ideally, you would have it under source control (VSO, or similar) and no files are changed so far. This is ideal, as you could revert at any steps without much work.

1. Extend Hardware Station and Peripheral projects. 
    - The Hardware Station solution is located under RetailSDK\HardwareStation.
    - Open this solution and add the extension project HardwareStation.Extension.CoinDispenserSample.csproj located under RetailSDK\SampleExtensions\HardwareStation\Extension.CoinDispenserSample.
    - Compile the project and copy the assembly Contoso.Commerce.HardwareStation.CoinDispenserSample.dll under Extension.CoinDispenserSample\bin\Debug. 
    - Copy the assembly to the machine where Hardware Station was deployed.
    - Remote: For remote Hardware Station, copy to the bin\ location of Hardware Station.
    - Local: For local Hardware Station, copy to %ProgramFiles(x86)\Microsoft Dynamics 365\70\Retail Modern POS\ClientBroker.
    - Add the section below to the composition:
          <add source="assembly" value="Contoso.Commerce.HardwareStation.Extension.CoinDispenserSample" />
    - Remote: For remote Hardware Station, the composition file is web.config under the IIS deployed location.
    - Local: For local Hardware Station, the composition file is DLLHost.exe.config under the folder %ProgramFiles(x86)\Microsoft Dynamics 365\70\Retail Modern POS\ClientBroker.
    - Recycle the process after doing the above changes. If remote, the process is w3wp.exe (use iisreset). If local, it's dllhost.exe.

2. Setting up the Virtual Peripherals.
    - Open the Virtual peripherals installed. 
    - Go to Coin Dispenser tab in the Virtual peripherals (if you don't find Coin Dispenser, go to the deployed folder and open Peripherals.xml and add the following at the end of the section):
        <Peripheral Name="CoinDispenser">
           <DisplayName>Coin dispenser</DisplayName>
           <Image>../Resources/Images/PeripheralCoinDispenser.PNG</Image>
           <Name>CoinDispenserView</Name>
        </Peripheral>
    - When MPOS check out happens, the balance will be dispensed to the coin dispense and the Virtual Peripherals client should display the dispensed change amount.

3. Official Deployment
    - run msbuild for the whole RetailSdk
    - all packages will have all appropriate changes
    - deploy packages via LCS or manual
