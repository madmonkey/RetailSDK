"use strict";
var Commerce;
(function (Commerce) {
    var Config;
    (function (Config) {
        Config.isDualDisplay = true;
    })(Config = Commerce.Config || (Commerce.Config = {}));
})(Commerce || (Commerce = {}));
var DualDisplay;
(function (DualDisplay) {
    "use strict";
    var DualDisplayMessaging = (function () {
        function DualDisplayMessaging() {
        }
        DualDisplayMessaging.init = function () {
            DualDisplayMessaging._messageTypeToAsyncResultMap = new Commerce.Dictionary();
            DualDisplayMessaging._dualDisplayView = Windows.UI.ViewManagement.ApplicationView.getForCurrentView();
            DualDisplayMessaging._dualDisplayView.onconsolidated = DualDisplayMessaging._sendCloseMessage.bind(this);
            DualDisplayMessaging._opener = window.opener;
            window.onmessage = DualDisplayMessaging._handleMessage.bind(this);
        };
        DualDisplayMessaging.sendWriteEventMessage = function (event) {
            DualDisplayMessaging._sendMessage({
                type: "writeEvent",
                args: {
                    event: event
                }
            });
        };
        DualDisplayMessaging.sendReadyMessage = function () {
            DualDisplayMessaging._sendMessage({ type: "ready", args: {} });
        };
        DualDisplayMessaging.sendRequest = function (request) {
            if (DualDisplayMessaging._messageTypeToAsyncResultMap.hasItem(request.responseName)) {
                Commerce.RetailLogger.dualDisplaySendRequestFailed(request.requestName, request.responseName);
                return Commerce.AsyncResult.createRejected([
                    new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.PERIPHERAL_DUALDISPLAY_RESPONSE_NOT_RECEIVED)
                ]);
            }
            var asyncResult = new Commerce.AsyncResult();
            DualDisplayMessaging._messageTypeToAsyncResultMap.setItem(request.responseName, asyncResult);
            DualDisplayMessaging._sendMessage({ type: request.requestName, args: request.requestData });
            return asyncResult;
        };
        DualDisplayMessaging._sendCloseMessage = function () {
            DualDisplayMessaging._sendMessage({ type: "close", args: {} });
        };
        DualDisplayMessaging._sendMessage = function (message) {
            DualDisplayMessaging._opener.postMessage(JSON.stringify(message), document.location.protocol + "//" + document.location.host);
        };
        DualDisplayMessaging._handleMessage = function (message) {
            var data = JSON.parse(message.data);
            switch (data.type) {
                case "cartChanged":
                    var cartChangedData = data;
                    DualDisplayMessaging._handleMessageCartChanged(cartChangedData.args);
                    break;
                case "customerChanged":
                    var customerChangedData = data;
                    DualDisplayMessaging._handleMessageCustomerChanged(customerChangedData.args);
                    break;
                case "dualDisplayConfigurationChanged":
                    var dualDisplayConfigurationChangedData = data;
                    DualDisplayMessaging._handleMessageDualDisplayConfigurationChanged(dualDisplayConfigurationChangedData.args);
                    break;
                case "isLoggedOnStateChanged":
                    var isLoggedOnStateChangedData = data;
                    DualDisplayMessaging._handleMessageIsLoggedOnStateChanged(isLoggedOnStateChangedData.args);
                    break;
                default:
                    DualDisplayMessaging._handleResponseMessage(data);
                    break;
            }
        };
        DualDisplayMessaging._handleResponseMessage = function (message) {
            if (DualDisplayMessaging._messageTypeToAsyncResultMap.hasItem(message.type)) {
                DualDisplayMessaging._messageTypeToAsyncResultMap.removeItem(message.type).resolve(message.args);
            }
        };
        DualDisplayMessaging._handleMessageCartChanged = function (cartChangedData) {
            DualDisplay.Model.DualDisplaySession.instance.cart = cartChangedData.cart;
        };
        DualDisplayMessaging._handleMessageCustomerChanged = function (customerChangedData) {
            DualDisplay.Model.DualDisplaySession.instance.customer = customerChangedData.customer;
        };
        DualDisplayMessaging._handleMessageDualDisplayConfigurationChanged = function (dualDisplayConfiguration) {
            DualDisplay.Model.DualDisplaySession.instance.dualDisplayConfiguration = dualDisplayConfiguration;
        };
        DualDisplayMessaging._handleMessageIsLoggedOnStateChanged = function (isLoggedOnStateChangedData) {
            DualDisplay.Model.DualDisplaySession.instance.isLoggedOnState = {
                isLoggedOn: isLoggedOnStateChangedData.isLoggedOn,
                currentEmployee: isLoggedOnStateChangedData.currentEmployee
            };
        };
        return DualDisplayMessaging;
    }());
    DualDisplay.DualDisplayMessaging = DualDisplayMessaging;
})(DualDisplay || (DualDisplay = {}));
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
var DualDisplay;
(function (DualDisplay) {
    "use strict";
    var DualDisplayToPosSink = (function (_super) {
        __extends(DualDisplayToPosSink, _super);
        function DualDisplayToPosSink() {
            return _super.call(this, {}) || this;
        }
        DualDisplayToPosSink.prototype.writeEvent = function (event) {
            event = this.sanitizeEvent(event);
            DualDisplay.DualDisplayMessaging.sendWriteEventMessage(event);
        };
        DualDisplayToPosSink.prototype.setSessionInfo = function (appSessionId, userSessionId, deviceId, userId, tenantId, offlineAvailability, offlineCurrentMode, screenResolution, deviceRecordId, terminalRecordId) {
            return;
        };
        DualDisplayToPosSink.prototype.setInstrumentationKey = function (instrumentationKey) {
            return;
        };
        return DualDisplayToPosSink;
    }(Microsoft.Dynamics.Diagnostics.TypeScriptCore.LoggingSink));
    DualDisplay.DualDisplayToPosSink = DualDisplayToPosSink;
})(DualDisplay || (DualDisplay = {}));
var DualDisplay;
(function (DualDisplay) {
    var ViewControllers;
    (function (ViewControllers) {
        "use strict";
        var DualDisplayViewController = (function () {
            function DualDisplayViewController() {
                var _this = this;
                var addSessionCartStateUpdateHandler = function (updateCartStateHandler) {
                    Commerce.EventProxy.Instance.addCustomEventHandler(_this._element, "CartStateUpdateEvent", updateCartStateHandler);
                };
                addSessionCartStateUpdateHandler = addSessionCartStateUpdateHandler.bind(this);
                var removeSessionCartStateUpdateHandler = function (updateCartStateHandler) {
                    Commerce.EventProxy.Instance.removeCustomEventHandler(_this._element, "CartStateUpdateEvent", updateCartStateHandler);
                };
                removeSessionCartStateUpdateHandler = removeSessionCartStateUpdateHandler.bind(this);
                var addSessionDualDisplayConfigurationStateUpdateHandler = function (updateDualDisplayConfigurationStateHandler) {
                    Commerce.EventProxy.Instance.addCustomEventHandler(_this._element, "DualDisplayConfigurationStateUpdateEvent", updateDualDisplayConfigurationStateHandler);
                };
                addSessionDualDisplayConfigurationStateUpdateHandler = addSessionDualDisplayConfigurationStateUpdateHandler.bind(this);
                var removeSessionDualDisplayConfigurationStateUpdateHandler = function (updateDualDisplayConfigurationStateHandler) {
                    Commerce.EventProxy.Instance.removeCustomEventHandler(_this._element, "DualDisplayConfigurationStateUpdateEvent", updateDualDisplayConfigurationStateHandler);
                };
                removeSessionDualDisplayConfigurationStateUpdateHandler = removeSessionDualDisplayConfigurationStateUpdateHandler.bind(this);
                var addSessionCustomerStateUpdateHandler = function (updateCustomerStateHandler) {
                    Commerce.EventProxy.Instance.addCustomEventHandler(_this._element, "CustomerStateUpdateEvent", updateCustomerStateHandler);
                };
                addSessionCustomerStateUpdateHandler = addSessionCustomerStateUpdateHandler.bind(this);
                var removeSessionCustomerStateUpdateHandler = function (updateCustomerStateHandler) {
                    Commerce.EventProxy.Instance.removeCustomEventHandler(_this._element, "CustomerStateUpdateEvent", updateCustomerStateHandler);
                };
                removeSessionCustomerStateUpdateHandler = removeSessionCustomerStateUpdateHandler.bind(this);
                var addSessionIsLoggedOnStateUpdateHandler = function (updateIsLoggedOnStateHandler) {
                    Commerce.EventProxy.Instance.addCustomEventHandler(_this._element, "IsLoggedOnStateUpdateEvent", updateIsLoggedOnStateHandler);
                };
                addSessionIsLoggedOnStateUpdateHandler = addSessionIsLoggedOnStateUpdateHandler.bind(this);
                var removeSessionIsLoggedOnStateUpdateHandler = function (updateIsLoggedOnStateHandler) {
                    Commerce.EventProxy.Instance.removeCustomEventHandler(_this._element, "IsLoggedOnStateUpdateEvent", updateIsLoggedOnStateHandler);
                };
                removeSessionIsLoggedOnStateUpdateHandler = removeSessionIsLoggedOnStateUpdateHandler.bind(this);
                var viewModelOptions = {
                    addSessionCartStateUpdateHandler: addSessionCartStateUpdateHandler,
                    removeSessionCartStateUpdateHandler: removeSessionCartStateUpdateHandler,
                    addSessionCustomerStateUpdateHandler: addSessionCustomerStateUpdateHandler,
                    removeSessionCustomerStateUpdateHandler: removeSessionCustomerStateUpdateHandler,
                    addSessionDualDisplayConfigurationStateUpdateHandler: addSessionDualDisplayConfigurationStateUpdateHandler,
                    removeSessionDualDisplayConfigurationStateUpdateHandler: removeSessionDualDisplayConfigurationStateUpdateHandler,
                    addSessionIsLoggedOnStateUpdateHandler: addSessionIsLoggedOnStateUpdateHandler,
                    removeSessionIsLoggedOnStateUpdateHandler: removeSessionIsLoggedOnStateUpdateHandler
                };
                this.viewModel = new DualDisplay.ViewModels.DualDisplayViewModel(viewModelOptions);
            }
            DualDisplayViewController.prototype.load = function () {
                this.viewModel.load();
            };
            DualDisplayViewController.prototype.onCreated = function (element) {
                this._element = element;
            };
            DualDisplayViewController.prototype.onShown = function () {
                this.viewModel.onShown();
            };
            DualDisplayViewController.prototype.onReady = function (element) {
                ko.applyBindings(this, element);
            };
            DualDisplayViewController.prototype.onHidden = function () {
                this.viewModel.onHidden();
            };
            DualDisplayViewController.prototype.dispose = function () {
                Commerce.ObjectExtensions.disposeAllProperties(this);
            };
            return DualDisplayViewController;
        }());
        ViewControllers.DualDisplayViewController = DualDisplayViewController;
    })(ViewControllers = DualDisplay.ViewControllers || (DualDisplay.ViewControllers = {}));
})(DualDisplay || (DualDisplay = {}));
var DualDisplay;
(function (DualDisplay) {
    var Model;
    (function (Model) {
        "use strict";
        var DualDisplaySession = (function () {
            function DualDisplaySession() {
                this._cart = null;
                this._customer = null;
                this._employee = null;
                this._isLoggedOn = false;
            }
            Object.defineProperty(DualDisplaySession, "instance", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(DualDisplaySession._instance)) {
                        DualDisplaySession._instance = new DualDisplaySession();
                    }
                    return DualDisplaySession._instance;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DualDisplaySession.prototype, "cart", {
                get: function () {
                    return this._cart;
                },
                set: function (newCart) {
                    var oldCart = this._cart;
                    this._cart = newCart;
                    Commerce.EventProxy.Instance.raiseCustomEvent("CartStateUpdateEvent", {
                        cartStateType: undefined,
                        oldCart: oldCart
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DualDisplaySession.prototype, "customer", {
                get: function () {
                    return this._customer;
                },
                set: function (newCustomer) {
                    this._customer = newCustomer;
                    Commerce.EventProxy.Instance.raiseCustomEvent("CustomerStateUpdateEvent", newCustomer);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DualDisplaySession.prototype, "dualDisplayConfiguration", {
                get: function () {
                    return this._dualDisplayConfiguration;
                },
                set: function (newConfiguration) {
                    this._dualDisplayConfiguration = newConfiguration;
                    Commerce.EventProxy.Instance.raiseCustomEvent("DualDisplayConfigurationStateUpdateEvent", newConfiguration);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DualDisplaySession.prototype, "isLoggedOnState", {
                set: function (args) {
                    this._isLoggedOn = args.isLoggedOn;
                    this._employee = args.currentEmployee;
                    Commerce.EventProxy.Instance.raiseCustomEvent("IsLoggedOnStateUpdateEvent", {
                        isLoggedOn: this._isLoggedOn,
                        currentEmployee: this._employee
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DualDisplaySession.prototype, "isLoggedOn", {
                get: function () {
                    return this._isLoggedOn;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DualDisplaySession.prototype, "currentEmployee", {
                get: function () {
                    return this._employee;
                },
                enumerable: true,
                configurable: true
            });
            DualDisplaySession._instance = null;
            return DualDisplaySession;
        }());
        Model.DualDisplaySession = DualDisplaySession;
    })(Model = DualDisplay.Model || (DualDisplay.Model = {}));
})(DualDisplay || (DualDisplay = {}));
var DualDisplay;
(function (DualDisplay) {
    var ViewModels;
    (function (ViewModels) {
        "use strict";
        var DualDisplaySession = DualDisplay.Model.DualDisplaySession;
        var ObjectExtensions = Commerce.ObjectExtensions;
        var VoidAsyncResult = Commerce.VoidAsyncResult;
        var ArrayExtensions = Commerce.ArrayExtensions;
        var DualDisplayViewModel = (function () {
            function DualDisplayViewModel(options) {
                var _this = this;
                if (ObjectExtensions.isNullOrUndefined(DualDisplayViewModel._dualDisplayExtensionsManager)) {
                    this._customControlViewModels = [];
                }
                else {
                    this._customControlViewModels = DualDisplayViewModel._dualDisplayExtensionsManager.getCustomControls();
                }
                this._cart = ko.observable(DualDisplaySession.instance.cart);
                this._customer = ko.observable(DualDisplaySession.instance.customer);
                this._dualDisplayConfiguration = ko.observable(DualDisplaySession.instance.dualDisplayConfiguration);
                this._isLoggedOnState = ko.observable({
                    loggedOn: DualDisplaySession.instance.isLoggedOn,
                    employee: DualDisplaySession.instance.currentEmployee
                });
                this._amountDue = ko.computed(function () {
                    return ObjectExtensions.isNullOrUndefined(_this._cart()) ? 0 : _this._cart().AmountDue;
                });
                if (!ObjectExtensions.isNullOrUndefined(options)) {
                    this._addSessionCartStateUpdateHandler = options.addSessionCartStateUpdateHandler;
                    this._removeSessionCartStateUpdateHandler = options.removeSessionCartStateUpdateHandler;
                    this._addSessionCustomerStateUpdateHandler = options.addSessionCustomerStateUpdateHandler;
                    this._removeSessionCustomerStateUpdateHandler = options.removeSessionCustomerStateUpdateHandler;
                    this._addSessionDualDisplayConfigurationStateUpdateHandler = options.addSessionDualDisplayConfigurationStateUpdateHandler;
                    this._removeSessionDualDisplayConfigurationStateUpdateHandler = options.removeSessionDualDisplayConfigurationStateUpdateHandler;
                    this._addSessionIsLoggedOnStateUpdateHandler = options.addSessionIsLoggedOnStateUpdateHandler;
                    this._removeSessionIsLoggedOnStateUpdateHandler = options.removeSessionIsLoggedOnStateUpdateHandler;
                }
                this._sessionCartStateUpdateHandler = function () {
                    _this._cart(DualDisplaySession.instance.cart);
                };
                this._sessionCustomerStateUpdateHandler = function () {
                    _this._customer(DualDisplaySession.instance.customer);
                };
                this._sessionDualDisplayConfigurationStateUpdateHandler = function () {
                    _this._dualDisplayConfiguration(DualDisplaySession.instance.dualDisplayConfiguration);
                };
                this._sessionIsLoggedOnStateUpdateHandler = function () {
                    _this._isLoggedOnState({
                        loggedOn: DualDisplaySession.instance.isLoggedOn,
                        employee: DualDisplaySession.instance.currentEmployee
                    });
                };
                this._cart.subscribe(this._dualDisplayViewModelCartUpdateCallback, this);
                this._customer.subscribe(this._dualDisplayViewModelCustomerUpdateCallback, this);
                this._dualDisplayConfiguration.subscribe(this._dualDisplayViewModelDualDisplayCOnfigurationUpdateCallback, this);
                this._isLoggedOnState.subscribe(this._dualDisplayViewModelLoginStatusUpdateCallback, this);
                this._isBusy = ko.computed(function () {
                    return _this._customControlViewModels.some(function (customControlViewModel) {
                        return customControlViewModel.isBusy();
                    });
                });
            }
            DualDisplayViewModel.prototype.load = function () {
                var _this = this;
                this._customControlViewModels.forEach(function (vm) {
                    var controlState = {
                        cart: _this._cart(),
                        configuration: _this._dualDisplayConfiguration(),
                        customer: _this._customer(),
                        loggedOn: _this._isLoggedOnState().loggedOn,
                        employee: _this._isLoggedOnState().employee
                    };
                    vm.init(controlState);
                });
                return VoidAsyncResult.createResolved();
            };
            Object.defineProperty(DualDisplayViewModel.prototype, "isBusy", {
                get: function () {
                    return this._isBusy;
                },
                enumerable: true,
                configurable: true
            });
            DualDisplayViewModel.prototype.onShown = function () {
                this._addSessionCartStateUpdateHandler(this._sessionCartStateUpdateHandler);
                this._addSessionCustomerStateUpdateHandler(this._sessionCustomerStateUpdateHandler);
                this._addSessionDualDisplayConfigurationStateUpdateHandler(this._sessionDualDisplayConfigurationStateUpdateHandler);
                this._addSessionIsLoggedOnStateUpdateHandler(this._sessionIsLoggedOnStateUpdateHandler);
            };
            DualDisplayViewModel.prototype.onHidden = function () {
                this._removeSessionCartStateUpdateHandler(this._sessionCartStateUpdateHandler);
                this._removeSessionCustomerStateUpdateHandler(this._sessionCustomerStateUpdateHandler);
                this._removeSessionDualDisplayConfigurationStateUpdateHandler(this._sessionDualDisplayConfigurationStateUpdateHandler);
                this._removeSessionIsLoggedOnStateUpdateHandler(this._sessionIsLoggedOnStateUpdateHandler);
            };
            Object.defineProperty(DualDisplayViewModel, "dualDisplayExtensionManager", {
                set: function (manager) {
                    DualDisplayViewModel._dualDisplayExtensionsManager = manager;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DualDisplayViewModel.prototype, "amountDue", {
                get: function () {
                    return this._amountDue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DualDisplayViewModel.prototype, "customControlViewModels", {
                get: function () {
                    return this._customControlViewModels;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DualDisplayViewModel.prototype, "hasCustomControlViewModels", {
                get: function () {
                    return ArrayExtensions.hasElements(this._customControlViewModels);
                },
                enumerable: true,
                configurable: true
            });
            DualDisplayViewModel.prototype._sendMessageToExtensions = function (messageType, messageData) {
                if (ArrayExtensions.hasElements(this._customControlViewModels)) {
                    this._customControlViewModels.forEach(function (vm) {
                        vm.sendMessage(messageType, messageData);
                    });
                }
            };
            DualDisplayViewModel.prototype._dualDisplayViewModelCartUpdateCallback = function (newCart) {
                this._sendMessageToExtensions("CartChanged", { cart: newCart });
            };
            DualDisplayViewModel.prototype._dualDisplayViewModelCustomerUpdateCallback = function (newCustomer) {
                this._sendMessageToExtensions("CustomerChanged", { customer: newCustomer });
            };
            DualDisplayViewModel.prototype._dualDisplayViewModelDualDisplayCOnfigurationUpdateCallback = function (newConfiguration) {
                this._sendMessageToExtensions("DualDisplayConfigurationChanged", newConfiguration);
            };
            DualDisplayViewModel.prototype._dualDisplayViewModelLoginStatusUpdateCallback = function (logOnStatus) {
                this._sendMessageToExtensions("LogOnStatusChanged", { loggedOn: logOnStatus.loggedOn, employee: logOnStatus.employee });
            };
            return DualDisplayViewModel;
        }());
        ViewModels.DualDisplayViewModel = DualDisplayViewModel;
    })(ViewModels = DualDisplay.ViewModels || (DualDisplay.ViewModels = {}));
})(DualDisplay || (DualDisplay = {}));

// SIG // Begin signature block
// SIG // MIIkDgYJKoZIhvcNAQcCoIIj/zCCI/sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // ngVjTaAQnMBeNjEur0QWCSzeD05sgaK8wPEe2PG0dMSg
// SIG // gg2FMIIGAzCCA+ugAwIBAgITMwAAAYivUta5km3o+QAA
// SIG // AAABiDANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTIwMDMwNDE4Mzk0OFoX
// SIG // DTIxMDMwMzE4Mzk0OFowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // kgja8hPgnsMtpuLf2u+MGewvWE8L9T8guAbzP5EljzbP
// SIG // J9EU3vhb2H1PhPbn9Le52JQMx4yvqZYn9gYQ/jYHYSFE
// SIG // PLFcFjt/bY70ER4z9v/70ryH5ppEaDC9SIZ47PZEImUM
// SIG // 2EQ2GEafcUkGJkcEI5OYZfP1O0YDokA4rVR2lOwU9TCP
// SIG // dpX2UbiCAw2AXb17W3JWCTFTsKmbb9Dvc0Aq3rekfn0U
// SIG // hmgzXxBKXCCy/g+0VdzOLmiROE2uigDnb1fjFWiadWFx
// SIG // U2TyraYxzunfaR0D2YhuzXQukG50RprGuPLjUK2+gH5i
// SIG // ygyNS6d9VjKIE2l+bWX/gmU/T0rr4zgizQIDAQABo4IB
// SIG // gjCCAX4wHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFI/USS/czaz3C9dEWXTECF2T
// SIG // ezBvMFQGA1UdEQRNMEukSTBHMS0wKwYDVQQLEyRNaWNy
// SIG // b3NvZnQgSXJlbGFuZCBPcGVyYXRpb25zIExpbWl0ZWQx
// SIG // FjAUBgNVBAUTDTIzMDAxMis0NTgzODYwHwYDVR0jBBgw
// SIG // FoAUSG5k5VAF04KqFzc3IrVtqMp1ApUwVAYDVR0fBE0w
// SIG // SzBJoEegRYZDaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraW9wcy9jcmwvTWljQ29kU2lnUENBMjAxMV8yMDEx
// SIG // LTA3LTA4LmNybDBhBggrBgEFBQcBAQRVMFMwUQYIKwYB
// SIG // BQUHMAKGRWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9w
// SIG // a2lvcHMvY2VydHMvTWljQ29kU2lnUENBMjAxMV8yMDEx
// SIG // LTA3LTA4LmNydDAMBgNVHRMBAf8EAjAAMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQAp16PIY6exXk/h+okJVdwnBp5Emxby
// SIG // KSmGn4M2AhaN1B2NVR2CVW+YxxDvKBtukKgRC5mpOjEy
// SIG // Pq2t1ijExoRNbBCJaME3KeCALPGucKQoelX+Gf2wLSKa
// SIG // T96d4F5Nl/FF03PlsY0GLA5BYks6PzgWuYZHVtYOBKTu
// SIG // N5fZo06AXahD7SF7Gex4tf+suICtD5jIsBvCzKUp9J/6
// SIG // Ehxo61DQYByT8YLOt0pX+fEBgc57l4kWl5n01A3a74Ua
// SIG // HHcSDIvJ10MFgAjIkMyUkcwT+UtsFKu5zAKo2k23l4Sa
// SIG // g9khVR3VGJSq7r7T0sG56kkVkxiPLOBRF7fky98OSZ8F
// SIG // WZmZFBaIqEAzDIxcmirq3SeqZ8269YekFtEfe31nPMRC
// SIG // MyyDolNq48FgLZUKhTvCjYspI2BshH+S8gCSgDvqyXfX
// SIG // 7GEflQWriBEKGJo51G01zEmNi3+SjJblpQzhlYfKul45
// SIG // gXHKWk/vLQn8aWlWD4tZ3J8E8Gj0L1avEY1g0Qez2vK7
// SIG // h4I9hyRYuvfoXKu5lseZ01Lc8xWu0UmXxOWtWuQLgZhj
// SIG // Ua+3/HDX2tNfrYlo1SpNWvoCVAUj9LCMXnBW1Ul02e26
// SIG // nmpeOV0gyIrGQZFm/vN0213UxjA0lBSkwHbQvq9+Rn7D
// SIG // fEFcufR2+WWMwF3M4YEZpOzchOow9GJuUyoluTCCB3ow
// SIG // ggVioAMCAQICCmEOkNIAAAAAAAMwDQYJKoZIhvcNAQEL
// SIG // BQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xMjAwBgNVBAMT
// SIG // KU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhv
// SIG // cml0eSAyMDExMB4XDTExMDcwODIwNTkwOVoXDTI2MDcw
// SIG // ODIxMDkwOVowfjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYG
// SIG // A1UEAxMfTWljcm9zb2Z0IENvZGUgU2lnbmluZyBQQ0Eg
// SIG // MjAxMTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoC
// SIG // ggIBAKvw+nIQHC6t2G6qghBNNLrytlghn0IbKmvpWlCq
// SIG // uAY4GgRJun/DDB7dN2vGEtgL8DjCmQawyDnVARQxQtOJ
// SIG // DXlkh36UYCRsr55JnOloXtLfm1OyCizDr9mpK656Ca/X
// SIG // llnKYBoF6WZ26DJSJhIv56sIUM+zRLdd2MQuA3WraPPL
// SIG // bfM6XKEW9Ea64DhkrG5kNXimoGMPLdNAk/jj3gcN1Vx5
// SIG // pUkp5w2+oBN3vpQ97/vjK1oQH01WKKJ6cuASOrdJXtjt
// SIG // 7UORg9l7snuGG9k+sYxd6IlPhBryoS9Z5JA7La4zWMW3
// SIG // Pv4y07MDPbGyr5I4ftKdgCz1TlaRITUlwzluZH9TupwP
// SIG // rRkjhMv0ugOGjfdf8NBSv4yUh7zAIXQlXxgotswnKDgl
// SIG // mDlKNs98sZKuHCOnqWbsYR9q4ShJnV+I4iVd0yFLPlLE
// SIG // tVc/JAPw0XpbL9Uj43BdD1FGd7P4AOG8rAKCX9vAFbO9
// SIG // G9RVS+c5oQ/pI0m8GLhEfEXkwcNyeuBy5yTfv0aZxe/C
// SIG // HFfbg43sTUkwp6uO3+xbn6/83bBm4sGXgXvt1u1L50kp
// SIG // pxMopqd9Z4DmimJ4X7IvhNdXnFy/dygo8e1twyiPLI9A
// SIG // N0/B4YVEicQJTMXUpUMvdJX3bvh4IFgsE11glZo+TzOE
// SIG // 2rCIF96eTvSWsLxGoGyY0uDWiIwLAgMBAAGjggHtMIIB
// SIG // 6TAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4EFgQUSG5k
// SIG // 5VAF04KqFzc3IrVtqMp1ApUwGQYJKwYBBAGCNxQCBAwe
// SIG // CgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB
// SIG // /wQFMAMBAf8wHwYDVR0jBBgwFoAUci06AjGQQ7kUBU7h
// SIG // 6qfHMdEjiTQwWgYDVR0fBFMwUTBPoE2gS4ZJaHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvTWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIyLmNy
// SIG // bDBeBggrBgEFBQcBAQRSMFAwTgYIKwYBBQUHMAKGQmh0
// SIG // dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMv
// SIG // TWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIyLmNydDCB
// SIG // nwYDVR0gBIGXMIGUMIGRBgkrBgEEAYI3LgMwgYMwPwYI
// SIG // KwYBBQUHAgEWM2h0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2lvcHMvZG9jcy9wcmltYXJ5Y3BzLmh0bTBABggr
// SIG // BgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBwAG8AbABp
// SIG // AGMAeQBfAHMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkq
// SIG // hkiG9w0BAQsFAAOCAgEAZ/KGpZjgVHkaLtPYdGcimwuW
// SIG // EeFjkplCln3SeQyQwWVfLiw++MNy0W2D/r4/6ArKO79H
// SIG // qaPzadtjvyI1pZddZYSQfYtGUFXYDJJ80hpLHPM8QotS
// SIG // 0LD9a+M+By4pm+Y9G6XUtR13lDni6WTJRD14eiPzE32m
// SIG // kHSDjfTLJgJGKsKKELukqQUMm+1o+mgulaAqPyprWElj
// SIG // HwlpblqYluSD9MCP80Yr3vw70L01724lruWvJ+3Q3fMO
// SIG // r5kol5hNDj0L8giJ1h/DMhji8MUtzluetEk5CsYKwsat
// SIG // ruWy2dsViFFFWDgycScaf7H0J/jeLDogaZiyWYlobm+n
// SIG // t3TDQAUGpgEqKD6CPxNNZgvAs0314Y9/HG8VfUWnduVA
// SIG // KmWjw11SYobDHWM2l4bf2vP48hahmifhzaWX0O5dY0Hj
// SIG // Wwechz4GdwbRBrF1HxS+YWG18NzGGwS+30HHDiju3mUv
// SIG // 7Jf2oVyW2ADWoUa9WfOXpQlLSBCZgB/QACnFsZulP0V3
// SIG // HjXG0qKin3p6IvpIlR+r+0cjgPWe+L9rt0uX4ut1eBrs
// SIG // 6jeZeRhL/9azI2h15q/6/IvrC4DqaTuv/DDtBEyO3991
// SIG // bWORPdGdVk5Pv4BXIqF4ETIheu9BCrE/+6jMpF3BoYib
// SIG // V3FWTkhFwELJm3ZbCoBIa/15n8G9bW1qyVJzEw16UM0x
// SIG // ghXhMIIV3QIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABiK9S1rmSbej5AAAAAAGIMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBJzAZBgkqhkiG9w0BCQMxDAYK
// SIG // KwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYKKwYB
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgvYZZoISMot+x
// SIG // J68ZGpGmwEyQTQ11IKB9GZR5tcg0T9gwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // QunvRHE7hul2vIY4Hm8hGzL1fDkTAGwxFzVVLfpRI+AS
// SIG // R1Uaiy6d+kB3dkuSPshN9WPjyn8WPVTUV4Sykv8t8kLG
// SIG // lQPHiTnVtJOo90oUZhYSIYAYkfd0olp708bXo5g+yjTQ
// SIG // JBDpnnFH4s6LzGHo3hil5iQp4YfIz9Zev70wExFguapd
// SIG // VOVC9fE3MzyPXJDmnqCc4ATUJdRKFRWMB983I/FIxVCh
// SIG // GVkD/9XdROuooxVRC2GMrD41y+xps66E+GjOQJTNzULe
// SIG // lkUE/Ab2rlmQiq5DaXOcsCP6b7wfEU7yGcweiOBs+vM1
// SIG // baGHPSleAp/xwSqcmJn/H2/7IU8G5J8yy6GCEvEwghLt
// SIG // BgorBgEEAYI3AwMBMYIS3TCCEtkGCSqGSIb3DQEHAqCC
// SIG // EsowghLGAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFVBgsq
// SIG // hkiG9w0BCRABBKCCAUQEggFAMIIBPAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCBw6FRalaUc8EVv
// SIG // LXsbaRJe2yr8i0eHgLu/8ClK+PdJLgIGXzvljGoiGBMy
// SIG // MDIwMDgyMzA0MDI0NS4wNThaMASAAgH0oIHUpIHRMIHO
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEmMCQG
// SIG // A1UECxMdVGhhbGVzIFRTUyBFU046Nzg4MC1FMzkwLTgw
// SIG // MTQxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFNlcnZpY2Wggg5EMIIE9TCCA92gAwIBAgITMwAAASig
// SIG // DoHhNtVPwgAAAAABKDANBgkqhkiG9w0BAQsFADB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTEyMTkw
// SIG // MTE1MDBaFw0yMTAzMTcwMTE1MDBaMIHOMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3NvZnQgT3Bl
// SIG // cmF0aW9ucyBQdWVydG8gUmljbzEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046Nzg4MC1FMzkwLTgwMTQxJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Uw
// SIG // ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCd
// SIG // kbHW91Tbhj7Nvw4KXPYLe+yxtCT5A+FVk5RCS5Ks50yZ
// SIG // fkaGX4jsDeolnz7uJP5I/J8GO6by7NTrAcuPeMrrIOKx
// SIG // y8BzVCT7cNU3OeDDi4HXKLAODcZIu93w8qlsA7YznZOh
// SIG // +5DXMwT6gAw+gffKLe+/8EgAgSSMZvagFLnarkuX3Mwh
// SIG // dPvmllGrw7uOlN3L+hxIyHVdmXSU1CoOFlCHU2DEFyNP
// SIG // NvqkrOOVgWY3CvfP7SH8fLqvKvJLFhffs1IxkxYjGih4
// SIG // Z+3EgqBI+xNbVZltPCEqUuu/FhT9vgNDkMGlnCSjQAiv
// SIG // ifi2uy89mxrqQonThs+Vw3sHNZQ/Zyz3AgMBAAGjggEb
// SIG // MIIBFzAdBgNVHQ4EFgQUhOLyg/F+tTeb1AHDTnR/UATL
// SIG // pvIwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8UzaFqF
// SIG // bVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWlj
// SIG // VGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoGCCsGAQUF
// SIG // BwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQ
// SIG // Q0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0TAQH/BAIwADAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsF
// SIG // AAOCAQEAi19mRxiFC4A5P4nHB1lMsIw8gLAR5YZJrZga
// SIG // eJZXcC93TaNG12WR4kmQfnNis7z6mOuAZRAo0vz6rq9p
// SIG // vVGk9TdAXlKMER0E/PMHc3feIGKil5iw21UfMnlYAZHD
// SIG // /yYlVm13UM3M9REx4Fq4frswPAcFIAGhycPp12HHCLg4
// SIG // DyTNVE3jZfUeTr3/us0dhOWSOA6yKr0uIx+ELKDD059u
// SIG // wIze1WbeGpqEcTCxHEAEu7z09SVFGkRaRR5pFGFZZ9WD
// SIG // LMP//+vevGkb8t3JgpUuOLsZJGiC24YdYdPXo2Yx4axJ
// SIG // /pPTHFZFormO9uIyf+e7cpTOwP48yFjY9RfFZYZMsjCC
// SIG // BnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZIhvcN
// SIG // AQELBQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xMjAwBgNV
// SIG // BAMTKU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1
// SIG // dGhvcml0eSAyMDEwMB4XDTEwMDcwMTIxMzY1NVoXDTI1
// SIG // MDcwMTIxNDY1NVowfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
// SIG // AoIBAQCpHQ28dxGKOiDs/BOX9fp/aZRrdFQQ1aUKAIKF
// SIG // ++18aEssX8XD5WHCdrc+Zitb8BVTJwQxH0EbGpUdzgkT
// SIG // jnxhMFmxMEQP8WCIhFRDDNdNuDgIs0Ldk6zWczBXJoKj
// SIG // RQ3Q6vVHgc2/JGAyWGBG8lhHhjKEHnRhZ5FfgVSxz5NM
// SIG // ksHEpl3RYRNuKMYa+YaAu99h/EbBJx0kZxJyGiGKr0tk
// SIG // iVBisV39dx898Fd1rL2KQk1AUdEPnAY+Z3/1ZsADlkR+
// SIG // 79BL/W7lmsqxqPJ6Kgox8NpOBpG2iAg16HgcsOmZzTzn
// SIG // L0S6p/TcZL2kAcEgCZN4zfy8wMlEXV4WnAEFTyJNAgMB
// SIG // AAGjggHmMIIB4jAQBgkrBgEEAYI3FQEEAwIBADAdBgNV
// SIG // HQ4EFgQU1WM6XIoxkPNDe3xGG8UzaFqFbVUwGQYJKwYB
// SIG // BAGCNxQCBAweCgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGG
// SIG // MA8GA1UdEwEB/wQFMAMBAf8wHwYDVR0jBBgwFoAU1fZW
// SIG // y4/oolxiaNE9lJBb186aGMQwVgYDVR0fBE8wTTBLoEmg
// SIG // R4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9j
// SIG // cmwvcHJvZHVjdHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYt
// SIG // MjMuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcw
// SIG // AoY+aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9j
// SIG // ZXJ0cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcnQw
// SIG // gaAGA1UdIAEB/wSBlTCBkjCBjwYJKwYBBAGCNy4DMIGB
// SIG // MD0GCCsGAQUFBwIBFjFodHRwOi8vd3d3Lm1pY3Jvc29m
// SIG // dC5jb20vUEtJL2RvY3MvQ1BTL2RlZmF1bHQuaHRtMEAG
// SIG // CCsGAQUFBwICMDQeMiAdAEwAZQBnAGEAbABfAFAAbwBs
// SIG // AGkAYwB5AF8AUwB0AGEAdABlAG0AZQBuAHQALiAdMA0G
// SIG // CSqGSIb3DQEBCwUAA4ICAQAH5ohRDeLG4Jg/gXEDPZ2j
// SIG // oSFvs+umzPUxvs8F4qn++ldtGTCzwsVmyWrf9efweL3H
// SIG // qJ4l4/m87WtUVwgrUYJEEvu5U4zM9GASinbMQEBBm9xc
// SIG // F/9c+V4XNZgkVkt070IQyK+/f8Z/8jd9Wj8c8pl5SpFS
// SIG // AK84Dxf1L3mBZdmptWvkx872ynoAb0swRCQiPM/tA6WW
// SIG // j1kpvLb9BOFwnzJKJ/1Vry/+tuWOM7tiX5rbV0Dp8c6Z
// SIG // ZpCM/2pif93FSguRJuI57BlKcWOdeyFtw5yjojz6f32W
// SIG // apB4pm3S4Zz5Hfw42JT0xqUKloakvZ4argRCg7i1gJsi
// SIG // OCC1JeVk7Pf0v35jWSUPei45V3aicaoGig+JFrphpxHL
// SIG // mtgOR5qAxdDNp9DvfYPw4TtxCd9ddJgiCGHasFAeb73x
// SIG // 4QDf5zEHpJM692VHeOj4qEir995yfmFrb3epgcunCaw5
// SIG // u+zGy9iCtHLNHfS4hQEegPsbiSpUObJb2sgNVZl6h3M7
// SIG // COaYLeqN4DMuEin1wC9UJyH3yKxO2ii4sanblrKnQqLJ
// SIG // zxlBTeCG+SqaoxFmMNO7dDJL32N79ZmKLxvHIa9Zta7c
// SIG // RDyXUHHXodLFVeNp3lfB0d4wwP3M5k37Db9dT+mdHhk4
// SIG // L7zPWAUu7w2gUDXa7wknHNWzfjUeCLraNtvTX4/edIhJ
// SIG // EqGCAtIwggI7AgEBMIH8oYHUpIHRMIHOMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3NvZnQgT3Bl
// SIG // cmF0aW9ucyBQdWVydG8gUmljbzEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046Nzg4MC1FMzkwLTgwMTQxJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wi
// SIG // IwoBATAHBgUrDgMCGgMVADE9SxvygBI9F7Ii/Z+5sZl9
// SIG // Wn2boIGDMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTAwDQYJKoZIhvcNAQEFBQACBQDi7FKjMCIYDzIw
// SIG // MjAwODIzMDYyNzQ3WhgPMjAyMDA4MjQwNjI3NDdaMHcw
// SIG // PQYKKwYBBAGEWQoEATEvMC0wCgIFAOLsUqMCAQAwCgIB
// SIG // AAICEC4CAf8wBwIBAAICEZcwCgIFAOLtpCMCAQAwNgYK
// SIG // KwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAqAKMAgC
// SIG // AQACAwehIKEKMAgCAQACAwGGoDANBgkqhkiG9w0BAQUF
// SIG // AAOBgQBV+kBJOQaZrzlq4WM7EWCQs1Rmq2PDqw4oGWus
// SIG // 0pQQ7k52VPQNNi9olWD2kYXzkwv2kCQFw5u1xW/4DdTT
// SIG // gtql806dNIXGnp2BNbYlsQ4hz01zRJ0PuqIB0iUk3nt/
// SIG // pRub3srzui6iO7CIjDcHzaMIf6EJmT4eRzjFI/+nowK4
// SIG // uzGCAw0wggMJAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABKKAOgeE21U/CAAAAAAEoMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYL
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIFjVkOSw
// SIG // 3cMRIlrUgbsR75Bz/C0aRmWAmQb0kPosktj9MIH6Bgsq
// SIG // hkiG9w0BCRACLzGB6jCB5zCB5DCBvQQgvEVqi68FUnfv
// SIG // 3BsQ3wakuG9bT14aDxawuteb1dboFNowgZgwgYCkfjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAASig
// SIG // DoHhNtVPwgAAAAABKDAiBCCrtywDQ4+oO/28q4trziVO
// SIG // SIb91wyeowerhFsxJNxURDANBgkqhkiG9w0BAQsFAASC
// SIG // AQBWx2pbnU8GctNkao8wdcA0rLRQar4aSXvCoiMShDht
// SIG // Qv6NYEAWnwdzOW8rLoKiaUpkjKXfoLkPzMCIwaYv2QKF
// SIG // QsXODC0rnLqe27RcO3PmjtOC3pbTiUy/OHEb49Cb1jp9
// SIG // MAWLoVLWv+Kqofi6Uaee7iAOj1JhxjxZAovKn+CaolTX
// SIG // L3AJi/FO2r8nj16EAmFmkyfMrLE9vrDcOSPXdboZ+gPC
// SIG // jNA++JLN2I4dhcpDgNylbLxpSELstt5LXXvyy6NXGlfr
// SIG // 4FR9Q+UB/phnZ1Elro9BUDoVqsqik9YaTBMOvzxyo6Gu
// SIG // BZQdFr1X23KjazisB3znTx3bfyEG+Oz0Wje0
// SIG // End signature block