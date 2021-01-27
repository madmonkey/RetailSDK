/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.ShoppingApp.ViewModel.Authentication;
using System;
using Xamarin.Forms;
using System.Collections.Generic;

namespace Contoso.Commerce.Client.ShoppingApp.View.Pages.Authentication
{
    [CLSCompliant(false)]
    public partial class SignInPage : SignInPageXaml
    {
        ContentPage _nextPageOnSuccess;
        bool _providerSignPageShown;

        public SignInPage(ContentPage nextPageOnSuccess = null)
        {
            _providerSignPageShown = false;
            _nextPageOnSuccess = nextPageOnSuccess;
            InitializeComponent();
        }

        protected async override void OnAppearing()
        {
            base.OnAppearing();

            if (_providerSignPageShown)
            {
                if (Device.RuntimePlatform == Device.Android)
                {
                    await Navigation.PopAsync(false);
                    if (AuthenticationStatus.Instance.IsSignedIn)
                    {
                        if (_nextPageOnSuccess != null)
                        {
                            Navigation.InsertPageBefore(_nextPageOnSuccess, this);
                        }

                        Navigation.RemovePage(this);
                    }
                }
            }
            else
            {
                if (AuthenticationStatus.Instance.IsSignedIn )
                {
                    if (!AuthenticationStatus.Instance.HasValidToken())
                    {
                        _providerSignPageShown = true;
                        // Todo: Need to update once other providers are implemented.
                        await Navigation.PushAsync(new ProviderSignInPage(AuthenticationProviderType.Google, this, _nextPageOnSuccess), false);
                    }
                    else
                    {
                        await Navigation.PushAsync(_nextPageOnSuccess, false);
                        Navigation.RemovePage(this);
                    }
                }
            }
        }

        async void OnGoogleSignInClicked(object sender, EventArgs e)
        {
            _providerSignPageShown = true;
            await Navigation.PushAsync(new ProviderSignInPage(AuthenticationProviderType.Google, this, _nextPageOnSuccess));
        }
    }

    [CLSCompliant(false)]
    public class SignInPageXaml : ContentPage { }
}
