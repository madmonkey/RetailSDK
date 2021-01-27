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
    namespace Commerce.Runtime.FiscalRegisterReceiptSample
    {
        using System.Runtime.Serialization;

        /// <summary>
        /// Clean cash fiscal register response data.
        /// </summary>
        /// <remarks>
        /// This data contract must match data contract used for fiscal register response data serialized in the HW station extension.
        /// </remarks>
        [DataContract]
        internal class CleanCashRegisterResponseData
        {
            /// <summary>
            /// Gets or sets the fiscal register device Id.
            /// </summary>
            [DataMember]
            public string DeviceId { get; set; }

            /// <summary>
            /// Gets or sets the fiscal data registration control code.
            /// </summary>
            [DataMember]
            public string ControlCode { get; set; }
        }
    }
}
