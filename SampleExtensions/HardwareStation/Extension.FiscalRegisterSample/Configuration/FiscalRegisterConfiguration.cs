namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System;
        using System.Configuration;
        using System.Globalization;
        using System.IO;
        using System.Reflection;

        /// <summary>
        /// Encapsulates functionality for reading the fiscal register configuration.
        /// </summary>
        public class FiscalRegisterConfiguration
        {
            /// <summary>
            /// Represents the fiscal register section name in the configuration file.
            /// </summary>
            private const string FiscalRegisterConfigSectionName = "FiscalRegister";
            private const string ConfigSectionsName = "configSections";

            private const string FiscalRegisterConfigFileNotFoundExceptionMessage = "A fiscal register configuration file '{0}' cannot be found for this Hardware station.";
            private static readonly string FiscalRegisterConfigurationSectionNotFoundExceptionMessage = string.Format("The configuration section '{0}' does not exist in the '{1}' section of the fiscal register configuration file.", FiscalRegisterConfigSectionName, ConfigSectionsName);

            private static readonly Lazy<FiscalRegisterConfiguration> ConfigInstance = new Lazy<FiscalRegisterConfiguration>(() => new FiscalRegisterConfiguration());

            /// <summary>
            /// Prevents a default instance of the <see cref="FiscalRegisterConfiguration" /> class from being created.
            /// </summary>
            private FiscalRegisterConfiguration()
            {
                try
                {
                    this.FiscalRegisterConfigSection = this.GetFiscalRegisterConfigSectionFromAssemblyConfiguration();
                }
                catch (ConfigurationErrorsException)
                {
                    throw;
                }
                catch (Exception ex)
                {
                    throw new FiscalRegisterException(FiscalRegisterException.FiscalRegisterConnectionConfigurationErrorResourceId, ex.Message, ex);
                }
            }

            /// <summary>
            /// Gets the single instance of the <see cref="FiscalRegisterConfiguration"/> class.
            /// </summary>
            public static FiscalRegisterConfiguration Instance
            {
                get { return ConfigInstance.Value; }
            }

            /// <summary>
            /// Gets the fiscal register configuration section.
            /// </summary>
            /// <value>
            /// The fiscal register configuration section.
            /// </value>
            public FiscalRegisterConfigSection FiscalRegisterConfigSection { get; private set; }

            /// <summary>
            /// Gets the fiscal register configuration section from the assembly configuration file (<c>FiscalRegisterSample.dll.config</c>).
            /// </summary>
            /// <returns>Returns the config section.</returns>
            private FiscalRegisterConfigSection GetFiscalRegisterConfigSectionFromAssemblyConfiguration()
            {
                FiscalRegisterConfigSection fiscalRegisterConfigSection = null;

                Uri assemblyUri = new Uri(Assembly.GetExecutingAssembly().CodeBase);
                string assemblyConfigFileName = string.Format("{0}.config", assemblyUri.LocalPath);

                if (!File.Exists(assemblyConfigFileName))
                {
                    throw new FileNotFoundException(string.Format(FiscalRegisterConfigFileNotFoundExceptionMessage, assemblyConfigFileName));
                }

                var configFileMap = new ExeConfigurationFileMap { ExeConfigFilename = assemblyConfigFileName };
                var configuration = ConfigurationManager.OpenMappedExeConfiguration(configFileMap, ConfigurationUserLevel.None);
                fiscalRegisterConfigSection = configuration.GetSection(FiscalRegisterConfigSectionName) as FiscalRegisterConfigSection;

                if (fiscalRegisterConfigSection == null)
                {
                    throw new ConfigurationErrorsException(FiscalRegisterConfigurationSectionNotFoundExceptionMessage);
                }

                return fiscalRegisterConfigSection;
            }
        }
    }
}
