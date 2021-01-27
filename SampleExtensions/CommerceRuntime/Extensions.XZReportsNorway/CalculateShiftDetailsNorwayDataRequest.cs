﻿/**
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
        using XZReportType = Commerce.Runtime.DataModel.XZReportType;

        /// <summary>
        /// The data request to calculate Norway-specific shift data.
        /// </summary>
        [DataContract]
        public sealed class CalculateShiftDetailsNorwayDataRequest : DataRequest
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="CalculateShiftDetailsNorwayDataRequest"/> class.
            /// </summary>
            /// <param name="reportType">The report type.</param>
            /// <param name="terminalId">The terminal id.</param>
            /// <param name="shiftId">The shift id.</param>
            public CalculateShiftDetailsNorwayDataRequest(XZReportType reportType, string terminalId, long shiftId)
            {
                this.ReportType = reportType;
                this.TerminalId = terminalId;
                this.ShiftId = shiftId;
            }

            /// <summary>
            /// Gets the report type.
            /// </summary>
            [DataMember]
            public XZReportType ReportType { get; private set; }

            /// <summary>
            /// Gets the terminal id.
            /// </summary>
            [DataMember]
            public string TerminalId { get; private set; }

            /// <summary>
            /// Gets the shift id.
            /// </summary>
            [DataMember]
            public long ShiftId { get; private set; }
        }
    }
}
