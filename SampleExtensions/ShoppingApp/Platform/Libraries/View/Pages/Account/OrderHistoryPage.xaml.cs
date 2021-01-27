/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.ShoppingApp.View.Pages.Base;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities;
using System;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.View.Pages.AccountInfo
{
    [CLSCompliant(false)]
    public partial class OrderHistoryPage : OrderHistoryPageXaml
    {
        public OrderHistoryPage()
        {
            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (ViewModel.IsInitialized)
                return;
            
            if (ViewModel.LoadOrdersCommand.CanExecute(null))
            {
                ViewModel.LoadOrdersCommand.Execute(null);
            }
        }

        async void OrderItemTapped(object sender, ItemTappedEventArgs e)
        {
            Order order = ((Order)e.Item);
            await Navigation.PushAsync(new OrderDetailsPage() { BindingContext = new ViewModel.OrderDetailsPage(order) { Navigation = ViewModel.Navigation } });
        }
    }

    [CLSCompliant(false)]
    public class OrderHistoryPageXaml : ModelBoundContentPage<ViewModel.OrderHistoryPage> { }
}