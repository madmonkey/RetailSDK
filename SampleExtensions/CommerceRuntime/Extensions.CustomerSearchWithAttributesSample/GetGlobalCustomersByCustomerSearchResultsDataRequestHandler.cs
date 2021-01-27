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
    /// <summary>
    /// This code gets the "Marketing opt in" attribute for each search result and sends it along for display with the search results.
    /// </summary>
    namespace Commerce.Runtime.CustomerSearchWithAttributesSample
    {
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using CustomerAttribute = Microsoft.Dynamics.Commerce.Runtime.DataModel.CustomerAttribute;
        using CustomerAttributeWithAccountNumber = Commerce.Runtime.DataModel.CustomerAttributeWithAccountNumber;
        using GlobalCustomer = Microsoft.Dynamics.Commerce.Runtime.DataModel.GlobalCustomer;
        using QueryResultSettings = Microsoft.Dynamics.Commerce.Runtime.DataModel.QueryResultSettings;

        /// <summary>
        /// Custom customer search request handler to look for customers by attribute.
        /// </summary>
        public sealed class GetGlobalCustomersByCustomerSearchResultsDataRequestHandler : SingleAsyncRequestHandler<GetGlobalCustomersByCustomerSearchResultsDataRequest>
        {
            /// <summary>
            /// Executes the workflow to retrieve customer information.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The response.</returns>
            protected override async Task<Response> Process(GetGlobalCustomersByCustomerSearchResultsDataRequest request)
            {
                ThrowIf.Null(request, "request");

                // Execute original customer search logic.
                var requestHandler = new Microsoft.Dynamics.Commerce.Runtime.DataServices.SqlServer.CustomerSqlServerDataService();
                var searchResults = request.RequestContext.Runtime.Execute<EntityDataServiceResponse<GlobalCustomer>>(request, request.RequestContext, requestHandler, skipRequestTriggers: false).PagedEntityCollection;

                // Get the desired attributes for each search result, and marshal any retrieved attribute data into extension properties.
                await this.GetRelevantAttributesAsync(searchResults, request.RequestContext).ConfigureAwait(false);

                return new EntityDataServiceResponse<GlobalCustomer>(searchResults.AsPagedResult());
            }

            /// <summary>
            /// Gets any attributes deemed relevant for the specified customers and places those values into each customer's extension properties.
            /// </summary>
            /// <param name="customers">The customers to get and append attributes to.</param>
            /// <param name="context">The current request context.</param>
            private async Task GetRelevantAttributesAsync(IEnumerable<GlobalCustomer> customers, RequestContext context)
            {
                // Identify relevant async and traditional customer account numbers.
                List<string> customerAccountNums = new List<string>();
                List<string> asyncCustomerAccountNums = new List<string>();
                foreach (GlobalCustomer customer in customers)
                {
                    if (customer.IsAsyncCustomer)
                    {
                        asyncCustomerAccountNums.Add(customer.AccountNumber);
                    }
                    else
                    {
                        customerAccountNums.Add(customer.AccountNumber);
                    }
                }

                // Get the desired attribute for those accounts.
                const string AttributeViewDatabaseSchema = "crt";
                const string AccountNumberColumnName = "ACCOUNTNUM";
                const string DesiredAttribute = "Marketing opt in";
                const string DataAreaIdVarName = "@dataAreaId";
                const string AttrNameVarName = "@attrName";
                const string WhereClause = "DATAAREAID = " + DataAreaIdVarName + " AND Name = " + AttrNameVarName;

                var relevantAttributes = new List<CustomerAttributeWithAccountNumber>();
                var generatedWhereClauses = new List<string>();

                using (DatabaseContext databaseContext = new DatabaseContext(context))
                {
                    //// Customer Attributes

                    if (customerAccountNums.Any())
                    {
                        var customerAttributesQuery = new SqlPagedQuery(QueryResultSettings.AllRecords)
                        {
                            DatabaseSchema = AttributeViewDatabaseSchema,
                            From = "CUSTOMERATTRIBUTEVIEW",
                            Where = WhereClause,
                            OrderBy = AccountNumberColumnName
                        };

                        customerAttributesQuery.AddInClause(customerAccountNums, AccountNumberColumnName, generatedWhereClauses);
                        customerAttributesQuery.Where = WhereClause + " AND " + generatedWhereClauses.FirstOrDefault();

                        customerAttributesQuery.Parameters[DataAreaIdVarName] = context.GetChannelConfiguration().InventLocationDataAreaId;
                        customerAttributesQuery.Parameters[AttrNameVarName] = DesiredAttribute;

                        relevantAttributes.AddRange(await databaseContext.ReadEntityAsync<CustomerAttributeWithAccountNumber>(customerAttributesQuery).ConfigureAwait(false));
                    }

                    //// Async Customer Attributes

                    if (asyncCustomerAccountNums.Any())
                    {
                        var asyncCustomerAttributesQuery = new SqlPagedQuery(QueryResultSettings.AllRecords)
                        {
                            DatabaseSchema = AttributeViewDatabaseSchema,
                            From = "ASYNCCUSTOMERATTRIBUTEVIEW",
                            Where = WhereClause,
                            OrderBy = AccountNumberColumnName
                        };

                        generatedWhereClauses.Clear();
                        asyncCustomerAttributesQuery.AddInClause(asyncCustomerAccountNums, AccountNumberColumnName, generatedWhereClauses);
                        asyncCustomerAttributesQuery.Where = WhereClause + " AND " + generatedWhereClauses.FirstOrDefault();

                        asyncCustomerAttributesQuery.Parameters[DataAreaIdVarName] = context.GetChannelConfiguration().InventLocationDataAreaId;
                        asyncCustomerAttributesQuery.Parameters[AttrNameVarName] = DesiredAttribute;

                        relevantAttributes.AddRange(await databaseContext.ReadEntityAsync<CustomerAttributeWithAccountNumber>(asyncCustomerAttributesQuery).ConfigureAwait(false));
                    }
                }

                // Create a dictionary of these attributes to improve look-up efficiency.
                Dictionary<string, CustomerAttribute> attributeMap = new Dictionary<string, CustomerAttribute>();
                foreach (CustomerAttributeWithAccountNumber attribute in relevantAttributes)
                {
                    attributeMap[attribute.AccountNumber] = attribute;
                }

                // Add each retrieved attribute to the appropriate customer record.
                foreach (GlobalCustomer customer in customers)
                {
                    string accountNum = customer.AccountNumber;
                    if (attributeMap.ContainsKey(accountNum))
                    {
                        CustomerAttribute attribute = attributeMap[accountNum];
                        customer.SetProperty(attribute.Name, attribute.AttributeValue.GetPropertyValue());
                    }
                }
            }
        }
    }
}
