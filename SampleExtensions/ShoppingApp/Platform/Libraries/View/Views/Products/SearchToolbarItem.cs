/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.ShoppingApp.ViewModel;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Localization;
using System;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.View.Views
{
    [CLSCompliant(false)]
	public class SearchToolbarItem : ToolbarItemBase 
    {
        public SearchToolbarItem() : base()
        {
			Text = Translator.Instance.GetTranslation(nameof(TextResources.Views_SearchToolBarItem_Search));
            IconImageSource = ImageSource.FromFile("search.png");
            Order = ToolbarItemOrder.Primary;

            Clicked += async (s, e) =>
            {
				if (Navigation != null)
				{
					await Navigation.PushAsync(new Pages.ProductSearchPage
                    {
						BindingContext = new ViewModel.ProductSearchPage { Navigation = Navigation }
					});
				}
            };
        }
    }
}
