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
