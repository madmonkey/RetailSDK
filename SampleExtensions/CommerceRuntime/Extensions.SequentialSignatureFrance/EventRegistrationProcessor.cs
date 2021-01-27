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
    namespace Commerce.Runtime.SequentialSignatureFrance
    {
        using System.Threading.Tasks;
        using System.Transactions;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Incapsulates event registration process.
        /// </summary>
        public static class EventRegistrationProcessor
        {
            /// <summary>
            /// Performs sequential fiscal registration.
            /// </summary>
            /// <param name="entity">Commerce entity.</param>
            /// <param name="originalRequestHandler">The original handler.</param>
            /// <param name="originalRequest">The original request.</param>
            /// <returns>The response.</returns>
            public static async Task<Response> ProcessAsync(CommerceEntity entity, IRequestHandler originalRequestHandler, Request originalRequest)
            {
                ThrowIf.Null(entity, "entity");
                ThrowIf.Null(originalRequestHandler, "originalRequestHandler");
                ThrowIf.Null(originalRequest, "originalRequest");

                Response response = new NullResponse();
                RequestContext requestContext = originalRequest.RequestContext;

                IRegistrableSequentialEvent registrableEvent = RegistrableEventFactory.Create(entity, requestContext);

                bool isRegistrationRequired = registrableEvent.IsRegistrationRequired();
                bool isRegistrationAvailable = registrableEvent.IsRegistrationAvailable();

                if (isRegistrationRequired && !isRegistrationAvailable)
                {
                    registrableEvent.HandleNotAvailableSignatureData();
                }
                else
                {
                    if (isRegistrationRequired && isRegistrationAvailable)
                    {
                        await SignRegistrableEventAsync(registrableEvent, requestContext).ConfigureAwait(false);
                    }

                    using (var databaseContext = new DatabaseContext(originalRequest.RequestContext))
                    using (var transactionScope = CreateReadCommittedTransactionScope())
                    {
                        // Execute original logic.
                        response = originalRequest.RequestContext.Runtime.Execute<Response>(originalRequest, requestContext, originalRequestHandler, false);

                        if (isRegistrationRequired && isRegistrationAvailable)
                        {
                            await SaveSignatureAsync(registrableEvent).ConfigureAwait(false);
                        }

                        transactionScope.Complete();
                    }
                }

                return response;
            }

            /// <summary>
            /// Creates a transaction scope with ReadCommitted isolation.
            /// </summary>
            /// <returns>The transaction scope.</returns>
            private static TransactionScope CreateReadCommittedTransactionScope()
            {
                var options = new TransactionOptions()
                {
                    IsolationLevel = IsolationLevel.ReadCommitted
                };

                return new TransactionScope(TransactionScopeOption.Required, options, TransactionScopeAsyncFlowOption.Enabled);
            }

            /// <summary>
            /// Signs registrable event.
            /// </summary>
            /// <param name="registrableEvent">Registrable event.</param>
            /// <param name="requestContext">Request context.</param>
            private static async Task SignRegistrableEventAsync(IRegistrableSequentialEvent registrableEvent, RequestContext requestContext)
            {
                var registerSequentialEventServiceRequest = new PerformSequentialEventRegistrationServiceRequest(registrableEvent);

                await requestContext.ExecuteAsync<NullResponse>(registerSequentialEventServiceRequest).ConfigureAwait(false);
            }

            /// <summary>
            /// Saves signature from transaction data.
            /// </summary>
            /// <param name="registrableEvent">Registrable event.</param>
            private static async Task SaveSignatureAsync(IRegistrableSequentialEvent registrableEvent)
            {
                await registrableEvent.PersistRegisterResponseAsync().ConfigureAwait(false);
            }
        }
    }
}
