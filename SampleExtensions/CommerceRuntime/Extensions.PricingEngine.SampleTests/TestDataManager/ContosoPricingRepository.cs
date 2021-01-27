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
        using System.IO;
        using System.Xml.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;

        /// <summary>Pricing extension repository.</summary>
        /// <remarks>
        /// See <see href="https://blogs.msdn.microsoft.com/retaillife/2017/04/12/dynamics-retail-discount-extensibility-sample-test/">Dynamics Retail Discount Extensibility – Sample Test</see>.
        /// </remarks>
        public static class ContosoPricingRepository
        {
            /// <summary>
            /// Gets all extension price groups.
            /// </summary>
            /// <returns>All extension price groups.</returns>
            public static ICollection<PriceGroupData> GetAllExtensionPriceGroups()
            {
                return Deserialize<List<PriceGroupData>>(@"TestDataManager/SampleData/ContosoPriceGroups.xml");
            }

            /// <summary>
            /// Gets all discount offers with line filter.
            /// </summary>
            /// <returns>All discount offers with line filter.</returns>
            public static ICollection<ContosoDiscountData> GetAllDiscountOffersWithLineFilter()
            {
                return DeserializeDiscount(@"TestDataManager/SampleData/DiscountOffersLineFilter.xml");
            }

            /// <summary>
            /// Gets all amount cap discounts.
            /// </summary>
            /// <returns>All amount cap discounts.</returns>
            public static ICollection<ContosoDiscountData> GetAllAmountCapDiscounts()
            {
                return DeserializeDiscount(@"TestDataManager/SampleData/DiscountOffersAmountCap.xml");
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security.Xml", "CA3070:UseXmlReaderForDeserialize", Justification = "Test")]
            private static T Deserialize<T>(string fileName)
            {
                XmlSerializer deserializer = new XmlSerializer(typeof(T));
                using (TextReader textReader = new StreamReader(fileName))
                {
                    return (T)deserializer.Deserialize(textReader);
                }
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security.Xml", "CA3070:UseXmlReaderForDeserialize", Justification = "Test")]
            private static List<ContosoDiscountData> DeserializeDiscount(string fileName)
            {
                XmlSerializer deserializer = new XmlSerializer(typeof(List<ContosoDiscountData>), new System.Type[] { typeof(ContosoDiscountLineData) });
                using (TextReader textReader = new StreamReader(fileName))
                {
                    return (List<ContosoDiscountData>)deserializer.Deserialize(textReader);
                }
            }
        }
    }
}