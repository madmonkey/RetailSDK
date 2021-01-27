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
    namespace Commerce.Runtime.SequentialSignatureRegister
    {
        using System;

        /// <summary>
        /// Thrown during the read of sequential signature register configuration.
        /// </summary>
        [Serializable]
        public class SequentialSignatureRegisterConfigurationException : Exception
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="SequentialSignatureRegisterConfigurationException"/> class.
            /// </summary>
            public SequentialSignatureRegisterConfigurationException()
            {
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="SequentialSignatureRegisterConfigurationException"/> class.
            /// </summary>
            /// <param name="message">The message.</param>
            public SequentialSignatureRegisterConfigurationException(string message) : base(message)
            {
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="SequentialSignatureRegisterConfigurationException"/> class.
            /// </summary>
            /// <param name="message">The message.</param>
            /// <param name="inner">The inner exception.</param>
            public SequentialSignatureRegisterConfigurationException(string message, Exception inner) : base(message, inner)
            {
            }
        }
    }
}
