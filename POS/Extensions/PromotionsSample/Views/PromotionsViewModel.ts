/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ProxyEntities, ClientEntities } from "PosApi/Entities";
import { ArrayExtensions, ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";
import { IPromotionsViewModelOptions } from "./NavigationContracts";
import {
    AddItemToCartOperationResponse,
    AddItemToCartOperationRequest,
    GetCurrentCartClientRequest,
    GetCurrentCartClientResponse,
    TotalDiscountPercentOperationRequest,
    TotalDiscountPercentOperationResponse
} from "PosApi/Consume/Cart";
import MessageHelpers from "../Utilities/MessageHelpers";
import KnockoutExtensionViewModelBase from "./BaseClasses/KnockoutExtensionViewModelBase";
import { ICustomViewControllerContext, ICustomViewControllerBaseState } from "PosApi/Create/Views";

/**
 * The ViewModel for PromotionsView.
 */
export default class PromotionsViewModel extends KnockoutExtensionViewModelBase {
    public title: Observable<string>;                                         // The view title
    public canAddItem: Computed<boolean>;                                     // Indicates whether an item can be added to the cart
    public availablePromotions: ProxyEntities.DiscountCode[];  // The available promotions related to the product
    public upcomingPromotions: ProxyEntities.DiscountCode[];   // The upcoming promotions related to the product
    

    private _context: ICustomViewControllerContext;                        // The view controller context
    private _product: Observable<ProxyEntities.SimpleProduct>;                // The product to show promotions
    private _catalogId: number;                                               // The catalog id containing the product
    private _customViewControllerBaseState: ICustomViewControllerBaseState; // The custom view controller state

 
    /**
     * Initializes a new instance of the PromotionsViewModel class.
     * @param {ICustomViewControllerContext} context The custom view controller  context.
     * @param {ICustomViewControllerBaseState} state Tbe custom view controller base state.
     */
    constructor(context: ICustomViewControllerContext, state: ICustomViewControllerBaseState) {
        super();

        this.availablePromotions = [];
        this.upcomingPromotions = [];
        this._context = context;
        this._product = ko.observable<ProxyEntities.SimpleProduct>(null);
        this.title = ko.observable(context.resources.getString("string_0")); // Promotions
        this._customViewControllerBaseState = state;
        this._customViewControllerBaseState.isProcessing = false;
        this.canAddItem = ko.computed<boolean>(() => {
            return !this._customViewControllerBaseState.isProcessing && !ObjectExtensions.isNullOrUndefined(this._product);
        }, this);
    }

    /**
     * Gets the product that has the listed promotions.
     * @returns The product
     */
    get Product(): ProxyEntities.SimpleProduct {
        return this._product();
    }

    /**
     * Sets the product that has the listed promotions.
     * @param {ProxyEntities.SimpleProduct} product The product
     */
    set Product(product: ProxyEntities.SimpleProduct) {
        this._product(product);
    }

    /**
     * Loads the view model data.
     * @param {IPromotionsViewModelOptions} options The view model options
     * @returns Promise<void> The promise after the option data has been processed
     */
    public loadAsync(options: IPromotionsViewModelOptions): Promise<void> {
        this._customViewControllerBaseState.isProcessing = true;

        this._context.logger.logInformational("PromotionsViewModel: Loading promotions");

        if (ObjectExtensions.isNullOrUndefined(options)) {
            this.Product = null;
            this._catalogId = Number.NaN;
        } else {
            this.Product = options.product;
            this._catalogId = options.catalogId;
            this.title(StringExtensions.format(
                this._context.resources.getString("string_1"), // Promotions: {0}
                this.Product.Description
            ));
        }

        return this.loadPromotionsAsync().then((promotions: ProxyEntities.DiscountCode[]) => {

            // Set the promotions
            if (ArrayExtensions.hasElements(promotions)) {
                let currentDate: Date = new Date();
                promotions.forEach((promotion: ProxyEntities.DiscountCode) => {
                    if (!ObjectExtensions.isNullOrUndefined(promotion) && promotion.IsEnabled) {
                        if ((promotion.ValidFrom <= currentDate) && (promotion.ValidTo >= currentDate)) {
                            this.availablePromotions.push(promotion);
                        } else if (promotion.ValidFrom > currentDate) {
                            this.upcomingPromotions.push(promotion);
                        }
                    }
                });
            }

            this._context.logger.logInformational("PromotionsViewModel: Loading promotions succeeded");
            this._customViewControllerBaseState.isProcessing = false;
        }).catch((reason: any) => {
            this._context.logger.logError("PromotionsViewModel: Loading promotions failed. Error: " + JSON.stringify(reason));
            this._customViewControllerBaseState.isProcessing = false;
            return Promise.reject(reason);
        });
    }

    /**
     * Adds the product to the cart and navigates to the cartview on success.
     * @returns Promise<void> The promise after addToSale has completed.
     */
    public addToSaleAsync(): Promise<void> {
        return this.addItemToCart(false);
    }

    /**
     * Adds the product to the cart.
     * @returns Promise<void> The promise after addToSale has completed.
     */
    public sellNowAsync(): Promise<void> {
        return this.addItemToCart(true);
    }

    /**
     * Handler for list item invocation.
     * @param {any} item
     */
    public listItemInvoked(item: any): void {
        let discount: ProxyEntities.DiscountCode = item;
        this._context.logger.logInformational("Promotion invoked:" + discount.Name);
    }

    /**
     * Sets the transaction discount on a transaction.
     * @returns Promise<void> The promise after setting the transaction discount has completed.
     */
    public setTransactionDiscount(discountPercentage: number): Promise<void> {
        // Do not set transaction discount if already busy
        if (this._customViewControllerBaseState.isProcessing) {
            return Promise.resolve();
        }

        this._context.logger.logInformational("PromotionsViewModel: Setting transaction discount. Discount percentage: " + discountPercentage.toString());

        // Mark that a product is being added to the cart
        this._customViewControllerBaseState.isProcessing = true;

        let cart: ProxyEntities.Cart = null;
        let cartRequest: GetCurrentCartClientRequest<GetCurrentCartClientResponse> = new GetCurrentCartClientRequest();

        // Apply the transaction discount to the cart.
        return this._context.runtime.executeAsync(cartRequest)
            .then((result: ClientEntities.ICancelableDataResult<GetCurrentCartClientResponse>): void => {
                if (!result.canceled) {
                    cart = result.data.result;
                }
            }).then((): Promise<ClientEntities.ICancelableDataResult<TotalDiscountPercentOperationResponse>> => {
                // If the cart is not defined then the operation is cancelled
                if (ObjectExtensions.isNullOrUndefined(cart)) {
                    this._customViewControllerBaseState.isProcessing = false;
                    let noopResponse: ClientEntities.ICancelableDataResult<TotalDiscountPercentOperationResponse> = {
                        canceled: true,
                        data: null
                    };

                    return Promise.resolve(noopResponse);
                }

                // Set the total discount on the cart
                let request: TotalDiscountPercentOperationRequest<TotalDiscountPercentOperationResponse> =
                    new TotalDiscountPercentOperationRequest<TotalDiscountPercentOperationResponse>(
                        cart,
                        this._context.logger.getNewCorrelationId(),
                        discountPercentage
                    );
                return this._context.runtime.executeAsync(request);
            }).then((response: ClientEntities.ICancelableDataResult<TotalDiscountPercentOperationResponse>) => {
                this._customViewControllerBaseState.isProcessing = false;
                this._context.logger.logInformational("PromotionsViewModel: Setting transaction discount succeeded.");
                if (response.canceled) {
                    return Promise.resolve();
                } else {
                    return MessageHelpers.ShowMessage(
                        this._context,
                        this._context.resources.getString("string_27"), // Total discount applied
                        StringExtensions.format(
                            this._context.resources.getString("string_28"), // {0}% total discount has been applied to the cart.
                            discountPercentage.toString()
                        )
                    );
                }
            }).catch((reason: any) => {
                this._customViewControllerBaseState.isProcessing = false;
                this._context.logger.logError("PromotionsViewModel: Setting total discount failed. Error: " + JSON.stringify(reason));
                return MessageHelpers.ShowErrorMessage(
                    this._context,
                    JSON.stringify(reason),
                    reason
                );
            });
    }



    /**
     * Loads the promotions for a given product.
     * @returns Promise<ProxyEntities.DiscountCode[]> The promise with the list of promotions retrieved
     */
    private loadPromotionsAsync(): Promise<ProxyEntities.DiscountCode[]> {
        // Do not load any promotions if there are no products defined
        if (ObjectExtensions.isNullOrUndefined(this.Product)) {
            return Promise.resolve([]);
        }

        // Create sample promotions to display
        let samplePromotions: ProxyEntities.DiscountCode[] = [];
        let samplePromotion: ProxyEntities.DiscountCodeClass;

        // Sample current promotions
        samplePromotion = new ProxyEntities.DiscountCodeClass();
        samplePromotion.Code = "ST100001";
        samplePromotion.Description = "Baseball sale - Disabled";
        samplePromotion.IsEnabled = false;
        samplePromotion.ValidFrom = this.getDate(-5);
        samplePromotion.ValidTo = this.getDate(100);
        samplePromotion.IsDiscountCodeRequired = false;
        samplePromotion.ConcurrencyMode = 1;
        samplePromotions.push(samplePromotion);

        samplePromotion = new ProxyEntities.DiscountCodeClass();
        samplePromotion.Code = "ST100002";
        samplePromotion.Description = "Water Bottle Promo";
        samplePromotion.IsEnabled = true;
        samplePromotion.ValidFrom = this.getDate(-1);
        samplePromotion.ValidTo = this.getDate(5);
        samplePromotion.IsDiscountCodeRequired = false;
        samplePromotion.ConcurrencyMode = 1;
        samplePromotions.push(samplePromotion);

        samplePromotion = new ProxyEntities.DiscountCodeClass();
        samplePromotion.Code = "ST100003";
        samplePromotion.Description = "BMX helmet sale";
        samplePromotion.IsEnabled = true;
        samplePromotion.ValidFrom = this.getDate(-5);
        samplePromotion.ValidTo = this.getDate(100);
        samplePromotion.IsDiscountCodeRequired = true;
        samplePromotion.ConcurrencyMode = 1;
        samplePromotions.push(samplePromotion);

        samplePromotion = new ProxyEntities.DiscountCodeClass();
        samplePromotion.Code = "ST100005";
        samplePromotion.Description = "SLR Future Discounts";
        samplePromotion.IsEnabled = true;
        samplePromotion.ValidFrom = this.getDate(1);
        samplePromotion.ValidTo = this.getDate(10);
        samplePromotion.IsDiscountCodeRequired = false;
        samplePromotion.ConcurrencyMode = 1;
        samplePromotions.push(samplePromotion);

        samplePromotion = new ProxyEntities.DiscountCodeClass();
        samplePromotion.Code = "ST100006";
        samplePromotion.Description = "Headphone Discounts - Past";
        samplePromotion.IsEnabled = true;
        samplePromotion.ValidFrom = this.getDate(-10);
        samplePromotion.ValidTo = this.getDate(-1);
        samplePromotion.IsDiscountCodeRequired = false;
        samplePromotion.ConcurrencyMode = 1;
        samplePromotions.push(samplePromotion);

        samplePromotion = new ProxyEntities.DiscountCodeClass();
        samplePromotion.Code = "ST100007";
        samplePromotion.Description = "Laptop Discounts";
        samplePromotion.IsEnabled = true;
        samplePromotion.ValidFrom = this.getDate(0);
        samplePromotion.ValidTo = this.getDate(10);
        samplePromotion.IsDiscountCodeRequired = false;
        samplePromotion.ConcurrencyMode = 1;
        samplePromotions.push(samplePromotion);

        return Promise.resolve(samplePromotions);
    }

    /**
     * Adds the item to cart.
     * @param {boolean} isQuickSale Whether this is for quick sale.
     * @return Promise<void> The promise after addToSale has completed.
     */
    private addItemToCart(quickSale: boolean): Promise<void> {
        // Do not add the item to the cart if already processing add item to cart or there is no product to add
        if (this._customViewControllerBaseState.isProcessing) {
            return Promise.resolve();
        } else if (ObjectExtensions.isNullOrUndefined(this.Product)) {
            return MessageHelpers.ShowMessage(
                this._context,
                this._context.resources.getString("string_30"), // Unable add item to the cart
                this._context.resources.getString("string_31"), // A catalog or a product was not configured. Please go back and select a different product...
            );
        }

        // Mark that a product is being added to the cart
        this._customViewControllerBaseState.isProcessing = true;

        // Set the product sale details for adding the item
        let productSaleDetails: ClientEntities.IProductSaleReturnDetails = {
            product: this.Product,
            quantity: 0,
            catalogId: this._catalogId
        };

        // Add the items to the cart
        let request: AddItemToCartOperationRequest<AddItemToCartOperationResponse> =
            new AddItemToCartOperationRequest<AddItemToCartOperationResponse>([productSaleDetails], this._context.logger.getNewCorrelationId());
        return this._context.runtime.executeAsync(request).then((result: ClientEntities.ICancelableDataResult<AddItemToCartOperationResponse>) => {
            // If the item was added to the cart and it is a quick sale, navigate to the cart view
            if ((!result.canceled) && (quickSale)) {
                let correlationId: string = this._context.logger.logInformational("PromotionsViewModel: Navigating to CartView...");
                let cartViewParameters: ClientEntities.CartViewNavigationParameters = new ClientEntities.CartViewNavigationParameters(correlationId);
                this._context.navigator.navigateToPOSView("CartView", cartViewParameters);
            }

            // Mark that a product is currently not being added to the cart
            this._customViewControllerBaseState.isProcessing = false;
        }).catch((reason: any) => {
            // Mark that a product is currently not being added to the cart
            this._customViewControllerBaseState.isProcessing = false;
            this._context.logger.logError("PromotionsViewModel: Adding item to cart failed. Error: " + JSON.stringify(reason));

            return MessageHelpers.ShowErrorMessage(
                this._context,
                JSON.stringify(reason),
                reason
            );
        });
    }

    /**
     * Gets a date with an offset of the number of days from the current date.
     * @param {number} days Number of days to offset
     * @returns Date The computed date
     */
    private getDate(days: number): Date {
        let newDate: Date = new Date();
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }
}