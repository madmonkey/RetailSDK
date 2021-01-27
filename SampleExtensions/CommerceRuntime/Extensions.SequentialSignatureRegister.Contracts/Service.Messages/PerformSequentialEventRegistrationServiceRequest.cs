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
    namespace Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Defines the request class to perform sequential event registration.
        /// </summary>
        [DataContract]
        public sealed class PerformSequentialEventRegistrationServiceRequest : Request
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="PerformSequentialEventRegistrationServiceRequest"/> class.
            /// </summary>
            /// <param name="registrableEvent">The registrable event.</param>
            /// <param name="encoding">The encoding.</param>
            /// <param name="hashAlgorithm">The hash algorithm.</param>
            public PerformSequentialEventRegistrationServiceRequest(IRegistrableSequentialEvent registrableEvent, string encoding, string hashAlgorithm)
            {
                this.RegistrableEvent = registrableEvent;
                this.Encoding = encoding;
                this.HashAlgorithm = hashAlgorithm;
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="PerformSequentialEventRegistrationServiceRequest"/> class.
            /// </summary>
            /// <param name="registrableEvent">The registrable event.</param>
            public PerformSequentialEventRegistrationServiceRequest(IRegistrableSequentialEvent registrableEvent)
                : this(registrableEvent, "UTF-8", "SHA256")
            {
            }

            /// <summary>
            /// Gets the store number related to the request.
            /// </summary>
            [DataMember]
            public IRegistrableSequentialEvent RegistrableEvent { get; private set; }

            /// <summary>
            /// Gets the encoding related to the request.
            /// </summary>
            [DataMember]
            public string Encoding { get; private set; }

            /// <summary>
            /// Gets the hash algorithm related to the request.
            /// </summary>
            [DataMember]
            public string HashAlgorithm { get; private set; }
        }
    }
}
