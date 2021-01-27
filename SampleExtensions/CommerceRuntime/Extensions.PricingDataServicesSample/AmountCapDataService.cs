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
    namespace Commerce.Runtime.Extensions.PricingDataServicesSample
    {
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Amount cap data service.
        /// </summary>
        public class AmountCapDataService : IRequestHandlerAsync
        {
            private const string DiscountLimitViewName = "CONTOSODISCOUNTAMOUNTCAPTABLEVIEW";

            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            /// <remarks>This covers common accessors shared by SQL and SQLite.</remarks>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(EntityDataServiceRequest<IEnumerable<string>, DiscountAmountCap>),
                    };
                }
            }

            /// <summary>
            /// Represents the entry point of the request handler.
            /// </summary>
            /// <param name="request">The incoming request message.</param>
            /// <returns>The outgoing response message.</returns>
            public async Task<Response> Execute(Request request)
            {
                if (request == null)
                {
                    throw new ArgumentNullException("request");
                }

                Type requestType = request.GetType();
                Response response;

                if (requestType == typeof(EntityDataServiceRequest<IEnumerable<string>, DiscountAmountCap>))
                {
                    var caps = new AmountCapDataManager(request.RequestContext).GetDiscountAmountCapsByOfferIds(((EntityDataServiceRequest<IEnumerable<string>, DiscountAmountCap>)request).RequestParameter);
                    response = new EntityDataServiceResponse<DiscountAmountCap>(caps);
                }
                else
                {
                    throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType().ToString()));
                }

                return await Task.FromResult(response);
            }
        }
    }
}