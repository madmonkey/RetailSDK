/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests
{
    [TestClass]
    public class TestBase
    {
        static TestBase()
        {
            // Base class init
        }

        [TestInitialize]
        public void BaseTestInitialize()
        {
            AppContainer.Instance = new AppContainer();
            new EvaluationModeSettingsPage().ResetSettingsCommand.Execute(null);
        }

        [TestCleanup]
        public void BaseTestCleanup()
        {
        }
    }
}
