namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System;
        using System.Collections.Generic;
        using System.Globalization;
        using Interop.CleanCash_1_1;

        /// <summary>
        /// Clean cash fiscal register request.
        /// </summary>
        /// <remarks>Contains fiscal transaction data converted into clean cash device specific format.</remarks>
        internal class CleanCashRequest
        {
            private const decimal ZeroAmount = 0.0M;

            private const string TaxCodeDoesNotHaveCorrespondingControlUnitVATGroup = "The tax code {0} does not have a corresponding control unit VAT group.";
            private const string TaxCodesWithUnequalTaxRatesMappedToSingleVATGroup = "Tax codes with unequal tax rates are mapped to the control unit VAT group {0}.";

            // Swedish culture should be used since Clean cash fiscal register device is Swedish specific.
            private readonly CultureInfo swedishCulture = new CultureInfo("sv-SE");

            /// <summary>
            /// Initializes a new instance of the <see cref="CleanCashRequest" /> class.
            /// </summary>
            /// <param name="fiscalTransaction">Fiscal transaction.</param>
            /// <param name="taxMapping">The mapping between tax and device VAT register number.</param>
            public CleanCashRequest(FiscalTransactionInfo fiscalTransaction, Dictionary<string, int> taxMapping)
            {
                this.InitFromFiscalTransaction(fiscalTransaction);
                this.InitVatRegisters(fiscalTransaction, taxMapping);
            }

            /// <summary>
            /// Gets or sets the organization number.
            /// </summary>
            public string OrgNumber { get; set; }

            /// <summary>
            /// Gets or sets the terminal ID.
            /// </summary>
            public string TerminalId { get; set; }

            /// <summary>
            /// Gets or sets the transaction date.
            /// </summary>
            public string TransactionDate { get; set; }

            /// <summary>
            /// Gets or sets the receipt ID.
            /// </summary>
            public string ReceiptId { get; set; }

            /// <summary>
            /// Gets or sets the transaction type.
            /// </summary>
            public CommunicationReceipt TransactionType { get; set; }

            /// <summary>
            /// Gets or sets the total amount.
            /// </summary>
            public string TotalAmount { get; set; }

            /// <summary>
            /// Gets or sets the negative amount.
            /// </summary>
            public string NegativeAmount { get; set; }

            /// <summary>
            /// Gets or sets the VAT1 field.
            /// </summary>
            public string VAT1 { get; set; }

            /// <summary>
            /// Gets or sets the VAT2 field.
            /// </summary>
            public string VAT2 { get; set; }

            /// <summary>
            /// Gets or sets the VAT3 field.
            /// </summary>
            public string VAT3 { get; set; }

            /// <summary>
            /// Gets or sets the VAT4 field.
            /// </summary>
            public string VAT4 { get; set; }

            /// <summary>
            /// Initializes class instance form the fiscal transaction.
            /// </summary>
            /// <param name="fiscalTransaction">The fiscal transaction.</param>
            private void InitFromFiscalTransaction(FiscalTransactionInfo fiscalTransaction)
            {
                this.OrgNumber = fiscalTransaction.StoreTaxRegNumber;
                this.TerminalId = fiscalTransaction.TerminalId;
                this.TransactionDate = fiscalTransaction.TransactionDate.AddMinutes(-fiscalTransaction.TimezoneOffsetInMinutes).ToString("yyyyMMddHHmm");
                this.ReceiptId = fiscalTransaction.ReceiptId;
                this.TransactionType = (CommunicationReceipt)fiscalTransaction.TransactionType;
                this.TotalAmount = fiscalTransaction.TotalAmount.ToString("0.00", this.swedishCulture);
                this.NegativeAmount = fiscalTransaction.IsReturn ?
                    Math.Abs(fiscalTransaction.TotalAmount).ToString("0.00", this.swedishCulture) :
                    ZeroAmount.ToString("0.00", this.swedishCulture);
            }

            /// <summary>
            /// Initializes values of VAT registers by fiscal transaction taxes.
            /// </summary>
            /// <param name="fiscalTransaction">Fiscal transaction.</param>
            /// <param name="taxMapping">The mapping between tax and device VAT register number.</param>
            private void InitVatRegisters(FiscalTransactionInfo fiscalTransaction, Dictionary<string, int> taxMapping)
            {
                var cleanCashTaxLines = new Dictionary<int, CleanCashTaxLine>();

                foreach (var tax in fiscalTransaction.TaxLines)
                {
                    if (!taxMapping.ContainsKey(tax.TaxCode))
                    {
                        throw new FiscalRegisterException(FiscalRegisterException.FiscalRegisterFunctionalConfigurationErrorResourceId, TaxCodeDoesNotHaveCorrespondingControlUnitVATGroup, tax.TaxCode);
                    }

                    int cleanCashVATRegisterId = taxMapping[tax.TaxCode];

                    if (cleanCashTaxLines.ContainsKey(cleanCashVATRegisterId))
                    {
                        var cleanCashTaxLine = cleanCashTaxLines[cleanCashVATRegisterId];

                        if (cleanCashTaxLine.TaxPercentage != tax.TaxPercentage)
                        {
                            throw new FiscalRegisterException(FiscalRegisterException.FiscalRegisterFunctionalConfigurationErrorResourceId, TaxCodesWithUnequalTaxRatesMappedToSingleVATGroup, cleanCashVATRegisterId);
                        }

                        cleanCashTaxLine.TaxAmount += tax.TaxAmount;
                    }
                    else
                    {
                        var cleanCashTaxLine = new CleanCashTaxLine(tax.TaxAmount, tax.TaxPercentage);
                        cleanCashTaxLines.Add(cleanCashVATRegisterId, cleanCashTaxLine);
                    }
                }

                this.VAT1 = this.GetVATStrValue(cleanCashTaxLines, 1);
                this.VAT2 = this.GetVATStrValue(cleanCashTaxLines, 2);
                this.VAT3 = this.GetVATStrValue(cleanCashTaxLines, 3);
                this.VAT4 = this.GetVATStrValue(cleanCashTaxLines, 4);
            }

            private string GetVATStrValue(Dictionary<int, CleanCashTaxLine> cleanCashTaxLines, int taxLineId)
            {
                CleanCashTaxLine cleanCashTaxLine = cleanCashTaxLines.ContainsKey(taxLineId) ? cleanCashTaxLines[taxLineId] : new CleanCashTaxLine();

                return string.Format("{0};{1}", Math.Abs(cleanCashTaxLine.TaxPercentage).ToString("0.00", this.swedishCulture), cleanCashTaxLine.TaxAmount.ToString("0.00", this.swedishCulture));
            }
        }
    }
}
