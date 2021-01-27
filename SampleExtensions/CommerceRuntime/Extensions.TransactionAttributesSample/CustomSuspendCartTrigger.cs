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
    namespace Commerce.Runtime.TransactionAttributesSample
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Class that implements a pre trigger for the <c>SuspendCartRequest</c> request type.
        /// </summary>
        public class CustomSuspendCartTrigger : IRequestTriggerAsync
        {
            /// <summary>
            /// Gets the list of supported request types.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(SuspendCartRequest)
                    };
                }
            }

            /// <summary>
            /// Pre trigger code.
            /// </summary>
            /// <param name="request">The request.</param>
            public async Task OnExecuting(Request request)
            {
                ThrowIf.Null(request, "request");
                Type requestedType = request.GetType();

                if (requestedType == typeof(SuspendCartRequest))
                {
                    SuspendCartRequest suspendCartRequest = request as SuspendCartRequest;

                    // Get the cart.
                    var getCartServiceRequest = new GetCartServiceRequest(new CartSearchCriteria(suspendCartRequest.CartId), QueryResultSettings.SingleRecord);
                    var cartResponse = await request.RequestContext.ExecuteAsync<GetCartServiceResponse>(getCartServiceRequest).ConfigureAwait(false);
                    Cart cart = cartResponse.Carts.Single();

                    // Update the transaction header attribute for customer order.
                    if (cart.CartType == CartType.CustomerOrder)
                    {
                        bool cartUpdated = CustomCartHelper.CreateUpdateTransactionHeaderAttribute(cart, reserveNow: false, updateAttribute: true);
                        if (cartUpdated)
                        {
                            // Save the cart after updating the header attribute.
                            var saveCartRequest = new SaveCartRequest(cart);
                            await request.RequestContext.ExecuteAsync<SaveCartResponse>(saveCartRequest).ConfigureAwait(false);
                        }
                    }
                }
            }

            /// <summary>
            /// Post trigger code.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="response">The response.</param>
            public async Task OnExecuted(Request request, Response response)
            {
                // It's only stub to handle async signature 
                await Task.CompletedTask;
            }
        }
    }
}