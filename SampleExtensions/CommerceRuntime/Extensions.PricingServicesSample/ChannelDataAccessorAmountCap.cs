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
    namespace Commerce.Runtime.Extensions.PricingServicesSample
    {
        using System.Collections.Generic;
        using System.Collections.ObjectModel;
        using System.Threading.Tasks;
        using Commerce.Runtime.Extensions.PricingDataServicesSample;
        using Commerce.Runtime.Extensions.PricingEngineSample;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine;

        /// <summary>
        /// Channel data accessor for amount cap.
        /// </summary>
        public class ChannelDataAccessorAmountCap : IDataAccessorAmountCap
        {
            private RequestContext requestContext;

            /// <summary>
            /// Initializes a new instance of the <see cref="ChannelDataAccessorAmountCap" /> class.
            /// </summary>
            /// <param name="requestContext">Commerce runtime request context.</param>
            public ChannelDataAccessorAmountCap(RequestContext requestContext)
            {
                this.requestContext = requestContext;
            }

            /// <summary>
            /// Gets discount amount caps by offer Ids.
            /// </summary>
            /// <param name="offerIds">Offer Ids.</param>
            /// <returns>The collection of discount amount caps of type ReadOnlyCollection&lt;DiscountAmountCap&gt;.</returns>
            public async Task<object> GetDiscountAmountCapsByOfferIdsAsync(object offerIds)
            {
                IEnumerable<string> offerIdSet = offerIds as IEnumerable<string>;
                using (SimpleProfiler profiler = new SimpleProfiler("GetDiscountAmountCapsByOfferIds", 1))
                {
                    return await this.ExecuteDataServiceAsync<DiscountAmountCap>(new EntityDataServiceRequest<IEnumerable<string>, DiscountAmountCap>(offerIdSet, QueryResultSettings.AllRecords)).ConfigureAwait(false);
                }
            }

            private async Task<ReadOnlyCollection<T>> ExecuteDataServiceAsync<T>(Request request) where T : CommerceEntity
            {
                var response = await this.requestContext.Runtime.ExecuteAsync<EntityDataServiceResponse<T>>(request, this.requestContext).ConfigureAwait(false);

                return response.PagedEntityCollection.Results;
            }
        }
    }
}