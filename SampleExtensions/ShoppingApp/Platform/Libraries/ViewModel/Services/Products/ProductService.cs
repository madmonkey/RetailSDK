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
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.ObjectModel;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Services
{
    public class ProductService : ServiceBase
    {
        public ProductService(DataService dataService) : base(dataService)
        {
        }

        /// <summary>
        /// Gets list of products under the specified category.
        /// </summary>
        /// <param name="categoryId">The category Id.</param>
        /// <param name="pageSize">The page size, i.e. The number of records to retrieve.</param>
        /// <param name="skipCount">The number of records to skip.</param>
        /// <returns>A collection of <c>ViewModel.Entities.ProductSearchResult</c> objects.</returns>
        public async Task<IEnumerable<Entities.ProductSearchResult>> SearchProductsByCategoryAsync(long categoryId, int pageSize, int skipCount)
        {
            await EnsureChannelSettingsRetrieved();

            QueryResultSettings queryResultSettings = new QueryResultSettings();
            queryResultSettings.Paging = new PagingInfo { Top = (long)pageSize, Skip = skipCount };

            IProductManager productManager = DataService.ManagerFactory.GetManager<IProductManager>();
            PagedResult<ProductSearchResult> productSearchResults = await productManager.SearchByCategory(ChannelId, 0, categoryId, queryResultSettings);

            return await getProductSearchResult(productSearchResults);
        }

        /// <summary>
        /// Search products based on the specified text.
        /// </summary>
        /// <param name="searchText">The search string.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="skipCount">The number of records to skip.</param>
        /// <returns>A collection of <c>ViewModel.Entities.ProductSearchResult</c> objects.</returns>
        public async Task<IEnumerable<Entities.ProductSearchResult>> SearchProductsByTextAsync(string searchText, int pageSize, int skipCount)
        {
            await EnsureChannelSettingsRetrieved();

            QueryResultSettings queryResultSettings = new QueryResultSettings();
            queryResultSettings.Paging = new PagingInfo { Top = (long)pageSize, Skip = skipCount };

            IProductManager productManager = DataService.ManagerFactory.GetManager<IProductManager>();

            PagedResult<ProductSearchResult> productSearchResults = await productManager.SearchByText(ChannelId, 0, searchText, queryResultSettings);

            return await getProductSearchResult(productSearchResults);
        }

        public async Task<Entities.Product> GetProductById(long productId)
        {
            await EnsureChannelSettingsRetrieved();

            IProductManager productManager = DataService.ManagerFactory.GetManager<IProductManager>();

            SimpleProduct simpleProduct = await productManager.GetById(productId, ChannelId);

            var activePrices = await this.GetActivePrices(new List<long> { productId });

            return new Entities.Product(simpleProduct, activePrices.FirstOrDefault());
        }

        public async Task<IEnumerable<AttributeValue>> GetProductSpecificationById(long productId)
        {
            await EnsureChannelSettingsRetrieved();

            IProductManager productManager = DataService.ManagerFactory.GetManager<IProductManager>();

            var attributeValues = await this.GetAll<Data.Entities.AttributeValue>(qs => productManager.GetAttributeValues(productId, ChannelId, 0, qs));

            return attributeValues.Select(attributeValue => new AttributeValue(attributeValue)); ;
        }

        public async Task<ObservableCollection<ProductDimensionValue>> GetDimensionOptions(long productId, ProductDimensionType dimensionType, IEnumerable<ProductDimension> productDimensions)
        {
            await EnsureChannelSettingsRetrieved();

            var productManager = DataService.ManagerFactory.GetManager<IProductManager>();

            var productDimensionValues = await this.GetAll<ProductDimensionValue>((qs) =>
            {
                return productManager.GetDimensionValues(productId, ChannelId, (int)dimensionType, productDimensions.ToList(), null, qs);
            });

            return new ObservableCollection<ProductDimensionValue>(new ObservableCollection<ProductDimensionValue>(productDimensionValues));
        }

        /// <summary>
        /// Gets a list of product search results including their active price.
        /// </summary>
        /// <param name="productSearchResults">The search result from server.</param>
        /// <returns>A collection of <c>Entities.ProductSearchResult></c>.</returns>
        private async Task<IEnumerable<Entities.ProductSearchResult>> getProductSearchResult(PagedResult<ProductSearchResult> productSearchResults)
        {
            IProductManager productManager = DataService.ManagerFactory.GetManager<IProductManager>();

            IEnumerable<Entities.ProductSearchResult> products = Enumerable.Empty<Entities.ProductSearchResult>();

            if (productSearchResults.Any()) // dont make server call if there are no search results.
            {
                var productIds = productSearchResults.Select(p => p.RecordId);

                var prices = await this.GetActivePrices(productIds);

                products = from product in productSearchResults
                           join price in prices
                           on product.RecordId equals price.ProductId into activePrices
                           from activePrice in activePrices.DefaultIfEmpty()
                           select new Entities.ProductSearchResult(product, activePrice);
            }

            return products;
        }

        private async Task<PagedResult<ProductPrice>> GetActivePrices(IEnumerable<long> productIds)
        {
            IProductManager productManager = DataService.ManagerFactory.GetManager<IProductManager>();

            ProjectionDomain projectionDomain = new ProjectionDomain { ChannelId = ChannelId, CatalogId = 0 };

            var _productIds = productIds.Distinct().ToList();

            // TODO: yonase - For signed in user make sure this call takes into account 
            // the signed in user (i.e. gets signed in user from the request context)

            var activePrices = await productManager.GetActivePrices(
                projectionDomain,               // The channel & catalog for which the price is being retrieved for.
                _productIds,                    // The product whose active price is being retrieved.
                DateTimeOffset.UtcNow,          // The date effectivity for the price.
                string.Empty,                   //Customer Id.
                null,                           //Affiliation loyalty tier.
                new QueryResultSettings
                {
                    Paging = new PagingInfo { Skip = 0, Top = _productIds.Count }
                }
                );

            return activePrices;
        }
    }
}
