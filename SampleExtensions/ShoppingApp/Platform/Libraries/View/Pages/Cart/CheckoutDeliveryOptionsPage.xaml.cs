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
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public class CheckoutDeliveryOptionsPageXaml : ModelBoundContentPage<ViewModel.CheckoutDeliveryOptionsPage> { }

    [CLSCompliant(false)]
    public partial class CheckoutDeliveryOptionsPage : CheckoutDeliveryOptionsPageXaml
    {
        Page _previousPage;

        public CheckoutDeliveryOptionsPage(Page previousPage)
        {
            _previousPage = previousPage;

            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (ViewModel.IsInitialized)
                return;

            ViewModel.DeliveryOptionsLoaded += OnDeliveryOptionsLoaded;

            ViewModel.LoadDeliveryOptionCommand.Execute(null);
        }

        private void OnDeliveryOptionsLoaded(object sender, EventArgs eventArgs)
        {
            foreach (var item in ViewModel.DeliveryOptions)
            {
                Picker.Items.Add(item.Data.Description);
            }

            if (ViewModel.SelectedDeliveryOption?.Data.Code == null)
            {
                Picker.SelectedIndex = 0;
                ViewModel.SelectedDeliveryOption = ViewModel.DeliveryOptions[Picker.SelectedIndex];
            }
            else
            {
                Picker.SelectedIndex = ViewModel.DeliveryOptions.IndexOf(ViewModel.SelectedDeliveryOption);
            }
        }

        private void PickerSelectedIndexChanged(object sender, EventArgs eventArgs)
        {
            ViewModel.SelectedDeliveryOption = ViewModel.DeliveryOptions[Picker.SelectedIndex];

            if (Device.RuntimePlatform == Device.iOS)
            {
                // This automatically closes the Picker without the need to click done.
                Picker.Unfocus();
            }
        }

        private async void ContinueButtonClicked(object sender, System.EventArgs e)
        {
            await ViewModel.SaveDeliveryOptionCommand.ExecuteAsync();
            Navigation.RemovePage(_previousPage);
            await Navigation.PopAsync();
        }
    }
}