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
    namespace Commerce.Runtime.DocumentProvider.EFRSample
    {
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// The document provider interface for EFSTA (European Fiscal Standards Association) Fiscal Register.
        /// </summary>
        public interface IDocumentProviderEFR
        {
            /// <summary>
            /// Gets the supported fiscal integration event type.
            /// </summary>
            IEnumerable<int> SupportedRegistrableFiscalEventsId { get; }

            /// <summary>
            /// Gets the supported non-fiscal integration event type.
            /// </summary>
            IEnumerable<int> SupportedRegistrableNonFiscalEventsId { get; }

            /// <summary>
            /// Gets sales order adjustment type.
            /// </summary>
            /// <param name="salesOrder">The sales order.</param>
            /// <returns>The sales order adjustment type.</returns>
            FiscalIntegrationSalesOrderAdjustmentType GetSalesOrderAdjustmentType(SalesOrder salesOrder);

            /// <summary>
            /// Fills document adjustment.
            /// </summary>
            /// <param name="request">The get fiscal document request.</param>
            /// <param name="fiscalIntegrationDocument">The fiscal integration document.</param>
            Task FillDocumentAdjustmentAsync(GetFiscalDocumentDocumentProviderRequest request, FiscalIntegrationDocument fiscalIntegrationDocument);

            /// <summary>
            /// Gets the fiscal registration result string.
            /// </summary>
            /// <param name="fiscalIntegrationRegistrationResult">The fiscal integration registration result.</param>
            /// <returns>The fiscal registration result string.</returns>
            string GetFiscalRegisterResponseToSave(FiscalIntegrationRegistrationResult fiscalIntegrationRegistrationResult);
        }
    }
}
