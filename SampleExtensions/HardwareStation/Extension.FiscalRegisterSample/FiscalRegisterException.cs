namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System;
        using Microsoft.Dynamics.Commerce.HardwareStation;

        /// <summary>
        /// Thrown during the fiscal register errors.
        /// </summary>
        public class FiscalRegisterException : HardwareStationException
        {
            /// <summary>
            /// The fiscal register generic error.
            /// </summary>
            public static readonly string FiscalRegisterErrorResourceId = "Microsoft_Dynamics_Commerce_HardwareStation_FiscalRegister_Error";

            /// <summary>
            /// The fiscal register connection configuration error.
            /// </summary>
            public static readonly string FiscalRegisterConnectionConfigurationErrorResourceId = "Microsoft_Dynamics_Commerce_HardwareStation_FiscalRegister_Connection_Configuration_Error";

            /// <summary>
            /// The fiscal register functional configuration error.
            /// </summary>
            public static readonly string FiscalRegisterFunctionalConfigurationErrorResourceId = "Microsoft_Dynamics_Commerce_HardwareStation_FiscalRegister_Functional_Configuration_Error";

            /// <summary>
            /// Initializes a new instance of the <see cref="FiscalRegisterException"/> class.
            /// </summary>
            /// <param name="errorResourceId">The error resource ID.</param>
            /// <param name="message">The message containing format strings.</param>
            /// <param name="args">The arguments to the message format string.</param>
            public FiscalRegisterException(string errorResourceId, string message, params object[] args)
                : base(errorResourceId, message, args)
            {
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="FiscalRegisterException"/> class.
            /// </summary>
            /// <param name="errorResourceId">The error resource id.</param>
            /// <param name="message">The message.</param>
            /// <param name="inner">The inner exception.</param>
            public FiscalRegisterException(string errorResourceId, string message, Exception inner)
                : base(errorResourceId, message, inner)
            {
            }
        }
    }
}
