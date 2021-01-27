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
        using System.Threading.Tasks;
        using Commerce.Runtime.Extensions.PricingDataServicesSample;
        using Commerce.Runtime.Extensions.PricingEngineSample;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;

        /// <summary>
        /// Test data accessor for amount cap.
        /// </summary>
        public class ContosoDataAccessorAmountCap : IDataAccessorAmountCap
        {
            /// <summary>
            /// Gets discount amount caps by offer Ids.
            /// </summary>
            /// <param name="offerIds">Offer Ids.</param>
            /// <returns>The collection of discount amount caps of type ReadOnlyCollection&lt;DiscountAmountCap&gt;.</returns>
            public async Task<object> GetDiscountAmountCapsByOfferIdsAsync(object offerIds)
            {
                IEnumerable<string> offerIdSet = offerIds as IEnumerable<string>;
                List<DiscountAmountCap> amountCaps = new List<DiscountAmountCap>();

                if (offerIdSet != null)
                {
                    foreach (string offerId in offerIdSet)
                    {
                        PeriodicDiscountData discountData = null;

                        if (ContosoTestDataCache.Instance.AmountCapLookup.TryGetValue(offerId, out discountData))
                        {
                            if (discountData is ContosoDiscountData extensionDiscountData && extensionDiscountData.ContosoDiscountAmountCap > 0)
                            {
                                DiscountAmountCap amountCap = new DiscountAmountCap();
                                amountCap.OfferId = offerId;
                                amountCap.AmountCap = extensionDiscountData.ContosoDiscountAmountCap;
                                amountCap.ApplyBaseReduction = extensionDiscountData.ContosoApplyBaseReduction;
                                amountCap.RecordId = new Random(1111111).Next() + 88;
                                amountCaps.Add(amountCap);
                            }
                        }
                    }
                }

                return await Task.FromResult<object>(amountCaps.AsReadOnly());
            }
        }
    }
}