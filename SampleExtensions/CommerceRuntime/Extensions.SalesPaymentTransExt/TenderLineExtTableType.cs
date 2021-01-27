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
    namespace Commerce.Runtime.SalesPaymentTransExt
    {
        using System.Collections.Generic;
        using Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
        using Microsoft.Dynamics.Commerce.Runtime.Helpers;

        /// <summary>
        /// Represents a table-value type parameter for tender line extension table.
        /// </summary>
        public sealed class TenderLineExtTableType : TableType
        {
            private const string TableTypeName = "RETAILTRANSACTIONPAYMENTTRANSEXTTABLETYPE";

            /// <summary>
            /// Initializes a new instance of the <see cref="TenderLineExtTableType"/> class.
            /// </summary>
            /// <param name="tenderLinesExt">The tender lines extension collection.</param>
            public TenderLineExtTableType(IEnumerable<TenderLineExt> tenderLinesExt)
                : base(TableTypeName)
            {
                ThrowIf.Null(tenderLinesExt, "tenderLinesExt");

                this.CreateTableSchema();

                foreach (TenderLineExt tenderLineExt in tenderLinesExt)
                {
                    var row = this.CreateDataRow(tenderLineExt);
                    this.DataTable.Rows.Add(row);
                }
            }

            /// <summary>
            /// Sets the table schema.
            /// </summary>
            protected override void CreateTableSchema()
            {
                this.DataTable.Columns.Add(RetailTransactionTableSchema.DataAreaIdColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(RetailTransactionTableSchema.StoreColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(RetailTransactionTableSchema.TerminalColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(RetailTransactionTableSchema.TransactionIdColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TenderLineExtTableSchema.LineNumColumn, typeof(decimal)).DefaultValue = 0m;
                this.DataTable.Columns.Add(TenderLineExtTableSchema.AmountInChannelCurrencyAdjustmentColumn, typeof(decimal)).DefaultValue = 0m;
            }

            /// <summary>
            /// Creates the data row.
            /// </summary>
            /// <param name="tenderLineExt">The tender line extension.</param>
            /// <returns>The data row.</returns>
            private DataRow CreateDataRow(TenderLineExt tenderLineExt)
            {
                DataRow row = this.DataTable.NewRow();

                row[RetailTransactionTableSchema.DataAreaIdColumn] = tenderLineExt.DataAreaId;
                row[RetailTransactionTableSchema.StoreColumn] = tenderLineExt.StoreId;
                row[RetailTransactionTableSchema.TerminalColumn] = tenderLineExt.TerminalId;
                row[RetailTransactionTableSchema.TransactionIdColumn] = StringDataHelper.TruncateString(tenderLineExt.TransactionId, RetailTransactionTableSchema.TransactionIdLength);
                row[TenderLineExtTableSchema.LineNumColumn] = tenderLineExt.LineNumber;
                row[TenderLineExtTableSchema.AmountInChannelCurrencyAdjustmentColumn] = tenderLineExt.AmountInChannelCurrencyAdjustment;

                return row;
            }
        }
    }
}