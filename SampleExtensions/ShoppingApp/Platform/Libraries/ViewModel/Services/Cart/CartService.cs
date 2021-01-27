/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Entities;
using Contoso.Commerce.Client.Data.Services;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Services;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Settings;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    public class CartService : ServiceBase
    {
        public string CartId
        {
            get
            {
                //Todo: Settings manager should be passed in to the constructor.
                return SettingsManager.Instance.ServiceSettings.CartId;
            }
            private set
            {
                SettingsManager.Instance.ServiceSettings.CartId = value;
            }
        }


        public bool CartHasItems
        {
            get
            {
                return SettingsManager.Instance.ServiceSettings.CartHasItems;
            }
            private set
            {
                var previous = SettingsManager.Instance.ServiceSettings.CartHasItems;
                SettingsManager.Instance.ServiceSettings.CartHasItems = value;

                if (previous != value)
                {
                    CartHasItemsChanged?.Invoke(this, new EventArgs());
                }
            }
        }

        public event EventHandler CartHasItemsChanged;

        public Cart CheckoutCart
        {
            get; private set;
        }

        public Entities.CartTenderLine CreditCardTenderLine
        {
            get; set;
        }

        public CartService(DataService dataService) : base(dataService)
        {
        }

        public async Task<Cart> GetCurrentCart()
        {
            if (string.IsNullOrEmpty(CartId))
            {
                return await this.CreateEmptyCart();
            }

            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            var cart = await cartManager.Read(CartId);

            if (cart == null)
            {
                return await this.CreateEmptyCart();
            }

            return new Cart(cart);
        }

        public async Task AddProduct(Entities.Product product)
        {
            await EnsureChannelSettingsRetrieved();
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            if (string.IsNullOrEmpty(CartId))
            {
                await CreateEmptyCart();
            }

            long productId = 0;

            switch (product.Data.ProductTypeValue)
            {
                case (int)ProductType.Master:
                    var productManager = DataService.ManagerFactory.GetManager<IProductManager>();
                    var queryResultSettings = new QueryResultSettings() { Paging = new PagingInfo { Skip = 0, Top = 1 } };
                    var variant = (await productManager.GetVariantsByDimensionValues(product.Data.RecordId, ChannelId, product.Dimensions.Select((d) => d.Data).ToList(), queryResultSettings)).Results.FirstOrDefault(); ;
                    productId = variant.RecordId;
                    break;
                case (int)ProductType.Standalone:
                    productId = product.Data.RecordId;
                    break;
            }

            await cartManager.AddCartLines(CartId, new List<Data.Entities.CartLine> { new Data.Entities.CartLine { ProductId = productId, Quantity = 1 } });
            CartHasItems = true;
        }

        public async Task<Cart> RemoveCartLine(CartLine cl)
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();
            var cart = new Cart(await cartManager.RemoveCartLines(CartId, new List<string> { cl.Data.LineId }));

            if (cart.Data.CartLines.Count == 0)
            {
                CartHasItems = false;
            }

            return cart;
        }

        public async Task<Cart> UpdateCartLine(CartLine cl)
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();
            return new Cart(await cartManager.UpdateCartLines(CartId, new List<Data.Entities.CartLine> { cl.Data }));
        }

        public async Task<ObservableCollection<CartLine>> GetCartLines(Cart cart)
        {
            if (cart?.Data?.CartLines == null || cart.Data.CartLines.Count == 0)
            {
                return new ObservableCollection<CartLine>();
            }

            var cartLines = cart.Data.CartLines;

            await EnsureChannelSettingsRetrieved();
            var productManager = DataService.ManagerFactory.GetManager<IProductManager>();

            var productIds = cartLines.Select(cl => cl.ProductId.Value);
            var products = await this.GetAll<SimpleProduct>((qs) =>
            {
                var subsetProductIds = productIds.Skip(Convert.ToInt32(qs.Paging.Skip.Value)).Take(Convert.ToInt32(qs.Paging.Top)).ToArray();
                return productManager.GetByIds(ChannelId,
                    subsetProductIds,
                    new QueryResultSettings { Paging = new PagingInfo { Top = subsetProductIds.Count(), Skip = 0 } });
            });

            return new ObservableCollection<CartLine>(
                             from cl in cartLines
                             join p in products
                             on cl.ProductId equals p.RecordId
                             select new CartLine(cl, p));
        }

        private async Task<Cart> CreateEmptyCart()
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            var cart = await cartManager.Create(new Data.Entities.Cart() { Id = string.Empty });
            CartId = cart.Id;
            CartHasItems = false;
            return new Cart(cart);
        }

        public async Task<CardPaymentAcceptPoint> GetCardPaymentAcceptPoint(Uri hostPageUrl)
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            string hostPageOrigin = $"{hostPageUrl.Scheme}://{hostPageUrl.Authority}".ToLowerInvariant();
            CardPaymentAcceptSettings cardPaymentAcceptSettings = new CardPaymentAcceptSettings
            {
                CardPaymentEnabled = false,
                CardTokenizationEnabled = true,
                HostPageOrigin = hostPageOrigin
            };

            return await cartManager.GetCardPaymentAcceptPoint(CheckoutCart.Data.Id, cardPaymentAcceptSettings);
        }

        public async Task<CardPaymentAcceptResult> GetCardPaymentAcceptResult(string resultAccessCode)
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();
            return await cartManager.RetrieveCardPaymentAcceptResult(resultAccessCode);
        }

        public async Task AddCartTenderLine(CardPaymentAcceptResult cardPaymentAcceptResult, string cardTypeId, StoreOperationsService storeOperationsService)
        {
            await EnsureChannelSettingsRetrieved();

            TokenizedPaymentCard tokenizedPaymentCard = cardPaymentAcceptResult.TokenizedPaymentCard;
            tokenizedPaymentCard.CardTypeId = cardTypeId;

            decimal? cardAmount = CheckoutCart.Data.TotalAmount;
            var tenderTypeIds = await storeOperationsService.GetTenderTypes();

            var tenderTypeId = tenderTypeIds.Where(ttype => ttype.OperationId == (int)RetailOperation.PayCard).FirstOrDefault().TenderTypeId;

            if (tenderTypeId == null)
            {
                throw new DataServiceException(new Exception("Credit card payment is not configured"));
            }

            CreditCardTenderLine = new Entities.CartTenderLine( new CartTenderLine
            {
                CardTypeId = tokenizedPaymentCard.CardTypeId,
                Currency = Currency,
                TenderTypeId = tenderTypeId,
                TokenizedPaymentCard = tokenizedPaymentCard,
            });
        }

        public async Task<Entities.Order> PlaceOrder()
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            if (CreditCardTenderLine == null)
            {
                return null;
            }

            CreditCardTenderLine.Data.Amount = CheckoutCart.Data.TotalAmount;

            SalesOrder salesOrder = await cartManager.Checkout(CheckoutCart.Data.Id, CheckoutCart.Data.ShippingAddress.Email, null, null, new[] { CreditCardTenderLine.Data });

            DeleteCart();

            return new Entities.Order(salesOrder);
        }

        public async Task<Cart> UpdateDeliveryOption(DeliveryOption deliveryOption)
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            DeliverySpecification deliverySpec = new DeliverySpecification
            {
                DeliveryAddress = CheckoutCart.Data.ShippingAddress,
                DeliveryPreferenceTypeValue = (int)DeliveryPreferenceType.ShipToAddress,
                DeliveryModeId = deliveryOption.Data.Code,
            };

            CheckoutCart = new Cart(await cartManager.UpdateDeliverySpecification(CheckoutCart.Data.Id, deliverySpec));
            CheckoutCart.DeliveryOption = deliveryOption;
            return CheckoutCart;
        }

        /// <summary>
        /// Gets the applicable delivery preferences for the specified cart.
        /// </summary>
        /// <returns>A collection of delivery preferences.</returns>
        public async Task<CartDeliveryPreferences> GetDeliveryPreference()
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            return await cartManager.GetDeliveryPreferences(CheckoutCart.Data.Id);
        }

        /// <summary>
        /// Updates the cart with the specified delivery specification.
        /// </summary>
        /// <param name="lineDeliverySpecifications">The cart line delivery specification.</param>
        /// <returns>The updated cart object.</returns>
        /// <remarks>The method is not applicable if the delivery preference is set on the cart header.</remarks>
        public async Task<Cart> UpdateLineDeliverySpecification(IEnumerable<Data.Entities.LineDeliverySpecification> lineDeliverySpecifications)
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            CheckoutCart = new Cart(await cartManager.UpdateLineDeliverySpecifications(CheckoutCart.Data.Id, lineDeliverySpecifications));
            return CheckoutCart;
        }

        public async Task CopyCartForCheckout(string cartId)
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            CheckoutCart = new Cart(await cartManager.Copy(cartId, (int)CartType.Checkout));
            CreditCardTenderLine = null;
        }

        /// <summary>
        /// Gets a list of delivery option to the specified shipping address for the current cart.
        /// </summary>
        /// <param name="shippingAddress">The shipping address specified by the user.</param>
        /// <returns>A collection of delivery options.</returns>
        public async Task<ObservableCollection<DeliveryOption>> GetCartDeliveryOptions(Data.Entities.Address shippingAddress)
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            var deliveryOptions = await this.GetAll<Data.Entities.DeliveryOption>(qs => cartManager.GetDeliveryOptions(CheckoutCart.Data.Id, shippingAddress, qs));
            return new ObservableCollection<DeliveryOption>(deliveryOptions.Select(deliveryOption => new DeliveryOption(deliveryOption)));
        }

        /// <summary>
        /// Update the checkout cart
        /// </summary>
        public async Task UpdateCheckoutCart()
        {
            ICartManager cartManager = DataService.ManagerFactory.GetManager<ICartManager>();

            await cartManager.Update(CheckoutCart.Data);
        }

        public void DeleteCart()
        {
            // Todo: Delete the cart from Retail server.
            //Clear the cart and checkout cart.
            ClearCart();
        }

        public void ClearCart()
        {
            CartId = null;
            CartHasItems = false;
            CheckoutCart = null;
            CreditCardTenderLine = null;
        }
    }
}
