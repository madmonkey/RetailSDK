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
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations
{
    public class AboutConfiguration : ConfigurationBase
    {
        public Uri PrivacyPolicyUrl
        {
            get
            {
                string url = Element.Element("PrivacyPolicyUrl")?.Value;
                return string.IsNullOrWhiteSpace(url) ? null : new Uri(url);
            }
        }

        public Uri TermsOfUseUrl
        {
            get
            {
                string url = Element.Element("TermsOfUseUrl")?.Value;
                return string.IsNullOrWhiteSpace(url) ? null : new Uri(url);
            }
        }

        public Uri ThirdPartyNotices
        {
            get
            {
                string url = Element.Element("ThirdPartyNoticesUrl")?.Value;
                return string.IsNullOrWhiteSpace(url) ? null : new Uri(url);
            }
        }

        public AboutConfiguration(XElement element) : base(element)
        {
        }
    }
}
