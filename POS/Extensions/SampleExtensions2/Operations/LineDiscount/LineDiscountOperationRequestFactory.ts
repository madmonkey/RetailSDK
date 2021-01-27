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
import { ExtensionOperationRequestFactoryFunctionType, IOperationContext } from "PosApi/Create/Operations";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import * as CartOperations from "PosApi/Consume/Cart";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";

type CancelableDiscountRequest = ClientEntities.ICancelableDataResult<LineDiscountOperationRequest<LineDiscountOperationResponse>>;

let getOperationRequest: ExtensionOperationRequestFactoryFunctionType<LineDiscountOperationResponse> =
    /**
     * Gets an instance of LineDiscountOperationRequest.
     * @param {number} operationId The operation Id.
     * @param {string[]} actionParameters The action parameters.
     * @param {string} correlationId A telemetry correlation ID, used to group events logged from this request together with the calling context.
     * @return {PrintOperationRequest<TResponse>} Instance of LineDiscountOperationRequest.
     */
    function (
        context: IOperationContext,
        operationId: number,
        actionParameters: string[],
        correlationId: string
    ): Promise<CancelableDiscountRequest> {

        let cart: ProxyEntities.Cart = null;
        let cartRequest: CartOperations.GetCurrentCartClientRequest<CartOperations.GetCurrentCartClientResponse> =
            new CartOperations.GetCurrentCartClientRequest();

        // Get cart first and then find the first available cartline which does not have any discounts applied.
        return context.runtime.executeAsync(cartRequest)
            .then((result: ClientEntities.ICancelableDataResult<CartOperations.GetCurrentCartClientResponse>): void => {

                if (!result.canceled) {
                    cart = result.data.result;
                }
            }).then((): CancelableDiscountRequest => {

                if (ObjectExtensions.isNullOrUndefined(cart)) {
                    return <CancelableDiscountRequest>{
                        canceled: true,
                        data: null
                    };
                }

                let nonDiscountedCartLine: ProxyEntities.CartLine =
                    ArrayExtensions.firstOrUndefined(cart.CartLines, (cartLine: ProxyEntities.CartLine): boolean => {
                        return !ArrayExtensions.hasElements(cartLine.DiscountLines);
                    });

                // Create the actual request to return from this factory.
                let operationRequest: LineDiscountOperationRequest<LineDiscountOperationResponse> =
                    new LineDiscountOperationRequest<LineDiscountOperationResponse>(correlationId);
                if (ObjectExtensions.isNullOrUndefined(nonDiscountedCartLine)) {
                    operationRequest.cartLineDiscounts = [];
                } else {
                    operationRequest.cartLineDiscounts = [{ cartLine: nonDiscountedCartLine, discountValue: 5 }];
                }
                operationRequest.isPercentDiscount = true;

                // return the request containing the first cart line which does not have any discount applied, along with new discount to be applied.
                return <CancelableDiscountRequest>{
                    canceled: false,
                    data: operationRequest
                };
            });
    };

export default getOperationRequest;