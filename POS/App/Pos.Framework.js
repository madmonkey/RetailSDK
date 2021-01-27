"use strict";
var Commerce;
(function (Commerce) {
    "use strict";
    var ApplicationStorageIDs;
    (function (ApplicationStorageIDs) {
        ApplicationStorageIDs[ApplicationStorageIDs["CART_KEY"] = 0] = "CART_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["CASH_DRAWER_NAME"] = 1] = "CASH_DRAWER_NAME";
        ApplicationStorageIDs[ApplicationStorageIDs["CASH_DRAWER_TYPE"] = 2] = "CASH_DRAWER_TYPE";
        ApplicationStorageIDs[ApplicationStorageIDs["CUSTOM_UI_STRINGS_KEY"] = 3] = "CUSTOM_UI_STRINGS_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["CONNECTION_STATUS"] = 4] = "CONNECTION_STATUS";
        ApplicationStorageIDs[ApplicationStorageIDs["CONNECTION_TIMEOUT_IN_SECONDS"] = 5] = "CONNECTION_TIMEOUT_IN_SECONDS";
        ApplicationStorageIDs[ApplicationStorageIDs["ENVIRONMENT_CONFIGURATION_KEY"] = 6] = "ENVIRONMENT_CONFIGURATION_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["DEVICE_CONFIGURATION_KEY"] = 7] = "DEVICE_CONFIGURATION_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["DEVICE_ID_KEY"] = 8] = "DEVICE_ID_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["DEVICE_RECID"] = 9] = "DEVICE_RECID";
        ApplicationStorageIDs[ApplicationStorageIDs["DEVICE_TOKEN_KEY"] = 10] = "DEVICE_TOKEN_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["EMPLOYEE_LIST_KEY"] = 11] = "EMPLOYEE_LIST_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["HARDWARE_PROFILE_KEY"] = 12] = "HARDWARE_PROFILE_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["ACTIVE_HARDWARE_STATION"] = 13] = "ACTIVE_HARDWARE_STATION";
        ApplicationStorageIDs[ApplicationStorageIDs["HARDWARE_STATION_ENPOINT_STORAGE"] = 14] = "HARDWARE_STATION_ENPOINT_STORAGE";
        ApplicationStorageIDs[ApplicationStorageIDs["INITIAL_SYNC_COMPLETED_KEY"] = 15] = "INITIAL_SYNC_COMPLETED_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["NUMBER_SEQUENCES_KEY"] = 16] = "NUMBER_SEQUENCES_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["CART_RECEIPT_NUMBER_SEQUENCE_KEY"] = 17] = "CART_RECEIPT_NUMBER_SEQUENCE_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["PRELOGON_SWITCHED_OFFLINE"] = 18] = "PRELOGON_SWITCHED_OFFLINE";
        ApplicationStorageIDs[ApplicationStorageIDs["REGISTER_ID_KEY"] = 19] = "REGISTER_ID_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["REGISTER_RECID"] = 20] = "REGISTER_RECID";
        ApplicationStorageIDs[ApplicationStorageIDs["RETAIL_SERVER_URL"] = 21] = "RETAIL_SERVER_URL";
        ApplicationStorageIDs[ApplicationStorageIDs["SHIFT_KEY"] = 22] = "SHIFT_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["OPENED_SHIFTS_KEY"] = 23] = "OPENED_SHIFTS_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["STORE_ID_KEY"] = 24] = "STORE_ID_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["FIRST_TIME_USE"] = 25] = "FIRST_TIME_USE";
        ApplicationStorageIDs[ApplicationStorageIDs["BUBBLE_TOUR_DISABLED"] = 26] = "BUBBLE_TOUR_DISABLED";
        ApplicationStorageIDs[ApplicationStorageIDs["VIDEO_TUTORIAL_DISABLED"] = 27] = "VIDEO_TUTORIAL_DISABLED";
        ApplicationStorageIDs[ApplicationStorageIDs["AAD_LOGON_IN_PROCESS_KEY"] = 28] = "AAD_LOGON_IN_PROCESS_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["ACTIVATION_PAGE_PARAMETERS_KEY"] = 29] = "ACTIVATION_PAGE_PARAMETERS_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["CLOUD_SESSION_ID"] = 30] = "CLOUD_SESSION_ID";
        ApplicationStorageIDs[ApplicationStorageIDs["DEV_MODE_ENABLED"] = 31] = "DEV_MODE_ENABLED";
        ApplicationStorageIDs[ApplicationStorageIDs["CSS_THEME_COLOR"] = 32] = "CSS_THEME_COLOR";
        ApplicationStorageIDs[ApplicationStorageIDs["CSS_BODY_DIRECTION"] = 33] = "CSS_BODY_DIRECTION";
        ApplicationStorageIDs[ApplicationStorageIDs["CSS_DEV_GRID"] = 34] = "CSS_DEV_GRID";
        ApplicationStorageIDs[ApplicationStorageIDs["CSS_DEV_COLORS"] = 35] = "CSS_DEV_COLORS";
        ApplicationStorageIDs[ApplicationStorageIDs["APP_BAR_ALWAYS_VISIBLE"] = 36] = "APP_BAR_ALWAYS_VISIBLE";
        ApplicationStorageIDs[ApplicationStorageIDs["APPLICATION_VERSION"] = 37] = "APPLICATION_VERSION";
        ApplicationStorageIDs[ApplicationStorageIDs["TENANT_ID"] = 38] = "TENANT_ID";
        ApplicationStorageIDs[ApplicationStorageIDs["DEVICE_ACTIVATION_COMPLETED"] = 39] = "DEVICE_ACTIVATION_COMPLETED";
        ApplicationStorageIDs[ApplicationStorageIDs["RETAILSERVER_TENANT_ID"] = 40] = "RETAILSERVER_TENANT_ID";
        ApplicationStorageIDs[ApplicationStorageIDs["CURRENT_ACTIVATION_PROCESS"] = 41] = "CURRENT_ACTIVATION_PROCESS";
        ApplicationStorageIDs[ApplicationStorageIDs["PERFORMANCE_LOGGER_SETTINGS"] = 42] = "PERFORMANCE_LOGGER_SETTINGS";
        ApplicationStorageIDs[ApplicationStorageIDs["DEVELOPER_MODE_SHOW_STRING_IDS"] = 43] = "DEVELOPER_MODE_SHOW_STRING_IDS";
        ApplicationStorageIDs[ApplicationStorageIDs["ENABLE_PSEUDO_LOCALIZATION"] = 44] = "ENABLE_PSEUDO_LOCALIZATION";
        ApplicationStorageIDs[ApplicationStorageIDs["HARDWARE_STATION_FEATURE_ENABLE"] = 45] = "HARDWARE_STATION_FEATURE_ENABLE";
        ApplicationStorageIDs[ApplicationStorageIDs["CASH_DRAWER_OPEN_STATUS"] = 46] = "CASH_DRAWER_OPEN_STATUS";
        ApplicationStorageIDs[ApplicationStorageIDs["PAYMENT_MERCHANT_PROPERTIES_HASH_VALUE"] = 47] = "PAYMENT_MERCHANT_PROPERTIES_HASH_VALUE";
        ApplicationStorageIDs[ApplicationStorageIDs["AAD_OPERATOR_LOGIN_INITIATED"] = 48] = "AAD_OPERATOR_LOGIN_INITIATED";
        ApplicationStorageIDs[ApplicationStorageIDs["AAD_LOGOFF_INITIATED"] = 49] = "AAD_LOGOFF_INITIATED";
        ApplicationStorageIDs[ApplicationStorageIDs["PAYMENT_TRANSACTION_REFERENCE_DATA"] = 50] = "PAYMENT_TRANSACTION_REFERENCE_DATA";
        ApplicationStorageIDs[ApplicationStorageIDs["CURRENT_FISCAL_REGISTRATION_PROCESS"] = 51] = "CURRENT_FISCAL_REGISTRATION_PROCESS";
        ApplicationStorageIDs[ApplicationStorageIDs["CHANNEL_CONFIGURATION_KEY"] = 52] = "CHANNEL_CONFIGURATION_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["EXTENSIBLE_ENUMS_KEY"] = 53] = "EXTENSIBLE_ENUMS_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["EXTENSION_PACKAGE_DEFINITIONS_KEY"] = 54] = "EXTENSION_PACKAGE_DEFINITIONS_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["FISCAL_SEQUENTIAL_SIGNATURES"] = 55] = "FISCAL_SEQUENTIAL_SIGNATURES";
        ApplicationStorageIDs[ApplicationStorageIDs["FEATURE_STATES_KEY"] = 56] = "FEATURE_STATES_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["NUMBER_SEQUENCES_SEED_DATA_KEY"] = 57] = "NUMBER_SEQUENCES_SEED_DATA_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["RECEIPT_NUMBER_RESET_INFO_KEY"] = 58] = "RECEIPT_NUMBER_RESET_INFO_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["RECEIPT_NUMBER_RESET_INFO_DATE_KEY"] = 59] = "RECEIPT_NUMBER_RESET_INFO_DATE_KEY";
        ApplicationStorageIDs[ApplicationStorageIDs["FISCAL_AUDIT_EVENT_REGISTRATION_PROCESS"] = 60] = "FISCAL_AUDIT_EVENT_REGISTRATION_PROCESS";
        ApplicationStorageIDs[ApplicationStorageIDs["AUDIT_EVENTS_QUEUE"] = 61] = "AUDIT_EVENTS_QUEUE";
        ApplicationStorageIDs[ApplicationStorageIDs["VISUAL_PROFILE_KEY"] = 62] = "VISUAL_PROFILE_KEY";
    })(ApplicationStorageIDs = Commerce.ApplicationStorageIDs || (Commerce.ApplicationStorageIDs = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var ApplicationStorage = (function () {
        function ApplicationStorage() {
        }
        ApplicationStorage.initialize = function (storage) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(storage)) {
                throw new Commerce.Proxy.Entities.Error("ApplicationStorage initialize: the storage cannot be null or undefined.");
            }
            ApplicationStorage._storageValue = storage;
            var deviceConfigurationKey = Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.DEVICE_CONFIGURATION_KEY];
            var deviceConfiguration = JSON.parse(storage.getItem(deviceConfigurationKey));
            if (!Commerce.ObjectExtensions.isNullOrUndefined(deviceConfiguration)) {
                ApplicationStorage._storage.updateStoragePreference(deviceConfiguration.UseInMemoryDeviceDataStorage === true);
            }
        };
        ApplicationStorage.getItem = function (key) {
            var value = ApplicationStorage._storage.getItem(Commerce.ApplicationStorageIDs[key]);
            return value === undefined ? null : value;
        };
        ApplicationStorage.setItem = function (key, value) {
            value = Commerce.StringExtensions.EMPTY + value;
            ApplicationStorage._storage.setItem(Commerce.ApplicationStorageIDs[key], value);
        };
        ApplicationStorage.removeItem = function (key) {
            ApplicationStorage._storage.removeItem(Commerce.ApplicationStorageIDs[key]);
        };
        ApplicationStorage.clear = function () {
            ApplicationStorage._storage.clear();
            ApplicationStorage._storage.updateStoragePreference(false);
        };
        ApplicationStorage.updateStorageConfiguration = function (deviceConfiguration) {
            var preferTransientStorage = Commerce.ObjectExtensions.isNullOrUndefined(deviceConfiguration)
                || (deviceConfiguration.UseInMemoryDeviceDataStorage !== false);
            ApplicationStorage._storage.updateStoragePreference(preferTransientStorage);
        };
        Object.defineProperty(ApplicationStorage, "_storage", {
            get: function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(ApplicationStorage._storageValue)) {
                    return ApplicationStorage._storageValue;
                }
                Commerce.RetailLogger.applicationStorageNotInitialized();
                throw new Error("ApplicationStorage must be initialized first.");
            },
            enumerable: true,
            configurable: true
        });
        ApplicationStorage._storageValue = null;
        return ApplicationStorage;
    }());
    Commerce.ApplicationStorage = ApplicationStorage;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var AsyncQueue = (function () {
        function AsyncQueue() {
            this._asyncFunctions = [];
            this._runAsyncResult = null;
            this._isCanceled = false;
            this._isRunning = false;
        }
        AsyncQueue.prototype.enqueue = function (asyncFunction) {
            if (Commerce.ObjectExtensions.isFunction(asyncFunction) && !this._isCanceled) {
                this._asyncFunctions.push(asyncFunction);
            }
            return this;
        };
        AsyncQueue.prototype.cancelOn = function (result) {
            var _this = this;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(result)) {
                result.done(function (cancelResult) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(cancelResult) && cancelResult.canceled) {
                        _this.cancel();
                    }
                });
            }
            return result;
        };
        AsyncQueue.prototype.cancel = function (predicate) {
            var _this = this;
            if (!Commerce.ObjectExtensions.isFunction(predicate)) {
                this._isCanceled = true;
            }
            else {
                this.enqueue(function (args) {
                    _this._isCanceled = predicate(args);
                    return Commerce.AsyncResult.createResolved(args);
                });
            }
            return this;
        };
        AsyncQueue.prototype.run = function () {
            var _this = this;
            if (this._isRunning) {
                return this._runAsyncResult;
            }
            this._isRunning = true;
            var promiseResult = this._asyncFunctions.reduce(function (previousPromise, asyncFunction) {
                return previousPromise.then(function (previousResult) {
                    if (_this._isCanceled) {
                        return Promise.resolve(null);
                    }
                    var asyncResult;
                    try {
                        asyncResult = asyncFunction(previousResult);
                    }
                    catch (exception) {
                        var errors = Commerce.Framework.ErrorConverter.toProxyErrors(exception);
                        var errorsToLog = Commerce.Framework.ErrorConverter.serializeError(errors);
                        Commerce.RetailLogger.coreAsyncQueueRunThrewAnException(errorsToLog);
                        return Promise.reject(errors);
                    }
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(asyncResult)) {
                        return asyncResult.getPromise();
                    }
                    else {
                        return Promise.resolve(null);
                    }
                });
            }, Promise.resolve(null)).then(function (result) {
                _this._asyncFunctions = [];
                return { canceled: _this._isCanceled, data: result };
            }).catch(function (errors) {
                _this._asyncFunctions = [];
                return Promise.reject(errors);
            });
            return (this._runAsyncResult = Commerce.AsyncResult.fromPromise(promiseResult));
        };
        return AsyncQueue;
    }());
    Commerce.AsyncQueue = AsyncQueue;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        var ErrorCodes;
        (function (ErrorCodes) {
            "use strict";
            ErrorCodes.FEATURE_NOT_SUPPORTED_ON_DEVICE_TYPE = "string_29079";
            ErrorCodes.APPLICATION_ERROR = "string_29000";
        })(ErrorCodes = Framework.ErrorCodes || (Framework.ErrorCodes = {}));
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
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
    var Framework;
    (function (Framework) {
        "use strict";
        var LoadJsonClientResponse = (function (_super) {
            __extends(LoadJsonClientResponse, _super);
            function LoadJsonClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return LoadJsonClientResponse;
        }(Commerce.ClientResponse));
        Framework.LoadJsonClientResponse = LoadJsonClientResponse;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var LoadJsonClientRequest = (function (_super) {
            __extends(LoadJsonClientRequest, _super);
            function LoadJsonClientRequest(correlationId, fileUri) {
                var _this = _super.call(this, correlationId) || this;
                _this.fileUri = fileUri;
                return _this;
            }
            return LoadJsonClientRequest;
        }(Commerce.ClientRequest));
        Framework.LoadJsonClientRequest = LoadJsonClientRequest;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var ShowErrorMessageClientResponse = (function (_super) {
            __extends(ShowErrorMessageClientResponse, _super);
            function ShowErrorMessageClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ShowErrorMessageClientResponse;
        }(Commerce.ClientResponse));
        Framework.ShowErrorMessageClientResponse = ShowErrorMessageClientResponse;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var ShowErrorMessageClientRequest = (function (_super) {
            __extends(ShowErrorMessageClientRequest, _super);
            function ShowErrorMessageClientRequest(correlationId, errors, titleResourceId) {
                var _this = _super.call(this, correlationId) || this;
                _this.errors = errors;
                _this.titleResourceId = Commerce.StringExtensions.isNullOrWhitespace(titleResourceId) ? Commerce.StringExtensions.EMPTY : titleResourceId;
                return _this;
            }
            return ShowErrorMessageClientRequest;
        }(Commerce.ClientRequest));
        Framework.ShowErrorMessageClientRequest = ShowErrorMessageClientRequest;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Client;
    (function (Client) {
        var Entities;
        (function (Entities) {
            "use strict";
            var BrowserType;
            (function (BrowserType) {
                BrowserType[BrowserType["IE11"] = 0] = "IE11";
                BrowserType[BrowserType["Chrome"] = 1] = "Chrome";
                BrowserType[BrowserType["Other"] = 2] = "Other";
                BrowserType[BrowserType["Edge"] = 3] = "Edge";
                BrowserType[BrowserType["Phantom"] = 4] = "Phantom";
            })(BrowserType = Entities.BrowserType || (Entities.BrowserType = {}));
        })(Entities = Client.Entities || (Client.Entities = {}));
    })(Client = Commerce.Client || (Commerce.Client = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Client;
    (function (Client) {
        var Entities;
        (function (Entities) {
            "use strict";
        })(Entities = Client.Entities || (Client.Entities = {}));
    })(Client = Commerce.Client || (Commerce.Client = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Client;
    (function (Client) {
        var Entities;
        (function (Entities) {
            var PosExtensionError = (function (_super) {
                __extends(PosExtensionError, _super);
                function PosExtensionError(errorDetails) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(errorDetails) || Commerce.StringExtensions.isNullOrWhitespace(errorDetails.localizedMessage)) {
                        throw "Invalid details provided to the ExtensionError constructor. Error details with a localized message must be provided.";
                    }
                    _this = _super.call(this, "string_29000", false, errorDetails.localizedMessage) || this;
                    _this.__proto__ = PosExtensionError.prototype;
                    _this._localizedMessage = errorDetails.localizedMessage;
                    return _this;
                }
                Object.defineProperty(PosExtensionError.prototype, "localizedMessage", {
                    get: function () {
                        return this._localizedMessage;
                    },
                    enumerable: true,
                    configurable: true
                });
                return PosExtensionError;
            }(Commerce.Proxy.Entities.Error));
            Entities.PosExtensionError = PosExtensionError;
        })(Entities = Client.Entities || (Client.Entities = {}));
    })(Client = Commerce.Client || (Commerce.Client = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var CommerceExceptionError = (function (_super) {
            __extends(CommerceExceptionError, _super);
            function CommerceExceptionError(correlationId, exception, formatData) {
                var _this = _super.call(this, exception.ErrorResourceId, false, exception.LocalizedMessage, formatData) || this;
                _this.name = "CommerceExceptionError";
                _this.__proto__ = CommerceExceptionError.prototype;
                _this._exception = exception;
                _this._correlationId = correlationId;
                return _this;
            }
            Object.defineProperty(CommerceExceptionError.prototype, "correlationId", {
                get: function () {
                    return this._correlationId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommerceExceptionError.prototype, "commerceException", {
                get: function () {
                    return this._exception;
                },
                enumerable: true,
                configurable: true
            });
            return CommerceExceptionError;
        }(Commerce.Proxy.Entities.Error));
        Framework.CommerceExceptionError = CommerceExceptionError;
        var DataValidationExceptionError = (function (_super) {
            __extends(DataValidationExceptionError, _super);
            function DataValidationExceptionError(correlationId, exception, formatData) {
                var _this = _super.call(this, correlationId, exception, formatData) || this;
                _this.name = "DataValidationExceptionError";
                _this.__proto__ = DataValidationExceptionError.prototype;
                _this._validationFailures = exception.ValidationResults || [];
                return _this;
            }
            Object.defineProperty(DataValidationExceptionError.prototype, "validationFailures", {
                get: function () {
                    return this._validationFailures;
                },
                enumerable: true,
                configurable: true
            });
            return DataValidationExceptionError;
        }(CommerceExceptionError));
        Framework.DataValidationExceptionError = DataValidationExceptionError;
        var MissingReasonCodeExceptionError = (function (_super) {
            __extends(MissingReasonCodeExceptionError, _super);
            function MissingReasonCodeExceptionError(correlationId, exception) {
                var _this = _super.call(this, correlationId, exception) || this;
                _this.name = "MissingReasonCodeExceptionError";
                _this.__proto__ = MissingReasonCodeExceptionError.prototype;
                return _this;
            }
            return MissingReasonCodeExceptionError;
        }(DataValidationExceptionError));
        Framework.MissingReasonCodeExceptionError = MissingReasonCodeExceptionError;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        var Errors;
        (function (Errors) {
            "use strict";
            var RetailServerRedirectError = (function (_super) {
                __extends(RetailServerRedirectError, _super);
                function RetailServerRedirectError(errorCode, localizedErrorMessage, redirectUrl) {
                    var _this = _super.call(this, errorCode, false, localizedErrorMessage) || this;
                    _this.__proto__ = RetailServerRedirectError.prototype;
                    _this._redirectUrl = redirectUrl;
                    return _this;
                }
                Object.defineProperty(RetailServerRedirectError.prototype, "redirectUrl", {
                    get: function () {
                        return this._redirectUrl;
                    },
                    enumerable: true,
                    configurable: true
                });
                return RetailServerRedirectError;
            }(Commerce.Proxy.Entities.Error));
            Errors.RetailServerRedirectError = RetailServerRedirectError;
            var ServiceUnavailableError = (function (_super) {
                __extends(ServiceUnavailableError, _super);
                function ServiceUnavailableError(errorCode, localizedErrorMessage, additionalInfoResourceId) {
                    var _this = _super.call(this, errorCode, false, localizedErrorMessage) || this;
                    _this.__proto__ = ServiceUnavailableError.prototype;
                    _this.additionalInfoResourceId = additionalInfoResourceId;
                    return _this;
                }
                return ServiceUnavailableError;
            }(Commerce.Proxy.Entities.Error));
            Errors.ServiceUnavailableError = ServiceUnavailableError;
        })(Errors = Framework.Errors || (Framework.Errors = {}));
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var EventManager = (function () {
        function EventManager() {
            this._eventListenersMap = Object.create(null);
            this._isDisposed = false;
        }
        EventManager.prototype.dispose = function () {
            Commerce.ObjectExtensions.disposeAllProperties(this);
            this._isDisposed = true;
        };
        EventManager.prototype.addEventListener = function (eventName, eventListener) {
            if (this._isDisposed) {
                Commerce.RetailLogger.eventingEventManagerAddEventListenerCalledAfterDisposal(eventName.toString());
                return;
            }
            else if (!Commerce.ObjectExtensions.isFunction(eventListener)) {
                Commerce.RetailLogger.eventingEventManagerAddEventListenerCalledWithInvalidListener(eventName.toString());
                return;
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(this._eventListenersMap[eventName])) {
                this._eventListenersMap[eventName] = [];
            }
            this._eventListenersMap[eventName].push(eventListener);
        };
        EventManager.prototype.removeEventListener = function (eventName, eventListener) {
            if (this._isDisposed) {
                Commerce.RetailLogger.eventingEventManagerRemoveEventListenerCalledAfterDisposal(eventName.toString());
                return;
            }
            else if (!Commerce.ObjectExtensions.isFunction(eventListener)) {
                Commerce.RetailLogger.eventingEventManagerRemoveEventListenerCalledWithInvalidListener(eventName.toString());
                return;
            }
            var currentEventListeners = this._eventListenersMap[eventName];
            if (Commerce.ObjectExtensions.isNullOrUndefined(currentEventListeners)) {
                currentEventListeners = [];
            }
            var indexOfMatchingEventListener = currentEventListeners.indexOf(eventListener);
            if (indexOfMatchingEventListener > -1) {
                currentEventListeners.splice(indexOfMatchingEventListener, 1);
            }
        };
        EventManager.prototype.raiseEvent = function (eventName, eventData) {
            if (this._isDisposed) {
                Commerce.RetailLogger.eventingEventManagerRaiseEventCalledAfterDisposal(eventName.toString());
                return;
            }
            var eventListeners = this._eventListenersMap[eventName];
            if (Commerce.ObjectExtensions.isNullOrUndefined(eventListeners)) {
                eventListeners = [];
            }
            eventListeners.forEach(function (eventListener) {
                try {
                    eventListener(eventData);
                }
                catch (exception) {
                    Commerce.RetailLogger.eventingEventManagerExceptionThrownWhileCallingEventListener(eventName.toString(), exception.name, exception.message);
                }
            });
        };
        return EventManager;
    }());
    Commerce.EventManager = EventManager;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IAsyncServiceManagerName = "IAsyncServiceManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IAuditEventManagerName = "IAuditEventManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IAuthenticationManagerName = "IAuthenticationManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.ICartManagerName = "ICartManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IChannelManagerName = "IChannelManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IChecklistManagerName = "IChecklistManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.ICustomerManagerName = "ICustomerManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IEmployeeManagerName = "IEmployeeManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IFiscalIntegrationManagerName = "IFiscalIntegrationManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IFiscalRegisterManagerName = "IFiscalRegisterManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IFulfillmentManagerName = "IFulfillmentManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IInventoryManagerName = "IInventoryManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.INotificationManagerName = "INotificationManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IOperatorManagerName = "IOperatorManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IPaymentManagerName = "IPaymentManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IProductDataManagerName = "IProductDataManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IProductManagerName = "IProductManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IRecordingManagerName = "IRecordingManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IReportManagerName = "IReportManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.ISalesOrderManagerName = "ISalesOrderManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IServerHealthCheckManagerName = "IServerHealthCheckManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IStockCountJournalManagerName = "IStockCountJournalManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IStoreOperationsManagerName = "IStoreOperationsManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.ISuspendedCartManagerName = "ISuspendedCartManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.ITillLayoutManagerName = "ITillLayoutManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Model;
    (function (Model) {
        var Managers;
        (function (Managers) {
            "use strict";
            Managers.IWarehouseManagerName = "IWarehouseManager";
        })(Managers = Model.Managers || (Model.Managers = {}));
    })(Model = Commerce.Model || (Commerce.Model = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var Entities;
        (function (Entities) {
            "use strict";
        })(Entities = Peripherals.Entities || (Peripherals.Entities = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var Entities;
        (function (Entities) {
            "use strict";
        })(Entities = Peripherals.Entities || (Peripherals.Entities = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var GetApplicationUpdateStatusClientResponse = (function (_super) {
            __extends(GetApplicationUpdateStatusClientResponse, _super);
            function GetApplicationUpdateStatusClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetApplicationUpdateStatusClientResponse;
        }(Commerce.ClientResponse));
        Framework.GetApplicationUpdateStatusClientResponse = GetApplicationUpdateStatusClientResponse;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var GetApplicationUpdateStatusClientRequest = (function (_super) {
            __extends(GetApplicationUpdateStatusClientRequest, _super);
            function GetApplicationUpdateStatusClientRequest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetApplicationUpdateStatusClientRequest;
        }(Commerce.ClientRequest));
        Framework.GetApplicationUpdateStatusClientRequest = GetApplicationUpdateStatusClientRequest;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        var DownloadTaskRecorderFileClientResponse = (function (_super) {
            __extends(DownloadTaskRecorderFileClientResponse, _super);
            function DownloadTaskRecorderFileClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return DownloadTaskRecorderFileClientResponse;
        }(Commerce.ClientResponse));
        TaskRecorder.DownloadTaskRecorderFileClientResponse = DownloadTaskRecorderFileClientResponse;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        var DownloadTaskRecorderFileClientRequest = (function (_super) {
            __extends(DownloadTaskRecorderFileClientRequest, _super);
            function DownloadTaskRecorderFileClientRequest(correlationId, url) {
                var _this = _super.call(this, correlationId) || this;
                _this.fileUrl = url;
                return _this;
            }
            return DownloadTaskRecorderFileClientRequest;
        }(Commerce.ClientRequest));
        TaskRecorder.DownloadTaskRecorderFileClientRequest = DownloadTaskRecorderFileClientRequest;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        var TakeTaskRecorderScreenshotClientResponse = (function (_super) {
            __extends(TakeTaskRecorderScreenshotClientResponse, _super);
            function TakeTaskRecorderScreenshotClientResponse(screenshotUri) {
                var _this = _super.call(this, void 0) || this;
                _this.screenshotUri = screenshotUri;
                return _this;
            }
            return TakeTaskRecorderScreenshotClientResponse;
        }(Commerce.ClientResponse));
        TaskRecorder.TakeTaskRecorderScreenshotClientResponse = TakeTaskRecorderScreenshotClientResponse;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        var TakeTaskRecorderScreenshotClientRequest = (function (_super) {
            __extends(TakeTaskRecorderScreenshotClientRequest, _super);
            function TakeTaskRecorderScreenshotClientRequest(correlationId, sessionId, stepId) {
                var _this = _super.call(this, correlationId) || this;
                _this.sessionId = sessionId;
                _this.stepId = stepId;
                return _this;
            }
            return TakeTaskRecorderScreenshotClientRequest;
        }(Commerce.ClientRequest));
        TaskRecorder.TakeTaskRecorderScreenshotClientRequest = TakeTaskRecorderScreenshotClientRequest;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        var UploadTaskRecorderScreenshotsResponse = (function (_super) {
            __extends(UploadTaskRecorderScreenshotsResponse, _super);
            function UploadTaskRecorderScreenshotsResponse(nodes) {
                var _this = _super.call(this, void 0) || this;
                _this.nodes = nodes;
                return _this;
            }
            return UploadTaskRecorderScreenshotsResponse;
        }(Commerce.ClientResponse));
        TaskRecorder.UploadTaskRecorderScreenshotsResponse = UploadTaskRecorderScreenshotsResponse;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        var UploadTaskRecorderScreenshotsRequest = (function (_super) {
            __extends(UploadTaskRecorderScreenshotsRequest, _super);
            function UploadTaskRecorderScreenshotsRequest(correlationId, nodes) {
                var _this = _super.call(this, correlationId) || this;
                _this.nodes = nodes;
                return _this;
            }
            return UploadTaskRecorderScreenshotsRequest;
        }(Commerce.ClientRequest));
        TaskRecorder.UploadTaskRecorderScreenshotsRequest = UploadTaskRecorderScreenshotsRequest;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var CommerceRuntime = (function () {
        function CommerceRuntime(configuration) {
            this._runtimeConfiguration = Object.freeze(configuration);
        }
        CommerceRuntime.prototype.getConfiguration = function () {
            return this._runtimeConfiguration;
        };
        CommerceRuntime.prototype.executeAsync = function (request) {
            var _this = this;
            if (request === null || typeof request === "undefined") {
                return Promise.reject([new Commerce.Proxy.Entities.Error("string_14001")]);
            }
            var config = this.getConfiguration();
            var loader = config.compositionLoader;
            return this.interceptAsync(request, config.request.interceptor, loader.getRequestInterceptors(request), function () {
                return _this.executeHandlerAsync(request);
            }, request.correlationId);
        };
        CommerceRuntime.prototype.executeHandlerAsync = function (request) {
            var config = this.getConfiguration();
            var loader = config.compositionLoader;
            return this.interceptAsync(request, config.requestHandler.interceptor, loader.getRequestHandlerInterceptors(request), function () {
                var handler = loader.getRequestHandler(request);
                if (handler === null || typeof handler === "undefined") {
                    return Promise.reject([new Commerce.Proxy.Entities.Error("string_14002")]);
                }
                return handler.executeAsync(request);
            }, request.correlationId);
        };
        CommerceRuntime.prototype.interceptAsync = function (request, configuration, interceptors, interceptee, intercepteeCorrelationId) {
            var _this = this;
            if (interceptors.length === 0) {
                return this.executeInterceptee(interceptee, intercepteeCorrelationId);
            }
            var topDownInterceptors = interceptors;
            var bottomUpInterceptors = topDownInterceptors.slice().reverse();
            var preQueue = new Commerce.AsyncQueue();
            bottomUpInterceptors.forEach(function (interceptor) {
                var interceptorName = Commerce.PrototypeHelper.getPrototypeChainTypeName(Object.getPrototypeOf(interceptor)) || "UnknownInterceptor";
                if (interceptor.onInterceptingAsync) {
                    preQueue.enqueue(function () {
                        var result;
                        var interceptionPoint = "onInterceptingAsync";
                        try {
                            Commerce.RetailLogger.runtimeInterceptorStarted(interceptorName, interceptionPoint);
                            result = interceptor.onInterceptingAsync(request);
                        }
                        catch (error) {
                            Commerce.RetailLogger.runtimeInterceptorFailed(interceptorName, interceptionPoint, Commerce.Framework.ErrorConverter.serializeError(error));
                        }
                        if (result === null || typeof result === "undefined") {
                            result = Promise.resolve({ canceled: false });
                        }
                        return Commerce.AsyncResult.fromPromise(result).map(function (value) {
                            value = value || { canceled: true };
                            if (value.canceled) {
                                Commerce.RetailLogger.runtimeInterceptorCanceled(interceptorName, interceptionPoint);
                            }
                            else {
                                Commerce.RetailLogger.runtimeInterceptorSucceeded(interceptorName, interceptionPoint);
                            }
                            return { canceled: value.canceled };
                        }).fail(function (errors) {
                            Commerce.RetailLogger.runtimeInterceptorFailed(interceptorName, interceptionPoint, Commerce.Framework.ErrorConverter.serializeError(errors));
                        });
                    }).cancel(function (args) {
                        return args.canceled;
                    });
                }
            });
            var preAndHandlerQueue = preQueue.enqueue(function () {
                return Commerce.AsyncResult.fromPromise(_this.executeInterceptee(interceptee, intercepteeCorrelationId))
                    .map(function (value) {
                    value = value || { canceled: true, data: null };
                    return { canceled: value.canceled, data: value.data };
                });
            });
            var executionQueue = new Commerce.AsyncQueue();
            executionQueue.enqueue(function () {
                return preAndHandlerQueue.run().map(function (value) {
                    var preAndHandlerResult = value.data;
                    if (preAndHandlerResult === null || typeof preAndHandlerResult === "undefined") {
                        preAndHandlerResult = { canceled: true, data: null };
                    }
                    return preAndHandlerResult;
                }).recoverOnFailure(function (errors) {
                    return Commerce.AsyncResult.createResolved(Commerce.Framework.ErrorConverter.toProxyErrors(errors));
                });
            }).enqueue(function (result) {
                var postQueue = new Commerce.AsyncQueue()
                    .enqueue(function () {
                    return Commerce.AsyncResult.createResolved(result);
                });
                topDownInterceptors.forEach(function (interceptor) {
                    var interceptorName = Commerce.PrototypeHelper.getPrototypeChainTypeName(Object.getPrototypeOf(interceptor)) || "UnknownInterceptor";
                    var interceptionPoint = "onInterceptedAsync";
                    if (interceptor.onInterceptedAsync) {
                        postQueue.enqueue(function (args) {
                            var result;
                            try {
                                Commerce.RetailLogger.runtimeInterceptorStarted(interceptorName, interceptionPoint);
                                result = interceptor.onInterceptedAsync(request, args);
                            }
                            catch (error) {
                                Commerce.RetailLogger.runtimeInterceptorFailed(interceptorName, interceptionPoint, Commerce.Framework.ErrorConverter.serializeError(error));
                            }
                            if (result === null || typeof result === "undefined") {
                                return Commerce.AsyncResult.createResolved(args);
                            }
                            var interceptedErrors;
                            return Commerce.VoidAsyncResult.fromPromise(result)
                                .recoverOnFailure(function (errors) {
                                interceptedErrors = errors;
                                return Commerce.VoidAsyncResult.createResolved();
                            }).map(function () {
                                if (interceptedErrors != null) {
                                    Commerce.RetailLogger.runtimeInterceptorFailed(interceptorName, interceptionPoint, Commerce.Framework.ErrorConverter.serializeError(interceptedErrors));
                                    return interceptedErrors;
                                }
                                Commerce.RetailLogger.runtimeInterceptorSucceeded(interceptorName, interceptionPoint);
                                return args;
                            });
                        });
                    }
                });
                return postQueue.run().map(function (value) {
                    return value.data;
                });
            });
            var interceptionResult;
            var interceptionAsyncResult = new Commerce.AsyncResult();
            executionQueue.run().done(function (result) {
                interceptionResult = result.data;
            }).fail(function (errors) {
                interceptionResult = Commerce.Framework.ErrorConverter.toProxyErrors(errors);
            }).always(function () {
                if (interceptionResult instanceof Array) {
                    interceptionAsyncResult.reject(interceptionResult);
                }
                else {
                    if (interceptionResult === null || typeof interceptionResult === "undefined") {
                        interceptionResult = { canceled: true, data: null };
                    }
                    interceptionAsyncResult.resolve(interceptionResult);
                }
            });
            return interceptionAsyncResult.getPromise();
        };
        CommerceRuntime.prototype.executeInterceptee = function (interceptee, intercepteeCorrelationId) {
            var result;
            try {
                result = interceptee();
                if (result === null || typeof result === "undefined") {
                    result = Promise.resolve({ canceled: true, data: null });
                }
                else {
                    result = result.catch(function (handlerError) {
                        return Promise.reject(Commerce.Framework.ErrorConverter.toProxyErrors(handlerError, intercepteeCorrelationId));
                    });
                }
            }
            catch (error) {
                result = Promise.reject(Commerce.Framework.ErrorConverter.toProxyErrors(error, intercepteeCorrelationId));
            }
            return result;
        };
        return CommerceRuntime;
    }());
    Commerce.CommerceRuntime = CommerceRuntime;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var PosRequestHandlerBase = (function (_super) {
        __extends(PosRequestHandlerBase, _super);
        function PosRequestHandlerBase(context) {
            var _this = _super.call(this) || this;
            _this.context = context;
            return _this;
        }
        return PosRequestHandlerBase;
    }(Commerce.RequestHandler));
    Commerce.PosRequestHandlerBase = PosRequestHandlerBase;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var CompositionLoader = (function () {
        function CompositionLoader() {
            this._prototypeKeys = Object.create(null);
            this._requestHandlerTypesAndOptions = Object.create(null);
            this._requestInterceptors = Object.create(null);
            this._requestHandlerInterceptors = Object.create(null);
        }
        CompositionLoader.prototype.getRequestHandler = function (request) {
            var handler = null;
            var tuple = this.getRequestHandlerTypes(request)[0];
            if (tuple && tuple.type) {
                handler = this.createRequestHandler(tuple);
            }
            return handler;
        };
        CompositionLoader.prototype.getRequestHandlers = function (request) {
            var _this = this;
            return this.getRequestHandlerTypes(request).map(function (tuple) {
                return _this.createRequestHandler(tuple);
            });
        };
        CompositionLoader.prototype.getRequestHandlersForRequestType = function (requestType) {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(requestType)) {
                return [];
            }
            var key = this.getPrototypeKey(requestType.prototype);
            var tuples = this._requestHandlerTypesAndOptions[key];
            tuples = tuples ? tuples : [];
            return tuples.map(function (tuple) {
                return _this.createRequestHandler(tuple);
            }).reverse();
        };
        CompositionLoader.prototype.getAllRequestHandlers = function () {
            var _this = this;
            var allInstances = [];
            Object.keys(this._requestHandlerTypesAndOptions).forEach(function (key) {
                var handlerInstances = _this._requestHandlerTypesAndOptions[key]
                    .map(function (tuple) {
                    return _this.createRequestHandler(tuple);
                });
                allInstances = allInstances.concat(handlerInstances);
            });
            return allInstances;
        };
        CompositionLoader.prototype.getRequestInterceptors = function (request) {
            return this.getAllForPrototypeChain(request, this._requestInterceptors);
        };
        CompositionLoader.prototype.getRequestHandlerInterceptors = function (request) {
            return this.getAllForPrototypeChain(request, this._requestHandlerInterceptors);
        };
        CompositionLoader.prototype.addRequestHandler = function (handlerType, optionsFactory) {
            var requestHandlerInstance = this.createRequestHandler({ type: handlerType, optionsFactory: optionsFactory });
            var requestType = requestHandlerInstance.supportedRequestType();
            var key = this.getPrototypeKey(requestType.prototype);
            var containsHandler = this._requestHandlerTypesAndOptions[key]
                && this._requestHandlerTypesAndOptions[key].some(function (tuple) { return tuple.type === handlerType; });
            if (!containsHandler) {
                var item = { type: handlerType, optionsFactory: optionsFactory };
                this.addToDictionary(key, this._requestHandlerTypesAndOptions, item);
            }
        };
        CompositionLoader.prototype.addRequestInterceptor = function (requestType, interceptor) {
            this.addToDictionary(this.getPrototypeKey(requestType.prototype), this._requestInterceptors, interceptor);
        };
        CompositionLoader.prototype.addRequestHandlerInterceptor = function (requestType, interceptor) {
            this.addToDictionary(this.getPrototypeKey(requestType.prototype), this._requestHandlerInterceptors, interceptor);
        };
        CompositionLoader.prototype.addToDictionary = function (keyName, dictionary, item) {
            if (!dictionary[keyName]) {
                dictionary[keyName] = [];
            }
            dictionary[keyName].push(item);
        };
        CompositionLoader.prototype.getAllForPrototypeChain = function (request, itemsDictionary) {
            var _this = this;
            var items = [];
            var prototypeChain = [];
            var currentPrototype = request ? Object.getPrototypeOf(request) : null;
            while (currentPrototype && (currentPrototype !== Object.prototype)) {
                prototypeChain.push(currentPrototype);
                currentPrototype = Object.getPrototypeOf(currentPrototype);
            }
            prototypeChain.forEach(function (p) {
                var key = _this.getPrototypeKey(p);
                if (itemsDictionary[key]) {
                    items = items.concat(itemsDictionary[key].slice().reverse());
                }
            });
            return items;
        };
        CompositionLoader.prototype.getRequestHandlerTypes = function (request) {
            return this.getAllForPrototypeChain(request, this._requestHandlerTypesAndOptions);
        };
        CompositionLoader.prototype.getPrototypeKey = function (prototype) {
            var name = Commerce.PrototypeHelper.getPrototypeChainTypeName(prototype);
            var keyValuePair = this._prototypeKeys[name]
                ? this._prototypeKeys[name].filter(function (kvp) { return kvp.value === prototype; })[0]
                : null;
            if (!keyValuePair) {
                keyValuePair = { key: null, value: prototype };
                this.addToDictionary(name, this._prototypeKeys, keyValuePair);
                keyValuePair.key = this._prototypeKeys[name].length.toString() + name;
            }
            return keyValuePair.key;
        };
        CompositionLoader.prototype.createRequestHandler = function (requestHandlerTypeAndOptions) {
            var requestHandlerType = requestHandlerTypeAndOptions.type;
            return new requestHandlerType(requestHandlerTypeAndOptions.optionsFactory ? requestHandlerTypeAndOptions.optionsFactory() : undefined);
        };
        return CompositionLoader;
    }());
    Commerce.CompositionLoader = CompositionLoader;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var InterceptorConfiguration = (function () {
        function InterceptorConfiguration() {
        }
        return InterceptorConfiguration;
    }());
    Commerce.InterceptorConfiguration = InterceptorConfiguration;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var RequestConfiguration = (function () {
        function RequestConfiguration() {
            this.interceptor = Object.freeze(new Commerce.InterceptorConfiguration());
        }
        return RequestConfiguration;
    }());
    Commerce.RequestConfiguration = RequestConfiguration;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var RequestHandlerConfiguration = (function () {
        function RequestHandlerConfiguration() {
            this.interceptor = Object.freeze(new Commerce.InterceptorConfiguration());
        }
        return RequestHandlerConfiguration;
    }());
    Commerce.RequestHandlerConfiguration = RequestHandlerConfiguration;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var RuntimeConfiguration = (function () {
        function RuntimeConfiguration(compositionLoader) {
            this.request = Object.freeze(new Commerce.RequestConfiguration());
            this.interceptor = Object.freeze(new Commerce.InterceptorConfiguration());
            this.requestHandler = Object.freeze(new Commerce.RequestHandlerConfiguration());
            this.compositionLoader = Object.freeze(compositionLoader);
        }
        return RuntimeConfiguration;
    }());
    Commerce.RuntimeConfiguration = RuntimeConfiguration;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var RegisterRequestHandlersRequestHandler = (function (_super) {
        __extends(RegisterRequestHandlersRequestHandler, _super);
        function RegisterRequestHandlersRequestHandler(options) {
            var _this = _super.call(this) || this;
            _this._compositionLoader = options.compositionLoader;
            _this._replaceableRequestTypes = options.replaceableRequestTypes;
            return _this;
        }
        RegisterRequestHandlersRequestHandler.prototype.supportedRequestType = function () {
            return Commerce.RegisterRequestHandlersRequest;
        };
        RegisterRequestHandlersRequestHandler.prototype.executeAsync = function (request) {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this._compositionLoader)) {
                return Promise.reject(new Error("Compositon Loader was not initialized."));
            }
            var response = new Commerce.RegisterRequestHandlersResponse();
            var _loop_1 = function (i) {
                var newRequestHandlerTypeAndOptions = request.requestHandlerTypesAndOptions[i];
                if (Commerce.ObjectExtensions.isNullOrUndefined(newRequestHandlerTypeAndOptions)) {
                    return { value: Promise.reject(new Error("The request to register request handlers is invalid.")) };
                }
                var newRequestHandlerType = newRequestHandlerTypeAndOptions.type;
                var newRequestHandler = new newRequestHandlerType(newRequestHandlerTypeAndOptions.options);
                var defaultRequestHandler = void 0;
                if (this_1._isExistingRequestType(newRequestHandler.supportedRequestType())) {
                    if (this_1._isReplaceableRequestType(newRequestHandler.supportedRequestType())) {
                        defaultRequestHandler = this_1._getDefaultRequestHandler(newRequestHandler.supportedRequestType());
                        if (Commerce.ObjectExtensions.isNullOrUndefined(defaultRequestHandler)) {
                            return { value: Promise.reject(new Error("Default request handler not found for replaceable request type.")) };
                        }
                    }
                    else {
                        return { value: Promise.reject(new Error("Unable to register replacement request handler with nonreplaceable request type.")) };
                    }
                }
                else {
                    this_1._replaceableRequestTypes.push(newRequestHandler.supportedRequestType());
                }
                this_1._compositionLoader.addRequestHandler(newRequestHandlerTypeAndOptions.type, function () { return newRequestHandlerTypeAndOptions.options; });
                if (!Commerce.ObjectExtensions.isNullOrUndefined(defaultRequestHandler)) {
                    response.defaultExecuteAsyncs.push(function (request) {
                        return _this._getDefaultRequestHandler(newRequestHandler.supportedRequestType()).executeAsync(request);
                    });
                }
                else {
                    response.defaultExecuteAsyncs.push(null);
                }
            };
            var this_1 = this;
            for (var i = 0; i < request.requestHandlerTypesAndOptions.length; i++) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return Promise.resolve({
                canceled: false,
                data: response
            });
        };
        RegisterRequestHandlersRequestHandler.prototype._getDefaultRequestHandler = function (requestType) {
            var defaultRequestHandler;
            if (this._isReplaceableRequestType(requestType)) {
                var matchingRequestHandlers = this._compositionLoader.getRequestHandlersForRequestType(requestType)
                    .filter(function (requestHandler) {
                    return requestType === requestHandler.supportedRequestType();
                });
                if (Commerce.ArrayExtensions.hasElements(matchingRequestHandlers)) {
                    defaultRequestHandler = matchingRequestHandlers[matchingRequestHandlers.length - 1];
                }
            }
            return defaultRequestHandler;
        };
        RegisterRequestHandlersRequestHandler.prototype._isExistingRequestType = function (requestType) {
            return this._compositionLoader.getRequestHandlersForRequestType(requestType).some(function (requestHandler) {
                return requestType === requestHandler.supportedRequestType();
            });
        };
        RegisterRequestHandlersRequestHandler.prototype._isReplaceableRequestType = function (requestType) {
            return this._replaceableRequestTypes.some(function (replaceableRequestType) {
                return requestType === replaceableRequestType;
            });
        };
        return RegisterRequestHandlersRequestHandler;
    }(Commerce.RequestHandler));
    Commerce.RegisterRequestHandlersRequestHandler = RegisterRequestHandlersRequestHandler;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var RegisterRequestInterceptorsRequest = (function (_super) {
        __extends(RegisterRequestInterceptorsRequest, _super);
        function RegisterRequestInterceptorsRequest(correlationId, requestsAndInterceptors) {
            var _this = _super.call(this, correlationId) || this;
            _this.requestsAndInterceptors = requestsAndInterceptors;
            return _this;
        }
        return RegisterRequestInterceptorsRequest;
    }(Commerce.Request));
    Commerce.RegisterRequestInterceptorsRequest = RegisterRequestInterceptorsRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var RegisterRequestInterceptorsRequestHandler = (function (_super) {
        __extends(RegisterRequestInterceptorsRequestHandler, _super);
        function RegisterRequestInterceptorsRequestHandler(compositionLoader) {
            var _this = _super.call(this) || this;
            _this._compositionLoader = compositionLoader;
            return _this;
        }
        RegisterRequestInterceptorsRequestHandler.prototype.supportedRequestType = function () {
            return Commerce.RegisterRequestInterceptorsRequest;
        };
        RegisterRequestInterceptorsRequestHandler.prototype.executeAsync = function (request) {
            var _this = this;
            var requestsAndInterceptors = request.requestsAndInterceptors || [];
            requestsAndInterceptors.forEach(function (item) {
                _this._compositionLoader.addRequestInterceptor(item.requestType, item.requestInterceptor);
            });
            return Promise.resolve({
                canceled: false,
                data: new Commerce.RegisterRequestInterceptorsResponse()
            });
        };
        return RegisterRequestInterceptorsRequestHandler;
    }(Commerce.RequestHandler));
    Commerce.RegisterRequestInterceptorsRequestHandler = RegisterRequestInterceptorsRequestHandler;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var RegisterRequestHandlersRequest = (function (_super) {
        __extends(RegisterRequestHandlersRequest, _super);
        function RegisterRequestHandlersRequest(correlationId) {
            var _this = _super.call(this, correlationId) || this;
            _this.requestHandlerTypesAndOptions = [];
            return _this;
        }
        return RegisterRequestHandlersRequest;
    }(Commerce.Request));
    Commerce.RegisterRequestHandlersRequest = RegisterRequestHandlersRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var RegisterRequestHandlersResponse = (function (_super) {
        __extends(RegisterRequestHandlersResponse, _super);
        function RegisterRequestHandlersResponse() {
            var _this = _super.call(this) || this;
            _this.defaultExecuteAsyncs = [];
            return _this;
        }
        return RegisterRequestHandlersResponse;
    }(Commerce.Response));
    Commerce.RegisterRequestHandlersResponse = RegisterRequestHandlersResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var RegisterRequestInterceptorsResponse = (function (_super) {
        __extends(RegisterRequestInterceptorsResponse, _super);
        function RegisterRequestInterceptorsResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RegisterRequestInterceptorsResponse;
    }(Commerce.Response));
    Commerce.RegisterRequestInterceptorsResponse = RegisterRequestInterceptorsResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var CachedStorage = (function () {
            function CachedStorage(cacheStorage, mainStorage) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(cacheStorage)) {
                    throw new Error("CachedStorage constructor: cacheStorage cannot be null or undefined.");
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(mainStorage)) {
                    throw new Error("CachedStorage constructor: mainStorage cannot be null or undefined.");
                }
                this._cacheStorage = cacheStorage;
                this._mainStorage = mainStorage;
            }
            CachedStorage.prototype.getItem = function (key) {
                var value = this._cacheStorage.getItem(key);
                if (Commerce.ObjectExtensions.isNullOrUndefined(value)) {
                    value = this._mainStorage.getItem(key);
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(value)) {
                        this._cacheStorage.setItem(key, value);
                    }
                }
                return value;
            };
            CachedStorage.prototype.setItem = function (key, value) {
                if (Commerce.StringExtensions.isNullOrWhitespace(key)) {
                    throw new Error("CachedStorage setItem: key cannot be null, undefined or whitespace.");
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(value)) {
                    throw new Error("CachedStorage setItem: value cannot be null or undefined.");
                }
                this._cacheStorage.setItem(key, value);
                try {
                    this._mainStorage.setItem(key, value);
                }
                catch (error) {
                    this._cacheStorage.removeItem(key);
                    throw error;
                }
            };
            CachedStorage.prototype.removeItem = function (key) {
                this._cacheStorage.removeItem(key);
                this._mainStorage.removeItem(key);
            };
            CachedStorage.prototype.clear = function () {
                this._cacheStorage.clear();
                this._mainStorage.clear();
            };
            CachedStorage.prototype.getKeys = function () {
                var keys = this._cacheStorage.getKeys();
                return Commerce.ArrayExtensions.hasElements(keys) ? keys : [];
            };
            return CachedStorage;
        }());
        Framework.CachedStorage = CachedStorage;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var DictionaryStorage = (function () {
            function DictionaryStorage() {
                this._dictionary = new Commerce.Dictionary();
            }
            DictionaryStorage.prototype.getItem = function (key) {
                var value = this._dictionary.getItem(key);
                return value === undefined ? null : value;
            };
            DictionaryStorage.prototype.setItem = function (key, value) {
                if (Commerce.StringExtensions.isNullOrWhitespace(key)) {
                    throw new Error("DictionaryStorage setItem: key cannot be null, undefined or whitespace.");
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(value)) {
                    throw new Error("DictionaryStorage setItem: value cannot be null or undefined.");
                }
                this._dictionary.setItem(key, value);
            };
            DictionaryStorage.prototype.removeItem = function (key) {
                this._dictionary.removeItem(key);
            };
            DictionaryStorage.prototype.clear = function () {
                this._dictionary.clear();
            };
            DictionaryStorage.prototype.getKeys = function () {
                return this._dictionary.getKeys();
            };
            return DictionaryStorage;
        }());
        Framework.DictionaryStorage = DictionaryStorage;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var PosStorage = (function () {
            function PosStorage(persistentStorage, transientStorage) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(persistentStorage)) {
                    throw new Error("PosStorage constructor: persistentStorage cannot be null or undefined.");
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(transientStorage)) {
                    throw new Error("PosStorage constructor: transientStorage cannot be null or undefined.");
                }
                this._persistentStorage = persistentStorage;
                this._transientStorage = transientStorage;
                this._preferTransientStorage = false;
            }
            PosStorage.prototype.getItem = function (key) {
                var storage = this._getStorage(key);
                try {
                    var value = storage.getItem(key);
                    return value === undefined ? null : value;
                }
                catch (error) {
                    var storageName = Commerce.PrototypeHelper.getPrototypeChainTypeName(Object.getPrototypeOf(storage));
                    var serializedError = Framework.ErrorConverter.serializeError(error);
                    Commerce.RetailLogger.storageGetItemFailure(storageName, key, serializedError);
                    throw Framework.ErrorConverter.toProxyErrors(error);
                }
            };
            PosStorage.prototype.setItem = function (key, value) {
                if (Commerce.StringExtensions.isNullOrWhitespace(key)) {
                    throw new Error("PosStorage setItem: key cannot be null, undefined or whitespace.");
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(value)) {
                    throw new Error("PosStorage setItem: value cannot be null or undefined.");
                }
                var storage = this._getStorage(key);
                try {
                    storage.setItem(key, value);
                }
                catch (error) {
                    var storageName = Commerce.PrototypeHelper.getPrototypeChainTypeName(Object.getPrototypeOf(storage));
                    var serializedError = Framework.ErrorConverter.serializeError(error);
                    Commerce.RetailLogger.storageSetItemFailure(storageName, key, value.length, serializedError);
                    throw Framework.ErrorConverter.toProxyErrors(error);
                }
            };
            PosStorage.prototype.removeItem = function (key) {
                var storage = this._getStorage(key);
                try {
                    storage.removeItem(key);
                }
                catch (error) {
                    var storageName = Commerce.PrototypeHelper.getPrototypeChainTypeName(Object.getPrototypeOf(storage));
                    var serializedError = Framework.ErrorConverter.serializeError(error);
                    Commerce.RetailLogger.storageRemoveItemFailure(storageName, key, serializedError);
                    throw Framework.ErrorConverter.toProxyErrors(error);
                }
            };
            PosStorage.prototype.clear = function () {
                var storages = [this._persistentStorage, this._transientStorage];
                storages.forEach(function (storage) {
                    try {
                        storage.clear();
                    }
                    catch (error) {
                        var storageName = Commerce.PrototypeHelper.getPrototypeChainTypeName(Object.getPrototypeOf(storage));
                        var serializedError = Framework.ErrorConverter.serializeError(error);
                        Commerce.RetailLogger.storageClearFailure(storageName, serializedError);
                        throw Framework.ErrorConverter.toProxyErrors(error);
                    }
                });
            };
            PosStorage.prototype.getKeys = function () {
                var keys = [];
                var storages = [this._persistentStorage, this._transientStorage];
                storages.forEach(function (storage) {
                    try {
                        var storageKeys = storage.getKeys();
                        keys.push.apply(keys, Commerce.ArrayExtensions.hasElements(storageKeys) ? storageKeys : []);
                    }
                    catch (error) {
                        var storageName = Commerce.PrototypeHelper.getPrototypeChainTypeName(Object.getPrototypeOf(storage));
                        var serializedError = Framework.ErrorConverter.serializeError(error);
                        Commerce.RetailLogger.storageGetKeysFailure(storageName, serializedError);
                        throw Framework.ErrorConverter.toProxyErrors(error);
                    }
                });
                return Commerce.ArrayExtensions.distinct(keys);
            };
            PosStorage.prototype.updateStoragePreference = function (preferTransientStorage) {
                if (this._preferTransientStorage === preferTransientStorage) {
                    return;
                }
                this._preferTransientStorage = preferTransientStorage;
                if (preferTransientStorage) {
                    this._transferValues(this._persistentStorage, this._transientStorage);
                }
                else {
                    this._transferValues(this._transientStorage, this._persistentStorage);
                }
            };
            PosStorage.prototype._transferValues = function (fromStorage, toStorage) {
                var _this = this;
                var existingContent = Commerce.StringExtensions.EMPTY;
                var keys = fromStorage.getKeys();
                keys = Commerce.ArrayExtensions.hasElements(keys) ? keys : [];
                keys.forEach(function (key, keyIndex) {
                    if (!_this._isBound(PosStorage.PERSISTENT_STORAGE_BOUND_KEYS, key) && !_this._isBound(PosStorage.TRANSIENT_STORAGE_BOUND_KEYS, key)) {
                        var currentStoredValue = fromStorage.getItem(key);
                        toStorage.setItem(key, currentStoredValue);
                        fromStorage.removeItem(key);
                        existingContent += _this._formatKeyContent(keyIndex, key, currentStoredValue.length);
                    }
                });
                var fromStorageName = Commerce.PrototypeHelper.getPrototypeChainTypeName(Object.getPrototypeOf(fromStorage));
                var toStorageName = Commerce.PrototypeHelper.getPrototypeChainTypeName(Object.getPrototypeOf(toStorage));
                Commerce.RetailLogger.storageValuesTransfer(fromStorageName, toStorageName, existingContent);
            };
            PosStorage.prototype._getStorage = function (key) {
                if (this._isBound(PosStorage.PERSISTENT_STORAGE_BOUND_KEYS, key)) {
                    return this._persistentStorage;
                }
                else if (this._isBound(PosStorage.TRANSIENT_STORAGE_BOUND_KEYS, key)) {
                    return this._transientStorage;
                }
                return this._preferTransientStorage ? this._transientStorage : this._persistentStorage;
            };
            PosStorage.prototype._formatKeyContent = function (keyIndex, keyName, valueLength) {
                var newLine = keyIndex === 0 ? Commerce.StringExtensions.EMPTY : Commerce.StringExtensions.NEW_LINE;
                return Commerce.StringExtensions.format("{0}Key='{1}';Length='{2}'", newLine, keyName, valueLength);
            };
            PosStorage.prototype._isBound = function (boundKeys, keyName) {
                return boundKeys.some(function (key) { return key === keyName; });
            };
            PosStorage.PERSISTENT_STORAGE_BOUND_KEYS = [
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.RETAIL_SERVER_URL],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.CART_KEY],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.FIRST_TIME_USE],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.BUBBLE_TOUR_DISABLED],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.VIDEO_TUTORIAL_DISABLED],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.CLOUD_SESSION_ID],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.DEVICE_ID_KEY],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.DEVICE_RECID],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.REGISTER_ID_KEY],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.REGISTER_RECID],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.TENANT_ID],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.ENVIRONMENT_CONFIGURATION_KEY],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.DEVICE_ACTIVATION_COMPLETED],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.AAD_LOGON_IN_PROCESS_KEY],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.RETAILSERVER_TENANT_ID],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.CURRENT_ACTIVATION_PROCESS],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.HARDWARE_STATION_FEATURE_ENABLE],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.CASH_DRAWER_OPEN_STATUS],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.PAYMENT_TRANSACTION_REFERENCE_DATA],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.FEATURE_STATES_KEY],
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.AAD_OPERATOR_LOGIN_INITIATED]
            ];
            PosStorage.TRANSIENT_STORAGE_BOUND_KEYS = [
                Commerce.ApplicationStorageIDs[Commerce.ApplicationStorageIDs.AAD_LOGOFF_INITIATED]
            ];
            return PosStorage;
        }());
        Framework.PosStorage = PosStorage;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var WebStorage = (function () {
            function WebStorage(storage) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(storage)) {
                    throw new Error("WebStorage constructor: storage cannot be null or undefined.");
                }
                this._storage = storage;
            }
            WebStorage.prototype.getItem = function (key) {
                var value = this._storage.getItem(key);
                return value === undefined ? null : value;
            };
            WebStorage.prototype.setItem = function (key, value) {
                if (Commerce.StringExtensions.isNullOrWhitespace(key)) {
                    throw new Error("WebStorage setItem: key cannot be null, undefined or whitespace.");
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(value)) {
                    throw new Error("WebStorage setItem: value cannot be null or undefined.");
                }
                this._storage.setItem(key, value);
            };
            WebStorage.prototype.removeItem = function (key) {
                this._storage.removeItem(key);
            };
            WebStorage.prototype.clear = function () {
                this._storage.clear();
            };
            WebStorage.prototype.getKeys = function () {
                return Object.keys(this._storage);
            };
            return WebStorage;
        }());
        Framework.WebStorage = WebStorage;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var LocalStorage = (function (_super) {
            __extends(LocalStorage, _super);
            function LocalStorage() {
                return _super.call(this, window.localStorage) || this;
            }
            Object.defineProperty(LocalStorage, "instance", {
                get: function () {
                    return LocalStorage._instance;
                },
                enumerable: true,
                configurable: true
            });
            LocalStorage.isSupported = function () {
                try {
                    var testMarker = "_0cacf36c-d73a-48bb-8d4d-0d611d83b1ef";
                    window.localStorage.setItem(testMarker, testMarker);
                    window.localStorage.removeItem(testMarker);
                    return true;
                }
                catch (error) {
                    return false;
                }
            };
            LocalStorage._instance = new LocalStorage();
            return LocalStorage;
        }(Framework.WebStorage));
        Framework.LocalStorage = LocalStorage;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var PosStringResourceManager = (function () {
        function PosStringResourceManager(getStringByIdImpl) {
            if (!Commerce.ObjectExtensions.isFunction(getStringByIdImpl)) {
                throw new Error("Invalid parameters provided to PosStringResourceManager constructor. 'getStringByIdImpl' must be a function.");
            }
            this._getStringByIdImpl = getStringByIdImpl;
            this._customStringsMap = new Commerce.Dictionary();
        }
        PosStringResourceManager.prototype.getString = function (resourceId) {
            if (Commerce.StringExtensions.isNullOrWhitespace(resourceId)) {
                return resourceId;
            }
            var resourceValueOverride = this._customStringsMap.getItem(resourceId);
            var localizedMessage;
            if (Commerce.ObjectExtensions.isNullOrUndefined(resourceValueOverride)) {
                localizedMessage = this._getStringByIdImpl(resourceId);
            }
            else {
                localizedMessage = resourceValueOverride.Text;
            }
            if (Commerce.StringExtensions.beginsWith(resourceId, PosStringResourceManager.STRING_RESOURCE_PREFIX, true)) {
                if (resourceId === localizedMessage) {
                    Commerce.RetailLogger.resourceStringMappingNotFound(resourceId);
                }
                else if ((this._includeStringIds) && (resourceId !== PosStringResourceManager.DEVELOPER_MODE_SHOW_STRING_IDS_RESOURCE_NAME)) {
                    var stringIDFormat = this.getString(PosStringResourceManager.DEVELOPER_MODE_SHOW_STRING_IDS_RESOURCE_NAME);
                    if (stringIDFormat !== PosStringResourceManager.DEVELOPER_MODE_SHOW_STRING_IDS_RESOURCE_NAME) {
                        localizedMessage = Commerce.StringExtensions.format(stringIDFormat, resourceId.substr(7), localizedMessage);
                    }
                }
            }
            return localizedMessage;
        };
        PosStringResourceManager.prototype.setCustomStringValues = function (customStrings) {
            this._customStringsMap.clear();
            this._customStringsMap.setItems(customStrings, function (customString) { return PosStringResourceManager.STRING_RESOURCE_PREFIX +
                customString.TextId.toString(); });
        };
        PosStringResourceManager.prototype.setIncludeStringIdsMode = function (showStringIds) {
            this._includeStringIds = showStringIds;
            Commerce.ApplicationStorage.setItem(Commerce.ApplicationStorageIDs.DEVELOPER_MODE_SHOW_STRING_IDS, Commerce.StringExtensions.EMPTY + showStringIds);
        };
        PosStringResourceManager.prototype.isIncludeStringIdsModeEnabled = function () {
            if (Commerce.ObjectExtensions.isNullOrUndefined(this._includeStringIds)) {
                this._includeStringIds = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.DEVELOPER_MODE_SHOW_STRING_IDS) === "true";
            }
            return this._includeStringIds;
        };
        PosStringResourceManager.DEVELOPER_MODE_SHOW_STRING_IDS_RESOURCE_NAME = "string_7414";
        PosStringResourceManager.STRING_RESOURCE_PREFIX = "string_";
        return PosStringResourceManager;
    }());
    Commerce.PosStringResourceManager = PosStringResourceManager;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Triggers;
    (function (Triggers) {
        "use strict";
    })(Triggers = Commerce.Triggers || (Commerce.Triggers = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var Dictionary = (function () {
        function Dictionary() {
            this._items = Object.create(null);
            this._length = 0;
        }
        Dictionary.prototype.removeItem = function (key) {
            var value;
            if (typeof (this._items[key]) !== "undefined") {
                value = this._items[key];
                this._items[key] = undefined;
                delete this._items[key];
                this._length--;
            }
            return value;
        };
        Dictionary.prototype.getItem = function (key) {
            return this._items[key];
        };
        Dictionary.prototype.setItem = function (key, value) {
            if (typeof (value) !== "undefined") {
                if (!this.hasItem(key)) {
                    this._length++;
                }
                this._items[key] = value;
            }
            else {
                throw "Could not set item as value is not defined";
            }
            return value;
        };
        Dictionary.prototype.setItems = function (array, keySelector) {
            var _this = this;
            if (!Commerce.ObjectExtensions.isFunction(keySelector)) {
                throw "keySelector is incorrect";
            }
            if (Commerce.ArrayExtensions.hasElements(array)) {
                array.forEach(function (element) {
                    _this.setItem(keySelector(element), element);
                });
            }
            return array;
        };
        Dictionary.prototype.hasItem = function (key) {
            return typeof (this._items[key]) !== "undefined";
        };
        Dictionary.prototype.length = function () {
            return this._length;
        };
        Dictionary.prototype.forEach = function (callback) {
            var _this = this;
            this.getKeys().forEach(function (key) {
                callback(key, _this._items[key]);
            });
        };
        Dictionary.prototype.clear = function () {
            this._items = Object.create(null);
            this._length = 0;
        };
        Dictionary.prototype.filter = function (callback) {
            var _this = this;
            var result = new Dictionary();
            this.getKeys().forEach(function (key) {
                if (callback(key, _this._items[key]) === true) {
                    result.setItem(key, _this._items[key]);
                }
            });
            return result;
        };
        Dictionary.prototype.getItems = function () {
            var _this = this;
            var result = [];
            this.getKeys().forEach(function (key) {
                result.push(_this._items[key]);
            });
            return result;
        };
        Dictionary.prototype.getKeys = function () {
            return Object.keys(this._items);
        };
        return Dictionary;
    }());
    Commerce.Dictionary = Dictionary;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var ErrorConverter = (function () {
            function ErrorConverter() {
            }
            ErrorConverter.toProxyErrors = function (errorObj, correlationId) {
                var _this = this;
                correlationId = Commerce.ObjectExtensions.isNullOrUndefined(correlationId) ? Commerce.StringExtensions.EMPTY : correlationId;
                var errors = [];
                if (errorObj instanceof Array) {
                    var errorArray = errorObj.filter(function (e) { return e !== null || typeof e !== "undefined"; });
                    errorArray.forEach(function (e) {
                        errors = errors.concat(_this.toProxyErrors(e, correlationId));
                    });
                }
                else if (errorObj instanceof Commerce.Client.Entities.ExtensionError) {
                    var posExtensionError = new Commerce.Client.Entities.PosExtensionError(errorObj);
                    errors.push(posExtensionError);
                }
                else if (errorObj instanceof Commerce.Proxy.Entities.Error) {
                    errors.push(errorObj);
                }
                else if (errorObj instanceof Error) {
                    errors.push(new Commerce.Proxy.Entities.Error(errorObj.message));
                }
                else {
                    Commerce.RetailLogger.coreUnableToConvertUnrecognizedErrorObjectIntoProxyError(JSON.stringify(errorObj), correlationId);
                    errors.push(new Commerce.Proxy.Entities.Error(Framework.ErrorCodes.APPLICATION_ERROR));
                }
                return errors;
            };
            ErrorConverter.serializeError = function (error) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(error)) {
                    return Commerce.StringExtensions.EMPTY;
                }
                else if (error instanceof Array) {
                    var serializedErrorMessages = error.map(function (err) {
                        return ErrorConverter.serializeError(err);
                    });
                    return JSON.stringify(serializedErrorMessages);
                }
                else if (error instanceof Error) {
                    var copy_1 = Object.create(null);
                    var currentObject = error;
                    while (!Commerce.ObjectExtensions.isNullOrUndefined(currentObject)) {
                        Object.getOwnPropertyNames(currentObject).forEach(function (key) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(error[key])) {
                                copy_1[key] = error[key];
                            }
                        });
                        currentObject = Object.getPrototypeOf(currentObject);
                    }
                    return JSON.stringify(copy_1);
                }
                else if (Commerce.ObjectExtensions.isString(error)) {
                    return error;
                }
                else {
                    return JSON.stringify(error);
                }
            };
            ErrorConverter.hasError = function (errors, errorType, errorTypeMap) {
                return Commerce.ArrayExtensions.hasElements(ErrorConverter.filterErrorsByType(errors, errorType, errorTypeMap));
            };
            ErrorConverter.filterErrorsByType = function (errors, errorType, errorTypeMap) {
                var matchingErrors = [];
                if (Commerce.ArrayExtensions.hasElements(errors)) {
                    matchingErrors = errors.filter(function (error) {
                        return ErrorConverter._errorIsOfType(error, errorType, errorTypeMap);
                    });
                }
                return matchingErrors;
            };
            ErrorConverter._errorIsOfType = function (error, errorType, errorTypeMap) {
                var errorResourceMetadata = !Commerce.ObjectExtensions.isNullOrUndefined(error.ErrorCode)
                    ? errorTypeMap(error.ErrorCode.toUpperCase())
                    : null;
                var errorTypeValue = null;
                if (Commerce.ObjectExtensions.isString(errorResourceMetadata)) {
                    errorTypeValue = errorResourceMetadata;
                }
                else if (!Commerce.ObjectExtensions.isNullOrUndefined(errorResourceMetadata)
                    && !Commerce.ObjectExtensions.isNullOrUndefined(errorResourceMetadata.messageResource)) {
                    errorTypeValue = errorResourceMetadata.messageResource;
                }
                return !Commerce.StringExtensions.compare(errorType, error.ErrorCode, true) || !Commerce.StringExtensions.compare(errorType, errorTypeValue, true);
            };
            return ErrorConverter;
        }());
        Framework.ErrorConverter = ErrorConverter;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Framework;
    (function (Framework) {
        "use strict";
        var ErrorResolver = (function () {
            function ErrorResolver() {
            }
            ErrorResolver.resolveError = function (error) {
                var serializedError = Commerce.StringExtensions.EMPTY;
                try {
                    serializedError = ErrorResolver._serializeError(error);
                }
                catch (exception) {
                    Commerce.RetailLogger.appErrorResolvingError("Resolving error failed: undefined behavior while trying to serialize the main error.", ErrorResolver._serializeError(exception));
                    return {
                        message: "Unhandled Application Error (resolving error failed).",
                        url: Commerce.StringExtensions.EMPTY,
                        stackTrace: Commerce.StringExtensions.EMPTY,
                        serializedBaseError: Commerce.StringExtensions.EMPTY,
                        serializedMainError: Commerce.StringExtensions.EMPTY
                    };
                }
                try {
                    var resolvedErrorData = ErrorResolver._resolveError(error);
                    resolvedErrorData.serializedMainError = serializedError;
                    return resolvedErrorData;
                }
                catch (exception) {
                    Commerce.RetailLogger.appErrorResolvingError("Resolving error failed: undefined behavior while trying to resolve the error.", ErrorResolver._serializeError(exception));
                    return {
                        message: "Unhandled Application Error (resolving error failed).",
                        url: Commerce.StringExtensions.EMPTY,
                        stackTrace: Commerce.StringExtensions.EMPTY,
                        serializedBaseError: Commerce.StringExtensions.EMPTY,
                        serializedMainError: serializedError
                    };
                }
            };
            ErrorResolver._serializeError = function (error) {
                try {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(error)) {
                        return Commerce.StringExtensions.EMPTY;
                    }
                    else if (error instanceof Array) {
                        var serializedErrorMessages = error.map(function (err) {
                            return ErrorResolver._serializeError(err);
                        });
                        return ErrorResolver._stringify(serializedErrorMessages);
                    }
                    else if (error instanceof Error) {
                        var copy_2 = Object.create(null);
                        var currentObject = error;
                        while (!Commerce.ObjectExtensions.isNullOrUndefined(currentObject)) {
                            Object.getOwnPropertyNames(currentObject).forEach(function (key) {
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(error[key])) {
                                    copy_2[key] = error[key];
                                }
                            });
                            currentObject = Object.getPrototypeOf(currentObject);
                        }
                        return ErrorResolver._stringify(copy_2);
                    }
                    else if (Commerce.ObjectExtensions.isString(error)) {
                        return error;
                    }
                    else {
                        return ErrorResolver._stringify(error);
                    }
                }
                catch (exception) {
                    Commerce.RetailLogger.appErrorResolvingError("Failed to serialize error.", ErrorResolver._serializeError(exception));
                    return Commerce.StringExtensions.EMPTY;
                }
            };
            ErrorResolver._stringify = function (obj) {
                var getCircularReplacer = function () {
                    var seenObjects = [];
                    return function (key, value) {
                        if (typeof value === "object" && !Commerce.ObjectExtensions.isNullOrUndefined(value)) {
                            if (Commerce.ArrayExtensions.hasElement(seenObjects, value)) {
                                return;
                            }
                            seenObjects.push(value);
                        }
                        return value;
                    };
                };
                return JSON.stringify(obj, getCircularReplacer());
            };
            ErrorResolver._getBaseError = function (error, depth) {
                if (depth === void 0) { depth = 0; }
                var _a;
                if (depth > ErrorResolver.ERROR_RESOLUTION_MAX_DEPTH) {
                    Commerce.RetailLogger.appErrorResolvingError(Commerce.StringExtensions.format("Reached recursion limit of {0} while getting the base error.", ErrorResolver.ERROR_RESOLUTION_MAX_DEPTH), ErrorResolver._serializeError(error));
                    return error;
                }
                else if (!Commerce.ObjectExtensions.isNullOrUndefined((_a = error.detail) === null || _a === void 0 ? void 0 : _a.error) &&
                    Commerce.ObjectExtensions.isObject(error.detail.error)) {
                    return ErrorResolver._getBaseError(error.detail.error, depth + 1);
                }
                else if (!Commerce.ObjectExtensions.isNullOrUndefined(error.error) &&
                    Commerce.ObjectExtensions.isObject(error.error)) {
                    return ErrorResolver._getBaseError(error.error, depth + 1);
                }
                return error;
            };
            ErrorResolver._getErrorMessage = function (baseError, mainError) {
                var _a, _b;
                if (Commerce.ObjectExtensions.isString((_a = baseError.detail) === null || _a === void 0 ? void 0 : _a.errorMessage) &&
                    !Commerce.StringExtensions.isNullOrWhitespace(baseError.detail.errorMessage)) {
                    return baseError.detail.errorMessage;
                }
                if (Commerce.ObjectExtensions.isString(baseError.message) &&
                    !Commerce.StringExtensions.isNullOrWhitespace(baseError.message)) {
                    return baseError.message;
                }
                if (Commerce.ObjectExtensions.isString((_b = baseError.detail) === null || _b === void 0 ? void 0 : _b.error) &&
                    !Commerce.StringExtensions.isNullOrWhitespace(baseError.detail.error)) {
                    return baseError.detail.error;
                }
                var errorMessage;
                try {
                    errorMessage = ErrorResolver._serializeError(baseError.detail);
                    if (!Commerce.StringExtensions.isNullOrWhitespace(errorMessage)) {
                        return errorMessage;
                    }
                }
                catch (exception) {
                    Commerce.RetailLogger.appErrorResolvingError("Failed to get error message (baseError.detail).", ErrorResolver._serializeError(exception));
                }
                try {
                    errorMessage = ErrorResolver._serializeError(baseError.error);
                    if (!Commerce.StringExtensions.isNullOrWhitespace(errorMessage)) {
                        return errorMessage;
                    }
                }
                catch (exception) {
                    Commerce.RetailLogger.appErrorResolvingError("Failed to get error message (baseError.error).", ErrorResolver._serializeError(exception));
                }
                try {
                    errorMessage = ErrorResolver._serializeError(mainError.detail);
                    if (!Commerce.StringExtensions.isNullOrWhitespace(errorMessage)) {
                        return errorMessage;
                    }
                }
                catch (exception) {
                    Commerce.RetailLogger.appErrorResolvingError("Failed to get error message (mainError.detail).", ErrorResolver._serializeError(exception));
                }
                return Commerce.StringExtensions.EMPTY;
            };
            ErrorResolver._getErrorUrl = function (baseError, mainError) {
                var _a, _b, _c, _d;
                if (Commerce.ObjectExtensions.isString((_a = baseError.detail) === null || _a === void 0 ? void 0 : _a.errorUrl) &&
                    !Commerce.StringExtensions.isNullOrWhitespace(baseError.detail.errorUrl)) {
                    return baseError.detail.errorUrl;
                }
                if (Commerce.ObjectExtensions.isString((_b = baseError.page) === null || _b === void 0 ? void 0 : _b.uri) &&
                    !Commerce.StringExtensions.isNullOrWhitespace(baseError.page.uri)) {
                    return baseError.page.uri;
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(mainError.detail)) {
                    if (Commerce.ObjectExtensions.isString((_d = (_c = mainError.detail.error) === null || _c === void 0 ? void 0 : _c.page) === null || _d === void 0 ? void 0 : _d.uri) &&
                        !Commerce.StringExtensions.isNullOrWhitespace(mainError.detail.error.page.uri)) {
                        return mainError.detail.error.page.uri;
                    }
                    if (Commerce.ObjectExtensions.isString(mainError.detail.errorUrl) &&
                        !Commerce.StringExtensions.isNullOrWhitespace(mainError.detail.errorUrl)) {
                        return mainError.detail.errorUrl;
                    }
                }
                return Commerce.StringExtensions.EMPTY;
            };
            ErrorResolver._getErrorStackTrace = function (error) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(error.detail)) {
                    if (Commerce.ObjectExtensions.isString(error.detail.stack) &&
                        !Commerce.StringExtensions.isNullOrWhitespace(error.detail.stack)) {
                        return error.detail.stack;
                    }
                    if (Commerce.ObjectExtensions.isString(error.detail.stackTrace) &&
                        !Commerce.StringExtensions.isNullOrWhitespace(error.detail.stackTrace)) {
                        return error.detail.stackTrace;
                    }
                }
                if (Commerce.ObjectExtensions.isString(error.stack) &&
                    !Commerce.StringExtensions.isNullOrWhitespace(error.stack)) {
                    return error.stack;
                }
                if (Commerce.ObjectExtensions.isString(error.stackTrace) &&
                    !Commerce.StringExtensions.isNullOrWhitespace(error.stackTrace)) {
                    return error.stackTrace;
                }
                return Commerce.StringExtensions.EMPTY;
            };
            ErrorResolver._getErrorsStackTrace = function (baseError, mainError) {
                var baseErrorStackTrace = ErrorResolver._getErrorStackTrace(baseError);
                if (!Commerce.StringExtensions.isEmpty(baseErrorStackTrace)) {
                    return baseErrorStackTrace;
                }
                return ErrorResolver._getErrorStackTrace(mainError);
            };
            ErrorResolver._resolveArrayOfErrors = function (errors, mainError, depth) {
                if (!Commerce.ArrayExtensions.hasElements(errors)) {
                    return {
                        message: "[]",
                        url: "[]",
                        stackTrace: "[]",
                        serializedBaseError: "[]",
                        serializedMainError: Commerce.StringExtensions.EMPTY
                    };
                }
                var messages = [];
                var urls = [];
                var stackTraces = [];
                var serializedErrors = [];
                errors.forEach(function (error) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(error)) {
                        error = Commerce.StringExtensions.EMPTY;
                    }
                    var errorInfo = ErrorResolver._resolveError(error, mainError, depth + 1);
                    messages.push(errorInfo.message);
                    urls.push(errorInfo.url);
                    stackTraces.push(errorInfo.stackTrace);
                    serializedErrors.push(errorInfo.serializedBaseError);
                });
                var errorsInfo = {
                    message: JSON.stringify(messages),
                    url: JSON.stringify(urls),
                    stackTrace: JSON.stringify(stackTraces),
                    serializedBaseError: JSON.stringify(serializedErrors),
                    serializedMainError: Commerce.StringExtensions.EMPTY
                };
                return errorsInfo;
            };
            ErrorResolver._resolveError = function (error, mainError, depth) {
                if (mainError === void 0) { mainError = error; }
                if (depth === void 0) { depth = 0; }
                if (depth > ErrorResolver.ERROR_RESOLUTION_MAX_DEPTH) {
                    var serializedError = ErrorResolver._serializeError(error);
                    Commerce.RetailLogger.appErrorResolvingError(Commerce.StringExtensions.format("Reached recursion limit of {0} while resolving error information.", ErrorResolver.ERROR_RESOLUTION_MAX_DEPTH), serializedError);
                    return {
                        message: "Unhandled Application Error (reached recursion limit).",
                        url: Commerce.StringExtensions.EMPTY,
                        stackTrace: Commerce.StringExtensions.EMPTY,
                        serializedBaseError: serializedError,
                        serializedMainError: Commerce.StringExtensions.EMPTY
                    };
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(mainError)) {
                    throw "Resolving error failed: no error info provided.";
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(error)) {
                    throw "Resolving error failed: the base error object was undefined.";
                }
                if (Commerce.ObjectExtensions.isPrimitive(error)) {
                    return {
                        message: String(error),
                        url: Commerce.StringExtensions.EMPTY,
                        stackTrace: Commerce.StringExtensions.EMPTY,
                        serializedBaseError: ErrorResolver._serializeError(error),
                        serializedMainError: Commerce.StringExtensions.EMPTY
                    };
                }
                var baseError = ErrorResolver._getBaseError(error, depth);
                if (baseError instanceof Array) {
                    return ErrorResolver._resolveArrayOfErrors(baseError, mainError, depth);
                }
                var errorInfo = {
                    message: ErrorResolver._getErrorMessage(baseError, mainError),
                    url: ErrorResolver._getErrorUrl(baseError, mainError),
                    stackTrace: ErrorResolver._getErrorsStackTrace(baseError, mainError),
                    serializedBaseError: ErrorResolver._serializeError(baseError),
                    serializedMainError: Commerce.StringExtensions.EMPTY
                };
                return errorInfo;
            };
            ErrorResolver.ERROR_RESOLUTION_MAX_DEPTH = 100;
            return ErrorResolver;
        }());
        Framework.ErrorResolver = ErrorResolver;
    })(Framework = Commerce.Framework || (Commerce.Framework = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Utilities;
    (function (Utilities) {
        "use strict";
        var GuidHelper = (function () {
            function GuidHelper() {
            }
            GuidHelper.newGuid = function () {
                function guidPart() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                }
                return guidPart() + guidPart() + "-" + guidPart() + "-" + guidPart() + "-" + guidPart() + "-" + guidPart() + guidPart() + guidPart();
            };
            GuidHelper.isValid = function (guid) {
                var regexp = new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
                return regexp.test(guid);
            };
            return GuidHelper;
        }());
        Utilities.GuidHelper = GuidHelper;
    })(Utilities = Commerce.Utilities || (Commerce.Utilities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var PrototypeHelper = (function () {
        function PrototypeHelper() {
        }
        PrototypeHelper.getPrototypeChainTypeName = function (prototype) {
            if (!prototype || prototype === Object.prototype) {
                return null;
            }
            var recursiveName = PrototypeHelper.getPrototypeChainTypeName(Object.getPrototypeOf(prototype));
            recursiveName = recursiveName ? recursiveName + "." : Commerce.StringExtensions.EMPTY;
            return recursiveName + PrototypeHelper._getFunctionName(prototype.constructor);
        };
        PrototypeHelper._getFunctionName = function (functionInstance) {
            var functionInstanceAsAny = functionInstance;
            if (functionInstanceAsAny.name !== null && typeof functionInstanceAsAny.name !== "undefined") {
                return functionInstanceAsAny.name;
            }
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec(functionInstance.toString());
            return (results && results.length > 1) ? results[1] : "";
        };
        return PrototypeHelper;
    }());
    Commerce.PrototypeHelper = PrototypeHelper;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var ThrowIf;
    (function (ThrowIf) {
        function argumentIsNotObject(val, parameterName) {
            if (Commerce.ObjectExtensions.isNull(val) || !Commerce.ObjectExtensions.isObject(val)) {
                throw new TypeError("The argument '" + parameterName + "' should be an object.");
            }
        }
        ThrowIf.argumentIsNotObject = argumentIsNotObject;
        function argumentIsNotFunction(val, parameterName) {
            if (!Commerce.ObjectExtensions.isFunction(val)) {
                throw new TypeError("The argument '" + parameterName + "' should be a function.");
            }
        }
        ThrowIf.argumentIsNotFunction = argumentIsNotFunction;
        function argumentIsNotString(val, parameterName) {
            if (!Commerce.ObjectExtensions.isString(val)) {
                throw new TypeError("The argument '" + parameterName + "' should be a string.");
            }
        }
        ThrowIf.argumentIsNotString = argumentIsNotString;
        function argumentIsNotStringOrNull(val, parameterName) {
            if (!Commerce.ObjectExtensions.isNull(val) && !Commerce.ObjectExtensions.isString(val)) {
                throw new TypeError("The argument '" + parameterName + "' should be a string or null.");
            }
        }
        ThrowIf.argumentIsNotStringOrNull = argumentIsNotStringOrNull;
    })(ThrowIf = Commerce.ThrowIf || (Commerce.ThrowIf = {}));
})(Commerce || (Commerce = {}));

// SIG // Begin signature block
// SIG // MIIj/gYJKoZIhvcNAQcCoIIj7zCCI+sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // +JIommOyJMxyOMhzTcmw68czHzN0scYBqukNo7hlXyGg
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
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFdUw
// SIG // ghXRAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAGHchdyFVlAxwkAAAAAAYcwDQYJYIZI
// SIG // AWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEE
// SIG // AYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCAAzzJBaSBG8PXygO3M
// SIG // CJz+NV62zk82b30+FjQZ1wA5BzCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQCqaUDX
// SIG // z7ByQnv3Suo38tOnXyTTI0Cw8AgWSQDLPCTRAXRw3gi1
// SIG // c58LbI91aYGxvnCUPymaPEnSZmuTnwJ6T2YrydTgByDE
// SIG // IBooi/CQIJr0mydhTJL4qSPhdvgtmlzLmk3i3EYTAw5X
// SIG // CxxNblUJo1Ksfq/Fq9S5I4i0CAjm/KIfd1jDkjHbwD2V
// SIG // MGvHJI8vJJTwMUND90GF6KXFcGgWStWpozKXSExjiDl3
// SIG // zEzfunDF6JBhfgubnANKcv+GJEOWqV3a7u19DQHJRDza
// SIG // FgAc++ingnNc15qGEhlpq3NFpZ/0oFf6vJbcRxeq51rZ
// SIG // vyCeNj1mPOcRUbBgCVYwJAtc2C+HoYIS5TCCEuEGCisG
// SIG // AQQBgjcDAwExghLRMIISzQYJKoZIhvcNAQcCoIISvjCC
// SIG // EroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3
// SIG // DQEJEAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEIP20kDZ8IutSQM55MseW
// SIG // 46qfJTUEIMtBO9S8AuXwRAfDAgZfOqnO9VEYEzIwMjAw
// SIG // ODIzMDQwMjQ2LjkyNFowBIACAfSggdCkgc0wgcoxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29m
// SIG // dCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRo
// SIG // YWxlcyBUU1MgRVNOOkQ2QkQtRTNFNy0xNjg1MSUwIwYD
// SIG // VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNl
// SIG // oIIOPDCCBPEwggPZoAMCAQICEzMAAAEeDrzlSxaiAxsA
// SIG // AAAAAR4wDQYJKoZIhvcNAQELBQAwfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTAwHhcNMTkxMTEzMjE0MDQwWhcN
// SIG // MjEwMjExMjE0MDQwWjCByjELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3Bl
// SIG // cmF0aW9uczEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // RDZCRC1FM0U3LTE2ODUxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3
// SIG // DQEBAQUAA4IBDwAwggEKAoIBAQDOE7cYEKL89fBcrqzt
// SIG // /Bt1qpVfnrSxYwlYgs3r3C/tGlZeFEoncyqOa+RRYGQf
// SIG // W+p3AJHwCcWH+sZkONhw5raY7vnCtjtuKt8bvqNQ0aew
// SIG // xXd9utR5wWVUX5xKEezwCIfXnpwavixR+Gd6QKy91Ncv
// SIG // E8FXQVPdVhDr3FMizOqkqchyHYrj4M9LgtxbkiDycaxs
// SIG // av3X68TttcwpBcMCn2obFSZjCaUVzHbGr6EfoL03Teab
// SIG // x0WZrEe2x7QT0ZkYQBCYmJS1UXQSAVVjqb1wnMXr7+1H
// SIG // 8fHLrd1/dtM2DsR/DXwnwEoz9Z1Upreflph3d1V2IbV9
// SIG // zKOefXgp/IB2aRS7AgMBAAGjggEbMIIBFzAdBgNVHQ4E
// SIG // FgQUjBMo55F4RuBL+36bP9mvJ9pmilswHwYDVR0jBBgw
// SIG // FoAU1WM6XIoxkPNDe3xGG8UzaFqFbVUwVgYDVR0fBE8w
// SIG // TTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
// SIG // L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIw
// SIG // MTAtMDctMDEuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggr
// SIG // BgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0w
// SIG // MS5jcnQwDAYDVR0TAQH/BAIwADATBgNVHSUEDDAKBggr
// SIG // BgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEALmTcjnWW
// SIG // I5CCEyJUDSXodjSHPN2w3oiARSDvg5jI27H2hj7r9C+/
// SIG // +eMU5kfkzI9mTJ/3m1uaUyaGvWO+aGXfF6hTvyhGAQo2
// SIG // oclwuQccPqVqk+9ARrIPptCHRmGhQAyWEJujVgtWrWN/
// SIG // KtKLHH6GWIBkeExySJF2aTfu7j69cgPz5DDSvl3UmghU
// SIG // Bl1uTXUh/0MeQskhdwfJ4BKUaLO2qAAXmlQH42tRVasa
// SIG // 0qNYMdPm7xF1YQVlr1EBnvm9lUHTab0NqVF+Eu6kbn3L
// SIG // Us0ogHgWmBAmkQjWOaytaLywMIhHdwYOyp7SwaJUHx69
// SIG // cP1XNrOdoknGhUXodOHSXX4hbTCCBnEwggRZoAMCAQIC
// SIG // CmEJgSoAAAAAAAIwDQYJKoZIhvcNAQELBQAwgYgxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xMjAwBgNVBAMTKU1pY3Jvc29m
// SIG // dCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eSAyMDEw
// SIG // MB4XDTEwMDcwMTIxMzY1NVoXDTI1MDcwMTIxNDY1NVow
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwggEiMA0G
// SIG // CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCpHQ28dxGK
// SIG // OiDs/BOX9fp/aZRrdFQQ1aUKAIKF++18aEssX8XD5WHC
// SIG // drc+Zitb8BVTJwQxH0EbGpUdzgkTjnxhMFmxMEQP8WCI
// SIG // hFRDDNdNuDgIs0Ldk6zWczBXJoKjRQ3Q6vVHgc2/JGAy
// SIG // WGBG8lhHhjKEHnRhZ5FfgVSxz5NMksHEpl3RYRNuKMYa
// SIG // +YaAu99h/EbBJx0kZxJyGiGKr0tkiVBisV39dx898Fd1
// SIG // rL2KQk1AUdEPnAY+Z3/1ZsADlkR+79BL/W7lmsqxqPJ6
// SIG // Kgox8NpOBpG2iAg16HgcsOmZzTznL0S6p/TcZL2kAcEg
// SIG // CZN4zfy8wMlEXV4WnAEFTyJNAgMBAAGjggHmMIIB4jAQ
// SIG // BgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4EFgQU1WM6XIox
// SIG // kPNDe3xGG8UzaFqFbVUwGQYJKwYBBAGCNxQCBAweCgBT
// SIG // AHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB/wQF
// SIG // MAMBAf8wHwYDVR0jBBgwFoAU1fZWy4/oolxiaNE9lJBb
// SIG // 186aGMQwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2Ny
// SIG // bC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMv
// SIG // TWljUm9vQ2VyQXV0XzIwMTAtMDYtMjMuY3JsMFoGCCsG
// SIG // AQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3
// SIG // dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNSb29D
// SIG // ZXJBdXRfMjAxMC0wNi0yMy5jcnQwgaAGA1UdIAEB/wSB
// SIG // lTCBkjCBjwYJKwYBBAGCNy4DMIGBMD0GCCsGAQUFBwIB
// SIG // FjFodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vUEtJL2Rv
// SIG // Y3MvQ1BTL2RlZmF1bHQuaHRtMEAGCCsGAQUFBwICMDQe
// SIG // MiAdAEwAZQBnAGEAbABfAFAAbwBsAGkAYwB5AF8AUwB0
// SIG // AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3DQEBCwUA
// SIG // A4ICAQAH5ohRDeLG4Jg/gXEDPZ2joSFvs+umzPUxvs8F
// SIG // 4qn++ldtGTCzwsVmyWrf9efweL3HqJ4l4/m87WtUVwgr
// SIG // UYJEEvu5U4zM9GASinbMQEBBm9xcF/9c+V4XNZgkVkt0
// SIG // 70IQyK+/f8Z/8jd9Wj8c8pl5SpFSAK84Dxf1L3mBZdmp
// SIG // tWvkx872ynoAb0swRCQiPM/tA6WWj1kpvLb9BOFwnzJK
// SIG // J/1Vry/+tuWOM7tiX5rbV0Dp8c6ZZpCM/2pif93FSguR
// SIG // JuI57BlKcWOdeyFtw5yjojz6f32WapB4pm3S4Zz5Hfw4
// SIG // 2JT0xqUKloakvZ4argRCg7i1gJsiOCC1JeVk7Pf0v35j
// SIG // WSUPei45V3aicaoGig+JFrphpxHLmtgOR5qAxdDNp9Dv
// SIG // fYPw4TtxCd9ddJgiCGHasFAeb73x4QDf5zEHpJM692VH
// SIG // eOj4qEir995yfmFrb3epgcunCaw5u+zGy9iCtHLNHfS4
// SIG // hQEegPsbiSpUObJb2sgNVZl6h3M7COaYLeqN4DMuEin1
// SIG // wC9UJyH3yKxO2ii4sanblrKnQqLJzxlBTeCG+SqaoxFm
// SIG // MNO7dDJL32N79ZmKLxvHIa9Zta7cRDyXUHHXodLFVeNp
// SIG // 3lfB0d4wwP3M5k37Db9dT+mdHhk4L7zPWAUu7w2gUDXa
// SIG // 7wknHNWzfjUeCLraNtvTX4/edIhJEqGCAs4wggI3AgEB
// SIG // MIH4oYHQpIHNMIHKMQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSUw
// SIG // IwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRp
// SIG // b25zMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpENkJE
// SIG // LUUzRTctMTY4NTElMCMGA1UEAxMcTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUA
// SIG // OckG4+3pqzET/o43WLrKWYzKsNyggYMwgYCkfjB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0B
// SIG // AQUFAAIFAOLsaF4wIhgPMjAyMDA4MjMxMjAwMzBaGA8y
// SIG // MDIwMDgyNDEyMDAzMFowdzA9BgorBgEEAYRZCgQBMS8w
// SIG // LTAKAgUA4uxoXgIBADAKAgEAAgIQQgIB/zAHAgEAAgIR
// SIG // kDAKAgUA4u253gIBADA2BgorBgEEAYRZCgQCMSgwJjAM
// SIG // BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAID
// SIG // AYagMA0GCSqGSIb3DQEBBQUAA4GBADtA8KWLfrDaLbzG
// SIG // 0G9j3/ISQQCt35YlnyYUTEI6GtKySEkYlySh4R1EtmF7
// SIG // TjMflM9Q/Y2ZAN7bE4ZCn9o5JTy4kW6kpWeHFwHeB00g
// SIG // +fJ4ZjlcZ2YVkfMILm+CVSovcKMejcke+oywKDUPCnjc
// SIG // r0ukh/3vOKL6Fdpc3A+xf3SfMYIDDTCCAwkCAQEwgZMw
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEe
// SIG // DrzlSxaiAxsAAAAAAR4wDQYJYIZIAWUDBAIBBQCgggFK
// SIG // MBoGCSqGSIb3DQEJAzENBgsqhkiG9w0BCRABBDAvBgkq
// SIG // hkiG9w0BCQQxIgQgoF3K1kpL1RAMQ/4ftvOZw/DAGNlk
// SIG // KQZ0bVk+36oq3uQwgfoGCyqGSIb3DQEJEAIvMYHqMIHn
// SIG // MIHkMIG9BCBzO+RYw99xOlHlvaefPKE3cS3NJdWU8foi
// SIG // BBwPjdZfRzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABHg685UsWogMbAAAAAAEeMCIE
// SIG // IJ/0nDJktzfDgfpd5om2eBS0Sy0QY6oYcfUM2WCNFgnr
// SIG // MA0GCSqGSIb3DQEBCwUABIIBAGidK3cEbiFlrqKujWVl
// SIG // 01En6+BuyV81Mfbc9roLPE7tP59uouqfOySygy/QmVWZ
// SIG // 1d0TH7aHnJT4k1krvgPd5j3wSR5TFxfbk88QcmAiXX01
// SIG // QCQhMBEDybXqYYs8Pbo8p3XiigWQ4BhSluq9P4XGYnS8
// SIG // 8G9WGyjwUqSFAK9/VZnx/MYoSLXPi2ydhI6Tv4zDD2ry
// SIG // SwU/B8I4GkKhrisr2ZlabcLnTRs8Z9UtYRWYFkgYFIFp
// SIG // fN57srTUZzpGKfgb7gMJQpBycKPeNZ4ko3fOUeSS5Zq1
// SIG // QmmQMS/556/ZZljyWTvAcsPwJZtKGvOP4ue0Fy5uZemG
// SIG // NcU6B2fZvn/AGaU=
// SIG // End signature block
