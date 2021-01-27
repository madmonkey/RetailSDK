﻿/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso
{
    namespace Commerce.Runtime.DocumentProvider.DataModelEFR.Documents
    {
        using System;
        using System.ComponentModel;
        using System.Xml.Serialization;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.DocumentHelpers;

        /// <summary>
        /// The receipt position element.
        /// </summary>
        [Serializable]
        public class ReceiptPosition
        {
            private const string VoidSign = "1";
            private const string PositionTypeAttributeName = "PTY";
            private const string PositionNumberAttributeName = "PN";
            private const string ItemNumberAttributeName = "IN";
            private const string ItemIdentityAttributeName = "ID";
            private const string DescriptionAttributeName = "Dsc";
            private const string TaxGroupAttributeName = "TaxG";
            private const string AmountAttributeName = "Amt";
            private const string QuantityAttributeName = "Qty";
            private const string QuantityUnitAttributeName = "QtyU";
            private const string UnitPriceAttributeName = "Pri";
            private const string ReferenceDateTimeAttributeName = "RD";
            private const string VoucherIDAttributeName = "VouN";
            private const string VoidAttributeName = "Void";
            private const string ReferenceTransactionLocationAttributeName = "RTL";
            private const string ReferenceTransactionTerminalAttributeName = "RTT";
            private const string ReferenceTransactionNumberAttributeName = "RTN";
            private const string ReferencePositionNumberAttributeName = "RPN";
            private const string CZFieldAttributeName = "CZ_field";

            /// <summary>
            /// The position type.
            /// </summary>
            [XmlAttribute(AttributeName = PositionTypeAttributeName)]
            [DefaultValue("")]
            public string PositionType { get; set; }

            /// <summary>
            /// The position number.
            /// </summary>
            [XmlAttribute(AttributeName = PositionNumberAttributeName)]
            [DefaultValue(0)]
            public int PositionNumber { get; set; }

            /// <summary>
            /// The item number.
            /// </summary>
            [XmlAttribute(AttributeName = ItemNumberAttributeName)]
            [DefaultValue("")]
            public string ItemNumber { get; set; }

            /// <summary>
            /// The item identity (serial or batch number).
            /// </summary>
            [XmlAttribute(AttributeName = ItemIdentityAttributeName)]
            [DefaultValue("")]
            public string ItemIdentity { get; set; }

            /// <summary>
            /// The description.
            /// </summary>
            [XmlAttribute(AttributeName = DescriptionAttributeName)]
            [DefaultValue("")]
            public string Description { get; set; }

            /// <summary>
            /// The tax group.
            /// </summary>
            [XmlAttribute(AttributeName = TaxGroupAttributeName)]
            [DefaultValue("")]
            public string TaxGroup { get; set; }

            /// <summary>
            /// The amount.
            /// </summary>
            [XmlIgnore]
            public decimal Amount { get; set; }

            /// <summary>
            /// The amount formatted for serialization.
            /// </summary>
            [XmlAttribute(AttributeName = AmountAttributeName)]
            public string AmountStringValue
            {
                get
                {
                    return FormatHelper.FormatDecimal(Amount);
                }

                set
                {
                    Amount = decimal.Parse(value);
                }
            }

            /// <summary>
            /// The quantity.
            /// </summary>
            [XmlIgnore]
            public decimal? Quantity { get; set; }

            /// <summary>
            /// The quantity formatted for serialization.
            /// </summary>
            [XmlAttribute(AttributeName = QuantityAttributeName)]
            public string QuantityStringValue
            {
                get
                {
                    return FormatHelper.FormatDecimal(Quantity);
                }

                set
                {
                    Quantity = decimal.Parse(value);
                }
            }

            /// <summary>
            /// The quantity unit.
            /// </summary>
            [XmlAttribute(AttributeName = QuantityUnitAttributeName)]
            [DefaultValue("")]
            public string QuantityUnit { get; set; }

            /// <summary>
            /// The price per unit.
            /// </summary>
            [XmlIgnore]
            public decimal? UnitPrice { get; set; }

            /// <summary>
            /// The price per unit formatted for serialization.
            /// </summary>
            [XmlAttribute(AttributeName = UnitPriceAttributeName)]
            public string UnitPriceStringValue
            {
                get
                {
                    return FormatHelper.FormatDecimal(UnitPrice);
                }

                set
                {
                    UnitPrice = decimal.Parse(value);
                }
            }

            /// <summary>
            /// The reference DateTime.
            /// </summary>
            [XmlIgnore]
            public DateTime ReferenceDateTime { get; set; }

            /// <summary>
            /// The reference DateTime formatted for serialization.
            /// </summary>
            [XmlAttribute(AttributeName = ReferenceDateTimeAttributeName)]
            [DefaultValue("")]
            public string ReferenceDateTimeStringValue
            {
                get
                {
                    return FormatHelper.FormatDateTime(ReferenceDateTime);
                }

                set
                {
                    ReferenceDateTime = DateTime.Parse(value);
                }
            }

            /// <summary>
            /// The reference transaction location.
            /// </summary>
            [XmlAttribute(AttributeName = ReferenceTransactionLocationAttributeName)]
            [DefaultValue("")]
            public string ReferenceTransactionLocation { get; set; }

            /// <summary>
            /// The reference transaction terminal.
            /// </summary>
            [XmlAttribute(AttributeName = ReferenceTransactionTerminalAttributeName)]
            [DefaultValue("")]
            public string ReferenceTransactionTerminal { get; set; }

            /// <summary>
            /// The reference transaction number.
            /// </summary>
            [XmlAttribute(AttributeName = ReferenceTransactionNumberAttributeName)]
            [DefaultValue("")]
            public string ReferenceTransactionNumber { get; set; }

            /// <summary>
            /// The reference position number.
            /// </summary>
            [XmlAttribute(AttributeName = ReferencePositionNumberAttributeName)]
            [DefaultValue(0)]
            public int ReferencePositionNumber { get; set; }

            /// <summary>
            /// The CZ fields for transaction marking.
            /// </summary>
            [XmlAttribute(AttributeName = CZFieldAttributeName)]
            [DefaultValue(0)]
            public int CZField { get; set; }

            /// <summary>
            /// ID of the voucher.
            /// </summary>
            [XmlAttribute(AttributeName = VoucherIDAttributeName)]
            [DefaultValue("")]
            public string VoucherId { get; set; }

            /// <summary>
            /// Void of position inside same receipt.
            /// </summary>
            [XmlIgnore]
            public bool Void { get; set; }

            /// <summary>
            /// The receipt void formatted for serialization.
            /// </summary>
            [XmlAttribute(AttributeName = VoidAttributeName)]
            [DefaultValue("")]
            public string VoidStringValue
            {
                get
                {
                    return Void ? VoidSign : string.Empty;
                }

                set
                {
                    Void = Boolean.Parse(value);
                }
            }
        }
    }
}
