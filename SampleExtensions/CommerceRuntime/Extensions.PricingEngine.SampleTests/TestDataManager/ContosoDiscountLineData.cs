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
        using System.Xml.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;

        /// <summary>Extension discount line data.</summary>
        /// <remarks>
        /// See <see href="https://blogs.msdn.microsoft.com/retaillife/2017/04/12/dynamics-retail-discount-extensibility-sample-test/">Dynamics Retail Discount Extensibility – Sample Test</see>.
        /// </remarks>
        public class ContosoDiscountLineData : PeriodicDiscountLineData
        {
            /// <summary>Gets or sets validation period Id for extension.</summary>
            public string ContosoPeriodId { get; set; }

            /// <summary>Gets or sets validation period for extension.</summary>
            [XmlIgnore]
            public ValidationPeriod ContosoPeriod { get; set; }
        }
    }
}