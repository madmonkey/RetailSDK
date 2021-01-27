/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import * as Triggers from "PosApi/Extend/Triggers/TransactionTriggers";
import BuildNumberManager from "./../Manager/BuildNumberManager";

export default class SalesTransBuildNumberPreEndTransactionTrigger extends Triggers.PreEndTransactionTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPreEndTransactionTriggerOptions} options The options provided to the trigger.
     * @returns {Promise<ClientEntities.ICancelable>} The cancelable result.
     */
    public execute(options: Triggers.IPreEndTransactionTriggerOptions): Promise<ClientEntities.ICancelable> {
        if (options.cart.CartTypeValue !== ProxyEntities.CartType.Shopping &&
            options.cart.CartTypeValue !== ProxyEntities.CartType.CustomerOrder &&
            options.cart.CartTypeValue !== ProxyEntities.CartType.IncomeExpense) {
            return Promise.resolve({ canceled: false });
        }

        let buildNumberManager: BuildNumberManager = new BuildNumberManager(this.context);
        return buildNumberManager.addBuildNumberToCart(options.cart);
    }
}