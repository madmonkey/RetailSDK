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
        using System;
        using System.Collections.Generic;
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.ComponentModel.DataAnnotations;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Represents a Norway-specific shift.
        /// </summary>
        [DataContract]
        public class ShiftNorway : CommerceEntity
        {
            // Table name
            internal const string ShiftNorwayTableName = "RETAILSHIFTNORWAY";

            // Column name
            internal const string ChannelColumn = "CHANNEL";
            internal const string StoreColumn = "STORE";
            internal const string TerminalIdColumn = "TERMINALID";
            internal const string ShiftIdColumn = "SHIFTID";
            internal const string ReportTypeColumn = "REPORTTYPE";
            internal const string ReportIdColumn = "REPORTID";
            internal const string ShiftDateTimeColumn = "REPORTDATETIME";
            internal const string OrganizationNameColumn = "ORGNAME";
            internal const string OrganizationNumberColumn = "ORGNUMBER";
            internal const string TotalCashSalesColumn = "TOTALCASHSALES";
            internal const string OpeningChangeAmountColumn = "OPENINGCHANGEFLOAT";
            internal const string SalesReceiptCountColumn = "SALESRECEIPTSCOUNT";
            internal const string CashDrawerOpenColumn = "CASHDRAWEROPENCOUNT";
            internal const string GrandTotalSalesColumn = "GRANDTOTALSALES";
            internal const string GrandTotalReturnsColumn = "GRANDTOTALRETURNS";
            internal const string GrandTotalNetColumn = "GRANDTOTALNET";

            /// <summary>
            /// Initializes a new instance of the <see cref="ShiftNorway"/> class.
            /// </summary>
            public ShiftNorway()
                : base(ShiftNorwayTableName)
            {
                this.ShiftLines = new List<ShiftLineNorway>();
            }

            /// <summary>
            /// Gets or sets the channel identifier of the shift.
            /// </summary>
            [DataMember]
            [Column(ChannelColumn)]
            public long Channel
            {
                get { return (long)(this[ChannelColumn] ?? 0L); }
                set { this[ChannelColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the store identifier of the shift.
            /// </summary>
            [DataMember]
            [Column(StoreColumn)]
            public string Store
            {
                get { return (string)this[StoreColumn] ?? string.Empty; }
                set { this[StoreColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the terminal identifier of the shift.
            /// </summary>
            [DataMember]
            [Column(TerminalIdColumn)]
            public string TerminalId
            {
                get { return (string)this[TerminalIdColumn] ?? string.Empty; }
                set { this[TerminalIdColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the shift id.
            /// </summary>
            [DataMember]
            [Column(ShiftIdColumn)]
            public long ShiftId
            {
                get { return (long)(this[ShiftIdColumn] ?? 0L); }
                set { this[ShiftIdColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the report type.
            /// </summary>
            [IgnoreDataMember]
            public XZReportType ReportType
            {
                get { return (XZReportType)this.ReportTypeValue; }
                set { this.ReportTypeValue = (int)value; }
            }

            /// <summary>
            /// Gets or sets the value of the report type. Used by OData only.
            /// </summary>
            [DataMember]
            [Column(ReportTypeColumn)]
            public int ReportTypeValue
            {
                get { return (int)(this[ReportTypeColumn] ?? 0); }
                set { this[ReportTypeColumn] = (XZReportType)value; }
            }

            /// <summary>
            /// Gets or sets the report identifier.
            /// </summary>
            [DataMember]
            [Column(ReportIdColumn)]
            public long ReportId
            {
                get { return (long)(this[ReportIdColumn] ?? 0L); }
                set { this[ReportIdColumn] = value; }
            }

            /// <summary>
            /// Gets or sets start date/time of Shift in channel time zone.
            /// </summary>
            [DataMember]
            [Column(ShiftDateTimeColumn)]
            [RequiredToBeUtc(false)]
            public DateTimeOffset ShiftDateTime
            {
                get { return (DateTimeOffset)this[ShiftDateTimeColumn]; }
                set { this[ShiftDateTimeColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the organization name.
            /// </summary>
            [DataMember]
            [Column(OrganizationNameColumn)]
            public string OrganizationName
            {
                get { return (string)this[OrganizationNameColumn] ?? string.Empty; }
                set { this[OrganizationNameColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the organization number.
            /// </summary>
            [DataMember]
            [Column(OrganizationNumberColumn)]
            public string OrganizationNumber
            {
                get { return (string)this[OrganizationNumberColumn] ?? string.Empty; }
                set { this[OrganizationNumberColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the number of total cash sales.
            /// </summary>
            [DataMember]
            [Column(TotalCashSalesColumn)]
            public decimal TotalCashSales
            {
                get { return (decimal)(this[TotalCashSalesColumn] ?? decimal.Zero); }
                set { this[TotalCashSalesColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the opening change float.
            /// </summary>
            [DataMember]
            [Column(OpeningChangeAmountColumn)]
            public decimal OpeningChangeAmount
            {
                get { return (decimal)(this[OpeningChangeAmountColumn] ?? decimal.Zero); }
                set { this[OpeningChangeAmountColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the number of sales receipts.
            /// </summary>
            [DataMember]
            [Column(SalesReceiptCountColumn)]
            public int SalesReceiptCount
            {
                get { return (int)(this[SalesReceiptCountColumn] ?? 0); }
                set { this[SalesReceiptCountColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the.
            /// </summary>
            [DataMember]
            [Column(CashDrawerOpenColumn)]
            public int CashDrawerOpen
            {
                get { return (int)(this[CashDrawerOpenColumn] ?? 0); }
                set { this[CashDrawerOpenColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the grand total sales.
            /// </summary>
            [DataMember]
            [Column(GrandTotalSalesColumn)]
            public decimal GrandTotalSales
            {
                get { return (decimal)(this[GrandTotalSalesColumn] ?? decimal.Zero); }
                set { this[GrandTotalSalesColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the grand total returns.
            /// </summary>
            [DataMember]
            [Column(GrandTotalReturnsColumn)]
            public decimal GrandTotalReturns
            {
                get { return (decimal)(this[GrandTotalReturnsColumn] ?? decimal.Zero); }
                set { this[GrandTotalReturnsColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the grand total net.
            /// </summary>
            [DataMember]
            [Column(GrandTotalNetColumn)]
            public decimal GrandTotalNet
            {
                get { return (decimal)(this[GrandTotalNetColumn] ?? decimal.Zero); }
                set { this[GrandTotalNetColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the shift lines.
            /// </summary>
            [DataMember]
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly", Justification = "As per design.")]
            public IList<ShiftLineNorway> ShiftLines { get; set; }
        }
    }
}
