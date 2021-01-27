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
    namespace Commerce.Runtime.SequentialSignatureRegister
    {
        using System;
        using Microsoft.Dynamics.Retail.Resources.Strings;

        /// <summary>
        /// Encapsulates localization functionality for sales transaction signature.
        /// </summary>
        public class SequentialSignatureRegisterLocalizer
        {
            private static readonly Lazy<SequentialSignatureRegisterLocalizer> LocalizerInstance = new Lazy<SequentialSignatureRegisterLocalizer>(() => new SequentialSignatureRegisterLocalizer());
            private readonly StringLocalizer localizer;

            private SequentialSignatureRegisterLocalizer()
            {
                var resourceFileName = string.Format("{0}.Properties.Messages.Message", typeof(SequentialSignatureRegisterLocalizer).Namespace);
                this.localizer = new StringLocalizer(resourceFileName, typeof(SequentialSignatureRegisterLocalizer).Assembly);
            }

            /// <summary>
            /// Gets <c>SalesTransactionSignatureLocalizer</c> instance.
            /// </summary>
            public static SequentialSignatureRegisterLocalizer Instance
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
