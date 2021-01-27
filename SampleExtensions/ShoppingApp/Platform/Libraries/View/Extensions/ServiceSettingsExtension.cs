/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client.ShoppingApp.View.Extensions
{
    using System;
    using System.Globalization;
    using System.Reflection;
    using System.Resources;
    using ViewModel.Configurations;
    using ViewModel.Settings;
    using Xamarin.Forms;
    using Xamarin.Forms.Xaml;

    // You exclude the 'Extension' suffix when using in Xaml markup
    [ContentProperty("Name")]
    public class ServiceSettingsExtension : IMarkupExtension
    {
        public string Name { get; set; }

        public object ProvideValue (IServiceProvider serviceProvider)
        {
            return SettingsManager.Instance.ServiceSettings.SettingValue(Name)?.ToString();
        }
    }
}

