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
    namespace Commerce.HardwareStation.CoinDispenserSample
    {
        using System;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.HardwareStation;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;

        /// <summary>
        /// Coin dispenser web API controller class.
        /// </summary>
        [RoutePrefix("COINDISPENSER")]
        public class CoinDispenserController : IController
        {
            private const string CoinDispenserTestName = "MockOPOSCoinDispenser";

            /// <summary>
            /// Collect the change in the coin dispenser.
            /// </summary>
            /// <param name="request">The coin dispenser request value.</param>
            /// <returns>Returns true fi the change operation succeeds.</returns>
            [HttpPost]
            public Task<bool> DispenseChange(CoinDispenserRequest request, IEndpointContext context)
            {
                ThrowIf.Null(request, "request");

                string deviceName = request.DeviceName;

                if (string.IsNullOrWhiteSpace(deviceName))
                {
                    deviceName = CoinDispenserController.CoinDispenserTestName;
                }

                try
                {
                    var openCoinDispenserDeviceRequest = new OpenCoinDispenserDeviceRequest(deviceName, null);
                    context.ExecuteAsync<NullResponse>(openCoinDispenserDeviceRequest);

                    var dispenseChangeCoinDispenserDeviceRequest = new DispenseChangeCoinDispenserDeviceRequest(request.Amount);
                    context.ExecuteAsync<NullResponse>(dispenseChangeCoinDispenserDeviceRequest);

                    return Task.FromResult(true);
                }
                catch (Exception ex)
                {
                    throw new PeripheralException("Microsoft_Dynamics_Commerce_HardwareStation_CoinDispenser_Error", ex.Message, ex);
                }
                finally
                {
                    var closeCoinDispenserDeviceRequest = new CloseCoinDispenserDeviceRequest();
                    context.ExecuteAsync<NullResponse>(closeCoinDispenserDeviceRequest);

                }
            }
        }
    }
}
