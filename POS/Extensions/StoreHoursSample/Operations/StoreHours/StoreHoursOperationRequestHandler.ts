/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ExtensionOperationRequestType, ExtensionOperationRequestHandlerBase } from "PosApi/Create/Operations";
import StoreHoursOperationResponse from "./StoreHoursOperationResponse";
import StoreHoursOperationRequest from "./StoreHoursOperationRequest";
import { ClientEntities } from "PosApi/Entities";

/**
 * (Sample) Request handler for the StoreHoursOperationRequest class.
 */
export default class StoreHoursOperationRequestHandler<TResponse extends StoreHoursOperationResponse> extends ExtensionOperationRequestHandlerBase<TResponse> {
    /**
     * Gets the supported request type.
     * @return {RequestType<TResponse>} The supported request type.
     */
    public supportedRequestType(): ExtensionOperationRequestType<TResponse> {
        return StoreHoursOperationRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {StoreHoursOperationRequest<TResponse>} request The request.
     * @return {Promise<ICancelableDataResult<TResponse>>} The cancelable async result containing the response.
     */
    public executeAsync(request: StoreHoursOperationRequest<TResponse>): Promise<ClientEntities.ICancelableDataResult<TResponse>> {

        this.context.logger.logInformational("Log message from StoreHoursOperationRequestHandler executeAsync().");

        let response: StoreHoursOperationResponse = new StoreHoursOperationResponse();
        return new Promise((resolve: (value?: ClientEntities.ICancelableDataResult<StoreHoursOperationResponse>) => void) => {
            // Simulating delay so that busy indicator is shown until timeout.
            setTimeout(resolve, 2000 /*milliseconds*/);
        }).then((): ClientEntities.ICancelableDataResult<StoreHoursOperationResponse> => {

            this.context.navigator.navigate("StoreHoursView");
            return <ClientEntities.ICancelableDataResult<StoreHoursOperationResponse>>{
                canceled: false,
                data: response
            };
        });
    }
}