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
    namespace Commerce.Runtime.PrintPackingSlipSample.Messages
    {
        using System.Collections.ObjectModel;
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Represents the response object for the <see cref="GetFulfillmentPackingSlipsPDFResponse"/> class.
        /// </summary>
        [DataContract]
        public sealed class GetFulfillmentPackingSlipsPDFResponse : Response
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="GetFulfillmentPackingSlipsPDFResponse"/> class.
            /// </summary>
            /// <param name="discount">The packing slips.</param>
            public GetFulfillmentPackingSlipsPDFResponse(ReadOnlyCollection<Receipt> receipts)
            {
                this.Receipts = receipts;
            }

            /// <summary>
            /// Gets the packing slips.
            /// </summary>
            /// <remarks>
            /// The receipt should only contain the encoded (could be Base64) packing slip instead of the
            /// string content of a normal receipt. 
            /// </remarks>
            [DataMember]
            public ReadOnlyCollection<Receipt> Receipts { get; private set; }
        }
    }
}