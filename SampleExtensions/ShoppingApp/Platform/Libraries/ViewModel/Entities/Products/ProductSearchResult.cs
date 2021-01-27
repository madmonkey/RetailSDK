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

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities
{
    public class ProductSearchResult : EntityBase<Data.Entities.ProductSearchResult>
    {
        public ProductSearchResult(Data.Entities.ProductSearchResult productSearchResult, ProductPrice productPrice): base(productSearchResult)
        {
            ActivePrice = productPrice;
        }

        public ProductPrice ActivePrice { get; private set; }

        public string ImageUrl
        {
            get
            {
                return GetFullImageUrl(Data.PrimaryImageUrl);
            }
        }
    }
}
