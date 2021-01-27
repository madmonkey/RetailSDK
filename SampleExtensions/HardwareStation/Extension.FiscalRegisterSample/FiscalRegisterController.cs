namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;

        /// <summary>
        /// Fiscal register peripheral web API controller class.
        /// </summary>
        [RoutePrefix("FISCALREGISTER")]
        public class FiscalRegisterController : IController
        {
            /// <summary>
            /// Checks if the fiscal register is ready for registration operation or not.
            /// </summary>
            /// <returns><c>True</c> if fiscal register is active, <c>false</c> otherwise.</returns>
            [HttpPost]
            public async Task<bool> IsReady(IEndpointContext context)
            {
                try
                {
                    IsReadyFiscalRegisterDeviceRequest fiscalRegisterIsReadyRequest = new IsReadyFiscalRegisterDeviceRequest();
                    IsReadyFiscalRegisterDeviceResponse isReadyResponse = await context.ExecuteAsync<IsReadyFiscalRegisterDeviceResponse>(fiscalRegisterIsReadyRequest);

                    return isReadyResponse.IsReady;
                }
                catch (FiscalRegisterException ex)
                {
                    Console.WriteLine(ex.Message);
                    throw;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);

                    // Rethrow exception setting of errorResourceId to raise localized general error and logging unlocalized details.
                    throw new FiscalRegisterException(FiscalRegisterException.FiscalRegisterErrorResourceId, ex.Message, ex);
                }
            }

            /// <summary>
            /// Registers the specified fiscal transaction.
            /// </summary>
            /// <param name="request">The fiscal registration request.</param>
            /// <returns>Result of fiscal registration.</returns>
            /// <exception cref="FiscalRegisterException">A device exception.</exception>
            [HttpPost]
            public async Task<FiscalRegistrationResults> RegisterFiscalTransaction(FiscalRegistrationRequest request, IEndpointContext context)
            {
                ThrowIf.Null(request, "request");

                try
                {
                    RegisterFiscalTransactionFiscalRegisterDeviceRequest registerFiscalTransactionRequest = new RegisterFiscalTransactionFiscalRegisterDeviceRequest(request.FiscalTransaction, request.Configuration);
                    RegisterFiscalTransactionFiscalRegisterDeviceResponse registerResponse = await context.ExecuteAsync<RegisterFiscalTransactionFiscalRegisterDeviceResponse>(registerFiscalTransactionRequest);

                    return registerResponse.FiscalRegistrationResults;
                }
                catch (FiscalRegisterException ex)
                {
                    Console.WriteLine(ex.Message);
                    throw;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);

                    // Rethrow exception setting of errorResourceId to raise localized general error and logging unlocalized details.
                    throw new FiscalRegisterException(FiscalRegisterException.FiscalRegisterErrorResourceId, ex.Message, ex);
                }
            }
        }
    }
}
