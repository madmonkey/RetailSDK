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
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Framework;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;
        using Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine;
        using Microsoft.VisualStudio.TestTools.UnitTesting;
        using Moq;

        /// <summary>
        /// Pricing base tests.
        /// </summary>
        /// <remarks>
        /// See <see href="https://blogs.msdn.microsoft.com/retaillife/2017/04/12/dynamics-retail-discount-extensibility-sample-test/">Dynamics Retail Discount Extensibility – Sample Test</see>.
        /// </remarks>
        public class PricingBaseTests
        {
            /// <summary>
            /// Initializes static members of the <see cref="PricingBaseTests"/> class.
            /// </summary>
            static PricingBaseTests()
            {
                PricingBaseTests.MockExtensibleEnumerationsInitializer();
            }

            private static void MockExtensibleEnumerationsInitializer()
            {
                List<KeyValuePair<string, int>> extensionValues = new List<KeyValuePair<string, int>>(ExtensiblePeriodicDiscountOfferTypeHelper.DefaultValues)
                {
                    new KeyValuePair<string, int>("AmountCap", 7),
                    new KeyValuePair<string, int>("OfferQuantityControlByProduct", 8),
                };

                ExtensiblePeriodicDiscountOfferTypeHelper.InitializeEnum(extensionValues);

                var initializer = new Mock<IExtensibleEnumerationInitializer>();
                ExtensibleEnumeration.Initializer = initializer.Object;

                initializer
                    .Setup(i => i.InitializeExtensibleEnumeration(typeof(ExtensiblePeriodicDiscountOfferType)))
                    .Callback(() => ExtensiblePeriodicDiscountOfferTypeHelper.InitializeEnum(extensionValues));
            }

            /// <summary>Initializes for each test.</summary>
            [TestInitialize]
            public virtual void TestInitialize()
            {
                SalesTransactionVerification.Assert = new TestAssert();
                PricingEngineTracer.Tracer = new TestTracer();

                // Register new discount types.
                // Register here other plug-ins as well if you have any.
                PricingEngineExtensionRepository.RegisterDiscountPackage(new DiscountPackageOfferLineFilter(new ContosoDataAccessorOfferLineFilter()));
                PricingEngineExtensionRepository.RegisterDiscountPackage(new DiscountPackageAmountCap(new ContosoDataAccessorAmountCap()));

                Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine.SimpleProfiler.Enabled = true;
                Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine.SimpleProfiler.RecordTime = true;
            }

            /// <summary>Cleans up after each test.</summary>
            [TestCleanup]
            public virtual void TestCleanup()
            {
                Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine.SimpleProfiler.Enabled = false;
                Microsoft.Dynamics.Commerce.Runtime.Services.PricingEngine.SimpleProfiler.RecordTime = false;

                PricingEngineExtensionRepository.CleanupPricingEngineExtensions();
            }
        }
    }
}
