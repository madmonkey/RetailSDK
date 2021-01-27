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
System.register("Interfaces", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("Extension", [], function (exports_2, context_2) {
    "use strict";
    var Extension;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Extension = (function () {
                function Extension(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, extensionLoadError) {
                    this._extensionPointName = extensionPointName;
                    this._extensionPointType = extensionPointType;
                    this._extensionName = extensionName;
                    this._extensionModulePath = extensionModulePath;
                    this._extensionDescription = extensionDescription;
                    this._extensionLoadError = extensionLoadError;
                }
                Object.defineProperty(Extension.prototype, "extensionPointType", {
                    get: function () {
                        return this._extensionPointType;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Extension.prototype, "extensionPointName", {
                    get: function () {
                        return this._extensionPointName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Extension.prototype, "extensionName", {
                    get: function () {
                        return this._extensionName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Extension.prototype, "extensionModulePath", {
                    get: function () {
                        return this._extensionModulePath;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Extension.prototype, "extensionDescription", {
                    get: function () {
                        return this._extensionDescription;
                    },
                    enumerable: true,
                    configurable: true
                });
                Extension.prototype.getExtensionLoadInfo = function () {
                    var extensionInfo = {
                        extensionPointName: this.extensionPointName,
                        extensionPointType: this.extensionPointType,
                        extensionName: this._extensionName,
                        extensionModulePath: this._extensionModulePath,
                        extensionDescription: this._extensionDescription
                    };
                    var extensionLoadInfo = {
                        loadError: this._extensionLoadError,
                        extensionInfo: extensionInfo
                    };
                    return extensionLoadInfo;
                };
                return Extension;
            }());
            exports_2("default", Extension);
        }
    };
});
System.register("DualDisplayExtensionsManager", ["PosApi/Extend/DualDisplay", "Extension", "PosApi/TypeExtensions"], function (exports_3, context_3) {
    "use strict";
    var DualDisplay_1, Extension_1, Messaging, TypeExtensions_1, DualDisplayExtensionsManager;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (DualDisplay_1_1) {
                DualDisplay_1 = DualDisplay_1_1;
            },
            function (Extension_1_1) {
                Extension_1 = Extension_1_1;
            },
            function (TypeExtensions_1_1) {
                TypeExtensions_1 = TypeExtensions_1_1;
            }
        ],
        execute: function () {
            Messaging = Commerce.Messaging;
            DualDisplayExtensionsManager = (function () {
                function DualDisplayExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    this._customControls = [];
                    if (Commerce.Config.isDualDisplay) {
                        DualDisplay.ViewModels.DualDisplayViewModel.dualDisplayExtensionManager = this;
                    }
                    this._loadModuleImpl = loadModuleImpl;
                    this._createAndInsertHtmlImpl = createAndInsertHtmlImpl;
                    this._renderHtmlImpl = renderHtmlImpl;
                }
                DualDisplayExtensionsManager.prototype.loadAsync = function (extensionPackage, dualDisplayConfig) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(dualDisplayConfig) ||
                        Commerce.ObjectExtensions.isNullOrUndefined(dualDisplayConfig.customControl)) {
                        Commerce.RetailLogger.extensibilityFrameworkDualDisplayExtensionsManifestItemOrControlNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.resolve();
                    }
                    return this._loadCustomControl(extensionPackage, dualDisplayConfig.customControl);
                };
                DualDisplayExtensionsManager.prototype.getCustomControls = function () {
                    return this._getCustomControls()
                        .map(function (controlWrapper) {
                        var packageInfo = controlWrapper.extensionPackage.context.extensionPackageInfo;
                        return new Commerce.Extensibility.DualDisplayCustomControlViewModel(controlWrapper.extension, controlWrapper.messageChannel, packageInfo.publisher, packageInfo.name, packageInfo.version);
                    });
                };
                DualDisplayExtensionsManager.prototype._getCustomControls = function () {
                    var controlWrappers = [];
                    if (Commerce.ArrayExtensions.hasElements(this._customControls)) {
                        this._customControls.forEach(function (controlDetails) {
                            var extensionPackage = controlDetails.package;
                            var posToControlPort = new Messaging.PosMessagePort();
                            var controlToPosPort = new Messaging.PosMessagePort();
                            var commandContext = {
                                extensionPackageInfo: extensionPackage.packageInfo,
                                logger: extensionPackage.context.logger,
                                resources: extensionPackage.context.resources,
                                messageChannel: new Messaging.MessageChannelEndpoint(controlToPosPort, posToControlPort),
                                controlFactory: extensionPackage.extensionControlFactoryContext.controlFactory
                            };
                            var controlWrapper = {
                                extension: new controlDetails.extension(controlDetails.id, commandContext),
                                messageChannel: new Messaging.MessageChannelEndpoint(posToControlPort, controlToPosPort),
                                extensionPackage: extensionPackage
                            };
                            controlWrappers.push(controlWrapper);
                        });
                    }
                    return controlWrappers;
                };
                DualDisplayExtensionsManager.prototype._loadCustomControl = function (extensionPackage, manifestItem) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "DualDisplay - CustomControl";
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.CustomControl;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.name) ? manifestItem.controlName : manifestItem.name;
                    var extensionModulePath = manifestItem.modulePath;
                    var extensionDescription = TypeExtensions_1.StringExtensions.isNullOrWhitespace(manifestItem.description)
                        ? Commerce.StringResourceManager.getString("string_7484")
                        : manifestItem.description;
                    return Promise.resolve().then(function () {
                        var manifestValidationErrorDetails;
                        var controlId;
                        if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.controlName)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain a control name.",
                                controlName: "Unknown"
                            };
                        }
                        else if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.htmlPath)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain an html path.",
                                controlName: manifestItem.controlName
                            };
                        }
                        else if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.modulePath)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain a module path.",
                                controlName: manifestItem.controlName
                            };
                        }
                        else if (_this._customControls.length > 0) {
                            manifestValidationErrorDetails = {
                                errorMessage: "A dual display custom control is already defined.",
                                controlName: manifestItem.controlName
                            };
                        }
                        else {
                            controlId = _this.getCustomControlId(manifestItem.controlName, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.name);
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(DualDisplayExtensionsManager.controlsByControlId[controlId])) {
                                manifestValidationErrorDetails = {
                                    errorMessage: "Control with id '" + controlId + "' already exists.",
                                    controlName: manifestItem.controlName
                                };
                            }
                        }
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(manifestValidationErrorDetails)) {
                            Commerce.RetailLogger.dualDisplayExtensionsLoaderCustomControlManifestValidationFailed(manifestValidationErrorDetails.controlName, manifestValidationErrorDetails.errorMessage, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            var loadError = new Error(manifestValidationErrorDetails.errorMessage);
                            return Promise.reject(loadError);
                        }
                        var extensionPath = _this._getExtensionPath(extensionPackage.packageInfo.baseUrl, manifestItem.modulePath);
                        return _this._loadControlHtmlFragment(extensionPackage, manifestItem.htmlPath).then(function () {
                            return _this._loadModuleImpl(extensionPath)
                                .then(function (controlModule) {
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(controlModule) &&
                                    !Commerce.ObjectExtensions.isNullOrUndefined(controlModule.default)) {
                                    var controlType = controlModule.default;
                                    if (controlType.prototype instanceof DualDisplay_1.DualDisplayCustomControlBase) {
                                        var controlDetails = { extension: controlType, package: extensionPackage, id: controlId };
                                        _this._customControls.push(controlDetails);
                                        Commerce.RetailLogger.dualDisplayExtensionsLoaderCustomControlAdded(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                        return Promise.resolve();
                                    }
                                    else {
                                        Commerce.RetailLogger.dualDisplayExtensionsLoaderCustomControlLoadFailedDueToInvalidControlType(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                        var loadError = new Error("Invalid control type");
                                        return Promise.reject(loadError);
                                    }
                                }
                                else {
                                    Commerce.RetailLogger.dualDisplayExtensionsLoaderCustomControlLoadFailedDueToInvalidModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    var loadError = new Error("Invalid module");
                                    return Promise.reject(loadError);
                                }
                            });
                        }, function (error) {
                            Commerce.RetailLogger.dualDisplayExtensionsLoaderCustomControlLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.reject(error);
                        });
                    }).then(function () {
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_1.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                DualDisplayExtensionsManager.prototype._loadControlHtmlFragment = function (extensionPackage, htmlPath) {
                    var _this = this;
                    var promise = new Promise(function (resolve, reject) {
                        if (Commerce.StringExtensions.isNullOrWhitespace(htmlPath)) {
                            resolve();
                        }
                        else {
                            var htmlFragmentPath = extensionPackage.packageInfo.baseUrl + "/" + htmlPath;
                            var fragmentWrapper_1 = _this._createAndInsertHtmlImpl(encodeURIComponent(htmlFragmentPath));
                            if (Commerce.ObjectExtensions.isNullOrUndefined(fragmentWrapper_1)) {
                                var errorMessage = "Unable to create and insert html for extension control.";
                                Commerce.RetailLogger.extensibilityFrameworkUnableToCreateAndInsertHtmlFragmentForControl(errorMessage, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                throw new Error(errorMessage);
                            }
                            _this._renderHtmlImpl(htmlFragmentPath, fragmentWrapper_1).then(function () {
                                resolve();
                            }).catch(function (error) {
                                fragmentWrapper_1.parentNode.removeChild(fragmentWrapper_1);
                                Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlFailedToRenderHtmlFragment(Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                reject(error);
                            });
                        }
                    });
                    return promise.catch(function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlHtmlFragment(JSON.stringify(reason), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(reason);
                    });
                };
                DualDisplayExtensionsManager.prototype.getCustomControlId = function (controlName, publisherName, packageName) {
                    return Commerce.StringExtensions.format(DualDisplayExtensionsManager.CUSTOM_CONTROL_ID_FORMAT_STRING, publisherName, packageName, controlName);
                };
                DualDisplayExtensionsManager.prototype._getExtensionPath = function (baseUrl, relativeModulePath) {
                    return baseUrl + "/" + relativeModulePath;
                };
                DualDisplayExtensionsManager.CUSTOM_CONTROL_ID_FORMAT_STRING = "dualDisplayCustomControl_{0}_{1}_{2}";
                DualDisplayExtensionsManager.controlsByControlId = Object.create(null);
                return DualDisplayExtensionsManager;
            }());
            exports_3("DualDisplayExtensionsManager", DualDisplayExtensionsManager);
        }
    };
});
System.register("ExtensionControlFactory", [], function (exports_4, context_4) {
    "use strict";
    var ExtensionControlFactory;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            ExtensionControlFactory = (function () {
                function ExtensionControlFactory(controlFactory, packageInfo) {
                    this._controlFactory = controlFactory;
                    this._packageInfo = packageInfo;
                }
                ExtensionControlFactory.prototype.create = function (correlationId, controlName, controlOptions, rootHTMLElement) {
                    try {
                        Commerce.RetailLogger.extensibilityFrameworkCreateControlStarted(controlName, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version, correlationId);
                        var control = this._controlFactory.create(correlationId, controlName, controlOptions, rootHTMLElement);
                        Commerce.RetailLogger.extensibilityFrameworkCreateControlFinished(controlName, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version, correlationId);
                        return control;
                    }
                    catch (exception) {
                        Commerce.RetailLogger.extensibilityFrameworkCreateControlFailed(controlName, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version, Commerce.ErrorHelper.serializeError(exception), correlationId);
                        throw exception;
                    }
                };
                return ExtensionControlFactory;
            }());
            exports_4("default", ExtensionControlFactory);
        }
    };
});
System.register("ExtensionLogger", [], function (exports_5, context_5) {
    "use strict";
    var ExtensionLogger;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            ExtensionLogger = (function () {
                function ExtensionLogger(extensionPublisher, extensionName, extensionVersion) {
                    this._extensionPublisher = extensionPublisher;
                    this._extensionName = extensionName;
                    this._extensionVersion = extensionVersion;
                }
                ExtensionLogger.prototype.logVerbose = function (message, correlationId, additionalParameter) {
                    if (correlationId === void 0) { correlationId = ""; }
                    if (additionalParameter === void 0) { additionalParameter = ""; }
                    correlationId = Commerce.StringExtensions.isNullOrWhitespace(correlationId) ? Commerce.LoggerHelper.getNewCorrelationId() : correlationId;
                    Commerce.RetailLogger.extensionVerbose(this._extensionPublisher, this._extensionName, this._extensionVersion, correlationId);
                    console.log([correlationId, message, additionalParameter]);
                    return correlationId;
                };
                ExtensionLogger.prototype.logInformational = function (message, correlationId, additionalParameter) {
                    if (correlationId === void 0) { correlationId = ""; }
                    if (additionalParameter === void 0) { additionalParameter = ""; }
                    correlationId = Commerce.StringExtensions.isNullOrWhitespace(correlationId) ? Commerce.LoggerHelper.getNewCorrelationId() : correlationId;
                    Commerce.RetailLogger.extensionInformational(this._extensionPublisher, this._extensionName, this._extensionVersion, correlationId);
                    console.log([correlationId, message, additionalParameter]);
                    return correlationId;
                };
                ExtensionLogger.prototype.logWarning = function (message, correlationId, additionalParameter) {
                    if (correlationId === void 0) { correlationId = ""; }
                    if (additionalParameter === void 0) { additionalParameter = ""; }
                    correlationId = Commerce.StringExtensions.isNullOrWhitespace(correlationId) ? Commerce.LoggerHelper.getNewCorrelationId() : correlationId;
                    Commerce.RetailLogger.extensionWarning(this._extensionPublisher, this._extensionName, this._extensionVersion, correlationId);
                    console.log([correlationId, message, additionalParameter]);
                    return correlationId;
                };
                ExtensionLogger.prototype.logError = function (message, correlationId, additionalParameter) {
                    if (correlationId === void 0) { correlationId = ""; }
                    if (additionalParameter === void 0) { additionalParameter = ""; }
                    correlationId = Commerce.StringExtensions.isNullOrWhitespace(correlationId) ? Commerce.LoggerHelper.getNewCorrelationId() : correlationId;
                    Commerce.RetailLogger.extensionError(this._extensionPublisher, this._extensionName, this._extensionVersion, correlationId);
                    console.log([correlationId, message, additionalParameter]);
                    return correlationId;
                };
                ExtensionLogger.prototype.logCriticalError = function (message, correlationId, additionalParameter) {
                    if (correlationId === void 0) { correlationId = ""; }
                    if (additionalParameter === void 0) { additionalParameter = ""; }
                    correlationId = Commerce.StringExtensions.isNullOrWhitespace(correlationId) ? Commerce.LoggerHelper.getNewCorrelationId() : correlationId;
                    Commerce.RetailLogger.extensionCritical(this._extensionPublisher, this._extensionName, this._extensionVersion, correlationId);
                    console.log([correlationId, message, additionalParameter]);
                    return correlationId;
                };
                ExtensionLogger.prototype.getNewCorrelationId = function () {
                    return Commerce.LoggerHelper.getNewCorrelationId();
                };
                return ExtensionLogger;
            }());
            exports_5("default", ExtensionLogger);
        }
    };
});
System.register("NewViewConstants", [], function (exports_6, context_6) {
    "use strict";
    var PAGE_NAME_FORMAT;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            exports_6("PAGE_NAME_FORMAT", PAGE_NAME_FORMAT = "{0}_{1}");
        }
    };
});
System.register("ExtensionNavigator", ["NewViewConstants"], function (exports_7, context_7) {
    "use strict";
    var NewViewConstants, ExtensionNavigator;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (NewViewConstants_1) {
                NewViewConstants = NewViewConstants_1;
            }
        ],
        execute: function () {
            ExtensionNavigator = (function () {
                function ExtensionNavigator(extensionPackageInfo) {
                    this._packageInfo = extensionPackageInfo;
                }
                ExtensionNavigator.prototype.navigateToPOSView = function (viewName, options) {
                    if (Commerce.StringExtensions.isNullOrWhitespace(viewName)) {
                        var errorMessage = "ExtensionNavigator.navigateToPOSView: View name cannot be null or empty.";
                        Commerce.RetailLogger.extensibilityFrameworkNavigateToPOSViewInvalidParameter(viewName, "viewName", errorMessage, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version);
                        throw new Error(errorMessage);
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                        var SUPPORTED_VOID_NAVIGATION_VIEW_NAMES = ["CartView", "HomeView"];
                        if (!Commerce.ArrayExtensions.hasElement(SUPPORTED_VOID_NAVIGATION_VIEW_NAMES, viewName)) {
                            var errorMessage = "ExtensionNavigator.navigateToPOSView: Unsupported void navigation view name.";
                            Commerce.RetailLogger.extensibilityFrameworkNavigateToPOSViewInvalidParameter(viewName, "viewName", errorMessage, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version);
                            throw new Error(errorMessage);
                        }
                    }
                    var correlationId;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                        correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                        this._getVoidNavigationToPOSViewParameters(viewName, correlationId);
                    }
                    else if (options instanceof Commerce.Client.Entities.NavigationParameters) {
                        correlationId = options.correlationId;
                    }
                    else {
                        var errorMessage = "ExtensionNavigator.navigateToPOSView: provided options must be of type NavigationParameters.";
                        Commerce.RetailLogger.extensibilityFrameworkNavigateToPOSViewInvalidParameter(viewName, "options", errorMessage, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version);
                        throw new Error(errorMessage);
                    }
                    Commerce.RetailLogger.extensibilityFrameworkNavigateToPOSView(viewName, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version, correlationId);
                    Commerce.ViewModelAdapter.navigate(viewName, options);
                };
                ExtensionNavigator.prototype.navigate = function (viewName, options) {
                    if (Commerce.StringExtensions.isNullOrWhitespace(viewName)) {
                        Commerce.RetailLogger.extensibilityFrameworkNavigateToExtensionViewInvalidViewName(viewName, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version);
                        throw new Error("ExtensionNavigator.navigate: View name cannot be null or empty.");
                    }
                    viewName = Commerce.StringExtensions.format(NewViewConstants.PAGE_NAME_FORMAT, this._packageInfo.id, viewName);
                    Commerce.RetailLogger.extensibilityFrameworkNavigateToExtensionView(viewName, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version);
                    Commerce.ViewModelAdapter.navigate(viewName, options);
                };
                ExtensionNavigator.prototype.navigateBack = function (correlationId) {
                    correlationId = Commerce.LoggerHelper.resolveCorrelationId(correlationId);
                    Commerce.RetailLogger.extensibilityFrameworkNavigateBack(this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version, correlationId);
                    Commerce.ViewModelAdapter.navigateBack(correlationId);
                };
                ExtensionNavigator.prototype._getVoidNavigationToPOSViewParameters = function (viewName, correlationId) {
                    Commerce.RetailLogger.extensibilityFrameworkNavigateToPOSViewVoidNavigationExecuted(viewName, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version, correlationId);
                    if (viewName === "CartView") {
                        return new Commerce.Client.Entities.CartViewNavigationParameters(correlationId);
                    }
                    else {
                        return new Commerce.Client.Entities.HomeViewNavigationParameters(correlationId);
                    }
                };
                return ExtensionNavigator;
            }());
            exports_7("default", ExtensionNavigator);
        }
    };
});
System.register("ExtensionPackage", [], function (exports_8, context_8) {
    "use strict";
    var ExtensionPackage;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
            ExtensionPackage = (function () {
                function ExtensionPackage(manifest, extensionContext, extensionControlFactoryContext, isIndependentPackage, packageName, baseUrl) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(manifest)) {
                        throw "Invalid parameter provided to the ExtensionPackage constructor: manifest cannot be null or undefined.";
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(extensionContext)) {
                        throw "Invalid parameter provided to the ExtensionPackage constructor: extensionContext cannot be null or undefined.";
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(extensionContext.extensionPackageInfo)) {
                        throw "Invalid parameter provided to the ExtensionPackage constructor: extensionContext.extensionPackageInfo cannot be null or undefined.";
                    }
                    this._extensionContext = extensionContext;
                    this._extensionControlFactoryContext = extensionControlFactoryContext;
                    this._extensionsDependencies = Commerce.ArrayExtensions.hasElements(manifest.dependencies) ? manifest.dependencies : [];
                    this._extensionsConfig = ExtensionPackage.convertComponentsManifestItemToExtensionsConfig(manifest.components);
                    this._extensionsConfigNodeNames = Object.keys(this._extensionsConfig)
                        .filter(function (key, index) {
                        return !Commerce.StringExtensions.isNullOrWhitespace(key);
                    });
                    this._extensionPackageInfo = extensionContext.extensionPackageInfo;
                    this._extensionsByExtensionPointType = new Commerce.Dictionary();
                    this._isIndependentPackage = isIndependentPackage;
                    this._packageName = packageName;
                    this._baseUrl = baseUrl;
                }
                Object.defineProperty(ExtensionPackage.prototype, "baseUrl", {
                    get: function () {
                        return this._baseUrl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackage.prototype, "extensionsConfigNodeNames", {
                    get: function () {
                        return this._extensionsConfigNodeNames;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackage.prototype, "context", {
                    get: function () {
                        return this._extensionContext;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackage.prototype, "extensionControlFactoryContext", {
                    get: function () {
                        return this._extensionControlFactoryContext;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackage.prototype, "extensionsDependencies", {
                    get: function () {
                        return this._extensionsDependencies;
                    },
                    enumerable: true,
                    configurable: true
                });
                ExtensionPackage.prototype.getExtensionConfigNode = function (name) {
                    return this._extensionsConfig[name];
                };
                ExtensionPackage.prototype.getExtensionPackageLoadInfo = function () {
                    var extensionLoadInfos = [];
                    this._extensionsByExtensionPointType.getItems().forEach(function (extensions) {
                        extensions.forEach(function (extension) {
                            var extensionLoadInfo = extension.getExtensionLoadInfo();
                            extensionLoadInfos.push(extensionLoadInfo);
                        });
                    });
                    var extensionPackageLoadInfo = {
                        extensionPackageInfo: this._extensionPackageInfo,
                        extensionLoadInfos: extensionLoadInfos
                    };
                    return extensionPackageLoadInfo;
                };
                ExtensionPackage.prototype.addExtension = function (extension) {
                    var extensions = this._extensionsByExtensionPointType.getItem(extension.extensionPointType);
                    if (!Commerce.ArrayExtensions.hasElements(extensions)) {
                        extensions = [];
                        this._extensionsByExtensionPointType.setItem(extension.extensionPointType, extensions);
                    }
                    extensions.push(extension);
                };
                ExtensionPackage.prototype.getExtensionsByExtensionPointType = function (extensionPointType) {
                    return this._extensionsByExtensionPointType.getItem(extensionPointType) || [];
                };
                Object.defineProperty(ExtensionPackage.prototype, "packageInfo", {
                    get: function () {
                        return this._extensionPackageInfo;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackage.prototype, "isIndependentPackage", {
                    get: function () {
                        return this._isIndependentPackage;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackage.prototype, "packageName", {
                    get: function () {
                        return this._packageName;
                    },
                    enumerable: true,
                    configurable: true
                });
                ExtensionPackage.convertComponentsManifestItemToExtensionsConfig = function (components) {
                    var hasExtendNode = !Commerce.ObjectExtensions.isNullOrUndefined(components.extend);
                    var hasCreateNode = !Commerce.ObjectExtensions.isNullOrUndefined(components.create);
                    var extensionConfig = {
                        viewExtensions: hasExtendNode ? components.extend.views : undefined,
                        requestHandlerExtensions: hasExtendNode ? components.extend.requestHandlers : undefined,
                        triggers: hasExtendNode ? components.extend.triggers : undefined,
                        views: hasCreateNode ? components.create.views : undefined,
                        operations: hasCreateNode ? components.create.operations : undefined,
                        requestHandlers: hasCreateNode ? components.create.requestHandlers : undefined,
                        templatedDialogs: hasCreateNode ? components.create.templatedDialogs : undefined,
                        controls: hasCreateNode ? components.create.controls : undefined,
                        dualDisplayExtensions: components.dualDisplay,
                        resources: components.resources
                    };
                    return extensionConfig;
                };
                return ExtensionPackage;
            }());
            exports_8("default", ExtensionPackage);
        }
    };
});
System.register("ExtensionPackageInfo", [], function (exports_9, context_9) {
    "use strict";
    var ExtensionPackageInfo;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            ExtensionPackageInfo = (function () {
                function ExtensionPackageInfo(extensionPackageConfig, manifest) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(extensionPackageConfig)) {
                        throw "Invalid parameter provided to the ExtensionPackage constructor: extensionPackageConfig cannot be null or undefined.";
                    }
                    else if (Commerce.StringExtensions.isNullOrWhitespace(extensionPackageConfig.baseUrl)) {
                        throw "Invalid parameter provided to the ExtensionPackage constructor: extensionPackageConfig.baseUrl is a required field.";
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(manifest)) {
                        throw "Invalid parameter provided to the ExtensionPackage constructor: manifest cannot be null or undefined.";
                    }
                    else if (Commerce.StringExtensions.isNullOrWhitespace(manifest.name)) {
                        throw "Invalid parameter provided to the ExtensionPackage constructor: manifest missing required property 'name'.";
                    }
                    else if (Commerce.StringExtensions.isNullOrWhitespace(manifest.publisher)) {
                        throw "Invalid parameter provided to the ExtensionPackage constructor: manifest missing required property 'publisher'.";
                    }
                    else if (Commerce.StringExtensions.isNullOrWhitespace(manifest.version)) {
                        throw "Invalid parameter provided to the ExtensionPackage constructor: manifest missing required property 'version'.";
                    }
                    this._config = Object.freeze(extensionPackageConfig);
                    this._manifest = Object.freeze(manifest);
                    this._id = Commerce.StringExtensions.format(ExtensionPackageInfo.EXTENSION_PACKAGE_ID_FORMAT_STRING, this.publisher, this.name);
                }
                Object.defineProperty(ExtensionPackageInfo.prototype, "version", {
                    get: function () {
                        return this._manifest.version;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackageInfo.prototype, "publisher", {
                    get: function () {
                        return this._manifest.publisher;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackageInfo.prototype, "name", {
                    get: function () {
                        return this._manifest.name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackageInfo.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackageInfo.prototype, "baseUrl", {
                    get: function () {
                        return this._config.baseUrl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionPackageInfo.prototype, "description", {
                    get: function () {
                        return Commerce.ObjectExtensions.isNullOrUndefined(this._manifest.description) ? Commerce.StringExtensions.EMPTY : this._manifest.description;
                    },
                    enumerable: true,
                    configurable: true
                });
                ExtensionPackageInfo.EXTENSION_PACKAGE_ID_FORMAT_STRING = "{0}_{1}";
                return ExtensionPackageInfo;
            }());
            exports_9("default", ExtensionPackageInfo);
        }
    };
});
System.register("ExtensionRuntime", ["PosApi/TypeExtensions"], function (exports_10, context_10) {
    "use strict";
    var TypeExtensions_2, ExtensionRuntime;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (TypeExtensions_2_1) {
                TypeExtensions_2 = TypeExtensions_2_1;
            }
        ],
        execute: function () {
            ExtensionRuntime = (function () {
                function ExtensionRuntime(runtime, packageInfo) {
                    this._runtime = runtime;
                    this._packageInfo = packageInfo;
                }
                ExtensionRuntime.prototype.executeAsync = function (request) {
                    var _this = this;
                    var correlationId = this._getCorrelationId(request);
                    var requestTypeName = TypeExtensions_2.ObjectExtensions.isNullOrUndefined(request) ? "null" : Commerce.PrototypeHelper.getPrototypeChainTypeName(request);
                    Commerce.RetailLogger.extensibilityFrameworkExecuteRuntimeRequestStarted(requestTypeName, this._packageInfo.name, this._packageInfo.publisher, this._packageInfo.version, correlationId);
                    return this._runtime.executeAsync(request)
                        .then(function (result) {
                        Commerce.RetailLogger.extensibilityFrameworkExecuteRuntimeRequestFinished(requestTypeName, _this._packageInfo.name, _this._packageInfo.publisher, _this._packageInfo.version, correlationId);
                        return Promise.resolve(result);
                    }).catch(function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkExecuteRuntimeRequestFailed(requestTypeName, _this._packageInfo.name, _this._packageInfo.publisher, _this._packageInfo.version, Commerce.ErrorHelper.serializeError(reason), correlationId);
                        return Promise.reject(reason);
                    });
                };
                ExtensionRuntime.prototype._getCorrelationId = function (request) {
                    if (request instanceof Commerce.OperationRequest
                        && TypeExtensions_2.ObjectExtensions.isString(request.correlationId)
                        && !TypeExtensions_2.StringExtensions.isNullOrWhitespace(request.correlationId)) {
                        return request.correlationId;
                    }
                    else if (!TypeExtensions_2.ObjectExtensions.isNullOrUndefined(request)
                        && TypeExtensions_2.ObjectExtensions.isString(request[ExtensionRuntime.CORRELATION_ID_FIELD_NAME])
                        && !TypeExtensions_2.StringExtensions.isNullOrWhitespace(request[ExtensionRuntime.CORRELATION_ID_FIELD_NAME])) {
                        return request[ExtensionRuntime.CORRELATION_ID_FIELD_NAME];
                    }
                    else {
                        return Commerce.LoggerHelper.getNewCorrelationId();
                    }
                };
                ExtensionRuntime.CORRELATION_ID_FIELD_NAME = "correlationId";
                return ExtensionRuntime;
            }());
            exports_10("default", ExtensionRuntime);
        }
    };
});
System.register("Resources/ExtensionStringResourcesManager", ["PosApi/TypeExtensions"], function (exports_11, context_11) {
    "use strict";
    var LoadExtensionStringResourcesClientRequest, TypeExtensions_3, ExtensionStringResourcesManager;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (TypeExtensions_3_1) {
                TypeExtensions_3 = TypeExtensions_3_1;
            }
        ],
        execute: function () {
            LoadExtensionStringResourcesClientRequest = Commerce.Extensibility.LoadExtensionStringResourcesClientRequest;
            ExtensionStringResourcesManager = (function () {
                function ExtensionStringResourcesManager(options) {
                    this._availableUICultures = options.availableUICultures || [];
                    this._folderConfig = options.folderConfig;
                    this._stringResources = Object.create(null);
                }
                ExtensionStringResourcesManager.prototype.loadResourcesAsync = function (uiCulture, fallbackUICulture) {
                    var _this = this;
                    uiCulture = Commerce.Host.Globalization.CultureHelper.normalizeLanguageCode(uiCulture);
                    var resolvedUICulture = Commerce.Host.Globalization.CultureHelper.resolveAvailableUICulture(uiCulture, fallbackUICulture, this._availableUICultures);
                    if (TypeExtensions_3.StringExtensions.isNullOrWhitespace(resolvedUICulture)) {
                        return Promise.reject("Neither the uiCulture or fallbackUICulture is available.");
                    }
                    if (Commerce.Host.Globalization.CultureHelper.areLanguageTagsEqual(resolvedUICulture, this._currentUICulture)) {
                        return Promise.resolve({
                            canceled: true
                        });
                    }
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var loadExtensionStringResourcesClientRequest = new LoadExtensionStringResourcesClientRequest(correlationId, this._folderConfig, resolvedUICulture);
                    return Commerce.Runtime.executeAsync(loadExtensionStringResourcesClientRequest)
                        .then(function (value) {
                        _this._stringResources = value.data.loadedStrings;
                        _this._currentUICulture = resolvedUICulture;
                        return Promise.resolve({
                            canceled: false
                        });
                    });
                };
                ExtensionStringResourcesManager.prototype.getString = function (stringId) {
                    if (Commerce.StringExtensions.isNullOrWhitespace(stringId)
                        || Commerce.StringExtensions.isNullOrWhitespace(this._stringResources[stringId])) {
                        return stringId;
                    }
                    return this._stringResources[stringId];
                };
                Object.defineProperty(ExtensionStringResourcesManager.prototype, "currentUICulture", {
                    get: function () {
                        return this._currentUICulture;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ExtensionStringResourcesManager;
            }());
            exports_11("ExtensionStringResourcesManager", ExtensionStringResourcesManager);
        }
    };
});
System.register("Resources/ExtensionResourceManager", ["Resources/ExtensionStringResourcesManager", "PosApi/TypeExtensions"], function (exports_12, context_12) {
    "use strict";
    var ExtensionStringResourcesManager_1, TypeExtensions_4, ExtensionResourceManager;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (ExtensionStringResourcesManager_1_1) {
                ExtensionStringResourcesManager_1 = ExtensionStringResourcesManager_1_1;
            },
            function (TypeExtensions_4_1) {
                TypeExtensions_4 = TypeExtensions_4_1;
            }
        ],
        execute: function () {
            ExtensionResourceManager = (function () {
                function ExtensionResourceManager(baseUrl, packageId, packageName, manifestItem) {
                    this._defaultApplicationUICulture = Commerce.Host.instance.globalization.getDefaultLanguageTag();
                    this._unavailableUICultures = [];
                    this._packageId = packageId;
                    this._fallbackExtensionUICulture = manifestItem.fallbackUICulture;
                    var folderConfig = {
                        baseUrl: baseUrl,
                        packageName: packageName,
                        culturesDirectoryPath: manifestItem.culturesDirectoryPath,
                        resourcesFileName: manifestItem.stringResourcesFileName
                    };
                    var extensionStringResourcesManagerOptions = {
                        availableUICultures: manifestItem.supportedUICultures,
                        folderConfig: folderConfig
                    };
                    this._stringResourcesManager = new ExtensionStringResourcesManager_1.ExtensionStringResourcesManager(extensionStringResourcesManagerOptions);
                }
                ExtensionResourceManager.prototype.setCultures = function (culture, uiCulture) {
                    var _this = this;
                    this._currentCulture = culture;
                    if (this.isUICultureUnavailable(uiCulture)) {
                        Commerce.RetailLogger.extensibilityFrameworkExtensionResourceManagerLoadStringResourcesCanceled(uiCulture);
                        return Promise.resolve();
                    }
                    var successSettingRequestedUICulture = false;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    Commerce.RetailLogger.extensibilityFrameworkExtensionResourceManagerLoadStringResourcesStarted(culture, this._packageId, correlationId);
                    return this._stringResourcesManager.loadResourcesAsync(uiCulture, this._defaultApplicationUICulture)
                        .then(function (result) {
                        successSettingRequestedUICulture = true;
                        Commerce.RetailLogger.extensibilityFrameworkExtensionResourceManagerLoadStringResourcesFinished(_this.getCurrentCulture(), correlationId);
                    }).catch(function (errors) {
                        _this._unavailableUICultures.push(uiCulture);
                        _this._unavailableUICultures.push(_this._defaultApplicationUICulture);
                        var serializedErrorMessage = Commerce.ErrorHelper.serializeErrorsForRetailLogger(errors);
                        Commerce.RetailLogger.extensibilityFrameworkExtensionResourceManagerErrorWhileLoadingStringResources(uiCulture, serializedErrorMessage, correlationId);
                        Commerce.RetailLogger.extensibilityFrameworkExtensionResourceManagerLoadStringResourcesForFallbackUICultureStarted(_this._fallbackExtensionUICulture, _this._packageId, correlationId);
                        return _this._stringResourcesManager.loadResourcesAsync(_this._fallbackExtensionUICulture, _this._fallbackExtensionUICulture);
                    }).then(function (result) {
                        if (successSettingRequestedUICulture) {
                            return;
                        }
                        Commerce.RetailLogger.extensibilityFrameworkExtensionResourceManagerLoadStringResourcesForFallbackUICultureFinished(_this._fallbackExtensionUICulture, correlationId);
                    }).catch(function (errors) {
                        _this._unavailableUICultures.push(_this._fallbackExtensionUICulture);
                        var serializedErrorMessage = Commerce.ErrorHelper.serializeErrorsForRetailLogger(errors);
                        Commerce.RetailLogger.extensibilityFrameworkExtensionResourceManagerErrorWhileLoadingStringResourcesForFallbackUICulture(_this._fallbackExtensionUICulture, serializedErrorMessage, correlationId);
                        throw new Commerce.Proxy.Entities.Error("string_7491", false, TypeExtensions_4.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_7491"), uiCulture, _this._defaultApplicationUICulture, _this._fallbackExtensionUICulture));
                    });
                };
                ExtensionResourceManager.prototype.getString = function (stringId) {
                    return this._stringResourcesManager.getString(stringId);
                };
                ExtensionResourceManager.prototype.getCurrentUICulture = function () {
                    return this._stringResourcesManager.currentUICulture;
                };
                ExtensionResourceManager.prototype.getCurrentCulture = function () {
                    return this._currentCulture;
                };
                ExtensionResourceManager.prototype.isUICultureUnavailable = function (uiCulture) {
                    if (Commerce.ArrayExtensions.hasElement(this._unavailableUICultures, uiCulture, function (first, second) {
                        return Commerce.StringExtensions.compare(first, second, true) === 0;
                    })) {
                        return true;
                    }
                    return false;
                };
                return ExtensionResourceManager;
            }());
            exports_12("ExtensionResourceManager", ExtensionResourceManager);
        }
    };
});
System.register("Resources/ExtensionCultureManager", ["Resources/ExtensionResourceManager"], function (exports_13, context_13) {
    "use strict";
    var ExtensionResourceManager_1, ExtensionCultureManager;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (ExtensionResourceManager_1_1) {
                ExtensionResourceManager_1 = ExtensionResourceManager_1_1;
            }
        ],
        execute: function () {
            ExtensionCultureManager = (function () {
                function ExtensionCultureManager() {
                    this._resourceManagersByPackageId = new Commerce.Dictionary();
                }
                Object.defineProperty(ExtensionCultureManager, "instance", {
                    get: function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(ExtensionCultureManager._instance)) {
                            ExtensionCultureManager._instance = new ExtensionCultureManager();
                            Commerce.Extensibility.setExtensionCultureManager(ExtensionCultureManager._instance);
                        }
                        return ExtensionCultureManager._instance;
                    },
                    enumerable: true,
                    configurable: true
                });
                ExtensionCultureManager.prototype.createResourceManager = function (extensionPackage, manifestItem) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(extensionPackage)) {
                        throw "Invalid parameter provided to 'createResourceManager' function: 'extensionPackage' is either null or undefinied.";
                    }
                    if (Commerce.ObjectExtensions.isNullOrUndefined(extensionPackage.packageInfo)) {
                        throw "Invalid parameter provided to 'createResourceManager' function: 'extensionPackage.packageInfo' is either null or undefinied.";
                    }
                    var resourceManager = new ExtensionResourceManager_1.ExtensionResourceManager(extensionPackage.baseUrl, extensionPackage.packageInfo.id, extensionPackage.packageName, manifestItem);
                    this._resourceManagersByPackageId.setItem(extensionPackage.packageInfo.id, resourceManager);
                    var cultureFullPath = extensionPackage.packageInfo.baseUrl + "/" + manifestItem.culturesDirectoryPath;
                    Commerce.RetailLogger.extensibilityFrameworkExtensionResourceManagerCreated(extensionPackage.packageInfo.id, JSON.stringify(manifestItem.supportedUICultures), manifestItem.fallbackUICulture, cultureFullPath, manifestItem.stringResourcesFileName);
                    var initialCulture = Commerce.Host.instance.globalization.getApplicationLanguage();
                    return resourceManager.setCultures(initialCulture, initialCulture);
                };
                ExtensionCultureManager.prototype.getResourceManager = function (packageId) {
                    return this._resourceManagersByPackageId.getItem(packageId);
                };
                ExtensionCultureManager.prototype.setExtensionCultures = function (culture, uiCulture) {
                    var setExtensionCulturesPromise = Promise.resolve();
                    this._resourceManagersByPackageId.forEach(function (packageId, resourceManager) {
                        setExtensionCulturesPromise.then(function () {
                            return resourceManager.setCultures(culture, uiCulture);
                        });
                    });
                    return setExtensionCulturesPromise;
                };
                ExtensionCultureManager._instance = null;
                return ExtensionCultureManager;
            }());
            exports_13("ExtensionCultureManager", ExtensionCultureManager);
        }
    };
});
System.register("ExtensionsLoader", ["ExtensionControlFactory", "Resources/ExtensionCultureManager", "ExtensionLogger", "ExtensionNavigator", "ExtensionPackage", "ExtensionPackageInfo", "ExtensionRuntime"], function (exports_14, context_14) {
    "use strict";
    var ExtensionControlFactory_1, ExtensionCultureManager_1, ExtensionLogger_1, ExtensionNavigator_1, ExtensionPackage_1, ExtensionPackageInfo_1, ExtensionRuntime_1, ExtensibleEnumerationManager, ExtensionLoadError, ExtensionPackageFailureReason, ExtensionPointType, ObjectExtensions, StringExtensions, ExtensionContext, ExtensionsLoader;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (ExtensionControlFactory_1_1) {
                ExtensionControlFactory_1 = ExtensionControlFactory_1_1;
            },
            function (ExtensionCultureManager_1_1) {
                ExtensionCultureManager_1 = ExtensionCultureManager_1_1;
            },
            function (ExtensionLogger_1_1) {
                ExtensionLogger_1 = ExtensionLogger_1_1;
            },
            function (ExtensionNavigator_1_1) {
                ExtensionNavigator_1 = ExtensionNavigator_1_1;
            },
            function (ExtensionPackage_1_1) {
                ExtensionPackage_1 = ExtensionPackage_1_1;
            },
            function (ExtensionPackageInfo_1_1) {
                ExtensionPackageInfo_1 = ExtensionPackageInfo_1_1;
            },
            function (ExtensionRuntime_1_1) {
                ExtensionRuntime_1 = ExtensionRuntime_1_1;
            }
        ],
        execute: function () {
            ExtensibleEnumerationManager = Commerce.ExtensibleEnumerations.ExtensibleEnumerationManager;
            ExtensionLoadError = Commerce.Extensibility.ExtensionLoadError;
            ExtensionPackageFailureReason = Commerce.Extensibility.ExtensionPackageFailureReason;
            ExtensionPointType = Commerce.Extensibility.ExtensionPointType;
            ObjectExtensions = Commerce.ObjectExtensions;
            StringExtensions = Commerce.StringExtensions;
            ExtensionContext = (function () {
                function ExtensionContext(runtime, logger, extensibleEnumerationManager, extensionPackageInfo, navigator) {
                    this.runtime = runtime;
                    this.logger = logger;
                    this.extensionPackageInfo = extensionPackageInfo;
                    this.navigator = navigator;
                    this.extensibleEnumerationManager = extensibleEnumerationManager;
                }
                return ExtensionContext;
            }());
            ExtensionsLoader = (function () {
                function ExtensionsLoader(manifestLoaders, loadJsonImpl, configureExtensionPackageDependencies, controlFactory) {
                    this._extensionPackagesById = new Commerce.Dictionary();
                    this._extensionPackageLoadFailureInfos = [];
                    this._allManifestLoadersMap = manifestLoaders;
                    this._loadJsonImpl = loadJsonImpl;
                    this._configureExtensionPackageDependencies = configureExtensionPackageDependencies;
                    this._controlFactory = controlFactory;
                    this._extensionPackageLoadCanceledInfos = [];
                }
                ExtensionsLoader.prototype.load = function (extensionPackagesConfig, currentCountryRegion) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(extensionPackagesConfig)
                        || !Commerce.ArrayExtensions.hasElements(extensionPackagesConfig.packageDefinitions)) {
                        return Promise.resolve();
                    }
                    var extensionConfigCount = extensionPackagesConfig.packageDefinitions.length;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    Commerce.RetailLogger.extensionsLoaderLoadExtensionsStarted(extensionConfigCount, correlationId);
                    var extensionPackagesLoadSequence = Promise.resolve();
                    var _loop_1 = function (i) {
                        extensionPackagesLoadSequence = extensionPackagesLoadSequence
                            .then(function () {
                            return _this._loadExtensionPackage(correlationId, extensionPackagesConfig.baseUrl, extensionPackagesConfig.isIndependentPackagingEnabled, extensionPackagesConfig.packageDefinitions[i], currentCountryRegion);
                        });
                    };
                    for (var i = 0; i < extensionConfigCount; i++) {
                        _loop_1(i);
                    }
                    return extensionPackagesLoadSequence.then(function () {
                        var extensionPackages = _this._extensionPackagesById.getItems();
                        Commerce.EnumExtensions.getNumericValues(ExtensionPointType).forEach(function (curExtensionPointType) {
                            var extensionsForCurrentExtensionPointType = [];
                            extensionPackages.forEach(function (extensionPackage) {
                                var curPackageMatchingExtensions = extensionPackage.getExtensionsByExtensionPointType(curExtensionPointType);
                                if (Commerce.ArrayExtensions.hasElements(curPackageMatchingExtensions)) {
                                    extensionsForCurrentExtensionPointType.push.apply(extensionsForCurrentExtensionPointType, curPackageMatchingExtensions);
                                }
                            });
                            Commerce.RetailLogger.extensionsLoaderExtensionPointSummary(ExtensionPointType[curExtensionPointType], extensionsForCurrentExtensionPointType.length, correlationId);
                        });
                        var extensionPackageIds = extensionPackages.map(function (extensionPackage) {
                            return extensionPackage.packageInfo.id;
                        }).join();
                        Commerce.RetailLogger.extensionsLoaderLoadingExtensionsCompleted(extensionPackages.length, extensionPackageIds, correlationId);
                    });
                };
                ExtensionsLoader.prototype.getExtensionPackagesLoadInfo = function () {
                    var loadFailedAndCanceledInfos = this._extensionPackageLoadFailureInfos.concat(this._extensionPackageLoadCanceledInfos);
                    var extensionPackageLoadSuccessInfos = this._extensionPackagesById.getItems().map(function (extensionPackage) {
                        return extensionPackage.getExtensionPackageLoadInfo();
                    });
                    var extensionPackagesLoadInfo = {
                        loadError: undefined,
                        extensionPackageLoadInfos: loadFailedAndCanceledInfos.concat(extensionPackageLoadSuccessInfos)
                    };
                    return extensionPackagesLoadInfo;
                };
                ExtensionsLoader.prototype._loadExtensionPackage = function (correlationId, baseUrl, isIndependentPackage, extensionPackageDefinition, currentCountryRegion) {
                    var _this = this;
                    var packageBaseUrl = Commerce.UrlHelper.formatBaseUrl(baseUrl) + extensionPackageDefinition.Name;
                    if (!extensionPackageDefinition.IsEnabled) {
                        var notEnabledInfo = {
                            extensionLoadInfos: [],
                            extensionPackageInfo: {
                                baseUrl: packageBaseUrl,
                                description: undefined,
                                id: undefined,
                                name: extensionPackageDefinition.Name,
                                publisher: extensionPackageDefinition.Publisher,
                                version: undefined
                            },
                            skipReason: Commerce.Extensibility.ExtensionPackageSkipReason.NotEnabled
                        };
                        this._extensionPackageLoadCanceledInfos.push(notEnabledInfo);
                        return Promise.resolve();
                    }
                    var manifestFilePath = packageBaseUrl + "/" + ExtensionsLoader.MANIFEST_FILE_NAME;
                    return this._loadJsonImpl(manifestFilePath)
                        .catch(function () {
                        var loadError = new ExtensionLoadError(ExtensionPackageFailureReason.ManifestFailedToLoad);
                        return Promise.reject(loadError);
                    }).then(function (manifest) {
                        var extensionPackageFailureReason = _this._validateManifest(isIndependentPackage, extensionPackageDefinition, manifest);
                        if (!ObjectExtensions.isNullOrUndefined(extensionPackageFailureReason)) {
                            var loadError = new ExtensionLoadError(extensionPackageFailureReason);
                            return Promise.reject(loadError);
                        }
                        var packageConfig = {
                            baseUrl: packageBaseUrl
                        };
                        var extensionPackageInfo = new ExtensionPackageInfo_1.default(packageConfig, manifest);
                        var appVersionStr = Commerce.ViewModelAdapter.getApplicationVersion();
                        if (isIndependentPackage && !_this._isVersionValid(manifest.minimumPosVersion, appVersionStr)) {
                            Commerce.RetailLogger.extensionsLoaderExtensionNotSupportedInCurrentVersion(appVersionStr, extensionPackageInfo.baseUrl, extensionPackageInfo.name, extensionPackageInfo.publisher, extensionPackageInfo.version, manifest.minimumPosVersion);
                            var notSupportedForCurrentPosVersionInfo = {
                                skipReason: Commerce.Extensibility.ExtensionPackageSkipReason.NotSupportedInCurrentPosVersion,
                                extensionLoadInfos: [],
                                extensionPackageInfo: extensionPackageInfo
                            };
                            _this._extensionPackageLoadCanceledInfos.push(notSupportedForCurrentPosVersionInfo);
                            return Promise.resolve();
                        }
                        else if (!_this._isExtensionSupportedInCountryRegion(manifest.supportedCountryRegions, currentCountryRegion)) {
                            Commerce.RetailLogger.extensionsLoaderExtensionNotSupportedInCurrentRegion(currentCountryRegion, extensionPackageInfo.baseUrl, extensionPackageInfo.name, extensionPackageInfo.publisher, extensionPackageInfo.version);
                            var notSupportedInCurrentRegionInfo = {
                                skipReason: Commerce.Extensibility.ExtensionPackageSkipReason.NotSupportedInCurrentRegion,
                                extensionLoadInfos: [],
                                extensionPackageInfo: extensionPackageInfo
                            };
                            _this._extensionPackageLoadCanceledInfos.push(notSupportedInCurrentRegionInfo);
                            return Promise.resolve();
                        }
                        var extensionContext = new ExtensionContext(new ExtensionRuntime_1.default(Commerce.Runtime, extensionPackageInfo), new ExtensionLogger_1.default(manifest.publisher, manifest.name, manifest.version), ExtensibleEnumerationManager.instance, extensionPackageInfo, new ExtensionNavigator_1.default(extensionPackageInfo));
                        var extensionControlFactoryContext = { controlFactory: new ExtensionControlFactory_1.default(_this._controlFactory, extensionPackageInfo) };
                        var extensionPackage = new ExtensionPackage_1.default(manifest, extensionContext, extensionControlFactoryContext, isIndependentPackage, extensionPackageDefinition.Name, baseUrl);
                        var dependenciesLoadFailureReason = _this._loadExtensionDependencies(extensionPackage);
                        if (!ObjectExtensions.isNullOrUndefined(dependenciesLoadFailureReason)) {
                            var loadError = new ExtensionLoadError(dependenciesLoadFailureReason);
                            return Promise.reject(loadError);
                        }
                        var extensionsLoadSequence = Promise.resolve();
                        var RESOURCES_NODE_NAME = "resources";
                        extensionsLoadSequence = extensionsLoadSequence.then(function () {
                            return _this.invokeLoader(extensionPackage, RESOURCES_NODE_NAME).then(function () {
                                var resourceManager = ExtensionCultureManager_1.ExtensionCultureManager.instance.getResourceManager(extensionPackageInfo.id);
                                extensionContext.resources = resourceManager;
                            });
                        });
                        extensionPackage.extensionsConfigNodeNames.forEach(function (nodeName) {
                            if (nodeName !== RESOURCES_NODE_NAME) {
                                extensionsLoadSequence = extensionsLoadSequence.then(function () {
                                    return _this.invokeLoader(extensionPackage, nodeName);
                                });
                            }
                        });
                        return extensionsLoadSequence.then(function () {
                            if (!ObjectExtensions.isNullOrUndefined(extensionPackage)) {
                                Commerce.RetailLogger.extensionsLoaderLoadingExtensionPackageCompleted(packageBaseUrl, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            }
                            return Promise.resolve(extensionPackage);
                        });
                    }).then(function (extensionPackage) {
                        if (!ObjectExtensions.isNullOrUndefined(extensionPackage)) {
                            _this._extensionPackagesById.setItem(extensionPackage.packageInfo.id, extensionPackage);
                        }
                    }, function (reason) {
                        Commerce.RetailLogger.extensionsLoaderFailedToLoadExtensionPackageManifest(packageBaseUrl, Commerce.ErrorHelper.serializeError(reason));
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extensionPackageLoadFailureInfo = {
                            extensionLoadInfos: [],
                            extensionPackageInfo: {
                                baseUrl: packageBaseUrl,
                                description: undefined,
                                id: undefined,
                                name: undefined,
                                publisher: undefined,
                                version: undefined
                            },
                            loadError: loadError
                        };
                        _this._extensionPackageLoadFailureInfos.push(extensionPackageLoadFailureInfo);
                    });
                };
                ExtensionsLoader.prototype._validateManifest = function (isIndependentPackagingEnabled, extensionPackageDefinition, manifest) {
                    if (ObjectExtensions.isNullOrUndefined(manifest) || ObjectExtensions.isNullOrUndefined(manifest.components)) {
                        Commerce.RetailLogger.extensionsLoaderInvalidExtensionPackageDiscoveredManifestOrManifestComponentsUndefined(extensionPackageDefinition.Name);
                        return ExtensionPackageFailureReason.ManifestOrManifestComponentsNullOrUndefined;
                    }
                    if (StringExtensions.isNullOrWhitespace(manifest.publisher)) {
                        Commerce.RetailLogger.extensionsLoaderInvalidExtensionPackageDiscoveredNoPublisher(extensionPackageDefinition.Name);
                        return ExtensionPackageFailureReason.PublisherNullOrWhitespace;
                    }
                    if (StringExtensions.isNullOrWhitespace(manifest.name)) {
                        Commerce.RetailLogger.extensionsLoaderInvalidExtensionPackageDiscoveredNoName(extensionPackageDefinition.Name);
                        return ExtensionPackageFailureReason.NameNullOrWhitespace;
                    }
                    if (StringExtensions.isNullOrWhitespace(manifest.version) || !ExtensionsLoader.EXTENSION_VERSION_REGEX.test(manifest.version)) {
                        Commerce.RetailLogger.extensionsLoaderInvalidExtensionPackageDiscoveredInvalidVersion(extensionPackageDefinition.Name, manifest.version);
                        return ExtensionPackageFailureReason.InvalidExtensionPackageVersion;
                    }
                    if (Commerce.StringExtensions.isNullOrWhitespace(manifest.minimumPosVersion)
                        || !ExtensionsLoader.EXTENSION_VERSION_REGEX.test(manifest.minimumPosVersion)) {
                        Commerce.RetailLogger.extensionsLoaderInvalidExtensionPackageDiscoveredInvalidMinimumPosVersion(extensionPackageDefinition.Name, manifest.minimumPosVersion);
                        return ExtensionPackageFailureReason.InvalidMinimumPosVersion;
                    }
                    if (isIndependentPackagingEnabled) {
                        if (StringExtensions.isNullOrWhitespace(extensionPackageDefinition.Publisher)) {
                            return ExtensionPackageFailureReason.PublisherNullOrWhitespace;
                        }
                        else if (StringExtensions.compare(extensionPackageDefinition.Publisher, manifest.publisher, true) !== 0) {
                            Commerce.RetailLogger.extensionsLoaderInvalidExtensionPackageDiscoveredPublisherMismatch(extensionPackageDefinition.Name, manifest.publisher, extensionPackageDefinition.Publisher);
                            return ExtensionPackageFailureReason.PublisherMismatch;
                        }
                    }
                    Commerce.RetailLogger.extensionsLoaderValidManifestDiscovered(extensionPackageDefinition.Name);
                    return null;
                };
                ExtensionsLoader.prototype._isExtensionSupportedInCountryRegion = function (supportedCountryRegions, currentCountryRegion) {
                    if (ObjectExtensions.isNullOrUndefined(supportedCountryRegions)) {
                        return true;
                    }
                    if (StringExtensions.isNullOrWhitespace(currentCountryRegion)) {
                        return false;
                    }
                    return Commerce.ArrayExtensions.hasElement(supportedCountryRegions, currentCountryRegion, function (left, right) { return StringExtensions.compare(left, right, true) === 0; });
                };
                ExtensionsLoader.prototype._isVersionValid = function (minimumVersionStr, appVersionStr) {
                    var appVersion = appVersionStr.split(".");
                    var minimumVersion = minimumVersionStr.split(".");
                    var index = 0;
                    while (index < appVersion.length || index < minimumVersion.length) {
                        if (index < appVersion.length && index < minimumVersion.length) {
                            if (parseInt(appVersion[index], 10) < parseInt(minimumVersion[index], 10)) {
                                return false;
                            }
                            else if (parseInt(appVersion[index], 10) > parseInt(minimumVersion[index], 10)) {
                                return true;
                            }
                        }
                        else if (index < appVersion.length) {
                            if (parseInt(appVersion[index], 10) !== 0) {
                                return true;
                            }
                        }
                        else if (index < minimumVersion.length) {
                            if (parseInt(minimumVersion[index], 10) !== 0) {
                                return false;
                            }
                        }
                        index++;
                    }
                    return true;
                };
                ExtensionsLoader.prototype.invokeLoader = function (extensionPackage, nodeName) {
                    var data = extensionPackage.getExtensionConfigNode(nodeName);
                    if (!StringExtensions.isNullOrWhitespace(nodeName) &&
                        !ObjectExtensions.isNullOrUndefined(data)) {
                        var loaderInstance = this._allManifestLoadersMap[nodeName];
                        if (!ObjectExtensions.isNullOrUndefined(loaderInstance) &&
                            ObjectExtensions.isFunction(loaderInstance.load)) {
                            return loaderInstance.load(extensionPackage, data);
                        }
                        else {
                            Commerce.RetailLogger.extensionsLoaderManifestLoaderNotFound(nodeName, extensionPackage.packageInfo.name);
                        }
                    }
                    return Promise.resolve();
                };
                ExtensionsLoader.prototype._loadExtensionDependencies = function (extensionPackage) {
                    var extensionsDependencies = extensionPackage.extensionsDependencies;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var aliasMap = Object.create(null);
                    var duplicateAlias;
                    var areDependencyAliasesUnique = extensionsDependencies.every(function (extensionDependency) {
                        if (aliasMap[extensionDependency.alias]) {
                            duplicateAlias = extensionDependency.alias;
                            return false;
                        }
                        else {
                            aliasMap[extensionDependency.alias] = true;
                            return true;
                        }
                    });
                    if (!areDependencyAliasesUnique) {
                        Commerce.RetailLogger.extensionsLoaderExtensionPackageDuplicateDependencyAlias(extensionPackage.packageInfo.baseUrl, duplicateAlias, correlationId);
                        return ExtensionPackageFailureReason.DuplicateDependencyAlias;
                    }
                    var dependencyWithInvalidFormat;
                    var areDependencyFormatsSupported = extensionsDependencies.every(function (extensionDependency, index) {
                        var isValidDependency = Commerce.ArrayExtensions.hasElement(ExtensionsLoader.SUPPORTED_DEPENDENCY_FORMATS, extensionDependency.format);
                        if (!isValidDependency) {
                            dependencyWithInvalidFormat = extensionDependency;
                        }
                        return isValidDependency;
                    });
                    if (!areDependencyFormatsSupported) {
                        Commerce.RetailLogger.extensionsLoaderExtensionPackageInvalidDependencyFormat(extensionPackage.packageInfo.baseUrl, dependencyWithInvalidFormat.alias, dependencyWithInvalidFormat.format, correlationId);
                        return ExtensionPackageFailureReason.InvalidDependencyFormat;
                    }
                    this._configureExtensionPackageDependencies(extensionPackage.packageInfo.baseUrl, extensionsDependencies);
                    return null;
                };
                ExtensionsLoader.EXTENSION_VERSION_REGEX = /^[0-9]+\.[0-9]+(\.[0-9]+)*/;
                ExtensionsLoader.MANIFEST_FILE_NAME = "manifest.json";
                ExtensionsLoader.SUPPORTED_DEPENDENCY_FORMATS = ["amd"];
                return ExtensionsLoader;
            }());
            exports_14("default", ExtensionsLoader);
        }
    };
});
System.register("ManifestLoaders/ManifestLoaderBase", [], function (exports_15, context_15) {
    "use strict";
    var ManifestLoaderBase;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [],
        execute: function () {
            ManifestLoaderBase = (function () {
                function ManifestLoaderBase(loadModuleImpl) {
                    this._loadModuleImpl = loadModuleImpl;
                }
                ManifestLoaderBase.prototype.loadModule = function (baseUrl, relativePath) {
                    var modulePath = baseUrl + "/" + relativePath;
                    return this._loadModuleImpl(modulePath);
                };
                return ManifestLoaderBase;
            }());
            exports_15("default", ManifestLoaderBase);
        }
    };
});
System.register("ManifestLoaders/ControlsLoader", ["ManifestLoaders/ManifestLoaderBase", "Extension", "PosApi/TypeExtensions"], function (exports_16, context_16) {
    "use strict";
    var ManifestLoaderBase_1, Extension_2, ExtensionLoadError, ExtensionFailureReason, TypeExtensions_5, ControlsLoader;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (ManifestLoaderBase_1_1) {
                ManifestLoaderBase_1 = ManifestLoaderBase_1_1;
            },
            function (Extension_2_1) {
                Extension_2 = Extension_2_1;
            },
            function (TypeExtensions_5_1) {
                TypeExtensions_5 = TypeExtensions_5_1;
            }
        ],
        execute: function () {
            ExtensionLoadError = Commerce.Extensibility.ExtensionLoadError;
            ExtensionFailureReason = Commerce.Extensibility.ExtensionFailureReason;
            ControlsLoader = (function (_super) {
                __extends(ControlsLoader, _super);
                function ControlsLoader(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, loadModuleImpl) || this;
                    _this._createAndInsertHtmlImpl = createAndInsertHtmlImpl;
                    _this._renderHtmlImpl = renderHtmlImpl;
                    return _this;
                }
                ControlsLoader.prototype.load = function (extensionPackage, controls) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(controls)) {
                        return Promise.resolve();
                    }
                    if (controls.some(function (item) { return TypeExtensions_5.ObjectExtensions.isNullOrUndefined(item); })) {
                        Commerce.RetailLogger.extensibilityFrameworkControlManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    var loadSequence = Promise.resolve();
                    controls
                        .filter(function (item) { return !TypeExtensions_5.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (controlManifestItem) {
                        var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                        var controlManifestString = JSON.stringify(controlManifestItem);
                        Commerce.RetailLogger.extensibilityFrameworkControlsStarted(controlManifestString, correlationId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        loadSequence = loadSequence.then(function () {
                            var extensionPointName = "Control";
                            var extensionPointType;
                            var extensionName = Commerce.StringExtensions.isNullOrWhitespace(controlManifestItem.name)
                                ? Commerce.UrlHelper.extractFileNameWithoutExtension(controlManifestItem.modulePath)
                                : controlManifestItem.name;
                            var extensionModulePath = controlManifestItem.modulePath;
                            var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(controlManifestItem.description)
                                ? Commerce.StringResourceManager.getString("string_7467")
                                : controlManifestItem.description;
                            return Promise.resolve()
                                .then(function () {
                                if (Commerce.StringExtensions.isNullOrWhitespace(controlManifestItem.htmlPath)) {
                                    Commerce.RetailLogger.extensibilityFrameworkControlsOneOftheRequiredParametersMissing(controlManifestString, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    var extensionLoaderError = new ExtensionLoadError(ExtensionFailureReason.HtmlPathNullOrWhitespace);
                                    return Promise.reject(extensionLoaderError);
                                }
                                else {
                                    return Promise.resolve();
                                }
                            }).then(function () {
                                return _this._loadControlHtmlFragment(extensionPackage, controlManifestItem);
                            }).then(function () {
                                return _this._loadControlModule(extensionPackage, controlManifestItem);
                            }).then(function () {
                                Commerce.RetailLogger.extensibilityFrameworkControlsFinished(correlationId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                var extension = new Extension_2.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                                extensionPackage.addExtension(extension);
                            }, function (reason) {
                                var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                                var extension = new Extension_2.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                                extensionPackage.addExtension(extension);
                            });
                        });
                    });
                    return loadSequence;
                };
                ControlsLoader.prototype._loadControlHtmlFragment = function (extensionPackage, controlManifestItem) {
                    var htmlFragmentPath = extensionPackage.packageInfo.baseUrl + "/" + controlManifestItem.htmlPath;
                    var fragmentWrapper = this._createAndInsertHtmlImpl(encodeURIComponent(htmlFragmentPath));
                    if (Commerce.ObjectExtensions.isNullOrUndefined(fragmentWrapper)) {
                        var errorMessage = "Unable to create and insert html for extension control.";
                        Commerce.RetailLogger.extensibilityFrameworkUnableToCreateAndInsertHtmlFragmentForControl(errorMessage, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        throw new Error(errorMessage);
                    }
                    var renderHtmlPromise = this._renderHtmlImpl(htmlFragmentPath, fragmentWrapper).catch(function (error) {
                        fragmentWrapper.parentNode.removeChild(fragmentWrapper);
                        Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlFailedToRenderHtmlFragment(Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    });
                    return renderHtmlPromise.catch(function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlHtmlFragment(Commerce.ErrorHelper.serializeError(reason), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(reason);
                    });
                };
                ControlsLoader.prototype._loadControlModule = function (extensionPackage, controlManifestItem) {
                    if (Commerce.StringExtensions.isNullOrWhitespace(controlManifestItem.modulePath)) {
                        return Promise.resolve();
                    }
                    else {
                        return this.loadModule(extensionPackage.packageInfo.baseUrl, controlManifestItem.modulePath)
                            .then(function (controlType) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(controlType)) {
                                try {
                                    var controlContext = __assign(__assign({}, extensionPackage.context), extensionPackage.extensionControlFactoryContext);
                                    new controlType.default(controlContext);
                                    return Promise.resolve();
                                }
                                catch (ex) {
                                    Commerce.RetailLogger.extensibilityFrameworkControlsUnableToInitializeControlModule(Commerce.ErrorHelper.serializeError(ex), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    return Promise.reject(ex);
                                }
                            }
                            else {
                                Commerce.RetailLogger.extensibilityFrameworkControlsUnableToInitializeControlModule(JSON.stringify(controlManifestItem.modulePath), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                var loadError = new Error("Unable to initialize control module.");
                                return Promise.reject(loadError);
                            }
                        }).catch(function (reason) {
                            Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlModule(Commerce.ErrorHelper.serializeError(reason), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.reject(reason);
                        });
                    }
                };
                return ControlsLoader;
            }(ManifestLoaderBase_1.default));
            exports_16("default", ControlsLoader);
        }
    };
});
System.register("ManifestLoaders/DualDisplayExtensionsLoader", ["ManifestLoaders/ManifestLoaderBase", "DualDisplayExtensionsManager"], function (exports_17, context_17) {
    "use strict";
    var ManifestLoaderBase_2, DualDisplayExtensionsManager_1, DualDisplayExtensionsLoader;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (ManifestLoaderBase_2_1) {
                ManifestLoaderBase_2 = ManifestLoaderBase_2_1;
            },
            function (DualDisplayExtensionsManager_1_1) {
                DualDisplayExtensionsManager_1 = DualDisplayExtensionsManager_1_1;
            }
        ],
        execute: function () {
            DualDisplayExtensionsLoader = (function (_super) {
                __extends(DualDisplayExtensionsLoader, _super);
                function DualDisplayExtensionsLoader(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, loadModuleImpl) || this;
                    _this._dualDisplayExtensionsManager = new DualDisplayExtensionsManager_1.DualDisplayExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl);
                    return _this;
                }
                DualDisplayExtensionsLoader.prototype.load = function (extensionPackage, dualDisplayExtensions) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(dualDisplayExtensions)
                        || Commerce.ObjectExtensions.isNullOrUndefined(dualDisplayExtensions.customControl)) {
                        return Promise.resolve();
                    }
                    return this._dualDisplayExtensionsManager.loadAsync(extensionPackage, dualDisplayExtensions).then(function () {
                        return Promise.resolve();
                    });
                };
                return DualDisplayExtensionsLoader;
            }(ManifestLoaderBase_2.default));
            exports_17("default", DualDisplayExtensionsLoader);
        }
    };
});
System.register("ManifestLoaders/OperationsLoader", ["PosApi/Create/Operations", "Extension", "ManifestLoaders/ManifestLoaderBase", "PosApi/TypeExtensions"], function (exports_18, context_18) {
    "use strict";
    var Operations_1, Extension_3, ManifestLoaderBase_3, Extensibility, ExtensionPointType, TypeExtensions_6, OperationsLoader, ExtensionOperationMapper;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (Operations_1_1) {
                Operations_1 = Operations_1_1;
            },
            function (Extension_3_1) {
                Extension_3 = Extension_3_1;
            },
            function (ManifestLoaderBase_3_1) {
                ManifestLoaderBase_3 = ManifestLoaderBase_3_1;
            },
            function (TypeExtensions_6_1) {
                TypeExtensions_6 = TypeExtensions_6_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            ExtensionPointType = Commerce.Extensibility.ExtensionPointType;
            OperationsLoader = (function (_super) {
                __extends(OperationsLoader, _super);
                function OperationsLoader() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                OperationsLoader.prototype.load = function (extensionPackage, operations) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(operations)) {
                        return Promise.resolve();
                    }
                    if (operations.some(function (operation) { return Commerce.ObjectExtensions.isNullOrUndefined(operation); })) {
                        Commerce.RetailLogger.extensibilityFrameworkOperationManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    ExtensionOperationMapper.instance.initialize(extensionPackage.context);
                    var loadSequence = Promise.resolve();
                    operations
                        .filter(function (operation) { return !Commerce.ObjectExtensions.isNullOrUndefined(operation); })
                        .forEach(function (operationManifestItem) {
                        loadSequence = loadSequence.then(function () {
                            var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                            Commerce.RetailLogger.extensibilityFrameworkNewOperationManifestItemLoadingStarted(JSON.stringify(operationManifestItem), correlationId);
                            return _this.loadOperation(extensionPackage, operationManifestItem, correlationId).then(function () {
                                Commerce.RetailLogger.extensibilityFrameworkNewOperationManifestItemLoadingFinished(correlationId);
                            });
                        });
                    });
                    return loadSequence;
                };
                OperationsLoader.prototype.loadOperation = function (extensionPackage, operationManifestItem, correlationId) {
                    var _this = this;
                    var extensionPointName = "NewOperation";
                    var extensionPointType = ExtensionPointType.NewOperation;
                    var extensionName = TypeExtensions_6.StringExtensions.isNullOrWhitespace(operationManifestItem.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(operationManifestItem.operationRequestHandlerPath)
                        : operationManifestItem.name;
                    var extensionModulePath = operationManifestItem.operationRequestHandlerPath;
                    var extensionDescription = TypeExtensions_6.StringExtensions.isNullOrWhitespace(operationManifestItem.description)
                        ? Commerce.StringResourceManager.getString("string_7468")
                        : operationManifestItem.description;
                    return Promise.resolve().then(function () {
                        if ((operationManifestItem.operationId === Commerce.Proxy.Entities.RetailOperation.None)
                            || Commerce.StringExtensions.isNullOrWhitespace(operationManifestItem.operationRequestFactoryPath)
                            || Commerce.StringExtensions.isNullOrWhitespace(operationManifestItem.operationRequestHandlerPath)) {
                            Commerce.RetailLogger.extensibilityFrameworkInvalidNewOperationManifestItem(JSON.stringify(operationManifestItem), "IOperationManifestItem", correlationId);
                            var loadError = new Error("Invalid new operation manifest item");
                            return Promise.reject(loadError);
                        }
                        var requestFactoryModuleToAdd;
                        var operationModuleToAdd;
                        extensionPointName += TypeExtensions_6.StringExtensions.format(" - Id {0}", operationManifestItem.operationId);
                        var baseUrl = extensionPackage.packageInfo.baseUrl;
                        return _this.loadModule(baseUrl, operationManifestItem.operationRequestFactoryPath)
                            .then(function (requestFactoryModule) {
                            requestFactoryModuleToAdd = requestFactoryModule;
                        }).then(function () {
                            return _this.loadModule(extensionPackage.packageInfo.baseUrl, operationManifestItem.operationRequestHandlerPath);
                        }).then(function (operationModule) {
                            operationModuleToAdd = operationModule;
                        }).then(function () {
                            _this.addRequestFactory(requestFactoryModuleToAdd, operationManifestItem, correlationId);
                            return _this.addRequestHandler(extensionPackage, operationModuleToAdd, operationManifestItem, correlationId);
                        });
                    }).then(function () {
                        var extension = new Extension_3.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (error) {
                        Commerce.RetailLogger.extensibilityFrameworkErrorOccurredWhileLoadingNewOperationExtensions(Commerce.ErrorHelper.serializeError(error), correlationId);
                        var loadError = Commerce.ErrorHelper.toJavascriptError(error, correlationId);
                        var extension = new Extension_3.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                OperationsLoader.prototype.addRequestHandler = function (extensionPackage, operationModule, operationManifestItem, correlationId) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(operationModule) &&
                        !Commerce.ObjectExtensions.isNullOrUndefined(operationModule.default)) {
                        if (operationModule.default.prototype instanceof Operations_1.ExtensionOperationRequestHandlerBase) {
                            var request = new Commerce.RegisterRequestHandlersRequest(correlationId);
                            request.requestHandlerTypesAndOptions.push({
                                type: operationModule.default,
                                options: __assign({}, extensionPackage.context)
                            });
                            return extensionPackage.context.runtime.executeAsync(request).then(function () {
                                Commerce.RetailLogger.extensibilityFrameworkNewOperationRequestHandlerAddedSuccessfully(operationManifestItem.operationId, operationManifestItem.operationRequestHandlerPath, correlationId);
                            });
                        }
                        else {
                            Commerce.RetailLogger.extensibilityFrameworkTypeMismatchWhileLoadingNewOperationExtensions(operationManifestItem.operationRequestHandlerPath, "ExtensionOperationRequestHandlerBase", correlationId);
                            var loadError = new Error("Type mismatch while loading new operation extensions.");
                            return Promise.reject(loadError);
                        }
                    }
                    else {
                        Commerce.RetailLogger.extensibilityFrameworkErrorOccurredWhileLoadingNewOperationExtensions(operationManifestItem.operationRequestHandlerPath, correlationId);
                        return Promise.reject(operationManifestItem.operationRequestHandlerPath);
                    }
                };
                OperationsLoader.prototype.addRequestFactory = function (requestFactoryModule, operationManifestItem, correlationId) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(requestFactoryModule) &&
                        !Commerce.ObjectExtensions.isNullOrUndefined(requestFactoryModule.default)) {
                        if (Commerce.ObjectExtensions.isFunction(requestFactoryModule.default)) {
                            var factoryAdded = ExtensionOperationMapper.instance.addRequestFactory(requestFactoryModule.default, operationManifestItem.operationId);
                            if (factoryAdded) {
                                Commerce.RetailLogger.extensibilityFrameworkNewOperationRequestFactoryAddedSuccessfully(operationManifestItem.operationId, operationManifestItem.operationRequestFactoryPath, correlationId);
                            }
                            else {
                                Commerce.RetailLogger.extensibilityFrameworkDuplicateNewOperationManifestItem(operationManifestItem.operationId, JSON.stringify(operationManifestItem), correlationId);
                            }
                        }
                        else {
                            Commerce.RetailLogger.extensibilityFrameworkTypeMismatchWhileLoadingNewOperationExtensions(operationManifestItem.operationRequestFactoryPath, "ExtensionOperationRequestFactoryFunctionType", correlationId);
                        }
                    }
                    else {
                        Commerce.RetailLogger.extensibilityFrameworkErrorOccurredWhileLoadingNewOperationExtensions(operationManifestItem.operationRequestHandlerPath, correlationId);
                    }
                };
                return OperationsLoader;
            }(ManifestLoaderBase_3.default));
            exports_18("default", OperationsLoader);
            ExtensionOperationMapper = (function () {
                function ExtensionOperationMapper() {
                    this._requestFactoryMap = Object.create(null);
                }
                Object.defineProperty(ExtensionOperationMapper, "instance", {
                    get: function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(ExtensionOperationMapper._instance)) {
                            ExtensionOperationMapper._instance = new ExtensionOperationMapper();
                            Extensibility.SetExtensionOperationProviderInstance(ExtensionOperationMapper._instance);
                        }
                        return ExtensionOperationMapper._instance;
                    },
                    enumerable: true,
                    configurable: true
                });
                ExtensionOperationMapper.prototype.initialize = function (context) {
                    this._context = context;
                };
                ExtensionOperationMapper.prototype.addRequestFactory = function (requestFactory, operationId) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._requestFactoryMap[operationId])) {
                        this._requestFactoryMap[operationId] = requestFactory;
                        return true;
                    }
                    return false;
                };
                ExtensionOperationMapper.prototype.getOperationRequest = function (operationId, actionParameters, correlationId) {
                    var requestFactory = this._requestFactoryMap[operationId];
                    if (Commerce.ObjectExtensions.isFunction(requestFactory)) {
                        return requestFactory(this._context, operationId, actionParameters, correlationId);
                    }
                    return null;
                };
                ExtensionOperationMapper.prototype.operationRequestExists = function (operationId) {
                    return Commerce.ObjectExtensions.isFunction(this._requestFactoryMap[operationId]);
                };
                ExtensionOperationMapper._instance = null;
                return ExtensionOperationMapper;
            }());
        }
    };
});
System.register("ManifestLoaders/RequestHandlerExtensionsLoader", ["ManifestLoaders/ManifestLoaderBase", "PosApi/Extend/RequestHandlers/RequestHandlers", "Extension"], function (exports_19, context_19) {
    "use strict";
    var ManifestLoaderBase_4, RequestHandlers_1, Extension_4, ExtensionPointType, RequestHandlerExtensionsLoader;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (ManifestLoaderBase_4_1) {
                ManifestLoaderBase_4 = ManifestLoaderBase_4_1;
            },
            function (RequestHandlers_1_1) {
                RequestHandlers_1 = RequestHandlers_1_1;
            },
            function (Extension_4_1) {
                Extension_4 = Extension_4_1;
            }
        ],
        execute: function () {
            ExtensionPointType = Commerce.Extensibility.ExtensionPointType;
            RequestHandlerExtensionsLoader = (function (_super) {
                __extends(RequestHandlerExtensionsLoader, _super);
                function RequestHandlerExtensionsLoader() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                RequestHandlerExtensionsLoader.prototype.load = function (extensionPackage, handlers) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(handlers)) {
                        return Promise.resolve();
                    }
                    if (handlers.some(function (handler) { return Commerce.ObjectExtensions.isNullOrUndefined(handler); })) {
                        Commerce.RetailLogger.extensibilityFrameworkRequestHandlerExtensionManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    var allHandlersPromise = Promise.resolve();
                    handlers
                        .filter(function (handler) { return !Commerce.ObjectExtensions.isNullOrUndefined(handler); })
                        .forEach(function (handler) {
                        allHandlersPromise = allHandlersPromise.then(function () {
                            var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                            return _this._loadHandler(extensionPackage, handler, correlationId);
                        });
                    });
                    return allHandlersPromise;
                };
                RequestHandlerExtensionsLoader.prototype._loadHandler = function (extensionPackage, handler, correlationId) {
                    var _this = this;
                    var extensionPointName = "ReplacementRequestHandler";
                    var extensionPointType = ExtensionPointType.ReplacementRequestHandler;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(handler.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(handler.modulePath)
                        : handler.name;
                    var extensionModulePath = handler.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(handler.description)
                        ? Commerce.StringResourceManager.getString("string_7469")
                        : handler.description;
                    return this.loadModule(extensionPackage.packageInfo.baseUrl, extensionModulePath)
                        .then(function (handlerModule) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(handlerModule.default)) {
                            Commerce.RetailLogger.extensibilityFrameworkInvalidModuleWhileLoadingRequestHandlerExtensions(extensionModulePath, correlationId);
                            var loadError = new Error("Invalid module.");
                            return Promise.reject(loadError);
                        }
                        else if (!(handlerModule.default.prototype instanceof RequestHandlers_1.ReplacementRequestHandlerBase)) {
                            Commerce.RetailLogger.extensibilityFrameworkTypeMismatchWhileLoadingRequestHandlerExtensions(extensionModulePath, "ReplacementRequestHandlerBase", correlationId);
                            var loadError = new Error("Replacement request handler does not inherit from ReplacementRequestHandlerBase.");
                            return Promise.reject(loadError);
                        }
                        var request = new Commerce.RegisterRequestHandlersRequest(correlationId);
                        request.requestHandlerTypesAndOptions.push({ type: handlerModule.default, options: __assign({}, extensionPackage.context) });
                        return extensionPackage.context.runtime.executeAsync(request).then(function (response) {
                            if (!response.canceled) {
                                if (Commerce.ObjectExtensions.isFunction(response.data.defaultExecuteAsyncs[0])) {
                                    var replacementRequestHandlerPrototype = request.requestHandlerTypesAndOptions[0].type.prototype;
                                    replacementRequestHandlerPrototype.defaultExecuteAsync = response.data.defaultExecuteAsyncs[0];
                                }
                                var requestTypeName = _this._getRequestTypeName(request.requestHandlerTypesAndOptions[0]);
                                Commerce.RetailLogger.extensibilityFrameworkRequestHandlerExtensionSuccessfullyRegistered(extensionModulePath, requestTypeName, correlationId);
                                extensionPointName = _this._getNewRequestHandlerExtensionPointName(requestTypeName);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.extensibilityFrameworkRequestHandlerExtensionFailedToRegister(extensionModulePath, Commerce.StringExtensions.EMPTY, correlationId);
                                var loadError = new Commerce.Extensibility.ExtensionLoadError(Commerce.Extensibility.ExtensionFailureReason.Unknown);
                                return Promise.reject(loadError);
                            }
                        });
                    }).then(function () {
                        var extension = new Extension_4.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkRequestHandlerExtensionFailedToRegister(extensionModulePath, Commerce.ErrorHelper.serializeError(reason), correlationId);
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_4.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                RequestHandlerExtensionsLoader.prototype._getRequestTypeName = function (requestHandlerTypeAndOptions) {
                    var requestHandlerType = requestHandlerTypeAndOptions.type;
                    var requestType = new requestHandlerType(requestHandlerTypeAndOptions.options).supportedRequestType();
                    return Commerce.PrototypeHelper.getPrototypeChainTypeName(requestType.prototype);
                };
                RequestHandlerExtensionsLoader.prototype._getNewRequestHandlerExtensionPointName = function (requestTypeName) {
                    var extensionPointName = "ReplacementRequestHandler";
                    var functionName = "Undefined";
                    if (!Commerce.StringExtensions.isNullOrWhitespace(requestTypeName)) {
                        var lastDotIndex = requestTypeName.lastIndexOf(".");
                        if (lastDotIndex === -1) {
                            functionName = requestTypeName;
                        }
                        else {
                            functionName = requestTypeName.substring(lastDotIndex + 1);
                        }
                    }
                    return extensionPointName + " - " + functionName;
                };
                return RequestHandlerExtensionsLoader;
            }(ManifestLoaderBase_4.default));
            exports_19("default", RequestHandlerExtensionsLoader);
        }
    };
});
System.register("ManifestLoaders/RequestHandlersLoader", ["PosApi/Create/RequestHandlers", "Extension", "ManifestLoaders/ManifestLoaderBase"], function (exports_20, context_20) {
    "use strict";
    var RequestHandlers_2, Extension_5, ManifestLoaderBase_5, ExtensionPointType, RequestHandlersLoader;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (RequestHandlers_2_1) {
                RequestHandlers_2 = RequestHandlers_2_1;
            },
            function (Extension_5_1) {
                Extension_5 = Extension_5_1;
            },
            function (ManifestLoaderBase_5_1) {
                ManifestLoaderBase_5 = ManifestLoaderBase_5_1;
            }
        ],
        execute: function () {
            ExtensionPointType = Commerce.Extensibility.ExtensionPointType;
            RequestHandlersLoader = (function (_super) {
                __extends(RequestHandlersLoader, _super);
                function RequestHandlersLoader() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                RequestHandlersLoader.prototype.load = function (extensionPackage, handlers) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(handlers)) {
                        return Promise.resolve();
                    }
                    if (handlers.some(function (handler) { return Commerce.ObjectExtensions.isNullOrUndefined(handler); })) {
                        Commerce.RetailLogger.extensibilityFrameworkRequestHandlerManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    var allHandlersPromise = Promise.resolve();
                    handlers
                        .filter(function (handler) { return !Commerce.ObjectExtensions.isNullOrUndefined(handler); })
                        .forEach(function (handler) {
                        allHandlersPromise = allHandlersPromise.then(function () {
                            var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                            return _this._loadHandler(extensionPackage, handler, correlationId);
                        });
                    });
                    return allHandlersPromise;
                };
                RequestHandlersLoader.prototype._loadHandler = function (extensionPackage, handler, correlationId) {
                    var extensionPointName = "NewRequestHandler";
                    var extensionPointType = ExtensionPointType.NewRequestHandler;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(handler.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(handler.modulePath)
                        : handler.name;
                    var extensionModulePath = handler.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(handler.description)
                        ? Commerce.StringResourceManager.getString("string_7470")
                        : handler.description;
                    return this.loadModule(extensionPackage.packageInfo.baseUrl, extensionModulePath)
                        .then(function (handlerModule) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(handlerModule.default)) {
                            Commerce.RetailLogger.extensibilityFrameworkInvalidModuleWhileLoadingRequestHandlers(extensionModulePath, correlationId);
                            var loadError = new Error("Invalid module");
                            return Promise.reject(loadError);
                        }
                        else if (!(handlerModule.default.prototype instanceof RequestHandlers_2.ExtensionRequestHandlerBase)) {
                            Commerce.RetailLogger.extensibilityFrameworkTypeMismatchWhileLoadingRequestHandlers(extensionModulePath, "ExtensionRequestHandlerBase", correlationId);
                            var loadError = new Error("New request handler does not inherit from ExtensionRequestHandlerBase.");
                            return Promise.reject(loadError);
                        }
                        var request = new Commerce.RegisterRequestHandlersRequest(correlationId);
                        request.requestHandlerTypesAndOptions.push({ type: handlerModule.default, options: __assign({}, extensionPackage.context) });
                        return extensionPackage.context.runtime.executeAsync(request).then(function () {
                            Commerce.RetailLogger.extensibilityFrameworkRequestHandlerSuccessfullyRegistered(extensionModulePath, correlationId);
                        });
                    }).then(function () {
                        var extension = new Extension_5.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkRequestHandlerFailedToRegistered(extensionModulePath, Commerce.ErrorHelper.serializeError(reason), correlationId);
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_5.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                return RequestHandlersLoader;
            }(ManifestLoaderBase_5.default));
            exports_20("default", RequestHandlersLoader);
        }
    };
});
System.register("ManifestLoaders/ResourcesLoader", ["Resources/ExtensionCultureManager", "ManifestLoaders/ManifestLoaderBase", "Extension"], function (exports_21, context_21) {
    "use strict";
    var ExtensionCultureManager_2, ManifestLoaderBase_6, Extension_6, ResourcesLoader;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (ExtensionCultureManager_2_1) {
                ExtensionCultureManager_2 = ExtensionCultureManager_2_1;
            },
            function (ManifestLoaderBase_6_1) {
                ManifestLoaderBase_6 = ManifestLoaderBase_6_1;
            },
            function (Extension_6_1) {
                Extension_6 = Extension_6_1;
            }
        ],
        execute: function () {
            ResourcesLoader = (function (_super) {
                __extends(ResourcesLoader, _super);
                function ResourcesLoader(loadModuleImpl, loadJsonImpl, addCultureInfoImpl) {
                    var _this = _super.call(this, loadModuleImpl) || this;
                    _this._loadJsonImpl = loadJsonImpl;
                    _this._addCultureInfoImpl = addCultureInfoImpl;
                    return _this;
                }
                ResourcesLoader.prototype.load = function (extensionPackage, resourcesManifestItem) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(resourcesManifestItem)) {
                        Commerce.RetailLogger.extensibilityFrameworkResourcesManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.resolve();
                    }
                    if (Commerce.StringExtensions.isNullOrWhitespace(resourcesManifestItem.fallbackUICulture)) {
                        throw "'fallbackUICulture' is required for 'resources' manfiest item";
                    }
                    else if (Commerce.StringExtensions.isNullOrWhitespace(resourcesManifestItem.culturesDirectoryPath)) {
                        throw "'culturesDirectoryPath' is required for 'resources' manfiest item";
                    }
                    else if (Commerce.StringExtensions.isNullOrWhitespace(resourcesManifestItem.stringResourcesFileName)) {
                        throw "'stringResourcesFileName' is required for 'resources' manfiest item";
                    }
                    resourcesManifestItem.supportedUICultures = resourcesManifestItem.supportedUICultures || [];
                    var extensionPointName = "Resources";
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.Resources;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(resourcesManifestItem.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(resourcesManifestItem.stringResourcesFileName)
                        : resourcesManifestItem.name;
                    var extensionModulePath = resourcesManifestItem.culturesDirectoryPath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(resourcesManifestItem.description)
                        ? Commerce.StringResourceManager.getString("string_7471")
                        : resourcesManifestItem.description;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    return ExtensionCultureManager_2.ExtensionCultureManager.instance.createResourceManager(extensionPackage, resourcesManifestItem)
                        .then(function () {
                        return _this._loadCultureInfoOverrides(extensionPackage, resourcesManifestItem, correlationId);
                    }).then(function () {
                        var extension = new Extension_6.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_6.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ResourcesLoader.prototype._loadCultureInfoOverrides = function (extensionPackage, resourcesManifestItem, correlationId) {
                    var _this = this;
                    if (Commerce.StringExtensions.isNullOrWhitespace(resourcesManifestItem.cultureInfoOverridesFilePath)) {
                        return Promise.resolve();
                    }
                    var cultureInfoOverridesFullPath = extensionPackage.packageInfo.baseUrl + "/" + resourcesManifestItem.cultureInfoOverridesFilePath;
                    return this._loadJsonImpl(cultureInfoOverridesFullPath)
                        .then(function (cultureInfoOverrides) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(cultureInfoOverrides) ||
                            !Commerce.ArrayExtensions.hasElements(cultureInfoOverrides.overrides)) {
                            Commerce.RetailLogger.extensibilityFrameworkResourcesLoaderInvalidCultureInfoOverridesJson(cultureInfoOverridesFullPath, JSON.stringify(cultureInfoOverrides));
                            return Promise.resolve();
                        }
                        for (var i = 0; i < cultureInfoOverrides.overrides.length; i++) {
                            var currentOverride = cultureInfoOverrides.overrides[i];
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(currentOverride) &&
                                !Commerce.StringExtensions.isNullOrWhitespace(currentOverride.culture) &&
                                !Commerce.ObjectExtensions.isNullOrUndefined(currentOverride.cultureInfo)) {
                                _this._addCultureInfoImpl(currentOverride.culture.toLowerCase(), "default", currentOverride.cultureInfo);
                                Commerce.RetailLogger.extensibilityFrameworkResourcesLoaderCultureInfoOverrideLoadedSuccessfully(cultureInfoOverridesFullPath, JSON.stringify(currentOverride));
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.extensibilityFrameworkResourcesLoaderInvalidCultureInfoOverride(cultureInfoOverridesFullPath, JSON.stringify(currentOverride));
                                return Promise.reject("Invalid culture info override");
                            }
                        }
                        return Promise.resolve();
                    }).catch(function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkResourcesLoaderErrorLoadingCultureInfoOverrides(Commerce.ErrorHelper.serializeError(reason), cultureInfoOverridesFullPath);
                        return Promise.reject(reason);
                    });
                };
                return ResourcesLoader;
            }(ManifestLoaderBase_6.default));
            exports_21("default", ResourcesLoader);
        }
    };
});
System.register("ManifestLoaders/TemplatedDialogsLoader", ["ManifestLoaders/ManifestLoaderBase", "Extension"], function (exports_22, context_22) {
    "use strict";
    var ManifestLoaderBase_7, Extension_7, ExtensionPointType, TemplatedDialogsLoaderLoader;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (ManifestLoaderBase_7_1) {
                ManifestLoaderBase_7 = ManifestLoaderBase_7_1;
            },
            function (Extension_7_1) {
                Extension_7 = Extension_7_1;
            }
        ],
        execute: function () {
            ExtensionPointType = Commerce.Extensibility.ExtensionPointType;
            TemplatedDialogsLoaderLoader = (function (_super) {
                __extends(TemplatedDialogsLoaderLoader, _super);
                function TemplatedDialogsLoaderLoader(loadModuleImpl, cacheHtmlFragmentImpl, createTemplatedDialogProxyImpl) {
                    var _this = _super.call(this, loadModuleImpl) || this;
                    _this._cacheHtmlFragmentImpl = cacheHtmlFragmentImpl;
                    _this._createTemplatedDialogProxyImpl = createTemplatedDialogProxyImpl;
                    return _this;
                }
                TemplatedDialogsLoaderLoader.prototype.load = function (extensionPackage, manifestItems) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(manifestItems)) {
                        return Promise.resolve();
                    }
                    if (manifestItems.some(function (item) { return Commerce.ObjectExtensions.isNullOrUndefined(item); })) {
                        Commerce.RetailLogger.extensibilityFrameworkTemplatedDialogManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    var loadSequence = Promise.resolve();
                    manifestItems
                        .filter(function (item) { return !Commerce.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (manifestItem) {
                        var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                        var manifestItemString = JSON.stringify(manifestItem);
                        Commerce.RetailLogger.extensibilityFrameworkTemplatedDialogsStarted(manifestItemString, correlationId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.htmlPath) &&
                            Commerce.StringExtensions.isNullOrWhitespace(manifestItem.modulePath)) {
                            Commerce.RetailLogger.extensibilityFrameworkTemplatedDialogsOneOftheRequiredParametersMissing(manifestItemString, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return;
                        }
                        var htmlFragmentPath = extensionPackage.packageInfo.baseUrl + "/" + manifestItem.htmlPath;
                        var extensionPointName = "TemplatedDialog";
                        var extensionPointType = ExtensionPointType.TemplatedDialog;
                        var extensionName = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.name)
                            ? Commerce.UrlHelper.extractFileNameWithoutExtension(manifestItem.modulePath)
                            : manifestItem.name;
                        var extensionModulePath = manifestItem.modulePath;
                        var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.description)
                            ? Commerce.StringResourceManager.getString("string_7472")
                            : manifestItem.description;
                        loadSequence = loadSequence.then(function () {
                            return _this._loadHtmlFragment(extensionPackage, manifestItem, htmlFragmentPath)
                                .then(function () {
                                return _this._loadModule(extensionPackage, manifestItem, htmlFragmentPath);
                            }).then(function () {
                                Commerce.RetailLogger.extensibilityFrameworkControlsFinished(correlationId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                var extension = new Extension_7.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                                extensionPackage.addExtension(extension);
                            }, function (reason) {
                                var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                                var extension = new Extension_7.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                                extensionPackage.addExtension(extension);
                            });
                        });
                    });
                    return loadSequence;
                };
                TemplatedDialogsLoaderLoader.prototype._loadHtmlFragment = function (extensionPackage, manifestItem, htmlFragmentPath) {
                    var _this = this;
                    var loadSequence = Promise.resolve();
                    if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.htmlPath)) {
                        loadSequence.then(function () { return Promise.reject("TemplatedDialogsLoaderLoader: Html fragment is required for TemplatedDialog."); });
                    }
                    else {
                        loadSequence.then(function () {
                            return _this._cacheHtmlFragmentImpl(htmlFragmentPath).catch(function (reason) {
                                Commerce.RetailLogger.extensibilityFrameworkTemplatedDialogsUnableToLoadControlHtmlFragment(Commerce.ErrorHelper.serializeError(reason), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject(reason);
                            });
                        });
                    }
                    return loadSequence.catch(function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkTemplatedDialogsUnableToLoadControlHtmlFragment(Commerce.ErrorHelper.serializeError(reason), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(reason);
                    });
                };
                TemplatedDialogsLoaderLoader.prototype._loadModule = function (extensionPackage, manifestItem, htmlFragmentPath) {
                    var _this = this;
                    var loadSequence = Promise.resolve();
                    if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.modulePath)) {
                        loadSequence.then(function () { return Promise.resolve(); });
                    }
                    else {
                        loadSequence.then(function () {
                            return _this.loadModule(extensionPackage.packageInfo.baseUrl, manifestItem.modulePath);
                        }).then(function (moduleType) {
                            if (Commerce.ObjectExtensions.isNullOrUndefined(moduleType) ||
                                Commerce.ObjectExtensions.isNullOrUndefined(moduleType.default)) {
                                Commerce.RetailLogger.extensibilityFrameworkControlsUnableToInitializeControlModule(manifestItem.modulePath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject("Unable to initialize control module");
                            }
                            try {
                                var templatedDialogContext = __assign(__assign({}, extensionPackage.context), extensionPackage.extensionControlFactoryContext);
                                moduleType.default.prototype._templatedDialogContext = templatedDialogContext;
                                moduleType.default.prototype._createTemplatedDialogProxyControl
                                    = function (dialog) {
                                        return _this._createTemplatedDialogProxyImpl(htmlFragmentPath, dialog);
                                    };
                                return Promise.resolve();
                            }
                            catch (ex) {
                                Commerce.RetailLogger.extensibilityFrameworkControlsUnableToInitializeControlModule(Commerce.ErrorHelper.serializeError(ex), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject(ex);
                            }
                        });
                    }
                    return loadSequence.catch(function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkTemplatedDialogsUnableToLoadControlModule(Commerce.ErrorHelper.serializeError(reason), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(reason);
                    });
                };
                return TemplatedDialogsLoaderLoader;
            }(ManifestLoaderBase_7.default));
            exports_22("default", TemplatedDialogsLoaderLoader);
        }
    };
});
System.register("ManifestLoaders/TriggerHandlersLoader", ["PosApi/Extend/Triggers/Triggers", "Extension", "ManifestLoaders/ManifestLoaderBase"], function (exports_23, context_23) {
    "use strict";
    var Triggers, Extension_8, ManifestLoaderBase_8, TriggersLoader;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (Triggers_1) {
                Triggers = Triggers_1;
            },
            function (Extension_8_1) {
                Extension_8 = Extension_8_1;
            },
            function (ManifestLoaderBase_8_1) {
                ManifestLoaderBase_8 = ManifestLoaderBase_8_1;
            }
        ],
        execute: function () {
            TriggersLoader = (function (_super) {
                __extends(TriggersLoader, _super);
                function TriggersLoader(loadModuleImpl) {
                    var _this = _super.call(this, loadModuleImpl) || this;
                    _this._cancelableTriggerTypes = Object.create(null);
                    _this._nonCancelableTriggerTypes = Object.create(null);
                    Object.keys(Commerce.Triggers.CancelableTriggerType).forEach(function (key) {
                        var value = Commerce.Triggers.CancelableTriggerType[key];
                        if (value instanceof Commerce.Triggers.CancelableTriggerTypeValue) {
                            _this._cancelableTriggerTypes[key.toLowerCase()] = value;
                        }
                    });
                    Object.keys(Commerce.Triggers.NonCancelableTriggerType).forEach(function (key) {
                        var value = Commerce.Triggers.NonCancelableTriggerType[key];
                        if (value instanceof Commerce.Triggers.NonCancelableTriggerTypeValue) {
                            _this._nonCancelableTriggerTypes[key.toLowerCase()] = value;
                        }
                    });
                    return _this;
                }
                TriggersLoader.prototype.load = function (extensionPackage, manifestItems) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(manifestItems)) {
                        return Promise.resolve();
                    }
                    if (manifestItems.some(function (item) { return Commerce.ObjectExtensions.isNullOrUndefined(item); })) {
                        Commerce.RetailLogger.extensibilityFrameworkTriggerManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    var loadSequence = Promise.resolve();
                    manifestItems
                        .filter(function (item) { return !Commerce.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (manifestItem) {
                        loadSequence = loadSequence.then(function () {
                            return _this._loadTrigger(manifestItem, extensionPackage);
                        });
                    });
                    return loadSequence;
                };
                TriggersLoader.prototype._loadTrigger = function (manifestItem, extensionPackage) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "Trigger";
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.Trigger;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(manifestItem.modulePath)
                        : manifestItem.name;
                    var extensionModulePath = manifestItem.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.description)
                        ? Commerce.StringResourceManager.getString("string_7473")
                        : manifestItem.description;
                    return Promise.resolve().then(function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(manifestItem) || Commerce.StringExtensions.isNullOrWhitespace(manifestItem.triggerType)) {
                            Commerce.RetailLogger.triggerHandlersLoaderTriggerLoadFailedTriggerTypeNotSet(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.reject("Loading trigger handler failed because the trigger type is not set.");
                        }
                        var triggerTypeId = manifestItem.triggerType.toLowerCase();
                        var CORRELATION_ID = Commerce.LoggerHelper.getNewCorrelationId();
                        Commerce.RetailLogger.triggerHandlersLoaderTriggerLoadStarted(triggerTypeId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version, CORRELATION_ID);
                        extensionPointName += " - " + manifestItem.triggerType;
                        var triggerTypeInstance;
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(_this._nonCancelableTriggerTypes[triggerTypeId])) {
                            triggerTypeInstance = _this._nonCancelableTriggerTypes[triggerTypeId];
                        }
                        else if (!Commerce.ObjectExtensions.isNullOrUndefined(_this._cancelableTriggerTypes[triggerTypeId])) {
                            triggerTypeInstance = _this._cancelableTriggerTypes[triggerTypeId];
                        }
                        else {
                            Commerce.RetailLogger.triggerHandlersLoaderTriggerLoadFailedDueToInvalidTriggerType(triggerTypeId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version, CORRELATION_ID);
                            return Promise.reject("Loading trigger handler failed because of invalid trigger type.");
                        }
                        return _this.loadModule(extensionPackage.packageInfo.baseUrl, manifestItem.modulePath)
                            .then(function (triggerModule) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(triggerModule) &&
                                !Commerce.ObjectExtensions.isNullOrUndefined(triggerModule.default)) {
                                var expectedBaseClassType = void 0;
                                if (triggerTypeInstance instanceof Commerce.Triggers.NonCancelableTriggerTypeValue) {
                                    expectedBaseClassType = Triggers.NonCancelableTriggerBase;
                                }
                                else {
                                    expectedBaseClassType = Triggers.CancelableTriggerBase;
                                }
                                if (triggerModule.default.prototype instanceof expectedBaseClassType) {
                                    var triggerInstance = new triggerModule.default(extensionPackage.context);
                                    var triggerDetals = {
                                        trigger: triggerInstance,
                                        name: manifestItem.modulePath,
                                        version: extensionPackage.packageInfo.version,
                                        publisher: extensionPackage.packageInfo.publisher
                                    };
                                    Commerce.Triggers.TriggerManager.instance.register(triggerTypeInstance, triggerDetals);
                                    Commerce.RetailLogger.triggerHandlersLoaderTriggerRegistered(triggerTypeInstance.toString(), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version, CORRELATION_ID);
                                    return Promise.resolve();
                                }
                                else {
                                    Commerce.RetailLogger.triggerHandlersLoaderTriggerLoadFailedDueToInvalidTriggerImplementation(triggerTypeId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version, CORRELATION_ID);
                                    return Promise.reject("Loading trigger handler failed because of invalid trigger implementation.");
                                }
                            }
                            else {
                                Commerce.RetailLogger.triggerHandlersLoaderTriggerLoadFailedDueToInvalidTriggerImplementation(triggerTypeId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version, CORRELATION_ID);
                                return Promise.reject("Loading trigger handler failed because of invalid trigger implementation.");
                            }
                        }, function (error) {
                            Commerce.RetailLogger.triggerHandlersLoaderTriggerLoadFailedDueToErrorImportingTriggerModule(triggerTypeId, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, manifestItem.modulePath, Commerce.ErrorHelper.serializeError(error), CORRELATION_ID);
                            return Promise.reject(error);
                        });
                    }).then(function () {
                        var extension = new Extension_8.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_8.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                return TriggersLoader;
            }(ManifestLoaderBase_8.default));
            exports_23("default", TriggersLoader);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase", ["PosApi/Extend/Views/AppBarCommands", "PosApi/Extend/Views/CustomControls", "PosApi/Extend/Views/CustomGridColumns", "PosApi/Extend/Views/CustomGridItemSubfield", "PosApi/Extend/Views/CustomSearchFilters", "PosApi/Extend/Views/CustomSortColumnDefinitions", "PosApi/Extend/Views/MenuCommands", "PosApi/Extend/Views/ViewControllers", "PosApi/TypeExtensions", "Extension"], function (exports_24, context_24) {
    "use strict";
    var AppBarCommands_1, CustomControls_1, CustomGridColumns_1, CustomGridItemSubfield_1, CustomSearchFilters_1, CustomSortColumnDefinitions_1, MenuCommands_1, ViewControllers_1, TypeExtensions_7, Extension_9, Extensibility, ExtensionPointType, Messaging, ViewExtensionsManagerBase;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (AppBarCommands_1_1) {
                AppBarCommands_1 = AppBarCommands_1_1;
            },
            function (CustomControls_1_1) {
                CustomControls_1 = CustomControls_1_1;
            },
            function (CustomGridColumns_1_1) {
                CustomGridColumns_1 = CustomGridColumns_1_1;
            },
            function (CustomGridItemSubfield_1_1) {
                CustomGridItemSubfield_1 = CustomGridItemSubfield_1_1;
            },
            function (CustomSearchFilters_1_1) {
                CustomSearchFilters_1 = CustomSearchFilters_1_1;
            },
            function (CustomSortColumnDefinitions_1_1) {
                CustomSortColumnDefinitions_1 = CustomSortColumnDefinitions_1_1;
            },
            function (MenuCommands_1_1) {
                MenuCommands_1 = MenuCommands_1_1;
            },
            function (ViewControllers_1_1) {
                ViewControllers_1 = ViewControllers_1_1;
            },
            function (TypeExtensions_7_1) {
                TypeExtensions_7 = TypeExtensions_7_1;
            },
            function (Extension_9_1) {
                Extension_9 = Extension_9_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            ExtensionPointType = Commerce.Extensibility.ExtensionPointType;
            Messaging = Commerce.Messaging;
            ViewExtensionsManagerBase = (function () {
                function ViewExtensionsManagerBase(viewName, loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    this.viewName = viewName;
                    this._appBarCommandsByAppBarName = Object.create(null);
                    this._menuCommandsByMenuName = Object.create(null);
                    this._customColumnSetCreatorsByListName = Object.create(null);
                    this._viewControllerDetails = [];
                    this._customControls = [];
                    this._searchFilterDetails = [];
                    this._customGridColumnsMap = Object.create(null);
                    this._customGridItemSubfieldsMap = Object.create(null);
                    this.loadModuleImpl = loadModuleImpl;
                    this._createAndInsertHtmlImpl = createAndInsertHtmlImpl;
                    this._renderHtmlImpl = renderHtmlImpl;
                    this._customSortColumnDefinitions = [];
                }
                ViewExtensionsManagerBase.prototype.getCustomControlId = function (controlName, publisherName, packageName) {
                    return Commerce.StringExtensions.format(ViewExtensionsManagerBase.CUSTOM_CONTROL_ID_FORMAT_STRING, this.viewName, publisherName, packageName, controlName);
                };
                ViewExtensionsManagerBase.prototype._loadAppBarCommands = function (extensionPackage, appBarCommands, targetAppBar) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(appBarCommands)) {
                        return Promise.resolve();
                    }
                    if (appBarCommands.some(function (item) { return Commerce.ObjectExtensions.isNullOrUndefined(item); })) {
                        Commerce.RetailLogger.extensibilityFrameworkAppBarCommandConfigurationNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    var commandLoadSequence = Promise.resolve();
                    appBarCommands
                        .filter(function (item) { return !Commerce.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (appBarCommand) {
                        commandLoadSequence = commandLoadSequence.then(function () {
                            return _this._loadAppBarCommand(extensionPackage, appBarCommand, targetAppBar);
                        });
                    });
                    return commandLoadSequence;
                };
                ViewExtensionsManagerBase.prototype._getAppBarCommands = function (appBarName) {
                    appBarName = appBarName || ViewExtensionsManagerBase.DEFAULT_APP_BAR_NAME;
                    var extensionCommands = [];
                    var commandDetails = this._appBarCommandsByAppBarName[appBarName] || [];
                    commandDetails.forEach(function (commandDetail) {
                        var extensionPackage = commandDetail.package;
                        var posToCommandPort = new Messaging.PosMessagePort();
                        var commandToPosPort = new Messaging.PosMessagePort();
                        var commandContext = __assign(__assign({}, extensionPackage.context), { messageChannel: new Messaging.MessageChannelEndpoint(commandToPosPort, posToCommandPort) });
                        var command = new commandDetail.extension(commandContext);
                        var extensionCommand = new Extensibility.ExtensionCommand(command, new Messaging.MessageChannelEndpoint(posToCommandPort, commandToPosPort), extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.name, extensionPackage.packageInfo.version);
                        extensionCommands.push(extensionCommand);
                    });
                    return extensionCommands;
                };
                ViewExtensionsManagerBase.prototype._loadMenuExtensions = function (extensionPackage, menuConfig, targetMenu) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(menuConfig.customCommands)) {
                        return Promise.resolve();
                    }
                    if (menuConfig.customCommands.some(function (item) { return Commerce.ObjectExtensions.isNullOrUndefined(item); })) {
                        Commerce.RetailLogger.extensibilityFrameworkMenuCommandManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    var commandLoadSequence = Promise.resolve();
                    menuConfig.customCommands
                        .filter(function (item) { return !Commerce.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (menuCommand) {
                        commandLoadSequence = commandLoadSequence.then(function () {
                            return _this._loadMenuCommand(extensionPackage, menuCommand, targetMenu);
                        });
                    });
                    return commandLoadSequence;
                };
                ViewExtensionsManagerBase.prototype._getMenuCommands = function (menuName) {
                    var menuCommands = [];
                    var commandDetails = this._menuCommandsByMenuName[menuName] || [];
                    commandDetails.forEach(function (commandDetail) {
                        var extensionPackage = commandDetail.package;
                        var posToCommandPort = new Messaging.PosMessagePort();
                        var commandToPosPort = new Messaging.PosMessagePort();
                        var commandContext = __assign(__assign({}, extensionPackage.context), { messageChannel: new Messaging.MessageChannelEndpoint(commandToPosPort, posToCommandPort) });
                        var command = new commandDetail.extension(commandContext);
                        var extensionCommand = new Extensibility.ExtensionMenuCommandViewModel(command, new Messaging.MessageChannelEndpoint(posToCommandPort, commandToPosPort), extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.name, extensionPackage.packageInfo.version);
                        menuCommands.push(extensionCommand);
                    });
                    return menuCommands;
                };
                ViewExtensionsManagerBase.prototype._getCustomSortColumns = function () {
                    var sortColumnDefinitions = this._customSortColumnDefinitions.map(function (details) {
                        var context = __assign({}, details.package.context);
                        return new details.extension(context);
                    });
                    return sortColumnDefinitions;
                };
                ViewExtensionsManagerBase.prototype._loadCustomSortColumns = function (extensionPackage, manifestItems) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(manifestItems)) {
                        return Promise.resolve();
                    }
                    var sortColumnLoadSequence = Promise.resolve();
                    if (manifestItems.some(function (item) { return TypeExtensions_7.ObjectExtensions.isNullOrUndefined(item); })) {
                        Commerce.RetailLogger.extensibilityFrameworkCustomSortColumnConfigurationNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    manifestItems
                        .filter(function (item) { return !TypeExtensions_7.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (sortColumnConfig) {
                        sortColumnLoadSequence = sortColumnLoadSequence.then(function () {
                            return _this._loadCustomSortColumn(extensionPackage, sortColumnConfig);
                        });
                    });
                    return sortColumnLoadSequence;
                };
                ViewExtensionsManagerBase.prototype._getCustomColumns = function (listName) {
                    var columnSetCreator = this._customColumnSetCreatorsByListName[listName];
                    return Commerce.ObjectExtensions.isFunction(columnSetCreator) ? columnSetCreator() : [];
                };
                ViewExtensionsManagerBase.prototype._loadCustomListLayout = function (extensionPackage, customListLayout, targetList) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(customListLayout)) {
                        return Promise.resolve();
                    }
                    if (Commerce.StringExtensions.isNullOrWhitespace(customListLayout.modulePath)) {
                        Commerce.RetailLogger.extensibilityFrameworkCustomListConfigurationNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.resolve();
                    }
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, customListLayout.modulePath);
                    var extensionPointName = "CustomColumnSet";
                    var extensionPointType = ExtensionPointType.CustomColumnSet;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(customListLayout.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(customListLayout.modulePath)
                        : customListLayout.name;
                    var extensionModulePath = customListLayout.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(customListLayout.description)
                        ? Commerce.StringResourceManager.getString("string_7476")
                        : customListLayout.description;
                    return this.loadModuleImpl(extensionPath)
                        .then(function (columnSetCreatorModule) {
                        var columnSetCreator = (function () {
                            return columnSetCreatorModule.default(extensionPackage.context);
                        });
                        _this._customColumnSetCreatorsByListName[targetList] = columnSetCreator;
                        Commerce.RetailLogger.viewExtensionsLoaderCustomColumnSetAdded(_this.viewName, targetList, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.resolve();
                    }, function (reason) {
                        Commerce.RetailLogger.viewExtensionsLoaderCustomColumnsLoadFailedDueToErrorImportingModule(extensionPath, _this.viewName, targetList, Commerce.ErrorHelper.serializeError(reason));
                        return Promise.reject(reason);
                    }).then(function () {
                        extensionPointName += " - " + _this.viewName + " - " + targetList;
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadViewController = function (extensionPackage, viewController) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(viewController)) {
                        Commerce.RetailLogger.extensibilityFrameworkViewControllerConfigurationNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.resolve();
                    }
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "ViewController - " + this.viewName;
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.ViewController;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(viewController.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(viewController.modulePath)
                        : viewController.name;
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, viewController.modulePath);
                    var extensionModulePath = viewController.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(viewController.description)
                        ? Commerce.StringResourceManager.getString("string_7477")
                        : viewController.description;
                    return this.loadModuleImpl(extensionPath)
                        .then(function (viewControllerModule) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(viewControllerModule)) {
                            var extensionViewControllerType = viewControllerModule.default;
                            if (extensionViewControllerType.prototype instanceof ViewControllers_1.ExtensionViewControllerBase) {
                                var viewControllerDetails = {
                                    package: extensionPackage,
                                    extension: extensionViewControllerType
                                };
                                _this._viewControllerDetails.push(viewControllerDetails);
                                Commerce.RetailLogger.viewExtensionsLoaderViewControllerAdded(_this.viewName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderViewControllerFailedDueToInvalidModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                var loadError = new Error("Invalid module");
                                return Promise.reject(loadError);
                            }
                        }
                        else {
                            var loadError = new Error("Invalid module");
                            return Promise.reject(loadError);
                        }
                    }, function (error) {
                        Commerce.RetailLogger.viewExtensionsLoaderViewControllerLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    }).then(function () {
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._getViewControllers = function () {
                    var viewControllers = [];
                    if (Commerce.ArrayExtensions.hasElements(this._viewControllerDetails)) {
                        this._viewControllerDetails.forEach(function (viewControllerDetails) {
                            var extensionPackage = viewControllerDetails.package;
                            var posToViewControllerPort = new Messaging.PosMessagePort();
                            var viewControllerToPosPort = new Messaging.PosMessagePort();
                            var viewControllerContext = __assign(__assign(__assign({}, extensionPackage.context), extensionPackage.extensionControlFactoryContext), { messageChannel: new Messaging.MessageChannelEndpoint(viewControllerToPosPort, posToViewControllerPort) });
                            new viewControllerDetails.extension(viewControllerContext);
                            var viewController = new Extensibility.ExtensionViewController(new Messaging.MessageChannelEndpoint(posToViewControllerPort, viewControllerToPosPort), extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.name, extensionPackage.packageInfo.version);
                            viewControllers.push(viewController);
                        });
                    }
                    return viewControllers;
                };
                ViewExtensionsManagerBase.prototype._loadCustomControls = function (extensionPackage, manifestItems) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(manifestItems)) {
                        return Promise.resolve();
                    }
                    var controlLoadSequence = Promise.resolve();
                    if (manifestItems.some(function (item) { return TypeExtensions_7.ObjectExtensions.isNullOrUndefined(item); })) {
                        Commerce.RetailLogger.extensibilityFrameworkCustomControlManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    manifestItems
                        .filter(function (item) { return !TypeExtensions_7.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (manifestItem) {
                        controlLoadSequence = controlLoadSequence.then(function () {
                            return _this._loadCustomControl(extensionPackage, manifestItem);
                        });
                    });
                    return controlLoadSequence;
                };
                ViewExtensionsManagerBase.prototype._getCustomControls = function () {
                    var controlWrappers = [];
                    if (Commerce.ArrayExtensions.hasElements(this._customControls)) {
                        this._customControls.forEach(function (controlDetails) {
                            var extensionPackage = controlDetails.package;
                            var posToControlPort = new Messaging.PosMessagePort();
                            var controlToPosPort = new Messaging.PosMessagePort();
                            var commandContext = __assign(__assign(__assign({}, extensionPackage.context), extensionPackage.extensionControlFactoryContext), { messageChannel: new Messaging.MessageChannelEndpoint(controlToPosPort, posToControlPort) });
                            var controlWrapper = {
                                extension: new controlDetails.extension(controlDetails.id, commandContext),
                                messageChannel: new Messaging.MessageChannelEndpoint(posToControlPort, controlToPosPort),
                                extensionPackage: extensionPackage
                            };
                            controlWrappers.push(controlWrapper);
                        });
                    }
                    return controlWrappers;
                };
                ViewExtensionsManagerBase.prototype._loadCustomSearchFilters = function (extensionPackage, manifestItems) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(manifestItems)) {
                        return Promise.resolve();
                    }
                    var searchFilterLoadSequence = Promise.resolve();
                    if (manifestItems.some(function (item) { return TypeExtensions_7.ObjectExtensions.isNullOrUndefined(item); })) {
                        Commerce.RetailLogger.extensibilityFrameworkSearchFilterConfigurationNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    manifestItems
                        .filter(function (item) { return !TypeExtensions_7.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (searchFilterConfig) {
                        searchFilterLoadSequence = searchFilterLoadSequence.then(function () {
                            return _this._loadCustomSearchFilter(extensionPackage, searchFilterConfig);
                        });
                    });
                    return searchFilterLoadSequence;
                };
                ViewExtensionsManagerBase.prototype._getCustomSearchFilters = function () {
                    var searchFilterDefinitions = this._searchFilterDetails.map(function (details) {
                        var context = __assign({}, details.package.context);
                        return new details.extension(context);
                    });
                    return searchFilterDefinitions;
                };
                ViewExtensionsManagerBase.prototype._getCustomGridColumns = function (gridName) {
                    var customGridColumns = this._customGridColumnsMap[gridName];
                    return Commerce.ObjectExtensions.isNullOrUndefined(customGridColumns) ? Object.create(null) : customGridColumns;
                };
                ViewExtensionsManagerBase.prototype._getCustomGridItemSubfields = function (gridName) {
                    var customGridItemSubfields = this._customGridItemSubfieldsMap[gridName];
                    customGridItemSubfields = Commerce.ObjectExtensions.isNullOrUndefined(customGridItemSubfields) ? [] : customGridItemSubfields;
                    return customGridItemSubfields.map(function (itemSubfieldInfo) { return itemSubfieldInfo.itemSubfield; });
                };
                ViewExtensionsManagerBase.prototype._getExtensionPath = function (baseUrl, relativeModulePath) {
                    return baseUrl + "/" + relativeModulePath;
                };
                ViewExtensionsManagerBase.prototype._loadCustomGridColumnSet = function (extensionPackage, linesGrid, targetGrid) {
                    var _this = this;
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(linesGrid)) {
                        Object.keys(linesGrid).forEach(function (columnName) {
                            extensionLoadPromises.push(_this._loadCustomGridColumn(extensionPackage, linesGrid[columnName], targetGrid, columnName));
                        });
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                ViewExtensionsManagerBase.prototype._loadCustomGridColumn = function (extensionPackage, customColumn, targetGrid, columnName) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(customColumn)) {
                        Commerce.RetailLogger.extensibilityFrameworkCustomGridColumnConfigurationNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.resolve();
                    }
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "CustomGridColumn - " + this.viewName + " - " + targetGrid;
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.CustomGridColumn;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(customColumn.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(customColumn.modulePath)
                        : customColumn.name;
                    var extensionModulePath = customColumn.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(customColumn.description)
                        ? Commerce.StringResourceManager.getString("string_7478")
                        : customColumn.description;
                    return Promise.resolve().then(function () {
                        if (Commerce.StringExtensions.isNullOrWhitespace(customColumn.modulePath)) {
                            return Promise.reject("Loading the custom grid column failed because the module path is not defined.");
                        }
                        var viewName = _this.viewName;
                        if (viewName !== "CartView" || (targetGrid !== "LinesGrid" && targetGrid !== "PaymentsGrid" && targetGrid !== "DeliveryGrid")) {
                            return Promise.reject("Loading the custom grid column failed because the viewName or targetGrid are wrong.");
                        }
                        if (Commerce.ObjectExtensions.isNullOrUndefined(_this._customGridColumnsMap[targetGrid])) {
                            _this._customGridColumnsMap[targetGrid] = Object.create(null);
                        }
                        var extensionPath = _this._getExtensionPath(extensionPackage.packageInfo.baseUrl, customColumn.modulePath);
                        return _this.loadModuleImpl(extensionPath).then(function (columnCreatorModule) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(columnCreatorModule)) {
                                var customGridColumnType = columnCreatorModule.default;
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(customGridColumnType) &&
                                    customGridColumnType.prototype instanceof CustomGridColumns_1.CustomGridColumnBase) {
                                    _this._customGridColumnsMap[targetGrid][columnName] = new customGridColumnType(extensionPackage.context);
                                    Commerce.RetailLogger.viewExtensionsLoaderCustomGridColumnAdded(_this.viewName, targetGrid, columnName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    return Promise.resolve();
                                }
                                else {
                                    return Promise.reject("Loading the custom grid column failed because the module does not extend from CustomGridColumnBase.");
                                }
                            }
                            else {
                                return Promise.reject("Loading the custom grid column failed because the module is invalid.");
                            }
                        }, function (error) {
                            Commerce.RetailLogger.viewExtensionsLoaderCustomGridColumnLoadFailedDueToErrorImportingModule(extensionPath, _this.viewName, targetGrid, columnName, Commerce.ErrorHelper.serializeError(error));
                            return Promise.reject(error);
                        });
                    }).then(function () {
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadCustomItemSubfield = function (extensionPackage, customItemSubfield, targetGrid) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(customItemSubfield)) {
                        Commerce.RetailLogger.extensibilityFrameworkCustomItemSubfieldNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.resolve();
                    }
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "CustomGridItemSubfield - " + this.viewName + " - " + targetGrid;
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.CustomGridItemSubfield;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(customItemSubfield.name)
                        ? customItemSubfield.itemSubfieldName
                        : customItemSubfield.name;
                    var extensionModulePath = customItemSubfield.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(customItemSubfield.description)
                        ? Commerce.StringResourceManager.getString("string_7479")
                        : customItemSubfield.description;
                    var viewName = this.viewName;
                    return Promise.resolve().then(function () {
                        var SUPPORTED_GRID_VIEWS = {
                            CartView: {
                                LinesGrid: {},
                                PaymentsGrid: {},
                                DeliveryGrid: {}
                            },
                            ShowJournalView: {
                                LinesGrid: {},
                                PaymentsGrid: {}
                            },
                            ReturnTransactionView: {
                                SalesOrderLinesGrid: {}
                            }
                        };
                        if (TypeExtensions_7.ObjectExtensions.isNullOrUndefined(SUPPORTED_GRID_VIEWS[viewName]) ||
                            TypeExtensions_7.ObjectExtensions.isNullOrUndefined(SUPPORTED_GRID_VIEWS[viewName][targetGrid])) {
                            return Promise.reject("Loading the custom item subfield failed because the viewName or gridName is wrong.");
                        }
                        if (Commerce.ObjectExtensions.isNullOrUndefined(_this._customGridItemSubfieldsMap[targetGrid])) {
                            _this._customGridItemSubfieldsMap[targetGrid] = [];
                        }
                        var extensionPath = _this._getExtensionPath(extensionPackage.packageInfo.baseUrl, customItemSubfield.modulePath);
                        return _this.loadModuleImpl(extensionPath)
                            .then(function (itemSubfieldCreatorModule) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(itemSubfieldCreatorModule)) {
                                var customGridItemSubfieldType = itemSubfieldCreatorModule.default;
                                if (Commerce.ObjectExtensions.isNullOrUndefined(customGridItemSubfieldType) ||
                                    !(customGridItemSubfieldType.prototype instanceof CustomGridItemSubfield_1.CustomGridItemSubfieldBase)) {
                                    Commerce.RetailLogger.extensibilityFrameworkLinesGridCustomItemSubfieldMustDerive(customItemSubfield.modulePath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    return Promise.reject("Loading the custom grid item subfield failed because the module does not derive from CustomGridItemSubfieldBase.");
                                }
                                var isCustomGridItemSubfieldNameDuplicate = _this._customGridItemSubfieldsMap[targetGrid].some(function (itemSubfieldInfo) {
                                    return itemSubfieldInfo.itemSubfieldName === customItemSubfield.itemSubfieldName;
                                });
                                if (isCustomGridItemSubfieldNameDuplicate) {
                                    Commerce.RetailLogger.extensibilityFrameworkGridCustomItemSubfieldDuplicateName(customItemSubfield.modulePath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version, customItemSubfield.itemSubfieldName);
                                    return Promise.reject("Loading the custom grid item subfield failed because the name has already been used.");
                                }
                                var customGridItemSubfieldCount = _this._customGridItemSubfieldsMap[targetGrid].length;
                                if (customGridItemSubfieldCount >= ViewExtensionsManagerBase.MAX_CUSTOM_GRID_ITEM_SUBFIELDS_COUNT) {
                                    Commerce.RetailLogger.extensibilityFrameworkGridCustomItemSubfieldMaxCountExceeded(customItemSubfield.modulePath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version, ViewExtensionsManagerBase.MAX_CUSTOM_GRID_ITEM_SUBFIELDS_COUNT);
                                    return Promise.reject("Loading the custom grid item subfield failed because the max count has been exceeded.");
                                }
                                var itemSubfield = new customGridItemSubfieldType(extensionPackage.context);
                                _this._customGridItemSubfieldsMap[targetGrid].push({ itemSubfield: itemSubfield, itemSubfieldName: customItemSubfield.itemSubfieldName });
                                Commerce.RetailLogger.viewExtensionsLoaderCustomGridItemSubfieldAdded(_this.viewName, targetGrid, customItemSubfield.itemSubfieldName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                return Promise.reject("Loading the custom grid item subfield failed because the module is invalid.");
                            }
                        }, function (error) {
                            Commerce.RetailLogger.viewExtensionsLoaderCustomGridItemSubfieldLoadFailedDueToErrorImportingModule(extensionPath, _this.viewName, targetGrid, customItemSubfield.itemSubfieldName, Commerce.ErrorHelper.serializeError(error));
                            return Promise.reject(error);
                        });
                    }).then(function () {
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadLinesGrid = function (extensionPackage, linesGrid, targetGrid) {
                    var _this = this;
                    var linesLoadSequence = Promise.resolve();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(linesGrid)) {
                        if (Commerce.ArrayExtensions.hasElements(linesGrid.customItemSubfields)) {
                            linesGrid.customItemSubfields.forEach(function (customItemSubfield) {
                                linesLoadSequence = linesLoadSequence.then(function () {
                                    return _this._loadCustomItemSubfield(extensionPackage, customItemSubfield, targetGrid);
                                });
                            });
                        }
                    }
                    return linesLoadSequence;
                };
                ViewExtensionsManagerBase.prototype._loadAppBarCommand = function (extensionPackage, appBarCommand, targetAppBar) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "AppBarCommand - " + this.viewName;
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.AppBarCommand;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(appBarCommand.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(appBarCommand.modulePath)
                        : appBarCommand.name;
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, appBarCommand.modulePath);
                    var extensionModulePath = appBarCommand.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(appBarCommand.description)
                        ? Commerce.StringResourceManager.getString("string_7480")
                        : appBarCommand.description;
                    return this.loadModuleImpl(extensionPath)
                        .then(function (commandModule) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(commandModule)) {
                            var extensionCommandType = commandModule.default;
                            if (extensionCommandType.prototype instanceof AppBarCommands_1.ExtensionCommandBase) {
                                var appBarKey = targetAppBar || ViewExtensionsManagerBase.DEFAULT_APP_BAR_NAME;
                                if (Commerce.ObjectExtensions.isNullOrUndefined(_this._appBarCommandsByAppBarName[appBarKey])) {
                                    _this._appBarCommandsByAppBarName[appBarKey] = [];
                                }
                                _this._appBarCommandsByAppBarName[appBarKey].push({ extension: extensionCommandType, package: extensionPackage });
                                targetAppBar = targetAppBar || "";
                                var appBarFriendlyName = targetAppBar + "AppBar";
                                Commerce.RetailLogger.viewExtensionsLoaderAppBarCommandAdded(_this.viewName, appBarFriendlyName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderCommandLoadFailedDueToInvalidCommandModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                var loadError = new Error("Invalid module");
                                return Promise.reject(loadError);
                            }
                        }
                        else {
                            var loadError = new Error("Invalid module");
                            return Promise.reject(loadError);
                        }
                    }, function (error) {
                        Commerce.RetailLogger.viewExtensionsLoaderCommandLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    }).then(function () {
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadMenuCommand = function (extensionPackage, menuCommand, menu) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "MenuCommand - " + this.viewName + " - " + menu;
                    var extensionPointType = ExtensionPointType.MenuCommand;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(menuCommand.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(menuCommand.modulePath)
                        : menuCommand.name;
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, menuCommand.modulePath);
                    var extensionModulePath = menuCommand.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(menuCommand.description)
                        ? Commerce.StringResourceManager.getString("string_7481")
                        : menuCommand.description;
                    return this.loadModuleImpl(extensionPath)
                        .then(function (commandModule) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(commandModule)) {
                            var extensionCommandType = commandModule.default;
                            if (extensionCommandType.prototype instanceof MenuCommands_1.ExtensionMenuCommandBase) {
                                if (Commerce.ObjectExtensions.isNullOrUndefined(_this._menuCommandsByMenuName[menu])) {
                                    _this._menuCommandsByMenuName[menu] = [];
                                }
                                _this._menuCommandsByMenuName[menu].push({ extension: extensionCommandType, package: extensionPackage });
                                Commerce.RetailLogger.viewExtensionsLoaderMenuCommandAdded(_this.viewName, menu, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderMenuCommandLoadFailedDueToInvalidCommandModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject("Load menu command failed due to invalid command module.");
                            }
                        }
                        else {
                            return Promise.reject("Load menu command failed due to invalid command module.");
                        }
                    }, function (error) {
                        Commerce.RetailLogger.viewExtensionsLoaderMenuCommandLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    }).then(function () {
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadCustomControl = function (extensionPackage, manifestItem) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "CustomControl - " + this.viewName;
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.CustomControl;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.name) ? manifestItem.controlName : manifestItem.name;
                    var extensionModulePath = manifestItem.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.description)
                        ? Commerce.StringResourceManager.getString("string_7482")
                        : manifestItem.description;
                    return Promise.resolve().then(function () {
                        var manifestValidationErrorDetails;
                        var controlId;
                        if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.controlName)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain a control name.",
                                controlName: "Unknown"
                            };
                        }
                        else if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.htmlPath)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain an html path.",
                                controlName: manifestItem.controlName
                            };
                        }
                        else if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.modulePath)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain a module path.",
                                controlName: manifestItem.controlName
                            };
                        }
                        else {
                            controlId = _this.getCustomControlId(manifestItem.controlName, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.name);
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(ViewExtensionsManagerBase.controlsByControlId[controlId])) {
                                manifestValidationErrorDetails = {
                                    errorMessage: "Control with id '" + controlId + "' already exists.",
                                    controlName: manifestItem.controlName
                                };
                            }
                        }
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(manifestValidationErrorDetails)) {
                            Commerce.RetailLogger.viewExtensionsLoaderCustomControlManifestValidationFailed(manifestValidationErrorDetails.controlName, manifestValidationErrorDetails.errorMessage, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.resolve();
                        }
                        var extensionPath = _this._getExtensionPath(extensionPackage.packageInfo.baseUrl, manifestItem.modulePath);
                        return _this._loadControlHtmlFragment(extensionPackage, manifestItem.htmlPath).then(function () {
                            return _this.loadModuleImpl(extensionPath)
                                .then(function (controlModule) {
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(controlModule) &&
                                    !Commerce.ObjectExtensions.isNullOrUndefined(controlModule.default)) {
                                    var controlType = controlModule.default;
                                    if (controlType.prototype instanceof CustomControls_1.CustomControlBase) {
                                        var controlDetails = { extension: controlType, package: extensionPackage, id: controlId };
                                        _this._customControls.push(controlDetails);
                                        ViewExtensionsManagerBase.controlsByControlId[controlId] = controlDetails;
                                        Commerce.RetailLogger.viewExtensionsLoaderCustomControlAdded(_this.viewName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                        return Promise.resolve();
                                    }
                                    else {
                                        Commerce.RetailLogger.viewExtensionsLoaderCustomControlLoadFailedDueToInvalidControlType(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                        var loadError = new Error("Invalid control type");
                                        return Promise.reject(loadError);
                                    }
                                }
                                else {
                                    Commerce.RetailLogger.viewExtensionsLoaderCustomControlLoadFailedDueToInvalidModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    var loadError = new Error("Invalid module");
                                    return Promise.reject(loadError);
                                }
                            }, function (error) {
                                Commerce.RetailLogger.viewExtensionsLoaderCustomControlLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject(error);
                            });
                        }, function (error) {
                            Commerce.RetailLogger.viewExtensionsLoaderCustomControlLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.reject(error);
                        });
                    }).then(function () {
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadControlHtmlFragment = function (extensionPackage, htmlPath) {
                    var _this = this;
                    var promise = new Promise(function (resolve, reject) {
                        if (Commerce.StringExtensions.isNullOrWhitespace(htmlPath)) {
                            resolve();
                        }
                        else {
                            var htmlFragmentPath = extensionPackage.packageInfo.baseUrl + "/" + htmlPath;
                            var fragmentWrapper_2 = _this._createAndInsertHtmlImpl(encodeURIComponent(htmlFragmentPath));
                            if (TypeExtensions_7.ObjectExtensions.isNullOrUndefined(fragmentWrapper_2)) {
                                var errorMessage = "Unable to create and insert html for extension control.";
                                Commerce.RetailLogger.extensibilityFrameworkUnableToCreateAndInsertHtmlFragmentForControl(errorMessage, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                throw new Error(errorMessage);
                            }
                            _this._renderHtmlImpl(htmlFragmentPath, fragmentWrapper_2).then(function () {
                                resolve();
                            }).catch(function (error) {
                                fragmentWrapper_2.parentNode.removeChild(fragmentWrapper_2);
                                Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlFailedToRenderHtmlFragment(Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                reject(error);
                            });
                        }
                    });
                    return promise.catch(function (reason) {
                        Commerce.RetailLogger.extensibilityFrameworkControlsUnableToLoadControlHtmlFragment(Commerce.ErrorHelper.serializeError(reason), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(reason);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadCustomSearchFilter = function (extensionPackage, manifestItem) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "CustomSearchFilter - " + this.viewName;
                    var extensionPointType = ExtensionPointType.CustomSearchFilter;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(manifestItem.modulePath)
                        : manifestItem.name;
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, manifestItem.modulePath);
                    var extensionModulePath = manifestItem.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.description)
                        ? Commerce.StringResourceManager.getString("string_7483")
                        : manifestItem.description;
                    return this.loadModuleImpl(extensionPath)
                        .then(function (filterModule) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(filterModule)) {
                            var searchFilterType = filterModule.default;
                            if (searchFilterType.prototype instanceof CustomSearchFilters_1.CustomSearchFilterDefinitionBase) {
                                _this._searchFilterDetails.push({ extension: searchFilterType, package: extensionPackage });
                                Commerce.RetailLogger.viewExtensionsLoaderCustomSearchFilterAdded(_this.viewName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderCustomSearchFilterLoadFailedDueToInvalidModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject("Loading custom search filter failed due to invalid module");
                            }
                        }
                        else {
                            return Promise.reject("Loading custom search filter failed due to invalid module");
                        }
                    }, function (error) {
                        Commerce.RetailLogger.viewExtensionsLoaderCustomSearchFilterLoadFailedDueToErrorImportingModule(extensionPath, _this.viewName, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    }).then(function () {
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.prototype._loadCustomSortColumn = function (extensionPackage, manifestItem) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "CustomSortColumn - " + this.viewName;
                    var extensionPointType = ExtensionPointType.CustomSortColumn;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(manifestItem.modulePath)
                        : manifestItem.name;
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, manifestItem.modulePath);
                    var extensionModulePath = manifestItem.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.description)
                        ? Commerce.StringResourceManager.getString("string_7494")
                        : manifestItem.description;
                    return this.loadModuleImpl(extensionPath)
                        .then(function (filterModule) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(filterModule)) {
                            var customSortColumnType = filterModule.default;
                            if (customSortColumnType.prototype instanceof CustomSortColumnDefinitions_1.CustomSortColumnDefinitionBase) {
                                _this._customSortColumnDefinitions.push({ extension: customSortColumnType, package: extensionPackage });
                                Commerce.RetailLogger.viewExtensionsLoaderCustomSortColumnAdded(_this.viewName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderCustomSortColumnLoadFailedDueToInvalidModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject("Loading custom sort column failed due to invalid module");
                            }
                        }
                        else {
                            return Promise.reject("Loading custom sort column failed due to invalid module");
                        }
                    }, function (error) {
                        Commerce.RetailLogger.viewExtensionsLoaderCustomSortColumnLoadFailedDueToErrorImportingModule(extensionPath, _this.viewName, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        return Promise.reject(error);
                    }).then(function () {
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_9.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewExtensionsManagerBase.DEFAULT_APP_BAR_NAME = "default";
                ViewExtensionsManagerBase.MAX_CUSTOM_GRID_ITEM_SUBFIELDS_COUNT = 10;
                ViewExtensionsManagerBase.CUSTOM_CONTROL_ID_FORMAT_STRING = "posCustomControl_{0}_{1}_{2}_{3}";
                ViewExtensionsManagerBase.controlsByControlId = Object.create(null);
                return ViewExtensionsManagerBase;
            }());
            exports_24("ViewExtensionsManagerBase", ViewExtensionsManagerBase);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/AddressAddEditViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_25, context_25) {
    "use strict";
    var ViewExtensionsManagerBase_1, Extensibility, ViewModels, AddressAddEditCustomControlViewModel, AddressAddEditViewExtensionsManager;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_1_1) {
                ViewExtensionsManagerBase_1 = ViewExtensionsManagerBase_1_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            ViewModels = Commerce.ViewModels;
            AddressAddEditCustomControlViewModel = Extensibility.AddressAddEditCustomControlViewModel;
            AddressAddEditViewExtensionsManager = (function (_super) {
                __extends(AddressAddEditViewExtensionsManager, _super);
                function AddressAddEditViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "AddressAddEditView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.AddressAddEditViewModel.viewExtensionManager = _this;
                    return _this;
                }
                AddressAddEditViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig.controlsConfig)) {
                            extensionLoadPromises.push(this._loadCustomControls(extensionPackage, viewConfig.controlsConfig.customControls));
                        }
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                AddressAddEditViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                AddressAddEditViewExtensionsManager.prototype.getCustomControls = function (handler) {
                    return this._getCustomControls()
                        .map(function (controlWrapper) {
                        var packageInfo = controlWrapper.extensionPackage.context.extensionPackageInfo;
                        return new AddressAddEditCustomControlViewModel(controlWrapper.extension, controlWrapper.messageChannel, packageInfo.publisher, packageInfo.name, packageInfo.version, handler);
                    });
                };
                return AddressAddEditViewExtensionsManager;
            }(ViewExtensionsManagerBase_1.ViewExtensionsManagerBase));
            exports_25("AddressAddEditViewExtensionsManager", AddressAddEditViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/CartViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase", "PosApi/Extend/Views/CartView", "Extension"], function (exports_26, context_26) {
    "use strict";
    var ViewExtensionsManagerBase_2, CartView_1, Extension_10, Extensibility, ViewModels, CartViewCustomControlViewModel, ExtensionPointType, CartViewExtensionsManager;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_2_1) {
                ViewExtensionsManagerBase_2 = ViewExtensionsManagerBase_2_1;
            },
            function (CartView_1_1) {
                CartView_1 = CartView_1_1;
            },
            function (Extension_10_1) {
                Extension_10 = Extension_10_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            ViewModels = Commerce.ViewModels;
            CartViewCustomControlViewModel = Extensibility.CartViewCustomControlViewModel;
            ExtensionPointType = Commerce.Extensibility.ExtensionPointType;
            CartViewExtensionsManager = (function (_super) {
                __extends(CartViewExtensionsManager, _super);
                function CartViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "CartView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.CartViewModel.viewExtensionManager = _this;
                    _this._totalsPanelCustomFieldDetails = [];
                    return _this;
                }
                CartViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadViewController(extensionPackage, viewConfig.viewController));
                        extensionLoadPromises.push(this._loadLinesGrid(extensionPackage, viewConfig.linesGrid, "LinesGrid"));
                        extensionLoadPromises.push(this._loadPaymentsGrid(extensionPackage, viewConfig.paymentsGrid, "PaymentsGrid"));
                        extensionLoadPromises.push(this._loadDeliveryGrid(extensionPackage, viewConfig.deliveryGrid, "DeliveryGrid"));
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig.controlsConfig)) {
                            extensionLoadPromises.push(this._loadCustomControls(extensionPackage, viewConfig.controlsConfig.customControls));
                        }
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig.totalsPanel)) {
                            extensionLoadPromises.push(this._loadTotalsPanelCustomFields(extensionPackage, viewConfig.totalsPanel.customFields));
                        }
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                CartViewExtensionsManager.prototype.getExtensionViewControllers = function () {
                    return this._getViewControllers();
                };
                CartViewExtensionsManager.prototype.getCustomControls = function (handler) {
                    var _this = this;
                    var controlWrapperIdToControlWrapperMap = Object.create(null);
                    var controlWrappers = this._getCustomControls();
                    if (Commerce.ArrayExtensions.hasElements(controlWrappers)) {
                        controlWrappers.forEach(function (wrapper) {
                            controlWrapperIdToControlWrapperMap[wrapper.extension.id] = wrapper;
                        });
                    }
                    var controlLayouts = Commerce.ApplicationContext.Instance.tillLayoutProxy.getCustomControls("transactionScreenLayout");
                    if (!Commerce.ArrayExtensions.hasElements(controlLayouts)) {
                        return [];
                    }
                    return controlLayouts.filter(function (controlLayout) {
                        if (!Commerce.StringExtensions.isNullOrWhitespace(controlLayout.RelativeUri)) {
                            Commerce.RetailLogger.extensibilityFrameworkControlNotSupported(controlLayout.Name);
                            return false;
                        }
                        else if (Commerce.StringExtensions.isNullOrWhitespace(controlLayout.Name)
                            || Commerce.StringExtensions.isNullOrWhitespace(controlLayout.PublisherName)
                            || Commerce.StringExtensions.isNullOrWhitespace(controlLayout.PackageName)) {
                            Commerce.RetailLogger.extensibilityFrameworkControlsInformationNotProvided(controlLayout.Name, controlLayout.PublisherName, controlLayout.PackageName);
                            return false;
                        }
                        return true;
                    }).map(function (controlLayout) {
                        var controlId = _this.getCustomControlId(controlLayout.Name, controlLayout.PublisherName, controlLayout.PackageName);
                        var controlWrapper = controlWrapperIdToControlWrapperMap[controlId];
                        return { controlLayout: controlLayout, controlWrapper: controlWrapper };
                    }).filter(function (controlDetails) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(controlDetails.controlWrapper)) {
                            Commerce.RetailLogger.extensibilityFrameworkControlsNotImplemented(controlDetails.controlLayout.Name, controlDetails.controlLayout.PublisherName, controlDetails.controlLayout.PackageName);
                            return false;
                        }
                        return true;
                    }).map(function (controlDetails) {
                        var packageInfo = controlDetails.controlWrapper.extensionPackage.context.extensionPackageInfo;
                        return new CartViewCustomControlViewModel(controlDetails.controlWrapper.extension, controlDetails.controlWrapper.messageChannel, packageInfo.publisher, packageInfo.name, packageInfo.version, controlDetails.controlLayout, handler);
                    });
                };
                CartViewExtensionsManager.prototype.getTotalsPanelCustomFields = function () {
                    return this._totalsPanelCustomFieldDetails.map(function (details) {
                        return new Extensibility.CartViewTotalsPanelCustomField(details.fieldName, new details.extension(__assign({}, details.package.context)), details.package.packageInfo.publisher, details.package.packageInfo.name, details.package.packageInfo.version);
                    });
                };
                CartViewExtensionsManager.prototype.getCustomPaymentsGridColumns = function () {
                    var paymentsGridColumns = this._getCustomGridColumns("PaymentsGrid");
                    return new Extensibility.CustomGridColumnsViewModel(paymentsGridColumns, "PaymentsGrid", "CartView");
                };
                CartViewExtensionsManager.prototype.getCustomDeliveryGridColumns = function () {
                    var deliveryGridColumns = this._getCustomGridColumns("DeliveryGrid");
                    return new Extensibility.CustomGridColumnsViewModel(deliveryGridColumns, "DeliveryGrid", "CartView");
                };
                CartViewExtensionsManager.prototype.getCustomLinesGridColumns = function () {
                    var linesGridColumns = this._getCustomGridColumns("LinesGrid");
                    return new Extensibility.CustomGridColumnsViewModel(linesGridColumns, "LinesGrid", "CartView");
                };
                CartViewExtensionsManager.prototype.getCustomLinesGridItemSubfields = function () {
                    var customLinesGridItemSubfields = this._getCustomGridItemSubfields("LinesGrid");
                    return new Extensibility.CustomGridItemSubfieldsViewModel(customLinesGridItemSubfields);
                };
                CartViewExtensionsManager.prototype._loadLinesGrid = function (extensionPackage, linesGrid, targetGrid) {
                    var _this = this;
                    var controlLoadSequence = Promise.resolve();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(linesGrid)) {
                        Object.keys(linesGrid).forEach(function (columnName) {
                            if (columnName !== "customItemSubfields") {
                                controlLoadSequence = controlLoadSequence.then(function () {
                                    return _this._loadCustomGridColumn(extensionPackage, linesGrid[columnName], targetGrid, columnName);
                                });
                            }
                        });
                        if (Commerce.ArrayExtensions.hasElements(linesGrid.customItemSubfields)) {
                            linesGrid.customItemSubfields.forEach(function (customItemSubfield) {
                                controlLoadSequence = controlLoadSequence.then(function () {
                                    return _this._loadCustomItemSubfield(extensionPackage, customItemSubfield, targetGrid);
                                });
                            });
                        }
                    }
                    return controlLoadSequence;
                };
                CartViewExtensionsManager.prototype._loadPaymentsGrid = function (extensionPackage, paymentsGrid, targetGrid) {
                    var _this = this;
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(paymentsGrid)) {
                        Object.keys(paymentsGrid).forEach(function (columnName) {
                            extensionLoadPromises.push(_this._loadCustomGridColumn(extensionPackage, paymentsGrid[columnName], targetGrid, columnName));
                        });
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                CartViewExtensionsManager.prototype._loadDeliveryGrid = function (extensionPackage, deliveryGrid, targetGrid) {
                    var _this = this;
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(deliveryGrid)) {
                        Object.keys(deliveryGrid).forEach(function (columnName) {
                            extensionLoadPromises.push(_this._loadCustomGridColumn(extensionPackage, deliveryGrid[columnName], targetGrid, columnName));
                        });
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                CartViewExtensionsManager.prototype._loadTotalsPanelCustomFields = function (extensionPackage, manifestItems) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(manifestItems)) {
                        return Promise.resolve();
                    }
                    if (manifestItems.some(function (item) { return Commerce.ObjectExtensions.isNullOrUndefined(item); })) {
                        Commerce.RetailLogger.extensibilityFrameworkTotalsPanelCustomFieldsManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    var fieldsLoadSequence = Promise.resolve();
                    manifestItems
                        .filter(function (item) { return !Commerce.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (manifestItem) {
                        fieldsLoadSequence = fieldsLoadSequence.then(function () {
                            return _this._loadTotalsPanelCustomField(extensionPackage, manifestItem);
                        });
                    });
                    return fieldsLoadSequence;
                };
                CartViewExtensionsManager.prototype._loadTotalsPanelCustomField = function (extensionPackage, manifestItem) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "TotalsPanelCustomField - " + this.viewName;
                    var extensionPointType = ExtensionPointType.TotalsPanelCustomField;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.name) ? manifestItem.fieldName : manifestItem.name;
                    var extensionModulePath = manifestItem.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.description)
                        ? Commerce.StringResourceManager.getString("string_7475")
                        : manifestItem.description;
                    return Promise.resolve().then(function () {
                        var manifestValidationErrorDetails;
                        var fieldId;
                        if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.fieldName)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain a field ID.",
                                fieldName: "Unknown"
                            };
                        }
                        else if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.modulePath)) {
                            manifestValidationErrorDetails = {
                                errorMessage: "Manifest item must contain a module path.",
                                fieldName: manifestItem.fieldName
                            };
                        }
                        else {
                            fieldId = _this._getTotalsPanelCustomFieldId(manifestItem.fieldName, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.name);
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(CartViewExtensionsManager.totalsPanelCustomFieldsByFieldId[fieldId])) {
                                manifestValidationErrorDetails = {
                                    errorMessage: "Field with id '" + fieldId + "' already exists.",
                                    fieldName: manifestItem.fieldName
                                };
                            }
                        }
                        extensionPointName += " - " + manifestItem.fieldName;
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(manifestValidationErrorDetails)) {
                            console.log(manifestValidationErrorDetails);
                            Commerce.RetailLogger.viewExtensionsLoaderTotalsPanelCustomFieldManifestValidationFailed(manifestValidationErrorDetails.fieldName, manifestValidationErrorDetails.errorMessage, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.reject(manifestValidationErrorDetails.errorMessage);
                        }
                        var extensionPath = _this._getExtensionPath(extensionPackage.packageInfo.baseUrl, manifestItem.modulePath);
                        return _this.loadModuleImpl(extensionPath)
                            .then(function (fieldModule) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(fieldModule) && !Commerce.ObjectExtensions.isNullOrUndefined(fieldModule.default)) {
                                var fieldType = fieldModule.default;
                                if (fieldType.prototype instanceof CartView_1.CartViewTotalsPanelCustomFieldBase) {
                                    var fieldDetails = {
                                        extension: fieldType,
                                        package: extensionPackage,
                                        fieldName: manifestItem.fieldName
                                    };
                                    _this._totalsPanelCustomFieldDetails.push(fieldDetails);
                                    CartViewExtensionsManager.totalsPanelCustomFieldsByFieldId[fieldId] = fieldDetails;
                                    Commerce.RetailLogger.viewExtensionsLoaderTotalsPanelCustomFieldAdded(_this.viewName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    return Promise.resolve();
                                }
                                else {
                                    Commerce.RetailLogger.viewExtensionsLoaderTotalsPanelCustomFieldLoadFailedDueToInvalidControlType(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    var error = new Error("Invalid control type");
                                    return Promise.reject(error);
                                }
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderTotalsPanelCustomFieldLoadFailedDueToInvalidModule(extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                var error = new Error("Invalid module");
                                return Promise.reject(error);
                            }
                        }, function (error) {
                            Commerce.RetailLogger.viewExtensionsLoaderTotalsPanelCustomFieldLoadFailedDueToErrorImportingModule(extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.reject(error);
                        });
                    }).then(function () {
                        var extension = new Extension_10.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_10.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                CartViewExtensionsManager.prototype._getTotalsPanelCustomFieldId = function (fieldId, publisherName, packageName) {
                    return Commerce.StringExtensions.format(CartViewExtensionsManager.TOTALS_PANEL_CUSTOM_FIELD_ID_FORMAT_STRING, this.viewName, publisherName, packageName, fieldId);
                };
                CartViewExtensionsManager.TOTALS_PANEL_CUSTOM_FIELD_ID_FORMAT_STRING = "totalsPanelCustomField_{0}_{1}_{2}_{3}";
                CartViewExtensionsManager.totalsPanelCustomFieldsByFieldId = Object.create(null);
                return CartViewExtensionsManager;
            }(ViewExtensionsManagerBase_2.ViewExtensionsManagerBase));
            exports_26("CartViewExtensionsManager", CartViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/CustomerAddEditViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_27, context_27) {
    "use strict";
    var ViewExtensionsManagerBase_3, Extensibility, ViewModels, CustomerAddEditCustomControlViewModel, CustomerAddEditViewExtensionsManager;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_3_1) {
                ViewExtensionsManagerBase_3 = ViewExtensionsManagerBase_3_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            ViewModels = Commerce.ViewModels;
            CustomerAddEditCustomControlViewModel = Extensibility.CustomerAddEditCustomControlViewModel;
            CustomerAddEditViewExtensionsManager = (function (_super) {
                __extends(CustomerAddEditViewExtensionsManager, _super);
                function CustomerAddEditViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "CustomerAddEditView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.CustomerAddEditViewModel.viewExtensionManager = _this;
                    return _this;
                }
                CustomerAddEditViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig.controlsConfig)) {
                            extensionLoadPromises.push(this._loadCustomControls(extensionPackage, viewConfig.controlsConfig.customControls));
                        }
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                CustomerAddEditViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                CustomerAddEditViewExtensionsManager.prototype.getCustomControls = function () {
                    return this._getCustomControls()
                        .map(function (controlWrapper) {
                        var packageInfo = controlWrapper.extensionPackage.context.extensionPackageInfo;
                        return new CustomerAddEditCustomControlViewModel(controlWrapper.extension, controlWrapper.messageChannel, packageInfo.publisher, packageInfo.name, packageInfo.version);
                    });
                };
                return CustomerAddEditViewExtensionsManager;
            }(ViewExtensionsManagerBase_3.ViewExtensionsManagerBase));
            exports_27("CustomerAddEditViewExtensionsManager", CustomerAddEditViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/CustomerDetailsViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_28, context_28) {
    "use strict";
    var ViewExtensionsManagerBase_4, Extensibility, CustomerDetailsCustomControlViewModel, ViewModels, CustomerDetailsViewExtensionsManager;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_4_1) {
                ViewExtensionsManagerBase_4 = ViewExtensionsManagerBase_4_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            CustomerDetailsCustomControlViewModel = Extensibility.CustomerDetailsCustomControlViewModel;
            ViewModels = Commerce.ViewModels;
            CustomerDetailsViewExtensionsManager = (function (_super) {
                __extends(CustomerDetailsViewExtensionsManager, _super);
                function CustomerDetailsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "CustomerDetailsView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.CustomerDetailsViewModel.viewExtensionManager = _this;
                    return _this;
                }
                CustomerDetailsViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig.controlsConfig)) {
                            extensionLoadPromises.push(this._loadCustomControls(extensionPackage, viewConfig.controlsConfig.customControls));
                        }
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                CustomerDetailsViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                CustomerDetailsViewExtensionsManager.prototype.getCustomControls = function () {
                    var viewModels = this._getCustomControls()
                        .map(function (panelWrapper) {
                        var packageInfo = panelWrapper.extensionPackage.context.extensionPackageInfo;
                        return new CustomerDetailsCustomControlViewModel(panelWrapper.extension, panelWrapper.messageChannel, packageInfo.publisher, packageInfo.name, packageInfo.version);
                    });
                    return viewModels;
                };
                return CustomerDetailsViewExtensionsManager;
            }(ViewExtensionsManagerBase_4.ViewExtensionsManagerBase));
            exports_28("CustomerDetailsViewExtensionsManager", CustomerDetailsViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/InventoryDocumentListViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_29, context_29) {
    "use strict";
    var ViewExtensionsManagerBase_5, ViewModels, InventoryDocumentListViewExtensionsManager;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_5_1) {
                ViewExtensionsManagerBase_5 = ViewExtensionsManagerBase_5_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            InventoryDocumentListViewExtensionsManager = (function (_super) {
                __extends(InventoryDocumentListViewExtensionsManager, _super);
                function InventoryDocumentListViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "InventoryDocumentListView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.InventoryDocumentListViewModel.viewExtensionManager = _this;
                    return _this;
                }
                InventoryDocumentListViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                InventoryDocumentListViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                return InventoryDocumentListViewExtensionsManager;
            }(ViewExtensionsManagerBase_5.ViewExtensionsManagerBase));
            exports_29("InventoryDocumentListViewExtensionsManager", InventoryDocumentListViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/InventoryDocumentShippingAndReceivingViewExtensionManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_30, context_30) {
    "use strict";
    var ViewExtensionsManagerBase_6, ViewModels, InventoryDocumentShippingAndReceivingViewExtensionManager;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_6_1) {
                ViewExtensionsManagerBase_6 = ViewExtensionsManagerBase_6_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            InventoryDocumentShippingAndReceivingViewExtensionManager = (function (_super) {
                __extends(InventoryDocumentShippingAndReceivingViewExtensionManager, _super);
                function InventoryDocumentShippingAndReceivingViewExtensionManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "InventoryDocumentShippingAndReceivingView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.InventoryDocumentShippingAndReceivingViewModel.viewExtensionManager = _this;
                    return _this;
                }
                InventoryDocumentShippingAndReceivingViewExtensionManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                InventoryDocumentShippingAndReceivingViewExtensionManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                return InventoryDocumentShippingAndReceivingViewExtensionManager;
            }(ViewExtensionsManagerBase_6.ViewExtensionsManagerBase));
            exports_30("InventoryDocumentShippingAndReceivingViewExtensionManager", InventoryDocumentShippingAndReceivingViewExtensionManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/InventoryLookupMatrixViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_31, context_31) {
    "use strict";
    var ViewExtensionsManagerBase_7, ViewModels, InventoryLookupMatrixViewExtensionsManager;
    var __moduleName = context_31 && context_31.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_7_1) {
                ViewExtensionsManagerBase_7 = ViewExtensionsManagerBase_7_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            InventoryLookupMatrixViewExtensionsManager = (function (_super) {
                __extends(InventoryLookupMatrixViewExtensionsManager, _super);
                function InventoryLookupMatrixViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "InventoryLookupMatrixView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.InventoryLookupMatrixViewModel.viewExtensionManager = _this;
                    return _this;
                }
                InventoryLookupMatrixViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadMenuExtensions(extensionPackage, viewConfig.cellInteractionMenu, InventoryLookupMatrixViewExtensionsManager.CELL_INTERACTION_MENU_NAME));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                InventoryLookupMatrixViewExtensionsManager.prototype.getCellInteractionMenuCommands = function () {
                    return this._getMenuCommands(InventoryLookupMatrixViewExtensionsManager.CELL_INTERACTION_MENU_NAME);
                };
                InventoryLookupMatrixViewExtensionsManager.CELL_INTERACTION_MENU_NAME = "CellInteractionMenu";
                return InventoryLookupMatrixViewExtensionsManager;
            }(ViewExtensionsManagerBase_7.ViewExtensionsManagerBase));
            exports_31("InventoryLookupMatrixViewExtensionsManager", InventoryLookupMatrixViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/InventoryLookupViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_32, context_32) {
    "use strict";
    var ViewExtensionsManagerBase_8, ViewModels, InventoryLookupViewExtensionsManager;
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_8_1) {
                ViewExtensionsManagerBase_8 = ViewExtensionsManagerBase_8_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            InventoryLookupViewExtensionsManager = (function (_super) {
                __extends(InventoryLookupViewExtensionsManager, _super);
                function InventoryLookupViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "InventoryLookupView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.InventoryLookupViewModel.viewExtensionManager = _this;
                    return _this;
                }
                InventoryLookupViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.inventoryByStoreListConfiguration, InventoryLookupViewExtensionsManager.INVENTORY_BY_STORE_LIST_NAME));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                InventoryLookupViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                InventoryLookupViewExtensionsManager.prototype.getInventoryByStoreListColumns = function () {
                    return this._getCustomColumns(InventoryLookupViewExtensionsManager.INVENTORY_BY_STORE_LIST_NAME);
                };
                InventoryLookupViewExtensionsManager.INVENTORY_BY_STORE_LIST_NAME = "InventoryByStoreList";
                return InventoryLookupViewExtensionsManager;
            }(ViewExtensionsManagerBase_8.ViewExtensionsManagerBase));
            exports_32("InventoryLookupViewExtensionsManager", InventoryLookupViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/FulfillmentLineViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_33, context_33) {
    "use strict";
    var ViewExtensionsManagerBase_9, ViewModels, FulfillmentLineViewExtensionsManager;
    var __moduleName = context_33 && context_33.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_9_1) {
                ViewExtensionsManagerBase_9 = ViewExtensionsManagerBase_9_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            FulfillmentLineViewExtensionsManager = (function (_super) {
                __extends(FulfillmentLineViewExtensionsManager, _super);
                function FulfillmentLineViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "FulfillmentLineView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.FulfillmentLineViewModel.viewExtensionManager = _this;
                    return _this;
                }
                FulfillmentLineViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.fulfillmentLinesListConfiguration, FulfillmentLineViewExtensionsManager.FULFILLMENT_LINES_LIST_NAME));
                        extensionLoadPromises.push(this._loadCustomSortColumns(extensionPackage, viewConfig.customSortColumns));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                FulfillmentLineViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                FulfillmentLineViewExtensionsManager.prototype.getFulfillmentLinesColumns = function () {
                    return this._getCustomColumns(FulfillmentLineViewExtensionsManager.FULFILLMENT_LINES_LIST_NAME);
                };
                FulfillmentLineViewExtensionsManager.prototype.getFulfillmentLinesSortColumnsDefinitions = function () {
                    return this._getCustomSortColumns();
                };
                FulfillmentLineViewExtensionsManager.FULFILLMENT_LINES_LIST_NAME = "FulFillmentLinesList";
                return FulfillmentLineViewExtensionsManager;
            }(ViewExtensionsManagerBase_9.ViewExtensionsManagerBase));
            exports_33("FulfillmentLineViewExtensionsManager", FulfillmentLineViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/HealthCheckViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase", "PosApi/Extend/Views/HealthCheckView", "Extension"], function (exports_34, context_34) {
    "use strict";
    var ViewExtensionsManagerBase_10, HealthCheckView_1, Extension_11, ViewModels, HealthCheckViewExtensionsManager;
    var __moduleName = context_34 && context_34.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_10_1) {
                ViewExtensionsManagerBase_10 = ViewExtensionsManagerBase_10_1;
            },
            function (HealthCheckView_1_1) {
                HealthCheckView_1 = HealthCheckView_1_1;
            },
            function (Extension_11_1) {
                Extension_11 = Extension_11_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            HealthCheckViewExtensionsManager = (function (_super) {
                __extends(HealthCheckViewExtensionsManager, _super);
                function HealthCheckViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "HealthCheckView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.HealthCheckViewModel.viewExtensionManager = _this;
                    _this._customHealthCheckDetails = [];
                    return _this;
                }
                HealthCheckViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadCustomHealthChecks(extensionPackage, viewConfig.customHealthChecks));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                HealthCheckViewExtensionsManager.prototype.getCustomHealthChecks = function () {
                    return this._customHealthCheckDetails.map(function (healthCheckDetails) {
                        var context = __assign({}, healthCheckDetails.package.context);
                        var extension = new healthCheckDetails.extension(context);
                        return new Commerce.ViewModels.CustomHealthCheckEntityViewModel(extension, healthCheckDetails.package.packageInfo.publisher, healthCheckDetails.package.packageInfo.name, healthCheckDetails.package.packageInfo.version);
                    });
                };
                HealthCheckViewExtensionsManager.prototype._loadCustomHealthChecks = function (extensionPackage, customHealthChecks) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(customHealthChecks)) {
                        return Promise.resolve();
                    }
                    var healthCheckLoadSequence = Promise.resolve();
                    customHealthChecks
                        .filter(function (item) { return !Commerce.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (customHealthCheck) {
                        healthCheckLoadSequence = healthCheckLoadSequence.then(function () {
                            return _this._loadCustomHealthCheck(extensionPackage, customHealthCheck);
                        });
                    });
                    return healthCheckLoadSequence;
                };
                HealthCheckViewExtensionsManager.prototype._loadCustomHealthCheck = function (extensionPackage, customHealthCheck) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "CustomHealthCheck";
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.CustomHealthCheck;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(customHealthCheck.name)
                        ? Commerce.UrlHelper.extractFileNameWithoutExtension(customHealthCheck.modulePath)
                        : customHealthCheck.name;
                    var extensionPath = this._getExtensionPath(extensionPackage.packageInfo.baseUrl, customHealthCheck.modulePath);
                    var extensionModulePath = customHealthCheck.modulePath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(customHealthCheck.description)
                        ? Commerce.StringResourceManager.getString("string_30380")
                        : customHealthCheck.description;
                    return this.loadModuleImpl(extensionPath)
                        .then(function (healthCheckModule) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(healthCheckModule)) {
                            var extensionType = healthCheckModule.default;
                            if (extensionType.prototype instanceof HealthCheckView_1.CustomHealthCheckBase) {
                                _this._customHealthCheckDetails.push({ extension: extensionType, package: extensionPackage });
                                var extension = new Extension_11.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                                extensionPackage.addExtension(extension);
                                Commerce.RetailLogger.viewExtensionsLoaderCustomHealthCheckAdded(correlationId, _this.viewName, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.resolve();
                            }
                            else {
                                Commerce.RetailLogger.viewExtensionsLoaderCustomHealthCheckLoadFailedDueToInvalidHealthCheckType(correlationId, extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject("Loading custom health check extension failed as it is not of type: CustomHealthCheck");
                            }
                        }
                        else {
                            Commerce.RetailLogger.viewExtensionsLoaderCustomHealthCheckLoadFailedDueToInvalidModule(correlationId, extensionPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.reject("Loading custom health check extension failed due to invalid module.");
                        }
                    }).catch(function (error) {
                        Commerce.RetailLogger.viewExtensionsLoaderCustomHealthCheckLoadFailedDueToErrorImportingModule(correlationId, extensionPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                        var loadError = Commerce.ErrorHelper.toJavascriptError(error, correlationId);
                        var extension = new Extension_11.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                return HealthCheckViewExtensionsManager;
            }(ViewExtensionsManagerBase_10.ViewExtensionsManagerBase));
            exports_34("HealthCheckViewExtensionsManager", HealthCheckViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/ManageShiftsViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_35, context_35) {
    "use strict";
    var ViewExtensionsManagerBase_11, ViewModels, ManageShiftsViewExtensionsManager;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_11_1) {
                ViewExtensionsManagerBase_11 = ViewExtensionsManagerBase_11_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            ManageShiftsViewExtensionsManager = (function (_super) {
                __extends(ManageShiftsViewExtensionsManager, _super);
                function ManageShiftsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "ManageShiftsView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.ManageShiftsViewModel.viewExtensionManager = _this;
                    return _this;
                }
                ManageShiftsViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                ManageShiftsViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                return ManageShiftsViewExtensionsManager;
            }(ViewExtensionsManagerBase_11.ViewExtensionsManagerBase));
            exports_35("ManageShiftsViewExtensionsManager", ManageShiftsViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/PaymentViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_36, context_36) {
    "use strict";
    var ViewExtensionsManagerBase_12, ViewModels, PaymentViewExtensionsManager;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_12_1) {
                ViewExtensionsManagerBase_12 = ViewExtensionsManagerBase_12_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            PaymentViewExtensionsManager = (function (_super) {
                __extends(PaymentViewExtensionsManager, _super);
                function PaymentViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "PaymentView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.PaymentViewModel.viewExtensionManager = _this;
                    return _this;
                }
                PaymentViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                PaymentViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                return PaymentViewExtensionsManager;
            }(ViewExtensionsManagerBase_12.ViewExtensionsManagerBase));
            exports_36("PaymentViewExtensionsManager", PaymentViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/PickingAndReceivingDetailsViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_37, context_37) {
    "use strict";
    var ViewExtensionsManagerBase_13, ViewModels, PickingAndReceivingDetailsViewExtensionsManager;
    var __moduleName = context_37 && context_37.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_13_1) {
                ViewExtensionsManagerBase_13 = ViewExtensionsManagerBase_13_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            PickingAndReceivingDetailsViewExtensionsManager = (function (_super) {
                __extends(PickingAndReceivingDetailsViewExtensionsManager, _super);
                function PickingAndReceivingDetailsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "PickingAndReceivingDetailsView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.PickingAndReceivingDetailsViewModel.viewExtensionManager = _this;
                    return _this;
                }
                PickingAndReceivingDetailsViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.orderLinesListConfiguration, PickingAndReceivingDetailsViewExtensionsManager.ORDER_LINES_LIST_NAME));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.advancedWarehousingOrderLinesListConfiguration, PickingAndReceivingDetailsViewExtensionsManager.ADVANCED_WAREHOUSING_ORDER_LINES_LIST_NAME));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                PickingAndReceivingDetailsViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                PickingAndReceivingDetailsViewExtensionsManager.prototype.getAdvancedWarehousingOrderLinesListColumns = function () {
                    return this._getCustomColumns(PickingAndReceivingDetailsViewExtensionsManager.ADVANCED_WAREHOUSING_ORDER_LINES_LIST_NAME);
                };
                PickingAndReceivingDetailsViewExtensionsManager.prototype.getOrderLinesListColumns = function () {
                    return this._getCustomColumns(PickingAndReceivingDetailsViewExtensionsManager.ORDER_LINES_LIST_NAME);
                };
                PickingAndReceivingDetailsViewExtensionsManager.ADVANCED_WAREHOUSING_ORDER_LINES_LIST_NAME = "AdvancedWarehousingOrderLinesList";
                PickingAndReceivingDetailsViewExtensionsManager.ORDER_LINES_LIST_NAME = "OrderLinesList";
                return PickingAndReceivingDetailsViewExtensionsManager;
            }(ViewExtensionsManagerBase_13.ViewExtensionsManagerBase));
            exports_37("PickingAndReceivingDetailsViewExtensionsManager", PickingAndReceivingDetailsViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/PriceCheckViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_38, context_38) {
    "use strict";
    var ViewExtensionsManagerBase_14, Extensibility, PriceCheckCustomControlViewModel, ViewModels, PriceCheckViewExtensionsManager;
    var __moduleName = context_38 && context_38.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_14_1) {
                ViewExtensionsManagerBase_14 = ViewExtensionsManagerBase_14_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            PriceCheckCustomControlViewModel = Extensibility.PriceCheckCustomControlViewModel;
            ViewModels = Commerce.ViewModels;
            PriceCheckViewExtensionsManager = (function (_super) {
                __extends(PriceCheckViewExtensionsManager, _super);
                function PriceCheckViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "PriceCheckView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.PriceCheckViewModel.viewExtensionManager = _this;
                    return _this;
                }
                PriceCheckViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig.controlsConfig)) {
                            extensionLoadPromises.push(this._loadCustomControls(extensionPackage, viewConfig.controlsConfig.customControls));
                        }
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig.appBarCommands)) {
                            extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        }
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                PriceCheckViewExtensionsManager.prototype.getCustomControls = function () {
                    return this._getCustomControls()
                        .map(function (controlWrapper) {
                        var packageInfo = controlWrapper.extensionPackage.context.extensionPackageInfo;
                        return new PriceCheckCustomControlViewModel(controlWrapper.extension, controlWrapper.messageChannel, packageInfo.publisher, packageInfo.name, packageInfo.version);
                    });
                };
                PriceCheckViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                return PriceCheckViewExtensionsManager;
            }(ViewExtensionsManagerBase_14.ViewExtensionsManagerBase));
            exports_38("PriceCheckViewExtensionsManager", PriceCheckViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/ReportDetailsViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_39, context_39) {
    "use strict";
    var ViewExtensionsManagerBase_15, ViewModels, ReportDetailsViewExtensionsManager;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_15_1) {
                ViewExtensionsManagerBase_15 = ViewExtensionsManagerBase_15_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            ReportDetailsViewExtensionsManager = (function (_super) {
                __extends(ReportDetailsViewExtensionsManager, _super);
                function ReportDetailsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "ReportDetailsView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.ReportDetailsViewModel.viewExtensionManager = _this;
                    return _this;
                }
                ReportDetailsViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                ReportDetailsViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                return ReportDetailsViewExtensionsManager;
            }(ViewExtensionsManagerBase_15.ViewExtensionsManagerBase));
            exports_39("ReportDetailsViewExtensionsManager", ReportDetailsViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/ResumeCartViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_40, context_40) {
    "use strict";
    var ViewExtensionsManagerBase_16, ViewModels, ResumeCartViewExtensionsManager;
    var __moduleName = context_40 && context_40.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_16_1) {
                ViewExtensionsManagerBase_16 = ViewExtensionsManagerBase_16_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            ResumeCartViewExtensionsManager = (function (_super) {
                __extends(ResumeCartViewExtensionsManager, _super);
                function ResumeCartViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "ResumeCartView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.ResumeCartViewModel.viewExtensionManager = _this;
                    return _this;
                }
                ResumeCartViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.suspendedCartsListConfiguration, ResumeCartViewExtensionsManager.RESUME_CART_LIST_NAME));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                ResumeCartViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                ResumeCartViewExtensionsManager.prototype.getResumeCartListConfiguration = function () {
                    return this._getCustomColumns(ResumeCartViewExtensionsManager.RESUME_CART_LIST_NAME);
                };
                ResumeCartViewExtensionsManager.RESUME_CART_LIST_NAME = "SuspendedCartsList";
                return ResumeCartViewExtensionsManager;
            }(ViewExtensionsManagerBase_16.ViewExtensionsManagerBase));
            exports_40("ResumeCartViewExtensionsManager", ResumeCartViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/ReturnTransactionViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_41, context_41) {
    "use strict";
    var ViewExtensionsManagerBase_17, Extensibility, ViewModels, ReturnTransactionViewExtensionsManager;
    var __moduleName = context_41 && context_41.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_17_1) {
                ViewExtensionsManagerBase_17 = ViewExtensionsManagerBase_17_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            ViewModels = Commerce.ViewModels;
            ReturnTransactionViewExtensionsManager = (function (_super) {
                __extends(ReturnTransactionViewExtensionsManager, _super);
                function ReturnTransactionViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "ReturnTransactionView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.ReturnTransactionViewModel.viewExtensionManager = _this;
                    return _this;
                }
                ReturnTransactionViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        extensionLoadPromises.push(this._loadLinesGrid(extensionPackage, viewConfig.salesOrderLinesGrid, "SalesOrderLinesGrid"));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                ReturnTransactionViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                ReturnTransactionViewExtensionsManager.prototype.getCustomSalesOrderLinesGridItemSubfields = function () {
                    var customSalesOrderLinesGridItemSubfields = this._getCustomGridItemSubfields("SalesOrderLinesGrid");
                    return new Extensibility.CustomGridItemSubfieldsViewModel(customSalesOrderLinesGridItemSubfields);
                };
                return ReturnTransactionViewExtensionsManager;
            }(ViewExtensionsManagerBase_17.ViewExtensionsManagerBase));
            exports_41("ReturnTransactionViewExtensionsManager", ReturnTransactionViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/SalesInvoiceDetailsViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_42, context_42) {
    "use strict";
    var ViewExtensionsManagerBase_18, ViewModels, SalesInvoiceDetailsViewExtensionsManager;
    var __moduleName = context_42 && context_42.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_18_1) {
                ViewExtensionsManagerBase_18 = ViewExtensionsManagerBase_18_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            SalesInvoiceDetailsViewExtensionsManager = (function (_super) {
                __extends(SalesInvoiceDetailsViewExtensionsManager, _super);
                function SalesInvoiceDetailsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "SalesInvoiceDetailsView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.SalesInvoiceDetailsViewModel.viewExtensionManager = _this;
                    return _this;
                }
                SalesInvoiceDetailsViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                SalesInvoiceDetailsViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                return SalesInvoiceDetailsViewExtensionsManager;
            }(ViewExtensionsManagerBase_18.ViewExtensionsManagerBase));
            exports_42("SalesInvoiceDetailsViewExtensionsManager", SalesInvoiceDetailsViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/SalesInvoicesViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_43, context_43) {
    "use strict";
    var ViewExtensionsManagerBase_19, ViewModels, SalesInvoicesViewExtensionsManager;
    var __moduleName = context_43 && context_43.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_19_1) {
                ViewExtensionsManagerBase_19 = ViewExtensionsManagerBase_19_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            SalesInvoicesViewExtensionsManager = (function (_super) {
                __extends(SalesInvoicesViewExtensionsManager, _super);
                function SalesInvoicesViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "SalesInvoicesView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.SalesInvoicesViewModel.viewExtensionManager = _this;
                    return _this;
                }
                SalesInvoicesViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.salesInvoicesListConfiguration, SalesInvoicesViewExtensionsManager.SALES_INVOICES_LIST_NAME));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                SalesInvoicesViewExtensionsManager.prototype.getSalesInvoicesListColumns = function () {
                    return this._getCustomColumns(SalesInvoicesViewExtensionsManager.SALES_INVOICES_LIST_NAME);
                };
                SalesInvoicesViewExtensionsManager.SALES_INVOICES_LIST_NAME = "SalesInvoicesList";
                return SalesInvoicesViewExtensionsManager;
            }(ViewExtensionsManagerBase_19.ViewExtensionsManagerBase));
            exports_43("SalesInvoicesViewExtensionsManager", SalesInvoicesViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/SearchOrdersViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_44, context_44) {
    "use strict";
    var ViewExtensionsManagerBase_20, ViewModels, SearchOrdersViewExtensionsManager;
    var __moduleName = context_44 && context_44.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_20_1) {
                ViewExtensionsManagerBase_20 = ViewExtensionsManagerBase_20_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            SearchOrdersViewExtensionsManager = (function (_super) {
                __extends(SearchOrdersViewExtensionsManager, _super);
                function SearchOrdersViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "SearchOrdersView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.SearchOrdersViewModel.viewExtensionManager = _this;
                    return _this;
                }
                SearchOrdersViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        extensionLoadPromises.push(this._loadCustomSearchFilters(extensionPackage, viewConfig.searchFilters));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.ordersListConfiguration, SearchOrdersViewExtensionsManager.ORDERS_LIST_NAME));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                SearchOrdersViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                SearchOrdersViewExtensionsManager.prototype.getCustomSearchFilterDefinitions = function () {
                    return this._getCustomSearchFilters();
                };
                SearchOrdersViewExtensionsManager.prototype.getOrdersListColumns = function () {
                    return this._getCustomColumns(SearchOrdersViewExtensionsManager.ORDERS_LIST_NAME);
                };
                SearchOrdersViewExtensionsManager.ORDERS_LIST_NAME = "OrdersList";
                return SearchOrdersViewExtensionsManager;
            }(ViewExtensionsManagerBase_20.ViewExtensionsManagerBase));
            exports_44("SearchOrdersViewExtensionsManager", SearchOrdersViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/SearchPickingAndReceivingViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_45, context_45) {
    "use strict";
    var ViewExtensionsManagerBase_21, ViewModels, SearchPickingAndReceivingViewExtensionsManager;
    var __moduleName = context_45 && context_45.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_21_1) {
                ViewExtensionsManagerBase_21 = ViewExtensionsManagerBase_21_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            SearchPickingAndReceivingViewExtensionsManager = (function (_super) {
                __extends(SearchPickingAndReceivingViewExtensionsManager, _super);
                function SearchPickingAndReceivingViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "SearchPickingAndReceivingView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.SearchPickingAndReceivingViewModel.viewExtensionManager = _this;
                    return _this;
                }
                SearchPickingAndReceivingViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.ordersListConfiguration, SearchPickingAndReceivingViewExtensionsManager.ORDERS_LIST_NAME));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                SearchPickingAndReceivingViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                SearchPickingAndReceivingViewExtensionsManager.prototype.getOrdersListColumns = function () {
                    return this._getCustomColumns(SearchPickingAndReceivingViewExtensionsManager.ORDERS_LIST_NAME);
                };
                SearchPickingAndReceivingViewExtensionsManager.ORDERS_LIST_NAME = "OrdersList";
                return SearchPickingAndReceivingViewExtensionsManager;
            }(ViewExtensionsManagerBase_21.ViewExtensionsManagerBase));
            exports_45("SearchPickingAndReceivingViewExtensionsManager", SearchPickingAndReceivingViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/SearchStockCountViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_46, context_46) {
    "use strict";
    var ViewExtensionsManagerBase_22, ViewModels, SearchStockCountViewExtensionsManager;
    var __moduleName = context_46 && context_46.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_22_1) {
                ViewExtensionsManagerBase_22 = ViewExtensionsManagerBase_22_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            SearchStockCountViewExtensionsManager = (function (_super) {
                __extends(SearchStockCountViewExtensionsManager, _super);
                function SearchStockCountViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "SearchStockCountView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.SearchStockCountViewModel.viewExtensionManager = _this;
                    return _this;
                }
                SearchStockCountViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.stockCountJournalsListConfiguration, SearchStockCountViewExtensionsManager.STOCK_COUNT_LIST_NAME));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                SearchStockCountViewExtensionsManager.prototype.getStockCountListColumns = function () {
                    return this._getCustomColumns(SearchStockCountViewExtensionsManager.STOCK_COUNT_LIST_NAME);
                };
                SearchStockCountViewExtensionsManager.STOCK_COUNT_LIST_NAME = "StockCountList";
                return SearchStockCountViewExtensionsManager;
            }(ViewExtensionsManagerBase_22.ViewExtensionsManagerBase));
            exports_46("SearchStockCountViewExtensionsManager", SearchStockCountViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/SearchViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_47, context_47) {
    "use strict";
    var ViewExtensionsManagerBase_23, ViewModels, SearchViewExtensionsManager;
    var __moduleName = context_47 && context_47.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_23_1) {
                ViewExtensionsManagerBase_23 = ViewExtensionsManagerBase_23_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            SearchViewExtensionsManager = (function (_super) {
                __extends(SearchViewExtensionsManager, _super);
                function SearchViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "SearchView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.SearchViewModel.viewExtensionManager = _this;
                    return _this;
                }
                SearchViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.productAppBarCommands, SearchViewExtensionsManager.PRODUCTS_KEY));
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.customerAppBarCommands, SearchViewExtensionsManager.CUSTOMERS_KEY));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.productListConfiguration, SearchViewExtensionsManager.PRODUCTS_KEY));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.customerListConfiguration, SearchViewExtensionsManager.CUSTOMERS_KEY));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                SearchViewExtensionsManager.prototype.getProductSearchAppBarCommands = function () {
                    return this._getAppBarCommands(SearchViewExtensionsManager.PRODUCTS_KEY);
                };
                SearchViewExtensionsManager.prototype.getProductSearchListColumns = function () {
                    return this._getCustomColumns(SearchViewExtensionsManager.PRODUCTS_KEY);
                };
                SearchViewExtensionsManager.prototype.getCustomerSearchListColumns = function () {
                    return this._getCustomColumns(SearchViewExtensionsManager.CUSTOMERS_KEY);
                };
                SearchViewExtensionsManager.prototype.getCustomerSearchAppBarCommands = function () {
                    return this._getAppBarCommands(SearchViewExtensionsManager.CUSTOMERS_KEY);
                };
                SearchViewExtensionsManager.CUSTOMERS_KEY = "Customers";
                SearchViewExtensionsManager.PRODUCTS_KEY = "Products";
                return SearchViewExtensionsManager;
            }(ViewExtensionsManagerBase_23.ViewExtensionsManagerBase));
            exports_47("SearchViewExtensionsManager", SearchViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/SimpleProductDetailsViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_48, context_48) {
    "use strict";
    var ViewExtensionsManagerBase_24, Extensibility, SimpleProductDetailsCustomControlViewModel, ViewModels, SimpleProductDetailsViewExtensionsManager;
    var __moduleName = context_48 && context_48.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_24_1) {
                ViewExtensionsManagerBase_24 = ViewExtensionsManagerBase_24_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            SimpleProductDetailsCustomControlViewModel = Extensibility.SimpleProductDetailsCustomControlViewModel;
            ViewModels = Commerce.ViewModels;
            SimpleProductDetailsViewExtensionsManager = (function (_super) {
                __extends(SimpleProductDetailsViewExtensionsManager, _super);
                function SimpleProductDetailsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "SimpleProductDetailsView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.SimpleProductDetailsViewModel.viewExtensionManager = _this;
                    return _this;
                }
                SimpleProductDetailsViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig.controlsConfig)) {
                            extensionLoadPromises.push(this._loadCustomControls(extensionPackage, viewConfig.controlsConfig.customControls));
                        }
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                SimpleProductDetailsViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                SimpleProductDetailsViewExtensionsManager.prototype.getCustomControls = function () {
                    return this._getCustomControls()
                        .map(function (controlWrapper) {
                        var packageInfo = controlWrapper.extensionPackage.context.extensionPackageInfo;
                        return new SimpleProductDetailsCustomControlViewModel(controlWrapper.extension, controlWrapper.messageChannel, packageInfo.publisher, packageInfo.name, packageInfo.version);
                    });
                };
                return SimpleProductDetailsViewExtensionsManager;
            }(ViewExtensionsManagerBase_24.ViewExtensionsManagerBase));
            exports_48("SimpleProductDetailsViewExtensionsManager", SimpleProductDetailsViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/ShippingMethodsViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_49, context_49) {
    "use strict";
    var ViewExtensionsManagerBase_25, ViewModels, ShippingMethodsViewExtensionsManager;
    var __moduleName = context_49 && context_49.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_25_1) {
                ViewExtensionsManagerBase_25 = ViewExtensionsManagerBase_25_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            ShippingMethodsViewExtensionsManager = (function (_super) {
                __extends(ShippingMethodsViewExtensionsManager, _super);
                function ShippingMethodsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "ShippingMethodsView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.ShippingMethodsViewModel.viewExtensionManager = _this;
                    return _this;
                }
                ShippingMethodsViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadViewController(extensionPackage, viewConfig.viewController));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                ShippingMethodsViewExtensionsManager.prototype.getExtensionViewControllers = function () {
                    return this._getViewControllers();
                };
                return ShippingMethodsViewExtensionsManager;
            }(ViewExtensionsManagerBase_25.ViewExtensionsManagerBase));
            exports_49("ShippingMethodsViewExtensionsManager", ShippingMethodsViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/ShowJournalViewExtensionsManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_50, context_50) {
    "use strict";
    var ViewExtensionsManagerBase_26, Extensibility, ViewModels, ShowJournalViewExtensionsManager;
    var __moduleName = context_50 && context_50.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_26_1) {
                ViewExtensionsManagerBase_26 = ViewExtensionsManagerBase_26_1;
            }
        ],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            ViewModels = Commerce.ViewModels;
            ShowJournalViewExtensionsManager = (function (_super) {
                __extends(ShowJournalViewExtensionsManager, _super);
                function ShowJournalViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "ShowJournalView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.ShowJournalViewModel.viewExtensionManager = _this;
                    return _this;
                }
                ShowJournalViewExtensionsManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.transactionListConfiguration, ShowJournalViewExtensionsManager.TRANSACTION_LIST_NAME));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.customerOrderHistoryListConfiguration, ShowJournalViewExtensionsManager.CUSTOMER_ORDER_HISTORY_LIST_NAME));
                        extensionLoadPromises.push(this._loadCustomSearchFilters(extensionPackage, viewConfig.searchFilters));
                        extensionLoadPromises.push(this._loadLinesGrid(extensionPackage, viewConfig.linesGrid, "LinesGrid"));
                        extensionLoadPromises.push(this._loadLinesGrid(extensionPackage, viewConfig.paymentsGrid, "PaymentsGrid"));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                ShowJournalViewExtensionsManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                ShowJournalViewExtensionsManager.prototype.getCustomTransactionListColumns = function () {
                    return this._getCustomColumns(ShowJournalViewExtensionsManager.TRANSACTION_LIST_NAME);
                };
                ShowJournalViewExtensionsManager.prototype.getCustomerOrderHistoryListColumns = function () {
                    return this._getCustomColumns(ShowJournalViewExtensionsManager.CUSTOMER_ORDER_HISTORY_LIST_NAME);
                };
                ShowJournalViewExtensionsManager.prototype.getCustomSearchFilterDefinitions = function () {
                    return this._getCustomSearchFilters();
                };
                ShowJournalViewExtensionsManager.prototype.getCustomLinesGridItemSubfields = function () {
                    var customLinesGridItemSubfields = this._getCustomGridItemSubfields("LinesGrid");
                    return new Extensibility.CustomGridItemSubfieldsViewModel(customLinesGridItemSubfields);
                };
                ShowJournalViewExtensionsManager.prototype.getCustomPaymentsGridItemSubfields = function () {
                    var customPaymentsGridItemSubfields = this._getCustomGridItemSubfields("PaymentsGrid");
                    return new Extensibility.CustomGridItemSubfieldsViewModel(customPaymentsGridItemSubfields);
                };
                ShowJournalViewExtensionsManager.TRANSACTION_LIST_NAME = "TransactionList";
                ShowJournalViewExtensionsManager.CUSTOMER_ORDER_HISTORY_LIST_NAME = "CustomerOrderHistoryList";
                return ShowJournalViewExtensionsManager;
            }(ViewExtensionsManagerBase_26.ViewExtensionsManagerBase));
            exports_50("ShowJournalViewExtensionsManager", ShowJournalViewExtensionsManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/StockCountDetailsViewExtensionManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_51, context_51) {
    "use strict";
    var ViewExtensionsManagerBase_27, ViewModels, StockCountDetailsViewExtensionManager;
    var __moduleName = context_51 && context_51.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_27_1) {
                ViewExtensionsManagerBase_27 = ViewExtensionsManagerBase_27_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            StockCountDetailsViewExtensionManager = (function (_super) {
                __extends(StockCountDetailsViewExtensionManager, _super);
                function StockCountDetailsViewExtensionManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "StockCountDetailsView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.StockCountDetailsViewModel.viewExtensionManager = _this;
                    return _this;
                }
                StockCountDetailsViewExtensionManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.stockCountLinesConfiguration, StockCountDetailsViewExtensionManager.STOCK_COUNT_LINES_NAME));
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                StockCountDetailsViewExtensionManager.prototype.getStockCountLinesColumns = function () {
                    return this._getCustomColumns(StockCountDetailsViewExtensionManager.STOCK_COUNT_LINES_NAME);
                };
                StockCountDetailsViewExtensionManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                StockCountDetailsViewExtensionManager.STOCK_COUNT_LINES_NAME = "StockCountLines";
                return StockCountDetailsViewExtensionManager;
            }(ViewExtensionsManagerBase_27.ViewExtensionsManagerBase));
            exports_51("StockCountDetailsViewExtensionManager", StockCountDetailsViewExtensionManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensions/TransferOrderDetailsViewExtensionManager", ["ManifestLoaders/ViewExtensions/ViewExtensionsManagerBase"], function (exports_52, context_52) {
    "use strict";
    var ViewExtensionsManagerBase_28, ViewModels, TransferOrderDetailsViewExtensionManager;
    var __moduleName = context_52 && context_52.id;
    return {
        setters: [
            function (ViewExtensionsManagerBase_28_1) {
                ViewExtensionsManagerBase_28 = ViewExtensionsManagerBase_28_1;
            }
        ],
        execute: function () {
            ViewModels = Commerce.ViewModels;
            TransferOrderDetailsViewExtensionManager = (function (_super) {
                __extends(TransferOrderDetailsViewExtensionManager, _super);
                function TransferOrderDetailsViewExtensionManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, "TransferOrderDetailsView", loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) || this;
                    ViewModels.TransferOrderDetailsViewModel.viewExtensionManager = _this;
                    return _this;
                }
                TransferOrderDetailsViewExtensionManager.prototype.loadAsync = function (extensionPackage, viewConfig) {
                    var extensionLoadPromises = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                        extensionLoadPromises.push(this._loadAppBarCommands(extensionPackage, viewConfig.appBarCommands));
                        extensionLoadPromises.push(this._loadCustomListLayout(extensionPackage, viewConfig.transferOrderLinesListConfiguration, TransferOrderDetailsViewExtensionManager.TRANSFER_ORDER_LINES_LIST_NAME));
                    }
                    return Promise.all(extensionLoadPromises).then(function () { return void 0; });
                };
                TransferOrderDetailsViewExtensionManager.prototype.getTransferOrderDetailsLinesColumns = function () {
                    return this._getCustomColumns(TransferOrderDetailsViewExtensionManager.TRANSFER_ORDER_LINES_LIST_NAME);
                };
                TransferOrderDetailsViewExtensionManager.prototype.getAppBarCommands = function () {
                    return this._getAppBarCommands();
                };
                TransferOrderDetailsViewExtensionManager.TRANSFER_ORDER_LINES_LIST_NAME = "TransferOrderLinesList";
                return TransferOrderDetailsViewExtensionManager;
            }(ViewExtensionsManagerBase_28.ViewExtensionsManagerBase));
            exports_52("TransferOrderDetailsViewExtensionManager", TransferOrderDetailsViewExtensionManager);
        }
    };
});
System.register("ManifestLoaders/ViewExtensionsLoader", ["ManifestLoaders/ManifestLoaderBase", "ManifestLoaders/ViewExtensions/AddressAddEditViewExtensionsManager", "ManifestLoaders/ViewExtensions/CartViewExtensionsManager", "ManifestLoaders/ViewExtensions/CustomerAddEditViewExtensionsManager", "ManifestLoaders/ViewExtensions/CustomerDetailsViewExtensionsManager", "ManifestLoaders/ViewExtensions/InventoryDocumentListViewExtensionsManager", "ManifestLoaders/ViewExtensions/InventoryDocumentShippingAndReceivingViewExtensionManager", "ManifestLoaders/ViewExtensions/InventoryLookupMatrixViewExtensionsManager", "ManifestLoaders/ViewExtensions/InventoryLookupViewExtensionsManager", "ManifestLoaders/ViewExtensions/FulfillmentLineViewExtensionsManager", "ManifestLoaders/ViewExtensions/HealthCheckViewExtensionsManager", "ManifestLoaders/ViewExtensions/ManageShiftsViewExtensionsManager", "ManifestLoaders/ViewExtensions/PaymentViewExtensionsManager", "ManifestLoaders/ViewExtensions/PickingAndReceivingDetailsViewExtensionsManager", "ManifestLoaders/ViewExtensions/PriceCheckViewExtensionsManager", "ManifestLoaders/ViewExtensions/ReportDetailsViewExtensionsManager", "ManifestLoaders/ViewExtensions/ResumeCartViewExtensionsManager", "ManifestLoaders/ViewExtensions/ReturnTransactionViewExtensionsManager", "ManifestLoaders/ViewExtensions/SalesInvoiceDetailsViewExtensionsManager", "ManifestLoaders/ViewExtensions/SalesInvoicesViewExtensionsManager", "ManifestLoaders/ViewExtensions/SearchOrdersViewExtensionsManager", "ManifestLoaders/ViewExtensions/SearchPickingAndReceivingViewExtensionsManager", "ManifestLoaders/ViewExtensions/SearchStockCountViewExtensionsManager", "ManifestLoaders/ViewExtensions/SearchViewExtensionsManager", "ManifestLoaders/ViewExtensions/SimpleProductDetailsViewExtensionsManager", "ManifestLoaders/ViewExtensions/ShippingMethodsViewExtensionsManager", "ManifestLoaders/ViewExtensions/ShowJournalViewExtensionsManager", "ManifestLoaders/ViewExtensions/StockCountDetailsViewExtensionManager", "ManifestLoaders/ViewExtensions/TransferOrderDetailsViewExtensionManager"], function (exports_53, context_53) {
    "use strict";
    var ManifestLoaderBase_9, AddressAddEditViewExtensionsManager_1, CartViewExtensionsManager_1, CustomerAddEditViewExtensionsManager_1, CustomerDetailsViewExtensionsManager_1, InventoryDocumentListViewExtensionsManager_1, InventoryDocumentShippingAndReceivingViewExtensionManager_1, InventoryLookupMatrixViewExtensionsManager_1, InventoryLookupViewExtensionsManager_1, FulfillmentLineViewExtensionsManager_1, HealthCheckViewExtensionsManager_1, ManageShiftsViewExtensionsManager_1, PaymentViewExtensionsManager_1, PickingAndReceivingDetailsViewExtensionsManager_1, PriceCheckViewExtensionsManager_1, ReportDetailsViewExtensionsManager_1, ResumeCartViewExtensionsManager_1, ReturnTransactionViewExtensionsManager_1, SalesInvoiceDetailsViewExtensionsManager_1, SalesInvoicesViewExtensionsManager_1, SearchOrdersViewExtensionsManager_1, SearchPickingAndReceivingViewExtensionsManager_1, SearchStockCountViewExtensionsManager_1, SearchViewExtensionsManager_1, SimpleProductDetailsViewExtensionsManager_1, ShippingMethodsViewExtensionsManager_1, ShowJournalViewExtensionsManager_1, StockCountDetailsViewExtensionManager_1, TransferOrderDetailsViewExtensionManager_1, ViewExtensionsLoader;
    var __moduleName = context_53 && context_53.id;
    return {
        setters: [
            function (ManifestLoaderBase_9_1) {
                ManifestLoaderBase_9 = ManifestLoaderBase_9_1;
            },
            function (AddressAddEditViewExtensionsManager_1_1) {
                AddressAddEditViewExtensionsManager_1 = AddressAddEditViewExtensionsManager_1_1;
            },
            function (CartViewExtensionsManager_1_1) {
                CartViewExtensionsManager_1 = CartViewExtensionsManager_1_1;
            },
            function (CustomerAddEditViewExtensionsManager_1_1) {
                CustomerAddEditViewExtensionsManager_1 = CustomerAddEditViewExtensionsManager_1_1;
            },
            function (CustomerDetailsViewExtensionsManager_1_1) {
                CustomerDetailsViewExtensionsManager_1 = CustomerDetailsViewExtensionsManager_1_1;
            },
            function (InventoryDocumentListViewExtensionsManager_1_1) {
                InventoryDocumentListViewExtensionsManager_1 = InventoryDocumentListViewExtensionsManager_1_1;
            },
            function (InventoryDocumentShippingAndReceivingViewExtensionManager_1_1) {
                InventoryDocumentShippingAndReceivingViewExtensionManager_1 = InventoryDocumentShippingAndReceivingViewExtensionManager_1_1;
            },
            function (InventoryLookupMatrixViewExtensionsManager_1_1) {
                InventoryLookupMatrixViewExtensionsManager_1 = InventoryLookupMatrixViewExtensionsManager_1_1;
            },
            function (InventoryLookupViewExtensionsManager_1_1) {
                InventoryLookupViewExtensionsManager_1 = InventoryLookupViewExtensionsManager_1_1;
            },
            function (FulfillmentLineViewExtensionsManager_1_1) {
                FulfillmentLineViewExtensionsManager_1 = FulfillmentLineViewExtensionsManager_1_1;
            },
            function (HealthCheckViewExtensionsManager_1_1) {
                HealthCheckViewExtensionsManager_1 = HealthCheckViewExtensionsManager_1_1;
            },
            function (ManageShiftsViewExtensionsManager_1_1) {
                ManageShiftsViewExtensionsManager_1 = ManageShiftsViewExtensionsManager_1_1;
            },
            function (PaymentViewExtensionsManager_1_1) {
                PaymentViewExtensionsManager_1 = PaymentViewExtensionsManager_1_1;
            },
            function (PickingAndReceivingDetailsViewExtensionsManager_1_1) {
                PickingAndReceivingDetailsViewExtensionsManager_1 = PickingAndReceivingDetailsViewExtensionsManager_1_1;
            },
            function (PriceCheckViewExtensionsManager_1_1) {
                PriceCheckViewExtensionsManager_1 = PriceCheckViewExtensionsManager_1_1;
            },
            function (ReportDetailsViewExtensionsManager_1_1) {
                ReportDetailsViewExtensionsManager_1 = ReportDetailsViewExtensionsManager_1_1;
            },
            function (ResumeCartViewExtensionsManager_1_1) {
                ResumeCartViewExtensionsManager_1 = ResumeCartViewExtensionsManager_1_1;
            },
            function (ReturnTransactionViewExtensionsManager_1_1) {
                ReturnTransactionViewExtensionsManager_1 = ReturnTransactionViewExtensionsManager_1_1;
            },
            function (SalesInvoiceDetailsViewExtensionsManager_1_1) {
                SalesInvoiceDetailsViewExtensionsManager_1 = SalesInvoiceDetailsViewExtensionsManager_1_1;
            },
            function (SalesInvoicesViewExtensionsManager_1_1) {
                SalesInvoicesViewExtensionsManager_1 = SalesInvoicesViewExtensionsManager_1_1;
            },
            function (SearchOrdersViewExtensionsManager_1_1) {
                SearchOrdersViewExtensionsManager_1 = SearchOrdersViewExtensionsManager_1_1;
            },
            function (SearchPickingAndReceivingViewExtensionsManager_1_1) {
                SearchPickingAndReceivingViewExtensionsManager_1 = SearchPickingAndReceivingViewExtensionsManager_1_1;
            },
            function (SearchStockCountViewExtensionsManager_1_1) {
                SearchStockCountViewExtensionsManager_1 = SearchStockCountViewExtensionsManager_1_1;
            },
            function (SearchViewExtensionsManager_1_1) {
                SearchViewExtensionsManager_1 = SearchViewExtensionsManager_1_1;
            },
            function (SimpleProductDetailsViewExtensionsManager_1_1) {
                SimpleProductDetailsViewExtensionsManager_1 = SimpleProductDetailsViewExtensionsManager_1_1;
            },
            function (ShippingMethodsViewExtensionsManager_1_1) {
                ShippingMethodsViewExtensionsManager_1 = ShippingMethodsViewExtensionsManager_1_1;
            },
            function (ShowJournalViewExtensionsManager_1_1) {
                ShowJournalViewExtensionsManager_1 = ShowJournalViewExtensionsManager_1_1;
            },
            function (StockCountDetailsViewExtensionManager_1_1) {
                StockCountDetailsViewExtensionManager_1 = StockCountDetailsViewExtensionManager_1_1;
            },
            function (TransferOrderDetailsViewExtensionManager_1_1) {
                TransferOrderDetailsViewExtensionManager_1 = TransferOrderDetailsViewExtensionManager_1_1;
            }
        ],
        execute: function () {
            ViewExtensionsLoader = (function (_super) {
                __extends(ViewExtensionsLoader, _super);
                function ViewExtensionsLoader(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl) {
                    var _this = _super.call(this, loadModuleImpl) || this;
                    _this._viewExtensionsManagerMap = {
                        "AddressAddEditView": new AddressAddEditViewExtensionsManager_1.AddressAddEditViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "CartView": new CartViewExtensionsManager_1.CartViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "CustomerAddEditView": new CustomerAddEditViewExtensionsManager_1.CustomerAddEditViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "CustomerDetailsView": new CustomerDetailsViewExtensionsManager_1.CustomerDetailsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "InventoryDocumentListView": new InventoryDocumentListViewExtensionsManager_1.InventoryDocumentListViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "InventoryDocumentShippingAndReceivingView": new InventoryDocumentShippingAndReceivingViewExtensionManager_1.InventoryDocumentShippingAndReceivingViewExtensionManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "InventoryLookupMatrixView": new InventoryLookupMatrixViewExtensionsManager_1.InventoryLookupMatrixViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "InventoryLookupView": new InventoryLookupViewExtensionsManager_1.InventoryLookupViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "FulfillmentLineView": new FulfillmentLineViewExtensionsManager_1.FulfillmentLineViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "HealthCheckView": new HealthCheckViewExtensionsManager_1.HealthCheckViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "ManageShiftsView": new ManageShiftsViewExtensionsManager_1.ManageShiftsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "PaymentView": new PaymentViewExtensionsManager_1.PaymentViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "PickingAndReceivingDetailsView": new PickingAndReceivingDetailsViewExtensionsManager_1.PickingAndReceivingDetailsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "PriceCheckView": new PriceCheckViewExtensionsManager_1.PriceCheckViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "ReportDetailsView": new ReportDetailsViewExtensionsManager_1.ReportDetailsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "ResumeCartView": new ResumeCartViewExtensionsManager_1.ResumeCartViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "ReturnTransactionView": new ReturnTransactionViewExtensionsManager_1.ReturnTransactionViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "SalesInvoiceDetailsView": new SalesInvoiceDetailsViewExtensionsManager_1.SalesInvoiceDetailsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "SalesInvoicesView": new SalesInvoicesViewExtensionsManager_1.SalesInvoicesViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "SearchOrdersView": new SearchOrdersViewExtensionsManager_1.SearchOrdersViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "SearchPickingAndReceivingView": new SearchPickingAndReceivingViewExtensionsManager_1.SearchPickingAndReceivingViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "SearchStockCountView": new SearchStockCountViewExtensionsManager_1.SearchStockCountViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "SearchView": new SearchViewExtensionsManager_1.SearchViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "ShippingMethodsView": new ShippingMethodsViewExtensionsManager_1.ShippingMethodsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "ShowJournalView": new ShowJournalViewExtensionsManager_1.ShowJournalViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "SimpleProductDetailsView": new SimpleProductDetailsViewExtensionsManager_1.SimpleProductDetailsViewExtensionsManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "StockCountDetailsView": new StockCountDetailsViewExtensionManager_1.StockCountDetailsViewExtensionManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl),
                        "TransferOrderDetailsView": new TransferOrderDetailsViewExtensionManager_1.TransferOrderDetailsViewExtensionManager(loadModuleImpl, createAndInsertHtmlImpl, renderHtmlImpl)
                    };
                    return _this;
                }
                ViewExtensionsLoader.prototype.load = function (extensionPackage, viewExtension) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(viewExtension)) {
                        return Promise.resolve();
                    }
                    return this._loadExtension(viewExtension, extensionPackage);
                };
                ViewExtensionsLoader.prototype._loadExtension = function (extension, extensionPackage) {
                    var _this = this;
                    var pendingModuleLoads = [];
                    Object.keys(this._viewExtensionsManagerMap).forEach(function (key) {
                        var loader = _this._viewExtensionsManagerMap[key];
                        var viewConfig = extension[key];
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(loader) && !Commerce.ObjectExtensions.isNullOrUndefined(viewConfig)) {
                            pendingModuleLoads.push(loader.loadAsync(extensionPackage, viewConfig));
                        }
                    });
                    return Promise.all(pendingModuleLoads).then(function () { return void 0; });
                };
                return ViewExtensionsLoader;
            }(ManifestLoaderBase_9.default));
            exports_53("default", ViewExtensionsLoader);
        }
    };
});
System.register("ManifestLoaders/ViewsLoader", ["PosApi/Create/Views", "Extension", "NewViewConstants", "ManifestLoaders/ManifestLoaderBase"], function (exports_54, context_54) {
    "use strict";
    var Views_1, Extension_12, NewViewConstants, ManifestLoaderBase_10, ExtensionLoadError, ExtensionFailureReason, ViewsLoader;
    var __moduleName = context_54 && context_54.id;
    return {
        setters: [
            function (Views_1_1) {
                Views_1 = Views_1_1;
            },
            function (Extension_12_1) {
                Extension_12 = Extension_12_1;
            },
            function (NewViewConstants_2) {
                NewViewConstants = NewViewConstants_2;
            },
            function (ManifestLoaderBase_10_1) {
                ManifestLoaderBase_10 = ManifestLoaderBase_10_1;
            }
        ],
        execute: function () {
            ExtensionLoadError = Commerce.Extensibility.ExtensionLoadError;
            ExtensionFailureReason = Commerce.Extensibility.ExtensionFailureReason;
            ViewsLoader = (function (_super) {
                __extends(ViewsLoader, _super);
                function ViewsLoader(loadModuleImpl, createCustomViewControllerAdapterType, registerViewImpl) {
                    var _this = _super.call(this, loadModuleImpl) || this;
                    _this._createCustomViewControllerAdapterType = createCustomViewControllerAdapterType;
                    _this._registerView = registerViewImpl;
                    return _this;
                }
                ViewsLoader.prototype.load = function (extensionPackage, manifestItems) {
                    var _this = this;
                    if (!Commerce.ArrayExtensions.hasElements(manifestItems)) {
                        return Promise.resolve();
                    }
                    if (manifestItems.some(function (item) { return Commerce.ObjectExtensions.isNullOrUndefined(item); })) {
                        Commerce.RetailLogger.extensibilityFrameworkViewManifestItemNullOrUndefined(extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    }
                    var loadSequence = Promise.resolve();
                    manifestItems
                        .filter(function (item) { return !Commerce.ObjectExtensions.isNullOrUndefined(item); })
                        .forEach(function (manifestItem) {
                        loadSequence = loadSequence.then(function () {
                            return _this._loadView(manifestItem, extensionPackage);
                        });
                    });
                    return loadSequence;
                };
                ViewsLoader.prototype._loadView = function (manifestItem, extensionPackage) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var extensionPointName = "NewView";
                    var extensionPointType = Commerce.Extensibility.ExtensionPointType.NewView;
                    var extensionName = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.name) ? manifestItem.pageName : manifestItem.name;
                    var extensionModulePath = manifestItem.viewControllerPath;
                    var extensionDescription = Commerce.StringExtensions.isNullOrWhitespace(manifestItem.description)
                        ? Commerce.StringResourceManager.getString("string_7474")
                        : manifestItem.description;
                    return Promise.resolve().then(function () {
                        if (Commerce.StringExtensions.isNullOrWhitespace(manifestItem.pageName) ||
                            Commerce.StringExtensions.isNullOrWhitespace(manifestItem.viewDirectory)) {
                            return Promise.reject("Loading view failed because the pageName or viewDirectory is not set.");
                        }
                        var viewDirectory = extensionPackage.packageInfo.baseUrl + "/" + manifestItem.viewDirectory;
                        var strPagePath = viewDirectory + manifestItem.pageName + ".html";
                        var strPhonePagePath = viewDirectory + manifestItem.phonePageName + ".html";
                        extensionPointName += " - " + manifestItem.pageName;
                        return _this.loadModule(extensionPackage.packageInfo.baseUrl, manifestItem.viewControllerPath)
                            .then(function (viewModule) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(viewModule) &&
                                !Commerce.ObjectExtensions.isNullOrUndefined(viewModule.default)) {
                                if (_this._isExtensionViewControllerBase(viewModule.default)) {
                                    if (extensionPackage.isIndependentPackage) {
                                        Commerce.RetailLogger.extensibilityFrameworkViewFailedDueToExtendingDeprecatedExtensionViewControllerBase(manifestItem.viewControllerPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                        var extensionLoadError = new ExtensionLoadError(ExtensionFailureReason.NotSupportedInIndependentPackagingModel);
                                        return Promise.reject(extensionLoadError);
                                    }
                                    return _this._loadDeprecatedExtensionView(extensionPackage, manifestItem, viewDirectory, strPagePath, strPhonePagePath, viewModule);
                                }
                                else if (_this._isCustomViewController(viewModule.default)) {
                                    var createCustomViewController = function (messageChannel, options) {
                                        var context = __assign(__assign(__assign({}, extensionPackage.context), extensionPackage.extensionControlFactoryContext), { messageChannel: messageChannel });
                                        var viewModuleDefaultExport = viewModule.default;
                                        var viewController = new viewModuleDefaultExport(context, options);
                                        return viewController;
                                    };
                                    var viewControllerAdapterType = _this._createCustomViewControllerAdapterType(createCustomViewController);
                                    var pageName = _this._getPageName(extensionPackage, manifestItem);
                                    var phonePageName = _this._getPhonePageName(extensionPackage, manifestItem);
                                    _this._registerView({
                                        title: manifestItem.title,
                                        pageName: pageName,
                                        pagePath: strPagePath,
                                        phonePageName: phonePageName,
                                        phonePagePath: strPhonePagePath,
                                        viewDirectory: viewDirectory,
                                        viewControllerType: viewControllerAdapterType
                                    });
                                    Commerce.RetailLogger.viewsLoaderNewViewAdded(strPagePath, strPhonePagePath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                    return Promise.resolve();
                                }
                                else {
                                    Commerce.RetailLogger.extensibilityFrameworkTypeMismatchWhileLoadingViews(manifestItem.viewControllerPath, "ExtensionViewControllerBase", correlationId);
                                    return Promise.reject("New view module does not inherit from ExtensionViewControllerBase.");
                                }
                            }
                            else {
                                Commerce.RetailLogger.viewsLoaderViewLoadFailedDueToInvalidViewModule(manifestItem.viewControllerPath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                                return Promise.reject("Loading view failed because the view module is invalid.");
                            }
                        }, function (error) {
                            Commerce.RetailLogger.viewsLoaderViewLoadFailedDueToErrorImportingModule(manifestItem.viewControllerPath, Commerce.ErrorHelper.serializeError(error), extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                            return Promise.reject(error);
                        });
                    }).then(function () {
                        var extension = new Extension_12.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription);
                        extensionPackage.addExtension(extension);
                    }, function (reason) {
                        var loadError = Commerce.ErrorHelper.toJavascriptError(reason, correlationId);
                        var extension = new Extension_12.default(extensionPointType, extensionPointName, extensionName, extensionModulePath, extensionDescription, loadError);
                        extensionPackage.addExtension(extension);
                    });
                };
                ViewsLoader.prototype._loadDeprecatedExtensionView = function (extensionPackage, manifestItem, viewDirectory, strPagePath, strPhonePagePath, viewModule) {
                    var viewExtensionContext = __assign(__assign({}, extensionPackage.context), extensionPackage.extensionControlFactoryContext);
                    var pageName = this._getPageName(extensionPackage, manifestItem);
                    var phonePageName = this._getPhonePageName(extensionPackage, manifestItem);
                    this._registerView({
                        title: manifestItem.title,
                        pageName: pageName,
                        pagePath: strPagePath,
                        phonePageName: phonePageName,
                        phonePagePath: strPhonePagePath,
                        viewDirectory: viewDirectory,
                        viewControllerType: viewModule.default,
                        extensionContext: viewExtensionContext
                    });
                    Commerce.RetailLogger.viewsLoaderNewViewAdded(strPagePath, strPhonePagePath, extensionPackage.packageInfo.name, extensionPackage.packageInfo.publisher, extensionPackage.packageInfo.version);
                    return Promise.resolve();
                };
                ViewsLoader.prototype._getPageName = function (extensionPackage, manifestItem) {
                    var pageName = Commerce.StringExtensions.format(NewViewConstants.PAGE_NAME_FORMAT, extensionPackage.packageInfo.id, manifestItem.pageName);
                    return pageName;
                };
                ViewsLoader.prototype._getPhonePageName = function (extensionPackage, manifestItem) {
                    var phonePageName = Commerce.StringExtensions.format(NewViewConstants.PAGE_NAME_FORMAT, extensionPackage.packageInfo.id, manifestItem.phonePageName);
                    return phonePageName;
                };
                ViewsLoader.prototype._isExtensionViewControllerBase = function (viewModuleDefaultExport) {
                    return !Commerce.ObjectExtensions.isNullOrUndefined(viewModuleDefaultExport)
                        && viewModuleDefaultExport.prototype instanceof Views_1.ExtensionViewControllerBase;
                };
                ViewsLoader.prototype._isCustomViewController = function (viewModuleDefaultExport) {
                    return !Commerce.ObjectExtensions.isNullOrUndefined(viewModuleDefaultExport)
                        && viewModuleDefaultExport.prototype instanceof Views_1.CustomViewControllerBase;
                };
                return ViewsLoader;
            }(ManifestLoaderBase_10.default));
            exports_54("default", ViewsLoader);
        }
    };
});
System.register("ExtensionsLoaderFactory", ["ExtensionsLoader", "ManifestLoaders/ControlsLoader", "ManifestLoaders/DualDisplayExtensionsLoader", "ManifestLoaders/OperationsLoader", "ManifestLoaders/RequestHandlerExtensionsLoader", "ManifestLoaders/RequestHandlersLoader", "ManifestLoaders/ResourcesLoader", "ManifestLoaders/TemplatedDialogsLoader", "ManifestLoaders/TriggerHandlersLoader", "ManifestLoaders/ViewExtensionsLoader", "ManifestLoaders/ViewsLoader", "PosApi/TypeExtensions"], function (exports_55, context_55) {
    "use strict";
    var ExtensionsLoader_1, ControlsLoader_1, DualDisplayExtensionsLoader_1, OperationsLoader_1, RequestHandlerExtensionsLoader_1, RequestHandlersLoader_1, ResourcesLoader_1, TemplatedDialogsLoader_1, TriggerHandlersLoader_1, ViewExtensionsLoader_1, ViewsLoader_1, TypeExtensions_8, ExtensionsLoaderFactory;
    var __moduleName = context_55 && context_55.id;
    return {
        setters: [
            function (ExtensionsLoader_1_1) {
                ExtensionsLoader_1 = ExtensionsLoader_1_1;
            },
            function (ControlsLoader_1_1) {
                ControlsLoader_1 = ControlsLoader_1_1;
            },
            function (DualDisplayExtensionsLoader_1_1) {
                DualDisplayExtensionsLoader_1 = DualDisplayExtensionsLoader_1_1;
            },
            function (OperationsLoader_1_1) {
                OperationsLoader_1 = OperationsLoader_1_1;
            },
            function (RequestHandlerExtensionsLoader_1_1) {
                RequestHandlerExtensionsLoader_1 = RequestHandlerExtensionsLoader_1_1;
            },
            function (RequestHandlersLoader_1_1) {
                RequestHandlersLoader_1 = RequestHandlersLoader_1_1;
            },
            function (ResourcesLoader_1_1) {
                ResourcesLoader_1 = ResourcesLoader_1_1;
            },
            function (TemplatedDialogsLoader_1_1) {
                TemplatedDialogsLoader_1 = TemplatedDialogsLoader_1_1;
            },
            function (TriggerHandlersLoader_1_1) {
                TriggerHandlersLoader_1 = TriggerHandlersLoader_1_1;
            },
            function (ViewExtensionsLoader_1_1) {
                ViewExtensionsLoader_1 = ViewExtensionsLoader_1_1;
            },
            function (ViewsLoader_1_1) {
                ViewsLoader_1 = ViewsLoader_1_1;
            },
            function (TypeExtensions_8_1) {
                TypeExtensions_8 = TypeExtensions_8_1;
            }
        ],
        execute: function () {
            ExtensionsLoaderFactory = (function () {
                function ExtensionsLoaderFactory() {
                    throw new Error("ExtensionsLoaderFactory can not be constructed");
                }
                Object.defineProperty(ExtensionsLoaderFactory, "extensionsLoader", {
                    get: function () {
                        return this._extensionsLoader;
                    },
                    enumerable: true,
                    configurable: true
                });
                ExtensionsLoaderFactory.createPOSExtensionsLoader = function (options) {
                    if (TypeExtensions_8.ObjectExtensions.isNullOrUndefined(this._extensionsLoader)) {
                        var posExtensionsLoader = new ExtensionsLoader_1.default({
                            viewExtensions: new ViewExtensionsLoader_1.default(options.loadModuleAsync, options.createAndInsertHtml, options.renderHtmlAsync),
                            views: new ViewsLoader_1.default(options.loadModuleAsync, options.createCustomViewControllerAdapterType, options.registerView),
                            requestHandlerExtensions: new RequestHandlerExtensionsLoader_1.default(options.loadModuleAsync),
                            requestHandlers: new RequestHandlersLoader_1.default(options.loadModuleAsync),
                            operations: new OperationsLoader_1.default(options.loadModuleAsync),
                            triggers: new TriggerHandlersLoader_1.default(options.loadModuleAsync),
                            resources: new ResourcesLoader_1.default(options.loadModuleAsync, options.loadJsonAsync, options.addCultureInfo),
                            controls: new ControlsLoader_1.default(options.loadModuleAsync, options.createAndInsertHtml, options.renderHtmlAsync),
                            templatedDialogs: new TemplatedDialogsLoader_1.default(options.loadModuleAsync, options.cacheHtmlFragmentAsync, options.createTemplatedDialogProxy),
                            dualDisplayExtensions: null
                        }, options.loadJsonAsync, options.configureExtensionPackageDependencies, options.controlFactory);
                        this._extensionsLoader = posExtensionsLoader;
                        return this._extensionsLoader;
                    }
                    else {
                        throw "The ExtensionsLoaderFactory can not create an extensions loader more than once.";
                    }
                };
                ExtensionsLoaderFactory.createDualDisplayExtensionsLoader = function (options) {
                    if (TypeExtensions_8.ObjectExtensions.isNullOrUndefined(this._extensionsLoader)) {
                        var dualDisplayExtensionsLoader = new ExtensionsLoader_1.default({
                            viewExtensions: null,
                            views: null,
                            requestHandlerExtensions: null,
                            requestHandlers: null,
                            operations: null,
                            triggers: null,
                            resources: new ResourcesLoader_1.default(options.loadModuleAsync, options.loadJsonAsync, options.addCultureInfo),
                            controls: null,
                            templatedDialogs: null,
                            dualDisplayExtensions: new DualDisplayExtensionsLoader_1.default(options.loadModuleAsync, options.createAndInsertHtml, options.renderHtmlAsync)
                        }, options.loadJsonAsync, options.configureExtensionPackageDependencies, options.controlFactory);
                        this._extensionsLoader = dualDisplayExtensionsLoader;
                        return this._extensionsLoader;
                    }
                    else {
                        throw "The ExtensionsLoaderFactory can not create an extensions loader more than once.";
                    }
                };
                return ExtensionsLoaderFactory;
            }());
            exports_55("default", ExtensionsLoaderFactory);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // keWZayECix8TPjZLhHHH0Y5lDdtUg2vsslfMZ1G13lWg
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
// SIG // ghXVMIIV0QIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABiK9S1rmSbej5AAAAAAGIMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBJzAZBgkqhkiG9w0BCQMxDAYK
// SIG // KwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYKKwYB
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgOXvo/UODmLZD
// SIG // peSYZNNNm1CDXw9VuAdhQQCs3YhvB/IwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // dqZ63AXOHJZvPNUnjjYIYLL+s7DAczfvf8hTBqzu7GHR
// SIG // sHviDsJEfmKUluho7V/OWTp9MjJYPpmbs7IFShCoKpaU
// SIG // dlWho5oGrr10ixxIbGwPDUgZCpBv0N8O0qLMGezCWFL/
// SIG // DO+IF7HUsnozpwxYL+JNCNbysNJqBcemD+orUD5j4nKf
// SIG // 875GHJ1rwkvlwQZt9K5PVHNPOZtNSgmaka1qghLMu4Et
// SIG // 4+H5BsTYThjGaxOXuiJvtA5n1KlVqZxSatz7IH9y6cce
// SIG // m6rUsvYulAtChTnm/h1otTptmCzjNVGjvJU0Cd5J6Jq7
// SIG // z9LgGVB53j7t0JPw15kOr0grTRK6Wu+jFKGCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCC579X4cYCdI/uV
// SIG // k2x0MjF9rLV4Fgtqkrwld15xH/nK7gIGXz1EKhiuGBMy
// SIG // MDIwMDgyMzA0MDI0Mi43MDNaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjpEMDgyLTRCRkQtRUVCQTEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjwwggTxMIID2aADAgECAhMzAAABE7Nwhz36
// SIG // 8MgkAAAAAAETMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTky
// SIG // MVoXDTIxMDEyMTIzMTkyMVowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOkQwODItNEJGRC1FRUJBMSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvK3EHQFc+nmZ
// SIG // hgumEk3M6BIC6KA1DIPU67YgRc9DGFNGcbflRToaMivP
// SIG // V2DUC60DTAOI51VHCLWJStGFsRLDOjA3IWsBYFajR7ma
// SIG // gbYUT87TEeZGHGvPYFQjejk+qe5CBKstqgGNlnEPyRXl
// SIG // usIk7246W9tebdCwzg0jW9oMaMPP1reyEaNSj4sxKrEF
// SIG // xQAiCaO1z7rR9q8o+RakCRqmfud8KSzNw8osURkwIz2o
// SIG // phQCHtj7qVmY7nUUlTyxg3bM5Son1JMIBtyQx6ddggl3
// SIG // G0zJgJWhDbphOAWHo6owgi+P7XoTlgjDnzPWCOuu3eVU
// SIG // vKzYOjlDLkxgkdSfbF3GEQIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFNqZhHIbL+4XCO+SkRQfPCOAzp1SMB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBAA95
// SIG // zLCAr5HfZIiuz/1ndGtbYVx3z0umO4o6JMe7mCSPywti
// SIG // 1yNp6vBTf2gDwKQ+l2caenAm03IwAAWxVd3oL6zRl16b
// SIG // 6aDPXx4Xt9HTdVzp6IbBm10jDZfMaHYudjsUfRgzOI55
// SIG // qmPIpPfKLo8YWKoXKfaYnC+Ax7XZkWrClaCTrvqkitfA
// SIG // aB4/Q2lH1lWygCtD3a118MfmXUTB11X4o57VRr5nnoK4
// SIG // oH94NWaz+OMeOlRqI1LcLXDv6yuPu44lG0N0UElPLPCH
// SIG // ELtyFYRVUvyFHer5CorLU4uHzAEUFureCGOzB8wwbLdG
// SIG // q//jyVHjPt3/fkDlSuxhR3iPBbpNXSgwggZxMIIEWaAD
// SIG // AgECAgphCYEqAAAAAAACMA0GCSqGSIb3DQEBCwUAMIGI
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNy
// SIG // b3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkg
// SIG // MjAxMDAeFw0xMDA3MDEyMTM2NTVaFw0yNTA3MDEyMTQ2
// SIG // NTVaMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMIIB
// SIG // IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqR0N
// SIG // vHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvtfGhLLF/F
// SIG // w+Vhwna3PmYrW/AVUycEMR9BGxqVHc4JE458YTBZsTBE
// SIG // D/FgiIRUQwzXTbg4CLNC3ZOs1nMwVyaCo0UN0Or1R4HN
// SIG // vyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLBxKZd0WET
// SIG // bijGGvmGgLvfYfxGwScdJGcSchohiq9LZIlQYrFd/Xcf
// SIG // PfBXday9ikJNQFHRD5wGPmd/9WbAA5ZEfu/QS/1u5ZrK
// SIG // sajyeioKMfDaTgaRtogINeh4HLDpmc085y9Euqf03GS9
// SIG // pAHBIAmTeM38vMDJRF1eFpwBBU8iTQIDAQABo4IB5jCC
// SIG // AeIwEAYJKwYBBAGCNxUBBAMCAQAwHQYDVR0OBBYEFNVj
// SIG // OlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQBgjcUAgQM
// SIG // HgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAPBgNVHRMB
// SIG // Af8EBTADAQH/MB8GA1UdIwQYMBaAFNX2VsuP6KJcYmjR
// SIG // PZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6
// SIG // Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1
// SIG // Y3RzL01pY1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNybDBa
// SIG // BggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6
// SIG // Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWlj
// SIG // Um9vQ2VyQXV0XzIwMTAtMDYtMjMuY3J0MIGgBgNVHSAB
// SIG // Af8EgZUwgZIwgY8GCSsGAQQBgjcuAzCBgTA9BggrBgEF
// SIG // BQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL1BL
// SIG // SS9kb2NzL0NQUy9kZWZhdWx0Lmh0bTBABggrBgEFBQcC
// SIG // AjA0HjIgHQBMAGUAZwBhAGwAXwBQAG8AbABpAGMAeQBf
// SIG // AFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkqhkiG9w0B
// SIG // AQsFAAOCAgEAB+aIUQ3ixuCYP4FxAz2do6Ehb7Prpsz1
// SIG // Mb7PBeKp/vpXbRkws8LFZslq3/Xn8Hi9x6ieJeP5vO1r
// SIG // VFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/XPleFzWY
// SIG // JFZLdO9CEMivv3/Gf/I3fVo/HPKZeUqRUgCvOA8X9S95
// SIG // gWXZqbVr5MfO9sp6AG9LMEQkIjzP7QOllo9ZKby2/QTh
// SIG // cJ8ySif9Va8v/rbljjO7Yl+a21dA6fHOmWaQjP9qYn/d
// SIG // xUoLkSbiOewZSnFjnXshbcOco6I8+n99lmqQeKZt0uGc
// SIG // +R38ONiU9MalCpaGpL2eGq4EQoO4tYCbIjggtSXlZOz3
// SIG // 9L9+Y1klD3ouOVd2onGqBooPiRa6YacRy5rYDkeagMXQ
// SIG // zafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA3+cxB6ST
// SIG // OvdlR3jo+KhIq/fecn5ha293qYHLpwmsObvsxsvYgrRy
// SIG // zR30uIUBHoD7G4kqVDmyW9rIDVWZeodzOwjmmC3qjeAz
// SIG // LhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8ZQU3ghvkq
// SIG // mqMRZjDTu3QyS99je/WZii8bxyGvWbWu3EQ8l1Bx16HS
// SIG // xVXjad5XwdHeMMD9zOZN+w2/XU/pnR4ZOC+8z1gFLu8N
// SIG // oFA12u8JJxzVs341Hgi62jbb01+P3nSISRKhggLOMIIC
// SIG // NwIBATCB+KGB0KSBzTCByjELMAkGA1UEBhMCVVMxCzAJ
// SIG // BgNVBAgTAldBMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
// SIG // BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMg
// SIG // TGltaXRlZDEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // RDA4Mi00QkZELUVFQkExJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVAD1XVpFg052IY9KYOAmyEwqXuO6VoIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi7F/QMCIYDzIwMjAwODIzMTEyNDAw
// SIG // WhgPMjAyMDA4MjQxMTI0MDBaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOLsX9ACAQAwCgIBAAICA90CAf8wBwIB
// SIG // AAICEc0wCgIFAOLtsVACAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQAfyWUkmHJe
// SIG // 0U0dI3nC5FrKZg6SmE1+z7JHwaCohB+i+VX3ggyGxZfK
// SIG // d8KAvxDC5JJdYfS1a6XMFwD1igReNuxNsalzBI4kEe/9
// SIG // LFkLDt47uIVVWQcbjyllOxM4J4C2b9SX2nOTipycbxrE
// SIG // ywkcpAv7EPMfoiI3hekLL3DG1iS4QDGCAw0wggMJAgEB
// SIG // MIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAABE7Nwhz368MgkAAAAAAETMA0GCWCGSAFlAwQCAQUA
// SIG // oIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQw
// SIG // LwYJKoZIhvcNAQkEMSIEIOI202hU2Ehj2xF+XRmUd5sf
// SIG // Sb4e5xaFQEGaS9KSS5hWMIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgp9oXxI97H6tU5Vd6qSp0UoHPjJCl
// SIG // GZQbMZrwv2uAW60wgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAROzcIc9+vDIJAAAAAAB
// SIG // EzAiBCBoOCFCnwUHWSuqgV4FpDVtNs5p0DwTFx6OOz2c
// SIG // gmehcDANBgkqhkiG9w0BAQsFAASCAQCOX1d+EFz2kc8Y
// SIG // Ew27mDH7YUJdzKdSzDSSp3m50M3oR+LO/dghKNfNjV0Q
// SIG // pWaldNvstooTiFh5N2WnFzC8vEF0ghhYZHpsy8UInqNP
// SIG // wrEgBut3LiV9CWtnFvAwR+bEukMmCS5bv2If9NCClQgy
// SIG // E1oF8ngYBorSkqrbAz0xRVqUE3JNj7KjpFD7SnFZ0Dis
// SIG // fsRoeqlir/iJRitMbUSYNiuC147j2Mwqi8edsCQgq1ew
// SIG // KDirfAlDxJetVuqWgvn5FqclihwW9DcYChbP8q9mgYD8
// SIG // ja4nK2+uApNvQ4V/CQMsSxkRZf0IlDnYXPb2Eyy/Gls0
// SIG // HFOa9o1l9eLKGQDJafAy
// SIG // End signature block
