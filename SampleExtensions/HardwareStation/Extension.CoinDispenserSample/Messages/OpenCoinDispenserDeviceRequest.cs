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
        using Microsoft.Dynamics.Commerce.HardwareStation;
        using Microsoft.Dynamics.Commerce.HardwareStation.Peripherals;

        /// <summary>
        /// Represents a coin dispenser open request.
        /// </summary>
        public class OpenCoinDispenserDeviceRequest : OpenDeviceRequestBase
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="OpenCoinDispenserDeviceRequest"/> class.
            /// </summary>
            /// <param name="deviceName">Specify the device name.</param>
            /// <param name="deviceConfig">Specify the device configuration.</param>
            public OpenCoinDispenserDeviceRequest(string deviceName, PeripheralConfiguration deviceConfig) : base(deviceName, deviceConfig)
            {
            }
        }
    }
}
