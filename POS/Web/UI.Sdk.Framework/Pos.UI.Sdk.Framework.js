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
System.register("BindingHandlers/PosSdkBindingHelper", [], function (exports_1, context_1) {
    "use strict";
    var PosSdkBindingHelper;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            PosSdkBindingHelper = (function () {
                function PosSdkBindingHelper() {
                }
                PosSdkBindingHelper.addDomNodeDisposalCallback = function (element, control) {
                    ko.utils.domNodeDisposal.addDisposeCallback(element, PosSdkBindingHelper._getDisposalCallback(control));
                };
                PosSdkBindingHelper.initializeBinding = function (init, controlName, correlationId) {
                    var retVal;
                    Commerce.RetailLogger.extensibilityFrameworkPosSdkBindingHandlerInitializeStarted(controlName, correlationId);
                    try {
                        retVal = init();
                        Commerce.RetailLogger.extensibilityFrameworkPosSdkBindingHandlerInitializeFinished(controlName, correlationId);
                    }
                    catch (ex) {
                        Commerce.RetailLogger.extensibilityFrameworkPosSdkBindingHandlerInitializeFailed(controlName, correlationId, Commerce.ErrorHelper.serializeError(ex));
                        throw ex;
                    }
                    return retVal;
                };
                PosSdkBindingHelper._getDisposalCallback = function (posControl) {
                    return function () {
                        setTimeout(function (control) {
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(control) && Commerce.ObjectExtensions.isFunction(control.dispose)) {
                                control.dispose();
                            }
                        }, PosSdkBindingHelper.DISPOSAL_TIMEOUT_IN_MILLISECONDS, posControl);
                    };
                };
                PosSdkBindingHelper.DISPOSAL_TIMEOUT_IN_MILLISECONDS = 20000;
                return PosSdkBindingHelper;
            }());
            exports_1("default", PosSdkBindingHelper);
        }
    };
});
System.register("BindingHandlers/PosSdkAppBar", ["PosUISdk/Controls/AppBar", "BindingHandlers/PosSdkBindingHelper"], function (exports_2, context_2) {
    "use strict";
    var AppBar_1, PosSdkBindingHelper_1, Controls, PosSdkAppBarBindingHandler;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (AppBar_1_1) {
                AppBar_1 = AppBar_1_1;
            },
            function (PosSdkBindingHelper_1_1) {
                PosSdkBindingHelper_1 = PosSdkBindingHelper_1_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkAppBarBindingHandler = (function (_super) {
                __extends(PosSdkAppBarBindingHandler, _super);
                function PosSdkAppBarBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkAppBarBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "AppBar";
                    return PosSdkBindingHelper_1.default.initializeBinding(function () {
                        var appBar = valueAccessor();
                        if (!(appBar instanceof AppBar_1.AppBar)) {
                            throw "PosSdkAppBar invalid binding object. Must be bound to in instance of PosUISdk::AppBar.";
                        }
                        PosSdkBindingHelper_1.default.addDomNodeDisposalCallback(element, appBar);
                        var newValueAccessor = PosSdkAppBarBindingHandler._getValueAccessor(appBar);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkAppBarBindingHandler._getValueAccessor = function (appBar) {
                    return function () { return {}; };
                };
                return PosSdkAppBarBindingHandler;
            }(Controls.AppBar.AppBarBindingHandler));
            exports_2("default", PosSdkAppBarBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkAppBarCommand", ["PosUISdk/Controls/AppBar", "BindingHandlers/PosSdkBindingHelper"], function (exports_3, context_3) {
    "use strict";
    var AppBar_2, PosSdkBindingHelper_2, PosSdkAppBarCommandBindingHandler;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (AppBar_2_1) {
                AppBar_2 = AppBar_2_1;
            },
            function (PosSdkBindingHelper_2_1) {
                PosSdkBindingHelper_2 = PosSdkBindingHelper_2_1;
            }
        ],
        execute: function () {
            PosSdkAppBarCommandBindingHandler = (function (_super) {
                __extends(PosSdkAppBarCommandBindingHandler, _super);
                function PosSdkAppBarCommandBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkAppBarCommandBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "AppBarCommand";
                    return PosSdkBindingHelper_2.default.initializeBinding(function () {
                        var appBarCommand = valueAccessor();
                        if (!(appBarCommand instanceof AppBar_2.AppBarCommand)) {
                            throw "PosSdkAppBarCommand invalid binding object. Must be bound to in instance of PosUISdk::AppBarCommand.";
                        }
                        PosSdkBindingHelper_2.default.addDomNodeDisposalCallback(element, appBarCommand);
                        var newValueAccessor = PosSdkAppBarCommandBindingHandler._getValueAccessor(appBarCommand);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkAppBarCommandBindingHandler.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var appBarCommand = valueAccessor();
                    var newValueAccessor = PosSdkAppBarCommandBindingHandler._getValueAccessor(appBarCommand);
                    return _super.prototype.update.call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                };
                PosSdkAppBarCommandBindingHandler._getValueAccessor = function (appBarCommand) {
                    var options = {
                        extraClass: appBarCommand.extraClass,
                        id: appBarCommand.id,
                        label: appBarCommand.label,
                        onclick: appBarCommand.execute.bind(appBarCommand),
                        enabled: appBarCommand.enabled,
                        visible: appBarCommand.visible,
                        flyout: appBarCommand.flyoutSelector,
                        labelResx: Commerce.StringExtensions.EMPTY
                    };
                    return function () { return options; };
                };
                return PosSdkAppBarCommandBindingHandler;
            }(Commerce.Controls.AppBar.AppBarCommandBindingHandler));
            exports_3("default", PosSdkAppBarCommandBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkDatePicker", ["PosUISdk/Controls/DatePicker", "BindingHandlers/PosSdkBindingHelper"], function (exports_4, context_4) {
    "use strict";
    var DatePicker_1, PosSdkBindingHelper_3, Controls, PosSdkDatePickerBindingHandler;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (DatePicker_1_1) {
                DatePicker_1 = DatePicker_1_1;
            },
            function (PosSdkBindingHelper_3_1) {
                PosSdkBindingHelper_3 = PosSdkBindingHelper_3_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkDatePickerBindingHandler = (function (_super) {
                __extends(PosSdkDatePickerBindingHandler, _super);
                function PosSdkDatePickerBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkDatePickerBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "DatePicker";
                    return PosSdkBindingHelper_3.default.initializeBinding(function () {
                        var datePicker = valueAccessor();
                        if (!(datePicker instanceof DatePicker_1.DatePicker)) {
                            throw "PosSdkDatePicker invalid binding object. Must be bound to in instance of PosUISdk::DatePicker.";
                        }
                        PosSdkBindingHelper_3.default.addDomNodeDisposalCallback(element, datePicker);
                        var newValueAccessor = PosSdkDatePickerBindingHandler._getValueAccessor(datePicker);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkDatePickerBindingHandler._getValueAccessor = function (datePicker) {
                    var options = {
                        current: datePicker.current,
                        datePattern: datePicker.datePattern,
                        disabled: datePicker.disabled,
                        onChange: datePicker.onChange
                    };
                    return function () { return options; };
                };
                return PosSdkDatePickerBindingHandler;
            }(Controls.DatePicker.DatePickerBindingHandler));
            exports_4("default", PosSdkDatePickerBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkHeaderSplitView", ["PosUISdk/Controls/HeaderSplitView", "BindingHandlers/PosSdkBindingHelper"], function (exports_5, context_5) {
    "use strict";
    var HeaderSplitView_1, PosSdkBindingHelper_4, PosSdkHeaderSplitView;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (HeaderSplitView_1_1) {
                HeaderSplitView_1 = HeaderSplitView_1_1;
            },
            function (PosSdkBindingHelper_4_1) {
                PosSdkBindingHelper_4 = PosSdkBindingHelper_4_1;
            }
        ],
        execute: function () {
            PosSdkHeaderSplitView = (function () {
                function PosSdkHeaderSplitView() {
                }
                PosSdkHeaderSplitView.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "HeaderSplitView";
                    return PosSdkBindingHelper_4.default.initializeBinding(function () {
                        var headerSplitView = valueAccessor();
                        if (!(headerSplitView instanceof HeaderSplitView_1.HeaderSplitView)) {
                            throw "PosSdkHeaderSplitView invalid binding object. Must be bound to in instance of PosUISdk::HeaderSplitView.";
                        }
                        var parentElement = element.parentElement;
                        if (!parentElement) {
                            throw "PosSdkHeaderSplitView invalid binding element. Must be bound to an element that has a parent object.";
                        }
                        var $grandParentElement = $(parentElement.parentElement);
                        if (!$grandParentElement.hasClass(PosSdkHeaderSplitView.PAGE_CONTROL_CLASS_NAME)) {
                            throw "PosSdkHeaderSplitView invalid binding element. Must be bound to an element that is a grand child of the page control element.";
                        }
                        var $parentElement = $(parentElement);
                        if (!$parentElement.hasClass(PosSdkHeaderSplitView.FRAGMENT_CLASS_NAME)) {
                            $parentElement.addClass(PosSdkHeaderSplitView.FRAGMENT_CLASS_NAME);
                        }
                        PosSdkBindingHelper_4.default.addDomNodeDisposalCallback(element, headerSplitView);
                        var titleObservable = Commerce.ObjectExtensions.isNullOrUndefined(headerSplitView.title) ?
                            ko.observable(Commerce.StringExtensions.EMPTY) :
                            headerSplitView.title;
                        $(element).data("title", titleObservable);
                        $(element).addClass("POS_SDK_HEADER_SPLIT_VIEW_MARKER");
                        $(element).addClass("section");
                        $(element).addClass("width100Percent");
                        return { controlsDescendantBindings: false };
                    }, controlName, correlationId);
                };
                PosSdkHeaderSplitView.FRAGMENT_CLASS_NAME = "fragment";
                PosSdkHeaderSplitView.PAGE_CONTROL_CLASS_NAME = "pagecontrol";
                return PosSdkHeaderSplitView;
            }());
            exports_5("default", PosSdkHeaderSplitView);
        }
    };
});
System.register("BindingHandlers/PosSdkLoader", ["PosUISdk/Controls/Loader", "BindingHandlers/PosSdkBindingHelper"], function (exports_6, context_6) {
    "use strict";
    var Loader_1, PosSdkBindingHelper_5, PosSdkLoaderBindingHandler;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (Loader_1_1) {
                Loader_1 = Loader_1_1;
            },
            function (PosSdkBindingHelper_5_1) {
                PosSdkBindingHelper_5 = PosSdkBindingHelper_5_1;
            }
        ],
        execute: function () {
            PosSdkLoaderBindingHandler = (function () {
                function PosSdkLoaderBindingHandler() {
                }
                PosSdkLoaderBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "Loader";
                    return PosSdkBindingHelper_5.default.initializeBinding(function () {
                        var loader = valueAccessor();
                        if (!(loader instanceof Loader_1.Loader)) {
                            throw "PosSdkLoader invalid binding object. Must be bound to in instance of PosUISdk::Loader.";
                        }
                        PosSdkBindingHelper_5.default.addDomNodeDisposalCallback(element, loader);
                        var visibleObservable = Commerce.ObjectExtensions.isNullOrUndefined(loader.visible) ?
                            ko.observable(false) : loader.visible;
                        $(element).data("visible", visibleObservable);
                        $(element).addClass("POS_SDK_LOADER_MARKER");
                        return { controlsDescendantBindings: false };
                    }, controlName, correlationId);
                };
                return PosSdkLoaderBindingHandler;
            }());
            exports_6("default", PosSdkLoaderBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkPivot", ["PosUISdk/Controls/Pivot", "BindingHandlers/PosSdkBindingHelper"], function (exports_7, context_7) {
    "use strict";
    var Pivot_1, PosSdkBindingHelper_6, Controls, PosSdkPivotBindingHandler;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (Pivot_1_1) {
                Pivot_1 = Pivot_1_1;
            },
            function (PosSdkBindingHelper_6_1) {
                PosSdkBindingHelper_6 = PosSdkBindingHelper_6_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkPivotBindingHandler = (function (_super) {
                __extends(PosSdkPivotBindingHandler, _super);
                function PosSdkPivotBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkPivotBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "Pivot";
                    return PosSdkBindingHelper_6.default.initializeBinding(function () {
                        var pivot = valueAccessor();
                        if (!(pivot instanceof Pivot_1.Pivot)) {
                            throw "PosSdkPivot invalid binding object. Must be bound to in instance of PosUISdk::Pivot.";
                        }
                        PosSdkBindingHelper_6.default.addDomNodeDisposalCallback(element, pivot);
                        var newValueAccessor = PosSdkPivotBindingHandler._getValueAccessor(pivot);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkPivotBindingHandler._getValueAccessor = function (pivot) {
                    var options = {
                        onselectionchanged: pivot.onSelectionChanged,
                        orientation: WinJS.UI.Orientation.horizontal,
                        headerItemsAxBubbleAttr: Commerce.StringExtensions.EMPTY
                    };
                    return function () { return options; };
                };
                return PosSdkPivotBindingHandler;
            }(Controls.Pivot.PivotBindingHandler));
            exports_7("default", PosSdkPivotBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkPivotItem", ["PosUISdk/Controls/Pivot", "BindingHandlers/PosSdkBindingHelper"], function (exports_8, context_8) {
    "use strict";
    var Pivot_2, PosSdkBindingHelper_7, Controls, PosSdkPivotItemBindingHandler;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (Pivot_2_1) {
                Pivot_2 = Pivot_2_1;
            },
            function (PosSdkBindingHelper_7_1) {
                PosSdkBindingHelper_7 = PosSdkBindingHelper_7_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkPivotItemBindingHandler = (function (_super) {
                __extends(PosSdkPivotItemBindingHandler, _super);
                function PosSdkPivotItemBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkPivotItemBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "PivotItem";
                    return PosSdkBindingHelper_7.default.initializeBinding(function () {
                        var pivotItem = valueAccessor();
                        if (!(pivotItem instanceof Pivot_2.PivotItem)) {
                            throw "PosSdkPivotItem invalid binding object. Must be bound to in instance of PosUISdk::PivotItem.";
                        }
                        PosSdkBindingHelper_7.default.addDomNodeDisposalCallback(element, pivotItem);
                        var newValueAccessor = PosSdkPivotItemBindingHandler._getValueAccessor(pivotItem);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkPivotItemBindingHandler._getValueAccessor = function (pivotItem) {
                    var options = {
                        header: pivotItem.header
                    };
                    return function () { return options; };
                };
                return PosSdkPivotItemBindingHandler;
            }(Controls.Pivot.PivotItemBindingHandler));
            exports_8("default", PosSdkPivotItemBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkTimePicker", ["PosUISdk/Controls/TimePicker", "BindingHandlers/PosSdkBindingHelper"], function (exports_9, context_9) {
    "use strict";
    var TimePicker_1, PosSdkBindingHelper_8, Controls, PosSdkTimePickerBindingHandler;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (TimePicker_1_1) {
                TimePicker_1 = TimePicker_1_1;
            },
            function (PosSdkBindingHelper_8_1) {
                PosSdkBindingHelper_8 = PosSdkBindingHelper_8_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkTimePickerBindingHandler = (function (_super) {
                __extends(PosSdkTimePickerBindingHandler, _super);
                function PosSdkTimePickerBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkTimePickerBindingHandler.prototype.init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "TimePicker";
                    return PosSdkBindingHelper_8.default.initializeBinding(function () {
                        var timePicker = valueAccessor();
                        if (!(timePicker instanceof TimePicker_1.TimePicker)) {
                            throw "PosSdkTimePicker invalid binding object. Must be bound to in instance of PosUISdk::TimePicker.";
                        }
                        PosSdkBindingHelper_8.default.addDomNodeDisposalCallback(element, timePicker);
                        var newValueAccessor = PosSdkTimePickerBindingHandler._getValueAccessor(timePicker);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkTimePickerBindingHandler._getValueAccessor = function (timePicker) {
                    var options = {
                        hourPattern: timePicker.hourPattern,
                        minutePattern: timePicker.minutePattern,
                        minuteIncrement: timePicker.minuteIncrement,
                        current: timePicker.current,
                        disabled: timePicker.disabled,
                        onChange: timePicker.onChange
                    };
                    return function () { return options; };
                };
                return PosSdkTimePickerBindingHandler;
            }(Controls.TimePicker.TimePickerBindingHandler));
            exports_9("default", PosSdkTimePickerBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkToggleSwitch", ["PosUISdk/Controls/ToggleSwitch", "BindingHandlers/PosSdkBindingHelper", "PosApi/TypeExtensions"], function (exports_10, context_10) {
    "use strict";
    var ToggleSwitch_1, PosSdkBindingHelper_9, Controls, TypeExtensions_1, PosSdkToggleSwitchBindingHandler;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (ToggleSwitch_1_1) {
                ToggleSwitch_1 = ToggleSwitch_1_1;
            },
            function (PosSdkBindingHelper_9_1) {
                PosSdkBindingHelper_9 = PosSdkBindingHelper_9_1;
            },
            function (TypeExtensions_1_1) {
                TypeExtensions_1 = TypeExtensions_1_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkToggleSwitchBindingHandler = (function (_super) {
                __extends(PosSdkToggleSwitchBindingHandler, _super);
                function PosSdkToggleSwitchBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkToggleSwitchBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "ToggleSwitch";
                    return PosSdkBindingHelper_9.default.initializeBinding(function () {
                        var toggleSwitch = valueAccessor();
                        if (!(toggleSwitch instanceof ToggleSwitch_1.ToggleSwitch)) {
                            throw "PosSdkToggleSwitch invalid binding object. Must be bound to in instance of PosUISdk::ToggleSwitch.";
                        }
                        PosSdkBindingHelper_9.default.addDomNodeDisposalCallback(element, toggleSwitch);
                        var newValueAccessor = PosSdkToggleSwitchBindingHandler._getValueAccessor(toggleSwitch);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkToggleSwitchBindingHandler._getValueAccessor = function (toggleSwitch) {
                    var options = {
                        labelOn: toggleSwitch.labelOn,
                        labelOff: toggleSwitch.labelOff,
                        onChange: toggleSwitch.onChange,
                        enabled: toggleSwitch.enabled,
                        checked: toggleSwitch.checked,
                        tabIndex: toggleSwitch.tabIndex,
                        title: TypeExtensions_1.StringExtensions.EMPTY
                    };
                    return function () { return options; };
                };
                return PosSdkToggleSwitchBindingHandler;
            }(Controls.ToggleSwitch.ToggleSwitchBindingHandler));
            exports_10("default", PosSdkToggleSwitchBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkMenuCommand", ["PosUISdk/Controls/Menu", "BindingHandlers/PosSdkBindingHelper"], function (exports_11, context_11) {
    "use strict";
    var Menu_1, PosSdkBindingHelper_10, Controls, PosSdkMenuCommandBindingHandler;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (Menu_1_1) {
                Menu_1 = Menu_1_1;
            },
            function (PosSdkBindingHelper_10_1) {
                PosSdkBindingHelper_10 = PosSdkBindingHelper_10_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkMenuCommandBindingHandler = (function (_super) {
                __extends(PosSdkMenuCommandBindingHandler, _super);
                function PosSdkMenuCommandBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkMenuCommandBindingHandler._getValueAccessor = function (menuCommand) {
                    var options = {
                        id: menuCommand.id,
                        label: menuCommand.label
                    };
                    if (Commerce.ObjectExtensions.isFunction(menuCommand.onClick)) {
                        options.onClick = function () {
                            menuCommand.onClick({ id: menuCommand.id });
                        };
                    }
                    return function () { return options; };
                };
                PosSdkMenuCommandBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "MenuCommand";
                    return PosSdkBindingHelper_10.default.initializeBinding(function () {
                        var posSdkMenuCommand = valueAccessor();
                        if (!(posSdkMenuCommand instanceof Menu_1.MenuCommand)) {
                            throw "PosSdkMenuCommand invalid binding object. Must be bound to an instance of PosUISdk/Controls/MenuCommand";
                        }
                        PosSdkBindingHelper_10.default.addDomNodeDisposalCallback(element, posSdkMenuCommand);
                        var newValueAccessor = PosSdkMenuCommandBindingHandler._getValueAccessor(posSdkMenuCommand);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                return PosSdkMenuCommandBindingHandler;
            }(Controls.Menu.MenuCommandBindingHandler));
            exports_11("default", PosSdkMenuCommandBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkMenu", ["PosUISdk/Controls/Menu", "BindingHandlers/PosSdkBindingHelper", "BindingHandlers/PosSdkMenuCommand"], function (exports_12, context_12) {
    "use strict";
    var Menu_2, PosSdkBindingHelper_11, PosSdkMenuCommand_1, Controls, PosSdkMenuBindingHandler;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (Menu_2_1) {
                Menu_2 = Menu_2_1;
            },
            function (PosSdkBindingHelper_11_1) {
                PosSdkBindingHelper_11 = PosSdkBindingHelper_11_1;
            },
            function (PosSdkMenuCommand_1_1) {
                PosSdkMenuCommand_1 = PosSdkMenuCommand_1_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkMenuBindingHandler = (function (_super) {
                __extends(PosSdkMenuBindingHandler, _super);
                function PosSdkMenuBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkMenuBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "Menu";
                    return PosSdkBindingHelper_11.default.initializeBinding(function () {
                        var posSdkMenu = valueAccessor();
                        if (!(posSdkMenu instanceof Menu_2.Menu)) {
                            throw "PosSdkMenu invalid binding object. Must be bound to an instance of PosUISdk.Controls.Menu.";
                        }
                        PosSdkBindingHelper_11.default.addDomNodeDisposalCallback(element, posSdkMenu);
                        var newValueAccessor = PosSdkMenuBindingHandler._getValueAccessor(posSdkMenu);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkMenuBindingHandler._getValueAccessor = function (menu) {
                    var options = {
                        anchor: "",
                        anchorElement: menu.anchorElement,
                        placement: menu.placement,
                        alignment: menu.alignment,
                        visible: menu.visible
                    };
                    if (Commerce.ArrayExtensions.hasElements(menu.commands)) {
                        options.commands = [];
                        menu.commands.forEach(function (value) {
                            options.commands.push(PosSdkMenuCommand_1.default._getValueAccessor(value)());
                        });
                    }
                    return function () { return options; };
                };
                return PosSdkMenuBindingHandler;
            }(Controls.Menu.MenuBindingHandler));
            exports_12("default", PosSdkMenuBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkDataList", ["PosUISdk/Controls/DataList", "BindingHandlers/PosSdkBindingHelper"], function (exports_13, context_13) {
    "use strict";
    var DataList_1, PosSdkBindingHelper_12, Controls, PosSdkDataListBindingHandler;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (DataList_1_1) {
                DataList_1 = DataList_1_1;
            },
            function (PosSdkBindingHelper_12_1) {
                PosSdkBindingHelper_12 = PosSdkBindingHelper_12_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkDataListBindingHandler = (function (_super) {
                __extends(PosSdkDataListBindingHandler, _super);
                function PosSdkDataListBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkDataListBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "DataList";
                    return PosSdkBindingHelper_12.default.initializeBinding(function () {
                        var dataList = valueAccessor();
                        if (!(dataList instanceof DataList_1.DataList)) {
                            throw "PosSdkDataList invalid binding object. Must be bound to in instance of PosUISdk::DataList";
                        }
                        PosSdkBindingHelper_12.default.addDomNodeDisposalCallback(element, dataList);
                        var newValueAccessor = PosSdkDataListBindingHandler._getValueAccessor(dataList, viewModel);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkDataListBindingHandler._getValueAccessor = function (dataList, viewModel) {
                    var internalIncrementalDataSource = undefined;
                    var publicIncrementalDataSource = dataList.itemDataSource;
                    if (Commerce.ObjectExtensions.isFunction(publicIncrementalDataSource.loadDataPage)) {
                        internalIncrementalDataSource = {
                            callerMethod: function (pageSize, skip) {
                                return Commerce.AsyncResult.fromPromise((publicIncrementalDataSource.loadDataPage(pageSize, skip)));
                            },
                            pageSize: publicIncrementalDataSource.pageSize
                        };
                    }
                    var options = {
                        columns: PosSdkDataListBindingHandler._getColumns(dataList.columns),
                        autoSelectFirstItem: dataList.autoSelectFirstItem,
                        selectInvokedItem: false,
                        defaultListType: Commerce.Controls.DataList.ListType.List,
                        emptyDataListTemplate: dataList.emptyDataListTemplateId,
                        itemDataSource: Commerce.ObjectExtensions.isNullOrUndefined(internalIncrementalDataSource) ? dataList.itemDataSource : undefined,
                        incrementalDataSource: !Commerce.ObjectExtensions.isNullOrUndefined(internalIncrementalDataSource) ? internalIncrementalDataSource : undefined,
                        itemInvoked: dataList.itemInvoked,
                        selectionModes: dataList.selectionMode,
                        selectionChanged: dataList.selectionChanged
                    };
                    return function () { return options; };
                };
                PosSdkDataListBindingHandler._getColumns = function (columns) {
                    var resultColumns;
                    if (Commerce.ArrayExtensions.hasElements(columns)) {
                        resultColumns = columns.map(function (value) {
                            return {
                                collapseOrder: value.collapseOrder,
                                computeValue: value.computeValue,
                                isRightAligned: value.isRightAligned,
                                minWidth: value.minWidth,
                                ratio: value.ratio,
                                title: value.title
                            };
                        });
                    }
                    return resultColumns;
                };
                return PosSdkDataListBindingHandler;
            }(Controls.DataList.DataListBindingHandler));
            exports_13("default", PosSdkDataListBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkToggleMenuCommand", ["PosUISdk/Controls/Menu", "BindingHandlers/PosSdkBindingHelper"], function (exports_14, context_14) {
    "use strict";
    var Menu_3, PosSdkBindingHelper_13, Controls, PosSdkToggleMenuCommandBindingHandler;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [
            function (Menu_3_1) {
                Menu_3 = Menu_3_1;
            },
            function (PosSdkBindingHelper_13_1) {
                PosSdkBindingHelper_13 = PosSdkBindingHelper_13_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkToggleMenuCommandBindingHandler = (function (_super) {
                __extends(PosSdkToggleMenuCommandBindingHandler, _super);
                function PosSdkToggleMenuCommandBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkToggleMenuCommandBindingHandler._getValueAccessor = function (menuCommand) {
                    var options = {
                        id: menuCommand.id,
                        label: menuCommand.label,
                        selected: menuCommand.selected,
                        type: "toggle"
                    };
                    if (Commerce.ObjectExtensions.isFunction(menuCommand.onClick)) {
                        options.onClick = function (args) {
                            menuCommand.onClick({
                                id: menuCommand.id,
                                selected: true
                            });
                        };
                    }
                    return function () { return options; };
                };
                PosSdkToggleMenuCommandBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "ToggleMenuCommand";
                    return PosSdkBindingHelper_13.default.initializeBinding(function () {
                        var posSdkMenuCommand = valueAccessor();
                        if (!(posSdkMenuCommand instanceof Menu_3.ToggleMenuCommand)) {
                            throw "PosSdkMenuCommand invalid binding object. Must be bound to an instance of PosUISdk/Controls/MenuCommand";
                        }
                        PosSdkBindingHelper_13.default.addDomNodeDisposalCallback(element, posSdkMenuCommand);
                        var newValueAccessor = PosSdkToggleMenuCommandBindingHandler._getValueAccessor(posSdkMenuCommand);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                return PosSdkToggleMenuCommandBindingHandler;
            }(Controls.Menu.ToggleMenuCommandBindingHandler));
            exports_14("default", PosSdkToggleMenuCommandBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkToggleMenu", ["PosUISdk/Controls/Menu", "BindingHandlers/PosSdkBindingHelper", "BindingHandlers/PosSdkToggleMenuCommand"], function (exports_15, context_15) {
    "use strict";
    var Menu_4, PosSdkBindingHelper_14, PosSdkToggleMenuCommand_1, Controls, PosSdkToggleMenuBindingHandler;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (Menu_4_1) {
                Menu_4 = Menu_4_1;
            },
            function (PosSdkBindingHelper_14_1) {
                PosSdkBindingHelper_14 = PosSdkBindingHelper_14_1;
            },
            function (PosSdkToggleMenuCommand_1_1) {
                PosSdkToggleMenuCommand_1 = PosSdkToggleMenuCommand_1_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkToggleMenuBindingHandler = (function (_super) {
                __extends(PosSdkToggleMenuBindingHandler, _super);
                function PosSdkToggleMenuBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkToggleMenuBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "ToggleMenu";
                    return PosSdkBindingHelper_14.default.initializeBinding(function () {
                        var posSdkMenu = valueAccessor();
                        if (!(posSdkMenu instanceof Menu_4.ToggleMenu)) {
                            throw "PosSdkToggleMenu invalid binding object. Must be bound to an instance of PosUISdk.Controls.Menu.";
                        }
                        PosSdkBindingHelper_14.default.addDomNodeDisposalCallback(element, posSdkMenu);
                        var newValueAccessor = PosSdkToggleMenuBindingHandler._getValueAccessor(posSdkMenu);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkToggleMenuBindingHandler._getValueAccessor = function (menu) {
                    var options = {
                        anchor: "",
                        anchorElement: menu.anchorElement,
                        visible: menu.visible,
                        placement: menu.placement,
                        alignment: menu.alignment
                    };
                    if (Commerce.ArrayExtensions.hasElements(menu.commands)) {
                        options.commands = [];
                        menu.commands.forEach(function (value) {
                            options.commands.push(PosSdkToggleMenuCommand_1.default._getValueAccessor(value)());
                        });
                    }
                    return function () { return options; };
                };
                return PosSdkToggleMenuBindingHandler;
            }(Controls.Menu.ToggleMenuBindingHandler));
            exports_15("default", PosSdkToggleMenuBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkAlphanumericNumPad", ["PosUISdk/Controls/NumPad", "BindingHandlers/PosSdkBindingHelper"], function (exports_16, context_16) {
    "use strict";
    var NumPad_1, PosSdkBindingHelper_15, Controls, PosSdkAlphanumericNumPadBindingHandler;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (NumPad_1_1) {
                NumPad_1 = NumPad_1_1;
            },
            function (PosSdkBindingHelper_15_1) {
                PosSdkBindingHelper_15 = PosSdkBindingHelper_15_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkAlphanumericNumPadBindingHandler = (function (_super) {
                __extends(PosSdkAlphanumericNumPadBindingHandler, _super);
                function PosSdkAlphanumericNumPadBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkAlphanumericNumPadBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "AlphanumericNumberPad";
                    return PosSdkBindingHelper_15.default.initializeBinding(function () {
                        var numPad = valueAccessor();
                        if (!(numPad instanceof NumPad_1.AlphanumericNumPad)) {
                            throw "PosSdkAlphanumericNumPad invalid binding object. Must be bound to in instance of PosUISdk::AlphanumericNumPad.";
                        }
                        PosSdkBindingHelper_15.default.addDomNodeDisposalCallback(element, numPad);
                        var newValueAccessor = PosSdkAlphanumericNumPadBindingHandler._getValueAccessor(numPad);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkAlphanumericNumPadBindingHandler._getValueAccessor = function (numPad) {
                    var options = {
                        labelDataBinding: { text: numPad.label },
                        inputDataBinding: undefined,
                        onEnter: numPad.onEnter,
                        value: numPad.value,
                        decimalPrecision: numPad.decimalPrecision,
                        numPadInputSource: numPad.numPadInputSource
                    };
                    return function () { return options; };
                };
                return PosSdkAlphanumericNumPadBindingHandler;
            }(Controls.NumPad.AlphanumericNumPadBindingHandler));
            exports_16("default", PosSdkAlphanumericNumPadBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkCurrencyNumPad", ["PosUISdk/Controls/NumPad", "BindingHandlers/PosSdkBindingHelper"], function (exports_17, context_17) {
    "use strict";
    var NumPad_2, PosSdkBindingHelper_16, Controls, PosSdkCurrencyNumPadBindingHandler;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (NumPad_2_1) {
                NumPad_2 = NumPad_2_1;
            },
            function (PosSdkBindingHelper_16_1) {
                PosSdkBindingHelper_16 = PosSdkBindingHelper_16_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkCurrencyNumPadBindingHandler = (function (_super) {
                __extends(PosSdkCurrencyNumPadBindingHandler, _super);
                function PosSdkCurrencyNumPadBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkCurrencyNumPadBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "CurrencyNumberPad";
                    return PosSdkBindingHelper_16.default.initializeBinding(function () {
                        var numPad = valueAccessor();
                        if (!(numPad instanceof NumPad_2.CurrencyNumPad)) {
                            throw "PosSdkCurrencyNumPad invalid binding object. Must be bound to in instance of PosUISdk::CurrencyNumPad.";
                        }
                        PosSdkBindingHelper_16.default.addDomNodeDisposalCallback(element, numPad);
                        var newValueAccessor = PosSdkCurrencyNumPadBindingHandler._getValueAccessor(numPad);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkCurrencyNumPadBindingHandler._getValueAccessor = function (numPad) {
                    var options = {
                        labelDataBinding: { text: numPad.label },
                        inputDataBinding: undefined,
                        onEnter: numPad.onEnter,
                        value: numPad.value,
                        decimalPrecision: numPad.decimalPrecision,
                        numPadInputSource: numPad.numPadInputSource
                    };
                    return function () { return options; };
                };
                return PosSdkCurrencyNumPadBindingHandler;
            }(Controls.NumPad.CurrencyNumPadBindingHandler));
            exports_17("default", PosSdkCurrencyNumPadBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkNumericNumPad", ["PosUISdk/Controls/NumPad", "BindingHandlers/PosSdkBindingHelper"], function (exports_18, context_18) {
    "use strict";
    var NumPad_3, PosSdkBindingHelper_17, Controls, PosSdkNumericNumPadBindingHandler;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (NumPad_3_1) {
                NumPad_3 = NumPad_3_1;
            },
            function (PosSdkBindingHelper_17_1) {
                PosSdkBindingHelper_17 = PosSdkBindingHelper_17_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkNumericNumPadBindingHandler = (function (_super) {
                __extends(PosSdkNumericNumPadBindingHandler, _super);
                function PosSdkNumericNumPadBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkNumericNumPadBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "NumericNumberPad";
                    return PosSdkBindingHelper_17.default.initializeBinding(function () {
                        var numPad = valueAccessor();
                        if (!(numPad instanceof NumPad_3.NumericNumPad)) {
                            throw "PosSdkNumericNumPad invalid binding object. Must be bound to in instance of PosUISdk::NumericNumPad.";
                        }
                        PosSdkBindingHelper_17.default.addDomNodeDisposalCallback(element, numPad);
                        var newValueAccessor = PosSdkNumericNumPadBindingHandler._getValueAccessor(numPad);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkNumericNumPadBindingHandler._getValueAccessor = function (numPad) {
                    var options = {
                        labelDataBinding: { text: numPad.label },
                        inputDataBinding: undefined,
                        onEnter: numPad.onEnter,
                        value: numPad.value,
                        decimalPrecision: numPad.decimalPrecision,
                        numPadInputSource: numPad.numPadInputSource
                    };
                    return function () { return options; };
                };
                return PosSdkNumericNumPadBindingHandler;
            }(Controls.NumPad.NumericNumPadBindingHandler));
            exports_18("default", PosSdkNumericNumPadBindingHandler);
        }
    };
});
System.register("BindingHandlers/PosSdkTransactionNumPad", ["PosUISdk/Controls/NumPad", "BindingHandlers/PosSdkBindingHelper"], function (exports_19, context_19) {
    "use strict";
    var NumPad_4, PosSdkBindingHelper_18, Controls, PosSdkTransactionNumPadBindingHandler;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (NumPad_4_1) {
                NumPad_4 = NumPad_4_1;
            },
            function (PosSdkBindingHelper_18_1) {
                PosSdkBindingHelper_18 = PosSdkBindingHelper_18_1;
            }
        ],
        execute: function () {
            Controls = Commerce.Controls;
            PosSdkTransactionNumPadBindingHandler = (function (_super) {
                __extends(PosSdkTransactionNumPadBindingHandler, _super);
                function PosSdkTransactionNumPadBindingHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PosSdkTransactionNumPadBindingHandler.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var _this = this;
                    var correlationId = Commerce.LoggerHelper.getNewCorrelationId();
                    var controlName = "TransactionNumPad";
                    return PosSdkBindingHelper_18.default.initializeBinding(function () {
                        var numPad = valueAccessor();
                        if (!(numPad instanceof NumPad_4.TransactionNumPad)) {
                            throw "PosSdkTransactionNumPad invalid binding object. Must be bound to in instance of PosUISdk::TransactionNumPad.";
                        }
                        PosSdkBindingHelper_18.default.addDomNodeDisposalCallback(element, numPad);
                        var newValueAccessor = PosSdkTransactionNumPadBindingHandler._getValueAccessor(numPad);
                        return _super.prototype.init.call(_this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }, controlName, correlationId);
                };
                PosSdkTransactionNumPadBindingHandler._getValueAccessor = function (numPad) {
                    var options = {
                        labelDataBinding: { text: numPad.label },
                        inputDataBinding: undefined,
                        onEnter: numPad.onEnter,
                        value: numPad.value,
                        decimalPrecision: numPad.decimalPrecision,
                        viewName: undefined,
                        containerId: undefined,
                        placeholder: undefined,
                        numPadInputSource: numPad.numPadInputSource
                    };
                    return function () { return options; };
                };
                return PosSdkTransactionNumPadBindingHandler;
            }(Controls.NumPad.TransactionNumPadBindingHandler));
            exports_19("default", PosSdkTransactionNumPadBindingHandler);
        }
    };
});
System.register("UISdkLoader", ["BindingHandlers/PosSdkAppBar", "BindingHandlers/PosSdkAppBarCommand", "BindingHandlers/PosSdkDatePicker", "BindingHandlers/PosSdkHeaderSplitView", "BindingHandlers/PosSdkLoader", "BindingHandlers/PosSdkPivot", "BindingHandlers/PosSdkPivotItem", "BindingHandlers/PosSdkTimePicker", "BindingHandlers/PosSdkToggleSwitch", "BindingHandlers/PosSdkMenu", "BindingHandlers/PosSdkMenuCommand", "BindingHandlers/PosSdkDataList", "BindingHandlers/PosSdkToggleMenu", "BindingHandlers/PosSdkToggleMenuCommand", "BindingHandlers/PosSdkAlphanumericNumPad", "BindingHandlers/PosSdkCurrencyNumPad", "BindingHandlers/PosSdkNumericNumPad", "BindingHandlers/PosSdkTransactionNumPad"], function (exports_20, context_20) {
    "use strict";
    var PosSdkAppBar_1, PosSdkAppBarCommand_1, PosSdkDatePicker_1, PosSdkHeaderSplitView_1, PosSdkLoader_1, PosSdkPivot_1, PosSdkPivotItem_1, PosSdkTimePicker_1, PosSdkToggleSwitch_1, PosSdkMenu_1, PosSdkMenuCommand_2, PosSdkDataList_1, PosSdkToggleMenu_1, PosSdkToggleMenuCommand_2, PosSdkAlphanumericNumPad_1, PosSdkCurrencyNumPad_1, PosSdkNumericNumPad_1, PosSdkTransactionNumPad_1, UISdkLoader;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [
            function (PosSdkAppBar_1_1) {
                PosSdkAppBar_1 = PosSdkAppBar_1_1;
            },
            function (PosSdkAppBarCommand_1_1) {
                PosSdkAppBarCommand_1 = PosSdkAppBarCommand_1_1;
            },
            function (PosSdkDatePicker_1_1) {
                PosSdkDatePicker_1 = PosSdkDatePicker_1_1;
            },
            function (PosSdkHeaderSplitView_1_1) {
                PosSdkHeaderSplitView_1 = PosSdkHeaderSplitView_1_1;
            },
            function (PosSdkLoader_1_1) {
                PosSdkLoader_1 = PosSdkLoader_1_1;
            },
            function (PosSdkPivot_1_1) {
                PosSdkPivot_1 = PosSdkPivot_1_1;
            },
            function (PosSdkPivotItem_1_1) {
                PosSdkPivotItem_1 = PosSdkPivotItem_1_1;
            },
            function (PosSdkTimePicker_1_1) {
                PosSdkTimePicker_1 = PosSdkTimePicker_1_1;
            },
            function (PosSdkToggleSwitch_1_1) {
                PosSdkToggleSwitch_1 = PosSdkToggleSwitch_1_1;
            },
            function (PosSdkMenu_1_1) {
                PosSdkMenu_1 = PosSdkMenu_1_1;
            },
            function (PosSdkMenuCommand_2_1) {
                PosSdkMenuCommand_2 = PosSdkMenuCommand_2_1;
            },
            function (PosSdkDataList_1_1) {
                PosSdkDataList_1 = PosSdkDataList_1_1;
            },
            function (PosSdkToggleMenu_1_1) {
                PosSdkToggleMenu_1 = PosSdkToggleMenu_1_1;
            },
            function (PosSdkToggleMenuCommand_2_1) {
                PosSdkToggleMenuCommand_2 = PosSdkToggleMenuCommand_2_1;
            },
            function (PosSdkAlphanumericNumPad_1_1) {
                PosSdkAlphanumericNumPad_1 = PosSdkAlphanumericNumPad_1_1;
            },
            function (PosSdkCurrencyNumPad_1_1) {
                PosSdkCurrencyNumPad_1 = PosSdkCurrencyNumPad_1_1;
            },
            function (PosSdkNumericNumPad_1_1) {
                PosSdkNumericNumPad_1 = PosSdkNumericNumPad_1_1;
            },
            function (PosSdkTransactionNumPad_1_1) {
                PosSdkTransactionNumPad_1 = PosSdkTransactionNumPad_1_1;
            }
        ],
        execute: function () {
            UISdkLoader = (function () {
                function UISdkLoader() {
                }
                UISdkLoader.initialize = function () {
                    if (UISdkLoader._isInitialized) {
                        return;
                    }
                    var BINDING_HANDLERS_BY_NAME = {
                        msPosAlphanumericNumPad: PosSdkAlphanumericNumPad_1.default,
                        msPosAppBar: PosSdkAppBar_1.default,
                        msPosAppBarCommand: PosSdkAppBarCommand_1.default,
                        msPosCurrencyNumPad: PosSdkCurrencyNumPad_1.default,
                        msPosDatePicker: PosSdkDatePicker_1.default,
                        msPosHeaderSplitView: PosSdkHeaderSplitView_1.default,
                        msPosLoader: PosSdkLoader_1.default,
                        msPosPivot: PosSdkPivot_1.default,
                        msPosPivotItem: PosSdkPivotItem_1.default,
                        msPosMenu: PosSdkMenu_1.default,
                        msPosMenuCommand: PosSdkMenuCommand_2.default,
                        msPosNumericNumPad: PosSdkNumericNumPad_1.default,
                        msPosTimePicker: PosSdkTimePicker_1.default,
                        msPosToggleSwitch: PosSdkToggleSwitch_1.default,
                        msPosDataList: PosSdkDataList_1.default,
                        msPosToggleMenu: PosSdkToggleMenu_1.default,
                        msPosToggleMenuCommand: PosSdkToggleMenuCommand_2.default,
                        msPosTransactionNumPad: PosSdkTransactionNumPad_1.default
                    };
                    Object.keys(BINDING_HANDLERS_BY_NAME).forEach(function (bindingHandlerName) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(ko.bindingHandlers[bindingHandlerName])) {
                            throw "UISdkLoader::initialize knockout binding with name " + bindingHandlerName + " already exists.";
                        }
                        var bindingHandlerType = BINDING_HANDLERS_BY_NAME[bindingHandlerName];
                        if (Commerce.ObjectExtensions.isFunction(bindingHandlerType)) {
                            ko.bindingHandlers[bindingHandlerName] = new bindingHandlerType();
                        }
                    });
                    UISdkLoader._isInitialized = true;
                };
                UISdkLoader._isInitialized = false;
                return UISdkLoader;
            }());
            exports_20("default", UISdkLoader);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIj/wYJKoZIhvcNAQcCoIIj8DCCI+wCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // vnAwLAovRH9PLVqZsk7lg4hk9w+Cv0+u+IiEUd2OMcSg
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
// SIG // ghXSMIIVzgIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABiK9S1rmSbej5AAAAAAGIMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBJzAZBgkqhkiG9w0BCQMxDAYK
// SIG // KwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYKKwYB
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgi3YHhsg7OrBf
// SIG // 7nFtWf2NGEexNT+VTWecPbotnihqLAAwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // Rou1QEsQUjEC2E5mVfjGyxz6KPZ/Sgf0S97COZ2FPzof
// SIG // R0cDV54c0GR1Fe+AZfaRO++TBJ9CDLzx4oHNRyp1JGbA
// SIG // NCe8bhRCDsGGEwXVH1LrnipJbdG0F5beGEadYfSUGVS9
// SIG // 3cZo3jrhLd4FYATRoZK1u/l6WI4yzw03RtqENNy414dy
// SIG // O9Ss5P4gCKO5uUhByR80PFX3NFGWKADGRp/C4cAcl+j0
// SIG // g2x5RBEtMYyBuRIxjIiWhi8pqMKPnfcJDbEFCkR8u1yH
// SIG // /rc9Dtd6wi8vbAX2GPMdUOpws/HPtrX9m8tLqHWWHYeW
// SIG // C+HOXzJN7bwCs3T14SvB3+cYE8N3V4D8hKGCEuIwghLe
// SIG // BgorBgEEAYI3AwMBMYISzjCCEsoGCSqGSIb3DQEHAqCC
// SIG // ErswghK3AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCBcqSVrHXdflLRC
// SIG // FSdiJrNl5fPohctBLyFESDxa6/1bKgIGXz0tswFuGBMy
// SIG // MDIwMDgyMzA0MDI0Ni44NDZaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjoxNzlFLTRCQjAtODI0NjEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjkwggTxMIID2aADAgECAhMzAAABDKp4btzM
// SIG // QkzBAAAAAAEMMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTkx
// SIG // NloXDTIxMDEyMTIzMTkxNlowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOjE3OUUtNEJCMC04MjQ2MSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq5011+XqVJmQ
// SIG // Ktiw39igeEMvCLcZ1forbmxsDkpnCN1SrThKI+n2Pr3z
// SIG // qTzJVgdJFCoKm1ks1gtRJ7HaL6tDkrOw8XJmfJaxyQAl
// SIG // uCQ+e40NI+A4w+u59Gy89AVY5lJNrmCva6gozfg1kxw6
// SIG // abV5WWr+PjEpNCshO4hxv3UqgMcCKnT2YVSZzF1Gy7AP
// SIG // ub1fY0P1vNEuOFKrNCEEvWIKRrqseyBB73G8KD2yw6jf
// SIG // z0VKxNSRAdhJV/ghOyrDt5a+L6C3m1rpr8sqiof3iohv
// SIG // 3ANIgNqw6ex+4+G+B7JMbIHbGpPdebedL6ePbuBCnbgJ
// SIG // oDn340k0aw6ij21GvvUnkQIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFAlCOq9DDIa0A0oqgKtM5vjuZeK+MB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBAET3
// SIG // xBg/IZ9zdOfwbDGK7cK3qKYt/qUOlbRBzgeNjb32K86n
// SIG // GeRGkBee10dVOEGWUw6KtBeWh1LQ70b64/tLtiLcsf9J
// SIG // zaAyDYb1sRmMi5fjRZ753TquaT8V7NJ7RfEuYfvZlubf
// SIG // QD0MVbU4tzsdZdYuxE37V2J9pN89j7GoFNtAnSnCn1MR
// SIG // xENAILgt9XzeQzTEDhFYW0N2DNphTkRPXGjpDmwi6Wtk
// SIG // J5fv0iTyB4dwEC+/ed0lGbFLcytJoMwfTNMdH6gcnHlM
// SIG // zsniornGFZa5PPiV78XoZ9FeupKo8ZKNGhLLLB5GTtqf
// SIG // Hex5no3ioVSq+NthvhX0I/V+iXJsopowggZxMIIEWaAD
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
// SIG // oFA12u8JJxzVs341Hgi62jbb01+P3nSISRKhggLLMIIC
// SIG // NAIBATCB+KGB0KSBzTCByjELMAkGA1UEBhMCVVMxCzAJ
// SIG // BgNVBAgTAldBMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
// SIG // BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMg
// SIG // TGltaXRlZDEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // MTc5RS00QkIwLTgyNDYxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVAMsg9FQ9pgPLXI2Ld5z7xDS0QAZ9oIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi7ElWMCIYDzIwMjAwODIzMDk0ODA2
// SIG // WhgPMjAyMDA4MjQwOTQ4MDZaMHQwOgYKKwYBBAGEWQoE
// SIG // ATEsMCowCgIFAOLsSVYCAQAwBwIBAAICDrIwBwIBAAIC
// SIG // EY8wCgIFAOLtmtYCAQAwNgYKKwYBBAGEWQoEAjEoMCYw
// SIG // DAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgCAQAC
// SIG // AwGGoDANBgkqhkiG9w0BAQUFAAOBgQBDko+QN2FFF7ek
// SIG // i/iKejlEYBcjxL6JaCuYNwzuNO1/+1FH4Cr6gRf4cP5P
// SIG // PQjc6h5N73RsCoyQ+WQwFVaYqcD2kS3T2tkF+L4yqK8C
// SIG // A+NRUi8NeRXEHOUvCkEuPhbulZ6IOT6vgDRklGdv7alW
// SIG // 7frycK2QfqjF4LduVu08UfYcbjGCAw0wggMJAgEBMIGT
// SIG // MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAAB
// SIG // DKp4btzMQkzBAAAAAAEMMA0GCWCGSAFlAwQCAQUAoIIB
// SIG // SjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQwLwYJ
// SIG // KoZIhvcNAQkEMSIEIMcIWUDAztt5ll4ijsFVMcW6yBiL
// SIG // T2qFR6nxfq/rsbo6MIH6BgsqhkiG9w0BCRACLzGB6jCB
// SIG // 5zCB5DCBvQQgg5AWKX7M1+m2//+V7qmRvt1K/ww5Muu8
// SIG // XzGJBqygVCkwgZgwgYCkfjB8MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EgMjAxMAITMwAAAQyqeG7czEJMwQAAAAABDDAi
// SIG // BCBdwZuvEpytOELJD2tkM89ON3hjSXQdWx4W6FxjiBrD
// SIG // NDANBgkqhkiG9w0BAQsFAASCAQCEP/Mfv7Dajqchbsq3
// SIG // 0T6IaDt40f6Z2xnvo73TtYMU7UNhmu+wX6MR2GT3OpFe
// SIG // ffwKnaDdWbqGlODLc73UwQWdaNn+lbiu+/PWpzUU/P23
// SIG // i1ZGbYSexfksnvOavJ70gKh5W3ioWPsXGDWqnxp/3CDq
// SIG // rRcav+0ETNtZYf/b+KaUiV19UADJc+FNAAUwyv4VTI6G
// SIG // pt1kdVhJOUWYl43ghXCF4ruZZQdhSlWGcd1n9hrh3uP6
// SIG // k+rPezq029bKSUrLxeo3Dwkd+GcrplEI2vinXEK/vsQu
// SIG // rCmYsCJYhEMRKgThPKbU8dBkdSh0Tc4YM9nfjOOmEdaP
// SIG // Mh4S6QEnp/Vb72vr
// SIG // End signature block
