/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */
namespace Contoso
{
    namespace Commerce.Client.Pos
    {
        using System.Xml.Serialization;
        using Microsoft.Dynamics.Retail.Diagnostics;

        /// <summary>
        /// Represents the POS configuration.
        /// </summary>
        [XmlRoot(ElementName = "configuration")]
        public sealed class PosConfiguration
        {
            private const string DiagnosticsSectionAttributeName = "diagnosticsSection";

            /// <summary>
            /// Gets or sets the diagnostics section.
            /// </summary>
            [XmlElement(ElementName = DiagnosticsSectionAttributeName)]
            public DiagnosticsConfig DiagnosticsConfig { get; set; }
        }
    }
}