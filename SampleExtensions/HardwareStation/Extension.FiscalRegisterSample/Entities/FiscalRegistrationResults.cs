namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System.Runtime.Serialization;

        /// <summary>
        /// Fiscal transaction registration results.
        /// </summary>
        [DataContract]
        public class FiscalRegistrationResults
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="FiscalRegistrationResults" /> class.
            /// </summary>
            /// <param name="response">The fiscal register response.</param>
            public FiscalRegistrationResults(string response)
            {
                this.Response = response;
            }

            /// <summary>
            /// Gets or sets the fiscal register response.
            /// </summary>
            [DataMember]
            public string Response { get; set; }
        }
    }
}
