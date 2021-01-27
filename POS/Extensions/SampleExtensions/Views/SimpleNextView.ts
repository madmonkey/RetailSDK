/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import { Pivot, IPivotState, PivotItem, IPivotItemState } from "PosUISdk/Controls/Pivot";
import { IEventRequest, SimpleNextViewModel } from "./SimpleNextViewModel";
import { ISimpleNextViewModelOptions } from "./NavigationContracts";
import { ClientEntities } from "PosApi/Entities";
import { DateFormatter } from "PosApi/Consume/Formatters";
import * as Controls from "PosApi/Consume/Controls";
import { ObjectExtensions } from "PosApi/TypeExtensions";

/**
 * The controller for SimpleNextView.
 */
export default class SimpleNextView extends Views.CustomViewControllerBase implements Views.IBarcodeScannerEndpoint, Views.IMagneticStripeReaderEndpoint {
    public readonly viewModel: SimpleNextViewModel;
    public dataList: Controls.IDataList<IEventRequest>;
    public readonly pivot: Pivot;
    public readonly simplePivotItem: PivotItem;
    public readonly workerRequestPivotItem: PivotItem;
    public readonly implementsIBarcodeScannerEndpoint: true;
    public readonly implementsIMagneticStripeReaderEndpoint: true;

    constructor(context: Views.ICustomViewControllerContext, state: Views.ICustomViewControllerBaseState,
        options: ISimpleNextViewModelOptions) {
        let config: Views.ICustomViewControllerConfiguration = {
            title: "",
            commandBar: {
                commands: [
                    {
                        name: "updateMessageCommand",
                        label: context.resources.getString("string_11"),
                        icon: Views.Icons.LightningBolt,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.updateMessage();
                        }
                    }
                ]
            }
        };

        super(context, config);

        this.context.logger.logInformational("SimpleNextView loaded");

        // Initialize the view model.
        this.viewModel = new SimpleNextViewModel(context, this.state, options);

        this.state.title = this.context.resources.getString("string_10");

        // Initialize the pivot.
        let simplePivotItemState: IPivotItemState = {
            header: this.context.resources.getString("string_8")
        };
        this.simplePivotItem = new PivotItem(simplePivotItemState);

        let extendedPivotItemState: IPivotItemState = {
            header: this.context.resources.getString("string_9")
        };
        this.workerRequestPivotItem = new PivotItem(extendedPivotItemState);

        let pivotState: IPivotState = {
            onSelectionChanged: this.viewModel.tabChanged.bind(this.viewModel, "onSelectionChanged")
        };
        this.pivot = new Pivot(pivotState);
    }

    /**
     * Initializes the page state when the page is created.
     * @param {HTMLElement} element The view's DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        // Initialize the POS SDK Controls.
        let dataListOptions: Readonly<Controls.IDataListOptions<IEventRequest>> = {
            interactionMode: Controls.DataListInteractionMode.MultiSelect,
            data: [],
            columns: [
                {
                    title: this.context.resources.getString("string_12"),
                    ratio: 20,
                    collapseOrder: 2,
                    minWidth: 100,
                    computeValue: (rowData: IEventRequest): string => { return DateFormatter.toShortDateAndTime(rowData.requestDateTime); }
                },
                {
                    title: this.context.resources.getString("string_13"),
                    ratio: 30,
                    collapseOrder: 4,
                    minWidth: 100,
                    computeValue: (rowData: IEventRequest): string => { return rowData.requestedWorkerName; }
                },
                {
                    title: this.context.resources.getString("string_14"),
                    ratio: 30,
                    collapseOrder: 1,
                    minWidth: 100,
                    computeValue: (rowData: IEventRequest): string => { return rowData.requestType; }
                },
                {
                    title: this.context.resources.getString("string_15"),
                    ratio: 20,
                    collapseOrder: 3,
                    minWidth: 100,
                    computeValue: (rowData: IEventRequest): string => { return rowData.requestStatus; }
                }
            ]
        };

        let dataListRootElem: HTMLDivElement = element.querySelector("#simpleListView") as HTMLDivElement;
        this.dataList = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "DataList", dataListOptions, dataListRootElem);
        this.dataList.addEventListener("SelectionChanged", (eventData: { items: IEventRequest[] }): any => {
            this.viewModel.selectionChanged(eventData.items);
        });
        this.dataList.addEventListener("ItemInvoked", (eventData: { item: IEventRequest }): any => {
            this.viewModel.listItemInvoked(eventData.item);
        });

        this.dataList.data = this.viewModel.load();
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Handler for barcode scanned.
     * @param {string} barcode
     */
    public onBarcodeScanned(barcode: string): void {
        this.context.logger.logInformational(barcode);
    }

    /**
     * Handler for card swiped on msr.
     * @param {ClientEntities.ICardInfo} card
     */
    public onMagneticStripeRead(card: ClientEntities.ICardInfo): void {
        this.context.logger.logInformational(card.CardNumber);
    }
}