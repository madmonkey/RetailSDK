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
System.register("AsyncClient/Handlers/ApplySessionFileToOfflineDatabaseRequestHandler", [], function (exports_1, context_1) {
    "use strict";
    var ApplySessionFileToOfflineDatabaseRequestHandler;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ApplySessionFileToOfflineDatabaseRequestHandler = (function (_super) {
                __extends(ApplySessionFileToOfflineDatabaseRequestHandler, _super);
                function ApplySessionFileToOfflineDatabaseRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ApplySessionFileToOfflineDatabaseRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.ApplySessionFileToOfflineDatabaseRequest;
                };
                ApplySessionFileToOfflineDatabaseRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return ApplySessionFileToOfflineDatabaseRequestHandler;
            }(Commerce.RequestHandler));
            exports_1("default", ApplySessionFileToOfflineDatabaseRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/CheckInitialFullPackageRequiredRequestHandler", [], function (exports_2, context_2) {
    "use strict";
    var CheckInitialFullPackageRequiredRequestHandler;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            CheckInitialFullPackageRequiredRequestHandler = (function (_super) {
                __extends(CheckInitialFullPackageRequiredRequestHandler, _super);
                function CheckInitialFullPackageRequiredRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CheckInitialFullPackageRequiredRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.CheckInitialFullPackageRequiredRequest;
                };
                CheckInitialFullPackageRequiredRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return CheckInitialFullPackageRequiredRequestHandler;
            }(Commerce.RequestHandler));
            exports_2("default", CheckInitialFullPackageRequiredRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/DeleteExpiredSessionsRequestHandler", [], function (exports_3, context_3) {
    "use strict";
    var DeleteExpiredSessionsRequestHandler;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            DeleteExpiredSessionsRequestHandler = (function (_super) {
                __extends(DeleteExpiredSessionsRequestHandler, _super);
                function DeleteExpiredSessionsRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DeleteExpiredSessionsRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.DeleteExpiredSessionsRequest;
                };
                DeleteExpiredSessionsRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return DeleteExpiredSessionsRequestHandler;
            }(Commerce.RequestHandler));
            exports_3("default", DeleteExpiredSessionsRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/DownloadFileRequestHandler", [], function (exports_4, context_4) {
    "use strict";
    var DownloadFileRequestHandler;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            DownloadFileRequestHandler = (function (_super) {
                __extends(DownloadFileRequestHandler, _super);
                function DownloadFileRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DownloadFileRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.DownloadFileRequest;
                };
                DownloadFileRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return DownloadFileRequestHandler;
            }(Commerce.RequestHandler));
            exports_4("default", DownloadFileRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/GetOfflineSyncStatisticsRequestHandler", [], function (exports_5, context_5) {
    "use strict";
    var GetOfflineSyncStatisticsRequestHandler;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            GetOfflineSyncStatisticsRequestHandler = (function (_super) {
                __extends(GetOfflineSyncStatisticsRequestHandler, _super);
                function GetOfflineSyncStatisticsRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetOfflineSyncStatisticsRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.GetOfflineSyncStatisticsRequest;
                };
                GetOfflineSyncStatisticsRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return GetOfflineSyncStatisticsRequestHandler;
            }(Commerce.RequestHandler));
            exports_5("default", GetOfflineSyncStatisticsRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/GetOfflineSwitchErrorCodesRequestHandler", [], function (exports_6, context_6) {
    "use strict";
    var GetOfflineSwitchErrorCodesRequest, GetOfflineSwitchErrorCodesRequestHandler;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            GetOfflineSwitchErrorCodesRequest = Commerce.AsyncClient.GetOfflineSwitchErrorCodesRequest;
            GetOfflineSwitchErrorCodesRequestHandler = (function (_super) {
                __extends(GetOfflineSwitchErrorCodesRequestHandler, _super);
                function GetOfflineSwitchErrorCodesRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetOfflineSwitchErrorCodesRequestHandler.prototype.supportedRequestType = function () {
                    return GetOfflineSwitchErrorCodesRequest;
                };
                GetOfflineSwitchErrorCodesRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return GetOfflineSwitchErrorCodesRequestHandler;
            }(Commerce.RequestHandler));
            exports_6("default", GetOfflineSwitchErrorCodesRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/LoadTransactionDataFromOfflineDatabaseRequestHandler", [], function (exports_7, context_7) {
    "use strict";
    var LoadTransactionDataFromOfflineDatabaseRequestHandler;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            LoadTransactionDataFromOfflineDatabaseRequestHandler = (function (_super) {
                __extends(LoadTransactionDataFromOfflineDatabaseRequestHandler, _super);
                function LoadTransactionDataFromOfflineDatabaseRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                LoadTransactionDataFromOfflineDatabaseRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.LoadTransactionDataFromOfflineDatabaseRequest;
                };
                LoadTransactionDataFromOfflineDatabaseRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return LoadTransactionDataFromOfflineDatabaseRequestHandler;
            }(Commerce.RequestHandler));
            exports_7("default", LoadTransactionDataFromOfflineDatabaseRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/ProcessDataPackageRequestHandler", [], function (exports_8, context_8) {
    "use strict";
    var ProcessDataPackageRequestHandler;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
            ProcessDataPackageRequestHandler = (function (_super) {
                __extends(ProcessDataPackageRequestHandler, _super);
                function ProcessDataPackageRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ProcessDataPackageRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.ProcessDataPackageRequest;
                };
                ProcessDataPackageRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return ProcessDataPackageRequestHandler;
            }(Commerce.RequestHandler));
            exports_8("default", ProcessDataPackageRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/PurgeOfflineTransactionsRequestHandler", [], function (exports_9, context_9) {
    "use strict";
    var PurgeOfflineTransactionsRequestHandler;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            PurgeOfflineTransactionsRequestHandler = (function (_super) {
                __extends(PurgeOfflineTransactionsRequestHandler, _super);
                function PurgeOfflineTransactionsRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PurgeOfflineTransactionsRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.PurgeOfflineTransactionsRequest;
                };
                PurgeOfflineTransactionsRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return PurgeOfflineTransactionsRequestHandler;
            }(Commerce.RequestHandler));
            exports_9("default", PurgeOfflineTransactionsRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/StripMasterDataRequestHandler", [], function (exports_10, context_10) {
    "use strict";
    var StripMasterDataRequestHandler;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
            StripMasterDataRequestHandler = (function (_super) {
                __extends(StripMasterDataRequestHandler, _super);
                function StripMasterDataRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                StripMasterDataRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.StripMasterDataRequest;
                };
                StripMasterDataRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return StripMasterDataRequestHandler;
            }(Commerce.RequestHandler));
            exports_10("default", StripMasterDataRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/UpdateDownloadSessionStatusRequestHandler", [], function (exports_11, context_11) {
    "use strict";
    var UpdateDownloadSessionStatusRequestHandler;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [],
        execute: function () {
            UpdateDownloadSessionStatusRequestHandler = (function (_super) {
                __extends(UpdateDownloadSessionStatusRequestHandler, _super);
                function UpdateDownloadSessionStatusRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UpdateDownloadSessionStatusRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.UpdateDownloadSessionStatusRequest;
                };
                UpdateDownloadSessionStatusRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return UpdateDownloadSessionStatusRequestHandler;
            }(Commerce.RequestHandler));
            exports_11("default", UpdateDownloadSessionStatusRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/UpdateFullPackageIsRequestedRequestHandler", [], function (exports_12, context_12) {
    "use strict";
    var UpdateFullPackageIsRequestedRequestHandler;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
            UpdateFullPackageIsRequestedRequestHandler = (function (_super) {
                __extends(UpdateFullPackageIsRequestedRequestHandler, _super);
                function UpdateFullPackageIsRequestedRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UpdateFullPackageIsRequestedRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.UpdateFullPackageIsRequestedRequest;
                };
                UpdateFullPackageIsRequestedRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return UpdateFullPackageIsRequestedRequestHandler;
            }(Commerce.RequestHandler));
            exports_12("default", UpdateFullPackageIsRequestedRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/UpdateUploadFailedStatusRequestHandler", [], function (exports_13, context_13) {
    "use strict";
    var UpdateUploadFailedStatusRequestHandler;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [],
        execute: function () {
            UpdateUploadFailedStatusRequestHandler = (function (_super) {
                __extends(UpdateUploadFailedStatusRequestHandler, _super);
                function UpdateUploadFailedStatusRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UpdateUploadFailedStatusRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.UpdateUploadFailedStatusRequest;
                };
                UpdateUploadFailedStatusRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject(new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.ASYNC_CLIENT_OFFLINE_NOT_ENABLED_ON_TERMINAL));
                };
                return UpdateUploadFailedStatusRequestHandler;
            }(Commerce.RequestHandler));
            exports_13("default", UpdateUploadFailedStatusRequestHandler);
        }
    };
});
System.register("Configuration/Handlers/GetAppSettingsClientRequestHandler", [], function (exports_14, context_14) {
    "use strict";
    var GetAppSettingsClientResponse, GetAppSettingsClientRequestHandler;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
            GetAppSettingsClientResponse = Commerce.Configuration.GetAppSettingsClientResponse;
            GetAppSettingsClientRequestHandler = (function (_super) {
                __extends(GetAppSettingsClientRequestHandler, _super);
                function GetAppSettingsClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetAppSettingsClientRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.Configuration.GetAppSettingsClientRequest;
                };
                GetAppSettingsClientRequestHandler.prototype.executeAsync = function (request) {
                    return Commerce.DataHelper.loadJsonAsync(GetAppSettingsClientRequestHandler.CONFIGURATION_FILE_PATH)
                        .map(function (data) {
                        var configuration;
                        if (typeof data === "object") {
                            configuration = data;
                        }
                        else {
                            configuration = {};
                            Commerce.RetailLogger.applicationFailedToLoadConfiguration("ConfigurationProvider: invalid configuration file. Returned configuration file is not valid JSON.");
                        }
                        var argumentString = window.location.hash || "";
                        if (argumentString.charAt(0) === "#") {
                            argumentString = argumentString.substring(1);
                        }
                        var args = Commerce.UrlHelper.parseArguments(argumentString);
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(args)) {
                            Object.keys(Commerce.ApplicationArgumentId).forEach(function (argName) {
                                var argumentIdKey = Commerce.ApplicationArgumentId[argName];
                                if (Commerce.ObjectExtensions.isString(args[argumentIdKey]) && !Commerce.StringExtensions.isNullOrWhitespace(args[argumentIdKey])) {
                                    configuration[argumentIdKey] = args[argumentIdKey];
                                }
                            });
                        }
                        var appSettings = Object.keys(configuration).map(function (key) {
                            var value = configuration[key];
                            var valueString;
                            if (Commerce.ObjectExtensions.isString(value)) {
                                valueString = value;
                            }
                            else {
                                valueString = JSON.stringify(value);
                            }
                            return { name: key, value: valueString };
                        });
                        return { canceled: false, data: new GetAppSettingsClientResponse(appSettings) };
                    }).getPromise();
                };
                GetAppSettingsClientRequestHandler.CONFIGURATION_FILE_PATH = "config.json";
                return GetAppSettingsClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_14("default", GetAppSettingsClientRequestHandler);
        }
    };
});
System.register("Diagnostics/Handlers/GetLoggingSinksClientRequestHandler", [], function (exports_15, context_15) {
    "use strict";
    var GetLoggingSinksClientRequest, GetLoggingSinksClientResponse, TypeScriptCore, GetLoggingSinksClientRequestHandler;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [],
        execute: function () {
            GetLoggingSinksClientRequest = Commerce.Diagnostics.GetLoggingSinksClientRequest;
            GetLoggingSinksClientResponse = Commerce.Diagnostics.GetLoggingSinksClientResponse;
            TypeScriptCore = Microsoft.Dynamics.Diagnostics.TypeScriptCore;
            GetLoggingSinksClientRequestHandler = (function (_super) {
                __extends(GetLoggingSinksClientRequestHandler, _super);
                function GetLoggingSinksClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetLoggingSinksClientRequestHandler.prototype.supportedRequestType = function () {
                    return GetLoggingSinksClientRequest;
                };
                GetLoggingSinksClientRequestHandler.prototype.executeAsync = function (request) {
                    var sinksConfig = request.sinksConfig || {};
                    var debuggingConsoleSinkConfig = sinksConfig.DebuggingConsoleSink;
                    var appInsightsInstrumentationKey = Commerce.Configuration.ConfigurationProvider.getValue("AppInsightsInstrumentationKey");
                    var appInsightsApplicationName = Commerce.Configuration.ConfigurationProvider.getValue("AppInsightsApplicationName");
                    var sinks = [
                        new TypeScriptCore.DebuggingConsoleSink(debuggingConsoleSinkConfig),
                        new TypeScriptCore.AppInsightsSink(appInsightsInstrumentationKey, appInsightsApplicationName, sinksConfig.AppInsightsSink)
                    ];
                    return Promise.resolve({ canceled: false, data: new GetLoggingSinksClientResponse(sinks) });
                };
                return GetLoggingSinksClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_15("default", GetLoggingSinksClientRequestHandler);
        }
    };
});
System.register("Extensibility/GetExtensionPackagesConfigurationClientRequestHandler", [], function (exports_16, context_16) {
    "use strict";
    var Extensibility, GetExtensionPackagesConfigurationClientResponse, GetExtensionPackagesConfigurationClientRequestHandler;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [],
        execute: function () {
            Extensibility = Commerce.Extensibility;
            GetExtensionPackagesConfigurationClientResponse = Extensibility.GetExtensionPackagesConfigurationClientResponse;
            GetExtensionPackagesConfigurationClientRequestHandler = (function (_super) {
                __extends(GetExtensionPackagesConfigurationClientRequestHandler, _super);
                function GetExtensionPackagesConfigurationClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetExtensionPackagesConfigurationClientRequestHandler.prototype.executeAsync = function (request) {
                    return _super.prototype.executeAsync.call(this, request).then(function (result) {
                        if (result.canceled || Commerce.ArrayExtensions.hasElements(result.data.result.packageDefinitions)) {
                            return Promise.resolve(result);
                        }
                        else if (!Commerce.ApplicationContext.Instance.isDeviceActivated) {
                            var sealedResult = {
                                isIndependentPackagingEnabled: true,
                                baseUrl: result.data.result.baseUrl,
                                packageDefinitions: []
                            };
                            return Promise.resolve({ canceled: false, data: new GetExtensionPackagesConfigurationClientResponse(sealedResult) });
                        }
                        else {
                            var serviceRequest = new Extensibility.GetExtensionPackageDefinitionsServiceRequest(request.correlationId);
                            return Commerce.Runtime.executeAsync(serviceRequest)
                                .then(function (serviceResult) {
                                if (serviceResult.canceled) {
                                    return Promise.resolve({ canceled: true, data: null });
                                }
                                var sealedConfiguration = {
                                    isIndependentPackagingEnabled: true,
                                    baseUrl: result.data.result.baseUrl,
                                    packageDefinitions: serviceResult.data.definitions
                                };
                                return Promise.resolve({
                                    canceled: false,
                                    data: new Extensibility.GetExtensionPackagesConfigurationClientResponse(sealedConfiguration)
                                });
                            });
                        }
                    });
                };
                return GetExtensionPackagesConfigurationClientRequestHandler;
            }(Extensibility.LegacyGetExtensionPackagesConfigurationClientRequestHandler));
            exports_16("default", GetExtensionPackagesConfigurationClientRequestHandler);
        }
    };
});
System.register("Framework/GetApplicationUpdateStatusClientRequestHandler", [], function (exports_17, context_17) {
    "use strict";
    var GetApplicationUpdateStatusClientRequest, GetApplicationUpdateStatusClientResponse, GetApplicationUpdateStatusClientRequestHandler;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [],
        execute: function () {
            GetApplicationUpdateStatusClientRequest = Commerce.Framework.GetApplicationUpdateStatusClientRequest;
            GetApplicationUpdateStatusClientResponse = Commerce.Framework.GetApplicationUpdateStatusClientResponse;
            GetApplicationUpdateStatusClientRequestHandler = (function (_super) {
                __extends(GetApplicationUpdateStatusClientRequestHandler, _super);
                function GetApplicationUpdateStatusClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetApplicationUpdateStatusClientRequestHandler.prototype.supportedRequestType = function () {
                    return GetApplicationUpdateStatusClientRequest;
                };
                GetApplicationUpdateStatusClientRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.resolve({ canceled: false, data: new GetApplicationUpdateStatusClientResponse({ isUpdateRequired: false }) });
                };
                return GetApplicationUpdateStatusClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_17("default", GetApplicationUpdateStatusClientRequestHandler);
        }
    };
});
System.register("Payments/Handlers/WebClearMerchantInformationClientRequestHandler", [], function (exports_18, context_18) {
    "use strict";
    var Payments, WebClearMerchantInformationClientRequestHandler;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [],
        execute: function () {
            Payments = Commerce.Payments;
            WebClearMerchantInformationClientRequestHandler = (function (_super) {
                __extends(WebClearMerchantInformationClientRequestHandler, _super);
                function WebClearMerchantInformationClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                WebClearMerchantInformationClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.ClearMerchantInformationClientRequest;
                };
                WebClearMerchantInformationClientRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.resolve({
                        canceled: false,
                        data: new Payments.ClearMerchantInformationClientResponse(void 0)
                    });
                };
                return WebClearMerchantInformationClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_18("default", WebClearMerchantInformationClientRequestHandler);
        }
    };
});
System.register("TaskRecorder/DownloadTaskRecorderFileClientRequestHandler", [], function (exports_19, context_19) {
    "use strict";
    var DownloadTaskRecorderFileClientRequest, DownloadTaskRecorderFileClientResponse, DownloadTaskRecorderFileClientRequestRequestHandler;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [],
        execute: function () {
            DownloadTaskRecorderFileClientRequest = Commerce.TaskRecorder.DownloadTaskRecorderFileClientRequest;
            DownloadTaskRecorderFileClientResponse = Commerce.TaskRecorder.DownloadTaskRecorderFileClientResponse;
            DownloadTaskRecorderFileClientRequestRequestHandler = (function (_super) {
                __extends(DownloadTaskRecorderFileClientRequestRequestHandler, _super);
                function DownloadTaskRecorderFileClientRequestRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DownloadTaskRecorderFileClientRequestRequestHandler.prototype.supportedRequestType = function () {
                    return DownloadTaskRecorderFileClientRequest;
                };
                DownloadTaskRecorderFileClientRequestRequestHandler.prototype.executeAsync = function (request) {
                    window.open(request.fileUrl);
                    return Promise.resolve({ canceled: false, data: new DownloadTaskRecorderFileClientResponse() });
                };
                return DownloadTaskRecorderFileClientRequestRequestHandler;
            }(Commerce.RequestHandler));
            exports_19("default", DownloadTaskRecorderFileClientRequestRequestHandler);
        }
    };
});
System.register("TaskRecorder/UploadTaskRecorderScreenshotsRequestHandler", [], function (exports_20, context_20) {
    "use strict";
    var UploadTaskRecorderScreenshotsRequest, UploadTaskRecorderScreenshotsRequestHandler;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [],
        execute: function () {
            UploadTaskRecorderScreenshotsRequest = Commerce.TaskRecorder.UploadTaskRecorderScreenshotsRequest;
            UploadTaskRecorderScreenshotsRequestHandler = (function (_super) {
                __extends(UploadTaskRecorderScreenshotsRequestHandler, _super);
                function UploadTaskRecorderScreenshotsRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UploadTaskRecorderScreenshotsRequestHandler.prototype.supportedRequestType = function () {
                    return UploadTaskRecorderScreenshotsRequest;
                };
                UploadTaskRecorderScreenshotsRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject([new Commerce.Proxy.Entities.Error(Commerce.Framework.ErrorCodes.FEATURE_NOT_SUPPORTED_ON_DEVICE_TYPE)]);
                };
                return UploadTaskRecorderScreenshotsRequestHandler;
            }(Commerce.RequestHandler));
            exports_20("default", UploadTaskRecorderScreenshotsRequestHandler);
        }
    };
});
System.register("TaskRecorder/TakeTaskRecorderScreenshotClientRequestHandler", [], function (exports_21, context_21) {
    "use strict";
    var TakeTaskRecorderScreenshotClientRequest, TakeTaskRecorderScreenshotClientRequestHandler;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [],
        execute: function () {
            TakeTaskRecorderScreenshotClientRequest = Commerce.TaskRecorder.TakeTaskRecorderScreenshotClientRequest;
            TakeTaskRecorderScreenshotClientRequestHandler = (function (_super) {
                __extends(TakeTaskRecorderScreenshotClientRequestHandler, _super);
                function TakeTaskRecorderScreenshotClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TakeTaskRecorderScreenshotClientRequestHandler.prototype.supportedRequestType = function () {
                    return TakeTaskRecorderScreenshotClientRequest;
                };
                TakeTaskRecorderScreenshotClientRequestHandler.prototype.executeAsync = function (request) {
                    return Promise.reject([new Commerce.Proxy.Entities.Error(Commerce.Framework.ErrorCodes.FEATURE_NOT_SUPPORTED_ON_DEVICE_TYPE)]);
                };
                return TakeTaskRecorderScreenshotClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_21("default", TakeTaskRecorderScreenshotClientRequestHandler);
        }
    };
});
System.register("PlatformInitializer", ["AsyncClient/Handlers/ApplySessionFileToOfflineDatabaseRequestHandler", "AsyncClient/Handlers/CheckInitialFullPackageRequiredRequestHandler", "AsyncClient/Handlers/DeleteExpiredSessionsRequestHandler", "AsyncClient/Handlers/DownloadFileRequestHandler", "AsyncClient/Handlers/GetOfflineSyncStatisticsRequestHandler", "AsyncClient/Handlers/GetOfflineSwitchErrorCodesRequestHandler", "AsyncClient/Handlers/LoadTransactionDataFromOfflineDatabaseRequestHandler", "AsyncClient/Handlers/ProcessDataPackageRequestHandler", "AsyncClient/Handlers/PurgeOfflineTransactionsRequestHandler", "AsyncClient/Handlers/StripMasterDataRequestHandler", "AsyncClient/Handlers/UpdateDownloadSessionStatusRequestHandler", "AsyncClient/Handlers/UpdateFullPackageIsRequestedRequestHandler", "AsyncClient/Handlers/UpdateUploadFailedStatusRequestHandler", "Configuration/Handlers/GetAppSettingsClientRequestHandler", "Diagnostics/Handlers/GetLoggingSinksClientRequestHandler", "Extensibility/GetExtensionPackagesConfigurationClientRequestHandler", "Framework/GetApplicationUpdateStatusClientRequestHandler", "Payments/Handlers/WebClearMerchantInformationClientRequestHandler", "TaskRecorder/DownloadTaskRecorderFileClientRequestHandler", "TaskRecorder/UploadTaskRecorderScreenshotsRequestHandler", "TaskRecorder/TakeTaskRecorderScreenshotClientRequestHandler"], function (exports_22, context_22) {
    "use strict";
    var ApplySessionFileToOfflineDatabaseRequestHandler_1, CheckInitialFullPackageRequiredRequestHandler_1, DeleteExpiredSessionsRequestHandler_1, DownloadFileRequestHandler_1, GetOfflineSyncStatisticsRequestHandler_1, GetOfflineSwitchErrorCodesRequestHandler_1, LoadTransactionDataFromOfflineDatabaseRequestHandler_1, ProcessDataPackageRequestHandler_1, PurgeOfflineTransactionsRequestHandler_1, StripMasterDataRequestHandler_1, UpdateDownloadSessionStatusRequestHandler_1, UpdateFullPackageIsRequestedRequestHandler_1, UpdateUploadFailedStatusRequestHandler_1, GetAppSettingsClientRequestHandler_1, GetLoggingSinksClientRequestHandler_1, GetExtensionPackagesConfigurationClientRequestHandler_1, GetApplicationUpdateStatusClientRequestHandler_1, WebClearMerchantInformationClientRequestHandler_1, DownloadTaskRecorderFileClientRequestHandler_1, UploadTaskRecorderScreenshotsRequestHandler_1, TakeTaskRecorderScreenshotClientRequestHandler_1, PosWebRuntimeInitializer, initializer;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (ApplySessionFileToOfflineDatabaseRequestHandler_1_1) {
                ApplySessionFileToOfflineDatabaseRequestHandler_1 = ApplySessionFileToOfflineDatabaseRequestHandler_1_1;
            },
            function (CheckInitialFullPackageRequiredRequestHandler_1_1) {
                CheckInitialFullPackageRequiredRequestHandler_1 = CheckInitialFullPackageRequiredRequestHandler_1_1;
            },
            function (DeleteExpiredSessionsRequestHandler_1_1) {
                DeleteExpiredSessionsRequestHandler_1 = DeleteExpiredSessionsRequestHandler_1_1;
            },
            function (DownloadFileRequestHandler_1_1) {
                DownloadFileRequestHandler_1 = DownloadFileRequestHandler_1_1;
            },
            function (GetOfflineSyncStatisticsRequestHandler_1_1) {
                GetOfflineSyncStatisticsRequestHandler_1 = GetOfflineSyncStatisticsRequestHandler_1_1;
            },
            function (GetOfflineSwitchErrorCodesRequestHandler_1_1) {
                GetOfflineSwitchErrorCodesRequestHandler_1 = GetOfflineSwitchErrorCodesRequestHandler_1_1;
            },
            function (LoadTransactionDataFromOfflineDatabaseRequestHandler_1_1) {
                LoadTransactionDataFromOfflineDatabaseRequestHandler_1 = LoadTransactionDataFromOfflineDatabaseRequestHandler_1_1;
            },
            function (ProcessDataPackageRequestHandler_1_1) {
                ProcessDataPackageRequestHandler_1 = ProcessDataPackageRequestHandler_1_1;
            },
            function (PurgeOfflineTransactionsRequestHandler_1_1) {
                PurgeOfflineTransactionsRequestHandler_1 = PurgeOfflineTransactionsRequestHandler_1_1;
            },
            function (StripMasterDataRequestHandler_1_1) {
                StripMasterDataRequestHandler_1 = StripMasterDataRequestHandler_1_1;
            },
            function (UpdateDownloadSessionStatusRequestHandler_1_1) {
                UpdateDownloadSessionStatusRequestHandler_1 = UpdateDownloadSessionStatusRequestHandler_1_1;
            },
            function (UpdateFullPackageIsRequestedRequestHandler_1_1) {
                UpdateFullPackageIsRequestedRequestHandler_1 = UpdateFullPackageIsRequestedRequestHandler_1_1;
            },
            function (UpdateUploadFailedStatusRequestHandler_1_1) {
                UpdateUploadFailedStatusRequestHandler_1 = UpdateUploadFailedStatusRequestHandler_1_1;
            },
            function (GetAppSettingsClientRequestHandler_1_1) {
                GetAppSettingsClientRequestHandler_1 = GetAppSettingsClientRequestHandler_1_1;
            },
            function (GetLoggingSinksClientRequestHandler_1_1) {
                GetLoggingSinksClientRequestHandler_1 = GetLoggingSinksClientRequestHandler_1_1;
            },
            function (GetExtensionPackagesConfigurationClientRequestHandler_1_1) {
                GetExtensionPackagesConfigurationClientRequestHandler_1 = GetExtensionPackagesConfigurationClientRequestHandler_1_1;
            },
            function (GetApplicationUpdateStatusClientRequestHandler_1_1) {
                GetApplicationUpdateStatusClientRequestHandler_1 = GetApplicationUpdateStatusClientRequestHandler_1_1;
            },
            function (WebClearMerchantInformationClientRequestHandler_1_1) {
                WebClearMerchantInformationClientRequestHandler_1 = WebClearMerchantInformationClientRequestHandler_1_1;
            },
            function (DownloadTaskRecorderFileClientRequestHandler_1_1) {
                DownloadTaskRecorderFileClientRequestHandler_1 = DownloadTaskRecorderFileClientRequestHandler_1_1;
            },
            function (UploadTaskRecorderScreenshotsRequestHandler_1_1) {
                UploadTaskRecorderScreenshotsRequestHandler_1 = UploadTaskRecorderScreenshotsRequestHandler_1_1;
            },
            function (TakeTaskRecorderScreenshotClientRequestHandler_1_1) {
                TakeTaskRecorderScreenshotClientRequestHandler_1 = TakeTaskRecorderScreenshotClientRequestHandler_1_1;
            }
        ],
        execute: function () {
            PosWebRuntimeInitializer = (function () {
                function PosWebRuntimeInitializer() {
                }
                PosWebRuntimeInitializer.prototype.populateCompositionLoader = function (compositionLoader) {
                    compositionLoader.addRequestHandler(GetExtensionPackagesConfigurationClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(Commerce.Extensibility.LoadExtensionStringResourcesFromFileClientRequestHandler);
                    compositionLoader.addRequestHandler(GetAppSettingsClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(GetLoggingSinksClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(WebClearMerchantInformationClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(ApplySessionFileToOfflineDatabaseRequestHandler_1.default);
                    compositionLoader.addRequestHandler(CheckInitialFullPackageRequiredRequestHandler_1.default);
                    compositionLoader.addRequestHandler(DeleteExpiredSessionsRequestHandler_1.default);
                    compositionLoader.addRequestHandler(DownloadFileRequestHandler_1.default);
                    compositionLoader.addRequestHandler(GetOfflineSyncStatisticsRequestHandler_1.default);
                    compositionLoader.addRequestHandler(GetOfflineSwitchErrorCodesRequestHandler_1.default);
                    compositionLoader.addRequestHandler(LoadTransactionDataFromOfflineDatabaseRequestHandler_1.default);
                    compositionLoader.addRequestHandler(ProcessDataPackageRequestHandler_1.default);
                    compositionLoader.addRequestHandler(PurgeOfflineTransactionsRequestHandler_1.default);
                    compositionLoader.addRequestHandler(StripMasterDataRequestHandler_1.default);
                    compositionLoader.addRequestHandler(UpdateDownloadSessionStatusRequestHandler_1.default);
                    compositionLoader.addRequestHandler(UpdateFullPackageIsRequestedRequestHandler_1.default);
                    compositionLoader.addRequestHandler(UpdateUploadFailedStatusRequestHandler_1.default);
                    compositionLoader.addRequestHandler(GetApplicationUpdateStatusClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(TakeTaskRecorderScreenshotClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(UploadTaskRecorderScreenshotsRequestHandler_1.default);
                    compositionLoader.addRequestHandler(DownloadTaskRecorderFileClientRequestHandler_1.default);
                    compositionLoader.addRequestInterceptor(Commerce.Authentication.LogOnRequest, new Commerce.Authentication.Interceptors.LogOnRequestInterceptor());
                };
                return PosWebRuntimeInitializer;
            }());
            initializer = new PosWebRuntimeInitializer();
            exports_22("default", initializer);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // R2Td0dHdqrDFcRgfPjf4PoIfL2V2X0aIuKiUWjzGobeg
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgyt1miQITWNkU
// SIG // tUY94VkpGL0n69IaHWi+WUDv7v9Uvf0wgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // FMlNTRabnRO4OGs3apWNlA3Bc6Tbv7kCq9P1ACfu2kmg
// SIG // e0IAS8AbauXKKDnGAPaaErzhTHZvlfmR2QqOf8lpzzID
// SIG // SwnhS4Lg1dm5WkpSz+qJYmXcXZF/8S/HY4IXK57cVnkm
// SIG // wqEsuPXWuylTIPzRQKHNzQXmOK+A1y+TctgIYW0qekXk
// SIG // 9zt3Jj5liUWkwMDwgHNItgy8ZuyVbSdMF5v93QDfgq+D
// SIG // PclMYbb0bcr9u+CeftUVojgt9i+g5qCNin79jzzmnObC
// SIG // BCSBrANJz/ovVlzpq3lXKKCplV8U/tqXP6lTSjp20T30
// SIG // 7nVPCUOaTfdFQqn3aHy1Y4jdklTNXGQBBqGCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCAT1QJpqUI8r758
// SIG // 38Vs11vK/P9Nr/6+xufZY6xWpfsTVgIGXz1cRSvQGBMy
// SIG // MDIwMDgyMzA0MDI0OC41NjVaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjpGQzQxLTRCRDQtRDIyMDEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjwwggTxMIID2aADAgECAhMzAAABEiRzozWG
// SIG // aRMPAAAAAAESMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTky
// SIG // MVoXDTIxMDEyMTIzMTkyMVowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOkZDNDEtNEJENC1EMjIwMSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu6qZFTcvUER3
// SIG // cKUQtII+fc65iE3g/nzOFBWXlhq0natrEhYiFban6yB2
// SIG // g63om0QbMNOFeMHJqYGm3ZRfvBgTYOEWfmjyKStpNuUK
// SIG // TBmFSSxUkrGxDjgVkhyKkGH8ccm0tC7bp96hnQaibH3Y
// SIG // ZXzKvi+BN2gJcsRMH5Pag2bh1Fd8vRMlMHxyw4bBKWWw
// SIG // pKTSG40bxbGu8CXesKGRAQXdaSXu5smJqyjJc3l4b9JN
// SIG // xsI77b05ftEwnU4IwqWKaLafgQDaqVB9knFmaVnrnvBS
// SIG // +2iA3YrVbnkxll51Cr3HhPTwL0IlCbKmyn5VzKS+TCB7
// SIG // SUk+emsVreWqTcMj/q8eCQIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFNI6cB8LTElgKyq0wjLMBsZ2ZVtdMB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBADkR
// SIG // L6+Rr9IK9WNFlicuz6GQuZX3YQOb552L+/8QLNlrlf3V
// SIG // ARdRLxP9qc+tRMui6Y06H6xMT+WShwmrVVtLTUERI+Gv
// SIG // kc9hZz7/oMflUVZe1sD2mV3SIl8IZlCr3KLeXXGlFVEF
// SIG // ccYAc3J0y3P/ZwhP/xOqGcPEKzDwra4qKuhIiBMXk5E7
// SIG // mzu2LL0893ZgXQ33P4CBbXx6e0xWo4Ev38tiOrXTK2rU
// SIG // AnndOSyYOaEiFmLxbNMWsMYumqDDdRapwttcQCEQBJjg
// SIG // zdPVf9Ma66apKiKfDlP987i0CvgUZm6fK0gD/tgTgB20
// SIG // atNJGhqG3eard9HxbD2qhum8J9i9R+AwggZxMIIEWaAD
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
// SIG // RkM0MS00QkQ0LUQyMjAxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVABLgK9aEKr7Q8p7XpXg4xcwzAoq8oIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi688pMCIYDzIwMjAwODIzMDEwNjQ5
// SIG // WhgPMjAyMDA4MjQwMTA2NDlaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOLrzykCAQAwCgIBAAICHzMCAf8wBwIB
// SIG // AAICEY8wCgIFAOLtIKkCAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQAiMRLaRzCy
// SIG // hrRsuGsjI1AI2WtPBiuprm+UFSQBpIOz38Ju6640xoh8
// SIG // pB2MNGWICpxx6Kr5PDn7m0AbinoQRvoFQFrvaPPFAocE
// SIG // Ty5ioBMhmBEkFvqLUNkkDuGJZRgal9q5yw2FqzP+u5ZC
// SIG // 8Wjq+zZZ1JnlB/sU+tEuHRdk7uKmizGCAw0wggMJAgEB
// SIG // MIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAABEiRzozWGaRMPAAAAAAESMA0GCWCGSAFlAwQCAQUA
// SIG // oIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQw
// SIG // LwYJKoZIhvcNAQkEMSIEIL/vKDN/ISHCTAWalQ1UxEoF
// SIG // uuWuxbK11maHHtAW1KlEMIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgJBKwgr/oIhqKqTnIKXhi2KT7J37J
// SIG // GDCPgxE0dZc6llMwgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAARIkc6M1hmkTDwAAAAAB
// SIG // EjAiBCCD7DydT4d7nK4bMesrGH/zRm1COBGPA2k8YdeN
// SIG // xSTvVDANBgkqhkiG9w0BAQsFAASCAQCgY8ounTItFLus
// SIG // +pFxJXDe1jkB9vAH3NfKxSF7XH1cSB93+i94ySNkMDfL
// SIG // APO5ARy3Hd18QC+qgz6fLgDEbVgPF19UwJ91/H99m7Kg
// SIG // UuPC9ASMJ4UEH4JKWty14RPU4/TmCxVvQz/rZdkQBuCS
// SIG // wcblhC0UmJWGtqCODbwEMMfbYOcGs/KcVplOboX8JxCJ
// SIG // kFDf1s8xwsRjE7pk+qkTYmCCtoucFVVUMxyq53TNkEk5
// SIG // ZyG5DJN1Gx4fQ9FqWPcgqyq9JyaA/NPFgs9kMyG9nWP6
// SIG // W0nulDIyyOQfWq2Bv+PNVoFcX4UnfJdeLShwqBEsqbxB
// SIG // m/2FkRWhDuZLJz+U5zTf
// SIG // End signature block
