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
    namespace Commerce.Runtime.CommonFrance
    {
        using System.Collections.Generic;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Retail sales transaction registration interface.
        /// </summary>
        public interface ISalesTransactionRegistrationStrategy
        {
            /// <summary>
            /// Retrieve sales lines from retail transaction.
            /// </summary>
            /// <param name="transaction">Retail sales transaction to retrieve sales lines from.</param>
            /// <returns>A collection of sales lines to be signed.</returns>
            IEnumerable<SalesLine> GetSaleLines(SalesTransaction transaction);

            /// <summary>
            /// Determines whether the retail sales transaction should be registered.
            /// </summary>
            /// <param name="transaction">The retail sales transaction to check.</param>
            /// <returns>Returns True if retail sales transaction should be registered, return False otherwise.</returns>
            bool IsRegistrationRequired(SalesTransaction transaction);

            /// <summary>
            /// Retrieves build number from <see cref="SalesTransaction"/>.
            /// </summary>
            /// <param name="transaction"><see cref="SalesTransaction"/> to be processed.</param>
            /// <returns>String containing build number if it was successfully retrieved, empty string otherwise.</returns>
            string GetBuildNumber(SalesTransaction transaction);
        }
    }
}
