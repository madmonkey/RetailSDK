/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ProxyEntities } from "PosApi/Entities";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";
import { IBuyWarrantyViewModelOptions } from "./IBuyWarrantyViewModelOptions";
import { IWarrantyEnabledProductsViewModelOptions } from "./IWarrantyEnabledProductsViewModelOptions";
import { ICustomViewControllerContext, ICustomViewControllerBaseState } from "PosApi/Create/Views";

/**
 * The sales line and product interface.
 */
export interface ISalesLineProduct {
    salesLine: ProxyEntities.SalesLine;
    product: ProxyEntities.SimpleProduct;
}

/**
 * The ViewModel for WarrantyEnabledProductsViewModel.
 */
export default class WarrantyEnabledProductsViewModel implements IDisposable {
    public title: Observable<string>;
    public warrantyEnabledProducts: ISalesLineProduct[];

    private _context: ICustomViewControllerContext;
    private _options: IWarrantyEnabledProductsViewModelOptions;
    private _selectedSalesLine: ProxyEntities.SalesLine;
    private _customViewControllerBaseState: ICustomViewControllerBaseState;

    /**
     * Creates a new instance of the WarrantyEnabledProductsViewModel class.
     * @param {ICustomViewControllerContext} context The custom view controller context.
     * @param {ICustomViewControllerBaseState} state Tbe custom view controller base state.
     * @param {IWarrantyEnabledProductsViewModelOptions} [options] The view model options.
     */
    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState, options?: IWarrantyEnabledProductsViewModelOptions) {
        this._context = context;
        this._options = options || { customer: undefined, products: [], salesOrder: undefined };
        this._options.products = this._options.products || [];

        this.title = ko.observable(StringExtensions.format(
            this._context.resources.getString("WarrantyEnabledProductsTitleFormat"), this._options.salesOrder.ReceiptId));
        this._customViewControllerBaseState = state;
        this._customViewControllerBaseState.isProcessing = false;
        this.warrantyEnabledProducts = this.getProductsWithWarranty();
    }

    /**
     * Disposes of the view model's resources.
     */
    public dispose(): void {
        ObjectExtensions.disposeAllProperties(this);
    }

    /**
     * Event handler called when the line selection changes.
     * @param {ISalesLineProduct[]} selectedLines The selected lines.
     */
    public selectionChanged(selectedLines: ISalesLineProduct[]): void {
        if (selectedLines && selectedLines[0]) {
            this._selectedSalesLine = selectedLines[0].salesLine;
        }
    }

    /**
     * The event handler for showing the warranty plans of a selected line.
     */
    public showWarrantyPlans(): void {
        if (this._selectedSalesLine) {
            this._context.navigator.navigate("BuyWarrantyView", <IBuyWarrantyViewModelOptions>{ salesLine: this._selectedSalesLine });
        }
    }

    /**
     * Gets a list of warranty enabled lines.
     * @returns {ISalesLineProduct[]} The list of warranty enabled lines.
     */
    private getProductsWithWarranty(): ISalesLineProduct[] {
        let products: ProxyEntities.SimpleProduct[] = this._options.products || [];
        let salesLineInfos: ISalesLineProduct[] = products.map((product: ProxyEntities.SimpleProduct, index: number) => {
            let value: ProxyEntities.CommercePropertyValue = this.getPropertyValue(product.ExtensionProperties, "HasWarrantyPlan");
            let salesLine: ProxyEntities.SalesLine = this._options.salesOrder.SalesLines[index];

            if (!salesLine.IsVoided && (value && value.BooleanValue)) {
                return <ISalesLineProduct>{
                    salesLine: salesLine,
                    product: product
                };
            }

            return undefined;
        }).filter((lineInfo: ISalesLineProduct) => lineInfo);

        return salesLineInfos;
    }

    /**
     * Gets the property value given the column name.
     * @param {ProxyEntities.CommerceProperty[]} extensionProperties The extension properties collection.
     * @param {string} column The column name of the property value to be retrieved.
     * @returns {ProxyEntities.CommercePropertyValue} The property value.
     */
    private getPropertyValue(extensionProperties: ProxyEntities.CommerceProperty[], column: string): ProxyEntities.CommercePropertyValue {
        extensionProperties = extensionProperties || [];
        return extensionProperties.filter((prop: ProxyEntities.CommerceProperty) => prop.Key === column)
            .map((prop: ProxyEntities.CommerceProperty) => prop.Value)[0];
    }
}