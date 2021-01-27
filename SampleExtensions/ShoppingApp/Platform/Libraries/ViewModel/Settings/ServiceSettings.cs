/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations;
using Plugin.Settings.Abstractions;
using System;
using System.Xml.Linq;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Settings
{
    [CLSCompliant(false)]
    public class ServiceSettings
    {
        private const string DataServiceUrlKey = "DataServiceUrl";
        private static readonly string DataServiceUrlDefault = null;

        private const string MediaBaseUrlKey = "MediaBaseUrl";
        private static readonly string MediaBaseUrlDefault = null;

        private const string CardPaymentHostPageUrlKey = "CardPaymentHostPageUrl";
        private static readonly string CardPaymentHostPageUrlDefault = null;

        private const string OperatingUnitNumberKey = "OperatingUnitNumber";
        private static readonly string OperatingUnitNumberDefault = null;

        private const string CartHasItemsKey = "CartHasItems";
        private static readonly bool CartHasItemsDefault = false;

        private const string CartIdKey = "CartId";
        private static readonly string CartIdDefault = null;

        private readonly ISettings appSettings;

        public ServiceSettings(ISettings settings)
        {
            appSettings = settings;
        }

        public Uri DataServiceUrl
        {
            get
            {
                string savedDataServiceUrl = appSettings.GetValueOrDefault(DataServiceUrlKey, DataServiceUrlDefault);
                if (!string.IsNullOrWhiteSpace(savedDataServiceUrl))
                {
                    return new Uri(savedDataServiceUrl);
                }
                else
                {
                    return ConfigurationManager.Instance.ServiceConfiguration.DataServiceUrl;
                }
            }
            set
            {
                appSettings.AddOrUpdateValue(DataServiceUrlKey, value?.ToString());
            }
        }

        public Uri MediaBaseUrl
        {
            get
            {
                String savedMediaBaseUrl = appSettings.GetValueOrDefault(MediaBaseUrlKey, MediaBaseUrlDefault);
                if (!string.IsNullOrWhiteSpace(savedMediaBaseUrl))
                {
                    return new Uri(savedMediaBaseUrl);
                }
                else
                {
                    return ConfigurationManager.Instance.ServiceConfiguration.MediaBaseUrl;
                }
            }
            set
            {
                appSettings.AddOrUpdateValue(MediaBaseUrlKey, value?.ToString());
            }
        }

        public Uri CardPaymentHostPageUrl
        {
            get
            {
                String savedCardPaymentHostPageUrl = appSettings.GetValueOrDefault(CardPaymentHostPageUrlKey, CardPaymentHostPageUrlDefault);
                if (!string.IsNullOrWhiteSpace(savedCardPaymentHostPageUrl))
                {
                    return new Uri(savedCardPaymentHostPageUrl);
                }
                else
                {
                    return ConfigurationManager.Instance.ServiceConfiguration.CardPaymentHostPageUrl;
                }
            }
            set
            {
                appSettings.AddOrUpdateValue(CardPaymentHostPageUrlKey, value?.ToString());
            }
        }

        public string OperatingUnitNumber
        {
            get
            {
                String savedOperatingUnitNumber = appSettings.GetValueOrDefault(OperatingUnitNumberKey, OperatingUnitNumberDefault);
                if (!string.IsNullOrWhiteSpace(savedOperatingUnitNumber))
                {
                    return savedOperatingUnitNumber;
                }
                else
                {
                    return ConfigurationManager.Instance.ServiceConfiguration.OperatingUnitNumber;
                }
            }
            set
            {
                appSettings.AddOrUpdateValue(OperatingUnitNumberKey, value);
            }
        }

        public bool CartHasItems
        {
            get
            {
                return appSettings.GetValueOrDefault(CartHasItemsKey, CartHasItemsDefault);
            }
            set
            {
                appSettings.AddOrUpdateValue(CartHasItemsKey, value);
            }
        }

        public string CartId
        {
            get
            {
                return appSettings.GetValueOrDefault(CartIdKey, CartIdDefault);
            }
            set
            {
                appSettings.AddOrUpdateValue(CartIdKey, value);
            }
        }

        public void ClearAll()
        {
            DataServiceUrl = null;
            MediaBaseUrl = null;
            CardPaymentHostPageUrl = null;
            OperatingUnitNumber = null;
            CartHasItems = false;
            CartId = null;
        }

        public object SettingValue(string name)
        {
            switch (name)
            {
                case nameof(DataServiceUrl):
                    return DataServiceUrl;

                case nameof(MediaBaseUrl):
                    return MediaBaseUrl;

                case nameof(CardPaymentHostPageUrl):
                    return CardPaymentHostPageUrl;

                case nameof(OperatingUnitNumber):
                    return OperatingUnitNumber;

                case nameof(CartHasItems):
                    return CartHasItems;

                case nameof(CartId):
                    return CartId;

                default:
                    return null;
            }
        }
    }
}
