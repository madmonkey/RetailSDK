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
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Commerce.Runtime.CommonFrance;
        using Commerce.Runtime.CommonFrance.Messages;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Registration adapter for receipt copy printing audit event.
        /// </summary>
        public class RegistrableEventPrintReceiptCopyEventAdapterFrance : RegistrableEventAuditEventAdapterFrance
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="RegistrableEventPrintReceiptCopyEventAdapterFrance" /> class.
            /// </summary>
            /// <param name="auditEvent">The audit event to register.</param>
            /// <param name="requestContext">The request context.</param>
            /// <param name="registrationTime">The registration time. Optional.</param>
            public RegistrableEventPrintReceiptCopyEventAdapterFrance(AuditEvent auditEvent, RequestContext requestContext, DateTimeOffset? registrationTime = null)
                : base(auditEvent, requestContext, registrationTime)
            {
            }

            /// <summary>
            /// Gets the type of registration sequence.
            /// </summary>
            public override RegistrationSequenceType SequenceType
            {
                get
                {
                    return RegistrationSequenceType.ReceiptCopy;
                }
            }

            /// <summary>
            /// Gets string representation of data to register.
            /// </summary>
            /// <returns>String representation of data to register.</returns>
            public override async Task<string> GetDataToRegisterAsync()
            {
                List<string> dataToRegisterFields = new List<string>();

                string lastRegisterResponse = this.GetPreviousTransactionSignature(this.AuditEvent);
                string receiptId = this.GetReceiptId(this.AuditEvent);

                var receiptReprintNumberRequest = new GetTransactionReprintNumberServiceRequest(
                    this.AuditEvent.RefChannel,
                    this.AuditEvent.RefStore,
                    this.AuditEvent.RefTerminal,
                    this.AuditEvent.RefTransactionId);

                var reprintNumberResponse = await this.RequestContext.ExecuteAsync<GetTransactionReprintNumberServiceResponse>(receiptReprintNumberRequest).ConfigureAwait(false);
                var reprintNumber = reprintNumberResponse.ReprintNumber + 1;

                var getSalesOrderDetailsByTransactionIdServiceRequest = new GetSalesOrderDetailsByTransactionIdServiceRequest(this.AuditEvent.RefTransactionId, SearchLocation.All);
                var response = await this.RequestContext.ExecuteAsync<GetSalesOrderDetailsServiceResponse>(getSalesOrderDetailsByTransactionIdServiceRequest).ConfigureAwait(false);
                var salesOrder = response.SalesOrder;
                var salesOrderType = string.Empty;

                if (salesOrder != null)
                {
                    salesOrderType = salesOrder.ExtensibleSalesTransactionType.Name;
                }

                var formatter = new FiscalDataToRegisterFormatter(this.RequestContext);
                dataToRegisterFields.Add(receiptId);
                dataToRegisterFields.Add(salesOrderType);
                dataToRegisterFields.Add(reprintNumber.ToString());
                dataToRegisterFields.Add(this.AuditEvent.Staff);
                dataToRegisterFields.Add(formatter.GetFormattedDateTime(this.RegistrationTime));
                dataToRegisterFields.Add(formatter.GetFormattedSequentialNumber(this.SequentialNumber));
                dataToRegisterFields.Add(FiscalDataToRegisterFormatter.GetFormattedPostponement(this.SequentialNumber));
                dataToRegisterFields.Add(lastRegisterResponse);

                return formatter.GetFormattedDataToRegister(dataToRegisterFields);
            }

            /// <summary>
            /// Gets receipt id from audit event.
            /// </summary>
            /// <param name="auditEvent">The audit event.</param>
            /// <returns>Receipt id.</returns>
            protected string GetReceiptId(AuditEvent auditEvent)
            {
                ThrowIf.Null(auditEvent, "auditEvent");

                var receiptId = auditEvent.GetProperty(SequentialSignatureFranceConstants.ReceiptIdKeyId);

                if (receiptId != null && receiptId.GetType() == typeof(string))
                {
                    return (string)receiptId;
                }
                else
                {
                    throw new ArgumentException("auditEvent is missing receipt identifier", "auditEvent");
                }
            }
        }
    }
}
