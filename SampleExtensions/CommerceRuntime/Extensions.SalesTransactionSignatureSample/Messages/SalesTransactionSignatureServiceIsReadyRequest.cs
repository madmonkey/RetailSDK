namespace Contoso
{
    namespace Commerce.Runtime.SalesTransactionSignatureSample.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// A simple request class to sales transaction signature service readiness.
        /// </summary>
        [DataContract]
        public sealed class SalesTransactionSignatureServiceIsReadyRequest : Request
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="SalesTransactionSignatureServiceIsReadyRequest"/> class.
            /// </summary>
            public SalesTransactionSignatureServiceIsReadyRequest()
            {
            }
        }
    }
}
