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
    namespace Commerce.Runtime.Extensions.PricingDataServicesSample
    {
        using System.Collections.Generic;
        using System.Linq;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;

        /// <summary>
        /// Amount cap data manager.
        /// </summary>
        internal class AmountCapDataManager : DataManager
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="AmountCapDataManager"/> class.
            /// </summary>
            /// <param name="context">The request context.</param>
            internal AmountCapDataManager(RequestContext context)
            : base(context)
            {
                this.DataStoreManagerInstance.RegisterDataStoreAccessor(DataStoreType.Database, AmountCapDatabaseAccessor.Instantiate, context);
            }

            internal PagedResult<DiscountAmountCap> GetDiscountAmountCapsByOfferIds(
                IEnumerable<string> offerIds)
            {
                ThrowIf.Null(offerIds, "offerIds");

                PagedResult<DiscountAmountCap> result;

                if (offerIds.Any())
                {
                    AmountCapDatabaseAccessor databaseDataAccessor = (AmountCapDatabaseAccessor)this.DataStoreManagerInstance.RegisteredAccessors[DataStoreType.Database];
                    result = databaseDataAccessor.GetDiscountAmountCapsByOfferIds(offerIds);
                }
                else
                {
                    result = new List<DiscountAmountCap>().AsPagedResult();
                }

                return result;
            }
        }
    }
}