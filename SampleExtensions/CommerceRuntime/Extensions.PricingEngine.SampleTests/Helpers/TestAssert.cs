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
        using Microsoft.Dynamics.Commerce.Runtime.PricingEngine.TestFoundation;
        using Microsoft.VisualStudio.TestTools.UnitTesting;

        /// <summary>
        /// Test assert.
        /// </summary>
        public class TestAssert : IAssert
        {
            /// <summary>
            /// Checks if they are equal.
            /// </summary>
            /// <param name="expected">The expected.</param>
            /// <param name="actual">The actual.</param>
            /// <param name="message">The message.</param>
            public void AreEqual(string expected, string actual, string message)
            {
                Assert.AreEqual(expected, actual, message);
            }

            /// <summary>
            /// Checks if they are equal.
            /// </summary>
            /// <param name="expected">The expected.</param>
            /// <param name="actual">The actual.</param>
            /// <param name="message">The message.</param>
            public void AreEqual(decimal expected, decimal actual, string message)
            {
                Assert.AreEqual(expected, actual, message);
            }

            /// <summary>
            /// Checks if they are equal.
            /// </summary>
            /// <param name="expected">The expected.</param>
            /// <param name="actual">The actual.</param>
            /// <param name="message">The message.</param>
            public void AreEqual(int expected, int actual, string message)
            {
                Assert.AreEqual(expected, actual, message);
            }

            /// <summary>
            /// Checks if they are equal.
            /// </summary>
            /// <param name="expected">The expected.</param>
            /// <param name="actual">The actual.</param>
            /// <param name="ignoreCase">A value indicating whether to ignore case.</param>
            /// <param name="message">The message.</param>
            public void AreEqual(string expected, string actual, bool ignoreCase, string message)
            {
                Assert.AreEqual(expected, actual, ignoreCase, message);
            }

            /// <summary>
            /// Checks if they are not equal.
            /// </summary>
            /// <param name="expected">The expected.</param>
            /// <param name="actual">The actual.</param>
            /// <param name="message">The message.</param>
            public void AreNotEqual(decimal expected, decimal actual, string message)
            {
                Assert.AreNotEqual(expected, actual, message);
            }

            /// <summary>
            /// Checks whether it is false.
            /// </summary>
            /// <param name="condition">The condition.</param>
            /// <param name="message">The message.</param>
            public void IsFalse(bool condition, string message)
            {
                Assert.IsFalse(condition, message);
            }

            /// <summary>
            /// Checks whether it is true.
            /// </summary>
            /// <param name="condition">The condition.</param>
            /// <param name="message">The message.</param>
            public void IsTrue(bool condition, string message)
            {
                Assert.IsTrue(condition, message);
            }
        }
    }
}