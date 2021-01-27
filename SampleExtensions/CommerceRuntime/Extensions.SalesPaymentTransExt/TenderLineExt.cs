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
        /// Represents a tender line extension.
        /// </summary>
        [DataContract]
        public class TenderLineExt : CommerceEntity
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="TenderLineExt"/> class.
            /// </summary>
            public TenderLineExt()
                    : base("TenderLineExt")
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
            [Column(TenderLineExtTableSchema.LineNumColumn)]
            public decimal LineNumber
            {
                get { return (decimal)(this[TenderLineExtTableSchema.LineNumColumn] ?? 0m); }
                set { this[TenderLineExtTableSchema.LineNumColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the amount adjustment.
            /// </summary>
            [DataMember]
            [Column(TenderLineExtTableSchema.AmountInChannelCurrencyAdjustmentColumn)]
            public decimal AmountInChannelCurrencyAdjustment
            {
                get { return (decimal)(this[TenderLineExtTableSchema.AmountInChannelCurrencyAdjustmentColumn] ?? 0m); }
                set { this[TenderLineExtTableSchema.AmountInChannelCurrencyAdjustmentColumn] = value; }
            }
        }
    }
}
