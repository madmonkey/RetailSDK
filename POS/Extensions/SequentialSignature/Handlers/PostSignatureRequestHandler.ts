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
import PostSignatureRequest from "../Messages/PostSignatureRequest";
import PostSignatureResponse from "../Messages/PostSignatureResponse";
import SequentialSignatureManager from "../Managers/SequentialSignatureManager";

/**
 * The request handler for PostSignatureRequest.
 */
export default class PostSignatureRequestHandler<TResponse extends PostSignatureResponse> extends ExtensionRequestHandlerBase<TResponse> {
    /**
     * Gets the supported request type.
     * @return {ExtensionRequestType<TResponse>} The supported abstract or concrete request type.
     */
    public supportedRequestType(): ExtensionRequestType<TResponse> {
        return PostSignatureRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {PostSignatureRequest<TResponse>} request PostSignature request.
     * @return {Promise<ClientEntities.ICancelableDataResult<TResponse>>} The promise with a cancelable result containing the response.
     */
    public executeAsync(request: PostSignatureRequest<TResponse>)
        : Promise<ClientEntities.ICancelableDataResult<PostSignatureResponse>> {
        let sequentialSignatureManager: SequentialSignatureManager = new SequentialSignatureManager(this.context);

        return sequentialSignatureManager.postSignature(request.isSigned, request.registerResponse, request.sequenceType)
            .then(() => {
                let returnResult: ClientEntities.ICancelableDataResult<PostSignatureResponse> = {
                    canceled: false,
                    data: new PostSignatureResponse()
                };

                return Promise.resolve(returnResult);
            });
    }
}
