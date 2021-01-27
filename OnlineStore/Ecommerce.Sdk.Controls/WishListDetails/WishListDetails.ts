/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

/// <reference path="../Common/Helpers/Core.ts" />
/// <reference path="../Resources/Resources.ts" />

module Contoso.Retail.Ecommerce.Sdk.Controls {
    "use strict";

    export class WishListDetails {

        public errorMessages: ObservableArray<string>;
        private _wishListView;
        private _loadingDialog;
        private _loadingText;
        private errorPanel;
        private wishListId: number;
        private wishListIdString: string = "wishListId";
        private isWishListDetailsLoaded;
        private wishListContainsItems;
        private kitVariantProductType;
        private currencyStringTemplate: string;
        private wishList: Observable<CommerceProxy.Entities.CommerceList>;
        private wishLists: ObservableArray<CommerceProxy.Entities.CommerceList>;
        private allWishListsDropDown: ObservableArray<{ Value: CommerceProxy.Entities.CommerceList; Text: string }>;
        private selectedWishList: Observable<CommerceProxy.Entities.CommerceList>;
        private selectedWishListLines: ObservableArray<CommerceProxy.Entities.CommerceListLine>;
        private selectAll: Observable<boolean>;

        constructor(element) {
            this._wishListView = $(element);
            this._loadingDialog = this._wishListView.find('.msax-Loading');
            this._loadingText = this._loadingDialog.find('.msax-LoadingText');
            this.errorPanel = this._wishListView.find(" > .msax-ErrorPanel");
            LoadingOverlay.CreateLoadingDialog(this._loadingDialog, this._loadingText, 200, 200);
            this.errorMessages = ko.observableArray<string>([]);

            this.wishListId = Utils.parseNumberFromLocaleString(Utils.getQueryStringValue(this.wishListIdString));

            this.wishList = ko.observable<CommerceProxy.Entities.CommerceList>(null);
            this.wishLists = ko.observableArray<CommerceProxy.Entities.CommerceList>([]);

            this.selectedWishListLines = ko.observableArray<CommerceProxy.Entities.CommerceListLine>([]);
            this.allWishListsDropDown = ko.observableArray([]);

            this.getWishLists();

            this.selectedWishList = ko.observable(null);
            this.selectedWishList.subscribe((selectedCommerceList: CommerceProxy.Entities.CommerceList) => {
                if (selectedCommerceList != null) {
                    this.getWishList(selectedCommerceList.Id);
                }
            }, this);

            this.selectAll = ko.observable(false);
            this.selectAll.subscribe((isSelectAll: boolean) => {
                var checkBoxes: JQuery = this._wishListView.find(".msax-WishListSummaryCheckBox");
                checkBoxes.each((index: number, element: HTMLInputElement) => {
                    if (element.checked !== isSelectAll) {
                        $(element).click();
                    }
                });
            }, this);

            this.kitVariantProductType = ko.observable<CommerceProxy.Entities.ProductType>(CommerceProxy.Entities.ProductType.KitVariant);
            this.isWishListDetailsLoaded = ko.observable<boolean>(false);
            this.wishListContainsItems = ko.computed(() => {
                return !Utils.isNullOrUndefined(this.wishList()) && Utils.hasElements(this.wishList().CommerceListLines);
            });
        }

        private getResx(key: string) {
            // Gets the resource value.
            return Resources[key];
        }

        private showError(isError: boolean) {
            // Shows the error message on the error panel.
            if (isError) {
                this.errorPanel.addClass("msax-Error");
            }
            else if (this.errorPanel.hasClass("msax-Error")) {
                this.errorPanel.removeClass("msax-Error");
            }

            this.errorPanel.show();
            $(window).scrollTop(0);
        }

        private getWishListDetailsUrl(wishList: CommerceProxy.Entities.CommerceList): string {
            var url: string = "/WishListDetails";

            url += "?wishListId=" + wishList.Id;

            return url;
        }

        private formatCurrencyString(amount: number): any {
            if (isNaN(amount)) {
                return amount;
            }
            var formattedCurrencyString: string = "";

            if (!Utils.isNullOrUndefined(amount)) {
                if (Utils.isNullOrUndefined(this.currencyStringTemplate)) {
                    formattedCurrencyString = amount.toString();
                }
                else {
                    formattedCurrencyString = Utils.format(this.currencyStringTemplate, Utils.formatNumber(amount));
                }
            }

            return formattedCurrencyString;
        }

        private quantityPlusClick(wishListLine: CommerceProxy.Entities.CommerceListLine) {
            // Handles quantity plus click.
            wishListLine.Quantity = wishListLine.Quantity + 1;
            this.updateLinesOnWishList(wishListLine);
        }

        private quantityMinusClick(wishListLine: CommerceProxy.Entities.CommerceListLine) {
            // Handles quantity minus click.
            if (wishListLine.Quantity == 1) {
                this.removeFromWishListClick(wishListLine);
            } else {
                wishListLine.Quantity = wishListLine.Quantity - 1;
                this.updateLinesOnWishList(wishListLine);
            }
        }

