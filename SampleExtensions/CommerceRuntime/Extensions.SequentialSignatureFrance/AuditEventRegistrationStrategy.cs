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
        using System.Linq;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using FranceExtensibleAuditEventType = Commerce.Runtime.DataModel.FranceExtensibleAuditEventType;

        /// <summary>
        /// Encapsulates the logic of filtering audit events for digital signature.
        /// </summary>
        public class AuditEventRegistrationStrategy : IAuditEventRegistrationStrategy
        {
            private readonly ExtensibleAuditEventType[] supportedTechnicalEvents = new ExtensibleAuditEventType[]
            {
                ExtensibleAuditEventType.UserLogOn,
                ExtensibleAuditEventType.UserLogOff,
                ExtensibleAuditEventType.PrintReceiptCopy,
                ExtensibleAuditEventType.PurgeTransactionsData,
                FranceExtensibleAuditEventType.OfflineModeOn,
                FranceExtensibleAuditEventType.OfflineModeOff,
                FranceExtensibleAuditEventType.TrainingModeOn,
                FranceExtensibleAuditEventType.TrainingModeOff,
                FranceExtensibleAuditEventType.CloseShift
            };

            /// <summary>
            /// Determines whether the audit event should be signed.
            /// </summary>
            /// <param name="auditEvent">The audit event to check.</param>
            /// <returns>Returns True if audit event should be signed, return False otherwise.</returns>
            public bool IsSigningRequired(AuditEvent auditEvent)
            {
                ThrowIf.Null(auditEvent, "auditEvent");

                return this.supportedTechnicalEvents.Contains(auditEvent.ExtensibleAuditEventType);
            }
        }
    }
}