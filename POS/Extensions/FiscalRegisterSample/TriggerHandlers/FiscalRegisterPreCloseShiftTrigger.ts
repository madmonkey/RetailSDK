/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import * as Triggers from "PosApi/Extend/Triggers/OperationTriggers";
import FiscalizationManager from "./../Manager/FiscalizationManager";

export default class FiscalRegisterPreCloseShiftTrigger extends Triggers.PreOperationTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IOperationTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IOperationTriggerOptions): Promise<ClientEntities.ICancelable> {
        let operationId: ProxyEntities.RetailOperation = options.operationRequest.operationId;

        let isCloseShiftOperation: boolean =
            operationId === ProxyEntities.RetailOperation.BlindCloseShift ||
            operationId === ProxyEntities.RetailOperation.CloseShift ||
            operationId === ProxyEntities.RetailOperation.SuspendShift;

        if (!isCloseShiftOperation) {
            return Promise.resolve({ canceled: false });
        }

        let fiscalizationManager: FiscalizationManager = new FiscalizationManager(this.context);

        return fiscalizationManager.checkCompletedTransactionsRegistered();
    }
}