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
        using Microsoft.Dynamics.Commerce.Runtime.ComponentModel.DataAnnotations;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Represents a Norway-specific shift lines.
        /// </summary>
        [DataContract]
        public class ShiftLineNorway : CommerceEntity
        {
            // Table name
            internal const string ShiftLineNorwayTableName = "RETAILSHIFTLINENORWAY";

            // Column name
            internal const string ChannelColumn = "CHANNEL";
            internal const string StoreColumn = "STORE";
            internal const string TerminalIdColumn = "TERMINALID";
            internal const string ShiftIdColumn = "SHIFTID";
            internal const string ReportTypeColumn = "REPORTTYPE";
            internal const string ReportIdColumn = "REPORTID";
            internal const string CountColumn = "NUM";
            internal const string NetAmountColumn = "NETAMOUNT";
            internal const string TaxAmountColumn = "TAXAMOUNT";
            internal const string TaxRateColumn = "TAXRATE";
            internal const string GroupNameColumn = "GROUPNAME";
            internal const string GroupElementNameColumn = "GROUPELEMENTNAME";

            /// <summary>
            /// Initializes a new instance of the <see cref="ShiftLineNorway"/> class.
            /// </summary>
            public ShiftLineNorway()
                : base(ShiftLineNorwayTableName)
            {
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
            /// Gets or sets the total count for shift line.
            /// </summary>
            [DataMember]
            [Column(CountColumn)]
            public int Count
            {
                get { return (int)(this[CountColumn] ?? 0); }
                set { this[CountColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the total net amount for shift line.
            /// </summary>
            [DataMember]
            [Column(NetAmountColumn)]
            public decimal NetAmount
            {
                get { return (decimal)(this[NetAmountColumn] ?? decimal.Zero); }
                set { this[NetAmountColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the tax amount for shift line.
            /// </summary>
            [DataMember]
            [Column(TaxAmountColumn)]
            public decimal TaxAmount
            {
                get { return (decimal)(this[TaxAmountColumn] ?? decimal.Zero); }
                set { this[TaxAmountColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the tax rate for shift line.
            /// </summary>
            [DataMember]
            [Column(TaxRateColumn)]
            public decimal TaxRate
            {
                get { return (decimal)(this[TaxRateColumn] ?? decimal.Zero); }
                set { this[TaxRateColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the group name.
            /// </summary>
            [DataMember]
            [Column(GroupNameColumn)]
            public string GroupName
            {
                get { return (string)this[GroupNameColumn] ?? string.Empty; }
                set { this[GroupNameColumn] = value; }
            }

            /// <summary>
            /// Gets or sets the group element name.
            /// </summary>
            [DataMember]
            [Column(GroupElementNameColumn)]
            public string GroupElementName
            {
                get { return (string)this[GroupElementNameColumn] ?? string.Empty; }
                set { this[GroupElementNameColumn] = value; }
            }
        }
    }
}
