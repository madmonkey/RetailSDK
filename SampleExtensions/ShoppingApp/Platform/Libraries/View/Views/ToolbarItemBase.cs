/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using System;
using Contoso.Commerce.Client.ShoppingApp.ViewModel;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.View.Views
{
    [CLSCompliant(false)]
    public class ToolbarItemBase : ToolbarItem
    {
        public static readonly string NavigationPropertyName = "Navigation";
        public static readonly BindableProperty NavigationProperty = BindableProperty.Create(NavigationPropertyName, typeof(INavigation), typeof(PageBase), null);

        public INavigation Navigation
        {
            get { return (INavigation)GetValue(NavigationProperty); }
            set { SetValue(NavigationProperty, value); }
        }

        public virtual void Refresh()
        {
        }
    }
}

