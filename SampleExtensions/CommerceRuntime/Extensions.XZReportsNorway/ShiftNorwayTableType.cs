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
        /// The customized Norway-specific shift table type.
        /// </summary>
        public sealed class ShiftNorwayTableType : TableType
        {
            private const string TableTypeName = "RETAILSHIFTNORWAYTABLETYPE";

            /// <summary>
            /// Initializes a new instance of the <see cref="ShiftNorwayTableType"/> class.
            /// </summary>
            /// <param name="shift">The shift details.</param>
            /// <param name="dataAreaId">The data area identifier.</param>
            public ShiftNorwayTableType(ShiftNorway shift, string dataAreaId)
                : base(TableTypeName)
            {
                ThrowIf.Null(shift, "shift");

                this.CreateTableSchema();

                DataRow row = this.GetDataRow(shift, dataAreaId);
                this.DataTable.Rows.Add(row);
            }

            /// <summary>
            /// Creates the table schema.
            /// </summary>
            protected override void CreateTableSchema()
            {
                // NOTE: The order of columns here MUST match the RetailShiftNorwayTableType SQL user-defined table type.
                this.DataTable.Columns.Add(TableTypeFields.CashDrawerOpenColumn, typeof(int)).DefaultValue = 0;
                this.DataTable.Columns.Add(TableTypeFields.ChannelColumn, typeof(long)).DefaultValue = 0L;
                this.DataTable.Columns.Add(TableTypeFields.DataAreaIdColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.GrandTotalNetColumn, typeof(decimal)).DefaultValue = decimal.Zero;
                this.DataTable.Columns.Add(TableTypeFields.GrandTotalReturnsColumn, typeof(decimal)).DefaultValue = decimal.Zero;
                this.DataTable.Columns.Add(TableTypeFields.GrandTotalSalesColumn, typeof(decimal)).DefaultValue = decimal.Zero;
                this.DataTable.Columns.Add(TableTypeFields.OpeningChangeFloatColumn, typeof(decimal)).DefaultValue = decimal.Zero;
                this.DataTable.Columns.Add(TableTypeFields.OrgNameColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.OrgNumberColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.ReportDateTimeColumn, typeof(DateTime)).DefaultValue = DateTimeOffsetExtensions.AxMinDateValue.DateTime;
                this.DataTable.Columns.Add(TableTypeFields.ReportIdColumn, typeof(long)).DefaultValue = 0L;
                this.DataTable.Columns.Add(TableTypeFields.ReportTypeColumn, typeof(int)).DefaultValue = 0;
                this.DataTable.Columns.Add(TableTypeFields.SalesReceiptCountColumn, typeof(int)).DefaultValue = 0;
                this.DataTable.Columns.Add(TableTypeFields.ShiftIdColumn, typeof(long)).DefaultValue = 0L;
                this.DataTable.Columns.Add(TableTypeFields.StoreColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.TerminalIdColumn, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TableTypeFields.TotalCashSalesColumn, typeof(decimal)).DefaultValue = decimal.Zero;
            }

            private DataRow GetDataRow(ShiftNorway shift, string dataAreaId)
            {
                DataRow row = this.DataTable.NewRow();

                row[TableTypeFields.CashDrawerOpenColumn] = shift.CashDrawerOpen;
                row[TableTypeFields.ChannelColumn] = shift.Channel;
                row[TableTypeFields.DataAreaIdColumn] = dataAreaId;
                row[TableTypeFields.GrandTotalNetColumn] = shift.GrandTotalNet;
                row[TableTypeFields.GrandTotalReturnsColumn] = shift.GrandTotalReturns;
                row[TableTypeFields.GrandTotalSalesColumn] = shift.GrandTotalSales;
                row[TableTypeFields.OpeningChangeFloatColumn] = shift.OpeningChangeAmount;
                row[TableTypeFields.OrgNameColumn] = shift.OrganizationName;
                row[TableTypeFields.OrgNumberColumn] = shift.OrganizationNumber;
                row[TableTypeFields.ReportDateTimeColumn] = shift.ShiftDateTime.DateTime;
                row[TableTypeFields.ReportIdColumn] = shift.ReportId;
                row[TableTypeFields.ReportTypeColumn] = shift.ReportTypeValue;
                row[TableTypeFields.SalesReceiptCountColumn] = shift.SalesReceiptCount;
                row[TableTypeFields.ShiftIdColumn] = shift.ShiftId;
                row[TableTypeFields.StoreColumn] = shift.Store;
                row[TableTypeFields.TerminalIdColumn] = shift.TerminalId;
                row[TableTypeFields.TotalCashSalesColumn] = shift.TotalCashSales;

                return row;
            }

            private static class TableTypeFields
            {
                internal const string CashDrawerOpenColumn = "CASHDRAWEROPENCOUNT";
                internal const string ChannelColumn = "CHANNEL";
                internal const string DataAreaIdColumn = "DATAAREAID";
                internal const string GrandTotalNetColumn = "GRANDTOTALNET";
                internal const string GrandTotalReturnsColumn = "GRANDTOTALRETURNS";
                internal const string GrandTotalSalesColumn = "GRANDTOTALSALES";
                internal const string OpeningChangeFloatColumn = "OPENINGCHANGEFLOAT";
                internal const string OrgNameColumn = "ORGNAME";
                internal const string OrgNumberColumn = "ORGNUMBER";
                internal const string ReportDateTimeColumn = "REPORTDATETIME";
                internal const string ReportIdColumn = "REPORTID";
                internal const string ReportTypeColumn = "REPORTTYPE";
                internal const string SalesReceiptCountColumn = "SALESRECEIPTSCOUNT";
                internal const string ShiftIdColumn = "SHIFTID";
                internal const string StoreColumn = "STORE";
                internal const string TerminalIdColumn = "TERMINALID";
                internal const string TotalCashSalesColumn = "TOTALCASHSALES";
            }
        }
    }
}
