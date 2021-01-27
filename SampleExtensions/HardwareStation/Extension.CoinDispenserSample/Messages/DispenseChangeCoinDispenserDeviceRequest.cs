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
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Represents a coin dispenser dispense change request.
        /// </summary>
        public class DispenseChangeCoinDispenserDeviceRequest : Request
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="DispenseChangeCoinDispenserDeviceRequest" /> class.
            /// </summary>
            /// <param name="amount">The value for change amount.</param>
            public DispenseChangeCoinDispenserDeviceRequest(int amount)
            {
                this.Amount = amount;
            }

            /// <summary>
            /// Gets the value for change amount. 
            /// </summary>
            public int Amount { get; private set; }
        }
    }
}
