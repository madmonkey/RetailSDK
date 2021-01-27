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
    namespace Commerce.Runtime.DocumentProvider.EFRSample.DocumentHelpers
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.Extensions;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Contains helper methods for sales transaction document generation.
        /// </summary>
        public static class SalesTransactionHelper
        {
            /// <summary>
            /// Tax rates mapping.
            /// </summary>
            private static IDictionary<string, TaxRatesMapping> taxRatesMappings;

            /// <summary>
            /// Gets tax rates mapping.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <returns>The tax rates mapping.</returns>
            private static TaxRatesMapping GetTaxRatesMapping(FiscalIntegrationFunctionalityProfile functionalityProfile)
            {
                ThrowIf.Null(functionalityProfile, nameof(functionalityProfile));
                ThrowIf.NullOrWhiteSpace(functionalityProfile.ProfileId, nameof(functionalityProfile.ProfileId));

                if (taxRatesMappings == null)
                {
                    taxRatesMappings = new Dictionary<string, TaxRatesMapping>();
                }

                if (!taxRatesMappings.ContainsKey(functionalityProfile.ProfileId))
                {
                    taxRatesMappings.Add(
                        functionalityProfile.ProfileId,
                        ConfigurationController.GetSupportedTaxRates(functionalityProfile));
                }

                return taxRatesMappings[functionalityProfile.ProfileId];
            }

            /// <summary>
            /// Gets payment type group.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <param name="tenderTypeId">The tender type identifier.</param>
            /// <returns>The payment group.</returns>
            public static string GetPaymentTypeGroup(FiscalIntegrationFunctionalityProfile functionalityProfile, string tenderTypeId)
            {
                return ConfigurationController.GetTenderTypeMapping(functionalityProfile)[tenderTypeId];
            }

            /// <summary>
            /// Gets tax groups from sales line.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <param name="salesLine">The sales line.</param>
            /// <returns>The tax groups.</returns>
            public static IEnumerable<string> GetTaxGroupsFromSalesLine(FiscalIntegrationFunctionalityProfile functionalityProfile, SalesLine salesLine)
            {
                ThrowIf.Null(salesLine, nameof(salesLine));

                TaxRatesMapping taxRatesMapping = GetTaxRatesMapping(functionalityProfile);
                return salesLine.TaxLines.Select(taxLine => taxRatesMapping[taxLine.Percentage]);
            }

            /// <summary>
            /// Gets tax groups from sales line.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <param name="salesLine">The sales line.</param>
            /// <returns>The tax groups.</returns>
            public static IEnumerable<string> GetTaxGroupsFromSalesLineWithDefault(FiscalIntegrationFunctionalityProfile functionalityProfile, SalesLine salesLine)
            {
                ThrowIf.Null(salesLine, nameof(salesLine));

                TaxRatesMapping taxRatesMapping = GetTaxRatesMapping(functionalityProfile);
                string defaultGroup = ConfigurationController.GetDefaultTaxGroup(functionalityProfile);
                if (!taxRatesMapping.ContainsTax(defaultGroup)) throw new DataValidationException(DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_RequiredValueNotFound, "Default tax is not set");
                return salesLine.TaxLines
                        .Select(taxLine =>
                        {
                            var group = taxRatesMapping[taxLine.Percentage];
                            if (string.IsNullOrWhiteSpace(group)) return defaultGroup;
                            return group;
                        }).Distinct();
            }

            /// <summary>
            /// Gets tax groups from sales line.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <param name="salesLine">The sales line.</param>
            /// <returns>The tax groups.</returns>
            public static Tuple<decimal, string> GetDepositTaxGroup(FiscalIntegrationFunctionalityProfile functionalityProfile)
            {
                TaxRatesMapping taxRatesMapping = GetTaxRatesMapping(functionalityProfile);
                string depositGroup = ConfigurationController.GetDepositTaxGroup(functionalityProfile);
                if (!taxRatesMapping.ContainsTax(depositGroup)) throw new DataValidationException(DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_RequiredValueNotFound, "Deposit tax is not set");
                return new Tuple<decimal, string>(taxRatesMapping.GetSignleRateByName(depositGroup), depositGroup);
            }

            /// <summary>
            /// Translates text.
            /// </summary>
            /// <param name="requestContext">The request context.</param>
            /// <param name="text">The text to translate.</param>
            /// <returns>The translated text.</returns>
            public static string TranslateText(RequestContext requestContext, string text)
            {
                ThrowIf.Null(requestContext, nameof(requestContext));

                return SalesTransactionLocalizer.Instance.Translate(requestContext.LanguageId, text);
            }

            /// <summary>
            /// Gets tax group by tax percentage.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <param name="percentage">The tax rate.</param>
            /// <returns>The tax groups.</returns>
            public static string GetTaxGroupByRate(FiscalIntegrationFunctionalityProfile functionalityProfile, decimal percentage)
            {
                return GetTaxRatesMapping(functionalityProfile)[percentage];
            }

            /// <summary>
            /// Gets tax group by tax percentage.
            /// </summary>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <param name="percentage">The tax rate.</param>
            /// <returns>The tax groups.</returns>
            public static string GetTaxGroupByRateOrDefault(FiscalIntegrationFunctionalityProfile functionalityProfile, decimal percentage)
            {
                var taxRatesMapping = GetTaxRatesMapping(functionalityProfile);
                var group = taxRatesMapping[percentage];
                if (string.IsNullOrWhiteSpace(group))
                {
                    string defaultGroup = ConfigurationController.GetDefaultTaxGroup(functionalityProfile);
                    if (!taxRatesMapping.ContainsTax(defaultGroup)) throw new DataValidationException(DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_RequiredValueNotFound, "Default tax is not set");
                    return defaultGroup;
                }
                return group;
            }

            /// <summary>
            /// Gets operator name.
            /// </summary>
            /// <param name="requestContext">The request context.</param>
            /// <param name="operatorId">The operator id.</param>
            /// <returns>The operator name.</returns>
            public static async Task<string> GetOperatorNameAsync(RequestContext requestContext, string operatorId)
            {
                ThrowIf.Null(requestContext, nameof(requestContext));

                GetEmployeesServiceRequest getEmployeeRequest = new GetEmployeesServiceRequest(operatorId, QueryResultSettings.SingleRecord);
                GetEmployeesServiceResponse employeeResponse = await requestContext.ExecuteAsync<GetEmployeesServiceResponse>(getEmployeeRequest).ConfigureAwait(false);

                Employee employee = employeeResponse.Employees.SingleOrDefault();

                return employee?.Name ?? string.Empty;
            }

            /// <summary>
            /// Converts line number to position number.
            /// </summary>
            /// <param name="lineNumber">The line number.</param>
            /// <returns>The position number.</returns>
            public static int ConvertLineNumberToPositionNumber(decimal lineNumber)
            {
                return Convert.ToInt32(lineNumber);
            }

            /// <summary>
            /// Gets tender type name.
            /// </summary>
            /// <param name="requestContext">The request context.</param>
            /// <param name="tenderTypeId">The tender type id.</param>
            /// <returns>The tender type name.</returns>
            public static async Task<string> GetTenderTypeNameAsync(RequestContext requestContext, string tenderTypeId)
            {
                ThrowIf.Null(requestContext, nameof(requestContext));

                GetChannelTenderTypesDataRequest getChannelTenderTypesDataRequest = new GetChannelTenderTypesDataRequest(
                    requestContext.GetPrincipal().ChannelId,
                    QueryResultSettings.AllRecords);

                var tenderTypesResponse = await requestContext.Runtime.ExecuteAsync<EntityDataServiceResponse<TenderType>>(
                        getChannelTenderTypesDataRequest,
                        requestContext).ConfigureAwait(false);

                IReadOnlyCollection<TenderType> tenderTypes = tenderTypesResponse.PagedEntityCollection.Results;

                TenderType tenderType = tenderTypes.Single(t => t.TenderTypeId.Equals(tenderTypeId));

                return tenderType.Name;
            }

            /// <summary>
            /// Gets the carryout lines from a sales order.
            /// </summary>
            /// <param name="requestContext">The request context.</param>
            /// <param name="salesOrder">The sales order.</param>
            /// <returns>The carryout lines.</returns>
            public static IEnumerable<SalesLine> GetCarryOutLines(RequestContext requestContext, SalesOrder salesOrder)
            {
                string carryoutDeliveryModeCode = requestContext.GetChannelConfiguration().CarryoutDeliveryModeCode;
                return salesOrder.GetNonGiftCardLines().Where(l => l.DeliveryMode == carryoutDeliveryModeCode);
            }

            /// <summary>
            /// Gets the joined tax codes string.
            /// </summary>
            /// <param name="taxCodes">The tax codes collection.</param>
            /// <returns>The tax codes string.</returns>
            public static string JoinTaxCodes(IEnumerable<string> taxCodes)
            {
                return string.Join(" ", taxCodes);
            }

            /// <summary>
            /// Calculates the amount of deposit tax.
            /// </summary>
            /// <param name="amount">The amount.</param>
            /// <param name="taxRange">The tax range.</param>
            /// <param name="roundPrecision">The round precision.</param>
            /// <returns>The tax amount value.</returns>
            public static decimal CalculateDepositTaxAmount(decimal amount, decimal taxRange, int roundPrecision)
            {
                return Math.Round(amount * taxRange / 100, roundPrecision);
            }

            /// <summary>
            /// Gets products by their item identifiers.
            /// </summary>
            /// <param name="context">The request context.</param>
            /// <param name="itemIds">The product item identifiers.</param>
            /// <returns>The list of products.</returns>
            public static IDictionary<string, Item> GetProducts(RequestContext context, IEnumerable<string> itemIds)
            {
                ThrowIf.Null(context, nameof(context));

                GetItemsDataRequest getItemsDataRequest = new GetItemsDataRequest(itemIds);
                GetItemsDataResponse getItemsResponse = context.Execute<GetItemsDataResponse>(getItemsDataRequest);

                return getItemsResponse.Items.IsNullOrEmpty()
                    ? new Dictionary<string, Item>()
                    : getItemsResponse.Items.ToDictionary(item => item.ItemId);
            }

            /// <summary>
            /// Creates payments for income and expense accounts.
            /// </summary>
            /// <returns>The payments.</returns>
            public static async Task<List<ReceiptPayment>> GetIncomeExpenseAccountsReceiptPayments(SalesOrder salesOrder,  GetFiscalDocumentDocumentProviderRequest request)
            {
                var result = new List<ReceiptPayment>();
                var tenderLinesGrpByTenderTypeIdAndCurrency = salesOrder.ActiveTenderLines.GroupBy(tl => new {tl.TenderTypeId, tl.Currency});

                foreach (var g in tenderLinesGrpByTenderTypeIdAndCurrency)
                {
                    var receiptPayment = new ReceiptPayment
                    {
                        Description = await GetTenderTypeNameAsync(request.RequestContext, g.Key.TenderTypeId).ConfigureAwait(false),
                        PaymentTypeGroup = GetPaymentTypeGroup(request.FiscalIntegrationFunctionalityProfile, g.Key.TenderTypeId),
                        Amount = g.Sum(l => l.Amount)
                    };

                    if (g.Key.Currency != salesOrder.CurrencyCode)
                    {
                        receiptPayment.ForeignCurrencyCode = g.Key.Currency;
                        receiptPayment.ForeignAmount = g.Sum(tl => tl.AmountInTenderedCurrency);
                    }
                    result.Add(receiptPayment);
                }
                return result;
            }
        }
    }
}
