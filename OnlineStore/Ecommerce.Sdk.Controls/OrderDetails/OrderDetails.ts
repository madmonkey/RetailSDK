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

    export class OrderDetails {

        public errorMessages: ObservableArray<string>;
        private salesOrders: CommerceProxy.Entities.SalesOrder[];
        private salesOrder: Observable<CommerceProxy.Entities.SalesOrder>;
        private transactionId: string;
        private salesId: string;
        private salesOrderSearchLocationValue: number;
        private isSalesOrderLoaded;
        private _orderDetailsView;
        private _loadingDialog;
        private _loadingText;
        private errorPanel;
        private kitVariantProductType;
        private allDeliveryOptionDescriptions: CommerceProxy.Entities.DeliveryOption[];
        private transactionIdString: string = "tid";
        private salesIdString: string = "salesId";
        private salesOrderSearchLocationValueString = "slv";
        private currencyStringTemplate: string;

        constructor(element) {
            this._orderDetailsView = $(element);
            this._loadingDialog = this._orderDetailsView.find('.msax-Loading');
            this._loadingText = this._loadingDialog.find('.msax-LoadingText');
            this.errorPanel = this._orderDetailsView.find(" > .msax-ErrorPanel");
            LoadingOverlay.CreateLoadingDialog(this._loadingDialog, this._loadingText, 200, 200);

            this.kitVariantProductType = ko.observable<CommerceProxy.Entities.ProductType>(CommerceProxy.Entities.ProductType.KitVariant);
            this.isSalesOrderLoaded = ko.observable<boolean>(false);
            this.errorMessages = ko.observableArray<string>([]);
            this.salesOrders = null;
            this.salesOrder = ko.observable<CommerceProxy.Entities.SalesOrder>(null);
            this.transactionId = Utils.getQueryStringValue(this.transactionIdString);
            this.salesId = Utils.getQueryStringValue(this.salesIdString);
            this.salesOrderSearchLocationValue = Number(Utils.getQueryStringValue(this.salesOrderSearchLocationValueString));
            this.getAllDeliveryOptionDescriptions();

            this.getOrderDetails(this.transactionId, this.salesId, this.salesOrderSearchLocationValue);
        }

        private getResx(key: string) {
            // Gets the resource value.
            return Resources[key];
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

        private getDeliveryModeText(deliveryModeId: string): string {
            var deliveryModeText: string = "";
            if (!Utils.isNullOrUndefined(this.allDeliveryOptionDescriptions)) {
                for (var i = 0; i < this.allDeliveryOptionDescriptions.length; i++) {
                    if (this.allDeliveryOptionDescriptions[i].Code == deliveryModeId) {
                        deliveryModeText = this.allDeliveryOptionDescriptions[i].Description;
                        break;
                    }
                }
            }

            return deliveryModeText;
        }

        private closeDialogAndDisplayError(errorMessages: string[], isError: boolean) {
            LoadingOverlay.CloseLoadingDialog();
            this.showError(errorMessages, isError);
        }

        private showError(errorMessages: string[], isError: boolean) {
            this.errorMessages(errorMessages);

            if (isError) {
                this.errorPanel.addClass("msax-Error");
            }
            else if (this.errorPanel.hasClass("msax-Error")) {
                this.errorPanel.removeClass("msax-Error");
            }

            this.errorPanel.show();
            $(window).scrollTop(0);
        }

        private getSalesOrderStatusString(statusValue: number, transactionTypeValue: number): string {
            return Resources.String_242 + Core.getSalesStatusString(statusValue, transactionTypeValue); /* Status: XYZ */
        }

        // Service calls
        private getOrderDetails(transactionId: string, salesOrderId: string, searchLocationValue: number) {
            CommerceProxy.RetailLogger.getOrderDetailsStarted();
            LoadingOverlay.ShowLoadingDialog();

            var salesOrderResponse: IAsyncResult<CommerceProxy.Entities.SalesOrder> = null;
            if (!Utils.isNullOrWhiteSpace(salesOrderId)) {
                salesOrderResponse = SalesOrderWebApi.GetSalesOrderDetailsBySalesId(salesOrderId, this);
            }
            else if (!Utils.isNullOrWhiteSpace(transactionId)) {
                salesOrderResponse = SalesOrderWebApi.GetSalesOrderDetailsByTransactionId(transactionId, searchLocationValue, this);
            }

            salesOrderResponse.done((salesOrder: CommerceProxy.Entities.SalesOrder) => {
                    this.currencyStringTemplate = Core.getExtensionPropertyValue(salesOrder.ExtensionProperties, "CurrencyStringTemplate");
                    salesOrder["OrderNumber"] = Core.getOrderNumber(salesOrder);

                    var productIds: number[] = [];
                    for (var j = 0; j < salesOrder.SalesLines.length; j++) {
                        productIds.push(salesOrder.SalesLines[j].ProductId);
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

                            for (var i = 0; i < salesOrder.SalesLines.length; i++) {
                                var salesLine: CommerceProxy.Entities.SalesLine = salesOrder.SalesLines[i];
                                Core.populateProductDetailsForSalesLine(salesLine, simpleProductsByIdMap, this.currencyStringTemplate);
                                Core.populateKitItemDetailsForSalesLine(salesLine, simpleProductsByIdMap, this.currencyStringTemplate)
                            }

                            this.salesOrder(salesOrder);
                            this.isSalesOrderLoaded(true);
                            LoadingOverlay.CloseLoadingDialog();
                            CommerceProxy.RetailLogger.getOrderDetailsFinished();
                        })
                        .fail((errors: CommerceProxy.ProxyError[]) => {
                            CommerceProxy.RetailLogger.getSimpleProductsByIdError(errors[0].LocalizedErrorMessage);
                            var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                            this.closeDialogAndDisplayError(errorMessages, true);
                        });
                })
                .fail((errors: CommerceProxy.ProxyError[]) => {
                    Core.LogEvent(CommerceProxy.RetailLogger.getOrderDetailsError, errors, Resources.String_237); // Sorry, something went wrong. An error occurred while trying to get the order details information. Please refresh the page and try again.
                    var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                    this.closeDialogAndDisplayError(errorMessages, true);
                });
        }

        private getAllDeliveryOptionDescriptions() {
            CommerceProxy.RetailLogger.checkoutServiceGetAllDeliveryOptionDescriptionsStarted();
            LoadingOverlay.ShowLoadingDialog();
            OrgUnitWebApi.GetDeliveryOptionsInfo(this)
                .done((data: CommerceProxy.Entities.DeliveryOption[]) => {
                    if (!Utils.isNullOrUndefined(data)) {
                        this.allDeliveryOptionDescriptions = data;
                    }
                    else {
                        this.showError([Resources.String_237], true); // Sorry, something went wrong. An error occurred while trying to get delivery methods information. Please refresh the page and try again.
                    }
                    CommerceProxy.RetailLogger.checkoutServiceGetAllDeliveryOptionDescriptionsFinished();
                    LoadingOverlay.CloseLoadingDialog();
                })
                .fail((errors: CommerceProxy.ProxyError[]) => {
                    Core.LogEvent(CommerceProxy.RetailLogger.checkoutServiceGetAllDeliveryOptionDescriptionsError, errors, Resources.String_237); // Sorry, something went wrong. An error occurred while trying to get the order details information. Please refresh the page and try again.
                    var errorMessages: string[] = ErrorHelper.getErrorMessages(errors);
                    this.closeDialogAndDisplayError(errorMessages, true);
                });
        }
    }
}