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
        using System.Diagnostics;
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;

        /// <summary>
        /// Test tracer.
        /// </summary>
        public class TestTracer : ITracer
        {
            /// <summary>
            /// Indents the line.
            /// </summary>
            public void Indent()
            {
                Trace.Indent();
            }

            /// <summary>
            /// Unindents the line.
            /// </summary>
            public void Unindent()
            {
                Trace.Unindent();
            }

            /// <summary>
            /// Writes the message in a line.
            /// </summary>
            /// <param name="message">The message.</param>
            public void WriteLine(string message)
            {
                Trace.WriteLine(message);
            }
        }
    }
}