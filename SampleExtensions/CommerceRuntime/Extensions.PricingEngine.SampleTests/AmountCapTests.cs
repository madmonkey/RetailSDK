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
        using System.Linq;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;
        using Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine;
        using Microsoft.VisualStudio.TestTools.UnitTesting;

        /// <summary>Component tests for discount offer with amount cap.</summary>
        /// <remarks>
        /// This tests the amount cap alone, with all various configurations.
        /// 1. Discount method: offer price, $-off and %-off
        /// 2. Rounding with multiple items, and with split or hold configuration.
        /// 3. Return (not-by-receipt) and mix of sales and return in one transaction.
        /// </remarks>
        [TestClass]
        [DeploymentItem(@"TestDataManager\SampleData", @"TestDataManager\SampleData")]
        [DeploymentItem("Microsoft.Dynamics.Retail.Diagnostics.Sinks.dll")]
        public class AmountCapTests : PricingBaseTests
        {
            #region Basic discount methods %-off, $-off and offer price.

            /// <summary>Percentage off not capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_PercentageOffNotCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 3m;

                var pctOff = localHelper.GetDiscountOfferValueByItem(ContosoTestCommonData.OfferIdAmountCap02BP, salesLine.ItemId, salesLine.InventoryDimensionId);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                Assert.AreEqual(TestFoundationPricingHelper.GetDiscountAmount(salesLine.Price * salesLine.Quantity, pctOff), TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, ContosoTestCommonData.OfferIdAmountCap02BP, null), "Verify discount amount");
            }

            /// <summary>Percentage off capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_PercentageOffCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 5m;
                transaction.SalesLines.Add(salesLine);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");
            }

            /// <summary>Deal price not capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_DealPriceNotCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0142);
                salesLine.Price = 50m;
                salesLine.Quantity = 1m;

                var dealPrice = localHelper.GetDiscountOfferValueByItem(ContosoTestCommonData.OfferIdAmountCap02BP, salesLine.ItemId, salesLine.InventoryDimensionId);
                var expectedDiscountAmount = PricingArithmetics.GetDiscountAmountFromDealPrice(salesLine.Price, dealPrice);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                Assert.AreEqual(expectedDiscountAmount, salesLine.DiscountLines.First().EffectiveAmount, "Verify discount amount");
            }

            /// <summary>Deal price capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_DealPriceCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0142);
                salesLine.Price = 69.99m;
                salesLine.Quantity = 3m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");
            }

            /// <summary>Amount off not capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_AmountOffNotCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

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
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                Assert.AreEqual(amountOff * salesLine.Quantity, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, ContosoTestCommonData.OfferIdAmountCap02BP, null), "Discount was not capped");
            }

            /// <summary>Amount off capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_AmountOffCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = 69.99m;
                salesLine.Quantity = 7m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");
            }

            #endregion

            #region rounding

            /// <summary>Percentage off capped, multi line with different items.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_MultiLineDiffItemPercentageOffCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine1.Price = 69.99M;
                salesLine1.Quantity = 2m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine2.Price = 69.99M;
                salesLine2.Quantity = 1m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0026);
                salesLine3.Price = 69.99M;
                salesLine3.Quantity = 3m;

                var originalSalesLineCount = transaction.SalesLines.Count;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                var afterCalculationSalesLineCount = transaction.SalesLines.Count;

                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");
                Assert.AreNotEqual(originalSalesLineCount, afterCalculationSalesLineCount, "Lines should have been splitted.");
            }

            /// <summary>Percentage off capped, multi line with different items and holding lines together for rounding.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_MultiLineDiffItemPercentageOffCappedHoldTogetherForRounding()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateHoldTogetherForDiscountRounding(true);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine1.Price = 69.99M;
                salesLine1.Quantity = 2m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine2.Price = 69.99M;
                salesLine2.Quantity = 1m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0026);
                salesLine3.Price = 69.99M;
                salesLine3.Quantity = 3m;

                var originalSalesLineCount = transaction.SalesLines.Count;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                var afterCalculationSalesLineCount = transaction.SalesLines.Count;
                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");
                Assert.AreEqual(originalSalesLineCount, afterCalculationSalesLineCount, "Lines should not have been splitted.");
            }

            /// <summary>Percentage off capped, multi line with different scale items.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_MultiLineDiffItemPercentageOffCappedScaleItem()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateHoldTogetherForDiscountRounding(true);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine1.Price = 69.99M;
                salesLine1.Quantity = 2.3m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine2.Price = 69.99M;
                salesLine2.Quantity = 1.6m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0026);
                salesLine3.Price = 69.99M;
                salesLine3.Quantity = 3.27m;

                var originalSalesLineCount = transaction.SalesLines.Count;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                var afterCalculationSalesLineCount = transaction.SalesLines.Count;
                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");
                Assert.AreEqual(originalSalesLineCount, afterCalculationSalesLineCount, "Lines should not have been splitted.");
            }

            /// <summary>Percentage off capped, multi line with same item.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_MultiLineSameItemPercentageOffCapped()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine1.Price = 69.99M;
                salesLine1.Quantity = 2m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine2.Price = 69.99M;
                salesLine2.Quantity = 2m;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine3.Price = 69.99M;
                salesLine3.Quantity = 2m;

                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0026);
                salesLine4.Price = 69.99M;
                salesLine4.Quantity = 3m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");
            }

            #endregion

            #region return

            /// <summary>Sales return with Amount off capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_ReturnAmountOffCapped()
            {
                // Arrange.
                const decimal Price = 69.99m;
                const decimal Quantity = -7m;

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = Price;
                salesLine.Quantity = Quantity;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(-1 * discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");

                var netAmount = transaction.SalesLines.Sum(l => (l.Price * l.Quantity) - l.DiscountAmount);
                Assert.AreEqual((Price * Quantity) + discountData.ContosoDiscountAmountCap, netAmount, "Transaction net amount is not correct");
            }

            /// <summary>Sales return Amount off not capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_ReturnAmountOffNotCapped()
            {
                // Arrange.
                const decimal Price = 69.99m;
                const decimal Quantity = -6m;

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine.Price = Price;
                salesLine.Quantity = Quantity;

                var amountOff = localHelper.GetDiscountOfferValueByItem(ContosoTestCommonData.OfferIdAmountCap02BP, salesLine.ItemId, salesLine.InventoryDimensionId);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                Assert.AreEqual(amountOff * Quantity, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, ContosoTestCommonData.OfferIdAmountCap02BP, null), "Verify discount amount");
            }

            /// <summary>Sales return with Percentage off capped, multi lines with different items.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_ReturnMultiLineDiffItemPercentageOffCapped()
            {
                // Arrange.
                const decimal Line1Qty = -2m;
                const decimal Line2Qty = -1m;
                const decimal Line3Qty = -3m;
                const decimal Price = 69.99M;

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine1.Price = Price;
                salesLine1.Quantity = Line1Qty;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine2.Price = Price;
                salesLine2.Quantity = Line2Qty;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine3.Price = Price;
                salesLine3.Quantity = Line3Qty;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(-1 * discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");

                var netAmount = transaction.SalesLines.Sum(l => (l.Price * l.Quantity) - l.DiscountAmount);
                Assert.AreEqual((Price * (Line1Qty + Line2Qty + Line3Qty)) + discountData.ContosoDiscountAmountCap, netAmount, "Transaction net amount is not correct");
            }

            #endregion

            #region mix of sales and return

            /// <summary>Mixed sales &amp; sales return (more items being bought than being returned) with Percentage off capped, multi lines with different items.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_MixedSalesAndReturnMultiLineDiffItemPercentageOffCapped()
            {
                // Arrange.
                const decimal PriceItem55 = 69.99M;
                const decimal PriceItem56 = 55.71M;
                const decimal Line1Qty = 3m;
                const decimal Line2Qty = -2m;
                const decimal Line3Qty = 8m;
                const decimal Line4Qty = -3m;

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine1.Price = PriceItem55;
                salesLine1.Quantity = Line1Qty;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine2.Price = PriceItem55;
                salesLine2.Quantity = Line2Qty;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine3.Price = PriceItem56;
                salesLine3.Quantity = Line3Qty;

                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine4.Price = PriceItem56;
                salesLine4.Quantity = Line4Qty;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                string offerId = ContosoTestCommonData.OfferIdAmountCap02BP;
                ContosoDiscountData discountData = localHelper.GetRetailDiscountData(offerId) as ContosoDiscountData;
                Assert.AreEqual(discountData.ContosoDiscountAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, offerId, null), "Discount was not capped");

                var netAmount = transaction.SalesLines.Sum(l => (l.Price * l.Quantity) - l.DiscountAmount);

                Assert.AreEqual((PriceItem55 * (Line1Qty + Line2Qty)) + (PriceItem56 * (Line3Qty + Line4Qty)) - discountData.ContosoDiscountAmountCap, netAmount, "Transaction net amount is not correct");
            }

            /// <summary>Mixed sales &amp; sales return (more items being returned than being bought) with Percentage off not capped, multi lines with different items.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void AmountCap_Test_MixedSalesAndReturnMultiLineDiffItemPercentageOffNotCapped()
            {
                // Arrange.
                const decimal PriceItem55 = 69.99M;
                const decimal PriceItem56 = 55.71M;
                const decimal Line1Qty = -3m;
                const decimal Line2Qty = 2m;
                const decimal Line3Qty = -7m;
                const decimal Line4Qty = 3m;

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupToTransaction(transaction, ContosoTestCommonData.PriceGroupAmountCap02BP);

                SalesLine salesLine1 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine1.Price = PriceItem55;
                salesLine1.Quantity = Line1Qty;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine2.Price = PriceItem55;
                salesLine2.Quantity = Line2Qty;

                SalesLine salesLine3 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine3.Price = PriceItem56;
                salesLine3.Quantity = Line3Qty;

                SalesLine salesLine4 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0056);
                salesLine4.Price = PriceItem56;
                salesLine4.Quantity = Line4Qty;

                var amountOffitem55 = localHelper.GetDiscountOfferValueByItem(ContosoTestCommonData.OfferIdAmountCap02BP, salesLine1.ItemId, salesLine1.InventoryDimensionId);
                var amountOffitem56 = localHelper.GetDiscountOfferValueByItem(ContosoTestCommonData.OfferIdAmountCap02BP, salesLine3.ItemId, salesLine3.InventoryDimensionId);

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransactionPriceContext(transaction, priceContext);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);
                Assert.AreEqual((amountOffitem55 * (Line1Qty + Line2Qty)) + (amountOffitem56 * (Line3Qty + Line4Qty)), TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, ContosoTestCommonData.OfferIdAmountCap02BP, null), "Verify discount amount");
            }

            #endregion 
        }
    }
}
