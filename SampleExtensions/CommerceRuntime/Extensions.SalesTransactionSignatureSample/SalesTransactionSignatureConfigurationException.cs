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
    namespace Commerce.Runtime.SalesTransactionSignatureSample
    {
        using System;

        /// <summary>
        /// Thrown during the read of sales transaction signature configuration.
        /// </summary>
        [Serializable]
        public class SalesTransactionSignatureConfigurationException : Exception
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="SalesTransactionSignatureConfigurationException"/> class.
            /// </summary>
            public SalesTransactionSignatureConfigurationException()
            {
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="SalesTransactionSignatureConfigurationException"/> class.
            /// </summary>
            /// <param name="message">The message.</param>
            public SalesTransactionSignatureConfigurationException(string message) : base(message)
            {
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="SalesTransactionSignatureConfigurationException"/> class.
            /// </summary>
            /// <param name="message">The message.</param>
            /// <param name="inner">The inner exception.</param>
            public SalesTransactionSignatureConfigurationException(string message, Exception inner) : base(message, inner)
            {
            }
        }
    }
}
