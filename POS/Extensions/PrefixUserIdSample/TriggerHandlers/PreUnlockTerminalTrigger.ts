﻿/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { StringExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import { CancelableTriggerResult } from "PosApi/Extend/Triggers/Triggers";
import MessageDialog from "../Controls/DialogSample/MessageDialog";
import * as Triggers from "PosApi/Extend/Triggers/ApplicationTriggers";
import IPreUnlockTerminalTriggerOptions = Triggers.IPreUnlockTerminalTriggerOptions;

/**
 * Example implementation of an PreUnlockTerminalTrigger trigger that modifies the userId and logs to the console.
 */
export default class PreUnlockTerminalTrigger extends Triggers.PreUnlockTerminalTrigger {
    /**
     * Executes the trigger functionality.
     * The operatorId can be updated on the newOptions and this modifies the value used in the UnlockTerminal operation.
     * @param {Triggers.IPreUnlockTerminalTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: IPreUnlockTerminalTriggerOptions): Promise<CancelableTriggerResult<IPreUnlockTerminalTriggerOptions>> {
        let newOptions: IPreUnlockTerminalTriggerOptions = ObjectExtensions.clone(options);

        newOptions.operatorId = StringExtensions.format("Prefix_{0}", options.operatorId);

        return MessageDialog.show(this.context, StringExtensions.format("Executing PreUnlockTerminalTrigger with options {0}.", JSON.stringify(newOptions)))
            .then((): Promise<CancelableTriggerResult<IPreUnlockTerminalTriggerOptions>> => {
                // Returning a CancelableTriggerResult is needed for the data modification in the options to take effect.
                return Promise.resolve(new CancelableTriggerResult(false, newOptions));
            });
    }
}