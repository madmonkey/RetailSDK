/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ProxyEntities } from "PosApi/Entities";
import { GetLoggedOnEmployeeClientRequest, GetLoggedOnEmployeeClientResponse } from "PosApi/Consume/Employees";
import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import SkipFiscalizationOperationRequest from "./SkipFiscalizationOperationRequest";
import SkipFiscalizationOperationResponse from "./SkipFiscalizationOperationResponse";
import { ClientEntities } from "PosApi/Entities";

/**
 * Request handler for the SkipFiscalizationOperationRequest class.
 */
export default class SkipFiscalizationOperationRequestHandler<TResponse extends SkipFiscalizationOperationResponse>
    extends ExtensionOperationRequestHandlerBase<TResponse> {
    /**
     * Gets the supported request type.
     * @return {RequestType<TResponse>} The supported request type.
     */
    public supportedRequestType(): ExtensionOperationRequestType<TResponse> {
        return SkipFiscalizationOperationRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {SkipFiscalizationOperationRequest<TResponse>} request The request.
     * @return {Promise<ICancelableDataResult<TResponse>>} The cancelable async result containing the response.
     */
    public executeAsync(request: SkipFiscalizationOperationRequest<TResponse>): Promise<ClientEntities.ICancelableDataResult<TResponse>> {
        return this.context.runtime.executeAsync(new GetLoggedOnEmployeeClientRequest())
            .then((response: ClientEntities.ICancelableDataResult<GetLoggedOnEmployeeClientResponse>): ProxyEntities.Employee => {
                return response.data.result;
            })
            .then((currentEmployee: ProxyEntities.Employee): Promise<ClientEntities.ICancelableDataResult<TResponse>> => {
                let skipFiscalizationResponse: SkipFiscalizationOperationResponse = new SkipFiscalizationOperationResponse(currentEmployee.StaffId);
                return Promise.resolve(<ClientEntities.ICancelableDataResult<SkipFiscalizationOperationResponse>>{
                    canceled: false,
                    data: skipFiscalizationResponse
                });
            });
    }
}
