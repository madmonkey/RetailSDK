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
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Registration adapter for technical audit event.
        /// </summary>
        public class RegistrableEventTechnicalEventAdapterFrance : RegistrableEventAuditEventAdapterFrance
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="RegistrableEventTechnicalEventAdapterFrance" /> class.
            /// </summary>
            /// <param name="auditEvent">The audit event to register.</param>
            /// <param name="requestContext">The request context.</param>
            /// <param name="registrationTime">The registration time. Optional.</param>
            public RegistrableEventTechnicalEventAdapterFrance(AuditEvent auditEvent, RequestContext requestContext, DateTimeOffset? registrationTime = null)
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
                    return RegistrationSequenceType.TechnicalEvent;
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

                var formatter = new FiscalDataToRegisterFormatter(this.RequestContext);
                dataToRegisterFields.Add(formatter.GetFormattedSequentialNumber(this.SequentialNumber));
                dataToRegisterFields.Add(formatter.GetFormattedTechnicalEventType(AuditEvent.ExtensibleAuditEventType));
                dataToRegisterFields.Add(AuditEvent.EventMessage);
                dataToRegisterFields.Add(formatter.GetFormattedDateTime(this.RegistrationTime));
                dataToRegisterFields.Add(AuditEvent.Staff);
                dataToRegisterFields.Add(AuditEvent.Terminal);
                dataToRegisterFields.Add(FiscalDataToRegisterFormatter.GetFormattedPostponement(this.SequentialNumber));
                dataToRegisterFields.Add(lastRegisterResponse);

                return await Task.FromResult(formatter.GetFormattedDataToRegister(dataToRegisterFields));
            }
        }
    }
}
