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
        using System;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
        using ShiftNorway = Commerce.Runtime.DataModel.ShiftNorway;

        /// <summary>
        /// The customized Norway-specific X and Z report table type.
        /// </summary>
        public sealed class XZReportTableType : TableType
        {
            private const string TableTypeName = "RETAILXZREPORTTABLETYPE";

            /// <summary>
            /// Initializes a new instance of the <see cref="XZReportTableType"/> class.
            /// </summary>
            /// <param name="shift">The shift details.</param>
            /// <param name="reportData">The report data.</param>
            /// <param name="dataAreaId">The data area identifier.</param>
            public XZReportTableType(ShiftNorway shift, string reportData, string dataAreaId)
                : base(TableTypeName)
            {
                ThrowIf.Null(shift, "shift");

                this.CreateTableSchema();

                DataRow row = this.GetDataRow(shift, reportData, dataAreaId);
                this.DataTable.Rows.Add(row);
            }

            /// <summary>
            /// Creates the table schema.
            /// </summary>
            protected override void CreateTableSchema()
            {
                // NOTE: The order of columns here MUST match the RetailXZReportTableType SQL user-defined table type.
                this.DataTable.Columns.Add(TableTypeFields.BatchIdColumn, typeof(long)).DefaultValue = 0L;
                this.DataTable.Columns.Add(TableTypeFields.ChannelColumn, typeof(long)).DefaultValue = 0L;
                this.DataTable.Columns.Add(TableTypeFields.DataAreaIdColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.ReportDateTimeColumn, typeof(DateTime)).DefaultValue = DateTimeOffsetExtensions.AxMinDateValue.DateTime;
                this.DataTable.Columns.Add(TableTypeFields.ReportIdColumn, typeof(long)).DefaultValue = 0L;
                this.DataTable.Columns.Add(TableTypeFields.ReportTypeColumn, typeof(int)).DefaultValue = 0;
                this.DataTable.Columns.Add(TableTypeFields.ReportValueColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.StoreColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.TerminalIdColumn, typeof(string)).DefaultValue = string.Empty;
            }

            private DataRow GetDataRow(ShiftNorway shift, string reportData, string dataAreaId)
            {
                DataRow row = this.DataTable.NewRow();

                row[TableTypeFields.BatchIdColumn] = shift.ShiftId;
                row[TableTypeFields.ChannelColumn] = shift.Channel;
                row[TableTypeFields.DataAreaIdColumn] = dataAreaId;
                row[TableTypeFields.ReportDateTimeColumn] = shift.ShiftDateTime.DateTime;
                row[TableTypeFields.ReportIdColumn] = shift.ReportId;
                row[TableTypeFields.ReportTypeColumn] = shift.ReportTypeValue;
                row[TableTypeFields.ReportValueColumn] = reportData;
                row[TableTypeFields.StoreColumn] = shift.Store;
                row[TableTypeFields.TerminalIdColumn] = shift.TerminalId;

                return row;
            }

            private static class TableTypeFields
            {
                internal const string BatchIdColumn = "BATCHID";
                internal const string ChannelColumn = "CHANNEL";
                internal const string DataAreaIdColumn = "DATAAREAID";
                internal const string ReportDateTimeColumn = "REPORTDATETIME";
                internal const string ReportIdColumn = "REPORTID";
                internal const string ReportTypeColumn = "REPORTTYPE";
                internal const string ReportValueColumn = "REPORTVALUE";
                internal const string StoreColumn = "STORE";
                internal const string TerminalIdColumn = "TERMINALID";
            }
        }
    }
}
