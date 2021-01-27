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
System.register("Offline/Handlers/AddOfflineConfigurationClientRequestHandler", [], function (exports_1, context_1) {
    "use strict";
    var AddOfflineConfigurationClientResponse, AddOfflineConfigurationClientRequestHandler;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            AddOfflineConfigurationClientResponse = Commerce.Offline.AddOfflineConfigurationClientResponse;
            AddOfflineConfigurationClientRequestHandler = (function (_super) {
                __extends(AddOfflineConfigurationClientRequestHandler, _super);
                function AddOfflineConfigurationClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AddOfflineConfigurationClientRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.Offline.AddOfflineConfigurationClientRequest;
                };
                AddOfflineConfigurationClientRequestHandler.prototype.executeAsync = function (request) {
                    var configurationAdded = Microsoft.Dynamics.Commerce.ClientBroker.CommerceRuntimeRequest.tryAddConfiguration(request.configurationName, request.connectionString, request.isMasterDatabaseConnectionString);
                    var response = {
                        canceled: false,
                        data: new AddOfflineConfigurationClientResponse({ configurationAdded: configurationAdded })
                    };
                    return Promise.resolve(response);
                };
                return AddOfflineConfigurationClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_1("default", AddOfflineConfigurationClientRequestHandler);
        }
    };
});
System.register("Offline/Handlers/ExecuteOfflineRequestClientRequestHandler", [], function (exports_2, context_2) {
    "use strict";
    var ExecuteOfflineRequestClientResponse, ExecuteOfflineRequestClientRequestHandler;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            ExecuteOfflineRequestClientResponse = Commerce.Offline.ExecuteOfflineRequestClientResponse;
            ExecuteOfflineRequestClientRequestHandler = (function (_super) {
                __extends(ExecuteOfflineRequestClientRequestHandler, _super);
                function ExecuteOfflineRequestClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ExecuteOfflineRequestClientRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.Offline.ExecuteOfflineRequestClientRequest;
                };
                ExecuteOfflineRequestClientRequestHandler.prototype.executeAsync = function (request) {
                    var requestSucceeded = true;
                    var executeAsyncPromise;
                    try {
                        executeAsyncPromise = this._convertWinJSPromiseToPromise(Microsoft.Dynamics.Commerce.ClientBroker.CommerceRuntimeRequest.executeAsync(request.requestUri, request.offlineRequestId));
                    }
                    catch (error) {
                        executeAsyncPromise = Promise.reject(error);
                    }
                    return executeAsyncPromise.catch(function (error) {
                        requestSucceeded = false;
                        return error;
                    }).then(function (responseData) {
                        var response = {
                            canceled: false,
                            data: new ExecuteOfflineRequestClientResponse({ requestSucceeded: requestSucceeded, response: responseData })
                        };
                        return response;
                    });
                };
                ExecuteOfflineRequestClientRequestHandler.prototype._convertWinJSPromiseToPromise = function (winJSPromise) {
                    var promise = new Promise(function (resolve, reject) {
                        winJSPromise.done(function (value) {
                            resolve(value);
                        }, function (error) {
                            reject(error);
                        });
                    });
                    return promise;
                };
                return ExecuteOfflineRequestClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_2("default", ExecuteOfflineRequestClientRequestHandler);
        }
    };
});
System.register("Peripherals/HardwareStation/DedicatedHardwareStationRequestHandler", [], function (exports_3, context_3) {
    "use strict";
    var DedicatedHardwareStationRequest, DedicatedHardwareStationResponse, DedicatedHardwareStationRequestHandler;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            DedicatedHardwareStationRequest = Commerce.DedicatedHardwareStationRequest;
            DedicatedHardwareStationResponse = Commerce.DedicatedHardwareStationResponse;
            DedicatedHardwareStationRequestHandler = (function (_super) {
                __extends(DedicatedHardwareStationRequestHandler, _super);
                function DedicatedHardwareStationRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DedicatedHardwareStationRequestHandler.prototype.supportedRequestType = function () {
                    return DedicatedHardwareStationRequest;
                };
                DedicatedHardwareStationRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    var promise = new Promise(function (resolve, reject) {
                        Commerce.RetailLogger.dedicatedHardwareStationClientBrokerStarted(request.correlationId, request.targetHardwareStationRequestUri);
                        var hardwareStationRequestMessage = _this._generateLocalHardwareStationRequestMessage(request.correlationId, request.targetHardwareStationRequestUri, request.requestBody, request.requestLocale);
                        Microsoft.Dynamics.Commerce.ClientBroker.HardwareStationRequest.executeAsync(hardwareStationRequestMessage)
                            .done(function (result) {
                            var hardwareStationResponse = {
                                status: result.status,
                                statusText: result.statusText,
                                responseText: result.responseText
                            };
                            var response = new DedicatedHardwareStationResponse(hardwareStationResponse);
                            resolve({ canceled: false, data: response });
                        }, function (errors) {
                            reject(errors);
                        });
                    });
                    return promise;
                };
                DedicatedHardwareStationRequestHandler.prototype._generateLocalHardwareStationRequestMessage = function (activityId, targetHardwareStationRequestUri, requestBody, requestLocale) {
                    var result = new Microsoft.Dynamics.Commerce.ClientBroker.HardwareStationRequestMessage();
                    result.requestUri = targetHardwareStationRequestUri;
                    result.method = DedicatedHardwareStationRequestHandler.POST_HTTP_REQUEST_METHOD;
                    var acceptLanguageHeader = new Microsoft.Dynamics.Commerce.ClientBroker.HardwareStationHeader();
                    acceptLanguageHeader.name = DedicatedHardwareStationRequestHandler.ACCEPT_LANGUAGE_HEADER_NAME;
                    acceptLanguageHeader.value = requestLocale;
                    var activityIdHeader = new Microsoft.Dynamics.Commerce.ClientBroker.HardwareStationHeader();
                    activityIdHeader.name = DedicatedHardwareStationRequestHandler.ACTIVITYID_HEADER_NAME;
                    activityIdHeader.value = activityId;
                    result.headers = Commerce.StringExtensions.isNullOrWhitespace(requestLocale)
                        ? [activityIdHeader]
                        : [acceptLanguageHeader, activityIdHeader];
                    result.body = requestBody;
                    return result;
                };
                DedicatedHardwareStationRequestHandler.POST_HTTP_REQUEST_METHOD = "POST";
                DedicatedHardwareStationRequestHandler.ACCEPT_LANGUAGE_HEADER_NAME = "Accept-Language";
                DedicatedHardwareStationRequestHandler.ACTIVITYID_HEADER_NAME = "ActivityId";
                return DedicatedHardwareStationRequestHandler;
            }(Commerce.RequestHandler));
            exports_3("default", DedicatedHardwareStationRequestHandler);
        }
    };
});
System.register("Configuration/Handlers/GetAppSettingsClientRequestHandler", [], function (exports_4, context_4) {
    "use strict";
    var GetAppSettingsClientResponse, GetAppSettingsClientRequestHandler;
    var __moduleName = context_4 && context_4.id;
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
                    var appSettingPairs = Microsoft.Dynamics.Commerce.ClientBroker.AppConfiguration.getAppSettings();
                    var appSettings = [];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(appSettingPairs) && !Commerce.NumberExtensions.isNullNaNOrZero(appSettingPairs.length)) {
                        for (var i = 0; i < appSettingPairs.length; i++) {
                            var pair = appSettingPairs[i];
                            appSettings.push({ name: pair.key, value: pair.value });
                        }
                    }
                    var result = {
                        canceled: false,
                        data: new GetAppSettingsClientResponse(appSettings)
                    };
                    return Promise.resolve(result);
                };
                return GetAppSettingsClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_4("default", GetAppSettingsClientRequestHandler);
        }
    };
});
System.register("Diagnostics/Sinks/WindowsLoggingSink", [], function (exports_5, context_5) {
    "use strict";
    var LoggingSink, WindowsLoggingSink;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            LoggingSink = Microsoft.Dynamics.Diagnostics.TypeScriptCore.LoggingSink;
            WindowsLoggingSink = (function (_super) {
                __extends(WindowsLoggingSink, _super);
                function WindowsLoggingSink(configuration) {
                    return _super.call(this, configuration) || this;
                }
                WindowsLoggingSink.prototype.writeEvent = function (event) {
                    var eventLevel = this.getMinEventLevel();
                    if (event.StaticMetadata.Level <= eventLevel) {
                        event = this.sanitizeEvent(event);
                        var request_1 = JSON.stringify(event);
                        Commerce.Host.instance.timers.setImmediate(function () {
                            try {
                                Microsoft.Dynamics.Commerce.ClientBroker.Logger.logAsync(request_1)
                                    .done(function (response) { return void 0; }, function (error) {
                                    console.error("Logging request to native logging broker failed due to error sending the request to the broker.  Error: "
                                        + error);
                                });
                            }
                            catch (exception) {
                                console.error("Logging request to native logging broker failed due to a fatal error. Error: " + exception.message);
                            }
                        });
                    }
                };
                WindowsLoggingSink.prototype.setSessionInfo = function (appSessionId, userSessionId, deviceId, userId, tenantId, offlineAvailability, offlineCurrentMode, screenResolution, deviceRecordId, terminalRecordId) {
                    Commerce.Host.instance.timers.setImmediate(function () {
                        try {
                            Microsoft.Dynamics.Commerce.ClientBroker.Logger.setSessionInfoAsync(appSessionId, userSessionId, deviceId, userId, tenantId, offlineAvailability, offlineCurrentMode, screenResolution, deviceRecordId, terminalRecordId).done(function (response) {
                                console.log("Called the API to set the session info on the client broker. Response: " + response);
                            }, function (error) {
                                console.error("Setting the session info through the native logging broker failed due to error sending the request to the broker."
                                    + " Error: " + error);
                            });
                        }
                        catch (ex) {
                            console.error("Setting the session info through the native logging broker failed due to error sending the request to the broker."
                                + " Error: " + ex);
                        }
                    });
                };
                WindowsLoggingSink.prototype.setInstrumentationKey = function (instrumentationKey) {
                    Commerce.Host.instance.timers.setImmediate(function () {
                        try {
                            Microsoft.Dynamics.Commerce.ClientBroker.Logger.setInstrumentationKeyAsync(instrumentationKey)
                                .done(function (response) {
                                console.info("Called the API to set the instrumentation key on the client broker. Response: " + response);
                            }, function (error) {
                                console.error("Setting the instrumentation key through the native logging broker failed due to error sending the request to the "
                                    + "broker. Error: " + error);
                            });
                        }
                        catch (ex) {
                            console.error("Setting the instrumentation key through the native logging broker failed due to error sending the request to the "
                                + "broker. Error: " + ex);
                        }
                    });
                };
                return WindowsLoggingSink;
            }(LoggingSink));
            exports_5("WindowsLoggingSink", WindowsLoggingSink);
        }
    };
});
System.register("Diagnostics/Handlers/GetLoggingSinksClientRequestHandler", ["Diagnostics/Sinks/WindowsLoggingSink"], function (exports_6, context_6) {
    "use strict";
    var WindowsLoggingSink_1, GetLoggingSinksClientRequest, GetLoggingSinksClientResponse, GetLoggingSinksClientRequestHandler;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (WindowsLoggingSink_1_1) {
                WindowsLoggingSink_1 = WindowsLoggingSink_1_1;
            }
        ],
        execute: function () {
            GetLoggingSinksClientRequest = Commerce.Diagnostics.GetLoggingSinksClientRequest;
            GetLoggingSinksClientResponse = Commerce.Diagnostics.GetLoggingSinksClientResponse;
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
                    var sinks = [
                        new Microsoft.Dynamics.Diagnostics.TypeScriptCore.DebuggingConsoleSink(sinksConfig.DebuggingConsoleSink),
                        new WindowsLoggingSink_1.WindowsLoggingSink(sinksConfig.LoggingRequest)
                    ];
                    return Promise.resolve({ canceled: false, data: new GetLoggingSinksClientResponse(sinks) });
                };
                return GetLoggingSinksClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_6("default", GetLoggingSinksClientRequestHandler);
        }
    };
});
System.register("Utilities/PromiseConverter", [], function (exports_7, context_7) {
    "use strict";
    var PromiseConverter;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            PromiseConverter = (function () {
                function PromiseConverter() {
                }
                PromiseConverter.convertAsyncOperationToPromise = function (asyncOperation) {
                    var promise = new Promise(function (resolve, reject) {
                        asyncOperation.done(function (value) {
                            resolve(value);
                        }, function (error) {
                            reject(error);
                        });
                    });
                    return promise;
                };
                return PromiseConverter;
            }());
            exports_7("default", PromiseConverter);
        }
    };
});
System.register("AsyncClient/Handlers/ApplySessionFileToOfflineDatabaseRequestHandler", ["Utilities/PromiseConverter"], function (exports_8, context_8) {
    "use strict";
    var ApplySessionFileToOfflineDatabaseResponse, PromiseConverter_1, ApplySessionFileToOfflineDatabaseRequestHandler;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (PromiseConverter_1_1) {
                PromiseConverter_1 = PromiseConverter_1_1;
            }
        ],
        execute: function () {
            ApplySessionFileToOfflineDatabaseResponse = Commerce.AsyncClient.ApplySessionFileToOfflineDatabaseResponse;
            ApplySessionFileToOfflineDatabaseRequestHandler = (function (_super) {
                __extends(ApplySessionFileToOfflineDatabaseRequestHandler, _super);
                function ApplySessionFileToOfflineDatabaseRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ApplySessionFileToOfflineDatabaseRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.ApplySessionFileToOfflineDatabaseRequest;
                };
                ApplySessionFileToOfflineDatabaseRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_1.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .applyFileToOfflineDbAsync(request.offlineDatabaseString, request.workingDirectoryPath, request.fileName, request.terminalId, request.sqlCommandTimeout))
                            .then(function (clientBrokerResult) {
                            var applySessionFileToOfflineDatabaseResponse = new ApplySessionFileToOfflineDatabaseResponse(clientBrokerResult.requestSuccess, clientBrokerResult.statusText, clientBrokerResult.rowsAffected);
                            var result = {
                                canceled: false,
                                data: applySessionFileToOfflineDatabaseResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.viewModelApplyToOfflineDbBrokerRequestFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.viewModelApplyToOfflineDbBrokerRequestFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return ApplySessionFileToOfflineDatabaseRequestHandler;
            }(Commerce.RequestHandler));
            exports_8("default", ApplySessionFileToOfflineDatabaseRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/CheckInitialFullPackageRequiredRequestHandler", ["Utilities/PromiseConverter"], function (exports_9, context_9) {
    "use strict";
    var CheckInitialFullPackageRequiredResponse, PromiseConverter_2, CheckInitialFullPackageRequiredRequestHandler;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (PromiseConverter_2_1) {
                PromiseConverter_2 = PromiseConverter_2_1;
            }
        ],
        execute: function () {
            CheckInitialFullPackageRequiredResponse = Commerce.AsyncClient.CheckInitialFullPackageRequiredResponse;
            CheckInitialFullPackageRequiredRequestHandler = (function (_super) {
                __extends(CheckInitialFullPackageRequiredRequestHandler, _super);
                function CheckInitialFullPackageRequiredRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CheckInitialFullPackageRequiredRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.CheckInitialFullPackageRequiredRequest;
                };
                CheckInitialFullPackageRequiredRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_2.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .checkInitialFullPackageRequiredAsync(request.offlineDatabaseString))
                            .then(function (clientBrokerResult) {
                            var checkInitialFullPackageRequiredResponse = new CheckInitialFullPackageRequiredResponse(clientBrokerResult.requestSuccess, clientBrokerResult.statusText, clientBrokerResult.hasInitialized);
                            var result = {
                                canceled: false,
                                data: checkInitialFullPackageRequiredResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.viewModelCheckInitialFullPackageRequiredFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.viewModelCheckInitialFullPackageRequiredFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return CheckInitialFullPackageRequiredRequestHandler;
            }(Commerce.RequestHandler));
            exports_9("default", CheckInitialFullPackageRequiredRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/DeleteExpiredSessionsRequestHandler", ["Utilities/PromiseConverter"], function (exports_10, context_10) {
    "use strict";
    var DeleteExpiredSessionsResponse, PromiseConverter_3, DeleteExpiredSessionsRequestHandler;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (PromiseConverter_3_1) {
                PromiseConverter_3 = PromiseConverter_3_1;
            }
        ],
        execute: function () {
            DeleteExpiredSessionsResponse = Commerce.AsyncClient.DeleteExpiredSessionsResponse;
            DeleteExpiredSessionsRequestHandler = (function (_super) {
                __extends(DeleteExpiredSessionsRequestHandler, _super);
                function DeleteExpiredSessionsRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DeleteExpiredSessionsRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.DeleteExpiredSessionsRequest;
                };
                DeleteExpiredSessionsRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_3.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .deleteExpiredSessionsAsync(request.offlineDatabaseString))
                            .then(function (asyncClientResponse) {
                            var deleteExpiredSessionsResponse = new DeleteExpiredSessionsResponse(asyncClientResponse.requestSuccess, asyncClientResponse.statusText);
                            var result = {
                                canceled: false,
                                data: deleteExpiredSessionsResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.viewModelDeleteExpiredSessionFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.viewModelDeleteExpiredSessionFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return DeleteExpiredSessionsRequestHandler;
            }(Commerce.RequestHandler));
            exports_10("default", DeleteExpiredSessionsRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/DownloadFileRequestHandler", ["Utilities/PromiseConverter"], function (exports_11, context_11) {
    "use strict";
    var DownloadFileResponse, PromiseConverter_4, DownloadFileRequestHandler;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (PromiseConverter_4_1) {
                PromiseConverter_4 = PromiseConverter_4_1;
            }
        ],
        execute: function () {
            DownloadFileResponse = Commerce.AsyncClient.DownloadFileResponse;
            DownloadFileRequestHandler = (function (_super) {
                __extends(DownloadFileRequestHandler, _super);
                function DownloadFileRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DownloadFileRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.DownloadFileRequest;
                };
                DownloadFileRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_4.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .downloadFileAsync(request.uri, request.checkSum))
                            .then(function (clientBrokerResult) {
                            var downloadFileResponse = new DownloadFileResponse(clientBrokerResult.requestSuccess, clientBrokerResult.statusText, clientBrokerResult.fileName, clientBrokerResult.workingFolder);
                            var result = {
                                canceled: false,
                                data: downloadFileResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.viewModelDownloadFileBrokerRequestFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.viewModelDownloadFileBrokerRequestFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return DownloadFileRequestHandler;
            }(Commerce.RequestHandler));
            exports_11("default", DownloadFileRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/GetCDXFeatureParameterValueRequestHandler", ["Utilities/PromiseConverter"], function (exports_12, context_12) {
    "use strict";
    var GetCDXFeatureParameterValueResponse, PromiseConverter_5, GetCDXFeatureParameterValueRequestHandler;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (PromiseConverter_5_1) {
                PromiseConverter_5 = PromiseConverter_5_1;
            }
        ],
        execute: function () {
            GetCDXFeatureParameterValueResponse = Commerce.AsyncClient.GetCDXFeatureParameterValueResponse;
            GetCDXFeatureParameterValueRequestHandler = (function (_super) {
                __extends(GetCDXFeatureParameterValueRequestHandler, _super);
                function GetCDXFeatureParameterValueRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetCDXFeatureParameterValueRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.GetCDXFeatureParameterValueRequest;
                };
                GetCDXFeatureParameterValueRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_5.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .getCDXFeatureParameterValueAsync(request.parameterName))
                            .then(function (clientBrokerResult) {
                            var getCDXFeatureParameterValueResponse = new GetCDXFeatureParameterValueResponse(clientBrokerResult.requestSuccess, clientBrokerResult.statusText, clientBrokerResult.booleanValue, clientBrokerResult.longValue, clientBrokerResult.stringValue);
                            var result = {
                                canceled: false,
                                data: getCDXFeatureParameterValueResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.getCDXFeatureParameterValueFailed(request.correlationId, request.parameterName, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.getCDXFeatureParameterValueFailed(request.correlationId, request.parameterName, error.message);
                        return Promise.reject(error);
                    }
                };
                return GetCDXFeatureParameterValueRequestHandler;
            }(Commerce.RequestHandler));
            exports_12("default", GetCDXFeatureParameterValueRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/GetOfflineSyncStatisticsRequestHandler", ["Utilities/PromiseConverter"], function (exports_13, context_13) {
    "use strict";
    var ClientBroker, GetOfflineSyncStatisticsRequest, GetOfflineSyncStatisticsResponse, Proxy, PromiseConverter_6, GetOfflineSyncStatisticsRequestHandler;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (PromiseConverter_6_1) {
                PromiseConverter_6 = PromiseConverter_6_1;
            }
        ],
        execute: function () {
            ClientBroker = Microsoft.Dynamics.Commerce.ClientBroker;
            GetOfflineSyncStatisticsRequest = Commerce.AsyncClient.GetOfflineSyncStatisticsRequest;
            GetOfflineSyncStatisticsResponse = Commerce.AsyncClient.GetOfflineSyncStatisticsResponse;
            Proxy = Commerce.Proxy;
            GetOfflineSyncStatisticsRequestHandler = (function (_super) {
                __extends(GetOfflineSyncStatisticsRequestHandler, _super);
                function GetOfflineSyncStatisticsRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetOfflineSyncStatisticsRequestHandler.prototype.supportedRequestType = function () {
                    return GetOfflineSyncStatisticsRequest;
                };
                GetOfflineSyncStatisticsRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    try {
                        return PromiseConverter_6.default.convertAsyncOperationToPromise(ClientBroker.AsyncClientRequest
                            .getOfflineSyncStatsAsync(request.offlineDatabaseString, request.terminalId))
                            .then(function (clientBrokerResult) {
                            var status = _this._getOfflineSyncStatus(clientBrokerResult);
                            var getOfflineSyncStatisticsResponse = new GetOfflineSyncStatisticsResponse(clientBrokerResult.requestSuccess, clientBrokerResult.statusText, status);
                            var result = {
                                canceled: false,
                                data: getOfflineSyncStatisticsResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.viewModelGetOfflineSyncStatsFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.viewModelGetOfflineSyncStatsFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                GetOfflineSyncStatisticsRequestHandler.prototype._getOfflineSyncStatus = function (clientBrokerResult) {
                    if (!clientBrokerResult.requestSuccess) {
                        return null;
                    }
                    var clientBrokerOfflineSyncStats = clientBrokerResult.offlineSyncStats;
                    var offlineSyncStatus = {
                        lastSyncDateTime: Commerce.DateExtensions.getMinDate(),
                        uploadSessions: [],
                        downloadSessions: []
                    };
                    if (Commerce.ObjectExtensions.isNullOrUndefined(clientBrokerOfflineSyncStats)
                        || Commerce.NumberExtensions.isNullNaNOrZero(clientBrokerOfflineSyncStats.length)) {
                        return offlineSyncStatus;
                    }
                    for (var i = 0; i < clientBrokerOfflineSyncStats.length; i++) {
                        var line = clientBrokerOfflineSyncStats[i];
                        var asyncClientOfflineSyncStatsLine = new Proxy.Entities.OfflineSyncStatsLineClass();
                        var utcDate = line.lastSyncDateTime;
                        asyncClientOfflineSyncStatsLine.JobDescription = line.jobDescription;
                        asyncClientOfflineSyncStatsLine.Status = line.status;
                        asyncClientOfflineSyncStatsLine.LastSyncDateTime = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000);
                        asyncClientOfflineSyncStatsLine.FileSize = line.fileSize;
                        asyncClientOfflineSyncStatsLine.IsUploadJob = Boolean(line.isUploadJob);
                        if (!asyncClientOfflineSyncStatsLine.IsUploadJob) {
                            offlineSyncStatus.downloadSessions.push(asyncClientOfflineSyncStatsLine);
                        }
                        else {
                            offlineSyncStatus.uploadSessions.push(asyncClientOfflineSyncStatsLine);
                        }
                        if (asyncClientOfflineSyncStatsLine.LastSyncDateTime > offlineSyncStatus.lastSyncDateTime) {
                            offlineSyncStatus.lastSyncDateTime = asyncClientOfflineSyncStatsLine.LastSyncDateTime;
                        }
                    }
                    return offlineSyncStatus;
                };
                return GetOfflineSyncStatisticsRequestHandler;
            }(Commerce.RequestHandler));
            exports_13("default", GetOfflineSyncStatisticsRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/GetOfflineSwitchErrorCodesRequestHandler", ["Utilities/PromiseConverter"], function (exports_14, context_14) {
    "use strict";
    var GetOfflineSwitchErrorCodesResponse, PromiseConverter_7, GetOfflineSwitchErrorCodesRequestHandler;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (PromiseConverter_7_1) {
                PromiseConverter_7 = PromiseConverter_7_1;
            }
        ],
        execute: function () {
            GetOfflineSwitchErrorCodesResponse = Commerce.AsyncClient.GetOfflineSwitchErrorCodesResponse;
            GetOfflineSwitchErrorCodesRequestHandler = (function (_super) {
                __extends(GetOfflineSwitchErrorCodesRequestHandler, _super);
                function GetOfflineSwitchErrorCodesRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetOfflineSwitchErrorCodesRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.GetOfflineSwitchErrorCodesRequest;
                };
                GetOfflineSwitchErrorCodesRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_7.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .getOfflineSwitchErrorCodesAsync(request.offlineDatabaseString))
                            .then(function (clientBrokerResult) {
                            var response = new GetOfflineSwitchErrorCodesResponse(clientBrokerResult.requestSuccess, clientBrokerResult.statusText, clientBrokerResult.errorCodesList);
                            var result = {
                                canceled: false,
                                data: response
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.getOfflineSwitchErrorCodesFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.getOfflineSwitchErrorCodesFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return GetOfflineSwitchErrorCodesRequestHandler;
            }(Commerce.RequestHandler));
            exports_14("default", GetOfflineSwitchErrorCodesRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/InitializeFeatureControlManagerRequestHandler", ["Utilities/PromiseConverter"], function (exports_15, context_15) {
    "use strict";
    var InitializeFeatureControlManagerResponse, PromiseConverter_8, InitializeFeatureControlManagerRequestHandler;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (PromiseConverter_8_1) {
                PromiseConverter_8 = PromiseConverter_8_1;
            }
        ],
        execute: function () {
            InitializeFeatureControlManagerResponse = Commerce.AsyncClient.InitializeFeatureControlManagerResponse;
            InitializeFeatureControlManagerRequestHandler = (function (_super) {
                __extends(InitializeFeatureControlManagerRequestHandler, _super);
                function InitializeFeatureControlManagerRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                InitializeFeatureControlManagerRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.InitializeFeatureControlManagerRequest;
                };
                InitializeFeatureControlManagerRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        var featureControlCollectionJSON = null;
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(request.featureControlList)) {
                            featureControlCollectionJSON = JSON.stringify(request.featureControlList
                                .map(function (rc) { return ({
                                name: rc.Name,
                                value: rc.Value
                            }); }));
                        }
                        return PromiseConverter_8.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .initializeFeatureControlManagerAsync(request.offlineDatabaseString, featureControlCollectionJSON))
                            .then(function (clientBrokerResult) {
                            var initializeFeatureControlManagerResponse = new InitializeFeatureControlManagerResponse(clientBrokerResult.requestSuccess, clientBrokerResult.statusText);
                            var result = {
                                canceled: false,
                                data: initializeFeatureControlManagerResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.initializeFeatureControlManagerWarning(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.initializeFeatureControlManagerWarning(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return InitializeFeatureControlManagerRequestHandler;
            }(Commerce.RequestHandler));
            exports_15("default", InitializeFeatureControlManagerRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/LoadTransactionDataFromOfflineDatabaseRequestHandler", ["Utilities/PromiseConverter"], function (exports_16, context_16) {
    "use strict";
    var LoadTransactionDataFromOfflineDatabaseResponse, PromiseConverter_9, LoadTransactionDataFromOfflineDatabaseRequestHandler;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (PromiseConverter_9_1) {
                PromiseConverter_9 = PromiseConverter_9_1;
            }
        ],
        execute: function () {
            LoadTransactionDataFromOfflineDatabaseResponse = Commerce.AsyncClient.LoadTransactionDataFromOfflineDatabaseResponse;
            LoadTransactionDataFromOfflineDatabaseRequestHandler = (function (_super) {
                __extends(LoadTransactionDataFromOfflineDatabaseRequestHandler, _super);
                function LoadTransactionDataFromOfflineDatabaseRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                LoadTransactionDataFromOfflineDatabaseRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.LoadTransactionDataFromOfflineDatabaseRequest;
                };
                LoadTransactionDataFromOfflineDatabaseRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_9.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .loadTransactionDataAsync(request.offlineDatabaseString, request.uploadJobDefinitions, request.terminalId))
                            .then(function (clientBrokerResult) {
                            var transactionDatalist = [];
                            var dataListIterator = clientBrokerResult.offlineTransactionDataList.first();
                            while (dataListIterator.hasCurrent) {
                                transactionDatalist.push(dataListIterator.current);
                                dataListIterator.moveNext();
                            }
                            var loadTransactionDataFromOfflineDatabaseResponse = new LoadTransactionDataFromOfflineDatabaseResponse(clientBrokerResult.requestSuccess, clientBrokerResult.statusText, transactionDatalist);
                            var result = {
                                canceled: false,
                                data: loadTransactionDataFromOfflineDatabaseResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.viewModelLoadUploadTransactionsFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.viewModelLoadUploadTransactionsFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return LoadTransactionDataFromOfflineDatabaseRequestHandler;
            }(Commerce.RequestHandler));
            exports_16("default", LoadTransactionDataFromOfflineDatabaseRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/ProcessDataPackageRequestHandler", ["Utilities/PromiseConverter"], function (exports_17, context_17) {
    "use strict";
    var ProcessDataPackageResponse, PromiseConverter_10, ProcessDataPackageRequestHandler;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (PromiseConverter_10_1) {
                PromiseConverter_10 = PromiseConverter_10_1;
            }
        ],
        execute: function () {
            ProcessDataPackageResponse = Commerce.AsyncClient.ProcessDataPackageResponse;
            ProcessDataPackageRequestHandler = (function (_super) {
                __extends(ProcessDataPackageRequestHandler, _super);
                function ProcessDataPackageRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ProcessDataPackageRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.ProcessDataPackageRequest;
                };
                ProcessDataPackageRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_10.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .processDataPackageAsync(request.serializedCDXDataPackage, request.offlineDatabaseString, request.sqlCommandTimeout))
                            .then(function (asyncClientResponse) {
                            var processDataPackageResponse = new ProcessDataPackageResponse(asyncClientResponse.requestSuccess, asyncClientResponse.statusText);
                            var result = {
                                canceled: false,
                                data: processDataPackageResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.viewModelProcessCDXDataPackageFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.viewModelProcessCDXDataPackageFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return ProcessDataPackageRequestHandler;
            }(Commerce.RequestHandler));
            exports_17("default", ProcessDataPackageRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/PurgeOfflineTransactionsRequestHandler", ["Utilities/PromiseConverter"], function (exports_18, context_18) {
    "use strict";
    var PurgeOfflineTransactionsResponse, PromiseConverter_11, PurgeOfflineTransactionsRequestHandler;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (PromiseConverter_11_1) {
                PromiseConverter_11 = PromiseConverter_11_1;
            }
        ],
        execute: function () {
            PurgeOfflineTransactionsResponse = Commerce.AsyncClient.PurgeOfflineTransactionsResponse;
            PurgeOfflineTransactionsRequestHandler = (function (_super) {
                __extends(PurgeOfflineTransactionsRequestHandler, _super);
                function PurgeOfflineTransactionsRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PurgeOfflineTransactionsRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.PurgeOfflineTransactionsRequest;
                };
                PurgeOfflineTransactionsRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_11.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .purgeOfflineTransactionsAsync(request.offlineDatabaseString, request.uploadJobDefinitions))
                            .then(function (asyncClientResponse) {
                            var purgeOfflineTransactionsResponse = new PurgeOfflineTransactionsResponse(asyncClientResponse.requestSuccess, asyncClientResponse.statusText);
                            var result = {
                                canceled: false,
                                data: purgeOfflineTransactionsResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.viewModelPurgeOfflineTransactionsFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.viewModelPurgeOfflineTransactionsFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return PurgeOfflineTransactionsRequestHandler;
            }(Commerce.RequestHandler));
            exports_18("default", PurgeOfflineTransactionsRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/StripMasterDataRequestHandler", ["Utilities/PromiseConverter"], function (exports_19, context_19) {
    "use strict";
    var StripMasterDataResponse, PromiseConverter_12, StripMasterDataRequestHandler;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (PromiseConverter_12_1) {
                PromiseConverter_12 = PromiseConverter_12_1;
            }
        ],
        execute: function () {
            StripMasterDataResponse = Commerce.AsyncClient.StripMasterDataResponse;
            StripMasterDataRequestHandler = (function (_super) {
                __extends(StripMasterDataRequestHandler, _super);
                function StripMasterDataRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                StripMasterDataRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.StripMasterDataRequest;
                };
                StripMasterDataRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_12.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .stripMasterData(request.offlineDatabaseString, request.dataStoreName, request.sqlCommandTimeout))
                            .then(function (asyncClientResponse) {
                            var stripMasterDataResponse = new StripMasterDataResponse(asyncClientResponse.requestSuccess, asyncClientResponse.statusText);
                            var result = {
                                canceled: false,
                                data: stripMasterDataResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.stripMasterDataBrokerRequestFailed(request.correlationId, request.dataStoreName);
                            return Promise.reject(error.message);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.stripMasterDataBrokerRequestFailed(request.correlationId, request.dataStoreName);
                        return Promise.reject(error.message);
                    }
                };
                return StripMasterDataRequestHandler;
            }(Commerce.RequestHandler));
            exports_19("default", StripMasterDataRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/UpdateDownloadSessionStatusRequestHandler", ["Utilities/PromiseConverter"], function (exports_20, context_20) {
    "use strict";
    var UpdateDownloadSessionStatusResponse, PromiseConverter_13, UpdateDownloadSessionStatusRequestHandler;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (PromiseConverter_13_1) {
                PromiseConverter_13 = PromiseConverter_13_1;
            }
        ],
        execute: function () {
            UpdateDownloadSessionStatusResponse = Commerce.AsyncClient.UpdateDownloadSessionStatusResponse;
            UpdateDownloadSessionStatusRequestHandler = (function (_super) {
                __extends(UpdateDownloadSessionStatusRequestHandler, _super);
                function UpdateDownloadSessionStatusRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UpdateDownloadSessionStatusRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.UpdateDownloadSessionStatusRequest;
                };
                UpdateDownloadSessionStatusRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        var asyncClientDownloadSession = new Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientDownloadSession();
                        asyncClientDownloadSession.id = request.downloadSession.Id;
                        asyncClientDownloadSession.checksum = request.downloadSession.Checksum;
                        asyncClientDownloadSession.fileSize = request.downloadSession.FileSize;
                        asyncClientDownloadSession.status = request.downloadSession.StatusValue;
                        asyncClientDownloadSession.jobId = request.downloadSession.JobId;
                        asyncClientDownloadSession.jobDescription = request.downloadSession.JobDescription;
                        asyncClientDownloadSession.dateRequested = request.downloadSession.DateRequested;
                        asyncClientDownloadSession.dateDownloaded = request.downloadSession.DateDownloaded;
                        asyncClientDownloadSession.message = request.downloadSession.Message;
                        return PromiseConverter_13.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .updateDownloadSessionStatusAsync(request.offlineDatabaseString, request.terminalId, asyncClientDownloadSession))
                            .then(function (asyncClientResponse) {
                            var updateDownloadSessionStatusResponse = new UpdateDownloadSessionStatusResponse(asyncClientResponse.requestSuccess, asyncClientResponse.statusText);
                            var result = {
                                canceled: false,
                                data: updateDownloadSessionStatusResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.viewModelUpdateDownloadSessionStatusBrokerRequestFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.viewModelUpdateDownloadSessionStatusBrokerRequestFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return UpdateDownloadSessionStatusRequestHandler;
            }(Commerce.RequestHandler));
            exports_20("default", UpdateDownloadSessionStatusRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/UpdateFullPackageIsRequestedRequestHandler", ["Utilities/PromiseConverter"], function (exports_21, context_21) {
    "use strict";
    var UpdateFullPackageIsRequestedRequest, UpdateFullPackageIsRequestedResponse, PromiseConverter_14, UpdateFullPackageIsRequestedRequestHandler;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (PromiseConverter_14_1) {
                PromiseConverter_14 = PromiseConverter_14_1;
            }
        ],
        execute: function () {
            UpdateFullPackageIsRequestedRequest = Commerce.AsyncClient.UpdateFullPackageIsRequestedRequest;
            UpdateFullPackageIsRequestedResponse = Commerce.AsyncClient.UpdateFullPackageIsRequestedResponse;
            UpdateFullPackageIsRequestedRequestHandler = (function (_super) {
                __extends(UpdateFullPackageIsRequestedRequestHandler, _super);
                function UpdateFullPackageIsRequestedRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UpdateFullPackageIsRequestedRequestHandler.prototype.supportedRequestType = function () {
                    return UpdateFullPackageIsRequestedRequest;
                };
                UpdateFullPackageIsRequestedRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_14.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .updateFullPackageIsRequestedAsync(request.offlineDatabaseString))
                            .then(function (asyncClientResponse) {
                            var updateFullPackageResponse = new UpdateFullPackageIsRequestedResponse(asyncClientResponse.requestSuccess, asyncClientResponse.statusText);
                            var result = {
                                canceled: false,
                                data: updateFullPackageResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.viewModelUpdateFullPackageIsRequestedFailed(request.correlationId, error.message);
                            return Promise.reject(error.message);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.viewModelUpdateFullPackageIsRequestedFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return UpdateFullPackageIsRequestedRequestHandler;
            }(Commerce.RequestHandler));
            exports_21("default", UpdateFullPackageIsRequestedRequestHandler);
        }
    };
});
System.register("AsyncClient/Handlers/UpdateUploadFailedStatusRequestHandler", ["Utilities/PromiseConverter"], function (exports_22, context_22) {
    "use strict";
    var UpdateUploadFailedStatusResponse, PromiseConverter_15, UpdateUploadFailedStatusRequestHandler;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (PromiseConverter_15_1) {
                PromiseConverter_15 = PromiseConverter_15_1;
            }
        ],
        execute: function () {
            UpdateUploadFailedStatusResponse = Commerce.AsyncClient.UpdateUploadFailedStatusResponse;
            UpdateUploadFailedStatusRequestHandler = (function (_super) {
                __extends(UpdateUploadFailedStatusRequestHandler, _super);
                function UpdateUploadFailedStatusRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UpdateUploadFailedStatusRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.AsyncClient.UpdateUploadFailedStatusRequest;
                };
                UpdateUploadFailedStatusRequestHandler.prototype.executeAsync = function (request) {
                    try {
                        return PromiseConverter_15.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.AsyncClientRequest
                            .updateUploadFailedStatusAsync(request.offlineDatabaseString))
                            .then(function (asyncClientResponse) {
                            var updateUploadFailedStatusResponse = new UpdateUploadFailedStatusResponse(asyncClientResponse.requestSuccess, asyncClientResponse.statusText);
                            var result = {
                                canceled: false,
                                data: updateUploadFailedStatusResponse
                            };
                            return Promise.resolve(result);
                        }).catch(function (error) {
                            Commerce.RetailLogger.updateUploadFailedStatusFailed(request.correlationId, error.message);
                            return Promise.reject(error);
                        });
                    }
                    catch (error) {
                        Commerce.RetailLogger.updateUploadFailedStatusFailed(request.correlationId, error.message);
                        return Promise.reject(error);
                    }
                };
                return UpdateUploadFailedStatusRequestHandler;
            }(Commerce.RequestHandler));
            exports_22("default", UpdateUploadFailedStatusRequestHandler);
        }
    };
});
System.register("Framework/GetApplicationUpdateStatusClientRequestHandler", [], function (exports_23, context_23) {
    "use strict";
    var GetApplicationUpdateStatusClientRequest, GetApplicationUpdateStatusClientResponse, StringExtensions, GetApplicationUpdateStatusClientRequestHandler;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [],
        execute: function () {
            GetApplicationUpdateStatusClientRequest = Commerce.Framework.GetApplicationUpdateStatusClientRequest;
            GetApplicationUpdateStatusClientResponse = Commerce.Framework.GetApplicationUpdateStatusClientResponse;
            StringExtensions = Commerce.StringExtensions;
            GetApplicationUpdateStatusClientRequestHandler = (function (_super) {
                __extends(GetApplicationUpdateStatusClientRequestHandler, _super);
                function GetApplicationUpdateStatusClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetApplicationUpdateStatusClientRequestHandler.prototype.supportedRequestType = function () {
                    return GetApplicationUpdateStatusClientRequest;
                };
                GetApplicationUpdateStatusClientRequestHandler.prototype.executeAsync = function (request) {
                    var version = Commerce.Host.instance.application.getApplicationIdentity().version;
                    var currentVersionString = Commerce.Utilities.VersionHelper.getStringRepresentation(version);
                    var expectedVersionString = Microsoft.Dynamics.Commerce.ClientBroker.AppConfiguration.getAppVersion();
                    var isUpdateRequired = !StringExtensions.isNullOrWhitespace(expectedVersionString) && (currentVersionString !== expectedVersionString);
                    return Promise.resolve({ canceled: false, data: new GetApplicationUpdateStatusClientResponse({ isUpdateRequired: isUpdateRequired }) });
                };
                return GetApplicationUpdateStatusClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_23("default", GetApplicationUpdateStatusClientRequestHandler);
        }
    };
});
System.register("TaskRecorder/DownloadTaskRecorderFileClientRequestHandler", [], function (exports_24, context_24) {
    "use strict";
    var DownloadTaskRecorderFileClientRequest, DownloadTaskRecorderFileClientResponse, DownloadTaskRecorderFileClientRequestRequestHandler;
    var __moduleName = context_24 && context_24.id;
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
                    var _this = this;
                    var result = new Commerce.AsyncResult();
                    var fileName = Commerce.UrlHelper.extractFileName(request.fileUrl);
                    this._showSaveDialog(fileName)
                        .done(function (file) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(file)) {
                            result.resolve({ canceled: true, data: null });
                            return;
                        }
                        _this._downloadFile(request.fileUrl, file)
                            .done(function () {
                            result.resolve({ canceled: false, data: new DownloadTaskRecorderFileClientResponse() });
                        })
                            .fail(function (errors) {
                            result.reject(errors);
                        });
                    }).fail(function (errors) {
                        result.reject(errors);
                    });
                    return result.getPromise();
                };
                DownloadTaskRecorderFileClientRequestRequestHandler.prototype._showSaveDialog = function (suggestedFileName) {
                    var result = new Commerce.AsyncResult();
                    var fileExtension = this._extractFileExtension(suggestedFileName);
                    var fileTypeChoice = this._getFileTypeChoice(fileExtension);
                    if (Commerce.ObjectExtensions.isNullOrUndefined(fileTypeChoice)) {
                        return Commerce.AsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.TASK_RECORDER_UNEXPECTED_FILE_EXTENSION, false, Commerce.StringExtensions.EMPTY, [fileExtension])]);
                    }
                    Commerce.RetailLogger.taskRecorderShowSaveDialog(suggestedFileName, fileTypeChoice.name);
                    var savePicker = new Windows.Storage.Pickers.FileSavePicker();
                    savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
                    savePicker.fileTypeChoices.insert(Commerce.ViewModelAdapter.getResourceString(fileTypeChoice.name), fileTypeChoice.fileExtensions);
                    savePicker.suggestedFileName = suggestedFileName;
                    savePicker.pickSaveFileAsync().then(function (file) {
                        result.resolve(file);
                    }, function (error) {
                        result.reject([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.TASK_RECORDER_ERROR_OCCURRED_DURING_DISPLAYING_SAVE_DIALOG, false, Commerce.StringExtensions.EMPTY, [Commerce.ErrorHelper.serializeError(error)])]);
                    });
                    return result;
                };
                DownloadTaskRecorderFileClientRequestRequestHandler.prototype._getFileTypeChoice = function (fileExtension) {
                    fileExtension = fileExtension.toLowerCase();
                    for (var i = 0; i < DownloadTaskRecorderFileClientRequestRequestHandler.FILE_TYPE_CHOICES.length; i++) {
                        if (DownloadTaskRecorderFileClientRequestRequestHandler.FILE_TYPE_CHOICES[i].fileExtensions.indexOf(fileExtension) !== -1) {
                            return DownloadTaskRecorderFileClientRequestRequestHandler.FILE_TYPE_CHOICES[i];
                        }
                    }
                    return null;
                };
                DownloadTaskRecorderFileClientRequestRequestHandler.prototype._extractFileExtension = function (fileName) {
                    var lastDotPos = fileName.lastIndexOf(".");
                    if (lastDotPos === -1) {
                        return Commerce.StringExtensions.EMPTY;
                    }
                    return fileName.slice(lastDotPos);
                };
                DownloadTaskRecorderFileClientRequestRequestHandler.prototype._downloadFile = function (url, file) {
                    var result = new Commerce.VoidAsyncResult();
                    Commerce.RetailLogger.taskRecorderDownloadFile(url, file.path);
                    try {
                        Windows.Storage.CachedFileManager.deferUpdates(file);
                        var uri = new Windows.Foundation.Uri(url);
                        var downloader = new Windows.Networking.BackgroundTransfer.BackgroundDownloader();
                        var download = downloader.createDownload(uri, file);
                        download.startAsync().then(function () {
                            Windows.Storage.CachedFileManager.completeUpdatesAsync(file).then(function (updateStatus) {
                                if (updateStatus === Windows.Storage.Provider.FileUpdateStatus.complete) {
                                    Commerce.RetailLogger.taskRecorderFileWasSaved(file.name);
                                    result.resolve();
                                }
                                else {
                                    result.reject([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.TASK_RECORDER_COULDNT_SAVE_FILE, false, Commerce.StringExtensions.EMPTY, [file.name, updateStatus.toString()])]);
                                }
                            }, function (errors) {
                                result.reject([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.TASK_RECORDER_COULDNT_COMPLETE_UPDATES_FOR_FILE, false, Commerce.StringExtensions.EMPTY, [file.name, Commerce.ErrorHelper.serializeError(errors)])]);
                            });
                        }, function (errors) {
                            result.reject([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.TASK_RECORDER_COULDNT_DOWNLOAD_FILE, false, Commerce.StringExtensions.EMPTY, [url, Commerce.ErrorHelper.serializeError(errors)])]);
                        });
                    }
                    catch (exception) {
                        result.reject([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.TASK_RECORDER_COULDNT_DOWNLOAD_FILE, false, Commerce.StringExtensions.EMPTY, [url, JSON.stringify(exception)])]);
                    }
                    return result;
                };
                DownloadTaskRecorderFileClientRequestRequestHandler.FILE_TYPE_CHOICES = [
                    {
                        name: "string_10102",
                        fileExtensions: [".xml"]
                    },
                    {
                        name: "string_10103",
                        fileExtensions: [".doc", ".docx"]
                    },
                    {
                        name: "string_10105",
                        fileExtensions: [".ax7bpm"]
                    },
                    {
                        name: "string_10121",
                        fileExtensions: [".axtr"]
                    }
                ];
                return DownloadTaskRecorderFileClientRequestRequestHandler;
            }(Commerce.RequestHandler));
            exports_24("default", DownloadTaskRecorderFileClientRequestRequestHandler);
        }
    };
});
System.register("TaskRecorder/UploadTaskRecorderScreenshotsRequestHandler", [], function (exports_25, context_25) {
    "use strict";
    var UploadTaskRecorderScreenshotsRequest, UploadTaskRecorderScreenshotsRequestHandler;
    var __moduleName = context_25 && context_25.id;
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
                    var errorUploadingResourceId = "string_10214";
                    var recordingManager = Commerce.Model.Managers.Factory.getManager(Commerce.Model.Managers.IRecordingManagerName);
                    var storageAccessToken;
                    var asyncQueue = new Commerce.AsyncQueue();
                    var screenshotsFolders = [];
                    asyncQueue.enqueue(function () {
                        return recordingManager.getStorageAccessTokenForUpload().done(function (result) {
                            storageAccessToken = result;
                        })
                            .fail(function () {
                            asyncQueue.cancel();
                        });
                    });
                    var createdNodes = [];
                    for (var i = 0; i < request.nodes.length; i++) {
                        if (!Commerce.StringExtensions.isNullOrWhitespace(request.nodes[i].ScreenshotUri)
                            && !UploadTaskRecorderScreenshotsRequestHandler._isUrl(request.nodes[i].ScreenshotUri)) {
                            var folderPath = Microsoft.Dynamics.Commerce.ClientBroker.TaskRecorderFileManager.extractFolderPath(request.nodes[i].ScreenshotUri);
                            if (screenshotsFolders.indexOf(folderPath) === -1) {
                                screenshotsFolders.push(folderPath);
                            }
                            (function (node) { return asyncQueue.enqueue(function () {
                                var result = new Commerce.VoidAsyncResult();
                                try {
                                    Microsoft.Dynamics.Commerce.ClientBroker.TaskRecorderFileManager.uploadFileToContainer(node.ScreenshotUri, storageAccessToken.Url, storageAccessToken.SasKey)
                                        .done(function (responseMessage) {
                                        if (responseMessage.isRequestSuccess) {
                                            Microsoft.Dynamics.Commerce.ClientBroker.TaskRecorderFileManager.deleteFileFromLocalStorage(node.ScreenshotUri);
                                            createdNodes.push({ ScreenshotUri: responseMessage.blobUrl, Id: node.Id });
                                            result.resolve();
                                        }
                                        else {
                                            var uploadingError = new Commerce.Proxy.Entities.Error(errorUploadingResourceId, false, "", [responseMessage.errorMessage]);
                                            result.reject([uploadingError]);
                                            asyncQueue.cancel();
                                        }
                                    });
                                }
                                catch (error) {
                                    result.reject([new Commerce.Proxy.Entities.Error(errorUploadingResourceId, false, Commerce.StringExtensions.EMPTY, [Commerce.Framework.ErrorConverter.serializeError(error)])]);
                                    asyncQueue.cancel();
                                }
                                return result;
                            }); })(request.nodes[i]);
                        }
                    }
                    return asyncQueue.run().fail(function (errors) {
                        Commerce.RetailLogger.taskRecorderScreenshotsUploadingFailed(Commerce.ErrorHelper.getErrorMessages(errors));
                        UploadTaskRecorderScreenshotsRequestHandler._clearLocalStorage(screenshotsFolders);
                    }).map(function () {
                        UploadTaskRecorderScreenshotsRequestHandler._clearLocalStorage(screenshotsFolders);
                        return { canceled: false, data: new Commerce.TaskRecorder.UploadTaskRecorderScreenshotsResponse(createdNodes) };
                    }).getPromise();
                };
                UploadTaskRecorderScreenshotsRequestHandler._isUrl = function (url) {
                    return (url.lastIndexOf("http://") === 0) || (url.lastIndexOf("https://") === 0);
                };
                UploadTaskRecorderScreenshotsRequestHandler._clearLocalStorage = function (folders) {
                    folders.forEach(function (folder) {
                        try {
                            Microsoft.Dynamics.Commerce.ClientBroker.TaskRecorderFileManager.deleteFolderFromLocalStorage(folder);
                        }
                        catch (error) {
                            Commerce.RetailLogger.taskRecorderDeleteFolderFromLocalStorageFailed(folder, Commerce.Framework.ErrorConverter.serializeError(error));
                        }
                    });
                };
                return UploadTaskRecorderScreenshotsRequestHandler;
            }(Commerce.RequestHandler));
            exports_25("default", UploadTaskRecorderScreenshotsRequestHandler);
        }
    };
});
System.register("TaskRecorder/TakeTaskRecorderScreenshotClientRequestHandler", ["Utilities/PromiseConverter"], function (exports_26, context_26) {
    "use strict";
    var PromiseConverter_16, TakeTaskRecorderScreenshotClientRequest, TakeTaskRecorderScreenshotClientResponse, TakeTaskRecorderScreenshotClientRequestHandler;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (PromiseConverter_16_1) {
                PromiseConverter_16 = PromiseConverter_16_1;
            }
        ],
        execute: function () {
            TakeTaskRecorderScreenshotClientRequest = Commerce.TaskRecorder.TakeTaskRecorderScreenshotClientRequest;
            TakeTaskRecorderScreenshotClientResponse = Commerce.TaskRecorder.TakeTaskRecorderScreenshotClientResponse;
            TakeTaskRecorderScreenshotClientRequestHandler = (function (_super) {
                __extends(TakeTaskRecorderScreenshotClientRequestHandler, _super);
                function TakeTaskRecorderScreenshotClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TakeTaskRecorderScreenshotClientRequestHandler.prototype.supportedRequestType = function () {
                    return TakeTaskRecorderScreenshotClientRequest;
                };
                TakeTaskRecorderScreenshotClientRequestHandler.prototype.executeAsync = function (request) {
                    return PromiseConverter_16.default.convertAsyncOperationToPromise(Microsoft.Dynamics.Commerce.ClientBroker.ScreenCapture.takeScreenshotAsync(request.sessionId, request.stepId))
                        .then(function (value) {
                        return Promise.resolve({ canceled: false, data: new TakeTaskRecorderScreenshotClientResponse(value) });
                    });
                };
                return TakeTaskRecorderScreenshotClientRequestHandler;
            }(Commerce.RequestHandler));
            exports_26("default", TakeTaskRecorderScreenshotClientRequestHandler);
        }
    };
});
System.register("PlatformInitializer", ["Offline/Handlers/AddOfflineConfigurationClientRequestHandler", "Offline/Handlers/ExecuteOfflineRequestClientRequestHandler", "Peripherals/HardwareStation/DedicatedHardwareStationRequestHandler", "Configuration/Handlers/GetAppSettingsClientRequestHandler", "Diagnostics/Handlers/GetLoggingSinksClientRequestHandler", "AsyncClient/Handlers/ApplySessionFileToOfflineDatabaseRequestHandler", "AsyncClient/Handlers/CheckInitialFullPackageRequiredRequestHandler", "AsyncClient/Handlers/DeleteExpiredSessionsRequestHandler", "AsyncClient/Handlers/DownloadFileRequestHandler", "AsyncClient/Handlers/GetCDXFeatureParameterValueRequestHandler", "AsyncClient/Handlers/GetOfflineSyncStatisticsRequestHandler", "AsyncClient/Handlers/GetOfflineSwitchErrorCodesRequestHandler", "AsyncClient/Handlers/InitializeFeatureControlManagerRequestHandler", "AsyncClient/Handlers/LoadTransactionDataFromOfflineDatabaseRequestHandler", "AsyncClient/Handlers/ProcessDataPackageRequestHandler", "AsyncClient/Handlers/PurgeOfflineTransactionsRequestHandler", "AsyncClient/Handlers/StripMasterDataRequestHandler", "AsyncClient/Handlers/UpdateDownloadSessionStatusRequestHandler", "AsyncClient/Handlers/UpdateFullPackageIsRequestedRequestHandler", "AsyncClient/Handlers/UpdateUploadFailedStatusRequestHandler", "Framework/GetApplicationUpdateStatusClientRequestHandler", "TaskRecorder/DownloadTaskRecorderFileClientRequestHandler", "TaskRecorder/UploadTaskRecorderScreenshotsRequestHandler", "TaskRecorder/TakeTaskRecorderScreenshotClientRequestHandler"], function (exports_27, context_27) {
    "use strict";
    var AddOfflineConfigurationClientRequestHandler_1, ExecuteOfflineRequestClientRequestHandler_1, DedicatedHardwareStationRequestHandler_1, GetAppSettingsClientRequestHandler_1, GetLoggingSinksClientRequestHandler_1, ApplySessionFileToOfflineDatabaseRequestHandler_1, CheckInitialFullPackageRequiredRequestHandler_1, DeleteExpiredSessionsRequestHandler_1, DownloadFileRequestHandler_1, GetCDXFeatureParameterValueRequestHandler_1, GetOfflineSyncStatisticsRequestHandler_1, GetOfflineSwitchErrorCodesRequestHandler_1, InitializeFeatureControlManagerRequestHandler_1, LoadTransactionDataFromOfflineDatabaseRequestHandler_1, ProcessDataPackageRequestHandler_1, PurgeOfflineTransactionsRequestHandler_1, StripMasterDataRequestHandler_1, UpdateDownloadSessionStatusRequestHandler_1, UpdateFullPackageIsRequestedRequestHandler_1, UpdateUploadFailedStatusRequestHandler_1, GetApplicationUpdateStatusClientRequestHandler_1, DownloadTaskRecorderFileClientRequestHandler_1, UploadTaskRecorderScreenshotsRequestHandler_1, TakeTaskRecorderScreenshotClientRequestHandler_1, PosWindowsLegacyRuntimeInitializer, initializer;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (AddOfflineConfigurationClientRequestHandler_1_1) {
                AddOfflineConfigurationClientRequestHandler_1 = AddOfflineConfigurationClientRequestHandler_1_1;
            },
            function (ExecuteOfflineRequestClientRequestHandler_1_1) {
                ExecuteOfflineRequestClientRequestHandler_1 = ExecuteOfflineRequestClientRequestHandler_1_1;
            },
            function (DedicatedHardwareStationRequestHandler_1_1) {
                DedicatedHardwareStationRequestHandler_1 = DedicatedHardwareStationRequestHandler_1_1;
            },
            function (GetAppSettingsClientRequestHandler_1_1) {
                GetAppSettingsClientRequestHandler_1 = GetAppSettingsClientRequestHandler_1_1;
            },
            function (GetLoggingSinksClientRequestHandler_1_1) {
                GetLoggingSinksClientRequestHandler_1 = GetLoggingSinksClientRequestHandler_1_1;
            },
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
            function (GetCDXFeatureParameterValueRequestHandler_1_1) {
                GetCDXFeatureParameterValueRequestHandler_1 = GetCDXFeatureParameterValueRequestHandler_1_1;
            },
            function (GetOfflineSyncStatisticsRequestHandler_1_1) {
                GetOfflineSyncStatisticsRequestHandler_1 = GetOfflineSyncStatisticsRequestHandler_1_1;
            },
            function (GetOfflineSwitchErrorCodesRequestHandler_1_1) {
                GetOfflineSwitchErrorCodesRequestHandler_1 = GetOfflineSwitchErrorCodesRequestHandler_1_1;
            },
            function (InitializeFeatureControlManagerRequestHandler_1_1) {
                InitializeFeatureControlManagerRequestHandler_1 = InitializeFeatureControlManagerRequestHandler_1_1;
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
            function (GetApplicationUpdateStatusClientRequestHandler_1_1) {
                GetApplicationUpdateStatusClientRequestHandler_1 = GetApplicationUpdateStatusClientRequestHandler_1_1;
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
            PosWindowsLegacyRuntimeInitializer = (function () {
                function PosWindowsLegacyRuntimeInitializer(requestHandlerContext) {
                    this._context = requestHandlerContext;
                }
                PosWindowsLegacyRuntimeInitializer.prototype.populateCompositionLoader = function (compositionLoader) {
                    var _this = this;
                    compositionLoader.addRequestHandler(Commerce.Extensibility.LegacyGetExtensionPackagesConfigurationClientRequestHandler);
                    compositionLoader.addRequestHandler(Commerce.Extensibility.LoadExtensionStringResourcesFromFileClientRequestHandler);
                    compositionLoader.addRequestHandler(Commerce.Payments.Handlers.ClearMerchantInformationClientRequestHandler, function () { return _this._context; });
                    compositionLoader.addRequestHandler(AddOfflineConfigurationClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(ExecuteOfflineRequestClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(DedicatedHardwareStationRequestHandler_1.default);
                    compositionLoader.addRequestHandler(GetAppSettingsClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(GetLoggingSinksClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(ApplySessionFileToOfflineDatabaseRequestHandler_1.default);
                    compositionLoader.addRequestHandler(CheckInitialFullPackageRequiredRequestHandler_1.default);
                    compositionLoader.addRequestHandler(DeleteExpiredSessionsRequestHandler_1.default);
                    compositionLoader.addRequestHandler(DownloadFileRequestHandler_1.default);
                    compositionLoader.addRequestHandler(GetCDXFeatureParameterValueRequestHandler_1.default);
                    compositionLoader.addRequestHandler(GetOfflineSyncStatisticsRequestHandler_1.default);
                    compositionLoader.addRequestHandler(GetOfflineSwitchErrorCodesRequestHandler_1.default);
                    compositionLoader.addRequestHandler(InitializeFeatureControlManagerRequestHandler_1.default);
                    compositionLoader.addRequestHandler(LoadTransactionDataFromOfflineDatabaseRequestHandler_1.default);
                    compositionLoader.addRequestHandler(ProcessDataPackageRequestHandler_1.default);
                    compositionLoader.addRequestHandler(PurgeOfflineTransactionsRequestHandler_1.default);
                    compositionLoader.addRequestHandler(StripMasterDataRequestHandler_1.default);
                    compositionLoader.addRequestHandler(UpdateDownloadSessionStatusRequestHandler_1.default);
                    compositionLoader.addRequestHandler(UpdateFullPackageIsRequestedRequestHandler_1.default);
                    compositionLoader.addRequestHandler(UpdateUploadFailedStatusRequestHandler_1.default);
                    compositionLoader.addRequestHandler(TakeTaskRecorderScreenshotClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(UploadTaskRecorderScreenshotsRequestHandler_1.default);
                    compositionLoader.addRequestHandler(DownloadTaskRecorderFileClientRequestHandler_1.default);
                    compositionLoader.addRequestHandler(GetApplicationUpdateStatusClientRequestHandler_1.default);
                    compositionLoader.addRequestInterceptor(Commerce.Authentication.LogOnRequest, new Commerce.Offline.Interceptors.OfflineLogOnRequestInterceptor());
                    compositionLoader.addRequestInterceptor(Commerce.Authentication.LogOffClientRequest, new Commerce.Offline.Interceptors.SetOfflineConfigurationPostLogOffInterceptor());
                };
                return PosWindowsLegacyRuntimeInitializer;
            }());
            initializer = new PosWindowsLegacyRuntimeInitializer({
                applicationContext: Commerce.ApplicationContext.Instance,
                managerFactory: Commerce.Model.Managers.Factory,
                applicationSession: Commerce.ApplicationSession.instance,
                peripherals: Commerce.Peripherals.instance,
                runtime: Commerce.Runtime,
                stringResourceManager: Commerce.StringResourceManager,
                triggerManager: Commerce.Triggers.TriggerManager.instance,
                operationsManager: Commerce.Operations.OperationsManager.instance
            });
            exports_27("default", initializer);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // B838AoB99/lSB5B7nlNbMxIDvSvVshG+CTTCie2UlwOg
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgwOaY7aMnyPyn
// SIG // nvMCDbPw/x6cUX8Po6+BCnBfTclzpyYwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // ToPEcKlWNRY98QCuGGSjMlMo6iwiPgcOk4WvSXXWAvNm
// SIG // XJy0m7P1Fz65PhMe53QAT7+YkyAD0cWQ0sqjOxH/vGie
// SIG // HX9GrKzRqqlLCfmIzYtaRWV0p9jRNYOUnNnIMqPkql2v
// SIG // BSbc9v5rNnp45hc49RvwJzesLidM4+F1V7gTLNZMBsq5
// SIG // SOGpiJpWXnU35K7MglvesCBMWDAEVMMQM5tAM3yAgz0V
// SIG // IngUoBGBG/xXDuyPkkkLMpCZ/cxVqzYOriUIOAQ78E35
// SIG // eGuefHGIHkDd3hGwykOUk9YAKE7+Nuz4Jrq5uTpwN1pF
// SIG // QT6Rqfbbg4+MriVFYZ1hohKYL+uBDIdVZaGCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCCOCL6lQ6lAbspZ
// SIG // u5+jvK/IU4owrU4qY4Gp2LMOy4ilTwIGXz0rl4gVGBMy
// SIG // MDIwMDgyMzA0MDM0NC41OTRaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjo4RDQxLTRCRjctQjNCNzEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjwwggTxMIID2aADAgECAhMzAAABClLIOQFS
// SIG // 0XBLAAAAAAEKMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTkx
// SIG // NVoXDTIxMDEyMTIzMTkxNVowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOjhENDEtNEJGNy1CM0I3MSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuz4brZShcMWf
// SIG // hnj1P1dKTJHtteR0l/D3C19YY2FG8ghEQRbO/8BMK28D
// SIG // CGXTqOzQ6nCFIV17d5MYNTqgScbqM1XAifCcEcv1SO/a
// SIG // dWXi20r92jDMaLjs6KmjS/w5m/Ak/VBHKqtzxdfLzL9X
// SIG // GX5PGaYblUhjzNHlrCbxNZHz1wibGM7Gbbq6tIxCOlwY
// SIG // fYabikKvCkl76KghN+xGVq2Fst7oUSZ7K3eE6tmIGLMl
// SIG // kP2kBdtHW+92VsCLVxuE1JcuCENKXEIvf1B937FbtOqv
// SIG // P8jb3OzHyHJp2DlDzshTAYdBFudfSv5oP8WIDIbZmZZ8
// SIG // 5rx56+Z6cyU4sGwboZ8FJwIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFPhElKX9OkxNUN6R+DqtAaKRcYUoMB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBAFSX
// SIG // rnzUFfLd03MlqtErt51WGX3UXFeorE6dGY+YIwSmfFRK
// SIG // RNwEe8cmLt0EOxezyTV6+/fdYTyrPcPDvgR3k6F5sHeK
// SIG // ExohjrqcjxAa3yVQ9SJZakXZVKzaHWzbvMuA8kcmzj0J
// SIG // /Y6/pk57aFsp/kr+lu5aNdw5V3WgitJYpwE6foZQsBrT
// SIG // TPNRhIXVMHnPEk6s2+7nC6Ty9ZLIJhYeMyqLuitJGKvE
// SIG // iRhD8PYzkGJnLkjp61ICDk/00ZVZvvlXLonth32ZooeZ
// SIG // 9/+760o9g2lUhF8oaLHCB1i82dUChXdzZulUEwQ5CZWh
// SIG // 8WIjQZSUuvOO1vV0FfOqdNwcDyXuFdIwggZxMIIEWaAD
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
// SIG // OEQ0MS00QkY3LUIzQjcxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVADm9dqVx0X/uUa0VckV24hpoY975oIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi7Ec6MCIYDzIwMjAwODIzMDkzOTA2
// SIG // WhgPMjAyMDA4MjQwOTM5MDZaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOLsRzoCAQAwCgIBAAICChoCAf8wBwIB
// SIG // AAICEZYwCgIFAOLtmLoCAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQBKecWEF/oo
// SIG // fLV9xpv2KKZJENQickzlHA3tUaiQW/Matg80oigwzLaR
// SIG // oK26c/cVXxBdNLQMWVwPaxEeE7tk8+mMh1PScZVfvekD
// SIG // vKxhsY+7Y9Zc6+/2Q7U/OGu0mFW5/zIlsmpFIaUTXTci
// SIG // mqi2Gt8A3W0tO9l30Ot+WZniBkIloTGCAw0wggMJAgEB
// SIG // MIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAABClLIOQFS0XBLAAAAAAEKMA0GCWCGSAFlAwQCAQUA
// SIG // oIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQw
// SIG // LwYJKoZIhvcNAQkEMSIEIGay5YxxC+hCIlB96/U38n6n
// SIG // 9timDi0E17hHWhNLboioMIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgVwM2JDO6oQwoDehG8V22bUdxzZDW
// SIG // WhkjGB83y+TSrKowgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAQpSyDkBUtFwSwAAAAAB
// SIG // CjAiBCAamYhsxsiBXNuqvqKKDLvx9mjo82QZ1GU6r8Lz
// SIG // IyjdSDANBgkqhkiG9w0BAQsFAASCAQBRuRwn2WT2p1EE
// SIG // ibp/smF46Z/Lzw65bMurCp8OmX6bJWTmjOujCQ7Rxua3
// SIG // zViuqVutwNFZ3VqZFiHi59rwKPgDzE7Z1CuoNqQ3ylqi
// SIG // HWUr6shJcm7V3LD4L1ut5+YiwOlegNalnKvZpc5SAr7q
// SIG // NaZMltEQ+wF4O7VmQ4yJXHJBID8gl+VwLlGxiucyhU4q
// SIG // NkGoF0/+XXaSBs9ZHrg/rlNl3m3eXanH1Lg5VPJN6uLv
// SIG // 92QRqZ8nGIFZ5HEOL9gcaZZ3neIAB67ytfBDi0tNsdao
// SIG // QXYRqgS096axp+dttZ9hoAJe0iLREfehzee+I9n2AgF/
// SIG // XThCiW+86Syo+GSotTHa
// SIG // End signature block
