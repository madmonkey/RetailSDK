/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/TransactionTriggers";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";

export default class ReturnPolicyTrigger extends Triggers.PreReturnTransactionTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPreProductSaleTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPreReturnTransactionTriggerOptions): Promise<ClientEntities.ICancelable> {
        this.context.logger.logVerbose("Executing PreReturnTransactionTrigger with options " + JSON.stringify(options) + ".");

        if (ObjectExtensions.isNullOrUndefined(options) || ObjectExtensions.isNullOrUndefined(options.originalTransaction)) {
            let error: ClientEntities.ExtensionError = new ClientEntities.ExtensionError(
                this.context.resources.getString("ReturnPolicyTriggerInvalidOptionsMessage"));

            return Promise.reject(error);
        } else {
            let transaction: ProxyEntities.SalesOrder = options.originalTransaction;
            let value: ProxyEntities.CommercePropertyValue = this.getPropertyValue(transaction.ExtensionProperties, "ReturnRemainingDays");
            let daysToReturn: number = (value && value.IntegerValue) ? value.IntegerValue : -1;

            if (daysToReturn === 0) {
                let error: ClientEntities.ExtensionError = new ClientEntities.ExtensionError(
                    this.context.resources.getString("ReturnPolicyTriggerCannotReturnTransactionMessage"));
                return Promise.reject(error);
            }

            return Promise.resolve({ canceled: false });
        }
    }

    /**
     * Gets the property value given the column name.
     * @param {ProxyEntities.CommerceProperty[]} extensionProperties The extension properties collection.
     * @param {string} column The column name of the property value to be retrieved.
     * @returns The property value.
     */
    private getPropertyValue(extensionProperties: ProxyEntities.CommerceProperty[], column: string): ProxyEntities.CommercePropertyValue {
        let prop: ProxyEntities.CommerceProperty = (extensionProperties || []).filter((prop: ProxyEntities.CommerceProperty) => prop.Key === column)[0];
        return prop ? prop.Value : undefined;
    }
}