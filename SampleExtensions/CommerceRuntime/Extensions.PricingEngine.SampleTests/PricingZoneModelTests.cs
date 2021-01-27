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
        using System.Collections.Generic;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;
        using Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine;
        using Microsoft.VisualStudio.TestTools.UnitTesting;

        /// <summary>
        /// Component tests for <see href="https://blogs.msdn.microsoft.com/retaillife/2017/01/07/retail-discount-concurrency-control-pricing-zone/">concurrency control model: best price and compound within priority and no compound across (a.k.a. pricing zone)</see>.
        /// </summary>
        [TestClass]
        [DeploymentItem(@"TestDataManager\SampleData", @"TestDataManager\SampleData")]
        public class PricingZoneModelTests : PricingBaseTests
        {
            #region discount offer line filter.

            /// <summary>Test offer discount with line filter.</summary>
            [TestCategory(ContosoTestCategory.CategoryLineFilter)]
            [TestMethod]
            public void PricingZoneModel_Test_OfferDiscountWithLineFilter()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();
                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("concurrency-bp-qty-vs-offer-dealprice");
                localHelper.AddPriceGroupsToTransaction(transaction, new List<string>() { ContosoTestCommonData.PriceGroupOfferLineFilter01BP });

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0025);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 1m;

                SalesLine salesLine2 = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0055);
                salesLine2.Price = 66.99M;
                salesLine2.Quantity = 2m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                SalesLine resultLine1 = transaction.SalesLines[0];
                SalesLine resultLine2 = transaction.SalesLines[1];

                Assert.AreEqual(0, resultLine1.DiscountLines.Count, "Should not have found a discount for " + resultLine1.ItemId);

                Assert.AreEqual(1, resultLine2.DiscountLines.Count, "Should have found a discount for " + resultLine1.ItemId);
                DiscountLine discountLine = resultLine2.DiscountLines[0];
                Assert.AreEqual(ContosoTestCommonData.OfferIdOfferLineFilter01BP, discountLine.OfferId, "Verify offer id");
            }

            #endregion

            #region amount cap in pricing zone.

            /// <summary>Compound simple discount %-off with compound amount cap %-off capped.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void PricingZoneModel_Test_CompoundSimpleDiscountAndCompoundedAmountCapCapped()
            {
                // Arrange.
                const int EXTDO43CPAmountCap = 50;

                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupsToTransaction(transaction, new List<string>() { ContosoTestCommonData.PriceGroupAmountCap03CP, TestFoundationCommonData.PriceGroupTestOffer33CP });

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0123);
                salesLine.Price = 100m;
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

                foreach (var resultLine in transaction.SalesLines)
                {
                    Assert.AreEqual(2, resultLine.DiscountLines.Count, "2 discounts");
                    Assert.AreEqual(TestFoundationCommonData.OfferIdTestOffer33CP, resultLine.DiscountLines[0].OfferId, "Verify offer id");
                    Assert.AreEqual(ContosoTestCommonData.OfferIdAmountCap03CP, resultLine.DiscountLines[1].OfferId, "Verify offer id");
                }

                Assert.AreEqual(EXTDO43CPAmountCap, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, ContosoTestCommonData.OfferIdAmountCap03CP, null), "Verify discount amount");
            }

            /// <summary>Best price simple discount %-off with compound amount cap %-off not applied.</summary>
            [TestCategory(ContosoTestCategory.CategoryAmountCap)]
            [TestMethod]
            public void PricingZoneModel_Test_BestPriceSimpleDiscountWithCompoundAmountCapNotApplied()
            {
                // Arrange.
                ContosoTestPricingDataManager localHelper = new ContosoTestPricingDataManager();

                SalesTransaction transaction = TestFoundationSalesTransactionHelper.CreateSalesTransaction("amount-cap");
                localHelper.AddPriceGroupsToTransaction(transaction, new List<string>() { ContosoTestCommonData.PriceGroupAmountCap03CP, TestFoundationCommonData.PriceGroupTestOffer25BP });

                SalesLine salesLine = TestFoundationSalesTransactionHelper.ConstructSalesLine(transaction, TestFoundationCommonData.ItemId0123);
                salesLine.Price = 69.99M;
                salesLine.Quantity = 3m;

                // Act.
                PriceContext priceContext = TestFoundationPriceContextHelper.CreatePriceContext(localHelper, transaction);
                PricingEngine.CalculateDiscountsForLines(
                    localHelper,
                    transaction,
                    priceContext);
                PricingEngineTracer.SumUpAndTraceSalesTransaction(transaction);

                // Assert.
                SalesTransactionVerification.VerifySalesTransactionDataConsistency(transaction, priceContext);

                Assert.AreEqual(decimal.Zero, TestFoundationSalesTransactionHelper.GetTotalPeriodicDiscount(transaction, ContosoTestCommonData.OfferIdAmountCap03CP, null), "Verify discount amount");
                Assert.AreEqual(1, salesLine.DiscountLines.Count, "one discount only");
                Assert.AreEqual(TestFoundationCommonData.OfferIdTestOffer25BP, salesLine.DiscountLines[0].OfferId, "Verify offer id");
            }

            #endregion
        }
    }
}