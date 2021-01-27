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
        using System.Diagnostics.CodeAnalysis;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;

        /// <summary>
        /// Global test sample data cache.
        /// </summary>
        /// <remarks>
        /// See <see href="https://blogs.msdn.microsoft.com/retaillife/2017/04/12/dynamics-retail-discount-extensibility-sample-test/">Dynamics Retail Discount Extensibility – Sample Test</see>.
        /// </remarks>
        internal class ContosoTestDataCache
        {
            private static volatile ContosoTestDataCache instance;
            private static object syncRoot = new object();

            private ContosoTestDataCache()
            {
                this.ExtensionPriceGroupLookup = new Dictionary<string, PriceGroupData>(StringComparer.OrdinalIgnoreCase);

                this.OfferLineFilterLookup = new Dictionary<string, PeriodicDiscountData>(StringComparer.OrdinalIgnoreCase);

                this.AmountCapLookup = new Dictionary<string, PeriodicDiscountData>(StringComparer.OrdinalIgnoreCase);

                this.AllExtensionDiscountsLookup = new Dictionary<string, PeriodicDiscountData>(StringComparer.OrdinalIgnoreCase);
            }

            internal static ContosoTestDataCache Instance
            {
                get
                {
                    if (instance == null)
                    {
                        lock (syncRoot)
                        {
                            if (instance == null)
                            {
                                ContosoTestDataCache localCache = new ContosoTestDataCache();
                                localCache.FillupGlobalTestData();

                                instance = localCache;
                            }
                        }
                    }

                    return instance;
                }
            }

            internal Dictionary<string, PriceGroupData> ExtensionPriceGroupLookup { get; private set; }

            internal Dictionary<string, PeriodicDiscountData> OfferLineFilterLookup { get; private set; }

            internal Dictionary<string, PeriodicDiscountData> AmountCapLookup { get; private set; }

            internal Dictionary<string, PeriodicDiscountData> AllExtensionDiscountsLookup { get; private set; }

            private void FillupGlobalTestData()
            {
                ICollection<PriceGroupData> allExtensionPriceGroups = ContosoPricingRepository.GetAllExtensionPriceGroups();
                foreach (PriceGroupData onePriceGroup in allExtensionPriceGroups)
                {
                    onePriceGroup.FillRecordId();
                    this.ExtensionPriceGroupLookup.Add(onePriceGroup.GroupId, onePriceGroup);
                }

                ICollection<ContosoDiscountData> allOffersWithLineFilter = ContosoPricingRepository.GetAllDiscountOffersWithLineFilter();
                foreach (PeriodicDiscountData oneOffer in allOffersWithLineFilter)
                {
                    oneOffer.FixDiscountLineNumbers();
                    this.OfferLineFilterLookup.Add(oneOffer.OfferId, oneOffer);
                }

                ICollection<ContosoDiscountData> allAmountCap = ContosoPricingRepository.GetAllAmountCapDiscounts();
                foreach (PeriodicDiscountData oneAmountCap in allAmountCap)
                {
                    oneAmountCap.FixDiscountLineNumbers();
                    this.AmountCapLookup.Add(oneAmountCap.OfferId, oneAmountCap);
                }

                this.AllExtensionDiscountsLookup.AddRange(this.AmountCapLookup);

                this.AllExtensionDiscountsLookup.AddRange(this.OfferLineFilterLookup);

                this.ResolveRetailDiscountData(this.AllExtensionDiscountsLookup);
            }

            private void ResolveRetailDiscountData(Dictionary<string, PeriodicDiscountData> lookup)
            {
                TestFoundationGlobalDataCache.ResolveRetailDiscountValidationPeriodAndDimensions(
                    lookup,
                    TestFoundationGlobalDataCache.Instance.ValidationPeriodOffPeakFut);

                TestFoundationGlobalDataCache.ResolveRetailDiscountValidationPeriodAndDimensions(
                    lookup,
                    TestFoundationGlobalDataCache.Instance.ValidationPeriodNegDateRange);

                // Fix line validation period.
                foreach (KeyValuePair<string, PeriodicDiscountData> pair in lookup)
                {
                    PeriodicDiscountData data = pair.Value;
                    foreach (PeriodicDiscountLineData lineData in data.DiscountLines)
                    {
                        ContosoDiscountLineData extensionLineData = lineData as ContosoDiscountLineData;
                        if (extensionLineData != null && !string.IsNullOrWhiteSpace(extensionLineData.ContosoPeriodId))
                        {
                            if (string.Equals(TestFoundationGlobalDataCache.Instance.ValidationPeriodOffPeakFut.PeriodId, extensionLineData.ContosoPeriodId, StringComparison.OrdinalIgnoreCase))
                            {
                                extensionLineData.ContosoPeriod = TestFoundationGlobalDataCache.Instance.ValidationPeriodOffPeakFut;
                            }
                            else if (string.Equals(TestFoundationGlobalDataCache.Instance.ValidationPeriodNegDateRange.PeriodId, extensionLineData.ContosoPeriodId, StringComparison.OrdinalIgnoreCase))
                            {
                                extensionLineData.ContosoPeriod = TestFoundationGlobalDataCache.Instance.ValidationPeriodNegDateRange;
                            }
                        }
                    }
                }
            }
        }
    }
}