/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse, IMessageDialogOptions } from "PosApi/Consume/Dialogs";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";

/**
 * Represent the SkipRefiscalizeDialog results enumeration.
 */
export enum SkipRefiscalizeDialogResult {
    SkipResult,
    CancelResult
}

/**
 * User action required message dialog for skip refiscalization.
 */
export class SkipRefiscalizeDialog {
    private static readonly SKIP_RESULT: string = SkipRefiscalizeDialogResult[SkipRefiscalizeDialogResult.SkipResult];
    private static readonly CANCEL_RESULT: string = SkipRefiscalizeDialogResult[SkipRefiscalizeDialogResult.CancelResult];

    private static readonly TITLE_ID: string = "Skip_Refiscalize_Dialog_Title";
    private static readonly MESSAGE_ID: string = "Skip_Refiscalize_Dialog_Message";
    private static readonly SKIP_BUTTON_LABEL_ID: string = "Skip_Button_Label";
    private static readonly CANCEL_BUTTON_LABEL_ID: string = "Cancel_Button_Label";

    /**
     * Shows the SkipRefiscalizeDialog.
     * @param {IExtensionContext} context The extension context contained runtime to execute async requests.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales orger relaited to skipping refiscalization.
     * @return {Promise<SkipRefiscalizeDialogResult>} The result from message dialog.
     */
    public static show(context: IExtensionContext, salesOrder: ProxyEntities.SalesOrder): Promise<SkipRefiscalizeDialogResult> {
        let message: string = context.resources.getString(SkipRefiscalizeDialog.MESSAGE_ID);

        let dialogRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> =
            new ShowMessageDialogClientRequest<ShowMessageDialogClientResponse>(<IMessageDialogOptions>{
                title: context.resources.getString(SkipRefiscalizeDialog.TITLE_ID),
                message: message,
                button1: {
                    id: "SkipRefiscalizeDialogButtonSkip",
                    label: context.resources.getString(SkipRefiscalizeDialog.SKIP_BUTTON_LABEL_ID),
                    result: SkipRefiscalizeDialog.SKIP_RESULT
                },
                button2: {
                    id: "SkipRefiscalizeDialogButtonCancel",
                    label: context.resources.getString(SkipRefiscalizeDialog.CANCEL_BUTTON_LABEL_ID),
                    result: SkipRefiscalizeDialog.CANCEL_RESULT
                }
            });

        return context.runtime.executeAsync(dialogRequest)
            .then((response: ClientEntities.ICancelableDataResult<ShowMessageDialogClientResponse>): SkipRefiscalizeDialogResult => {
                if (!response.canceled) {
                    return SkipRefiscalizeDialogResult[response.data.result.dialogResult];
                } else {
                    return SkipRefiscalizeDialogResult.CancelResult;
                }
            });
    }
}
