/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

// The MIT License (MIT)
// 
// Copyright (c) 2015 Xamarin
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    using Entities;
    using Extensions;
    using Services;
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Threading.Tasks;

    [CLSCompliant(false)]
    public class ProductListPage : PageBase
    {
        const int PageSize = 20;

        long _CategoryId;
        public long CategoryId
        {
            get { return _CategoryId; }
            set { SetProperty(ref _CategoryId, value); }
        }

        // TODO: Move this to list view.
        public bool _isLoadingProducts;

        public bool IsLoadingProducts
        {
            get { return _isLoadingProducts; }
            set { SetProperty(ref _isLoadingProducts, value); }
        }

        ObservableCollection<ProductSearchResult> _Products;

        public ObservableCollection<ProductSearchResult> Products
        {
            get { return _Products; }
            set { SetProperty(ref _Products, value); }
        }

        public ProductListPage(long categoryId)
        {
            CategoryId = categoryId;

            Products = new ObservableCollection<ProductSearchResult>();

            LoadProductsCommand = new AsyncCommand(ExecuteLoadProductsCommand, this);
            LoadMoreProductsCommand = new AsyncCommand(ExecuteLoadMoreProductsCommand, this);
        }

        /// <summary>
        /// Command to load products
        /// </summary>
        public AsyncCommand LoadProductsCommand { get; private set; }

        async Task ExecuteLoadProductsCommand()
        {
            // Since the viewmodel is being loaded for the first time or is being reloaded, 
            // set skipCount to 0 which forces the viewmodel to drop any existing product attached to the viewmodel.
            await SearchProductsByCategoryAsync(CategoryId, skipCount: 0);

            IsInitialized = true;
        }

        public AsyncCommand LoadMoreProductsCommand { get; private set; }

        async Task ExecuteLoadMoreProductsCommand()
        {

            LoadMoreProductsCommand.ChangeCanExecute();

            if (CanLoadMore)
            {
                await SearchProductsByCategoryAsync(CategoryId, skipCount: Products.Count);
            }

            LoadMoreProductsCommand.ChangeCanExecute();
        }

        private async Task SearchProductsByCategoryAsync(long _categoryId, int skipCount)
        {
            IEnumerable<ProductSearchResult> products = await ServiceManager.ProductService.SearchProductsByCategoryAsync(_categoryId, PageSize, skipCount);

            this.CanLoadMore = (products.Count() == PageSize);

            Products.AddRange(products);
        }
    }
}

