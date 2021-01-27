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
    public class ServiceConfiguration : ConfigurationBase
    {
        public bool IsEvaluationModeEnabled
        {
            get
            {
                return Convert.ToBoolean(Element.Element("EvaluationModeEnabled")?.Value);
            }
        }

        public Uri DataServiceUrl
        {
            get
            {
                return new Uri(Element.Element("DataServiceUrl")?.Value);
            }
        }

        public Uri MediaBaseUrl
        {
            get
            {
                return new Uri(Element.Element("MediaBaseUrl")?.Value);
            }
        }

        public Uri CardPaymentHostPageUrl
        {
            get
            {
                return new Uri(Element.Element("CardPaymentHostPageUrl")?.Value);
            }
        }

        public string OperatingUnitNumber
        {
            get
            {
                return Element.Element("OperatingUnitNumber")?.Value;
            }
        }

        public string CountryRegions
        {
            get
            {
                return Element.Element("CountryRegions")?.Value;
            }
        }

        public bool DebugMode 
        {
            get
            {
                return Convert.ToBoolean(Element.Element("DebugMode")?.Value);
            }
        }

        public ServiceConfiguration(XElement element): base(element)
        {
        }
    }
}
