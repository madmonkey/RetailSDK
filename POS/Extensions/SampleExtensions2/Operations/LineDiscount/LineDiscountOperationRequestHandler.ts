/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import LineDiscountOperationResponse from "./LineDiscountOperationResponse";
import LineDiscountOperationRequest from "./LineDiscountOperationRequest";
import { ExtensionOperationRequestHandlerBase, ExtensionOperationRequestType } from "PosApi/Create/Operations";
import { ClientEntities } from "PosApi/Entities";
import * as CartOperations from "PosApi/Consume/Cart";
import { ArrayExtensions } from "PosApi/TypeExtensions";

/**
 * (Sample) Request handler for the LineDiscountOperationRequest class.
 */
export default class PrintOperationRequestHandler<TResponse extends LineDiscountOperationResponse> extends ExtensionOperationRequestHandlerBase<TResponse> {
    /**
     * Gets the supported request type.
     * @return {RequestType<TResponse>} The supported request type.
     */
    public supportedRequestType(): ExtensionOperationRequestType<TResponse> {
        return LineDiscountOperationRequest;
    }

    /**
     * Executes the request handler asynchronously.
     * @param {LineDiscountOperationRequest<TResponse>} request The request.
     * @return {Promise<ICancelableDataResult<TResponse>>} The cancelable async result containing the response.
     */
    public executeAsync(request: LineDiscountOperationRequest<TResponse>): Promise<ClientEntities.ICancelableDataResult<TResponse>> {

        if (!ArrayExtensions.hasElements(request.cartLineDiscounts)) {
            this.context.logger.logError("Cart does not have at least one item without a discount applied.");
            return Promise.resolve(<ClientEntities.ICancelableDataResult<TResponse>>{
                canceled: true,
                data: new LineDiscountOperationResponse(request.cartLineDiscounts, request.isPercentDiscount)
            });
        }

        // If it is a percent discount, then run line discount PERCENT operation, else run line discount amount operation.
        if (request.isPercentDiscount) {
            let percentDiscountRequest: CartOperations.LineDiscountPercentOperationRequest<CartOperations.LineDiscountAmountOperationResponse> =
                new CartOperations.LineDiscountPercentOperationRequest(request.cartLineDiscounts, request.correlationId);

            return this.context.runtime.executeAsync(percentDiscountRequest)
                .then((
                    result: ClientEntities.ICancelableDataResult<CartOperations.LineDiscountPercentOperationResponse>
                ): ClientEntities.ICancelableDataResult<TResponse> => {

                    return <ClientEntities.ICancelableDataResult<TResponse>>{
                        canceled: result.canceled,
                        data: new LineDiscountOperationResponse(request.cartLineDiscounts, request.isPercentDiscount)
                    };
                });
        } else {
            let amountDiscountRequest: CartOperations.LineDiscountAmountOperationRequest<CartOperations.LineDiscountAmountOperationResponse> =
                new CartOperations.LineDiscountAmountOperationRequest(request.cartLineDiscounts, request.correlationId);

            return this.context.runtime.executeAsync(amountDiscountRequest)
                .then((
                    result: ClientEntities.ICancelableDataResult<CartOperations.LineDiscountAmountOperationResponse>
                ): ClientEntities.ICancelableDataResult<TResponse> => {

                    return <ClientEntities.ICancelableDataResult<TResponse>>{
                        canceled: result.canceled,
                        data: new LineDiscountOperationResponse(request.cartLineDiscounts, request.isPercentDiscount)
                    };
                });
        }
    }
}