namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Represents a fiscal register is ready request.
        /// </summary>
        [DataContract]
        public class IsReadyFiscalRegisterDeviceRequest : Request
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="IsReadyFiscalRegisterDeviceRequest"/> class.
            /// </summary>
            public IsReadyFiscalRegisterDeviceRequest()
            {
            }
        }
    }
}