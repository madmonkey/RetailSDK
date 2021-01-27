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
    namespace Commerce.Runtime.DocumentProvider.EFRSample
    {
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentHelpers;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.Extensions;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Handlers;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// The non-fiscal document provider for EFSTA (European Fiscal Standards Association) Fiscal Register (version 1.8.3) specfic for Austria.
        /// </summary>
        public class DocumentProviderEFRNonFiscalAUT : INamedRequestHandlerAsync, IDocumentProviderEFR
        {
            /// <summary>
            /// Gets the unique name for this request handler.
            /// </summary>
            public string HandlerName => "NonFiscalEFRSampleAUT";

            /// <summary>
            /// Gets the supported fiscal integration event type.
            /// </summary>
            public IEnumerable<int> SupportedRegistrableFiscalEventsId => new int[]
            {
                (int)FiscalIntegrationEventType.Sale,
                (int)FiscalIntegrationEventType.CreateCustomerOrder,
                (int)FiscalIntegrationEventType.EditCustomerOrder,
                (int)FiscalIntegrationEventType.CancelCustomerOrder,
                (int)FiscalIntegrationEventType.CustomerAccountDeposit
            };

            /// <summary>
            /// Gets the supported non-fiscal integration event type.
            /// </summary>
            public IEnumerable<int> SupportedRegistrableNonFiscalEventsId => new []
            {
                (int)FiscalIntegrationEventType.AuditEvent,
                (int)FiscalIntegrationEventType.OpenDrawer,
                (int)FiscalIntegrationEventType.FloatEntry,
                (int)FiscalIntegrationEventType.PrintReceiptCopy,
                (int)FiscalIntegrationEventType.RemoveTender,
                (int)FiscalIntegrationEventType.StartingAmount,
                (int)FiscalIntegrationEventType.XReport,
                (int)FiscalIntegrationEventType.ZReport,
                (int)FiscalIntegrationEventType.SafeDrop,
                (int)FiscalIntegrationEventType.BankDrop,
            };

            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes => DocumentProviderHelper.SupportedRequestTypes;

            /// <summary>
            /// Executes the specified request using the specified request context and handler.
            /// </summary>
            /// <param name="request">The request to execute.</param>
            /// <returns>The response of the request from the request handler.</returns>
            public Task<Response> Execute(Request request)
            {
                return DocumentProviderHelper.ExecuteAsync(request, this);
            }

            /// <summary>
            /// Gets sales order adjustment type.
            /// </summary>
            /// <param name="salesOrder">The sales order.</param>
            /// <returns>The sales order adjustment type.</returns>
            public FiscalIntegrationSalesOrderAdjustmentType GetSalesOrderAdjustmentType(SalesOrder salesOrder)
            {
                ThrowIf.Null(salesOrder, nameof(salesOrder));

                FiscalIntegrationSalesOrderAdjustmentType adjustmentType = FiscalIntegrationSalesOrderAdjustmentType.None;

                if ((salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.CustomerOrder ||
                    salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.AsyncCustomerOrder) &&
                    (salesOrder.CustomerOrderMode == CustomerOrderMode.Pickup ||
                    salesOrder.CustomerOrderMode == CustomerOrderMode.Return))
                {
                    // When it is customer order pick up or return, all sales lines are excluded (gift card can not be added to customer order).
                    adjustmentType = FiscalIntegrationSalesOrderAdjustmentType.ExcludeNonGiftCards;
                }
                else
                {
                    adjustmentType = SalesTransactionAdjustmentHelper.GetSalesOrderNonFiscalAdjustmentType(salesOrder);
                }

                return adjustmentType;
            }

            /// <summary>
            /// Fills document adjustment.
            /// </summary>
            /// <param name="request">The get fiscal document request.</param>
            /// <param name="fiscalIntegrationDocument">The fiscal integration document.</param>
            public async Task FillDocumentAdjustmentAsync(GetFiscalDocumentDocumentProviderRequest request, FiscalIntegrationDocument fiscalIntegrationDocument)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(request.SalesOrder, nameof(request.SalesOrder));
                ThrowIf.Null(fiscalIntegrationDocument, nameof(fiscalIntegrationDocument));

                FiscalIntegrationSalesOrderAdjustmentType adjustmentType = SalesTransactionAdjustmentHelper.GetSalesOrderAdjustmentType(request.SalesOrder);

                if (adjustmentType != FiscalIntegrationSalesOrderAdjustmentType.None)
                {
                    var adjustedSalesOrderResponse = await request.SalesOrder.GetAdjustedSalesOrderAsync(request.RequestContext, adjustmentType).ConfigureAwait(false);
                    fiscalIntegrationDocument.DocumentAdjustment = adjustedSalesOrderResponse.DocumentAdjustment;
                }
            }

            /// <summary>
            /// Gets the fiscal registration result string.
            /// </summary>
            /// <param name="fiscalIntegrationRegistrationResult">The fiscal integration registration result.</param>
            /// <returns>The fiscal registration result string.</returns>
            public string GetFiscalRegisterResponseToSave(FiscalIntegrationRegistrationResult fiscalIntegrationRegistrationResult)
            {
                return fiscalIntegrationRegistrationResult.GetFiscalResponseStringAT();
            }
        }
    }
}
