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
    namespace Commerce.Runtime.ReceiptsSample
    {
        using System;
        using System.Collections.Generic;
        using System.Text;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// The extended service to get custom X/Z report. This is a example of how to
        /// customize X/Z report by calling the <see cref="ReceiptService"/>.
        /// </summary>
        public class CustomReceiptService : IRequestHandlerAsync
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
                        typeof(GetReceiptServiceRequest),
                    };
                }
            }

            /// <summary>
            /// Executes the request to get customized x/z reports.
            /// </summary>
            /// <param name="request">The request to get receipts.</param>
            /// <returns>The response containing customized x/z reports.</returns>
            public async Task<Response> Execute(Request request)
            {
                if (request == null)
                {
                    return null;
                }

                // 1. First we need to get the original receipts.
                ReceiptService receiptService = new ReceiptService();
                GetReceiptServiceResponse originalReceiptsResponse = request.RequestContext.Runtime.Execute<GetReceiptServiceResponse>(request, request.RequestContext, receiptService, skipRequestTriggers: false);

                // 2. Find the X/Z report from the original receipts.
                foreach (Receipt receipt in originalReceiptsResponse.Receipts)
                {
                    if (receipt.ReceiptType == ReceiptType.XReport)
                    {
                        this.CustomizeXReport(receipt);
                    }
                    else if (receipt.ReceiptType == ReceiptType.ZReport)
                    {
                        this.CustomizeZReport(receipt);
                    }
                }

                return await Task.FromResult<Response>(originalReceiptsResponse);
            }

            /// <summary>
            /// Customizes the X report.
            /// </summary>
            /// <param name="report">The original X report.</param>
            private void CustomizeXReport(Receipt report)
            {
                // You can also customize the Body and Footer part in this way.
                StringBuilder newHeader = new StringBuilder(report.Header);

                newHeader.Append("Custom Field 1:.........................Custom Value.");

                report.Header = newHeader.ToString();
            }

            /// <summary>
            /// Customizes the Z report.
            /// </summary>
            /// <param name="report">The original Z report.</param>
            private void CustomizeZReport(Receipt report)
            {
                StringBuilder newFooter = new StringBuilder(report.Footer);

                newFooter.Append("Custom Field 1:.........................Custom Value.");

                report.Footer = newFooter.ToString();
            }
        }
    }
}