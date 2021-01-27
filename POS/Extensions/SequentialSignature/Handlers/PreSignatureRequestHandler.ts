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
import PreSignatureRequest from "../Messages/PreSignatureRequest";
import PreSignatureResponse from "../Messages/PreSignatureResponse";
import SequentialSignatureManager from "../Managers/SequentialSignatureManager";

/**
 * The request handler for PreSignatureRequest.
 */
export default class PreSignatureRequestHandler<TResponse extends PreSignatureResponse> extends ExtensionRequestHandlerBase<TResponse> {
    /**
     * Gets the supported request type.
     * @return {ExtensionRequestType<TResponse>} The supported abstract or concrete request type.
     */
    public supportedRequestType(): ExtensionRequestType<TResponse> {
        return PreSignatureRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {PreSignatureRequest<TResponse>} request PreSignature request.
     * @return {Promise<ClientEntities.ICancelableDataResult<TResponse>>} The promise with a cancelable result containing the response.
     */
    public executeAsync(request: PreSignatureRequest<TResponse>)
        : Promise<ClientEntities.ICancelableDataResult<PreSignatureResponse>> {
        let sequentialSignatureManager: SequentialSignatureManager = new SequentialSignatureManager(this.context);

        return sequentialSignatureManager.preSignature(request.registerableEvent)
            .then(() => {
                let returnResult: ClientEntities.ICancelableDataResult<PreSignatureResponse> = {
                    canceled: false,
                    data: new PreSignatureResponse()
                };

                return Promise.resolve(returnResult);
            });
    }
}
