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
    using Contoso.Commerce.Client.ShoppingApp.ViewModel.Toasts;
    using Localization;
    using Plugin.Toasts;
    using Services;
    using System;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Threading.Tasks;

    [CLSCompliant(false)]
    public class CartPage : PageBase
    {
        private bool _areCartLinesLoaded;
        public bool AreCartLinesLoaded
        {
            get { return _areCartLinesLoaded; }
            set { SetProperty(ref _areCartLinesLoaded, value); }
        }

        private Cart _cart;
        public Cart Cart
        {
            get { return _cart; }
            set { SetProperty(ref _cart, value); }
        }

        ObservableCollection<CartLine> _cartLines;
        public ObservableCollection<CartLine> CartLines
        {
            get { return _cartLines; }
            set { SetProperty(ref _cartLines, value); }
        }

        public CartPage()
        {
            Cart = new Cart(new Data.Entities.Cart());
            LoadCartCommand = new AsyncCommand(ExecuteLoadCartCommand, this);
            LoadCartLinesCommand = new AsyncCommand(ExecuteLoadCartLinesCommand, this);
            DeleteCartLineCommand = new AsyncCommand(ExecuteDeleteCartLineCommand, this);
            UpdateCartLineQuantityCommand = new AsyncCommand(ExecuteUpdateCartLineQuantityCommand, this);
            CheckoutCommand = new AsyncCommand(ExecuteCheckoutCommand, this);
        }

        /// <summary>
        /// Command to load cart.
        /// </summary>
        public AsyncCommand LoadCartCommand { get; private set; }

        private async Task ExecuteLoadCartCommand()
        {
            AreCartLinesLoaded = false;
            await UpdateCart(await ServiceManager.CartService.GetCurrentCart());
            IsInitialized = true;
        }

        /// <summary>
        /// Command to load cart lines.
        /// </summary>
        public AsyncCommand LoadCartLinesCommand { get; private set; }

        private async Task ExecuteLoadCartLinesCommand()
        {
            CartLines = await ServiceManager.CartService.GetCartLines(Cart);
            AreCartLinesLoaded = true;
        }

        public AsyncCommand DeleteCartLineCommand { get; private set; }

        private async Task ExecuteDeleteCartLineCommand(object cartLine)
        {
            if (!(cartLine is CartLine))
            {
                throw new ArgumentException("Not of type CartLine", nameof(cartLine));
            }

            var cl = cartLine as CartLine;

            CartLines.Remove(cl);

            await UpdateCart(await ServiceManager.CartService.RemoveCartLine(cl));
        }

        public AsyncCommand UpdateCartLineQuantityCommand { get; private set; }

        private async Task ExecuteUpdateCartLineQuantityCommand(object cartLine)
        {
            if (cartLine == null)
            {
                return;
            }

            if(!(cartLine is CartLine))
            {
                throw new ArgumentException("Not of type CartLine", nameof(cartLine));
            }

            var cl = cartLine as CartLine;

            int newQuantity = 0;

            var IsValid = int.TryParse(cl.NewQuantity, out newQuantity);

            if (!IsValid || newQuantity <= 0)
            {
                cl.NewQuantity = cl.Data.Quantity?.ToString();
                var notificator = AppContainer.Resolve<IToastNotificator>();
                await notificator.Notify(new NotificationOptions
                {
                    Title = Translator.Instance.GetTranslation(nameof(TextResources.Pages_CartPage_ValidationFailed)),
                    Description = Translator.Instance.GetTranslation(nameof(TextResources.Pages_CartPage_CartLineQuantityUpdateErrorMessage)),
                });
                return;
            }

            if (newQuantity != cl.Data.Quantity)
            {
                //Update quantity
                cl.Data.Quantity = newQuantity;
                await UpdateCart(await ServiceManager.CartService.UpdateCartLine(cl));
                var notificator = AppContainer.Resolve<IToastNotificator>();
                var tapped = await notificator.Notify(new NotificationOptions
                {
                    Title = Translator.Instance.GetTranslation(nameof(TextResources.Enum_ToastNotificationType_Success)),
                    Description = string.Format(Translator.Instance.GetTranslation(nameof(TextResources.Pages_CartPage_CartLineQuantityUpdateSuccessMessage)), cl.SimpleProduct.Name),
                });
            }
        }

        /// <summary>
        /// Command to checkout 
        /// </summary>
        public AsyncCommand CheckoutCommand { get; private set; }

        private async Task ExecuteCheckoutCommand()
        {
            if (CartLines == null || !CartLines.Any())
            {
                var notificator = AppContainer.Resolve<IToastNotificator>();
                var tapped = await notificator.Notify(new NotificationOptions
                {
                    Title = Translator.Instance.GetTranslation(nameof(TextResources.Enum_ToastNotificationType_Info)),
                    Description = Translator.Instance.GetTranslation(nameof(TextResources.Pages_CartPage_CartIsEmptyMessage)),
                });
                return;
            }

            await ServiceManager.CartService.CopyCartForCheckout(Cart.Data.Id);
        }

        private async Task UpdateCart(Cart cart)
        {
            Cart = cart;
            await ExecuteLoadCartLinesCommand();
        }
    }
}


