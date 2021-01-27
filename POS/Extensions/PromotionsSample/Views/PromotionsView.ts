/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import PromotionsViewModel from "./PromotionsViewModel";
import { Pivot, IPivotState, PivotItem, IPivotItemState } from "PosUISdk/Controls/Pivot";
import { IPromotionsViewModelOptions } from "./NavigationContracts";
import { ProxyEntities } from "PosApi/Entities";
import { BooleanFormatter, DateFormatter } from "PosApi/Consume/Formatters";
import { ObjectExtensions, StringExtensions, ArrayExtensions } from "PosApi/TypeExtensions";
import * as Controls from "PosApi/Consume/Controls";

/**
 * The controller for PromotionsView.
 */
export default class PromotionsView extends Views.CustomViewControllerBase {
    public readonly viewModel: PromotionsViewModel;
    public availableDiscountsDataList: Controls.IDataList<ProxyEntities.DiscountCode>;
    public upcomingDiscountsDataList: Controls.IDataList<ProxyEntities.DiscountCode>;
    public readonly promotionsPivot: Pivot;
    public readonly availableDiscountsPivotItem: PivotItem;
    public readonly upcomingDiscountsPivotItem: PivotItem;
    public constantPromotionDiscountsMenu: Controls.IMenu;
    private readonly _promotionsViewModelOptions?: IPromotionsViewModelOptions;
    private static readonly SHOW_DISCOUNTS_MENU_COMMAND_NAME: string = "showConstantPromotionDiscountsMenuCommand";
    private static readonly ADD_TO_SALE_COMMAND_NAME: string = "addToSaleCommand";
    private static readonly SELL_NOW_COMMAND_NAME: string = "sellNowCommand";

