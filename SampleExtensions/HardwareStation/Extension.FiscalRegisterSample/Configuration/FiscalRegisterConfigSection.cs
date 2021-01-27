namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System.Configuration;

        /// <summary>
        /// Represents the configuration section for the fiscal register configuration.
        /// </summary>
        public class FiscalRegisterConfigSection : ConfigurationSection
        {
            private const string ConnectionStringAttributeName = "connectionString";

            /// <summary>
            /// Gets the fiscal register connection string.
            /// </summary>
            [ConfigurationProperty(ConnectionStringAttributeName)]
            public string ConnectionString
            {
                get { return this[ConnectionStringAttributeName] as string; }
            }
        }
    }
}
