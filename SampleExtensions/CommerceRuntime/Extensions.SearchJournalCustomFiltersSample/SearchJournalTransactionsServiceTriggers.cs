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
    namespace Commerce.Runtime.SearchJournalCustomFiltersSample
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Class that implements triggers for the SearchJournalTransactionsServiceRequest request type.
        /// </summary>
        public class SearchJournalTransactionsServiceTriggers : IRequestTriggerAsync
        {
            /// <summary>
            /// Gets the supported requests for this trigger.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[] { typeof(SearchJournalTransactionsServiceRequest) };
                }
            }

            /// <summary>
            /// Pre trigger code.
            /// </summary>
            /// <param name="request">The request.</param>
            public async Task OnExecuting(Request request)
            {
                if (request is SearchJournalTransactionsServiceRequest searchJournalTransactionsServiceRequest)
                {
                    await this.OnExecutingAsync(searchJournalTransactionsServiceRequest).ConfigureAwait(false);
                }
            }

            /// <summary>
            /// Post trigger code.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="response">The response.</param>
            public async Task OnExecuted(Request request, Response response)
            {
                if (request is SearchJournalTransactionsServiceRequest searchJournalTransactionsServiceRequest && response is SearchJournalTransactionsServiceResponse searchJournalTransactionsServiceResponse)
                {
                    await this.OnExecutedAsync(searchJournalTransactionsServiceRequest, searchJournalTransactionsServiceResponse).ConfigureAwait(false);
                }
            }

            /// <summary>
            /// Pre trigger code that adds custom transactions IDs on top of the built-in search filters to get the intersection of search results (built-in and custom).
            /// </summary>
            /// <param name="request">The request.</param>
            private async Task OnExecutingAsync(SearchJournalTransactionsServiceRequest request)
            {
                if (request.Criteria == null || request.Criteria.CustomFilters.IsNullOrEmpty())
                {
                    return;
                }

                // Gather custom staff IDs from search filters
                List<string> staffIds = new List<string>();
                foreach (var filter in request.Criteria.CustomFilters)
                {
                    if (filter == null || filter.SearchValues.IsNullOrEmpty())
                    {
                        continue;
                    }

                    if (string.Equals(filter.Key, "Microsoft_Pos_Extensibility_Samples_SampleTransactionSearchTextFilter", StringComparison.OrdinalIgnoreCase))
                    {
                        foreach (var searchValue in filter.SearchValues)
                        {
                            if (searchValue?.Value?.StringValue == null)
                            {
                                continue;
                            }

                            staffIds.Add(searchValue.Value.StringValue);
                        }
                    }
                }

                if (staffIds.Count == 0)
                {
                    return;
                }

                //// Build query to get transaction IDs filtered by custom filters.

                var query = new SqlPagedQuery(QueryResultSettings.AllRecords)
                {
                    DatabaseSchema = "ext",
                    Select = new ColumnSet("TRANSACTIONID"),
                    From = "RETAILTRANSACTIONTABLEVIEW"
                };

                var whereClauses = new List<string>();

                if (staffIds.Count > 0)
                {
                    query.AddInClause<string>(staffIds, "CONTOSORETAILSERVERSTAFFID", whereClauses);
                }

                if (!string.IsNullOrEmpty(request.Criteria.StoreId))
                {
                    whereClauses.Add("STORE = @storeId");
                    query.Parameters["@storeId"] = request.Criteria.StoreId;
                }

                if (!string.IsNullOrEmpty(request.Criteria.TerminalId))
                {
                    whereClauses.Add("TERMINAL = @terminalId");
                    query.Parameters["@terminalId"] = request.Criteria.TerminalId;
                }

                long channelRecordId = request.RequestContext.GetChannelConfiguration().RecordId;
                whereClauses.Add("CHANNEL = @channel");
                query.Parameters["@channel"] = channelRecordId;

                string dataAreaId = request.RequestContext.GetChannelConfiguration().InventLocationDataAreaId;
                whereClauses.Add("DATAAREAID = @dataAreaId");
                query.Parameters["@dataAreaId"] = dataAreaId;

                query.Where = string.Join(" AND ", whereClauses);

                // Add custom transactions IDs on top of the built-in search filters to get the intersection of search results (built-in and custom).
                using (var databaseContext = new DatabaseContext(request.RequestContext))
                {
                    PagedResult<ExtensionsEntity> extensions = await databaseContext.ReadEntityAsync<ExtensionsEntity>(query).ConfigureAwait(false);
                    request.Criteria.CustomTransactionIds = extensions.Results.Select(r => r.GetProperty("TRANSACTIONID").ToString()).ToArray();
                }
            }

            /// <summary>
            /// Post trigger code that gathers extension properties.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="response">The response.</param>
            private async Task OnExecutedAsync(SearchJournalTransactionsServiceRequest request, SearchJournalTransactionsServiceResponse response)
            {
                if (response.Transactions.IsNullOrEmpty())
                {
                    return;
                }

                //// Gather extension properties to be available for the client for display if needed.

                string[] transactionIds = response.Transactions.Select(t => t.Id).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
                var query = new SqlPagedQuery(QueryResultSettings.AllRecords)
                {
                    DatabaseSchema = "ext",
                    Select = new ColumnSet("STORE, TERMINAL, TRANSACTIONID, CONTOSORETAILSERVERSTAFFID"),
                    From = "RETAILTRANSACTIONTABLEVIEW"
                };

                var whereClauses = new List<string>();
                
                // If transaction IDs are not selective, e.g., with no store and terminal encoded already, this may return unnecessary data.
                // For optimization, consider to create a table valued function which takes table valued parameters (channel, store, terminal, transactionId). 
                query.AddInClause<string>(transactionIds, RetailTransactionTableSchema.TransactionIdColumn, whereClauses);

                long channelRecordId = request.RequestContext.GetChannelConfiguration().RecordId;
                whereClauses.Add("CHANNEL = @channel");
                query.Parameters["@channel"] = channelRecordId;

                string dataAreaId = request.RequestContext.GetChannelConfiguration().InventLocationDataAreaId;
                whereClauses.Add("DATAAREAID = @dataAreaId");
                query.Parameters["@dataAreaId"] = dataAreaId;

                query.Where = string.Join(" AND ", whereClauses);

                using (var databaseContext = new DatabaseContext(request.RequestContext))
                {
                    PagedResult<ExtensionsEntity> extensions = await databaseContext.ReadEntityAsync<ExtensionsEntity>(query).ConfigureAwait(false);
                    foreach (Transaction transaction in response.Transactions)
                    {
                        ExtensionsEntity extension = extensions.Results.FirstOrDefault(r =>
                            string.Equals(r.GetProperty("STORE").ToString(),  transaction.StoreId, StringComparison.OrdinalIgnoreCase)
                            && string.Equals(r.GetProperty("TERMINAL").ToString(), transaction.TerminalId, StringComparison.OrdinalIgnoreCase)
                            && string.Equals(r.GetProperty("TRANSACTIONID").ToString(), transaction.Id, StringComparison.OrdinalIgnoreCase));
                        if (extension != null)
                        {
                            transaction.SetProperty("ContosoRetailServerStaffId", extension.GetProperty("CONTOSORETAILSERVERSTAFFID").ToString());
                        }
                    }
                }
            }
        }
    }
}