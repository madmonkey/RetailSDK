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
    namespace Commerce.Runtime.DocumentProvider.EFRSample.DocumentBuilders
    {
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentHelpers;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;

        /// <summary>
        /// Incapsulates the non-fiscal transaction document generation logic specific for Austia.
        /// </summary>
        public class NonFiscalTransactionBuilder : IDocumentBuilder
        {
            /// <summary>
            /// The request.
            /// </summary>
            private GetNonFiscalDocumentDocumentProviderRequest request;

            /// <summary>
            /// Initializes a new instance of the <see cref="NonFiscalTransactionBuilder"/> class.
            /// </summary>
            /// <param name="request">The request.</param>
            public NonFiscalTransactionBuilder(GetNonFiscalDocumentDocumentProviderRequest request)
            {
                ThrowIf.Null(request, nameof(request));

                this.request = request;
            }

            /// <summary>
            /// Builds the fiscal integration document.
            /// </summary>
            /// <returns>The non-fiscal transaction receipt document.</returns>
            public async Task<IFiscalIntegrationDocument> BuildAsync()
            {
                return new NonFiscalEventRegistrationRequest()
                {
                    Receipt = await CreateReceiptAsync().ConfigureAwait(false)
                };
            }

            /// <summary>
            /// Creates receipt.
            /// </summary>
            /// <returns>The receipt.</returns>
            private async Task<NonFiscalReceipt> CreateReceiptAsync()
            {
                NonFiscalReceipt receipt = new NonFiscalReceipt
                {
                    CountryRegionISOCode = request.RequestContext.GetChannelConfiguration().CountryRegionISOCode,
                    IsTrainingTransaction = 0,
                };

                if (request.NonFiscalDocumentRetrievalCriteria.FiscalRegistrationEventType == FiscalIntegrationEventType.AuditEvent &&
                    request.NonFiscalDocumentRetrievalCriteria.DocumentContext.AuditEvent != null)
                {
                    var auditEvent = request.NonFiscalDocumentRetrievalCriteria.DocumentContext.AuditEvent;
                    receipt.ReceiptDateTime = auditEvent.EventDateTime.DateTime;
                    receipt.TransactionLocation = auditEvent.Store;
                    receipt.TransactionTerminal = auditEvent.Terminal;
                    receipt.OperatorId = auditEvent.Staff;
                    receipt.OperatorName = string.IsNullOrEmpty(auditEvent.Staff) ? string.Empty : await SalesTransactionHelper.GetOperatorNameAsync(request.RequestContext, auditEvent.Staff).ConfigureAwait(false);
                    receipt.NonFiscalTransactionType = SalesTransactionHelper.TranslateText(request.RequestContext, auditEvent.ExtensibleAuditEventType.Name);
                }
                else if (request.NonFiscalDocumentRetrievalCriteria.FiscalRegistrationEventType != FiscalIntegrationEventType.AuditEvent)
                {
                    var staffId = request.RequestContext.GetPrincipal().UserId;
                    receipt.OperatorId = staffId;
                    receipt.ReceiptDateTime = request.RequestContext.GetNowInChannelTimeZone().DateTime;
                    receipt.OperatorName = string.IsNullOrEmpty(staffId) ? string.Empty : await SalesTransactionHelper.GetOperatorNameAsync(request.RequestContext, staffId).ConfigureAwait(false);
                    receipt.TransactionLocation = request.RequestContext.GetOrgUnit().OrgUnitNumber;
                    receipt.TransactionTerminal = request.NonFiscalDocumentRetrievalCriteria.ShiftTerminalId;
                    receipt.NonFiscalTransactionType = SalesTransactionHelper.TranslateText(request.RequestContext, request.NonFiscalDocumentRetrievalCriteria.FiscalRegistrationEventType.ToString());
                }

                return receipt;
            }
        }
    }
}
