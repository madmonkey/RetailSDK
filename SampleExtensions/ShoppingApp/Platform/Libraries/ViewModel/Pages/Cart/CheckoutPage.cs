/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */


namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    using Localization;
    using Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities;
    using Plugin.Toasts;
    using System;
    using System.Collections.ObjectModel;
    using System.Threading.Tasks;
    using Contoso.Commerce.Client.ShoppingApp.ViewModel.Toasts;

    [CLSCompliant(false)]
    public class CheckoutPage : PageBase
    {
        private CartTenderLine _creditCardTenderLine;
        public CartTenderLine CreditCardTenderLine
        {
            get { return _creditCardTenderLine; }
            set { SetProperty(ref _creditCardTenderLine, value); }
        }

        private Cart _checkoutCart;
        public Cart CheckoutCart
        {
            get { return _checkoutCart; }
            set { SetProperty(ref _checkoutCart, value); }
        }

        public Order Order { get; set; }

        private bool _isPlaceOrderReady;
        public bool IsPlaceOrderReady
        {
            get { return _isPlaceOrderReady; }
            set { SetProperty(ref _isPlaceOrderReady, value); }
        }

        ObservableCollection<CartLine> _checkoutCartLines;
        public ObservableCollection<CartLine> CheckoutCartLines
        {
            get { return _checkoutCartLines; }
            set { SetProperty(ref _checkoutCartLines, value); }
        }

        public CheckoutPage()
        {
            CheckoutCartLines = new ObservableCollection<CartLine>();
            LoadCheckoutCartCommand = new AsyncCommand(ExecuteLoadCheckoutCartCommand, this);
            PlaceOrderCommand = new AsyncCommand(ExecutePlaceOrderCommand, this);
            IsPlaceOrderReady = false;
        }

        /// <summary>
        /// Command to load checkout cart.
        /// </summary>
        public AsyncCommand LoadCheckoutCartCommand { get; private set; }

        private async Task ExecuteLoadCheckoutCartCommand()
        {
            CheckoutCart = ServiceManager.CartService.CheckoutCart;
            CreditCardTenderLine = ServiceManager.CartService.CreditCardTenderLine;

            if (CreditCardTenderLine != null &&
                CheckoutCart.Data.ShippingAddress != null &&
                !String.IsNullOrEmpty(CheckoutCart.Data.DeliveryMode))
            {
                IsPlaceOrderReady = true;
            }

            IsInitialized = true;
            await LoadCheckoutCartLines();
        }

        private async Task LoadCheckoutCartLines()
        {
            CheckoutCartLines = await ServiceManager.CartService.GetCartLines(CheckoutCart);
        }

        public AsyncCommand PlaceOrderCommand { get; private set; }

        private async Task ExecutePlaceOrderCommand()
        {
            var notificator = AppContainer.Resolve<IToastNotificator>();

            // If required details are not filled then show error message
            if (IsPlaceOrderReady == false)
            {
                await notificator.Notify(new NotificationOptions
                {
                    Title = Translator.Instance.GetTranslation(nameof(TextResources.Enum_ToastNotificationType_Error)),
                    Description = Translator.Instance.GetTranslation(nameof(TextResources.Pages_CheckoutPage_Place_Order_Error)),
                });
            }
            else
            {
                Order = await ServiceManager.CartService.PlaceOrder();

                var tapped = await notificator.Notify(new NotificationOptions
                {
                    Title = Translator.Instance.GetTranslation(nameof(TextResources.Enum_ToastNotificationType_Success)),
                    Description = string.Format(Translator.Instance.GetTranslation(nameof(TextResources.Pages_CheckoutPage_Cart_OrderResultMessage)), Order?.OrderNumber)
                });
            }
        }
    }
}
