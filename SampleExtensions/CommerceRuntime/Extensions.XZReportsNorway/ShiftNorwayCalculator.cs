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
    namespace Commerce.Runtime.XZReportsNorway
    {
        using System;
        using System.Threading.Tasks;
        using Commerce.Runtime.XZReportsNorway.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using ShiftLineNorway = Commerce.Runtime.DataModel.ShiftLineNorway;
        using ShiftNorway = Commerce.Runtime.DataModel.ShiftNorway;
        using XZReportType = Commerce.Runtime.DataModel.XZReportType;

        /// <summary>
        /// Calculates Norway-specific shift data.
        /// </summary>
        public static class ShiftNorwayCalculator
        {
            /// <summary>
            /// Calculates the totals, number of transactions happened in the current shift.
            /// </summary>
            /// <param name="receiptType">Type of receipt.</param>
            /// <param name="context">Request context.</param>
            /// <param name="shiftTerminalId">Shift terminal Identifier.</param>
            /// <param name="shiftId">Shift identifier.</param>
            /// <returns>The shift.</returns>
            public static async Task<ShiftNorway> CalculateAndSaveAsync(ReceiptType receiptType, RequestContext context, string shiftTerminalId, long shiftId)
            {
                ThrowIf.Null(context, "context");

                XZReportType reportType;

                switch (receiptType)
                {
                    case ReceiptType.XReport:
                        reportType = XZReportType.XReport;
                        break;
                    case ReceiptType.ZReport:
                        reportType = XZReportType.ZReport;
                        break;
                    default:
                        throw new NotSupportedException(string.Format("Unsupported report type: {0}", receiptType));
                }

                if (string.IsNullOrEmpty(shiftTerminalId))
                {
                    shiftTerminalId = context.GetTerminal().TerminalId;
                }

                if (shiftId == 0)
                {
                    shiftId = context.GetPrincipal().ShiftId;
                }

                var calculateRequest = new CalculateShiftDetailsNorwayDataRequest(reportType, shiftTerminalId, shiftId);
                var shiftResponse = await context.ExecuteAsync<SingleEntityDataServiceResponse<ShiftNorway>>(calculateRequest).ConfigureAwait(false);
                ShiftNorway shift = shiftResponse.Entity;

                ShiftNorwayCalculator.VerifyShift(shift, shiftTerminalId, shiftId);
                ShiftNorwayCalculator.PopulateFields(context, shift, shiftTerminalId, shiftId, reportType);

                string reportData = XZReportsXMLBuilder.Build(shift);

                var saveRequest = new SaveXZReportDataRequest(shift, reportData);
                await context.ExecuteAsync<NullResponse>(saveRequest).ConfigureAwait(false);

                return shift;
            }

            /// <summary>
            /// Gets the totals, number of transactions happened in the last closed shift.
            /// </summary>
            /// <param name="context">Request context.</param>
            /// <param name="shiftTerminalId">Shift terminal Identifier.</param>
            /// <param name="shiftId">Shift identifier.</param>
            /// <returns>The shift.</returns>
            public static async Task<ShiftNorway> GetLastClosedAsync(RequestContext context, string shiftTerminalId, long shiftId)
            {
                ThrowIf.Null(context, "context");

                var request = new GetLastClosedShiftDetailsNorwayDataRequest();
                var shiftResponse = await context.ExecuteAsync<SingleEntityDataServiceResponse<ShiftNorway>>(request).ConfigureAwait(false);
                ShiftNorway shift = shiftResponse.Entity;

                ShiftNorwayCalculator.VerifyShift(shift, shiftTerminalId, shiftId);

                return shift;
            }

            /// <summary>
            /// Populates shift data with non-calculated fields.
            /// </summary>
            /// <param name="context">Request context.</param>
            /// <param name="shift">The shift.</param>
            /// <param name="shiftTerminalId">Shift terminal Identifier.</param>
            /// <param name="shiftId">Shift identifier.</param>
            /// <param name="reportType">The report type.</param>
            private static void PopulateFields(RequestContext context, ShiftNorway shift, string shiftTerminalId, long shiftId, XZReportType reportType)
            {
                shift.ReportType = reportType;
                shift.Channel = context.GetPrincipal().ChannelId;
                shift.Store = context.GetOrgUnit().OrgUnitNumber;
                shift.TerminalId = shiftTerminalId;
                shift.ShiftId = shiftId;
                shift.ShiftDateTime = context.GetNowInChannelTimeZone();

                foreach (ShiftLineNorway shiftLine in shift.ShiftLines)
                {
                    shiftLine.ReportId = shift.ReportId;
                    shiftLine.ReportType = shift.ReportType;
                    shiftLine.Channel = shift.Channel;
                    shiftLine.Store = shift.Store;
                    shiftLine.TerminalId = shift.TerminalId;
                    shiftLine.ShiftId = shift.ShiftId;
                }
            }

            /// <summary>
            /// Populates shift data with non-calculated fields.
            /// </summary>
            /// <param name="shift">The shift.</param>
            /// <param name="shiftTerminalId">Shift terminal Identifier.</param>
            /// <param name="shiftId">Shift identifier.</param>
            private static void VerifyShift(ShiftNorway shift, string shiftTerminalId, long shiftId)
            {
                if (shift == null)
                {
                    throw new DataValidationException(
                        DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_ShiftNotFound,
                        string.Format("No closed shift information can be found using the shift Id {0} on terminal {1} for Z report.", shiftId, shiftTerminalId));
                }
            }
        }
    }
}
