/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso
{
    namespace Retail.Ecommerce.Publishing
    {
        using System;
        using System.Configuration;
        using System.Diagnostics;
        using System.Linq;
        using Retail.Ecommerce.Sdk.Core.Publishing;

        internal class Program
        {
            private static void Main()
            {
                const int PageSize = 100;
                const bool IncludeCataloglessPublishing = false;
                const bool ForceTimingInfoLogging = false;
                const long DeletedListingsPageSize = 1000;

                try
                {
                    // Creating publishing configuration by specifying page sizes and so on.
                    PublishingConfiguration publishingConfig = new PublishingConfiguration(PageSize, PageSize, IncludeCataloglessPublishing, PageSize, ForceTimingInfoLogging, DeletedListingsPageSize);

                    // Reading application configuration
                    Configuration appConfig = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
                    Console.WriteLine(appConfig);

                    string clientId = ConfigurationManager.AppSettings["aadClientId"];
                    string clientSecret = ConfigurationManager.AppSettings["aadClientSecret"];
                    string authority = ConfigurationManager.AppSettings["aadAuthority"];
                    string retailServerUrl = ConfigurationManager.AppSettings["retailServerUrl"];
                    string operatingUnitNumber = ConfigurationManager.AppSettings["operatingUnitNumber"];

                    // Instantiating an instance of publisher.
                    Publisher publisher = new Publisher(publishingConfig, operatingUnitNumber, new Uri(retailServerUrl), new Uri(authority), clientId, clientSecret);

                    Trace.TraceInformation("Initiating channel publishing ...\r\n");

                    IChannelPublisher channelPublisher = new ChannelPublisher();
                    PublishingParameters parameters = publisher.PublishChannel(channelPublisher).Result;

                    Trace.TraceInformation("Channel publishing completed.\r\n Number of categories read={0}. Number of channel attributes ={1}.", parameters.Categories.Count(), parameters.ProductsAttributes.Count());

                    Trace.TraceInformation("Initiating catalog publishing ...");
                    ICatalogPublisher catalogPublisher = new CatalogPublisher(publisher);
                    bool changesDetected = publisher.PublishCatalog(catalogPublisher).Result;

                    Trace.TraceInformation("Catalog publishing completed. Changes detected = " + changesDetected);
                }
                catch (Exception ex)
                {
                    Trace.TraceError(ex.ToString());
                }
            }
        }
    }
}