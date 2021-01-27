/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import * as Triggers from "PosApi/Extend/Triggers/PrintingTriggers";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import FiscalizationManager from "./../Manager/FiscalizationManager";
import ReceiptsManager from "./../Manager/ReceiptsManager";

export default class FiscalRegisterPrePrintReceiptCopyTrigger extends Triggers.PrePrintReceiptCopyTrigger {
    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPrePrintReceiptCopyTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPrePrintReceiptCopyTriggerOptions): Promise<ClientEntities.ICancelable> {
        let salesReceiptCopyIsPrinted: boolean = options.receiptAndPrinterPairs.some(
            (pair: { receipt: ProxyEntities.Receipt; printer: ProxyEntities.Printer; }) => {
                return (!ObjectExtensions.isNullOrUndefined(pair) && !ObjectExtensions.isNullOrUndefined(pair.receipt)
                    && pair.receipt.ReceiptTypeValue === ProxyEntities.ReceiptType.SalesReceipt);
            }
        );

        if (salesReceiptCopyIsPrinted) {
            let fiscalizationManager: FiscalizationManager = new FiscalizationManager(this.context);
            let receiptsManager: ReceiptsManager = new ReceiptsManager(this.context);

            return fiscalizationManager.fiscalize(options.salesOrder, true)
                .then((): Promise<ClientEntities.ICancelable> => {
                    return receiptsManager.updateAndPrintReceipts(options.salesOrder, options.receiptAndPrinterPairs);
                })
                .then((): Promise<ClientEntities.ICancelable> => {
                    return receiptsManager.registerPrintReceiptCopyEvent(options.salesOrder);
                })
                .then((): ClientEntities.ICancelable => {
                    // Return canceled true to prevent double printing
                    return { canceled: true };
                });
        } else {
            return Promise.resolve<ClientEntities.ICancelable>({ canceled: false });
        }
    }
}
