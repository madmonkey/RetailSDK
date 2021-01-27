/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ExtensionRequestHandlerBase, ExtensionRequestType } from "PosApi/Create/RequestHandlers";
import { ClientEntities } from "PosApi/Entities";
import RecoverSignatureOnLogonRequest from "../Messages/RecoverSignatureOnLogonRequest";
import RecoverSignatureOnLogonResponse from "../Messages/RecoverSignatureOnLogonResponse";
import SequentialSignatureManager from "../Managers/SequentialSignatureManager";

/**
 * The request handler for RecoverSignatureOnLogonRequest.
 */
export default class RecoverSignatureOnLogonRequestHandler<TResponse extends RecoverSignatureOnLogonResponse> extends ExtensionRequestHandlerBase<TResponse> {
    /**
     * Gets the supported request type.
     * @return {ExtensionRequestType<TResponse>} The supported abstract or concrete request type.
     */
    public supportedRequestType(): ExtensionRequestType<TResponse> {
        return RecoverSignatureOnLogonRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {RecoverSignatureOnLogonRequest<TResponse>} request RecoverSignatureOnLogon request.
     * @return {Promise<ClientEntities.ICancelableDataResult<TResponse>>} The promise with a cancelable result containing the response.
     */
    public executeAsync(request: RecoverSignatureOnLogonRequest<TResponse>)
        : Promise<ClientEntities.ICancelableDataResult<RecoverSignatureOnLogonResponse>> {
        let sequentialSignatureManager: SequentialSignatureManager = new SequentialSignatureManager(this.context);

        return sequentialSignatureManager.onLogonRecovery(request.sequenceType, request.signatureRecoveryStrategy)
            .then(() => {
                let returnResult: ClientEntities.ICancelableDataResult<RecoverSignatureOnLogonResponse> = {
                    canceled: false,
                    data: new RecoverSignatureOnLogonResponse()
                };

                return Promise.resolve(returnResult);
            });
    }
}
