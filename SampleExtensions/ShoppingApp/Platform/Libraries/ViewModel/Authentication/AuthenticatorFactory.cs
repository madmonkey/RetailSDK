/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Services.Authentication;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Services;
using System;
using Xamarin.Auth;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Authentication
{
    [CLSCompliant(false)]
    public class AuthenticatorFactory
    {
        public static OpenIdConnectAuthenticator GetAuthenticator(AuthenticationProviderType type)
        {
            OpenIdConnectAuthenticator auth = null;
            switch (type)
            {
                case AuthenticationProviderType.Google:
                    // Configuration service needs to populate client id ,client secret and redirect Url.
                    auth = new OpenIdConnectAuthenticator(
                        clientId: ConfigurationManager.Instance.GoogleConfiguration.ClientId,
                        scope: "openid email",
                        authorizeUrl: new Uri("https://accounts.google.com/o/oauth2/v2/auth"),
                        redirectUrl: ConfigurationManager.Instance.GoogleConfiguration.RedirectUrl);
                    auth.ClearCookiesBeforeLogin = false;
                    break;
            }

            if (auth != null)
            {
                auth.Completed += (source, e) => {
                    if (e.IsAuthenticated)
                    {
                        AuthenticationStatus.Instance.SaveAccount(e.Account, type);
                        ServiceManager.Current.UserToken = new UserIdToken(AuthenticationStatus.Instance.IdToken);
                    }
                };
            }

            return auth;
        }
    }
}
