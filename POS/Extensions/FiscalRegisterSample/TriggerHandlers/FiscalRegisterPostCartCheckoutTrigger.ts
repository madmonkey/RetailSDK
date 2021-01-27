/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/TransactionTriggers";
import FiscalizationManager from "./../Manager/FiscalizationManager";
import { ClientEntities } from "PosApi/Entities";

export default class FiscalRegisterPostCartCheckoutTrigger extends Triggers.PostCartCheckoutTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPostCartCheckoutTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPostCartCheckoutTriggerOptions): Promise<void> {
        if (!ClientEntities.ExtensibleTransactionType.Sales.equals(options.salesOrder.TransactionTypeValue)) {
            return Promise.resolve();
        }

        let fiscalizationManager: FiscalizationManager = new FiscalizationManager(this.context);

        return fiscalizationManager.fiscalize(options.salesOrder, false);
    }
}