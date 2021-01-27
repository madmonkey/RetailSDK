namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System.Runtime.Serialization;

        /// <summary>
        /// Clean cash fiscal register response.
        /// </summary>
        [DataContract]
        internal class CleanCashResponse
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="CleanCashResponse" /> class.
            /// </summary>
            /// <param name="deviceId">Device ID.</param>
            /// <param name="controlCode">The control code.</param>
            public CleanCashResponse(string deviceId, string controlCode)
            {
                this.DeviceId = deviceId;
                this.ControlCode = controlCode;
            }

            /// <summary>
            /// Gets or sets the fiscal register device Id.
            /// </summary>
            [DataMember]
            public string DeviceId { get; set; }

            /// <summary>
            /// Gets or sets the fiscal data registration control code.
            /// </summary>
            [DataMember]
            public string ControlCode { get; set; }
        }
    }
}
