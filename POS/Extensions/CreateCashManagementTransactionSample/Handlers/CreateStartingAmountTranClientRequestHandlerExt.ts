/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { CreateStartingAmountTransactionClientRequestHandler } from "PosApi/Extend/RequestHandlers/StoreOperationsRequestHandlers";
import { CreateStartingAmountTransactionClientRequest, CreateStartingAmountTransactionClientResponse } from "PosApi/Consume/StoreOperations";
import { ClientEntities } from "PosApi/Entities";

/**
 * Override request handler class for creating of starting amount operation.
 */
export default class CreateStartingAmountTranClientRequestHandlerExt extends CreateStartingAmountTransactionClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {CreateStartingAmountTransactionClientRequest<CreateStartingAmountTransactionClientResponse>} request The request containing the response.
     * @return {Promise<ICancelableDataResult<CreateStartingAmountTransactionClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: CreateStartingAmountTransactionClientRequest<CreateStartingAmountTransactionClientResponse>):
        Promise<ClientEntities.ICancelableDataResult<CreateStartingAmountTransactionClientResponse>> {

        // User could implement new business logic here to override starting amount flow.
        return this.defaultExecuteAsync(request);
    }
}
