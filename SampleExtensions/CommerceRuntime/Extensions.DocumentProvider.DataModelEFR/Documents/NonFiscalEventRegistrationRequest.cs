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
        using System.Xml.Serialization;

        /// <summary>
        /// The request document to register a non-fiscal event.
        /// </summary>
        [Serializable]
        [XmlRoot(ElementName = RootElementName)]
        public class NonFiscalEventRegistrationRequest : IFiscalIntegrationDocument
        {
            private const string RootElementName = "Tra";
            private const string ReceiptElementName = "ESR";

            /// <summary>
            /// The receipt.
            /// </summary>
            [XmlElement(ElementName = ReceiptElementName)]
            public NonFiscalReceipt Receipt { get; set; }
        }
    }
}
