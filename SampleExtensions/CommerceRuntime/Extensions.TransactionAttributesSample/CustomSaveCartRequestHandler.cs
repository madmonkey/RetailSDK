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
        /// Handles custom workflow to save cart.
        /// </summary>
        public sealed class CustomSaveCartRequestHandler : SingleAsyncRequestHandler<SaveCartRequest>
        {
            /// <summary>
            /// Executes the custom workflow to save cart.
            /// </summary>
            /// <param name="request">Instance of <see cref="SaveCartRequest"/>.</param>
            /// <returns>Instance of <see cref="SaveCartResponse"/>.</returns>
            protected override async Task<Response> Process(SaveCartRequest request)
            {
                ThrowIf.Null(request, "request");

                // Update the transaction header attribute for customer order.
                if (request.Cart.CartType == CartType.CustomerOrder)
                {
                    CustomCartHelper.CreateUpdateTransactionHeaderAttribute(request.Cart, reserveNow: true, updateAttribute: false);
                }

                // Execute original handler logic.
                var requestHandler = new Microsoft.Dynamics.Commerce.Runtime.Workflow.SaveCartRequestHandler();
                var response = request.RequestContext.Runtime.Execute<SaveCartResponse>(request, request.RequestContext, requestHandler, skipRequestTriggers: false);

                return await Task.FromResult(response);
            }
        }
    }
}