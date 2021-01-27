namespace Contoso.SampleExtensions.IntegrationTests
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Threading.Tasks;
    using Contoso.Commerce.RetailProxy.StoreHoursSample;
    using Microsoft.Dynamics.Commerce.RetailProxy;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using MS.Dynamics.TestTools.Metadata;
    /// <summary>
    /// This class implements the integration tests for StoreHours Sample extension.
    /// </summary>
    [TestClass]
    public class StoreHoursSampleIntegrationTest
    {
        private static ManagerFactory managerFactory;

        /// <summary>
        /// Ensures that the call to GetStoreDaysByStore does not throw an exception and returns 0 rows.
        /// </summary>
        /// <returns>A task.</returns>
        [TestMethod]
        [TestOwner("mimalik")]
        [TestStatus(TestStatus.Complete)]
        [TestPriority(Priority.P1)]
        [ExecutionGroup(ExecutionGroup.BVT)]
        [TestKey("B515C712-6C9D-4A26-B0BC-BA9329B57130")]
        public async Task StoreHoursSample_GetStoreDaysByStore_ExpectsZeroRowsReturned()
        {

            //Arrange
            RetailServerContext.Initialize(new IEdmModelExtension[]
            {
                  new Contoso.Commerce.RetailProxy.StoreHoursSample.EdmModel()
            });
            var RetailServerUrl = ConfigurationManager.AppSettings["RetailServerUrl"] + "/Commerce";
            var OperatingUnitNumber = ConfigurationManager.AppSettings["OperatingUnitNumber"];
            var StoreNumber = ConfigurationManager.AppSettings["StoreNumber"];

            RetailServerContext context = RetailServerContext.Create(
                new Uri(RetailServerUrl),
                OperatingUnitNumber);

            managerFactory = ManagerFactory.Create(context);
            IStoreDayHoursManager storeDayHoursManager
                        = managerFactory.GetManager<IStoreDayHoursManager>();

            //Act
            QueryResultSettings queryResultSettings = new QueryResultSettings();
            PagingInfo pagingInfo = new PagingInfo();
            pagingInfo.Top = 10;
            pagingInfo.Skip = 0;
            queryResultSettings.Paging = pagingInfo;
            var result = await storeDayHoursManager.GetStoreDaysByStore(StoreNumber, queryResultSettings);

            //Assert
            Assert.IsNotNull(result.Results);
        }
    }
}