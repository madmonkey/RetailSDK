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

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Pages
{
    [TestClass]
    public class CategoryListPageTest: TestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestMethod]
        public async Task LoadTopLevelCategoriesSuccess()
        {
            // Open top level category list page
            var categoryListPage = new CategoryListPage();

            // Load categories
            await categoryListPage.LoadCategoriesCommand.ExecuteAsync();

            // Assert
            CategoryValidator.AssertEqual("TopLevelCategories", categoryListPage.SubCategories);
        }

        [TestMethod]
        public async Task LoadSubCategoriesSuccess()
        {
            // Open top level category list page
            var categoryListPage = new CategoryListPage();

            // Load categories
            await categoryListPage.LoadCategoriesCommand.ExecuteAsync();

            categoryListPage.ParentCategory = categoryListPage.SubCategories[0];

            // Load Sub categories
            await categoryListPage.LoadCategoriesCommand.ExecuteAsync();

            // Assert
            CategoryValidator.AssertEqual("SubCategories_FashionAccessories", categoryListPage.SubCategories);
        }

    }
}
