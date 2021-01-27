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
    namespace Commerce.Runtime.XZReportsNorway
    {
        using System.Globalization;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Encapsulates functionality for X/Z reports formatting.
        /// </summary>
        public class XZReportsFormatter
        {
            /// <summary>
            /// The format of a section.
            /// </summary>
            public const string SectionFormat = "{0}:{1}";

            /// <summary>
            /// The padding symbol.
            /// </summary>
            public const char Padding = ' ';

            /// <summary>
            /// The paper width.
            /// </summary>
            public const int PaperWidth = 55;

            /// <summary>
            /// The single line for receipt.
            /// </summary>
            public static readonly string LineSeparator = string.Empty.PadLeft(PaperWidth, '-');

            /// <summary>
            /// The formatting context.
            /// </summary>
            private RequestContext context;

            /// <summary>
            /// The formatting currency.
            /// </summary>
            private string currency;

            /// <summary>
            /// The formatting culture.
            /// </summary>
            private CultureInfo culture;

            /// <summary>
            /// Initializes a new instance of the <see cref="XZReportsFormatter"/> class.
            /// </summary>
            /// <param name="context">Request context.</param>
            public XZReportsFormatter(RequestContext context)
            {
                ThrowIf.Null(context, "context");

                this.context = context;
                this.currency = context.GetOrgUnit().Currency;
                this.culture = new CultureInfo(context.LanguageId);
            }

            /// <summary>
            /// Translates the specified text identifier.
            /// </summary>
            /// <param name="textId">The text identifier.</param>
            /// <returns>The localized string.</returns>
            public string Translate(string textId)
            {
                return XZReportsLocalizer.Instance.Translate(this.context.LanguageId, textId);
            }

            /// <summary>
            /// Formats the text line.
            /// </summary>
            /// <param name="leftTab">Left tabulation size.</param>
            /// <param name="text">The text.</param>
            /// <returns>The formatted line.</returns>
            public string FormatTextLine(int leftTab, string text)
            {
                return new string(XZReportsFormatter.Padding, leftTab) + text;
            }

            /// <summary>
            /// Formats the line.
            /// </summary>
            /// <param name="leftTab">Left tabulation size.</param>
            /// <param name="textId">The text identifier.</param>
            /// <returns>The formatted line.</returns>
            public string FormatLine(int leftTab, string textId)
            {
                return new string(XZReportsFormatter.Padding, leftTab) + this.Translate(textId);
            }

            /// <summary>
            /// Formats the line.
            /// </summary>
            /// <param name="leftTab">Left tabulation size.</param>
            /// <param name="rightTab">Right tabulation size.</param>
            /// <param name="textId">The text identifier.</param>
            /// <param name="value">The arbitrary value to be printed on a line.</param>
            /// <returns>The formatted line.</returns>
            public string FormatLine(int leftTab, int rightTab, string textId, object value)
            {
                ThrowIf.Null(value, "value");

                string text = new string(XZReportsFormatter.Padding, leftTab) + this.Translate(textId);
                return string.Format(this.culture, SectionFormat, text, value.ToString().PadLeft(PaperWidth - text.Length - 2 - rightTab));
            }

            /// <summary>
            /// Formats the number.
            /// </summary>
            /// <param name="number">The number to be formatted.</param>
            /// <returns>The formatted number.</returns>
            public virtual async Task<string> FormatNumberAsync(decimal number)
            {
                var request = new GetFormattedNumberServiceRequest(number);
                var resultResponse = await this.context.ExecuteAsync<GetFormattedContentServiceResponse>(request).ConfigureAwait(false);

                return resultResponse.FormattedValue;
            }

            /// <summary>
            /// Formats the currency to another currency.
            /// </summary>
            /// <param name="value">The digital value of the currency to be formatted.</param>
            /// <returns>The formatted value of the currency.</returns>
            public virtual async Task<string> FormatCurrencyAsync(decimal value)
            {
                string currencySymbol = string.Empty;
                int currencyDecimals = 0;
                if (!string.IsNullOrWhiteSpace(this.currency))
                {
                    var getCurrenciesDataRequest = new GetCurrenciesDataRequest(this.currency, QueryResultSettings.SingleRecord);
                    var currencyResponse = await this.context.Runtime.ExecuteAsync<EntityDataServiceResponse<Currency>>(getCurrenciesDataRequest, this.context).ConfigureAwait(false);
                    Currency currency = currencyResponse.PagedEntityCollection.FirstOrDefault();
                    currencySymbol = currency.CurrencySymbol;
                    currencyDecimals = currency.NumberOfDecimals;
                }

                var formattingRequest = new GetFormattedCurrencyServiceRequest(value, currencySymbol, currencyDecimals);
                var formattedValueResponse = await this.context.ExecuteAsync<GetFormattedContentServiceResponse>(formattingRequest).ConfigureAwait(false);

                return formattedValueResponse.FormattedValue;
            }
        }
    }
}
