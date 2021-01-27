/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.ShoppingApp.ViewModel.Settings;
using System.Linq;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities
{
    public class Category : EntityBase<Data.Entities.Category>
    {
        string _primaryImageUrl;

        public Category(Data.Entities.Category category) : base(category)
        {
            _primaryImageUrl = category.Images?.Where(ml => ml.IsDefault ?? false).FirstOrDefault()?.Uri ?? 
                category.Images?.FirstOrDefault()?.Uri;
        }

        public string ImageUrl
        {
            get
            {
                return GetFullImageUrl(_primaryImageUrl);
            }
        }

        public bool HasSubCategories { get; set; }
    }
}
