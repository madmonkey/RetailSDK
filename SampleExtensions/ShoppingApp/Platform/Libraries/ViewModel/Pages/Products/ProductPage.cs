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
using Contoso.Commerce.Client.Data.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Localization;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Services;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Toasts;
using Plugin.Toasts;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    [CLSCompliant(false)]
    public class ProductPage : PageBase
    {
        private bool _cartHasItems; 
        public bool CartHasItems
        {
            get { return _cartHasItems; }
            set { SetProperty(ref _cartHasItems, value); }
        }

        // event fires after the viewmodel completes loading product data.
        public event EventHandler ProductLoaded;

        public ProductPage(long productId)
        {
            ProductId = productId;
            LoadProductDetailCommand = new AsyncCommand(ExecuteLoadProductDetailCommand, this);
            LoadDimensionCommand = new AsyncCommand(ExecuteLoadDimensionCommand, this);
            SaveDimensionOption = new AsyncCommand(ExecuteSaveDimensionOption, this);
            AddToCartCommand = new AsyncCommand(ExecuteAddToCartCommand, this);
            CartHasItems = SettingsManager.ServiceSettings.CartHasItems;
        }

        Entities.Product _product;

        public Entities.Product Product
        {
            get { return _product; }
            set { SetProperty(ref _product, value); }
        }

        bool _isAddToCartReady;

        public bool IsAddToCartReady
        {
            get { return _isAddToCartReady; }
            set { SetProperty(ref _isAddToCartReady, value); }
        }

        private long ProductId;

        /// <summary>
        /// Command to load product details.
        /// </summary>
        public AsyncCommand LoadProductDetailCommand { get; private set; }

        private async Task ExecuteLoadProductDetailCommand()
        {
            Product = (await ServiceManager.ProductService.GetProductById(ProductId));
            SetStateAddToCart();

            ProductLoaded?.Invoke(this, null);

            // Load the first dimension.
            if (Product.Dimensions.Any())
            {
                await ExecuteLoadDimensionCommand(Product.Dimensions[0]);
            }
        }

        public AsyncCommand LoadDimensionCommand { get; private set; }


        private async Task ExecuteLoadDimensionCommand(object dimensionObj)
        {
            if (!(dimensionObj is Dimension))
            {
                throw new ArgumentException("Not of type Dimension");
            }

            var dimension = dimensionObj as Dimension;

            dimension.Options.Clear();

            var dimensionOptions = await ServiceManager.ProductService.GetDimensionOptions(
                ProductId,
                (ProductDimensionType)dimension.Data.DimensionTypeValue.Value,
                Product.Dimensions.Where(d => d.Data.DimensionValue != null).Select(d => d.Data));

            // Todo: Can be done in a more efficient manner. http://stackoverflow.com/questions/670577/observablecollection-doesnt-support-addrange-method-so-i-get-notified-for-each
            foreach (var dimensionOption in dimensionOptions)
            {
                dimension.Options.Add(dimensionOption);
            }

            dimension.IsEnabled = true;
        }

        public AsyncCommand SaveDimensionOption { get; private set; }

        private async Task ExecuteSaveDimensionOption(object dimensionObj)
        {
            if (!(dimensionObj is Dimension))
            {
                throw new ArgumentException("Not of type Dimension");
            }

            var dimension = dimensionObj as Dimension;

            if (dimension.DisplayOrderIndex + 1 < Product.Dimensions.Count)
            {
                for (int i = dimension.DisplayOrderIndex + 1; i < Product.Dimensions.Count; i++)
                {
                    var disabledDimension = Product.Dimensions[i];
                    disabledDimension.IsEnabled = false;
                    disabledDimension.Options.Clear();
                    disabledDimension.SelectedOptionIndex = -1;
                }

                await ExecuteLoadDimensionCommand(Product.Dimensions[dimension.DisplayOrderIndex + 1]);
            }

            SetStateAddToCart();
        }

        public AsyncCommand AddToCartCommand { get; private set; }

        private async Task ExecuteAddToCartCommand()
        {
            var notificator = AppContainer.Resolve<IToastNotificator>();

            // If dimensions - Size/Color are not selected then show error message else Add items to cart
            if (IsAddToCartReady == false)
            {
                await notificator.Notify(new NotificationOptions
                {
                    Title = Translator.Instance.GetTranslation(nameof(TextResources.Enum_ToastNotificationType_Error)),
                    Description = Translator.Instance.GetTranslation(nameof(TextResources.Pages_ProductPage_AddToCartError))
                });
            }
            else
            {
                await ServiceManager.CartService.AddProduct(Product);

                var tapped = await notificator.Notify(new NotificationOptions
                {
                    Title = Translator.Instance.GetEnumTranslation(ToastNotificationType.Success),
                    Description = string.Format(Translator.Instance.GetTranslation(nameof(TextResources.Pages_ProductPage_ProductDetail_AddToCartMessage)), Product.Data.Name)
                });
                CartHasItems = true;
            }
        }

        private void SetStateAddToCart()
        {
            if (Product == null)
            {
                IsAddToCartReady = false;
            }

            IsAddToCartReady = Product.Dimensions.All(d => d.SelectedOptionIndex >= 0);
        }
    }
}

