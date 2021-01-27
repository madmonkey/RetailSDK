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
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Class that implements a pre/post trigger for the <c>CreateSalesOrderServiceRequest</c> request type.
        /// </summary>
        public class CreateSalesOrderServiceRequestHandler : SingleAsyncRequestHandler<CreateSalesOrderServiceRequest>
        {
            /// <summary>
            /// Executes the workflow to create sales order service response.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The response.</returns>
            protected override async Task<Response> Process(CreateSalesOrderServiceRequest request)
            {
                ThrowIf.Null(request, "request");

                var requestHandler = new Microsoft.Dynamics.Commerce.Runtime.Services.SalesOrderService();

                return (CreateSalesOrderServiceResponse)(await EventRegistrationProcessor.ProcessAsync(request.Transaction, requestHandler, request).ConfigureAwait(false));
            }
        }
    }
}
