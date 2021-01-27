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
using System.Collections.Generic;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Pages
{
    [TestClass]
    public class ProductPageTest : TestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestMethod]
        public async Task ProductDetailSuccess()
        {
            var categoryListPage = new CategoryListPage();

            // Load categories
            await categoryListPage.LoadCategoriesCommand.ExecuteAsync();

            //   categoryListPage.ParentCategory = categoryListPage.SubCategories[1];
            categoryListPage.ParentCategory = categoryListPage.SubCategories.Where(c => c.Data.Name == "Menswear").Single();

            // Load Sub categories 
            await categoryListPage.LoadCategoriesCommand.ExecuteAsync();

            // Open Product list page. Use Category Id to get the product list
            categoryListPage.ParentCategory = categoryListPage.SubCategories.Where(c => c.Data.Name == "Suits & Sportcoats").Single();
            var ProductListPage = new ProductListPage(categoryListPage.ParentCategory.Data.RecordId);

            // Load Product List  
            await ProductListPage.LoadProductsCommand.ExecuteAsync();
            var product = ProductListPage.Products.Where(p => p.Data.Name == "Trim Fit Suit").First();

            var productPage = new ProductPage(product.Data.RecordId);

            // Get product details  
            await productPage.LoadProductDetailCommand.ExecuteAsync();
          
            // Assert
            ProductValidator.AssertEqual("ProductDetail_81100", productPage.Product);
        }

    }
}
