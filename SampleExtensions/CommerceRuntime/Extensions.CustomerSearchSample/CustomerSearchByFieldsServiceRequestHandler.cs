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
    namespace Commerce.Runtime.CustomerSearchSample
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Custom customer search by fields service request handler.
        /// </summary>
        public sealed class CustomerSearchByFieldsServiceRequestHandler : SingleAsyncRequestHandler<CustomerSearchByFieldsServiceRequest>
        {
            /// <summary>
            /// Executes the workflow to retrieve customer information.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The response.</returns>
            protected override async Task<Response> Process(CustomerSearchByFieldsServiceRequest request)
            {
                ThrowIf.Null(request, "request");
                ThrowIf.Null(request.SearchByFieldCriteria, "request.SearchByFieldCriteria");
                if (request.SearchByFieldCriteria.Criteria.IsNullOrEmpty())
                {
                    throw new ArgumentException("request.Criteria.Criteria can't be empty.");
                }

                // Execute the original customer search logic here.
                var getCustomerSearchResultsDataRequest = new GetCustomerSearchResultsDataRequest(request.SearchByFieldCriteria, request.QueryResultSettings);
                var getCustomerSearchResultsDataResponse = await request.RequestContext.ExecuteAsync<EntityDataServiceResponse<CustomerSearchResult>>(getCustomerSearchResultsDataRequest).ConfigureAwait(false);
                PagedResult<CustomerSearchResult> originalSearchResults = getCustomerSearchResultsDataResponse.PagedEntityCollection;

                // Execute the custom customer search logic here.
                PagedResult<CustomerSearchResult> customSearchResults = this.ExternalCustomerSearch(request.SearchByFieldCriteria);

                // Merge the search results.
                IEnumerable<CustomerSearchResult> mergedSearchResults = originalSearchResults.Union(customSearchResults).OrderByDescending(c => c.SearchRanking);

                // Get the global customer data for the customer search results.
                var getGlobalCustomersDataRequest = new GetGlobalCustomersByCustomerSearchResultsDataRequest(mergedSearchResults);
                var getGlobalCustomersDataResponse = await request.RequestContext.ExecuteAsync<EntityDataServiceResponse<GlobalCustomer>>(getGlobalCustomersDataRequest).ConfigureAwait(false);
                PagedResult<GlobalCustomer> customers = getGlobalCustomersDataResponse.PagedEntityCollection;

                return new CustomerSearchByFieldsServiceResponse(customers);
            }

            /// <summary>
            /// A placeholder method that represents a call to an external service or a custom implementation
            /// of customer search.
            /// </summary>
            /// <param name="criteria">The criteria containing which customer fields to search.</param>
            /// <returns>The response.</returns>
            private PagedResult<CustomerSearchResult> ExternalCustomerSearch(CustomerSearchByFieldCriteria criteria)
            {
                // This sample method will only append an additional customer search result if the search criteria contains
                // a search criterion for phone number. This can be replaced with an extended customer search field type value.
                string externalSearchKeyword = criteria?.Criteria?.Where(c => c.SearchField == CustomerSearchFieldType.PhoneNumber)?.FirstOrDefault()?.SearchTerm ?? string.Empty;
                var customerSearchResult = string.IsNullOrEmpty(externalSearchKeyword) ? new List<CustomerSearchResult>() : new List<CustomerSearchResult>()
                {
                    new CustomerSearchResult()
                    {
                        PartyId = 22565423403,
                        SearchRanking = 1000
                    }
                };

                return customerSearchResult.AsPagedResult();
            }
        }
    }
}
