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
        using Commerce.Runtime.Extensions.PricingEngineSample;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;

        /// <summary>
        /// Test data accessor for discount offer with line filter.
        /// </summary>
        public class ContosoDataAccessorOfferLineFilter : IDataAccessorOfferLineFilter
        {
            /// <summary>
            /// Gets offer line filters by offer Ids.
            /// </summary>
            /// <param name="offerIds">Offer Ids.</param>
            /// <returns>The collection of offer line filters of type ReadOnlyCollection&lt;OfferLineFilter&gt;.</returns>
            public object GetOfferLineFiltersByOfferIds(object offerIds)
            {
                IEnumerable<string> offerIdSet = offerIds as IEnumerable<string>;
                List<OfferLineFilter> lineFilters = new List<OfferLineFilter>();

                if (offerIdSet != null)
                {
                    foreach (string offerId in offerIdSet)
                    {
                        PeriodicDiscountData discountData = null;

                        if (ContosoTestDataCache.Instance.OfferLineFilterLookup.TryGetValue(offerId, out discountData))
                        {
                            ContosoDiscountData extensionDiscountData = discountData as ContosoDiscountData;
                            if (extensionDiscountData != null)
                            {
                                foreach (PeriodicDiscountLineData lineData in extensionDiscountData.DiscountLines)
                                {
                                    ContosoDiscountLineData contosoLineData = lineData as ContosoDiscountLineData;
                                    if (contosoLineData != null)
                                    {
                                        OfferLineFilter lineFilter = new OfferLineFilter();
                                        lineFilter.OfferId = extensionDiscountData.OfferId;
                                        lineFilter.DiscountLineNumber = lineData.DiscountLineNumber;
                                        lineFilter.ValidationPeriodId = contosoLineData.ContosoPeriodId;
                                        lineFilter.RecordId = new Random(1111111).Next() + 99;
                                        lineFilters.Add(lineFilter);
                                    }
                                }
                            }
                        }
                    }
                }

                return lineFilters.AsReadOnly();
            }

            /// <summary>
            /// Gets the validation period.
            /// </summary>
            /// <param name="periodId">Period Id.</param>
            /// <returns>Validation period.</returns>
            /// <remarks>Not optimized for sample.</remarks>
            public ValidationPeriod GetValidationPeriod(string periodId)
            {
                ValidationPeriod period = null;

                if (string.Equals(periodId, TestFoundationGlobalDataCache.Instance.ValidationPeriodOffPeakFut.PeriodId, StringComparison.OrdinalIgnoreCase))
                {
                    period = TestFoundationGlobalDataCache.Instance.ValidationPeriodOffPeakFut;
                }
                else if (string.Equals(periodId, TestFoundationGlobalDataCache.Instance.ValidationPeriodNegDateRange.PeriodId, StringComparison.OrdinalIgnoreCase))
                {
                    period = TestFoundationGlobalDataCache.Instance.ValidationPeriodNegDateRange;
                }

                return period;
            }
        }
    }
}