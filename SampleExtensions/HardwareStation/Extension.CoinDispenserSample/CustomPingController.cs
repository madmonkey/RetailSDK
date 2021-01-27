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
    namespace Commerce.HardwareStation.CashDispenserSample
    {
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;

        /// <summary>
        /// The new ping controller is the new controller class to receive ping request.
        /// </summary>
        [RoutePrefix("CUSTOMPING")]
        public class CustomPingController : IController
        {
            /// <summary>
            /// The test method that returns the successful ping.
            /// </summary>
            /// <param name="pingRequest">The ping request.</param>
            /// <returns>Returns the successful ping message.</returns>
            [HttpPost]
            public Task<string> CustomPing(PingRequest pingRequest)
            {
                ThrowIf.Null(pingRequest, "pingRequest");

                return Task.FromResult(string.Format("Your message is successfully received: {0}", pingRequest.Message));
            }
        }
    }
}