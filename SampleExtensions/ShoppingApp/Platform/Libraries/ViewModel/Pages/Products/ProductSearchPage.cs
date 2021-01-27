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
    using Entities;
    using Extensions;
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Threading.Tasks;

    [CLSCompliant(false)]
    public class ProductSearchPage : PageBase
    {
        const int PageSize = 20;

        ObservableCollection<ProductSearchResult> _Products;

        public ProductSearchPage()
        {
            _Products = new ObservableCollection<ProductSearchResult>();

            SearchProductsCommand = new AsyncCommand(ExecuteSearchProductsCommand, this);
            LoadMoreProductsCommand = new AsyncCommand(ExecuteLoadMoreProductsCommand, this);
        }

        public ObservableCollection<ProductSearchResult> Products
        {
            get { return _Products; }
            set { SetProperty(ref _Products, value); }
        }

        string _SearchQuery;

        public string SearchQuery
        {
            get { return _SearchQuery; }
            set { SetProperty(ref _SearchQuery, value); }
        }

        public AsyncCommand SearchProductsCommand { get; private set; }

        async Task ExecuteSearchProductsCommand()
        {
            Products.Clear();
            await SearchProductsByTextAsync(_SearchQuery, skipCount: 0);
            IsInitialized = true;
        }

        public AsyncCommand LoadMoreProductsCommand { get; private set; }

        async Task ExecuteLoadMoreProductsCommand()
        {
            if (this.CanLoadMore)
            {
                await SearchProductsByTextAsync(_SearchQuery, skipCount: Products.Count);
            }
        }

        private async Task SearchProductsByTextAsync(string searchText, int skipCount)
        {
            IEnumerable<ProductSearchResult> _products = await ServiceManager.ProductService.SearchProductsByTextAsync(searchText, PageSize, skipCount);

            this.CanLoadMore = (_products.Count() == PageSize);

            Products.AddRange(_products);
        }
    }
}
