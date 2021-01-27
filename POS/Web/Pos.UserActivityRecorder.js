"use strict";
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ErrorCodes;
        (function (ErrorCodes) {
            "use strict";
            ErrorCodes.TASK_RECORDER_SESSION_INVALID_STATE = "string_10200";
            ErrorCodes.TASK_RECORDER_SESSION_NO_ACTIVE_TASK = "string_10201";
            ErrorCodes.TASK_RECORDER_CONFIGURATION_ERROR = "string_10202";
            ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_BUSY = "string_10203";
            ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_NO_ACTIVE_SESSION = "string_10204";
            ErrorCodes.TASK_RECORDER_VIEWMANAGER_VIEW_NOT_FOUND = "string_10205";
            ErrorCodes.TASK_RECORDER_VIEWMANAGER_LOAD_FAILED = "string_10206";
            ErrorCodes.TASK_RECORDER_INVALID_DOM = "string_10207";
            ErrorCodes.TASK_RECORDER_CONTROLLER_NOT_SUPPORTED_STATE = "string_10208";
            ErrorCodes.TASK_RECORDER_STEP_VIEW_MODEL_NOT_FOUND = "string_10209";
            ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_COULDNT_TAKE_SCREENSHOT = "string_10210";
            ErrorCodes.TASK_RECORDER_COULDNT_UPLOAD_SCREENSHOT = "string_10211";
            ErrorCodes.TASK_RECORDER_TASK_VIEW_MODEL_NOT_FOUND = "string_10212";
            ErrorCodes.TASK_RECORDER_ODATA_TYPE_NOT_FOUND = "string_10213";
            ErrorCodes.TASK_RECORDER_ERROR_OCCURED_DURING_UPLOADING_FILE = "string_10214";
            ErrorCodes.TASK_RECORDER_ERROR_OCCURRED_DURING_DISPLAYING_SAVE_DIALOG = "string_10215";
            ErrorCodes.TASK_RECORDER_COULDNT_SAVE_FILE = "string_10216";
            ErrorCodes.TASK_RECORDER_COULDNT_COMPLETE_UPDATES_FOR_FILE = "string_10217";
            ErrorCodes.TASK_RECORDER_COULDNT_DOWNLOAD_FILE = "string_10218";
            ErrorCodes.TASK_RECORDER_UNEXPECTED_FILE_EXTENSION = "string_10219";
            ErrorCodes.TASK_RECORDER_XML_EXPORT_ERROR = "string_10220";
            ErrorCodes.TASK_RECORDER_WORD_EXPORT_ERROR = "string_10221";
            ErrorCodes.TASK_RECORDER_SAVE_FILE_ERROR = "string_10222";
            ErrorCodes.TASK_RECORDER_BPM_PACKAGE_EXPORT_ERROR = "string_10223";
            ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_COULDNT_DOWNLOAD_RECORDING = "string_10224";
            ErrorCodes.TASK_RECORDER_SAVE_SESSION_AS_RECORDING_BUNDLE_ERROR = "string_10225";
            ErrorCodes.TASK_RECORDER_VALIDATION_EVENT_LISTENER_NOT_SUPPORTED_ERROR = "string_10226";
            ErrorCodes.TASK_RECORDER_CONTINUE_WITH_VALIDATION_NOT_SUPPORTED_ERROR = "string_10227";
            ErrorCodes.TASK_RECORDER_CANNOT_START_RECORDER_WHEN_ANOTHER_RECORDER_TYPE_IS_RUNNING = "string_10228";
            ErrorCodes.NOT_IMPLEMENTED = "string_29003";
        })(ErrorCodes = UserActivityRecorder.ErrorCodes || (UserActivityRecorder.ErrorCodes = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var UserActivityRecorderFactory = (function () {
            function UserActivityRecorderFactory() {
            }
            UserActivityRecorderFactory.prototype.createTestRecorder = function (context) {
                return new Commerce.TestRecorder.TestRecorder(context);
            };
            UserActivityRecorderFactory.prototype.createTaskRecorder = function (context) {
                return new Commerce.TaskRecorder.TaskRecorder(context);
            };
            return UserActivityRecorderFactory;
        }());
        Commerce.UserActivityRecorder.UserActivityRecorderFactory = new UserActivityRecorderFactory();
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        function isITaskRecorderKeyStepInfo(val) {
            return val.keyCode !== undefined;
        }
        TaskRecorder.isITaskRecorderKeyStepInfo = isITaskRecorderKeyStepInfo;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        function isITaskRecorderNumpadMouseStepInfo(val) {
            return val.isValue !== undefined;
        }
        TaskRecorder.isITaskRecorderNumpadMouseStepInfo = isITaskRecorderNumpadMouseStepInfo;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        function isITaskRecorderVariableStepInfo(val) {
            return !Commerce.ObjectExtensions.isNullOrUndefined(val) &&
                !Commerce.ObjectExtensions.isNullOrUndefined(val.variableValue) &&
                !Commerce.ObjectExtensions.isNullOrUndefined(val.valuePartsIncrementalTime) &&
                !Commerce.ObjectExtensions.isNullOrUndefined(val.mergedEventType);
        }
        TaskRecorder.isITaskRecorderVariableStepInfo = isITaskRecorderVariableStepInfo;
        var MergedEventTypes;
        (function (MergedEventTypes) {
            MergedEventTypes["Click"] = "Click";
            MergedEventTypes["Input"] = "Input";
            MergedEventTypes["Keyboard"] = "Keyboard";
        })(MergedEventTypes = TaskRecorder.MergedEventTypes || (TaskRecorder.MergedEventTypes = {}));
        var VariableValueType;
        (function (VariableValueType) {
            VariableValueType["Unknown"] = "unknown";
            VariableValueType["String"] = "string";
            VariableValueType["Number"] = "number";
            VariableValueType["MultilineString"] = "multilinestring";
        })(VariableValueType = TaskRecorder.VariableValueType || (TaskRecorder.VariableValueType = {}));
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        function isITaskRecorderValidationStepInfo(val) {
            return !Commerce.ObjectExtensions.isNullOrUndefined(val) &&
                !Commerce.ObjectExtensions.isNullOrUndefined(val.variableValues);
        }
        TaskRecorder.isITaskRecorderValidationStepInfo = isITaskRecorderValidationStepInfo;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        var Model;
        (function (Model) {
            "use strict";
            var TaskGuideModel = (function () {
                function TaskGuideModel(model, publisher) {
                    this.id = model.Id;
                    this.title = model.Name;
                    this.publisher = publisher;
                }
                return TaskGuideModel;
            }());
            Model.TaskGuideModel = TaskGuideModel;
        })(Model = TaskRecorder.Model || (TaskRecorder.Model = {}));
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Proxy;
    (function (Proxy) {
        var Entities;
        (function (Entities) {
            "use strict";
            var TaskRecorderODataType = (function () {
                function TaskRecorderODataType() {
                }
                TaskRecorderODataType.recording = "#Microsoft.Dynamics.Commerce.Runtime.DataModel.Recording";
                TaskRecorderODataType.scope = "#Microsoft.Dynamics.Commerce.Runtime.DataModel.Scope";
                TaskRecorderODataType.annotation = "#Microsoft.Dynamics.Commerce.Runtime.DataModel.TaskGuideAnnotation";
                TaskRecorderODataType.taskUserAction = "#Microsoft.Dynamics.Commerce.Runtime.DataModel.TaskUserAction";
                TaskRecorderODataType.commandUserAction = "#Microsoft.Dynamics.Commerce.Runtime.DataModel.CommandUserAction";
                TaskRecorderODataType.infoUserAction = "#Microsoft.Dynamics.Commerce.Runtime.DataModel.InfoUserAction";
                TaskRecorderODataType.menuItemUserAction = "#Microsoft.Dynamics.Commerce.Runtime.DataModel.MenuItemUserAction";
                TaskRecorderODataType.propertyUserAction = "#Microsoft.Dynamics.Commerce.Runtime.DataModel.PropertyUserAction";
                TaskRecorderODataType.validationUserAction = "#Microsoft.Dynamics.Commerce.Runtime.DataModel.ValidationUserAction";
                return TaskRecorderODataType;
            }());
            Entities.TaskRecorderODataType = TaskRecorderODataType;
        })(Entities = Proxy.Entities || (Proxy.Entities = {}));
    })(Proxy = Commerce.Proxy || (Commerce.Proxy = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var ScopeType;
        (function (ScopeType) {
            ScopeType[ScopeType["Public"] = 0] = "Public";
            ScopeType[ScopeType["Private"] = 1] = "Private";
            ScopeType[ScopeType["PrivateInline"] = 2] = "PrivateInline";
            ScopeType[ScopeType["Task"] = 3] = "Task";
        })(ScopeType = UserActivityRecorder.ScopeType || (UserActivityRecorder.ScopeType = {}));
        var TaskRecorderTaskType;
        (function (TaskRecorderTaskType) {
            TaskRecorderTaskType[TaskRecorderTaskType["Begin"] = 1] = "Begin";
            TaskRecorderTaskType[TaskRecorderTaskType["End"] = 16] = "End";
        })(TaskRecorderTaskType = UserActivityRecorder.TaskRecorderTaskType || (UserActivityRecorder.TaskRecorderTaskType = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var UserActivityRecorderBaseStep = (function () {
            function UserActivityRecorderBaseStep(id, name, description, stepInfo, controlName, controlType, formId) {
                this.Annotations = [];
                this.Arguments = [];
                this.CommandName = name;
                this.ControlName = controlName;
                this.ControlType = controlType;
                this.Description = description;
                this.FormId = formId;
                this.Id = id;
                this.ReturnTypeValue = 0;
                this.ScreenshotUri = Commerce.StringExtensions.EMPTY;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(stepInfo) && !jQuery.isEmptyObject(stepInfo)) {
                    this.Arguments.push({
                        IsReference: false,
                        Value: JSON.stringify(stepInfo)
                    });
                }
                this[UserActivityRecorderBaseStep.oDataPropertyName] = Commerce.Proxy.Entities.TaskRecorderODataType.commandUserAction;
            }
            Object.defineProperty(UserActivityRecorderBaseStep.prototype, "isEditable", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserActivityRecorderBaseStep.prototype, "isDeletable", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserActivityRecorderBaseStep.prototype, "isNumberable", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            UserActivityRecorderBaseStep.oDataPropertyName = "@odata.type";
            return UserActivityRecorderBaseStep;
        }());
        UserActivityRecorder.UserActivityRecorderBaseStep = UserActivityRecorderBaseStep;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
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
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var StartRecordingStep = (function (_super) {
            __extends(StartRecordingStep, _super);
            function StartRecordingStep(context, version, id, layoutId, layoutResolutionHeight, layoutResolutionWidth) {
                var _this = this;
                var name = "Start Recording";
                var description = context.stringResourceManager.getString("string_10500");
                var controlName = Commerce.StringExtensions.EMPTY;
                var controlType = Commerce.StringExtensions.EMPTY;
                var stepInfo = {
                    value: {
                        application: "POS",
                        applicationType: context.applicationType,
                        applicationVersion: context.applicationVersion,
                        browserType: context.browserType,
                        store: Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.STORE_ID_KEY) || Commerce.StringExtensions.EMPTY,
                        registerId: Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.REGISTER_ID_KEY) || Commerce.StringExtensions.EMPTY,
                        deviceId: Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.DEVICE_ID_KEY) || Commerce.StringExtensions.EMPTY,
                        layoutId: layoutId || Commerce.StringExtensions.EMPTY,
                        height: window.outerHeight,
                        width: window.outerWidth,
                        layoutResolutionHeight: layoutResolutionHeight,
                        layoutResolutionWidth: layoutResolutionWidth,
                        recordingVersion: version
                    },
                    timeSinceLastEvent: 0
                };
                _this = _super.call(this, id, name, description, stepInfo, controlName, controlType, context.getCurrentViewNameHandler()) || this;
                return _this;
            }
            Object.defineProperty(StartRecordingStep.prototype, "isEditable", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StartRecordingStep.prototype, "isDeletable", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StartRecordingStep.prototype, "isNumberable", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            return StartRecordingStep;
        }(UserActivityRecorder.UserActivityRecorderBaseStep));
        UserActivityRecorder.StartRecordingStep = StartRecordingStep;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var ValidationStep = (function (_super) {
            __extends(ValidationStep, _super);
            function ValidationStep(id, name, description, stepInfo, controlName, controlType, formId) {
                return _super.call(this, id, name, description, stepInfo, controlName, controlType, formId) || this;
            }
            Object.defineProperty(ValidationStep.prototype, "isEditable", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ValidationStep.prototype, "isDeletable", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ValidationStep.prototype, "isNumberable", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            return ValidationStep;
        }(UserActivityRecorder.UserActivityRecorderBaseStep));
        UserActivityRecorder.ValidationStep = ValidationStep;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
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
    var TaskRecorder;
    (function (TaskRecorder_1) {
        var TaskRecorder = (function () {
            function TaskRecorder(context) {
                var _this = this;
                this._context = context;
                this._eventManager = new Commerce.EventManager();
                var internalContext = __assign(__assign({}, context), { eventManager: this._eventManager });
                this.taskRecorderController = new TaskRecorder_1.TaskRecorderController(internalContext);
                this._context.addNumPadOnEnterCallback(function (element, value) {
                    if (!Commerce.StringExtensions.isNullOrWhitespace(value)) {
                        _this._eventManager.raiseEvent("taskRecorderEvent", { type: "taskRecorderEvent", element: element });
                    }
                });
            }
            Object.defineProperty(TaskRecorder.prototype, "isActivated", {
                get: function () {
                    return !Commerce.ObjectExtensions.isNullOrUndefined(this.taskRecorderController) && this.taskRecorderController.isActivated;
                },
                enumerable: true,
                configurable: true
            });
            TaskRecorder.prototype.activateRecorder = function (correlationId, viewName) {
                this.taskRecorderController.activateMainPanel(correlationId, viewName);
            };
            TaskRecorder.prototype.addEventListener = function (eventName, eventListener) {
                this._eventManager.addEventListener(eventName, eventListener);
            };
            TaskRecorder.prototype.removeEventListener = function (eventName, eventListener) {
                this._eventManager.removeEventListener(eventName, eventListener);
            };
            return TaskRecorder;
        }());
        TaskRecorder_1.TaskRecorder = TaskRecorder;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var UserActivityRecorderControllerBase = (function () {
            function UserActivityRecorderControllerBase(context) {
                this.hostElement = null;
                this.mainPanel = null;
                this._defaultViewModelTitle = null;
                this._focusOnMainPanelEventHandler = this.setFocusOnMainPanel.bind(this);
                this.CLOSE_PANEL_BUTTON_ID = "closePanelButton";
                this.TIME_IN_MILLISECONDS_TO_TOGGLE_MAIN_PANEL = 0;
                Commerce.ThrowIf.argumentIsNotObject(context, "context");
                this.context = context;
                this.initializeHtmlHost();
                this.initializePanelDefinitions();
                this.initializePageDefinitions();
            }
            Object.defineProperty(UserActivityRecorderControllerBase.prototype, "isActivated", {
                get: function () {
                    return !Commerce.ObjectExtensions.isNullOrUndefined(this.mainPanel);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserActivityRecorderControllerBase.prototype, "CorrelationId", {
                get: function () {
                    return this._correlationId;
                },
                enumerable: true,
                configurable: true
            });
            UserActivityRecorderControllerBase.prototype.showMainPanel = function (timeInMillisecondsToAnimate) {
                var _this = this;
                Commerce.RetailLogger.userActivityRecorderShowMainPanel(this.CorrelationId);
                var panelShownAsyncResult = new Commerce.AsyncResult();
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.mainPanel)) {
                    var options = {
                        done: function () {
                            panelShownAsyncResult.resolve(true);
                        },
                        fail: function (animation, jumpedToEnd) {
                            panelShownAsyncResult.resolve(jumpedToEnd);
                        }
                    };
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(timeInMillisecondsToAnimate)) {
                        options.duration = timeInMillisecondsToAnimate;
                    }
                    $(this.mainPanel.element).show(options);
                }
                else {
                    panelShownAsyncResult.resolve(false);
                }
                return panelShownAsyncResult.done(function () {
                    Commerce.RetailLogger.userActivityRecorderShowMainPanelSucceeded(_this.CorrelationId);
                }).fail(function (errors) {
                    Commerce.RetailLogger.userActivityRecorderShowMainPanelFailed(_this.CorrelationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                });
            };
            UserActivityRecorderControllerBase.prototype.hideMainPanel = function (closeWhenNotRecording, timeInMillisecondsToAnimate) {
                var _this = this;
                if (closeWhenNotRecording === void 0) { closeWhenNotRecording = true; }
                Commerce.RetailLogger.userActivityRecorderHideMainPanel(this.CorrelationId);
                var panelHideAsyncResult = new Commerce.AsyncResult();
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.mainPanel)) {
                    var options = {
                        done: function () {
                            if (closeWhenNotRecording && !_this.Manager.isRecordingActive()) {
                                _this.deactivateMainPanel();
                            }
                            panelHideAsyncResult.resolve(true);
                        },
                        fail: function (animation, jumpedToEnd) {
                            panelHideAsyncResult.resolve(jumpedToEnd);
                        }
                    };
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(timeInMillisecondsToAnimate)) {
                        options.duration = timeInMillisecondsToAnimate;
                    }
                    $(this.mainPanel.element).hide(options);
                }
                else {
                    panelHideAsyncResult.resolve(false);
                }
                return panelHideAsyncResult.done(function () {
                    Commerce.RetailLogger.userActivityRecorderHideMainPanelSucceeded(_this.CorrelationId);
                }).fail(function (errors) {
                    Commerce.RetailLogger.userActivityRecorderHideMainPanelFailed(_this.CorrelationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                });
            };
            UserActivityRecorderControllerBase.prototype.toggleMainPanel = function () {
                var _this = this;
                var asyncResult;
                if ($(this.mainPanel.element).is(":visible")) {
                    asyncResult = this.hideMainPanel(false, this.TIME_IN_MILLISECONDS_TO_TOGGLE_MAIN_PANEL);
                }
                else {
                    asyncResult = this.showMainPanel(this.TIME_IN_MILLISECONDS_TO_TOGGLE_MAIN_PANEL);
                }
                asyncResult.done(function (result) {
                    if (result) {
                        var session = _this.Manager.activeSession();
                        var recordingStates = [UserActivityRecorder.UserActivityRecorderState.Recording, UserActivityRecorder.UserActivityRecorderState.RecordingPaused];
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(session) && Commerce.ArrayExtensions.hasElement(recordingStates, session.state())) {
                            session.updateRecordingView();
                        }
                    }
                });
            };
            UserActivityRecorderControllerBase.prototype.activateMainPanel = function (correlationId, viewName) {
                var _this = this;
                this._correlationId = correlationId;
                var asyncResult;
                var session = this.Manager.activeSession();
                if (!Commerce.StringExtensions.isNullOrWhitespace(viewName)) {
                    asyncResult = this.navigate(viewName);
                }
                else if (!Commerce.ObjectExtensions.isNullOrUndefined(session)) {
                    var state = session.state();
                    switch (state) {
                        case UserActivityRecorder.UserActivityRecorderState.Recording:
                        case UserActivityRecorder.UserActivityRecorderState.RecordingPaused:
                        case UserActivityRecorder.UserActivityRecorderState.Validating:
                        case UserActivityRecorder.UserActivityRecorderState.ValidationPaused:
                            asyncResult = this.navigate("Recording");
                            break;
                        case UserActivityRecorder.UserActivityRecorderState.RecordingCompleted:
                            asyncResult = this.navigate("CompleteRecording");
                            break;
                        default:
                            asyncResult = Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_CONTROLLER_NOT_SUPPORTED_STATE)]);
                    }
                }
                else {
                    asyncResult = this.navigate("Welcome");
                }
                asyncResult.done(function () {
                    _this.mainPanel.element.addEventListener("click", _this._focusOnMainPanelEventHandler, false);
                });
                return asyncResult;
            };
            UserActivityRecorderControllerBase.prototype.deactivateMainPanel = function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.mainPanel)) {
                    this.mainPanel.element.removeEventListener("click", this._focusOnMainPanelEventHandler);
                    this.ViewManager.unloadView(this.hostElement, this.mainPanel);
                    this.mainPanel = null;
                }
                this._correlationId = Commerce.StringExtensions.EMPTY;
            };
            UserActivityRecorderControllerBase.prototype.navigate = function (pageName, options) {
                var _this = this;
                Commerce.RetailLogger.userActivityRecorderNavigateToPage(this.CorrelationId, pageName);
                Commerce.ThrowIf.argumentIsNotString(pageName, "pageName");
                return this.openMainPanel()
                    .done(function (mainPanel) {
                    mainPanel.viewModel.navigate(pageName, options).done(function () {
                        Commerce.RetailLogger.userActivityRecorderNavigateToPageSucceeded(_this.CorrelationId, pageName);
                        _this.setFocusOnMainPanel();
                    }).fail(function (errors) {
                        Commerce.RetailLogger.userActivityRecorderNavigateToPageFailed(_this.CorrelationId, pageName, Commerce.Framework.ErrorConverter.serializeError(errors));
                    });
                }).fail(function (errors) {
                    Commerce.RetailLogger.userActivityRecorderNavigateToPageFailed(_this.CorrelationId, pageName, Commerce.Framework.ErrorConverter.serializeError(errors));
                    var displayErrorsRequest = new Commerce.Framework.ShowErrorMessageClientRequest(_this.CorrelationId, errors);
                    _this.context.runtime.executeAsync(displayErrorsRequest);
                });
            };
            UserActivityRecorderControllerBase.prototype.navigateBack = function () {
                var _this = this;
                this.openMainPanel()
                    .done(function (mainPanel) {
                    mainPanel.viewModel.navigateBack();
                }).fail(function (errors) {
                    var displayErrorsRequest = new Commerce.Framework.ShowErrorMessageClientRequest(_this.CorrelationId, errors);
                    _this.context.runtime.executeAsync(displayErrorsRequest);
                });
            };
            UserActivityRecorderControllerBase.prototype.getUserActivityRecorderState = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.Manager)) {
                    return UserActivityRecorder.UserActivityRecorderState.None;
                }
                var session = this.Manager.activeSession();
                if (Commerce.ObjectExtensions.isNullOrUndefined(session)) {
                    return UserActivityRecorder.UserActivityRecorderState.None;
                }
                return session.state();
            };
            Object.defineProperty(UserActivityRecorderControllerBase.prototype, "DefaultViewModelTitle", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._defaultViewModelTitle)) {
                        this._defaultViewModelTitle = this.getDefaultViewModelTitle();
                    }
                    return this._defaultViewModelTitle;
                },
                enumerable: true,
                configurable: true
            });
            UserActivityRecorderControllerBase.prototype.initializeHtmlHost = function () {
                var hostElement = document.getElementById(this.UserActivityRecorderControllerElementId);
                if (Commerce.ObjectExtensions.isNullOrUndefined(hostElement)) {
                    throw this.ErrorInvalidDOM;
                }
                this.hostElement = hostElement;
            };
            UserActivityRecorderControllerBase.prototype.openMainPanel = function () {
                var _this = this;
                var asyncResult;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.mainPanel)) {
                    asyncResult = Commerce.AsyncResult.createResolved(this.mainPanel);
                }
                else {
                    asyncResult = this.ViewManager.loadView(this.CorrelationId, "MainPanel", this.ViewManager, this.hostElement).done(function (vvm) {
                        ko.applyBindings(vvm.viewModel, vvm.element);
                        _this.mainPanel = vvm;
                        return vvm;
                    });
                }
                return asyncResult.done(function () {
                    _this.showMainPanel();
                });
            };
            UserActivityRecorderControllerBase.prototype.setFocusOnMainPanel = function () {
                var _this = this;
                if ($(this.mainPanel.element).is(":visible")) {
                    var $focusableElements_1 = $(this.mainPanel.element).find(":focusable");
                    if ($focusableElements_1.length > 0) {
                        window.setTimeout(function () {
                            var $focusedElementsInMainPanel = $(_this.mainPanel.element).find(":focus");
                            if ($focusedElementsInMainPanel.length <= 0) {
                                var elementToSetFocus = $focusableElements_1[0];
                                if ((elementToSetFocus.id === _this.CLOSE_PANEL_BUTTON_ID) && ($focusableElements_1.length > 1)) {
                                    elementToSetFocus = $focusableElements_1[1];
                                }
                                elementToSetFocus.focus();
                            }
                        }, 0);
                    }
                }
            };
            return UserActivityRecorderControllerBase;
        }());
        UserActivityRecorder.UserActivityRecorderControllerBase = UserActivityRecorderControllerBase;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var UserAccessControlViewModel = (function () {
                function UserAccessControlViewModel(context) {
                    Commerce.ThrowIf.argumentIsNotObject(context, "context");
                    this.userActivityRecorderController = context.userActivityRecorderController;
                    this.userActivityRecorderManager = context.userActivityRecorderManager;
                    this.context = context.activityRecorderContext;
                }
                Object.defineProperty(UserAccessControlViewModel.prototype, "Title", {
                    get: function () {
                        return this.userActivityRecorderController.DefaultViewModelTitle;
                    },
                    enumerable: true,
                    configurable: true
                });
                return UserAccessControlViewModel;
            }());
            ViewModel.UserAccessControlViewModel = UserAccessControlViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var RecordingViewModelBase = (function (_super) {
                __extends(RecordingViewModelBase, _super);
                function RecordingViewModelBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.session = ko.observable(null);
                    _this.session = _this.userActivityRecorderManager.activeSession;
                    _this.isValidationModeChecked = ko.observable(false);
                    _this.session().state.subscribe(function (newValue) {
                        _this.isValidationModeChecked((newValue === UserActivityRecorder.UserActivityRecorderState.Validating) ||
                            (newValue === UserActivityRecorder.UserActivityRecorderState.ValidationPaused));
                    });
                    _this.isInValidationState = ko.computed(function () {
                        var startStates = [
                            UserActivityRecorder.UserActivityRecorderState.Validating,
                            UserActivityRecorder.UserActivityRecorderState.ValidationPaused
                        ];
                        return Commerce.ObjectExtensions.isNullOrUndefined(_this.session()) ?
                            false : Commerce.ArrayExtensions.hasElement(startStates, _this.session().state());
                    });
                    _this.isPauseAllowed = ko.computed(function () {
                        var startStates = [
                            UserActivityRecorder.UserActivityRecorderState.Recording,
                            UserActivityRecorder.UserActivityRecorderState.Validating
                        ];
                        return Commerce.ObjectExtensions.isNullOrUndefined(_this.session()) ?
                            false : Commerce.ArrayExtensions.hasElement(startStates, _this.session().state());
                    });
                    _this.isValidationModeEnabled = ko.computed(function () {
                        return _this.isPauseAllowed();
                    });
                    _this.isEndTaskEnabled = ko.computed(function () {
                        return Commerce.ObjectExtensions.isNullOrUndefined(_this.session()) ?
                            false : _this.session().isTaskCreated();
                    });
                    _this.session().state.valueHasMutated();
                    _this.isScreenshotsFeatureAvailable = _this.checkScreenshotsFeature();
                    return _this;
                }
                RecordingViewModelBase.prototype.onShown = function () {
                    this.session().updateRecordingView();
                };
                RecordingViewModelBase.prototype.continueRecording = function () {
                    if (this.session().state() !== UserActivityRecorder.UserActivityRecorderState.Recording) {
                        this.session().continueWithRecording();
                        Commerce.RetailLogger.userActivityRecorderContinueRecording(this.userActivityRecorderController.CorrelationId, this.session().id(), this.session().name());
                    }
                };
                RecordingViewModelBase.prototype.pauseRecording = function () {
                    this.session().pauseRecordingAndValidation();
                    Commerce.RetailLogger.userActivityRecorderPauseRecording(this.userActivityRecorderController.CorrelationId, this.session().id(), this.session().name());
                };
                RecordingViewModelBase.prototype.stopRecording = function () {
                    this.userActivityRecorderManager.disableScreenCapture();
                    this.session().stopRecording();
                    Commerce.RetailLogger.userActivityRecorderStopRecording(this.userActivityRecorderController.CorrelationId, this.session().id(), this.session().name());
                    this.userActivityRecorderController.navigate("CompleteRecording");
                };
                RecordingViewModelBase.prototype.continueWithValidation = function () {
                    if (this.session().state() !== UserActivityRecorder.UserActivityRecorderState.Validating) {
                        this.session().continueWithValidation();
                        Commerce.RetailLogger.userActivityRecorderContinueValidation(this.userActivityRecorderController.CorrelationId, this.session().id(), this.session().name());
                    }
                };
                RecordingViewModelBase.prototype.continueWithRecorder = function () {
                    if (this.isValidationModeChecked()) {
                        this.continueWithValidation();
                    }
                    else {
                        this.continueRecording();
                    }
                };
                RecordingViewModelBase.prototype.setValidationState = function (allowValidation) {
                    if ((this.session().state() === UserActivityRecorder.UserActivityRecorderState.None) ||
                        (this.session().state() === UserActivityRecorder.UserActivityRecorderState.RecordingCompleted)) {
                        return;
                    }
                    if (allowValidation) {
                        this.isValidationModeChecked(true);
                        this.continueWithValidation();
                    }
                    else {
                        this.isValidationModeChecked(false);
                        this.continueWithRecorder();
                    }
                };
                RecordingViewModelBase.prototype.toggleScreenCapture = function (captureScreen) {
                    if (captureScreen) {
                        this.userActivityRecorderManager.enableScreenCapture();
                    }
                    else {
                        this.userActivityRecorderManager.disableScreenCapture();
                    }
                };
                RecordingViewModelBase.prototype.startTask = function () {
                    this.userActivityRecorderController.navigate("NewTask", this.session());
                };
                RecordingViewModelBase.prototype.endTask = function () {
                    this.session().endTask();
                    Commerce.RetailLogger.userActivityRecorderEndTask(this.userActivityRecorderController.CorrelationId, this.session().id(), this.session().name());
                };
                RecordingViewModelBase.prototype.editNode = function (nodeViewModel) {
                    var viewName;
                    switch (nodeViewModel.oDataClass) {
                        case Commerce.Proxy.Entities.TaskRecorderODataType.commandUserAction:
                            viewName = "EditStep";
                            break;
                        case Commerce.Proxy.Entities.TaskRecorderODataType.taskUserAction:
                            viewName = "EditTask";
                            break;
                        default:
                            throw new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_ODATA_TYPE_NOT_FOUND);
                    }
                    this.userActivityRecorderController.navigate(viewName, nodeViewModel.id);
                };
                RecordingViewModelBase.prototype.deleteNode = function (nodeViewModel) {
                    this.session().deleteNode(nodeViewModel.id);
                };
                return RecordingViewModelBase;
            }(ViewModel.UserAccessControlViewModel));
            ViewModel.RecordingViewModelBase = RecordingViewModelBase;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var RecordingViewModel = (function (_super) {
                __extends(RecordingViewModel, _super);
                function RecordingViewModel() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(RecordingViewModel.prototype, "isValidationAllowed", {
                    get: function () {
                        return false;
                    },
                    enumerable: true,
                    configurable: true
                });
                RecordingViewModel.prototype.checkScreenshotsFeature = function () {
                    return this.context.isScreenCaptureAvailable;
                };
                return RecordingViewModel;
            }(Commerce.UserActivityRecorder.ViewModel.RecordingViewModelBase));
            ViewModel.RecordingViewModel = RecordingViewModel;
        })(ViewModel = TaskRecorder.ViewModel || (TaskRecorder.ViewModel = {}));
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var PrivacyViewModel = (function (_super) {
                __extends(PrivacyViewModel, _super);
                function PrivacyViewModel(context) {
                    var _this = _super.call(this, context) || this;
                    _this.technicalDocumentation = Commerce.StringExtensions.format(PrivacyViewModel.TECHNICALDOCUMENTATIONURLFORMAT, context.activityRecorderContext.stringResourceManager.getString("string_10162"));
                    _this.privacyText = ko.observable(Commerce.StringExtensions.EMPTY);
                    return _this;
                }
                PrivacyViewModel.TECHNICALDOCUMENTATIONURLFORMAT = "<a target='_blank' href='https://go.microsoft.com/fwlink/?linkid=2106378'>{0}</a>";
                return PrivacyViewModel;
            }(ViewModel.UserAccessControlViewModel));
            ViewModel.PrivacyViewModel = PrivacyViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var CompleteRecordingViewModel = (function (_super) {
                __extends(CompleteRecordingViewModel, _super);
                function CompleteRecordingViewModel(context) {
                    var _this = _super.call(this, context) || this;
                    _this.session = ko.observable(null);
                    _this._indeterminateWaitVisible = ko.observable(false);
                    _this.recordingName = ko.observable(null);
                    _this.session = _this.userActivityRecorderManager.activeSession;
                    _this.recordingName(_this.session().name());
                    _this.isLcsAvailable = ko.observable(false);
                    _this.isSaveToWordDocumentAllowed = ko.observable(true);
                    _this.isSaveToDocumentRecordingAllowed = ko.observable(true);
                    _this.privacyText(Commerce.StringExtensions.format(_this.context.stringResourceManager.getString("string_10161"), _this.technicalDocumentation));
                    _this._recordingStatistics = null;
                    return _this;
                }
                CompleteRecordingViewModel.prototype.saveToThisPC = function () {
                    this.processSessionSave(this.userActivityRecorderManager.saveSessionAsRecordingBundle, Commerce.RetailLogger.userActivityRecorderSaveToThisPC, Commerce.RetailLogger.userActivityRecorderSaveToThisPCSucceeded, Commerce.RetailLogger.userActivityRecorderSaveToThisPCFailed, UserActivityRecorder.ErrorCodes.TASK_RECORDER_SAVE_SESSION_AS_RECORDING_BUNDLE_ERROR);
                };
                CompleteRecordingViewModel.prototype.saveRecording = function () {
                    this.processSessionSave(this.userActivityRecorderManager.saveSessionAsXml, Commerce.RetailLogger.userActivityRecorderSaveRecordingAsXML, Commerce.RetailLogger.userActivityRecorderSaveRecordingAsXMLSucceeded, Commerce.RetailLogger.userActivityRecorderSaveRecordingAsXMLFailed, UserActivityRecorder.ErrorCodes.TASK_RECORDER_XML_EXPORT_ERROR);
                };
                CompleteRecordingViewModel.prototype.saveWordDocument = function () {
                    this.processSessionSave(this.userActivityRecorderManager.saveSessionAsWordDocument, Commerce.RetailLogger.userActivityRecorderSaveRecordingAsWordDocument, Commerce.RetailLogger.userActivityRecorderSaveRecordingAsWordDocumentSucceeded, Commerce.RetailLogger.userActivityRecorderSaveRecordingAsWordDocumentFailed, UserActivityRecorder.ErrorCodes.TASK_RECORDER_WORD_EXPORT_ERROR);
                };
                CompleteRecordingViewModel.prototype.saveBpmPackage = function () {
                    this.processSessionSave(this.userActivityRecorderManager.saveBusinessProcessModelPackage, Commerce.RetailLogger.userActivityRecorderSaveRecordingAsBPMPackage, Commerce.RetailLogger.userActivityRecorderSaveRecordingAsBPMPackageSucceeded, Commerce.RetailLogger.userActivityRecorderSaveRecordingAsBPMPackageFailed, UserActivityRecorder.ErrorCodes.TASK_RECORDER_BPM_PACKAGE_EXPORT_ERROR);
                };
                CompleteRecordingViewModel.prototype.saveToLifecycleServices = function () {
                    this.userActivityRecorderManager.saveToLifecycleServices(this.userActivityRecorderController.CorrelationId);
                    this.userActivityRecorderController.deactivateMainPanel();
                };
                CompleteRecordingViewModel.prototype.closeRecording = function () {
                    this.session(null);
                    this.userActivityRecorderController.deactivateMainPanel();
                };
                CompleteRecordingViewModel.prototype.handleSaveFileErrors = function (correlationId, errors) {
                    if (!Commerce.ArrayExtensions.hasElements(errors)) {
                        return false;
                    }
                    var errorCodes = errors.map(function (error) { return error.ErrorCode; });
                    if (Commerce.ArrayExtensions.hasElement(errorCodes, UserActivityRecorder.ErrorCodes.TASK_RECORDER_COULDNT_SAVE_FILE) ||
                        Commerce.ArrayExtensions.hasElement(errorCodes, UserActivityRecorder.ErrorCodes.TASK_RECORDER_COULDNT_COMPLETE_UPDATES_FOR_FILE)) {
                        var saveErrors = [new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_SAVE_FILE_ERROR)];
                        var showErrorsRequest = new Commerce.Framework.ShowErrorMessageClientRequest(correlationId, saveErrors);
                        this.context.runtime.executeAsync(showErrorsRequest);
                        return true;
                    }
                    return false;
                };
                CompleteRecordingViewModel.prototype.logRecordingStatistics = function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._recordingStatistics)) {
                        try {
                            var recordingStatistics_1 = {
                                numberNodes: 0,
                                numberTasks: 0,
                                numberSteps: 0,
                                numberDeletableSteps: 0,
                                numberStepsWithMergedEvents: 0,
                                numberStepsWithSensitiveData: 0
                            };
                            var nodes = this.userActivityRecorderManager.activeSession().nodes();
                            if (Commerce.ArrayExtensions.hasElements(nodes)) {
                                nodes.forEach(function (node) {
                                    if (!Commerce.ObjectExtensions.isNullOrUndefined(node)) {
                                        recordingStatistics_1.numberNodes++;
                                        if (node instanceof Commerce.TaskRecorder.ViewModel.TaskRecorderTaskViewModel) {
                                            recordingStatistics_1.numberTasks++;
                                        }
                                        else if (node instanceof Commerce.TaskRecorder.ViewModel.TaskRecorderStepViewModel) {
                                            recordingStatistics_1.numberSteps++;
                                            if (node.deletable) {
                                                recordingStatistics_1.numberDeletableSteps++;
                                            }
                                            if (!Commerce.ObjectExtensions.isNullOrUndefined(node.stepInfo)) {
                                                if (!Commerce.ObjectExtensions.isNullOrUndefined(node.stepInfo.mergedEventInfo)) {
                                                    recordingStatistics_1.numberStepsWithMergedEvents++;
                                                }
                                                if (node.stepInfo.isSensitiveData) {
                                                    recordingStatistics_1.numberStepsWithSensitiveData++;
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            this._recordingStatistics = recordingStatistics_1;
                        }
                        catch (e) {
                            Commerce.RetailLogger.userActivityRecorderCreateRecordingStatisticsFailed(this.userActivityRecorderController.CorrelationId, this.session().id(), Commerce.Framework.ErrorConverter.serializeError(e));
                        }
                    }
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(this._recordingStatistics)) {
                        var serializedRecordingStatistics = void 0;
                        try {
                            serializedRecordingStatistics = JSON.stringify(this._recordingStatistics);
                        }
                        catch (e) {
                            serializedRecordingStatistics = Commerce.StringExtensions.EMPTY;
                        }
                        Commerce.RetailLogger.userActivityRecorderRecordingStatistics(this.userActivityRecorderController.CorrelationId, this.session().id(), this._recordingStatistics.numberNodes, this._recordingStatistics.numberTasks, this._recordingStatistics.numberSteps, serializedRecordingStatistics);
                    }
                };
                CompleteRecordingViewModel.prototype.processSessionSave = function (action, saveRecordingStart, saveRecordingSucceeded, saveRecordingFailed, errorType) {
                    var _this = this;
                    this._indeterminateWaitVisible(true);
                    saveRecordingStart(this.userActivityRecorderController.CorrelationId, this.session().id());
                    this.logRecordingStatistics();
                    return (action.bind(this.userActivityRecorderManager))(this.userActivityRecorderController.CorrelationId).done(function () {
                        saveRecordingSucceeded(_this.userActivityRecorderController.CorrelationId, _this.session().id());
                    }).always(function () {
                        _this._indeterminateWaitVisible(false);
                    }).fail(function (errors) {
                        saveRecordingFailed(_this.userActivityRecorderController.CorrelationId, _this.session().id(), Commerce.Framework.ErrorConverter.serializeError(errors));
                        if (!_this.handleSaveFileErrors(_this.userActivityRecorderController.CorrelationId, errors)) {
                            var showErrorsRequest = new Commerce.Framework.ShowErrorMessageClientRequest(_this.userActivityRecorderController.CorrelationId, [new Commerce.Proxy.Entities.Error(errorType, false, Commerce.StringExtensions.EMPTY, [_this.session().id()])], "string_10104");
                            _this.context.runtime.executeAsync(showErrorsRequest);
                        }
                    });
                };
                return CompleteRecordingViewModel;
            }(ViewModel.PrivacyViewModel));
            ViewModel.CompleteRecordingViewModel = CompleteRecordingViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var EditStepViewModel = (function (_super) {
                __extends(EditStepViewModel, _super);
                function EditStepViewModel(context, stepId) {
                    var _this = _super.call(this, context) || this;
                    _this.session = ko.observable(null);
                    Commerce.ThrowIf.argumentIsNotString(stepId, "stepId");
                    _this.session = _this.userActivityRecorderManager.activeSession;
                    var node = Commerce.ArrayExtensions.firstOrUndefined(_this.session().nodes(), function (node) {
                        return node.id === stepId;
                    });
                    _this.storedTaskRecorderStepViewModel = node;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(_this.storedTaskRecorderStepViewModel)) {
                        throw new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_STEP_VIEW_MODEL_NOT_FOUND);
                    }
                    _this.text = ko.observable(_this.storedTaskRecorderStepViewModel.text());
                    _this.notes = ko.observable(_this.storedTaskRecorderStepViewModel.notes());
                    var timeSinceLastEvent;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(_this.storedTaskRecorderStepViewModel.stepInfo)) {
                        timeSinceLastEvent = Number.NaN;
                    }
                    if (isNaN(timeSinceLastEvent)) {
                        _this.timeDelaySupported = ko.observable(false);
                        _this.inputTimeDelay = ko.observable("0");
                    }
                    else {
                        _this.timeDelaySupported = ko.observable(false);
                        _this.inputTimeDelay = ko.observable(timeSinceLastEvent.toString());
                    }
                    _this.isFormDataValid = ko.computed(function () {
                        var timeDelay = parseFloat(_this.inputTimeDelay());
                        return !isNaN(timeDelay) || (timeDelay < 0);
                    });
                    _this.hasVariableValue = ko.observable(false);
                    _this.areMultipleLinesAllowedInVariableValue = ko.observable(false);
                    _this.isVariableValueModifiable = ko.observable(false);
                    _this.variableValue = ko.observable(Commerce.StringExtensions.EMPTY);
                    return _this;
                }
                EditStepViewModel.prototype.saveStep = function () {
                    this.storedTaskRecorderStepViewModel.text(this.text());
                    this.storedTaskRecorderStepViewModel.notes(this.notes());
                    this.userActivityRecorderController.navigate("Recording");
                };
                EditStepViewModel.prototype.cancel = function () {
                    this.userActivityRecorderController.navigate("Recording");
                };
                return EditStepViewModel;
            }(ViewModel.UserAccessControlViewModel));
            ViewModel.EditStepViewModel = EditStepViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var EditTaskViewModel = (function (_super) {
                __extends(EditTaskViewModel, _super);
                function EditTaskViewModel(context, taskId) {
                    var _this = _super.call(this, context) || this;
                    _this.taskName = ko.observable(null);
                    _this.taskComment = ko.observable(null);
                    _this.session = ko.observable(null);
                    Commerce.ThrowIf.argumentIsNotString(taskId, "taskId");
                    _this.session = _this.userActivityRecorderManager.activeSession;
                    var node = Commerce.ArrayExtensions.firstOrUndefined(_this.session().nodes(), function (node) {
                        return node.id === taskId;
                    });
                    _this.storedTaskRecorderTaskViewModel = node;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(_this.storedTaskRecorderTaskViewModel)) {
                        throw new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_TASK_VIEW_MODEL_NOT_FOUND);
                    }
                    _this.taskName = ko.observable(_this.storedTaskRecorderTaskViewModel.name());
                    _this.taskComment = ko.observable(_this.storedTaskRecorderTaskViewModel.comment());
                    return _this;
                }
                EditTaskViewModel.prototype.saveTask = function () {
                    this.storedTaskRecorderTaskViewModel.name(this.taskName());
                    this.storedTaskRecorderTaskViewModel.comment(this.taskComment());
                    this.userActivityRecorderController.navigate("Recording");
                };
                EditTaskViewModel.prototype.cancel = function () {
                    this.userActivityRecorderController.navigate("Recording");
                };
                return EditTaskViewModel;
            }(ViewModel.UserAccessControlViewModel));
            ViewModel.EditTaskViewModel = EditTaskViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var Managers = Commerce.Model.Managers;
            var Model = Commerce.TaskRecorder.Model;
            var HelpViewModel = (function () {
                function HelpViewModel(context) {
                    Commerce.ThrowIf.argumentIsNotObject(context, "context");
                    this.taskRecorderController = context.userActivityRecorderController;
                    this.searchText = ko.observable(Commerce.StringExtensions.EMPTY);
                    this.isSearchInProgress = ko.observable(false);
                    this.isSearchPaneActive = ko.observable(true);
                    this.taskGuides = ko.observableArray([]);
                    this.textBeingSearched = Commerce.StringExtensions.EMPTY;
                    this.recordingManager = context.activityRecorderContext.managerFactory.getManager(Managers.IRecordingManagerName);
                    this._context = context;
                }
                HelpViewModel.prototype.search = function () {
                    var _this = this;
                    var searchText = this.searchText();
                    var correlationId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                    if (searchText.length > 0 && searchText !== this.textBeingSearched) {
                        this.taskGuides([]);
                        this.textBeingSearched = searchText;
                        this.isSearchInProgress(true);
                        this.searchTaskGuidesByTitle(searchText)
                            .done(function (result) {
                            if (searchText === _this.textBeingSearched) {
                                _this.taskGuides(result);
                            }
                        })
                            .fail(function (errors) {
                            if (searchText === _this.textBeingSearched) {
                                var showErrorsRequest = new Commerce.Framework.ShowErrorMessageClientRequest(correlationId, errors);
                                _this._context.activityRecorderContext.runtime.executeAsync(showErrorsRequest);
                            }
                        })
                            .always(function () {
                            if (searchText === _this.textBeingSearched) {
                                _this.isSearchInProgress(false);
                                _this.textBeingSearched = Commerce.StringExtensions.EMPTY;
                            }
                        });
                    }
                };
                HelpViewModel.prototype.openStartTaskGuide = function (model) {
                    var viewOptions = {
                        bpmLineId: model.id,
                        recordingName: model.title
                    };
                    this.taskRecorderController.navigate("StartTaskGuide", viewOptions);
                };
                HelpViewModel.prototype.searchTaskGuidesByTitle = function (taskGuideSearchText) {
                    var asyncResult = new Commerce.AsyncResult();
                    this.recordingManager.searchTaskGuidesByTitle(HelpViewModel.BPM_LIBRARY_LINE_ID_TO_SEARCH_OVER_ALL_HELP_LIBRARIES, taskGuideSearchText, Commerce.Proxy.Entities.QueryType.NameAndDescription)
                        .done(function (taskGuides) {
                        var taskGuideModels = [];
                        taskGuides.forEach(function (taskGuide) {
                            taskGuide.Lines.forEach(function (taskGuideLine) {
                                taskGuideModels.push(new Model.TaskGuideModel(taskGuideLine, HelpViewModel.EMPTY_TASK_GUIDE_PUBLISHER_NAME));
                            });
                        });
                        asyncResult.resolve(taskGuideModels);
                    })
                        .fail(function (errors) {
                        asyncResult.reject(errors);
                    });
                    return asyncResult;
                };
                HelpViewModel.BPM_LIBRARY_LINE_ID_TO_SEARCH_OVER_ALL_HELP_LIBRARIES = 0;
                HelpViewModel.EMPTY_TASK_GUIDE_PUBLISHER_NAME = Commerce.StringExtensions.EMPTY;
                return HelpViewModel;
            }());
            ViewModel.HelpViewModel = HelpViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var ELEMENT_ID_TASKRECORDER_MAINPANEL_PAGEHOST = "taskRecorderMainPanelPageHost";
            var MainPanelViewModel = (function (_super) {
                __extends(MainPanelViewModel, _super);
                function MainPanelViewModel() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.pageHostElement = null;
                    return _this;
                }
                MainPanelViewModel.prototype.load = function (viewManager) {
                    Commerce.ThrowIf.argumentIsNotObject(viewManager, "viewManager");
                    this.viewManager = viewManager;
                    this.pageHostElement = this.getHostElement();
                };
                MainPanelViewModel.prototype.navigate = function (pageName, options) {
                    var _this = this;
                    Commerce.ThrowIf.argumentIsNotString(pageName, "pageName");
                    if (this.currentPage) {
                        this.viewManager.moveViewToHistory(this.pageHostElement, this.currentPage);
                    }
                    return this.viewManager
                        .loadView(this.userActivityRecorderController.CorrelationId, pageName, options)
                        .done(function (vvm) {
                        _this.currentPage = vvm;
                        _this.pageHostElement.appendChild(vvm.element);
                        ko.applyBindings(vvm.viewModel, vvm.element);
                        if (Commerce.ObjectExtensions.isFunction(vvm.viewModel.onShown)) {
                            vvm.viewModel.onShown();
                        }
                    });
                };
                MainPanelViewModel.prototype.navigateBack = function () {
                    var lastPage = this.viewManager.navigateBack();
                    if (Commerce.ObjectExtensions.isNullOrUndefined(lastPage)) {
                        return;
                    }
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(this.currentPage)) {
                        this.viewManager.unloadView(this.pageHostElement, this.currentPage, false);
                    }
                    this.currentPage = lastPage;
                    this.pageHostElement.appendChild(lastPage.element);
                };
                MainPanelViewModel.prototype.hide = function () {
                    this.userActivityRecorderController.hideMainPanel();
                };
                MainPanelViewModel.errorInvalidDom = function () {
                    return [new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_INVALID_DOM)];
                };
                MainPanelViewModel.prototype.getHostElement = function () {
                    var hostElement = document.getElementById(ELEMENT_ID_TASKRECORDER_MAINPANEL_PAGEHOST);
                    if (!hostElement) {
                        throw MainPanelViewModel.errorInvalidDom();
                    }
                    return hostElement;
                };
                return MainPanelViewModel;
            }(ViewModel.UserAccessControlViewModel));
            ViewModel.MainPanelViewModel = MainPanelViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var NewRecordingViewModel = (function (_super) {
                __extends(NewRecordingViewModel, _super);
                function NewRecordingViewModel(context) {
                    var _this = _super.call(this, context) || this;
                    _this.recordingName = ko.observable(null);
                    _this.recordingDescription = ko.observable(null);
                    _this.isStartRecordingDisabled = ko.computed(function () {
                        var recordingName = _this.recordingName();
                        var isFirstCharacterADigitOrLetter = false;
                        if (!Commerce.StringExtensions.isNullOrWhitespace(recordingName)) {
                            var firstCharacter = recordingName.charAt(0);
                            var letterOrDigitMatchString = /^[0-9a-zA-Z]$/;
                            var matches = firstCharacter.match(letterOrDigitMatchString);
                            isFirstCharacterADigitOrLetter = !Commerce.ObjectExtensions.isNullOrUndefined(matches) && (matches.length === 1);
                        }
                        return !isFirstCharacterADigitOrLetter;
                    }, _this);
                    return _this;
                }
                NewRecordingViewModel.prototype.createRecording = function () {
                    var _this = this;
                    var correlationId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                    this.userActivityRecorderManager.startNewSession(this.userActivityRecorderController.CorrelationId, this.recordingName(), this.recordingDescription()).done(function () {
                        _this.userActivityRecorderManager.activeSession().startRecording();
                        _this.userActivityRecorderController.navigate("Recording");
                    }).fail(function (errors) {
                        var showErrorsRequest = new Commerce.Framework.ShowErrorMessageClientRequest(correlationId, errors);
                        _this.context.runtime.executeAsync(showErrorsRequest);
                    });
                };
                NewRecordingViewModel.prototype.cancel = function () {
                    this.userActivityRecorderController.navigate("Welcome");
                };
                return NewRecordingViewModel;
            }(ViewModel.UserAccessControlViewModel));
            ViewModel.NewRecordingViewModel = NewRecordingViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var NewTaskViewModel = (function (_super) {
                __extends(NewTaskViewModel, _super);
                function NewTaskViewModel(context) {
                    var _this = _super.call(this, context) || this;
                    _this.session = ko.observable(null);
                    _this.taskName = ko.observable(null);
                    _this.taskComment = ko.observable(null);
                    _this.isStartTaskDisabled = ko.computed(function () { return Commerce.StringExtensions.isNullOrWhitespace(_this.taskName()); }, _this);
                    return _this;
                }
                NewTaskViewModel.prototype.load = function (session) {
                    Commerce.ThrowIf.argumentIsNotObject(session, "session");
                    this.session(session);
                };
                NewTaskViewModel.prototype.startTask = function () {
                    this.session().startTask(this.taskName(), this.taskComment());
                    this.userActivityRecorderController.navigate("Recording");
                };
                NewTaskViewModel.prototype.cancel = function () {
                    this.userActivityRecorderController.navigate("Recording");
                };
                return NewTaskViewModel;
            }(ViewModel.UserAccessControlViewModel));
            ViewModel.NewTaskViewModel = NewTaskViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var StartTaskGuideViewModel = (function (_super) {
                __extends(StartTaskGuideViewModel, _super);
                function StartTaskGuideViewModel(context, options) {
                    var _this = _super.call(this, context) || this;
                    _this.recording = ko.observable({
                        name: ko.observable(options.recordingName)
                    });
                    _this.isRecordingReady = ko.observable(false);
                    _this.indeterminateWaitVisible = ko.observable(false);
                    _this._downloadRecording(options.bpmLineId);
                    return _this;
                }
                StartTaskGuideViewModel.prototype.saveWordDocument = function () {
                    var _this = this;
                    var correlationId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                    this.userActivityRecorderManager.saveRecordingAsWordDocument(this.userActivityRecorderController.CorrelationId, this.recording().toModel())
                        .fail(function (errors) {
                        var showErrorsRequest = new Commerce.Framework.ShowErrorMessageClientRequest(correlationId, errors);
                        _this.context.runtime.executeAsync(showErrorsRequest);
                    });
                };
                StartTaskGuideViewModel.prototype.navigateBack = function () {
                    this.userActivityRecorderController.navigateBack();
                };
                StartTaskGuideViewModel.prototype.load = function (state) {
                    return;
                };
                StartTaskGuideViewModel.prototype.onShown = function () {
                    return;
                };
                StartTaskGuideViewModel.prototype.dispose = function () {
                    return;
                };
                StartTaskGuideViewModel.prototype._downloadRecording = function (bpmLineId) {
                    var _this = this;
                    this.indeterminateWaitVisible(true);
                    var correlationId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                    this.userActivityRecorderManager.downloadRecording(bpmLineId)
                        .done(function (result) {
                        _this.recording(result);
                        _this.isRecordingReady(true);
                        _this.indeterminateWaitVisible(false);
                    })
                        .fail(function (errors) {
                        _this.indeterminateWaitVisible(false);
                        var showErrorsRequest = new Commerce.Framework.ShowErrorMessageClientRequest(correlationId, errors);
                        _this.context.runtime.executeAsync(showErrorsRequest);
                    });
                };
                return StartTaskGuideViewModel;
            }(ViewModel.UserAccessControlViewModel));
            ViewModel.StartTaskGuideViewModel = StartTaskGuideViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var WelcomeViewModel = (function (_super) {
                __extends(WelcomeViewModel, _super);
                function WelcomeViewModel(context) {
                    var _this = _super.call(this, context) || this;
                    _this.privacyText(Commerce.StringExtensions.format(_this.context.stringResourceManager.getString("string_10158"), _this.technicalDocumentation));
                    return _this;
                }
                WelcomeViewModel.prototype.load = function () {
                };
                WelcomeViewModel.prototype.createNewRecording = function () {
                    this.userActivityRecorderController.navigate("NewRecording");
                };
                WelcomeViewModel.prototype.closeRecording = function () {
                    this.userActivityRecorderController.deactivateMainPanel();
                };
                return WelcomeViewModel;
            }(ViewModel.PrivacyViewModel));
            ViewModel.WelcomeViewModel = WelcomeViewModel;
        })(ViewModel = UserActivityRecorder.ViewModel || (UserActivityRecorder.ViewModel = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        var taskRecorderPages = {
            "Welcome": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.WelcomeViewModel
            },
            "NewRecording": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.NewRecordingViewModel
            },
            "Recording": {
                viewModelType: Commerce.TaskRecorder.ViewModel.RecordingViewModel
            },
            "NewTask": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.NewTaskViewModel
            },
            "EditStep": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.EditStepViewModel
            },
            "EditTask": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.EditTaskViewModel
            },
            "CompleteRecording": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.CompleteRecordingViewModel
            },
            "Help": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.HelpViewModel
            },
            "StartTaskGuide": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.StartTaskGuideViewModel
            }
        };
        var taskRecorderPanels = {
            "MainPanel": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.MainPanelViewModel
            }
        };
        var TaskRecorderController = (function (_super) {
            __extends(TaskRecorderController, _super);
            function TaskRecorderController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(TaskRecorderController.prototype, "UserActivityRecorderControllerElementId", {
                get: function () {
                    return TaskRecorderController.ELEMENT_ID_TASKRECORDER_HOST;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TaskRecorderController.prototype, "ErrorInvalidDOM", {
                get: function () {
                    return [new Commerce.Proxy.Entities.Error("string_10207")];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TaskRecorderController.prototype, "Manager", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._manager)) {
                        this._manager = new TaskRecorder.TaskRecorderManager(this.context);
                    }
                    return this._manager;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TaskRecorderController.prototype, "ViewManager", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._viewManager)) {
                        this._viewManager = new TaskRecorder.TaskRecorderViewManager(this, this.Manager, this.context);
                    }
                    return this._viewManager;
                },
                enumerable: true,
                configurable: true
            });
            TaskRecorderController.prototype.initializePanelDefinitions = function () {
                var _this = this;
                Object.getOwnPropertyNames(taskRecorderPanels).forEach(function (viewName) {
                    var viewDefinition = taskRecorderPanels[viewName];
                    _this.ViewManager.registerView(viewName, viewDefinition.viewModelType);
                });
            };
            TaskRecorderController.prototype.initializePageDefinitions = function () {
                var _this = this;
                Object.getOwnPropertyNames(taskRecorderPages).forEach(function (viewName) {
                    var viewDefinition = taskRecorderPages[viewName];
                    _this.ViewManager.registerView(viewName, viewDefinition.viewModelType);
                });
            };
            TaskRecorderController.prototype.getDefaultViewModelTitle = function () {
                return this.context.stringResourceManager.getString("string_10055");
            };
            TaskRecorderController.ELEMENT_ID_TASKRECORDER_HOST = "taskRecorderHost";
            return TaskRecorderController;
        }(Commerce.UserActivityRecorder.UserActivityRecorderControllerBase));
        TaskRecorder.TaskRecorderController = TaskRecorderController;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var Managers = Commerce.Model.Managers;
        var ViewModel = Commerce.TaskRecorder.ViewModel;
        var UserActivityRecorderManagerBase = (function () {
            function UserActivityRecorderManagerBase(context) {
                var _this = this;
                this._inProgress = false;
                Commerce.ThrowIf.argumentIsNotObject(context, "context");
                this.activeSession = ko.observable(null);
                this._correlationId = Commerce.StringExtensions.EMPTY;
                this.context = context;
                this._takeScreenshotListener = (function (event) {
                    _this._takeScreenshotAsync(_this.activeSession().id(), event.stepId);
                });
                this._recordingManager = this.context.managerFactory.getManager(Managers.IRecordingManagerName);
            }
            Object.defineProperty(UserActivityRecorderManagerBase.prototype, "CorrelationId", {
                get: function () {
                    return this._correlationId;
                },
                enumerable: true,
                configurable: true
            });
            UserActivityRecorderManagerBase.prototype.startNewSession = function (correlationId, name, description) {
                var _this = this;
                Commerce.ThrowIf.argumentIsNotString(name, "name");
                Commerce.ThrowIf.argumentIsNotStringOrNull(description, "description");
                if (this._inProgress) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_BUSY)]);
                }
                this.cancelSession();
                this._inProgress = true;
                this._correlationId = correlationId;
                var asyncResult = this.loadConfigurationAsync().done(function () {
                    _this.activeSession(_this.getNewRecorderSession(correlationId, name, description));
                });
                return asyncResult.always(function () {
                    _this._inProgress = false;
                });
            };
            UserActivityRecorderManagerBase.prototype.openExistingSession = function () {
                var _this = this;
                if (this._inProgress) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_BUSY)]);
                }
                this.cancelSession();
                this._inProgress = true;
                var asyncResult = Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.NOT_IMPLEMENTED)]);
                return asyncResult.always(function () {
                    _this._inProgress = false;
                });
            };
            UserActivityRecorderManagerBase.prototype.saveSessionAsXml = function () {
                var _this = this;
                if (this._inProgress) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_BUSY)]);
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.activeSession())) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_NO_ACTIVE_SESSION)]);
                }
                this._inProgress = true;
                var asyncResult = new Commerce.VoidAsyncResult();
                this.activeSession().getRecordingAsync().done(function (result) {
                    if (result.canceled) {
                        asyncResult.resolve();
                    }
                    else {
                        _this._recordingManager.generateRecordingFile(result.data).done(function (url) {
                            _this._saveFile(url).done(function () {
                                asyncResult.resolve();
                            }).fail(function (errors) {
                                asyncResult.reject(errors);
                            });
                        }).fail(function (errors) {
                            asyncResult.reject(errors);
                        });
                    }
                }).fail(function (errors) {
                    asyncResult.reject(errors);
                });
                return asyncResult.always(function () {
                    _this._inProgress = false;
                });
            };
            UserActivityRecorderManagerBase.prototype.saveBusinessProcessModelPackage = function () {
                var _this = this;
                if (this._inProgress) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_BUSY)]);
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.activeSession())) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_NO_ACTIVE_SESSION)]);
                }
                this._inProgress = true;
                var asyncResult = new Commerce.VoidAsyncResult();
                this.activeSession().getRecordingAsync().done(function (result) {
                    if (result.canceled) {
                        asyncResult.resolve();
                    }
                    else {
                        _this._recordingManager.generateBusinessProcessModelPackage(result.data).done(function (url) {
                            _this._saveFile(url).done(function () {
                                asyncResult.resolve();
                            }).fail(function (errors) {
                                asyncResult.reject(errors);
                            });
                        }).fail(function (errors) {
                            asyncResult.reject(errors);
                        });
                    }
                }).fail(function (errors) {
                    asyncResult.reject(errors);
                });
                return asyncResult.always(function () {
                    _this._inProgress = false;
                });
            };
            UserActivityRecorderManagerBase.prototype.saveSessionAsRecordingBundle = function (correlationId) {
                var _this = this;
                if (this._inProgress) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_BUSY)]);
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.activeSession())) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_NO_ACTIVE_SESSION)]);
                }
                var asyncQueue = new Commerce.AsyncQueue();
                this._inProgress = true;
                var savingRecording;
                asyncQueue.enqueue(function () {
                    return asyncQueue.cancelOn(_this.activeSession().getRecordingAsync())
                        .done(function (result) {
                        if (!result.canceled) {
                            savingRecording = result.data;
                        }
                    });
                });
                asyncQueue.enqueue(function () {
                    return _this.saveRecordingAsRecordingBundle(savingRecording);
                });
                return asyncQueue.run().always(function () {
                    _this._inProgress = false;
                });
            };
            UserActivityRecorderManagerBase.prototype.saveRecordingAsRecordingBundle = function (recording) {
                var _this = this;
                var asyncQueue = new Commerce.AsyncQueue();
                var savingUrl;
                asyncQueue.enqueue(function () {
                    return _this._recordingManager.generateRecordingBundle(recording).done(function (url) {
                        savingUrl = url;
                    });
                });
                asyncQueue.enqueue(function () {
                    return _this._saveFile(savingUrl);
                });
                return asyncQueue.run();
            };
            UserActivityRecorderManagerBase.prototype.saveToLifecycleServices = function (correlationId) {
                var _this = this;
                if (this._inProgress) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_BUSY)]);
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.activeSession())) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_NO_ACTIVE_SESSION)]);
                }
                this._inProgress = true;
                var asyncResult = Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.NOT_IMPLEMENTED)]);
                return asyncResult.always(function () {
                    _this._inProgress = false;
                });
            };
            UserActivityRecorderManagerBase.prototype.saveSessionAsWordDocument = function (correlationId) {
                var _this = this;
                if (this._inProgress) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_BUSY)]);
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.activeSession())) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_NO_ACTIVE_SESSION)]);
                }
                var asyncQueue = new Commerce.AsyncQueue();
                this._inProgress = true;
                var savingRecording;
                asyncQueue.enqueue(function () {
                    return asyncQueue.cancelOn(_this.activeSession().getRecordingAsync())
                        .done(function (result) {
                        if (!result.canceled) {
                            savingRecording = result.data;
                        }
                    });
                });
                asyncQueue.enqueue(function () {
                    return _this.saveRecordingAsWordDocument(correlationId, savingRecording);
                });
                return asyncQueue.run().always(function () {
                    _this._inProgress = false;
                });
            };
            UserActivityRecorderManagerBase.prototype.saveRecordingAsWordDocument = function (correlationId, recording) {
                var _this = this;
                var asyncQueue = new Commerce.AsyncQueue();
                var savingUrl;
                asyncQueue.enqueue(function () {
                    return _this._recordingManager.generateTrainingDocument(recording).done(function (url) {
                        savingUrl = url;
                    });
                });
                asyncQueue.enqueue(function () {
                    return _this._saveFile(savingUrl);
                });
                return asyncQueue.run();
            };
            UserActivityRecorderManagerBase.prototype.downloadRecording = function (bpmLineId) {
                var _this = this;
                var asyncResult = new Commerce.AsyncResult();
                this._recordingManager.downloadRecording(bpmLineId).done(function (recording) {
                    try {
                        asyncResult.resolve(new ViewModel.TaskRecorderSessionViewModel(_this.context, recording));
                    }
                    catch (error) {
                        asyncResult.reject([
                            new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_COULDNT_DOWNLOAD_RECORDING, false, Commerce.StringExtensions.EMPTY, [Commerce.NumberExtensions.formatNumber(bpmLineId, 0), Commerce.Framework.ErrorConverter.serializeError(error)])
                        ]);
                    }
                }).fail(function (errors) {
                    asyncResult.reject(errors);
                });
                return asyncResult;
            };
            UserActivityRecorderManagerBase.prototype.cancelSession = function () {
                if (this._inProgress) {
                    throw new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_BUSY);
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.activeSession())) {
                    this.activeSession().dispose();
                    this.activeSession(null);
                }
            };
            UserActivityRecorderManagerBase.prototype.enableScreenCapture = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.activeSession())) {
                    throw new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_NO_ACTIVE_SESSION);
                }
                window.addEventListener("screenshot", this._takeScreenshotListener, true);
                this.activeSession().isScreenshotsCapturingEnabled(true);
            };
            UserActivityRecorderManagerBase.prototype.disableScreenCapture = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this.activeSession())) {
                    throw new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_NO_ACTIVE_SESSION);
                }
                window.removeEventListener("screenshot", this._takeScreenshotListener, true);
                this.activeSession().isScreenshotsCapturingEnabled(false);
            };
            UserActivityRecorderManagerBase.prototype.isRecordingActive = function () {
                var session = this.activeSession();
                if (Commerce.ObjectExtensions.isNullOrUndefined(session)) {
                    return false;
                }
                var sessionState = session.state();
                var recordingStates = [UserActivityRecorder.UserActivityRecorderState.Recording,
                    UserActivityRecorder.UserActivityRecorderState.RecordingPaused,
                    UserActivityRecorder.UserActivityRecorderState.Validating,
                    UserActivityRecorder.UserActivityRecorderState.ValidationPaused];
                return (recordingStates.indexOf(sessionState) >= 0);
            };
            UserActivityRecorderManagerBase.prototype.loadConfigurationAsync = function () {
                return Commerce.VoidAsyncResult.createResolved();
            };
            UserActivityRecorderManagerBase.prototype._takeScreenshotAsync = function (sessionId, stepId) {
                var _this = this;
                var correlationId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                var request = new Commerce.TaskRecorder.TakeTaskRecorderScreenshotClientRequest(correlationId, sessionId, stepId);
                return this.context.runtime.executeAsync(request)
                    .then(function (result) {
                    if (result.canceled || Commerce.StringExtensions.isEmpty(result.data.screenshotUri)) {
                        throw new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_COULDNT_TAKE_SCREENSHOT);
                    }
                    _this.activeSession().updateScreenshotUri(stepId, result.data.screenshotUri);
                }).catch(function (reason) {
                    var errors = [new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.USER_ACTIVITY_RECORDER_MANAGER_COULDNT_TAKE_SCREENSHOT)];
                    var showErrorsRequest = new Commerce.Framework.ShowErrorMessageClientRequest(_this.CorrelationId, errors);
                    _this.context.runtime.executeAsync(showErrorsRequest);
                });
            };
            UserActivityRecorderManagerBase.prototype._saveFile = function (url) {
                var correlationId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                var downloadRequest = new Commerce.TaskRecorder.DownloadTaskRecorderFileClientRequest(correlationId, url);
                return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(downloadRequest))
                    .done(function (result) {
                    if (result.canceled) {
                        Commerce.RetailLogger.taskRecorderSavingFileCanceled(url);
                    }
                    else {
                        Commerce.RetailLogger.taskRecorderSaveFileFinished(url);
                    }
                }).fail(function (errors) {
                    Commerce.RetailLogger.taskRecorderSavingFileFailed(Commerce.Framework.ErrorConverter.serializeError(errors));
                });
            };
            return UserActivityRecorderManagerBase;
        }());
        UserActivityRecorder.UserActivityRecorderManagerBase = UserActivityRecorderManagerBase;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        var Utilities;
        (function (Utilities) {
            "use strict";
            var RecordingFactory = (function () {
                function RecordingFactory() {
                }
                RecordingFactory.createNew = function (name, description) {
                    var rootScope = RecordingFactory.createNewScope(Commerce.Utilities.GuidHelper.newGuid(), name, null, UserActivityRecorder.ScopeType.Public);
                    var recording = {
                        Name: name,
                        Description: description,
                        RootScope: rootScope
                    };
                    recording[this.oDataPropertyName] = Commerce.Proxy.Entities.TaskRecorderODataType.recording;
                    return recording;
                };
                RecordingFactory.createNewScope = function (id, name, description, scopeType) {
                    var scope = {
                        Id: id,
                        Name: name,
                        Description: description,
                        ScopeTypeValue: scopeType,
                        ActiveCount: 0,
                        Children: []
                    };
                    scope[this.oDataPropertyName] = Commerce.Proxy.Entities.TaskRecorderODataType.scope;
                    return scope;
                };
                RecordingFactory.createNewTask = function (id, name, comment, description, taskType) {
                    var task = {
                        Id: id,
                        TaskId: id,
                        Name: name,
                        Description: description,
                        Comment: comment,
                        UserActionTypeValue: taskType
                    };
                    task[this.oDataPropertyName] = Commerce.Proxy.Entities.TaskRecorderODataType.taskUserAction;
                    return task;
                };
                RecordingFactory.createNewCommand = function (id, name, description, notes, screenshotUri, stepInfo, controlName, controlType, formId) {
                    var command = {
                        Id: id,
                        CommandName: name,
                        Description: description,
                        ReturnTypeValue: 0,
                        Annotations: [],
                        ScreenshotUri: screenshotUri,
                        Arguments: [],
                        ControlName: controlName,
                        ControlType: controlType,
                        FormId: formId
                    };
                    if (!Commerce.StringExtensions.isNullOrWhitespace(notes)) {
                        command.Annotations.push(this.createNewAnnotation(notes));
                    }
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(stepInfo) && !jQuery.isEmptyObject(stepInfo)) {
                        command.Arguments.push({
                            IsReference: false,
                            Value: JSON.stringify(stepInfo)
                        });
                    }
                    command[this.oDataPropertyName] = Commerce.Proxy.Entities.TaskRecorderODataType.commandUserAction;
                    return command;
                };
                RecordingFactory.createNewValidation = function (id, name, description, stepInfo, controlName, controlType, formId) {
                    var validation = new Commerce.UserActivityRecorder.ValidationStep(id, name, description, stepInfo, controlName, controlType, formId);
                    return validation;
                };
                RecordingFactory.createNewStartRecordingStep = function (version, id, context, layoutId, layoutResolutionHeight, layoutResolutionWidth) {
                    var startRecordingStep = new Commerce.UserActivityRecorder.StartRecordingStep(context, version, id, layoutId, layoutResolutionHeight, layoutResolutionWidth);
                    return startRecordingStep;
                };
                RecordingFactory.createNewAnnotation = function (description) {
                    var annotation = {
                        Description: description
                    };
                    annotation[this.oDataPropertyName] = Commerce.Proxy.Entities.TaskRecorderODataType.annotation;
                    return annotation;
                };
                RecordingFactory.createFormContextDictionaryEntry = function (formId, formName, recordingName, sequence) {
                    return {
                        FormId: formId,
                        FormContext: {
                            FormID: formId,
                            FormName: formName,
                            RecordingName: recordingName,
                            Sequence: sequence
                        }
                    };
                };
                RecordingFactory.oDataPropertyName = "@odata.type";
                return RecordingFactory;
            }());
            Utilities.RecordingFactory = RecordingFactory;
        })(Utilities = UserActivityRecorder.Utilities || (UserActivityRecorder.Utilities = {}));
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var DOMHelper = (function () {
        function DOMHelper() {
        }
        DOMHelper.firstCurrentOrAncestorById = function (element, id) {
            if (Commerce.StringExtensions.isNullOrWhitespace(id)) {
                return null;
            }
            return this.firstCurrentOrAncestorByAnyId(element, [id]);
        };
        DOMHelper.firstCurrentOrAncestorByAnyId = function (element, ids) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(element) || (!(element instanceof Element)) || !Commerce.ArrayExtensions.hasElements(ids)) {
                return null;
            }
            var foundElement = null;
            var currentElement = element;
            while (!Commerce.ObjectExtensions.isNullOrUndefined(currentElement) && Commerce.ObjectExtensions.isNullOrUndefined(foundElement)) {
                if (ids.indexOf(currentElement.id) >= 0) {
                    foundElement = currentElement;
                    break;
                }
                currentElement = currentElement.parentElement;
            }
            return foundElement;
        };
        DOMHelper.firstCurrentOrAncestorByClass = function (element, className) {
            if (Commerce.StringExtensions.isNullOrWhitespace(className)) {
                return null;
            }
            return this.firstCurrentOrAncestorByAnyClass(element, [className]);
        };
        DOMHelper.firstCurrentOrAncestorByAnyClass = function (element, classNames) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(element) || !Commerce.ArrayExtensions.hasElements(classNames)) {
                return null;
            }
            var foundElement = null;
            var currentElement = element;
            while (!Commerce.ObjectExtensions.isNullOrUndefined(currentElement) && Commerce.ObjectExtensions.isNullOrUndefined(foundElement)) {
                var hasClassName = classNames.some(function (className) {
                    return currentElement.classList.contains(className);
                });
                if (hasClassName) {
                    foundElement = currentElement;
                    break;
                }
                currentElement = currentElement.parentElement;
            }
            return foundElement;
        };
        DOMHelper.firstCurrentOrAncestorByNodeName = function (element, nodeName) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(element)) {
                return null;
            }
            if (Commerce.StringExtensions.isNullOrWhitespace(nodeName)) {
                return null;
            }
            nodeName = nodeName.toLowerCase();
            var foundElement = null;
            var currentElement = element;
            while (!Commerce.ObjectExtensions.isNullOrUndefined(currentElement) && Commerce.ObjectExtensions.isNullOrUndefined(foundElement)) {
                if (currentElement.nodeName.toLowerCase() === nodeName) {
                    foundElement = currentElement;
                }
                currentElement = currentElement.parentElement;
            }
            return foundElement;
        };
        DOMHelper.getAttributeValue = function (element, attributeName) {
            var attributeValue = null;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(element) && !Commerce.StringExtensions.isNullOrWhitespace(attributeName)) {
                attributeValue = element.getAttribute(attributeName);
                if (Commerce.StringExtensions.isNullOrWhitespace(attributeValue)) {
                    attributeValue = null;
                }
            }
            return attributeValue;
        };
        DOMHelper.getLocalizedElementName = function (context, name, elementAttributeTypeName) {
            if (Commerce.StringExtensions.isNullOrWhitespace(name)) {
                return name;
            }
            var localizedElementName = Commerce.StringExtensions.EMPTY;
            name = name.toLowerCase();
            if ((name === "input") && (!Commerce.StringExtensions.isNullOrWhitespace(elementAttributeTypeName))) {
                elementAttributeTypeName = elementAttributeTypeName.toLowerCase();
                var elementInputTypeNameResourceMapping = DOMHelper.getLocalizedInputElementTypeNameMappings();
                if (elementInputTypeNameResourceMapping.hasItem(elementAttributeTypeName)) {
                    localizedElementName = context.stringResourceManager.getString(elementInputTypeNameResourceMapping.getItem(elementAttributeTypeName));
                }
            }
            if (Commerce.StringExtensions.isNullOrWhitespace(localizedElementName)) {
                var elementNameResourceMapping = DOMHelper.getLocalizedElementNameMappings();
                if (elementNameResourceMapping.hasItem(name)) {
                    localizedElementName = context.stringResourceManager.getString(elementNameResourceMapping.getItem(name));
                }
                else {
                    localizedElementName = name;
                }
            }
            return localizedElementName;
        };
        DOMHelper.getLocalizedElementNameMappings = function () {
            if (Commerce.ObjectExtensions.isNullOrUndefined(DOMHelper._elementNameResourceMapping)) {
                DOMHelper._elementNameResourceMapping = new Commerce.Dictionary();
                DOMHelper._elementNameResourceMapping.setItem("button", "string_10600");
                DOMHelper._elementNameResourceMapping.setItem("datalist", "string_10601");
                DOMHelper._elementNameResourceMapping.setItem("fieldset", "string_10602");
                DOMHelper._elementNameResourceMapping.setItem("form", "string_10603");
                DOMHelper._elementNameResourceMapping.setItem("input", "string_10604");
                DOMHelper._elementNameResourceMapping.setItem("label", "string_10605");
                DOMHelper._elementNameResourceMapping.setItem("legend", "string_10606");
                DOMHelper._elementNameResourceMapping.setItem("meter", "string_10607");
                DOMHelper._elementNameResourceMapping.setItem("option", "string_10608");
                DOMHelper._elementNameResourceMapping.setItem("output", "string_10609");
                DOMHelper._elementNameResourceMapping.setItem("progress", "string_10610");
                DOMHelper._elementNameResourceMapping.setItem("select", "string_10611");
                DOMHelper._elementNameResourceMapping.setItem("textarea", "string_10612");
                DOMHelper._elementNameResourceMapping.setItem("link", "string_10613");
                DOMHelper._elementNameResourceMapping.setItem("div", "string_10614");
                DOMHelper._elementNameResourceMapping.setItem("h1", "string_10615");
                DOMHelper._elementNameResourceMapping.setItem("h2", "string_10616");
                DOMHelper._elementNameResourceMapping.setItem("h3", "string_10617");
                DOMHelper._elementNameResourceMapping.setItem("h4", "string_10618");
                DOMHelper._elementNameResourceMapping.setItem("h5", "string_10619");
                DOMHelper._elementNameResourceMapping.setItem("h6", "string_10620");
                DOMHelper._elementNameResourceMapping.setItem("header", "string_10621");
                DOMHelper._elementNameResourceMapping.setItem("address", "string_10622");
                DOMHelper._elementNameResourceMapping.setItem("area", "string_10623");
                DOMHelper._elementNameResourceMapping.setItem("table", "string_10624");
                DOMHelper._elementNameResourceMapping.setItem("th", "string_10625");
                DOMHelper._elementNameResourceMapping.setItem("td", "string_10626");
                DOMHelper._elementNameResourceMapping.setItem("video", "string_10627");
            }
            return DOMHelper._elementNameResourceMapping;
        };
        DOMHelper.getLocalizedInputElementTypeNameMappings = function () {
            if (Commerce.ObjectExtensions.isNullOrUndefined(DOMHelper._inputElementTypeNameResourceMapping)) {
                DOMHelper._inputElementTypeNameResourceMapping = new Commerce.Dictionary();
                DOMHelper._inputElementTypeNameResourceMapping.setItem("button", "string_10650");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("checkbox", "string_10651");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("color", "string_10652");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("date", "string_10653");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("datetime", "string_10654");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("datetime-local", "string_10655");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("email", "string_10656");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("file", "string_10657");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("hidden", "string_10658");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("image", "string_10659");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("month", "string_10660");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("number", "string_10661");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("password", "string_10662");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("radio", "string_10663");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("range", "string_10664");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("reset", "string_10665");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("search", "string_10666");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("submit", "string_10667");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("text", "string_10668");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("time", "string_10669");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("url", "string_10670");
                DOMHelper._inputElementTypeNameResourceMapping.setItem("week", "string_10671");
            }
            return DOMHelper._inputElementTypeNameResourceMapping;
        };
        return DOMHelper;
    }());
    Commerce.DOMHelper = DOMHelper;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var Stopwatch = (function () {
            function Stopwatch() {
                this.reset();
            }
            Object.defineProperty(Stopwatch.prototype, "timeElapsedInMilliseconds", {
                get: function () {
                    var timeElapsed = 0;
                    if (this._startTime <= 0) {
                        timeElapsed = 0;
                    }
                    else if (this._stopTime <= 0) {
                        timeElapsed = window.performance.now() - this._startTime;
                    }
                    else {
                        timeElapsed = this._stopTime - this._startTime;
                    }
                    return timeElapsed;
                },
                enumerable: true,
                configurable: true
            });
            Stopwatch.prototype.start = function () {
                if (this._startTime <= 0) {
                    this._startTime = window.performance.now();
                }
                else if (this._stopTime > 0) {
                    var timePaused = this.getTimeStopped();
                    this._startTime += timePaused;
                }
                this._stopTime = 0;
            };
            Stopwatch.prototype.stop = function () {
                if (this._stopTime <= 0) {
                    this._stopTime = window.performance.now();
                }
            };
            Stopwatch.prototype.reset = function () {
                this._startTime = 0;
                this._stopTime = 0;
            };
            Stopwatch.prototype.getTimeStopped = function () {
                var timeStopped = 0;
                if (this._stopTime > 0) {
                    var currentTime = window.performance.now();
                    timeStopped = currentTime - this._stopTime;
                }
                return timeStopped;
            };
            return Stopwatch;
        }());
        UserActivityRecorder.Stopwatch = Stopwatch;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var RecorderListenerType;
        (function (RecorderListenerType) {
            RecorderListenerType[RecorderListenerType["Recording"] = 0] = "Recording";
            RecorderListenerType[RecorderListenerType["Validation"] = 1] = "Validation";
        })(RecorderListenerType = UserActivityRecorder.RecorderListenerType || (UserActivityRecorder.RecorderListenerType = {}));
        var UserActivityRecorderEventListenerBase = (function () {
            function UserActivityRecorderEventListenerBase(subscriber, context, eventStopwatch) {
                if (eventStopwatch === void 0) { eventStopwatch = null; }
                this.roleAttribute = "role";
                this.typeAttribute = "type";
                this.dataActionAttribute = "data-action";
                this.disabledAttribute = "disabled";
                this.ariaLabelAttribute = "aria-label";
                this.ariaLabelledbyAttribute = "aria-labelledby";
                this.dataAxActionAttribute = "data-ax-action";
                this.ariaCheckedAttribute = "aria-checked";
                this.middleMouseButtonWhichValue = 2;
                this.SENSITIVE_DATA_FOR_ATTRIBUTE_NAME = "sensitiveDataFor";
                this._userActivityRecorderBaseID = "taskRecorderHost";
                Commerce.ThrowIf.argumentIsNotObject(subscriber, "subscriber");
                this._areEventsInitialized = false;
                this._subscriber = subscriber;
                this.context = context;
                this.eventDictionary = new Commerce.Dictionary();
                this.lockKeyDown = false;
                if (Commerce.ObjectExtensions.isNullOrUndefined(eventStopwatch)) {
                    this._eventStopwatch = new UserActivityRecorder.Stopwatch();
                }
                else {
                    this._eventStopwatch = eventStopwatch;
                }
                this.MASKED_VALUE = this.context.stringResourceManager.getString("string_10413");
                this.MASKED_CHARACTER_VALUE = this.context.stringResourceManager.getString("string_10414");
            }
            UserActivityRecorderEventListenerBase.prototype.dispose = function () {
                this.stopListening();
            };
            UserActivityRecorderEventListenerBase.prototype.stopListening = function () {
                this.flushCachedEvents();
                this.removeEventListeners();
                this._eventStopwatch.stop();
            };
            UserActivityRecorderEventListenerBase.prototype.startListening = function () {
                this.initializeEvents();
                this._eventStopwatch.start();
                this.startListeningAdditionalBehavior();
            };
            Object.defineProperty(UserActivityRecorderEventListenerBase.prototype, "Subscriber", {
                get: function () {
                    return this._subscriber;
                },
                enumerable: true,
                configurable: true
            });
            UserActivityRecorderEventListenerBase.prototype.removeDerivedClassEventListeners = function () {
            };
            UserActivityRecorderEventListenerBase.prototype.startListeningAdditionalBehavior = function () {
            };
            UserActivityRecorderEventListenerBase.prototype.flushCachedEvents = function () {
            };
            UserActivityRecorderEventListenerBase.prototype.getTimeSinceLastEvent = function () {
                return this._eventStopwatch.timeElapsedInMilliseconds;
            };
            UserActivityRecorderEventListenerBase.prototype.addEventListener = function (eventName, listener) {
                window.addEventListener(eventName, listener, true);
                if (!this.eventDictionary.hasItem(eventName)) {
                    this.eventDictionary.setItem(eventName, []);
                }
                this.eventDictionary.getItem(eventName).push(listener);
            };
            UserActivityRecorderEventListenerBase.prototype.addStep = function (step) {
                this._subscriber.addStep(step);
                this.onStepCreated();
            };
            UserActivityRecorderEventListenerBase.prototype.onStepCreated = function () {
                this._eventStopwatch.reset();
                this._eventStopwatch.start();
            };
            UserActivityRecorderEventListenerBase.prototype.addView = function (viewName) {
                return this._subscriber.addView(viewName);
            };
            UserActivityRecorderEventListenerBase.prototype.isEventInControlToNotRecord = function (element) {
                if (!(element instanceof Element)) {
                    return false;
                }
                var classes = [
                    "dialog-loader",
                    "page-loader",
                    "testRecorderDisplayPanel"
                ];
                var ids = [
                    this._userActivityRecorderBaseID,
                    "tutorial-dialog"
                ];
                return !Commerce.ObjectExtensions.isNullOrUndefined(Commerce.DOMHelper.firstCurrentOrAncestorByAnyClass(element, classes)) ||
                    !Commerce.ObjectExtensions.isNullOrUndefined(Commerce.DOMHelper.firstCurrentOrAncestorByAnyId(element, ids));
            };
            UserActivityRecorderEventListenerBase.prototype.getXPath = function (element) {
                var path = Commerce.StringExtensions.EMPTY;
                if (Commerce.ObjectExtensions.isNullOrUndefined(element)) {
                    path = "/";
                }
                else if (!Commerce.StringExtensions.isNullOrWhitespace(element.id) &&
                    (element.id.toLowerCase().indexOf("element__") !== 0) &&
                    (element.id.toLowerCase().indexOf("_win_bind") !== 0)) {
                    path = "//" + element.nodeName + "[@id=\"" + element.id + "\"]";
                }
                else {
                    path = this.getXPath(element.parentElement);
                    var childIndex = $(element.parentNode).children(element.nodeName).index(element) + 1;
                    path += "/" + element.nodeName + "[" + childIndex.toString() + "]";
                }
                return path;
            };
            UserActivityRecorderEventListenerBase.prototype.getElementText = function (element) {
                var elementText = Commerce.StringExtensions.EMPTY;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(element)) {
                    var $element = $(element);
                    elementText = $element.contents().not($element.children()).text();
                    elementText = Commerce.ObjectExtensions.isNullOrUndefined(elementText) ? Commerce.StringExtensions.EMPTY : elementText;
                    elementText.trim();
                }
                return elementText;
            };
            UserActivityRecorderEventListenerBase.prototype.getFriendlyDescriptionForElement = function (element, allowSensitiveData) {
                if (allowSensitiveData === void 0) { allowSensitiveData = false; }
                if (Commerce.ObjectExtensions.isNullOrUndefined(element)) {
                    return null;
                }
                var friendlyDescription = Commerce.DOMHelper.getAttributeValue(element, "aria-label");
                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                    var elementIdWithLabel = Commerce.DOMHelper.getAttributeValue(element, "aria-labelledby");
                    if (!Commerce.StringExtensions.isNullOrWhitespace(elementIdWithLabel)) {
                        var $elementWithLabel = $("#" + elementIdWithLabel).first();
                        if ($elementWithLabel.length > 0) {
                            var elementWithLabel = $elementWithLabel[0];
                            friendlyDescription = this.getElementText(elementWithLabel);
                        }
                    }
                }
                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                    if (!Commerce.StringExtensions.isNullOrWhitespace(element.id)) {
                        var $labels = $("label[for='" + element.id + "']");
                        if ($labels.length > 0) {
                            var label = $labels[0];
                            friendlyDescription = this.getElementText(label);
                        }
                    }
                }
                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                    var elementTitle = Commerce.DOMHelper.getAttributeValue(element, "title");
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(elementTitle)) {
                        friendlyDescription = elementTitle;
                    }
                }
                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                    if (allowSensitiveData || !this.doesElementHaveSensitiveData(element)) {
                        var textElements = ["label", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "caption", "p", "q", "s", "title"];
                        if (textElements.indexOf(element.nodeName.toLowerCase()) >= 0) {
                            friendlyDescription = this.getElementText(element);
                        }
                    }
                }
                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                    var parentElement = element.parentElement;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(parentElement)) {
                        if (parentElement.nodeName.toLowerCase() === "label") {
                            friendlyDescription = this.getFriendlyDescriptionForElement(parentElement);
                        }
                    }
                }
                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                    if (allowSensitiveData || !this.doesElementHaveSensitiveData(element)) {
                        switch (element.nodeName.toLowerCase()) {
                            case "button":
                                friendlyDescription = Commerce.DOMHelper.getAttributeValue(element, "value");
                                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                                    if (element instanceof HTMLElement) {
                                        friendlyDescription = element.innerText.trim();
                                    }
                                }
                                break;
                            case "div":
                                var parentElement = element.parentElement;
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(parentElement)) {
                                    var elementsWithValueAttributes = ["button", "input"];
                                    if (elementsWithValueAttributes.indexOf(parentElement.nodeName.toLowerCase()) >= 0) {
                                        friendlyDescription = this.getFriendlyDescriptionForElement(parentElement);
                                    }
                                }
                                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                                    friendlyDescription = this.getElementText(element);
                                }
                                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                                    if (element.childElementCount === 1) {
                                        friendlyDescription = this.getFriendlyDescriptionForElement(element.firstElementChild);
                                    }
                                    else if (element.childElementCount > 1) {
                                        var children = Array.from(element.children);
                                        var childrenWithoutAriaLabelHidden = children.filter(function (childElement) {
                                            if (!Commerce.ObjectExtensions.isNullOrUndefined(childElement)) {
                                                var hiddenValue = Commerce.DOMHelper.getAttributeValue(childElement, "aria-hidden");
                                                return Commerce.StringExtensions.isNullOrWhitespace(hiddenValue) || (hiddenValue.toLowerCase() !== "true");
                                            }
                                            return false;
                                        });
                                        if (childrenWithoutAriaLabelHidden.length === 1) {
                                            return this.getFriendlyDescriptionForElement(childrenWithoutAriaLabelHidden[0]);
                                        }
                                    }
                                }
                                break;
                            case "img":
                                friendlyDescription = Commerce.DOMHelper.getAttributeValue(element, "alt");
                                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                                    friendlyDescription = this.getElementText(element);
                                }
                                break;
                            case "input":
                                if (this.isInputElementWithNonDefaultValueAttribute(element)) {
                                    friendlyDescription = Commerce.DOMHelper.getAttributeValue(element, "value");
                                }
                                break;
                            case "span":
                                friendlyDescription = this.getElementText(element);
                                if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                                    var ariaHiddenValue = Commerce.DOMHelper.getAttributeValue(element, "aria-hidden");
                                    if (ariaHiddenValue === "true") {
                                        friendlyDescription = this.getFriendlyDescriptionForElement(element.parentElement);
                                    }
                                }
                                break;
                            case "textarea":
                                if (element instanceof HTMLTextAreaElement) {
                                    friendlyDescription = element.value;
                                }
                                break;
                            default:
                                friendlyDescription = this.getElementText(element);
                                break;
                        }
                    }
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(friendlyDescription) && (friendlyDescription.length > 0)) {
                    friendlyDescription = friendlyDescription.replace("/\r|\n|\f|\t/", " ").trim();
                }
                return friendlyDescription;
            };
            UserActivityRecorderEventListenerBase.prototype.getSensitiveDataKey = function (element) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(element)) {
                    return null;
                }
                var key = null;
                var elementWithKeyId = element.getAttribute(this.SENSITIVE_DATA_FOR_ATTRIBUTE_NAME);
                if (!Commerce.StringExtensions.isNullOrWhitespace(elementWithKeyId)) {
                    var $elementWithKeyValue = $("#" + elementWithKeyId);
                    if ($elementWithKeyValue.length === 1) {
                        var elementWithKeyValue_1 = $elementWithKeyValue[0];
                        if ((elementWithKeyValue_1 instanceof HTMLInputElement) || (elementWithKeyValue_1 instanceof HTMLTextAreaElement)) {
                            key = elementWithKeyValue_1.value;
                        }
                        if (Commerce.StringExtensions.isNullOrWhitespace(key)) {
                            var textElements = ["label", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "caption", "p", "q", "s", "title"];
                            if (textElements.indexOf(elementWithKeyValue_1.nodeName.toLowerCase()) >= 0) {
                                key = this.getElementText(elementWithKeyValue_1);
                            }
                        }
                        if (Commerce.StringExtensions.isNullOrWhitespace(key)) {
                            if (elementWithKeyValue_1.nodeName.toLowerCase() === "div") {
                                var textClasses = ["h1", "h2", "h3", "h4", "h5", "h6"];
                                var isATextDiv = textClasses.some(function (textClass) {
                                    return elementWithKeyValue_1.classList.contains(textClass);
                                });
                                if (isATextDiv) {
                                    key = this.getElementText(elementWithKeyValue_1);
                                }
                            }
                        }
                        if (Commerce.StringExtensions.isNullOrWhitespace(key)) {
                            if (elementWithKeyValue_1 instanceof HTMLSelectElement) {
                                var $selectedElement = $(elementWithKeyValue_1).find("option:selected");
                                if ($selectedElement.length >= 1) {
                                    var selectElementWithKeyValue = $selectedElement[0];
                                    if (selectElementWithKeyValue instanceof HTMLOptionElement) {
                                        key = selectElementWithKeyValue.value;
                                        if (Commerce.StringExtensions.isNullOrWhitespace(key)) {
                                            key = selectElementWithKeyValue.label;
                                        }
                                    }
                                }
                            }
                        }
                        if (Commerce.StringExtensions.isNullOrWhitespace(key)) {
                            Commerce.RetailLogger.userActivityRecorderEventListenerBaseSensitiveDataElementIsNotSupportedAsSensitiveDataKey(this.Subscriber.CorrelationId, element.id, elementWithKeyValue_1.id, elementWithKeyValue_1.nodeName);
                        }
                    }
                    else if ($elementWithKeyValue.length > 1) {
                        Commerce.RetailLogger.userActivityRecorderEventListenerBaseSensitiveDataKeyMultipleElementsFound(this.Subscriber.CorrelationId, element.id, elementWithKeyId, $elementWithKeyValue.length);
                    }
                    else {
                        Commerce.RetailLogger.userActivityRecorderEventListenerBaseSensitiveDataKeyElementWasNotFound(this.Subscriber.CorrelationId, element.id, elementWithKeyId);
                    }
                }
                return key;
            };
            UserActivityRecorderEventListenerBase.prototype.doesElementHaveSensitiveData = function (element) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(element)) {
                    return false;
                }
                var sensitiveDataForAttributeValue = element.getAttribute(this.SENSITIVE_DATA_FOR_ATTRIBUTE_NAME);
                var doesElementHaveSensitiveData = !Commerce.StringExtensions.isNullOrWhitespace(sensitiveDataForAttributeValue);
                if (!doesElementHaveSensitiveData) {
                    if (element.nodeName.toLowerCase() === "input") {
                        var elementType = Commerce.DOMHelper.getAttributeValue(element, "type");
                        if (elementType === "password") {
                            doesElementHaveSensitiveData = true;
                        }
                    }
                }
                return doesElementHaveSensitiveData;
            };
            UserActivityRecorderEventListenerBase.prototype.getAXBubbleElementValue = function (element) {
                return Commerce.DOMHelper.getAttributeValue(element, "data-ax-bubble");
            };
            UserActivityRecorderEventListenerBase.prototype.getAdditionalControlIdentifiers = function (element) {
                var additionalControlIdentifiers = [];
                var axBubbleAttr = this.getAXBubbleElementValue(element);
                if (!Commerce.StringExtensions.isNullOrWhitespace(axBubbleAttr)) {
                    additionalControlIdentifiers.push({
                        name: "AXBubbleAttr",
                        value: axBubbleAttr
                    });
                }
                return additionalControlIdentifiers;
            };
            UserActivityRecorderEventListenerBase.prototype.isEventInSelect = function (event) {
                var isEventInSelect = false;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(event) && event.target instanceof Element) {
                    isEventInSelect = !Commerce.ObjectExtensions.isNullOrUndefined(Commerce.DOMHelper.firstCurrentOrAncestorByNodeName(event.target, "select"));
                }
                return isEventInSelect;
            };
            UserActivityRecorderEventListenerBase.prototype.getSelectedOption = function (element) {
                var selectedOption = null;
                if (element instanceof HTMLSelectElement) {
                    var $selectedElement = $(element).find("option:selected");
                    if ($selectedElement.length >= 1) {
                        element = $selectedElement[0];
                    }
                    if (element instanceof HTMLOptionElement) {
                        selectedOption = element;
                    }
                }
                return selectedOption;
            };
            UserActivityRecorderEventListenerBase.prototype.isMiddleButtonClicked = function (event) {
                var isMiddleMouseButtonClicked = Commerce.ArrayExtensions.hasElement(["mousedown", "mouseup", "pointerdown", "pointerup", "click"], event.type, function (left, right) { return Commerce.StringExtensions.compare(left, right, true) === 0; }) &&
                    Commerce.NumberExtensions.compare(event.which, this.middleMouseButtonWhichValue) === 0;
                return isMiddleMouseButtonClicked;
            };
            UserActivityRecorderEventListenerBase.prototype.removeEventListeners = function () {
                this.removeBaseEventListeners();
                this.removeDerivedClassEventListeners();
                this._areEventsInitialized = false;
            };
            UserActivityRecorderEventListenerBase.prototype.removeBaseEventListeners = function () {
                this.eventDictionary.forEach(function (name, listeners) {
                    listeners.forEach(function (listener) {
                        window.removeEventListener(name, listener, true);
                    });
                });
                this.eventDictionary.clear();
            };
            UserActivityRecorderEventListenerBase.prototype.isInputElementWithNonDefaultValueAttribute = function (element) {
                var isInputElementWithNonDefaultValueAttribute = false;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(element)) {
                    if (element.nodeName.toLowerCase() === "input") {
                        var inputTypesWithNonDefaultValueAttributes = ["button", "reset", "submit", "checkbox", "radio", "image"];
                        var inputType = Commerce.DOMHelper.getAttributeValue(element, "type");
                        if (!Commerce.StringExtensions.isNullOrWhitespace(inputType)) {
                            inputType = inputType.toLowerCase();
                        }
                        isInputElementWithNonDefaultValueAttribute = inputTypesWithNonDefaultValueAttributes.indexOf(inputType) >= 0;
                    }
                }
                return isInputElementWithNonDefaultValueAttribute;
            };
            UserActivityRecorderEventListenerBase.prototype.initializeEvents = function () {
                if (!this._areEventsInitialized) {
                    this._areEventsInitialized = true;
                    this.subscribeToGlobalEvents();
                }
            };
            UserActivityRecorderEventListenerBase.VERSION = 2;
            return UserActivityRecorderEventListenerBase;
        }());
        UserActivityRecorder.UserActivityRecorderEventListenerBase = UserActivityRecorderEventListenerBase;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
        })(ViewModel = TaskRecorder.ViewModel || (TaskRecorder.ViewModel = {}));
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var TaskRecorderViewModelBase = (function () {
                function TaskRecorderViewModelBase() {
                }
                return TaskRecorderViewModelBase;
            }());
            ViewModel.TaskRecorderViewModelBase = TaskRecorderViewModelBase;
        })(ViewModel = TaskRecorder.ViewModel || (TaskRecorder.ViewModel = {}));
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var TaskRecorderTaskViewModel = (function (_super) {
                __extends(TaskRecorderTaskViewModel, _super);
                function TaskRecorderTaskViewModel(context, model, beginTaskViewModel) {
                    var _this = _super.call(this) || this;
                    Commerce.ThrowIf.argumentIsNotObject(context, "context");
                    Commerce.ThrowIf.argumentIsNotObject(model, "model");
                    _this._context = context;
                    _this.id = model.Id;
                    _this.sequence = ko.observable(model.Sequence);
                    _this.parent = ko.observable(null);
                    _this.taskType = model.UserActionTypeValue;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(beginTaskViewModel)) {
                        _this.name = ko.observable(model.Name);
                        _this.comment = ko.observable(model.Comment);
                    }
                    else {
                        _this.name = beginTaskViewModel.name;
                        _this.comment = beginTaskViewModel.comment;
                    }
                    _this.displayNumber = ko.computed(function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(_this.sequence())) {
                            return Commerce.StringExtensions.EMPTY;
                        }
                        if (Commerce.ObjectExtensions.isNullOrUndefined(_this.parent())) {
                            return _this.sequence().toString();
                        }
                        return _this.parent().displayNumber() + "." + _this.sequence().toString();
                    }, _this);
                    _this.description = ko.computed(function () {
                        var taskPrefix = _this.taskType === Commerce.UserActivityRecorder.TaskRecorderTaskType.Begin ?
                            _this._context.stringResourceManager.getString("string_10098") : _this._context.stringResourceManager.getString("string_10099");
                        return taskPrefix + _this.name();
                    });
                    _this.editable = (_this.taskType === Commerce.UserActivityRecorder.TaskRecorderTaskType.Begin);
                    _this.deletable = false;
                    _this.numberable = true;
                    _this.oDataClass = Commerce.Proxy.Entities.TaskRecorderODataType.taskUserAction;
                    return _this;
                }
                TaskRecorderTaskViewModel.prototype.toModel = function () {
                    return Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewTask(this.id, this.name(), this.comment(), this.description(), this.taskType);
                };
                return TaskRecorderTaskViewModel;
            }(ViewModel.TaskRecorderViewModelBase));
            ViewModel.TaskRecorderTaskViewModel = TaskRecorderTaskViewModel;
        })(ViewModel = TaskRecorder.ViewModel || (TaskRecorder.ViewModel = {}));
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var NodeType;
            (function (NodeType) {
                NodeType[NodeType["none"] = 0] = "none";
                NodeType[NodeType["scope"] = 1] = "scope";
                NodeType[NodeType["taskUserAction"] = 2] = "taskUserAction";
                NodeType[NodeType["userAction"] = 3] = "userAction";
            })(NodeType || (NodeType = {}));
            var TaskRecorderSessionViewModel = (function () {
                function TaskRecorderSessionViewModel(context, model) {
                    var _this = this;
                    Commerce.ThrowIf.argumentIsNotObject(model, "model");
                    Commerce.ThrowIf.argumentIsNotObject(context, "context");
                    this._viewContextsByViewId = new Commerce.Dictionary();
                    this._context = context;
                    this.name = ko.observable(model.Name);
                    this.description = ko.observable(model.Description);
                    this.activeTask = ko.observable(null);
                    this.nodes = ko.observableArray([]);
                    this.resetSequence();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(model.FormContextEntries)) {
                        model.FormContextEntries.forEach(function (formContextDictionaryEntry) {
                            _this.addViewToDictionary(formContextDictionaryEntry.FormContext.FormID, formContextDictionaryEntry.FormContext.FormName);
                        });
                    }
                    this.parseRecording(model.RootScope);
                }
                Object.defineProperty(TaskRecorderSessionViewModel.prototype, "numberNodes", {
                    get: function () {
                        return this.nodes().length;
                    },
                    enumerable: true,
                    configurable: true
                });
                TaskRecorderSessionViewModel.prototype.startTask = function (taskViewModel) {
                    taskViewModel.parent(this.activeTask());
                    taskViewModel.sequence(this.getNextSequence());
                    this.nodes.push(taskViewModel);
                    this.activeTask(taskViewModel);
                    this.resetSequence();
                };
                TaskRecorderSessionViewModel.prototype.endTask = function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this.activeTask())) {
                        throw new Commerce.Proxy.Entities.Error(Commerce.UserActivityRecorder.ErrorCodes.TASK_RECORDER_SESSION_NO_ACTIVE_TASK);
                    }
                    var task = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewTask(Commerce.Utilities.GuidHelper.newGuid(), null, null, null, Commerce.UserActivityRecorder.TaskRecorderTaskType.End);
                    var taskViewModel = new ViewModel.TaskRecorderTaskViewModel(this._context, task, this.activeTask());
                    taskViewModel.parent(this.activeTask());
                    taskViewModel.sequence(this.getNextSequence());
                    this.nodes.push(taskViewModel);
                    this.activeTask((this.activeTask().parent()));
                    this.restoreSequence();
                    this.scrollDown();
                };
                TaskRecorderSessionViewModel.prototype.addView = function (viewName) {
                    var viewId = this.findView(viewName);
                    if (!Commerce.StringExtensions.isNullOrWhitespace(viewId)) {
                        return viewId;
                    }
                    viewId = this.generateViewId(viewName);
                    this.addViewToDictionary(viewId, viewName);
                    return viewId;
                };
                TaskRecorderSessionViewModel.prototype.addStep = function (stepViewModel) {
                    stepViewModel.parent(this.activeTask());
                    if (stepViewModel.numberable) {
                        stepViewModel.sequence(this.getNextSequence());
                    }
                    else {
                        stepViewModel.sequence(Number.NaN);
                    }
                    this.nodes.push(stepViewModel);
                    this.scrollDown();
                };
                TaskRecorderSessionViewModel.prototype.getNode = function (index) {
                    var nodes = this.nodes();
                    if ((index >= 0) || (index < this.numberNodes)) {
                        return nodes[index];
                    }
                    return null;
                };
                TaskRecorderSessionViewModel.prototype.replaceNode = function (index, node) {
                    var nodes = this.nodes();
                    if ((index < 0) || (index >= this.numberNodes)) {
                        return false;
                    }
                    var indexOfNodeInList = nodes.lastIndexOf(node);
                    if (indexOfNodeInList >= 0) {
                        return false;
                    }
                    node.parent(nodes[index].parent());
                    node.sequence(nodes[index].sequence());
                    this.nodes.splice(index, 1, node);
                    return true;
                };
                TaskRecorderSessionViewModel.prototype.deleteNode = function (nodeId) {
                    var _this = this;
                    var nodeArray = this.nodes();
                    var nodesThatMatchId = nodeArray.filter(function (value) {
                        return value.id === nodeId;
                    });
                    nodesThatMatchId.forEach(function (value) {
                        if (!isNaN(value.sequence())) {
                            var sequenceIdOfNodeToRemove = value.sequence();
                            var parentOfNodeToRemove = Commerce.ObjectExtensions.isNullOrUndefined(value.parent()) ? null : value.parent();
                            var valueIndex = nodeArray.indexOf(value);
                            for (var index = valueIndex + 1; index < nodeArray.length; index++) {
                                var currentNode = nodeArray[index];
                                if (!isNaN(currentNode.sequence()) && (currentNode.parent() === parentOfNodeToRemove)) {
                                    if (currentNode.sequence() >= sequenceIdOfNodeToRemove) {
                                        currentNode.sequence(currentNode.sequence() - 1);
                                    }
                                }
                            }
                        }
                        _this.nodes.remove(value);
                    });
                    this.restoreSequence();
                };
                TaskRecorderSessionViewModel.prototype.scrollDown = function () {
                    var listSteps = document.getElementsByClassName(TaskRecorderSessionViewModel.LIST_STEPS_CLASS_NAME);
                    if (listSteps.length === 0) {
                        return;
                    }
                    listSteps[0].scrollTop = listSteps[0].scrollHeight;
                };
                TaskRecorderSessionViewModel.prototype.toModel = function () {
                    var recording = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNew(this.name(), this.description());
                    recording.RootScope.Sequence = 0;
                    recording.FormContextEntries = [];
                    this._currentNodeIndex = 0;
                    this._currentModelSequence = 0;
                    this.buildRecording(recording, recording.RootScope);
                    return recording;
                };
                TaskRecorderSessionViewModel.prototype.buildRecording = function (recording, currentScope) {
                    var _loop_1 = function () {
                        var node = this_1.nodes()[this_1._currentNodeIndex];
                        this_1._currentNodeIndex++;
                        var dataModel = node.toModel();
                        dataModel.Sequence = ++this_1._currentModelSequence;
                        dataModel.ParentScopeId = currentScope.Id;
                        dataModel.ParentSequence = currentScope.Sequence;
                        currentScope.Children.push(dataModel);
                        if (node.oDataClass !== Commerce.Proxy.Entities.TaskRecorderODataType.commandUserAction) {
                            if (node.taskType === Commerce.UserActivityRecorder.TaskRecorderTaskType.Begin) {
                                var scope = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewScope(Commerce.Utilities.GuidHelper.newGuid(), null, null, Commerce.UserActivityRecorder.ScopeType.Task);
                                scope.Sequence = ++this_1._currentModelSequence;
                                scope.ParentScopeId = currentScope.Id;
                                scope.ParentSequence = currentScope.Sequence;
                                currentScope.Children.push(scope);
                                this_1.buildRecording(recording, scope);
                            }
                            else {
                                return { value: void 0 };
                            }
                        }
                        else {
                            var viewContextId_1 = node.viewContextId;
                            var existingFormContextDictionaryEntry = Commerce.ArrayExtensions.firstOrUndefined(recording.FormContextEntries, function (formContextDictionaryEntry) {
                                return viewContextId_1 === formContextDictionaryEntry.FormId;
                            });
                            if (Commerce.ObjectExtensions.isNullOrUndefined(existingFormContextDictionaryEntry)) {
                                var newFormContextDictionaryEntry = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createFormContextDictionaryEntry(viewContextId_1, this_1._viewContextsByViewId.getItem(viewContextId_1), recording.Name, dataModel.Sequence);
                                recording.FormContextEntries.push(newFormContextDictionaryEntry);
                            }
                        }
                    };
                    var this_1 = this;
                    while (this._currentNodeIndex < this.nodes().length) {
                        var state_1 = _loop_1();
                        if (typeof state_1 === "object")
                            return state_1.value;
                    }
                };
                TaskRecorderSessionViewModel.prototype.parseRecording = function (currentScope) {
                    var _this = this;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(currentScope)) {
                        currentScope.Children.forEach(function (node) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(node)) {
                                switch (_this.getNodeType(node)) {
                                    case NodeType.scope:
                                        _this.parseRecording(node);
                                        break;
                                    case NodeType.taskUserAction:
                                        var taskUserAction = node;
                                        if (taskUserAction.UserActionTypeValue === Commerce.UserActivityRecorder.TaskRecorderTaskType.Begin) {
                                            _this.startTask(new ViewModel.TaskRecorderTaskViewModel(_this._context, taskUserAction));
                                        }
                                        else {
                                            _this.endTask();
                                        }
                                        break;
                                    case NodeType.userAction:
                                        _this.addStep(new ViewModel.TaskRecorderStepViewModel(node));
                                        break;
                                }
                            }
                        });
                    }
                };
                TaskRecorderSessionViewModel.prototype.getNodeType = function (node) {
                    var nodeObj = node;
                    if (Commerce.ObjectExtensions.isNumber(nodeObj.ScopeTypeValue)) {
                        return NodeType.scope;
                    }
                    if (Commerce.ObjectExtensions.isString(nodeObj.TaskId)) {
                        return NodeType.taskUserAction;
                    }
                    if (Commerce.ObjectExtensions.isString(nodeObj.GlobalId)) {
                        return NodeType.userAction;
                    }
                    return NodeType.none;
                };
                TaskRecorderSessionViewModel.prototype.resetSequence = function () {
                    this._sequence = 0;
                };
                TaskRecorderSessionViewModel.prototype.restoreSequence = function () {
                    var maxSequence = 0;
                    var nodes = this.nodes();
                    for (var i = (nodes.length - 1); i >= 0; i--) {
                        var element = nodes[i];
                        if ((element.parent() === this.activeTask()) && (element.sequence() > maxSequence)) {
                            maxSequence = element.sequence();
                        }
                    }
                    this._sequence = maxSequence;
                };
                TaskRecorderSessionViewModel.prototype.getNextSequence = function () {
                    return ++this._sequence;
                };
                TaskRecorderSessionViewModel.prototype.generateViewId = function (viewName) {
                    return Commerce.StringExtensions.format(TaskRecorderSessionViewModel.VIEW_ID_MASK, viewName, Commerce.Utilities.GuidHelper.newGuid());
                };
                TaskRecorderSessionViewModel.prototype.addViewToDictionary = function (viewId, viewName) {
                    if (this._viewContextsByViewId.hasItem(viewId)) {
                        return;
                    }
                    this._viewContextsByViewId.setItem(viewId, viewName);
                };
                TaskRecorderSessionViewModel.prototype.findView = function (viewName) {
                    var viewsIds = this._viewContextsByViewId.getKeys();
                    for (var i = 0; i < viewsIds.length; i++) {
                        if (this._viewContextsByViewId.getItem(viewsIds[i]) === viewName) {
                            return viewsIds[i];
                        }
                    }
                    return null;
                };
                TaskRecorderSessionViewModel.LIST_STEPS_CLASS_NAME = "listSteps";
                TaskRecorderSessionViewModel.VIEW_ID_MASK = "{0}_{1}";
                return TaskRecorderSessionViewModel;
            }());
            ViewModel.TaskRecorderSessionViewModel = TaskRecorderSessionViewModel;
        })(ViewModel = TaskRecorder.ViewModel || (TaskRecorder.ViewModel = {}));
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var ViewModel = Commerce.TaskRecorder.ViewModel;
        var UserActivityRecorderSessionBase = (function () {
            function UserActivityRecorderSessionBase(correlationId, context, recording) {
                this.MAJOR_VERSION = 1;
                Commerce.ThrowIf.argumentIsNotObject(context, "context");
                Commerce.ThrowIf.argumentIsNotObject(recording, "recording");
                this.context = context;
                this.recordingViewModel = new ViewModel.TaskRecorderSessionViewModel(this.context, recording);
                this.id = ko.observable(Commerce.Utilities.GuidHelper.newGuid());
                this._correlationId = correlationId;
                this.state = ko.observable(UserActivityRecorder.UserActivityRecorderState.None);
                this.initializeStateChangedEvent();
                this.name = this.recordingViewModel.name;
                this.description = this.recordingViewModel.description;
                this.isScreenshotsCapturingEnabled = ko.observable(false);
            }
            Object.defineProperty(UserActivityRecorderSessionBase.prototype, "nodes", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this.recordingViewModel)) {
                        return null;
                    }
                    return this.recordingViewModel.nodes;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserActivityRecorderSessionBase.prototype, "numberNodes", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this.recordingViewModel)) {
                        return 0;
                    }
                    return this.recordingViewModel.numberNodes;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserActivityRecorderSessionBase.prototype, "version", {
                get: function () {
                    return this.MAJOR_VERSION.toString() + "." + this.getRecorderVersion().toString();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UserActivityRecorderSessionBase.prototype, "CorrelationId", {
                get: function () {
                    return this._correlationId;
                },
                enumerable: true,
                configurable: true
            });
            UserActivityRecorderSessionBase.prototype.startTask = function (name, comment) {
                Commerce.ThrowIf.argumentIsNotString(name, "name");
                Commerce.ThrowIf.argumentIsNotStringOrNull(comment, "comment");
                var task = UserActivityRecorder.Utilities.RecordingFactory.createNewTask(Commerce.Utilities.GuidHelper.newGuid(), name, comment, null, UserActivityRecorder.TaskRecorderTaskType.Begin);
                this.recordingViewModel.startTask(new ViewModel.TaskRecorderTaskViewModel(this.context, task));
            };
            UserActivityRecorderSessionBase.prototype.endTask = function () {
                var state = this.state();
                var validStates = [
                    UserActivityRecorder.UserActivityRecorderState.Recording,
                    UserActivityRecorder.UserActivityRecorderState.RecordingPaused,
                    UserActivityRecorder.UserActivityRecorderState.Validating,
                    UserActivityRecorder.UserActivityRecorderState.ValidationPaused
                ];
                if (!Commerce.ArrayExtensions.hasElement(validStates, state)) {
                    var stateName = UserActivityRecorder.UserActivityRecorderState[state];
                    throw UserActivityRecorderSessionBase.error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_SESSION_INVALID_STATE, stateName);
                }
                this.recordingViewModel.endTask();
            };
            UserActivityRecorderSessionBase.prototype.startRecording = function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.eventListener)) {
                    this.eventListener.dispose();
                }
                if (this.numberNodes <= 0) {
                    this.addStartRecordingSteps();
                }
                this.state(UserActivityRecorder.UserActivityRecorderState.Recording);
                this.eventListener = this.getNewRecordingEventListener();
            };
            UserActivityRecorderSessionBase.prototype.startValidating = function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.eventListener)) {
                    this.eventListener.dispose();
                }
                this.state(UserActivityRecorder.UserActivityRecorderState.Validating);
                this.eventListener = this.getNewValidatingEventListener();
            };
            UserActivityRecorderSessionBase.prototype.pauseRecordingAndValidation = function () {
                var state = this.state();
                var validStates = [
                    UserActivityRecorder.UserActivityRecorderState.Recording,
                    UserActivityRecorder.UserActivityRecorderState.Validating
                ];
                if (!Commerce.ArrayExtensions.hasElement(validStates, state)) {
                    var stateName = UserActivityRecorder.UserActivityRecorderState[state];
                    throw UserActivityRecorderSessionBase.error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_SESSION_INVALID_STATE, stateName);
                }
                this.eventListener.stopListening();
                if (state === UserActivityRecorder.UserActivityRecorderState.Validating) {
                    this.state(UserActivityRecorder.UserActivityRecorderState.ValidationPaused);
                }
                else {
                    this.state(UserActivityRecorder.UserActivityRecorderState.RecordingPaused);
                }
            };
            UserActivityRecorderSessionBase.prototype.continueWithRecording = function () {
                var state = this.state();
                var validStates = [
                    UserActivityRecorder.UserActivityRecorderState.RecordingPaused,
                    UserActivityRecorder.UserActivityRecorderState.Validating,
                    UserActivityRecorder.UserActivityRecorderState.ValidationPaused
                ];
                if (!Commerce.ArrayExtensions.hasElement(validStates, state)) {
                    var stateName = UserActivityRecorder.UserActivityRecorderState[state];
                    throw UserActivityRecorderSessionBase.error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_SESSION_INVALID_STATE, stateName);
                }
                var validationStates = [
                    UserActivityRecorder.UserActivityRecorderState.Validating,
                    UserActivityRecorder.UserActivityRecorderState.ValidationPaused
                ];
                if (Commerce.ArrayExtensions.hasElement(validationStates, state)) {
                    this.startRecording();
                }
                else {
                    this.state(UserActivityRecorder.UserActivityRecorderState.Recording);
                    this.eventListener.startListening();
                }
            };
            UserActivityRecorderSessionBase.prototype.stopRecording = function () {
                var state = this.state();
                var validStates = [
                    UserActivityRecorder.UserActivityRecorderState.Recording,
                    UserActivityRecorder.UserActivityRecorderState.RecordingPaused,
                    UserActivityRecorder.UserActivityRecorderState.Validating,
                    UserActivityRecorder.UserActivityRecorderState.ValidationPaused
                ];
                if (!Commerce.ArrayExtensions.hasElement(validStates, state)) {
                    var stateName = UserActivityRecorder.UserActivityRecorderState[state];
                    throw UserActivityRecorderSessionBase.error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_SESSION_INVALID_STATE, stateName);
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.eventListener)) {
                    this.eventListener.dispose();
                    this.eventListener = null;
                }
                this.state(UserActivityRecorder.UserActivityRecorderState.RecordingCompleted);
            };
            UserActivityRecorderSessionBase.prototype.addView = function (viewName) {
                return this.recordingViewModel.addView(viewName);
            };
            UserActivityRecorderSessionBase.prototype.addStep = function (step) {
                Commerce.ThrowIf.argumentIsNotObject(step, "step");
                var stepViewModel = new ViewModel.TaskRecorderStepViewModel(step);
                stepViewModel.id = Commerce.Utilities.GuidHelper.newGuid();
                this.recordingViewModel.addStep(stepViewModel);
                var event = document.createEvent("Event");
                event.stepId = stepViewModel.id;
                event.initEvent("screenshot", true, false);
                document.dispatchEvent(event);
            };
            UserActivityRecorderSessionBase.prototype.getNode = function (index) {
                return this.recordingViewModel.getNode(index);
            };
            UserActivityRecorderSessionBase.prototype.replaceNode = function (index, node) {
                return this.recordingViewModel.replaceNode(index, node);
            };
            UserActivityRecorderSessionBase.prototype.deleteNode = function (nodeId) {
                this.recordingViewModel.deleteNode(nodeId);
            };
            UserActivityRecorderSessionBase.prototype.getLastValueIfStep = function () {
                var index = this.numberNodes - 1;
                if (index >= 0) {
                    var node = this.getNode(index);
                    if (node instanceof ViewModel.TaskRecorderStepViewModel) {
                        return node.toModel();
                    }
                }
                return null;
            };
            UserActivityRecorderSessionBase.prototype.replaceLastValueIfStep = function (step) {
                var index = this.numberNodes - 1;
                if (index >= 0) {
                    var node = this.getNode(index);
                    if (node instanceof ViewModel.TaskRecorderStepViewModel) {
                        var stepViewModel = new ViewModel.TaskRecorderStepViewModel(step);
                        stepViewModel.id = Commerce.Utilities.GuidHelper.newGuid();
                        return this.recordingViewModel.replaceNode(index, stepViewModel);
                    }
                }
                return false;
            };
            UserActivityRecorderSessionBase.prototype.isTaskCreated = function () {
                return !Commerce.ObjectExtensions.isNullOrUndefined(this.recordingViewModel.activeTask());
            };
            UserActivityRecorderSessionBase.prototype.updateScreenshotUri = function (stepId, screenshotUri) {
                var step = Commerce.ArrayExtensions.firstOrUndefined(this.nodes(), function (node) {
                    return node.id === stepId;
                });
                if (Commerce.ObjectExtensions.isNullOrUndefined(step)) {
                    throw new Commerce.Proxy.Entities.Error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_STEP_VIEW_MODEL_NOT_FOUND);
                }
                step.screenshotUri = screenshotUri;
            };
            UserActivityRecorderSessionBase.prototype.updateRecordingView = function () {
                this.recordingViewModel.scrollDown();
            };
            UserActivityRecorderSessionBase.prototype.dispose = function () {
                this.id = null;
                this.name = null;
                this.description = null;
                this.state = null;
                this.isScreenshotsCapturingEnabled = null;
                this.context = null;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this.eventListener)) {
                    this.eventListener.dispose();
                    this.eventListener = null;
                }
            };
            UserActivityRecorderSessionBase.error = function (errorCode) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return [new Commerce.Proxy.Entities.Error(errorCode, false, Commerce.StringExtensions.EMPTY, args)];
            };
            UserActivityRecorderSessionBase.prototype.addStartRecordingSteps = function () {
                return;
            };
            return UserActivityRecorderSessionBase;
        }());
        UserActivityRecorder.UserActivityRecorderSessionBase = UserActivityRecorderSessionBase;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        var TaskRecorderManager = (function (_super) {
            __extends(TaskRecorderManager, _super);
            function TaskRecorderManager() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._configurationPath = "TaskRecorder.config.json";
                _this._configuration = null;
                return _this;
            }
            Object.defineProperty(TaskRecorderManager.prototype, "Configuration", {
                get: function () {
                    return this._configuration;
                },
                enumerable: true,
                configurable: true
            });
            TaskRecorderManager.prototype.loadConfigurationAsync = function () {
                var _this = this;
                if (this.Configuration) {
                    return Commerce.VoidAsyncResult.createResolved();
                }
                var asyncResult = new Commerce.VoidAsyncResult();
                $.getJSON(this._configurationPath).done(function (config) {
                    _this._configuration = config;
                    asyncResult.resolve();
                }).fail(function () {
                    asyncResult.reject([new Commerce.Proxy.Entities.Error(Commerce.UserActivityRecorder.ErrorCodes.TASK_RECORDER_CONFIGURATION_ERROR)]);
                });
                return asyncResult;
            };
            TaskRecorderManager.prototype.getNewRecorderSession = function (correlationId, name, description) {
                var recording = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNew(name, description);
                return new TaskRecorder.TaskRecorderSession(correlationId, this.context, recording, this.Configuration);
            };
            return TaskRecorderManager;
        }(Commerce.UserActivityRecorder.UserActivityRecorderManagerBase));
        TaskRecorder.TaskRecorderManager = TaskRecorderManager;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        var Configuration;
        (function (Configuration) {
            "use strict";
        })(Configuration = TaskRecorder.Configuration || (TaskRecorder.Configuration = {}));
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        var UserActivityRecorderEventListenerBase = Commerce.UserActivityRecorder.UserActivityRecorderEventListenerBase;
        var TaskRecorderRecordingEventListener = (function (_super) {
            __extends(TaskRecorderRecordingEventListener, _super);
            function TaskRecorderRecordingEventListener(subscriber, config, context) {
                var _this = _super.call(this, subscriber, context) || this;
                Commerce.ThrowIf.argumentIsNotObject(config, "config");
                _this.config = config;
                _this._taskRecorderEventHandlers = [];
                return _this;
            }
            TaskRecorderRecordingEventListener.prototype.removeDerivedClassEventListeners = function () {
                var _this = this;
                this._taskRecorderEventHandlers.forEach(function (handler) {
                    _this.context.eventManager.removeEventListener("taskRecorderEvent", handler);
                });
                this._taskRecorderEventHandlers = [];
                this.config.events.forEach(function (event) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(event.custom) &&
                        Commerce.ArrayExtensions.hasElements(event.custom.internalEvents)) {
                        _this.removeElementEventListener(event.custom.internalEvents);
                    }
                });
            };
            TaskRecorderRecordingEventListener.prototype.subscribeToGlobalEvents = function () {
                var _this = this;
                this.config.events.forEach(function (event) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(event.custom)) {
                        _this.subscribeToCustomEvent(event);
                    }
                    else {
                        _this.subscribeToEvent(event.eventName, event.rules);
                    }
                });
                this._taskRecorderEventHandlers.forEach(function (handler) {
                    _this.context.eventManager.addEventListener("taskRecorderEvent", handler);
                });
                if (this.eventDictionary.hasItem("keydown")) {
                    this.addEventListener("keyup", function () { _this.lockKeyDown = false; });
                }
            };
            TaskRecorderRecordingEventListener.prototype.removeElementEventListener = function (internalEvents) {
                if (Commerce.ArrayExtensions.hasElements(internalEvents)) {
                    internalEvents.forEach(function (event) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(event.element) &&
                            !Commerce.ObjectExtensions.isNullOrUndefined(event.listener) &&
                            !Commerce.StringExtensions.isNullOrWhitespace(event.name)) {
                            event.element.removeEventListener(event.name, event.listener, true);
                        }
                    });
                }
            };
            TaskRecorderRecordingEventListener.prototype.subscribeToEvent = function (eventName, eventRules) {
                var _this = this;
                this.processEvents([eventName], eventRules, function (actions) {
                    if (Commerce.ArrayExtensions.hasElements(actions)) {
                        var deferred_1 = false;
                        actions.forEach(function (action) {
                            deferred_1 = deferred_1 || action.deferred;
                        });
                        if (deferred_1) {
                            setTimeout(function () {
                                _this.handleActions(actions, eventName);
                            }, 0);
                        }
                        else {
                            _this.handleActions(actions, eventName);
                        }
                    }
                });
            };
            TaskRecorderRecordingEventListener.prototype.subscribeToCustomEvent = function (event) {
                var _this = this;
                var runAction;
                this.processEvents(event.custom.startEvents, event.rules, function (actions) {
                    if (event.custom.startPhase) {
                        return;
                    }
                    event.custom.actions = actions;
                    actions.forEach(function (action) {
                        runAction = !Commerce.ObjectExtensions.isNullOrUndefined(action.element) && event.custom.runAction;
                        event.custom.startPhase = true;
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(action.element) && !Commerce.ObjectExtensions.isNullOrUndefined(event.custom.elementEvents)) {
                            event.custom.internalEvents = event.custom.internalEvents || [];
                            if (Commerce.ArrayExtensions.hasElements(event.custom.elementEvents.acceptEvents)) {
                                _this.addElementEvents(action.element, event.custom.elementEvents.acceptEvents, event.custom.internalEvents, function () {
                                    runAction = true;
                                });
                            }
                            if (Commerce.ArrayExtensions.hasElements(event.custom.elementEvents.declineEvents)) {
                                _this.addElementEvents(action.element, event.custom.elementEvents.declineEvents, event.custom.internalEvents, function () {
                                    runAction = false;
                                });
                            }
                        }
                    });
                });
                this.processEvents(event.custom.endEvents, event.rules, function (actions) {
                    if (!event.custom.startPhase) {
                        return;
                    }
                    event.custom.startPhase = false;
                    if (Commerce.ArrayExtensions.hasElements(event.custom.internalEvents)) {
                        _this.removeElementEventListener(event.custom.internalEvents);
                        event.custom.internalEvents = [];
                    }
                    setTimeout(function () {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(event.custom.actions) && runAction) {
                            _this.handleActions(event.custom.actions, event.eventName);
                        }
                        event.custom.actions = null;
                    }, 0);
                });
            };
            TaskRecorderRecordingEventListener.prototype.addElementEvents = function (element, eventNames, elementEvents, listener) {
                eventNames.forEach(function (event) {
                    element.addEventListener(event, listener, true);
                    elementEvents.push({
                        element: element,
                        listener: listener,
                        name: event
                    });
                });
            };
            TaskRecorderRecordingEventListener.prototype.processEvents = function (eventNames, eventRules, actionHandler) {
                var _this = this;
                var TASK_RECORDER_EVENT_NAME = "taskRecorderEvent";
                if (eventNames.length === 1 && eventNames[0] === TASK_RECORDER_EVENT_NAME) {
                    var taskRecorderEventListener = this.getTaskRecorderEventListener(eventRules, actionHandler);
                    this._taskRecorderEventHandlers.push(taskRecorderEventListener);
                }
                else {
                    eventNames.forEach(function (eventName) {
                        var eventListener = _this.getEventListener(eventRules, actionHandler);
                        _this.addEventListener(eventName, eventListener);
                    });
                }
            };
            TaskRecorderRecordingEventListener.prototype.getEventListener = function (eventRules, actionHandler) {
                var _this = this;
                return (function (event) {
                    if (Commerce.StringExtensions.compare(event.type, "keydown", true) === 0) {
                        if (_this.lockKeyDown) {
                            return;
                        }
                        _this.lockKeyDown = true;
                    }
                    var isMiddleMouseButonClicked = Commerce.ArrayExtensions.hasElement(["mousedown", "mouseup", "pointerdown", "pointerup", "click"], event.type, function (left, right) { return Commerce.StringExtensions.compare(left, right, true) === 0; }) &&
                        Commerce.NumberExtensions.compare(event.which, _this.middleMouseButtonWhichValue) === 0;
                    if (isMiddleMouseButonClicked) {
                        return;
                    }
                    var eventInfo = {
                        type: event.type,
                        element: event.target,
                        keyCode: event.keyCode
                    };
                    var actions = _this.applyRules(eventInfo, eventRules);
                    if (Commerce.ArrayExtensions.hasElements(actions)) {
                        actionHandler(actions);
                    }
                });
            };
            TaskRecorderRecordingEventListener.prototype.getTaskRecorderEventListener = function (eventRules, actionHandler) {
                var _this = this;
                return function (eventInfo) {
                    var actions = _this.applyRules(eventInfo, eventRules);
                    if (Commerce.ArrayExtensions.hasElements(actions)) {
                        actionHandler(actions);
                    }
                };
            };
            TaskRecorderRecordingEventListener.prototype.applyRules = function (eventInfo, rules) {
                var _this = this;
                var element = eventInfo.element;
                var resultRule = null;
                var matchElement = null;
                var results = [];
                rules.forEach(function (rule) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(resultRule)) {
                        return;
                    }
                    matchElement = _this.applyRule(eventInfo, element, rule);
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(matchElement)) {
                        resultRule = rule;
                    }
                });
                if (!Commerce.ObjectExtensions.isNullOrUndefined(resultRule) && !resultRule.ignore) {
                    results.push(this.createResultEventAction(resultRule, matchElement));
                    results = results.concat(this.parentHandler(eventInfo, matchElement, resultRule));
                    results = results.concat(this.childHandler(eventInfo, matchElement, resultRule));
                }
                return results;
            };
            TaskRecorderRecordingEventListener.prototype.parentHandler = function (eventInfo, element, rule) {
                var results = [];
                if (!Commerce.ObjectExtensions.isNullOrUndefined((rule.parentRule))) {
                    var parentMatchElement = this.applyRuleToParent(eventInfo, element, rule.parentRule);
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(parentMatchElement)) {
                        results.push(this.createResultEventAction(rule.parentRule, parentMatchElement));
                        results = results.concat(this.parentHandler(eventInfo, parentMatchElement, rule.parentRule));
                        results = results.concat(this.childHandler(eventInfo, parentMatchElement, rule.parentRule));
                    }
                }
                return results;
            };
            TaskRecorderRecordingEventListener.prototype.childHandler = function (eventInfo, element, rule) {
                var _this = this;
                if (!Commerce.ArrayExtensions.hasElements(rule.childRules)) {
                    return [];
                }
                var results = [];
                var _loop_2 = function (i) {
                    rule.childRules.forEach(function (childRule) {
                        var matchElement = _this.applyRule(eventInfo, element.children[i], childRule);
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(matchElement)) {
                            results.push(_this.createResultEventAction(childRule, matchElement));
                        }
                    });
                    results = results.concat(this_2.childHandler(eventInfo, element.children[i], rule));
                };
                var this_2 = this;
                for (var i = 0; i < element.children.length; i++) {
                    _loop_2(i);
                }
                return results;
            };
            TaskRecorderRecordingEventListener.prototype.applyRule = function (eventInfo, element, rule) {
                var match = false;
                var checked = false;
                var resultElement = element;
                if (Commerce.ObjectExtensions.isNullOrUndefined(element) ||
                    !Commerce.ObjectExtensions.isNullOrUndefined(element.attributes[this.disabledAttribute])) {
                    return null;
                }
                var backspaceKeyCode = 8;
                if (Commerce.NumberExtensions.compare(rule.keyCode, eventInfo.keyCode) === 0
                    && Commerce.NumberExtensions.compare(rule.keyCode, backspaceKeyCode) === 0) {
                    return resultElement;
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(rule.tagName) || Commerce.StringExtensions.compare(rule.tagName, element.tagName, true) === 0) {
                    if (Commerce.ArrayExtensions.hasElements(rule.ids)) {
                        match = (Commerce.ArrayExtensions.hasElement(rule.ids, element.id));
                        checked = true;
                    }
                    if (!match && Commerce.ArrayExtensions.hasElements(rule.classNames)) {
                        rule.classNames.forEach(function (className) {
                            match = (element.classList.contains(className));
                        });
                        checked = true;
                    }
                    if (!match && Commerce.ArrayExtensions.hasElements(rule.roles)) {
                        var role = element.getAttribute(this.roleAttribute);
                        match = !Commerce.StringExtensions.isNullOrWhitespace(role) ? Commerce.ArrayExtensions.hasElement(rule.roles, role.toLowerCase()) : false;
                        checked = true;
                    }
                    if (!match && Commerce.ArrayExtensions.hasElements(rule.types)) {
                        var type = element.getAttribute(this.typeAttribute);
                        match = !Commerce.StringExtensions.isNullOrWhitespace(type) ? Commerce.ArrayExtensions.hasElement(rule.types, type.toLowerCase()) : false;
                        checked = true;
                    }
                    if (!match && Commerce.ArrayExtensions.hasElements(rule.dataAxBubbles)) {
                        var bubbleAttribute = element.attributes[this.context.recordingMarkerAttributeName];
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(bubbleAttribute)) {
                            match = Commerce.ArrayExtensions.hasElement(rule.dataAxBubbles, bubbleAttribute.value);
                        }
                        checked = true;
                    }
                    if (!match && !Commerce.ObjectExtensions.isNullOrUndefined(rule.dataAction)) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(element.attributes[this.dataActionAttribute])) {
                            match = Commerce.NumberExtensions.compare(rule.dataAction, element.attributes[this.dataActionAttribute].value) === 0;
                        }
                        checked = true;
                    }
                    if (match && (Commerce.StringExtensions.compare(eventInfo.type, "keypress", true) === 0 ||
                        Commerce.StringExtensions.compare(eventInfo.type, "keydown", true) === 0 ||
                        Commerce.StringExtensions.compare(eventInfo.type, "keyup", true) === 0)) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(rule.keyCode)) {
                            match = Commerce.NumberExtensions.compare(rule.keyCode, eventInfo.keyCode) === 0;
                        }
                        else {
                            match = false;
                        }
                        checked = true;
                    }
                    if (match && Commerce.ArrayExtensions.hasElements(rule.parameters)) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(eventInfo.parameter)) {
                            match = Commerce.ArrayExtensions.hasElement(rule.parameters, eventInfo.parameter);
                        }
                        checked = true;
                    }
                    if (!checked) {
                        match = true;
                    }
                }
                if (match && !Commerce.ObjectExtensions.isNullOrUndefined(rule.parent)) {
                    match = !Commerce.ObjectExtensions.isNullOrUndefined(this.applyRuleToParent(eventInfo, element, rule.parent));
                }
                if (!match && rule.checkParents && Commerce.StringExtensions.compare("body", element.tagName, true) !== 0) {
                    resultElement = this.applyRuleToParent(eventInfo, element, rule);
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(resultElement)) {
                        match = true;
                    }
                }
                return match ? resultElement : null;
            };
            TaskRecorderRecordingEventListener.prototype.applyRuleToParent = function (eventInfo, element, rule) {
                var parent = element.parentElement;
                return this.applyRule(eventInfo, parent, rule);
            };
            TaskRecorderRecordingEventListener.prototype.handleActions = function (actions, eventName) {
                if (!Commerce.ArrayExtensions.hasElements(actions)) {
                    return;
                }
                var originAction = actions[0];
                var actionText = this.getActionsDescription(actions);
                var commandName = !Commerce.StringExtensions.isNullOrWhitespace(actions[0].commandName) ? actions[0].commandName : eventName;
                var stepInfo;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(originAction.keyCode)) {
                    var keyStepInfo = {
                        keyCode: originAction.keyCode,
                        altKey: false,
                        ctrlKey: false,
                        shiftKey: false
                    };
                    stepInfo = keyStepInfo;
                }
                else {
                    stepInfo = {};
                }
                var primaryControlName = this.getClosestAttributeValue(originAction.element, this.context.recordingMarkerAttributeName);
                var secondaryControlName = this.getClosestAttributeValue(originAction.element, this.dataAxActionAttribute);
                var valueAction = Commerce.ArrayExtensions.firstOrUndefined(actions, function (action) {
                    return !Commerce.StringExtensions.isNullOrWhitespace(action.valueStrategy);
                });
                if (!Commerce.ObjectExtensions.isNullOrUndefined(valueAction)) {
                    stepInfo.value = this.applyActionDataValueStrategy(valueAction.element, valueAction.valueStrategy);
                    secondaryControlName = this.getClosestAttributeValue(valueAction.element, this.dataAxActionAttribute);
                }
                if (!Commerce.StringExtensions.isNullOrWhitespace(secondaryControlName)) {
                    stepInfo.secondaryControlName = secondaryControlName;
                }
                var command = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewCommand(Commerce.StringExtensions.EMPTY, commandName, actionText, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, stepInfo, primaryControlName, originAction.controlType, this.addView(this.context.getCurrentViewNameHandler()));
                this.addStep(command);
                Commerce.RetailLogger.taskRecorderHandleAction(actionText);
            };
            TaskRecorderRecordingEventListener.prototype.getClosestAttributeValue = function (element, attributeName) {
                return $(element).closest(Commerce.StringExtensions.format("[{0}]", attributeName)).attr(attributeName);
            };
            TaskRecorderRecordingEventListener.prototype.getActionsDescription = function (actions) {
                var _this = this;
                if (!Commerce.ArrayExtensions.hasElements(actions)) {
                    return Commerce.StringExtensions.EMPTY;
                }
                if (actions.length > 1) {
                    actions = actions.filter(function (action) {
                        return !Commerce.ObjectExtensions.isNullOrUndefined(action.compositionOrder);
                    });
                    actions = actions.sort(function (a, b) {
                        if (a.compositionOrder < b.compositionOrder) {
                            return -1;
                        }
                        else if (a.compositionOrder > b.compositionOrder) {
                            return 1;
                        }
                        return 0;
                    });
                }
                var descriptionComponents = [];
                actions.forEach(function (action) {
                    descriptionComponents.push(_this.getActionDescription(action));
                });
                var actionDescription = Commerce.StringExtensions.EMPTY;
                if (!Commerce.ArrayExtensions.hasElements(descriptionComponents)) {
                    return Commerce.StringExtensions.EMPTY;
                }
                else if (descriptionComponents.length === 1) {
                    return descriptionComponents[0];
                }
                var formatString = this.context.stringResourceManager.getString("string_10129");
                actionDescription = Commerce.StringExtensions.format(formatString, descriptionComponents[0], descriptionComponents[1]);
                for (var i = 2; i < descriptionComponents.length; ++i) {
                    actionDescription = Commerce.StringExtensions.format(formatString, actionDescription, descriptionComponents[i]);
                }
                return actionDescription;
            };
            TaskRecorderRecordingEventListener.prototype.getActionDescription = function (action) {
                var value = Commerce.StringExtensions.EMPTY;
                if (Commerce.ArrayExtensions.hasElements(action.strategies)) {
                    for (var indexStrategy = 0; indexStrategy < action.strategies.length; indexStrategy++) {
                        value = this.applyActionDataStrategy(action.element, action.strategies[indexStrategy]);
                        if (value) {
                            break;
                        }
                    }
                }
                var parameter = value || this.context.stringResourceManager.getString(action.defaultValue);
                value = !Commerce.StringExtensions.isNullOrWhitespace(parameter)
                    ? Commerce.StringExtensions.format(this.context.stringResourceManager.getString(action.text), parameter)
                    : this.context.stringResourceManager.getString(action.text);
                return value;
            };
            TaskRecorderRecordingEventListener.prototype.applyActionDataStrategy = function (element, strategy) {
                switch (strategy) {
                    case "content":
                        if (!Commerce.StringExtensions.isNullOrWhitespace(element.innerHTML)) {
                            return this.getVisibleContent(element);
                        }
                        break;
                    case "value":
                        return element.value;
                    case "label":
                        if (!Commerce.StringExtensions.isNullOrWhitespace(element.id)) {
                            var label = $("label[for='" + element.id + "']");
                            if (label[0]) {
                                return label[0].innerHTML;
                            }
                        }
                        break;
                    case "title":
                        if (!Commerce.StringExtensions.isNullOrWhitespace(element.title)) {
                            return element.title;
                        }
                        break;
                    case "aria-label":
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(element.attributes[this.ariaLabelAttribute])) {
                            return element.attributes[this.ariaLabelAttribute].value;
                        }
                        break;
                    case "actionProperty":
                        var $element = $(element);
                        var elementData = $element.data("commerceButtonGridButtonOptions");
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(elementData)) {
                            var action = elementData.Action;
                            var actionProperty = elementData.ActionProperty;
                            if (action === Commerce.Proxy.Entities.RetailOperation.TotalDiscountPercent
                                && !Commerce.StringExtensions.isNullOrWhitespace(actionProperty)
                                && !Commerce.NumberExtensions.isNullOrZero(actionProperty)) {
                                return Commerce.StringExtensions.format(this.context.stringResourceManager.getString("string_10089"), actionProperty);
                            }
                        }
                        break;
                    case "aria-labelledby":
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(element.attributes[this.ariaLabelledbyAttribute])) {
                            var labeledElement = document.getElementById(element.attributes[this.ariaLabelledbyAttribute].value);
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(labeledElement) &&
                                !Commerce.ObjectExtensions.isNullOrUndefined(labeledElement.attributes[this.ariaLabelAttribute])) {
                                return labeledElement.attributes[this.ariaLabelAttribute].value;
                            }
                        }
                        break;
                }
                return null;
            };
            TaskRecorderRecordingEventListener.prototype.getVisibleContent = function (element) {
                var cloneElement = $(element).clone();
                cloneElement.find("*[style*='display: none']").remove();
                var result = cloneElement.text().trim();
                cloneElement.remove();
                return result;
            };
            TaskRecorderRecordingEventListener.prototype.applyActionDataValueStrategy = function (element, strategy) {
                switch (strategy) {
                    case "value":
                        return element.value;
                    case "checked":
                        return element.checked;
                    case "aria-checked":
                        return element.getAttribute(this.ariaCheckedAttribute) === "true";
                    case "option":
                        return element.value;
                }
                return null;
            };
            TaskRecorderRecordingEventListener.prototype.createResultEventAction = function (rule, element) {
                return {
                    strategies: rule.actionData.strategies,
                    text: rule.actionData.text,
                    defaultValue: rule.actionData.defaultValue,
                    element: element,
                    deferred: rule.actionData.deferred,
                    compositionOrder: rule.actionData.compositionOrder,
                    commandName: rule.actionData.commandName,
                    keyCode: rule.keyCode,
                    valueStrategy: rule.actionData.valueStrategy,
                    controlType: rule.actionData.controlType
                };
            };
            TaskRecorderRecordingEventListener.VERSION = 1;
            return TaskRecorderRecordingEventListener;
        }(UserActivityRecorderEventListenerBase));
        TaskRecorder.TaskRecorderRecordingEventListener = TaskRecorderRecordingEventListener;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        var UserActivityRecorderEventListenerBase = Commerce.UserActivityRecorder.UserActivityRecorderEventListenerBase;
        var UserActivityRecorderSessionBase = Commerce.UserActivityRecorder.UserActivityRecorderSessionBase;
        var TaskRecorderSession = (function (_super) {
            __extends(TaskRecorderSession, _super);
            function TaskRecorderSession(correlationId, context, recording, configuration) {
                var _this = _super.call(this, correlationId, context, recording) || this;
                Commerce.ThrowIf.argumentIsNotObject(configuration, "configuration");
                _this._configuration = configuration;
                return _this;
            }
            TaskRecorderSession.prototype.continueWithValidation = function () {
                throw new Commerce.Proxy.Entities.Error(Commerce.UserActivityRecorder.ErrorCodes.TASK_RECORDER_CONTINUE_WITH_VALIDATION_NOT_SUPPORTED_ERROR);
            };
            TaskRecorderSession.prototype.getRecordingAsync = function () {
                var _this = this;
                var asyncResult = new Commerce.AsyncResult();
                var nodes = this.recordingViewModel.nodes().map(function (vm) {
                    return { Id: vm.id, ScreenshotUri: vm.screenshotUri };
                }).filter(function (node) {
                    return !Commerce.StringExtensions.isNullOrWhitespace(node.ScreenshotUri);
                });
                if (Commerce.ArrayExtensions.hasElements(nodes)) {
                    var correlationId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                    var request = new TaskRecorder.UploadTaskRecorderScreenshotsRequest(correlationId, nodes);
                    Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request))
                        .done(function (result) {
                        if (result.canceled) {
                            asyncResult.resolve({ canceled: true, data: null });
                        }
                        else {
                            if (Commerce.ArrayExtensions.hasElements(result.data.nodes)) {
                                result.data.nodes.forEach(function (node) {
                                    var viewModel = Commerce.ArrayExtensions.firstOrUndefined(_this.recordingViewModel.nodes(), function (vm) {
                                        return Commerce.StringExtensions.compare(vm.id, node.Id, true) === 0;
                                    });
                                    if (!Commerce.ObjectExtensions.isNullOrUndefined(viewModel)) {
                                        viewModel.screenshotUri = node.ScreenshotUri;
                                    }
                                });
                            }
                            asyncResult.resolve({ canceled: false, data: _this.recordingViewModel.toModel() });
                        }
                    }).fail(function () {
                        asyncResult.reject([new Commerce.Proxy.Entities.Error(Commerce.UserActivityRecorder.ErrorCodes.TASK_RECORDER_COULDNT_UPLOAD_SCREENSHOT)]);
                    });
                }
                else {
                    asyncResult.resolve({ canceled: false, data: this.recordingViewModel.toModel() });
                }
                return asyncResult;
            };
            TaskRecorderSession.prototype.getNewRecordingEventListener = function () {
                var taskRecorderEventListener = new TaskRecorder.TaskRecorderRecordingEventListener(this, this._configuration, this.context);
                taskRecorderEventListener.startListening();
                return taskRecorderEventListener;
            };
            TaskRecorderSession.prototype.getNewValidatingEventListener = function () {
                throw new Commerce.Proxy.Entities.Error(Commerce.UserActivityRecorder.ErrorCodes.TASK_RECORDER_VALIDATION_EVENT_LISTENER_NOT_SUPPORTED_ERROR);
            };
            TaskRecorderSession.prototype.initializeStateChangedEvent = function () {
                var _this = this;
                this.state.subscribe(function (value) {
                    _this.context.eventManager.raiseEvent("StateChangedEvent", value);
                });
            };
            TaskRecorderSession.prototype.getRecorderVersion = function () {
                return UserActivityRecorderEventListenerBase.VERSION + TaskRecorder.TaskRecorderRecordingEventListener.VERSION;
            };
            return TaskRecorderSession;
        }(UserActivityRecorderSessionBase));
        TaskRecorder.TaskRecorderSession = TaskRecorderSession;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var UserActivityRecorderViewManagerBase = (function () {
            function UserActivityRecorderViewManagerBase(userActivityRecorderController, userActivityRecorderManager, context) {
                this.registeredViews = {};
                this.viewHistory = [];
                Commerce.ThrowIf.argumentIsNotObject(userActivityRecorderController, "userActivityRecorderController");
                Commerce.ThrowIf.argumentIsNotObject(userActivityRecorderManager, "userActivityRecorderManager");
                Commerce.ThrowIf.argumentIsNotObject(context, "context");
                this.userActivityRecorderController = userActivityRecorderController;
                this.userActivityRecorderManager = userActivityRecorderManager;
                this.baseViewUri = context.baseViewURI;
                this._context = context;
            }
            UserActivityRecorderViewManagerBase.prototype.registerView = function (viewName, viewModelType) {
                Commerce.ThrowIf.argumentIsNotString(viewName, "viewName");
                Commerce.ThrowIf.argumentIsNotFunction(viewModelType, "viewModelType");
                var viewDefinition = {
                    viewUri: this.getViewUri(viewName),
                    viewModelType: viewModelType
                };
                this.registeredViews[viewName] = viewDefinition;
            };
            UserActivityRecorderViewManagerBase.prototype.loadView = function (correlationId, viewName, options, parent) {
                var _this = this;
                Commerce.RetailLogger.userActivityRecorderLoadView(correlationId, viewName);
                Commerce.ThrowIf.argumentIsNotString(viewName, "viewName");
                var viewDefinition = this.registeredViews[viewName];
                if (!viewDefinition) {
                    return Commerce.AsyncResult.createRejected(UserActivityRecorderViewManagerBase.error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_VIEWMANAGER_VIEW_NOT_FOUND, viewName));
                }
                var that = this;
                var asyncResult = new Commerce.AsyncResult();
                var element = document.createElement("div");
                this._context.renderPageImplementation(viewDefinition.viewUri, element).done(function () {
                    try {
                        var viewModelType = viewDefinition.viewModelType;
                        var context = {
                            userActivityRecorderController: that.userActivityRecorderController,
                            userActivityRecorderManager: that.userActivityRecorderManager,
                            activityRecorderContext: _this._context
                        };
                        var viewModel = new viewModelType(context, options);
                        if (parent) {
                            parent.appendChild(element);
                        }
                        if (Commerce.ObjectExtensions.isFunction(viewModel.load)) {
                            viewModel.load(options);
                        }
                        Commerce.RetailLogger.userActivityRecorderLoadViewSucceeded(correlationId, viewName);
                        asyncResult.resolve({
                            element: element,
                            viewModel: viewModel
                        });
                    }
                    catch (e) {
                        Commerce.RetailLogger.userActivityRecorderLoadViewFailed(correlationId, viewName, Commerce.Framework.ErrorConverter.serializeError(e));
                        asyncResult.reject(UserActivityRecorderViewManagerBase.error(UserActivityRecorder.ErrorCodes.TASK_RECORDER_VIEWMANAGER_LOAD_FAILED, viewName));
                    }
                }).fail(function (errors) {
                    Commerce.RetailLogger.userActivityRecorderLoadViewFailed(correlationId, viewName, Commerce.Framework.ErrorConverter.serializeError(errors));
                    asyncResult.reject(errors);
                });
                return asyncResult;
            };
            UserActivityRecorderViewManagerBase.prototype.unloadView = function (parent, vvm, dispose) {
                if (dispose === void 0) { dispose = true; }
                parent.removeChild(vvm.element);
                if (dispose) {
                    this.disposeView(vvm);
                }
            };
            UserActivityRecorderViewManagerBase.prototype.moveViewToHistory = function (parent, vvm) {
                parent.removeChild(vvm.element);
                this.viewHistory.push(vvm);
            };
            UserActivityRecorderViewManagerBase.prototype.navigateBack = function () {
                if (!Commerce.ArrayExtensions.hasElements(this.viewHistory)) {
                    return null;
                }
                return this.viewHistory.pop();
            };
            UserActivityRecorderViewManagerBase.prototype.disposeView = function (vvm) {
                var _this = this;
                this.disposeViewModel(vvm);
                this.viewHistory.forEach(function (storedVvm) {
                    _this.disposeViewModel(storedVvm);
                });
                this.viewHistory.length = 0;
            };
            UserActivityRecorderViewManagerBase.error = function (errorCode) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return [new Commerce.Proxy.Entities.Error(errorCode, false, Commerce.StringExtensions.EMPTY, args)];
            };
            UserActivityRecorderViewManagerBase.prototype.disposeViewModel = function (vvm) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(vvm.viewModel) &&
                    Commerce.ObjectExtensions.isFunction(vvm.viewModel.dispose)) {
                    vvm.viewModel.dispose();
                }
            };
            return UserActivityRecorderViewManagerBase;
        }());
        UserActivityRecorder.UserActivityRecorderViewManagerBase = UserActivityRecorderViewManagerBase;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        "use strict";
        var UserActivityRecorderViewManagerBase = Commerce.UserActivityRecorder.UserActivityRecorderViewManagerBase;
        var TaskRecorderViewManager = (function (_super) {
            __extends(TaskRecorderViewManager, _super);
            function TaskRecorderViewManager() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TaskRecorderViewManager.prototype.getViewUri = function (viewName) {
                return this.baseViewUri + "Views/" + viewName + "View/" + viewName + "View.html";
            };
            return TaskRecorderViewManager;
        }(UserActivityRecorderViewManagerBase));
        TaskRecorder.TaskRecorderViewManager = TaskRecorderViewManager;
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TaskRecorder;
    (function (TaskRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var TaskRecorderStepViewModel = (function (_super) {
                __extends(TaskRecorderStepViewModel, _super);
                function TaskRecorderStepViewModel(model) {
                    var _this = _super.call(this) || this;
                    Commerce.ThrowIf.argumentIsNotObject(model, "model");
                    _this.id = model.Id;
                    _this.sequence = ko.observable(model.Sequence);
                    _this.text = ko.observable(model.Description);
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(model.Annotations) && model.Annotations.length > 0) {
                        _this.notes = ko.observable(model.Annotations[0].Description);
                    }
                    else {
                        _this.notes = ko.observable(Commerce.StringExtensions.EMPTY);
                    }
                    _this.parent = ko.observable(null);
                    _this.displayNumber = ko.computed(function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(_this.sequence())) {
                            return Commerce.StringExtensions.EMPTY;
                        }
                        if (Commerce.ObjectExtensions.isNullOrUndefined(_this.parent())) {
                            return _this.sequence().toString();
                        }
                        return _this.parent().displayNumber() + "." + _this.sequence().toString();
                    }, _this);
                    _this.description = ko.computed(function () {
                        return _this.text();
                    });
                    if (model instanceof Commerce.UserActivityRecorder.UserActivityRecorderBaseStep) {
                        _this.editable = model.isEditable;
                        _this.deletable = model.isDeletable;
                        _this.numberable = model.isNumberable;
                    }
                    else {
                        _this.editable = true;
                        _this.deletable = false;
                        _this.numberable = true;
                    }
                    _this.oDataClass = Commerce.Proxy.Entities.TaskRecorderODataType.commandUserAction;
                    _this.commandName = model.CommandName;
                    if (Commerce.ArrayExtensions.hasElements(model.Arguments)) {
                        try {
                            _this.stepInfo = JSON.parse(model.Arguments[0].Value);
                        }
                        catch (ex) {
                            Commerce.RetailLogger.taskRecorderCommandArgumentsParseError(Commerce.Framework.ErrorConverter.serializeError(ex), model.Arguments[0].Value);
                            _this.stepInfo = null;
                        }
                    }
                    _this.controlName = model.ControlName;
                    _this.controlType = model.ControlType;
                    _this.viewContextId = model.FormId;
                    _this.screenshotUri = model.ScreenshotUri;
                    return _this;
                }
                TaskRecorderStepViewModel.prototype.toModel = function () {
                    return Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewCommand(this.id, this.commandName, this.text(), this.notes(), this.screenshotUri, this.stepInfo, this.controlName, this.controlType, this.viewContextId);
                };
                return TaskRecorderStepViewModel;
            }(ViewModel.TaskRecorderViewModelBase));
            ViewModel.TaskRecorderStepViewModel = TaskRecorderStepViewModel;
        })(ViewModel = TaskRecorder.ViewModel || (TaskRecorder.ViewModel = {}));
    })(TaskRecorder = Commerce.TaskRecorder || (Commerce.TaskRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder_1) {
        var TestRecorder = (function () {
            function TestRecorder(context) {
                this._context = context;
                this._testRecorderController = new TestRecorder_1.TestRecorderController(this._context);
            }
            Object.defineProperty(TestRecorder.prototype, "isActivated", {
                get: function () {
                    return this._testRecorderController.isActivated;
                },
                enumerable: true,
                configurable: true
            });
            TestRecorder.prototype.activateRecorder = function (correlationId, viewName) {
                this._testRecorderController.activateMainPanel(correlationId, viewName);
            };
            return TestRecorder;
        }());
        TestRecorder_1.TestRecorder = TestRecorder;
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var CompleteRecordingViewModel = (function (_super) {
                __extends(CompleteRecordingViewModel, _super);
                function CompleteRecordingViewModel(context) {
                    var _this = _super.call(this, context) || this;
                    _this.isLcsAvailable = ko.observable(false);
                    _this.isSaveToWordDocumentAllowed = ko.observable(false);
                    _this.isSaveToDocumentRecordingAllowed = ko.observable(false);
                    return _this;
                }
                return CompleteRecordingViewModel;
            }(Commerce.UserActivityRecorder.ViewModel.CompleteRecordingViewModel));
            ViewModel.CompleteRecordingViewModel = CompleteRecordingViewModel;
        })(ViewModel = TestRecorder.ViewModel || (TestRecorder.ViewModel = {}));
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var EditStepViewModel = (function (_super) {
                __extends(EditStepViewModel, _super);
                function EditStepViewModel(context, stepId) {
                    var _this = _super.call(this, context, stepId) || this;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(_this.storedTaskRecorderStepViewModel.stepInfo)) {
                        if (Commerce.TaskRecorder.isITaskRecorderVariableStepInfo(_this.storedTaskRecorderStepViewModel.stepInfo)) {
                            _this._variable = _this.storedTaskRecorderStepViewModel.stepInfo.variableValue;
                        }
                        else if (Commerce.TaskRecorder.isITaskRecorderValidationStepInfo(_this.storedTaskRecorderStepViewModel.stepInfo)) {
                            if (Commerce.ArrayExtensions.hasElements(_this.storedTaskRecorderStepViewModel.stepInfo.variableValues)) {
                                _this._variable = _this.storedTaskRecorderStepViewModel.stepInfo.variableValues[0];
                            }
                        }
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(_this._variable) && !Commerce.ObjectExtensions.isNullOrUndefined(_this._variable.value)) {
                            _this.hasVariableValue(true);
                            if (_this.storedTaskRecorderStepViewModel.stepInfo.isSensitiveData) {
                                _this.isVariableValueModifiable(false);
                                _this.variableValue("***");
                            }
                            else {
                                _this.isVariableValueModifiable(true);
                                _this.variableValue(_this._variable.value);
                            }
                            _this.areMultipleLinesAllowedInVariableValue(_this._variable.valueType === Commerce.TaskRecorder.VariableValueType.MultilineString);
                        }
                    }
                    return _this;
                }
                EditStepViewModel.prototype.saveStep = function () {
                    if (this.isVariableValueModifiable()) {
                        this._variable.value = this.variableValue();
                    }
                    _super.prototype.saveStep.call(this);
                };
                return EditStepViewModel;
            }(Commerce.UserActivityRecorder.ViewModel.EditStepViewModel));
            ViewModel.EditStepViewModel = EditStepViewModel;
        })(ViewModel = TestRecorder.ViewModel || (TestRecorder.ViewModel = {}));
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        var ViewModel;
        (function (ViewModel) {
            "use strict";
            var RecordingViewModel = (function (_super) {
                __extends(RecordingViewModel, _super);
                function RecordingViewModel() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(RecordingViewModel.prototype, "isValidationAllowed", {
                    get: function () {
                        return true;
                    },
                    enumerable: true,
                    configurable: true
                });
                RecordingViewModel.prototype.checkScreenshotsFeature = function () {
                    return false;
                };
                return RecordingViewModel;
            }(Commerce.UserActivityRecorder.ViewModel.RecordingViewModelBase));
            ViewModel.RecordingViewModel = RecordingViewModel;
        })(ViewModel = TestRecorder.ViewModel || (TestRecorder.ViewModel = {}));
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        var UserActivityRecorderControllerBase = Commerce.UserActivityRecorder.UserActivityRecorderControllerBase;
        var testRecorderPanels = {
            "MainPanel": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.MainPanelViewModel
            }
        };
        var testRecorderPages = {
            "Welcome": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.WelcomeViewModel
            },
            "NewRecording": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.NewRecordingViewModel
            },
            "Recording": {
                viewModelType: Commerce.TestRecorder.ViewModel.RecordingViewModel
            },
            "NewTask": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.NewTaskViewModel
            },
            "EditStep": {
                viewModelType: Commerce.TestRecorder.ViewModel.EditStepViewModel
            },
            "EditTask": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.EditTaskViewModel
            },
            "CompleteRecording": {
                viewModelType: Commerce.TestRecorder.ViewModel.CompleteRecordingViewModel
            },
            "Help": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.HelpViewModel
            },
            "StartTaskGuide": {
                viewModelType: Commerce.UserActivityRecorder.ViewModel.StartTaskGuideViewModel
            }
        };
        var TestRecorderController = (function (_super) {
            __extends(TestRecorderController, _super);
            function TestRecorderController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(TestRecorderController.prototype, "UserActivityRecorderControllerElementId", {
                get: function () {
                    return TestRecorderController.ELEMENT_ID_TESTRECORDER_HOST;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TestRecorderController.prototype, "ErrorInvalidDOM", {
                get: function () {
                    return [new Commerce.Proxy.Entities.Error("string_10207")];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TestRecorderController.prototype, "Manager", {
                get: function () {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._manager)) {
                        this._manager = new TestRecorder.TestRecorderManager(this.context, function (state) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(_this._testRecorderDisplayFloat)) {
                                _this._testRecorderDisplayFloat.updateState(state);
                            }
                        });
                    }
                    return this._manager;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TestRecorderController.prototype, "ViewManager", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._viewManager)) {
                        this._viewManager = new TestRecorder.TestRecorderViewManager(this, this.Manager, this.context);
                    }
                    return this._viewManager;
                },
                enumerable: true,
                configurable: true
            });
            TestRecorderController.prototype.showMainPanel = function (timeInMillisecondsToAnimate) {
                var _this = this;
                return _super.prototype.showMainPanel.call(this, timeInMillisecondsToAnimate).done(function (wasMainPanelShown) {
                    if (wasMainPanelShown && !Commerce.ObjectExtensions.isNullOrUndefined(_this._testRecorderDisplayFloat)) {
                        _this._testRecorderDisplayFloat.updateRecordingMainPanelStatus(true);
                    }
                });
            };
            TestRecorderController.prototype.hideMainPanel = function (closeWhenNotRecording, timeInMillisecondsToAnimate) {
                var _this = this;
                if (closeWhenNotRecording === void 0) { closeWhenNotRecording = true; }
                return _super.prototype.hideMainPanel.call(this, closeWhenNotRecording, timeInMillisecondsToAnimate).done(function (wasMainPanelHidden) {
                    if (wasMainPanelHidden && !Commerce.ObjectExtensions.isNullOrUndefined(_this._testRecorderDisplayFloat)) {
                        _this._testRecorderDisplayFloat.updateRecordingMainPanelStatus(false);
                    }
                });
            };
            TestRecorderController.prototype.activateMainPanel = function (correlationId, viewName) {
                var _this = this;
                Commerce.RetailLogger.testRecorderActivateMainPanel(correlationId);
                return _super.prototype.activateMainPanel.call(this, correlationId, viewName).done(function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(_this._testRecorderDisplayFloat)) {
                        var floatOptions = {
                            state: _this.getUserActivityRecorderState(),
                            toggleMainPanel: function () {
                                _this.toggleMainPanel();
                            },
                            pauseRecording: function () {
                                _this._manager.activeSession().pauseRecordingAndValidation();
                            },
                            continueRecording: function () {
                                _this._manager.activeSession().continueWithRecording();
                            },
                            continueValidation: function () {
                                _this._manager.activeSession().continueWithValidation();
                            }
                        };
                        _this._testRecorderDisplayFloat = _this.context.createDisplayFloat(floatOptions);
                        _this._testRecorderDisplayFloat.show();
                    }
                    Commerce.RetailLogger.testRecorderActivateMainSucceeded(correlationId);
                }).fail(function (errors) {
                    Commerce.RetailLogger.testRecorderActivateMainPanelFailed(correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                });
            };
            TestRecorderController.prototype.deactivateMainPanel = function () {
                Commerce.RetailLogger.testRecorderDeactivateMainPanel(this.CorrelationId);
                _super.prototype.deactivateMainPanel.call(this);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._testRecorderDisplayFloat)) {
                    this._testRecorderDisplayFloat.dispose();
                    this._testRecorderDisplayFloat = null;
                }
            };
            TestRecorderController.prototype.initializePanelDefinitions = function () {
                var _this = this;
                Object.getOwnPropertyNames(testRecorderPanels).forEach(function (viewName) {
                    var viewDefinition = testRecorderPanels[viewName];
                    _this.ViewManager.registerView(viewName, viewDefinition.viewModelType);
                });
            };
            TestRecorderController.prototype.initializePageDefinitions = function () {
                var _this = this;
                Object.getOwnPropertyNames(testRecorderPages).forEach(function (viewName) {
                    var viewDefinition = testRecorderPages[viewName];
                    _this.ViewManager.registerView(viewName, viewDefinition.viewModelType);
                });
            };
            TestRecorderController.prototype.getDefaultViewModelTitle = function () {
                return this.context.stringResourceManager.getString("string_10400");
            };
            TestRecorderController.ELEMENT_ID_TESTRECORDER_HOST = "taskRecorderHost";
            return TestRecorderController;
        }(UserActivityRecorderControllerBase));
        TestRecorder.TestRecorderController = TestRecorderController;
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var animationEventNames = ["animationend", "animationiteration", "animationstart"];
        function isAnimationEventName(x) {
            return animationEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isAnimationEventName = isAnimationEventName;
        var clipboardEventNames = ["copy", "cut", "paste"];
        function isClipboardEventName(x) {
            return clipboardEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isClipboardEventName = isClipboardEventName;
        var dragEventNames = ["drag", "dragend", "dragenter", "dragleave", "dragover", "dragstop", "drop"];
        function isDragEventName(x) {
            return dragEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isDragEventName = isDragEventName;
        var focusEventNames = ["blur", "focus", "focusin", "focusout"];
        function isFocusEventName(x) {
            return focusEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isFocusEventName = isFocusEventName;
        var inputEventNames = ["change", "input"];
        function isInputEventName(x) {
            return inputEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isInputEventName = isInputEventName;
        var keyboardEventNames = ["keydown", "keypress", "keyup"];
        function isKeyboardEventName(x) {
            return keyboardEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isKeyboardEventName = isKeyboardEventName;
        var mouseEventNames = ["auxclick", "click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave",
            "mouseup", "mouseover", "mousemove", "mouseout"];
        function isMouseEventName(x) {
            return mouseEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isMouseEventName = isMouseEventName;
        var pointerEventNames = ["pointerover", "pointerenter", "pointerdown", "pointermove",
            "pointerup", "pointercancel", "pointerout", "pointerleave", "gotpointercapture", "lostpointercapture"];
        function isPointerEventName(x) {
            return pointerEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isPointerEventName = isPointerEventName;
        var selectionEventNames = ["selectionchange", "selectstart"];
        function isSelectionEventName(x) {
            return selectionEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isSelectionEventName = isSelectionEventName;
        var touchEventNames = ["touchcancel", "touchend", "touchmove", "touchstart"];
        function isTouchEventName(x) {
            return touchEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isTouchEventName = isTouchEventName;
        var wheelEventNames = ["wheel"];
        function isWheelEventName(x) {
            return wheelEventNames.indexOf(x) >= 0;
        }
        UserActivityRecorder.isWheelEventName = isWheelEventName;
        var uiEventNames = ["abort", "breforeunload", "error", "load", "resize", "scroll", "select", "unload"];
        function isUIEventName(x) {
            return uiEventNames.indexOf(x) >= 0 || isFocusEventName(x) || isInputEventName(x) || isKeyboardEventName(x) || isMouseEventName(x) ||
                isPointerEventName(x) || isTouchEventName(x) || isWheelEventName(x);
        }
        UserActivityRecorder.isUIEventName = isUIEventName;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        "use strict";
        var testRecorderInputEventNames = ["mergedactionkeyinputentry", "mergedkeyinputentry"];
        function isTestRecorderInputEventName(x) {
            return testRecorderInputEventNames.indexOf(x) >= 0 || Commerce.UserActivityRecorder.isInputEventName(x);
        }
        TestRecorder.isTestRecorderInputEventName = isTestRecorderInputEventName;
        var testRecorderKeyboardEventNames = ["mergedkeyonselect", "mergedkeypress"];
        function isTestRecorderKeyboardEventName(x) {
            return testRecorderKeyboardEventNames.indexOf(x) >= 0 || Commerce.UserActivityRecorder.isKeyboardEventName(x);
        }
        TestRecorder.isTestRecorderKeyboardEventName = isTestRecorderKeyboardEventName;
        var testRecorderNumpadEventNames = ["mergedclickonnumpad", "mergedfocusandclickonnumpad"];
        function isTestRecorderNumpadEventName(x) {
            return testRecorderNumpadEventNames.indexOf(x) >= 0;
        }
        TestRecorder.isTestRecorderNumpadEventName = isTestRecorderNumpadEventName;
        var testRecorderMouseEventNames = ["mergedclick", "mergeddblclick", "mergedfocusandclick"];
        function isTestRecorderMouseEventName(x) {
            return testRecorderMouseEventNames.indexOf(x) >= 0 || Commerce.UserActivityRecorder.isMouseEventName(x) || isTestRecorderNumpadEventName(x);
        }
        TestRecorder.isTestRecorderMouseEventName = isTestRecorderMouseEventName;
        var testRecorderOngoingEventNames = ["testrecorderongoingkeypressinput"];
        function isTestRecorderOngoingEventName(x) {
            return testRecorderOngoingEventNames.indexOf(x) >= 0;
        }
        TestRecorder.isTestRecorderOngoingEventName = isTestRecorderOngoingEventName;
        var testRecorderSelectEventNames = ["mergedclickonselectvalue", "mergedkeyonselectvalue"];
        function isTestRecorderSelectEventName(x) {
            return testRecorderSelectEventNames.indexOf(x) >= 0;
        }
        TestRecorder.isTestRecorderSelectEventName = isTestRecorderSelectEventName;
        var testRecorderKeyPressNavigationEventNames = ["mergedkeypressnavigation", "mergedkeypressnavigationwithfocus"];
        function isTestRecorderKeyPressNavigationEventName(x) {
            return testRecorderKeyPressNavigationEventNames.indexOf(x) >= 0;
        }
        TestRecorder.isTestRecorderKeyPressNavigationEventName = isTestRecorderKeyPressNavigationEventName;
        var testRecorderValidationEventNames = ["validation"];
        function isTestRecorderValidationEventName(x) {
            return testRecorderValidationEventNames.indexOf(x) >= 0;
        }
        TestRecorder.isTestRecorderValidationEventName = isTestRecorderValidationEventName;
        var testRecorderVariableEventNames = ["variableinput", "variablenumpadbyclick", "variablekeyboard"];
        function isTestRecorderVariableEventName(x) {
            return testRecorderVariableEventNames.indexOf(x) >= 0;
        }
        TestRecorder.isTestRecorderVariableEventName = isTestRecorderVariableEventName;
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var UIEventHelperBase = (function () {
            function UIEventHelperBase(context) {
                this._eventNameResourceMapping = new Commerce.Dictionary();
                this._context = context;
            }
            UIEventHelperBase.prototype.getLocalizedEventName = function (eventName) {
                var localizedEventName;
                if (this._eventNameResourceMapping.hasItem(eventName)) {
                    localizedEventName = this._context.stringResourceManager.getString(this._eventNameResourceMapping.getItem(eventName));
                }
                else {
                    localizedEventName = eventName;
                }
                return localizedEventName;
            };
            UIEventHelperBase.prototype.setEventResourceStringId = function (eventName, resourceStringId) {
                if (Commerce.StringExtensions.isNullOrWhitespace(eventName) || Commerce.StringExtensions.isNullOrWhitespace(resourceStringId)) {
                    return;
                }
                this._eventNameResourceMapping.setItem(eventName, resourceStringId);
            };
            return UIEventHelperBase;
        }());
        UserActivityRecorder.UIEventHelperBase = UIEventHelperBase;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        "use strict";
        var TestRecorderEventHelper = (function (_super) {
            __extends(TestRecorderEventHelper, _super);
            function TestRecorderEventHelper(context) {
                var _this = _super.call(this, context) || this;
                _this.setEventResourceStringId("mergedactionkeyinputentry", "string_10573");
                _this.setEventResourceStringId("mergedkeyinputentry", "string_10573");
                _this.setEventResourceStringId("mergedkeypress", "string_10574");
                _this.setEventResourceStringId("mergedclickonnumpad", "string_10575");
                _this.setEventResourceStringId("mergedfocusandclickonnumpad", "string_10575");
                _this.setEventResourceStringId("mergedclick", "string_10575");
                _this.setEventResourceStringId("mergedclickonselectvalue", "string_10576");
                _this.setEventResourceStringId("mergeddblclick", "string_10577");
                _this.setEventResourceStringId("mergedfocusandclick", "string_10575");
                _this.setEventResourceStringId("mergedkeyonselect", "string_10576");
                _this.setEventResourceStringId("validation", "string_10593");
                _this.setEventResourceStringId("variableinput", "string_10590");
                _this.setEventResourceStringId("variablenumpadbyclick", "string_10591");
                _this.setEventResourceStringId("variablekeyboard", "string_10592");
                _this._mergedEventEventSequences = new Commerce.Dictionary();
                _this.setMergedEventSequence("mergedclick", { eventSequence: _this.createStandardEventSequence(["pointerdown", "mousedown", "pointerup", "mouseup", "click"]) });
                _this.setMergedEventSequence("mergedfocusandclick", { eventSequence: _this.createStandardEventSequence(["pointerdown", "mousedown", "focus", "pointerup", "mouseup", "click"]) });
                _this.setMergedEventSequence("mergedactionkeyinputentry", { eventSequence: _this.createStandardEventSequence(["keydown", "input", "keyup"]) });
                _this.setMergedEventSequence("mergedkeyinputentry", { eventSequence: _this.createStandardEventSequence(["keydown", "keypress", "input", "keyup"]) });
                _this.setMergedEventSequence("mergedkeypress", { eventSequence: _this.createStandardEventSequence(["keydown", "keypress", "keyup"]) });
                _this.setMergedEventSequence("mergedclickonnumpad", {
                    eventSequence: _this.createStandardEventSequence(["pointerdown", "mousedown", "pointerup", "mouseup", "click"]),
                    specialtyNodeInfo: "numpad"
                });
                _this.setMergedEventSequence("mergedfocusandclickonnumpad", {
                    eventSequence: _this.createStandardEventSequence(["pointerdown", "mousedown", "focus", "pointerup", "mouseup", "click"]),
                    specialtyNodeInfo: "numpad"
                });
                _this.setMergedEventSequence("mergedkeyonselect", {
                    eventSequence: _this.createStandardEventSequence(["keydown", "keyup"]),
                    specialtyNodeInfo: "select"
                });
                _this.setMergedEventSequence("mergedkeyonselectvalue", {
                    eventSequence: _this.createStandardEventSequence(["keydown", "change", "keyup"]),
                    specialtyNodeInfo: "select"
                });
                if (context.browserType === Commerce.Client.Entities.BrowserType.Chrome) {
                    _this.setMergedEventSequence("mergedclickonselectvalue", {
                        eventSequence: _this.createStandardEventSequence(["change", "pointerup", "mouseup", "click"]),
                        specialtyNodeInfo: "select"
                    });
                }
                else {
                    _this.setMergedEventSequence("mergedclickonselectvalue", {
                        eventSequence: _this.createStandardEventSequence(["pointerdown", "mousedown", "pointerup", "mouseup", "change", "click"]),
                        specialtyNodeInfo: "select"
                    });
                }
                _this.setMergedEventSequence("mergedkeypressnavigation", {
                    eventSequence: [{ eventName: "keydown" }, { eventName: "keyup", matchingObjectEventIndex: -1 }]
                });
                _this.setMergedEventSequence("mergedkeypressnavigationwithfocus", {
                    eventSequence: [{ eventName: "keydown" },
                        { eventName: "focus", matchingObjectEventIndex: -1 }, { eventName: "keyup" }]
                });
                _this._variableEventSequences = new Commerce.Dictionary();
                _this.setVariableEventSequence("mergedactionkeyinputentry", "variableinput");
                _this.setVariableEventSequence("mergedclickonnumpad", "variablenumpadbyclick");
                _this.setVariableEventSequence("mergedfocusandclickonnumpad", "variablenumpadbyclick");
                _this.setVariableEventSequence("mergedkeyinputentry", "variableinput");
                _this.setVariableEventSequence("mergedkeypress", "variablekeyboard");
                return _this;
            }
            Object.defineProperty(TestRecorderEventHelper.prototype, "mergedEventEventSequences", {
                get: function () {
                    return this._mergedEventEventSequences;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TestRecorderEventHelper.prototype, "variableEventSequences", {
                get: function () {
                    return this._variableEventSequences;
                },
                enumerable: true,
                configurable: true
            });
            TestRecorderEventHelper.prototype.createStandardEventSequence = function (eventNames) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(eventNames)) {
                    return null;
                }
                var eventSequenceEventData = [];
                eventNames.forEach(function (eventName) {
                    eventSequenceEventData.push({ eventName: eventName });
                });
                return eventSequenceEventData;
            };
            TestRecorderEventHelper.prototype.setMergedEventSequence = function (eventName, eventSequence) {
                if (Commerce.StringExtensions.isNullOrWhitespace(eventName) || Commerce.ObjectExtensions.isNullOrUndefined(eventSequence)) {
                    return;
                }
                this._mergedEventEventSequences.setItem(eventName, eventSequence);
            };
            TestRecorderEventHelper.prototype.setVariableEventSequence = function (eventName, eventSequenceName) {
                if (Commerce.StringExtensions.isNullOrWhitespace(eventName) || Commerce.StringExtensions.isNullOrWhitespace(eventSequenceName)) {
                    return;
                }
                this._variableEventSequences.setItem(eventName, eventSequenceName);
            };
            return TestRecorderEventHelper;
        }(Commerce.UserActivityRecorder.UIEventHelperBase));
        TestRecorder.TestRecorderEventHelper = TestRecorderEventHelper;
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
        var UIEventHelper = (function (_super) {
            __extends(UIEventHelper, _super);
            function UIEventHelper(context) {
                var _this = _super.call(this, context) || this;
                _this.setEventResourceStringId("pointerdown", "string_10560");
                _this.setEventResourceStringId("pointerup", "string_10561");
                _this.setEventResourceStringId("mousedown", "string_10562");
                _this.setEventResourceStringId("mouseup", "string_10563");
                _this.setEventResourceStringId("click", "string_10564");
                _this.setEventResourceStringId("dblclick", "string_10565");
                _this.setEventResourceStringId("keydown", "string_10566");
                _this.setEventResourceStringId("keyup", "string_10567");
                _this.setEventResourceStringId("keypress", "string_10568");
                _this.setEventResourceStringId("change", "string_10569");
                _this.setEventResourceStringId("input", "string_10570");
                _this.setEventResourceStringId("focus", "string_10571");
                _this.setEventResourceStringId("resize", "string_10572");
                return _this;
            }
            return UIEventHelper;
        }(UserActivityRecorder.UIEventHelperBase));
        UserActivityRecorder.UIEventHelper = UIEventHelper;
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        "use strict";
        var UIEventHelper = Commerce.UserActivityRecorder.UIEventHelper;
        var UserActivityRecorderEventListenerBase = Commerce.UserActivityRecorder.UserActivityRecorderEventListenerBase;
        var TestRecorderRecordingEventListener = (function (_super) {
            __extends(TestRecorderRecordingEventListener, _super);
            function TestRecorderRecordingEventListener(subscriber, context, eventStopwatch) {
                var _this = _super.call(this, subscriber, context, eventStopwatch) || this;
                _this.DEFAULT_RUN_TIME_FOR_VARIABLE_VALUE_PART_ENTRY_IN_MILLISECONDS = 50;
                _this._uiEventsToMonitor = [
                    "change",
                    "click",
                    "dblclick",
                    "focus",
                    "input",
                    "keydown",
                    "keypress",
                    "keyup",
                    "mousedown",
                    "mouseup",
                    "pointerdown",
                    "pointerup",
                    "resize"
                ];
                _this._lastProgrammaticFocusEventIdentifier = Commerce.StringExtensions.EMPTY;
                _this.testRecorderEventHelper = new TestRecorder.TestRecorderEventHelper(context);
                _this._cachedSteps = [];
                return _this;
            }
            TestRecorderRecordingEventListener.prototype.startListeningAdditionalBehavior = function () {
                this._lastWindowSize = this.getWindowSize();
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._origHTMLElementFocus)) {
                    this._origHTMLElementFocus = HTMLElement.prototype.focus;
                }
                this._lastProgrammaticFocusEventIdentifier = Commerce.StringExtensions.EMPTY;
                var self = this;
                HTMLElement.prototype.focus = function (options) {
                    try {
                        self._lastProgrammaticFocusEventIdentifier = this.outerHTML;
                        self._origHTMLElementFocus.apply(this, options);
                    }
                    catch (e) {
                        var formId = "Unable to compute";
                        var xPath = "Unable to compute";
                        try {
                            formId = self.context.getCurrentViewNameHandler();
                            xPath = self.getXPath(this);
                        }
                        catch (ex) {
                        }
                        Commerce.RetailLogger.testRecorderEventListenerApplyFocusEventFailed(self.Subscriber.CorrelationId, formId, this.id, this.nodeName, xPath);
                    }
                };
            };
            TestRecorderRecordingEventListener.prototype.removeDerivedClassEventListeners = function () {
                HTMLElement.prototype.focus = this._origHTMLElementFocus;
                this._lastProgrammaticFocusEventIdentifier = Commerce.StringExtensions.EMPTY;
            };
            TestRecorderRecordingEventListener.prototype.subscribeToGlobalEvents = function () {
                var _this = this;
                if (this.eventDictionary.length() <= 0) {
                    this._uiEventsToMonitor.forEach(function (eventName) {
                        _this.addEventListener(eventName, _this.eventHandler.bind(_this));
                    });
                }
            };
            TestRecorderRecordingEventListener.prototype.flushCachedEvents = function () {
                var _this = this;
                this._cachedSteps.forEach(function (step) {
                    _super.prototype.addStep.call(_this, step);
                });
                this.clearCachedSteps();
            };
            TestRecorderRecordingEventListener.prototype.addStep = function (step) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(step)) {
                    return;
                }
                var matchingEventSequence = this.getClosestCachedSequenceForNewStep(step);
                if (Commerce.ObjectExtensions.isNullOrUndefined(matchingEventSequence)) {
                    this.flushCachedEvents();
                    var lastStep = this.Subscriber.getLastValueIfStep();
                    if (this.isSameVariableObject(lastStep, step)) {
                        var lastStepInfo = JSON.parse(lastStep.Arguments[0].Value);
                        var stepInfo = JSON.parse(step.Arguments[0].Value);
                        stepInfo.valuePartsIncrementalTime = this.DEFAULT_RUN_TIME_FOR_VARIABLE_VALUE_PART_ENTRY_IN_MILLISECONDS;
                        switch (lastStepInfo.mergedEventType) {
                            case "Click":
                                if (stepInfo.specialtyNodeInfo === "numpad") {
                                    step.Description = this.getActionTextForNumpadVariableEvent(stepInfo.variableValue.value, stepInfo.isSensitiveData);
                                    step.Arguments[0].Value = JSON.stringify(stepInfo);
                                }
                                break;
                            case "Keyboard":
                                stepInfo.variableValue.value = lastStepInfo.variableValue.value + stepInfo.variableValue.value;
                                step.Description = this.getActionTextForKeyboardVariableEvent(stepInfo.variableValue.value, stepInfo.isSensitiveData);
                                step.Arguments[0].Value = JSON.stringify(stepInfo);
                                break;
                        }
                        var additionalDataToLog = {
                            secondaryControlName: stepInfo.secondaryControlName,
                            isSensitiveData: stepInfo.isSensitiveData,
                            specialtyNodeInfo: stepInfo.specialtyNodeInfo
                        };
                        Commerce.RetailLogger.testRecorderEventListenerReplaceVariableValue(this.Subscriber.CorrelationId, step.FormId, step.ControlName, step.ControlType, JSON.stringify(additionalDataToLog));
                        this.Subscriber.replaceLastValueIfStep(step);
                    }
                    else if (this.isStepForWindowResizeEvent(lastStep) && this.isStepForWindowResizeEvent(step)) {
                        var lastStepInfo = JSON.parse(lastStep.Arguments[0].Value);
                        var stepInfo = JSON.parse(step.Arguments[0].Value);
                        stepInfo.valuePartsIncrementalTime = Math.ceil((lastStepInfo.valuePartsIncrementalTime + stepInfo.valuePartsIncrementalTime) / 2);
                        step.Arguments[0].Value = JSON.stringify(stepInfo);
                        Commerce.RetailLogger.testRecorderEventListenerReplaceResizeEvent(this.Subscriber.CorrelationId, step.FormId);
                        this.Subscriber.replaceLastValueIfStep(step);
                    }
                    else {
                        _super.prototype.addStep.call(this, step);
                    }
                }
                else if (matchingEventSequence.sequenceDelta === 0) {
                    this.addStepToCachedSteps(step);
                    this.mergeAndAddCachedSteps(matchingEventSequence.sequenceEventName);
                    this.flushCachedEvents();
                }
                else if (Commerce.TestRecorder.isTestRecorderOngoingEventName(matchingEventSequence.sequenceEventName)) {
                    this.addStepToCachedSteps(step);
                    if (!this.handleMergeOfOngoingCachedSteps(matchingEventSequence.sequenceEventName)) {
                        this.flushCachedEvents();
                    }
                }
                else {
                    this.addStepToCachedSteps(step);
                }
                this.onStepCreated();
            };
            TestRecorderRecordingEventListener.prototype.mergeAndAddCachedSteps = function (sequenceEventName) {
                var _this = this;
                var stepsToAdd = this.mergeSteps(sequenceEventName, this._cachedSteps);
                if (Commerce.ArrayExtensions.hasElements(stepsToAdd)) {
                    this.clearCachedSteps();
                    stepsToAdd.forEach(function (step) {
                        _this.addStep(step);
                    });
                }
                else {
                    this.flushCachedEvents();
                }
            };
            TestRecorderRecordingEventListener.prototype.handleMergeOfOngoingCachedSteps = function (ongoingSequenceEventName) {
                var ongoingEventSequenceHandled = false;
                if (Commerce.TestRecorder.isTestRecorderOngoingEventName(ongoingSequenceEventName)) {
                    ongoingEventSequenceHandled = true;
                    switch (ongoingSequenceEventName) {
                        case "testrecorderongoingkeypressinput":
                            this.handleKeyPressInputOngoingSequence();
                            break;
                        default:
                            ongoingEventSequenceHandled = false;
                            Commerce.RetailLogger.testRecorderEventListenerOngoingSequenceEventNameIsNotSupported(this.Subscriber.CorrelationId, ongoingSequenceEventName);
                            break;
                    }
                }
                return ongoingEventSequenceHandled;
            };
            TestRecorderRecordingEventListener.prototype.handleKeyPressInputOngoingSequence = function () {
                var _this = this;
                var sequenceEventNamesToCheck = ["mergedkeyinputentry", "mergedkeypress"];
                var sequenceEventName = Commerce.StringExtensions.EMPTY;
                var listOfIndexesOfFoundSteps = [];
                for (var sequenceEventNameIndex = 0; sequenceEventNameIndex < sequenceEventNamesToCheck.length; sequenceEventNameIndex++) {
                    var sequenceEventNameToCheck = sequenceEventNamesToCheck[sequenceEventNameIndex];
                    listOfIndexesOfFoundSteps = this.findRepeatedMergedEventStepsInCachedStepsForLatestStep(sequenceEventNameToCheck);
                    if (Commerce.ArrayExtensions.hasElements(listOfIndexesOfFoundSteps)) {
                        sequenceEventName = sequenceEventNameToCheck;
                        break;
                    }
                }
                if (!Commerce.StringExtensions.isEmptyOrWhitespace(sequenceEventName)) {
                    var listOfMergedEvents_1 = [];
                    var indexesAdded_1 = [];
                    listOfIndexesOfFoundSteps.forEach(function (indexesOfFoundStepsInCache) {
                        var mergedEventSteps = [];
                        indexesOfFoundStepsInCache.forEach(function (indexOfFoundStepInCache) {
                            var cachedStep = Commerce.ObjectExtensions.clone(_this._cachedSteps[indexOfFoundStepInCache]);
                            mergedEventSteps.push(cachedStep);
                            indexesAdded_1.push(indexOfFoundStepInCache);
                        });
                        var mergedEvents = _this.mergeSteps(sequenceEventName, mergedEventSteps);
                        listOfMergedEvents_1.push(mergedEvents);
                    });
                    indexesAdded_1 = indexesAdded_1.sort(function (a, b) {
                        return b - a;
                    });
                    var lastIndexRemoved_1 = -1;
                    indexesAdded_1.forEach(function (indexAdded) {
                        if (indexAdded !== lastIndexRemoved_1) {
                            _this._cachedSteps.splice(indexAdded, 1);
                            lastIndexRemoved_1 = indexAdded;
                        }
                    });
                    var remainingCachedSteps = this._cachedSteps.splice(0, this._cachedSteps.length);
                    listOfMergedEvents_1.forEach(function (mergedEvents) {
                        mergedEvents.forEach(function (mergedEvent) {
                            _this.addStep(mergedEvent);
                        });
                    });
                    remainingCachedSteps.forEach(function (remainingCachedStep) {
                        _this.addStep(remainingCachedStep);
                    });
                }
            };
            TestRecorderRecordingEventListener.prototype.eventHandler = function (event) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(event)) {
                    return;
                }
                if (Commerce.UserActivityRecorder.isUIEventName(event.type)) {
                    switch (event.type) {
                        case "change":
                            this.handleChangeEvent(event);
                            break;
                        case "focus":
                            this.handleFocusEvent(event);
                            break;
                        case "input":
                            this.handleInputEvent(event);
                            break;
                        case "keydown":
                        case "keypress":
                        case "keyup":
                            if (event instanceof KeyboardEvent) {
                                this.handleKeyEvent(event);
                            }
                            break;
                        case "click":
                        case "dblclick":
                        case "mousedown":
                        case "mouseup":
                        case "pointerdown":
                        case "pointerup":
                            this.handleMouseEvent(event);
                            break;
                        case "resize":
                            this.handleResizeEvent(event);
                            break;
                    }
                }
            };
            TestRecorderRecordingEventListener.prototype.handleChangeEvent = function (event) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(event)) {
                    return;
                }
                var element = event.target;
                if (Commerce.ObjectExtensions.isNullOrUndefined(element) && (event.target instanceof Element)) {
                    element = event.target;
                }
                var doesElementHaveSensitiveData = this.doesElementHaveSensitiveData(element);
                var selectElement = null;
                if (element instanceof HTMLSelectElement) {
                    selectElement = element;
                    var $selectedElement = $(element).find("option:selected");
                    if ($selectedElement.length >= 1) {
                        element = $selectedElement[0];
                        doesElementHaveSensitiveData = doesElementHaveSensitiveData || this.doesElementHaveSensitiveData(element);
                    }
                }
                if (element instanceof HTMLOptionElement) {
                    if (!this.isEventInControlToNotRecord(element)) {
                        var commandName = event.type;
                        var nodeName = Commerce.StringExtensions.isNullOrWhitespace(element.nodeName) ? Commerce.StringExtensions.EMPTY
                            : element.nodeName.toLowerCase();
                        var additionalControlIdentifiers = this.getAdditionalControlIdentifiers(element);
                        var friendlyDescription = this.getFriendlyDescriptionForElement(selectElement);
                        if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                            friendlyDescription = Commerce.StringExtensions.EMPTY;
                        }
                        var displayValue = element.innerText;
                        var nodeAttributeTypeName = Commerce.DOMHelper.getAttributeValue(element, "type");
                        var stepInfo = {
                            secondaryControlName: this.getXPath(element),
                            timeSinceLastEvent: this.getTimeSinceLastEvent(),
                            displayValue: displayValue,
                            nodeName: nodeName,
                            nodeAttributeTypeName: nodeAttributeTypeName,
                            friendlyControlName: friendlyDescription,
                            additionalControlIdentifiers: additionalControlIdentifiers,
                            specialtyNodeInfo: "select"
                        };
                        if (doesElementHaveSensitiveData) {
                            stepInfo.isSensitiveData = true;
                            stepInfo.sensitiveDataKey = this.getSensitiveDataKey(element);
                        }
                        else {
                            stepInfo.value = element.value;
                        }
                        var actionText = this.getActionTextForChangeEvent(stepInfo);
                        var primaryControlName = nodeName;
                        var controlType = Commerce.StringExtensions.EMPTY;
                        var command = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewCommand(Commerce.StringExtensions.EMPTY, commandName, actionText, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, stepInfo, primaryControlName, controlType, this.context.getCurrentViewNameHandler());
                        var additionalDataToLog = {
                            secondaryControlName: stepInfo.secondaryControlName,
                            isSensitiveData: stepInfo.isSensitiveData,
                            specialtyNodeInfo: stepInfo.specialtyNodeInfo
                        };
                        Commerce.RetailLogger.testRecorderEventListenerHandleChangeEvent(this.Subscriber.CorrelationId, command.FormId, command.CommandName, command.ControlName, JSON.stringify(additionalDataToLog));
                        this.addStep(command);
                    }
                }
            };
            TestRecorderRecordingEventListener.prototype.handleFocusEvent = function (event) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(event)) {
                    return;
                }
                if (this.isMiddleButtonClicked(event)) {
                    return;
                }
                if (event.target instanceof Element) {
                    var element = event.target;
                    var focusEventIdentifier = element.outerHTML;
                    if (!this.isEventInControlToNotRecord(element) &&
                        (focusEventIdentifier !== this._lastProgrammaticFocusEventIdentifier) &&
                        !element.classList.contains("invokeValidateHiddenButton")) {
                        var specialtyNodeInfo = Commerce.StringExtensions.EMPTY;
                        if (this.isEventButtonInNumpad(event)) {
                            specialtyNodeInfo = "numpad";
                        }
                        else if (this.isEventInSelect(event)) {
                            specialtyNodeInfo = "select";
                        }
                        var additionalControlIdentifiers = this.getAdditionalControlIdentifiers(element);
                        var nodeName = Commerce.StringExtensions.isNullOrWhitespace(element.nodeName) ? Commerce.StringExtensions.EMPTY
                            : element.nodeName.toLowerCase();
                        var nodeAttributeTypeName = Commerce.DOMHelper.getAttributeValue(element, "type");
                        var targetTextString = this.getElementText(element);
                        var friendlyDescription = this.getFriendlyDescriptionForElement(element);
                        var commandName = event.type;
                        var stepInfo = {
                            secondaryControlName: this.getXPath(element),
                            timeSinceLastEvent: this.getTimeSinceLastEvent(),
                            targetContent: targetTextString,
                            nodeName: nodeName,
                            nodeAttributeTypeName: nodeAttributeTypeName,
                            friendlyControlName: friendlyDescription,
                            additionalControlIdentifiers: additionalControlIdentifiers,
                            specialtyNodeInfo: specialtyNodeInfo
                        };
                        var actionText = this.getActionTextForFocusEvent(friendlyDescription, stepInfo);
                        var primaryControlName = nodeName;
                        var controlType = Commerce.StringExtensions.EMPTY;
                        var command = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewCommand(Commerce.StringExtensions.EMPTY, commandName, actionText, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, stepInfo, primaryControlName, controlType, this.context.getCurrentViewNameHandler());
                        var additionalDataToLog = {
                            secondaryControlName: stepInfo.secondaryControlName,
                            isSensitiveData: stepInfo.isSensitiveData,
                            specialtyNodeInfo: stepInfo.specialtyNodeInfo
                        };
                        Commerce.RetailLogger.testRecorderEventListenerHandleFocusEvent(this.Subscriber.CorrelationId, command.FormId, command.CommandName, command.ControlName, JSON.stringify(additionalDataToLog));
                        this.addStep(command);
                    }
                }
                this._lastProgrammaticFocusEventIdentifier = Commerce.StringExtensions.EMPTY;
            };
            TestRecorderRecordingEventListener.prototype.handleInputEvent = function (event) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(event)) {
                    return;
                }
                var element = !Commerce.ObjectExtensions.isNullOrUndefined(event.srcElement) ? event.srcElement : event.target;
                if ((element instanceof HTMLInputElement) || (element instanceof HTMLTextAreaElement)) {
                    if (!this.isEventInControlToNotRecord(element)) {
                        var commandName = event.type;
                        var nodeName = Commerce.StringExtensions.isNullOrWhitespace(element.nodeName) ? Commerce.StringExtensions.EMPTY
                            : element.nodeName.toLowerCase();
                        var nodeAttributeTypeName = Commerce.DOMHelper.getAttributeValue(element, "type");
                        var additionalControlIdentifiers = this.getAdditionalControlIdentifiers(element);
                        var friendlyDescription = this.getFriendlyDescriptionForElement(element);
                        if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                            friendlyDescription = Commerce.StringExtensions.EMPTY;
                        }
                        var stepInfo = {
                            secondaryControlName: this.getXPath(element),
                            timeSinceLastEvent: this.getTimeSinceLastEvent(),
                            nodeName: nodeName,
                            nodeAttributeTypeName: nodeAttributeTypeName,
                            friendlyControlName: friendlyDescription,
                            additionalControlIdentifiers: additionalControlIdentifiers
                        };
                        if (this.doesElementHaveSensitiveData(element)) {
                            stepInfo.isSensitiveData = true;
                            stepInfo.sensitiveDataKey = this.getSensitiveDataKey(element);
                        }
                        else {
                            stepInfo.value = element.value;
                        }
                        var actionText = this.getActionTextForInputEvent(stepInfo);
                        var primaryControlName = nodeName;
                        var controlType = Commerce.StringExtensions.EMPTY;
                        var command = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewCommand(Commerce.StringExtensions.EMPTY, commandName, actionText, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, stepInfo, primaryControlName, controlType, this.context.getCurrentViewNameHandler());
                        var additionalDataToLog = {
                            secondaryControlName: stepInfo.secondaryControlName,
                            isSensitiveData: stepInfo.isSensitiveData,
                            specialtyNodeInfo: stepInfo.specialtyNodeInfo
                        };
                        Commerce.RetailLogger.testRecorderEventListenerHandleInputEvent(this.Subscriber.CorrelationId, command.FormId, command.CommandName, command.ControlName, JSON.stringify(additionalDataToLog));
                        this.addStep(command);
                    }
                }
            };
            TestRecorderRecordingEventListener.prototype.handleKeyEvent = function (event) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(event)) {
                    return;
                }
                var eventShouldBeIgnored = !Commerce.ObjectExtensions.isNullOrUndefined(event.target)
                    && (event.target instanceof Element)
                    && this.isEventInControlToNotRecord(event.target);
                if (event.keyCode >= 16 && event.keyCode <= 20) {
                    eventShouldBeIgnored = true;
                }
                else if (event.keyCode >= 144 && event.keyCode <= 145) {
                    eventShouldBeIgnored = true;
                }
                else if (event.key.toLowerCase() === "unidentified") {
                    eventShouldBeIgnored = true;
                }
                if (!eventShouldBeIgnored) {
                    var commandName = event.type;
                    var specialtyNodeInfo = Commerce.StringExtensions.EMPTY;
                    if (this.isEventInSelect(event)) {
                        specialtyNodeInfo = "select";
                    }
                    var normalizedKeyCode = event.key.length !== 1 ? event.keyCode : event.key.charCodeAt(0);
                    var element = $(event.target)[0];
                    var stepInfo = {
                        keyCode: event.keyCode,
                        altKey: event.altKey,
                        ctrlKey: event.ctrlKey,
                        shiftKey: event.shiftKey,
                        charCode: event.charCode,
                        key: event.key,
                        normalizedKeyCode: normalizedKeyCode,
                        friendlyControlName: this.getFriendlyDescriptionForElement(element),
                        secondaryControlName: this.getXPath(element),
                        timeSinceLastEvent: this.getTimeSinceLastEvent(),
                        specialtyNodeInfo: specialtyNodeInfo
                    };
                    if (!this.isCommandKey(stepInfo) && this.doesElementHaveSensitiveData(element)) {
                        stepInfo.keyCode = -1;
                        stepInfo.altKey = false;
                        stepInfo.ctrlKey = false;
                        stepInfo.shiftKey = false;
                        stepInfo.charCode = -1;
                        stepInfo.key = Commerce.StringExtensions.EMPTY;
                        stepInfo.normalizedKeyCode = -1;
                        stepInfo.isSensitiveData = true;
                    }
                    var actionText = this.getActionTextForKeyboardEvent(commandName, stepInfo);
                    var primaryControlName = Commerce.StringExtensions.isNullOrWhitespace(element.nodeName) ? "keyboard"
                        : element.nodeName.toLowerCase();
                    var controlType = Commerce.StringExtensions.EMPTY;
                    var command = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewCommand(Commerce.StringExtensions.EMPTY, commandName, actionText, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, stepInfo, primaryControlName, controlType, this.context.getCurrentViewNameHandler());
                    var additionalDataToLog = {
                        secondaryControlName: stepInfo.secondaryControlName,
                        isSensitiveData: stepInfo.isSensitiveData,
                        specialtyNodeInfo: stepInfo.specialtyNodeInfo
                    };
                    Commerce.RetailLogger.testRecorderEventListenerHandleKeyEvent(this.Subscriber.CorrelationId, command.FormId, command.CommandName, command.ControlName, JSON.stringify(additionalDataToLog));
                    this.addStep(command);
                }
            };
            TestRecorderRecordingEventListener.prototype.handleMouseEvent = function (event) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(event)) {
                    return;
                }
                if (this.isMiddleButtonClicked(event)) {
                    return;
                }
                if (event.target instanceof Element) {
                    var element = event.target;
                    var doesElementHaveSensitiveData = false;
                    if (!this.isEventInControlToNotRecord(element) &&
                        !element.classList.contains("invokeValidateHiddenButton")) {
                        var buttonInNumpadElement = this.getEventButtonInNumpad(event);
                        if (!buttonInNumpadElement || (event.type !== "dblclick")) {
                            var nodeName = void 0;
                            var controlElement = void 0;
                            var value = void 0;
                            var specialtyNodeInfo = void 0;
                            var stepInfo = void 0;
                            var numpadStepInfo = void 0;
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(buttonInNumpadElement)) {
                                nodeName = "button";
                                specialtyNodeInfo = "numpad";
                                var isNumpadValueButton = this.isNumpadValueButton(buttonInNumpadElement);
                                if (isNumpadValueButton) {
                                    controlElement = this.getEventNumpadElement(event);
                                    value = this.getNumpadInputValue(controlElement);
                                    doesElementHaveSensitiveData = doesElementHaveSensitiveData ||
                                        this.doesElementHaveSensitiveData(this.getNumpadInputElement(controlElement));
                                }
                                else {
                                    controlElement = element;
                                    value = buttonInNumpadElement.getAttribute("value");
                                    if (Commerce.StringExtensions.isNullOrWhitespace(value)) {
                                        value = this.getElementText(element);
                                    }
                                }
                                doesElementHaveSensitiveData = doesElementHaveSensitiveData || this.doesElementHaveSensitiveData(controlElement);
                                numpadStepInfo = {
                                    isValue: isNumpadValueButton
                                };
                                stepInfo = numpadStepInfo;
                            }
                            else {
                                specialtyNodeInfo = Commerce.StringExtensions.EMPTY;
                                if (this.isEventInSelect(event)) {
                                    specialtyNodeInfo = "select";
                                }
                                nodeName = Commerce.StringExtensions.isNullOrWhitespace(element.nodeName) ? Commerce.StringExtensions.EMPTY
                                    : element.nodeName.toLowerCase();
                                controlElement = element;
                                value = Commerce.StringExtensions.EMPTY;
                                stepInfo = {};
                            }
                            var additionalControlIdentifiers = this.getAdditionalControlIdentifiers(controlElement);
                            var friendlyDescription = this.getFriendlyDescriptionForElement(element);
                            if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                                if (this.doesElementHaveSensitiveData(element)) {
                                    friendlyDescription = this.MASKED_VALUE;
                                }
                            }
                            var commandName = event.type;
                            var targetTextString = this.getElementText(controlElement);
                            var nodeAttributeTypeName = Commerce.DOMHelper.getAttributeValue(element, "type");
                            stepInfo.value = value;
                            stepInfo.secondaryControlName = this.getXPath(controlElement);
                            stepInfo.timeSinceLastEvent = this.getTimeSinceLastEvent();
                            stepInfo.targetContent = targetTextString;
                            stepInfo.nodeName = nodeName;
                            nodeAttributeTypeName = nodeAttributeTypeName;
                            stepInfo.friendlyControlName = friendlyDescription;
                            stepInfo.additionalControlIdentifiers = additionalControlIdentifiers;
                            stepInfo.specialtyNodeInfo = specialtyNodeInfo;
                            if (doesElementHaveSensitiveData) {
                                stepInfo.isSensitiveData = true;
                            }
                            var primaryControlName = nodeName;
                            var controlType = Commerce.StringExtensions.EMPTY;
                            var actionText = this.getActionTextForMouseEventByStepInfo(event.type, stepInfo);
                            var command = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewCommand(Commerce.StringExtensions.EMPTY, commandName, actionText, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, stepInfo, primaryControlName, controlType, this.context.getCurrentViewNameHandler());
                            var additionalDataToLog = {
                                secondaryControlName: stepInfo.secondaryControlName,
                                isSensitiveData: stepInfo.isSensitiveData,
                                specialtyNodeInfo: stepInfo.specialtyNodeInfo
                            };
                            Commerce.RetailLogger.testRecorderEventListenerHandleMouseEvent(this.Subscriber.CorrelationId, command.FormId, command.CommandName, primaryControlName, JSON.stringify(additionalDataToLog));
                            this.addStep(command);
                        }
                    }
                }
            };
            TestRecorderRecordingEventListener.prototype.handleResizeEvent = function (event) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(event)) {
                    return;
                }
                var windowSize = this.getWindowSize();
                if ((windowSize.height === this._lastWindowSize.height) && (windowSize.width === this._lastWindowSize.width)) {
                    return;
                }
                else {
                    this._lastWindowSize = windowSize;
                }
                var stepInfo = {
                    secondaryControlName: Commerce.StringExtensions.EMPTY,
                    timeSinceLastEvent: this.getTimeSinceLastEvent(),
                    value: windowSize
                };
                var commandName = event.type;
                var primaryControlName = "window";
                var controlType = Commerce.StringExtensions.EMPTY;
                var actionText = this.getActionTextForWindowResizeEvent(windowSize);
                var command = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewCommand(Commerce.StringExtensions.EMPTY, commandName, actionText, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, stepInfo, primaryControlName, controlType, this.context.getCurrentViewNameHandler());
                Commerce.RetailLogger.testRecorderEventListenerHandleResizeEvent(this.Subscriber.CorrelationId, command.FormId, windowSize.width, windowSize.height);
                this.addStep(command);
            };
            TestRecorderRecordingEventListener.prototype.getActionTextForChangeEvent = function (changeStepInfo, isSensitiveData) {
                if (isSensitiveData === void 0) { isSensitiveData = false; }
                var actionText;
                var displayValue = changeStepInfo.displayValue;
                if (Commerce.StringExtensions.isNullOrWhitespace(displayValue)) {
                    displayValue = changeStepInfo.value;
                }
                if (isSensitiveData || changeStepInfo.isSensitiveData) {
                    displayValue = this.MASKED_VALUE;
                }
                var controlDescription = changeStepInfo.friendlyControlName;
                if (!Commerce.StringExtensions.isNullOrWhitespace(controlDescription)) {
                    var displayString = this.context.stringResourceManager.getString("string_10708");
                    actionText = Commerce.StringExtensions.format(displayString, controlDescription, displayValue);
                }
                else {
                    var localizedNodeName = Commerce.DOMHelper.getLocalizedElementName(this.context, changeStepInfo.nodeName, changeStepInfo.nodeAttributeTypeName);
                    var displayString = this.context.stringResourceManager.getString("string_10709");
                    actionText = Commerce.StringExtensions.format(displayString, localizedNodeName, displayValue);
                }
                return actionText;
            };
            TestRecorderRecordingEventListener.prototype.getActionTextForFocusEvent = function (targetContent, stepInfo) {
                var actionText;
                if (!Commerce.StringExtensions.isNullOrWhitespace(targetContent)) {
                    var displayString = this.context.stringResourceManager.getString("string_10711");
                    actionText = Commerce.StringExtensions.format(displayString, targetContent);
                }
                else {
                    var displayString = this.context.stringResourceManager.getString("string_10712");
                    var localizedNodeName = Commerce.DOMHelper.getLocalizedElementName(this.context, stepInfo.nodeName, stepInfo.nodeAttributeTypeName);
                    actionText = Commerce.StringExtensions.format(displayString, localizedNodeName);
                }
                return actionText;
            };
            TestRecorderRecordingEventListener.prototype.getActionTextForInputEvent = function (inputStepInfo, keyStepInfo, isSensitiveData) {
                if (keyStepInfo === void 0) { keyStepInfo = null; }
                if (isSensitiveData === void 0) { isSensitiveData = false; }
                if (Commerce.ObjectExtensions.isNullOrUndefined(inputStepInfo)) {
                    return Commerce.StringExtensions.EMPTY;
                }
                var value = inputStepInfo.value;
                if (isSensitiveData || inputStepInfo.isSensitiveData) {
                    value = this.MASKED_VALUE;
                }
                var actionText;
                var localizedKeyName = Commerce.ObjectExtensions.isNullOrUndefined(keyStepInfo) ? Commerce.StringExtensions.EMPTY : this.getKeyName(keyStepInfo);
                var controlDescription = inputStepInfo.friendlyControlName;
                if (Commerce.StringExtensions.isNullOrWhitespace(localizedKeyName) && Commerce.StringExtensions.isNullOrWhitespace(controlDescription)) {
                    var displayString = this.context.stringResourceManager.getString("string_10707");
                    var localizedNodeName = Commerce.DOMHelper.getLocalizedElementName(this.context, inputStepInfo.nodeName, inputStepInfo.nodeAttributeTypeName);
                    actionText = Commerce.StringExtensions.format(displayString, localizedNodeName, value);
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(controlDescription)) {
                    var displayString = this.context.stringResourceManager.getString("string_10706");
                    var localizedNodeName = Commerce.DOMHelper.getLocalizedElementName(this.context, inputStepInfo.nodeName, inputStepInfo.nodeAttributeTypeName);
                    actionText = Commerce.StringExtensions.format(displayString, localizedNodeName, value, localizedKeyName);
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(localizedKeyName)) {
                    var displayString = this.context.stringResourceManager.getString("string_10705");
                    actionText = Commerce.StringExtensions.format(displayString, controlDescription, value);
                }
                else {
                    var displayString = this.context.stringResourceManager.getString("string_10704");
                    actionText = Commerce.StringExtensions.format(displayString, controlDescription, value, localizedKeyName);
                }
                return actionText;
            };
            TestRecorderRecordingEventListener.prototype.getActionTextForKeyboardEvent = function (commandName, stepInfo, isSensitiveData) {
                if (isSensitiveData === void 0) { isSensitiveData = false; }
                var localizedKeyName;
                if (isSensitiveData || stepInfo.isSensitiveData) {
                    localizedKeyName = this.MASKED_CHARACTER_VALUE;
                }
                else {
                    localizedKeyName = this.getKeyName(stepInfo);
                }
                var actionText;
                var localizedEventName = this.getLocalizedEventName(commandName);
                var controlDescription = stepInfo.friendlyControlName;
                if (!Commerce.StringExtensions.isNullOrWhitespace(controlDescription)) {
                    var displayString = this.context.stringResourceManager.getString("string_10702");
                    actionText = Commerce.StringExtensions.format(displayString, localizedEventName, localizedKeyName, controlDescription);
                }
                else {
                    var displayString = this.context.stringResourceManager.getString("string_10703");
                    actionText = Commerce.StringExtensions.format(displayString, localizedEventName, localizedKeyName);
                }
                return actionText;
            };
            TestRecorderRecordingEventListener.prototype.getActionTextForKeyboardVariableEvent = function (targetContent, isSensitiveData) {
                if (isSensitiveData) {
                    targetContent = this.MASKED_VALUE;
                }
                var displayString = this.context.stringResourceManager.getString("string_10714");
                var actionText = Commerce.StringExtensions.format(displayString, targetContent);
                return actionText;
            };
            TestRecorderRecordingEventListener.prototype.getActionTextForMouseEvent = function (eventType, targetContent, nodeName, nodeAttributeTypeName, isSensitiveData) {
                if (isSensitiveData === void 0) { isSensitiveData = false; }
                if (isSensitiveData) {
                    targetContent = this.MASKED_VALUE;
                }
                var actionText;
                var localizedEventName = this.getLocalizedEventName(eventType);
                if (!Commerce.StringExtensions.isNullOrWhitespace(targetContent)) {
                    var displayString = this.context.stringResourceManager.getString("string_10700");
                    actionText = Commerce.StringExtensions.format(displayString, localizedEventName, targetContent);
                }
                else {
                    var displayString = this.context.stringResourceManager.getString("string_10701");
                    var localizedNodeName = Commerce.DOMHelper.getLocalizedElementName(this.context, nodeName, nodeAttributeTypeName);
                    actionText = Commerce.StringExtensions.format(displayString, localizedEventName, localizedNodeName);
                }
                return actionText;
            };
            TestRecorderRecordingEventListener.prototype.getActionTextForMouseEventByStepInfo = function (eventType, stepInfo, isSensitiveData) {
                if (isSensitiveData === void 0) { isSensitiveData = false; }
                if (Commerce.ObjectExtensions.isNullOrUndefined(stepInfo)) {
                    return Commerce.StringExtensions.EMPTY;
                }
                var targetContent = Commerce.StringExtensions.isNullOrWhitespace(stepInfo.friendlyControlName) ?
                    stepInfo.targetContent : stepInfo.friendlyControlName;
                isSensitiveData = stepInfo.isSensitiveData || isSensitiveData;
                return this.getActionTextForMouseEvent(eventType, targetContent, stepInfo.nodeName, stepInfo.nodeAttributeTypeName, isSensitiveData);
            };
            TestRecorderRecordingEventListener.prototype.getActionTextForNumpadVariableEvent = function (targetContent, isSensitiveData) {
                if (isSensitiveData) {
                    targetContent = this.MASKED_VALUE;
                }
                var displayString = this.context.stringResourceManager.getString("string_10713");
                var actionText = Commerce.StringExtensions.format(displayString, targetContent);
                return actionText;
            };
            TestRecorderRecordingEventListener.prototype.getActionTextForKeyPressNavigationEvent = function (keyStepsInfo) {
                var actionText;
                if (!Commerce.ArrayExtensions.hasElements(keyStepsInfo) || (keyStepsInfo.length < 2)) {
                    actionText = this.context.stringResourceManager.getString("string_10717");
                }
                else {
                    var startingElementName = keyStepsInfo[0].friendlyControlName;
                    var endingElementName = keyStepsInfo[keyStepsInfo.length - 1].friendlyControlName;
                    var keyName = this.getKeyName(keyStepsInfo[0]);
                    if (Commerce.StringExtensions.isNullOrWhitespace(startingElementName) && Commerce.StringExtensions.isNullOrWhitespace(endingElementName)) {
                        var displayString = this.context.stringResourceManager.getString("string_10718");
                        actionText = Commerce.StringExtensions.format(displayString, keyName);
                    }
                    else if (Commerce.StringExtensions.isNullOrWhitespace(startingElementName)) {
                        var displayString = this.context.stringResourceManager.getString("string_10719");
                        actionText = Commerce.StringExtensions.format(displayString, keyName, endingElementName);
                    }
                    else if (Commerce.StringExtensions.isNullOrWhitespace(endingElementName)) {
                        var displayString = this.context.stringResourceManager.getString("string_10720");
                        actionText = Commerce.StringExtensions.format(displayString, keyName, startingElementName);
                    }
                    else {
                        var displayString = this.context.stringResourceManager.getString("string_10721");
                        actionText = Commerce.StringExtensions.format(displayString, keyName, startingElementName, endingElementName);
                    }
                }
                return actionText;
            };
            TestRecorderRecordingEventListener.prototype.getActionTextForWindowResizeEvent = function (windowSize) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(windowSize)) {
                    return Commerce.StringExtensions.EMPTY;
                }
                var formattedWidth = Commerce.NumberExtensions.formatNumber(windowSize.width, 0);
                var formattedHeight = Commerce.NumberExtensions.formatNumber(windowSize.height, 0);
                var displayString = this.context.stringResourceManager.getString("string_10710");
                var actionText = Commerce.StringExtensions.format(displayString, formattedWidth, formattedHeight);
                return actionText;
            };
            TestRecorderRecordingEventListener.prototype.getKeyName = function (stepInfo) {
                var keyNameParts = [];
                if (stepInfo.ctrlKey) {
                    keyNameParts.push(this.context.stringResourceManager.getString("string_10551"));
                }
                if (stepInfo.altKey) {
                    keyNameParts.push(this.context.stringResourceManager.getString("string_10552"));
                }
                switch (stepInfo.keyCode) {
                    case 8:
                        keyNameParts.push(this.context.stringResourceManager.getString("string_10553"));
                        break;
                    case 9:
                        keyNameParts.push(this.context.stringResourceManager.getString("string_10554"));
                        break;
                    case 13:
                        keyNameParts.push(this.context.stringResourceManager.getString("string_10555"));
                        break;
                    case 32:
                        keyNameParts.push(this.context.stringResourceManager.getString("string_10556"));
                        break;
                    case 37:
                        keyNameParts.push(this.context.stringResourceManager.getString("string_10578"));
                        break;
                    case 38:
                        keyNameParts.push(this.context.stringResourceManager.getString("string_10579"));
                        break;
                    case 39:
                        keyNameParts.push(this.context.stringResourceManager.getString("string_10580"));
                        break;
                    case 40:
                        keyNameParts.push(this.context.stringResourceManager.getString("string_10581"));
                        break;
                    case 127:
                        keyNameParts.push(this.context.stringResourceManager.getString("string_10557"));
                        break;
                    default:
                        if (stepInfo.key.length > 1) {
                            keyNameParts.push(stepInfo.key);
                        }
                        else {
                            keyNameParts.push(String.fromCharCode(stepInfo.normalizedKeyCode));
                        }
                        break;
                }
                var keyName = keyNameParts.length > 0 ? keyNameParts[0] : Commerce.StringExtensions.EMPTY;
                if (keyNameParts.length > 1) {
                    var separatorFormat = this.context.stringResourceManager.getString("string_10558");
                    for (var keyNamePartsIndex = 1; keyNamePartsIndex < keyNameParts.length; keyNamePartsIndex++) {
                        if (!Commerce.StringExtensions.isNullOrWhitespace(keyNameParts[keyNamePartsIndex])) {
                            keyName = Commerce.StringExtensions.format(separatorFormat, keyName, keyNameParts[keyNamePartsIndex]);
                        }
                    }
                }
                return keyName;
            };
            TestRecorderRecordingEventListener.prototype.getClosestCachedSequenceForNewStep = function (step) {
                var _this = this;
                var isSameObjectAsLastStep = true;
                if (this._cachedSteps.length > 0) {
                    isSameObjectAsLastStep = this.isSameEventObject(this._cachedSteps[this._cachedSteps.length - 1], step);
                }
                var currentEventSequence = [];
                this._cachedSteps.forEach(function (cachedStep) {
                    currentEventSequence.push(cachedStep.CommandName);
                });
                currentEventSequence.push(step.CommandName);
                var stepInfo = JSON.parse(step.Arguments[0].Value);
                var matchingEventSequence = null;
                this.testRecorderEventHelper.mergedEventEventSequences.forEach(function (sequenceEventName, eventSequenceData) {
                    var sequenceOfEvents = _this.getEventSequenceNames(eventSequenceData.eventSequence);
                    var sequenceOfEventsLengthSizeDifferential = sequenceOfEvents.length - currentEventSequence.length;
                    if (sequenceOfEventsLengthSizeDifferential >= 0) {
                        var isForSameObjectType = isSameObjectAsLastStep;
                        var eventData = eventSequenceData.eventSequence[currentEventSequence.length - 1];
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(eventData.matchingObjectEventIndex)) {
                            if (eventData.matchingObjectEventIndex >= 0) {
                                isForSameObjectType = _this.isSameEventObject(step, _this._cachedSteps[eventData.matchingObjectEventIndex]);
                            }
                            else {
                                isForSameObjectType = !isForSameObjectType;
                            }
                        }
                        var isControlNameTheSame = false;
                        if (!Commerce.StringExtensions.isNullOrWhitespace(eventSequenceData.specialtyNodeInfo)) {
                            isControlNameTheSame = stepInfo.specialtyNodeInfo === eventSequenceData.specialtyNodeInfo;
                        }
                        if ((sequenceOfEventsLengthSizeDifferential >= 0) &&
                            (isForSameObjectType || isControlNameTheSame) &&
                            (Commerce.ObjectExtensions.isNullOrUndefined(matchingEventSequence) ||
                                (matchingEventSequence.sequenceDelta > sequenceOfEventsLengthSizeDifferential) ||
                                ((matchingEventSequence.sequenceDelta === sequenceOfEventsLengthSizeDifferential) && isControlNameTheSame))) {
                            var doesSequenceOfEventsMatchCurrentEventSequence = true;
                            for (var i = 0; i < currentEventSequence.length; i++) {
                                if (sequenceOfEvents[i] !== currentEventSequence[i]) {
                                    doesSequenceOfEventsMatchCurrentEventSequence = false;
                                    break;
                                }
                            }
                            if (doesSequenceOfEventsMatchCurrentEventSequence) {
                                matchingEventSequence = {
                                    sequenceEventName: sequenceEventName,
                                    sequenceDelta: sequenceOfEventsLengthSizeDifferential,
                                    specialtyNodeInfo: eventSequenceData.specialtyNodeInfo
                                };
                            }
                        }
                    }
                });
                if (Commerce.ObjectExtensions.isNullOrUndefined(matchingEventSequence)) {
                    var isKeyPressInputEventSequence = false;
                    for (var cachedStepIndex = 0; cachedStepIndex <= this._cachedSteps.length; cachedStepIndex++) {
                        var cachedStep = void 0;
                        if (cachedStepIndex === this._cachedSteps.length) {
                            cachedStep = step;
                        }
                        else {
                            cachedStep = this._cachedSteps[cachedStepIndex];
                        }
                        if ((Commerce.UserActivityRecorder.isKeyboardEventName(cachedStep.CommandName) || Commerce.UserActivityRecorder.isInputEventName(cachedStep.CommandName)) &&
                            ((cachedStepIndex === 0) || this.isSameEventObject(this._cachedSteps[cachedStepIndex - 1], cachedStep, false))) {
                            isKeyPressInputEventSequence = true;
                        }
                        else {
                            isKeyPressInputEventSequence = false;
                            break;
                        }
                    }
                    if (isKeyPressInputEventSequence) {
                        matchingEventSequence = {
                            sequenceEventName: "testrecorderongoingkeypressinput",
                            sequenceDelta: Number.MAX_VALUE
                        };
                    }
                }
                return matchingEventSequence;
            };
            TestRecorderRecordingEventListener.prototype.findRepeatedMergedEventStepsInCachedStepsForLatestStep = function (sequenceEventName) {
                var listOfIndexesOfFoundSteps = [];
                var indexListOfFoundSteps;
                var startIndex = 0;
                while (startIndex >= 0) {
                    indexListOfFoundSteps = this.findMergedEventStepsInCachedStepsForLatestStep(sequenceEventName, startIndex);
                    if (Commerce.ArrayExtensions.hasElements(indexListOfFoundSteps)) {
                        listOfIndexesOfFoundSteps.push(indexListOfFoundSteps);
                        if (indexListOfFoundSteps.length <= 1) {
                            startIndex = -1;
                        }
                        else {
                            startIndex = indexListOfFoundSteps[indexListOfFoundSteps.length - 2] + 1;
                        }
                    }
                    else {
                        startIndex = -1;
                    }
                }
                return listOfIndexesOfFoundSteps;
            };
            TestRecorderRecordingEventListener.prototype.findMergedEventStepsInCachedStepsForLatestStep = function (sequenceEventName, cachedStepsStartIndex) {
                if (cachedStepsStartIndex === void 0) { cachedStepsStartIndex = 0; }
                if (!this.testRecorderEventHelper.mergedEventEventSequences.hasItem(sequenceEventName)) {
                    Commerce.RetailLogger.testRecorderEventListenerMergedSequenceEventNameNotFound(this.Subscriber.CorrelationId, sequenceEventName);
                    return null;
                }
                if (cachedStepsStartIndex < 0) {
                    Commerce.RetailLogger.testRecorderEventListenerInvalidParameter(this.Subscriber.CorrelationId, "findMergedEventStepsInCachedStepsForLatestStep", "cachedStepsStartIndex", JSON.stringify(cachedStepsStartIndex), "The parameters may not be less than 0");
                    return null;
                }
                if (!Commerce.ArrayExtensions.hasElements(this._cachedSteps)) {
                    return [];
                }
                var mergeableEventSequence = this.testRecorderEventHelper.mergedEventEventSequences.getItem(sequenceEventName);
                if (!Commerce.ArrayExtensions.hasElements(mergeableEventSequence.eventSequence)) {
                    return [];
                }
                var lastStep = this._cachedSteps[this._cachedSteps.length - 1];
                var lastMergedStep = mergeableEventSequence.eventSequence[mergeableEventSequence.eventSequence.length - 1];
                if (lastStep.CommandName !== lastMergedStep.eventName) {
                    return [];
                }
                var indexListOfFoundSteps = [];
                var lastKeyboardStep = null;
                if (Commerce.UserActivityRecorder.isKeyboardEventName(lastStep.CommandName)) {
                    lastKeyboardStep = lastStep;
                }
                var mergeableEventSequenceIndex = 0;
                var mergeableEventSequenceLengthToCheck = mergeableEventSequence.eventSequence.length - 1;
                for (var cachedStepIndex = cachedStepsStartIndex; cachedStepIndex < this._cachedSteps.length - 1; cachedStepIndex++) {
                    if (mergeableEventSequenceIndex >= mergeableEventSequenceLengthToCheck) {
                        break;
                    }
                    var cachedStep = this._cachedSteps[cachedStepIndex];
                    var isSameEventObject = false;
                    if (cachedStep.CommandName === mergeableEventSequence.eventSequence[mergeableEventSequenceIndex].eventName) {
                        if (Commerce.UserActivityRecorder.isKeyboardEventName(cachedStep.CommandName)) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(lastKeyboardStep)) {
                                isSameEventObject = this.isSameEventObject(cachedStep, lastKeyboardStep);
                            }
                            else {
                                if (this.isSameEventObject(cachedStep, lastStep)) {
                                    isSameEventObject = true;
                                    lastKeyboardStep = cachedStep;
                                }
                            }
                        }
                        else {
                            isSameEventObject = this.isSameEventObject(cachedStep, lastStep);
                        }
                        if (isSameEventObject) {
                            indexListOfFoundSteps.push(cachedStepIndex);
                            mergeableEventSequenceIndex++;
                        }
                    }
                }
                if (mergeableEventSequenceIndex >= mergeableEventSequenceLengthToCheck) {
                    indexListOfFoundSteps.push(this._cachedSteps.length - 1);
                    return indexListOfFoundSteps;
                }
                return [];
            };
            TestRecorderRecordingEventListener.prototype.isSameEventObject = function (step1, step2, matchEventSpecificData) {
                if (matchEventSpecificData === void 0) { matchEventSpecificData = true; }
                if (Commerce.ObjectExtensions.isNullOrUndefined(step1) || Commerce.ObjectExtensions.isNullOrUndefined(step2)) {
                    return false;
                }
                var step1Info = JSON.parse(step1.Arguments[0].Value);
                var step2Info = JSON.parse(step2.Arguments[0].Value);
                var isOnSameForm = step1.FormId === step2.FormId;
                var isSameEventObject = (step1Info.secondaryControlName === step2Info.secondaryControlName) && isOnSameForm;
                if (!isSameEventObject && isOnSameForm) {
                    var nonFocusableElements = ["div", "img"];
                    if ((step1.CommandName === "focus") &&
                        (step2.CommandName !== "focus") &&
                        (nonFocusableElements.indexOf(step2.ControlName.toLowerCase()) >= 0)) {
                        isSameEventObject = step2Info.secondaryControlName.indexOf(step1Info.secondaryControlName) === 0;
                    }
                    else if ((step2.CommandName === "focus") &&
                        (step1.CommandName !== "focus") &&
                        (nonFocusableElements.indexOf(step1.ControlName.toLowerCase()) >= 0)) {
                        isSameEventObject = step1Info.secondaryControlName.indexOf(step2Info.secondaryControlName) === 0;
                    }
                }
                if (!isSameEventObject && isOnSameForm) {
                    if ((step1Info.specialtyNodeInfo === "numpad" && step2Info.specialtyNodeInfo === "numpad") &&
                        (step1.ControlName.toLowerCase() === "button" && step2.ControlName.toLowerCase() === "button")) {
                        if (step2.CommandName === "focus") {
                            isSameEventObject = step2Info.secondaryControlName.indexOf(step1Info.secondaryControlName) === 0;
                        }
                        else if (step1.CommandName === "focus") {
                            isSameEventObject = step1Info.secondaryControlName.indexOf(step2Info.secondaryControlName) === 0;
                        }
                    }
                }
                if (!isSameEventObject && isOnSameForm) {
                    if (step1Info.specialtyNodeInfo === "select" && step2Info.specialtyNodeInfo === "select") {
                        var selectPath = void 0;
                        var possibleOptionPath = void 0;
                        if (step2Info.secondaryControlName.length > step1Info.secondaryControlName.length) {
                            selectPath = step1Info.secondaryControlName;
                            possibleOptionPath = step2Info.secondaryControlName;
                        }
                        else {
                            selectPath = step2Info.secondaryControlName;
                            possibleOptionPath = step1Info.secondaryControlName;
                        }
                        var optionPartOfPath = possibleOptionPath.substring(selectPath.length);
                        isSameEventObject = (possibleOptionPath.indexOf(selectPath) === 0)
                            && (optionPartOfPath.indexOf("/OPTION") === 0);
                    }
                }
                if (isSameEventObject) {
                    if (matchEventSpecificData) {
                        if (Commerce.UserActivityRecorder.isKeyboardEventName(step1.CommandName) && Commerce.UserActivityRecorder.isKeyboardEventName(step2.CommandName)) {
                            if (Commerce.TaskRecorder.isITaskRecorderKeyStepInfo(step1Info) && Commerce.TaskRecorder.isITaskRecorderKeyStepInfo(step2Info)) {
                                isSameEventObject = step1Info.normalizedKeyCode === step2Info.normalizedKeyCode &&
                                    step1Info.altKey === step2Info.altKey &&
                                    step1Info.ctrlKey === step2Info.ctrlKey &&
                                    step1Info.shiftKey === step2Info.shiftKey;
                            }
                        }
                    }
                }
                else {
                    if ((step1.CommandName.toLowerCase() === "keypress") && (step2.CommandName.toLowerCase() === "keyup")) {
                        if (Commerce.TaskRecorder.isITaskRecorderKeyStepInfo(step1Info) && Commerce.TaskRecorder.isITaskRecorderKeyStepInfo(step2Info)) {
                            isSameEventObject = step1Info.normalizedKeyCode === step2Info.normalizedKeyCode &&
                                step1Info.altKey === step2Info.altKey &&
                                step1Info.ctrlKey === step2Info.ctrlKey &&
                                step1Info.shiftKey === step2Info.shiftKey;
                        }
                    }
                }
                return isSameEventObject;
            };
            TestRecorderRecordingEventListener.prototype.isSameVariableObject = function (step1, step2) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(step1) || Commerce.ObjectExtensions.isNullOrUndefined(step2)) {
                    return false;
                }
                if (step1.FormId !== step2.FormId) {
                    return false;
                }
                var isSameVariableObject = false;
                var step1Info = JSON.parse(step1.Arguments[0].Value);
                var step2Info = JSON.parse(step2.Arguments[0].Value);
                if (Commerce.TaskRecorder.isITaskRecorderVariableStepInfo(step1Info) && Commerce.TaskRecorder.isITaskRecorderVariableStepInfo(step2Info)) {
                    isSameVariableObject = step1Info.secondaryControlName === step2Info.secondaryControlName &&
                        step1Info.mergedEventType === step2Info.mergedEventType &&
                        step1Info.variableValue.valueType === step2Info.variableValue.valueType &&
                        step1Info.variableValue.variablePropertyType === step2Info.variableValue.variablePropertyType &&
                        ((step1Info.variableValue.variableProperty === step2Info.variableValue.variableProperty) ||
                            (Commerce.ObjectExtensions.isNullOrUndefined(step1Info.variableValue.variableProperty) &&
                                Commerce.ObjectExtensions.isNullOrUndefined(step2Info.variableValue.variableProperty)));
                }
                return isSameVariableObject;
            };
            TestRecorderRecordingEventListener.prototype.getEventSequenceNames = function (mergeableEventSequenceDatas) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(mergeableEventSequenceDatas)) {
                    return null;
                }
                var eventNames = [];
                mergeableEventSequenceDatas.forEach(function (mergeableEventSequenceData) {
                    eventNames.push(mergeableEventSequenceData.eventName);
                });
                return eventNames;
            };
            TestRecorderRecordingEventListener.prototype.mergeSteps = function (sequenceEventName, steps) {
                if (!this.doEventsMatchEventSequence(sequenceEventName, steps)) {
                    return null;
                }
                Commerce.RetailLogger.testRecorderEventListenerMergeSteps(this.Subscriber.CorrelationId, sequenceEventName);
                var newSteps = [];
                if (this.areStepsMergeableToAVariable(sequenceEventName, steps)) {
                    newSteps.push(this.mergeStepsToVariableStep(sequenceEventName, steps));
                }
                else {
                    newSteps.push(this.mergeStepsToMergedStep(sequenceEventName, steps));
                }
                if (newSteps.some(function (value) {
                    return Commerce.ObjectExtensions.isNullOrUndefined(value);
                })) {
                    newSteps = null;
                }
                return newSteps;
            };
            TestRecorderRecordingEventListener.prototype.mergeStepsToMergedStep = function (sequenceEventName, steps) {
                if (!this.doEventsMatchEventSequence(sequenceEventName, steps)) {
                    return null;
                }
                var actionText = Commerce.StringExtensions.EMPTY;
                var event = steps[0];
                if (TestRecorder.isTestRecorderSelectEventName(sequenceEventName)) {
                    var changeSteps = steps.filter(function (event) {
                        return event.CommandName === "change";
                    });
                    if (changeSteps.length === 1) {
                        event = changeSteps[0];
                    }
                }
                var doesAStepHaveSensitiveData = this.doesAStepHaveSensitiveData(steps);
                var stepInfo = JSON.parse(event.Arguments[0].Value);
                if (TestRecorder.isTestRecorderMouseEventName(sequenceEventName)) {
                    actionText = this.getActionTextForMouseEventByStepInfo(sequenceEventName, stepInfo, doesAStepHaveSensitiveData);
                }
                else if (TestRecorder.isTestRecorderKeyboardEventName(sequenceEventName)) {
                    if (Commerce.TaskRecorder.isITaskRecorderKeyStepInfo(stepInfo)) {
                        actionText = this.getActionTextForKeyboardEvent(sequenceEventName, stepInfo, doesAStepHaveSensitiveData);
                    }
                }
                else if (TestRecorder.isTestRecorderSelectEventName(sequenceEventName)) {
                    actionText = this.getActionTextForChangeEvent(stepInfo, doesAStepHaveSensitiveData);
                }
                else if (TestRecorder.isTestRecorderInputEventName(sequenceEventName)) {
                    var inputSteps_1 = [];
                    var keySteps_1 = [];
                    steps.forEach(function (value) {
                        if (Commerce.UserActivityRecorder.isInputEventName(value.CommandName)) {
                            inputSteps_1.push(value);
                        }
                        else if (Commerce.UserActivityRecorder.isKeyboardEventName(value.CommandName)) {
                            keySteps_1.push(value);
                        }
                    });
                    var inputStepInfo = JSON.parse(inputSteps_1[0].Arguments[0].Value);
                    var keyStepInfo = JSON.parse(keySteps_1[0].Arguments[0].Value);
                    actionText = this.getActionTextForInputEvent(inputStepInfo, keyStepInfo, doesAStepHaveSensitiveData);
                }
                else if (TestRecorder.isTestRecorderKeyPressNavigationEventName(sequenceEventName)) {
                    var keyStepsInfo_1 = [];
                    steps.forEach(function (value) {
                        if (Commerce.UserActivityRecorder.isKeyboardEventName(value.CommandName)) {
                            keyStepsInfo_1.push(JSON.parse(value.Arguments[0].Value));
                        }
                    });
                    actionText = this.getActionTextForKeyPressNavigationEvent(keyStepsInfo_1);
                    stepInfo.targetContent = Commerce.StringExtensions.EMPTY;
                    stepInfo.nodeName = Commerce.StringExtensions.EMPTY;
                }
                var newStepInfo = {
                    mergedEventInfo: steps.splice(0),
                    timeSinceLastEvent: 0,
                    targetContent: stepInfo.targetContent,
                    nodeName: stepInfo.nodeName
                };
                if (doesAStepHaveSensitiveData) {
                    newStepInfo.isSensitiveData = true;
                }
                var command = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewCommand(Commerce.StringExtensions.EMPTY, sequenceEventName, actionText, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, newStepInfo, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, this.context.getCurrentViewNameHandler());
                Commerce.RetailLogger.testRecorderEventListenerMergeStepsToMergedStep(this.Subscriber.CorrelationId, command.CommandName, command.FormId, newStepInfo.nodeName, command.Description, doesAStepHaveSensitiveData);
                return command;
            };
            TestRecorderRecordingEventListener.prototype.doEventsMatchEventSequence = function (eventSequenceName, steps) {
                if (!this.testRecorderEventHelper.mergedEventEventSequences.hasItem(eventSequenceName)) {
                    return false;
                }
                if (!Commerce.ArrayExtensions.hasElements(steps)) {
                    return false;
                }
                var doesSequenceOfEventsMatchCurrentEventSequence = false;
                var eventSequenceData = this.testRecorderEventHelper.mergedEventEventSequences.getItem(eventSequenceName);
                if (eventSequenceData.eventSequence.length === steps.length) {
                    doesSequenceOfEventsMatchCurrentEventSequence = true;
                    for (var i = 0; i < steps.length; i++) {
                        if (eventSequenceData.eventSequence[i].eventName !== steps[i].CommandName) {
                            doesSequenceOfEventsMatchCurrentEventSequence = false;
                            break;
                        }
                    }
                }
                return doesSequenceOfEventsMatchCurrentEventSequence;
            };
            TestRecorderRecordingEventListener.prototype.mergeStepsToVariableStep = function (sequenceEventName, steps) {
                if (!Commerce.ArrayExtensions.hasElements(steps)) {
                    return null;
                }
                if (!this.testRecorderEventHelper.variableEventSequences.hasItem(sequenceEventName)) {
                    return null;
                }
                var actionText = Commerce.StringExtensions.EMPTY;
                var firstEvent = steps[0];
                var firstEventStepInfo = JSON.parse(firstEvent.Arguments[0].Value);
                var variableValue;
                var commandStepInfo;
                var mergedEventType;
                var variableName = this.testRecorderEventHelper.variableEventSequences.hasItem(sequenceEventName) ?
                    this.testRecorderEventHelper.variableEventSequences.getItem(sequenceEventName) : sequenceEventName;
                var sensitiveDataInformationForSteps = this.getSensitiveDataInformationForSteps(steps);
                var doesAStepHaveSensitiveData = sensitiveDataInformationForSteps.isSensitiveData;
                var variableValueType = Commerce.TaskRecorder.VariableValueType.Unknown;
                if (TestRecorder.isTestRecorderKeyboardEventName(sequenceEventName)) {
                    mergedEventType = Commerce.TaskRecorder.MergedEventTypes.Keyboard;
                    commandStepInfo = firstEventStepInfo;
                    if (Commerce.TaskRecorder.isITaskRecorderKeyStepInfo(commandStepInfo)) {
                        variableValue = String.fromCharCode(commandStepInfo.normalizedKeyCode);
                        actionText = this.getActionTextForKeyboardVariableEvent(this.getKeyName(commandStepInfo), doesAStepHaveSensitiveData);
                    }
                }
                else if (TestRecorder.isTestRecorderInputEventName(sequenceEventName)) {
                    mergedEventType = Commerce.TaskRecorder.MergedEventTypes.Input;
                    var inputSteps = steps.filter(function (cachedStep) {
                        return Commerce.UserActivityRecorder.isInputEventName(cachedStep.CommandName);
                    });
                    commandStepInfo = JSON.parse(inputSteps[0].Arguments[0].Value);
                    variableValue = commandStepInfo.value;
                    actionText = this.getActionTextForInputEvent(commandStepInfo, null, doesAStepHaveSensitiveData);
                    if (commandStepInfo.nodeName.toLowerCase() === "textarea") {
                        variableValueType = Commerce.TaskRecorder.VariableValueType.MultilineString;
                    }
                }
                else if (TestRecorder.isTestRecorderMouseEventName(sequenceEventName)) {
                    mergedEventType = Commerce.TaskRecorder.MergedEventTypes.Click;
                    commandStepInfo = firstEventStepInfo;
                    if (commandStepInfo.specialtyNodeInfo === "numpad") {
                        var numberCachedSteps = this._cachedSteps.length;
                        variableValue = JSON.parse(this._cachedSteps[numberCachedSteps - 1].Arguments[0].Value).value;
                        actionText = this.getActionTextForNumpadVariableEvent(variableValue, doesAStepHaveSensitiveData);
                        commandStepInfo.friendlyControlName = Commerce.StringExtensions.EMPTY;
                        commandStepInfo.nodeName = Commerce.StringExtensions.EMPTY;
                    }
                    else {
                        variableValue = firstEventStepInfo.value;
                        actionText = this.getActionTextForMouseEvent(variableName, variableValue, "button");
                    }
                }
                var valuePartsIncrementalTime = 0;
                if (steps.length > 1) {
                    for (var index = 1; index < steps.length; index++) {
                        var stepInfo = JSON.parse(steps[index].Arguments[0].Value);
                        valuePartsIncrementalTime += stepInfo.timeSinceLastEvent;
                    }
                    valuePartsIncrementalTime = Math.ceil(valuePartsIncrementalTime / (steps.length - 1));
                }
                var taskRecorderVariable;
                if (doesAStepHaveSensitiveData) {
                    var taskRecorderVariableWithSensitiveData = {
                        id: Commerce.Utilities.GuidHelper.newGuid(),
                        variablePropertyType: "sensitiveDataKey",
                        variableProperty: null,
                        value: sensitiveDataInformationForSteps.sensitiveDataKey,
                        valueType: variableValueType
                    };
                    taskRecorderVariable = taskRecorderVariableWithSensitiveData;
                }
                else {
                    var taskRecorderVariableWithValue = {
                        id: Commerce.Utilities.GuidHelper.newGuid(),
                        variablePropertyType: "value",
                        variableProperty: null,
                        value: variableValue,
                        valueType: variableValueType
                    };
                    taskRecorderVariable = taskRecorderVariableWithValue;
                }
                var newStepInfo = {
                    variableValue: taskRecorderVariable,
                    secondaryControlName: commandStepInfo.secondaryControlName,
                    timeSinceLastEvent: commandStepInfo.timeSinceLastEvent,
                    nodeName: commandStepInfo.nodeName,
                    valuePartsIncrementalTime: valuePartsIncrementalTime,
                    mergedEventType: mergedEventType,
                    additionalControlIdentifiers: commandStepInfo.additionalControlIdentifiers,
                    friendlyControlName: commandStepInfo.friendlyControlName,
                    specialtyNodeInfo: commandStepInfo.specialtyNodeInfo
                };
                if (doesAStepHaveSensitiveData) {
                    newStepInfo.isSensitiveData = true;
                }
                var command = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewCommand(Commerce.StringExtensions.EMPTY, variableName, actionText, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, newStepInfo, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, this.context.getCurrentViewNameHandler());
                var additionalDataToLog = {
                    isSensitiveData: newStepInfo.isSensitiveData
                };
                Commerce.RetailLogger.testRecorderEventListenerMergeStepsToVariableStep(this.Subscriber.CorrelationId, command.FormId, newStepInfo.nodeName, newStepInfo.mergedEventType, newStepInfo.specialtyNodeInfo, JSON.stringify(additionalDataToLog));
                return command;
            };
            TestRecorderRecordingEventListener.prototype.areStepsMergeableToAVariable = function (sequenceEventName, steps) {
                var areStepsMergeableToAVariable = false;
                if (!Commerce.ArrayExtensions.hasElements(steps)) {
                    return false;
                }
                if (!this.testRecorderEventHelper.variableEventSequences.hasItem(sequenceEventName)) {
                    return false;
                }
                if (this.doEventsMatchEventSequence(sequenceEventName, steps)) {
                    areStepsMergeableToAVariable = true;
                    if (sequenceEventName === "mergedkeypress") {
                        var firstEvent = steps[0];
                        var firstEventStepInfo = JSON.parse(firstEvent.Arguments[0].Value);
                        if (Commerce.TaskRecorder.isITaskRecorderKeyStepInfo(firstEventStepInfo)) {
                            areStepsMergeableToAVariable = !this.isCommandKey(firstEventStepInfo);
                        }
                    }
                    if (TestRecorder.isTestRecorderNumpadEventName(sequenceEventName)) {
                        var firstEvent = steps[0];
                        var firstEventStepInfo = JSON.parse(firstEvent.Arguments[0].Value);
                        if (Commerce.TaskRecorder.isITaskRecorderNumpadMouseStepInfo(firstEventStepInfo)) {
                            areStepsMergeableToAVariable = firstEventStepInfo.specialtyNodeInfo === "numpad" && firstEventStepInfo.isValue;
                        }
                    }
                }
                return areStepsMergeableToAVariable;
            };
            TestRecorderRecordingEventListener.prototype.addStepToCachedSteps = function (step) {
                Commerce.RetailLogger.testRecorderEventListenerAddEventToEventCache(this.Subscriber.CorrelationId, step.FormId, step.CommandName, step.ControlName, step.Description);
                this._cachedSteps.push(step);
            };
            TestRecorderRecordingEventListener.prototype.clearCachedSteps = function () {
                Commerce.RetailLogger.testRecorderEventListenerClearCachedSteps(this.Subscriber.CorrelationId);
                this._cachedSteps = [];
            };
            TestRecorderRecordingEventListener.prototype.getEventButtonInNumpad = function (event) {
                var buttonInNumpad = null;
                if (event.target instanceof Element) {
                    var buttonElement = Commerce.DOMHelper.firstCurrentOrAncestorByNodeName(event.target, "button");
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(Commerce.DOMHelper.firstCurrentOrAncestorByClass(buttonElement, "numpad"))) {
                        buttonInNumpad = buttonElement;
                    }
                }
                return buttonInNumpad;
            };
            TestRecorderRecordingEventListener.prototype.getEventNumpadElement = function (event) {
                var numpadElement = null;
                if (event.target instanceof Element) {
                    numpadElement = Commerce.DOMHelper.firstCurrentOrAncestorByClass(event.target, "numpad");
                }
                return numpadElement;
            };
            TestRecorderRecordingEventListener.prototype.getNumpadInputValue = function (element) {
                var numpadInputElement = this.getNumpadInputElement(element);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(numpadInputElement)) {
                    return numpadInputElement.value;
                }
                return null;
            };
            TestRecorderRecordingEventListener.prototype.getNumpadInputElement = function (element) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(element)) {
                    return null;
                }
                var numpadInputElement = null;
                if (element.classList.contains("numpad")) {
                    var $inputElement = $(element).find("input.numpad-control-input").first();
                    if ($inputElement.length > 0) {
                        var inputElement = $inputElement[0];
                        if (inputElement instanceof HTMLInputElement) {
                            numpadInputElement = inputElement;
                        }
                    }
                }
                return numpadInputElement;
            };
            TestRecorderRecordingEventListener.prototype.isCommandKey = function (stepInfo) {
                var isCommandKey = false;
                if ((stepInfo.ctrlKey) || (stepInfo.altKey)) {
                    isCommandKey = true;
                }
                switch (stepInfo.keyCode) {
                    case 8:
                    case 9:
                    case 13:
                    case 127:
                        isCommandKey = true;
                        break;
                }
                return isCommandKey;
            };
            TestRecorderRecordingEventListener.prototype.isEventButtonInNumpad = function (event) {
                return !Commerce.ObjectExtensions.isNullOrUndefined(this.getEventButtonInNumpad(event));
            };
            TestRecorderRecordingEventListener.prototype.isNumpadValueButton = function (element) {
                var isNumpadValueButton = false;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(element) &&
                    element.nodeName.toLowerCase() === "button") {
                    var attributeValue = element.getAttribute("value");
                    if (!Commerce.StringExtensions.isNullOrWhitespace(attributeValue)) {
                        if (Commerce.DOMHelper.firstCurrentOrAncestorByClass(element, "numpad")) {
                            var buttonValues = ["00", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "decimal", "backspace", "-"];
                            isNumpadValueButton = buttonValues.indexOf(attributeValue) >= 0;
                        }
                    }
                }
                return isNumpadValueButton;
            };
            TestRecorderRecordingEventListener.prototype.isStepForWindowResizeEvent = function (step) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(step)) {
                    return false;
                }
                return step.CommandName === "resize" && step.ControlName === "window";
            };
            TestRecorderRecordingEventListener.prototype.getWindowSize = function () {
                var windowSize = {
                    height: window.outerHeight,
                    width: window.outerWidth
                };
                return windowSize;
            };
            TestRecorderRecordingEventListener.prototype.getLocalizedEventName = function (eventName) {
                if (Commerce.StringExtensions.isNullOrWhitespace(eventName)) {
                    return eventName;
                }
                var localizedEventName = new UIEventHelper(this.context).getLocalizedEventName(eventName);
                if (localizedEventName === eventName) {
                    localizedEventName = this.testRecorderEventHelper.getLocalizedEventName(eventName);
                }
                return localizedEventName;
            };
            TestRecorderRecordingEventListener.prototype.doesAStepHaveSensitiveData = function (steps) {
                return this.getSensitiveDataInformationForSteps(steps).isSensitiveData;
            };
            TestRecorderRecordingEventListener.prototype.getSensitiveDataInformationForSteps = function (steps) {
                var sensitiveDataInformation = {
                    isSensitiveData: false,
                    sensitiveDataKey: null
                };
                if (!Commerce.ArrayExtensions.hasElements(steps)) {
                    return sensitiveDataInformation;
                }
                for (var stepIndex = 0; stepIndex < steps.length; stepIndex++) {
                    var step = steps[stepIndex];
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(step) &&
                        Commerce.ArrayExtensions.hasElements(step.Arguments) &&
                        !Commerce.ObjectExtensions.isNullOrUndefined(step.Arguments[0]) &&
                        !Commerce.StringExtensions.isNullOrWhitespace(step.Arguments[0].Value)) {
                        var stepInfo = JSON.parse(step.Arguments[0].Value);
                        if (Commerce.ObjectExtensions.isBoolean(stepInfo.isSensitiveData) && stepInfo.isSensitiveData) {
                            sensitiveDataInformation.isSensitiveData = true;
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(stepInfo.sensitiveDataKey)) {
                                sensitiveDataInformation.sensitiveDataKey = stepInfo.sensitiveDataKey;
                                break;
                            }
                        }
                    }
                }
                return sensitiveDataInformation;
            };
            TestRecorderRecordingEventListener.VERSION = 2;
            return TestRecorderRecordingEventListener;
        }(UserActivityRecorderEventListenerBase));
        TestRecorder.TestRecorderRecordingEventListener = TestRecorderRecordingEventListener;
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        "use strict";
        var UserActivityRecorderEventListenerBase = Commerce.UserActivityRecorder.UserActivityRecorderEventListenerBase;
        var TestRecorderValidatingEventListener = (function (_super) {
            __extends(TestRecorderValidatingEventListener, _super);
            function TestRecorderValidatingEventListener(subscriber, context, eventStopwatch) {
                var _this = _super.call(this, subscriber, context, eventStopwatch) || this;
                _this.VALIDATION_EVENT_NAME = "validation";
                _this._userEvents = [
                    "abort",
                    "animationend",
                    "animationiteration",
                    "auxclick",
                    "blur",
                    "change",
                    "click",
                    "contextmenu",
                    "dblclick",
                    "error",
                    "focus",
                    "gotpointercapture",
                    "input",
                    "keydown",
                    "keypress",
                    "keyup",
                    "mousedown",
                    "mouseenter",
                    "mouseleave",
                    "mousemove",
                    "mouseout",
                    "mouseover",
                    "pointerdown",
                    "pointerenter",
                    "pointerleave",
                    "pointermove",
                    "pointerout",
                    "pointerover",
                    "pointerup",
                    "select",
                    "selectionchange",
                    "selectstart",
                    "touchcancel",
                    "touchend",
                    "touchstart"
                ];
                return _this;
            }
            TestRecorderValidatingEventListener.prototype.subscribeToGlobalEvents = function () {
                var _this = this;
                if (this.eventDictionary.length() <= 0) {
                    this._userEvents.forEach(function (eventName) {
                        _this.addEventListener(eventName, _this.eventHandler.bind(_this));
                    });
                }
            };
            TestRecorderValidatingEventListener.prototype.eventHandler = function (event) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(event.target)
                    && (event.target instanceof Element)
                    && this.isEventInControlToNotRecord(event.target)) {
                    return;
                }
                switch (event.type) {
                    case "click":
                        this.handleMouseEvent(event);
                        break;
                    case "keydown":
                        if (event instanceof KeyboardEvent) {
                            this.handleKeyEvent(event);
                        }
                        break;
                }
                if (!this.allowEventToPropagate(event)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            };
            TestRecorderValidatingEventListener.prototype.addValidationStepForElement = function (element) {
                var nodeName = Commerce.StringExtensions.isNullOrWhitespace(element.nodeName) ? Commerce.StringExtensions.EMPTY
                    : element.nodeName.toLowerCase();
                var doesElementHaveSensitiveData = this.doesElementHaveSensitiveData(element);
                var variableValue;
                var variableValueType = Commerce.TaskRecorder.VariableValueType.Unknown;
                if (element instanceof HTMLInputElement) {
                    variableValue = element.value;
                }
                else if (element instanceof HTMLTextAreaElement) {
                    variableValue = element.value;
                    variableValueType = Commerce.TaskRecorder.VariableValueType.MultilineString;
                }
                else if (this.isEventInSelect(event)) {
                    var optionElement = this.getSelectedOption(element);
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(optionElement)) {
                        doesElementHaveSensitiveData = doesElementHaveSensitiveData || this.doesElementHaveSensitiveData(optionElement);
                        variableValue = optionElement.value;
                    }
                }
                else if (element instanceof HTMLImageElement) {
                    variableValue = element.src;
                }
                else {
                    variableValue = this.getElementText(element);
                    if (element instanceof HTMLDivElement) {
                        variableValueType = Commerce.TaskRecorder.VariableValueType.MultilineString;
                    }
                }
                if (!doesElementHaveSensitiveData) {
                    var additionalControlIdentifiers = this.getAdditionalControlIdentifiers(element);
                    var friendlyDescription = this.getFriendlyDescriptionForElement(element);
                    if (Commerce.StringExtensions.isNullOrWhitespace(friendlyDescription)) {
                        friendlyDescription = Commerce.StringExtensions.EMPTY;
                    }
                    var taskRecorderVariable = {
                        id: Commerce.Utilities.GuidHelper.newGuid(),
                        variablePropertyType: "value",
                        variableProperty: null,
                        value: variableValue,
                        valueType: variableValueType
                    };
                    var stepInfo = {
                        variableValues: [taskRecorderVariable],
                        secondaryControlName: this.getXPath(element),
                        timeSinceLastEvent: this.getTimeSinceLastEvent(),
                        nodeName: nodeName,
                        additionalControlIdentifiers: additionalControlIdentifiers,
                        friendlyControlName: friendlyDescription,
                        specialtyNodeInfo: Commerce.StringExtensions.EMPTY
                    };
                    if (doesElementHaveSensitiveData) {
                        stepInfo.isSensitiveData = true;
                    }
                    var primaryControlName = nodeName;
                    var controlType = "";
                    var actionText = this.getActionTextForValidationEvent(stepInfo);
                    var command = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewValidation(Commerce.StringExtensions.EMPTY, this.VALIDATION_EVENT_NAME, actionText, stepInfo, primaryControlName, controlType, this.context.getCurrentViewNameHandler());
                    var additionalDataToLog = {
                        secondaryControlName: stepInfo.secondaryControlName,
                        isSensitiveData: stepInfo.isSensitiveData
                    };
                    Commerce.RetailLogger.testRecorderValidatingEventListenerHandleValidationEvent(this.Subscriber.CorrelationId, command.FormId, command.CommandName, command.ControlName, JSON.stringify(additionalDataToLog));
                    this.addStep(command);
                }
            };
            TestRecorderValidatingEventListener.prototype.handleMouseEvent = function (event) {
                if (this.isMiddleButtonClicked(event)) {
                    return;
                }
                if (event.target instanceof Element) {
                    if (!this.isEventInControlToNotRecord(event.target)) {
                        this.addValidationStepForElement(event.target);
                    }
                }
            };
            TestRecorderValidatingEventListener.prototype.handleKeyEvent = function (event) {
                var eventShouldBeIgnored = !Commerce.ObjectExtensions.isNullOrUndefined(event.target)
                    && (event.target instanceof Element)
                    && this.isEventInControlToNotRecord(event.target);
                if (!eventShouldBeIgnored && (event.type === "keydown")) {
                    if (event.keyCode === 32) {
                        var eventTarget = event.target;
                        if (eventTarget instanceof Element) {
                            this.addValidationStepForElement(eventTarget);
                        }
                    }
                }
            };
            TestRecorderValidatingEventListener.prototype.getActionTextForValidationEvent = function (stepInfo) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(stepInfo)) {
                    return Commerce.StringExtensions.EMPTY;
                }
                var actionText;
                if (!Commerce.StringExtensions.isNullOrWhitespace(stepInfo.friendlyControlName)) {
                    var displayString = this.context.stringResourceManager.getString("string_10715");
                    actionText = Commerce.StringExtensions.format(displayString, stepInfo.friendlyControlName);
                }
                else {
                    var displayString = this.context.stringResourceManager.getString("string_10716");
                    var localizedNodeName = Commerce.DOMHelper.getLocalizedElementName(this.context, stepInfo.nodeName, stepInfo.nodeAttributeTypeName);
                    actionText = Commerce.StringExtensions.format(displayString, localizedNodeName);
                }
                return actionText;
            };
            TestRecorderValidatingEventListener.prototype.allowEventToPropagate = function (event) {
                var allowEventToPropagate = false;
                if (this.isEventInMessageDialog(event)) {
                    return true;
                }
                if (event instanceof KeyboardEvent) {
                    switch (event.keyCode) {
                        case 9:
                            allowEventToPropagate = true;
                            break;
                        case 37:
                        case 38:
                        case 39:
                        case 40:
                            if (!this.isEventInSelect(event)) {
                                allowEventToPropagate = true;
                                break;
                            }
                    }
                }
                return allowEventToPropagate;
            };
            TestRecorderValidatingEventListener.prototype.isEventInMessageDialog = function (event) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(event) || Commerce.ObjectExtensions.isNullOrUndefined(event.target)) {
                    return false;
                }
                var $messageDialogElement = $(event.target).closest("[role='dialog'].alwaysOnTop");
                return $messageDialogElement.length > 0;
            };
            TestRecorderValidatingEventListener.VERSION = 1;
            return TestRecorderValidatingEventListener;
        }(UserActivityRecorderEventListenerBase));
        TestRecorder.TestRecorderValidatingEventListener = TestRecorderValidatingEventListener;
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        "use strict";
        var Stopwatch = Commerce.UserActivityRecorder.Stopwatch;
        var UserActivityRecorderEventListenerBase = Commerce.UserActivityRecorder.UserActivityRecorderEventListenerBase;
        var UserActivityRecorderSessionBase = Commerce.UserActivityRecorder.UserActivityRecorderSessionBase;
        var UserActivityRecorderState = Commerce.UserActivityRecorder.UserActivityRecorderState;
        var TestRecorderSession = (function (_super) {
            __extends(TestRecorderSession, _super);
            function TestRecorderSession(correlationId, context, recording, onStateChanged) {
                var _this = _super.call(this, correlationId, context, recording) || this;
                _this._eventStopwatch = new Stopwatch();
                _this._onStateChanged = onStateChanged;
                return _this;
            }
            TestRecorderSession.prototype.continueWithValidation = function () {
                var state = this.state();
                var validStates = [
                    UserActivityRecorderState.Recording,
                    UserActivityRecorderState.RecordingPaused,
                    UserActivityRecorderState.ValidationPaused
                ];
                if (!Commerce.ArrayExtensions.hasElement(validStates, state)) {
                    var stateName = UserActivityRecorderState[state];
                    throw UserActivityRecorderSessionBase.error(Commerce.UserActivityRecorder.ErrorCodes.TASK_RECORDER_SESSION_INVALID_STATE, stateName);
                }
                if (state === UserActivityRecorderState.ValidationPaused) {
                    this.state(UserActivityRecorderState.Validating);
                    this.eventListener.startListening();
                }
                else {
                    this.startValidating();
                }
            };
            TestRecorderSession.prototype.getRecordingAsync = function () {
                return Commerce.AsyncResult.createResolved({ canceled: false, data: this.recordingViewModel.toModel() });
            };
            TestRecorderSession.prototype.getNewRecordingEventListener = function () {
                var testRecorderRecordingEventListener = new TestRecorder.TestRecorderRecordingEventListener(this, this.context, this._eventStopwatch);
                testRecorderRecordingEventListener.startListening();
                return testRecorderRecordingEventListener;
            };
            TestRecorderSession.prototype.getNewValidatingEventListener = function () {
                var testRecorderValidatingEventListener = new TestRecorder.TestRecorderValidatingEventListener(this, this.context, this._eventStopwatch);
                testRecorderValidatingEventListener.startListening();
                return testRecorderValidatingEventListener;
            };
            TestRecorderSession.prototype.addStartRecordingSteps = function () {
                var layoutId = Commerce.StringExtensions.EMPTY;
                var layoutResolutionHeight;
                var layoutResolutionWidth;
                if (this.context.appSession.userSession.isLoggedOn()) {
                    layoutId = this.context.appSession.userSession.tillLayout.LayoutId;
                    layoutResolutionHeight = this.context.appSession.userSession.tillLayout.Height;
                    layoutResolutionWidth = this.context.appSession.userSession.tillLayout.Width;
                }
                this.addStep(Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNewStartRecordingStep(this.version, Commerce.StringExtensions.EMPTY, this.context, layoutId, layoutResolutionHeight, layoutResolutionWidth));
            };
            TestRecorderSession.prototype.initializeStateChangedEvent = function () {
                var _this = this;
                this.state.subscribe(function (value) {
                    _this._onStateChanged(value);
                });
            };
            TestRecorderSession.prototype.getRecorderVersion = function () {
                return UserActivityRecorderEventListenerBase.VERSION + TestRecorder.TestRecorderRecordingEventListener.VERSION + TestRecorder.TestRecorderValidatingEventListener.VERSION;
            };
            return TestRecorderSession;
        }(UserActivityRecorderSessionBase));
        TestRecorder.TestRecorderSession = TestRecorderSession;
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        "use strict";
        var TestRecorderManager = (function (_super) {
            __extends(TestRecorderManager, _super);
            function TestRecorderManager(context, onStateChanged) {
                var _this = _super.call(this, context) || this;
                _this._onStateChanged = onStateChanged;
                return _this;
            }
            TestRecorderManager.prototype.getNewRecorderSession = function (correlationId, name, description) {
                var recording = Commerce.UserActivityRecorder.Utilities.RecordingFactory.createNew(name, description);
                return new TestRecorder.TestRecorderSession(correlationId, this.context, recording, this._onStateChanged);
            };
            return TestRecorderManager;
        }(Commerce.UserActivityRecorder.UserActivityRecorderManagerBase));
        TestRecorder.TestRecorderManager = TestRecorderManager;
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TestRecorder;
    (function (TestRecorder) {
        "use strict";
        var TestRecorderViewManager = (function (_super) {
            __extends(TestRecorderViewManager, _super);
            function TestRecorderViewManager() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TestRecorderViewManager.prototype.getViewUri = function (viewName) {
                return this.baseViewUri + "Views/" + viewName + "View/" + viewName + "View.html";
            };
            return TestRecorderViewManager;
        }(Commerce.UserActivityRecorder.UserActivityRecorderViewManagerBase));
        TestRecorder.TestRecorderViewManager = TestRecorderViewManager;
    })(TestRecorder = Commerce.TestRecorder || (Commerce.TestRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UserActivityRecorder;
    (function (UserActivityRecorder) {
        "use strict";
    })(UserActivityRecorder = Commerce.UserActivityRecorder || (Commerce.UserActivityRecorder = {}));
})(Commerce || (Commerce = {}));

