declare module "PosUISdk/Controls/PosControl" {
    export abstract class PosControl implements IDisposable {
        dispose(): void;
        protected getObservable<T>(value: T | Observable<T> | Computed<T>, defaultValue?: T): Observable<T>;
    }
}
declare module "PosUISdk/Controls/AppBar" {
    import { PosControl } from "PosUISdk/Controls/PosControl";
    export class AppBar extends PosControl {
    }
    export interface IAppBarCommandState {
        enabled?: boolean | Observable<boolean> | Computed<boolean>;
        visible?: boolean | Observable<boolean> | Computed<boolean>;
        label: string | Observable<string>;
        id: string;
        extraClass?: string;
        execute: () => void;
        flyoutSelector?: string;
    }
    export class AppBarCommand extends PosControl {
        readonly enabled: Observable<boolean>;
        readonly visible: Observable<boolean>;
        readonly label: Observable<string>;
        readonly id: string;
        readonly extraClass: string;
        readonly flyoutSelector: string;
        private static readonly CONTROL_NAME;
        private readonly _execute;
        constructor(initialState: IAppBarCommandState);
        execute(): void;
    }
}
declare module "PosUISdk/Controls/DataList" {
    import { PosControl } from "PosUISdk/Controls/PosControl";
    export interface IDataListColumn<TData> {
        title: string;
        computeValue: (row: TData) => (string | number);
        ratio: number;
        collapseOrder: number;
        minWidth: number;
        isRightAligned?: boolean;
    }
    /**
     * Interface for data source that provides the loading data dynamically page by page.
     */
    export interface IIncrementalDataSource<TData> {
        loadDataPage: (pageSize: number, skip: number) => Promise<TData[]>;
        pageSize: number;
    }
    export interface IDataListState<TData> {
        itemDataSource: TData[] | ObservableArray<TData> | IIncrementalDataSource<TData>;
        columns: IDataListColumn<TData>[];
        selectionMode?: SelectionMode;
        itemInvoked?: (item: TData) => void;
        selectionChanged?: (items: TData[]) => void;
        emptyDataListTemplateId?: string;
        autoSelectFirstItem?: boolean;
    }
    export enum SelectionMode {
        None = 0,
        NoneOrSingle = 1,
        NoneOrMulti = 2,
        InvokeOnly = 3,
        InvokeOrSingle = 4,
        InvokeOrMulti = 5,
        SingleSelect = 6,
        MultiSelect = 7
    }
    export class DataList<TData> extends PosControl {
        readonly itemDataSource: TData[] | ObservableArray<TData> | IIncrementalDataSource<TData>;
        readonly columns: IDataListColumn<TData>[];
        readonly selectionMode: SelectionMode;
        readonly emptyDataListTemplateId?: string;
        readonly autoSelectFirstItem: boolean;
        readonly itemInvoked?: (item: TData) => void;
        readonly selectionChanged?: (items: TData[]) => void;
        private static readonly CONTROL_NAME;
        constructor(initialState: IDataListState<TData>);
    }
}
declare module "PosUISdk/Controls/DatePicker" {
    import { PosControl } from "PosUISdk/Controls/PosControl";
    export type DateChangedHandler = (newDate: Date) => void;
    /**
     * For a detailed explanation of these inputs, see WinJS.UI.DatePicker http://msdn.microsoft.com/en-us/library/windows/apps/br211675.aspx
     */
    export interface IDatePickerState {
        datePattern?: string;
        initialValue?: Date;
        disabled?: boolean | Computed<boolean>;
        onChange: DateChangedHandler;
    }
    /**
     * A class exposing the internal time picker control to extensions. This class allows the time picker implementation to change in the future
     * by acting as a proxy between extensions and the data format expected by the control's implementation.
     */
    export class DatePicker extends PosControl {
        readonly datePattern: string;
        readonly current: Date;
        readonly onChange: DateChangedHandler;
        disabled: boolean | Computed<boolean>;
        private static readonly CONTROL_NAME;
        constructor(initialState: IDatePickerState);
    }
}
declare module "PosUISdk/Controls/HeaderSplitView" {
    import { PosControl } from "PosUISdk/Controls/PosControl";
    export interface IHeaderSplitViewState {
        title?: string | Observable<string>;
    }
    export class HeaderSplitView extends PosControl {
        readonly title: Observable<string>;
        constructor(initialState: IHeaderSplitViewState);
    }
}
declare module "PosUISdk/Controls/Loader" {
    import { PosControl } from "PosUISdk/Controls/PosControl";
    export interface ILoaderState {
        visible?: Observable<boolean>;
    }
    export class Loader extends PosControl {
        readonly visible?: Observable<boolean>;
        private static readonly CONTROL_NAME;
        constructor(initialState: ILoaderState);
    }
}
declare module "PosUISdk/Controls/Menu" {
    import { PosControl } from "PosUISdk/Controls/PosControl";
    export type MenuPlacementOptions = "auto" | "top" | "bottom" | "left" | "right";
    export type MenuAlignmentOptions = "center" | "left" | "right";
    export type MenuCommandTypeOptions = "button" | "toggle";
    export type MenuCommandObservable = boolean | Observable<boolean> | Computed<boolean>;
    export interface IMenuCommandClickArgs {
        id: string;
    }
    export type MenuCommandClickCallback = (args?: IMenuCommandClickArgs) => void;
    export interface IGenericMenuState<T> {
        placement?: MenuPlacementOptions;
        alignment?: MenuAlignmentOptions;
        commands?: T[];
    }
    export class GenericMenuState<T, M extends IGenericMenuState<T>> extends PosControl implements IGenericMenuState<T> {
        readonly anchorElement: Observable<HTMLElement>;
        readonly visible: Observable<boolean>;
        readonly placement?: MenuPlacementOptions;
        readonly alignment?: MenuAlignmentOptions;
        readonly commands?: T[];
        private static readonly CONTROL_NAME;
        constructor(initialState: M);
        /**
         * Show menu using anchor element.
         * @param {HTMLElement} anchorElement The anchor element.
         */
        show(anchorElement: HTMLElement): void;
    }
    export interface IMenuState extends IGenericMenuState<IMenuCommandState> {
    }
    export class Menu extends GenericMenuState<IMenuCommandState, IMenuState> {
    }
    export interface IMenuCommandState {
        id: string;
        label: string;
        onClick?: MenuCommandClickCallback;
    }
    export class MenuCommand extends PosControl implements IMenuCommandState {
        readonly id: string;
        readonly label: string;
        readonly onClick?: MenuCommandClickCallback;
        private readonly BASE_CONTROL_NAME;
        constructor(initialState: IMenuCommandState);
    }
    export interface IToggleMenuCommandClickArgs extends IMenuCommandClickArgs {
        selected: boolean;
    }
    export interface IToggleMenuState extends IGenericMenuState<IToggleMenuCommandState> {
    }
    export class ToggleMenu extends GenericMenuState<IToggleMenuCommandState, IToggleMenuState> {
    }
    export interface IToggleMenuCommandState extends IMenuCommandState {
        selected?: boolean;
    }
    export class ToggleMenuCommand extends MenuCommand implements IToggleMenuCommandState {
        readonly selected?: boolean;
        private readonly CONTROL_NAME;
        constructor(initialState: IToggleMenuCommandState);
    }
}
declare module "PosUISdk/Controls/NumPad" {
    import { PosControl } from "PosUISdk/Controls/PosControl";
    import { INumPadContainer } from "PosApi/Create/Views";
    import { INumPadInputBroker } from "PosApi/Consume/Peripherals";
    export interface INumPadResult {
        value: string;
    }
    export type NumPadEnterHandler = (result: INumPadResult) => void;
    export interface INumPadState {
        label: string;
        onEnter: NumPadEnterHandler;
        captureGlobalInput: boolean;
    }
    /**
     * Base class for numpad control.
     */
    export abstract class NumPad extends PosControl {
        readonly label: string;
        readonly onEnter: NumPadEnterHandler;
        readonly numPadInputSource: INumPadInputBroker;
        readonly decimalPrecision: number;
        readonly value: Observable<string>;
        constructor(initialState: INumPadState, controlName: string, numPadContainer: INumPadContainer);
    }
    /**
     * The class for the alphanumeric numpad control.
     */
    export class AlphanumericNumPad extends NumPad {
        constructor(numPadContainer: INumPadContainer, initialState: INumPadState);
    }
    export interface IDecimalPrecisionNumPadState extends INumPadState {
        decimalPrecision: number;
    }
    /**
     * Base class for numpads that require decimal precision.
     */
    export abstract class DecimalPrecisionNumPad extends NumPad {
        readonly decimalPrecision: number;
        constructor(initialState: IDecimalPrecisionNumPadState, controlName: string, numPadContainer: INumPadContainer);
    }
    /**
     * The class for the currency numpad control. The decimal precision can be set on this numpad. The numbers typed follow currency format.
     * It will ignore letters.
     */
    export class CurrencyNumPad extends DecimalPrecisionNumPad {
        constructor(numPadContainer: INumPadContainer, initialState: IDecimalPrecisionNumPadState);
    }
    /**
     * The class for the numeric numpad control. The decimal precision can be set on this numpad. The numbers are not formmated as the currency numpad.
     * It will ignore letters.
     */
    export class NumericNumPad extends DecimalPrecisionNumPad {
        constructor(numPadContainer: INumPadContainer, initialState: IDecimalPrecisionNumPadState);
    }
    export interface ITransactionNumPadResult extends INumPadResult {
        quantity: number;
    }
    export type TransactionNumPadEnterHandler = (result: ITransactionNumPadResult) => void;
    export interface ITransactionNumPadState extends INumPadState {
        onEnter: TransactionNumPadEnterHandler;
    }
    /**
     * The class for the transaction numpad control. This numpad is very similar to the alphanumeric one, but it also returns the quantity when "*" is typed.
     * For example: 5*0001. When the user press "enter", it will return on the callback function the value 0001 and quantity 5.
     */
    export class TransactionNumPad extends NumPad {
        constructor(numPadContainer: INumPadContainer, initialState: ITransactionNumPadState);
    }
}
declare module "PosUISdk/Controls/Pivot" {
    import { PosControl } from "PosUISdk/Controls/PosControl";
    export interface IPivotState {
        onSelectionChanged?: () => void;
    }
    export class Pivot extends PosControl {
        readonly onSelectionChanged?: () => void;
        private static readonly CONTROL_NAME;
        constructor(initialState: IPivotState);
    }
    export interface IPivotItemState {
        header: string;
    }
    export class PivotItem extends PosControl {
        header: string;
        constructor(initialState: IPivotItemState);
    }
}
declare module "PosUISdk/Controls/TimePicker" {
    import { PosControl } from "PosUISdk/Controls/PosControl";
    export type TimeChangedHandler = (newDate: Date) => void;
    /**
     * For a detailed explanation of these inputs, see WinJS.UI.TimePicker https://msdn.microsoft.com/en-us/library/windows/apps/br229736.aspx
     */
    export interface ITimePickerState {
        hourPattern?: string;
        minutePattern?: string;
        minuteIncrement?: number;
        initialValue?: Date;
        disabled?: boolean | Computed<boolean>;
        onChange: TimeChangedHandler;
    }
    /**
     * A class exposing the internal date picker control to extensions. This class allows the date picker implementation to change in the future
     * by acting as a proxy between extensions and the data format expected by the control's implementation.
     */
    export class TimePicker extends PosControl {
        readonly hourPattern: string;
        readonly minutePattern: string;
        readonly minuteIncrement: number;
        readonly current: Date;
        readonly onChange: TimeChangedHandler;
        disabled: boolean | Computed<boolean>;
        private static readonly CONTROL_NAME;
        constructor(initialState: ITimePickerState);
    }
}
declare module "PosUISdk/Controls/ToggleSwitch" {
    import { PosControl } from "PosUISdk/Controls/PosControl";
    export type SwitchChangedHandler = (checked: boolean) => void;
    export interface IToggleSwitchState {
        labelOn: string;
        labelOff: string;
        onChange: SwitchChangedHandler;
        enabled?: boolean;
        checked: boolean;
        tabIndex?: number;
    }
    export class ToggleSwitch extends PosControl {
        readonly labelOn: string;
        readonly labelOff: string;
        readonly enabled: Observable<boolean>;
        readonly checked: Observable<boolean>;
        readonly tabIndex: number;
        readonly onChange: SwitchChangedHandler;
        private static readonly CONTROL_NAME;
        private readonly _initialStateOnChange;
        private _previousCheckedValue;
        constructor(initialState: IToggleSwitchState);
        private _onChange;
    }
}
//# sourceMappingURL=Pos.UI.Sdk.d.ts.map