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
    namespace Retail.Ecommerce.Sdk.Core.OperationsHandlers
    {
        using System;
        using System.Linq;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.RetailProxy;

        /// <summary>
        /// Handler for sales order operations.
        /// </summary>
        public class SalesOrderOperationsHandler : OperationsHandlerBase
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="SalesOrderOperationsHandler"/> class.
            /// </summary>
            /// <param name="ecommerceContext">The ecommerce context.</param>
            public SalesOrderOperationsHandler(EcommerceContext ecommerceContext) : base(ecommerceContext)
            {
            }

            /// <summary>
            /// Get the details of a sales order with the specified identifiers.
            /// </summary>
            /// <param name="transactionId">The transaction identifier.</param>
            /// <param name="searchLocationValue">Specifies the locations that should be searched.</param>
            /// <returns>Specific sales order.</returns>
            public async Task<SalesOrder> GetSalesOrderDetailsByTransactionId(string transactionId, int searchLocationValue)
            {
                if (transactionId == null)
                {
                    throw new ArgumentNullException(nameof(transactionId));
                }

                ManagerFactory managerFactory = Utilities.GetManagerFactory(this.EcommerceContext);
                ISalesOrderManager salesOrderManager = managerFactory.GetManager<ISalesOrderManager>();
                SalesOrder salesOrder = await salesOrderManager.GetSalesOrderDetailsByTransactionId(transactionId, searchLocationValue);

                PagedResult<SalesOrder> salesOrders = await DataAugmenter.GetAugmentedSalesOrders(this.EcommerceContext, new PagedResult<SalesOrder>(new SalesOrder[] { salesOrder }));
                salesOrder = salesOrders.Results.Single();

                return salesOrder;
            }

            /// <summary>
            /// Get the details of a sales order with the specified identifiers.
            /// </summary>
            /// <param name="salesOrderId">The sales order identifier.</param>
            /// <returns>Specific sales order.</returns>
            public async Task<SalesOrder> GetSalesOrderDetailsBySalesId(string salesOrderId)
            {
                if (salesOrderId == null)
                {
                    throw new ArgumentNullException(nameof(salesOrderId));
                }

                ManagerFactory managerFactory = Utilities.GetManagerFactory(this.EcommerceContext);
                ISalesOrderManager salesOrderManager = managerFactory.GetManager<ISalesOrderManager>();
                SalesOrder salesOrder = await salesOrderManager.GetSalesOrderDetailsBySalesId(salesOrderId);

                PagedResult<SalesOrder> salesOrders = await DataAugmenter.GetAugmentedSalesOrders(this.EcommerceContext, new PagedResult<SalesOrder>(new SalesOrder[] { salesOrder }));
                salesOrder = salesOrders.Results.Single();

                return salesOrder;
            }
        }
    }
}