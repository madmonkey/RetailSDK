/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import { CurrencyFormatter } from "PosApi/Consume/Formatters";
import { Pivot, IPivotState } from "PosUISdk/Controls/Pivot";
import { PivotItem, IPivotItemState } from "PosUISdk/Controls/Pivot";

import WarrantyEnabledProductsViewModel from "./WarrantyEnabledProductsViewModel";
import { IWarrantyEnabledProductsViewModelOptions } from "./IWarrantyEnabledProductsViewModelOptions";
import { ISalesLineProduct } from "./WarrantyEnabledProductsViewModel";
import * as Controls from "PosApi/Consume/Controls";
import { ObjectExtensions } from "PosApi/TypeExtensions";

/**
 * The controller for BuyWarrantyView.
 */
export default class WarrantyEnabledProductsView extends Views.CustomViewControllerBase {
    public readonly viewModel: WarrantyEnabledProductsViewModel;
    public dataList: Controls.IDataList<ISalesLineProduct>;
    public readonly noProductsWithWarrantyMessage: string;
    public readonly pivot: Pivot;
    public readonly pivotItem: PivotItem;


    /**
     * Creates an instance of the WarrantyEnabledProductsView class.
     * @param {Views.ICustomViewControllerContext} context The custom view controller context.
     * @param {IWarrantyEnabledProductsViewModelOptions} options The view model options.
     */
    constructor(context: Views.ICustomViewControllerContext, options?: IWarrantyEnabledProductsViewModelOptions) {

        let config: Views.ICustomViewControllerConfiguration = {
            title: "",
            commandBar: {
                commands: [
                    {
                        name: "selectWarrantyPlanCommand",
                        label: context.resources.getString("ShowWarrantyPlansLabel"),
                        icon: Views.Icons.LightningBolt,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.showWarrantyPlans();
                        }
                    },
                ]
            }
        };

        super(context, config);

        // Initialize the view model.
        this.viewModel = new WarrantyEnabledProductsViewModel(context, this.state, options);

        this.state.title = this.viewModel.title();

        this.noProductsWithWarrantyMessage = this.context.resources.getString("NoWarrantyEnabledProductsMessage");

        let simplePivotItemState: IPivotItemState = { header: this.context.resources.getString("WarrantyEnabledProductsHeaderLabel") };
        this.pivotItem = new PivotItem(simplePivotItemState);

        let pivotState: IPivotState = { onSelectionChanged: undefined };
        this.pivot = new Pivot(pivotState);
    }

    /**
     * Bind the html element with view controller.
     *
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        // Customized binding
        ko.applyBindings(this, element);

        let dataListOptions: Readonly<Controls.IDataListOptions<ISalesLineProduct>> = {
            columns: [
                {
                    title: this.context.resources.getString("ItemIdColumnName"),
                    ratio: 20,
                    collapseOrder: 3,
                    minWidth: 100,
                    computeValue: (rowData: ISalesLineProduct): string => rowData.salesLine.ItemId
                },
                {
                    title: this.context.resources.getString("NameColumnName"),
                    ratio: 30,
                    collapseOrder: 4,
                    minWidth: 100,
                    computeValue: (rowData: ISalesLineProduct): string => rowData.product.Name
                },
                {
                    title: this.context.resources.getString("QuantityColumnName"),
                    ratio: 30,
                    collapseOrder: 1,
                    minWidth: 100,
                    computeValue: (rowData: ISalesLineProduct): string => rowData.salesLine.Quantity.toString()
                },
                {
                    title: this.context.resources.getString("PriceColumnName"),
                    ratio: 20,
                    collapseOrder: 2,
                    minWidth: 100,
                    computeValue: (rowData: ISalesLineProduct): string => CurrencyFormatter.toCurrency(rowData.salesLine.Price)
                }
            ],
            data: this.viewModel.warrantyEnabledProducts,
            interactionMode: Controls.DataListInteractionMode.SingleSelect,
        };

        let dataListRootElem: HTMLDivElement = element.querySelector("#warrantyEnabledProductsDataList") as HTMLDivElement;
        this.dataList = this.context.controlFactory.create("", "DataList", dataListOptions, dataListRootElem);
        this.dataList.addEventListener("SelectionChanged", (eventData: { items: ISalesLineProduct[] }): any => {
            this.viewModel.selectionChanged(eventData.items);
        });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}