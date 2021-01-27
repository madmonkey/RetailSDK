var Commerce;
(function (Commerce) {
    "use strict";
    function AccessControlData(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.AccessControlData, key, index);
        return;
    }
    Commerce.AccessControlData = AccessControlData;
    function CustomerContent(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.CustomerContent, key, index);
        return;
    }
    Commerce.CustomerContent = CustomerContent;
    function EndUserIdentifiableInformation(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.EndUserIdentifiableInformation, key, index);
        return;
    }
    Commerce.EndUserIdentifiableInformation = EndUserIdentifiableInformation;
    function ObjectMetadata(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.ObjectMetadata, key, index);
        return;
    }
    Commerce.ObjectMetadata = ObjectMetadata;
    function SupportData(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.SupportData, key, index);
        return;
    }
    Commerce.SupportData = SupportData;
    function AccountData(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.AccountData, key, index);
        return;
    }
    Commerce.AccountData = AccountData;
    function PublicPersonalData(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.PublicPersonalData, key, index);
        return;
    }
    Commerce.PublicPersonalData = PublicPersonalData;
    function EndUserPseudonymousIdentifier(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.EndUserPseudonymousIdentifier, key, index);
        return;
    }
    Commerce.EndUserPseudonymousIdentifier = EndUserPseudonymousIdentifier;
    function OrganizationIdentifiableInformation(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.OrganizationIdentifiableInformation, key, index);
        return;
    }
    Commerce.OrganizationIdentifiableInformation = OrganizationIdentifiableInformation;
    function SystemMetadata(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.SystemMetadata, key, index);
        return;
    }
    Commerce.SystemMetadata = SystemMetadata;
    function PublicNonPersonalData(target, key, index) {
        Microsoft.Dynamics.Diagnostics.TypeScriptCore.UpdatePrivacyDataClassificationMap(Microsoft.Dynamics.Diagnostics.TypeScriptCore.PrivacyDataType.PublicNonPersonalData, key, index);
        return;
    }
    Commerce.PublicNonPersonalData = PublicNonPersonalData;
})(Commerce || (Commerce = {}));
var Microsoft;
(function (Microsoft) {
    var Dynamics;
    (function (Dynamics) {
        var Diagnostics;
        (function (Diagnostics) {
            var TypeScriptCore;
            (function (TypeScriptCore) {
                var PrivacyDataClassification = (function () {
                    function PrivacyDataClassification() {
                    }
                    PrivacyDataClassification.eventNameParameterNumberToPrivacyTypeMap = {};
                    return PrivacyDataClassification;
                }());
                TypeScriptCore.PrivacyDataClassification = PrivacyDataClassification;
                function GetPrivacyDataClassification(eventName, parameterIndex) {
                    var dataClassificationKey = eventName.toLowerCase() + "/" + parameterIndex;
                    if (PrivacyDataClassification.eventNameParameterNumberToPrivacyTypeMap[dataClassificationKey] == null) {
                        throw ("Key = " + dataClassificationKey + " does not exist in the privacy data classification map.");
                    }
                    var parameterPrivacyDataType = PrivacyDataClassification.eventNameParameterNumberToPrivacyTypeMap[dataClassificationKey];
                    return parameterPrivacyDataType;
                }
                TypeScriptCore.GetPrivacyDataClassification = GetPrivacyDataClassification;
                function UpdatePrivacyDataClassificationMap(classification, key, index) {
                    PrivacyDataClassification.eventNameParameterNumberToPrivacyTypeMap[key.toLowerCase() + "/" + index] = classification;
                }
                TypeScriptCore.UpdatePrivacyDataClassificationMap = UpdatePrivacyDataClassificationMap;
                var PrivacyDataType;
                (function (PrivacyDataType) {
                    PrivacyDataType[PrivacyDataType["None"] = 0] = "None";
                    PrivacyDataType[PrivacyDataType["AccessControlData"] = 1] = "AccessControlData";
                    PrivacyDataType[PrivacyDataType["CustomerContent"] = 2] = "CustomerContent";
                    PrivacyDataType[PrivacyDataType["EndUserIdentifiableInformation"] = 3] = "EndUserIdentifiableInformation";
                    PrivacyDataType[PrivacyDataType["ObjectMetadata"] = 4] = "ObjectMetadata";
                    PrivacyDataType[PrivacyDataType["SupportData"] = 5] = "SupportData";
                    PrivacyDataType[PrivacyDataType["AccountData"] = 6] = "AccountData";
                    PrivacyDataType[PrivacyDataType["PublicPersonalData"] = 7] = "PublicPersonalData";
                    PrivacyDataType[PrivacyDataType["EndUserPseudonymousIdentifier"] = 8] = "EndUserPseudonymousIdentifier";
                    PrivacyDataType[PrivacyDataType["OrganizationIdentifiableInformation"] = 9] = "OrganizationIdentifiableInformation";
                    PrivacyDataType[PrivacyDataType["SystemMetadata"] = 10] = "SystemMetadata";
                    PrivacyDataType[PrivacyDataType["PublicNonPersonalData"] = 11] = "PublicNonPersonalData";
                })(PrivacyDataType = TypeScriptCore.PrivacyDataType || (TypeScriptCore.PrivacyDataType = {}));
                var PayloadAnnotator = (function () {
                    function PayloadAnnotator(func) {
                        this.payload = {};
                        var names = Utils.getParameterNames(func);
                        var values = func.arguments;
                        for (var i = 0; i < names.length; i++) {
                            var name_1 = names[i];
                            var value = values[i];
                            if (value === null || typeof value === "undefined") {
                                this.payload[name_1] = "undefined";
                            }
                            else {
                                if (PayloadAnnotator.isAllowedType(value)) {
                                    this.payload[name_1] = value;
                                }
                                else {
                                    throw ("Type validation failed for parameter " + name_1);
                                }
                            }
                        }
                    }
                    PayloadAnnotator.isAllowedType = function (variable) {
                        for (var i = 0; i < PayloadAnnotator.allowedTypes.length; i++) {
                            if (typeof variable === PayloadAnnotator.allowedTypes[i]) {
                                return true;
                            }
                        }
                        return false;
                    };
                    PayloadAnnotator.prototype.annotate = function (event) {
                        event.Payload = this.payload;
                    };
                    PayloadAnnotator.allowedTypes = ["string", "number", "boolean"];
                    return PayloadAnnotator;
                }());
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
                TypeScriptCore.DEFAULTEVENTLEVEL = EventLevel.Informational;
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
                var AppWindowId;
                (function (AppWindowId) {
                    AppWindowId[AppWindowId["Undefined"] = 0] = "Undefined";
                    AppWindowId[AppWindowId["POS"] = 1] = "POS";
                    AppWindowId[AppWindowId["DualDisplay"] = 2] = "DualDisplay";
                })(AppWindowId = TypeScriptCore.AppWindowId || (TypeScriptCore.AppWindowId = {}));
                var Event = (function () {
                    function Event(type) {
                        this.Type = type;
                        this.CoreFields = new EventCoreFields();
                        if (this.Type === EventType.Custom) {
                            this.StaticMetadata = new EventStaticMetadata();
                        }
                        else if (this.Type === EventType.PageView) {
                            this.StaticMetadata = new EventStaticMetadata();
                            this.PageViewMetadata = new PageViewMetadata();
                        }
                    }
                    return Event;
                }());
                TypeScriptCore.Event = Event;
                var LoggingSink = (function () {
                    function LoggingSink(configuration) {
                        this._eventFilterConfiguration = configuration || {};
                        this._excludedPrivacyDataTypes = (this._eventFilterConfiguration.ExcludedPrivacyDataTypes || []).map(function (t) { return PrivacyDataType[t]; });
                    }
                    LoggingSink.prototype.getMinEventLevel = function () {
                        var eventLevel = this._eventFilterConfiguration.EventLevel != null && EventLevel[this._eventFilterConfiguration.EventLevel] != null ?
                            EventLevel[this._eventFilterConfiguration.EventLevel] : TypeScriptCore.DEFAULTEVENTLEVEL;
                        return eventLevel;
                    };
                    LoggingSink.prototype.sanitizeEvent = function (event) {
                        var _this = this;
                        if (this._excludedPrivacyDataTypes != null && this._excludedPrivacyDataTypes.length !== 0) {
                            var keys = Object.keys(event.Payload);
                            keys.forEach(function (key, index) {
                                if (_this._excludedPrivacyDataTypes.indexOf(GetPrivacyDataClassification(event.StaticMetadata.Name, index)) !== -1) {
                                    event.Payload[key] = "(SCRUBBED)";
                                }
                            });
                        }
                        return event;
                    };
                    return LoggingSink;
                }());
                TypeScriptCore.LoggingSink = LoggingSink;
                var Utils = (function () {
                    function Utils() {
                    }
                    Utils.getParameterNames = function (func) {
                        var stripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                        var argNames = /([^\s,]+)/g;
                        var funcStr = func.toString().replace(stripComments, "");
                        var result = funcStr.slice(funcStr.indexOf("(") + 1, funcStr.indexOf(")")).match(argNames);
                        if (result === null) {
                            result = [];
                        }
                        return result;
                    };
                    Utils.generateGuid = function () {
                        function guidPart() {
                            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                        }
                        return guidPart() + guidPart() + "-" + guidPart() + "-" + guidPart() + "-" + guidPart() + "-" + guidPart() + guidPart() + guidPart();
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
                    LoggerBase.setDeviceInfo = function (deviceId, deviceRecordId, terminalRecordId) {
                        LoggerBase.deviceId = deviceId;
                        LoggerBase.deviceRecordId = deviceRecordId;
                        LoggerBase.terminalRecordId = terminalRecordId;
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
                    LoggerBase.getSessionInfo = function () {
                        var sessionInfo = new EventCoreFields();
                        sessionInfo.ClientTimestamp = Date.now();
                        sessionInfo.AppSessionId = LoggerBase.getAppSessionId();
                        sessionInfo.UserSessionId = LoggerBase.getUserSessionId();
                        sessionInfo.DeviceId = LoggerBase.deviceId;
                        sessionInfo.UserId = LoggerBase.userId;
                        sessionInfo.TenantId = LoggerBase.tenantId;
                        sessionInfo.OfflineAvailability = LoggerBase.offlineAvailability;
                        sessionInfo.OfflineCurrentMode = LoggerBase.offlineCurrentMode;
                        sessionInfo.ScreenResolution = LoggerBase.getScreenResolution();
                        sessionInfo.DeviceRecordId = LoggerBase.deviceRecordId;
                        sessionInfo.TerminalRecordId = LoggerBase.terminalRecordId;
                        return sessionInfo;
                    };
                    LoggerBase.setInstrumentationKey = function (instrumentationKey) {
                        for (var i = 0; i < LoggerBase.loggingSinks.length; i++) {
                            LoggerBase.loggingSinks[i].setInstrumentationKey(instrumentationKey);
                        }
                    };
                    LoggerBase.writeEvent = function (name, eventId, version, channel, level, keywords, task, opCode, message, eventType) {
                        if (eventType === void 0) { eventType = EventType.Custom; }
                        var event = new Event(eventType);
                        event.CoreFields.AppWindowId = AppWindowId.POS;
                        event.CoreFields.ClientTimestamp = Date.now();
                        LoggerBase._annotateCoreFields(event);
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
                        if (event.Type === EventType.PageView) {
                            event.PageViewMetadata.PageName = event.Payload["pageName"];
                        }
                        this.dispatchEvent(event);
                    };
                    LoggerBase.writeDualDisplayEvent = function (dualDisplayEvent) {
                        dualDisplayEvent.CoreFields.AppWindowId = AppWindowId.DualDisplay;
                        LoggerBase._annotateCoreFields(dualDisplayEvent);
                        this.dispatchEvent(dualDisplayEvent);
                    };
                    LoggerBase._annotateCoreFields = function (event) {
                        event.CoreFields.AppSessionId = LoggerBase.appSessionId;
                        event.CoreFields.UserSessionId = LoggerBase.userSessionId;
                        event.CoreFields.DeviceId = LoggerBase.deviceId;
                        event.CoreFields.UserId = LoggerBase.userId;
                        event.CoreFields.TenantId = LoggerBase.tenantId;
                        event.CoreFields.OfflineAvailability = LoggerBase.offlineAvailability;
                        event.CoreFields.OfflineCurrentMode = LoggerBase.offlineCurrentMode;
                        event.CoreFields.ScreenResolution = LoggerBase.getScreenResolution();
                        event.CoreFields.DeviceRecordId = LoggerBase.deviceRecordId;
                        event.CoreFields.TerminalRecordId = LoggerBase.terminalRecordId;
                    };
                    LoggerBase.refreshSessionInfo = function () {
                        for (var i = 0; i < LoggerBase.loggingSinks.length; i++) {
                            LoggerBase.loggingSinks[i].setSessionInfo(LoggerBase.appSessionId, LoggerBase.userSessionId, LoggerBase.deviceId, LoggerBase.userId, LoggerBase.tenantId, LoggerBase.offlineAvailability, LoggerBase.offlineCurrentMode, LoggerBase.getScreenResolution(), LoggerBase.deviceRecordId, LoggerBase.terminalRecordId);
                        }
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
                        catch (error) {
                            try {
                                if (typeof LoggerBase.emergencySink !== "undefined") {
                                    LoggerBase.emergencySink.handleError(error);
                                }
                            }
                            catch (error) {
                            }
                        }
                    };
                    LoggerBase.appSessionId = Utils.emptyGuid();
                    LoggerBase.userSessionId = Utils.emptyGuid();
                    LoggerBase.deviceId = "";
                    LoggerBase.deviceRecordId = 0;
                    LoggerBase.terminalRecordId = 0;
                    LoggerBase.userId = "";
                    LoggerBase.tenantId = "";
                    LoggerBase.annotators = [];
                    LoggerBase.loggingSinks = [];
                    return LoggerBase;
                }());
                TypeScriptCore.LoggerBase = LoggerBase;
            })(TypeScriptCore = Diagnostics.TypeScriptCore || (Diagnostics.TypeScriptCore = {}));
        })(Diagnostics = Dynamics.Diagnostics || (Dynamics.Diagnostics = {}));
    })(Dynamics = Microsoft.Dynamics || (Microsoft.Dynamics = {}));
})(Microsoft || (Microsoft = {}));
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
var Microsoft;
(function (Microsoft) {
    var Dynamics;
    (function (Dynamics) {
        var Diagnostics;
        (function (Diagnostics) {
            var TypeScriptCore;
            (function (TypeScriptCore) {
                "use strict";
                var AppInsightsSink = (function (_super) {
                    __extends(AppInsightsSink, _super);
                    function AppInsightsSink(appInsightsInstrumentationKey, applicationName, configuration) {
                        var _this = _super.call(this, configuration) || this;
                        _this.appSessionId = TypeScriptCore.Utils.emptyGuid();
                        _this.userSessionId = TypeScriptCore.Utils.emptyGuid();
                        _this.tenantId = TypeScriptCore.Utils.emptyGuid();
                        _this.application = applicationName;
                        _this.applicationVersion = AppInsightsSink.appBaseVersion;
                        var defaultAppInsightsConfig = Microsoft.ApplicationInsights.Initialization.getDefaultConfig();
                        defaultAppInsightsConfig.instrumentationKey = appInsightsInstrumentationKey;
                        _this.appInsightsProxy = new Microsoft.ApplicationInsights.AppInsights(defaultAppInsightsConfig);
                        _this.appInsightsProxy.context.application.ver = _this.applicationVersion;
                        return _this;
                    }
                    AppInsightsSink.prototype.setSessionInfo = function (appSessionId, userSessionId, deviceId, userId, tenantId, offlineAvailability, offlineCurrentMode, screenResolution, deviceRecordId, terminalRecordId) {
                        this.appSessionId = appSessionId;
                        this.userSessionId = userSessionId;
                        this.deviceId = deviceId;
                        this.userId = userId;
                        this.tenantId = tenantId;
                        this.offlineAvailability = offlineAvailability;
                        this.offlineCurrentMode = offlineCurrentMode;
                        this.deviceRecordId = deviceRecordId;
                        this.terminalRecordId = terminalRecordId;
                        this.appInsightsProxy.context.user.id = userId;
                    };
                    AppInsightsSink.prototype.setInstrumentationKey = function (instrumentationKey) {
                        this.appInsightsProxy.config.instrumentationKey = instrumentationKey;
                    };
                    AppInsightsSink.prototype.writeEvent = function (event) {
                        var eventLevel = this.getMinEventLevel();
                        var payload;
                        if (event.Payload) {
                            event = this.sanitizeEvent(event);
                            payload = event.Payload;
                        }
                        else {
                            payload = {};
                        }
                        this.overrideObjectField(payload, "Application", this.application);
                        this.overrideObjectField(payload, "AppSessionId", this.appSessionId);
                        this.overrideObjectField(payload, "DeviceId", this.deviceId);
                        this.overrideObjectField(payload, "DeviceRecordId", this.deviceRecordId);
                        this.overrideObjectField(payload, "TerminalRecordId", this.terminalRecordId);
                        this.overrideObjectField(payload, "UserId", this.userId);
                        this.overrideObjectField(payload, "UserSessionId", this.userSessionId);
                        this.overrideObjectField(payload, "TenantId", this.tenantId);
                        this.overrideObjectField(payload, "OfflineAvailability", this.offlineAvailability);
                        this.overrideObjectField(payload, "OfflineCurrentMode", this.offlineCurrentMode);
                        this.overrideObjectField(payload, "AppWindowId", event.CoreFields.AppWindowId);
                        if (event.Type === TypeScriptCore.EventType.PageView) {
                            this.appInsightsProxy.trackPageView(event.PageViewMetadata.PageName, "", payload, null);
                        }
                        if (event.Type === TypeScriptCore.EventType.Custom && event.StaticMetadata.Level <= eventLevel) {
                            this.overrideObjectField(payload, "EventId", event.StaticMetadata.Id);
                            this.overrideObjectField(payload, "EventVersion", event.StaticMetadata.Version);
                            this.overrideObjectField(payload, "EventSeverity", event.StaticMetadata.LevelName);
                            this.appInsightsProxy.trackEvent(event.StaticMetadata.Name, payload, null);
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
                    AppInsightsSink.appBaseVersion = "9.23.20226.12";
                    return AppInsightsSink;
                }(TypeScriptCore.LoggingSink));
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
                var DebuggingConsoleSink = (function (_super) {
                    __extends(DebuggingConsoleSink, _super);
                    function DebuggingConsoleSink(configuration) {
                        return _super.call(this, configuration) || this;
                    }
                    DebuggingConsoleSink.prototype.setSessionInfo = function (appSessionId, userSessionId, deviceId, userId, tenantId, offlineAvailability, offlineCurrentMode, screenResolution, deviceRecordId, terminalRecordId) {
                    };
                    DebuggingConsoleSink.prototype.setInstrumentationKey = function (instrumentationKey) {
                    };
                    DebuggingConsoleSink.prototype.writeEvent = function (event) {
                        var eventLevel = this.getMinEventLevel();
                        if (event.StaticMetadata.Level <= eventLevel) {
                            event = this.sanitizeEvent(event);
                            var message = this._formatEventMessageWithPayload(event);
                            switch (event.StaticMetadata.Level) {
                                case TypeScriptCore.EventLevel.Critical:
                                case TypeScriptCore.EventLevel.Error:
                                    console.error(message);
                                    break;
                                case TypeScriptCore.EventLevel.Warning:
                                    console.warn(message);
                                    break;
                                case TypeScriptCore.EventLevel.LogAlways:
                                case TypeScriptCore.EventLevel.Informational:
                                case TypeScriptCore.EventLevel.Verbose:
                                    console.info(message);
                                    break;
                            }
                        }
                    };
                    DebuggingConsoleSink.prototype._formatEventMessageWithPayload = function (event) {
                        var message = event.StaticMetadata.Message.toString();
                        var args = [];
                        Object.keys(event.Payload).forEach(function (name) { args.push(event.Payload[name]); });
                        args.forEach(function (arg, index) {
                            var param = arg.toString().replace(/\$/gi, "$$$$");
                            var regexp = new RegExp("\\{" + index + "\\}", "gi");
                            message = message.replace(regexp, param);
                        });
                        return message;
                    };
                    return DebuggingConsoleSink;
                }(TypeScriptCore.LoggingSink));
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
                var EmergencyConsoleSink = (function () {
                    function EmergencyConsoleSink() {
                    }
                    EmergencyConsoleSink.prototype.handleError = function (error) {
                        console.error(error);
                    };
                    return EmergencyConsoleSink;
                }());
                TypeScriptCore.EmergencyConsoleSink = EmergencyConsoleSink;
            })(TypeScriptCore = Diagnostics.TypeScriptCore || (Diagnostics.TypeScriptCore = {}));
        })(Diagnostics = Dynamics.Diagnostics || (Dynamics.Diagnostics = {}));
    })(Dynamics = Microsoft.Dynamics || (Microsoft.Dynamics = {}));
})(Microsoft || (Microsoft = {}));

// SIG // Begin signature block
// SIG // MIIkDgYJKoZIhvcNAQcCoIIj/zCCI/sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // k3mapRVHPHhnOI9DRrEYNw3k3vTYMGP0e+I1Pu9XAkKg
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgb1g6WM5Zzy5p
// SIG // JZoCU07dhtICtK7YUtWwedWCoHOcf+0wgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // LczyWWFgHOy1qEweKyzT44toIuWt9FsL9m6P3SSneKqc
// SIG // oPqFqq4wPaB51Nao830JSJ+Ao3U7UepWo2zeTNFwTTKw
// SIG // /2wKxjqS4Z72RT9o0w8kMDTn6BvN+sKrySX/WZ8Hl97u
// SIG // aC+NWE5eXsUssmwK9HNTNua9wJ+riXFixldHt72GDuJZ
// SIG // ub4X98a9Y25IQKplgCsqmaxO3P7qrIH6BHnW859lk2Fs
// SIG // fxU14XkPNLbC6Sxck+CkHy4ZPUxJA4BNdhgiyygjiMkP
// SIG // itWqWCYD7WbLwYXhMB+qI3PM8J4I4P5YOPdyCblS2thS
// SIG // CpGGS8BnxSTCIEjQFEDkn1Q0w4N3qj6omKGCEvEwghLt
// SIG // BgorBgEEAYI3AwMBMYIS3TCCEtkGCSqGSIb3DQEHAqCC
// SIG // EsowghLGAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFVBgsq
// SIG // hkiG9w0BCRABBKCCAUQEggFAMIIBPAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCA4vTQkVhjmy9Dx
// SIG // o/5OJhtkMSPGtwc+eY35lJjmOgeXXgIGXzvk283nGBMy
// SIG // MDIwMDgyMzA0MDI1MC4zNzZaMASAAgH0oIHUpIHRMIHO
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEmMCQG
// SIG // A1UECxMdVGhhbGVzIFRTUyBFU046RjdBNi1FMjUxLTE1
// SIG // MEExJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFNlcnZpY2Wggg5EMIIE9TCCA92gAwIBAgITMwAAASWL
// SIG // 3otsciYx3QAAAAABJTANBgkqhkiG9w0BAQsFADB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTEyMTkw
// SIG // MTE0NThaFw0yMTAzMTcwMTE0NThaMIHOMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3NvZnQgT3Bl
// SIG // cmF0aW9ucyBQdWVydG8gUmljbzEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046RjdBNi1FMjUxLTE1MEExJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Uw
// SIG // ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDQ
// SIG // ex9jdmBb7OHJwSYmMUorZNwAcv8Vy36TlJuzcVx7G+lF
// SIG // qt2zjWOMlSOMkm1XoAuJ8VZ5ShBedADXDGDKxHNZhLu3
// SIG // EW8x5ot/IOk6izLTlAFtvIXOgzXs/HaOM72XHKykMZHA
// SIG // dL/fpZtASM5PalmsXX4Ol8lXkm9jR55K56C7q9+hDU+2
// SIG // tjGHaE1ZWlablNUXBhaZgtCJCd60UyZvgI7/uNzcafj0
// SIG // /Vw2bait9nDAVd24yt/XCZnHY3yX7ZsHjIuHpsl+PpDX
// SIG // ai1Dwe9p0ryCZsl9SOMHextIHe9qlTbtWYJ8WtWLoH9d
// SIG // EMQxVLnmPPDOVmBj7LZhSji38N9Vpz/FAgMBAAGjggEb
// SIG // MIIBFzAdBgNVHQ4EFgQU86rK5Qcm+QE5NBXGCPIiCBdD
// SIG // JPgwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8UzaFqF
// SIG // bVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWlj
// SIG // VGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoGCCsGAQUF
// SIG // BwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQ
// SIG // Q0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0TAQH/BAIwADAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsF
// SIG // AAOCAQEAkxxZPGEgIgAhsqZNTZk58V1vQiJ5ja2xHl5T
// SIG // qGA6Hwj5SioLg3FSLiTmGV+BtFlpYUtkneB4jrZsuNpM
// SIG // tfbTMdG7p/xAyIVtwvXnTXqKlCD1T9Lcr94pVedzHGJz
// SIG // L1TYNQyZJBouCfzkgkzccOuFOfeWPfnMTiI5UBW5Odmo
// SIG // yHPQWDSGHoboW1dTKqXeJtuVDTYbHTKs4zjfCBMFjmyl
// SIG // Ru52Zpiz+9MBeRj4iAeou0F/3xvIzepoIKgUWCZ9mmVi
// SIG // WEkVwCtTGbV8eK73KeEE0tfMU/YY2UmoGPc8YwburDEf
// SIG // elegLW+YHkfrcGAGlftCmqtOdOLeghLoG0Ubx/B7sTCC
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
// SIG // bGVzIFRTUyBFU046RjdBNi1FMjUxLTE1MEExJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wi
// SIG // IwoBATAHBgUrDgMCGgMVAEXTL+FQbc2G+3MXXvIRKVr2
// SIG // oXCnoIGDMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTAwDQYJKoZIhvcNAQEFBQACBQDi7FH6MCIYDzIw
// SIG // MjAwODIzMDYyNDU4WhgPMjAyMDA4MjQwNjI0NThaMHcw
// SIG // PQYKKwYBBAGEWQoEATEvMC0wCgIFAOLsUfoCAQAwCgIB
// SIG // AAICHPkCAf8wBwIBAAICEZowCgIFAOLto3oCAQAwNgYK
// SIG // KwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAqAKMAgC
// SIG // AQACAwehIKEKMAgCAQACAwGGoDANBgkqhkiG9w0BAQUF
// SIG // AAOBgQCU8FVIW29vUzOBCeDgXvm86i70+HyZlIP1nEW6
// SIG // ifuXuAk1tNgYp/gccaT4xtlkdvYBLru91J8o4o2yDbAG
// SIG // XjfzL/c7mfHUMhZEtcYgDEMcML7EirACrlTiqcY6Ogiv
// SIG // uNCCd9NpaU+un8wtkAo28hM8pcaLyl45vC9dBptIZ6NL
// SIG // RzGCAw0wggMJAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABJYvei2xyJjHdAAAAAAElMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYL
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIGc8UJA/
// SIG // rrClOkMMok6U81FaO6Ou1tgNtd+tGDtkVoHPMIH6Bgsq
// SIG // hkiG9w0BCRACLzGB6jCB5zCB5DCBvQQgXd/Gsi5vMF/6
// SIG // iX2CDh+VfmL5RvqaFkFwluiyje9B9w4wgZgwgYCkfjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAASWL
// SIG // 3otsciYx3QAAAAABJTAiBCBcjAJ7/n1HI5lkgBqtqy8n
// SIG // K6V1W1gjGBCZC6wDmP1ZyzANBgkqhkiG9w0BAQsFAASC
// SIG // AQCzK8BERr9hyBCEILV83+RInN3a1G9xh5v0A/vCkuCG
// SIG // 0BOv6yIJAZOV7uCxb204Nbrw9NaSmG2ZScE9+ffI0gnG
// SIG // JuTf2REcY8akRFUnY/CfEBFD97mrvvL2x+8oW0Dq643u
// SIG // CTRrzWmOogyPVQHXjD/ZpcSjLp/oZPbRafbXnIh/+AcE
// SIG // K3AFEdgybDdVrwXb850fgOlWrpaMIDhCx8/Jhoe0E6Uf
// SIG // dWE6aVYasSC3OOBUYIJOCNOBJHneq5FP/L3l0jXFqOyu
// SIG // UT0GL2ySTfpRDlvvA1JDb8m12laTbF58sM6UDKnj5GF/
// SIG // 59DEq0qHhAgLeXZm6BrdaPmDL65YM0OAxScX
// SIG // End signature block
