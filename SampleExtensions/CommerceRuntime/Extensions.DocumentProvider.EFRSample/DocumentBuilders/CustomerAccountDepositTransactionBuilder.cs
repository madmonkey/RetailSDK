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
        using Receipt = DataModelEFR.Documents.Receipt;
        using SalesTransactionRegistrationRequest = DataModelEFR.Documents.SalesTransactionRegistrationRequest;

        /// <summary>
        /// Builds a customer account deposit transaction document.
        /// </summary>
        public class CustomerAccountDepositTransactionBuilder : IDocumentBuilder
        {
            /// <summary>
            /// The request.
            /// </summary>
            private GetFiscalDocumentDocumentProviderRequest request;

            /// <summary>
            /// The sales order.
            /// </summary>
            private SalesOrder salesOrder;

            /// <summary>
            /// The transaction builder document rule.
            /// </summary>
            private IDocumentRule documentRule;

            /// <summary>
            /// Initializes a new instance of the <see cref="CustomerAccountDepositTransactionBuilder" /> class.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="salesOrder">The sales order.</param>
            public CustomerAccountDepositTransactionBuilder(GetFiscalDocumentDocumentProviderRequest request, SalesOrder salesOrder)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(salesOrder, nameof(salesOrder));

                this.request = request;
                this.salesOrder = salesOrder;
                this.documentRule = LocalizedDocumentBuilderFabric.GetLocalizedDocumentRule(request, salesOrder);
            }

            /// <summary>
            /// Builds fiscal integration document.
            /// </summary>
            /// <returns>The customer account deposit receipt document.</returns>
            public async Task<IFiscalIntegrationDocument> BuildAsync()
            {
                return new SalesTransactionRegistrationRequest
                {
                    Receipt = await this.CreateReceiptAsync().ConfigureAwait(false)
                };
            }

            /// <summary>
            /// Creates receipt.
            /// </summary>
            /// <returns>The receipt.</returns>
            private async Task<Receipt> CreateReceiptAsync()
            {
                Receipt receipt = new Receipt
                {
                    CountryRegionISOCode = request.RequestContext.GetChannelConfiguration().CountryRegionISOCode,
                    ReceiptDateTime = salesOrder.CreatedDateTime.DateTime,
                    TransactionLocation = salesOrder.StoreId,
                    TransactionTerminal = salesOrder.TerminalId,
                    OperatorId = salesOrder.StaffId,
                    OperatorName = await SalesTransactionHelper.GetOperatorNameAsync(request.RequestContext, salesOrder.StaffId).ConfigureAwait(false),
                    NonFiscalTransactionType = documentRule.GetCustomerAccountDepositTransactionType(),
                    IsTrainingTransaction = 0,
                    PositionLines = this.CreateReceiptPositionLines(),
                    Payments = await this.CreateReceiptPaymentsAsync().ConfigureAwait(false),
                    Taxes = this.CreateReceiptTaxes(),
                };
                if (receipt.PositionLines.ReceiptPositions.Count > 0)
                    receipt.TotalAmount = receipt.PositionLines.ReceiptPositions.Sum(c => c.Amount);
                documentRule.AddLocalizationInfoToReceipt(receipt);
                documentRule.AddCustomerDataToReceipt(receipt);
                return receipt;
            }

            /// <summary>
            /// Creates receipt position lines.
            /// </summary>
            /// <returns>The receipt position lines.</returns>
            private ReceiptPositionLines CreateReceiptPositionLines()
            {
                if (salesOrder.IsDepositProcessing() && salesOrder.HasDepositLinesOnly(request.RequestContext))
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
            /// Creates receipt positions.
            /// </summary>
            /// <returns>The receipt positions.</returns>
            private List<ReceiptPosition> CreateReceiptPositions()
            {
                List<ReceiptPosition> positions = new List<ReceiptPosition>();
                documentRule.AddCustomerAccountDepositPositions(positions);
                return positions;
            }

            /// <summary>
            /// Creates receipt payments.
            /// </summary>
            /// <returns>The receipt payments.</returns>
            private async Task<List<ReceiptPayment>> CreateReceiptPaymentsAsync()
            {
                List<ReceiptPayment> receiptPayments = new List<ReceiptPayment>();

                foreach (var tenderLine in salesOrder.ActiveTenderLines)
                {
                    var payment = new ReceiptPayment
                    {
                        Description = await SalesTransactionHelper.GetTenderTypeNameAsync(request.RequestContext, tenderLine.TenderTypeId).ConfigureAwait(false),
                        Amount = tenderLine.Amount
                    };
                    
                    documentRule.AddLocalizationInfoToCustomerPayment(payment, tenderLine.TenderTypeId);
                    receiptPayments.Add(payment);
                }

                return receiptPayments;
            }

            /// <summary>
            /// Creates receipt taxes.
            /// </summary>
            /// <returns>The receipt taxes.</returns>
            private List<ReceiptTax> CreateReceiptTaxes()
            {
                return documentRule.CreateCustomerAccountDepositReceiptTaxes();
            }
        }
    }
}
