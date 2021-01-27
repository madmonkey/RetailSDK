/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import { ArrayExtensions, ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";
import * as FulfillmentLineView from "PosApi/Extend/Views/FulfillmentLineView";
import { GetScanResultClientRequest, GetScanResultClientResponse } from "PosApi/Consume/ScanResults";
import { MarkAsPickedServiceRequest, MarkAsPickedServiceResponse } from "PosApi/Consume/SalesOrders";
import BarcodeMsrDialog from "../../Controls/BarcodeMsrDialog/BarcodeMsrDialog";
import { IBarcodeMsrDialogResult } from "../../Controls/BarcodeMsrDialog/BarcodeMsrDialogTypes";
import { ErrorHelper } from "../../Helpers";

export default class FulfillmentLineCommand extends FulfillmentLineView.FulfillmentLineExtensionCommandBase {

    private _fulfillmentLines: ProxyEntities.FulfillmentLine[];
    private _fulfillmentDeliveryType: ProxyEntities.FulfillmentLineDeliveryType;

    /**
     * Creates a new instance of the FulfillmentLineViewCommand class.
     * @param {IExtensionCommandContext<FulfillmentLineView.IFulfillmentLineToExtensionCommandMessageTypeMap>} context The context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<FulfillmentLineView.IFulfillmentLineToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "sampleFulfillmentLineCommand";
        this.label = "Scan Product and Pick";
        this.extraClass = "iconLightningBolt";

        this.fulfillmentLinesSelectionHandler = (data: FulfillmentLineView.FulfillmentLinesSelectedData): void => {
            this.canExecute = true;
            this._fulfillmentLines = data.fulfillmentLines;
        };

        this.fulfillmentLinesSelectionClearedHandler = (): void => {
            this.canExecute = false;
            this._fulfillmentLines = [];
        };

        this.packingSlipSelectedHandler = (data: FulfillmentLineView.FulfillmentLinePackingSlipSelectedData): void => {
            this.isVisible = false;
        };

        this.packingSlipSelectionClearedHandler = (): void => {
            this.isVisible = true;
        };
    }

    /**
     * Initializes the command.
     * @param {FulfillmentLineView.IFulfillmentLineExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: FulfillmentLineView.IFulfillmentLineExtensionCommandState): void {
        this.isVisible = true;
        this._fulfillmentDeliveryType = state.fulfillmentDeliveryType;
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        let dialog: BarcodeMsrDialog = new BarcodeMsrDialog();
        let correlationId: string = this.context.logger.getNewCorrelationId();
        this.context.logger.logInformational("FulfillmentLineCommand.execute started", correlationId);

        dialog.open().then((dialogResult: IBarcodeMsrDialogResult): Promise<void> => {
            if (!dialogResult.canceled && dialogResult.inputType === "Barcode" && !StringExtensions.isNullOrWhitespace(dialogResult.value)) {
                let getScanResultRequest: GetScanResultClientRequest<GetScanResultClientResponse>
                    = new GetScanResultClientRequest(dialogResult.value, correlationId);

                return this.context.runtime.executeAsync(getScanResultRequest)
                    .then((scanResult: ClientEntities.ICancelableDataResult<GetScanResultClientResponse>): Promise<void> => {
                        if (!scanResult.canceled
                            && !ObjectExtensions.isNullOrUndefined(scanResult.data)
                            && !ObjectExtensions.isNullOrUndefined(scanResult.data.result)
                            && !ObjectExtensions.isNullOrUndefined(scanResult.data.result.Product)) {

                            let product: ProxyEntities.SimpleProduct = scanResult.data.result.Product;
                            let matchingLine: ProxyEntities.FulfillmentLine
                                = ArrayExtensions.firstOrUndefined(this._fulfillmentLines, (line: ProxyEntities.FulfillmentLine): boolean => {
                                    return line.ProductId === product.RecordId;
                                });

                            if (ObjectExtensions.isNullOrUndefined(matchingLine)) {
                                return Promise.reject(new ClientEntities.ExtensionError("Please scan a product that matches a selected fulfillment line."));
                            } else {
                                let fulfillmentLineParameters: ProxyEntities.FulfillmentLineParameter[] = [{
                                    SalesId: matchingLine.SalesId,
                                    SalesLineNumber: matchingLine.SalesLineNumber,
                                    Quantity: 1
                                }];

                                let markPickedRequest: MarkAsPickedServiceRequest<MarkAsPickedServiceResponse>
                                    = new MarkAsPickedServiceRequest(correlationId, fulfillmentLineParameters);
                                return this.context.runtime.executeAsync(markPickedRequest).then((): void => {
                                    this.refreshFulfillmentLines();
                                    this.context.logger.logInformational("FulfillmentLineCommand.execute finished", correlationId);
                                });
                            }
                        } else {
                            return Promise.reject(new ClientEntities.ExtensionError("Please scan a product that matches a selected fulfillment line."));
                        }
                    });
            } else {
                return Promise.resolve();
            }
        }).catch((reason: any): void => {
            ErrorHelper.displayErrorAsync(this.context, reason);
        });
    }
}