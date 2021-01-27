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
    namespace Commerce.Runtime.CommonFrance.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;

        /// <summary>
        /// The request to get the transaction reprint number.
        /// </summary>
        [DataContract]
        public sealed class GetTransactionReprintNumberServiceRequest : DataRequest
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="GetTransactionReprintNumberServiceRequest"/> class.
            /// </summary>
            /// <param name="channelId">Channel identifier.</param>
            /// <param name="storeNumber">Store number.</param>
            /// <param name="terminalId">Terminal identifier.</param>
            /// <param name="transactionId">Sales transaction identifier.</param>
            public GetTransactionReprintNumberServiceRequest(long channelId, string storeNumber, string terminalId, string transactionId)
            {
                this.ChannelId = channelId;
                this.StoreNumber = storeNumber;
                this.TerminalId = terminalId;
                this.TransactionId = transactionId;
            }

            /// <summary>
            /// Gets the channel identifier.
            /// </summary>
            [DataMember]
            public long ChannelId { get; private set; }

            /// <summary>
            /// Gets the store identifier.
            /// </summary>
            [DataMember]
            public string StoreNumber { get; private set; }

            /// <summary>
            /// Gets the terminal identifier.
            /// </summary>
            [DataMember]
            public string TerminalId { get; private set; }

            /// <summary>
            /// Gets the sales transaction identifier.
            /// </summary>
            [DataMember]
            public string TransactionId { get; private set; }
        }
    }
}
