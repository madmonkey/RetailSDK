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
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.Serializers;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using ReceiptsCzech = Microsoft.Dynamics.Commerce.Runtime.ReceiptsCzechia.Contracts;

        /// <summary>
        /// The document rule for Czech Republic.
        /// </summary>
        public class DocumentRuleCZ : DocumentRuleBase
        {
            private string RegistrationId = string.Empty;
            private const int PositionCzField = 23;
            private const int PaymentCzField = 24;
            private const int RoundPrecision = 2;

            /// <summary>
            /// Initializes a new instance of the <see cref="DocumentRuleCZ" /> class.
            /// </summary>
            /// <param name="request">Retail transaction to register.</param>
            /// <param name="salesOrder">Type of registration sequence.</param>
            public DocumentRuleCZ(GetFiscalDocumentDocumentProviderRequest request, SalesOrder salesOrder)
                : base(request, salesOrder)
            {
                TaxRegistration taxRegistration = request.RequestContext.GetOrgUnit()?.TaxRegistrations.Where(taxReg => taxReg.Type == TaxRegistrationType.BusinessPremiseId).FirstOrDefault();

                this.RegistrationId = taxRegistration?.RegistrationNumber ?? this.RegistrationId;
            }

            /// <summary>
            /// Adds country/region specific receipt positions to the collection of receipt positions.
            /// </summary>
            /// <param name="positions">The collection of receipt positions.</param>
            public override void AddCountryRegionSpecificPositions(List<ReceiptPosition> positions)
            {
                if (salesOrder.IsDepositProcessing())
                {
                    var depositSum = CalculateDepositSumForOrder();

                    if (depositSum != 0)
                    {
                        positions.Add(new ReceiptPosition()
                        {
                            Quantity = depositSum > 0 ? 1 : -1,
                            Description = SalesTransactionHelper.TranslateText(request.RequestContext, DataModelEFR.Constants.SalesTransactionLocalizationConstants.Deposit),
                            TaxGroup = ConfigurationController.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile),
                            PositionNumber = GetDepositPositionNumber(positions),
                            UnitPrice = Math.Abs(depositSum),
                            Amount = depositSum,
                            CZField = PositionCzField,
                        });
                    }
                }

                foreach (var giftCardLine in salesOrder.ActiveSalesLines.Where(c => c.IsGiftCardLine))
                {
                    var giftCardPosition = new ReceiptPosition()
                    {
                        Quantity = giftCardLine.Quantity,
                        Description = SalesTransactionHelper.TranslateText(request.RequestContext, DataModelEFR.Constants.SalesTransactionLocalizationConstants.GiftCard),
                        ItemIdentity = giftCardLine.ItemIdentity(),
                        PositionNumber = SalesTransactionHelper.ConvertLineNumberToPositionNumber(giftCardLine.LineNumber),
                        Amount = giftCardLine.GrossAmount,
                        UnitPrice = giftCardLine.Price,
                        CZField = PositionCzField,
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
            /// Checks if the document generation required.
            /// </summary>
            /// <returns>True if document generation required; False otherwise.</returns>
            public override bool IsDocumentGenerationRequired()
            {
                return salesOrder.ActiveTenderLines.Count != 0;
            }

            /// <summary>
            /// Adds receipt positions for customer account deposit.
            /// </summary>
            public override void AddCustomerAccountDepositPositions(List<ReceiptPosition> positions)
            {
                positions.Add(new ReceiptPosition()
                {
                    ItemNumber = salesOrder.CustomerId,
                    Description = SalesTransactionHelper.TranslateText(request.RequestContext, SalesTransactionLocalizationConstants.Deposit),
                    Quantity = 1,
                    TaxGroup = ConfigurationController.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile),
                    CZField = PositionCzField,
                    Amount = salesOrder.CustomerAccountDepositLines.Sum(c => c.Amount),
                    UnitPrice = salesOrder.CustomerAccountDepositLines.Sum(c => c.Amount),
                });
            }

            /// <summary>
            /// Creates receipt taxes for customer account deposit transaction.
            /// </summary>
            /// <returns>The receipt taxes collection.</returns>
            public override List<ReceiptTax> CreateCustomerAccountDepositReceiptTaxes()
            {
                var depositTaxGroup = SalesTransactionHelper.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile);
                var depositSum = CalculateDepositSumForOrder();

                List<ReceiptTax> receiptTaxes = new List<ReceiptTax>();
                if (depositSum > 0)
                {
                    var taxAmount = SalesTransactionHelper.CalculateDepositTaxAmount(depositSum, depositTaxGroup.Item1, RoundPrecision);
                    receiptTaxes.Add(
                        new ReceiptTax
                        {
                            TaxGroup = depositTaxGroup.Item2,
                            TaxPercent = depositTaxGroup.Item1,
                            NetAmount = depositSum - taxAmount,
                            TaxAmount = taxAmount,
                            GrossAmount = depositSum
                        }
                    );
                }
                return receiptTaxes;
            }

            /// <summary>
            /// Creates receipt taxes for sales transaction.
            /// </summary>
            /// <returns>The receipt taxes collection.</returns>
            public override List<ReceiptTax> CreateSalesTransactionReceiptTaxes()
            {
                List<ReceiptTax> receiptTaxes = new List<ReceiptTax>();
                receiptTaxes = GetTaxes(this.GetSalesLines());

                var depositTaxGroup = SalesTransactionHelper.GetDepositTaxGroup(request.FiscalIntegrationFunctionalityProfile);
                var depositSum = Math.Round(salesOrder.ActiveTenderLines.Sum(c => c.Amount)
                    - SalesTransactionHelper.GetCarryOutLines(request.RequestContext, salesOrder)
                    .Sum(c => c.TotalAmount), RoundPrecision);


                if (salesOrder.IsDepositProcessing() && depositSum != 0)
                {
                    receiptTaxes.Add(CreateReceiptTax(depositSum, depositTaxGroup));
                }

                foreach (var giftCardLine in salesOrder.ActiveSalesLines.Where(c => c.IsGiftCardLine))
                {
                    if (giftCardLine.TaxLines.Any())
                    {
                        receiptTaxes.AddRange(GetTaxes(new SalesLine[] { giftCardLine }));
                    }
                    else
                    {
                        receiptTaxes.Add(CreateReceiptTax(giftCardLine.TotalAmount, depositTaxGroup));
                    }
                }

                return receiptTaxes.GroupBy(c => new { c.TaxGroup, c.TaxPercent })
                    .Select(c => new ReceiptTax
                    {
                        TaxGroup = c.Key.TaxGroup,
                        TaxPercent = c.Key.TaxPercent,
                        NetAmount = c.Sum(b => b.NetAmount),
                        TaxAmount = c.Sum(b => b.TaxAmount),
                        GrossAmount = c.Sum(b => b.GrossAmount)
                    }).ToList();
            }

            /// <summary>
            /// Adds localization information to receipt.
            /// </summary>
            /// <param name="receipt">The receipt.</param>
            public override void AddLocalizationInfoToReceipt(DataModelEFR.Documents.Receipt receipt)
            {
                receipt.RegistrationId = RegistrationId;
            }

            /// <summary>
            /// Adds localization information to receipt payment.
            /// </summary>
            /// <param name="payment">The receipt payment.</param>
            public override void AddLocalizationInfoToPayment(DataModelEFR.Documents.ReceiptPayment payment)
            {
                payment.CZField = PaymentCzField;
            }

            /// <summary>
            /// Get the receipt payment for deposit payment.
            /// </summary>
            /// <returns>The receipt payment for deposit payment.</returns>
            public override ReceiptPayment GetDepositTenderLine()
            {
                return new ReceiptPayment
                {
                    Description = SalesTransactionHelper.TranslateText(request.RequestContext, DataModelEFR.Constants.SalesTransactionLocalizationConstants.Deposit),
                    Amount = salesOrder.PrepaymentAmountAppliedOnPickup,
                    UniqueIdentifier = string.Empty,
                    PaymentTypeGroup = string.Empty,
                    CZField = PaymentCzField
                };
            }

            /// <summary>
            /// Retrieve the sales line for document creation.
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
                return SalesTransactionHelper.JoinTaxCodes(SalesTransactionHelper.GetTaxGroupsFromSalesLineWithDefault(request.FiscalIntegrationFunctionalityProfile, salesLine));
            }

            /// <summary>
            /// Calculates the deposit sum for sales order.
            /// </summary>
            /// <returns>The deposit sum.</returns>
            private decimal CalculateDepositSumForOrder()
            {
                return Math.Round(salesOrder.ActiveTenderLines.Sum(c => c.Amount)
                    - SalesTransactionHelper.GetCarryOutLines(request.RequestContext, salesOrder)
                    .Sum(c => c.TotalAmount), RoundPrecision);
            }

            private ReceiptTax CreateReceiptTax(decimal totalAmount, Tuple<decimal, string> depositTax)
            {
                var taxAmount = SalesTransactionHelper.CalculateDepositTaxAmount(totalAmount, depositTax.Item1, RoundPrecision);
                return new ReceiptTax
                {
                    TaxGroup = depositTax.Item2,
                    TaxPercent = depositTax.Item1,
                    NetAmount = totalAmount - taxAmount,
                    TaxAmount = taxAmount,
                    GrossAmount = totalAmount
                };
            }
            /// <summary>
            /// Gets the line number for deposit positions.
            /// </summary>
            /// <param name="positions">The collection of receipt positions.</param>
            /// <returns>The deposit position number.</returns>
            private int GetDepositPositionNumber(IEnumerable<ReceiptPosition> positions)
            {
                if (positions.Count() == 0)
                {
                    return 1;
                }

                return positions.Max(c => c.PositionNumber) + 1;
            }

            /// <summary>
            /// Transforms the collection of sales lines to receipt taxes.
            /// </summary>
            /// <param name="salesLineCollection">The collection of sales lines.</param>
            /// <returns>The collection of receipt taxes.</returns>
            private List<ReceiptTax> GetTaxes(IEnumerable<SalesLine> salesLineCollection)
            {
                var taxLinesGrpByPercentage = salesLineCollection
                    .SelectMany(salesLine => salesLine.TaxLines.Select(tl => 
                    new
                    {
                        IsReturnLine = salesLine.IsReturnLine(),
                        TaxLine = tl
                    }))
                    .GroupBy(tl =>
                        tl.TaxLine.Percentage
                    );

                return taxLinesGrpByPercentage.Select(group =>
                    new ReceiptTax
                    {
                        TaxGroup = SalesTransactionHelper.GetTaxGroupByRateOrDefault(request.FiscalIntegrationFunctionalityProfile, group.Key),
                        TaxPercent = group.Key,
                        NetAmount = group.Sum(x => (x.IsReturnLine ? -1 : 1) * Math.Abs(x.TaxLine.TaxBasis)),
                        TaxAmount = group.Sum(x => x.TaxLine.Amount),
                        GrossAmount = group.Sum(x => (x.IsReturnLine ? -1 : 1) * Math.Abs(x.TaxLine.TaxBasis) + x.TaxLine.Amount)
                    }
                ).ToList();
            }

            /// <summary>
            /// Sets the referenced receipt position's fields.
            /// </summary>
            /// <param name="receiptPosition">The receipt position.</param>
            /// <param name="salesLine">The sales line.</param>
            public override async Task SetReferenceFieldsAsync(ReceiptPosition receiptPosition, SalesLine salesLine)
            {
                await base.SetReferenceFieldsAsync(receiptPosition, salesLine).ConfigureAwait(false);

                var originalSalesOrder = await salesLine.GetOriginSalesOrderAsync(request.RequestContext).ConfigureAwait(false);
                if (originalSalesOrder == null)
                {
                    return;
                }

                ReceiptsCzech.FiscalServiceResponse fiscalServiceResponse = null;
                var fiscalResponseString = originalSalesOrder.FiscalTransactions.Where(c => !string.IsNullOrWhiteSpace(c.RegisterResponse)).FirstOrDefault()?.RegisterResponse;

                if (string.IsNullOrWhiteSpace(fiscalResponseString))
                {
                    return;
                }

                fiscalServiceResponse = XmlSerializer<ReceiptsCzech.FiscalServiceResponse>.Deserialize(fiscalResponseString);

                if (fiscalServiceResponse == null)
                {
                    return;
                }
                receiptPosition.ReferenceDateTimeStringValue = fiscalServiceResponse.TransactionDate;
                receiptPosition.ReferenceTransactionNumber = fiscalServiceResponse.TransactionNumber;
            }

            /// <summary>
            /// Creates receipt payments.
            /// </summary>
            /// <returns>The receipt payments.</returns>
            public override async Task<List<ReceiptPayment>> CreateReceiptPaymentsAsync()
            {
                return await CreateReceiptPaymentsWithoutCurrencyAsync().ConfigureAwait(false);
            }

            /// <summary>
            /// Calculates total payment amount with prepayment.
            /// </summary>
            /// <returns>The total payment amount.</returns>
            public override decimal GetTotalAmount()
            {
                return salesOrder.CalcTotalPaymentAmountWithPrepayment();
            }
        }
    }
}
