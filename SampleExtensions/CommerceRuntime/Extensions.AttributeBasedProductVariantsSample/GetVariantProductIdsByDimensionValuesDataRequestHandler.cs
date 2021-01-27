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
        using System.Runtime.Caching;
        using System.Threading.Tasks;
        using AttributeBasedProductVariants;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.SqlServer;
        using Microsoft.Dynamics.Commerce.Runtime.Extensions;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// GetVariantProductIdsByDimensionValuesDataRequestHandler.
        /// </summary>
        public class GetVariantProductIdsByDimensionValuesDataRequestHandler : SingleAsyncRequestHandler<GetVariantProductIdsByDimensionValuesDataRequest>
        {
            private static ObjectCache ProductAttributeCache = MemoryCache.Default;
            private static readonly string defaultCacheItemExpirationInMinutes = "15";
            private static readonly string extAttributeCacheItemExpirationInMinutesKey = "ext.AttributeCacheItemExpirationInMinutes";

            private static async Task<SKUAttributes> GetSKUAttributesAsync(long productId, GetVariantProductIdsByDimensionValuesDataRequest request)
            {
                SKUAttributes response = new SKUAttributes();
                string cacheKey = $"citta-extension-attributes-{productId}";

                string cacheDuration = request.RequestContext.Runtime.Configuration.GetSettingValue(extAttributeCacheItemExpirationInMinutesKey);

                if(cacheDuration.IsNullOrEmpty())
                {
                    cacheDuration = defaultCacheItemExpirationInMinutes;
                }

                CacheItemPolicy cacheItemPolicy = new CacheItemPolicy { SlidingExpiration = TimeSpan.FromMinutes(Convert.ToDouble(cacheDuration)) };

                var cachedAttributes = ProductAttributeCache.Get(cacheKey);

                if (cachedAttributes == null)
                {
                    var getProductsAttributeValuesServiceRequest = new GetProductAttributeValuesServiceRequest(request.ChannelId, 0, productId, QueryResultSettings.AllRecords);
                    var getProductsAttributeValuesServiceResponse = await request.RequestContext.ExecuteAsync<GetProductAttributeValuesServiceResponse>(getProductsAttributeValuesServiceRequest).ConfigureAwait(false);

                    var attributes = getProductsAttributeValuesServiceResponse.AttributeValues.Results;

                    response.IsSpecialMaster = attributes.Where(x => x.Name == AttributeNames.IsSpecialMasterSetUp).FirstOrDefault()?.TextValue ?? string.Empty;

                    response.SKUAssociatonCodes = attributes.Where(x => x.Name == AttributeNames.SKUAssociationCodes).FirstOrDefault()?.TextValue ?? string.Empty;

                    response.SKUAssociationDimensions = attributes.Where(x => x.Name == AttributeNames.SKUAssociationDimensions).FirstOrDefault()?.TextValue ?? string.Empty;

                    response.OnlineColour = attributes.Where(a => a.Name == AttributeNames.OnlineColour).FirstOrDefault()?.TextValue ?? string.Empty;

                    response.OnlineSize = attributes.Where(a => a.Name == AttributeNames.OnlineSize).FirstOrDefault()?.TextValue ?? string.Empty;

                    response.OnlineStyle = attributes.Where(a => a.Name == AttributeNames.OnlineStyle).FirstOrDefault()?.TextValue ?? string.Empty;

                    ProductAttributeCache.Set(cacheKey, response, cacheItemPolicy);
                }
                else
                {
                    response = (SKUAttributes)cachedAttributes;
                }

                return response;
            }

            private static async Task<IEnumerable<long>> GetResolvedVariantAsync(SKUAttributes attributes, GetVariantProductIdsByDimensionValuesDataRequest request)
            {
                var resolvedVariant = new List<long>();

                if (attributes.IsSpecialMaster == "Yes")
                {
                    var skuDimensions = attributes.SKUAssociationDimensions.Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries).Select(o => o.Trim()).ToList() ?? new List<string>();

                    if (attributes.SKUAssociatonCodes.Length > 0)
                    {
                        var items = attributes.SKUAssociatonCodes.Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries).Select(o => o.Trim()).ToList();

                        GetItemsDataRequest getItemsRequest = new GetItemsDataRequest(items)
                        {
                            QueryResultSettings = new QueryResultSettings(new ColumnSet("ItemId", "PRODUCT"), PagingInfo.AllRecords)
                        };

                        var getItemsResponse = await request.RequestContext.ExecuteAsync<GetItemsDataResponse>(getItemsRequest).ConfigureAwait(false);

                        var productIds = getItemsResponse.Items.Select(i => i.Product);

                        foreach (var product in productIds)
                        {
                            SKUAttributes attr = await GetSKUAttributesAsync(product, request).ConfigureAwait(false);

                            bool colorMatched = skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsColour) ? request.MatchingDimensionValues.Where(d => d.DimensionType == ProductDimensionType.Color && d.DimensionValue.Value == attr.OnlineColour).Any() : true;
                            bool sizeMatched = skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsSize) ? request.MatchingDimensionValues.Where(d => d.DimensionType == ProductDimensionType.Size && d.DimensionValue.Value == attr.OnlineSize).Any() : true;
                            bool styleMatched = skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsStyle) ? request.MatchingDimensionValues.Where(d => d.DimensionType == ProductDimensionType.Style && d.DimensionValue.Value == attr.OnlineStyle).Any() : true;

                            if (colorMatched && sizeMatched && styleMatched)
                            {
                                resolvedVariant.Add(product);
                                break;
                            }
                        }
                    }
                }

                return resolvedVariant;
            }

            /// <summary>
            /// Executes the workflow to get product variant based on selected dimensions.
            /// </summary>
            /// <param name="request">the request.</param>
            /// <returns>the response.</returns>
            protected override async Task<Response> Process(GetVariantProductIdsByDimensionValuesDataRequest request)
            {
                ThrowIf.Null(request, nameof(request));

                ThrowIf.Null(request.RequestContext, nameof(request.RequestContext));

                if (request.ChannelId < 0)
                {
                    throw new DataValidationException(DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_InvalidRequest, "Channel identifier cannot be less than zero.");
                }

                var channelType = request.RequestContext.GetChannelConfiguration().ExtChannelType;
                bool channelAllowed = (channelType == ExtensibleRetailChannelType.OnlineStore || channelType == ExtensibleRetailChannelType.SharePointOnlineStore);

                if (!channelAllowed)
                {
                    var originalHandler = new ProductDimensionSqlServerDataService();
                    var response = originalHandler.Execute(request);
                    return (GetProductIdsDataResponse)response;
                }

                var dims = new List<ProductDimensionValue>();

                SKUAttributes attributes = await GetSKUAttributesAsync(request.MasterProductId, request).ConfigureAwait(false);

                var resolvedVariant = await GetResolvedVariantAsync(attributes, request).ConfigureAwait(false);

                return new GetProductIdsDataResponse(resolvedVariant.AsReadOnly());
            }
        }
    }
}
