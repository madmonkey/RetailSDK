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
import { StringExtensions } from "PosApi/TypeExtensions";

/**
 * Represent the SkipRefiscalizeDialog results enumeration.
 */
export enum ConfirmSkipRefiscalizationDialogResult {
    OkResult,
    CancelResult
}

/**
 * User action required message dialog for skip refiscalization.
 */
export class ConfirmSkipRefiscalizationDialog {
    private static readonly OK_RESULT: string = ConfirmSkipRefiscalizationDialogResult[ConfirmSkipRefiscalizationDialogResult.OkResult];
    private static readonly CANCEL_RESULT: string = ConfirmSkipRefiscalizationDialogResult[ConfirmSkipRefiscalizationDialogResult.CancelResult];

    private static readonly TITLE_ID: string = "Skip_Refiscalize_Dialog_Title";
    private static readonly MESSAGE_ID: string = "Confirm_Skip_Refiscalization_Dialog_Message";
    private static readonly OK_BUTTON_LABEL_ID: string = "Ok_Button_Label";
    private static readonly CANCEL_BUTTON_LABEL_ID: string = "Cancel_Button_Label";

    /**
     * Shows the ConfirmSkipRefiscalizationDialog.
     * @param {IExtensionContext} context The extension context contained runtime to execute async requests.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order relaited to skipping refiscalization.
     * @return {Promise<ConfirmSkipRefiscalizationDialogResult>} The result from message dialog.
     */
    public static show(context: IExtensionContext, salesOrder: ProxyEntities.SalesOrder): Promise<ConfirmSkipRefiscalizationDialogResult> {
        let message: string = StringExtensions.format(context.resources.getString(ConfirmSkipRefiscalizationDialog.MESSAGE_ID),
            salesOrder.Id, salesOrder.BeginDateTime, salesOrder.ReceiptId, salesOrder.TotalAmount);

        let dialogRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> =
            new ShowMessageDialogClientRequest<ShowMessageDialogClientResponse>(<IMessageDialogOptions>{
                title: context.resources.getString(ConfirmSkipRefiscalizationDialog.TITLE_ID),
                message: message,
                button1: {
                    id: "ConfirmSkipRefiscalizationDialogButtonOk",
                    label: context.resources.getString(ConfirmSkipRefiscalizationDialog.OK_BUTTON_LABEL_ID),
                    result: ConfirmSkipRefiscalizationDialog.OK_RESULT
                },
                button2: {
                    id: "ConfirmSkipRefiscalizationDialogButtonCancel",
                    label: context.resources.getString(ConfirmSkipRefiscalizationDialog.CANCEL_BUTTON_LABEL_ID),
                    result: ConfirmSkipRefiscalizationDialog.CANCEL_RESULT
                }
            });

        return context.runtime.executeAsync(dialogRequest)
            .then((response: ClientEntities.ICancelableDataResult<ShowMessageDialogClientResponse>): ConfirmSkipRefiscalizationDialogResult => {
                if (!response.canceled) {
                    return ConfirmSkipRefiscalizationDialogResult[response.data.result.dialogResult];
                } else {
                    return ConfirmSkipRefiscalizationDialogResult.CancelResult;
                }
            });
    }
}
