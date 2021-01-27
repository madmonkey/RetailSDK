/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import StoreHoursViewModel from "./StoreHoursViewModel";
import * as StoreHours from "../Entities/IStoreHours";
import StoreHourConverter from "../Converter/StoreHourConverter";
import { IStoreHoursExtensionViewModelOptions } from "./NavigationContracts";
import * as Controls from "PosApi/Consume/Controls";
import { ObjectExtensions } from "PosApi/TypeExtensions";

/**
 * The controller for SimpleExtensionView.
 */
export default class StoreHoursView extends Views.CustomViewControllerBase {
    public readonly viewModel: StoreHoursViewModel;
    public dataList: Controls.IDataList<StoreHours.IStoreHours>;

    constructor(context: Views.ICustomViewControllerContext, state: Views.ICustomViewControllerBaseState,
        options?: IStoreHoursExtensionViewModelOptions) {
        super(context);

        // Initialize the view model.
        this.viewModel = new StoreHoursViewModel(context, this.state, options);

        this.state.title = this.viewModel.title();
    }


    /**
     * Bind the html element with view controller.
     *
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {

        // Customized binding
        ko.applyBindings(this, element);
       
        // DataList
        let dataListOptions: Readonly<Controls.IDataListOptions<StoreHours.IStoreHours>> = {
            interactionMode: Controls.DataListInteractionMode.Invoke,
            data: this.viewModel.currentStoreHours,
            columns: [
                {
                    title: this.context.resources.getString("string_1"), // Week Day,
                    ratio: 40, collapseOrder: 1, minWidth: 100,
                    computeValue: (event: StoreHours.IStoreHours): string => { return StoreHourConverter.getWeekdayName(event.weekDay); }
                },
                {
                    title: this.context.resources.getString("string_2"), // Open hour
                    ratio: 30, collapseOrder: 2, minWidth: 100,
                    computeValue: (event: StoreHours.IStoreHours): string => { return StoreHourConverter.formatStoreHour(event.openHour); }
                },
                {
                    title: this.context.resources.getString("string_3"), // Close hour
                    ratio: 30, collapseOrder: 3, minWidth: 100,
                    computeValue: (event: StoreHours.IStoreHours): string => { return StoreHourConverter.formatStoreHour(event.closeHour); }
                }
            ]
        };

        let dataListRootElem: HTMLDivElement = element.querySelector("#storeHoursListView") as HTMLDivElement;
        this.dataList = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "DataList", dataListOptions, dataListRootElem);
        this.dataList.addEventListener("ItemInvoked", (eventData: { item: StoreHours.IStoreHours }) => {

            this.viewModel.listItemSelected(eventData.item).then(() => {
                this.dataList.data = this.viewModel.currentStoreHours;
            }); 
        });

        this.viewModel.loadAsync().then(() => {
            this.dataList.data = this.viewModel.currentStoreHours;
        }); 
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}