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
    using Behaviors;
    using Plugin.Toasts;
    using System;
    using System.Linq;
    using ViewModel;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public partial class CartPage : CartPageXaml
    {
        public CartPage()
        {
            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            ViewModel.LoadCartCommand.Execute(null);
        }

        // TODO: Convert to EventToCommand
        void DeleteCartLineButtonClicked(object sender, System.EventArgs e)
        {
            var deleteButton = (Button)sender;

            if (ViewModel.DeleteCartLineCommand.CanExecute(null))
            {
                ViewModel.DeleteCartLineCommand.Execute(deleteButton.BindingContext);
            }
        }

        // TODO: Convert to EventToCommand
        void CartLineQuantityEntryUnfocused(object sender, FocusEventArgs e)
        {
            var entry = (Entry)sender;

            if (ViewModel.UpdateCartLineQuantityCommand.CanExecute(null))
            {
                ViewModel.UpdateCartLineQuantityCommand.Execute(entry.BindingContext);
            }
        }


        async void CheckoutButtonClicked(object sender, System.EventArgs e)
        {
            await ViewModel.CheckoutCommand.ExecuteAsync();

            if (ViewModel.CartLines != null && ViewModel.CartLines.Any())
            {
                await Navigation.PushAsync(new CheckoutPage
                {
                    BindingContext = new ViewModel.CheckoutPage
                    {
                        Navigation = ViewModel.Navigation
                    }
                });
            }
        }
    }

    [CLSCompliant(false)]
    public abstract class CartPageXaml : ModelBoundContentPage<ViewModel.CartPage> { }
}

