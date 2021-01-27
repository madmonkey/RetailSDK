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
        using System.Threading.Tasks;
        using System.Web.Mvc;
        using Contoso.Retail.Ecommerce.Sdk.Core;
        using Contoso.Retail.Ecommerce.Sdk.Core.OperationsHandlers;
        using Contoso.Retail.Ecommerce.Web.Storefront.ViewModels;
        using Microsoft.Dynamics.Commerce.RetailProxy;
        using Newtonsoft.Json;
        using Newtonsoft.Json.Linq;

        /// <summary>
        /// Controller for checkout.
        /// </summary>
        public class CheckoutController : ActionControllerBase
        {
            private const string CheckoutViewName = "Checkout";

            /// <summary>
            /// Index for Checkout.
            /// </summary>
            /// <returns>View for Checkout.</returns>
            [HttpGet]
            public ActionResult Index()
            {
                return IndexInternal();
            }

            /// <summary>
            /// An argument containing the redirect data.
            /// </summary>
            /// <param name="argument"></param>
            /// <returns>Action Result.</returns>
            [HttpPost]
            public async Task<ActionResult> Index(AdyenRedirectArguments arguments)
            {
                SessionType sessionType = ServiceUtilities.GetSessionType(this.HttpContext, isCheckoutSession: true);
                string cartId = ServiceUtilities.GetCartIdFromRequestCookie(this.HttpContext, sessionType);
                System.Console.WriteLine(arguments);
                EcommerceContext ecommerceContext = ServiceUtilities.GetEcommerceContext(this.HttpContext);
                RetailOperationsHandler retailOperationsHandler = new RetailOperationsHandler(ecommerceContext);
                await Task.Yield();
                JObject container = new JObject();
                container.Add(new JProperty(nameof(arguments.MD), arguments.MD));
                container.Add(new JProperty(nameof(arguments.PaRes), arguments.PaRes));

                string stringContainer = JsonConvert.SerializeObject(container);
                string encodedRedirectResponse = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(stringContainer));
                return IndexInternal(encodedRedirectResponse);
            }

            private ActionResult IndexInternal(string encodedRedirectResponse = null)
            {
                if (!string.IsNullOrWhiteSpace(encodedRedirectResponse) || (Request.UrlReferrer != null && Request.UrlReferrer.AbsolutePath.Contains("SignIn")) || this.HttpContext.Request.IsAuthenticated)
                {
                    // If navigation if from SignIn view or if user is authenticated Or if the navigation is from payment redirect
                    return this.View(CheckoutController.CheckoutViewName, new CheckoutViewModel { EncodedRedirectResponse = encodedRedirectResponse });
                }
                else
                {
                    // Otherwise navigate user to SignIn view 
                    this.TempData["IsCheckoutFlow"] = true;
                    return this.RedirectToAction(SignInController.DefaultActionName, SignInController.ControllerName);
                }
            }
        }
    }
}