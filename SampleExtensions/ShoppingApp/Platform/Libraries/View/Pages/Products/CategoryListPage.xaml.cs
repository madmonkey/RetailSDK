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
    using Base;
    using System;
    using System.Globalization;
    using ViewModel.Entities;
    using Views;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public partial class CategoryListPage : CategoryListPageXaml
    {
        public CategoryListPage()
        {
            InitializeComponent();

            if (Device.RuntimePlatform == Device.Android)
            {
                var activityIndicator = new ActivityIndicator();
                activityIndicator.SetBinding(ActivityIndicator.IsEnabledProperty, new Binding("IsBusy") { Source = ViewModel });
                activityIndicator.SetBinding(ActivityIndicator.IsVisibleProperty, new Binding("IsBusy") { Source = ViewModel });
                activityIndicator.SetBinding(ActivityIndicator.IsRunningProperty, new Binding("IsBusy") { Source = ViewModel });
                MainContent.Children.Insert(0, activityIndicator);

                ToolbarItems.Insert(0, new CartToolbarItem(Navigation));
            }
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            // Refreshing the toolbar item does not work when changing detail page.
            if (Device.RuntimePlatform == Device.Android)
            {
                ToolbarItems.RemoveAt(0);
                ToolbarItems.Insert(0, new CartToolbarItem(Navigation));
            }

            if (ViewModel.IsInitialized)
                return;

            ViewModel.LoadCategoriesCommand.Execute(ViewModel.ParentCategory);

            ViewModel.IsInitialized = true;
        }

        async void CategoryItemTapped(object sender, ItemTappedEventArgs e)
        {
            Category category = ((Category)e.Item);
            if (category.HasSubCategories)
            {
                await Navigation.PushAsync(new CategoryListPage() { BindingContext = new ViewModel.CategoryListPage(category) { Title = category.Data.Name, Navigation = Navigation } });
            }
            else
            {
                await Navigation.PushAsync(new ProductListPage() { BindingContext = new ViewModel.ProductListPage(category.Data.RecordId) { Title = category.Data.Name, Navigation = Navigation } });
            }
        }

    }

    [CLSCompliant(false)]
    public abstract class CategoryListPageXaml : ModelBoundContentPage<ViewModel.CategoryListPage> { }
}

