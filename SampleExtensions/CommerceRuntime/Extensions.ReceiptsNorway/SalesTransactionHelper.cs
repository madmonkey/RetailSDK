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
    namespace Commerce.Runtime.ReceiptsNorway
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Sales transaction helper.
        /// </summary>
        public static class SalesTransactionHelper
        {
            /// <summary>
            /// Represents skip reports sales line attribute name.
            /// </summary>
            /// <remarks>This attribute name must match the one used in SalesPaymentTransExt Commerce Runtime extension project.</remarks>
            private const string SkipReportAttributeName = "SkipReports_CF488CB6-00C0-4964-B56A-21A337BB9081";

            /// <summary>
            /// Represents skip reports sales line attribute text value.
            /// </summary>
            private const string SkipReportAttributeValue = "Yes";

            /// <summary>
            /// Gets total amount with tax for the specified sales order over its accounted lines.
            /// </summary>
            /// <param name="salesOrder">Sales order.</param>
            /// <returns>Total amount with tax over accounted lines.</returns>
            public static decimal GetTotalAmountWithTaxExt(SalesOrder salesOrder)
            {
                ThrowIf.Null(salesOrder, "salesOrder");

                return GetSalesLinesExt(salesOrder).Sum(salesLine => salesLine.TotalAmount);
            }

            /// <summary>
            /// Gets total tax amount for the specified sales order over its accounted tax lines.
            /// </summary>
            /// <param name="salesOrder">Sales order.</param>
            /// <returns>Total tax amount over accounted lines.</returns>
            public static decimal GetTotalTaxAmountExt(SalesOrder salesOrder)
            {
                ThrowIf.Null(salesOrder, "salesOrder");

                return GetTaxLinesExt(salesOrder).Sum(taxLine => taxLine.Amount);
            }

            /// <summary>
            /// Gets total sales amount for the specified sales order over its accounted lines.
            /// </summary>
            /// <param name="salesOrder">Sales order.</param>
            /// <returns>Total sales amount over accounted lines.</returns>
            public static decimal GetTotalSalesAmountExt(SalesOrder salesOrder)
            {
                ThrowIf.Null(salesOrder, "salesOrder");

                return GetTotalAmountWithTaxExt(salesOrder) - GetTotalTaxAmountExt(salesOrder);
            }

            /// <summary>
            /// Gets tax amount for the specified tax code over accounted sales order tax lines.
            /// </summary>
            /// <param name="salesOrder">Sales order.</param>
            /// <param name="taxCode">Tax code.</param>
            /// <returns>Tax amount for the specified tax code.</returns>
            public static decimal GetTaxAmountPerTaxCodeExt(SalesOrder salesOrder, string taxCode)
            {
                ThrowIf.Null(salesOrder, "salesOrder");

                return GetTaxLinesExt(salesOrder).Where(taxLine => taxLine.TaxCode == taxCode).Sum(taxLine => taxLine.Amount);
            }

            /// <summary>
            /// Retrieve sales order lines that should be accounted.
            /// </summary>
            /// <param name="salesOrder">Sales order to retrieve sales lines from.</param>
            /// <returns>A collection of sales lines to be accounted.</returns>
            public static IEnumerable<SalesLine> GetSalesLinesExt(SalesOrder salesOrder)
            {
                ////Exclude: 
                //// voided transactions by accessing ActiveSalesLines
                //// gift cards operations by checking IsGiftCardLine
                //// deposit operations by checking extended property of sale line

                ThrowIf.Null(salesOrder, "salesOrder");

                return salesOrder.ActiveSalesLines.Where(line => !line.IsGiftCardLine && !IsSkippedLine(line) && !salesOrder.CustomerOrderType.Equals(CustomerOrderType.Quote));
            }

            /// <summary>
            /// Gets the cash transaction sequential number custom field value.
            /// </summary>
            /// <param name="salesOrder">Sales order to retrieve sequential number from.</param>
            /// <returns>The cash transaction sequential number custom field value.</returns>
            public static string GetSequentialNumber(SalesOrder salesOrder)
            {
                ThrowIf.Null(salesOrder, "salesOrder");

                FiscalTransaction fiscalTransaction = salesOrder.FiscalTransactions
                    .Where(ft => ft.ReceiptCopy == false && !string.IsNullOrEmpty(ft.RegisterResponse))
                    .OrderByDescending(ft => ft.CreatedDateTime)
                    .FirstOrDefault();

                string returnValue = string.Empty;

                if (fiscalTransaction != null)
                {
                    var signedTransactionData = SerializationHelper.DeserializeSequentialSignatureDataFromJson<SequentialSignatureRegisterableData>(fiscalTransaction.RegisterResponse);
                    returnValue = signedTransactionData == null ? string.Empty : signedTransactionData.SequentialNumber.ToString();
                }

                return returnValue;
            }

            /// <summary>
            /// Retrieve sales order tax lines that should be accounted.
            /// </summary>
            /// <param name="salesOrder">Sales order to retrieve tax lines from.</param>
            /// <returns>A collection of tax lines to be accounted.</returns>
            private static IEnumerable<TaxLine> GetTaxLinesExt(SalesOrder salesOrder)
            {
                return GetSalesLinesExt(salesOrder).SelectMany(salesLine => salesLine.TaxLines);
            }

            /// <summary>
            /// Determines whether sales line should be skipped.
            /// </summary>
            /// <param name="line">Line to check.</param>
            /// <returns>True if sales line should be skipped, False otherwise.</returns>
            /// <remarks>SkipSalesLine flag is set in the SalesPaymentTransExt Commerce Runtime extension project.</remarks>
            private static bool IsSkippedLine(SalesLine line)
            {
                AttributeTextValue skipReportAttribute = line.AttributeValues.SingleOrDefault(attribute => string.Equals(attribute.Name, SkipReportAttributeName, StringComparison.OrdinalIgnoreCase)) as AttributeTextValue;

                return skipReportAttribute != null ? string.Equals(skipReportAttribute.TextValue, SkipReportAttributeValue, StringComparison.OrdinalIgnoreCase) : false;
            }
        }
    }
}
