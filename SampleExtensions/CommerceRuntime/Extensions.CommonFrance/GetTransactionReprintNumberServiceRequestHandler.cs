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
    namespace Commerce.Runtime.CommonFrance
    {
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Commerce.Runtime.CommonFrance.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Handles requests related to transaction reprint number.
        /// </summary>
        public sealed class GetTransactionReprintNumberServiceRequestHandler : SingleAsyncRequestHandler<GetTransactionReprintNumberServiceRequest>
        {
            /// <summary>
            /// Represents the entry point of the request handler.
            /// </summary>
            /// <param name="request">The incoming request message.</param>
            /// <returns>The outgoing response message.</returns>
            protected override async Task<Response> Process(GetTransactionReprintNumberServiceRequest request)
            {
                ThrowIf.Null(request, "request");
                ThrowIf.NullOrWhiteSpace(request.StoreNumber, "request.StoreNumber");
                ThrowIf.NullOrWhiteSpace(request.TerminalId, "request.TerminalId");
                ThrowIf.NullOrWhiteSpace(request.TransactionId, "request.TransactionId");

                var auditEventSearchCriteria = new AuditEventSearchCriteria()
                {
                    EventType = ExtensibleAuditEventType.PrintReceiptCopy.Value,
                    RefChannel = request.ChannelId,
                    RefStore = request.StoreNumber,
                    RefTerminal = request.TerminalId,
                    RefTransactionId = request.TransactionId
                };

                var getAuditEventsRealtimeRequest = new GetAuditEventsServiceRequest(auditEventSearchCriteria);
                var receiptCopyResponse = await request.RequestContext.ExecuteAsync<GetAuditEventsServiceResponse>(getAuditEventsRealtimeRequest).ConfigureAwait(false);
      
                // Uses Distincts method on audit events collection, because we should count reprint event only once, but audit events could be stored both local and remote.
                int count = receiptCopyResponse.AuditEvents
                    .Where(auditEvent => auditEvent != null)
                    .Distinct(new AuditEventUploadTypeAgnosticComparer())
                    .Count();

                return new GetTransactionReprintNumberServiceResponse(count);
            }

            /// <summary>
            /// Audit event upload type agnostic comparer.
            /// </summary>
            private sealed class AuditEventUploadTypeAgnosticComparer : IEqualityComparer<AuditEvent>
            {
                /// <summary>
                /// Compares two <see cref="AuditEvent"/> instances by database primary key fields, except the UploadType field.
                /// </summary>
                /// <param name="x">First <see cref="AuditEvent"/> to be compared.</param>
                /// <param name="y">Second <see cref="AuditEvent"/> to be compared.</param>
                /// <returns>
                /// True, if events are equal; otherwise, False.
                /// </returns>
                public bool Equals(AuditEvent x, AuditEvent y)
                {
                    if ((x == null) && (y == null))
                    {
                        return true;
                    }

                    if ((x == null) ^ (y == null))
                    {
                        return false;
                    }

                    return x.Channel == y.Channel &&
                        x.EventId == y.EventId &&
                        x.Store == y.Store &&
                        x.Terminal == y.Terminal;
                }

                /// <summary>
                /// Gets <see cref="AuditEvent"/> hash code.
                /// </summary>
                /// <param name="auditEvent"><see cref="AuditEvent"/> to be processed.</param>
                /// <returns><see cref="AuditEvent"/> hash code.</returns>
                public int GetHashCode(AuditEvent auditEvent)
                {
                    ThrowIf.Null(auditEvent, "obj");

                    unchecked
                    {
                        // Pick two different prime numbers and do hash using three important fields to prevent creating instance of anonymous type each compare.
                        int hash = 37;

                        hash = (hash * 53) ^ auditEvent.Channel.GetHashCode();
                        hash = (hash * 53) ^ auditEvent.EventId.GetHashCode();
                        hash = (hash * 53) ^ auditEvent.Terminal.GetHashCode();

                        return hash;
                    }
                }
            }
        }
    }
}
