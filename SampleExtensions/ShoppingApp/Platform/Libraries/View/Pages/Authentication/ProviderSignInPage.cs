/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Authentication;
using Xamarin.Auth;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.View.Pages.Authentication
{
    [CLSCompliant(false)]
    public class ProviderSignInPage : ContentPage
    {
        public OAuth2Authenticator Authenticator;
        bool _authFlowCompleted;
        ContentPage _nextPageOnSuccess;
        ContentPage _signInPage;


        public ProviderSignInPage(AuthenticationProviderType providerType, ContentPage signInPage, ContentPage nextPageOnSuccess)
        {
            _signInPage = signInPage;
            _authFlowCompleted = false;
            Authenticator = AuthenticatorFactory.GetAuthenticator(providerType);
            _nextPageOnSuccess = nextPageOnSuccess;

            Authenticator.Completed += (s, e) =>
            {
                _authFlowCompleted = true;
            };
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (_authFlowCompleted)
            {
                HandleNavigation();
            }
        }

        private async Task HandleNavigation()
        {
            Navigation.RemovePage(_signInPage);

            if (AuthenticationStatus.Instance.IsSignedIn)
            {
                if (_nextPageOnSuccess == null)
                {
                    await Navigation.PopAsync();
                }
                else
                {
                    await Navigation.PushAsync(_nextPageOnSuccess);
                    Navigation.RemovePage(this);
                }
            }
            else
            {
                await Navigation.PopAsync();
            }
        }
    }
}
