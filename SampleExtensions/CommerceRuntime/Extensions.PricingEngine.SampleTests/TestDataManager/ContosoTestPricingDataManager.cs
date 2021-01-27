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
        using Commerce.Runtime.Extensions.PricingDataServicesSample;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;        

        /// <summary>
        /// Test pricing data manager extension.
        /// </summary>
        /// <remarks>
        /// See <see href="https://blogs.msdn.microsoft.com/retaillife/2017/04/12/dynamics-retail-discount-extensibility-sample-test/">Dynamics Retail Discount Extensibility – Sample Test</see>.
        /// </remarks>
        public class ContosoTestPricingDataManager : TestFoundationPricingDataManager
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="ContosoTestPricingDataManager" /> class.
            /// </summary>
            public ContosoTestPricingDataManager()
                : base()
            {
                foreach (KeyValuePair<string, PriceGroupData> pair in ContosoTestDataCache.Instance.ExtensionPriceGroupLookup)
                {
                    this.PriceGroupLookup.Add(pair.Key, pair.Value);
                }

                this.UpdateEnableExtensionValidation(true);
            }

            /// <summary>
            /// Gets retail discount price groups.
            /// </summary>
            /// <param name="offerIds">Offer identifiers.</param>
            /// <returns>
            /// A collection of retail discount price groups of type ReadOnlyCollection&lt;RetailDiscountPriceGroup&gt;.
            /// </returns>
            public override object GetRetailDiscountPriceGroups(object offerIds)
            {
                IEnumerable<string> offerIdSet = offerIds as IEnumerable<string>;

                List<RetailDiscountPriceGroup> discountPriceGroups = this.FindDiscountPriceGroupsByOfferId(ContosoTestDataCache.Instance.AllExtensionDiscountsLookup, offerIdSet);

                IEnumerable<RetailDiscountPriceGroup> priceGroupsFromBase = base.GetRetailDiscountPriceGroups(offerIds) as IEnumerable<RetailDiscountPriceGroup>;
                discountPriceGroups.AddRange(priceGroupsFromBase);

                return discountPriceGroups.AsReadOnly();
            }

            /// <summary>
            /// Fetch all retail discounts for the given items, striped by item Id and dimension Id.
            /// </summary>
            /// <param name="items">The set of items to search by. Set of pairs of item Id and variant dimension Id. Ignores the unit.</param>
            /// <param name="priceGroups">Set of price groups to search by.</param>
            /// <param name="minActiveDate">The earliest inclusive active date to search by. Must be less than or equal to maxActiveDate.</param>
            /// <param name="maxActiveDate">The latest inclusive active date to search by. Must be greater than or equal to minActiveDate.</param>
            /// <param name="currencyCode">Currency code to filter by.</param>
            /// <param name="settings">The query result settings.</param>
            /// <returns>Collection of price adjustments striped by item Id and variant dimension Id (if any) of type ReadOnlyCollection&lt;PeriodicDiscount&gt;.</returns>
            public override object ReadRetailDiscounts(object items, object priceGroups, DateTimeOffset minActiveDate, DateTimeOffset maxActiveDate, string currencyCode, QueryResultSettings settings)
            {
                IEnumerable<ItemUnit> itemSet = items as IEnumerable<ItemUnit>;
                ISet<string> priceGroupSet = priceGroups as ISet<string>;

                List<PeriodicDiscount> discounts = new List<PeriodicDiscount>((IEnumerable<PeriodicDiscount>)base.ReadRetailDiscounts(items, priceGroups, minActiveDate, maxActiveDate, currencyCode, settings));

                List<PeriodicDiscount> oneSet = this.GetRetailDiscounts(
                    itemSet,
                    priceGroupSet,
                    minActiveDate,
                    maxActiveDate,
                    currencyCode,
                    ExtensiblePeriodicDiscountOfferType.Offer,
                    ContosoTestDataCache.Instance.OfferLineFilterLookup);

                // Fix the line period filter.
                foreach (PeriodicDiscount periodicDiscount in oneSet)
                {
                    PeriodicDiscountData discountData = ContosoTestDataCache.Instance.OfferLineFilterLookup[periodicDiscount.OfferId];

                    foreach (PeriodicDiscountLineData lineData in discountData.DiscountLines)
                    {
                        if (lineData.DiscountLineNumber == periodicDiscount.DiscountLineNumber)
                        {
                            ContosoDiscountLineData extensionLineData = lineData as ContosoDiscountLineData;
                            if (extensionLineData != null && !string.IsNullOrEmpty(extensionLineData.ContosoPeriodId))
                            {
                                periodicDiscount.SetProperty("ExtensionLinePeriodId", extensionLineData.ContosoPeriodId);
                                periodicDiscount.SetProperty("ExtensionLinePeriod", extensionLineData.ContosoPeriod);
                            }
                        }
                    }
                }

                discounts.AddRange(oneSet);

                oneSet = this.GetRetailDiscounts(
                    itemSet,
                    priceGroupSet,
                    minActiveDate,
                    maxActiveDate,
                    currencyCode,
                    ContosoPeriodicDiscountOfferType.AmountCap,
                    ContosoTestDataCache.Instance.AmountCapLookup);
                discounts.AddRange(oneSet);

                return discounts.AsReadOnly();
            }

            /// <summary>
            /// Convers the discount and line data to a periodic discount.
            /// </summary>
            /// <param name="itemUnit">The item unit.</param>
            /// <param name="discountData">The discount data.</param>
            /// <param name="lineData">The line data.</param>
            /// <param name="offerType">The offer type.</param>
            /// <returns>A periodic discount.</returns>
            protected override PeriodicDiscount ConvertDiscountAndLineDataToPeriodicDiscount(
                ItemUnit itemUnit,
                PeriodicDiscountData discountData,
                PeriodicDiscountLineData lineData,
                ExtensiblePeriodicDiscountOfferType offerType)
            {
                ThrowIf.Null(itemUnit, "itemUnit");
                ThrowIf.Null(discountData, "discountData");
                ThrowIf.Null(lineData, "lineData");

                PeriodicDiscount periodicDiscount = base.ConvertDiscountAndLineDataToPeriodicDiscount(
                    itemUnit,
                    discountData,
                    lineData,
                    offerType);

                if (offerType == ContosoPeriodicDiscountOfferType.AmountCap)
                {
                    periodicDiscount.DiscountMethod = (int)lineData.DiscountOfferMethod;
                    switch (lineData.DiscountOfferMethod)
                    {
                        case DiscountOfferMethod.DiscountAmount:
                            periodicDiscount.DiscountAmount = lineData.DiscountOfferValue;
                            break;
                        case DiscountOfferMethod.DiscountPercent:
                            periodicDiscount.DiscountPercent = lineData.DiscountOfferValue;
                            break;
                        case DiscountOfferMethod.OfferPrice:
                            periodicDiscount.OfferPrice = lineData.DiscountOfferValue;
                            break;
                    }
                }

                return periodicDiscount;
            }

            /// <summary>
            /// Gets lookup dictionary for all discounts and price adjustments.
            /// </summary>
            /// <returns>A dictionary of discounts and price adjustments.</returns>
            protected override Dictionary<string, PeriodicDiscountData> GetAllDiscountAndAdjustmentLookup()
            {
                Dictionary<string, PeriodicDiscountData> allDiscounts = new Dictionary<string, PeriodicDiscountData>(base.GetAllDiscountAndAdjustmentLookup(), StringComparer.OrdinalIgnoreCase);
                foreach (KeyValuePair<string, PeriodicDiscountData> pair in ContosoTestDataCache.Instance.AllExtensionDiscountsLookup)
                {
                    allDiscounts.Add(pair.Key, pair.Value);
                }

                return allDiscounts;
            }
        }
    }
}