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
    namespace Commerce.Runtime.Data.Types
    {
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
        using ShiftLineNorway = Commerce.Runtime.DataModel.ShiftLineNorway;
        using ShiftNorway = Commerce.Runtime.DataModel.ShiftNorway;

        /// <summary>
        /// The Norway-specific shift lines table type.
        /// </summary>
        public sealed class ShiftLineNorwayTableType : TableType
        {
            private const string TableTypeName = "RETAILSHIFTLINENORWAYTABLETYPE";

            /// <summary>
            /// Initializes a new instance of the <see cref="ShiftLineNorwayTableType"/> class.
            /// </summary>
            /// <param name="shift">The shift.</param>
            /// <param name="dataAreaId">The data area identifier.</param>
            public ShiftLineNorwayTableType(ShiftNorway shift, string dataAreaId)
                : base(TableTypeName)
            {
                ThrowIf.Null(shift, "shift");

                this.CreateTableSchema();

                foreach (ShiftLineNorway shiftLine in shift.ShiftLines)
                {
                    DataRow row = this.GetDataRow(shiftLine, dataAreaId);
                    this.DataTable.Rows.Add(row);
                }
            }

            /// <summary>
            /// Creates the table schema.
            /// </summary>
            protected override void CreateTableSchema()
            {
                // NOTE: The order of columns here MUST match the RetailShiftLineNorwayTableType SQL user-defined table type.
                this.DataTable.Columns.Add(TableTypeFields.ChannelColumn, typeof(long)).DefaultValue = 0L;
                this.DataTable.Columns.Add(TableTypeFields.DataAreaIdColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.GroupElementNameColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.GroupNameColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.NetAmountColumn, typeof(decimal)).DefaultValue = decimal.Zero;
                this.DataTable.Columns.Add(TableTypeFields.NumColumn, typeof(int)).DefaultValue = 0;
                this.DataTable.Columns.Add(TableTypeFields.ReportIdColumn, typeof(long)).DefaultValue = 0L;
                this.DataTable.Columns.Add(TableTypeFields.ReportTypeColumn, typeof(int)).DefaultValue = 0;
                this.DataTable.Columns.Add(TableTypeFields.ShiftIdColumn, typeof(long)).DefaultValue = 0L;
                this.DataTable.Columns.Add(TableTypeFields.StoreColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.TaxAmountColumn, typeof(decimal)).DefaultValue = decimal.Zero;
                this.DataTable.Columns.Add(TableTypeFields.TaxRateColumn, typeof(decimal)).DefaultValue = decimal.Zero;
                this.DataTable.Columns.Add(TableTypeFields.TerminalIdColumn, typeof(string)).DefaultValue = string.Empty;
            }

            private DataRow GetDataRow(ShiftLineNorway shiftLine, string dataAreaId)
            {
                DataRow row = this.DataTable.NewRow();

                row[TableTypeFields.ChannelColumn] = shiftLine.Channel;
                row[TableTypeFields.DataAreaIdColumn] = dataAreaId;
                row[TableTypeFields.GroupElementNameColumn] = shiftLine.GroupElementName;
                row[TableTypeFields.GroupNameColumn] = shiftLine.GroupName;
                row[TableTypeFields.NetAmountColumn] = shiftLine.NetAmount;
                row[TableTypeFields.NumColumn] = shiftLine.Count;
                row[TableTypeFields.ReportIdColumn] = shiftLine.ReportId;
                row[TableTypeFields.ReportTypeColumn] = shiftLine.ReportTypeValue;
                row[TableTypeFields.ShiftIdColumn] = shiftLine.ShiftId;
                row[TableTypeFields.StoreColumn] = shiftLine.Store;
                row[TableTypeFields.TaxAmountColumn] = shiftLine.TaxAmount;
                row[TableTypeFields.TaxRateColumn] = shiftLine.TaxRate;
                row[TableTypeFields.TerminalIdColumn] = shiftLine.TerminalId;

                return row;
            }

            private static class TableTypeFields
            {
                internal const string ChannelColumn = "CHANNEL";
                internal const string DataAreaIdColumn = "DATAAREAID";
                internal const string GroupElementNameColumn = "GROUPELEMENTNAME";
                internal const string GroupNameColumn = "GROUPNAME";
                internal const string NetAmountColumn = "NETAMOUNT";
                internal const string NumColumn = "NUM";
                internal const string ReportIdColumn = "REPORTID";
                internal const string ReportTypeColumn = "REPORTTYPE";
                internal const string ShiftIdColumn = "SHIFTID";
                internal const string StoreColumn = "STORE";
                internal const string TaxAmountColumn = "TAXAMOUNT";
                internal const string TaxRateColumn = "TAXRATE";
                internal const string TerminalIdColumn = "TERMINALID";
            }
        }
    }
}
