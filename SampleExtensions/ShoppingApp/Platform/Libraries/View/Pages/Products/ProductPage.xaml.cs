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
using Contoso.Commerce.Client.Extensions;
using Contoso.Commerce.Client.ShoppingApp.View.Pages.Base;
using Contoso.Commerce.Client.ShoppingApp.View.Views;
using Contoso.Commerce.Client.ShoppingApp.ViewModel;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Localization;
using System;
using System.Linq;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.View.Pages
{
    [CLSCompliant(false)]
    public partial class ProductPage : ProductPageXaml
    {
        bool _productLoaded;

        public ProductPage()
        {
            InitializeComponent();
            _productLoaded = false;

            if (Xamarin.Forms.Device.RuntimePlatform == Xamarin.Forms.Device.Android)
            {
                var cartToolBarItem = new CartToolbarItem(Navigation);
                cartToolBarItem.SetBinding(CartToolbarItem.CartHasItemsProperty, 
                                           new Binding(nameof(ViewModel.CartHasItems)) { Source = ViewModel });
                ToolbarItems.Insert(0, cartToolBarItem);
            }
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (ViewModel.IsInitialized)
                return;

            // There is no way to bound data to the picker control hence, 
            // register the initpicker method to to the ViewModelLoadledEvenHandler to 
            // initialize the dimension pickers after the viewmodel is completely loaded.
            if (!_productLoaded)
            {
                ViewModel.ProductLoaded += OnProductLoaded;
                ViewModel.LoadProductDetailCommand.Execute(ViewModel.Product);
            }
        }

        private void OnProductLoaded(object sender, EventArgs eventArgs)
        {
            _productLoaded = true;
            if (!ViewModel.Product.Dimensions.Any())
            {
                return;
            }

            foreach (var dimension in ViewModel.Product.Dimensions)
            {
                var picker = new Picker
                {
                    Title = String.Format(Translator.Instance.GetTranslation(nameof(TextResources.Pages_ProductPage_ProductDetails_PickerTitle)),
                                          Translator.Instance.GetEnumTranslation((ProductDimensionType)dimension.Data.DimensionTypeValue)),
                    Style = (Style)Application.Current.Resources["fieldPickerStyle"],
                    IsEnabled = dimension.IsEnabled
                };

                picker.SelectedIndexChanged += (s, e) =>
                {
                    dimension.SelectedOptionIndex = picker.SelectedIndex;
                    ViewModel.SaveDimensionOption.Execute(dimension);

                    if (Xamarin.Forms.Device.RuntimePlatform == Xamarin.Forms.Device.iOS)
                    {
                        // This automatically closes the picker without the need to click done.
                        picker.Unfocus();
                    }
                };

                dimension.PropertyChanged += (s, e) =>
                {
                    if (e.PropertyName == "IsEnabled")
                    {
                        picker.IsEnabled = dimension.IsEnabled;
                        picker.Items.Clear();
                        picker.Items.AddRange(dimension.Options.Select(pdv => pdv.Value));
                    }
                };

                PickerSection.Children.Add(picker);
            }
        }

        public async void OnProductDescriptionControlClicked(object sender, EventArgs args)
        {
            if (ViewModel.IsBusy)
            {
                return;
            }

            await Navigation.PushAsync(new ProductDescriptionPage() { BindingContext = new ViewModel.ProductDescriptionPage(ViewModel.Product.Data.RecordId) { Navigation = ViewModel.Navigation } });
        }
    }

    [CLSCompliant(false)]
    public abstract class ProductPageXaml : ModelBoundContentPage<ViewModel.ProductPage> { }
}

