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
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Settings;
using System;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.View.Views
{
    [CLSCompliant(false)]
    public class CartToolbarItem : ToolbarItemBase
    {
        public static readonly string CartHasItemsPropertyName = "CartHasItems";
        public static readonly BindableProperty CartHasItemsProperty = BindableProperty.Create(CartHasItemsPropertyName, typeof(bool), typeof(PageBase), false, propertyChanged: OnCartHasItemsChanged);

        public bool CartHasItems
        {
            get { return (bool)GetValue(CartHasItemsProperty); }
            set { SetValue(CartHasItemsProperty, value); }
        }

        public CartToolbarItem() : base()
        {
            Setup();
        }

        public CartToolbarItem(INavigation Navigation)
        {
            this.Navigation = Navigation;
            Setup();
        }

        private void Setup()
        {
            Text = Translator.Instance.GetTranslation(nameof(TextResources.Views_CartToolBarItem_Cart));

            SetIcon(this, SettingsManager.Instance.ServiceSettings.CartHasItems);

            Order = ToolbarItemOrder.Primary;

            Clicked += async (s, e) =>
            {
                if (Navigation != null)
                {
                    await Navigation.PushAsync(new Pages.CartPage
                    {
                        BindingContext = new ViewModel.CartPage { Navigation = Navigation }
                    });
                }
            };
        }

        static void OnCartHasItemsChanged(BindableObject bindable, object oldValue, object newValue)
        {
            SetIcon((CartToolbarItem)bindable, (bool)newValue);
        }

        public override void Refresh()
        {
            base.Refresh();

            SetIcon(this, SettingsManager.Instance.ServiceSettings.CartHasItems);
        }

        private static void SetIcon(CartToolbarItem cartToolBarItem, bool cartHasItems)
        {
            if (cartHasItems == true)
            {
                cartToolBarItem.IconImageSource = ImageSource.FromFile("cart_filled.png");
            }
            else
            {
                cartToolBarItem.IconImageSource = ImageSource.FromFile("cart.png");
            }
        }
    }
}
