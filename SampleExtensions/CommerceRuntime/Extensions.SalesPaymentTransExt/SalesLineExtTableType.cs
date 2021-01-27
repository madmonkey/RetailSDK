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
        /// Represents a table-value type parameter for sales line extension table.
        /// </summary>
        public sealed class SalesLineExtTableType : TableType
        {
            private const string TableTypeName = "RETAILTRANSACTIONSALESTRANSEXTTABLETYPE";

            /// <summary>
            /// Initializes a new instance of the <see cref="SalesLineExtTableType"/> class.
            /// </summary>
            /// <param name="salesLinesExt">The sales lines extension collection.</param>
            public SalesLineExtTableType(IEnumerable<SalesLineExt> salesLinesExt)
                : base(TableTypeName)
            {
                ThrowIf.Null(salesLinesExt, "salesLinesExt");

                this.CreateTableSchema();

                foreach (SalesLineExt salesLineExt in salesLinesExt)
                {
                    var row = this.CreateDataRow(salesLineExt);
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
                this.DataTable.Columns.Add(SalesLineExtTableSchema.LineNumColumn, typeof(decimal)).DefaultValue = 0m;
                this.DataTable.Columns.Add(SalesLineExtTableSchema.SkipReportsColumn, typeof(int)).DefaultValue = 0;
            }

            /// <summary>
            /// Creates the data row.
            /// </summary>
            /// <param name="salesLineExt">The sales line extension.</param>
            /// <returns>The data row.</returns>
            private DataRow CreateDataRow(SalesLineExt salesLineExt)
            {
                ThrowIf.Null(salesLineExt, "salesLineExt");

                DataRow row = this.DataTable.NewRow();

                row[RetailTransactionTableSchema.DataAreaIdColumn] = salesLineExt.DataAreaId;
                row[RetailTransactionTableSchema.StoreColumn] = salesLineExt.StoreId;
                row[RetailTransactionTableSchema.TerminalColumn] = salesLineExt.TerminalId;
                row[RetailTransactionTableSchema.TransactionIdColumn] = StringDataHelper.TruncateString(salesLineExt.TransactionId, RetailTransactionTableSchema.TransactionIdLength);
                row[SalesLineExtTableSchema.LineNumColumn] = salesLineExt.LineNumber;
                row[SalesLineExtTableSchema.SkipReportsColumn] = salesLineExt.SkipReports;

                return row;
            }
        }
    }
}