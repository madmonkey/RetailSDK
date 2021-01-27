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
