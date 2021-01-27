/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities } from "PosApi/Entities";
import * as Triggers from "PosApi/Extend/Triggers/AuditEventTriggers";
import AuditEventSigningManager from "../Managers/AuditEventSigningManager";

export default class PreRegisterAuditEventTrigger extends Triggers.PreRegisterAuditEventTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPreRegisterAuditEventTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPreRegisterAuditEventTriggerOptions): Promise<ClientEntities.ICancelable> {
        let auditEventSigningManager: AuditEventSigningManager = new AuditEventSigningManager(this.context);
        return auditEventSigningManager.preSignature(options.auditEvent)
            .then((): Promise<ClientEntities.ICancelable> => {
                return Promise.resolve({ canceled: false });
            });
    }
}