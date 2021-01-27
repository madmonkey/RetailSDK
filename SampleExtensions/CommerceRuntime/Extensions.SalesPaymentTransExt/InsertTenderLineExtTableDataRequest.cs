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
        /// The data request to save tender lines extensions.
        /// </summary>
        [DataContract]
        public sealed class InsertTenderLineExtTableDataRequest : DataRequest
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="InsertTenderLineExtTableDataRequest"/> class.
            /// </summary>
            /// <param name="tenderLinesExt">The collection of tender lines extensions.</param>
            public InsertTenderLineExtTableDataRequest(IEnumerable<TenderLineExt> tenderLinesExt)
            {
                this.TenderLinesExt = tenderLinesExt;
            }

            /// <summary>
            /// Gets the tender lines extension collection.
            /// </summary>
            [DataMember]
            public IEnumerable<TenderLineExt> TenderLinesExt { get; private set; }
        }
    }
}