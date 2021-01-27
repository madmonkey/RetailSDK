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
    namespace Commerce.Runtime.TestHost
    {
        using System;
        using System.Collections.Generic;
        using System.Diagnostics;
        using System.Threading.Tasks;
        using CrossLoyaltySample.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Client;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using StoreHoursSample.Messages;

        internal static class Program
        {
            private const string DefaultCustomerAccountNumber = "100001";
            private static CommerceRuntime runtime = null;
            private const string loyaltyCardNumber = "LoyaltyCardNumber-1";
            private const long channelId = 5637144592;
            private const long partyRecordId = 22565425698;


            private static void Main()
            {
                // This is a sample test host for the CommerceRuntime. Use it during development to get your extensions to work or troubleshoot. 
                // In order to setup, you must 
                //    1) configure the commerceRuntime.ext.config for the correct assemblies and types (according to your environment/customization)
                //    2) configure the commerceRuntime.config for the default channel (i.e. <storage defaultOperatingUnitNumber="052" />)
                //    3) configure the app.config's connection string for Houston to point to a valid database
                CommerceRuntimeManager.SpecifiedRoles = new string[] { "Device" };
                runtime = CommerceRuntimeManager.Runtime;

                // These should execute with default configuration of commerceruntime.config.
                Program.RunDefaultTestsAsync().GetAwaiter().GetResult();

                // These require additional commerceruntime.config changes. See comments inside method.
                Program.RunSdkSampleTests();

                // You could use this to test your own CommerceRuntime extensions.
                Program.RunExtensionTests();
            }

            private static async Task RunDefaultTestsAsync()
            {
                var queryResultSettings = QueryResultSettings.FirstRecord;
                queryResultSettings.Paging = new PagingInfo(10);

                // query a page of customers
                var customer = CustomerManager.Create(runtime).GetCustomer(DefaultCustomerAccountNumber);
                Debug.WriteLine("Default Customer was ", (customer == null) ? "not found" : "found");

                // query a page of products
                var products = await ProductManager.Create(runtime).GetProductsAsync(queryResultSettings).ConfigureAwait(false);
                Debug.WriteLine("Found {0} product(s).", products.Results.Count);

                // query for pricing with PricingEngine
                SalesTransaction salesTransaction = new SalesTransaction();
                salesTransaction.SalesLines.Add(ConstructSalesLine("0045"));
                CalculatePricesServiceRequest request = new CalculatePricesServiceRequest(salesTransaction);
                GetPriceServiceResponse response = await runtime.ExecuteAsync<GetPriceServiceResponse>(request, new RequestContext(runtime)).ConfigureAwait(false);
                Debug.WriteLine("Price for first line item is {0}.", response.Transaction.ActiveSalesLines[0].Price);

                // generate transaction identifier.
                var transactionId = GenerateTransactionId();
                Debug.WriteLine("Transaction identifier test value: {0}", transactionId);
            }

            private static void RunSdkSampleTests()
            {
                /* BEGIN SDKSAMPLE_CROSSLOYALTY (do not remove this)
                // Setup: Add these to commerceruntime.ext.config
                // <add source="type" value="Contoso.Commerce.Runtime.CrossLoyaltySample.CrossLoyaltyCardService, Contoso.Commerce.Runtime.CrossLoyaltySample" />
                GetCrossLoyaltyCardRequest getCrossLoyaltyCardRequest = new GetCrossLoyaltyCardRequest("425-999-4444");
                GetCrossLoyaltyCardResponse getCrossLoyaltyCardResponse = runtime.Execute<GetCrossLoyaltyCardResponse>(getCrossLoyaltyCardRequest, new RequestContext(runtime));
                Debug.WriteLine("The service registered to serve GetCrossLoyaltyCardRequest returned a discount of '{0}'.", getCrossLoyaltyCardResponse.Discount);
                // END SDKSAMPLE_CROSSLOYALTY (do not remove this) */

                /* BEGIN SDKSAMPLE_CUSTOMEREXTENSIONPROPERTIES (do not remove this)
                // Setup: Add these to commerceruntime.ext.config
                // <add source="type" value="Contoso.Commerce.Runtime.EmailPreferenceSample.CreateOrUpdateCustomerDataRequestHandler, Contoso.Commerce.Runtime.EmailPreferenceSample" />
                // <add source="type" value="Contoso.Commerce.Runtime.EmailPreferenceSample.GetCustomerTriggers, Contoso.Commerce.Runtime.EmailPreferenceSample" />
                var getCustomerDataRequest = new GetCustomerDataRequest("2001");
                Customer customer = runtime.Execute<SingleEntityDataServiceResponse<Customer>>(getCustomerDataRequest, new RequestContext(runtime)).Entity;
                customer.SetProperty("EMAILOPTIN", 1);
                var updateCustomerRequest = new CreateOrUpdateCustomerDataRequest(customer);
                runtime.Execute<SingleEntityDataServiceResponse<Customer>>(updateCustomerRequest, new RequestContext(runtime));
                // END SDKSAMPLE_CUSTOMEREXTENSIONPROPERTIES (do not remove this) */

                /* BEGIN SDKSAMPLE_CUSTOMERSEARCH (do not remove this)
                // Setup: Add these to commerceruntime.ext.config
                // <add source="type" value="Contoso.Commerce.Runtime.CustomerSearchSample.CustomerSearchRequestHandler, Contoso.Commerce.Runtime.CustomerSearchSample" />
                QueryResultSettings queryResultSettings = QueryResultSettings.SingleRecord;
                CustomerSearchCriteria criteria = new CustomerSearchCriteria()
                {
                    Keyword = "2002"
                };

                var customerSearchRequest = new CustomersSearchRequest
                {
                    QueryResultSettings = queryResultSettings,
                    Criteria = criteria
                };
                var customerSearchResponse = runtime.Execute<CustomersSearchResponse>(customerSearchRequest, new RequestContext(runtime));
                Debug.WriteLine("The customer search returned {0} results.", customerSearchResponse.Customers.TotalCount);
                // END SDKSAMPLE_CUSTOMERSEARCH (do not remove this) */

                /* BEGIN SDKSAMPLE_PostNonTransactionalActivityLoyaltyPoints (do not remove this)
                // Setup: Add these to commerceruntime.ext.config
                // <add source="type" value="Contoso.Commerce.Runtime.NonTransactionalLoyaltyPointsSample.NonTransactionalLoyaltyPointsTriggers, Contoso.Commerce.Runtime.NonTransactionalLoyaltyPointsSample" />
                var issueLoyaltyCardRequest = new IssueLoyaltyCardServiceRequest(
                    loyaltyCardNumber,
                    Microsoft.Dynamics.Commerce.Runtime.DataModel.LoyaltyCardTenderType.AsCardTender,
                    DefaultCustomerAccountNumber,
                    partyRecordId,
                    channelId);

                // Issue the loyalty card in HQ
                var issueLoyaltyCardResponse = runtime.Execute<IssueLoyaltyCardServiceResponse>(issueLoyaltyCardRequest, new RequestContext(runtime));

                // END SDKSAMPLE_PostNonTransactionalActivityLoyaltyPoints (do not remove this) */


                /* BEGIN SDKSAMPLE_STOREHOURS (do not remove this)
                // Setup: 
                // 1. Add these to commerceruntime.ext.config
                // <add source="type" value="Contoso.Commerce.Runtime.StoreHoursSample.StoreHoursDataService, Contoso.Commerce.Runtime.StoreHoursSample" />
                // 2. SQL updates need to be deployed from Instructions\StoreHours\ChannelDBUpgrade.sql
                // 3. Enable this code
                QueryResultSettings queryResultSettings = QueryResultSettings.SingleRecord;
                queryResultSettings.Paging = new PagingInfo(10);
                GetStoreHoursDataRequest getStoreHoursDataRequest = new GetStoreHoursDataRequest("HOUSTON") { QueryResultSettings = queryResultSettings };
                GetStoreHoursDataResponse getStoreHoursDataResponse = runtime.Execute<GetStoreHoursDataResponse>(getStoreHoursDataRequest, new RequestContext(runtime));
                Debug.WriteLine("The service registered to serve GetStoreHoursDataRequest returned '{0}' instances of StoreDayHours in the first page.", getStoreHoursDataResponse.DayHours.Results.Count);
                // END SDKSAMPLE_STOREHOURS (do not remove this) */

                /* BEGIN SDKSAMPLE_HEALTHCHECK (do not remove this)
                // Setup: Add this to commerceruntime.ext.config
                // <add source="type" value="Contoso.Commerce.Runtime.HealthCheckSample.HealthCheckService, Contoso.Commerce.Runtime.HealthCheckSample" />
                RunHealthCheckServiceRequest runHealthCheckServiceRequest = new RunHealthCheckServiceRequest(HealthCheckType.DatabaseHealthCheck);
                runtime.Execute<RunHealthCheckServiceResponse>(runHealthCheckServiceRequest, new RequestContext(runtime));
                Debug.WriteLine("The service registered to serve RunHealthCheckServiceRequest was successfully called.");
                // END SDKSAMPLE_HEALTHCHECK (do not remove this) */

                /* BEGIN SDKSAMPLE_NOTIFICATION (do not remove this)
                // Setup: Add this to commerceruntime.ext.config
                // <add source="type" value="Contoso.Commerce.Runtime.NotificationSample.NotificationExtensionService, Contoso.Commerce.Runtime.NotificationSample" />
                long channelId = 100;
                string staffId = "testStaff";
                GetNotificationsExtensionServiceRequest runNotificationExtensionServiceRequest = new GetNotificationsExtensionServiceRequest(channelId, staffId, RetailOperation.RemoveCoupons);
                GetNotificationsExtensionServiceResponse response = runtime.Execute<GetNotificationsExtensionServiceResponse>(runNotificationExtensionServiceRequest, new RequestContext(runtime));
                Debug.WriteLine("Number of notification details returned: {0}", response.NotificationDetails.Count);

                // END SDKSAMPLE_NOTIFICATION (do not remove this) */

                /* BEGIN SDKSAMPLE_TRANSACTIONATTRIBUTES (do not remove this)
                //// Setup: Add these to commerceruntime.ext.config
                //// <add source="type" value="Contoso.Commerce.Runtime.TransactionAttributesSample.CustomSaveCartTrigger, Contoso.Commerce.Runtime.TransactionAttributesSample" />
                Cart newCart = new Cart()
                {
                    Id = GenerateTransactionId(),
                    CartLines = new List<CartLine>(),
                    TenderLines = new List<TenderLine>()
                };

                SaveCartRequest saveCartRequest = new SaveCartRequest(newCart);
                SaveCartResponse saveCartResponse = runtime.Execute<SaveCartResponse>(saveCartRequest, new RequestContext(runtime));
                Debug.WriteLine("Number of attributes on cart: {0}", saveCartResponse.Cart.AttributeValues.Count);

                CartLine newCartLine = new CartLine()
                {
                    LineId = string.Empty,
                    ItemId = "0146",
                    ProductId = 22565422328,
                    InventoryDimensionId = string.Empty,
                    Quantity = 1
                };

                IList<CartLine> newCartLines = new List<CartLine>(new CartLine[] { newCartLine });
                Cart updatedCart = saveCartResponse.Cart;
                updatedCart.CartLines = newCartLines;
                saveCartRequest = new SaveCartRequest(updatedCart);
                saveCartResponse = runtime.Execute<SaveCartResponse>(saveCartRequest, new RequestContext(runtime));
                Debug.WriteLine("Number of attributes on the first cart line: {0}", saveCartResponse.Cart.CartLines[0].AttributeValues.Count);
                //// END SDKSAMPLE_TRANSACTIONATTRIBUTES (do not remove this) */

                /* BEGIN SDKSAMPLE_WARRANTYANDRETURN (do not remove this)
                // Setup: Add these to commerceruntime.ext.config
                // <add source="assembly" value="Contoso.Commerce.Runtime.WarrantyAndReturnSample" />
                var searchCriteria = new TransactionSearchCriteria();
                searchCriteria.SearchLocationType = SearchLocation.Local;
                var request = new SearchJournalTransactionsServiceRequest(searchCriteria, QueryResultSettings.AllRecords);
                var response = runtime.Execute<SearchJournalTransactionsServiceResponse>(request, new RequestContext(runtime));
                foreach (Transaction transaction in response.Transactions)
                {
                    Debug.WriteLine("Transaction ID: {0}", transaction.Id);

                    if (transaction.GetProperty("ReturnRemainingDays") != null)
                    {
                        Debug.WriteLine("  [ReturnRemainingDays]: {0}", (int)transaction.GetProperty("ReturnRemainingDays"));
                    }
                    else
                    {
                        Debug.WriteLine("  [ReturnRemainingDays]: <extension property not found>");
                    }

                    if (transaction.GetProperty("ServiceChargeAmount") != null)
                    {
                        Debug.WriteLine("  [ServiceChargeAmount]: {0}", (decimal)transaction.GetProperty("ServiceChargeAmount"));
                    }
                    else
                    {
                        Debug.WriteLine("  [ServiceChargeAmount]: <extension property not found>");
                    }
                }
                //// END SDKSAMPLE_WARRANTYANDRETURN (do not remove this) */
            }

            private static void RunExtensionTests()
            {
                // add your own tests here
            }

            private static SalesLine ConstructSalesLine(string itemId, string lineId = "1")
            {
                SalesLine salesLine = new SalesLine();
                salesLine.OriginalSalesOrderUnitOfMeasure = "ea";
                salesLine.SalesOrderUnitOfMeasure = "ea";
                salesLine.ItemId = itemId;
                salesLine.Quantity = 1;
                salesLine.UnitOfMeasureConversion = UnitOfMeasureConversion.CreateDefaultUnitOfMeasureConversion();
                salesLine.LineId = lineId;
                return salesLine;
            }

            private static string GenerateTransactionId()
            {
                Guid g = Guid.NewGuid();
                string transactionId = Convert.ToBase64String(g.ToByteArray());
                transactionId = transactionId.Replace("=", string.Empty);
                transactionId = transactionId.Replace("+", string.Empty);
                transactionId = transactionId.Replace("/", string.Empty);
                return transactionId;
            }
        }
    }
}
