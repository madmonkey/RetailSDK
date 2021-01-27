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
    namespace Commerce.Runtime.DocumentProvider.EFRSample.DocumentBuilders
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Constants;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentHelpers;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.Extensions;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// The document rule for Germany.
        /// </summary>
        public class DocumentRuleDE : DocumentRuleBase
        {
            private const int RoundPrecision = 2;
            private const string VoucherType = "Vou";
            private const string DiscountType = "Mod";
            private const string AdvancePaymentType = "Adv";
            private readonly PagedResult<TenderType> channelTenderTypes;
            private readonly IDictionary<FiscalIntegrationEventType, string> NonFiscalTransactionTypeDictionary =
                new Dictionary<FiscalIntegrationEventType, string>
                {
                    { FiscalIntegrationEventType.IncomeAccounts, "PAY" },
                    { FiscalIntegrationEventType.ExpenseAccounts, "PAY" },
                    { FiscalIntegrationEventType.SafeDrop, "TRANSFER" },
                    { FiscalIntegrationEventType.BankDrop, "TRANSFER" }
                };

            /// <summary>
            /// Initializes a new instance of the <see cref="DocumentRuleDE" /> class.
            /// </summary>
            /// <param name="request">Retail transaction to register.</param>
            /// <param name="salesOrder">Type of registration sequence.</param>
            public DocumentRuleDE(GetFiscalDocumentDocumentProviderRequest request, SalesOrder salesOrder)
                : base(request, salesOrder)
            {
                var getChannelTenderTypesDataRequest = new GetChannelTenderTypesDataRequest(request.RequestContext.GetPrincipal().ChannelId, QueryResultSettings.AllRecords);
                this.channelTenderTypes = request.RequestContext.Runtime.Execute<EntityDataServiceResponse<TenderType>>(getChannelTenderTypesDataRequest, request.RequestContext).PagedEntityCollection;
            }

            /// <summary>
            /// Adds localization information to receipt.
            /// </summary>
            /// <param name="receipt">The receipt.</param>
            public override void AddLocalizationInfoToReceipt(DataModelEFR.Documents.Receipt receipt)
            {
                FiscalTransaction fiscalTransaction = FindBeginSaleFiscalTransaction();

                if (fiscalTransaction != null)
                {
                    receipt.TransactionId = fiscalTransaction.DocumentNumber;
                    receipt.TransactionStartDateTime = Convert.ToDateTime(fiscalTransaction.ExtensionProperties.SingleOrDefault(p => p.Key == ExtensibleFiscalRegistrationExtendedDataType.TransactionStart.Name)?.Value.StringValue);
                }

                receipt.NetTaxFlag = !salesOrder.IsTaxIncludedInPrice;
            }

            /// <summary>
            /// Checks if the document generation required.
            /// </summary>
            /// <returns>True if document generation required; False otherwise.</returns>
            public override bool IsDocumentGenerationRequired()
            {
                return true;
            }

            /// <summary>
            /// Creates receipt taxes for sales transaction.
            /// </summary>
            /// <returns>The receipt taxes collection.</returns>
            public override List<ReceiptTax> CreateSalesTransactionReceiptTaxes()
            {
                return GetSalesOrderReceiptTaxes()
                    .Concat(GetGiftCardsReceiptTaxes()).ToList();
            }

            /// <summary>
            /// Creates receipt payments.
            /// </summary>
            /// <returns>The receipt payments.</returns>
            public override async Task<List<ReceiptPayment>> CreateReceiptPaymentsAsync()
            {
                return await CreateReceiptPaymentsWithCurrencyAsync().ConfigureAwait(false);
            }

            /// <summary>
            /// Get the receipt payment for deposit payment.
            /// </summary>
            /// <returns>The receipt payment for deposit payment.</returns>
            public override ReceiptPayment GetDepositTenderLine()
            {
                var customerAccountTenderTypeId = channelTenderTypes.Single(c => c.OperationType == RetailOperation.PayCustomerAccount).TenderTypeId;
                return new ReceiptPayment
                {
                    Description = SalesTransactionHelper.TranslateText(request.RequestContext, SalesTransactionLocalizationConstants.CustomerDeposit),
                    Amount = salesOrder.PrepaymentAmountAppliedOnPickup,
                    UniqueIdentifier = string.Empty,
                    PaymentTypeGroup = ConfigurationController.GetTenderTypeMapping(request.FiscalIntegrationFunctionalityProfile)[customerAccountTenderTypeId],
                };
            }

            /// <summary>
            /// Gets the sales line for document creation.
            /// </summary>
            /// <returns>The sales lines collection.</returns>
            public override IEnumerable<SalesLine> GetSalesLines()
            {
                if (salesOrder.IsDepositProcessing())
                {
                    return SalesTransactionHelper.GetCarryOutLines(request.RequestContext, salesOrder);
                }
                return salesOrder.GetNonGiftCardLines();
            }

            /// <summary>
            /// Gets the tax groups for sales line.
            /// </summary>
            /// <param name="salesLine">The sales line.</param>
            /// <returns>The tax groups string.</returns>
            public override string GetSalesLineTaxGroups(SalesLine salesLine)
            {
                ThrowIf.Null(salesLine, nameof(salesLine));

                var taxExemptTypeGroup = ConfigurationController.GetExemptTaxGroup(request.FiscalIntegrationFunctionalityProfile);

                var taxCodes = salesLine.TaxLines.Select(taxLine => taxLine.IsExempt ? taxExemptTypeGroup
                        : SalesTransactionHelper.GetTaxGroupByRate(request.FiscalIntegrationFunctionalityProfile, taxLine.Percentage));

                return SalesTransactionHelper.JoinTaxCodes(taxCodes);
            }

            /// <summary>
            /// Adds country/region specific receipt positions to the collection of receipt positions.
            /// </summary>
            /// <param name="positions">The collection of receipt positions.</param>
            public override void AddCountryRegionSpecificPositions(List<ReceiptPosition> positions)
            {
                AddPositionsByCustomerOrderDeposit(positions);
                AddPositionLineForCustomerDepositByPrepayment(positions);
                AddPositionsByGiftCard(positions);
            }

            /// <summary>
            /// Adds receipt positions for customer account deposit.
            /// </summary>
            public override void AddCustomerAccountDepositPositions(List<ReceiptPosition> positions)
            {
                positions.Add(new ReceiptPosition()
                {
                    ItemNumber = salesOrder.CustomerId,
                    PositionNumber = GetDepositPositionNumber(positions),
                    Description = SalesTransactionHelper.TranslateText(request.RequestContext, SalesTransactionLocalizationConstants.Deposit),
                    TaxGroup = ConfigurationController.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile),
                    Amount = salesOrder.CustomerAccountDepositLines.Sum(c => c.Amount),
                    PositionType = AdvancePaymentType
                });
            }

            /// <summary>
            /// Sets the referenced receipt position's fields.
            /// </summary>
            /// <param name="receiptPosition">The receipt position.</param>
            /// <param name="salesLine">The sales line.</param>
            public override async Task SetReferenceFieldsAsync(ReceiptPosition receiptPosition, SalesLine salesLine)
            {
                await base.SetReferenceFieldsAsync(receiptPosition, salesLine).ConfigureAwait(false);

                var originSalesOrderResponse = await salesLine.GetOriginSalesOrderAsync(request.RequestContext).ConfigureAwait(false);
                SetReferenceDate(receiptPosition, originSalesOrderResponse);

                receiptPosition.Void = true;
            }

            /// <summary>
            /// Creates receipt customer data.
            /// </summary>
            /// <param name="receipt">The receipt.</param>
            public override void AddCustomerDataToReceipt(DataModelEFR.Documents.Receipt receipt)
            {
                if (!ConfigurationController.ParsePrintCustomerDataInReceipt(request.FiscalIntegrationFunctionalityProfile))
                {
                    return;
                }
                var customersServiceRequest = new GetCustomersServiceRequest(QueryResultSettings.SingleRecord, salesOrder.CustomerId);
                var response = request.RequestContext.Execute<GetCustomersServiceResponse>(customersServiceRequest);

                var ctm = response.Customers.FirstOrDefault();

                receipt.Customer = new ReceiptCustomer
                {
                    Address = ctm?.Addresses?.SingleOrDefault(address => address.IsPrimary)?.FullAddress,
                    CustomerName = ctm?.Name,
                    CustomerNumber = ctm?.AccountNumber,
                    VatNumber = ctm?.VatNumber
                };
            }

            /// <summary>
            /// Adds localization information to customer account deposit receipt payment.
            /// </summary>
            /// <param name="payment">The receipt payment.</param>
            public override void AddLocalizationInfoToCustomerPayment(ReceiptPayment payment, string tenderTypeId)
            {
                payment.PaymentTypeGroup = ConfigurationController.GetTenderTypeMapping(request.FiscalIntegrationFunctionalityProfile)[tenderTypeId];
            }

            /// <summary>
            /// Adds positions for gift cards.
            /// </summary>
            /// <param name="positions">The receipt positions.</param>
            private void AddPositionsByGiftCard(List<ReceiptPosition> positions)
            {
                foreach (var giftCardLine in salesOrder.ActiveSalesLines.Where(c => c.IsGiftCardLine))
                {
                    var giftCardPosition = new ReceiptPosition()
                    {
                        Description = SalesTransactionHelper.TranslateText(request.RequestContext, SalesTransactionLocalizationConstants.GiftCard),
                        PositionNumber = SalesTransactionHelper.ConvertLineNumberToPositionNumber(giftCardLine.LineNumber),
                        Amount = giftCardLine.GrossAmount,
                        VoucherId = giftCardLine.GiftCardId,
                        PositionType = VoucherType
                    };

                    var lineTaxGroup = this.GetSalesLineTaxGroups(giftCardLine);
                    if (string.IsNullOrEmpty(lineTaxGroup))
                    {
                        lineTaxGroup = ConfigurationController.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile);
                    }
                    giftCardPosition.TaxGroup = lineTaxGroup;

                    positions.Add(giftCardPosition);
                }
            }

            /// <summary>
            /// Adds position line for customer deposit by prepayment.
            /// </summary>
            /// <param name="positions">The receipt positions.</param>
            private void AddPositionLineForCustomerDepositByPrepayment(List<ReceiptPosition> positions)
            {
                if (salesOrder.PrepaymentAmountAppliedOnPickup == 0)
                {
                    return;
                }

                positions.Add(new ReceiptPosition()
                {
                    Description = SalesTransactionHelper.TranslateText(request.RequestContext, SalesTransactionLocalizationConstants.CustomerDeposit),
                    TaxGroup = ConfigurationController.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile),
                    PositionNumber = GetDepositPositionNumber(positions),
                    Amount = salesOrder.PrepaymentAmountAppliedOnPickup * -1,
                    PositionType = AdvancePaymentType
                });
            }

            /// <summary>
            /// Adds positions for customer order deposit.
            /// </summary>
            /// <param name="positions">The receipt positions.</param>
            private void AddPositionsByCustomerOrderDeposit(List<ReceiptPosition> positions)
            {
                if (!salesOrder.IsDepositProcessing())
                {
                    return;
                }

                var depositSum = CalculateDepositSumForOrder();

                if (depositSum != 0)
                {
                    positions.Add(new ReceiptPosition()
                    {
                        Description = SalesTransactionHelper.TranslateText(request.RequestContext, DataModelEFR.Constants.SalesTransactionLocalizationConstants.Deposit),
                        TaxGroup = ConfigurationController.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile),
                        PositionNumber = GetDepositPositionNumber(positions),
                        Amount = depositSum,
                        PositionType = AdvancePaymentType
                    });
                }
            }

            /// <summary>
            /// Calculates the deposit sum for sales order.
            /// </summary>
            /// <returns>The deposit sum.</returns>
            private decimal CalculateDepositSumForOrder()
            {
                var activeTenderLinesAmount = salesOrder.ActiveTenderLines.Sum(c => c.Amount);

                var carryoutLinesTotalAmount = SalesTransactionHelper
                    .GetCarryOutLines(request.RequestContext, salesOrder)
                    .Sum(c => c.TotalAmount);

                var depositSum = activeTenderLinesAmount - carryoutLinesTotalAmount;

                return Math.Round(depositSum, RoundPrecision);
            }

            /// <summary>
            /// Gets the line number for deposit positions.
            /// </summary>
            /// <param name="positions">The collection of receipt positions.</param>
            /// <returns>The deposit position number.</returns>
            private int GetDepositPositionNumber(IEnumerable<ReceiptPosition> positions)
            {
                return positions.Count() == 0 ? 1 : positions.Max(c => c.PositionNumber) + 1;
            }

            /// <summary>
            /// Calculates total payment amount without prepayment.
            /// </summary>
            /// <returns>The total payment amount.</returns>
            public override decimal GetTotalAmount()
            {
                return salesOrder.CalcTotalPaymentAmount();
            }

            /// <summary>
            /// Gets the non-fiscal transaction type string.
            /// </summary>
            /// <returns>The non-fiscal transaction type string.</returns>
            public override string GetNonFiscalTransactionType()
            {
                if (NonFiscalTransactionTypeDictionary.TryGetValue(request.FiscalDocumentRetrievalCriteria.FiscalRegistrationEventType, out var transactionType))
                {
                    return transactionType;
                }

                return base.GetNonFiscalTransactionType();
            }

            /// <summary>
            /// Searches for the latest fiscal transaction for the BeginSale event.
            /// </summary>
            /// <returns>The latest BeginSale fiscal transaction or null if not found.</returns>
            private FiscalTransaction FindBeginSaleFiscalTransaction()
            {
                FiscalTransaction fiscalTransaction = null;
                var selectedFiscalTransactions = salesOrder.FiscalTransactions
                    .Where(ft => ft.RegistrationType == ExtensibleFiscalRegistrationType.None)
                    .Where(ft => ft.CountryRegionIsoCode == request.RequestContext.GetPrincipal().CountryRegionIsoCode);

                var maxDateTime = DateTime.MinValue;
                foreach (var ft in selectedFiscalTransactions)
                {
                    var startDateTime = ft.ExtensionProperties.SingleOrDefault(p => p.Key == ExtensibleFiscalRegistrationExtendedDataType.TransactionStart.Name)?.Value.StringValue;
                    if (DateTime.TryParse(startDateTime, out var dateTime) && dateTime > maxDateTime)
                    {
                        fiscalTransaction = ft;
                        maxDateTime = dateTime;
                    }
                }

                return fiscalTransaction;
            }

            /// <summary>
            /// Gets receipt taxes of gift card lines.
            /// </summary>
            /// <returns>The receipt taxes collection.</returns>
            private ReceiptTax[] GetGiftCardsReceiptTaxes()
            {
                return salesOrder.ActiveSalesLines.Where(c => c.IsGiftCardLine)
                                .Select(sl =>
                                {
                                    var lineTaxGroup = this.GetSalesLineTaxGroups(sl);
                                    if (string.IsNullOrEmpty(lineTaxGroup))
                                    {
                                        lineTaxGroup = ConfigurationController.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile);
                                    }
                                    return new ReceiptTax
                                    {
                                        TaxGroup = lineTaxGroup,
                                        NetAmount = sl.NetAmount,
                                        GrossAmount = sl.GrossAmount
                                    };
                                })
                                .GroupBy(rt => rt.TaxGroup)
                                .Select(rtGrouped => new ReceiptTax
                                {
                                    TaxGroup = rtGrouped.Key,
                                    NetAmount = rtGrouped.Sum(r => r.NetAmount),
                                    GrossAmount = rtGrouped.Sum(r => r.GrossAmount)
                                })
                                .ToArray();
            }

            /// <summary>
            /// Gets receipt taxes for sales transaction.
            /// </summary>
            /// <returns>The receipt taxes collection.</returns>
            private List<ReceiptTax> GetSalesOrderReceiptTaxes()
            {
                List<ReceiptTax> receiptTaxes = new List<ReceiptTax>();

                var taxLinesGroupsByPercentageAndExemptSign = GetSalesLines()
                    .SelectMany(salesLine => salesLine.TaxLines.Select(tl => new
                    {
                        IsReturnLine = salesLine.IsReturnLine(),
                        TaxLine = tl
                    }))
                    .GroupBy(tl => new
                    {
                        tl.TaxLine.Percentage,
                        tl.TaxLine.IsExempt
                    });

                foreach (var group in taxLinesGroupsByPercentageAndExemptSign)
                {
                    receiptTaxes.Add(
                        new ReceiptTax
                        {
                            TaxGroup = group.Key.IsExempt
                                ? ConfigurationController.GetExemptTaxGroup(request.FiscalIntegrationFunctionalityProfile)
                                : SalesTransactionHelper.GetTaxGroupByRate(request.FiscalIntegrationFunctionalityProfile, group.Key.Percentage),
                            TaxPercent = group.Key.Percentage,
                            NetAmount = group.Sum(l => (l.IsReturnLine ? -1 : 1) * Math.Abs(l.TaxLine.TaxBasis)),
                            TaxAmount = group.Sum(l => l.TaxLine.Amount),
                            GrossAmount = group.Sum(l => (l.IsReturnLine ? -1 : 1) * Math.Abs(l.TaxLine.TaxBasis) + l.TaxLine.Amount)
                        });
                }

                AddTaxesByCustomerOrderDeposit(receiptTaxes);
                AddTaxLineForCustomerDepositByPrepayment(receiptTaxes);

                return receiptTaxes;
            }

            /// <summary>
            /// Adds tax line for customer deposit by prepayment.
            /// </summary>
            /// <param name="receiptTaxes">The receipt taxes.</param>
            private void AddTaxLineForCustomerDepositByPrepayment(List<ReceiptTax> receiptTaxes)
            {
                if (salesOrder.PrepaymentAmountAppliedOnPickup == 0)
                {
                    return;
                }

                receiptTaxes.Add(new ReceiptTax
                {
                    TaxGroup = ConfigurationController.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile),
                    NetAmount = salesOrder.PrepaymentAmountAppliedOnPickup * -1,
                    TaxAmount = 0, //Tax amount is always 0, because non-zero taxes are not supported in DEU localization.
                    GrossAmount = salesOrder.PrepaymentAmountAppliedOnPickup * -1
                });
            }

            /// <summary>
            /// Adds taxes for customer order deposit.
            /// </summary>
            /// <param name="receiptTaxes">The receipt taxes.</param>
            private void AddTaxesByCustomerOrderDeposit(List<ReceiptTax> receiptTaxes)
            {
                if (!salesOrder.IsDepositProcessing())
                {
                    return;
                }

                var depositSum = CalculateDepositSumForOrder();

                if (depositSum != 0)
                {
                    receiptTaxes.Add(new ReceiptTax
                    {
                        TaxGroup = ConfigurationController.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile),
                        NetAmount = depositSum,
                        TaxAmount = 0, //Tax amount is always 0, because non-zero taxes are not supported in DEU localization.
                        GrossAmount = depositSum
                    });
                }
            }

            /// <summary>
            /// Sets reference registration date in EFR of the original transaction.
            /// </summary>
            /// <param name="receiptPosition">The receipt position.</param>
            /// <param name="salesOrder">The original sales transaction.</param>
            private void SetReferenceDate(ReceiptPosition receiptPosition, SalesOrder salesOrder)
            {
                if (salesOrder == null)
                {
                    receiptPosition.ReferenceDateTime = DateTime.MinValue;
                    return;
                }

                FiscalTransaction fiscalTransaction = null;
                var selectedFiscalTransactions = salesOrder.FiscalTransactions
                    .Where(ft => ft.RegistrationType == ExtensibleFiscalRegistrationType.CashSale)
                    .Where(ft => ft.CountryRegionIsoCode == CountryRegionISOCode.DE.ToString());

                DateTime maxDateTime = DateTime.MinValue;
                foreach (var ft in selectedFiscalTransactions)
                {
                    var endDateTime = ft.ExtensionProperties.SingleOrDefault(p => p.Key == ExtensibleFiscalRegistrationExtendedDataType.TransactionEnd.Name)?.Value.StringValue;
                    if (DateTime.TryParse(endDateTime, out var dateTime) && dateTime > maxDateTime)
                    {
                        fiscalTransaction = ft;
                        maxDateTime = dateTime;
                    }
                }
                receiptPosition.ReferenceDateTime = maxDateTime;
            }
        }
    }
}