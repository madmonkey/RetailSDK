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
    namespace Commerce.Runtime.ReceiptsFrance
    {
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Helper class for the receipt localization routine calls.
        /// </summary>
        public class ReceiptLocalizationHelper
        {
            /// <summary>
            /// The localizing context.
            /// </summary>
            private RequestContext context;

            /// <summary>
            /// The localizing currency.
            /// </summary>
            private string currency;

            /// <summary>
            /// The localizing culture name.
            /// </summary>
            private string cultureName;

            /// <summary>
            /// Initializes a new instance of the <see cref="ReceiptLocalizationHelper"/> class.
            /// </summary>
            /// <param name="context">Request context.</param>
            public ReceiptLocalizationHelper(RequestContext context)
            {
                ThrowIf.Null(context, "context");

                this.context = context;
                this.currency = context.GetOrgUnit().Currency;
                this.cultureName = context.LanguageId;
            }

            /// <summary>
            /// Translates the specified text identifier.
            /// </summary>
            /// <param name="textId">The text identifier.</param>
            /// <returns>The localized string.</returns>
            public string Translate(string textId)
            {
                return ReceiptLocalizer.Instance.Translate(this.cultureName, textId);
            }

            /// <summary>
            /// Formats the currency to another currency.
            /// </summary>
            /// <param name="value">The digital value of the currency to be formatted.</param>
            /// <returns>The formatted value of the currency.</returns>
            public async Task<string> FormatCurrencyAsync(decimal value)
            {
                string currencySymbol = string.Empty;
                int currencyDecimals = 0;
                if (!string.IsNullOrWhiteSpace(this.currency))
                {
                    var getCurrenciesDataRequest = new GetCurrenciesDataRequest(this.currency, QueryResultSettings.SingleRecord);
                    var currencyResponse = await this.context.Runtime.ExecuteAsync<EntityDataServiceResponse<Currency>>(getCurrenciesDataRequest, this.context).ConfigureAwait(false);
                    Currency currency = currencyResponse.PagedEntityCollection.FirstOrDefault();
                    if (currency != null)
                    {
                        currencySymbol = currency.CurrencySymbol;
                        currencyDecimals = currency.NumberOfDecimals;
                    }
                }

                var formattingRequest = new GetFormattedCurrencyServiceRequest(value, currencySymbol, currencyDecimals);
                var formattedValueResponse = await this.context.ExecuteAsync<GetFormattedContentServiceResponse>(formattingRequest).ConfigureAwait(false);
                string formattedValue = formattedValueResponse.FormattedValue;

                return formattedValue;
            }
        }
    }
}
