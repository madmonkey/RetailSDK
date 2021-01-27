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
        using Commerce.Runtime.SalesPaymentTransExt;
        using Microsoft.Dynamics.Commerce.Runtime.ComponentModel.DataAnnotations;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Represents a sales line extension.
        /// </summary>
        [DataContract]
        public class SalesLineExt : CommerceEntity
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="SalesLineExt"/> class.
            /// </summary>
            public SalesLineExt() 
                : base("SalesLineExt")
            {
            }

            /// <summary>
            /// Gets or sets the data area identifier.
            /// </summary>
            [IgnoreDataMember]
            [Column(RetailTransactionTableSchema.DataAreaIdColumn)]
            public string DataAreaId
            {
                get { return (string)this[RetailTransactionTableSchema.DataAreaIdColumn]; }
                set { this[RetailTransactionTableSchema.DataAreaIdColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the store identifier where this transaction was created.
            /// </summary>
            [DataMember]
            [Column(RetailTransactionTableSchema.StoreColumn)]
            public string StoreId
            {
                get { return (string)this[RetailTransactionTableSchema.StoreColumn]; }
                set { this[RetailTransactionTableSchema.StoreColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the terminal identifier where this transaction was created or resumed.
            /// </summary>
            [DataMember]
            [Column(RetailTransactionTableSchema.TerminalColumn)]
            public string TerminalId
            {
                get { return (string)this[RetailTransactionTableSchema.TerminalColumn]; }
                set { this[RetailTransactionTableSchema.TerminalColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the cart/sales transaction identifier.
            /// </summary>
            [DataMember]
            [Column(RetailTransactionTableSchema.TransactionIdColumn)]
            public string TransactionId
            {
                get { return (string)this[RetailTransactionTableSchema.TransactionIdColumn]; }
                set { this[RetailTransactionTableSchema.TransactionIdColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the sales line number.
            /// </summary>
            [DataMember]
            [Column(SalesLineExtTableSchema.LineNumColumn)]
            public decimal LineNumber
            {
                get { return (decimal)(this[SalesLineExtTableSchema.LineNumColumn] ?? 0m); }
                set { this[SalesLineExtTableSchema.LineNumColumn] = value; }
            }

            /// <summary>
            /// Gets or sets a value indicating whether the line should be skipped in reports.
            /// </summary>
            [DataMember]
            [Column(SalesLineExtTableSchema.SkipReportsColumn)]
            public bool SkipReports
            {
                get { return (bool)(this[SalesLineExtTableSchema.SkipReportsColumn] ?? false); }
                set { this[SalesLineExtTableSchema.SkipReportsColumn] = value; }
            }
        }
    }
}
