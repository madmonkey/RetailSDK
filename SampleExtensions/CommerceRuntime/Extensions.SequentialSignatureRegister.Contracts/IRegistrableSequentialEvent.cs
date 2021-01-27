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
    namespace Commerce.Runtime.SequentialSignatureRegister.Contracts
    {
        using System.Threading.Tasks;

        /// <summary>
        /// Interface for an events that can be registered.
        /// </summary>
        public interface IRegistrableSequentialEvent
        {
            /// <summary>
            /// Gets the type of registration sequence.
            /// </summary>
            RegistrationSequenceType SequenceType { get; }

            /// <summary>
            /// Gets the identifier of registrable sequential event instance.
            /// </summary>
            string Id { get; }

            /// <summary>
            /// Gets the sequential number of registrable event.
            /// </summary>
            long SequentialNumber { get; }

            /// <summary>
            /// Determines whether registration of event is available.
            /// </summary>
            /// <returns>True if registration is available; False otherwise.</returns>
            bool IsRegistrationAvailable();

            /// <summary>
            /// Determines whether registration of event is required.
            /// </summary>
            /// <returns>True if event should be registered; False otherwise.</returns>
            bool IsRegistrationRequired();

            /// <summary>
            /// Gets string to be signed for registrable event.
            /// </summary>
            /// <returns>Data string to be signed.</returns>
            Task<string> GetDataToRegisterAsync();

            /// <summary>
            /// Updates registrable event with sequential signature data.
            /// </summary>
            /// <param name="sequentialSignatureRegisterableData">Sequential signature data.</param>
            void UpdateWithRegisterResponse(SequentialSignatureRegisterableData sequentialSignatureRegisterableData);

            /// <summary>
            /// Persists register response string after successful registration.
            /// </summary>
            Task PersistRegisterResponseAsync();

            /// <summary>
            /// Handles empty signature data state.
            /// </summary>
            void HandleNotAvailableSignatureData();
        }
    }
}
