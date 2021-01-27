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
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;

        /// <summary>
        /// The document rule for Austria.
        /// </summary>
        public class DocumentRuleAT : DocumentRuleBase
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="DocumentRuleAT" /> class.
            /// </summary>
            /// <param name="request">Retail transaction to register.</param>
            /// <param name="salesOrder">Type of registration sequence.</param>
            public DocumentRuleAT(GetFiscalDocumentDocumentProviderRequest request, SalesOrder salesOrder)
                : base(request, salesOrder)
            {
            }

            /// <summary>
            /// Adds localization information to receipt.
            /// </summary>
            /// <param name="receipt">The receipt.</param>
            public override void AddLocalizationInfoToReceipt(DataModelEFR.Documents.Receipt receipt)
            {
                receipt.TransactionNumber = salesOrder.Id;
                receipt.ReceiptDateTime = salesOrder.CreatedDateTime.DateTime;
            }

            /// <summary>
            /// Checks if the document generation required.
            /// </summary>
            /// <returns>True if document generation required; False otherwise.</returns>
            public override bool IsDocumentGenerationRequired()
            {
                if (salesOrder.IsDepositProcessing())
                {
                    // Checks if there is any payments to be registered (e.g. line comment or zero deposit) and can be avoided
                    return salesOrder.ActiveTenderLines.Count != 0;
                }

                return true;
            }

            /// <summary>
            /// Creates receipt taxes for sales transaction.
            /// </summary>
            /// <returns>The receipt taxes collection.</returns>
            public override List<ReceiptTax> CreateSalesTransactionReceiptTaxes()
            {
                List<ReceiptTax> receiptTaxes = new List<ReceiptTax>();

                if (salesOrder.IsDepositProcessing() && salesOrder.HasDepositLinesOnly(request.RequestContext))
                {
                    return receiptTaxes;
                }

                var taxLinesGrpByPercentage = this.GetSalesLines()
                    .SelectMany(salesLine => salesLine.TaxLines.Select(tl => 
                    new
                    {
                        IsReturnLine = salesLine.IsReturnLine(),
                        TaxLine = tl
                    }))
                    .GroupBy(tl => 
                        tl.TaxLine.Percentage
                    );

                foreach (var taxLine in taxLinesGrpByPercentage)
                {
                    receiptTaxes.Add(
                        new ReceiptTax
                        {
                            TaxGroup = SalesTransactionHelper.GetTaxGroupByRate(request.FiscalIntegrationFunctionalityProfile, taxLine.Key),
                            TaxPercent = taxLine.Key,
                            NetAmount = taxLine.Sum(l => (l.IsReturnLine ? -1 : 1) * Math.Abs(l.TaxLine.TaxBasis)),
                            TaxAmount = taxLine.Sum(l => l.TaxLine.Amount),
                            GrossAmount = taxLine.Sum(l => (l.IsReturnLine ? -1 : 1) * Math.Abs(l.TaxLine.TaxBasis) + l.TaxLine.Amount)
                        });
                }

                return receiptTaxes;
            }

            /// <summary>
            /// Gets the customer account deposit transaction type string.
            /// </summary>
            /// <returns>Returns an empty string.</returns>
            public override string GetCustomerAccountDepositTransactionType()
            {
                return SalesTransactionHelper.TranslateText(request.RequestContext, SalesTransactionLocalizationConstants.Deposit);
            }

            /// <summary>
            /// Get the receipt payment for deposit payment.
            /// </summary>
            /// <returns>The receipt payment for deposit payment.</returns>
            public override ReceiptPayment GetDepositTenderLine()
            {
                return new ReceiptPayment
                {
                    Description = SalesTransactionHelper.TranslateText(request.RequestContext, DataModelEFR.Constants.SalesTransactionLocalizationConstants.CustomerDeposit),
                    Amount = salesOrder.PrepaymentAmountAppliedOnPickup,
                    UniqueIdentifier = string.Empty,
                    PaymentTypeGroup = string.Empty
                };
            }

            /// <summary>
            /// Gets the non-fiscal transaction type string.
            /// </summary>
            /// <returns>The non-fiscal transaction type string.</returns>
            public override string GetNonFiscalTransactionType()
            {
                return SalesTransactionHelper.TranslateText(request.RequestContext, salesOrder.NonFiscalTransactionType(request.RequestContext));
            }

            /// <summary>
            /// Gets the sales line for document creation.
            /// </summary>
            /// <returns>The sales lines collection.</returns>
            public override IEnumerable<SalesLine> GetSalesLines()
            {
                return salesOrder.SalesLinesWithNonZeroQuantity();
            }

            /// <summary>
            /// Gets the tax groups for sales line.
            /// </summary>
            /// <param name="salesLine">The sales line.</param>
            /// <returns>The tax groups string.</returns>
            public override string GetSalesLineTaxGroups(SalesLine salesLine)
            {
                return SalesTransactionHelper.JoinTaxCodes(SalesTransactionHelper.GetTaxGroupsFromSalesLine(request.FiscalIntegrationFunctionalityProfile, salesLine));
            }

            /// <summary>
            /// Checks if the positions can be created.
            /// </summary>
            /// <returns>True if positions can be created; False otherwise.</returns>
            public override bool CanСreatePositions()
            {
                return !(salesOrder.IsDepositProcessing() && salesOrder.HasDepositLinesOnly(request.RequestContext));
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
