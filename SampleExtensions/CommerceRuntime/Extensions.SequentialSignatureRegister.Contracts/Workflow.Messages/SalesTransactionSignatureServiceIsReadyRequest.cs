﻿/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso
{
    namespace Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// A simple request class to sales transaction signature service readiness.
        /// </summary>
        [DataContract]
        public sealed class SalesTransactionSignatureServiceIsReadyRequest : Request
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="SalesTransactionSignatureServiceIsReadyRequest"/> class.
            /// </summary>
            public SalesTransactionSignatureServiceIsReadyRequest()
            {
            }
        }
    }
}
