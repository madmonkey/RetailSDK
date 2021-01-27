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
    namespace Commerce.Runtime.DataModel
    {
        using System.Runtime.Serialization;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Microsoft.Dynamics.Commerce.Runtime.ComponentModel.DataAnnotations;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Signed transaction data.
        /// </summary>
        [DataContract]
        public class SequentialSignatureData : CommerceEntity
        {
            // Column names.
            internal const string SequentialNumberColumnName = "SEQUENTIALNUMBER";
            internal const string LastRegisterResponseColumnName = "LASTREGISTERRESPONSE";

            /// <summary>
            /// Initializes a new instance of the <see cref="SequentialSignatureData" /> class.
            /// </summary>
            public SequentialSignatureData()
                : base("SequentialSignatureData")
            {
            }

            /// <summary>
            /// Gets or sets the current signature.
            /// </summary>
            [DataMember]
            [Column(LastRegisterResponseColumnName)]
            public string Signature
            {
                get { return (string)(this[LastRegisterResponseColumnName] ?? string.Empty); }
                set { this[LastRegisterResponseColumnName] = value; }
            }

            /// <summary>
            /// Gets or sets the sequential number of signature.
            /// </summary>
            [DataMember]
            [Column(SequentialNumberColumnName)]
            public long SequentialNumber
            {
                get { return (long)this[SequentialNumberColumnName]; }
                set { this[SequentialNumberColumnName] = value; }
            }
        }
    }
}
