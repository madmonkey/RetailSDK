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
        /// Registration adapter for shift closing audit event.
        /// </summary>
        public class RegistrableEventCloseShiftEventAdapterFrance : RegistrableEventAuditEventAdapterFrance
        {
            private Shift shift;

            /// <summary>
            /// Initializes a new instance of the <see cref="RegistrableEventCloseShiftEventAdapterFrance" /> class.
            /// </summary>
            /// <param name="auditevent">The audit event to register.</param>
            /// <param name="requestContext">The request context.</param>
            /// <param name="registrationTime">The registration time. Optional.</param>
            public RegistrableEventCloseShiftEventAdapterFrance(AuditEvent auditevent, RequestContext requestContext, DateTimeOffset? registrationTime = null)
                : base(auditevent, requestContext, registrationTime)
            {
                this.shift = this.GetShift(auditevent);
            }

            /// <summary>
            /// Gets the type of registration sequence.
            /// </summary>
            public override RegistrationSequenceType SequenceType
            {
                get
                {
                    return RegistrationSequenceType.ShiftClose;
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
                dataToRegisterFields.Add(await formatter.GetFormattedTotalSalesAmountsByTaxRateAsync(this.shift.TaxLines).ConfigureAwait(false));
                dataToRegisterFields.Add(await formatter.GetFormattedTotalSalesAmountAsync(this.shift.ShiftSalesTotal - this.shift.ShiftReturnsTotal).ConfigureAwait(false));
                dataToRegisterFields.Add(formatter.GetFormattedDateTime(this.RegistrationTime));
                dataToRegisterFields.Add(FiscalDataToRegisterFormatter.GetFormattedFullPeriodId(this.shift.CloseDateTime ?? this.RequestContext.GetNowInChannelTimeZone()));
                dataToRegisterFields.Add(formatter.GetFormattedSequentialNumber(this.SequentialNumber));
                dataToRegisterFields.Add(FiscalDataToRegisterFormatter.GetFormattedPostponement(this.SequentialNumber));
                dataToRegisterFields.Add(lastRegisterResponse);

                return formatter.GetFormattedDataToRegister(dataToRegisterFields);
            }

            /// <summary>
            /// Get shift data from audit event.
            /// </summary>
            /// <param name="auditEvent">The audit event.</param>
            /// <returns>The shift.</returns>
            protected Shift GetShift(AuditEvent auditEvent)
            {
                ThrowIf.Null(auditEvent, "auditEvent");

                var shiftData = auditEvent.GetProperty(SequentialSignatureFranceConstants.ShiftDataKeyId);

                if (shiftData != null && shiftData.GetType() == typeof(Shift))
                {
                    return (Shift)shiftData;
                }
                else
                {
                    throw new ArgumentException("auditEvent is missing shift data", "auditEvent");
                }
            }
        }
    }
}
