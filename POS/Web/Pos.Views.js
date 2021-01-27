"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ViewControllerBase = (function (_super) {
            __extends(ViewControllerBase, _super);
            function ViewControllerBase(context, config, saveInHistory) {
                if (saveInHistory === void 0) { saveInHistory = true; }
                var _this = _super.call(this, saveInHistory) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(config)) {
                    throw new Error("ViewControllerBase requires a config");
                }
                _this._context = context;
                _this.config = config;
                _this._children = [];
                _this._numPadInputBroker = new Commerce.Peripherals.NumPadInputBroker();
                var initialTitle = !Commerce.ObjectExtensions.isNullOrUndefined(_this.config)
                    && !Commerce.StringExtensions.isNullOrWhitespace(_this.config.title)
                    ? _this.config.title : Commerce.StringExtensions.EMPTY;
                _this.title = ko.observable(initialTitle);
                return _this;
            }
            Object.defineProperty(ViewControllerBase.prototype, "numPadInputBroker", {
                get: function () {
                    return this._numPadInputBroker;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewControllerBase.prototype, "saveInHistory", {
                get: function () { return this._saveInHistory; },
                enumerable: true,
                configurable: true
            });
            ViewControllerBase.prototype.onShown = function () {
                return;
            };
            ViewControllerBase.prototype.onHidden = function () {
                return;
            };
            ViewControllerBase.prototype.onCreated = function (element) {
                this._element = element;
                this._children.forEach(function (control) {
                    element.appendChild(control.element);
                });
            };
            ViewControllerBase.prototype.unload = function () {
                this._element = null;
                this._children = null;
            };
            Object.defineProperty(ViewControllerBase.prototype, "context", {
                get: function () {
                    return this._context;
                },
                enumerable: true,
                configurable: true
            });
            ViewControllerBase.prototype.enableNumPad = function () {
                this._context.peripherals.numPad.enable(this.numPadInputBroker);
            };
            ViewControllerBase.prototype.disableNumPad = function () {
                this._context.peripherals.numPad.disable();
            };
            ViewControllerBase.prototype.createViewModelContext = function () {
                return {
                    runtime: this._context.runtime,
                    peripherals: this._context.peripherals,
                    managerFactory: this._context.managerFactory,
                    stringResourceManager: this._context.stringResourceManager,
                    triggerManager: Commerce.Triggers.TriggerManager.instance
                };
            };
            ViewControllerBase.DEFAULT_DELAY_IN_MILLISECONDS_ON_PAGE_LOAD_VISIBILITY = 500;
            return ViewControllerBase;
        }(Commerce.Extensibility.DisposableViewControllerBase));
        ViewControllers.ViewControllerBase = ViewControllerBase;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var MessageChannelEndpoint = Commerce.Messaging.MessageChannelEndpoint;
        var CustomViewControllerAdapter = (function (_super) {
            __extends(CustomViewControllerAdapter, _super);
            function CustomViewControllerAdapter(context, createViewController, options) {
                var _this = this;
                var posToCustomViewPort = new Commerce.Messaging.PosMessagePort();
                var customViewToPosPort = new Commerce.Messaging.PosMessagePort();
                var title = Commerce.StringExtensions.EMPTY;
                var messageChannel = new MessageChannelEndpoint(posToCustomViewPort, customViewToPosPort);
                var viewController;
                var exception;
                try {
                    viewController = createViewController(new MessageChannelEndpoint(customViewToPosPort, posToCustomViewPort), options);
                    title = viewController.state.title;
                }
                catch (ex) {
                    exception = new Commerce.Client.Entities.PosExtensionError(new Commerce.Client.Entities.ExtensionError(ex.message));
                }
                _this = _super.call(this, context, { title: title }, false) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(exception)) {
                    _this._customViewController = viewController;
                    messageChannel.addMessageHandler("TitleChanged", function (newHeaderTitle) {
                        _this.title(newHeaderTitle);
                    });
                    var viewModelOptions = {
                        messageChannel: messageChannel,
                        isProcessing: _this._customViewController.state.isProcessing,
                        commands: _this._customViewController.state.commandBar.commands
                    };
                    _this.viewModel = new Commerce.ViewModels.CustomViewControllerAdapterViewModel(_this.createViewModelContext(), viewModelOptions);
                    if (_this._implementsINumPadInputSubscriberEndpoint(_this._customViewController)) {
                        _this._customViewController.setNumPadInputSubscriber(_this.numPadInputBroker);
                    }
                }
                else {
                    _this._createViewControllerException = exception;
                    var viewModelOptions = {
                        messageChannel: messageChannel,
                        isProcessing: false,
                        commands: []
                    };
                    _this.viewModel = new Commerce.ViewModels.CustomViewControllerAdapterViewModel(_this.createViewModelContext(), viewModelOptions);
                }
                return _this;
            }
            CustomViewControllerAdapter.prototype.dispose = function () {
                Commerce.ObjectExtensions.tryDispose(this._customViewController);
                this._customViewController = null;
                _super.prototype.dispose.call(this);
            };
            CustomViewControllerAdapter.prototype.onReady = function (element) {
                _super.prototype.onReady.call(this, element);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._customViewController)) {
                    $(element).addClass(CustomViewControllerAdapter.CUSTOM_VIEW_CONTROLLER_ROOT_CLASS_NAME);
                    this._customViewController.onReady(element);
                }
            };
            CustomViewControllerAdapter.prototype.onShown = function () {
                _super.prototype.onShown.call(this);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._customViewController)) {
                    if (this._implementsIMagneticStripeReaderEndpoint(this._customViewController)) {
                        var onMagneticStripeRead = this._customViewController.onMagneticStripeRead;
                        Commerce.Peripherals.instance.magneticStripeReader.enableAsync(onMagneticStripeRead.bind(this._customViewController));
                    }
                    if (this._implementsIBarcodeScannerEndpoint(this._customViewController)) {
                        Commerce.Peripherals.instance.barcodeScanner.enableAsync(this._customViewController.onBarcodeScanned.bind(this._customViewController));
                    }
                    if (this._implementsINumPadInputSubscriberEndpoint(this._customViewController)) {
                        Commerce.Peripherals.instance.numPad.enable(this.numPadInputBroker);
                    }
                    this._customViewController.onShown();
                }
                else {
                    Commerce.NotificationHandler.displayClientErrors([new Commerce.Proxy.Entities.Error("string_29982"), this._createViewControllerException]);
                }
            };
            CustomViewControllerAdapter.prototype.onHidden = function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._customViewController)) {
                    this._customViewController.onHidden();
                    if (this._implementsIMagneticStripeReaderEndpoint(this._customViewController)) {
                        Commerce.Peripherals.instance.magneticStripeReader.disableAsync();
                    }
                    if (this._implementsIBarcodeScannerEndpoint(this._customViewController)) {
                        Commerce.Peripherals.instance.barcodeScanner.disableAsync();
                    }
                    if (this._implementsINumPadInputSubscriberEndpoint(this._customViewController)) {
                        Commerce.Peripherals.instance.numPad.disable();
                    }
                }
                _super.prototype.onHidden.call(this);
            };
            CustomViewControllerAdapter.prototype._implementsIMagneticStripeReaderEndpoint = function (customViewController) {
                return customViewController.implementsIMagneticStripeReaderEndpoint;
            };
            CustomViewControllerAdapter.prototype._implementsIBarcodeScannerEndpoint = function (customViewController) {
                return customViewController.implementsIBarcodeScannerEndpoint;
            };
            CustomViewControllerAdapter.prototype._implementsINumPadInputSubscriberEndpoint = function (customViewController) {
                return customViewController.implementsINumPadInputSubscriberEndpoint;
            };
            CustomViewControllerAdapter.CUSTOM_VIEW_CONTROLLER_ROOT_CLASS_NAME = "customViewControllerRoot";
            return CustomViewControllerAdapter;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CustomViewControllerAdapter = CustomViewControllerAdapter;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Views;
    (function (Views) {
        "use strict";
    })(Views = Commerce.Views || (Commerce.Views = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var AffiliationsViewController = (function (_super) {
            __extends(AffiliationsViewController, _super);
            function AffiliationsViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_5201") }) || this;
                _this.viewModel = new Commerce.ViewModels.AffiliationsViewModel(_this.createViewModelContext());
                return _this;
            }
            AffiliationsViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            return AffiliationsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.AffiliationsViewController = AffiliationsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CartViewController = (function (_super) {
            __extends(CartViewController, _super);
            function CartViewController(context, options) {
                var _this = this;
                var transactionScreenLayoutPortrait = Commerce.ApplicationContext.Instance.tillLayoutProxy.getTransactionScreenLayout(Commerce.Proxy.Entities.Orientation.PORTRAIT);
                var showContentPortrait = !Commerce.ObjectExtensions.isNullOrUndefined(transactionScreenLayoutPortrait) &&
                    transactionScreenLayoutPortrait.IsBrowseBarAlwaysVisible;
                var transactionScreenLayoutLandscape = Commerce.ApplicationContext.Instance.tillLayoutProxy.getTransactionScreenLayout(Commerce.Proxy.Entities.Orientation.LANDSCAPE);
                var showContentLandscape = !Commerce.ObjectExtensions.isNullOrUndefined(transactionScreenLayoutLandscape) &&
                    transactionScreenLayoutLandscape.IsBrowseBarAlwaysVisible;
                _this = _super.call(this, context, {
                    title: Commerce.StringExtensions.EMPTY, sideBar: {
                        showContentLandscape: showContentLandscape, showContentPortrait: showContentPortrait
                    }
                }) || this;
                var detailViewMode = Commerce.ViewModels.CartViewTransactionDetailViewMode.items;
                _this._setOptions = function (options) {
                    _this._options = options = options || {};
                    if (!_this.navigationSource) {
                        _this.navigationSource = ko.observable("");
                    }
                    _this.navigationSource(options.navigationSource || "");
                    if (!Commerce.StringExtensions.isNullOrWhitespace(options.transactionDetailViewMode)) {
                        detailViewMode = options.transactionDetailViewMode;
                    }
                };
                _this._setOptions(options);
                var addSessionCartStateUpdateHandler = function (updateCartStateHandler) {
                    Commerce.Session.instance.addCartStateUpdateHandler(_this._element, updateCartStateHandler);
                };
                addSessionCartStateUpdateHandler = addSessionCartStateUpdateHandler.bind(_this);
                var removeSessionCartStateUpdateHandler = function (updateCartStateHandler) {
                    Commerce.Session.instance.removeCartStateUpdateHandler(_this._element, updateCartStateHandler);
                };
                removeSessionCartStateUpdateHandler = removeSessionCartStateUpdateHandler.bind(_this);
                var cartViewModelOptions = {
                    selectLoyaltyCardHandler: _this.selectCustomerLoyaltyCardAndAddToCartAsync.bind(_this),
                    onAddressEditClicked: function (address) {
                        var saveAddressSelectionHandler = new Commerce.CancelableSelectionHandler(function (selection) {
                            Commerce.ViewModelAdapter.navigate(CartViewController._cartViewName);
                        }, function () { return (void 0); });
                        var addressAddEditOptions = {
                            customer: Commerce.Session.instance.customerContext.customer,
                            address: address,
                            saveAddressSelectionHandler: saveAddressSelectionHandler
                        };
                        Commerce.ViewModelAdapter.navigate("AddressAddEditView", addressAddEditOptions);
                    },
                    addSessionCartStateUpdateHandler: addSessionCartStateUpdateHandler,
                    removeSessionCartStateUpdateHandler: removeSessionCartStateUpdateHandler
                };
                _this.viewModel = new Commerce.ViewModels.CartViewModel(_this.createViewModelContext(), cartViewModelOptions);
                _this.viewModel.viewMode(detailViewMode);
                _this.buildGridTemplates();
                _this.implementsIPreventInteractionViewController = true;
                _this.preventInteraction = ko.observable(_this.viewModel.isProcessTextRunning());
                _this._isProcessTextRunningSubscription = _this.viewModel.isProcessTextRunning.subscribe(function (newIsProcessTextRunning) {
                    _this.preventInteraction(newIsProcessTextRunning);
                });
                _this.customerDetailsVisible = ko.computed(function () { return !Commerce.StringExtensions.isNullOrWhitespace(_this.viewModel.cart().CustomerId); }, _this);
                _this.searchText = ko.observable("");
                _this.printerEnabled = ko.observable(false);
                _this.isBackNavigationEnabled = false;
                _this.isAdditionalInfoVisible = ko.observable(true);
                _this.showLinesGridColumnHeaders = ko.observable(true);
                _this.showPaymentGridColumnHeaders = ko.observable(true);
                _this.showDeliveryGridColumnHeaders = ko.observable(true);
                _this.discountLabelResourceId = ko.computed(_this._getDiscountLabelResourceId, _this);
                _this.showDeliveryUI = ko.computed(_this.isDeliveryUIVisible, _this);
                _this.showDeliveryUI.subscribe(function (isVisible) {
                    if (!isVisible) {
                        _this._transactionGridListViewViewModelsHelper.releaseDeliveryListViewViewModel();
                    }
                });
                _this.viewModel.selectedCartLines.subscribe(function (newSelectedCartLines) {
                    if (Commerce.ArrayExtensions.hasElements(newSelectedCartLines)) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(_this._transactionGridListViewViewModelsHelper.getLineItemListViewViewModel())) {
                            _this._transactionGridListViewViewModelsHelper.getLineItemListViewViewModel().selectItems(newSelectedCartLines);
                        }
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(_this._transactionGridListViewViewModelsHelper.getDeliveryListViewViewModel())) {
                            _this._transactionGridListViewViewModelsHelper.getDeliveryListViewViewModel().selectItems(newSelectedCartLines);
                        }
                    }
                    else {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(_this._transactionGridListViewViewModelsHelper.getLineItemListViewViewModel())) {
                            _this._transactionGridListViewViewModelsHelper.getLineItemListViewViewModel().unselectAllItems();
                        }
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(_this._transactionGridListViewViewModelsHelper.getDeliveryListViewViewModel())) {
                            _this._transactionGridListViewViewModelsHelper.getDeliveryListViewViewModel().unselectAllItems();
                        }
                    }
                });
                _this._transactionGridListViewViewModelsHelper = new TransactionGridListViewViewModelsHelper();
                _this._tabIndexController = new Commerce.TabIndexController();
                _this.layoutTabControlMessageHandler = new Commerce.EventManager();
                _this._layoutTabControlTabChangedHandler = function (contentElementId) {
                    if (contentElementId === "AvailablePromotions") {
                    }
                    else {
                    }
                };
                _this._layoutTabControlTabChangedHandler = _this._layoutTabControlTabChangedHandler.bind(_this);
                _this.layoutTabControlMessageHandler.addEventListener("TabChangedContentId", _this._layoutTabControlTabChangedHandler);
                _this.title(_this._getCartTypeHeader(_this.viewModel.cart()));
                _this._cartSubscription = _this.viewModel.cart.subscribe(function (newCart) {
                    _this.title(_this._getCartTypeHeader(newCart));
                });
                return _this;
            }
            CartViewController.prototype.dispose = function () {
                this._cartSubscription.dispose();
                this._isProcessTextRunningSubscription.dispose();
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.layoutTabControlMessageHandler)) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(this._layoutTabControlTabChangedHandler)) {
                        this.layoutTabControlMessageHandler.removeEventListener("TabChangedContentId", this._layoutTabControlTabChangedHandler);
                        this._layoutTabControlTabChangedHandler = null;
                    }
                }
                _super.prototype.dispose.call(this);
            };
            Object.defineProperty(CartViewController.prototype, "isAlwaysExpand", {
                get: function () {
                    return Commerce.ApplicationContext.Instance.deviceConfiguration.AlwaysExpandTransactionScreenLineDetails;
                },
                enumerable: true,
                configurable: true
            });
            CartViewController.prototype.keepAliveViewActivated = function (options) {
                this._setOptions(options);
                if (Commerce.Session.instance.productCatalogStore.StoreType !== Commerce.Proxy.Entities.StoreButtonControlType.CurrentStore) {
                    var correlationId_1 = Commerce.LoggerHelper.getNewCorrelationId();
                    var setVirtualCatalogAsyncResult = this.viewModel.switchToCurrentStoreCatalog(correlationId_1);
                    this.viewModel.isBusyUntil(setVirtualCatalogAsyncResult);
                }
                if (!Commerce.StringExtensions.isNullOrWhitespace(this._options.itemToAddOrSearch) && this._options.itemToAddOrSearch !== "0") {
                    this.addOrSearchProductsAndCustomers(this._options.itemToAddOrSearch, null, Commerce.Proxy.Entities.BarcodeEntryMethodType.Selected);
                }
                this._setColumnsProperties();
                var correlationId = Commerce.LoggerHelper.getFormattedCorrelationId(options);
                this.handleNavigationFromPaymentView(correlationId);
                this._handleNavigationFromFulfillmentLineView(correlationId);
                Commerce.RetailLogger.viewModelCartViewIsVisible(correlationId);
            };
            CartViewController.prototype.load = function () {
                if (Commerce.ArrayExtensions.hasElements(this.viewModel.selectedCartLines())) {
                    this.viewModel.selectedCartLines([]);
                }
                if (Commerce.ArrayExtensions.hasElements(this.viewModel.selectedTenderLines())) {
                    this.viewModel.selectedTenderLines([]);
                }
                this.viewModel.handleVoidAsyncResult(this.viewModel.load());
            };
            CartViewController.prototype.onCreated = function (element) {
                var _this = this;
                _super.prototype.onCreated.call(this, element);
                this._setColumnsProperties();
                this.updateMaxNumberOfRecommendedProducts();
                Commerce.ApplicationContext.Instance.tillLayoutProxy.addOrientationChangedHandler(element, function (args) {
                    _this._setColumnsProperties();
                    _this.updateMaxNumberOfRecommendedProducts();
                });
            };
            CartViewController.prototype.onShown = function () {
                var _this = this;
                var $element = $(this._element);
                $element.find("#TotalsPanel").attr("aria-hidden", "false");
                this.viewModel.onShown();
                this._activeControllerForPeripheralEvents = this;
                this.viewModel.setCart(Commerce.Session.instance.cart);
                Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    if (_this._activeControllerForPeripheralEvents && _this.barcodeScannerHandler) {
                        _this.barcodeScannerHandler.call(_this._activeControllerForPeripheralEvents, barcode, Commerce.Proxy.Entities.BarcodeEntryMethodType.SingleScanned);
                    }
                });
                Commerce.Peripherals.instance.magneticStripeReader.enableAsync(function (cardInfo) {
                    if (_this._activeControllerForPeripheralEvents && _this.magneticStripeReaderHandler) {
                        _this.magneticStripeReaderHandler.call(_this._activeControllerForPeripheralEvents, cardInfo);
                    }
                }, Commerce.Peripherals.HardwareStation.LongPollingSupportedEventsSourceTypes.CART);
                this.enableNumPad();
                if (!Commerce.ArrayExtensions.hasElements(this.viewModel.selectedCartLines())) {
                    this.viewModel.selectLastCartLine();
                }
                var tabbableSectionSelectors = ["#ButtonGrid1", "#ButtonGrid2", "#ButtonGrid3",
                    "#ButtonGrid4", "#ButtonGrid5", "#ButtonGrid6", "#ButtonGrid7", "#ButtonGrid8", "#ButtonGrid9",
                    "#ButtonGrid10", "#productRecommendations", "#NumberPad", "#CustomerPanel", "#TransactionGrid .pivotHeader",
                    "#TransactionGrid .pivotContainer", "#TotalsPanel", "#TabControl", "#AttributesPanel"
                ];
                this._tabIndexController.init(".cartView", ["aria-selected", "disabled"], tabbableSectionSelectors);
            };
            CartViewController.prototype.afterBind = function () {
                this.viewModel.selectLastCartLine();
            };
            CartViewController.prototype.onHidden = function () {
                Commerce.Peripherals.instance.barcodeScanner.disableAsync();
                Commerce.Peripherals.instance.magneticStripeReader.disableAsync(Commerce.Peripherals.HardwareStation.LongPollingSupportedEventsSourceTypes.CART);
                this.disableNumPad();
                var $element = $(this._element);
                $element.find("#TotalsPanel").attr("aria-hidden", "true");
                this.viewModel.onHidden();
                this._tabIndexController.disconnect();
            };
            CartViewController.prototype.onNumPadEnterEventHandler = function (result) {
                if (!Commerce.StringExtensions.isNullOrWhitespace(result.value)) {
                    this.addOrSearchProductsAndCustomers(result.value, result.quantity, Commerce.Proxy.Entities.BarcodeEntryMethodType.ManuallyEntered);
                }
                this.searchText(Commerce.StringExtensions.EMPTY);
            };
            CartViewController.prototype.onAddCustomerClick = function (sender, eventArgs) {
                this.searchCustomers();
            };
            CartViewController.prototype.lineItemSelectionHandler = function (cartLines) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._transactionGridListViewViewModelsHelper.getLineItemListViewViewModel())
                    || Commerce.ObjectExtensions.isNullOrUndefined(this._transactionGridListViewViewModelsHelper.getDeliveryListViewViewModel())) {
                    this.viewModel.selectCartLinesIfDifferent(cartLines);
                }
                else if (!this._transactionGridListViewViewModelsHelper.getLineItemListViewViewModel().isChangingItemSelection) {
                    this.viewModel.selectCartLinesIfDifferent(cartLines);
                    this._transactionGridListViewViewModelsHelper.getDeliveryListViewViewModel().selectItems(cartLines);
                }
            };
            CartViewController.prototype.deliverySelectionHandler = function (cartLines) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._transactionGridListViewViewModelsHelper.getDeliveryListViewViewModel())
                    || Commerce.ObjectExtensions.isNullOrUndefined(this._transactionGridListViewViewModelsHelper.getLineItemListViewViewModel())) {
                    this.viewModel.selectCartLinesIfDifferent(cartLines);
                }
                else if (!this._transactionGridListViewViewModelsHelper.getDeliveryListViewViewModel().isChangingItemSelection) {
                    this.viewModel.selectCartLinesIfDifferent(cartLines);
                    this._transactionGridListViewViewModelsHelper.getLineItemListViewViewModel().selectItems(cartLines);
                }
            };
            CartViewController.prototype.tenderLinesSelectionChanged = function (tenderLines) {
                this.viewModel.selectedTenderLines(tenderLines);
            };
            CartViewController.prototype.isDeliveryRowExpandable = function (cartLine) {
                var product = Commerce.Session.instance.getFromProductsInCartCache(cartLine.ProductId);
                var isVariant = !Commerce.ObjectExtensions.isNullOrUndefined(product) && product.ProductTypeValue === Commerce.Proxy.Entities.ProductType.Variant;
                var isExpandable = isVariant ||
                    !Commerce.ObjectExtensions.isNullOrUndefined(cartLine.ShippingAddress) &&
                        (!Commerce.StringExtensions.isNullOrWhitespace(cartLine.ShippingAddress.Name) ||
                            !Commerce.StringExtensions.isNullOrWhitespace(cartLine.ShippingAddress.FullAddress));
                return isExpandable;
            };
            CartViewController.prototype.isCustomerAccountDepositGridRowExpandable = function (customerAccountDepositCartLine) {
                var isExpandable = !Commerce.ObjectExtensions.isNullOrUndefined(customerAccountDepositCartLine)
                    && (customerAccountDepositCartLine.Comment && (customerAccountDepositCartLine.Comment.length > 0));
                return isExpandable;
            };
            CartViewController.prototype.getPriceOverrideText = function (cartLine) {
                var priceOverrideText = Commerce.StringExtensions.EMPTY;
                if (cartLine && cartLine.IsPriceOverridden) {
                    var originalFormattedPriceText = Commerce.NumberExtensions.formatCurrency(cartLine.OriginalPrice);
                    priceOverrideText = Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_4368"), originalFormattedPriceText);
                }
                return priceOverrideText;
            };
            CartViewController.prototype.executeShowPaymentFlow = function () {
                var _this = this;
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                if (this.viewModel.canCheckout) {
                    this.viewModel.concludeTransaction(correlationId);
                }
                else if (this.viewModel.canAddPayment) {
                    if (Commerce.ReturnHelper.returnPolicyWouldBeApplicable(Commerce.Session.instance.cart)) {
                        var shouldUseReturnPolicy = Commerce.ReturnHelper.returnPolicyIsConfiguredAndApplicable(Commerce.Session.instance.cart);
                        this.viewModel.isBusyUntil(shouldUseReturnPolicy)
                            .done(function (result) {
                            if (result) {
                                _this._showAllowedReturnOptions(correlationId);
                            }
                            else if (_this._isPromptForLinkedRefundAllowed()) {
                                _this._showLinkedRefundDialog(correlationId);
                            }
                            else {
                                _this.showPaymentDialog(correlationId);
                            }
                        });
                    }
                    else if (this._isPromptForLinkedRefundAllowed()) {
                        this._showLinkedRefundDialog(correlationId);
                    }
                    else {
                        this.showPaymentDialog(correlationId);
                    }
                }
            };
            CartViewController.prototype.browseProducts = function () {
                Commerce.ViewModelAdapter.navigate("CategoriesView");
            };
            CartViewController.prototype.selectCustomerLoyaltyCardAndAddToCartAsync = function (cartLoyaltyCardId) {
                var _this = this;
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                var activity = new Commerce.Activities.SelectCustomerLoyaltyCardActivity({
                    loyaltyCards: this.viewModel.customerLoyaltyCards(),
                    currentLoyaltyCardId: cartLoyaltyCardId
                });
                activity.responseHandler = function (response) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(response)) {
                        return Commerce.VoidAsyncResult.createResolved();
                    }
                    return _this.viewModel.addLoyaltyCardToCartAsync(correlationId, response.loyaltyCard.CardNumber);
                };
                return this.viewModel.isBusyUntil(activity.execute());
            };
            CartViewController.prototype.viewRecommendedProductDetails = function (itemInvoked) {
                var recordId = itemInvoked.data.RecordId;
                var trackingId = itemInvoked.data.TrackingId;
                Commerce.RetailLogger.viewModelCartViewRecommendedProductDetails(trackingId, recordId);
                var simpleProductDetailsViewModelOptions = {
                    productId: recordId,
                    product: undefined,
                    isSelectionMode: false,
                    addToCartOptions: {
                        trackingId: trackingId
                    },
                    correlationId: Commerce.StringExtensions.EMPTY
                };
                Commerce.ViewModelAdapter.navigate("SimpleProductDetailsView", simpleProductDetailsViewModelOptions);
            };
            CartViewController.prototype.showDeliveryGrid = function () {
                this.viewModel.viewMode(Commerce.ViewModels.CartViewTransactionDetailViewMode.delivery);
            };
            CartViewController.prototype.operationsButtonGridClick = function (operationId, actionProperty, actionTitle) {
                if (Commerce.Session.instance.connectionStatus !== Commerce.Client.Entities.ConnectionStatusType.Online &&
                    !Commerce.Operations.OperationsManager.instance.canExecuteInOfflineMode(operationId)) {
                    var errors = [new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.OPERATION_NOT_ALLOWED_IN_OFFLINE_STATE)];
                    Commerce.NotificationHandler.displayClientErrors(errors);
                    return true;
                }
                if (this.viewModel.isProcessTextRunning() &&
                    Commerce.Operations.RetailOperation.ItemSale !== operationId) {
                    return true;
                }
                var CORRELATION_ID = Commerce.LoggerHelper.getNewCorrelationId();
                Commerce.RetailLogger.viewsCartButtonGridOperationExecutionStarted(CORRELATION_ID, operationId.toString(), actionProperty || Commerce.StringExtensions.EMPTY);
                switch (operationId) {
                    case Commerce.Operations.RetailOperation.DiscountCodeBarcode:
                        this.addDiscountCode();
                        return true;
                    case Commerce.Operations.RetailOperation.ClearQuantity:
                        this.clearQuantityOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.SetQuantity:
                        this.setQuantityOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.AddSerialNumber:
                        this.addSerialNumberOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.AddWarrantyToAnExistingTransaction:
                        this.addWarrantyToAnExistingTransaction();
                        return true;
                    case Commerce.Operations.RetailOperation.BuyWarranty:
                        this.buyWarrantyOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.ChangeUnitOfMeasure:
                        this.changeUnitOfMeasureOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.VoidItem:
                        this.voidProducts();
                        return true;
                    case Commerce.Operations.RetailOperation.VoidPayment:
                        this.voidPayment(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.ReturnItem:
                        this.returnProductOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.TransactionComment:
                        this.transactionComment(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.ItemComment:
                        this.lineComment();
                        return true;
                    case Commerce.Operations.RetailOperation.LoyaltyRequest:
                        this.addLoyaltyCardOperation(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.IssueCreditMemo:
                        this.viewModel.issueCreditMemo(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.LoyaltyIssueCard:
                        var issueLoyaltyCardOperationOptions = {
                            customer: this.viewModel.customer(),
                            correlationId: CORRELATION_ID,
                            allowSwitchCustomer: true,
                            allowAddToTransaction: true
                        };
                        var operationResult = Commerce.Operations.OperationsManager.instance.runOperation(operationId, issueLoyaltyCardOperationOptions);
                        this.handleAsyncResult(operationResult);
                        return true;
                    case Commerce.Operations.RetailOperation.IssueGiftCertificate:
                        this.viewModel.issueGiftCardOperationAsync(actionProperty);
                        return true;
                    case Commerce.Operations.RetailOperation.AddToGiftCard:
                        this.viewModel.addToGiftCardOperationAsync(actionProperty);
                        return true;
                    case Commerce.Operations.RetailOperation.GiftCardBalance:
                        this.viewModel.checkGiftCardBalanceOperationAsync(actionProperty);
                        return true;
                    case Commerce.Operations.RetailOperation.LoyaltyCardPointsBalance:
                        this.handleAsyncResult(this.viewModel.displayLoyaltyCardBalance(CORRELATION_ID));
                        return true;
                    case Commerce.Operations.RetailOperation.VoidTransaction:
                        this.voidTransaction();
                        return true;
                    case Commerce.Operations.RetailOperation.InvoiceComment:
                        this.invoiceComment();
                        return true;
                    case Commerce.Operations.RetailOperation.OverrideTaxTransaction:
                        this.transactionTaxOverride(actionProperty);
                        return true;
                    case Commerce.Operations.RetailOperation.OverrideTaxTransactionList:
                        this.transactionTaxOverrideFromList();
                        return true;
                    case Commerce.Operations.RetailOperation.OverrideTaxLine:
                        this.lineTaxOverride(actionProperty, CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.OverrideTaxLineList:
                        this.lineTaxOverrideFromList(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.SuspendTransaction:
                        this.suspendTransaction();
                        return true;
                    case Commerce.Operations.RetailOperation.SalesInvoice:
                        this.salesInvoiceOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.PriceCheck:
                        this.viewModel.priceCheckAsync(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.CreateCustomerOrder:
                        this.createCustomerOrderClickHandler();
                        return true;
                    case Commerce.Operations.RetailOperation.CreateQuotation:
                        this.createQuotationClickHandler(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.SetQuotationExpirationDate:
                        this.setQuotationExpirationDateClickHandler(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.CalculateFullDiscounts:
                        this.calculateTotalAsync(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.RecalculateCustomerOrder:
                        this.recalculateOrder(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.RecalculateCharges:
                        this.recalculateCharges(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.SalesPerson:
                        this.changeSalesPerson(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.ShipSelectedProducts:
                        this.shipSelected(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.ShipAllProducts:
                        this.shipAll(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.PickupSelectedProducts:
                        this.pickUpSelected(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.PickupAllProducts:
                        this.pickUpAll(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.CarryoutAllProducts:
                        this.carryOutAll(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.CarryoutSelectedProducts:
                        this.carryOutSelected(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.PaymentsHistory:
                        this.paymentsHistoryHandler();
                        return true;
                    case Commerce.Operations.RetailOperation.CreateRetailTransaction:
                        this.createRetailTransactionClickHandler();
                        return true;
                    case Commerce.Operations.RetailOperation.CustomerClear:
                        this.removeCustomer();
                        return true;
                    case Commerce.Operations.RetailOperation.DepositOverride:
                        this.depositOverride(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.PayCashQuick:
                        this._payCashQuickAsync(Commerce.ApplicationContext.Instance.tenderTypesMap.getTenderByTypeId(actionProperty));
                        return true;
                    case Commerce.Operations.RetailOperation.PayGiftCertificate:
                    case Commerce.Operations.RetailOperation.PayCash:
                    case Commerce.Operations.RetailOperation.PayCheck:
                    case Commerce.Operations.RetailOperation.PayCurrency:
                    case Commerce.Operations.RetailOperation.PayCustomerAccount:
                    case Commerce.Operations.RetailOperation.PayLoyalty:
                    case Commerce.Operations.RetailOperation.PayCreditMemo:
                        this.executePaymentFlow(operationId, Commerce.ApplicationContext.Instance.tenderTypesMap.getTenderByTypeId(actionProperty), CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.PayCard:
                        this.payCard(CORRELATION_ID, Commerce.ApplicationContext.Instance.tenderTypesMap.getTenderByTypeId(actionProperty));
                        return true;
                    case Commerce.Operations.RetailOperation.TotalDiscountAmount:
                        {
                            var discountValue = Commerce.NumberExtensions.parseNumber(actionProperty);
                            discountValue = isNaN(discountValue) ? undefined : discountValue;
                            this.addTotalDiscountAmount(discountValue);
                        }
                        return true;
                    case Commerce.Operations.RetailOperation.TotalDiscountPercent:
                        {
                            var discountValue = parseFloat(actionProperty);
                            discountValue = isNaN(discountValue) ? undefined : discountValue;
                            this.addTotalDiscountPercent(discountValue);
                        }
                        return true;
                    case Commerce.Operations.RetailOperation.LineDiscountAmount:
                        {
                            var discountValue = Commerce.NumberExtensions.parseNumber(actionProperty);
                            discountValue = isNaN(discountValue) ? undefined : discountValue;
                            this.addLineDiscountAmount(discountValue);
                        }
                        return true;
                    case Commerce.Operations.RetailOperation.LineDiscountPercent:
                        {
                            var discountValue = parseFloat(actionProperty);
                            discountValue = isNaN(discountValue) ? undefined : discountValue;
                            this.addLineDiscountPercent(discountValue);
                        }
                        return true;
                    case Commerce.Operations.RetailOperation.PriceOverride:
                        this.priceOverrideOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.CustomerSearch:
                        this.searchCustomers();
                        return true;
                    case Commerce.Operations.RetailOperation.TimeRegistration:
                        Commerce.Operations.OperationsManager.instance.runOperation(operationId, this);
                        return true;
                    case Commerce.Operations.RetailOperation.ItemSale:
                        this.addOrSearchProductsAndCustomers(actionProperty, null, Commerce.Proxy.Entities.BarcodeEntryMethodType.Selected);
                        return true;
                    case Commerce.Operations.RetailOperation.AddAffiliation:
                        if (!Commerce.StringExtensions.isNullOrWhitespace(actionProperty)) {
                            var affiliationNames = actionProperty.split(";");
                            var options = { affiliationNames: affiliationNames, affiliations: [] };
                            var operationResult_1 = Commerce.Operations.OperationsManager.instance.runOperation(operationId, options);
                            this.handleAsyncResult(operationResult_1);
                        }
                        return true;
                    case Commerce.Operations.RetailOperation.CustomerEdit:
                        if (this.isCustomerAddedToSale()) {
                            Commerce.Operations.OperationsManager.instance.runOperation(operationId, {
                                customer: new Commerce.Proxy.Entities.CustomerClass({ AccountNumber: this.viewModel.customer().AccountNumber })
                            });
                        }
                        else {
                            Commerce.NotificationHandler.displayErrorMessage("string_4371");
                        }
                        return true;
                    case Commerce.Operations.RetailOperation.CustomerAccountDeposit:
                        this.customerAccountDeposit(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.PackSlip:
                    case Commerce.Operations.RetailOperation.EditCustomerOrder:
                    case Commerce.Operations.RetailOperation.EditQuotation:
                        this.redirectOperationProcessing();
                        return true;
                    case Commerce.Operations.RetailOperation.ViewProductDetails:
                        this.viewProductDetails();
                        return true;
                    case Commerce.Operations.RetailOperation.ClearCommissionSalesGroupOnLine:
                        this._clearCommissionSalesGroupOnLineOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.ClearCommissionSalesGroupOnTransaction:
                        this._clearCommissionSalesGroupOnTransactionOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.SetCommissionSalesGroupOnLine:
                        this._setCommissionSalesGroupOnLineOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.SetCommissionSalesGroupOnTransaction:
                        this._setCommissionSalesGroupOnTransactionOperation();
                        return true;
                    case Commerce.Operations.RetailOperation.AddCoupons:
                        this._addCoupons(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.RemoveCoupons:
                        this._removeCoupons();
                        return true;
                    case Commerce.Operations.RetailOperation.ViewAvailableDiscounts:
                        this._availableDiscounts();
                        return true;
                    case Commerce.Operations.RetailOperation.AddLineCharge:
                        this.addLineChargeClickHandler(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.AddHeaderCharge:
                        this.addHeaderChargeClickHandler(CORRELATION_ID);
                        return true;
                    case Commerce.Operations.RetailOperation.ConcludeTransaction:
                        this.executeShowPaymentFlow();
                        return true;
                    default:
                        return Commerce.Operations.DefaultButtonGridHandler.handleOperation(operationId, actionProperty, actionTitle, CORRELATION_ID, this.viewModel.setIsBusy.bind(this.viewModel));
                }
            };
            CartViewController.prototype.showOrderHeaderAttributes = function () {
                var _this = this;
                return this.viewModel.isBusyUntil(Commerce.ApplicationContext.Instance.salesOrderHeaderAttributeGroupDetailsAsync.value
                    .done(function (attributeGroupDetails) {
                    _this._showOrderAttributes(Commerce.ViewModelAdapter.getResourceString("string_4482"), attributeGroupDetails, function (cart) { return Commerce.ObjectExtensions.isNullOrUndefined(cart) ? [] : cart.AttributeValues; }, function (attributeValues) {
                        return new Commerce.SaveAttributesOnCartClientRequest(attributeValues, Commerce.LoggerHelper.getNewCorrelationId());
                    });
                }));
            };
            CartViewController.prototype.showOrderLineAttributes = function () {
                var _this = this;
                return this.viewModel.isBusyUntil(Commerce.ApplicationContext.Instance.salesOrderLinesAttributeGroupDetailsAsync.value
                    .done(function (attributeGroupDetails) {
                    _this._showOrderAttributes(Commerce.ViewModelAdapter.getResourceString("string_4483"), attributeGroupDetails, function (cart) {
                        var selectedCartLine = null;
                        var selectedCartLines = _this.viewModel.selectedCartLines();
                        if (Commerce.ArrayExtensions.hasElements(cart.CartLines) &&
                            Commerce.ArrayExtensions.hasElements(selectedCartLines) &&
                            !Commerce.ObjectExtensions.isNullOrUndefined(selectedCartLines[0])) {
                            selectedCartLine = Commerce.ArrayExtensions.firstOrUndefined(cart.CartLines, function (cartLine) {
                                return cartLine.LineId === selectedCartLines[0].LineId;
                            });
                        }
                        return Commerce.ObjectExtensions.isNullOrUndefined(selectedCartLine) ? [] : selectedCartLine.AttributeValues;
                    }, function (attributeValues) {
                        var selectedCartLines = _this.viewModel.selectedCartLines();
                        var cartLineId = Commerce.ArrayExtensions.hasElements(selectedCartLines) && !Commerce.ObjectExtensions.isNullOrUndefined(selectedCartLines[0])
                            ? selectedCartLines[0].LineId
                            : Commerce.StringExtensions.EMPTY;
                        if (Commerce.StringExtensions.isNullOrWhitespace(cartLineId)) {
                            return new Commerce.SaveAttributesOnCartLinesClientRequest([], Commerce.LoggerHelper.getNewCorrelationId());
                        }
                        var attributesOnCartLine = {
                            cartLineId: cartLineId,
                            attributes: attributeValues
                        };
                        return new Commerce.SaveAttributesOnCartLinesClientRequest([attributesOnCartLine], Commerce.LoggerHelper.getNewCorrelationId());
                    });
                }));
            };
            CartViewController.prototype._showOrderAttributes = function (title, attributeGroupDetails, getAttributeValues, getSaveAttributesRequest) {
                var showSalesOrderAttributeGroupsDialog = new Commerce.Controls.ShowSalesOrderAttributeGroupsDialog();
                var showSalesOrderAttributeGroupsDialogOptions = {
                    title: title,
                    attributeGroups: attributeGroupDetails,
                    attributeValues: getAttributeValues(this.viewModel.cart()),
                    onEditAsync: function (attributeValues) {
                        var request = getSaveAttributesRequest(attributeValues);
                        return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request))
                            .map(function (result) {
                            return result.canceled ? [] : getAttributeValues(result.data.result);
                        }).fail(function (errors) {
                            Commerce.NotificationHandler.displayClientErrors(errors);
                        });
                    }
                };
                showSalesOrderAttributeGroupsDialog.show(showSalesOrderAttributeGroupsDialogOptions);
            };
            CartViewController.prototype.paymentSelected = function (tenderType, correlationId, promptForLinkedRefund, maxRefundAmount, promptAgain) {
                var _this = this;
                if (promptAgain === void 0) { promptAgain = false; }
                if (Commerce.Session.instance.connectionStatus !== Commerce.Client.Entities.ConnectionStatusType.Online &&
                    !Commerce.Operations.OperationsManager.instance.canExecuteInOfflineMode(tenderType.OperationId)) {
                    var errors = [new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.OPERATION_NOT_ALLOWED_IN_OFFLINE_STATE)];
                    Commerce.NotificationHandler.displayClientErrors(errors);
                    return;
                }
                switch (tenderType.OperationId) {
                    case Commerce.Operations.RetailOperation.PayCash:
                    case Commerce.Operations.RetailOperation.PayCheck:
                    case Commerce.Operations.RetailOperation.PayCreditMemo:
                    case Commerce.Operations.RetailOperation.PayCurrency:
                    case Commerce.Operations.RetailOperation.PayCustomerAccount:
                    case Commerce.Operations.RetailOperation.PayGiftCertificate:
                    case Commerce.Operations.RetailOperation.PayLoyalty:
                        this.executePaymentFlow(tenderType.OperationId, tenderType, undefined, undefined, undefined, maxRefundAmount, promptAgain);
                        break;
                    case Commerce.Operations.RetailOperation.PayCard:
                        this.payCard(correlationId, tenderType, promptForLinkedRefund, null, promptAgain);
                        break;
                    default:
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(Commerce.Extensibility.ExtensionOperationProvider)
                            && Commerce.Extensibility.ExtensionOperationProvider.operationRequestExists(tenderType.OperationId)) {
                            Commerce.Extensibility.ExtensionOperationProvider.getOperationRequest(tenderType.OperationId, [], correlationId)
                                .then(function (result) {
                                var request = result.data;
                                if (!result.canceled && !Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                                    Commerce.Runtime.executeAsync(request).then(function (result) {
                                        _this.paymentSuccessCallback(request.correlationId, !result.canceled, promptAgain);
                                    }).catch(function (errors) {
                                        _this.viewModel.setIsBusy(false);
                                        Commerce.NotificationHandler.displayClientErrors(errors);
                                    });
                                }
                            });
                        }
                        else {
                            Commerce.NotificationHandler.displayErrorMessage("string_1133", tenderType.Name);
                        }
                        break;
                }
            };
            CartViewController.prototype._setColumnsProperties = function () {
                var layout = Commerce.ApplicationContext.Instance.tillLayoutProxy.getLayoutItem("transactionScreenLayout", "TransactionGrid");
                if (!Commerce.ObjectExtensions.isNullOrUndefined(layout)) {
                    this.isAdditionalInfoVisible(layout.ShowLineFieldLabels);
                    this.showLinesGridColumnHeaders(Commerce.ObjectExtensions.isNullOrUndefined(layout.ShowLineColumnHeaderLabels) ? true : layout.ShowLineColumnHeaderLabels);
                    this.showPaymentGridColumnHeaders(Commerce.ObjectExtensions.isNullOrUndefined(layout.ShowPaymentColumnHeaderLabels) ? true : layout.ShowPaymentColumnHeaderLabels);
                    this.showDeliveryGridColumnHeaders(Commerce.ObjectExtensions.isNullOrUndefined(layout.ShowDeliveryColumnHeaderLabels) ? true : layout.ShowDeliveryColumnHeaderLabels);
                }
            };
            CartViewController.prototype.isCustomerAddedToSale = function () {
                var customer = this.viewModel.customer();
                if (Commerce.ObjectExtensions.isNullOrUndefined(customer)) {
                    return false;
                }
                return !Commerce.StringExtensions.isNullOrWhitespace(customer.AccountNumber);
            };
            CartViewController.prototype.isDeliveryUIVisible = function () {
                if (Commerce.ApplicationContext.Instance.deviceConfiguration.SalesModeDefaultsAsCustomerOrder === true) {
                    return true;
                }
                return Commerce.CustomerOrderHelper.isCustomerOrderOrQuoteCreationOrEdition(this.viewModel.cart());
            };
            CartViewController.prototype._getDiscountLabelResourceId = function () {
                var isEstimatedDiscount;
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.viewModel.cart().IsDiscountFullyCalculated)) {
                    isEstimatedDiscount = Commerce.ApplicationContext.Instance.deviceConfiguration.ManuallyCalculateComplexDiscounts;
                }
                else {
                    isEstimatedDiscount = !this.viewModel.cart().IsDiscountFullyCalculated;
                }
                if (isEstimatedDiscount) {
                    return "string_4375";
                }
                else {
                    return "string_118";
                }
            };
            CartViewController.prototype._getCartTypeHeader = function (cart) {
                return Commerce.Formatters.CartTypeName(cart);
            };
            CartViewController.prototype._handleNavigationFromFulfillmentLineView = function (correlationId) {
                if (this.navigationSource() === "FulfillmentLineView") {
                    if (Commerce.CustomerOrderHelper.shouldWarnForDepositOverrideActionOnPickup(Commerce.Session.instance.cart)) {
                        var result = new Commerce.VoidAsyncResult();
                        var displayMessageResult = Commerce.ViewModelAdapter.displayMessage(Commerce.ErrorTypeEnum.CUSTOMERORDER_MANUAL_DEPOSIT_REQUIRED, Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default)
                            .always(function () {
                            var depositOverrideOperationRequest = new Commerce.DepositOverrideOperationRequest(correlationId);
                            Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(depositOverrideOperationRequest));
                        });
                        result.resolveOrRejectOn(displayMessageResult);
                    }
                }
            };
            CartViewController.prototype.handleNavigationFromPaymentView = function (correlationId) {
                if (this.navigationSource() === "PaymentView") {
                    this.paymentSuccessCallback(correlationId);
                }
            };
            CartViewController.prototype._isPromptForLinkedRefundAllowed = function () {
                var linkedRefundTenderLines;
                var cardNotPresentProcessingConfiguration = Commerce.ApplicationContext.Instance.deviceConfiguration.CardNotPresentProcessingConfigurationValue;
                if (Commerce.ArrayExtensions.hasElements(Commerce.Session.instance.cart.RefundableTenderLines)) {
                    linkedRefundTenderLines = Commerce.Session.instance.cart.RefundableTenderLines.filter(function (tenderLine) {
                        return (tenderLine.RefundableAmount > 0 && !Commerce.StringExtensions.isNullOrWhitespace(tenderLine.CaptureToken));
                    });
                }
                return Commerce.ApplicationContext.Instance.channelConfiguration.EnableOmniChannelPayments
                    && Commerce.ArrayExtensions.hasElements(linkedRefundTenderLines)
                    && (Commerce.Peripherals.HardwareStation.HardwareStationContext.instance.isActive()
                        || cardNotPresentProcessingConfiguration === Commerce.Proxy.Entities.CardNotPresentProcessingConfiguration.UseCommerceEngine)
                    && (Commerce.Session.instance.cart.AmountDue < 0);
            };
            CartViewController.prototype._showLinkedRefundDialog = function (correlationId) {
                var _this = this;
                var request = new Commerce.Payments.SelectLinkedRefundClientRequest(correlationId);
                var asyncResult = Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request)).fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
                this.viewModel.isBusyUntil(asyncResult)
                    .map(function (response) {
                    return {
                        canceled: response.canceled,
                        data: response.canceled ? null : response.data.result
                    };
                }).done(function (result) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                        _this.payCard(correlationId, null, false, result.data);
                    }
                    else if (!result.canceled) {
                        _this.showPaymentDialog(correlationId, null, false);
                    }
                });
            };
            CartViewController.prototype.showPaymentDialog = function (correlationId, showOnlyReturnWithoutReceiptTenders, promptForLinkedRefund) {
                var _this = this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(promptForLinkedRefund)) {
                    promptForLinkedRefund = this._isPromptForLinkedRefundAllowed();
                }
                var request = new Commerce.Payments.SelectTransactionPaymentMethodClientRequest(correlationId, showOnlyReturnWithoutReceiptTenders);
                var asyncResult = Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request))
                    .done(function (result) {
                    if (result.canceled) {
                        return;
                    }
                    _this.paymentSelected(result.data.result, correlationId, promptForLinkedRefund);
                }).fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
                this.viewModel.isBusyUntil(asyncResult);
            };
            CartViewController.prototype.executePaymentFlow = function (operationId, tenderType, correlationId, promptForLinkedRefund, linkedRefundTenderLine, maxRefundAmount, promptAgain) {
                if (promptAgain === void 0) { promptAgain = false; }
                correlationId = Commerce.LoggerHelper.resolveCorrelationId(correlationId);
                if (this.viewModel.isProcessTextRunning()) {
                    return;
                }
                if (this.viewModel.canCheckout) {
                    this.viewModel.concludeTransaction(correlationId);
                }
                else if (this.viewModel.canAddPayment) {
                    this.executePaymentOperation(correlationId, operationId, tenderType, promptForLinkedRefund, linkedRefundTenderLine, maxRefundAmount, promptAgain);
                }
            };
            CartViewController.prototype._showAllowedReturnOptions = function (correlationId) {
                var _this = this;
                var showReturnOptionsRequest = new Commerce.Payments.SelectAllowedRefundOptionClientRequest(correlationId);
                var asyncResult = Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(showReturnOptionsRequest))
                    .fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
                this.viewModel.isBusyUntil(asyncResult)
                    .map(function (response) {
                    return {
                        canceled: response.canceled,
                        data: response.canceled ? null : response.data.result
                    };
                }).done(function (result) {
                    if (!result.canceled && !Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                        if (result.data.bypassPolicy) {
                            _this.showPaymentDialog(correlationId);
                        }
                        else if (!Commerce.ObjectExtensions.isNullOrUndefined(result.data.linkedRefundTenderLine)) {
                            _this.payCard(correlationId, null, false, result.data.linkedRefundTenderLine, true);
                        }
                        else {
                            _this.paymentSelected(result.data.tenderType, correlationId, false, result.data.amount, true);
                        }
                    }
                });
            };
            CartViewController.prototype.executePaymentOperation = function (correlationId, operationId, tenderType, promptForLinkedRefund, linkedRefundTenderLine, maxRefundAmount, promptAgain) {
                var _this = this;
                if (promptAgain === void 0) { promptAgain = false; }
                if (tenderType == null) {
                    tenderType = Commerce.ApplicationContext.Instance.tenderTypesMap.getTenderTypeByOperationId(operationId);
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(promptForLinkedRefund)) {
                    promptForLinkedRefund = this._isPromptForLinkedRefundAllowed();
                }
                switch (operationId) {
                    case Commerce.Operations.RetailOperation.PayCashQuick:
                        {
                            this.handleAsyncResult(this.viewModel.payCashQuickAsync(tenderType))
                                .done(function (result) {
                                _this.paymentSuccessCallback(correlationId, !result.canceled, promptAgain);
                            });
                        }
                        break;
                    case Commerce.Operations.RetailOperation.PayCash:
                        this.handleAsyncResult(this.viewModel.payCashAsync(tenderType, maxRefundAmount))
                            .done(function (result) {
                            _this.paymentSuccessCallback(correlationId, !result.canceled, promptAgain);
                        });
                        break;
                    case Commerce.Operations.RetailOperation.PayCheck:
                        this.handleAsyncResult(this.viewModel.payCheckAsync(tenderType, maxRefundAmount))
                            .done(function (result) {
                            _this.paymentSuccessCallback(correlationId, !result.canceled, promptAgain);
                        });
                        break;
                    case Commerce.Operations.RetailOperation.PayCurrency:
                        this.handleAsyncResult(this.viewModel.payCurrencyAsync(tenderType, maxRefundAmount))
                            .done(function (result) {
                            _this.paymentSuccessCallback(correlationId, !result.canceled, promptAgain);
                        });
                        break;
                    case Commerce.Operations.RetailOperation.PayCustomerAccount:
                        this.handleAsyncResult(this.viewModel.payCustomerAccountAsync(tenderType, maxRefundAmount))
                            .done(function (result) {
                            _this.paymentSuccessCallback(correlationId, !result.canceled, promptAgain);
                        });
                        break;
                    case Commerce.Operations.RetailOperation.PayCreditMemo:
                        this.handleAsyncResult(this.viewModel.payCreditMemoAsync(correlationId, tenderType))
                            .done(function (result) {
                            _this.paymentSuccessCallback(correlationId, !result.canceled, promptAgain);
                        });
                        break;
                    case Commerce.Operations.RetailOperation.PayCard:
                        var payCardOperationOptions = {
                            tenderType: tenderType,
                            isTokenizePayment: false,
                            correlationId: correlationId,
                            promptForLinkedRefund: promptForLinkedRefund,
                            linkedRefundTenderLine: linkedRefundTenderLine,
                            maxRefundAmount: maxRefundAmount
                        };
                        this.handleAsyncResult(Commerce.Operations.OperationsManager.instance.runOperation(Commerce.Operations.RetailOperation.PayCard, payCardOperationOptions))
                            .done(function (result) {
                            _this.paymentSuccessCallback(correlationId, !result.canceled, promptAgain);
                        });
                        break;
                    default:
                        var paymentOperationOptions = {
                            tenderType: tenderType,
                            correlationId: correlationId,
                            maxRefundAmount: maxRefundAmount
                        };
                        Commerce.Operations.OperationsManager.instance.runOperation(operationId, paymentOperationOptions)
                            .done(function (result) {
                            _this.paymentSuccessCallback(correlationId, !result.canceled, promptAgain);
                        }).fail(function (errors) {
                            _this.viewModel.setIsBusy(false);
                            Commerce.NotificationHandler.displayClientErrors(errors);
                        });
                        break;
                }
            };
            CartViewController.prototype.payCard = function (correlationId, paymentCardTenderType, promptForLinkedRefund, linkedRefundTenderLine, promptAgain) {
                if (promptAgain === void 0) { promptAgain = false; }
                if (this.viewModel.canCheckout) {
                    this.viewModel.concludeTransaction(correlationId);
                }
                else if (this.viewModel.canAddPayment) {
                    var cardTenderType = !Commerce.ObjectExtensions.isNullOrUndefined(paymentCardTenderType) ? paymentCardTenderType :
                        Commerce.ApplicationContext.Instance.tenderTypesMap.getTenderTypeByOperationId(Commerce.Proxy.Entities.RetailOperation.PayCard);
                    if (Commerce.ObjectExtensions.isNullOrUndefined(cardTenderType)) {
                        Commerce.NotificationHandler.displayErrorMessage("string_1158");
                        return;
                    }
                    if (Commerce.ObjectExtensions.isNullOrUndefined(promptForLinkedRefund)) {
                        promptForLinkedRefund = this._isPromptForLinkedRefundAllowed();
                    }
                    this.executePaymentFlow(Commerce.Operations.RetailOperation.PayCard, cardTenderType, correlationId, promptForLinkedRefund, linkedRefundTenderLine, null, promptAgain);
                }
                else {
                    Commerce.NotificationHandler.displayErrorMessage(Commerce.ErrorTypeEnum.CANNOT_PAYMENT_TRANSACTION_COMPLETED);
                }
            };
            CartViewController.prototype._payCashQuickAsync = function (tenderType) {
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                Commerce.RetailLogger.viewsCartCartViewPayQuickCash(correlationId);
                this.executePaymentFlow(Commerce.Operations.RetailOperation.PayCashQuick, tenderType, correlationId);
            };
            CartViewController.prototype.voidTransaction = function () {
                var _this = this;
                this.viewModel.handleVoidAsyncResult(this.viewModel.voidTransaction(), false)
                    .done(function () { _this.viewModel.viewMode(Commerce.ViewModels.CartViewTransactionDetailViewMode.items); });
            };
            CartViewController.prototype.voidProducts = function () {
                this.viewModel.handleVoidAsyncResult(this.viewModel.voidProducts(this.viewModel.selectedCartLines()), false);
            };
            CartViewController.prototype.voidPayment = function (correlationId) {
                this.viewModel.handleVoidAsyncResult(this.viewModel.voidPayment(this.viewModel.selectedTenderLines(), correlationId), false);
            };
            CartViewController.prototype.transactionTaxOverrideFromList = function () {
                this.viewModel.handleVoidAsyncResult(this.viewModel.overrideTransactionTaxFromList());
            };
            CartViewController.prototype.transactionTaxOverride = function (overrideCode) {
                var taxOverride = new Commerce.Proxy.Entities.TaxOverrideClass({ Code: overrideCode });
                this.viewModel.handleVoidAsyncResult(this.viewModel.overrideTransactionTax(taxOverride));
            };
            CartViewController.prototype.lineTaxOverrideFromList = function (correlationId) {
                if (this.verifyOneItemSelected()) {
                    this.viewModel.handleVoidAsyncResult(this.viewModel.overrideLineTaxFromList(correlationId));
                }
            };
            CartViewController.prototype.lineTaxOverride = function (overrideCode, correlationId) {
                if (this.verifyOneItemSelected()) {
                    var taxOverride = new Commerce.Proxy.Entities.TaxOverrideClass({ Code: overrideCode });
                    this.viewModel.handleVoidAsyncResult(this.viewModel.overrideLineTax(taxOverride, correlationId));
                }
            };
            CartViewController.prototype.verifyOneItemSelected = function () {
                var selectedItems = this.viewModel.selectedCartLines();
                if (!Commerce.ArrayExtensions.hasElements(selectedItems)) {
                    Commerce.ViewModelAdapter.displayMessage(Commerce.ErrorTypeEnum.MISSING_CARTLINE_ON_APPLY_TAX_OVERRDE, Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default, "string_4341");
                    return false;
                }
                if (selectedItems.length > 1) {
                    Commerce.ViewModelAdapter.displayMessage(Commerce.ErrorTypeEnum.OPERATION_NOT_ALLOWED_MULTIPLE_CART_LINES, Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default);
                    return false;
                }
                return true;
            };
            CartViewController.prototype.transactionComment = function (correlationId) {
                this.handleAsyncResult(this.viewModel.addTransactionComment(correlationId));
            };
            CartViewController.prototype.lineComment = function () {
                if (Commerce.CartHelper.isCartType(Commerce.Session.instance.cart, Commerce.Proxy.Entities.CartType.AccountDeposit)) {
                    this.handleAsyncResult(this.viewModel.addCustomerAccountDepositComment());
                }
                else if (Commerce.CartHelper.isCartType(Commerce.Session.instance.cart, Commerce.Proxy.Entities.CartType.IncomeExpense)) {
                    this.handleAsyncResult(this.viewModel.addIncomeAccountComment());
                }
                else {
                    var selectedProducts = this.viewModel.selectedCartLines();
                    if (!Commerce.ArrayExtensions.hasElements(selectedProducts)) {
                        Commerce.ViewModelAdapter.displayMessage("string_4423", Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default, "string_4341");
                        return;
                    }
                    this.handleAsyncResult(this.viewModel.addProductComments());
                }
            };
            CartViewController.prototype.invoiceComment = function () {
                this.handleAsyncResult(this.viewModel.addInvoiceComment());
            };
            CartViewController.prototype.addOrSearchProductsAndCustomers = function (searchText, quantity, entryType) {
                var _this = this;
                var processTextAsyncResult = this.viewModel.processText(searchText, quantity, entryType)
                    .done(function (dataResult) {
                    if (dataResult.canceled || dataResult.data.cartUpdated) {
                        return;
                    }
                    if (_this.viewModel.isProcessTextRunning()) {
                        _this.viewModel.cancelQueuedProcessTextOperations();
                    }
                    var processTextResult = dataResult.data;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(processTextResult.product)) {
                        var simpleProductDetailsViewModelOptions = {
                            productId: processTextResult.product.RecordId,
                            product: processTextResult.product,
                            isSelectionMode: false,
                            addToCartOptions: {
                                quantity: quantity
                            },
                            correlationId: Commerce.StringExtensions.EMPTY
                        };
                        Commerce.ViewModelAdapter.navigate("SimpleProductDetailsView", simpleProductDetailsViewModelOptions);
                    }
                    else if (Commerce.ArrayExtensions.hasElements(processTextResult.productSearchResults)) {
                        var options = {
                            searchText: searchText,
                            searchEntity: Commerce.ViewModels.SearchViewSearchEntity.Product,
                            quantity: quantity,
                            selectionMode: Commerce.ViewModels.SearchViewSelectionMode.None,
                            correlationId: Commerce.StringExtensions.EMPTY
                        };
                        Commerce.ViewModelAdapter.navigate("SearchView", options);
                    }
                    else if (Commerce.ArrayExtensions.hasElements(processTextResult.customers)) {
                        _this.searchCustomers(searchText);
                    }
                    else {
                        var searchViewOptions = {
                            searchText: searchText,
                            searchEntity: Commerce.ViewModels.SearchViewSearchEntity.Product,
                            quantity: quantity,
                            selectionMode: Commerce.ViewModels.SearchViewSelectionMode.None,
                            correlationId: Commerce.StringExtensions.EMPTY
                        };
                        Commerce.ViewModelAdapter.navigate("SearchView", searchViewOptions);
                    }
                });
                processTextAsyncResult.fail(function (errors) {
                    _this.viewModel.setIsBusy(false);
                    if (_this.viewModel.textProcessingIsEnabled) {
                        Commerce.NotificationHandler.displayClientErrors(errors)
                            .always(function () {
                            _this.viewModel.textProcessingIsEnabled = true;
                            Commerce.RetailLogger.viewsCartAddOrSearchProductsAndCustomersProcessTextIsEnabledAfterErrorDialogDismissed();
                        });
                        _this.viewModel.textProcessingIsEnabled = false;
                        Commerce.RetailLogger.viewsCartAddOrSearchProductsAndCustomersProcessTextIsDisabled(Commerce.ErrorHelper.getErrorMessages(errors));
                    }
                });
            };
            CartViewController.prototype.searchCustomers = function (searchText) {
                var cart = Commerce.Session.instance.cart;
                if (cart.CartTypeValue === Commerce.Proxy.Entities.CartType.CustomerOrder
                    && !Commerce.StringExtensions.isNullOrWhitespace(cart.SalesId)) {
                    Commerce.NotificationHandler.displayErrorMessage("string_4420");
                    return Commerce.AsyncResult.createRejected();
                }
                if (Commerce.StringExtensions.isNullOrWhitespace(searchText)) {
                    searchText = this.searchText();
                }
                var options = {
                    searchText: searchText
                };
                return Commerce.Operations.OperationsManager.instance.runOperation(Commerce.Operations.RetailOperation.CustomerSearch, options);
            };
            CartViewController.prototype.changeSalesPerson = function (correlationId) {
                this.executeCustomerOrderOperation(Commerce.Operations.RetailOperation.SalesPerson, correlationId);
            };
            CartViewController.prototype.handleAsyncResult = function (asyncResult) {
                var _this = this;
                return this.viewModel.isBusyUntil(asyncResult).fail(function (errors) {
                    _this.viewModel.setIsBusy(false);
                    if (Commerce.ErrorHelper.hasError(errors, Commerce.ErrorTypeEnum.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_RETURNWITHOUTRECEIPTPAYMENT)) {
                        _this.showPaymentDialog(_this._options.correlationId, true);
                    }
                    else {
                        Commerce.NotificationHandler.displayClientErrors(errors);
                    }
                });
            };
            CartViewController.prototype.addLoyaltyCardOperation = function (correlationId) {
                this.handleAsyncResult(this.viewModel.addLoyaltyCardToCartAsync(correlationId));
            };
            CartViewController.prototype.addDiscountCode = function () {
                this.handleAsyncResult(this.viewModel.addDiscountCode());
            };
            CartViewController.prototype.addLineDiscountAmount = function (discountValue) {
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                Commerce.RetailLogger.viewsCartAddLineDiscountAmountStarted(correlationId);
                this.handleAsyncResult(this.viewModel.addLineDiscountAmount([discountValue])).done(function (result) {
                    Commerce.RetailLogger.viewsCartAddLineDiscountAmountFinishedSuccessfully(correlationId);
                }).fail(function (errors) {
                    Commerce.RetailLogger.viewsCartAddLineDiscountAmountFailed(correlationId, Commerce.ErrorHelper.getErrorMessages(errors));
                });
            };
            CartViewController.prototype.addLineDiscountPercent = function (discountValue) {
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                Commerce.RetailLogger.viewsCartAddLineDiscountPercentStarted(correlationId);
                this.handleAsyncResult(this.viewModel.addLineDiscountPercent([discountValue])).done(function (result) {
                    Commerce.RetailLogger.viewsCartAddLineDiscountPercentFinishedSuccessfully(correlationId);
                }).fail(function (errors) {
                    Commerce.RetailLogger.viewsCartAddLineDiscountPercentFailed(correlationId, Commerce.ErrorHelper.getErrorMessages(errors));
                });
            };
            CartViewController.prototype.addTotalDiscountAmount = function (discountValue) {
                this.handleAsyncResult(this.viewModel.addTransactionDiscountAmount(discountValue));
            };
            CartViewController.prototype.addTotalDiscountPercent = function (discountValue) {
                this.handleAsyncResult(this.viewModel.addTransactionDiscountPercent(discountValue));
            };
            CartViewController.prototype.priceOverrideOperation = function () {
                this.handleAsyncResult(this.viewModel.priceOverride());
            };
            CartViewController.prototype.setQuantityOperation = function () {
                this.handleAsyncResult(this.viewModel.setQuantities());
            };
            CartViewController.prototype.clearQuantityOperation = function () {
                this.handleAsyncResult(this.viewModel.clearQuantities());
            };
            CartViewController.prototype.addSerialNumberOperation = function () {
                this.handleAsyncResult(this.viewModel.addSerialNumberAsync());
            };
            CartViewController.prototype.salesInvoiceOperation = function () {
                this.handleAsyncResult(this.viewModel.salesInvoiceAsync());
            };
            CartViewController.prototype.viewProductDetails = function () {
                this.handleAsyncResult(this.viewModel.viewProductDetails());
            };
            CartViewController.prototype.addWarrantyToAnExistingTransaction = function () {
                this.handleAsyncResult(this.viewModel.addWarrantyToAnExistingTransactionAsync());
            };
            CartViewController.prototype.buyWarrantyOperation = function () {
                this.handleAsyncResult(this.viewModel.buyWarrantyAsync());
            };
            CartViewController.prototype.changeUnitOfMeasureOperation = function () {
                this.handleAsyncResult(this.viewModel.changeUnitOfMeasures());
            };
            CartViewController.prototype._clearCommissionSalesGroupOnLineOperation = function () {
                this.handleAsyncResult(this.viewModel.clearCommissionSalesGroupOnLineOperationAsync());
            };
            CartViewController.prototype._clearCommissionSalesGroupOnTransactionOperation = function () {
                this.handleAsyncResult(this.viewModel.clearCommissionSalesGroupOnTransactionOperationAsync());
            };
            CartViewController.prototype._setCommissionSalesGroupOnLineOperation = function () {
                this.handleAsyncResult(this.viewModel.setCommissionSalesGroupOnLineOperationAsync());
            };
            CartViewController.prototype._setCommissionSalesGroupOnTransactionOperation = function () {
                this.handleAsyncResult(this.viewModel.setCommissionSalesGroupOnTransactionOperationAsync());
            };
            CartViewController.prototype._addCoupons = function (correlationId) {
                this.handleAsyncResult(this.viewModel.addCouponsOperationAsync(correlationId));
            };
            CartViewController.prototype._removeCoupons = function () {
                this.handleAsyncResult(this.viewModel.removeCouponsOperationAsync());
            };
            CartViewController.prototype._availableDiscounts = function () {
                this.handleAsyncResult(this.viewModel.availableDiscountsOperationAsync());
            };
            CartViewController.prototype.returnProductOperation = function () {
                var selectedCartLines = this.viewModel.selectedCartLines();
                if (!Commerce.ArrayExtensions.hasElements(selectedCartLines)) {
                    Commerce.ViewModelAdapter.displayMessage(Commerce.ErrorTypeEnum.RETURN_NO_ITEM_SELECTED, Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default, "string_4341");
                    return;
                }
                if (selectedCartLines.length > 1) {
                    Commerce.ViewModelAdapter.displayMessage(Commerce.ErrorTypeEnum.OPERATION_NOT_ALLOWED_MULTIPLE_CART_LINES, Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default);
                    return;
                }
                this.handleAsyncResult(this.viewModel.returnCartLines());
            };
            CartViewController.prototype.showLinesGrid = function () {
                this.viewModel.viewMode(Commerce.ViewModels.CartViewTransactionDetailViewMode.items);
            };
            CartViewController.prototype.showPaymentsGrid = function () {
                this.viewModel.viewMode(Commerce.ViewModels.CartViewTransactionDetailViewMode.payments);
            };
            CartViewController.prototype.calculateTotalAsync = function (correlationId) {
                return this.viewModel.calculateTotalAsync(correlationId)
                    .fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors, "string_4374");
                });
            };
            CartViewController.prototype.recalculateOrder = function (correlationId) {
                this.executeCustomerOrderOperation(Commerce.Operations.RetailOperation.RecalculateCustomerOrder, correlationId);
            };
            CartViewController.prototype.recalculateCharges = function (correlationId) {
                this.viewModel.handleVoidAsyncResult(this.viewModel.recalculateCharges(correlationId));
            };
            CartViewController.prototype.shipAll = function (correlationId) {
                this.executeCustomerOrderOperation(Commerce.Operations.RetailOperation.ShipAllProducts, correlationId);
            };
            CartViewController.prototype.shipSelected = function (correlationId) {
                this.executeCustomerOrderOperation(Commerce.Operations.RetailOperation.ShipSelectedProducts, correlationId);
            };
            CartViewController.prototype.carryOutAll = function (correlationId) {
                this.executeCustomerOrderOperation(Commerce.Operations.RetailOperation.CarryoutAllProducts, correlationId);
            };
            CartViewController.prototype.carryOutSelected = function (correlationId) {
                this.executeCustomerOrderOperation(Commerce.Operations.RetailOperation.CarryoutSelectedProducts, correlationId);
            };
            CartViewController.prototype.pickUpAll = function (correlationId) {
                this.executeCustomerOrderOperation(Commerce.Operations.RetailOperation.PickupAllProducts, correlationId);
            };
            CartViewController.prototype.pickUpSelected = function (correlationId) {
                this.executeCustomerOrderOperation(Commerce.Operations.RetailOperation.PickupSelectedProducts, correlationId);
            };
            CartViewController.prototype.removeCustomer = function () {
                this.viewModel.handleVoidAsyncResult(this.viewModel.removeCustomerFromCart());
            };
            CartViewController.prototype.customerAccountDeposit = function (correlationId) {
                this.viewModel.handleVoidAsyncResult(this.viewModel.customerAccountDeposit(correlationId), false);
            };
            CartViewController.prototype.suspendTransaction = function () {
                this.viewModel.handleVoidAsyncResult(this.viewModel.suspendTransaction());
            };
            CartViewController.prototype.paymentSuccessCallback = function (correlationId, showPaymentGrid, promptAgain) {
                if (showPaymentGrid === void 0) { showPaymentGrid = true; }
                if (promptAgain === void 0) { promptAgain = false; }
                if (promptAgain && Commerce.ReturnHelper.returnPolicyWouldBeApplicable(Commerce.Session.instance.cart) && Commerce.Session.instance.cart.AmountDue !== 0) {
                    this.executeShowPaymentFlow();
                }
                else {
                    if (showPaymentGrid) {
                        this.showPaymentsGrid();
                    }
                    this.viewModel.setIsBusy(this.viewModel.canCheckout);
                    if (this.viewModel.canCheckout) {
                        this.viewModel.concludeTransaction(correlationId);
                    }
                }
            };
            CartViewController.prototype.createCustomerOrderClickHandler = function () {
                var _this = this;
                var cart = Commerce.Session.instance.cart;
                var queue = new Commerce.AsyncQueue();
                var proceedWithCustomerOrderCreation = false;
                if (Commerce.CustomerOrderHelper.isQuote(cart) && !Commerce.StringExtensions.isNullOrWhitespace(cart.SalesId) && Commerce.CustomerOrderHelper.isQuoteExpired(cart)) {
                    queue.enqueue(function () {
                        return Commerce.ViewModelAdapter.displayMessage("string_4311", Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default, "string_4312").done(function () {
                            proceedWithCustomerOrderCreation = true;
                        });
                    });
                }
                else {
                    proceedWithCustomerOrderCreation = true;
                }
                queue.enqueue(function () {
                    if (!proceedWithCustomerOrderCreation) {
                        queue.cancel();
                        return Commerce.AsyncResult.createResolved();
                    }
                    return _this.viewModel.createCustomerOrder();
                });
                this.handleAsyncResult(queue.run());
            };
            CartViewController.prototype.createQuotationClickHandler = function (correlationId) {
                this.viewModel.handleVoidAsyncResult(this.viewModel.createQuotationAndSetExpirationDateAsync(correlationId));
            };
            CartViewController.prototype.addLineChargeClickHandler = function (correlationId) {
                this.viewModel.handleVoidAsyncResult(this.viewModel.addLineChargeAsync(correlationId));
            };
            CartViewController.prototype.addHeaderChargeClickHandler = function (correlationId) {
                this.viewModel.handleVoidAsyncResult(this.viewModel.addHeaderChargeAsync(correlationId));
            };
            CartViewController.prototype.setQuotationExpirationDateClickHandler = function (correlationId) {
                var cart = Commerce.Session.instance.cart;
                if (cart.CartTypeValue === Commerce.Proxy.Entities.CartType.Shopping) {
                    this.createQuotationClickHandler(correlationId);
                }
                else {
                    this.viewModel.handleVoidAsyncResult(this.viewModel.setQuotationExpirationDate(correlationId));
                }
            };
            CartViewController.prototype.createRetailTransactionClickHandler = function () {
                this.handleAsyncResult(this.viewModel.createRetailTransaction());
            };
            CartViewController.prototype.paymentsHistoryHandler = function () {
                var errors = Commerce.Operations.Validators.paymentsHistoryOperationValidator(Commerce.Session.instance.cart);
                if (Commerce.ArrayExtensions.hasElements(errors)) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                }
                else {
                    Commerce.ViewModelAdapter.navigate("PaymentHistoryView");
                }
            };
            CartViewController.prototype.executeCustomerOrderOperation = function (operationEnum, correlationId) {
                var _this = this;
                var cart = Commerce.Session.instance.cart;
                var selectedCartLines = this.viewModel.selectedCartLines();
                if (Commerce.CartHelper.areAllCartLinesSelected(cart, selectedCartLines)) {
                    if (operationEnum === Commerce.Operations.RetailOperation.ShipSelectedProducts) {
                        operationEnum = Commerce.Operations.RetailOperation.ShipAllProducts;
                    }
                    else if (operationEnum === Commerce.Operations.RetailOperation.PickupSelectedProducts) {
                        operationEnum = Commerce.Operations.RetailOperation.PickupAllProducts;
                    }
                    else if (operationEnum === Commerce.Operations.RetailOperation.CarryoutSelectedProducts) {
                        operationEnum = Commerce.Operations.RetailOperation.CarryoutAllProducts;
                    }
                }
                if (operationEnum === Commerce.Operations.RetailOperation.ShipAllProducts
                    || operationEnum === Commerce.Operations.RetailOperation.PickupAllProducts
                    || operationEnum === Commerce.Operations.RetailOperation.CarryoutAllProducts) {
                    selectedCartLines = Commerce.CartHelper.getNonReturnCartLines(cart.CartLines);
                    if (!Commerce.ArrayExtensions.hasElements(selectedCartLines)) {
                        Commerce.NotificationHandler.displayErrorMessage("string_29060");
                        return;
                    }
                }
                var asyncQueue = new Commerce.AsyncQueue();
                asyncQueue.enqueue(function () {
                    var correlationId = Commerce.Utilities.GuidHelper.newGuid();
                    var checkRecoveryRequest = new Commerce.CheckForRecoveredPaymentTransactionClientRequest(correlationId, null, Commerce.Payments.TransactionReferenceAllowedActions.Read);
                    return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(checkRecoveryRequest))
                        .done(function (result) {
                        if (result.canceled || !Commerce.ObjectExtensions.isNullOrUndefined(result.data.result.foundTransaction)) {
                            Commerce.RetailLogger.posOperationCanceledDueToRecoveredPayment("executeCustomerOrder", correlationId);
                            asyncQueue.cancel();
                        }
                    });
                }).enqueue(function () {
                    var operationResult = _this.viewModel.customerOrderPreExecuteOperation(selectedCartLines, operationEnum, correlationId);
                    return asyncQueue.cancelOn(operationResult);
                }).enqueue(function () {
                    _this.viewModel.cart(Commerce.Session.instance.cart);
                    var asyncResult = Commerce.VoidAsyncResult.createResolved();
                    switch (operationEnum) {
                        case Commerce.Operations.RetailOperation.ShipAllProducts:
                        case Commerce.Operations.RetailOperation.ShipSelectedProducts:
                        case Commerce.Operations.RetailOperation.PickupAllProducts:
                        case Commerce.Operations.RetailOperation.PickupSelectedProducts:
                        case Commerce.Operations.RetailOperation.CarryoutSelectedProducts:
                        case Commerce.Operations.RetailOperation.CarryoutAllProducts:
                            if (!Commerce.ArrayExtensions.hasElements(selectedCartLines)) {
                                _this.navigateToSaleslineSelectorView(Commerce.Session.instance.cart, operationEnum);
                            }
                            else {
                                asyncResult = _this.viewModel.changeDeliveryModeForSelectedLines(selectedCartLines, operationEnum, correlationId);
                            }
                            break;
                        case Commerce.Operations.RetailOperation.RecalculateCustomerOrder:
                            asyncResult = _this.viewModel.recalculateCustomerOrder();
                            break;
                        case Commerce.Operations.RetailOperation.SalesPerson:
                            asyncResult = _this.viewModel.changeSalesPerson();
                            break;
                    }
                    return asyncResult;
                });
                this.viewModel.handleVoidAsyncResult(asyncQueue.run()).done(function () {
                    if (!_this.showDeliveryUI() && (_this.viewModel.viewMode() === Commerce.ViewModels.CartViewTransactionDetailViewMode.delivery)) {
                        _this.showLinesGrid();
                    }
                });
            };
            CartViewController.prototype.navigateToSaleslineSelectorView = function (cart, operationId) {
                Commerce.ViewModelAdapter.navigate("SaleslineSelectorView", {
                    cart: cart,
                    operationId: operationId
                });
            };
            CartViewController.prototype.barcodeScannerHandler = function (barcode, entryType) {
                this.addOrSearchProductsAndCustomers(barcode, null, entryType);
            };
            CartViewController.prototype.magneticStripeReaderHandler = function (cardInfo) {
                if (this.viewModel.canAddPayment) {
                    Commerce.NotificationHandler.displayErrorMessage("string_4388");
                }
                else {
                    Commerce.NotificationHandler.displayErrorMessage("string_4356");
                }
            };
            CartViewController.prototype.depositOverride = function (correlationId) {
                var cart = Commerce.Session.instance.cart;
                if (cart.CartTypeValue === Commerce.Proxy.Entities.CartType.CustomerOrder
                    && (cart.CustomerOrderModeValue === Commerce.Proxy.Entities.CustomerOrderMode.CustomerOrderCreateOrEdit
                        || cart.CustomerOrderModeValue === Commerce.Proxy.Entities.CustomerOrderMode.Pickup)) {
                    var errors = Commerce.Operations.Validators.containsNonReturnCartLinesOnCustomerOrder(cart);
                    if (!Commerce.ArrayExtensions.hasElements(errors)) {
                        var depositOverrideOperationRequest = new Commerce.DepositOverrideOperationRequest(correlationId);
                        Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(depositOverrideOperationRequest));
                    }
                    else {
                        Commerce.NotificationHandler.displayClientErrors(errors);
                    }
                }
                else {
                    Commerce.NotificationHandler.displayErrorMessage("string_4602");
                }
            };
            CartViewController.prototype.redirectOperationProcessing = function () {
                var _this = this;
                var dialogResult = Commerce.ViewModelAdapter.displayMessage("string_4583", Commerce.MessageType.Info, Commerce.MessageBoxButtons.YesNo, null, 0);
                dialogResult.done(function (result) {
                    if (result === Commerce.DialogResult.Yes) {
                        var options = void 0;
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(_this.viewModel.customer())
                            && !Commerce.ObjectExtensions.isNullOrUndefined(_this.viewModel.customer().AccountNumber)) {
                            var criteria = new Commerce.Proxy.Entities.OrderSearchCriteriaClass();
                            criteria.CustomerAccountNumber = _this.viewModel.customer().AccountNumber;
                            options = {
                                searchCriteria: criteria
                            };
                        }
                        Commerce.ViewModelAdapter.navigate("SearchOrdersView", options);
                    }
                });
            };
            CartViewController.prototype.updateMaxNumberOfRecommendedProducts = function () {
                var productRecommendationsGridDimensions;
                if (Commerce.ApplicationContext.Instance.tillLayoutProxy.orientation.toLowerCase() === CartViewController._landscapeOrientation.toLowerCase()) {
                    productRecommendationsGridDimensions = this.getProductRecommendationsGridDimensions(Commerce.ApplicationContext.Instance.tillLayoutProxy.transactionScreenLayout.landscape.DesignerControls);
                }
                if (Commerce.ApplicationContext.Instance.tillLayoutProxy.orientation.toLowerCase() === CartViewController._portraitOrientation.toLowerCase()) {
                    productRecommendationsGridDimensions = this.getProductRecommendationsGridDimensions(Commerce.ApplicationContext.Instance.tillLayoutProxy.transactionScreenLayout.portrait.DesignerControls);
                }
                var buttonDimension = 160;
                var numberOfColumns = Math.floor(productRecommendationsGridDimensions[1] / buttonDimension);
                var numberOfRows = Math.floor(productRecommendationsGridDimensions[0] / buttonDimension);
                var maxNumberOfRecommendedProducts = numberOfColumns * numberOfRows;
                this.viewModel.maxNumberOfRecommendedProducts(maxNumberOfRecommendedProducts);
                this.viewModel.recommendedProducts.removeAll();
                this.viewModel.updateRecommendedProducts();
            };
            CartViewController.prototype.getProductRecommendationsGridDimensions = function (designControls) {
                var height = 0;
                var width = 0;
                designControls.forEach(function (c) {
                    if (c.ID.toLowerCase() === CartViewController._productRecommendations.toLowerCase()) {
                        height = c.Height;
                        width = c.Width;
                    }
                });
                if (height === 0 && width === 0) {
                    designControls.forEach(function (c) {
                        if (c.ID.toLowerCase() === CartViewController._tabControl.toLowerCase()) {
                            c.TabPages.forEach(function (p) {
                                if (p.Content.ID.toLowerCase() === CartViewController._productRecommendations.toLowerCase()) {
                                    height = Math.min(p.Content.Height, c.Height);
                                    width = Math.min(p.Content.Width, c.Width);
                                }
                            });
                        }
                    });
                }
                return [height, width];
            };
            CartViewController.prototype.buildGridTemplates = function () {
                this.buildLineGridTemplates("cartLineGridHeaderTemplate", "cartLineGridRowTemplate", "SelectedLinesFields", CartViewController.cartLineFields, this.viewModel.lineGridViewModel);
                this.buildLineGridTemplates("cartPaymentGridHeaderTemplate", "cartPaymentGridRowTemplate", "SelectedPaymentsFields", CartViewController.paymentLineFields, this.viewModel.paymentGridViewModel);
                this.buildLineGridTemplates("cartDeliveryGridHeaderTemplate", "cartDeliveryGridRowTemplate", "SelectedDeliveryFields", CartViewController.deliveryLineFields, this.viewModel.deliveryGridViewModel);
            };
            CartViewController.prototype.buildLineGridTemplates = function (headerTemplateId, rowTemplateId, selectedFieldsPropertyName, fields, gridViewModel) {
                var customColumnsVisibilityMap = {
                    "CustomColumn1": gridViewModel.customColumnsViewModel.customColumn1.isVisible(),
                    "CustomColumn2": gridViewModel.customColumnsViewModel.customColumn2.isVisible(),
                    "CustomColumn3": gridViewModel.customColumnsViewModel.customColumn3.isVisible(),
                    "CustomColumn4": gridViewModel.customColumnsViewModel.customColumn4.isVisible(),
                    "CustomColumn5": gridViewModel.customColumnsViewModel.customColumn5.isVisible(),
                    "CustomColumn6": gridViewModel.customColumnsViewModel.customColumn6.isVisible(),
                    "CustomColumn7": gridViewModel.customColumnsViewModel.customColumn7.isVisible(),
                    "CustomColumn8": gridViewModel.customColumnsViewModel.customColumn8.isVisible(),
                    "CustomColumn9": gridViewModel.customColumnsViewModel.customColumn9.isVisible(),
                    "CustomColumn10": gridViewModel.customColumnsViewModel.customColumn10.isVisible()
                };
                var customColumnNames = Object.keys(customColumnsVisibilityMap);
                this.buildGridTemplate(headerTemplateId, fields, function (field) { return gridViewModel.screenLayout.getConfigurationProperty(selectedFieldsPropertyName, field); }, false);
                this.buildGridTemplate(headerTemplateId, customColumnNames, function (columnName) { return customColumnsVisibilityMap[columnName]; }, true);
                this.buildGridTemplate(rowTemplateId, fields, function (field) { return gridViewModel.screenLayout.getConfigurationProperty(selectedFieldsPropertyName, field); }, false);
                this.buildGridTemplate(rowTemplateId, customColumnNames, function (columnName) { return customColumnsVisibilityMap[columnName]; }, true);
            };
            CartViewController.prototype.buildGridTemplate = function (templateId, fields, includeOnTemplate, appendToTemplate) {
                var templateElement = document.getElementById(templateId);
                templateElement.innerHTML = fields.filter(includeOnTemplate).reduce(function (templateInnerHtml, field) {
                    templateInnerHtml += document.getElementById(templateId + "_" + field).innerHTML;
                    return templateInnerHtml;
                }, appendToTemplate ? templateElement.innerHTML : "");
            };
            CartViewController.cartLineFields = [
                "ProductNameField", "QuantityField", "DeliveryMethodField", "DeliveryStatusField", "BarcodeIdField", "SizeField", "ColorField", "StyleField",
                "ConfigurationField", "LinkedProductField", "OfferIdField", "OriginalPriceField", "TaxAmountField", "TaxCodeField", "TaxPercentageField",
                "TotalWithTaxField", "TotalWithoutTaxField", "UnitOfMeasureField", "ItemIdField", "SalesRepresentativeField"
            ];
            CartViewController.paymentLineFields = ["PaymentMethodField", "CurrencyField", "AmountField"];
            CartViewController.deliveryLineFields = ["ProductNameField", "DeliveryMethodField", "DeliveryStatusField"];
            CartViewController._landscapeOrientation = "Landscape";
            CartViewController._portraitOrientation = "Portrait";
            CartViewController._tabControl = "TabControl";
            CartViewController._productRecommendations = "ProductRecommendations";
            CartViewController._cartViewName = "CartView";
            return CartViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CartViewController = CartViewController;
        var TransactionGridListViewViewModelsHelper = (function () {
            function TransactionGridListViewViewModelsHelper() {
            }
            TransactionGridListViewViewModelsHelper.prototype.getLineItemListViewViewModel = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._lineItemsListViewViewModel)) {
                    this._lineItemsListViewViewModel = this.getListViewViewModel(TransactionGridListViewViewModelsHelper.LINE_ITEM_LIST_VIEW_ID);
                }
                return this._lineItemsListViewViewModel;
            };
            TransactionGridListViewViewModelsHelper.prototype.getPaymentListViewViewModel = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._paymentListViewViewModel)) {
                    this._paymentListViewViewModel = this.getListViewViewModel(TransactionGridListViewViewModelsHelper.PAYMENT_LIST_VIEW_ID);
                }
                return this._paymentListViewViewModel;
            };
            TransactionGridListViewViewModelsHelper.prototype.getDeliveryListViewViewModel = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._deliveryListViewViewModel)) {
                    this._deliveryListViewViewModel = this.getListViewViewModel(TransactionGridListViewViewModelsHelper.DELIVERY_LIST_VIEW_ID);
                }
                return this._deliveryListViewViewModel;
            };
            TransactionGridListViewViewModelsHelper.prototype.releaseDeliveryListViewViewModel = function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._deliveryListViewViewModel)) {
                    this._deliveryListViewViewModel.dispose();
                    this._deliveryListViewViewModel = null;
                }
            };
            TransactionGridListViewViewModelsHelper.prototype.clearListSelections = function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.getLineItemListViewViewModel())) {
                    this.getLineItemListViewViewModel().unselectAllItems();
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.getPaymentListViewViewModel())) {
                    this.getPaymentListViewViewModel().unselectAllItems();
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.getDeliveryListViewViewModel())) {
                    this.getDeliveryListViewViewModel().unselectAllItems();
                }
            };
            TransactionGridListViewViewModelsHelper.prototype.getListViewViewModel = function (elementId) {
                var listViewViewModel;
                var listElement = document.getElementById(elementId);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(listElement) && !Commerce.ObjectExtensions.isNullOrUndefined(listElement.listViewViewModel)) {
                    listViewViewModel = listElement.listViewViewModel;
                }
                return listViewViewModel;
            };
            TransactionGridListViewViewModelsHelper.LINE_ITEM_LIST_VIEW_ID = "lineItemListView";
            TransactionGridListViewViewModelsHelper.PAYMENT_LIST_VIEW_ID = "paymentListView";
            TransactionGridListViewViewModelsHelper.DELIVERY_LIST_VIEW_ID = "deliveryListView";
            return TransactionGridListViewViewModelsHelper;
        }());
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ResumeCartViewController = (function (_super) {
            __extends(ResumeCartViewController, _super);
            function ResumeCartViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_4156") }) || this;
                _this.viewModel = new Commerce.ViewModels.ResumeCartViewModel(_this.createViewModelContext());
                return _this;
            }
            ResumeCartViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            ResumeCartViewController.prototype.onShown = function () {
                this._enablePageEventsAsync();
            };
            ResumeCartViewController.prototype.onHidden = function () {
                this._disablePageEventsAsync();
            };
            ResumeCartViewController.prototype._enablePageEventsAsync = function () {
                var _this = this;
                return Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    _this.viewModel.recallTransactionByReceiptIdAsync(barcode);
                });
            };
            ResumeCartViewController.prototype._disablePageEventsAsync = function () {
                return Commerce.Peripherals.instance.barcodeScanner.disableAsync();
            };
            return ResumeCartViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ResumeCartViewController = ResumeCartViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ShowJournalViewController = (function (_super) {
            __extends(ShowJournalViewController, _super);
            function ShowJournalViewController(context, options) {
                var _this = _super.call(this, context, { title: ShowJournalViewController._getTitle(options.mode) }) || this;
                _this.viewModel = new Commerce.ViewModels.ShowJournalViewModel(_this.createViewModelContext(), options);
                _this.viewModel.isReceiptSelected.subscribe(function (receiptVisible) {
                    if (receiptVisible) {
                        _this.title(Commerce.ViewModelAdapter.getResourceString("string_4127"));
                    }
                    else {
                        _this.title(ShowJournalViewController._getTitle(_this.viewModel.mode));
                    }
                });
                return _this;
            }
            ShowJournalViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            ShowJournalViewController.prototype.afterBind = function (element) {
                this._showJournalElement = element;
            };
            ShowJournalViewController.prototype.journalSelectionChangedHandlerAsync = function (selectedTransactions) {
                var _this = this;
                this.viewModel.journalSelectionChangedHandlerAsync(selectedTransactions).done(function () {
                    _this.context.interaction.triggerEvent(_this._showJournalElement, "journalSelectionChanged");
                });
            };
            ShowJournalViewController._getTitle = function (mode) {
                var title;
                if (mode === Commerce.ViewModels.ShowJournalMode.ShowJournal) {
                    title = Commerce.ViewModelAdapter.getResourceString("string_2807");
                }
                else if (mode === Commerce.ViewModels.ShowJournalMode.CustomerSalesOrders) {
                    title = Commerce.ViewModelAdapter.getResourceString("string_204");
                }
                else {
                    title = Commerce.ViewModelAdapter.getResourceString("string_4428");
                }
                return title;
            };
            return ShowJournalViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ShowJournalViewController = ShowJournalViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CustomerAddEditViewController = (function (_super) {
            __extends(CustomerAddEditViewController, _super);
            function CustomerAddEditViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }, false) || this;
                _this.viewModel = new Commerce.ViewModels.CustomerAddEditViewModel(_this.createViewModelContext(), options);
                _this.viewModel.getDateTimeValueHandler = _this._getDateTimeValue.bind(_this);
                _this._tabIndexController = new Commerce.TabIndexController();
                var computedTitle = ko.computed(function () {
                    if (_this.viewModel.mode() === Commerce.ViewModels.CustomerAddEditViewModelEnum.Add) {
                        return Commerce.ViewModelAdapter.getResourceString("string_1329");
                    }
                    else {
                        return _this.viewModel.customerProxy.Name();
                    }
                }, _this);
                _this.title(computedTitle());
                _this._computedTitleSubscription = computedTitle.subscribe(function (newComputedTitle) {
                    _this.title(newComputedTitle);
                });
                return _this;
            }
            CustomerAddEditViewController.prototype.dispose = function () {
                this._computedTitleSubscription.dispose();
                _super.prototype.dispose.call(this);
            };
            CustomerAddEditViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            CustomerAddEditViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            CustomerAddEditViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
                this._tabIndexController.disconnect();
            };
            CustomerAddEditViewController.prototype.load = function () {
                var _this = this;
                this.viewModel.loadAsync().done(function () {
                    _this._tabIndexController.init(".customerAddEditView", ["aria-selected", "disabled"], [".main", "#commandAppBar"]);
                });
            };
            CustomerAddEditViewController.prototype._getDateTimeValue = function (index) {
                var dateTimeElementId = "customerCustomAttribute" + index;
                return Commerce.DateExtensions.getDate(document.getElementById(dateTimeElementId).winControl.current);
            };
            return CustomerAddEditViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CustomerAddEditViewController = CustomerAddEditViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var AddressAddEditViewController = (function (_super) {
            __extends(AddressAddEditViewController, _super);
            function AddressAddEditViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }, false) || this;
                _this.title(AddressAddEditViewController._getTitle(options.address));
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    Commerce.NotificationHandler.displayErrorMessage("string_29000");
                    return _this;
                }
                _this.viewModel = new Commerce.ViewModels.AddressAddEditViewModel(_this.createViewModelContext(), options);
                if (Commerce.ObjectExtensions.isNullOrUndefined(_this.viewModel.addressProxy.IsPrimary())) {
                    var isPrimary = !_this.hasCustomerPrimaryAddress();
                    _this.viewModel.addressProxy.IsPrimary(isPrimary);
                    _this.isPrimary = ko.observable(isPrimary);
                }
                else {
                    _this.isPrimary = ko.observable(_this.viewModel.addressProxy.IsPrimary());
                }
                _this.loadSalesTaxGroups();
                _this.viewModel.addressProxy.ThreeLetterISORegionName.subscribe(_this.selectedCountryChanged, _this);
                _this.showStreetName = ko.observable(true);
                _this.showStreetNumber = ko.observable(true);
                _this.showBuildingComplement = ko.observable(true);
                _this.showCity = ko.observable(true);
                _this.showCounty = ko.observable(true);
                _this.showDistrict = ko.observable(true);
                _this.showState = ko.observable(true);
                _this.showZip = ko.observable(true);
                _this.selectedCountryChanged(_this.viewModel.addressProxy.ThreeLetterISORegionName());
                _this.enableState = ko.computed(function () {
                    return _this.viewModel.states().length > 0;
                }, _this);
                return _this;
            }
            AddressAddEditViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            AddressAddEditViewController.prototype.setAddressProxyIsPrimary = function (isPrimary) {
                this.viewModel.addressProxy.IsPrimary(isPrimary);
            };
            AddressAddEditViewController.prototype.onHidden = function () {
                this.viewModel.cancelAddressAddEdit();
            };
            AddressAddEditViewController.prototype.zipCodeSaveClicked = function () {
                var _this = this;
                var zipcodeDiv = $(this.getViewContainer()).find("#zipTabRead")[0];
                $(zipcodeDiv).off("blur");
                this.viewModel.zipCodeChangedAsync().done(function (result) {
                    if (!result.canceled) {
                        _this.viewModel.saveAddressAsync();
                    }
                    $(zipcodeDiv).on("blur", _this.viewModel.zipCodeChangedAsync.bind(_this.viewModel));
                }).fail(function () {
                    $(zipcodeDiv).on("blur", _this.viewModel.zipCodeChangedAsync.bind(_this.viewModel));
                });
            };
            AddressAddEditViewController._getTitle = function (address) {
                var title = Commerce.ObjectExtensions.isNullOrUndefined(address) ? Commerce.StringExtensions.EMPTY : address.Name;
                return title;
            };
            AddressAddEditViewController.prototype.hasCustomerPrimaryAddress = function () {
                var customerProxy = this.viewModel.customerProxy;
                if (Commerce.ObjectExtensions.isNullOrUndefined(customerProxy)) {
                    return false;
                }
                var customer = Commerce.ViewModels.Utilities.ObservableProxyHelper.unwrapObservableProxyObject(customerProxy);
                var addresses = customer.Addresses;
                if (Commerce.ObjectExtensions.isNullOrUndefined(addresses)) {
                    return false;
                }
                return !Commerce.ObjectExtensions.isUndefined(Commerce.ArrayExtensions.firstOrUndefined(addresses, function (address) {
                    return address.IsPrimary === true;
                }));
            };
            AddressAddEditViewController.prototype.selectedCountryChanged = function (newValue) {
                if (!Commerce.StringExtensions.isEmptyOrWhitespace(newValue)) {
                    var matchingCountry = this.viewModel.countryRegions
                        .filter(function (countryRegion) {
                        return countryRegion.CountryRegionId === newValue;
                    });
                    if (Commerce.ArrayExtensions.hasElements(matchingCountry)) {
                        this.updateVisibleAddressElements(matchingCountry[0].AddressFormatLines);
                    }
                }
            };
            AddressAddEditViewController.prototype.hideAllAddressFields = function () {
                this.showStreetName(false);
                this.showStreetNumber(false);
                this.showBuildingComplement(false);
                this.showCity(false);
                this.showCounty(false);
                this.showDistrict(false);
                this.showState(false);
                this.showZip(false);
            };
            AddressAddEditViewController.prototype.updateVisibleAddressElements = function (formatLines) {
                this.hideAllAddressFields();
                var formatLine;
                for (var index = 0; index < formatLines.length; index++) {
                    formatLine = formatLines[index];
                    if (formatLine.Inactive) {
                        continue;
                    }
                    switch (formatLines[index].AddressComponentNameValue) {
                        case Commerce.Proxy.Entities.AddressFormatLineType.StreetName:
                            this.showStreetName(true);
                            break;
                        case Commerce.Proxy.Entities.AddressFormatLineType.StreetNumber:
                            this.showStreetNumber(true);
                            break;
                        case Commerce.Proxy.Entities.AddressFormatLineType.BuildingCompliment:
                            this.showBuildingComplement(true);
                            break;
                        case Commerce.Proxy.Entities.AddressFormatLineType.Postbox:
                        case Commerce.Proxy.Entities.AddressFormatLineType.ZipCode:
                            this.showZip(true);
                            break;
                        case Commerce.Proxy.Entities.AddressFormatLineType.County:
                            this.showCounty(true);
                            break;
                        case Commerce.Proxy.Entities.AddressFormatLineType.District:
                            this.showDistrict(true);
                            break;
                        case Commerce.Proxy.Entities.AddressFormatLineType.State:
                            this.showState(true);
                            break;
                        case Commerce.Proxy.Entities.AddressFormatLineType.City:
                            this.showCity(true);
                            break;
                    }
                }
            };
            AddressAddEditViewController.prototype.loadSalesTaxGroups = function () {
                if (AddressAddEditViewController.salesTaxGroups.length === 0) {
                    this.viewModel.getSalesTaxGroups()
                        .done(function (salesTaxGroups) {
                        AddressAddEditViewController.salesTaxGroups(salesTaxGroups);
                    }).fail(function (errors) {
                        Commerce.RetailLogger.viewsCustomerAddressAddEditViewDownloadTaxGroupsFailed(errors[0].ErrorCode, Commerce.ErrorHelper.formatErrorMessage(errors[0]));
                    });
                }
            };
            AddressAddEditViewController.salesTaxGroups = ko.observableArray([]);
            return AddressAddEditViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.AddressAddEditViewController = AddressAddEditViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var AddressWrapper = (function () {
            function AddressWrapper(address) {
                this.address = address;
            }
            return AddressWrapper;
        }());
        ViewControllers.AddressWrapper = AddressWrapper;
        var CustomerAddressesViewController = (function (_super) {
            __extends(CustomerAddressesViewController, _super);
            function CustomerAddressesViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    options = {
                        customer: null,
                        selectionMode: true,
                        addressSelectionHandler: new Commerce.CancelableSelectionHandler(function () {
                            return;
                        }, function () {
                            return;
                        }),
                    };
                }
                else {
                    options = __assign({}, options);
                    options.customer = Commerce.ViewModels.Utilities.ObservableProxyHelper.unwrapObservableProxyObject(options.customer) || null;
                    options.selectionMode = Commerce.ObjectExtensions.isNullOrUndefined(options.selectionMode) ? true : options.selectionMode;
                    options.addressSelectionHandler = Commerce.ObjectExtensions.isNullOrUndefined(options.addressSelectionHandler) ? new Commerce.CancelableSelectionHandler(function () {
                        return;
                    }, function () {
                        return;
                    }) : options.addressSelectionHandler;
                }
                _this.title(CustomerAddressesViewController._getTitle(options.customer));
                _this.viewModel = new Commerce.ViewModels.CustomerAddressesViewModel(_this.createViewModelContext(), options);
                _this._disposables = [];
                _this.customer = options.customer;
                _this.selectionMode = options.selectionMode;
                _this._addressSelectionHandler = options.addressSelectionHandler;
                _this.addresses = _this._unwrapObservableAddresses(_this.customer.Addresses);
                _this._setCustomerAddressesWrappers();
                return _this;
            }
            CustomerAddressesViewController.prototype.addressTitleClicked = function (addressWrapper) {
                var address = addressWrapper.address;
                this.viewModel.navigateToAddressAddEditView(address);
            };
            CustomerAddressesViewController.prototype.addAddressClicked = function () {
                this.viewModel.navigateToAddressAddEditView();
            };
            CustomerAddressesViewController.prototype.unload = function () {
                if (Commerce.ArrayExtensions.hasElements(this._disposables)) {
                    this._disposables.forEach(function (disposable) { return disposable.dispose(); });
                }
                _super.prototype.unload.call(this);
            };
            CustomerAddressesViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            CustomerAddressesViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            CustomerAddressesViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            CustomerAddressesViewController._getTitle = function (customer) {
                var title = Commerce.ObjectExtensions.isNullOrUndefined(customer) ? Commerce.StringExtensions.EMPTY : customer.Name;
                return title;
            };
            CustomerAddressesViewController.prototype._setCustomerAddressesWrappers = function () {
                var ordinaryAddresses = this.addresses.filter(function (address) { return address.IsPrimary === false; });
                this.otherAddressWrappers = this._getCustomerAddressesWrappers(ordinaryAddresses);
                var primaryAddresses = this.addresses.filter(function (address) { return address.IsPrimary === true; });
                this.primaryAddressWrappers = this._getCustomerAddressesWrappers(primaryAddresses);
            };
            CustomerAddressesViewController.prototype._getCustomerAddressesWrappers = function (addresses) {
                var _this = this;
                var addressWrappers = [];
                addresses.forEach(function (address) {
                    var wrapper = new AddressWrapper(address);
                    wrapper.addressTitleClicked = function () {
                        _this.addressTitleClicked(wrapper);
                    };
                    WinJS.Utilities.markSupportedForProcessing(wrapper.addressTitleClicked);
                    if (_this.selectionMode) {
                        wrapper.addressSelected = function () {
                            _this._applyAddress(wrapper);
                        };
                        WinJS.Utilities.markSupportedForProcessing(wrapper.addressSelected);
                    }
                    addressWrappers.push(wrapper);
                });
                return addressWrappers;
            };
            CustomerAddressesViewController.prototype._applyAddress = function (addressWrapper) {
                this._addressSelectionHandler.select(addressWrapper.address, function () {
                    return;
                }, function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            CustomerAddressesViewController.prototype._unwrapObservableAddresses = function (addresses) {
                if (Commerce.ArrayExtensions.hasElements(addresses)) {
                    for (var i = 0; i < addresses.length; i++) {
                        addresses[i] = Commerce.ViewModels.Utilities.ObservableProxyHelper.unwrapObservableProxyObject(addresses[i]);
                    }
                }
                return addresses;
            };
            return CustomerAddressesViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CustomerAddressesViewController = CustomerAddressesViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CustomerAffiliationsViewController = (function (_super) {
            __extends(CustomerAffiliationsViewController, _super);
            function CustomerAffiliationsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw "Invalid options passed to the CustomerAffiliationsViewController constructor: options cannot be null or undefined.";
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.customer)) {
                    throw "Invalid options passed to the CustomerAffiliationsViewController constructor: options.customer must be defined.";
                }
                _this.title(options.customer.Name);
                _this.viewModel = new Commerce.ViewModels.CustomerAffiliationsViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            CustomerAffiliationsViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            CustomerAffiliationsViewController.prototype.navigateToCustomerDetailPage = function () {
                var viewOptions = {
                    accountNumber: this.viewModel.customer().AccountNumber,
                    correlationId: Commerce.StringExtensions.EMPTY
                };
                Commerce.ViewModelAdapter.navigate("CustomerDetailsView", viewOptions);
            };
            return CustomerAffiliationsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CustomerAffiliationsViewController = CustomerAffiliationsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CustomerContactInfoViewController = (function (_super) {
            __extends(CustomerContactInfoViewController, _super);
            function CustomerContactInfoViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    options = { customer: null, contactInfoType: null, saveContactInfoSelectionHandler: null };
                }
                else {
                    options = __assign({}, options);
                    options.customer = Commerce.ViewModels.Utilities.ObservableProxyHelper.unwrapObservableProxyObject(options.customer) || null;
                    options.contactInfoType = Commerce.ObjectExtensions.isNullOrUndefined(options.contactInfoType) ? null : options.contactInfoType;
                }
                _this.subTitle = ko.observable(Commerce.StringExtensions.EMPTY);
                if (options.contactInfoType === Commerce.Proxy.Entities.ContactInfoType.Email) {
                    _this.title(Commerce.ViewModelAdapter.getResourceString("string_4857"));
                    _this.subTitle(Commerce.ViewModelAdapter.getResourceString("string_4857"));
                }
                else if (options.contactInfoType === Commerce.Proxy.Entities.ContactInfoType.Phone) {
                    _this.title(Commerce.ViewModelAdapter.getResourceString("string_4858"));
                    _this.subTitle(Commerce.ViewModelAdapter.getResourceString("string_4858"));
                }
                _this.viewModel = new Commerce.ViewModels.CustomerContactInfoViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            CustomerContactInfoViewController.prototype.unload = function () {
                _super.prototype.unload.call(this);
            };
            CustomerContactInfoViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            CustomerContactInfoViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            CustomerContactInfoViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            return CustomerContactInfoViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CustomerContactInfoViewController = CustomerContactInfoViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CustomerDetailsViewController = (function (_super) {
            __extends(CustomerDetailsViewController, _super);
            function CustomerDetailsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                var viewModelOptions;
                if (options instanceof Commerce.Client.Entities.CustomerDetailsNavigationParameters) {
                    viewModelOptions = {
                        accountNumber: options.accountNumber,
                        correlationId: Commerce.StringExtensions.EMPTY
                    };
                }
                else {
                    viewModelOptions = options;
                }
                _this.viewModel = new Commerce.ViewModels.CustomerDetailsViewModel(_this.createViewModelContext(), viewModelOptions);
                _this.viewModel.refreshOrderHistoryList = function () {
                    _this._refreshOrderHistoryList();
                };
                _this.title(_this.viewModel.viewTitle());
                _this._viewTitleSubscription = _this.viewModel.viewTitle.subscribe(function (newTitle) {
                    _this.title(newTitle);
                });
                return _this;
            }
            CustomerDetailsViewController.prototype.dispose = function () {
                this._viewTitleSubscription.dispose();
                _super.prototype.dispose.call(this);
            };
            CustomerDetailsViewController.prototype.load = function () {
                this.viewModel.loadAsync()
                    .done(function () {
                    Commerce.RetailLogger.viewsCustomerDetailsLoaded();
                });
            };
            CustomerDetailsViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            CustomerDetailsViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            CustomerDetailsViewController.prototype.afterShown = function () {
                this.viewModel.afterShown();
                var $element = $(this._element);
                var listSteps = $element.find(".buttonBlock");
                for (var i = 0; i < listSteps.length; i++) {
                    listSteps[i].firstElementChild.setAttribute("tabindex", "-1");
                }
            };
            CustomerDetailsViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            CustomerDetailsViewController.prototype._refreshOrderHistoryList = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._orderHistoryDataListViewModel)) {
                    var listElement = document.getElementById(CustomerDetailsViewController.ORDER_HISTORY_DATA_LIST_ID);
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(listElement) && !Commerce.ObjectExtensions.isNullOrUndefined(listElement.dataListViewModel)) {
                        this._orderHistoryDataListViewModel = listElement.dataListViewModel;
                    }
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._orderHistoryDataListViewModel)) {
                    this._orderHistoryDataListViewModel.refreshList();
                }
            };
            CustomerDetailsViewController.ORDER_HISTORY_DATA_LIST_ID = "customerSalesOrderList";
            return CustomerDetailsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CustomerDetailsViewController = CustomerDetailsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var RecentPurchasesViewController = (function (_super) {
            __extends(RecentPurchasesViewController, _super);
            function RecentPurchasesViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw "Invalid options passed to the RecentPurchasesViewController constructor: options cannot be null or undefined.";
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(options.customerName)) {
                    throw "Invalid options passed to the RecentPurchasesViewController constructor: options.customerName is a required field.";
                }
                _this.title(options.customerName);
                _this.viewModel = new Commerce.ViewModels.RecentPurchasesViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            RecentPurchasesViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            return RecentPurchasesViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.RecentPurchasesViewController = RecentPurchasesViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CustomerOrderInvoicesViewController = (function (_super) {
            __extends(CustomerOrderInvoicesViewController, _super);
            function CustomerOrderInvoicesViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_12315") }) || this;
                _this.viewModel = new Commerce.ViewModels.CustomerOrderInvoicesViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            CustomerOrderInvoicesViewController.prototype.load = function () {
                this.viewModel.load();
            };
            CustomerOrderInvoicesViewController.prototype.loadingStateChanged = function (event) {
                var winControl = event.currentTarget.winControl;
                if (winControl.itemDataSource.list.length === 1 && winControl.selection.count() === 0) {
                    winControl.selection.add(0);
                }
            };
            return CustomerOrderInvoicesViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CustomerOrderInvoicesViewController = CustomerOrderInvoicesViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var DepositOverrideViewController = (function (_super) {
            __extends(DepositOverrideViewController, _super);
            function DepositOverrideViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_4600") }) || this;
                var viewModelOptions = {
                    selectionHandler: options.selectionHandler,
                    numpadBroker: _this.numPadInputBroker
                };
                _this.viewModel = new Commerce.ViewModels.DepositOverrideViewModel(_this.createViewModelContext(), viewModelOptions);
                return _this;
            }
            DepositOverrideViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            DepositOverrideViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            return DepositOverrideViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.DepositOverrideViewController = DepositOverrideViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var FulfillmentLineViewController = (function (_super) {
            __extends(FulfillmentLineViewController, _super);
            function FulfillmentLineViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_13103") }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw Error("'Options' is required for FulfillmentLineView.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.fulfillmentDeliveryType)) {
                    throw Error("options.FulfillmentLineView' is required for FulfillmentLineView. The fulfillment delivery type is empty.");
                }
                Commerce.RetailLogger.fulfillmentViewNavigationEnd(options.fulfillmentDeliveryType.Name, options.correlationId);
                _this.viewModel = new Commerce.ViewModels.FulfillmentLineViewModel(_this.createViewModelContext(), options);
                _this.viewModel.setSelectedFulfillmentLines = _this.setSelectedFulfillmentLines.bind(_this);
                return _this;
            }
            FulfillmentLineViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            FulfillmentLineViewController.prototype.setSelectedFulfillmentLines = function (fulfillmentLines) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._dataListViewModel)) {
                    this._dataListViewModel = document.getElementById("fulfillmentLineList").dataListViewModel;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._dataListViewModel)) {
                        return;
                    }
                }
                this._dataListViewModel.selectItems(fulfillmentLines, function (left, right) {
                    return left.ItemId === right.ItemId;
                });
            };
            return FulfillmentLineViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.FulfillmentLineViewController = FulfillmentLineViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var InvoicedSalesLinesViewController = (function (_super) {
            __extends(InvoicedSalesLinesViewController, _super);
            function InvoicedSalesLinesViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_5011") }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw Error("'Options' is required for InvoicedSalesLinesView.");
                }
                else if (!Commerce.ArrayExtensions.hasElements(options.salesIds)) {
                    throw Error("'options.salesIds' is required for InvoicedSalesLinesView");
                }
                _this.viewModel = new Commerce.ViewModels.InvoicedSalesLinesViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            return InvoicedSalesLinesViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.InvoicedSalesLinesViewController = InvoicedSalesLinesViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var PaymentHistoryViewController = (function (_super) {
            __extends(PaymentHistoryViewController, _super);
            function PaymentHistoryViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }, false) || this;
                _this.historicalTenderLines = ko.observableArray([]);
                return _this;
            }
            PaymentHistoryViewController.prototype.load = function () {
                var _this = this;
                this.cart = Commerce.Session.instance.cart;
                this.viewModel = new Commerce.ViewModels.PaymentHistoryViewModel(this.createViewModelContext());
                this.viewModel.getPaymentsHistory(this.cart)
                    .done(function (tenderLines) {
                    _this.historicalTenderLines(tenderLines);
                }).fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
                var salesId = Commerce.StringExtensions.isNullOrWhitespace(this.cart.SalesId) ?
                    Commerce.StringExtensions.EMPTY : this.cart.SalesId;
                this.title(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_4529"), salesId));
            };
            return PaymentHistoryViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.PaymentHistoryViewController = PaymentHistoryViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var PickUpInStoreViewController = (function (_super) {
            __extends(PickUpInStoreViewController, _super);
            function PickUpInStoreViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }, false) || this;
                _this.title(PickUpInStoreViewController._getTitle(options.isForPickUp));
                _this.viewModel = new Commerce.ViewModels.PickUpInStoreViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            PickUpInStoreViewController.prototype.load = function () {
                var map = new Commerce.NullMapController();
                if (this.viewModel.showMap()) {
                    map = this._createBingMapController();
                }
                this.viewModel.load(map);
            };
            PickUpInStoreViewController.prototype.unload = function () {
                this.viewModel.unload();
                _super.prototype.unload.call(this);
            };
            PickUpInStoreViewController.prototype.onNavigateBack = function () {
                this.viewModel.onNavigateBack();
                return true;
            };
            PickUpInStoreViewController._getTitle = function (isForPickUp) {
                if (isForPickUp) {
                    return Commerce.ViewModelAdapter.getResourceString("string_2508");
                }
                else {
                    return Commerce.ViewModelAdapter.getResourceString("string_2542");
                }
            };
            PickUpInStoreViewController.prototype._createBingMapController = function () {
                var _this = this;
                var mapElementId = "pickupInStoreMap";
                var mapElement = document.getElementById(mapElementId);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(mapElement)) {
                    mapElement.parentElement.removeChild(mapElement);
                }
                mapElement = Commerce.Controls.Bing.MapController.createBingMapsElement("pickupInStoreMapContent", mapElementId, "grow positionRelative", "resx: { ariaLabel: 'string_2552' }");
                var mapHandlers = new Commerce.Dictionary();
                mapHandlers.setItem(Commerce.Controls.Bing.MapEvents.LOADED, function () { return _this.viewModel.onMapLoaded(); });
                mapHandlers.setItem(Commerce.Controls.Bing.MapEvents.ERROR, function (data) { return _this.viewModel.mapError(data); });
                mapHandlers.setItem(Commerce.Controls.Bing.MapEvents.SEARCH_SUCCESS, function (data) { return _this.viewModel.mapSearchSuccessAsync(data); });
                mapHandlers.setItem(Commerce.Controls.Bing.MapEvents.UPDATE_LOCATIONS, function (data) { return _this.viewModel.updateLocationsAsync(data); });
                mapHandlers.setItem(Commerce.Controls.Bing.MapEvents.INITIALIZATION_ERROR, function (data) { return _this.viewModel.mapInitializationErrorAsync(data); });
                mapHandlers.setItem(Commerce.Controls.Bing.MapEvents.INFOBOX_HYPERLINK_CLICKED, function (data) {
                    var storeDetailsOptions = {
                        storeId: data.elementId
                    };
                    Commerce.ViewModelAdapter.navigate("StoreDetailsView", storeDetailsOptions);
                });
                return new Commerce.Controls.Bing.MapController(this.viewModel, mapElement, mapHandlers);
            };
            return PickUpInStoreViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.PickUpInStoreViewController = PickUpInStoreViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var PickUpViewController = (function (_super) {
            __extends(PickUpViewController, _super);
            function PickUpViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                _this.title(PickUpViewController._getTitle(options.salesId));
                _this.viewModel = new Commerce.ViewModels.PickUpViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            PickUpViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            PickUpViewController.prototype.onHidden = function () {
                this.viewModel.cancelSalesLinesSelection();
            };
            PickUpViewController.prototype.selectAll = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._dataListViewModel)) {
                    this._dataListViewModel = document.getElementById("pickUpSalesLinesList").dataListViewModel;
                }
                this._dataListViewModel.selectAll();
            };
            PickUpViewController._getTitle = function (salesId) {
                var titleFormatString = Commerce.ViewModelAdapter.getResourceString("string_4529");
                var title = Commerce.StringExtensions.format(titleFormatString, salesId);
                return title;
            };
            return PickUpViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.PickUpViewController = PickUpViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var SalesInvoiceDetailsViewController = (function (_super) {
            __extends(SalesInvoiceDetailsViewController, _super);
            function SalesInvoiceDetailsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_5011") }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw "SalesInvoiceDetailsViewController::ctor options are a required parameter.";
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.salesInvoice)) {
                    throw "SalesInvoiceDetailsViewController::ctor The options did not contain a value for the salesInvoice, which is a required field.";
                }
                _this.viewModel = new Commerce.ViewModels.SalesInvoiceDetailsViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            SalesInvoiceDetailsViewController.prototype.onItemDataSourceUpdated = function (viewModel) {
                if (Commerce.ArrayExtensions.hasElements(this.viewModel.cartLinesForDisplay()) && this.viewModel.cartLinesForDisplay().length === 1) {
                    viewModel.selectAll();
                }
            };
            SalesInvoiceDetailsViewController.prototype.onShown = function () {
                this.viewModel.loadAsync()
                    .fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            SalesInvoiceDetailsViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
                _super.prototype.onHidden.call(this);
            };
            return SalesInvoiceDetailsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.SalesInvoiceDetailsViewController = SalesInvoiceDetailsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var SalesInvoicesViewController = (function (_super) {
            __extends(SalesInvoicesViewController, _super);
            function SalesInvoicesViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_5001") }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options) || Commerce.StringExtensions.isNullOrWhitespace(options.salesId)) {
                    throw new Error("options is a required parameter for SalesInvoiceViewController and the salesId field must be set.");
                }
                _this._salesId = options.salesId;
                _this._selectedInvoice = ko.observable(null);
                _this.returnSalesInvoiceDisabled = ko.computed(function () { return _this._selectedInvoice() == null; }, _this);
                _this._salesInvoices = ko.observableArray([]);
                _this.viewModel = new Commerce.ViewModels.SalesInvoicesViewModel(_this.createViewModelContext());
                _this._loadSalesInvoices();
                return _this;
            }
            SalesInvoicesViewController.prototype.onItemDataSourceUpdated = function (viewModel) {
                if (Commerce.ArrayExtensions.hasElements(this._salesInvoices()) && this._salesInvoices().length === 1) {
                    viewModel.selectAll();
                }
            };
            SalesInvoicesViewController.prototype.onSelectionChanged = function (salesInvoices) {
                this._selectedInvoice(salesInvoices[0] || null);
            };
            SalesInvoicesViewController.prototype.returnSalesInvoice = function () {
                var invoice = this._selectedInvoice();
                var options = {
                    salesInvoice: invoice
                };
                Commerce.ViewModelAdapter.navigate("SalesInvoiceDetailsView", options);
            };
            SalesInvoicesViewController.prototype._loadSalesInvoices = function () {
                var _this = this;
                this.viewModel.getSalesInvoicesBySalesIdAsync(this._salesId)
                    .done(function (salesInvoices) {
                    _this._salesInvoices(salesInvoices);
                }).fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            return SalesInvoicesViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.SalesInvoicesViewController = SalesInvoicesViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var SaleslineSelectorViewController = (function (_super) {
            __extends(SaleslineSelectorViewController, _super);
            function SaleslineSelectorViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw Error("'Options' is required for SaleslineSelectorView.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.operationId)) {
                    throw Error("options.operationId' is required for selecting sales line. The operation Id is null or empty.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.cart)) {
                    throw Error("options.cart' is required for for selecting sales line. The cart is null or empty.");
                }
                _this.title(SaleslineSelectorViewController._getTitle(options.operationId));
                var viewModelOptions = {
                    cart: options.cart,
                    operationId: options.operationId
                };
                _this.viewModel = new Commerce.ViewModels.SaleslineSelectorViewModel(_this.createViewModelContext(), viewModelOptions);
                return _this;
            }
            SaleslineSelectorViewController._getTitle = function (operationId) {
                switch (operationId) {
                    case Commerce.Operations.RetailOperation.ShipAllProducts:
                    case Commerce.Operations.RetailOperation.ShipSelectedProducts:
                        return Commerce.ViewModelAdapter.getResourceString("string_4463");
                    case Commerce.Operations.RetailOperation.PickupAllProducts:
                    case Commerce.Operations.RetailOperation.PickupSelectedProducts:
                        return Commerce.ViewModelAdapter.getResourceString("string_4464");
                    case Commerce.Operations.RetailOperation.CarryoutAllProducts:
                    case Commerce.Operations.RetailOperation.CarryoutSelectedProducts:
                        return Commerce.ViewModelAdapter.getResourceString("string_4465");
                    default:
                        return Commerce.StringExtensions.EMPTY;
                }
            };
            return SaleslineSelectorViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.SaleslineSelectorViewController = SaleslineSelectorViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var SearchOrdersViewController = (function (_super) {
            __extends(SearchOrdersViewController, _super);
            function SearchOrdersViewController(context, options) {
                var _this = _super.call(this, context, { title: context.stringResourceManager.getString("string_4500") }) || this;
                var viewModelOptions;
                if (options instanceof Commerce.Client.Entities.SearchOrdersNavigationParameters) {
                    viewModelOptions = {
                        searchCriteria: options.searchCriteria
                    };
                }
                else {
                    viewModelOptions = options;
                }
                _this.viewModel = new Commerce.ViewModels.SearchOrdersViewModel(_this.createViewModelContext(), viewModelOptions);
                _this.selectionMode = Commerce.ApplicationContext.Instance.channelConfiguration.EnableReturnsForMultipleOrderInvoices ?
                    Commerce.Controls.DataList.SelectionMode.MultiSelect : Commerce.Controls.DataList.SelectionMode.SingleSelect;
                return _this;
            }
            SearchOrdersViewController.prototype.searchOrdersViewAnimationEndHandler = function () {
                if (!this.viewModel.hasSearchCriteria) {
                    this.viewModel.performSalesOrderSearch();
                }
            };
            SearchOrdersViewController.prototype.loadingStateChanged = function (viewModel) {
                viewModel.getItemCountAsync().done(function (count) {
                    if (count === 1) {
                        viewModel.selectAll();
                    }
                });
            };
            SearchOrdersViewController.prototype.createPickingList = function () {
                var salesOrder = this.viewModel.selectedOrder().salesOrder;
                this.viewModel.createPickingList(salesOrder)
                    .done(function () {
                    Commerce.ViewModelAdapter.displayMessage("string_4543");
                });
            };
            SearchOrdersViewController.prototype.cancelOrder = function () {
                this.viewModel.cancelCustomerOrder(this.viewModel.selectedOrder().salesOrder)
                    .done(function () {
                    Commerce.ViewModelAdapter.navigate("CartView");
                });
            };
            SearchOrdersViewController.prototype.returnOrder = function () {
                if (Commerce.ApplicationContext.Instance.channelConfiguration.EnableReturnsForMultipleOrderInvoices) {
                    var orderIds = this.viewModel.selectedOrders().map(function (order) { return order.salesOrder.SalesId; });
                    var viewOptions = { salesIds: orderIds };
                    Commerce.ViewModelAdapter.navigate("InvoicedSalesLinesView", viewOptions);
                }
                else {
                    var order = this.viewModel.selectedOrder().salesOrder;
                    var viewOptions = { salesId: order.SalesId };
                    Commerce.ViewModelAdapter.navigate("SalesInvoicesView", viewOptions);
                }
            };
            SearchOrdersViewController.prototype.editOrder = function () {
                this.viewModel.recallCustomerOrderOrQuoteForEdition(this.viewModel.selectedOrder().salesOrder).
                    done(function () {
                    Commerce.ViewModelAdapter.navigate("CartView");
                });
            };
            SearchOrdersViewController.prototype.onSelectionChanged = function (salesOrder) {
                this.viewModel.selectedOrders(salesOrder);
            };
            return SearchOrdersViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.SearchOrdersViewController = SearchOrdersViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        var ShippingLocationsViewController = (function (_super) {
            __extends(ShippingLocationsViewController, _super);
            function ShippingLocationsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_6400") }, false) || this;
                _this.viewModel = new Commerce.ViewModels.ShippingLocationsViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            ShippingLocationsViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            ShippingLocationsViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            return ShippingLocationsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ShippingLocationsViewController = ShippingLocationsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ShippingMethodsViewController = (function (_super) {
            __extends(ShippingMethodsViewController, _super);
            function ShippingMethodsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_2501") }) || this;
                _this.viewModel = new Commerce.ViewModels.ShippingMethodsViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            ShippingMethodsViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            ShippingMethodsViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            ShippingMethodsViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            ShippingMethodsViewController.prototype.shippingMethodButtonClick = function (eventArgs) {
                var shippingMethod = eventArgs.data;
                if (shippingMethod.Code === Commerce.ApplicationContext.Instance.channelConfiguration.PickupDeliveryModeCode) {
                    var pickUpOptions = {
                        isForPickUp: true,
                        cartLines: this.viewModel.cartLines
                    };
                    Commerce.ViewModelAdapter.navigate("PickUpInStoreView", pickUpOptions);
                    return;
                }
                if (!this.viewModel.isShippingAddressProvided) {
                    this.createNewAddressButtonClick();
                    return;
                }
                this.viewModel.selectShippingMethod(shippingMethod);
            };
            ShippingMethodsViewController.prototype.updateAddressButtonClick = function () {
                this.viewModel.editShippingAddress();
            };
            ShippingMethodsViewController.prototype.createNewAddressButtonClick = function () {
                this.viewModel.createCustomerAddress();
            };
            return ShippingMethodsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ShippingMethodsViewController = ShippingMethodsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        var ChangeDeliveryModeViewController = (function (_super) {
            __extends(ChangeDeliveryModeViewController, _super);
            function ChangeDeliveryModeViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_108") }) || this;
                _this.viewModel = new Commerce.ViewModels.ChangeDeliveryModeViewModel(_this.createViewModelContext());
                return _this;
            }
            ChangeDeliveryModeViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            ChangeDeliveryModeViewController.prototype.selectAll = function () {
                this._getDataListViewModel().selectAll();
            };
            ChangeDeliveryModeViewController.prototype.deselectAll = function () {
                this._getDataListViewModel().clearAll();
            };
            ChangeDeliveryModeViewController.prototype._getDataListViewModel = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._dataListViewModel)) {
                    this._dataListViewModel = document.getElementById("deliveredCartLinesList").dataListViewModel;
                }
                return this._dataListViewModel;
            };
            return ChangeDeliveryModeViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ChangeDeliveryModeViewController = ChangeDeliveryModeViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CashManagementViewController = (function (_super) {
            __extends(CashManagementViewController, _super);
            function CashManagementViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                _this.viewModel = new Commerce.ViewModels.CashManagementViewModel(_this.createViewModelContext(), options);
                _this.viewModel.setNumPadPublisher(_this.numPadInputBroker);
                _this.title(_this.viewModel.title);
                return _this;
            }
            CashManagementViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            CashManagementViewController.prototype.enterAmount = function (numPadResult) {
                this.viewModel.enterAmount();
                this.context.interaction.triggerEvent(this._cashManagementElement, CashManagementViewController._amountByKeywordFound);
            };
            CashManagementViewController.prototype.afterBind = function (element) {
                this._cashManagementElement = element;
            };
            CashManagementViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            CashManagementViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            CashManagementViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            CashManagementViewController._amountByKeywordFound = "AmountByKeywordFound";
            return CashManagementViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CashManagementViewController = CashManagementViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CostAccountViewController = (function (_super) {
            __extends(CostAccountViewController, _super);
            function CostAccountViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw "Invalid options passed to the CostAccountViewModel constructor: options cannot be null or undefined.";
                }
                else if (options.accountType !== Commerce.Proxy.Entities.IncomeExpenseAccountType.Income
                    && options.accountType !== Commerce.Proxy.Entities.IncomeExpenseAccountType.Expense) {
                    throw "Invalid options passed to the CostAccountViewModel constructor: options.accountType is not a supported account type.";
                }
                _this.title(CostAccountViewController._getTitle(options.accountType));
                _this.viewModel = new Commerce.ViewModels.CostAccountViewModel(_this.createViewModelContext(), options);
                _this.viewModel.setNumPadPublisher(_this.numPadInputBroker);
                return _this;
            }
            CostAccountViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            CostAccountViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            CostAccountViewController._getTitle = function (accountType) {
                if (accountType === Commerce.Proxy.Entities.IncomeExpenseAccountType.Income) {
                    return Commerce.ViewModelAdapter.getResourceString("string_4055");
                }
                else if (accountType === Commerce.Proxy.Entities.IncomeExpenseAccountType.Expense) {
                    return Commerce.ViewModelAdapter.getResourceString("string_4056");
                }
                else {
                    return Commerce.StringExtensions.EMPTY;
                }
            };
            return CostAccountViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CostAccountViewController = CostAccountViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var DenominationsViewController = (function (_super) {
            __extends(DenominationsViewController, _super);
            function DenominationsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }, false) || this;
                _this.viewModel = new Commerce.ViewModels.DenominationsViewModel(_this.createViewModelContext(), options);
                _this.title(_this.viewModel.operationTitle);
                return _this;
            }
            DenominationsViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            return DenominationsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.DenominationsViewController = DenominationsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ManageSafesViewController = (function (_super) {
            __extends(ManageSafesViewController, _super);
            function ManageSafesViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_30113") }) || this;
                _this.viewModel = new Commerce.ViewModels.ManageSafesViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            ManageSafesViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            return ManageSafesViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ManageSafesViewController = ManageSafesViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ManageShiftsViewController = (function (_super) {
            __extends(ManageShiftsViewController, _super);
            function ManageShiftsViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_2006") }) || this;
                _this.viewModel = new Commerce.ViewModels.ManageShiftsViewModel(_this.createViewModelContext());
                return _this;
            }
            ManageShiftsViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            return ManageShiftsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ManageShiftsViewController = ManageShiftsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ReconcileShiftsViewController = (function (_super) {
            __extends(ReconcileShiftsViewController, _super);
            function ReconcileShiftsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_2147") }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw new Error("Invalid options passed to  ReconcileShiftsView: options cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.shiftsToReconcile)) {
                    throw new Error("Invalid options passed to ReconcileShiftsView: shiftsToReconcile cannot be null or undefined.");
                }
                _this.viewModel = new Commerce.ViewModels.ReconcileShiftsViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            ReconcileShiftsViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            ReconcileShiftsViewController.prototype.afterBind = function (element) {
                var _this = this;
                this._reconcileShiftsModeTrigger = this.viewModel.reconcileShiftsMode.subscribe(function (newValue) {
                    if (newValue === Commerce.ViewModels.ReconcileShiftsMode.Active) {
                        _this.context.interaction.triggerEvent(element, "activateActiveTabPivotItem");
                    }
                    else {
                        _this.context.interaction.triggerEvent(element, "activateCompletedTabPivotItem");
                    }
                });
            };
            ReconcileShiftsViewController.prototype.onHidden = function () {
                this._reconcileShiftsModeTrigger.dispose();
            };
            return ReconcileShiftsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ReconcileShiftsViewController = ReconcileShiftsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ResumeShiftViewController = (function (_super) {
            __extends(ResumeShiftViewController, _super);
            function ResumeShiftViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_4188") }) || this;
                options = options || { onShiftSelected: null, availableShiftActions: null };
                _this.viewModel = new Commerce.ViewModels.ResumeShiftViewModel(_this.createViewModelContext(), options);
                _this.availableShifts = ko.observableArray([]);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(options.availableShiftActions)) {
                    if (Commerce.ArrayExtensions.hasElements(options.availableShiftActions.reusableShifts)) {
                        options.availableShiftActions.reusableShifts.forEach(function (shiftValue, shiftIndex, shiftArray) {
                            _this.availableShifts.push(shiftValue);
                        });
                    }
                    if (Commerce.ArrayExtensions.hasElements(options.availableShiftActions.suspendedShifts)) {
                        options.availableShiftActions.suspendedShifts.forEach(function (shiftValue, shiftIndex, shiftArray) {
                            _this.availableShifts.push(shiftValue);
                        });
                    }
                }
                _this.isShiftSelected = ko.observable(false);
                return _this;
            }
            ResumeShiftViewController.prototype.shiftSelectionChangedHandler = function (shifts) {
                this._selectedShift = shifts[0];
                this.isShiftSelected(!Commerce.ObjectExtensions.isNullOrUndefined(this._selectedShift));
            };
            ResumeShiftViewController.prototype.useExistingShift = function () {
                if (this._selectedShift) {
                    this.viewModel.onShiftSelected(this._selectedShift);
                }
            };
            ResumeShiftViewController.prototype.cancelUseExistingShift = function () {
                this.viewModel.onShiftSelected(null);
            };
            ResumeShiftViewController.prototype.onHidden = function () {
                this.viewModel.onShiftSelected(null);
            };
            return ResumeShiftViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ResumeShiftViewController = ResumeShiftViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ReviewShiftTenderLinesViewController = (function (_super) {
            __extends(ReviewShiftTenderLinesViewController, _super);
            function ReviewShiftTenderLinesViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }, false) || this;
                _this.viewModel = new Commerce.ViewModels.ReviewShiftTenderLinesViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            ReviewShiftTenderLinesViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            return ReviewShiftTenderLinesViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ReviewShiftTenderLinesViewController = ReviewShiftTenderLinesViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var TenderCountingViewController = (function (_super) {
            __extends(TenderCountingViewController, _super);
            function TenderCountingViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }, false) || this;
                _this.title(TenderCountingViewController._getTitle(options.transactionType));
                var viewModelOptions = {
                    transactionType: options.transactionType,
                    shift: options.shift,
                    reasonCodeLines: options.reasonCodeLines,
                    onTenderLineSelected: _this.tenderSelectionChangedHandler.bind(_this),
                    selectionHandler: options.selectionHandler,
                    tenderCountingLines: options.tenderCountingLines
                };
                _this.viewModel = new Commerce.ViewModels.TenderCountingViewModel(_this.createViewModelContext(), viewModelOptions);
                _this._ignoreTenderLineClick = false;
                return _this;
            }
            TenderCountingViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            TenderCountingViewController.prototype.onShown = function () {
                this._tenderLineListControl = $("#paymentMethodList")[0].winControl;
            };
            TenderCountingViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            TenderCountingViewController.prototype.onNavigateBack = function () {
                this.viewModel.abortOperationAsync();
                return true;
            };
            TenderCountingViewController.prototype.clickCountButton = function (event) {
                if (!this._ignoreTenderLineClick) {
                    var parent_1 = event.target.parentElement;
                    while (!parent_1.classList.contains("win-item")) {
                        parent_1 = parent_1.parentElement;
                        if (Commerce.ObjectExtensions.isNullOrUndefined(parent_1)) {
                            return;
                        }
                    }
                    var denominationLineIndex = parseInt(parent_1.attributes["aria-posinset"].value, 10) - 1;
                    this.viewModel.switchToDenominationsMode(denominationLineIndex);
                }
                else {
                    this._ignoreTenderLineClick = false;
                    this.viewModel.changeDeclareAmount(true);
                }
            };
            TenderCountingViewController._getTitle = function (transactionType) {
                if (Commerce.ExtensibleEnumerations.ExtensibleTransactionType.TenderDeclaration.equals(transactionType)) {
                    return Commerce.ViewModelAdapter.getResourceString("string_4029");
                }
                else if (Commerce.ExtensibleEnumerations.ExtensibleTransactionType.BankDrop.equals(transactionType)) {
                    return Commerce.ViewModelAdapter.getResourceString("string_4572");
                }
                else if (Commerce.ExtensibleEnumerations.ExtensibleTransactionType.SafeDrop.equals(transactionType)) {
                    return Commerce.ViewModelAdapter.getResourceString("string_4573");
                }
                else {
                    return Commerce.StringExtensions.EMPTY;
                }
            };
            TenderCountingViewController.prototype.tenderSelectionChangedHandler = function (selectedLine, lineIndex) {
                this._ignoreTenderLineClick = true;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(lineIndex) && lineIndex >= 0) {
                    this._tenderLineListControl.selection.set(lineIndex);
                    this._tenderLineListControl.ensureVisible(lineIndex);
                }
            };
            return TenderCountingViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.TenderCountingViewController = TenderCountingViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var TimeClockManagerViewController = (function (_super) {
            __extends(TimeClockManagerViewController, _super);
            function TimeClockManagerViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_4124") }) || this;
                _this.viewModel = new Commerce.ViewModels.TimeClockManagerViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            TimeClockManagerViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            TimeClockManagerViewController.prototype.setStoreFilter = function () {
                var storeSelectionHandler = new Commerce.CancelableSelectionHandler(function (store) {
                    var returnOptions = {
                        storeId: store.OrgUnitNumber
                    };
                    Commerce.ViewModelAdapter.collapseAndNavigate("TimeClockManagerView", returnOptions);
                }, function () {
                    Commerce.ViewModelAdapter.collapse("TimeClockManagerView");
                });
                var parameters = {
                    isForPickUp: false,
                    storeSelectionHandler: storeSelectionHandler
                };
                Commerce.ViewModelAdapter.navigate("PickUpInStoreView", parameters);
            };
            return TimeClockManagerViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.TimeClockManagerViewController = TimeClockManagerViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var TimeClockViewController = (function (_super) {
            __extends(TimeClockViewController, _super);
            function TimeClockViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_4082") }) || this;
                _this.viewModel = new Commerce.ViewModels.TimeClockViewModel(_this.createViewModelContext());
                return _this;
            }
            TimeClockViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            return TimeClockViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.TimeClockViewController = TimeClockViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var DatabaseConnectionStatusViewController = (function (_super) {
            __extends(DatabaseConnectionStatusViewController, _super);
            function DatabaseConnectionStatusViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_6600") }) || this;
                _this.isCommandEnable = ko.observable(false);
                _this.connectionButtonText = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.viewModel = new Commerce.ViewModels.DatabaseConnectionStatusViewModel(_this.createViewModelContext());
                _this.viewDownload = ko.observable(true);
                _this.updateUI();
                return _this;
            }
            DatabaseConnectionStatusViewController.prototype.toggleConnection = function () {
                var _this = this;
                this.viewModel.toggleConnection().done(function () {
                    _this.updateUI();
                }).fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            DatabaseConnectionStatusViewController.prototype.syncOfflineData = function () {
                this.viewModel.syncOfflineData().fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            DatabaseConnectionStatusViewController.prototype.showDownloadViewHandler = function () {
                this.viewDownload(true);
            };
            DatabaseConnectionStatusViewController.prototype.showUploadViewHandler = function () {
                this.viewDownload(false);
            };
            DatabaseConnectionStatusViewController.prototype.updateUI = function () {
                if (Commerce.Session.instance.connectionStatus === Commerce.Client.Entities.ConnectionStatusType.Online) {
                    this.connectionButtonText(Commerce.ViewModelAdapter.getResourceString("string_6640"));
                }
                else {
                    this.connectionButtonText(Commerce.ViewModelAdapter.getResourceString("string_6605"));
                }
            };
            return DatabaseConnectionStatusViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.DatabaseConnectionStatusViewController = DatabaseConnectionStatusViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ExtensionPackageDetailsViewController = (function (_super) {
            __extends(ExtensionPackageDetailsViewController, _super);
            function ExtensionPackageDetailsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_7444") }) || this;
                _this.viewModel = new Commerce.ViewModels.ExtensionPackageDetailsViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            ExtensionPackageDetailsViewController.prototype.showExtensionDetails = function () {
                if (!this.viewModel.isExtensionSelected()) {
                    return;
                }
                var extensionDetailsDialog = new Commerce.Controls.ExtensionDetailsDialog(this.viewModel.selectedExtensionDetailsViewModel().loadInfo);
                extensionDetailsDialog.show({});
            };
            return ExtensionPackageDetailsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ExtensionPackageDetailsViewController = ExtensionPackageDetailsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var SettingsViewController = (function (_super) {
            __extends(SettingsViewController, _super);
            function SettingsViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_7400") }) || this;
                var settingViewModelOptions = {
                    taskRecorder: Commerce.TaskRecorder.taskRecorder,
                    testRecorder: Commerce.TestRecorder.testRecorder
                };
                _this.viewModel = new Commerce.ViewModels.SettingsViewModel(_this.createViewModelContext(), settingViewModelOptions);
                _this.viewModel.setTutorial(Commerce.UI.Tutorial.instance);
                _this.viewModel.init();
                _this._windowResizeHandler = _this.viewModel.refreshWindowResolution.bind(_this.viewModel);
                return _this;
            }
            SettingsViewController.prototype.onShown = function () {
                Commerce.EventProxy.Instance.addWindowResizeHandler(this._element, this._windowResizeHandler);
            };
            SettingsViewController.prototype.onHidden = function () {
                Commerce.EventProxy.Instance.removeWindowResizeHandler(this._element, this._windowResizeHandler);
            };
            SettingsViewController.prototype.onDeveloperModeDisabled = function () {
                this.viewModel.isDeveloperModeEnabled(false);
            };
            return SettingsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.SettingsViewController = SettingsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var AllDiscountsViewController = (function (_super) {
            __extends(AllDiscountsViewController, _super);
            function AllDiscountsViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_30270") }) || this;
                _this.viewModel = new Commerce.ViewModels.AllDiscountsViewModel(_this.createViewModelContext());
                return _this;
            }
            AllDiscountsViewController.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
            };
            return AllDiscountsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.AllDiscountsViewController = AllDiscountsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var EmployeeClientBookViewController = (function (_super) {
            __extends(EmployeeClientBookViewController, _super);
            function EmployeeClientBookViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_6550") }) || this;
                _this.viewModel = new Commerce.ViewModels.EmployeeClientBookViewModel(_this.createViewModelContext());
                return _this;
            }
            return EmployeeClientBookViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.EmployeeClientBookViewController = EmployeeClientBookViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var StoreClientBooksViewController = (function (_super) {
            __extends(StoreClientBooksViewController, _super);
            function StoreClientBooksViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }, false) || this;
                _this.viewModel = new Commerce.ViewModels.StoreClientBooksViewModel(_this.createViewModelContext());
                return _this;
            }
            return StoreClientBooksViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.StoreClientBooksViewController = StoreClientBooksViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        var TaskManagementViewController = (function (_super) {
            __extends(TaskManagementViewController, _super);
            function TaskManagementViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringResourceManager.getString("string_7704") }) || this;
                _this.viewModel = new Commerce.ViewModels.TaskManagementViewModel(_this.createViewModelContext(), options);
                _this.viewModel.setClearSelectionCallback(function () {
                    _this._clearSelection();
                });
                return _this;
            }
            TaskManagementViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            TaskManagementViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            TaskManagementViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            TaskManagementViewController.prototype.posOperationClick = function (operationId) {
                var CORRELATION_ID = Commerce.LoggerHelper.getNewCorrelationId();
                Commerce.RetailLogger.posOperationForTaskLinkClick(operationId.toString(), CORRELATION_ID);
                var isNavigated = Commerce.Operations.DefaultButtonGridHandler.handleOperation(operationId, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, CORRELATION_ID);
                if (!isNavigated) {
                    var errors = [new Commerce.Proxy.Entities.Error("string_7767")];
                    Commerce.NotificationHandler.displayClientErrors(errors);
                }
                return isNavigated;
            };
            TaskManagementViewController.prototype._clearSelection = function () {
                var mytasksDatalistElement = document.getElementById(TaskManagementViewController.MYTASKS_LIST_VIEW_CONTAINER_NAME);
                var alltasksDatalistElement = document.getElementById(TaskManagementViewController.ALLTASKS_LIST_VIEW_CONTAINER_NAME);
                var overduetasksDatalistElement = document.getElementById(TaskManagementViewController.OVERDUETASKS_LIST_VIEW_CONTAINER_NAME);
                var tasklistsDatalistElement = document.getElementById(TaskManagementViewController.TASKLISTS_LIST_VIEW_CONTAINER_NAME);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(mytasksDatalistElement)) {
                    (mytasksDatalistElement.dataListViewModel).clearAll();
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(alltasksDatalistElement)) {
                    (alltasksDatalistElement.dataListViewModel).clearAll();
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(overduetasksDatalistElement)) {
                    (overduetasksDatalistElement.dataListViewModel).clearAll();
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(tasklistsDatalistElement)) {
                    (tasklistsDatalistElement.dataListViewModel).clearAll();
                }
            };
            TaskManagementViewController.MYTASKS_LIST_VIEW_CONTAINER_NAME = "MyTasksViewList";
            TaskManagementViewController.ALLTASKS_LIST_VIEW_CONTAINER_NAME = "AllTasksViewList";
            TaskManagementViewController.OVERDUETASKS_LIST_VIEW_CONTAINER_NAME = "OverDueTasksViewList";
            TaskManagementViewController.TASKLISTS_LIST_VIEW_CONTAINER_NAME = "ChecklistsViewList";
            return TaskManagementViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.TaskManagementViewController = TaskManagementViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        var HomeViewController = (function (_super) {
            __extends(HomeViewController, _super);
            function HomeViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                _this._searchView = "SearchView";
                _this._indeterminateWaitVisible = ko.observable(false);
                _this.viewModel = new Commerce.ViewModels.HomeViewModel(_this.createViewModelContext());
                _this.viewModel.isBusyWhen(ko.computed(function () { return _this._indeterminateWaitVisible(); }));
                _this.isBackNavigationEnabled = false;
                _this.backgroundImageEncodingURL = ko.computed(function () {
                    return "url(data:image/png;base64," + _this.viewModel.base64ImageData() + ")";
                }, _this);
                _this.backgroundImageEncodingSrc = ko.computed(function () {
                    return "data:image/png;base64," + _this.viewModel.base64ImageData();
                }, _this);
                return _this;
            }
            HomeViewController.prototype.onShown = function () {
                var _this = this;
                Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    if (!Commerce.StringExtensions.isNullOrWhitespace(barcode)) {
                        _this._navigateToSearchView(barcode);
                    }
                });
            };
            HomeViewController.prototype.onHidden = function () {
                Commerce.Peripherals.instance.barcodeScanner.disableAsync();
            };
            HomeViewController.prototype.keepAliveViewActivated = function (options) {
                if (Commerce.Session.instance.productCatalogStore.StoreType !== Commerce.Proxy.Entities.StoreButtonControlType.CurrentStore) {
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var setVirtualCatalogAsyncResult = this.viewModel.switchToCurrentStoreCatalog(correlationId);
                    this.handleAsyncResult(setVirtualCatalogAsyncResult);
                }
                Commerce.RetailLogger.viewsHomeViewIsVisible(Commerce.LoggerHelper.getFormattedCorrelationId(options));
            };
            HomeViewController.prototype.buttonGridClick = function (operationId, actionProperty, actionTitle) {
                var _this = this;
                var CORRELATION_ID = Commerce.LoggerHelper.getNewCorrelationId();
                Commerce.RetailLogger.viewsHomeTileClick(operationId.toString(), CORRELATION_ID);
                if (operationId === Commerce.Operations.RetailOperation.ViewOrderFulfillmentLines) {
                    Commerce.RetailLogger.fulfillmentViewNavigationStart(actionProperty, CORRELATION_ID);
                }
                switch (operationId) {
                    case Commerce.Operations.RetailOperation.AddAffiliation:
                        if (!Commerce.StringExtensions.isNullOrWhitespace(actionProperty)) {
                            var affiliationNames = actionProperty.split(";");
                            var options = { affiliationNames: affiliationNames, affiliations: [] };
                            Commerce.Operations.OperationsManager.instance.runOperation(operationId, options);
                        }
                        else {
                            this._indeterminateWaitVisible(false);
                            Commerce.ViewModelAdapter.navigate("CartView");
                        }
                        return true;
                    default:
                        var setIndeterminateWaitVisible = function (indeterminateWaitVisible) { _this._indeterminateWaitVisible(indeterminateWaitVisible); };
                        return Commerce.Operations.DefaultButtonGridHandler.handleOperation(operationId, actionProperty, actionTitle, CORRELATION_ID, setIndeterminateWaitVisible);
                }
            };
            HomeViewController.prototype.handleAsyncResult = function (asyncResult) {
                var _this = this;
                this._indeterminateWaitVisible(true);
                return asyncResult
                    .always(function () { _this._indeterminateWaitVisible(false); })
                    .fail(function (errors) { Commerce.NotificationHandler.displayClientErrors(errors); });
            };
            HomeViewController.prototype._navigateToSearchView = function (searchText) {
                var options = {
                    searchText: searchText,
                    searchEntity: Commerce.ViewModels.SearchViewSearchEntity.Product,
                    selectionMode: Commerce.ViewModels.SearchViewSelectionMode.None,
                    correlationId: Commerce.LoggerHelper.getNewCorrelationId()
                };
                Commerce.ViewModelAdapter.navigate(this._searchView, options);
            };
            return HomeViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.HomeViewController = HomeViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var HealthCheckViewController = (function (_super) {
            __extends(HealthCheckViewController, _super);
            function HealthCheckViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_30300") }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw new Error("Invalid options passed to the HealthCheckVew constructor: options cannot be null or undefined.");
                }
                _this.viewModel = new Commerce.ViewModels.HealthCheckViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            HealthCheckViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            HealthCheckViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            HealthCheckViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            return HealthCheckViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.HealthCheckViewController = HealthCheckViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var InventoryDocumentCreationViewController = (function (_super) {
            __extends(InventoryDocumentCreationViewController, _super);
            function InventoryDocumentCreationViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                var viewModelOptions = {
                    document: options.document,
                    selectFullOrderLinesCallback: _this._selectFullOrderLines.bind(_this),
                    selectedProduct: options.selectedProduct,
                    correlationIdForSelectedProduct: options.correlationIdForSelectedProduct,
                    selectedProductSearchText: options.selectedProductSearchText,
                };
                _this.viewModel = new Commerce.ViewModels.InventoryDocumentCreationViewModel(_this.createViewModelContext(), viewModelOptions);
                _this.title(_this.context.stringResourceManager.getString(_this.viewModel.isReceivingOperation() ? "string_12400" : "string_12500"));
                return _this;
            }
            InventoryDocumentCreationViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            InventoryDocumentCreationViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            InventoryDocumentCreationViewController.prototype.onShown = function () {
                var _this = this;
                Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    if (!Commerce.StringExtensions.isNullOrWhitespace(barcode)) {
                        _this.viewModel.onScanProductAsync(barcode);
                    }
                });
            };
            InventoryDocumentCreationViewController.prototype.onHidden = function () {
                Commerce.Peripherals.instance.barcodeScanner.disableAsync();
            };
            InventoryDocumentCreationViewController.prototype._selectFullOrderLines = function (lines) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._fullOrderDataListViewModel)) {
                    this._fullOrderDataListViewModel = document.getElementById("fullOrderDataList").dataListViewModel;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._fullOrderDataListViewModel)) {
                        return;
                    }
                }
                this._fullOrderDataListViewModel.selectItems(lines, function (left, right) { return left.LineId === right.LineId; });
            };
            return InventoryDocumentCreationViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.InventoryDocumentCreationViewController = InventoryDocumentCreationViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var InventoryDocumentListViewController = (function (_super) {
            __extends(InventoryDocumentListViewController, _super);
            function InventoryDocumentListViewController(context, options) {
                var _this = this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw Error("'options' is required for InventoryDocumentListView.");
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(options.operation)) {
                    throw Error("'options.operation' is required for InventoryDocumentListView.");
                }
                if (options.operation !== Commerce.Operations.RetailOperation.InboundInventory &&
                    options.operation !== Commerce.Operations.RetailOperation.OutboundInventory) {
                    throw Error("'options.operation' must be InboundInventory or OutboundInventory for InventoryDocumentListView.");
                }
                if (options.operation === Commerce.Operations.RetailOperation.InboundInventory) {
                    _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_12400") }) || this;
                }
                else {
                    _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_12500") }) || this;
                }
                _this.viewModel = new Commerce.ViewModels.InventoryDocumentListViewModel(_this.createViewModelContext(), options);
                _this.viewModel.setSelectedInventoryDocument = _this.setSelectedInventoryDocument.bind(_this);
                return _this;
            }
            InventoryDocumentListViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            InventoryDocumentListViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            InventoryDocumentListViewController.prototype.onShown = function () {
                return this.viewModel.onShown();
            };
            InventoryDocumentListViewController.prototype.setSelectedInventoryDocument = function (inventoryDocument) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._dataListViewModel)) {
                    this._dataListViewModel = document.getElementById("InventoryDocumentList").dataListViewModel;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._dataListViewModel)) {
                        return;
                    }
                }
                this._dataListViewModel.selectItems([inventoryDocument], function (left, right) {
                    return left.SourceDocument.DocumentId === right.SourceDocument.DocumentId &&
                        left.SourceDocument.DocumentTypeValue === right.SourceDocument.DocumentTypeValue;
                });
            };
            InventoryDocumentListViewController.prototype.switchDocumentStatusFilter = function (event) {
                var ACTIVE_TAB_INDEX = 0;
                var DRAFT_TAB_INDEX = 1;
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                var viewMode;
                if (event.detail.index === ACTIVE_TAB_INDEX) {
                    Commerce.RetailLogger.viewModelInventoryDocumentListViewSwitchToActiveTab(correlationId);
                    viewMode = Commerce.Proxy.Entities.InventoryInboundOutboundDocumentState.Active;
                }
                else if (event.detail.index === DRAFT_TAB_INDEX) {
                    Commerce.RetailLogger.viewModelInventoryDocumentListViewSwitchToDraftTab(correlationId);
                    viewMode = Commerce.Proxy.Entities.InventoryInboundOutboundDocumentState.Draft;
                }
                else {
                    Commerce.RetailLogger.viewModelInventoryDocumentListViewSwitchToCompleteTab(correlationId);
                    viewMode = Commerce.Proxy.Entities.InventoryInboundOutboundDocumentState.Complete;
                }
                this.viewModel.setDocumentFilter(viewMode);
            };
            return InventoryDocumentListViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.InventoryDocumentListViewController = InventoryDocumentListViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var InventoryDocumentSerialNumberManagementViewController = (function (_super) {
            __extends(InventoryDocumentSerialNumberManagementViewController, _super);
            function InventoryDocumentSerialNumberManagementViewController(context, options) {
                var _this = this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw Error("'options' is required for InventoryDocumentSerialNumberManagementView.");
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(options.document)) {
                    throw Error("'options.document' is required for InventoryDocumentSerialNumberManagementView.");
                }
                _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_12400") }) || this;
                _this.viewModel = new Commerce.ViewModels.InventoryDocumentSerialNumberManagementViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            InventoryDocumentSerialNumberManagementViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            InventoryDocumentSerialNumberManagementViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            InventoryDocumentSerialNumberManagementViewController.prototype.onShown = function () {
                var _this = this;
                Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    if (!Commerce.StringExtensions.isNullOrWhitespace(barcode)) {
                        _this.viewModel.onScanBarcodeAsync(barcode);
                    }
                });
            };
            InventoryDocumentSerialNumberManagementViewController.prototype.onHidden = function () {
                Commerce.Peripherals.instance.barcodeScanner.disableAsync();
            };
            return InventoryDocumentSerialNumberManagementViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.InventoryDocumentSerialNumberManagementViewController = InventoryDocumentSerialNumberManagementViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var InventoryDocumentShippingAndReceivingViewController = (function (_super) {
            __extends(InventoryDocumentShippingAndReceivingViewController, _super);
            function InventoryDocumentShippingAndReceivingViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw Error("'options' is required for InventoryDocumentShippingAndReceivingView.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.document)) {
                    throw Error("options.document' is required for InventoryDocumentShippingAndReceivingView.");
                }
                var viewModelOptions = {
                    document: options.document,
                    selectedProduct: options.selectedProduct,
                    correlationIdForSelectedProduct: options.correlationIdForSelectedProduct,
                    selectedProductSearchText: options.selectedProductSearchText,
                    initialUpdateNowLines: options.initialUpdateNowLines,
                    switchToFullOrderListCallback: _this._onSwitchToFullOrderList.bind(_this),
                    switchToUpdateNowListCallback: _this._onSwitchToUpdateNowList.bind(_this),
                    selectUpdateNowLinesCallback: _this._selectUpdateNowLines.bind(_this),
                    selectFullOrderLinesCallback: _this._selectFullOrderLines.bind(_this),
                };
                _this.viewModel = new Commerce.ViewModels.InventoryDocumentShippingAndReceivingViewModel(_this.createViewModelContext(), viewModelOptions);
                _this.title(_this.context.stringResourceManager.getString(_this.viewModel.isReceivingOperation() ? "string_12400" : "string_12500"));
                return _this;
            }
            InventoryDocumentShippingAndReceivingViewController.prototype.afterBind = function (element) {
                this._rootElement = element;
            };
            InventoryDocumentShippingAndReceivingViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            InventoryDocumentShippingAndReceivingViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            InventoryDocumentShippingAndReceivingViewController.prototype.onShown = function () {
                var _this = this;
                Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    if (!Commerce.StringExtensions.isNullOrWhitespace(barcode)) {
                        _this.viewModel.onScanProductAsync(barcode);
                    }
                });
                this.viewModel.reloadFullOrderLines();
            };
            InventoryDocumentShippingAndReceivingViewController.prototype.onHidden = function () {
                Commerce.Peripherals.instance.barcodeScanner.disableAsync();
            };
            InventoryDocumentShippingAndReceivingViewController.prototype._onSwitchToFullOrderList = function () {
                this.context.interaction.triggerEvent(this._rootElement, InventoryDocumentShippingAndReceivingViewController._activateFullOrderPivot);
            };
            InventoryDocumentShippingAndReceivingViewController.prototype._onSwitchToUpdateNowList = function () {
                this.context.interaction.triggerEvent(this._rootElement, InventoryDocumentShippingAndReceivingViewController._activateUpdateNowPivot);
            };
            InventoryDocumentShippingAndReceivingViewController.prototype._selectUpdateNowLines = function (lines) {
                var _this = this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._updateNowDataListViewModel)) {
                    this._updateNowDataListViewModel = document.getElementById("updateNowDataList").dataListViewModel;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._updateNowDataListViewModel)) {
                        return;
                    }
                }
                this._updateNowDataListViewModel.selectItems(lines, function (left, right) { return _this.viewModel.areDocumentLinesSameRecord(left, right); });
            };
            InventoryDocumentShippingAndReceivingViewController.prototype._selectFullOrderLines = function (lines) {
                var _this = this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._fullOrderDataListViewModel)) {
                    this._fullOrderDataListViewModel = document.getElementById("fullOrderDataList").dataListViewModel;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._fullOrderDataListViewModel)) {
                        return;
                    }
                }
                this._fullOrderDataListViewModel.selectItems(lines, function (left, right) { return _this.viewModel.areDocumentLinesSameRecord(left, right); });
            };
            InventoryDocumentShippingAndReceivingViewController._activateUpdateNowPivot = "activateUpdateNowPivot";
            InventoryDocumentShippingAndReceivingViewController._activateFullOrderPivot = "activateFullOrderPivot";
            return InventoryDocumentShippingAndReceivingViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.InventoryDocumentShippingAndReceivingViewController = InventoryDocumentShippingAndReceivingViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var InventoryDocumentValidationViewController = (function (_super) {
            __extends(InventoryDocumentValidationViewController, _super);
            function InventoryDocumentValidationViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw Error("'options' is required for InventoryDocumentValidationView.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.document)) {
                    throw Error("'options.document' is required for InventoryDocumentValidationView.");
                }
                var viewModelOptions = {
                    document: options.document,
                    summary: options.summary,
                };
                _this.viewModel = new Commerce.ViewModels.InventoryDocumentValidationViewModel(_this.createViewModelContext(), viewModelOptions);
                _this.title(_this.context.stringResourceManager.getString(_this.viewModel.title()));
                return _this;
            }
            InventoryDocumentValidationViewController.prototype.onNavigateBack = function () {
                return this.viewModel.onNavigateBack();
            };
            return InventoryDocumentValidationViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.InventoryDocumentValidationViewController = InventoryDocumentValidationViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ChangePasswordViewController = (function (_super) {
            __extends(ChangePasswordViewController, _super);
            function ChangePasswordViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY, header: { disable: true }, sideBar: { disable: true } }) || this;
                _this.viewModel = new Commerce.ViewModels.ChangePasswordViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            ChangePasswordViewController.prototype.onShown = function () {
                this.viewModel.clearPasswordFields();
            };
            return ChangePasswordViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ChangePasswordViewController = ChangePasswordViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var DeviceActivationProcessViewController = (function (_super) {
            __extends(DeviceActivationProcessViewController, _super);
            function DeviceActivationProcessViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY, disableLoader: true, header: { disable: true }, sideBar: { disable: true } }) || this;
                _this.appName = Commerce.Host.instance.application.getApplicationName();
                _this.activationParameters = options;
                _this.operatorId = Commerce.StringExtensions.EMPTY;
                _this.viewModel = new Commerce.ViewModels.DeviceActivationProcessViewModel(_this.createViewModelContext());
                _this.applicationLanguage = Commerce.ViewModelAdapter.getCurrentAppLanguage();
                if (!Commerce.ObjectExtensions.isNullOrUndefined(_this.activationParameters)) {
                    if (Commerce.ObjectExtensions.isString(options)) {
                        _this.activationParameters = _this.deserializeActivationParameters(options);
                    }
                    _this.viewModel.serviceUrl(_this.activationParameters.serverUrl);
                    _this.viewModel.deviceId(_this.activationParameters.deviceId);
                    _this.viewModel.registerId(_this.activationParameters.registerId);
                    _this.operatorId = _this.activationParameters.operatorId;
                    _this.viewModel.password(_this.activationParameters.password);
                    _this.viewModel.skipConnectivityOperation = _this.activationParameters.skipConnectivityOperation;
                    if (Commerce.Config.aadEnabled) {
                        var activationParamString = _this.serializeActivationParameters(_this.activationParameters);
                        Commerce.ApplicationStorage.setItem(Commerce.ApplicationStorageIDs.ACTIVATION_PAGE_PARAMETERS_KEY, activationParamString);
                    }
                }
                _this.progressBarValue = ko.computed(function () {
                    if (Commerce.NumberExtensions.isNullOrZero(_this.viewModel.totalOperationSteps())) {
                        return 0;
                    }
                    return (_this.viewModel.currentOperationStep() - 1) / _this.viewModel.totalOperationSteps();
                }, _this);
                _this.progressMessage = ko.computed(function () {
                    if (Commerce.NumberExtensions.isNullOrZero(_this.viewModel.currentOperationStep()) ||
                        Commerce.NumberExtensions.isNullOrZero(_this.viewModel.totalOperationSteps()) ||
                        Commerce.ObjectExtensions.isNullOrUndefined(_this.viewModel.currentActivationOperation)) {
                        return Commerce.StringExtensions.EMPTY;
                    }
                    var statusName = _this.viewModel.currentActivationOperation.processingStatusName();
                    if (_this.viewModel.currentOperationStep() === _this.viewModel.totalOperationSteps()) {
                        statusName = Commerce.ViewModelAdapter.getResourceString("string_8071");
                    }
                    _this.updateTextTranslations();
                    return Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_8040"), _this.viewModel.currentOperationStep(), _this.viewModel.totalOperationSteps(), statusName);
                }, _this);
                _this.errorHeaderMessage = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.errorMessage = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.errorDetails = ko.observableArray([]);
                _this.clientErrorMessage = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.footerMessage = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.headerDeviceId = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.headerRegisterNumber = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.continueLabel = ko.observable(Commerce.ViewModelAdapter.getResourceString("string_8074"));
                _this.getStartedMessage = ko.observable(Commerce.ViewModelAdapter.getResourceString(DeviceActivationProcessViewController.getStartedResourceStr));
                _this.deviceActivatedMessage = ko.observable(Commerce.ViewModelAdapter.getResourceString(DeviceActivationProcessViewController.deviceActivatedResourceStr));
                _this.controllerState = ko.observable(Commerce.Proxy.Entities.DeviceActivationControllerState.Processing);
                _this.appTitle = ko.observable(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString(DeviceActivationProcessViewController.appTitleResourceStrFormat), _this.appName));
                return _this;
            }
            DeviceActivationProcessViewController.prototype.onShown = function () {
                this.viewModel.currentActivationOperation = null;
                this.activateDevice();
            };
            DeviceActivationProcessViewController.prototype.activateDevice = function () {
                var _this = this;
                this.controllerState(Commerce.Proxy.Entities.DeviceActivationControllerState.Processing);
                this.viewModel.activateDeviceAsync(this.operatorId)
                    .done(function () {
                    _this.controllerState(Commerce.Proxy.Entities.DeviceActivationControllerState.Succeeded);
                })
                    .fail(function (errors) {
                    if (Commerce.Config.aadEnabled) {
                        Commerce.RetailLogger.viewsCloudDeviceActivationViewActivationFailed();
                    }
                    var errorDetails = Commerce.ErrorHelper.resolveError(errors[0].ErrorCode);
                    var errorMessage = Commerce.ErrorHelper.formatErrorMessage(errors[0]);
                    _this.errorHeaderMessage(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_8039"), _this.viewModel.currentOperationStep(), _this.viewModel.totalOperationSteps(), _this.viewModel.currentActivationOperation.errorStatusName()));
                    _this.clientErrorMessage(errorDetails.clientErrorCode);
                    _this.errorMessage(errorMessage);
                    var localizedMessageDetails = errorDetails.messageDetailsResource;
                    if (Commerce.ArrayExtensions.hasElements(localizedMessageDetails)) {
                        for (var i = 0; i < localizedMessageDetails.length; i++) {
                            localizedMessageDetails[i] = Commerce.ViewModelAdapter.getResourceString(localizedMessageDetails[i]);
                        }
                    }
                    _this.errorDetails(localizedMessageDetails);
                    if (_this.viewModel.currentActivationOperation instanceof Commerce.Operations.LoadExtensionPackagesOperation) {
                        _this._displayExtensionsLoadingFailure(errors[0], _this.viewModel.currentActivationOperation);
                    }
                    else {
                        var forceActivate = Commerce.ErrorTypeEnum.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_ATTEMPTTOACTIVATEFROMDIFFERENTPHYSICALDEVICE.serverErrorCode
                            === errorDetails.serverErrorCode;
                        _this.setErrorDetailsMessage(forceActivate);
                        _this.viewModel.forceActivate = forceActivate;
                    }
                    _this.controllerState(Commerce.Proxy.Entities.DeviceActivationControllerState.Error);
                });
            };
            DeviceActivationProcessViewController.prototype.navigateToActivationPage = function () {
                Commerce.ViewModelAdapter.navigate("DeviceActivationView", this.activationParameters);
            };
            DeviceActivationProcessViewController.prototype.launch = function () {
                this.viewModel.launchAsync(this.operatorId);
            };
            DeviceActivationProcessViewController.prototype.updateTextTranslations = function () {
                var currentLanguage = Commerce.ViewModelAdapter.getCurrentAppLanguage();
                if (!Commerce.StringExtensions.isNullOrWhitespace(currentLanguage) && currentLanguage !== this.applicationLanguage) {
                    this.appTitle(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString(DeviceActivationProcessViewController.appTitleResourceStrFormat), this.appName));
                    this.getStartedMessage(Commerce.ViewModelAdapter.getResourceString(DeviceActivationProcessViewController.getStartedResourceStr));
                    this.deviceActivatedMessage(Commerce.ViewModelAdapter.getResourceString(DeviceActivationProcessViewController.deviceActivatedResourceStr));
                }
            };
            DeviceActivationProcessViewController.prototype.serializeActivationParameters = function (activationParameters) {
                var param = activationParameters.serverUrl + ";" +
                    activationParameters.deviceId + ";" +
                    activationParameters.registerId + ";" +
                    activationParameters.operatorId + ";" +
                    activationParameters.password + ";" +
                    activationParameters.skipConnectivityOperation + ";";
                return param;
            };
            DeviceActivationProcessViewController.prototype.deserializeActivationParameters = function (param) {
                var parameters = param.split(";");
                var activationParameters = {
                    serverUrl: parameters[0],
                    deviceId: parameters[1],
                    registerId: parameters[2],
                    operatorId: parameters[3],
                    password: parameters[4],
                    skipConnectivityOperation: "true" === parameters[5]
                };
                return activationParameters;
            };
            DeviceActivationProcessViewController.prototype.setErrorDetailsMessage = function (isErrorFromActivationAttemptFromDifferentDevice) {
                if (isErrorFromActivationAttemptFromDifferentDevice) {
                    this.errorHeaderMessage(Commerce.ViewModelAdapter.getResourceString("string_1443"));
                    this.headerDeviceId(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_1445"), this.viewModel.deviceId()));
                    this.headerRegisterNumber(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_1446"), this.viewModel.registerId()));
                    this.footerMessage(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_1444"), this.appName));
                    this.continueLabel(Commerce.ViewModelAdapter.getResourceString("string_1447"));
                }
                else {
                    this.headerDeviceId(Commerce.StringExtensions.EMPTY);
                    this.headerRegisterNumber(Commerce.StringExtensions.EMPTY);
                    this.footerMessage(Commerce.ViewModelAdapter.getResourceString("string_8072"));
                    this.continueLabel(Commerce.ViewModelAdapter.getResourceString("string_8074"));
                }
            };
            DeviceActivationProcessViewController.prototype._displayExtensionsLoadingFailure = function (error, currentOperation) {
                this.headerDeviceId(Commerce.StringExtensions.EMPTY);
                this.headerRegisterNumber(Commerce.StringExtensions.EMPTY);
                if (currentOperation.isErrorCodeSkippable(error.ErrorCode)) {
                    this.footerMessage(Commerce.ViewModelAdapter.getResourceString("string_8151"));
                    this.continueLabel(Commerce.ViewModelAdapter.getResourceString("string_1447"));
                    this.viewModel.setSkipExtensionsLoadingErrorCode(error.ErrorCode);
                }
                else {
                    this.footerMessage(Commerce.ViewModelAdapter.getResourceString("string_8072"));
                    this.continueLabel(Commerce.ViewModelAdapter.getResourceString("string_8074"));
                }
            };
            DeviceActivationProcessViewController.appTitleResourceStrFormat = "string_8000";
            DeviceActivationProcessViewController.getStartedResourceStr = "string_8026";
            DeviceActivationProcessViewController.deviceActivatedResourceStr = "string_8025";
            return DeviceActivationProcessViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.DeviceActivationProcessViewController = DeviceActivationProcessViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var DeviceActivationViewController = (function (_super) {
            __extends(DeviceActivationViewController, _super);
            function DeviceActivationViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY, header: { disable: true }, sideBar: { disable: true } }) || this;
                _this.viewModel = new Commerce.ViewModels.DeviceActivationViewModel(_this.createViewModelContext());
                _this.operatorId = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.retryActivation = false;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    _this.retryActivation = true;
                    _this.viewModel.serviceUrl(options.serverUrl);
                    _this.viewModel.deviceId(options.deviceId);
                    _this.viewModel.registerId(options.registerId);
                    _this.operatorId(options.operatorId);
                    _this.viewModel.password(options.password);
                }
                _this.showServerUrl = ko.computed(function () {
                    return Commerce.StringExtensions.isNullOrWhitespace(Commerce.Config.onlineDatabase);
                }, _this);
                _this.showGuidedActivationNavigation = ko.computed(function () {
                    return Commerce.Config.aadEnabled;
                }, _this);
                _this.disableActivateButton = ko.computed(function () {
                    return !_this.canActivate();
                }, _this);
                _this.appTitle = ko.observable(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_8000"), Commerce.Host.instance.application.getApplicationName()));
                if (Commerce.Config.persistentRetailServerEnabled) {
                    _this.viewModel.serviceUrl(Commerce.Config.persistentRetailServerUrl);
                }
                return _this;
            }
            DeviceActivationViewController.prototype.onShown = function () {
                if (!this.retryActivation) {
                    this.operatorId(Commerce.StringExtensions.EMPTY);
                    this.viewModel.password(Commerce.StringExtensions.EMPTY);
                }
                Commerce.ApplicationStorage.setItem(Commerce.ApplicationStorageIDs.CURRENT_ACTIVATION_PROCESS, Commerce.Proxy.Entities.DeviceActivationType.ManualActivation.toString());
            };
            DeviceActivationViewController.prototype.ActivateDeviceHandler = function () {
                if (this.canActivate()) {
                    this.retryActivation = false;
                    var parameters = {
                        serverUrl: this.viewModel.serviceUrl(),
                        deviceId: this.viewModel.deviceId(),
                        registerId: this.viewModel.registerId(),
                        operatorId: this.operatorId(),
                        password: this.viewModel.password()
                    };
                    Commerce.ViewModelAdapter.navigate(Commerce.Helpers.DeviceActivationHelper.DEVICE_ACTIVATION_PROCESS_VIEW_NAME, parameters);
                }
            };
            DeviceActivationViewController.prototype.navigateToGuidedActivation = function () {
                Commerce.Config.retailServerUrl = this.viewModel.serviceUrl();
                Commerce.ViewModelAdapter.navigate(Commerce.Helpers.DeviceActivationHelper.GUIDED_ACTIVATION_VIEW_NAME);
            };
            DeviceActivationViewController.prototype.canActivate = function () {
                return Commerce.Helpers.DeviceActivationHelper.isActivationPermitted(this.viewModel.serviceUrl(), this.operatorId(), this.viewModel.password());
            };
            return DeviceActivationViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.DeviceActivationViewController = DeviceActivationViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ExtendedLogonViewController = (function (_super) {
            __extends(ExtendedLogonViewController, _super);
            function ExtendedLogonViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_11000") }) || this;
                _this.viewModel = new Commerce.ViewModels.ExtendedLogOnViewModel(_this.createViewModelContext(), Commerce.Model.Managers.Factory, Commerce.NotificationHandler.displayClientErrors, Commerce.ViewModelAdapter);
                return _this;
            }
            ExtendedLogonViewController.prototype.employeeSelectionChanged = function (employees) {
                this.viewModel.selectedEmployee(employees[0]);
            };
            return ExtendedLogonViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ExtendedLogonViewController = ExtendedLogonViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var GetStartedViewController = (function (_super) {
            __extends(GetStartedViewController, _super);
            function GetStartedViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY, header: { disable: true }, sideBar: { disable: true } }) || this;
                _this.viewModel = new Commerce.ViewModels.GetStartedViewModel(_this.createViewModelContext());
                _this.appTitle = ko.observable(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_8000"), Commerce.Host.instance.application.getApplicationName()));
                return _this;
            }
            GetStartedViewController.prototype.navigateToActivationPage = function () {
                Commerce.UserActivityTracker.setupServerConfiguredAutoExitTimeout();
                Commerce.Helpers.DeviceActivationHelper.navigateToActivationPage();
            };
            return GetStartedViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.GetStartedViewController = GetStartedViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var Entities = Commerce.Proxy.Entities;
        var GuidedActivationViewController = (function (_super) {
            __extends(GuidedActivationViewController, _super);
            function GuidedActivationViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY, disableLoader: true, header: { disable: true }, sideBar: { disable: true } }) || this;
                _this.viewModel = new Commerce.ViewModels.GuidedActivationViewModel(_this.createViewModelContext());
                _this.activationViewModel = new Commerce.ViewModels.ActivationViewModel(_this.createViewModelContext());
                _this.retryActivation = false;
                _this.operatorId = Commerce.StringExtensions.EMPTY;
                _this.storeOptions = ko.observableArray([]);
                _this.registerAndDeviceOptions = ko.observableArray([]);
                _this.deviceOptions = ko.observableArray([]);
                _this.selectedStore = ko.observable(null);
                _this.selectedRegisterAndDevice = ko.observable(null);
                _this.selectedDevice = ko.observable(null);
                _this.newDeviceId = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.isAutoDeviceIdChecked = ko.observable(false);
                _this.skipConnectivityOperation = false;
                _this.showStores = ko.observable(false);
                _this.showRetrievingStores = ko.observable(false);
                _this.showRetrievingRegistersAndDevices = ko.observable(false);
                _this.showRetrievingEnvironmentConfiguration = ko.observable(false);
                _this.showRegistersAndDevices = ko.observable(false);
                _this.showHealthCheckStatus = ko.observable(false);
                _this.addNewDeviceSelected = ko.observable(false);
                _this.showUserAuthenticating = ko.observable(false);
                _this.errorHeaderMessage = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.errorMessage = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.errorDetails = ko.observableArray([]);
                _this.clientErrorMessage = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.databaseStatusStr = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.rtsStatusStr = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.rtsIconStatus = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.databaseIconStatus = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.footerMessage = ko.observable(Commerce.ViewModelAdapter.getResourceString("string_8072"));
                _this.previousLabel = ko.observable(Commerce.ViewModelAdapter.getResourceString("string_1449"));
                _this.continueLabel = ko.observable(Commerce.ViewModelAdapter.getResourceString("string_8074"));
                _this.isCheckInProgress = ko.observable(false);
                _this.showErrorControl = ko.observable(false);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    _this.retryActivation = true;
                    _this.viewModel.serviceUrl(options.serverUrl);
                    _this.viewModel.deviceId(options.deviceId);
                    _this.viewModel.registerId(options.registerId);
                    _this.operatorId = options.operatorId;
                    _this.viewModel.password(options.password);
                    _this._errorsToShow = options.errors;
                }
                _this.activationViewModel.dbConnectivityStatus.subscribe(function (newValue) {
                    _this.setConnectionStatusMessage(_this.databaseIconStatus, "string_8090", _this.databaseStatusStr, newValue);
                });
                _this.activationViewModel.rtsConnectivityStatus.subscribe(function (newValue) {
                    _this.setConnectionStatusMessage(_this.rtsIconStatus, "string_8091", _this.rtsStatusStr, newValue);
                });
                _this.showSelectedStore = ko.computed(function () {
                    return _this.showRetrievingRegistersAndDevices() || _this.showRegistersAndDevices();
                }, _this);
                _this.showDeviceSelector = ko.computed(function () {
                    return !Commerce.ObjectExtensions.isNullOrUndefined(_this.selectedRegisterAndDevice())
                        && Commerce.StringExtensions.isNullOrWhitespace(_this.selectedRegisterAndDevice().DeviceNumber)
                        && !_this.showDeviceCreator();
                }, _this);
                _this.showDeviceCreator = ko.computed(function () {
                    return _this.addNewDeviceSelected()
                        && !Commerce.ObjectExtensions.isNullOrUndefined(_this.selectedRegisterAndDevice())
                        && Commerce.StringExtensions.isNullOrWhitespace(_this.selectedRegisterAndDevice().DeviceNumber);
                }, _this);
                _this.showNextButton = ko.computed(function () {
                    return (!_this.showRetrievingStores() || _this.showStores())
                        && !_this.showRetrievingRegistersAndDevices()
                        && !_this.showRegistersAndDevices()
                        && !_this.showUserAuthenticating()
                        && !_this.showRetrievingEnvironmentConfiguration();
                }, _this);
                _this.showStartButton = ko.computed(function () {
                    return _this.showRetrievingStores()
                        || _this.showStores()
                        || _this.showUserAuthenticating()
                        || _this.showRetrievingEnvironmentConfiguration();
                }, _this);
                _this.showServerUrlInput = ko.computed(function () {
                    var serverUrl = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.RETAIL_SERVER_URL);
                    return (Commerce.StringExtensions.isNullOrWhitespace(serverUrl) && !_this.showStartButton());
                }, _this);
                _this.showServerUrlText = ko.computed(function () {
                    return !_this.showServerUrlInput();
                }, _this);
                _this.showServerUrl = ko.computed(function () {
                    return !(_this.showRegistersAndDevices()
                        || _this.showRetrievingRegistersAndDevices()
                        || _this.showUserAuthenticating()
                        || _this.showRetrievingEnvironmentConfiguration());
                }, _this);
                _this.disableNextButton = ko.computed(function () {
                    return (!_this.showStartButton() && !Commerce.Core.RegularExpressionValidations.validateUrl(_this.viewModel.serviceUrl()))
                        || (_this.showStores() && Commerce.ObjectExtensions.isNullOrUndefined(_this.selectedStore()))
                        || (_this.showRegistersAndDevices() && Commerce.ObjectExtensions.isNullOrUndefined(_this.selectedRegisterAndDevice()));
                }, _this);
                _this.disableActivateButton = ko.computed(function () {
                    return (_this.showRegistersAndDevices() && Commerce.ObjectExtensions.isNullOrUndefined(_this.selectedRegisterAndDevice()))
                        || (_this.showDeviceSelector() && Commerce.ObjectExtensions.isNullOrUndefined(_this.selectedDevice()))
                        || (_this.showDeviceCreator() && (Commerce.StringExtensions.isNullOrWhitespace(_this.newDeviceId()) && !_this.isAutoDeviceIdChecked()));
                }, _this);
                _this.disableHealthCheckButton = ko.computed(function () {
                    return !Commerce.Core.RegularExpressionValidations.validateUrl(_this.viewModel.serviceUrl());
                });
                _this.appTitle = ko.observable(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_8000"), Commerce.Host.instance.application.getApplicationName()));
                if (Commerce.Config.persistentRetailServerEnabled) {
                    _this.viewModel.serviceUrl(Commerce.Config.persistentRetailServerUrl);
                }
                return _this;
            }
            GuidedActivationViewController.getActivationStatusStrings = function (statusNumber) {
                var statusString = Commerce.StringExtensions.EMPTY;
                switch (statusNumber) {
                    case Commerce.Proxy.Entities.DeviceActivationStatus.Pending:
                        statusString = Commerce.ViewModelAdapter.getResourceString("string_1468");
                        break;
                    case Commerce.Proxy.Entities.DeviceActivationStatus.Activated:
                        statusString = Commerce.ViewModelAdapter.getResourceString("string_1469");
                        break;
                    case Commerce.Proxy.Entities.DeviceActivationStatus.Deactivated:
                        statusString = Commerce.ViewModelAdapter.getResourceString("string_1470");
                        break;
                    case Commerce.Proxy.Entities.DeviceActivationStatus.Disabled:
                        statusString = Commerce.ViewModelAdapter.getResourceString("string_1471");
                        break;
                    case Commerce.Proxy.Entities.DeviceActivationStatus.None:
                        statusString = Commerce.ViewModelAdapter.getResourceString("string_1472");
                        break;
                }
                return statusString;
            };
            GuidedActivationViewController.prototype.onShown = function () {
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                if (!this.retryActivation) {
                    this.operatorId = Commerce.StringExtensions.EMPTY;
                    this.viewModel.password(Commerce.StringExtensions.EMPTY);
                }
                Commerce.ApplicationStorage.setItem(Commerce.ApplicationStorageIDs.CURRENT_ACTIVATION_PROCESS, Entities.DeviceActivationType.GuidedActivation.toString());
                if (Commerce.ArrayExtensions.hasElements(this._errorsToShow)) {
                    Commerce.NotificationHandler.displayClientErrors(this._errorsToShow);
                }
                else {
                    this.authenticateAndRetrieveStores(correlationId);
                }
            };
            GuidedActivationViewController.prototype.activateDeviceHandler = function () {
                this.viewModel.registerId(this.selectedRegisterAndDevice().TerminalId);
                if (!Commerce.StringExtensions.isNullOrWhitespace(this.selectedRegisterAndDevice().DeviceNumber)) {
                    this.viewModel.deviceId(this.selectedRegisterAndDevice().DeviceNumber);
                }
                else if (!Commerce.ObjectExtensions.isNullOrUndefined(this.selectedDevice()) && !this.showDeviceCreator()) {
                    this.viewModel.deviceId(this.selectedDevice().DeviceNumber);
                }
                else if (!this.isAutoDeviceIdChecked() && !Commerce.StringExtensions.isNullOrWhitespace(this.newDeviceId())) {
                    this.viewModel.deviceId(this.newDeviceId());
                }
                else {
                    this.viewModel.deviceId(Commerce.StringExtensions.EMPTY);
                }
                if (this.canActivate()) {
                    this.retryActivation = false;
                    var parameters_1 = {
                        serverUrl: this.viewModel.serviceUrl(),
                        deviceId: this.viewModel.deviceId(),
                        registerId: this.viewModel.registerId(),
                        operatorId: this.operatorId,
                        password: this.viewModel.password(),
                        skipConnectivityOperation: this.skipConnectivityOperation
                    };
                    this.authenticateUser().done(function () {
                        Commerce.ApplicationStorage.setItem(Commerce.ApplicationStorageIDs.CURRENT_ACTIVATION_PROCESS, Entities.DeviceActivationType.ManualActivation.toString());
                        Commerce.ViewModelAdapter.navigate(Commerce.Helpers.DeviceActivationHelper.DEVICE_ACTIVATION_PROCESS_VIEW_NAME, parameters_1);
                    });
                }
            };
            GuidedActivationViewController.prototype.pingHealthCheck = function () {
                this.showHealthCheckStatus(true);
                this.activationViewModel.pingHealthCheck(this.viewModel.serviceUrl());
            };
            GuidedActivationViewController.prototype.nextHandler = function () {
                var _this = this;
                this.showErrorControl(false);
                this.resetHealthCheckStatus();
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                if (this.showServerUrlInput() || !Commerce.Utilities.LogonHelper.isLoggedOn()) {
                    this.viewModel.updateServerUrl().done(function () {
                        _this.authenticateAndRetrieveStores(correlationId);
                    });
                }
                else if (this.showRetrievingStores()) {
                    this.authenticateAndRetrieveStores(correlationId);
                }
                else if (this.showStores() && !Commerce.ObjectExtensions.isNullOrUndefined(this.selectedStore())) {
                    this.showRetrievingRegistersAndDevices(true);
                    this.activationViewModel.getTerminalInfoAsync(this.selectedStore().OrgUnitNumber, Commerce.Host.instance.application.getApplicationType())
                        .done(function (terminals) {
                        _this.registerAndDeviceOptions(terminals);
                        _this.activationViewModel.getAvailableDevicesAsync()
                            .done(function (devices) {
                            _this.deviceOptions(devices);
                            _this.showRegistersAndDevices(true);
                            _this.showRetrievingRegistersAndDevices(false);
                        }).fail(function (errors) {
                            _this.displayErrorControl(errors, Commerce.ViewModelAdapter.getResourceString("string_1467"));
                        });
                    }).fail(function (errors) {
                        _this.displayErrorControl(errors, Commerce.ViewModelAdapter.getResourceString("string_1466"));
                    });
                }
            };
            GuidedActivationViewController.prototype.startOverHandler = function () {
                this.viewModel.startOverHandlerAsync();
            };
            GuidedActivationViewController.prototype.addNewDeviceHandler = function () {
                this.addNewDeviceSelected(true);
            };
            GuidedActivationViewController.prototype.navigateToManualActivation = function () {
                Commerce.Config.retailServerUrl = this.viewModel.serviceUrl();
                Commerce.ViewModelAdapter.navigate(Commerce.Helpers.DeviceActivationHelper.DEVICE_ACTIVATION_VIEW_NAME);
            };
            GuidedActivationViewController.prototype.getSelectedStoreDisplayName = function () {
                var storeName = Commerce.StringExtensions.EMPTY;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.selectedStore())) {
                    storeName = this.selectedStore().OrgUnitName;
                }
                return storeName;
            };
            GuidedActivationViewController.prototype.authenticateAndRetrieveStores = function (correlationId) {
                var _this = this;
                var retailServerUrl = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.RETAIL_SERVER_URL);
                if (!Commerce.StringExtensions.isNullOrWhitespace(retailServerUrl)) {
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        return Commerce.Model.Managers.Factory.updateServerUri(retailServerUrl);
                    });
                    if (!Commerce.Utilities.LogonHelper.isLoggedOn()) {
                        asyncQueue.enqueue(function () {
                            return _this.configureEnvironment(correlationId);
                        }).enqueue(function () {
                            return _this.authenticateUser();
                        });
                    }
                    asyncQueue.enqueue(function () {
                        _this.showRetrievingStores(true);
                        return _this.activationViewModel.getEmployeeStoresAsync()
                            .done(function (stores) {
                            _this.storeOptions(stores);
                            _this.showStores(true);
                            _this.showRetrievingStores(false);
                            _this.skipConnectivityOperation = true;
                        }).fail(function (errors) {
                            _this.displayErrorControl(errors, Commerce.ViewModelAdapter.getResourceString("string_1465"));
                        });
                    });
                    asyncQueue.run();
                }
            };
            GuidedActivationViewController.prototype.canActivate = function () {
                return Commerce.Helpers.DeviceActivationHelper.isActivationPermitted(this.viewModel.serviceUrl(), this.operatorId, this.viewModel.password());
            };
            GuidedActivationViewController.prototype.authenticateUser = function () {
                var _this = this;
                this.showUserAuthenticating(true);
                return this.viewModel.authenticateUser().fail(function (errors) {
                    _this.displayErrorControl(errors, Commerce.ViewModelAdapter.getResourceString("string_1477"));
                }).always(function () {
                    _this.showUserAuthenticating(false);
                });
            };
            GuidedActivationViewController.prototype.configureEnvironment = function (correlationId) {
                var _this = this;
                var asyncQueue = new Commerce.AsyncQueue();
                this.showRetrievingEnvironmentConfiguration(true);
                asyncQueue.enqueue(function () {
                    return _this.activationViewModel.checkServerConnectivityAsync(Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.RETAIL_SERVER_URL));
                }).enqueue(function () {
                    var request = new Commerce.StoreOperations.GetEnvironmentConfigurationServiceRequest(correlationId);
                    return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request)))
                        .done(function (result) {
                        if (result.canceled) {
                            return;
                        }
                        Commerce.InstrumentationHelper.setEnvironmentInfo(result.data.configuration);
                        Commerce.ApplicationStorage.setItem(Commerce.ApplicationStorageIDs.RETAILSERVER_TENANT_ID, result.data.configuration.TenantId);
                        _this.showRetrievingEnvironmentConfiguration(false);
                    });
                });
                return asyncQueue.run().fail(function (errors) {
                    _this.displayErrorControl(errors, Commerce.ViewModelAdapter.getResourceString("string_8087"));
                });
            };
            GuidedActivationViewController.prototype.displayErrorControl = function (errors, headerMessage) {
                if (Commerce.Config.aadEnabled) {
                    Commerce.RetailLogger.viewsCloudDeviceActivationViewActivationFailed();
                }
                var errorDetails = Commerce.ErrorHelper.resolveError(errors[0].ErrorCode);
                var errorMessage = Commerce.ErrorHelper.formatErrorMessage(errors[0]);
                this.errorHeaderMessage(headerMessage);
                this.clientErrorMessage(errorDetails.clientErrorCode);
                this.errorMessage(errorMessage);
                var localizedMessageDetails = errorDetails.messageDetailsResource;
                if (Commerce.ArrayExtensions.hasElements(localizedMessageDetails)) {
                    for (var i = 0; i < localizedMessageDetails.length; i++) {
                        localizedMessageDetails[i] = Commerce.ViewModelAdapter.getResourceString(localizedMessageDetails[i]);
                    }
                }
                this.errorDetails(localizedMessageDetails);
                this.showErrorControl(true);
            };
            GuidedActivationViewController.prototype.setConnectionStatusMessage = function (observableIcon, connectionTypeResource, observable, newStatus) {
                var connectionStatus;
                var iconClass = Commerce.StringExtensions.EMPTY;
                var cssProgressClassName = "iconProgressLoopInner";
                var cssSucceededClassName = "iconCompleted";
                var cssErrorClassName = "iconError";
                var cssUnknownClassName = "iconWarning";
                this.isCheckInProgress(false);
                switch (newStatus) {
                    case Entities.HealthCheckConnectivityStatus.Connecting:
                        this.isCheckInProgress(true);
                        connectionStatus = Commerce.ViewModelAdapter.getResourceString("string_8094");
                        iconClass = cssProgressClassName;
                        break;
                    case Entities.HealthCheckConnectivityStatus.Succeeded:
                        connectionStatus = Commerce.ViewModelAdapter.getResourceString("string_8092");
                        iconClass = cssSucceededClassName;
                        break;
                    case Entities.HealthCheckConnectivityStatus.Failed:
                        connectionStatus = Commerce.ViewModelAdapter.getResourceString("string_8093");
                        iconClass = cssErrorClassName;
                        break;
                    case Entities.HealthCheckConnectivityStatus.Unknown:
                        connectionStatus = Commerce.ViewModelAdapter.getResourceString("string_8096");
                        iconClass = cssUnknownClassName;
                        break;
                    default:
                        connectionStatus = Commerce.StringExtensions.EMPTY;
                        break;
                }
                var template = Commerce.ViewModelAdapter.getResourceString("string_8088");
                var localizedMessage = Commerce.StringExtensions.format(template, Commerce.ViewModelAdapter.getResourceString(connectionTypeResource), connectionStatus);
                observable(localizedMessage);
                observableIcon(iconClass);
            };
            GuidedActivationViewController.prototype.resetHealthCheckStatus = function () {
                this.showHealthCheckStatus(false);
                this.activationViewModel.setAllHealthCheckStatuses(Entities.HealthCheckConnectivityStatus.None);
            };
            return GuidedActivationViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.GuidedActivationViewController = GuidedActivationViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var LockRegisterViewController = (function (_super) {
            __extends(LockRegisterViewController, _super);
            function LockRegisterViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY, header: { disable: true }, sideBar: { disable: true } }) || this;
                _this.viewModel = new Commerce.ViewModels.LoginViewModel(_this.createViewModelContext());
                _this.viewModel.operatorId = ko.observable(options.OperatorId);
                _this.viewModel.password(Commerce.StringExtensions.EMPTY);
                _this.numpadElement = ko.observable(null);
                _this._isPortraitOrientation = ko.observable(false);
                _this.isBackNavigationEnabled = false;
                _this.userImageOrInitialsOptions = {
                    name: Commerce.StringExtensions.EMPTY,
                    picture: Commerce.StringExtensions.EMPTY
                };
                _this.showLogoInside = ko.computed(function () {
                    return _this.viewModel.isLeftLayout() || _this.viewModel.isRightLayout();
                }, _this);
                var deviceConfiguration = Commerce.ApplicationContext.Instance.deviceConfiguration;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(deviceConfiguration)) {
                    if (deviceConfiguration.ShowStaffListAtLogOn) {
                        var operators = _this.viewModel.operatorList;
                        var operator = Commerce.ArrayExtensions.firstOrUndefined(operators, function (operator) { return operator.StaffId === _this.viewModel.operatorId(); });
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(operator)) {
                            _this.userImageOrInitialsOptions = {
                                name: Commerce.EmployeeHelper.getName(operator),
                                picture: Commerce.EmployeeHelper.getPicture(operator, Commerce.Session.instance.connectionStatus)
                            };
                        }
                    }
                }
                _this.numpadInputOptions = [];
                if (_this.viewModel.showNumPad()) {
                    _this.numpadInputOptions.push({
                        inputType: Commerce.Controls.NumPad.MultipleInputNumPadInputType.Password,
                        inputId: LockRegisterViewController._passwordElementId,
                        labelResourceId: "string_503",
                        validator: {
                            maxLength: 30
                        },
                        sensitiveDataFor: "lockRegisterOperatorIdText"
                    });
                }
                _this.disableUnlockButton = ko.computed(function () {
                    var requiredInputMissing = Commerce.StringExtensions.isEmptyOrWhitespace(_this.viewModel.password());
                    return _this.viewModel.isBusy() || requiredInputMissing;
                }, _this);
                return _this;
            }
            LockRegisterViewController.prototype.onShown = function () {
                this.viewModel.enableExtendedCredentials(true);
                if (this.viewModel.showNumPad()) {
                    this.enableNumPad();
                }
            };
            LockRegisterViewController.prototype.afterShown = function () {
                this.focusOnPasswordInput();
            };
            LockRegisterViewController.prototype.onHidden = function () {
                this.viewModel.disableExtendedCredentials();
            };
            LockRegisterViewController.prototype.onCreated = function (element) {
                var _this = this;
                _super.prototype.onCreated.call(this, element);
                this._isPortraitOrientation(Commerce.ApplicationContext.Instance.tillLayoutProxy.orientation === Commerce.Proxy.Entities.Orientation.PORTRAIT);
                Commerce.ApplicationContext.Instance.tillLayoutProxy.addOrientationChangedHandler(element, function (args) {
                    _this._isPortraitOrientation(args === Commerce.Proxy.Entities.Orientation.PORTRAIT);
                });
            };
            LockRegisterViewController.prototype.switchUserButtonClick = function () {
                this.viewModel.switchUser();
            };
            LockRegisterViewController.prototype.unlockRegisterButtonClick = function () {
                this.viewModel.unlockRegister();
            };
            LockRegisterViewController.prototype.onNumpadComplete = function (result) {
                this.viewModel.password(result.valuesByInputId.getItem(LockRegisterViewController._passwordElementId));
                this.unlockRegisterButtonClick();
            };
            LockRegisterViewController.prototype.focusOnPasswordInput = function () {
                if (this.viewModel.showNumPad()) {
                    var numpadViewModel = this.numpadViewModel;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(numpadViewModel)) {
                        numpadViewModel.selectIndex(0);
                    }
                }
                else {
                    $("#" + LockRegisterViewController._passwordElementId).focus();
                }
            };
            Object.defineProperty(LockRegisterViewController.prototype, "numpadViewModel", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._numpadViewModel)) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(this.numpadElement())) {
                            this._numpadViewModel = this.numpadElement().multipleInputNumPadViewModel;
                        }
                    }
                    return this._numpadViewModel;
                },
                enumerable: true,
                configurable: true
            });
            LockRegisterViewController._passwordElementId = "passwordBox";
            return LockRegisterViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.LockRegisterViewController = LockRegisterViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var LoginViewController = (function (_super) {
            __extends(LoginViewController, _super);
            function LoginViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY, header: { showContent: false }, sideBar: { showContentLandscape: false, showContentPortrait: false } }) || this;
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                _this._options = options;
                _this.viewModel = new Commerce.ViewModels.LoginViewModel(_this.createViewModelContext(), {
                    isOpenPeoplePicker: !Commerce.ObjectExtensions.isNullOrUndefined(_this._options) && _this._options.isOpenPeoplePicker
                });
                _this.isBackNavigationEnabled = false;
                _this.signInButton = ko.observable(null);
                _this.numpadElement = ko.observable(null);
                _this.firstTimeUsageVisible = ko.computed(function () {
                    var firstTimeUseStr = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.FIRST_TIME_USE);
                    if (_this.viewModel.isBusy() && "true" === firstTimeUseStr && !_this.viewModel.useAad) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                _this.userImageOrInitialsOptions = ko.computed(function () {
                    var operator = _this.viewModel.selectedOperator();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(operator)) {
                        return {
                            name: Commerce.EmployeeHelper.getName(operator),
                            picture: Commerce.EmployeeHelper.getPicture(operator, Commerce.Session.instance.connectionStatus)
                        };
                    }
                    else {
                        return {
                            name: Commerce.StringExtensions.EMPTY,
                            picture: Commerce.StringExtensions.EMPTY
                        };
                    }
                });
                _this._isPortraitOrientation = ko.observable(false);
                _this.applicationVersion = ko.observable("Version: " + Commerce.ViewModelAdapter.getApplicationVersion());
                _this.operatorElementId = ko.computed(function () {
                    var operatorElementId;
                    if (_this.viewModel.isOperatorIdTextVisible) {
                        operatorElementId = LoginViewController._operatorTextElementId;
                    }
                    else {
                        operatorElementId = "operatorSelectedIdText";
                    }
                    return operatorElementId;
                }, _this);
                _this.disableInput = ko.computed(function () {
                    return _this.viewModel.isBusy() && !_this.firstTimeUsageVisible();
                }, _this);
                _this.numpadInputOptions = [];
                _this.showLogoInside = ko.computed(function () {
                    return _this.viewModel.isLeftLayout() || _this.viewModel.isRightLayout();
                }, _this);
                var deviceConfiguration = Commerce.ApplicationContext.Instance.deviceConfiguration;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(deviceConfiguration)) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(deviceConfiguration.Theme)) {
                        Commerce.CSSHelpers.applyThemeAsync(correlationId, deviceConfiguration);
                    }
                }
                _this.disableSignInButton = ko.computed(function () {
                    var requiredInputMissing = Commerce.StringExtensions.isEmptyOrWhitespace(_this.viewModel.operatorId())
                        || Commerce.StringExtensions.isEmptyOrWhitespace(_this.viewModel.password());
                    return !_this.viewModel.useAad && (_this.disableInput() || requiredInputMissing);
                }, _this);
                _this._orientationMediaQuery = matchMedia("(orientation: landscape)");
                _this._isPortraitOrientation(!_this._orientationMediaQuery.matches);
                _this._orientationChangedHandler = (function () {
                    _this._isPortraitOrientation(!_this._orientationMediaQuery.matches);
                }).bind(_this);
                _this._orientationMediaQuery.addListener(_this._orientationChangedHandler);
                if (Commerce.Utilities.LogonHelper.isAadEmployeeLoginMode() &&
                    (Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.AAD_OPERATOR_LOGIN_INITIATED) === "true")) {
                    Commerce.RetailLogger.posAuthentication_AadLogonAlreadyInitiatedSoAutomaticallyStartAadLogon(correlationId);
                    _this.signInHandler(correlationId);
                }
                if (_this.viewModel.showNumPad()) {
                    if (_this.viewModel.isOperatorIdTextVisible) {
                        _this.numpadInputOptions.push({
                            inputType: Commerce.Controls.NumPad.MultipleInputNumPadInputType.Text,
                            inputId: LoginViewController._operatorTextElementId,
                            labelResourceId: "string_502",
                            disable: _this.disableInput,
                            validator: {
                                maxLength: 30
                            }
                        });
                    }
                    _this.numpadInputOptions.push({
                        inputType: Commerce.Controls.NumPad.MultipleInputNumPadInputType.Password,
                        inputId: LoginViewController._passwordElementId,
                        labelResourceId: "string_503",
                        disable: _this.disableInput,
                        validator: {
                            maxLength: 30
                        },
                        sensitiveDataFor: _this.operatorElementId()
                    });
                }
                if (_this.viewModel.isRightLayout() || _this.viewModel.showNumPad() || _this.viewModel.isOperatorIdSelectVisible || _this.viewModel.showDateTime()) {
                    Commerce.RetailLogger.viewsLoginLoginViewImprovedExerienceUsed(_this.viewModel.isRightLayout(), _this.viewModel.showNumPad(), _this.viewModel.isOperatorIdSelectVisible, _this.viewModel.showDateTime());
                }
                return _this;
            }
            LoginViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            LoginViewController.prototype.dispose = function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._orientationMediaQuery)) {
                    this._orientationMediaQuery.removeListener(this._orientationChangedHandler);
                }
                _super.prototype.dispose.call(this);
            };
            LoginViewController.prototype.onShown = function () {
                this.viewModel.enableExtendedCredentials(false);
                this.viewModel.initializeOfflineDataSync();
                if (this._options
                    && !Commerce.StringExtensions.isNullOrWhitespace(this._options.operatorId)
                    && !Commerce.StringExtensions.isNullOrWhitespace(this._options.password)) {
                    this.viewModel.operatorId(this._options.operatorId);
                    this.viewModel.password(this._options.password);
                    this.signInHandler();
                }
                if (this.viewModel.showNumPad()) {
                    this.enableNumPad();
                }
            };
            LoginViewController.prototype.afterShown = function () {
                var _this = this;
                this.focusOnOperatorInput();
                this.viewModel.afterShown()
                    .done(function () {
                    if (!Commerce.StringExtensions.isEmpty(_this.viewModel.operatorId())) {
                        _this.focusOnPasswordInput();
                    }
                }).fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            LoginViewController.prototype.onHidden = function () {
                this.viewModel.disableExtendedCredentials();
            };
            LoginViewController.prototype.signInHandler = function (correlationId) {
                var trackingId = correlationId;
                if (!Commerce.ObjectExtensions.isString(trackingId)) {
                    trackingId = Commerce.LoggerHelper.getNewCorrelationId();
                }
                this.viewModel.logOn(trackingId);
            };
            LoginViewController.prototype.onNumpadComplete = function (result) {
                if (this.viewModel.isOperatorIdTextVisible) {
                    this.viewModel.operatorId(result.valuesByInputId.getItem(LoginViewController._operatorTextElementId));
                }
                this.viewModel.password(result.valuesByInputId.getItem(LoginViewController._passwordElementId));
                this.signInHandler();
            };
            LoginViewController.prototype.selectEmployeeHandler = function () {
                var _this = this;
                return this.viewModel.selectEmployeeHandler()
                    .done(function (result) {
                    if (!result.canceled) {
                        _this.focusOnPasswordInput();
                    }
                }).fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            LoginViewController.prototype.focusOnPasswordInput = function () {
                if (this.viewModel.showNumPad()) {
                    var numpadViewModel = this.numpadViewModel;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(numpadViewModel)) {
                        numpadViewModel.selectIndex(this.viewModel.isOperatorIdTextVisible ? 1 : 0);
                    }
                }
                else {
                    $("#" + LoginViewController._passwordElementId).focus();
                }
            };
            LoginViewController.prototype.focusOnOperatorInput = function () {
                if (this.viewModel.showNumPad() && this.viewModel.isOperatorIdTextVisible) {
                    var numpadViewModel = this.numpadViewModel;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(numpadViewModel)) {
                        numpadViewModel.selectIndex(0);
                    }
                }
                else if (this.viewModel.isOperatorIdTextVisible) {
                    $("#" + LoginViewController._operatorTextElementId).focus();
                }
            };
            Object.defineProperty(LoginViewController.prototype, "numpadViewModel", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._numpadViewModel)) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(this.numpadElement())) {
                            this._numpadViewModel = this.numpadElement().multipleInputNumPadViewModel;
                        }
                    }
                    return this._numpadViewModel;
                },
                enumerable: true,
                configurable: true
            });
            LoginViewController.prototype._disableNavigation = function (eventObject) {
                eventObject.preventDefault();
                eventObject.cancelBubble = true;
            };
            LoginViewController._passwordElementId = "passwordBox";
            LoginViewController._operatorTextElementId = "operatorTextBox";
            return LoginViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.LoginViewController = LoginViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ResetPasswordViewController = (function (_super) {
            __extends(ResetPasswordViewController, _super);
            function ResetPasswordViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_6815") }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw new Error("Invalid options passed to the ResetPasswordViewController constructor: options cannot be null or undefined.");
                }
                else if (!(options.selectionHandler instanceof Commerce.CancelableSelectionHandler)) {
                    throw new Error("Invalid options passed to the ResetPasswordViewController constructor: selectionHandler must be a selection handler.");
                }
                _this.viewModel = new Commerce.ViewModels.ResetPasswordViewModel(_this.createViewModelContext(), options);
                _this.operatorId = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.newPassword = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.confirmedNewPassword = ko.observable(Commerce.StringExtensions.EMPTY);
                _this.requireChangeAfterUse = ko.observable(true);
                return _this;
            }
            ResetPasswordViewController.prototype.onShown = function () {
                this.clearPasswordFields();
            };
            ResetPasswordViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            ResetPasswordViewController.prototype.toggleRequireChange = function (requireChangeAfterUse) {
                this.requireChangeAfterUse(requireChangeAfterUse);
            };
            ResetPasswordViewController.prototype.resetPassword = function () {
                var errors = this.validateFields();
                if (Commerce.ArrayExtensions.hasElements(errors)) {
                    Commerce.NotificationHandler.displayClientErrors(errors, "string_6804");
                    return;
                }
                var options = {
                    targetUserId: this.operatorId(),
                    newPassword: this.newPassword(),
                    changePassword: this.requireChangeAfterUse()
                };
                this.viewModel.resetPasswordAsync(options);
            };
            ResetPasswordViewController.prototype.clearPasswordFields = function () {
                this.operatorId(Commerce.StringExtensions.EMPTY);
                this.newPassword(Commerce.StringExtensions.EMPTY);
                this.confirmedNewPassword(Commerce.StringExtensions.EMPTY);
            };
            ResetPasswordViewController.prototype.validateFields = function () {
                var errors = [];
                if (Commerce.StringExtensions.compare(this.operatorId(), Commerce.Session.instance.CurrentEmployee.StaffId) === 0) {
                    errors.push(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.RESET_PASSWORD_CURRENT_EMPLOYEE));
                }
                if (Commerce.StringExtensions.isEmptyOrWhitespace(this.operatorId())
                    || Commerce.StringExtensions.isEmptyOrWhitespace(this.newPassword())
                    || Commerce.StringExtensions.isEmptyOrWhitespace(this.confirmedNewPassword())) {
                    errors.push(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.RESET_PASSWORD_DETAILS_NOT_SPECIFIED));
                }
                if (Commerce.StringExtensions.compare(this.newPassword(), this.confirmedNewPassword())) {
                    errors.push(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.NEW_PASSWORD_AND_CONFIRMATION_NOT_MATCHING_ERROR));
                }
                return errors;
            };
            return ResetPasswordViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ResetPasswordViewController = ResetPasswordViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var AddWarrantyToAnExistingTransactionViewController = (function (_super) {
            __extends(AddWarrantyToAnExistingTransactionViewController, _super);
            function AddWarrantyToAnExistingTransactionViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_29883") }) || this;
                var viewModelOptions = {
                    salesOrder: options.salesOrder,
                    selectionHandler: options.selectionHandler
                };
                _this.viewModel = new Commerce.ViewModels.AddWarrantyToAnExistingTransactionViewModel(_this.createViewModelContext(), viewModelOptions);
                _this.salesLineColumns = [
                    { titleResx: "string_4446", cssClass: "ratio1", field: "ItemId" },
                    { titleResx: "string_110", cssClass: "ratio5", field: "productName" },
                    { titleResx: "string_111", cssClass: "ratio2 textRight", field: "Quantity" },
                    {
                        titleResx: "string_1238", cssClass: "ratio2 textRight", field: "NetAmountWithAllInclusiveTax",
                        converter: "Commerce.Core.Converter.PriceFormatter"
                    }
                ];
                return _this;
            }
            AddWarrantyToAnExistingTransactionViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            AddWarrantyToAnExistingTransactionViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            AddWarrantyToAnExistingTransactionViewController.prototype.salesOrderLineListSelectionChangedEventHandler = function (items) {
                this.viewModel.selectedSalesLines(items);
            };
            AddWarrantyToAnExistingTransactionViewController.prototype.addWarrantyForSalesOrderLines = function (eventInfo) {
                this.viewModel.sellWarrantyForSalesOrderLinesAsync();
            };
            AddWarrantyToAnExistingTransactionViewController.prototype.selectAll = function () {
                this._getListViewViewModel().selectAllItems();
            };
            AddWarrantyToAnExistingTransactionViewController.prototype.deselectAll = function () {
                this._getListViewViewModel().unselectAllItems();
            };
            AddWarrantyToAnExistingTransactionViewController.prototype._getListViewViewModel = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._listViewViewModel)) {
                    this._listViewViewModel = document.getElementById("salesOrderLinesView").listViewViewModel;
                }
                return this._listViewViewModel;
            };
            return AddWarrantyToAnExistingTransactionViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.AddWarrantyToAnExistingTransactionViewController = AddWarrantyToAnExistingTransactionViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var AllStoresViewController = (function (_super) {
            __extends(AllStoresViewController, _super);
            function AllStoresViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_6400") }, false) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw "The options parameter was not provided and is required for AllStoresView to function correctly.";
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.storeSelectionHandler)) {
                    throw "The store selection field is required on the options provided for AllStoresView to function correctly.";
                }
                _this._options = options;
                _this.viewModel = new Commerce.ViewModels.AllStoresViewModel(_this.createViewModelContext());
                _this._isSelecting = ko.observable(false);
                _this.viewModel.isBusyWhen(ko.computed(function () { return _this._isSelecting(); }));
                _this._selectCommandDisabled = ko.observable(true);
                _this._cancelSelectionHandlerOnHidden = true;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    Commerce.RetailLogger.viewsMerchandisingAllStoresViewConstructorArgumentUndefined("options");
                    return _this;
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(options.locations)) {
                    Commerce.RetailLogger.viewsMerchandisingAllStoresViewConstructorArgumentUndefined("options.locations");
                    return _this;
                }
                _this._locations = ko.observableArray(options.locations);
                return _this;
            }
            AllStoresViewController.prototype.onNavigateBack = function () {
                this._cancelSelectionHandlerOnHidden = false;
                return true;
            };
            AllStoresViewController.prototype.onHidden = function () {
                if (this._cancelSelectionHandlerOnHidden && !Commerce.ObjectExtensions.isNullOrUndefined(this._options.storeSelectionHandler)) {
                    this._options.storeSelectionHandler.cancel();
                }
            };
            AllStoresViewController.prototype.invokeStore = function (selectedItem) {
                this._selectedStore = selectedItem;
            };
            AllStoresViewController.prototype.confirmStoreSelection = function () {
                var _this = this;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._options.storeSelectionHandler)) {
                    this._isSelecting(true);
                    this._options.storeSelectionHandler.select(this._selectedStore, function () {
                        _this._cancelSelectionHandlerOnHidden = true;
                        _this._isSelecting(false);
                    }, function (errors) {
                        Commerce.NotificationHandler.displayClientErrors(errors);
                        _this._isSelecting(false);
                    });
                }
                else {
                    throw "Invalid storeSelectionCallback provided to AllStoresView.";
                }
            };
            AllStoresViewController.prototype.storeSelectionChanged = function (selectedLines) {
                this._selectedStore = selectedLines.length === 0 ? null : selectedLines[0];
                this._selectCommandDisabled(!Commerce.ArrayExtensions.hasElements(selectedLines));
            };
            AllStoresViewController.prototype.onItemDataSourceUpdated = function (viewModel) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._locations()) && this._locations.length === 1) {
                    viewModel.selectAll();
                }
            };
            return AllStoresViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.AllStoresViewController = AllStoresViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CatalogsViewController = (function (_super) {
            __extends(CatalogsViewController, _super);
            function CatalogsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_32") }) || this;
                _this._options = options;
                _this.viewModel = new Commerce.ViewModels.CatalogViewModel(_this.createViewModelContext());
                _this.currentStore = Commerce.Session.instance.productCatalogStore.Store;
                _this.currentStoreLocation = ko.observable("");
                _this._cancelSelectionOnHidden = true;
                if (Commerce.Session.instance.productCatalogStore.StoreType !== Commerce.Proxy.Entities.StoreButtonControlType.AllStores) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(Commerce.Session.instance.productCatalogStore.Store) &&
                        !Commerce.ObjectExtensions.isNullOrUndefined(Commerce.Session.instance.productCatalogStore.Store.OrgUnitFullAddress)) {
                        _this.currentStoreLocation(Commerce.Session.instance.productCatalogStore.Store.OrgUnitAddress.City + ", "
                            + Commerce.Session.instance.productCatalogStore.Store.OrgUnitAddress.State);
                    }
                    _this.viewModel.getCatalogs().fail(function (errors) {
                        Commerce.NotificationHandler.displayClientErrors(errors);
                    });
                }
                else {
                    var allStoreProductImage = Commerce.Session.instance.defaultCatalogImageFormat
                        .replace("{LanguageId}", Commerce.ApplicationContext.Instance.deviceConfiguration.CultureName)
                        .replace("{CatalogName}", Commerce.ViewModelAdapter.getResourceString("string_33"))
                        .replace("{ChannelName}", Commerce.Session.instance.productCatalogStore.Store.OrgUnitName);
                    _this.viewModel.catalogs([new Commerce.Proxy.Entities.ProductCatalogClass({
                            RecordId: 0,
                            Name: Commerce.ViewModelAdapter.getResourceString("string_33"),
                            IsSnapshotEnabled: false,
                            ValidFrom: new Date(),
                            ValidTo: new Date(),
                            CreatedOn: new Date(),
                            ModifiedOn: new Date(),
                            PublishedOn: new Date(),
                            Images: [{ Uri: allStoreProductImage }]
                        })]);
                }
                return _this;
            }
            CatalogsViewController.prototype.onShown = function () {
                this._cancelSelectionOnHidden = true;
            };
            CatalogsViewController.prototype.onHidden = function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._options)
                    && Commerce.ObjectExtensions.isFunction(this._options.onCatalogSelectionCanceled)
                    && this._cancelSelectionOnHidden) {
                    this._options.onCatalogSelectionCanceled();
                }
            };
            CatalogsViewController.prototype.onNavigateBack = function () {
                this._cancelSelectionOnHidden = false;
                return true;
            };
            CatalogsViewController.prototype.itemInvokedHandler = function (item) {
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                Commerce.RetailLogger.viewsMerchandisingCatalogsCatalogClicked(correlationId, item.RecordId.toString(), item.Name);
                Commerce.Session.instance.productCatalogStore.Context.CatalogId = item.RecordId;
                Commerce.Session.instance.catalogName = item.Name;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._options) && !Commerce.StringExtensions.isNullOrWhitespace(this._options.destination)) {
                    this._cancelSelectionOnHidden = false;
                    Commerce.ViewModelAdapter.navigate(this._options.destination, this._options.destinationOptions);
                }
                else {
                    var options = { correlationId: correlationId };
                    Commerce.ViewModelAdapter.navigate("CategoriesView", options);
                }
            };
            CatalogsViewController.prototype.switchToOtherStores = function () {
                var _this = this;
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                var storeSelectionHandler = new Commerce.CancelableSelectionHandler(function (store) {
                    var returnOptions = _this._options || { destination: null, destinationOptions: null };
                    Commerce.ViewModelAdapter.collapseAndNavigate("CatalogsView", returnOptions);
                }, function () {
                    Commerce.ViewModelAdapter.collapse("CatalogsView");
                }, function (store) {
                    return _this.viewModel.setVirtualCatalog(correlationId, Commerce.Proxy.Entities.StoreButtonControlType.FindStore, store)
                        .map(function () {
                        return { canceled: false };
                    });
                });
                var parameters = {
                    isForPickUp: false,
                    storeSelectionHandler: storeSelectionHandler
                };
                this._cancelSelectionOnHidden = false;
                Commerce.ViewModelAdapter.navigate("PickUpInStoreView", parameters);
            };
            CatalogsViewController.prototype.switchToCurrentStore = function () {
                var _this = this;
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                this.viewModel.setVirtualCatalog(correlationId, Commerce.Proxy.Entities.StoreButtonControlType.CurrentStore, null)
                    .done(function () {
                    _this._cancelSelectionOnHidden = false;
                    Commerce.ViewModelAdapter.navigate("CatalogsView", _this._options);
                })
                    .fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            CatalogsViewController.prototype.switchToAllStoreProducts = function () {
                var _this = this;
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                this.viewModel.setVirtualCatalog(correlationId, Commerce.Proxy.Entities.StoreButtonControlType.AllStores, null)
                    .done(function () {
                    _this._cancelSelectionOnHidden = false;
                    Commerce.ViewModelAdapter.navigate("CatalogsView", _this._options);
                })
                    .fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            CatalogsViewController.prototype.navigateToStoreDetails = function () {
                var storeDetailsViewModelOptions = {
                    storeId: Commerce.Session.instance.productCatalogStore.Store.OrgUnitNumber
                };
                Commerce.ViewModelAdapter.navigate("StoreDetailsView", storeDetailsViewModelOptions);
            };
            return CatalogsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CatalogsViewController = CatalogsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CategoriesViewController = (function (_super) {
            __extends(CategoriesViewController, _super);
            function CategoriesViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_606") }) || this;
                _this.viewModel = new Commerce.ViewModels.CategoriesViewModel(_this.createViewModelContext());
                _this.viewModel.GetCategoriesSuccessCallBack(Commerce.Session.instance.CurrentCategoryList);
                _this._pageLoadCorrelationId = Commerce.LoggerHelper.getFormattedCorrelationId(options);
                return _this;
            }
            CategoriesViewController.prototype.afterShown = function () {
                Commerce.RetailLogger.viewsMerchandisingCategoriesViewLoaded(this._pageLoadCorrelationId);
                this._pageLoadCorrelationId = Commerce.StringExtensions.EMPTY;
            };
            CategoriesViewController.prototype.itemInvokedHandler = function (item) {
                Commerce.ViewModelAdapter.navigate("ProductsView", {
                    category: item,
                    activeMode: Commerce.ViewModels.ProductsViewModelActiveMode.Products
                });
            };
            CategoriesViewController.prototype.categoriesCommand = function (options) {
                Commerce.ViewModelAdapter.navigate("ProductsView", {
                    category: options.SelectedGroupHeader,
                    activeMode: Commerce.ViewModels.ProductsViewModelActiveMode.Products
                });
            };
            return CategoriesViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CategoriesViewController = CategoriesViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var CompareProductsViewController = (function (_super) {
            __extends(CompareProductsViewController, _super);
            function CompareProductsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_700") }) || this;
                _this.viewModel = new Commerce.ViewModels.CompareProductsViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            CompareProductsViewController.prototype.addProductClicked = function () {
                Commerce.ViewModelAdapter.navigateBack();
            };
            CompareProductsViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            return CompareProductsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.CompareProductsViewController = CompareProductsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var SearchViewController = (function (_super) {
            __extends(SearchViewController, _super);
            function SearchViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                _this.implementsISearchableViewController = true;
                var searchViewModelOptions = SearchViewController._getSearchViewModelOptions(options);
                _this.viewModel = new Commerce.ViewModels.SearchViewModel(_this.createViewModelContext(), searchViewModelOptions);
                var enabledSearchTypes;
                if (searchViewModelOptions.selectionMode === Commerce.ViewModels.SearchViewSelectionMode.Customer) {
                    enabledSearchTypes = [Commerce.Client.Entities.HeaderSearchType.Customer];
                }
                else if (searchViewModelOptions.selectionMode === Commerce.ViewModels.SearchViewSelectionMode.Product
                    || _this.viewModel.viewPrePopulatedProductSearchResults()) {
                    enabledSearchTypes = [Commerce.Client.Entities.HeaderSearchType.Product];
                }
                else {
                    enabledSearchTypes = [Commerce.Client.Entities.HeaderSearchType.Customer, Commerce.Client.Entities.HeaderSearchType.Product];
                }
                _this.search = {
                    searchText: _this.viewModel.searchText,
                    searchType: _this.viewModel.searchType,
                    enabledSearchTypes: enabledSearchTypes,
                    onSearch: _this._searchClickHandler.bind(_this),
                    onSearchByFieldCriteria: _this._searchBySearchFieldClickHandler.bind(_this),
                    enableSearchByFieldCriteria: _this.viewModel.isSelectedSearchLocationLocal,
                    eventManager: new Commerce.EventManager()
                };
                _this._isProductDataLoadingSubscription = _this.viewModel.isProductDataLoading.subscribe(function (newValue) {
                    if (!newValue && !_this.viewModel.viewCustomers()) {
                        if (!_this.viewModel.hasProductSearchValueSet()) {
                            _this.search.eventManager.raiseEvent("WaitingForSearch", void 0);
                        }
                    }
                });
                _this._isCustomerDataLoadingSubscription = _this.viewModel.isCustomerDataLoading.subscribe(function (newValue) {
                    if (!newValue && _this.viewModel.viewCustomers()) {
                        if (!_this.viewModel.hasCustomerSearchValueSet()) {
                            _this.search.eventManager.raiseEvent("WaitingForSearch", void 0);
                        }
                    }
                });
                _this.viewModel.showCustomerDetailsHandler = _this.showCustomerDetails.bind(_this);
                _this.viewModel.changeStoreAndCatalogsHandler = _this.changeStoreAndCatalogs.bind(_this);
                _this.viewModel.showProductDetailsHandler = _this.showProductDetails.bind(_this);
                _this.viewModel.compareItemsHandler = _this._compareItems.bind(_this);
                _this.viewModel.addNewCustomerHandler = _this.addNewCustomer.bind(_this);
                _this._options = searchViewModelOptions || {
                    selectionMode: Commerce.ViewModels.SearchViewSelectionMode.None,
                    searchEntity: undefined,
                    correlationId: Commerce.StringExtensions.EMPTY
                };
                _this.viewModel.isSearchWithLocationAvailable.valueHasMutated();
                _this.title(_this._getNewTitle(_this.viewModel.viewCustomers()));
                _this._viewCustomersSubscription = _this.viewModel.viewCustomers.subscribe(function (newViewCustomers) {
                    _this.title(_this._getNewTitle(newViewCustomers));
                });
                return _this;
            }
            SearchViewController.prototype.onCreated = function (element) {
                var _this = this;
                _super.prototype.onCreated.call(this, element);
                this._clearListSelectionTrigger = this.viewModel.clearProductSelection.subscribe(function (newValue) {
                    if (newValue) {
                        _this._clearProductListSelection();
                    }
                });
            };
            SearchViewController.prototype.onShown = function () {
                var _this = this;
                this._cancelSelectionOnHidden = true;
                Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    if (!Commerce.StringExtensions.isNullOrWhitespace(barcode)) {
                        _this.viewModel.setSearchByText(barcode);
                        _this.viewModel.searchItems(true);
                    }
                });
                this.viewModel.onShown();
            };
            SearchViewController.prototype.afterBind = function (element) {
                this._searchElement = element;
                if (this._options.searchEntity === Commerce.ViewModels.SearchViewSearchEntity.Customer
                    || this._options.selectionMode === Commerce.ViewModels.SearchViewSelectionMode.Customer) {
                    this.context.interaction.triggerEvent(element, "activateCustomersPivot");
                }
                else {
                    this.context.interaction.triggerEvent(element, "activateProductsPivot");
                }
            };
            SearchViewController.prototype.afterShown = function () {
                var _this = this;
                window.setTimeout(function () {
                    _this.viewModel.autoFocusDelayInMilliseconds(SearchViewController.DELAY_IN_MILLISECONDS_ON_FOCUS);
                }, ViewControllers.ViewControllerBase.DEFAULT_DELAY_IN_MILLISECONDS_ON_PAGE_LOAD_VISIBILITY);
            };
            SearchViewController.prototype.onHidden = function () {
                Commerce.Peripherals.instance.barcodeScanner.disableAsync();
                if (this._cancelSelectionOnHidden) {
                    if (this._options.selectionMode === Commerce.ViewModels.SearchViewSelectionMode.Customer) {
                        this._options.customerSelectionOptions.customerSelectionHandler.cancel();
                    }
                    else if (this._options.selectionMode === Commerce.ViewModels.SearchViewSelectionMode.Product) {
                        this._options.productSelectionOptions.productSelectionHandler.cancel();
                    }
                }
                this._clearListSelectionTrigger.dispose();
            };
            SearchViewController.prototype.dispose = function () {
                this._isProductDataLoadingSubscription.dispose();
                this._isCustomerDataLoadingSubscription.dispose();
                this._viewCustomersSubscription.dispose();
                _super.prototype.dispose.call(this);
            };
            SearchViewController.prototype.showRefinerDialog = function () {
                this.viewModel.filterProducts();
            };
            SearchViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            SearchViewController.prototype.switchSearchMode = function (event) {
                var PRODUCT_SEARCH_TAB_INDEX = 0;
                var correlationId;
                var isProductSearch = event.detail.index === PRODUCT_SEARCH_TAB_INDEX;
                if ((isProductSearch && !this.viewModel.viewCustomers())
                    || (event.detail.index === PRODUCT_SEARCH_TAB_INDEX + 1 && this.viewModel.viewCustomers())) {
                    return;
                }
                var logEvent;
                if (isProductSearch) {
                    correlationId = this.viewModel.ProductSearchCorrelationId;
                    logEvent = Commerce.RetailLogger.viewsMerchandisingSearchViewSwitchToProductTab;
                }
                else {
                    correlationId = this.viewModel.CustomerSearchCorrelationId;
                    logEvent = Commerce.RetailLogger.viewsMerchandisingSearchViewSwitchToCustomerTab;
                }
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                }
                logEvent(correlationId);
                this.viewModel.setSearchMode(isProductSearch, correlationId);
            };
            SearchViewController.prototype.searchByAdvancedSearchClickHandler = function () {
                var _this = this;
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                Commerce.RetailLogger.viewsMerchandisingAdvancedSearchViewSearchClick(correlationId);
                this.viewModel.getAndSetAdvancedCustomerSearchCriteria(correlationId).done(function (result) {
                    if (!result.canceled) {
                        Commerce.RetailLogger.viewsMerchandisingSearchViewAdvancedCustomerSearchStarted(correlationId);
                        _this.viewModel.setSearchMode(false, correlationId);
                        _this.context.interaction.triggerEvent(_this._searchElement, "activateCustomersPivot");
                    }
                });
            };
            SearchViewController.prototype.addNewCustomer = function () {
                this._cancelSelectionOnHidden = false;
                this.viewModel.createCustomer();
            };
            SearchViewController.prototype.showProductDetails = function (product, quantity) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(product)) {
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    Commerce.RetailLogger.viewsMerchandisingSearchViewShowProductDetailsStarted(correlationId);
                    Commerce.RetailLogger.viewsMerchandisingSearchViewShowProductDetailsProduct(product.ItemId);
                    this._cancelSelectionOnHidden = false;
                    var isSelectionMode = this._options.selectionMode === Commerce.ViewModels.SearchViewSelectionMode.Product;
                    var simpleProduct = void 0;
                    if (product instanceof Commerce.Proxy.Entities.SimpleProductClass) {
                        simpleProduct = product;
                    }
                    var simpleProductDetailsViewModelOptions = {
                        productId: product.RecordId,
                        product: simpleProduct,
                        isSelectionMode: isSelectionMode,
                        correlationId: correlationId
                    };
                    if (isSelectionMode) {
                        simpleProductDetailsViewModelOptions.selectionOptions = {
                            productSelectionHandler: this._options.productSelectionOptions.productSelectionHandler
                        };
                    }
                    if (Commerce.ObjectExtensions.isNumber(quantity)) {
                        simpleProductDetailsViewModelOptions.addToCartOptions = {
                            quantity: quantity,
                            trackingId: this._options.trackingId
                        };
                    }
                    else {
                        simpleProductDetailsViewModelOptions.addToCartOptions = {
                            trackingId: this._options.trackingId
                        };
                    }
                    Commerce.ViewModelAdapter.navigate("SimpleProductDetailsView", simpleProductDetailsViewModelOptions);
                }
            };
            SearchViewController.prototype.changeStoreAndCatalogs = function (searchText, searchEntity) {
                var _this = this;
                this._cancelSelectionOnHidden = false;
                this._options.searchText = searchText;
                this._options.searchEntity = searchEntity;
                var parameters = {
                    destination: "SearchView",
                    destinationOptions: this._options
                };
                if (this.viewModel.selectionMode === Commerce.ViewModels.SearchViewSelectionMode.Product) {
                    parameters.onCatalogSelectionCanceled = function () {
                        _this._options.productSelectionOptions.productSelectionHandler.cancel();
                    };
                }
                Commerce.ViewModelAdapter.navigate("CatalogsView", parameters);
            };
            SearchViewController.prototype.showCustomerDetails = function (customerAccountNumber, correlationId) {
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                }
                Commerce.RetailLogger.viewsMerchandisingSearchViewShowCustomerDetails(correlationId, customerAccountNumber);
                this._cancelSelectionOnHidden = false;
                var viewOptions = {
                    accountNumber: customerAccountNumber,
                    correlationId: correlationId
                };
                if (this._options.selectionMode === Commerce.ViewModels.SearchViewSelectionMode.Customer) {
                    viewOptions.customerSelectionOptions = {
                        customerSelectionHandler: this._options.customerSelectionOptions.customerSelectionHandler
                    };
                }
                Commerce.ViewModelAdapter.navigate("CustomerDetailsView", viewOptions);
            };
            SearchViewController._getSearchViewModelOptions = function (options) {
                var searchViewModelOptions;
                if (options instanceof Commerce.Client.Entities.SearchNavigationParameters) {
                    searchViewModelOptions = {
                        searchEntity: options.searchEntity,
                        searchText: options.searchText,
                        selectionMode: Commerce.ViewModels.SearchViewSelectionMode.None,
                        correlationId: Commerce.StringExtensions.EMPTY,
                        autoFocusDelayInMilliseconds: ViewControllers.ViewControllerBase.DEFAULT_DELAY_IN_MILLISECONDS_ON_PAGE_LOAD_VISIBILITY
                    };
                }
                else {
                    searchViewModelOptions = options;
                    if (isNaN(searchViewModelOptions.autoFocusDelayInMilliseconds)) {
                        searchViewModelOptions.autoFocusDelayInMilliseconds = ViewControllers.ViewControllerBase.DEFAULT_DELAY_IN_MILLISECONDS_ON_PAGE_LOAD_VISIBILITY;
                    }
                }
                return searchViewModelOptions;
            };
            SearchViewController.prototype._searchClickHandler = function (searchText, searchType, correlationId, refinerValue) {
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                }
                Commerce.RetailLogger.viewsMerchandisingSearchViewSearchClick(correlationId);
                this.viewModel.setSearchByText(searchText);
                this.viewModel.setSearchMode(searchType !== Commerce.Client.Entities.HeaderSearchType.Customer, correlationId);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(refinerValue) && searchType === Commerce.Client.Entities.HeaderSearchType.Product) {
                    this.viewModel.productSearchViewModel.productRefinerValuesParameter = [refinerValue];
                }
                else {
                    this.viewModel.productSearchViewModel.productRefinerValuesParameter = null;
                }
                if (searchType === Commerce.Client.Entities.HeaderSearchType.Customer) {
                    this.context.interaction.triggerEvent(this._searchElement, "activateCustomersPivot");
                }
                else {
                    this.context.interaction.triggerEvent(this._searchElement, "activateProductsPivot");
                }
            };
            SearchViewController.prototype._searchBySearchFieldClickHandler = function (customerSearchByFieldCriteria, correlationId) {
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                }
                Commerce.RetailLogger.viewsMerchandisingSearchViewSearchClick(correlationId);
                this.viewModel.setSearchByCustomerFieldCriteria(customerSearchByFieldCriteria);
                this.viewModel.setSearchMode(false, correlationId);
                this.context.interaction.triggerEvent(this._searchElement, "activateCustomersPivot");
            };
            SearchViewController.prototype._compareItems = function (productIds) {
                var options = {
                    productIds: productIds
                };
                Commerce.ViewModelAdapter.navigate("CompareProductsView", options);
            };
            SearchViewController.prototype._getNewTitle = function (newViewCustomers) {
                if (newViewCustomers) {
                    return Commerce.ViewModelAdapter.getResourceString("string_1045");
                }
                var storeName = Commerce.Session.instance.productCatalogStore.Store.OrgUnitName;
                var title = Commerce.StringExtensions.EMPTY;
                if (Commerce.Session.instance.productCatalogStore.Context.CatalogId !== 0 &&
                    !Commerce.StringExtensions.isNullOrWhitespace(Commerce.Session.instance.catalogName)) {
                    title = Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_1046"), storeName, Commerce.Session.instance.catalogName);
                }
                else {
                    title = Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_1047"), storeName);
                }
                return title;
            };
            SearchViewController.prototype._clearProductListSelection = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._dataListViewModel)) {
                    var currentProductsListId = void 0;
                    if (!this.viewModel.viewPrePopulatedProductSearchResults()) {
                        currentProductsListId = SearchViewController._productsDataListId;
                    }
                    else {
                        currentProductsListId = SearchViewController._prePopulatedProductsDataListId;
                    }
                    var listElement = document.getElementById(currentProductsListId);
                    if (Commerce.ObjectExtensions.isNullOrUndefined(listElement)) {
                        Commerce.RetailLogger.viewsMerchandisingSearchViewProductDataListElementNotFound(currentProductsListId);
                        return;
                    }
                    if (Commerce.ObjectExtensions.isNullOrUndefined(listElement.dataListViewModel)) {
                        Commerce.RetailLogger.viewsMerchandisingSearchViewProductDataListViewModelNotFound(currentProductsListId);
                        return;
                    }
                    this._dataListViewModel = listElement.dataListViewModel;
                }
                this._dataListViewModel.clearAll();
            };
            SearchViewController.DELAY_IN_MILLISECONDS_ON_FOCUS = 100;
            SearchViewController._productsDataListId = "productsview";
            SearchViewController._prePopulatedProductsDataListId = "prePopulatedProductSearchResultsView";
            return SearchViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.SearchViewController = SearchViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var InventoryAvailableToPromiseViewController = (function (_super) {
            __extends(InventoryAvailableToPromiseViewController, _super);
            function InventoryAvailableToPromiseViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_2606") }) || this;
                _this.viewModel = new Commerce.ViewModels.InventoryAvailableToPromiseViewModel(_this.createViewModelContext(), options);
                _this.viewModel.setNumPadPublisher(_this.numPadInputBroker);
                _this.viewModel.product.subscribe(function (newProductValue) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(newProductValue)) {
                        _this.context.interaction.triggerEvent(_this._inventoryElement, "productsByKeywordFound");
                    }
                });
                return _this;
            }
            InventoryAvailableToPromiseViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            InventoryAvailableToPromiseViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            InventoryAvailableToPromiseViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            InventoryAvailableToPromiseViewController.prototype.afterBind = function (element) {
                this._inventoryElement = element;
            };
            return InventoryAvailableToPromiseViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.InventoryAvailableToPromiseViewController = InventoryAvailableToPromiseViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var InventoryLookupMatrixViewController = (function (_super) {
            __extends(InventoryLookupMatrixViewController, _super);
            function InventoryLookupMatrixViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                options = options || { product: null, selectedStore: null };
                _this.viewModel = new Commerce.ViewModels.InventoryLookupMatrixViewModel(_this.createViewModelContext(), options);
                _this.title(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_2639"), Commerce.ViewModelAdapter.getResourceString("string_2607"), _this.viewModel.selectedStore.OrgUnitName));
                _this.viewSubTitle = ko.observable(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_2637"), _this.viewModel.product.ItemId, _this.viewModel.product.Name));
                _this.isMenuVisible = ko.observable(false);
                _this.menuAnchor = ko.observable(null);
                return _this;
            }
            InventoryLookupMatrixViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            InventoryLookupMatrixViewController.prototype.cellClickHandler = function (clickedItem, clickEvent) {
                this.viewModel.selectedItemAvailability = clickedItem;
                this.menuAnchor(clickEvent.currentTarget);
                this.isMenuVisible(true);
            };
            InventoryLookupMatrixViewController.prototype.getCellData = function (dimensionCombinations) {
                return this.viewModel.getItemAvailabilities(dimensionCombinations);
            };
            InventoryLookupMatrixViewController.prototype.changeStore = function () {
                var _this = this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._variantMatrixViewModel)) {
                    this._variantMatrixViewModel = this._getVariantMatrixViewModel();
                }
                this.viewModel.changeStoreAsync(this._variantMatrixViewModel).done(function () {
                    _this.title(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_2639"), Commerce.ViewModelAdapter.getResourceString("string_2607"), _this.viewModel.selectedStore.OrgUnitName));
                }).fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            InventoryLookupMatrixViewController.prototype._getVariantMatrixViewModel = function () {
                var variantMatrixViewModel;
                var variantMatrixElement = document.getElementById(InventoryLookupMatrixViewController.variantMatrixId);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(variantMatrixElement) &&
                    !Commerce.ObjectExtensions.isNullOrUndefined(variantMatrixElement.variantMatrixViewModel)) {
                    variantMatrixViewModel = variantMatrixElement.variantMatrixViewModel;
                }
                return variantMatrixViewModel;
            };
            InventoryLookupMatrixViewController.variantMatrixId = "inventoryLookupVariantMatrix";
            return InventoryLookupMatrixViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.InventoryLookupMatrixViewController = InventoryLookupMatrixViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var InventoryLookupViewController = (function (_super) {
            __extends(InventoryLookupViewController, _super);
            function InventoryLookupViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_2607") }) || this;
                var viewModelOptions;
                if (options instanceof Commerce.Client.Entities.InventoryLookupNavigationParameters) {
                    viewModelOptions = {
                        product: options.product
                    };
                }
                else {
                    viewModelOptions = options;
                }
                _this.viewModel = new Commerce.ViewModels.InventoryLookupViewModel(_this.createViewModelContext(), viewModelOptions);
                _this.viewModel.setNumPadPublisher(_this.numPadInputBroker);
                _this.viewModel.product.subscribe(function (newProductValue) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(newProductValue)) {
                        _this.context.interaction.triggerEvent(_this._inventoryElement, "productsByKeywordFound");
                    }
                });
                return _this;
            }
            InventoryLookupViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            InventoryLookupViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            InventoryLookupViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            InventoryLookupViewController.prototype.afterBind = function (element) {
                this._inventoryElement = element;
            };
            return InventoryLookupViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.InventoryLookupViewController = InventoryLookupViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var KitComponentSubstitutesViewController = (function (_super) {
            __extends(KitComponentSubstitutesViewController, _super);
            function KitComponentSubstitutesViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_919") }, false) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw "Invalid options passed to the KitComponentSubstitutesView constructor: options cannot be null or undefined.";
                }
                _this.viewModel = new Commerce.ViewModels.KitComponentSubstitutesViewModel(_this.createViewModelContext(), options);
                _this._cancelSelectionOnHidden = true;
                return _this;
            }
            KitComponentSubstitutesViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            KitComponentSubstitutesViewController.prototype.onHidden = function () {
                if (this._cancelSelectionOnHidden) {
                    this.viewModel.cancelSubstituteSelection();
                }
            };
            KitComponentSubstitutesViewController.prototype.onNavigateBack = function () {
                this._cancelSelectionOnHidden = false;
                this.viewModel.reselectCurrentComponent();
                return true;
            };
            return KitComponentSubstitutesViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.KitComponentSubstitutesViewController = KitComponentSubstitutesViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var KitDisassemblyViewController = (function (_super) {
            __extends(KitDisassemblyViewController, _super);
            function KitDisassemblyViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                _this._showNumPad = Commerce.ObjectExtensions.isNullOrUndefined(options);
                _this.viewModel = new Commerce.ViewModels.KitDisassemblyViewModel(_this.createViewModelContext(), options);
                _this._setDisassembleQuantityDialog = new Commerce.Controls.SetDisassembleQuantityDialog();
                var viewTitleComputed = ko.computed(function () {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(_this.viewModel.kitProduct())) {
                        return Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_5375"), _this.viewModel.kitProduct().ItemId, _this.viewModel.kitProduct().Name);
                    }
                    else {
                        return Commerce.ViewModelAdapter.getResourceString("string_419");
                    }
                });
                _this.title(viewTitleComputed());
                _this._viewTitleComputedSubscription = viewTitleComputed.subscribe(function (newViewTitle) {
                    _this.title(newViewTitle);
                });
                return _this;
            }
            KitDisassemblyViewController.prototype.dispose = function () {
                this._viewTitleComputedSubscription.dispose();
                _super.prototype.dispose.call(this);
            };
            KitDisassemblyViewController.prototype.load = function () {
                this.viewModel.loadAsync()
                    .fail(function (error) {
                    Commerce.NotificationHandler.displayClientErrors(error);
                });
            };
            KitDisassemblyViewController.prototype.onShown = function () {
                if (this._showNumPad) {
                    this.viewModel.performProductSearch();
                }
            };
            KitDisassemblyViewController.prototype.setKitQuantityToDisassemble = function () {
                var _this = this;
                var state = {
                    product: this.viewModel.kitProduct(),
                    productImage: this.viewModel.productImage(),
                    originalQuantity: this.viewModel.kitQuantity()
                };
                this._setDisassembleQuantityDialog.show(state)
                    .on(Commerce.DialogResult.OK, function (result) {
                    _this.viewModel.setQuantityToDisassemble(result);
                }).onError(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            return KitDisassemblyViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.KitDisassemblyViewController = KitDisassemblyViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var PickingAndReceivingDetailsViewController = (function (_super) {
            __extends(PickingAndReceivingDetailsViewController, _super);
            function PickingAndReceivingDetailsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                _this.viewModel = new Commerce.ViewModels.PickingAndReceivingDetailsViewModel(_this.createViewModelContext(), options);
                _this.viewModel.setNumPadPublisher(_this.numPadInputBroker);
                _this.viewModel.setClearSelectionCallback(function () {
                    _this._clearSelection();
                });
                _this.title(_this.viewModel.title());
                _this._viewModelTitleSubscription = _this.viewModel.title.subscribe(function (newViewModelTitle) {
                    _this.title(newViewModelTitle);
                });
                return _this;
            }
            PickingAndReceivingDetailsViewController.prototype.dispose = function () {
                this._viewModelTitleSubscription.dispose();
                _super.prototype.dispose.call(this);
            };
            PickingAndReceivingDetailsViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            PickingAndReceivingDetailsViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            PickingAndReceivingDetailsViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            PickingAndReceivingDetailsViewController.prototype._clearSelection = function () {
                document.getElementById(PickingAndReceivingDetailsViewController.LIST_VIEW_CONTAINER_NAME).dataListViewModel.clearAll();
            };
            PickingAndReceivingDetailsViewController.LIST_VIEW_CONTAINER_NAME = "listviewContainer";
            return PickingAndReceivingDetailsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.PickingAndReceivingDetailsViewController = PickingAndReceivingDetailsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var PriceCheckViewController = (function (_super) {
            __extends(PriceCheckViewController, _super);
            function PriceCheckViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_3501") }) || this;
                _this.viewModel = new Commerce.ViewModels.PriceCheckViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            PriceCheckViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            PriceCheckViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            PriceCheckViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            return PriceCheckViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.PriceCheckViewController = PriceCheckViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ProductRichMediaViewController = (function (_super) {
            __extends(ProductRichMediaViewController, _super);
            function ProductRichMediaViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY, disableLoader: true, header: { disable: true }, sideBar: { disable: true } }) || this;
                _this._images = [];
                _this.viewModel = new Commerce.ViewModels.ProductRichMediaViewModel(_this.createViewModelContext());
                _this._images = options.images;
                return _this;
            }
            Object.defineProperty(ProductRichMediaViewController.prototype, "images", {
                get: function () {
                    return this._images;
                },
                enumerable: true,
                configurable: true
            });
            ProductRichMediaViewController.prototype.onCreated = function (element) {
                var _this = this;
                this.setImageSizeAsPerScreen(element, $(window).width(), $(window).height());
                Commerce.ApplicationContext.Instance.tillLayoutProxy.addOrientationChangedHandler(element, function (orientation) {
                    _this.setImageSizeAsPerScreen(element, $(window).width(), $(window).height());
                });
                Commerce.EventProxy.Instance.addWindowResizeHandler(element, function (eventArg) {
                    _this.setImageSizeAsPerScreen(element, $(eventArg.srcElement).width(), $(eventArg.srcElement).height());
                });
            };
            ProductRichMediaViewController.prototype.setImageSizeAsPerScreen = function (element, elementWidth, elementHeight) {
                var $element = $(element);
                var calculatedImageSize;
                var maxImagesize = 600;
                var thumbnailsDivHeight = 110;
                var marginPixel = 10;
                var backButtonSize = 70;
                var largeImageDiv = $element.find("#productimageflipview");
                var thumbnailsDiv = $element.find("#productimageflipviewThumbnails");
                if (elementWidth < elementHeight) {
                    if (elementWidth + thumbnailsDivHeight < elementHeight) {
                        calculatedImageSize = elementWidth;
                        thumbnailsDiv.css("width", calculatedImageSize + "px");
                    }
                    else {
                        calculatedImageSize = elementWidth - thumbnailsDivHeight;
                    }
                }
                else {
                    calculatedImageSize = elementHeight - thumbnailsDivHeight;
                    thumbnailsDiv.css("width", "auto");
                }
                calculatedImageSize = calculatedImageSize - marginPixel;
                if (calculatedImageSize > maxImagesize) {
                    calculatedImageSize = maxImagesize;
                }
                if (!Commerce.Config.isPhone) {
                    if (elementWidth < calculatedImageSize + 2 * backButtonSize) {
                        calculatedImageSize = elementWidth - 2 * backButtonSize;
                        if (elementHeight > calculatedImageSize + 2 * backButtonSize + thumbnailsDivHeight) {
                            calculatedImageSize = elementHeight - 2 * backButtonSize - thumbnailsDivHeight;
                        }
                    }
                }
                largeImageDiv.css({ width: calculatedImageSize, height: calculatedImageSize });
            };
            return ProductRichMediaViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ProductRichMediaViewController = ProductRichMediaViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ProductsViewController = (function (_super) {
            __extends(ProductsViewController, _super);
            function ProductsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                options = options || {
                    activeMode: Commerce.ViewModels.ProductsViewModelActiveMode.Categories,
                    category: undefined,
                    categoryId: 0,
                    correlationId: Commerce.StringExtensions.EMPTY
                };
                if (Commerce.ObjectExtensions.isNullOrUndefined(options.category) && !Commerce.NumberExtensions.isNullOrZero(options.categoryId)) {
                    options.category = Commerce.ArrayExtensions.firstOrUndefined(Commerce.Session.instance.CurrentCategoryList, function (category) {
                        return category.RecordId === options.categoryId;
                    });
                }
                _this.title(ProductsViewController._getTitle(options.category, options.categoryId));
                var viewModelOptions = {
                    activeMode: options.activeMode,
                    categoryId: options.categoryId,
                    category: options.category,
                    showProductDetailsHandler: _this.showProductDetails.bind(_this),
                    showProductsForCategoryHandler: _this.showProductsForCategory.bind(_this),
                    compareItemsHandler: _this._compareItems.bind(_this),
                    showCartHandler: _this._showCart.bind(_this),
                    correlationId: options.correlationId
                };
                _this.viewModel = new Commerce.ViewModels.ProductsViewModel(_this.createViewModelContext(), viewModelOptions);
                return _this;
            }
            ProductsViewController.prototype.onCreated = function (element) {
                var _this = this;
                _super.prototype.onCreated.call(this, element);
                this._clearListSelectionTrigger = this.viewModel.clearProductSelection.subscribe(function (newValue) {
                    if (newValue) {
                        _this._clearProductListSelection();
                    }
                });
            };
            ProductsViewController.prototype.onHidden = function () {
                this._clearListSelectionTrigger.dispose();
            };
            ProductsViewController.prototype.showRefinerDialog = function () {
                this.viewModel.filterProducts();
            };
            ProductsViewController.prototype.showProductDetails = function (product) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(product)) {
                    var simpleProductDetailsViewModelOptions = {
                        productId: product.RecordId,
                        product: undefined,
                        isSelectionMode: false,
                        correlationId: Commerce.StringExtensions.EMPTY
                    };
                    Commerce.ViewModelAdapter.navigate("SimpleProductDetailsView", simpleProductDetailsViewModelOptions);
                }
            };
            ProductsViewController.prototype.showProductsForCategory = function (activeMode, category) {
                var options = {
                    category: category,
                    activeMode: Commerce.ViewModels.ProductsViewModelActiveMode.Products,
                    correlationId: Commerce.StringExtensions.EMPTY
                };
                Commerce.ViewModelAdapter.navigate("ProductsView", options);
            };
            ProductsViewController._getTitle = function (category, categoryId) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(category)) {
                    Commerce.RetailLogger.viewsMerchandisingCategoryForCatalogViewTitleNotFound(categoryId);
                    return Commerce.StringExtensions.EMPTY;
                }
                else {
                    return Commerce.Formatters.CategoryNameTranslator(category);
                }
            };
            ProductsViewController.prototype._compareItems = function (categoryName, productIds) {
                var options = { productIds: productIds };
                Commerce.ViewModelAdapter.navigate("CompareProductsView", options);
            };
            ProductsViewController.prototype._showCart = function () {
                Commerce.ViewModelAdapter.navigate("CartView");
            };
            ProductsViewController.prototype._clearProductListSelection = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._dataListViewModel)) {
                    var listElement = document.getElementById(ProductsViewController._productsDataListId);
                    if (Commerce.ObjectExtensions.isNullOrUndefined(listElement)) {
                        Commerce.RetailLogger.viewsMerchandisingProductsViewDataListElementNotFound(ProductsViewController._productsDataListId);
                        return;
                    }
                    if (Commerce.ObjectExtensions.isNullOrUndefined(listElement.dataListViewModel)) {
                        Commerce.RetailLogger.viewsMerchandisingProductsViewDataListViewModelNotFound(ProductsViewController._productsDataListId);
                        return;
                    }
                    this._dataListViewModel = listElement.dataListViewModel;
                }
                this._dataListViewModel.clearAll();
            };
            ProductsViewController._productsDataListId = "productsViewList";
            return ProductsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ProductsViewController = ProductsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ReturnTransactionViewController = (function (_super) {
            __extends(ReturnTransactionViewController, _super);
            function ReturnTransactionViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                _this.title(ReturnTransactionViewController._getTitle(Commerce.ObjectExtensions.isNullOrUndefined(options) ? null : options.salesOrderToReturn));
                var viewModelOptions = {
                    orderSelectionHandler: _this._selectTransactionForReturn.bind(_this),
                    salesLineSelectionHandler: _this._selectSalesLines.bind(_this)
                };
                if (!Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(options.salesOrderToReturn)) {
                        viewModelOptions.salesOrder = options.salesOrderToReturn;
                    }
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(options.processing)) {
                        viewModelOptions.processing = options.processing;
                    }
                }
                _this.viewModel = new Commerce.ViewModels.ReturnTransactionViewModel(_this.createViewModelContext(), viewModelOptions);
                _this._onReturnSalesOrderSalesLines = null;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    _this._onReturnSalesOrderSalesLines = options.onReturnSalesOrderSalesLines;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(options.processing)) {
                        options.processing.subscribe(function (newValue) {
                            if (newValue) {
                                _this._disablePageEventsAsync();
                            }
                            else {
                                _this._enablePageEventsAsync();
                            }
                        });
                    }
                }
                if (Commerce.Config.isPhone) {
                    _this.salesLineColumns = [
                        { titleResx: "string_110", cssClass: "ratio6", field: "productName" },
                        { titleResx: "string_111", cssClass: "ratio2 textRight", field: "Quantity" },
                        {
                            titleResx: "string_1238", cssClass: "ratio2 textRight", field: "currencyAmount",
                            converter: "Commerce.Core.Converter.PriceFormatter"
                        }
                    ];
                }
                else {
                    _this.salesLineColumns = [
                        { titleResx: "string_4446", cssClass: "ratio1", field: "ItemId" },
                        { titleResx: "string_110", cssClass: "ratio5", field: "productName" },
                        { titleResx: "string_111", cssClass: "ratio2 textRight", field: "Quantity" },
                        {
                            titleResx: "string_1238", cssClass: "ratio2 textRight", field: "currencyAmount",
                            converter: "Commerce.Core.Converter.PriceFormatter"
                        }
                    ];
                }
                return _this;
            }
            ReturnTransactionViewController.prototype.onShown = function () {
                this._enablePageEventsAsync();
            };
            ReturnTransactionViewController.prototype.onHidden = function () {
                this._disablePageEventsAsync();
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._onReturnSalesOrderSalesLines)) {
                    this._onReturnSalesOrderSalesLines.resolve(null);
                }
            };
            ReturnTransactionViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            ReturnTransactionViewController.prototype.salesOrderLineListSelectionChangedEventHandler = function (items) {
                this.viewModel.selectedSalesLines(items);
            };
            ReturnTransactionViewController.prototype.returnSalesOrderLines = function (eventInfo) {
                if (this._onReturnSalesOrderSalesLines) {
                    var returnTransactionReturnLineData = {
                        salesOrder: this.viewModel.selectedSalesOrder(),
                        salesLines: this.viewModel.selectedSalesLines() || []
                    };
                    this._onReturnSalesOrderSalesLines.resolve(returnTransactionReturnLineData);
                }
            };
            ReturnTransactionViewController.prototype.selectAll = function () {
                this._getListViewViewModel().selectAllItems();
            };
            ReturnTransactionViewController.prototype.deselectAll = function () {
                this._getListViewViewModel().unselectAllItems();
            };
            ReturnTransactionViewController._getTitle = function (salesOrderToReturn) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(salesOrderToReturn)) {
                    return Commerce.ViewModelAdapter.getResourceString("string_1205");
                }
                else {
                    var titleFormatString = Commerce.ViewModelAdapter.getResourceString("string_1251");
                    return Commerce.StringExtensions.format(titleFormatString, salesOrderToReturn.ReceiptId);
                }
            };
            ReturnTransactionViewController.prototype._selectSalesLines = function (salesLines) {
                this._getListViewViewModel().selectItems(salesLines);
            };
            ReturnTransactionViewController.prototype._disablePageEventsAsync = function () {
                return Commerce.Peripherals.instance.barcodeScanner.disableAsync();
            };
            ReturnTransactionViewController.prototype._enablePageEventsAsync = function () {
                var _this = this;
                return Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    _this.viewModel.processBarcodeScanAsync(barcode);
                }).fail(function (errors) {
                    Commerce.RetailLogger.viewsReturnTransactionViewEnableBarcodeScannerFailed();
                });
            };
            ReturnTransactionViewController.prototype._selectTransactionForReturn = function (stores) {
                var _this = this;
                this._disablePageEventsAsync();
                var asyncResult = new Commerce.AsyncResult();
                asyncResult.always(function () {
                    _this._enablePageEventsAsync();
                });
                var returnMultipleTransactionDialog = new Commerce.Controls.ReturnMultipleTransactionDialog();
                returnMultipleTransactionDialog.show({ storeList: stores })
                    .on(Commerce.DialogResult.OK, function (result) {
                    asyncResult.resolve({ canceled: false, data: result.salesOrder });
                })
                    .on(Commerce.DialogResult.Cancel, function (result) {
                    asyncResult.resolve({ canceled: true, data: undefined });
                })
                    .onError(function (errors) {
                    asyncResult.reject(errors);
                });
                return asyncResult;
            };
            ReturnTransactionViewController.prototype._getListViewViewModel = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._listViewViewModel)) {
                    this._listViewViewModel = document.getElementById("salesOrderLinesView").listViewViewModel;
                }
                return this._listViewViewModel;
            };
            return ReturnTransactionViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ReturnTransactionViewController = ReturnTransactionViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var SearchPickingAndReceivingViewController = (function (_super) {
            __extends(SearchPickingAndReceivingViewController, _super);
            function SearchPickingAndReceivingViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_3700") }) || this;
                _this.viewModel = new Commerce.ViewModels.SearchPickingAndReceivingViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            SearchPickingAndReceivingViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            SearchPickingAndReceivingViewController.prototype.editPurchaseTransferOrder = function () {
                var parameters = {
                    JournalId: this.viewModel.selectedPurchaseTransferOrder().orderId,
                    JournalType: this.viewModel.selectedPurchaseTransferOrder().orderType,
                    IsAdvancedWarehousingEnabled: this.viewModel.isAdvancedWarehousingEnabled()
                };
                Commerce.ViewModelAdapter.navigate("PickingAndReceivingDetailsView", parameters);
            };
            SearchPickingAndReceivingViewController.prototype.editOrderClickHandler = function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.viewModel.selectedPurchaseTransferOrder())) {
                    if (this.viewModel.selectedPurchaseTransferOrder().orderType === Commerce.Proxy.Entities.PurchaseTransferOrderType.TransferIn ||
                        this.viewModel.selectedPurchaseTransferOrder().orderType === Commerce.Proxy.Entities.PurchaseTransferOrderType.TransferOut ||
                        this.viewModel.selectedPurchaseTransferOrder().orderType === Commerce.Proxy.Entities.PurchaseTransferOrderType.TransferOrder) {
                        var parameters = {
                            TransferId: this.viewModel.selectedPurchaseTransferOrder().orderId
                        };
                        Commerce.ViewModelAdapter.navigate("TransferOrderDetailsView", parameters);
                    }
                }
            };
            return SearchPickingAndReceivingViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.SearchPickingAndReceivingViewController = SearchPickingAndReceivingViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var SearchStockCountViewController = (function (_super) {
            __extends(SearchStockCountViewController, _super);
            function SearchStockCountViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_3300") }) || this;
                _this.viewModel = new Commerce.ViewModels.SearchStockCountViewModel(_this.createViewModelContext());
                _this.deleteJournalsDisabled = ko.observable(true);
                _this.editJournalDisabled = ko.observable(true);
                _this.createJournalDisabled = ko.observable(false);
                return _this;
            }
            SearchStockCountViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            SearchStockCountViewController.prototype.getJournals = function () {
                this.viewModel.getStockCountJournalsAsync().fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            SearchStockCountViewController.prototype.deleteJournals = function () {
                var _this = this;
                this.viewModel.selectedJournals = this._selectedJournals;
                this.viewModel.deleteJournalsAsync().done(function () {
                    _this.getJournals();
                }).fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            SearchStockCountViewController.prototype.createJournal = function () {
                var parameters = {
                    IsAdvancedWarehousingEnabled: this.viewModel.isAdvancedWarehousingEnabled()
                };
                Commerce.ViewModelAdapter.navigate("StockCountDetailsView", parameters);
            };
            SearchStockCountViewController.prototype.editJournal = function () {
                var parameters = {
                    JournalId: this._selectedJournals[0].JournalId,
                    IsAdvancedWarehousingEnabled: this.viewModel.isAdvancedWarehousingEnabled()
                };
                Commerce.ViewModelAdapter.navigate("StockCountDetailsView", parameters);
            };
            SearchStockCountViewController.prototype.syncAllJournals = function () {
                this.viewModel.syncAllJournalsAsync().fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            SearchStockCountViewController.prototype.stockCountListSelectionChanged = function (items) {
                this._selectedJournals = items;
                var numJournalsSelected = items.length;
                this.deleteJournalsDisabled(numJournalsSelected < 1);
                this.editJournalDisabled(numJournalsSelected !== 1);
            };
            return SearchStockCountViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.SearchStockCountViewController = SearchStockCountViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var SimpleProductDetailsViewController = (function (_super) {
            __extends(SimpleProductDetailsViewController, _super);
            function SimpleProductDetailsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_919") }) || this;
                var simpleProductDetailsOptions;
                if (options instanceof Commerce.Client.Entities.SimpleProductDetailsNavigationParameters) {
                    simpleProductDetailsOptions = {
                        productId: options.productId,
                        product: undefined,
                        isSelectionMode: false,
                        correlationId: Commerce.StringExtensions.EMPTY
                    };
                }
                else {
                    simpleProductDetailsOptions = options;
                }
                Commerce.RetailLogger.viewsMerchandisingProductDetailsLoadStarted();
                var viewModelOptions = {
                    productId: simpleProductDetailsOptions.productId,
                    product: simpleProductDetailsOptions.product,
                    isSelectionMode: simpleProductDetailsOptions.isSelectionMode,
                    selectionOptions: simpleProductDetailsOptions.selectionOptions,
                    addToCartOptions: simpleProductDetailsOptions.addToCartOptions,
                    expandImageHandler: function (images) {
                        _this._navigateToRichMediaView(images);
                    },
                    channelId: simpleProductDetailsOptions.channelId,
                    correlationId: simpleProductDetailsOptions.correlationId
                };
                _this._isFirstTimeViewIsShown = true;
                _this._pageLoadCorrelationId = Commerce.LoggerHelper.getFormattedCorrelationId(simpleProductDetailsOptions);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(viewModelOptions.addToCartOptions)) {
                    if (!Commerce.StringExtensions.isNullOrWhitespace(viewModelOptions.addToCartOptions.trackingId)) {
                        Commerce.RetailLogger.viewsMerchandisingProductDetailsFromRecommendation(viewModelOptions.addToCartOptions.trackingId, viewModelOptions.productId);
                    }
                    viewModelOptions.addToCartOptions.quantity = viewModelOptions.addToCartOptions.quantity || 0;
                }
                _this.viewModel = new Commerce.ViewModels.SimpleProductDetailsViewModel(_this.createViewModelContext(), viewModelOptions);
                return _this;
            }
            SimpleProductDetailsViewController.prototype.onShown = function () {
                this.viewModel.ignoreSelectionModeCancelation = false;
            };
            SimpleProductDetailsViewController.prototype.onHidden = function () {
                this.viewModel.cancelProductSelection();
            };
            SimpleProductDetailsViewController.prototype.afterShown = function () {
                var correlationId;
                if (this._isFirstTimeViewIsShown) {
                    correlationId = this._pageLoadCorrelationId;
                    this._isFirstTimeViewIsShown = false;
                }
                else {
                    correlationId = Commerce.StringExtensions.EMPTY;
                }
                Commerce.RetailLogger.viewsMerchandisingProductDetailsIsVisible(correlationId);
            };
            SimpleProductDetailsViewController.prototype.onNavigateBack = function () {
                this.viewModel.ignoreSelectionModeCancelation = true;
                return true;
            };
            SimpleProductDetailsViewController.prototype.load = function () {
                this.viewModel.loadAsync(this._pageLoadCorrelationId);
            };
            SimpleProductDetailsViewController.prototype._navigateToRichMediaView = function (images) {
                this.viewModel.ignoreSelectionModeCancelation = true;
                var options = {
                    images: images
                };
                Commerce.ViewModelAdapter.navigate("ProductRichMediaView", options);
            };
            return SimpleProductDetailsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.SimpleProductDetailsViewController = SimpleProductDetailsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var StockCountDetailsViewController = (function (_super) {
            __extends(StockCountDetailsViewController, _super);
            function StockCountDetailsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_3301") }, false) || this;
                _this._options = options || { IsAdvancedWarehousingEnabled: false };
                _this.viewModel = new Commerce.ViewModels.StockCountDetailsViewModel(_this.createViewModelContext(), _this._options);
                _this.viewModel.isJournalSaved = ko.observable(!Commerce.ObjectExtensions.isNullOrUndefined(_this._options.JournalId));
                _this.viewSubTitle = Commerce.ViewModelAdapter.getResourceString("string_3370");
                return _this;
            }
            StockCountDetailsViewController.prototype.load = function () {
                var _this = this;
                this.viewModel.loadJournal()
                    .done(function () {
                    var pageTitle = _this.viewModel.journalId();
                    if (Commerce.StringExtensions.isNullOrWhitespace(pageTitle)) {
                        pageTitle = Commerce.ViewModelAdapter.getResourceString("string_3302");
                    }
                    _this.viewSubTitle = pageTitle;
                }).fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            StockCountDetailsViewController.prototype.onShown = function () {
                var _this = this;
                if (this.viewModel.isAdvancedWarehousingEnabled) {
                    if (Commerce.StringExtensions.isNullOrWhitespace(this.viewModel.currentLocationId())) {
                        this.viewModel.showLocationDialogAsync();
                    }
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(this._options.Product) && !this.viewModel.estimatedOnHandInventoryFeatureIsEnabled) {
                    this.viewModel.addNewProductHandler();
                }
                Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    _this.viewModel.enterProductAsync(barcode);
                });
                this._subscriptionListData = this.viewModel.selectedIndex.subscribe(function (newValue) {
                    _this.selectionIndexChanged(newValue);
                });
            };
            StockCountDetailsViewController.prototype.onHidden = function () {
                Commerce.Peripherals.instance.barcodeScanner.disableAsync();
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._subscriptionListData)) {
                    this._subscriptionListData.dispose();
                }
            };
            StockCountDetailsViewController.prototype.closeJournal = function () {
                if (!this.viewModel.isJournalSaved()) {
                    Commerce.ViewModelAdapter.displayMessage("string_3386", Commerce.MessageType.Error, Commerce.MessageBoxButtons.Default, "string_3385");
                }
                else {
                    Commerce.ViewModelAdapter.navigate("SearchStockCountView");
                }
            };
            StockCountDetailsViewController.prototype.selectionIndexChanged = function (newValue) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.dataListViewModel)) {
                    return;
                }
                if (newValue >= 0) {
                    this.dataListViewModel.selectIndex(newValue);
                }
                else {
                    this.dataListViewModel.clearAll();
                }
            };
            Object.defineProperty(StockCountDetailsViewController.prototype, "dataListViewModel", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._dataListViewModel)) {
                        this._dataListViewModel = document.getElementById(StockCountDetailsViewController._listViewContainerName).dataListViewModel;
                    }
                    return this._dataListViewModel;
                },
                enumerable: true,
                configurable: true
            });
            StockCountDetailsViewController._listViewContainerName = "stockCountDetailsView_dataList";
            return StockCountDetailsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.StockCountDetailsViewController = StockCountDetailsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var StoreDetailsViewController = (function (_super) {
            __extends(StoreDetailsViewController, _super);
            function StoreDetailsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                _this._storeNumber = 1;
                _this._messageEventListener = null;
                _this._bingMapsElementId = "storeDetailsMap";
                _this._eventListenerRegistered = false;
                _this.viewModel = new Commerce.ViewModels.StoreDetailsViewModel(_this.createViewModelContext(), options);
                _this._isMapLoaded = false;
                _this._mapInitializing = ko.observable(true);
                _this.viewModel.isBusyWhen(ko.computed(function () { return _this._mapInitializing(); }));
                _this._storeDetailsVisible = ko.observable(false);
                _this.title(_this._getNewTitle(_this.viewModel.storeDetails()));
                _this._storeDetailsSubscription = _this.viewModel.storeDetails.subscribe(function (newStoreDetails) {
                    _this.title(_this._getNewTitle(newStoreDetails));
                });
                return _this;
            }
            StoreDetailsViewController.prototype.dispose = function () {
                this._storeDetailsSubscription.dispose();
                _super.prototype.dispose.call(this);
            };
            StoreDetailsViewController.prototype.load = function () {
                if (this.viewModel.showMap()) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(document.getElementById(this._bingMapsElementId))) {
                        this._map = this._createBingsMapController();
                        this._addBingMapsListener();
                        this._eventListenerRegistered = true;
                    }
                }
                else {
                    this._map = new Commerce.NullMapController();
                    this._onMapLoaded();
                }
            };
            StoreDetailsViewController.prototype.unload = function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._map)) {
                    this._map.dispose();
                }
                _super.prototype.unload.call(this);
            };
            StoreDetailsViewController.prototype.popupMapInfobox = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._storeLocation)) {
                    return;
                }
                var orgUnitLocation = Commerce.Proxy.Entities.StoreLocationWrapper.convertToOrgUnitLocation(this.viewModel.storeDetails());
                orgUnitLocation.Longitude = this._storeLocation.Longitude;
                orgUnitLocation.Latitude = this._storeLocation.Latitude;
                var storeWrapper = new Commerce.Proxy.Entities.StoreLocationWrapper(orgUnitLocation);
                this._map.addStoreInfobox(storeWrapper, false);
            };
            StoreDetailsViewController.prototype.onShown = function () {
                if (this._eventListenerRegistered) {
                    this._eventListenerRegistered = false;
                    return;
                }
                this._addBingMapsListener();
            };
            StoreDetailsViewController.prototype.onHidden = function () {
                this.viewModel.cancelSelection();
            };
            StoreDetailsViewController.prototype._mapSearchSuccess = function (data) {
                this._storeLocation = {
                    Latitude: data.searchResult.location.latitude,
                    Longitude: data.searchResult.location.longitude
                };
                this._map.setMapView(this._storeLocation);
                this._map.addMapPin(this._storeLocation.Latitude, this._storeLocation.Longitude, this._storeNumber.toString());
            };
            StoreDetailsViewController.prototype._mapError = function (msg) {
                this._mapInitializing(false);
                console.log(msg.message);
                var errors = [new Commerce.Proxy.Entities.Error("string_29015")];
                Commerce.NotificationHandler.displayClientErrors(errors);
            };
            Object.defineProperty(StoreDetailsViewController.prototype, "_currentStoreAddress", {
                get: function () {
                    var currentStoreAddress = Commerce.StringExtensions.EMPTY;
                    var orgUnit = this.viewModel.storeDetails();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(orgUnit) && !Commerce.ObjectExtensions.isNullOrUndefined(orgUnit.OrgUnitAddress)) {
                        var addressLines = Commerce.AddressHelper.getFormattedAddress(orgUnit.OrgUnitAddress);
                        currentStoreAddress = addressLines.join();
                    }
                    return currentStoreAddress;
                },
                enumerable: true,
                configurable: true
            });
            StoreDetailsViewController.prototype._onMapLoaded = function () {
                var _this = this;
                if (this._isMapLoaded) {
                    return;
                }
                this.viewModel.getStoreDetails()
                    .done(function () {
                    _this._isMapLoaded = true;
                    _this._map.searchByAddress(_this._currentStoreAddress);
                    _this.viewModel.getStoreDistance()
                        .done(function () {
                        _this._storeDetailsVisible(true);
                        _this._mapInitializing(false);
                    })
                        .fail(function (errors) {
                        _this._mapInitializing(false);
                        Commerce.NotificationHandler.displayClientErrors(errors);
                    });
                })
                    .fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                    _this._mapInitializing(false);
                });
            };
            StoreDetailsViewController.prototype._addBingMapsListener = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._messageEventListener)) {
                    this._messageEventListener = this._map.processMessage.bind(this._map);
                }
                this._map.addMessageEventListener(this._messageEventListener);
            };
            StoreDetailsViewController.prototype._createBingsMapController = function () {
                var mapElement = Commerce.Controls.Bing.MapController.createBingMapsElement("storeDetailsMapContent", this._bingMapsElementId, "height400 grow positionRelative", "resx: { ariaLabel: 'string_2552' }");
                this._mapHandlers = new Commerce.Dictionary();
                this._mapHandlers.setItem(Commerce.Controls.Bing.MapEvents.LOADED, this._onMapLoaded);
                this._mapHandlers.setItem(Commerce.Controls.Bing.MapEvents.ERROR, this._mapError);
                this._mapHandlers.setItem(Commerce.Controls.Bing.MapEvents.INITIALIZATION_ERROR, this._mapError);
                this._mapHandlers.setItem(Commerce.Controls.Bing.MapEvents.SEARCH_SUCCESS, this._mapSearchSuccess);
                return new Commerce.Controls.Bing.MapController(this, mapElement, this._mapHandlers);
            };
            StoreDetailsViewController.prototype._getNewTitle = function (newStoreDetails) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(newStoreDetails)) {
                    return Commerce.StringExtensions.EMPTY;
                }
                else {
                    var storeName = newStoreDetails.OrgUnitName;
                    var storeNumber = newStoreDetails.OrgUnitNumber;
                    return Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_610"), storeNumber, storeName);
                }
            };
            return StoreDetailsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.StoreDetailsViewController = StoreDetailsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var TransferOrderDetailsViewController = (function (_super) {
            __extends(TransferOrderDetailsViewController, _super);
            function TransferOrderDetailsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_3396") }, false) || this;
                _this.viewModel = new Commerce.ViewModels.TransferOrderDetailsViewModel(_this.createViewModelContext(), options);
                _this.title(_this._getNewTitle(_this.viewModel.transferOrder()));
                _this._transferOrderSubscription = _this.viewModel.transferOrder.subscribe(function (newTransferOrder) {
                    _this.title(_this._getNewTitle(newTransferOrder));
                });
                return _this;
            }
            TransferOrderDetailsViewController.prototype.dispose = function () {
                this._transferOrderSubscription.dispose();
                _super.prototype.dispose.call(this);
            };
            TransferOrderDetailsViewController.prototype.load = function () {
                this.viewModel.loadTransferOrder();
            };
            TransferOrderDetailsViewController.prototype.onShown = function () {
                var _this = this;
                Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    _this.viewModel.onProductSearchTextChange(barcode, Commerce.LoggerHelper.getNewCorrelationId());
                });
                this._dataListSubscription = this.viewModel.selectedOrderLine
                    .subscribe(function (newValue) {
                    _this.selectionIndexChanged(newValue);
                });
            };
            TransferOrderDetailsViewController.prototype.onHidden = function () {
                Commerce.Peripherals.instance.barcodeScanner.disableAsync();
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._dataListSubscription)) {
                    this._dataListSubscription.dispose();
                }
            };
            TransferOrderDetailsViewController.prototype.selectionIndexChanged = function (selectedTransferOrderLine) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.dataListViewModel)) {
                    return;
                }
                var index = this.viewModel.orderLines().indexOf(selectedTransferOrderLine);
                if (index >= 0) {
                    this.dataListViewModel.selectIndex(index);
                }
                else {
                    this.dataListViewModel.clearAll();
                }
            };
            Object.defineProperty(TransferOrderDetailsViewController.prototype, "dataListViewModel", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._dataListViewModel)) {
                        this._dataListViewModel = document.getElementById(TransferOrderDetailsViewController.LIST_VIEW_CONTAINER_NAME).dataListViewModel;
                    }
                    return this._dataListViewModel;
                },
                enumerable: true,
                configurable: true
            });
            TransferOrderDetailsViewController.prototype._getNewTitle = function (newTransferOrder) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(newTransferOrder)) {
                    return Commerce.ViewModelAdapter.getResourceString("string_3396");
                }
                else {
                    if (newTransferOrder.OrderTypeValue === Commerce.Proxy.Entities.PurchaseTransferOrderType.TransferIn) {
                        return Commerce.ViewModelAdapter.getResourceString("string_3863");
                    }
                    else if (newTransferOrder.OrderTypeValue === Commerce.Proxy.Entities.PurchaseTransferOrderType.TransferOut) {
                        return Commerce.ViewModelAdapter.getResourceString("string_3864");
                    }
                    else {
                        return Commerce.ViewModelAdapter.getResourceString("string_3396");
                    }
                }
            };
            TransferOrderDetailsViewController.LIST_VIEW_CONTAINER_NAME = "transferOrderDetailsView_dataList";
            return TransferOrderDetailsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.TransferOrderDetailsViewController = TransferOrderDetailsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var IssueLoyaltyCardViewController = (function (_super) {
            __extends(IssueLoyaltyCardViewController, _super);
            function IssueLoyaltyCardViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_4700") }) || this;
                _this.viewModel = new Commerce.ViewModels.IssueLoyaltyCardViewModel(_this.createViewModelContext(), options);
                _this._cancelSelectionHandlerOnHidden = true;
                _this.issueLoyaltyCardAppBarCommandLabelResourceId
                    = _this.viewModel.allowAddToTransaction ? "string_4705" : "string_4707";
                return _this;
            }
            IssueLoyaltyCardViewController.prototype.onShown = function () {
                this.enablePageEvents();
                this._cancelSelectionHandlerOnHidden = true;
            };
            IssueLoyaltyCardViewController.prototype.onHidden = function () {
                this.disablePageEvents();
                if (this._cancelSelectionHandlerOnHidden) {
                    this.viewModel.selectionHandler.cancel();
                }
            };
            IssueLoyaltyCardViewController.prototype.disablePageEvents = function () {
                Commerce.Peripherals.instance.magneticStripeReader.disableAsync(Commerce.Peripherals.HardwareStation.LongPollingSupportedEventsSourceTypes.LOYALTY);
                Commerce.Peripherals.instance.barcodeScanner.disableAsync();
                this.disableNumPad();
            };
            IssueLoyaltyCardViewController.prototype.enablePageEvents = function () {
                var _this = this;
                Commerce.Peripherals.instance.magneticStripeReader.enableAsync(function (cardInfo) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(cardInfo.CardNumber)) {
                        _this.viewModel.updateLoyaltyCard(cardInfo.CardNumber);
                    }
                }, Commerce.Peripherals.HardwareStation.LongPollingSupportedEventsSourceTypes.LOYALTY);
                Commerce.Peripherals.instance.barcodeScanner.enableAsync(function (barcode) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(barcode)) {
                        _this.viewModel.updateLoyaltyCard(barcode);
                    }
                });
                this.enableNumPad();
            };
            IssueLoyaltyCardViewController.prototype.navigateToCustomerDetails = function () {
                var _this = this;
                this._cancelSelectionHandlerOnHidden = false;
                var customerSelectionHandler = new Commerce.CancelableSelectionHandler(function (customer) {
                    var returnOptions = {
                        customer: customer,
                        loyaltyCard: _this.viewModel.loyaltyCard,
                        selectionHandler: _this.viewModel.selectionHandler,
                        allowSwitchCustomer: _this.viewModel.allowSwitchCustomer,
                        allowAddToTransaction: _this.viewModel.allowAddToTransaction
                    };
                    Commerce.ViewModelAdapter.collapseAndNavigate("IssueLoyaltyCardView", returnOptions);
                }, function () {
                    _this._cancelAndCollapseNavigationHistoryIfNotInView();
                });
                var parameters = {
                    accountNumber: this.viewModel.customerAccountNumber(),
                    correlationId: Commerce.StringExtensions.EMPTY,
                    customerSelectionOptions: {
                        customerSelectionHandler: customerSelectionHandler
                    }
                };
                Commerce.ViewModelAdapter.navigate("CustomerDetailsView", parameters);
            };
            IssueLoyaltyCardViewController.prototype.activateLoyaltyCard = function () {
                this.viewModel.activateLoyaltyCardAsync(false);
            };
            IssueLoyaltyCardViewController.prototype.issueLoyaltyCard = function (numPadResult) {
                this.viewModel.activateLoyaltyCardAndAddToTransactionIfAllowed();
            };
            IssueLoyaltyCardViewController.prototype.issueLoyaltyCardAndAddToTransaction = function () {
                this.viewModel.activateLoyaltyCardAsync(true);
            };
            IssueLoyaltyCardViewController.prototype.searchCustomers = function () {
                var _this = this;
                this._cancelSelectionHandlerOnHidden = false;
                var localCustomer;
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                var customerSelectionHandler = new Commerce.CancelableSelectionHandler(function (customer) {
                    var returnOptions = {
                        customer: localCustomer,
                        loyaltyCard: _this.viewModel.loyaltyCard,
                        selectionHandler: _this.viewModel.selectionHandler,
                        allowSwitchCustomer: _this.viewModel.allowSwitchCustomer,
                        allowAddToTransaction: _this.viewModel.allowAddToTransaction
                    };
                    Commerce.ViewModelAdapter.collapseAndNavigate("IssueLoyaltyCardView", returnOptions);
                }, function () {
                    _this._cancelAndCollapseNavigationHistoryIfNotInView();
                }, function (customer) {
                    return Commerce.CustomerHelper.crossCompanyCustomerTransferAsync(correlationId, customer)
                        .map(function (customerResult) {
                        localCustomer = customerResult;
                        return { canceled: false };
                    });
                });
                var options = {
                    searchEntity: Commerce.ViewModels.SearchViewSearchEntity.Customer,
                    selectionMode: Commerce.ViewModels.SearchViewSelectionMode.Customer,
                    customerSelectionOptions: {
                        customerSelectionHandler: customerSelectionHandler,
                        isOnlySelectionAllowed: false
                    },
                    correlationId: correlationId
                };
                Commerce.ViewModelAdapter.navigate("SearchView", options);
            };
            IssueLoyaltyCardViewController.prototype.createNewCustomer = function () {
                var _this = this;
                this._cancelSelectionHandlerOnHidden = false;
                var customerSelectionHandler = new Commerce.CancelableSelectionHandler(function (customer) {
                    if (!Commerce.ViewModelAdapter.isInView("IssueLoyaltyCardView")) {
                        var returnOptions = {
                            customer: customer,
                            loyaltyCard: _this.viewModel.loyaltyCard,
                            selectionHandler: _this.viewModel.selectionHandler,
                            allowSwitchCustomer: _this.viewModel.allowSwitchCustomer,
                            allowAddToTransaction: _this.viewModel.allowAddToTransaction
                        };
                        Commerce.ViewModelAdapter.collapseAndNavigate("IssueLoyaltyCardView", returnOptions);
                    }
                }, function () {
                    _this._cancelAndCollapseNavigationHistoryIfNotInView();
                });
                var customerAddOptions = {
                    customerSelectionHandler: customerSelectionHandler
                };
                Commerce.Operations.OperationsManager.instance.runOperation(Commerce.Operations.RetailOperation.CustomerAdd, customerAddOptions)
                    .fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                });
            };
            IssueLoyaltyCardViewController.prototype._cancelAndCollapseNavigationHistoryIfNotInView = function () {
                if (!Commerce.ViewModelAdapter.isInView("IssueLoyaltyCardView")) {
                    this.viewModel.selectionHandler.cancel();
                    Commerce.ViewModelAdapter.collapse("IssueLoyaltyCardView");
                }
            };
            return IssueLoyaltyCardViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.IssueLoyaltyCardViewController = IssueLoyaltyCardViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        var ManageChargesViewController = (function (_super) {
            __extends(ManageChargesViewController, _super);
            function ManageChargesViewController(context) {
                var _this = _super.call(this, context, { title: Commerce.ViewModelAdapter.getResourceString("string_5945") }) || this;
                _this.viewModel = new Commerce.ViewModels.ManageChargesViewModel(_this.createViewModelContext());
                return _this;
            }
            ManageChargesViewController.prototype.load = function () {
                this.viewModel.load();
            };
            return ManageChargesViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ManageChargesViewController = ManageChargesViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var PaymentViewController = (function (_super) {
            __extends(PaymentViewController, _super);
            function PaymentViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw new Error("Invalid options passed to the PaymentView constructor: options cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.tenderType)) {
                    throw new Error("Invalid options passed to the PaymentView constructor: tenderType cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(options.fullAmountDue)) {
                    throw new Error("Invalid options passed to PaymentView: fullAmountDue cannot be null or undefined.");
                }
                _this.title(options.tenderType.Name);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(options.cardPaymentOptions)) {
                    options.cardPaymentOptions.sendMessageToCardPaymentAcceptPage = _this._sendMessageToCardPaymentAcceptPage;
                    options.cardPaymentOptions.getStylizedCardPaymentAcceptPageUrl = _this._getStylizedCardPaymentAcceptPageUrl.bind(_this);
                }
                _this.viewModel = new Commerce.ViewModels.PaymentViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            PaymentViewController.prototype.load = function () {
                if (this.viewModel.paymentMethodViewModel instanceof Commerce.ViewModels.PayCardPaymentMethodViewModel) {
                    this._cardPaymentAcceptPageMessageHandler = this.viewModel.paymentMethodViewModel.cardPaymentAcceptPageMessageHandler
                        .bind(this.viewModel.paymentMethodViewModel);
                    this._addCardPaymentAcceptPageListener();
                }
                this.viewModel.loadAsync();
            };
            PaymentViewController.prototype.onShown = function () {
                this.enableNumPad();
                this.viewModel.onShown();
            };
            PaymentViewController.prototype.afterBind = function () {
                this.viewModel.afterBind();
            };
            PaymentViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
                this.disableNumPad();
                if (this.viewModel.paymentMethodViewModel instanceof Commerce.ViewModels.PayCardPaymentMethodViewModel) {
                    this._removeCardPaymentAcceptPageListener();
                }
            };
            PaymentViewController.prototype.tenderPaymentClickHandlerAsync = function () {
                Commerce.RetailLogger.posTenderPaymentButtonClicked(this.viewModel.paymentMethodViewModel.correlationId);
                return this.viewModel.tenderPaymentAsync();
            };
            PaymentViewController.prototype.numpadEnterClickHandlerAsync = function () {
                Commerce.RetailLogger.posPaymentViewNumpadEnterButtonClicked(this.viewModel.paymentMethodViewModel.correlationId);
                return this.viewModel.tenderPaymentAsync();
            };
            PaymentViewController.prototype.denominationClickHandlerAsync = function (itemSelected) {
                Commerce.RetailLogger.posDenominationButtonClicked(this.viewModel.paymentMethodViewModel.correlationId, itemSelected.Amount);
                return this.viewModel.addDenominationAsync(itemSelected);
            };
            PaymentViewController.prototype.getDenominationListGroupInfo = function () {
                var groupInfo = {
                    enableCellSpanning: true,
                    cellWidth: PaymentViewController.DENOMINATION_LIST_CARD_SIZE,
                    cellHeight: PaymentViewController.DENOMINATION_LIST_CARD_SIZE
                };
                return groupInfo;
            };
            PaymentViewController.prototype.getDenominationListItemInfo = function (itemIndex) {
                var denominations = this.viewModel.paymentMethodViewModel.currencyDenominationList();
                var denomLength = denominations[itemIndex].Amount.toString().length;
                var numBlocks = Math.ceil(denomLength / 5);
                var itemInfo = {
                    width: numBlocks === 0 ? 0 : Math.round(PaymentViewController.DENOMINATION_LIST_CARD_SIZE * numBlocks) + Math.round(10 * (numBlocks - 1)),
                    height: PaymentViewController.DENOMINATION_LIST_CARD_SIZE
                };
                return itemInfo;
            };
            PaymentViewController.prototype._removeCardPaymentAcceptPageListener = function () {
                window.removeEventListener("message", this._cardPaymentAcceptPageMessageHandler, false);
            };
            PaymentViewController.prototype._addCardPaymentAcceptPageListener = function () {
                this._removeCardPaymentAcceptPageListener();
                window.addEventListener("message", this._cardPaymentAcceptPageMessageHandler, false);
            };
            PaymentViewController.prototype._sendMessageToCardPaymentAcceptPage = function (message, messageOrigin) {
                var cardPaymentAcceptIframe = document.getElementById("cardPaymentAcceptFrame");
                cardPaymentAcceptIframe.contentWindow.postMessage(message, messageOrigin);
                Commerce.RetailLogger.posCardPaymentAcceptPageMessageSent(message);
            };
            PaymentViewController.prototype._getStylizedCardPaymentAcceptPageUrl = function (cardPaymentAcceptPageUrl, cardPaymentAcceptPageSubmitUrl) {
                var paymentAcceptUrl = null;
                if (!Commerce.StringExtensions.isNullOrWhitespace(cardPaymentAcceptPageSubmitUrl)) {
                    paymentAcceptUrl = cardPaymentAcceptPageUrl;
                }
                else {
                    var bodyElement = $(document).find("body");
                    var bodyBackgroundColor = this._convertToHexColor(bodyElement.css("background-color"));
                    var textElement = $(this.getViewContainer()).find("#sampleText");
                    var textBackgroundColor = this._convertToHexColor(textElement.css("background-color"));
                    var textColor = this._convertToHexColor(textElement.css("color"));
                    var textFontSize = textElement.css("font-size");
                    var labelElement = $(this.getViewContainer()).find("#sampleLabel");
                    var labelColor = this._convertToHexColor(labelElement.css("color"));
                    var textFontFamilyString = labelElement.css("font-family").replace(/\"/g, "").replace(/\'/g, "");
                    paymentAcceptUrl = cardPaymentAcceptPageUrl
                        + "&pagebackgroundcolor=" + encodeURIComponent(bodyBackgroundColor)
                        + "&disabledtextbackgroundcolor=" + encodeURIComponent(bodyBackgroundColor)
                        + "&labelcolor=" + encodeURIComponent(labelColor)
                        + "&textbackgroundcolor=" + encodeURIComponent(textBackgroundColor)
                        + "&textcolor=" + encodeURIComponent(textColor)
                        + "&fontsize=" + encodeURIComponent(textFontSize)
                        + "&fontfamily=" + encodeURIComponent(textFontFamilyString)
                        + "&pagewidth=320px"
                        + "&columnnumber=1";
                }
                return paymentAcceptUrl;
            };
            PaymentViewController.prototype._convertToHexColor = function (color) {
                if (color.indexOf("#") !== -1) {
                    return color;
                }
                color = color
                    .replace("rgba", "")
                    .replace("rgb", "")
                    .replace("(", "")
                    .replace(")", "");
                var colorObj = color.split(",");
                return "#"
                    + ("0" + parseInt(colorObj[0], 10).toString(16)).slice(-2)
                    + ("0" + parseInt(colorObj[1], 10).toString(16)).slice(-2)
                    + ("0" + parseInt(colorObj[2], 10).toString(16)).slice(-2);
            };
            PaymentViewController.DENOMINATION_LIST_CARD_SIZE = 120;
            return PaymentViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.PaymentViewController = PaymentViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ReportDetailsViewController = (function (_super) {
            __extends(ReportDetailsViewController, _super);
            function ReportDetailsViewController(context, report) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                _this.title(ReportDetailsViewController._getTitle());
                _this.summaryReportOptions = ko.observable(null);
                _this._summaryColumns = ko.observableArray([]);
                _this._parsedChartsData = [];
                _this._content = ko.observableArray([]);
                _this._titles = [];
                _this._charts = [];
                _this.viewModel = new Commerce.ViewModels.ReportDetailsViewModel(_this.createViewModelContext(), report);
                return _this;
            }
            ReportDetailsViewController.prototype.load = function () {
                this.getReportFilterValuesAsync();
            };
            ReportDetailsViewController.prototype.getReportFilterValuesAsync = function () {
                var _this = this;
                this.viewModel.getReportFilterValuesAsync()
                    .done(function (result) {
                    if (!result.canceled) {
                        _this._createHighCharts(result.data);
                    }
                });
            };
            ReportDetailsViewController.prototype.dispose = function () {
                if (Commerce.ArrayExtensions.hasElements(this._charts)) {
                    this._charts.forEach(function (chart) {
                        if (Commerce.ObjectExtensions.isFunction(chart.destroy)) {
                            chart.destroy();
                        }
                    });
                }
                _super.prototype.dispose.call(this);
            };
            ReportDetailsViewController._getTitle = function () {
                var title = Commerce.Session.instance.connectionStatus === Commerce.Client.Entities.ConnectionStatusType.Online ?
                    Commerce.ViewModelAdapter.getResourceString("string_2409") :
                    Commerce.ViewModelAdapter.getResourceString("string_2410");
                return title;
            };
            ReportDetailsViewController.prototype._createHighCharts = function (reportDataSet) {
                if (Commerce.ArrayExtensions.hasElements(reportDataSet.Output)) {
                    this.viewModel.totalColumns([]);
                    this.summaryReportOptions(null);
                    this._titles = [];
                    this._parsedChartsData = [];
                    this._content([]);
                    this._charts = [];
                    this._summaryColumns([]);
                    this.viewModel.visibleReportResults(false);
                    this._createReportsData(reportDataSet);
                    this.viewModel.visibleReportResults(true);
                    this._loadHighChart();
                }
                else {
                    Commerce.NotificationHandler.displayErrorMessage("string_2403");
                    this.viewModel.visibleReportResults(false);
                }
            };
            ReportDetailsViewController.prototype._createReportsData = function (reportDataSet) {
                this._stepVal = Math.floor(reportDataSet.Output.length / 7) + 1;
                for (var j = 0; j < reportDataSet.Output[0].RowData.length; j++) {
                    var rowCol = reportDataSet.Output[0].RowData[j];
                    var series = { name: rowCol.Key, data: [] };
                    this._parsedChartsData.push(series);
                    this._titles.push(rowCol.Key);
                }
                for (var i = 0; i < reportDataSet.Output.length; i++) {
                    if (Commerce.ArrayExtensions.hasElements(reportDataSet.Output[i].RowData)) {
                        var values = {};
                        var currencyCode = Commerce.StringExtensions.EMPTY;
                        for (var j = 0; j < this._titles.length; j++) {
                            var chartValue = this.viewModel.getCommercePropertyValue(reportDataSet.Output[i].RowData[j].Value);
                            if (!reportDataSet.HasTotalRow || i !== reportDataSet.Output.length - 1) {
                                this._parsedChartsData[j].data.push(chartValue);
                            }
                            if (reportDataSet.Output[i].RowData[j].Key === "Currency" && typeof (chartValue) === "string") {
                                currencyCode = chartValue;
                            }
                            var currentValue = chartValue;
                            var isNumber = false;
                            if (j !== 0 && typeof (currentValue) === "number") {
                                currentValue = Commerce.NumberExtensions.formatNumber(currentValue, Commerce.NumberExtensions.getDecimalPrecision(currencyCode));
                                isNumber = true;
                            }
                            values["Data" + j.toString()] = currentValue;
                            values["DataIsNumber" + j.toString()] = isNumber;
                        }
                        this._content.push(values);
                    }
                }
                var summaryContentData = this._content();
                var totalRow;
                if (Commerce.ArrayExtensions.hasElements(summaryContentData)) {
                    totalRow = summaryContentData[summaryContentData.length - 1];
                }
                for (var j = 0; j < this._titles.length; j++) {
                    var cssClass = "width252 ellipsis";
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(totalRow)) {
                        if (totalRow["DataIsNumber" + j.toString()]) {
                            cssClass = "width152 ellipsis textRight";
                        }
                    }
                    var summaryColumn = {
                        title: this._titles[j],
                        cssClass: cssClass,
                        field: "Data" + j.toString()
                    };
                    if (reportDataSet.HasTotalRow) {
                        var val = totalRow["DataIsNumber" + j.toString()] ? totalRow["Data" + j.toString()] : "";
                        var title = totalRow["DataIsNumber" + j.toString()] ? this._titles[j] : "";
                        this.viewModel.totalColumns.push({ cssClass: cssClass, value: val, title: title });
                    }
                    this._summaryColumns.push(summaryColumn);
                }
                if (this.viewModel.isTotalsEnabled()) {
                    this._content.remove(this._content()[this._content().length - 1]);
                }
                var summaryReportOptions = {
                    itemDataSource: this._content,
                    selectionMode: WinJS.UI.SelectionMode.none,
                    tapBehavior: "none",
                    columns: this._summaryColumns()
                };
                this.summaryReportOptions(summaryReportOptions);
            };
            ReportDetailsViewController.prototype._loadHighChart = function () {
                var chartVisible = [];
                this.viewModel.chartVisible([]);
                for (var i = 0; i < this.viewModel.charts.length; i++) {
                    if (i >= 3) {
                        break;
                    }
                    chartVisible[i] = true;
                }
                this.viewModel.chartVisible(chartVisible);
                for (var i = 0; i < this.viewModel.charts.length; i++) {
                    if (i >= 3) {
                        break;
                    }
                    var categories = [];
                    var cindex = jQuery.inArray(this.viewModel.charts[i].Categories, this._titles);
                    if (cindex > -1) {
                        categories = this._parsedChartsData[cindex].data;
                    }
                    var series = [];
                    for (var j = 0; j < this.viewModel.charts[i].Series.length; j++) {
                        var sindex = jQuery.inArray(this.viewModel.charts[i].Series[j], this._titles);
                        if (sindex > -1) {
                            series.push(this._parsedChartsData[sindex]);
                        }
                    }
                    if (i <= ReportDetailsViewController.REPORT_PLACEHOLDER_DIV_IDS.length) {
                        this._createChart(categories, series, ReportDetailsViewController.REPORT_PLACEHOLDER_DIV_IDS[i]);
                    }
                }
            };
            ReportDetailsViewController.prototype._createChart = function (categories, series, renderDivName) {
                var accentColor = Commerce.CSSHelpers.accentColor;
                var tooltipText = Commerce.ViewModelAdapter.getResourceString("string_2407");
                var fontName = "Segoi UI";
                var lineColor = "#999999";
                var fontColor = Commerce.CSSHelpers.currentThemeLoaded === "light" ? "#616365" : "#A1A3A5";
                var options = {
                    colors: [accentColor, "#B1E3F9", "#1098D2", "#0A658C", "#8BD6F6", "#074156", "#D8F1FC"],
                    chart: {
                        renderTo: document.getElementById(renderDivName),
                        type: "column",
                        backgroundColor: "transparent"
                    },
                    title: {
                        text: "",
                        style: {
                            color: fontColor,
                            font: fontName
                        },
                        useHTML: true
                    },
                    xAxis: {
                        categories: categories,
                        labels: {
                            step: this._stepVal,
                            rotation: 0,
                            align: "center",
                            style: {
                                color: fontColor,
                                font: fontName,
                                fontSize: "9px",
                                width: "50px"
                            },
                            formatter: function () {
                                return this["value"];
                            }
                        },
                        lineColor: lineColor,
                        lineWidth: 1
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: "",
                            style: {
                                color: fontColor,
                                font: fontName,
                                fontSize: "9px"
                            }
                        },
                        allowDecimals: false
                    },
                    legend: {
                        itemStyle: {
                            color: fontColor,
                            font: fontName
                        },
                        rtl: Commerce.CSSHelpers.isRightToLeft,
                        useHTML: true
                    },
                    series: series,
                    tooltip: {
                        style: {
                            font: fontName
                        },
                        formatter: function () {
                            return "<b>" + this["x"] + "</b><br/><br/><br/>" +
                                Commerce.StringExtensions.format(tooltipText, this["series"].name, Commerce.NumberExtensions.formatNumber(this["y"], Commerce.NumberExtensions.getDecimalPrecision()));
                        },
                        rtl: Commerce.CSSHelpers.isRightToLeft,
                        useHTML: true
                    },
                    credits: {
                        enabled: false,
                        href: Commerce.StringExtensions.EMPTY
                    }
                };
                var chart = new Highcharts.Chart(options);
                this._charts.push(chart);
            };
            ReportDetailsViewController.REPORT_PLACEHOLDER_DIV_IDS = ["chartPlaceHolder1", "chartPlaceHolder2", "chartPlaceHolder3"];
            return ReportDetailsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ReportDetailsViewController = ReportDetailsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var ReportsViewController = (function (_super) {
            __extends(ReportsViewController, _super);
            function ReportsViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                _this.title(ReportsViewController._getTitle());
                _this.viewModel = new Commerce.ViewModels.ReportsViewModel(_this.createViewModelContext(), options);
                return _this;
            }
            ReportsViewController.prototype.load = function () {
                this.viewModel.loadAsync();
            };
            ReportsViewController.prototype.reportInvokedHandler = function (eventArgs) {
                Commerce.ViewModelAdapter.navigate("ReportDetailsView", eventArgs.data);
            };
            ReportsViewController._getTitle = function () {
                var title = Commerce.Session.instance.connectionStatus === Commerce.Client.Entities.ConnectionStatusType.Online ?
                    Commerce.ViewModelAdapter.getResourceString("string_2409") :
                    Commerce.ViewModelAdapter.getResourceString("string_2410");
                return title;
            };
            return ReportsViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.ReportsViewController = ReportsViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var UrlOperationViewController = (function (_super) {
            __extends(UrlOperationViewController, _super);
            function UrlOperationViewController(context, options) {
                var _this = _super.call(this, context, { title: Commerce.StringExtensions.EMPTY }) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw new Error("Invalid options passed to the UrlOperationViewController constructor: options cannot be null or undefined.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(options.url)) {
                    throw new Error("Invalid options passed to the UrlOperationViewController constructor: options.url cannot be null or empty.");
                }
                _this.title(options.actionTitle);
                _this.viewModel = new Commerce.ViewModels.UrlOperationViewModel(_this.createViewModelContext());
                _this.launchUrl = ko.observable(options.url);
                var applicationType = Commerce.Host.instance.application.getApplicationType();
                if (Commerce.ApplicationHelper.isWebApplicationType(applicationType)) {
                    _this.isCloudPos = ko.observable(true);
                }
                else {
                    _this.isCloudPos = ko.observable(false);
                }
                return _this;
            }
            UrlOperationViewController.prototype.onShown = function () {
                Commerce.UserActivityTracker.detachHandler();
            };
            UrlOperationViewController.prototype.onHidden = function () {
                Commerce.UserActivityTracker.setupServerConfiguredAutoExitTimeout();
            };
            return UrlOperationViewController;
        }(ViewControllers.ViewControllerBase));
        ViewControllers.UrlOperationViewController = UrlOperationViewController;
    })(ViewControllers = Commerce.ViewControllers || (Commerce.ViewControllers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Views;
    (function (Views) {
        "use strict";
        function getViewConfigurations() {
            var views = [
                {
                    page: "AffiliationsView",
                    phonePage: "AffiliationsView",
                    path: "Views/Affiliation/AffiliationsView",
                    viewController: Commerce.ViewControllers.AffiliationsViewController
                },
                {
                    page: "CartView",
                    phonePage: "CartViewPhone",
                    path: "Views/Cart/CartView",
                    viewController: Commerce.ViewControllers.CartViewController
                },
                {
                    page: "ResumeCartView",
                    phonePage: "ResumeCartView",
                    path: "Views/Cart/ResumeCartView",
                    viewController: Commerce.ViewControllers.ResumeCartViewController
                },
                {
                    page: "ShowJournalView",
                    phonePage: "ShowJournalViewPhone",
                    path: "Views/Cart/ShowJournalView",
                    viewController: Commerce.ViewControllers.ShowJournalViewController
                },
                {
                    page: "AddressAddEditView",
                    phonePage: "AddressAddEditViewPhone",
                    path: "Views/Customer/AddressAddEditView",
                    viewController: Commerce.ViewControllers.AddressAddEditViewController
                },
                {
                    page: "CustomerAddressesView",
                    phonePage: "CustomerAddressesViewPhone",
                    path: "Views/Customer/CustomerAddressesView",
                    viewController: Commerce.ViewControllers.CustomerAddressesViewController
                },
                {
                    page: "CustomerAddEditView",
                    phonePage: "CustomerAddEditViewPhone",
                    path: "Views/Customer/CustomerAddEditView",
                    viewController: Commerce.ViewControllers.CustomerAddEditViewController
                },
                {
                    page: "CustomerAffiliationsView",
                    phonePage: "CustomerAffiliationsView",
                    path: "Views/Customer/CustomerAffiliationsView",
                    viewController: Commerce.ViewControllers.CustomerAffiliationsViewController
                },
                {
                    page: "CustomerDetailsView",
                    phonePage: "CustomerDetailsViewPhone",
                    path: "Views/Customer/CustomerDetailsView",
                    viewController: Commerce.ViewControllers.CustomerDetailsViewController
                },
                {
                    page: "CustomerContactInfoView",
                    phonePage: "CustomerContactInfoView",
                    path: "Views/Customer/CustomerContactInfoView",
                    viewController: Commerce.ViewControllers.CustomerContactInfoViewController
                },
                {
                    page: "RecentPurchasesView",
                    phonePage: "RecentPurchasesView",
                    path: "Views/Customer/RecentPurchasesView",
                    viewController: Commerce.ViewControllers.RecentPurchasesViewController
                },
                {
                    page: "ChangeDeliveryModeView",
                    phonePage: "ChangeDeliveryModeView",
                    path: "Views/CustomerOrder/ChangeDeliveryModeView",
                    viewController: Commerce.ViewControllers.ChangeDeliveryModeViewController
                },
                {
                    page: "CustomerOrderInvoicesView",
                    path: "Views/CustomerOrder/CustomerOrderInvoicesView",
                    viewController: Commerce.ViewControllers.CustomerOrderInvoicesViewController
                },
                {
                    page: "DepositOverrideView",
                    phonePage: "DepositOverrideViewPhone",
                    path: "Views/CustomerOrder/DepositOverrideView",
                    viewController: Commerce.ViewControllers.DepositOverrideViewController
                },
                {
                    page: "FulfillmentLineView",
                    phonePage: "FulfillmentLineViewPhone",
                    path: "Views/CustomerOrder/FulfillmentLineView",
                    viewController: Commerce.ViewControllers.FulfillmentLineViewController
                },
                {
                    page: "InvoicedSalesLinesView",
                    phonePage: "InvoicedSalesLinesView",
                    path: "Views/CustomerOrder/InvoicedSalesLinesView",
                    viewController: Commerce.ViewControllers.InvoicedSalesLinesViewController
                },
                {
                    page: "PaymentHistoryView",
                    phonePage: "PaymentHistoryView",
                    path: "Views/CustomerOrder/PaymentHistoryView",
                    viewController: Commerce.ViewControllers.PaymentHistoryViewController
                },
                {
                    page: "PickUpInStoreView",
                    phonePage: "PickUpInStoreViewPhone",
                    path: "Views/CustomerOrder/PickUpInStoreView",
                    viewController: Commerce.ViewControllers.PickUpInStoreViewController
                },
                {
                    page: "PickUpView",
                    phonePage: "PickUpView",
                    path: "Views/CustomerOrder/PickUpView",
                    viewController: Commerce.ViewControllers.PickUpViewController
                },
                {
                    page: "SalesInvoicesView",
                    phonePage: "SalesInvoicesView",
                    path: "Views/CustomerOrder/SalesInvoicesView",
                    viewController: Commerce.ViewControllers.SalesInvoicesViewController
                },
                {
                    page: "SalesInvoiceDetailsView",
                    phonePage: "SalesInvoiceDetailsView",
                    path: "Views/CustomerOrder/SalesInvoiceDetailsView",
                    viewController: Commerce.ViewControllers.SalesInvoiceDetailsViewController
                },
                {
                    page: "SaleslineSelectorView",
                    phonePage: "SaleslineSelectorView",
                    path: "Views/CustomerOrder/SaleslineSelectorView",
                    viewController: Commerce.ViewControllers.SaleslineSelectorViewController
                },
                {
                    page: "SearchOrdersView",
                    phonePage: "SearchOrdersView",
                    path: "Views/CustomerOrder/SearchOrdersView",
                    viewController: Commerce.ViewControllers.SearchOrdersViewController
                },
                {
                    page: "ShippingMethodsView",
                    phonePage: "ShippingMethodsViewPhone",
                    path: "Views/CustomerOrder/ShippingMethodsView",
                    viewController: Commerce.ViewControllers.ShippingMethodsViewController
                },
                {
                    page: "ShippingLocationsView",
                    phonePage: "ShippingLocationsView",
                    path: "Views/CustomerOrder/ShippingLocationsView",
                    viewController: Commerce.ViewControllers.ShippingLocationsViewController
                },
                {
                    page: "CashManagementView",
                    phonePage: "CashManagementViewPhone",
                    path: "Views/DailyOperations/CashManagementView",
                    viewController: Commerce.ViewControllers.CashManagementViewController
                },
                {
                    page: "CostAccountView",
                    phonePage: "CostAccountView",
                    path: "Views/DailyOperations/CostAccountView",
                    viewController: Commerce.ViewControllers.CostAccountViewController
                },
                {
                    page: "DenominationsView",
                    phonePage: "DenominationsView",
                    path: "Views/DailyOperations/DenominationsView",
                    viewController: Commerce.ViewControllers.DenominationsViewController
                },
                {
                    page: "ReconcileShiftsView",
                    phonePage: "ReconcileShiftsView",
                    path: "Views/DailyOperations/ReconcileShiftsView",
                    viewController: Commerce.ViewControllers.ReconcileShiftsViewController
                },
                {
                    page: "ResumeShiftView",
                    phonePage: "ResumeShiftView",
                    path: "Views/DailyOperations/ResumeShiftView",
                    viewController: Commerce.ViewControllers.ResumeShiftViewController
                },
                {
                    page: "ManageSafesView",
                    phonePage: "ManageSafesView",
                    path: "Views/DailyOperations/ManageSafesView",
                    viewController: Commerce.ViewControllers.ManageSafesViewController
                },
                {
                    page: "ManageShiftsView",
                    phonePage: "ManageShiftsView",
                    path: "Views/DailyOperations/ManageShiftsView",
                    viewController: Commerce.ViewControllers.ManageShiftsViewController
                },
                {
                    page: "TenderCountingView",
                    phonePage: "TenderCountingView",
                    path: "Views/DailyOperations/TenderCountingView",
                    viewController: Commerce.ViewControllers.TenderCountingViewController
                },
                {
                    page: "TimeClockManagerView",
                    phonePage: "TimeClockManagerView",
                    path: "Views/DailyOperations/TimeClockManagerView",
                    viewController: Commerce.ViewControllers.TimeClockManagerViewController
                },
                {
                    page: "TimeClockView",
                    phonePage: "TimeClockView",
                    path: "Views/DailyOperations/TimeClockView",
                    viewController: Commerce.ViewControllers.TimeClockViewController
                },
                {
                    page: "DatabaseConnectionStatusView",
                    phonePage: "DatabaseConnectionStatusViewPhone",
                    path: "Views/Device/DatabaseConnectionStatusView",
                    viewController: Commerce.ViewControllers.DatabaseConnectionStatusViewController
                },
                {
                    page: "ExtensionPackageDetailsView",
                    phonePage: "ExtensionPackageDetailsViewPhone",
                    path: "Views/Device/ExtensionPackageDetailsView",
                    viewController: Commerce.ViewControllers.ExtensionPackageDetailsViewController
                },
                {
                    page: "SettingsView",
                    phonePage: "SettingsViewPhone",
                    path: "Views/Device/SettingsView",
                    viewController: Commerce.ViewControllers.SettingsViewController
                },
                {
                    page: "AllDiscountsView",
                    phonePage: "AllDiscountsView",
                    path: "Views/Discounts/AllDiscountsView",
                    viewController: Commerce.ViewControllers.AllDiscountsViewController
                },
                {
                    page: "EmployeeClientBookView",
                    phonePage: "EmployeeClientBookView",
                    path: "Views/Employee/EmployeeClientBookView",
                    viewController: Commerce.ViewControllers.EmployeeClientBookViewController
                },
                {
                    page: "StoreClientBooksView",
                    phonePage: "StoreClientBooksView",
                    path: "Views/Employee/StoreClientBooksView",
                    viewController: Commerce.ViewControllers.StoreClientBooksViewController
                },
                {
                    page: "TaskManagementView",
                    phonePage: "TaskManagementViewPhone",
                    path: "Views/EmployeeManagement/TaskManagementView",
                    viewController: Commerce.ViewControllers.TaskManagementViewController
                },
                {
                    page: "HomeView",
                    phonePage: "HomeViewPhone",
                    path: "Views/Home/HomeView",
                    viewController: Commerce.ViewControllers.HomeViewController
                },
                {
                    page: "HealthCheckView",
                    phonePage: "HealthCheckViewPhone",
                    path: "Views/HealthCheck/HealthCheckView",
                    viewController: Commerce.ViewControllers.HealthCheckViewController
                },
                {
                    page: "InventoryDocumentCreationView",
                    phonePage: "InventoryDocumentCreationViewPhone",
                    path: "Views/Inventory/InventoryDocumentCreationView",
                    viewController: Commerce.ViewControllers.InventoryDocumentCreationViewController
                },
                {
                    page: "InventoryDocumentListView",
                    phonePage: "InventoryDocumentListViewPhone",
                    path: "Views/Inventory/InventoryDocumentListView",
                    viewController: Commerce.ViewControllers.InventoryDocumentListViewController
                },
                {
                    page: "InventoryDocumentSerialNumberManagementView",
                    phonePage: "InventoryDocumentSerialNumberManagementViewPhone",
                    path: "Views/Inventory/InventoryDocumentSerialNumberManagementView",
                    viewController: Commerce.ViewControllers.InventoryDocumentSerialNumberManagementViewController
                },
                {
                    page: "InventoryDocumentShippingAndReceivingView",
                    phonePage: "InventoryDocumentShippingAndReceivingViewPhone",
                    path: "Views/Inventory/InventoryDocumentShippingAndReceivingView",
                    viewController: Commerce.ViewControllers.InventoryDocumentShippingAndReceivingViewController
                },
                {
                    page: "InventoryDocumentValidationView",
                    phonePage: "InventoryDocumentValidationViewPhone",
                    path: "Views/Inventory/InventoryDocumentValidationView",
                    viewController: Commerce.ViewControllers.InventoryDocumentValidationViewController
                },
                {
                    page: "ChangePasswordView",
                    phonePage: "ChangePasswordViewPhone",
                    path: "Views/Login/ChangePasswordView",
                    viewController: Commerce.ViewControllers.ChangePasswordViewController
                },
                {
                    page: "DeviceActivationProcessView",
                    phonePage: "DeviceActivationProcessViewPhone",
                    path: "Views/Login/DeviceActivationProcessView",
                    viewController: Commerce.ViewControllers.DeviceActivationProcessViewController
                },
                {
                    page: "DeviceActivationView",
                    phonePage: "DeviceActivationViewPhone",
                    path: "Views/Login/DeviceActivationView",
                    viewController: Commerce.ViewControllers.DeviceActivationViewController
                },
                {
                    page: "ExtendedLogOnView",
                    phonePage: "ExtendedLogOnView",
                    path: "Views/Login/ExtendedLogOnView",
                    viewController: Commerce.ViewControllers.ExtendedLogonViewController
                },
                {
                    page: "GetStartedView",
                    phonePage: "GetStartedViewPhone",
                    path: "Views/Login/GetStartedView",
                    viewController: Commerce.ViewControllers.GetStartedViewController
                },
                {
                    page: "GuidedActivationView",
                    phonePage: "GuidedActivationViewPhone",
                    path: "Views/Login/GuidedActivationView",
                    viewController: Commerce.ViewControllers.GuidedActivationViewController
                },
                {
                    page: "LockRegister",
                    phonePage: "LockRegisterPhone",
                    path: "Views/Login/LockRegister",
                    viewController: Commerce.ViewControllers.LockRegisterViewController
                },
                {
                    page: "LoginView",
                    phonePage: "LoginViewPhone",
                    path: "Views/Login/LoginView",
                    viewController: Commerce.ViewControllers.LoginViewController
                },
                {
                    page: "ResetPasswordView",
                    phonePage: "ResetPasswordViewPhone",
                    path: "Views/Login/ResetPasswordView",
                    viewController: Commerce.ViewControllers.ResetPasswordViewController
                },
                {
                    page: "AddWarrantyToAnExistingTransactionView",
                    phonePage: "AddWarrantyToAnExistingTransactionView",
                    path: "Views/Merchandising/AddWarrantyToAnExistingTransactionView",
                    viewController: Commerce.ViewControllers.AddWarrantyToAnExistingTransactionViewController
                },
                {
                    page: "AllStoresView",
                    phonePage: "AllStoresView",
                    path: "Views/Merchandising/AllStoresView",
                    viewController: Commerce.ViewControllers.AllStoresViewController
                },
                {
                    page: "CatalogsView",
                    phonePage: "CatalogsViewPhone",
                    path: "Views/Merchandising/CatalogsView",
                    viewController: Commerce.ViewControllers.CatalogsViewController
                },
                {
                    page: "CategoriesView",
                    phonePage: "CategoriesViewPhone",
                    path: "Views/Merchandising/CategoriesView",
                    viewController: Commerce.ViewControllers.CategoriesViewController
                },
                {
                    page: "CompareProductsView",
                    phonePage: "CompareProductsViewPhone",
                    path: "Views/Merchandising/CompareProductsView",
                    viewController: Commerce.ViewControllers.CompareProductsViewController
                },
                {
                    page: "InventoryAvailableToPromiseView",
                    phonePage: "InventoryAvailableToPromiseViewPhone",
                    path: "Views/Merchandising/InventoryAvailableToPromiseView",
                    viewController: Commerce.ViewControllers.InventoryAvailableToPromiseViewController
                },
                {
                    page: "InventoryLookupMatrixView",
                    path: "Views/Merchandising/InventoryLookupMatrixView",
                    viewController: Commerce.ViewControllers.InventoryLookupMatrixViewController
                },
                {
                    page: "InventoryLookupView",
                    phonePage: "InventoryLookupViewPhone",
                    path: "Views/Merchandising/InventoryLookupView",
                    viewController: Commerce.ViewControllers.InventoryLookupViewController
                },
                {
                    page: "KitComponentSubstitutesView",
                    phonePage: "KitComponentSubstitutesView",
                    path: "Views/Merchandising/KitComponentSubstitutesView",
                    viewController: Commerce.ViewControllers.KitComponentSubstitutesViewController
                },
                {
                    page: "KitDisassemblyView",
                    phonePage: "KitDisassemblyViewPhone",
                    path: "Views/Merchandising/KitDisassemblyView",
                    viewController: Commerce.ViewControllers.KitDisassemblyViewController
                },
                {
                    page: "PickingAndReceivingDetailsView",
                    phonePage: "PickingAndReceivingDetailsViewPhone",
                    path: "Views/Merchandising/PickingAndReceivingDetailsView",
                    viewController: Commerce.ViewControllers.PickingAndReceivingDetailsViewController
                },
                {
                    page: "PriceCheckView",
                    phonePage: "PriceCheckViewPhone",
                    path: "Views/Merchandising/PriceCheckView",
                    viewController: Commerce.ViewControllers.PriceCheckViewController
                },
                {
                    page: "ProductRichMediaView",
                    phonePage: "ProductRichMediaViewPhone",
                    path: "Views/Merchandising/ProductRichMediaView",
                    viewController: Commerce.ViewControllers.ProductRichMediaViewController
                },
                {
                    page: "ProductsView",
                    phonePage: "ProductsView",
                    path: "Views/Merchandising/ProductsView",
                    viewController: Commerce.ViewControllers.ProductsViewController
                },
                {
                    page: "ReturnTransactionView",
                    phonePage: "ReturnTransactionView",
                    path: "Views/Merchandising/ReturnTransactionView",
                    viewController: Commerce.ViewControllers.ReturnTransactionViewController
                },
                {
                    page: "SearchPickingAndReceivingView",
                    phonePage: "SearchPickingAndReceivingView",
                    path: "Views/Merchandising/SearchPickingAndReceivingView",
                    viewController: Commerce.ViewControllers.SearchPickingAndReceivingViewController
                },
                {
                    page: "SearchStockCountView",
                    phonePage: "SearchStockCountView",
                    path: "Views/Merchandising/SearchStockCountView",
                    viewController: Commerce.ViewControllers.SearchStockCountViewController
                },
                {
                    page: "SearchView",
                    phonePage: "SearchView",
                    path: "Views/Merchandising/SearchView",
                    viewController: Commerce.ViewControllers.SearchViewController
                },
                {
                    page: "SimpleProductDetailsView",
                    phonePage: "SimpleProductDetailsViewPhone",
                    path: "Views/Merchandising/SimpleProductDetailsView",
                    viewController: Commerce.ViewControllers.SimpleProductDetailsViewController
                },
                {
                    page: "StockCountDetailsView",
                    phonePage: "StockCountDetailsView",
                    path: "Views/Merchandising/StockCountDetailsView",
                    viewController: Commerce.ViewControllers.StockCountDetailsViewController
                },
                {
                    page: "StoreDetailsView",
                    phonePage: "StoreDetailsViewPhone",
                    path: "Views/Merchandising/StoreDetailsView",
                    viewController: Commerce.ViewControllers.StoreDetailsViewController
                },
                {
                    page: "TransferOrderDetailsView",
                    phonePage: "TransferOrderDetailsView",
                    path: "Views/Merchandising/TransferOrderDetailsView",
                    viewController: Commerce.ViewControllers.TransferOrderDetailsViewController
                },
                {
                    page: "IssueLoyaltyCardView",
                    phonePage: "IssueLoyaltyCardViewPhone",
                    path: "Views/Order/IssueLoyaltyCardView",
                    viewController: Commerce.ViewControllers.IssueLoyaltyCardViewController
                },
                {
                    page: "ManageChargesView",
                    phonePage: "ManageChargesView",
                    path: "Views/Order/ManageChargesView",
                    viewController: Commerce.ViewControllers.ManageChargesViewController
                },
                {
                    page: "PaymentView",
                    phonePage: "PaymentViewPhone",
                    path: "Views/Payments/PaymentView",
                    viewController: Commerce.ViewControllers.PaymentViewController
                },
                {
                    page: "ReportDetailsView",
                    phonePage: "ReportDetailsView",
                    path: "Views/Reports/ReportDetailsView",
                    viewController: Commerce.ViewControllers.ReportDetailsViewController
                },
                {
                    page: "ReportsView",
                    phonePage: "ReportsView",
                    path: "Views/Reports/ReportsView",
                    viewController: Commerce.ViewControllers.ReportsViewController
                },
                {
                    page: "UrlOperationView",
                    phonePage: "UrlOperationView",
                    path: "Views/UrlOperation/UrlOperationView",
                    viewController: Commerce.ViewControllers.UrlOperationViewController
                },
                {
                    page: "ReviewShiftTenderLinesView",
                    phonePage: "ReviewShiftTenderLinesView",
                    path: "Views/DailyOperations/ReviewShiftTenderLinesView",
                    viewController: Commerce.ViewControllers.ReviewShiftTenderLinesViewController
                }
            ];
            return views;
        }
        Views.getViewConfigurations = getViewConfigurations;
    })(Views = Commerce.Views || (Commerce.Views = {}));
})(Commerce || (Commerce = {}));

// SIG // Begin signature block
// SIG // MIIkCgYJKoZIhvcNAQcCoIIj+zCCI/cCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // pZx5K9ylNDG0oVJrrCZRNE4FNScG7MIvp0LOt7X9FMyg
// SIG // gg2BMIIF/zCCA+egAwIBAgITMwAAAYdyF3IVWUDHCQAA
// SIG // AAABhzANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTIwMDMwNDE4Mzk0N1oX
// SIG // DTIxMDMwMzE4Mzk0N1owdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // zrfJC3Oz90+zCiIaLmB3sDBZp6vAMruxToWQkGm1cAad
// SIG // lUuFsgdkHuE0AU/Ggc5wDQxD4xyjXT0/F8+XDWpYulx3
// SIG // n0vIv1l7RdL0rD/DRL+pgR7gNqdX8NsAfxdHR7Cdxn2e
// SIG // XNLDyY5JbImKj8OfcSeeJDPdSDoIjtjlM4zQJYz4m4wl
// SIG // nx+1M0NUzx3OHcHopbPBhCK2wUW+yFsIjmy9do1k+GIe
// SIG // 9TUILyfRZ+vlIQ/cdrpN3S4/OL8LdTbhUIrSicSFdH1b
// SIG // ETUd2m0FTi6qQ7oG69EszS+qPMczhy+Tl4hhsIOnpIlw
// SIG // Nf9l12O8lRXN/bZXnQ7WY0ozW3sdc88ElwIDAQABo4IB
// SIG // fjCCAXowHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFIaL+GcjvemsZCXTI6c7ts1V
// SIG // ziXLMFAGA1UdEQRJMEekRTBDMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEWMBQG
// SIG // A1UEBRMNMjMwMDEyKzQ1ODM4NTAfBgNVHSMEGDAWgBRI
// SIG // bmTlUAXTgqoXNzcitW2oynUClTBUBgNVHR8ETTBLMEmg
// SIG // R6BFhkNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // b3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3JsMGEGCCsGAQUFBwEBBFUwUzBRBggrBgEFBQcw
// SIG // AoZFaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9w
// SIG // cy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQEL
// SIG // BQADggIBAIsZskuhOr6a1g/ShTSAfRuc8jLiI2QDrlCd
// SIG // RCv1ZYOhW92R1441MAEyiHF2xbhQulq+Cja1OA2P7AVa
// SIG // pmm+QAv43t26VKY7caRMqlKrT3N9MBIP6zvb5ipqiqCz
// SIG // 09+7L3NjVQZhjZfvOajuH1f8OwseydAW6pNfSnETXY7e
// SIG // niqE50zxwR5VR0CB2aTMWnGxTgJCa6gFZGGXc+4pDV08
// SIG // VfhkW9+rQuAcjDcRNgxe7xXb2omT9AlWeQcidoAIVzHS
// SIG // vfrrMc1ZPdd6inXtTgLlnb/q53apACJvH1JUZ6+LGkgo
// SIG // O3CG1MAgn9desFCexLiQ4NLx3soZwnh5wW8h90WZBxIt
// SIG // qH5n4JxSEiWQ3TAHlWRlTodtCaedFwc6qJKT83mes3Nf
// SIG // 4MiCzcolYBPkT5I51ELIXdX9TzIJ97Z7Ngs+2yYlVGqh
// SIG // Dt5/akRYMuSbi2nulMHhnwHjqN3YC2cYpCs2LN4QzGhL
// SIG // SavCD+9XF+0F3upZzJl1Px3X89qfPe2XfpFPr2byiN3M
// SIG // C37lUICtkWds/inNyt3UT89q18nCuVwrkWZrxmm/1m62
// SIG // Ygu8CUGqYAaHZbTCORjHRawYPSHhe/6z+BKlUF3irXr0
// SIG // 5WV46bjYYY7kftgzLf3Vrn416YlvdW6N2h+hGozgC15q
// SIG // MYJbQqdSu4a0uoJrL4/eHC0X+dEEOFPEMIIHejCCBWKg
// SIG // AwIBAgIKYQ6Q0gAAAAAAAzANBgkqhkiG9w0BAQsFADCB
// SIG // iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // IDIwMTEwHhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEw
// SIG // OTA5WjB+MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQD
// SIG // Ex9NaWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDEx
// SIG // MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
// SIG // q/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4Bjga
// SIG // BEm6f8MMHt03a8YS2AvwOMKZBrDIOdUBFDFC04kNeWSH
// SIG // fpRgJGyvnkmc6Whe0t+bU7IKLMOv2akrrnoJr9eWWcpg
// SIG // GgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato88tt8zpc
// SIG // oRb0RrrgOGSsbmQ1eKagYw8t00CT+OPeBw3VXHmlSSnn
// SIG // Db6gE3e+lD3v++MrWhAfTVYoonpy4BI6t0le2O3tQ5GD
// SIG // 2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDstrjNYxbc+/jLT
// SIG // swM9sbKvkjh+0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOE
// SIG // y/S6A4aN91/w0FK/jJSHvMAhdCVfGCi2zCcoOCWYOUo2
// SIG // z3yxkq4cI6epZuxhH2rhKEmdX4jiJV3TIUs+UsS1Vz8k
// SIG // A/DRelsv1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL
// SIG // 5zmhD+kjSbwYuER8ReTBw3J64HLnJN+/RpnF78IcV9uD
// SIG // jexNSTCnq47f7Fufr/zdsGbiwZeBe+3W7UvnSSmnEyim
// SIG // p31ngOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8Hh
// SIG // hUSJxAlMxdSlQy90lfdu+HggWCwTXWCVmj5PM4TasIgX
// SIG // 3p5O9JawvEagbJjS4NaIjAsCAwEAAaOCAe0wggHpMBAG
// SIG // CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTlUAXT
// SIG // gqoXNzcitW2oynUClTAZBgkrBgEEAYI3FAIEDB4KAFMA
// SIG // dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx
// SIG // 0SOJNDBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4G
// SIG // CCsGAQUFBwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3J0MIGfBgNV
// SIG // HSAEgZcwgZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEF
// SIG // BQcCARYzaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
// SIG // aW9wcy9kb2NzL3ByaW1hcnljcHMuaHRtMEAGCCsGAQUF
// SIG // BwICMDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5
// SIG // AF8AcwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQBn8oalmOBUeRou09h0ZyKbC5YR4WOS
// SIG // mUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0epo/Np
// SIG // 22O/IjWll11lhJB9i0ZQVdgMknzSGksc8zxCi1LQsP1r
// SIG // 4z4HLimb5j0bpdS1HXeUOeLpZMlEPXh6I/MTfaaQdION
// SIG // 9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtYSWMfCWlu
// SIG // WpiW5IP0wI/zRive/DvQvTXvbiWu5a8n7dDd8w6vmSiX
// SIG // mE0OPQvyCInWH8MyGOLwxS3OW560STkKxgrCxq2u5bLZ
// SIG // 2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZiWhub6e3dMNA
// SIG // BQamASooPoI/E01mC8CzTfXhj38cbxV9Rad25UAqZaPD
// SIG // XVJihsMdYzaXht/a8/jyFqGaJ+HNpZfQ7l1jQeNbB5yH
// SIG // PgZ3BtEGsXUfFL5hYbXw3MYbBL7fQccOKO7eZS/sl/ah
// SIG // XJbYANahRr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbS
// SIG // oqKfenoi+kiVH6v7RyOA9Z74v2u3S5fi63V4GuzqN5l5
// SIG // GEv/1rMjaHXmr/r8i+sLgOppO6/8MO0ETI7f33VtY5E9
// SIG // 0Z1WTk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZO
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFeEw
// SIG // ghXdAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAGHchdyFVlAxwkAAAAAAYcwDQYJYIZI
// SIG // AWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEE
// SIG // AYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCADVkLeDfI3J0UegWas
// SIG // rg/EJsvFhjO+0JAR6T4tR06kcDCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQC5aLRR
// SIG // CibAsI/GAQwMBCYX6nQ8QxFfkDkEHO4DYbDZMYWOWuj4
// SIG // xtx6hBs2CZzZgGdGMV3KftSW8QG+lwQTdNE3r8Ok8CI6
// SIG // IiFjb0csNfEEVnc0ZKB6Zm3FOWbSKqwbtOYYT7BVFtG4
// SIG // J201eXdfvao4GSRGOVrbJ4wmUHCWt9w7gMHL2p0SxduR
// SIG // vU7wdqz7zAzfmW0tpGmY/KD71ZvxpBhGIIhKPyEthSsg
// SIG // Axu/6mtHOqKiDewiAa9ZXxOMzW8S8o78QmJIRR/TFJbX
// SIG // 2AW5HiNznD7201ebarkB5EgfC+wbFdVB5NzPJVzq/Dyb
// SIG // gSfbqxbCo8dIovKFBBr7/JPYyC7coYIS8TCCEu0GCisG
// SIG // AQQBgjcDAwExghLdMIIS2QYJKoZIhvcNAQcCoIISyjCC
// SIG // EsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3
// SIG // DQEJEAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEIC2ZiOPDye2NvJK93LaL
// SIG // DCcw6LF80HSDSsNrzq99dxRVAgZfPAgD03cYEzIwMjAw
// SIG // ODIzMDQwMzQzLjM3M1owBIACAfSggdSkgdEwgc4xCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29m
// SIG // dCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNvMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjo4OTdBLUUzNTYtMTcwMTEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDkQwggT1MIID3aADAgECAhMzAAABLCKvRZd1
// SIG // +RvuAAAAAAEsMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTIxOTAxMTUw
// SIG // M1oXDTIxMDMxNzAxMTUwM1owgc4xCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRp
// SIG // b25zIFB1ZXJ0byBSaWNvMSYwJAYDVQQLEx1UaGFsZXMg
// SIG // VFNTIEVTTjo4OTdBLUUzNTYtMTcwMTElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAPK1zgSS
// SIG // q+MxAYo3qpCtQDxSMPPJy6mm/wfEJNjNUnYtLFBwl1BU
// SIG // S5trEk/t41ldxITKehs+ABxYqo4Qxsg3Gy1ugKiwHAnY
// SIG // iiekfC+ZhptNFgtnDZIn45zC0AlVr/6UfLtsLcHCh1XE
// SIG // lLUHfEC0nBuQcM/SpYo9e3l1qY5NdMgDGxCsmCKdiZfY
// SIG // XIu+U0UYIBhdzmSHnB3fxZOBVcr5htFHEBBNt/rFJlm/
// SIG // A4yb8oBsp+Uf0p5QwmO/bCcdqB15JpylOhZmWs0sUfJK
// SIG // lK9ErAhBwGki2eIRFKsQBdkXS9PWpF1w2gIJRvSkDEaC
// SIG // f+lbGTPdSzHSbfREWOF9wY3iYj8CAwEAAaOCARswggEX
// SIG // MB0GA1UdDgQWBBRRahZSGfrCQhCyIyGH9DkiaW7L0zAf
// SIG // BgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNoWoVtVTBW
// SIG // BgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNUaW1T
// SIG // dGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYIKwYBBQUHAQEE
// SIG // TjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0YVBDQV8y
// SIG // MDEwLTA3LTAxLmNydDAMBgNVHRMBAf8EAjAAMBMGA1Ud
// SIG // JQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IB
// SIG // AQBPFxHIwi4vAH49w9Svmz6K3tM55RlW5pPeULXdut2R
// SIG // qy6Ys0+VpZsbuaEoxs6Z1C3hMbkiqZFxxyltxJpuHTyG
// SIG // Tg61zfNIF5n6RsYF3s7IElDXNfZznF1/2iWc6uRPZK8r
// SIG // xxUJ/7emYXZCYwuUY0XjsCpP9pbRRKeJi6r5arSyI+Nf
// SIG // KxvgoM21JNt1BcdlXuAecdd/k8UjxCscffanoK2n6LFw
// SIG // 1PcZlEO7NId7o+soM2C0QY5BYdghpn7uqopB6ixyFIIk
// SIG // DXFub+1E7GmAEwfU6VwEHL7y9rNE8bd+JrQs+yAtkkHy
// SIG // 9FmXg/PsGq1daVzX1So7CJ6nyphpuHSN3VfTMIIGcTCC
// SIG // BFmgAwIBAgIKYQmBKgAAAAAAAjANBgkqhkiG9w0BAQsF
// SIG // ADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMp
// SIG // TWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9y
// SIG // aXR5IDIwMTAwHhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAx
// SIG // MjE0NjU1WjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
// SIG // VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
// SIG // MDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
// SIG // AKkdDbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX77Xxo
// SIG // SyxfxcPlYcJ2tz5mK1vwFVMnBDEfQRsalR3OCROOfGEw
// SIG // WbEwRA/xYIiEVEMM1024OAizQt2TrNZzMFcmgqNFDdDq
// SIG // 9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0ySwcSm
// SIG // XdFhE24oxhr5hoC732H8RsEnHSRnEnIaIYqvS2SJUGKx
// SIG // Xf13Hz3wV3WsvYpCTUBR0Q+cBj5nf/VmwAOWRH7v0Ev9
// SIG // buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn
// SIG // 9NxkvaQBwSAJk3jN/LzAyURdXhacAQVPIk0CAwEAAaOC
// SIG // AeYwggHiMBAGCSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQW
// SIG // BBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEEAYI3
// SIG // FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYD
// SIG // VR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTV9lbLj+ii
// SIG // XGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBHhkVo
// SIG // dHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9w
// SIG // cm9kdWN0cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0yMy5j
// SIG // cmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5o
// SIG // dHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRz
// SIG // L01pY1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNydDCBoAYD
// SIG // VR0gAQH/BIGVMIGSMIGPBgkrBgEEAYI3LgMwgYEwPQYI
// SIG // KwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9QS0kvZG9jcy9DUFMvZGVmYXVsdC5odG0wQAYIKwYB
// SIG // BQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AUABvAGwAaQBj
// SIG // AHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZI
// SIG // hvcNAQELBQADggIBAAfmiFEN4sbgmD+BcQM9naOhIW+z
// SIG // 66bM9TG+zwXiqf76V20ZMLPCxWbJat/15/B4vceoniXj
// SIG // +bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX/1z5
// SIG // Xhc1mCRWS3TvQhDIr79/xn/yN31aPxzymXlKkVIArzgP
// SIG // F/UveYFl2am1a+THzvbKegBvSzBEJCI8z+0DpZaPWSm8
// SIG // tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnxzplmkIz/
// SIG // amJ/3cVKC5Em4jnsGUpxY517IW3DnKOiPPp/fZZqkHim
// SIG // bdLhnPkd/DjYlPTGpQqWhqS9nhquBEKDuLWAmyI4ILUl
// SIG // 5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kWumGnEcua2A5H
// SIG // moDF0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/n
// SIG // MQekkzr3ZUd46PioSKv33nJ+YWtvd6mBy6cJrDm77MbL
// SIG // 2IK0cs0d9LiFAR6A+xuJKlQ5slvayA1VmXqHczsI5pgt
// SIG // 6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnPGUFN
// SIG // 4Ib5KpqjEWYw07t0MkvfY3v1mYovG8chr1m1rtxEPJdQ
// SIG // cdeh0sVV42neV8HR3jDA/czmTfsNv11P6Z0eGTgvvM9Y
// SIG // BS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkSoYIC
// SIG // 0jCCAjsCAQEwgfyhgdSkgdEwgc4xCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRp
// SIG // b25zIFB1ZXJ0byBSaWNvMSYwJAYDVQQLEx1UaGFsZXMg
// SIG // VFNTIEVTTjo4OTdBLUUzNTYtMTcwMTElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEB
// SIG // MAcGBSsOAwIaAxUADE5OKSMoNx/mYxYWap1RTOohbJ2g
// SIG // gYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
// SIG // VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
// SIG // MDANBgkqhkiG9w0BAQUFAAIFAOLrzF0wIhgPMjAyMDA4
// SIG // MjIyMDU0NTNaGA8yMDIwMDgyMzIwNTQ1M1owdzA9Bgor
// SIG // BgEEAYRZCgQBMS8wLTAKAgUA4uvMXQIBADAKAgEAAgIa
// SIG // OQIB/zAHAgEAAgIRlTAKAgUA4u0d3QIBADA2BgorBgEE
// SIG // AYRZCgQCMSgwJjAMBgorBgEEAYRZCgMCoAowCAIBAAID
// SIG // B6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEBBQUAA4GB
// SIG // ACXqEMppmWG62WKl4GHAwjvnTg/FvOrsBus0CAvNQxlN
// SIG // Znt2dV5Dm0J52tbyFUjwp4R709JP9tb4QNR9ghxPtMcN
// SIG // RWm7kTYpr0C/qJYkEstSiWOUJUNIyKE1gVK1FXSJ3EYC
// SIG // YetwJWsOv4nVSybgbi+ZR6vWoQ1xmfErXOMuOHpAMYID
// SIG // DTCCAwkCAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTACEzMAAAEsIq9Fl3X5G+4AAAAAASwwDQYJYIZI
// SIG // AWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
// SIG // 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQggJPX52YJi4Gc
// SIG // UyK1pb+Qyg70eQOsxR01g5YuAcGpcaMwgfoGCyqGSIb3
// SIG // DQEJEAIvMYHqMIHnMIHkMIG9BCBbn/0uFFh42hTM5XOo
// SIG // KdXevBaiSxmYK9Ilcn9nu5ZH4TCBmDCBgKR+MHwxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABLCKvRZd1
// SIG // +RvuAAAAAAEsMCIEIP77qwrqqSQkWPxa/KsTiyDI1Tur
// SIG // /TzWM58Y/KQSC8gGMA0GCSqGSIb3DQEBCwUABIIBAKyr
// SIG // 70LefNEutOMNsStJuzKqs+3Pep0rSyxXnj1hDyFEX0sL
// SIG // BMP0FwG4DwldqNYRWD7zpEj5Zb/gSW1iy6gV2byNJaKk
// SIG // TZLOuHGg5T9Hg49H0N59atki9YOuSTREj0D1iNOmczaY
// SIG // YoGTytyzGuzCPnwALVV4bNyE2lWpAjIZ1YPhA4L3NEvU
// SIG // g0q0JoKC7mQ1SJDc1cuUu5/1E9bPmzsJTxA8N/CmSQXd
// SIG // dSzQ3oY62AsYa0WZ4X3WAZgsKMJliEcVBDwVWMsM/FHc
// SIG // Pg01O9F7O5KHTgDEclpKxk/I5ZmcjjOibuTaOiHW2gtg
// SIG // J+8+EKkKLiNbLglN4+kazX3ip3eBVKQ=
// SIG // End signature block
