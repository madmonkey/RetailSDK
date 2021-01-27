/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.RetailServer.CrossLoyaltySample
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.Dynamics.Commerce.Runtime.DataModel;
    using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;
    using Contoso.Commerce.Runtime.CrossLoyaltySample.Messages;

    /// <summary>
    /// A customized CustomersController.
    /// </summary>
    [RoutePrefix("Customers")]  // The Customers controller already exists, so no need for an entity binding
    public class MyCustomersController : IController
    {
        /// <summary>
        /// The action to get the cross loyalty card discount.
        /// </summary>
        /// <param name="parameters">The OData action parameters.</param>
        /// <returns>The discount value.</returns>
        [HttpPost]
        [Authorization(CommerceRoles.Customer, CommerceRoles.Employee)]
        public async Task<decimal> GetCrossLoyaltyCardDiscountAction(IEndpointContext context, string LoyaltyCardNumber)
        {
            GetCrossLoyaltyCardResponse resp = await context.ExecuteAsync<GetCrossLoyaltyCardResponse>(new GetCrossLoyaltyCardRequest(LoyaltyCardNumber)).ConfigureAwait(false);
            return resp.Discount;
        }
    }
}
