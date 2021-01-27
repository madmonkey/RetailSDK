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
        /// Component tests for <see href="https://blogs.msdn.microsoft.com/retaillife/2017/01/08/retail-discount-concurrency-control-compete-within-priority-and-compound-across/">concurrency control model: compete with priority and compound across</see>.
        /// </summary>
        /// <remarks>
        /// This covers various discount setups
        /// 1. Priority
        /// 2. Discount concurrency mode (exclusive, best price and compound).
        /// 3. Best deal discounts and post best deal discounts (e.g. amount cap and least expensive favor retailer)
        /// 4. Mixed in threshold discounts.
        /// 5. Discount line definitions with products, variants and categories.
        /// </remarks>
        [TestClass]
        [DeploymentItem(@"TestDataManager\SampleData", @"TestDataManager\SampleData")]
        public class CompeteModelTests : PricingBaseTests
        {
            #region Amount cap related: compound across priority and compound with threshold.

            /// <summary>Simple discount and Amount off w/ amount cap - capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModel_Test_P88OfferAndP0AmountCapCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupsToTransaction(
                    transaction,
                    new List<string>()
                    {
                        ContosoTestCommonData.PriceGroupAmountCap03CP,
                        TestFoundationCommonData.PriceGroupTestOffer30CP88
                    });

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = 69.99m;
                salesLine.Quantity = 7m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerId = ContosoTestCommonData.OfferIdAmountCap03CP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");
            }

            /// <summary>Simple discount and Amount off w/ amount cap - capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModel_Test_P88OfferAndP0AmountCapNotCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupsToTransaction(
                    transaction,
                    new List<string>()
                    {
                        ContosoTestCommonData.PriceGroupAmountCap03CP,
                        TestFoundationCommonData.PriceGroupTestOffer30CP88
                    });

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = 69.99m;
                salesLine.Quantity = 6m;

                decimal amountOff = localHelper.GetDiscountOfferValueByItem(ContosoTestCommonData.OfferIdAmountCap02BP, salesLine.ItemId, salesLine.InventoryDimensionId);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                Assert.AreEqual(amountOff * salesLine.Quantity, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, ContosoTestCommonData.OfferIdAmountCap03CP, null), "Verify discount amount");
            }

            /// <summary>Amount cap and threshold.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModel_Test_AmountCapAndThresholdCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupsToTransaction(
                    transaction,
                    new List<string>()
                    {
                        ContosoTestCommonData.PriceGroupAmountCap03CP,
                        TestFoundationCommonData.PriceGroupTestThreshold09CP
                    });

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine1.Price = 69.99m;
                salesLine1.Quantity = 3m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine2.Price = 69.99m;
                salesLine2.Quantity = 4m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0057);
                salesLine3.Price = 55.17m;
                salesLine3.Quantity = 2m;

                decimal thresholdPrice = transaction.PriceCalculableSalesLines.Sum(p => p.Price * p.Quantity);
                var thresholdAmountOff = localHelper.GetThresholdDiscountValue(TestFoundationCommonData.OfferIdTestThreshold09CP, thresholdPrice);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdAmountCap = ContosoTestCommonData.OfferIdAmountCap03CP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerIdAmountCap) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdAmountCap, null), "Discount was not capped for {0}", ContosoTestCommonData.OfferIdAmountCap02BP);
                Assert.AreEqual(discountData.ContosoDiscountAmountCap + thresholdAmountOff, transaction.PeriodicDiscountAmount, "Total periodic discount is not matching");
            }

            /// <summary>BP: Least expensive favor retailer &amp; amount cap %-off capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModel_Test_BestPriceLeastExpensiveAndPercentageOffCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupsToTransaction(
                    transaction,
                    new List<string>()
                    {
                        ContosoTestCommonData.PriceGroupAmountCap02BP,
                        TestFoundationCommonData.PriceGroupTestLeastExpFavorRetailer05BP
                    });

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0053);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 4m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(1, salesLine.DiscountLines.Count, "one discount only");
                Assert.AreEqual(offerId, salesLine.DiscountLines[0].OfferId, "Verify offer id");
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Verify discount amount");
            }

            /// <summary>BP: Least expensive favor retailer &amp; amount cap %-off not capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModel_Test_BestPriceLeastExpensiveAndPercentageOffNotCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupsToTransaction(
                    transaction,
                    new List<string>()
                    {
                        ContosoTestCommonData.PriceGroupAmountCap02BP,
                        TestFoundationCommonData.PriceGroupTestLeastExpFavorRetailer05BP
                    });

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0053);
                salesLine.Price = 60.99M;
                salesLine.Quantity = 4m;

                var pctOff = localHelper.GetDiscountOfferValueByCategory(ContosoTestCommonData.OfferIdAmountCap02BP, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryBaseballBats);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                var expectedDiscountAmount = priceContext.CurrencyAndRoundingHelper.Round((pctOff * salesLine.Price * salesLine.Quantity) / 100);

                Assert.AreEqual(1, salesLine.DiscountLines.Count, "one discount only");
                Assert.AreEqual(ContosoTestCommonData.OfferIdAmountCap02BP, salesLine.DiscountLines[0].OfferId, "Verify offer id");
                Assert.AreEqual(expectedDiscountAmount, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, ContosoTestCommonData.OfferIdAmountCap02BP, null), "Verify discount amount");
            }

            /// <summary>CP: Least expensive favor retailer &amp; amount cap %-off capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModel_Test_CompoundLeastExpensiveAndPercentageOffCapped()
            {
                // Arrange.
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(new PriorityDiscountBaseAmountCalculatorWithAmountCap());
                PricingEngineExtensionRepository.RegisterDiscountableItemGroupKeyConstructor(new DiscountableItemGroupKeyConstructor());

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupsToTransaction(
                    transaction,
                    new List<string>()
                    {
                        ContosoTestCommonData.PriceGroupAmountCap01CP99,
                        TestFoundationCommonData.PriceGroupTestLeastExpFavorRetailer02CP88
                    });

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0063);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 3m;

                var offerIdOfferCapP99 = ContosoTestCommonData.OfferIdAmountCap01CP99;
                var offerIdP88 = TestFoundationCommonData.OfferIdTestLeastExpFavorRetailer02CP88;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerIdOfferCapP99) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdOfferCapP99, null), "Verify discount amount");

                var resultLine1 = transaction.SalesLines[0];

                Assert.AreEqual(1, resultLine1.DiscountLines.Count, "Should have 1 discounts");
                Assert.AreEqual(offerIdOfferCapP99, resultLine1.DiscountLines[0].OfferId, "Verify offer P99 " + resultLine1.ItemId);

                var resultLine2 = transaction.SalesLines[1];

                Assert.AreEqual(offerIdOfferCapP99, resultLine2.DiscountLines[0].OfferId, "Verify offer P99 " + resultLine2.ItemId);
                Assert.AreEqual(offerIdP88, resultLine2.DiscountLines[1].OfferId, "Verify offer P88 " + resultLine2.ItemId);
            }

            /// <summary>Amount cap loses to best deal discount.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModel_Test_AmountCapLoseToBestDeal()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-lose-to-best-deal");
                localHelper.AddPriceGroupsToTransaction(
                    transaction,
                    new List<string>()
                    {
                        ContosoTestCommonData.PriceGroupAmountCap02BP,
                        TestFoundationCommonData.PriceGroupTestOffer04BP
                    });

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine.Price = 29.99m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0026);
                salesLine2.Price = 29.99m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have a discount for " + resultLine.ItemId);

                    string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                    if (string.Equals(TestFoundationCommonData.ItemId0025, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        offerId = TestFoundationCommonData.OfferIdTestOffer04BP;
                    }

                    Assert.AreEqual(offerId, resultLine.DiscountLines[0].OfferId, "Check offer id");
                }
            }

            #endregion

            #region Core components for concurrency control model: compete with priority and compound across.

            /// <summary>P99: Best price and P0: Compounded 2 discounts.</summary>
            [TestMethod]
            public void CompeteModel_Test_BestPrice88Compounded0LeastExpensiveAndOffer()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
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

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdDO31BP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdDO41CP = TestFoundationCommonData.OfferIdTestOffer38CP;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch23CP;

                // Assert.
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

            /// <summary>P99: Best price and P0: Compounded least expensive.</summary>
            [TestMethod]
            public void CompeteModel_Test_BestPrice88Compounded0LeastExpensive()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("ext-discount-flow-compounded");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch23CP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 1m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine2.Price = 66.99M;
                salesLine2.Quantity = 1m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine3.Price = 33.99M;
                salesLine3.Quantity = 1m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch23CP;

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0055, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(0, resultLine.DiscountLines.Count, "Should have not found a discount for " + resultLine.ItemId);
                    }
                    else if (string.Equals(TestFoundationCommonData.ItemId0061, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        // 0060 has higher price, but discounted price (from highest priority) is lower than 0061's, so m & m pick up 0061.
                        Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have found a discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                    }
                    else
                    {
                        Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have found a discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdOffer, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                    }
                }
            }

            /// <summary>P99: Best price and P0: Compounded - 2 discounts.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModel_Test_BestPrice88Compounded0LeastExpensiveAndOffer2()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
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
                salesLine.Quantity = 1m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine2.Price = 66.99M;
                salesLine2.Quantity = 1m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine3.Price = 33.99M;
                salesLine3.Quantity = 1m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdDO31BP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdDO41CP = TestFoundationCommonData.OfferIdTestOffer38CP;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch23CP;

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0055, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have found a discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdDO41CP, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                    }
                    else if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have found 2 discounts for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdDO31BP88, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                        Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[1].OfferId, "Verify offer id");
                    }
                    else
                    {
                        Assert.AreEqual(0, resultLine.DiscountLines.Count, "Should have not found discount for " + resultLine.ItemId);
                    }
                }
            }

            /// <summary>Best price 88 and exclusive and compounded 0.</summary>
            [TestMethod]
            public void CompeteModel_Test_BestPrice88ExclusiveCompounded0()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("ext-discount-flow-compounded");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch23CP,
                    TestFoundationCommonData.PriceGroupTestOffer12EX,
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

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdDO31BP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdDO41CP = TestFoundationCommonData.OfferIdTestOffer38CP;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch23CP;
                string offerIdDO12EX = TestFoundationCommonData.OfferIdTestOffer12EX;

                decimal quantityDiscountedFor0061 = decimal.Zero;
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0055, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have found a discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdDO12EX, resultLine.DiscountLines[0].OfferId, "Verify offer id");
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

                Assert.AreEqual(1m, quantityDiscountedFor0061, "Verify m&m for 0061");
            }

            /// <summary>Best price 88 and Compounded 0.</summary>
            [TestMethod]
            public void CompeteModel_Test_BestPrice88Compounded0ReducePercentOffWins()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("ext-discount-flow-compounded");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestOffer08CP,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine2.Price = 15.99M;
                salesLine2.Quantity = 1m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdDO31BP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdOfferPercentOff = TestFoundationCommonData.OfferIdTestOffer38CP;

                SalesLine resultLine = transaction.SalesLines[0];
                Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have found 2 discounts for " + resultLine.ItemId);
                Assert.AreEqual(offerIdDO31BP88, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                Assert.AreEqual(offerIdOfferPercentOff, resultLine.DiscountLines[1].OfferId, "Verify offer id");
            }

            /// <summary>Best price 88 and Compounded 0.</summary>
            [TestMethod]
            public void CompeteModel_Test_BestPrice88Compounded0ReduceOfferPriceWins()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("ext-discount-flow-compounded");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestOffer08CP,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine2.Price = 16.99M;
                salesLine2.Quantity = 1m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdDO31BP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdOfferPrice = TestFoundationCommonData.OfferIdTestOffer08CP;

                SalesLine resultLine = transaction.SalesLines[0];
                Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have found 2 discounts for " + resultLine.ItemId);
                Assert.AreEqual(offerIdDO31BP88, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                Assert.AreEqual(offerIdOfferPrice, resultLine.DiscountLines[1].OfferId, "Verify offer id");
            }

            /// <summary>Best price 88 and Compounded 0.</summary>
            [TestMethod]
            public void CompeteModel_Test_BestPrice88BestPrice0OfferWinsMixAndMatch()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("ext-discount-flow-compounded");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch41BP,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = 0.39m;
                salesLine.Quantity = 2m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine2.Price = 0.82m;
                salesLine2.Quantity = 3m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine3.Price = 0.59m;
                salesLine3.Quantity = 1m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdDO31BP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdOfferPercentOff = TestFoundationCommonData.OfferIdTestOffer38CP;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch41BP;

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have found 2 discounts for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdDO31BP88, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                        Assert.AreEqual(offerIdOfferPercentOff, resultLine.DiscountLines[1].OfferId, "Verify offer id");
                    }
                    else
                    {
                        Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have found a discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                    }
                }
            }

            /// <summary>Best price 88 and Compounded 0.</summary>
            [TestMethod]
            public void CompeteModel_Test_BestPrice88BestPrice0OfferMixAndMatchWins()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("ext-discount-flow-compounded");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch41BP,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = 0.39m;
                salesLine.Quantity = 2m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine2.Price = 0.99m;
                salesLine2.Quantity = 3m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine3.Price = 0.59m;
                salesLine3.Quantity = 1m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdDO31BP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch41BP;

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have found 2 discounts for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdDO31BP88, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                        Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[1].OfferId, "Verify offer id");
                    }
                    else
                    {
                        Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have found a discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                    }
                }
            }

            /// <summary>Best price 88 and mix and match.</summary>
            [TestMethod]
            public void CompeteModel_Test_BestPrice88BestPriceMixAndMatch()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("ext-discount-flow-compounded");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch44BP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = 33.99m;
                salesLine.Quantity = 3m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine2.Price = 55.99m;
                salesLine2.Quantity = 3m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine3.Price = 39.99m;
                salesLine3.Quantity = 3m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch44BP;

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have found a discount for " + resultLine.ItemId);
                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(offerIdOffer, resultLine.DiscountLines[0].OfferId, "Verify offer id for " + resultLine.ItemId);
                    }
                    else
                    {
                        Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[0].OfferId, "Verify offer id for " + resultLine.ItemId);
                    }
                }
            }

            /// <summary>P99: Best price and P0: multiple discounts.</summary>
            [TestMethod]
            public void CompeteModel_Test_BestPrice88BestPriceCompound0OfferQuantityMixAndMatch()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("ext-discount-flow-compounded");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch12BP,
                    TestFoundationCommonData.PriceGroupTestQuantity09CP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 2m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine2.Price = 66.99M;
                salesLine2.Quantity = 3m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine3.Price = 22.99M;
                salesLine3.Quantity = 2m;

                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine4.Price = 29.99M;
                salesLine4.Quantity = 5m;

                SalesLine salesLine5 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0057);
                salesLine5.Price = 39.99M;
                salesLine5.Quantity = 5m;

                SalesLine salesLine6 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0058);
                salesLine6.Price = 19.99M;
                salesLine6.Quantity = 1m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdDO31BP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch12BP;

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.IsTrue(resultLine.DiscountLines.Any(), "should have at least one discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdDO31BP88, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                        if (resultLine.DiscountLines.Count == 2)
                        {
                            Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[1].OfferId, "Verify offer id");
                        }
                    }
                    else
                    {
                        if (resultLine.DiscountLines.Any())
                        {
                            Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                        }
                    }
                }
            }

            /// <summary>P99: Best price and P0: multiple discounts.</summary>
            [TestMethod]
            public void CompeteModel_Test_BestPrice88BestPriceCompound0OfferQuantityMixAndMatch2()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("ext-discount-flow-compounded");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestOffer38CP,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch12BP,
                    TestFoundationCommonData.PriceGroupTestQuantity09CP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 2m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine2.Price = 66.99M;
                salesLine2.Quantity = 3m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine3.Price = 22.99M;
                salesLine3.Quantity = 2m;

                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine4.Price = 29.99M;
                salesLine4.Quantity = 5m;

                SalesLine salesLine5 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0057);
                salesLine5.Price = 39.99M;
                salesLine5.Quantity = 5m;

                SalesLine salesLine6 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0058);
                salesLine6.Price = 19.99M;
                salesLine6.Quantity = 4m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerIdDO31BP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch12BP;

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.IsTrue(resultLine.DiscountLines.Any(), "should have at least one discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdDO31BP88, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                        if (resultLine.DiscountLines.Count == 2)
                        {
                            Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[1].OfferId, "Verify offer id");
                        }
                    }
                    else
                    {
                        if (resultLine.DiscountLines.Any())
                        {
                            Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                        }
                    }
                }
            }

            /// <summary>Test multiple least expensive favor retailers with threshold.</summary>
            public void CompeteModel_Test_TwoFavorRetailersCompoundedWithOfferCompoundedAndThresholdCompounded()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("mm-le-retailer-bp-cp-n-ex-offer");
                string[] priceGroups = new string[]
                {
                    TestFoundationCommonData.PriceGroupTestOffer30CP88,
                    TestFoundationCommonData.PriceGroupTestThreshold42CP,
                    TestFoundationCommonData.PriceGroupTestLeastExpFavorRetailer08CP,
                    TestFoundationCommonData.PriceGroupTestLeastExpFavorRetailer09CP,
                };

                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0077);
                salesLine1.Quantity = 12;
                salesLine1.Price = 9.99M;
                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0050);
                salesLine2.Quantity = 6;
                salesLine2.Price = 69.99M;
                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0051);
                salesLine3.Quantity = 4;
                salesLine3.Price = 69.99M;
                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0053);
                salesLine4.Quantity = 2;
                salesLine4.Price = 66.99M;
                SalesLine salesLine5 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0140);
                salesLine5.InventoryDimensionId = localHelper.GetInventDimId(salesLine5.ItemId, ProductDimensionData.BlackLarge);
                salesLine5.Quantity = 6;
                salesLine5.Price = 63.99M;

                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer30CP88;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestLeastExpFavorRetailer09CP;
                string offerIdThreshold = TestFoundationCommonData.OfferIdTestThreshold42CP;
                decimal discountAmountThresholdExpected = localHelper.GetThresholdDiscountValue(offerIdThreshold, 100m);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0051, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(3, resultLine.DiscountLines.Count, "Check discount line count for " + resultLine.ItemId);

                        IEnumerable<DiscountLine> discountLinesForOffer = resultLine.DiscountLines.Where(p => string.Equals(offerIdOffer, p.OfferId, StringComparison.OrdinalIgnoreCase));
                        Assert.AreEqual(1, discountLinesForOffer.Count(), "Should have a discount for offer " + resultLine.ItemId);

                        IEnumerable<DiscountLine> discountLinesForThreshold = resultLine.DiscountLines.Where(p => string.Equals(offerIdThreshold, p.OfferId, StringComparison.OrdinalIgnoreCase));
                        Assert.AreEqual(1, discountLinesForThreshold.Count(), "Should have a discount for threshold " + resultLine.ItemId);

                        IEnumerable<DiscountLine> discountLinesForMixAndMatch = resultLine.DiscountLines.Where(p => string.Equals(offerIdMixAndMatch, p.OfferId, StringComparison.OrdinalIgnoreCase));
                        Assert.AreEqual(1, discountLinesForMixAndMatch.Count(), "Should have a discount for mix and match " + resultLine.ItemId);
                    }
                    else if (string.Equals(TestFoundationCommonData.ItemId0053, resultLine.ItemId, StringComparison.OrdinalIgnoreCase) ||
                             string.Equals(TestFoundationCommonData.ItemId0050, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have a discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdThreshold, resultLine.DiscountLines[0].OfferId, "Verify threshold for " + resultLine.ItemId);
                    }
                    else
                    {
                        Assert.AreEqual(0, resultLine.DiscountLines.Count, "Should not have a discount for " + resultLine.ItemId);
                    }
                }

                Assert.AreEqual(discountAmountThresholdExpected, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdThreshold, ExtensiblePeriodicDiscountOfferType.Threshold), "Verify $-off for threshold");
            }

            /// <summary>Test least expensive favor retailer with 2 thresholds.</summary>
            [TestMethod]
            public void CompeteModel_Test_FavorRetailerCompoundedWithOfferCompoundedAnd2ThresholdsCompounded()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("mm-le-retailer-bp-cp-n-ex-offer");
                string[] priceGroups = new string[]
                {
                    TestFoundationCommonData.PriceGroupTestOffer30CP88,
                    TestFoundationCommonData.PriceGroupTestThreshold42CP,
                    TestFoundationCommonData.PriceGroupTestLeastExpFavorRetailer08CP,
                    TestFoundationCommonData.PriceGroupTestThreshold25CP99,
                };

                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0077);
                salesLine1.Quantity = 12;
                salesLine1.Price = 9.99M;
                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0051);
                salesLine3.Quantity = 4;
                salesLine3.Price = 69.99M;
                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0053);
                salesLine4.Quantity = 2;
                salesLine4.Price = 66.99M;
                SalesLine salesLine5 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0140);
                salesLine5.InventoryDimensionId = localHelper.GetInventDimId(salesLine5.ItemId, ProductDimensionData.BlackLarge);
                salesLine5.Quantity = 6;
                salesLine5.Price = 63.99M;

                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer30CP88;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestLeastExpFavorRetailer08CP;
                string offerIdThreshold = TestFoundationCommonData.OfferIdTestThreshold42CP;
                string offerIdThresholdP99 = TestFoundationCommonData.OfferIdTestThreshold25CP99;
                decimal discountAmountThresholdExpected = localHelper.GetThresholdDiscountValue(offerIdThreshold, 100m);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0051, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(3, resultLine.DiscountLines.Count, "Check discount line count for " + resultLine.ItemId);

                        IEnumerable<DiscountLine> discountLinesForOffer = resultLine.DiscountLines.Where(p => string.Equals(offerIdOffer, p.OfferId, StringComparison.OrdinalIgnoreCase));
                        Assert.AreEqual(1, discountLinesForOffer.Count(), "Should have a discount for offer " + resultLine.ItemId);

                        IEnumerable<DiscountLine> discountLinesForThresholdP99 = resultLine.DiscountLines.Where(p => string.Equals(offerIdThresholdP99, p.OfferId, StringComparison.OrdinalIgnoreCase));
                        Assert.AreEqual(1, discountLinesForThresholdP99.Count(), "Should have a discount for threshold " + resultLine.ItemId);

                        IEnumerable<DiscountLine> discountLinesForMixAndMatch = resultLine.DiscountLines.Where(p => string.Equals(offerIdMixAndMatch, p.OfferId, StringComparison.OrdinalIgnoreCase));
                        Assert.AreEqual(1, discountLinesForMixAndMatch.Count(), "Should have a discount for mix and match " + resultLine.ItemId);
                    }
                    else if (string.Equals(TestFoundationCommonData.ItemId0053, resultLine.ItemId, StringComparison.OrdinalIgnoreCase) ||
                             string.Equals(TestFoundationCommonData.ItemId0050, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have a discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdThresholdP99, resultLine.DiscountLines[0].OfferId, "Verify threshold for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdThreshold, resultLine.DiscountLines[1].OfferId, "Verify threshold for " + resultLine.ItemId);
                    }
                    else
                    {
                        Assert.AreEqual(0, resultLine.DiscountLines.Count, "Should not have a discount for " + resultLine.ItemId);
                    }
                }

                Assert.AreEqual(discountAmountThresholdExpected, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdThreshold, ExtensiblePeriodicDiscountOfferType.Threshold), "Verify $-off for threshold");
            }

            /// <summary>Test least expensive favor retailer with 2 thresholds.</summary>
            [TestMethod]
            public void CompeteModel_Test_OfferCompoundedAnd3ThresholdsCompete()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("offerP88-3-thresholds");
                transaction.Coupons.Add(new Coupon
                {
                    Code = TestFoundationCommonData.GetDiscountBarcode(TestFoundationCommonData.DiscountCodeTH11CP),
                    DiscountOfferId = TestFoundationCommonData.OfferIdTestThreshold11CP
                });
                string[] priceGroups = new string[]
                {
                    TestFoundationCommonData.PriceGroupTestOffer30CP88,
                    TestFoundationCommonData.PriceGroupTestThreshold09CP,
                    TestFoundationCommonData.PriceGroupTestThreshold11CP,
                    TestFoundationCommonData.PriceGroupTestThreshold43BP,
                };

                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0077);
                salesLine1.Quantity = 12;
                salesLine1.Price = 9.99M;
                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine3.Quantity = 4;
                salesLine3.Price = 69.99M;
                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine4.Quantity = 2;
                salesLine4.Price = 66.99M;

                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer30CP88;
                string offerIdThreshold = TestFoundationCommonData.OfferIdTestThreshold43BP;
                decimal discountAmountThresholdExpected = localHelper.GetThresholdDiscountValue(offerIdThreshold, 100m);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(2, resultLine.DiscountLines.Count, "Check discount line count for " + resultLine.ItemId);

                        IEnumerable<DiscountLine> discountLinesForOffer =
                            resultLine.DiscountLines.Where(p => string.Equals(offerIdOffer, p.OfferId, StringComparison.OrdinalIgnoreCase));
                        Assert.AreEqual(1, discountLinesForOffer.Count(), "Should have a discount for offer " + resultLine.ItemId);

                        IEnumerable<DiscountLine> discountLinesForThreshold =
                            resultLine.DiscountLines.Where(p => string.Equals(offerIdThreshold, p.OfferId, StringComparison.OrdinalIgnoreCase));
                        Assert.AreEqual(1, discountLinesForThreshold.Count(), "Should have a discount for threshold " + resultLine.ItemId);
                    }
                    else if (string.Equals(TestFoundationCommonData.ItemId0061, resultLine.ItemId, StringComparison.OrdinalIgnoreCase) ||
                             string.Equals(TestFoundationCommonData.ItemId0050, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have a discount for " + resultLine.ItemId);
                        Assert.AreEqual(offerIdThreshold, resultLine.DiscountLines[0].OfferId, "Verify threshold for " + resultLine.ItemId);
                    }
                    else
                    {
                        Assert.AreEqual(0, resultLine.DiscountLines.Count, "Should not have a discount for " + resultLine.ItemId);
                    }
                }

                Assert.AreEqual(discountAmountThresholdExpected, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdThreshold, ExtensiblePeriodicDiscountOfferType.Threshold), "Verify $-off for threshold");
            }

            /// <summary>Test mix and match and threshold jumbo with exclusive in top priority.</summary>
            [TestMethod]
            public void CompeteModel_Test_PriorityMixMatchAndThresholdJumboExclusiveInTopPriority()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("priority-mm-th");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestMixAndMatch32EX99,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch33BP99,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch34CP99,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch35CP99,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch36EX88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch37CP88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch38CP88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch39CP77,
                    TestFoundationCommonData.PriceGroupTestThreshold20EX99,
                    TestFoundationCommonData.PriceGroupTestThreshold21CP99,
                    TestFoundationCommonData.PriceGroupTestThreshold22CP99,
                    TestFoundationCommonData.PriceGroupTestThreshold23EX88,
                    TestFoundationCommonData.PriceGroupTestThreshold24CP88,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                string itemId0025 = TestFoundationCommonData.ItemId0025;
                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, itemId0025);
                salesLine1.Quantity = 8m; // 4 for MM32EX99
                salesLine1.Price = 99.99M;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0026);
                salesLine2.Quantity = 2m; // 2 applications for MM32EX99
                salesLine2.Price = 29.99M;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine3.Quantity = 3m;
                salesLine3.Price = 26.99M;

                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine4.Quantity = 2m;
                salesLine4.Price = 26.99M;

                SalesLine salesLine5 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0057);
                salesLine5.Quantity = 1m;
                salesLine5.Price = 26.99M;

                SalesLine salesLine6 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0058);
                salesLine6.Quantity = 1m;
                salesLine6.Price = 26.99M;

                SalesLine salesLine7 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0059);
                salesLine7.Quantity = 2m;
                salesLine7.Price = 26.99M;

                SalesLine salesLine8 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine8.Quantity = 1m;
                salesLine8.Price = 26.99M;

                SalesLine salesLine9 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine9.Quantity = 3m;
                salesLine9.Price = 26.99M;

                string offerIdMM32EX99 = TestFoundationCommonData.OfferIdTestMixAndMatch32EX99;
                string offerIdMM33BP99 = TestFoundationCommonData.OfferIdTestMixAndMatch33BP99;
                string offerIdMM34CP99 = TestFoundationCommonData.OfferIdTestMixAndMatch34CP99;
                string offerIdMM35CP99 = TestFoundationCommonData.OfferIdTestMixAndMatch35CP99;

                string offerIdMM36EX88 = TestFoundationCommonData.OfferIdTestMixAndMatch36EX88;

                string offerIdMM37CP88 = TestFoundationCommonData.OfferIdTestMixAndMatch37CP88;
                string offerIdMM38CP88 = TestFoundationCommonData.OfferIdTestMixAndMatch38CP88;

                string offerIdMM39CP77 = TestFoundationCommonData.OfferIdTestMixAndMatch39CP77;
                decimal amountOffMM39CP77 = localHelper.GetMixMatchDiscountValue(offerIdMM39CP77);

                string offerIdTH20EX99 = TestFoundationCommonData.OfferIdTestThreshold20EX99;
                string offerIdTH21CP99 = TestFoundationCommonData.OfferIdTestThreshold21CP99;
                string offerIdTH22CP99 = TestFoundationCommonData.OfferIdTestThreshold22CP99;
                string offerIdTH24CP88 = TestFoundationCommonData.OfferIdTestThreshold24CP88;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                Assert.AreEqual(
                    decimal.Zero,
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdMM35CP99, ExtensiblePeriodicDiscountOfferType.MixAndMatch), 
                    "no discount for " + offerIdMM35CP99);

                Assert.AreEqual(
                    decimal.Zero,
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdMM36EX88, ExtensiblePeriodicDiscountOfferType.MixAndMatch), 
                    "no discount for " + offerIdMM36EX88);

                Assert.AreEqual(
                    decimal.Zero,
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdMM38CP88, ExtensiblePeriodicDiscountOfferType.MixAndMatch), 
                    "$ off for " + offerIdMM38CP88);

                Assert.AreEqual(
                    amountOffMM39CP77 * 2m,
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdMM39CP77, ExtensiblePeriodicDiscountOfferType.MixAndMatch), 
                    "$ off for " + offerIdMM39CP77);

                Assert.AreEqual(
                    decimal.Zero,
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdTH20EX99, ExtensiblePeriodicDiscountOfferType.Threshold), 
                    "no discount for " + offerIdTH20EX99);

                Assert.AreEqual(
                    decimal.Zero,
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdTH21CP99, ExtensiblePeriodicDiscountOfferType.Threshold), 
                    "no discount for " + offerIdTH21CP99);

                Assert.AreEqual(
                    decimal.Zero,
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdTH22CP99, ExtensiblePeriodicDiscountOfferType.Threshold),
                    "no discount for " + offerIdTH22CP99);

                Assert.AreEqual(
                    decimal.Zero,
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdTH24CP88, ExtensiblePeriodicDiscountOfferType.Threshold),
                    "no discount for " + offerIdTH24CP88);

                Assert.AreEqual(
                    decimal.Zero,
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, TestFoundationCommonData.OfferIdTestThreshold23EX88, null), 
                    "No discount for TH23EX88");

                decimal quantity0025MM32EX99 = decimal.Zero;
                decimal quantity0025MM33BP99 = decimal.Zero;
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(itemId0025, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.IsTrue(resultLine.DiscountLines.Any(), "should have at least one discount for " + resultLine.ItemId);

                        if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM32EX99, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                        {
                            quantity0025MM32EX99 += resultLine.Quantity;
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "verify m&m EX");
                        }
                        else
                        {
                            Assert.IsTrue(resultLine.DiscountLines.Where(p => string.Equals(offerIdMM37CP88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any(), "Verify offerIdMM37CP88");
                            Assert.IsTrue(resultLine.DiscountLines.Where(p => string.Equals(offerIdMM39CP77, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any(), "Verify offerIdMM39CP77");

                            if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM33BP99, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM33BP99 += resultLine.Quantity;
                            }
                            else
                            {
                                Assert.IsTrue(resultLine.DiscountLines.Where(p => string.Equals(offerIdMM34CP99, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any(), "Verify offerIdMM34CP99");
                            }
                        }
                    }
                }

                Assert.AreEqual(4m, quantity0025MM32EX99, "Verify quantity for MM32EX99");
                Assert.AreEqual(2m, quantity0025MM33BP99, "Verify quantity for MM33BP99");
            }

            /// <summary>Test mix and match and threshold jumbo with exclusive in top priority.</summary>
            [TestMethod]
            public void CompeteModel_Test_PriorityMixMatchJumboExclusiveInLowerPriority()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("priority-mm-th");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestMixAndMatch33BP99,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch34CP99,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch36EX88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch37CP88,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                string itemId0025 = TestFoundationCommonData.ItemId0025;
                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, itemId0025);
                salesLine1.Quantity = 8m;
                salesLine1.Price = 99.99M;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine2.Quantity = 2m;
                salesLine2.Price = 26.99M;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine3.Quantity = 2m;
                salesLine3.Price = 26.99M;

                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0058);
                salesLine4.Quantity = 2m;
                salesLine4.Price = 26.99M;

                SalesLine salesLine5 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0059);
                salesLine5.Quantity = 2m;
                salesLine5.Price = 26.99M;

                string offerIdMM33BP99 = TestFoundationCommonData.OfferIdTestMixAndMatch33BP99;
                string offerIdMM34CP99 = TestFoundationCommonData.OfferIdTestMixAndMatch34CP99;

                string offerIdMM36EX88 = TestFoundationCommonData.OfferIdTestMixAndMatch36EX88;
                decimal discountAmountMM36EX88 = ((salesLine1.Price * 2m) + salesLine4.Price) - localHelper.GetMixMatchDiscountValue(offerIdMM36EX88);

                string offerIdMM37CP88 = TestFoundationCommonData.OfferIdTestMixAndMatch37CP88;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                Assert.AreEqual(
                    discountAmountMM36EX88,
                    TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdMM36EX88, ExtensiblePeriodicDiscountOfferType.MixAndMatch),
                    "$ for " + offerIdMM36EX88);

                decimal quantity0025MM36EX88 = decimal.Zero;
                decimal quantity0025MM33BP99 = decimal.Zero;
                decimal quantity0025MM34CP99 = decimal.Zero;
                decimal quantity0025MM37CP88 = decimal.Zero;
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(itemId0025, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.IsTrue(resultLine.DiscountLines.Any(), "should have at least one discount for " + resultLine.ItemId);

                        if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM36EX88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                        {
                            quantity0025MM36EX88 += resultLine.Quantity;
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "verify m&m EX");
                        }
                        else
                        {
                            if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM33BP99, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM33BP99 += resultLine.Quantity;
                            }
                            else if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM34CP99, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM34CP99 += resultLine.Quantity;
                            }

                            if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM37CP88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM37CP88 += resultLine.Quantity;
                            }
                        }
                    }
                }

                Assert.AreEqual(2m, quantity0025MM36EX88, "Verify quantity for MM32EX99");
                Assert.AreEqual(2m, quantity0025MM33BP99, "Verify quantity for MM33BP99");
                Assert.AreEqual(4m, quantity0025MM34CP99, "Verify quantity for MM33BP99");
                Assert.AreEqual(4m, quantity0025MM37CP88, "Verify quantity for MM33BP99");
            }

            /// <summary>Test mix and match and threshold jumbo with exclusive in top priority.</summary>
            [TestMethod]
            public void CompeteModel_Test_PriorityMixMatchJumboWithFavorRetailer()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("priority-mm-th");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestMixAndMatch33BP99,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch36EX88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch37CP88,
                    TestFoundationCommonData.PriceGroupTestLeastExpFavorRetailer01EX88,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                string itemId0025 = TestFoundationCommonData.ItemId0025;
                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, itemId0025);
                salesLine1.Quantity = 8m;
                salesLine1.Price = 99.99M;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine2.Quantity = 2m;
                salesLine2.Price = 26.99M;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0058);
                salesLine3.Quantity = 1m;
                salesLine3.Price = 26.99M;

                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0059);
                salesLine4.Quantity = 6m;
                salesLine4.Price = 26.99M;

                SalesLine salesLine5 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0062);
                salesLine5.Quantity = 7;
                salesLine5.Price = 26.99M;

                string offerIdMM33BP99 = TestFoundationCommonData.OfferIdTestMixAndMatch33BP99;

                string offerIdMM36EX88 = TestFoundationCommonData.OfferIdTestMixAndMatch36EX88;
                decimal discountAmountMM36EX88 = ((salesLine1.Price * 2m) + salesLine3.Price) -
                                                 localHelper.GetMixMatchDiscountValue(offerIdMM36EX88);
                string offerIdLeastExpFavorRetailer01EX88 = TestFoundationCommonData.OfferIdTestLeastExpFavorRetailer01EX88;

                string offerIdMM37CP88 = TestFoundationCommonData.OfferIdTestMixAndMatch37CP88;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                Assert.AreEqual(discountAmountMM36EX88, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdMM36EX88, ExtensiblePeriodicDiscountOfferType.MixAndMatch), "$ for " + offerIdMM36EX88);

                decimal quantity0025MM36EX88 = decimal.Zero;
                decimal quantity0025MM33BP99 = decimal.Zero;
                decimal quantity0062LeastExpFavorRetailer01EX88 = decimal.Zero;
                decimal quantity0025MM37CP88 = decimal.Zero;
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(itemId0025, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM36EX88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                        {
                            quantity0025MM36EX88 += resultLine.Quantity;
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "verify m&m EX");
                        }
                        else
                        {
                            if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM33BP99, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM33BP99 += resultLine.Quantity;
                            }

                            if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM37CP88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM37CP88 += resultLine.Quantity;
                            }
                        }
                    }
                    else if (string.Equals(TestFoundationCommonData.ItemId0062, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (resultLine.DiscountLines.Any())
                        {
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "1 discount for " + resultLine.ItemId);
                            Assert.AreEqual(offerIdLeastExpFavorRetailer01EX88, resultLine.DiscountLines[0].OfferId, "Verify offer id for " + resultLine.ItemId);
                            quantity0062LeastExpFavorRetailer01EX88 += resultLine.Quantity;
                        }
                    }
                }

                Assert.AreEqual(2m, quantity0025MM36EX88, "Verify quantity for MM36EX88");
                Assert.AreEqual(2m, quantity0025MM33BP99, "Verify quantity for MM33BP99");
                Assert.AreEqual(6m, quantity0062LeastExpFavorRetailer01EX88, "Verify quantity for LeastExpFavorRetailer01EX88");
                Assert.AreEqual(4m, quantity0025MM37CP88, "Verify quantity for MM37CP88");
            }

            /// <summary>Test mix and match and threshold jumbo with favor retail exclusive and compound.</summary>
            [TestMethod]
            public void CompeteModel_Test_PriorityMixMatchJumboWithFavorRetailerCompound()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("priority-mm-th");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestMixAndMatch33BP99,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch36EX88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch38CP88,
                    TestFoundationCommonData.PriceGroupTestLeastExpFavorRetailer01EX88,
                    TestFoundationCommonData.PriceGroupTestLeastExpFavorRetailer02CP88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch39CP77,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                string itemId0025 = TestFoundationCommonData.ItemId0025;
                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, itemId0025);
                salesLine1.Quantity = 7m;
                salesLine1.Price = 99.99M;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine2.Quantity = 1m;
                salesLine2.Price = 26.99M;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0058);
                salesLine3.Quantity = 1m;
                salesLine3.Price = 26.99M;

                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine4.Quantity = 1m;
                salesLine4.Price = 26.99M;

                SalesLine salesLine5 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0062);
                salesLine5.Quantity = 7m;
                salesLine5.Price = 26.99M;

                SalesLine salesLine6 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0063);
                salesLine6.Quantity = 6m;
                salesLine6.Price = 26.99M;

                SalesLine salesLine7 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0061);
                salesLine7.Quantity = 6m;
                salesLine7.Price = 26.99M;

                string offerIdMM33BP99 = TestFoundationCommonData.OfferIdTestMixAndMatch33BP99;

                string offerIdMM36EX88 = TestFoundationCommonData.OfferIdTestMixAndMatch36EX88;
                decimal discountAmountMM36EX88 = ((salesLine1.Price * 2m) + salesLine3.Price) -
                                                 localHelper.GetMixMatchDiscountValue(offerIdMM36EX88);
                string offerIdLeastExpFavorRetailer01EX88 = TestFoundationCommonData.OfferIdTestLeastExpFavorRetailer01EX88;

                string offerIdMM38CP88 = TestFoundationCommonData.OfferIdTestMixAndMatch38CP88;
                string offerIdLeastExpFavorRetailer02CP88 = TestFoundationCommonData.OfferIdTestLeastExpFavorRetailer02CP88;
                string offerIdMM39CP77 = TestFoundationCommonData.OfferIdTestMixAndMatch39CP77;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                Assert.AreEqual(discountAmountMM36EX88, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdMM36EX88, ExtensiblePeriodicDiscountOfferType.MixAndMatch), "$ for " + offerIdMM36EX88);

                decimal quantity0025MM36EX88 = decimal.Zero;
                decimal quantity0025MM33BP99 = decimal.Zero;
                decimal quantity0062LeastExpFavorRetailer01EX88 = decimal.Zero;
                decimal quantity0025MM38CP88 = decimal.Zero;
                decimal quantity0063LeastExpFavorRetailer02CP88 = decimal.Zero;
                decimal quantity0025MM39CP77 = decimal.Zero;
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(itemId0025, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM36EX88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                        {
                            quantity0025MM36EX88 += resultLine.Quantity;
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "verify m&m EX");
                        }
                        else
                        {
                            if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM33BP99, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM33BP99 += resultLine.Quantity;
                            }

                            if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM38CP88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM38CP88 += resultLine.Quantity;
                            }

                            if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM39CP77, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM39CP77 += resultLine.Quantity;
                            }
                        }
                    }
                    else if (string.Equals(TestFoundationCommonData.ItemId0062, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (resultLine.DiscountLines.Any())
                        {
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "1 discount for " + resultLine.ItemId);
                            Assert.AreEqual(offerIdLeastExpFavorRetailer01EX88, resultLine.DiscountLines[0].OfferId, "Verify offer id for " + resultLine.ItemId);
                            quantity0062LeastExpFavorRetailer01EX88 += resultLine.Quantity;
                        }
                    }
                    else if (string.Equals(TestFoundationCommonData.ItemId0063, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (resultLine.DiscountLines.Any())
                        {
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "1 discount for " + resultLine.ItemId);
                            Assert.AreEqual(offerIdLeastExpFavorRetailer02CP88, resultLine.DiscountLines[0].OfferId, "Verify offer id for " + resultLine.ItemId);
                            quantity0063LeastExpFavorRetailer02CP88 += resultLine.Quantity;
                        }
                    }
                }

                Assert.AreEqual(2m, quantity0025MM36EX88, "Verify quantity for MM36EX88");
                Assert.AreEqual(1m, quantity0025MM33BP99, "Verify quantity for MM33BP99");
                Assert.AreEqual(6m, quantity0062LeastExpFavorRetailer01EX88, "Verify quantity for LeastExpFavorRetailer01EX88");
                Assert.AreEqual(1m, quantity0025MM38CP88, "Verify quantity for MM38CP88");
                Assert.AreEqual(4m, quantity0063LeastExpFavorRetailer02CP88, "Verify quantity for LeastExpFavorRetailer02CP88");
                Assert.AreEqual(2m, quantity0025MM39CP77, "Verify quantity for MM39CP77");
            }

            /// <summary>Test mix and match and threshold jumbo with favor retail exclusive and compound.</summary>
            [TestMethod]
            public void CompeteModel_Test_PriorityMixAndMatchesExclusiveThreshold()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("priority-mm-th");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestMixAndMatch33BP99,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch36EX88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch38CP88,
                    TestFoundationCommonData.PriceGroupTestThreshold23EX88,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                string itemId0025 = TestFoundationCommonData.ItemId0025;
                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, itemId0025);
                salesLine1.Quantity = 5m;
                salesLine1.Price = 15.99M;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine2.Quantity = 1m;
                salesLine2.Price = 26.99M;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0058);
                salesLine3.Quantity = 1m;
                salesLine3.Price = 66.99M;

                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine4.Quantity = 1m;
                salesLine4.Price = 26.99M;

                string offerIdMM33BP99 = TestFoundationCommonData.OfferIdTestMixAndMatch33BP99;

                string offerIdMM36EX88 = TestFoundationCommonData.OfferIdTestMixAndMatch36EX88;
                decimal discountAmountMM36EX88 = ((salesLine1.Price * 2m) + salesLine3.Price) -
                                                 localHelper.GetMixMatchDiscountValue(offerIdMM36EX88);

                string offerIdMM38CP88 = TestFoundationCommonData.OfferIdTestMixAndMatch38CP88;

                string offerIdTH23EX88 = TestFoundationCommonData.OfferIdTestThreshold23EX88;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                Assert.AreEqual(discountAmountMM36EX88, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdMM36EX88, ExtensiblePeriodicDiscountOfferType.MixAndMatch), "$ for " + offerIdMM36EX88);

                decimal quantity0025MM36EX88 = decimal.Zero;
                decimal quantity0025MM33BP99 = decimal.Zero;
                decimal quantity0025MM38CP88 = decimal.Zero;
                decimal quantity0025TH23EX88 = decimal.Zero;
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(itemId0025, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM36EX88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                        {
                            quantity0025MM36EX88 += resultLine.Quantity;
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "verify m&m EX");
                        }
                        else if (resultLine.DiscountLines.Where(p => string.Equals(offerIdTH23EX88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                        {
                            quantity0025TH23EX88 += resultLine.Quantity;
                            Assert.AreEqual(1, resultLine.DiscountLines.Count, "verify threshold EX");
                        }
                        else
                        {
                            if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM33BP99, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM33BP99 += resultLine.Quantity;
                            }

                            if (resultLine.DiscountLines.Where(p => string.Equals(offerIdMM38CP88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any())
                            {
                                quantity0025MM38CP88 += resultLine.Quantity;
                            }
                        }
                    }
                }

                Assert.AreEqual(2m, quantity0025MM36EX88, "Verify quantity for MM36EX88");
                Assert.AreEqual(1m, quantity0025MM33BP99, "Verify quantity for MM33BP99");
                Assert.AreEqual(1m, quantity0025MM38CP88, "Verify quantity for MM38CP88");
                Assert.AreEqual(0m, quantity0025TH23EX88, "Verify quantity for MM39CP77");
                Assert.AreEqual(0, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdTH23EX88, ExtensiblePeriodicDiscountOfferType.Threshold), "$ for " + offerIdTH23EX88);
            }

            /// <summary>Test priority exclusive and compound.</summary>
            [TestMethod]
            public void CompeteModel_Test_PriorityThresholdExclusiveAndCompound()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("priority-mm-th");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestThreshold20EX99,
                    TestFoundationCommonData.PriceGroupTestThreshold21CP99,
                    TestFoundationCommonData.PriceGroupTestThreshold23EX88,
                    TestFoundationCommonData.PriceGroupTestThreshold24CP88,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                string itemId0025 = TestFoundationCommonData.ItemId0025;
                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, itemId0025);
                salesLine1.Quantity = 10m;
                salesLine1.Price = 15.99M;

                string offerIdTH20EX99 = TestFoundationCommonData.OfferIdTestThreshold20EX99;
                decimal discountAmount = localHelper.GetThresholdDiscountValue(offerIdTH20EX99, salesLine1.Price * salesLine1.Quantity);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                Assert.AreEqual(1, transaction.SalesLines.Count, "no split");
                Assert.AreEqual(discountAmount, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdTH20EX99, ExtensiblePeriodicDiscountOfferType.Threshold), "$ for " + offerIdTH20EX99);

                Assert.AreEqual(1, salesLine1.DiscountLines.Count, "verify threshold EX");
                Assert.AreEqual(offerIdTH20EX99, salesLine1.DiscountLines[0].OfferId, "Verify offer id");
            }

            /// <summary>Test priority exclusive and compound.</summary>
            [TestMethod]
            public void CompeteModel_Test_MixAndMatchPriorityThresholdExclusiveAndCompound()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateHoldTogetherForDiscountRounding(true);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("priority-mm-th");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestThreshold20EX99,
                    TestFoundationCommonData.PriceGroupTestThreshold21CP99,
                    TestFoundationCommonData.PriceGroupTestThreshold23EX88,
                    TestFoundationCommonData.PriceGroupTestThreshold24CP88,
                    TestFoundationCommonData.PriceGroupTestMixAndMatch31BP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                string itemId0025 = TestFoundationCommonData.ItemId0025;
                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, itemId0025);
                salesLine1.Quantity = 10m;
                salesLine1.Price = 55.99M;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0057);
                salesLine2.Quantity = 5m;
                salesLine2.Price = 25.99M;

                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch31BP;
                string offerIdTH20EX99 = TestFoundationCommonData.OfferIdTestThreshold20EX99;
                decimal discountAmount = localHelper.GetThresholdDiscountValue(offerIdTH20EX99, salesLine1.Price * salesLine1.Quantity);
                string offerIdTH21CP99 = TestFoundationCommonData.OfferIdTestThreshold21CP99;
                string offerIdTH24CP88 = TestFoundationCommonData.OfferIdTestThreshold24CP88;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    if (string.Equals(itemId0025, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (resultLine.DiscountLines.Count == 1)
                        {
                            Assert.AreEqual(offerIdTH20EX99, resultLine.DiscountLines[0].OfferId, "Verify Ex threshold for " + resultLine.ItemId);
                        }
                        else
                        {
                            Assert.AreEqual(3, resultLine.DiscountLines.Count, "verify 3 discounts for " + resultLine.ItemId);
                            Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[0].OfferId, "Verify mix and match for " + resultLine.ItemId);
                            Assert.IsTrue(resultLine.DiscountLines.Where(p => string.Equals(offerIdTH21CP99, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any(), "Verify threshold for " + resultLine.ItemId);
                            Assert.IsTrue(resultLine.DiscountLines.Where(p => string.Equals(offerIdTH24CP88, p.OfferId, StringComparison.OrdinalIgnoreCase)).Any(), "Verify threshold for " + resultLine.ItemId);
                        }
                    }
                    else
                    {
                        Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[0].OfferId, "Verify mix and match for " + resultLine.ItemId);
                    }
                }

                Assert.AreEqual(discountAmount, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdTH20EX99, ExtensiblePeriodicDiscountOfferType.Threshold), "$ for " + offerIdTH20EX99);
            }

            /// <summary>Test least expensive bundle id.</summary>
            [TestMethod]
            public void CompeteModel_Test_PriorityLeastExpensiveOneLineGroupBundleIdAndOffer()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("leastexpensive-bundle");
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestMixAndMatch44BP88);
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestMixAndMatch81CP);
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestOffer32BP);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine1.Price = 96.99M;
                salesLine1.Quantity = 7m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0057);
                salesLine2.Price = 96.99M;
                salesLine2.Quantity = 7m;

                string offerIdMixAndMatchP88 = TestFoundationCommonData.OfferIdTestMixAndMatch44BP88;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch81CP;
                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer32BP;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                decimal quantity0055ForOffer = decimal.Zero;
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(2, resultLine.DiscountLines.Count, "2 discounts for " + resultLine.ItemId);
                    Assert.AreEqual(offerIdMixAndMatchP88, resultLine.DiscountLines[0].OfferId, "verify m&m p88");
                    if (string.Equals(TestFoundationCommonData.ItemId0055, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (string.Equals(offerIdOffer, resultLine.DiscountLines[1].OfferId, StringComparison.OrdinalIgnoreCase))
                        {
                            quantity0055ForOffer += resultLine.Quantity;
                        }
                        else
                        {
                            Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[1].OfferId, "Verify m&m for " + resultLine.ItemId);
                        }
                    }
                    else
                    {
                        Assert.AreEqual(offerIdOffer, resultLine.DiscountLines[1].OfferId, "Verify offer for " + resultLine.ItemId);
                    }
                }

                Assert.AreEqual(1m, quantity0055ForOffer, "Verify quantity for 0055 for offer");

                SalesTransactionVerification.VerifyBundles(transaction.SalesLines, offerIdMixAndMatchP88, quantityPerBundle: 7m, numberOfBundles: 2);
                SalesTransactionVerification.VerifyBundles(transaction.SalesLines, offerIdMixAndMatch, quantityPerBundle: 2m, numberOfBundles: 3);
            }

            /// <summary>Test least expensive bundle id.</summary>
            [TestMethod]
            public void CompeteModel_Test_Priority77LeastExpensiveOneLineGroupBundleIdAndOffer()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("leastexpensive-bundle");
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestMixAndMatch45BP77);
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestMixAndMatch81CP);
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestOffer32BP);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine1.Price = 96.99M;
                salesLine1.Quantity = 3m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0057);
                salesLine2.Price = 96.99M;
                salesLine2.Quantity = 3m;

                string offerIdMixAndMatchP77 = TestFoundationCommonData.OfferIdTestMixAndMatch45BP77;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch81CP;
                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer32BP;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                decimal quantity0055ForOffer = decimal.Zero;
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(2, resultLine.DiscountLines.Count, "2 discounts for " + resultLine.ItemId);
                    Assert.AreEqual(offerIdMixAndMatchP77, resultLine.DiscountLines[0].OfferId, "verify m&m p77");
                    if (string.Equals(TestFoundationCommonData.ItemId0055, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (string.Equals(offerIdOffer, resultLine.DiscountLines[1].OfferId, StringComparison.OrdinalIgnoreCase))
                        {
                            quantity0055ForOffer += resultLine.Quantity;
                        }
                        else
                        {
                            Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[1].OfferId, "Verify m&m for " + resultLine.ItemId);
                        }
                    }
                    else
                    {
                        Assert.AreEqual(offerIdOffer, resultLine.DiscountLines[1].OfferId, "Verify offer for " + resultLine.ItemId);
                    }
                }

                Assert.AreEqual(1m, quantity0055ForOffer, "Verify quantity for 0055 for offer");

                SalesTransactionVerification.VerifyBundles(transaction.SalesLines, offerIdMixAndMatchP77, quantityPerBundle: 3m, numberOfBundles: 2);
                SalesTransactionVerification.VerifyBundles(transaction.SalesLines, offerIdMixAndMatch, quantityPerBundle: 2m, numberOfBundles: 1);
            }

            /// <summary>Test least expensive bundle id.</summary>
            [TestMethod]
            public void CompeteModel_Test_AllQuantity1Priority77LeastExpensiveOneLineGroupBundleIdAndOffer()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("leastexpensive-bundle-q1");
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestMixAndMatch45BP77);
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestMixAndMatch81CP);
                localHelper.AddPriceGroupToTransaction(transaction, TestFoundationCommonData.PriceGroupTestOffer32BP);

                for (int i = 0; i < 3; i++)
                {
                    SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                    salesLine1.Price = 96.99M;

                    SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0057);
                    salesLine2.Price = 96.99M;
                }

                string offerIdMixAndMatchP77 = TestFoundationCommonData.OfferIdTestMixAndMatch45BP77;
                string offerIdMixAndMatch = TestFoundationCommonData.OfferIdTestMixAndMatch81CP;
                string offerIdOffer = TestFoundationCommonData.OfferIdTestOffer32BP;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                decimal quantity0055ForOffer = decimal.Zero;
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(2, resultLine.DiscountLines.Count, "2 discounts for " + resultLine.ItemId);
                    Assert.AreEqual(offerIdMixAndMatchP77, resultLine.DiscountLines[0].OfferId, "verify m&m p77");
                    if (string.Equals(TestFoundationCommonData.ItemId0055, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        if (string.Equals(offerIdOffer, resultLine.DiscountLines[1].OfferId, StringComparison.OrdinalIgnoreCase))
                        {
                            quantity0055ForOffer += resultLine.Quantity;
                        }
                        else
                        {
                            Assert.AreEqual(offerIdMixAndMatch, resultLine.DiscountLines[1].OfferId, "Verify m&m for " + resultLine.ItemId);
                        }
                    }
                    else
                    {
                        Assert.AreEqual(offerIdOffer, resultLine.DiscountLines[1].OfferId, "Verify offer for " + resultLine.ItemId);
                    }
                }

                Assert.AreEqual(1m, quantity0055ForOffer, "Verify quantity for 0055 for offer");

                SalesTransactionVerification.VerifyBundles(transaction.SalesLines, offerIdMixAndMatchP77, quantityPerBundle: 3m, numberOfBundles: 2);
                SalesTransactionVerification.VerifyBundles(transaction.SalesLines, offerIdMixAndMatch, quantityPerBundle: 2m, numberOfBundles: 1);
            }

            #endregion

            #region performance

            /// <summary>
            /// A performance test for multiple mix and match discounts.
            /// </summary>
            [TestMethod]
            public void CompeteModel_Performance_MultipleMixAndMatches()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("multiple-m&m");

                localHelper.AddPriceGroupsToTransaction(transaction, new List<string>() { TestFoundationCommonData.PriceGroupTestMixAndMatch87BP, TestFoundationCommonData.PriceGroupTestMixAndMatch88BP, });

                for (int i = 0; i < 50; i++)
                {
                    string itemId = (43 + i).ToString("D4");
                    SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, itemId);
                    salesLine.Price = 3m;
                }

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
            }

            /// <summary>
            /// A performance test for multiple quantity discounts.
            /// </summary>
            [TestMethod]
            public void CompeteModel_Performance_MultipleQuantityDiscounts()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("multiple-m&m");

                localHelper.AddPriceGroupsToTransaction(transaction, new List<string>() { TestFoundationCommonData.PriceGroupTestQuantity39BP, TestFoundationCommonData.PriceGroupTestQuantity40BP, });

                for (int i = 0; i < 50; i++)
                {
                    string itemId = (43 + i).ToString("D4");
                    SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, itemId);
                    salesLine.Price = 3m;
                }

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
            }

            #endregion
        }
    }
}
