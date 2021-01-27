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
    namespace Commerce.Runtime.CommonFrance
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Text.RegularExpressions;
        using System.Threading.Tasks;
        using System.Web;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Framework;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using FranceExtensibleAuditEventType = Commerce.Runtime.DataModel.FranceExtensibleAuditEventType;

        /// <summary>
        /// Encapsulates formatting operations required to prepare data for fiscal registration.
        /// </summary>
        public class FiscalDataToRegisterFormatter
        {
            private const string TaxInfoFormat = "{0}:{1}";

            private const string TaxInfoDelimeter = "|";

            private const string DateTimeFormat = "yyyyMMddHHmmss";

            private const string FullPeriodIdFormat = "yyyyMMdd";

            private const string PostponementWithoutPreviousResponse = "Y";

            private const string PostponementWithPreviousResponse = "N";

            private const string CurrencyFormat = "F0";

            private const string FieldDelimeter = ",";

            private const int NumberOfDecimals = 2;

            private readonly RequestContext requestContext;

            /// <summary>
            /// Initializes a new instance of the <see cref="FiscalDataToRegisterFormatter" /> class.
            /// </summary>
            /// <param name="requestContext">The request context.</param>
            public FiscalDataToRegisterFormatter(RequestContext requestContext)
            {
                this.requestContext = requestContext;
            }

            /// <summary>
            /// Gets formatted full period id.
            /// </summary>
            /// <param name="closeDateTime">Batch close time.</param>
            /// <returns>Batch close time day.</returns>
            /// <remarks>Always returns batch close day, because shift closing is a daily operation.</remarks>
            public static string GetFormattedFullPeriodId(DateTimeOffset closeDateTime)
            {
                return closeDateTime.ToString(FullPeriodIdFormat);
            }

            /// <summary>
            /// Gets formatted total sales amount for specified sales lines.
            /// </summary>
            /// <param name="lineItems">Total amount of sales.</param>
            /// <returns>Formatted amount.</returns>
            public async Task<string> GetFormattedTotalSalesAmountAsync(IEnumerable<SalesLine> lineItems)
            {
                return await this.FormatAmountAsync(lineItems.Sum(l => l.NetAmountWithTax())).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets formatted total sales amount for specified sales totals.
            /// </summary>
            /// <param name="salesTotal">Total amount of sales.</param>
            /// <returns>Formatted amount.</returns>
            public async Task<string> GetFormattedTotalSalesAmountAsync(decimal salesTotal)
            {
                return await this.FormatAmountAsync(salesTotal).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets formatted total sales amounts grouped and ordered by tax rate for specified sales lines.
            /// </summary>
            /// <param name="lineItems"><c>SalesLine</c> collection to be formatted.</param>
            /// <returns>Formatted amounts.</returns>
            public async Task<string> GetFormattedTotalSalesAmountsByTaxRateAsync(IEnumerable<SalesLine> lineItems)
            {
                var flattenedTaxInfos = lineItems.SelectMany(l => l.TaxLines, (l, t) => new { lineItem = l, taxItem = t }).Select(tuple => new TaxInfo
                {
                    TaxRate = tuple.taxItem.Percentage,
                    TotalAmount = tuple.taxItem.Amount + tuple.lineItem.NetAmountWithNoTax()
                });

                decimal noTaxNetAmount = lineItems.Where(l => !l.TaxLines.Any()).Sum(l => l.NetAmount);

                if (noTaxNetAmount != decimal.Zero)
                {
                    flattenedTaxInfos = flattenedTaxInfos.Concat(new[] { new TaxInfo { TaxRate = decimal.Zero, TotalAmount = noTaxNetAmount } });
                }

                var taxInfos = flattenedTaxInfos.GroupBy(fti => fti.TaxRate).Select(tig => new TaxInfo
                {
                    TaxRate = tig.Key,
                    TotalAmount = tig.Sum(fa => fa.TotalAmount)
                })
                .OrderBy(ti => ti.TaxRate);

                return await this.GetFormattedTaxInfosAsync(taxInfos).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets formatted total sales amounts grouped and ordered by tax rate for specified tax batch lines.
            /// </summary>
            /// <param name="taxLines">Tax batch lines to be formatted.</param>
            /// <returns>Formatted amounts.</returns>
            public async Task<string> GetFormattedTotalSalesAmountsByTaxRateAsync(ICollection<ShiftTaxLine> taxLines)
            {
                IEnumerable<TaxInfo> taxInfos = taxLines
                    .GroupBy(taxLine => taxLine.TaxRate)
                    .Select(tg => new TaxInfo
                        {
                            TaxRate = tg.Key,
                            TotalAmount = tg.Sum(t => t.NetAmount + t.TaxAmount)
                        })
                    .OrderBy(ti => ti.TaxRate);

                if (!taxInfos.Any())
                {
                    taxInfos = new[] { new TaxInfo { TaxRate = decimal.Zero, TotalAmount = decimal.Zero } };
                }

                return await this.GetFormattedTaxInfosAsync(taxInfos).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets formatted transaction type.
            /// </summary>
            /// <param name="transactionType">Transaction type to be formatted.</param>
            /// <returns>Formatted transaction type.</returns>
            public string GetFormattedTransactionType(ExtensibleEnumeration transactionType)
            {
                ThrowIf.Null(transactionType, "transactionType");

                return transactionType.Name;
            }

            /// <summary>
            /// Gets formatted sales line count.
            /// </summary>
            /// <param name="salesLineCount">Sales lines count to be formatted.</param>
            /// <returns>Formatted sales lines count.</returns>
            public string GetFormattedSalesLineCount(int salesLineCount)
            {
                return salesLineCount.ToString();
            }

            /// <summary>
            /// Gets formatted date and time of signature generation.
            /// </summary>
            /// <param name="dateTime">Date and time to format.</param>
            /// <returns>Formatted date and time.</returns>
            public string GetFormattedDateTime(DateTimeOffset dateTime)
            {
                return dateTime.ToString(DateTimeFormat);
            }

            /// <summary>
            /// Gets formatted sequential number.
            /// </summary>
            /// <param name="sequentialNumber">Sequential number to be formatted.</param>
            /// <returns>Formatted sequential number.</returns>
            public string GetFormattedSequentialNumber(long sequentialNumber)
            {
                return sequentialNumber.ToString();
            }

            /// <summary>
            /// Gets formatted technical event type.
            /// </summary>
            /// <param name="eventType">Audit event type.</param>
            /// <returns>Formatted technical type.</returns>
            public string GetFormattedTechnicalEventType(ExtensibleAuditEventType eventType)
            {
                ThrowIf.Null(eventType, "eventType");

                TechnicalEventType technicalEventType;

                if (eventType == ExtensibleAuditEventType.UserLogOn || eventType == ExtensibleAuditEventType.UserLogOff)
                {
                    technicalEventType = TechnicalEventType.Log;
                }
                else if (eventType == FranceExtensibleAuditEventType.OfflineModeOn)
                {
                    technicalEventType = TechnicalEventType.OfflineModeOn;
                }
                else if (eventType == FranceExtensibleAuditEventType.OfflineModeOff)
                {
                    technicalEventType = TechnicalEventType.OfflineModeOff;
                }
                else if (eventType == FranceExtensibleAuditEventType.TrainingModeOn || eventType == FranceExtensibleAuditEventType.TrainingModeOff)
                {
                    technicalEventType = TechnicalEventType.Training;
                }
                else if (eventType == ExtensibleAuditEventType.PurgeTransactionsData)
                {
                    technicalEventType = TechnicalEventType.PurgeTransactionsData;
                }
                else
                {
                    technicalEventType = TechnicalEventType.Unknown;
                }

                return ((int)technicalEventType).ToString();
            }

            /// <summary>
            /// Gets formatted postponement flag.
            /// </summary>
            /// <param name="sequentialNumber">Current sequential number.</param>
            /// <returns>
            /// "Y", if it is first data string to be signed; "N", Otherwise.
            /// </returns>
            public static string GetFormattedPostponement(long sequentialNumber)
            {
                return sequentialNumber == 1 ? PostponementWithoutPreviousResponse : PostponementWithPreviousResponse;
            }

            /// <summary>
            /// Gets formatted data to register string for specified collection of separate fields.
            /// </summary>
            /// <param name="dataToRegisterFields">Separate fields of data to register string.</param>
            /// <returns>Formatted string.</returns>
            public string GetFormattedDataToRegister(IEnumerable<string> dataToRegisterFields)
            {
                var formattedStrings = dataToRegisterFields.Select(field => RemoveWhitespaces(field));

                return string.Join(FieldDelimeter, formattedStrings);
            }

            /// <summary>
            /// Converts base64 encoded string to base 64 URL string (RFC 4648).
            /// </summary>
            /// <param name="base64String"></param>
            /// <returns></returns>
            public static string ConvertBase64ToBase64Url(string base64String)
            {
                var base64Url = UrlTokenEncode(Convert.FromBase64String(base64String));

                // UrlTokenEncode last symbol contains number of alignment symbols, we should trim this according to RFC 4648.
                return base64Url.Substring(0, base64Url.Length - 1);
            }

            /// <summary>
            /// Encodes a byte array into its equivalent string representation using base 64 digits, which is usable for transmission on the URL.
            /// This method is an equivalent of HttpServerUtility.UrlTokenEncode from System.Web.
            /// </summary>
            /// <param name="input">The byte array to encode.</param>
            /// <returns>The string containing the encoded token if the byte array length is greater than one; otherwise, an empty string ("").</returns>
            /// <exception cref="T:System.ArgumentNullException">The value of the <paramref name="input" /> parameter is <see langword="null" />.</exception>
            private static string UrlTokenEncode(byte[] input)
            {
                if (input == null)
                    throw new ArgumentNullException(nameof(input));
                if (input.Length < 1)
                    return string.Empty;

                // Step 1: Do a Base64 encoding
                string base64Str = Convert.ToBase64String(input);

                // Step 2: Find how many padding chars are present in the end
                int endPos = base64Str.Length;
                while (endPos > 0 && base64Str[endPos - 1] == '=')
                {
                    --endPos;
                }

                // Step 3: Create char array to store all non-padding chars, plus a char to indicate how many padding chars are needed
                char[] base64Chars = new char[endPos + 1];
                base64Chars[endPos] = (char) ('0' + base64Str.Length - endPos); // Store a char at the end, to indicate how many padding chars are needed

                // Step 4: Copy in the other chars. Transform the "+" to "-", and "/" to "_"
                for (int iter = 0; iter < endPos; iter++)
                {
                    char c = base64Str[iter];
                    switch (c)
                    {
                        case '+':
                            base64Chars[iter] = '-';
                            break;
                        case '/':
                            base64Chars[iter] = '_';
                            break;
                        case '=':
                            base64Chars[iter] = c;
                            break;
                        default:
                            base64Chars[iter] = c;
                            break;
                    }
                }

                return new string(base64Chars);
            }

            /// <summary>
            /// Removes all spaces and tabs from string.
            /// </summary>
            /// <param name="text">Text to be formatted.</param>
            /// <returns>Result string.</returns>
            private static string RemoveWhitespaces(string text)
            {
                return Regex.Replace(text, @"\s+", string.Empty);
            }

            /// <summary>
            /// Gets formatted total amounts with tax rates string for specified collection of tax information.
            /// </summary>
            /// <param name="taxInfos">Collection of tax information.</param>
            /// <returns>Formatted string.</returns>
            private async Task<string> GetFormattedTaxInfosAsync(IEnumerable<TaxInfo> taxInfos)
            {
                var formattedStrings = taxInfos.Select(this.GetFormattedTaxInfoAsync);

                return string.Join(TaxInfoDelimeter, await Task.WhenAll(formattedStrings).ConfigureAwait(false));
            }

            /// <summary>
            /// Gets formatted total amount with tax rate string for specified tax information.
            /// </summary>
            /// <param name="taxInfo">Tax information.</param>
            /// <returns>Formatted string.</returns>
            private async Task<string> GetFormattedTaxInfoAsync(TaxInfo taxInfo)
            {
                return string.Format(TaxInfoFormat, await this.FormatAmountAsync(taxInfo.TaxRate).ConfigureAwait(false), await this.FormatAmountAsync(taxInfo.TotalAmount).ConfigureAwait(false));
            }

            /// <summary>
            /// Formats currency, amount converted to cents without decimal point.
            /// </summary>
            /// <param name="amount">Amount to be formatted.</param>
            /// <returns>Result string.</returns>
            private async Task<string> FormatAmountAsync(decimal amount)
            {
                decimal roundedAmount = await this.RoundAmountAsync(amount).ConfigureAwait(false);
                return (roundedAmount * 100).ToString(CurrencyFormat);
            }

            /// <summary>
            /// Rounds amount to predefined number of decimals.
            /// </summary>
            /// <param name="amount">Amount to be rounded.</param>
            /// <returns>Rounded amount.</returns>
            private async Task<decimal> RoundAmountAsync(decimal amount)
            {
                string currencyCode = this.requestContext.GetOrgUnit().Currency;
                var request = new GetRoundedValueServiceRequest(amount, currencyCode, NumberOfDecimals, false);
                var response = await this.requestContext.ExecuteAsync<GetRoundedValueServiceResponse>(request).ConfigureAwait(false);
                return response.RoundedValue;
            }

            /// <summary>
            /// Tax info, is used for formatting purposes to group tax lines by tax rate.
            /// </summary>
            private class TaxInfo
            {
                /// <summary>
                /// Gets or sets tax rate.
                /// </summary>
                public decimal TaxRate { get; set; }

                /// <summary>
                /// Gets or sets total tax amount.
                /// </summary>
                public decimal TotalAmount { get; set; }
            }
        }
    }
}