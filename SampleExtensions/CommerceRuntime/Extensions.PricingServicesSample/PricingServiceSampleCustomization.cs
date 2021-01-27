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
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Commerce.Runtime.Extensions.PricingEngineSample;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using PE = Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine;

        /// <summary>
        /// Sample customization of pricing service.
        /// </summary>
        public class PricingServiceSampleCustomization : IRequestHandlerAsync
        {
            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(CalculatePricesServiceRequest),
                        typeof(CalculateDiscountsServiceRequest),
                        typeof(GetIndependentPriceDiscountServiceRequest)
                    };
                }
            }

            /// <summary>
            /// Implements customized solutions for pricing services.
            /// </summary>
            /// <param name="request">The request object.</param>
            /// <returns>The response object.</returns>
            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");

                using (new PE.PricingEngineExtensionContext())
                {
                    // Register customized components here.
                    PricingEngineExtensionRegister.RegisterPricingEngineExtensions();

                    PE.IDiscountPackage package = new DiscountPackageAmountCap(new ChannelDataAccessorAmountCap(request.RequestContext));
                    PE.PricingEngineExtensionRepository.RegisterDiscountPackage(package);

                    Type requestType = request.GetType();
                    using (var profiler = new PE.SimpleProfiler(requestType.Name, true, 0))
                    {
                        Response response;
                        if (requestType == typeof(CalculatePricesServiceRequest))
                        {
                            response = await CalculatePricesAsync((CalculatePricesServiceRequest)request).ConfigureAwait(false);
                        }
                        else if (requestType == typeof(CalculateDiscountsServiceRequest))
                        {
                            response = await CalculateDiscountAsync((CalculateDiscountsServiceRequest)request).ConfigureAwait(false);
                        }
                        else if (requestType == typeof(GetIndependentPriceDiscountServiceRequest))
                        {
                            response = await CalculateIndependentPriceAndDiscountAsync((GetIndependentPriceDiscountServiceRequest)request).ConfigureAwait(false);
                        }
                        else
                        {
                            throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
                        }

                        return response;
                    }
                }
            }

            private static async Task<GetPriceServiceResponse> CalculatePricesAsync(CalculatePricesServiceRequest request)
            {
                PE.CommerceRuntimePriceAndDiscount.CalculatePrices(
                    request.RequestContext,
                    new PricingDataServiceManager(request.RequestContext),
                    new ChannelCurrencyOperations(request.RequestContext),
                    request.Transaction,
                    await GetCustomerAsync(request.RequestContext, request.Transaction.CustomerId).ConfigureAwait(false),
                    request.PricingCalculationMode,
                    request.DateWhenActive.HasValue ? request.DateWhenActive.Value : request.RequestContext.GetNowInChannelTimeZone());

                return new GetPriceServiceResponse(request.Transaction);
            }

            private static async Task<GetPriceServiceResponse> CalculateDiscountAsync(CalculateDiscountsServiceRequest request)
            {
                ChannelConfiguration channelConfiguration = request.RequestContext.GetChannelConfiguration();
                Customer customer = await GetCustomerAsync(request.RequestContext, request.Transaction.CustomerId).ConfigureAwait(false);

                PE.PricingEngine.CalculateDiscountsForLines(
                    new PricingDataServiceManager(request.RequestContext),
                    request.Transaction,
                    new ChannelCurrencyOperations(request.RequestContext),
                    channelConfiguration.Currency,
                    customer.LineDiscountGroup,
                    customer.MultilineDiscountGroup,
                    customer.TotalDiscountGroup,
                    true,
                    request.CalculateSimpleDiscountOnly,
                    request.RequestContext.GetNowInChannelTimeZone());

                request.Transaction.IsDiscountFullyCalculated = !request.CalculateSimpleDiscountOnly;

                return new GetPriceServiceResponse(request.Transaction);
            }

            private static async Task<GetPriceServiceResponse> CalculateIndependentPriceAndDiscountAsync(GetIndependentPriceDiscountServiceRequest request)
            {
                ThrowIf.Null(request, "request");
                ThrowIf.Null(request.RequestContext, "request.RequestContext");
                ThrowIf.Null(request.Transaction, "request.Transaction");

                PE.CommerceRuntimePriceAndDiscount.CalculateIndependentPriceAndDiscount(
                    request.Transaction,
                    request.RequestContext,
                    new PricingDataServiceManager(request.RequestContext),
                    new ChannelCurrencyOperations(request.RequestContext),
                    await GetCustomerAsync(request.RequestContext, request.Transaction.CustomerId).ConfigureAwait(false),
                    request.CalculateForNewSalesLinesOnly,
                    request.NewSalesLineIdSet);

                return new GetPriceServiceResponse(request.Transaction);
            }

            private static async Task<Customer> GetCustomerAsync(RequestContext context, string customerAccount)
            {
                Customer customer = null;
                if (!string.IsNullOrWhiteSpace(customerAccount))
                {
                    var getCustomerDataRequest = new GetCustomerDataRequest(customerAccount);
                    SingleEntityDataServiceResponse<Customer> getCustomerDataResponse = await context.ExecuteAsync<SingleEntityDataServiceResponse<Customer>>(getCustomerDataRequest).ConfigureAwait(false);
                    customer = getCustomerDataResponse.Entity;
                }

                return customer ?? (new Customer());
            }
        }
    }
}