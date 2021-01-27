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
    namespace Commerce.Runtime.SalesTransactionSignatureNorway
    {
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Class that implements a pre/post trigger for the <c>CreateSalesOrderServiceRequest</c> request type.
        /// </summary>
        public class CreateSalesOrderServiceRequestTrigger : IRequestTriggerAsync
        {
            /// <summary>
            /// Gets the supported requests for this trigger.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[] { typeof(CreateSalesOrderServiceRequest) };
                }
            }

            /// <summary>
            /// Pre trigger code to fill fiscal transaction data.
            /// </summary>
            /// <param name="request">The request.</param>
            public async Task OnExecuting(Request request)
            {
                ThrowIf.Null(request, "request");

                if (request is CreateSalesOrderServiceRequest createSalesOrderServiceRequest)
                {
                    await this.SignTransactionAsync(createSalesOrderServiceRequest).ConfigureAwait(false);
                }
            }

            /// <summary>
            /// Post trigger code.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="response">The response.</param>
            public async Task OnExecuted(Request request, Response response)
            {
                // Left empty on purpose.
                // It's only stub to handle async signature 
                await Task.CompletedTask;
            }

            /// <summary>
            /// Signs transaction data.
            /// </summary>
            /// <param name="request">The request.</param>
            private async Task SignTransactionAsync(CreateSalesOrderServiceRequest request)
            {
                ThrowIf.Null(request.Transaction, "request.Transaction");
                ThrowIf.Null(request.RequestContext, "request.RequestContext");

                if (!SalesTransactionSigningStrategy.IsSigningRequired(request.Transaction))
                {
                    return;
                }

                var salesTransactionRegistrableEvent = new RegistrableEventSalesTransactionAdapterNorway(request.Transaction, request.RequestContext);
                var registerSequentialEventServiceRequest = new PerformSequentialEventRegistrationServiceRequest(salesTransactionRegistrableEvent);

                await request.RequestContext.ExecuteAsync<NullResponse>(registerSequentialEventServiceRequest).ConfigureAwait(false);
            }
        }
    }
}
