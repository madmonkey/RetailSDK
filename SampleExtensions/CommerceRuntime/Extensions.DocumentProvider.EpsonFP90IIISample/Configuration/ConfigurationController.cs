/**
* SAMPLE CODE NOTICE
* 
* THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
* OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
* THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
* NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
*/

namespace Contoso
{
    namespace Commerce.Runtime.DocumentProvider.EpsonFP90IIISample
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Xml.Linq;
        using Contoso.Commerce.Runtime.DocumentProvider.EpsonFP90IIISample.Constants;
        using Contoso.Commerce.Runtime.DocumentProvider.EpsonFP90IIISample.Helpers;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Reads the settings in fiscal document provider configuration.
        /// </summary>
        public static class ConfigurationController
        {
            /// <summary>
            /// Parses the deposit payment type in functionality profile.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <returns>The deposit payment type.</returns>
            public static string ParseDepositPaymentType(FiscalIntegrationFunctionalityProfile functionalityProfile)
            {
                ThrowIf.Null(functionalityProfile, nameof(functionalityProfile));

                string depositPaymentType = GetStringValueElement(functionalityProfile.DocumentProviderProperties, ConfigurationElementConstants.FiscalServiceDataMappingInfo, ConfigurationElementConstants.DepositPaymentType).Value;

                if (string.IsNullOrEmpty(depositPaymentType))
                {
                    throw new Exception("The payment method for the deposit payment is missing in the document provider configuration.");
                }

                return depositPaymentType;
            }

            /// <summary>
            /// Parses the receipt number barcode type in functionality profile.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <returns>The receipt number barcode type.</returns>
            public static string ParseReceiptNumberBarcodeType(FiscalIntegrationFunctionalityProfile functionalityProfile)
            {
                ThrowIf.Null(functionalityProfile, nameof(functionalityProfile));

                string barcodeType = GetStringValueElement(functionalityProfile.DocumentProviderProperties, ConfigurationElementConstants.FiscalServiceDataMappingInfo, ConfigurationElementConstants.ReceiptNumberBarcodeType).Value;

                return barcodeType;
            }

            /// <summary>
            /// Parses the supported tender types form tender types mapping in functionality profile.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <returns>The supported tender types.</returns>
            public static Dictionary<string, int> ParseSupportedTenderTypeMappings(FiscalIntegrationFunctionalityProfile functionalityProfile)
            {
                ThrowIf.Null(functionalityProfile, nameof(functionalityProfile));

                string tenderTypeMapping = GetStringValueElement(functionalityProfile.DocumentProviderProperties, ConfigurationElementConstants.FiscalServiceDataMappingInfo, ConfigurationElementConstants.TenderTypeMapping).Value;

                Dictionary<string, int> supportedTenderType =
                    tenderTypeMapping.Split(';')
                        .Select(v => v.Split(':'))
                        .ToDictionary(l => l[0].Trim(), l => Convert.ToInt32(l[1].Trim()));

                return supportedTenderType;
            }

            /// <summary>
            /// Parses the supported VAT rates form VAT Rates settings in functionality profile.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <returns>The supported VAT rates.</returns>
            public static Dictionary<int, string> ParseSupportedVATRates(FiscalIntegrationFunctionalityProfile functionalityProfile)
            {
                ThrowIf.Null(functionalityProfile, nameof(functionalityProfile));

                string vatRateSetting = GetStringValueElement(functionalityProfile.DocumentProviderProperties, ConfigurationElementConstants.FiscalServiceDataMappingInfo, ConfigurationElementConstants.VATRatesMapping).Value;

                Dictionary<int, string> supportedVATRates =
                    vatRateSetting.Split(';')
                        .Select(v => v.Split(':'))
                        .ToDictionary(l => SalesOrderHelper.ConvertSalesTaxRateToInt(l[1].Trim()), l => l[0].Trim());

                return supportedVATRates;
            }

            /// <summary>
            /// Parses the "Print fiscal data in receipt header" settings in functionality profile.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <returns>The value of PrintFiscalDatatInReceiptHeader field or true if field is empty or doesn`t exist.</returns>
            public static bool ParsePrintFiscalDatatInReceiptHeader(FiscalIntegrationFunctionalityProfile functionalityProfile)
            {
                ThrowIf.Null(functionalityProfile, nameof(functionalityProfile));

                return GetBooleanValueElement(functionalityProfile.DocumentProviderProperties, ConfigurationElementConstants.FiscalServiceDataMappingInfo, ConfigurationElementConstants.PrintFiscalDataInReceiptHeader);

            }

            /// <summary>
            /// Find the StringValue element for specific name and namespace of the fiscal document provider configuration.
            /// </summary>
            /// <param name="document">The fiscal document provider configuration in functionality profile.</param>
            /// <param name="namespaceValue">The value of namespace element.</param>
            /// <param name="nameValue">The value of name element.</param>
            /// <returns>The StringValue element.</returns>
            public static XElement GetStringValueElement(string document, string namespaceValue, string nameValue)
            {
                XElement xElement = XElement.Parse(document);

                return xElement.Descendants(ConfigurationElementConstants.PropertyElement)
                    .Single(element => IsElementExisted(element, namespaceValue, nameValue)).Descendants(ConfigurationElementConstants.StringValueElement).First();
            }

            /// <summary>
            /// Find the BooleanValue element for specific name and namespace of the fiscal document provider configuration.
            /// </summary>
            /// <param name="document">The fiscal document provider configuration in functionality profile.</param>
            /// <param name="namespaceValue">The value of namespace element.</param>
            /// <param name="nameValue">The value of name element.</param>
            /// <returns>The StringValue element.</returns>
            public static bool GetBooleanValueElement(string document, string namespaceValue, string nameValue)
            {
                XElement xElement = XElement.Parse(document);

                bool result;

                if (IsPropertyExisted(xElement, namespaceValue, nameValue))
                {
                    string booleanValue = xElement.Descendants(ConfigurationElementConstants.PropertyElement)
                        .Single(element => IsElementExisted(element, namespaceValue, nameValue)).Descendants(ConfigurationElementConstants.BooleanValueElement).First().Value;

                    if (Boolean.TryParse(booleanValue, out result))
                    {
                        return result;
                    }
                }

                return true;
            }

            /// <summary>
            /// Gets the property for specific namespace and name existes or not.
            /// </summary>
            /// <param name="element">The element.</param>
            /// <param name="namespaceValue">The value of namespace element.</param>
            /// <param name="nameValue">The value of name element.</param>
            /// <returns>True if the element existes, else false.</returns>
            private static bool IsPropertyExisted(XElement element, string namespaceValue, string nameValue)
            {
                IEnumerable<XElement> propertyElements = 
                    from item in element.Descendants(ConfigurationElementConstants.PropertyElement)
                    where item.Element("Namespace").Value == namespaceValue && item.Element("Name").Value == nameValue
                    select item;

                return propertyElements.Any();
            }

            /// <summary>
            /// Gets the element for specific namespace and name existes or not.
            /// </summary>
            /// <param name="element">The element.</param>
            /// <param name="namespaceValue">The value of namespace element.</param>
            /// <param name="nameValue">The value of name element.</param>
            /// <returns>True if the element existes, else false.</returns>
            private static bool IsElementExisted(XElement element, string namespaceValue, string nameValue)
            {
                return element.Element(ConfigurationElementConstants.NamespaceElement).Value == namespaceValue
                    && element.Element(ConfigurationElementConstants.NameElement).Value == nameValue;
            }
        }
    }
}