        private quantityTextBoxChanged(wishListLine: CommerceProxy.Entities.CommerceListLine, valueAccesor) {
            // Handles quantity text box change event.
            var srcElement = valueAccesor.target;
            if (!Utils.isNullOrUndefined(srcElement)) {
                if (Utils.isNullOrWhiteSpace(srcElement.value)) {
                    srcElement.value = wishListLine.Quantity;
                    return;
                }

                var enteredNumber: number = Number(srcElement.value);
                if (isNaN(enteredNumber)) {
                    srcElement.value = wishListLine.Quantity;
                    return;
                }

                if (enteredNumber != wishListLine.Quantity) {
                    wishListLine.Quantity = enteredNumber;
                    if (wishListLine.Quantity < 0) {
                        wishListLine.Quantity = 1;
                    }

                    if (wishListLine.Quantity == 0) {
                        this.removeFromWishListClick(wishListLine);
                    }
                    else {
                        this.updateLinesOnWishList(wishListLine);
                    }
                }
            }
        }

        // Service calls
        private getWishList(wishListId: number) {
            CommerceProxy.RetailLogger.getWishListStarted();
            LoadingOverlay.ShowLoadingDialog();
            WishListWebApi.GetWishList(wishListId, this)
                .done((responseWishList: CommerceProxy.Entities.CommerceList) => {
                    if (!Utils.hasElements(responseWishList.CommerceListLines)) {
                        this.wishList(responseWishList);
                        this.isWishListDetailsLoaded(true);
                        LoadingOverlay.CloseLoadingDialog();
                        CommerceProxy.RetailLogger.getWishListFinished();
                        return;
                    }
                    this.currencyStringTemplate = Core.getExtensionPropertyValue(responseWishList.ExtensionProperties, "CurrencyStringTemplate");
                    var productIds: number[] = [];
                    for (var j = 0; j < responseWishList.CommerceListLines.length; j++) {
                        productIds.push(responseWishList.CommerceListLines[j].ProductId);
                    }

                    CommerceProxy.RetailLogger.getSimpleProductsByIdStarted();
                    ProductWebApi.GetSimpleProducts(productIds, this)
                        .done((simpleProducts: CommerceProxy.Entities.SimpleProduct[]) => {
                            CommerceProxy.RetailLogger.getSimpleProductsByIdFinished();

                            //Create a dictionary
                            var simpleProductsByIdMap: CommerceProxy.Entities.SimpleProduct[] = [];
                            for (var i = 0; i < simpleProducts.length; i++) {
                                var key: number = simpleProducts[i].RecordId;
                                simpleProductsByIdMap[key] = simpleProducts[i];
                            }

                            for (var i = 0; i < responseWishList.CommerceListLines.length; i++) {
                                var wishListLine: CommerceProxy.Entities.CommerceListLine = responseWishList.CommerceListLines[i];
                                Core.populateProductDetailsForWishListLine(wishListLine, simpleProductsByIdMap, this.currencyStringTemplate);
                                Core.populateKitItemDetailsForWishListLine(wishListLine, simpleProductsByIdMap, this.currencyStringTemplate);
                                responseWishList.CommerceListLines[i][Constants.NetAmountProperty] = responseWishList.CommerceListLines[i].Quantity * responseWishList.CommerceListLines[i][Constants.BasePriceProperty];
                                responseWishList.CommerceListLines[i]["Selected"] = false;

                            }

                            this.wishList(responseWishList);
                            this.isWishListDetailsLoaded(true);
                            LoadingOverlay.CloseLoadingDialog();
                            CommerceProxy.RetailLogger.getWishListsFinished();
                        })
                        .fail((errors: CommerceProxy.ProxyError[]) => {
                            CommerceProxy.RetailLogger.getSimpleProductsByIdError(errors[0].LocalizedErrorMessage);
                            var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                            this.showError(true);
                        });
                })
                .fail((errors: CommerceProxy.ProxyError[]) => {
                    Core.LogEvent(CommerceProxy.RetailLogger.getWishListError, errors, Resources.String_254); // Sorry, something went wrong. The wish list information couldn't be retrieved. Please refresh the page and try again.
                    this.errorMessages([Resources.String_254]); // Sorry, something went wrong. The wish list information couldn't be retrieved. Please refresh the page and try again.
                    this.showError(true);
                    LoadingOverlay.CloseLoadingDialog();
                });
        }

