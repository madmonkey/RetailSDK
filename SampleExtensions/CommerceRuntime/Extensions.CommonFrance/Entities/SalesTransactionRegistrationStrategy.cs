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
    namespace Commerce.Runtime.CommonFrance
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Encapsulates sales transaction signature signing strategy.
        /// </summary>
        public class SalesTransactionRegistrationStrategy : ISalesTransactionRegistrationStrategy
        {
            private const string BuildNumberAttributeName = "BUILD_NUMBER_068160BD_AB37_4E88_93FF_418E842BD803";

            private RequestContext context;
            private string carryoutDeliveryModeCode;

            /// <summary>
            /// Initializes a new instance of the <see cref="SalesTransactionRegistrationStrategy" /> class.
            /// </summary>
            /// <param name="context">The request context.</param>
            public SalesTransactionRegistrationStrategy(RequestContext context)
            {
                this.context = context;
                this.carryoutDeliveryModeCode = this.context.GetChannelConfiguration().CarryoutDeliveryModeCode;
            }

            /// <summary>
            /// Retrieve sales lines from retail transaction.
            /// </summary>
            /// <param name="transaction">Retail sales transaction to retrieve sales lines from.</param>
            /// <returns>A collection of sales lines to be signed.</returns>
            public IEnumerable<SalesLine> GetSaleLines(SalesTransaction transaction)
            {
                ThrowIf.Null(transaction, "transaction");

                return transaction.ActiveSalesLines
                    .Where(line => !line.IsGiftCardLine && !this.IsDepositLine(transaction, line))
                    .Where(line => IsNormalLineValid(transaction, line) || IsPostedLineValid(transaction, line))
                    .Where(line => !line.IsInvoiceLine);
            }

            /// <summary>
            /// Determines whether the retail sales transaction should be registered.
            /// </summary>
            /// <param name="transaction">The retail sales transaction to check.</param>
            /// <returns>Returns True if retail sales transaction should be registered, return False otherwise.</returns>
            public bool IsRegistrationRequired(SalesTransaction transaction)
            {
                ThrowIf.Null(transaction, "transaction");

                // perform signing only if there are lines to sign 
                bool hasSaleLinesForSigning = this.GetSaleLines(transaction).Any();
                bool isValidEntryStatus = false;
                bool isValidCustomerOrderCartType = false;

                if (transaction.CartType == CartType.CustomerOrder && transaction.CustomerOrderType == CustomerOrderType.SalesOrder &&
                    (transaction.CustomerOrderMode == CustomerOrderMode.CustomerOrderCreateOrEdit || transaction.CustomerOrderMode == CustomerOrderMode.Pickup || transaction.CustomerOrderMode == CustomerOrderMode.Return))
                {
                    isValidCustomerOrderCartType = true;
                }

                if (transaction.EntryStatus == TransactionStatus.Normal || transaction.EntryStatus == TransactionStatus.Posted)
                {
                    isValidEntryStatus = true;
                }

                if (hasSaleLinesForSigning && isValidEntryStatus && (transaction.CartType == CartType.Shopping || isValidCustomerOrderCartType))
                {
                    return true;
                }

                return false;
            }

            /// <summary>
            /// Retrieves build number from <see cref="SalesTransaction"/>.
            /// </summary>
            /// <param name="transaction"><see cref="SalesTransaction"/> to be processed.</param>
            /// <returns>String containing build number if it was successfully retrieved, empty string otherwise.</returns>
            public string GetBuildNumber(SalesTransaction transaction)
            {
                ThrowIf.Null(transaction, "transaction");

                var buildNumberAttribute = transaction.AttributeValues
                    .SingleOrDefault(attribute => string.Equals(attribute.Name, BuildNumberAttributeName, StringComparison.OrdinalIgnoreCase))
                    as AttributeTextValue;

                return buildNumberAttribute?.TextValue ?? string.Empty;
            }

            /// <summary>
            /// Determines whether the sales transaction with normal status is valid.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction to check.</param>
            /// <param name="line">The sales line to check.</param>
            /// <returns>Returns True if line is valid, False otherwise.</returns>
            private static bool IsNormalLineValid(SalesTransaction salesTransaction, SalesLine line)
            {
                return line.Status == TransactionStatus.Normal &&
                    salesTransaction.EntryStatus == TransactionStatus.Normal &&
                    (salesTransaction.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.Sales || salesTransaction.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.AsyncCustomerOrder);
            }

            /// <summary>
            /// Determines whether the sales transaction with posted status is valid.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction to check.</param>
            /// <param name="line">The sales line to check.</param>
            /// <returns>Returns True if line is valid, False otherwise.</returns>
            private static bool IsPostedLineValid(SalesTransaction salesTransaction, SalesLine line)
            {
                return line.Status == TransactionStatus.Posted &&
                    salesTransaction.EntryStatus == TransactionStatus.Posted &&
                    salesTransaction.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.CustomerOrder;
            }

            /// <summary>
            /// Checks whether the sales line is deposit line.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="line">The sales line.</param>
            /// <returns>Returns True if line is deposit line, False otherwise.</returns>
            private bool IsDepositLine(SalesTransaction salesTransaction, SalesLine line)
            {
                if (string.IsNullOrEmpty(this.carryoutDeliveryModeCode))
                {
                    return false;
                }

                bool isCarryOut = string.Equals(line.DeliveryMode, this.carryoutDeliveryModeCode, StringComparison.OrdinalIgnoreCase);

                bool isValidOrderType = salesTransaction.CartType == CartType.CustomerOrder || salesTransaction.CustomerOrderType == CustomerOrderType.Quote;

                bool isValidCustomerOrderSalesOrder = salesTransaction.CartType == CartType.None &&
                    (salesTransaction.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.CustomerOrder ||
                    salesTransaction.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.AsyncCustomerOrder);

                bool isValidCustomerOrderMode = salesTransaction.CustomerOrderMode == CustomerOrderMode.CustomerOrderCreateOrEdit ||
                     salesTransaction.CustomerOrderMode == CustomerOrderMode.Cancellation ||
                     salesTransaction.CustomerOrderMode == CustomerOrderMode.QuoteCreateOrEdit;

                return !isCarryOut && (isValidOrderType || isValidCustomerOrderSalesOrder) && isValidCustomerOrderMode;
            }
        }
    }
}