namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System.Runtime.Serialization;

        /// <summary>
        ///  Represents a request to register fiscal transaction in the fiscal register.
        /// </summary>
        [DataContract]
        public class FiscalRegistrationRequest
        {
            /// <summary>
            /// Gets or sets fiscal transaction.
            /// </summary>
            [DataMember]
            public FiscalTransactionInfo FiscalTransaction { get; set; }

            /// <summary>
            /// Gets or sets fiscal register configuration.
            /// </summary>
            [DataMember]
            public string Configuration { get; set; }
        }
    }
}
