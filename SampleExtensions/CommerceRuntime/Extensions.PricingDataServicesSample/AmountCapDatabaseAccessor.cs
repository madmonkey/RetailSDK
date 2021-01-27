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
        using System;
        using System.Collections.Generic;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Amount cap data accessor.
        /// </summary>
        internal class AmountCapDatabaseAccessor : DatabaseAccessor
        {
            private const string DiscountAmountCapViewName = "CONTOSOAMOUNTCAPDISCOUNTVIEW";

            /// <summary>
            /// Initializes a new instance of the <see cref="AmountCapDatabaseAccessor"/> class.
            /// </summary>
            /// <param name="dataStore">The backing data store.</param>
            /// <param name="context">The request context.</param>
            private AmountCapDatabaseAccessor(
                IDataStore dataStore,
                RequestContext context)
                : base(dataStore, context)
            {
            }

            internal static AmountCapDatabaseAccessor Instantiate(
                IDataStore dataStore,
                RequestContext context)
            {
                return new AmountCapDatabaseAccessor(dataStore, context);
            }

            internal PagedResult<DiscountAmountCap> GetDiscountAmountCapsByOfferIds(
                IEnumerable<string> offerIds)
            {
                ThrowIf.Null(offerIds, "offerIds");

                var query = new SqlPagedQuery(QueryResultSettings.AllRecords)
                {
                    DatabaseSchema = "ext",
                    From = AmountCapDatabaseAccessor.DiscountAmountCapViewName,
                    Where = "DATAAREAID = @dataAreaId",
                };

                using (StringIdTableType type = new StringIdTableType(offerIds, "OFFERID"))
                {
                    query.Parameters["@TVP_OFFERIDTABLETYPE"] = type;
                    query.Parameters["@dataAreaId"] = this.Context.GetChannelConfiguration().InventLocationDataAreaId;
 
                    return this.ExecuteSelect<DiscountAmountCap>(query);
                }
            }
        }
    }
}