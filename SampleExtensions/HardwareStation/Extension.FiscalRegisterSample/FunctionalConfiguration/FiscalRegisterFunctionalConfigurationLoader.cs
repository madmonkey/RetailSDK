namespace Contoso
{
    using System;
    using System.IO;
    using System.Runtime.Serialization;
    using System.Text;
    using System.Xml;
    using System.Xml.Serialization;

    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        /// <summary>
        /// Encapsulates functionality for reading the fiscal register functional configuration.
        /// </summary>
        public static class FiscalRegisterFunctionalConfigurationLoader
        {
            /// <summary>
            /// Gets the fiscal register functional configuration from the serialized string. 
            /// </summary>
            /// <param name="serializedConfiguration">The string with the serialized configuration.</param>
            /// <returns>The instance of the <c>FiscalRegisterFunctionalConfiguration</c> class.</returns>
            public static FiscalRegisterFunctionalConfiguration GetFunctionalConfiguration(string serializedConfiguration)
            {
                if (string.IsNullOrEmpty(serializedConfiguration))
                {
                    throw new ArgumentNullException("serializedConfiguration");
                }

                FiscalRegisterFunctionalConfiguration functionalConfiguration;

                using (StringReader stringReader = new StringReader(serializedConfiguration))
                {
                    XmlReaderSettings xmlReaderSettings = new XmlReaderSettings();
                    xmlReaderSettings.XmlResolver = null;

                    XmlReader xmlReader = XmlReader.Create(stringReader, xmlReaderSettings);
                    XmlSerializer deserializer = new XmlSerializer(typeof(FiscalRegisterFunctionalConfiguration));
                    functionalConfiguration = deserializer.Deserialize(xmlReader) as FiscalRegisterFunctionalConfiguration;
                }

                return functionalConfiguration;
            }
        }
    }
}