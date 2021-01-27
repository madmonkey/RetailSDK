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
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using Receipt = DataModelEFR.Documents.Receipt;

        /// <summary>
        /// Incapsulates the document generation logic for a non sales transaction event.
        /// </summary>
        public class NonSalesTransactionBuilder : IDocumentBuilder
        {
            private readonly IDictionary<FiscalIntegrationEventType, (string TransactionTypeCode, ExtensibleTransactionType ExtensibleTransactionType)> NonFiscalTransactionTypeDictionary =
                new Dictionary<FiscalIntegrationEventType, (string, ExtensibleTransactionType)>
                {
                    { FiscalIntegrationEventType.StartingAmount, ("INI", ExtensibleTransactionType.StartingAmount) },
                    { FiscalIntegrationEventType.FloatEntry, ("TRANSFER", ExtensibleTransactionType.FloatEntry) },
                    { FiscalIntegrationEventType.RemoveTender, ("TRANSFER", ExtensibleTransactionType.RemoveTender) }
                };

            /// <summary>
            /// The request.
            /// </summary>
            private readonly GetFiscalDocumentDocumentProviderRequest request;

            /// <summary>
            /// The tansaction identifier.
            /// </summary>
            private readonly string transactionId;

            /// <summary>
            /// Creates a new instance of <see cref="NonSalesTransactionBuilder"/>.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="transactionId">The transaction identifier.</param>
            public NonSalesTransactionBuilder(GetFiscalDocumentDocumentProviderRequest request, string transactionId)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.NullOrWhiteSpace(transactionId, nameof(transactionId));

                this.request = request;
                this.transactionId = transactionId;
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
                var tenderPayment = await this.GetTenderPaymentAsync().ConfigureAwait(false);
                decimal totalAmount = tenderPayment?.ReceiptPayment.Amount ?? 0;

                return new Receipt
                {
                    TransactionLocation = tenderPayment?.TransactionLocation,
                    TransactionTerminal = tenderPayment?.TransactionTerminal,
                    TransactionNumber = this.transactionId,
                    TotalAmount = totalAmount,
                    NonFiscalSignedTransactionType = this.GetTransactionType(),
                    PositionLines = this.CreateReceiptPositionLines(totalAmount, tenderPayment?.ExtensibleTransactionType.Name),
                    Payments = new[] { tenderPayment?.ReceiptPayment }.ToList(),
                };
            }

            /// <summary>
            /// Gets a transaction type.
            /// </summary>
            /// <returns>The transaction type.</returns>
            private string GetTransactionType()
            {
                return NonFiscalTransactionTypeDictionary[request.FiscalDocumentRetrievalCriteria.FiscalRegistrationEventType].TransactionTypeCode;
            }

            /// <summary>
            /// Creates position lines.
            /// </summary>
            /// <returns>The receipt position lines.</returns>
            private ReceiptPositionLines CreateReceiptPositionLines(decimal totalAmount, string description)
            {
                ReceiptPositionLines receiptPositionLines = new ReceiptPositionLines
                {
                    ReceiptPositions = this.CreateReceiptPositions(totalAmount, description),
                };

                return receiptPositionLines;
            }

            /// <summary>
            /// Creates positions.
            /// </summary>
            /// <returns>The receipt positions.</returns>
            private List<ReceiptPosition> CreateReceiptPositions(decimal totalAmount, string description)
            {
                var position = new ReceiptPosition
                {
                    PositionNumber = 1,
                    Description = description,
                    Amount = totalAmount
                };

                return new List<ReceiptPosition>(new[] { position });
            }

            /// <summary>
            /// Gets a tender payment.
            /// </summary>
            /// <returns>The tender payment.</returns>
            private async Task<TenderPayment> GetTenderPaymentAsync()
            {
                var nonSaleTransaction = await GetNonSaleTransactionAsync().ConfigureAwait(false);

                if (nonSaleTransaction == null)
                {
                    return null;
                }

                var coefficient = request.FiscalDocumentRetrievalCriteria.FiscalRegistrationEventType == FiscalIntegrationEventType.RemoveTender ? -1 : 1;

                var payment = new ReceiptPayment
                {
                    Description = await SalesTransactionHelper.GetTenderTypeNameAsync(request.RequestContext, nonSaleTransaction.TenderTypeId).ConfigureAwait(false),
                    PaymentTypeGroup = SalesTransactionHelper.GetPaymentTypeGroup(request.FiscalIntegrationFunctionalityProfile, nonSaleTransaction.TenderTypeId),
                    Amount = nonSaleTransaction.Amount * coefficient
                };

                if (nonSaleTransaction.ChannelCurrency != nonSaleTransaction.ForeignCurrency)
                {
                    payment.ForeignCurrencyCode = nonSaleTransaction.ForeignCurrency;
                    payment.ForeignAmount = nonSaleTransaction.AmountInForeignCurrency * coefficient;
                }

                return new TenderPayment
                {
                    ExtensibleTransactionType = nonSaleTransaction.ExtensibleTransactionType,
                    ReceiptPayment = payment,
                    TransactionLocation = nonSaleTransaction.StoreId,
                    TransactionTerminal = nonSaleTransaction.TerminalId
                };
            }

            /// <summary>
            /// Gets a non-sales transaction.
            /// </summary>
            /// <returns>The non-sales transaction.</returns>
            private async Task<NonSalesTransaction> GetNonSaleTransactionAsync()
            {
                var nonSaleTenderRequest = new GetNonSaleTenderServiceRequest
                {
                    ExtensibleTransactionType = NonFiscalTransactionTypeDictionary[request.FiscalDocumentRetrievalCriteria.FiscalRegistrationEventType].ExtensibleTransactionType,
                    TransactionId = this.transactionId,
                    ShiftId = request.FiscalDocumentRetrievalCriteria.ShiftId?.ToString() ?? string.Empty,
                    ShiftTerminalId = request.FiscalDocumentRetrievalCriteria.ShiftTerminalId
                };
                var nonSaleTenderResponse = await request.RequestContext.ExecuteAsync<GetNonSaleTenderServiceResponse>(nonSaleTenderRequest).ConfigureAwait(false);
                return nonSaleTenderResponse.NonSalesTenderOperation.SingleOrDefault();
            }

            /// <summary>
            /// Represents a tender payment.
            /// </summary>
            private class TenderPayment
            {
                /// <summary>
                /// The transaction terminal.
                /// </summary>
                public string TransactionTerminal { get; set; }

                /// <summary>
                /// The receipt payment.
                /// </summary>
                public ReceiptPayment ReceiptPayment { get; set; }

                /// <summary>
                /// The transaction location.
                /// </summary>
                public string TransactionLocation { get; set; }

                /// <summary>
                /// The extensible transaction type.
                /// </summary>
                public ExtensibleTransactionType ExtensibleTransactionType { get; set; }
            }
        }
    }
}