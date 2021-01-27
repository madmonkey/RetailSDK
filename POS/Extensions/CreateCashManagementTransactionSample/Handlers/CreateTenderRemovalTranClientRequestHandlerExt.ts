/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { CreateTenderRemovalTransactionClientRequestHandler } from "PosApi/Extend/RequestHandlers/StoreOperationsRequestHandlers";
import { CreateTenderRemovalTransactionClientRequest, CreateTenderRemovalTransactionClientResponse } from "PosApi/Consume/StoreOperations";
import { ClientEntities } from "PosApi/Entities";

/**
 * Override request handler class for creating of tender removal operation.
 */
export default class CreateTenderRemovalTranClientRequestHandlerExt extends CreateTenderRemovalTransactionClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {CreateTenderRemovalTransactionClientRequest<CreateTenderRemovalTransactionClientResponse>} request The request containing the response.
     * @return {Promise<ICancelableDataResult<CreateTenderRemovalTransactionClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: CreateTenderRemovalTransactionClientRequest<CreateTenderRemovalTransactionClientResponse>):
        Promise<ClientEntities.ICancelableDataResult<CreateTenderRemovalTransactionClientResponse>> {

        // User could implement new business logic here to override tender removal flow.
        return this.defaultExecuteAsync(request);
    }
}
