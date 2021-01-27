namespace Contoso
{
    namespace Commerce.HardwareStation.CleanCashSample
    {
        using Interop.CleanCash_1_1;
        using System;

        /// <summary>
        /// Thrown during the fiscal register errors.
        /// </summary>
        public class CleanCashDeviceException : Exception
        {
            /// <summary>
            /// The communication error code.
            /// </summary>
            public CommunicationResult ResultCode { get; set; }

            /// <summary>
            /// Initializes a new instance of the <see cref="CleanCashDeviceException"/> class.
            /// </summary>
            /// <param name="resultCode">The communication error code.</param>
            /// <param name="errorMessage">The message containing format strings.</param>
            public CleanCashDeviceException(CommunicationResult resultCode, string errorMessage)
                : base(errorMessage)
            {
                this.ResultCode = resultCode;
            }
        }
    }
}
