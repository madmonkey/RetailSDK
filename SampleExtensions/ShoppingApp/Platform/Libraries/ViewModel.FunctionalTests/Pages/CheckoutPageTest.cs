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
using System.Threading;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Pages
{
    [TestClass]
    public class CheckoutPageTest : TestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestMethod]
        public async Task PlaceOrderSuccess()
        {
            // Search product
            var ProductSearchPage = new ProductSearchPage();
            ProductSearchPage.SearchQuery = "81315";
            await ProductSearchPage.SearchProductsCommand.ExecuteAsync();

            // Load product details
            var productPage = new ProductPage(ProductSearchPage.Products[0].Data.RecordId);
            await productPage.LoadProductDetailCommand.ExecuteAsync();
            
            // Add product to the Cart
            await productPage.AddToCartCommand.ExecuteAsync();

            // Load Cart
            CartPage cartPage = new CartPage();
            await cartPage.LoadCartCommand.ExecuteAsync();

            // Proceed to checkout
            await cartPage.CheckoutCommand.ExecuteAsync();
            var checkoutPage = new CheckoutPage();

            // Load shipping address page
            var checkoutAddressPage = new CheckoutAddressPage();
            await checkoutAddressPage.LoadAddressCommand.ExecuteAsync();

            // Enter shipping address
            checkoutAddressPage.Address.Data.Name = "Adriana Smith";
            checkoutAddressPage.Address.Data.Street = "One Microsoft Way";
            checkoutAddressPage.Address.Data.City = "Redmond";
            checkoutAddressPage.Address.Data.State = "WA";
            checkoutAddressPage.Address.Data.ZipCode = "98052";
            checkoutAddressPage.Address.Data.ThreeLetterISORegionName = "USA";
            checkoutAddressPage.Address.Data.Email = "shoppingapp.test@gmail.com";
            checkoutAddressPage.ConfirmEmailAddress = "shoppingapp.test@gmail.com";

            // Load delivery options
            await checkoutAddressPage.LoadDeliveryOptionsCommand.ExecuteAsync();
            var checkoutDeliveryOptionsPage = new CheckoutDeliveryOptionsPage(checkoutAddressPage.DeliveryOptions);
            checkoutDeliveryOptionsPage.LoadDeliveryOptionCommand.Execute(null);

            // Select first delivery option
            checkoutDeliveryOptionsPage.SelectedDeliveryOption = checkoutDeliveryOptionsPage.DeliveryOptions[0];
            await checkoutDeliveryOptionsPage.SaveDeliveryOptionCommand.ExecuteAsync();

            // Load credit card payment page
            var cardPaymentPage = new CardPaymentPage();
            await cardPaymentPage.CardPaymentView.LoadCommand.ExecuteAsync();

            // TODO: Enter credit card info and place order
            //Console.WriteLine(cardPaymentPage.CardPaymentView.CardPaymentAcceptPoint.AcceptPageUrl);
        }
    }
}
