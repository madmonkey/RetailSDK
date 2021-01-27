### Steps to run sample extension packages, e.g., SampleExtensions and SampleExtensions2.

1. Update extensions.json with the following content. 
```
{
  "extensionPackages": [
    {
      "baseUrl": "SampleExtensions"
    },
    {
      "baseUrl": "SampleExtensions2"
    }
  ]
} 
```
2. Select Pos.Extensions project in Solution Explorer, make sure "Show All Files" is turned on. 
3. Right click on "SampleExtensions" folder, select "Include In Project". 
4. Do the same for "SampleExtensions2" folder.
5. Update tsconfig.json to comment out the two sample extension package folders from the exclude list like the following.
```
  "exclude": [
    ...
  //  ,"SampleExtensions"
  //  ,"SampleExtensions2"
    ...
  ],
```
Note that other extension package folders (even though not included in the Visual Studio project) should be still kept in the exclude list if they are not meant to be included.
6. Save all and run. Note that saving ModernPos.sln would change default platform (reorder ARM before x86) and the change to ModernPos.sln file may need to be reverted back to avoid MSBuild issues.