        private removeFromWishListClick(wishListLine: CommerceProxy.Entities.CommerceListLine) {
            CommerceProxy.RetailLogger.removeItemsFromWishListStarted();
            LoadingOverlay.ShowLoadingDialog();

            WishListWebApi.RemoveItemsFromWishList(wishListLine.CommerceListId, [wishListLine.LineId], this)
                .done((responseWishList: CommerceProxy.Entities.CommerceList) => {
                    this.getWishList(responseWishList.Id);
                    LoadingOverlay.CloseLoadingDialog();
                    CommerceProxy.RetailLogger.removeItemsFromWishListFinished();
                })
                .fail((errors: CommerceProxy.ProxyError[]) => {
                    Core.LogEvent(CommerceProxy.RetailLogger.removeItemsFromWishListError, errors, Resources.String_262); // Sorry, something went wrong. We couldn't remove the item from your wish list.
                    var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                    this.showError(true);
                    LoadingOverlay.CloseLoadingDialog();
                });
        }

        private updateLinesOnWishList(wishListLine: CommerceProxy.Entities.CommerceListLine) {
            CommerceProxy.RetailLogger.updateLinesOnWishListStarted();
            LoadingOverlay.ShowLoadingDialog();

            WishListWebApi.UpdateLinesOnWishList(wishListLine.CommerceListId, [wishListLine], this)
                .done((responseWishList: CommerceProxy.Entities.CommerceList) => {
                    this.getWishList(responseWishList.Id);
                    LoadingOverlay.CloseLoadingDialog();
                    CommerceProxy.RetailLogger.updateLinesOnWishListFinished();
                })
                .fail((errors: CommerceProxy.ProxyError[]) => {
                    Core.LogEvent(CommerceProxy.RetailLogger.updateLinesOnWishListError, errors, Resources.String_263); "Sorry, something went wrong. We couldn't update the item in your wish list."
                    var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                    this.showError(true);
                    LoadingOverlay.CloseLoadingDialog();
                });
        }

        private getWishLists() {
            CommerceProxy.RetailLogger.getWishListsStarted();
            LoadingOverlay.ShowLoadingDialog();
            CustomerWebApi.GetWishListsByCustomer(this)
                .done((responseWishLists: CommerceProxy.Entities.CommerceList[]) => {
                    this.wishLists(responseWishLists);
                    var allwishLists: { Value: CommerceProxy.Entities.CommerceList; Text: string }[] = [];

                    for (var i = 0; i < this.wishLists().length; i++) {
                        allwishLists.push({
                            Value: this.wishLists()[i],
                            Text: this.wishLists()[i].Name
                        });

                        if (this.wishLists()[i].Id == this.wishListId) {
                            this.selectedWishList(this.wishLists()[i]);
                        }
                    }

                    this.allWishListsDropDown(allwishLists);
                    LoadingOverlay.CloseLoadingDialog();
                    CommerceProxy.RetailLogger.getWishListsFinished();
                })
                .fail((errors: CommerceProxy.ProxyError[]) => {
                    Core.LogEvent(CommerceProxy.RetailLogger.getWishListsError, errors, Resources.String_254); // Sorry, something went wrong. The wish list information couldn't be retrieved. Please refresh the page and try again.
                    this.errorMessages([Resources.String_254]); // Sorry, something went wrong. The wish list information couldn't be retrieved. Please refresh the page and try again.
                    this.showError(true);
                    LoadingOverlay.CloseLoadingDialog();
                });
        }

        private addToCartClick() {
            var selectedProductsIds: CommerceProxy.Entities.CommerceListLine[] = this.selectedWishListLines();
            var wishListLines: CommerceProxy.Entities.CommerceListLine[] = this.wishList().CommerceListLines;
            CommerceProxy.RetailLogger.addItemsToCartStarted();
            LoadingOverlay.ShowLoadingDialog();
            var cartLines: CommerceProxy.Entities.CartLine[] = [];
            var i = 0;
            while (selectedProductsIds.length != 0) {
                if (selectedProductsIds[selectedProductsIds.length - 1] == wishListLines[i].LineId) {
                    var cartLine: CommerceProxy.Entities.CartLine = new CommerceProxy.Entities.CartLineClass();
                    cartLine.Quantity = wishListLines[i].Quantity;
                    cartLine.ProductId = wishListLines[i].ProductId;
                    cartLines.push(cartLine);
                    selectedProductsIds.pop();
                    i = 0;
                }
                else {
                    i++;
                }
            }

            if (cartLines.length > 0) {
                CartWebApi.AddToCart(false, cartLines, this)
                    .done((cart: CommerceProxy.Entities.Cart) => {
                        CartWebApi.TriggerCartUpdateEvent(CommerceProxy.Entities.CartType.Shopping, cart);
                        LoadingOverlay.CloseLoadingDialog();
                        CommerceProxy.RetailLogger.addLinesToWishListFinished();
                    })
                    .fail((errors: CommerceProxy.ProxyError[]) => {
                        Core.LogEvent(CommerceProxy.RetailLogger.addItemsToCartError, errors, Resources.String_253); // Sorry, something went wrong. We couldn't edit the wish list details. Please refresh the page and try again.
                        var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                        this.showError(true);
                        LoadingOverlay.CloseLoadingDialog();
                    });
            }
            else {
                LoadingOverlay.CloseLoadingDialog();
            }

        }
    }
}