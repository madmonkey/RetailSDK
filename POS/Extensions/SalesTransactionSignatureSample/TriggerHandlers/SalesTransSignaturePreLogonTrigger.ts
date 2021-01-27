/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities } from "PosApi/Entities";
import * as Triggers from "PosApi/Extend/Triggers/ApplicationTriggers";
import SignatureManager from "../Managers/SignatureManager";

export default class PreLogOnTrigger extends Triggers.PreLogOnTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPreLogOnTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPreLogOnTriggerOptions): Promise<ClientEntities.ICancelable> {
        let signatureManager: SignatureManager = new SignatureManager(this.context);
        return signatureManager.onLogonRecovery()
            .then((): ClientEntities.ICancelable => {
                return { canceled: false };
            });
    }
}
