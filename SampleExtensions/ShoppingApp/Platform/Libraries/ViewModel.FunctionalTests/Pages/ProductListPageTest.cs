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

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Pages
{
    [TestClass]
    public class ProductListPageTest : TestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestMethod]
        public async Task LoadProductListSuccess()
        {
            var categoryListPage = new CategoryListPage();

            // Load categories
            await categoryListPage.LoadCategoriesCommand.ExecuteAsync();

            categoryListPage.ParentCategory = categoryListPage.SubCategories[0];

            // Load Sub categories
            await categoryListPage.LoadCategoriesCommand.ExecuteAsync();

            // Open Product list page. Use Category Id to get the product list
            var ProductListPage = new ProductListPage(categoryListPage.SubCategories[0].Data.RecordId);

            // Load Product List
            await ProductListPage.LoadProductsCommand.ExecuteAsync();

            // Assert - ProductList Json
            ProductValidator.AssertEqual("ProductList_FashionSunglasses", ProductListPage.Products);
        }

    }
}
