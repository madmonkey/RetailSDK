/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { ArrayExtensions } from "PosApi/TypeExtensions";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as SearchView from "PosApi/Extend/Views/SearchView";
import { IPromotionsViewModelOptions } from "../../Views/NavigationContracts";
import * as Products from "PosApi/Consume/Products";
import MessageHelpers from "../../Utilities/MessageHelpers";

export default class ShowPromotionsCommand extends SearchView.ProductSearchExtensionCommandBase {

    private _productSearchResultsSelectedData: ProxyEntities.ProductSearchResult[];

    /**
     * Creates a new instance of the ShowPromotionsCommand class.
     * @param {IExtensionCommandContext<SearchView.IProductSearchToExtensionMessageTypeMap>} context The command context.
     */
    constructor(context: IExtensionCommandContext<SearchView.IProductSearchToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "showPromotions";
        this.label = context.resources.getString("string_40"); // Promotions
        this.extraClass = "iconAssign";

        this.searchResultsSelectedHandler = (data: SearchView.ProductSearchSearchResultSelectedData): void => {
            if (ArrayExtensions.hasElements(data.productSearchResults) && data.productSearchResults.length === 1) {
                this.canExecute = true;
                this._productSearchResultsSelectedData = data.productSearchResults;
            } else {
                this.canExecute = false;
                this._productSearchResultsSelectedData = [];
            }
        };

        this.searchResultSelectionClearedHandler = () => {
            this.canExecute = false;
            this._productSearchResultsSelectedData = [];
        };
    }

    /**
     * Initializes the command.
     * @param {CustomerDetailsView.ICustomerDetailsExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: SearchView.IProductSearchExtensionCommandState): void {
            this.isVisible = true;
            this._productSearchResultsSelectedData = [];
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        this.context.logger.logInformational("ProducSearch ShowPromotionsCommand: Get product data and navigate to ShowPromotions...");

        // Mark that the command is processing so the UI can reflect a processing state
        this.isProcessing = true;

        // Create the promise to get the product catalog store
        let getProductCatalogStoreClientRequest: Products.GetCurrentProductCatalogStoreClientRequest<Products.GetCurrentProductCatalogStoreClientResponse> =
            new Products.GetCurrentProductCatalogStoreClientRequest();
        let getProductCatalogStoreClientPromise: Promise<ClientEntities.ICancelableDataResult<Products.GetCurrentProductCatalogStoreClientResponse>> =
            this.context.runtime.executeAsync(getProductCatalogStoreClientRequest);

        // Create the promise to get the product data
        let productIds: number[] = [];
        this._productSearchResultsSelectedData.forEach((productSearchResult: ProxyEntities.ProductSearchResult) => {
            productIds.push(productSearchResult.RecordId);
        });
        let getProductsByIdsClientRequest: Products.GetProductsByIdsClientRequest<Products.GetProductsByIdsClientResponse> =
            new Products.GetProductsByIdsClientRequest(productIds);
        let getProductsByIdsClientPromise: Promise<ClientEntities.ICancelableDataResult<Products.GetProductsByIdsClientResponse>> =
            this.context.runtime.executeAsync(getProductsByIdsClientRequest);

        // Navigate to promotions view after the data has been retrieved
        Promise.all([getProductCatalogStoreClientPromise, getProductsByIdsClientPromise]).then((results: any[]): void => {
            let getproductCatalogStoreClientResponse: ClientEntities.ICancelableDataResult<Products.GetCurrentProductCatalogStoreClientResponse> = results[0];
            let getProductsByIdsClientResponse: ClientEntities.ICancelableDataResult<Products.GetProductsByIdsClientResponse> = results[1];

            if (!(getproductCatalogStoreClientResponse.canceled || getProductsByIdsClientResponse.canceled)) {
                let product: ProxyEntities.SimpleProduct = ArrayExtensions.hasElements(getProductsByIdsClientResponse.data.products)
                    ? getProductsByIdsClientResponse.data.products[0]
                    : null;
                let options: IPromotionsViewModelOptions = { product: product, catalogId: getproductCatalogStoreClientResponse.data.context.CatalogId };
                this.context.navigator.navigate("PromotionsView", options);
            }
            this.isProcessing = false;
        }).catch((reason: any) => {
            this.isProcessing = false;
            this.context.logger.logError(
                "ProducSearch ShowPromotionsCommand: Get product data and navigate to ShowPromotions failed. Error: " + JSON.stringify(reason)
            );

            return MessageHelpers.ShowErrorMessage(
                this.context,
                JSON.stringify(reason),
                reason
            );
        });
    }
}