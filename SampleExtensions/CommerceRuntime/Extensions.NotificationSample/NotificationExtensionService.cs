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
    namespace Commerce.Runtime.NotificationSample
    {
        using System;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Service class responsible executing the service requests.
        /// </summary>
        public class NotificationExtensionService : SingleAsyncRequestHandler<GetNotificationsExtensionServiceRequest>
        {
            /// <summary>
            /// The handler for the <c>GetNotificationsExtensionServiceRequest</c> request.
            /// </summary>
            /// <param name="request">The request with the operation.</param>
            /// <returns>The notification details for the operation.</returns>
            protected override async Task<Response> Process(GetNotificationsExtensionServiceRequest request)
            {
                ThrowIf.Null(request, "request");

                NotificationDetailCollection details = new NotificationDetailCollection();
                DateTimeOffset lastNotificationDateTime = DateTimeOffset.Now;

                // do the actual work here
                if (request.SubscribedOperation == RetailOperation.AddCoupons)
                {
                    NotificationDetail detail = new NotificationDetail()
                    {
                        // Text which will display for the notification detail in the POS notification center
                        DisplayText = "Add coupon",

                        // Number of notifications found
                        ItemCount = 3,

                        // Timestamp of creation of latest notification item (Used to determine whether notification is new)
                        LastUpdatedDateTime = lastNotificationDateTime,

                        // Boolean value representing whether the attempt to get notifications for the given operation was successful
                        IsSuccess = true,
                        
                        // If you would like POS to navigate to a specific action property for the given operation
                        // when the notification tile is clicked, define the action property as well.
                        ////ActionProperty = "1"
                    };

                    details.Add(detail);
                }
                else if (request.SubscribedOperation == RetailOperation.RemoveCoupons)
                {
                    var detail = new NotificationDetail()
                    {
                        DisplayText = "Remove coupon",
                        ItemCount = 1,
                        LastUpdatedDateTime = lastNotificationDateTime,
                        IsSuccess = true
                    };

                    var detail2 = new NotificationDetail()
                    {
                        DisplayText = "Remove coupon",
                        ItemCount = 1,
                        LastUpdatedDateTime = lastNotificationDateTime,
                        IsSuccess = true
                    };

                    details.Add(detail);
                    details.Add(detail2);
                }

                var serviceResponse = new GetNotificationsExtensionServiceResponse(details);
                return await Task.FromResult(serviceResponse);
            }
        }
    }
}
