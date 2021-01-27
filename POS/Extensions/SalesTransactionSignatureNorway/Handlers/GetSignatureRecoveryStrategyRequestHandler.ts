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
import GetSignatureRecoveryStrategyRequest from "../../SequentialSignature/SignatureStrategy/GetSignatureRecoveryStrategyRequest";
import GetSignatureRecoveryStrategyResponse from "../../SequentialSignature/SignatureStrategy/GetSignatureRecoveryStrategyResponse";
import { SignatureRecoveryStrategyNorway } from "../SignatureStrategy/SignatureRecoveryStrategyNorway";

/**
 * The request handler for GetSignatureRecoveryStrategyRequest.
 */
export default class GetSignatureRecoveryStrategyRequestHandler<TResponse extends GetSignatureRecoveryStrategyResponse>
    extends ExtensionRequestHandlerBase<TResponse> {
    /**
     * Gets the supported request type.
     * @return {ExtensionRequestType<TResponse>} The supported abstract or concrete request type.
     */
    public supportedRequestType(): ExtensionRequestType<TResponse> {
        return GetSignatureRecoveryStrategyRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {GetSignatureRecoveryStrategyRequest<TResponse>} request GetSignatureRecoveryStrategy request.
     * @return {Promise<ClientEntities.ICancelableDataResult<TResponse>>} The promise with a cancelable result containing the response.
     */
    public executeAsync(request: GetSignatureRecoveryStrategyRequest<GetSignatureRecoveryStrategyResponse>)
        : Promise<ClientEntities.ICancelableDataResult<GetSignatureRecoveryStrategyResponse>> {
        let signatureRecoveryStrategyNorway: SignatureRecoveryStrategyNorway = new SignatureRecoveryStrategyNorway();

        let response: GetSignatureRecoveryStrategyResponse = new GetSignatureRecoveryStrategyResponse();
        response.signatureRecoveryStrategy = signatureRecoveryStrategyNorway;

        let returnResult: ClientEntities.ICancelableDataResult<GetSignatureRecoveryStrategyResponse> = {
            canceled: false,
            data: response
        };

        return Promise.resolve(returnResult);
    }
}
