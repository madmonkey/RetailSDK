/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Plugins;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Xamarin.Auth;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Authentication
{
    [CLSCompliant(false)]
    public class OpenIdConnectAuthenticator : OAuth2Authenticator
    {
        private const string NonceKey = "nonce";
        private const int NonceLength = 16;

        private const string ResponseTypeKey = "response_type";
        private const string ResponseTypeToken = "token";
        public const string ResponseTypeIdToken = "id_token";

        public OpenIdConnectAuthenticator(string clientId, string scope, Uri authorizeUrl, Uri redirectUrl) : base(clientId, scope, authorizeUrl, redirectUrl)
        {
        }

        public override Task<Uri> GetInitialUrlAsync(Dictionary<string, string> custom_query_parameters = null)
        {
            Uri url = base.GetInitialUrlAsync().Result;

            UriBuilder uriBuilder = new UriBuilder(url);
            List<KeyValuePair<string, string>> oldPairs = QueryStringHelper.ParseNoDecode(uriBuilder.Query);
            List<KeyValuePair<string, string>> newPairs = new List<KeyValuePair<string, string>>();
            foreach (var pair in oldPairs)
            {
                if (pair.Key != ResponseTypeKey)
                {
                    newPairs.Add(pair);
                }
                else
                {
                    newPairs.Add(new KeyValuePair<string, string>(ResponseTypeKey, $"{ResponseTypeIdToken} {ResponseTypeToken}"));
                }
            }

            string nonce = Convert.ToBase64String(CrossCrypto.Crypto.GenerateNonce(NonceLength));
            newPairs.Add(new KeyValuePair<string, string>(NonceKey, WebUtility.UrlEncode(nonce)));

            uriBuilder.Query = QueryStringHelper.ConstructNoEncode(newPairs);
            return Task.FromResult(uriBuilder.Uri);
        }
    }
}
