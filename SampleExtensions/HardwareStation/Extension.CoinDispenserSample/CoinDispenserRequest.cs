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
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.HardwareStation;

        /// <summary>
        /// The coin dispenser controller request class.
        /// </summary>
        [DataContract]
        public class CoinDispenserRequest
        {
            /// <summary>
            /// Gets or sets the name of peripheral device.
            /// </summary>
            [DataMember]
            public string DeviceName { get; set; }

            /// <summary>
            /// Gets or sets the type of peripheral device.
            /// </summary>
            [DataMember]
            public string DeviceType { get; set; }

            /// <summary>
            /// Gets or sets the value for change amount. 
            /// </summary>
            [DataMember]
            public int Amount { get; set; }
        }
    }
}
