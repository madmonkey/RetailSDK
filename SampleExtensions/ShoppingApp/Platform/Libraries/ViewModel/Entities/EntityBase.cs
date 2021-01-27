/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Settings;
using System;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities
{
    public abstract class EntityBase<T> : ObservableBase where T: CommerceEntity
    {
        public T Data { get; private set; }

        protected EntityBase(T data)
        {
            Data = data;
        }

        public static string GetFullImageUrl(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                return string.Empty;
            }

            Uri uri;

            if (!Uri.TryCreate(url, UriKind.RelativeOrAbsolute, out uri))
            {
                return string.Empty;
            }

            if (uri.IsAbsoluteUri)
            {
                return url;
            }

            if (!Uri.TryCreate(SettingsManager.Instance.ServiceSettings.MediaBaseUrl, url, out uri))
            {
                return string.Empty;
            }

            return uri.AbsoluteUri;
        }
    }
}
