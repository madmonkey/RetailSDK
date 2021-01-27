/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.RetailServer.SalesTransactionSignatureSample
{
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;
    using Contoso.Commerce.Runtime.DataModel;
    using Contoso.Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages;

    /// <summary>
    /// The controller to retrieve sales transaction signature operations.
    /// </summary>
    public class SalesTransactionSignatureController : IController
    {
        /// <summary>
        /// Performs sales transaction signature service readiness check operation.
        /// </summary>
        /// <param name="parameters">The dictionary of action parameter values.</param>
        /// <returns>The SalesTransactionSignatureService readiness status.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Anonymous, CommerceRoles.Customer, CommerceRoles.Device, CommerceRoles.Employee)]
        public virtual async Task<bool> SalesTransactionSignatureServiceIsReady(IEndpointContext context, string correlationId)
        {
            var request = new SalesTransactionSignatureServiceIsReadyRequest();
            var response = await context.ExecuteAsync<SalesTransactionSignatureServiceIsReadyResponse>(request).ConfigureAwait(false);
            return response.IsReady;
        }

        /// <summary>
        /// Performs getting last terminal fiscal transaction operation.
        /// </summary>
        /// <param name="parameters">The dictionary of action parameter values.</param>
        /// <returns>The last terminal fiscal transaction.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Anonymous, CommerceRoles.Customer, CommerceRoles.Device, CommerceRoles.Employee)]
        public virtual async Task<FiscalTransaction> GetLastFiscalTransaction(IEndpointContext context, string storeNumber, string terminalId)
        {
            var request = new GetLastFiscalTransactionRequest(storeNumber, terminalId);
            var response = await context.ExecuteAsync<GetLastFiscalTransactionResponse>(request).ConfigureAwait(false);
            return response.FiscalTransaction;
        }

        /// <summary>
        /// Performs getting last terminal sequential signature operation.
        /// </summary>
        /// <param name="parameters">The dictionary of action parameter values.</param>
        /// <returns>The last terminal sequential signature data.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Anonymous, CommerceRoles.Customer, CommerceRoles.Device, CommerceRoles.Employee)]
        public virtual async Task<SequentialSignatureData> GetLastSequentialSignature(IEndpointContext context, string storeNumber, string terminalId, int registrationSequenceTypeValue)
        {
            var request = new GetLastSequentialSignatureDataRequest(storeNumber, terminalId, registrationSequenceTypeValue);
            var response = await context.ExecuteAsync<GetLastSequentialSignatureDataResponse>(request).ConfigureAwait(false);
            return response.SequentialSignatureData;
        }
    }
}
