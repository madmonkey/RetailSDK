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
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// A request class for print packing slip.
        /// </summary>
        [DataContract]
        public sealed class GetFulfillmentPackingSlipsPDFRequest : Request
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="GetFulfillmentPackingSlipsPDFRequest"/> class.
            /// </summary>
            /// <param name="salesId">Sales order Id.</param>
            /// <param name="packingSlipId">Packing slip Id.</param>
            /// <param name="hardwareProfileId">The identifier of hardware profile.</param>
            public GetFulfillmentPackingSlipsPDFRequest(string salesId, string packingSlipId, string hardwareProfileId)
            {
                this.SalesId = salesId;
                this.PackingSlipId = packingSlipId;
                this.HardwareProfileId = hardwareProfileId;
            }

            /// <summary>
            /// Gets the Sales order Id.
            /// </summary>
            [DataMember]
            public string SalesId { get; private set; }

            /// <summary>
            /// Gets the Packing slip Id.
            /// </summary>
            [DataMember]
            public string PackingSlipId { get; private set; }

            /// <summary>
            /// Gets the identifier of hardware profile.
            /// </summary>
            [DataMember]
            public string HardwareProfileId { get; private set; }
        }
    }
}
