/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using System;
using System.Collections.Generic;
using System.Linq;
using Contoso.Commerce.Client.Data.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Settings;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    public class CartLine : EntityBase<Data.Entities.CartLine>
    {
        public CartLine(Data.Entities.CartLine cartLine) : base(cartLine)
        {
        }

        public CartLine(Data.Entities.CartLine cartLine, SimpleProduct simpleProduct) : this(cartLine)
        {
            SimpleProduct = simpleProduct;
            NewQuantity = Data.Quantity?.ToString();
        }

        public SimpleProduct SimpleProduct { get; set; }

        private string _formattedDiscountNames;
        public string FormattedDiscountNames
        {
            get
            {
                if (_formattedDiscountNames == null)
                {
                    var discountNames = this.Data.DiscountLines?.Select(d => d.OfferName);
                    _formattedDiscountNames = discountNames == null ? string.Empty : string.Join(",", discountNames);
                }

                return _formattedDiscountNames;
            }
        }

        public string ImageUrl
        {
            get
            {
                return GetFullImageUrl(SimpleProduct.PrimaryImageUrl);
            }
        }

        /// <summary>
        /// Binds to the UI and serves as a staging place before the actual quantity value is updated.
        /// Also allows for comparison between old and new value.
        /// Can be out of sync with Data.Quantity.
        /// </summary>
        private string _newQuantity;
        public string NewQuantity
        {
            get
            {
                return _newQuantity;
            }
            set
            {
                SetProperty(ref _newQuantity, value);
            }
        }
    }
}

