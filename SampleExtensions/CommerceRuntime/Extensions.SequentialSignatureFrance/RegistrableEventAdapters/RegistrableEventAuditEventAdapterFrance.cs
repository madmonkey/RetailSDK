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
        using System.Linq;
        using System.Threading.Tasks;
        using Commerce.Runtime.CommonFrance;
        using Commerce.Runtime.DataModel;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Registration adapter for <c>AuditEvent</c>.
        /// </summary>
        public abstract class RegistrableEventAuditEventAdapterFrance : IRegistrableSequentialEvent
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="RegistrableEventAuditEventAdapterFrance" /> class.
            /// </summary>
            /// <param name="auditevent">Audit event to register.</param>
            /// <param name="requestContext">Type of registration sequence.</param>
            /// <param name="registrationTime">The registration time. Optional.</param>
            protected RegistrableEventAuditEventAdapterFrance(AuditEvent auditevent, RequestContext requestContext, DateTimeOffset? registrationTime = null)
            {
                this.RegistrationStrategy = new AuditEventRegistrationStrategy();
                this.AuditEvent = auditevent;
                this.RequestContext = requestContext;
                this.RegistrationTime = registrationTime ?? requestContext.GetNowInChannelTimeZone();
            }

            /// <summary>
            /// Gets the type of registration sequence.
            /// </summary>
            public abstract RegistrationSequenceType SequenceType { get; }

            /// <summary>
            /// Gets the identifier of the event.
            /// </summary>
            public virtual string Id
            {
                get
                {
                    return this.AuditEvent.EventId.ToString();
                }
            }

            /// <summary>
            /// Gets or sets the sequential number of the event.
            /// </summary>
            public virtual long SequentialNumber
            {
                get
                {
                    return this.GetPreviousSequentialNumber(this.AuditEvent) + 1;
                }
            }

            /// <summary>
            /// Gets the sales transaction related to the adapter.
            /// </summary>
            protected AuditEvent AuditEvent { get; private set; }

            /// <summary>
            /// Gets the registration strategy.
            /// </summary>
            protected IAuditEventRegistrationStrategy RegistrationStrategy { get; private set; }

            /// <summary>
            /// Gets the registration time.
            /// </summary>
            protected DateTimeOffset RegistrationTime { get; private set; }

            /// <summary>
            /// Gets the request context related to the adapter.
            /// </summary>
            protected RequestContext RequestContext { get; private set; }

            /// <summary>
            /// Gets string representation of data to register.
            /// </summary>
            /// <returns>String representation of data to register.</returns>
            public abstract Task<string> GetDataToRegisterAsync();

            /// <summary>
            /// Determines whether registration of event is required.
            /// </summary>
            /// <returns>True if event should be registered; False otherwise.</returns>
            public virtual bool IsRegistrationRequired()
            {
                return this.RegistrationStrategy.IsSigningRequired(AuditEvent);
            }

            /// <summary>
            /// Determines whether registration of event is available.
            /// </summary>
            /// <returns>True if registration is available; False otherwise.</returns>
            public virtual bool IsRegistrationAvailable()
            {
                var lastSignatureProperty = this.AuditEvent.GetProperty(SequentialSignatureRegisterConstants.LastSignatureKeyId);
                return lastSignatureProperty != null;
            }

            /// <summary>
            /// Handles empty signature data state.
            /// </summary>
            public virtual void HandleNotAvailableSignatureData()
            {
                // Left empty on purpose.
            }

            /// <summary>
            /// Updates registrable event with sequential signature data.
            /// </summary>
            /// <param name="sequentialSignatureRegisterableData">Sequential signature data.</param>
            public virtual void UpdateWithRegisterResponse(SequentialSignatureRegisterableData sequentialSignatureRegisterableData)
            {
                ThrowIf.Null(sequentialSignatureRegisterableData, "sequentialSignatureRegisterableData");

                sequentialSignatureRegisterableData.Signature = FiscalDataToRegisterFormatter.ConvertBase64ToBase64Url(sequentialSignatureRegisterableData.Signature);

                var registerResponse = SerializationHelper.SerializeSequentialSignatureDataToJson(sequentialSignatureRegisterableData);

                var fiscalTransaction = new AuditEventFiscalTransaction()
                {
                    Store = this.AuditEvent.Store,
                    Terminal = this.AuditEvent.Terminal,
                    EventId = this.AuditEvent.EventId,
                    UploadType = this.AuditEvent.UploadType,
                    LineNumber = this.AuditEvent.FiscalTransactions.Select(ft => ft.LineNumber).DefaultIfEmpty(0).Max() + 1,
                    RegisterResponse = registerResponse
                };

                this.AuditEvent.FiscalTransactions.Add(fiscalTransaction);
            }

            /// <summary>
            /// Persists register response string after successful registration.
            /// </summary>
            public async Task PersistRegisterResponseAsync()
            {
                var registerResponseFiscalTransaction = this.AuditEvent.FiscalTransactions
                    .OrderByDescending(item => item.LineNumber)
                    .FirstOrDefault(item => !string.IsNullOrWhiteSpace(item.RegisterResponse));

                if (registerResponseFiscalTransaction != null)
                {
                    var registeredSequentialSignatureData = SerializationHelper.DeserializeSequentialSignatureDataFromJson<SequentialSignatureRegisterableData>(registerResponseFiscalTransaction.RegisterResponse);
                    var sequentialSignature = new SequentialSignatureData()
                    {
                        Signature = registeredSequentialSignatureData.Signature,
                        SequentialNumber = registeredSequentialSignatureData.SequentialNumber
                    };

                    var updateSequentialSignatureServiceRequest = new UpdateSequentialSignatureServiceRequest(sequentialSignature, this.AuditEvent.Store, this.AuditEvent.Terminal, (int)this.SequenceType);
                    await this.RequestContext.ExecuteAsync<NullResponse>(updateSequentialSignatureServiceRequest).ConfigureAwait(false);
                }
            }

            /// <summary>
            /// Gets previous signature from audit event.
            /// </summary>
            /// <param name="auditEvent">The audit event.</param>
            /// <returns>The previous signature.</returns>
            protected string GetPreviousTransactionSignature(AuditEvent auditEvent)
            {
                ThrowIf.Null(auditEvent, "auditEvent");

                var lastSignatureObject = auditEvent.GetProperty(SequentialSignatureRegisterConstants.LastSignatureKeyId);

                if (lastSignatureObject != null && lastSignatureObject.GetType() == typeof(string))
                {
                    return (string)lastSignatureObject;
                }
                else
                {
                    throw new ArgumentException("auditEvent is invalid", "auditEvent");
                }
            }

            /// <summary>
            /// Gets previous sequential number from audit event.
            /// </summary>
            /// <param name="auditEvent">The audit event.</param>
            /// <returns>The previous signature.</returns>
            protected long GetPreviousSequentialNumber(AuditEvent auditEvent)
            {
                ThrowIf.Null(auditEvent, "auditEvent");

                var lastSequentialNumberObject = auditEvent.GetProperty(SequentialSignatureRegisterConstants.LastSequentialNumberKeyId);

                if (lastSequentialNumberObject != null && lastSequentialNumberObject.GetType() == typeof(long))
                {
                    return (long)lastSequentialNumberObject;
                }
                else
                {
                    throw new ArgumentException("auditEvent is invalid", "auditEvent");
                }
            }
        }
    }
}
