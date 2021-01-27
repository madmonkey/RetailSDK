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
    namespace Commerce.RetailProxy.StoreHoursSample.Adapters
    {
        using System;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.RetailProxy.Adapters;

        using Runtime.DataModel;
        using Runtime.StoreHoursSample.Messages;

        /// <summary>
        /// Encapsulates extension functionality related to store day hours management.
        /// </summary>
        internal class StoreDayHoursManager : IStoreDayHoursManager
        {
            /// <summary>
            /// Gets the store day hours by store number.
            /// </summary>
            /// <param name="storeNumber">The store number.</param>
            /// <param name="queryResultSettings">The query result settings.</param>
            /// <returns>The store day hours.</returns>
            public async Task<PagedResult<StoreDayHours>> GetStoreDaysByStore(string storeNumber, QueryResultSettings queryResultSettings)
            {
                var request = new GetStoreHoursDataRequest(storeNumber) { QueryResultSettings = queryResultSettings };
                var response = await CommerceRuntimeManager.Runtime.ExecuteAsync<GetStoreHoursDataResponse>(request, context: null).ConfigureAwait(false);

                return response.DayHours;
            }

            /// <summary>
            /// Updates the store days hours for the store with the given identifier.
            /// </summary>
            /// <param name="id">The store identifier.</param>
            /// <param name="storeDayHours">The store day hours.</param>
            /// <returns>The resulting store day hours.</returns>
            public Task<StoreDayHours> UpdateStoreDayHours(long id, StoreDayHours storeDayHours)
            {
                throw new NotImplementedException();
            }
        }
    }
}
