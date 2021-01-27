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
using Plugin.Settings;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Pages
{
    [TestClass]
    public class EvaluationModeSettingsTest : TestBase
    {
        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestMethod]
        public async Task EvaluateModeSettingsSuccess()
        {
            EvaluationModeSettingsPage evalObj = new EvaluationModeSettingsPage();

            //OperatingUnitNumber for contoso
            evalObj.OperatingUnitNumber = "068";

            evalObj.SaveSettingsCommand.Execute(null);

            var categoryListPageContoso = new CategoryListPage();

            // Load categories
            await categoryListPageContoso.LoadCategoriesCommand.ExecuteAsync();

            CategoryValidator.AssertEqual("Contoso_TopLevelCategories", categoryListPageContoso.SubCategories);

            evalObj.ResetSettingsCommand.Execute(null);

            var categoryListPageFabrikam = new CategoryListPage();

            //Reset settings to default so it will load categories for Fabrikam 
            await categoryListPageFabrikam.LoadCategoriesCommand.ExecuteAsync();

            CategoryValidator.AssertEqual("TopLevelCategories", categoryListPageFabrikam.SubCategories);
        }

    }
}
