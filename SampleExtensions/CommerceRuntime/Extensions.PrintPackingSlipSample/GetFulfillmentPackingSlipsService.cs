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
    namespace Commerce.Runtime.PrintPackingSlipSample
    {
        using System;
        using System.Collections.Generic;
        using System.Collections.ObjectModel;
        using System.Linq;
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.PrintPackingSlipSample.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.RealtimeServices.Messages;

        /// <summary>
        /// Service class responsible executing the service requests.
        /// </summary>
        public class GetFulfillmentPackingSlipsService : SingleAsyncRequestHandler<GetFulfillmentPackingSlipsPDFRequest>
        {
            /// <summary>
            /// Process method. 
            /// </summary>
            /// <param name="request">The request with the loyalty number.</param>
            /// <returns>The discount value.</returns>
            protected override async Task<Response> Process(GetFulfillmentPackingSlipsPDFRequest request)
            {
                if (request == null)
                {
                    throw new ArgumentNullException("request");
                }

                InvokeExtensionMethodRealtimeRequest extensionRequest = new InvokeExtensionMethodRealtimeRequest(
                    "ContosoRetailPrintPackingSlip_GeneratePDF",
                    request.SalesId,
                    request.PackingSlipId,
                    request.HardwareProfileId);
                InvokeExtensionMethodRealtimeResponse response = await request.RequestContext.ExecuteAsync<InvokeExtensionMethodRealtimeResponse>(extensionRequest).ConfigureAwait(false);
                ReadOnlyCollection<object> results = response.Result;

                string encodedPDF = (string)results[0];

                var printers = await GetPrintersAsync(request.RequestContext, request.HardwareProfileId).ConfigureAwait(false);

                Receipt packingSlip = new Receipt
                {
                    Header = encodedPDF,
                    ReceiptType = ReceiptType.PackingSlip,
                    Printers = printers
                };

                var serviceResponse = new GetFulfillmentPackingSlipsPDFResponse(new List<Receipt>() { packingSlip }.AsReadOnly());

                return serviceResponse;
            }

            /// <summary>
            /// Get all printers for a terminal.
            /// </summary>
            /// <param name="context">The request context.</param>
            /// <param name="hardwareProfileId">The hardware profile for which formatted receipts are to be generated.</param>
            /// <param name="receiptType">The type of the receipt to be printed.</param>
            /// <returns>A collection of printers.</returns>
            private async Task<ReadOnlyCollection<Printer>> GetPrintersAsync(RequestContext context, string hardwareProfileId)
            {
                Terminal terminal = context.GetTerminal();
                if (string.IsNullOrEmpty(hardwareProfileId))
                {
                    hardwareProfileId = terminal.HardwareProfile;
                }

                GetPrintersDataRequest getPrintersByReceiptTypeDataRequest = new GetPrintersDataRequest(terminal.TerminalId, ReceiptType.PackingSlip, QueryResultSettings.AllRecords, hardwareProfileId);
                var printersResponse = await context.ExecuteAsync<EntityDataServiceResponse<Printer>>(getPrintersByReceiptTypeDataRequest).ConfigureAwait(false);
                IEnumerable<Printer> printers = printersResponse.PagedEntityCollection.Results;
                Printer printer = printers.FirstOrDefault(p => p.PrinterType == (int)DeviceType.WindowsPrinter);

                return new List<Printer>() { printer }.AsReadOnly();
            }
        }
    }
}
