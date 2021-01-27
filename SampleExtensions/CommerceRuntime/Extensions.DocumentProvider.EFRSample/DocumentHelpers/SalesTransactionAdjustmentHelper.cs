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
    namespace Commerce.Runtime.DocumentProvider.EFRSample.DocumentHelpers
    {
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Contains helper methods for sales transaction adjustment.
        /// </summary>
        public static class SalesTransactionAdjustmentHelper
        {
            /// <summary>
            /// Gets sales order adjustment type.
            /// </summary>
            /// <param name="salesOrder">The sales order.</param>
            /// <returns>The sales order adjustment type.</returns>
            public static FiscalIntegrationSalesOrderAdjustmentType GetSalesOrderAdjustmentType(SalesOrder salesOrder)
            {
                ThrowIf.Null(salesOrder, nameof(salesOrder));

                FiscalIntegrationSalesOrderAdjustmentType adjustmentType = FiscalIntegrationSalesOrderAdjustmentType.None;

                if (salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.Sales)
                {
                    adjustmentType = FiscalIntegrationSalesOrderAdjustmentType.ExcludeGiftCards;
                }
                else if (salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.CustomerOrder ||
                    salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.AsyncCustomerOrder)
                {
                    adjustmentType = FiscalIntegrationSalesOrderAdjustmentType.ExcludeDeposit;
                }

                return adjustmentType;
            }

            /// <summary>
            /// Gets sales order adjustment type for non-fiscal (NF) document.
            /// </summary>
            /// <param name="salesOrder">The sales order.</param>
            /// <returns>The sales order adjustment type.</returns>
            public static FiscalIntegrationSalesOrderAdjustmentType GetSalesOrderNonFiscalAdjustmentType(SalesOrder salesOrder)
            {
                ThrowIf.Null(salesOrder, nameof(salesOrder));

                FiscalIntegrationSalesOrderAdjustmentType adjustmentType = FiscalIntegrationSalesOrderAdjustmentType.None;

                if (salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.Sales)
                {
                    adjustmentType = FiscalIntegrationSalesOrderAdjustmentType.ExcludeNonGiftCards;
                }
                else if (salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.CustomerOrder ||
                    salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.AsyncCustomerOrder)
                {
                    adjustmentType = FiscalIntegrationSalesOrderAdjustmentType.ExcludeCarryOutLines;
                }

                return adjustmentType;
            }
        }
    }
}