// SIG // Begin signature block
// SIG // MIIkDgYJKoZIhvcNAQcCoIIj/zCCI/sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // WnTRAIGNQ1J15GvxAhBZlo1ImHud9cfTguZADe4KlEKg
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgpdKqsWJmeu5I
// SIG // snRGd5fUZFIitB4hsV/a0Pk7wxCY9IYwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // Ec7BNHwhpyvVUI4sNJKO+noKr41fb2WoEwZrOfOyF1XP
// SIG // 2p2w5KrEOpa7OtvCN+/VXccpgmWQW7cA3s0Y9p/QnQ3M
// SIG // eamlHW1drwAzs1JaMWyP1qRP0yvaswG/oWP3F56CiRol
// SIG // K4ovRP1JYNSDvGijj4jmaFZ4f0MfnmlxE7QJUbgMfd9x
// SIG // dN+9nHjpcq3xrBTA7a3e1baPAQuf3gJuRLGxY3dXhazY
// SIG // 898JDolposzLhBjn6o5FJx8+//xUrk7wUnZUIed90rqX
// SIG // vqJs+uD4CtNNqgVWftQY1gzahxL3Qmj32tcwke8Nk1ST
// SIG // XA16u1HbEkrOnrg4llpXZelSMwNYe7HLVqGCEvEwghLt
// SIG // BgorBgEEAYI3AwMBMYIS3TCCEtkGCSqGSIb3DQEHAqCC
// SIG // EsowghLGAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFVBgsq
// SIG // hkiG9w0BCRABBKCCAUQEggFAMIIBPAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCCSvJRYXJrS6gx7
// SIG // SPNn3+dFlJJfJ3h1+SqZdZgqP1Q26AIGXzvjWnK7GBMy
// SIG // MDIwMDgyMzA0MDI0Ni42MzNaMASAAgH0oIHUpIHRMIHO
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEmMCQG
// SIG // A1UECxMdVGhhbGVzIFRTUyBFU046NjBCQy1FMzgzLTI2
// SIG // MzUxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFNlcnZpY2Wggg5EMIIE9TCCA92gAwIBAgITMwAAASbf
// SIG // uksiuYKCBwAAAAABJjANBgkqhkiG9w0BAQsFADB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTEyMTkw
// SIG // MTE0NTlaFw0yMTAzMTcwMTE0NTlaMIHOMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3NvZnQgT3Bl
// SIG // cmF0aW9ucyBQdWVydG8gUmljbzEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046NjBCQy1FMzgzLTI2MzUxJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Uw
// SIG // ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCe
// SIG // ML6GnE7zDZV0E7XxfwseTpd19H3I1DTL4y4E5juflh2C
// SIG // RW6e9uT9/qrxSg0UB1hCNUs9IAduLq1QyI14wYeTVTSV
// SIG // TECSNrZbb+zOP+CG4WSW98c0Fuy6JRKGWFGWpwU1Lspc
// SIG // vaLAoOKOY6FYk9hrZssSvhb+ZAttJdqKXmnqbXfxO3Hg
// SIG // wBUTPO4YjQrCvyh8gvvPrMJ5YOIEznsus0Koc4DbBuh6
// SIG // 4ywbg7Q7PYswDMEtslk9E+dkAPYd0PgdQvabNnzCjHvg
// SIG // x6RvtHOtQ/eGIenFdlx4m+EgQp8CBWQHmRNlCeKjwDUm
// SIG // KMyPDx/hOawk90lamLx6Lvex7F7z9iNzAgMBAAGjggEb
// SIG // MIIBFzAdBgNVHQ4EFgQUSausHxewfphCjdFYpl/GozQO
// SIG // YUEwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8UzaFqF
// SIG // bVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWlj
// SIG // VGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoGCCsGAQUF
// SIG // BwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQ
// SIG // Q0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0TAQH/BAIwADAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsF
// SIG // AAOCAQEAQJb7nWjpb/Qn87+em51+NXMxerS7RyweOpel
// SIG // 1HIfqjTeOWZjkxcC6LdyY8Eq5+KMnEPakxE9UxQ2HdUD
// SIG // Q9C4l5is/TqgV2oukvF3cgkBGb3y/NoyALPacLAEOl71
// SIG // fYzcmz0rUYBf7DgDPw3sn5no/U4PRXEcF2p5NqoM3WWT
// SIG // W/BqBM3u39aK3ExdEPPSFF1iJZsBMEBWBdcI5/OzeGcS
// SIG // /Wf8QNpv0dc4sxcpVj/5qWpgp1X2WS5GnxSzVDVZnL3P
// SIG // vYDO73HibN+3d8nWm5OMEejm0d+LFmi6aZsj5bCNUKuS
// SIG // 7umyQlqF82LlqZKCuqBHqdYDC+kkQtxylUt1LHGYbTCC
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
// SIG // bGVzIFRTUyBFU046NjBCQy1FMzgzLTI2MzUxJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wi
// SIG // IwoBATAHBgUrDgMCGgMVAApnMjlpmcRK6atOgfHcuqDG
// SIG // ev/8oIGDMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTAwDQYJKoZIhvcNAQEFBQACBQDi7FBrMCIYDzIw
// SIG // MjAwODIzMDYxODE5WhgPMjAyMDA4MjQwNjE4MTlaMHcw
// SIG // PQYKKwYBBAGEWQoEATEvMC0wCgIFAOLsUGsCAQAwCgIB
// SIG // AAICJYsCAf8wBwIBAAICEPQwCgIFAOLtoesCAQAwNgYK
// SIG // KwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAqAKMAgC
// SIG // AQACAwehIKEKMAgCAQACAwGGoDANBgkqhkiG9w0BAQUF
// SIG // AAOBgQCy34sVD7ZFta+OLdZZSPP/4tL+SYEYPr9OJKD8
// SIG // 3saIDXU/uAE4n7iRBIq8zI9SQQdIGXmBytIrE7tl1TRB
// SIG // s63fkgodXq6VyTY3zFRgnq39ABC80oVV+RQWnBlcGhSp
// SIG // AvlkJgDHtvfr+wElz7Bkwd5X5DtSaQO/2lz2Efg+Kq/8
// SIG // pjGCAw0wggMJAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABJt+6SyK5goIHAAAAAAEmMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYL
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIMnNhIsS
// SIG // RXfqKf07h8MiMzfnV8THUZOcxsTFIiHc5OH8MIH6Bgsq
// SIG // hkiG9w0BCRACLzGB6jCB5zCB5DCBvQQgNv3P7569XnAM
// SIG // 72qTlmdsRnwJM65H6RnK7zFtOwkJdQ8wgZgwgYCkfjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAASbf
// SIG // uksiuYKCBwAAAAABJjAiBCAnQAXY/kXVd/uAwnmUJRKE
// SIG // u1EhxgZS0w6X3T4J85tqtzANBgkqhkiG9w0BAQsFAASC
// SIG // AQAQ2sTnJf8pIKexnt8jbyMFjMekJCeZx8s4SGJjZU1n
// SIG // NMHmcbILPrQWiM+0BcyDX6CB+RvoYoldLoGfh+QH72sA
// SIG // Z8pVkvYUITuhO8mcWI1UCOdj3unwpkiBekeNniDOF51q
// SIG // FCq652TlonL5jOMRZoITkm9np5DVsr7HxLS4yHWnPRhT
// SIG // btjDhLrxGRl63iaL4MjtjhHWccSE3XrzDUZSQGC8cb5w
// SIG // XPBKkGvnUSDGdV/ytCJdO8K9uMHjQGT3wyw7dB8XIkbW
// SIG // CrFN0piy9cBNECOk36KtqcOr7X/IfwCdOGf60wynvXpz
// SIG // flpHy+Tog7NXEKaLURtEYafNHa8dizsGX23l
// SIG // End signature block
