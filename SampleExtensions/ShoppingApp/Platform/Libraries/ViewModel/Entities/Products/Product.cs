/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Settings;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;


namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities
{
    public class Product : EntityBase<Data.Entities.SimpleProduct>
    {
        public Product(SimpleProduct product, ProductPrice activePrice) : base(product)
        {
            Dimensions = new ObservableCollection<Dimension>();

            ActivePrice = activePrice;

            for (int i = 0; i < product.Dimensions.Count; i++)
            {
                var productDimension = product.Dimensions[i];
                Dimensions.Add(new Dimension(productDimension)
                {
                    IsEnabled = false,
                    DisplayOrderIndex = i
                });
            }
        }

        public ProductPrice ActivePrice { get; private set; }

        public string ImageUrl
        {
            get
            {
                return GetFullImageUrl(Data.PrimaryImageUrl);
            }
        }

        public ObservableCollection<Dimension> Dimensions
        {
            get;
        }
    }
}
