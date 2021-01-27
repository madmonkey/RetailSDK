namespace Contoso
{
    namespace Commerce.Runtime.DocumentProvider.DataModelEFR.Documents
    {
        using System;
        using System.ComponentModel;
        using System.Xml.Serialization;

        /// <summary>
        /// The receipt customer.
        /// </summary>
        [Serializable]
        public class ReceiptCustomer
        {
            private const string CustomerNumberAttributeName = "CN";
            private const string CustomerNameAttributeName = "Nam";
            private const string AddressAttributeName = "Adr";
            private const string VatNumberAttributeName = "TaxId";

            /// <summary>
            /// Number of the Customer.
            /// </summary>
            [XmlAttribute(AttributeName = CustomerNumberAttributeName)]
            [DefaultValue("")]
            public string CustomerNumber { get; set; }

            /// <summary>
            /// Customer or Company Name.
            /// </summary>
            [XmlAttribute(AttributeName = CustomerNameAttributeName)]
            [DefaultValue("")]
            public string CustomerName { get; set; }

            /// <summary>
            /// Customer or Company Address within City.
            /// </summary>
            [XmlAttribute(AttributeName = AddressAttributeName)]
            [DefaultValue("")]
            public string Address { get; set; }

            /// <summary>
            /// Customer or Company VAT Number including eventual country/region prefix.
            /// </summary>
            [XmlAttribute(AttributeName = VatNumberAttributeName)]
            [DefaultValue("")]
            public string VatNumber { get; set; }
        }
    }
}
