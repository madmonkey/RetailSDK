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
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.SqlServer;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// GetProductDimensionValuesDataRequestHandler
        /// </summary>
        public class GetProductDimensionValuesDataRequestHandler : SingleAsyncRequestHandler<GetProductDimensionValuesDataRequest>
        {
            /// <summary>
            /// Executes the workflow to get product dimensions.
            /// </summary>
            /// <param name="request">the request.</param>
            /// <returns>the response.</returns>
            protected override async Task<Response> Process(GetProductDimensionValuesDataRequest request)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(request.QueryResultSettings, "request.QueryResultSettings");
                ThrowIf.Null(request.RequestContext, nameof(request.RequestContext));

                if (request.ChannelId < 0)
                {
                    throw new DataValidationException(DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_InvalidRequest, "Channel identifier cannot be less than zero.");
                }

                if (request.RequestedDimension == ProductDimensionType.None)
                {
                    throw new DataValidationException(DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_InvalidRequest, "Requested dimension to retrieve cannot be none. Please select a valid dimension to retrieve.");
                }

                var getProductsAttributeValuesServiceRequest = new GetAttributeValuesByProductIdsServiceRequest(request.ChannelId, 0, new List<long> { request.MasterProductId }, QueryResultSettings.AllRecords);
                var getProductsAttributeValuesServiceResponse = await request.RequestContext.ExecuteAsync<GetAttributeValuesByProductIdsServiceResponse>(getProductsAttributeValuesServiceRequest).ConfigureAwait(false);

                var dims = new List<ProductDimensionValue>();

                var channelType = request.RequestContext.GetChannelConfiguration().ExtChannelType;
                bool channelAllowed = (channelType == ExtensibleRetailChannelType.OnlineStore || channelType == ExtensibleRetailChannelType.SharePointOnlineStore);

                foreach (var product in getProductsAttributeValuesServiceResponse.AttributeValuesPerProduct)
                {
                    if (product.Value != null && product.Value.Where(x => x.Name == AttributeNames.IsSpecialMasterSetUp).FirstOrDefault()?.TextValue == "Yes" && channelAllowed)
                    {
                        var skuDimensions = product.Value.Where(x => x.Name == AttributeNames.SKUAssociationDimensions).FirstOrDefault()?.TextValue?.Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries).Select(o => o.Trim()).ToList() ?? new List<string>();

                        foreach (var attributeValue in product.Value)
                        {
                            if (attributeValue.Name == AttributeNames.SKUAssociationSize && (attributeValue.TextValue?.Length ?? 0) > 0 && request.RequestedDimension == ProductDimensionType.Size && skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsSize))
                            {
                                var sizes = attributeValue.TextValue
                                    .Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries)
                                    .Select(o => o.Trim())
                                    .ToList();

                                int i = 1;
                                foreach (var size in sizes)
                                {
                                    long recid = Convert.ToInt64($"{attributeValue.RecordId}{i}");
                                    dims.Add(
                                        new ProductDimensionValue
                                        {
                                            DimensionId = size,
                                            DimensionType = ProductDimensionType.Size,
                                            Value = size,
                                            ProductId = request.MasterProductId, RecordId = recid
                                        }
                                        );
                                    i++;
                                }
                            }

                            if (attributeValue.Name == AttributeNames.SKUAssociationColour && (attributeValue.TextValue?.Length ?? 0) > 0 && request.RequestedDimension == ProductDimensionType.Color && skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsColour))
                            {
                                var colors = attributeValue.TextValue
                                    .Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries)
                                    .Select(o => o.Trim())
                                    .ToList();

                                int i = 1;
                                foreach (var color in colors)
                                {
                                    long recid = Convert.ToInt64($"{attributeValue.RecordId}{i}");
                                    dims.Add(
                                        new ProductDimensionValue
                                        {
                                            DimensionId = color,
                                            DimensionType = ProductDimensionType.Color,
                                            Value = color,
                                            ProductId = request.MasterProductId,
                                            RecordId = recid
                                        }
                                        );
                                    i++;
                                }
                            }

                            if (attributeValue.Name == AttributeNames.SKUAssociationStyle && (attributeValue.TextValue?.Length ?? 0) > 0 && request.RequestedDimension == ProductDimensionType.Style && skuDimensions.Contains(AttributeNames.SKUAssociationDimensionsStyle))
                            {
                                var styles = attributeValue.TextValue
                                    .Split(new[] { '|' }, StringSplitOptions.RemoveEmptyEntries)
                                    .Select(o => o.Trim())
                                    .ToList();

                                int i = 1;
                                foreach (var style in styles)
                                {
                                    long recid = Convert.ToInt64($"{attributeValue.RecordId}{i}");
                                    dims.Add(
                                        new ProductDimensionValue
                                        {
                                            DimensionId = style,
                                            DimensionType = ProductDimensionType.Style,
                                            Value = style,
                                            ProductId = request.MasterProductId,
                                            RecordId = recid
                                        }
                                        );
                                    i++;
                                }
                            }
                        }
                    }
                    else
                    {
                        var originalHandler = new ProductDimensionSqlServerDataService();
                        var response = originalHandler.Execute(request);
                        return (EntityDataServiceResponse<ProductDimensionValue>)response;
                    }
                }

                return new EntityDataServiceResponse<ProductDimensionValue>(dims.AsPagedResult());
            }
        }
    }
}
