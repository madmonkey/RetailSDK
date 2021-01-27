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
using System.Xml.Linq;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations
{
    public class ConfigurationManager
    {
        private static readonly Lazy<ConfigurationManager> instance = new Lazy<ConfigurationManager>(() => new ConfigurationManager());

        private readonly XElement configElement;
        private readonly ServiceConfiguration serviceConfiguration;
        private readonly PalletConfiguration palletConfiguration;
        private readonly GoogleConfiguration googleConfiguration;
        private readonly AboutConfiguration aboutConfiguration;

        private ConfigurationManager()
        {
            configElement = XDocument.Parse(CrossEntryAssembly.GetManifestTextResourceAsync("config.xml").Result).Element("config");
            serviceConfiguration = new ServiceConfiguration(configElement.Element("service"));
            palletConfiguration = new PalletConfiguration(configElement.Element("pallet"));
            googleConfiguration = new GoogleConfiguration(configElement.Element("google"));
            aboutConfiguration = new AboutConfiguration(configElement.Element("about"));
        }

        public XElement ConfigElement
        {
            get
            {
                return configElement;
            }
        }

        public ServiceConfiguration ServiceConfiguration
        {
            get
            {
                return serviceConfiguration;
            }
        }

        public PalletConfiguration PalletConfiguration
        {
            get
            {
                return palletConfiguration;
            }
        }

        public GoogleConfiguration GoogleConfiguration
        {
            get
            {
                return googleConfiguration;
            }
        }

        public AboutConfiguration AboutConfiguration
        {
            get
            {
                return aboutConfiguration;
            }
        }

        public static ConfigurationManager Instance
        {
            get
            {
                return instance.Value;
            }
        }
    }
}