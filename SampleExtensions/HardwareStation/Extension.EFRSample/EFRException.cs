namespace Contoso
{
    namespace Commerce.HardwareStation.EFRSample
    {
        using System;
        using Microsoft.Dynamics.Commerce.HardwareStation;

        /// <summary>
        /// Thrown during the fiscal register errors.
        /// </summary>
        public class EFRException : HardwareStationException
        {
            /// <summary>
            /// The fiscal register endpoint address configuration error.
            /// </summary>
            public static readonly string FiscalRegisterEndpointAddressConfigurationErrorResourceId = "Microsoft_Dynamics_Commerce_HardwareStation_EFR_Connection_Configuration_Error";

            /// <summary>
            /// Initializes a new instance of the <see cref="EFRException"/> class.
            /// </summary>
            /// <param name="errorResourceId">The error resource ID.</param>
            /// <param name="message">The message containing format strings.</param>
            /// <param name="args">The arguments to the message format string.</param>
            public EFRException(string errorResourceId, string message, params object[] args)
                : base(errorResourceId, message, args)
            {
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="EFRException"/> class.
            /// </summary>
            /// <param name="errorResourceId">The error resource id.</param>
            /// <param name="message">The message.</param>
            /// <param name="inner">The inner exception.</param>
            public EFRException(string errorResourceId, string message, Exception inner)
                : base(errorResourceId, message, inner)
            {
            }
        }
    }
}
