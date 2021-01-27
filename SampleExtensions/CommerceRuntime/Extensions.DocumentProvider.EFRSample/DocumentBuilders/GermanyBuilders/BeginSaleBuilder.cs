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
        using System.Linq;
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using Receipt = DataModelEFR.Documents.Receipt;

        /// <summary>
        /// Incapsulates the document generation logic for the begin sale event.
        /// </summary>
        public class BeginSaleBuilder : IDocumentBuilder
        {
            /// <summary>
            /// The request.
            /// </summary>
            private readonly GetFiscalDocumentDocumentProviderRequest request;

            /// <summary>
            /// The Cart.
            /// </summary>
            private readonly Cart cart;

            /// <summary>
            /// Creates a new instance of <see cref="BeginSaleBuilder"/>.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="transactionId">The transaction identifier.</param>
            public BeginSaleBuilder(GetFiscalDocumentDocumentProviderRequest request, string transactionId)
            {
                this.request = request;
                var cartSearchCriteria = new CartSearchCriteria(transactionId);
                var getCartServiceRequest = new GetCartServiceRequest(cartSearchCriteria, QueryResultSettings.SingleRecord);
                this.cart = this.request.RequestContext.Execute<GetCartServiceResponse>(getCartServiceRequest).Carts.Single();
            }

            /// <summary>
            /// Creates a new instance of <see cref="BeginSaleBuilder"/>.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="cart">The cart.</param>
            public BeginSaleBuilder(GetFiscalDocumentDocumentProviderRequest request, Cart cart)
            {
                this.request = request;
                this.cart = cart;
            }

            /// <summary>
            /// Builds fiscal integration document.
            /// </summary>
            /// <returns> The fiscal integration receipt document.</returns>
            public Task<IFiscalIntegrationDocument> BuildAsync()
            {
                var receipt = this.CreateReceipt(cart);
                return Task.FromResult<IFiscalIntegrationDocument>(new BeginSaleRegistrationRequest { Receipt = receipt });
            }

            /// <summary>
            /// Creates receipt.
            /// </summary>
            /// <param name="cart">The cart.</param>
            /// <returns>The receipt.</returns>
            private Receipt CreateReceipt(Cart cart)
            {
                var receipt = new Receipt
                {
                    TransactionLocation = request.RequestContext.GetOrgUnit().OrgUnitNumber,
                    TransactionTerminal = cart.TerminalId,
                    TransactionNumber = cart.Id,
                };
                return receipt;
            }
        }
    }
}
