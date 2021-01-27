/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { CreateSafeDropTransactionClientRequestHandler } from "PosApi/Extend/RequestHandlers/TenderCountingRequestHandlers";
import { CreateSafeDropTransactionClientRequest, CreateSafeDropTransactionClientResponse } from "PosApi/Consume/StoreOperations";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";

import {
    ShowTextInputDialogClientRequest,
    ShowTextInputDialogClientResponse,
    ITextInputDialogOptions
} from "PosApi/Consume/Dialogs";

interface IRequestEnvelopeNumberResult {
    canceled: boolean;
    envelopeNumber?: string;
}

/**
 * Override request handler class for creating of safe drop transaction.
 */
export default class CreateSafeDropTransactionClientRequestHandlerExt extends CreateSafeDropTransactionClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {CreateSafeDropTransactionClientRequest<CreateSafeDropTransactionClientResponse>} request The request containing the response.
     * @return {Promise<ICancelableDataResult<CreateSafeDropTransactionClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: CreateSafeDropTransactionClientRequest<CreateSafeDropTransactionClientResponse>):
        Promise<ClientEntities.ICancelableDataResult<CreateSafeDropTransactionClientResponse>> {

        const envelopeNumberExtensionPropertyKey: string = "EnvelopeNumber";

        // Do not request envelope number in case of operation is aborted.
        if (request.isOperationAborted) {
            return this.defaultExecuteAsync(request);
        }

        let promise: Promise<ClientEntities.ICancelableDataResult<CreateSafeDropTransactionClientResponse>> =
            this._requestEnvelopeNumber().then((result: IRequestEnvelopeNumberResult) => {
                if (result.canceled) {
                    return { canceled: true, data: null };
                } else {
                    // Add the requested envelope number to extension properties.
                    let envelopeNumberExtensionProperty: ProxyEntities.CommerceProperty = new ProxyEntities.CommercePropertyClass();
                    envelopeNumberExtensionProperty.Key = envelopeNumberExtensionPropertyKey;
                    envelopeNumberExtensionProperty.Value = new ProxyEntities.CommercePropertyValueClass();
                    envelopeNumberExtensionProperty.Value.StringValue = result.envelopeNumber;

                    request.extensionProperties.push(envelopeNumberExtensionProperty);

                    // Continue the save safe drop flow with updated extension properties.
                    return this.defaultExecuteAsync(request);
                }
            });

        return promise;
    }

    /**
     * Shows dialog to enter envelope number.
     * @returns {Promise<IRequestEnvelopeNumberResult>} Result of requesting of envelope number.
     */
    private _requestEnvelopeNumber(): Promise<IRequestEnvelopeNumberResult> {
        let textInputDialogOptions: ITextInputDialogOptions = {
            title: this.context.resources.getString("string_1"), // Envelope number
            label: this.context.resources.getString("string_2") // Enter envelope number:
        };

        let dialogRequest: ShowTextInputDialogClientRequest<ShowTextInputDialogClientResponse> =
            new ShowTextInputDialogClientRequest<ShowTextInputDialogClientResponse>(textInputDialogOptions);

        let promise: Promise<IRequestEnvelopeNumberResult> = this.context.runtime.executeAsync(dialogRequest)
            .then((result: ClientEntities.ICancelableDataResult<ShowTextInputDialogClientResponse>) => {
                let requestEnvelopeNumberResult: IRequestEnvelopeNumberResult;

                if (result.canceled) {
                    requestEnvelopeNumberResult = { canceled: true };
                } else {
                    requestEnvelopeNumberResult = {
                        canceled: false,
                        envelopeNumber: result.data.result.value
                    };
                }

                return requestEnvelopeNumberResult;
            });

        return promise;
    }
}
