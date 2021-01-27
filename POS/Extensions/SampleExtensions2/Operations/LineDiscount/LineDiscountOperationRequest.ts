/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ExtensionOperationRequestBase } from "PosApi/Create/Operations";
import LineDiscountOperationResponse from "./LineDiscountOperationResponse";
import { ClientEntities } from "PosApi/Entities";

/**
 * (Sample) Operation request for applying a line discount amount or percent.
 */
export default class LineDiscountOperationRequest<TResponse extends LineDiscountOperationResponse> extends ExtensionOperationRequestBase<TResponse> {
    /**
     * The cart line discount.
     */
    public cartLineDiscounts: ClientEntities.ICartLineDiscount[];

    /**
     * Represents if the discount type is percent discount.
     */
    public isPercentDiscount: boolean;

    /**
     * Creates a new instance of the LineDiscountOperationRequest class.
     * @param {string} correlationId The correlation identifier.
     */
    constructor(correlationId: string) {
        super(4500, correlationId);
    }
}