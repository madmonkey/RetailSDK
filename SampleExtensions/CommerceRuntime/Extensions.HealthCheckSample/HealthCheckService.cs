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
    namespace Commerce.Runtime.HealthCheckSample
    {
        using System;
        using System.Diagnostics;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.RealtimeServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Service class responsible executing the service requests.
        /// </summary>
        public class HealthCheckService : SingleAsyncRequestHandler<RunHealthCheckServiceRequest>
        {
            /// <summary>
            /// Executes the service request.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>
            /// The response.
            /// </returns>
            protected override async Task<Response> Process(RunHealthCheckServiceRequest request)
            {
                if (request == null)
                {
                    throw new ArgumentNullException("request");
                }

                // execute the original functionality
                bool isSuccess = false;

                switch (request.HealthCheckType)
                {
                    case HealthCheckType.DatabaseHealthCheck:
                        isSuccess = await this.RunDatabaseHealthCheckAsync(request);
                        break;

                    case HealthCheckType.RealtimeServiceHealthCheck:
                        isSuccess = await this.RunRealtimeServiceHealthCheckAsync(request);
                        break;

                    default:
                        throw new NotSupportedException(string.Format("Health check type '{0}' is not supported.", request.HealthCheckType));
                }

                isSuccess = isSuccess & this.ExecuteAdditionalHealthCheck();
                var response = new RunHealthCheckServiceResponse(isSuccess);
                return response;
            }

            /// <summary>
            /// Performs an additional health check to some other system.
            /// </summary>
            /// <returns>Boolean value that indicates if the check succeeded.</returns>
            private bool ExecuteAdditionalHealthCheck()
            {
                // This is the place were additional logic could be added to check the health of other systems...
                Debug.WriteLine("Doing additional health check...");
                return true;
            }

            /// <summary>
            /// Performs realtime service health check.
            /// </summary>
            /// <param name="request">Service request.</param>
            /// <returns>Boolean value that indicates if the check succeeded.</returns>
            private async Task<bool> RunRealtimeServiceHealthCheckAsync(RunHealthCheckServiceRequest request)
            {
                var healthCheckResponse = await request.RequestContext.ExecuteAsync<RunHealthCheckRealtimeResponse>(new RunHealthCheckRealtimeRequest()).ConfigureAwait(false);
                return healthCheckResponse.IsSuccess;
            }

            /// <summary>
            /// Performs database health check.
            /// </summary>
            /// <param name="request">Service request.</param>
            /// <returns>Boolean value that indicates if the check succeeded.</returns>
            private async Task<bool> RunDatabaseHealthCheckAsync(RunHealthCheckServiceRequest request)
            {
                var context = request.RequestContext;
                var response = await context.Runtime.ExecuteAsync<SingleEntityDataServiceResponse<bool>>(new RunDBHealthCheckDataRequest(), context).ConfigureAwait(false);
                return response.Entity;
            }
        }
    }
}
