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
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentBuilders;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.Serializers;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.Extensions;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using System.Threading.Tasks;

        /// <summary>
        /// The document provider helper.
        /// </summary>
        public static class DocumentProviderHelper
        {
            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            public static IEnumerable<Type> SupportedRequestTypes => new[]
            {
                typeof(GetFiscalDocumentDocumentProviderRequest),
                typeof(GetSupportedRegistrableEventsDocumentProviderRequest),
                typeof(GetFiscalRegisterResponseToSaveDocumentProviderRequest),
                typeof(GetNonFiscalDocumentDocumentProviderRequest)
            };

            /// <summary>
            /// Executes the specified request using the specified request context and handler.
            /// </summary>
            /// <param name="request">The request to execute.</param>
            /// <param name="documentProviderEFR">The document provider.</param>
            /// <returns>The response of the request from the request handler.</returns>
            public static async Task<Response> ExecuteAsync(Request request, IDocumentProviderEFR documentProviderEFR)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(documentProviderEFR, nameof(documentProviderEFR));

                Response response;

                if (request is GetFiscalDocumentDocumentProviderRequest)
                {
                    response = await DocumentProviderHelper.GetFiscalDocumentAsync(request as GetFiscalDocumentDocumentProviderRequest, documentProviderEFR).ConfigureAwait(false);
                }
                else if (request is GetSupportedRegistrableEventsDocumentProviderRequest)
                {
                    response = DocumentProviderHelper.GetSupportedRegisterableEvents(documentProviderEFR);
                }
                else if (request is GetFiscalRegisterResponseToSaveDocumentProviderRequest)
                {
                    response = DocumentProviderHelper.GetFiscalRegisterResponseToSave(request as GetFiscalRegisterResponseToSaveDocumentProviderRequest, documentProviderEFR);
                }
                else if (request is GetNonFiscalDocumentDocumentProviderRequest)
                {
                    response = await DocumentProviderHelper.GetNonFiscalDocumentAsync(request as GetNonFiscalDocumentDocumentProviderRequest, documentProviderEFR).ConfigureAwait(false);
                }
                else
                {
                    throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
                }

                return response;
            }

            /// <summary>
            /// Gets the fiscal document document provider response.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="documentProviderEFR">The document provider.</param>
            /// <returns>The fiscal document document provider response.</returns>
            public static async Task<GetFiscalDocumentDocumentProviderResponse> GetFiscalDocumentAsync(GetFiscalDocumentDocumentProviderRequest request, IDocumentProviderEFR documentProviderEFR)
            {
                FiscalIntegrationEventType eventType = request.FiscalDocumentRetrievalCriteria.FiscalRegistrationEventType;
                IFiscalIntegrationDocument document = null;
                IDocumentBuilder builder = null;
                GetAdjustedSalesOrderFiscalIntegrationServiceResponse adjustedSalesOrderResponse = null;

                switch (eventType)
                {
                    case FiscalIntegrationEventType.CreateCustomerOrder:
                    case FiscalIntegrationEventType.EditCustomerOrder:
                    case FiscalIntegrationEventType.CancelCustomerOrder:
                    case FiscalIntegrationEventType.Sale:
                        FiscalIntegrationSalesOrderAdjustmentType adjustmentType = documentProviderEFR.GetSalesOrderAdjustmentType(request.SalesOrder);
                        SalesOrder adjustedSalesOrder = null;

                        if (adjustmentType != FiscalIntegrationSalesOrderAdjustmentType.None)
                        {
                            adjustedSalesOrderResponse = await request.SalesOrder.GetAdjustedSalesOrderAsync(request.RequestContext, adjustmentType).ConfigureAwait(false);
                        }

                        adjustedSalesOrder = adjustedSalesOrderResponse == null ? request.SalesOrder : adjustedSalesOrderResponse.SalesOrder;

                        if (IsSalesOrderFiscalizationRequired(adjustedSalesOrder))
                        {
                            builder = new SalesTransactionBuilder(request, adjustedSalesOrder);
                        }

                        break;
                    case FiscalIntegrationEventType.CustomerAccountDeposit:
                        builder = new CustomerAccountDepositTransactionBuilder(request, request.SalesOrder);
                        break;

                    case FiscalIntegrationEventType.CloseShift:
                        builder = new ZReportBuilder(request);
                        break;

                    default:
                        throw new NotSupportedException(string.Format("Fiscal integration event type '{0}' is not supported.", eventType));
                }

                if (builder != null)
                {
                    document = await builder.BuildAsync().ConfigureAwait(false);
                }

                FiscalIntegrationDocument fiscalIntegrationDocument = new FiscalIntegrationDocument(
                    FiscalDocumentSerializer.Serialize(document),
                    document == null ? FiscalIntegrationDocumentGenerationResultType.NotRequired : FiscalIntegrationDocumentGenerationResultType.Succeeded);
                await documentProviderEFR.FillDocumentAdjustmentAsync(request, fiscalIntegrationDocument).ConfigureAwait(false);

                return new GetFiscalDocumentDocumentProviderResponse(fiscalIntegrationDocument);
            }

            /// <summary>
            /// Checks if fiscalization is required for sales order.
            /// </summary>
            /// <param name="adjustedSalesOrder">The adjusted sales order.</param>
            /// <returns>True if fiscalization is required; otherwise, false.</returns>
            public static bool IsSalesOrderFiscalizationRequired(SalesOrder adjustedSalesOrder)
            {
                return adjustedSalesOrder.ActiveSalesLines.Any();
            }

            /// <summary>
            /// Gets the non-fiscal document document provider response.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="documentProviderEFR">The document provider.</param>
            /// <returns>The fiscal document document provider response.</returns>
            private static async Task<GetNonFiscalDocumentDocumentProviderResponse> GetNonFiscalDocumentAsync(GetNonFiscalDocumentDocumentProviderRequest request, IDocumentProviderEFR documentProviderEFR)
            {
                FiscalIntegrationEventType eventType = request.NonFiscalDocumentRetrievalCriteria.FiscalRegistrationEventType;
                IFiscalIntegrationDocument document = null;

                switch (eventType)
                {
                    case FiscalIntegrationEventType.OpenDrawer:
                    case FiscalIntegrationEventType.FloatEntry:
                    case FiscalIntegrationEventType.RemoveTender:
                    case FiscalIntegrationEventType.StartingAmount:
                    case FiscalIntegrationEventType.XReport:
                    case FiscalIntegrationEventType.ZReport:
                    case FiscalIntegrationEventType.AuditEvent:
                    case FiscalIntegrationEventType.PrintReceiptCopy:
                    case FiscalIntegrationEventType.CloseShift:
                    case FiscalIntegrationEventType.BankDrop:
                    case FiscalIntegrationEventType.SafeDrop:
                        document = await new NonFiscalTransactionBuilder(request).BuildAsync().ConfigureAwait(false);
                        break;
                    default:
                        throw new NotSupportedException(string.Format("Fiscal integration event type '{0}' is not supported.", eventType));
                }

                FiscalIntegrationDocument fiscalIntegrationDocument = new FiscalIntegrationDocument(
                    FiscalDocumentSerializer.Serialize(document),
                    document == null ? FiscalIntegrationDocumentGenerationResultType.NotRequired : FiscalIntegrationDocumentGenerationResultType.Succeeded);

                return new GetNonFiscalDocumentDocumentProviderResponse(fiscalIntegrationDocument);
            }

            /// <summary>
            /// Gets the supported registerable events document provider response.
            /// </summary>
            /// <param name="documentProviderEFR">The document provider.</param>
            /// <returns>The supported registerable events document provider response.</returns>
            private static GetSupportedRegistrableEventsDocumentProviderResponse GetSupportedRegisterableEvents(IDocumentProviderEFR documentProviderEFR)
            {
                return new GetSupportedRegistrableEventsDocumentProviderResponse(documentProviderEFR.SupportedRegistrableFiscalEventsId.ToList(), documentProviderEFR.SupportedRegistrableNonFiscalEventsId.ToList());
            }

            /// <summary>
            /// Gets the response from fiscal service to save.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The response.</returns>
            private static Response GetFiscalRegisterResponseToSave(GetFiscalRegisterResponseToSaveDocumentProviderRequest request, IDocumentProviderEFR documentProviderEFR)
            {
                ThrowIf.Null(request.FiscalRegistrationResult, nameof(request.FiscalRegistrationResult));

                if ((request.FiscalRegistrationResult.RegistrationStatus != FiscalIntegrationRegistrationStatus.Completed && string.IsNullOrWhiteSpace(request.FiscalRegistrationResult.Response))
                    || string.IsNullOrWhiteSpace(request.FiscalRegistrationResult.TransactionID))
                {
                    return new GetFiscalRegisterResponseToSaveDocumentProviderResponse(String.Empty);
                }

                return new GetFiscalRegisterResponseToSaveDocumentProviderResponse(documentProviderEFR.GetFiscalRegisterResponseToSave(request.FiscalRegistrationResult));
            }
        }
    }
}
