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
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Class that implements triggers for the <c>SaveCartVersionedDataRequest</c> request type.
        /// </summary>
        public class SaveCartVersionedDataTrigger : IRequestTriggerAsync
        {
            /// <summary>
            /// Gets the supported requests for this trigger.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[] 
                    {
                        typeof(SaveCartVersionedDataRequest)
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

                if (request.RequestContext.GetChannelConfiguration().CountryRegionISOCode != CountryRegionISOCode.NO)
                {
                    return;
                }

                if (request is SaveCartVersionedDataRequest saveCartVersionedDataRequest)
                {
                    SalesTransactionExtManager.SetSkipReportsExtPropForSalesLine(saveCartVersionedDataRequest.SalesTransaction, saveCartVersionedDataRequest.RequestContext);
                    SalesTransactionExtManager.SetPaymentAmountAdjustmentExtPropForTenderline(saveCartVersionedDataRequest.SalesTransaction, saveCartVersionedDataRequest.RequestContext);
                }

                // It's only stub to handle async signature 
                await Task.CompletedTask;
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