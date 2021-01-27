/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/AuditEventTriggers";
import AuditEventSigningManager from "../Managers/AuditEventSigningManager";

export default class PostRegisterAuditEventTrigger extends Triggers.PostRegisterAuditEventTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPostRegisterAuditEventTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPostRegisterAuditEventTriggerOptions): Promise<void> {
        let auditEventSigningManager: AuditEventSigningManager = new AuditEventSigningManager(this.context);
        return auditEventSigningManager.postSignature(options.auditEvent);
    }
}