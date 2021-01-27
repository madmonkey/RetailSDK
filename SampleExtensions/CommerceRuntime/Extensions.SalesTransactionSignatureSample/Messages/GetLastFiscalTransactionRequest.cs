namespace Contoso
{
    namespace Commerce.Runtime.SalesTransactionSignatureSample.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Defines the request class to retrieve last fiscal transaction from terminal.
        /// </summary>
        [DataContract]
        public sealed class GetLastFiscalTransactionRequest : Request
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="GetLastFiscalTransactionRequest"/> class.
            /// </summary>
            /// <param name="storeNumber">The store number.</param>
            /// <param name="terminalId">The terminal id.</param>
            public GetLastFiscalTransactionRequest(string storeNumber, string terminalId)
            {
                this.StoreNumber = storeNumber;
                this.TerminalId = terminalId;
            }

            /// <summary>
            /// Gets the store number related to the request.
            /// </summary>
            [DataMember]
            public string StoreNumber { get; private set; }

            /// <summary>
            /// Gets the terminal id related to the request.
            /// </summary>
            [DataMember]
            public string TerminalId { get; private set; }
        }
    }
}
