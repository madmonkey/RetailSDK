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
    namespace Retail.Ecommerce.Web.Storefront.Controllers
    {
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using System.Web.Mvc;
        using Microsoft.Dynamics.Commerce.RetailProxy;
        using Retail.Ecommerce.Sdk.Core;
        using Retail.Ecommerce.Sdk.Core.OperationsHandlers;

        /// <summary>
        /// Wish List Controller.
        /// </summary>
        public class WishListController : WebApiControllerBase
        {
            /// <summary>
            /// Gets the specified wish list.
            /// </summary>
            /// <param name="wishListId">The wish list identifier.</param>
            /// <returns>A response containing the wish list.</returns>
            public async Task<ActionResult> GetWishList(long wishListId)
            {
                EcommerceContext ecommerceContext = ServiceUtilities.GetEcommerceContext(this.HttpContext);
                WishListOperationsHandler wishListOperationHandler = new WishListOperationsHandler(ecommerceContext);
                CommerceList wishList = await wishListOperationHandler.GetWishList(wishListId);

                return this.Json(wishList);
            }

            /// <summary>
            /// Creates a new wish list for the given customer.
            /// </summary>
            /// <param name="wishListName">The name of the wish list to be created.</param>
            /// <returns>A response containing the new created wish list.</returns>
            public async Task<ActionResult> CreateWishList(string wishListName)
            {
                EcommerceContext ecommerceContext = ServiceUtilities.GetEcommerceContext(this.HttpContext);
                WishListOperationsHandler wishListOperationHandler = new WishListOperationsHandler(ecommerceContext);
                CommerceList wishList = await wishListOperationHandler.CreateWishList(wishListName);

                return this.Json(wishList);
            }

            /// <summary>
            /// Deletes a wish list.
            /// </summary>
            /// <param name="wishListId">The identifier of the wish list to be deleted.</param>
            /// <returns>A response containing the identifier of the deleted wish list.</returns>
            public async Task<ActionResult> DeleteWishList(string wishListId)
            {
                EcommerceContext ecommerceContext = ServiceUtilities.GetEcommerceContext(this.HttpContext);
                WishListOperationsHandler wishListOperationHandler = new WishListOperationsHandler(ecommerceContext);
                await wishListOperationHandler.DeleteWishList(Convert.ToInt64(wishListId));

                return this.Json(true);
            }

            /// <summary>
            /// Updates the properties of a wish list.
            /// </summary>
            /// <param name="wishList">The wish list to be updated.</param>
            /// <returns>A response containing the updated wish list.</returns>
            public async Task<ActionResult> UpdateWishListProperties(CommerceList wishList)
            {
                EcommerceContext ecommerceContext = ServiceUtilities.GetEcommerceContext(this.HttpContext);
                WishListOperationsHandler wishListOperationHandler = new WishListOperationsHandler(ecommerceContext);
                CommerceList updatedWishList = await wishListOperationHandler.UpdateWishListProperties(wishList);

                return this.Json(updatedWishList);
            }

            /// <summary>
            /// Adds items to a wish list.
            /// </summary>
            /// <param name="wishListId">The id of the wish list.</param>
            /// <param name="wishListLines">The wish list lines.</param>
            /// <returns>A response containing the wish list.</returns>
            public async Task<ActionResult> AddLinesToWishList(long wishListId, IEnumerable<CommerceListLine> wishListLines)
            {
                EcommerceContext ecommerceContext = ServiceUtilities.GetEcommerceContext(this.HttpContext);
                WishListOperationsHandler wishListOperationHandler = new WishListOperationsHandler(ecommerceContext);
                CommerceList wishList = await wishListOperationHandler.AddLinesToWishList(wishListId, wishListLines);

                return this.Json(wishList);
            }

            /// <summary>
            /// Removes items from a wish list.
            /// </summary>
            /// <param name="wishListId">The id of the wish list.</param>
            /// <param name="lineIds">The line ids of the wish list lines to be removed.</param>
            /// <returns>A response containing the wish list.</returns>
            public async Task<ActionResult> RemoveItemsFromWishList(long wishListId, IEnumerable<long> lineIds)
            {
                EcommerceContext ecommerceContext = ServiceUtilities.GetEcommerceContext(this.HttpContext);
                WishListOperationsHandler wishListOperationHandler = new WishListOperationsHandler(ecommerceContext);
                CommerceList wishList = await wishListOperationHandler.RemoveItemsFromWishList(wishListId, lineIds);

                return this.Json(wishList);
            }

            /// <summary>
            /// Updates wish list lines.
            /// </summary>
            /// <param name="wishListId">The id of the wish list.</param>
            /// <param name="wishListLines">The wish list lines.</param>
            /// <returns>A response containing the wish list.</returns>
            public async Task<ActionResult> UpdateLinesOnWishList(long wishListId, IEnumerable<CommerceListLine> wishListLines)
            {
                EcommerceContext ecommerceContext = ServiceUtilities.GetEcommerceContext(this.HttpContext);
                WishListOperationsHandler wishListOperationHandler = new WishListOperationsHandler(ecommerceContext);
                CommerceList wishList = await wishListOperationHandler.UpdateLinesOnWishList(wishListId, wishListLines);

                return this.Json(wishList);
            }
        }
    }
}