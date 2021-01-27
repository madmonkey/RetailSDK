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
        using System.Linq;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;
        using Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine;
        using Microsoft.VisualStudio.TestTools.UnitTesting;

        /// <summary>
        /// Component tests for <see href="https://blogs.msdn.microsoft.com/retaillife/2017/01/07/retail-discount-concurrency-control-pricing-zone/">concurrency control model: best price and compound within priority and no compound across (a.k.a. pricing zone)</see>,
        /// with <see href="https://blogs.msdn.microsoft.com/retaillife/2017/02/25/dynamics-retail-discount-concepts-discount-base-amount/">discount base amount adjustments</see>.
        /// </summary>
        [TestClass]
        [DeploymentItem(@"TestDataManager\SampleData", @"TestDataManager\SampleData")]
        public class PricingZoneModelDiscountBaseAmountTests : PricingBaseTests
        {
            /// <summary>Discount base amount - 2 compounded offers.</summary>
            [TestMethod]
            public void PricingZoneModelDiscountBaseAmount_Test_Compounded2Offers()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap =
                    new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(
                    priorityDiscountBaseAmountCalculatorWithAmountCap);

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-2-discounts");
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestOffer33CP);
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestOffer38CP);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 2m;

                decimal discountBaseAmount = 63.99m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                string offerIdOffer33 = TestFoundationCommonData.OfferIdTestOffer33CP;
                decimal percentage33 = localHelper.GetDiscountOfferValueByCategory(offerIdOffer33, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);
                string offerIdOffer38 = TestFoundationCommonData.OfferIdTestOffer38CP;
                decimal percentage38 = localHelper.GetDiscountOfferValueByCategory(offerIdOffer38, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistencyPricingZone(
                    transaction,
                    priceContext,
                    priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToDiscountBaseAmountLookup);
                Assert.AreEqual(2, salesLine.DiscountLines.Count, "Should have two discounts");
                for (int i = 0; i < salesLine.DiscountLines.Count; i++)
                {
                    DiscountLine discountLine = salesLine.DiscountLines[i];
                    decimal percentage;
                    if (string.Equals(offerIdOffer33, discountLine.OfferId, StringComparison.OrdinalIgnoreCase))
                    {
                        percentage = percentage33;
                    }
                    else
                    {
                        Assert.AreEqual(offerIdOffer38, discountLine.OfferId, "Verify offer Id");
                        percentage = percentage38;
                    }

                    Assert.AreEqual(percentage, discountLine.Percentage, "Verify %-off for " + discountLine.OfferId);
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentage), discountLine.EffectiveAmount, "Verify effective amount");

                    discountBaseAmount = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentage);
                }
            }

            /// <summary>Discount base amount - best price quantity against compounded mix and match and offer.</summary>
            [TestMethod]
            public void PricingZoneModelDiscountBaseAmount_Test_BestPriceQuantityCompoundedMixMatchOffer()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap =
                    new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(
                    priorityDiscountBaseAmountCalculatorWithAmountCap);

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("discount-base-amount-cp-mm-&-offer-win-bp-qty-lose");

                string[] priceGroups = new string[]
                {
                    TestFoundationCommonData.PriceGroupTestMixAndMatch17CP,
                    TestFoundationCommonData.PriceGroupTestQuantity07BP,
                    TestFoundationCommonData.PriceGroupTestOffer05CP
                };

                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine1.Quantity = 2;
                salesLine1.Price = 79.99M;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0026);
                salesLine2.Quantity = 1;
                salesLine2.Price = 19.99M;

                string offerIdMixMatch = TestFoundationCommonData.OfferIdTestMixAndMatch17CP;
                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer05CP;
                decimal mixMatchDiscountAmount = localHelper.GetMixMatchDiscountValue(offerIdMixMatch);
                decimal offerPercent = localHelper.GetDiscountOfferValueByItem(offerIdOffer, salesLine1.ItemId, string.Empty);

                // Without the discount base amount adjustment, best price quantity discount would have won.
                decimal discountBaseAmount = 69.99m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine1.LineId, discountBaseAmount);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                Dictionary<string, decimal> salesLineIdToDiscountBaseAmountLookup = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase);
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0025, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        salesLineIdToDiscountBaseAmountLookup[resultLine.LineId] = discountBaseAmount;
                    }
                }

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistencyPricingZone(
                    transaction,
                    priceContext,
                    salesLineIdToDiscountBaseAmountLookup);

                decimal actualMixMatchDiscountAmount =
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdMixMatch, ExtensiblePeriodicDiscountOfferType.MixAndMatch);
                decimal actualQuantityDiscountAmount =
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, string.Empty, ExtensiblePeriodicDiscountOfferType.MultipleBuy);
                decimal actualOfferDiscountAmount =
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, string.Empty, ExtensiblePeriodicDiscountOfferType.Offer);
                decimal totalDiscount = TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, null, null);

                Assert.AreEqual(0, actualQuantityDiscountAmount, "No quantity discount");
                Assert.AreEqual(mixMatchDiscountAmount, actualMixMatchDiscountAmount, "Verify mix and match");
                Assert.AreEqual(actualOfferDiscountAmount + actualMixMatchDiscountAmount, totalDiscount, "Verify total periodic discount");

                foreach (SalesLine line in transaction.PriceCalculableSalesLines)
                {
                    Assert.IsTrue(line.DiscountLines.Where(p => string.Equals(offerIdMixMatch, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any(), "Verify mix and match");
                    if (string.Equals(TestFoundationCommonData.ItemId0025, line.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.IsTrue(line.DiscountLines.Where(p => string.Equals(offerIdOffer, p.OfferId, StringComparison.OrdinalIgnoreCase) && p.Percentage == offerPercent).Any(), "Verify discount offer %");
                    }
                }
            }

            /// <summary>Discount base amount - compounded offer and threshold.</summary>
            [TestMethod]
            public void PricingZoneModelDiscountBaseAmount_Test_CompoundedOfferThreshold()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap =
                    new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(
                    priorityDiscountBaseAmountCalculatorWithAmountCap);

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-offer-thresholds");
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestOffer33CP);
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestThreshold34CP);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 2m;

                decimal discountBaseAmount = 63.99m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer33CP;
                decimal percentageOffer = localHelper.GetDiscountOfferValueByCategory(offerIdOffer, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);
                string offerIdThreshold = TestFoundationCommonData.OfferIdTestThreshold34CP;
                decimal percentageThreshold = localHelper.GetThresholdDiscountValue(offerIdThreshold, 100m);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistencyPricingZone(
                    transaction,
                    priceContext,
                    priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToDiscountBaseAmountLookup);

                Assert.AreEqual(2, salesLine.DiscountLines.Count, "Should have two discounts");
                Assert.AreEqual(offerIdOffer, salesLine.DiscountLines[0].OfferId, "Verify offer Id");
                Assert.AreEqual(percentageOffer, salesLine.DiscountLines[0].Percentage, "Verify offer %-off");
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentageOffer), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount");

                discountBaseAmount = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentageOffer);

                Assert.AreEqual(offerIdThreshold, salesLine.DiscountLines[1].OfferId, "Verify offer Id");
                Assert.AreEqual(percentageThreshold, salesLine.DiscountLines[1].Percentage, "Verify threshold %-off");
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentageThreshold), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount");
            }

            /// <summary>Discount base amount - compounded offer, threshold, and manual total.</summary>
            [TestMethod]
            public void PricingZoneModelDiscountBaseAmount_Test_CompoundedOfferThresholdManualTotal()
            {
                // Arrange.
                foreach (decimal multiplier in TestFoundationPricingHelper.GetSalesAndReturnQuantityMultipliers())
                {
                    PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap
                        = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                    PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(
                        priorityDiscountBaseAmountCalculatorWithAmountCap);

                    TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                    SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-offer-threshold-manual-total");
                    transaction.TotalManualDiscountPercentage = 10m;
                    localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestOffer33CP);
                    localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestThreshold34CP);

                    SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                    salesLine.Price = 69.99M;
                    salesLine.Quantity = 2m * multiplier;

                    decimal discountBaseAmount = 63.99m;
                    priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                    string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer33CP;
                    decimal percentageOffer = localHelper.GetDiscountOfferValueByCategory(offerIdOffer, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);
                    string offerIdThreshold = TestFoundationCommonData.OfferIdTestThreshold34CP;
                    decimal percentageThreshold = localHelper.GetThresholdDiscountValue(offerIdThreshold, 100m);

                    // Act.
                    PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                    PricingEngine.CalculateDiscountsForLines(
                        localHelper,
                        transaction,
                        priceContext);
                    PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                    // Assert.
                    SalesTransactionVerification.VerifySalesTransactionDataConsistencyPricingZone(
                        transaction,
                        priceContext,
                        priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToDiscountBaseAmountLookup);

                    Assert.AreEqual(3, salesLine.DiscountLines.Count, "Should have 3 discounts");
                    Assert.AreEqual(offerIdOffer, salesLine.DiscountLines[0].OfferId, "Verify offer Id");
                    Assert.AreEqual(percentageOffer, salesLine.DiscountLines[0].Percentage, "Verify offer %-off");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, percentageOffer), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount");

                    discountBaseAmount = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentageOffer);

                    Assert.AreEqual(offerIdThreshold, salesLine.DiscountLines[1].OfferId, "Verify offer Id");
                    Assert.AreEqual(percentageThreshold, salesLine.DiscountLines[1].Percentage, "Verify threshold %-off");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, percentageThreshold), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount");

                    discountBaseAmount = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentageThreshold);

                    Assert.AreEqual(DiscountLineType.ManualDiscount, salesLine.DiscountLines[2].DiscountLineType, "Verify manual");
                    Assert.AreEqual(ManualDiscountType.TotalDiscountPercent, salesLine.DiscountLines[2].ManualDiscountType, "Verify manual total");
                    Assert.AreEqual(transaction.TotalManualDiscountPercentage, salesLine.DiscountLines[2].Percentage, "Verify total manual %-off");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, transaction.TotalManualDiscountPercentage), salesLine.DiscountLines[2].EffectiveAmount, "Verify effective amount");
                }
            }

            /// <summary>Discount base amount - compounded offer, threshold, and manual line.</summary>
            [TestMethod]
            public void PricingZoneModelDiscountBaseAmount_Test_CompoundedOfferThresholdManualLine()
            {
                // Arrange.
                foreach (decimal multiplier in TestFoundationPricingHelper.GetSalesAndReturnQuantityMultipliers())
                {
                    PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap
                        = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                    PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(
                        priorityDiscountBaseAmountCalculatorWithAmountCap);

                    TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                    SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-offer-threshold-manual-line");
                    localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestOffer33CP);
                    localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestThreshold34CP);

                    SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                    salesLine.Price = 69.99M;
                    salesLine.Quantity = 2m * multiplier;
                    salesLine.LineManualDiscountPercentage = 10m;

                    decimal discountBaseAmount = 63.99m;
                    priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                    string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer33CP;
                    decimal percentageOffer = localHelper.GetDiscountOfferValueByCategory(offerIdOffer, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);
                    string offerIdThreshold = TestFoundationCommonData.OfferIdTestThreshold34CP;
                    decimal percentageThreshold = localHelper.GetThresholdDiscountValue(offerIdThreshold, 100m);

                    // Act.
                    PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                    PricingEngine.CalculateDiscountsForLines(
                        localHelper,
                        transaction,
                        priceContext);
                    PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                    // Assert.
                    SalesTransactionVerification.VerifySalesTransactionDataConsistencyPricingZone(
                        transaction,
                        priceContext,
                        priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToDiscountBaseAmountLookup);

                    Assert.AreEqual(3, salesLine.DiscountLines.Count, "Should have 3 discounts");
                    Assert.AreEqual(offerIdOffer, salesLine.DiscountLines[0].OfferId, "Verify offer Id");
                    Assert.AreEqual(percentageOffer, salesLine.DiscountLines[0].Percentage, "Verify offer %-off");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, percentageOffer), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount");

                    discountBaseAmount = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentageOffer);

                    Assert.AreEqual(offerIdThreshold, salesLine.DiscountLines[1].OfferId, "Verify offer Id");
                    Assert.AreEqual(percentageThreshold, salesLine.DiscountLines[1].Percentage, "Verify threshold %-off");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, percentageThreshold), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount");

                    discountBaseAmount = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentageThreshold);

                    Assert.AreEqual(DiscountLineType.ManualDiscount, salesLine.DiscountLines[2].DiscountLineType, "Verify manual");
                    Assert.AreEqual(ManualDiscountType.LineDiscountPercent, salesLine.DiscountLines[2].ManualDiscountType, "Verify manual total");
                    Assert.AreEqual(salesLine.LineManualDiscountPercentage, salesLine.DiscountLines[2].Percentage, "Verify total manual %-off");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, salesLine.LineManualDiscountPercentage), salesLine.DiscountLines[2].EffectiveAmount, "Verify effective amount");
                }
            }
        }
    }
}
