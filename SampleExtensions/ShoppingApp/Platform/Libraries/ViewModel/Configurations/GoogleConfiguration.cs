/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Configurations;
using System;
using System.Xml.Linq;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations
{
    public class GoogleConfiguration : ConfigurationBase
    {
        public Uri RedirectUrl
        {
            get
            {
                return new Uri(Element.Element("RedirectUrl")?.Value);
            }
        }

        public string ClientId
        {
            get
            {
                return Element.Element("ClientId")?.Value;
            }
        }

        public GoogleConfiguration(XElement element) : base(element)
        {
        }
    }

}