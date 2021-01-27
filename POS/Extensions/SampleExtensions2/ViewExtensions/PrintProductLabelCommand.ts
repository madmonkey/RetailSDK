/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ProxyEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as SimpleProductDetailsView from "PosApi/Extend/Views/SimpleProductDetailsView";

export default class PrintProductLabelCommand extends SimpleProductDetailsView.SimpleProductDetailsExtensionCommandBase {

    private _product: ProxyEntities.SimpleProduct;

    /**
     * Creates a new instance of the PrintProductLabelCommand class.
     * @param {IExtensionCommandContext<ISimpleProductDetailsToExtensionCommandMessageTypeMap>} context The command context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<SimpleProductDetailsView.ISimpleProductDetailsToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "printProductLabelCommand";
        this.label = "Print product label";
        this.extraClass = "iconPrint";

        this.productChangedHandler = (data: SimpleProductDetailsView.SimpleProductDetailsProductChangedData): void => {
            this._productChanged(data.product);
        };

        this.isVisible = true;
    }

    /**
     * Initializes the command.
     * @param {ISimpleProductDetailsExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: SimpleProductDetailsView.ISimpleProductDetailsExtensionCommandState): void {
        this._productChanged(state.product);
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        this.isProcessing = true;
        window.setTimeout((): void => {
            this.isProcessing = false;
        }, 2000);
    }

    /**
     * Handles the product changed message by sending a message indicating whether or not the command can be executed.
     * @param {ProxyEntities.SimpleProduct} product The product.
     */
    private _productChanged(product: ProxyEntities.SimpleProduct): void {
        this._product = product;
        let isMasterProduct: boolean = product.ProductTypeValue === ProxyEntities.ProductType.Master;
        this.canExecute = !isMasterProduct;
    }
}