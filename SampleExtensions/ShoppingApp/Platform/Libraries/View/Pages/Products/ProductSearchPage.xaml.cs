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
    using ViewModel.Entities;
    using Views;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public partial class ProductSearchPage : ProductSearchPageXaml
    {
        public ProductSearchPage()
        {
            InitializeComponent();

            if (Device.RuntimePlatform == Device.Android)
            {
                ToolbarItems.Insert(0, new CartToolbarItem(Navigation));
            }
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            foreach (var toolbarItem in ToolbarItems)
            {
                ((ToolbarItemBase)toolbarItem).Refresh();
            }

            ProductSearchBar.Focus();
        }

        async void ProductItemTapped(object sender, ItemTappedEventArgs e)
        {
            ProductSearchResult productSearchResult = ((ProductSearchResult)e.Item);
            await Navigation.PushAsync(new ProductPage() { BindingContext = new ViewModel.ProductPage(productSearchResult.Data.RecordId) { Navigation = ViewModel.Navigation } });
        }
    }

    [CLSCompliant(false)]
	public abstract class ProductSearchPageXaml : ModelBoundContentPage<ViewModel.ProductSearchPage> { }
}
