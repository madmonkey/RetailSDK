/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Views from "PosApi/Create/Views";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { IExtensionViewControllerContext } from "PosApi/Create/Views";
import { ClientEntities } from "PosApi/Entities";
import * as CartOperations from "PosApi/Consume/Cart";

import { Entities, WarrantyPlan } from "../../DataService/DataServiceRequests.g";
import { IBuyWarrantyViewModelOptions } from "./IBuyWarrantyViewModelOptions";

type AddItemToCartResponse = CartOperations.AddItemToCartOperationResponse;
type AddItemToCartRequest = CartOperations.AddItemToCartOperationRequest<AddItemToCartResponse>;
type GetWarrantyPlanFromProductResponse = WarrantyPlan.GetWarrantyPlanFromProductResponse;
type GetWarrantyPlanFromProductRequest = WarrantyPlan.GetWarrantyPlanFromProductRequest<GetWarrantyPlanFromProductResponse>;

/**
 * The ViewModel for BuyWarrantyView.
 */
export default class BuyWarrantyViewModel implements IDisposable {
    public title: Observable<string>;
    public selectedPlanDescription: Observable<string>;

    private _context: IExtensionViewControllerContext;
    private _options: IBuyWarrantyViewModelOptions;
    private _selectedWarrantyPlan: Entities.WarrantyPlan;
    private _customViewControllerBaseState: Views.ICustomViewControllerBaseState; 

    /**
     * Creates an instance of the BuyWarrantyViewModel class.
     * @param {ICustomViewControllerContext} context The custom view controller context.
     * @param {ICustomViewControllerBaseState} state Tbe custom view controller base state.
     * @param {IBuyWarrantyViewModelOptions} options The view model options.
     */
    constructor(context: Views.ICustomViewControllerContext, state: Views.ICustomViewControllerBaseState,
        options?: IBuyWarrantyViewModelOptions) {
        this._context = context;
        this._options = options || { salesLine: undefined };

        this.title = ko.observable(context.resources.getString("WarrantyPlansTitle"));
        this._customViewControllerBaseState = state;
        this._customViewControllerBaseState.isProcessing = false;
        this.selectedPlanDescription = ko.observable("");
    }

    /**
     * Loads the view model.
     */
    public loadAsync(): Promise<Entities.WarrantyPlan[]> {
        this._customViewControllerBaseState.isProcessing = true;
        return this.getWarrantyPlans()
            .then((plans: Entities.WarrantyPlan[]): Entities.WarrantyPlan[] => {
                this._customViewControllerBaseState.isProcessing = false;
                return plans;
            })
            .catch(() => this._customViewControllerBaseState.isProcessing = false);
    }

    /**
     * Disposes of the view model's resources.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Event handler called when the warranty plan selection changes.
     * @param {Entities.WarrantyPlan[]} selectedLines The selected warranty plans.
     */
    public selectionChanged(selectedLines: Entities.WarrantyPlan[]): void {
        this._selectedWarrantyPlan = (selectedLines || [])[0];

        if (this._selectedWarrantyPlan) {
            this.selectedPlanDescription(this._selectedWarrantyPlan.Description);
        } else {
            this.selectedPlanDescription("");
        }
    }

    /**
     * Buys the selected warranty plan.
     */
    public buyWarrantyPlan(): void {
        if (this._selectedWarrantyPlan) {
            let correlationId: string
                = this._context.logger.logInformational("BuyWarrantyViewModel.buyWarrantyPlan adding item to cart...");
            let request: AddItemToCartRequest = new CartOperations.AddItemToCartOperationRequest([{
                productId: this._selectedWarrantyPlan.ProductId,
                quantity: 1
            }], correlationId);

            this._customViewControllerBaseState.isProcessing = true;
            this._context.runtime.executeAsync(request)
                .then((result: ClientEntities.ICancelableDataResult<AddItemToCartResponse>): void => {
                    if (!result.canceled) {
                        this._context.logger.logInformational(
                            "BuyWarrantyViewModel.buyWarrantyPlan add item to cart complete. Navigating to cart view.", correlationId);

                        let cartViewParameters: ClientEntities.CartViewNavigationParameters = new ClientEntities.CartViewNavigationParameters(correlationId);
                        this._context.navigator.navigateToPOSView("CartView", cartViewParameters);
                    }
                })
                .then(() => this._customViewControllerBaseState.isProcessing = false)
                .catch(() => this._customViewControllerBaseState.isProcessing = false);
        }
    }

    /**
     * Gets all warranty plans associated with the line passed as a view model option.
     * @returns {Promise<Entities.WarrantyPlan[]>} A promise containing the collection of warranty plans.
     */
    private getWarrantyPlans(): Promise<Entities.WarrantyPlan[]> {
        let request: GetWarrantyPlanFromProductRequest = new WarrantyPlan.GetWarrantyPlanFromProductRequest(this._options.salesLine.ProductId);
        return this._context.runtime.executeAsync(request).then(
            (result: ClientEntities.ICancelableDataResult<GetWarrantyPlanFromProductResponse>): Entities.WarrantyPlan[] => {
                if (result.canceled) {
                    return [];
                }

                return result.data.result;
            });
    }
}