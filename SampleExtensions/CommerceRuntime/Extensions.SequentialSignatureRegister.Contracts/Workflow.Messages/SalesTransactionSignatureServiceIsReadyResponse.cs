/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso
{
    namespace Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Defines a simple response class that holds a readiness status.
        /// </summary>
        [DataContract]
        public sealed class SalesTransactionSignatureServiceIsReadyResponse : Response
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="SalesTransactionSignatureServiceIsReadyResponse"/> class.
            /// </summary>
            /// <param name="isReady">The readiness status.</param>
            public SalesTransactionSignatureServiceIsReadyResponse(bool isReady)
            {
                this.IsReady = isReady;
            }

            /// <summary>
            /// Gets a value indicating whether readiness status.
            /// </summary>
            [DataMember]
            public bool IsReady { get; private set; }
        }
    }
}
