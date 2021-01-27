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
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Handles custom workflow to resume suspended cart.
        /// </summary>
        public sealed class CustomResumeCartRequestHandler : SingleAsyncRequestHandler<ResumeCartRequest>
        {
            /// <summary>
            /// Executes the custom workflow to resume suspended cart.
            /// </summary>
            /// <param name="request">Instance of <see cref="ResumeCartRequest"/>.</param>
            /// <returns>Instance of <see cref="ResumeCartResponse"/>.</returns>
            protected override async Task<Response> Process(ResumeCartRequest request)
            {
                ThrowIf.Null(request, "request");

                // Execute original handler logic.
                var requestHandler = new Microsoft.Dynamics.Commerce.Runtime.Workflow.ResumeCartRequestHandler();
                var originalResponse = request.RequestContext.Runtime.Execute<ResumeCartResponse>(request, request.RequestContext, requestHandler, skipRequestTriggers: false);
                Cart cart = originalResponse.Cart;

                // Update the transaction header attribute for customer order.
                if (originalResponse.Cart.CartType == CartType.CustomerOrder)
                {
                    bool cartUpdated = CustomCartHelper.CreateUpdateTransactionHeaderAttribute(cart, reserveNow: true, updateAttribute: true);
                    if (cartUpdated)
                    {
                        // Save the cart after updating the header attribute.
                        var saveCartRequest = new SaveCartRequest(cart);
                        var saveCartResponse = await request.RequestContext.ExecuteAsync<SaveCartResponse>(saveCartRequest).ConfigureAwait(false);

                        // Update the cart after saving it.
                        cart = saveCartResponse.Cart;
                    }
                }

                return new ResumeCartResponse(cart);
            }
        }
    }
}