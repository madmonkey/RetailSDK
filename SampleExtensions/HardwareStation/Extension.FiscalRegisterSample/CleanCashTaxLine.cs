namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        /// <summary>
        /// Clean cash fiscal register request tax line.
        /// </summary>
        /// <remarks>Contains fiscal transaction tax data converted into clean cash device specific format.</remarks>
        internal class CleanCashTaxLine
        {
            private const decimal ZeroAmount = 0.0M;

            /// <summary>
            /// Initializes a new instance of the <see cref="CleanCashTaxLine" /> class with default properties values.
            /// </summary>
            public CleanCashTaxLine()
            {
                this.TaxAmount = ZeroAmount;
                this.TaxPercentage = ZeroAmount;
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="CleanCashTaxLine" /> class.
            /// </summary>
            /// <param name="taxAmount">Tax amount.</param>
            /// <param name="taxPercentage">Tax percentage.</param>
            public CleanCashTaxLine(decimal taxAmount, decimal taxPercentage)
            {
                this.TaxAmount = taxAmount;
                this.TaxPercentage = taxPercentage;
            }

            /// <summary>
            /// Gets or sets the tax amount.
            /// </summary>
            public decimal TaxAmount { get; set; }

            /// <summary>
            /// Gets or sets the tax percentage.
            /// </summary>
            public decimal TaxPercentage { get; set; }
        }
    }
}
