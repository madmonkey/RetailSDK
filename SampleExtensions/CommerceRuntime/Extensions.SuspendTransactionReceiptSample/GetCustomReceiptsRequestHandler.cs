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
    namespace Commerce.Runtime.ReceiptsSample
    {
        using System.Collections.Generic;
        using System.Collections.ObjectModel;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Workflow;

        /// <summary>
        /// The request handler for GetCustomReceiptsRequestHandler class.
        /// </summary>
        /// <remarks>
        /// This is an example of how to print custom types of receipts. In this example the receipt is for a transaction as opposed to
        /// a sales order. The implementation converts the transaction to a sales order so that existing receipt fields can be used.
        /// </remarks>
        public class GetCustomReceiptsRequestHandler : SingleAsyncRequestHandler<GetCustomReceiptsRequest>
        {
            /// <summary>
            /// Processes the GetCustomReceiptsRequest to return the set of receipts. The request should not be null.
            /// </summary>
            /// <param name="request">The request parameter.</param>
            /// <returns>The GetReceiptResponse.</returns>
            protected override async Task<Response> Process(GetCustomReceiptsRequest request)
            {
                ThrowIf.Null(request, "request");
                ThrowIf.Null(request.ReceiptRetrievalCriteria, "request.ReceiptRetrievalCriteria");

                // The sales order that we are printing receipts for is retrieved.
                SalesOrder salesOrder = this.GetSalesOrderForTransactionWithId(request.RequestContext, request.TransactionId);

                // Custom receipts are printed.
                Collection<Receipt> result = new Collection<Receipt>();
                switch (request.ReceiptRetrievalCriteria.ReceiptType) 
                {
                    // An example of getting custom receipts.
                    case ReceiptType.CustomReceipt7:
                        {
                            IEnumerable<Receipt> customReceipts = await this.GetCustomReceiptsAsync(salesOrder, request.ReceiptRetrievalCriteria, request.RequestContext).ConfigureAwait(false);

                            result.AddRange(customReceipts);
                        }

                        break;

                    default:
                        // Add more logic to handle more types of custom receipt types.
                        break;
                }

                return new GetReceiptResponse(new ReadOnlyCollection<Receipt>(result));
            }

            /// <summary>
            /// Gets a sales order for the transaction with the given identifier.
            /// </summary>
            /// <param name="requestContext">The request context.</param>
            /// <param name="transactionId">The transaction identifier.</param>
            /// <returns>The sales order.</returns>
            private SalesOrder GetSalesOrderForTransactionWithId(RequestContext requestContext, string transactionId)
            {
                SalesOrder salesOrder = new SalesOrder();
                SalesTransaction salesTransaction = CartWorkflowHelper.LoadSalesTransaction(requestContext, transactionId);
                if (salesTransaction != null)
                {
                    // The sales transaction is converted into a sales order so that existing receipt fields can be used.
                    salesOrder.CopyFrom<SalesTransaction>(salesTransaction);
                }
                else
                {
                    throw new DataValidationException(
                        DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_ObjectNotFound,
                        string.Format("Unable to get the sales transaction. ID: {0}", transactionId));
                }

                return salesOrder;
            }

            /// <summary>
            /// An example to get a custom receipt.
            /// </summary>
            /// <param name="salesOrder">The sales order that we are printing receipts for.</param>
            /// <param name="criteria">The receipt retrieval criteria.</param>
            /// <param name="context">The request context.</param>
            /// <returns>A collection of receipts.</returns>
            private async Task<Collection<Receipt>> GetCustomReceiptsAsync(SalesOrder salesOrder, ReceiptRetrievalCriteria criteria, RequestContext context)
            {
                Collection<Receipt> result = new Collection<Receipt>();

                var getReceiptServiceRequest = new GetReceiptServiceRequest(
                    salesOrder,
                    new Collection<ReceiptType> { criteria.ReceiptType },
                    salesOrder.TenderLines,
                    criteria.IsCopy,
                    criteria.IsPreview,
                    criteria.HardwareProfileId,
                    includeExternalReceipt: false,
                    requestedReceiptType: criteria.ReceiptType);
                var customReceiptsResponse = await context.ExecuteAsync<GetReceiptServiceResponse>(getReceiptServiceRequest).ConfigureAwait(false);
                ReadOnlyCollection<Receipt> customReceipts = customReceiptsResponse.Receipts;
                result.AddRange(customReceipts);

                return result;
            }
        }
    }
}
