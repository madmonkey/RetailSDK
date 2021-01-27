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
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Text;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Class that implements a post trigger for the GetProductSearchRefinersRequest and GetProductSearchRefinerValuesRequest reuests.
        /// </summary>
        public class ProductSearchHandlerTrigger : IRequestTriggerAsync
        {
            /// <summary>
            /// Gets the supported requests for this trigger.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[] { typeof(SearchProductsRequest), typeof(GetProductSearchRefinersRequest) };
                }
            }

            /// <summary>
            /// Post trigger code to handle refiners.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="response">The response.</param>
            public async Task OnExecuted(Request request, Response response)
            {
                if (request is GetProductSearchRefinersRequest)
                {
                    var channelType = request.RequestContext.GetChannelConfiguration().ExtChannelType;
                    bool channelAllowed = (channelType == ExtensibleRetailChannelType.OnlineStore || channelType == ExtensibleRetailChannelType.SharePointOnlineStore);

                    if (!channelAllowed)
                    {
                        return;
                    }

                    var refiners = (EntityDataServiceResponse<ProductRefiner>)response;
                    var newRefiners = new List<ProductRefiner>();
                    var names = new List<string> { AttributeNames.SKUAssociationSize, AttributeNames.SKUAssociationColour };
                    foreach (var refiner in refiners)
                    {
                        if (!names.Contains(refiner.KeyName))
                        {
                            newRefiners.Add(refiner);
                            continue;
                        }
                        
                        var dict = new Dictionary<string, Dictionary<string, int>>();

                        foreach (var value in refiner.Values)
                        {
                            var tokens = value.LeftValueBoundString.Split('|').Select(x => x.Trim()).ToList();
                            foreach (var token in tokens)
                            {
                                Dictionary<string, int> val;
                                if (dict.TryGetValue(refiner.KeyName, out val))
                                {
                                    if (val.ContainsKey(token))
                                    {
                                        val[token] += 1;
                                    }
                                    else
                                    {
                                        val[token] = 1;
                                    }
                                }
                                else
                                {
                                    var dictVal = new Dictionary<string, int>
                                    {
                                        { token, 1 }
                                    };
                                    dict.Add(refiner.KeyName, dictVal);
                                }
                            }
                        }

                        if (refiner.Values.Count() > 0 && dict.ContainsKey(refiner.KeyName))
                        {
                            var refinerValues = dict[refiner.KeyName];
                            refiner.Values = refinerValues.Select(x => new ProductRefinerValue
                            {
                                RefinerSource = refiner.Source,
                                LeftValueBoundString = x.Key,
                                RightValueBoundString = x.Key,
                                Count = x.Value,
                                RefinerRecordId = refiner.RecordId
                            }).ToList();
                            newRefiners.Add(refiner);
                        }
                        else if (refiner.Values.Count() > 0)
                        {
                            newRefiners.Add(refiner);
                        }                        
                    }
                    
                    response = new EntityDataServiceResponse<ProductRefiner>(newRefiners.AsPagedResult());
                }

                // It's only stub to handle async signature
                await Task.CompletedTask;
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