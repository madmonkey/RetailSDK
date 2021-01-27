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
    namespace Commerce.Runtime.AttributeBasedProductVariantsSample
    {
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;

        /// <summary>
        /// ProductSearchAzureServiceTrigger.
        /// </summary>
        public class GetProductSearchResultsServiceRequestHandler : IRequestTriggerAsync
        {
            /// <summary>
            /// Gets the supported requests for this trigger.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new Type[]
                    {
                        typeof(GetProductSearchResultsServiceRequest),
                        typeof(GetProductSearchSuggestionsServiceRequest),
                        typeof(GetProductSearchRefinersServiceRequest),
                    };
                }
            }

            /// <summary>
            /// Pre trigger code.
            /// </summary>
            /// <param name="request">The request.</param>
            public async Task OnExecuting(Request request)
            {
                var attributeRequest = new GetChannelProductAttributesByChannelIdDataRequest(request.RequestContext.GetChannel().RecordId, new QueryResultSettings(PagingInfo.AllRecords));
                var attributeResponse = await request.RequestContext.ExecuteAsync<EntityDataServiceResponse<AttributeProduct>>(attributeRequest).ConfigureAwait(false);

                long onlineVisibilityRecId = attributeResponse.Where(x => x.Name == AttributeNames.OnlineVisibility).FirstOrDefault()?.Attribute ?? 0;

                var channelType = request.RequestContext.GetChannelConfiguration().ExtChannelType;
                bool channelAllowed = (channelType == ExtensibleRetailChannelType.OnlineStore || channelType == ExtensibleRetailChannelType.SharePointOnlineStore);

                if (channelAllowed && onlineVisibilityRecId != 0)
                {
                    if (request is GetProductSearchResultsServiceRequest)
                    {
                        GetProductSearchResultsServiceRequest req = (GetProductSearchResultsServiceRequest)request;

                        var refiners = new List<ProductRefinerValue>();

                        foreach (var refiner in req.SearchCriteria.Refinement)
                        {
                            refiners.Add(refiner);
                        }

                        AddOnlineVisibilityFilter(ref refiners, onlineVisibilityRecId);

                        req.SearchCriteria.Refinement = refiners;

                    }
                    else if (request is GetProductSearchSuggestionsServiceRequest)
                    {
                        GetProductSearchSuggestionsServiceRequest req = (GetProductSearchSuggestionsServiceRequest)request;

                        var refiners = new List<ProductRefinerValue>();

                        foreach (var refiner in req.SearchSuggestionCriteria.ProductSearchCriteria.Refinement)
                        {
                            refiners.Add(refiner);
                        }

                        AddOnlineVisibilityFilter(ref refiners, onlineVisibilityRecId);

                        req.SearchSuggestionCriteria.ProductSearchCriteria.Refinement = refiners;
                    }
                    else if (request is GetProductSearchRefinersServiceRequest)
                    {
                        GetProductSearchRefinersServiceRequest req = (GetProductSearchRefinersServiceRequest)request;

                        var refiners = new List<ProductRefinerValue>();

                        foreach (var refiner in req.SearchCriteria.Refinement)
                        {
                            refiners.Add(refiner);
                        }

                        AddOnlineVisibilityFilter(ref refiners, onlineVisibilityRecId);

                        req.SearchCriteria.Refinement = refiners;
                    }
                }
            }

            /// <summary>
            /// Post request trigger
            /// </summary>
            /// <param name="request">request</param>
            /// <param name="response">response</param>
            public async Task OnExecuted(Request request, Response response)
            {
                // It's only stub to handle async signature 
                await Task.CompletedTask;
            }

            private void AddOnlineVisibilityFilter(ref List<ProductRefinerValue> refiners, long onlineVisibilityRecId)
            {
                if (!refiners.Where(x => x.RefinerRecordId == onlineVisibilityRecId).Any())
                {
                    refiners.Add(new ProductRefinerValue
                    {
                        RefinerSource = ProductRefinerSource.Attribute,
                        LeftValueBoundString = "1",
                        RightValueBoundString = "yes",
                        RefinerRecordId = onlineVisibilityRecId,
                        ExtDataType = ExtensibleAttributeDataType.Boolean
                    });
                }
            }
        }

    }
}
