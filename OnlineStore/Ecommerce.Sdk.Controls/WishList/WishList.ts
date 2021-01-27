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

    export class WishList {

        public errorMessages: ObservableArray<string>;
        private wishListsExist;
        private wishLists: ObservableArray<CommerceProxy.Entities.CommerceList>;
        private wishListToBeUpdated: Observable<CommerceProxy.Entities.CommerceList>;
        private wishListToBeDeleted: Observable<CommerceProxy.Entities.CommerceList>;
        private _wishListView;
        private _loadingDialog;
        private _loadingText;
        private errorPanel;
        private deleteWishListConfirmationModal;
        private editWishListModal;
        private createWishListModal;
        private dialogOverlay;

        private wishListCount: number = parseInt(msaxValues.msax_WishListCount);
        private isFullView;

        constructor(element) {
            this._wishListView = $(element);
            this._loadingDialog = this._wishListView.find('.msax-Loading');
            this._loadingText = this._loadingDialog.find('.msax-LoadingText');
            this.errorPanel = this._wishListView.find(" > .msax-ErrorPanel");
            this.deleteWishListConfirmationModal = this._wishListView.find('.msax-DeleteWishListConfirmationModal');
            this.editWishListModal = this._wishListView.find('.msax-EditWishListModal');
            this.createWishListModal = this._wishListView.find('.msax-CreateWishListModal');
            LoadingOverlay.CreateLoadingDialog(this._loadingDialog, this._loadingText, 200, 200);
            this.errorMessages = ko.observableArray<string>([]);

            this.isFullView = ko.computed(() => {
                return (Utils.isNullOrUndefined(msaxValues.msax_WishListIsFullView) ? false : msaxValues.msax_WishListIsFullView.toLowerCase() == "true");
            });

            this.wishLists = ko.observableArray<CommerceProxy.Entities.CommerceList>([]);
            this.wishListToBeUpdated = ko.observable<CommerceProxy.Entities.CommerceList>(null);
            this.wishListToBeDeleted = ko.observable<CommerceProxy.Entities.CommerceList>(null);

            this.wishListsExist = ko.computed(() => {
                return (this.wishLists().length != 0);
            });

            this.getWishLists();
        }

        private getResx(key: string) {
            // Gets the resource value.
            return Resources[key];
        }

        private editWishListOverlayClick() {
            this.dialogOverlay = $('.ui-widget-overlay');
            this.dialogOverlay.on('click', $.proxy(this.closeEditWishListDialog, this));
        }

        private openDeleteWishListConfirmationDialog(args: any) {
            this.wishListToBeDeleted(args);
            if (!Utils.isNullOrEmpty(this.deleteWishListConfirmationModal)) {
                this.deleteWishListConfirmationModal.modal('show');
            }
        }

        private closeDeleteWishListConfirmationDialog() {
            if (!Utils.isNullOrEmpty(this.deleteWishListConfirmationModal)) {
                this.deleteWishListConfirmationModal.modal('hide');
            }
        }

        private openEditWishListDialog(args: any) {
            this.wishListToBeUpdated(args);
            if (!Utils.isNullOrEmpty(this.editWishListModal)) {
                this.editWishListModal.modal('show');
            }
        }

        private closeEditWishListDialog() {
            if (!Utils.isNullOrEmpty(this.editWishListModal)) {
                this.editWishListModal.modal('hide');
            }
        }

        private openCreateWishListDialog() {
            if (!Utils.isNullOrEmpty(this.createWishListModal)) {
                this.createWishListModal.modal('show');
            }
        }

        private closeCreateWishListDialog() {
            if (!Utils.isNullOrEmpty(this.createWishListModal)) {
                this.createWishListModal.modal('hide');
            }
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
            var url: string = msaxValues.msax_WishListDetailsUrl;

            url += "?wishListId=" + wishList.Id;

            return url;
        }

        // Service calls
        private getWishLists() {
            CommerceProxy.RetailLogger.getWishListsStarted();
            LoadingOverlay.ShowLoadingDialog();
            CustomerWebApi.GetWishListsByCustomer(this)
                .done((responseWishLists: CommerceProxy.Entities.CommerceList[]) => {
                    this.wishLists(responseWishLists);
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

        private createWishList() {
            CommerceProxy.RetailLogger.createWishListStarted();
            LoadingOverlay.ShowLoadingDialog();
            var newWishListName: string = this.createWishListModal.find('#CreateWishListTextBox').val();

            WishListWebApi.CreateWishList(newWishListName, this)
                .done((wishList: CommerceProxy.Entities.CommerceList) => {
                    if (!Utils.isNullOrUndefined(wishList)) {
                        this.closeCreateWishListDialog();
                    } else {
                        this.showError(true);
                    }

                    this.getWishLists();
                    LoadingOverlay.CloseLoadingDialog();
                    CommerceProxy.RetailLogger.createWishListFinished();
                })
                .fail((errors: CommerceProxy.ProxyError[]) => {
                    Core.LogEvent(CommerceProxy.RetailLogger.createWishListError, errors, Resources.String_251); // Sorry, something went wrong. We couldn't create the wish list.
                    var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                    this.showError(true);
                    LoadingOverlay.CloseLoadingDialog();
                });
        }

        private deleteWishList() {
            CommerceProxy.RetailLogger.deleteWishListStarted();
            LoadingOverlay.ShowLoadingDialog();
            var deletedWishList: CommerceProxy.Entities.CommerceList = this.wishListToBeDeleted();

            WishListWebApi.DeleteWishList(deletedWishList.Id.toString(), this)
                .done((data: CommerceProxy.Entities.CommerceList) => {
                    this.getWishLists();
                    this.deleteWishListConfirmationModal.modal('hide');
                    LoadingOverlay.CloseLoadingDialog();
                    CommerceProxy.RetailLogger.deleteWishListFinished();
                })
                .fail((errors: CommerceProxy.ProxyError[]) => {
                    Core.LogEvent(CommerceProxy.RetailLogger.deleteWishListError, errors, Resources.String_252); // Sorry, something went wrong. We couldn't delete the wish list.
                    var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                    this.showError(true);
                    LoadingOverlay.CloseLoadingDialog();
                });
        }

        private updateWishList() {
            CommerceProxy.RetailLogger.updateWishListStarted();
            LoadingOverlay.ShowLoadingDialog();
            var newWishListName: string = this.editWishListModal.find('#EditWishListTextBox').val();
            var updatedWishList: CommerceProxy.Entities.CommerceList = this.wishListToBeUpdated();
            updatedWishList.Name = newWishListName;

            WishListWebApi.UpdateWishList(updatedWishList, this)
                .done((wishList: CommerceProxy.Entities.CommerceList) => {
                    if (!Utils.isNullOrUndefined(wishList)) {
                        this.closeEditWishListDialog();
                    } else {
                        this.showError(true);
                    }

                    this.getWishLists();
                    LoadingOverlay.CloseLoadingDialog();
                    CommerceProxy.RetailLogger.updateWishListFinished();
                })
                .fail((errors: CommerceProxy.ProxyError[]) => {
                    Core.LogEvent(CommerceProxy.RetailLogger.updateWishListError, errors, Resources.String_253); // Sorry, something went wrong. We couldn't edit the wish list details. Please refresh the page and try again.
                    var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                    this.showError(true);
                    LoadingOverlay.CloseLoadingDialog();
                });
        }

        private markWishListAsFavorite(args: CommerceProxy.Entities.CommerceList) {
            CommerceProxy.RetailLogger.updateWishListStarted();
            LoadingOverlay.ShowLoadingDialog(Utils.format("The wish list {0} is your new favorite", args.Name));
            this.wishListToBeUpdated(args);
            var updatedWishList: CommerceProxy.Entities.CommerceList = this.wishListToBeUpdated();
            updatedWishList.IsFavorite = true;
            WishListWebApi.UpdateWishList(updatedWishList, this)
                .done((wishList: CommerceProxy.Entities.CommerceList) => {
                    this.getWishLists();
                    LoadingOverlay.CloseLoadingDialog();
                    CommerceProxy.RetailLogger.updateWishListFinished();
                })
                .fail((errors: CommerceProxy.ProxyError[]) => {
                    Core.LogEvent(CommerceProxy.RetailLogger.updateWishListError, errors, Resources.String_253); // Sorry, something went wrong. We couldn't edit the wish list details. Please refresh the page and try again.
                    var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                    this.showError(true);
                    LoadingOverlay.CloseLoadingDialog();
                });
        }
    }
}