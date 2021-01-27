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
    namespace Commerce.Runtime.DocumentProvider.EFRSample.DocumentBuilders.GermanyBuilders
    {
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Receipt = DataModelEFR.Documents.Receipt;

        /// <summary>
        /// Incapsulates the document generation logic for the void transaction event.
        /// </summary>
        public class VoidTransactionBuilder : IDocumentBuilder
        {
            /// <summary>
            /// The request.
            /// </summary>
            private readonly GetFiscalDocumentDocumentProviderRequest request;

            /// <summary>
            /// The transaction builder document rule.
            /// </summary>
            private readonly IDocumentRule documentRule;

            /// <summary>
            /// Creates a new instance of <see cref="VoidTransactionBuilder"/>.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="transactionId">The transaction identifier.</param>
            public VoidTransactionBuilder(GetFiscalDocumentDocumentProviderRequest request, SalesOrder salesOrder)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(salesOrder, nameof(salesOrder));

                this.request = request;
                this.documentRule = LocalizedDocumentBuilderFabric.GetLocalizedDocumentRule(request, salesOrder);
            }

            /// <summary>
            /// Builds fiscal integration document.
            /// </summary>
            /// <returns> The fiscal integration receipt document.</returns>
            public Task<IFiscalIntegrationDocument> BuildAsync()
            {
                var receipt = new Receipt();
                documentRule.AddLocalizationInfoToReceipt(receipt);

                return receipt.TransactionId == null
                    ? Task.FromResult<IFiscalIntegrationDocument>(null)
                    : Task.FromResult<IFiscalIntegrationDocument>(new VoidTransactionRegistrationRequest { Receipt = receipt });
            }
        }
    }
}