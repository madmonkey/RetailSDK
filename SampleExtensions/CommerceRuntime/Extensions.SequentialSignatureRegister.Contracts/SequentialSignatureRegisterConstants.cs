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
        /// <summary>
        /// Contains constants for sequential signature registration.
        /// </summary>
        public static class SequentialSignatureRegisterConstants
        {
            /// <summary>
            /// Last sequential number key in sales transaction extension properties collection.
            /// </summary>
            /// <remarks>This key ID must match POS transaction extension property key ID.</remarks>
            public const string LastSequentialNumberKeyId = "LAST_SEQUENTIAL_NUMBER_744D9EEF-E3C7-4D8D-9269-2E4807388988";

            /// <summary>
            /// Last transaction signature key in sales transaction extension properties collection.
            /// </summary>
            /// <remarks>This key ID must match POS transaction extension property key ID.</remarks>
            public const string LastSignatureKeyId = "LAST_SIGNATURE_E2D913FA-DC7F-4637-9FAB-3C8051B0708E";
        }
    }
}
