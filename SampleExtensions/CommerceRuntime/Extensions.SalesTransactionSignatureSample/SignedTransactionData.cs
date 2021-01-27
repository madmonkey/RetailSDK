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
    namespace Commerce.Runtime.SalesTransactionSignatureSample
    {
        using System.Runtime.Serialization;

        /// <summary>
        /// Signed transaction data.
        /// </summary>
        [DataContract]
        internal class SignedTransactionData
        {
            /// <summary>
            /// Gets or sets the current transaction signature.
            /// </summary>
            [DataMember]
            public string Signature { get; set; }

            /// <summary>
            /// Gets or sets the key version used for signature.
            /// </summary>
            [DataMember]
            public string KeyThumbprint { get; set; }

            /// <summary>
            /// Gets or sets the data which has been signed.
            /// </summary>
            [DataMember]
            public string DataToSign { get; set; }

            /// <summary>
            /// Gets or sets the sequential number of signed transaction.
            /// </summary>
            [DataMember]
            public long SequentialNumber { get; set; }
        }
    }
}
