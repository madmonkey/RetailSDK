namespace Contoso
{
    using System;
    using System.Collections.ObjectModel;
    using System.Xml.Serialization;

    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        /// <summary>
        /// Represents the fiscal register functional configuration.
        /// </summary>
        [Serializable]
        [XmlRoot("UnitConfiguration")]
        public class FiscalRegisterFunctionalConfiguration
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="FiscalRegisterFunctionalConfiguration"/> class.
            /// </summary>
            public FiscalRegisterFunctionalConfiguration()
            {
                this.TaxMapping = new Collection<FiscalRegisterTaxMapping>();
            }

            /// <summary>
            /// Gets or sets the collection of <c>FiscalRegisterTaxMappingItem</c> mappings between HQ tax codes and fiscal register VAT numbers.
            /// </summary>
            public Collection<FiscalRegisterTaxMapping> TaxMapping { get; set; }
        }
    }
}
