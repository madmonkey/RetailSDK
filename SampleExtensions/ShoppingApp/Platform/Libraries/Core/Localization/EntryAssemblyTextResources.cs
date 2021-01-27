/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Plugins;
using System;
using System.Globalization;
using System.Resources;

namespace Contoso.Commerce.Client.Localization
{
    public class EntryAssemblyTextResources
    {
        private static readonly Lazy<ResourceManager> resourceManager = new Lazy<ResourceManager>(() =>
            new ResourceManager(CrossEntryAssembly.GetResourceFullName("TextResources"), CrossEntryAssembly.Assembly));
        private static readonly Lazy<CultureInfo> resourceCulture = new Lazy<CultureInfo>(() => CrossLocalize.Localize.Culture);

        public static ResourceManager ResourceManager
        {
            get
            {
                return resourceManager.Value;
            }
        }

        public static CultureInfo ResourceCulture
        {
            get
            {
                return resourceCulture.Value;
            }
        }

        public static string AppName
        {
            get
            {
                return ResourceManager.GetString("AppName", ResourceCulture);
            }
        }
    }
}