    /**
     * Initializes a new instance of the PromotionsViewModel class.
     * @param {ICustomViewControllerContext} context The custom view controller context.
     * @param {IPromotionsViewModelOptions} [options] The promotions view model options.
     */
    constructor(context: Views.ICustomViewControllerContext, options?: IPromotionsViewModelOptions) {

        let config: Views.ICustomViewControllerConfiguration = {
            title: "",
            commandBar: {
                commands: [
                    {
                        name: PromotionsView.SELL_NOW_COMMAND_NAME,
                        label: context.resources.getString("string_22"),
                        icon: Views.Icons.Buy,
                        isVisible: true,
                        canExecute: false,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.sellNowAsync();
                        }
                    },
                    {
                        name: PromotionsView.ADD_TO_SALE_COMMAND_NAME,
                        label: context.resources.getString("string_21"),
                        icon: Views.Icons.Add,
                        isVisible: true,
                        canExecute: false,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.viewModel.addToSaleAsync();
                        }
                    },
                    {
                        name: PromotionsView.SHOW_DISCOUNTS_MENU_COMMAND_NAME,
                        label: context.resources.getString("string_20"),
                        icon: Views.Icons.Money,
                        isVisible: true,
                        canExecute: true,
                        execute: (args: Views.CustomViewControllerExecuteCommandArgs): void => {
                            this.showConstantPromotionsDiscounts(args.commandId)
                        }
                    }, 
                ]
            }
        };

        super(context, config);

        // Initialize the view model.
        this._promotionsViewModelOptions = options;
        this.viewModel = new PromotionsViewModel(context, this.state);

         // Initialize the Available Discount Pivot
        let availableDiscountsPivotItemState: IPivotItemState = {
            header: context.resources.getString("string_5") // Available
        };
        this.availableDiscountsPivotItem = new PivotItem(availableDiscountsPivotItemState);

        // Initialize the Upcoming Discount Pivot
        let upcomingDiscountsPivotItemState: IPivotItemState = {
            header: context.resources.getString("string_6") // Upcoming
        };
        this.upcomingDiscountsPivotItem = new PivotItem(upcomingDiscountsPivotItemState);

        // Set the Promotions Pivot
        let promotionsPivotState: IPivotState = {
        };

        this.promotionsPivot = new Pivot(promotionsPivotState);

        this.state.title = this.viewModel.title();
    }

    /**
     * Called when the element of the page is ready.
     * @param {HTMLElement} element DOM element.
     */
    public onReady(element: HTMLElement): void {

        ko.applyBindings(this, element);

        let correlationId: string = this.context.logger.getNewCorrelationId();

        const APPLY_5PERCENT_DISCOUNT: string = "apply5PercentTotalDiscountMenuCommand";
        const APPLY_10PERCENT_DISCOUNT: string = "apply10PercentTotalDiscountMenuCommand";

        // Initialize the constant discounts menu and attach it to the app bar
        let menuOptions: Controls.IMenuOptions = {
            commands: [{
                id: APPLY_5PERCENT_DISCOUNT,
                label: this.context.resources.getString("string_25"), // Apply 5% total discount
            }, {
                    id: APPLY_10PERCENT_DISCOUNT,
                    label: this.context.resources.getString("string_26"), // Apply 10% total discount
                }],
            directionalHint: Controls.DirectionalHint.TopCenter,
            type: "button"
        };

        let menuRootElem: HTMLDivElement = element.querySelector("#constantPromotionDiscountsMenu") as HTMLDivElement;
        this.constantPromotionDiscountsMenu = this.context.controlFactory.create(this.context.logger.getNewCorrelationId(), "Menu", menuOptions, menuRootElem);

        this.constantPromotionDiscountsMenu.addEventListener("CommandInvoked", (eventData: { id: string }) => {
            if (eventData.id == APPLY_5PERCENT_DISCOUNT) {
                this.viewModel.setTransactionDiscount(5);
            } else {
                this.viewModel.setTransactionDiscount(10);
            }
        });

        // Initialize the Available Discount DataList
        let availablePromotionsDataListOptions: Readonly<Controls.IDataListOptions<ProxyEntities.DiscountCode>> = {
            columns: [
                {
                    title: this.context.resources.getString("string_10"), // Discount,
                    ratio: 10,
                    collapseOrder: 4,
                    minWidth: 50,
                    computeValue: (event: ProxyEntities.DiscountCode): string => {
                        return ObjectExtensions.isNullOrUndefined(event.Code) ? StringExtensions.EMPTY : event.Code;
                    }
                },
                {
                    title: this.context.resources.getString("string_11"), // Name
                    ratio: 50,
                    collapseOrder: 3,
                    minWidth: 100,
                    computeValue: (event: ProxyEntities.DiscountCode): string => {
                        return ObjectExtensions.isNullOrUndefined(event.Description) ? StringExtensions.EMPTY : event.Description;

                    }
                },
                {
                    title: this.context.resources.getString("string_13"), // End date
                    ratio: 20,
                    collapseOrder: 2,
                    minWidth: 50,
                    computeValue: (event: ProxyEntities.DiscountCode): string => {
                        return ObjectExtensions.isNullOrUndefined(event.ValidTo) ?
                            StringExtensions.EMPTY :
                            DateFormatter.toShortDateAndTime(event.ValidTo);
                    }
                },
                {
                    title: this.context.resources.getString("string_14"), // Coupon required
                    ratio: 20,
                    collapseOrder: 1,
                    minWidth: 25,
                    computeValue: (event: ProxyEntities.DiscountCode): string => { return BooleanFormatter.toYesNo(event.IsDiscountCodeRequired); }
                }
            ],
            data: this.viewModel.availablePromotions,
            interactionMode: Controls.DataListInteractionMode.None,
        };

        let dataListRootElem: HTMLDivElement = element.querySelector("#availableDiscountsListView") as HTMLDivElement;
        this.availableDiscountsDataList = this.context.controlFactory.create(correlationId, "DataList", availablePromotionsDataListOptions, dataListRootElem);
        this.availableDiscountsDataList.addEventListener("ItemInvoked", (eventData: { item: ProxyEntities.DiscountCode }) => {
            this.viewModel.listItemInvoked(eventData.item);
        });

        // Initialize the Upcoming Discount DataList
        let upcomingDiscountsDataListOptions: Readonly<Controls.IDataListOptions<ProxyEntities.DiscountCode>> = {
            interactionMode: Controls.DataListInteractionMode.None,
            columns: [
                {
                    title: this.context.resources.getString("string_10"), // Discount,
                    ratio: 10,
                    collapseOrder: 5,
                    minWidth: 50,
                    computeValue: (event: ProxyEntities.DiscountCode): string => {
                        return ObjectExtensions.isNullOrUndefined(event.Code) ? StringExtensions.EMPTY : event.Code;
                    }
                },
                {
                    title: this.context.resources.getString("string_11"), // Name
                    ratio: 40,
                    collapseOrder: 4,
                    minWidth: 100,
                    computeValue: (event: ProxyEntities.DiscountCode): string => {
                        return ObjectExtensions.isNullOrUndefined(event.Description) ? StringExtensions.EMPTY : event.Description;
                    }
                },
                {
                    title: this.context.resources.getString("string_12"), // Start date
                    ratio: 15,
                    collapseOrder: 3,
                    minWidth: 50,
                    computeValue: (event: ProxyEntities.DiscountCode): string => {
                        return ObjectExtensions.isNullOrUndefined(event.ValidFrom) ?
                            StringExtensions.EMPTY :
                            DateFormatter.toShortDateAndTime(event.ValidFrom);
                    }
                },
                {
                    title: this.context.resources.getString("string_13"), // End date
                    ratio: 15,
                    collapseOrder: 2,
                    minWidth: 50,
                    computeValue: (event: ProxyEntities.DiscountCode): string => {
                        return ObjectExtensions.isNullOrUndefined(event.ValidTo) ?
                            StringExtensions.EMPTY :
                            DateFormatter.toShortDateAndTime(event.ValidTo);
                    }
                },
                {
                    title: this.context.resources.getString("string_14"), // Coupon required
                    ratio: 20,
                    collapseOrder: 1,
                    minWidth: 25,
                    computeValue: (event: ProxyEntities.DiscountCode): string => { return BooleanFormatter.toYesNo(event.IsDiscountCodeRequired); }
                }
            ],
            data: this.viewModel.upcomingPromotions,
        };

        let upcomingDiscountsDataListRootElem: HTMLDivElement = element.querySelector("#upcomingDiscountsListView") as HTMLDivElement;
        this.upcomingDiscountsDataList = this.context.controlFactory.create(correlationId, "DataList", upcomingDiscountsDataListOptions, upcomingDiscountsDataListRootElem);
        this.upcomingDiscountsDataList.addEventListener("ItemInvoked", (eventData: { item: ProxyEntities.DiscountCode }) => {
            this.viewModel.listItemInvoked(eventData.item);
        });

        this.viewModel.loadAsync(this._promotionsViewModelOptions).then(() => {
            this.upcomingDiscountsDataList.data = this.viewModel.upcomingPromotions;
            this.availableDiscountsDataList.data = this.viewModel.availablePromotions;
        });

        let command: Views.ICommand = this._getCommand(PromotionsView.SELL_NOW_COMMAND_NAME);
        command.canExecute = this.viewModel.canAddItem();
        command = this._getCommand(PromotionsView.ADD_TO_SALE_COMMAND_NAME);
        command.canExecute = this.viewModel.canAddItem();
    }

    /**
     * Called to show the constant promotions discounts.
     * @param {string} appBarCommandId AppBar command id.
     */
    public showConstantPromotionsDiscounts(appBarCommandId: string): void {
        let anchor: HTMLElement = document.getElementById(appBarCommandId);
        this.constantPromotionDiscountsMenu.show(anchor);
    }

    /**
     * Called when the object is disposed.
     */
    public dispose(): void {

        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Get the specified app bar command.
     * @param {string} name AppBar command name
     */
    private _getCommand(name: string): Views.ICommand {
        return ArrayExtensions.firstOrUndefined(
            this.state.commandBar.commands,
            (c: Views.ICommand): boolean => { return c.name === name; });
    }
}