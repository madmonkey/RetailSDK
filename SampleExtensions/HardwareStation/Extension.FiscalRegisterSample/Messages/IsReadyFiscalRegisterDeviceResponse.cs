namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Represents the fiscal register is ready response message.
        /// </summary>
        [DataContract]
        public class IsReadyFiscalRegisterDeviceResponse : Response
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="IsReadyFiscalRegisterDeviceResponse" /> class.
            /// </summary>
            /// <param name="isReady">The isReady flag.</param>
            public IsReadyFiscalRegisterDeviceResponse(bool isReady)
            {
                this.IsReady = isReady;
            }

            /// <summary>
            /// Gets a value indicating whether the device is ready.
            /// </summary>
            [DataMember]
            public bool IsReady { get; private set; }
        }
    }
}