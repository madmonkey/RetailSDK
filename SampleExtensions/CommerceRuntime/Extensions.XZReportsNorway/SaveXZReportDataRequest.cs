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
    namespace Commerce.Runtime.XZReportsNorway.Messages
    {
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using ShiftNorway = Commerce.Runtime.DataModel.ShiftNorway;

        /// <summary>
        /// The data request to save the customized Norwegian x/z report details.
        /// </summary>
        [DataContract]
        public sealed class SaveXZReportDataRequest : DataRequest
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="SaveXZReportDataRequest"/> class.
            /// </summary>
            /// <param name="shift">The shift.</param>
            /// <param name="reportData">Report data.</param>
            public SaveXZReportDataRequest(ShiftNorway shift, string reportData)
            {
                this.Shift = shift;
                this.ReportData = reportData;
            }

            /// <summary>
            /// Gets the shift.
            /// </summary>
            [DataMember]
            public ShiftNorway Shift { get; private set; }

            /// <summary>
            /// Gets the x/z report data.
            /// </summary>
            [DataMember]
            public string ReportData { get; private set; }
        }
    }
}
