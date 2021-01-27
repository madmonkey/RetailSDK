namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Represents a register fiscal transaction request.
        /// </summary>
        [DataContract]
        public class RegisterFiscalTransactionFiscalRegisterDeviceRequest : Request
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="RegisterFiscalTransactionFiscalRegisterDeviceRequest"/> class.
            /// </summary>
            /// <param name="fiscalTransaction">The fiscal transaction data.</param>
            /// <param name="configuration">The fiscal transaction configuration.</param>
            public RegisterFiscalTransactionFiscalRegisterDeviceRequest(FiscalTransactionInfo fiscalTransaction, string configuration)
            {
                this.FiscalTransaction = fiscalTransaction;
                this.Configuration = configuration;
            }

            /// <summary>
            /// Gets the fiscal transaction.
            /// </summary>
            [DataMember]
            public FiscalTransactionInfo FiscalTransaction { get; private set; }

            /// <summary>
            /// Gets the fiscal register configuration.
            /// </summary>
            [DataMember]
            public string Configuration { get; private set; }
        }
    }
}