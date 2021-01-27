/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.ShoppingApp.View.Pages.Base;
using Contoso.Commerce.Client.ShoppingApp.View.Views;
using System;

namespace Contoso.Commerce.Client.ShoppingApp.View.Pages
{
    [CLSCompliant(false)]
    public partial class OrderDetailsPage : OrderDetailsPageXaml
    {
        public OrderDetailsPage()
        {
            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (ViewModel.IsInitialized)
                return;

            ViewModel.LoadOrderDetailsCommand.Execute(null);
        }
    }

    [CLSCompliant(false)]
    public abstract class OrderDetailsPageXaml : ModelBoundContentPage<ViewModel.OrderDetailsPage> { }
}
