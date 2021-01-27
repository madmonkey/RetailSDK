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
System.register("PosUISdk/Controls/PosControl", [], function (exports_1, context_1) {
    "use strict";
    var PosControl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            PosControl = /** @class */ (function () {
                function PosControl() {
                }
                PosControl.prototype.dispose = function () {
                    Commerce.ObjectExtensions.disposeAllProperties(this);
                };
                PosControl.prototype.getObservable = function (value, defaultValue) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(value)) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(defaultValue)) {
                            return undefined;
                        }
                        return ko.observable(defaultValue);
                    }
                    else if (ko.isObservable(value)) {
                        return value;
                    }
                    else {
                        return ko.observable(value);
                    }
                };
                return PosControl;
            }());
            exports_1("PosControl", PosControl);
        }
    };
});
System.register("PosUISdk/Controls/AppBar", ["PosUISdk/Controls/PosControl"], function (exports_2, context_2) {
    "use strict";
    var PosControl_1, AppBar, AppBarCommand;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (PosControl_1_1) {
                PosControl_1 = PosControl_1_1;
            }
        ],
        execute: function () {
            AppBar = /** @class */ (function (_super) {
                __extends(AppBar, _super);
                function AppBar() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return AppBar;
            }(PosControl_1.PosControl));
            exports_2("AppBar", AppBar);
            AppBarCommand = /** @class */ (function (_super) {
                __extends(AppBarCommand, _super);
                function AppBarCommand(initialState) {
                    var _this = _super.call(this) || this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(AppBarCommand.CONTROL_NAME, "Invalid state provided to the AppBarCommand constructor: The initialState cannot be null or undefined.");
                    }
                    else if (Commerce.StringExtensions.isNullOrWhitespace(initialState.id)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(AppBarCommand.CONTROL_NAME, "Invalid state provided to the AppBarCommand constructor: The initialState must contain a valid id.");
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(initialState.label)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(AppBarCommand.CONTROL_NAME, "Invalid state provided to the AppBarCommand constructor: The initialState must contain a valid label.");
                    }
                    else if (!Commerce.ObjectExtensions.isFunction(initialState.execute)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(AppBarCommand.CONTROL_NAME, "Invalid state provided to the AppBarCommand constructor: The initialState must contain a valid execute method.");
                    }
                    _this.enabled = _this.getObservable(initialState.enabled, true);
                    _this.visible = _this.getObservable(initialState.visible, true);
                    _this.label = _this.getObservable(initialState.label);
                    _this.id = initialState.id;
                    _this.extraClass = initialState.extraClass;
                    _this.flyoutSelector = initialState.flyoutSelector;
                    _this._execute = initialState.execute;
                    return _this;
                }
                AppBarCommand.prototype.execute = function () {
                    if (Commerce.ObjectExtensions.isFunction(this._execute)) {
                        this._execute();
                    }
                };
                AppBarCommand.CONTROL_NAME = "AppBarCommand";
                return AppBarCommand;
            }(PosControl_1.PosControl));
            exports_2("AppBarCommand", AppBarCommand);
        }
    };
});
System.register("PosUISdk/Controls/DataList", ["PosUISdk/Controls/PosControl"], function (exports_3, context_3) {
    "use strict";
    var PosControl_2, SelectionMode, DataList;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (PosControl_2_1) {
                PosControl_2 = PosControl_2_1;
            }
        ],
        execute: function () {
            (function (SelectionMode) {
                SelectionMode[SelectionMode["None"] = 0] = "None";
                SelectionMode[SelectionMode["NoneOrSingle"] = 1] = "NoneOrSingle";
                SelectionMode[SelectionMode["NoneOrMulti"] = 2] = "NoneOrMulti";
                SelectionMode[SelectionMode["InvokeOnly"] = 3] = "InvokeOnly";
                SelectionMode[SelectionMode["InvokeOrSingle"] = 4] = "InvokeOrSingle";
                SelectionMode[SelectionMode["InvokeOrMulti"] = 5] = "InvokeOrMulti";
                SelectionMode[SelectionMode["SingleSelect"] = 6] = "SingleSelect";
                SelectionMode[SelectionMode["MultiSelect"] = 7] = "MultiSelect"; // Multi selection
            })(SelectionMode || (SelectionMode = {}));
            exports_3("SelectionMode", SelectionMode);
            DataList = /** @class */ (function (_super) {
                __extends(DataList, _super);
                function DataList(initialState) {
                    var _this = _super.call(this) || this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(DataList.CONTROL_NAME, "Invalid state provided to the DataList constructor: The initialState cannot be null or undefined.");
                    }
                    _this.autoSelectFirstItem = Commerce.ObjectExtensions.isNullOrUndefined(initialState.autoSelectFirstItem) ? false : initialState.autoSelectFirstItem;
                    _this.columns = initialState.columns;
                    _this.emptyDataListTemplateId = initialState.emptyDataListTemplateId;
                    _this.itemDataSource = initialState.itemDataSource;
                    _this.selectionMode = Commerce.ObjectExtensions.isNullOrUndefined(initialState.selectionMode) ? SelectionMode.None : initialState.selectionMode;
                    if (Commerce.ObjectExtensions.isFunction(initialState.itemInvoked)) {
                        _this.itemInvoked = initialState.itemInvoked;
                    }
                    if (Commerce.ObjectExtensions.isFunction(initialState.selectionChanged)) {
                        _this.selectionChanged = initialState.selectionChanged;
                    }
                    return _this;
                }
                DataList.CONTROL_NAME = "DataList";
                return DataList;
            }(PosControl_2.PosControl));
            exports_3("DataList", DataList);
        }
    };
});
System.register("PosUISdk/Controls/DatePicker", ["PosUISdk/Controls/PosControl"], function (exports_4, context_4) {
    "use strict";
    var PosControl_3, DatePicker;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (PosControl_3_1) {
                PosControl_3 = PosControl_3_1;
            }
        ],
        execute: function () {
            DatePicker = /** @class */ (function (_super) {
                __extends(DatePicker, _super);
                function DatePicker(initialState) {
                    var _this = _super.call(this) || this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(DatePicker.CONTROL_NAME, "Invalid state provided to the " + DatePicker.CONTROL_NAME + " constructor: The initialState cannot be null or undefined.");
                    }
                    if (!Commerce.ObjectExtensions.isFunction(initialState.onChange)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(DatePicker.CONTROL_NAME, "Invalid state provided to the " + DatePicker.CONTROL_NAME + " constructor: The initialState.onChange callback must be set to a function.");
                    }
                    _this.datePattern = initialState.datePattern;
                    _this.current = initialState.initialValue;
                    _this.disabled = initialState.disabled;
                    _this.onChange = initialState.onChange;
                    return _this;
                }
                DatePicker.CONTROL_NAME = "DatePicker";
                return DatePicker;
            }(PosControl_3.PosControl));
            exports_4("DatePicker", DatePicker);
        }
    };
});
System.register("PosUISdk/Controls/HeaderSplitView", ["PosUISdk/Controls/PosControl"], function (exports_5, context_5) {
    "use strict";
    var PosControl_4, HeaderSplitView;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (PosControl_4_1) {
                PosControl_4 = PosControl_4_1;
            }
        ],
        execute: function () {
            HeaderSplitView = /** @class */ (function (_super) {
                __extends(HeaderSplitView, _super);
                function HeaderSplitView(initialState) {
                    var _this = _super.call(this) || this;
                    _this.title = _this.getObservable(initialState.title);
                    return _this;
                }
                return HeaderSplitView;
            }(PosControl_4.PosControl));
            exports_5("HeaderSplitView", HeaderSplitView);
        }
    };
});
System.register("PosUISdk/Controls/Loader", ["PosUISdk/Controls/PosControl"], function (exports_6, context_6) {
    "use strict";
    var PosControl_5, Loader;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (PosControl_5_1) {
                PosControl_5 = PosControl_5_1;
            }
        ],
        execute: function () {
            Loader = /** @class */ (function (_super) {
                __extends(Loader, _super);
                function Loader(initialState) {
                    var _this = _super.call(this) || this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(Loader.CONTROL_NAME, "Invalid state provided to the Loader constructor: The initialState cannot be null or undefined.");
                    }
                    _this.visible = initialState.visible;
                    return _this;
                }
                Loader.CONTROL_NAME = "Loader";
                return Loader;
            }(PosControl_5.PosControl));
            exports_6("Loader", Loader);
        }
    };
});
System.register("PosUISdk/Controls/Menu", ["PosUISdk/Controls/PosControl"], function (exports_7, context_7) {
    "use strict";
    var PosControl_6, GenericMenuState, Menu, MenuCommand, ToggleMenu, ToggleMenuCommand;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (PosControl_6_1) {
                PosControl_6 = PosControl_6_1;
            }
        ],
        execute: function () {
            GenericMenuState = /** @class */ (function (_super) {
                __extends(GenericMenuState, _super);
                function GenericMenuState(initialState) {
                    var _this = _super.call(this) || this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(GenericMenuState.CONTROL_NAME, "Invalid state provided to the Menu constructor: The initialState cannot be null or undefined.");
                    }
                    _this.anchorElement = ko.observable(null);
                    _this.visible = ko.observable(false);
                    _this.placement = initialState.placement;
                    _this.alignment = initialState.alignment;
                    _this.commands = initialState.commands;
                    return _this;
                }
                /**
                 * Show menu using anchor element.
                 * @param {HTMLElement} anchorElement The anchor element.
                 */
                GenericMenuState.prototype.show = function (anchorElement) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(anchorElement)) {
                        throw new Error("Invalid options passed to the Menu 'show' method: anchorElement cannot be null or undefined.");
                    }
                    this.anchorElement(anchorElement);
                    this.visible(true);
                };
                GenericMenuState.CONTROL_NAME = "Menu";
                return GenericMenuState;
            }(PosControl_6.PosControl));
            exports_7("GenericMenuState", GenericMenuState);
            Menu = /** @class */ (function (_super) {
                __extends(Menu, _super);
                function Menu() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Menu;
            }(GenericMenuState));
            exports_7("Menu", Menu);
            MenuCommand = /** @class */ (function (_super) {
                __extends(MenuCommand, _super);
                function MenuCommand(initialState) {
                    var _this = _super.call(this) || this;
                    _this.BASE_CONTROL_NAME = "MenuCommand";
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(_this.BASE_CONTROL_NAME, "Invalid state provided to the MenuCommand constructor: The initialState cannot be null or undefined.");
                    }
                    if (Commerce.StringExtensions.isNullOrWhitespace(initialState.id)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(_this.BASE_CONTROL_NAME, "Invalid state provided to the MenuCommand constructor: The id cannot be null or empty.");
                    }
                    if (Commerce.StringExtensions.isNullOrWhitespace(initialState.label)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(_this.BASE_CONTROL_NAME, "Invalid state provided to the MenuCommand constructor: The label cannot be null or empty.");
                    }
                    _this.id = initialState.id;
                    _this.label = initialState.label;
                    _this.onClick = initialState.onClick;
                    return _this;
                }
                return MenuCommand;
            }(PosControl_6.PosControl));
            exports_7("MenuCommand", MenuCommand);
            ToggleMenu = /** @class */ (function (_super) {
                __extends(ToggleMenu, _super);
                function ToggleMenu() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ToggleMenu;
            }(GenericMenuState));
            exports_7("ToggleMenu", ToggleMenu);
            ToggleMenuCommand = /** @class */ (function (_super) {
                __extends(ToggleMenuCommand, _super);
                function ToggleMenuCommand(initialState) {
                    var _this = _super.call(this, initialState) || this;
                    _this.CONTROL_NAME = "ToggleMenuCommand";
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(_this.CONTROL_NAME, "Invalid state provided to the ToggleMenuCommand constructor: The initialState cannot be null or undefined.");
                    }
                    _this.selected = initialState.selected;
                    return _this;
                }
                return ToggleMenuCommand;
            }(MenuCommand));
            exports_7("ToggleMenuCommand", ToggleMenuCommand);
        }
    };
});
System.register("PosUISdk/Controls/NumPad", ["PosUISdk/Controls/PosControl"], function (exports_8, context_8) {
    "use strict";
    var PosControl_7, NumPad, AlphanumericNumPad, DecimalPrecisionNumPad, CurrencyNumPad, NumericNumPad, TransactionNumPad;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (PosControl_7_1) {
                PosControl_7 = PosControl_7_1;
            }
        ],
        execute: function () {
            /**
             * Base class for numpad control.
             */
            NumPad = /** @class */ (function (_super) {
                __extends(NumPad, _super);
                function NumPad(initialState, controlName, numPadContainer) {
                    var _this = _super.call(this) || this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(controlName, "Invalid state provided to the numpad constructor: The initialState cannot be null or undefined.");
                    }
                    if (initialState.captureGlobalInput
                        && (Commerce.ObjectExtensions.isNullOrUndefined(numPadContainer)
                            || Commerce.ObjectExtensions.isNullOrUndefined(numPadContainer.numPadInputBroker))) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(controlName, "Extension view controller or numPadInputBroker cannot be null or undefined if autoFocus is true.");
                    }
                    _this.label = initialState.label;
                    _this.value = ko.observable("");
                    if (initialState.captureGlobalInput) {
                        _this.numPadInputSource = numPadContainer.numPadInputBroker;
                        numPadContainer.captureGlobalInputForNumPad = true;
                    }
                    if (Commerce.ObjectExtensions.isFunction(initialState.onEnter)) {
                        _this.onEnter = initialState.onEnter;
                    }
                    return _this;
                }
                return NumPad;
            }(PosControl_7.PosControl));
            exports_8("NumPad", NumPad);
            /**
             * The class for the alphanumeric numpad control.
             */
            AlphanumericNumPad = /** @class */ (function (_super) {
                __extends(AlphanumericNumPad, _super);
                function AlphanumericNumPad(numPadContainer, initialState) {
                    return _super.call(this, initialState, "AlphanumericNumberPad", numPadContainer) || this;
                }
                return AlphanumericNumPad;
            }(NumPad));
            exports_8("AlphanumericNumPad", AlphanumericNumPad);
            /**
             * Base class for numpads that require decimal precision.
             */
            DecimalPrecisionNumPad = /** @class */ (function (_super) {
                __extends(DecimalPrecisionNumPad, _super);
                function DecimalPrecisionNumPad(initialState, controlName, numPadContainer) {
                    var _this = _super.call(this, initialState, controlName, numPadContainer) || this;
                    _this.decimalPrecision = initialState.decimalPrecision;
                    return _this;
                }
                return DecimalPrecisionNumPad;
            }(NumPad));
            exports_8("DecimalPrecisionNumPad", DecimalPrecisionNumPad);
            /**
             * The class for the currency numpad control. The decimal precision can be set on this numpad. The numbers typed follow currency format.
             * It will ignore letters.
             */
            CurrencyNumPad = /** @class */ (function (_super) {
                __extends(CurrencyNumPad, _super);
                function CurrencyNumPad(numPadContainer, initialState) {
                    return _super.call(this, initialState, "CurrencyNumberPad", numPadContainer) || this;
                }
                return CurrencyNumPad;
            }(DecimalPrecisionNumPad));
            exports_8("CurrencyNumPad", CurrencyNumPad);
            /**
             * The class for the numeric numpad control. The decimal precision can be set on this numpad. The numbers are not formmated as the currency numpad.
             * It will ignore letters.
             */
            NumericNumPad = /** @class */ (function (_super) {
                __extends(NumericNumPad, _super);
                function NumericNumPad(numPadContainer, initialState) {
                    return _super.call(this, initialState, "NumericNumberPad", numPadContainer) || this;
                }
                return NumericNumPad;
            }(DecimalPrecisionNumPad));
            exports_8("NumericNumPad", NumericNumPad);
            /**
             * The class for the transaction numpad control. This numpad is very similar to the alphanumeric one, but it also returns the quantity when "*" is typed.
             * For example: 5*0001. When the user press "enter", it will return on the callback function the value 0001 and quantity 5.
             */
            TransactionNumPad = /** @class */ (function (_super) {
                __extends(TransactionNumPad, _super);
                function TransactionNumPad(numPadContainer, initialState) {
                    return _super.call(this, initialState, "TransactionNumPad", numPadContainer) || this;
                }
                return TransactionNumPad;
            }(NumPad));
            exports_8("TransactionNumPad", TransactionNumPad);
        }
    };
});
System.register("PosUISdk/Controls/Pivot", ["PosUISdk/Controls/PosControl"], function (exports_9, context_9) {
    "use strict";
    var PosControl_8, Pivot, PivotItem;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (PosControl_8_1) {
                PosControl_8 = PosControl_8_1;
            }
        ],
        execute: function () {
            Pivot = /** @class */ (function (_super) {
                __extends(Pivot, _super);
                function Pivot(initialState) {
                    var _this = _super.call(this) || this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(Pivot.CONTROL_NAME, "Invalid state provided to the Pivot constructor: The initialState cannot be null or undefined.");
                    }
                    _this.onSelectionChanged = initialState.onSelectionChanged;
                    return _this;
                }
                Pivot.CONTROL_NAME = "Pivot";
                return Pivot;
            }(PosControl_8.PosControl));
            exports_9("Pivot", Pivot);
            PivotItem = /** @class */ (function (_super) {
                __extends(PivotItem, _super);
                function PivotItem(initialState) {
                    var _this = _super.call(this) || this;
                    _this.header = initialState.header;
                    return _this;
                }
                return PivotItem;
            }(PosControl_8.PosControl));
            exports_9("PivotItem", PivotItem);
        }
    };
});
System.register("PosUISdk/Controls/TimePicker", ["PosUISdk/Controls/PosControl"], function (exports_10, context_10) {
    "use strict";
    var PosControl_9, TimePicker;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (PosControl_9_1) {
                PosControl_9 = PosControl_9_1;
            }
        ],
        execute: function () {
            TimePicker = /** @class */ (function (_super) {
                __extends(TimePicker, _super);
                function TimePicker(initialState) {
                    var _this = _super.call(this) || this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(TimePicker.CONTROL_NAME, "Invalid state provided to the " + TimePicker.CONTROL_NAME + " constructor: The initialState cannot be null or undefined.");
                    }
                    if (!Commerce.ObjectExtensions.isFunction(initialState.onChange)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(TimePicker.CONTROL_NAME, "Invalid state provided to the " + TimePicker.CONTROL_NAME + " constructor: The initialState.onChange callback must be set to a function.");
                    }
                    _this.hourPattern = initialState.hourPattern;
                    _this.minutePattern = initialState.minutePattern;
                    _this.minuteIncrement = initialState.minuteIncrement;
                    _this.current = initialState.initialValue;
                    _this.disabled = initialState.disabled;
                    _this.onChange = initialState.onChange;
                    return _this;
                }
                TimePicker.CONTROL_NAME = "TimePicker";
                return TimePicker;
            }(PosControl_9.PosControl));
            exports_10("TimePicker", TimePicker);
        }
    };
});
System.register("PosUISdk/Controls/ToggleSwitch", ["PosUISdk/Controls/PosControl"], function (exports_11, context_11) {
    "use strict";
    var PosControl_10, ToggleSwitch;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (PosControl_10_1) {
                PosControl_10 = PosControl_10_1;
            }
        ],
        execute: function () {
            ToggleSwitch = /** @class */ (function (_super) {
                __extends(ToggleSwitch, _super);
                function ToggleSwitch(initialState) {
                    var _this = _super.call(this) || this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(initialState)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(ToggleSwitch.CONTROL_NAME, "Invalid state provided to the ToggleSwitch constructor: The initialState cannot be null or undefined.");
                    }
                    else if (Commerce.StringExtensions.isNullOrWhitespace(initialState.labelOn)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(ToggleSwitch.CONTROL_NAME, "Invalid state provided to the ToggleSwitch constructor: The initialState must contain a valid label when switch is on.");
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(initialState.labelOff)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(ToggleSwitch.CONTROL_NAME, "Invalid state provided to the ToggleSwitch constructor: The initialState must contain a valid label when switch is off.");
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(initialState.tabIndex)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(ToggleSwitch.CONTROL_NAME, "Invalid state provided to the ToggleSwitch constructor: The initialState must contain a valid tab index.");
                    }
                    else if (!Commerce.ObjectExtensions.isFunction(initialState.onChange)) {
                        throw new Commerce.UI.Sdk.InvalidConstructorStateException(ToggleSwitch.CONTROL_NAME, "Invalid state provided to the " + ToggleSwitch.CONTROL_NAME + " constructor: The initialState.onChange callback must be set to a function.");
                    }
                    _this.labelOn = initialState.labelOn;
                    _this.labelOff = initialState.labelOff;
                    _this.enabled = _this.getObservable(initialState.enabled, true);
                    _this.checked = _this.getObservable(initialState.checked, false);
                    // holds on to previously checked value.
                    _this._previousCheckedValue = _this.checked();
                    _this.tabIndex = initialState.tabIndex;
                    _this.onChange = _this._onChange.bind(_this);
                    _this._initialStateOnChange = initialState.onChange;
                    return _this;
                }
                ToggleSwitch.prototype._onChange = function (toggleSwitchResult) {
                    // Check if new switch result is different from previously saved value.
                    if (toggleSwitchResult !== this._previousCheckedValue &&
                        Commerce.ObjectExtensions.isFunction(this._initialStateOnChange)) {
                        this._previousCheckedValue = toggleSwitchResult;
                        this._initialStateOnChange(toggleSwitchResult);
                    }
                };
                ToggleSwitch.CONTROL_NAME = "ToggleSwitch";
                return ToggleSwitch;
            }(PosControl_10.PosControl));
            exports_11("ToggleSwitch", ToggleSwitch);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIj/gYJKoZIhvcNAQcCoIIj7zCCI+sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // kjYAC8D/XA8V/pvUldkES+zLg0u27sNH8pMudUDq0Reg
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
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCCJiXqJHBRHGjuqWi4e
// SIG // fT1dcvmQY8kIYHRShy/3sd8CGzCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBC3aF6
// SIG // gfdtigMmrh0/z1bSjrEVR+py9EM50xIQgIU9Mw8gQRJO
// SIG // qJWcBOwCRQvQ4i6bGQsWkt9EiGPgYSfedvnWjhqhxtlC
// SIG // kboirTVCnKdwUk4Oi+yneWkNobI+0Q5fm0Hb5GQiODIf
// SIG // eMAZyXBfeRZ2E5clHWr4MLCiedP9dzcPkX4lm6qDFokS
// SIG // CFpHbgTjZkOl+Mu8/pnK5P0IrbOUHuHBGSDKVuH6AuHS
// SIG // xmd/MZCbe/w4kq1kY+RtKWXB2MoLRlhSCsvfmHBa/EV4
// SIG // pJmP4ZPiQTH2IJWk9X1Wn67vxZCrpIcns10LB51PN0Fa
// SIG // l49lPrsb/d5lGreNFMPzdoOVsHDuoYIS5TCCEuEGCisG
// SIG // AQQBgjcDAwExghLRMIISzQYJKoZIhvcNAQcCoIISvjCC
// SIG // EroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3
// SIG // DQEJEAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEIPzPqBzJdX1KPPiNwTy1
// SIG // HyTABU3IQJP5uoyF92AqXPLzAgZfOtNQPgwYEzIwMjAw
// SIG // ODIzMDQwMjQ1LjYzNlowBIACAfSggdCkgc0wgcoxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29m
// SIG // dCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRo
// SIG // YWxlcyBUU1MgRVNOOjIyNjQtRTMzRS03ODBDMSUwIwYD
// SIG // VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNl
// SIG // oIIOPDCCBPEwggPZoAMCAQICEzMAAAEY/jr32RvUsTMA
// SIG // AAAAARgwDQYJKoZIhvcNAQELBQAwfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTAwHhcNMTkxMTEzMjE0MDM1WhcN
// SIG // MjEwMjExMjE0MDM1WjCByjELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3Bl
// SIG // cmF0aW9uczEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // MjI2NC1FMzNFLTc4MEMxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3
// SIG // DQEBAQUAA4IBDwAwggEKAoIBAQDC+ANcEX8/NRj1t5Yk
// SIG // XYB1ZHPxQSwrhOOfXX1c5aes0t2gTI6OeH4ntcwpyTvS
// SIG // k7+9BBVoqTvHwfbDZmb15nQ94q+UPfBqa/8m1tes/6Fb
// SIG // t1AeVHy4By1AVFi6Yi1vWd3bVRyY2SAeVonIzEFGGtQv
// SIG // eRv2Yj6jbCHE2+xP3Q+AcgxweE8l6/nAN5S/mTDKV2fl
// SIG // HNQg+d5X9SSN7MdLC5OAJgSy374Ii/AnYEKyIgnOFJVk
// SIG // IxkLDxOyrnV/gORloaxyVGlDemnLBNahwsxnmkrpChcw
// SIG // vDieAx4g/Z1fJ0+C+wdA+EtA7rrgnRkjhKHfWkZj40bm
// SIG // x4GpQdJmF1zAZ0FxAgMBAAGjggEbMIIBFzAdBgNVHQ4E
// SIG // FgQU8VvlsC4PYAnYOU/05iPr+LTHKD4wHwYDVR0jBBgw
// SIG // FoAU1WM6XIoxkPNDe3xGG8UzaFqFbVUwVgYDVR0fBE8w
// SIG // TTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
// SIG // L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIw
// SIG // MTAtMDctMDEuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggr
// SIG // BgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0w
// SIG // MS5jcnQwDAYDVR0TAQH/BAIwADATBgNVHSUEDDAKBggr
// SIG // BgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEAcyWdvg6c
// SIG // gs//AmxoQZm+WASpJzUXEPhMp30bWc5HyCwQB+Ma6YPn
// SIG // cSoFdct/5V1K4p/rMcMLBn5LzELVH+uztg6ERK48YtbJ
// SIG // b9A7Jp+fJZj7loXaP9mVP7tJs2tGuubcXpGbgo5HGCjn
// SIG // 7gzMBHY45Q8LScfa1JFQEAiS2gCKKRlrKMsGaIbi+UuB
// SIG // tsbQ8JknvmiEwCCwSmRTX0viAZusm4mJVqKBe3Bmj+yB
// SIG // DJVWcv0MyrEYQ74oa0VSW3JBc+xSrqT2Jgm2Cc6IlSbm
// SIG // 8AsiVE/Vc4yahfmLeeFHfTcrK0flu6VGzjf1GNA1SDXR
// SIG // 4bUinrBli3lfhwtKhx6x5eRsSjCCBnEwggRZoAMCAQIC
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
// SIG // b25zMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjoyMjY0
// SIG // LUUzM0UtNzgwQzElMCMGA1UEAxMcTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUA
// SIG // zdeb1yAva2kJJ2mFfDdeSfFJMdyggYMwgYCkfjB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0B
// SIG // AQUFAAIFAOLr6TIwIhgPMjAyMDA4MjMwMjU3NTRaGA8y
// SIG // MDIwMDgyNDAyNTc1NFowdzA9BgorBgEEAYRZCgQBMS8w
// SIG // LTAKAgUA4uvpMgIBADAKAgEAAgIcdgIB/zAHAgEAAgIR
// SIG // zjAKAgUA4u06sgIBADA2BgorBgEEAYRZCgQCMSgwJjAM
// SIG // BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAID
// SIG // AYagMA0GCSqGSIb3DQEBBQUAA4GBAEyeJovhhPo+MQXU
// SIG // gNvFILKNbRdFBBAcwkYc98jt2/YvXFZDCsMLua/T9BRC
// SIG // JahPQqnB8xmfCRd7zz4ENlRl+e3hkTpUje9V6ajj2x3w
// SIG // TogQBLsXNNnnBN8zhh5vUrHBLfMvyzc48e2ZX0tDpNdX
// SIG // KBMu3pgs1m/1TK1OKVCR8GX+MYIDDTCCAwkCAQEwgZMw
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEY
// SIG // /jr32RvUsTMAAAAAARgwDQYJYIZIAWUDBAIBBQCgggFK
// SIG // MBoGCSqGSIb3DQEJAzENBgsqhkiG9w0BCRABBDAvBgkq
// SIG // hkiG9w0BCQQxIgQgBfCEhs+bcGaDwzJYuSX9LV2FaQco
// SIG // mccP457E/DzYxF8wgfoGCyqGSIb3DQEJEAIvMYHqMIHn
// SIG // MIHkMIG9BCCgzwcUm6pSA48AVS+9m5Z+k6cHH7WyNjvP
// SIG // il0oMg0H9zCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABGP4699kb1LEzAAAAAAEYMCIE
// SIG // IOl7YetocPFlPjLrEhaPKNsoGAiTd29TpryJ5vBtdkb+
// SIG // MA0GCSqGSIb3DQEBCwUABIIBAC0Q59yyqEEq+A9B6926
// SIG // Eu6RakkWxBTo+UFfwsVCTbl/yKp4rzlaQJnbNP6ZiB8n
// SIG // bxElwq2fEbhMNqFUuFr6GMJ23LRTjqrXvKt73Xr6Z7LR
// SIG // RPKRyb8PfA7kgNdB/V1OhOJArZoTsTKrw9PNHqbTARR2
// SIG // nu0hMasCIEy2mEriEer00UIDYGqwnkQYcWEZJE3FjG6F
// SIG // FxrePGQ62j/aw52pNpmKpBOUH32GfbVb7Af3P//QiGVe
// SIG // xjTXKmpR1T/nFUGq0cayYF9PGFCXdcPE5JUoZ7SMxlo9
// SIG // VJZJA8NOJ/riuCzIEyDmqhTq5GqvxTA4DYGnQLRog+C4
// SIG // mCib6MzIcnpPpYA=
// SIG // End signature block
