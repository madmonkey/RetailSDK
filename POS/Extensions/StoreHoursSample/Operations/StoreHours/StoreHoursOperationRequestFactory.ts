/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import StoreHoursOperationResponse from "./StoreHoursOperationResponse";
import StoreHoursOperationRequest from "./StoreHoursOperationRequest";
import { ExtensionOperationRequestFactoryFunctionType, IOperationContext } from "PosApi/Create/Operations";
import { ClientEntities } from "PosApi/Entities";

let getOperationRequest: ExtensionOperationRequestFactoryFunctionType<StoreHoursOperationResponse> =
    /**
     * Gets an instance of StoreHoursOperationRequest.
     * @param {number} operationId The operation Id.
     * @param {string[]} actionParameters The action parameters.
     * @param {string} correlationId A telemetry correlation ID, used to group events logged from this request together with the calling context.
     * @return {StoreHoursOperationRequest<TResponse>} Instance of StoreHoursOperationRequest.
     */
    function (
        context: IOperationContext,
        operationId: number,
        actionParameters: string[],
        correlationId: string
    ): Promise<ClientEntities.ICancelableDataResult<StoreHoursOperationRequest<StoreHoursOperationResponse>>> {
        let operationRequest: StoreHoursOperationRequest<StoreHoursOperationResponse> =
            new StoreHoursOperationRequest<StoreHoursOperationResponse>(correlationId);

        return Promise.resolve(<ClientEntities.ICancelableDataResult<StoreHoursOperationRequest<StoreHoursOperationResponse>>>{
            canceled: false,
            data: operationRequest
        });
};

export default getOperationRequest;