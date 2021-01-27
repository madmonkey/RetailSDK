/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client.ShoppingApp.View.Pages
{
    using Base;
    using System;
    using ViewModel.Localization;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public class CheckoutAddressPageXaml : ModelBoundContentPage<ViewModel.CheckoutAddressPage> { }

    [CLSCompliant(false)]
    public partial class CheckoutAddressPage : CheckoutAddressPageXaml
    {
        public CheckoutAddressPage()
        {
            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (ViewModel.IsInitialized)
                return;

            ViewModel.AddressLoaded += OnAddressLoaded;

            ViewModel.LoadAddressCommand.Execute(null);
        }

        private void OnAddressLoaded(object sender, EventArgs eventArgs)
        {
            int countryIndex = 0;
            foreach (var countryCode in ViewModel.CountryCodes)
            {
                CountryPicker.Items.Add(Translator.Instance.GetTranslation(GetCountryRegionTextResourceKey(countryCode)));
                if (string.Equals(ViewModel.Address.Data.ThreeLetterISORegionName, countryCode))
                {
                    countryIndex = CountryPicker.Items.Count - 1;
                }
            }

            CountryPicker.SelectedIndex = countryIndex;
            ViewModel.Address.Data.ThreeLetterISORegionName = ViewModel.CountryCodes[countryIndex];
        }

        private void CountryPickerSelectedIndexChanged(object sender, EventArgs eventArgs)
        {
            var selectedValue = CountryPicker.Items[CountryPicker.SelectedIndex];
            foreach (var countryCode in ViewModel.CountryCodes)
            {
                if (string.Equals((Translator.Instance.GetTranslation(GetCountryRegionTextResourceKey(countryCode))), selectedValue))
                {
                    ViewModel.Address.Data.ThreeLetterISORegionName = countryCode;
                    break;
                }
            }

            if (Device.RuntimePlatform == Device.iOS)
            {
                // This automatically closes the CountryPicker without the need to click done.
                CountryPicker.Unfocus();
            }
        }

        private async void ContinueButtonClicked(object sender, System.EventArgs e)
        {
            await ViewModel.LoadDeliveryOptionsCommand.ExecuteAsync(null);

            if (ViewModel.DeliveryOptions.Count > 0)
            {
                await Navigation.PushAsync(new CheckoutDeliveryOptionsPage(this) { BindingContext = new ViewModel.CheckoutDeliveryOptionsPage(ViewModel.DeliveryOptions) { Navigation = ViewModel.Navigation } });
            }
        }

        private static string GetCountryRegionTextResourceKey(string countryRegionCode)
        {
            return "CountryRegion_" + countryRegionCode;
        }
    }
}