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
    namespace Retail.Ecommerce.Web.Storefront.Controllers
    {
        using System.Threading.Tasks;
        using System.Web.Mvc;
        using Microsoft.Dynamics.Commerce.RetailProxy;
        using Retail.Ecommerce.Sdk.Core;
        using Retail.Ecommerce.Sdk.Core.OperationsHandlers;

        /// <summary>
        /// Sales Order Controller.
        /// </summary>
        public class SalesOrderController : WebApiControllerBase
        {
            /// <summary>
            /// Gets the sales order details.
            /// </summary>
            /// <param name="transactionId">The transaction identifier.</param>
            /// <param name="searchLocationValue">Specifies the locations that should be searched.</param>
            /// <returns>A response containing the sales order inquired for.</returns>
            public async Task<ActionResult> GetSalesOrderDetailsByTransactionId(string transactionId, int searchLocationValue)
            {
                EcommerceContext ecommerceContext = ServiceUtilities.GetEcommerceContext(this.HttpContext);
                SalesOrderOperationsHandler salesOrderOperationHandler = new SalesOrderOperationsHandler(ecommerceContext);
                SalesOrder salesOrder = await salesOrderOperationHandler.GetSalesOrderDetailsByTransactionId(transactionId, searchLocationValue);

                return this.Json(salesOrder);
            }

            /// <summary>
            /// Gets the sales order details.
            /// </summary>
            /// <param name="salesId">The sales identifier.</param>
            /// <returns>A response containing the sales order inquired for.</returns>
            public async Task<ActionResult> GetSalesOrderDetailsBySalesId(string salesId)
            {
                EcommerceContext ecommerceContext = ServiceUtilities.GetEcommerceContext(this.HttpContext);
                SalesOrderOperationsHandler salesOrderOperationHandler = new SalesOrderOperationsHandler(ecommerceContext);
                SalesOrder salesOrder = await salesOrderOperationHandler.GetSalesOrderDetailsBySalesId(salesId);

                return this.Json(salesOrder);
            }
        }
    }
}