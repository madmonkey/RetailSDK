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
    namespace Commerce.Runtime.DocumentProvider.EpsonFP90IIISample.Constants
    {
        /// <summary>
        /// Contains constants of elements for fiscal document provider configuration.
        /// </summary>
        /// <remark>
        /// This is defined by a third-party library, or by the tax authority, etc.
        /// </remark>
        public static class ConfigurationElementConstants
        {
            /// <summary>
            /// The inner text of Name element for DepositPaymentType property.
            /// </summary>
            internal const string DepositPaymentType = "DepositPaymentType";

            /// <summary>
            /// The inner text of Namespace element for FiscalServiceDataMappingInfo.
            /// </summary>
            internal const string FiscalServiceDataMappingInfo = "FiscalServiceDataMappingInfo";

            /// <summary>
            /// The Name element.
            /// </summary>
            internal const string NameElement = "Name";

            /// <summary>
            /// The Namespace element.
            /// </summary>
            internal const string NamespaceElement = "Namespace";

            /// <summary>
            /// The ConfigurationProperty element.
            /// </summary>
            internal const string PropertyElement = "ConfigurationProperty";

            /// <summary>
            /// The inner text of Name element for ReceiptNumberBarcodeType property.
            /// </summary>
            internal const string ReceiptNumberBarcodeType = "ReceiptNumberBarcodeType";

            /// <summary>
            /// The ConfigurationProperties element.
            /// </summary>
            internal const string RootElement = "ConfigurationProperties";

            /// <summary>
            /// The StringValue element.
            /// </summary>
            internal const string StringValueElement = "StringValue";

            /// <summary>
            /// The inner text of Name element for TenderTypeMapping property.
            /// </summary>
            internal const string TenderTypeMapping = "TenderTypeMapping";

            /// <summary>
            /// The inner text of Name element for VATRatesMapping property.
            /// </summary>
            internal const string VATRatesMapping = "VATRatesMapping";

            /// <summary>
            /// The BooleanValue element.
            /// </summary>
            internal const string BooleanValueElement = "BooleanValue";

            /// <summary>
            /// The inner text of Boolean element for PrintFiscalDatatInReceiptHeader property.
            /// </summary>
            internal const string PrintFiscalDataInReceiptHeader = "PrintFiscalDataInReceiptHeader";
        }
    }
}
