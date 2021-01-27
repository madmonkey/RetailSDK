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
        using Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine.DiscountData;
        using Microsoft.VisualStudio.TestTools.UnitTesting;

        /// <summary>
        /// Component tests for <see href="https://blogs.msdn.microsoft.com/retaillife/2017/01/08/retail-discount-concurrency-control-compete-within-priority-and-compound-across/">concurrency control model: compete with priority and compound across</see>,
        /// with <see href="https://blogs.msdn.microsoft.com/retaillife/2017/02/25/dynamics-retail-discount-concepts-discount-base-amount/">discount base amount adjustments</see>.
        /// </summary>
        [TestClass]
        [DeploymentItem(@"TestDataManager\SampleData", @"TestDataManager\SampleData")]
        public class CompeteModelDiscountBaseAmountTests : PricingBaseTests
        {
            #region discount base amount tests, with both item level adjustment and per-priority adjustment.

            /// <summary>P99: Best price with reduced discount base amount.</summary>
            [TestMethod]
            public void CompeteModelDiscountBaseAmount_Test_BestPrice88()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-1-discount");
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestOffer31BP88);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 2m;

                decimal discountBaseAmount = 63.99m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer31BP88;
                decimal percentage = localHelper.GetDiscountOfferValueByItem(offerIdOffer, salesLine.ItemId, string.Empty);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                    transaction,
                    priceContext,
                    priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToPriorityDiscountBaseAmountsLookup);
                Assert.AreEqual(1, salesLine.DiscountLines.Count, "Should have one discount");
                Assert.AreEqual(offerIdOffer, salesLine.DiscountLines[0].OfferId, "Verify offer");
                Assert.AreEqual(percentage, salesLine.DiscountLines[0].Percentage, "Verify %-off");
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentage), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount");
            }

            /// <summary>P99: Best price with reduced discount base amount.</summary>
            [TestMethod]
            public void CompeteModelDiscountBaseAmount_Test_AdjustBestPrice88Compound0()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-2-discount2");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 2m;
                decimal discountBaseAmount = 63.99m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                string offerIdOfferP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                decimal percentageP88 = localHelper.GetDiscountOfferValueByItem(offerIdOfferP88, salesLine.ItemId, string.Empty);
                string offerIdOfferP0 = TestFoundationCommonData.OfferIdTestOffer38CP;
                decimal percentageP0 = localHelper.GetDiscountOfferValueByCategory(offerIdOfferP0, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                    transaction,
                    priceContext,
                    priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToPriorityDiscountBaseAmountsLookup);
                Assert.AreEqual(2, salesLine.DiscountLines.Count, "Should have 2 discounts");

                Assert.AreEqual(offerIdOfferP88, salesLine.DiscountLines[0].OfferId, "Verify offer P88");
                Assert.AreEqual(percentageP88, salesLine.DiscountLines[0].Percentage, "Verify %-off P88");
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentageP88), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount P88");
                Assert.AreEqual(offerIdOfferP0, salesLine.DiscountLines[1].OfferId, "Verify offer P0");
                Assert.AreEqual(percentageP0, salesLine.DiscountLines[1].Percentage, "Verify %-off P0");
                decimal discountedPrice = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentageP88);
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountedPrice * 2m, percentageP0), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");
            }

            /// <summary>P99: Best price with reduced discount base amount.</summary>
            [TestMethod]
            public void CompeteModelDiscountBaseAmount_Test_AdjustBestPrice88AdjustCompound0()
            {
                // Arrange.
                foreach (decimal multiplier in TestFoundationPricingHelper.GetSalesAndReturnQuantityMultipliers())
                {
                    PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                    PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                    TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                    localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                    SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-2-discount2");
                    List<string> priceGroups = new List<string>()
                    {
                        TestFoundationCommonData.PriceGroupTestOffer31BP88,
                        TestFoundationCommonData.PriceGroupTestOffer38CP,
                    };
                    localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                    SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                    salesLine.Price = 69.99M;
                    salesLine.Quantity = 2m * multiplier;

                    decimal discountBaseAmount = 63.99m;
                    priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                    decimal discountBaseAmountAfterP88 = 10m;
                    priorityDiscountBaseAmountCalculatorWithAmountCap.AddSaleLineIdPriorityDiscountBaseAmount(salesLine.LineId, 88, discountBaseAmountAfterP88);

                    string offerIdOfferP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                    decimal percentageP88 = localHelper.GetDiscountOfferValueByItem(offerIdOfferP88, salesLine.ItemId, string.Empty);
                    string offerIdOfferP0 = TestFoundationCommonData.OfferIdTestOffer38CP;
                    decimal percentageP0 = localHelper.GetDiscountOfferValueByCategory(offerIdOfferP0, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);

                    // Act.
                    PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                    PricingEngine.CalculateDiscountsForLines(
                        localHelper,
                        transaction,
                        priceContext);
                    PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                    // Assert.
                    SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                        transaction,
                        priceContext,
                        priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToPriorityDiscountBaseAmountsLookup);
                    Assert.AreEqual(2, salesLine.DiscountLines.Count, "Should have 2 discounts");

                    Assert.AreEqual(offerIdOfferP88, salesLine.DiscountLines[0].OfferId, "Verify offer P88");
                    Assert.AreEqual(percentageP88, salesLine.DiscountLines[0].Percentage, "Verify %-off P88");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, percentageP88), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount P88");
                    Assert.AreEqual(offerIdOfferP0, salesLine.DiscountLines[1].OfferId, "Verify offer P0");
                    Assert.AreEqual(percentageP0, salesLine.DiscountLines[1].Percentage, "Verify %-off P0");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountAfterP88 * salesLine.Quantity, percentageP0), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");
                }
            }

            /// <summary>P99: Best price with reduced discount base amount.</summary>
            [TestMethod]
            public void CompeteModelDiscountBaseAmount_Test_AdjustBestPrice88AdjustCompound0Thresholds()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-2-discount2");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                    TestFoundationCommonData.PriceGroupTestThreshold25CP99,
                    TestFoundationCommonData.PriceGroupTestThreshold43BP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 20m;

                decimal discountBaseAmount = 63.99m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                decimal discountBaseAmountAfterP88 = 10m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSaleLineIdPriorityDiscountBaseAmount(salesLine.LineId, 88, discountBaseAmountAfterP88);

                string offerIdOfferP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                decimal percentageP88 = localHelper.GetDiscountOfferValueByItem(offerIdOfferP88, salesLine.ItemId, string.Empty);
                string offerIdOfferDO38CP = TestFoundationCommonData.OfferIdTestOffer38CP;
                decimal percentageDO38CP = localHelper.GetDiscountOfferValueByCategory(offerIdOfferDO38CP, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);
                string offerIdThresholdP88 = TestFoundationCommonData.OfferIdTestThreshold25CP99;
                decimal percentageThresholdP88 = localHelper.GetThresholdDiscountValue(offerIdThresholdP88, 100m);
                string offerIdThresholdP0 = TestFoundationCommonData.OfferIdTestThreshold43BP;
                decimal amountThresholdP0 = localHelper.GetThresholdDiscountValue(offerIdThresholdP0, 100m);

                Dictionary<string, List<PriorityDiscountBaseAmount>> salesLineIdToPriorityDiscountBaseAmountsLookup = priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToPriorityDiscountBaseAmountsLookup;
                List<PriorityDiscountBaseAmount> priorityDiscountBaseAmountList = salesLineIdToPriorityDiscountBaseAmountsLookup[salesLine.LineId];

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (salesLine != resultLine)
                    {
                        salesLineIdToPriorityDiscountBaseAmountsLookup.Add(resultLine.LineId, priorityDiscountBaseAmountList);
                    }
                }

                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                    transaction,
                    priceContext,
                    salesLineIdToPriorityDiscountBaseAmountsLookup);
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(3, resultLine.DiscountLines.Count, "Should have 3 discounts");
                    Assert.AreEqual(offerIdOfferDO38CP, resultLine.DiscountLines[1].OfferId, "Verify offer P0");
                    Assert.AreEqual(percentageDO38CP, resultLine.DiscountLines[1].Percentage, "Verify %-off P0");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountAfterP88 * resultLine.Quantity, percentageDO38CP), resultLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");

                    Assert.AreEqual(offerIdOfferP88, resultLine.DiscountLines[0].OfferId, "Verify offer P88");
                    Assert.AreEqual(percentageP88, resultLine.DiscountLines[0].Percentage, "Verify %-off P88");

                    IEnumerable<DiscountLine> discountLinesThresholdP99 = resultLine.DiscountLines.Where(p => string.Equals(offerIdThresholdP88, p.OfferId, StringComparison.OrdinalIgnoreCase));
                    Assert.AreEqual(1, discountLinesThresholdP99.Count(), "1 for threshold p99");
                    Assert.AreEqual(percentageThresholdP88, discountLinesThresholdP99.ElementAt(0).Percentage, "Verify threshold p99 %-off");
                    IEnumerable<DiscountLine> discountLinesThresholdP0 = resultLine.DiscountLines.Where(p => string.Equals(offerIdThresholdP0, p.OfferId, StringComparison.OrdinalIgnoreCase));
                    Assert.AreEqual(0, discountLinesThresholdP0.Count(), "1 for threshold p99");
                }

                Assert.AreEqual(0, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdThresholdP0, ExtensiblePeriodicDiscountOfferType.Threshold), "Verify threshold $-off p0");
            }

            /// <summary>P99: Best price and P0: Compounded 2 discounts.</summary>
            [TestMethod]
            public void CompeteModelDiscountBaseAmount_Test_BestPrice88AdjustCompounded0LeastExpensiveAndOffer()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("ext-discount-flow-compounded");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch23CP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 2m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine2.Price = 66.99M;
                salesLine2.Quantity = 1m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine3.Price = 22.99M;
                salesLine3.Quantity = 2m;

                decimal discountBaseamount0055 = 30.99m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseamount0055);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                    transaction,
                    priceContext,
                    priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToPriorityDiscountBaseAmountsLookup);
                string offerIdDO31BP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdDO41CP = TestFoundationCommonData.OfferIdTestOffer38CP;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch23CP;
                decimal dealPriceMixAndMatch = localHelper.GetMixMatchDiscountValue(offerIdMixAndMatch);

                decimal quantityDiscountedFor0055 = decimal.Zero;
                decimal quantityDiscountedFor0061 = decimal.Zero;
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0055, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (resultLine.DiscountLines.Any())
                        {
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have found a discount for " + resultLine.ItemId);
                            Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                            quantityDiscountedFor0055 += resultLine.Quantity;
                            Assert.AreEqual(discountBaseamount0055 - dealPriceMixAndMatch, resultLine.DiscountLines[0].EffectiveAmount, "verify deal price for " + resultLine.ItemId);
                        }
                    }
                    else if (string.Equals(TestFoundationCommonData.ItemId0061, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (resultLine.DiscountLines.Any())
                        {
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have found a discount for " + resultLine.ItemId);
                            Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                            quantityDiscountedFor0061 += resultLine.Quantity;
                        }
                    }
                    else
                    {
                        Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have found 2 discounts for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdDO31BP88, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                        Assert.AreEqual(offerIdDO41CP, resultLine.DiscountLines[1].OfferId, "Verify offer id");
                    }
                }

                Assert.AreEqual(1m, quantityDiscountedFor0055, "Verify m&m for 0055");
                Assert.AreEqual(1m, quantityDiscountedFor0061, "Verify m&m for 0061");
            }

            #endregion

            #region discount base amount tests, mixing in manual discounts.

            /// <summary>P99: Best price with reduced discount base amount.</summary>
            [TestMethod]
            public void CompeteModelDiscountBaseAmount_Test_AdjustBestPrice88Compound0TotalManual()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-2-discount2-total-manual");
                transaction.TotalManualDiscountPercentage = 10m;
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 2m;

                decimal discountBaseAmount = 63.99m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                string offerIdOfferP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                decimal percentageP88 = localHelper.GetDiscountOfferValueByItem(offerIdOfferP88, salesLine.ItemId, string.Empty);
                string offerIdOfferP0 = TestFoundationCommonData.OfferIdTestOffer38CP;
                decimal percentageP0 = localHelper.GetDiscountOfferValueByCategory(offerIdOfferP0, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                    transaction,
                    priceContext,
                    priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToPriorityDiscountBaseAmountsLookup);
                Assert.AreEqual(3, salesLine.DiscountLines.Count, "Should have 3 discounts");

                Assert.AreEqual(offerIdOfferP88, salesLine.DiscountLines[0].OfferId, "Verify offer P88");
                Assert.AreEqual(percentageP88, salesLine.DiscountLines[0].Percentage, "Verify %-off P88");
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentageP88), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount P88");

                Assert.AreEqual(offerIdOfferP0, salesLine.DiscountLines[1].OfferId, "Verify offer P0");
                Assert.AreEqual(percentageP0, salesLine.DiscountLines[1].Percentage, "Verify %-off P0");
                discountBaseAmount = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentageP88);
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentageP0), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");

                // Total ignores per-priority adjustment.
                discountBaseAmount = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentageP0);
                Assert.AreEqual(DiscountLineType.ManualDiscount, salesLine.DiscountLines[2].DiscountLineType, "Verify manual");
                Assert.AreEqual(ManualDiscountType.TotalDiscountPercent, salesLine.DiscountLines[2].ManualDiscountType, "Verify manual total");
                Assert.AreEqual(transaction.TotalManualDiscountPercentage, salesLine.DiscountLines[2].Percentage, "Verify total manual %-off");
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, transaction.TotalManualDiscountPercentage), salesLine.DiscountLines[2].EffectiveAmount, "Verify effective amount");
            }

            /// <summary>P99: Best price with reduced discount base amount with total manual.</summary>
            [TestMethod]
            public void CompeteModelDiscountBaseAmount_Test_AdjustBestPrice88AdjustCompound0TotalManual()
            {
                // Arrange.
                foreach (decimal multiplier in TestFoundationPricingHelper.GetSalesAndReturnQuantityMultipliers())
                {
                    PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                    PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                    TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                    localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                    SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-2-discount-2-adjust-total-manual");
                    transaction.TotalManualDiscountPercentage = 10m;
                    List<string> priceGroups = new List<string>()
                    {
                        TestFoundationCommonData.PriceGroupTestOffer31BP88,
                        TestFoundationCommonData.PriceGroupTestOffer38CP,
                    };
                    localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                    SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                    salesLine.Price = 69.99M;
                    salesLine.Quantity = 2m * multiplier;

                    decimal discountBaseAmount = 63.99m;
                    priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                    decimal discountBaseAmountAfterP88 = 10m;
                    priorityDiscountBaseAmountCalculatorWithAmountCap.AddSaleLineIdPriorityDiscountBaseAmount(salesLine.LineId, 88, discountBaseAmountAfterP88);

                    string offerIdOfferP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                    decimal percentageP88 = localHelper.GetDiscountOfferValueByItem(offerIdOfferP88, salesLine.ItemId, string.Empty);
                    string offerIdOfferP0 = TestFoundationCommonData.OfferIdTestOffer38CP;
                    decimal percentageP0 = localHelper.GetDiscountOfferValueByCategory(offerIdOfferP0, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);

                    // Act.
                    PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                    PricingEngine.CalculateDiscountsForLines(
                        localHelper,
                        transaction,
                        priceContext);
                    PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                    // Assert.
                    SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                        transaction,
                        priceContext,
                        priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToPriorityDiscountBaseAmountsLookup);
                    Assert.AreEqual(3, salesLine.DiscountLines.Count, "Should have 3 discounts");

                    Assert.AreEqual(offerIdOfferP88, salesLine.DiscountLines[0].OfferId, "Verify offer P88");
                    Assert.AreEqual(percentageP88, salesLine.DiscountLines[0].Percentage, "Verify %-off P88");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, percentageP88), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount P88");

                    Assert.AreEqual(offerIdOfferP0, salesLine.DiscountLines[1].OfferId, "Verify offer P0");
                    Assert.AreEqual(percentageP0, salesLine.DiscountLines[1].Percentage, "Verify %-off P0");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountAfterP88 * salesLine.Quantity, percentageP0), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");

                    // Total ignores per-priority adjustment of discount base amount.
                    decimal discountBaseAmountForTotal = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentageP88);
                    discountBaseAmountForTotal -= salesLine.DiscountLines[1].EffectiveAmount / salesLine.Quantity;
                    Assert.AreEqual(DiscountLineType.ManualDiscount, salesLine.DiscountLines[2].DiscountLineType, "Verify manual");
                    Assert.AreEqual(ManualDiscountType.TotalDiscountPercent, salesLine.DiscountLines[2].ManualDiscountType, "Verify manual total");
                    Assert.AreEqual(transaction.TotalManualDiscountPercentage, salesLine.DiscountLines[2].Percentage, "Verify total manual %-off");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountForTotal * salesLine.Quantity, transaction.TotalManualDiscountPercentage), salesLine.DiscountLines[2].EffectiveAmount, "Verify effective amount");
                }
            }

            /// <summary>P99: Best price with reduced discount base amount with total manual.</summary>
            [TestMethod]
            public void CompeteModelDiscountBaseAmount_Test_AdjustBestPrice88AdjustCompound0LineManual()
            {
                // Arrange.
                foreach (decimal multiplier in TestFoundationPricingHelper.GetSalesAndReturnQuantityMultipliers())
                {
                    PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                    PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                    TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                    localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                    SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-2-discount-2-adjust-line-manual");
                    List<string> priceGroups = new List<string>()
                    {
                        TestFoundationCommonData.PriceGroupTestOffer31BP88,
                        TestFoundationCommonData.PriceGroupTestOffer38CP,
                    };
                    localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                    SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                    salesLine.Price = 69.99M;
                    salesLine.Quantity = 2m * multiplier;
                    salesLine.LineManualDiscountPercentage = 10m;

                    decimal discountBaseAmount = 63.99m;
                    priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                    decimal discountBaseAmountAfterP88 = 10m;
                    priorityDiscountBaseAmountCalculatorWithAmountCap.AddSaleLineIdPriorityDiscountBaseAmount(salesLine.LineId, 88, discountBaseAmountAfterP88);

                    string offerIdOfferP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                    decimal percentageP88 = localHelper.GetDiscountOfferValueByItem(offerIdOfferP88, salesLine.ItemId, string.Empty);
                    string offerIdOfferP0 = TestFoundationCommonData.OfferIdTestOffer38CP;
                    decimal percentageP0 = localHelper.GetDiscountOfferValueByCategory(offerIdOfferP0, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);

                    // Act.
                    PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                    PricingEngine.CalculateDiscountsForLines(
                        localHelper,
                        transaction,
                        priceContext);
                    PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                    // Assert.
                    SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                        transaction,
                        priceContext,
                        priorityDiscountBaseAmountCalculatorWithAmountCap.SalesLineIdToPriorityDiscountBaseAmountsLookup);
                    Assert.AreEqual(3, salesLine.DiscountLines.Count, "Should have 3 discounts");

                    Assert.AreEqual(offerIdOfferP88, salesLine.DiscountLines[0].OfferId, "Verify offer P88");
                    Assert.AreEqual(percentageP88, salesLine.DiscountLines[0].Percentage, "Verify %-off P88");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, percentageP88), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount P88");

                    Assert.AreEqual(offerIdOfferP0, salesLine.DiscountLines[1].OfferId, "Verify offer P0");
                    Assert.AreEqual(percentageP0, salesLine.DiscountLines[1].Percentage, "Verify %-off P0");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountAfterP88 * salesLine.Quantity, percentageP0), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");

                    // Total ignores per-priority adjustment of discount base amount.
                    decimal discountBaseAmountForTotal = TestFoundationPricingHelper.GetDiscountedPrice(discountBaseAmount, percentageP88);
                    discountBaseAmountForTotal -= salesLine.DiscountLines[1].EffectiveAmount / salesLine.Quantity;
                    Assert.AreEqual(DiscountLineType.ManualDiscount, salesLine.DiscountLines[2].DiscountLineType, "Verify manual");
                    Assert.AreEqual(ManualDiscountType.LineDiscountPercent, salesLine.DiscountLines[2].ManualDiscountType, "Verify manual total");
                    Assert.AreEqual(salesLine.LineManualDiscountPercentage, salesLine.DiscountLines[2].Percentage, "Verify total manual %-off");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountForTotal * salesLine.Quantity, salesLine.LineManualDiscountPercentage), salesLine.DiscountLines[2].EffectiveAmount, "Verify effective amount");
                }
            }

            #endregion
        }
    }
}
