"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Commerce;
(function (Commerce) {
    "use strict";
    var ViewConfiguration = (function () {
        function ViewConfiguration(viewConfiguration) {
            this.page = viewConfiguration.page;
            this.path = viewConfiguration.path;
            this.phonePage = viewConfiguration.phonePage;
            this.viewController = viewConfiguration.viewController;
        }
        Object.defineProperty(ViewConfiguration.prototype, "isPhoneView", {
            get: function () {
                return Commerce.Config.isPhone && this.page !== this.phonePage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewConfiguration.prototype, "deviceSpecificViewName", {
            get: function () {
                if (this.isPhoneView) {
                    return this.phonePage;
                }
                else {
                    return this.page;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewConfiguration.prototype, "deviceSpecificViewLocation", {
            get: function () {
                if (this.isPhoneView) {
                    return this._phonePagePath;
                }
                else {
                    return this._pagePath;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewConfiguration.prototype, "pagePath", {
            get: function () {
                if (Commerce.StringExtensions.isNullOrWhitespace(this._pagePath)) {
                    ViewConfiguration.pageFullPathTemplate[0] = this.path;
                    ViewConfiguration.pageFullPathTemplate[2] = this.page;
                    this._pagePath = ViewConfiguration.pageFullPathTemplate.join("");
                }
                return this._pagePath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewConfiguration.prototype, "phonePagePath", {
            get: function () {
                if (Commerce.StringExtensions.isNullOrWhitespace(this._phonePagePath)) {
                    ViewConfiguration.pageFullPathTemplate[0] = this.path;
                    ViewConfiguration.pageFullPathTemplate[2] = this.phonePage;
                    this._phonePagePath = ViewConfiguration.pageFullPathTemplate.join("");
                }
                return this._phonePagePath;
            },
            enumerable: true,
            configurable: true
        });
        ViewConfiguration.pageFullPathTemplate = ["", "/", "", ".html"];
        return ViewConfiguration;
    }());
    Commerce.ViewConfiguration = ViewConfiguration;
    var ViewModelAdapterImpl = (function () {
        function ViewModelAdapterImpl() {
            this._isPseudoLocalizationEnabled = null;
            this.previousNonPseudoLocale = null;
        }
        ViewModelAdapterImpl.prototype.getLoginViewName = function () {
            return "LoginView";
        };
        ViewModelAdapterImpl.prototype.navigate = function (viewName, initialState) {
            if (Commerce.StringExtensions.isEmptyOrWhitespace(viewName)) {
                throw new Error("ViewModelAdapterImpl.navigate: View name cannot be null or empty.");
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(Commerce.navigator)) {
                throw new Commerce.NavigatorNotInitializedError("ViewModelAdapterImpl.navigate: Commerce.Navigator must be initialized");
            }
            var viewSettings = ViewModelAdapterImpl.navigateActions[viewName];
            if (Commerce.ObjectExtensions.isNullOrUndefined(viewSettings)) {
                throw new Error(Commerce.StringExtensions.format("ViewModelAdapterImpl.navigate: Unable to find settings for view '{0}'", viewName));
            }
            var correlationId = Commerce.LoggerHelper.getFormattedCorrelationId(initialState);
            if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                correlationId = Commerce.LoggerHelper.getNewCorrelationId();
            }
            Commerce.PerformanceLogger.logNavigationStart(viewName, correlationId);
            Commerce.navigator.navigate(viewSettings, initialState);
        };
        ViewModelAdapterImpl.prototype.collapse = function (viewName) {
            var viewSettings = ViewModelAdapterImpl.navigateActions[viewName];
            Commerce.navigator.collapse(viewSettings);
        };
        ViewModelAdapterImpl.prototype.collapseAndNavigate = function (viewName, initialState) {
            var viewSettings = ViewModelAdapterImpl.navigateActions[viewName];
            Commerce.navigator.collapseAndNavigate(viewSettings, initialState);
        };
        ViewModelAdapterImpl.prototype.navigateBack = function (correlationId) {
            Commerce.navigator.navigateBack(correlationId);
        };
        ViewModelAdapterImpl.prototype.bind = function (template, source) {
            WinJS.Binding.processAll(template, WinJS.Binding.as(source));
            ko.applyBindings(source, template);
        };
        ViewModelAdapterImpl.prototype.isInView = function (viewName) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(Commerce.navigator) || Commerce.ObjectExtensions.isNullOrUndefined(Commerce.navigator.pageControl)) {
                return false;
            }
            return this._viewNameContains(viewName);
        };
        ViewModelAdapterImpl.prototype.isInLogin = function () {
            return Commerce.ViewModelAdapter.isInView(this.getLoginViewName()) ||
                $(document).find("#loginDialog").length >= 1;
        };
        ViewModelAdapterImpl.prototype.goHome = function () {
            this.navigate(this._homeView);
        };
        ViewModelAdapterImpl.prototype.getResourceString = function (resourceName) {
            return Commerce.StringResourceManager.getString(resourceName);
        };
        ViewModelAdapterImpl.prototype.setDeveloperModeEnablePseudoLocalization = function (enable) {
            if (this.isPseudoLocalizationEnabled !== enable) {
                this.isPseudoLocalizationEnabled = enable;
                var locale = enable ? ViewModelAdapterImpl.PSEUDO_LOCALE : this.previousNonPseudoLocale;
                return this.setApplicationLanguageAsync(locale);
            }
            return Commerce.VoidAsyncResult.createResolved();
        };
        ViewModelAdapterImpl.prototype.getDeveloperModeEnablePseudoLocalization = function () {
            return Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.ENABLE_PSEUDO_LOCALIZATION) === "true";
        };
        ViewModelAdapterImpl.prototype.setApplicationLanguageAsync = function (languageTag) {
            var _this = this;
            if (Commerce.Helpers.DeveloperModeHelper.isDeveloperMode() && this.isPseudoLocalizationEnabled) {
                if (languageTag !== ViewModelAdapterImpl.PSEUDO_LOCALE) {
                    this.previousNonPseudoLocale = languageTag;
                }
                languageTag = ViewModelAdapterImpl.PSEUDO_LOCALE;
            }
            else {
                languageTag = languageTag || this.getDefaultUILanguage();
                this.previousNonPseudoLocale = languageTag;
            }
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                return Commerce.Host.instance.globalization.setApplicationLanguageAsync(languageTag);
            }).enqueue(function () {
                _this.changeUILayoutDirection(languageTag);
                var storeCulture = Commerce.ObjectExtensions.isNullOrUndefined(Commerce.ApplicationContext.Instance.deviceConfiguration)
                    ? _this.getDefaultUILanguage() : Commerce.ApplicationContext.Instance.deviceConfiguration.CultureName;
                if (Commerce.ObjectExtensions.isNullOrUndefined(Commerce.Extensibility.ExtensionCultureManager)) {
                    return Commerce.AsyncResult.createResolved();
                }
                return Commerce.AsyncResult.fromPromise(Commerce.Extensibility.ExtensionCultureManager.setExtensionCultures(storeCulture, languageTag));
            });
            return asyncQueue.run();
        };
        ViewModelAdapterImpl.prototype.getCurrentAppLanguage = function () {
            return Commerce.Host.instance.globalization.getApplicationLanguage();
        };
        ViewModelAdapterImpl.prototype.getDefaultUILanguage = function () {
            return Commerce.Host.instance.globalization.getDefaultLanguageTag();
        };
        ViewModelAdapterImpl.prototype.navigateToLockPage = function (staffId) {
            var lockRegisterViewOptions = {
                OperatorId: staffId
            };
            Commerce.ViewModelAdapter.navigate("LockRegister", lockRegisterViewOptions);
        };
        ViewModelAdapterImpl.prototype.displayMessageWithOptions = function (messageResourceID, messageOptions, correlationID) {
            var messageFormatData = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                messageFormatData[_i - 3] = arguments[_i];
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(messageOptions)) {
                messageOptions = new Commerce.MessageOptions();
            }
            var title = Commerce.ViewModelAdapter.getResourceString(messageOptions.titleResx);
            var message = Commerce.ViewModelAdapter.getResourceString(messageResourceID);
            if (!Commerce.StringExtensions.isNullOrWhitespace(message) && Commerce.ArrayExtensions.hasElements(messageFormatData)) {
                message = Commerce.StringExtensions.format.apply(Commerce.StringExtensions, __spreadArrays([message], messageFormatData));
            }
            this.logMessageDisplayed(messageOptions.messageType, messageOptions.titleResx, title, messageResourceID, message, JSON.stringify(messageOptions.additionalInfo), correlationID);
            var dlg = new Commerce.Controls.MessageDialog();
            var asyncResult = new Commerce.AsyncResult();
            var buttons = this.getMessageDialogButtons(messageOptions.messageButtons, messageOptions.primaryButtonIndex);
            var dialogOptions = {
                title: title,
                content: message,
                additionalInformation: messageOptions.additionalInfo,
                buttons: buttons,
                hideOnEscape: true,
                messageCheckboxVisible: messageOptions.displayMessageCheckbox,
                messageCheckboxChecked: messageOptions.messageCheckboxChecked,
                messageCheckboxLabelResourceID: messageOptions.messageCheckboxLabelResourceID
            };
            var asyncDialogResult = dlg.show(dialogOptions);
            asyncDialogResult.onAny(function (result) {
                asyncResult.resolve({ dialogResult: result, messageCheckboxChecked: dlg.MessageCheckboxChecked });
            });
            return asyncResult;
        };
        ViewModelAdapterImpl.prototype.displayMessage = function (messageResourceID, messageType, messageButtons, titleResourceID, primaryButtonIndex) {
            var messageFormatData = [];
            for (var _i = 5; _i < arguments.length; _i++) {
                messageFormatData[_i - 5] = arguments[_i];
            }
            var messageOptions = new Commerce.MessageOptions();
            messageOptions.messageType = messageType;
            messageOptions.messageButtons = messageButtons;
            messageOptions.titleResx = titleResourceID;
            messageOptions.primaryButtonIndex = primaryButtonIndex;
            return this.displayMessageWithOptions.apply(this, __spreadArrays([messageResourceID, messageOptions, null], messageFormatData)).map(function (result) { return result.dialogResult; });
        };
        ViewModelAdapterImpl.prototype.getApplicationVersion = function () {
            return Commerce.Host.instance.application.getApplicationVersion();
        };
        ViewModelAdapterImpl.prototype.getApplicationPublisher = function () {
            return Commerce.Host.instance.application.getApplicationIdentity().publisher;
        };
        ViewModelAdapterImpl.prototype.copyToClipboard = function (message) {
            var clipboardData = window.clipboardData;
            clipboardData.setData("Text", message);
        };
        ViewModelAdapterImpl.prototype.renderControl = function (parentElement, controlName, options) {
            var viewPath = ViewModelAdapterImpl.controlNameToViewPath[controlName];
            var pageControl = WinJS.UI.Pages.get(viewPath);
            var viewControllerType = pageControl.prototype._viewControllerType;
            if (viewControllerType && Commerce.ObjectExtensions.isOfType(viewControllerType.prototype, Commerce.Controls.UserControl)) {
                var control = new viewControllerType(options);
                parentElement.appendChild(control.element);
                control.render();
                return control;
            }
            else {
                throw new DOMException(Commerce.StringExtensions.format("Control with name: {0} does not extend UserControl", controlName));
            }
        };
        ViewModelAdapterImpl.prototype.define = function (viewConfiguration) {
            ViewModelAdapterImpl.navigateActions[viewConfiguration.page] = viewConfiguration;
            var perfMarker;
            var defineView = function (path, viewControllerType) {
                WinJS.UI.Pages.define(path, {
                    getContentElement: function (element) {
                        var contentElement = element;
                        if (Commerce.ArrayExtensions.hasElements(element.children)) {
                            contentElement = element.children[0];
                        }
                        return contentElement;
                    },
                    init: function (element, options) {
                        if (viewControllerType && viewControllerType.prototype) {
                            if (viewControllerType.prototype instanceof Commerce.ViewControllers.ViewControllerBase) {
                                var context = {
                                    controlFactory: new Commerce.Controls.ControlFactory(),
                                    managerFactory: Commerce.Model.Managers.Factory,
                                    peripherals: Commerce.Peripherals.instance,
                                    runtime: Commerce.Runtime,
                                    stringResourceManager: Commerce.StringResourceManager,
                                    interaction: Commerce.Interaction.instance
                                };
                                this.viewController = new viewControllerType(context, options);
                            }
                            else {
                                var context = ViewModelAdapterImpl.navigateActions[viewConfiguration.page].extensionContext;
                                this.viewController = new viewControllerType(context, options);
                            }
                            perfMarker = Commerce.PerformanceLogger.markStart("ViewModelAdapter.define", true);
                        }
                    },
                    processed: function (element, options) {
                        if (this.viewController && this.viewController.onCreated) {
                            this.viewController.onCreated(this.getContentElement(element));
                        }
                    },
                    ready: function (element, options) {
                        var _this = this;
                        if (this.viewController) {
                            if (this.viewController.load) {
                                this.viewController.load();
                            }
                            if (Commerce.ObjectExtensions.isFunction(this.viewController.onBarcodeScanned)) {
                                Commerce.Peripherals.instance.barcodeScanner.enableAsync(this.viewController.onBarcodeScanned.bind(this.viewController));
                            }
                            if (Commerce.ObjectExtensions.isFunction(this.viewController.onMsrSwiped)) {
                                Commerce.Peripherals.instance.magneticStripeReader.enableAsync(this.viewController.onMsrSwiped.bind(this.viewController));
                            }
                            if (this.viewController.captureGlobalInputForNumPad
                                && this.viewController.numPadInputBroker) {
                                Commerce.Peripherals.instance.numPad.enable(this.viewController.numPadInputBroker);
                            }
                            if (this.viewController.onShown) {
                                this.viewController.onShown();
                            }
                        }
                        if (this.viewController instanceof Commerce.ViewControllers.CustomViewControllerAdapter) {
                            this.viewController.onReady(this.getContentElement(element));
                        }
                        else if (this.viewController instanceof Commerce.ViewControllers.ViewControllerBase) {
                            Commerce.ViewModelAdapterWinJS.bind(element, this.viewController);
                        }
                        else if (this.viewController.onReady) {
                            this.viewController.onReady(element);
                        }
                        if (this.viewController && this.viewController.afterBind) {
                            this.viewController.afterBind(this.getContentElement(element));
                        }
                        window.setTimeout(function () {
                            var event = document.createEvent("Event");
                            event.initEvent("resize", true, false);
                            window.dispatchEvent(event);
                        }, 50);
                        window.setTimeout(function () {
                            if (_this.viewController.afterShown) {
                                _this.viewController.afterShown();
                            }
                        }, 0);
                        if (perfMarker) {
                            perfMarker.markEnd();
                        }
                    },
                    unload: function () {
                        if (this.viewController && this.viewController.unload) {
                            this.viewController.unload();
                        }
                    }
                });
            };
            defineView(viewConfiguration.pagePath, viewConfiguration.viewController);
            if (!Commerce.StringExtensions.isNullOrWhitespace(viewConfiguration.phonePage) && viewConfiguration.phonePage !== viewConfiguration.page) {
                defineView(viewConfiguration.phonePagePath, viewConfiguration.viewController);
            }
        };
        ViewModelAdapterImpl.prototype.defineControl = function (controlConfiguration, viewControllerType) {
            var controlViewPath = controlConfiguration.contentFolderPath + "/" + controlConfiguration.name + ".html";
            ViewModelAdapterImpl.controlNameToViewPath[controlConfiguration.name] = controlViewPath;
            var userControlType = Commerce.Controls.UserControl;
            if (viewControllerType && Commerce.ObjectExtensions.isOfType(viewControllerType.prototype, userControlType)) {
                viewControllerType.prototype._controlName = controlConfiguration.name;
                viewControllerType.prototype._viewPath = controlViewPath;
            }
            return WinJS.UI.Pages.define(controlViewPath, {
                _viewControllerType: viewControllerType,
                _isDefined: true,
                init: function (element, options) {
                    if (options && Commerce.ObjectExtensions.isOfType(options, userControlType)) {
                        this.viewController = options;
                    }
                    else {
                        this.viewController = new viewControllerType(options);
                    }
                },
                processed: function (element, options) {
                    if (this.viewController.onCreated) {
                        this.viewController.onCreated(element);
                    }
                },
                ready: function (element, options) {
                    if (this.viewController.onLoaded) {
                        this.viewController.onLoaded();
                    }
                    Commerce.ViewModelAdapterWinJS.bind(element, this.viewController);
                },
                unload: function () {
                    if (this.viewController && this.viewController.unload) {
                        this.viewController.unload();
                    }
                }
            });
        };
        ViewModelAdapterImpl.prototype.isControlDefined = function (path) {
            return WinJS.UI.Pages.get(path).prototype._isDefined;
        };
        ViewModelAdapterImpl.prototype.setFocusInWinControl = function (winControl, index) {
            if (index === void 0) { index = 0; }
            if (!Commerce.ObjectExtensions.isNullOrUndefined(winControl)
                && !Commerce.ObjectExtensions.isNullOrUndefined(winControl.itemDataSource)
                && !Commerce.ObjectExtensions.isNullOrUndefined(winControl.itemDataSource.list)
                && winControl.itemDataSource.list.length > index
                && winControl.selection.count() === 0) {
                winControl.currentItem = { index: index, hasFocus: true, showFocus: true };
            }
        };
        ViewModelAdapterImpl.prototype.bindReportParameters = function (element, data) {
            $(element).find(".controlPlaceholder").each(function (index, controlPlaceholderElement) {
                switch (data.Type) {
                    case "DateTime":
                        var datePicker = new WinJS.UI.DatePicker(controlPlaceholderElement);
                        datePicker.current = data.Value;
                        datePicker.datePattern = "{day.integer(2)} {dayofweek.full}";
                        datePicker.addEventListener("change", function (eventInfo) {
                            data.Value = eventInfo.currentTarget.winControl.current;
                        });
                        if (controlPlaceholderElement.hasAttribute(ViewModelAdapterImpl.INTERNAL_CONTROL_ID_ATTRIBUTE)) {
                            var internalControlId = controlPlaceholderElement.getAttribute(ViewModelAdapterImpl.INTERNAL_CONTROL_ID_ATTRIBUTE);
                            var datepickerLabel = $(controlPlaceholderElement).prev().html();
                            var $firstDatePickerControl = $(controlPlaceholderElement).children().first();
                            if ($firstDatePickerControl.length > 0) {
                                $firstDatePickerControl.attr("id", internalControlId);
                                $firstDatePickerControl.attr("aria-label", Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_4655"), datepickerLabel));
                            }
                            var $secondDatePickerControl = $(controlPlaceholderElement).find(".win-datepicker-date");
                            if ($secondDatePickerControl.length > 0) {
                                $secondDatePickerControl.attr("aria-label", Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_4656"), datepickerLabel));
                            }
                            var $thirdDatePickerControl = $(controlPlaceholderElement).find(".win-datepicker-year");
                            if ($thirdDatePickerControl.length > 0) {
                                $thirdDatePickerControl.attr("aria-label", Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_4657"), datepickerLabel));
                            }
                            ko.applyBindingsToNode(controlPlaceholderElement, { axBubbleAttr: internalControlId });
                        }
                        return datePicker;
                    default:
                        var $wrappingInputDiv = $("<div tabindex='-1' class='minWidth288 maxWidth360'></div>");
                        var $input = $("<input type='text'/>");
                        $input.val(data.Value).blur(function (eventInfo) {
                            data.Value = $(eventInfo.currentTarget).val();
                        });
                        $wrappingInputDiv.append($input);
                        $(controlPlaceholderElement).append($wrappingInputDiv);
                        if (controlPlaceholderElement.hasAttribute("internalControlId")) {
                            var internalControlId = controlPlaceholderElement.getAttribute(ViewModelAdapterImpl.INTERNAL_CONTROL_ID_ATTRIBUTE);
                            $input.attr("id", internalControlId);
                            Commerce.BubbleHelper.formatAttribute($input[0], "{0}_reportParameter", internalControlId);
                        }
                        return $input;
                }
            });
        };
        ViewModelAdapterImpl.prototype.getLanguageTextDirection = function (languageTag) {
            var direction = Commerce.CSSHelpers.LEFT_TO_RIGHT_TEXT_DIRECTION;
            if (!Commerce.StringExtensions.isNullOrWhitespace(languageTag)) {
                var matchedRegionalLanguage = Commerce.ArrayExtensions.firstOrUndefined(ViewModelAdapterImpl.RIGHTTOLEFT_REGIONALLANGUAGES, function (lang) {
                    return Commerce.StringExtensions.compare(lang, languageTag, true) === 0;
                });
                var matchedLanguage = null;
                if (Commerce.ObjectExtensions.isNullOrUndefined(matchedRegionalLanguage)) {
                    var fullLanguage = languageTag.split("-", 1);
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(fullLanguage) && fullLanguage.length === 1) {
                        var language_1 = fullLanguage[0];
                        matchedLanguage = Commerce.ArrayExtensions.firstOrUndefined(ViewModelAdapterImpl.RIGHTTOLEFT_LANGUAGES, function (lang) {
                            return Commerce.StringExtensions.compare(lang, language_1, true) === 0;
                        });
                    }
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(matchedRegionalLanguage) || !Commerce.ObjectExtensions.isNullOrUndefined(matchedLanguage)) {
                    direction = Commerce.CSSHelpers.RIGHT_TO_LEFT_TEXT_DIRECTION;
                }
            }
            return direction;
        };
        ViewModelAdapterImpl.prototype.getCurrentViewName = function () {
            return Commerce.navigator.getCurrentViewName();
        };
        Object.defineProperty(ViewModelAdapterImpl.prototype, "_homeView", {
            get: function () {
                return "HomeView";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewModelAdapterImpl.prototype, "isPseudoLocalizationEnabled", {
            get: function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._isPseudoLocalizationEnabled)) {
                    this._isPseudoLocalizationEnabled = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.ENABLE_PSEUDO_LOCALIZATION) === "true";
                }
                return this._isPseudoLocalizationEnabled;
            },
            set: function (value) {
                this._isPseudoLocalizationEnabled = value;
                Commerce.ApplicationStorage.setItem(Commerce.ApplicationStorageIDs.ENABLE_PSEUDO_LOCALIZATION, Commerce.StringExtensions.EMPTY + value);
            },
            enumerable: true,
            configurable: true
        });
        ViewModelAdapterImpl.prototype.getMessageDialogButtons = function (messageButtons, primaryButtonIndex) {
            messageButtons = messageButtons || Commerce.MessageBoxButtons.Default;
            var buttons = [];
            switch (messageButtons) {
                case Commerce.MessageBoxButtons.OKCancel:
                    buttons[0] = {
                        label: Commerce.ViewModelAdapter.getResourceString("string_75"),
                        operationId: Commerce.Controls.Dialog.OperationIds.OK_BUTTON_CLICK,
                        result: Commerce.DialogResult.OK
                    };
                    buttons[1] = {
                        label: Commerce.ViewModelAdapter.getResourceString("string_76"),
                        operationId: Commerce.Controls.Dialog.OperationIds.CANCEL_BUTTON_CLICK,
                        result: Commerce.DialogResult.Cancel,
                        isPrimary: true,
                        cancelCommand: true
                    };
                    break;
                case Commerce.MessageBoxButtons.YesNo:
                    buttons[0] = {
                        label: Commerce.ViewModelAdapter.getResourceString("string_77"),
                        operationId: Commerce.Controls.Dialog.OperationIds.OK_BUTTON_CLICK,
                        result: Commerce.DialogResult.Yes
                    };
                    buttons[1] = {
                        label: Commerce.ViewModelAdapter.getResourceString("string_78"),
                        operationId: Commerce.Controls.Dialog.OperationIds.CANCEL_BUTTON_CLICK,
                        result: Commerce.DialogResult.No,
                        isPrimary: true,
                        cancelCommand: true
                    };
                    break;
                case Commerce.MessageBoxButtons.RetryNo:
                    buttons[0] = {
                        label: Commerce.ViewModelAdapter.getResourceString("string_81"),
                        operationId: Commerce.Controls.Dialog.OperationIds.OK_BUTTON_CLICK,
                        result: Commerce.DialogResult.Yes
                    };
                    buttons[1] = {
                        label: Commerce.ViewModelAdapter.getResourceString("string_78"),
                        operationId: Commerce.Controls.Dialog.OperationIds.CANCEL_BUTTON_CLICK,
                        result: Commerce.DialogResult.No,
                        isPrimary: true,
                        cancelCommand: true
                    };
                    break;
                case Commerce.MessageBoxButtons.Default:
                    buttons[0] = {
                        label: Commerce.ViewModelAdapter.getResourceString("string_75"),
                        operationId: Commerce.Controls.Dialog.OperationIds.OK_BUTTON_CLICK,
                        result: Commerce.DialogResult.Close
                    };
            }
            if (!Commerce.ObjectExtensions.isNullOrUndefined(primaryButtonIndex)) {
                for (var i = 0; i < buttons.length; i++) {
                    if (i === primaryButtonIndex) {
                        buttons[i].isPrimary = true;
                    }
                }
            }
            return buttons;
        };
        ViewModelAdapterImpl.prototype.logMessageDisplayed = function (messageType, messageTitleResourceID, messageTitle, messageResourceID, message, additionalInfo, correlationID) {
            var messageTypeString = !Commerce.ObjectExtensions.isNullOrUndefined(messageType)
                ? Commerce.MessageType[messageType] : Commerce.MessageType[Commerce.MessageType.Info];
            if (Commerce.StringExtensions.isNullOrWhitespace(correlationID)) {
                correlationID = TsLogging.Utils.generateGuid();
                var resourceIDsAndCulture = Commerce.NotificationHandler.getResourceIDAndCultureString(messageTitleResourceID, messageResourceID, null);
                Commerce.RetailLogger.individualMessageDisplayed(messageTypeString, resourceIDsAndCulture, messageTitle, message, additionalInfo, correlationID);
            }
            Commerce.RetailLogger.messageDisplayed(messageTypeString, messageTitle, message, additionalInfo, correlationID);
        };
        ViewModelAdapterImpl.prototype.changeUILayoutDirection = function (languageTag) {
            if (Commerce.Helpers.DeveloperModeHelper.isDeveloperMode() && Commerce.Helpers.DeveloperModeHelper.isTextDirectionSet()) {
                Commerce.CSSHelpers.setTextDirection(Commerce.Helpers.DeveloperModeHelper.getTextDirection());
            }
            else {
                Commerce.CSSHelpers.setTextDirection(this.getLanguageTextDirection(languageTag));
            }
        };
        ViewModelAdapterImpl.prototype._viewNameContains = function (searchString) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(Commerce.navigator) ||
                Commerce.StringExtensions.isNullOrWhitespace(Commerce.navigator.getCurrentViewName()) ||
                Commerce.StringExtensions.isNullOrWhitespace(searchString)) {
                return false;
            }
            return (Commerce.navigator.getCurrentViewName().toUpperCase().indexOf(searchString.toUpperCase()) >= 0);
        };
        ViewModelAdapterImpl.RIGHTTOLEFT_LANGUAGES = ["ar", "dv", "fa", "he", "prs", "ps", "syr", "ug", "ur"];
        ViewModelAdapterImpl.RIGHTTOLEFT_REGIONALLANGUAGES = ["ku-Arab", "pa-Arab", "sd-Arab", "qps-plocm"];
        ViewModelAdapterImpl.PSEUDO_LOCALE = "qps-ploc";
        ViewModelAdapterImpl.INTERNAL_CONTROL_ID_ATTRIBUTE = "internalControlId";
        ViewModelAdapterImpl.navigateActions = Object.create(null);
        ViewModelAdapterImpl.controlNameToViewPath = Object.create(null);
        return ViewModelAdapterImpl;
    }());
    Commerce.ViewModelAdapterImpl = ViewModelAdapterImpl;
    Commerce.ViewModelAdapterWinJS = Commerce.ViewModelAdapter = new ViewModelAdapterImpl();
})(Commerce || (Commerce = {}));
(function ($) {
    $.each(["show", "hide"], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            var returnValue = el.apply(this, arguments);
            this.trigger(ev);
            return returnValue;
        };
    });
})(jQuery);
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
var Pos;
(function (Pos) {
    "use strict";
    var AsyncQueue = Commerce.AsyncQueue;
    var VoidAsyncResult = Commerce.VoidAsyncResult;
    var InitializerBase = (function () {
        function InitializerBase() {
            this._initializationFailed = false;
        }
        InitializerBase.prototype.initialize = function (userAgent) {
            var _this = this;
            Commerce.StringResourceManager = new Commerce.PosStringResourceManager(function (id) { return WinJS.Resources.getString(id).value; });
            WinJS.Binding.optimizeBindingReferences = true;
            var CORRELATION_ID = Commerce.LoggerHelper.getNewCorrelationId();
            var isFirstActivation = true;
            WinJS.Application.onactivated = function (args) {
                if (isFirstActivation) {
                    isFirstActivation = false;
                    args.setPromise(_this._handleInitializationResult(_this._onFirstActivation(CORRELATION_ID, userAgent)));
                }
                else {
                    args.setPromise(_this._convertAsyncResultToWinJSPromise(VoidAsyncResult.createResolved()));
                }
            };
            var isFirstReady = true;
            WinJS.Application.onready = function (args) {
                if (isFirstReady) {
                    isFirstReady = false;
                    args.setPromise(_this._handleInitializationResult(_this._onFirstReady(CORRELATION_ID, userAgent)));
                }
                else {
                    args.setPromise(_this._convertAsyncResultToWinJSPromise(VoidAsyncResult.createResolved()));
                }
            };
            WinJS.Application.onerror = this._onError.bind(this);
            WinJS.Application.oncheckpoint = function (args) {
                return args.setPromise(_this._convertAsyncResultToWinJSPromise(_this.onCheckpoint(args)));
            };
            WinJS.Application.start();
        };
        InitializerBase.prototype.configureEnvironmentPrerequisites = function (userAgent) {
            this._fixDropDownForEdge(userAgent);
        };
        InitializerBase.prototype.onCheckpoint = function (args) {
            return VoidAsyncResult.createResolved();
        };
        InitializerBase.prototype.convertWinJSPromiseToAsyncResult = function (winJSPromise) {
            var asyncResult = new Commerce.AsyncResult();
            winJSPromise.done(function (value) {
                asyncResult.resolve(void 0);
            }, function (error) {
                asyncResult.reject(error);
            });
            return asyncResult;
        };
        InitializerBase.prototype.loadExtensibilityFrameworkAsync = function (correlationId, isIndependentPackagingEnabled) {
            var compositionQueue = new Commerce.AsyncQueue();
            var SYSTEM_JS_FORMAT = "register";
            var posPackages = {
                "./Api": {
                    format: SYSTEM_JS_FORMAT,
                    defaultExtension: "js"
                },
                "./ExtensibilityFramework": {
                    format: SYSTEM_JS_FORMAT,
                    defaultExtension: "js"
                }
            };
            if (!isIndependentPackagingEnabled) {
                posPackages["./UISdk"] = {
                    format: SYSTEM_JS_FORMAT,
                    defaultExtension: "js"
                };
                posPackages["./UI.Sdk.Framework"] = {
                    format: SYSTEM_JS_FORMAT,
                    defaultExtension: "js"
                };
            }
            SystemJS.config({
                packages: posPackages,
                meta: {
                    "*.js": {
                        scriptLoad: true
                    }
                }
            });
            compositionQueue.enqueue(function () {
                return Commerce.AsyncResult.fromPromise(SystemJS.import("./Api/Pos.Api"))
                    .fail(function (errors) {
                    Commerce.RetailLogger.extensibilityFrameworkFailedToLoadPosApi(Commerce.ErrorHelper.serializeError(errors), correlationId);
                });
            });
            if (!isIndependentPackagingEnabled) {
                compositionQueue.enqueue(function () {
                    return Commerce.AsyncResult.fromPromise(SystemJS.import("./UISdk/Pos.UI.Sdk"))
                        .fail(function (loadSdkError) {
                        Commerce.RetailLogger.extensibilityFrameworkFailedToLoadPosUISdk(Commerce.ErrorHelper.serializeError(loadSdkError), correlationId);
                    });
                }).enqueue(function () {
                    return Commerce.AsyncResult.fromPromise(SystemJS.import("./UI.Sdk.Framework/Pos.UI.Sdk.Framework"))
                        .fail(function (errors) {
                        Commerce.RetailLogger.posStartUpLoadUISdkFrameworkLibraryFailed(correlationId, Commerce.ErrorHelper.serializeError(errors));
                    });
                }).enqueue(function () {
                    return Commerce.AsyncResult.fromPromise(SystemJS.import("UISdkLoader"))
                        .done(function (sdkLoaderModule) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(sdkLoaderModule)
                            || Commerce.ObjectExtensions.isNullOrUndefined(sdkLoaderModule.default)) {
                            throw new Error("Unable to import sdkLoaderModule.");
                        }
                        else if (!Commerce.ObjectExtensions.isFunction(sdkLoaderModule.default.initialize)) {
                            throw new Error("SDK Loader Initialize method not found.");
                        }
                        sdkLoaderModule.default.initialize();
                    }).fail(function (sdkLoaderError) {
                        Commerce.RetailLogger.extensibilityFrameworkFailedToLoadPosUISdkLoader(Commerce.ErrorHelper.serializeError(sdkLoaderError), correlationId);
                    });
                });
            }
            return compositionQueue.enqueue(function () {
                return Commerce.AsyncResult.fromPromise(SystemJS.import("./ExtensibilityFramework/Pos.ExtensibilityFramework"))
                    .fail(function (errors) {
                    Commerce.RetailLogger.posStartUpLoadExtensibilityFrameworkLibraryFailed(correlationId, Commerce.ErrorHelper.serializeError(errors));
                });
            }).enqueue(function () {
                var loadExtensionsLoaderFactoryAsyncResult = new Commerce.AsyncResult();
                SystemJS.import("ExtensionsLoaderFactory").then(function (extensionsLoaderFactory) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(extensionsLoaderFactory)
                        || Commerce.ObjectExtensions.isNullOrUndefined(extensionsLoaderFactory.default)) {
                        throw new Error("InitalizerBase - Unable to import ExtensionsLoaderFactory.");
                    }
                    loadExtensionsLoaderFactoryAsyncResult.resolve(extensionsLoaderFactory);
                }).catch(function (reason) {
                    loadExtensionsLoaderFactoryAsyncResult.reject(reason);
                });
                return loadExtensionsLoaderFactoryAsyncResult.fail(function (extensionLoaderFactoryLoadError) {
                    Commerce.RetailLogger.extensibilityFrameworkFailedToLoadExtensionLoader(Commerce.ErrorHelper.serializeError(extensionLoaderFactoryLoadError), correlationId);
                });
            }).run().map(function (queueResult) {
                return queueResult.data.default;
            });
        };
        InitializerBase.prototype.createExtensionsLoaderOptions = function () {
            var loadModuleAsync = function (modulePath) {
                return System.import(modulePath);
            };
            var loadJsonAsync = function (fullFilePath) {
                if (!Commerce.StringExtensions.isNullOrWhitespace(fullFilePath)) {
                    if (Commerce.Helpers.DeveloperModeHelper.isDeveloperMode()) {
                        fullFilePath = fullFilePath + "?" + Date.now();
                    }
                    return Commerce.DataHelper.loadJsonAsync(fullFilePath).getPromise();
                }
                return Promise.resolve(null);
            };
            var createdAndInsertedHtmlPlaceholder;
            var createAndInsertHtmlImpl = function (elementId) {
                var CREATED_AND_INSERTED_HTML_PLACEHOLDER_ID = "CustomControlsFragmentsPlaceholder";
                if (Commerce.ObjectExtensions.isNullOrUndefined(createdAndInsertedHtmlPlaceholder)) {
                    createdAndInsertedHtmlPlaceholder
                        = document.getElementById(CREATED_AND_INSERTED_HTML_PLACEHOLDER_ID);
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(createdAndInsertedHtmlPlaceholder)) {
                    var errorMessage = "Unable to find required created and inserted html placeholder element '"
                        + CREATED_AND_INSERTED_HTML_PLACEHOLDER_ID + "'.";
                    Commerce.RetailLogger.extensibilityFrameworkUnableToFindRequiredCreatedAndInsertedHtmlPlaceholder(errorMessage);
                    return null;
                }
                var newElement = document.createElement("div");
                newElement.id = elementId;
                createdAndInsertedHtmlPlaceholder.appendChild(newElement);
                return newElement;
            };
            var renderHtmlAsyncImpl = function (htmlFragmentPath, element) {
                var promise = new Promise(function (resolve, reject) {
                    WinJS.UI.Fragments.render(htmlFragmentPath, element).done(function () {
                        resolve();
                    }, function (error) {
                        reject(error);
                    });
                });
                return promise;
            };
            var cacheHtmlFragmentAsyncImpl = function (htmlFragmentPath) {
                var promise = new Promise(function (resolve, reject) {
                    WinJS.UI.Fragments.cache(htmlFragmentPath).done(function () {
                        resolve();
                    }, function (error) {
                        reject(error);
                    });
                });
                return promise;
            };
            var createTemplatedDialogProxy = function (htmlTemplatePath, dialog) {
                return new Commerce.Controls.ExtensionTemplatedDialogProxy(htmlTemplatePath, dialog);
            };
            var createCustomViewControllerAdapterType = function (createViewController) {
                return (function (_super) {
                    __extends(class_1, _super);
                    function class_1(context, options) {
                        return _super.call(this, context, createViewController, options) || this;
                    }
                    return class_1;
                }(Commerce.ViewControllers.CustomViewControllerAdapter));
            };
            var addCultureInfoImpl = function (cultureName, baseCultureName, info) {
                Globalize.addCultureInfo(cultureName, baseCultureName, info);
            };
            var controlFactory = new Commerce.Controls.ControlFactory();
            window.define = SystemJS.amdDefine;
            var configurePackageDependencies = function (extensionsBaseUrl, dependencies) {
                var packageConfig = {
                    meta: {},
                    map: {}
                };
                dependencies.forEach(function (dependency) {
                    var formattedDependencyModulePath = Commerce.StringExtensions.format("./{0}.js", dependency.modulePath);
                    packageConfig.meta[formattedDependencyModulePath] = {
                        format: dependency.format
                    };
                    packageConfig.map[dependency.alias] = formattedDependencyModulePath;
                });
                var systemJSConfig = {
                    packages: {}
                };
                systemJSConfig.packages[extensionsBaseUrl] = packageConfig;
                SystemJS.config(systemJSConfig);
            };
            var registerViewImpl = function (viewRegistration) {
                var viewConfiguration = {
                    page: viewRegistration.pageName,
                    phonePage: viewRegistration.phonePageName,
                    path: viewRegistration.viewDirectory,
                    viewController: viewRegistration.viewControllerType,
                    pagePath: viewRegistration.pagePath,
                    phonePagePath: viewRegistration.phonePagePath,
                    deviceSpecificViewName: viewRegistration.pageName,
                    deviceSpecificViewLocation: viewRegistration.pagePath,
                    extensionContext: viewRegistration.extensionContext
                };
                Commerce.ViewModelAdapter.define(viewConfiguration);
            };
            return {
                loadModuleAsync: loadModuleAsync,
                loadJsonAsync: loadJsonAsync,
                configureExtensionPackageDependencies: configurePackageDependencies,
                cacheHtmlFragmentAsync: cacheHtmlFragmentAsyncImpl,
                createAndInsertHtml: createAndInsertHtmlImpl,
                renderHtmlAsync: renderHtmlAsyncImpl,
                createTemplatedDialogProxy: createTemplatedDialogProxy,
                createCustomViewControllerAdapterType: createCustomViewControllerAdapterType,
                addCultureInfo: addCultureInfoImpl,
                controlFactory: controlFactory,
                registerView: registerViewImpl
            };
        };
        InitializerBase.prototype._registerViews = function (views) {
            views.forEach(function (viewConfiguration) {
                if (!Commerce.StringExtensions.isNullOrWhitespace(viewConfiguration.page) &&
                    !Commerce.StringExtensions.isNullOrWhitespace(viewConfiguration.path) &&
                    !Commerce.ObjectExtensions.isNullOrUndefined(viewConfiguration.viewController)) {
                    Commerce.ViewModelAdapterWinJS.define(new Commerce.ViewConfiguration(viewConfiguration));
                }
            });
        };
        InitializerBase.prototype._registerControls = function (controls) {
            controls.forEach(function (controlConfiguration) {
                if (Commerce.ObjectExtensions.isOfType(controlConfiguration.control.prototype, Commerce.Controls.UserControl)) {
                    Commerce.ViewModelAdapterWinJS.defineControl(controlConfiguration, controlConfiguration.control);
                }
            });
        };
        InitializerBase.prototype._onFirstActivation = function (correlationId, userAgent) {
            var _this = this;
            this.configureEnvironmentPrerequisites(userAgent);
            Commerce.Config.initialize();
            this._registerControls(Commerce.Controls.getFrameworkControlConfigurations());
            var onFirstActivationQueue = new AsyncQueue();
            onFirstActivationQueue.enqueue(function () {
                return _this.convertWinJSPromiseToAsyncResult(WinJS.UI.processAll());
            }).enqueue(function () {
                return Commerce.CSSHelpers.loadAxRetailStylesheetAsync(correlationId);
            }).enqueue(function () {
                return Commerce.CSSHelpers.applyThemeAsync(correlationId, { Theme: "light" });
            });
            return onFirstActivationQueue.run();
        };
        InitializerBase.prototype._onFirstReady = function (correlationId, userAgent) {
            var _this = this;
            if (this._initializationFailed) {
                return Commerce.AsyncResult.createResolved({ canceled: true });
            }
            var onFirstReadyQueue = new AsyncQueue();
            onFirstReadyQueue.enqueue(function () {
                return _this.initializeApplicationFrameworkAsync(correlationId);
            }).enqueue(function () {
                return onFirstReadyQueue.cancelOn(_this.loadApplicationAsync(correlationId, userAgent));
            });
            return onFirstReadyQueue.run().done(function (queueResult) {
                if (!queueResult.canceled) {
                    _this.onInitializationComplete(correlationId);
                }
            });
        };
        InitializerBase.prototype._convertAsyncResultToWinJSPromise = function (asyncResult) {
            return new WinJS.Promise(function (completeDispatch, errorDispatch, progressDispatch) {
                asyncResult.done(function () {
                    completeDispatch();
                }).fail(function (errors) {
                    var commerceError = Commerce.ArrayExtensions.firstOrUndefined(errors);
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(commerceError)) {
                        errorDispatch(commerceError);
                    }
                    else {
                        errorDispatch();
                    }
                });
            });
        };
        InitializerBase.prototype._handleInitializationResult = function (asyncResult) {
            var _this = this;
            return new WinJS.Promise(function (completeDispatch, errorDispatch, progressDispatch) {
                asyncResult.fail(function (errors) {
                    _this._initializationFailed = true;
                    try {
                        Commerce.NotificationHandler.displayClientErrors(errors);
                    }
                    catch (ex) {
                        var commerceError = Commerce.ArrayExtensions.firstOrUndefined(errors);
                        if (Commerce.ObjectExtensions.isNullOrUndefined(commerceError)) {
                            commerceError = new Commerce.Proxy.Entities.Error("string_29076");
                        }
                        _this._showLastResortError(commerceError);
                    }
                    finally {
                        completeDispatch();
                    }
                }).always(function () {
                    completeDispatch();
                });
            });
        };
        InitializerBase.prototype._fixDropDownForEdge = function (userAgent) {
            if (this._isEdgeBrowser(userAgent)) {
                var remove_1 = HTMLSelectElement.prototype.remove;
                HTMLSelectElement.prototype.remove = function (index) {
                    if (arguments.length === 0) {
                        this.parentElement.removeChild(this);
                    }
                    else {
                        remove_1.call(this, index);
                        if (this.children[0] !== this.options[0]) {
                            this.insertBefore(this.children[0], this.children[1]);
                        }
                    }
                };
            }
        };
        InitializerBase.prototype._isEdgeBrowser = function (userAgent) {
            return userAgent.indexOf("Edge") > -1;
        };
        InitializerBase.prototype._showLastResortError = function (error) {
            Commerce.RetailLogger.posAppErrorHandlingLastResortErrorDisplayed(error.ErrorCode);
            var errorMessage = Commerce.NotificationHandler.getErrorMessage(error);
            this.displayLastResortErrorMessage(errorMessage);
        };
        InitializerBase.prototype._displayApplicationError = function () {
            var displayError = new Commerce.Proxy.Entities.Error("string_29000");
            try {
                Commerce.NotificationHandler.displayClientErrors([displayError]);
            }
            catch (exception) {
                this._showLastResortError(displayError);
            }
        };
        InitializerBase.prototype._onError = function (error) {
            var errorInfo = Commerce.Framework.ErrorResolver.resolveError(error);
            var errorJson = Commerce.StringExtensions.format("{ baseError: '{0}', mainError: '{1}' }", errorInfo.serializedBaseError, errorInfo.serializedMainError);
            Commerce.RetailLogger.appUnhandledError(errorInfo.message, errorInfo.stackTrace, errorInfo.url, errorJson);
            this._displayApplicationError();
        };
        return InitializerBase;
    }());
    Pos.InitializerBase = InitializerBase;
})(Pos || (Pos = {}));
var Commerce;
(function (Commerce) {
    var Operations;
    (function (Operations) {
        var handlerRegistrationHasBeenExecuted = false;
        function registerOperationHandlers(correlationId, context) {
            if (handlerRegistrationHasBeenExecuted) {
                return;
            }
            handlerRegistrationHasBeenExecuted = true;
            var operationsManager = Operations.OperationsManager.instance;
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ItemSale,
                handler: new Operations.ItemSaleOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ChangeUnitOfMeasure,
                handler: new Operations.ChangeUnitOfMeasureOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    { validatorFunctions: [Operations.Validators.restrictUnitOfMeasureOnCustomerOrderPickUp] },
                    {
                        dataAccessor: function (options) {
                            return options.cartLineUnitOfMeasures.map(function (cluom) {
                                return cluom.cartLine;
                            });
                        },
                        validatorFunctions: [
                            Operations.Validators.notHaveOverridenPrice,
                            Operations.Validators.notAllowQuantityUpdate,
                            Operations.Validators.includeOnlyNonReturnLinesOnCustomerOrder
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.SalesPerson,
                handler: new Operations.SalesPersonOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.OverrideTaxTransaction,
                handler: new Operations.OverrideTransactionTaxOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return options.cart;
                        },
                        validatorFunctions: [Operations.Validators.containsNonReturnCartLinesOnCustomerOrder]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.OverrideTaxTransactionList,
                handler: new Operations.OverrideTransactionTaxFromListOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return options.cart;
                        },
                        validatorFunctions: [Operations.Validators.containsNonReturnCartLinesOnCustomerOrder]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.OverrideTaxLine,
                handler: new Operations.OverrideLineProductTaxOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return [options.cartLine];
                        },
                        validatorFunctions: [
                            Operations.Validators.singleCartLineOperationValidator,
                            Operations.Validators.nonVoidedOperationValidator,
                            Operations.Validators.includeOnlyNonReturnLinesOnCustomerOrder,
                            Operations.Validators.notFromAReceiptOperationValidator,
                            Operations.Validators.notFromAGiftCertificateOperationValidator,
                            Operations.Validators.notAllowedOnSalesInvoiceLinesOperationValidator
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.OverrideTaxLineList,
                handler: new Operations.OverrideLineProductTaxFromListOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return [options.cartLine];
                        },
                        validatorFunctions: [
                            Operations.Validators.singleCartLineOperationValidator,
                            Operations.Validators.nonVoidedOperationValidator,
                            Operations.Validators.includeOnlyNonReturnLinesOnCustomerOrder,
                            Operations.Validators.notFromAReceiptOperationValidator,
                            Operations.Validators.notFromAGiftCertificateOperationValidator,
                            Operations.Validators.notAllowedOnSalesInvoiceLinesOperationValidator
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.InventoryLookup,
                handler: new Operations.InventoryLookupOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.StockCount,
                handler: new Operations.StockCountOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PriceCheck,
                handler: new Operations.PriceCheckOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.DepositOverride,
                handler: new Operations.DepositOverrideOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ReturnItem,
                handler: new Operations.ReturnProductOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnNonReturnCustomerOrderOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return options;
                        },
                        validatorFunctions: [Operations.Validators.returnLimitsValidator]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.productReturnDetails.filter(function (value) {
                                return !Commerce.ObjectExtensions.isNullOrUndefined(value.cartLine);
                            }).map(function (val) {
                                return val.cartLine;
                            });
                        },
                        validatorFunctions: [Operations.Validators.returnCartLinesOperationValidator]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.productReturnDetails.map(function (item) {
                                return item.cartLine;
                            });
                        },
                        validatorFunctions: [Operations.Validators.includeOnlyReturnLinesOnCustomerOrderExchange]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ReturnTransaction,
                handler: new Operations.ReturnTransactionOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnNonReturnCustomerOrderOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerOrderOrQuotation] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.VoidItem,
                handler: new Operations.VoidProductsOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.notIncomeExpenseTransaction,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.cartLines;
                        },
                        validatorFunctions: [
                            Operations.Validators.singleCartLineOperationValidator,
                            Operations.Validators.notAVoidedSalesInvoiceLine,
                            Operations.Validators.customerOrderVoidLineValidator
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ItemComment,
                handler: new Operations.ProductCommentOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PriceOverride,
                handler: new Operations.PriceOverrideOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.notIncomeExpenseTransaction,
                            Operations.Validators.isCustomerOrderOrQuoteInCreateOrEditState,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.cartLinePrices.map(function (clp) {
                                return clp.cartLine;
                            });
                        },
                        validatorFunctions: [
                            Operations.Validators.singleCartLineOperationValidator,
                            Operations.Validators.nonVoidedOperationValidator,
                            Operations.Validators.includeOnlyNonReturnLinesOnCustomerOrder,
                            Operations.Validators.notFromAReceiptOperationValidator,
                            Operations.Validators.notFromAGiftCertificateOperationValidator,
                            Operations.Validators.notAllowedOnSalesInvoiceLinesOperationValidator,
                            Operations.Validators.itemAllowsPriceOverrideOperationValidator
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.SetQuantity,
                handler: new Operations.SetQuantityOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.AddSerialNumber,
                handler: new Operations.AddSerialNumberOperationHandler(context),
                validators: [
                    {
                        dataAccessor: function (options) {
                            return options.cartLines;
                        },
                        validatorFunctions: [Operations.Validators.singleCartLineOperationValidator]
                    },
                    {
                        dataAccessor: function (options) {
                            return options;
                        },
                        validatorFunctions: [Operations.Validators.addSerialNumberForCartLineOperationValidator]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ClearQuantity,
                handler: new Operations.ClearQuantityOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.cartLines;
                        },
                        validatorFunctions: [
                            Operations.Validators.singleCartLineOperationValidator,
                            Operations.Validators.nonVoidedOperationValidator,
                            Operations.Validators.notFromAGiftCertificateOperationValidator,
                            Operations.Validators.notAllowedOnSalesInvoiceLinesOperationValidator,
                            Operations.Validators.notAllowedOnSerializedProductCartLinesOperationValidator,
                            Operations.Validators.notAllowedToKeyInQuantityOnProductCartLinesOperationValidator
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PickingAndReceiving,
                handler: new Operations.PickingAndReceivingOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.InboundInventory,
                handler: new Operations.ViewInventoryDocumentListOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.OutboundInventory,
                handler: new Operations.ViewInventoryDocumentListOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ClearCommissionSalesGroupOnLine,
                handler: new Operations.ClearCommissionSalesGroupOnLineHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.cartLines;
                        },
                        validatorFunctions: [
                            Operations.Validators.singleCartLineOperationValidator,
                            Operations.Validators.nonVoidedOperationValidator
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.SetCommissionSalesGroupOnLine,
                handler: new Operations.SetCommissionSalesGroupOnLineHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.cartLines;
                        },
                        validatorFunctions: [
                            Operations.Validators.singleCartLineOperationValidator,
                            Operations.Validators.nonVoidedOperationValidator
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ViewAllDiscounts,
                handler: new Operations.ViewAllDiscountsOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PayCash,
                handler: new Operations.PayCashOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.existingCart] },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [
                            Operations.PaymentValidators.unableToPayValidation,
                            Operations.PaymentValidators.preOperationValidation
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return { cart: Commerce.Session.instance.cart };
                        },
                        validatorFunctions: [Operations.PaymentValidators.payCash]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PayCard,
                handler: new Operations.PayCardOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [
                            Operations.PaymentValidators.unableToPayValidation,
                            Operations.PaymentValidators.preOperationValidation
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PayCustomerAccount,
                handler: new Operations.PayCustomerAccountOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    { validatorFunctions: [Operations.Validators.existingCart] },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [
                            Operations.PaymentValidators.unableToPayValidation,
                            Operations.PaymentValidators.preOperationValidation
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [Operations.PaymentValidators.payCustomerAccount]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PayCurrency,
                handler: new Operations.PayCurrencyOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.existingCart] },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [
                            Operations.PaymentValidators.unableToPayValidation,
                            Operations.PaymentValidators.preOperationValidation
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return {
                                cart: Commerce.Session.instance.cart,
                                currency: Commerce.ApplicationContext.Instance.deviceConfiguration.Currency
                            };
                        },
                        validatorFunctions: [Operations.PaymentValidators.payCurrency]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PayCheck,
                handler: new Operations.PayCheckOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.existingCart] },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [
                            Operations.PaymentValidators.unableToPayValidation,
                            Operations.PaymentValidators.preOperationValidation
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return { cart: Commerce.Session.instance.cart };
                        },
                        validatorFunctions: [Operations.PaymentValidators.payCheck]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PayCreditMemo,
                handler: new Operations.PayCreditMemoOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [
                            Operations.PaymentValidators.unableToPayValidation,
                            Operations.PaymentValidators.preOperationValidation,
                            Operations.PaymentValidators.prePayCreditMemoOperationValidation
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PayGiftCertificate,
                handler: new Operations.PayGiftCardOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [
                            Operations.PaymentValidators.unableToPayValidation,
                            Operations.PaymentValidators.preOperationValidation
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PayLoyalty,
                handler: new Operations.PayLoyaltyCardOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [
                            Operations.PaymentValidators.unableToPayValidation,
                            Operations.PaymentValidators.preOperationValidation
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PayCashQuick,
                handler: new Operations.PayCashQuickOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.existingCart] },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [
                            Operations.PaymentValidators.unableToPayValidation,
                            Operations.PaymentValidators.preOperationValidation
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return Commerce.Session.instance.cart;
                        },
                        validatorFunctions: [Operations.PaymentValidators.payCashQuick]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.VoidPayment,
                handler: new Operations.VoidPaymentOperationHandler(context),
                validators: [
                    {
                        dataAccessor: function (options) {
                            return options.tenderLines;
                        },
                        validatorFunctions: [Operations.Validators.singlePaymentLineOperationValidator, Operations.Validators.checkVoidPaymentOperationIsAllowed]
                    },
                    {
                        validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.AddLineCharge,
                handler: new Operations.AddLineChargeOperationHandler(context),
                validators: [
                    {
                        dataAccessor: function (options) {
                            return [options.cartLine];
                        },
                        validatorFunctions: [
                            Operations.Validators.nonVoidedOperationValidator,
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.AddHeaderCharge,
                handler: new Operations.AddHeaderChargeOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedWithSalesInvoiceLines
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.LineDiscountAmount,
                handler: new Operations.LineDiscountAmountOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.cartLineDiscounts.map(function (cld) {
                                return cld.cartLine;
                            });
                        },
                        validatorFunctions: [
                            Operations.Validators.nonVoidedOperationValidator,
                            Operations.Validators.includeOnlyNonReturnLinesOnCustomerOrder,
                            Operations.Validators.notFromAReceiptOperationValidator,
                            Operations.Validators.checkDiscountIsAllowed
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.LineDiscountPercent,
                handler: new Operations.LineDiscountPercentOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.cartLineDiscounts.map(function (cld) {
                                return cld.cartLine;
                            });
                        },
                        validatorFunctions: [
                            Operations.Validators.nonVoidedOperationValidator,
                            Operations.Validators.includeOnlyNonReturnLinesOnCustomerOrder,
                            Operations.Validators.notFromAReceiptOperationValidator,
                            Operations.Validators.checkDiscountIsAllowed,
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.TotalDiscountAmount,
                handler: new Operations.TotalDiscountAmountOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.cart;
                        },
                        validatorFunctions: [Operations.Validators.containsNonReturnCartLinesOnCustomerOrder]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.TotalDiscountPercent,
                handler: new Operations.TotalDiscountPercentOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.cart;
                        },
                        validatorFunctions: [Operations.Validators.containsNonReturnCartLinesOnCustomerOrder]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.DiscountCodeBarcode,
                handler: new Operations.AddCouponCodeOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CalculateFullDiscounts,
                handler: new Operations.CalculateTotalOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedOnCustomerAccountDeposit
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ViewAvailableDiscounts,
                handler: new Operations.AvailableDiscountsOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInOffline,
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.VoidTransaction,
                handler: new Operations.VoidTransactionOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.TransactionComment,
                handler: new Operations.TransactionCommentOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.InvoiceComment,
                handler: new Operations.InvoiceCommentOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.SuspendTransaction,
                handler: new Operations.SuspendTransactionOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.RecallTransaction,
                handler: new Operations.RecallTransactionOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.RecallSalesOrder,
                handler: new Operations.RecallCustomerOrderOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CustomerAccountDeposit,
                handler: new Operations.CustomerAccountDepositOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCartWithoutCustomerAccountOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCartWithNonCustomerAccountDepositLines] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ClearCommissionSalesGroupOnTransaction,
                handler: new Operations.ClearCommissionSalesGroupOnTransactionHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.existingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.SetCommissionSalesGroupOnTransaction,
                handler: new Operations.SetCommissionSalesGroupOnTransactionHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.existingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.SalesInvoice,
                handler: new Operations.SalesInvoiceOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.AddCoupons,
                handler: new Operations.AddCouponCodeOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedAddCouponToEmptyCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.RemoveCoupons,
                handler: new Operations.RemoveCouponsOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.existingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ViewMyClientBook,
                handler: new Operations.ViewEmployeeClientBookOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ViewStoreClientBooks,
                handler: new Operations.ViewStoreClientBooksOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.AddCustomerToClientBook,
                handler: new Operations.AddCustomerToClientBookOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.RemoveCustomersFromClientBook,
                handler: new Operations.RemoveCustomersFromClientBookOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ReassignClientBookCustomers,
                handler: new Operations.ReassignCustomersFromClientBookOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.AddAffiliation,
                handler: new Operations.AddAffiliationOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.AddAffiliationFromList,
                handler: new Operations.AddAffiliationFromListOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.AddAffiliationToCustomer,
                handler: new Operations.AddAffiliationToCustomerOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.RemoveAffiliationFromCustomer,
                handler: new Operations.RemoveAffiliationFromCustomerOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.LoyaltyRequest,
                handler: new Operations.AddLoyaltyCardOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.IssueCreditMemo,
                handler: new Operations.IssueCreditMemoOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.LoyaltyIssueCard,
                handler: new Operations.IssueLoyaltyCardOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.IssueGiftCertificate,
                handler: new Operations.IssueGiftCardOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    { validatorFunctions: [Operations.Validators.giftCardNotAllowedOnCustomerOrderOrQuotation] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.DisplayTotal,
                handler: new Operations.DisplayTotalOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.AddToGiftCard,
                handler: new Operations.AddGiftCardOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    { validatorFunctions: [Operations.Validators.giftCardNotAllowedOnCustomerOrderOrQuotation] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CashOutGiftCard,
                handler: new Operations.CashOutGiftCardOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    { validatorFunctions: [Operations.Validators.giftCardNotAllowedOnCustomerOrderOrQuotation] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.GiftCardBalance,
                handler: new Operations.GiftCardBalanceOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.LoyaltyCardPointsBalance,
                handler: new Operations.LoyaltyCardBalanceOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.IncomeAccounts,
                handler: new Operations.IncomeAccountsOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ExpenseAccounts,
                handler: new Operations.ExpenseAccountsOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.BuyWarranty,
                handler: new Operations.BuyWarrantyOperationHandler(context),
                validators: [
                    {
                        dataAccessor: function (options) {
                            return options.itemLines;
                        },
                        validatorFunctions: [
                            Operations.Validators.notAllowedOnVoidedCartLinesOperationValidator,
                            Operations.Validators.notAllowedOnGiftCardCartLinesOperationValidator,
                            Operations.Validators.notAllowedOnSalesInvoiceLinesOperationValidator,
                            Operations.Validators.checkWarrantableCartLinesOperationValidator
                        ],
                    },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCancellationRecallOrReturn] },
                    { validatorFunctions: [Operations.Validators.notIncomeExpenseTransaction] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.AddWarrantyToAnExistingTransaction,
                handler: new Operations.AddWarrantyToAnExistingTransactionOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    { validatorFunctions: [Operations.Validators.notIncomeExpenseTransaction] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.SetCustomer,
                handler: new Operations.AddCustomerToSalesOrderOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnRecalledOrder] },
                    {
                        dataAccessor: function (options) {
                            return options.customerId;
                        },
                        validatorFunctions: [
                            Operations.Validators.notAllowedOnCustomerAccountDepositWithNewCustomer
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ChangeDeliveryMode,
                handler: new Operations.ChangeModeOfDeliveryOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.existingCart,
                            Operations.Validators.isCustomerOrderWithShippingCartLine
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CustomerSearch,
                handler: new Operations.CustomerSearchOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedOnRecalledOrder] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CustomerAdd,
                handler: new Operations.CustomerAddOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CustomerEdit,
                handler: new Operations.CustomerEditOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CustomerClear,
                handler: new Operations.CustomerClearOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedOnRecalledOrder] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCartWithCustomerAccountTenderLineOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.EditCustomerOrder,
                handler: new Operations.UpdateCustomerOrderOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CreateCustomerOrder,
                handler: new Operations.CreateCustomerOrderOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.checkCustomerOrderInOffline] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CreateRetailTransaction,
                handler: new Operations.CreateRetailTransactionOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CreateQuotation,
                handler: new Operations.CreateCustomerQuoteOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return options.quotationExpirationDate;
                        },
                        validatorFunctions: [Operations.Validators.notAllowedIfExpirationDateInPast]
                    },
                    {
                        dataAccessor: function (options) {
                            return options.cart;
                        },
                        validatorFunctions: [
                            Operations.CartValidators.notAllowedOnCustomerOrderOnCreateQuotation,
                            Operations.CartValidators.notAllowedOnCartIfAllLinesNotValidForCustomerOrderOperations
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.RecalculateCustomerOrder,
                handler: new Operations.RecalculateCustomerOrderOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return options.cart;
                        },
                        validatorFunctions: [Operations.Validators.containsNonReturnCartLinesOnCustomerOrder]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.RecalculateCharges,
                handler: new Operations.RecalculateChargesOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInNonDrawerModeOperationValidator,
                            Operations.Validators.existingCart,
                            Operations.Validators.notAllowedOnCancellationRecallOrReturn
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CarryoutSelectedProducts,
                handler: new Operations.CarryoutSelectedOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return options.cartLines;
                        },
                        validatorFunctions: [Operations.Validators.includeOnlyNonReturnLinesOnCustomerOrder]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PickupAllProducts,
                handler: new Operations.PickupAllOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PickupSelectedProducts,
                handler: new Operations.PickupSelectedOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return options.cartLines;
                        },
                        validatorFunctions: [Operations.Validators.includeOnlyNonReturnLinesOnCustomerOrder]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ShipAllProducts,
                handler: new Operations.ShipAllOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ShipSelectedProducts,
                handler: new Operations.ShipSelectedOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return options.cartLines;
                        },
                        validatorFunctions: [
                            Operations.Validators.includeOnlyNonReturnLinesOnCustomerOrder,
                            Operations.Validators.includeOnlyNonVoidedLines
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.SetQuotationExpirationDate,
                handler: new Operations.SetQuotationExpirationDateOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] },
                    {
                        dataAccessor: function (options) {
                            return options.cart;
                        },
                        validatorFunctions: [
                            Operations.CartValidators.notAllowedOnCustomerOrderOnCreateQuotation,
                            Operations.CartValidators.notAllowedOnCartIfAllLinesNotValidForCustomerOrderOperations
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ReturnChargesOverride,
                handler: new Operations.ReturnChargesOverrideOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    { validatorFunctions: [Operations.Validators.notAllowedOnCustomerAccountDeposit] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ManageCharges,
                handler: new Operations.ManageChargesOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ManageChecklistsAndTasks,
                handler: new Operations.TaskManagementOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PaymentsHistory,
                handler: new Operations.GetPaymentsHistoryOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] },
                    {
                        dataAccessor: function (options) {
                            return options.cart;
                        },
                        validatorFunctions: [Operations.Validators.paymentsHistoryOperationValidator]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.LogOff,
                handler: new Operations.LogoffOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.userSessionValidAndNoExistingCartLogOffValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.LogOffForce,
                handler: new Operations.LogOffForceOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.userSessionValidAndNoExistingCartLogOffValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.LockTerminal,
                handler: new Operations.LockTerminalOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.DeactivateDevice,
                handler: new Operations.DeactivateDeviceOperationHandler(context),
                validators: [
                    {
                        validatorFunctions: [
                            Operations.Validators.notAllowedInOffline,
                            Operations.Validators.noExistingCart
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ChangeHardwareStation,
                handler: new Operations.SelectHardwareStationOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PairHardwareStation,
                handler: new Operations.PairHardwareStationOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.OpenDrawer,
                handler: new Operations.OpenCashDrawerOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.DatabaseConnectionStatus,
                handler: new Operations.DatabaseConnectionStatusOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ChangePassword,
                handler: new Operations.ChangePasswordOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ResetPassword,
                handler: new Operations.ResetPasswordOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.TimeRegistration,
                handler: new Operations.TimeClockOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ViewTimeClockEntries,
                handler: new Operations.ViewTimeClockEntriesOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ShowJournal,
                handler: new Operations.ShowJournalOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ViewOrderFulfillmentLines,
                handler: new Operations.ViewOrderFulfillmentLinesOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.TenderDeclaration,
                handler: new Operations.TenderDeclarationOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    {
                        dataAccessor: function (options) {
                            return !Commerce.ObjectExtensions.isNullOrUndefined(options) ? options.shift : undefined;
                        },
                        validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeUnlessShiftIsProvidedOperationValidator]
                    },
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.BlindCloseShift,
                handler: new Operations.BlindCloseShiftOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ShowBlindClosedShifts,
                handler: new Operations.ManageShiftsOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.noExistingCart] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.SuspendShift,
                handler: new Operations.SuspendShiftOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.CloseShift,
                handler: new Operations.CloseShiftOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    {
                        dataAccessor: function (options) {
                            return !Commerce.ObjectExtensions.isNullOrUndefined(options) ? options.shift : undefined;
                        },
                        validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeUnlessShiftIsProvidedOperationValidator]
                    },
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PrintX,
                handler: new Operations.PrintXOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    {
                        dataAccessor: function (options) {
                            return !Commerce.ObjectExtensions.isNullOrUndefined(options) ? options.shift : undefined;
                        },
                        validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeUnlessShiftIsProvidedOperationValidator]
                    },
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.PrintZ,
                handler: new Operations.PrintZOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInOffline] },
                    { validatorFunctions: [Operations.Validators.noExistingCart] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.DeclareStartAmount,
                handler: new Operations.DeclareStartAmountOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    {
                        dataAccessor: function (options) {
                            return !Commerce.ObjectExtensions.isNullOrUndefined(options) ? options.shift : undefined;
                        },
                        validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeUnlessShiftIsProvidedOperationValidator]
                    },
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.FloatEntry,
                handler: new Operations.FloatEntryOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.TenderRemoval,
                handler: new Operations.TenderRemovalOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.SafeDrop,
                handler: new Operations.SafeDropOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ManageSafe,
                handler: new Operations.ManageSafesOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.KitDisassembly,
                handler: new Operations.KitDisassemblyOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeOperationValidator] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.BankDrop,
                handler: new Operations.BankDropOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] },
                    {
                        dataAccessor: function (options) {
                            return !Commerce.ObjectExtensions.isNullOrUndefined(options) ? options.shift : undefined;
                        },
                        validatorFunctions: [Operations.Validators.notAllowedInNonDrawerModeUnlessShiftIsProvidedOperationValidator]
                    },
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.BlankOperation,
                handler: new Operations.BlankOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ExtendedLogOn,
                handler: new Operations.ExtendedLogOnOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ViewProductDetails,
                handler: new Operations.ViewProductDetailsOperationHandler(context),
                validators: [
                    {
                        dataAccessor: function (options) {
                            return Commerce.ObjectExtensions.isNullOrUndefined(options) ? [] : [options.cartLine];
                        },
                        validatorFunctions: [
                            Operations.Validators.singleCartLineOperationValidator
                        ]
                    }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ViewReport,
                handler: new Operations.ViewReportsOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.notAllowedForPhone] }
                ]
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.ForceUnlockPeripheral,
                handler: new Operations.ForceUnlockPeripheralOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.OpenURL,
                handler: new Operations.OpenUrlOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.VoidSuspendedTransactions,
                handler: new Operations.VoidSuspendedTransactionsOperationHandler(context)
            }, correlationId);
            operationsManager.registerOperationHandler({
                id: Operations.RetailOperation.HealthCheck,
                handler: new Operations.HealthCheckOperationHandler(context),
                validators: [
                    { validatorFunctions: [Operations.Validators.noExistingCart] }
                ]
            }, correlationId);
        }
        Operations.registerOperationHandlers = registerOperationHandlers;
    })(Operations = Commerce.Operations || (Commerce.Operations = {}));
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
var Pos;
(function (Pos) {
    "use strict";
    var StoreOperations = Commerce.StoreOperations;
    var TypeScriptCore = Microsoft.Dynamics.Diagnostics.TypeScriptCore;
    var PosInitializerBase = (function (_super) {
        __extends(PosInitializerBase, _super);
        function PosInitializerBase(config) {
            var _this = _super.call(this) || this;
            _this._environmentSpecificRuntimeInitializers = config.environmentSpecificRuntimeInitializers || [];
            return _this;
        }
        PosInitializerBase.prototype.initialize = function (userAgent) {
            _super.prototype.initialize.call(this, userAgent);
            this._setHighchartsGlobalOptions();
        };
        PosInitializerBase.prototype.configureEnvironmentPrerequisites = function (userAgent) {
            _super.prototype.configureEnvironmentPrerequisites.call(this, userAgent);
            Commerce.PerformanceLogger.enableDisablePerformanceMarkers(Commerce.PerformanceLogger.performanceMarkersEnabled);
            Commerce.Config.connectionTimeout = Commerce.NumberExtensions.parseNumber(Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.CONNECTION_TIMEOUT_IN_SECONDS), null, Commerce.Config.connectionTimeout);
            Commerce.Proxy.Common.XmlHttpRequestHelper.SetupAjaxParameters();
            Commerce.Proxy.Common.XmlHttpRequestHelper.SetupODataParameters();
        };
        PosInitializerBase.prototype.initializeApplicationFrameworkAsync = function (correlationId) {
            var _this = this;
            Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkStarted(correlationId);
            var compositionLoader = new Commerce.CompositionLoader();
            var frameworkInitializer = new Pos.PosFrameworkRuntimeInitializer();
            frameworkInitializer.populateCompositionLoader(compositionLoader);
            Commerce.Runtime = new Commerce.CommerceRuntime(new Commerce.RuntimeConfiguration(compositionLoader));
            var configurationProvider;
            var managerFactory;
            var compositionQueue = new Commerce.AsyncQueue();
            compositionQueue.enqueue(function () {
                return _this._composeAppPlatformAsync(correlationId, compositionLoader);
            }).enqueue(function () {
                return _this._initializeConfigurationProviderAsync(correlationId, Commerce.Runtime)
                    .map(function (provider) {
                    configurationProvider = provider;
                });
            }).enqueue(function () {
                return _this.initializeDiagnosticsFrameworkAsync(correlationId, Commerce.Runtime, configurationProvider).recoverOnFailure(function () {
                    return Commerce.AsyncResult.createResolved();
                });
            }).enqueue(function () {
                var stepName = "InitializeRetailServerFramework";
                Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkStepStarted(correlationId, stepName);
                return _this._initializeRetailServerFrameworkAsync(correlationId, configurationProvider)
                    .map(function (factory) {
                    managerFactory = factory;
                    Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkStepFinished(correlationId, stepName);
                });
            }).enqueue(function () {
                var stepName = "InitializeHost";
                Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkStepStarted(correlationId, stepName);
                return Commerce.Host.instance.initializeAsync().done(function () {
                    Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkStepFinished(correlationId, stepName);
                });
            }).enqueue(function () {
                var stepName = "InitializePeripherals";
                Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkStepStarted(correlationId, stepName);
                return Commerce.Peripherals.instance.initializeAsync().done(function () {
                    Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkStepFinished(correlationId, stepName);
                }).recoverOnFailure(function (errors) {
                    return Commerce.NotificationHandler.displayClientErrors(errors).map(function () { return void 0; });
                });
            }).enqueue(function () {
                var stepName = "InitializeExtensibilityFramework";
                Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkStepStarted(correlationId, stepName);
                return _this._initializeExtensibilityFramework(correlationId, Commerce.Runtime, compositionLoader).done(function () {
                    Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkStepFinished(correlationId, stepName);
                });
            });
            return compositionQueue.run().done(function () {
                var posContext = new PosContext(managerFactory, Commerce.Runtime, Commerce.Peripherals.instance, Commerce.StringResourceManager);
                Commerce.Operations.registerOperationHandlers(correlationId, posContext);
                var commonRuntimeInitializer = new Pos.PosCommonRuntimeInitializer(new RequestHandlerContext(posContext, Commerce.ApplicationContext.Instance, Commerce.ApplicationSession.instance));
                commonRuntimeInitializer.populateCompositionLoader(compositionLoader);
                Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkFinished(correlationId);
            }).recoverOnFailure(function (errors) {
                Commerce.RetailLogger.posStartUpInitializeApplicationFrameworkFailed(correlationId, Commerce.ErrorHelper.serializeError(errors));
                return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error("string_29076")]);
            });
        };
        PosInitializerBase.prototype.loadApplicationAsync = function (correlationId, userAgent) {
            var _this = this;
            Commerce.RetailLogger.posStartUpLoadApplicationStarted(correlationId);
            var loadApplicationQueue = new Commerce.AsyncQueue();
            loadApplicationQueue.enqueue(function () {
                var stepName = "ValidateApplicationState";
                Commerce.RetailLogger.posStartUpLoadApplicationStepStarted(correlationId, stepName);
                return loadApplicationQueue.cancelOn(_this._validateApplicationStateAsync(correlationId, userAgent))
                    .done(function (result) {
                    if (!result.canceled) {
                        Commerce.RetailLogger.posStartUpLoadApplicationStepFinished(correlationId, stepName);
                    }
                });
            }).enqueue(function () {
                var stepName = "LoadConfigurationData";
                Commerce.RetailLogger.posStartUpLoadApplicationStepStarted(correlationId, stepName);
                _this._registerCommerceExceptionErrorTypes();
                _this._registerControls(Commerce.Controls.getControlConfigurations());
                _this._registerViews(Commerce.Views.getViewConfigurations());
                return _this._loadConfigurationDataAsync(correlationId).done(function () {
                    Commerce.RetailLogger.posStartUpLoadApplicationStepFinished(correlationId, stepName);
                });
            });
            loadApplicationQueue.enqueue(function () {
                if (!Commerce.ApplicationContext.Instance.isDeviceActivated) {
                    return Commerce.VoidAsyncResult.createResolved();
                }
                var stepName = "LoadFeatureRequestHandlers";
                Commerce.RetailLogger.posStartUpLoadApplicationStepStarted(correlationId, stepName);
                return _this._populateCompositionLoaderWithFeaturesAsync(correlationId).done(function () {
                    Commerce.RetailLogger.posStartUpLoadApplicationStepFinished(correlationId, stepName);
                });
            });
            loadApplicationQueue.enqueue(function () {
                if (!Commerce.ApplicationContext.Instance.isDeviceActivated) {
                    return Commerce.VoidAsyncResult.createResolved();
                }
                var stepName = "LoadExtensionPackages";
                Commerce.RetailLogger.posStartUpLoadApplicationStepStarted(correlationId, stepName);
                return _this._loadExtensionPackagesAsync(correlationId).done(function () {
                    Commerce.RetailLogger.posStartUpLoadApplicationStepFinished(correlationId, stepName);
                });
            }).enqueue(function () {
                if (!Commerce.ApplicationContext.Instance.isDeviceActivated) {
                    return Commerce.VoidAsyncResult.createResolved();
                }
                var stepName = "ExecuteAppStartTriggers";
                Commerce.RetailLogger.posStartUpLoadApplicationStepStarted(correlationId, stepName);
                var applicationStartTriggerOptions = {};
                return Commerce.Triggers.TriggerManager.instance.execute(Commerce.Triggers.NonCancelableTriggerType.ApplicationStart, applicationStartTriggerOptions).done(function () {
                    Commerce.RetailLogger.posStartUpLoadApplicationStepFinished(correlationId, stepName);
                }).recoverOnFailure(function () {
                    return Commerce.VoidAsyncResult.createResolved();
                });
            });
            return loadApplicationQueue.run().done(function (queueResult) {
                if (!queueResult.canceled) {
                    Commerce.RetailLogger.posStartUpLoadApplicationFinished(correlationId);
                }
            }).fail(function (errors) {
                Commerce.RetailLogger.posStartUpLoadApplicationFailed(correlationId, Commerce.ErrorHelper.serializeError(errors));
            });
        };
        PosInitializerBase.prototype.onInitializationComplete = function (correlationId) {
            this._initializeTaskRecorder();
            var serializedCustomUIStrings = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.CUSTOM_UI_STRINGS_KEY);
            if (!Commerce.StringExtensions.isNullOrWhitespace(serializedCustomUIStrings)) {
                Commerce.StringResourceManager.setCustomStringValues(JSON.parse(serializedCustomUIStrings));
            }
            this._addConnectionStatusChangeTriggerExecutor();
            this._navigateToStartPage();
            Commerce.UI.Tutorial.instance.init();
            if (Commerce.Host.instance.globalization.getCloudInstance() !== Commerce.Host.CloudInstance.Mooncake) {
                this._addCustomerSatisfactionCheckAsPostLogOnHandler();
            }
            Commerce.RetailLogger.appLaunch(correlationId, TsLogging.LoggerBase.getAppSessionId(), Commerce.Host.instance.application.getAppSpecificHardwareId(), Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.DEVICE_ID_KEY), Commerce.Proxy.Entities.ApplicationTypeEnum[Commerce.Host.instance.application.getApplicationType()], this.getOsVersion());
        };
        PosInitializerBase.prototype.onCheckpoint = function (args) {
            var _this = this;
            var onCheckpointQueue = new Commerce.AsyncQueue();
            onCheckpointQueue.enqueue(function () {
                return _super.prototype.onCheckpoint.call(_this, args);
            }).enqueue(function () {
                var options = {};
                return Commerce.Triggers.TriggerManager.instance.execute(Commerce.Triggers.NonCancelableTriggerType.ApplicationSuspend, options).recoverOnFailure(function () {
                    return Commerce.VoidAsyncResult.createResolved();
                });
            });
            return onCheckpointQueue.run();
        };
        PosInitializerBase.prototype.initializeDiagnosticsFrameworkAsync = function (correlationId, runtime, configurationProvider) {
            Commerce.attachEmergencySink(new TypeScriptCore.EmergencyConsoleSink());
            var serializedConfig = configurationProvider.getValue("Diagnostics");
            var diagnosticsConfig = { Sinks: {} };
            if (!Commerce.StringExtensions.isNullOrWhitespace(serializedConfig)) {
                try {
                    diagnosticsConfig = JSON.parse(serializedConfig);
                    diagnosticsConfig = diagnosticsConfig || { Sinks: {} };
                    diagnosticsConfig.Sinks = diagnosticsConfig.Sinks || {};
                }
                catch (ex) {
                    Commerce.RetailLogger.posStartUpFailedToParseDiagnosticsConfiguration(correlationId, Commerce.ErrorHelper.serializeError(ex));
                }
            }
            var getSinksRequest = new Commerce.Diagnostics.GetLoggingSinksClientRequest(correlationId, diagnosticsConfig.Sinks);
            return Commerce.AsyncResult.fromPromise(runtime.executeAsync(getSinksRequest))
                .map(function (loggingSinksResult) {
                if (loggingSinksResult.canceled || !Commerce.ArrayExtensions.hasElements(loggingSinksResult.data.result)) {
                    console.error("Initialization Error: The request to get the logging sinks did not return any sinks.");
                }
                else {
                    loggingSinksResult.data.result.forEach(function (sink) {
                        Commerce.attachLoggingSink(sink);
                    });
                    TsLogging.LoggerBase.setUserSession(TsLogging.Utils.emptyGuid(), "");
                    var appSessionId = TsLogging.Utils.generateGuid();
                    TsLogging.LoggerBase.setAppSessionId(appSessionId);
                    var deviceRecordId = Commerce.NumberExtensions.parseNumber(Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.DEVICE_RECID), Commerce.ApplicationContext.Instance.deviceConfiguration.CultureName, 0);
                    var registerRecordId = Commerce.NumberExtensions.parseNumber(Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.REGISTER_RECID), Commerce.ApplicationContext.Instance.deviceConfiguration.CultureName, 0);
                    TsLogging.LoggerBase.setDeviceInfo(Commerce.Host.instance.application.getAppSpecificHardwareId(), deviceRecordId, registerRecordId);
                    Commerce.RetailLogger.posStartUpGetLoggingSinksFinished(correlationId, loggingSinksResult.data.result.length);
                }
            }).fail(function (errors) {
                var errorDetails = Commerce.ErrorHelper.serializeError(errors);
                console.error("Initialization Error: The request to get the logging sinks failed with error: " + errorDetails);
            });
        };
        PosInitializerBase.prototype._populateCompositionLoaderWithFeaturesAsync = function (correlationId) {
            var request = new Commerce.LoadFeatureRequestHandlersClientRequest(correlationId);
            return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request));
        };
        PosInitializerBase.prototype._composeAppPlatformAsync = function (correlationId, compositionLoader) {
            var _this = this;
            var platformCompositionQueue = new Commerce.AsyncQueue();
            platformCompositionQueue.enqueue(function () {
                var SYSTEM_JS_FORMAT = "register";
                var posPackages = {
                    "./Platform": {
                        format: SYSTEM_JS_FORMAT,
                        defaultExtension: "js"
                    }
                };
                SystemJS.config({
                    packages: posPackages
                });
                return Commerce.VoidAsyncResult.fromPromise(SystemJS.import("./Platform/Pos.Platform"));
            }).enqueue(function () {
                var importInitializerPromise = SystemJS.import("PlatformInitializer")
                    .then(function (initializerModule) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(initializerModule)
                        && !Commerce.ObjectExtensions.isNullOrUndefined(initializerModule.default)
                        && Commerce.ObjectExtensions.isFunction(initializerModule.default.populateCompositionLoader)) {
                        initializerModule.default.populateCompositionLoader(compositionLoader);
                    }
                    else {
                        Commerce.RetailLogger.posStartUpInvalidPlatformInitializerModule(correlationId);
                    }
                });
                return Commerce.VoidAsyncResult.fromPromise(importInitializerPromise);
            });
            return platformCompositionQueue.run().done(function () {
                if (Commerce.ArrayExtensions.hasElements(_this._environmentSpecificRuntimeInitializers)) {
                    _this._environmentSpecificRuntimeInitializers.forEach(function (initializer) {
                        initializer.populateCompositionLoader(compositionLoader);
                    });
                }
            });
        };
        PosInitializerBase.prototype._initializeExtensibilityFramework = function (correlationId, runtime, compositionLoader) {
            var _this = this;
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                return _this.isIndependentPackagingEnabledAsync(correlationId, runtime);
            }).enqueue(function (isIndependentPackagingEnabled) {
                return _super.prototype.loadExtensibilityFrameworkAsync.call(_this, correlationId, isIndependentPackagingEnabled);
            }).enqueue(function (extensionsLoaderFactory) {
                var extensionsLoader = extensionsLoaderFactory.createPOSExtensionsLoader(_this.createExtensionsLoaderOptions());
                compositionLoader.addRequestHandler(Commerce.Extensibility.LoadExtensionsRequestHandler, function () {
                    return { extensionsLoader: extensionsLoader };
                });
                compositionLoader.addRequestHandler(Commerce.Extensibility.GetExtensionPackagesLoadInfoClientRequestHandler, function () {
                    return { extensionsLoader: extensionsLoader };
                });
                return Commerce.VoidAsyncResult.createResolved();
            });
            return asyncQueue.run().map(function () { return void 0; });
        };
        PosInitializerBase.prototype._loadExtensibleEnums = function (correlationId) {
            return Commerce.ExtensibleEnumerations.ExtensibleEnumerationManager.instance.loadExtensibleEnumerations(correlationId);
        };
        PosInitializerBase.prototype._initializeTaskRecorder = function () {
            var _this = this;
            var context = {
                applicationType: Commerce.Proxy.Entities.ApplicationTypeEnum[Commerce.Host.instance.application.getApplicationType()],
                applicationVersion: Commerce.ViewModelAdapter.getApplicationVersion(),
                appSession: Commerce.ApplicationSession.instance,
                baseViewURI: "UserActivityRecorder/",
                browserType: Commerce.Host.instance.application.getBrowserType(),
                isScreenCaptureAvailable: this.isScreenCaptureAvailable(),
                recordingMarkerAttributeName: Commerce.BubbleHelper.DATA_AX_BUBBLE_ATTRIBUTE,
                getCurrentViewNameHandler: function () {
                    return Commerce.ViewModelAdapter.getCurrentViewName();
                },
                stringResourceManager: Commerce.StringResourceManager,
                managerFactory: Commerce.Model.Managers.Factory,
                peripherals: Commerce.Peripherals.instance,
                runtime: Commerce.Runtime,
                renderPageImplementation: function (pageUri, element) {
                    return _this.convertWinJSPromiseToAsyncResult(WinJS.UI.Pages.render(pageUri, element));
                }
            };
            var taskRecorderContext = __assign(__assign({}, context), { addNumPadOnEnterCallback: function (callback) {
                    Commerce.Controls.NumPad.NumPadState.addOnEnterListener(callback);
                } });
            Commerce.TaskRecorder.taskRecorder = Commerce.UserActivityRecorder.UserActivityRecorderFactory.createTaskRecorder(taskRecorderContext);
            var testRecorderContext = __assign(__assign({}, context), { createDisplayFloat: function (options) {
                    return new Commerce.Controls.TestRecorderDisplayFloat(options);
                } });
            Commerce.TestRecorder.testRecorder = Commerce.UserActivityRecorder.UserActivityRecorderFactory.createTestRecorder(testRecorderContext);
        };
        PosInitializerBase.prototype._registerCommerceExceptionErrorTypes = function () {
            Commerce.Proxy.Context.ErrorParser.registerCommerceExceptionErrorType(Commerce.Proxy.Entities.ItemDiscontinuedExceptionClass, Commerce.Cart.ItemDiscontinuedError);
            Commerce.Proxy.Context.ErrorParser.registerCommerceExceptionErrorType(Commerce.Proxy.Entities.StaffPasswordExpiredExceptionClass, Commerce.Authentication.StaffPasswordExpiredError);
            Commerce.Proxy.Context.ErrorParser.registerCommerceExceptionErrorType(Commerce.Proxy.Entities.TenderValidationExceptionClass, Commerce.TenderCounting.TenderValidationError);
            Commerce.Proxy.Context.ErrorParser.registerCommerceExceptionErrorType(Commerce.Proxy.Entities.InventoryDocumentLockedByOtherTerminalExceptionClass, Commerce.Inventory.InventoryDocumentLockedByOtherTerminalError);
            Commerce.Proxy.Context.ErrorParser.registerCommerceExceptionErrorType(Commerce.Proxy.Entities.InventoryDocumentExceedMaximumQuantityExceptionClass, Commerce.Inventory.InventoryDocumentExceedMaximumQuantityError);
            Commerce.Proxy.Context.ErrorParser.registerCommerceExceptionErrorType(Commerce.Proxy.Entities.PaymentExceptionClass, Commerce.Payments.CommercePaymentError);
        };
        PosInitializerBase.prototype._initializeConfigurationProviderAsync = function (correlationId, runtime) {
            var _this = this;
            var configurationProvider = new Commerce.Configuration.PosConfigurationProvider(runtime);
            Commerce.Configuration.ConfigurationProvider = configurationProvider;
            return configurationProvider.initializeAsync(correlationId).map(function () {
                _this._setCommerceConfiguration(configurationProvider);
                return configurationProvider;
            });
        };
        PosInitializerBase.prototype._initializeRetailServerFrameworkAsync = function (correlationId, configurationProvider) {
            var _this = this;
            Commerce.Config.retailServerUrl = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.RETAIL_SERVER_URL);
            Commerce.Config.onlineDatabase = configurationProvider.getValue("OnlineConnectionString");
            Commerce.Config.offlineDatabase = configurationProvider.getValue("OfflineConnectionString");
            return Commerce.Model.Managers.RetailServerManagerFactory.create(correlationId, Commerce.Config.retailServerUrl, Commerce.Config.onlineDatabase, Commerce.Config.offlineDatabase).done(function (factory) {
                Commerce.Model.Managers.Factory = factory;
                Commerce.Authentication.AuthenticationProviderManager.instance.registerResourceOwnerPasswordGrantProvider(new Commerce.Authentication.Providers.DeviceAuthenticationProvider(), Commerce.Authentication.AuthenticationProviderResourceType.DEVICE);
                Commerce.Authentication.AuthenticationProviderManager.instance.registerResourceOwnerPasswordGrantProvider(new Commerce.Authentication.Providers.CommerceUserAuthenticationProvider(_this.commerceAuthenticationAudience, factory), Commerce.Authentication.AuthenticationProviderResourceType.USER);
            });
        };
        PosInitializerBase.prototype._setCommerceConfiguration = function (configurationProvider) {
            Commerce.Config.aadEnabled = !Commerce.StringExtensions.isNullOrWhitespace(configurationProvider.getValue("AADLoginUrl"));
            Commerce.Config.persistentRetailServerUrl = configurationProvider.getValue("RetailServerUrl");
            Commerce.Config.persistentRetailServerEnabled = !Commerce.StringExtensions.isNullOrWhitespace(Commerce.Config.persistentRetailServerUrl);
            var sqlCommandTimeout = Number(configurationProvider.getValue("SqlCommandTimeout"));
            if (sqlCommandTimeout >= 0) {
                Commerce.Config.sqlCommandTimeout = sqlCommandTimeout;
            }
            var defaultOfflineDownloadInterval = Number(configurationProvider.getValue("DefaultOfflineDownloadInterval"));
            if (defaultOfflineDownloadInterval > 0) {
                Commerce.Config.defaultOfflineDownloadIntervalInMilliseconds = defaultOfflineDownloadInterval * 60000;
            }
            var defaultOfflineUploadInterval = Number(configurationProvider.getValue("DefaultOfflineUploadInterval"));
            if (defaultOfflineUploadInterval > 0) {
                Commerce.Config.defaultOfflineUploadIntervalInMilliseconds = defaultOfflineUploadInterval * 60000;
            }
            var connectionTimeOut = Number(configurationProvider.getValue("ConnectionTimeout"));
            if (connectionTimeOut > 0) {
                Commerce.Config.connectionTimeout = connectionTimeOut;
            }
        };
        PosInitializerBase.prototype._registerAADAuthenticationProviders = function (environmentConfig) {
            var authenticationManager = Commerce.Authentication.AuthenticationProviderManager.instance;
            var aadAuthority = Commerce.StringExtensions.EMPTY;
            var aadTenantId = Commerce.StringExtensions.EMPTY;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(environmentConfig)) {
                aadAuthority = environmentConfig.AADAuthority;
                aadTenantId = environmentConfig.TenantId;
            }
            var retailServerResourceId = Commerce.Configuration.ConfigurationProvider.getValue("AADRetailServerResourceId");
            var aadClientId = Commerce.Configuration.ConfigurationProvider.getValue("AADClientId");
            this.azureActiveDirectoryAdapter = this.createAzureActiveDirectoryAdapter(aadAuthority, aadTenantId, aadClientId, retailServerResourceId);
            this.azureActiveDirectoryAdapter.initialize();
            var addProvider = new Commerce.Authentication.Providers.AzureActiveDirectoryUserAuthenticationProvider(this.azureActiveDirectoryAdapter, retailServerResourceId);
            authenticationManager.registerImplicitGrantProvider(addProvider, Commerce.Authentication.AuthenticationProviderResourceType.USER);
            authenticationManager.registerImplicitGrantProvider(addProvider, Commerce.Authentication.AuthenticationProviderResourceType.LOCATOR_SERVICE);
        };
        PosInitializerBase.prototype._setHighchartsGlobalOptions = function () {
            Highcharts.setOptions({
                global: {
                    VMLRadialGradientURL: null,
                    canvasToolsURL: null
                }
            });
        };
        PosInitializerBase.prototype._addConnectionStatusChangeTriggerExecutor = function () {
            var contentHost = $("#contenthost").get(0);
            Commerce.EventProxy.Instance.addCustomEventHandler(contentHost, "ConnectionStatusUpdateEvent", function (args) {
                var triggerOptions = {
                    connectionStatus: args.newStatus,
                    previousConnectionStatus: args.oldStatus
                };
                Commerce.Triggers.TriggerManager.instance.execute(Commerce.Triggers.NonCancelableTriggerType.PostConnectionStatusChange, triggerOptions);
            });
        };
        PosInitializerBase.prototype._addCustomerSatisfactionCheckAsPostLogOnHandler = function () {
            var element = $("#contenthost").get(0);
            Commerce.EventProxy.Instance.addCustomEventHandler(element, "LogOnAndInitializationCompleteEvent", Commerce.NotificationHelper.setDisplayCustomerSatisfactionSurveyStateAsync);
        };
        PosInitializerBase.prototype._loadConfigurationDataAsync = function (correlationId) {
            var _this = this;
            var asyncQueue = new Commerce.AsyncQueue();
            var environmentConfig;
            if (Commerce.ApplicationContext.Instance.isDeviceActivated) {
                asyncQueue.enqueue(function () {
                    return _this._loadExtensibleEnums(correlationId);
                }).enqueue(function () {
                    var request = new StoreOperations.GetEnvironmentConfigurationServiceRequest(correlationId);
                    return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request))
                        .map(function (result) {
                        if (!result.canceled) {
                            environmentConfig = result.data.configuration;
                        }
                    }).recoverOnFailure(function (errors) {
                        Commerce.RetailLogger.applicationLoadEnvironmentConfigurationServerLoadFailed(Commerce.ErrorHelper.formatErrorMessage(errors[0]));
                        var configJson = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.ENVIRONMENT_CONFIGURATION_KEY);
                        if (!Commerce.StringExtensions.isNullOrWhitespace(configJson)) {
                            environmentConfig = JSON.parse(configJson);
                        }
                        return Commerce.AsyncResult.createResolved();
                    });
                }).enqueue(function () {
                    var request = new StoreOperations.GetVisualProfileServiceRequest(correlationId);
                    return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request));
                }).enqueue(function () {
                    var preloadFeatureNames = Commerce.EnumExtensions.getStringValues(Commerce.Client.Entities.FeatureNameEnum);
                    var request = new StoreOperations.GetFeatureStatesServiceRequest(correlationId, preloadFeatureNames);
                    return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request));
                });
            }
            return asyncQueue.run().recoverOnFailure(function (errors) {
                return Commerce.NotificationHandler.displayClientErrors(errors).map(function () { return void 0; });
            }).always(function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(environmentConfig)) {
                    Commerce.InstrumentationHelper.setEnvironmentInfo(environmentConfig);
                }
                _this._registerAADAuthenticationProviders(environmentConfig);
            });
        };
        PosInitializerBase.prototype._loadExtensionPackagesAsync = function (correlationId) {
            var request = new Commerce.Extensibility.LoadExtensionPackagesClientRequest(correlationId);
            return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request))
                .recoverOnFailure(function (errors) {
                return Commerce.NotificationHandler.displayClientErrors(errors).map(function () {
                    return { canceled: false };
                });
            });
        };
        PosInitializerBase.prototype._navigateToStartPage = function () {
            var splashScreen = document.getElementById("splashScreen");
            if (!Commerce.ObjectExtensions.isNullOrUndefined(splashScreen)) {
                $(splashScreen).remove();
            }
            Commerce.Controls.ContentHost.ContentHostWinJSControl.contentHostInstance.render();
            this.navigateToInitialPage();
        };
        PosInitializerBase.prototype._getApplicationUpdateStatus = function (correlationId) {
            var request = new Commerce.Framework.GetApplicationUpdateStatusClientRequest(correlationId);
            return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request))
                .map(function (result) {
                return { canceled: result.canceled, data: result.canceled ? null : result.data.result };
            });
        };
        PosInitializerBase.prototype._validateApplicationStateAsync = function (correlationId, userAgent) {
            var _a;
            var _this = this;
            if (!this._checkWindowIsSafe(correlationId, userAgent)) {
                return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error("string_29044")]);
            }
            else if (!Commerce.Framework.LocalStorage.isSupported()) {
                Commerce.RetailLogger.applicationLocalStorageNotAvailable(Commerce.ErrorTypeEnum.LOCAL_STORAGE_IS_NOT_AVAILABLE, correlationId);
                return Commerce.ViewModelAdapter.displayMessage(Commerce.ErrorTypeEnum.LOCAL_STORAGE_IS_NOT_AVAILABLE, Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default, null, 0).map(function () {
                    return { canceled: true };
                });
            }
            else if (Commerce.Helpers.DeviceActivationHelper.areStoredDeviceTerminalDifferentFromArguments()) {
                if (Commerce.Helpers.DeviceActivationHelper.isDeviceActivationCompleted()) {
                    var errorMessageFormatData = [
                        Commerce.Helpers.DeviceActivationHelper.argumentDeviceNumber,
                        Commerce.Helpers.DeviceActivationHelper.argumentRegisterNumber,
                        Commerce.Helpers.DeviceActivationHelper.storedDeviceNumber,
                        Commerce.Helpers.DeviceActivationHelper.storedRegisterNumber
                    ];
                    Commerce.RetailLogger.accessWrongDeviceTerminal(correlationId);
                    return (_a = Commerce.ViewModelAdapter).displayMessage.apply(_a, __spreadArrays([Commerce.ErrorTypeEnum.ACCESS_WRONG_DEVICE_TERMINAL,
                        Commerce.MessageType.Info,
                        Commerce.MessageBoxButtons.Default,
                        null,
                        0], errorMessageFormatData)).map(function () {
                        return { canceled: false };
                    });
                }
                else {
                    var messageTolog = Commerce.StringExtensions.format("checkActivationArguments. StoredDevNum:{0}; ArgDevNum:{1}; StoredRegNumber:{2}; ArgRegNum:{3}", Commerce.Helpers.DeviceActivationHelper.storedDeviceNumber, Commerce.Helpers.DeviceActivationHelper.argumentDeviceNumber, Commerce.Helpers.DeviceActivationHelper.storedRegisterNumber, Commerce.Helpers.DeviceActivationHelper.argumentRegisterNumber);
                    Commerce.RetailLogger.coreStorageClearInitiated(correlationId, messageTolog);
                    Commerce.ApplicationStorage.clear();
                    return Commerce.AsyncResult.createResolved({ canceled: false });
                }
            }
            var updateCheckQueue = new Commerce.AsyncQueue();
            updateCheckQueue.enqueue(function () {
                return updateCheckQueue.cancelOn(_this._getApplicationUpdateStatus(correlationId));
            }).enqueue(function (updateCheckResult) {
                if (updateCheckResult.data.isUpdateRequired) {
                    Commerce.RetailLogger.applicationUpdateIsRequired(correlationId);
                    return Commerce.ViewModelAdapter.displayMessage(Commerce.ErrorTypeEnum.APPLICATION_UPDATE_REQUIRED, Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default, null, 0);
                }
                else {
                    return Commerce.AsyncResult.createResolved();
                }
            });
            return updateCheckQueue.run().recoverOnFailure(function (errors) {
                Commerce.RetailLogger.posStartUpApplicationUpdateStatusCheckFailed(correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                return Commerce.AsyncResult.createResolved();
            }).map(function () {
                return { canceled: false };
            });
        };
        PosInitializerBase.prototype._checkWindowIsSafe = function (correlationId, userAgent) {
            var isWindowAllowed = window.self === window.top
                || (window.self.parent === window.top && window.self.location.origin === window.self.parent.location.origin);
            if (!isWindowAllowed) {
                alert(Commerce.ViewModelAdapter.getResourceString("string_29044"));
                var errorDetails = Commerce.StringExtensions.format("Potential clickjacking attempt detected. Source origin: {0}.", top.location.origin);
                Commerce.RetailLogger.cloudPosBrowserNotSupported(userAgent, errorDetails, correlationId);
            }
            return isWindowAllowed;
        };
        return PosInitializerBase;
    }(Pos.InitializerBase));
    Pos.PosInitializerBase = PosInitializerBase;
    var PosContext = (function () {
        function PosContext(managerFactory, runtime, peripherals, stringResourceManager) {
            this._managerFactory = managerFactory;
            this._peripherals = peripherals;
            this._runtime = runtime;
            this._stringResourceManager = stringResourceManager;
        }
        Object.defineProperty(PosContext.prototype, "managerFactory", {
            get: function () {
                return this._managerFactory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PosContext.prototype, "peripherals", {
            get: function () {
                return this._peripherals;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PosContext.prototype, "runtime", {
            get: function () {
                return this._runtime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PosContext.prototype, "stringResourceManager", {
            get: function () {
                return this._stringResourceManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PosContext.prototype, "triggerManager", {
            get: function () {
                return Commerce.Triggers.TriggerManager.instance;
            },
            enumerable: true,
            configurable: true
        });
        return PosContext;
    }());
    var RequestHandlerContext = (function () {
        function RequestHandlerContext(posContext, applicationContext, applicationSession) {
            this._posContext = posContext;
            this._applicationContext = applicationContext;
            this._applicationSession = applicationSession;
        }
        Object.defineProperty(RequestHandlerContext.prototype, "managerFactory", {
            get: function () {
                return this._posContext.managerFactory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RequestHandlerContext.prototype, "peripherals", {
            get: function () {
                return this._posContext.peripherals;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RequestHandlerContext.prototype, "runtime", {
            get: function () {
                return this._posContext.runtime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RequestHandlerContext.prototype, "stringResourceManager", {
            get: function () {
                return this._posContext.stringResourceManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RequestHandlerContext.prototype, "triggerManager", {
            get: function () {
                return this._posContext.triggerManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RequestHandlerContext.prototype, "applicationContext", {
            get: function () {
                return this._applicationContext;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RequestHandlerContext.prototype, "applicationSession", {
            get: function () {
                return this._applicationSession;
            },
            enumerable: true,
            configurable: true
        });
        return RequestHandlerContext;
    }());
})(Pos || (Pos = {}));
var Pos;
(function (Pos) {
    "use strict";
    var CloudPosInitializer = (function (_super) {
        __extends(CloudPosInitializer, _super);
        function CloudPosInitializer(initializerConfig) {
            var _this = _super.call(this, initializerConfig) || this;
            _this.commerceAuthenticationAudience = "Cloud POS";
            return _this;
        }
        CloudPosInitializer.prototype.configureEnvironmentPrerequisites = function (userAgent) {
            var persistentStorage = Commerce.Framework.LocalStorage.isSupported()
                ? Commerce.Framework.LocalStorage.instance : new Commerce.Framework.DictionaryStorage();
            var transientStorage = new Commerce.Framework.DictionaryStorage();
            Commerce.ApplicationStorage.initialize(new Commerce.Framework.PosStorage(persistentStorage, transientStorage));
            _super.prototype.configureEnvironmentPrerequisites.call(this, userAgent);
        };
        CloudPosInitializer.prototype.createAzureActiveDirectoryAdapter = function (aadAuthority, aadTenantId, aadClientId, aadRetailServerResourceId) {
            return new Commerce.Host.WebAADAuthenticationAdapter(aadAuthority, aadTenantId, aadClientId, aadRetailServerResourceId);
        };
        CloudPosInitializer.prototype.onInitializationComplete = function (correlationId) {
            _super.prototype.onInitializationComplete.call(this, correlationId);
            if (Commerce.ApplicationHelper.isHostedApplicationType(Commerce.Host.instance.application.getApplicationType())) {
                this._updateTelemetryConfigurationOnHostAsync(correlationId);
            }
        };
        CloudPosInitializer.prototype.isApplicationUpdateRequired = function () {
            return false;
        };
        CloudPosInitializer.prototype.isScreenCaptureAvailable = function () {
            return false;
        };
        CloudPosInitializer.prototype.getOsVersion = function () {
            return null;
        };
        CloudPosInitializer.prototype.navigateToInitialPage = function () {
            if (Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.INITIAL_SYNC_COMPLETED_KEY) === "true") {
                if (Commerce.Config.aadEnabled
                    && !Commerce.Utilities.LogonHelper.isAadEmployeeLoginMode()
                    && (Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.AAD_OPERATOR_LOGIN_INITIATED) !== "true")) {
                    this.azureActiveDirectoryAdapter.clearCache();
                }
                Commerce.ApplicationContextLoader.applyDeviceConfigurationDetailsAsync()
                    .fail(function (errors) {
                    Commerce.NotificationHandler.displayClientErrors(errors);
                }).always(function () {
                    Commerce.ViewModelAdapter.navigate(Commerce.ViewModelAdapter.getLoginViewName());
                });
            }
            else if (Commerce.Config.aadEnabled
                && this.azureActiveDirectoryAdapter instanceof Commerce.Host.WebAADAuthenticationAdapter
                && this.azureActiveDirectoryAdapter.hasCachedUser()
                && window.self === window.top) {
                var activationParameters = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.ACTIVATION_PAGE_PARAMETERS_KEY);
                Commerce.Helpers.DeviceActivationHelper.navigateToActivationProcessPage(activationParameters);
            }
            else {
                Commerce.Helpers.DeviceActivationHelper.navigateToGetStartedPage();
            }
        };
        CloudPosInitializer.prototype.isIndependentPackagingEnabledAsync = function (correlationId, runtime) {
            var request = new Commerce.Extensibility.GetExtensionPackagesConfigurationClientRequest(correlationId);
            return Commerce.AsyncResult.fromPromise(runtime.executeAsync(request))
                .map(function (result) {
                return !result.canceled && result.data.result.isIndependentPackagingEnabled;
            });
        };
        CloudPosInitializer.prototype.displayLastResortErrorMessage = function (errorMessage) {
            alert(errorMessage);
        };
        CloudPosInitializer.prototype.initializeDiagnosticsFrameworkAsync = function (correlationId, runtime, configurationProvider) {
            var _this = this;
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                return _super.prototype.initializeDiagnosticsFrameworkAsync.call(_this, correlationId, runtime, configurationProvider);
            }).enqueue(function () {
                var environmentId = configurationProvider.getValue("EnvironmentId");
                TsLogging.LoggerBase.setTenantInfo(environmentId);
                return Commerce.InstrumentationHelper.setSessionInfoOnHostAsync(correlationId);
            });
            return asyncQueue.run();
        };
        CloudPosInitializer.prototype._updateTelemetryConfigurationOnHostAsync = function (correlationId) {
            var appInsightsInstrumentationKey = Commerce.Configuration.ConfigurationProvider.getValue("AppInsightsInstrumentationKey");
            var environmentId = Commerce.Configuration.ConfigurationProvider.getValue("EnvironmentId");
            var request = new Commerce.Host.Messages.UpdateTelemetryOnHostRequest(correlationId, environmentId, appInsightsInstrumentationKey);
            return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request))
                .done(function (response) {
                Commerce.RetailLogger.applicationTelemetryContextUpdateCompleted(JSON.stringify(response));
            }).recoverOnFailure(function (errors) {
                Commerce.RetailLogger.applicationTelemetryContextUpdateCompleted("Call to update telemetry config failed. error: " + Commerce.ErrorHelper.serializeError(errors));
                return Commerce.VoidAsyncResult.createResolved();
            });
        };
        return CloudPosInitializer;
    }(Pos.PosInitializerBase));
    Pos.CloudPosInitializer = CloudPosInitializer;
})(Pos || (Pos = {}));
var Commerce;
(function (Commerce) {
    var Config;
    (function (Config) {
        var DEFAULT_CONNECTION_TIMEOUT_IN_SECONDS = 120;
        Config.retailServerUrl = Commerce.StringExtensions.EMPTY;
        Config.onlineDatabase = Commerce.StringExtensions.EMPTY;
        Config.offlineDatabase = Commerce.StringExtensions.EMPTY;
        Config.connectionTimeout = DEFAULT_CONNECTION_TIMEOUT_IN_SECONDS;
        Config.defaultOfflineDownloadIntervalInMilliseconds = 60000;
        Config.defaultOfflineUploadIntervalInMilliseconds = 60000;
        Config.defaultPageSize = 250;
        Config.sqlCommandTimeout = 3600;
        Config.appBaseVersion = Microsoft.Dynamics.Diagnostics.TypeScriptCore.AppInsightsSink.appBaseVersion;
        function defaultRetailServerConnectionTimeout() {
            return DEFAULT_CONNECTION_TIMEOUT_IN_SECONDS;
        }
        Config.defaultRetailServerConnectionTimeout = defaultRetailServerConnectionTimeout;
        Config.disposalDelay = function () {
            var timeout = (Math.max(Commerce.Config.connectionTimeout, Commerce.Config.defaultRetailServerConnectionTimeout()) + 20) * 1000;
            return timeout;
        };
        Config.resetRetailServerConnectionTimeout = function () {
            Commerce.ApplicationStorage.setItem(Commerce.ApplicationStorageIDs.CONNECTION_TIMEOUT_IN_SECONDS, "0");
        };
        function initialize() {
            var minSmallSide = 768;
            var $window = $(window);
            var $body = $("body");
            var maxValue = Math.max($window.height(), $window.width());
            if (!Commerce.ObjectExtensions.isBoolean(Commerce.Config.isPhone)) {
                Commerce.Config.isPhone = maxValue < minSmallSide;
            }
            if (Commerce.Config.isPhone) {
                $body.addClass("phone");
            }
            Commerce.Host.Globalization.CultureHelper.overrideDefaultCultureInfo();
        }
        Config.initialize = initialize;
    })(Config = Commerce.Config || (Commerce.Config = {}));
})(Commerce || (Commerce = {}));
var Pos;
(function (Pos) {
    "use strict";
    var HostedAppRuntimeInitializer = (function () {
        function HostedAppRuntimeInitializer() {
        }
        HostedAppRuntimeInitializer.prototype.populateCompositionLoader = function (compositionLoader) {
        };
        return HostedAppRuntimeInitializer;
    }());
    Pos.HostedAppRuntimeInitializer = HostedAppRuntimeInitializer;
})(Pos || (Pos = {}));
var Pos;
(function (Pos) {
    "use strict";
    var AndroidHostedAppRuntimeInitializer = (function () {
        function AndroidHostedAppRuntimeInitializer(requestHandlerContext) {
            this._context = requestHandlerContext;
        }
        AndroidHostedAppRuntimeInitializer.prototype.populateCompositionLoader = function (compositionLoader) {
            var _this = this;
            compositionLoader.addRequestHandler(Commerce.Host.DedicatedHardwareStationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Host.UpdateTelemetryOnHostDataRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Host.SetSessionInfoOnHostDataRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Payments.Handlers.ClearMerchantInformationClientRequestHandler, function () { return _this._context; });
        };
        return AndroidHostedAppRuntimeInitializer;
    }());
    Pos.AndroidHostedAppRuntimeInitializer = AndroidHostedAppRuntimeInitializer;
})(Pos || (Pos = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var OutgoingMessageTypes = (function () {
            function OutgoingMessageTypes() {
            }
            OutgoingMessageTypes.RUN_TASK = "IncomingTaskRequest";
            OutgoingMessageTypes.TASK_RESPONSE = "RemoteTaskResponse";
            return OutgoingMessageTypes;
        }());
        Host.OutgoingMessageTypes = OutgoingMessageTypes;
        var HostedAppRemoteTaskMessageHandler = (function () {
            function HostedAppRemoteTaskMessageHandler() {
                var _this = this;
                var messageHandlerToRemoteTaskManagerPort = new Commerce.Messaging.PosMessagePort();
                var remoteTaskManagerToMessageHandlerPort = new Commerce.Messaging.PosMessagePort();
                this._messageHandlerToRemoteTaskManagerEndpoint =
                    new Commerce.Messaging.MessageChannelEndpoint(messageHandlerToRemoteTaskManagerPort, remoteTaskManagerToMessageHandlerPort);
                this._remoteTaskMessageHandlerToMessageHandlerEndpoint =
                    new Commerce.Messaging.MessageChannelEndpoint(remoteTaskManagerToMessageHandlerPort, messageHandlerToRemoteTaskManagerPort);
                this._messageHandlerToRemoteTaskManagerEndpoint.addMessageHandler("RemoteTaskRequest", function (data) {
                    _this.send(data.correlationId, data.taskInstanceId, OutgoingMessageTypes.RUN_TASK, data.message);
                });
                this._messageHandlerToRemoteTaskManagerEndpoint.addMessageHandler("IncomingTaskResponse", function (data) {
                    _this.send(data.correlationId, data.taskInstanceId, OutgoingMessageTypes.TASK_RESPONSE, data.message);
                });
                this._messageHandlerToRemoteTaskManagerEndpoint.start();
            }
            Object.defineProperty(HostedAppRemoteTaskMessageHandler.prototype, "remoteTaskMessageHandlerToMessageHandlerEndpoint", {
                get: function () {
                    return this._remoteTaskMessageHandlerToMessageHandlerEndpoint;
                },
                enumerable: true,
                configurable: true
            });
            HostedAppRemoteTaskMessageHandler.prototype.receive = function (taskRequestData) {
                var _this = this;
                var responseMessage = {
                    isSuccessful: true,
                    data: null
                };
                var correlationId;
                try {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(taskRequestData) || Commerce.StringExtensions.isNullOrWhitespace(taskRequestData.correlationId)) {
                        correlationId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                    }
                    else {
                        correlationId = taskRequestData.correlationId;
                    }
                }
                catch (e) {
                }
                Commerce.RetailLogger.hostedAppRemoteTaskManagerHandlerReceiveStart(correlationId);
                var parameterErrorMessage = null;
                if (Commerce.ObjectExtensions.isNullOrUndefined(taskRequestData)) {
                    parameterErrorMessage = "The parameter taskRequestData was null or empty";
                    Commerce.RetailLogger.hostedAppRemoteTaskManagerHandlerReceiveFailedExpectedParameterValueNotSet(Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, Commerce.StringExtensions.EMPTY, parameterErrorMessage);
                    var error = { message: parameterErrorMessage };
                    responseMessage.isSuccessful = false;
                    responseMessage.data = JSON.stringify(error);
                    return responseMessage;
                }
                if (Commerce.StringExtensions.isNullOrWhitespace(taskRequestData.taskInstanceId)) {
                    parameterErrorMessage = "The parameter value taskRequestData.taskInstanceId was null or empty";
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(taskRequestData.messageType)) {
                    parameterErrorMessage = "The parameter value taskRequestData.messageType was null or empty";
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(taskRequestData.message)) {
                    parameterErrorMessage = "The parameter value taskRequestData.message was null or empty";
                }
                if (!Commerce.StringExtensions.isNullOrWhitespace(parameterErrorMessage)) {
                    Commerce.RetailLogger.hostedAppRemoteTaskManagerHandlerReceiveFailedExpectedParameterValueNotSet(correlationId, taskRequestData.taskInstanceId, taskRequestData.messageType, taskRequestData.message, parameterErrorMessage);
                    var error = { message: parameterErrorMessage };
                    responseMessage.isSuccessful = false;
                    responseMessage.data = JSON.stringify(error);
                }
                else if (taskRequestData.messageType === "RemoteTaskResponse" || taskRequestData.messageType === "IncomingTaskRequest") {
                    Commerce.RetailLogger.hostedAppRemoteTaskManagerHandlerReceiveRunRequest(correlationId, taskRequestData.taskInstanceId, taskRequestData.messageType, taskRequestData.message);
                    var remoteMessagingData_1 = {
                        correlationId: correlationId, taskInstanceId: taskRequestData.taskInstanceId, message: taskRequestData.message
                    };
                    Commerce.Host.instance.timers.setImmediate(function () {
                        try {
                            var messageType = taskRequestData.messageType === "RemoteTaskResponse" ?
                                "RemoteTaskResponse" : "IncomingTaskRequest";
                            _this._messageHandlerToRemoteTaskManagerEndpoint.sendMessage(messageType, remoteMessagingData_1);
                        }
                        catch (e) {
                            Commerce.RetailLogger.hostedAppRemoteTaskManagerHandlerReceiveFailedUnhandledErrorWhenRunningRemoteMessageRequest(correlationId, taskRequestData.taskInstanceId, taskRequestData.messageType, taskRequestData.message, Commerce.ErrorHelper.serializeError(e));
                        }
                    });
                }
                else {
                    Commerce.RetailLogger.hostedAppRemoteTaskManagerHandlerReceiveFailedMessageTypeIsNotSupported(correlationId, taskRequestData.taskInstanceId, taskRequestData.messageType);
                    var error = {
                        message: Commerce.StringExtensions.format("The message type '{0}' is not supported", taskRequestData.messageType)
                    };
                    responseMessage.isSuccessful = false;
                    responseMessage.data = JSON.stringify(error);
                }
                Commerce.RetailLogger.hostedAppRemoteTaskManagerHandlerReceiveEnd(correlationId, taskRequestData.taskInstanceId, taskRequestData.messageType);
                return responseMessage;
            };
            return HostedAppRemoteTaskMessageHandler;
        }());
        Host.HostedAppRemoteTaskMessageHandler = HostedAppRemoteTaskMessageHandler;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        var Android;
        (function (Android) {
            "use strict";
            var AndroidRemoteTaskMessageHandler = (function (_super) {
                __extends(AndroidRemoteTaskMessageHandler, _super);
                function AndroidRemoteTaskMessageHandler() {
                    return _super.call(this) || this;
                }
                Object.defineProperty(AndroidRemoteTaskMessageHandler, "instance", {
                    get: function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(AndroidRemoteTaskMessageHandler._instance)) {
                            AndroidRemoteTaskMessageHandler._instance = new AndroidRemoteTaskMessageHandler();
                        }
                        return AndroidRemoteTaskMessageHandler._instance;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AndroidRemoteTaskMessageHandler.prototype, "areEndpointsInitialized", {
                    get: function () {
                        var areEndpointsInitialized = false;
                        try {
                            areEndpointsInitialized = !Commerce.ObjectExtensions.isNullOrUndefined(androidMessageHandler.taskMessageFromPOSToAndroid);
                        }
                        catch (e) {
                            areEndpointsInitialized = false;
                        }
                        return areEndpointsInitialized;
                    },
                    enumerable: true,
                    configurable: true
                });
                AndroidRemoteTaskMessageHandler.prototype.send = function (correlationId, taskInstanceId, messageType, message) {
                    androidMessageHandler.taskMessageFromPOSToAndroid(correlationId, taskInstanceId, messageType, message);
                };
                return AndroidRemoteTaskMessageHandler;
            }(Commerce.Host.HostedAppRemoteTaskMessageHandler));
            Android.AndroidRemoteTaskMessageHandler = AndroidRemoteTaskMessageHandler;
        })(Android = Host.Android || (Host.Android = {}));
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var NavigateBackIncomingTask = (function () {
            function NavigateBackIncomingTask() {
            }
            Object.defineProperty(NavigateBackIncomingTask.prototype, "name", {
                get: function () {
                    return "NavigateBack";
                },
                enumerable: true,
                configurable: true
            });
            NavigateBackIncomingTask.prototype.action = function (input) {
                var promise = new Promise(function (resolve, reject) {
                    try {
                        if (!Commerce.Controls.Dialog.DialogHandler.isADialogVisible() &&
                            !Commerce.Controls.Loader.LoaderBindingHandler.hasLoader(document.documentElement, Commerce.Controls.Loader.LoaderType.Page, true) &&
                            Commerce.HeaderSplitViewModel.isBackButtonAllowed) {
                            Commerce.navigator.navigateBack();
                        }
                        resolve();
                    }
                    catch (e) {
                        reject(e.message);
                    }
                });
                return promise;
            };
            return NavigateBackIncomingTask;
        }());
        Host.NavigateBackIncomingTask = NavigateBackIncomingTask;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var IncomingTasksRegister = (function () {
            function IncomingTasksRegister() {
            }
            IncomingTasksRegister.registerCommonTasks = function (registor) {
            };
            IncomingTasksRegister.registerAndroidTasks = function (registor) {
                registor.registerIncomingTask(new Host.NavigateBackIncomingTask());
            };
            IncomingTasksRegister.registerIOSTasks = function (registor) {
            };
            return IncomingTasksRegister;
        }());
        Host.IncomingTasksRegister = IncomingTasksRegister;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        var Android;
        (function (Android) {
            "use strict";
            var AndroidRemoteTaskManager = (function (_super) {
                __extends(AndroidRemoteTaskManager, _super);
                function AndroidRemoteTaskManager() {
                    return _super.call(this, Commerce.Host.Android.AndroidRemoteTaskMessageHandler.instance.remoteTaskMessageHandlerToMessageHandlerEndpoint) || this;
                }
                Object.defineProperty(AndroidRemoteTaskManager.prototype, "remoteTaskManagerID", {
                    get: function () {
                        return "Android";
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AndroidRemoteTaskManager, "instance", {
                    get: function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(AndroidRemoteTaskManager._instance)) {
                            AndroidRemoteTaskManager._instance = new AndroidRemoteTaskManager();
                            Host.IncomingTasksRegister.registerCommonTasks(AndroidRemoteTaskManager._instance);
                            Host.IncomingTasksRegister.registerAndroidTasks(AndroidRemoteTaskManager._instance);
                        }
                        return AndroidRemoteTaskManager._instance;
                    },
                    enumerable: true,
                    configurable: true
                });
                return AndroidRemoteTaskManager;
            }(Commerce.RemoteTaskManager.RemoteTaskManager));
            Android.AndroidRemoteTaskManager = AndroidRemoteTaskManager;
        })(Android = Host.Android || (Host.Android = {}));
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Pos;
(function (Pos) {
    "use strict";
    var environmentSpecificRuntimeInitializers = [];
    if (Commerce.Host.Android.AndroidRemoteTaskMessageHandler.instance.areEndpointsInitialized) {
        Pos.remoteTaskManager = Commerce.Host.Android.AndroidRemoteTaskManager.instance;
        environmentSpecificRuntimeInitializers.push(new Pos.HostedAppRuntimeInitializer());
        environmentSpecificRuntimeInitializers.push(new Pos.AndroidHostedAppRuntimeInitializer({
            applicationContext: Commerce.ApplicationContext.Instance,
            applicationSession: Commerce.ApplicationSession.instance,
            managerFactory: Commerce.Model.Managers.Factory,
            peripherals: Commerce.Peripherals.instance,
            runtime: Commerce.Runtime,
            stringResourceManager: Commerce.StringResourceManager,
            triggerManager: Commerce.Triggers.TriggerManager.instance,
            operationsManager: Commerce.Operations.OperationsManager.instance
        }));
    }
    else {
        Pos.remoteTaskManager = null;
    }
    var initializerConfig = {
        environmentSpecificRuntimeInitializers: environmentSpecificRuntimeInitializers
    };
    var initializer = new Pos.CloudPosInitializer(initializerConfig);
    initializer.initialize(navigator.userAgent);
})(Pos || (Pos = {}));
var Commerce;
(function (Commerce) {
    var Config;
    (function (Config) {
        var Web;
        (function (Web) {
            Web.availableCultures = [
                "ar", "cs", "da", "de", "de-AT", "de-CH", "en-AU", "en-CA", "en-GB", "en-IE", "en-IN",
                "en-MY", "en-NZ", "en-SG", "en-US", "en-ZA", "es", "es-MX", "et", "fi", "fr", "fr-BE",
                "fr-CA", "fr-CH", "hu", "is", "it", "it-CH", "ja", "lt", "lv", "nb-NO", "nl", "nl-BE",
                "pl", "pt-BR", "qps-ploc", "ru", "sv", "th", "tr", "zh-Hans"
            ];
            Web.defaultCultureName = "en-US";
            Web.defaultCurrencyCode = "USD";
            Web.resourcesUriPath = "Assets/Strings/{0}/";
            Web.primaryResourceFile = "resources.resjson";
            Web.secondaryResources = ["languages.resjson", "territories.resjson"];
        })(Web = Config.Web || (Config.Web = {}));
    })(Config = Commerce.Config || (Commerce.Config = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var WebAADAuthenticationAdapter = (function (_super) {
            __extends(WebAADAuthenticationAdapter, _super);
            function WebAADAuthenticationAdapter() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            WebAADAuthenticationAdapter.prototype.initialize = function () {
                this._internalErrorState = null;
                var redirectUrl = [location.protocol, "//", location.host, location.pathname].join("");
                if (!Commerce.StringExtensions.isNullOrWhitespace(this.aadClientId)) {
                    if (this.isAADContextInitialized() && !Commerce.ObjectExtensions.isNullOrUndefined(this._aadContext.prototype)) {
                        this._aadContext.prototype._singletonInstance = null;
                    }
                    var aadLoginUrl = !Commerce.StringExtensions.isNullOrWhitespace(this.aadAuthority) ?
                        this.aadAuthority : Commerce.Configuration.ConfigurationProvider.getValue("AADLoginUrl");
                    if (!Commerce.StringExtensions.endsWith(aadLoginUrl, "/", false)) {
                        aadLoginUrl += "/";
                    }
                    var aadContextOptions = {
                        clientId: this.aadClientId,
                        redirectUri: redirectUrl,
                        postLogoutRedirectUri: redirectUrl,
                        instance: aadLoginUrl,
                        cacheLocation: WebAADAuthenticationAdapter.AAD_LOCALCACHE,
                        extraQueryParameter: WebAADAuthenticationAdapter.AAD_EXTRA_QUERY_PARAMETERS
                    };
                    this._aadContext = new AuthenticationContext(aadContextOptions);
                    this.handleAADNavigationRedirection();
                }
            };
            WebAADAuthenticationAdapter.prototype.setTenantId = function (tenantId) {
                if (Commerce.StringExtensions.isNullOrWhitespace(this.aadClientId)
                    || Commerce.StringExtensions.isNullOrWhitespace(tenantId)
                    || (this.isAADContextInitialized()
                        && Commerce.StringExtensions.compare(this._aadContext.config.tenant, tenantId, true) === 0)) {
                    return;
                }
                _super.prototype.setTenantId.call(this, tenantId);
                if (this.isAADContextInitialized()) {
                    this._aadContext.config.tenant = this.aadTenantId;
                }
            };
            WebAADAuthenticationAdapter.prototype.login = function () {
                var _this = this;
                var result = new Commerce.AsyncResult();
                if (!this.isAADContextInitialized()) {
                    var error = new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.MICROSOFT_DYNAMICS_POS_AADCONFIGURATION_ERROR.serverErrorCode);
                    Commerce.RetailLogger.librariesAuthenticationProviderAuthenticationFailed(Commerce.ErrorHelper.formatErrorMessage(error));
                    result.reject([error]);
                    return result;
                }
                if (!Commerce.StringExtensions.isNullOrWhitespace(this._internalErrorState)) {
                    var error = new Commerce.Proxy.Entities.Error(this._internalErrorState);
                    Commerce.RetailLogger.librariesAuthenticationProviderAuthenticationFailed(Commerce.ErrorHelper.formatErrorMessage(error));
                    result.reject([error]);
                    return result;
                }
                var requestId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                this._aadContext.getUser(function (error, user) {
                    if (!user) {
                        Commerce.RetailLogger.librariesAuthenticationProviderLoginStarted(requestId, "Navigating to AAD Login page to request user credentials.");
                        try {
                            Commerce.RetailLogger.librariesAuthenticationProviderLoginFinished(requestId, "Navigating away to AAD login page now.");
                            _this._aadContext.login("prompt=login");
                        }
                        catch (error) {
                            var errorMessage = (error || "").toString();
                            Commerce.RetailLogger.librariesAuthenticationProviderAuthenticationFailed(errorMessage);
                            result.reject([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.AAD_AUTHENTICATION_FAILED)]);
                        }
                    }
                    else {
                        Commerce.RetailLogger.librariesAuthenticationProviderLoginStarted(requestId, "User identification token already present in context.");
                        user.profile = user.profile || {};
                        var userDetails = {
                            userName: user.userName,
                            tenantId: user.profile.tid,
                            objectId: user.profile.oid,
                            fullName: user.profile.name
                        };
                        Commerce.RetailLogger.librariesAuthenticationProviderLoginFinished(requestId, Commerce.StringExtensions.EMPTY);
                        result.resolve(userDetails);
                    }
                });
                return result;
            };
            WebAADAuthenticationAdapter.prototype.acquireToken = function (resourceId) {
                var _this = this;
                var result = new Commerce.AsyncResult();
                if (!this.isAADContextInitialized() || Commerce.StringExtensions.isNullOrWhitespace(resourceId)) {
                    var error = new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.MICROSOFT_DYNAMICS_POS_AADCONFIGURATION_ERROR.serverErrorCode);
                    Commerce.RetailLogger.librariesAuthenticationProviderAuthenticationFailed(Commerce.ErrorHelper.formatErrorMessage(error));
                    result.reject([error]);
                    return result;
                }
                this.login().done(function (user) {
                    var requestId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                    Commerce.RetailLogger.librariesAuthenticationProviderAcquireTokenStarted(requestId, resourceId);
                    _this._aadContext.acquireToken(resourceId, function (error, token) {
                        if (!Commerce.StringExtensions.isNullOrWhitespace(error)) {
                            var errorMessage = "AAD service failed with message: " + error;
                            Commerce.RetailLogger.librariesAuthenticationProviderAuthenticationFailed(errorMessage);
                            if (WebAADAuthenticationAdapter.USER_ACCOUNT_IDENTIFIER_NOT_PROVIDED_REGEX.test(error)) {
                                result.reject([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.AAD_USER_ACCOUNT_IDENTIFIER_NOT_PROVIDED)]);
                            }
                            else if (WebAADAuthenticationAdapter.SESSION_IS_INVALID_REGEX.test(error)) {
                                _this.clearCache();
                                _this.logout().always(function () {
                                    result.reject([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.AAD_AUTHENTICATION_FAILED)]);
                                });
                            }
                            else {
                                result.reject([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.AAD_AUTHENTICATION_FAILED)]);
                            }
                        }
                        else {
                            Commerce.RetailLogger.librariesAuthenticationProviderAcquireTokenFinished(requestId);
                            result.resolve(token);
                        }
                    });
                }).fail(function (errors) {
                    result.reject(errors);
                });
                return result;
            };
            WebAADAuthenticationAdapter.prototype.hasCachedUser = function () {
                var user;
                var aadContext = this._aadContext;
                if (Commerce.ObjectExtensions.isFunction(aadContext.getCachedUser)) {
                    user = aadContext.getCachedUser();
                }
                return !Commerce.ObjectExtensions.isNullOrUndefined(user);
            };
            WebAADAuthenticationAdapter.prototype.logout = function () {
                if (!this.isAADContextInitialized()) {
                    var error = new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.MICROSOFT_DYNAMICS_POS_AADCONFIGURATION_ERROR.serverErrorCode);
                    Commerce.RetailLogger.librariesAuthenticationProviderAuthenticationFailed(Commerce.ErrorHelper.formatErrorMessage(error));
                    return Commerce.VoidAsyncResult.createRejected([error]);
                }
                this._aadContext.logOut();
                return Commerce.VoidAsyncResult.createResolved();
            };
            WebAADAuthenticationAdapter.prototype.retrieveAvailableToken = function (resourceId) {
                return this.isAADContextInitialized()
                    ? (this._aadContext.getCachedToken(resourceId) || null)
                    : null;
            };
            WebAADAuthenticationAdapter.prototype.clearCache = function () {
                if (this.isAADContextInitialized()) {
                    this._aadContext.clearCache();
                }
            };
            WebAADAuthenticationAdapter.prototype.setAuthority = function (authority) {
                _super.prototype.setAuthority.call(this, authority);
                if (this.isAADContextInitialized()) {
                    this._aadContext.instance = this.aadAuthority;
                    this._aadContext.config.instance = this.aadAuthority;
                }
            };
            WebAADAuthenticationAdapter.prototype.isAADContextInitialized = function () {
                if (Commerce.ObjectExtensions.isNullOrUndefined(this._aadContext)) {
                    return false;
                }
                return true;
            };
            WebAADAuthenticationAdapter.prototype.handleAADNavigationRedirection = function () {
                var hash = window.location.hash;
                var aadContext = this._aadContext;
                var isTokenPresent = aadContext.isCallback(hash);
                var isValidState = !Commerce.ObjectExtensions.isNullOrUndefined(aadContext._getItem(aadContext.CONSTANTS.STORAGE.LOGIN_REQUEST));
                if (isTokenPresent && !isValidState) {
                    this._internalErrorState = Commerce.ErrorTypeEnum.AAD_USER_ACCOUNT_IDENTIFIER_NOT_PROVIDED;
                }
                else {
                    this._aadContext.handleWindowCallback();
                }
            };
            WebAADAuthenticationAdapter.AAD_EXTRA_QUERY_PARAMETERS = "nux=1";
            WebAADAuthenticationAdapter.AAD_LOCALCACHE = "sessionStorage";
            WebAADAuthenticationAdapter.USER_ACCOUNT_IDENTIFIER_NOT_PROVIDED_REGEX = /AADSTS50058/i;
            WebAADAuthenticationAdapter.SESSION_IS_INVALID_REGEX = /AADSTS16000/i;
            return WebAADAuthenticationAdapter;
        }(Commerce.Authentication.AADAuthenticationAdapterBase));
        Host.WebAADAuthenticationAdapter = WebAADAuthenticationAdapter;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        var UI;
        (function (UI) {
            "use strict";
            var SwipeDirection;
            (function (SwipeDirection) {
                SwipeDirection[SwipeDirection["RigthLeft"] = 1] = "RigthLeft";
                SwipeDirection[SwipeDirection["UpDown"] = 2] = "UpDown";
            })(SwipeDirection || (SwipeDirection = {}));
            var Position = (function () {
                function Position(x, y) {
                    this.x = x;
                    this.y = y;
                }
                Position.prototype.difference = function (pos) {
                    return new Position(pos.x - this.x, pos.y - this.y);
                };
                return Position;
            }());
            var SwipeBinding = (function () {
                function SwipeBinding(grid) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(grid)) {
                        throw new Error("Parameter grid can't be null or undefined.");
                    }
                    if (Commerce.ObjectExtensions.isNullOrUndefined(grid.winControl)) {
                        throw new Error("Unable to initialize swipe for non-wincontrol element");
                    }
                    this._$grid = $(grid);
                    this._winControl = grid.winControl;
                }
                SwipeBinding.prototype.bind = function () {
                    this._$grid.bind("touchstart", this.startTouch.bind(this));
                    this._$grid.bind("touchmove", this.moveTouch.bind(this));
                    this._$grid.bind("touchend", this.endTouch.bind(this));
                    this._swipeDirection = this._winControl.layoutType === WinJS.UI.ListLayout ? SwipeDirection.RigthLeft : SwipeDirection.UpDown;
                };
                SwipeBinding.getEventPosition = function (event) {
                    var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    return new Position(touch.pageX, touch.pageY);
                };
                SwipeBinding.prototype.startTouch = function (event) {
                    var parentContainer = $(event.target).parents(SwipeBinding.itemContainerSelector);
                    if (parentContainer.length > 0) {
                        this._swipeDirection = this._winControl.layout._inListMode ? SwipeDirection.RigthLeft
                            : SwipeDirection.UpDown;
                        this._basePosition = SwipeBinding.getEventPosition(event);
                        this._$itemContainer = $(parentContainer[0]);
                        this._isSelectedOriginalState = this._$itemContainer.is(SwipeBinding.selectedClass);
                        var itemElement = this._$itemContainer.find(SwipeBinding.itemElementSelector)[0];
                        this._itemIndex = this._winControl._itemsManager._recordFromElement(itemElement).item.index;
                    }
                };
                SwipeBinding.prototype.endTouch = function (event) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._basePosition)) {
                        return;
                    }
                    var currentPosition = SwipeBinding.getEventPosition(event);
                    var moveDistance = this._basePosition.difference(currentPosition);
                    if (this._swipeDirection === SwipeDirection.RigthLeft && Math.abs(moveDistance.x) > 0) {
                        this._$itemContainer.animate({ left: 0 }, SwipeBinding.animationSpeed);
                    }
                    else if (this._swipeDirection === SwipeDirection.UpDown && Math.abs(moveDistance.y) > 0) {
                        this._$itemContainer.animate({ top: 0 }, SwipeBinding.animationSpeed);
                    }
                    this._basePosition = null;
                    this._$itemContainer = null;
                };
                SwipeBinding.prototype.moveTouch = function (event) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._basePosition)) {
                        return;
                    }
                    var currentPosition = SwipeBinding.getEventPosition(event);
                    var positionChange = this._basePosition.difference(currentPosition);
                    var distance = 0;
                    var type = "left";
                    if (Math.abs(positionChange.x) > 0 && (this._swipeDirection === SwipeDirection.RigthLeft)) {
                        distance = positionChange.x;
                    }
                    else if (Math.abs(positionChange.y) > 0 && (this._swipeDirection === SwipeDirection.UpDown)) {
                        distance = positionChange.y;
                        type = "top";
                    }
                    if (Math.abs(distance) > 0) {
                        if (Math.abs(distance) > SwipeBinding.swipeDistance) {
                            distance = distance > 0 ? SwipeBinding.swipeDistance : -SwipeBinding.swipeDistance;
                        }
                        this._$itemContainer.addClass(SwipeBinding.swipeClass);
                        this._$itemContainer.css(type, distance + "px");
                        this._$itemContainer.css("transform", "");
                    }
                    var isElementSelected = this._$itemContainer.is(SwipeBinding.selectedClass);
                    if ((Math.abs(distance) <= SwipeBinding.selectionDistance && isElementSelected !== this._isSelectedOriginalState) ||
                        (Math.abs(distance) > SwipeBinding.selectionDistance && isElementSelected === this._isSelectedOriginalState)) {
                        if (isElementSelected) {
                            this._winControl.selection.remove(this._itemIndex);
                        }
                        else {
                            this._winControl.selection.add(this._itemIndex);
                        }
                    }
                };
                SwipeBinding.swipeDistance = 30;
                SwipeBinding.selectionDistance = 15;
                SwipeBinding.itemContainerSelector = ".win-container";
                SwipeBinding.selectedClass = ".win-selected";
                SwipeBinding.itemElementSelector = ".win-template";
                SwipeBinding.swipeClass = "win-swipe";
                SwipeBinding.animationSpeed = "slow";
                return SwipeBinding;
            }());
            UI.SwipeBinding = SwipeBinding;
        })(UI = Host.UI || (Host.UI = {}));
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var WebApplication = (function (_super) {
            __extends(WebApplication, _super);
            function WebApplication() {
                return _super.call(this, Commerce.Proxy.Entities.ApplicationTypeEnum.None) || this;
            }
            WebApplication.prototype.initializeAsync = function () {
                var _this = this;
                if (this.getBrowserType() === Commerce.Client.Entities.BrowserType.Chrome) {
                    Host.UI.HorizontalScoll.init();
                }
                return Commerce.DataHelper.loadJsonAsync(WebApplication.CONFIGURATION_FILE_PATH).done(function (data) {
                    if (typeof data === "object") {
                        _this.setApplicationIdentity(data);
                    }
                    else {
                        Commerce.RetailLogger.applicationFailedToLoadConfiguration("WebApplication: invalid configuration file. Returned configuration file is not valid JSON.");
                    }
                });
            };
            WebApplication.prototype.isApplicationLaunching = function (activationKind) {
                return activationKind === WebApplication.ACTIVATION_KIND_LAUNCH;
            };
            WebApplication.prototype.getApplicationName = function () {
                return Commerce.StringResourceManager.getString("string_9001");
            };
            WebApplication.prototype.getArchitectureType = function () {
                return Commerce.Proxy.Entities.ArchitectureType.Unknown;
            };
            WebApplication.prototype.getApplicationType = function (correlationId) {
                if (_super.prototype.getApplicationType.call(this) === Commerce.Proxy.Entities.ApplicationTypeEnum.None) {
                    var applicationType = Commerce.Proxy.Entities.ApplicationTypeEnum.CloudPos;
                    if (Commerce.Host.Android.AndroidRemoteTaskMessageHandler.instance.areEndpointsInitialized) {
                        applicationType = Commerce.Proxy.Entities.ApplicationTypeEnum.ModernPOSAndroid;
                    }
                    else if (Commerce.Host.IOS.IOSRemoteTaskMessageHandler.instance.areEndpointsInitialized) {
                        applicationType = Commerce.Proxy.Entities.ApplicationTypeEnum.ModernPOSIOS;
                    }
                    this.setApplicationType(applicationType);
                    Commerce.RetailLogger.applicationType(correlationId, applicationType, Commerce.Proxy.Entities.ApplicationTypeEnum[applicationType]);
                }
                return _super.prototype.getApplicationType.call(this);
            };
            WebApplication.prototype.registerSwipeBinding = function (element) {
                if (this.getBrowserType() !== Commerce.Client.Entities.BrowserType.IE11) {
                    var swipeBinding = new Host.UI.SwipeBinding(element);
                    swipeBinding.bind();
                }
            };
            WebApplication.prototype.getAppSpecificHardwareId = function () {
                var cloudSessionId = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.CLOUD_SESSION_ID);
                if (Commerce.StringExtensions.isNullOrWhitespace(cloudSessionId)) {
                    cloudSessionId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                    Commerce.ApplicationStorage.setItem(Commerce.ApplicationStorageIDs.CLOUD_SESSION_ID, cloudSessionId);
                }
                return cloudSessionId;
            };
            WebApplication.prototype.getBrowserType = function () {
                if (/Trident\/7\./.test(window.navigator.userAgent)) {
                    return Commerce.Client.Entities.BrowserType.IE11;
                }
                else if (/Edge\/\d+/.test(window.navigator.userAgent)) {
                    return Commerce.Client.Entities.BrowserType.Edge;
                }
                else if (!Commerce.ObjectExtensions.isNullOrUndefined(window.chrome)) {
                    return Commerce.Client.Entities.BrowserType.Chrome;
                }
                else if (window.callPhantom || window._phantom || (/PhantomJS/.test(window.navigator.userAgent))) {
                    return Commerce.Client.Entities.BrowserType.Phantom;
                }
                return Commerce.Client.Entities.BrowserType.Other;
            };
            WebApplication.prototype.getCurrentMemoryUsageInMB = function () {
                return 0;
            };
            WebApplication.prototype.getAppMemoryUsageLimitInMB = function () {
                return 0;
            };
            WebApplication.prototype.openNewWindowAsync = function (uriToLaunch, correlationId) {
                window.open(uriToLaunch);
                return Commerce.VoidAsyncResult.createResolved();
            };
            WebApplication.ACTIVATION_KIND_LAUNCH = "Windows.Launch";
            WebApplication.CONFIGURATION_FILE_PATH = "bldver.json";
            return WebApplication;
        }(Host.ApplicationBase));
        Host.WebApplication = WebApplication;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var WebGlobalization = (function (_super) {
            __extends(WebGlobalization, _super);
            function WebGlobalization() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            WebGlobalization.prototype.getApplicationLanguage = function () {
                return this._applicationLanguage || this.getDefaultLanguageTag();
            };
            WebGlobalization.prototype.setApplicationLanguageAsync = function (languageTag) {
                var _this = this;
                var setApplicationLanguageQueue = new Commerce.AsyncQueue();
                setApplicationLanguageQueue.enqueue(function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(_this._applicationLanguage) &&
                        !Host.Globalization.CultureHelper.areLanguageTagsEqual(languageTag, _this.getDefaultLanguageTag())) {
                        return _this.loadResourcesAsync(_this.getDefaultLanguageTag());
                    }
                    else {
                        return Commerce.VoidAsyncResult.createResolved();
                    }
                }).enqueue(function () {
                    return _this.loadResourcesAsync(languageTag).done(function (resolvedLanguage) {
                        _this._applicationLanguage = resolvedLanguage;
                    });
                });
                return setApplicationLanguageQueue.run();
            };
            WebGlobalization.prototype.getDefaultLanguageTag = function () {
                return Commerce.Config.Web.defaultCultureName || "en-US";
            };
            WebGlobalization.prototype.initializeAsync = function () {
                var deviceCultureName = Commerce.ApplicationContext.Instance && Commerce.ApplicationContext.Instance.deviceConfiguration ?
                    Commerce.ApplicationContext.Instance.deviceConfiguration.CultureName : null;
                return this.setApplicationLanguageAsync(deviceCultureName);
            };
            WebGlobalization.prototype._getSupportedLanguageTags = function () {
                return Commerce.Config.Web.availableCultures;
            };
            WebGlobalization.prototype.loadResourcesAsync = function (languageTag) {
                var _this = this;
                languageTag = languageTag || Commerce.Config.Web.defaultCultureName;
                Commerce.RetailLogger.applicationGlobalizationResourcesLoading(languageTag);
                languageTag = Host.Globalization.CultureHelper.normalizeLanguageCode(languageTag);
                languageTag = Host.Globalization.CultureHelper.resolveAvailableUICulture(languageTag, this.getDefaultLanguageTag(), this._getSupportedLanguageTags());
                Commerce.RetailLogger.applicationGlobalizationResourcesLanguageResolved(languageTag);
                if (Host.Globalization.CultureHelper.areLanguageTagsEqual(languageTag, this._applicationLanguage)) {
                    return Commerce.AsyncResult.createResolved(languageTag);
                }
                var resourcesPath = Commerce.StringExtensions.format(Commerce.Config.Web.resourcesUriPath, languageTag);
                var resourceFiles = Commerce.ArrayExtensions.distinct([Commerce.Config.Web.primaryResourceFile].concat(Commerce.Config.Web.secondaryResources || []));
                var resourcesData = [];
                var downloadResourcesResults = resourceFiles.map(function (resourceFile) {
                    return Commerce.DataHelper.loadTextAsync(resourcesPath + resourceFile)
                        .map(function (data) {
                        return {
                            fileName: resourceFile,
                            resourceId: resourceFile.substr(0, resourceFile.lastIndexOf(".")),
                            data: data
                        };
                    }).done(function (result) {
                        resourcesData.push(result);
                    });
                });
                var downloadResourcesAsyncResult = Commerce.VoidAsyncResult.join(downloadResourcesResults)
                    .done(function () {
                    resourcesData.forEach(function (value) {
                        _this.onResourcesLoadedSuccess(value);
                    });
                }).fail(function (errors) {
                    _this.onResourcesLoadedError(errors, languageTag);
                });
                return downloadResourcesAsyncResult.map(function () { return languageTag; });
            };
            WebGlobalization.prototype.onResourcesLoadedSuccess = function (resourceData) {
                resourceData.data = this.removeJavaScriptComments(resourceData.data);
                var dictionary = JSON.parse(resourceData.data);
                if (Commerce.ObjectExtensions.isNullOrUndefined(dictionary)) {
                    Commerce.RetailLogger.applicationGlobalizationResourcesEmpty();
                    return;
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(window[WebGlobalization.WINJS_GLOBAL_STRINGS_KEY])) {
                    window[WebGlobalization.WINJS_GLOBAL_STRINGS_KEY] = {};
                }
                var resourceDictionary = window[WebGlobalization.WINJS_GLOBAL_STRINGS_KEY];
                Object.keys(dictionary).forEach(function (key) {
                    var winJSKey = resourceData.fileName !== Commerce.Config.Web.primaryResourceFile ? "/" + resourceData.resourceId + "/" + key : key;
                    resourceDictionary[winJSKey] = dictionary[key];
                });
            };
            WebGlobalization.prototype.onResourcesLoadedError = function (errors, languageTag) {
                Commerce.RetailLogger.applicationGlobalizationResourcesLoadFailed(languageTag, errors[0].ErrorCode, Commerce.ErrorHelper.formatErrorMessage(errors[0]));
            };
            WebGlobalization.prototype.removeJavaScriptComments = function (data) {
                if (Commerce.StringExtensions.isNullOrWhitespace(data)) {
                    return data;
                }
                return data.replace(WebGlobalization.JAVASCRIPT_COMMENT_REGEX, Commerce.StringExtensions.EMPTY);
            };
            WebGlobalization.WINJS_GLOBAL_STRINGS_KEY = "strings";
            WebGlobalization.JAVASCRIPT_COMMENT_REGEX = /(\/\*([^*] |[\r\n] |(\*+([^*/] |[\r\n])))*\*+\/)|((([^:]\/\/)|(^\/\/)).*)/g;
            return WebGlobalization;
        }(Host.Globalization.GlobalizationBase));
        Host.WebGlobalization = WebGlobalization;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var WebHost = (function () {
            function WebHost() {
                this._application = new Host.WebApplication();
                this._globalization = new Host.WebGlobalization();
            }
            WebHost.prototype.initializeAsync = function () {
                var _this = this;
                var result = new Commerce.VoidAsyncResult();
                this._fixIELocalStorageSyncIssue();
                var hostInitializationQueue = new Commerce.AsyncQueue();
                hostInitializationQueue.enqueue(function () {
                    return _this._application.initializeAsync();
                });
                Commerce.VoidAsyncResult.join([
                    hostInitializationQueue.run(),
                    this._globalization.initializeAsync()
                ]).done(function () { return result.resolve(); })
                    .fail(function (errors) { return result.resolve(); });
                window.addEventListener("beforeunload", this._beforeUnloadHandler.bind(this));
                return result;
            };
            Object.defineProperty(WebHost.prototype, "application", {
                get: function () {
                    return this._application;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebHost.prototype, "globalization", {
                get: function () {
                    return this._globalization;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebHost.prototype, "timers", {
                get: function () {
                    return Commerce.Host.CrossBrowser.WindowTimersExtensionFactory.get();
                },
                enumerable: true,
                configurable: true
            });
            WebHost.prototype._fixIELocalStorageSyncIssue = function () {
                window.addEventListener("storage", function (event) { }, false);
            };
            WebHost.prototype._beforeUnloadHandler = function (e) {
                var deviceConfiguration = Commerce.ApplicationContext.Instance.deviceConfiguration;
                if (Commerce.Session.instance.isLoggedOn
                    && !Commerce.Helpers.DeviceActivationHelper.isInDeviceActivationProcess()
                    && !Commerce.ObjectExtensions.isNullOrUndefined(deviceConfiguration)
                    && deviceConfiguration.EmployeeLogonTypeValue === Commerce.Proxy.Entities.EmployeeLogonType.AzureActiveDirectory
                    && Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.AAD_LOGOFF_INITIATED) === "false") {
                    var message = Commerce.ViewModelAdapter.getResourceString("string_9000");
                    e.returnValue = message;
                    return message;
                }
                return undefined;
            };
            return WebHost;
        }());
        Host.WebHost = WebHost;
        Commerce.Host.instance = new WebHost();
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        var IOS;
        (function (IOS) {
            "use strict";
            var IOSRemoteTaskMessageHandler = (function (_super) {
                __extends(IOSRemoteTaskMessageHandler, _super);
                function IOSRemoteTaskMessageHandler() {
                    var _this = _super.call(this) || this;
                    _this._iosMessagingEndpoint = null;
                    return _this;
                }
                Object.defineProperty(IOSRemoteTaskMessageHandler, "instance", {
                    get: function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(IOSRemoteTaskMessageHandler._instance)) {
                            IOSRemoteTaskMessageHandler._instance = new IOSRemoteTaskMessageHandler();
                        }
                        return IOSRemoteTaskMessageHandler._instance;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(IOSRemoteTaskMessageHandler.prototype, "areEndpointsInitialized", {
                    get: function () {
                        this._setEndpoint();
                        return !Commerce.ObjectExtensions.isNullOrUndefined(this._iosMessagingEndpoint);
                    },
                    enumerable: true,
                    configurable: true
                });
                IOSRemoteTaskMessageHandler.prototype.send = function (correlationId, taskInstanceId, messageType, message) {
                    throw new Error("The send method is currently not implemented");
                };
                IOSRemoteTaskMessageHandler.prototype._setEndpoint = function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._iosMessagingEndpoint)) {
                        var windowProxy = window;
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(windowProxy) &&
                            !Commerce.ObjectExtensions.isNullOrUndefined(windowProxy.webkit) &&
                            !Commerce.ObjectExtensions.isNullOrUndefined(windowProxy.webkit.messageHandlers) &&
                            !Commerce.ObjectExtensions.isNullOrUndefined(windowProxy.webkit.messageHandlers.taskMessageFromPOSToIOS) &&
                            !Commerce.ObjectExtensions.isNullOrUndefined(windowProxy.webkit.messageHandlers.taskMessageFromPOSToIOS.postMessage)) {
                            this._iosMessagingEndpoint = windowProxy.webkit.messageHandlers.taskMessageFromPOSToIOS.postMessage;
                        }
                    }
                };
                return IOSRemoteTaskMessageHandler;
            }(Commerce.Host.HostedAppRemoteTaskMessageHandler));
            IOS.IOSRemoteTaskMessageHandler = IOSRemoteTaskMessageHandler;
        })(IOS = Host.IOS || (Host.IOS = {}));
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var HardwareStationAndroidOutgoingTaskResult = (function () {
            function HardwareStationAndroidOutgoingTaskResult() {
            }
            return HardwareStationAndroidOutgoingTaskResult;
        }());
        Host.HardwareStationAndroidOutgoingTaskResult = HardwareStationAndroidOutgoingTaskResult;
        var HardwareStationAndroidOutgoingTask = (function (_super) {
            __extends(HardwareStationAndroidOutgoingTask, _super);
            function HardwareStationAndroidOutgoingTask(timeoutInMilliseconds, action, targetHardwareStationRequestUri, requestBody, requestLocale, hardwareStationHeaders) {
                var _this = _super.call(this, timeoutInMilliseconds) || this;
                _this.action = action;
                _this.targetHardwareStationRequestUri = targetHardwareStationRequestUri;
                _this.requestBody = requestBody;
                _this.requestLocale = requestLocale;
                _this.hardwareStationHeaders = hardwareStationHeaders;
                return _this;
            }
            Object.defineProperty(HardwareStationAndroidOutgoingTask.prototype, "name", {
                get: function () {
                    return "HardwareStationAndroidInvocation";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HardwareStationAndroidOutgoingTask.prototype, "parameters", {
                get: function () {
                    var request = {
                        action: this.action,
                        targetHardwareStationRequestUri: this.targetHardwareStationRequestUri,
                        requestBody: this.requestBody,
                        requestLocale: this.requestLocale,
                        hardwareStationHeaders: this.hardwareStationHeaders
                    };
                    return request;
                },
                enumerable: true,
                configurable: true
            });
            HardwareStationAndroidOutgoingTask.prototype.DeserializeResult = function (serializedResult) {
                var hardwareStationAndroidOutgoingTaskResult = JSON.parse(serializedResult);
                if (Commerce.ObjectExtensions.isNullOrUndefined(hardwareStationAndroidOutgoingTaskResult) ||
                    Commerce.StringExtensions.isNullOrWhitespace(hardwareStationAndroidOutgoingTaskResult.statusText)) {
                    Commerce.RetailLogger.dedicatedHardwareStationOutgoingDeserializationFailure(serializedResult);
                    throw new Error("The hardware station android result was not correctly parsed from the result.");
                }
                return hardwareStationAndroidOutgoingTaskResult;
            };
            return HardwareStationAndroidOutgoingTask;
        }(Commerce.RemoteTaskManager.OutgoingTask));
        Host.HardwareStationAndroidOutgoingTask = HardwareStationAndroidOutgoingTask;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var SetSessionInfoOnHostOutgoingTaskResult = (function () {
            function SetSessionInfoOnHostOutgoingTaskResult() {
            }
            return SetSessionInfoOnHostOutgoingTaskResult;
        }());
        Host.SetSessionInfoOnHostOutgoingTaskResult = SetSessionInfoOnHostOutgoingTaskResult;
        var SetSessionInfoOnHostOutgoingTask = (function (_super) {
            __extends(SetSessionInfoOnHostOutgoingTask, _super);
            function SetSessionInfoOnHostOutgoingTask(timeoutInMilliseconds, sessionInfo) {
                var _this = _super.call(this, timeoutInMilliseconds) || this;
                _this.sessionInfo = sessionInfo;
                return _this;
            }
            Object.defineProperty(SetSessionInfoOnHostOutgoingTask.prototype, "name", {
                get: function () {
                    return "SetSessionInfoInvocation";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SetSessionInfoOnHostOutgoingTask.prototype, "parameters", {
                get: function () {
                    var parameter = {
                        sessionInfo: this.sessionInfo
                    };
                    return parameter;
                },
                enumerable: true,
                configurable: true
            });
            SetSessionInfoOnHostOutgoingTask.prototype.DeserializeResult = function (serializedResult) {
                var setSessionInfoOutgoingTaskResult = JSON.parse(serializedResult);
                if (Commerce.ObjectExtensions.isNullOrUndefined(setSessionInfoOutgoingTaskResult)
                    || Commerce.StringExtensions.isNullOrWhitespace(setSessionInfoOutgoingTaskResult.statusText)) {
                    Commerce.RetailLogger.applicationTelemetryContextUpdateDeserializationFailure(serializedResult);
                    throw new Error("The telemetry set session result was not correctly parsed from the result.");
                }
                else {
                    Commerce.RetailLogger.applicationTelemetryContextUpdateCompleted("The telemetry operation to set session info is completed and it is "
                        + setSessionInfoOutgoingTaskResult.statusText);
                }
                return setSessionInfoOutgoingTaskResult;
            };
            return SetSessionInfoOnHostOutgoingTask;
        }(Commerce.RemoteTaskManager.OutgoingTask));
        Host.SetSessionInfoOnHostOutgoingTask = SetSessionInfoOnHostOutgoingTask;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var UpdateTelemetryOnHostOutgoingTaskResult = (function () {
            function UpdateTelemetryOnHostOutgoingTaskResult() {
            }
            return UpdateTelemetryOnHostOutgoingTaskResult;
        }());
        Host.UpdateTelemetryOnHostOutgoingTaskResult = UpdateTelemetryOnHostOutgoingTaskResult;
        var UpdateTelemetryOnHostOutgoingTask = (function (_super) {
            __extends(UpdateTelemetryOnHostOutgoingTask, _super);
            function UpdateTelemetryOnHostOutgoingTask(timeoutInMilliseconds, environmentId, instrumentationKey) {
                var _this = _super.call(this, timeoutInMilliseconds) || this;
                _this.environmentId = environmentId;
                _this.instrumentationKey = instrumentationKey;
                return _this;
            }
            Object.defineProperty(UpdateTelemetryOnHostOutgoingTask.prototype, "name", {
                get: function () {
                    return "UpdateTelemetryInvocation";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UpdateTelemetryOnHostOutgoingTask.prototype, "parameters", {
                get: function () {
                    var parameter = {
                        environmentId: this.environmentId,
                        instrumentationKey: this.instrumentationKey
                    };
                    return parameter;
                },
                enumerable: true,
                configurable: true
            });
            UpdateTelemetryOnHostOutgoingTask.prototype.DeserializeResult = function (serializedResult) {
                var updateTelemetryOutgoingTaskResult = JSON.parse(serializedResult);
                if (Commerce.ObjectExtensions.isNullOrUndefined(updateTelemetryOutgoingTaskResult)
                    || Commerce.StringExtensions.isNullOrWhitespace(updateTelemetryOutgoingTaskResult.statusText)) {
                    Commerce.RetailLogger.applicationTelemetryContextUpdateCompleted("Telemetry update failed:" + serializedResult);
                }
                return updateTelemetryOutgoingTaskResult;
            };
            return UpdateTelemetryOnHostOutgoingTask;
        }(Commerce.RemoteTaskManager.OutgoingTask));
        Host.UpdateTelemetryOnHostOutgoingTask = UpdateTelemetryOnHostOutgoingTask;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var DedicatedHardwareStationRequest = Commerce.DedicatedHardwareStationRequest;
        var DedicatedHardwareStationResponse = Commerce.DedicatedHardwareStationResponse;
        var DedicatedHardwareStationRequestHandler = (function (_super) {
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
                    Commerce.RetailLogger.dedicatedHardwareStationOutgoingTaskStarted(request.correlationId, request.targetHardwareStationRequestUri);
                    var hardwareStationHeaders = _this._createRequestHeader(request.requestLocale, request.correlationId);
                    var hardwareStationAndroidOutgoingTask = new Host.HardwareStationAndroidOutgoingTask(request.timeout, DedicatedHardwareStationRequestHandler.POST_HTTP_REQUEST_METHOD, request.targetHardwareStationRequestUri, request.requestBody, request.requestLocale, hardwareStationHeaders);
                    Pos.remoteTaskManager.runOutgoingTask(request.correlationId, hardwareStationAndroidOutgoingTask).then(function (value) {
                        var responseMessage = {
                            status: value.status,
                            statusText: value.statusText,
                            responseText: value.responseText
                        };
                        var response = {
                            canceled: false,
                            data: new DedicatedHardwareStationResponse(responseMessage)
                        };
                        resolve(response);
                    }).catch(function (reason) {
                        reject(reason);
                    });
                });
                return promise;
            };
            DedicatedHardwareStationRequestHandler.prototype._createRequestHeader = function (requestLocale, activityId) {
                var hardwareStationHeaders = null;
                var acceptLanguageHeader = {
                    name: DedicatedHardwareStationRequestHandler.ACCEPT_LANGUAGE_HEADER_NAME,
                    value: requestLocale
                };
                var activityIdHeader = {
                    name: DedicatedHardwareStationRequestHandler.ACTIVITYID_HEADER_NAME,
                    value: activityId
                };
                hardwareStationHeaders = Commerce.StringExtensions.isNullOrWhitespace(requestLocale)
                    ? [activityIdHeader]
                    : [acceptLanguageHeader, activityIdHeader];
                return hardwareStationHeaders;
            };
            DedicatedHardwareStationRequestHandler.POST_HTTP_REQUEST_METHOD = "POST";
            DedicatedHardwareStationRequestHandler.ACCEPT_LANGUAGE_HEADER_NAME = "Accept-Language";
            DedicatedHardwareStationRequestHandler.ACTIVITYID_HEADER_NAME = "ActivityId";
            return DedicatedHardwareStationRequestHandler;
        }(Commerce.RequestHandler));
        Host.DedicatedHardwareStationRequestHandler = DedicatedHardwareStationRequestHandler;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var SetSessionInfoOnHostRequest = Commerce.Host.Messages.SetSessionInfoOnHostRequest;
        var SetSessionInfoOnHostResponse = Commerce.Host.Messages.SetSessionInfoOnHostResponse;
        var SetSessionInfoOnHostDataRequestHandler = (function () {
            function SetSessionInfoOnHostDataRequestHandler() {
            }
            SetSessionInfoOnHostDataRequestHandler.prototype.supportedRequestType = function () {
                return SetSessionInfoOnHostRequest;
            };
            SetSessionInfoOnHostDataRequestHandler.prototype.executeAsync = function (request) {
                var SET_SESSION_INFO_TIMEOUT_MS = 15000;
                var promise = new Promise(function (resolve, reject) {
                    var setSessionInfoOutgoingTask = new Host.SetSessionInfoOnHostOutgoingTask(SET_SESSION_INFO_TIMEOUT_MS, request.sessionInfo);
                    Pos.remoteTaskManager.runOutgoingTask(request.correlationId, setSessionInfoOutgoingTask).then(function (value) {
                        var response = {
                            canceled: false,
                            data: new SetSessionInfoOnHostResponse(value.statusText)
                        };
                        resolve(response);
                    }).catch(function (reason) {
                        reject(reason);
                    });
                });
                return promise;
            };
            return SetSessionInfoOnHostDataRequestHandler;
        }());
        Host.SetSessionInfoOnHostDataRequestHandler = SetSessionInfoOnHostDataRequestHandler;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        "use strict";
        var UpdateTelemetryOnHostRequest = Commerce.Host.Messages.UpdateTelemetryOnHostRequest;
        var UpdateTelemetryOnHostResponse = Commerce.Host.Messages.UpdateTelemetryOnHostResponse;
        var UpdateTelemetryOnHostDataRequestHandler = (function () {
            function UpdateTelemetryOnHostDataRequestHandler() {
            }
            UpdateTelemetryOnHostDataRequestHandler.prototype.supportedRequestType = function () {
                return UpdateTelemetryOnHostRequest;
            };
            UpdateTelemetryOnHostDataRequestHandler.prototype.executeAsync = function (request) {
                var promise = new Promise(function (resolve, reject) {
                    var updateTelemetryOutgoingTask = new Host.UpdateTelemetryOnHostOutgoingTask(15000, request.environmentId, request.instrumentationKey);
                    Pos.remoteTaskManager.runOutgoingTask(request.correlationId, updateTelemetryOutgoingTask).then(function (value) {
                        var response = {
                            canceled: false,
                            data: new UpdateTelemetryOnHostResponse(value.statusText)
                        };
                        resolve(response);
                    }).catch(function (reason) {
                        reject(reason);
                    });
                });
                return promise;
            };
            return UpdateTelemetryOnHostDataRequestHandler;
        }());
        Host.UpdateTelemetryOnHostDataRequestHandler = UpdateTelemetryOnHostDataRequestHandler;
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        var UI;
        (function (UI) {
            "use strict";
            var HorizontalScoll = (function () {
                function HorizontalScoll() {
                }
                HorizontalScoll.init = function () {
                    $(document).on("mousewheel", function (event) {
                        if (event.originalEvent.deltaX > 0 || event.ctrlKey || event.shiftKey) {
                            return;
                        }
                        var delta = event.originalEvent.deltaY;
                        var target = event.target;
                        while (!Commerce.ObjectExtensions.isNullOrUndefined(target)) {
                            var overflowY = $(target).css(HorizontalScoll.overflowY);
                            var overflowX = $(target).css(HorizontalScoll.overflowX);
                            if (target.scrollHeight > target.clientHeight &&
                                (overflowY === "scroll" || overflowY === "auto")) {
                                break;
                            }
                            if (target.scrollWidth > target.clientWidth &&
                                (overflowX === "scroll" || overflowX === "auto")) {
                                var textDirection = $("body").attr("dir");
                                delta = textDirection === "ltr" ? delta : -delta;
                                target.scrollLeft += delta;
                                event.preventDefault();
                                break;
                            }
                            else {
                                var $target = $(target).parent();
                                if (!$target.is("body")) {
                                    target = $target.get(0);
                                }
                                else {
                                    break;
                                }
                            }
                        }
                    });
                };
                HorizontalScoll.overflowY = "overflow-y";
                HorizontalScoll.overflowX = "overflow-x";
                return HorizontalScoll;
            }());
            UI.HorizontalScoll = HorizontalScoll;
        })(UI = Host.UI || (Host.UI = {}));
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        var CrossBrowser;
        (function (CrossBrowser) {
            "use strict";
            var WindowTimersExtensionBase = (function () {
                function WindowTimersExtensionBase() {
                    this._nextHandleId = 1;
                    this._handlers = new Commerce.Dictionary();
                    this._isHandlerRunning = false;
                }
                WindowTimersExtensionBase.prototype.setImmediate = function (handler) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    throw new Error("SetImmediateHandlerBase is an abstract class. No implementation exists.");
                };
                WindowTimersExtensionBase.prototype.clearImmediate = function (handle) {
                    this._handlers.removeItem(handle);
                };
                WindowTimersExtensionBase.prototype.addHandler = function (args) {
                    var handleId = this._nextHandleId++;
                    this._handlers.setItem(handleId, this.partialApply.apply(this, args));
                    return handleId;
                };
                WindowTimersExtensionBase.prototype.executeHandler = function (handle) {
                    if (this._isHandlerRunning) {
                        var appliedHandler = this.partialApply(this.executeHandler, handle);
                        window.setTimeout(appliedHandler, 0);
                    }
                    else {
                        var handler = this._handlers.getItem(handle);
                        if (Commerce.ObjectExtensions.isFunction(handler)) {
                            this._isHandlerRunning = true;
                            try {
                                handler();
                            }
                            finally {
                                this.clearImmediate(handle);
                                this._isHandlerRunning = false;
                            }
                        }
                    }
                };
                WindowTimersExtensionBase.prototype.partialApply = function (handler) {
                    var _this = this;
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    if (Commerce.ObjectExtensions.isNullOrUndefined(handler)) {
                        throw new Error("handler is null or undefined");
                    }
                    else if (!Commerce.ObjectExtensions.isFunction(handler)) {
                        throw new Error("setImmediate(string) is not allowed due to security policy!");
                    }
                    return function () { handler.apply(_this, args); };
                };
                return WindowTimersExtensionBase;
            }());
            CrossBrowser.WindowTimersExtensionBase = WindowTimersExtensionBase;
        })(CrossBrowser = Host.CrossBrowser || (Host.CrossBrowser = {}));
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        var CrossBrowser;
        (function (CrossBrowser) {
            "use strict";
            var MessageChannelWindowTimersExtension = (function (_super) {
                __extends(MessageChannelWindowTimersExtension, _super);
                function MessageChannelWindowTimersExtension() {
                    var _this = _super.call(this) || this;
                    _this._messageChannel = new MessageChannel();
                    _this.init();
                    return _this;
                }
                MessageChannelWindowTimersExtension.prototype.setImmediate = function (handler) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    var handleId = this.addHandler(arguments);
                    this._messageChannel.port2.postMessage(handleId);
                    return handleId;
                };
                MessageChannelWindowTimersExtension.prototype.init = function () {
                    var _this = this;
                    this._messageChannel.port1.onmessage = function (event) {
                        var handleId = event.data;
                        _this.executeHandler(handleId);
                    };
                };
                return MessageChannelWindowTimersExtension;
            }(CrossBrowser.WindowTimersExtensionBase));
            CrossBrowser.MessageChannelWindowTimersExtension = MessageChannelWindowTimersExtension;
        })(CrossBrowser = Host.CrossBrowser || (Host.CrossBrowser = {}));
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        var CrossBrowser;
        (function (CrossBrowser) {
            "use strict";
            var SetTimeoutWindowTimersExtension = (function (_super) {
                __extends(SetTimeoutWindowTimersExtension, _super);
                function SetTimeoutWindowTimersExtension() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SetTimeoutWindowTimersExtension.prototype.setImmediate = function (handler) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    var handleId = this.addHandler(arguments);
                    var appliedHandler = this.partialApply(this.executeHandler, handleId);
                    window.setTimeout(appliedHandler, 0);
                    return handleId;
                };
                return SetTimeoutWindowTimersExtension;
            }(CrossBrowser.WindowTimersExtensionBase));
            CrossBrowser.SetTimeoutWindowTimersExtension = SetTimeoutWindowTimersExtension;
        })(CrossBrowser = Host.CrossBrowser || (Host.CrossBrowser = {}));
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Host;
    (function (Host) {
        var CrossBrowser;
        (function (CrossBrowser) {
            "use strict";
            var WindowTimersExtensionFactory = (function () {
                function WindowTimersExtensionFactory() {
                }
                WindowTimersExtensionFactory.get = function () {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(WindowTimersExtensionFactory._instance)) {
                        return WindowTimersExtensionFactory._instance;
                    }
                    else {
                        WindowTimersExtensionFactory._instance = WindowTimersExtensionFactory.createInternal();
                        return WindowTimersExtensionFactory._instance;
                    }
                };
                WindowTimersExtensionFactory.createInternal = function () {
                    if (Commerce.ObjectExtensions.isFunction(window.setImmediate) && Commerce.ObjectExtensions.isFunction(window.clearImmediate)) {
                        return window;
                    }
                    else if (Commerce.ObjectExtensions.isFunction(window.MessageChannel)) {
                        return new CrossBrowser.MessageChannelWindowTimersExtension();
                    }
                    else {
                        return new CrossBrowser.SetTimeoutWindowTimersExtension();
                    }
                };
                return WindowTimersExtensionFactory;
            }());
            CrossBrowser.WindowTimersExtensionFactory = WindowTimersExtensionFactory;
        })(CrossBrowser = Host.CrossBrowser || (Host.CrossBrowser = {}));
    })(Host = Commerce.Host || (Commerce.Host = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var Facade;
        (function (Facade) {
            "use strict";
            var Printer = (function () {
                function Printer() {
                    this._printers = new Commerce.Dictionary();
                }
                Printer.prototype.registerPrinter = function (type, printer) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(printer)) {
                        throw new Error("Printer instance is null or undefined.");
                    }
                    this._printers.setItem(type, printer);
                };
                Printer.prototype.printAsync = function (printableReceipts, callerContext) {
                    var _this = this;
                    var asyncResult = new Commerce.VoidAsyncResult();
                    var errors = new Array();
                    var correlationId = callerContext || Commerce.LoggerHelper.getNewCorrelationId();
                    printableReceipts.forEach(function (printableReceipt) {
                        printableReceipt.receiptHeader = Commerce.ReceiptHelper.translateReceiptContent(printableReceipt.receiptHeader);
                        printableReceipt.receiptBody = Commerce.ReceiptHelper.translateReceiptContent(printableReceipt.receiptBody);
                        printableReceipt.receiptFooter = Commerce.ReceiptHelper.translateReceiptContent(printableReceipt.receiptFooter);
                    });
                    var receiptsGroupedByPrinterType = Commerce.ObjectExtensions.groupBy(printableReceipts, function (element) { return element.printerType; });
                    Commerce.Utilities.AsyncExecutionHelper.forEachAsync(receiptsGroupedByPrinterType, function (groupedPrintableReceipts, next, printerType) {
                        if (!groupedPrintableReceipts) {
                            next();
                        }
                        else {
                            if (_this._printers.hasItem(printerType)) {
                                _this._printers.getItem(printerType).printAsync(groupedPrintableReceipts, correlationId)
                                    .done(function () { return next(); })
                                    .fail(function (error) {
                                    errors = errors.concat(error);
                                    next();
                                });
                            }
                            else {
                                var printerTypeNotFoundError = new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.PERIPHERAL_UNSUPPORTED_PRINTERTYPE_ERROR);
                                errors = errors.concat(printerTypeNotFoundError);
                                Commerce.RetailLogger.peripheralsUnsupportedPrinterType(printerType);
                                next();
                            }
                        }
                    }, function () {
                        if (errors.length === 0) {
                            asyncResult.resolve();
                        }
                        else {
                            asyncResult.reject(errors);
                        }
                    });
                    return asyncResult;
                };
                return Printer;
            }());
            Facade.Printer = Printer;
        })(Facade = Peripherals.Facade || (Peripherals.Facade = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
        var WebPeripherals = (function (_super) {
            __extends(WebPeripherals, _super);
            function WebPeripherals() {
                var _this = _super.call(this) || this;
                _this.barcodeScanner = new Peripherals.CompositeBarcodeScanner([
                    new Peripherals.HardwareStation.CompositeBarcodeScanner(),
                    new Peripherals.KeyboardBarcodeScanParser()
                ]);
                _this.cashDrawer = new Peripherals.HardwareStation.CashDrawer();
                _this.dualDisplay = new Peripherals.NoOperation.NopDualDisplay();
                _this.lineDisplay = new Peripherals.HardwareStation.LineDisplay();
                _this.magneticStripeReader = new Peripherals.CompositeMagneticStripeReader([
                    new Peripherals.MSRKeyboardSwipeParser(),
                    new Peripherals.HardwareStation.MagneticStripeReader()
                ]);
                _this.paymentTerminal = new Peripherals.HardwareStation.PaymentTerminal();
                _this.pinPad = new Peripherals.HardwareStation.PinPad();
                _this.proximity = new Peripherals.NoOperation.NopProximity();
                _this.printer = _this.createPrinter();
                _this.scale = new Peripherals.HardwareStation.Scale();
                _this.signatureCapture = new Peripherals.HardwareStation.SignatureCapture();
                _this.cardPayment = new Peripherals.HardwareStation.CardPayment();
                _this.fiscalPeripheral = new Peripherals.HardwareStation.FiscalPeripheral();
                return _this;
            }
            Object.defineProperty(WebPeripherals, "instance", {
                get: function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(WebPeripherals._instance)) {
                        WebPeripherals._instance = new WebPeripherals();
                    }
                    return WebPeripherals._instance;
                },
                enumerable: true,
                configurable: true
            });
            WebPeripherals.prototype.initializeAsync = function (callerContext) {
                return _super.prototype.initializeAsync.call(this);
            };
            WebPeripherals.prototype.createPrinter = function () {
                var printerFacade = new Peripherals.Facade.Printer();
                var hardwareStationPrinter = new Peripherals.HardwareStation.Printer();
                printerFacade.registerPrinter(Commerce.Proxy.Entities.PeripheralType.OPOS, hardwareStationPrinter);
                printerFacade.registerPrinter(Commerce.Proxy.Entities.PeripheralType.Windows, hardwareStationPrinter);
                printerFacade.registerPrinter(Commerce.Proxy.Entities.PeripheralType.Network, hardwareStationPrinter);
                printerFacade.registerPrinter(Commerce.Proxy.Entities.PeripheralType.Fallback, hardwareStationPrinter);
                return printerFacade;
            };
            WebPeripherals._instance = null;
            return WebPeripherals;
        }(Peripherals.PeripheralsBase));
        Peripherals.WebPeripherals = WebPeripherals;
        Commerce.Peripherals.instance = WebPeripherals.instance;
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        function getPaymentRequestHandlers(options) {
            if (options.enableUnifiedPaymentsExperience) {
                throw "getPaymentRequestHandlers: options value for enableUnifiedPaymentsExperience not supported.";
            }
            var handlersList = [
                Commerce.Payments.Handlers.AddToGiftCardInputClientRequestHandler,
                Commerce.Payments.Handlers.ApprovePartialAmountInputClientRequestHandler,
                Commerce.Payments.Handlers.CheckGiftCardBalanceInputClientRequestHandler,
                Commerce.Payments.Handlers.DisplayPaymentMessageDialogInputClientRequestHandler,
                Commerce.Payments.Handlers.GetCashBackAmountInputClientRequestHandler,
                Commerce.Payments.Handlers.GetGiftCardInputClientRequestHandler,
                Commerce.Payments.Handlers.GetPaymentOptionInputClientRequestHandler,
                Commerce.Payments.Handlers.GetSignatureFromDeviceInputClientRequestHandler,
                Commerce.Payments.Handlers.GetSignatureFromPOSInputClientRequestHandler,
                Commerce.Payments.Handlers.IssueGiftCardInputClientRequestHandler,
                Commerce.Payments.Handlers.SelectCardTypeInputClientRequestHandler,
                Commerce.Payments.Handlers.SelectCardTypeForTenderBasedDiscountInputClientRequestHandler,
                Commerce.Payments.Handlers.SelectPaymentOptionInputClientRequestHandler,
                Commerce.Payments.Handlers.SelectTenderTypeInputClientRequestHandler,
                Commerce.Payments.Handlers.ValidateSignatureInPOSInputClientRequestHandler,
                Commerce.Payments.Handlers.ActivateHardwareStationClientRequestHandler,
                Commerce.Payments.Handlers.AddPreprocessedTenderLineToCartClientRequestHandler,
                Commerce.Payments.Handlers.GetAllCardTypesClientRequestHandler,
                Commerce.Payments.Handlers.GetAllowedReturnOptionsClientRequestHandler,
                Commerce.Payments.Handlers.GetLoyaltyCardClientRequestHandler,
                Commerce.Payments.Handlers.GetPinUsingPinPadClientRequestHandler,
                Payments.Operations.Handlers.AddToGiftCardOperationRequestHandler,
                Payments.Operations.Handlers.CashOutGiftCardOperationRequestHandler,
                Payments.Operations.Handlers.CheckGiftCardBalanceOperationRequestHandler,
                Payments.Operations.Handlers.IssueGiftCardOperationRequestHandler,
                Payments.Operations.Handlers.TokenizedPaymentCardOperationRequestHandler,
                Payments.Operations.Handlers.VoidPaymentOperationRequestHandler,
                Payments.Handlers.AddBalanceToGiftCardClientRequestHandler,
                Payments.Handlers.AddPreAuthorizedPaymentsToCartClientRequestHandler,
                Payments.Handlers.ApprovePartialPaymentClientRequestHandler,
                Payments.Handlers.AuthorizeCardTokenAndAddToCartClientRequestHandler,
                Payments.Handlers.AuthorizeOrRefundPaymentClientRequestHandler,
                Payments.Handlers.BeginTransactionClientRequestHandler,
                Payments.Handlers.CashOutGiftCardClientRequestHandler,
                Payments.Handlers.CheckForRecoveredPaymentTransactionClientRequestHandler,
                Payments.Handlers.ComposeTenderInfoForCardPaymentClientRequestHandler,
                Payments.Handlers.CreatePreProcessedTenderLineClientRequestHandler,
                Payments.Handlers.GetAndProcessCardPaymentAcceptPageResultClientRequestHandler,
                Payments.Handlers.GetAndUpdateTenderLineSignatureClientRequestHandler,
                Payments.Handlers.GetAuthorizationOptionsClientRequestHandler,
                Payments.Handlers.GetCardTypeClientRequestHandler,
                Payments.Handlers.GetCashBackAmountClientRequestHandler,
                Payments.Handlers.GetCurrencyAmountsClientRequestHandler,
                Payments.Handlers.GetDenominationListClientRequestHandler,
                Payments.Handlers.GetGiftCardByIdClientRequestHandler,
                Payments.Handlers.GetGiftCardByIdServiceRequestHandler,
                Payments.Handlers.GetGiftCardClientRequestHandler,
                Payments.Handlers.GetPaymentCardTypeByBinRangeClientRequestHandler,
                Payments.Handlers.GetReturnOptionsClientRequestHandler,
                Payments.Handlers.GetSignatureClientRequestHandler,
                Payments.Handlers.GetSignatureFromDeviceClientRequestHandler,
                Payments.Handlers.GetSignatureFromPOSClientRequestHandler,
                Payments.Handlers.GetTenderBasedDiscountClientRequestHandler,
                Payments.Handlers.IssueGiftCardClientRequestHandler,
                Payments.Handlers.RefundCaptureTokenAndAddToCartClientRequestHandler,
                Payments.Handlers.SaveMerchantInformationClientRequestHandler,
                Payments.Handlers.SelectAllowedRefundOptionClientRequestHandler,
                Payments.Handlers.SelectCardTypeClientRequestHandler,
                Payments.Handlers.SelectLinkedRefundClientRequestHandler,
                Payments.Handlers.SelectTransactionPaymentMethodClientRequestHandler,
                Payments.Handlers.TokenizePaymentCardClientRequestHandler,
                Payments.Handlers.UpdateTenderLineSignatureServiceRequestHandler,
                Payments.Handlers.ValidateAndUpdateTenderLineSignatureClientRequestHandler,
                Payments.Handlers.ValidateSignatureClientRequestHandler,
                Payments.Handlers.VoidPaymentClientRequestHandler,
            ];
            return handlersList;
        }
        Payments.getPaymentRequestHandlers = getPaymentRequestHandlers;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Pos;
(function (Pos) {
    "use strict";
    var PosCommonRuntimeInitializer = (function () {
        function PosCommonRuntimeInitializer(requestHandlerContext) {
            this._context = requestHandlerContext;
        }
        PosCommonRuntimeInitializer.prototype.populateCompositionLoader = function (compositionLoader) {
            var _this = this;
            compositionLoader.addRequestHandler(Commerce.AuditEvent.RegisterAndGetAuditEventServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.AcknowledgeNotificationsRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Carts.AddSalesRepresentativeToCartServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.CreateAdvancedCashManagementTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.CreateFloatEntryTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.CreateSafeFloatEntryTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.CreateSafeStartingAmountTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.CreateSafeTenderRemovalTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.CreateShiftFloatEntryTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.CreateShiftStartingAmountTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.CreateShiftTenderRemovalTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.CreateStartingAmountTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.CreateTenderRemovalTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CheckUserCanOverrideReturnPolicyClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.GetInventoryAvailableToPromiseRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Offline.Handlers.ToggleConnectionRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ConcludeTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.DeclareStartingAmountClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetApplicationVersionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetAvailableUnreconciledEntriesServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetAuthenticationTokenClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetCashDeclarationsMapClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetChannelConfigurationClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetConnectionStatusClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetCustomerClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetDenominationTotalsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetDeviceConfigurationClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetExtensionProfileClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetHardwareProfileClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetKeyedInPriceClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetKeyedInQuantityClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetLoggedOnEmployeeClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetNotificationsRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetOfflinePendingTransactionCountClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetOrgUnitConfigurationClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetOrgUnitTenderTypesClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetReasonCodeLinesClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetReportParametersClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetReceiptEmailAddressClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetReceiptsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetSalesOrderDetailsByTransactionIdClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetSalesOrdersWithNoFiscalTransactionsRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetScanResultClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetSessionInfoClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CashManagement.GetStartingAmountClientRequestHandler, function () { return _this._context; });
            compositionLoader.addRequestHandler(Commerce.GetTenderDetailsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.HandleCartVersionErrorClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.PrintDeclinedOrVoidedCardReceiptsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.PrintReceiptInputClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.PrintReceiptsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetCurrentShiftClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.IssueCreditMemoClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.RefreshNotificationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.RegisterCustomAuditEventClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.RegisterPrintReceiptCopyEventRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SalesOrders.GetGiftReceiptsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SalesOrders.GetAttributeGroupDetailsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SalesOrders.SelectCustomerOrderTypeClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SalesOrders.PickUpCustomerOrderLinesClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SalesOrders.GetCancellationChargeClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SaveFiscalTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SelectAllowedRefundOptionInputClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SelectLinkedRefundInputClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ShowQuestionDialogClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.StoreOperations.GetEnvironmentConfigurationServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.StoreOperations.GetFeatureStatesServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.StoreOperations.GetPickingAndReceivingOrdersClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.StoreOperations.GetAllDiscountsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SyncAllStockCountJournalsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SelectSalesLinesForPickUpClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TenderCounting.CreateAdvancedTenderCountingTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TenderCounting.CreateBankDropTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TenderCounting.CreateSafeDropTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TenderCounting.CreateShiftSafeDropTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TenderCounting.CreateTenderDeclarationTransactionClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TenderCounting.GetCountedTenderDetailAmounClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TenderCounting.GetTenderTypeForSalesTransactionsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Customers.SelectCustomerClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SelectPackingSlipIdClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SelectZipCodeInfoClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.InvalidShiftErrorHandlingClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ValidateCashDrawerLimitClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.IssueLoyaltyCardServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetAddressPurposesServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SendReceiptServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.LoadFeatureRequestHandlersClientRequestHandler, function () {
                return {
                    compositionLoader: compositionLoader,
                    handlerContext: _this._context
                };
            });
            compositionLoader.addRequestHandler(Commerce.AddTenderLineToCartClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Cart.AddInvoicedSalesLinesToCartServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Cart.RecallSalesInvoiceServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CheckoutCartClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetCurrentCartClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.RefreshCartClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ResumeSuspendedCartClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SetCartAttributesClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SaveAttributesOnCartClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SaveAttributesOnCartLinesClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SaveExtensionPropertiesOnCartClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SaveExtensionPropertiesOnCartLinesClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SaveReasonCodeLinesOnCartClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SaveReasonCodeLinesOnCartLinesClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.AddAffiliationOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.AddCouponsOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.AddExpenseAccountLineToCartOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.AddItemToCartOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.AddLoyaltyCardToCartOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.BankDropOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.CalculateTotalOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.CarryoutSelectedProductsOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.ChangeCartLineUnitOfMeasureOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.CloseShiftOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.CreateCustomerOrderOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.CreateCustomerQuoteOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.CustomerAccountDepositOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.DeclareStartAmountOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.DepositOverrideOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.EditCustomerOrderOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.GetRecommendedProductsRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.InventoryLookupOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.IssueLoyaltyCardOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.LineDiscountAmountOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.LineDiscountPercentOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.LockRegisterOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.LoyaltyCardPointsBalanceOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.OverrideLineTaxFromListOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.OverrideLineTaxOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.OverrideTransactionTaxOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.PickupAllOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.PriceOverrideOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.RecalculateChargesOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.ReturnTransactionOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.SafeDropOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.SearchByCriteriaProductsRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.SetCartLineCommentOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.SetCartLineQuantityOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.SetCustomerOnCartOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.SetTransactionCommentOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Cart.ShipAllCartLinesOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Cart.ShipSelectedCartLinesOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.SuspendCurrentCartOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.TenderDeclarationOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.TenderRemovalOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.TotalDiscountAmountOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.TotalDiscountPercentOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.VoidCartLineOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.VoidTenderLineOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.VoidTransactionOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.ReturnItemOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.ReturnCartLineOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.HealthCheckOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetPickupDateClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetShippingChargeClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetShippingDateClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetStoreCustomerClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetTransferOrderHeaderClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.OverrideHeaderChargeClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.OverrideLineChargeClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ShowAlphanumericInputDialogClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ShowChangeDueClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ShowListInputDialogClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ShowMessageDialogClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ShowPresetButtonMessageDialogClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ShowNumericInputDialogClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.ShowTextInputDialogClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetStoreEmployeeClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TaskManagement.EditChecklistTaskClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TaskManagement.GetStoreTasklistClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TaskManagement.GetTasksFilterClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.TaskManagement.GetTasksStatusClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Authentication.LogOnRequestHandler, function () { return _this._context; });
            compositionLoader.addRequestHandler(Commerce.Authentication.LogOffClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.LogOffOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Authentication.UnlockTerminalClientRequestHandler);
            compositionLoader.addRequestInterceptor(Commerce.Authentication.UnlockTerminalClientRequest, new Commerce.Authentication.Interceptors.UnlockTerminalClientRequestTriggerInterceptor());
            compositionLoader.addRequestHandler(Commerce.Customers.GetContactInfoAndUpdateCustomerClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Fulfillment.GetFulfillmentLinesServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetFulfillmentLineQuantityDialogClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.PrintPackingSlipClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Fulfillment.GetFulfillmentLineContextualOperationsMapsRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.CancelInventoryDocumentClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.CreateOrUpdateInventoryDocumentHeaderClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.CommitInventoryDocumentClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.DeleteInventoryDocumentLineClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.GetInventoryDocumentLineQuantityClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.GetInventoryDocumentProductWithLocationAndQuantityClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.GetInventoryDocumentSerialNumberClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.PromptToRegisterInventoryDocumentSerialNumberClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.PauseInventoryDocumentClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.ResetInventoryDocumentSerialNumberLineClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.ResumeInventoryDocumentClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.SelectInventoryDocumentLineWarehouseLocationClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.SelectInventoryDocumentWarehouseClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.ShowInventoryDocumentAsyncFeedbackClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.ShowInventoryDocumentHeaderClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.StartInventoryDocumentClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.UpdateInventoryDocumentSerialNumberLineClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.UpdateInventoryDocumentWorkingTerminalClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Inventory.ValidateInventoryDocumentClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CardPaymentAuthorizePaymentRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CardPaymentAuthorizeCardTokenPeripheralRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CardPaymentBeginTransactionRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CardPaymentCapturePaymentRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CardPaymentEndTransactionRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CardPaymentExecuteTaskRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CardPaymentEnquireGiftCardBalancePeripheralRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CardPaymentRefundPaymentRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CardPaymentVoidPaymentRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CardPaymentRefundCaptureTokenPeripheralRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CashDrawerIsOpenRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.CashDrawerOpenRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.GetActiveHardwareStationClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.HardwareStation.ClearPaymentTransactionReferenceDataClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.HardwareStation.GetPaymentTransactionReferenceDataClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.HardwareStation.HardwareStationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.HardwareStation.IsHardwareStationActiveClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.HardwareStation.IsLocalHardwareStationSupportedClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.HardwareStation.IsPaymentTerminalAvailableClientRequestHandler, function () { return _this._context; });
            compositionLoader.addRequestHandler(Commerce.Peripherals.HardwareStation.SetPaymentTransactionReferenceDataClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.HardwareStationDeviceActionRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.HardwareStationStatusRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.LineDisplayDisplayLinesRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalActivateGiftCardPeripheralRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalAuthorizePaymentActivityRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalAuthorizePaymentRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalBeginTransactionRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalCancelOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalCapturePaymentRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalEndTransactionRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalExecuteTaskRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalFetchTokenPeripheralRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalRefundPaymentActivityRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalRefundPaymentRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalUpdateLinesRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalVoidPaymentRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PrinterPrintRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.ScaleReadRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.BarcodeScannerOpenRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.BarcodeScannerGetBarcodesRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.BarcodeScannerCloseRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.MagneticStripeReaderOpenRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.MagneticStripeReaderGetMsrSwipeRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.MagneticStripeReaderCloseRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalGetTransactionReferenceIdRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalGetTransactionByTransactionReferenceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.PaymentTerminalObtainLockRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Peripherals.InitializeHardwareStationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Products.CalculateProductPriceServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Products.GetActivePricesServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Products.GetCurrentProductCatalogStoreClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Products.GetProductsByIdsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Products.GetRefinerValuesByTextServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Products.GetSerialNumberClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Products.SelectProductClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Products.SelectProductVariantClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Products.SwitchProductCatalogClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Refiners.GetRefinerValuesClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SalesOrders.MarkAsPickedServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SalesOrders.ReturnInvoicedSalesLinesClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SalesOrders.GetSalesOrderDetailsBySalesIdServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SalesOrders.SearchSalesTransactionsByReceiptIdServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Categories.GetCategoriesServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CreateCustomerServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CreateEmptyCartServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CreateNonSalesTransactionServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Payments.Handlers.GetCardPaymentAcceptPointServiceRequestHandler, function () { return _this._context; });
            compositionLoader.addRequestHandler(Commerce.GetCommissionSalesGroupsServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetCurrenciesServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetTaxOverridesServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.RecallOrderServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.SearchCommissionSalesGroupsServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Reports.GetSrsReportDataSetServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.UpdateCustomerServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.StoreOperations.GetTillLayoutProxyClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.StoreOperations.GetVisualProfileServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.StoreOperations.Handlers.InputShiftTenderLineNoteClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.StoreOperations.Handlers.OverrideShiftTenderLineAmountClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.StoreOperations.Handlers.ReviewShiftTenderLinesWarningClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.StoreOperations.CloseShiftServiceRequestHandler, function () { return _this._context; });
            compositionLoader.addRequestHandler(Commerce.FiscalIntegration.Handlers.BackupFiscalRegistrationProcessContextDataServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.FiscalIntegration.Handlers.InitializeFiscalPeripheralsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.FiscalIntegration.Handlers.FiscalRegisterIsReadyClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.FiscalIntegration.Handlers.FiscalRegisterSubmitDocumentClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.FiscalIntegration.Handlers.GetBackupFiscalRegistrationProcessContextDataRequestHandler);
            compositionLoader.addRequestHandler(Commerce.FiscalIntegration.Handlers.GetFiscalIntegrationRegistrationProcessServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.FiscalIntegration.Handlers.GetTechnicalProfilesByFunctionalityGroupIdsRequestHandler);
            compositionLoader.addRequestHandler(Commerce.FiscalIntegration.Handlers.RecoverLastSequentialSignaturesRequestHandler);
            compositionLoader.addRequestHandler(Commerce.FiscalIntegration.Handlers.StartFiscalAuditEventQueueClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.FiscalIntegration.Handlers.RegisterFiscalEventClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CustomerSatisfaction.CustomerSatisfactionCancelRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CustomerSatisfaction.CustomerSatisfactionCheckDisplayRequestHandler);
            compositionLoader.addRequestHandler(Commerce.CustomerSatisfaction.CustomerSatisfactionSurveyRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Timeline.CreateTimelineItemClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Timeline.EditTimelineItemClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Timeline.ViewTimelineItemClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.HealthCheck.Handlers.HealthCheckDiscoveryClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.HealthCheck.Handlers.HealthCheckClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.GetWarrantyAssociationsClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.BuyWarrantyOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.AddWarrantyToAnExistingTransactionOperationRequestHandler);
            compositionLoader.addRequestInterceptor(Commerce.PaymentTerminalAuthorizePaymentRequest, new Commerce.Operations.Interceptors.DisableAutoLogOffDuringExecutionInterceptor());
            compositionLoader.addRequestInterceptor(Commerce.PaymentTerminalCapturePaymentRequest, new Commerce.Operations.Interceptors.DisableAutoLogOffDuringExecutionInterceptor());
            compositionLoader.addRequestInterceptor(Commerce.PaymentTerminalEnquireGiftCardBalancePeripheralRequest, new Commerce.Operations.Interceptors.DisableAutoLogOffDuringExecutionInterceptor());
            compositionLoader.addRequestInterceptor(Commerce.PaymentTerminalRefundPaymentRequest, new Commerce.Operations.Interceptors.DisableAutoLogOffDuringExecutionInterceptor());
            compositionLoader.addRequestInterceptor(Commerce.PaymentTerminalVoidPaymentRequest, new Commerce.Operations.Interceptors.DisableAutoLogOffDuringExecutionInterceptor());
            compositionLoader.addRequestInterceptor(Commerce.Authentication.LogOnRequest, new Commerce.FiscalIntegration.Interceptors.InitializeFiscalPeripheralsRequestInterceptor());
            compositionLoader.addRequestInterceptor(Commerce.CashDrawerOpenRequest, new Commerce.Peripherals.CashDrawerOpenRequestInterceptor());
            compositionLoader.addRequestInterceptor(Commerce.Cart.CreateOrUpdateCartServiceRequestBase, new Commerce.Cart.UpdateTransactionContextRequestInterceptor());
            compositionLoader.addRequestHandlerInterceptor(Commerce.OperationRequest, new Commerce.Operations.Interceptors.ManagerOverrideOperationRequestHandlerInterceptor());
        };
        return PosCommonRuntimeInitializer;
    }());
    Pos.PosCommonRuntimeInitializer = PosCommonRuntimeInitializer;
})(Pos || (Pos = {}));
var Commerce;
(function (Commerce) {
    var Controls;
    (function (Controls) {
        var ContentHost;
        (function (ContentHost_1) {
            var ContentHost = (function (_super) {
                __extends(ContentHost, _super);
                function ContentHost(options) {
                    var _this = _super.call(this) || this;
                    _this._createNavigator = options.createNavigator;
                    _this._supportLegacyExtensionViews = options.supportLegacyExtensionViews;
                    _this._currentView = ko.observable(null);
                    _this._orientation = ko.observable(null);
                    _this._focusManager = new Controls.FocusManager();
                    _this.isBusy = _this._getIsBusyComputed();
                    _this.isHeaderVisible = _this._getIsHeaderVisible();
                    _this.isSideBarVisible = _this._getIsSideBarVisible();
                    _this.headerTitle = _this._getHeaderTitleComputed();
                    _this.canNavigateBack = _this._getCanNavigateBackComputed();
                    _this.isHeaderContentVisible = _this._getIsHeaderContentVisibleComputed();
                    _this.isSideBarContentVisible = _this._getIsSideBarContentVisibleComputed();
                    _this.shouldPreventInteraction = _this._getShouldPreventInteractionComputed();
                    _this.searchText = ko.observable(Commerce.StringExtensions.EMPTY);
                    _this.searchType = ko.observable(Commerce.Client.Entities.HeaderSearchType.Product);
                    _this.addEventListener("ViewChanged", function (eventData) {
                        _this._syncSearchTextAndSearchTypeWithCurrentView();
                    });
                    _this.setFocusOnSearchText = ko.observable(false);
                    _this.addEventListener("ViewChanged", function (eventData) {
                        _this._handleWaitingForSearchEventFromCurrentView();
                    });
                    _this._enabledSearchTypes = _this._getEnabledSearchTypesComputed();
                    _this.isCustomerSearchTypeDisabled = ko.computed(function () {
                        return !Commerce.ArrayExtensions.hasElement(_this._enabledSearchTypes(), Commerce.Client.Entities.HeaderSearchType.Customer);
                    });
                    _this.isProductSearchTypeDisabled = ko.computed(function () {
                        return !Commerce.ArrayExtensions.hasElement(_this._enabledSearchTypes(), Commerce.Client.Entities.HeaderSearchType.Product);
                    });
                    _this.enableSearchByFieldCriteria = _this._getEnableSearchByFieldCriteriaComputed();
                    _this._appBarManager = new AppBarManager();
                    _this.addEventListener("ViewChanged", function (eventData) {
                        var newAppBarCommands = [];
                        var currentView = _this._currentView();
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(currentView)
                            && !Commerce.ObjectExtensions.isNullOrUndefined(currentView.controller)
                            && !Commerce.ObjectExtensions.isNullOrUndefined(currentView.controller.viewModel)) {
                            var currentViewModel = currentView.controller.viewModel;
                            if (ContentHost._implementsICommandHostViewModel(currentViewModel)) {
                                if (Commerce.ArrayExtensions.hasElements(currentViewModel.commands)) {
                                    newAppBarCommands = currentViewModel.commands;
                                }
                            }
                        }
                        _this._appBarManager.update(newAppBarCommands);
                    });
                    return _this;
                }
                ContentHost.prototype.dispose = function () {
                    this._isBusySubscription.dispose();
                    this._isBusySubscription = null;
                    _super.prototype.dispose.call(this);
                };
                ContentHost.prototype.render = function (rootElement) {
                    var _this = this;
                    var contentHostTemplateRoot = document.createElement("div");
                    contentHostTemplateRoot.className = "width100Percent height100Percent";
                    rootElement.appendChild(contentHostTemplateRoot);
                    ko.applyBindingsToNode(contentHostTemplateRoot, {
                        template: {
                            name: "contentHostTemplate",
                            data: this
                        }
                    });
                    var viewHostElement = $(contentHostTemplateRoot).find(".viewHost").get(0);
                    var navigator = this._createNavigator(viewHostElement);
                    navigator.eventManager.addEventListener("CurrentViewChanged", function (eventData) {
                        _this._focusManager.clearFocusHistory();
                        _this.setFocusOnSearchText(false);
                        _this._currentView(eventData.currentView);
                        var currentViewElement = Commerce.ObjectExtensions.isNullOrUndefined(_this._currentView()) ? null : _this._currentView().element;
                        _this._raiseEvent("ViewChanged", { viewElement: currentViewElement });
                    });
                    Commerce.EventProxy.Instance.addCustomEventHandler(rootElement, "OrientationChangedEvent", function (orientation) {
                        _this._orientation(orientation);
                    });
                    var viewLoaderElement = $(contentHostTemplateRoot).find(".viewLoader").get(0);
                    this._isBusySubscription = this.isBusy.subscribe(function (newIsBusy) {
                        if (newIsBusy) {
                            _this._focusManager.stealFocus(viewLoaderElement, _this.isBusy);
                        }
                        else {
                            _this._focusManager.returnFocus();
                        }
                    });
                    var appBarParentElement = $(contentHostTemplateRoot).find("#sharedAppBarHost").get(0);
                    this._appBarManager.render(appBarParentElement);
                };
                ContentHost.prototype.addViewChangedEventHandler = function (eventHandler) {
                    this.addEventListener("ViewChanged", eventHandler);
                };
                ContentHost.prototype.removeViewChangedEventHandler = function (eventHandler) {
                    this.removeEventListener("ViewChanged", eventHandler);
                };
                ContentHost.prototype.onSearch = function (searchText, searchType, correlationId) {
                    var view = this._currentView();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(view)
                        && !Commerce.ObjectExtensions.isNullOrUndefined(view.controller)
                        && ContentHost._implementsISearchableViewController(view.controller)) {
                        this.setFocusOnSearchText(false);
                        view.controller.search.onSearch(searchText, searchType, correlationId);
                    }
                };
                ContentHost.prototype.onSearchByFieldCriteria = function (searchByFieldCriteria, correlationId) {
                    var view = this._currentView();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(view)
                        && !Commerce.ObjectExtensions.isNullOrUndefined(view.controller)
                        && ContentHost._implementsISearchableViewController(view.controller)) {
                        view.controller.search.onSearchByFieldCriteria(searchByFieldCriteria, correlationId);
                    }
                };
                ContentHost._implementsISearchableViewController = function (viewController) {
                    return viewController.implementsISearchableViewController;
                };
                ContentHost._implementsIPreventInteractionViewController = function (viewController) {
                    return viewController.implementsIPreventInteractionViewController;
                };
                ContentHost._implementsICommandHostViewModel = function (viewModel) {
                    return viewModel.implementsICommandHostViewModel === true;
                };
                ContentHost.prototype._getIsBusyComputed = function () {
                    var _this = this;
                    return ko.computed(function () {
                        var view = _this._currentView();
                        if (Commerce.ObjectExtensions.isNullOrUndefined(view)
                            || Commerce.ObjectExtensions.isNullOrUndefined(view.controller)) {
                            return false;
                        }
                        else if (_this._isLegacyViewController(view.controller)) {
                            var viewLoaderBindingElement = $(view.element).find(".POS_SDK_LOADER_MARKER");
                            if (viewLoaderBindingElement.length > 0) {
                                var visible = viewLoaderBindingElement.first().data("visible");
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(visible) && ko.isObservable(visible)) {
                                    return visible();
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                return false;
                            }
                        }
                        else if (!Commerce.ObjectExtensions.isNullOrUndefined(view.controller.config)
                            && view.controller.config.disableLoader) {
                            return false;
                        }
                        else if (Commerce.ObjectExtensions.isNullOrUndefined(view.controller.viewModel)
                            || Commerce.ObjectExtensions.isNullOrUndefined(view.controller.viewModel.isBusy)) {
                            return false;
                        }
                        else {
                            return view.controller.viewModel.isBusy();
                        }
                    });
                };
                ContentHost.prototype._getIsHeaderVisible = function () {
                    var _this = this;
                    return ko.computed(function () {
                        var view = _this._currentView();
                        if (Commerce.ObjectExtensions.isNullOrUndefined(view)
                            || Commerce.ObjectExtensions.isNullOrUndefined(view.controller)) {
                            return false;
                        }
                        else if (_this._isLegacyViewController(view.controller)) {
                            var viewContainsHeaderSplitViewBinding = $(view.element).find(".POS_SDK_HEADER_SPLIT_VIEW_MARKER").length > 0;
                            return viewContainsHeaderSplitViewBinding;
                        }
                        else if (!Commerce.ObjectExtensions.isNullOrUndefined(view.controller.config)
                            && !Commerce.ObjectExtensions.isNullOrUndefined(view.controller.config.header)
                            && view.controller.config.header.disable) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    });
                };
                ContentHost.prototype._getIsSideBarVisible = function () {
                    var _this = this;
                    return ko.computed(function () {
                        var view = _this._currentView();
                        if (Commerce.ObjectExtensions.isNullOrUndefined(view)
                            || Commerce.ObjectExtensions.isNullOrUndefined(view.controller)) {
                            return false;
                        }
                        else if (_this._isLegacyViewController(view.controller)) {
                            var viewContainsHeaderSplitViewBinding = $(view.element).find(".POS_SDK_HEADER_SPLIT_VIEW_MARKER").length > 0;
                            return viewContainsHeaderSplitViewBinding;
                        }
                        else if (!Commerce.ObjectExtensions.isNullOrUndefined(view.controller.config)
                            && !Commerce.ObjectExtensions.isNullOrUndefined(view.controller.config.sideBar)
                            && view.controller.config.sideBar.disable) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    });
                };
                ContentHost.prototype._getHeaderTitleComputed = function () {
                    var _this = this;
                    return ko.computed(function () {
                        var view = _this._currentView();
                        if (Commerce.ObjectExtensions.isNullOrUndefined(view)
                            || Commerce.ObjectExtensions.isNullOrUndefined(view.controller)) {
                            return Commerce.StringExtensions.EMPTY;
                        }
                        else if (_this._isLegacyViewController(view.controller)) {
                            var viewHeaderSplitViewBindingElement = $(view.element).find(".POS_SDK_HEADER_SPLIT_VIEW_MARKER");
                            if (viewHeaderSplitViewBindingElement.length > 0) {
                                var title = viewHeaderSplitViewBindingElement.first().data("title");
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(title) && ko.isObservable(title)) {
                                    return title();
                                }
                                else {
                                    return Commerce.StringExtensions.EMPTY;
                                }
                            }
                            else {
                                return Commerce.StringExtensions.EMPTY;
                            }
                        }
                        else if (!Commerce.ObjectExtensions.isNullOrUndefined(view.controller.config)
                            && !Commerce.ObjectExtensions.isNullOrUndefined(view.controller.config.header)
                            && view.controller.config.header.disable) {
                            return Commerce.StringExtensions.EMPTY;
                        }
                        else if (Commerce.ObjectExtensions.isNullOrUndefined(view.controller.title)
                            || Commerce.StringExtensions.isNullOrWhitespace(view.controller.title())) {
                            return Commerce.StringExtensions.EMPTY;
                        }
                        else {
                            return view.controller.title();
                        }
                    });
                };
                ContentHost.prototype._isLegacyViewController = function (viewController) {
                    if (!this._supportLegacyExtensionViews) {
                        return false;
                    }
                    return (viewController instanceof Commerce.Extensibility.DisposableViewControllerBase) &&
                        !(viewController instanceof Commerce.ViewControllers.ViewControllerBase);
                };
                ContentHost.prototype._getCanNavigateBackComputed = function () {
                    var _this = this;
                    return ko.computed(function () {
                        var view = _this._currentView();
                        if (Commerce.ObjectExtensions.isNullOrUndefined(view)
                            || Commerce.ObjectExtensions.isNullOrUndefined(view.controller)) {
                            return false;
                        }
                        else {
                            return view.controller.isBackNavigationEnabled;
                        }
                    });
                };
                ContentHost.prototype._getIsHeaderContentVisibleComputed = function () {
                    var _this = this;
                    return ko.computed(function () {
                        var _a, _b;
                        var view = _this._currentView();
                        if (Commerce.ObjectExtensions.isNullOrUndefined(view)
                            || Commerce.ObjectExtensions.isNullOrUndefined(view.controller)) {
                            return false;
                        }
                        else {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined((_b = (_a = view.controller.config) === null || _a === void 0 ? void 0 : _a.header) === null || _b === void 0 ? void 0 : _b.showContent)) {
                                return view.controller.config.header.showContent;
                            }
                            return true;
                        }
                    });
                };
                ContentHost.prototype._getIsSideBarContentVisibleComputed = function () {
                    var _this = this;
                    return ko.computed(function () {
                        var _a;
                        var view = _this._currentView();
                        if (Commerce.ObjectExtensions.isNullOrUndefined(view)
                            || Commerce.ObjectExtensions.isNullOrUndefined(view.controller)) {
                            return true;
                        }
                        else {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined((_a = view.controller.config) === null || _a === void 0 ? void 0 : _a.sideBar)) {
                                if (Commerce.ObjectExtensions.isNullOrUndefined(_this._orientation())
                                    && !Commerce.ObjectExtensions.isNullOrUndefined(Commerce.ApplicationContext.Instance.tillLayoutProxy)) {
                                    _this._orientation(Commerce.ApplicationContext.Instance.tillLayoutProxy.orientation);
                                }
                                if (_this._orientation() === Commerce.Proxy.Entities.Orientation.PORTRAIT &&
                                    !Commerce.ObjectExtensions.isNullOrUndefined(view.controller.config.sideBar.showContentPortrait)) {
                                    return view.controller.config.sideBar.showContentPortrait;
                                }
                                else if (_this._orientation() === Commerce.Proxy.Entities.Orientation.LANDSCAPE &&
                                    !Commerce.ObjectExtensions.isNullOrUndefined(view.controller.config.sideBar.showContentLandscape)) {
                                    return view.controller.config.sideBar.showContentLandscape;
                                }
                            }
                            return true;
                        }
                    });
                };
                ContentHost.prototype._getShouldPreventInteractionComputed = function () {
                    var _this = this;
                    return ko.computed(function () {
                        var view = _this._currentView();
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(view)
                            && !Commerce.ObjectExtensions.isNullOrUndefined(view.controller)
                            && ContentHost._implementsIPreventInteractionViewController(view.controller)) {
                            return view.controller.preventInteraction();
                        }
                        else {
                            return false;
                        }
                    });
                };
                ContentHost.prototype._getEnabledSearchTypesComputed = function () {
                    var _this = this;
                    return ko.computed(function () {
                        var view = _this._currentView();
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(view)
                            && !Commerce.ObjectExtensions.isNullOrUndefined(view.controller)
                            && ContentHost._implementsISearchableViewController(view.controller)) {
                            return view.controller.search.enabledSearchTypes;
                        }
                        else {
                            return [Commerce.Client.Entities.HeaderSearchType.Customer, Commerce.Client.Entities.HeaderSearchType.Product];
                        }
                    });
                };
                ContentHost.prototype._getEnableSearchByFieldCriteriaComputed = function () {
                    var _this = this;
                    return ko.computed(function () {
                        var view = _this._currentView();
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(view)
                            && !Commerce.ObjectExtensions.isNullOrUndefined(view.controller)
                            && ContentHost._implementsISearchableViewController(view.controller)) {
                            return view.controller.search.enableSearchByFieldCriteria();
                        }
                        else {
                            return true;
                        }
                    });
                };
                ContentHost.prototype._syncSearchTextAndSearchTypeWithCurrentView = function () {
                    var _this = this;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(this._syncSearchTextAndSearchTypeWithCurrentViewSubscription)) {
                        this._syncSearchTextAndSearchTypeWithCurrentViewSubscription.dispose();
                        this._syncSearchTextAndSearchTypeWithCurrentViewSubscription = null;
                    }
                    var view = this._currentView();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(view)
                        && !Commerce.ObjectExtensions.isNullOrUndefined(view.controller)
                        && ContentHost._implementsISearchableViewController(view.controller)) {
                        var viewSearchText_1 = view.controller.search.searchText;
                        this.searchText(Commerce.StringExtensions.isNullOrWhitespace(viewSearchText_1()) ? Commerce.StringExtensions.EMPTY : viewSearchText_1());
                        var viewSearchTextSubscription_1 = viewSearchText_1.subscribe(function (newViewSearchText) {
                            _this.searchText(Commerce.StringExtensions.isNullOrWhitespace(newViewSearchText) ? Commerce.StringExtensions.EMPTY : newViewSearchText);
                        });
                        var searchTextSubscription_1 = this.searchText.subscribe(function (newSearchText) {
                            viewSearchText_1(newSearchText);
                        });
                        var viewSearchType_1 = view.controller.search.searchType;
                        this.searchType(Commerce.ObjectExtensions.isNullOrUndefined(viewSearchType_1()) ? Commerce.Client.Entities.HeaderSearchType.Product : viewSearchType_1());
                        var viewSearchTypeSubscription_1 = viewSearchType_1.subscribe(function (newViewSearchType) {
                            _this.searchType(newViewSearchType);
                        });
                        var searchTypeSubscription_1 = this.searchType.subscribe(function (newSearchType) {
                            viewSearchType_1(newSearchType);
                        });
                        this._syncSearchTextAndSearchTypeWithCurrentViewSubscription = {
                            dispose: function () {
                                viewSearchTextSubscription_1.dispose();
                                searchTextSubscription_1.dispose();
                                viewSearchTypeSubscription_1.dispose();
                                searchTypeSubscription_1.dispose();
                            }
                        };
                    }
                    else {
                        this.searchText(Commerce.StringExtensions.EMPTY);
                        this.searchType(Commerce.Client.Entities.HeaderSearchType.Product);
                    }
                };
                ContentHost.prototype._handleWaitingForSearchEventFromCurrentView = function () {
                    var _this = this;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(this._handleWaitingForSearchEventFromCurrentViewSubscription)) {
                        this._handleWaitingForSearchEventFromCurrentViewSubscription.dispose();
                        this._handleWaitingForSearchEventFromCurrentViewSubscription = null;
                    }
                    var view = this._currentView();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(view)
                        && !Commerce.ObjectExtensions.isNullOrUndefined(view.controller)
                        && ContentHost._implementsISearchableViewController(view.controller)) {
                        var waitingForSearchEventListener_1 = function () {
                            _this.setFocusOnSearchText(true);
                        };
                        view.controller.search.eventManager.addEventListener("WaitingForSearch", waitingForSearchEventListener_1);
                        this._handleWaitingForSearchEventFromCurrentViewSubscription = {
                            dispose: function () {
                                if (ContentHost._implementsISearchableViewController(view.controller)) {
                                    view.controller.search.eventManager.removeEventListener("WaitingForSearch", waitingForSearchEventListener_1);
                                }
                            }
                        };
                    }
                };
                return ContentHost;
            }(Controls.ControlBase));
            ContentHost_1.ContentHost = ContentHost;
            var AppBarCommand = (function () {
                function AppBarCommand(options) {
                    var _this = this;
                    this._appBarCommand = new WinJS.UI.AppBarCommand(options.element);
                    var menu = null;
                    var contextualActionById = new Commerce.Dictionary();
                    $(options.element).addClass("AppBarCommand");
                    this._appBarCommand.onclick = function (eventArgs) {
                        if (!options.viewModel.canExecute) {
                            return;
                        }
                        var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                        if (Commerce.ObjectExtensions.isNullOrUndefined(menu) && Commerce.ArrayExtensions.hasElements(options.viewModel.contextualActions)) {
                            var hostElement = options.element.parentElement.parentElement;
                            var MENU_COMMAND_ID_PREFIX_1 = options.viewModel.id + "_";
                            var menuCommands = options.viewModel.contextualActions.map(function (action) {
                                var command = {
                                    id: MENU_COMMAND_ID_PREFIX_1 + action.id,
                                    label: action.label,
                                    canExecute: action.canExecute
                                };
                                contextualActionById.setItem(command.id, action);
                                return command;
                            });
                            var menuOptions = {
                                directionalHint: Commerce.Extensibility.DirectionalHint.TopLeftEdge,
                                type: "button",
                                commands: menuCommands
                            };
                            var controlFactory = new Controls.ControlFactory();
                            menu = controlFactory.create(correlationId, "Menu", menuOptions, hostElement);
                            menu.addEventListener("CommandInvoked", function (data) {
                                var args = {
                                    correlationId: correlationId,
                                    actionId: data.id.substring(MENU_COMMAND_ID_PREFIX_1.length)
                                };
                                options.viewModel.execute(args);
                            });
                        }
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(menu)) {
                            menu.menuCommands.forEach(function (command) {
                                command.canExecute = contextualActionById.getItem(command.id).canExecute;
                            });
                            menu.show(eventArgs.currentTarget);
                        }
                        else {
                            var args = {
                                correlationId: correlationId
                            };
                            options.viewModel.execute(args);
                        }
                    };
                    this._appBarCommand.extraClass = options.viewModel.extraClass;
                    this._appBarCommand.id = options.viewModel.id;
                    this._appBarCommand.disabled = !options.viewModel.canExecute;
                    this._appBarCommand.label = options.viewModel.label;
                    this._appBarCommand.hidden = !options.viewModel.isVisible;
                    $(this._appBarCommand.element).attr("aria-disabled", this._appBarCommand.disabled ? "true" : "false");
                    this._canExecuteChangedSubscription = options.viewModel.addMessageHandler("CanExecuteChanged", function (newValue) {
                        _this._appBarCommand.disabled = !newValue;
                        $(_this._appBarCommand.element).attr("aria-disabled", _this._appBarCommand.disabled ? "true" : "false");
                    });
                    this._isVisibleSubscription = options.viewModel.addMessageHandler("VisibilityChanged", function (isVisible) {
                        _this._appBarCommand.hidden = !isVisible;
                        options.onVisibilityChanged();
                    });
                    Commerce.BubbleHelper.addAttribute(options.element, options.viewModel.id);
                }
                AppBarCommand.prototype.dispose = function () {
                    Commerce.ObjectExtensions.tryDispose(this._canExecuteChangedSubscription);
                    Commerce.ObjectExtensions.tryDispose(this._isVisibleSubscription);
                    Commerce.ObjectExtensions.tryDispose(this._appBarCommand);
                    Commerce.ObjectExtensions.disposeAllProperties(this);
                };
                Object.defineProperty(AppBarCommand.prototype, "isVisible", {
                    get: function () {
                        return !this._appBarCommand.hidden;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppBarCommand.prototype, "appBarCommand", {
                    get: function () {
                        return this._appBarCommand;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppBarCommand.prototype, "height", {
                    get: function () {
                        if (this.isVisible) {
                            return $(this._appBarCommand.element).height();
                        }
                        else {
                            return 0;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return AppBarCommand;
            }());
            var AppBar = (function () {
                function AppBar(options) {
                    var _this = this;
                    this._element = options.element;
                    this._onHeightChanged = options.onHeightChanged;
                    var $element = $(this._element);
                    $element.addClass("AppBar appBarBackgroundColor dynamicsSymbolFont");
                    $element.css("position", "fixed");
                    $element.css("bottom", 0);
                    $element.css("right", 0);
                    $element.css("left", 0);
                    if (Commerce.ArrayExtensions.hasElements(options.commands)) {
                        this._appBarCommands = options.commands.map(function (vm) {
                            var buttonElement = document.createElement("button");
                            if (_this._element.firstElementChild) {
                                _this._element.firstElementChild.insertAdjacentElement("beforebegin", buttonElement);
                            }
                            else {
                                _this._element.appendChild(buttonElement);
                            }
                            return new AppBarCommand({ element: buttonElement, viewModel: vm, onVisibilityChanged: _this._updateVisibleCommands.bind(_this) });
                        });
                    }
                    this._winJsAppBar = new WinJS.UI.AppBar(this._element, {});
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(Commerce.ApplicationContext.Instance.deviceConfiguration)
                        && Commerce.ApplicationContext.Instance.deviceConfiguration.ShowAppBarLabel) {
                        this._winJsAppBar.closedDisplayMode = "full";
                    }
                    var $overflowButton = $element.find(".win-appbar-overflowbutton");
                    $overflowButton.click(function (e) {
                        e.preventDefault();
                        $overflowButton.attr("aria-expanded", $overflowButton.attr("aria-expanded") === "true" ? "false" : "true");
                    });
                    $overflowButton.focusin(function (e) {
                        $overflowButton.attr("aria-expanded", $element.hasClass("win-appbar-opened") ? "true" : "false");
                    });
                    $overflowButton.focusout(function (e) {
                        $overflowButton.attr("aria-expanded", $element.hasClass("win-appbar-opened") ? "true" : "false");
                    });
                    $overflowButton.attr("aria-label", Commerce.ViewModelAdapter.getResourceString("string_1700"));
                    $overflowButton.attr("aria-expanded", "false");
                    $overflowButton.attr("title", Commerce.ViewModelAdapter.getResourceString("string_1700"));
                    this._updateVisibleCommands();
                }
                Object.defineProperty(AppBar.prototype, "element", {
                    get: function () {
                        return this._element;
                    },
                    enumerable: true,
                    configurable: true
                });
                AppBar.prototype.dispose = function () {
                    Commerce.ObjectExtensions.disposeAllProperties(this);
                };
                AppBar.prototype._updateVisibleCommands = function () {
                    var visibleAppBarCommands = this._appBarCommands.filter(function (commandAdapter) {
                        return commandAdapter.isVisible;
                    }).map(function (command) {
                        return command.appBarCommand;
                    });
                    this._winJsAppBar.showOnlyCommands(visibleAppBarCommands);
                    this._winJsAppBar.forceLayout();
                    this._updateHeight();
                };
                AppBar.prototype._updateHeight = function () {
                    var calculatedHeight = this._calculateHeight();
                    if (calculatedHeight !== this._height) {
                        this._height = calculatedHeight;
                        this._onHeightChanged(this._height);
                    }
                };
                AppBar.prototype._calculateHeight = function () {
                    var PIXELS_INTERVAL = 4;
                    var appBarHeight = 0;
                    this._appBarCommands.forEach(function (command) {
                        if (command.height > appBarHeight) {
                            appBarHeight = command.height;
                        }
                    });
                    if (appBarHeight % PIXELS_INTERVAL > 0) {
                        appBarHeight += PIXELS_INTERVAL - appBarHeight % PIXELS_INTERVAL;
                    }
                    return appBarHeight;
                };
                return AppBar;
            }());
            var AppBarManager = (function () {
                function AppBarManager() {
                    this._currentHeightClass = Commerce.StringExtensions.EMPTY;
                }
                AppBarManager.prototype.render = function (element) {
                    this._appBarHostElement = element;
                };
                AppBarManager.prototype.update = function (commands) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._appBarHostElement)) {
                        return;
                    }
                    this._clearContent();
                    if (Commerce.ArrayExtensions.hasElements(commands)) {
                        this._appBarHostElement.style.display = "";
                        var appBarElement = document.createElement("div");
                        this._appBarHostElement.appendChild(appBarElement);
                        this._currentAppBar = new AppBar({ commands: commands, element: appBarElement, onHeightChanged: this._updateHeightCss.bind(this) });
                    }
                    else {
                        this._appBarHostElement.style.display = "none";
                    }
                };
                AppBarManager.prototype.dispose = function () {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(this._currentAppBar)) {
                        this._currentAppBar.dispose();
                    }
                    Commerce.ObjectExtensions.disposeAllProperties(this);
                };
                AppBarManager.prototype._clearContent = function () {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(this._currentAppBar)) {
                        return;
                    }
                    var previousAppBar = this._currentAppBar;
                    this._currentAppBar = undefined;
                    this._appBarHostElement.removeChild(previousAppBar.element);
                    previousAppBar.dispose();
                    this._clearHeightCss();
                };
                AppBarManager.prototype._updateHeightCss = function (height) {
                    this._clearHeightCss();
                    this._currentHeightClass = Commerce.StringExtensions.format("height{0}", height);
                    $(this._appBarHostElement).addClass(this._currentHeightClass);
                };
                AppBarManager.prototype._clearHeightCss = function () {
                    if (!Commerce.StringExtensions.isNullOrWhitespace(this._currentHeightClass)) {
                        $(this._appBarHostElement).removeClass(this._currentHeightClass);
                        this._currentHeightClass = Commerce.StringExtensions.EMPTY;
                    }
                };
                return AppBarManager;
            }());
        })(ContentHost = Controls.ContentHost || (Controls.ContentHost = {}));
    })(Controls = Commerce.Controls || (Commerce.Controls = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Controls;
    (function (Controls) {
        var ContentHost;
        (function (ContentHost) {
            var ContentHostWinJSControl = (function () {
                function ContentHostWinJSControl(element, options) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(ContentHostWinJSControl.contentHostInstance)) {
                        throw new Error("ContentHostWinJSControl can only be constructed once.");
                    }
                    this._element = element;
                    ContentHostWinJSControl.contentHostInstance = this;
                }
                ContentHostWinJSControl.prototype.render = function (supportLegacyExtensionViews) {
                    if (supportLegacyExtensionViews === void 0) { supportLegacyExtensionViews = true; }
                    var createNavigator = function (viewNavigatorElement) {
                        var navigator = new Commerce.ViewNavigator(viewNavigatorElement, { home: "LoginView" });
                        Commerce.navigator = navigator;
                        return navigator;
                    };
                    var contentHost = new ContentHost.ContentHost({ createNavigator: createNavigator, supportLegacyExtensionViews: supportLegacyExtensionViews });
                    contentHost.render(this._element);
                };
                return ContentHostWinJSControl;
            }());
            ContentHost.ContentHostWinJSControl = ContentHostWinJSControl;
            WinJS.Utilities.markSupportedForProcessing(ContentHostWinJSControl);
        })(ContentHost = Controls.ContentHost || (Controls.ContentHost = {}));
    })(Controls = Commerce.Controls || (Commerce.Controls = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var BindingHandlers = (function () {
        function BindingHandlers() {
        }
        BindingHandlers.SetDefaultImageOnError = function (element, imageUrl) {
            var $element = $(element);
            var originalSrc = $element.attr("src");
            Commerce.RetailLogger.coreBindingHandlersLoadImageFailed(originalSrc);
            BindingHandlers.doubleCheckImageValidity(originalSrc).done(function (srcIsValid) {
                if (!srcIsValid) {
                    $element.attr("src", imageUrl);
                }
            });
        };
        BindingHandlers.doubleCheckImageValidity = function (src) {
            var asyncResult = new Commerce.AsyncResult();
            if (BindingHandlers.isIEBrowserOrMpos(Commerce.Host.instance.application.getApplicationType(), Commerce.Host.instance.application.getBrowserType())) {
                var image = document.createElement("img");
                image.onerror = function () {
                    asyncResult.resolve(false);
                };
                image.onload = function () {
                    asyncResult.resolve(true);
                };
                image.src = src;
            }
            else {
                asyncResult.resolve(false);
            }
            return asyncResult;
        };
        BindingHandlers.isIEBrowserOrMpos = function (applicationType, browserType) {
            var isIEBrowser = Commerce.ApplicationHelper.isWebApplicationType(applicationType) && (browserType === Commerce.Client.Entities.BrowserType.IE11);
            var isMpos = (applicationType === Commerce.Proxy.Entities.ApplicationTypeEnum.MposForWindows);
            return isIEBrowser || isMpos;
        };
        return BindingHandlers;
    }());
    Commerce.BindingHandlers = BindingHandlers;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var CustomWinJSBindings = (function () {
        function CustomWinJSBindings() {
        }
        CustomWinJSBindings.SetDefaultImage = function (source, sourceProperty, dest, destProperty) {
            if (destProperty.length !== 1 || destProperty[0] !== "onerror") {
                throw new Error("Only 'onerror' destination property is supported for binding 'SetDefaultImage'. Provided value was: '" + destProperty + "'.");
            }
            dest.addEventListener("error", function () {
                if (Commerce.ArrayExtensions.hasElements(sourceProperty) && sourceProperty[0] === "Commerce") {
                    var value = Commerce;
                    for (var i = 1; i < sourceProperty.length && value != null; i++) {
                        value = value[sourceProperty[i]];
                    }
                    var url = value || "";
                    Commerce.BindingHandlers.SetDefaultImageOnError(dest, url);
                }
                else {
                    Commerce.RetailLogger.customWinJSBindingsSetDefaultImage((sourceProperty || []).join());
                }
            });
        };
        return CustomWinJSBindings;
    }());
    (function () {
        WinJS.Namespace.define("Commerce.CustomBindings", {
            "SetDefaultImage": WinJS.Binding.initializer(CustomWinJSBindings.SetDefaultImage)
        });
    })();
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var FulfillmentLineSearchCriteriaConverter = (function () {
        function FulfillmentLineSearchCriteriaConverter() {
        }
        FulfillmentLineSearchCriteriaConverter.getRefiners = function (criteria) {
            criteria = Commerce.ObjectExtensions.isNullOrUndefined(criteria) ? {} : criteria;
            var fulfillmentStatusEnums = Commerce.Client.Entities.FulfillmentLineStatus.getValues();
            var getFulfillmentLineStatusCallback = function (enumMember) {
                return {
                    key: Commerce.FulfillmentLineHelper.getFulfillmentStatusTranslation(enumMember),
                    value: enumMember.Value
                };
            };
            var getFulfillmentStatusFromValueCallback = function (enumValue) {
                var controlKey = Commerce.StringExtensions.EMPTY;
                var controlValue = -1;
                var filteredFulfillmentStatuses = fulfillmentStatusEnums.filter(function (enumMember) {
                    return enumMember.Value === enumValue;
                });
                if (Commerce.ArrayExtensions.hasElements(filteredFulfillmentStatuses)) {
                    controlKey = Commerce.FulfillmentLineHelper.getFulfillmentStatusTranslation(filteredFulfillmentStatuses[0]);
                    controlValue = filteredFulfillmentStatuses[0].Value;
                }
                return { key: controlKey, value: controlValue };
            };
            var deliveryTypeEnums = Commerce.Client.Entities.FulfillmentLineDeliveryType.getValues();
            var getFulfillmentDeliveryTypeCallback = function (enumMember) {
                return {
                    key: Commerce.FulfillmentLineHelper.getFulfillmentDeliveryTypeTranslation(enumMember.Value),
                    value: enumMember.Value
                };
            };
            var getFulfillmentDeliveryTypeFromValueCallback = function (enumValue) {
                var controlKey = Commerce.StringExtensions.EMPTY;
                var controlValue = -1;
                var filteredDeliveryTypes = deliveryTypeEnums.filter(function (enumMember) {
                    return enumMember.Value === enumValue;
                });
                if (Commerce.ArrayExtensions.hasElements(filteredDeliveryTypes)) {
                    controlKey = Commerce.FulfillmentLineHelper.getFulfillmentDeliveryTypeTranslation(filteredDeliveryTypes[0].Value);
                    controlValue = filteredDeliveryTypes[0].Value;
                }
                return { key: controlKey, value: controlValue };
            };
            var deliveryModeRefiners = FulfillmentLineSearchCriteriaConverter.getDeliveryModeRefinerValues();
            var getDeliveryModeCallback = function (deliveryMode) {
                var key = Commerce.StringExtensions.EMPTY;
                var value = -1;
                var filteredDeliveryMode = Commerce.ArrayExtensions.firstOrUndefined(deliveryModeRefiners, function (deliveryModeRefiner) {
                    return deliveryModeRefiner.deliveryMode.Code === deliveryMode.deliveryMode.Code;
                });
                if (!Commerce.ObjectExtensions.isNullOrUndefined(filteredDeliveryMode)) {
                    var deliveryCode = filteredDeliveryMode.deliveryMode.Code;
                    var deliveryDescription = filteredDeliveryMode.deliveryMode.Description;
                    key = Commerce.StringExtensions.isNullOrWhitespace(deliveryDescription) ? deliveryCode : deliveryDescription;
                    value = filteredDeliveryMode.refinerValue;
                }
                return { key: key, value: value };
            };
            var getDeliveryModeFromValueCallback = function (deliveryModeValue) {
                var controlKey = Commerce.StringExtensions.EMPTY;
                var controlValue = -1;
                var filteredDeliveryMode = Commerce.ArrayExtensions.firstOrUndefined(deliveryModeRefiners, function (deliveryModeRefiner) {
                    return deliveryModeRefiner.deliveryMode.Code === deliveryModeValue;
                });
                if (!Commerce.ObjectExtensions.isNullOrUndefined(filteredDeliveryMode)) {
                    var deliveryCode = filteredDeliveryMode.deliveryMode.Code;
                    var deliveryDescription = filteredDeliveryMode.deliveryMode.Description;
                    controlKey = Commerce.StringExtensions.isNullOrWhitespace(deliveryDescription) ? deliveryCode : deliveryDescription;
                    controlValue = filteredDeliveryMode.refinerValue;
                }
                return { key: controlKey, value: controlValue };
            };
            var fulfillmentLineStatusFilterCallback = function (enumMember) {
                switch (enumMember.Value) {
                    case Commerce.Client.Entities.FulfillmentLineStatus.Pending.Value:
                    case Commerce.Client.Entities.FulfillmentLineStatus.Accepted.Value:
                    case Commerce.Client.Entities.FulfillmentLineStatus.Picking.Value:
                    case Commerce.Client.Entities.FulfillmentLineStatus.PartiallyPicked.Value:
                    case Commerce.Client.Entities.FulfillmentLineStatus.Picked.Value:
                    case Commerce.Client.Entities.FulfillmentLineStatus.PartiallyPacked.Value:
                    case Commerce.Client.Entities.FulfillmentLineStatus.Packed.Value:
                    case Commerce.Client.Entities.FulfillmentLineStatus.PartiallyInvoiced.Value:
                        return true;
                    default:
                        return false;
                }
            };
            var refiners = [
                Commerce.RefinerHelper.createSingleSelectListRefiner(FulfillmentLineSearchCriteriaConverter.DELIVERY_TYPE_ID, Commerce.ViewModelAdapter.getResourceString("string_13153"), Commerce.ObjectExtensions.isNullOrUndefined(criteria.DeliveryTypeValue) ?
                    null : [criteria.DeliveryTypeValue].map(getFulfillmentDeliveryTypeFromValueCallback), deliveryTypeEnums.map(getFulfillmentDeliveryTypeCallback)),
                Commerce.RefinerHelper.createTextRefiner(FulfillmentLineSearchCriteriaConverter.CUSTOMER_NUMBER_ID, Commerce.ViewModelAdapter.getResourceString("string_4594"), criteria.CustomerId),
                Commerce.RefinerHelper.createTextRefiner(FulfillmentLineSearchCriteriaConverter.CUSTOMER_NAME_ID, Commerce.ViewModelAdapter.getResourceString("string_4595"), criteria.CustomerName),
                Commerce.RefinerHelper.createTextRefiner(FulfillmentLineSearchCriteriaConverter.CUSTOMER_EMAIL_ID, Commerce.ViewModelAdapter.getResourceString("string_4596"), criteria.EmailAddress),
                Commerce.RefinerHelper.createTextRefiner(FulfillmentLineSearchCriteriaConverter.LOYALTY_CARD_NUMBER, Commerce.ViewModelAdapter.getResourceString("string_4662"), criteria.LoyaltyCardNumber),
                Commerce.RefinerHelper.createTextRefiner(FulfillmentLineSearchCriteriaConverter.CUSTOMER_PHONE_NUMBER, Commerce.ViewModelAdapter.getResourceString("string_4663"), criteria.CustomerPhoneNumber),
                Commerce.RefinerHelper.createTextRefiner(FulfillmentLineSearchCriteriaConverter.ORDER_NUMBER_ID, Commerce.ViewModelAdapter.getResourceString("string_4588"), criteria.SalesId),
                Commerce.RefinerHelper.createSingleSelectListRefiner(FulfillmentLineSearchCriteriaConverter.MODE_OF_DELIVERY, Commerce.ViewModelAdapter.getResourceString("string_13115"), Commerce.StringExtensions.isNullOrWhitespace(criteria.DeliveryModeCode) ?
                    null : [criteria.DeliveryModeCode].map(getDeliveryModeFromValueCallback), deliveryModeRefiners.map(getDeliveryModeCallback)),
                Commerce.RefinerHelper.createTextRefiner(FulfillmentLineSearchCriteriaConverter.RECEIPT_ID, Commerce.ViewModelAdapter.getResourceString("string_4589"), criteria.ReceiptId),
                Commerce.RefinerHelper.createTextRefiner(FulfillmentLineSearchCriteriaConverter.CHANNEL_REF_ID, Commerce.ViewModelAdapter.getResourceString("string_4593"), criteria.ChannelReferenceId),
                Commerce.RefinerHelper.createTextRefiner(FulfillmentLineSearchCriteriaConverter.STORE_NUMBER_ID, Commerce.ViewModelAdapter.getResourceString("string_13161"), criteria.StoreId),
                Commerce.RefinerHelper.createMultiSelectListRefiner(FulfillmentLineSearchCriteriaConverter.LINE_STATUS, Commerce.ViewModelAdapter.getResourceString("string_13116"), Commerce.ArrayExtensions.hasElements(criteria.FulfillmentStatusValues) ?
                    criteria.FulfillmentStatusValues.map(getFulfillmentStatusFromValueCallback) : null, Commerce.Client.Entities.FulfillmentLineStatus.getValues()
                    .filter(fulfillmentLineStatusFilterCallback)
                    .map(getFulfillmentLineStatusCallback)),
                Commerce.RefinerHelper.createDateRefiner(FulfillmentLineSearchCriteriaConverter.ORDER_DATE_ID, Commerce.ViewModelAdapter.getResourceString("string_13113"), criteria.OrderCreatedStartDate, criteria.OrderCreatedEndDate),
                Commerce.RefinerHelper.createDateRefiner(FulfillmentLineSearchCriteriaConverter.DELIVERY_DATE_ID, Commerce.ViewModelAdapter.getResourceString("string_13151"), criteria.RequestedDeliveryStartDate, criteria.RequestedDeliveryEndDate),
                Commerce.RefinerHelper.createDateRefiner(FulfillmentLineSearchCriteriaConverter.RECEIPT_DATE_ID, Commerce.ViewModelAdapter.getResourceString("string_13152"), criteria.RequestedReceiptStartDate, criteria.RequestedReceiptEndDate)
            ];
            return refiners;
        };
        FulfillmentLineSearchCriteriaConverter.getFulfillmentLineSearchCriteria = function (refiners) {
            var criteria = {};
            var deliveryType = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.DELIVERY_TYPE_ID);
            criteria.DeliveryTypeValue = Commerce.ObjectExtensions.isNullOrUndefined(deliveryType) ? NaN : deliveryType.value;
            criteria.CustomerId = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.CUSTOMER_NUMBER_ID);
            criteria.CustomerName = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.CUSTOMER_NAME_ID);
            criteria.EmailAddress = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.CUSTOMER_EMAIL_ID);
            criteria.LoyaltyCardNumber = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.LOYALTY_CARD_NUMBER);
            criteria.CustomerPhoneNumber = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.CUSTOMER_PHONE_NUMBER);
            criteria.SalesId = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.ORDER_NUMBER_ID);
            criteria.StoreId = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.STORE_NUMBER_ID);
            criteria.ChannelReferenceId = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.CHANNEL_REF_ID);
            criteria.ReceiptId = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.RECEIPT_ID);
            var deliveryModeResult = Commerce.RefinerHelper.getRefinerValue(refiners, FulfillmentLineSearchCriteriaConverter.MODE_OF_DELIVERY);
            var deliveryModeRefiners = FulfillmentLineSearchCriteriaConverter.getDeliveryModeRefinerValues();
            if (!Commerce.ObjectExtensions.isNullOrUndefined(deliveryModeResult)) {
                var deliveryModeRefinerResult = Commerce.ArrayExtensions.firstOrUndefined(deliveryModeRefiners, function (deliveryModeRefiner) {
                    return deliveryModeRefiner.refinerValue === deliveryModeResult.value;
                });
                criteria.DeliveryModeCode = Commerce.ObjectExtensions.isNullOrUndefined(deliveryModeRefinerResult) ?
                    Commerce.StringExtensions.EMPTY : deliveryModeRefinerResult.deliveryMode.Code;
            }
            else {
                criteria.DeliveryModeCode = Commerce.StringExtensions.EMPTY;
            }
            var fulfillmentLineStatus = Commerce.RefinerHelper.getRefinerValues(refiners, FulfillmentLineSearchCriteriaConverter.LINE_STATUS);
            criteria.FulfillmentStatusValues = Commerce.ArrayExtensions.hasElements(fulfillmentLineStatus) ?
                fulfillmentLineStatus.map(function (v) { return v.value; }) : undefined;
            var orderDateValues = Commerce.RefinerHelper.getRefinerValues(refiners, FulfillmentLineSearchCriteriaConverter.ORDER_DATE_ID);
            criteria.OrderCreatedStartDate = Commerce.RefinerHelper.getStartEndDate(orderDateValues, true);
            criteria.OrderCreatedEndDate = Commerce.RefinerHelper.getStartEndDate(orderDateValues, false);
            var deliveryDateValues = Commerce.RefinerHelper.getRefinerValues(refiners, FulfillmentLineSearchCriteriaConverter.DELIVERY_DATE_ID);
            criteria.RequestedDeliveryStartDate = Commerce.RefinerHelper.getStartEndDate(deliveryDateValues, true);
            criteria.RequestedDeliveryEndDate = Commerce.RefinerHelper.getStartEndDate(deliveryDateValues, false);
            var receiptDateValues = Commerce.RefinerHelper.getRefinerValues(refiners, FulfillmentLineSearchCriteriaConverter.RECEIPT_DATE_ID);
            criteria.RequestedReceiptStartDate = Commerce.RefinerHelper.getStartEndDate(receiptDateValues, true);
            criteria.RequestedReceiptEndDate = Commerce.RefinerHelper.getStartEndDate(receiptDateValues, false);
            return criteria;
        };
        FulfillmentLineSearchCriteriaConverter.getDeliveryModeRefinerValues = function () {
            var deliveryModes = Commerce.ApplicationContext.Instance.deliveryOptions
                .filter(function (deliveryMode) {
                return deliveryMode.Code !== Commerce.ApplicationContext.Instance.channelConfiguration.PickupDeliveryModeCode
                    && deliveryMode.Code !== Commerce.ApplicationContext.Instance.channelConfiguration.EmailDeliveryModeCode
                    && deliveryMode.Code !== Commerce.ApplicationContext.Instance.channelConfiguration.CarryoutDeliveryModeCode;
            });
            var numCounter = 1;
            var deliveryModeRefiners = deliveryModes.map(function (deliveryMode) {
                return { refinerValue: numCounter++, deliveryMode: deliveryMode };
            });
            return deliveryModeRefiners;
        };
        FulfillmentLineSearchCriteriaConverter.DELIVERY_TYPE_ID = "deliveryType";
        FulfillmentLineSearchCriteriaConverter.CUSTOMER_NUMBER_ID = "customerNumber";
        FulfillmentLineSearchCriteriaConverter.CUSTOMER_NAME_ID = "customerName";
        FulfillmentLineSearchCriteriaConverter.CUSTOMER_EMAIL_ID = "customerEmail";
        FulfillmentLineSearchCriteriaConverter.LOYALTY_CARD_NUMBER = "loyaltyCardNumber";
        FulfillmentLineSearchCriteriaConverter.CUSTOMER_PHONE_NUMBER = "customerPhoneNumber";
        FulfillmentLineSearchCriteriaConverter.ORDER_NUMBER_ID = "orderNumber";
        FulfillmentLineSearchCriteriaConverter.ORDER_DATE_ID = "orderDate";
        FulfillmentLineSearchCriteriaConverter.RECEIPT_ID = "receiptId";
        FulfillmentLineSearchCriteriaConverter.STORE_NUMBER_ID = "storeNumber";
        FulfillmentLineSearchCriteriaConverter.CHANNEL_REF_ID = "channelRefId";
        FulfillmentLineSearchCriteriaConverter.RECEIPT_DATE_ID = "receiptDate";
        FulfillmentLineSearchCriteriaConverter.DELIVERY_DATE_ID = "deliveryDate";
        FulfillmentLineSearchCriteriaConverter.MODE_OF_DELIVERY = "modeOfDelivery";
        FulfillmentLineSearchCriteriaConverter.LINE_STATUS = "lineStatus";
        return FulfillmentLineSearchCriteriaConverter;
    }());
    Commerce.FulfillmentLineSearchCriteriaConverter = FulfillmentLineSearchCriteriaConverter;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var UI;
    (function (UI) {
        "use strict";
        var JQueryUITouchExtensions = (function () {
            function JQueryUITouchExtensions() {
            }
            JQueryUITouchExtensions.enableTouchEmulation = function (element) {
                element.on({
                    touchstart: JQueryUITouchExtensions.onTouchStart,
                    touchmove: JQueryUITouchExtensions.onTouchMove,
                    touchend: JQueryUITouchExtensions.onTouchEnd
                });
            };
            JQueryUITouchExtensions.disableTouchEmulation = function (element) {
                element.off({
                    touchstart: JQueryUITouchExtensions.onTouchStart,
                    touchmove: JQueryUITouchExtensions.onTouchMove,
                    touchend: JQueryUITouchExtensions.onTouchEnd
                });
            };
            JQueryUITouchExtensions.simulateMouseEvent = function (event, simulatedType) {
                var touchEvent = event.originalEvent;
                if (touchEvent.touches.length > 1) {
                    return;
                }
                event.preventDefault();
                var touch = touchEvent.changedTouches[0];
                var simulatedEvent = document.createEvent("MouseEvents");
                simulatedEvent.initMouseEvent(simulatedType, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
                event.target.dispatchEvent(simulatedEvent);
            };
            JQueryUITouchExtensions.onTouchStart = function (event) {
                if (this.touchHandled) {
                    return;
                }
                JQueryUITouchExtensions.touchHandled = true;
                JQueryUITouchExtensions.touchMoved = false;
                JQueryUITouchExtensions.simulateMouseEvent(event, "mouseover");
                JQueryUITouchExtensions.simulateMouseEvent(event, "mousemove");
                JQueryUITouchExtensions.simulateMouseEvent(event, "mousedown");
            };
            JQueryUITouchExtensions.onTouchMove = function (event) {
                if (!JQueryUITouchExtensions.touchHandled) {
                    return;
                }
                JQueryUITouchExtensions.touchMoved = true;
                JQueryUITouchExtensions.simulateMouseEvent(event, "mousemove");
            };
            JQueryUITouchExtensions.onTouchEnd = function (event) {
                if (!JQueryUITouchExtensions.touchHandled) {
                    return;
                }
                JQueryUITouchExtensions.simulateMouseEvent(event, "mouseup");
                JQueryUITouchExtensions.simulateMouseEvent(event, "mouseout");
                if (!JQueryUITouchExtensions.touchMoved) {
                    JQueryUITouchExtensions.simulateMouseEvent(event, "click");
                }
                JQueryUITouchExtensions.touchHandled = false;
            };
            return JQueryUITouchExtensions;
        }());
        UI.JQueryUITouchExtensions = JQueryUITouchExtensions;
    })(UI = Commerce.UI || (Commerce.UI = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    Commerce.navigator = null;
    var ViewNavigator = (function () {
        function ViewNavigator(element, options) {
            var _this = this;
            this.element = null;
            this.home = Commerce.StringExtensions.EMPTY;
            this.stimefmt = Commerce.Host.instance.globalization.getDateTimeFormatter(Commerce.Host.Globalization.DateTimeFormat.LONG_TIME);
            this.eventManager = new Commerce.EventManager();
            if (!Commerce.ObjectExtensions.isNullOrUndefined(element)) {
                this.element = element;
                $(this.element).empty();
            }
            else {
                this.element = document.createElement("div");
            }
            this._history = [];
            this._createPlaceholderElementAndAddToHistory();
            this.navigationLog = ko.observableArray([]);
            this.home = options.home;
            this._cachedEventHandlersByEventName = Object.create(null);
            window.addEventListener("resize", this._resized.bind(this));
            document.body.addEventListener("keyup", this._keyupHandler.bind(this));
            document.body.addEventListener("keypress", this._keypressHandler.bind(this));
            document.body.addEventListener("mspointerup", this._mspointerupHandler.bind(this));
            var windowsNamespace = "Windows";
            var Windows = window[windowsNamespace];
            if (typeof Windows !== "undefined") {
                var phoneNamespace = Windows.Phone;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(phoneNamespace) &&
                    !Commerce.ObjectExtensions.isNullOrUndefined(phoneNamespace.UI.Input.HardwareButtons)) {
                    phoneNamespace.UI.Input.HardwareButtons.addEventListener("backpressed", function (event) {
                        event.handled = true;
                        _this.navigateBack();
                    });
                }
            }
            Commerce.Session.instance.addUserLogOnHandler(this.element, function () { _this._clearStateForNewUser(); });
        }
        Object.defineProperty(ViewNavigator.prototype, "pageControl", {
            get: function () { return this.pageElement && this.pageElement.winControl; },
            enumerable: true,
            configurable: true
        });
        ViewNavigator.prototype.collapse = function (viewConfiguration) {
            this._collapseAndNavigateInternal(viewConfiguration, false);
        };
        ViewNavigator.prototype.collapseAndNavigate = function (viewConfiguration, state) {
            this._collapseAndNavigateInternal(viewConfiguration, true, state);
        };
        ViewNavigator.prototype.navigate = function (viewConfiguration, state) {
            var _this = this;
            var viewName = viewConfiguration.deviceSpecificViewName;
            var location = viewConfiguration.deviceSpecificViewLocation;
            if (Commerce.StringExtensions.isNullOrWhitespace(location)) {
                var errorMessage = Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_29056"), viewName);
                Commerce.NotificationHandler.displayErrorMessage(errorMessage);
                return;
            }
            Commerce.RetailLogger.pageView(viewName);
            Commerce.UI.Tutorial.instance.onBeforeNavigate();
            var performanceMarker = Commerce.PerformanceLogger.markStart("ViewNavigator.navigate", false);
            var oldElement = this.pageElement;
            var keepAliveViewsCollection = $(this.element).find("[" + ViewNavigator._STAY_ALIVE_VIEW_ELEMENT_ATTRIBUTE + "=\"" + location + "\"]");
            this.appendNavigationLog(location);
            if (keepAliveViewsCollection.length === 0) {
                var newElement_1 = this._createPageElement();
                $(newElement_1).attr(ViewNavigator._ACTION_ELEMENT_ATTRIBUTE, viewName);
                var parentedComplete_1;
                var parented = new WinJS.Promise(function (c) { parentedComplete_1 = c; });
                WinJS.UI.Pages.render(location, newElement_1, state, parented)
                    .then(function (control) {
                    _this.element.insertAdjacentElement("afterbegin", newElement_1);
                    _this._checkForAndRemoveNavigationCircle(newElement_1, oldElement);
                    _this._history.push({ element: newElement_1, viewConfiguration: viewConfiguration });
                    if (_this._isElementVisible(oldElement)) {
                        _this._hideElement(oldElement);
                    }
                    parentedComplete_1();
                    if (control.element.winControl.viewController && control.element.winControl.viewController.keepAliveViewActivated) {
                        $(control.element).attr(ViewNavigator._STAY_ALIVE_VIEW_ELEMENT_ATTRIBUTE, location);
                        control.element.winControl.viewController.keepAliveViewActivated(state);
                    }
                    _this._navigated();
                    Commerce.UI.Tutorial.instance.onAfterNavigate(viewName, control.element);
                    performanceMarker.markEnd();
                });
            }
            else {
                var keepAliveView_1 = keepAliveViewsCollection.get(0);
                var winControl_1 = keepAliveView_1.winControl;
                WinJS.Promise.timeout().then(function () {
                    _this._checkForAndRemoveNavigationCircle(keepAliveView_1, oldElement);
                    _this._history.push({ element: keepAliveView_1, viewConfiguration: viewConfiguration });
                    _this._hideElement(oldElement);
                    _this._showElement(keepAliveView_1);
                    if (winControl_1
                        && winControl_1.viewController
                        && winControl_1.viewController.keepAliveViewActivated) {
                        winControl_1.viewController.keepAliveViewActivated(state);
                    }
                    _this._navigated();
                    Commerce.UI.Tutorial.instance.onAfterNavigate(viewName, keepAliveView_1);
                    performanceMarker.markEnd();
                });
            }
        };
        ViewNavigator.prototype.navigateBack = function (correlationId) {
            correlationId = Commerce.LoggerHelper.resolveCorrelationId(correlationId);
            var destinationViewName = Commerce.StringExtensions.EMPTY;
            var originalViewName = Commerce.StringExtensions.EMPTY;
            if (Commerce.ArrayExtensions.hasElements(this._history)) {
                originalViewName = this.getCurrentViewName();
                if (this._history.length >= 2) {
                    var destinationElement = this._history[this._history.length - 2].element;
                    destinationViewName = $(destinationElement).attr(ViewNavigator._ACTION_ELEMENT_ATTRIBUTE);
                }
            }
            Commerce.RetailLogger.navigateBackStarted(originalViewName, destinationViewName, correlationId);
            if (!this.isBackNavigationEnabled) {
                return;
            }
            var currentElement = this.pageElement;
            if (currentElement.winControl && currentElement.winControl.viewController) {
                var onNavigateBack = currentElement.winControl.viewController.onNavigateBack;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(onNavigateBack) && Commerce.ObjectExtensions.isFunction(onNavigateBack)) {
                    var shouldContinue = onNavigateBack.call(currentElement.winControl.viewController);
                    if (!shouldContinue) {
                        Commerce.RetailLogger.navigateBackCanceled(originalViewName, destinationViewName, correlationId);
                        return;
                    }
                }
            }
            Commerce.UI.Tutorial.instance.onBeforeNavigate();
            this._navigateBackInternal();
            this.eventManager.raiseEvent("CurrentViewChanged", { currentView: this._getCurrentView() });
            Commerce.RetailLogger.navigateBackFinished(originalViewName, destinationViewName, correlationId);
        };
        ViewNavigator.prototype.addEventHandler = function (element, eventName, eventHandler) {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(element)) {
                throw new Error("navigator.addEventHandler: element is a required parameter.");
            }
            if (Commerce.StringExtensions.isNullOrWhitespace(eventName)) {
                throw new Error("navigator.addEventHandler: eventName is a required parameter.");
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(eventHandler)) {
                throw new Error("navigator.addEventHandler: eventHandler is a required parameter.");
            }
            this._cachedEventHandlersByEventName[eventName] = null;
            var $element = $(element);
            var globalEventHandlers = $element.data(ViewNavigator._GLOBAL_EVENTS_ATTRIBUTE_NAME);
            if (!globalEventHandlers) {
                globalEventHandlers = {};
            }
            if (!globalEventHandlers[eventName]) {
                globalEventHandlers[eventName] = [];
            }
            globalEventHandlers[eventName].push(eventHandler);
            $element.data(ViewNavigator._GLOBAL_EVENTS_ATTRIBUTE_NAME, globalEventHandlers);
            var removeHandler = function () {
                _this.removeEventHandler(element, eventName, eventHandler);
            };
            $element.on("remove", removeHandler.bind(this));
        };
        ViewNavigator.prototype.getCurrentViewName = function () {
            var currentViewConfiguration = this._history[this._history.length - 1].viewConfiguration;
            if (Commerce.ObjectExtensions.isNullOrUndefined(currentViewConfiguration)) {
                return $(this.pageElement).attr(ViewNavigator._ACTION_ELEMENT_ATTRIBUTE);
            }
            else {
                return currentViewConfiguration.page;
            }
        };
        Object.defineProperty(ViewNavigator.prototype, "pageElement", {
            get: function () { return this._history[this._history.length - 1].element; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewNavigator.prototype, "backButton", {
            get: function () { return this.pageElement.querySelector("nav .iconBack"); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewNavigator.prototype, "isBackNavigationEnabled", {
            get: function () {
                return (this.backButton && !this.backButton.disabled) ||
                    (this.pageElement.winControl && this.pageElement.winControl.viewController
                        && this.pageElement.winControl.viewController.isBackNavigationEnabled);
            },
            enumerable: true,
            configurable: true
        });
        ViewNavigator.prototype.removeEventHandler = function (element, eventName, eventHandler) {
            this._cachedEventHandlersByEventName[eventName] = null;
            var $element = $(element);
            var globalEventHandlers = $element.data(ViewNavigator._GLOBAL_EVENTS_ATTRIBUTE_NAME);
            if (globalEventHandlers) {
                var eventHandlers = globalEventHandlers[eventName];
                if (eventHandlers && eventHandlers.length > 0) {
                    var index = eventHandlers.indexOf(eventHandler);
                    if (index >= 0) {
                        eventHandlers.splice(index, 1);
                    }
                }
            }
        };
        ViewNavigator.prototype._getCurrentView = function () {
            var currentViewElement = this.pageElement;
            var currentViewController;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(currentViewElement)
                && !Commerce.ObjectExtensions.isNullOrUndefined(currentViewElement.winControl)
                && !Commerce.ObjectExtensions.isNullOrUndefined(currentViewElement.winControl.viewController)) {
                currentViewController = currentViewElement.winControl.viewController;
            }
            return {
                controller: currentViewController,
                element: currentViewElement
            };
        };
        ViewNavigator.prototype._resized = function (event) {
            if (this.pageControl && this.pageControl.updateLayout) {
                this.pageControl.updateLayout.call(this.pageControl, this.pageElement);
            }
        };
        ViewNavigator.prototype._hideElement = function (element) {
            Commerce.Controls.Dialog.DialogHandler.hideAll();
            if (element.winControl
                && element.winControl.viewController) {
                if (Commerce.ObjectExtensions.isFunction(element.winControl.viewController.onBarcodeScanned)) {
                    Commerce.Peripherals.instance.barcodeScanner.disableAsync();
                }
                if (Commerce.ObjectExtensions.isFunction(element.winControl.viewController.onMsrSwiped)) {
                    Commerce.Peripherals.instance.magneticStripeReader.disableAsync();
                }
                if (element.winControl.viewController.captureGlobalInputForNumPad
                    && element.winControl.viewController.numPadInputBroker) {
                    Commerce.Peripherals.instance.numPad.disable();
                }
                if (Commerce.ObjectExtensions.isFunction(element.winControl.viewController.onHidden)) {
                    element.winControl.viewController.onHidden();
                }
            }
            this._addHiddenStyles(element);
            this._enableAppBar(element, false);
        };
        ViewNavigator.prototype._addHiddenStyles = function (element) {
            element.style.position = "fixed";
            element.style.left = "-200000px";
            element.style.visibility = ViewNavigator._HIDDEN_STYLE_VISIBILITY;
        };
        ViewNavigator.prototype._removeHiddenStyles = function (element) {
            element.style.visibility = ViewNavigator._VISIBLE_STYLE_VISIBILITY;
            element.style.position = "static";
            element.style.left = "";
        };
        ViewNavigator.prototype._isElementVisible = function (element) {
            return (element.style.visibility !== ViewNavigator._HIDDEN_STYLE_VISIBILITY);
        };
        ViewNavigator.prototype._showElement = function (element) {
            if (element) {
                this._removeHiddenStyles(element);
                this._enableAppBar(element, true);
                if (element.winControl
                    && element.winControl.viewController) {
                    if (Commerce.ObjectExtensions.isFunction(element.winControl.viewController.onBarcodeScanned)) {
                        Commerce.Peripherals.instance.barcodeScanner.enableAsync(element.winControl.viewController.onBarcodeScanned.bind(element.winControl.viewController));
                    }
                    if (Commerce.ObjectExtensions.isFunction(element.winControl.viewController.onMsrSwiped)) {
                        Commerce.Peripherals.instance.magneticStripeReader.enableAsync(element.winControl.viewController.onMsrSwiped.bind(element.winControl.viewController));
                    }
                    if (Commerce.ObjectExtensions.isFunction(element.winControl.viewController.onShown)) {
                        element.winControl.viewController.onShown();
                    }
                    if (element.winControl.viewController.captureGlobalInputForNumPad
                        && element.winControl.viewController.numPadInputBroker) {
                        Commerce.Peripherals.instance.numPad.enable(element.winControl.viewController.numPadInputBroker);
                    }
                }
                if (element.children.length !== 0) {
                    Commerce.Interaction.instance.triggerEvent(element.children[0], Commerce.InteractionEvents.VIEWSHOWN);
                }
            }
        };
        ViewNavigator.prototype._createPageElement = function () {
            var element = document.createElement("div");
            element.style.width = "100%";
            element.style.height = "100%";
            return element;
        };
        ViewNavigator.prototype._keypressHandler = function (args) {
            if (args.key === "Backspace") {
                this.navigateBack();
            }
        };
        ViewNavigator.prototype._keyupHandler = function (args) {
            if ((args.key === "Left" && args.altKey) || (args.key === "BrowserBack")) {
                this.navigateBack();
            }
        };
        ViewNavigator.prototype._mspointerupHandler = function (args) {
            if (args.button === 3) {
                this.navigateBack();
            }
        };
        ViewNavigator.prototype.appendNavigationLog = function (location) {
            this.navigationLog().push(this.stimefmt.format(new Date()) + location);
        };
        ViewNavigator.prototype._collapseAndNavigateInternal = function (viewConfiguration, navigate, state) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(viewConfiguration)) {
                throw "viewConfiguration not defined for _collapseAndNavigateInternal.";
            }
            var viewElement = undefined;
            for (var i = (this._history.length - 1); i >= 0; i--) {
                var currentElement = this._history[i].element;
                var currentActionElementAttribute = $(currentElement).attr(ViewNavigator._ACTION_ELEMENT_ATTRIBUTE);
                if (currentActionElementAttribute === viewConfiguration.deviceSpecificViewName) {
                    viewElement = currentElement;
                    break;
                }
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(viewElement)) {
                if (navigate) {
                    var errorMessage = Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_29057"), viewConfiguration.deviceSpecificViewName);
                    Commerce.NotificationHandler.displayErrorMessage(errorMessage);
                }
            }
            else {
                var viewStayAliveViewElementAttribute = $(viewElement).attr(ViewNavigator._STAY_ALIVE_VIEW_ELEMENT_ATTRIBUTE);
                if (!Commerce.StringExtensions.isNullOrWhitespace(viewStayAliveViewElementAttribute) && navigate) {
                    this.navigate(viewConfiguration, state);
                    return;
                }
                else {
                    var topEntryFromHistory = undefined;
                    var topElementFromNavigationLog = undefined;
                    var topElementsLoaded = false;
                    while (true) {
                        var removedEntry = this._history.pop();
                        var removedElement = removedEntry.element;
                        var removedActionElementAttribute = $(removedElement).attr(ViewNavigator._ACTION_ELEMENT_ATTRIBUTE);
                        if (removedActionElementAttribute === viewConfiguration.deviceSpecificViewName) {
                            if (navigate) {
                                this.navigationLog().pop();
                                this._removeElement(removedElement);
                                this.navigate(viewConfiguration, state);
                                return;
                            }
                            else {
                                this._history.push(removedEntry);
                                if (topElementsLoaded) {
                                    this._history.push(topEntryFromHistory);
                                    this.navigationLog().push(topElementFromNavigationLog);
                                }
                                return;
                            }
                        }
                        else {
                            if (!navigate && !topElementsLoaded) {
                                topEntryFromHistory = removedEntry;
                                topElementFromNavigationLog = this.navigationLog().pop();
                                topElementsLoaded = true;
                            }
                            else {
                                this.navigationLog().pop();
                                this._removeElement(removedElement);
                            }
                        }
                    }
                }
            }
        };
        ViewNavigator.prototype._enableAppBar = function (element, appBarEnabled) {
            var appBar = element.querySelector("#commandAppBar") || element.querySelector(".commandAppBar");
            if (appBar) {
                appBar.winControl.disabled = (!appBarEnabled);
            }
        };
        ViewNavigator.prototype._removeElement = function (removeElement, removeAll) {
            if (!removeAll &&
                !Commerce.ObjectExtensions.isNullOrUndefined(removeElement.winControl) &&
                !Commerce.ObjectExtensions.isNullOrUndefined(removeElement.winControl.viewController) &&
                Commerce.ObjectExtensions.isFunction(removeElement.winControl.viewController.keepAliveViewActivated)) {
                return;
            }
            var $removeElement = $(removeElement);
            if ($removeElement.hasClass(ViewNavigator._DISPOSABLE_OBJECTS_TAG_NAME)) {
                var disposableObjects = $removeElement.data(ViewNavigator._DISPOSABLE_OBJECTS_TAG_NAME);
                while (disposableObjects.length > 0) {
                    var disposableObject = disposableObjects.pop();
                    Commerce.ObjectExtensions.tryDispose(disposableObject);
                }
                $removeElement.removeClass(ViewNavigator._DISPOSABLE_OBJECTS_TAG_NAME).removeData(ViewNavigator._DISPOSABLE_OBJECTS_TAG_NAME);
            }
            if (!Commerce.ObjectExtensions.isNullOrUndefined(removeElement.winControl)) {
                if (Commerce.ObjectExtensions.isFunction(removeElement.winControl.unload)) {
                    removeElement.winControl.unload();
                }
                var timeout = Commerce.Config.disposalDelay();
                setTimeout(function () {
                    Commerce.ObjectExtensions.tryDispose(removeElement.winControl.viewController);
                }, timeout);
                ko.cleanNode(removeElement);
                WinJS.Utilities.disposeSubTree(removeElement);
                Commerce.ObjectExtensions.tryDispose(removeElement.winControl);
            }
            ko.removeNode(removeElement);
        };
        ViewNavigator.prototype._checkForAndRemoveNavigationCircle = function (newElement, oldElement) {
            if (this._history.length >= 2) {
                var firstPageInHistory = this._history[this._history.length - 2].element;
                if (oldElement.winControl &&
                    oldElement.winControl.viewController &&
                    oldElement.winControl.viewController.saveInHistory === false &&
                    firstPageInHistory && newElement.winControl.uri === firstPageInHistory.winControl.uri) {
                    this._removeElement(this._history.pop().element);
                    this._removeElement(this._history.pop().element);
                    this.navigationLog().pop();
                    this.navigationLog().pop();
                }
            }
        };
        ViewNavigator.prototype._navigated = function () {
            var _this = this;
            if (this.isBackNavigationEnabled) {
                if (this._history.length > ViewNavigator._NUMBER_OF_PAGES_IN_HISTORY) {
                    for (var i = 0; i < this._history.length; i++) {
                        var entry = this._history[i];
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(entry)
                            && Commerce.StringExtensions.isNullOrWhitespace($(entry.element).attr(ViewNavigator._STAY_ALIVE_VIEW_ELEMENT_ATTRIBUTE))) {
                            this._removeElement(this._history.splice(i, 1)[0].element);
                            break;
                        }
                    }
                }
                var backButton = this.backButton;
                if (backButton) {
                    backButton.onclick = function () {
                        _this.navigateBack();
                    };
                    if (this._history.length > 1) {
                        backButton.removeAttribute("disabled");
                    }
                    else {
                        backButton.setAttribute("disabled", "disabled");
                    }
                }
            }
            else {
                var currentView = this._history.pop();
                var view = this._history.pop();
                while (view) {
                    this._removeElement(view.element);
                    view = this._history.pop();
                }
                this._history.push(currentView);
            }
            var $element = $(this.pageElement);
            var disposableObjects;
            if ($element.hasClass(ViewNavigator._DISPOSABLE_OBJECTS_TAG_NAME)) {
                disposableObjects = $element.data(ViewNavigator._DISPOSABLE_OBJECTS_TAG_NAME);
            }
            else {
                disposableObjects = [];
                $element.addClass(ViewNavigator._DISPOSABLE_OBJECTS_TAG_NAME).data(ViewNavigator._DISPOSABLE_OBJECTS_TAG_NAME, disposableObjects);
            }
            Object.keys(Commerce.Session.instance).forEach(function (property) {
                var instanceProperty = Commerce.Session.instance[property];
                if (ko.isObservable(instanceProperty)) {
                    var changeContainer = instanceProperty.w || instanceProperty.F;
                    if (Commerce.ArrayExtensions.hasElements(changeContainer.change)) {
                        for (var i = changeContainer.change.length - 1; i >= 0; i--) {
                            var changeHandler = changeContainer.change[i];
                            if (changeHandler.taggedForDispose) {
                                break;
                            }
                            disposableObjects.push(changeHandler);
                            changeHandler.taggedForDispose = true;
                        }
                    }
                }
            });
            this.eventManager.raiseEvent("CurrentViewChanged", { currentView: this._getCurrentView() });
        };
        ViewNavigator.prototype._clearStateForNewUser = function () {
            this._hideElement(this.pageElement);
            this._clearAllContent();
        };
        ViewNavigator.prototype._clearAllContent = function () {
            this._history.splice(0, this._history.length);
            while (this.element.hasChildNodes()) {
                this._removeElement(this.element.lastChild, true);
            }
            $(document.body).find("[IRemoveable]").each(function (index, element) {
                ko.removeNode(element);
            });
            this._createPlaceholderElementAndAddToHistory();
        };
        ViewNavigator.prototype._createPlaceholderElementAndAddToHistory = function () {
            var pageElement = this._createPageElement();
            this.element.appendChild(pageElement);
            this._history.push({ element: pageElement });
        };
        ViewNavigator.prototype._navigateBackInternal = function () {
            var currentElement = this._history.pop().element;
            this.navigationLog().pop();
            this._hideElement(currentElement);
            this._removeElement(currentElement);
            var previousElement = this.pageElement;
            var pageName = $(previousElement).attr(ViewNavigator._ACTION_ELEMENT_ATTRIBUTE);
            if (!Commerce.ObjectExtensions.isNullOrUndefined(pageName)) {
                Commerce.RetailLogger.pageView(pageName);
            }
            Commerce.UI.Tutorial.instance.onAfterNavigate(pageName, previousElement);
            this._showElement(previousElement);
        };
        ViewNavigator._ACTION_ELEMENT_ATTRIBUTE = "Action";
        ViewNavigator._STAY_ALIVE_VIEW_ELEMENT_ATTRIBUTE = "IKeepAliveView";
        ViewNavigator._GLOBAL_EVENTS_ATTRIBUTE_NAME = "GlobalEvents";
        ViewNavigator._DISPOSABLE_OBJECTS_TAG_NAME = "DisposableObjects";
        ViewNavigator._NUMBER_OF_PAGES_IN_HISTORY = 10;
        ViewNavigator._HIDDEN_STYLE_VISIBILITY = "hidden";
        ViewNavigator._VISIBLE_STYLE_VISIBILITY = "visible";
        return ViewNavigator;
    }());
    Commerce.ViewNavigator = ViewNavigator;
    WinJS.Utilities.markSupportedForProcessing(ViewNavigator);
})(Commerce || (Commerce = {}));
var Pos;
(function (Pos) {
    "use strict";
    var PosFrameworkRuntimeInitializer = (function () {
        function PosFrameworkRuntimeInitializer() {
        }
        PosFrameworkRuntimeInitializer.prototype.populateCompositionLoader = function (compositionLoader) {
            compositionLoader.addRequestHandler(Commerce.RegisterRequestHandlersRequestHandler, function () {
                return { compositionLoader: compositionLoader, replaceableRequestTypes: PosFrameworkRuntimeInitializer.REPLACEABLE_REQUEST_TYPES };
            });
            compositionLoader.addRequestHandler(Commerce.RegisterRequestInterceptorsRequestHandler, function () { return compositionLoader; });
            compositionLoader.addRequestHandler(Commerce.DataService.DataServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.RegisterLegacyOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.LegacyOperationRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Operations.Handlers.RestoreStaffTokenRequestHandler);
            compositionLoader.addRequestInterceptor(Commerce.OperationRequest, new Commerce.Operations.Interceptors.OperationRequestInterceptor());
            compositionLoader.addRequestHandler(Commerce.Extensibility.LoadExtensionPackagesClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Extensibility.GetExtensionPackageDefinitionsServiceRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Framework.ShowErrorMessageClientRequestHandler);
            compositionLoader.addRequestHandler(Commerce.Framework.LoadJsonClientRequestHandler);
        };
        PosFrameworkRuntimeInitializer.REPLACEABLE_REQUEST_TYPES = [
            Commerce.AddTenderLineToCartClientRequest,
            Commerce.CardPaymentBeginTransactionRequest,
            Commerce.CardPaymentAuthorizePaymentRequest,
            Commerce.CardPaymentCapturePaymentRequest,
            Commerce.CardPaymentEndTransactionRequest,
            Commerce.CardPaymentEnquireGiftCardBalancePeripheralRequest,
            Commerce.CardPaymentExecuteTaskRequest,
            Commerce.CardPaymentRefundPaymentRequest,
            Commerce.CardPaymentVoidPaymentRequest,
            Commerce.CashDrawerOpenRequest,
            Commerce.CashManagement.CreateFloatEntryTransactionClientRequest,
            Commerce.CashManagement.CreateStartingAmountTransactionClientRequest,
            Commerce.CashManagement.CreateTenderRemovalTransactionClientRequest,
            Commerce.DepositOverrideOperationRequest,
            Commerce.GetKeyedInPriceClientRequest,
            Commerce.GetKeyedInQuantityClientRequest,
            Commerce.GetPaymentCardTypeByBinRangeClientRequest,
            Commerce.GetPickupDateClientRequest,
            Commerce.GetReceiptEmailAddressClientRequest,
            Commerce.GetReportParametersClientRequest,
            Commerce.GetScanResultClientRequest,
            Commerce.GetShippingChargeClientRequest,
            Commerce.GetShippingDateClientRequest,
            Commerce.CashManagement.GetStartingAmountClientRequest,
            Commerce.GetTenderDetailsClientRequest,
            Commerce.LoyaltyCardPointsBalanceOperationRequest,
            Commerce.Payments.GetGiftCardByIdServiceRequest,
            Commerce.PaymentTerminalAuthorizePaymentActivityRequest,
            Commerce.PaymentTerminalAuthorizePaymentRequest,
            Commerce.PaymentTerminalBeginTransactionRequest,
            Commerce.PaymentTerminalCancelOperationRequest,
            Commerce.PaymentTerminalCapturePaymentRequest,
            Commerce.PaymentTerminalEndTransactionRequest,
            Commerce.PaymentTerminalEnquireGiftCardBalancePeripheralRequest,
            Commerce.PaymentTerminalExecuteTaskRequest,
            Commerce.PaymentTerminalFetchTokenPeripheralRequest,
            Commerce.PaymentTerminalGetTransactionReferenceIdRequest,
            Commerce.PaymentTerminalGetTransactionByTransactionReferenceRequest,
            Commerce.PaymentTerminalRefundPaymentActivityRequest,
            Commerce.PaymentTerminalRefundPaymentRequest,
            Commerce.PaymentTerminalUpdateLinesRequest,
            Commerce.PaymentTerminalVoidPaymentRequest,
            Commerce.Peripherals.CardPaymentAuthorizeCardTokenPeripheralRequest,
            Commerce.Peripherals.PaymentTerminalActivateGiftCardPeripheralRequest,
            Commerce.Peripherals.PaymentTerminalAddBalanceToGiftCardPeripheralRequest,
            Commerce.PrintPackingSlipClientRequest,
            Commerce.Products.GetRefinerValuesByTextServiceRequest,
            Commerce.Products.GetSerialNumberClientRequest,
            Commerce.SalesOrders.GetGiftReceiptsClientRequest,
            Commerce.SalesOrders.SelectCustomerOrderTypeClientRequest,
            Commerce.SalesOrders.GetCancellationChargeClientRequest,
            Commerce.SelectZipCodeInfoClientRequest,
            Commerce.ShowChangeDueClientRequest,
            Commerce.StoreOperations.GetPickingAndReceivingOrdersClientRequest,
            Commerce.TenderCounting.CreateBankDropTransactionClientRequest,
            Commerce.TenderCounting.CreateSafeDropTransactionClientRequest,
            Commerce.TenderCounting.CreateTenderDeclarationTransactionClientRequest,
            Commerce.TenderCounting.GetCountedTenderDetailAmountClientRequest
        ];
        return PosFrameworkRuntimeInitializer;
    }());
    Pos.PosFrameworkRuntimeInitializer = PosFrameworkRuntimeInitializer;
})(Pos || (Pos = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var RefinerHelper = (function () {
        function RefinerHelper() {
        }
        RefinerHelper.createTextRefiner = function (id, keyName, selectedValue) {
            return Commerce.Refiners.RefinerFactory.createTextRefiner(id, keyName, selectedValue);
        };
        RefinerHelper.createDateRefiner = function (id, keyName, startDate, endDate) {
            return Commerce.Refiners.RefinerFactory.createDateRefiner(id, keyName, startDate, endDate);
        };
        RefinerHelper.createSingleSelectListRefiner = function (id, keyName, selectedValues, values) {
            return Commerce.Refiners.RefinerFactory.createSingleSelectListRefiner(id, keyName, selectedValues, values);
        };
        RefinerHelper.createMultiSelectListRefiner = function (id, keyName, selectedValues, values) {
            return Commerce.Refiners.RefinerFactory.createMultiSelectListRefiner(id, keyName, selectedValues, values);
        };
        RefinerHelper.getRefinerValue = function (refiners, id) {
            var values = RefinerHelper.getRefinerValues(refiners, id);
            return Commerce.ArrayExtensions.firstOrUndefined(values);
        };
        RefinerHelper.getRefinerValues = function (refiners, id) {
            var refiner = Commerce.ArrayExtensions.firstOrUndefined(refiners, function (r) {
                return r.ID === id;
            });
            return Commerce.ObjectExtensions.isNullOrUndefined(refiner) || !Commerce.ArrayExtensions.hasElements(refiner.SelectedValues) ? undefined : refiner.SelectedValues;
        };
        RefinerHelper.getStartEndDate = function (dateValues, isStartDate) {
            var result = Commerce.ArrayExtensions.firstOrUndefined(dateValues, function (v) { return v.isStartDate === isStartDate; });
            return Commerce.ObjectExtensions.isNullOrUndefined(result) ? undefined : result.date;
        };
        RefinerHelper.createRefinerControl = function (refiner, container, refinerRemovedHandler) {
            var showInputDialogCallback;
            var refinerValueTemplate = RefinerHelper.REFINER_TEXT_VALUE_TEMPLATE_ID;
            switch (refiner.Type) {
                case Commerce.Refiners.RefinerType.Text:
                    showInputDialogCallback = RefinerHelper.showTextInputDialogCallback.bind(null, refiner);
                    break;
                case Commerce.Refiners.RefinerType.SingleSelectList:
                case Commerce.Refiners.RefinerType.MultiSelectList:
                    if (refiner instanceof Commerce.Refiners.ListRefiner) {
                        var getDisplayNameCallback = function (value) { return value.key; };
                        refinerValueTemplate = RefinerHelper.REFINER_KEY_VALUE_TEMPLATE_ID;
                        showInputDialogCallback = refiner.Type === Commerce.Refiners.RefinerType.MultiSelectList ?
                            RefinerHelper.showMultiSelectListInputDialogCallback.bind(null, refiner.KeyName, refiner.Values, getDisplayNameCallback) :
                            RefinerHelper.showSingleSelectListInputDialogCallback.bind(null, refiner.KeyName, refiner.Values, getDisplayNameCallback);
                    }
                    else {
                        throw new Error("RefinerHelper::Refiner with id '" + refiner.ID + "' has list refiner type but is not an instance of ListRefiner.");
                    }
                    break;
                case Commerce.Refiners.RefinerType.Date:
                    refinerValueTemplate = RefinerHelper.REFINER_DATE_VALUE_TEMPLATE_ID;
                    showInputDialogCallback = RefinerHelper.showDateRangeInputDialogCallback.bind(null, refiner);
                    break;
                default:
                    return false;
            }
            ko.applyBindingsToNode(container, {
                selectRefinerControl: {
                    refiner: refiner,
                    refinerValueTemplate: refinerValueTemplate,
                    showInputDialogCallback: showInputDialogCallback,
                    refinerRemovedHandler: refinerRemovedHandler.bind(null, refiner)
                }
            });
            return true;
        };
        RefinerHelper.showMultiSelectListInputDialogCallback = function (subTitle, refinerValues, getDisplayNameCallback) {
            var title = Commerce.ViewModelAdapter.getResourceString("string_940");
            var dialogResult = new Commerce.AsyncResult();
            var dialog = RefinerHelper.configureDialog(new Commerce.Controls.CheckedListInputDialog(), title, subTitle);
            dialog.show({ items: refinerValues, getDisplayNameCallback: getDisplayNameCallback })
                .onAny(function (result, dlgResult) {
                dialogResult.resolve(dlgResult === Commerce.DialogResult.OK ? result : null);
            });
            return dialogResult;
        };
        RefinerHelper.showSingleSelectListInputDialogCallback = function (subTitle, refinerValues, getDisplayNameCallback) {
            var title = Commerce.ViewModelAdapter.getResourceString("string_940");
            var dialogResult = new Commerce.AsyncResult();
            var dialog = RefinerHelper.configureDialog(new Commerce.Controls.ListInputDialog(), title, subTitle);
            dialog.show({ items: refinerValues, getDisplayNameCallback: getDisplayNameCallback })
                .onAny(function (result, dlgResult) {
                dialogResult.resolve(dlgResult === Commerce.DialogResult.OK ? [result] : null);
            });
            return dialogResult;
        };
        RefinerHelper.configureDialog = function (dialog, title, subTitle) {
            dialog.title(title);
            dialog.subTitle(Commerce.ObjectExtensions.isNullOrUndefined(subTitle) ? title : subTitle);
            return dialog;
        };
        RefinerHelper.showRefinerAsync = function (refiner) {
            var showInputDialogCallback = null;
            switch (refiner.Type) {
                case Commerce.Refiners.RefinerType.Text:
                    showInputDialogCallback = RefinerHelper.showTextInputDialogCallback.bind(null, refiner);
                    break;
                case Commerce.Refiners.RefinerType.Date:
                    showInputDialogCallback = RefinerHelper.showDateRangeInputDialogCallback.bind(null, refiner);
                    break;
                default:
                    Commerce.RetailLogger.refinerHelperShowRefinerAsyncUnsupportedRefiner(Commerce.ObjectExtensions.isNullOrUndefined(refiner) ? "NullOrUndefined" : Commerce.Refiners.RefinerType[refiner.Type]);
                    break;
            }
            if (showInputDialogCallback) {
                return showInputDialogCallback();
            }
            else {
                return Commerce.AsyncResult.createResolved(null);
            }
        };
        RefinerHelper.showTextInputDialogCallback = function (refiner) {
            var dialog = RefinerHelper.configureDialog(new Commerce.Controls.TextInputDialog(), Commerce.ViewModelAdapter.getResourceString("string_940"), refiner.KeyName);
            var textInputDialogOptions = {
                content: Commerce.ArrayExtensions.hasElements(refiner.SelectedValues) ? refiner.SelectedValues[0] : Commerce.StringExtensions.EMPTY,
                textInputType: Commerce.Controls.TextInputType.singleLineText
            };
            dialog.show(textInputDialogOptions, false);
            var textInputDialogAsyncResult = Commerce.Activities.ModalDialogHelper.handleDialogResult(dialog, Commerce.DialogResult.OK, function (result) {
                if (Commerce.StringExtensions.isEmptyOrWhitespace(result)) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.REFINER_VALUE_MUST_BE_SET)]);
                }
                else {
                    return Commerce.AsyncResult.createResolved({ canceled: false });
                }
            });
            return textInputDialogAsyncResult.map(function (result) {
                return result.canceled ? null : [result.data];
            }).recoverOnFailure(function () {
                return Commerce.AsyncResult.createResolved(null);
            });
        };
        RefinerHelper.showDateRangeInputDialogCallback = function (refiner) {
            var dialogResult = new Commerce.AsyncResult();
            var dialog = RefinerHelper.configureDialog(new Commerce.Controls.DateRangeInputDialog(), Commerce.ViewModelAdapter.getResourceString("string_940"), refiner.KeyName);
            dialog.show({}).onAny(function (result, dlgResult) {
                var value = null;
                if (dlgResult === Commerce.DialogResult.OK) {
                    refiner.updateSelectedValues(result.startDate, result.endDate);
                    value = refiner.SelectedValues;
                }
                dialogResult.resolve(value);
            });
            return dialogResult;
        };
        RefinerHelper.REFINER_TEXT_VALUE_TEMPLATE_ID = "refinerTextValueTemplate";
        RefinerHelper.REFINER_KEY_VALUE_TEMPLATE_ID = "refinerKeyValueTemplate";
        RefinerHelper.REFINER_DATE_VALUE_TEMPLATE_ID = "refinerDateValueTemplate";
        return RefinerHelper;
    }());
    Commerce.RefinerHelper = RefinerHelper;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.AddEditCustomerActivity.prototype.execute = function () {
            var activityResult = new Commerce.VoidAsyncResult();
            var customerAddEditOperationHandler = new Commerce.CancelableSelectionHandler(function () {
                activityResult.resolve();
            }, function () {
                activityResult.resolve();
            });
            var viewOptions = {
                customer: this.context.customer,
                customerCreatedOrUpdatedHandler: this.context.customerSelectionHandler,
                customerAddEditOperationHandler: customerAddEditOperationHandler
            };
            Commerce.ViewModelAdapter.navigate("CustomerAddEditView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.AddPaymentActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var onPaymentResultAvailableAsync = function (paymentViewResult) {
                var responseHandlerResult;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(paymentViewResult)) {
                    _this.response = { tenderLine: paymentViewResult.paymentResult };
                    if (Commerce.ObjectExtensions.isFunction(_this.responseHandler)) {
                        responseHandlerResult = _this.responseHandler(_this.response);
                    }
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(responseHandlerResult)) {
                    responseHandlerResult = Commerce.AsyncResult.createResolved({ canceled: Commerce.ObjectExtensions.isNullOrUndefined(_this.response) });
                }
                return responseHandlerResult.done(function (result) {
                    if (result.canceled && Commerce.ViewModelAdapter.isInView("PaymentView")) {
                        return;
                    }
                    activityResult.resolve(result);
                });
            };
            var viewOptions = {
                tenderType: this.context.tenderType,
                fullAmountDue: this.context.fullAmountDue,
                onPaymentResultAvailableAsync: onPaymentResultAvailableAsync,
                correlationId: this.context.correlationId || Commerce.StringExtensions.EMPTY,
                cardPaymentOptions: this.context.cardPaymentOptions || null,
                isExemptFromReturnPolicy: !Commerce.ObjectExtensions.isNullOrUndefined(this.context.isExemptFromReturnPolicy) ? this.context.isExemptFromReturnPolicy : false
            };
            Commerce.ViewModelAdapter.navigate("PaymentView", viewOptions);
            return activityResult.done(function (result) {
                if (result.canceled) {
                    Commerce.ViewModelAdapter.collapse(originalViewName);
                }
                else {
                    Commerce.ViewModelAdapter.navigateBack();
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.AddWarrantyToAnExistingTransactionActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var selectionHandler = new Commerce.CancelableSelectionHandler(function (selectedSalesLines) {
                _this.response = { cart: Commerce.Session.instance.cart };
                Commerce.ViewModelAdapter.navigate("CartView");
                activityResult.resolve(void 0);
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve(void 0);
            });
            var viewOptions = {
                salesOrder: this.context.salesOrder,
                selectionHandler: selectionHandler
            };
            Commerce.ViewModelAdapter.navigate("AddWarrantyToAnExistingTransactionView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ApprovePartialAmountActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("Invalid options passed: ApprovePartialAmountActivity was passed invalid options.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.amountAuthorized)) {
                throw new Error("Invalid options passed: ApprovePartialAmountActivity was passed invalid amountAuthorized.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.amountRequested)) {
                throw new Error("Invalid options passed: ApprovePartialAmountActivity was passed invalid amountRequested.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(this.context.amountAuthorizedCurrencyCode)) {
                throw new Error("Invalid options passed: ApprovePartialAmountActivity was passed invalid amountAuthorizedCurrencyCode.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(this.context.amountRequestedCurrencyCode)) {
                throw new Error("Invalid options passed: ApprovePartialAmountActivity was passed invalid amountRequestedCurrencyCode.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(this.context.correlationId)) {
                throw new Error("Invalid options passed: ApprovePartialAmountActivity was passed invalid correlationId.");
            }
            var approvePartialAmountDialog = new Commerce.Controls.ApprovePartialAmountDialog();
            var approvePartialAmountDialogOptions = {
                amountAuthorized: this.context.amountAuthorized,
                amountAuthorizedCurrencyCode: this.context.amountAuthorizedCurrencyCode,
                amountRequested: this.context.amountRequested,
                amountRequestedCurrencyCode: this.context.amountRequestedCurrencyCode,
                correlationId: this.context.correlationId
            };
            Commerce.RetailLogger.posApprovePartialAmountActivityStarted(this.context.correlationId);
            var asyncResult = new Commerce.VoidAsyncResult();
            approvePartialAmountDialog.show(approvePartialAmountDialogOptions, true)
                .on(Commerce.DialogResult.OK, function () {
                _this.response = {
                    isApproved: true
                };
                Commerce.RetailLogger.posApprovePartialAmountActivitySucceeded(_this.context.correlationId, "Approved");
                asyncResult.resolve();
            }).on(Commerce.DialogResult.Cancel, function () {
                _this.response = {
                    isApproved: false
                };
                Commerce.RetailLogger.posApprovePartialAmountActivitySucceeded(_this.context.correlationId, "Not Approved");
                asyncResult.resolve();
            }).onError(function (errors) {
                Commerce.RetailLogger.posApprovePartialAmountActivityFailed(_this.context.correlationId, Commerce.ErrorHelper.serializeError(errors));
                approvePartialAmountDialog.hide().always(function () { asyncResult.reject(errors); });
            });
            return asyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.AssignExtendedLogOnDialogActivity.prototype.execute = function () {
            var _this = this;
            var activityAsyncResult = new Commerce.AsyncResult();
            var dialog = new Commerce.Controls.AssignExtendedLogOnDialog();
            dialog.show({ employee: this.context.employee }).onAny(function (result, dialogResult) {
                if (dialogResult === Commerce.DialogResult.OK) {
                    _this.response = {
                        extendedLogonToken: result.extendedLogonToken,
                        extendedLogonGrantType: result.extendedLogonGrantType
                    };
                }
                else {
                    _this.response = null;
                }
                activityAsyncResult.resolve(void 0);
            }).onError(function (errors) {
                activityAsyncResult.reject(errors);
            });
            return activityAsyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.CashManagementActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var selectionHandler = new Commerce.CancelableSelectionHandler(function (selection) {
                Commerce.ViewModelAdapter.navigateBack();
                _this.response = { transaction: selection };
                activityResult.resolve(void 0);
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve(void 0);
            });
            var viewOptions = {
                transactionType: this.context.transactionType,
                shift: this.context.shift,
                selectionHandler: selectionHandler
            };
            Commerce.ViewModelAdapter.navigate("CashManagementView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.CheckSuspendedTransactionsActivity.prototype.execute = function () {
            var _this = this;
            var viewVoidSelectionMethodDialog = new Commerce.Controls.CheckSuspendedTransactionsDialog();
            var result = new Commerce.AsyncResult();
            var dialogOptions = {};
            var updateResponse = function (dialogResult) {
                return { viewVoidSelectionMethod: dialogResult.viewVoidSelectionMethod };
            };
            viewVoidSelectionMethodDialog.show(dialogOptions, false);
            Activities.ModalDialogHelper.callResponseHandler(this, viewVoidSelectionMethodDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
                else if (_this.response.viewVoidSelectionMethod === Activities.ViewVoidSelectionMethod.ViewAll) {
                    Commerce.ViewModelAdapter.navigate("ResumeCartView");
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ConfirmRelatedLinesVoidActivity.prototype.execute = function () {
            var _this = this;
            var voidAllRelatedLines = "VoidAllRelated";
            var voidOnlySelectedLine = "VoidOnlySelected";
            var listInputDialog = new Commerce.Controls.ListInputDialog();
            var items = [
                {
                    label: Commerce.ViewModelAdapter.getResourceString("string_4470"),
                    value: voidAllRelatedLines
                },
                {
                    label: Commerce.ViewModelAdapter.getResourceString("string_4471"),
                    value: voidOnlySelectedLine
                }
            ];
            var listInputDialogOptions = {
                title: Commerce.ViewModelAdapter.getResourceString("string_4468"),
                subTitle: Commerce.ViewModelAdapter.getResourceString("string_4469"),
                items: items,
                getDisplayNameCallback: function (value) {
                    return value.label;
                }
            };
            listInputDialog.show(listInputDialogOptions, false).on(Commerce.DialogResult.OK, function (result) {
                if (result.value === voidAllRelatedLines) {
                    _this.response = { mode: Activities.RelatedLineVoidMode.All };
                }
                else if (result.value === voidOnlySelectedLine) {
                    _this.response = { mode: Activities.RelatedLineVoidMode.Selected };
                }
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(listInputDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.DepositOverrideActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var selectionHandler = new Commerce.CancelableSelectionHandler(function (selection) {
                Commerce.ViewModelAdapter.navigate("CartView");
                _this.response = { depositOverrideAmount: selection };
                activityResult.resolve();
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve();
            }, function (selection) {
                return _this.responseHandler({ depositOverrideAmount: selection }).map(function () {
                    _this.response = { depositOverrideAmount: selection };
                    return { canceled: false };
                });
            });
            var viewOptions = {
                selectionHandler: selectionHandler
            };
            Commerce.ViewModelAdapter.navigate("DepositOverrideView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.DisplayMessageActivity.prototype.execute = function () {
            var _this = this;
            var buttons = this.context.buttons;
            var hasButton = Commerce.ArrayExtensions.hasElements(buttons);
            if (!hasButton) {
                buttons = [
                    {
                        id: "DefaultMessageDialogButton",
                        label: Commerce.ViewModelAdapter.getResourceString("string_75"),
                        operationId: Commerce.Controls.Dialog.OperationIds.OK_BUTTON_CLICK,
                        isPrimary: true
                    }
                ];
            }
            var messageDialog = new Commerce.Controls.MessageDialog();
            var dialogState = {
                title: this.context.title,
                subTitle: this.context.subTitle,
                content: this.context.message,
                showCloseX: this.context.showCloseX,
                buttons: buttons,
                hideOnEscape: false
            };
            var result = new Commerce.AsyncResult();
            var hideOnResult = this.context.showCloseX === true || !hasButton;
            messageDialog.show(dialogState, hideOnResult).onAny(function (messageDialogResult) {
                _this.response = { operationId: messageDialogResult.toString() };
                if (messageDialogResult === Commerce.DialogResult.No) {
                    messageDialog.hide().done(function () { result.resolve({ canceled: true }); });
                }
            });
            Activities.ModalDialogHelper.callResponseHandler(this, messageDialog, Commerce.DialogResult.Yes, result);
            return result.map(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        var ModalDialogHelper = (function () {
            function ModalDialogHelper() {
            }
            ModalDialogHelper.toVoidAsyncResult = function (dialog, hideOnResult) {
                if (hideOnResult === void 0) { hideOnResult = true; }
                var asyncResult = new Commerce.AsyncResult();
                dialog.dialogResult
                    .on(Commerce.DialogResult.OK, function () {
                    ModalDialogHelper.hideDialogAndResolve(dialog, hideOnResult, asyncResult);
                }).on(Commerce.DialogResult.Cancel, function () {
                    ModalDialogHelper.hideDialogAndResolve(dialog, hideOnResult, asyncResult, true);
                }).on(Commerce.DialogResult.Close, function () {
                    ModalDialogHelper.hideDialogAndResolve(dialog, hideOnResult, asyncResult);
                }).on(Commerce.DialogResult.Yes, function () {
                    ModalDialogHelper.hideDialogAndResolve(dialog, hideOnResult, asyncResult);
                }).on(Commerce.DialogResult.No, function () { asyncResult.resolve({ canceled: false }); })
                    .onError(function (errors) { asyncResult.reject(errors); });
                return asyncResult;
            };
            ModalDialogHelper.callResponseHandler = function (activity, dialog, onDialogResult, asyncResult, updateResponse) {
                var resultHandler = function (result) {
                    if (updateResponse) {
                        activity.response = updateResponse(result);
                    }
                    if (activity.responseHandler) {
                        return activity.responseHandler(activity.response).map(function () { return void 0; });
                    }
                    else {
                        return Commerce.AsyncResult.createResolved();
                    }
                };
                var cancelableDataResult = new Commerce.AsyncResult();
                asyncResult.resolveOrRejectOn(cancelableDataResult);
                ModalDialogHelper._handleDialogResultInternal(dialog, onDialogResult, cancelableDataResult, resultHandler);
            };
            ModalDialogHelper.handleDialogResult = function (dialog, onDialogResult, resultHandler) {
                var asyncResult = new Commerce.AsyncResult();
                ModalDialogHelper._handleDialogResultInternal(dialog, onDialogResult, asyncResult, resultHandler);
                return asyncResult;
            };
            ModalDialogHelper._handleDialogResultInternal = function (dialog, onDialogResult, asyncResult, resultHandler) {
                dialog.dialogResult
                    .on(onDialogResult, function (result) {
                    if (resultHandler) {
                        dialog.indeterminateWaitVisible(true);
                        resultHandler(result)
                            .done(function (handlerResult) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(handlerResult)
                                && Commerce.ObjectExtensions.isBoolean(handlerResult.canceled)
                                && handlerResult.canceled) {
                                dialog.indeterminateWaitVisible(false);
                                dialog.clearResult();
                                dialog.focus();
                                ModalDialogHelper._handleDialogResultInternal(dialog, onDialogResult, asyncResult, resultHandler);
                            }
                            else {
                                dialog.hide().done(function () { asyncResult.resolve({ data: result, canceled: false }); });
                            }
                        }).fail(function (errors) {
                            dialog.indeterminateWaitVisible(false);
                            dialog.clearResult();
                            if (Commerce.Session.instance.isSessionStateValid) {
                                Commerce.NotificationHandler.displayClientErrors(errors)
                                    .done(function () { dialog.focus(); });
                                ModalDialogHelper._handleDialogResultInternal(dialog, onDialogResult, asyncResult, resultHandler);
                            }
                            else {
                                dialog.hide().done(function () { asyncResult.resolve({ data: null, canceled: true }); });
                            }
                        });
                    }
                    else {
                        dialog.hide().done(function () { asyncResult.resolve({ data: result, canceled: false }); });
                    }
                }).on(Commerce.DialogResult.Cancel, function () {
                    dialog.hide().done(function () { asyncResult.resolve({ data: null, canceled: true }); });
                }).onError(function (errors) {
                    dialog.hide().done(function () { asyncResult.reject(errors); });
                });
            };
            ModalDialogHelper.hideDialogAndResolve = function (dialog, hideOnResult, asyncResult, canceled) {
                if (canceled === void 0) { canceled = false; }
                if (hideOnResult) {
                    dialog.hide().done(function () { asyncResult.resolve({ canceled: canceled }); });
                }
                else {
                    asyncResult.resolve({ canceled: canceled });
                }
            };
            return ModalDialogHelper;
        }());
        Activities.ModalDialogHelper = ModalDialogHelper;
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        var paymentMessageDialog;
        Activities.DisplayPaymentMessageDialogActivity.prototype.execute = function () {
            var self = this;
            var dialogState;
            paymentMessageDialog = new Commerce.Controls.PaymentMessageDialog();
            dialogState = {
                title: self.context.title,
                messageText: self.context.messageText,
                buttonText: self.context.buttonText
            };
            paymentMessageDialog.show(dialogState, false);
            return Activities.ModalDialogHelper.toVoidAsyncResult(paymentMessageDialog, true);
        };
        Activities.DisplayPaymentMessageDialogActivity.prototype.cancel = function () {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(paymentMessageDialog)) {
                paymentMessageDialog.hide();
                return Commerce.AsyncResult.createResolved()
                    .always(function () {
                    paymentMessageDialog = null;
                });
            }
            else {
                return Commerce.AsyncResult.createRejected();
            }
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.EditChecklistTaskActivity.prototype.execute = function () {
            var _this = this;
            var editChecklistTaskDialog = new Commerce.Controls.EditChecklistTaskDialog();
            editChecklistTaskDialog.title(this.context.title);
            editChecklistTaskDialog.show(this.context, false)
                .on(Commerce.DialogResult.OK, function (result) {
                editChecklistTaskDialog.hide().done(function () {
                    _this.response = {
                        checklistTask: result.checklistTask
                    };
                });
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(editChecklistTaskDialog, true)
                .map(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.EditSalesOrderAttributesActivity.prototype.execute = function () {
            var _this = this;
            var editSalesOrderAttributesDialog = new Commerce.Controls.EditSalesOrderAttributesDialog();
            var editSalesOrderAttributesDialogOptions = {
                attributeGroupName: this.context.attributeGroupName,
                attributesData: this.context.attributesData
            };
            var activityResult = new Commerce.AsyncResult();
            editSalesOrderAttributesDialog.show(editSalesOrderAttributesDialogOptions)
                .on(Commerce.DialogResult.OK, function (attributeValues) {
                _this.response = { attributeValues: attributeValues };
                activityResult.resolve({ canceled: false });
            }).on(Commerce.DialogResult.Cancel, function () {
                _this.response = null;
                activityResult.resolve({ canceled: true });
            }).onError(function (errors) {
                activityResult.reject(errors);
            });
            var asyncQueue = new Commerce.AsyncQueue();
            return asyncQueue.enqueue(function () {
                return asyncQueue.cancelOn(activityResult);
            }).enqueue(function () {
                if (!Commerce.ObjectExtensions.isFunction(_this.responseHandler)) {
                    return Commerce.AsyncResult.createResolved();
                }
                return _this.responseHandler(_this.response);
            }).run().map(function () { return void 0; });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.EditTimelineItemActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw "EditTimelineItemActivity missing context";
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.timelineItemTypeMaps)) {
                throw "EditTimelineItemActivity missing timelineItemTypeMaps";
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.timelineItemTypeMaps)) {
                throw "EditTimelineItemActivity missing timelineItemTypeMaps";
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.timelineItem)) {
                throw "EditTimelineItemActivity missing timelineItem";
            }
            var timelineItem = this.context.timelineItem;
            timelineItem = Commerce.ObjectExtensions.clone(timelineItem);
            var selectedItemType;
            var asyncQueue = new Commerce.AsyncQueue();
            if (!Commerce.StringExtensions.isNullOrWhitespace(timelineItem.EntityType) &&
                !Commerce.StringExtensions.isNullOrWhitespace(timelineItem.TypeId)) {
                var entityTypeMap = Commerce.ArrayExtensions.firstOrUndefined(this.context.timelineItemTypeMaps, function (item) {
                    return item.EntityType === timelineItem.EntityType;
                });
                if (!Commerce.ObjectExtensions.isNullOrUndefined(entityTypeMap)) {
                    selectedItemType = Commerce.ArrayExtensions.firstOrUndefined(entityTypeMap.Types, function (item) {
                        return item.TypeId === timelineItem.TypeId;
                    });
                }
            }
            asyncQueue.enqueue(function () {
                var timelineCreateEditDialog = new Commerce.Controls.TimelineCreateEditDialog();
                var asyncResult = new Commerce.AsyncResult();
                var mode = _this.context.isCreateMode ? Commerce.Controls.TimelineCreateEditDialogMode.Create :
                    Commerce.Controls.TimelineCreateEditDialogMode.Edit;
                var selectTypeHandler = function (timelineItem) {
                    var activity = new Activities.SelectTimelineTypeActivity({
                        timelineItemTypeMaps: _this.context.timelineItemTypeMaps,
                        timelineItemEntityType: timelineItem.EntityType,
                        timelineItemTypeId: timelineItem.TypeId
                    });
                    return activity.execute().map(function () {
                        var selectTypeHandlerResponse;
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(activity.response)) {
                            selectTypeHandlerResponse = {
                                timelineEntityType: activity.response.entityType,
                                timelineItemType: activity.response.itemType
                            };
                        }
                        return selectTypeHandlerResponse;
                    });
                };
                var timelineItemTypeMap = Commerce.ArrayExtensions.firstOrUndefined(_this.context.timelineItemTypeMaps, function (node) {
                    return node.EntityType === timelineItem.EntityType;
                });
                var canSelectType = Commerce.ArrayExtensions.hasElements(timelineItemTypeMap.Types) &&
                    timelineItemTypeMap.Types.length > 1;
                var timelineCreateEditDialogState = {
                    selectTypeHandler: canSelectType ? selectTypeHandler : null,
                    timelineItem: timelineItem,
                    timelineItemType: selectedItemType,
                    mode: mode
                };
                timelineCreateEditDialog.show(timelineCreateEditDialogState, false);
                Activities.ModalDialogHelper.callResponseHandler(_this, timelineCreateEditDialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                    return { timelineItem: result.timelineItem };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().map(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetAdvancedCustomerSearchActivity.prototype.execute = function () {
            var self = (this);
            var searchRefinerDialog = new Commerce.Controls.SearchRefinerDialog();
            var advancedCustomerSearchFields = Commerce.ApplicationContext.Instance.customerSearchFields.filter(function (value) {
                return value.CanBeRefined;
            });
            var preSelectedValues = Commerce.ArrayExtensions.hasElements(self.context.preSelectedSearchFieldValues) ? self.context.preSelectedSearchFieldValues : [];
            var refiners;
            refiners = advancedCustomerSearchFields.map(function (value) {
                var matchingPreSelectedValues = preSelectedValues.filter(function (preSelectedValue) {
                    return preSelectedValue.SearchField.Name === value.SearchField.Name;
                });
                var selectedValue = null;
                if (Commerce.ArrayExtensions.hasElements(matchingPreSelectedValues)) {
                    selectedValue = matchingPreSelectedValues[0].SearchTerm;
                }
                var refiner = new Commerce.Refiners.TextRefiner(value.SearchField.Name, value.DisplayName, selectedValue, null);
                return refiner;
            });
            var preSelectedSearchLocation = self.context.preSelectedSearchLocation ? self.context.preSelectedSearchLocation : Commerce.Proxy.Entities.SearchLocation.Local;
            var searchRefinerDialogOptions = {
                refiners: refiners,
                preSelectedSearchLocation: preSelectedSearchLocation
            };
            searchRefinerDialog.title(Commerce.ViewModelAdapter.getResourceString("string_1052"));
            searchRefinerDialog.show(searchRefinerDialogOptions, false);
            var asyncResult = new Commerce.AsyncResult();
            Activities.ModalDialogHelper.callResponseHandler(self, searchRefinerDialog, Commerce.DialogResult.OK, asyncResult, function (searchRefinerDialogResult) {
                var selectedSearchFieldValues = [];
                if (Commerce.ArrayExtensions.hasElements(searchRefinerDialogResult.selectedRefiners)) {
                    selectedSearchFieldValues = searchRefinerDialogResult.selectedRefiners.map(function (value) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(value)) {
                            return null;
                        }
                        var criterion = {
                            SearchTerm: value.SelectedValue,
                            SearchField: Commerce.ExtensibleEnumerations.CustomerSearchFieldType.getByName(value.ID)
                        };
                        return criterion;
                    });
                }
                var response = {
                    selectedSearchFieldValues: selectedSearchFieldValues,
                    selectedSearchLocation: searchRefinerDialogResult.selectedSearchLocation
                };
                return response;
            });
            return asyncResult.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetAvailableDiscountsActivity.prototype.execute = function () {
            var activityAsyncResult = new Commerce.AsyncResult();
            var self = (this);
            var availableDiscountsDialog = new Commerce.Controls.AvailableDiscountsDialog(self.context.cartLine);
            var dialogOptions = {
                cartLine: self.context.cartLine,
                product: self.context.product
            };
            availableDiscountsDialog.show(dialogOptions).onAny(function () {
                activityAsyncResult.resolve(void 0);
            }).onError(function (errors) {
                activityAsyncResult.reject(errors);
            });
            return activityAsyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetBankBagNumberActivity.prototype.execute = function () {
            var _this = this;
            var textInputDialog = new Commerce.Controls.TextInputDialog();
            var activityResult = new Commerce.AsyncResult();
            textInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_4129"));
            textInputDialog.show({ maxLength: this.context.bankBagNumberMaxLength, rowsNumber: 1 })
                .on(Commerce.DialogResult.OK, function (inputValue) {
                _this.response = { bagNumber: inputValue };
                activityResult.resolve();
            }).on(Commerce.DialogResult.Cancel, function (result) {
                _this.response = null;
                activityResult.resolve();
            }).onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCancellationChargeActivity.prototype.execute = function () {
            var _this = this;
            var getCancellationChargeDialog = new Commerce.Controls.GetCancellationChargeModalDialog();
            getCancellationChargeDialog.show(this.context, false)
                .on(Commerce.DialogResult.OK, function (chargeAmount) {
                _this.response = { cancellationChargeAmount: chargeAmount };
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getCancellationChargeDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCartLineCommentsActivity.prototype.execute = function () {
            var _this = this;
            var asyncQueue = new Commerce.AsyncQueue();
            var comments = [];
            var textInputDialog = new Commerce.Controls.TextInputDialog();
            asyncQueue
                .enqueue(function () {
                var result = createProductCommentQueue(textInputDialog, _this.context.cartLines, comments).run();
                return asyncQueue.cancelOn(result);
            }).enqueue(function () {
                _this.response = { comments: comments };
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(_this, textInputDialog, Commerce.DialogResult.OK, asyncResult);
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
        function createProductCommentQueue(textInputDialog, cartLines, comments) {
            var asyncQueue = new Commerce.AsyncQueue();
            cartLines.forEach(function (cartLine) {
                asyncQueue.enqueue(function () {
                    textInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_186"));
                    textInputDialog.subTitle(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_929"), cartLine.ItemId, cartLine.Description));
                    textInputDialog.subTitleCssClass("primaryFontColor");
                    textInputDialog.show({
                        content: cartLine.Comment,
                        maxLength: 60,
                        rowsNumber: 2,
                        hideScrollbar: true,
                        enterKeyDisabled: true,
                        labelResx: "string_197"
                    }, false)
                        .on(Commerce.DialogResult.OK, function (comment) {
                        comments.push(comment);
                    }).on(Commerce.DialogResult.Cancel, function () {
                        textInputDialog.hide();
                    });
                    return asyncQueue.cancelOn(Activities.ModalDialogHelper.toVoidAsyncResult(textInputDialog, false));
                });
            });
            return asyncQueue;
        }
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCartLineDiscountsActivity.prototype.execute = function () {
            var self = (this);
            var asyncQueue = new Commerce.AsyncQueue();
            var discounts = [];
            var addDiscountDialog = new Commerce.Controls.AddDiscountDialog();
            asyncQueue
                .enqueue(function () {
                var result = createProductDiscountQueue(addDiscountDialog, self.context, discounts).run();
                return asyncQueue.cancelOn(result);
            }).enqueue(function () {
                self.response = { discounts: discounts };
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, addDiscountDialog, Commerce.DialogResult.OK, asyncResult, function (result) { return { discounts: [result.discountValue] }; });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
        function createProductDiscountQueue(addDiscountDialog, context, discounts) {
            var asyncQueue = new Commerce.AsyncQueue();
            context.cartLines.forEach(function (cartLine) {
                asyncQueue.enqueue(function () {
                    var dialogState = {
                        cartLine: cartLine,
                        discountType: context.isPercent
                            ? Commerce.Proxy.Entities.ManualDiscountType.LineDiscountPercent
                            : Commerce.Proxy.Entities.ManualDiscountType.LineDiscountAmount
                    };
                    addDiscountDialog.show(dialogState, false)
                        .on(Commerce.DialogResult.OK, function (result) {
                        discounts.push(result.discountValue);
                    }).on(Commerce.DialogResult.Cancel, function () {
                        addDiscountDialog.hide().done(function () { asyncQueue.cancel(); });
                    });
                    return Activities.ModalDialogHelper.toVoidAsyncResult(addDiscountDialog, false);
                });
            });
            return asyncQueue;
        }
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCartLineQuantitiesActivity.prototype.execute = function () {
            var self = (this);
            var setQuantityDialog = new Commerce.Controls.SetQuantityDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                setQuantityDialog.show({ cartLines: self.context.cartLines }, false)
                    .on(Commerce.DialogResult.OK, function (result) {
                    self.response = { quantities: [].concat(result.quantities) };
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(setQuantityDialog, false);
            }).enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, setQuantityDialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                    return { quantities: [].concat(result.quantities) };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCartLineUnitOfMeasuresActivity.prototype.execute = function () {
            var self = (this);
            var unitOfMeasureDialog = new Commerce.Controls.UnitOfMeasureDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                var dialogOptions = {
                    cartLinesWithUnitOfMeasureOptions: self.context.cartLinesWithUnitOfMeasureOptions
                };
                unitOfMeasureDialog.show(dialogOptions, false)
                    .on(Commerce.DialogResult.OK, function (result) {
                    self.response = { selectedUnitsOfMeasure: [].concat(result.selectedUnitsOfMeasure) };
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(unitOfMeasureDialog, true);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCartLineWeightActivity.prototype.execute = function () {
            var self = (this);
            var weighItemDialog = new Commerce.Controls.WeighItemDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                weighItemDialog.show({ cartLines: [self.context.cartLine] }, false)
                    .on(Commerce.DialogResult.OK, function (result) {
                    self.response = { weight: result.weights[0] };
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(weighItemDialog, false);
            }).enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, weighItemDialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                    return { weight: result.weights[0] };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCashBackAmountActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("Invalid options passed: GetCashBackAmountActivity was passed invalid options.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(this.context.correlationId)) {
                throw new Error("Invalid options passed: GetCashBackAmountActivity was passed invalid correlationId.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.cashBackAmount)) {
                throw new Error("Invalid options passed: GetCashBackAmountActivity was passed invalid cashBackAmount.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.denominations)) {
                throw new Error("Invalid options passed: GetCashBackAmountActivity was passed invalid denominations.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.maximumCashBackAmount)) {
                throw new Error("Invalid options passed: GetCashBackAmountActivity was passed invalid maximumCashBackAmount.");
            }
            var cashBackDialog = new Commerce.Controls.CashbackDialog();
            var cashbackDialogOptions = {
                correlationId: this.context.correlationId,
                cashbackAmount: 0,
                denominations: this.context.denominations,
                maximumCashbackAmount: this.context.maximumCashBackAmount
            };
            var asyncResult = new Commerce.VoidAsyncResult();
            Commerce.RetailLogger.posGetCashBackAmountActivityStarted(this.context.correlationId);
            cashBackDialog.show(cashbackDialogOptions, true)
                .on(Commerce.DialogResult.OK, function (cashbackAmount) {
                _this.response = { canceled: false, cashBackAmount: cashbackAmount };
                Commerce.RetailLogger.posGetCashBackAmountActivitySucceeded(_this.context.correlationId, cashbackAmount, "OK");
                asyncResult.resolve();
            }).on(Commerce.DialogResult.No, function (cashbackAmount) {
                _this.response = { canceled: false, cashBackAmount: 0 };
                Commerce.RetailLogger.posGetCashBackAmountActivitySucceeded(_this.context.correlationId, 0, "No cash back");
                asyncResult.resolve();
            }).on(Commerce.DialogResult.Cancel, function (cashbackAmount) {
                _this.response = { canceled: true, cashBackAmount: null };
                Commerce.RetailLogger.posGetCashBackAmountActivitySucceeded(_this.context.correlationId, 0, "Cancel");
                asyncResult.resolve();
            }).onError(function (errors) {
                Commerce.RetailLogger.posGetCashBackAmountActivityFailed(_this.context.correlationId, Commerce.ErrorHelper.serializeError(errors));
                asyncResult.reject(errors);
            });
            return asyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCashManagementTransactionAmountActivity.prototype.execute = function () {
            var _this = this;
            Commerce.RetailLogger.getCashManagementTransactionAmountActivityStarted(this.context.correlationId, this.context.transactionType.Name);
            var dialog = new Commerce.Controls.GetCashManagementTransactionAmountDialog({
                title: this.context.title,
                transactionType: this.context.transactionType
            });
            var activityResult = new Commerce.AsyncResult();
            dialog.show(null, true)
                .on(Commerce.DialogResult.OK, function (dialogResponse) {
                Commerce.RetailLogger.getCashManagementTransactionAmountActivitySucceeded(_this.context.correlationId, _this.context.transactionType.Name, "Completed");
                _this.response = {
                    amount: dialogResponse.amount,
                    tenderCountingRequired: dialogResponse.tenderCountingRequired
                };
                activityResult.resolve(void 0);
            }).on(Commerce.DialogResult.Cancel, function (dialogResponse) {
                Commerce.RetailLogger.getCashManagementTransactionAmountActivitySucceeded(_this.context.correlationId, _this.context.transactionType.Name, "Cancelled");
                _this.response = null;
                activityResult.resolve(void 0);
            }).on(Commerce.DialogResult.Close, function (dialogResponse) {
                Commerce.RetailLogger.getCashManagementTransactionAmountActivitySucceeded(_this.context.correlationId, _this.context.transactionType.Name, "Closed");
                _this.response = null;
                activityResult.resolve(void 0);
            }).onError(function (errors) {
                Commerce.RetailLogger.getCashManagementTransactionAmountActivityFailed(_this.context.correlationId, _this.context.transactionType.Name, Commerce.ErrorHelper.serializeError(errors));
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCashManagementTransactionDetailsActivity.prototype.execute = function () {
            var _this = this;
            Commerce.RetailLogger.getCashManagementTransactionDetailsActivityStarted(this.context.correlationId, this.context.transactionType.Name);
            var dialog = new Commerce.Controls.GetCashManagementTransactionDetailsDialog({
                correlationId: this.context.correlationId,
                title: this.context.title,
                transactionContext: this.context.transactionContext,
                transactionType: this.context.transactionType,
                amount: this.context.amount,
                contextShift: this.context.contextShift,
                contextStoreSafe: this.context.contextStoreSafe,
                createFromAvailableEntry: this.context.createFromAvailableEntry,
                selectedAvailableEntry: this.context.selectedAvailableEntry,
                availableShifts: this.context.availableShifts,
                availableStoreSafes: this.context.availableStoreSafes
            });
            var activityResult = new Commerce.AsyncResult();
            var updateResponse = function (dialogResponse) {
                Commerce.RetailLogger.getCashManagementTransactionDetailsActivitySucceeded(_this.context.correlationId, _this.context.transactionType.Name, "Completed");
                return {
                    sourceShift: dialogResponse.sourceShift,
                    destinationShift: dialogResponse.destinationShift,
                    sourceStoreSafe: dialogResponse.sourceStoreSafe,
                    destinationStoresafe: dialogResponse.destinationStoresafe,
                    notes: dialogResponse.notes,
                    amount: dialogResponse.amount
                };
            };
            dialog.show(null, false)
                .on(Commerce.DialogResult.Close, function (dialogResponse) {
                Commerce.RetailLogger.getCashManagementTransactionDetailsActivitySucceeded(_this.context.correlationId, _this.context.transactionType.Name, "Closed");
                dialog.hide().done(function () { activityResult.resolve({ canceled: true }); });
            });
            Activities.ModalDialogHelper.callResponseHandler(this, dialog, Commerce.DialogResult.OK, activityResult, updateResponse);
            return activityResult.map(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCashManagementTransactionSourceActivity.prototype.execute = function () {
            var _this = this;
            Commerce.RetailLogger.getCashManagementTransactionSourceActivityStarted(this.context.correlationId, this.context.transactionType.Name);
            var dialog = new Commerce.Controls.GetCashManagementTransactionSourceDialog({
                title: this.context.title,
                transactionType: this.context.transactionType,
                availableEntries: this.context.availableEntries,
                allEmployees: this.context.allEmployees,
                storeSafes: this.context.storeSafes
            });
            var activityResult = new Commerce.AsyncResult();
            dialog.show(null, true)
                .on(Commerce.DialogResult.OK, function (dialogResponse) {
                Commerce.RetailLogger.getCashManagementTransactionSourceSucceeded(_this.context.correlationId, _this.context.transactionType.Name, "Completed");
                _this.response = {
                    createFromAvailableEntry: dialogResponse.createFromAvailableEntry,
                    selectedAvailableEntry: dialogResponse.selectedAvailableEntry
                };
                activityResult.resolve(void 0);
            }).on(Commerce.DialogResult.Cancel, function (dialogResponse) {
                Commerce.RetailLogger.getCashManagementTransactionSourceSucceeded(_this.context.correlationId, _this.context.transactionType.Name, "Cancelled");
                _this.response = null;
                activityResult.resolve(void 0);
            }).on(Commerce.DialogResult.Close, function (dialogResponse) {
                Commerce.RetailLogger.getCashManagementTransactionSourceSucceeded(_this.context.correlationId, _this.context.transactionType.Name, "Closed");
                _this.response = null;
                activityResult.resolve(void 0);
            }).onError(function (errors) {
                Commerce.RetailLogger.getCashManagementTransactionSourceActivityFailed(_this.context.correlationId, _this.context.transactionType.Name, Commerce.ErrorHelper.serializeError(errors));
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetChargeAmountActivity.prototype.execute = function () {
            var _this = this;
            var getChargeAmountDialog = new Commerce.Controls.GetChargeAmountDialog();
            getChargeAmountDialog.show(this.context, false)
                .on(Commerce.DialogResult.OK, function (activityResponse) {
                _this.response = activityResponse;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getChargeAmountDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetChargeCodesActivity.prototype.execute = function () {
            var _this = this;
            var getChargeCodesDialog = new Commerce.Controls.GetChargeCodesDialog();
            getChargeCodesDialog.show(this.context, false)
                .on(Commerce.DialogResult.OK, function (activityResponse) {
                _this.response = activityResponse;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getChargeCodesDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetClientBookRefinersActivity.prototype.execute = function () {
            var _this = this;
            Commerce.RetailLogger.getClientBookRefinersActivityStarted(this.context.correlationId);
            var refinerDialog = new Commerce.Controls.RefinerDialog();
            refinerDialog.title(Commerce.ViewModelAdapter.getResourceString("string_30248"));
            var dialogState = {
                refiners: this.context.clientBookRefiners,
                createRefinerControlHandler: createRefinerControl,
                getSelectedRefinerValuesHandler: getSelectedRefinerValues
            };
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { clientBookRefinerValues: dialogResult };
            };
            refinerDialog.show(dialogState, false);
            Activities.ModalDialogHelper.callResponseHandler(this, refinerDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                Commerce.RetailLogger.getClientBookRefinersActivitySucceeded(_this.context.correlationId);
                if (result.canceled) {
                    Commerce.RetailLogger.getClientBookRefinersActivityCancelled(_this.context.correlationId);
                    _this.response = {
                        clientBookRefinerValues: []
                    };
                }
            }).fail(function (errors) {
                Commerce.RetailLogger.getClientBookRefinersActivityFailed(_this.context.correlationId, JSON.stringify(errors));
            });
        };
        function getSelectedRefinerValues(refiners) {
            var selectedValues = [];
            refiners.forEach(function (refiner) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(refiner.SelectedValues)) {
                    selectedValues = selectedValues.concat(refiner.SelectedValues);
                }
            });
            return selectedValues;
        }
        function createRefinerControl(refiner, container, refinerRemovedHandler) {
            if (refiner.DisplayTemplateValue !== 0 && refiner.DisplayTemplateValue !== 1
                && refiner.DisplayTemplateValue !== 3 && refiner.DisplayTemplateValue !== 4) {
                Commerce.RetailLogger.viewsControlsRefinersDisplayTemplateNotSupported(JSON.stringify(refiner));
                return false;
            }
            var subTitle = Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_937"), refiner.KeyName.toLowerCase());
            ko.cleanNode(container);
            switch (refiner.DisplayTemplateValue) {
                case Commerce.Proxy.Entities.DisplayTemplate.List:
                    if (refiner.RefinerTypeValue === Commerce.Proxy.Entities.RefinerType.SingleSelect
                        || refiner.RefinerTypeValue === Commerce.Proxy.Entities.RefinerType.MultiSelect) {
                        if (!Commerce.ArrayExtensions.hasElements(refiner.Values)) {
                            Commerce.ViewModelAdapter.displayMessage(Commerce.ViewModelAdapter.getResourceString("string_4164"), Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default);
                            return false;
                        }
                        var getDisplayNameCallback = function (value) {
                            if (refiner.DataTypeValue === Commerce.Proxy.Entities.AttributeDataType.Decimal) {
                                var decimalUnitSymbol = value.UnitText;
                                if (Commerce.StringExtensions.isNullOrWhitespace(decimalUnitSymbol)) {
                                    value.LeftValueBoundString = Commerce.NumberExtensions.formatNumber(Commerce.NumberExtensions.parseNumber(value.LeftValueBoundString), Commerce.NumberExtensions.getDecimalPrecision());
                                }
                                else {
                                    var decimalPrecision = Commerce.UnitOfMeasureHelper.getDecimalPrecision(value.UnitText);
                                    value.LeftValueBoundString = Commerce.NumberExtensions.formatNumber(Commerce.NumberExtensions.parseNumber(value.LeftValueBoundString), decimalPrecision);
                                }
                            }
                            else if (refiner.DataTypeValue === Commerce.Proxy.Entities.AttributeDataType.TrueFalse) {
                                value.LeftValueBoundString = Commerce.Formatters.YesNoAttributeFormatter(value.RightValueBoundString);
                            }
                            return value.LeftValueBoundString;
                        };
                        ko.applyBindingsToNode(container, {
                            selectRefinerControl: {
                                refiner: refiner,
                                showInputDialogCallback: refiner.RefinerTypeValue === 0 ?
                                    Commerce.RefinerHelper.showSingleSelectListInputDialogCallback.bind(null, subTitle, refiner.Values, getDisplayNameCallback) :
                                    Commerce.RefinerHelper.showMultiSelectListInputDialogCallback.bind(null, subTitle, refiner.Values, getDisplayNameCallback),
                                refinerValueTemplate: "refinerValueTemplate",
                                refinerRemovedHandler: refinerRemovedHandler.bind(null, refiner)
                            }
                        });
                    }
                    else {
                        Commerce.RetailLogger.viewsControlsRefinersDisplayTemplateNotSupported(JSON.stringify(refiner));
                        return false;
                    }
                    break;
                case Commerce.Proxy.Entities.DisplayTemplate.Slider:
                    ko.applyBindingsToNode(container, { sliderRefinerControl: refiner });
                    break;
                case Commerce.Proxy.Entities.DisplayTemplate.Range:
                    if (!Commerce.ArrayExtensions.hasElements(refiner.Values)) {
                        Commerce.ViewModelAdapter.displayMessage(Commerce.ViewModelAdapter.getResourceString("string_4164"), Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default);
                        return false;
                    }
                    ko.applyBindingsToNode(container, {
                        selectRefinerControl: {
                            refiner: refiner,
                            showInputDialogCallback: showRefinerRangeInputDialogCallback.bind(null, subTitle, refiner.Values),
                            refinerValueTemplate: "refinerRangeValueTemplate",
                            refinerRemovedHandler: refinerRemovedHandler.bind(null, refiner)
                        }
                    });
                    break;
                case Commerce.Proxy.Entities.DisplayTemplate.TextBox:
                    ko.applyBindingsToNode(container, {
                        selectRefinerControl: {
                            refiner: refiner,
                            showInputDialogCallback: showRefinerTextInputDialogCallback.bind(null, refiner),
                            refinerValueTemplate: "refinerValueTemplate",
                            refinerRemovedHandler: refinerRemovedHandler.bind(null, refiner)
                        }
                    });
                    break;
            }
            return true;
        }
        function showRefinerRangeInputDialogCallback(subTitle, refinerValues) {
            var dialogResult = new Commerce.AsyncResult();
            var localRefinerValues = refinerValues.slice();
            var customRefinerValue = new Commerce.Proxy.Entities.ClientBookRefinerValueClass();
            customRefinerValue.RefinerRecordId = refinerValues[0].RefinerRecordId;
            customRefinerValue.LeftValueBoundString = Commerce.StringExtensions.EMPTY;
            customRefinerValue.RightValueBoundString = Commerce.StringExtensions.EMPTY;
            customRefinerValue.DataTypeValue = refinerValues[0].DataTypeValue;
            customRefinerValue.RefinerSourceValue = refinerValues[0].RefinerSourceValue;
            localRefinerValues.push(customRefinerValue);
            var getDisplayNameCallback = function (value) {
                if (Commerce.StringExtensions.isEmpty(value.LeftValueBoundString) && Commerce.StringExtensions.isEmpty(value.RightValueBoundString)) {
                    return Commerce.ViewModelAdapter.getResourceString("string_4192");
                }
                else if (Commerce.StringExtensions.isEmpty(value.LeftValueBoundString)) {
                    return Commerce.StringExtensions.format("<{0}", value.RightValueBoundString);
                }
                else if (Commerce.StringExtensions.isEmpty(value.RightValueBoundString)) {
                    return Commerce.StringExtensions.format(">{0}", value.LeftValueBoundString);
                }
                else {
                    return Commerce.StringExtensions.format("{0}-{1}", value.LeftValueBoundString, value.RightValueBoundString);
                }
            };
            Commerce.RefinerHelper.showSingleSelectListInputDialogCallback(subTitle, localRefinerValues, getDisplayNameCallback)
                .done(function (clientBookRefinerValues) {
                if (Commerce.ArrayExtensions.hasElements(clientBookRefinerValues) &&
                    Commerce.StringExtensions.isEmpty(clientBookRefinerValues[0].LeftValueBoundString) &&
                    Commerce.StringExtensions.isEmpty(clientBookRefinerValues[0].RightValueBoundString)) {
                    var dialog = Commerce.RefinerHelper.configureDialog(new Commerce.Controls.NumberRangeInputDialog(), subTitle, Commerce.StringExtensions.EMPTY);
                    dialog.show({}).onAny(function (result, dlgResult) {
                        if (dlgResult === Commerce.DialogResult.OK) {
                            customRefinerValue.LeftValueBoundString = Commerce.ObjectExtensions.isNullOrUndefined(result.minimum) ?
                                Commerce.StringExtensions.EMPTY : result.minimum.toString();
                            customRefinerValue.RightValueBoundString = Commerce.ObjectExtensions.isNullOrUndefined(result.maximum) ?
                                Commerce.StringExtensions.EMPTY : result.maximum.toString();
                            dialogResult.resolve([customRefinerValue]);
                        }
                        else {
                            dialogResult.resolve(null);
                        }
                    });
                    return;
                }
                dialogResult.resolve(clientBookRefinerValues);
            });
            return dialogResult;
        }
        function showRefinerTextInputDialogCallback(refiner) {
            var dialog = Commerce.RefinerHelper.configureDialog(new Commerce.Controls.TextInputDialog(), Commerce.ViewModelAdapter.getResourceString("string_940"), refiner.KeyName);
            var textInputDialogOptions = {
                content: Commerce.ArrayExtensions.hasElements(refiner.SelectedValues) ? refiner.SelectedValues[0].LeftValueBoundString : Commerce.StringExtensions.EMPTY,
                textInputType: Commerce.Controls.TextInputType.singleLineText
            };
            dialog.show(textInputDialogOptions, false);
            var textInputDialogAsyncResult = Commerce.Activities.ModalDialogHelper.handleDialogResult(dialog, Commerce.DialogResult.OK, function (result) {
                if (Commerce.StringExtensions.isEmptyOrWhitespace(result)) {
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.REFINER_VALUE_MUST_BE_SET)]);
                }
                else {
                    return Commerce.AsyncResult.createResolved({ canceled: false });
                }
            });
            return textInputDialogAsyncResult.map(function (result) {
                if (!result.canceled) {
                    var refinerValue = new Commerce.Proxy.Entities.ClientBookRefinerValueClass();
                    refinerValue.RefinerRecordId = refiner.RecordId;
                    refinerValue.LeftValueBoundString = result.data;
                    refinerValue.RightValueBoundString = result.data;
                    refinerValue.DataTypeValue = refiner.DataTypeValue;
                    refinerValue.RefinerSourceValue = refiner.SourceValue;
                    return [refinerValue];
                }
                return null;
            }).recoverOnFailure(function () {
                return Commerce.AsyncResult.createResolved(null);
            });
        }
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCouponCodeActivity.prototype.execute = function () {
            var self = (this);
            var asyncQueue = new Commerce.AsyncQueue();
            var numpadDialog = new Commerce.Controls.NumpadDialog();
            var numpadDialogOptions = {
                numpadDialogType: Commerce.Controls.NumpadDialogTypes.Alphanumeric,
                enableMagneticStripReader: true,
                enableBarcodeScanner: true,
                numpadLabel: Commerce.ViewModelAdapter.getResourceString("string_13052")
            };
            numpadDialog.title(Commerce.ViewModelAdapter.getResourceString("string_13051"));
            asyncQueue
                .enqueue(function () {
                numpadDialog.show(numpadDialogOptions, false);
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, numpadDialog, Commerce.DialogResult.OK, asyncResult, function (numpadDialogResult) {
                    return { couponCode: numpadDialogResult.value };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCurrencyAmountActivity.prototype.execute = function () {
            var self = (this);
            var context = self.context;
            var numpadDialog = new Commerce.Controls.NumpadDialog();
            var numpadDialogOptions = {
                numpadDialogType: Commerce.Controls.NumpadDialogTypes.Currency,
                enableMagneticStripReader: false,
                enableBarcodeScanner: false,
                numpadLabel: Commerce.ViewModelAdapter.getResourceString("string_4195")
            };
            if (!Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                numpadDialog.title(context.title);
                numpadDialog.subTitle(context.subTitle);
                numpadDialogOptions.value = context.amount;
                numpadDialogOptions.decimalPrecision = context.decimalPrecision;
            }
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { amount: dialogResult.value };
            };
            numpadDialog.show(numpadDialogOptions, false);
            Activities.ModalDialogHelper.callResponseHandler(self, numpadDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCustomerAccountDepositAmountActivity.prototype.execute = function () {
            var self = (this);
            var amountInputDialog = new Commerce.Controls.PriceInputDialog();
            var dialogState = {
                defaultPrice: 0,
                minPrice: Number.NaN,
                maxPrice: Number.NaN,
                minPriceInclusive: true,
                maxPriceInclusive: true
            };
            amountInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_1927"));
            amountInputDialog.label(Commerce.ViewModelAdapter.getResourceString("string_1928"));
            amountInputDialog.show(dialogState, false)
                .on(Commerce.DialogResult.OK, function (result) {
                self.response = { amount: result };
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(amountInputDialog);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCustomerAccountDepositLineCommentsActivity.prototype.execute = function () {
            var self = (this);
            var asyncQueue = new Commerce.AsyncQueue();
            var comments = [];
            var textInputDialog = new Commerce.Controls.TextInputDialog();
            asyncQueue
                .enqueue(function () {
                var result = createLineCommentQueue(textInputDialog, self.context.customerAccountDepositLines, comments).run();
                return asyncQueue.cancelOn(result);
            }).enqueue(function () {
                self.response = { comments: comments };
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, textInputDialog, Commerce.DialogResult.OK, asyncResult);
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
        function createLineCommentQueue(textInputDialog, customerAccountDepositLines, comments) {
            var asyncQueue = new Commerce.AsyncQueue();
            customerAccountDepositLines.forEach(function (line) {
                asyncQueue.enqueue(function () {
                    textInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_8100"));
                    textInputDialog.show({ content: line.Comment, maxLength: 60 }, false)
                        .on(Commerce.DialogResult.OK, function (comment) {
                        comments.push(comment);
                    }).on(Commerce.DialogResult.Cancel, function () {
                        textInputDialog.hide();
                    });
                    return asyncQueue.cancelOn(Activities.ModalDialogHelper.toVoidAsyncResult(textInputDialog, false));
                });
            });
            return asyncQueue;
        }
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetCustomerContactInfoActivity.prototype.execute = function () {
            var _this = this;
            var dialogState = {
                contactInfo: this.context.customerContactInfo
            };
            var customerContactInfoDialog = new Commerce.Controls.CustomerContactInfoDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                customerContactInfoDialog.show(dialogState, false);
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(_this, customerContactInfoDialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                    return {
                        customerContactInfo: result.customerContactInfo,
                    };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetDateActivity.prototype.execute = function () {
            var self = (this);
            var dialog = new Commerce.Controls.DateInputDialog();
            dialog.title(self.context.title);
            dialog.subTitle(self.context.subTitle);
            dialog.show({
                minYear: self.context.minYear,
                maxYear: self.context.maxYear
            }, false)
                .on(Commerce.DialogResult.OK, function (result) {
                self.response = { date: result };
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(dialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetDenominationAmountActivity.prototype.execute = function () {
            var self = (this);
            var result = new Commerce.AsyncResult();
            var decimalPrecision = Commerce.NumberExtensions.getDecimalPrecision(self.context.currency);
            var denominationLineDetailsViewModelOptions = {
                currency: self.context.currency,
                denomination: self.context.denomination,
                currencyTotal: self.context.currencyTotal,
                value: self.context.amount,
                denominationMode: Commerce.ViewModels.IDenominationLineDetailsMode.Amount
            };
            var viewModelContext = {
                runtime: Commerce.Runtime,
                managerFactory: Commerce.Model.Managers.Factory,
                peripherals: Commerce.Peripherals.instance,
                stringResourceManager: Commerce.StringResourceManager,
                triggerManager: Commerce.Triggers.TriggerManager.instance
            };
            var denominationLineDetailsViewModel = new Commerce.ViewModels.DenominationLineDetailsViewModel(viewModelContext, denominationLineDetailsViewModelOptions);
            var numpadDialog = new Commerce.Controls.NumpadDialog();
            var numpadDialogOptions;
            numpadDialog.title(self.context.title);
            numpadDialogOptions = {
                numpadDialogType: Commerce.Controls.NumpadDialogTypes.Currency,
                enableMagneticStripReader: false,
                enableBarcodeScanner: false,
                numpadLabel: Commerce.ViewModelAdapter.getResourceString("string_4011"),
                decimalPrecision: decimalPrecision,
                enableAllowDialogSuccessOnEmptyText: true,
                value: Commerce.NumberExtensions.formatNumber(self.context.amount, decimalPrecision),
                customControlData: {
                    templateID: "denominationDialogTemplate",
                    data: denominationLineDetailsViewModel
                }
            };
            numpadDialog.show(numpadDialogOptions);
            Activities.ModalDialogHelper.callResponseHandler(self, numpadDialog, Commerce.DialogResult.OK, result, function () {
                return {
                    quantity: denominationLineDetailsViewModel.quantity,
                    amount: denominationLineDetailsViewModel.amount,
                    currencyTotal: denominationLineDetailsViewModel.total
                };
            });
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetDenominationQuantityActivity.prototype.execute = function () {
            var self = (this);
            var result = new Commerce.AsyncResult();
            var denominationLineDetailsViewModelOptions = {
                currency: self.context.currency,
                denomination: self.context.denomination,
                currencyTotal: self.context.currencyTotal,
                value: self.context.quantity,
                denominationMode: Commerce.ViewModels.IDenominationLineDetailsMode.Quantity
            };
            var viewModelContext = {
                runtime: Commerce.Runtime,
                managerFactory: Commerce.Model.Managers.Factory,
                peripherals: Commerce.Peripherals.instance,
                stringResourceManager: Commerce.StringResourceManager,
                triggerManager: Commerce.Triggers.TriggerManager.instance
            };
            var denominationLineDetailsViewModel = new Commerce.ViewModels.DenominationLineDetailsViewModel(viewModelContext, denominationLineDetailsViewModelOptions);
            var numpadDialog = new Commerce.Controls.NumpadDialog();
            var numpadDialogOptions;
            var numpadInputValue = ko.observable(Commerce.NumberExtensions.formatNumber(self.context.quantity, 0));
            numpadDialog.title(self.context.title);
            numpadDialogOptions = {
                numpadDialogType: Commerce.Controls.NumpadDialogTypes.Numeric,
                enableMagneticStripReader: false,
                enableBarcodeScanner: false,
                numpadLabel: Commerce.ViewModelAdapter.getResourceString("string_3372"),
                decimalPrecision: 0,
                enableAllowDialogSuccessOnEmptyText: true,
                value: numpadInputValue,
                customControlData: {
                    templateID: "denominationDialogTemplate",
                    data: denominationLineDetailsViewModel
                }
            };
            numpadDialog.show(numpadDialogOptions);
            Activities.ModalDialogHelper.callResponseHandler(self, numpadDialog, Commerce.DialogResult.OK, result, function () {
                return {
                    quantity: denominationLineDetailsViewModel.quantity,
                    amount: denominationLineDetailsViewModel.amount,
                    currencyTotal: denominationLineDetailsViewModel.total
                };
            });
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetDenominationTotalsActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var denominationsSelectionHandler = new Commerce.CancelableSelectionHandler(function (result) {
                Commerce.ViewModelAdapter.navigateBack();
                _this.response = { denominationDetails: result };
                activityResult.resolve(void 0);
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve(void 0);
            });
            var tenderName;
            var tenderType = Commerce.ApplicationContext.Instance.tenderTypesMap.getTenderByTypeId(this.context.tenderTypeId);
            if (tenderType.OperationId === Commerce.Operations.RetailOperation.PayCurrency
                && !Commerce.ObjectExtensions.isNullOrUndefined(this.context.currencyCode)) {
                tenderName = Commerce.StringExtensions.format("{0} - {1}", tenderType.Name, this.context.currencyCode);
            }
            else {
                tenderName = tenderType.Name;
            }
            var options = {
                operationTitle: this.context.pageTitle,
                tenderName: tenderName,
                denominationDetails: this.context.denominationDetails,
                selectionHandler: denominationsSelectionHandler,
                correlationId: this.context.correlationId
            };
            Commerce.ViewModelAdapter.navigate("DenominationsView", options);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetEmailForReceiptActivity.prototype.execute = function () {
            var self = this;
            var dialogState = {
                emailAddress: self.context.emailAddress,
                shouldPromptToSaveEmail: !Commerce.ObjectExtensions.isNullOrUndefined(self.context.saveEmailToCustomerEnabled) ?
                    self.context.saveEmailToCustomerEnabled :
                    !Commerce.StringExtensions.isNullOrWhitespace(Commerce.Session.instance.cart.CustomerId),
                shouldSaveEmail: false
            };
            var emailReceiptDialog = new Commerce.Controls.EmailReceiptDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                emailReceiptDialog.show(dialogState, false);
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, emailReceiptDialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                    return { emailAddress: result.emailAddress, saveEmailOnCustomer: result.shouldSaveEmail };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetFulfillmentLineSearchCriteriaActivity.prototype.execute = function () {
            var self = this;
            var refinerDialog = new Commerce.Controls.RefinerDialog();
            refinerDialog.title(Commerce.ViewModelAdapter.getResourceString("string_13114"));
            var dialogState = {
                refiners: Commerce.FulfillmentLineSearchCriteriaConverter.getRefiners(self.context.fulfillmentLineSearchCriteria),
                createRefinerControlHandler: Commerce.RefinerHelper.createRefinerControl,
                getSelectedRefinerValuesHandler: Commerce.FulfillmentLineSearchCriteriaConverter.getFulfillmentLineSearchCriteria
            };
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { fulfillmentLineSearchCriteria: dialogResult };
            };
            refinerDialog.show(dialogState, false);
            Activities.ModalDialogHelper.callResponseHandler(self, refinerDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetGiftCardActivity.prototype.execute = function () {
            var self = (this);
            var asyncQueue = new Commerce.AsyncQueue();
            var numpadDialog = new Commerce.Controls.NumpadDialog();
            var numpadDialogOptions = {
                numpadDialogType: Commerce.Controls.NumpadDialogTypes.Alphanumeric,
                enableMagneticStripReader: true,
                enableBarcodeScanner: true,
                numpadLabel: Commerce.ViewModelAdapter.getResourceString("string_3270"),
                value: self.context.defaultGiftCardId,
                enableAllowDialogSuccessOnEmptyText: true
            };
            var titleResourceID = Commerce.StringExtensions.isNullOrWhitespace(self.context.descriptionStringResourceId) ?
                "string_5104" :
                self.context.descriptionStringResourceId;
            numpadDialog.title(Commerce.ViewModelAdapter.getResourceString(titleResourceID));
            asyncQueue
                .enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                if (!self.context.tenderTypeAllowManualEntry) {
                    self.response = { giftCardId: "", giftCardEntryType: Commerce.Client.Entities.GiftCardEntryType.Keyboard };
                    if (self.responseHandler) {
                        self.responseHandler(self.response).always(function () { asyncResult.resolve({ canceled: false }); });
                    }
                }
                else {
                    numpadDialog.show(numpadDialogOptions, false);
                    Activities.ModalDialogHelper.callResponseHandler(self, numpadDialog, Commerce.DialogResult.OK, asyncResult, function (numpadDialogResult) {
                        var giftCardEntryType;
                        switch (numpadDialogResult.entryType) {
                            case Commerce.Controls.NumpadDialogEntryTypes.Barcode:
                                giftCardEntryType = Commerce.Client.Entities.GiftCardEntryType.Barcode;
                                break;
                            case Commerce.Controls.NumpadDialogEntryTypes.MagneticStripReader:
                                giftCardEntryType = Commerce.Client.Entities.GiftCardEntryType.MagneticStripReader;
                                break;
                            default:
                                giftCardEntryType = Commerce.Client.Entities.GiftCardEntryType.Keyboard;
                                break;
                        }
                        return { giftCardId: numpadDialogResult.value, giftCardEntryType: giftCardEntryType };
                    });
                }
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetGiftCardDetailsActivity.prototype.execute = function () {
            var _this = this;
            var dialogState = {
                correlationId: this.context.correlationId,
                retailOperationId: this.context.retailOperationId,
                tenderTypeId: this.context.tenderTypeId
            };
            var dialog = new Commerce.Controls.AddIssueGiftCardDialog(dialogState);
            dialog.show(dialogState).on(Commerce.DialogResult.OK, function (result) {
                _this.response = result;
            }).on(Commerce.DialogResult.Cancel, function (result) {
                _this.response = result;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(dialog);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetGiftReceiptActivity.prototype.execute = function () {
            var self = this;
            var printGiftReceiptDialog = new Commerce.Controls.GetGiftReceiptDialog();
            var context = self.context;
            var asyncResult = new Commerce.AsyncResult();
            printGiftReceiptDialog.show({
                salesOrder: context.salesOrder,
                salesLinesForDisplay: context.salesLinesProducts.map(function (line) {
                    return new Commerce.ViewModels.SalesLineForDisplay(line.salesLine, line.simpleProduct);
                }),
                isPreview: context.isPreview
            }, false);
            Activities.ModalDialogHelper.callResponseHandler(self, printGiftReceiptDialog, Commerce.DialogResult.OK, asyncResult, function (dialogOutput) {
                return { salesLineNumbers: dialogOutput.salesLineNumbers };
            });
            return asyncResult.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetIncomeExpenseLineActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.VoidAsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var selectionHandler = new Commerce.CancelableSelectionHandler(function (incomeExpenseLine) {
                _this.response = {
                    incomeExpenseLine: incomeExpenseLine
                };
                Commerce.ViewModelAdapter.navigate("CartView");
                activityResult.resolve();
            }, function () {
                _this.response = null;
                Commerce.ViewModelAdapter.collapse(originalViewName);
                activityResult.resolve();
            }, function (incomeExpenseLine) {
                _this.response = {
                    incomeExpenseLine: incomeExpenseLine
                };
                return _this.responseHandler(_this.response);
            });
            var viewOptions = {
                accountType: this.context.accountType,
                accounts: this.context.accounts,
                selectionHandler: selectionHandler
            };
            Commerce.ViewModelAdapter.navigate("CostAccountView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetInvoiceCommentActivity.prototype.execute = function () {
            var self = (this);
            var asyncQueue = new Commerce.AsyncQueue();
            var textInputDialog = new Commerce.Controls.TextInputDialog();
            asyncQueue
                .enqueue(function () {
                textInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_99"));
                textInputDialog.show({ content: self.context.cart.InvoiceComment, maxLength: 60 }, false)
                    .on(Commerce.DialogResult.OK, function (comment) {
                    self.response = { comment: comment };
                }).on(Commerce.DialogResult.Cancel, function () {
                    textInputDialog.hide().done(function () { asyncQueue.cancel(); });
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(textInputDialog, false);
            }).enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, textInputDialog, Commerce.DialogResult.OK, asyncResult);
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetLoginActivity.prototype.execute = function () {
            var self = (this);
            var extendedLogonResultHolder = {
                extendedCredentials: null,
                grantType: null
            };
            var loginDialog = new Commerce.Controls.LoginDialog();
            loginDialog.title(Commerce.ViewModelAdapter.getResourceString("string_510"));
            loginDialog.message(Commerce.ViewModelAdapter.getResourceString("string_524"));
            loginDialog.show({ storeId: null }, false);
            var activityResult = new Commerce.AsyncResult();
            Activities.ModalDialogHelper.callResponseHandler(self, loginDialog, Commerce.DialogResult.OK, activityResult, function (loginDialogResult) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(loginDialogResult)) {
                    loginDialogResult = { userName: null, password: null };
                }
                return {
                    regularLogOnParameters: {
                        staffId: loginDialogResult.userName,
                        password: loginDialogResult.password
                    },
                    extendedLogOnParameters: {
                        extendedCredentials: extendedLogonResultHolder.extendedCredentials,
                        grantType: extendedLogonResultHolder.grantType
                    }
                };
            });
            Commerce.Utilities.LogonHelper.enableExtendedCredentials(function (credential, grantType) {
                extendedLogonResultHolder.extendedCredentials = credential;
                extendedLogonResultHolder.grantType = grantType;
                loginDialog.dialogResult.resolve(Commerce.DialogResult.OK);
            });
            return activityResult.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            }).always(function () {
                Commerce.Utilities.LogonHelper.disableExtendedCredentials();
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetLoyaltyCardActivity.prototype.execute = function () {
            var self = (this);
            var asyncQueue = new Commerce.AsyncQueue();
            var numpadDialog = new Commerce.Controls.NumpadDialog();
            var numpadDialogOptions = {
                numpadDialogType: Commerce.Controls.NumpadDialogTypes.Alphanumeric,
                enableMagneticStripReader: true,
                enableBarcodeScanner: true,
                numpadLabel: Commerce.ViewModelAdapter.getResourceString("string_3270"),
                value: self.context.defaultLoyaltyCardId
            };
            var titleResourceID = Commerce.StringExtensions.isNullOrWhitespace(self.context.descriptionStringResourceId) ?
                "string_3250" :
                self.context.descriptionStringResourceId;
            numpadDialog.title(Commerce.ViewModelAdapter.getResourceString(titleResourceID));
            asyncQueue
                .enqueue(function () {
                numpadDialog.show(numpadDialogOptions, false);
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, numpadDialog, Commerce.DialogResult.OK, asyncResult, function (numpadDialogResult) {
                    return { loyaltyCardId: numpadDialogResult.value };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetLoyaltyCardBalanceActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("Invalid options passed: GetLoyaltyCardBalanceActivity was passed invalid options");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.loyaltyCard) || Commerce.ObjectExtensions.isNullOrUndefined(this.context.loyaltyCard.CardNumber)) {
                throw new Error("Invalid options passed: GetLoyaltyCardBalanceActivity was passed invalid cardnumber");
            }
            var loyaltyCardBalanceDialogOptions = {
                correlationId: this.context.correlationId,
                displayAddToTransactionButton: this.context.addToTransaction,
                loyaltyCard: this.context.loyaltyCard
            };
            var loyaltyCardBalanceDialog = new Commerce.Controls.LoyaltyCardBalanceDialog(loyaltyCardBalanceDialogOptions);
            loyaltyCardBalanceDialog.show(null, false)
                .on(Commerce.DialogResult.OK, function (activityResponse) {
                _this.response = activityResponse;
                Commerce.ViewModelAdapter.navigate("CartView");
            }).on(Commerce.DialogResult.Cancel, function (activityResponse) {
                _this.response = null;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(loyaltyCardBalanceDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetNewLoyaltyCardActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.VoidAsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var onSelectionCompleted = function (response) {
                _this.response = response;
                Commerce.ViewModelAdapter.navigateBack();
                activityResult.resolve();
            };
            var onCanceled = function () {
                _this.response = null;
                Commerce.ViewModelAdapter.collapse(originalViewName);
                activityResult.resolve();
            };
            var onSelectionAttempt = function (response) {
                return _this.responseHandler(response);
            };
            var selectionHandler = new Commerce.CancelableSelectionHandler(onSelectionCompleted, onCanceled, onSelectionAttempt);
            var options = {
                customer: this.context.customer,
                selectionHandler: selectionHandler,
                allowSwitchCustomer: this.context.allowSwitchCustomer,
                allowAddToTransaction: this.context.allowAddToTransaction
            };
            Commerce.ViewModelAdapter.navigate("IssueLoyaltyCardView", options);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetOrderTypeActivity.prototype.execute = function () {
            var _this = this;
            var getOrderTypeDialog = new Commerce.Controls.GetOrderTypeDialog();
            getOrderTypeDialog.show(null, false)
                .on(Commerce.DialogResult.OK, function (orderMode) {
                _this.response = { customerOrderMode: orderMode };
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getOrderTypeDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetPasswordActivity.prototype.execute = function () {
            var _this = this;
            var asyncResult = new Commerce.VoidAsyncResult();
            var textInputDialog = new Commerce.Controls.TextInputDialog();
            var textDialogOptions = {
                textInputType: Commerce.Controls.TextInputType.password,
                labelResx: "string_521"
            };
            textInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_520"));
            textInputDialog.show(textDialogOptions, true)
                .on(Commerce.DialogResult.OK, function (password) {
                _this.response = { password: password };
                asyncResult.resolve();
            }).on(Commerce.DialogResult.Cancel, function (password) {
                _this.response = null;
                asyncResult.resolve();
            });
            return asyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetPasswordResetDetailsActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.VoidAsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var selectionrequest = function (selection) {
                _this.response = selection;
                Commerce.ViewModelAdapter.navigateBack();
                activityResult.resolve();
            };
            var originalView = function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve();
            };
            var selectionResponse = function (resetDetails) {
                return _this.responseHandler(resetDetails);
            };
            var selectionHandler = new Commerce.CancelableSelectionHandler(selectionrequest, originalView, selectionResponse);
            var viewOptions = {
                selectionHandler: selectionHandler
            };
            Commerce.ViewModelAdapter.navigate("ResetPasswordView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetPaymentOptionActivity.prototype.execute = function () {
            var _this = this;
            var paymentOptionsDialog = new Commerce.Controls.PaymentOptionsDialog();
            var result = new Commerce.AsyncResult();
            var dialogOptions = {
                title: this.context.title,
                description: this.context.description,
                paymentOptions: this.context.paymentOptions,
                isCancelAllowed: this.context.isCancelAllowed
            };
            var updateResponse = function (dialogResult) {
                return { paymentOption: dialogResult.paymentOption };
            };
            paymentOptionsDialog.show(dialogOptions, false);
            Activities.ModalDialogHelper.callResponseHandler(this, paymentOptionsDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetPriceOverrideActivity.prototype.execute = function () {
            var _this = this;
            var priceInputDialog = new Commerce.Controls.PriceInputDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue
                .enqueue(function () {
                priceInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_5700"));
                priceInputDialog.subTitle(_this.context.cartLine.Description);
                priceInputDialog.show({
                    defaultPrice: _this.context.cartLine.Price,
                    minPrice: Number.NaN,
                    maxPrice: Number.NaN,
                    minPriceInclusive: true,
                    maxPriceInclusive: true
                }, false)
                    .on(Commerce.DialogResult.OK, function (inputValue) {
                    _this.response = { newPrice: inputValue };
                })
                    .on(Commerce.DialogResult.Cancel, function () {
                    priceInputDialog.hide();
                });
                return asyncQueue.cancelOn(Activities.ModalDialogHelper.toVoidAsyncResult(priceInputDialog, false));
            }).enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(_this, priceInputDialog, Commerce.DialogResult.OK, asyncResult, function (result) { return { newPrice: result }; });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetProductKeyInPriceActivity.prototype.execute = function () {
            var self = (this);
            var product = self.context.product;
            var priceInputDialog = new Commerce.Controls.PriceInputDialog();
            priceInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_826"));
            var subTitle;
            if (Commerce.StringExtensions.isNullOrWhitespace(product.ItemId) || Commerce.StringExtensions.isNullOrWhitespace(product.Name)) {
                subTitle = Commerce.ViewModelAdapter.getResourceString("string_825");
            }
            else {
                subTitle = Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_929"), product.ItemId, product.Name);
            }
            priceInputDialog.subTitle(subTitle);
            priceInputDialog.show({
                defaultPrice: product.Price,
                maxPrice: self.context.maxPrice,
                minPrice: self.context.minPrice,
                maxPriceInclusive: self.context.maxPriceInclusive,
                minPriceInclusive: self.context.minPriceInclusive
            }, false);
            var asyncResult = new Commerce.AsyncResult();
            Activities.ModalDialogHelper.callResponseHandler(self, priceInputDialog, Commerce.DialogResult.OK, asyncResult, function (result) { return { keyInPrice: result }; });
            return asyncResult.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetProductKeyInQuantityActivity.prototype.execute = function () {
            var self = (this);
            var product = self.context.product;
            var numberInputDialog = new Commerce.Controls.NumberInputDialog();
            numberInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_827"));
            numberInputDialog.subTitle(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_929"), product.ItemId, product.Name));
            numberInputDialog.subTitleCssClass("primaryFontColor");
            numberInputDialog.label(Commerce.ViewModelAdapter.getResourceString("string_5306"));
            var numberInputDialogState = {
                content: 0,
                min: 0,
                max: Number.MAX_VALUE,
                decimalPrecision: Commerce.UnitOfMeasureHelper.getDecimalPrecision(product.DefaultUnitOfMeasure)
            };
            numberInputDialog.show(numberInputDialogState, false)
                .on(Commerce.DialogResult.OK, function (keyInQuantity) {
                self.response = { keyInQuantity: keyInQuantity };
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(numberInputDialog);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetProductRefinersActivity.prototype.execute = function () {
            var self = this;
            var refinerDialog = new Commerce.Controls.RefinerDialog();
            refinerDialog.title(Commerce.ViewModelAdapter.getResourceString("string_936"));
            var loadRefinerValuesHandler = function (refiner) {
                var result = new Commerce.AsyncResult();
                if (!Commerce.ArrayExtensions.hasElements(refiner.Values)) {
                    self.context.getRefinerValuesHandler(refiner)
                        .done(function (refinerValuesResult) {
                        if (!refinerValuesResult.canceled) {
                            refiner.Values = refinerValuesResult.data;
                        }
                        result.resolve({ canceled: refinerValuesResult.canceled });
                    }).fail(function (error) {
                        result.reject(error);
                    });
                }
                else {
                    result.resolve({ canceled: false });
                }
                return result;
            };
            var dialogState = {
                refiners: self.context.productRefiners,
                loadRefinerValuesHandler: loadRefinerValuesHandler,
                createRefinerControlHandler: createRefinerControl,
                getSelectedRefinerValuesHandler: getSelectedRefinerValues
            };
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { producRefinerValues: dialogResult };
            };
            refinerDialog.show(dialogState, false);
            Commerce.RetailLogger.activitiesGetProductsRefinerRefinerDialogShown(self.context.correlationId);
            Activities.ModalDialogHelper.callResponseHandler(self, refinerDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = {
                        producRefinerValues: []
                    };
                }
            });
        };
        function getSelectedRefinerValues(refiners) {
            var selectedValues = [];
            refiners.forEach(function (refiner) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(refiner.SelectedValues)) {
                    selectedValues = selectedValues.concat(refiner.SelectedValues);
                }
            });
            return selectedValues;
        }
        function createRefinerControl(refiner, container, refinerRemovedHandler) {
            if (refiner.DisplayTemplateValue !== 0 && refiner.DisplayTemplateValue !== 1 && refiner.DisplayTemplateValue !== 3) {
                Commerce.RetailLogger.viewsControlsRefinersDisplayTemplateNotSupported(JSON.stringify(refiner));
                return false;
            }
            var subTitle = Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_937"), refiner.KeyName.toLowerCase());
            ko.cleanNode(container);
            switch (refiner.DisplayTemplateValue) {
                case 0:
                    if (refiner.RefinerTypeValue === 0 || refiner.RefinerTypeValue === 1) {
                        if (!Commerce.ArrayExtensions.hasElements(refiner.Values)) {
                            Commerce.ViewModelAdapter.displayMessage(Commerce.ViewModelAdapter.getResourceString("string_4164"), Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default);
                            return false;
                        }
                        var getDisplayNameCallback = function (value) {
                            if (refiner.DataTypeValue === 3) {
                                var decimalUnitSymbol = value.UnitText;
                                if (Commerce.StringExtensions.isNullOrWhitespace(decimalUnitSymbol)) {
                                    value.LeftValueBoundString = Commerce.NumberExtensions.formatNumber(Commerce.NumberExtensions.parseNumber(value.LeftValueBoundString), Commerce.NumberExtensions.getDecimalPrecision());
                                }
                                else {
                                    var decimalPrecision = Commerce.UnitOfMeasureHelper.getDecimalPrecision(value.UnitText);
                                    value.LeftValueBoundString = Commerce.NumberExtensions.formatNumber(Commerce.NumberExtensions.parseNumber(value.LeftValueBoundString), decimalPrecision);
                                }
                            }
                            else if (refiner.DataTypeValue === Commerce.Proxy.Entities.AttributeDataType.Currency) {
                                value.LeftValueBoundString = Commerce.NumberExtensions.formatCurrency(Commerce.NumberExtensions.parseNumber(value.LeftValueBoundString));
                            }
                            else if (refiner.DataTypeValue === Commerce.Proxy.Entities.AttributeDataType.TrueFalse) {
                                value.LeftValueBoundString = Commerce.Formatters.YesNoAttributeFormatter(value.RightValueBoundString);
                            }
                            else if (value.RefinerSourceValue === Commerce.Proxy.Entities.ProductRefinerSource.Rating) {
                                return Commerce.Formatters.LocalizedStringFormatterForRefinerValue(value);
                            }
                            if ((value.RefinerSourceValue === Commerce.Proxy.Entities.ProductRefinerSource.Category ||
                                value.RefinerSourceValue === Commerce.Proxy.Entities.ProductRefinerSource.Attribute) && value.Count) {
                                return Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_30260"), value.LeftValueBoundString, value.Count);
                            }
                            return value.LeftValueBoundString;
                        };
                        ko.applyBindingsToNode(container, {
                            selectRefinerControl: {
                                refiner: refiner,
                                showInputDialogCallback: refiner.RefinerTypeValue === 0 ?
                                    Commerce.RefinerHelper.showSingleSelectListInputDialogCallback.bind(null, subTitle, refiner.Values, getDisplayNameCallback) :
                                    Commerce.RefinerHelper.showMultiSelectListInputDialogCallback.bind(null, subTitle, refiner.Values, getDisplayNameCallback),
                                refinerValueTemplate: "refinerValueTemplate",
                                refinerRemovedHandler: refinerRemovedHandler.bind(null, refiner)
                            }
                        });
                    }
                    else {
                        Commerce.RetailLogger.viewsControlsRefinersDisplayTemplateNotSupported(JSON.stringify(refiner));
                        return false;
                    }
                    break;
                case 1:
                    ko.applyBindingsToNode(container, { sliderRefinerControl: refiner });
                    break;
                case 3:
                    if (!Commerce.ArrayExtensions.hasElements(refiner.Values)) {
                        Commerce.ViewModelAdapter.displayMessage(Commerce.ViewModelAdapter.getResourceString("string_4164"), Commerce.MessageType.Info, Commerce.MessageBoxButtons.Default);
                        return false;
                    }
                    ko.applyBindingsToNode(container, {
                        selectRefinerControl: {
                            refiner: refiner,
                            showInputDialogCallback: showRefinerRangeInputDialogCallback.bind(null, subTitle, refiner.Values),
                            refinerValueTemplate: "refinerRangeValueTemplate",
                            refinerRemovedHandler: refinerRemovedHandler.bind(null, refiner)
                        }
                    });
                    break;
            }
            return true;
        }
        function showRefinerRangeInputDialogCallback(subTitle, refinerValues) {
            var dialogResult = new Commerce.AsyncResult();
            var localRefinerValues = refinerValues.slice();
            var customRefinerValue = new Commerce.Proxy.Entities.ProductRefinerValueClass();
            customRefinerValue.RefinerRecordId = refinerValues[0].RefinerRecordId;
            customRefinerValue.LeftValueBoundString = Commerce.StringExtensions.EMPTY;
            customRefinerValue.RightValueBoundString = Commerce.StringExtensions.EMPTY;
            customRefinerValue.DataTypeValue = refinerValues[0].DataTypeValue;
            customRefinerValue.RefinerSourceValue = refinerValues[0].RefinerSourceValue;
            localRefinerValues.push(customRefinerValue);
            var getDisplayNameCallback = function (value) {
                if (Commerce.StringExtensions.isEmpty(value.LeftValueBoundString) && Commerce.StringExtensions.isEmpty(value.RightValueBoundString)) {
                    return Commerce.ViewModelAdapter.getResourceString("string_4192");
                }
                else if (Commerce.StringExtensions.isEmpty(value.LeftValueBoundString)) {
                    return Commerce.StringExtensions.format("<{0}", value.RightValueBoundString);
                }
                else if (Commerce.StringExtensions.isEmpty(value.RightValueBoundString)) {
                    return Commerce.StringExtensions.format(">{0}", value.LeftValueBoundString);
                }
                else {
                    return Commerce.StringExtensions.format("{0}-{1}", value.LeftValueBoundString, value.RightValueBoundString);
                }
            };
            Commerce.RefinerHelper.showSingleSelectListInputDialogCallback(subTitle, localRefinerValues, getDisplayNameCallback)
                .done(function (productRefinerValues) {
                if (Commerce.ArrayExtensions.hasElements(productRefinerValues) &&
                    Commerce.StringExtensions.isEmpty(productRefinerValues[0].LeftValueBoundString) &&
                    Commerce.StringExtensions.isEmpty(productRefinerValues[0].RightValueBoundString)) {
                    var dialog = Commerce.RefinerHelper.configureDialog(new Commerce.Controls.NumberRangeInputDialog(), subTitle, Commerce.StringExtensions.EMPTY);
                    dialog.show({}).onAny(function (result, dlgResult) {
                        if (dlgResult === Commerce.DialogResult.OK) {
                            customRefinerValue.LeftValueBoundString = Commerce.ObjectExtensions.isNullOrUndefined(result.minimum) ?
                                Commerce.StringExtensions.EMPTY : result.minimum.toString();
                            customRefinerValue.RightValueBoundString = Commerce.ObjectExtensions.isNullOrUndefined(result.maximum) ?
                                Commerce.StringExtensions.EMPTY : result.maximum.toString();
                            dialogResult.resolve([customRefinerValue]);
                        }
                        else {
                            dialogResult.resolve(null);
                        }
                    });
                    return;
                }
                dialogResult.resolve(productRefinerValues);
            });
            return dialogResult;
        }
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetProductsActivity.prototype.execute = function () {
            Commerce.ViewModelAdapter.navigate("CategoriesView");
            return Commerce.VoidAsyncResult.createResolved();
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetProductsToReturnActivity.prototype.execute = function () {
            Commerce.ViewModelAdapter.navigate("ReturnTransactionView");
            return Commerce.VoidAsyncResult.createResolved();
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetQuantityActivity.prototype.execute = function () {
            var self = (this);
            var context = self.context;
            var numpadDialog = new Commerce.Controls.NumpadDialog();
            var numpadDialogOptions = {
                numpadDialogType: Commerce.Controls.NumpadDialogTypes.Numeric,
                enableMagneticStripReader: false,
                enableBarcodeScanner: true,
                numpadLabel: Commerce.StringExtensions.EMPTY
            };
            if (!Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                numpadDialog.title(context.title);
                numpadDialog.subTitle(context.subTitle);
                numpadDialogOptions.numpadLabel = context.inputLabel;
                numpadDialogOptions.value = context.quantity;
                numpadDialogOptions.decimalPrecision = context.decimalPrecision;
                numpadDialogOptions.parser = context.parser;
            }
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { quantity: dialogResult.value };
            };
            numpadDialog.show(numpadDialogOptions, false);
            Activities.ModalDialogHelper.callResponseHandler(self, numpadDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetQuotationExpirationDateActivity.prototype.execute = function () {
            var self = (this);
            var dialog = new Commerce.Controls.GetQuotationExpirationDateDialog();
            dialog.show(self.context, false)
                .on(Commerce.DialogResult.OK, function (activityResponse) {
                self.response = activityResponse;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(dialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetReasonCodeLinesActivity.prototype.execute = function () {
            var _this = this;
            var description = null;
            var reasonCodeContainerAsCartLine = this.context.reasonCodesContainer;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(reasonCodeContainerAsCartLine)
                && !Commerce.StringExtensions.isNullOrWhitespace(reasonCodeContainerAsCartLine.Description)) {
                description = reasonCodeContainerAsCartLine.Description;
            }
            var reasonCodeDialog = new Commerce.Controls.ReasonCodeDialog();
            reasonCodeDialog.title(Commerce.ViewModelAdapter.getResourceString("string_186"));
            reasonCodeDialog.subTitle(description);
            var options = {
                reasonCodes: this.context.reasonCodes,
                reasonCodesContainer: this.context.reasonCodesContainer,
                handleDialogResult: Activities.ModalDialogHelper.handleDialogResult
            };
            reasonCodeDialog.show(options, false)
                .on(Commerce.DialogResult.OK, function (reasonCodeLines) {
                _this.response = { reasonCodeLines: reasonCodeLines };
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(reasonCodeDialog);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetReconcileLinesDescriptionActivity.prototype.execute = function () {
            var _this = this;
            var textInputDialog = new Commerce.Controls.TextInputDialog();
            textInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_2152"));
            textInputDialog.subTitle(Commerce.ViewModelAdapter.getResourceString("string_2153"));
            var activityResult = new Commerce.AsyncResult();
            textInputDialog.show({
                maxLength: this.context.contentMaxLength,
                content: this.context.content
            })
                .on(Commerce.DialogResult.OK, function (inputValue) {
                _this.response = { description: inputValue };
                activityResult.resolve({ canceled: false });
            }).on(Commerce.DialogResult.Cancel, function (result) {
                _this.response = null;
                activityResult.resolve({ canceled: true });
            }).onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetRefinerActivity.prototype.execute = function () {
            var self = (this);
            var context = self.context;
            return Commerce.RefinerHelper.showRefinerAsync(context.refiner).done(function (result) {
                if (result) {
                    var getRefinerActivityResponse = { selectedValues: result };
                    self.response = getRefinerActivityResponse;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetReportFilterValuesActivity.prototype.execute = function () {
            var _this = this;
            var context = this.context;
            var getReportFilterValuesDialog = new Commerce.Controls.GetReportFilterValuesDialog();
            var getReportFilterValuesDialogState = {
                parameters: context.parameters
            };
            if (!Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                getReportFilterValuesDialog.title(context.title);
            }
            getReportFilterValuesDialog.show(getReportFilterValuesDialogState, false)
                .on(Commerce.DialogResult.OK, function (result) { _this.response = { parameters: result.parameters }; });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getReportFilterValuesDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetReturnChargeActivity.prototype.execute = function () {
            var self = (this);
            var getReturnChargeDialog = new Commerce.Controls.GetReturnChargeDialog();
            getReturnChargeDialog.show(self.context, false)
                .on(Commerce.DialogResult.OK, function (activityResponse) {
                self.response = activityResponse;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getReturnChargeDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetSalesPersonActivity.prototype.execute = function () {
            var _this = this;
            var getSalesPersonDialog = new Commerce.Controls.GetSalesPersonDialog();
            getSalesPersonDialog.show(this.context, false)
                .on(Commerce.DialogResult.OK, function (staffId) {
                _this.response = { salesPersonId: staffId };
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getSalesPersonDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetSalesRepresentativeActivity.prototype.execute = function () {
            var _this = this;
            var getSalesRepresentativeDialog;
            var subTitle;
            if (this.context.mode === Activities.GetSalesRepresentativeMode.Transaction) {
                subTitle = Commerce.ViewModelAdapter.getResourceString("string_13003");
            }
            else if (this.context.mode === Activities.GetSalesRepresentativeMode.Line) {
                subTitle = Commerce.ViewModelAdapter.getResourceString("string_13004");
            }
            else if (this.context.mode === Activities.GetSalesRepresentativeMode.Product) {
                subTitle = Commerce.ViewModelAdapter.getResourceString("string_13005");
            }
            else if (!Commerce.ObjectExtensions.isNullOrUndefined(this.context.product)) {
                subTitle = Commerce.ViewModelAdapter.getResourceString(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_13002"), this.context.product.ItemId, this.context.product.Name));
            }
            getSalesRepresentativeDialog = new Commerce.Controls.GetSalesRepresentativeDialog(subTitle);
            getSalesRepresentativeDialog.show(null, false)
                .on(Commerce.DialogResult.OK, function (result) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(result)) {
                    _this.response = { salesRepresentative: result.selectedSalesRepresentative };
                }
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getSalesRepresentativeDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetSearchTextActivity.prototype.execute = function () {
            var _this = this;
            var context = this.context;
            var numpadDialog = new Commerce.Controls.NumpadDialog();
            var numpadDialogOptions = {
                numpadDialogType: Commerce.Controls.NumpadDialogTypes.Alphanumeric,
                enableMagneticStripReader: false,
                enableBarcodeScanner: true,
                numpadLabel: Commerce.StringExtensions.EMPTY,
            };
            if (!Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                numpadDialog.title(context.title);
                numpadDialog.subTitle(context.subTitle);
                numpadDialogOptions.numpadLabel = context.inputLabel;
                numpadDialogOptions.value = context.searchText;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(context.scannerHint)) {
                    numpadDialogOptions.customControlData = {
                        templateID: "barcodeScannerTemplate",
                        data: { scannerHint: context.scannerHint }
                    };
                }
            }
            var asyncResult = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { searchText: dialogResult.value };
            };
            numpadDialog.show(numpadDialogOptions, false);
            Activities.ModalDialogHelper.callResponseHandler(this, numpadDialog, Commerce.DialogResult.OK, asyncResult, updateResponse);
            return asyncResult.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetSerialNumberActivity.prototype.execute = function () {
            var self = (this);
            var serialNumberInputDialog = new Commerce.Controls.SerialNumberInputDialog();
            var dialogState = { product: this.context.product };
            var result = new Commerce.AsyncResult();
            var updateResponse = function (serialNumber) {
                return { serialNumber: serialNumber };
            };
            serialNumberInputDialog.show(dialogState, false);
            Activities.ModalDialogHelper.callResponseHandler(self, serialNumberInputDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetShiftActionActivity.prototype.execute = function () {
            var self = this;
            var shiftActionDialog = new Commerce.Controls.ShiftActionDialog();
            shiftActionDialog.show(self.context.shiftActions, false)
                .on(Commerce.DialogResult.OK, function (result) {
                self.response = { shiftActionType: result };
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(shiftActionDialog);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetShippingChargeActivity.prototype.execute = function () {
            var self = (this);
            var getShippingChargeDialog = new Commerce.Controls.GetShippingChargeDialog();
            getShippingChargeDialog.show(self.context, false)
                .on(Commerce.DialogResult.OK, function (activityResponse) {
                self.response = activityResponse;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getShippingChargeDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetShippingDateActivity.prototype.execute = function () {
            var self = (this);
            var dialog = new Commerce.Controls.GetShippingDateDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue
                .enqueue(function () {
                dialog.show(self.context, false)
                    .on(Commerce.DialogResult.OK, function (activityResponse) {
                    self.response = activityResponse;
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(dialog, false);
            })
                .enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, dialog, Commerce.DialogResult.OK, asyncResult);
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetShippingDetailsActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var selectionHandler = new Commerce.CancelableSelectionHandler(function (selection) {
                Commerce.ViewModelAdapter.navigateBack(_this.context.correlationId);
                _this.response = selection;
                activityResult.resolve(void 0);
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve(void 0);
            }, function (selection) {
                return _this.responseHandler(selection);
            });
            var viewOptions = {
                cartLines: this.context.cartLines,
                shippingAddress: this.context.shippingAddress,
                selectionHandler: selectionHandler,
                selectedStore: this.context.selectedStore,
                correlationId: this.context.correlationId
            };
            Commerce.ViewModelAdapter.navigate("ShippingMethodsView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetSignatureFromDeviceActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("Invalid options passed: GetSignatureFromDeviceActivity was passed invalid options.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(this.context.correlationId)) {
                throw new Error("Invalid options passed: GetSignatureFromDeviceActivity was passed invalid correlationId.");
            }
            Commerce.RetailLogger.posGetSignatureFromDeviceActivityStarted(this.context.correlationId);
            var getSignatureFromDeviceDialog = new Commerce.Controls.GetSignatureFromDeviceDialog(this.context.correlationId);
            var asyncResult = new Commerce.VoidAsyncResult();
            getSignatureFromDeviceDialog.show(null, true)
                .on(Commerce.DialogResult.OK, function (result) {
                _this.response = {
                    signatureData: result.signatureData,
                    status: result.status
                };
                Commerce.RetailLogger.posGetSignatureFromDeviceActivitySucceeded(_this.context.correlationId, "OK");
                asyncResult.resolve();
            }).on(Commerce.DialogResult.Cancel, function (result) {
                _this.response = {
                    signatureData: result.signatureData,
                    status: result.status
                };
                Commerce.RetailLogger.posGetSignatureFromDeviceActivitySucceeded(_this.context.correlationId, "Skip");
                asyncResult.resolve();
            }).onError(function (errors) {
                Commerce.RetailLogger.posGetSignatureFromDeviceActivityFailed(_this.context.correlationId, Commerce.ErrorHelper.serializeError(errors));
                getSignatureFromDeviceDialog.hide().always(function () { asyncResult.reject(errors); });
            });
            return asyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetSignatureFromPOSActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("Invalid options passed: GetSignatureFromPOSActivity was passed invalid options.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(this.context.correlationId)) {
                throw new Error("Invalid options passed: GetSignatureFromPOSActivity was passed invalid correlationId.");
            }
            var signatureDialog = new Commerce.Controls.SignatureDialog();
            var signatureDialogState = {
                allowRecapture: false,
                correlationId: this.context.correlationId,
                signatureData: null,
                verifyOnly: false,
                allowDecline: false
            };
            Commerce.RetailLogger.posGetSignatureInPOSActivityStarted(signatureDialogState.correlationId);
            var asyncResult = new Commerce.VoidAsyncResult();
            signatureDialog.show(signatureDialogState, true)
                .on(Commerce.DialogResult.OK, function (result) {
                _this.response = {
                    status: Commerce.Payments.SignatureActivityResult.OK,
                    signature: result.signatureData
                };
                Commerce.RetailLogger.posGetSignatureInPOSActivitySucceeded(signatureDialogState.correlationId, "OK");
                asyncResult.resolve();
            }).on(Commerce.DialogResult.Cancel, function (result) {
                _this.response = {
                    status: Commerce.Payments.SignatureActivityResult.Cancelled,
                    signature: result.signatureData
                };
                Commerce.RetailLogger.posGetSignatureInPOSActivitySucceeded(signatureDialogState.correlationId, "Skip");
                asyncResult.resolve();
            }).onError(function (errors) {
                Commerce.RetailLogger.posGetSignatureInPOSActivityFailed(signatureDialogState.correlationId, Commerce.ErrorHelper.serializeError(errors));
                signatureDialog.hide().always(function () { asyncResult.reject(errors); });
            });
            return asyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetStoreCustomerActivity.prototype.execute = function () {
            var _this = this;
            var getStoreCustomerDialog = new Commerce.Controls.GetStoreCustomerDialog();
            getStoreCustomerDialog.show(this.context, false);
            return Activities.ModalDialogHelper.handleDialogResult(getStoreCustomerDialog, Commerce.DialogResult.OK, function (result) {
                return Commerce.AsyncResult.createResolved({ canceled: false, data: result });
            })
                .map(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
                else {
                    _this.response = {
                        customer: result.data.customer
                    };
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetStoreEmployeeActivity.prototype.execute = function () {
            var _this = this;
            var getStoreEmployeeDialog = new Commerce.Controls.GetStoreEmployeeDialog();
            getStoreEmployeeDialog.show(this.context, false)
                .on(Commerce.DialogResult.OK, function (result) {
                getStoreEmployeeDialog.hide().done(function () {
                    _this.response = {
                        employee: result.employee
                    };
                });
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getStoreEmployeeDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetStoreTasklistActivity.prototype.execute = function () {
            var _this = this;
            var getStoreTasklistDialog = new Commerce.Controls.GetStoreTasklistDialog();
            getStoreTasklistDialog.show(this.context, false)
                .on(Commerce.DialogResult.OK, function (result) {
                _this.response = {
                    tasklist: result.tasklist
                };
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(getStoreTasklistDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetTasksFilterActivity.prototype.execute = function () {
            var _this = this;
            var listInputDialog = new Commerce.Controls.ListInputDialog();
            var taskFilterTypeOptions;
            listInputDialog.title(Commerce.StringResourceManager.getString("string_7700"));
            listInputDialog.subTitle(Commerce.StringResourceManager.getString("string_7701"));
            taskFilterTypeOptions = {
                items: [false, true],
                getDisplayNameCallback: function (value) {
                    switch (value) {
                        case false:
                            return Commerce.StringResourceManager.getString("string_7702");
                        case true:
                            return Commerce.StringResourceManager.getString("string_7703");
                        default:
                            return Commerce.StringExtensions.EMPTY;
                    }
                }
            };
            listInputDialog.show(taskFilterTypeOptions, false)
                .on(Commerce.DialogResult.OK, function (selectedItem) {
                listInputDialog.hide().done(function () {
                    _this.response = {
                        filterValue: selectedItem
                    };
                });
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(listInputDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetTransactionActivity.prototype.execute = function () {
            var self = (this);
            self.response = { cart: Commerce.Session.instance.cart };
            if (self.responseHandler) {
                return self.responseHandler(self.response);
            }
            return Commerce.VoidAsyncResult.createResolved();
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetTransactionCommentActivity.prototype.execute = function () {
            var self = (this);
            var asyncQueue = new Commerce.AsyncQueue();
            var textInputDialog = new Commerce.Controls.TextInputDialog();
            asyncQueue
                .enqueue(function () {
                textInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_185"));
                textInputDialog.show({ content: self.context.cart.Comment, maxLength: 60 }, false)
                    .on(Commerce.DialogResult.OK, function (comment) {
                    self.response = { comment: comment };
                }).on(Commerce.DialogResult.Cancel, function () {
                    textInputDialog.hide().done(function () { asyncQueue.cancel(); });
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(textInputDialog, false);
            }).enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, textInputDialog, Commerce.DialogResult.OK, asyncResult);
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetTransactionDiscountActivity.prototype.execute = function () {
            var _this = this;
            var asyncQueue = new Commerce.AsyncQueue();
            var addDiscountDialog = new Commerce.Controls.AddDiscountDialog();
            asyncQueue
                .enqueue(function () {
                var dialogState = {
                    cartLine: null,
                    discountType: _this.context.isPercent ?
                        Commerce.Proxy.Entities.ManualDiscountType.TotalDiscountPercent : Commerce.Proxy.Entities.ManualDiscountType.TotalDiscountAmount
                };
                addDiscountDialog.show(dialogState, false)
                    .on(Commerce.DialogResult.OK, function (result) {
                    _this.response = { discount: result.discountValue };
                }).on(Commerce.DialogResult.Cancel, function () {
                    addDiscountDialog.hide().done(function () { asyncQueue.cancel(); });
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(addDiscountDialog, false);
            }).enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(_this, addDiscountDialog, Commerce.DialogResult.OK, asyncResult, function (result) { return { discount: result.discountValue }; });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetTransactionReturnLinesActivity.prototype.execute = function () {
            var self = (this);
            var onReturnSalesOrderSalesLines = new Commerce.AsyncResult();
            var getTransactionReturnLinesActivityContext = self.context;
            var processing = ko.observable(false);
            var viewOptions = {
                salesOrderToReturn: getTransactionReturnLinesActivityContext.salesOrder,
                onReturnSalesOrderSalesLines: onReturnSalesOrderSalesLines,
                processing: processing
            };
            var asyncResult = callResponseHandler(self, viewOptions);
            Commerce.ViewModelAdapter.navigate("ReturnTransactionView", viewOptions);
            return asyncResult;
        };
        function callResponseHandler(activity, viewOptions) {
            var asyncResult = new Commerce.VoidAsyncResult();
            viewOptions.onReturnSalesOrderSalesLines.done(function (result) {
                if (result) {
                    activity.response = { salesOrder: result.salesOrder, salesLines: result.salesLines };
                    if (activity.responseHandler) {
                        viewOptions.processing(true);
                        activity.responseHandler(activity.response)
                            .done(function () {
                            viewOptions.onReturnSalesOrderSalesLines = null;
                            asyncResult.resolve();
                        }).fail(function (errors) {
                            Commerce.NotificationHandler.displayClientErrors(errors);
                            viewOptions.onReturnSalesOrderSalesLines.clear();
                            viewOptions.onReturnSalesOrderSalesLines.done(function (result) {
                                asyncResult.resolveOrRejectOn(callResponseHandler(activity, viewOptions));
                            });
                        }).always(function () {
                            viewOptions.processing(false);
                        });
                    }
                    else {
                        asyncResult.resolve();
                    }
                }
                else {
                    activity.response = null;
                    asyncResult.resolve();
                }
            });
            return asyncResult;
        }
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetVariantSelectionMethodActivity.prototype.execute = function () {
            var self = (this);
            var variantSelectionMethodDialog = new Commerce.Controls.GetVariantSelectionMethodDialog();
            var result = new Commerce.AsyncResult();
            if (Commerce.Config.isPhone) {
                self.response = { variantSelectionMethod: Activities.VariantSelectionMethod.SelectVariant };
                return Commerce.VoidAsyncResult.createResolved();
            }
            else {
                var dialogOptions = {
                    product: self.context.product
                };
                var updateResponse = function (dialogResult) {
                    return { variantSelectionMethod: dialogResult.variantSelectionMethod };
                };
                variantSelectionMethodDialog.show(dialogOptions, false);
                Activities.ModalDialogHelper.callResponseHandler(self, variantSelectionMethodDialog, Commerce.DialogResult.OK, result, updateResponse);
            }
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GiveChangeBackActivity.prototype.execute = function () {
            var self = this;
            var context = self.context;
            var dialogState = {
                amountDue: context.amountDue,
                changeAmount: context.changeAmount,
                salesPaymentDifference: context.salesPaymentDifference,
                totalAmountPaid: context.totalAmountPaid,
                tenderTypeName: context.tenderTypeName,
                correlationId: context.correlationId
            };
            var changeDialog = new Commerce.Controls.ChangeDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                changeDialog.printGiftReceiptVisible(context.offerToPrintGiftReceipts);
                changeDialog.show(dialogState, false);
                Activities.ModalDialogHelper.callResponseHandler(self, changeDialog, Commerce.DialogResult.Close, asyncResult, function () {
                    return { printGiftReceipts: changeDialog.printGiftReceipt() };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.HandleCommentsActivity.prototype.execute = function () {
            var self = (this);
            var context = self.context;
            var commentDialog = new Commerce.Controls.CommentDialog();
            var commentDialogOptions;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                commentDialogOptions = {
                    comments: context.comments,
                    title: context.title,
                    subTitle: context.subTitle,
                    inputLabel: context.inputLabel,
                    listTitle: context.listTitle
                };
            }
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { newCommentText: dialogResult.newCommentText };
            };
            commentDialog.show(commentDialogOptions, false);
            Activities.ModalDialogHelper.callResponseHandler(self, commentDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.HandleHardwareStationErrorActivity.prototype.execute = function () {
            var self = (this);
            var hardwareStationErrorDialog = new Commerce.Controls.HardwareStationErrorDialog();
            hardwareStationErrorDialog.show(self.context, false)
                .onAny(function (activityResponse) {
                self.response = activityResponse;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(hardwareStationErrorDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.HardwareStationFallbackActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("The activity context is invalid.");
            }
            var hardwareStationDialog = new Commerce.Controls.HardwareStationFallbackDialog();
            var hardwareStationDialogState = {
                title: this.context.title,
                subTitle: this.context.subTitle,
                peripheralType: this.context.peripheralType,
            };
            hardwareStationDialog.show(hardwareStationDialogState, false);
            var result = new Commerce.AsyncResult();
            Activities.ModalDialogHelper.callResponseHandler(this, hardwareStationDialog, Commerce.DialogResult.OK, result, function (dialogResult) {
                return { hardwareStation: dialogResult.hardwareStation };
            });
            return result.map(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.HealthCheckActivity.prototype.execute = function () {
            var activityResult = new Commerce.AsyncResult();
            var onClosingHealthCheckView = function () {
                activityResult.resolve(void 0);
            };
            var viewOptions = {
                correlationId: this.context.correlationId || Commerce.LoggerHelper.getNewCorrelationId(),
                onClosingHealthCheckView: onClosingHealthCheckView
            };
            Commerce.ViewModelAdapter.navigate("HealthCheckView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.InputShiftTenderLineNoteActivity.prototype.execute = function () {
            var self = (this);
            var asyncQueue = new Commerce.AsyncQueue();
            var textInputDialog = new Commerce.Controls.TextInputDialog();
            asyncQueue
                .enqueue(function () {
                textInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_30635"));
                textInputDialog.show({ content: self.context.currentNote, maxLength: 1000 }, false)
                    .on(Commerce.DialogResult.OK, function (newNote) {
                    self.response = { newNote: newNote };
                }).on(Commerce.DialogResult.Cancel, function () {
                    textInputDialog.hide().done(function () { asyncQueue.cancel(); });
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(textInputDialog, false);
            }).enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, textInputDialog, Commerce.DialogResult.OK, asyncResult);
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            }).map(function () { return void 0; });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.LoyaltyCardDetailsActivity.prototype.execute = function () {
            var loyaltyCardDetailsDialog = new Commerce.Controls.LoyaltyCardDetailsDialog();
            var loyaltyCardDetailsDialogState;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                loyaltyCardDetailsDialogState = {
                    cardIssued: this.context.cardIssued
                };
            }
            loyaltyCardDetailsDialog.show(loyaltyCardDetailsDialogState);
            return Activities.ModalDialogHelper.toVoidAsyncResult(loyaltyCardDetailsDialog, false);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        Activities.ManageChargesDetailsActivity.prototype.execute = function () {
            var _this = this;
            var chargesInfoDialog = new Commerce.Controls.ManageChargesLineDetailDialog();
            var result = new Commerce.AsyncResult();
            var dialogOptions = {
                currencyCode: this.context.currencyCode,
                deliveryMode: this.context.deliveryMode,
                overrideReason: this.context.overrideReason,
            };
            chargesInfoDialog.show(dialogOptions, false);
            Activities.ModalDialogHelper.callResponseHandler(this, chargesInfoDialog, Commerce.DialogResult.OK, result);
            return result.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            }).map(function () { return void 0; });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ManageSafeActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var onResultAvailableAsync = function () {
                return Commerce.AsyncResult.createResolved({ canceled: true }).done(function (result) {
                    _this.response = result.canceled ? null : Object.create(null);
                    activityResult.resolve(void 0);
                });
            };
            var viewOptions = {
                storeSafes: this.context.storeSafes,
                onResultAvailableAsync: onResultAvailableAsync
            };
            Commerce.ViewModelAdapter.navigate("ManageSafesView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.NotifyPasswordExpiredActivity.prototype.execute = function () {
            var self = (this);
            var formatString = Commerce.Session.instance.CurrentEmployee.NumberOfDaysToPasswordExpiry === 1 ? "string_519" : "string_515";
            var daysToExpiryMessage = Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString(formatString), Commerce.Session.instance.CurrentEmployee.NumberOfDaysToPasswordExpiry);
            var passwordExpiryDialogOptions = {
                title: Commerce.ViewModelAdapter.getResourceString("string_518"),
                content: daysToExpiryMessage,
                buttons: [
                    {
                        label: Commerce.ViewModelAdapter.getResourceString("string_516"),
                        operationId: Commerce.Controls.Dialog.OperationIds.OK_BUTTON_CLICK,
                        isPrimary: true
                    },
                    {
                        label: Commerce.ViewModelAdapter.getResourceString("string_517"),
                        operationId: Commerce.Controls.Dialog.OperationIds.CANCEL_BUTTON_CLICK,
                        isPrimary: false
                    }
                ],
                hideOnEscape: true
            };
            var dialogResult = new Commerce.AsyncResult();
            new Commerce.Controls.MessageDialog()
                .show(passwordExpiryDialogOptions, true)
                .onAny(function (result) { return dialogResult.resolve(result); });
            return dialogResult.map(function (dialogResult) {
                if (dialogResult === Commerce.DialogResult.Yes) {
                    var options = {
                        staffId: self.context.staffId
                    };
                    Commerce.ViewModelAdapter.navigate("ChangePasswordView", options);
                    self.response = {
                        continueProcessing: false
                    };
                    return Commerce.VoidAsyncResult.createResolved();
                }
                else {
                    self.response = {
                        continueProcessing: true
                    };
                    return Commerce.VoidAsyncResult.createResolved();
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.OverrideHeaderChargeActivity.prototype.execute = function () {
            var _this = this;
            var overrideHeaderChargeDialog = new Commerce.Controls.OverrideHeaderChargeDialog();
            overrideHeaderChargeDialog.show(this.context, false)
                .on(Commerce.DialogResult.OK, function (result) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(result)) {
                    _this.response = {
                        chargeLineId: _this.context.chargeLine.ChargeLineId,
                        newAmount: result.overriddenChargeAmount
                    };
                }
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(overrideHeaderChargeDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.OverrideLineChargeActivity.prototype.execute = function () {
            var _this = this;
            var overrideLineChargeDialog = new Commerce.Controls.OverrideLineChargeDialog();
            overrideLineChargeDialog.show(this.context, false)
                .on(Commerce.DialogResult.OK, function (result) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(result)) {
                    _this.response = {
                        cartLineId: _this.context.cartLine.LineId,
                        chargeLineId: _this.context.chargeLine.ChargeLineId,
                        newAmount: result.overriddenChargeAmount
                    };
                }
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(overrideLineChargeDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.OverrideShiftTenderLineAmountActivity.prototype.execute = function () {
            var self = (this);
            var context = self.context;
            var numpadDialog = new Commerce.Controls.NumpadDialog();
            var numpadDialogOptions = {
                numpadDialogType: Commerce.Controls.NumpadDialogTypes.Currency,
                enableMagneticStripReader: false,
                enableBarcodeScanner: false,
                numpadLabel: Commerce.ViewModelAdapter.getResourceString("string_30648")
            };
            if (!Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                numpadDialog.title(context.title);
                numpadDialog.subTitle(context.subtitle);
                numpadDialogOptions.value = context.calculatedAmount;
                numpadDialogOptions.decimalPrecision = context.decimalPrecision;
                numpadDialogOptions.customControlData = {
                    templateID: "OverrideShiftTenderLineTemplate",
                    data: { originalAmount: context.calculatedAmount }
                };
            }
            var asyncResult = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { overrideAmount: dialogResult.value };
            };
            numpadDialog.show(numpadDialogOptions, false);
            Activities.ModalDialogHelper.callResponseHandler(self, numpadDialog, Commerce.DialogResult.OK, asyncResult, updateResponse);
            return asyncResult.done(function (asyncResult) {
                if (asyncResult.canceled) {
                    self.response = null;
                }
            }).map(function () { return void 0; });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.PaymentTerminalAuthorizeRefundActivity.prototype.execute = function () {
            var self = this;
            var requestContext = self.context;
            var paymentTerminalAuthorizeRefundQueue = new Commerce.AsyncQueue();
            var paymentInfoResponse = null;
            var paymentTerminalMessageDialog;
            Commerce.RetailLogger.posPaymentTerminalAuthorizeRefundActivityStarted(requestContext.correlationId, requestContext.amount < 0);
            paymentTerminalAuthorizeRefundQueue.enqueue(function () {
                var dialogState;
                paymentTerminalMessageDialog = new Commerce.Controls.PaymentMessageDialog();
                dialogState = {
                    title: Commerce.ViewModelAdapter.getResourceString("string_6908"),
                    messageText: Commerce.ViewModelAdapter.getResourceString("string_1174"),
                    buttonText: Commerce.ViewModelAdapter.getResourceString("string_76")
                };
                paymentTerminalMessageDialog.show(dialogState, false)
                    .on(Commerce.DialogResult.Cancel, function () {
                    var request = new Commerce.PaymentTerminalCancelOperationRequest();
                    Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(request));
                });
                if (requestContext.amount >= 0) {
                    var paymentTerminalAuthorizationRequest = new Commerce.PaymentTerminalAuthorizePaymentRequest(requestContext.paymentConnectorId, requestContext.amount, requestContext.tenderInfo, requestContext.voiceAuthorization, requestContext.isManualEntry, null, null, requestContext.paymentTransactionReferenceData);
                    return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(paymentTerminalAuthorizationRequest))
                        .done(function (result) {
                        if (!result.canceled) {
                            paymentInfoResponse = result.data.result;
                        }
                    }).map(function (result) {
                        return { canceled: result.canceled, data: result.data.result };
                    }).always(function () {
                        paymentTerminalMessageDialog.hide();
                    });
                }
                else {
                    var paymentTerminalRefundRequest = new Commerce.PaymentTerminalRefundPaymentRequest(requestContext.paymentConnectorId, requestContext.amount * -1, requestContext.tenderInfo, requestContext.isManualEntry, null);
                    return Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(paymentTerminalRefundRequest))
                        .done(function (result) {
                        if (!result.canceled) {
                            paymentInfoResponse = result.data.result;
                        }
                    }).map(function (result) {
                        return { canceled: result.canceled, data: result.data.result };
                    }).always(function () {
                        paymentTerminalMessageDialog.hide();
                    });
                }
            });
            return paymentTerminalAuthorizeRefundQueue.run()
                .done(function (result) {
                if (!result.canceled) {
                    Commerce.RetailLogger.posPaymentTerminalAuthorizeRefundActivitySucceeded(requestContext.correlationId, requestContext.amount < 0);
                    self.response = { paymentInfo: paymentInfoResponse };
                }
                else {
                    Commerce.RetailLogger.posPaymentTerminalAuthorizeRefundActivityCancelled(requestContext.correlationId, requestContext.amount < 0);
                }
            }).fail(function (errors) {
                Commerce.RetailLogger.posPaymentTerminalAuthorizeRefundActivityFailed(requestContext.correlationId, requestContext.amount < 0, Commerce.ErrorHelper.serializeError(errors));
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.PriceCheckActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.VoidAsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var selectionrequest = function (selection) {
                _this.response = selection;
                Commerce.ViewModelAdapter.navigate("CartView");
                activityResult.resolve();
            };
            var originalView = function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve();
            };
            var selectionResponse = function (selection) {
                return _this.responseHandler(selection);
            };
            var selectionHandler = new Commerce.CancelableSelectionHandler(selectionrequest, originalView, selectionResponse);
            var viewOptions = {
                selectionHandler: selectionHandler
            };
            Commerce.ViewModelAdapter.navigate("PriceCheckView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.PrintReceiptActivity.prototype.execute = function () {
            var self = this;
            var printReceiptDialog = new Commerce.Controls.PrintReceiptDialog();
            var context = self.context;
            var asyncResult = new Commerce.AsyncResult();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                return asyncQueue.cancelOn(Commerce.Operations.HardwareStationHelper.selectActiveHardwareStationAsync());
            }).enqueue(function () {
                printReceiptDialog.show({
                    receipts: context.receipts,
                    rejectOnHardwareStationErrors: true,
                    notifyOnNoPrintableReceipts: context.notifyOnNoPrintableReceipts,
                    isCopyOfReceipt: context.isCopyOfReceipt,
                    associatedOrder: context.associatedOrder,
                    ignoreShouldPrompt: context.ignoreShouldPrompt,
                    correlationId: context.correlationId
                }, false);
                Activities.ModalDialogHelper.callResponseHandler(self, printReceiptDialog, Commerce.DialogResult.OK, asyncResult, function () {
                    return { printGiftReceipts: printReceiptDialog.printGiftReceipt };
                });
                return asyncResult.done(function (result) {
                    if (result.canceled) {
                        self.response = null;
                    }
                });
            });
            return asyncQueue.run().map(function () {
                return Commerce.VoidAsyncResult.createResolved();
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ReassignCustomersFromClientBookActivity.prototype.execute = function () {
            var _this = this;
            var asyncQueue = new Commerce.AsyncQueue();
            var reassignCustomersFromClientBook = new Commerce.Controls.ReassignCustomersFromClientBookDialog();
            asyncQueue.enqueue(function () {
                reassignCustomersFromClientBook.show(_this.context, false)
                    .on(Commerce.DialogResult.OK, function (activityResponse) {
                    _this.response = activityResponse;
                }).on(Commerce.DialogResult.Cancel, function () {
                    _this.response = null;
                    asyncQueue.cancel();
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(reassignCustomersFromClientBook, true)
                    .map(function () {
                    return void 0;
                });
            }).enqueue(function () {
                var reassignCustomersFromClientBookConfirmationDialog = new Commerce.Controls.ReassignCustomersFromClientBookConfirmationDialog();
                reassignCustomersFromClientBookConfirmationDialog.show({
                    employeeName: _this.response.employee.Name,
                    staffId: _this.response.employee.StaffId
                }, false)
                    .on(Commerce.DialogResult.Cancel, function () {
                    _this.response = null;
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(reassignCustomersFromClientBookConfirmationDialog, true)
                    .map(function () {
                    return void 0;
                });
            });
            return asyncQueue.run().map(function () { return void 0; });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.RegisterTimeActivity.prototype.execute = function () {
            var self = (this);
            var timeRegistrationDialog = new Commerce.Controls.TimeRegistrationDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            var dialogOutput;
            asyncQueue
                .enqueue(function () {
                timeRegistrationDialog.show({ employeeActivity: self.context.employeeActivity }, false)
                    .on(Commerce.DialogResult.OK, function (result) {
                    dialogOutput = result;
                }).on(Commerce.DialogResult.Cancel, function (result) {
                    timeRegistrationDialog.hide();
                    asyncQueue.cancel();
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(timeRegistrationDialog, false);
            }).enqueue(function () {
                if (dialogOutput.employeeActivityType === Commerce.Proxy.Entities.EmployeeActivityType.Logbook) {
                    Commerce.ViewModelAdapter.navigate("TimeClockView");
                }
                else if ((dialogOutput.employeeActivityType === Commerce.Proxy.Entities.EmployeeActivityType.ClockIn && !timeRegistrationDialog.clockedIn())
                    || (dialogOutput.employeeActivityType !== Commerce.Proxy.Entities.EmployeeActivityType.ClockIn && timeRegistrationDialog.clockedIn())) {
                    self.response = { employeeActivityType: dialogOutput.employeeActivityType };
                    return self.responseHandler(self.response)
                        .done(function (registrationDateTime) {
                        timeRegistrationDialog.updateTimeClockStatus(dialogOutput.employeeActivityType, registrationDateTime);
                    }).fail(function (errors) {
                        timeRegistrationDialog.hide();
                    });
                }
                timeRegistrationDialog.hide();
                return Commerce.VoidAsyncResult.createResolved();
            });
            return asyncQueue.run();
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.RemoveCustomersFromClientBookActivity.prototype.execute = function () {
            var _this = this;
            var removeCustomersFromClientBookDialog = new Commerce.Controls.RemoveCustomersFromClientBookDialog();
            removeCustomersFromClientBookDialog.show(this.context, false)
                .on(Commerce.DialogResult.OK, function (dialogResponse) {
                _this.response = dialogResponse;
            }).on(Commerce.DialogResult.Cancel, function () {
                _this.response = null;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(removeCustomersFromClientBookDialog, true)
                .map(function () {
                return void 0;
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ResumeShiftActivity.prototype.execute = function () {
            var self = (this);
            var asyncResult = new Commerce.VoidAsyncResult();
            var resolveResult = function () {
                asyncResult.resolve();
                if (Commerce.ViewModelAdapter.isInView("ResumeShiftView")) {
                    Commerce.ViewModelAdapter.navigateBack();
                }
            };
            var viewOptions = {
                availableShiftActions: self.context.availableShiftActions,
                onShiftSelected: function (shift) {
                    self.response = { shift: shift };
                    if (self.responseHandler) {
                        return self.responseHandler(self.response).done(function () {
                            resolveResult();
                        });
                    }
                    else {
                        resolveResult();
                        return Commerce.VoidAsyncResult.createResolved();
                    }
                }
            };
            Commerce.ViewModelAdapter.navigate("ResumeShiftView", viewOptions);
            return asyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ReviewShiftTenderLinesActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var selectionHandler = new Commerce.CancelableSelectionHandler(function (selection) {
                Commerce.ViewModelAdapter.navigateBack();
                activityResult.resolve(void 0);
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve(void 0);
            }, (function (selection) {
                _this.response = { reviewedTenderLines: selection };
                return _this.responseHandler(_this.response);
            }));
            var viewOptions = {
                shift: this.context.shift,
                tenderLines: this.context.tenderLines,
                numberOfOfflineTransactions: this.context.numberOfOfflineTransactions,
                correlationId: this.context.correlationId,
                selectionHandler: selectionHandler
            };
            Commerce.ViewModelAdapter.navigate("ReviewShiftTenderLinesView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ReviewShiftTenderLinesWarningActivity.prototype.execute = function () {
            var _this = this;
            var dialogState = {
                showAmountDifferenceMessage: this.context.showAmountDifferenceMessage,
                showOfflineTransactionsMessage: this.context.showOfflineTransactionsMessage
            };
            var dialog = new Commerce.Controls.ReviewShiftTenderLinesWarningDialog();
            var asyncResult = new Commerce.AsyncResult();
            dialog.show(dialogState, false);
            Activities.ModalDialogHelper.callResponseHandler(this, dialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                return { shouldReviewTenderLines: result };
            });
            return asyncResult.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            }).map(function () { return void 0; });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectAllowedRefundOptionActivity.prototype.execute = function () {
            var _this = this;
            var dialogState = {
                amountToRefund: this.context.amountDue,
                availableRefundOptions: this.context.allowedRefundOptions,
                shouldShowAllPaymentMethodsOption: this.context.shouldShowAllPaymentMethodsOption
            };
            var dialog = new Commerce.Controls.SelectAllowedRefundOptionDialog();
            var asyncResult = new Commerce.AsyncResult();
            dialog.show(dialogState, false);
            Activities.ModalDialogHelper.callResponseHandler(this, dialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                return { selectedRefundOption: result };
            });
            return asyncResult.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            }).map(function () { return void 0; });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectCardTypeActivity.prototype.execute = function () {
            var self = this;
            var cardTypeDialog = new Commerce.Controls.CardTypeDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                cardTypeDialog.show(self.context.cardTypes, false);
                Activities.ModalDialogHelper.callResponseHandler(self, cardTypeDialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                    return { cardType: result };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectCardTypeForTenderBasedDiscountActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("Invalid options passed: SelectCardTypeForTenderBasedDiscountActivity was passed invalid options.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.cardTypeListWithTenderDiscount)) {
                throw new Error("Invalid options passed: SelectCardTypeForTenderBasedDiscountActivity was passed invalid cardTypeListWithTenderDiscount.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(this.context.correlationId)) {
                throw new Error("Invalid options passed: SelectCardTypeForTenderBasedDiscountActivity was passed invalid correlationId.");
            }
            var cardTypeSelectorDialog = new Commerce.Controls.ListInputDialog();
            var defaultCardTypeInList = {
                TypeId: Commerce.ViewModelAdapter.getResourceString("string_4495")
            };
            this.context.cardTypeListWithTenderDiscount.push(defaultCardTypeInList);
            cardTypeSelectorDialog.title(Commerce.ViewModelAdapter.getResourceString("string_4493"));
            cardTypeSelectorDialog.subTitle(Commerce.ViewModelAdapter.getResourceString("string_4494"));
            var dialogOptions = {
                items: this.context.cardTypeListWithTenderDiscount,
                getDisplayNameCallback: function (cardType) { return cardType.TypeId; }
            };
            Commerce.RetailLogger.posSelectCardTypeForTenderBasedDiscountActivityStarted(this.context.correlationId);
            var asyncResult = new Commerce.VoidAsyncResult();
            cardTypeSelectorDialog.show(dialogOptions, false)
                .on(Commerce.DialogResult.OK, function (result) {
                cardTypeSelectorDialog.hide().done(function () {
                    if (result.TypeId !== defaultCardTypeInList.TypeId) {
                        _this.response = {
                            cardTypeSelectedForTenderDiscount: result
                        };
                    }
                    else {
                        defaultCardTypeInList.TypeId = Commerce.StringExtensions.EMPTY;
                        _this.response = {
                            cardTypeSelectedForTenderDiscount: defaultCardTypeInList
                        };
                    }
                    Commerce.RetailLogger.posSelectCardTypeForTenderBasedDiscountActivitySucceeded(_this.context.correlationId, result.TypeId);
                    asyncResult.resolve();
                });
            }).on(Commerce.DialogResult.Cancel, function (result) {
                cardTypeSelectorDialog.hide().done(function () {
                    _this.response = null;
                    Commerce.RetailLogger.posSelectCardTypeForTenderBasedDiscountActivitySucceeded(_this.context.correlationId, "Cancelled");
                    asyncResult.resolve();
                });
            }).onError(function (errors) {
                Commerce.RetailLogger.posSelectCardTypeForTenderBasedDiscountActivityFailed(_this.context.correlationId, Commerce.ErrorHelper.serializeError(errors));
                asyncResult.reject(errors);
            });
            return asyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectCashDrawerActivity.prototype.execute = function () {
            var self = this;
            var cashDrawerInputDialog = new Commerce.Controls.CashDrawerInputDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                cashDrawerInputDialog.show(self.context.cashDrawers, false);
                Activities.ModalDialogHelper.callResponseHandler(self, cashDrawerInputDialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                    return { cashDrawer: result };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectCashManagementTransactionEndpointActivity.prototype.execute = function () {
            var _this = this;
            Commerce.RetailLogger.selectCashManagementTransactionEndpointActivityStarted(this.context.correlationId);
            var selectStoreSafeDialog = new Commerce.Controls.SelectCashManagementTransactionEndpointDialog({
                title: this.context.title,
                subTitle: this.context.subTitle,
                storeSafes: this.context.storeSafes,
                shifts: this.context.shifts,
                preSelectedStoreSafe: this.context.preSelectedStoreSafe,
                preSelectedShift: this.context.preSelectedShift,
            });
            var activityResult = new Commerce.AsyncResult();
            selectStoreSafeDialog.show(null, true)
                .on(Commerce.DialogResult.OK, function (dialogResponse) {
                Commerce.RetailLogger.selectCashManagementTransactionEndpointActivitySucceeded(_this.context.correlationId, "Completed");
                _this.response = {
                    selectedStoreSafe: dialogResponse.selectedStoreSafe,
                    selectedShift: dialogResponse.selectedShift
                };
                activityResult.resolve({ canceled: false, data: _this.response });
            }).on(Commerce.DialogResult.Cancel, function (dialogResponse) {
                Commerce.RetailLogger.selectCashManagementTransactionEndpointActivitySucceeded(_this.context.correlationId, "Cancelled");
                _this.response = null;
                activityResult.resolve({ canceled: true, data: null });
            }).on(Commerce.DialogResult.Close, function (dialogResponse) {
                Commerce.RetailLogger.selectCashManagementTransactionEndpointActivitySucceeded(_this.context.correlationId, "Closed");
                _this.response = null;
                activityResult.resolve({ canceled: true, data: null });
            }).onError(function (errors) {
                Commerce.RetailLogger.selectCashManagementTransactionEndpointActivityFailed(_this.context.correlationId, Commerce.ErrorHelper.serializeError(errors));
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectCouponCodesActivity.prototype.execute = function () {
            var self = this;
            var asyncQueue = new Commerce.AsyncQueue();
            var listInputDialog = new Commerce.Controls.CheckedListInputDialog();
            var listItems = [];
            var selectCouponsOptions;
            listInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_13053"));
            var couponsOnCart = self.context.cart.Coupons;
            couponsOnCart.forEach(function (coupon) {
                listItems.push(coupon.Code);
            });
            selectCouponsOptions = {
                items: listItems
            };
            if (Commerce.ArrayExtensions.hasElements(listItems)) {
                listInputDialog.subTitle(Commerce.ViewModelAdapter.getResourceString("string_13054"));
            }
            else {
                listInputDialog.subTitle(Commerce.ViewModelAdapter.getResourceString("string_13055"));
            }
            asyncQueue
                .enqueue(function () {
                listInputDialog.show(selectCouponsOptions, false);
                var asyncResult = new Commerce.AsyncResult();
                Activities.ModalDialogHelper.callResponseHandler(self, listInputDialog, Commerce.DialogResult.OK, asyncResult, function (selectedItems) {
                    return { couponCodes: selectedItems };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectCustomerActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var customerSelectionHandler = new Commerce.CancelableSelectionHandler(function (result) {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                Commerce.ViewModelAdapter.navigateBack(_this.context.correlationId);
                _this.response = { customer: result };
                activityResult.resolve(void 0);
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve(void 0);
            }, function (selection) {
                return Commerce.CustomerHelper.crossCompanyCustomerTransferAsync(_this.context.correlationId, selection)
                    .map(function (result) {
                    return { canceled: false, data: result };
                });
            });
            var parameters = {
                searchText: this.context.searchText,
                searchEntity: Commerce.Client.Entities.SearchViewSearchEntity.Customer,
                selectionMode: Commerce.ViewModels.SearchViewSelectionMode.Customer,
                customerSelectionOptions: {
                    customerSelectionHandler: customerSelectionHandler,
                    isOnlySelectionAllowed: false
                },
                correlationId: this.context.correlationId
            };
            Commerce.ViewModelAdapter.navigate("SearchView", parameters);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectCustomerAffiliationActivity.prototype.execute = function () {
            var self = this;
            var listInputDialog = new Commerce.Controls.ListInputDialog();
            var listItems = [];
            var selectAffiliationOptions;
            listInputDialog.title(Commerce.ViewModelAdapter.getResourceString("string_6306"));
            var affiliationOptions = self.context.affiliations;
            var affiliationsByRecId = new Commerce.Dictionary();
            affiliationOptions.forEach(function (affiliation) {
                var dataItem = {
                    key: affiliation.RecordId,
                    value: affiliation.Name
                };
                listItems.push(dataItem.value);
                affiliationsByRecId.setItem(affiliation.Name, affiliation);
            });
            selectAffiliationOptions = {
                items: listItems
            };
            if (Commerce.ArrayExtensions.hasElements(listItems) === true) {
                listInputDialog.subTitle(Commerce.ViewModelAdapter.getResourceString("string_6305"));
            }
            else {
                listInputDialog.subTitle(Commerce.ViewModelAdapter.getResourceString("string_6309"));
            }
            listInputDialog.show(selectAffiliationOptions, false)
                .on(Commerce.DialogResult.OK, function (selectedItem) {
                listInputDialog.hide().done(function () {
                    self.response = {
                        selectedAffiliation: affiliationsByRecId.getItem(selectedItem)
                    };
                });
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(listInputDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectCustomerLoyaltyCardActivity.prototype.execute = function () {
            var self = this;
            var customerLoyaltyCardDialog = new Commerce.Controls.SelectCustomerLoyaltyCardDialog({
                loyaltyCards: ko.observableArray(self.context.loyaltyCards),
                enableSelect: true
            });
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                customerLoyaltyCardDialog.show({ currentLoyaltyCardId: self.context.currentLoyaltyCardId }, false);
                Activities.ModalDialogHelper.callResponseHandler(self, customerLoyaltyCardDialog, Commerce.DialogResult.OK, asyncResult, function (results) {
                    return {
                        loyaltyCard: self.context.loyaltyCards.filter(function (card) {
                            return card.CardNumber === results.selectedLoyaltyCardId;
                        })[0]
                    };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        Activities.SelectDeliveryModeActivity.prototype.execute = function () {
            var _this = this;
            var deliveryModesDialog = new Commerce.Controls.SelectDeliveryModeDialog();
            var activityResult = new Commerce.AsyncResult();
            var dialogOptions = {
                deliveryModes: this.context.deliveryModes.map(function (mode) {
                    return {
                        deliveryMode: mode,
                        caption: Commerce.Formatters.DeliveryModeCodeValueFormatter(mode.Code)
                    };
                })
            };
            deliveryModesDialog.show(dialogOptions, true)
                .on(Commerce.DialogResult.OK, function (dialogResponse) {
                _this.response = {
                    selectedDeliveryMode: dialogResponse.selectedDeliveryMode
                };
                activityResult.resolve({ canceled: false, data: _this.response });
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var SelectFiscalRegistrationErrorActionTypeActivity = Commerce.FiscalIntegration.Activities.SelectFiscalRegistrationErrorActionTypeActivity;
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        SelectFiscalRegistrationErrorActionTypeActivity.prototype.execute = function () {
            var self = (this);
            var dialog = new Commerce.Controls.FiscalRegistrationErrorDialog();
            dialog.show(self.context, false)
                .onAny(function (activityResponse) {
                self.response = activityResponse;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(dialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectHardwareStationActivity.prototype.execute = function () {
            var self = this;
            var hardwareStationDialog = new Commerce.Controls.HardwareStationDialog();
            var hardwareStationDialogState;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(self.context)) {
                hardwareStationDialogState = {
                    title: self.context.title,
                    subTitle: self.context.subTitle,
                    isPairedHardwareStationView: self.context.isPairedHardwareStationView
                };
            }
            hardwareStationDialog.show(hardwareStationDialogState, false);
            var result = new Commerce.AsyncResult();
            Activities.ModalDialogHelper.callResponseHandler(self, hardwareStationDialog, Commerce.DialogResult.OK, result);
            return result;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectKitComponentSubstituteActivity.prototype.execute = function () {
            var self = this;
            var activityResult = new Commerce.VoidAsyncResult();
            var substituteSelectionHandler = new Commerce.CancelableSelectionHandler(function (selection) {
                self.response = { componentSubstitute: selection };
                activityResult.resolve();
            }, function () {
                self.response = undefined;
                activityResult.resolve();
            });
            var viewOptions = {
                kitMaster: self.context.kitMaster,
                currentComponentId: self.context.currentComponentId,
                slotId: self.context.slotId,
                selectedComponents: self.context.selectedComponents,
                kitComponentSubstitutesSelectionHandler: substituteSelectionHandler
            };
            Commerce.ViewModelAdapter.navigate("KitComponentSubstitutesView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectLinkedRefundActivity.prototype.execute = function () {
            var _this = this;
            var dialogState = {
                amountDue: this.context.amountDue,
                tenderType: this.context.tenderType,
                tenderLines: this.context.tenderLines
            };
            var linkedRefundDialog = new Commerce.Controls.LinkedRefundDialog();
            var asyncResult = new Commerce.AsyncResult();
            linkedRefundDialog.show(dialogState, false);
            Activities.ModalDialogHelper.callResponseHandler(this, linkedRefundDialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                return { selectedTenderLine: result };
            });
            return asyncResult.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            }).map(function () { return void 0; });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectPackingSlipActivity.prototype.execute = function () {
            var self = (this);
            var transferJournalSelectorDialog = new Commerce.Controls.ListInputDialog();
            transferJournalSelectorDialog.title(Commerce.ViewModelAdapter.getResourceString("string_3431"));
            if (Commerce.ArrayExtensions.hasElements(self.context.journalOptions)) {
                transferJournalSelectorDialog.subTitle(Commerce.ViewModelAdapter.getResourceString("string_3430"));
            }
            else {
                transferJournalSelectorDialog.subTitle(Commerce.ViewModelAdapter.getResourceString("string_3440"));
            }
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                var dialogOptions = {
                    items: self.context.journalOptions,
                    getDisplayNameCallback: function (journal) { return journal.VoucherId; }
                };
                transferJournalSelectorDialog.show(dialogOptions, false)
                    .on(Commerce.DialogResult.OK, function (result) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(result)) {
                        self.response = { selectedTransferOrderJournal: result };
                    }
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(transferJournalSelectorDialog, true);
            });
            return asyncQueue.run()
                .done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectPackingSlipIdActivity.prototype.execute = function () {
            var self = (this);
            var selectPackingSlipIdDialog = new Commerce.Controls.SelectPackingSlipIdDialog();
            var dialogOptions = {
                salesId: self.context.salesId,
                packingSlipsData: self.context.packingSlipsData
            };
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { selectedPackingSlipData: dialogResult.selectedPackingSlipData };
            };
            selectPackingSlipIdDialog.show(dialogOptions, false);
            Activities.ModalDialogHelper.callResponseHandler(self, selectPackingSlipIdDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectPaymentOptionActivity.prototype.execute = function () {
            var self = this;
            var listInputDialog = new Commerce.Controls.ListInputDialog();
            var listItems = [];
            var selectPaymentOptions;
            var paymentOptions = self.context.paymentOptions;
            listInputDialog.title(self.context.title);
            listInputDialog.subTitle(self.context.message);
            paymentOptions.forEach(function (paymentOption) {
                var dataItem = {
                    key: paymentOption.Action,
                    value: paymentOption.DisplayText
                };
                listItems.push(dataItem.value);
            });
            selectPaymentOptions = {
                items: listItems
            };
            listInputDialog.show(selectPaymentOptions, false)
                .on(Commerce.DialogResult.OK, function (selectedItem) {
                listInputDialog.hide().done(function () {
                    self.response = {
                        selectedAction: paymentOptions.filter(function (paymentOption) {
                            return paymentOption.DisplayText === selectedItem;
                        })[0].Action
                    };
                });
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(listInputDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectProductActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var productSelectionHandler = new Commerce.CancelableSelectionHandler(function (result) {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                Commerce.ViewModelAdapter.navigateBack(_this.context.correlationId);
                _this.response = { product: result.simpleProduct };
                activityResult.resolve(void 0);
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve(void 0);
            });
            var parameters = {
                searchText: this.context.searchText,
                searchEntity: Commerce.Client.Entities.SearchViewSearchEntity.Product,
                selectionMode: Commerce.ViewModels.SearchViewSelectionMode.Product,
                productSelectionOptions: {
                    productSelectionHandler: productSelectionHandler,
                    allowKitMasterSelection: false
                },
                correlationId: this.context.correlationId
            };
            Commerce.ViewModelAdapter.navigate("SearchView", parameters);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectSalesLinesActivity.prototype.execute = function () {
            var _this = this;
            var dialogOptions = {
                selectionMode: this.context.allowMultipleLineSelection ? Commerce.Controls.DataList.SelectionMode.MultiSelect : Commerce.Controls.DataList.SelectionMode.SingleSelect
            };
            var selectSalesLinesDialog = new Commerce.Controls.SelectSalesLinesDialog(dialogOptions);
            var salesLinesForDisplay = this.context.salesLineProductPairs
                .map(function (pair) {
                return new Commerce.ViewModels.SalesLineForDisplay(pair.salesLine, pair.product);
            });
            var dialogState = {
                salesLines: salesLinesForDisplay,
                title: this.context.title,
                subtitle: this.context.subtitle
            };
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { selectedSalesLines: dialogResult.selectedSalesLines };
            };
            selectSalesLinesDialog.show(dialogState, false);
            Activities.ModalDialogHelper.callResponseHandler(this, selectSalesLinesDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectSalesLinesForPickUpActivity.prototype.execute = function () {
            var _this = this;
            var asyncResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var salesLinesSelectionHandler = new Commerce.CancelableSelectionHandler(function (selection) {
                Commerce.ViewModelAdapter.navigateBack();
                _this.response = { salesLines: selection };
                asyncResult.resolve(void 0);
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                asyncResult.resolve(void 0);
            });
            var pickUpOptions = {
                salesId: this.context.salesId,
                salesLinesSelectionHandler: salesLinesSelectionHandler
            };
            Commerce.ViewModelAdapter.navigate("PickUpView", pickUpOptions);
            return asyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectStoreActivity.prototype.execute = function () {
            var self = (this);
            var storeSelectorDialog = new Commerce.Controls.SelectStoreDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                var dialogOptions = {
                    stores: self.context.storeOptions
                };
                storeSelectorDialog.show(dialogOptions, false)
                    .on(Commerce.DialogResult.OK, function (result) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(result)) {
                        self.response = { selectedStore: result.selectedOrgUnit };
                    }
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(storeSelectorDialog, true);
            });
            return asyncQueue.run()
                .done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectTaxOverrideActivity.prototype.execute = function () {
            var _this = this;
            var taxOverrideDialog = new Commerce.Controls.TaxOverrideDialog();
            var dialogState = {
                overrideType: this.context.overrideType, taxOverrides: this.context.taxOverrides
            };
            taxOverrideDialog.show(dialogState, false)
                .on(Commerce.DialogResult.OK, function (result) {
                _this.response = { taxOverride: result };
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(taxOverrideDialog);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectTenderTypeActivity.prototype.execute = function () {
            var _this = this;
            var listInputDialog = new Commerce.Controls.ListInputDialog();
            var listItems = [];
            var selectTenderTypeOptions;
            listInputDialog.title(this.context.title);
            listInputDialog.subTitle(this.context.message);
            var tenderTypeOptions = this.context.tenderTypes;
            var tenderByTypeId = new Commerce.Dictionary();
            tenderTypeOptions = tenderTypeOptions.slice().sort(function (first, second) {
                var firstNum = parseInt(first.TenderTypeId, 10);
                var secondNum = parseInt(second.TenderTypeId, 10);
                return firstNum - secondNum;
            });
            tenderTypeOptions.forEach(function (tenderType) {
                var dataItem = {
                    key: tenderType.TenderTypeId,
                    value: tenderType.Name
                };
                listItems.push(dataItem.value);
                tenderByTypeId.setItem(tenderType.Name, tenderType);
            });
            selectTenderTypeOptions = {
                items: listItems
            };
            listInputDialog.show(selectTenderTypeOptions, false)
                .on(Commerce.DialogResult.OK, function (selectedItem) {
                listInputDialog.hide().done(function () {
                    _this.response = {
                        tenderType: tenderByTypeId.getItem(selectedItem)
                    };
                });
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(listInputDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectTimelineTypeActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw "SelectTimelineTypeActivity missing context";
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.timelineItemTypeMaps)) {
                throw "SelectTimelineTypeActivity missing timelineItemTypeMaps";
            }
            var timelineSelectTypeDialog = new Commerce.Controls.TimelineSelectTypeDialog();
            var timelineSelectTypeDialogState = {
                entityType: this.context.timelineItemEntityType,
                typeId: this.context.timelineItemTypeId,
                timelineItemTypeMaps: this.context.timelineItemTypeMaps
            };
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { entityType: dialogResult.entityType, itemType: dialogResult.itemType };
            };
            timelineSelectTypeDialog.show(timelineSelectTypeDialogState, true);
            Activities.ModalDialogHelper.callResponseHandler(this, timelineSelectTypeDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.map(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectTransactionActivity.prototype.execute = function () {
            var _this = this;
            var multipleTransactionDialog = new Commerce.Controls.ReturnMultipleTransactionDialog();
            multipleTransactionDialog.show({ storeList: this.context.storeList })
                .on(Commerce.DialogResult.OK, function (result) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(result)) {
                    _this.response = { selectedSalesOrder: result.salesOrder };
                }
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(multipleTransactionDialog, true).done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectVariantActivity.prototype.execute = function () {
            var self = this;
            var variantDialog = new Commerce.Controls.SelectVariantDialog();
            var dialogState = {
                product: self.context.product,
                preLoadedDimensionDetails: self.context.preLoadedDimensionDetails,
                title: self.context.title
            };
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return { selectedDimensions: dialogResult.selectedDimensions };
            };
            variantDialog.show(dialogState, false);
            Activities.ModalDialogHelper.callResponseHandler(self, variantDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectWarehouseActivity.prototype.execute = function () {
            var _this = this;
            var selectWarehouseDialog = new Commerce.Controls.SelectWarehouseDialog();
            selectWarehouseDialog.show(null, false)
                .on(Commerce.DialogResult.OK, function (result) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(result)) {
                    _this.response = { selectedWarehouse: result.selectedWarehouse };
                }
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(selectWarehouseDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectWarehouseLocationActivity.prototype.execute = function () {
            var _this = this;
            var selectWarehouseLocationDialog = new Commerce.Controls.SelectWarehouseLocationDialog();
            selectWarehouseLocationDialog.show(null, false)
                .on(Commerce.DialogResult.OK, function (result) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(result)) {
                    _this.response = { selectedWarehouseLocation: result.selectedWarehouseLocation };
                }
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(selectWarehouseLocationDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectWarrantyActivity.prototype.execute = function () {
            var warrantySelectionDialog = new Commerce.Controls.SelectApplicableWarrantiesDialog();
            var asyncResult = new Commerce.AsyncResult();
            warrantySelectionDialog.show({
                applicableWarranties: this.context.warranties,
                product: this.context.product
            }, false);
            Activities.ModalDialogHelper.callResponseHandler(this, warrantySelectionDialog, Commerce.DialogResult.OK, asyncResult, function (selectedItem) {
                return { selectedWarranty: selectedItem.selectedWarranty };
            });
            return asyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SetTransferOrderHeaderActivity.prototype.execute = function () {
            var self = (this);
            var transferOrderInputDialog = new Commerce.Controls.TransferOrderInputDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                var order = self.context.transferOrderHeader;
                var dialogTitle = Commerce.StringExtensions.EMPTY;
                switch (self.context.mode) {
                    case 1:
                        dialogTitle = "string_3890";
                        break;
                    case 2:
                    case 3:
                        dialogTitle = order.OrderId;
                        break;
                    default:
                        break;
                }
                var dialogOptions = {
                    orderType: order.OrderTypeValue,
                    fromLocation: {
                        inventLocationId: order.InventLocationIdFrom,
                        inventLocationName: self.context.inventLocationFrom.Name
                    },
                    toLocation: {
                        inventLocationId: order.InventLocationIdTo,
                        inventLocationName: self.context.inventLocationTo.Name
                    },
                    receiveDate: order.ReceiveDate,
                    shipDate: order.ShipDate,
                    dialogTitle: dialogTitle,
                    mode: self.context.mode,
                    deliveryModeId: order.DeliveryModeId,
                    deliveryModes: Commerce.ApplicationContext.Instance.deliveryOptions
                };
                transferOrderInputDialog.show(dialogOptions, false)
                    .on(Commerce.DialogResult.OK, function (result) {
                    self.response = {
                        transferOrderHeader: {
                            OrderId: order.OrderId,
                            InventLocationIdFrom: result.fromLocation.inventLocationId,
                            InventLocationIdTo: result.toLocation.inventLocationId,
                            ShipDate: result.shipDate,
                            ReceiveDate: result.receiveDate,
                            OrderTypeValue: order.OrderTypeValue,
                            DeliveryModeId: result.deliveryModeId
                        }
                    };
                });
                return Activities.ModalDialogHelper.toVoidAsyncResult(transferOrderInputDialog, true);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    self.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ShowAmountDueActivity.prototype.execute = function () {
            var _this = this;
            var context = this.context;
            var dialogState = {
                amountDue: context.amountDue,
                remainingAmountDue: context.remainingAmountDue,
                salesPaymentDifference: context.salesPaymentDifference,
                subtotalAmountWithoutTax: context.subtotalAmountWithoutTax,
                taxAmount: context.taxAmount,
                tenderTypes: context.tenderTypes,
                totalAmountPaid: context.totalAmountPaid,
                correlationId: context.correlationId
            };
            var amountDueDialog = new Commerce.Controls.AmountDueDialog();
            var asyncResult = new Commerce.AsyncResult();
            amountDueDialog.show(dialogState, false);
            Activities.ModalDialogHelper.callResponseHandler(this, amountDueDialog, Commerce.DialogResult.OK, asyncResult, function (result) {
                return { selectedTenderType: result };
            });
            return asyncResult.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            }).map(function () { return void 0; });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ShowChangeDueActivity.prototype.execute = function () {
            var _this = this;
            var context = this.context;
            var dialogState = {
                amountDue: context.amountDue,
                changeAmount: context.changeAmount,
                offerToPrintGiftReceipts: context.offerToPrintGiftReceipts,
                salesPaymentDifference: context.salesPaymentDifference,
                subtotalAmountWithoutTax: context.subtotalAmountWithoutTax,
                taxAmount: context.taxAmount,
                tenderTypeName: context.tenderTypeName,
                totalAmountPaid: context.totalAmountPaid,
                correlationId: context.correlationId
            };
            var changeDueDialog = new Commerce.Controls.ChangeDueDialog();
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                var asyncResult = new Commerce.AsyncResult();
                changeDueDialog.show(dialogState, false);
                Activities.ModalDialogHelper.callResponseHandler(_this, changeDueDialog, Commerce.DialogResult.Close, asyncResult, function (result) {
                    return { printGiftReceipts: result };
                });
                return asyncQueue.cancelOn(asyncResult);
            });
            return asyncQueue.run().done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ShowLoyaltyExpiringPointsActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("Invalid options passed: GetLoyaltyCardBalanceActivity was passed invalid options");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.loyaltyCardId)) {
                throw new Error("Invalid options passed: ShowLoyaltyExpiringPointsActivity was passed invalid loyalty card id");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.rewardPointId)) {
                throw new Error("Invalid options passed: ShowLoyaltyExpiringPointsActivity was passed invalid reward point id");
            }
            var dialogState = {
                correlationId: this.context.correlationId,
                loyaltyCardId: this.context.loyaltyCardId,
                rewardPointId: this.context.rewardPointId,
                expiringPoints: this.context.expiringPoints
            };
            var loyaltyExpiringPointsDialog = new Commerce.Controls.LoyaltyExpiringPointsDialog(dialogState);
            loyaltyExpiringPointsDialog.show(null, true)
                .onAny(function () {
                _this.response = null;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(loyaltyExpiringPointsDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ShowLoyaltyTransactionsActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("Invalid options passed: GetLoyaltyCardBalanceActivity was passed invalid options");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.loyaltyCardId)) {
                throw new Error("Invalid options passed: ShowLoyaltyExpiringPointsActivity was passed invalid loyalty card id");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.rewardPointId)) {
                throw new Error("Invalid options passed: ShowLoyaltyExpiringPointsActivity was passed invalid reward point id");
            }
            var dialogState = {
                correlationId: this.context.correlationId,
                loyaltyCardId: this.context.loyaltyCardId,
                rewardPointId: this.context.rewardPointId,
                totalAvailableBalance: this.context.totalAvailableBalance,
            };
            var loyaltyTransactionsDialog = new Commerce.Controls.LoyaltyTransactionsDialog(dialogState);
            loyaltyTransactionsDialog.show(null, false)
                .onAny(function () {
                _this.response = null;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(loyaltyTransactionsDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ShowNoDiscountOnPriceOverriddenWarningActivity.prototype.execute = function () {
            var _this = this;
            var confirmAddDiscounts = "AddDiscounts";
            var cancelAddDiscounts = "Cancel";
            var buttons = [
                {
                    id: "YesButton",
                    label: Commerce.ViewModelAdapter.getResourceString("string_77"),
                    operationId: confirmAddDiscounts
                },
                {
                    id: "NoButton",
                    label: Commerce.ViewModelAdapter.getResourceString("string_78"),
                    operationId: cancelAddDiscounts
                }
            ];
            var messageDialog = new Commerce.Controls.MessageDialog();
            var dialogState = {
                content: Commerce.ViewModelAdapter.getResourceString("string_5626"),
                buttons: buttons,
                showCloseX: true,
                hideOnEscape: false
            };
            messageDialog.show(dialogState).onAny(function (result, dialogResult) {
                if (result === confirmAddDiscounts) {
                    _this.response = {};
                }
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(messageDialog, true);
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ShowQuestionDialogActivity.prototype.execute = function () {
            var _this = this;
            var askQuestionDialog = new Commerce.Controls.AskQuestionDialog();
            var dialogState = {
                title: this.context.title,
                subTitle: this.context.subTitle,
                button1: this.context.button1,
                button2: this.context.button2,
                question: this.context.question,
                additionalInformation: this.context.additionalInformation,
                showCloseX: this.context.showCloseX,
            };
            var result = new Commerce.AsyncResult();
            askQuestionDialog.show(dialogState, true).onAny(function (questionDialogResult) {
                _this.response = { dialogResult: questionDialogResult.toString() };
                if (questionDialogResult === Commerce.DialogResult.No) {
                    askQuestionDialog.hide().done(function () { result.resolve({ canceled: true }); });
                }
            });
            Activities.ModalDialogHelper.callResponseHandler(this, askQuestionDialog, Commerce.DialogResult.Yes, result);
            return result.map(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.TaskManagementActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var selectionHandler = new Commerce.CancelableSelectionHandler(function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve(void 0);
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve(void 0);
            });
            var viewOptions = {
                selectionHandler: selectionHandler
            };
            Commerce.ViewModelAdapter.navigate("TaskManagementView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.TenderCountingActivity.prototype.execute = function () {
            var _this = this;
            var activityResult = new Commerce.AsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var selectionHandler = new Commerce.CancelableSelectionHandler(function (selection) {
                Commerce.ViewModelAdapter.navigateBack();
                _this.response = selection;
                activityResult.resolve(void 0);
            }, function () {
                Commerce.ViewModelAdapter.collapse(originalViewName);
                _this.response = null;
                activityResult.resolve(void 0);
            }, (function (selection) {
                return _this.responseHandler(selection);
            }));
            var viewOptions = {
                transactionType: this.context.tenderDropAndDeclareType,
                shift: this.context.shift,
                reasonCodeLines: this.context.reasonCodeLines,
                selectionHandler: selectionHandler
            };
            Commerce.ViewModelAdapter.navigate("TenderCountingView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.TokenizePaymentCardActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("Invalid options passed: TokenizePaymentCardActivity was passed invalid options.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.tenderType)) {
                throw new Error("Invalid options passed: TokenizePaymentCardActivity was passed invalid tenderType");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(this.context.correlationId)) {
                throw new Error("Invalid options passed: TokenizePaymentCardActivity was passed invalid correlationId.");
            }
            var activityResult = new Commerce.VoidAsyncResult();
            var originalViewName = Commerce.ViewModelAdapter.getCurrentViewName();
            var onPaymentResultAvailableAsync = function (paymentViewResult) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(paymentViewResult)) {
                    var tokenizedPaymentCard = paymentViewResult.paymentResult;
                    var cardInfo = Commerce.ObjectExtensions.isNullOrUndefined(tokenizedPaymentCard)
                        ? undefined
                        : tokenizedPaymentCard.CardTokenInfo;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(cardInfo)) {
                        Commerce.RetailLogger.posTokenizePaymentCardActivityCancelled(_this.context.correlationId);
                    }
                    else {
                        Commerce.RetailLogger.posTokenizePaymentCardActivitySucceeded(_this.context.correlationId, tokenizedPaymentCard.CardTypeId, cardInfo.CardToken, cardInfo.UniqueCardId, cardInfo.ServiceAccountId, cardInfo.MaskedCardNumber);
                    }
                    Commerce.ViewModelAdapter.navigateBack();
                    _this.response = { tokenizePaymentCard: tokenizedPaymentCard };
                    activityResult.resolve();
                }
                else {
                    Commerce.ViewModelAdapter.collapse(originalViewName);
                    _this.response = undefined;
                    activityResult.resolve();
                }
                return Commerce.AsyncResult.createResolved();
            };
            var cardPaymentOptions = {
                isTokenizePayment: true,
                cardPaymentAcceptPoint: this.context.cardPaymentAcceptPoint
            };
            var viewOptions = {
                tenderType: this.context.tenderType,
                fullAmountDue: Commerce.CartHelper.getEstimatedRemainingBalance(),
                onPaymentResultAvailableAsync: onPaymentResultAvailableAsync,
                correlationId: this.context.correlationId,
                cardPaymentOptions: cardPaymentOptions
            };
            Commerce.ViewModelAdapter.navigate("PaymentView", viewOptions);
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.UserInfoActivity.prototype.execute = function () {
            var userInfoDialog = new Commerce.Controls.UserInfoDialog();
            var userInfoDialogState;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                userInfoDialogState = {
                    title: this.context.title,
                    subTitle: this.context.subTitle,
                    name: this.context.name,
                    picture: this.context.picture,
                    shiftInfo: this.context.shiftInfo
                };
            }
            userInfoDialog.show(userInfoDialogState, false);
            var result = new Commerce.AsyncResult();
            Activities.ModalDialogHelper.callResponseHandler(this, userInfoDialog, Commerce.DialogResult.OK, result);
            return result;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ValidateSignatureInPOSActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw new Error("Invalid options passed: ValidateSignatureInPOSActivity was passed invalid options.");
            }
            else if (!Commerce.ObjectExtensions.isBoolean(this.context.allowRecapture)) {
                throw new Error("Invalid options passed: ValidateSignatureInPOSActivity was passed invalid data for allowRecapture.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(this.context.correlationId)) {
                throw new Error("Invalid options passed: ValidateSignatureInPOSActivity was passed invalid correlationId.");
            }
            var signatureDialog = new Commerce.Controls.SignatureDialog();
            var signatureDialogState = {
                allowRecapture: this.context.allowRecapture,
                correlationId: this.context.correlationId,
                signatureData: this.context.signature,
                verifyOnly: true,
                allowDecline: this.context.allowDecline
            };
            Commerce.RetailLogger.posValidateSignatureInPOSActivityStarted(signatureDialogState.correlationId);
            var asyncResult = new Commerce.VoidAsyncResult();
            signatureDialog.show(signatureDialogState, true)
                .on(Commerce.DialogResult.OK, function (result) {
                _this.response = {
                    status: Commerce.Payments.SignatureActivityResult.OK
                };
                Commerce.RetailLogger.posValidateSignatureInPOSActivitySucceeded(signatureDialogState.correlationId, "OK");
                asyncResult.resolve();
            }).on(Commerce.DialogResult.No, function () {
                _this.response = {
                    status: Commerce.Payments.SignatureActivityResult.Recapture
                };
                Commerce.RetailLogger.posValidateSignatureInPOSActivitySucceeded(signatureDialogState.correlationId, "Recapture");
                asyncResult.resolve();
            }).on(Commerce.DialogResult.Cancel, function () {
                _this.response = {
                    status: Commerce.Payments.SignatureActivityResult.Cancelled
                };
                Commerce.RetailLogger.posValidateSignatureInPOSActivitySucceeded(signatureDialogState.correlationId, "Skip");
                asyncResult.resolve();
            }).onError(function (errors) {
                Commerce.RetailLogger.posValidateSignatureInPOSActivitySucceeded(signatureDialogState.correlationId, Commerce.ErrorHelper.serializeError(errors));
                signatureDialog.hide().always(function () { asyncResult.reject(errors); });
            });
            return asyncResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ViewTimelineItemActivity.prototype.execute = function () {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context)) {
                throw "ViewTimelineItemActivity missing context";
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.timelineItemTypeMaps)) {
                throw "ViewTimelineItemActivity missing timelineItemTypeMaps";
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.context.timelineItem)) {
                throw "ViewTimelineItemActivity missing timelineItem";
            }
            var timelineItemType = Commerce.TimelineHelper.findItemType(this.context.timelineItemTypeMaps, this.context.timelineItem);
            if (Commerce.ObjectExtensions.isNullOrUndefined(timelineItemType)) {
                throw "ViewTimelineItemActivity missing timelineItemType";
            }
            var timelineCreateEditDialog = new Commerce.Controls.TimelineCreateEditDialog();
            var timelineCreateEditDialogState = {
                mode: Commerce.Controls.TimelineCreateEditDialogMode.View,
                timelineItem: this.context.timelineItem,
                timelineItemType: timelineItemType
            };
            var result = new Commerce.AsyncResult();
            var updateResponse = function (dialogResult) {
                return {};
            };
            timelineCreateEditDialog.show(timelineCreateEditDialogState, true);
            Activities.ModalDialogHelper.callResponseHandler(this, timelineCreateEditDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.map(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.CancelInventoryDocumentActivity.prototype.execute = function () {
            var _this = this;
            var dialog = new Commerce.Controls.InventoryDocumentWarningDialog();
            var isCreateTransferOrder = this.context.document.OperationTypeValue === Commerce.Proxy.Entities.InventoryInboundOutboundDocumentOperationType.CreateTransferOrder;
            var isReceivingOperation = this.context.document.OperationTypeValue === Commerce.Proxy.Entities.InventoryInboundOutboundDocumentOperationType.ReceivePurchaseOrder
                || this.context.document.OperationTypeValue === Commerce.Proxy.Entities.InventoryInboundOutboundDocumentOperationType.ReceiveTransferOrder;
            var titleString;
            var contentTitleString;
            if (isCreateTransferOrder) {
                titleString = "string_12721";
                contentTitleString = "string_12722";
            }
            else if (isReceivingOperation) {
                titleString = "string_12454";
                contentTitleString = "string_12462";
            }
            else {
                titleString = "string_12515";
                contentTitleString = "string_12517";
            }
            var dialogState = {
                title: Commerce.StringResourceManager.getString(titleString),
                contentTitle: Commerce.StringResourceManager.getString(contentTitleString),
            };
            var activityResult = new Commerce.VoidAsyncResult();
            dialog.show(dialogState, true)
                .on(Commerce.DialogResult.Yes, function (result) {
                _this.response = { canceled: false };
                activityResult.resolve();
            }).on(Commerce.DialogResult.No, function (result) {
                _this.response = { canceled: true };
                activityResult.resolve();
            }).onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.CommitInventoryDocumentActivity.prototype.execute = function () {
            var _this = this;
            var dialog = new Commerce.Controls.InventoryDocumentCommitDialog();
            var dialogState = {
                document: this.context.document,
            };
            var activityResult = new Commerce.VoidAsyncResult();
            dialog.show(dialogState, true)
                .on(Commerce.DialogResult.Yes, function (result) {
                _this.response = { canceled: false, receiptId: result };
                activityResult.resolve();
            }).on(Commerce.DialogResult.No, function (result) {
                _this.response = { canceled: true, receiptId: result };
                activityResult.resolve();
            }).onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.CreateOrUpdateInventoryDocumentHeaderActivity.prototype.execute = function () {
            var _this = this;
            var dialog = new Commerce.Controls.CreateOrUpdateInventoryDocumentHeaderDialog();
            var dialogState = {
                isInbound: this.context.isInbound,
                document: this.context.document,
            };
            var activityResult = new Commerce.VoidAsyncResult();
            dialog.show(dialogState, true)
                .on(Commerce.DialogResult.Yes, function (result) {
                _this.response = result;
                activityResult.resolve();
            }).on(Commerce.DialogResult.No, function () {
                _this.response = null;
                activityResult.resolve();
            }).onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetInventoryDocumentQuantityActivity.prototype.execute = function () {
            var _this = this;
            var dialog = new Commerce.Controls.InventoryDocumentQuantityDialog();
            var dialogState = {
                document: this.context.document,
                itemName: this.context.itemName,
                itemId: this.context.itemId,
                itemPrimaryImageUrl: this.context.itemPrimaryImageUrl,
                productDimensionsDescription: this.context.productDimensionsDescription,
                isLocationActive: this.context.isLocationActive,
                initialQuantity: this.context.initialQuantity,
                wmsLocationId: this.context.wmsLocationId,
                quantityThreshold: this.context.quantityThreshold,
                isUpdateLinesByProduct: this.context.isUpdateLinesByProduct,
                isLocationBlankReceiptAllowed: this.context.isLocationBlankReceiptAllowed,
                isOverDeliveryAllowed: this.context.isOverDeliveryAllowed,
            };
            var activityResult = new Commerce.VoidAsyncResult();
            dialog.show(dialogState, true)
                .on(Commerce.DialogResult.Yes, function (result) {
                _this.response = {
                    reenterProductId: result.reenterProductId,
                    quantity: result.quantity,
                    wmsLocationId: result.wmsLocationId,
                };
                activityResult.resolve();
            }).on(Commerce.DialogResult.No, function () {
                _this.response = null;
                activityResult.resolve();
            }).onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.GetInventoryDocumentSerialNumberActivity.prototype.execute = function () {
            var _this = this;
            var serialNumberNumpadDialog = new Commerce.Controls.SerialNumberNumpadDialog();
            var dialogState = {
                correlationId: this.context.correlationId,
                product: this.context.product,
                serialNumber: this.context.serialNumber,
            };
            var result = new Commerce.AsyncResult();
            var updateResponse = function (serialNumber) {
                return { serialNumber: serialNumber };
            };
            serialNumberNumpadDialog.show(dialogState, false);
            Activities.ModalDialogHelper.callResponseHandler(this, serialNumberNumpadDialog, Commerce.DialogResult.OK, result, updateResponse);
            return result.done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.PauseInventoryDocumentActivity.prototype.execute = function () {
            var _this = this;
            var dialog = new Commerce.Controls.InventoryDocumentSummaryDialog();
            var isReceivingOperation = this.context.document.OperationTypeValue
                !== Commerce.Proxy.Entities.InventoryInboundOutboundDocumentOperationType.ShipTransferOrder;
            var dialogState = {
                document: this.context.document,
                title: Commerce.StringResourceManager.getString(isReceivingOperation ? "string_12407" : "string_12503"),
                contentTitle: Commerce.StringResourceManager.getString(isReceivingOperation ? "string_12465" : "string_12519"),
                contentSubTitle: Commerce.StringResourceManager.getString(isReceivingOperation ? "string_12466" : "string_12520"),
                totalUpdateNowQuantity: this.context.totalUpdateNowQuantity,
            };
            var activityResult = new Commerce.VoidAsyncResult();
            dialog.show(dialogState, true)
                .on(Commerce.DialogResult.Yes, function (result) {
                _this.response = { canceled: false };
                activityResult.resolve();
            }).on(Commerce.DialogResult.No, function (result) {
                _this.response = { canceled: true };
                activityResult.resolve();
            }).onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.PromptToRegisterInventoryDocumentSerialNumberActivity.prototype.execute
            = function () {
                var _this = this;
                var dialog = new Commerce.Controls.PromptRegisterInventoryDocumentSerialNumberDialog();
                var dialogState = {
                    documentLine: this.context.documentLine,
                };
                var activityResult = new Commerce.VoidAsyncResult();
                dialog.show(dialogState, true)
                    .on(Commerce.DialogResult.Yes, function (result) {
                    _this.response = {};
                    activityResult.resolve();
                }).on(Commerce.DialogResult.No, function (result) {
                    _this.response = null;
                    activityResult.resolve();
                }).onError(function (errors) {
                    activityResult.reject(errors);
                });
                return activityResult;
            };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectInventoryDocumentWarehouseActivity.prototype.execute = function () {
            var _this = this;
            var selectInventoryWarehouseDialog = new Commerce.Controls.SelectInventoryDocumentWarehouseDialog();
            var dialogState = {
                defaultWarehouse: this.context.defaultWarehouse,
            };
            selectInventoryWarehouseDialog.show(dialogState, false)
                .on(Commerce.DialogResult.OK, function (result) {
                _this.response = result;
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(selectInventoryWarehouseDialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.SelectInventoryDocumentWarehouseLocationActivity.prototype.execute = function () {
            var _this = this;
            var dialog = new Commerce.Controls.SelectInventoryDocumentWarehouseLocationDialog();
            var dialogState = {
                itemName: this.context.itemName,
                itemId: this.context.itemId,
                itemPrimaryImageUrl: this.context.itemPrimaryImageUrl,
                productDimensionsDescription: this.context.productDimensionsDescription,
                isWmsEnabled: this.context.isWmsEnabled,
                predefinedLocations: this.context.predefinedLocations,
                defaultLocation: this.context.defaultLocation,
                isUpdateLinesByProduct: this.context.isUpdateLinesByProduct,
            };
            dialog.show(dialogState, false)
                .on(Commerce.DialogResult.OK, function (result) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(result)) {
                    _this.response = {
                        reenterProductId: result.reenterProductId,
                        selectedWarehouseLocation: result.selectedWarehouseLocation,
                    };
                }
            });
            return Activities.ModalDialogHelper.toVoidAsyncResult(dialog, true)
                .done(function (result) {
                if (result.canceled) {
                    _this.response = null;
                }
            });
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ShowInventoryDocumentAsyncFeedbackActivity.prototype.execute = function () {
            var _this = this;
            var dialog = new Commerce.Controls.InventoryDocumentAsyncFeedbackDialog();
            var dialogState = {
                document: this.context.document,
                actionType: this.context.actionType,
            };
            var activityResult = new Commerce.VoidAsyncResult();
            dialog.show(dialogState, true)
                .on(Commerce.DialogResult.Yes, function () {
                _this.response = {};
                activityResult.resolve();
            }).on(Commerce.DialogResult.No, function () {
                _this.response = null;
                activityResult.resolve();
            }).onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ShowInventoryDocumentHeaderActivity.prototype.execute = function () {
            var _this = this;
            var dialog = new Commerce.Controls.InventoryDocumentHeaderDialog();
            var dialogState = {
                document: this.context.document,
                totalUpdateNowQuantity: this.context.totalUpdateNowQuantity,
            };
            var activityResult = new Commerce.VoidAsyncResult();
            dialog.show(dialogState, true)
                .on(Commerce.DialogResult.Close, function (result) {
                _this.response = { updatedDocument: result };
                activityResult.resolve();
            })
                .onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.UpdateInventoryDocumentWorkingTerminalActivity.prototype.execute = function () {
            var _this = this;
            var dialog = new Commerce.Controls.InventoryDocumentWarningDialog();
            var isCreateTransferOrder = this.context.document.OperationTypeValue === Commerce.Proxy.Entities.InventoryInboundOutboundDocumentOperationType.CreateTransferOrder;
            var isReceivingOperation = this.context.document.OperationTypeValue === Commerce.Proxy.Entities.InventoryInboundOutboundDocumentOperationType.ReceivePurchaseOrder
                || this.context.document.OperationTypeValue === Commerce.Proxy.Entities.InventoryInboundOutboundDocumentOperationType.ReceiveTransferOrder;
            var titleString;
            if (isCreateTransferOrder) {
                titleString = "string_12718";
            }
            else if (isReceivingOperation) {
                titleString = "string_12459";
            }
            else {
                titleString = "string_12507";
            }
            var dialogState = {
                title: Commerce.StringResourceManager.getString("string_12409"),
                contentTitle: Commerce.StringResourceManager.getString(titleString),
                contentSubTitle: Commerce.StringResourceManager.getString("string_12468"),
                contentMessage: this.context.workingTerminal,
            };
            var activityResult = new Commerce.VoidAsyncResult();
            dialog.show(dialogState, true)
                .on(Commerce.DialogResult.Yes, function (result) {
                _this.response = { canceled: false };
                activityResult.resolve();
            }).on(Commerce.DialogResult.No, function (result) {
                _this.response = { canceled: true };
                activityResult.resolve();
            }).onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Activities;
    (function (Activities) {
        "use strict";
        Activities.ValidateInventoryDocumentActivity.prototype.execute = function () {
            var _this = this;
            var dialog = new Commerce.Controls.InventoryDocumentValidationResultSummaryDialog();
            var dialogState = {
                summary: this.context.summary,
                isManuallyValidated: this.context.isManuallyValidated,
                documentOperationType: this.context.documentOperationType
            };
            var activityResult = new Commerce.AsyncResult();
            dialog.show(dialogState, true)
                .on(Commerce.DialogResult.OK, function (result) {
                _this.response = { actionType: result };
                activityResult.resolve();
            })
                .on(Commerce.DialogResult.Cancel, function () {
                _this.response = null;
                activityResult.resolve();
            })
                .onError(function (errors) {
                activityResult.reject(errors);
            });
            return activityResult;
        };
    })(Activities = Commerce.Activities || (Commerce.Activities = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var DialogClientRequestHandlerBase = (function () {
        function DialogClientRequestHandlerBase() {
        }
        DialogClientRequestHandlerBase.prototype.handleDialogResult = function (modalDialog, onBeforeCloseCallback) {
            var _this = this;
            var asyncResult = new Commerce.AsyncResult();
            modalDialog.dialogResult.onAny(function (output, dialogResult) {
                var result = null;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(output) && Commerce.ObjectExtensions.isFunction(_this.convertToDialogResult)) {
                    result = _this.convertToDialogResult(output);
                }
                asyncResult.resolveOrRejectOn(_this._handleDialogResultInternal(modalDialog, onBeforeCloseCallback, result));
            }).onError(function (errors) {
                modalDialog.hide().always(function () { asyncResult.reject(errors); });
            });
            return asyncResult;
        };
        DialogClientRequestHandlerBase.prototype._handleDialogResultInternal = function (modalDialog, onBeforeCloseCallback, result) {
            var _this = this;
            var asyncResult = new Commerce.AsyncResult();
            var isCancelled = Commerce.ObjectExtensions.isNullOrUndefined(result) ? true : false;
            if (Commerce.ObjectExtensions.isFunction(onBeforeCloseCallback)) {
                modalDialog.indeterminateWaitVisible(true);
                Commerce.AsyncResult.fromPromise(onBeforeCloseCallback({ canceled: isCancelled, data: result }))
                    .done(function () {
                    onBeforeCloseCallback = null;
                    modalDialog.hide().done(function () {
                        asyncResult.resolve({ canceled: isCancelled, data: result });
                    });
                }).fail(function (reason) {
                    modalDialog.indeterminateWaitVisible(false);
                    modalDialog.clearResult();
                    if (reason instanceof Commerce.Client.Entities.ExtensionError) {
                        if (Commerce.Session.instance.isSessionStateValid) {
                            if (!Commerce.StringExtensions.isNullOrWhitespace(reason.localizedMessage)) {
                                Commerce.NotificationHandler.displayClientErrors([new Commerce.Client.Entities.PosExtensionError(reason)])
                                    .done(function () {
                                    if (Commerce.ObjectExtensions.isFunction(_this.updateDialogOnError)) {
                                        _this.updateDialogOnError(reason, modalDialog);
                                    }
                                    modalDialog.focus();
                                });
                            }
                            asyncResult.resolveOrRejectOn(_this.handleDialogResult(modalDialog, onBeforeCloseCallback));
                        }
                        else {
                            onBeforeCloseCallback = null;
                            modalDialog.hide().done(function () {
                                asyncResult.resolve({ canceled: true, data: null });
                            });
                        }
                    }
                    else {
                        asyncResult.resolveOrRejectOn(_this.handleDialogResult(modalDialog, onBeforeCloseCallback));
                    }
                });
            }
            else {
                modalDialog.hide().done(function () {
                    asyncResult.resolve({ canceled: isCancelled, data: result });
                });
            }
            return asyncResult;
        };
        return DialogClientRequestHandlerBase;
    }());
    Commerce.DialogClientRequestHandlerBase = DialogClientRequestHandlerBase;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var LoadFeatureRequestHandlersClientRequestHandler = (function (_super) {
        __extends(LoadFeatureRequestHandlersClientRequestHandler, _super);
        function LoadFeatureRequestHandlersClientRequestHandler(context) {
            var _this = this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                throw new Error("LoadFeatureRequestHandlersClientRequestHandler constructor: context should not be null or undefined.");
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(context.handlerContext)) {
                throw new Error("LoadFeatureRequestHandlersClientRequestHandler constructor: context.handlerContext should not be null or undefined");
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(context.compositionLoader)) {
                throw new Error("LoadFeatureRequestHandlersClientRequestHandler constructor: context.compositionLoader should not be null or undefined");
            }
            _this = _super.call(this, context.handlerContext) || this;
            _this._compositionLoader = context.compositionLoader;
            return _this;
        }
        LoadFeatureRequestHandlersClientRequestHandler.prototype.supportedRequestType = function () {
            return Commerce.LoadFeatureRequestHandlersClientRequest;
        };
        LoadFeatureRequestHandlersClientRequestHandler.prototype.executeAsync = function (request) {
            try {
                this._loadPaymentsRequestHandlers();
            }
            catch (error) {
                return Promise.reject(error);
            }
            return Promise.resolve({
                data: new Commerce.LoadFeatureRequestHandlersClientResponse(),
                canceled: false
            });
        };
        LoadFeatureRequestHandlersClientRequestHandler.prototype._loadPaymentsRequestHandlers = function () {
            var _this = this;
            var paymentFeatureOptions = {
                enableUnifiedPaymentsExperience: Commerce.ApplicationSession.instance.featureStateContext.isFeatureEnabled(Commerce.Client.Entities.FeatureNameEnum.EnableUnifiedPaymentsExperienceInPOSFeature)
            };
            var paymentsHandlersToBeLoaded = Commerce.Payments.getPaymentRequestHandlers(paymentFeatureOptions);
            paymentsHandlersToBeLoaded.forEach(function (handlerToBeAdded) {
                _this._compositionLoader.addRequestHandler(handlerToBeAdded, function () { return _this.context; });
            });
        };
        return LoadFeatureRequestHandlersClientRequestHandler;
    }(Commerce.PosRequestHandlerBase));
    Commerce.LoadFeatureRequestHandlersClientRequestHandler = LoadFeatureRequestHandlersClientRequestHandler;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var ShowAlphanumericInputDialogClientRequestHandler = (function (_super) {
        __extends(ShowAlphanumericInputDialogClientRequestHandler, _super);
        function ShowAlphanumericInputDialogClientRequestHandler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShowAlphanumericInputDialogClientRequestHandler.prototype.supportedRequestType = function () {
            return Commerce.ShowAlphanumericInputDialogClientRequest;
        };
        ShowAlphanumericInputDialogClientRequestHandler.prototype.executeAsync = function (request) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
                var numpadDialog = new Commerce.Controls.NumpadDialog();
                var numpadDialogOptions;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(request.options)) {
                    numpadDialogOptions = {
                        numpadDialogType: Commerce.Controls.NumpadDialogTypes.Alphanumeric,
                        enableMagneticStripReader: request.options.enableMagneticStripReader,
                        enableBarcodeScanner: request.options.enableBarcodeScanner,
                        numpadLabel: request.options.numPadLabel
                    };
                    numpadDialog.title(request.options.title);
                    numpadDialog.subTitle(request.options.subTitle);
                    numpadDialogOptions.value = request.options.defaultValue;
                }
                numpadDialog.show(numpadDialogOptions, false);
                _this.handleDialogResult(numpadDialog, request.options.onBeforeClose)
                    .done(function (result) {
                    var response = null;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                        response = new Commerce.ShowAlphanumericInputDialogClientResponse({
                            value: result.data.value
                        });
                    }
                    resolve({ canceled: result.canceled, data: response });
                }).fail(function (errors) { reject(errors); });
            });
            return promise;
        };
        ShowAlphanumericInputDialogClientRequestHandler.prototype.convertToDialogResult = function (result) {
            var dialogResult = {
                value: result.value
            };
            return dialogResult;
        };
        ShowAlphanumericInputDialogClientRequestHandler.prototype.updateDialogOnError = function (error, numpadDialog) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(error.newDialogValue)) {
                numpadDialog.setTextValue(error.newDialogValue);
            }
        };
        return ShowAlphanumericInputDialogClientRequestHandler;
    }(Commerce.DialogClientRequestHandlerBase));
    Commerce.ShowAlphanumericInputDialogClientRequestHandler = ShowAlphanumericInputDialogClientRequestHandler;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var ShowListInputDialogClientRequestHandler = (function (_super) {
        __extends(ShowListInputDialogClientRequestHandler, _super);
        function ShowListInputDialogClientRequestHandler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShowListInputDialogClientRequestHandler.prototype.supportedRequestType = function () {
            return Commerce.ShowListInputDialogClientRequest;
        };
        ShowListInputDialogClientRequestHandler.prototype.executeAsync = function (request) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
                var listInputDialog = new Commerce.Controls.ListInputDialog();
                var listInputDialogOptions = {
                    title: request.options.title,
                    subTitle: request.options.subTitle,
                    items: request.options.items,
                    getDisplayNameCallback: _this._getDisplayNameCallback.bind(_this)
                };
                listInputDialog.show(listInputDialogOptions, false);
                _this.handleDialogResult(listInputDialog, request.options.onBeforeClose)
                    .done(function (result) {
                    var response = null;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                        response = new Commerce.ShowListInputDialogClientResponse({
                            value: result.data.value
                        });
                    }
                    resolve({ canceled: result.canceled, data: response });
                }).fail(function (errors) { reject(errors); });
            });
            return promise;
        };
        ShowListInputDialogClientRequestHandler.prototype.convertToDialogResult = function (result) {
            var dialogResult = {
                value: result
            };
            return dialogResult;
        };
        ShowListInputDialogClientRequestHandler.prototype.updateDialogOnError = function (error, listInputDialog) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(error.newDialogValue)) {
                listInputDialog.setItems(error.newDialogValue, this._getDisplayNameCallback.bind(this));
            }
        };
        ShowListInputDialogClientRequestHandler.prototype._getDisplayNameCallback = function (value) {
            return value.label;
        };
        return ShowListInputDialogClientRequestHandler;
    }(Commerce.DialogClientRequestHandlerBase));
    Commerce.ShowListInputDialogClientRequestHandler = ShowListInputDialogClientRequestHandler;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var ShowNumericInputDialogClientRequestHandler = (function (_super) {
        __extends(ShowNumericInputDialogClientRequestHandler, _super);
        function ShowNumericInputDialogClientRequestHandler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShowNumericInputDialogClientRequestHandler.prototype.supportedRequestType = function () {
            return Commerce.ShowNumericInputDialogClientRequest;
        };
        ShowNumericInputDialogClientRequestHandler.prototype.executeAsync = function (request) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
                var numpadDialog = new Commerce.Controls.NumpadDialog();
                var numpadDialogOptions;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(request.options)) {
                    numpadDialogOptions = {
                        numpadDialogType: Commerce.Controls.NumpadDialogTypes.Numeric,
                        enableMagneticStripReader: false,
                        enableBarcodeScanner: false,
                        numpadLabel: request.options.numPadLabel
                    };
                    numpadDialog.title(request.options.title);
                    numpadDialog.subTitle(request.options.subTitle);
                    numpadDialogOptions.value = request.options.defaultNumber;
                    numpadDialogOptions.decimalPrecision = request.options.decimalPrecision;
                }
                numpadDialog.show(numpadDialogOptions, false);
                _this.handleDialogResult(numpadDialog, request.options.onBeforeClose)
                    .done(function (result) {
                    var response = null;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                        response = new Commerce.ShowNumericInputDialogClientResponse({
                            value: result.data.value
                        });
                    }
                    resolve({ canceled: result.canceled, data: response });
                }).fail(function (errors) { reject(errors); });
            });
            return promise;
        };
        ShowNumericInputDialogClientRequestHandler.prototype.convertToDialogResult = function (result) {
            var dialogResult = {
                value: result.value
            };
            return dialogResult;
        };
        ShowNumericInputDialogClientRequestHandler.prototype.updateDialogOnError = function (error, numpadDialog) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(error.newDialogValue)) {
                numpadDialog.setTextValue(error.newDialogValue);
            }
        };
        return ShowNumericInputDialogClientRequestHandler;
    }(Commerce.DialogClientRequestHandlerBase));
    Commerce.ShowNumericInputDialogClientRequestHandler = ShowNumericInputDialogClientRequestHandler;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var ShowTextInputDialogClientRequestHandler = (function (_super) {
        __extends(ShowTextInputDialogClientRequestHandler, _super);
        function ShowTextInputDialogClientRequestHandler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShowTextInputDialogClientRequestHandler.prototype.supportedRequestType = function () {
            return Commerce.ShowTextInputDialogClientRequest;
        };
        ShowTextInputDialogClientRequestHandler.prototype.executeAsync = function (request) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
                var textDialog = new Commerce.Controls.TextInputDialog();
                var textDialogOptions = {
                    labelResx: request.options.label,
                    content: Commerce.ObjectExtensions.isNullOrUndefined(request.options.defaultText) ? Commerce.StringExtensions.EMPTY : request.options.defaultText
                };
                textDialog.title(request.options.title);
                textDialog.subTitle(request.options.subTitle);
                textDialog.show(textDialogOptions, false);
                _this.handleDialogResult(textDialog, request.options.onBeforeClose)
                    .done(function (result) {
                    var response = null;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                        response = new Commerce.ShowTextInputDialogClientResponse({
                            value: result.data.value
                        });
                    }
                    resolve({ canceled: result.canceled, data: response });
                }).fail(function (errors) { reject(errors); });
            });
            return promise;
        };
        ShowTextInputDialogClientRequestHandler.prototype.convertToDialogResult = function (result) {
            var dialogResult = {
                value: result
            };
            return dialogResult;
        };
        ShowTextInputDialogClientRequestHandler.prototype.updateDialogOnError = function (error, textDialog) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(error.newDialogValue)) {
                textDialog.setTextContent(error.newDialogValue);
            }
        };
        return ShowTextInputDialogClientRequestHandler;
    }(Commerce.DialogClientRequestHandlerBase));
    Commerce.ShowTextInputDialogClientRequestHandler = ShowTextInputDialogClientRequestHandler;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Extensibility;
    (function (Extensibility) {
        "use strict";
    })(Extensibility = Commerce.Extensibility || (Commerce.Extensibility = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Extensibility;
    (function (Extensibility) {
        "use strict";
    })(Extensibility = Commerce.Extensibility || (Commerce.Extensibility = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Extensibility;
    (function (Extensibility) {
        "use strict";
        var GetExtensionPackagesLoadInfoClientRequestHandler = (function (_super) {
            __extends(GetExtensionPackagesLoadInfoClientRequestHandler, _super);
            function GetExtensionPackagesLoadInfoClientRequestHandler(context) {
                var _this = _super.call(this) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                    throw new Error("Invalid options provided to the LoadExtensionsRequestHandler constructor.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(context.extensionsLoader)) {
                    throw new Error("Invalid options provided to the LoadExtensionsRequestHandler constructor.");
                }
                _this._context = context;
                return _this;
            }
            GetExtensionPackagesLoadInfoClientRequestHandler.prototype.supportedRequestType = function () {
                return Extensibility.GetExtensionPackagesLoadInfoClientRequest;
            };
            GetExtensionPackagesLoadInfoClientRequestHandler.prototype.executeAsync = function (request) {
                if (!Commerce.ApplicationContext.Instance.isDeviceActivated) {
                    return Promise.resolve({ canceled: true, data: null });
                }
                return Promise.resolve({
                    canceled: false,
                    data: new Extensibility.GetExtensionPackagesLoadInfoClientResponse(this._context.extensionsLoader.getExtensionPackagesLoadInfo())
                });
            };
            return GetExtensionPackagesLoadInfoClientRequestHandler;
        }(Commerce.RequestHandler));
        Extensibility.GetExtensionPackagesLoadInfoClientRequestHandler = GetExtensionPackagesLoadInfoClientRequestHandler;
    })(Extensibility = Commerce.Extensibility || (Commerce.Extensibility = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Extensibility;
    (function (Extensibility) {
        var Handlers;
        (function (Handlers) {
            "use strict";
            function getExtensionsDownloadUrls(serviceUrl, extensionIds, posVersion, deviceToken, requestId, appSessionId, userSessionId, connectionTimeoutMs) {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    var timeoutHandle = 0;
                    xhr.onreadystatechange = function () {
                        if (xhr === null || xhr.readyState !== 4) {
                            return;
                        }
                        clearTimeout(timeoutHandle);
                        var response = parseResponse(xhr);
                        xhr = null;
                        if (response.statusCode === 200) {
                            resolve(JSON.parse(response.body));
                        }
                        else {
                            var errorResult = {
                                code: "InvalidStatusCodeFromService",
                                message: response.statusText,
                                httpStatusText: response.statusText,
                                httpStatusCode: response.statusCode,
                                body: response.body
                            };
                            reject(errorResult);
                        }
                    };
                    try {
                        xhr.open("POST", serviceUrl + "/GetExtensionsDownloadUrlsRequest", true);
                    }
                    catch (exception) {
                        var response = parseResponse(xhr);
                        var errorResult = {
                            message: formatErrorMessage(exception),
                            httpStatusCode: response.statusCode,
                            httpStatusText: response.statusText,
                            code: "FailedCommunicatingWithService"
                        };
                        reject(errorResult);
                    }
                    xhr.withCredentials = false;
                    if (deviceToken) {
                        xhr.setRequestHeader("X-MS-DeviceToken", deviceToken);
                    }
                    if (requestId) {
                        xhr.setRequestHeader("X-MS-RequestId", requestId);
                    }
                    if (appSessionId) {
                        xhr.setRequestHeader("X-MS-AppSessionId", appSessionId);
                    }
                    if (userSessionId) {
                        xhr.setRequestHeader("X-MS-UserSessionId", userSessionId);
                    }
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    if (connectionTimeoutMs && connectionTimeoutMs > 0) {
                        timeoutHandle = setTimeout(xhrTimeout.bind(null, xhr, reject), connectionTimeoutMs);
                    }
                    var body = JSON.stringify({
                        extensionIds: extensionIds,
                        posVersion: posVersion
                    });
                    try {
                        xhr.send(body);
                    }
                    catch (error) {
                        var errorResult = {
                            code: "FailedSendingRequestToServer",
                            message: "Failed sending request to server"
                        };
                        reject(errorResult);
                    }
                });
            }
            Handlers.getExtensionsDownloadUrls = getExtensionsDownloadUrls;
            function xhrTimeout(xhr, reject) {
                if (xhr != null) {
                    xhr.abort();
                    xhr = null;
                    var statusText = "Request Timeout";
                    var errorResult = {
                        code: "ClientTimeOut",
                        message: statusText,
                        httpStatusCode: 408,
                        httpStatusText: statusText
                    };
                    reject(errorResult);
                }
            }
            function formatErrorMessage(error) {
                var errorMessage = "Failed to send http request.";
                if (error && error.message) {
                    errorMessage = error.message;
                }
                return errorMessage;
            }
            function parseResponse(xhr) {
                var statusText = xhr.statusText;
                var statusCode = xhr.status;
                if (statusCode === 1223) {
                    statusCode = 204;
                    statusText = "No Content";
                }
                return {
                    statusCode: statusCode,
                    statusText: statusText,
                    headers: Commerce.Proxy.Common.XmlHttpRequestHelper.parseXmlHttpResponseHeaders(xhr.getAllResponseHeaders()),
                    body: xhr.responseText
                };
            }
        })(Handlers = Extensibility.Handlers || (Extensibility.Handlers = {}));
    })(Extensibility = Commerce.Extensibility || (Commerce.Extensibility = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Extensibility;
    (function (Extensibility) {
        "use strict";
        var LoadExtensionsRequestHandler = (function (_super) {
            __extends(LoadExtensionsRequestHandler, _super);
            function LoadExtensionsRequestHandler(context) {
                var _this = _super.call(this) || this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                    throw new Error("Invalid options provided to the LoadExtensionsRequestHandler constructor.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(context.extensionsLoader)) {
                    throw new Error("Invalid options provided to the LoadExtensionsRequestHandler constructor.");
                }
                _this._context = context;
                return _this;
            }
            LoadExtensionsRequestHandler.prototype.supportedRequestType = function () {
                return Extensibility.LoadExtensionsRequest;
            };
            LoadExtensionsRequestHandler.prototype.executeAsync = function (request) {
                if (!Commerce.ApplicationContext.Instance.isDeviceActivated) {
                    return Promise.resolve({ canceled: true, data: null });
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(request.extensionPackagesConfig)) {
                    throw new Error("LoadExtensionsRequestHandler.executeAsync - Invalid request. Request must have an extension packages configuration.");
                }
                else if (!LoadExtensionsRequestHandler._firstTimeLoad) {
                    if (this._definitionsAreEqual(LoadExtensionsRequestHandler._loadedExtensionPackages, request.extensionPackagesConfig.packageDefinitions)) {
                        return Promise.resolve({ canceled: true, data: null });
                    }
                    else {
                        return Promise.reject([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.MICROSOFT_DYNAMICS_POS_EXTENSION_PACKAGES_MISMATCH_LOAD_ERROR.serverErrorCode)]);
                    }
                }
                LoadExtensionsRequestHandler._firstTimeLoad = false;
                LoadExtensionsRequestHandler._loadedExtensionPackages = request.extensionPackagesConfig.packageDefinitions;
                return this._loadExtensionsAsync(request).map(function () {
                    return {
                        canceled: false,
                        data: new Extensibility.LoadExtensionsResponse()
                    };
                }).getPromise();
            };
            LoadExtensionsRequestHandler.prototype._loadExtensionsAsync = function (request) {
                var extensionConfigs = request.extensionPackagesConfig.packageDefinitions;
                var SYSTEM_JS_FORMAT = "register";
                var posPackages = Object.create(null);
                extensionConfigs.map(function (config) { return config.Name; }).forEach(function (extDirName) {
                    var relativeDirName = Commerce.UrlHelper.formatBaseUrl(request.extensionPackagesConfig.baseUrl) + extDirName;
                    posPackages[relativeDirName] = {
                        format: SYSTEM_JS_FORMAT,
                        defaultExtension: "js"
                    };
                });
                SystemJS.config({
                    packages: posPackages
                });
                return Commerce.VoidAsyncResult.fromPromise(this._context.extensionsLoader.load(request.extensionPackagesConfig, request.countryRegionCode))
                    .recoverOnFailure(function (extensionLoadErrors) {
                    Commerce.RetailLogger.extensibilityFrameworkErrorOccurredWhileLoadingExtensions(Commerce.ErrorHelper.serializeError(extensionLoadErrors), request.correlationId);
                    return Commerce.VoidAsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Commerce.ErrorTypeEnum.EXTENSIONS_CANNOT_BE_LOADED)]);
                });
            };
            LoadExtensionsRequestHandler.prototype._definitionsAreEqual = function (left, right) {
                left = left || [];
                right = right || [];
                if (left.length !== right.length) {
                    return false;
                }
                var compareDefinitions = function (package1, package2) {
                    return Commerce.StringExtensions.compare(package1.Name, package2.Name);
                };
                var leftSorted = left.slice().sort(compareDefinitions);
                var rightSorted = right.slice().sort(compareDefinitions);
                return leftSorted.every(function (leftPackage, index) {
                    var rightPackage = rightSorted[index];
                    return leftPackage.Name === rightPackage.Name
                        && leftPackage.Publisher === rightPackage.Publisher
                        && leftPackage.IsEnabled === rightPackage.IsEnabled;
                });
            };
            LoadExtensionsRequestHandler._firstTimeLoad = true;
            return LoadExtensionsRequestHandler;
        }(Commerce.RequestHandler));
        Extensibility.LoadExtensionsRequestHandler = LoadExtensionsRequestHandler;
    })(Extensibility = Commerce.Extensibility || (Commerce.Extensibility = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var FulfillmentLineDetailsViewModel = (function () {
        function FulfillmentLineDetailsViewModel(dialogOptions) {
            this.productDetails = dialogOptions.productDetails;
            this.showSecondaryInfo = dialogOptions.showSecondaryInfo || false;
            this.secondaryTitle = dialogOptions.secondaryTitle || Commerce.StringExtensions.EMPTY;
            this.secondaryQuantity = dialogOptions.secondaryQuantity || NaN;
        }
        return FulfillmentLineDetailsViewModel;
    }());
    var GetFulfillmentLineQuantityDialogClientRequestHandler = (function (_super) {
        __extends(GetFulfillmentLineQuantityDialogClientRequestHandler, _super);
        function GetFulfillmentLineQuantityDialogClientRequestHandler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GetFulfillmentLineQuantityDialogClientRequestHandler.prototype.supportedRequestType = function () {
            return Commerce.GetFulfillmentLineQuantityDialogClientRequest;
        };
        GetFulfillmentLineQuantityDialogClientRequestHandler.prototype.executeAsync = function (request) {
            var _this = this;
            var promise = new Promise(function (resolve, reject) {
                var numpadDialog = new Commerce.Controls.NumpadDialog();
                var numpadDialogOptions;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(request.options)) {
                    numpadDialogOptions = {
                        numpadDialogType: Commerce.Controls.NumpadDialogTypes.Numeric,
                        enableMagneticStripReader: false,
                        enableBarcodeScanner: true,
                        numpadLabel: Commerce.StringExtensions.EMPTY
                    };
                    request.options.showSecondaryInfo = !Commerce.StringExtensions.isNullOrWhitespace(request.options.secondaryTitle);
                    request.options.secondaryTitle = request.options.secondaryTitle || Commerce.StringExtensions.EMPTY;
                    request.options.secondaryQuantity = request.options.secondaryQuantity || 0;
                    numpadDialog.title(request.options.title);
                    numpadDialog.subTitle(Commerce.StringExtensions.EMPTY);
                    numpadDialogOptions.numpadLabel = Commerce.ViewModelAdapter.getResourceString("string_3372");
                    numpadDialogOptions.value = request.options.defaultQuantity.toString();
                    numpadDialogOptions.decimalPrecision = request.options.decimalPrecision;
                    numpadDialogOptions.customControlData = {
                        templateID: "FulfillmentQuantityDialogTemplate",
                        data: new FulfillmentLineDetailsViewModel(request.options)
                    };
                    numpadDialogOptions.isEnteredValueValid = function (enteredValueText) {
                        var enteredValue = Commerce.NumberExtensions.parseNumber(enteredValueText);
                        var maxValueAllowed = request.options.productDetails.remainingQuantity;
                        return enteredValue >= 0 && enteredValue <= maxValueAllowed;
                    };
                }
                numpadDialog.show(numpadDialogOptions, false);
                _this.handleDialogResult(numpadDialog, request.options.onBeforeClose)
                    .done(function (result) {
                    var response = null;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                        response = new Commerce.GetFulfillmentLineQuantityDialogClientResponse({
                            value: result.data.value
                        });
                    }
                    resolve({ canceled: result.canceled, data: response });
                }).fail(function (errors) { reject(errors); });
            });
            return promise;
        };
        GetFulfillmentLineQuantityDialogClientRequestHandler.prototype.convertToDialogResult = function (result) {
            var dialogResult = {
                value: result.value
            };
            return dialogResult;
        };
        GetFulfillmentLineQuantityDialogClientRequestHandler.prototype.updateDialogOnError = function (error, numpadDialog) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(error.newDialogValue)) {
                numpadDialog.setTextValue(error.newDialogValue);
            }
        };
        return GetFulfillmentLineQuantityDialogClientRequestHandler;
    }(Commerce.DialogClientRequestHandlerBase));
    Commerce.GetFulfillmentLineQuantityDialogClientRequestHandler = GetFulfillmentLineQuantityDialogClientRequestHandler;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var SelectPackingSlipIdClientRequestHandler = (function (_super) {
        __extends(SelectPackingSlipIdClientRequestHandler, _super);
        function SelectPackingSlipIdClientRequestHandler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SelectPackingSlipIdClientRequestHandler.prototype.supportedRequestType = function () {
            return Commerce.SelectPackingSlipIdClientRequest;
        };
        SelectPackingSlipIdClientRequestHandler.prototype.executeAsync = function (request) {
            var salesId = request.salesId;
            var packingSlipsData = request.packingSlipsData;
            var activity = new Commerce.Activities.SelectPackingSlipIdActivity({
                salesId: salesId,
                packingSlipsData: packingSlipsData
            });
            return activity.execute()
                .map(function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(activity.response)
                    && !Commerce.ObjectExtensions.isNullOrUndefined(activity.response.selectedPackingSlipData)) {
                    return {
                        canceled: false,
                        data: new Commerce.SelectPackingSlipIdClientResponse(activity.response.selectedPackingSlipData)
                    };
                }
                else {
                    return {
                        canceled: true,
                        data: new Commerce.SelectPackingSlipIdClientResponse(null)
                    };
                }
            }).getPromise();
        };
        return SelectPackingSlipIdClientRequestHandler;
    }(Commerce.RequestHandler));
    Commerce.SelectPackingSlipIdClientRequestHandler = SelectPackingSlipIdClientRequestHandler;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Refiners;
    (function (Refiners) {
        "use strict";
        var GetRefinerValuesClientRequestHandler = (function (_super) {
            __extends(GetRefinerValuesClientRequestHandler, _super);
            function GetRefinerValuesClientRequestHandler() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            GetRefinerValuesClientRequestHandler.prototype.supportedRequestType = function () {
                return Refiners.GetRefinerValuesClientRequest;
            };
            GetRefinerValuesClientRequestHandler.prototype.executeAsync = function (request) {
                var refinerDialog = new Commerce.Controls.RefinerDialog();
                refinerDialog.title(Commerce.ViewModelAdapter.getResourceString(request.titleResourceId));
                var dialogState = {
                    refiners: request.refiners,
                    refinerValuesRequired: request.refinerValuesRequired,
                    createRefinerControlHandler: Commerce.RefinerHelper.createRefinerControl,
                    getSelectedRefinerValuesHandler: function (refiners) {
                        return refiners;
                    }
                };
                if (Commerce.ObjectExtensions.isString(request.validationErrorsTitleResourceId)
                    && !Commerce.StringExtensions.isNullOrWhitespace(request.validationErrorsTitleResourceId)) {
                    dialogState.validationErrorsTitle = Commerce.ViewModelAdapter.getResourceString(request.validationErrorsTitleResourceId);
                }
                var updatedRefiners;
                refinerDialog.show(dialogState, false).on(Commerce.DialogResult.OK, function (refiners) {
                    updatedRefiners = refiners;
                });
                return Commerce.Activities.ModalDialogHelper.toVoidAsyncResult(refinerDialog)
                    .map(function (result) {
                    return { canceled: result.canceled, data: result.canceled ? undefined : new Refiners.GetRefinerValuesClientResponse(updatedRefiners) };
                }).getPromise();
            };
            return GetRefinerValuesClientRequestHandler;
        }(Commerce.RequestHandler));
        Refiners.GetRefinerValuesClientRequestHandler = GetRefinerValuesClientRequestHandler;
    })(Refiners = Commerce.Refiners || (Commerce.Refiners = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Controls;
    (function (Controls) {
        var AppBarSpacerManagerBindingHandler = (function () {
            function AppBarSpacerManagerBindingHandler() {
            }
            AppBarSpacerManagerBindingHandler.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var options = ko.utils.unwrapObservable(valueAccessor());
                if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                    throw new Error("AppBarSpacerManagerBindingHandler options must be defined.");
                }
                else if (!Commerce.ObjectExtensions.isFunction(options.addViewChangedEventHandler)) {
                    throw new Error("AppBarSpacerManagerBindingHandler option addViewChangedEventHandler must be a function.");
                }
                else if (!Commerce.ObjectExtensions.isFunction(options.removeViewChangedEventHandler)) {
                    throw new Error("AppBarSpacerManagerBindingHandler option removeViewChangedEventHandler must be a function.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(options.appBarSpacerSelector)) {
                    throw new Error("AppBarSpacerManagerBindingHandler option appBarSpacerSelector must be a string with content.");
                }
                var appBarSpacerElement = $(element).find(options.appBarSpacerSelector).get(0);
                var viewChangedEventHandler = function (eventData) {
                    AppBarSpacerManagerBindingHandler._updateAppBarSpacerHeight(appBarSpacerElement, eventData.viewElement);
                };
                options.addViewChangedEventHandler(viewChangedEventHandler);
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    options.removeViewChangedEventHandler(viewChangedEventHandler);
                });
                return { controlsDescendantBindings: false };
            };
            AppBarSpacerManagerBindingHandler._updateAppBarSpacerHeight = function (appBarSpacerElement, viewElement) {
                AppBarSpacerManagerBindingHandler._removeHeightClasses(appBarSpacerElement);
                var $appBars = $(viewElement).find(".win-appbar");
                if ($appBars.length > 0) {
                    if (Commerce.ApplicationContext.Instance.deviceConfiguration.ShowAppBarLabel) {
                        $appBars.off("commandsUpdated.AppBarSpacerManagerBindingHandler");
                        $appBars.on("commandsUpdated.AppBarSpacerManagerBindingHandler", function () {
                            AppBarSpacerManagerBindingHandler._removeHeightClasses(appBarSpacerElement);
                            AppBarSpacerManagerBindingHandler._addHeightClassBasedOnAppBarCommandsHeight(appBarSpacerElement, $appBars);
                        });
                        AppBarSpacerManagerBindingHandler._addHeightClassBasedOnAppBarCommandsHeight(appBarSpacerElement, $appBars);
                    }
                    else {
                        $(appBarSpacerElement).addClass("height48");
                    }
                }
            };
            AppBarSpacerManagerBindingHandler._addHeightClassBasedOnAppBarCommandsHeight = function (appBarSpacerElement, $appBars) {
                var PIXELS_INTERVAL = 4;
                var appBarHeight = 0;
                var $appBarCommands = $appBars.find(".win-command[visible=true]");
                $appBarCommands.each(function (index, appBarCommand) {
                    var $appBarCommand = $(appBarCommand);
                    if ($appBarCommand.height() > appBarHeight) {
                        appBarHeight = $appBarCommand.height();
                    }
                });
                if (appBarHeight % PIXELS_INTERVAL > 0) {
                    appBarHeight += PIXELS_INTERVAL - appBarHeight % PIXELS_INTERVAL;
                }
                $(appBarSpacerElement).addClass(Commerce.StringExtensions.format("height{0}", appBarHeight));
            };
            AppBarSpacerManagerBindingHandler._removeHeightClasses = function (element) {
                var $element = $(element);
                var classes = $element.attr("class").split(" ");
                for (var i = 0; i < classes.length; i++) {
                    var cssClass = classes[i];
                    if (cssClass.match("height[0-9]+")) {
                        $element.removeClass(cssClass);
                    }
                }
            };
            return AppBarSpacerManagerBindingHandler;
        }());
        ko.bindingHandlers.appBarSpacerManager = AppBarSpacerManagerBindingHandler;
    })(Controls = Commerce.Controls || (Commerce.Controls = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var AsyncImageControlOptions = (function () {
        function AsyncImageControlOptions() {
        }
        return AsyncImageControlOptions;
    }());
    Commerce.AsyncImageControlOptions = AsyncImageControlOptions;
    var AsyncImageControl = (function () {
        function AsyncImageControl(element, options) {
            var _this = this;
            this._options = options || { offlineBinaryImageHandlerProperty: null, defaultImage: null };
            element.winControl = this;
            this._element = element;
            this._imageElement = document.createElement("img");
            this._imageElement.className = this._element.className;
            if (!Commerce.StringExtensions.isNullOrWhitespace(this._options.defaultImage)) {
                this._imageElement.src = this._options.defaultImage;
                this._imageElement.addEventListener("error", (function () {
                    Commerce.BindingHandlers.SetDefaultImageOnError(_this._imageElement, _this._options.defaultImage);
                }).bind(this));
            }
            else {
                Commerce.RetailLogger.viewsAsyncImageControlInvalidDefaultImage();
            }
            this._element.appendChild(this._imageElement);
            return this;
        }
        Object.defineProperty(AsyncImageControl.prototype, "data", {
            set: function (data) {
                this._data = data;
                this.setImage();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AsyncImageControl.prototype, "onlineImage", {
            set: function (image) {
                this._onlineImage = image;
                this.setImage();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AsyncImageControl.prototype, "alt", {
            set: function (alt) {
                this._imageElement.alt = alt;
            },
            enumerable: true,
            configurable: true
        });
        AsyncImageControl.prototype.setImage = function () {
            var _this = this;
            if (Commerce.Session.instance.connectionStatus === Commerce.Client.Entities.ConnectionStatusType.Online) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._onlineImage)) {
                    this._imageElement.src = Commerce.Formatters.ImageUrlFormatter(this._onlineImage);
                }
            }
            else {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(this._data) &&
                    !Commerce.StringExtensions.isNullOrWhitespace(this._options.offlineBinaryImageHandlerProperty)) {
                    var imageHandler = this._data[this._options.offlineBinaryImageHandlerProperty];
                    if (Commerce.ObjectExtensions.isFunction(imageHandler)) {
                        imageHandler(this._data).done(function (imageSource) {
                            if (!Commerce.StringExtensions.isNullOrWhitespace(imageSource)) {
                                _this._imageElement.src = Commerce.Formatters.ImageBinaryFormatter(imageSource);
                            }
                        });
                    }
                }
            }
        };
        return AsyncImageControl;
    }());
    Commerce.AsyncImageControl = AsyncImageControl;
    WinJS.Utilities.markSupportedForProcessing(AsyncImageControl);
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var IAsyncImageOptions = (function () {
        function IAsyncImageOptions() {
        }
        return IAsyncImageOptions;
    }());
    Commerce.IAsyncImageOptions = IAsyncImageOptions;
    var AsyncImage = (function () {
        function AsyncImage() {
        }
        AsyncImage.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            var imageElement;
            var _errorEventHandler = function () {
                Commerce.BindingHandlers.SetDefaultImageOnError(imageElement, options.defaultImage);
            }.bind(this);
            imageElement = document.createElement("img");
            imageElement.className = element.className;
            imageElement.alt = options.altText;
            if (!Commerce.StringExtensions.isNullOrWhitespace(options.defaultImage)) {
                imageElement.src = options.defaultImage;
                imageElement.addEventListener("error", _errorEventHandler);
            }
            else {
                Commerce.RetailLogger.viewsAsyncImageControlInvalidDefaultImage();
            }
            element.appendChild(imageElement);
            if (Commerce.Session.instance.connectionStatus === Commerce.Client.Entities.ConnectionStatusType.Online) {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(options.onlineImage)) {
                    imageElement.src = Commerce.Formatters.ImageUrlFormatter(options.onlineImage);
                }
            }
            else {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(options.data) &&
                    !Commerce.StringExtensions.isNullOrWhitespace(options.offlineBinaryImageHandlerProperty)) {
                    var imageHandler = options.data[options.offlineBinaryImageHandlerProperty];
                    if (Commerce.ObjectExtensions.isFunction(imageHandler)) {
                        imageHandler(options.data).done(function (imageSource) {
                            if (!Commerce.StringExtensions.isNullOrWhitespace(imageSource)) {
                                imageElement.src = Commerce.Formatters.ImageBinaryFormatter(imageSource);
                            }
                        });
                    }
                }
            }
            ko.utils.domNodeDisposal.addDisposeCallback(imageElement, function (e) {
                imageElement.removeEventListener("error", _errorEventHandler);
            });
            return { controlsDescendantBindings: true };
        };
        return AsyncImage;
    }());
    Commerce.AsyncImage = AsyncImage;
    ko.bindingHandlers.asyncImage = new AsyncImage();
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var HeaderSearchType = Commerce.Client.Entities.HeaderSearchType;
    var HeaderSearch;
    (function (HeaderSearch) {
        var HeaderSearchCategory = (function () {
            function HeaderSearchCategory(label, searchType, subCategories, showSubCategories) {
                var _this = this;
                this._label = label;
                this._searchType = searchType;
                this._subCategories = ko.observable(subCategories);
                this._showSubCategories = showSubCategories;
                this._areSubCategoriesDisplayable = ko.computed(function () {
                    return Commerce.ArrayExtensions.hasElements(_this.subCategories()) && _this.showSubCategories();
                });
            }
            Object.defineProperty(HeaderSearchCategory.prototype, "label", {
                get: function () {
                    return this._label;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HeaderSearchCategory.prototype, "searchType", {
                get: function () {
                    return this._searchType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HeaderSearchCategory.prototype, "subCategories", {
                get: function () {
                    return this._subCategories;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HeaderSearchCategory.prototype, "showSubCategories", {
                get: function () {
                    return this._showSubCategories;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HeaderSearchCategory.prototype, "areSubCategoriesDisplayable", {
                get: function () {
                    return this._areSubCategoriesDisplayable;
                },
                enumerable: true,
                configurable: true
            });
            HeaderSearchCategory.prototype.getAriaLabel = function (searchText) {
                searchText = Commerce.StringExtensions.isNullOrWhitespace(searchText) ? Commerce.StringExtensions.EMPTY : searchText;
                return Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_1049"), this.label, searchText);
            };
            HeaderSearchCategory.prototype.updateSubCategories = function (subCategories) {
                this._subCategories(subCategories);
            };
            return HeaderSearchCategory;
        }());
        HeaderSearch.HeaderSearchCategory = HeaderSearchCategory;
        var HeaderSearchCustomerSearchField = (function () {
            function HeaderSearchCustomerSearchField(customerSearchField) {
                this.CustomerSearchField = customerSearchField;
            }
            Object.defineProperty(HeaderSearchCustomerSearchField.prototype, "label", {
                get: function () {
                    return this.CustomerSearchField.DisplayName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HeaderSearchCustomerSearchField.prototype, "CustomerSearchField", {
                get: function () {
                    return this._customerSearchField;
                },
                set: function (value) {
                    this._customerSearchField = value;
                },
                enumerable: true,
                configurable: true
            });
            HeaderSearchCustomerSearchField.prototype.getAriaLabel = function (categoryName, searchText) {
                searchText = Commerce.StringExtensions.isNullOrWhitespace(searchText) ? Commerce.StringExtensions.EMPTY : searchText;
                return Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_1050"), categoryName, this.label, searchText);
            };
            return HeaderSearchCustomerSearchField;
        }());
        HeaderSearch.HeaderSearchCustomerSearchField = HeaderSearchCustomerSearchField;
    })(HeaderSearch || (HeaderSearch = {}));
    var HeaderSearchHandler = (function () {
        function HeaderSearchHandler($element, options) {
            var _this = this;
            this.isProductSuggestionsEnabled = false;
            this._textFormatPreTag = "{";
            this._textFormatPostTag = "}";
            this._defaultNumberOfSearchSuggestions = 5;
            this._splitViewSearchText = ".splitViewSearchText";
            this._searchHelperDivSelector = ".searchOptions";
            this._categorySearchHelperDivSelector = ".categorySearchOptions";
            this._productSuggestionsSearchHelperDivSelector = ".productSearchSuggestionSearchOption";
            this._searchHelperDivSelectedClass = "searchOptionSelectedBackgroundColor";
            this._$element = $element;
            this.isSearchCollapsed = options.isSearchCollapsed;
            this.searchText = options.searchText;
            this.searchClicked = options.searchClicked;
            this.searchBySearchFieldClicked = options.searchBySearchFieldClicked;
            this.$splitViewTitle = $(options.splitViewTitleSelector);
            this._subscriptionListData = [];
            this.setFocusOnSearchText = options.setFocusOnSearchText;
            this.splitViewSearchPaneHasFocus = ko.observable(false);
            this.isSplitViewSearchPaneActive = ko.computed(function () {
                return _this.searchText().length > 0 || _this.splitViewSearchPaneHasFocus();
            });
            this._isSearchCollapsedJustChanged = false;
            this._subscriptionListData.push(options.isSearchCollapsed.subscribe(function (newValue) {
                _this._isSearchCollapsedJustChanged = true;
                _this.toggleSearchVisibility(!newValue || _this.isSplitViewSearchPaneActive());
                _this._isSearchCollapsedJustChanged = false;
            }));
            this._subscriptionListData.push(this.searchText.subscribe(function (partialSearchText) {
                _this.updateProductCustomerSearchContexts(partialSearchText);
            }));
            this._isSearchBarVisible = options.isSearchBarVisible;
            this._isSearchBarVisible.extend({ notify: "always" });
            this._subscriptionListData.push((this._isSearchBarVisible.subscribe(function (newValue) {
                if (newValue) {
                    _this.toggleSearchVisibility(_this.isSplitViewSearchPaneActive());
                    if (!_this.isSplitViewSearchPaneActive()) {
                        _this._$element.find(_this._splitViewSearchText).trigger("ax-retail-clearMark-toggle");
                    }
                }
                else {
                    _this.toggleSearchVisibility(false);
                }
            })));
            this._searchType = options.searchType;
            this._hideProductSuggestions = ko.computed(function () {
                return _this._searchType() === Commerce.Client.Entities.HeaderSearchType.Customer;
            });
            this.showSearchHelper = ko.observable(false);
            this.searchHelperVisible = ko.computed(function () {
                return _this.showSearchHelper();
            });
            this.setFocusOnSearchText.extend({ notify: "always" });
            this._subscriptionListData.push((this.setFocusOnSearchText.subscribe(function (newValue) {
                var $splitViewSearchText = _this._$element.find(_this._splitViewSearchText);
                if (newValue) {
                    if (_this.isSearchCollapsed()) {
                        _this.toggleSearchVisibility(newValue);
                    }
                    $splitViewSearchText.focus();
                }
                else {
                    $splitViewSearchText.blur();
                }
            })));
            this._customerSearchSuggestionCategory = this._createCustomerSearchSuggestionCategory(options.showCustomerSearchFields);
            this._productSearchSuggestionCategory = this._createProductSearchSuggestionCategory();
            this.headerSearchSuggestionsCategories = this._getHeaderSearchSuggestionsCategoriesComputed(options);
            this.isProductSuggestionsEnabled = Commerce.ApplicationContext.Instance.deviceConfiguration.IsProductSuggestionsEnabled;
            this.productSuggestionsFound = ko.observable(false);
            this.productKeywordSuggestionsFound = ko.observable(false);
            this.productScopedCategorySuggestionsFound = ko.observable(false);
            this.productSearchSuggestionsVisible = ko.computed(function () { return _this.productSuggestionsVisible(); });
            this.productSearchScopedCategorySuggestionsVisible = ko.computed(function () { return _this.productScopedCategorySuggestionsVisible(); });
            this.productSearchKeywordSuggestionsVisible = ko.computed(function () { return _this.productKeywordSuggestionsVisible(); });
            this.searchSwitchOptions = ko.observableArray([]);
            this.productSearchSuggestions = ko.observableArray([]);
            this.productSearchScopedCategorySuggestions = ko.observableArray([]);
            this.productSearchKeywordSuggestions = ko.observableArray([]);
            this.searchTextAreaHasFocus = ko.observable(false);
            this.searchTextAreaHasFocus.subscribe(function (val) {
                if (val === true) {
                    _this.showSearchHelper(true);
                }
            });
            this.searchType = ko.computed(function () {
                return _this._searchType();
            });
            this._$element.addClass("minWidth24");
        }
        HeaderSearchHandler.prototype.productSuggestionsVisible = function () {
            return this.isProductSuggestionsEnabled && !this._hideProductSuggestions() && this.productSuggestionsFound();
        };
        HeaderSearchHandler.prototype.productScopedCategorySuggestionsVisible = function () {
            return this.isProductSuggestionsEnabled && !this._hideProductSuggestions() && this.productScopedCategorySuggestionsFound();
        };
        HeaderSearchHandler.prototype.productKeywordSuggestionsVisible = function () {
            return this.isProductSuggestionsEnabled && !this._hideProductSuggestions() && this.productKeywordSuggestionsFound();
        };
        HeaderSearchHandler.prototype.searchSuggestionOffScreenClickHandler = function () {
            this.showSearchHelper(false);
        };
        HeaderSearchHandler.prototype.updateProductCustomerSearchContexts = function (partialSearchText) {
            this.productSearchSuggestions.removeAll();
            this.productSearchScopedCategorySuggestions.removeAll();
            this.productSearchKeywordSuggestions.removeAll();
            if (partialSearchText.length >= 1 && this.splitViewSearchPaneHasFocus()) {
                this.showSearchHelper(true);
                this.productSuggestionsFound(false);
                this.productScopedCategorySuggestionsFound(false);
                this.productKeywordSuggestionsFound(false);
                if (this.isProductSuggestionsEnabled && !this._hideProductSuggestions()) {
                    this.retrieveAndSetProductSearchTextSuggestionsAsync(partialSearchText);
                }
                this.bindKeyPressWithSearchHelper(this, this._categorySearchHelperDivSelector);
            }
            else {
                this.showSearchHelper(false);
            }
        };
        HeaderSearchHandler.prototype.searchBoxKeyDown = function (data, event) {
            if (event.keyCode === 40 && this.searchHelperVisible()) {
                if ($(this._searchHelperDivSelector).first().length) {
                    $(this._searchHelperDivSelector).first().focus().addClass(this._searchHelperDivSelectedClass);
                }
                event.preventDefault();
            }
            return true;
        };
        HeaderSearchHandler.prototype.invokeSearch = function (category, subCategory) {
            var searchType = Commerce.Client.Entities.HeaderSearchType.Product;
            if (subCategory instanceof HeaderSearch.HeaderSearchCustomerSearchField) {
                searchType = Commerce.Client.Entities.HeaderSearchType.Customer;
                Commerce.RetailLogger.viewModelSearchViewModelInvokeSearch("Product", "Customer");
            }
            else if (category.searchType === HeaderSearchType.Product) {
                Commerce.RetailLogger.viewModelSearchViewModelInvokeSearch("Customer", "Product");
            }
            else {
                searchType = Commerce.Client.Entities.HeaderSearchType.Customer;
                Commerce.RetailLogger.viewModelSearchViewModelInvokeSearch("Product", "Customer");
            }
            this._searchType(searchType);
            this.searchInvokeValidate(category.searchType, subCategory);
        };
        HeaderSearchHandler.prototype.invokeSearchByProductSearchSuggestion = function (productSearchSuggestion) {
            Commerce.RetailLogger.viewModelSearchViewModelInvokeSearch("Customer", "Product");
            if (productSearchSuggestion.suggestionType === Commerce.Proxy.Entities.SearchSuggestionType[Commerce.Proxy.Entities.SearchSuggestionType.Product]) {
                var productDetailsOptions = {
                    productId: Number(productSearchSuggestion.id),
                    product: undefined,
                    isSelectionMode: false,
                    correlationId: Commerce.StringExtensions.EMPTY
                };
                Commerce.ViewModelAdapter.navigate("SimpleProductDetailsView", productDetailsOptions);
            }
            else if (productSearchSuggestion.suggestionType === Commerce.Proxy.Entities.SearchSuggestionType[Commerce.Proxy.Entities.SearchSuggestionType.ScopedCategory]) {
                this.searchText(productSearchSuggestion.plainText.substring(0, productSearchSuggestion.plainText.indexOf("|")));
                this._searchType(Commerce.Client.Entities.HeaderSearchType.Product);
                var refinerValue = {
                    RefinerRecordId: Number(productSearchSuggestion.id),
                    RefinerSourceValue: Commerce.Proxy.Entities.ProductRefinerSource.Category,
                    LeftValueBoundString: productSearchSuggestion.plainText.substring(productSearchSuggestion.plainText.indexOf("|") + 1)
                };
                this.searchInvokeValidate(this._searchType(), null, refinerValue);
            }
            else {
                this.searchText(productSearchSuggestion.plainText);
                this._searchType(Commerce.Client.Entities.HeaderSearchType.Product);
                this.searchInvokeValidate(this._searchType(), null);
            }
        };
        HeaderSearchHandler.prototype.shouldTopSeperatorForHeaderSearchCategoryBeDisplayed = function (index) {
            var headerSearchSuggestionsCategoriesArray = this.headerSearchSuggestionsCategories();
            if ((index > 0) && (headerSearchSuggestionsCategoriesArray.length > index)) {
                return headerSearchSuggestionsCategoriesArray[index].areSubCategoriesDisplayable() ||
                    headerSearchSuggestionsCategoriesArray[index - 1].areSubCategoriesDisplayable();
            }
            return false;
        };
        HeaderSearchHandler.prototype.showSearchButtonClick = function () {
            this.toggleSearchVisibility(true);
        };
        HeaderSearchHandler.prototype.toggleSearchVisibility = function (isVisible) {
            var $splitViewShowSearch = this._$element.find(".splitViewShowSearch");
            var $splitViewSearchPane = this._$element.find(".splitViewSearchPane");
            var $splitViewSearchText = this._$element.find(this._splitViewSearchText);
            if (Commerce.ViewModelAdapter.isInView("SearchView")) {
                isVisible = true;
            }
            if (isVisible) {
                if (this.isSearchCollapsed() && Commerce.ViewModelAdapter.isInView("SearchView")) {
                    this.$splitViewTitle.parent().removeClass("grow");
                    this.$splitViewTitle.parent().addClass("no-shrink");
                    this.$splitViewTitle.hide();
                }
                if ($splitViewSearchPane.is(":hidden") || this._isSearchCollapsedJustChanged) {
                    if (this.isSearchCollapsed() && !Commerce.ViewModelAdapter.isInView("SearchView")) {
                        this.$splitViewTitle.parent().removeClass("grow");
                        this.$splitViewTitle.parent().addClass("no-shrink");
                        this.$splitViewTitle.hide();
                        $splitViewShowSearch.hide({
                            duration: 0,
                            complete: function () {
                                $splitViewSearchPane.show("slide", { direction: "right", easing: "easeInOutQuint" }, "100", function () {
                                    $splitViewSearchText.focus();
                                });
                            }
                        });
                    }
                    else {
                        $splitViewShowSearch.hide();
                        $splitViewSearchPane.show();
                        if (!this.isSearchCollapsed() && this._isSearchCollapsedJustChanged) {
                            this.$splitViewTitle.parent().addClass("grow");
                            this.$splitViewTitle.parent().removeClass("no-shrink");
                            this.$splitViewTitle.show();
                        }
                    }
                }
                else {
                    $splitViewShowSearch.hide();
                }
            }
            else {
                if (this.isSearchCollapsed()) {
                    if (this.isSplitViewSearchPaneActive()) {
                        this.$splitViewTitle.hide();
                        $splitViewShowSearch.hide();
                    }
                    else {
                        this.$splitViewTitle.parent().addClass("grow");
                        this.$splitViewTitle.parent().removeClass("no-shrink");
                        this.$splitViewTitle.show();
                        $splitViewSearchPane.hide();
                        $splitViewShowSearch.show();
                    }
                }
            }
        };
        HeaderSearchHandler.prototype.dispose = function () {
            if (Commerce.ArrayExtensions.hasElements(this._subscriptionListData)) {
                this._subscriptionListData.forEach(function (subscription) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(subscription)) {
                        subscription.dispose();
                    }
                });
            }
            Commerce.ObjectExtensions.disposeAllProperties(this);
        };
        HeaderSearchHandler.prototype.retrieveAndSetProductSearchTextSuggestionsAsync = function (partialSearchText) {
            var _this = this;
            var productManager = Commerce.Model.Managers.Factory.getManager(Commerce.Model.Managers.IProductManagerName);
            var channelId = Commerce.Session.instance.productCatalogStore.Context.ChannelId;
            var catalogId = Commerce.Session.instance.productCatalogStore.Context.CatalogId;
            var top = this._defaultNumberOfSearchSuggestions;
            var skip = 0;
            var viewModel = this;
            if (partialSearchText.length > 1) {
                return productManager.getSearchTextSuggestionsAsync(channelId, catalogId, partialSearchText, this._textFormatPreTag, this._textFormatPostTag, top, skip)
                    .done(function (searchSuggestions) {
                    var productResults = new Array();
                    var scopedCategoryResults = new Array();
                    var keywordResults = new Array();
                    searchSuggestions.forEach(function (suggestion) {
                        if (suggestion.SuggestionType === Commerce.Proxy.Entities.SearchSuggestionType[Commerce.Proxy.Entities.SearchSuggestionType.ScopedCategory]) {
                            var plainTextValue = suggestion.Value.substring(Math.max(0, suggestion.Value.lastIndexOf("|") + 1));
                            plainTextValue = plainTextValue.replace(new RegExp(_this._textFormatPreTag, "g"), "");
                            plainTextValue = plainTextValue.replace(new RegExp(_this._textFormatPostTag, "g"), "");
                            var item = {
                                htmlString: Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_30258"), partialSearchText, plainTextValue),
                                plainText: Commerce.StringExtensions.format("{0}|{1}", partialSearchText, plainTextValue),
                                getAriaLabel: function (productLabel) {
                                    return Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_1051"), productLabel);
                                },
                                suggestionType: suggestion.SuggestionType,
                                imageUrl: suggestion.ImageUrl,
                                price: null,
                                id: suggestion.Id
                            };
                            scopedCategoryResults.push(item);
                        }
                        else if (suggestion.SuggestionType === Commerce.Proxy.Entities.SearchSuggestionType[Commerce.Proxy.Entities.SearchSuggestionType.Product]) {
                            var plainTextValue = suggestion.Value;
                            plainTextValue = plainTextValue.replace(new RegExp(_this._textFormatPreTag, "g"), "");
                            plainTextValue = plainTextValue.replace(new RegExp(_this._textFormatPostTag, "g"), "");
                            var item = {
                                htmlString: Commerce.StringExtensions.format("{0} {1}", suggestion.Value, Commerce.Formatters.PriceFormatter(suggestion.Value3.Value.DecimalValue)),
                                plainText: plainTextValue,
                                getAriaLabel: function (productLabel) {
                                    return Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_1051"), productLabel);
                                },
                                suggestionType: suggestion.SuggestionType,
                                imageUrl: suggestion.ImageUrl,
                                price: Commerce.Formatters.PriceFormatter(suggestion.Value3.Value.DecimalValue),
                                id: suggestion.Id
                            };
                            productResults.push(item);
                        }
                        else if (suggestion.SuggestionType === Commerce.Proxy.Entities.SearchSuggestionType[Commerce.Proxy.Entities.SearchSuggestionType.Keyword]
                            || suggestion.SuggestionType === Commerce.Proxy.Entities.SearchSuggestionType[Commerce.Proxy.Entities.SearchSuggestionType.None]) {
                            var plainTextValue = suggestion.Value;
                            plainTextValue = plainTextValue.replace(new RegExp(_this._textFormatPreTag, "g"), "");
                            plainTextValue = plainTextValue.replace(new RegExp(_this._textFormatPostTag, "g"), "");
                            var item = {
                                htmlString: suggestion.Value,
                                plainText: plainTextValue,
                                getAriaLabel: function (productLabel) {
                                    return Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_1051"), productLabel);
                                },
                                suggestionType: suggestion.SuggestionType
                            };
                            keywordResults.push(item);
                        }
                    });
                    if (Commerce.ArrayExtensions.hasElements(keywordResults)) {
                        viewModel.productSearchKeywordSuggestions(keywordResults);
                        viewModel.productKeywordSuggestionsFound(true);
                        viewModel.bindKeyPressWithSearchHelper(viewModel, _this._productSuggestionsSearchHelperDivSelector);
                    }
                    if (Commerce.ArrayExtensions.hasElements(scopedCategoryResults)) {
                        viewModel.productSearchScopedCategorySuggestions(scopedCategoryResults);
                        viewModel.productScopedCategorySuggestionsFound(true);
                        viewModel.bindKeyPressWithSearchHelper(viewModel, _this._productSuggestionsSearchHelperDivSelector);
                    }
                    if (Commerce.ArrayExtensions.hasElements(productResults)) {
                        viewModel.productSearchSuggestions(productResults);
                        viewModel.productSuggestionsFound(true);
                        viewModel.bindKeyPressWithSearchHelper(viewModel, _this._productSuggestionsSearchHelperDivSelector);
                    }
                });
            }
            else {
                return Commerce.VoidAsyncResult.createResolved();
            }
        };
        HeaderSearchHandler.prototype.bindKeyPressWithSearchHelper = function (headerSearchHandler, elementsClassIdentifier) {
            var $splitViewSearchText = headerSearchHandler._$element.find(this._splitViewSearchText);
            var $elementsToBindKeyPressEventHandler = this._$element.find(elementsClassIdentifier);
            $elementsToBindKeyPressEventHandler.on("keydown", function (event) {
                var anyKeyPressHandled = false;
                var $target = $(event.target);
                if (headerSearchHandler.searchHelperVisible()) {
                    if (event.keyCode === 40) {
                        if ($target.nextAll(headerSearchHandler._searchHelperDivSelector + ":eq(0)").length !== 0) {
                            $target.removeClass(headerSearchHandler._searchHelperDivSelectedClass);
                            $target.nextAll(headerSearchHandler._searchHelperDivSelector + ":eq(0)")
                                .focus()
                                .addClass(headerSearchHandler._searchHelperDivSelectedClass);
                        }
                        anyKeyPressHandled = true;
                    }
                    else if (event.keyCode === 38) {
                        $target.removeClass(headerSearchHandler._searchHelperDivSelectedClass);
                        if ($target.prevAll(headerSearchHandler._searchHelperDivSelector + ":eq(0)").length !== 0) {
                            $target.prevAll(headerSearchHandler._searchHelperDivSelector + ":eq(0)")
                                .focus()
                                .addClass(headerSearchHandler._searchHelperDivSelectedClass);
                        }
                        else {
                            $splitViewSearchText.focus();
                        }
                        anyKeyPressHandled = true;
                    }
                    else if (event.keyCode === 13) {
                        $target.click();
                        anyKeyPressHandled = true;
                    }
                    if (anyKeyPressHandled) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        return false;
                    }
                }
                return true;
            });
        };
        HeaderSearchHandler.prototype.searchInvokeValidate = function (categoryId, subCategory, refinerValue) {
            var $splitViewSearchText = this._$element.find(this._splitViewSearchText);
            if (this.searchText().length <= 0) {
                this.toggleSearchVisibility(false);
                $splitViewSearchText.focus();
                this.showSearchHelper(false);
            }
            else {
                var searchString = this.searchText();
                var customerSearchByFieldCriteria = void 0;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(subCategory) && (subCategory instanceof HeaderSearch.HeaderSearchCustomerSearchField)) {
                    var customerSearchByFieldCriterion = void 0;
                    customerSearchByFieldCriterion = {
                        SearchTerm: searchString,
                        SearchField: subCategory.CustomerSearchField.SearchField
                    };
                    customerSearchByFieldCriteria = {
                        Criteria: [customerSearchByFieldCriterion]
                    };
                }
                var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                Commerce.RetailLogger.controlsHeaderSearchSearchInitiated(correlationId);
                if (!Commerce.ViewModelAdapter.isInView("SearchView")) {
                    $splitViewSearchText.trigger("change");
                    var searchEntity = void 0;
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(customerSearchByFieldCriteria)) {
                        searchEntity = Commerce.ViewModels.SearchViewSearchEntity.Customer;
                    }
                    else {
                        searchEntity = this._searchType() === HeaderSearchType.Product ?
                            Commerce.ViewModels.SearchViewSearchEntity.Product :
                            Commerce.ViewModels.SearchViewSearchEntity.Customer;
                    }
                    this._searchType(HeaderSearchType.Product);
                    var searchViewOptions = {
                        selectionMode: Commerce.ViewModels.SearchViewSelectionMode.None,
                        searchText: searchString,
                        searchEntity: searchEntity,
                        correlationId: correlationId,
                        customerSearchByFieldCriteria: customerSearchByFieldCriteria,
                        refinerValue: refinerValue
                    };
                    this.showSearchHelper(false);
                    Commerce.ViewModelAdapter.navigate("SearchView", searchViewOptions);
                }
                else {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(customerSearchByFieldCriteria) &&
                        Commerce.ObjectExtensions.isFunction(this.searchBySearchFieldClicked)) {
                        this.searchBySearchFieldClicked(customerSearchByFieldCriteria, correlationId);
                    }
                    else if (Commerce.ObjectExtensions.isFunction(this.searchClicked)) {
                        this.searchClicked.call(this, searchString, Commerce.ObjectExtensions.isNullOrUndefined(categoryId) ? this._searchType() : categoryId, correlationId, refinerValue);
                    }
                    this.showSearchHelper(false);
                }
            }
        };
        HeaderSearchHandler.prototype._getHeaderSearchSuggestionsCategoriesComputed = function (options) {
            var _this = this;
            return ko.computed(function () {
                var headerSearchSuggestionsCategories = [];
                if (!options.hideProductSearchCategory()) {
                    headerSearchSuggestionsCategories.push(_this._productSearchSuggestionCategory);
                }
                if (!options.hideCustomerSearchCategory()) {
                    _this._customerSearchSuggestionCategory.updateSubCategories(_this._getCustomerSearchSubCategories());
                    headerSearchSuggestionsCategories.push(_this._customerSearchSuggestionCategory);
                }
                return headerSearchSuggestionsCategories;
            });
        };
        HeaderSearchHandler.prototype._createProductSearchSuggestionCategory = function () {
            return new HeaderSearch.HeaderSearchCategory(Commerce.ViewModelAdapter.getResourceString("string_1043"), HeaderSearchType.Product, null, ko.observable(true));
        };
        HeaderSearchHandler.prototype._createCustomerSearchSuggestionCategory = function (showCustomerSearchFields) {
            var customerSearchSubCategories = this._getCustomerSearchSubCategories();
            var shouldShowCustomerSubCategories = showCustomerSearchFields;
            return new HeaderSearch.HeaderSearchCategory(Commerce.ViewModelAdapter.getResourceString("string_1044"), HeaderSearchType.Customer, customerSearchSubCategories, shouldShowCustomerSubCategories);
        };
        HeaderSearchHandler.prototype._getCustomerSearchSubCategories = function () {
            var customerSearchFields = Commerce.ApplicationContext.Instance.customerSearchFields;
            var customerSearchSubCategories = [];
            if (Commerce.ArrayExtensions.hasElements(customerSearchFields)) {
                customerSearchSubCategories = customerSearchFields.filter(function (customerSearchField) {
                    return !Commerce.ObjectExtensions.isNullOrUndefined(customerSearchField) && customerSearchField.IsShortcut;
                }).map(function (customerSearchField) {
                    return new HeaderSearch.HeaderSearchCustomerSearchField(customerSearchField);
                });
            }
            return customerSearchSubCategories;
        };
        return HeaderSearchHandler;
    }());
    ko.bindingHandlers.headerSearch = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            var $element = $(element);
            $element.addClass("headerSearch");
            var headerSearchHandler = new HeaderSearchHandler($element, options);
            ko.applyBindingsToNode(element, {
                template: {
                    name: "headerSearchTemplate",
                    data: headerSearchHandler
                }
            }, this);
            var $headerSearchControl = $element.find(".headerSearchControl");
            var $splitViewSearchPane = $headerSearchControl.find(".splitViewSearchPane");
            var $searchTextBox = $headerSearchControl.find(".splitViewSearchText");
            if ($searchTextBox !== undefined && $searchTextBox != null && $searchTextBox.length > 0) {
                headerSearchHandler.toggleSearchVisibility($searchTextBox.val().length > 0);
            }
            $splitViewSearchPane.on("focusin", function () {
                headerSearchHandler.splitViewSearchPaneHasFocus(true);
            });
            $splitViewSearchPane.on("focusout", function () {
                headerSearchHandler.splitViewSearchPaneHasFocus(false);
                headerSearchHandler.toggleSearchVisibility($searchTextBox.val().length > 0);
            });
            $searchTextBox.on("focus", function () {
                headerSearchHandler.updateProductCustomerSearchContexts($searchTextBox.val());
            });
            $headerSearchControl.on("focusout", function (event) {
                if ($(event.relatedTarget).hasClass("searchOptions")) {
                    return;
                }
                headerSearchHandler.showSearchHelper(false);
            });
            headerSearchHandler.toggleSearchVisibility(!headerSearchHandler.isSearchCollapsed());
            ko.utils.domNodeDisposal.addDisposeCallback(element, function (e) {
                if (element.winControl) {
                    element.winControl.dispose();
                }
                headerSearchHandler.dispose();
                headerSearchHandler = null;
            });
            return { controlsDescendantBindings: true };
        }
    };
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Controls;
    (function (Controls) {
        var HeaderSplitView;
        (function (HeaderSplitView) {
            "use strict";
            var HeaderSplitViewBindingHandler = (function () {
                function HeaderSplitViewBindingHandler() {
                    if (!Commerce.ObjectExtensions.isFunction(HeaderSplitViewBindingHandler._viewModelFactoryMethod)) {
                        throw "Cannot create new instances of HeaderSplitViewBindingHandler until the factory method is set.";
                    }
                }
                HeaderSplitViewBindingHandler.setViewModelFactory = function (factoryMethod) {
                    HeaderSplitViewBindingHandler._viewModelFactoryMethod = factoryMethod;
                };
                HeaderSplitViewBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    if (HeaderSplitViewBindingHandler._initCalled) {
                        throw new Error("HeaderSplitViewBindingHandler can only be initialized once.");
                    }
                    HeaderSplitViewBindingHandler._initCalled = true;
                    var options = ko.utils.unwrapObservable(valueAccessor()) || Object.create(null);
                    var $element = $(element);
                    $element.addClass("headerSplitView");
                    ko.applyBindingsToDescendants(bindingContext, element);
                    var headerSplitViewViewModel = HeaderSplitViewBindingHandler._viewModelFactoryMethod($element, options);
                    element.controlViewModel = headerSplitViewViewModel;
                    var divElement = document.createElement("div");
                    ko.applyBindingsToNode(divElement, {
                        preventInteraction: options.preventInteraction,
                        visible: options.isHeaderVisible
                    }, bindingContext);
                    var topTemplateDiv = document.createElement("div");
                    ko.applyBindingsToNode(topTemplateDiv, {
                        template: {
                            name: "headerSplitViewTopTemplate",
                            data: headerSplitViewViewModel
                        }
                    }, bindingContext);
                    var previousIsHeaderVisible = options.isHeaderVisible();
                    var headerSearchSubscription = options.isHeaderVisible.subscribe(function (newIsHeaderVisible) {
                        if (previousIsHeaderVisible !== newIsHeaderVisible) {
                            previousIsHeaderVisible = newIsHeaderVisible;
                            if (newIsHeaderVisible) {
                                Commerce.KnockoutHandlerHelper.getHandlerInstance(topTemplateDiv, ".headerSplitViewSelfPackingList").refresh();
                            }
                        }
                    });
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        headerSearchSubscription.dispose();
                    });
                    divElement.appendChild(topTemplateDiv);
                    element.insertBefore(divElement, element.firstChild);
                    divElement = document.createElement("div");
                    element.insertBefore(divElement, element.firstChild);
                    ko.applyBindingsToNode(divElement, {
                        template: {
                            name: "headerSplitViewExpandedPaneTemplate",
                            data: headerSplitViewViewModel
                        }
                    }, bindingContext);
                    var splitViewControlOptions = {
                        openedDisplayMode: "overlay",
                        closedDisplayMode: headerSplitViewViewModel.isCompactMode() ? "none" : "inline"
                    };
                    var splitViewControl = new WinJS.UI.SplitView(element, splitViewControlOptions);
                    splitViewControl.addEventListener("afterclose", function () {
                        headerSplitViewViewModel.hideAllExtraPanels();
                    });
                    var $splitViewPaneElement = $element.find(".win-splitview-pane");
                    $splitViewPaneElement.addClass("splitViewBackgroundColor flex");
                    ko.applyBindingsToNode($splitViewPaneElement[0], {
                        preventInteraction: options.preventInteraction,
                        visible: options.isSideBarVisible
                    }, bindingContext);
                    ko.utils.domNodeDisposal.addDisposeCallback($element.get(0), function (e) {
                        element.controlViewModel.dispose();
                        element.controlViewModel = null;
                    });
                    headerSplitViewViewModel.toggleCompactMode(headerSplitViewViewModel.isCompactMode());
                    return { controlsDescendantBindings: true };
                };
                HeaderSplitViewBindingHandler.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var options = ko.utils.unwrapObservable(valueAccessor()) || Object.create(null);
                    var splitViewHeaderViewModel = element.controlViewModel;
                    splitViewHeaderViewModel.updateOptions(options);
                };
                HeaderSplitViewBindingHandler._initCalled = false;
                return HeaderSplitViewBindingHandler;
            }());
            HeaderSplitView.HeaderSplitViewBindingHandler = HeaderSplitViewBindingHandler;
        })(HeaderSplitView = Controls.HeaderSplitView || (Controls.HeaderSplitView = {}));
    })(Controls = Commerce.Controls || (Commerce.Controls = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Controls;
    (function (Controls) {
        var HeaderSplitView;
        (function (HeaderSplitView) {
            "use strict";
            var ClosedDisplayMode;
            (function (ClosedDisplayMode) {
                ClosedDisplayMode[ClosedDisplayMode["Default"] = 0] = "Default";
                ClosedDisplayMode[ClosedDisplayMode["None"] = 1] = "None";
                ClosedDisplayMode[ClosedDisplayMode["Inline"] = 2] = "Inline";
            })(ClosedDisplayMode = HeaderSplitView.ClosedDisplayMode || (HeaderSplitView.ClosedDisplayMode = {}));
        })(HeaderSplitView = Controls.HeaderSplitView || (Controls.HeaderSplitView = {}));
    })(Controls = Commerce.Controls || (Commerce.Controls = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var HeaderSplitViewModel = (function () {
        function HeaderSplitViewModel($element, options) {
            var _this = this;
            this.USER_INFO_ITEM_COLLAPSE_ORDER = 1;
            this.DATE_AND_TIME_ITEM_COLLAPSE_ORDER = 2;
            this.HELP_ITEM_COLLAPSE_ORDER = 3;
            this.SETTINGS_ITEM_COLLAPSE_ORDER = 4;
            this.DATABASE_CONNECTION_ITEM_COLLAPSE_ORDER = 5;
            this.USER_IMAGE_ITEM_COLLAPSE_ORDER = 6;
            this.NOTIFICATIONS_ITEM_COLLAPSE_ORDER = 7;
            this.TASK_RECORDER_ITEM_COLLAPSE_ORDER = 8;
            this._currentView = ko.observable(Commerce.StringExtensions.EMPTY);
            this._$element = $element;
            this._element = $element.get(0);
            this._options = options;
            this.searchClicked = options.searchClick;
            this.searchBySearchFieldClicked = options.searchBySearchFieldClick;
            this.searchText = this._options.searchText;
            this.searchType = options.searchType;
            this.hideCustomerHeaderSearchCategory = options.hideCustomerHeaderSearchCategory;
            this.hideProductHeaderSearchCategory = options.hideProductHeaderSearchCategory;
            this.splitViewTitleElement = ko.observable(null);
            this.isSearchBarVisible = ko.observable(false);
            this.isCategoriesPanelOpen = ko.observable(false);
            this.isMiniCartPanelOpen = ko.observable(false);
            this.userImageOrInitialsOptions = ko.observable({ name: Commerce.StringExtensions.EMPTY, picture: Commerce.StringExtensions.EMPTY });
            this.shiftInfo = ko.observable(Commerce.StringExtensions.EMPTY);
            this.isOnHomeView = ko.computed(function () {
                return (_this._currentView() === "HomeView");
            });
            this.isOnCategoriesView = ko.computed(function () {
                return (_this._currentView() === "CategoriesView");
            });
            this.isOnCartView = ko.computed(function () {
                return (_this._currentView() === "CartView");
            });
            this.isOnSettingsView = ko.computed(function () {
                return (_this._currentView() === "SettingsView");
            });
            Commerce.Host.instance.timers.setImmediate(function () {
                _this._currentView(Commerce.ViewModelAdapter.getCurrentViewName());
                _this._currentViewEventHandler = (function () {
                    _this.isSearchBarVisible(true);
                    _this._currentView(Commerce.ViewModelAdapter.getCurrentViewName());
                }).bind(_this);
                Commerce.navigator.eventManager.addEventListener("CurrentViewChanged", _this._currentViewEventHandler);
            });
            this.title = ko.computed(function () {
                var givenTitle = options.title();
                return Commerce.StringExtensions.isNullOrWhitespace(givenTitle) ? Commerce.StringExtensions.EMPTY : givenTitle;
            });
            this.navigateBackVisible = ko.computed(function () {
                return options.navigateBackVisible();
            });
            this.setFocusOnSearchText = options.setFocusOnSearchText;
            this.showCustomerSearchFields = options.showCustomerSearchFields;
            this.isConnected = ko.observable(Commerce.Session.instance.connectionStatus === Commerce.Client.Entities.ConnectionStatusType.Online);
            this.isConnectionStatusPulsing = ko.observable(false);
            this.isNewNotifications = ko.observable(Commerce.Session.instance.newNotificationStatus);
            this.showNotificationIcon = ko.observable(false);
            this._isShowTotalLines = false;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(Commerce.ApplicationContext.Instance.tillLayoutProxy)) {
                var currentOrientation = Commerce.ApplicationContext.Instance.tillLayoutProxy.orientation;
                var currentTransactionScreenLayout = Commerce.ApplicationContext.Instance.tillLayoutProxy.getTransactionScreenLayout(currentOrientation);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(currentTransactionScreenLayout) &&
                    currentTransactionScreenLayout.TransactionSummaryOptionsValue === Commerce.Proxy.Entities.TransactionSummaryOptions.TotalLines) {
                    this._isShowTotalLines = true;
                }
            }
            this.reduceItemCountDescriptionSize = ko.observable(false);
            if (Commerce.ObjectExtensions.isNullOrUndefined(HeaderSplitViewModel.miniCartProductPrimaryImageAttributeMap)) {
                HeaderSplitViewModel.miniCartProductPrimaryImageAttributeMap = new Commerce.Dictionary();
            }
            this.miniCart = ko.observable(null);
            this.currentCartItemCount = ko.observable(Commerce.StringExtensions.EMPTY);
            this.transactionSummaryOptionsText = ko.observable(Commerce.StringExtensions.EMPTY);
            this.updateCartCountDisplayText();
            this.miniCartItemCount
                = ko.observable(Commerce.StringExtensions.format(Commerce.ViewModelAdapter.getResourceString("string_46"), 0));
            this.isCompactMode = ko.observable($(window).width() < HeaderSplitViewModel.COMPACT_MODE_BREAKPOINT);
            this.isSearchCollapsed = ko.observable($(window).width() < HeaderSplitViewModel.SEARCH_COLLAPSE_BREAKPOINT);
            this.isHeaderContentVisible = ko.observable(true);
            this.isLoggedOn = ko.observable(Commerce.Session.instance.isLoggedOn);
            this._onIsLoggedOnStateChangedProxied = this._onIsLoggedOnStateChanged.bind(this);
            Commerce.EventProxy.Instance.addCustomEventHandler(this._element, "IsLoggedOnStateUpdateEvent", this._onIsLoggedOnStateChangedProxied);
            this._onShiftStateChangedProxied = this._onShiftStateChanged.bind(this);
            Commerce.EventProxy.Instance.addCustomEventHandler(this._element, "ShiftStateUpdateEvent", this._onShiftStateChangedProxied);
            this.preventInteraction = ko.observable(false);
            this.splitViewTitleSectionRatioEnabled = ko.computed(function () {
                var returnValue = !_this.isSearchCollapsed() && _this.isHeaderContentVisible();
                return returnValue;
            }, this);
            this.isHeaderSplitViewToggleButtonVisible = ko.computed(function () {
                var returnValue;
                if (!options.sideBarContentVisible()) {
                    returnValue = true;
                }
                else {
                    returnValue = _this.isCompactMode() || !_this.isHeaderContentVisible();
                }
                return returnValue;
            }, this);
            this._isRecordingActive = false;
            this.isRecordingInProgress = ko.observable(false);
            this.isRecordingPaused = ko.observable(false);
            this.isRecordingActive = ko.computed(function () {
                return _this.isRecordingInProgress() || _this.isRecordingPaused();
            });
            this._updateTaskRecorderStateProperties(Commerce.UserActivityRecorder.UserActivityRecorderState.None);
            this._isRecordingActive = this.isRecordingActive();
            this._compactModeMediaQuery = window.matchMedia(Commerce.StringExtensions.format("(max-width: {0}px)", HeaderSplitViewModel.COMPACT_MODE_BREAKPOINT - 1));
            this._searchCollapseMediaQuery = window.matchMedia(Commerce.StringExtensions.format("(max-width: {0}px)", HeaderSplitViewModel.SEARCH_COLLAPSE_BREAKPOINT - 1));
            this.updateOptions(options);
            this.isBusy = ko.observable(false);
            this.renderCategoryTree = ko.observable(false);
            this._onCartUpdateHandlerProxied = this.updateCartCountDisplayText.bind(this);
            Commerce.Session.instance.addCartStateUpdateHandler(this._element, this._onCartUpdateHandlerProxied);
            this._onConnectionStatusChangedProxied = this._onConnectionStatusChanged.bind(this);
            Commerce.EventProxy.Instance.addCustomEventHandler(this._element, "ConnectionStatusUpdateEvent", this._onConnectionStatusChangedProxied);
            this._onNewNotificationStatusChangedProxied = this.onNewNotificationStatusChanged.bind(this);
            Commerce.Session.instance.addNewNotificationsStatusUpdateHandler(this._element, this._onNewNotificationStatusChangedProxied);
            this._onDisplayCustomerSatisfactionStatusChangedProxied = this.onDisplayCustomerSatisfactionStatusChanged.bind(this);
            Commerce.EventProxy.Instance.addCustomEventHandler(this._element, "CustomerSatisfactionSurveyStatusUpdateEvent", this._onDisplayCustomerSatisfactionStatusChangedProxied);
            var notificationItem = new Controls.HeaderSplitView.NotificationSelfPackingItem(HeaderSplitViewModel.notificationSelfPackingItemId, this.showNotificationIcon, this.isNewNotifications);
            notificationItem.isVisible = false;
            this.addSelfPackingItem(notificationItem, this.NOTIFICATIONS_ITEM_COLLAPSE_ORDER, true);
            var showNotificationIconSubscription = this.showNotificationIcon.subscribe(function (value) {
                notificationItem.isVisible = value;
            });
            this.showNotificationIcon(this._areNotificationsEnabled() || Commerce.Session.instance.isCustomerSatisfactionSurveryEnabled);
            var connectionStatusItem = new Controls.HeaderSplitView.ConnectionStatusSelfPackingItem("SelfPackingConnectionStatusItem", this.isConnected, this.isConnectionStatusPulsing);
            this.addSelfPackingItem(connectionStatusItem, this.DATABASE_CONNECTION_ITEM_COLLAPSE_ORDER, true);
            var settingsItem = new Controls.HeaderSplitView.SettingsSelfPackingItem("SelfPackingSettingsItem", this.navigateToSettingsView.bind(this));
            this.addSelfPackingItem(settingsItem, this.SETTINGS_ITEM_COLLAPSE_ORDER, true);
            if (!Commerce.Config.isPhone) {
                var helpItem = new Controls.HeaderSplitView.HelpSelfPackingItem("SelfPackingHelpItem");
                this.addSelfPackingItem(helpItem, this.HELP_ITEM_COLLAPSE_ORDER, true);
            }
            if (Commerce.ApplicationContext.Instance.deviceConfiguration.ShowDateTime) {
                var dateAndTimeItem = new Controls.HeaderSplitView.DateAndTimeSelfPackingItem("SelfPackingDateAndTimeInfoItem");
                this.addSelfPackingItem(dateAndTimeItem, this.DATE_AND_TIME_ITEM_COLLAPSE_ORDER, true);
            }
            var userInfoItem = new Controls.HeaderSplitView.UserInfoSelfPackingItem("SelfPackingUserInfoItem", this.userImageOrInitialsOptions, this.shiftInfo, this.callUserInfoDialog.bind(this));
            this.addSelfPackingItem(userInfoItem, this.USER_INFO_ITEM_COLLAPSE_ORDER, true);
            var userImageItem = new Controls.HeaderSplitView.UserImageSelfPackingItem("SelfPackingUserInitialsItem", this.userImageOrInitialsOptions, this.callUserInfoDialog.bind(this));
            this.addSelfPackingItem(userImageItem, this.USER_IMAGE_ITEM_COLLAPSE_ORDER, false);
            var taskRecorderItem = new Controls.HeaderSplitView.TaskRecorderSelfPackingItem(HeaderSplitViewModel.taskRecorderSelfPackingItemId, this.isRecordingInProgress, this.isRecordingPaused);
            taskRecorderItem.isVisible = this.isRecordingActive() && !Commerce.Config.isPhone;
            this.addSelfPackingItem(taskRecorderItem, this.TASK_RECORDER_ITEM_COLLAPSE_ORDER, false);
            var isRecordingActiveSubscription = this.isRecordingActive.subscribe(function (newValue) {
                if (newValue === _this._isRecordingActive || Commerce.Config.isPhone) {
                    return;
                }
                _this._isRecordingActive = newValue;
                taskRecorderItem.isVisible = _this._isRecordingActive;
            });
            ko.utils.domNodeDisposal.addDisposeCallback(this._element, function () {
                showNotificationIconSubscription.dispose();
                isRecordingActiveSubscription.dispose();
            });
            this._onTaskRecorderStateChangedProxied = function (state) {
                _this._updateTaskRecorderStateProperties(state);
            };
            Commerce.TaskRecorder.taskRecorder.addEventListener("StateChangedEvent", this._onTaskRecorderStateChangedProxied);
            this._compactModeSwitchHandler = (function (mediaQueryArgs) {
                var isCompactSize = mediaQueryArgs.matches;
                _this.isCompactMode(isCompactSize);
                _this.toggleCompactMode(isCompactSize);
            }).bind(this);
            this._compactModeMediaQuery.addListener(this._compactModeSwitchHandler);
            this._searchCollapseSwitchHandler = (function (mediaQueryArgs) {
                var shouldCollapseSearch = mediaQueryArgs.matches;
                _this.isSearchCollapsed(shouldCollapseSearch);
            }).bind(this);
            this._searchCollapseMediaQuery.addListener(this._searchCollapseSwitchHandler);
            this._windowResizeHandler = this.onWindowResize.bind(this);
            window.addEventListener("resize", this._windowResizeHandler);
            ko.utils.domNodeDisposal.addDisposeCallback($element.get(0), function (e) {
                _this.dispose();
            });
        }
        Object.defineProperty(HeaderSplitViewModel, "isBackButtonAllowed", {
            get: function () {
                return !Commerce.Helpers.DeviceActivationHelper.isInDeviceActivationProcess();
            },
            enumerable: true,
            configurable: true
        });
        HeaderSplitViewModel.getProductPrimaryImage = function (miniCartLine) {
            var imageDetails = HeaderSplitViewModel.miniCartProductPrimaryImageAttributeMap.getItem(miniCartLine.ProductId);
            if (Commerce.ObjectExtensions.isNullOrUndefined(imageDetails)) {
                var product = Commerce.Session.instance.getFromProductsInCartCache(miniCartLine.ProductId);
                imageDetails = ko.observable({ Uri: ko.observable(Commerce.DefaultImages.ProductSmall), AltText: ko.observable(Commerce.StringExtensions.EMPTY) });
                if (!Commerce.ObjectExtensions.isNullOrUndefined(product)) {
                    imageDetails().AltText(product.Name);
                }
                HeaderSplitViewModel.miniCartProductPrimaryImageAttributeMap.setItem(miniCartLine.ProductId, imageDetails);
                if (Commerce.Session.instance.connectionStatus === Commerce.Client.Entities.ConnectionStatusType.Online) {
                    var productManager = Commerce.Model.Managers.Factory.getManager(Commerce.Model.Managers.IProductManagerName);
                    var channelId = Commerce.Session.instance.productCatalogStore.Context.ChannelId;
                    var catalogId = Commerce.Session.instance.productCatalogStore.Context.CatalogId;
                    productManager.getMediaLocationsAsync(miniCartLine.ProductId, channelId, catalogId, 1, 0)
                        .done(function (mediaLocations) {
                        var mediaLocation = Commerce.ArrayExtensions.firstOrUndefined(mediaLocations);
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(mediaLocation) && !Commerce.StringExtensions.isEmptyOrWhitespace(mediaLocation.Uri)) {
                            imageDetails().Uri(Commerce.Formatters.ImageUrlFormatter(mediaLocation.Uri));
                        }
                        if (!Commerce.StringExtensions.isNullOrWhitespace(mediaLocation.AltText)) {
                            imageDetails().AltText(mediaLocation.AltText);
                        }
                    });
                }
            }
            return imageDetails;
        };
        HeaderSplitViewModel.prototype.callUserInfoDialog = function () {
            var _this = this;
            var asyncQueue = new Commerce.AsyncQueue();
            asyncQueue.enqueue(function () {
                var activity = new Commerce.Activities.UserInfoActivity({
                    title: Commerce.StringExtensions.EMPTY,
                    subTitle: Commerce.StringExtensions.EMPTY,
                    name: _this.userImageOrInitialsOptions().name,
                    picture: _this.userImageOrInitialsOptions().picture,
                    shiftInfo: _this.shiftInfo()
                });
                activity.responseHandler = function () {
                    return asyncQueue.cancelOn(Commerce.AsyncResult.createResolved()).map(function () { return void 0; });
                };
                return activity.execute().done(function () {
                    if (!activity.response) {
                        asyncQueue.cancel();
                        return;
                    }
                });
            });
            return asyncQueue.run().map(function () { return void 0; });
        };
        HeaderSplitViewModel.prototype.dispose = function () {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(this._compactModeMediaQuery)) {
                this._compactModeMediaQuery.removeListener(this._compactModeSwitchHandler);
                this._compactModeMediaQuery = null;
                this._compactModeSwitchHandler = null;
            }
            if (!Commerce.ObjectExtensions.isNullOrUndefined(this._searchCollapseMediaQuery)) {
                this._searchCollapseMediaQuery.removeListener(this._searchCollapseSwitchHandler);
                this._searchCollapseMediaQuery = null;
                this._searchCollapseSwitchHandler = null;
            }
            if (!Commerce.ObjectExtensions.isNullOrUndefined(this._windowResizeHandler)) {
                window.removeEventListener("resize", this._windowResizeHandler);
            }
            Commerce.navigator.eventManager.removeEventListener("CurrentViewChanged", this._currentViewEventHandler);
            Commerce.TaskRecorder.taskRecorder.removeEventListener("StateChangedEvent", this._onTaskRecorderStateChangedProxied);
            Commerce.Session.instance.removeCartStateUpdateHandler(this._element, this._onCartUpdateHandlerProxied);
            Commerce.EventProxy.Instance.removeCustomEventHandler(this._element, "ConnectionStatusUpdateEvent", this._onConnectionStatusChangedProxied);
            Commerce.EventProxy.Instance.removeCustomEventHandler(this._element, "IsLoggedOnStateUpdateEvent", this._onIsLoggedOnStateChangedProxied);
            Commerce.EventProxy.Instance.removeCustomEventHandler(this._element, "ShiftStateUpdateEvent", this._onShiftStateChangedProxied);
            Commerce.Session.instance.removeNewNotificationsStatusUpdateHandler(this._element, this._onNewNotificationStatusChangedProxied);
            Commerce.EventProxy.Instance.removeCustomEventHandler(this._element, "CustomerSatisfactionSurveyStatusUpdateEvent", this._onDisplayCustomerSatisfactionStatusChangedProxied);
            Commerce.ObjectExtensions.disposeAllProperties(this);
        };
        HeaderSplitViewModel.prototype.updateOptions = function (options) {
            if (!Commerce.ObjectExtensions.isObject(options)) {
                throw "Cannot execute updateOptions with undefined options";
            }
            this._options = options;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(options.headerContentVisible)) {
                this.isHeaderContentVisible(ko.utils.unwrapObservable(options.headerContentVisible) === true);
            }
            var isCompactSize = this._compactModeMediaQuery.matches;
            this.toggleInlineNavigation(!isCompactSize);
        };
        HeaderSplitViewModel.prototype.hideAllExtraPanels = function () {
            var $allExtraPanels = this._$element.find(HeaderSplitViewModel.selectorMiniCartPanel + ", " + HeaderSplitViewModel.selectorCategoriesPanel);
            $allExtraPanels.each(function (index, elem) {
                var $panel = $(elem);
                if ($panel.data(HeaderSplitViewModel.panelVisibilityAttr) === true) {
                    $panel.hide();
                    $panel.data(HeaderSplitViewModel.panelVisibilityAttr, false);
                }
            });
            this.isCategoriesPanelOpen(false);
            this.isMiniCartPanelOpen(false);
        };
        HeaderSplitViewModel.prototype.toggleCompactMode = function (isCompact) {
            this.toggleInlineNavigation(!isCompact);
            this.onWindowResize();
        };
        HeaderSplitViewModel.prototype.showHelpViewPanelClick = function () {
            Commerce.TaskRecorder.taskRecorder.activateRecorder("Help");
        };
        HeaderSplitViewModel.prototype.navigateToCartView = function () {
            this._navigate("CartView");
        };
        HeaderSplitViewModel.prototype.navigateToSettingsView = function () {
            this._navigate("SettingsView");
        };
        HeaderSplitViewModel.prototype.navigateToHomeView = function () {
            this._navigate("HomeView");
        };
        HeaderSplitViewModel.prototype.navigateToCategoriesView = function () {
            this._navigate("CategoriesView");
        };
        Object.defineProperty(HeaderSplitViewModel.prototype, "headerSplitViewElement", {
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        HeaderSplitViewModel.prototype.createCategoryTreeRenderer = function () {
            return new Commerce.Controls.IncrementalControl.CategoryTreeDataRenderer(Commerce.Session.instance.CurrentCategoryList, this.navigateToProductsView);
        };
        HeaderSplitViewModel.prototype.navigateToCatalogsView = function () {
            Commerce.ViewModelAdapter.navigate("CatalogsView");
        };
        HeaderSplitViewModel.prototype.navigateToProductsView = function (data) {
            var productCategoryName = Commerce.StringExtensions.EMPTY;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(data) &&
                !Commerce.ObjectExtensions.isNullOrUndefined(data.category) &&
                !Commerce.ObjectExtensions.isNullOrUndefined(data.category.Name)) {
                productCategoryName = data.category.Name;
            }
            var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
            Commerce.RetailLogger.viewsHeaderSplitViewProductCategorySelected(correlationId, productCategoryName);
            Commerce.ViewModelAdapter.navigate("ProductsView", {
                category: data.category,
                activeMode: Commerce.ViewModels.ProductsViewModelActiveMode.Products,
                correlationId: correlationId
            });
        };
        HeaderSplitViewModel.prototype.logOff = function () {
            var _this = this;
            this.isBusy(true);
            var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
            Commerce.AsyncResult.fromPromise(Commerce.Runtime.executeAsync(new Commerce.LogOffOperationRequest(correlationId))).fail(function (error) {
                _this.isBusy(false);
                Commerce.NotificationHandler.displayClientErrors(error, "string_509");
            });
        };
        HeaderSplitViewModel.prototype.showMiniCart = function () {
            var labelForCartTotalLineOrItemCount;
            var cartTotalLineOrItemCount;
            this.showExtraPanel(HeaderSplitViewModel.selectorMiniCartPanel);
            this.miniCart(Commerce.Session.instance.cart);
            if (this._isShowTotalLines) {
                cartTotalLineOrItemCount = Commerce.CartHelper.GetNonVoidedCartLines(Commerce.Session.instance.cart.CartLines).length;
                labelForCartTotalLineOrItemCount = cartTotalLineOrItemCount === 1 ?
                    Commerce.ViewModelAdapter.getResourceString("string_45") : Commerce.ViewModelAdapter.getResourceString("string_46");
            }
            else {
                cartTotalLineOrItemCount = !Commerce.ObjectExtensions.isNullOrUndefined(Commerce.Session.instance.cart.TotalItems) ? Commerce.Session.instance.cart.TotalItems : 0;
                labelForCartTotalLineOrItemCount = cartTotalLineOrItemCount === 1 ?
                    Commerce.ViewModelAdapter.getResourceString("string_29991") : Commerce.ViewModelAdapter.getResourceString("string_29992");
            }
            this.miniCartItemCount(Commerce.StringExtensions.format(labelForCartTotalLineOrItemCount, cartTotalLineOrItemCount));
            this.isMiniCartPanelOpen(true);
        };
        HeaderSplitViewModel.prototype.showCategories = function () {
            if (!this.renderCategoryTree()) {
                this.renderCategoryTree(true);
            }
            this.showExtraPanel(HeaderSplitViewModel.selectorCategoriesPanel);
            this.isCategoriesPanelOpen(true);
        };
        HeaderSplitViewModel.prototype.navigateBack = function () {
            Commerce.navigator.navigateBack();
            if (!Commerce.ObjectExtensions.isNullOrUndefined(this._element.winControl) && this._element.winControl._isOpenedMode) {
                this._clickToggleButton();
            }
        };
        HeaderSplitViewModel.prototype._onConnectionStatusChanged = function (args) {
            this.isConnected(args.newStatus === Commerce.Client.Entities.ConnectionStatusType.Online);
            if (!this.isConnected()) {
                this._pulseConnectionStatus();
            }
        };
        HeaderSplitViewModel.prototype._onIsLoggedOnStateChanged = function (args) {
            this.isLoggedOn(args.isLoggedOn);
            this.userImageOrInitialsOptions({
                name: Commerce.EmployeeHelper.getName(args.currentEmployee),
                picture: Commerce.EmployeeHelper.getPicture(args.currentEmployee, Commerce.Session.instance.connectionStatus)
            });
        };
        HeaderSplitViewModel.prototype._onShiftStateChanged = function (newShift) {
            this.shiftInfo(Commerce.StringExtensions.format("{0} - {1}", newShift.ShiftId, newShift.TerminalId));
        };
        HeaderSplitViewModel.prototype._pulseConnectionStatus = function () {
            var _this = this;
            this.isConnectionStatusPulsing(true);
            setTimeout(function () {
                if (!Commerce.ObjectExtensions.isNullOrUndefined(_this.isConnectionStatusPulsing)) {
                    _this.isConnectionStatusPulsing(false);
                }
            }, 2000);
        };
        HeaderSplitViewModel.prototype.onNewNotificationStatusChanged = function (newStatus) {
            this.isNewNotifications(newStatus);
        };
        HeaderSplitViewModel.prototype.onDisplayCustomerSatisfactionStatusChanged = function (newCustomerSatisfactionDisplayStatus) {
            this.showNotificationIcon(this._areNotificationsEnabled() || newCustomerSatisfactionDisplayStatus);
        };
        HeaderSplitViewModel.prototype.addSelfPackingItem = function (item, packingOrder, displayBeforeOverflowButton) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(this.selfPackingListItems)) {
                this.selfPackingListItems = {
                    itemsConfig: []
                };
            }
            var newItem = {
                item: item,
                packingOrder: packingOrder,
                displayBeforeOverflowButton: displayBeforeOverflowButton
            };
            this.selfPackingListItems.itemsConfig.push(newItem);
        };
        HeaderSplitViewModel.prototype._updateTaskRecorderStateProperties = function (currentState) {
            this.isRecordingInProgress((currentState === Commerce.UserActivityRecorder.UserActivityRecorderState.Recording) ||
                (currentState === Commerce.UserActivityRecorder.UserActivityRecorderState.Validating));
            this.isRecordingPaused((currentState === Commerce.UserActivityRecorder.UserActivityRecorderState.RecordingPaused) ||
                (currentState === Commerce.UserActivityRecorder.UserActivityRecorderState.ValidationPaused));
        };
        HeaderSplitViewModel.prototype.getNonVoidedTotalLinesOrItems = function () {
            var linesOrItemsCount = 0;
            if (this._isShowTotalLines) {
                linesOrItemsCount = Commerce.CartHelper.GetNonVoidedCartLines(Commerce.Session.instance.cart.CartLines).length;
            }
            else {
                linesOrItemsCount = !Commerce.ObjectExtensions.isNullOrUndefined(Commerce.Session.instance.cart.TotalItems) ? Commerce.Session.instance.cart.TotalItems : 0;
            }
            return linesOrItemsCount;
        };
        HeaderSplitViewModel.prototype.showExtraPanel = function (panelSelector) {
            var _this = this;
            var $extraPanels = this._$element.find(panelSelector);
            if ($extraPanels.data(HeaderSplitViewModel.panelVisibilityAttr) !== true) {
                this.hideAllExtraPanels();
                var animationCompleteCallBack_1 = function () {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(_this._element)) {
                        _this.openSplitViewPane();
                    }
                };
                var dir_1 = Commerce.CSSHelpers.isRightToLeft() ? "right" : "left";
                $extraPanels.each(function (index, elem) {
                    var $panel = $(elem);
                    if ($panel.data(HeaderSplitViewModel.panelVisibilityAttr) === true) {
                        $panel.hide("slide", { direction: dir_1 }, "300", animationCompleteCallBack_1);
                        $panel.data(HeaderSplitViewModel.panelVisibilityAttr, false);
                    }
                    else {
                        $panel.show("slide", { direction: dir_1 }, "300", animationCompleteCallBack_1);
                        $panel.data(HeaderSplitViewModel.panelVisibilityAttr, true);
                        $panel.focus();
                        var tabIndex = "tabindex";
                        if (Commerce.StringExtensions.isNullOrWhitespace($panel.attr(tabIndex))) {
                            $panel.attr(tabIndex, "-1");
                        }
                    }
                });
            }
        };
        HeaderSplitViewModel.prototype.openSplitViewPane = function () {
            var splitView = this._$element[0].winControl;
            if (!splitView.paneOpened) {
                splitView.openPane();
            }
        };
        HeaderSplitViewModel.prototype.toggleInlineNavigation = function (isInline) {
            if (!this._options.sideBarContentVisible()) {
                isInline = false;
            }
            if (!Commerce.ObjectExtensions.isNullOrUndefined(this._element.winControl)) {
                this._element.winControl.closedDisplayMode = !isInline || !this.isHeaderContentVisible() ? "none" : "inline";
            }
        };
        HeaderSplitViewModel.prototype.onWindowResize = function () {
            var selfPackingList = Commerce.KnockoutHandlerHelper.getHandlerInstance(this._$element[0], ".headerSplitViewSelfPackingList");
            var selfPackingListWidth = 0;
            if (this.isCompactMode()) {
                selfPackingListWidth = this._$element.find(".win-splitview-content").width() / 3;
            }
            else {
                selfPackingListWidth = this._$element.find(".selfPackingControlSection").width();
            }
            selfPackingList.resize(selfPackingListWidth);
        };
        HeaderSplitViewModel.prototype.updateCartCountDisplayText = function () {
            var displayText = Commerce.StringExtensions.EMPTY;
            if (!Commerce.ObjectExtensions.isNullOrUndefined(Commerce.Session.instance.cart) &&
                Commerce.ArrayExtensions.hasElements(Commerce.Session.instance.cart.CartLines)) {
                var linesOrItemsCount = this.getNonVoidedTotalLinesOrItems();
                if (linesOrItemsCount > 99) {
                    displayText = "99+";
                    this.reduceItemCountDescriptionSize(true);
                }
                else {
                    displayText = linesOrItemsCount.toString();
                    if (displayText.length > 2) {
                        this.reduceItemCountDescriptionSize(true);
                    }
                    else {
                        this.reduceItemCountDescriptionSize(false);
                    }
                }
            }
            else {
                displayText = "0";
                this.reduceItemCountDescriptionSize(false);
            }
            this.currentCartItemCount(displayText);
            var labelForCartTotalLineOrItemCount;
            var cartTotalLineOrItemCount;
            if (this._isShowTotalLines) {
                cartTotalLineOrItemCount = Commerce.CartHelper.GetNonVoidedCartLines(Commerce.Session.instance.cart.CartLines).length;
                labelForCartTotalLineOrItemCount = cartTotalLineOrItemCount === 1 ?
                    Commerce.ViewModelAdapter.getResourceString("string_1879") : Commerce.ViewModelAdapter.getResourceString("string_1877");
            }
            else {
                cartTotalLineOrItemCount = !Commerce.ObjectExtensions.isNullOrUndefined(Commerce.Session.instance.cart.TotalItems) ? Commerce.Session.instance.cart.TotalItems : 0;
                labelForCartTotalLineOrItemCount = cartTotalLineOrItemCount === 1 ?
                    Commerce.ViewModelAdapter.getResourceString("string_1880") : Commerce.ViewModelAdapter.getResourceString("string_1878");
            }
            this.transactionSummaryOptionsText(labelForCartTotalLineOrItemCount);
            var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
            var numberOfCartLinesInCart = Commerce.ArrayExtensions.hasElements(Commerce.Session.instance.cart.CartLines) ?
                Commerce.Session.instance.cart.CartLines.length :
                0;
            Commerce.RetailLogger.viewsHeaderSplitViewCartDisplayTextUpdated(correlationId, displayText, numberOfCartLinesInCart);
        };
        HeaderSplitViewModel.prototype._navigate = function (viewName) {
            if (!Commerce.ViewModelAdapter.isInView(viewName)) {
                Commerce.ViewModelAdapter.navigate(viewName);
            }
        };
        HeaderSplitViewModel.prototype._clickToggleButton = function () {
            var toggleButtons = this._element.getElementsByClassName("headerSplitViewToggleButton");
            if (toggleButtons.length === 0) {
                return;
            }
            var toggleButton = toggleButtons[0];
            toggleButton.click();
        };
        HeaderSplitViewModel.prototype._areNotificationsEnabled = function () {
            return !Commerce.ObjectExtensions.isNullOrUndefined(Commerce.ApplicationContext.Instance.channelConfiguration) &&
                Commerce.ApplicationContext.Instance.channelConfiguration.NotificationRefreshInterval > 0;
        };
        HeaderSplitViewModel.selectorCategoriesPanel = ".splitViewCategoriesPanel";
        HeaderSplitViewModel.selectorMiniCartPanel = ".splitViewMiniCartPanel";
        HeaderSplitViewModel.miniCartProductPrimaryImageAttributeMap = null;
        HeaderSplitViewModel.panelVisibilityAttr = "panelVisible";
        HeaderSplitViewModel.taskRecorderSelfPackingItemId = "SelfPackingTaskRecorderItem";
        HeaderSplitViewModel.notificationSelfPackingItemId = "SelfPackingNotificationItem";
        HeaderSplitViewModel.COMPACT_MODE_BREAKPOINT = 961;
        HeaderSplitViewModel.SEARCH_COLLAPSE_BREAKPOINT = 961;
        return HeaderSplitViewModel;
    }());
    Commerce.HeaderSplitViewModel = HeaderSplitViewModel;
    var Controls;
    (function (Controls) {
        var HeaderSplitView;
        (function (HeaderSplitView) {
            function createHeaderSplitViewModel($element, options) {
                return new HeaderSplitViewModel($element, options);
            }
            HeaderSplitView.createHeaderSplitViewModel = createHeaderSplitViewModel;
        })(HeaderSplitView = Controls.HeaderSplitView || (Controls.HeaderSplitView = {}));
    })(Controls = Commerce.Controls || (Commerce.Controls = {}));
})(Commerce || (Commerce = {}));
Commerce.Controls.HeaderSplitView.HeaderSplitViewBindingHandler.setViewModelFactory(Commerce.Controls.HeaderSplitView.createHeaderSplitViewModel);
ko.bindingHandlers.headerSplitView = new Commerce.Controls.HeaderSplitView.HeaderSplitViewBindingHandler();
ko.bindingHandlers.headerSplitViewButton = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        if (element.nodeName !== "BUTTON") {
            throw "headerSplitViewButton can only be used with <button></button> element.";
        }
        var $element = $(element);
        var dataSource = valueAccessor();
        var hasCustomContent = element.children.length !== 0;
        $element.addClass("headerSplitViewNavButton row height48 width100Percent pad0 noBorder navigationButton");
        $element.click(function (eventObject) {
            if (Commerce.ObjectExtensions.isFunction(dataSource.click)) {
                dataSource.click.call(viewModel);
            }
            else if (!$element.hasClass("splitViewToggleCategoriesButton")) {
                $element.closest(".headerSplitView").each(function (index, elem) {
                    var headerSplitViewControl = elem.winControl;
                    $(elem).find(Commerce.HeaderSplitViewModel.selectorCategoriesPanel).hide();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(headerSplitViewControl) &&
                        Commerce.ObjectExtensions.isFunction(headerSplitViewControl.closePane)) {
                        headerSplitViewControl.closePane();
                    }
                });
            }
            eventObject.preventDefault();
            eventObject.stopPropagation();
        });
        if (!hasCustomContent) {
            ko.applyBindingsToNode(element, {
                template: { name: "headerSplitViewNavButtonTemplate", data: dataSource }
            });
        }
        return { controlsDescendantBindings: !hasCustomContent };
    }
};
ko.bindingHandlers.image = (function () {
    "use strict";
    return {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            $(element).on("error", function () {
                var value = valueAccessor(), defaultSrc = value.defaultSrc;
                Commerce.BindingHandlers.SetDefaultImageOnError(element, defaultSrc);
            });
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor(), src = value.src, alt = value.alt, defaultSrc = value.defaultSrc, ariaLabel = value.ariaLabel;
            if (!Commerce.StringExtensions.isNullOrWhitespace(src)) {
                $(element).attr("src", src);
            }
            else {
                $(element).attr("src", defaultSrc);
            }
            if (!Commerce.StringExtensions.isNullOrWhitespace(alt)) {
                $(element).attr("alt", alt);
            }
            if (!Commerce.StringExtensions.isNullOrWhitespace(ariaLabel)) {
                $(element).attr("aria-label", ariaLabel);
            }
        }
    };
})();
ko.bindingHandlers.loader = new Commerce.Controls.Loader.LoaderBindingHandler();
ko.bindingHandlers.menu = new Commerce.Controls.Menu.MenuBindingHandler();
ko.bindingHandlers.menuCommand = new Commerce.Controls.Menu.MenuCommandBindingHandler();
ko.bindingHandlers.toggleMenu = new Commerce.Controls.Menu.ToggleMenuBindingHandler();
ko.bindingHandlers.toggleMenuCommand = new Commerce.Controls.Menu.ToggleMenuCommandBindingHandler();
ko.bindingHandlers.setImageOnError = {
    init: function (element, valueAccessor) {
        element.addEventListener("error", function () {
            var value = ko.utils.unwrapObservable(valueAccessor() || {});
            Commerce.BindingHandlers.SetDefaultImageOnError(element, value);
        });
    }
};
ko.bindingHandlers.showHideWithFocus = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var observable = valueAccessor();
        var $element = $(element);
        observable.subscribe(function (newValue) {
            var slidedirection = !Commerce.CSSHelpers.isRightToLeft() ? "left" : "right";
            if (newValue) {
                $element.show("slide", { easing: "easeInOutQuint", direction: slidedirection }, "fast", function () {
                    $(element).focus();
                });
            }
            else {
                $element.hide("slide", { easing: "easeInOutQuint", direction: slidedirection }, "fast", function () {
                    $(element).blur();
                });
            }
        });
    }
};
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
ko.bindingHandlers.slideVisible = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {};
        var slideDirection = !Commerce.CSSHelpers.isRightToLeft() ? "right" : "left";
        if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
            throw new Error("Invalid options passed to the slideVisible control: options cannot be null or undefined.");
        }
        else if (!Commerce.ObjectExtensions.isBoolean(options.isShowed)) {
            throw new Error("Invalid options passed to the slideVisible control: isShowed should be a boolean value.");
        }
        if (options.isShowed) {
            $(element).show("slide", { easing: "easeInOutCirc", direction: slideDirection }, "fast");
        }
        else {
            $(element).hide("slide", { easing: "easeInOutCirc", direction: slideDirection }, "fast");
        }
    }
};
ko.bindingHandlers.slider = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().sliderOptions || {};
        var onSlide = allBindingsAccessor().onSlide || {};
        var $element = $(element);
        var sliderRangeValue = ko.utils.unwrapObservable(valueAccessor());
        options.slide = function (event, selectedRangeValues) {
            if (Commerce.CSSHelpers.isRightToLeft()) {
                var originalMin = selectedRangeValues.values[0];
                var originalMax = selectedRangeValues.values[1];
                selectedRangeValues.values[0] = options.max - (originalMax - options.min);
                selectedRangeValues.values[1] = options.max - (originalMin - options.min);
            }
            onSlide(event, selectedRangeValues);
        };
        $element.slider(options);
        $element.slider(sliderRangeValue.slice ? "values" : "value", sliderRangeValue);
        Commerce.UI.JQueryUITouchExtensions.enableTouchEmulation($element);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            Commerce.UI.JQueryUITouchExtensions.disableTouchEmulation($element);
        });
    }
};
var Commerce;
(function (Commerce) {
    var Controls;
    (function (Controls) {
        var Tab;
        (function (Tab) {
            var TabControlState = (function () {
                function TabControlState() {
                }
                return TabControlState;
            }());
            Tab.TabControlState = TabControlState;
            var TabsPosition;
            (function (TabsPosition) {
                TabsPosition[TabsPosition["Left"] = 0] = "Left";
                TabsPosition[TabsPosition["Right"] = 2] = "Right";
            })(TabsPosition = Tab.TabsPosition || (Tab.TabsPosition = {}));
        })(Tab = Controls.Tab || (Controls.Tab = {}));
    })(Controls = Commerce.Controls || (Commerce.Controls = {}));
})(Commerce || (Commerce = {}));
ko.bindingHandlers.tabControl = (function () {
    "use strict";
    var STATE_KEY = "tabControlState";
    var TABOPTIONS_KEY = "tabOptions";
    var ACCENTCOLORCSS_CLASS = "accent";
    var CONTROLCSS_CLASS = "commerceTabControl";
    function tabClick(e) {
        e.stopPropagation();
        var $tab = $(e.currentTarget);
        var $element = $tab.closest("." + CONTROLCSS_CLASS);
        var state = $element.data(STATE_KEY);
        var tab = $tab.data(TABOPTIONS_KEY);
        if (state === null || tab === null) {
            return;
        }
        var newIndex = state.data.tabItems.indexOf(tab);
        if (newIndex !== state.data.selectedTabIndex) {
            updateDOM(newIndex, state);
        }
    }
    function updateDOM(newTabIndex, state) {
        if (state.data.tabItems) {
            var tabs = state.data.tabItems;
            if (tabs !== null) {
                if (Commerce.NumberExtensions.isNullOrNaN(newTabIndex) || (newTabIndex < 0) || (newTabIndex >= tabs.length)) {
                    newTabIndex = 0;
                }
                state.$tabsContainer.empty();
                for (var i = 0; i < tabs.length; i++) {
                    var tab = tabs[i];
                    tab.isSelected = i === newTabIndex;
                    var $associatedElement = $("#" + tab.associatedElementId);
                    if (tab.visible == null || tab.visible) {
                        var tabDisplayText = Commerce.ObjectExtensions.isNullOrUndefined(tab.displayText) ? Commerce.StringExtensions.EMPTY : tab.displayText;
                        var $tab = $("<button class='tab tabBackgroundColor'><div class='icon'></div><div class='text semilight primaryFontColor'>"
                            + tabDisplayText
                            + "</div><div class='indicator'></div></button>");
                        $tab.attr("type", "button");
                        $tab.data(TABOPTIONS_KEY, tab);
                        state.$tabContent.append($associatedElement);
                        if (tab.isSelected) {
                            $tab.addClass("selected");
                            $tab.find(".indicator").addClass(ACCENTCOLORCSS_CLASS + "Background");
                            state.data.selectedTabIndex = i;
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(state.eventManager)) {
                                state.eventManager.raiseEvent("TabChangedContentId", tab.associatedElementId);
                            }
                            $associatedElement.show();
                        }
                        else {
                            $associatedElement.hide();
                        }
                        if (!Commerce.StringExtensions.isNullOrWhitespace(tab.pictureAsBase64)) {
                            $tab.find(".icon").css("background-image", "url('data:image;base64," + tab.pictureAsBase64 + "')");
                        }
                        if (tab.cssClasses) {
                            $tab.addClass(tab.cssClasses);
                        }
                        state.$tabsContainer.append($tab);
                        Commerce.BubbleHelper.formatAttribute($tab[0], "tab_{0}", tabDisplayText.toLowerCase());
                        $tab.click(tabClick);
                    }
                    else {
                        $associatedElement.hide();
                    }
                }
            }
        }
    }
    return {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            var $element = $(element);
            $element.addClass(CONTROLCSS_CLASS);
            var id = options.id || $element.attr("id");
            if (!id) {
                Commerce.ViewModelAdapter.displayMessage("tab control requires a unique Id", Commerce.MessageType.Error);
                return { controlsDescendantBindings: false };
            }
            var item = null;
            var tabControlData;
            if (options.view) {
                item = Commerce.ApplicationContext.Instance.tillLayoutProxy.getLayoutItem(options.view, id);
                if (!Commerce.ObjectExtensions.isNullOrUndefined(item)) {
                    tabControlData = {};
                    tabControlData.tabsPosition = Number(item.TabStripPlacement);
                    tabControlData.tabItems = [];
                    item.TabPages.forEach(function (tabPage) {
                        var tabItem = {};
                        tabItem.displayText = tabPage.Title;
                        var imageZones = Commerce.ApplicationContext.Instance.tillLayoutProxy
                            .getImageZones([tabPage.ZoneID]);
                        if (Commerce.ArrayExtensions.hasElements(imageZones)) {
                            tabItem.pictureAsBase64 = imageZones[0].PictureAsBase64;
                        }
                        tabItem.associatedElementId = tabPage.Content.ID;
                        tabControlData.tabItems[tabControlData.tabItems.length] = tabItem;
                    });
                }
                var orientationChangedHandler_1 = function (args) {
                    if (item) {
                        item.TabPages.forEach(function (tabPage) {
                            var $control = $element.find("#" + tabPage.Content.ID);
                            $control.removeAttr("style");
                            $element.parent().parent().append($control);
                        });
                    }
                    Commerce.ApplicationContext.Instance.tillLayoutProxy.removeOrientationChangedHandler(element, orientationChangedHandler_1);
                    $element.empty();
                    ko.cleanNode(element);
                    ko.applyBindings(viewModel, element);
                };
                Commerce.ApplicationContext.Instance.tillLayoutProxy.addOrientationChangedHandler(element, orientationChangedHandler_1);
            }
            var tabControlState = {
                id: id,
                data: tabControlData,
                eventManager: options.eventManager,
                $element: $element,
                $tabContent: null,
                $tabsContainer: null,
            };
            var $tabContent = $("<div class='tabContent'></div>");
            $tabContent.addClass("col grow");
            tabControlState.$tabContent = $tabContent;
            $element.append($tabContent);
            var $tabsContainer = $("<div class='tabsContainer'></div>");
            $tabsContainer.addClass("col");
            tabControlState.$tabsContainer = $tabsContainer;
            $element.append($tabsContainer);
            $element.addClass("row");
            if (tabControlState.data) {
                switch (tabControlState.data.tabsPosition) {
                    case Commerce.Controls.Tab.TabsPosition.Left:
                        $element.addClass("lefttabs");
                        $element.removeClass("righttabs");
                        break;
                    case Commerce.Controls.Tab.TabsPosition.Right:
                    default:
                        $element.addClass("righttabs");
                        $element.removeClass("lefttabs");
                        break;
                }
                $element.data(STATE_KEY, tabControlState);
            }
            ko.applyBindingsToDescendants(viewModel, element);
            return { controlsDescendantBindings: true };
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = $(element);
            var tabControlState = $element.data(STATE_KEY);
            if (Commerce.ObjectExtensions.isNullOrUndefined(tabControlState) || Commerce.ObjectExtensions.isNullOrUndefined(tabControlState.id)) {
                return;
            }
            updateDOM(tabControlState.data.selectedTabIndex, tabControlState);
        }
    };
})();
ko.bindingHandlers.totalsPanel = new Commerce.Controls.TotalsPanel.TotalsPanelBindingHandler();
ko.bindingHandlers.totalsPanelField = new Commerce.Controls.TotalsPanel.TotalsPanelFieldBindingHandler();
var Commerce;
(function (Commerce) {
    "use strict";
    var UserControlBindingHandler = (function () {
        function UserControlBindingHandler() {
        }
        UserControlBindingHandler.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = ko.utils.unwrapObservable(valueAccessor() || {});
            var options = value.options || {};
            var control = Commerce.ViewModelAdapterWinJS.renderControl(element, value.name, options);
            if (bindingContext.$data && options.controlHandle) {
                bindingContext.$data[options.controlHandle] = control;
            }
            return { controlsDescendantBindings: true };
        };
        return UserControlBindingHandler;
    }());
    Commerce.UserControlBindingHandler = UserControlBindingHandler;
    ko.bindingHandlers.userControl = Commerce.UserControlBindingHandler;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Controls;
    (function (Controls) {
        var ImageUpdater = (function () {
            function ImageUpdater($element) {
                $element.data(ImageUpdater.UPDATE_COUNTER_ATTRIBUTE_NAME, 0);
                this._$element = $element;
            }
            ImageUpdater.prototype.update = function (options) {
                var _this = this;
                var userName = options.name;
                var imgSrc = Commerce.Formatters.channelRichMediaBaseUrlImageFormatter(options.picture);
                var $imageElement = $("<img></img>");
                var updateCounter = this._$element.data(ImageUpdater.UPDATE_COUNTER_ATTRIBUTE_NAME) + 1;
                this._$imageElement = $imageElement;
                this._$imageElement.attr("alt", userName);
                this._$element.data(ImageUpdater.UPDATE_COUNTER_ATTRIBUTE_NAME, updateCounter);
                $imageElement.data(ImageUpdater.UPDATE_COUNTER_ATTRIBUTE_NAME, updateCounter);
                $imageElement.on("error", function () {
                    Commerce.BindingHandlers.doubleCheckImageValidity(imgSrc).done(function (srcIsValid) {
                        if (srcIsValid) {
                            _this._updateElement($imageElement);
                        }
                        else {
                            _this._updateElement(_this._getInitialsElement(userName, updateCounter));
                        }
                    });
                }).on("load", function () {
                    _this._updateElement($imageElement);
                });
                $imageElement.attr("src", imgSrc);
            };
            ImageUpdater.prototype._getInitialsElement = function (userName, updateCounter) {
                var $initialsElement = $("<div class='center accentBackground'><span></span></div>");
                var initials = Commerce.StringExtensions.EMPTY;
                if (!Commerce.ObjectExtensions.isNullOrUndefined(userName)) {
                    initials = Commerce.Helpers.NameHelper.getNameInitials(userName);
                }
                if (Commerce.StringExtensions.isEmptyOrWhitespace(initials)) {
                    $initialsElement.addClass("iconContact");
                }
                $initialsElement.find("span").text(initials);
                $initialsElement.data(ImageUpdater.UPDATE_COUNTER_ATTRIBUTE_NAME, updateCounter);
                return $initialsElement;
            };
            ImageUpdater.prototype._updateElement = function ($newElement) {
                if ($newElement.data(ImageUpdater.UPDATE_COUNTER_ATTRIBUTE_NAME) !== this._$element.data(ImageUpdater.UPDATE_COUNTER_ATTRIBUTE_NAME)) {
                    return;
                }
                $newElement.addClass(this._$element.attr("class"));
                this._$element.children().remove();
                this._$element.append($newElement);
            };
            ImageUpdater.UPDATE_COUNTER_ATTRIBUTE_NAME = "updateCounter";
            return ImageUpdater;
        }());
        var UserImageOrInitials = (function () {
            function UserImageOrInitials() {
            }
            UserImageOrInitials.init = function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var $element = $(element);
                $element.data(UserImageOrInitials.IMAGE_UPDATER_ATTRIBUTE_NAME, new ImageUpdater($element));
            };
            UserImageOrInitials.update = function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var options = ko.utils.unwrapObservable(valueAccessor()) || { name: undefined, picture: undefined };
                var $element = $(element);
                var updater = $element.data(UserImageOrInitials.IMAGE_UPDATER_ATTRIBUTE_NAME);
                updater.update(options);
            };
            UserImageOrInitials.IMAGE_UPDATER_ATTRIBUTE_NAME = "imageUpdater";
            return UserImageOrInitials;
        }());
        ko.bindingHandlers.userImageOrInitials = UserImageOrInitials;
    })(Controls = Commerce.Controls || (Commerce.Controls = {}));
})(Commerce || (Commerce = {}));
ko.bindingHandlers.winControl = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        Commerce.Host.instance.timers.setImmediate(function () {
            var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
            var value = ko.utils.unwrapObservable(valueAccessor() || {});
            var keys = Object.keys(value).join(", ");
            Commerce.RetailLogger.knockoutWinControlBindingHandlerInitializeStarted(correlationId, keys);
            var _loop_1 = function (memberName) {
                if (typeof memberName === "string") {
                    var observableMember = value[memberName];
                    var memberValue_1 = ko.utils.unwrapObservable(observableMember);
                    switch (memberName) {
                        case "incrementalDataSource":
                            Commerce.Controls.DataSourceAdapter.createIncrementalDataSourceAdapter(element.winControl, memberValue_1.dataManager, memberValue_1.callerMethod, memberValue_1.pageSize, memberValue_1.afterLoadComplete, memberValue_1.onLoading, memberValue_1.autoSelectFirstItem, memberValue_1.autoFocusFirstItem, memberValue_1.selectInvokedItem, memberValue_1.pageLoadCallBack, memberValue_1.reloadCallBack, memberValue_1.updateItemCallBack, memberValue_1.pageLoadCompleteCallBackFunction, memberValue_1.autoFocusDelayInMilliseconds);
                            break;
                        case "itemDataSource":
                            var listDataSource_1 = new WinJS.Binding.List(memberValue_1);
                            if (observableMember.subscribe) {
                                observableMember.subscribe(function (newValue) {
                                    WinJS.Promise.timeout().then(function () {
                                        listDataSource_1.splice(0, listDataSource_1.length);
                                        if (Commerce.ArrayExtensions.hasElements(newValue)) {
                                            newValue.forEach(function (value) { listDataSource_1.push(value); });
                                            if (element.winControl.autoFocusFirstItem) {
                                                Commerce.ViewModelAdapterWinJS.setFocusInWinControl(element.winControl);
                                            }
                                        }
                                    });
                                });
                            }
                            element.winControl.itemDataSource = listDataSource_1.dataSource;
                            if (listDataSource_1.length > 0
                                && element.winControl.autoFocusFirstItem) {
                                Commerce.ViewModelAdapterWinJS.setFocusInWinControl(element.winControl);
                            }
                            break;
                        case "selectListViewItem":
                            if (memberValue_1.listViewId !== "") {
                                var listViewId_1 = memberValue_1.listViewId;
                                element.winControl.addEventListener("pageselected", function (eventInfo) {
                                    var listViewControl = $(listViewId_1)[0];
                                    setTabIndex($(listViewControl));
                                    if (!Commerce.ObjectExtensions.isNullOrUndefined(listViewControl)) {
                                        listViewControl.winControl.selection.clear();
                                        listViewControl.winControl.selection.add(element.winControl.currentPage);
                                        listViewControl.winControl.ensureVisible(element.winControl.currentPage);
                                    }
                                    else {
                                        Commerce.RetailLogger.knockoutWinControlBindingHandlerWinControlElementNotFound(correlationId, "selectListViewItem.pageSelected");
                                    }
                                });
                            }
                            break;
                        case "flipItem":
                            if (memberValue_1.flipViewId !== "") {
                                var flipViewId = memberValue_1.flipViewId;
                                var $flipElement = $(flipViewId);
                                var flipViewControlElement = $flipElement[0];
                                setTabIndex($(flipViewControlElement));
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(flipViewControlElement)) {
                                    var flipViewControl_1 = flipViewControlElement.winControl;
                                    element.winControl.addEventListener("selectionchanged", function () {
                                        if (element.winControl.selection.getIndices().length === 1) {
                                            flipViewControl_1.currentPage = element.winControl.selection.getIndices()[0];
                                        }
                                    });
                                    $flipElement.find("div[class='win-surface'][tabindex='-1']").addClass("focusOutline");
                                }
                                else {
                                    Commerce.RetailLogger.knockoutWinControlBindingHandlerWinControlElementNotFound(correlationId, "flipItem.selectionChanged");
                                }
                            }
                            break;
                        case "loadingstatechanged":
                            var memberValueTmp_1 = memberValue_1;
                            var loadstatechangeHandlerAttached = "loadstatechangeHandlerAttached";
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(memberValueTmp_1)) {
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(memberValueTmp_1.AfterLoadComplete) &&
                                    Commerce.ObjectExtensions.isNullOrUndefined(element[loadstatechangeHandlerAttached]) &&
                                    !element[loadstatechangeHandlerAttached]) {
                                    element.winControl.addEventListener(memberName, function (eventInfo) {
                                        if (element.winControl.loadingState === "complete") {
                                            if (element.winControl.indexOfFirstVisible < 0
                                                && element.style.display !== "none") {
                                                $(memberValueTmp_1.AfterLoadComplete).css("display", "flex");
                                                $(element).hide();
                                            }
                                            else {
                                                Commerce.RetailLogger.librariesWinJsListViewShown(element.id);
                                                if (!Commerce.ObjectExtensions.isNullOrUndefined(memberValueTmp_1.AutoSelectFirstItem) &&
                                                    memberValueTmp_1.AutoSelectFirstItem &&
                                                    element.winControl.indexOfFirstVisible === 0 &&
                                                    element.winControl.selection.count() === 0) {
                                                    element.winControl.selection.set(0);
                                                }
                                            }
                                        }
                                        else if (element.winControl.loadingState === "viewPortLoaded") {
                                            if (!Commerce.ObjectExtensions.isNullOrUndefined(memberValueTmp_1.OnLoading) && memberValueTmp_1.OnLoading()) {
                                                memberValueTmp_1.OnLoading(false);
                                            }
                                        }
                                        else {
                                            $(memberValueTmp_1.AfterLoadComplete).hide();
                                            $(element).show();
                                        }
                                    });
                                    element[loadstatechangeHandlerAttached] = true;
                                }
                                else {
                                    if (!Commerce.ObjectExtensions.isNullOrUndefined(memberValueTmp_1.call)) {
                                        element.winControl.addEventListener(memberName, function (eventInfo) {
                                            memberValueTmp_1.call(viewModel, eventInfo);
                                        });
                                    }
                                }
                            }
                            break;
                        case "templateSwitch":
                            for (var i = 0; i < memberValue_1.length; i++) {
                                if (memberValue_1[i].buttonId !== ""
                                    && memberValue_1[i].templateId !== ""
                                    && memberValue_1[i].layoutType !== ""
                                    && memberValue_1[i].layoutType.type !== "") {
                                    var templateProperties = {
                                        buttonId: memberValue_1[i].buttonId,
                                        templateId: memberValue_1[i].templateId,
                                        layoutType: memberValue_1[i].layoutType.type,
                                        assignClassToId: memberValue_1[i].layoutType.assignClassToId,
                                        cssClasses: memberValue_1[i].layoutType.cssClasses,
                                        displayElementId: memberValue_1[i].displayElementId,
                                        appBarIds: memberValue_1[i].appBarIds
                                    };
                                    var setClickHandler = function (templateOptions, templateValues) {
                                        $(templateOptions.buttonId).click(function (event) {
                                            if ((!Commerce.ArrayExtensions.hasElements(element.winControl.itemTemplateId)
                                                && templateValues[0].templateId === templateOptions.templateId)
                                                || element.winControl.itemTemplateId === templateOptions.templateId) {
                                                return;
                                            }
                                            $(templateOptions.assignClassToId).removeClass().addClass(templateOptions.cssClasses).promise().done(function () {
                                                element.winControl.itemTemplateId = templateOptions.templateId;
                                                var templateElement = $(templateOptions.templateId)[0];
                                                if (element.winControl.setTemplate) {
                                                    element.winControl.setTemplate(templateElement);
                                                }
                                                else {
                                                    element.winControl.itemTemplate = templateElement;
                                                }
                                                element.winControl.layout = new templateOptions.layoutType();
                                                element.winControl.layout.orientation = "vertical";
                                                element.winControl.forceLayout();
                                            });
                                            for (var i_1 = 0; i_1 < templateValues.length; i_1++) {
                                                if (templateValues[i_1].displayElementId) {
                                                    var $displayElement = $(templateValues[i_1].displayElementId);
                                                    if (templateValues[i_1].templateId !== templateOptions.templateId) {
                                                        $displayElement.addClass("hide");
                                                    }
                                                    else {
                                                        $displayElement.removeClass("hide");
                                                    }
                                                }
                                            }
                                        });
                                    };
                                    setClickHandler(templateProperties, memberValue_1);
                                }
                            }
                            break;
                        case "groupedDataSource":
                            Commerce.Controls.DataSourceAdapter.createGroupedDataSourceAdapter(element.winControl, memberValue_1.itemList, memberValue_1.groupKeySelector, memberValue_1.groupDataSelector, memberValue_1.parentId, memberValue_1.keyName);
                            break;
                        case "groupheaderinvoked":
                            element.winControl.addEventListener("groupheaderinvoked", function (eventInfo) {
                                eventInfo.detail.groupHeaderPromise.then(function (headerItem) {
                                    memberValue_1.call(viewModel, headerItem.data);
                                });
                            });
                            break;
                        case "swipeBehavior":
                            Commerce.Host.instance.application.registerSwipeBinding(element);
                            break;
                        case "iteminvoked":
                            var itemInvokedAttached = "itemInvokedAttached";
                            var itemInvokedCallback_1 = memberValue_1;
                            if (Commerce.ObjectExtensions.isNullOrUndefined(element[itemInvokedAttached])) {
                                var newHandler = function (eventInfo) {
                                    if (element.winControl.tapBehavior === WinJS.UI.TapBehavior.invokeOnly) {
                                        Commerce.RetailLogger.librariesWinJsListViewItemClick(element.id);
                                        eventInfo.detail.itemPromise.then(function (item) {
                                            itemInvokedCallback_1.call(viewModel, item.data);
                                        });
                                    }
                                };
                                element.winControl.addEventListener(memberName, newHandler);
                                element[itemInvokedAttached] = true;
                            }
                            break;
                        case "click":
                            var clickCallback_1 = memberValue_1;
                            element.winControl.addEventListener(memberName, function (eventInfo) {
                                clickCallback_1.call(viewModel, eventInfo);
                            });
                            break;
                        case "toggleChanged":
                            var changeCallback_1 = memberValue_1;
                            element.winControl.addEventListener("change", function (eventInfo) {
                                var currentTarget = eventInfo.currentTarget;
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(currentTarget)) {
                                    changeCallback_1.call(viewModel, eventInfo, currentTarget.winControl.checked);
                                }
                                else {
                                    Commerce.RetailLogger.knockoutWinControlBindingHandlerWinControlElementNotFound(correlationId, "toggleChanged.change");
                                }
                            });
                            break;
                        case "toggleOnOff":
                            if (typeof memberValue_1 === "boolean") {
                                element.winControl.checked = memberValue_1;
                                if (observableMember.subscribe) {
                                    observableMember.subscribe(function (newValue) {
                                        element.winControl.checked = newValue;
                                    });
                                }
                            }
                            break;
                        case "selectionchanged":
                            var selectionChangedCallBack_1 = memberValue_1;
                            element.winControl.addEventListener(memberName, function (eventInfo) {
                                var eventTarget = eventInfo.target;
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(eventTarget)) {
                                    eventTarget.winControl.selection.getItems().then(function (item) {
                                        selectionChangedCallBack_1.eventHandlerCallBack.call(viewModel, item.map(function (item) { return item.data; }));
                                        eventInfo.preventDefault();
                                        eventInfo.stopImmediatePropagation();
                                    });
                                }
                                else {
                                    Commerce.RetailLogger.knockoutWinControlBindingHandlerWinControlElementNotFound(correlationId, "selectionchanged.selectionChanged");
                                }
                            });
                            break;
                        case "clearListViewSelection":
                            if (typeof memberValue_1 === "boolean") {
                                if (observableMember.subscribe) {
                                    observableMember.subscribe(function (newValue) {
                                        if (newValue) {
                                            element.winControl.selection.clear();
                                        }
                                    });
                                }
                            }
                            break;
                        case "contentanimating":
                        case "keyboardnavigating":
                            element.winControl.addEventListener(memberName, function (eventInfo) {
                                memberValue_1.call(viewModel, eventInfo);
                            });
                            break;
                        case "clearButton":
                            var setClearClickHandler = function (elementId) {
                                $(elementId).click(function (event) {
                                    element.winControl.selection.clear();
                                });
                            };
                            setClearClickHandler(memberValue_1);
                            break;
                        case "selectAllButton":
                            var setSelectAllClickHandler = function (elementId) {
                                $(elementId).click(function (event) {
                                    element.winControl.selection.selectAll();
                                });
                            };
                            setSelectAllClickHandler(memberValue_1);
                            break;
                        case "disabled":
                        case "enabled":
                            if (typeof memberValue_1 === "boolean") {
                                var isForDisable_1 = (memberName === "disabled");
                                element.winControl.disabled = isForDisable_1 ? memberValue_1 : !memberValue_1;
                                if (observableMember.subscribe) {
                                    observableMember.subscribe(function (newValue) {
                                        element.winControl.disabled = isForDisable_1 ? newValue : !newValue;
                                    });
                                }
                            }
                            break;
                        case "visible":
                            if (typeof memberValue_1 === "boolean") {
                                if (memberValue_1 && element.winControl.show) {
                                    element.winControl.show();
                                }
                                else if (element.winControl.hide) {
                                    element.winControl.hide();
                                }
                                if (observableMember.subscribe) {
                                    observableMember.subscribe(function (newValue) {
                                        if (typeof newValue === "boolean") {
                                            if (newValue === true && element.winControl.show) {
                                                element.winControl.show();
                                            }
                                            else if (element.winControl.hide) {
                                                element.winControl.hide();
                                            }
                                        }
                                    });
                                }
                            }
                            break;
                        case "forcelayout":
                            var forceLayout = function () {
                                var disposed = element.winControl._disposed || false;
                                if (!disposed) {
                                    element.winControl.forceLayout();
                                }
                            };
                            observableMember(forceLayout);
                            break;
                        case "layout":
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(memberValue_1.itemInfoMethod)) {
                                memberValue_1.itemInfo = function (itemIndex) {
                                    return memberValue_1.itemInfoMethod.call(viewModel, itemIndex);
                                };
                            }
                            element.winControl.layout = memberValue_1;
                            break;
                        case "labelOn":
                            element.winControl.labelOn = Commerce.ViewModelAdapterWinJS.getResourceString(value[memberName]);
                            break;
                        case "labelOff":
                            element.winControl.labelOff = Commerce.ViewModelAdapterWinJS.getResourceString(value[memberName]);
                            break;
                        case "tabIndex":
                            element.tabIndex = memberValue_1;
                            break;
                        case "preventDefaulListViewEvents":
                            if (Commerce.ObjectExtensions.isBoolean(memberValue_1) && memberValue_1) {
                                var addListener = false;
                                var winControlAttribute = element.getAttribute("data-win-control");
                                if (Commerce.StringExtensions.endsWith(winControlAttribute, "ListView")) {
                                    addListener = true;
                                }
                                else {
                                    winControlAttribute = element.getAttribute("data-bind");
                                    if (Commerce.StringExtensions.beginsWith(winControlAttribute, "dataList")) {
                                        addListener = true;
                                    }
                                }
                                if (addListener) {
                                    element.addEventListener("keydown", function (event) {
                                        var key = event.keyCode;
                                        if ((key === 13 || key === 108)) {
                                            var target_1 = event.target;
                                            if (!Commerce.ObjectExtensions.isNullOrUndefined(target_1)) {
                                                event.stopPropagation();
                                                event.preventDefault();
                                                setTimeout(function () {
                                                    var clickEvent = document.createEvent("Event");
                                                    clickEvent.initEvent("click", true, false);
                                                    target_1.dispatchEvent(clickEvent);
                                                }, 0);
                                            }
                                        }
                                    }, true);
                                }
                            }
                            break;
                        default:
                            element.winControl[memberName] = memberValue_1;
                            if (observableMember.subscribe) {
                                observableMember.subscribe(function (newValue) {
                                    element.winControl[memberName] = newValue;
                                });
                            }
                            break;
                    }
                }
            };
            for (var memberName in value) {
                _loop_1(memberName);
            }
            Commerce.RetailLogger.knockoutWinControlBindingHandlerInitializeFinished(correlationId);
        });
        function setTabIndex($element) {
            $element.children("object.win-resizeinstrument").attr("tabindex", "-1");
        }
    }
};

// SIG // Begin signature block
// SIG // MIIkDgYJKoZIhvcNAQcCoIIj/zCCI/sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // tAm+FhU7+frf3Hb0/+EGhzEF5xqvyJex1klv9N5TyF2g
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgrGnHiOGzcxF8
// SIG // 5Mohwzr5h7VnXoYqirnxJvFrTZHgfs8wgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // CF9/69r+yd7Ya2JmvZ6v4uKLsDhlNbYnSHvckzstbENi
// SIG // rbLVSUTtg8WiovoApqL1OYzuWc2gBZJ/6DJj1vLHOuKG
// SIG // vbe4SR4powC2/cQhNCacf3J/yX3BP0+Up7dbVgJROGxO
// SIG // gACSXoxXtglKMyD+puU24LnTSdr3uTpxxm6LW3Nf6PR1
// SIG // jkCyMEz4sdhwtnkdRShA1UD+Yj1arsbowp4UkMHFBv1a
// SIG // tlUbzgqCp03NSkE0q24fVgHww1KyjNJowPg1tJwY/3qF
// SIG // P7fC45fprfO7WjJTDioEAGC2ujyv8VJ56HeCWy11JRs7
// SIG // fqJOs+27aWoKvpbqRKPV/mhCSH4jEX7yFaGCEvEwghLt
// SIG // BgorBgEEAYI3AwMBMYIS3TCCEtkGCSqGSIb3DQEHAqCC
// SIG // EsowghLGAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFVBgsq
// SIG // hkiG9w0BCRABBKCCAUQEggFAMIIBPAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCCR615TrErXO8hb
// SIG // PZoEId0+1KSJcwsJnv0HQEDZ8qpD8AIGXzvljGopGBMy
// SIG // MDIwMDgyMzA0MDI0NS4yOTlaMASAAgH0oIHUpIHRMIHO
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
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIKbDMa70
// SIG // QDtpt+poQsD38I75GVK58Q5Ui0L/h9qhMj9vMIH6Bgsq
// SIG // hkiG9w0BCRACLzGB6jCB5zCB5DCBvQQgvEVqi68FUnfv
// SIG // 3BsQ3wakuG9bT14aDxawuteb1dboFNowgZgwgYCkfjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAASig
// SIG // DoHhNtVPwgAAAAABKDAiBCCrtywDQ4+oO/28q4trziVO
// SIG // SIb91wyeowerhFsxJNxURDANBgkqhkiG9w0BAQsFAASC
// SIG // AQAAh6vp1FkBbDMfQWNoUSmPC432HnkNLXy4k/0TEA0q
// SIG // Hkvq4oQWQrF+4+8F5RLsDTRLzjUwEj64K8pyBoRPF9zW
// SIG // xjucnNygu9cXxynsa1iG5EJzNVkxwUuXnCcP8pESfgxW
// SIG // Rn3mjNmEDCc5g0OPnIj1Ik/Do9SkP7BAwzSFm2Tq4S5d
// SIG // R7U4PjfUGrlZraxH/tmzRnGLzy28mQZNZr/GLdhW5MjA
// SIG // 2C13EaN/4TqkxeT9g+3k+0OTgDXst3w9M0XxY3S8RIv1
// SIG // 7Sjri19PZyOeXTHrp8u9Vd+yNC2WmaiqM6sby4MwfOlw
// SIG // e1TODE7+EHTQu8DiWJdFPJOztlytw7rIBmAf
// SIG // End signature block
