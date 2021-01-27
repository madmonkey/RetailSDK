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
    namespace Commerce.Runtime.SalesTransactionSignatureNorway
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// The manager for sales extension.
        /// </summary>
        public static class SalesTransactionExtManager
        {
            /// <summary>
            /// Attribute name for skip report flag.
            /// </summary>
            public const string SkipReportsAttributeName = "SkipReports_CF488CB6-00C0-4964-B56A-21A337BB9081";

            /// <summary>
            /// Text attribute value for skip report flag positive state.
            /// </summary>
            public const string SkipReportsAttributeYesValue = "Yes";

            /// <summary>
            /// Text attribute value for skip report flag negative state.
            /// </summary>
            public const string SkipReportsAttributeNoValue = "No";

            /// <summary>
            /// Property name for amount adjustment value.
            /// </summary>
            public const string AmountInChannelCurrencyAdjustmentPropName = "AmountInChannelCurrencyAdjustment_08976721-34D1-45E9-AB79-202B8809E757";

            /// <summary>
            /// Sets skip reports attribute in sales lines.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="context">The request context.</param>
            public static void SetSkipReportsExtPropForSalesLine(SalesTransaction salesTransaction, RequestContext context)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");
                ThrowIf.Null(context, "context");

                if (!IsTransactionRequiresExtProperties(salesTransaction))
                {
                    return;
                }

                bool isTransactionSupportsPrepayment = IsTransactionSupportsPrepayment(salesTransaction);
                string carryoutDeliveryModeCode = context.GetChannelConfiguration().CarryoutDeliveryModeCode;

                foreach (SalesLine salesLine in salesTransaction.SalesLines)
                {
                    AttributeTextValue skipReportAttribute = salesLine.AttributeValues.SingleOrDefault(attribute => string.Equals(attribute.Name, SkipReportsAttributeName, StringComparison.OrdinalIgnoreCase)) as AttributeTextValue;

                    if (isTransactionSupportsPrepayment && !string.IsNullOrEmpty(carryoutDeliveryModeCode))
                    {
                        bool skipReport = !string.Equals(salesLine.DeliveryMode, carryoutDeliveryModeCode, StringComparison.OrdinalIgnoreCase);
                        string skipReportsAttributeValue = skipReport ? SkipReportsAttributeYesValue : SkipReportsAttributeNoValue;

                        if (skipReportAttribute == null)
                        {
                            salesLine.AttributeValues.Add(new AttributeTextValue() { Name = SkipReportsAttributeName, TextValue = skipReportsAttributeValue });
                        }
                        else
                        {
                            skipReportAttribute.TextValue = skipReportsAttributeValue;
                        }
                    }
                    else
                    {
                        if (skipReportAttribute != null)
                        {
                            salesLine.AttributeValues.Remove(skipReportAttribute);
                        }
                    }
                }
            }

            /// <summary>
            /// Sets amount adjustment property.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="context">The request context.</param>
            public static void SetPaymentAmountAdjustmentExtPropForTenderline(SalesTransaction salesTransaction, RequestContext context)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");
                ThrowIf.Null(context, "context");

                if (!IsTransactionRequiresExtProperties(salesTransaction))
                {
                    return;
                }

                decimal totalAdjustmentAmount = CalculateTotalAdjustmentAmount(salesTransaction, context);

                UpdateAdjustmentAmount(salesTransaction, totalAdjustmentAmount);
            }

            /// <summary>
            /// Calculates the total adjustment amount.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="context">The request context.</param>
            /// <returns>The total adjustment amount.</returns>
            private static decimal CalculateTotalAdjustmentAmount(SalesTransaction salesTransaction, RequestContext context)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");
                ThrowIf.Null(context, "context");

                decimal totalAdjustmentAmount = decimal.Zero;

                switch (salesTransaction.CartType)
                {
                    case CartType.Shopping:
                        IEnumerable<SalesLine> giftCardLines = salesTransaction.ActiveSalesLines.Where(l => l.IsGiftCardLine);
                        totalAdjustmentAmount = giftCardLines.Sum(l => l.TotalAmount);

                        break;

                    case CartType.CustomerOrder:
                        if (IsTransactionSupportsPrepayment(salesTransaction))
                        {
                            decimal carryoutLinesTotalAmount = decimal.Zero;
                            string carryoutDeliveryModeCode = context.GetChannelConfiguration().CarryoutDeliveryModeCode;

                            if (!string.IsNullOrEmpty(carryoutDeliveryModeCode))
                            {
                                IEnumerable<SalesLine> carryoutLines = salesTransaction.ActiveSalesLines.Where(l => l.DeliveryMode == carryoutDeliveryModeCode);
                                carryoutLinesTotalAmount = carryoutLines.Sum(l => l.TotalAmount);
                            }

                            totalAdjustmentAmount = salesTransaction.RequiredDepositAmount - salesTransaction.PrepaymentAmountPaid + (salesTransaction.CancellationCharge ?? 0)
                                - carryoutLinesTotalAmount;
                        }

                        break;
                }

                return totalAdjustmentAmount;
            }

            /// <summary>
            /// Updates adjustment amount in tender lines.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="totalAdjustmentAmount">The total adjustment amount.</param>
            private static void UpdateAdjustmentAmount(SalesTransaction salesTransaction, decimal totalAdjustmentAmount)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");

                if (totalAdjustmentAmount != decimal.Zero)
                {
                    TenderLine changeLine = salesTransaction.TenderLines.LastOrDefault(l => (!l.IsHistorical && l.IsChangeLine));
                    if (changeLine != null)
                    {
                        changeLine.SetProperty(AmountInChannelCurrencyAdjustmentPropName, -changeLine.AmountInTenderedCurrency);
                        totalAdjustmentAmount -= changeLine.AmountInTenderedCurrency;
                    }
                }

                IEnumerable<TenderLine> nonHistoricalTenderLinesOrderedByAmountDesc = salesTransaction.TenderLines.Where(l => (!l.IsHistorical && !l.IsChangeLine)).OrderByDescending(l => Math.Abs(l.Amount));

                foreach (TenderLine tenderLine in nonHistoricalTenderLinesOrderedByAmountDesc)
                {
                    if (totalAdjustmentAmount == decimal.Zero || tenderLine.IsVoided)
                    {
                        tenderLine.GetProperties().Remove(AmountInChannelCurrencyAdjustmentPropName);
                    }
                    else
                    {
                        if (Math.Abs(tenderLine.Amount) >= Math.Abs(totalAdjustmentAmount))
                        {
                            tenderLine.SetProperty(AmountInChannelCurrencyAdjustmentPropName, -totalAdjustmentAmount);
                            totalAdjustmentAmount = decimal.Zero;
                        }
                        else
                        {
                            tenderLine.SetProperty(AmountInChannelCurrencyAdjustmentPropName, -tenderLine.Amount);
                            totalAdjustmentAmount -= tenderLine.Amount;
                        }
                    }
                }
            }

            /// <summary>
            /// Checks if the sales transaction requires extension properties.
            /// </summary>
            /// <param name="transaction">The sales transaction.</param>
            /// <returns>True if extension properties is required; otherwise, false.</returns>
            private static bool IsTransactionRequiresExtProperties(SalesTransaction transaction)
            {
                return transaction.CartType == CartType.Shopping ||
                       transaction.CartType == CartType.CustomerOrder;
            }

            /// <summary>
            /// Checks if the sales transaction supports prepayment operations.
            /// </summary>
            /// <param name="transaction">The sales transaction.</param>
            /// <returns>True if prepayment operations is supported; otherwise, false.</returns>
            private static bool IsTransactionSupportsPrepayment(SalesTransaction transaction)
            {
                return transaction.CustomerOrderMode == CustomerOrderMode.CustomerOrderCreateOrEdit ||
                       transaction.CustomerOrderMode == CustomerOrderMode.Cancellation;
            }
        }
    }
}
