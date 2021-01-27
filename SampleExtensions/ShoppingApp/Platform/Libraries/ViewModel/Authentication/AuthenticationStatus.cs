/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Services.Authentication;
using System;
using System.Linq;
using Xamarin.Auth;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Services;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Settings;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Authentication
{
    [CLSCompliant(false)]
    public class AuthenticationStatus
    {
        private static readonly Lazy<AuthenticationStatus> instance = new Lazy<AuthenticationStatus>(() => new AuthenticationStatus());
        public static AuthenticationStatus Instance
        {
            get
            {
                return instance.Value;
            }
        }

        private AccountStore accountStore;
        public AccountStore AccountStore
        {
            get
            {
                if (accountStore == null)
                {
                    accountStore = AccountStore.Create();
                }
                return accountStore;
            }
        }

        private DateTime expiresAt;

        private AuthenticationStatus()
        {
            expiresAt = DateTime.UtcNow;
            IsSigningIn = false;
        }

        public bool IsSigningIn { get; set; }

        /// <summary>
        /// Indicates if the user is logged in or not. TODO Need to load login status from persisted data.
        /// </summary>
        public bool IsSignedIn
        {
            get
            {
                return !string.IsNullOrEmpty(IdToken);
            }
        }

        public bool HasValidToken()
        {
            return (expiresAt > DateTime.UtcNow.AddSeconds(5));
        }

        public string IdToken
        {
            get
            {
                var serviceId = ServiceIdForProvider(AuthenticationProviderType.Google);
                var account = AccountStore.FindAccountsForService(serviceId).FirstOrDefault();
                string token = null;
                account?.Properties.TryGetValue(OpenIdConnectAuthenticator.ResponseTypeIdToken, out token);
                return token;
            }
        }

        private string ServiceIdForProvider(AuthenticationProviderType providerType)
        {
            switch (providerType)
            {
                case AuthenticationProviderType.Google:
                    // GUID as google service Id.
                    return "18071A8D-7DF5-4B36-B8C7-FD79989C3378"; 
                default:
                    // service Id for any other provider.
                    return "28271461-0967-4149-A344-5439F6B38361";
            }
        }

        public void SaveAccount(Account account, AuthenticationProviderType providerType)
        {
            var exp = Convert.ToInt32(account.Properties["expires_in"]);
            expiresAt = DateTime.UtcNow.AddSeconds(exp);
            AccountStore.Save(account, ServiceIdForProvider(providerType));
        }

        public void SignOut()
        {
            var serviceId = ServiceIdForProvider(AuthenticationProviderType.Google);

            foreach (var account in AccountStore.FindAccountsForService(serviceId))
            {
                AccountStore.Delete(account, serviceId);
            }

            expiresAt = DateTime.UtcNow;
            OAuth2Authenticator.ClearCookies();
            ServiceManager.Current.UserToken = null;
            ServiceManager.Current.CartService.ClearCart();
        }
    }
}
