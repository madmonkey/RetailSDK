/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Autofac;
using Contoso.Commerce.Client.Extensions;
using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.Plugins
{
    public class CrossEntryAssembly
    {
        private static readonly Lazy<IEntryAssembly> entryAssembly = new Lazy<IEntryAssembly>(() => AppContainer.Resolve<IEntryAssembly>());

        public static Assembly Assembly
        {
            get
            {
                return entryAssembly.Value.Assembly;
            }
        }

        public static string GetResourceFullName(string name)
        {
            return $"{Assembly.GetName().Name}.{name}";
        }

        public static async Task<string> GetManifestTextResourceAsync(string name)
        {
            // TODO: Better error handling when config file is missing or not found.
            string resourceName = GetResourceFullName(name);
            using (var stream = Assembly.GetManifestResourceStream(resourceName))
            using (var reader = new StreamReader(stream))
            {
                return await reader.ReadToEndAsync();
            }
        }
    }
}
