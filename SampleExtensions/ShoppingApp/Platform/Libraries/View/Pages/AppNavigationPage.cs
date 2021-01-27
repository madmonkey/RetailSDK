/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

// The MIT License (MIT)
// 
// Copyright (c) 2015 Xamarin
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

namespace Contoso.Commerce.Client.ShoppingApp.View.Pages
{
    using Statics;
    using System;
    using ViewModel;
    using ViewModel.Localization;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public class AppNavigationPage : NavigationPage
    {
        public AppNavigationPage(Page root)
            : base(root)
        {
            Init();
        }

        public AppNavigationPage()
        {
            Init();
        }

        void Init()
        {
            BarBackgroundColor = Palette.Current.Primary;
            BarTextColor = Color.White;
        }

        public static AppNavigationPage CreateCategoryListPage()
        {
            var contentPage = new CategoryListPage();

            var navigationPage = new AppNavigationPage(contentPage)
            {
				Title = Translator.Instance.GetTranslation(nameof(TextResources.MainTabs_Products)),
                IconImageSource = ImageSource.FromFile("products.png"),
            };

            // The INavigation passed to the view model needs to belong to AppNavigationPage 
            contentPage.BindingContext = new ViewModel.CategoryListPage() { Navigation = navigationPage.Navigation };

            return navigationPage;
        }

        public static AppNavigationPage CreateAccountPage()
        {
            var contentPage = new AccountPage();

            var navigationPage = new AppNavigationPage(contentPage)
            {
				Title = Translator.Instance.GetTranslation(nameof(TextResources.MainTabs_Account)),
                IconImageSource = ImageSource.FromFile("account.png")
            };

            // The INavigation passed to the view model needs to belong to AppNavigationPage 
            contentPage.BindingContext = new ViewModel.AccountPage() { Navigation = navigationPage.Navigation };

            return navigationPage;
        }

        public static AppNavigationPage CreateCartPage()
        {
            var contentPage = new CartPage();

            var navigationPage = new AppNavigationPage(contentPage)
            {
				Title = Translator.Instance.GetTranslation(nameof(TextResources.MainTabs_Cart))
            };

            // The INavigation passed to the view model needs to belong to AppNavigationPage 
            var cartPage = new ViewModel.CartPage() { Navigation = navigationPage.Navigation };

			// Use the Cart service to figure out if cart has items.
			navigationPage.SetCartIcon(cartPage.ServiceManager.CartService.CartHasItems);

			// In case of changes in the cart contents, update the icon.
			cartPage.ServiceManager.CartService.CartHasItemsChanged += (sender, e) => {
				var service = (ViewModel.CartService)sender;
				navigationPage.SetCartIcon(service.CartHasItems);
			};

			contentPage.BindingContext = cartPage;
			return navigationPage;
        }

		private void SetCartIcon(bool cartHasItems)
		{
			if (cartHasItems)
			{
				this.IconImageSource = ImageSource.FromFile("cart_filled.png");
			}
			else
			{
				this.IconImageSource = ImageSource.FromFile("cart.png");
			}
		}

	}        
}

