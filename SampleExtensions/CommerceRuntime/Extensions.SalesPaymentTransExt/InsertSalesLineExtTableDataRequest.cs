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
    namespace Commerce.Runtime.SalesPaymentTransExt.Messages
    {
        using System.Collections.Generic;
        using System.Runtime.Serialization;
        using Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;

        /// <summary>
        /// The data request to save sales lines extensions.
        /// </summary>
        [DataContract]
        public sealed class InsertSalesLineExtTableDataRequest : DataRequest
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="InsertSalesLineExtTableDataRequest"/> class.
            /// </summary>
            /// <param name="salesLinesExt">The collection of sales lines extensions.</param>
            public InsertSalesLineExtTableDataRequest(IEnumerable<SalesLineExt> salesLinesExt)
            {
                this.SalesLinesExt = salesLinesExt;
            }

            /// <summary>
            /// Gets the sales lines extension collection.
            /// </summary>
            [DataMember]
            public IEnumerable<SalesLineExt> SalesLinesExt { get; private set; }
        }
    }
}