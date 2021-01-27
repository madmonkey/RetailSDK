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
    namespace Commerce.RetailProxy.CrossLoyaltySample.Adapters
    {
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.RetailProxy.Adapters;
        using Runtime.CrossLoyaltySample.Messages;

        /// <summary>
        /// Encapsulates extension functionality related to customer management.
        /// </summary>
        internal class CustomerManager : ICustomerManager
        {
            /// <summary>
            /// Gets the cross loyalty card discount for the given loyalty card number.
            /// </summary>
            /// <param name="loyaltyCardNumber">The loyalty card number.</param>
            /// <returns>The cross loyalty discount.</returns>
            public async Task<decimal> GetCrossLoyaltyCardDiscountAction(string loyaltyCardNumber)
            {
                var response = await CommerceRuntimeManager.Runtime.ExecuteAsync<GetCrossLoyaltyCardResponse>(new GetCrossLoyaltyCardRequest(loyaltyCardNumber), null).ConfigureAwait(false);
                return response.Discount;
            }
        }
    }
}
