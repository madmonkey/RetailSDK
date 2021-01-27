Sample overview:
The sample shows how the implementation of hardware station for OPOS devices.

Setup steps:

0. It is advised that you do these changes on a untouched RetailSdk. Ideally, you would have it under source control (VSO, or similar) and no files are changed so far. This is ideal, as you could revert at any steps
   without much work.

1. Extend Hardware station and Peripheral projects. 
    - The Hardware station solution is located under RetailSDK\SampleExtensions\HardwareStation, open this solution.
    - Compile the project, copy the assemblies under Peripherals.Opos\bin\Debug. 
    - Copy the dll to the HW station deployed box 
    - The new dll must be part of the Hardware Station package and it is not by default. In Customization.settings file (under BuildTools folder) the customized / new files must be listed.
    - Add the below section assembly to the composition:
          <add source="assembly" value="Contoso.Commerce.HardwareStation.Peripherals.Opos" />
    - The change in the config file must be done on:
      1. The local dev box for testing, and
      2. In the actual file in VSTS that is included in the package (*.config)
          
2. Official Deployment
    - run msbuild for the whole RetailSdk
    - all packages will have all appropriate changes
    - deploy packages via LCS or manual
    