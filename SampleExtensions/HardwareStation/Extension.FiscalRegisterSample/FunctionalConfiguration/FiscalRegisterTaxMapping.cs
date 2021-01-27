namespace Contoso
{
    using System;
    using System.Xml.Serialization;

    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        /// <summary>
        /// Represents single mapping between HQ tax code and fiscal register VAT number.
        /// </summary>
        [Serializable]
        [XmlType("Tax")]
        public class FiscalRegisterTaxMapping
        {
            /// <summary>
            /// Gets or sets the HQ tax code identifier.
            /// </summary>
            [XmlAttribute("taxCode")]
            public string TaxCode { get; set; }

            /// <summary>
            /// Gets or sets the fiscal register VAT number.
            /// </summary>
            [XmlAttribute("controlUnitTaxId")]
            public int VATnumber { get; set; }
        }
    }
}
