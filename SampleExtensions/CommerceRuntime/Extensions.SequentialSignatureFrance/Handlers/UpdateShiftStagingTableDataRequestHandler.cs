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
        using System.Threading.Tasks;
        using System.Transactions;
        using Commerce.Runtime.DataModel;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Custom request handler for shift staging table update.
        /// </summary>
        public class UpdateShiftStagingTableDataRequestHandler : SingleAsyncRequestHandler<UpdateShiftStagingTableDataRequest>
        {
            private static SequentialSignatureData defaultSequentialSignatureData = new SequentialSignatureData { Signature = string.Empty, SequentialNumber = 0 };
             
            /// <summary>
            /// Represents the entry point of the request handler.
            /// </summary>
            /// <param name="request">The incoming request message.</param>
            /// <returns>The outgoing response message.</returns>
            protected override async Task<Response> Process(UpdateShiftStagingTableDataRequest request)
            {
                ThrowIf.Null(request, "request");

                NullResponse response;

                using (var databaseContext = new DatabaseContext(request.RequestContext))
                using (var transactionScope = CreateReadCommittedTransactionScope())
                {
                    // Execute original logic.
                    var requestHandler = new Microsoft.Dynamics.Commerce.Runtime.DataServices.SqlServer.ShiftSqlServerDataService();
                    response = request.RequestContext.Runtime.Execute<NullResponse>(request, request.RequestContext, requestHandler, true);

                    // Extension logic.
                    response = await RegisterCloseShiftEventAsync(request).ConfigureAwait(false);
                    
                    transactionScope.Complete();
                }

                return response;
            }

            /// <summary>
            /// Creates a transaction scope with ReadCommitted isolation.
            /// </summary>
            /// <returns>The transaction scope.</returns>
            private static TransactionScope CreateReadCommittedTransactionScope()
            {
                var options = new TransactionOptions()
                {
                    IsolationLevel = IsolationLevel.ReadCommitted
                };

                return new TransactionScope(TransactionScopeOption.Required, options, TransactionScopeAsyncFlowOption.Enabled);
            }

            /// <summary>
            /// Registers the close shift audit event.
            /// </summary>
            /// <param name="request">The data request.</param>
            /// <returns>The response.</returns>
            private static async Task<NullResponse> RegisterCloseShiftEventAsync(UpdateShiftStagingTableDataRequest request)
            {
                ThrowIf.Null(request, "request");
                ThrowIf.Null(request.Shift, "request.Shift");

                Shift shift = request.Shift;

                if (shift.Status == ShiftStatus.Closed)
                {
                    var auditEvent = new AuditEvent();
                    auditEvent.InitializeEventInfo(
                        "UpdateShiftStagingTableDataRequestHandler.RegisterCloseShiftEvent",
                        string.Format("The shift {0} has been closed successfully.", shift.ShiftId),
                        AuditLogTraceLevel.Trace,
                        FranceExtensibleAuditEventType.CloseShift);
                    auditEvent.InitializeIdentification(request.RequestContext);

                    var getLastSequentialSignatureDataRequest = new GetLastSequentialSignatureDataRequest(
                        shift.StoreId,
                        shift.TerminalId,
                        (int)RegistrationSequenceType.ShiftClose);

                    var response = await request.RequestContext.ExecuteAsync<GetLastSequentialSignatureDataResponse>(getLastSequentialSignatureDataRequest).ConfigureAwait(false);
                    var lastSignatureData = response.SequentialSignatureData ?? defaultSequentialSignatureData;

                    auditEvent.SetProperty(SequentialSignatureFranceConstants.ShiftDataKeyId, shift);
                    auditEvent.SetProperty(SequentialSignatureRegisterConstants.LastSignatureKeyId, lastSignatureData.Signature);
                    auditEvent.SetProperty(SequentialSignatureRegisterConstants.LastSequentialNumberKeyId, lastSignatureData.SequentialNumber);

                    var auditLogServiceRequest = new RegisterAuditEventServiceRequest(auditEvent);
                    await request.RequestContext.ExecuteAsync<NullResponse>(auditLogServiceRequest).ConfigureAwait(false);
                }

                return new NullResponse();
            }
        }
    }
}
