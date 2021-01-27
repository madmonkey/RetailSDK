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
    namespace Commerce.Runtime.DocumentProvider.EFRSample
    {
        using System;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Constants;
        using Microsoft.Dynamics.Retail.Resources.Strings;

        /// <summary>
        /// Encapsulates localization functionality for the sales transaction document.
        /// </summary>
        public class SalesTransactionLocalizer
        {
            private static readonly Lazy<SalesTransactionLocalizer> localizerInstance = new Lazy<SalesTransactionLocalizer>(() => new SalesTransactionLocalizer());
            private readonly StringLocalizer localizer;

            private SalesTransactionLocalizer()
            {
                string resourceFileName = string.Format(SalesTransactionLocalizationConstants.LocalizationResourceFileNameTemplate, typeof(SalesTransactionLocalizer).Namespace);
                this.localizer = new StringLocalizer(resourceFileName, typeof(SalesTransactionLocalizer).Assembly);
            }

            /// <summary>
            /// Gets <c>SalesTransactionLocalizer</c> instance.
            /// </summary>
            public static SalesTransactionLocalizer Instance
            {
                get
                {
                    return localizerInstance.Value;
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
                string translationId = SalesTransactionLocalizationConstants.LocalizationResourcePrefix + textId;
                return this.localizer.Translate(cultureName, translationId);
            }
        }
    }
}
