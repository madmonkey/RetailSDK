/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IWarrantyEnabledProductsViewModelOptions } from "../../Views/Warranty/IWarrantyEnabledProductsViewModelOptions";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as ShowJournalView from "PosApi/Extend/Views/ShowJournalView";

export default class BuyWarrantyCommand extends ShowJournalView.ShowJournalExtensionCommandBase {
    private _selectedSalesOrder: ProxyEntities.SalesOrder;
    private _products: ProxyEntities.SimpleProduct[];
    private _customer: ProxyEntities.Customer;
    private _mode: ClientEntities.ShowJournalMode;

    /**
     * Creates a new instance of the BuyWarrantyCommand class.
     * @param {IExtensionCommandContext<ShowJournalView.IShowJournalToExtensionCommandMessageTypeMap>} context The command context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<ShowJournalView.IShowJournalToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "buyWarrantyCommand";
        this.label = this.context.resources.getString("BuyWarrantyLabel");
        this.extraClass = "iconAdd";

        this.journalSelectionHandler = (data: ShowJournalView.ShowJournalJournalSelectedData): void => {
            this._journalChanged(data);
        };

        this.journalSelectionClearedHandler = (): void => {
            this._journalChanged(undefined);
        };
    }

    /**
     * Initializes the command.
     * @param {ShowJournalView.IShowJournalExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: ShowJournalView.IShowJournalExtensionCommandState): void {
        this._mode = state.mode;
        this.isVisible = this._mode === ClientEntities.ShowJournalMode.ShowJournal;
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        this.isProcessing = true;
        this.context.navigator.navigate("WarrantyEnabledProductsView", <IWarrantyEnabledProductsViewModelOptions>{
            customer: this._customer,
            products: this._products,
            salesOrder: this._selectedSalesOrder
        });
        this.isProcessing = false;
    }

    /**
     * Handles the journal changed message by sending a message by updating the command state.
     * @param {ShowJournalView.ShowJournalJournalSelectedData} data The information about the selected journal.
     */
    private _journalChanged(data: ShowJournalView.ShowJournalJournalSelectedData): void {
        let hasWarrantyPlan: boolean = false;

        if (data) {
            this._selectedSalesOrder = data.salesOrder;
            this._products = data.products;
            this._customer = data.customer;

            // check visibility based on items
            hasWarrantyPlan = this._products && this._products.some(
                (product: ProxyEntities.SimpleProduct, index: number) => {
                    let value: ProxyEntities.CommercePropertyValue = this.getPropertyValue(product.ExtensionProperties, "HasWarrantyPlan");
                    let salesLine: ProxyEntities.SalesLine = this._selectedSalesOrder.SalesLines[index];
                    return !salesLine.IsVoided && (value && value.BooleanValue);
                });
        }

        this.canExecute = hasWarrantyPlan;
    }

    /**
     * Gets the property value given the column name.
     * @param {ProxyEntities.CommerceProperty[]} extensionProperties The extension properties collection.
     * @param {string} column The column name of the property value to be retrieved.
     * @returns The property value.
     */
    private getPropertyValue(extensionProperties: ProxyEntities.CommerceProperty[], column: string): ProxyEntities.CommercePropertyValue {
        extensionProperties = extensionProperties || [];
        return extensionProperties.filter((prop: ProxyEntities.CommerceProperty) => prop.Key === column)
            .map((prop: ProxyEntities.CommerceProperty) => prop.Value)[0];
    }
}