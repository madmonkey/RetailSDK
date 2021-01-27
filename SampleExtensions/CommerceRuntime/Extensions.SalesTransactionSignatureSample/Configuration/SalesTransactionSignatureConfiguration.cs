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
    namespace Commerce.Runtime.SalesTransactionSignatureSample.Configuration
    {
        using System;
        using System.Configuration;
        using System.IO;
        using System.Reflection;
        using System.Security.Cryptography.X509Certificates;

        /// <summary>
        /// Encapsulates functionality for reading the sales transaction signature configuration.
        /// </summary>
        public class SalesTransactionSignatureConfiguration
        {
            /// <summary>
            /// Represents the sales transaction signature section name in the configuration file.
            /// </summary>
            private const string SalesTransactionSignatureConfigSectionName = "SalesTransactionSignature";
            private const string ConfigSectionsName = "configSections";

            /// <summary>
            /// The signature service configuration file not found error.
            /// </summary>
            private const string FileNotFoundExceptionMessageResourceId = "Configuration_FileNotFoundExceptionMessage";

            /// <summary>
            /// The signature service configuration section not found error.
            /// </summary>
            private const string SectionNotFoundExceptionMessageResourceId = "Configuration_SectionNotFoundExceptionMessage";

            /// <summary>
            /// The signature service configuration section missing thumbprint error.
            /// </summary>
            private const string SectionShouldContainsThumbprintExceptionMessageResourceId = "Configuration_SectionShouldContainsThumbprintExceptionMessage";

            /// <summary>
            /// The signature service configuration section missing certificate store name and location error.
            /// </summary>
            private const string SectionShouldContainsStoreNameAndLocationExceptionMessageResourceId = "Configuration_SectionShouldContainsStoreNameAndLocationExceptionMessage";

            /// <summary>
            /// The signature service configuration section contains invalid attribute value.
            /// </summary>
            private const string SectionShouldContainsValidAttributeValueExceptionMessageResourceId = "Configuration_SectionShouldContainsValidAttributeValueExceptionMessage";

            /// <summary>
            /// The certificate store location attribute name.
            /// </summary>
            private const string CertificateStoreLocationAttributeName = "certificateStoreLocation";

            /// <summary>
            /// The certificate store name attribute name.
            /// </summary>
            private const string CertificateStoreNameAttributeName = "certificateStoreName";

            private static readonly Lazy<SalesTransactionSignatureConfiguration> ConfigInstance = new Lazy<SalesTransactionSignatureConfiguration>(() => new SalesTransactionSignatureConfiguration());

            /// <summary>
            /// Represents current culture to display localized exception messages.
            /// </summary>
            private static string currentCultureName;

            private SalesTransactionSignatureConfiguration()
            {
                try
                {
                    this.SalesTransactionSignatureConfigSection = this.GetSalesTransactionSignatureConfigSectionFromAssemblyConfiguration();
                }
                catch (Exception ex)
                {
                    throw new SalesTransactionSignatureConfigurationException(ex.Message, ex);
                }
            }

            /// <summary>
            /// Gets the sales transaction signature configuration section.
            /// </summary>
            /// <value>
            /// The sales transaction signature configuration section.
            /// </value>
            public SalesTransactionSignatureConfigSection SalesTransactionSignatureConfigSection { get; private set; }

            /// <summary>
            /// Gets the single instance of the <see cref="SalesTransactionSignatureConfiguration"/> class.
            /// </summary>
            /// <param name="cultureName">Culture to display localized exception messages.</param>
            /// <returns>Returns the instance of <c>"SalesTransactionSignatureConfiguration</c>/>.</returns>
            public static SalesTransactionSignatureConfiguration GetInstance(string cultureName)
            {
                currentCultureName = cultureName;
                return ConfigInstance.Value;
            }

            /// <summary>
            /// Gets the sales transaction signature configuration section from the assembly configuration file (<c>SalesTransactionSignatureSample.dll.config</c>).
            /// </summary>
            /// <returns>Returns the config section.</returns>
            private SalesTransactionSignatureConfigSection GetSalesTransactionSignatureConfigSectionFromAssemblyConfiguration()
            {
                SalesTransactionSignatureConfigSection salesTransactionSignatureConfigSection = null;

                var executingAssemblyCodeBase = typeof(SalesTransactionSignatureConfigSection).GetTypeInfo().Assembly.CodeBase;
                Uri assemblyUri = new Uri(executingAssemblyCodeBase);

                string assemblyConfigFileName = string.Format("{0}.config", assemblyUri.LocalPath);

                if (!File.Exists(assemblyConfigFileName))
                {
                    var exceptionMessage = SalesTransactionSignatureLocalizer.Instance.Translate(currentCultureName, FileNotFoundExceptionMessageResourceId);
                    throw new FileNotFoundException(string.Format(exceptionMessage, assemblyConfigFileName));
                }

                var configFileMap = new ExeConfigurationFileMap { ExeConfigFilename = assemblyConfigFileName };
                var configuration = ConfigurationManager.OpenMappedExeConfiguration(configFileMap, ConfigurationUserLevel.None);
                salesTransactionSignatureConfigSection = configuration.GetSection(SalesTransactionSignatureConfigSectionName) as SalesTransactionSignatureConfigSection;

                if (salesTransactionSignatureConfigSection == null)
                {
                    var exceptionMessage = SalesTransactionSignatureLocalizer.Instance.Translate(currentCultureName, SectionNotFoundExceptionMessageResourceId);
                    throw new ConfigurationErrorsException(string.Format(exceptionMessage, SalesTransactionSignatureConfigSectionName, ConfigSectionsName));
                }

                if (string.IsNullOrEmpty(salesTransactionSignatureConfigSection.CertificateThumbprint))
                {
                    var exceptionMessage = SalesTransactionSignatureLocalizer.Instance.Translate(currentCultureName, SectionShouldContainsThumbprintExceptionMessageResourceId);
                    throw new ConfigurationErrorsException(exceptionMessage);
                }

                var certificateStoreName = salesTransactionSignatureConfigSection.CertificateStoreName;
                var certificateStoreLocation = salesTransactionSignatureConfigSection.CertificateStoreLocation;

                // Certificate store name and location depends each other and should be set simultaneously or skipped entirely.
                if ((string.IsNullOrEmpty(certificateStoreName) && !string.IsNullOrEmpty(certificateStoreLocation)) || (string.IsNullOrEmpty(certificateStoreLocation) && !string.IsNullOrEmpty(certificateStoreName)))
                {
                    var exceptionMessage = SalesTransactionSignatureLocalizer.Instance.Translate(currentCultureName, SectionShouldContainsStoreNameAndLocationExceptionMessageResourceId);
                    throw new ConfigurationErrorsException(exceptionMessage);
                }

                bool parseResult;
                StoreLocation certificateStoreLocationParsed;
                parseResult = Enum.TryParse<StoreLocation>(certificateStoreLocation, out certificateStoreLocationParsed);
                if (!string.IsNullOrEmpty(certificateStoreLocation) && !parseResult)
                {
                    var exceptionMessage = string.Format(SalesTransactionSignatureLocalizer.Instance.Translate(currentCultureName, SectionShouldContainsValidAttributeValueExceptionMessageResourceId), CertificateStoreLocationAttributeName);
                    throw new ConfigurationErrorsException(exceptionMessage);
                }

                StoreName certificateStoreNameParsed;
                parseResult = Enum.TryParse<StoreName>(certificateStoreName, out certificateStoreNameParsed);
                if (!string.IsNullOrEmpty(certificateStoreName) && !parseResult)
                {
                    var exceptionMessage = string.Format(SalesTransactionSignatureLocalizer.Instance.Translate(currentCultureName, SectionShouldContainsValidAttributeValueExceptionMessageResourceId), CertificateStoreNameAttributeName);
                    throw new ConfigurationErrorsException(exceptionMessage);
                }

                return salesTransactionSignatureConfigSection;
            }
        }
    }
}
