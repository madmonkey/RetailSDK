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
        using Commerce.Runtime.Extensions.PricingEngineSample;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;
        using Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine;
        using Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine.DiscountData;
        using Microsoft.VisualStudio.TestTools.UnitTesting;

        /// <summary>
        /// Component tests for <see href="https://blogs.msdn.microsoft.com/retaillife/2017/01/08/retail-discount-concurrency-control-compete-within-priority-and-compound-across/">concurrency control model: compete with priority and compound across</see>,
        /// with compound option of off original price,
        /// and with <see href="https://blogs.msdn.microsoft.com/retaillife/2017/02/25/dynamics-retail-discount-concepts-discount-base-amount/">discount base amount adjustments</see>.
        /// </summary>
        [TestClass]
        [DeploymentItem(@"TestDataManager\SampleData", @"TestDataManager\SampleData")]
        public class CompeteModelOffOriginalPriceDiscountBaseAmountTests : PricingBaseTests
        {
            #region discount base amount tests, with both item level adjustment and per-priority adjustment.

            /// <summary>P99: Best price with reduced discount base amount.</summary>
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_BestPrice88()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap =
                    new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
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
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBestPrice88Compound0()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap =
                    new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
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
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentageP0), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");
            }

            /// <summary>P99: Best price with reduced discount base amount.</summary>
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBestPrice88AdjustCompound0()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap =
                    new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
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
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentageP88), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount P88");
                Assert.AreEqual(offerIdOfferP0, salesLine.DiscountLines[1].OfferId, "Verify offer P0");
                Assert.AreEqual(percentageP0, salesLine.DiscountLines[1].Percentage, "Verify %-off P0");
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountAfterP88 * 2m, percentageP0), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");
            }

            /// <summary>P88: Best price with reduced discount base amount; P77 reduced again.</summary>
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBestPrice88AdjustCompounded77Compound0()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap =
                    new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-3-p-discount2");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupTestOffer31BP88,
                    TestFoundationCommonData.PriceGroupTestOffer28CP77,
                    TestFoundationCommonData.PriceGroupTestOffer04BP,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 2m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine2.Price = 69.99M;
                salesLine2.Quantity = 2m;

                decimal discountBaseAmount = 63.99m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSalesLineDiscountBaseAmount(salesLine.LineId, discountBaseAmount);
                decimal discountBaseAmountAfterP88 = 10m;
                priorityDiscountBaseAmountCalculatorWithAmountCap.AddSaleLineIdPriorityDiscountBaseAmount(salesLine.LineId, 88, discountBaseAmountAfterP88);

                string offerIdOfferP88 = TestFoundationCommonData.OfferIdTestOffer31BP88;
                decimal percentageP88 = localHelper.GetDiscountOfferValueByItem(offerIdOfferP88, salesLine.ItemId, string.Empty);
                string offerIdOfferP77 = TestFoundationCommonData.OfferIdTestOffer28CP77;
                decimal percentageP77Cricket = localHelper.GetDiscountOfferValueByCategory(offerIdOfferP77, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);
                string offerIdOfferP0 = TestFoundationCommonData.OfferIdTestOffer04BP;
                decimal percentageP0 = localHelper.GetDiscountOfferValueByItem(offerIdOfferP0, salesLine2.ItemId, string.Empty);

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
                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have 2 discounts");

                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(offerIdOfferP88, resultLine.DiscountLines[0].OfferId, "Verify offer P88");
                        Assert.AreEqual(percentageP88, resultLine.DiscountLines[0].Percentage, "Verify %-off P88");
                        Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentageP88), resultLine.DiscountLines[0].EffectiveAmount, "Verify effective amount P88");

                        Assert.AreEqual(offerIdOfferP77, resultLine.DiscountLines[1].OfferId, "Verify offer P0");
                        Assert.AreEqual(percentageP77Cricket, resultLine.DiscountLines[1].Percentage, "Verify %-off P0");
                        Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountAfterP88 * 2m, percentageP77Cricket), resultLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");
                    }
                    else
                    {
                        Assert.AreEqual(offerIdOfferP77, resultLine.DiscountLines[0].OfferId, "Verify offer P77");

                        Assert.AreEqual(offerIdOfferP0, resultLine.DiscountLines[1].OfferId, "Verify offer P0");
                        Assert.AreEqual(percentageP0, resultLine.DiscountLines[1].Percentage, "Verify %-off P0");
                        Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(resultLine.Price * 2m, percentageP0), resultLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");
                    }
                }
            }

            /// <summary>P99: Best price and P0: Compounded 2 discounts.</summary>
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_BestPrice88AdjustCompounded0LeastExpensiveAndOffer()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap =
                    new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
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
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBestPrice88AdjustCompound0LineManual()
            {
                // Arrange.
                foreach (decimal multiplier in TestFoundationPricingHelper.GetSalesAndReturnQuantityMultipliers())
                {
                    PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap
                        = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                    PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                    TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                    localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                    localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                    SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-2-discount2-line-manual");
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

                    // Total ignores per-priority adjustment.
                    Assert.AreEqual(DiscountLineType.ManualDiscount, salesLine.DiscountLines[2].DiscountLineType, "Verify manual");
                    Assert.AreEqual(ManualDiscountType.LineDiscountPercent, salesLine.DiscountLines[2].ManualDiscountType, "Verify manual total");
                    Assert.AreEqual(salesLine.LineManualDiscountPercentage, salesLine.DiscountLines[2].Percentage, "Verify total manual %-off");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, salesLine.LineManualDiscountPercentage), salesLine.DiscountLines[2].EffectiveAmount, "Verify effective amount");
                }
            }

            /// <summary>P99: Best price with reduced discount base amount.</summary>
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBestPrice88AdjustCompound0TotalManual()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap =
                    new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
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
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentageP88), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount P88");

                Assert.AreEqual(offerIdOfferP0, salesLine.DiscountLines[1].OfferId, "Verify offer P0");
                Assert.AreEqual(percentageP0, salesLine.DiscountLines[1].Percentage, "Verify %-off P0");
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountAfterP88 * 2m, percentageP0), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");

                // Total ignores per-priority adjustment.
                Assert.AreEqual(DiscountLineType.ManualDiscount, salesLine.DiscountLines[2].DiscountLineType, "Verify manual");
                Assert.AreEqual(ManualDiscountType.TotalDiscountPercent, salesLine.DiscountLines[2].ManualDiscountType, "Verify manual total");
                Assert.AreEqual(transaction.TotalManualDiscountPercentage, salesLine.DiscountLines[2].Percentage, "Verify total manual %-off");
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, transaction.TotalManualDiscountPercentage), salesLine.DiscountLines[2].EffectiveAmount, "Verify effective amount");
            }

            /// <summary>P99: Best price with reduced discount base amount.</summary>
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBestPrice88AdjustCompound0TotalManualFull()
            {
                // Arrange.
                foreach (decimal multiplier in TestFoundationPricingHelper.GetSalesAndReturnQuantityMultipliers())
                {
                    PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap
                        = new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                    PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                    TestFoundationPricingDataManager localHelper = new TestFoundationPricingDataManager();
                    localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                    localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                    SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-2-discount2-total-manual-full");
                    transaction.TotalManualDiscountPercentage = 50m;
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
                    Assert.AreEqual(
                        TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * salesLine.Quantity, percentageP88),
                        salesLine.DiscountLines[0].EffectiveAmount, 
                        "Verify effective amount P88");

                    Assert.AreEqual(offerIdOfferP0, salesLine.DiscountLines[1].OfferId, "Verify offer P0");
                    Assert.AreEqual(percentageP0, salesLine.DiscountLines[1].Percentage, "Verify %-off P0");
                    Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountAfterP88 * salesLine.Quantity, percentageP0), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");

                    // Total ignores per-priority adjustment.
                    Assert.AreEqual(DiscountLineType.ManualDiscount, salesLine.DiscountLines[2].DiscountLineType, "Verify manual");
                    Assert.AreEqual(ManualDiscountType.TotalDiscountPercent, salesLine.DiscountLines[2].ManualDiscountType, "Verify manual total");
                    Assert.AreEqual(transaction.TotalManualDiscountPercentage, salesLine.DiscountLines[2].Percentage, "Verify total manual %-off");
                    decimal discountAmount = discountBaseAmount * salesLine.Quantity;
                    discountAmount -= salesLine.DiscountLines[0].EffectiveAmount;
                    discountAmount -= salesLine.DiscountLines[1].EffectiveAmount;
                    Assert.AreEqual(discountAmount, salesLine.DiscountLines[2].EffectiveAmount, "Verify effective amount");
                }
            }

            /// <summary>P99: Best price with reduced discount base amount.</summary>
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBestPrice88AdjustCompound0TotalManualAmountFull()
            {
                // Arrange.
                PriorityDiscountBaseAmountCalculatorWithAmountCap priorityDiscountBaseAmountCalculatorWithAmountCap =
                    new PriorityDiscountBaseAmountCalculatorWithAmountCap();
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(priorityDiscountBaseAmountCalculatorWithAmountCap);

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap-2-discount2-total-manual-full");
                transaction.TotalManualDiscountAmount = 60m;
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
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmount * 2m, percentageP88), salesLine.DiscountLines[0].EffectiveAmount, "Verify effective amount P88");

                Assert.AreEqual(offerIdOfferP0, salesLine.DiscountLines[1].OfferId, "Verify offer P0");
                Assert.AreEqual(percentageP0, salesLine.DiscountLines[1].Percentage, "Verify %-off P0");
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(discountBaseAmountAfterP88 * 2m, percentageP0), salesLine.DiscountLines[1].EffectiveAmount, "Verify effective amount P0");

                // Total ignores per-priority adjustment.
                Assert.AreEqual(DiscountLineType.ManualDiscount, salesLine.DiscountLines[2].DiscountLineType, "Verify manual");
                Assert.AreEqual(ManualDiscountType.TotalDiscountAmount, salesLine.DiscountLines[2].ManualDiscountType, "Verify manual total");
                Assert.AreEqual(transaction.TotalManualDiscountAmount / 2m, salesLine.DiscountLines[2].Amount, "Verify total manual %-off");
                decimal discountAmount = discountBaseAmount * salesLine.Quantity;
                discountAmount -= salesLine.DiscountLines[0].EffectiveAmount;
                discountAmount -= salesLine.DiscountLines[1].EffectiveAmount;
                Assert.AreEqual(discountAmount, salesLine.DiscountLines[2].EffectiveAmount, "Verify effective amount");
            }

            #endregion

            #region amount cap, priority and discount base amount adjustment

            /// <summary>Discount base amount reduction given an amount cap offer.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustAmountCap99Offer77AmountCap0()
            {
                // Arrange.
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(
                    new BaseReductionForAmountCapDiscountBaseAmountCalculator());

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("cap99-general-cap77");
                List<string> priceGroups = new List<string>()
                {
                    ContosoTestCommonData.PriceGroupAmountCap01CP99,
                    ContosoTestCommonData.PriceGroupAmountCap03CP,
                    TestFoundationCommonData.PriceGroupTestOffer28CP77,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine.Price = 119.99M;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0121);
                salesLine2.Price = 89.99M;
                salesLine2.Quantity = 3m;

                string offerIdOfferCapP99 = ContosoTestCommonData.OfferIdAmountCap01CP99;
                string offerIdOfferP77 = TestFoundationCommonData.OfferIdTestOffer28CP77;
                string offerIdOfferEXTDO43CP = ContosoTestCommonData.OfferIdAmountCap03CP;
                decimal percentageEXTDO43CP = localHelper.GetDiscountOfferValueByCategory(offerIdOfferEXTDO43CP, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategorySoccer);

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
                    new Dictionary<string, List<PriorityDiscountBaseAmount>>(StringComparer.OrdinalIgnoreCase)
                    {
                        {
                            salesLine.LineId,
                            new List<PriorityDiscountBaseAmount> { new PriorityDiscountBaseAmount(19.99m) }
                        }
                    });

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have 2 discounts");
                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(offerIdOfferCapP99, resultLine.DiscountLines[0].OfferId, "Verify offer P99" + resultLine.ItemId);
                        Assert.AreEqual(offerIdOfferP77, resultLine.DiscountLines[1].OfferId, "Verify offer P77" + resultLine.ItemId);
                    }
                    else
                    {
                        Assert.AreEqual(offerIdOfferP77, resultLine.DiscountLines[0].OfferId, "Verify offer P77" + resultLine.ItemId);
                        Assert.AreEqual(offerIdOfferEXTDO43CP, resultLine.DiscountLines[1].OfferId, "Verify offer P0" + resultLine.ItemId);
                        Assert.AreEqual(percentageEXTDO43CP, resultLine.DiscountLines[1].Percentage, "Verify % for P0" + resultLine.ItemId);
                    }
                }
            }

            /// <summary>Discount base amount reduction given an amount cap offer with two items participating in the 30USD cap.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_TwoItemsAdjustAmountCap99Offer77AmountCap0()
            {
                // Arrange.
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(
                    new BaseReductionForAmountCapDiscountBaseAmountCalculator());

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("sherpa-zrg-general-inco");
                List<string> priceGroups = new List<string>()
                {
                    ContosoTestCommonData.PriceGroupAmountCap01CP99,
                    ContosoTestCommonData.PriceGroupAmountCap03CP,
                    TestFoundationCommonData.PriceGroupTestOffer28CP77,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine.Price = 119.99M;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0057);
                salesLine2.Price = 109.99M;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0121);
                salesLine3.Price = 89.99M;
                salesLine3.Quantity = 3m;

                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);

                string offerIdOfferCapP99 = ContosoTestCommonData.OfferIdAmountCap01CP99;
                string offerIdOfferP77 = TestFoundationCommonData.OfferIdTestOffer28CP77;
                string offerIdOfferEXTDO43CP = ContosoTestCommonData.OfferIdAmountCap03CP;
                decimal percentageEXTDO43CP = localHelper.GetDiscountOfferValueByCategory(offerIdOfferEXTDO43CP, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategorySoccer);
                decimal percentageP77 = localHelper.GetDiscountOfferValueByCategory(offerIdOfferP77, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategoryCricket);

                // Act.
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                    transaction,
                    priceContext,
                    new Dictionary<string, List<PriorityDiscountBaseAmount>>(StringComparer.OrdinalIgnoreCase)
                    {
                        {
                            salesLine.LineId,
                            new List<PriorityDiscountBaseAmount> { new PriorityDiscountBaseAmount(99, 67.82m) }
                        },
                        {
                            salesLine2.LineId,
                            new List<PriorityDiscountBaseAmount> { new PriorityDiscountBaseAmount(99, 62.16m) }
                        },
                    });

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have 2 discounts");
                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(offerIdOfferCapP99, resultLine.DiscountLines[0].OfferId, "Verify offer P99" + resultLine.ItemId);
                        Assert.AreEqual(offerIdOfferP77, resultLine.DiscountLines[1].OfferId, "Verify offer P77" + resultLine.ItemId);
                    }
                    else if (string.Equals(TestFoundationCommonData.ItemId0057, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(offerIdOfferCapP99, resultLine.DiscountLines[0].OfferId, "Verify offer P99" + resultLine.ItemId);
                        Assert.AreEqual(offerIdOfferP77, resultLine.DiscountLines[1].OfferId, "Verify offer P77" + resultLine.ItemId);
                        Assert.AreEqual(percentageP77, resultLine.DiscountLines[1].Percentage, "Verify % for P77" + resultLine.ItemId);
                    }
                    else
                    {
                        Assert.AreEqual(offerIdOfferP77, resultLine.DiscountLines[0].OfferId, "Verify offer P77" + resultLine.ItemId);
                        Assert.AreEqual(offerIdOfferEXTDO43CP, resultLine.DiscountLines[1].OfferId, "Verify offer P0" + resultLine.ItemId);
                        Assert.AreEqual(percentageEXTDO43CP, resultLine.DiscountLines[1].Percentage, "Verify % for P0" + resultLine.ItemId);
                    }
                }
            }

            /// <summary>Discount base amount reduction given an amount cap offer and "free money amount".</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_FreeMoneyAmountAndAmountCapFirstLineCapped()
            {
                // Arrange.
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(
                    new BaseReductionForAmountCapDiscountBaseAmountCalculator());
                PricingEngineExtensionRepository.RegisterDiscountableItemGroupKeyConstructor(
                    new FreeMoneyAmountDiscountableItemGroupKeyConstructor());

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("sherpa-zrg-general-inco");
                List<string> priceGroups = new List<string>()
                {
                    ContosoTestCommonData.PriceGroupAmountCap01CP99,
                    ContosoTestCommonData.PriceGroupAmountCap03CP,
                    TestFoundationCommonData.PriceGroupTestOffer28CP77,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                decimal freeAmount = 2.5m;
                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine.Price = 119.99M;
                salesLine.SetProperty(FreeMoneyAmountDiscountableItemGroupKeyConstructor.FreeMoneyAmountPropertyName, freeAmount);

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0121);
                salesLine2.Price = 89.99M;
                salesLine2.Quantity = 3m;

                string offerIdOfferCapP99 = ContosoTestCommonData.OfferIdAmountCap01CP99;
                string offerIdOfferP77 = TestFoundationCommonData.OfferIdTestOffer28CP77;
                string offerIdOfferEXTDO43CP = ContosoTestCommonData.OfferIdAmountCap03CP;
                decimal percentageEXTDO43CP = localHelper.GetDiscountOfferValueByCategory(offerIdOfferEXTDO43CP, TestFoundationCommonData.RetailCategoryHierarchy, TestFoundationCommonData.CategorySoccer);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                List<PriorityDiscountBaseAmount> priorityDiscountBaseAmounts = new List<PriorityDiscountBaseAmount>();
                priorityDiscountBaseAmounts.Add(new PriorityDiscountBaseAmount(salesLine.Price - freeAmount));
                priorityDiscountBaseAmounts.Add(new PriorityDiscountBaseAmount(99, salesLine.Price - (freeAmount + 100m)));

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                    transaction,
                    priceContext,
                    new Dictionary<string, List<PriorityDiscountBaseAmount>>(StringComparer.OrdinalIgnoreCase) { { salesLine.LineId, priorityDiscountBaseAmounts } });

                foreach (SalesLine resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have 2 discounts");
                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(offerIdOfferCapP99, resultLine.DiscountLines[0].OfferId, "Verify offer P99" + resultLine.ItemId);
                        Assert.AreEqual(offerIdOfferP77, resultLine.DiscountLines[1].OfferId, "Verify offer P77" + resultLine.ItemId);
                    }
                    else
                    {
                        Assert.AreEqual(offerIdOfferP77, resultLine.DiscountLines[0].OfferId, "Verify offer P77" + resultLine.ItemId);
                        Assert.AreEqual(offerIdOfferEXTDO43CP, resultLine.DiscountLines[1].OfferId, "Verify offer P0" + resultLine.ItemId);
                        Assert.AreEqual(percentageEXTDO43CP, resultLine.DiscountLines[1].Percentage, "Verify % for P0" + resultLine.ItemId);
                    }
                }
            }

            /// <summary>Discount base amount reduction given an amount cap offer and "free money amount".</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_FreeMoneyAmountAndAmountCapSecondLineCapped()
            {
                // Arrange.
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(
                    new BaseReductionForAmountCapDiscountBaseAmountCalculator());
                PricingEngineExtensionRepository.RegisterDiscountableItemGroupKeyConstructor(
                    new FreeMoneyAmountDiscountableItemGroupKeyConstructor());

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("sherpa-zrg-general-inco");
                List<string> priceGroups = new List<string>()
                {
                    ContosoTestCommonData.PriceGroupAmountCap01CP99,
                    ContosoTestCommonData.PriceGroupAmountCap03CP,
                    TestFoundationCommonData.PriceGroupTestOffer28CP77,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                decimal freeAmount1 = 40m;
                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0060);
                salesLine.Price = 119.99M;
                salesLine.SetProperty(FreeMoneyAmountDiscountableItemGroupKeyConstructor.FreeMoneyAmountPropertyName, freeAmount1);

                decimal freeAmount2 = 10m;
                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0121);
                salesLine2.Price = 199.99M;
                salesLine2.SetProperty(FreeMoneyAmountDiscountableItemGroupKeyConstructor.FreeMoneyAmountPropertyName, freeAmount2);
                salesLine2.Quantity = 3m;

                string offerIdOfferCapP99 = ContosoTestCommonData.OfferIdAmountCap01CP99;
                string offerIdOfferP77 = TestFoundationCommonData.OfferIdTestOffer28CP77;
                string offerIdOfferEXTDO43CP = ContosoTestCommonData.OfferIdAmountCap03CP;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                List<PriorityDiscountBaseAmount> priorityDiscountBaseAmountsLine1 = new List<PriorityDiscountBaseAmount>
                {
                    new PriorityDiscountBaseAmount(salesLine.Price - freeAmount1),
                    new PriorityDiscountBaseAmount(99, decimal.Zero)
                };

                List<PriorityDiscountBaseAmount> priorityDiscountBaseAmountsLine2 = new List<PriorityDiscountBaseAmount>
                {
                    new PriorityDiscountBaseAmount(salesLine2.Price - freeAmount2),
                };

                var resultLines = transaction.SalesLines;

                var salesLineIdToPriorityDiscountBaseAmountsLookup =
                    new Dictionary<string, List<PriorityDiscountBaseAmount>>(StringComparer.OrdinalIgnoreCase)
                    {
                        { resultLines[0].LineId, priorityDiscountBaseAmountsLine1 },
                        { resultLines[1].LineId, priorityDiscountBaseAmountsLine2 },
                        { resultLines[2].LineId, priorityDiscountBaseAmountsLine2 }
                    };

                SalesTransactionVerification.VerifySalesTransactionDataConsistencyCompoundAcrossPriority(
                    transaction,
                    priceContext,
                    salesLineIdToPriorityDiscountBaseAmountsLookup);

                foreach (SalesLine resultLine in resultLines)
                {
                    if (string.Equals(TestFoundationCommonData.ItemId0060, resultLine.ItemId, StringComparison.OrdinalIgnoreCase))
                    {
                        Assert.AreEqual(1, resultLine.DiscountLines.Count, "Should have 1 discounts");
                        Assert.AreEqual(offerIdOfferCapP99, resultLine.DiscountLines[0].OfferId, "Verify offer P99" + resultLine.ItemId);
                    }
                    else
                    {
                        Assert.AreEqual(offerIdOfferP77, resultLine.DiscountLines[0].OfferId, "Verify offer P77" + resultLine.ItemId);
                        Assert.AreEqual(offerIdOfferEXTDO43CP, resultLine.DiscountLines[1].OfferId, "Verify offer P0" + resultLine.ItemId);
                        Assert.AreEqual(50m, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerIdOfferEXTDO43CP, null), "Discount should have been capped.");
                    }
                }
            }

            #endregion
        }
    }
}