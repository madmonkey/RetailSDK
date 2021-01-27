var Microsoft;
(function (Microsoft) {
    var Dynamics;
    (function (Dynamics) {
        var Diagnostics;
        (function (Diagnostics) {
            var TypeScriptCore;
            (function (TypeScriptCore) {
                "use strict";
                var AppInsightsSink = (function () {
                    function AppInsightsSink(appInsightsInstrumentationKey, applicationName) {
                        this.appSessionId = TypeScriptCore.Utils.emptyGuid();
                        this.userSessionId = TypeScriptCore.Utils.emptyGuid();
                        this.tenantId = TypeScriptCore.Utils.emptyGuid();
                        this.application = applicationName;
                        this.applicationVersion = AppInsightsSink.appBaseVersion;
                        var defaultAppInsightsConfig = Microsoft.ApplicationInsights.Initialization.getDefaultConfig();
                        defaultAppInsightsConfig.instrumentationKey = appInsightsInstrumentationKey;
                        defaultAppInsightsConfig.endpointUrl = "https:" + defaultAppInsightsConfig.endpointUrl;
                        this.appInsightsProxy = new Microsoft.ApplicationInsights.AppInsights(defaultAppInsightsConfig);
                        this.appInsightsProxy.context.application.ver = this.applicationVersion;
                    }
                    AppInsightsSink.prototype.setSessionInfo = function (appSessionId, userSessionId, deviceId, deviceNumber, terminalId, userId, tenantId, offlineAvailability, offlineCurrentMode) {
                        this.appSessionId = appSessionId;
                        this.userSessionId = userSessionId;
                        this.deviceId = deviceId;
                        this.deviceNumber = deviceNumber;
                        this.terminalId = terminalId;
                        this.userId = userId;
                        this.tenantId = tenantId;
                        this.offlineAvailability = offlineAvailability;
                        this.offlineCurrentMode = offlineCurrentMode;
                        this.appInsightsProxy.context.user.id = userId;
                    };
                    AppInsightsSink.prototype.setInstrumentationKey = function (instrumentationKey) {
                        this.appInsightsProxy.config.instrumentationKey = instrumentationKey;
                    };
                    AppInsightsSink.prototype.writeEvent = function (event) {
                        var payload;
                        if (event.Payload) {
                            payload = event.Payload;
                        }
                        else {
                            payload = {};
                        }
                        this.overrideObjectField(payload, "Application", this.application);
                        this.overrideObjectField(payload, "AppSessionId", this.appSessionId);
                        this.overrideObjectField(payload, "DeviceId", this.deviceId);
                        this.overrideObjectField(payload, "DeviceNumber", this.deviceNumber);
                        this.overrideObjectField(payload, "TerminalId", this.terminalId);
                        this.overrideObjectField(payload, "UserId", this.userId);
                        this.overrideObjectField(payload, "UserSessionId", this.userSessionId);
                        this.overrideObjectField(payload, "TenantId", this.tenantId);
                        this.overrideObjectField(payload, "OfflineAvailability", this.offlineAvailability);
                        this.overrideObjectField(payload, "OfflineCurrentMode", this.offlineCurrentMode);
                        if (event.Type === TypeScriptCore.EventType.Custom) {
                            this.overrideObjectField(payload, "EventId", event.StaticMetadata.Id);
                            this.overrideObjectField(payload, "EventVersion", event.StaticMetadata.Version);
                            this.overrideObjectField(payload, "EventSeverity", event.StaticMetadata.LevelName);
                            this.appInsightsProxy.trackEvent(event.StaticMetadata.Name, payload, null);
                        }
                        else if (event.Type === TypeScriptCore.EventType.PageView) {
                            this.appInsightsProxy.trackPageView(event.PageViewMetadata.PageName, "", payload, null);
                        }
                    };
                    AppInsightsSink.prototype.overrideObjectField = function (object, field, value) {
                        var fieldsToRemove;
                        fieldsToRemove = Object.keys(object).filter(function (fieldName, fieldIndex, keysArray) {
                            return fieldName.toLowerCase() === field.toLowerCase();
                        });
                        if (fieldsToRemove === null) {
                            return;
                        }
                        for (var i = 0; i < fieldsToRemove.length; i++) {
                            delete object[fieldsToRemove[i]];
                        }
                        object[field] = value;
                    };
                    return AppInsightsSink;
                }());
                AppInsightsSink.appBaseVersion = "7.3.1971.50260";
                TypeScriptCore.AppInsightsSink = AppInsightsSink;
            })(TypeScriptCore = Diagnostics.TypeScriptCore || (Diagnostics.TypeScriptCore = {}));
        })(Diagnostics = Dynamics.Diagnostics || (Dynamics.Diagnostics = {}));
    })(Dynamics = Microsoft.Dynamics || (Microsoft.Dynamics = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var Dynamics;
    (function (Dynamics) {
        var Diagnostics;
        (function (Diagnostics) {
            var TypeScriptCore;
            (function (TypeScriptCore) {
                "use strict";
                var DebuggingConsoleSink = (function () {
                    function DebuggingConsoleSink() {
                    }
                    DebuggingConsoleSink.prototype.setSessionInfo = function (appSessionId, userSessionId, deviceId, deviceNumber, terminalId, userId, tenantId, offlineAvailability, offlineCurrentMode) {
                    };
                    DebuggingConsoleSink.prototype.setInstrumentationKey = function (instrumentationKey) {
                    };
                    DebuggingConsoleSink.prototype.writeEvent = function (event) {
                        var args = [];
                        for (var name in event.Payload) {
                            args.push(event.Payload[name]);
                        }
                        if (event.Type === Microsoft.Dynamics.Diagnostics.TypeScriptCore.EventType.Custom) {
                            var message = event.StaticMetadata.Message.toString();
                            args.forEach(function (arg, index) {
                                var param = arg.toString().replace(/\$/gi, '$$$$');
                                var regexp = new RegExp('\\{' + index + '\\}', 'gi');
                                message = message.replace(regexp, param);
                            });
                            var level = event.StaticMetadata.Level;
                            switch (level) {
                                case Microsoft.Dynamics.Diagnostics.TypeScriptCore.EventLevel.Critical:
                                case Microsoft.Dynamics.Diagnostics.TypeScriptCore.EventLevel.Error:
                                    console.error(message);
                                    break;
                                case Microsoft.Dynamics.Diagnostics.TypeScriptCore.EventLevel.Warning:
                                    console.warn(message);
                                    break;
                                case Microsoft.Dynamics.Diagnostics.TypeScriptCore.EventLevel.LogAlways:
                                case Microsoft.Dynamics.Diagnostics.TypeScriptCore.EventLevel.Informational:
                                case Microsoft.Dynamics.Diagnostics.TypeScriptCore.EventLevel.Verbose:
                                    console.info(message);
                                    break;
                            }
                        }
                        else if (event.Type === Microsoft.Dynamics.Diagnostics.TypeScriptCore.EventType.PageView) {
                            console.info("Page Loaded: " + event.PageViewMetadata.PageName);
                        }
                    };
                    return DebuggingConsoleSink;
                }());
                TypeScriptCore.DebuggingConsoleSink = DebuggingConsoleSink;
            })(TypeScriptCore = Diagnostics.TypeScriptCore || (Diagnostics.TypeScriptCore = {}));
        })(Diagnostics = Dynamics.Diagnostics || (Dynamics.Diagnostics = {}));
    })(Dynamics = Microsoft.Dynamics || (Microsoft.Dynamics = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var Dynamics;
    (function (Dynamics) {
        var Diagnostics;
        (function (Diagnostics) {
            var TypeScriptCore;
            (function (TypeScriptCore) {
                "use strict";
                var WindowsLoggingRequest = (function () {
                    function WindowsLoggingRequest() {
                    }
                    WindowsLoggingRequest.prototype.writeEvent = function (event) {
                        var request = JSON.stringify(event);
                        window.setImmediate(function () {
                            try {
                                Microsoft.Dynamics.Commerce.ClientBroker.Logger.logAsync(request)
                                    .done(function (response) {
                                }, function (error) {
                                    console.error("Logging request to native logging broker failed due to error sending the request to the broker.  Error: " + error);
                                });
                            }
                            catch (exception) {
                                console.error("Logging request to native logging broker failed due to a fatal error. Error: " + exception.message);
                            }
                        });
                    };
                    WindowsLoggingRequest.prototype.setSessionInfo = function (appSessionId, userSessionId, deviceId, deviceNumber, terminalId, userId, tenantId, offlineAvailability, offlineCurrentMode, screenResolution) {
                        window.setImmediate(function () {
                            Microsoft.Dynamics.Commerce.ClientBroker.Logger.setSessionInfoAsync(appSessionId, userSessionId, deviceId, deviceNumber, terminalId, userId, tenantId, offlineAvailability, offlineCurrentMode, screenResolution)
                                .done(function (response) { }, function (error) {
                                console.error("Setting the session info through the native logging broker failed due to error sending the request to the broker.  Error: " + error);
                            });
                        });
                    };
                    WindowsLoggingRequest.prototype.setInstrumentationKey = function (instrumentationKey) {
                        window.setImmediate(function () {
                            Microsoft.Dynamics.Commerce.ClientBroker.Logger.setInstrumentationKeyAsync(instrumentationKey)
                                .done(function (response) {
                                console.info("Called the API to set the instrumentation key on the client broker. Response: " + response);
                            }, function (error) {
                                console.error("Setting the instrumentation key through the native logging broker failed due to error sending the request to the broker.  Error: " + error);
                            });
                        });
                    };
                    return WindowsLoggingRequest;
                }());
                TypeScriptCore.WindowsLoggingRequest = WindowsLoggingRequest;
            })(TypeScriptCore = Diagnostics.TypeScriptCore || (Diagnostics.TypeScriptCore = {}));
        })(Diagnostics = Dynamics.Diagnostics || (Dynamics.Diagnostics = {}));
    })(Dynamics = Microsoft.Dynamics || (Microsoft.Dynamics = {}));
})(Microsoft || (Microsoft = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    function AccessControlData() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    }
    Commerce.AccessControlData = AccessControlData;
    function CustomerContent() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    }
    Commerce.CustomerContent = CustomerContent;
    function EndUserIdentifiableInformation() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    }
    Commerce.EndUserIdentifiableInformation = EndUserIdentifiableInformation;
    function OrganizationIdentifiableInformation() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    }
    Commerce.OrganizationIdentifiableInformation = OrganizationIdentifiableInformation;
    function AccountData() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    }
    Commerce.AccountData = AccountData;
    function SystemData() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    }
    Commerce.SystemData = SystemData;
})(Commerce || (Commerce = {}));
var Microsoft;
(function (Microsoft) {
    var Dynamics;
    (function (Dynamics) {
        var Diagnostics;
        (function (Diagnostics) {
            var TypeScriptCore;
            (function (TypeScriptCore) {
                var PayloadAnnotator = (function () {
                    function PayloadAnnotator(func) {
                        this.payload = {};
                        var names = Utils.getParameterNames(func);
                        var values = func.arguments;
                        for (var i = 0; i < names.length; i++) {
                            var name = names[i];
                            var value = values[i];
                            if (value == undefined) {
                                this.payload[name] = "undefined";
                            }
                            else {
                                if (PayloadAnnotator.isAllowedType(value) == true) {
                                    this.payload[name] = value;
                                }
                                else {
                                    throw ("Type validation failed for parameter " + name);
                                }
                            }
                        }
                    }
                    PayloadAnnotator.isAllowedType = function (variable) {
                        for (var i = 0; i < PayloadAnnotator.allowedTypes.length; i++) {
                            if (typeof variable == PayloadAnnotator.allowedTypes[i]) {
                                return true;
                            }
                        }
                        return false;
                    };
                    PayloadAnnotator.prototype.annotate = function (event) {
                        event.Payload = this.payload;
                    };
                    return PayloadAnnotator;
                }());
                PayloadAnnotator.allowedTypes = ['string', 'number', 'boolean'];
                TypeScriptCore.PayloadAnnotator = PayloadAnnotator;
                var EventType;
                (function (EventType) {
                    EventType[EventType["None"] = 0] = "None";
                    EventType[EventType["Custom"] = 1] = "Custom";
                    EventType[EventType["PageView"] = 2] = "PageView";
                })(EventType = TypeScriptCore.EventType || (TypeScriptCore.EventType = {}));
                var EventLevel;
                (function (EventLevel) {
                    EventLevel[EventLevel["LogAlways"] = 0] = "LogAlways";
                    EventLevel[EventLevel["Critical"] = 1] = "Critical";
                    EventLevel[EventLevel["Error"] = 2] = "Error";
                    EventLevel[EventLevel["Warning"] = 3] = "Warning";
                    EventLevel[EventLevel["Informational"] = 4] = "Informational";
                    EventLevel[EventLevel["Verbose"] = 5] = "Verbose";
                })(EventLevel = TypeScriptCore.EventLevel || (TypeScriptCore.EventLevel = {}));
                var EventKeywords;
                (function (EventKeywords) {
                    EventKeywords[EventKeywords["None"] = 0] = "None";
                    EventKeywords[EventKeywords["Performance"] = 1] = "Performance";
                    EventKeywords[EventKeywords["Diagnostic"] = 2] = "Diagnostic";
                    EventKeywords[EventKeywords["Exception"] = 4] = "Exception";
                    EventKeywords[EventKeywords["Availability"] = 8] = "Availability";
                    EventKeywords[EventKeywords["Usability"] = 16] = "Usability";
                    EventKeywords[EventKeywords["Configuration"] = 32] = "Configuration";
                    EventKeywords[EventKeywords["Context"] = 64] = "Context";
                    EventKeywords[EventKeywords["SqlOperation"] = 256] = "SqlOperation";
                    EventKeywords[EventKeywords["OutboundServiceCall"] = 512] = "OutboundServiceCall";
                    EventKeywords[EventKeywords["InboundServiceCall"] = 1024] = "InboundServiceCall";
                    EventKeywords[EventKeywords["GenericEvent"] = 2048] = "GenericEvent";
                    EventKeywords[EventKeywords["LegacyMonitoringEvent"] = 4096] = "LegacyMonitoringEvent";
                    EventKeywords[EventKeywords["Telemetry"] = 8192] = "Telemetry";
                    EventKeywords[EventKeywords["DataAccess"] = 4294967296] = "DataAccess";
                })(EventKeywords = TypeScriptCore.EventKeywords || (TypeScriptCore.EventKeywords = {}));
                var EventChannel;
                (function (EventChannel) {
                    EventChannel[EventChannel["Admin"] = 16] = "Admin";
                    EventChannel[EventChannel["Operational"] = 17] = "Operational";
                    EventChannel[EventChannel["Analytic"] = 18] = "Analytic";
                    EventChannel[EventChannel["Debug"] = 19] = "Debug";
                })(EventChannel = TypeScriptCore.EventChannel || (TypeScriptCore.EventChannel = {}));
                ;
                var PageViewMetadata = (function () {
                    function PageViewMetadata() {
                    }
                    return PageViewMetadata;
                }());
                TypeScriptCore.PageViewMetadata = PageViewMetadata;
                var EventStaticMetadata = (function () {
                    function EventStaticMetadata() {
                    }
                    return EventStaticMetadata;
                }());
                TypeScriptCore.EventStaticMetadata = EventStaticMetadata;
                var EventCoreFields = (function () {
                    function EventCoreFields() {
                    }
                    return EventCoreFields;
                }());
                TypeScriptCore.EventCoreFields = EventCoreFields;
                var Event = (function () {
                    function Event(type, appSessionId, userSessionId, deviceId, deviceNumber, terminalId, userId, tenantId, offlineAvailability, offlineCurrentMode, screenResolution) {
                        this.CoreFields = new EventCoreFields();
                        this.Type = type;
                        this.CoreFields.ClientTimestamp = Date.now();
                        this.CoreFields.AppSessionId = appSessionId;
                        this.CoreFields.UserSessionId = userSessionId;
                        this.CoreFields.DeviceId = deviceId;
                        this.CoreFields.DeviceNumber = deviceNumber;
                        this.CoreFields.TerminalId = terminalId;
                        this.CoreFields.UserId = userId;
                        this.CoreFields.TenantId = tenantId;
                        this.CoreFields.OfflineAvailability = offlineAvailability;
                        this.CoreFields.OfflineCurrentMode = offlineCurrentMode;
                        this.CoreFields.ScreenResolution = screenResolution;
                        if (this.Type == EventType.Custom) {
                            this.StaticMetadata = new EventStaticMetadata();
                        }
                        else if (this.Type == EventType.PageView) {
                            this.PageViewMetadata = new PageViewMetadata();
                        }
                    }
                    return Event;
                }());
                TypeScriptCore.Event = Event;
                var Utils = (function () {
                    function Utils() {
                    }
                    Utils.getParameterNames = function (func) {
                        var stripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                        var argNames = /([^\s,]+)/g;
                        var funcStr = func.toString().replace(stripComments, '');
                        var result = funcStr.slice(funcStr.indexOf('(') + 1, funcStr.indexOf(')')).match(argNames);
                        if (result === null) {
                            result = [];
                        }
                        return result;
                    };
                    Utils.generateGuid = function () {
                        function guidPart() {
                            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                        }
                        return guidPart() + guidPart() + '-' + guidPart() + '-' + guidPart() + '-' + guidPart() + '-' + guidPart() + guidPart() + guidPart();
                    };
                    Utils.emptyGuid = function () {
                        return "00000000-0000-0000-0000-000000000000";
                    };
                    return Utils;
                }());
                TypeScriptCore.Utils = Utils;
                var LoggerBase = (function () {
                    function LoggerBase() {
                    }
                    LoggerBase.addAnnotator = function (annotator) {
                        LoggerBase.annotators.push(annotator);
                    };
                    LoggerBase.addLoggingSink = function (loggingSink) {
                        LoggerBase.loggingSinks.push(loggingSink);
                    };
                    LoggerBase.setEmergencySink = function (sink) {
                        LoggerBase.emergencySink = sink;
                    };
                    LoggerBase.setAppSessionId = function (id) {
                        LoggerBase.appSessionId = id;
                        this.refreshSessionInfo();
                    };
                    LoggerBase.setUserSession = function (userSessionId, userId) {
                        LoggerBase.userSessionId = userSessionId;
                        LoggerBase.userId = userId;
                        this.refreshSessionInfo();
                    };
                    LoggerBase.setDeviceOfflineInfo = function (offlineMode, isOffline) {
                        LoggerBase.offlineAvailability = offlineMode;
                        LoggerBase.offlineCurrentMode = isOffline;
                        this.refreshSessionInfo();
                    };
                    LoggerBase.setDeviceInfo = function (deviceId, deviceNumber, terminalId) {
                        LoggerBase.deviceId = deviceId;
                        LoggerBase.deviceNumber = deviceNumber;
                        LoggerBase.terminalId = terminalId;
                        this.refreshSessionInfo();
                    };
                    LoggerBase.setTenantInfo = function (tenantId) {
                        LoggerBase.tenantId = tenantId;
                        this.refreshSessionInfo();
                    };
                    LoggerBase.clearUserSession = function () {
                        LoggerBase.userSessionId = Utils.emptyGuid();
                        LoggerBase.userId = "";
                        this.refreshSessionInfo();
                    };
                    LoggerBase.getAppSessionId = function () {
                        return LoggerBase.appSessionId;
                    };
                    LoggerBase.getUserSessionId = function () {
                        return LoggerBase.userSessionId;
                    };
                    LoggerBase.getScreenResolution = function () {
                        return window.screen.width + "x" + window.screen.height;
                    };
                    LoggerBase.refreshSessionInfo = function () {
                        for (var i = 0; i < LoggerBase.loggingSinks.length; i++) {
                            LoggerBase.loggingSinks[i].setSessionInfo(LoggerBase.appSessionId, LoggerBase.userSessionId, LoggerBase.deviceId, LoggerBase.deviceNumber, LoggerBase.terminalId, LoggerBase.userId, LoggerBase.tenantId, LoggerBase.offlineAvailability, LoggerBase.offlineCurrentMode, LoggerBase.getScreenResolution());
                        }
                    };
                    LoggerBase.setInstrumentationKey = function (instrumentationKey) {
                        for (var i = 0; i < LoggerBase.loggingSinks.length; i++) {
                            LoggerBase.loggingSinks[i].setInstrumentationKey(instrumentationKey);
                        }
                    };
                    LoggerBase.writeEvent = function (name, eventId, version, channel, level, keywords, task, opCode, message) {
                        var event = new Event(EventType.Custom, LoggerBase.appSessionId, LoggerBase.userSessionId, LoggerBase.deviceId, LoggerBase.deviceNumber, LoggerBase.terminalId, LoggerBase.userId, LoggerBase.tenantId, LoggerBase.offlineAvailability, LoggerBase.offlineCurrentMode, LoggerBase.getScreenResolution());
                        event.StaticMetadata.Name = name;
                        event.StaticMetadata.Id = eventId;
                        event.StaticMetadata.Version = version;
                        event.StaticMetadata.Level = level;
                        event.StaticMetadata.LevelName = EventLevel[level];
                        event.StaticMetadata.Channel = channel;
                        event.StaticMetadata.ChannelName = EventChannel[channel];
                        event.StaticMetadata.Keywords = keywords;
                        event.StaticMetadata.Task = task;
                        event.StaticMetadata.OpCode = opCode;
                        event.StaticMetadata.Message = message;
                        var payload = new PayloadAnnotator(arguments.callee.caller);
                        payload.annotate(event);
                        this.dispatchEvent(event);
                    };
                    LoggerBase.writePageViewEvent = function (pageName) {
                        var event = new Event(EventType.PageView, LoggerBase.appSessionId, LoggerBase.userSessionId, LoggerBase.deviceId, LoggerBase.deviceNumber, LoggerBase.terminalId, LoggerBase.userId, LoggerBase.tenantId, LoggerBase.offlineAvailability, LoggerBase.offlineCurrentMode, LoggerBase.getScreenResolution());
                        event.PageViewMetadata.PageName = pageName;
                        this.dispatchEvent(event);
                    };
                    LoggerBase.dispatchEvent = function (event) {
                        try {
                            for (var i = 0; i < LoggerBase.annotators.length; i++) {
                                LoggerBase.annotators[i].annotate(event);
                            }
                            for (var i = 0; i < LoggerBase.loggingSinks.length; i++) {
                                LoggerBase.loggingSinks[i].writeEvent(event);
                            }
                        }
                        catch (Error) {
                            try {
                                if (typeof LoggerBase.emergencySink !== 'undefined') {
                                    LoggerBase.emergencySink.handleError(Error);
                                }
                            }
                            catch (Error) {
                            }
                        }
                    };
                    return LoggerBase;
                }());
                LoggerBase.appSessionId = Utils.emptyGuid();
                LoggerBase.userSessionId = Utils.emptyGuid();
                LoggerBase.deviceId = "";
                LoggerBase.deviceNumber = "";
                LoggerBase.terminalId = "";
                LoggerBase.userId = "";
                LoggerBase.tenantId = "";
                LoggerBase.annotators = [];
                LoggerBase.loggingSinks = [];
                TypeScriptCore.LoggerBase = LoggerBase;
            })(TypeScriptCore = Diagnostics.TypeScriptCore || (Diagnostics.TypeScriptCore = {}));
        })(Diagnostics = Dynamics.Diagnostics || (Dynamics.Diagnostics = {}));
    })(Dynamics = Microsoft.Dynamics || (Microsoft.Dynamics = {}));
})(Microsoft || (Microsoft = {}));
//# sourceMappingURL=Diagnostics.TypeScriptCore.js.map
// SIG // Begin signature block
// SIG // MIIkJgYJKoZIhvcNAQcCoIIkFzCCJBMCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // xQvhr/9FGJwQXH0fOeQlkzNwEEIIwpL1rQF9kODRDWig
// SIG // gg2DMIIGATCCA+mgAwIBAgITMwAAAMTpifh6gVDp/wAA
// SIG // AAAAxDANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTE3MDgxMTIwMjAyNFoX
// SIG // DTE4MDgxMTIwMjAyNFowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // iIq4JMMHj5qAeRX8JmD8cogs+vSjl4iWRrejy1+JLzoz
// SIG // Lh6RePp8qR+CAbV6yxq8A8pG68WZ9/sEHfKFCv8ibqHy
// SIG // Zz3FJxjlKB/1BJRBY+zjuhWM7ROaNd44cFRvO+ytRQkw
// SIG // ScG+jzCZDMt2yfdzlRZ30Yu7lMcIhSDtHqg18XHC4HQA
// SIG // S4rS3JHr1nj+jfqtYIg9vbkfrmKXv8WEsZCu1q8r01T7
// SIG // NdrNcZLmHv/scWvLfwh2dOAQUUjU8QDISEyjBzXlWQ39
// SIG // fJzI5lrjhfXWmg8fjqbkhBfB1sqfHQHH/UinE5IzlyFI
// SIG // MvjCJKIAsr5TyoNuKVuB7zhugPO77BML6wIDAQABo4IB
// SIG // gDCCAXwwHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFMvWYoTPYDnq/2fCXNLIu6u3
// SIG // wxOYMFIGA1UdEQRLMEmkRzBFMQ0wCwYDVQQLEwRNT1BS
// SIG // MTQwMgYDVQQFEysyMzAwMTIrYzgwNGI1ZWEtNDliNC00
// SIG // MjM4LTgzNjItZDg1MWZhMjI1NGZjMB8GA1UdIwQYMBaA
// SIG // FEhuZOVQBdOCqhc3NyK1bajKdQKVMFQGA1UdHwRNMEsw
// SIG // SaBHoEWGQ2h0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9w
// SIG // a2lvcHMvY3JsL01pY0NvZFNpZ1BDQTIwMTFfMjAxMS0w
// SIG // Ny0wOC5jcmwwYQYIKwYBBQUHAQEEVTBTMFEGCCsGAQUF
// SIG // BzAChkVodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // b3BzL2NlcnRzL01pY0NvZFNpZ1BDQTIwMTFfMjAxMS0w
// SIG // Ny0wOC5jcnQwDAYDVR0TAQH/BAIwADANBgkqhkiG9w0B
// SIG // AQsFAAOCAgEABhYf21fCUMgjT6JReNft+P3NvdXA8fkb
// SIG // Vu1TyGlHBdXEy+zi/JlblV8ROCjABUUT4Jp5iLxmq9u7
// SIG // 6wJVI7c9I3hBba748QBalJmKHMwJldCaHEQwqaUWx7pH
// SIG // W/UrNIufj1g3w04cryLKEM3YghCpNfCuIsiPJKaBi98n
// SIG // HORmHYk+Lv9XA03BboOgMuu0sy9QVl0GsRWMyB1jt3MM
// SIG // 49Z6Jg8qlkWnMoM+lj5XSXcjif6xEMeK5QgVUcUrWjFb
// SIG // OWqWqKSIa5Yob/HEruq9RRfMYk6BtVQaR46YpW3AbifG
// SIG // +CcfyO0gqQux8c4LmpTiap1pg6E2120g/oXV/8O4lzYJ
// SIG // /j0UwZgUqcCGzO+CwatVJEMYtUiFeIbQ+dKdPxnZFInn
// SIG // jZ9oJIhoO6nHgE4m5wghTGP9nJMVTTO1VmBP10q5OI7/
// SIG // Lt2xX6RDa8l4z7G7a4+DbIdyquql+5/dGtY5/GTJbT4I
// SIG // 5XyDsa28o7p7z5ZWpHpYyxJHYtIh7/w8xDEL9y8+ZKU3
// SIG // b2BQP7dEkE+gC4u+flj2x2eHYduemMTIjMtvR+HALpTt
// SIG // sfawMG3sakmo6ZZ2yL0IxP479a5zNwayVs8Z1Lv1lMqH
// SIG // HPKAagFPthuBc7PTWyI/OlgY34juZ8RJpy/cJYs9XtDs
// SIG // NESRHbyRDHaCPu/E2C2hBAKOSPnv3QLPA6Iwggd6MIIF
// SIG // YqADAgECAgphDpDSAAAAAAADMA0GCSqGSIb3DQEBCwUA
// SIG // MIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylN
// SIG // aWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3Jp
// SIG // dHkgMjAxMTAeFw0xMTA3MDgyMDU5MDlaFw0yNjA3MDgy
// SIG // MTA5MDlaMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAmBgNV
// SIG // BAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBIDIw
// SIG // MTEwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoIC
// SIG // AQCr8PpyEBwurdhuqoIQTTS68rZYIZ9CGypr6VpQqrgG
// SIG // OBoESbp/wwwe3TdrxhLYC/A4wpkGsMg51QEUMULTiQ15
// SIG // ZId+lGAkbK+eSZzpaF7S35tTsgosw6/ZqSuuegmv15ZZ
// SIG // ymAaBelmdugyUiYSL+erCFDPs0S3XdjELgN1q2jzy23z
// SIG // OlyhFvRGuuA4ZKxuZDV4pqBjDy3TQJP4494HDdVceaVJ
// SIG // KecNvqATd76UPe/74ytaEB9NViiienLgEjq3SV7Y7e1D
// SIG // kYPZe7J7hhvZPrGMXeiJT4Qa8qEvWeSQOy2uM1jFtz7+
// SIG // MtOzAz2xsq+SOH7SnYAs9U5WkSE1JcM5bmR/U7qcD60Z
// SIG // I4TL9LoDho33X/DQUr+MlIe8wCF0JV8YKLbMJyg4JZg5
// SIG // SjbPfLGSrhwjp6lm7GEfauEoSZ1fiOIlXdMhSz5SxLVX
// SIG // PyQD8NF6Wy/VI+NwXQ9RRnez+ADhvKwCgl/bwBWzvRvU
// SIG // VUvnOaEP6SNJvBi4RHxF5MHDcnrgcuck379GmcXvwhxX
// SIG // 24ON7E1JMKerjt/sW5+v/N2wZuLBl4F77dbtS+dJKacT
// SIG // KKanfWeA5opieF+yL4TXV5xcv3coKPHtbcMojyyPQDdP
// SIG // weGFRInECUzF1KVDL3SV9274eCBYLBNdYJWaPk8zhNqw
// SIG // iBfenk70lrC8RqBsmNLg1oiMCwIDAQABo4IB7TCCAekw
// SIG // EAYJKwYBBAGCNxUBBAMCAQAwHQYDVR0OBBYEFEhuZOVQ
// SIG // BdOCqhc3NyK1bajKdQKVMBkGCSsGAQQBgjcUAgQMHgoA
// SIG // UwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAPBgNVHRMBAf8E
// SIG // BTADAQH/MB8GA1UdIwQYMBaAFHItOgIxkEO5FAVO4eqn
// SIG // xzHRI4k0MFoGA1UdHwRTMFEwT6BNoEuGSWh0dHA6Ly9j
// SIG // cmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3Rz
// SIG // L01pY1Jvb0NlckF1dDIwMTFfMjAxMV8wM18yMi5jcmww
// SIG // XgYIKwYBBQUHAQEEUjBQME4GCCsGAQUFBzAChkJodHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01p
// SIG // Y1Jvb0NlckF1dDIwMTFfMjAxMV8wM18yMi5jcnQwgZ8G
// SIG // A1UdIASBlzCBlDCBkQYJKwYBBAGCNy4DMIGDMD8GCCsG
// SIG // AQUFBwIBFjNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpb3BzL2RvY3MvcHJpbWFyeWNwcy5odG0wQAYIKwYB
// SIG // BQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AcABvAGwAaQBj
// SIG // AHkAXwBzAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZI
// SIG // hvcNAQELBQADggIBAGfyhqWY4FR5Gi7T2HRnIpsLlhHh
// SIG // Y5KZQpZ90nkMkMFlXy4sPvjDctFtg/6+P+gKyju/R6mj
// SIG // 82nbY78iNaWXXWWEkH2LRlBV2AySfNIaSxzzPEKLUtCw
// SIG // /WvjPgcuKZvmPRul1LUdd5Q54ulkyUQ9eHoj8xN9ppB0
// SIG // g430yyYCRirCihC7pKkFDJvtaPpoLpWgKj8qa1hJYx8J
// SIG // aW5amJbkg/TAj/NGK978O9C9Ne9uJa7lryft0N3zDq+Z
// SIG // KJeYTQ49C/IIidYfwzIY4vDFLc5bnrRJOQrGCsLGra7l
// SIG // stnbFYhRRVg4MnEnGn+x9Cf43iw6IGmYslmJaG5vp7d0
// SIG // w0AFBqYBKig+gj8TTWYLwLNN9eGPfxxvFX1Fp3blQCpl
// SIG // o8NdUmKGwx1jNpeG39rz+PIWoZon4c2ll9DuXWNB41sH
// SIG // nIc+BncG0QaxdR8UvmFhtfDcxhsEvt9Bxw4o7t5lL+yX
// SIG // 9qFcltgA1qFGvVnzl6UJS0gQmYAf0AApxbGbpT9Fdx41
// SIG // xtKiop96eiL6SJUfq/tHI4D1nvi/a7dLl+LrdXga7Oo3
// SIG // mXkYS//WsyNodeav+vyL6wuA6mk7r/ww7QRMjt/fdW1j
// SIG // kT3RnVZOT7+AVyKheBEyIXrvQQqxP/uozKRdwaGIm1dx
// SIG // Vk5IRcBCyZt2WwqASGv9eZ/BvW1taslScxMNelDNMYIV
// SIG // +zCCFfcCAQEwgZUwfjELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEo
// SIG // MCYGA1UEAxMfTWljcm9zb2Z0IENvZGUgU2lnbmluZyBQ
// SIG // Q0EgMjAxMQITMwAAAMTpifh6gVDp/wAAAAAAxDANBglg
// SIG // hkgBZQMEAgEFAKCB6jAZBgkqhkiG9w0BCQMxDAYKKwYB
// SIG // BAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYKKwYBBAGC
// SIG // NwIBFTAvBgkqhkiG9w0BCQQxIgQgTIRUDDiXZx27bDeY
// SIG // iPlrv+noHXDjcEovNTbhCB9GcgQwfgYKKwYBBAGCNwIB
// SIG // DDFwMG6gPIA6AEQAaQBhAGcAbgBvAHMAdABpAGMAcwAu
// SIG // AFQAeQBwAGUAUwBjAHIAaQBwAHQAQwBvAHIAZQAuAGoA
// SIG // c6EugCxodHRwOi8vd3d3Lk1pY3Jvc29mdC5jb20vTWlj
// SIG // cm9zb2Z0RHluYW1pY3MvIDANBgkqhkiG9w0BAQEFAASC
// SIG // AQBy9uWPMd65Kkek3ZfUsTH8gbNhdQIwFWekfOFE5gkq
// SIG // 0eYKZymJ3GcMADdL1smMlJTJ/ongd97YipXs0Mmr0qiG
// SIG // D4d42vLBWLhDCOI9nvxRh7ZACygWYeWR+Rczz3b5+/j0
// SIG // ndjNF2+/MPlmYUPoT6RtWH397mVgCcSM4kA8jIbJ31gA
// SIG // 1hxqyD7DjlJGz61cSigz7DBsVNQqJr4dM0yKl7SRsCpk
// SIG // tVfaacQHIZ5pHHuRc+W1IpCapPaseHihSch1PD99v9yG
// SIG // CcTlpJnbAPe3K1GFqd2DTkTxrQHf6zsRxRVF6DtCsqvg
// SIG // Ham/a84c+I5JW8l9bwdYp/U0x5JDZzWYmZcAoYITSTCC
// SIG // E0UGCisGAQQBgjcDAwExghM1MIITMQYJKoZIhvcNAQcC
// SIG // oIITIjCCEx4CAQMxDzANBglghkgBZQMEAgEFADCCATwG
// SIG // CyqGSIb3DQEJEAEEoIIBKwSCAScwggEjAgEBBgorBgEE
// SIG // AYRZCgMBMDEwDQYJYIZIAWUDBAIBBQAEIHl9Nx5Qdj+T
// SIG // ZN6SQvlF6l7IrFNYkGWrWg7ek6MMWxtSAgZaTsFzduMY
// SIG // EzIwMTgwMTMwMDAzODM5LjQ2NlowBwIBAYACA+eggbik
// SIG // gbUwgbIxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xDDAKBgNVBAsT
// SIG // A0FPQzEnMCUGA1UECxMebkNpcGhlciBEU0UgRVNOOjg0
// SIG // M0QtMzdGNi1GMTA0MSUwIwYDVQQDExxNaWNyb3NvZnQg
// SIG // VGltZS1TdGFtcCBTZXJ2aWNloIIOzTCCBnEwggRZoAMC
// SIG // AQICCmEJgSoAAAAAAAIwDQYJKoZIhvcNAQELBQAwgYgx
// SIG // CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9u
// SIG // MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xMjAwBgNVBAMTKU1pY3Jv
// SIG // c29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eSAy
// SIG // MDEwMB4XDTEwMDcwMTIxMzY1NVoXDTI1MDcwMTIxNDY1
// SIG // NVowfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMd
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwggEi
// SIG // MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCpHQ28
// SIG // dxGKOiDs/BOX9fp/aZRrdFQQ1aUKAIKF++18aEssX8XD
// SIG // 5WHCdrc+Zitb8BVTJwQxH0EbGpUdzgkTjnxhMFmxMEQP
// SIG // 8WCIhFRDDNdNuDgIs0Ldk6zWczBXJoKjRQ3Q6vVHgc2/
// SIG // JGAyWGBG8lhHhjKEHnRhZ5FfgVSxz5NMksHEpl3RYRNu
// SIG // KMYa+YaAu99h/EbBJx0kZxJyGiGKr0tkiVBisV39dx89
// SIG // 8Fd1rL2KQk1AUdEPnAY+Z3/1ZsADlkR+79BL/W7lmsqx
// SIG // qPJ6Kgox8NpOBpG2iAg16HgcsOmZzTznL0S6p/TcZL2k
// SIG // AcEgCZN4zfy8wMlEXV4WnAEFTyJNAgMBAAGjggHmMIIB
// SIG // 4jAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4EFgQU1WM6
// SIG // XIoxkPNDe3xGG8UzaFqFbVUwGQYJKwYBBAGCNxQCBAwe
// SIG // CgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB
// SIG // /wQFMAMBAf8wHwYDVR0jBBgwFoAU1fZWy4/oolxiaNE9
// SIG // lJBb186aGMQwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYtMjMuY3JsMFoG
// SIG // CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXRfMjAxMC0wNi0yMy5jcnQwgaAGA1UdIAEB
// SIG // /wSBlTCBkjCBjwYJKwYBBAGCNy4DMIGBMD0GCCsGAQUF
// SIG // BwIBFjFodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vUEtJ
// SIG // L2RvY3MvQ1BTL2RlZmF1bHQuaHRtMEAGCCsGAQUFBwIC
// SIG // MDQeMiAdAEwAZQBnAGEAbABfAFAAbwBsAGkAYwB5AF8A
// SIG // UwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3DQEB
// SIG // CwUAA4ICAQAH5ohRDeLG4Jg/gXEDPZ2joSFvs+umzPUx
// SIG // vs8F4qn++ldtGTCzwsVmyWrf9efweL3HqJ4l4/m87WtU
// SIG // VwgrUYJEEvu5U4zM9GASinbMQEBBm9xcF/9c+V4XNZgk
// SIG // Vkt070IQyK+/f8Z/8jd9Wj8c8pl5SpFSAK84Dxf1L3mB
// SIG // ZdmptWvkx872ynoAb0swRCQiPM/tA6WWj1kpvLb9BOFw
// SIG // nzJKJ/1Vry/+tuWOM7tiX5rbV0Dp8c6ZZpCM/2pif93F
// SIG // SguRJuI57BlKcWOdeyFtw5yjojz6f32WapB4pm3S4Zz5
// SIG // Hfw42JT0xqUKloakvZ4argRCg7i1gJsiOCC1JeVk7Pf0
// SIG // v35jWSUPei45V3aicaoGig+JFrphpxHLmtgOR5qAxdDN
// SIG // p9DvfYPw4TtxCd9ddJgiCGHasFAeb73x4QDf5zEHpJM6
// SIG // 92VHeOj4qEir995yfmFrb3epgcunCaw5u+zGy9iCtHLN
// SIG // HfS4hQEegPsbiSpUObJb2sgNVZl6h3M7COaYLeqN4DMu
// SIG // Ein1wC9UJyH3yKxO2ii4sanblrKnQqLJzxlBTeCG+Sqa
// SIG // oxFmMNO7dDJL32N79ZmKLxvHIa9Zta7cRDyXUHHXodLF
// SIG // VeNp3lfB0d4wwP3M5k37Db9dT+mdHhk4L7zPWAUu7w2g
// SIG // UDXa7wknHNWzfjUeCLraNtvTX4/edIhJEjCCBNkwggPB
// SIG // oAMCAQICEzMAAACpVHDZecCEZeIAAAAAAKkwDQYJKoZI
// SIG // hvcNAQELBQAwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
// SIG // A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIw
// SIG // MTAwHhcNMTYwOTA3MTc1NjUzWhcNMTgwOTA3MTc1NjUz
// SIG // WjCBsjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEMMAoGA1UECxMD
// SIG // QU9DMScwJQYDVQQLEx5uQ2lwaGVyIERTRSBFU046ODQz
// SIG // RC0zN0Y2LUYxMDQxJTAjBgNVBAMTHE1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEB
// SIG // AQUAA4IBDwAwggEKAoIBAQCslIUYpuVW053fA2cu25iR
// SIG // R4+ViXJNmnTzNEDeaxGn1MeSfg7/nzU6f6dkjHGbYcUZ
// SIG // WT6UXZEvTsDtwUBuJweR1OWs9h48zlARUydohNLSZqQf
// SIG // bh17KYsm4wmudOdM/J+Dt0YN2xWpDftX97ObEN4MHKRN
// SIG // GsOWJEY2KZBc3h1H1pc/Qo0H/6gvJ47rEhCxR0L3BL05
// SIG // NsTFu8DstryOgZzJ3bJAPD2j6xu9MHX+WwVzHRQxEdTw
// SIG // Or/s0RPeRMnE/kjhV8QueAgVfvNFBjZJtrX9WB0R3Yhk
// SIG // A0IQOe+uUxZGEVtcfRJad0h2cClhIRqTU5wiaW6ctHl6
// SIG // jkw4hBUZbF+hAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU
// SIG // D9VB+7vznfS+SVLajDdXzmQP830wHwYDVR0jBBgwFoAU
// SIG // 1WM6XIoxkPNDe3xGG8UzaFqFbVUwVgYDVR0fBE8wTTBL
// SIG // oEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29tL3Br
// SIG // aS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEF
// SIG // BQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
// SIG // aS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5j
// SIG // cnQwDAYDVR0TAQH/BAIwADATBgNVHSUEDDAKBggrBgEF
// SIG // BQcDCDANBgkqhkiG9w0BAQsFAAOCAQEACJkYpQeLL3Ik
// SIG // dSyOIIQC/Qqhrw7hsDIRhqrFhiCdu+hEO5XMtTrni0al
// SIG // E9OMIBuoOlccFfdzbY0LsgdFboZFdiRGunRM8TZvUp22
// SIG // 5OSUjMkpq4mqvnKC07qbVauggjngGS7YEa1FiQNLwC/i
// SIG // AJ64e4fbytd1uC4EtIyTN4oeJkTk2UFljtFCuV4TELwZ
// SIG // Z3W7zoSp6R+Oe88blLg5XW1XWewKfsbWlQ075/qIL1as
// SIG // VQRQcmc/sgADw47C/D7Ilavg1Ge2pjRttGAIskKJ3n9g
// SIG // 2lghvNOMODJT8grM298ktwDrk0o/CXo0O0vAc2tqUoRT
// SIG // oZsERFlhQq1y8EDAbvyasqGCA3cwggJfAgEBMIHioYG4
// SIG // pIG1MIGyMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMQwwCgYDVQQL
// SIG // EwNBT0MxJzAlBgNVBAsTHm5DaXBoZXIgRFNFIEVTTjo4
// SIG // NDNELTM3RjYtRjEwNDElMCMGA1UEAxMcTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgU2VydmljZaIlCgEBMAkGBSsOAwIa
// SIG // BQADFQBdOr9WveEPKcpyDmT3dTt4GiLr9KCBwTCBvqSB
// SIG // uzCBuDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEMMAoGA1UECxMD
// SIG // QU9DMScwJQYDVQQLEx5uQ2lwaGVyIE5UUyBFU046MjY2
// SIG // NS00QzNGLUM1REUxKzApBgNVBAMTIk1pY3Jvc29mdCBU
// SIG // aW1lIFNvdXJjZSBNYXN0ZXIgQ2xvY2swDQYJKoZIhvcN
// SIG // AQEFBQACBQDeGg8sMCIYDzIwMTgwMTI5MjEyMjUyWhgP
// SIG // MjAxODAxMzAyMTIyNTJaMHcwPQYKKwYBBAGEWQoEATEv
// SIG // MC0wCgIFAN4aDywCAQAwCgIBAAICEf0CAf8wBwIBAAIC
// SIG // GOUwCgIFAN4bYKwCAQAwNgYKKwYBBAGEWQoEAjEoMCYw
// SIG // DAYKKwYBBAGEWQoDAaAKMAgCAQACAx6AmKEKMAgCAQAC
// SIG // Ax6EgDANBgkqhkiG9w0BAQUFAAOCAQEAdTmFRzX/AD3Z
// SIG // ACjlbi+mh7WQeYKHDco98nwTdhzlJMdBYzw1Q+T0Xw1H
// SIG // s2L94Lb7+n6Ft1lyIUwNnCoQ6BdRe5OxkiLk2E+dYNsx
// SIG // SFjB3T376BUmtwwZMmcq9RC+hFY2WSd4EHSQQuSTYz4f
// SIG // AQ3MYlCd5DAo2nHTc3nZ+JQxcQiMUJpebVO8Fw6Vbnk2
// SIG // /xaqIENh5C22YReBM9iq5nB7m5+E3AvZdPTAnQ7vyoIM
// SIG // 6Oj9XTPHhHquwlN/jmgUoC/Na0OR6e3RI84WOktNkXpx
// SIG // Fk+fjbqtL9dUKen5JpBT/G/rwqN4n05Cp9vuNtx8qP/x
// SIG // 3yJkUDY9F/VAaqb8JvjpxDGCAvUwggLxAgEBMIGTMHwx
// SIG // CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9u
// SIG // MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
// SIG // c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAAAqVRw
// SIG // 2XnAhGXiAAAAAACpMA0GCWCGSAFlAwQCAQUAoIIBMjAa
// SIG // BgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQwLwYJKoZI
// SIG // hvcNAQkEMSIEIFyQYwWZBApB1yqUYvhBS1eAMFwZjlIS
// SIG // xgoSr7kSwsbXMIHiBgsqhkiG9w0BCRACDDGB0jCBzzCB
// SIG // zDCBsQQUXTq/Vr3hDynKcg5k93U7eBoi6/QwgZgwgYCk
// SIG // fjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1N
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAA
// SIG // AKlUcNl5wIRl4gAAAAAAqTAWBBRAm3/YDg5sy/+xNgEe
// SIG // dyB8fm8mVzANBgkqhkiG9w0BAQsFAASCAQARmY5wZV6j
// SIG // y4lw8PQ6CIajYSdCdWC9CkLPFn04N6RF7sktXfywfgQY
// SIG // MbxqYQfIZ1uo9yKo2mehZ3BJS9xsd1gF+1vcH/XQhB9m
// SIG // /ndsdxsjhlxUEuGWVMpQA9jHXrWXdTRPTRgFR0TgIFNC
// SIG // gga3oCBUSV2L214xPtZu78ucx0bfJzwkjnPUPZicZfiZ
// SIG // rGwmZDf1bFgG+lwKh7Fgml7sm8Gp3n+XLDbJ9ePgKFlY
// SIG // O1nETHZKgxWIFh4dcZPlFS/STKvQBhsk6F8DvoIT5wUD
// SIG // rnEA9vDkIuHCepbpr/hILHoiLVRNWvDA6FmG2ASn0ufw
// SIG // eQMs7Z7HcAarXdIjaK25QyBI
// SIG // End signature block
