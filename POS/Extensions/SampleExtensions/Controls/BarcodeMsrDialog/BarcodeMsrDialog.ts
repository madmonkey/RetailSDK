/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Dialogs from "PosApi/Create/Dialogs";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { ClientEntities } from "PosApi/Entities";
import { BarcodeMsrDialogInputType, IBarcodeMsrDialogResult } from "./BarcodeMsrDialogTypes";
import { AlphanumericNumPad, INumPadState, INumPadResult } from "PosUISdk/Controls/NumPad";

type BarcodeMsrDialogResolveFunction = (value: IBarcodeMsrDialogResult) => void;
type BarcodeMsrDialogRejectFunction = (reason: any) => void;

export default class BarcodeMsrDialog extends Dialogs.ExtensionTemplatedDialogBase {
    public numPad: AlphanumericNumPad;

    private resolve: BarcodeMsrDialogResolveFunction;
    private _inputType: BarcodeMsrDialogInputType;
    private _automatedEntryInProgress: boolean;

    constructor() {
        super();

        this._inputType = "None";
        this._automatedEntryInProgress = false;

        // Set the onBarcodeScanned property to enable the barcode scanner in a templated dialog.
        this.onBarcodeScanned = (data: string): void => {
            this._automatedEntryInProgress = true;
            this.numPad.value(data);
            this._inputType = "Barcode";
            this._automatedEntryInProgress = false;
        };

        // Set the onMsrSwiped property to handle MSR swipe events in a templated dialog.
        this.onMsrSwiped = (data: ClientEntities.ICardInfo): void => {
            this._automatedEntryInProgress = true;
            this.numPad.value(data.CardNumber);
            this._inputType = "MSR";
            this._automatedEntryInProgress = false;
        };

        let numPadState: INumPadState = {
            onEnter: this._onNumPadEnter.bind(this),
            captureGlobalInput: true,
            label: "Please enter a value, scan or swipe:"
        };

        this.numPad = new AlphanumericNumPad(this, numPadState);

        this.numPad.value.subscribe((newValue: string): void => {
            if (!this._automatedEntryInProgress) {
                this._inputType = "Manual";
            }
        });
    }

    /**
     * The function that is called when the dialog element is ready.
     * @param {HTMLElement} element The element containing the dialog.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);
    }

    /**
     * Opens the dialog.
     * @returns {Promise<IBarcodeMsrDialogResult>} The promise that represents showing the dialog and contains the dialog result.
     */
    public open(): Promise<IBarcodeMsrDialogResult> {
        let promise: Promise<IBarcodeMsrDialogResult> = new Promise((resolve: BarcodeMsrDialogResolveFunction, reject: BarcodeMsrDialogRejectFunction) => {
            this.resolve = resolve;
            let option: Dialogs.ITemplatedDialogOptions = {
                title: "Barcode Scanner and MSR Swipe Dialog",
                onCloseX: this._cancelButtonClickHandler.bind(this)
            };

            this.openDialog(option);
        });

        return promise;
    }

    /**
     * Handles the cancel button click.
     * @returns {boolean} True if the dialog should close. False otherwise.
     */
    private _cancelButtonClickHandler(): boolean {
        this._resolvePromise({ canceled: true });
        return false;
    }

    /**
     * Results the dialog promise with the specified result.
     * @param {IBarcodeMsrDialogResult} result The result with which the dialog promise should be resolved.
     */
    private _resolvePromise(result: IBarcodeMsrDialogResult): void {
        if (ObjectExtensions.isFunction(this.resolve)) {
            this.resolve(result);

            this.resolve = null;
            this.closeDialog();
        }
    }

    /**
     * Callback for numpad.
     * @param {INumPadResult} result Numpad current value.
     */
    private _onNumPadEnter(result: INumPadResult): void {
        this._resolvePromise({ canceled: false, inputType: this._inputType, value: result.value });
    }
}