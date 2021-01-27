/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Validators;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;
using Plugin.Toasts;
using System;
using System.Collections.Generic;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Pages
{
    [TestClass]
    public class ShoppingCartPageTest : TestBase, IToastNotificator
    {
        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestMethod]
        public async Task EmptyCartSuccess()
        {
            // Open top level category list page
            CartPage cartPage = new CartPage();

            // Load categories
            await cartPage.LoadCartCommand.ExecuteAsync();

            // Assert
            CartValidator.AssertEqual("EmptyCart", cartPage.Cart);
        }

        public static string actualDecription;

        [TestMethod]
        public async Task AddItemToCartSuccess()
        {
            var ProductSearchPage = new ProductSearchPage();
            ProductSearchPage.SearchQuery = "81315";

            await ProductSearchPage.SearchProductsCommand.ExecuteAsync();

            var productPage = new ProductPage(ProductSearchPage.Products[0].Data.RecordId);

            // Load product details
            await productPage.LoadProductDetailCommand.ExecuteAsync();

            // Add product to the Cart
            await productPage.AddToCartCommand.ExecuteAsync();

            // Verify the toast notification message after adding item to the cart
            Assert.AreEqual(actualDecription, "Pearl Sapphire Pendant Necklace has been added to cart.");

            CartPage cartPage = new CartPage();

            // Load Cart
            await cartPage.LoadCartCommand.ExecuteAsync();

            // Assert
            CartValidator.AssertEqual("AddItemsToCart", cartPage.Cart);
        }

        public Task<INotificationResult> Notify(INotificationOptions options)
        {
            actualDecription = options.Description;
            INotificationResult result = new NotificationResult
            {
                Action = NotificationAction.Clicked
            };
            return Task.FromResult(result);
        }

        public void Notify(Action<INotificationResult> callback, INotificationOptions options)
        {
            throw new NotImplementedException();
        }

        public Task<IList<INotification>> GetDeliveredNotifications()
        {
            throw new NotImplementedException();
        }

        public void CancelAllDelivered()
        {
            throw new NotImplementedException();
        }

        public void SystemEvent(object args)
        {
            throw new NotImplementedException();
        }
    }
}
