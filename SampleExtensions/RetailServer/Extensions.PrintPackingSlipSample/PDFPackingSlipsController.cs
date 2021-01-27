namespace Contoso.RetailServer.PrintPackingSlipSample
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;
    using Contoso.Commerce.Runtime.PrintPackingSlipSample.Messages;

    [RoutePrefix("SalesOrders")] // The SalesOrders controller already exists, so no need to re-declare its entity binding
    public class PDFPackingSlipsController : IController
    {
        /// <summary>
        /// Gets the packing slips by packing slip Id and sales Id.
        /// </summary>
        /// <param name="parameters">The OData action parameters.</param>
        /// <returns>A collection of receipts.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Employee)]
        public async Task<IEnumerable<Receipt>> GetFulfillmentPackingSlipsPDF(IEndpointContext context, string salesId, string PackingSlipId, string hardwareProfileId)
        {
            var request = new GetFulfillmentPackingSlipsPDFRequest(salesId, PackingSlipId, hardwareProfileId);
            var response = await context.ExecuteAsync<GetFulfillmentPackingSlipsPDFResponse>(request).ConfigureAwait(false);

            return response.Receipts;
        }
    }
}
