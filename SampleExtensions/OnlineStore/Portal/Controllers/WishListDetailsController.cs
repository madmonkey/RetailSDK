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
        using System.Web.Mvc;

        /// <summary>
        /// The WishListDetails Controller.
        /// </summary>
        public class WishListDetailsController : ActionControllerBase
        {
            private const string WishListDetailsViewName = "WishListDetails";

            /// <summary>
            /// Default action for the WishListDetails Controller.
            /// </summary>
            /// <returns>Default view for the wish list details.</returns>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security.Web.Configuration", "CA3147:MarkVerbHandlersWithValidateAntiforgeryToken", MessageId = "#ValidateAntiForgeryTokenAttributeDefaultMissing", Justification = "Support for anti-forgery token will be added once the controls are redesigned to follow MVC pattern.")]
            public ActionResult Index()
            {
                return this.View(WishListDetailsController.WishListDetailsViewName);
            }
        }
    }
}