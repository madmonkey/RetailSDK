namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System.Runtime.Serialization;

        /// <summary>
        /// Fiscal register tax information data structure class.
        /// </summary>
        [DataContract]
        public class FiscalTaxInfo
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="FiscalTaxInfo" /> class.
            /// </summary>
            /// <param name="taxCode">Tax code.</param>
            /// <param name="taxAmount">Tax amount.</param>
            /// <param name="taxPercentage">Tax percentage.</param>
            public FiscalTaxInfo(string taxCode, decimal taxAmount, decimal taxPercentage)
            {
                this.TaxCode = taxCode;
                this.TaxAmount = taxAmount;
                this.TaxPercentage = taxPercentage;
            }

            /// <summary>
            /// Gets or sets the tax code.
            /// </summary>
            [DataMember]
            public string TaxCode { get; set; }

            /// <summary>
            /// Gets or sets the tax amount.
            /// </summary>
            [DataMember]
            public decimal TaxAmount { get; set; }

            /// <summary>
            /// Gets or sets the tax percentage.
            /// </summary>
            [DataMember]
            public decimal TaxPercentage { get; set; }
        }
    }
}