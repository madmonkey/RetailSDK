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
    namespace Commerce.Runtime.NonTransactionalLoyaltyPointsSample
    {
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Class that implements a post trigger for the IssueLoyaltyCardServiceRequest request type.
        /// </summary>
        public class NonTransactionalLoyaltyPointsAsyncTriggers : IRequestTriggerAsync
        {
            private const string nonTransactionalActivityTypeId = "000003";
            private const long affiliationId = 5637144576;

            /// <summary>
            /// Gets the supported requests for this trigger.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[] { typeof(IssueLoyaltyCardServiceRequest) };
                }
            }

            /// <summary>
            /// Post trigger code to post loyalty reward points for non-transactional activity.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="response">The response.</param>
            public async Task OnExecuted(Request request, Response response)
            {
                var issueLoyaltyCardRequest = (IssueLoyaltyCardServiceRequest)request;

                var postLoyaltyRewardPointsNonTransactionalActivityServiceRequest = new PostLoyaltyRewardPointsNonTransactionalActivityServiceRequest(issueLoyaltyCardRequest.LoyaltyCardNumber, issueLoyaltyCardRequest.ChannelId, affiliationId, nonTransactionalActivityTypeId);

                await request.RequestContext.ExecuteAsync<NullResponse>(postLoyaltyRewardPointsNonTransactionalActivityServiceRequest).ConfigureAwait(false);
            }

            /// <summary>
            /// Pre trigger code.
            /// </summary>
            /// <param name="request">The request.</param>
            public async Task OnExecuting(Request request)
            {
                // It's only stub to handle async signature 
                await Task.CompletedTask;
            }
        }
    }
}