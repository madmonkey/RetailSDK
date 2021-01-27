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
import { ObjectExtensions } from "PosApi/TypeExtensions";

import BuyWarrantyViewModel from "./BuyWarrantyViewModel";
import { IBuyWarrantyViewModelOptions } from "./IBuyWarrantyViewModelOptions";
import { Entities } from "../../DataService/DataServiceRequests.g";
import * as Controls from "PosApi/Consume/Controls";
/**
 * The controller for BuyWarrantyView.
 */
export default class BuyWarrantyView extends Views.CustomViewControllerBase {
    public readonly viewModel: BuyWarrantyViewModel;
    public dataList: Controls.IDataList<Entities.WarrantyPlan>;

    /**
     * Creates an instance of the BuyWarrantyView class.
     * @param {Views.ICustomViewControllerContext} context The custom view controller context.
     * @param {IBuyWarrantyViewModelOptions} options The view model options.
     */
    constructor(context: Views.ICustomViewControllerContext, options?: IBuyWarrantyViewModelOptions) {
        let config: Views.ICustomViewControllerConfiguration = {
            title: "",
            commandBar: {
                commands: [
                    {
                        name: "buyWarrantyPlanCommand",
                        label: context.resources.getString("AddToTransactionLabel"),
                        icon: Views.Icons.LightningBolt,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.buyWarrantyPlan();
                        }
                    }
                ]
            }
        };

        super(context, config);

        // Initialize the view model.
        this.viewModel = new BuyWarrantyViewModel(context, this.state, options);

        this.state.title = this.viewModel.title();
    }

    /**
     * Bind the html element with view controller.
     *
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {
        ko.applyBindings(this, element);

        let dataListOptions: Readonly<Controls.IDataListOptions<Entities.WarrantyPlan>> = {
            columns: [
                {
                    title: this.context.resources.getString("PlanIdColumnName"),
                    ratio: 20,
                    collapseOrder: 1,
                    minWidth: 100,
                    computeValue: (rowData: Entities.WarrantyPlan): string => rowData.PlanId.toString()
                },
                {
                    title: this.context.resources.getString("NameColumnName"),
                    ratio: 60,
                    collapseOrder: 3,
                    minWidth: 100,
                    computeValue: (rowData: Entities.WarrantyPlan): string => rowData.Name
                },
                {
                    title: this.context.resources.getString("PriceColumnName"),
                    ratio: 20,
                    collapseOrder: 2,
                    minWidth: 100,
                    computeValue: (rowData: Entities.WarrantyPlan): string => CurrencyFormatter.toCurrency(rowData.Price)
                }
            ],
            data: [],
            interactionMode: Controls.DataListInteractionMode.SingleSelect,
        };

        let dataListRootElem: HTMLDivElement = element.querySelector("#warrantyDataList") as HTMLDivElement;
        this.dataList = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "DataList", dataListOptions, dataListRootElem);
        this.dataList.addEventListener("SelectionChanged", (eventData: { items: Entities.WarrantyPlan[] }) => {
            this.viewModel.selectionChanged(eventData.items);
        });

        this.viewModel.loadAsync()
            .then((plans: Entities.WarrantyPlan[]) => {
                this.dataList.data = plans
            });
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }
}