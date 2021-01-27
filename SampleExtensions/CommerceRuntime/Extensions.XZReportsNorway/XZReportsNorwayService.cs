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
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Workflow;
        using ShiftNorway = Commerce.Runtime.DataModel.ShiftNorway;

        /// <summary>
        /// The extended service to process custom Norwegian X/Z report data.
        /// </summary>
        public class XZReportsNorwayService : IRequestHandlerAsync
        {
            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(GetXAndZReportReceiptRequest),
                        typeof(ChangeShiftStatusRequest),
                    };
                }
            }

            /// <summary>
            /// Executes the specified service request.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The response.</returns>
            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");

                Response response = new NullResponse();

                if (request is GetXAndZReportReceiptRequest)
                {
                    response = await this.GetXAndZReportReceiptAsync((GetXAndZReportReceiptRequest)request).ConfigureAwait(false);
                }
                else if (request is ChangeShiftStatusRequest)
                {
                    response = await this.ChangeShiftStatusAsync((ChangeShiftStatusRequest)request).ConfigureAwait(false);
                }
                else
                {
                    throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
                }

                return response;
            }

            /// <summary>
            /// Executes the request to get customized Norwegian x/z reports.
            /// </summary>
            /// <param name="request">The request to get receipts.</param>
            /// <returns>The response containing customized x/z reports.</returns>
            public async Task<Response> GetXAndZReportReceiptAsync(GetXAndZReportReceiptRequest request)
            {
                ThrowIf.Null(request, "request");
                ThrowIf.Null(request.RequestContext, "request.RequestContext");

                RequestContext context = request.RequestContext;

                if (context.GetChannelConfiguration().CountryRegionISOCode == CountryRegionISOCode.NO)
                {
                    ShiftNorway shift = new ShiftNorway();

                    switch (request.ReceiptType)
                    {
                        case ReceiptType.XReport:
                            shift = await ShiftNorwayCalculator.CalculateAndSaveAsync(ReceiptType.XReport, context, request.ShiftTerminalId, request.ShiftId).ConfigureAwait(false);
                            break;
                        case ReceiptType.ZReport:
                            shift = await ShiftNorwayCalculator.GetLastClosedAsync(context, request.ShiftTerminalId, request.ShiftId).ConfigureAwait(false);
                            break;
                    }

                    string hardwareProfileId = request.HardwareProfileId;
                    Terminal terminal = context.GetTerminal();
                    if (string.IsNullOrEmpty(hardwareProfileId))
                    {
                        hardwareProfileId = terminal.HardwareProfile;
                    }

                    var getHardwareProfileRequest = new GetHardwareProfileDataRequest(hardwareProfileId, QueryResultSettings.SingleRecord);
                    var getHardwareProfileResponse = await context.Runtime.ExecuteAsync<SingleEntityDataServiceResponse<HardwareProfile>>(getHardwareProfileRequest, context).ConfigureAwait(false);

                    HardwareProfile hardwareProfile = getHardwareProfileResponse.Entity;
                        
                    XZReportsFormatter formatter = new XZReportsFormatter(context);
                    Receipt receipt = await XZReportsReceiptBuilder.BuildAsync(shift, request.ReceiptType, formatter, terminal, hardwareProfile).ConfigureAwait(false);
                    
                    await this.LogTransactionAsync(request).ConfigureAwait(false);

                    GetReceiptResponse response = new GetReceiptResponse(new List<Receipt> { receipt }.AsReadOnly());
                    return response;
                }
                else
                {
                    GetXAndZReportReceiptRequestHandler requestHandler = new GetXAndZReportReceiptRequestHandler();
                    GetReceiptResponse originalResponse = context.Runtime.Execute<GetReceiptResponse>(request, context, requestHandler, skipRequestTriggers: false);

                    return originalResponse;
                }
            }

            /// <summary>
            /// Executes the request to process shift status change.
            /// </summary>
            /// <param name="request">The request to change shift status.</param>
            /// <returns>The response.</returns>
            public async Task<Response> ChangeShiftStatusAsync(ChangeShiftStatusRequest request)
            {
                ThrowIf.Null(request, "request");

                ChangeShiftStatusRequestHandler receiptService = new ChangeShiftStatusRequestHandler();
                ChangeShiftStatusResponse originalResponse = request.RequestContext.Runtime.Execute<ChangeShiftStatusResponse>(request, request.RequestContext, receiptService, skipRequestTriggers: false);

                if (request.RequestContext.GetChannelConfiguration().CountryRegionISOCode == CountryRegionISOCode.NO && request.ToStatus == ShiftStatus.Closed)
                {
                    await ShiftNorwayCalculator.CalculateAndSaveAsync(ReceiptType.ZReport, request.RequestContext, request.ShiftTerminalId, request.ShiftId).ConfigureAwait(false);
                }

                return originalResponse;
            }

            /// <summary>
            /// Saves the transaction log for printing X or X report.
            /// </summary>
            /// <param name="request">The request to get receipts.</param>
            private async Task LogTransactionAsync(GetXAndZReportReceiptRequest request)
            {
                SaveTransactionLogServiceRequest serviceRequest = null;

                if (request.ReceiptType == ReceiptType.XReport)
                {
                    serviceRequest = new SaveTransactionLogServiceRequest(ExtensibleTransactionType.PrintX, request.TransactionId);
                }
                else if (request.ReceiptType == ReceiptType.ZReport)
                {
                    serviceRequest = new SaveTransactionLogServiceRequest(ExtensibleTransactionType.PrintZ, request.TransactionId);
                }

                if (serviceRequest != null)
                {
                    await request.RequestContext.ExecuteAsync<Response>(serviceRequest).ConfigureAwait(false);
                }
            }
        }
    }
}