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
    namespace Commerce.Runtime.SalesTransactionSignatureSample
    {
        using System;
        using Microsoft.Dynamics.Retail.Resources.Strings;

        /// <summary>
        /// Encapsulates localization functionality for sales transaction signature.
        /// </summary>
        public class SalesTransactionSignatureLocalizer
        {
            private static readonly Lazy<SalesTransactionSignatureLocalizer> LocalizerInstance = new Lazy<SalesTransactionSignatureLocalizer>(() => new SalesTransactionSignatureLocalizer());
            private readonly StringLocalizer localizer;

            private SalesTransactionSignatureLocalizer()
            {
                var resourceFileName = string.Format("{0}.Properties.Message", typeof(SalesTransactionSignatureLocalizer).Namespace);
                this.localizer = new StringLocalizer(resourceFileName, typeof(SalesTransactionSignatureLocalizer).Assembly);
            }

            /// <summary>
            /// Gets <c>SalesTransactionSignatureLocalizer</c> instance.
            /// </summary>
            public static SalesTransactionSignatureLocalizer Instance
            {
                get
                {
                    return LocalizerInstance.Value;
                }
            }

            /// <summary>
            /// Translates the specified text identifier according to culture name.
            /// </summary>
            /// <param name="cultureName">The name of the culture.</param>
            /// <param name="textId">The text identifier.</param>
            /// <returns>The localized string.</returns>
            public string Translate(string cultureName, string textId)
            {
                return this.localizer.Translate(cultureName, textId);
            }
        }
    }
}
