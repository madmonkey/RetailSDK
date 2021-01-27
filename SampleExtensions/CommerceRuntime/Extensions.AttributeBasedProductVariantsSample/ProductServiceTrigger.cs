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
        /// Class that implements a post trigger for the GetProductsServiceRequest request.
        /// </summary>
        public class ProductServiceTrigger : IRequestTriggerAsync
        {
            /// <summary>
            /// Gets the supported requests for this trigger.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[] { typeof(GetProductsServiceRequest) };
                }
            }

            /// <summary>
            /// Post trigger code to retrieve extension properties.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="response">The response.</param>
            public async Task OnExecuted(Request request, Response response)
            {
                var channelType = request.RequestContext.GetChannelConfiguration().ExtChannelType;
                bool channelAllowed = (channelType == ExtensibleRetailChannelType.OnlineStore || channelType == ExtensibleRetailChannelType.SharePointOnlineStore);

                if (!channelAllowed)
                {
                    return;
                }
                
                if (request is GetProductsServiceRequest)
                {
                    GetProductsServiceRequest req = (GetProductsServiceRequest)request;
                    GetProductsServiceResponse res = (GetProductsServiceResponse)response;
                    List<SimpleProduct> newProducts = new List<SimpleProduct>();

                    foreach (SimpleProduct product in res.Products)
                    {
                        ICollection<ProductDimension> dims = new List<ProductDimension>();
                        ICollection<ProductDimensionValue> dimValues = new List<ProductDimensionValue>();

                        var getProductsAttributeValuesServiceRequest = new GetAttributeValuesByProductIdsServiceRequest(req.ChannelId, 0, new List<long> { product.RecordId }, QueryResultSettings.AllRecords);
                        var getProductsAttributeValuesServiceResponse = await request.RequestContext.ExecuteAsync<GetAttributeValuesByProductIdsServiceResponse>(getProductsAttributeValuesServiceRequest).ConfigureAwait(false);

                        var prod = getProductsAttributeValuesServiceResponse.AttributeValuesPerProduct.First();

                        var skuDimensions = prod.Value?.Where(x => x.Name == AttributeNames.SKUAssociationDimensions).FirstOrDefault()?.TextValue?.Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries).Select(o => o.Trim()).ToList() ?? new List<string>();

                        if (prod.Value != null && prod.Value.Where(x => x.Name == AttributeNames.IsSpecialMasterSetUp).FirstOrDefault()?.TextValue == "Yes")
                        {
                            foreach (var attributeValue in prod.Value)
                            {
                                if (attributeValue.Name == AttributeNames.SKUAssociationSize && (attributeValue.TextValue?.Length ?? 0) > 0 && skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsSize))
                                {
                                    dims.Add(new ProductDimension { DimensionType = ProductDimensionType.Size, ProductId = product.RecordId, DimensionValue = null });
                                }

                                if (attributeValue.Name == AttributeNames.SKUAssociationColour && (attributeValue.TextValue?.Length ?? 0) > 0 && skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsColour))
                                {
                                    dims.Add(new ProductDimension { DimensionType = ProductDimensionType.Color, ProductId = product.RecordId, DimensionValue = null });
                                }

                                if (attributeValue.Name == AttributeNames.SKUAssociationStyle && (attributeValue.TextValue?.Length ?? 0) > 0 && skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsStyle))
                                {
                                    dims.Add(new ProductDimension { DimensionType = ProductDimensionType.Style, ProductId = product.RecordId, DimensionValue = null });
                                }

                                if (attributeValue.Name == AttributeNames.OnlineSize && (attributeValue.TextValue?.Length ?? 0) > 0 && skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsSize))
                                {
                                    dimValues.Add(new ProductDimensionValue { DimensionId = attributeValue.TextValue, DimensionType = ProductDimensionType.Size, Value = attributeValue.TextValue.Trim(), ProductId = product.RecordId, RecordId = attributeValue.RecordId });
                                }

                                if (attributeValue.Name == AttributeNames.OnlineColour && (attributeValue.TextValue?.Length ?? 0) > 0 && skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsColour)) 
                                {
                                    dimValues.Add(new ProductDimensionValue { DimensionId = attributeValue.TextValue, DimensionType = ProductDimensionType.Color, Value = attributeValue.TextValue.Trim(), ProductId = product.RecordId, RecordId = attributeValue.RecordId });
                                }

                                if (attributeValue.Name == AttributeNames.OnlineStyle && (attributeValue.TextValue?.Length ?? 0) > 0 && skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsStyle))
                                {
                                    dimValues.Add(new ProductDimensionValue { DimensionId = attributeValue.TextValue, DimensionType = ProductDimensionType.Style, Value = attributeValue.TextValue.Trim(), ProductId = product.RecordId, RecordId = attributeValue.RecordId });
                                }
                            }

                            foreach (var dim in dims)
                            {
                                dim.DimensionValue = dimValues.Where(x => x.DimensionType == dim.DimensionType).First();
                            }

                            product.Dimensions = dims;
                            newProducts.Add(product);
                        }
                        else
                        {
                            newProducts.Add(product);
                        }
                    }

                    response = new GetProductsServiceResponse(newProducts.AsPagedResult());
                }
                else if (request is GetVariantProductsServiceRequest)
                {
                    GetVariantProductsServiceRequest req = (GetVariantProductsServiceRequest)request;
                    GetProductsServiceResponse res = (GetProductsServiceResponse)response;

                    var getProductsAttributeValuesServiceRequest = new GetAttributeValuesByProductIdsServiceRequest(req.ChannelId, 0, new List<long> { req.MasterProductId }, QueryResultSettings.AllRecords);
                    var getProductsAttributeValuesServiceResponse = await req.RequestContext.ExecuteAsync<GetAttributeValuesByProductIdsServiceResponse>(getProductsAttributeValuesServiceRequest).ConfigureAwait(false);

                    var dims = new List<ProductDimensionValue>();
                    var resolvedVariant = new List<SimpleProduct>();

                    foreach (var prod in getProductsAttributeValuesServiceResponse.AttributeValuesPerProduct)
                    {
                        if (prod.Value != null && prod.Value.Where(x => x.Name == AttributeNames.IsSpecialMasterSetUp).FirstOrDefault()?.TextValue == "Yes")
                        {
                            var groupedItemIds = prod.Value.Where(x => x.Name == AttributeNames.SKUAssociationCodes).FirstOrDefault();

                            var skuDimensions = prod.Value.Where(x => x.Name == AttributeNames.SKUAssociationDimensions).FirstOrDefault()?.TextValue?.Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries).Select(o => o.Trim()).ToList() ?? new List<string>();

                            if ((groupedItemIds?.TextValue?.Length ?? 0) > 0)
                            {
                                var items = groupedItemIds.TextValue.Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries).Select(o => o.Trim()).ToList();

                                GetItemsDataRequest getItemsRequest = new GetItemsDataRequest(items.Select(i => i.Trim()).ToList())
                                {
                                    QueryResultSettings = new QueryResultSettings(new ColumnSet("ItemId", "PRODUCT"), PagingInfo.AllRecords)
                                };

                                var getItemsResponse = await req.RequestContext.ExecuteAsync<GetItemsDataResponse>(getItemsRequest).ConfigureAwait(false);

                                var productIds = getItemsResponse.Items.Select(i => i.Product);

                                var getattributes = new GetAttributeValuesByProductIdsServiceRequest(req.ChannelId, 0, productIds, QueryResultSettings.AllRecords, 0, 100);
                                var getattributesres = await req.RequestContext.ExecuteAsync<GetAttributeValuesByProductIdsServiceResponse>(getattributes).ConfigureAwait(false);

                                foreach (var variant in getattributesres.AttributeValuesPerProduct)
                                {
                                    string colorAttr = variant.Value.Where(a => a.Name == AttributeNames.OnlineColour).FirstOrDefault()?.TextValue ?? string.Empty;
                                    string sizeAttr = variant.Value.Where(a => a.Name == AttributeNames.OnlineSize).FirstOrDefault()?.TextValue ?? string.Empty;
                                    string styleAttr = variant.Value.Where(a => a.Name == AttributeNames.OnlineStyle).FirstOrDefault()?.TextValue ?? string.Empty;

                                    bool colorMatched = skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsColour) ? req.MatchingDimensionValues.Where(d => d.DimensionType == ProductDimensionType.Color && d.DimensionValue.Value == colorAttr).Any() : true;
                                    bool sizeMatched = skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsSize) ? req.MatchingDimensionValues.Where(d => d.DimensionType == ProductDimensionType.Size && d.DimensionValue.Value == sizeAttr).Any() : true; 
                                    bool styleMatched = skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsStyle) ? req.MatchingDimensionValues.Where(d => d.DimensionType == ProductDimensionType.Style && d.DimensionValue.Value == styleAttr).Any() : true; 

                                    if (colorMatched && sizeMatched && styleMatched)
                                    {
                                        GetProductsServiceRequest re = new GetProductsServiceRequest(req.ChannelId, new List<long> { variant.Key }, QueryResultSettings.AllRecords);
                                        var simpleProductResponse = await req.RequestContext.ExecuteAsync<GetProductsServiceResponse>(re).ConfigureAwait(false);
                                        var simpleProduct = simpleProductResponse.Products.First();
                                        simpleProduct.Dimensions = req.MatchingDimensionValues;
                                        resolvedVariant.Add(simpleProduct);
                                        response = new GetProductsServiceResponse(resolvedVariant.AsPagedResult());
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                
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