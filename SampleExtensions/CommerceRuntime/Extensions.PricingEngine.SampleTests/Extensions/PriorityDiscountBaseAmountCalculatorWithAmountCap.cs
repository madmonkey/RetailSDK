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
    namespace Commerce.Runtime.Extensions.PricingEngineSample.Tests
    {
        using System;
        using System.Collections.Generic;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine;
        using Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine.DiscountData;

        /// <summary>
        /// Test priority discount base amount calculator with amount cap.
        /// </summary>
        internal class PriorityDiscountBaseAmountCalculatorWithAmountCap : IPriorityDiscountBaseAmountCalculator
        {
            private Dictionary<string, Dictionary<int, decimal>> salesLineIdToPriorityToDiscountBaseAmountLookup = new Dictionary<string, Dictionary<int, decimal>>(StringComparer.OrdinalIgnoreCase);
            private Dictionary<string, decimal> salesLineIdToDiscountBaseAmountLookup = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase);

            /// <summary>Gets the sales line Id to discount base amount lookup.</summary>
            internal Dictionary<string, decimal> SalesLineIdToDiscountBaseAmountLookup
            {
                get { return this.salesLineIdToDiscountBaseAmountLookup; }
            }

            /// <summary>Gets the sales line Id to priority discount base amount list lookup.</summary>
            internal Dictionary<string, List<PriorityDiscountBaseAmount>> SalesLineIdToPriorityDiscountBaseAmountsLookup
            {
                get
                {
                    Dictionary<string, List<PriorityDiscountBaseAmount>> lookup = new Dictionary<string, List<PriorityDiscountBaseAmount>>(StringComparer.OrdinalIgnoreCase);

                    foreach (KeyValuePair<string, decimal> pair in this.salesLineIdToDiscountBaseAmountLookup)
                    {
                        lookup.Add(pair.Key, new List<PriorityDiscountBaseAmount>() { new PriorityDiscountBaseAmount(pair.Value) });
                    }

                    foreach (KeyValuePair<string, Dictionary<int, decimal>> pair in this.salesLineIdToPriorityToDiscountBaseAmountLookup)
                    {
                        string salesLineId = pair.Key;
                        Dictionary<int, decimal> priorityToDiscountBaseAmountLookup = pair.Value;

                        List<PriorityDiscountBaseAmount> priorityDiscountBaseAmountList;
                        if (!lookup.TryGetValue(salesLineId, out priorityDiscountBaseAmountList))
                        {
                            priorityDiscountBaseAmountList = new List<PriorityDiscountBaseAmount>();
                            lookup.Add(salesLineId, priorityDiscountBaseAmountList);
                        }

                        foreach (KeyValuePair<int, decimal> priorityAmountPair in priorityToDiscountBaseAmountLookup)
                        {
                            priorityDiscountBaseAmountList.Add(new PriorityDiscountBaseAmount(priorityAmountPair.Key, priorityAmountPair.Value));
                        }
                    }

                    return lookup;
                }
            }

            /// <summary>
            /// Gets the discount base amount.
            /// </summary>
            /// <param name="discountItemGroup">Discountable item group.</param>
            /// <param name="priceContext">Price context.</param>
            /// <returns>Discount base amount.</returns>
            public decimal GetDiscountBaseAmount(DiscountableItemGroup discountItemGroup, PriceContext priceContext)
            {
                ThrowIf.Null(discountItemGroup, "discountItemGroup");

                decimal discountBaseAmount;

                if (!this.salesLineIdToDiscountBaseAmountLookup.TryGetValue(discountItemGroup[0].LineId, out discountBaseAmount))
                {
                    discountBaseAmount = discountItemGroup.Price;
                }

                return discountBaseAmount;
            }

            /// <summary>
            /// Calculate priority discount base amount.
            /// </summary>
            /// <param name="currentPriority">Current priority.</param>
            /// <param name="discountItemGroup">Discountable item group.</param>
            /// <param name="itemGroupIndex">Item group index.</param>
            /// <param name="appliedDiscountApplications">Applied discount applications.</param>
            /// <param name="existingPriorityDiscountBaseAmounts">Existing priority discount base amounts.</param>
            /// <param name="priceContext">Price context.</param>
            /// <returns>Discount base amount for the priority.</returns>
            public decimal CalculatePriorityDiscountBaseAmount(
                int currentPriority,
                DiscountableItemGroup discountItemGroup,
                int itemGroupIndex,
                IReadOnlyCollection<AppliedDiscountApplication> appliedDiscountApplications,
                IReadOnlyCollection<PriorityDiscountBaseAmount> existingPriorityDiscountBaseAmounts,
                PriceContext priceContext)
            {
                ThrowIf.Null(discountItemGroup, "discountItemGroup");

                decimal discountBaseAmount = discountItemGroup.Price;

                Dictionary<int, decimal> priorityToDiscountBaseAmountLookup;
                if (this.salesLineIdToPriorityToDiscountBaseAmountLookup.TryGetValue(discountItemGroup[0].LineId, out priorityToDiscountBaseAmountLookup))
                {
                    int smallestPriority = int.MaxValue;
                    foreach (KeyValuePair<int, decimal> pair in priorityToDiscountBaseAmountLookup)
                    {
                        int priorityInLookup = pair.Key;
                        if (priorityInLookup >= currentPriority)
                        {
                            if (priorityInLookup < smallestPriority)
                            {
                                smallestPriority = priorityInLookup;
                                discountBaseAmount = pair.Value;
                            }
                        }
                    }
                }

                return discountBaseAmount;
            }

            /// <summary>
            /// Default calculation won't use this base amount for threshold calculation.
            /// </summary>
            /// <returns>PriorityDiscountBaseAmountCalculator returns false.</returns>
            public bool ShouldOverrideDiscountBaseAmountForThresholds()
            {
                return false;
            }

            /// <summary>
            /// Adds sales line discount base amount.
            /// </summary>
            /// <param name="lineId">Sales line Id.</param>
            /// <param name="discountBaseAmount">Discount base amount.</param>
            internal void AddSalesLineDiscountBaseAmount(string lineId, decimal discountBaseAmount)
            {
                this.salesLineIdToDiscountBaseAmountLookup[lineId] = discountBaseAmount;
            }

            /// <summary>
            /// Adds sales line priority discount base amount.
            /// </summary>
            /// <param name="lineId">Sales line Id.</param>
            /// <param name="priority">Pricing priority.</param>
            /// <param name="discountBaseAmount">Discount base amount.</param>
            internal void AddSaleLineIdPriorityDiscountBaseAmount(string lineId, int priority, decimal discountBaseAmount)
            {
                Dictionary<int, decimal> priorityToDiscountBaseAmountLookup;
                if (this.salesLineIdToPriorityToDiscountBaseAmountLookup.TryGetValue(lineId, out priorityToDiscountBaseAmountLookup))
                {
                    priorityToDiscountBaseAmountLookup.Add(priority, discountBaseAmount);
                }
                else
                {
                    this.salesLineIdToPriorityToDiscountBaseAmountLookup.Add(lineId, new Dictionary<int, decimal>() { { priority, discountBaseAmount } });
                }
            }
        }
    }
}