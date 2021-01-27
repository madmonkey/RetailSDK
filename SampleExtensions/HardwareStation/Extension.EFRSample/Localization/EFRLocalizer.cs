namespace Contoso
{
    namespace Commerce.HardwareStation.EFRSample
    {
        using System.Composition;
        using System.Reflection;
        using Microsoft.Dynamics.Commerce.HardwareStation.Localization;

        /// <summary>
        /// The Hardware Station exception localization helper class.
        /// </summary>
        [Export("HARDWARESTATIONEXCEPTIONLOCALIZER", typeof(IHardwareStationLocalizer))]
        public class EFRLocalizer : HardwareStationLocalizer
        {
            /// <summary>
            /// Exception localizable message resource file name.
            /// </summary>
            private static readonly string ExceptionResourceFileName = string.Format("{0}.{1}", typeof(EFRLocalizer).Namespace, "Properties.Exception.Messages");

            /// <summary>
            /// Initializes a new instance of the <see cref="EFRLocalizer"/> class with runtime default localization resource.
            /// </summary>
            public EFRLocalizer()
                : base(ExceptionResourceFileName, typeof(EFRLocalizer).GetTypeInfo().Assembly)
            {
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="EFRLocalizer"/> class with base resource file name and current assembly.
            /// </summary>
            /// <param name="baseResourceFileName">The base resource file full name.</param>
            /// <param name="baseResourceFileAssembly">The assembly that contains base resource file.</param>
            public EFRLocalizer(string baseResourceFileName, Assembly baseResourceFileAssembly)
                : base(baseResourceFileName, baseResourceFileAssembly)
            {
            }
        }
    }
}
