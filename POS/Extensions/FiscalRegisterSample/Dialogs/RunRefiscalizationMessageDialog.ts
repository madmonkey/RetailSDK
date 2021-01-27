/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse, IMessageDialogOptions } from "PosApi/Consume/Dialogs";
import { ClientEntities } from "PosApi/Entities";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { StringExtensions } from "PosApi/TypeExtensions";

/**
 * Represent the RunRefiscalizationDialog results enumeration.
 */
export enum RunRefiscalizationDialogResult {
    OkResult,
    CancelResult
}

/**
 * User action required message dialog for run refiscalization.
 */
export class RunRefiscalizationDialog {
    private static readonly OK_RESULT: string = RunRefiscalizationDialogResult[RunRefiscalizationDialogResult.OkResult];
    private static readonly CANCEL_RESULT: string = RunRefiscalizationDialogResult[RunRefiscalizationDialogResult.CancelResult];

    private static readonly TITLE_ID: string = "Run_Refiscalization_Dialog_Title";
    private static readonly MESSAGE_ID: string = "Run_Refiscalization_Dialog_Message";
    private static readonly OK_BUTTON_LABEL_ID: string = "Ok_Button_Label";
    private static readonly CANCEL_BUTTON_LABEL_ID: string = "Cancel_Button_Label";

    /**
     * Shows the RunRefiscalizationDialog.
     * @param {IExtensionContext} context The extension context contained runtime to execute async requests.
     * @param {number} salesOrdersCount The count of sales orders with no fiscal transactions for message formatting.
     * @return {Promise<RunRefiscalizationDialogResult>} The result from message dialog.
     */
    public static show(context: IExtensionContext, salesOrdersCount: number): Promise<RunRefiscalizationDialogResult> {
        let message: string = StringExtensions.format(context.resources.getString(RunRefiscalizationDialog.MESSAGE_ID), salesOrdersCount);

        let dialogRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> =
            new ShowMessageDialogClientRequest<ShowMessageDialogClientResponse>(<IMessageDialogOptions>{
                title: context.resources.getString(RunRefiscalizationDialog.TITLE_ID),
                message: message,
                button1: {
                    id: "RunRefiscalizationDialogButtonOK",
                    label: context.resources.getString(RunRefiscalizationDialog.OK_BUTTON_LABEL_ID),
                    result: RunRefiscalizationDialog.OK_RESULT
                },
                button2: {
                    id: "RunRefiscalizationDialogButtonCancel",
                    label: context.resources.getString(RunRefiscalizationDialog.CANCEL_BUTTON_LABEL_ID),
                    result: RunRefiscalizationDialog.CANCEL_RESULT
                }
            });

        return context.runtime.executeAsync(dialogRequest)
            .then((response: ClientEntities.ICancelableDataResult<ShowMessageDialogClientResponse>): RunRefiscalizationDialogResult => {
                if (!response.canceled) {
                    return RunRefiscalizationDialogResult[response.data.result.dialogResult];
                } else {
                    return RunRefiscalizationDialogResult.CancelResult;
                }
            });
    }
}
