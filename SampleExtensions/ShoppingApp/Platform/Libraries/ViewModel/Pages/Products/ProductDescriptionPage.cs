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
    using Authentication;
    using Data.Entities;
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using Xamarin.Forms;
    using System.Collections.ObjectModel;

    [CLSCompliant(false)]
    public class ProductDescriptionPage : PageBase
    {
        private long _productId;
        private ObservableCollection<AttributeValue> _attributeValue;

        public ObservableCollection<AttributeValue> AttributeValues
        {
            get { return _attributeValue; }
            set { SetProperty(ref _attributeValue, value); }
        }

        public ProductDescriptionPage(long recordId)
        {
            _productId = recordId;
            _attributeValue = new ObservableCollection<AttributeValue>();
            LoadProductDescriptionCommand = new AsyncCommand(ExecuteLoadProductDescriptionCommand, this);
        }

        public AsyncCommand LoadProductDescriptionCommand { get; private set; }

        private async Task ExecuteLoadProductDescriptionCommand()
        {
            var productSpecification = await ServiceManager.ProductService.GetProductSpecificationById(_productId);
            AttributeValues = new ObservableCollection<AttributeValue>(productSpecification.Where(v => !string.IsNullOrWhiteSpace(v.Value)));
        }
    }
}

