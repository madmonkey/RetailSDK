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
    namespace Commerce.Runtime.SequentialSignatureFrance
    {
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Audit event registration interface.
        /// </summary>
        public interface IAuditEventRegistrationStrategy
        {
            /// <summary>
            /// Determines whether the audit event should be signed.
            /// </summary>
            /// <param name="auditEvent">The audit event to check.</param>
            /// <returns>Returns True if the audit event should be signed; False otherwise.</returns>
            bool IsSigningRequired(AuditEvent auditEvent);
        }
    }
}