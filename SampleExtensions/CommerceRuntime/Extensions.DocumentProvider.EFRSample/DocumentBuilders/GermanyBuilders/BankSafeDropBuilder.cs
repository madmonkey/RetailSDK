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
    namespace Commerce.Runtime.DocumentProvider.EFRSample.DocumentBuilders.GermanyBuilders
    {
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentHelpers;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using Receipt = DataModelEFR.Documents.Receipt;

        /// <summary>
        /// Incapsulates the document generation logic for the safe drop event.
        /// </summary>
        public class BankSafeDropBuilder : IDocumentBuilder
        {
            /// <summary>
            /// The request.
            /// </summary>
            private readonly GetFiscalDocumentDocumentProviderRequest request;

            /// <summary>
            /// The sales order.
            /// </summary>
            private readonly SalesOrder salesOrder;

            /// <summary>
            /// The transaction builder document rule.
            /// </summary>
            private readonly IDocumentRule documentRule;

            /// <summary>
            /// Creates a new instance of <see cref="BankSafeDropBuilder"/>.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="transactionId">The transaction identifier.</param>
            public BankSafeDropBuilder(GetFiscalDocumentDocumentProviderRequest request, string transactionId)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.NullOrWhiteSpace(transactionId, nameof(transactionId));

                SearchLocation searchLocationType = request.FiscalDocumentRetrievalCriteria.IsRemoteTransaction ? SearchLocation.All : SearchLocation.Local;
                var getSalesOrderRequest = new GetSalesOrderDetailsByTransactionIdServiceRequest(transactionId, searchLocationType);

                this.salesOrder = request.RequestContext.Execute<GetSalesOrderDetailsServiceResponse>(getSalesOrderRequest).SalesOrder;
                this.request = request;
                this.documentRule = LocalizedDocumentBuilderFabric.GetLocalizedDocumentRule(request, salesOrder);
            }

            /// <summary>
            /// Builds fiscal integration document.
            /// </summary>
            /// <returns> The fiscal integration receipt document.</returns>
            public async Task<IFiscalIntegrationDocument> BuildAsync()
            {
                var receipt = await this.CreateReceiptAsync().ConfigureAwait(false);
                return new SalesTransactionRegistrationRequest
                {
                    Receipt = receipt
                };
            }

            /// <summary>
            /// Creates a receipt.
            /// </summary>
            /// <returns>The receipt.</returns>
            private async Task<Receipt> CreateReceiptAsync()
            {
                var receipt = new Receipt
                {
                    TransactionLocation = salesOrder.StoreId,
                    TransactionTerminal = salesOrder.TerminalId,
                    TransactionNumber = salesOrder.Id,
                    TotalAmount = -1 * salesOrder.TotalAmount,
                    NonFiscalSignedTransactionType = documentRule.GetNonFiscalTransactionType(),
                    PositionLines = this.CreateReceiptPositionLines(),
                    Payments = await this.CreateReceiptPaymentsAsync().ConfigureAwait(false),
                };
                return receipt;
            }

            /// <summary>
            /// Creates position lines.
            /// </summary>
            /// <returns>The receipt position lines.</returns>
            private ReceiptPositionLines CreateReceiptPositionLines()
            {
                if (!documentRule.CanСreatePositions())
                {
                    return null;
                }

                ReceiptPositionLines receiptPositionLines = new ReceiptPositionLines
                {
                    ReceiptPositions = this.CreateReceiptPositions(),
                };

                return receiptPositionLines;
            }

            /// <summary>
            /// Creates positions.
            /// </summary>
            /// <returns>The receipt positions.</returns>
            private List<ReceiptPosition> CreateReceiptPositions()
            {
                var position = new ReceiptPosition
                {
                    PositionNumber = 1,
                    Description = salesOrder.ExtensibleSalesTransactionType.Name,
                    Amount = -1 * salesOrder.TotalAmount
                };

                return new List<ReceiptPosition>(new[] { position });
            }

            /// <summary>
            /// Creates payments.
            /// </summary>
            /// <returns>The payments.</returns>
            private async Task<List<ReceiptPayment>> CreateReceiptPaymentsAsync()
            {
                var getDropAndDeclareTransactionTenderDetailsDataRequest = new GetDropAndDeclareTransactionTenderDetailsDataRequest(salesOrder.Id, QueryResultSettings.AllRecords);
                var tenderLines = (await request.RequestContext.ExecuteAsync<EntityDataServiceResponse<TenderDetail>>(getDropAndDeclareTransactionTenderDetailsDataRequest).ConfigureAwait(false)).PagedEntityCollection.Results;

                var tenderLinesGrpByTenderTypeId = tenderLines.GroupBy(tl => new
                {
                    tl.TenderTypeId,
                    tl.ForeignCurrency
                });

                return (await Task.WhenAll(
                    tenderLinesGrpByTenderTypeId.Select(async g =>
                    {
                        var payment = new ReceiptPayment
                        {
                            Description = await SalesTransactionHelper.GetTenderTypeNameAsync(request.RequestContext, g.Key.TenderTypeId).ConfigureAwait(false),
                            PaymentTypeGroup = SalesTransactionHelper.GetPaymentTypeGroup(request.FiscalIntegrationFunctionalityProfile, g.Key.TenderTypeId),
                            Amount = -1 * g.Sum(l => l.Amount)
                        };

                        if (salesOrder.CurrencyCode != g.Key.ForeignCurrency)
                        {
                            payment.ForeignAmount = -1 * g.Sum(l => l.AmountInForeignCurrency);
                            payment.ForeignCurrencyCode = g.Key.ForeignCurrency;
                        }

                        return payment;
                    }))
                ).ToList();
            }
        }
    }
}