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
    using AccountInfo;
    using Base;
    using System;
    using Contoso.Commerce.Client.ShoppingApp.View.Pages.Authentication;
    using Contoso.Commerce.Client.ShoppingApp.ViewModel.Authentication;

    [CLSCompliant(false)]
    public partial class AccountPage : AccountPageXaml
    {
        public AccountPage()
        {
            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            ViewModel.OnAppearing();
        }

        void OnOrderHistoryButtonTapped(object sender, EventArgs e)
        {
            this.SignInRequired(new OrderHistoryPage() { BindingContext = new ViewModel.OrderHistoryPage() { Navigation = ViewModel.Navigation } });
        }

        void OnSignInButtonTapped(object sender, EventArgs e)
        {
            this.SignInRequired();
        }
        
        async void OnEvaluationModeSettingsButtonTapped(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new EvaluationModeSettingsPage() { BindingContext = new ViewModel.EvaluationModeSettingsPage() { Navigation = ViewModel.Navigation } });
        }

        async void OnAboutControlTapped(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new AboutPage() { BindingContext = new ViewModel.AboutPage() { Navigation = ViewModel.Navigation } });
        }
    }

    [CLSCompliant(false)]
    public class AccountPageXaml : ModelBoundContentPage<ViewModel.AccountPage> { }
}

