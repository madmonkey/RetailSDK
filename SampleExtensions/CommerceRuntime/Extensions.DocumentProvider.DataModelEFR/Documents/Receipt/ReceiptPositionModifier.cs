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
        /// The receipt position modifier.
        /// </summary>
        [Serializable]
        public class ReceiptPositionModifier
        {
            private const string PositionNumberAttributeName = "PN";
            private const string DescriptionAttributeName = "Dsc";
            private const string AmountAttributeName = "Amt";

            /// <summary>
            /// The modified position numbers.
            /// </summary>
            [XmlAttribute(AttributeName = PositionNumberAttributeName)]
            [DefaultValue(0)]
            public int PositionNumber { get; set; }

            /// <summary>
            /// The description.
            /// </summary>
            [XmlAttribute(AttributeName = DescriptionAttributeName)]
            [DefaultValue("")]
            public string Description { get; set; }

            /// <summary>
            /// The delta amount.
            /// </summary>
            [XmlIgnore]
            public decimal Amount { get; set; }

            /// <summary>
            /// The delta amount formatted for serialization.
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
        }
    }
}
