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
        using System;
        using Commerce.Runtime.DataModel;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Registrable events factory.
        /// </summary>
        public static class RegistrableEventFactory
        {
            /// <summary>
            /// Creates registrable event for specified entity.
            /// </summary>
            /// <param name="entity">Commerce entity.</param>
            /// <param name="requestContext">Request context.</param>
            /// <returns>Registrable event.</returns>
            public static IRegistrableSequentialEvent Create(CommerceEntity entity, RequestContext requestContext)
            {
                ThrowIf.Null(entity, "salesTransaction");
                ThrowIf.Null(requestContext, "requestContext");

                if (entity is SalesTransaction)
                {
                    return RegistrableEventFactory.Create((SalesTransaction)entity, requestContext);
                }
                else if (entity is AuditEvent)
                {
                    return RegistrableEventFactory.Create((AuditEvent)entity, requestContext);
                }
                else
                {
                    throw new NotSupportedException(string.Format("Entity '{0}' is not supported.", entity.GetType()));
                }
            }

            /// <summary>
            /// Creates registrable event for the sales transaction.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="requestContext">Request context.</param>
            /// <returns>Registrable event.</returns>
            private static IRegistrableSequentialEvent Create(SalesTransaction salesTransaction, RequestContext requestContext)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");
                ThrowIf.Null(requestContext, "requestContext");

                return new RegistrableEventSalesTransactionAdapterFrance(salesTransaction, requestContext);
            }

            /// <summary>
            /// Creates registrable event for the audit event.
            /// </summary>
            /// <param name="auditEvent">Audit event.</param>
            /// <param name="requestContext">Request context.</param>
            /// <returns>Registrable event.</returns>
            private static IRegistrableSequentialEvent Create(AuditEvent auditEvent, RequestContext requestContext)
            {
                ThrowIf.Null(auditEvent, "auditEvent");
                ThrowIf.Null(requestContext, "requestContext");

                var eventType = auditEvent.ExtensibleAuditEventType;

                if (eventType == FranceExtensibleAuditEventType.CloseShift)
                {
                    return new RegistrableEventCloseShiftEventAdapterFrance(auditEvent, requestContext);
                }
                else if (eventType == FranceExtensibleAuditEventType.PrintReceiptCopy)
                {
                    return new RegistrableEventPrintReceiptCopyEventAdapterFrance(auditEvent, requestContext);
                }
                else
                {
                    return new RegistrableEventTechnicalEventAdapterFrance(auditEvent, requestContext);
                }
            }
        }
    }
}
