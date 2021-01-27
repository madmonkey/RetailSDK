﻿/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso
{
    namespace Commerce.Runtime.ReceiptsNorway
    {
        using System;
        using System.Reflection;
        using Microsoft.Dynamics.Retail.Resources.Strings;

        /// <summary>
        /// Encapsulates localization functionality for custom Norwegian receipts.
        /// </summary>
        public class ReceiptLocalizer
        {
            private static readonly Lazy<ReceiptLocalizer> LocalizerInstance = new Lazy<ReceiptLocalizer>(() => new ReceiptLocalizer());
            private readonly StringLocalizer localizer;

            private ReceiptLocalizer()
            {
                var resourceFileName = string.Format(ReceiptConstants.LocalizationResourceFileNameTemplate, typeof(ReceiptLocalizer).Namespace);
                this.localizer = new StringLocalizer(resourceFileName, typeof(ReceiptLocalizer).GetTypeInfo().Assembly);
            }

            /// <summary>
            /// Gets <c>ReceiptsLocalizer</c> instance.
            /// </summary>
            public static ReceiptLocalizer Instance
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
                string translationId = ReceiptConstants.LocalizationResourcePrefix + textId;
                return this.localizer.Translate(cultureName, translationId);
            }
        }
    }
}
