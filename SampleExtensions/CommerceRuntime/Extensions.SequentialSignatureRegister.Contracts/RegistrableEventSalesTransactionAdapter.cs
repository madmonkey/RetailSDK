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
        using System;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Registration adapter for <c>RetailTransaction</c>.
        /// </summary>
        public abstract class RegistrableEventSalesTransactionAdapter : IRegistrableSequentialEvent
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="RegistrableEventSalesTransactionAdapter" /> class.
            /// </summary>
            /// <param name="transaction">Retail transaction to register.</param>
            /// <param name="requestContext">Type of registration sequence.</param>
            public RegistrableEventSalesTransactionAdapter(SalesTransaction transaction, RequestContext requestContext)
            {
                this.SalesTransaction = transaction;
                this.RequestContext = requestContext;
            }

            /// <summary>
            /// Gets the type of registration sequence.
            /// </summary>
            public RegistrationSequenceType SequenceType
            {
                get
                {
                    return RegistrationSequenceType.Sales;
                }
            }

            /// <summary>
            /// Gets the identifier of the event.
            /// </summary>
            public string Id
            {
                get
                {
                    return SalesTransaction.Id;
                }
            }

            /// <summary>
            /// Gets or sets the sequential number of the event.
            /// </summary>
            public long SequentialNumber
            {
                get
                {
                    return this.GetPreviousSequentialNumber(this.SalesTransaction) + 1;
                }
            }

            /// <summary>
            /// Gets the request context related to the adapter.
            /// </summary>
            protected RequestContext RequestContext { get; private set; }

            /// <summary>
            /// Gets the sales transaction related to the adapter.
            /// </summary>
            protected SalesTransaction SalesTransaction { get; private set; }

            /// <summary>
            /// Determines whether registration of event is available.
            /// </summary>
            /// <returns>True if registration is available; False otherwise.</returns>
            public bool IsRegistrationAvailable()
            {
                var lastSignatureProperty = this.SalesTransaction.GetProperty(SequentialSignatureRegisterConstants.LastSignatureKeyId);
                return lastSignatureProperty != null;
            }

            /// <summary>
            /// Determines whether registration of event is required.
            /// </summary>
            /// <returns>True if event should be registered; False otherwise.</returns>
            public abstract bool IsRegistrationRequired();

            /// <summary>
            /// Handles empty signature data state.
            /// </summary>
            public void HandleNotAvailableSignatureData()
            {
                throw new ArgumentException("salesTransaction is invalid");
            }

            /// <summary>
            /// Gets string representation of data to register.
            /// </summary>
            /// <returns>String representation of data to register.</returns>
            public abstract Task<string> GetDataToRegisterAsync();

            /// <summary>
            /// Updates registrable event with sequential signature data.
            /// </summary>
            /// <param name="sequentialSignatureRegisterableData">Sequential signature data.</param>
            public virtual void UpdateWithRegisterResponse(SequentialSignatureRegisterableData sequentialSignatureRegisterableData)
            {
                var registerResponse = SerializationHelper.SerializeSequentialSignatureDataToJson(sequentialSignatureRegisterableData);

                var fiscalTransaction = new FiscalTransaction()
                {
                    StoreId = SalesTransaction.StoreId,
                    TerminalId = SalesTransaction.TerminalId,
                    TransactionId = SalesTransaction.Id,
                    LineNumber = 1,
                    RegisterResponse = registerResponse,
                    ReceiptCopy = false,
                    RegisterStoreId = RequestContext.GetDeviceConfiguration().StoreNumber,
                    RegisterTerminalId = RequestContext.GetDeviceConfiguration().TerminalId,
                    StaffId = SalesTransaction.StaffId
                };

                SalesTransaction.FiscalTransactions.Add(fiscalTransaction);
            }

            /// <summary>
            /// Persists register response after successful registration.
            /// </summary>
            public abstract Task PersistRegisterResponseAsync();

            /// <summary>
            /// Get previous signature from sales transaction.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <returns>The previous signature.</returns>
            protected string GetPreviousTransactionSignature(SalesTransaction salesTransaction)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");

                var lastSignatureObject = salesTransaction.GetProperty(SequentialSignatureRegisterConstants.LastSignatureKeyId);

                if (lastSignatureObject != null && lastSignatureObject.GetType() == typeof(string))
                {
                    return (string)lastSignatureObject;
                }
                else
                {
                    throw new ArgumentException("salesTransaction is invalid", "salesTransaction");
                }
            }

            /// <summary>
            /// Get previous sequential number from sales transaction.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <returns>The previous signature.</returns>
            protected long GetPreviousSequentialNumber(SalesTransaction salesTransaction)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");

                var lastSequentialNumberObject = salesTransaction.GetProperty(SequentialSignatureRegisterConstants.LastSequentialNumberKeyId);

                if (lastSequentialNumberObject != null && lastSequentialNumberObject.GetType() == typeof(long))
                {
                    return (long)lastSequentialNumberObject;
                }
                else
                {
                    throw new ArgumentException("salesTransaction is invalid", "salesTransaction");
                }
            }
        }
    }
}
