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
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Commerce.Runtime.XZReportsNorway.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using ShiftLineNorway = Commerce.Runtime.DataModel.ShiftLineNorway;
        using ShiftLineNorwayTableType = Commerce.Runtime.Data.Types.ShiftLineNorwayTableType;
        using ShiftNorway = Commerce.Runtime.DataModel.ShiftNorway;
        using ShiftNorwayTableType = Commerce.Runtime.Data.Types.ShiftNorwayTableType;
        using XZReportTableType = Commerce.Runtime.Data.Types.XZReportTableType;

        /// <summary>
        /// The data request handler for custom Norwegian X/Z report data in SQLServer.
        /// </summary>
        public sealed class XZReportsNorwaySqlServerDataService : IRequestHandlerAsync
        {
            // Table type parameters
            private const string XZReportTableTypeVariableName = "@tvp_XZReportTableType";
            private const string ShiftNorwayTableTypeVariableName = "@tvp_ShiftNorwayTableType";
            private const string ShiftLineNorwayTableTypeVariableName = "@tvp_ShiftLineNorwayTableType";

            // Parameter names
            private const string ChannelIdVariableName = "@bi_ChannelId";
            private const string TerminalIdVariableName = "@nvc_TerminalId";
            private const string StoreIdVariableName = "@nvc_StoreId";
            private const string DataAreaIdVariableName = "@nvc_DataAreaId";
            private const string ShiftIdVariableName = "@bi_ShiftId";
            private const string StatusVariableName = "@i_Status";
            private const string ReportTypeVariableName = "@i_ReportType";

            // Stored procedure names
            private const string InsertXZReportDataNorwaySprocName = "INSERTXZREPORTDATANORWAY";
            private const string GetLastClosedShiftSalesDataNorwaySprocName = "GETLASTCLOSEDSHIFTSALESDATANORWAY";
            private const string CalculateShiftDetailsNorwaySprocName = "GETSHIFTSALESDATANORWAY";

            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(CalculateShiftDetailsNorwayDataRequest),
                        typeof(GetLastClosedShiftDetailsNorwayDataRequest),
                        typeof(SaveXZReportDataRequest)
                    };
                }
            }

            /// <summary>
            /// Gets the sales or payment transaction extension to be saved.
            /// </summary>
            /// <param name="request">The request message.</param>
            /// <returns>The response message.</returns>
            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");

                Response response = new NullResponse();

                if (request is CalculateShiftDetailsNorwayDataRequest)
                {
                    response = await this.CalculateShiftDetailsAsync((CalculateShiftDetailsNorwayDataRequest)request).ConfigureAwait(false);
                }
                else if (request is GetLastClosedShiftDetailsNorwayDataRequest)
                {
                    response = await this.GetLastClosedShiftDetailsAsync((GetLastClosedShiftDetailsNorwayDataRequest)request).ConfigureAwait(false);
                }
                else if (request is SaveXZReportDataRequest)
                {
                    response = await this.SaveXZReportDetailsAsync((SaveXZReportDataRequest)request).ConfigureAwait(false);
                }
                else
                {
                    throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
                }

                return response;
            }

            /// <summary>
            /// Loads the shift transactions data.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>A single entity data service response.</returns>
            private async Task<SingleEntityDataServiceResponse<ShiftNorway>> CalculateShiftDetailsAsync(CalculateShiftDetailsNorwayDataRequest request)
            {
                ThrowIf.Null(request, "request");
                ThrowIf.Null(request.TerminalId, "request.TerminalId");

                ParameterSet parameters = new ParameterSet();
                parameters[ChannelIdVariableName] = request.RequestContext.GetPrincipal().ChannelId;
                parameters[DataAreaIdVariableName] = request.RequestContext.GetChannelConfiguration().InventLocationDataAreaId;
                parameters[StoreIdVariableName] = request.RequestContext.GetOrgUnit().OrgUnitNumber ?? string.Empty;
                parameters[TerminalIdVariableName] = request.TerminalId;
                parameters[ShiftIdVariableName] = request.ShiftId;
                parameters[ReportTypeVariableName] = request.ReportType;

                ShiftNorway shift;
                using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                {
                    var result = await databaseContext.ExecuteStoredProcedureAsync<ShiftNorway, ShiftLineNorway>(CalculateShiftDetailsNorwaySprocName, parameters, request.QueryResultSettings).ConfigureAwait(false);
                    shift = result.Item1.SingleOrDefault();
                    if (shift != null)
                    {
                        shift.ShiftLines = result.Item2;
                    }

                    return new SingleEntityDataServiceResponse<ShiftNorway>(shift);
                }
            }

            /// <summary>
            /// Loads the last closed shift transactions data.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>A single entity data service response.</returns>
            private async Task<SingleEntityDataServiceResponse<ShiftNorway>> GetLastClosedShiftDetailsAsync(GetLastClosedShiftDetailsNorwayDataRequest request)
            {
                ThrowIf.Null(request, "request");

                ParameterSet parameters = new ParameterSet();
                parameters[ChannelIdVariableName] = request.RequestContext.GetPrincipal().ChannelId;
                parameters[TerminalIdVariableName] = request.RequestContext.GetTerminal().TerminalId;
                parameters[StatusVariableName] = (int)ShiftStatus.Closed;

                ShiftNorway shift;
                using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                {
                    var result = await databaseContext.ExecuteStoredProcedureAsync<ShiftNorway, ShiftLineNorway>(GetLastClosedShiftSalesDataNorwaySprocName, parameters, request.QueryResultSettings).ConfigureAwait(false);
                    shift = result.Item1.SingleOrDefault();
                    if (shift != null)
                    {
                        shift.ShiftLines = result.Item2;
                    }

                    return new SingleEntityDataServiceResponse<ShiftNorway>(shift);
                }
            }

            /// <summary>
            /// The data service method to save x and z report data.
            /// </summary>
            /// <param name="request">The data service request.</param>
            /// <returns>A null response.</returns>
            private async Task<NullResponse> SaveXZReportDetailsAsync(SaveXZReportDataRequest request)
            {
                ThrowIf.Null(request, "request");
                ThrowIf.Null(request.RequestContext, "request.RequestContext");
                ThrowIf.Null(request.Shift, "request.Shift");

                RequestContext context = request.RequestContext;
                ShiftNorway shift = request.Shift;
                string reportData = request.ReportData;

                string dataAreaId = context.GetChannelConfiguration().InventLocationDataAreaId;

                using (XZReportTableType reportTableType = new XZReportTableType(shift, reportData, dataAreaId))
                using (ShiftNorwayTableType shiftTableType = new ShiftNorwayTableType(shift, dataAreaId))
                using (ShiftLineNorwayTableType shiftLinesTableType = new ShiftLineNorwayTableType(shift, dataAreaId))
                {
                    var parameters = new ParameterSet();
                    parameters[XZReportTableTypeVariableName] = reportTableType;
                    parameters[ShiftNorwayTableTypeVariableName] = shiftTableType;
                    parameters[ShiftLineNorwayTableTypeVariableName] = shiftLinesTableType;

                    int errorCode;
                    using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                    {
                        errorCode = await databaseContext.ExecuteStoredProcedureNonQueryAsync(InsertXZReportDataNorwaySprocName, parameters, resultSettings: null).ConfigureAwait(false);
                    }

                    if (errorCode != (int)DatabaseErrorCodes.Success)
                    {
                        throw new StorageException(StorageErrors.Microsoft_Dynamics_Commerce_Runtime_CriticalStorageError, errorCode, "Unable to save x/z report data.");
                    }
                }

                return new NullResponse();
            }
        }
    }
}
