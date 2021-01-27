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
    namespace Commerce.Runtime.SalesTransactionSignatureSample
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Encapsulates sales transaction signature signing strategy.
        /// </summary>
        public class SalesTransactionSignatureSigningStrategy
        {
            /// <summary>
            /// Represents skip reports sales line attribute name.
            /// </summary>
            /// <remarks>This attribute name must match the one used in SalesPaymentTransExt Commerce Runtime extension project.</remarks>
            private const string SkipReportsAttributeName = "SkipReports_CF488CB6-00C0-4964-B56A-21A337BB9081";

            /// <summary>
            /// Represents skip reports sales line attribute text value.
            /// </summary>
            private const string SkipReportsAttributeYesValue = "Yes";

            /// <summary>
            /// Retrieve sales lines that should be signed from sales transaction.
            /// </summary>
            /// <param name="salesTransaction">Sales transaction to retrieve sales lines from.</param>
            /// <returns>A collection of sales lines to be signed.</returns>
            public IEnumerable<SalesLine> GetSaleLinesForSigning(SalesTransaction salesTransaction)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");

                // Exclude: 
                // voided transactions by accessing ActiveSalesLines
                // gift cards operations by checking IsGiftCardLine
                // deposit operations by checking extended attribute of sale line
                return salesTransaction.ActiveSalesLines
                    .Where(line => !line.IsGiftCardLine && !this.IsSkipReportsLine(line))
                    .Where(line => this.IsNormalLineValid(salesTransaction, line) || this.IsPostedLineValid(salesTransaction, line));
            }

            /// <summary>
            /// Determines whether the sales transaction should be signed.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction to check.</param>
            /// <returns>Returns True if sales transaction should be signed, return False otherwise.</returns>
            public bool IsSigningRequired(SalesTransaction salesTransaction)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");

                // perform signing only if there are lines to sign 
                bool hasSaleLinesForSigning = this.GetSaleLinesForSigning(salesTransaction).Any();
                bool isValidEntryStatus = false;
                bool isValidCustomerOrderCartType = false;

                if (salesTransaction.CartType == CartType.CustomerOrder && salesTransaction.CustomerOrderType == CustomerOrderType.SalesOrder &&
                    (salesTransaction.CustomerOrderMode == CustomerOrderMode.CustomerOrderCreateOrEdit || salesTransaction.CustomerOrderMode == CustomerOrderMode.Pickup || salesTransaction.CustomerOrderMode == CustomerOrderMode.Return))
                {
                    isValidCustomerOrderCartType = true;
                }

                if (salesTransaction.EntryStatus == TransactionStatus.Normal || salesTransaction.EntryStatus == TransactionStatus.Posted)
                {
                    isValidEntryStatus = true;
                }

                if (hasSaleLinesForSigning && isValidEntryStatus && (salesTransaction.CartType == CartType.Shopping || isValidCustomerOrderCartType))
                {
                    return true;
                }

                return false;
            }

            /// <summary>
            /// Determines whether the sales transaction with normal status is valid.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction to check.</param>
            /// <param name="line">The sales line to check.</param>
            /// <returns>Returns True is line is valid, False otherwise.</returns>
            private bool IsNormalLineValid(SalesTransaction salesTransaction, SalesLine line)
            {
                return line.Status == TransactionStatus.Normal &&
                    salesTransaction.EntryStatus == TransactionStatus.Normal &&
                    (salesTransaction.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.AsyncCustomerOrder || salesTransaction.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.Sales);
            }

            /// <summary>
            /// Determines whether the sales transaction with posted status is valid.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction to check.</param>
            /// <param name="line">The sales line to check.</param>
            /// <returns>Returns True is line is valid, False otherwise.</returns>
            private bool IsPostedLineValid(SalesTransaction salesTransaction, SalesLine line)
            {
                return line.Status == TransactionStatus.Posted &&
                    salesTransaction.EntryStatus == TransactionStatus.Posted &&
                    salesTransaction.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.CustomerOrder;
            }

            /// <summary>
            /// Determines whether sales line is skipped in reports.
            /// </summary>
            /// <param name="line">Sales line to check.</param>
            /// <returns>True if sales line is skipped in reports, False otherwise.</returns>
            private bool IsSkipReportsLine(SalesLine line)
            {
                bool isSkipped = false;

                AttributeTextValue skipReportAttribute = line.AttributeValues.SingleOrDefault(attribute => string.Equals(attribute.Name, SkipReportsAttributeName, StringComparison.OrdinalIgnoreCase)) as AttributeTextValue;

                if (skipReportAttribute != null && string.Equals(skipReportAttribute.TextValue, SkipReportsAttributeYesValue, StringComparison.OrdinalIgnoreCase))
                {
                    isSkipped = true;
                }

                return isSkipped;
            }
        }
    }
}