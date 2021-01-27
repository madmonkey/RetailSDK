/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities } from "PosApi/Entities";
import * as Triggers from "PosApi/Extend/Triggers/ProductTriggers";
import { ArrayExtensions } from "PosApi/TypeExtensions";
import FiscalizationManager from "./../Manager/FiscalizationManager";

export default class FiscalRegisterPreSaleTrigger extends Triggers.PreProductSaleTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPreProductSaleTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPreProductSaleTriggerOptions): Promise<ClientEntities.ICancelable> {
        // We run check only when the first line is added into cart
        if (ArrayExtensions.hasElements(options.cart.CartLines)) {
            return Promise.resolve({ canceled: false });
        }

        let fiscalizationManager: FiscalizationManager = new FiscalizationManager(this.context);

        return fiscalizationManager.checkCompletedTransactionsRegistered();
    }
}