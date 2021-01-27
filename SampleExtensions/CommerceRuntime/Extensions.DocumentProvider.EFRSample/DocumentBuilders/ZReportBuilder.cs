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
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;

        /// <summary>
        /// Incapsulates the document generation logic for Z-report printing event.
        /// </summary>
        public class ZReportBuilder : IDocumentBuilder
        {
            private const string TransactionTypeCode = "Z";

            /// <summary>
            /// The request.
            /// </summary>
            private GetFiscalDocumentDocumentProviderRequest request;

            /// <summary>
            /// Creates a new instance of <see cref="NonSalesTransactionBuilder"/>.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="transactionId">The transaction identifier.</param>
            public ZReportBuilder(GetFiscalDocumentDocumentProviderRequest request)
            {
                ThrowIf.Null(request, nameof(request));

                this.request = request;
            }

            /// <summary>
            /// Builds fiscal integration document.
            /// </summary>
            /// <returns> The fiscal integration receipt document.</returns>
            public Task<IFiscalIntegrationDocument> BuildAsync()
            {
                var receipt = this.CreateReceipt();
                return Task.FromResult<IFiscalIntegrationDocument>(new NonFiscalEventRegistrationRequest
                {
                    Receipt = receipt
                });
            }

            /// <summary>
            /// Creates a receipt.
            /// </summary>
            /// <returns>The receipt.</returns>
            private NonFiscalReceipt CreateReceipt()
            {
                return new NonFiscalReceipt
                {
                    TransactionLocation = request.RequestContext.GetOrgUnit().OrgUnitNumber,
                    TransactionTerminal = request.FiscalDocumentRetrievalCriteria.ShiftTerminalId,
                    NonFiscalTransactionType = TransactionTypeCode,
                };
            }
        }
    }
}