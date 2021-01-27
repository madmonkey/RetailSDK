namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System;
        using System.Collections.Generic;
        using System.Runtime.Serialization;

        /// <summary>
        /// Fiscal register transaction data structure class.
        /// </summary>
        [DataContract]
        public class FiscalTransactionInfo
        {
            /// <summary>
            /// Gets or sets store ID.
            /// </summary>
            [DataMember]
            public string StoreId { get; set; }

            /// <summary>
            /// Gets or sets store tax registration ID number.
            /// </summary>
            [DataMember]
            public string StoreTaxRegNumber { get; set; }

            /// <summary>
            /// Gets or sets terminal ID.
            /// </summary>
            [DataMember]
            public string TerminalId { get; set; }

            /// <summary>
            /// Gets or sets transaction type.
            /// </summary>
            [DataMember]
            public FiscalTransactionType TransactionType { get; set; }

            /// <summary>
            /// Gets or sets a value indicating whether transaction is the return order.
            /// </summary>
            [DataMember]
            public bool IsReturn { get; set; }

            /// <summary>
            /// Gets or sets receipt id.
            /// </summary>
            [DataMember]
            public string ReceiptId { get; set; }

            /// <summary>
            /// Gets or sets transaction date Coordinated Universal Time (UTC time).
            /// </summary>
            [DataMember]
            public DateTime TransactionDate { get; set; }

            /// <summary>
            /// Gets or sets transaction date time zone offset in minutes.
            /// </summary>
            [DataMember]
            public int TimezoneOffsetInMinutes { get; set; }

            /// <summary>
            /// Gets or sets total amount.
            /// </summary>
            [DataMember]
            public decimal TotalAmount { get; set; }

            /// <summary>
            /// Gets or sets tax lines collection.
            /// </summary>
            [DataMember]
            public IEnumerable<FiscalTaxInfo> TaxLines { get; set; }
        }
    }
}