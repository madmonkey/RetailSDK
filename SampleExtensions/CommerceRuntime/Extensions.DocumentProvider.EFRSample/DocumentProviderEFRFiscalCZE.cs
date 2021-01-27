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
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Handlers;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// The document provider for EFSTA (European Fiscal Standards Association) Fiscal Register (version 1.8.6) specific for Czech Republic.
        /// </summary>
        public class DocumentProviderEFRFiscalCZE : INamedRequestHandlerAsync, IDocumentProviderEFR
        {
            /// <summary>
            /// Gets the unique name for this request handler.
            /// </summary>
            public string HandlerName => "FiscalEFRSampleCZE";

            /// <summary>
            /// Gets the supported fiscal integration event type.
            /// </summary>
            public IEnumerable<int> SupportedRegistrableFiscalEventsId => new[]
            {
                (int)FiscalIntegrationEventType.Sale,
                (int)FiscalIntegrationEventType.CreateCustomerOrder,
                (int)FiscalIntegrationEventType.EditCustomerOrder,
                (int)FiscalIntegrationEventType.CancelCustomerOrder,
                (int)FiscalIntegrationEventType.CustomerAccountDeposit,
            };

            /// <summary>
            /// Gets the supported non-fiscal integration event type.
            /// </summary>
            public IEnumerable<int> SupportedRegistrableNonFiscalEventsId => new int[]
            {
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
            public async Task<Response> Execute(Request request)
            {
                return await DocumentProviderHelper.ExecuteAsync(request, this).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets sales order adjustment type.
            /// </summary>
            /// <param name="salesOrder">The sales order.</param>
            /// <returns>The sales order adjustment type.</returns>
            public FiscalIntegrationSalesOrderAdjustmentType GetSalesOrderAdjustmentType(SalesOrder salesOrder)
            {
                return FiscalIntegrationSalesOrderAdjustmentType.None;
            }

            /// <summary>
            /// Fills document adjustment.
            /// </summary>
            /// <param name="request">The get fiscal document request.</param>
            /// <param name="fiscalIntegrationDocument">The fiscal integration document.</param>
            public async Task FillDocumentAdjustmentAsync(GetFiscalDocumentDocumentProviderRequest request, FiscalIntegrationDocument fiscalIntegrationDocument)
            {
                // Left empty on purpose.
                // It's only stub to handle async signature 
                await Task.CompletedTask;
            }

            /// <summary>
            /// Gets the fiscal registration result string.
            /// </summary>
            /// <param name="fiscalIntegrationRegistrationResult">The fiscal integration registration result.</param>
            /// <returns>The fiscal registration result string.</returns>
            public string GetFiscalRegisterResponseToSave(FiscalIntegrationRegistrationResult fiscalIntegrationRegistrationResult)
            {
                return fiscalIntegrationRegistrationResult.GetFiscalResponseStringCZ();
            }
        }
    }
}
