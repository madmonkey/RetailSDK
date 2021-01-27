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
    namespace Commerce.RetailProxy.SalesTransactionSignatureSample.Adapters
    {
        using System.Threading.Tasks;
        using Commerce.Runtime.DataModel;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.RetailProxy.Adapters;

        /// <summary>
        /// Encapsulates extension functionality related to store operations management.
        /// </summary>
        internal class StoreOperationsManager : IStoreOperationsManager
        {
            /// <summary>
            /// Gets the value determining if sales transaction signature service is ready.
            /// </summary>
            /// <param name="correlationId">The correlation identifier.</param>
            /// <returns>True if service is ready; False otherwise..</returns>
            public async Task<bool> SalesTransactionSignatureServiceIsReady(string correlationId)
            {
                var response = await CommerceRuntimeManager.Runtime.ExecuteAsync<SalesTransactionSignatureServiceIsReadyResponse>(new SalesTransactionSignatureServiceIsReadyRequest(), null).ConfigureAwait(false);

                return response.IsReady;

            }

            /// <summary>
            /// Gets the last fiscal transaction.
            /// </summary>
            /// <param name="storeNumber">The store number.</param>
            /// <param name="terminalId">The terminal identifier.</param>
            /// <returns>The last fiscal transaction.</returns>
            public async Task<FiscalTransaction> GetLastFiscalTransaction(string storeNumber, string terminalId)
            {
                var response = await CommerceRuntimeManager.Runtime.ExecuteAsync<GetLastFiscalTransactionResponse>(new GetLastFiscalTransactionRequest(storeNumber, terminalId), null).ConfigureAwait(false);

                return response.FiscalTransaction;
            }

            /// <summary>
            /// Gets the last sequential signature.
            /// </summary>
            /// <param name="storeNumber">The store number.</param>
            /// <param name="terminalId">The terminal identifier.</param>
            /// <param name="registrationSequenceTypeValue">The registration sequence type.</param>
            /// <returns>The last sequential signature.</returns>
            public async Task<SequentialSignatureData> GetLastSequentialSignature(string storeNumber, string terminalId, int registrationSequenceTypeValue)
            {
                var response = await CommerceRuntimeManager.Runtime.ExecuteAsync<GetLastSequentialSignatureDataResponse>(new GetLastSequentialSignatureDataRequest(storeNumber, terminalId, registrationSequenceTypeValue), null).ConfigureAwait(false);

                return response.SequentialSignatureData;
            }
        }
    }
}
