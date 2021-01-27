/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Validators;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Linq;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Pages
{
    [TestClass]
    public class ProductSearchPageTest : TestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestMethod]
        public async Task SearchProductSuccess()
        {
            // Search product page
            var categoryListPage = new CategoryListPage();

            // Load categories
            await categoryListPage.LoadCategoriesCommand.ExecuteAsync();
            categoryListPage.ParentCategory = categoryListPage.SubCategories.Where(c => c.Data.Name == "Fashion Accessories").Single();

            // Load Sub categories
            await categoryListPage.LoadCategoriesCommand.ExecuteAsync();

            // Open Product list page. Use Category Id to get the product list
            categoryListPage.ParentCategory = categoryListPage.SubCategories.Where(c => c.Data.Name == "Fashion Sunglasses").Single();
            var ProductListPage = new ProductListPage(categoryListPage.ParentCategory.Data.RecordId);
            // Load Product List 
            await ProductListPage.LoadProductsCommand.ExecuteAsync();

            var ProductSearchPage = new ProductSearchPage();
            ProductSearchPage.SearchQuery = "Gift Card";

            // Product search event Gift Card
            await ProductSearchPage.SearchProductsCommand.ExecuteAsync();

            // Assert
            ProductValidator.AssertEqual("ProductSearch_GiftCard", ProductSearchPage.Products);
        }

    }
}
