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
    namespace Commerce.Runtime.SequentialSignatureRegister.Configuration
    {
        using System.Configuration;

        /// <summary>
        /// Represents the configuration section for sequential signature register.
        /// </summary>
        public class SequentialSignatureRegisterConfigSection : ConfigurationSection
        {
            private const string CertificateThumbprintAttributeName = "certificateThumbprint";
            private const string CertificateStoreLocationAttributeName = "certificateStoreLocation";
            private const string CertificateStoreNameAttributeName = "certificateStoreName";

            /// <summary>
            /// Gets the sales transaction signature certificate thumbprint.
            /// </summary>
            [ConfigurationProperty(CertificateThumbprintAttributeName)]
            public string CertificateThumbprint
            {
                get { return this[CertificateThumbprintAttributeName] as string; }
            }

            /// <summary>
            /// Gets the sales transaction signature certificate store location.
            /// </summary>
            [ConfigurationProperty(CertificateStoreLocationAttributeName)]
            public string CertificateStoreLocation
            {
                get { return this[CertificateStoreLocationAttributeName] as string; }
            }

            /// <summary>
            /// Gets the sales transaction signature certificate store name.
            /// </summary>
            [ConfigurationProperty(CertificateStoreNameAttributeName)]
            public string CertificateStoreName
            {
                get { return this[CertificateStoreNameAttributeName] as string; }
            }
        }
    }
}
