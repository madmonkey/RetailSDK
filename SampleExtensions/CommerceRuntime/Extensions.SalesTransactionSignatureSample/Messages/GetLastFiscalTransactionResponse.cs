namespace Contoso
{
    namespace Commerce.Runtime.SalesTransactionSignatureSample.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Defines the response class to retrieve last fiscal transaction from terminal.
        /// </summary>
        [DataContract]
        public sealed class GetLastFiscalTransactionResponse : Response
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="GetLastFiscalTransactionResponse"/> class.
            /// </summary>
            /// <param name="fiscalTransaction">The fiscal transaction.</param>
            public GetLastFiscalTransactionResponse(FiscalTransaction fiscalTransaction)
            {
                this.FiscalTransaction = fiscalTransaction;
            }

            /// <summary>
            /// Gets the fiscal transaction.
            /// </summary>
            [DataMember]
            public FiscalTransaction FiscalTransaction { get; private set; }
        }
    }
}
