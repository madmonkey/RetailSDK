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
        using Microsoft.VisualStudio.TestTools.UnitTesting;

        /// <summary>Extensions compound compete with discount base amount functional tests.</summary>
        [TestClass]
        [DeploymentItem(@"TestDataManager\SampleData", @"TestDataManager\SampleData")]
        public class ThresholdDiscountAdjustBaseAmountCalculatorFunctionalTests : PricingBaseTests
        {
            /// <summary>Extension calculator adjusts base amount for threshold, current discount amount lower then new base amount.</summary>
            [TestCategory(ContosoTestCategory.CategoryThresholdBaseAmount)]
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBaseAmountThreshholdDiscountWithTwoSimpleDiscounts()
            {
                // Arrange.
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(new ThresholdDiscountAdjustBaseAmountCalculator(TestFoundationCommonData.OfferSPCTDSCT1P9));

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("sherpa-zrg-general-inco");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupSPCTDSCT1,
                    TestFoundationCommonData.PriceGroupSPCTDSCT2,
                    TestFoundationCommonData.PriceGroupSPCTDSCT3,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0140);
                salesLine.Price = 2660.80M;

                string offerIdSPCTDSCT1P9 = TestFoundationCommonData.OfferSPCTDSCT1P9;
                string offerIdSPCTDSCT2P3 = TestFoundationCommonData.OfferSPCTDSCT2P3;
                string offerIdThresholdSPCTDSCT3P2 = TestFoundationCommonData.OfferSPCTDSCT3P2;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                SalesLine resultLine = transaction.SalesLines[0];

                // Assert
                Assert.AreEqual(3, resultLine.DiscountLines.Count, "Should have 3 discounts");
                Assert.AreEqual(TestFoundationCommonData.ItemId0140, resultLine.ItemId, "Item 0140 should present in the cart");

                DiscountLine thresholdLine = resultLine.DiscountLines.Where(d => d.OfferId == offerIdThresholdSPCTDSCT3P2).First();
                Assert.AreEqual(offerIdThresholdSPCTDSCT3P2, thresholdLine.OfferId, "Verify threshold offer " + resultLine.ItemId);
                Assert.AreEqual(50m, thresholdLine.EffectiveAmount, "Verify effective amount for threshold offer" + resultLine.ItemId);

                DiscountLine offerIdSPCTDSCT1Line = resultLine.DiscountLines.Where(d => d.OfferId == offerIdSPCTDSCT1P9).First();
                Assert.AreEqual(offerIdSPCTDSCT1P9, offerIdSPCTDSCT1Line.OfferId, "Verify simple offer " + resultLine.ItemId);
                Assert.AreEqual(1m, offerIdSPCTDSCT1Line.EffectiveAmount, "Verify effective amount for simple offer" + resultLine.ItemId);

                DiscountLine offerIdSPCTDSCT2Line = resultLine.DiscountLines.Where(d => d.OfferId == offerIdSPCTDSCT2P3).First();
                Assert.AreEqual(offerIdSPCTDSCT2P3, offerIdSPCTDSCT2Line.OfferId, "Verify simple offer " + resultLine.ItemId);
                Assert.AreEqual(100m, offerIdSPCTDSCT2Line.EffectiveAmount, "Verify effective amount for simple offer" + resultLine.ItemId);
            }

            /// <summary>Extension calculator adjusts base amount for threshold, current discount amount lower then new base amount.</summary>
            [TestCategory(ContosoTestCategory.CategoryThresholdBaseAmount)]
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBaseAmountThreshholdDiscountWithOneSimpleDiscount()
            {
                // Arrange.
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(new ThresholdDiscountAdjustBaseAmountCalculator(TestFoundationCommonData.OfferSPCTDSCT1P9));

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("sherpa-zrg-general-inco");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupSPCTDSCT1,
                    TestFoundationCommonData.PriceGroupSPCTDSCT3,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0140);
                salesLine.Price = 2660.80M;

                string offerIdSPCTDSCT1P9 = TestFoundationCommonData.OfferSPCTDSCT1P9;
                string offerIdThresholdSPCTDSCT3P2 = TestFoundationCommonData.OfferSPCTDSCT3P2;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                SalesLine resultLine = transaction.SalesLines[0];

                // Assert
                Assert.AreEqual(2, resultLine.DiscountLines.Count, "Should have 2 discounts");
                Assert.AreEqual(TestFoundationCommonData.ItemId0140, resultLine.ItemId, "Item 0140 should present in the cart");

                DiscountLine thresholdLine = resultLine.DiscountLines.Where(d => d.OfferId == offerIdThresholdSPCTDSCT3P2).First();

                Assert.AreEqual(offerIdThresholdSPCTDSCT3P2, thresholdLine.OfferId, "Verify simple offer " + resultLine.ItemId);
                Assert.AreEqual(50, thresholdLine.EffectiveAmount, "Verify effective amount for simple offer" + resultLine.ItemId);

                DiscountLine offerIdSPCTDSCT1Line = resultLine.DiscountLines.Where(d => d.OfferId == offerIdSPCTDSCT1P9).First();
                Assert.AreEqual(offerIdSPCTDSCT1P9, offerIdSPCTDSCT1Line.OfferId, "Verify simple offer " + resultLine.ItemId);
                Assert.AreEqual(1m, offerIdSPCTDSCT1Line.EffectiveAmount, "Verify effective amount for simple offer" + resultLine.ItemId);
            }

            /// <summary>Extension calculator adjusts base amount for threshold, current discount amount greater then new base amount..</summary>
            [TestCategory(ContosoTestCategory.CategoryThresholdBaseAmount)]
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBaseAmountThreshholdDiscountWithGreaterAmountInCustomizationDiscount()
            {
                // Arrange.
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(new ThresholdDiscountAdjustBaseAmountCalculator(TestFoundationCommonData.OfferSPCTDSCT4P9));

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.CompoundOnOriginalPrice);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("sherpa-zrg-general-inco");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupSPCTDSCT4,
                    TestFoundationCommonData.PriceGroupSPCTDSCT2,
                    TestFoundationCommonData.PriceGroupSPCTDSCT3,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0140);
                salesLine.Price = 2660.80M;

                string offerIdSPCTDSCT4P9 = TestFoundationCommonData.OfferSPCTDSCT4P9;
                string offerIdSPCTDSCT2P3 = TestFoundationCommonData.OfferSPCTDSCT2P3;
                string offerIdThresholdSPCTDSCT3P2 = TestFoundationCommonData.OfferSPCTDSCT3P2;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesLine resultLine = transaction.SalesLines[0];

                Assert.AreEqual(3, resultLine.DiscountLines.Count, "Should have 3 discounts");
                Assert.AreEqual(TestFoundationCommonData.ItemId0140, resultLine.ItemId, "Item 0140 should present in the cart");

                DiscountLine thresholdLine = resultLine.DiscountLines.Where(d => d.OfferId == offerIdThresholdSPCTDSCT3P2).First();

                Assert.AreEqual(offerIdThresholdSPCTDSCT3P2, thresholdLine.OfferId, "Verify threshold offer " + resultLine.ItemId);
                Assert.AreEqual(50, thresholdLine.EffectiveAmount, "Verify effective amount for threshold offer" + resultLine.ItemId);

                DiscountLine offerIdSPCTDSCT4Line = resultLine.DiscountLines.Where(d => d.OfferId == offerIdSPCTDSCT4P9).First();
                Assert.AreEqual(offerIdSPCTDSCT4P9, offerIdSPCTDSCT4Line.OfferId, "Verify simple offer " + resultLine.ItemId);
                Assert.AreEqual(1500m, offerIdSPCTDSCT4Line.EffectiveAmount, "Verify effective amount for simple offer" + resultLine.ItemId);

                DiscountLine offerIdSPCTDSCT2Line = resultLine.DiscountLines.Where(d => d.OfferId == offerIdSPCTDSCT2P3).First();
                Assert.AreEqual(offerIdSPCTDSCT2P3, offerIdSPCTDSCT2Line.OfferId, "Verify simple offer " + resultLine.ItemId);
                Assert.AreEqual(100m, offerIdSPCTDSCT2Line.EffectiveAmount, "Verify effective amount for simple offer" + resultLine.ItemId);
            }

            /// <summary>Extension calculator adjusts base amount for threshold, current discount amount lower then new base amount, with compound behavior.</summary>
            [TestCategory(ContosoTestCategory.CategoryThresholdBaseAmount)]
            [TestMethod]
            public void CompeteModelOffOriginalPriceDiscountBaseAmount_Test_AdjustBaseAmountThreshholdDiscountWithGreaterAmountInCustomizationDiscountAndCompoundBehavior()
            {
                // Arrange.
                PricingEngineExtensionRepository.RegisterPriorityDiscountBaseAmountCalculator(new ThresholdDiscountAdjustBaseAmountCalculator(TestFoundationCommonData.OfferSPCTDSCT4P9));

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                localHelper.UpdateDiscountConcurrencyControlModel(DiscountConcurrencyControlModel.CompeteWithinPriorityCompoundAcross);
                localHelper.UpdateDiscountCompoundBehavior(DiscountCompoundBehavior.Compound);
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("sherpa-zrg-general-inco");
                List<string> priceGroups = new List<string>()
                {
                    TestFoundationCommonData.PriceGroupSPCTDSCT4,
                    TestFoundationCommonData.PriceGroupSPCTDSCT2,
                    TestFoundationCommonData.PriceGroupSPCTDSCT3,
                };
                localHelper.AddPriceGroupsToTransaction(transaction, priceGroups);

                decimal quantity = 2;
                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0140);
                salesLine.Quantity = quantity;
                salesLine.Price = 2660.80M;

                string offerIdSPCTDSCT4P9 = TestFoundationCommonData.OfferSPCTDSCT4P9;
                string offerIdSPCTDSCT2P3 = TestFoundationCommonData.OfferSPCTDSCT2P3;
                string offerIdThresholdSPCTDSCT3P2 = TestFoundationCommonData.OfferSPCTDSCT3P2;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesLine resultLine = transaction.SalesLines[0];

                Assert.AreEqual(3, resultLine.DiscountLines.Count, "Should have 3 discounts");
                Assert.AreEqual(TestFoundationCommonData.ItemId0140, resultLine.ItemId, "Item 0140 should present in the cart");

                DiscountLine thresholdLine = resultLine.DiscountLines.Where(d => d.OfferId == offerIdThresholdSPCTDSCT3P2).First();

                Assert.AreEqual(offerIdThresholdSPCTDSCT3P2, thresholdLine.OfferId, "Verify threshold offer " + resultLine.ItemId);
                Assert.AreEqual(50m * quantity, thresholdLine.EffectiveAmount, "Verify effective amount for threshold offer" + resultLine.ItemId);

                DiscountLine offerIdSPCTDSCT4Line = resultLine.DiscountLines.Where(d => d.OfferId == offerIdSPCTDSCT4P9).First();
                Assert.AreEqual(offerIdSPCTDSCT4P9, offerIdSPCTDSCT4Line.OfferId, "Verify simple offer " + resultLine.ItemId);
                Assert.AreEqual(1500m * quantity, offerIdSPCTDSCT4Line.EffectiveAmount, "Verify effective amount for simple offer" + resultLine.ItemId);

                DiscountLine offerIdSPCTDSCT2Line = resultLine.DiscountLines.Where(d => d.OfferId == offerIdSPCTDSCT2P3).First();
                Assert.AreEqual(offerIdSPCTDSCT2P3, offerIdSPCTDSCT2Line.OfferId, "Verify simple offer " + resultLine.ItemId);
                Assert.AreEqual(100m * quantity, offerIdSPCTDSCT2Line.EffectiveAmount, "Verify effective amount for simple offer" + resultLine.ItemId);
            }
        }
    }
}
