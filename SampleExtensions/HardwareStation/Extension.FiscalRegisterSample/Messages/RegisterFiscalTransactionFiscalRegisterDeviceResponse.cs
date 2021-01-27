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
        public class RegisterFiscalTransactionFiscalRegisterDeviceResponse : Response
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="RegisterFiscalTransactionFiscalRegisterDeviceResponse" /> class.
            /// </summary>
            /// <param name="fiscalRegistrationResults">The fiscal registration results.</param>
            public RegisterFiscalTransactionFiscalRegisterDeviceResponse(FiscalRegistrationResults fiscalRegistrationResults)
            {
                this.FiscalRegistrationResults = fiscalRegistrationResults;
            }

            /// <summary>
            /// Gets the fiscal registration results.
            /// </summary>
            [DataMember]
            public FiscalRegistrationResults FiscalRegistrationResults { get; private set; }
        }
    }
}