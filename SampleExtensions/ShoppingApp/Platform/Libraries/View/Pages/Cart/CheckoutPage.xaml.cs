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

    [CLSCompliant(false)]
    public partial class CheckoutPage : CheckoutPageXaml
    {
        public CheckoutPage()
        {
            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            ViewModel.LoadCheckoutCartCommand.Execute(null);
        }

        private async void OnDeliverySectionClicked(object sender, EventArgs e)
        {
            if (ViewModel.IsBusy)
            {
                return;
            }

            await Navigation.PushAsync(new CheckoutAddressPage() { BindingContext = new ViewModel.CheckoutAddressPage() { Navigation = ViewModel.Navigation } });
        }

        private async void OnPaymentSectionClicked(object sender, EventArgs e)
        {
            if (ViewModel.IsBusy)
            {
                return;
            }

            await Navigation.PushAsync(new CardPaymentPage() { BindingContext = new ViewModel.CardPaymentPage() { Navigation = ViewModel.Navigation } });
        }

        async void OnPlaceOrderClicked(object sender, System.EventArgs e)
        {
            await ViewModel.PlaceOrderCommand.ExecuteAsync();

            if (ViewModel.Order != null)
            {
                await Navigation.PopToRootAsync();
            }
        }
    }

    [CLSCompliant(false)]
    public abstract class CheckoutPageXaml : ModelBoundContentPage<ViewModel.CheckoutPage> { }
}
