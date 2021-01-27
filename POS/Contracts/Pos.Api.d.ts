declare module "PosApi/Entities" {
    export import ProxyEntities = Commerce.Proxy.Entities;
    export import ClientEntities = Commerce.Client.Entities;
}
declare module "PosApi/TypeExtensions" {
    export const StringExtensions: typeof Commerce.StringExtensions;
    export const ArrayExtensions: typeof Commerce.ArrayExtensions;
    export const ObjectExtensions: typeof Commerce.ObjectExtensions;
    export const DateExtensions: typeof Commerce.DateExtensions;
}
declare module "PosApi/Consume/Authentication" {
    export import LogOffOperationRequest = Commerce.LogOffOperationRequest;
    export import LogOffOperationResponse = Commerce.LogOffOperationResponse;
    export import LockRegisterOperationRequest = Commerce.LockRegisterOperationRequest;
    export import LockRegisterOperationResponse = Commerce.LockRegisterOperationResponse;
}
declare module "PosApi/Consume/Cart" {
    export import AddPreprocessedTenderLineToCartClientRequest = Commerce.AddPreprocessedTenderLineToCartClientRequest;
    export import AddPreprocessedTenderLineToCartClientResponse = Commerce.AddPreprocessedTenderLineToCartClientResponse;
    export import AddTenderLineToCartClientRequest = Commerce.AddTenderLineToCartClientRequest;
    export import AddTenderLineToCartClientResponse = Commerce.AddTenderLineToCartClientResponse;
    export import ConcludeTransactionClientRequest = Commerce.ConcludeTransactionClientRequest;
    export import ConcludeTransactionClientResponse = Commerce.ConcludeTransactionClientResponse;
    export import GetCurrentCartClientRequest = Commerce.GetCurrentCartClientRequest;
    export import GetCurrentCartClientResponse = Commerce.GetCurrentCartClientResponse;
    export import GetKeyedInPriceClientRequest = Commerce.GetKeyedInPriceClientRequest;
    export import GetKeyedInPriceClientResponse = Commerce.GetKeyedInPriceClientResponse;
    export import GetKeyedInQuantityClientRequest = Commerce.GetKeyedInQuantityClientRequest;
    export import GetKeyedInQuantityClientResponse = Commerce.GetKeyedInQuantityClientResponse;
    export import GetPickupDateClientRequest = Commerce.GetPickupDateClientRequest;
    export import GetPickupDateClientResponse = Commerce.GetPickupDateClientResponse;
    export import GetReasonCodeLinesClientRequest = Commerce.GetReasonCodeLinesClientRequest;
    export import GetReasonCodeLinesClientResponse = Commerce.GetReasonCodeLinesClientResponse;
    export import GetReceiptEmailAddressClientRequest = Commerce.GetReceiptEmailAddressClientRequest;
    export import GetReceiptEmailAddressClientResponse = Commerce.GetReceiptEmailAddressClientResponse;
    export import GetShippingChargeClientRequest = Commerce.GetShippingChargeClientRequest;
    export import GetShippingChargeClientResponse = Commerce.GetShippingChargeClientResponse;
    export import GetShippingDateClientRequest = Commerce.GetShippingDateClientRequest;
    export import GetShippingDateClientResponse = Commerce.GetShippingDateClientResponse;
    export import RefreshCartClientRequest = Commerce.RefreshCartClientRequest;
    export import RefreshCartClientResponse = Commerce.RefreshCartClientResponse;
    export import ResumeSuspendedCartClientRequest = Commerce.ResumeSuspendedCartClientRequest;
    export import ResumeSuspendedCartClientResponse = Commerce.ResumeSuspendedCartClientResponse;
    export import SaveAttributesOnCartClientRequest = Commerce.SaveAttributesOnCartClientRequest;
    export import SaveAttributesOnCartClientResponse = Commerce.SaveAttributesOnCartClientResponse;
    export import SaveAttributesOnCartLinesClientRequest = Commerce.SaveAttributesOnCartLinesClientRequest;
    export import SaveAttributesOnCartLinesClientResponse = Commerce.SaveAttributesOnCartLinesClientResponse;
    export import SaveExtensionPropertiesOnCartClientRequest = Commerce.SaveExtensionPropertiesOnCartClientRequest;
    export import SaveExtensionPropertiesOnCartClientResponse = Commerce.SaveExtensionPropertiesOnCartClientResponse;
    export import SaveExtensionPropertiesOnCartLinesClientRequest = Commerce.SaveExtensionPropertiesOnCartLinesClientRequest;
    export import SaveExtensionPropertiesOnCartLinesClientResponse = Commerce.SaveExtensionPropertiesOnCartLinesClientResponse;
    export import SaveReasonCodeLinesOnCartClientRequest = Commerce.SaveReasonCodeLinesOnCartClientRequest;
    export import SaveReasonCodeLinesOnCartClientResponse = Commerce.SaveReasonCodeLinesOnCartClientResponse;
    export import SaveReasonCodeLinesOnCartLinesClientRequest = Commerce.SaveReasonCodeLinesOnCartLinesClientRequest;
    export import SaveReasonCodeLinesOnCartLinesClientResponse = Commerce.SaveReasonCodeLinesOnCartLinesClientResponse;
    export import SelectSalesLinesForPickUpClientRequest = Commerce.SelectSalesLinesForPickUpClientRequest;
    export import SelectSalesLinesForPickUpClientResponse = Commerce.SelectSalesLinesForPickUpClientResponse;
    export import SetCartAttributesClientRequest = Commerce.SetCartAttributesClientRequest;
    export import SetCartAttributesClientResponse = Commerce.SetCartAttributesClientResponse;
    export import ShowChangeDueClientRequest = Commerce.ShowChangeDueClientRequest;
    export import ShowChangeDueClientResponse = Commerce.ShowChangeDueClientResponse;
    export import AddAffiliationOperationRequest = Commerce.AddAffiliationOperationRequest;
    export import AddAffiliationOperationResponse = Commerce.AddAffiliationOperationResponse;
    export import AddCouponsOperationRequest = Commerce.AddCouponsOperationRequest;
    export import AddCouponsOperationResponse = Commerce.AddCouponsOperationResponse;
    export import AddExpenseAccountLineToCartOperationRequest = Commerce.AddExpenseAccountLineToCartOperationRequest;
    export import AddExpenseAccountLineToCartOperationResponse = Commerce.AddExpenseAccountLineToCartOperationResponse;
    export import AddItemToCartOperationResponse = Commerce.AddItemToCartOperationResponse;
    export import AddItemToCartOperationRequest = Commerce.AddItemToCartOperationRequest;
    export import AddLoyaltyCardToCartOperationRequest = Commerce.AddLoyaltyCardToCartOperationRequest;
    export import AddLoyaltyCardToCartOperationResponse = Commerce.AddLoyaltyCardToCartOperationResponse;
    export import CalculateTotalOperationRequest = Commerce.CalculateTotalOperationRequest;
    export import CalculateTotalOperationResponse = Commerce.CalculateTotalOperationResponse;
    export import CarryoutSelectedProductsOperationRequest = Commerce.CarryoutSelectedProductsOperationRequest;
    export import CarryoutSelectedProductsOperationResponse = Commerce.CarryoutSelectedProductsOperationResponse;
    export import ChangeCartLineUnitOfMeasureOperationRequest = Commerce.ChangeCartLineUnitOfMeasureOperationRequest;
    export import ChangeCartLineUnitOfMeasureOperationResponse = Commerce.ChangeCartLineUnitOfMeasureOperationResponse;
    export import CreateCustomerOrderOperationRequest = Commerce.CreateCustomerOrderOperationRequest;
    export import CreateCustomerOrderOperationResponse = Commerce.CreateCustomerOrderOperationResponse;
    export import CreateCustomerQuoteOperationRequest = Commerce.CreateCustomerQuoteOperationRequest;
    export import CreateCustomerQuoteOperationResponse = Commerce.CreateCustomerQuoteOperationResponse;
    export import CustomerAccountDepositOperationRequest = Commerce.CustomerAccountDepositOperationRequest;
    export import CustomerAccountDepositOperationResponse = Commerce.CustomerAccountDepositOperationResponse;
    export import DepositOverrideOperationRequest = Commerce.DepositOverrideOperationRequest;
    export import DepositOverrideOperationResponse = Commerce.DepositOverrideOperationResponse;
    export import EditCustomerOrderOperationRequest = Commerce.EditCustomerOrderOperationRequest;
    export import EditCustomerOrderOperationResponse = Commerce.EditCustomerOrderOperationResponse;
    export import LineDiscountAmountOperationResponse = Commerce.LineDiscountAmountOperationResponse;
    export import LineDiscountAmountOperationRequest = Commerce.LineDiscountAmountOperationRequest;
    export import LineDiscountPercentOperationResponse = Commerce.LineDiscountPercentOperationResponse;
    export import LineDiscountPercentOperationRequest = Commerce.LineDiscountPercentOperationRequest;
    export import OverrideLineTaxFromListOperationRequest = Commerce.OverrideLineTaxFromListOperationRequest;
    export import OverrideLineTaxFromListOperationResponse = Commerce.OverrideLineTaxFromListOperationResponse;
    export import OverrideLineTaxOperationRequest = Commerce.OverrideLineTaxOperationRequest;
    export import OverrideLineTaxOperationResponse = Commerce.OverrideLineTaxOperationResponse;
    export import OverrideTransactionTaxOperationRequest = Commerce.OverrideTransactionTaxOperationRequest;
    export import OverrideTransactionTaxOperationResponse = Commerce.OverrideTransactionTaxOperationResponse;
    export import PickupAllOperationRequest = Commerce.PickupAllOperationRequest;
    export import PickupAllOperationResponse = Commerce.PickupAllOperationResponse;
    export import PriceOverrideOperationRequest = Commerce.PriceOverrideOperationRequest;
    export import PriceOverrideOperationResponse = Commerce.PriceOverrideOperationResponse;
    export import ReturnCartLineOperationRequest = Commerce.ReturnCartLineOperationRequest;
    export import ReturnCartLineOperationResponse = Commerce.ReturnCartLineOperationResponse;
    export import ReturnItemOperationRequest = Commerce.ReturnItemOperationRequest;
    export import ReturnItemOperationResponse = Commerce.ReturnItemOperationResponse;
    export import ReturnTransactionOperationRequest = Commerce.ReturnTransactionOperationRequest;
    export import ReturnTransactionOperationResponse = Commerce.ReturnTransactionOperationResponse;
    export import SetCartLineCommentOperationRequest = Commerce.SetCartLineCommentOperationRequest;
    export import SetCartLineCommentOperationResponse = Commerce.SetCartLineCommentOperationResponse;
    export import SetCartLineQuantityOperationRequest = Commerce.SetCartLineQuantityOperationRequest;
    export import SetCartLineQuantityOperationResponse = Commerce.SetCartLineQuantityOperationResponse;
    export import SetCustomerOnCartOperationRequest = Commerce.SetCustomerOnCartOperationRequest;
    export import SetCustomerOnCartOperationResponse = Commerce.SetCustomerOnCartOperationResponse;
    export import SetTransactionCommentOperationRequest = Commerce.SetTransactionCommentOperationRequest;
    export import SetTransactionCommentOperationResponse = Commerce.SetTransactionCommentOperationResponse;
    export import ShipAllCartLinesOperationRequest = Commerce.Cart.ShipAllCartLinesOperationRequest;
    export import ShipAllCartLinesOperationResponse = Commerce.Cart.ShipAllCartLinesOperationResponse;
    export import ShipSelectedCartLinesOperationRequest = Commerce.Cart.ShipSelectedCartLinesOperationRequest;
    export import ShipSelectedCartLinesOperationResponse = Commerce.Cart.ShipSelectedCartLinesOperationResponse;
    export import SuspendCurrentCartOperationRequest = Commerce.SuspendCurrentCartOperationRequest;
    export import SuspendCurrentCartOperationResponse = Commerce.SuspendCurrentCartOperationResponse;
    export import TotalDiscountAmountOperationResponse = Commerce.TotalDiscountAmountOperationResponse;
    export import TotalDiscountAmountOperationRequest = Commerce.TotalDiscountAmountOperationRequest;
    export import TotalDiscountPercentOperationResponse = Commerce.TotalDiscountPercentOperationResponse;
    export import TotalDiscountPercentOperationRequest = Commerce.TotalDiscountPercentOperationRequest;
    export import VoidCartLineOperationRequest = Commerce.VoidCartLineOperationRequest;
    export import VoidCartLineOperationResponse = Commerce.VoidCartLineOperationResponse;
    export import VoidTenderLineOperationRequest = Commerce.VoidTenderLineOperationRequest;
    export import VoidTenderLineOperationResponse = Commerce.VoidTenderLineOperationResponse;
    export import VoidTransactionOperationRequest = Commerce.VoidTransactionOperationRequest;
    export import VoidTransactionOperationResponse = Commerce.VoidTransactionOperationResponse;
    export import CreateEmptyCartServiceRequest = Commerce.CreateEmptyCartServiceRequest;
    export import CreateEmptyCartServiceResponse = Commerce.CreateEmptyCartServiceResponse;
    export import GetTaxOverridesServiceRequest = Commerce.GetTaxOverridesServiceRequest;
    export import GetTaxOverridesServiceResponse = Commerce.GetTaxOverridesServiceResponse;
    export import UpdateTenderLineSignatureServiceRequest = Commerce.Payments.UpdateTenderLineSignatureServiceRequest;
    export import UpdateTenderLineSignatureServiceResponse = Commerce.Payments.UpdateTenderLineSignatureServiceResponse;
}
declare module "PosApi/Consume/Categories" {
    export import GetCategoriesServiceRequest = Commerce.Categories.GetCategoriesServiceRequest;
    export import GetCategoriesServiceResponse = Commerce.Categories.GetCategoriesServiceResponse;
}
declare module "PosApi/Consume/Controls" {
    export import IControlOptions = Commerce.Extensibility.IControlOptions;
    export import IControl = Commerce.Extensibility.IControl;
    export import DataListInteractionMode = Commerce.Extensibility.DataListInteractionMode;
    export import IDataListEqualityComparer = Commerce.Extensibility.IDataListEqualityComparer;
    export import IDataListOptions = Commerce.Extensibility.IDataListOptions;
    export import IDataList = Commerce.Extensibility.IDataList;
    export import IPaginatedDataListOptions = Commerce.Extensibility.IPaginatedDataListOptions;
    export import IPaginatedDataList = Commerce.Extensibility.IPaginatedDataList;
    export import IPaginatedDataSource = Commerce.Extensibility.IPaginatedDataSource;
    export import IDatePickerOptions = Commerce.Extensibility.IDatePickerOptions;
    export import IDatePicker = Commerce.Extensibility.IDatePicker;
    export import IMenu = Commerce.Extensibility.IMenu;
    export import IMenuOptions = Commerce.Extensibility.IMenuOptions;
    export import DirectionalHint = Commerce.Extensibility.DirectionalHint;
    export import IAlphanumericNumPadOptions = Commerce.Extensibility.IAlphanumericNumPadOptions;
    export import IAlphanumericNumPad = Commerce.Extensibility.IAlphanumericNumPad;
    export import ICurrencyNumPadOptions = Commerce.Extensibility.ICurrencyNumPadOptions;
    export import ICurrencyNumPad = Commerce.Extensibility.ICurrencyNumPad;
    export import INumericNumPadOptions = Commerce.Extensibility.INumericNumPadOptions;
    export import INumericNumPad = Commerce.Extensibility.INumericNumPad;
    export import ITransactionNumPadOptions = Commerce.Extensibility.ITransactionNumPadOptions;
    export import ITransactionNumPad = Commerce.Extensibility.ITransactionNumPad;
    export import ITimePickerOptions = Commerce.Extensibility.ITimePickerOptions;
    export import ITimePicker = Commerce.Extensibility.ITimePicker;
    export import IToggleOptions = Commerce.Extensibility.IToggleOptions;
    export import IToggle = Commerce.Extensibility.IToggle;
}
declare module "PosApi/Consume/Customer" {
    export import GetCustomerClientRequest = Commerce.GetCustomerClientRequest;
    export import GetCustomerClientResponse = Commerce.GetCustomerClientResponse;
    export import SelectCustomerClientRequest = Commerce.Customers.SelectCustomerClientRequest;
    export import SelectCustomerClientResponse = Commerce.Customers.SelectCustomerClientResponse;
    export import CreateCustomerServiceRequest = Commerce.CreateCustomerServiceRequest;
    export import CreateCustomerServiceResponse = Commerce.CreateCustomerServiceResponse;
    export import UpdateCustomerServiceRequest = Commerce.UpdateCustomerServiceRequest;
    export import UpdateCustomerServiceResponse = Commerce.UpdateCustomerServiceResponse;
}
declare module "PosApi/Consume/DataService" {
    export import DataServiceRequest = Commerce.DataService.DataServiceRequest;
    export import DataServiceResponse = Commerce.DataService.DataServiceResponse;
}
declare module "PosApi/Consume/Device" {
    export import GetActiveHardwareStationClientRequest = Commerce.GetActiveHardwareStationClientRequest;
    export import GetActiveHardwareStationClientResponse = Commerce.GetActiveHardwareStationClientResponse;
    export import GetApplicationVersionClientRequest = Commerce.GetApplicationVersionClientRequest;
    export import GetApplicationVersionClientResponse = Commerce.GetApplicationVersionClientResponse;
    export import GetChannelConfigurationClientRequest = Commerce.GetChannelConfigurationClientRequest;
    export import GetChannelConfigurationClientResponse = Commerce.GetChannelConfigurationClientResponse;
    export import GetDeviceConfigurationClientRequest = Commerce.GetDeviceConfigurationClientRequest;
    export import GetDeviceConfigurationClientResponse = Commerce.GetDeviceConfigurationClientResponse;
    export import GetExtensionProfileClientRequest = Commerce.GetExtensionProfileClientRequest;
    export import GetExtensionProfileClientResponse = Commerce.GetExtensionProfileClientResponse;
    export import GetHardwareProfileClientRequest = Commerce.GetHardwareProfileClientRequest;
    export import GetHardwareProfileClientResponse = Commerce.GetHardwareProfileClientResponse;
    export import GetAuthenticationTokenClientRequest = Commerce.GetAuthenticationTokenClientRequest;
    export import GetAuthenticationTokenClientResponse = Commerce.GetAuthenticationTokenClientResponse;
    export import GetConnectionStatusClientRequest = Commerce.GetConnectionStatusClientRequest;
    export import GetConnectionStatusClientResponse = Commerce.GetConnectionStatusClientResponse;
    export import HealthCheckOperationRequest = Commerce.HealthCheckOperationRequest;
    export import HealthCheckOperationResponse = Commerce.HealthCheckOperationResponse;
}
declare module "PosApi/Consume/Diagnostics" {
    export import GetSessionInfoClientRequest = Commerce.GetSessionInfoClientRequest;
    export import GetSessionInfoClientResponse = Commerce.GetSessionInfoClientResponse;
}
declare module "PosApi/Consume/Dialogs" {
    export import IDialogButton = Commerce.Client.Entities.Dialogs.IDialogButton;
    export import IDialogResultButton = Commerce.Client.Entities.Dialogs.IDialogResultButton;
    export import IDialogOptions = Commerce.Client.Entities.Dialogs.IDialogOptions;
    export import IMessageDialogOptions = Commerce.Client.Entities.Dialogs.IMessageDialogOptions;
    export import ShowMessageDialogClientRequest = Commerce.ShowMessageDialogClientRequest;
    export import ShowMessageDialogClientResponse = Commerce.ShowMessageDialogClientResponse;
    export import IAlphanumericInputDialogOptions = Commerce.Client.Entities.Dialogs.IAlphanumericInputDialogOptions;
    export import IAlphanumericInputDialogResult = Commerce.Client.Entities.Dialogs.IAlphanumericInputDialogResult;
    export import ShowAlphanumericInputDialogError = Commerce.Client.Entities.ShowAlphanumericInputDialogError;
    export import ShowAlphanumericInputDialogClientRequest = Commerce.ShowAlphanumericInputDialogClientRequest;
    export import ShowAlphanumericInputDialogClientResponse = Commerce.ShowAlphanumericInputDialogClientResponse;
    export import INumericInputDialogOptions = Commerce.Client.Entities.Dialogs.INumericInputDialogOptions;
    export import INumericInputDialogResult = Commerce.Client.Entities.Dialogs.INumericInputDialogResult;
    export import ShowNumericInputDialogError = Commerce.Client.Entities.ShowNumericInputDialogError;
    export import ShowNumericInputDialogClientRequest = Commerce.ShowNumericInputDialogClientRequest;
    export import ShowNumericInputDialogClientResponse = Commerce.ShowNumericInputDialogClientResponse;
    export import IListInputDialogItem = Commerce.Client.Entities.Dialogs.IListInputDialogItem;
    export import IListInputDialogOptions = Commerce.Client.Entities.Dialogs.IListInputDialogOptions;
    export import IListInputDialogResult = Commerce.Client.Entities.Dialogs.IListInputDialogResult;
    export import ShowListInputDialogError = Commerce.Client.Entities.ShowListInputDialogError;
    export import ShowListInputDialogClientRequest = Commerce.ShowListInputDialogClientRequest;
    export import ShowListInputDialogClientResponse = Commerce.ShowListInputDialogClientResponse;
    export import ITextInputDialogResult = Commerce.Client.Entities.Dialogs.ITextInputDialogResult;
    export import ITextInputDialogOptions = Commerce.Client.Entities.Dialogs.ITextInputDialogOptions;
    export import ShowTextInputDialogError = Commerce.Client.Entities.ShowTextInputDialogError;
    export import ShowTextInputDialogClientRequest = Commerce.ShowTextInputDialogClientRequest;
    export import ShowTextInputDialogClientResponse = Commerce.ShowTextInputDialogClientResponse;
}
declare module "PosApi/Consume/Employees" {
    export import GetLoggedOnEmployeeClientRequest = Commerce.GetLoggedOnEmployeeClientRequest;
    export import GetLoggedOnEmployeeClientResponse = Commerce.GetLoggedOnEmployeeClientResponse;
}
declare module "PosApi/Consume/Formatters" {
    /**
     * Provides access to utility functions which format boolean values for display to users.
     * @interface
     */
    export interface IBooleanFormatter {
        /**
         * Converts a boolean to a localized string representation of 'Yes', if true, or 'No' if false.
         *
         * @param {boolean} value The value to be formatted into a string.
         * @return {string} The formatted boolean.
         */
        toYesNo(value: boolean): string;
    }
    export let BooleanFormatter: IBooleanFormatter;
    /**
     * Provides access to utility functions which format currency amounts for display to users.
     * @interface
     */
    export interface ICurrencyFormatter {
        /**
         * Returns a locale-specific string for the specified amount of currency.
         *
         * @param {number} value The amount of currency.
         * @return {string} A formatted string, specifying the amount in the device's currency.
         */
        toCurrency(value: number): string;
    }
    export let CurrencyFormatter: ICurrencyFormatter;
    /**
     * Provides access to utility functions which format dates for display to users.
     * @interface
     */
    export interface IDateFormatter {
        /**
         * Returns the formatted short date and time.
         * @param {Date} value The date.
         * @return {string} The formatted short date and time.
         */
        toShortDateAndTime(value: Date): string;
        /**
         * Returns the short date.
         * @param {Date} value The date.
         * @return {string} The short date.
         */
        toShortDate(value: Date): string;
    }
    export let DateFormatter: IDateFormatter;
    /**
     * Provides access to utility functions which format purchase transfer order type values for display to users.
     * @interface
     */
    export interface IPurchaseTransferOrderTypeFormatter {
        /**
         * Returns a localized string describing the specified purchase transfer order type.
         * @param value {Commerce.Proxy.Entities.PurchaseTransferOrderType} The Purchase Transfer Order Type's enum value.
         * @returns {string} The enum value's name as a localized string, or an empty string if the value was invalid.
         */
        toName(value: Commerce.Proxy.Entities.PurchaseTransferOrderType): string;
    }
    export let PurchaseTransferOrderTypeFormatter: IPurchaseTransferOrderTypeFormatter;
    /**
     * Provides access to utility functions which format transaction type values for display to users.
     * @interface
     */
    export interface ITransactionTypeFormatter {
        /**
         * Returns a localized string describing the specified transaction type.
         * @param value {number} The Transaction Type's enum value.
         * @param {number} [entryStatusValue] The entry status enum value.
         * @returns {string} The enum value's name as a localized string, or an empty string if the value was invalid.
         */
        toName(value: number, entryStatusValue?: number): string;
    }
    export let TransactionTypeFormatter: ITransactionTypeFormatter;
}
declare module "PosApi/Consume/OrgUnits" {
    export import GetOrgUnitConfigurationClientRequest = Commerce.GetOrgUnitConfigurationClientRequest;
    export import GetOrgUnitConfigurationClientResponse = Commerce.GetOrgUnitConfigurationClientResponse;
    export import GetOrgUnitTenderTypesClientRequest = Commerce.GetOrgUnitTenderTypesClientRequest;
    export import GetOrgUnitTenderTypesClientResponse = Commerce.GetOrgUnitTenderTypesClientResponse;
    export import InventoryLookupOperationRequest = Commerce.InventoryLookupOperationRequest;
    export import InventoryLookupOperationResponse = Commerce.InventoryLookupOperationResponse;
}
declare module "PosApi/Consume/Payments" {
    export import GetGiftCardByIdServiceRequest = Commerce.Payments.GetGiftCardByIdServiceRequest;
    export import GetGiftCardByIdServiceResponse = Commerce.Payments.GetGiftCardByIdServiceResponse;
    export import GetPaymentCardTypeByBinRangeClientRequest = Commerce.GetPaymentCardTypeByBinRangeClientRequest;
    export import GetPaymentCardTypeByBinRangeClientResponse = Commerce.GetPaymentCardTypeByBinRangeClientResponse;
}
declare module "PosApi/Consume/Peripherals" {
    export import CardPaymentAuthorizeCardTokenPeripheralRequest = Commerce.Peripherals.CardPaymentAuthorizeCardTokenPeripheralRequest;
    export import CardPaymentAuthorizeCardTokenPeripheralResponse = Commerce.Peripherals.CardPaymentAuthorizeCardTokenPeripheralResponse;
    export import CardPaymentAuthorizePaymentRequest = Commerce.CardPaymentAuthorizePaymentRequest;
    export import CardPaymentAuthorizePaymentResponse = Commerce.CardPaymentAuthorizePaymentResponse;
    export import CardPaymentBeginTransactionRequest = Commerce.CardPaymentBeginTransactionRequest;
    export import CardPaymentBeginTransactionResponse = Commerce.CardPaymentBeginTransactionResponse;
    export import CardPaymentCapturePaymentRequest = Commerce.CardPaymentCapturePaymentRequest;
    export import CardPaymentCapturePaymentResponse = Commerce.CardPaymentCapturePaymentResponse;
    export import CardPaymentEndTransactionRequest = Commerce.CardPaymentEndTransactionRequest;
    export import CardPaymentEndTransactionResponse = Commerce.CardPaymentEndTransactionResponse;
    export import CardPaymentEnquireGiftCardBalancePeripheralRequest = Commerce.CardPaymentEnquireGiftCardBalancePeripheralRequest;
    export import CardPaymentEnquireGiftCardBalancePeripheralResponse = Commerce.CardPaymentEnquireGiftCardBalancePeripheralResponse;
    export import CardPaymentExecuteTaskRequest = Commerce.CardPaymentExecuteTaskRequest;
    export import CardPaymentExecuteTaskResponse = Commerce.CardPaymentExecuteTaskResponse;
    export import CardPaymentRefundPaymentRequest = Commerce.CardPaymentRefundPaymentRequest;
    export import CardPaymentRefundPaymentResponse = Commerce.CardPaymentRefundPaymentResponse;
    export import CardPaymentVoidPaymentRequest = Commerce.CardPaymentVoidPaymentRequest;
    export import CardPaymentVoidPaymentResponse = Commerce.CardPaymentVoidPaymentResponse;
    export import CashDrawerIsOpenRequest = Commerce.CashDrawerIsOpenRequest;
    export import CashDrawerIsOpenResponse = Commerce.CashDrawerIsOpenResponse;
    export import CashDrawerOpenRequest = Commerce.CashDrawerOpenRequest;
    export import CashDrawerOpenResponse = Commerce.CashDrawerOpenResponse;
    export import HardwareStationDeviceActionRequest = Commerce.HardwareStationDeviceActionRequest;
    export import HardwareStationDeviceActionResponse = Commerce.HardwareStationDeviceActionResponse;
    export import HardwareStationStatusRequest = Commerce.HardwareStationStatusRequest;
    export import HardwareStationStatusResponse = Commerce.HardwareStationStatusResponse;
    export import INumPadInputBroker = Commerce.Peripherals.INumPadInputBroker;
    export import INumPadInputPublisher = Commerce.Peripherals.INumPadInputPublisher;
    export import INumPadInputSubscriber = Commerce.Peripherals.INumPadInputSubscriber;
    export import LineDisplayDisplayLinesRequest = Commerce.LineDisplayDisplayLinesRequest;
    export import LineDisplayDisplayLinesResponse = Commerce.LineDisplayDisplayLinesResponse;
    export import PaymentTerminalActivateGiftCardPeripheralRequest = Commerce.Peripherals.PaymentTerminalActivateGiftCardPeripheralRequest;
    export import PaymentTerminalActivateGiftCardPeripheralResponse = Commerce.Peripherals.PaymentTerminalActivateGiftCardPeripheralResponse;
    export import PaymentTerminalAddBalanceToGiftCardPeripheralRequest = Commerce.Peripherals.PaymentTerminalAddBalanceToGiftCardPeripheralRequest;
    export import PaymentTerminalAddBalanceToGiftCardPeripheralResponse = Commerce.Peripherals.PaymentTerminalAddBalanceToGiftCardPeripheralResponse;
    export import PaymentTerminalAuthorizePaymentActivityRequest = Commerce.PaymentTerminalAuthorizePaymentActivityRequest;
    export import PaymentTerminalAuthorizePaymentActivityResponse = Commerce.PaymentTerminalAuthorizePaymentActivityResponse;
    export import PaymentTerminalAuthorizePaymentRequest = Commerce.PaymentTerminalAuthorizePaymentRequest;
    export import PaymentTerminalAuthorizePaymentResponse = Commerce.PaymentTerminalAuthorizePaymentResponse;
    export import PaymentTerminalBeginTransactionRequest = Commerce.PaymentTerminalBeginTransactionRequest;
    export import PaymentTerminalBeginTransactionResponse = Commerce.PaymentTerminalBeginTransactionResponse;
    export import PaymentTerminalCancelOperationRequest = Commerce.PaymentTerminalCancelOperationRequest;
    export import PaymentTerminalCancelOperationResponse = Commerce.PaymentTerminalCancelOperationResponse;
    export import PaymentTerminalCapturePaymentRequest = Commerce.PaymentTerminalCapturePaymentRequest;
    export import PaymentTerminalCapturePaymentResponse = Commerce.PaymentTerminalCapturePaymentResponse;
    export import PaymentTerminalEndTransactionRequest = Commerce.PaymentTerminalEndTransactionRequest;
    export import PaymentTerminalEndTransactionResponse = Commerce.PaymentTerminalEndTransactionResponse;
    export import PaymentTerminalEnquireGiftCardBalancePeripheralRequest = Commerce.PaymentTerminalEnquireGiftCardBalancePeripheralRequest;
    export import PaymentTerminalEnquireGiftCardBalancePeripheralResponse = Commerce.PaymentTerminalEnquireGiftCardBalancePeripheralResponse;
    export import PaymentTerminalExecuteTaskRequest = Commerce.PaymentTerminalExecuteTaskRequest;
    export import PaymentTerminalExecuteTaskResponse = Commerce.PaymentTerminalExecuteTaskResponse;
    export import PaymentTerminalFetchTokenPeripheralRequest = Commerce.PaymentTerminalFetchTokenPeripheralRequest;
    export import PaymentTerminalFetchTokenPeripheralResponse = Commerce.PaymentTerminalFetchTokenPeripheralResponse;
    export import PaymentTerminalGetTransactionReferenceIdRequest = Commerce.PaymentTerminalGetTransactionReferenceIdRequest;
    export import PaymentTerminalGetTransactionReferenceIdResponse = Commerce.PaymentTerminalGetTransactionReferenceIdResponse;
    export import PaymentTerminalGetTransactionByTransactionReferenceRequest = Commerce.PaymentTerminalGetTransactionByTransactionReferenceRequest;
    export import PaymentTerminalGetTransactionByTransactionReferenceResponse = Commerce.PaymentTerminalGetTransactionByTransactionReferenceResponse;
    export import PaymentTerminalRefundPaymentActivityRequest = Commerce.PaymentTerminalRefundPaymentActivityRequest;
    export import PaymentTerminalRefundPaymentActivityResponse = Commerce.PaymentTerminalRefundPaymentActivityResponse;
    export import PaymentTerminalRefundPaymentRequest = Commerce.PaymentTerminalRefundPaymentRequest;
    export import PaymentTerminalRefundPaymentResponse = Commerce.PaymentTerminalRefundPaymentResponse;
    export import PaymentTerminalUpdateLinesRequest = Commerce.PaymentTerminalUpdateLinesRequest;
    export import PaymentTerminalUpdateLinesResponse = Commerce.PaymentTerminalUpdateLinesResponse;
    export import PaymentTerminalVoidPaymentRequest = Commerce.PaymentTerminalVoidPaymentRequest;
    export import PaymentTerminalVoidPaymentResponse = Commerce.PaymentTerminalVoidPaymentResponse;
    export import PrinterPrintRequest = Commerce.PrinterPrintRequest;
    export import PrinterPrintResponse = Commerce.PrinterPrintResponse;
    export import ScaleReadRequest = Commerce.ScaleReadRequest;
    export import ScaleReadResponse = Commerce.ScaleReadResponse;
}
declare module "PosApi/Consume/Products" {
    export import GetCurrentProductCatalogStoreClientRequest = Commerce.Products.GetCurrentProductCatalogStoreClientRequest;
    export import GetCurrentProductCatalogStoreClientResponse = Commerce.Products.GetCurrentProductCatalogStoreClientResponse;
    export import GetProductsByIdsClientRequest = Commerce.Products.GetProductsByIdsClientRequest;
    export import GetProductsByIdsClientResponse = Commerce.Products.GetProductsByIdsClientResponse;
    export import GetSerialNumberClientRequest = Commerce.Products.GetSerialNumberClientRequest;
    export import GetSerialNumberClientResponse = Commerce.Products.GetSerialNumberClientResponse;
    export import SelectProductClientRequest = Commerce.Products.SelectProductClientRequest;
    export import SelectProductClientResponse = Commerce.Products.SelectProductClientResponse;
    export import SelectProductVariantClientRequest = Commerce.Products.SelectProductVariantClientRequest;
    export import SelectProductVariantClientResponse = Commerce.Products.SelectProductVariantClientResponse;
    export import GetActivePricesServiceRequest = Commerce.Products.GetActivePricesServiceRequest;
    export import GetActivePricesServiceResponse = Commerce.Products.GetActivePricesServiceResponse;
    export import GetRefinerValuesByTextServiceRequest = Commerce.Products.GetRefinerValuesByTextServiceRequest;
    export import GetRefinerValuesByTextServiceResponse = Commerce.Products.GetRefinerValuesByTextServiceResponse;
}
declare module "PosApi/Consume/SalesOrders" {
    export import GetCancellationChargeClientRequest = Commerce.SalesOrders.GetCancellationChargeClientRequest;
    export import GetCancellationChargeClientResponse = Commerce.SalesOrders.GetCancellationChargeClientResponse;
    export import GetGiftReceiptsClientRequest = Commerce.SalesOrders.GetGiftReceiptsClientRequest;
    export import GetGiftReceiptsClientResponse = Commerce.SalesOrders.GetGiftReceiptsClientResponse;
    export import GetReceiptsClientRequest = Commerce.GetReceiptsClientRequest;
    export import GetReceiptsClientResponse = Commerce.GetReceiptsClientResponse;
    export import GetSalesOrderDetailsBySalesIdServiceRequest = Commerce.SalesOrders.GetSalesOrderDetailsBySalesIdServiceRequest;
    export import GetSalesOrderDetailsBySalesIdServiceResponse = Commerce.SalesOrders.GetSalesOrderDetailsBySalesIdServiceResponse;
    export import GetSalesOrderDetailsByTransactionIdClientRequest = Commerce.GetSalesOrderDetailsByTransactionIdClientRequest;
    export import GetSalesOrderDetailsByTransactionIdClientResponse = Commerce.GetSalesOrderDetailsByTransactionIdClientResponse;
    export import MarkAsPickedServiceRequest = Commerce.SalesOrders.MarkAsPickedServiceRequest;
    export import MarkAsPickedServiceResponse = Commerce.SalesOrders.MarkAsPickedServiceResponse;
    export import PrintPackingSlipClientRequest = Commerce.PrintPackingSlipClientRequest;
    export import PrintPackingSlipClientResponse = Commerce.PrintPackingSlipClientResponse;
    export import RegisterPrintReceiptCopyEventRequest = Commerce.RegisterPrintReceiptCopyEventRequest;
    export import RegisterPrintReceiptCopyEventResponse = Commerce.RegisterPrintReceiptCopyEventResponse;
    export import SelectCustomerOrderTypeClientRequest = Commerce.SalesOrders.SelectCustomerOrderTypeClientRequest;
    export import SelectCustomerOrderTypeClientResponse = Commerce.SalesOrders.SelectCustomerOrderTypeClientResponse;
    export import PickUpCustomerOrderLinesClientRequest = Commerce.SalesOrders.PickUpCustomerOrderLinesClientRequest;
    export import PickUpCustomerOrderLinesClientResponse = Commerce.SalesOrders.PickUpCustomerOrderLinesClientResponse;
    export import SearchSalesTransactionsByReceiptIdServiceRequest = Commerce.SalesOrders.SearchSalesTransactionsByReceiptIdServiceRequest;
    export import SearchSalesTransactionsByReceiptIdServiceResponse = Commerce.SalesOrders.SearchSalesTransactionsByReceiptIdServiceResponse;
}
declare module "PosApi/Consume/ScanResults" {
    export import GetScanResultClientRequest = Commerce.GetScanResultClientRequest;
    export import GetScanResultClientResponse = Commerce.GetScanResultClientResponse;
}
declare module "PosApi/Consume/Shifts" {
    export import GetCurrentShiftClientRequest = Commerce.GetCurrentShiftClientRequest;
    export import GetCurrentShiftClientResponse = Commerce.GetCurrentShiftClientResponse;
    export import CloseShiftOperationRequest = Commerce.CloseShiftOperationRequest;
    export import CloseShiftOperationResponse = Commerce.CloseShiftOperationResponse;
}
declare module "PosApi/Consume/StockCountJournals" {
    export import SyncAllStockCountJournalsClientRequest = Commerce.SyncAllStockCountJournalsClientRequest;
    export import SyncAllStockCountJournalsClientResponse = Commerce.SyncAllStockCountJournalsClientResponse;
}
declare module "PosApi/Consume/StoreOperations" {
    export import CreateBankDropTransactionClientRequest = Commerce.TenderCounting.CreateBankDropTransactionClientRequest;
    export import CreateBankDropTransactionClientResponse = Commerce.TenderCounting.CreateBankDropTransactionClientResponse;
    export import CreateFloatEntryTransactionClientRequest = Commerce.CashManagement.CreateFloatEntryTransactionClientRequest;
    export import CreateFloatEntryTransactionClientResponse = Commerce.CashManagement.CreateFloatEntryTransactionClientResponse;
    export import CreateSafeDropTransactionClientRequest = Commerce.TenderCounting.CreateSafeDropTransactionClientRequest;
    export import CreateSafeDropTransactionClientResponse = Commerce.TenderCounting.CreateSafeDropTransactionClientResponse;
    export import CreateStartingAmountTransactionClientRequest = Commerce.CashManagement.CreateStartingAmountTransactionClientRequest;
    export import CreateStartingAmountTransactionClientResponse = Commerce.CashManagement.CreateStartingAmountTransactionClientResponse;
    export import CreateTenderDeclarationTransactionClientRequest = Commerce.TenderCounting.CreateTenderDeclarationTransactionClientRequest;
    export import CreateTenderDeclarationTransactionClientResponse = Commerce.TenderCounting.CreateTenderDeclarationTransactionClientResponse;
    export import CreateTenderRemovalTransactionClientRequest = Commerce.CashManagement.CreateTenderRemovalTransactionClientRequest;
    export import CreateTenderRemovalTransactionClientResponse = Commerce.CashManagement.CreateTenderRemovalTransactionClientResponse;
    export import DeclareStartingAmountClientRequest = Commerce.DeclareStartingAmountClientRequest;
    export import DeclareStartingAmountClientResponse = Commerce.DeclareStartingAmountClientResponse;
    export import GetCountedTenderDetailAmountClientRequest = Commerce.TenderCounting.GetCountedTenderDetailAmountClientRequest;
    export import GetCountedTenderDetailAmountClientResponse = Commerce.TenderCounting.GetCountedTenderDetailAmountClientResponse;
    export import GetDenominationTotalsClientRequest = Commerce.GetDenominationTotalsClientRequest;
    export import GetDenominationTotalsClientResponse = Commerce.GetDenominationTotalsClientResponse;
    export import GetOfflinePendingTransactionCountClientRequest = Commerce.GetOfflinePendingTransactionCountClientRequest;
    export import GetOfflinePendingTransactionCountClientResponse = Commerce.GetOfflinePendingTransactionCountClientResponse;
    export import GetPickingAndReceivingOrdersClientRequest = Commerce.StoreOperations.GetPickingAndReceivingOrdersClientRequest;
    export import GetPickingAndReceivingOrdersClientResponse = Commerce.StoreOperations.GetPickingAndReceivingOrdersClientResponse;
    export import GetReportParametersClientRequest = Commerce.GetReportParametersClientRequest;
    export import GetReportParametersClientResponse = Commerce.GetReportParametersClientResponse;
    export import GetSalesOrdersWithNoFiscalTransactionsRequest = Commerce.GetSalesOrdersWithNoFiscalTransactionsRequest;
    export import GetSalesOrdersWithNoFiscalTransactionsResponse = Commerce.GetSalesOrdersWithNoFiscalTransactionsResponse;
    export import GetStartingAmountClientRequest = Commerce.CashManagement.GetStartingAmountClientRequest;
    export import GetStartingAmountClientResponse = Commerce.CashManagement.GetStartingAmountClientResponse;
    export import GetTenderDetailsClientRequest = Commerce.GetTenderDetailsClientRequest;
    export import GetTenderDetailsClientResponse = Commerce.GetTenderDetailsClientResponse;
    export import RegisterCustomAuditEventClientRequest = Commerce.RegisterCustomAuditEventClientRequest;
    export import RegisterCustomAuditEventClientResponse = Commerce.RegisterCustomAuditEventClientResponse;
    export import SaveFiscalTransactionClientRequest = Commerce.SaveFiscalTransactionClientRequest;
    export import SaveFiscalTransactionClientResponse = Commerce.SaveFiscalTransactionClientResponse;
    export import SelectZipCodeInfoClientRequest = Commerce.SelectZipCodeInfoClientRequest;
    export import SelectZipCodeInfoClientResponse = Commerce.SelectZipCodeInfoClientResponse;
    export import BankDropOperationRequest = Commerce.BankDropOperationRequest;
    export import BankDropOperationResponse = Commerce.BankDropOperationResponse;
    export import DeclareStartAmountOperationRequest = Commerce.DeclareStartAmountOperationRequest;
    export import DeclareStartAmountOperationResponse = Commerce.DeclareStartAmountOperationResponse;
    export import IssueLoyaltyCardOperationRequest = Commerce.IssueLoyaltyCardOperationRequest;
    export import IssueLoyaltyCardOperationResponse = Commerce.IssueLoyaltyCardOperationResponse;
    export import LoyaltyCardPointsBalanceOperationRequest = Commerce.LoyaltyCardPointsBalanceOperationRequest;
    export import LoyaltyCardPointsBalanceOperationResponse = Commerce.LoyaltyCardPointsBalanceOperationResponse;
    export import SafeDropOperationRequest = Commerce.SafeDropOperationRequest;
    export import SafeDropOperationResponse = Commerce.SafeDropOperationResponse;
    export import TenderDeclarationOperationRequest = Commerce.TenderDeclarationOperationRequest;
    export import TenderDeclarationOperationResponse = Commerce.TenderDeclarationOperationResponse;
    export import TenderRemovalOperationRequest = Commerce.TenderRemovalOperationRequest;
    export import TenderRemovalOperationResponse = Commerce.TenderRemovalOperationResponse;
    export import CreateNonSalesTransactionServiceRequest = Commerce.CreateNonSalesTransactionServiceRequest;
    export import CreateNonSalesTransactionServiceResponse = Commerce.CreateNonSalesTransactionServiceResponse;
    export import GetCommissionSalesGroupsServiceRequest = Commerce.GetCommissionSalesGroupsServiceRequest;
    export import GetCommissionSalesGroupsServiceResponse = Commerce.GetCommissionSalesGroupsServiceResponse;
    export import GetCurrenciesServiceRequest = Commerce.GetCurrenciesServiceRequest;
    export import GetCurrenciesServiceResponse = Commerce.GetCurrenciesServiceResponse;
    export import GetSrsReportDataSetServiceRequest = Commerce.Reports.GetSrsReportDataSetServiceRequest;
    export import GetSrsReportDataSetServiceResponse = Commerce.Reports.GetSrsReportDataSetServiceResponse;
    export import SearchCommissionSalesGroupsServiceRequest = Commerce.SearchCommissionSalesGroupsServiceRequest;
    export import SearchCommissionSalesGroupsServiceResponse = Commerce.SearchCommissionSalesGroupsServiceResponse;
}
declare module "PosApi/Framework/Runtime" {
    export import IRuntime = Commerce.IRuntime;
}
declare module "PosApi/Framework/Logging" {
    /**
     * Type interface for the logger used by POS extensions.
     */
    export interface IExtensionLogger {
        /**
         * Logs a diagnostic event with a 'Verbose' event level.
         * @param {string} message The human-readable event message.
         * @param {string} [correlationId] The correlation identifier.
         * @param {string} [additionalParameter] An additional parameter to add to the logged event, if any.
         * @returns {string} The correlation identifier.
         */
        logVerbose(message: string, correlationId?: string, additionalParameter?: string): string;
        /**
         * Logs a diagnostic event using on the specified event information with a 'Informational' event level.
         * @param {string} message The human-readable event message.
         * @param {string} [correlationId] The correlation identifier.
         * @param {string} [additionalParameter] An additional parameter to add to the logged event, if any.
         * @returns {string} The correlation identifier.
         */
        logInformational(message: string, correlationId?: string, additionalParameter?: string): string;
        /**
         * Logs a diagnostic event using on the specified event information with a 'Warning' event level.
         * @param {string} message The human-readable event message.
         * @param {string} [correlationId] The correlation identifier.
         * @param {string} [additionalParameter] An additional parameter to add to the logged event, if any.
         * @returns {string} The correlation identifier.
         */
        logWarning(message: string, correlationId?: string, additionalParameter?: string): string;
        /**
         * Logs a diagnostic event using on the specified event information with a 'Error' event level.
         * @param {string} message The human-readable event message.
         * @param {string} [correlationId] The correlation identifier.
         * @param {string} [additionalParameter] An additional parameter to add to the logged event, if any.
         * @returns {string} The correlation identifier.
         */
        logError(message: string, correlationId?: string, additionalParameter?: string): string;
        /**
         * Logs a diagnostic event using on the specified event information with a 'Critical' event level.
         * @param {string} message The human-readable event message.
         * @param {string} [correlationId] The correlation identifier.
         * @param {string} [additionalParameter] An additional parameter to add to the logged event, if any.
         * @returns {string} The correlation identifier.
         */
        logCriticalError(message: string, correlationId?: string, additionalParameter?: string): string;
        /**
         * Gets a new correlation id.
         * @return {string} The new correlation id.
         */
        getNewCorrelationId(): string;
    }
}
declare module "PosApi/Framework/Navigation" {
    import { ClientEntities } from "PosApi/Entities";
    /**
     * The names of the views which support navigation without parameters.
     * @remarks Navigating without parameters is deprecated.
     */
    export type VoidNavigationViewName = "CartView" | "HomeView";
    /**
     * POS views and options map.
     */
    export interface NavigationParametersMap {
        "CartView": ClientEntities.CartViewNavigationParameters;
        "CustomerDetailsView": ClientEntities.CustomerDetailsNavigationParameters;
        "HomeView": ClientEntities.HomeViewNavigationParameters;
        "InventoryLookupView": ClientEntities.InventoryLookupNavigationParameters;
        "SearchView": ClientEntities.SearchNavigationParameters;
        "SearchOrdersView": ClientEntities.SearchOrdersNavigationParameters;
        "SimpleProductDetailsView": ClientEntities.SimpleProductDetailsNavigationParameters;
    }
    /**
     * The type interface for the navigator provided by POS.
     */
    export interface INavigator {
        /**
         * Navigate to POS core view.
         * @param {K | VoidNavigationViewName} viewName The name of the view to which to navigate.
         * @param {NavigationParametersMap[K]} options The options used to initalize the next view.
         * @remarks The void navigation overload signature is deprecated. It is recommended to provide the navigation parameters when navigating.
         */
        navigateToPOSView(viewName: VoidNavigationViewName): void;
        navigateToPOSView<K extends keyof NavigationParametersMap>(viewName: K, options: NavigationParametersMap[K]): void;
        /**
         * Navigate to extension view.
         * @param {string} viewName The name of the view to which to navigate.
         * @param {any} [options] The options used to initalize the next view.
         */
        navigate(viewName: string, options?: any): void;
        /**
         * Navigate back to previous page.
         * @param {string} [correlationId] The correlation identifier used to match different POS events within the same flow of execution.
         */
        navigateBack(correlationId?: string): void;
    }
}
declare module "PosApi/Framework/ControlFactory" {
    export import IControlFactory = Commerce.Extensibility.IControlFactory;
}
declare module "PosApi/Framework/ExtensionContext" {
    import { IRuntime } from "PosApi/Framework/Runtime";
    import { IExtensionLogger } from "PosApi/Framework/Logging";
    import { INavigator } from "PosApi/Framework/Navigation";
    import { IControlFactory } from "PosApi/Framework/ControlFactory";
    export import IExtensibleEnumerationManager = Commerce.ExtensibleEnumerations.IExtensibleEnumerationManager;
    export import IExtensionPackageConfig = Commerce.Extensibility.IExtensionPackageConfig;
    export import IExtensionPackageInfo = Commerce.Extensibility.IExtensionPackageInfo;
    /**
     * Interface for extension resource manager.
     */
    export interface IExtensionResourceManager {
        getString(stringId: string): string;
        getCurrentCulture(): string;
        getCurrentUICulture(): string;
    }
    /**
     * Represents the base type interface for the context object passed to all extensions.
     */
    export interface IExtensionContextBase {
        logger: IExtensionLogger;
        extensionPackageInfo: IExtensionPackageInfo;
        resources: IExtensionResourceManager;
    }
    /**
     * Represents the type interface for the context object passed to all POS extensions.
     */
    export interface IExtensionContext extends IExtensionContextBase {
        runtime: IRuntime;
        extensibleEnumerationManager: IExtensibleEnumerationManager;
        navigator: INavigator;
    }
    /**
     * Represents the type interface for the context object passed to all dual display extensions.
     */
    export interface IDualDisplayExtensionContext extends IExtensionContextBase {
    }
    /**
     * Represents the type interface for the control factory portion of extension contexts.
     */
    export interface IExtensionControlFactoryContext {
        controlFactory: IControlFactory;
    }
}
declare module "PosApi/Create/Controls" {
    import { IExtensionContext, IExtensionControlFactoryContext } from "PosApi/Framework/ExtensionContext";
    export interface IControlContext extends IExtensionContext, IExtensionControlFactoryContext {
    }
    /**
     * Represents a POS Controls.
     */
    export abstract class ExtensionControlBase {
        protected readonly context: IControlContext;
        constructor(context: IControlContext);
    }
}
declare module "PosApi/Create/Dialogs" {
    import { IExtensionContext, IExtensionControlFactoryContext } from "PosApi/Framework/ExtensionContext";
    import { ClientEntities } from "PosApi/Entities";
    import { INumPadInputBroker } from "PosApi/Consume/Peripherals";
    export import IDialogButton = Commerce.Client.Entities.Dialogs.IDialogButton;
    export import IDialogClickButton = Commerce.Client.Entities.Dialogs.IDialogClickButton;
    export import IDialogOptions = Commerce.Client.Entities.Dialogs.IDialogOptions;
    export import ITemplatedDialogOptions = Commerce.Client.Entities.Dialogs.ITemplatedDialogOptions;
    export import INumPadContainer = Commerce.Peripherals.INumPadContainer;
    export interface ITemplatedDialogContext extends IExtensionContext, IExtensionControlFactoryContext {
    }
    /**
     * Represents template dialog.
     * Dialog renders template with context provided.
     * On result it returns context back with updated values if any.
     */
    export abstract class ExtensionTemplatedDialogBase implements INumPadContainer {
        /**
         * Capture or not the global input for NumPad when typing.
         */
        captureGlobalInputForNumPad: boolean;
        protected readonly context: ITemplatedDialogContext;
        private _templatedDialogContext;
        private _createTemplatedDialogProxyControl;
        private _proxyControl;
        private _onBarcodeScanned;
        private _onMsrSwiped;
        private _isOpen;
        constructor();
        /**
         * Gets the numpad input broker which serves as publisher\subscriber between view's numpad and the peripheral layer.
         * @return {Commerce.Peripherals.NumPadInputBroker} The instance of the broker.
         */
        get numPadInputBroker(): INumPadInputBroker;
        /**
         * Gets the handler for bacode scanner when it reads a barcode.
         * @returns {(barcode: string) => void} The barcode scanned handler.
         */
        get onBarcodeScanned(): (barcode: string) => void;
        /**
         * Sets the handler for bacode scanner when it reads a barcode.
         * @remarks Derived classes should set the handler on its constructor.
         */
        set onBarcodeScanned(impl: (barcode: string) => void);
        /**
         * Gets the handler for magnetic stripe reader when a card is swiped.
         * @returns {(cardInfo: ClientEntities.ICardInfo) => void} The MSR swiped handler.
         */
        get onMsrSwiped(): (cardInfo: ClientEntities.ICardInfo) => void;
        /**
         * Sets the handler for magnetic stripe reader when a card is swiped.
         * @remarks Derived classes should set the handler on its constructor to handle MSR Swipe.
         */
        set onMsrSwiped(impl: (cardInfo: ClientEntities.ICardInfo) => void);
        /**
         * Sets the modal dialog indeterminate wait visibility value.
         */
        set isProcessing(visible: boolean);
        /**
         * Called when the dialog element is ready.
         * @param {HTMLElement} element The DOM element.
         */
        abstract onReady(element: HTMLElement): void;
        /**
         * Opens POS dialog control.
         * Method should be called by dialog extension and pass necessary parameters.
         * @param {ITemplatedDialogOptions} dialogOptions Dialog options.
         */
        protected openDialog(dialogOptions: ITemplatedDialogOptions): void;
        /**
         * Closes POS dialog control.
         */
        protected closeDialog(): void;
        /**
         * Disable modal dialog button using id.
         * @param {string} buttonId Button id.
         * @param {boolean} disabled Disabled state.
         */
        protected setButtonDisabledState(buttonId: string, disabled: boolean): void;
    }
}
declare module "PosApi/Create/RequestHandlers" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    export import AbstractRequestType = Commerce.AbstractRequestType;
    export import RequestType = Commerce.RequestType;
    export import Request = Commerce.Request;
    export import Response = Commerce.Response;
    export import RequestHandler = Commerce.RequestHandler;
    /**
     * Context interface for extension request handlers.
     */
    export interface IExtensionRequestHandlerContext extends IExtensionContext {
    }
    /**
     * Represents the base class for new extension requests.
     * @remarks All extension requests should derive from this class.
     */
    export abstract class ExtensionRequestBase<TResponse extends Response> extends Request<TResponse> {
        /**
         * Creates a new instance of the ExtensionRequestBase class.
         * @param {string} [correlationId] The identifier used to correlate events related to this request.
         */
        constructor(correlationId?: string);
    }
    /**
     * The extension request type to enforce having default constructor.
     */
    export type ExtensionRequestType<TResponse extends Response> = {
        new (...args: any[]): ExtensionRequestBase<TResponse>;
    } & AbstractRequestType<TResponse>;
    /**
     * Represents the base class for all extension request handlers.
     */
    export abstract class ExtensionRequestHandlerBase<TResponse extends Response> extends RequestHandler<TResponse> {
        protected readonly context: IExtensionRequestHandlerContext;
        /**
         * Creates a new instance of the ExtensionRequestHandlerBase class.
         * @param {IExtensionRequestHandlerContext} context
         */
        constructor(context: IExtensionRequestHandlerContext);
        /**
         * Gets the supported request type.
         * @return {ExtensionRequestType<TResponse>} The supported abstract or concrete operation request type.
         */
        abstract supportedRequestType(): ExtensionRequestType<TResponse>;
    }
}
declare module "PosApi/Create/Operations" {
    import { Response, AbstractRequestType, RequestHandler } from "PosApi/Create/RequestHandlers";
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    import { ClientEntities } from "PosApi/Entities";
    import OperationRequest = Commerce.OperationRequest;
    export import ExtensionOperationRequestBase = Commerce.Extensibility.ExtensionOperationRequestBase;
    /**
     * Context interface for new operation extensions.
     */
    export interface IOperationContext extends IExtensionContext {
    }
    /**
     * The operation request type to enforce having default constructor.
     */
    export type ExtensionOperationRequestType<TResponse extends Response> = {
        new (...args: any[]): ExtensionOperationRequestBase<TResponse>;
    } & AbstractRequestType<TResponse>;
    /**
     * Represents the interface for factory function instances.
     */
    export type ExtensionOperationRequestFactoryFunctionType<TResponse extends Response> = ((context: IOperationContext, operationId: number, actionParameters: string[], correlationId: string) => Promise<ClientEntities.ICancelableDataResult<ExtensionOperationRequestBase<TResponse>>>);
    /**
     * Base class for operation request handler extension.
     */
    export abstract class ExtensionOperationRequestHandlerBase<TResponse extends Response> extends RequestHandler<TResponse> {
        protected readonly context: IOperationContext;
        constructor(context: IOperationContext);
        /**
         * Gets the supported request type.
         * @return {ExtensionOperationRequestType<TResponse>} The supported abstract or concrete operation request type.
         */
        abstract supportedRequestType(): ExtensionOperationRequestType<TResponse>;
        /**
         * Executes the request handler asynchronously.
         * @param {OperationRequest<TResponse>} request The operation request.
         * @return {Promise<ClientEntities.ICancelableDataResult<TResponse>>} The cancelable result containing the response.
         */
        abstract executeAsync(request: OperationRequest<TResponse>): Promise<ClientEntities.ICancelableDataResult<TResponse>>;
    }
}
declare module "PosApi/Framework/Messaging" {
    export import IMessageChannelEndpoint = Commerce.Messaging.IMessageChannelEndpoint;
}
declare module "PosApi/Create/Views" {
    import { INumPadInputBroker } from "PosApi/Consume/Peripherals";
    import { ClientEntities } from "PosApi/Entities";
    import { IExtensionContext, IExtensionControlFactoryContext } from "PosApi/Framework/ExtensionContext";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    export import INumPadContainer = Commerce.Peripherals.INumPadContainer;
    /**
     * Type interface for the context object provided to the constructor of all extension view controllers.
     * @deprecated Please extend CustomViewControllerBase instead of extending this class. Extending this class is no
     * longer supported in the independent packaging model.
     */
    export interface IExtensionViewControllerContext extends IExtensionContext, IExtensionControlFactoryContext {
    }
    /**
     * Represents the base class for all extension view controllers.
     * @remarks All extension view controllers should derive from this class.
     * @deprecated Please extend CustomViewControllerBase instead of extending this class. Extending this class is no
     * longer supported in the independent packaging model.
     */
    export abstract class ExtensionViewControllerBase extends Commerce.Extensibility.DisposableViewControllerBase implements Commerce.Extensibility.IViewController, INumPadContainer {
        /**
         * Capture or not the global input for NumPad when typing.
         */
        captureGlobalInputForNumPad: boolean;
        protected readonly context: IExtensionViewControllerContext;
        /**
         * The handler for bacode scanner when it reads a barcode.
         * @remarks Derived classes should set the handler on its constructor.
         */
        protected onBarcodeScanned: (barcode: string) => void;
        /**
         * The handler for magnetic stripe reader when a card is swiped.
         * @remarks Derived classes should set the handler on its constructor.
         */
        protected onMsrSwiped: (cardInfo: ClientEntities.ICardInfo) => void;
        private _numPadInputBroker;
        /**
         * Base controller constructor.
         * @param {IExtensionViewControllerContext} context View context.
         * @param {boolean} saveInHistory Allows multiple instances of the same view to be saved in history seqientially.
         *  Example: Categories view for drill down feature.
         */
        constructor(context: IExtensionViewControllerContext, saveInHistory: boolean);
        /**
         * Gets the numpad input broker which serves as publisher\subscriber between view's numpad and the peripheral layer.
         * @return {Commerce.Peripherals.NumPadInputBroker} The instance of the broker.
         */
        get numPadInputBroker(): INumPadInputBroker;
    }
    /**
     * The interface to use for marking UI components as being an endpoint for barcode scans.
     */
    export import IBarcodeScannerEndpoint = Commerce.Extensibility.IBarcodeScannerEndpoint;
    /**
     * The interface to use for marking UI components as being an endpoint for magnetic stripe reads.
     */
    export import IMagneticStripeReaderEndpoint = Commerce.Extensibility.IMagneticStripeReaderEndpoint;
    /**
     * The interface to use for marking UI components as being an endpoint for numpad input.
     */
    export import INumPadInputSubscriberEndpoint = Commerce.Extensibility.INumPadInputSubscriberEndpoint;
    /**
     * Type interface representing the arguments provided to a command's execute function.
     */
    export import CustomViewControllerExecuteCommandArgs = Commerce.Extensibility.CustomViewControllerExecuteCommandArgs;
    /**
     * Type representing the name of an icon.
     */
    export import IconName = Commerce.ViewModels.IconName;
    /**
     * Enum containing the list of supported icons.
     */
    export import Icons = Commerce.ViewModels.Icons;
    /**
     * Type interface representing a command definition.
     */
    export interface ICommandDefinition extends Commerce.Extensibility.ICommandDefinition {
        /**
         * The command's execute implementation.
         * @param {CustomViewControllerExecuteCommandArgs} args The command execution arguments.
         */
        readonly execute: (args: CustomViewControllerExecuteCommandArgs) => void;
    }
    /**
     * Type interface representing the command bar configuration.
     */
    export interface ICommandBarConfiguration {
        readonly commands: ICommandDefinition[];
    }
    /**
     * Type interface representing a custom view controller configuration.
     */
    export interface ICustomViewControllerConfiguration {
        readonly title: string;
        readonly commandBar?: ICommandBarConfiguration;
    }
    /**
     * The base class that custom view controllers implement.
     */
    export abstract class CustomViewControllerBase implements Commerce.Extensibility.ICustomViewController, Commerce.IDisposable {
        readonly state: ICustomViewControllerBaseState;
        protected readonly context: ICustomViewControllerContext;
        constructor(context: ICustomViewControllerContext, config?: Readonly<ICustomViewControllerConfiguration>);
        /**
         * Called when the object is disposed.
         */
        abstract dispose(): void;
        /**
         * Called when the element of the page is ready.
         * @param {HTMLElement} element The HTML element.
         */
        abstract onReady(element: HTMLElement): void;
        /**
         * Called when view is shown.
         */
        onShown(): void;
        /**
         * Called when view is hidden.
         */
        onHidden(): void;
    }
    /**
     * The outbound message type map for custome view controllers.
     */
    export import ICustomViewControllerOutboundTypeMap = Commerce.Extensibility.ICustomViewControllerOutboundTypeMap;
    /**
     * The inbound message type map for custome view controllers.
     */
    export import ICustomViewControllerInboundTypeMap = Commerce.Extensibility.ICustomViewControllerInboundTypeMap;
    /**
     * The context for custom view controllers.
     */
    export interface ICustomViewControllerContext extends IExtensionContext, IExtensionControlFactoryContext {
        readonly messageChannel: IMessageChannelEndpoint<ICustomViewControllerOutboundTypeMap, ICustomViewControllerInboundTypeMap>;
    }
    /**
     * Type interface representing the state of a command.
     */
    export import ICommand = Commerce.Extensibility.ICommand;
    /**
     * Type interface representing a views command bar state.
     */
    export import ICommandBar = Commerce.Extensibility.ICommandBar;
    /**
     * The state for custom view controllers.
     */
    export import ICustomViewControllerBaseState = Commerce.Extensibility.ICustomViewControllerBaseState;
}
declare module "PosApi/Extend/Views/CustomControls" {
    import { IExtensionContext, IExtensionControlFactoryContext } from "PosApi/Framework/ExtensionContext";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    export import ICustomControlToViewMessageTypeMap = Commerce.Extensibility.ICustomControlToViewMessageTypeMap;
    export import IViewToCustomControlMessageTypeMap = Commerce.Extensibility.IViewToCustomControlMessageTypeMap;
    export import ICustomControl = Commerce.Extensibility.ICustomControl;
    /**
     * Represents the custom control context. It contains message channel it will use to communicate with POS.
     */
    export interface ICustomControlContext<TExtToPageMap extends ICustomControlToViewMessageTypeMap, TPageToExtMap extends IViewToCustomControlMessageTypeMap> extends IExtensionContext, IExtensionControlFactoryContext {
        messageChannel: IMessageChannelEndpoint<TExtToPageMap, TPageToExtMap>;
    }
    /**
     * The base class for all custom controls.
     * @remarks Custom controls in extensions should not directly inherit from this class. Instead custom controls should inherit from the derived class
     * for the page to be extended.
     */
    export abstract class CustomControlBase<TExtToPage extends ICustomControlToViewMessageTypeMap, TPageToExtMap extends IViewToCustomControlMessageTypeMap> implements ICustomControl {
        protected readonly context: ICustomControlContext<TExtToPage, TPageToExtMap>;
        private _isProcessing;
        private readonly _id;
        /**
         * Creates a new instance of the CustomControlBase class.
         * @param {string} id The control identifier.
         * @param {ICustomControlContext<TExtToPage, TPageToExtMap>} context The custom control context.
         */
        constructor(id: string, context: ICustomControlContext<TExtToPage, TPageToExtMap>);
        /**
         * Gets the control's identifier.
         * @returns {string} The identifier.
         */
        get id(): string;
        /**
         * Gets a value indicating whether or not the custom control is processing.
         * @return {boolean} True if the custom control is processing. False otherwise.
         */
        protected get isProcessing(): boolean;
        /**
         * Sets a value indicating whether or not the custom control is processing.
         * @param {boolean} value True if the custom control is processing. False otherwise.
         */
        protected set isProcessing(value: boolean);
        /**
         * Called when the control element is ready.
         * @param {HTMLElement} element The DOM element.
         */
        abstract onReady(element: HTMLElement): void;
        /**
         * Disposes the control releasing its resources.
         */
        dispose(): void;
        /**
         * Initializes the control.
         * @param {TPageToExtMap["Initialize"]} context The custom control state.
         */
        protected abstract init(state: TPageToExtMap["Initialize"]): void;
    }
}
declare module "PosApi/Extend/DualDisplay" {
    import { IDualDisplayExtensionContext, IExtensionControlFactoryContext } from "PosApi/Framework/ExtensionContext";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ICustomControl } from "PosApi/Extend/Views/CustomControls";
    export import DualDisplayExtensionTypes = Commerce.Extensibility.DualDisplayExtensionTypes;
    export import IDualDisplayToCustomControlMessageTypeMap = Commerce.Extensibility.DualDisplayExtensionTypes.IDualDisplayToCustomControlMessageTypeMap;
    export import ICustomControlToDualDisplayMessageTypeMap = Commerce.Extensibility.DualDisplayExtensionTypes.ICustomControlToDualDisplayMessageTypeMap;
    export import IDualDisplayCustomControlState = Commerce.Extensibility.DualDisplayExtensionTypes.IDualDisplayCustomControlState;
    export import CartChangedData = Commerce.Extensibility.DualDisplayExtensionTypes.CartChangedData;
    export import CustomerChangedData = Commerce.Extensibility.DualDisplayExtensionTypes.CustomerChangedData;
    export import DualDisplayConfigurationChangedData = Commerce.Extensibility.DualDisplayExtensionTypes.DualDisplayConfigurationChangedData;
    export import LogOnStatusChangedData = Commerce.Extensibility.DualDisplayExtensionTypes.LogOnStatusChangedData;
    /**
     * Represents the dual display custom control context. It contains the message channel it will use to communicate with POS.
     */
    export interface IDualDisplayCustomControlContext extends IDualDisplayExtensionContext, IExtensionControlFactoryContext {
        messageChannel: IMessageChannelEndpoint<ICustomControlToDualDisplayMessageTypeMap, IDualDisplayToCustomControlMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension controls on the cart page.
     * @remarks Custom controls in extensions should derive from this class.
     */
    export abstract class DualDisplayCustomControlBase implements ICustomControl {
        protected readonly context: IDualDisplayCustomControlContext;
        /**
         * The handler for the cart changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "CartChanged" message is received.
         */
        protected cartChangedHandler: (data: DualDisplayExtensionTypes.CartChangedData) => void;
        /**
         * The handler for the customer changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "CustomerChanged" message is received.
         */
        protected customerChangedHandler: (data: DualDisplayExtensionTypes.CustomerChangedData) => void;
        /**
         * The handler for the dual display configuration changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "dualDisplayConfigurationChanged" message is received.
         */
        protected dualDisplayConfigurationChangedHandler: (data: DualDisplayExtensionTypes.DualDisplayConfigurationChangedData) => void;
        /**
         * The handler for the log on status changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "LogOnStatusChangedData" message is received.
         */
        protected logOnStatusChangedHandler: (data: DualDisplayExtensionTypes.LogOnStatusChangedData) => void;
        private readonly _id;
        private _isProcessing;
        /**
         * Creates a new instance of the DualDisplayCustomControlBase class.
         * @param {string} id The control identifier.
         * @param {ICartViewCustomControlContext} context The control context.
         */
        constructor(id: string, context: IDualDisplayCustomControlContext);
        /**
         * Gets the control's identifier.
         * @returns {string} The identifier.
         */
        get id(): string;
        /**
         * Called when the control element is ready.
         * @param {HTMLElement} element The DOM element.
         */
        abstract onReady(element: HTMLElement): void;
        /**
         * Disposes the control releasing its resources.
         */
        dispose(): void;
        /**
         * Initializes the custom control.
         * @param {IDualDisplayCustomControlState} state The initial state for the custom control.
         */
        protected abstract init(state: IDualDisplayCustomControlState): void;
        /**
         * Gets a value indicating whether or not the dual display custom control is processing.
         * @return {boolean} True if the dual display custom control is processing. False otherwise.
         */
        protected get isProcessing(): boolean;
        /**
         * Sets a value indicating whether or not the dual display custom control is processing.
         * @param {boolean} value True if the dual display custom control is processing. False otherwise.
         */
        protected set isProcessing(value: boolean);
    }
}
declare module "PosApi/Extend/RequestHandlers/RequestHandlers" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    import { ClientEntities } from "PosApi/Entities";
    import Request = Commerce.Request;
    import Response = Commerce.Response;
    import RequestHandler = Commerce.RequestHandler;
    export interface IReplacementRequestHandlerContext extends IExtensionContext {
    }
    /**
     * Represents the base for a asynchronous replacement request handler.
     */
    export abstract class ReplacementRequestHandlerBase<TRequest extends Request<TResponse>, TResponse extends Response> extends RequestHandler<TResponse> {
        protected readonly context: IReplacementRequestHandlerContext;
        /**
         * Creates a new instance of the ExtensionRequestHandlerBase class.
         * @param {IExtensionRequestHandlerContext} context
         */
        constructor(context: IReplacementRequestHandlerContext);
        /**
         * Executes the request handler asynchronously.
         * @param {Request<TResponse>} request The request.
         * @return {Promise<Client.Entities.ICancelableDataResult<TResponse>>} The promise with a cancelable result containing the response.
         */
        abstract executeAsync(request: TRequest): Promise<ClientEntities.ICancelableDataResult<TResponse>>;
        /**
         * Executes the default request handler asynchronously.
         * @param {Request<TResponse>} request The request.
         * @return {Promise<Client.Entities.ICancelableDataResult<TResponse>>} The promise with a cancelable result containing the response.
         */
        protected defaultExecuteAsync(request: TRequest): Promise<ClientEntities.ICancelableDataResult<TResponse>>;
    }
}
declare module "PosApi/Extend/RequestHandlers/CartRequestHandlers" {
    import { ReplacementRequestHandlerBase } from "PosApi/Extend/RequestHandlers/RequestHandlers";
    import { AbstractRequestType } from "PosApi/Create/RequestHandlers";
    import { AddTenderLineToCartClientRequest, AddTenderLineToCartClientResponse, GetKeyedInPriceClientRequest, GetKeyedInPriceClientResponse, GetKeyedInQuantityClientRequest, GetKeyedInQuantityClientResponse, GetPickupDateClientRequest, GetPickupDateClientResponse, GetShippingDateClientRequest, GetShippingDateClientResponse, ShowChangeDueClientRequest, ShowChangeDueClientResponse, GetReceiptEmailAddressClientRequest, GetReceiptEmailAddressClientResponse, DepositOverrideOperationRequest, DepositOverrideOperationResponse, GetShippingChargeClientRequest, GetShippingChargeClientResponse } from "PosApi/Consume/Cart";
    /**
     * Represents the base class for all replacement for AddTenderLineToCartClientRequestHandler.
     * @remarks All replacement for AddTenderLineToCartClientRequestHandler should derive from this class.
     */
    export abstract class AddTenderLineToCartClientRequestHandler extends ReplacementRequestHandlerBase<AddTenderLineToCartClientRequest<AddTenderLineToCartClientResponse>, AddTenderLineToCartClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<AddTenderLineToCartClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<AddTenderLineToCartClientResponse>;
    }
    /**
     * Represents the base class for all replacement for GetKeyedInPriceClientRequestHandler.
     * @remarks All replacement for GetKeyedInPriceClientRequestHandler should derive from this class.
     */
    export abstract class GetKeyedInPriceClientRequestHandler extends ReplacementRequestHandlerBase<GetKeyedInPriceClientRequest<GetKeyedInPriceClientResponse>, GetKeyedInPriceClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetKeyedInPriceClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetKeyedInPriceClientResponse>;
    }
    /**
     * Represents the base class for all replacement for GetKeyedInQuantityClientRequestHandler.
     * @remarks All replacement for GetKeyedInQuantityClientRequestHandler should derive from this class.
     */
    export abstract class GetKeyedInQuantityClientRequestHandler extends ReplacementRequestHandlerBase<GetKeyedInQuantityClientRequest<GetKeyedInQuantityClientResponse>, GetKeyedInQuantityClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetKeyedInQuantityClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetKeyedInQuantityClientResponse>;
    }
    /**
     * Represents the base class for all replacement for GetPickupDateClientRequestHandler.
     * @remarks All replacement for GetPickupDateClientRequestHandler should derive from this class.
     */
    export abstract class GetPickupDateClientRequestHandler extends ReplacementRequestHandlerBase<GetPickupDateClientRequest<GetPickupDateClientResponse>, GetPickupDateClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetPickupDateClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetPickupDateClientResponse>;
    }
    /**
     * Represents the base class for all replacement for GetShippingDateClientRequestHandler.
     * @remarks All replacement for GetShippingDateClientRequestHandler should derive from this class.
     */
    export abstract class GetShippingDateClientRequestHandler extends ReplacementRequestHandlerBase<GetShippingDateClientRequest<GetShippingDateClientResponse>, GetShippingDateClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetShippingDateClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetShippingDateClientResponse>;
    }
    /**
     * Represents the base class for all replacement for ShowChangeDueClientRequestHandler.
     * @remarks All replacement for ShowChangeDueClientRequestHandler should derive from this class.
     */
    export abstract class ShowChangeDueClientRequestHandler extends ReplacementRequestHandlerBase<ShowChangeDueClientRequest, ShowChangeDueClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<ShowChangeDueClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<ShowChangeDueClientResponse>;
    }
    /**
     * Represents the base class for all replacement GetReceiptEmailAddressClientRequestHandler.
     * @remarks All replacement GetReceiptEmailAddressClientRequestHandler should derive from this class.
     */
    export abstract class GetReceiptEmailAddressClientRequestHandler extends ReplacementRequestHandlerBase<GetReceiptEmailAddressClientRequest<GetReceiptEmailAddressClientResponse>, GetReceiptEmailAddressClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetReceiptEmailAddressClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetReceiptEmailAddressClientResponse>;
    }
    /**
     * Represents the base class for all replacement DepositOverrideOperationRequestHandler.
     * @remarks All replacement DepositOverrideOperationRequestHandler should derive from this class.
     */
    export abstract class DepositOverrideOperationRequestHandler extends ReplacementRequestHandlerBase<DepositOverrideOperationRequest<DepositOverrideOperationResponse>, DepositOverrideOperationResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<DepositOverrideOperationResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<DepositOverrideOperationResponse>;
    }
    /**
     * Represents the base class for all replacement for GetShippingChargeClientRequestHandler.
     * @remarks All replacement for GetShippingChargeClientRequestHandler should derive from this class.
     */
    export abstract class GetShippingChargeClientRequestHandler extends ReplacementRequestHandlerBase<GetShippingChargeClientRequest<GetShippingChargeClientResponse>, GetShippingChargeClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetShippingChargeClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetShippingChargeClientResponse>;
    }
}
declare module "PosApi/Extend/RequestHandlers/PaymentRequestHandlers" {
    import { ReplacementRequestHandlerBase } from "PosApi/Extend/RequestHandlers/RequestHandlers";
    import { AbstractRequestType } from "PosApi/Create/RequestHandlers";
    import { GetGiftCardByIdServiceRequest, GetGiftCardByIdServiceResponse } from "PosApi/Consume/Payments";
    import { GetPaymentCardTypeByBinRangeClientRequest, GetPaymentCardTypeByBinRangeClientResponse } from "PosApi/Consume/Payments";
    /**
     * Represents the base class for all replacement GetGiftCardByIdServiceRequestHandler.
     * @remarks All replacement GetGiftCardByIdServiceRequestHandler should derive from this class.
     */
    export abstract class GetGiftCardByIdServiceRequestHandler extends ReplacementRequestHandlerBase<GetGiftCardByIdServiceRequest<GetGiftCardByIdServiceResponse>, GetGiftCardByIdServiceResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetGiftCardByIdServiceResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetGiftCardByIdServiceResponse>;
    }
    /**
     * Represents the base class for all replacement GetPaymentCardTypeByBinRangeClientRequestHandler.
     * @remarks All replacement GetPaymentCardTypeByBinRangeClientRequestHandler should derive from this class.
     */
    export abstract class GetPaymentCardTypeByBinRangeClientRequestHandler extends ReplacementRequestHandlerBase<GetPaymentCardTypeByBinRangeClientRequest<GetPaymentCardTypeByBinRangeClientResponse>, GetPaymentCardTypeByBinRangeClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetPaymentCardTypeByBinRangeClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetPaymentCardTypeByBinRangeClientResponse>;
    }
}
declare module "PosApi/Extend/RequestHandlers/PeripheralsRequestHandlers" {
    import { ReplacementRequestHandlerBase } from "PosApi/Extend/RequestHandlers/RequestHandlers";
    import { AbstractRequestType } from "PosApi/Create/RequestHandlers";
    import { CardPaymentAuthorizeCardTokenPeripheralRequest, CardPaymentAuthorizeCardTokenPeripheralResponse, CardPaymentAuthorizePaymentRequest, CardPaymentAuthorizePaymentResponse, CardPaymentBeginTransactionRequest, CardPaymentBeginTransactionResponse, CardPaymentCapturePaymentRequest, CardPaymentCapturePaymentResponse, CardPaymentEndTransactionRequest, CardPaymentEndTransactionResponse, CardPaymentEnquireGiftCardBalancePeripheralRequest, CardPaymentEnquireGiftCardBalancePeripheralResponse, CardPaymentExecuteTaskRequest, CardPaymentExecuteTaskResponse, CardPaymentRefundPaymentRequest, CardPaymentRefundPaymentResponse, CardPaymentVoidPaymentRequest, CardPaymentVoidPaymentResponse, CashDrawerOpenRequest, CashDrawerOpenResponse, PaymentTerminalActivateGiftCardPeripheralRequest, PaymentTerminalActivateGiftCardPeripheralResponse, PaymentTerminalAddBalanceToGiftCardPeripheralRequest, PaymentTerminalAddBalanceToGiftCardPeripheralResponse, PaymentTerminalAuthorizePaymentActivityRequest, PaymentTerminalAuthorizePaymentActivityResponse, PaymentTerminalBeginTransactionRequest, PaymentTerminalBeginTransactionResponse, PaymentTerminalCancelOperationRequest, PaymentTerminalCancelOperationResponse, PaymentTerminalAuthorizePaymentRequest, PaymentTerminalAuthorizePaymentResponse, PaymentTerminalCapturePaymentRequest, PaymentTerminalCapturePaymentResponse, PaymentTerminalEndTransactionRequest, PaymentTerminalEndTransactionResponse, PaymentTerminalEnquireGiftCardBalancePeripheralRequest, PaymentTerminalEnquireGiftCardBalancePeripheralResponse, PaymentTerminalExecuteTaskRequest, PaymentTerminalExecuteTaskResponse, PaymentTerminalFetchTokenPeripheralRequest, PaymentTerminalFetchTokenPeripheralResponse, PaymentTerminalGetTransactionReferenceIdRequest, PaymentTerminalGetTransactionReferenceIdResponse, PaymentTerminalGetTransactionByTransactionReferenceRequest, PaymentTerminalGetTransactionByTransactionReferenceResponse, PaymentTerminalRefundPaymentActivityRequest, PaymentTerminalRefundPaymentActivityResponse, PaymentTerminalRefundPaymentRequest, PaymentTerminalRefundPaymentResponse, PaymentTerminalUpdateLinesRequest, PaymentTerminalUpdateLinesResponse, PaymentTerminalVoidPaymentRequest, PaymentTerminalVoidPaymentResponse } from "PosApi/Consume/Peripherals";
    /**
     * Represents the base class for all replacement CardPaymentAuthorizeCardTokenPeripheralRequestHandler.
     * @remarks All replacement CardPaymentAuthorizeCardTokenPeripheralRequestHandler should derive from this class.
     */
    export abstract class CardPaymentAuthorizeCardTokenPeripheralRequestHandler extends ReplacementRequestHandlerBase<CardPaymentAuthorizeCardTokenPeripheralRequest<CardPaymentAuthorizeCardTokenPeripheralResponse>, CardPaymentAuthorizeCardTokenPeripheralResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CardPaymentAuthorizeCardTokenPeripheralResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CardPaymentAuthorizeCardTokenPeripheralResponse>;
    }
    /**
     * Represents the base class for all replacement CardPaymentAuthorizePaymentRequestHandler.
     * @remarks All replacement CardPaymentAuthorizePaymentRequestHandler should derive from this class.
     */
    export abstract class CardPaymentAuthorizePaymentRequestHandler extends ReplacementRequestHandlerBase<CardPaymentAuthorizePaymentRequest<CardPaymentAuthorizePaymentResponse>, CardPaymentAuthorizePaymentResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CardPaymentAuthorizePaymentResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CardPaymentAuthorizePaymentResponse>;
    }
    /**
     * Represents the base class for all replacement CardPaymentCapturePaymentRequestHandler.
     * @remarks All replacement CardPaymentCapturePaymentRequestHandler should derive from this class.
     */
    export abstract class CardPaymentCapturePaymentRequestHandler extends ReplacementRequestHandlerBase<CardPaymentCapturePaymentRequest<CardPaymentCapturePaymentResponse>, CardPaymentCapturePaymentResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CardPaymentCapturePaymentResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CardPaymentCapturePaymentResponse>;
    }
    /**
     * Represents the base class for all replacement CardPaymentExecuteTaskRequestHandler.
     * @remarks All replacement CardPaymentExecuteTaskRequestHandler should derive from this class.
     */
    export abstract class CardPaymentExecuteTaskRequestHandler extends ReplacementRequestHandlerBase<CardPaymentExecuteTaskRequest<CardPaymentExecuteTaskResponse>, CardPaymentExecuteTaskResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CardPaymentExecuteTaskResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CardPaymentExecuteTaskResponse>;
    }
    /**
     * Represents the base class for all replacement CardPaymentRefundPaymentRequestHandler.
     * @remarks All replacement CardPaymentRefundPaymentRequestHandler should derive from this class.
     */
    export abstract class CardPaymentRefundPaymentRequestHandler extends ReplacementRequestHandlerBase<CardPaymentRefundPaymentRequest<CardPaymentRefundPaymentResponse>, CardPaymentRefundPaymentResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CardPaymentRefundPaymentResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CardPaymentRefundPaymentResponse>;
    }
    /**
     * Represents the base class for all replacement CardPaymentVoidPaymentRequestHandler.
     * @remarks All replacement CardPaymentVoidPaymentRequestHandler should derive from this class.
     */
    export abstract class CardPaymentVoidPaymentRequestHandler extends ReplacementRequestHandlerBase<CardPaymentVoidPaymentRequest<CardPaymentVoidPaymentResponse>, CardPaymentVoidPaymentResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CardPaymentVoidPaymentResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CardPaymentVoidPaymentResponse>;
    }
    /**
     * Represents the base class for all replacement CardPaymentBeginTransactionRequestHandler.
     * @remarks All replacement CardPaymentBeginTransactionRequestHandler should derive from this class.
     */
    export abstract class CardPaymentBeginTransactionRequestHandler extends ReplacementRequestHandlerBase<CardPaymentBeginTransactionRequest<CardPaymentBeginTransactionResponse>, CardPaymentBeginTransactionResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CardPaymentBeginTransactionResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CardPaymentBeginTransactionResponse>;
    }
    /**
     * Represents the base class for all replacement CardPaymentEndTransactionRequestHandler.
     * @remarks All replacement CardPaymentEndTransactionRequestHandler should derive from this class.
     */
    export abstract class CardPaymentEndTransactionRequestHandler extends ReplacementRequestHandlerBase<CardPaymentEndTransactionRequest<CardPaymentEndTransactionResponse>, CardPaymentEndTransactionResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CardPaymentEndTransactionResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CardPaymentEndTransactionResponse>;
    }
    /**
     * Represents the base class for all replacement CardPaymentEnquireGiftCardBalancePeripheralRequestHandler.
     * @remarks All replacement CardPaymentEnquireGiftCardBalancePeripheralRequestHandler should derive from this class.
     */
    export abstract class CardPaymentEnquireGiftCardBalancePeripheralRequestHandler extends ReplacementRequestHandlerBase<CardPaymentEnquireGiftCardBalancePeripheralRequest<CardPaymentEnquireGiftCardBalancePeripheralResponse>, CardPaymentEnquireGiftCardBalancePeripheralResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CardPaymentEnquireGiftCardBalancePeripheralResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CardPaymentEnquireGiftCardBalancePeripheralResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalActivateGiftCardPeripheralRequestHandler.
     * @remarks All replacement PaymentTerminalActivateGiftCardPeripheralRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalActivateGiftCardPeripheralRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalActivateGiftCardPeripheralRequest<PaymentTerminalActivateGiftCardPeripheralResponse>, PaymentTerminalActivateGiftCardPeripheralResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalActivateGiftCardPeripheralResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalActivateGiftCardPeripheralResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler.
     * @remarks All replacement PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalAddBalanceToGiftCardPeripheralRequest<PaymentTerminalAddBalanceToGiftCardPeripheralResponse>, PaymentTerminalAddBalanceToGiftCardPeripheralResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalAddBalanceToGiftCardPeripheralResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalAddBalanceToGiftCardPeripheralResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalAuthorizePaymentActivityRequestHandler.
     * @remarks All replacement PaymentTerminalAuthorizePaymentActivityRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalAuthorizePaymentActivityRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalAuthorizePaymentActivityRequest<PaymentTerminalAuthorizePaymentActivityResponse>, PaymentTerminalAuthorizePaymentActivityResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalAuthorizePaymentActivityResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalAuthorizePaymentActivityResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalAuthorizePaymentRequestHandler.
     * @remarks All replacement PaymentTerminalAuthorizePaymentRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalAuthorizePaymentRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalAuthorizePaymentRequest<PaymentTerminalAuthorizePaymentResponse>, PaymentTerminalAuthorizePaymentResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalAuthorizePaymentResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalAuthorizePaymentResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalCapturePaymentRequestHandler.
     * @remarks All replacement PaymentTerminalCapturePaymentRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalCapturePaymentRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalCapturePaymentRequest<PaymentTerminalCapturePaymentResponse>, PaymentTerminalCapturePaymentResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalCapturePaymentResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalCapturePaymentResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler.
     * @remarks All replacement PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalEnquireGiftCardBalancePeripheralRequest<PaymentTerminalEnquireGiftCardBalancePeripheralResponse>, PaymentTerminalEnquireGiftCardBalancePeripheralResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalEnquireGiftCardBalancePeripheralResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalEnquireGiftCardBalancePeripheralResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalExecuteTaskRequestHandler.
     * @remarks All replacement PaymentTerminalExecuteTaskRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalExecuteTaskRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalExecuteTaskRequest<PaymentTerminalExecuteTaskResponse>, PaymentTerminalExecuteTaskResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalExecuteTaskResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalExecuteTaskResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalFetchTokenPeripheralRequestHandler.
     * @remarks All replacement PaymentTerminalFetchTokenPeripheralRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalFetchTokenPeripheralRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalFetchTokenPeripheralRequest<PaymentTerminalFetchTokenPeripheralResponse>, PaymentTerminalFetchTokenPeripheralResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalFetchTokenPeripheralResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalFetchTokenPeripheralResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalGetTransactionReferenceIdRequestHandler.
     * @remarks All replacement PaymentTerminalGetTransactionReferenceIdRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalGetTransactionReferenceIdRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalGetTransactionReferenceIdRequest<PaymentTerminalGetTransactionReferenceIdResponse>, PaymentTerminalGetTransactionReferenceIdResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalGetTransactionReferenceIdResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalGetTransactionReferenceIdResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalGetTransactionByTransactionReferenceRequestHandler.
     * @remarks All replacement PaymentTerminalGetTransactionByTransactionReferenceRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalGetTransactionByTransactionReferenceRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalGetTransactionByTransactionReferenceRequest<PaymentTerminalGetTransactionByTransactionReferenceResponse>, PaymentTerminalGetTransactionByTransactionReferenceResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalGetTransactionByTransactionReferenceResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalGetTransactionByTransactionReferenceResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalRefundPaymentActivityRequestHandler.
     * @remarks All replacement PaymentTerminalRefundPaymentActivityRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalRefundPaymentActivityRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalRefundPaymentActivityRequest<PaymentTerminalRefundPaymentActivityResponse>, PaymentTerminalRefundPaymentActivityResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalRefundPaymentActivityResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalRefundPaymentActivityResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalRefundPaymentRequestHandler.
     * @remarks All replacement PaymentTerminalRefundPaymentRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalRefundPaymentRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalRefundPaymentRequest<PaymentTerminalRefundPaymentResponse>, PaymentTerminalRefundPaymentResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalRefundPaymentResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalRefundPaymentResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalUpdateLinesRequestHandler.
     * @remarks All replacement PaymentTerminalUpdateLinesRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalUpdateLinesRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalUpdateLinesRequest<PaymentTerminalUpdateLinesResponse>, PaymentTerminalUpdateLinesResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalUpdateLinesResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalUpdateLinesResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalVoidPaymentRequestHandler.
     * @remarks All replacement PaymentTerminalVoidPaymentRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalVoidPaymentRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalVoidPaymentRequest<PaymentTerminalVoidPaymentResponse>, PaymentTerminalVoidPaymentResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalVoidPaymentResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalVoidPaymentResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalBeginTransactionRequestHandler.
     * @remarks All replacement PaymentTerminalBeginTransactionRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalBeginTransactionRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalBeginTransactionRequest<PaymentTerminalBeginTransactionResponse>, PaymentTerminalBeginTransactionResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalBeginTransactionResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalBeginTransactionResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalCancelOperationRequestHandler.
     * @remarks All replacement PaymentTerminalCancelOperationRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalCancelOperationRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalCancelOperationRequest<PaymentTerminalCancelOperationResponse>, PaymentTerminalCancelOperationResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalCancelOperationResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalCancelOperationResponse>;
    }
    /**
     * Represents the base class for all replacement PaymentTerminalEndRequestHandler.
     * @remarks All replacement PaymentTerminalEndRequestHandler should derive from this class.
     */
    export abstract class PaymentTerminalEndTransactionRequestHandler extends ReplacementRequestHandlerBase<PaymentTerminalEndTransactionRequest<PaymentTerminalEndTransactionResponse>, PaymentTerminalEndTransactionResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PaymentTerminalEndTransactionRequestHandler>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PaymentTerminalEndTransactionResponse>;
    }
    /**
     * Represents the base class for all replacement CashDrawerOpenRequestHandler.
     * @remarks All replacement CashDrawerOpenRequestHandler should derive from this class.
     */
    export abstract class CashDrawerOpenRequestHandler extends ReplacementRequestHandlerBase<CashDrawerOpenRequest<CashDrawerOpenResponse>, CashDrawerOpenResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<OpenCashDrawerOperationResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CashDrawerOpenResponse>;
    }
}
declare module "PosApi/Extend/RequestHandlers/ProductsRequestHandlers" {
    import { ReplacementRequestHandlerBase } from "PosApi/Extend/RequestHandlers/RequestHandlers";
    import { AbstractRequestType } from "PosApi/Create/RequestHandlers";
    import { GetSerialNumberClientRequest, GetSerialNumberClientResponse, GetRefinerValuesByTextServiceRequest, GetRefinerValuesByTextServiceResponse } from "PosApi/Consume/Products";
    /**
     * Represents the base class for all replacement GetSerialNumberClientRequestHandler.
     * @remarks All replacement GetSerialNumberClientRequestHandler should derive from this class.
     */
    export abstract class GetSerialNumberClientRequestHandler extends ReplacementRequestHandlerBase<GetSerialNumberClientRequest<GetSerialNumberClientResponse>, GetSerialNumberClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetSerialNumberClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetSerialNumberClientResponse>;
    }
    /**
     * Represents the base class for all replacement for GetRefinerValuesByTextServiceRequestHandler.
     * @remarks All replacement for GetRefinerValuesByTextServiceRequestHandler should derive from this class.
     */
    export abstract class GetRefinerValuesByTextServiceRequestHandler extends ReplacementRequestHandlerBase<GetRefinerValuesByTextServiceRequest<GetRefinerValuesByTextServiceResponse>, GetRefinerValuesByTextServiceResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetRefinerValuesByTextServiceResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetRefinerValuesByTextServiceResponse>;
    }
}
declare module "PosApi/Extend/RequestHandlers/SalesOrdersRequestHandlers" {
    import { ReplacementRequestHandlerBase } from "PosApi/Extend/RequestHandlers/RequestHandlers";
    import { AbstractRequestType } from "PosApi/Create/RequestHandlers";
    import { GetGiftReceiptsClientRequest, GetGiftReceiptsClientResponse, SelectCustomerOrderTypeClientRequest, SelectCustomerOrderTypeClientResponse, GetCancellationChargeClientRequest, GetCancellationChargeClientResponse } from "PosApi/Consume/SalesOrders";
    /**
     * Represents the base class for all replacement GetGiftReceiptsClientRequestHandler.
     * @remarks All replacement GetGiftReceiptsClientRequestHandler should derive from this class.
     */
    export abstract class GetGiftReceiptsClientRequestHandler extends ReplacementRequestHandlerBase<GetGiftReceiptsClientRequest<GetGiftReceiptsClientResponse>, GetGiftReceiptsClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetGiftReceiptsClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetGiftReceiptsClientResponse>;
    }
    /**
     * Represents the base class for all replacement for SelectCustomerOrderTypeClientRequestHandler.
     * @remarks All replacement for SelectCustomerOrderTypeClientRequestHandler should derive from this class.
     */
    export abstract class SelectCustomerOrderTypeClientRequestHandler extends ReplacementRequestHandlerBase<SelectCustomerOrderTypeClientRequest, SelectCustomerOrderTypeClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<SelectCustomerOrderTypeClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<SelectCustomerOrderTypeClientResponse>;
    }
    /**
     * Represents the base class for all replacement for GetCancellationChargeClientRequestHandler.
     * @remarks All replacement for GetCancellationChargeClientRequestHandler should derive from this class.
     */
    export abstract class GetCancellationChargeClientRequestHandler extends ReplacementRequestHandlerBase<GetCancellationChargeClientRequest<GetCancellationChargeClientResponse>, GetCancellationChargeClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetCancellationChargeClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetCancellationChargeClientResponse>;
    }
}
declare module "PosApi/Extend/RequestHandlers/ScanResultsRequestHandlers" {
    import { ReplacementRequestHandlerBase } from "PosApi/Extend/RequestHandlers/RequestHandlers";
    import { AbstractRequestType } from "PosApi/Create/RequestHandlers";
    import { GetScanResultClientRequest, GetScanResultClientResponse } from "PosApi/Consume/ScanResults";
    /**
     * Represents the base class for all replacement GetScanResultClientRequestHandler.
     * @remarks All replacement GetScanResultClientRequestHandler should derive from this class.
     */
    export abstract class GetScanResultClientRequestHandler extends ReplacementRequestHandlerBase<GetScanResultClientRequest<GetScanResultClientResponse>, GetScanResultClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetScanResultClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetScanResultClientResponse>;
    }
}
declare module "PosApi/Extend/RequestHandlers/StoreFulfillmentRequestHandlers" {
    import { ReplacementRequestHandlerBase } from "PosApi/Extend/RequestHandlers/RequestHandlers";
    import { AbstractRequestType } from "PosApi/Create/RequestHandlers";
    import { PrintPackingSlipClientRequest, PrintPackingSlipClientResponse } from "PosApi/Consume/SalesOrders";
    /**
     * Represents the base class for all replacement PrintPackingSlipClientRequestHandler.
     * @remarks All replacement PrintPackingSlipClientRequestHandler should derive from this class.
     */
    export abstract class PrintPackingSlipClientRequestHandler extends ReplacementRequestHandlerBase<PrintPackingSlipClientRequest<PrintPackingSlipClientResponse>, PrintPackingSlipClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<PrintPackingSlipClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<PrintPackingSlipClientResponse>;
    }
}
declare module "PosApi/Extend/RequestHandlers/StoreOperationsRequestHandlers" {
    import { ReplacementRequestHandlerBase } from "PosApi/Extend/RequestHandlers/RequestHandlers";
    import { AbstractRequestType } from "PosApi/Create/RequestHandlers";
    import { CreateTenderRemovalTransactionClientRequest, CreateTenderRemovalTransactionClientResponse, CreateFloatEntryTransactionClientRequest, CreateFloatEntryTransactionClientResponse, CreateStartingAmountTransactionClientRequest, CreateStartingAmountTransactionClientResponse, GetPickingAndReceivingOrdersClientRequest, GetPickingAndReceivingOrdersClientResponse, GetReportParametersClientRequest, GetReportParametersClientResponse, GetStartingAmountClientRequest, GetStartingAmountClientResponse, LoyaltyCardPointsBalanceOperationRequest, LoyaltyCardPointsBalanceOperationResponse, SelectZipCodeInfoClientRequest, SelectZipCodeInfoClientResponse } from "PosApi/Consume/StoreOperations";
    /**
     * Represents the base class for all replacement CreateTenderRemovalTransactionClientRequestHandler.
     * @remarks All replacement CreateTenderRemovalTransactionClientRequestHandler should derive from this class.
     */
    export abstract class CreateTenderRemovalTransactionClientRequestHandler extends ReplacementRequestHandlerBase<CreateTenderRemovalTransactionClientRequest<CreateTenderRemovalTransactionClientResponse>, CreateTenderRemovalTransactionClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CreateTenderRemovalTransactionClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CreateTenderRemovalTransactionClientResponse>;
    }
    /**
     * Represents the base class for all replacement CreateFloatEntryTransactionClientRequestHandler.
     * @remarks All replacement CreateFloatEntryTransactionClientRequestHandler should derive from this class.
     */
    export abstract class CreateFloatEntryTransactionClientRequestHandler extends ReplacementRequestHandlerBase<CreateFloatEntryTransactionClientRequest<CreateFloatEntryTransactionClientResponse>, CreateFloatEntryTransactionClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CreateTenderRemovalTransactionClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CreateFloatEntryTransactionClientResponse>;
    }
    /**
     * Represents the base class for all replacement CreateStartingAmountTransactionClientRequestHandler.
     * @remarks All replacement CreateStartingAmountTransactionClientRequestHandler should derive from this class.
     */
    export abstract class CreateStartingAmountTransactionClientRequestHandler extends ReplacementRequestHandlerBase<CreateStartingAmountTransactionClientRequest<CreateStartingAmountTransactionClientResponse>, CreateStartingAmountTransactionClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CreateStartingAmountTransactionClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CreateStartingAmountTransactionClientResponse>;
    }
    /**
     * Represents the base class for all replacement GetReportParametersClientRequestHandler.
     * @remarks All replacement GetReportParametersClientRequestHandler should derive from this class.
     */
    export abstract class GetReportParametersClientRequestHandler extends ReplacementRequestHandlerBase<GetReportParametersClientRequest<GetReportParametersClientResponse>, GetReportParametersClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetReportParametersClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetReportParametersClientResponse>;
    }
    /**
     * Represents the base class for all replacement GetStartingAmountClientRequestHandler.
     * @remarks All replacement GetStartingAmountClientRequestHandler should derive from this class.
     */
    export abstract class GetStartingAmountClientRequestHandler extends ReplacementRequestHandlerBase<GetStartingAmountClientRequest<GetStartingAmountClientResponse>, GetStartingAmountClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetStartingAmountClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetStartingAmountClientResponse>;
    }
    /**
     * Represents the base class for all replacement LoyaltyCardPointsBalanceOperationRequestHandler.
     * @remarks All replacement LoyaltyCardPointsBalanceOperationRequestHandler should derive from this class.
     */
    export abstract class LoyaltyCardPointsBalanceOperationRequestHandler extends ReplacementRequestHandlerBase<LoyaltyCardPointsBalanceOperationRequest<LoyaltyCardPointsBalanceOperationResponse>, LoyaltyCardPointsBalanceOperationResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<LoyaltyCardPointsBalanceOperationResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<LoyaltyCardPointsBalanceOperationResponse>;
    }
    /**
     * Represents the base class for all replacement SelectZipCodeInfoClientRequestHandler.
     * @remarks All replacement SelectZipCodeInfoClientRequestHandler should derive from this class.
     */
    export abstract class SelectZipCodeInfoClientRequestHandler extends ReplacementRequestHandlerBase<SelectZipCodeInfoClientRequest, SelectZipCodeInfoClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<SelectZipCodeInfoClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<SelectZipCodeInfoClientResponse>;
    }
    /**
     * Represents the base class for all replacement GetPickingAndReceivingOrdersClientRequestHandler.
     * @remarks All replacement GetPickingAndReceivingOrdersClientRequestHandler should derive from this class.
     */
    export abstract class GetPickingAndReceivingOrdersClientRequestHandler extends ReplacementRequestHandlerBase<GetPickingAndReceivingOrdersClientRequest<GetPickingAndReceivingOrdersClientResponse>, GetPickingAndReceivingOrdersClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<SelectZipCodeInfoClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetPickingAndReceivingOrdersClientResponse>;
    }
}
declare module "PosApi/Extend/RequestHandlers/TenderCountingRequestHandlers" {
    import { ReplacementRequestHandlerBase } from "PosApi/Extend/RequestHandlers/RequestHandlers";
    import { AbstractRequestType } from "PosApi/Create/RequestHandlers";
    import { CreateSafeDropTransactionClientRequest, CreateSafeDropTransactionClientResponse } from "PosApi/Consume/StoreOperations";
    import { GetTenderDetailsClientRequest, GetTenderDetailsClientResponse } from "PosApi/Consume/StoreOperations";
    import { CreateBankDropTransactionClientRequest, CreateBankDropTransactionClientResponse } from "PosApi/Consume/StoreOperations";
    import { CreateTenderDeclarationTransactionClientRequest, CreateTenderDeclarationTransactionClientResponse } from "PosApi/Consume/StoreOperations";
    import { GetCountedTenderDetailAmountClientRequest, GetCountedTenderDetailAmountClientResponse } from "PosApi/Consume/StoreOperations";
    /**
     * Represents the base class for all replacement CreateSafeDropTransactionClientRequestHandler.
     * @remarks All replacement CreateSafeDropTransactionClientRequestHandler should derive from this class.
     */
    export abstract class CreateSafeDropTransactionClientRequestHandler extends ReplacementRequestHandlerBase<CreateSafeDropTransactionClientRequest<CreateSafeDropTransactionClientResponse>, CreateSafeDropTransactionClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CreateSafeDropTransactionClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CreateSafeDropTransactionClientResponse>;
    }
    /**
     * Represents the base class for all replacement GetTenderDetailsClientRequestHandler.
     * @remarks All replacement GetTenderDetailsClientRequestHandler should derive from this class.
     */
    export abstract class GetTenderDetailsClientRequestHandler extends ReplacementRequestHandlerBase<GetTenderDetailsClientRequest<GetTenderDetailsClientResponse>, GetTenderDetailsClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetTenderDetailsClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetTenderDetailsClientResponse>;
    }
    /**
     * Represents the base class for all replacement CreateBankDropTransactionClientRequestHandler.
     * @remarks All replacement CreateBankDropTransactionClientRequestHandler should derive from this class.
     */
    export abstract class CreateBankDropTransactionClientRequestHandler extends ReplacementRequestHandlerBase<CreateBankDropTransactionClientRequest<CreateBankDropTransactionClientResponse>, CreateBankDropTransactionClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CreateBankDropTransactionClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CreateBankDropTransactionClientResponse>;
    }
    /**
     * Represents the base class for all replacement CreateTenderDeclarationTransactionClientRequestHandler.
     * @remarks All replacement CreateTenderDeclarationTransactionClientRequestHandler should derive from this class.
     */
    export abstract class CreateTenderDeclarationTransactionClientRequestHandler extends ReplacementRequestHandlerBase<CreateTenderDeclarationTransactionClientRequest<CreateTenderDeclarationTransactionClientResponse>, CreateTenderDeclarationTransactionClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<CreateTenderDeclarationTransactionClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<CreateTenderDeclarationTransactionClientResponse>;
    }
    /**
     * Represents the base class for all replacement GetCountedTenderDetailAmountClientRequestHandler.
     * @remarks All replacement GetCountedTenderDetailAmountClientRequestHandler should derive from this class.
     */
    export abstract class GetCountedTenderDetailAmountClientRequestHandler extends ReplacementRequestHandlerBase<GetCountedTenderDetailAmountClientRequest<GetCountedTenderDetailAmountClientResponse>, GetCountedTenderDetailAmountClientResponse> {
        /**
         * Gets the supported request type.
         * @return {AbstractRequestType<GetCountedTenderDetailAmountClientResponse>} The supported abstract or concrete operation request type.
         */
        supportedRequestType(): AbstractRequestType<GetCountedTenderDetailAmountClientResponse>;
    }
}
declare module "PosApi/Extend/Triggers/Triggers" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    import { ClientEntities } from "PosApi/Entities";
    export import ITriggerOptions = Commerce.Triggers.ITriggerOptions;
    export import CancelableTriggerResult = Commerce.Triggers.CancelableTriggerResult;
    /**
     * Type interface for the context object provided to the constructor of all POS triggers.
     */
    export interface ITriggerContext extends IExtensionContext {
    }
    export const CancelableTriggerType: typeof Commerce.Triggers.CancelableTriggerType;
    export const NonCancelableTriggerType: typeof Commerce.Triggers.NonCancelableTriggerType;
    /**
     * Represents a POS Trigger.
     */
    export abstract class TriggerBase<TOptions extends ITriggerOptions> extends Commerce.Triggers.Trigger {
        protected readonly context: ITriggerContext;
        constructor(context: ITriggerContext);
        abstract execute(options: TOptions): Promise<ClientEntities.ICancelable | void>;
    }
    /**
     * Represents a Non-cancelable POS Trigger.
     */
    export abstract class NonCancelableTriggerBase<TOptions extends ITriggerOptions> extends TriggerBase<TOptions> {
        /**
         * Executes the trigger.
         * @param {ITriggerOptions} options The options provided to the trigger.
         * @return {Promise<void>} The promise corresponding to the result of the asynchronous trigger execution.
         */
        abstract execute(options: TOptions): Promise<void>;
    }
    /**
     * Represents a Cancelable POS Trigger.
     */
    export abstract class CancelableTriggerBase<TOptions extends ITriggerOptions> extends TriggerBase<TOptions> {
        /**
         * Executes the trigger.
         * @param {ITriggerOptions} options The options provided to the trigger.
         * @return {Promise<ClientEntities.ICancelable>} The promise corresponding to the result of the asynchronous trigger execution.
         * @remarks The promise contains an ICancelable that indicates whether or not the workflow should be canceled.
         */
        abstract execute(options: TOptions): Promise<ClientEntities.ICancelable>;
    }
}
declare module "PosApi/Extend/Triggers/ApplicationTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase, CancelableTriggerResult } from "PosApi/Extend/Triggers/Triggers";
    import { ClientEntities } from "PosApi/Entities";
    export import IApplicationStartTriggerOptions = Commerce.Triggers.IApplicationStartTriggerOptions;
    /**
     * Represents the base class for all ApplicationStart triggers.
     * @remarks All ApplicationStart triggers should derive from this class.
     */
    export abstract class ApplicationStartTrigger extends NonCancelableTriggerBase<IApplicationStartTriggerOptions> {
    }
    export import IApplicationSuspendTriggerOptions = Commerce.Triggers.IApplicationSuspendTriggerOptions;
    /**
     * Represents the base class for all ApplicationSuspend triggers.
     * @remarks All ApplicationSuspend triggers should derive from this class.
     */
    export abstract class ApplicationSuspendTrigger extends NonCancelableTriggerBase<IApplicationSuspendTriggerOptions> {
    }
    export import IPostConnectionStatusChangeTriggerOptions = Commerce.Triggers.IPostConnectionStatusChangeTriggerOptions;
    /**
     * Represents the base class for all PostConnectionStatusChange triggers.
     * @remarks All PostConnectionStatusChange triggers should derive from this class.
     */
    export abstract class PostConnectionStatusChangeTrigger extends NonCancelableTriggerBase<IPostConnectionStatusChangeTriggerOptions> {
    }
    export import IPreLogOnTriggerOptions = Commerce.Triggers.IPreLogOnTriggerOptions;
    /**
     * Represents the base class for all PreLogOn triggers.
     * @remarks All PreLogOn triggers should derive from this class.
     */
    export abstract class PreLogOnTrigger extends CancelableTriggerBase<IPreLogOnTriggerOptions> {
        abstract execute(options: IPreLogOnTriggerOptions): Promise<ClientEntities.ICancelable | CancelableTriggerResult<IPreLogOnTriggerOptions>>;
    }
    export import IPostLogOnTriggerOptions = Commerce.Triggers.IPostLogOnTriggerOptions;
    /**
     * Represents the base class for all PostLogOn triggers.
     * @remarks All PostLogOn triggers should derive from this class.
     */
    export abstract class PostLogOnTrigger extends NonCancelableTriggerBase<IPostLogOnTriggerOptions> {
    }
    export import IPostLogOffTriggerOptions = Commerce.Triggers.IPostLogOffTriggerOptions;
    /**
     * Represents the base class for all PostLogOff triggers.
     * @remarks All PostLogOff triggers should derive from this class.
     */
    export abstract class PostLogOffTrigger extends NonCancelableTriggerBase<IPostLogOffTriggerOptions> {
    }
    export import IPreLockTerminalTriggerOptions = Commerce.Triggers.IPreLockTerminalTriggerOptions;
    /**
     * Represents the base class for all PreLockTerminal triggers.
     * @remarks All PreLockTerminal triggers should derive from this class.
     */
    export abstract class PreLockTerminalTrigger extends CancelableTriggerBase<IPreLockTerminalTriggerOptions> {
    }
    export import IPostLockTerminalTriggerOptions = Commerce.Triggers.IPostLockTerminalTriggerOptions;
    /**
     * Represents the base class for all PostLockTerminal triggers.
     * @remarks All PostLockTerminal triggers should derive from this class.
     */
    export abstract class PostLockTerminalTrigger extends NonCancelableTriggerBase<IPostLockTerminalTriggerOptions> {
    }
    export import IPreUnlockTerminalTriggerOptions = Commerce.Triggers.IPreUnlockTerminalTriggerOptions;
    /**
     * Represents the base class for all PreUnlockTerminal triggers.
     * @remarks All PreUnlockTerminal triggers should derive from this class.
     */
    export abstract class PreUnlockTerminalTrigger extends CancelableTriggerBase<IPreUnlockTerminalTriggerOptions> {
        abstract execute(options: IPreUnlockTerminalTriggerOptions): Promise<CancelableTriggerResult<IPreUnlockTerminalTriggerOptions>>;
    }
    export import IPostDeviceActivationTriggerOptions = Commerce.Triggers.IPostDeviceActivationTriggerOptions;
    /**
     * Represents the base class for all PostDeviceActivation triggers.
     * @remarks All PostDeviceActivation triggers should derive from this class.
     */
    export abstract class PostDeviceActivationTrigger extends NonCancelableTriggerBase<IPostDeviceActivationTriggerOptions> {
    }
    export import IPreElevateUserTriggerOptions = Commerce.Triggers.IPreElevateUserTriggerOptions;
    /**
     * Represents the base class for all PreElevateUser triggers.
     * The elevate operation is done in the OperationPipeline, during the manager override.
     * The PreElevate trigger is executed after receiving the credentials and right before attempting to authenticate
     * the manager.
     * @remarks All PreElevateUser triggers should derive from this class.
     */
    export abstract class PreElevateUserTrigger extends CancelableTriggerBase<IPreElevateUserTriggerOptions> {
        abstract execute(options: IPreElevateUserTriggerOptions): Promise<CancelableTriggerResult<IPreElevateUserTriggerOptions>>;
    }
    export import IPreOpenUrlTriggerOptions = Commerce.Triggers.IPreOpenUrlTriggerOptions;
    /**
     * Represents the base class for all PreOpenUrl triggers.
     * @remarks All PreOpenUrl triggers should derive from this class.
     */
    export abstract class PreOpenUrlTrigger extends CancelableTriggerBase<IPreOpenUrlTriggerOptions> {
        abstract execute(options: IPreOpenUrlTriggerOptions): Promise<CancelableTriggerResult<IPreOpenUrlTriggerOptions>>;
    }
}
declare module "PosApi/Extend/Triggers/AuditEventTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    /**
     * Provides the interface for pre-register audit event trigger options.
     */
    export import IPreRegisterAuditEventTriggerOptions = Commerce.Triggers.IPreRegisterAuditEventTriggerOptions;
    /**
     * Represents the base class for all PreRegisterAuditEvent triggers.
     * @remarks All PreRegisterAuditEvent triggers should derive from this class.
     */
    export abstract class PreRegisterAuditEventTrigger extends CancelableTriggerBase<IPreRegisterAuditEventTriggerOptions> {
    }
    /**
     * Provides the interface for post-register audit event trigger options.
     */
    export import IPostRegisterAuditEventTriggerOptions = Commerce.Triggers.IPostRegisterAuditEventTriggerOptions;
    /**
     * Represents the base class for all PostRegisterAuditEvent triggers.
     * @remarks All PostRegisterAuditEvent triggers should derive from this class.
     */
    export abstract class PostRegisterAuditEventTrigger extends NonCancelableTriggerBase<IPostRegisterAuditEventTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/CashManagementTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IPreTenderDeclarationTriggerOptions = Commerce.Triggers.IPreTenderDeclarationTriggerOptions;
    /**
     * Represents the base class for all PreTenderDeclaration triggers.
     * @remarks All PreTenderDeclaration triggers should derive from this class.
     */
    export abstract class PreTenderDeclarationTrigger extends CancelableTriggerBase<IPreTenderDeclarationTriggerOptions> {
    }
    export import IPostTenderDeclarationTriggerOptions = Commerce.Triggers.IPostTenderDeclarationTriggerOptions;
    /**
     * Represents the base class for all PostTenderDeclaration triggers.
     * @remarks All PostTenderDeclaration triggers should derive from this class.
     */
    export abstract class PostTenderDeclarationTrigger extends NonCancelableTriggerBase<IPostTenderDeclarationTriggerOptions> {
    }
    export import IPreFloatEntryTriggerOptions = Commerce.Triggers.IPreFloatEntryTriggerOptions;
    /**
     * Represents the base class for all PreFloatEntry triggers.
     * @remarks All PreFloatEntry triggers should derive from this class.
     */
    export abstract class PreFloatEntryTrigger extends CancelableTriggerBase<IPreFloatEntryTriggerOptions> {
    }
    export import IPostFloatEntryTriggerOptions = Commerce.Triggers.IPostFloatEntryTriggerOptions;
    /**
     * Represents the base class for all PostFloatEntry triggers.
     * @remarks All PostFloatEntry triggers should derive from this class.
     */
    export abstract class PostFloatEntryTrigger extends NonCancelableTriggerBase<IPostFloatEntryTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/CustomerTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase, CancelableTriggerResult } from "PosApi/Extend/Triggers/Triggers";
    export import IPreCustomerAddTriggerOptions = Commerce.Triggers.IPreCustomerAddTriggerOptions;
    /**
     * Represents the base class for all PreCustomerAdd triggers.
     * @remarks All PreCustomerAdd triggers should derive from this class.
     */
    export abstract class PreCustomerAddTrigger extends CancelableTriggerBase<IPreCustomerAddTriggerOptions> {
    }
    export import IPostCustomerAddTriggerOptions = Commerce.Triggers.IPostCustomerAddTriggerOptions;
    /**
     * Represents the base class for all PostCustomerAdd triggers.
     * @remarks All PostCustomerAdd triggers should derive from this class.
     */
    export abstract class PostCustomerAddTrigger extends NonCancelableTriggerBase<IPostCustomerAddTriggerOptions> {
    }
    export import ICustomerClearTriggerOptions = Commerce.Triggers.ICustomerClearTriggerOptions;
    /**
     * Represents the base class for all PreCustomerClear triggers.
     * @remarks All PreCustomerClear triggers should derive from this class.
     */
    export abstract class PreCustomerClearTrigger extends CancelableTriggerBase<ICustomerClearTriggerOptions> {
    }
    /**
     * Represents the base class for all PostCustomerClear triggers.
     * @remarks All PostCustomerClear triggers should derive from this class.
     */
    export abstract class PostCustomerClearTrigger extends NonCancelableTriggerBase<ICustomerClearTriggerOptions> {
    }
    export import IPreCustomerSetTriggerOptions = Commerce.Triggers.IPreCustomerSetTriggerOptions;
    /**
     * Represents the base class for all PreCustomerSet triggers.
     * @remarks All PreCustomerSet triggers should derive from this class.
     */
    export abstract class PreCustomerSetTrigger extends CancelableTriggerBase<IPreCustomerSetTriggerOptions> {
    }
    export import IPreCustomerSearchTriggerOptions = Commerce.Triggers.IPreCustomerSearchTriggerOptions;
    /**
     * Represents the base class for all PreCustomerSearch triggers.
     * @remarks All PreCustomerSearch triggers should derive from this class.
     */
    export abstract class PreCustomerSearchTrigger extends CancelableTriggerBase<IPreCustomerSearchTriggerOptions> {
    }
    export import IPostCustomerSearchTriggerOptions = Commerce.Triggers.IPostCustomerSearchTriggerOptions;
    /**
     * Represents the base class for all PostCustomerSearch triggers.
     * @remarks All PostCustomerSearch triggers should derive from this class.
     */
    export abstract class PostCustomerSearchTrigger extends NonCancelableTriggerBase<IPostCustomerSearchTriggerOptions> {
    }
    export import IPreGetLoyaltyCardBalanceTriggerOptions = Commerce.Triggers.IPreGetLoyaltyCardBalanceTriggerOptions;
    /**
     * Represents the base class for all PreGetLoyaltyCardBalance triggers.
     * @remarks All PreGetLoyaltyCardBalance triggers should derive from this class.
     * @remarks The PreGetLoyaltyCardBalanceTrigger is executed prior to running the get loyalty card balance operation.
     */
    export abstract class PreGetLoyaltyCardBalanceTrigger extends CancelableTriggerBase<IPreGetLoyaltyCardBalanceTriggerOptions> {
    }
    export import IPreDisplayLoyaltyCardBalanceTriggerOptions = Commerce.Triggers.IPreDisplayLoyaltyCardBalanceTriggerOptions;
    /**
     * Represents the base class for all PreDisplayLoyaltyCardBalance triggers.
     * @remarks All PreDisplayLoyaltyCardBalance triggers should derive from this class.
     * @remarks The PreDisplayLoyaltyCardBalanceTrigger is executed prior to showing the loyalty card balance details dialog.
     */
    export abstract class PreDisplayLoyaltyCardBalanceTrigger extends CancelableTriggerBase<IPreDisplayLoyaltyCardBalanceTriggerOptions> {
    }
    export import IPostGetLoyaltyCardBalanceTriggerOptions = Commerce.Triggers.IPostGetLoyaltyCardBalanceTriggerOptions;
    /**
     * Represents the base class for all PostGetLoyaltyCardBalance triggers.
     * @remarks All PostGetLoyaltyCardBalance triggers should derive from this class.
     * @remarks The PostGetLoyaltyCardBalanceTrigger is executed when LoyaltyRequest operation is done.
     */
    export abstract class PostGetLoyaltyCardBalanceTrigger extends NonCancelableTriggerBase<IPostGetLoyaltyCardBalanceTriggerOptions> {
    }
    export import IPreCustomerSaveTriggerOptions = Commerce.Triggers.IPreCustomerSaveTriggerOptions;
    /**
     * Represents the base class for all PreCustomerSave triggers.
     * @remarks All PreCustomerSave triggers should derive from this class.
     * @remarks The PreCustomerSaveTrigger is executed prior to saving customer.
     * @remarks This includes when creating a new customer and when editing an existing one.
     */
    export abstract class PreCustomerSaveTrigger extends CancelableTriggerBase<IPreCustomerSaveTriggerOptions> {
    }
    export import IPostCustomerSaveTriggerOptions = Commerce.Triggers.IPostCustomerSaveTriggerOptions;
    /**
     * Represents the base class for all PostCustomerSave triggers.
     * @remarks All PostCustomerSave triggers should derive from this class.
     * @remarks The PostCustomerSaveTrigger is executed after saving customer.
     * @remarks This includes when creating a new customer.
     */
    export abstract class PostCustomerSaveTrigger extends NonCancelableTriggerBase<IPostCustomerSaveTriggerOptions> {
    }
    export import IPostIssueLoyaltyCardTriggerOptions = Commerce.Triggers.IPostIssueLoyaltyCardTriggerOptions;
    /**
     * Represents the base class for all PostIssueLoyaltyCard triggers.
     * @remarks All PostIssueLoyaltyCard triggers should derive from this class.
     * @remarks The PostIssueLoyaltyCardTrigger is executed after saving customer.
     * @remarks The PostIssueLoyaltyCardTrigger is executed when IssueLoyaltyCardServiceRequest operation is done.
     */
    export abstract class PostIssueLoyaltyCardTrigger extends NonCancelableTriggerBase<IPostIssueLoyaltyCardTriggerOptions> {
    }
    export import IPreSaveCustomerAddressTriggerOptions = Commerce.Triggers.IPreSaveCustomerAddressTriggerOptions;
    /**
     * Represents the base class for all PreSaveCustomerAddress triggers.
     * @remarks All PreSaveCustomerAddress triggers should derive from this class.
     * @remarks The PreSaveCustomerAddress is executed before updating the customer address.
     */
    export abstract class PreSaveCustomerAddressTrigger extends CancelableTriggerBase<IPreSaveCustomerAddressTriggerOptions> {
        abstract execute(options: IPreSaveCustomerAddressTriggerOptions): Promise<CancelableTriggerResult<IPreSaveCustomerAddressTriggerOptions>>;
    }
}
declare module "PosApi/Extend/Triggers/DiscountTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IPreAddCouponTriggerOptions = Commerce.Triggers.IPreAddCouponTriggerOptions;
    export import IPostAddCouponTriggerOptions = Commerce.Triggers.IPostAddCouponTriggerOptions;
    /**
     * Represents the base class for all PreAddCoupon triggers.
     * @remarks All PreAddCoupon triggers should derive from this class.
     */
    export abstract class PreAddCouponTrigger extends CancelableTriggerBase<IPreAddCouponTriggerOptions> {
    }
    /**
     * Represents the base class for all PostAddCoupon triggers.
     * @remarks All PostAddCoupon triggers should derive from this class.
     */
    export abstract class PostAddCouponTrigger extends NonCancelableTriggerBase<IPostAddCouponTriggerOptions> {
    }
    export import IPreLineDiscountTriggerOptions = Commerce.Triggers.IPreLineDiscountTriggerOptions;
    export import IPostLineDiscountTriggerOptions = Commerce.Triggers.IPostLineDiscountTriggerOptions;
    /**
     * Represents the base class for all PreLineDiscountAmount triggers.
     * @remarks All PreLineDiscountAmount triggers should derive from this class.
     */
    export abstract class PreLineDiscountAmountTrigger extends CancelableTriggerBase<IPreLineDiscountTriggerOptions> {
    }
    /**
     * Represents the base class for all PostLineDiscountAmount triggers.
     * @remarks All PostLineDiscountAmount triggers should derive from this class.
     */
    export abstract class PostLineDiscountAmountTrigger extends NonCancelableTriggerBase<IPostLineDiscountTriggerOptions> {
    }
    /**
     * Represents the base class for all PreLineDiscountPercent triggers.
     * @remarks All PreLineDiscountPercent triggers should derive from this class.
     */
    export abstract class PreLineDiscountPercentTrigger extends CancelableTriggerBase<IPreLineDiscountTriggerOptions> {
    }
    /**
     * Represents the base class for all PostLineDiscountPercent triggers.
     * @remarks All PostLineDiscountPercent triggers should derive from this class.
     */
    export abstract class PostLineDiscountPercentTrigger extends NonCancelableTriggerBase<IPostLineDiscountTriggerOptions> {
    }
    export import IPreTotalDiscountTriggerOptions = Commerce.Triggers.IPreTotalDiscountTriggerOptions;
    export import IPostTotalDiscountTriggerOptions = Commerce.Triggers.IPostTotalDiscountTriggerOptions;
    /**
     * Represents the base class for all PreTotalDiscountAmount triggers.
     * @remarks All PreTotalDiscountAmount triggers should derive from this class.
     */
    export abstract class PreTotalDiscountAmountTrigger extends CancelableTriggerBase<IPreTotalDiscountTriggerOptions> {
    }
    /**
     * Represents the base class for all PostTotalDiscountAmount triggers.
     * @remarks All PostTotalDiscountAmount triggers should derive from this class.
     */
    export abstract class PostTotalDiscountAmountTrigger extends NonCancelableTriggerBase<IPostTotalDiscountTriggerOptions> {
    }
    /**
     * Represents the base class for all PreTotalDiscountPercent triggers.
     * @remarks All PreTotalDiscountPercent triggers should derive from this class.
     */
    export abstract class PreTotalDiscountPercentTrigger extends CancelableTriggerBase<IPreTotalDiscountTriggerOptions> {
    }
    /**
     * Represents the base class for all PostTotalDiscountPercent triggers.
     * @remarks All PostTotalDiscountPercent triggers should derive from this class.
     */
    export abstract class PostTotalDiscountPercentTrigger extends NonCancelableTriggerBase<IPostTotalDiscountTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/OperationTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IOperationTriggerOptions = Commerce.Triggers.IOperationTriggerOptions;
    /**
     * Represents the base class for all PreOperation triggers.
     * @remarks All PreOperation triggers should derive from this class.
     */
    export abstract class PreOperationTrigger extends CancelableTriggerBase<IOperationTriggerOptions> {
    }
    export import IPostOperationTriggerOptions = Commerce.Triggers.IPostOperationTriggerOptions;
    /**
     * Represents the base class for all PostOperation triggers.
     * @remarks All PostOperation triggers should derive from this class.
     */
    export abstract class PostOperationTrigger extends NonCancelableTriggerBase<IPostOperationTriggerOptions> {
    }
    export import IOperationFailureTriggerOptions = Commerce.Triggers.IOperationFailureTriggerOptions;
    /**
     * Represents the base class for all OperationFailure triggers.
     * @remarks All OperationFailure triggers should derive from this class.
     */
    export abstract class OperationFailureTrigger extends NonCancelableTriggerBase<IOperationFailureTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/PaymentTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IPreAddTenderLineTriggerOptions = Commerce.Triggers.IPreAddTenderLineTriggerOptions;
    /**
     * Represents the base class for all PreAddTenderLine triggers.
     * @remarks All PreAddTenderLine triggers should derive from this class.
     */
    export abstract class PreAddTenderLineTrigger extends CancelableTriggerBase<IPreAddTenderLineTriggerOptions> {
    }
    export import IPrePaymentTriggerOptions = Commerce.Triggers.IPrePaymentTriggerOptions;
    /**
     * Represents the base class for all PrePayment triggers.
     * @remarks All PrePayment triggers should derive from this class.
     */
    export abstract class PrePaymentTrigger extends CancelableTriggerBase<IPrePaymentTriggerOptions> {
    }
    export import IPostPaymentTriggerOptions = Commerce.Triggers.IPostPaymentTriggerOptions;
    /**
     * Represents the base class for all PostPayment triggers.
     * @remarks All PostPayment triggers should derive from this class.
     */
    export abstract class PostPaymentTrigger extends NonCancelableTriggerBase<IPostPaymentTriggerOptions> {
    }
    export import IPreVoidPaymentTriggerOptions = Commerce.Triggers.IPreVoidPaymentTriggerOptions;
    /**
     * Represents the base class for all PreVoidPayment triggers.
     * @remarks All PreVoidPayment triggers should derive from this class.
     */
    export abstract class PreVoidPaymentTrigger extends CancelableTriggerBase<IPreVoidPaymentTriggerOptions> {
    }
    export import IPostVoidPaymentTriggerOptions = Commerce.Triggers.IPostVoidPaymentTriggerOptions;
    /**
     * Represents the base class for all PostVoidPayment triggers.
     * @remarks All PostVoidPayment triggers should derive from this class.
     */
    export abstract class PostVoidPaymentTrigger extends NonCancelableTriggerBase<IPostVoidPaymentTriggerOptions> {
    }
    export import IPostGetGiftCardNumberTriggerOptions = Commerce.Triggers.IPostGetGiftCardNumberTriggerOptions;
    /**
     * Represents the base class for all PostGetGiftCardNumber triggers.
     * @remarks All PostGetGiftCardNumberTrigger triggers should derive from this class.
     */
    export abstract class PostGetGiftCardNumberTrigger extends CancelableTriggerBase<IPostGetGiftCardNumberTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/PeripheralTriggers" {
    import { NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IPostOpenCashDrawerTriggerOptions = Commerce.Triggers.IPostOpenCashDrawerTriggerOptions;
    /**
     * Represents the base class for all PostOpenCashDrawer triggers.
     * @remarks All PostOpenCashDrawer triggers should derive from this class.
     */
    export abstract class PostOpenCashDrawerTrigger extends NonCancelableTriggerBase<IPostOpenCashDrawerTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/PrintingTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IPrePrintReceiptCopyTriggerOptions = Commerce.Triggers.IPrePrintReceiptCopyTriggerOptions;
    export import IPostReceiptPromptTriggerOptions = Commerce.Triggers.IPostReceiptPromptTriggerOptions;
    /**
     * Represents the base class for all PrePrintReceiptCopy triggers.
     * @remarks All PrePrintReceiptCopy triggers should derive from this class.
     */
    export abstract class PrePrintReceiptCopyTrigger extends CancelableTriggerBase<IPrePrintReceiptCopyTriggerOptions> {
    }
    /**
     * Represents the base class for all PostReceiptPromptTrigger triggers.
     * @remarks All PostReceiptPromptTrigger triggers should derive from this class.
     */
    export abstract class PostReceiptPromptTrigger extends NonCancelableTriggerBase<IPostReceiptPromptTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/ProductTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IPostGetSerialNumberTriggerOptions = Commerce.Triggers.IPostGetSerialNumberTriggerOptions;
    /**
     * Represents the base class for all PostGetSerialNumber triggers.
     * @remarks All PostGetSerialNumber triggers should derive from this class.
     */
    export abstract class PostGetSerialNumberTrigger extends NonCancelableTriggerBase<IPostGetSerialNumberTriggerOptions> {
    }
    export import IPreProductSaleTriggerOptions = Commerce.Triggers.IPreProductSaleTriggerOptions;
    /**
     * Represents the base class for all PreProductSale triggers.
     * @remarks All PreProductSale triggers should derive from this class.
     */
    export abstract class PreProductSaleTrigger extends CancelableTriggerBase<IPreProductSaleTriggerOptions> {
    }
    export import IPostProductSaleTriggerOptions = Commerce.Triggers.IPostProductSaleTriggerOptions;
    /**
     * Represents the base class for all PostProductSale triggers.
     * @remarks All PostProductSale triggers should derive from this class.
     */
    export abstract class PostProductSaleTrigger extends NonCancelableTriggerBase<IPostProductSaleTriggerOptions> {
    }
    export import IPreReturnProductOperationTriggerOptions = Commerce.Triggers.IPreReturnProductOperationTriggerOptions;
    /**
     * Represents the base class for all PreReturnProductOperation triggers.
     * @remarks All PreReturnProductOperation triggers should derive from this class.
     */
    export abstract class PreReturnProductOperationTrigger extends CancelableTriggerBase<IPreReturnProductOperationTriggerOptions> {
    }
    export import IPreReturnProductTriggerOptions = Commerce.Triggers.IPreReturnProductTriggerOptions;
    /**
     * Represents the base class for all PreReturnProduct triggers.
     * @remarks All PreReturnProduct triggers should derive from this class.
     */
    export abstract class PreReturnProductTrigger extends CancelableTriggerBase<IPreReturnProductTriggerOptions> {
    }
    export import IPostReturnProductTriggerOptions = Commerce.Triggers.IPostReturnProductTriggerOptions;
    /**
     * Represents the base class for all PostReturnProduct triggers.
     * @remarks All PostReturnProduct triggers should derive from this class.
     */
    export abstract class PostReturnProductTrigger extends NonCancelableTriggerBase<IPostReturnProductTriggerOptions> {
    }
    export import IPreSetQuantityTriggerOptions = Commerce.Triggers.IPreSetQuantityTriggerOptions;
    /**
     * Represents the base class for all PreSetQuantity triggers.
     * @remarks All PreSetQuantity triggers should derive from this class.
     */
    export abstract class PreSetQuantityTrigger extends CancelableTriggerBase<IPreSetQuantityTriggerOptions> {
    }
    export import IPostSetQuantityTriggerOptions = Commerce.Triggers.IPostSetQuantityTriggerOptions;
    /**
     * Represents the base class for all PostSetQuantity triggers.
     * @remarks All PostSetQuantity triggers should derive from this class.
     */
    export abstract class PostSetQuantityTrigger extends NonCancelableTriggerBase<IPostSetQuantityTriggerOptions> {
    }
    export import IPrePriceOverrideTriggerOptions = Commerce.Triggers.IPrePriceOverrideTriggerOptions;
    /**
     * Represents the base class for all PrePriceOverride triggers.
     * @remarks All PrePriceOverride triggers should derive from this class.
     */
    export abstract class PrePriceOverrideTrigger extends CancelableTriggerBase<IPrePriceOverrideTriggerOptions> {
    }
    export import IPostPriceOverrideTriggerOptions = Commerce.Triggers.IPostPriceOverrideTriggerOptions;
    /**
     * Represents the base class for all PostPriceOverride triggers.
     * @remarks All PostPriceOverride triggers should derive from this class.
     */
    export abstract class PostPriceOverrideTrigger extends NonCancelableTriggerBase<IPostPriceOverrideTriggerOptions> {
    }
    export import IPreClearQuantityTriggerOptions = Commerce.Triggers.IPreClearQuantityTriggerOptions;
    /**
     * Represents the base class for all PreClearQuantity triggers.
     * @remarks All PreClearQuantity triggers should derive from this class.
     */
    export abstract class PreClearQuantityTrigger extends CancelableTriggerBase<IPreClearQuantityTriggerOptions> {
    }
    export import IPostClearQuantityTriggerOptions = Commerce.Triggers.IPostClearQuantityTriggerOptions;
    /**
     * Represents the base class for all PostClearQuantity triggers.
     * @remarks All PostClearQuantity triggers should derive from this class.
     */
    export abstract class PostClearQuantityTrigger extends NonCancelableTriggerBase<IPostClearQuantityTriggerOptions> {
    }
    export import IPreVoidProductsTriggerOptions = Commerce.Triggers.IPreVoidProductsTriggerOptions;
    /**
     * Represents the base class for all PreVoidProducts triggers.
     * @remarks All PreVoidProducts triggers should derive from this class.
     */
    export abstract class PreVoidProductsTrigger extends CancelableTriggerBase<IPreVoidProductsTriggerOptions> {
    }
    export import IPostVoidProductsTriggerOptions = Commerce.Triggers.IPostVoidProductsTriggerOptions;
    /**
     * Represents the base class for all PostVoidProducts triggers.
     * @remarks All PostVoidProducts triggers should derive from this class.
     */
    export abstract class PostVoidProductsTrigger extends NonCancelableTriggerBase<IPostVoidProductsTriggerOptions> {
    }
    export import IPostPriceCheckTriggerOptions = Commerce.Triggers.IPostPriceCheckTriggerOptions;
    /**
     * Represents the base class for all PostPriceCheck triggers.
     * @remarks All PostPriceCheck triggers should derive from this class.
     */
    export abstract class PostPriceCheckTrigger extends NonCancelableTriggerBase<IPostPriceCheckTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/ReasonCodeTriggers" {
    import { CancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IPostGetReasonCodeLineTriggerOptions = Commerce.Triggers.IPostGetReasonCodeLineTriggerOptions;
    /**
     * Represents the base class for all PostGetReasonCodeLine triggers.
     * @remarks All PostGetReasonCodeLine triggers should derive from this class.
     */
    export abstract class PostGetReasonCodeLineTrigger extends CancelableTriggerBase<IPostGetReasonCodeLineTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/SalesOrderTriggers" {
    import { CancelableTriggerBase, CancelableTriggerResult, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    /**
     * Provides the interface for pre change shipping origin trigger options.
     */
    export import IPreChangeShippingOriginTriggerOptions = Commerce.Triggers.IPreChangeShippingOriginTriggerOptions;
    /**
     * Represents the base class for all PreChangeShippingOrigin triggers.
     * @remarks All PreChangeShippingOrigin triggers should derive from this class.
     */
    export abstract class PreChangeShippingOriginTrigger extends CancelableTriggerBase<IPreChangeShippingOriginTriggerOptions> {
    }
    /**
     * Provides the interface for pre create packing slip trigger options.
     */
    export import IPreCreatePackingSlipTriggerOptions = Commerce.Triggers.IPreCreatePackingSlipTriggerOptions;
    /**
     * Represents the base class for all PreCreatePackingSlip triggers.
     * @remarks All PreCreatePackingSlip triggers should derive from this class.
     */
    export abstract class PreCreatePackingSlipTrigger extends CancelableTriggerBase<IPreCreatePackingSlipTriggerOptions> {
        abstract execute(options: IPreCreatePackingSlipTriggerOptions): Promise<CancelableTriggerResult<IPreCreatePackingSlipTriggerOptions>>;
    }
    /**
     * Provides the interface for post create packing slip trigger options.
     */
    export import IPostCreatePackingSlipTriggerOptions = Commerce.Triggers.IPostCreatePackingSlipTriggerOptions;
    /**
     * Represents the base class for all PostCreatePackingSlip triggers.
     * @remarks All PostCreatePackingSlip triggers should derive from this class.
     */
    export abstract class PostCreatePackingSlipTrigger extends NonCancelableTriggerBase<IPostCreatePackingSlipTriggerOptions> {
    }
    /**
     * Provides the interface for pre get fulfillment lines trigger options.
     */
    export import IPreGetFulfillmentLinesTriggerOptions = Commerce.Triggers.IPreGetFulfillmentLinesTriggerOptions;
    /**
     * Represents the base class for all PreGetFulfillmentLines triggers.
     */
    export abstract class PreGetFulfillmentLinesTrigger extends CancelableTriggerBase<IPreGetFulfillmentLinesTriggerOptions> {
        abstract execute(options: IPreGetFulfillmentLinesTriggerOptions): Promise<CancelableTriggerResult<IPreGetFulfillmentLinesTriggerOptions>>;
    }
    /**
     * Provides the interface for pre mark fulfillment lines as packed trigger options.
     */
    export import IPreMarkFulfillmentLinesAsPackedTriggerOptions = Commerce.Triggers.IPreMarkFulfillmentLinesAsPackedTriggerOptions;
    /**
     * Represents the base class for all PreMarkFulfillmentLinesAsPacked triggers.
     * @remarks All PreMarkFulfillmentLinesAsPacked triggers should derive from this class.
     */
    export abstract class PreMarkFulfillmentLinesAsPackedTrigger extends CancelableTriggerBase<IPreMarkFulfillmentLinesAsPackedTriggerOptions> {
        abstract execute(options: IPreMarkFulfillmentLinesAsPackedTriggerOptions): Promise<CancelableTriggerResult<IPreMarkFulfillmentLinesAsPackedTriggerOptions>>;
    }
    /**
     * Provides the interface for post mark fulfillment lines as packed trigger options.
     */
    export import IPostMarkFulfillmentLinesAsPackedTriggerOptions = Commerce.Triggers.IPostMarkFulfillmentLinesAsPackedTriggerOptions;
    /**
     * Represents the base class for all PostMarkFulfillmentLinesAsPacked triggers.
     * @remarks All PostMarkFulfillmentLinesAsPacked triggers should derive from this class.
     */
    export abstract class PostMarkFulfillmentLinesAsPackedTrigger extends NonCancelableTriggerBase<IPostMarkFulfillmentLinesAsPackedTriggerOptions> {
    }
    /**
     * Provides the options type interface for pre recall customer order triggers.
     */
    export import IPreRecallCustomerOrderTriggerOptions = Commerce.Triggers.IPreRecallCustomerOrderTriggerOptions;
    /**
     * Represents the base class for all PreRecallCustomerOrder triggers.
     * @remarks All PreRecallCustomerOrder triggers should derive from this class.
     */
    export abstract class PreRecallCustomerOrderTrigger extends CancelableTriggerBase<IPreRecallCustomerOrderTriggerOptions> {
    }
    /**
     * Provides the options type interface post recall customer order triggers.
     */
    export import IPostRecallCustomerOrderTriggerOptions = Commerce.Triggers.IPostRecallCustomerOrderTriggerOptions;
    /**
     * Represents the base class for all PostRecallCustomerOrder triggers.
     * @remarks All PostRecallCustomerOrder triggers should derive from this class.
     */
    export abstract class PostRecallCustomerOrderTrigger extends NonCancelableTriggerBase<IPostRecallCustomerOrderTriggerOptions> {
    }
    /**
     * Provides the options type interface post return invoiced sales lines triggers.
     */
    export import IPostReturnInvoicedSalesLinesTriggerOptions = Commerce.Triggers.IPostReturnInvoicedSalesLinesTriggerOptions;
    /**
     * Represents the base class for all PostReturnInvoicedSalesLines triggers.
     * @remarks All PostReturnInvoicedSalesLines triggers should derive from this class.
     */
    export abstract class PostReturnInvoicedSalesLinesTrigger extends NonCancelableTriggerBase<IPostReturnInvoicedSalesLinesTriggerOptions> {
    }
    /**
     * Provides the interface for pre pick up customer order lines trigger options.
     */
    export import IPrePickUpCustomerOrderLinesTriggerOptions = Commerce.Triggers.IPrePickUpCustomerOrderLinesTriggerOptions;
    /**
     * Represents the base class for all PrePickUpCustomerOrderLines triggers.
     * @remarks All PrePickUpCustomerOrderLines triggers should derive from this class.
     */
    export abstract class PrePickUpCustomerOrderLinesTrigger extends CancelableTriggerBase<IPrePickUpCustomerOrderLinesTriggerOptions> {
    }
    /**
     * Provides the interface for pre search orders trigger options.
     */
    export import IPreSearchOrdersTriggerOptions = Commerce.Triggers.IPreSearchOrdersTriggerOptions;
    /**
     * Represents the base class for all PreSearchOrdersTrigger triggers.
     * @remarks All PreSearchOrdersTrigger triggers should derive from this class.
     */
    export abstract class PreSearchOrdersTrigger extends CancelableTriggerBase<IPreSearchOrdersTriggerOptions> {
        abstract execute(options: IPreSearchOrdersTriggerOptions): Promise<CancelableTriggerResult<IPreSearchOrdersTriggerOptions>>;
    }
    /**
     * Provides the interface for pre ship fulfillment lines trigger options.
     */
    export import IPreShipFulfillmentLinesTriggerOptions = Commerce.Triggers.IPreShipFulfillmentLinesTriggerOptions;
    /**
     * Represents the base class for all PreShipFulfillmentLinesTrigger triggers.
     * @remarks All PreShipFulfillmentLinesTrigger triggers should derive from this class.
     */
    export abstract class PreShipFulfillmentLinesTrigger extends CancelableTriggerBase<IPreShipFulfillmentLinesTriggerOptions> {
        abstract execute(options: IPreShipFulfillmentLinesTriggerOptions): Promise<CancelableTriggerResult<IPreShipFulfillmentLinesTriggerOptions>>;
    }
    /**
     * Provides the interface for post ship fulfillment lines trigger options.
     */
    export import IPostShipFulfillmentLinesTriggerOptions = Commerce.Triggers.IPostShipFulfillmentLinesTriggerOptions;
    /**
     * Represents the base class for all PostShipFulfillmentLinesTrigger triggers.
     * @remarks All PostShipFulfillmentLinesTrigger triggers should derive from this class.
     */
    export abstract class PostShipFulfillmentLinesTrigger extends NonCancelableTriggerBase<IPostShipFulfillmentLinesTriggerOptions> {
    }
    /**
     * Provides the interface for pre resend email receipt trigger options.
     */
    export import IPreResendEmailReceiptTriggerOptions = Commerce.Triggers.IPreResendEmailReceiptTriggerOptions;
    /**
     * Represents the base class for all PreResendEmailReceiptTrigger triggers.
     * @remarks All PreResendEmailReceiptTrigger triggers should derive from this class.
     */
    export abstract class PreResendEmailReceiptTrigger extends CancelableTriggerBase<IPreResendEmailReceiptTriggerOptions> {
        abstract execute(options: IPreResendEmailReceiptTriggerOptions): Promise<CancelableTriggerResult<IPreResendEmailReceiptTriggerOptions>>;
    }
}
declare module "PosApi/Extend/Triggers/ShiftTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IPostOpenShiftTriggerOptions = Commerce.Triggers.IPostOpenShiftTriggerOptions;
    /**
     * Represents the base class for all PostOpenShift triggers.
     * @remarks All PostOpenShift triggers should derive from this class.
     */
    export abstract class PostOpenShiftTrigger extends NonCancelableTriggerBase<IPostOpenShiftTriggerOptions> {
    }
    export import IPreCloseShiftTriggerOptions = Commerce.Triggers.IPreCloseShiftTriggerOptions;
    /**
     * Represents the base class for all PreCloseShift triggers.
     * @remarks All PreCloseShift triggers should derive from this class.
     */
    export abstract class PreCloseShiftTrigger extends CancelableTriggerBase<IPreCloseShiftTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/TaxOverrideTriggers" {
    import { CancelableTriggerBase, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IPreOverrideLineProductTaxTriggerOptions = Commerce.Triggers.IPreOverrideLineProductTaxTriggerOptions;
    /**
     * Represents the base class for all PreOverrideLineProductTax triggers.
     * @remarks All PreOverrideLineProductTax triggers should derive from this class.
     */
    export abstract class PreOverrideLineProductTaxTrigger extends CancelableTriggerBase<IPreOverrideLineProductTaxTriggerOptions> {
    }
    export import IPostOverrideLineProductTaxTriggerOptions = Commerce.Triggers.IPostOverrideLineProductTaxTriggerOptions;
    /**
     * Represents the base class for all PostOverrideLineProductTax triggers.
     * @remarks All PostOverrideLineProductTax triggers should derive from this class.
     */
    export abstract class PostOverrideLineProductTaxTrigger extends NonCancelableTriggerBase<IPostOverrideLineProductTaxTriggerOptions> {
    }
    export import IPreOverrideTransactionTaxTriggerOptions = Commerce.Triggers.IPreOverrideTransactionTaxTriggerOptions;
    /**
     * Represents the base class for all PreOverrideTransactionTax triggers.
     * @remarks All PreOverrideTransactionTax triggers should derive from this class.
     */
    export abstract class PreOverrideTransactionTaxTrigger extends CancelableTriggerBase<IPreOverrideTransactionTaxTriggerOptions> {
    }
    export import IPostOverrideTransactionTaxTriggerOptions = Commerce.Triggers.IPostOverrideTransactionTaxTriggerOptions;
    /**
     * Represents the base class for all PostOverrideTransactionTax triggers.
     * @remarks All PostOverrideTransactionTax triggers should derive from this class.
     */
    export abstract class PostOverrideTransactionTaxTrigger extends NonCancelableTriggerBase<IPostOverrideTransactionTaxTriggerOptions> {
    }
}
declare module "PosApi/Extend/Triggers/TransactionTriggers" {
    import { CancelableTriggerBase, CancelableTriggerResult, NonCancelableTriggerBase } from "PosApi/Extend/Triggers/Triggers";
    export import IBeginTransactionTriggerOptions = Commerce.Triggers.IBeginTransactionTriggerOptions;
    /**
     * Represents the base class for all BeginTransaction triggers.
     * @remarks All BeginTransaction triggers should derive from this class.
     */
    export abstract class BeginTransactionTrigger extends NonCancelableTriggerBase<IBeginTransactionTriggerOptions> {
    }
    export import IPreConfirmReturnTransactionTriggerOptions = Commerce.Triggers.IPreConfirmReturnTransactionTriggerOptions;
    /**
     * Represents the base class for all PreConfirmReturnTransaction triggers.
     * @remarks All PreConfirmReturnTransaction triggers should derive from this class.
     */
    export abstract class PreConfirmReturnTransactionTrigger extends CancelableTriggerBase<IPreConfirmReturnTransactionTriggerOptions> {
    }
    export import IPreReturnTransactionTriggerOptions = Commerce.Triggers.IPreReturnTransactionTriggerOptions;
    /**
     * Represents the base class for all PreReturnTransaction triggers.
     * @remarks All PreReturnTransaction triggers should derive from this class.
     */
    export abstract class PreReturnTransactionTrigger extends CancelableTriggerBase<IPreReturnTransactionTriggerOptions> {
    }
    export import IPreReturnTransactionOperationTriggerOptions = Commerce.Triggers.IPreReturnTransactionOperationTriggerOptions;
    /**
     * Represents the base class for all PreReturnTransactionOperation triggers.
     * @remarks All PreReturnTransactionOperation triggers should derive from this class.
     */
    export abstract class PreReturnTransactionOperationTrigger extends CancelableTriggerBase<IPreReturnTransactionOperationTriggerOptions> {
    }
    export import IPostReturnTransactionTriggerOptions = Commerce.Triggers.IPostReturnTransactionTriggerOptions;
    /**
     * Represents the base class for all PostReturnTransaction triggers.
     * @remarks All PostReturnTransaction triggers should derive from this class.
     */
    export abstract class PostReturnTransactionTrigger extends NonCancelableTriggerBase<IPostReturnTransactionTriggerOptions> {
    }
    export import IPreEndTransactionTriggerOptions = Commerce.Triggers.IPreEndTransactionTriggerOptions;
    /**
     * Represents the base class for all PreEndTransaction triggers.
     * @remarks All PreEndTransaction triggers should derive from this class.
     */
    export abstract class PreEndTransactionTrigger extends CancelableTriggerBase<IPreEndTransactionTriggerOptions> {
    }
    export import IPostEndTransactionTriggerOptions = Commerce.Triggers.IPostEndTransactionTriggerOptions;
    /**
     * Represents the base class for all PostEndTransaction triggers.
     * @remarks All PostEndTransaction triggers should derive from this class.
     */
    export abstract class PostEndTransactionTrigger extends NonCancelableTriggerBase<IPostEndTransactionTriggerOptions> {
    }
    export import IPreVoidTransactionTriggerOptions = Commerce.Triggers.IPreVoidTransactionTriggerOptions;
    /**
     * Represents the base class for all PreVoidTransaction triggers.
     * @remarks All PreVoidTransaction triggers should derive from this class.
     * @remarks These triggers will be executed after the user confirms they want to void the transaction, but prior to voiding the transaction.
     */
    export abstract class PreVoidTransactionTrigger extends CancelableTriggerBase<IPreVoidTransactionTriggerOptions> {
    }
    export import IPostVoidTransactionTriggerOptions = Commerce.Triggers.IPostVoidTransactionTriggerOptions;
    /**
     * Represents the base class for all PostVoidTransaction triggers.
     * @remarks All PostVoidTransaction triggers should derive from this class.
     */
    export abstract class PostVoidTransactionTrigger extends NonCancelableTriggerBase<IPostVoidTransactionTriggerOptions> {
    }
    export import IPreSuspendTransactionTriggerOptions = Commerce.Triggers.IPreSuspendTransactionTriggerOptions;
    /**
     * Represents the base class for all PreSuspendTransaction triggers.
     * @remarks All PreSuspendTransaction triggers should derive from this class.
     */
    export abstract class PreSuspendTransactionTrigger extends CancelableTriggerBase<IPreSuspendTransactionTriggerOptions> {
    }
    export import IPostSuspendTransactionTriggerOptions = Commerce.Triggers.IPostSuspendTransactionTriggerOptions;
    /**
     * Represents the base class for all PostSuspendTransaction triggers.
     * @remarks All PostSuspendTransaction triggers should derive from this class.
     */
    export abstract class PostSuspendTransactionTrigger extends NonCancelableTriggerBase<IPostSuspendTransactionTriggerOptions> {
    }
    export import IPreRecallTransactionTriggerOptions = Commerce.Triggers.IPreRecallTransactionTriggerOptions;
    /**
     * Represents the base class for all PreRecallTransaction triggers.
     * @remarks All PreRecallTransaction triggers should derive from this class.
     */
    export abstract class PreRecallTransactionTrigger extends CancelableTriggerBase<IPreRecallTransactionTriggerOptions> {
    }
    export import IPostRecallTransactionTriggerOptions = Commerce.Triggers.IPostRecallTransactionTriggerOptions;
    /**
     * Represents the base class for all PostRecallTransaction triggers.
     * @remarks All PostRecallTransaction triggers should derive from this class.
     */
    export abstract class PostRecallTransactionTrigger extends NonCancelableTriggerBase<IPostRecallTransactionTriggerOptions> {
    }
    export import IPostCartCheckoutTriggerOptions = Commerce.Triggers.IPostCartCheckoutTriggerOptions;
    /**
     * Represents the base class for all PostCartCheckout triggers.
     * @remarks All PostCartCheckout triggers should derive from this class.
     */
    export abstract class PostCartCheckoutTrigger extends NonCancelableTriggerBase<IPostCartCheckoutTriggerOptions> {
    }
    export import IPreSelectTransactionPaymentMethodTriggerOptions = Commerce.Triggers.IPreSelectTransactionPaymentMethodTriggerOptions;
    /**
     * Represents the base class for all PreSelectTransactionPaymentMethod triggers.
     * @remarks All PreSelectTransactionPaymentMethod triggers should derive from this class.
     */
    export abstract class PreSelectTransactionPaymentMethod extends CancelableTriggerBase<IPreSelectTransactionPaymentMethodTriggerOptions> {
        abstract execute(options: IPreSelectTransactionPaymentMethodTriggerOptions): Promise<CancelableTriggerResult<IPreSelectTransactionPaymentMethodTriggerOptions>>;
    }
    /**
     * Provides the interface for pre ship selected trigger options.
     */
    export import IPreShipSelectedCartLinesTriggerOptions = Commerce.Triggers.IPreShipSelectedCartLinesTriggerOptions;
    /**
     * Represents the base class for all PreShipSelectedCartLinesTrigger triggers.
     * @remarks All PreShipSelectedCartLinesTrigger triggers should derive from this class.
     */
    export abstract class PreShipSelectedCartLinesTrigger extends CancelableTriggerBase<IPreShipSelectedCartLinesTriggerOptions> {
        abstract execute(options: IPreShipSelectedCartLinesTriggerOptions): Promise<CancelableTriggerResult<IPreShipSelectedCartLinesTriggerOptions>>;
    }
}
declare module "PosApi/Extend/Triggers/TransferOrderTriggers" {
    import { CancelableTriggerBase, CancelableTriggerResult } from "PosApi/Extend/Triggers/Triggers";
    /**
     * Provides the interface for pre create transfer orders trigger options.
     */
    export import IPreCreateTransferOrderTriggerOptions = Commerce.Triggers.IPreCreateTransferOrderTriggerOptions;
    /**
     * Represents the base class for all PreCreateTransferOrderTrigger triggers.
     * @remarks All PreCreateTransferOrderTrigger triggers should derive from this class.
     */
    export abstract class PreCreateTransferOrderTrigger extends CancelableTriggerBase<IPreCreateTransferOrderTriggerOptions> {
        abstract execute(options: IPreCreateTransferOrderTriggerOptions): Promise<CancelableTriggerResult<IPreCreateTransferOrderTriggerOptions>>;
    }
    /**
     * Provides the interface for pre update transfer orders trigger options.
     */
    export import IPreUpdateTransferOrderTriggerOptions = Commerce.Triggers.IPreCreateTransferOrderTriggerOptions;
    /**
     * Represents the base class for all PreUpdateTransferOrderTrigger triggers.
     * @remarks All PreUpdateTransferOrderTrigger triggers should derive from this class.
     */
    export abstract class PreUpdateTransferOrderTrigger extends CancelableTriggerBase<IPreUpdateTransferOrderTriggerOptions> {
        abstract execute(options: IPreUpdateTransferOrderTriggerOptions): Promise<CancelableTriggerResult<IPreUpdateTransferOrderTriggerOptions>>;
    }
}
declare module "PosApi/Extend/Views/AppBarCommands" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    export import IExtensionCommandMessageTypeMap = Commerce.Extensibility.IExtensionCommandMessageTypeMap;
    export import IViewToExtensionCommandMessageTypeMap = Commerce.Extensibility.IViewToExtensionCommandMessageTypeMap;
    export import IExtensionCommand = Commerce.Extensibility.IExtensionCommand;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IExtensionCommandContext<PageMapType extends IViewToExtensionCommandMessageTypeMap> extends IExtensionContext {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandMessageTypeMap, PageMapType>;
    }
    /**
     * Represents an extension command.
     */
    export abstract class ExtensionCommandBase<TMap extends IViewToExtensionCommandMessageTypeMap> implements IExtensionCommand {
        extraClass: string;
        id: string;
        label: string;
        protected readonly context: IExtensionCommandContext<TMap>;
        private _isProcessing;
        private _canExecute;
        private _isVisible;
        /**
         * Creates a new instance of the ExtensionCommandBase class.
         * @param {IExtensionCommandContext<TMap>} context The command context.
         */
        constructor(context: IExtensionCommandContext<TMap>);
        /**
         * Gets a value indicating whether or not the command is processing.
         * @return {boolean} True if the command is processing. False otherwise.
         */
        protected get isProcessing(): boolean;
        /**
         * Sets a value indicating whether or not the command is processing.
         * @param {boolean} value True if the command is processing. False otherwise.
         */
        protected set isProcessing(value: boolean);
        /**
         * Gets a value indicating whether or not the command is processing.
         * @return {boolean} True if the command can execute. False otherwise.
         */
        protected get canExecute(): boolean;
        /**
         * Sets a value indicating whether or not the command can execute.
         * @param {boolean} value True if the command can execute. False otherwise.
         */
        protected set canExecute(value: boolean);
        /**
         * Gets a value indicating whether or not the command is visible.
         * @return {boolean} True if the command is visible. False otherwise.
         */
        protected get isVisible(): boolean;
        /**
         * Sets a value indicating whether or not the command is visible.
         * @param {boolean} value True if the command is visble. False otherwise.
         */
        protected set isVisible(value: boolean);
        /**
         * Disposes the command releasing its resources.
         */
        dispose(): void;
        /**
         * Initializes the command.
         * @param {TMap["Initialize"]} context The command state.
         */
        protected abstract init(state: TMap["Initialize"]): void;
        /**
         * Executes the command.
         */
        protected abstract execute(): void;
    }
}
declare module "PosApi/Extend/Views/AddressAddEditView" {
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { CustomControlBase, ICustomControlContext } from "PosApi/Extend/Views/CustomControls";
    import { ProxyEntities } from "PosApi/Entities";
    export import IAddressAddEditToExtensionCommandMessageTypeMap = Commerce.Extensibility.IAddressAddEditToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToAddressAddEditMessageTypeMap = Commerce.Extensibility.IExtensionCommandToAddressAddEditMessageTypeMap;
    export import IAddressAddEditExtensionCommandState = Commerce.Extensibility.IAddressAddEditExtensionCommandState;
    export import AddressAddEditAddressUpdatedData = Commerce.Extensibility.AddressAddEditAddressUpdatedData;
    export import AddressAddEditUpdateAddressData = Commerce.Extensibility.AddressAddEditUpdateAddressData;
    /**
     * Represents the command context. It contains the initial state of the command, and the message channel the command will use to communicate with POS.
     */
    export interface IAddressAddEditExtensionCommandContext extends IExtensionCommandContext<IAddressAddEditToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToAddressAddEditMessageTypeMap, IAddressAddEditToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the address add/edit page.
     * @remarks All commands added to the address add/edit page should derive from this class.
     */
    export abstract class AddressAddEditExtensionCommandBase extends ExtensionCommandBase<IAddressAddEditToExtensionCommandMessageTypeMap> {
        protected readonly context: IAddressAddEditExtensionCommandContext;
        /**
         * The handler for the address updated message.
         * @remarks Derived classes should set the handler to execute functionality when a "AddressUpdated" message is received.
         */
        protected addressUpdatedHandler: (data: AddressAddEditAddressUpdatedData) => void;
        private _address;
        /**
         * Creates a new instance of the AddressAddEditExtensionCommandBase class.
         * @param {IAddressAddEditExtensionCommandContext} context The command context.
         */
        constructor(context: IAddressAddEditExtensionCommandContext);
        /**
         * Gets the address.
         * @return {ProxyEntities.Address} The address.
         */
        protected get address(): ProxyEntities.Address;
        /**
         * Sets the address.
         * @param {ProxyEntities.Address} Sets the address and notifies the address add/edit view of the change.
         */
        protected set address(value: ProxyEntities.Address);
    }
    export import IAddressAddEditToCustomControlMessageTypeMap = Commerce.Extensibility.IAddressAddEditToCustomControlMessageTypeMap;
    export import ICustomControlToAddressAddEditMessageTypeMap = Commerce.Extensibility.ICustomControlToAddressAddEditMessageTypeMap;
    export import IAddressAddEditCustomControlState = Commerce.Extensibility.IAddressAddEditCustomControlState;
    /**
     * Represents the AddressAddEdit custom control context. It contains message channel it will use to communicate with POS.
     */
    export interface IAddressAddEditCustomControlContext extends ICustomControlContext<ICustomControlToAddressAddEditMessageTypeMap, IAddressAddEditToCustomControlMessageTypeMap> {
    }
    /**
     * Represents the base class for all extension controls on the Address add edit page.
     * @remarks Custom controls in extensions should derive from this class.
     */
    export abstract class AddressAddEditCustomControlBase extends CustomControlBase<ICustomControlToAddressAddEditMessageTypeMap, IAddressAddEditToCustomControlMessageTypeMap> {
        /**
         * The handler for the address updated message.
         * @remarks Derived classes should set the handler to execute functionality when a "addressChanged" message is received.
         */
        protected addressUpdatedHandler: (data: AddressAddEditAddressUpdatedData) => void;
        private _address;
        private _isVisible;
        /**
         * Creates a new instance of the AddressAddEditCustomControlBase class.
         * @param {string} id The control identifier.
         * @param {IAddressAddEditCustomControlContext} context The control context.
         */
        constructor(id: string, context: IAddressAddEditCustomControlContext);
        /**
         * Gets a value indicating whether or not the custom control is visible.
         * @return {boolean} True if the custom control is visible. False otherwise.
         */
        protected get isVisible(): boolean;
        /**
         * Sets a value indicating whether or not the custom control is visible.
         * @param {boolean} value True if the custom control is visble. False otherwise.
         */
        protected set isVisible(value: boolean);
        /**
         * Initializes the custom control.
         * @param {IAddressAddEditCustomControlState} state The initial state for the custom control.
         */
        protected abstract init(state: IAddressAddEditCustomControlState): void;
        /**
         * Gets the address.
         * @return {ProxyEntities.Address} The address.
         */
        protected get address(): ProxyEntities.Address;
        /**
         * Sets the address. Will send a message to POS core to notify it of the updated address.
         * @param {ProxyEntities.Address} value Sets the address.
         */
        protected set address(value: ProxyEntities.Address);
    }
}
declare module "PosApi/Extend/Views/ViewControllers" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    export import IExtensionViewControllerMessageTypeMap = Commerce.Extensibility.IExtensionViewControllerMessageTypeMap;
    export import IViewToExtensionViewControllerMessageTypeMap = Commerce.Extensibility.IViewToExtensionViewControllerMessageTypeMap;
    export import IExtensionViewController = Commerce.Extensibility.IExtensionViewController;
    /**
     * Represents the view controller context. It contains the message channel the view controller will use to communicate with POS.
     */
    export interface IExtensionViewControllerContext<ControllerMapType extends IExtensionViewControllerMessageTypeMap, PageMapType extends IViewToExtensionViewControllerMessageTypeMap> extends IExtensionContext {
        messageChannel: IMessageChannelEndpoint<ControllerMapType, PageMapType>;
    }
    /**
     * Represents an extension view controller base.
     */
    export abstract class ExtensionViewControllerBase<TOut extends IExtensionViewControllerMessageTypeMap, TIn extends IViewToExtensionViewControllerMessageTypeMap> implements IExtensionViewController {
        protected readonly context: IExtensionViewControllerContext<TOut, TIn>;
        /**
         * Creates a new instance of the ExtensionViewControllerBase class.
         * @param {IExtensionViewControllerContext<TMap>} context The view controller context.
         */
        constructor(context: IExtensionViewControllerContext<TOut, TIn>);
        /**
         * Initializes the command.
         * @param {TMap["Initialize"]} context The command state.
         */
        protected init(state: TIn["Initialize"]): void;
    }
}
declare module "PosApi/Extend/Views/CustomGridColumns" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    export import ICustomGridColumn = Commerce.Extensibility.ICustomGridColumn;
    export import CustomGridColumnAlignment = Commerce.Extensibility.CustomGridColumnAlignment;
    export interface ICustomGridColumnContext extends IExtensionContext {
    }
    /**
     * The base class for grid custom column extension.
     */
    export abstract class CustomGridColumnBase<T> implements ICustomGridColumn<T> {
        /**
         * The extension context.
         */
        protected readonly context: ICustomGridColumnContext;
        /**
         * Creates a new instance of the class.
         * @param {ICustomGridColumnContext} context The extension context.
         */
        constructor(context: ICustomGridColumnContext);
        /**
         * Gets the custom column title.
         * @return {string} The column title.
         */
        abstract title(): string;
        /**
         * The custom column cell compute value.
         * @param {T} data The input data.
         * @return {string} The cell value.
         */
        abstract computeValue(data: T): string;
        /**
         * Gets the custom column alignment.
         * @return {CustomGridColumnAlignment} The alignment.
         */
        abstract alignment(): CustomGridColumnAlignment;
    }
}
declare module "PosApi/Extend/Views/CustomGridItemSubfield" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    export import ICustomGridItemSubfield = Commerce.Extensibility.ICustomGridItemSubfield;
    export interface ICustomGridItemSubfieldContext extends IExtensionContext {
    }
    /**
     * The base class for custom grid item subfield extension.
     */
    export abstract class CustomGridItemSubfieldBase<T> implements ICustomGridItemSubfield<T> {
        /**
         * The extension context.
         */
        protected readonly context: ICustomGridItemSubfieldContext;
        /**
         * Creates a new instance of the class.
         * @param {ICustomGridItemSubfieldContext} context The extension context.
         */
        constructor(context: ICustomGridItemSubfieldContext);
        /**
         * The custom item subfield compute value.
         * @param {T} data The input data.
         * @return {string} The cell value.
         */
        abstract computeValue(data: T): string;
    }
}
declare module "PosApi/Extend/Views/CartView" {
    import { ExtensionViewControllerBase, IExtensionViewControllerContext } from "PosApi/Extend/Views/ViewControllers";
    import { CustomControlBase, ICustomControlContext } from "PosApi/Extend/Views/CustomControls";
    import { ICustomGridColumnContext, CustomGridColumnBase } from "PosApi/Extend/Views/CustomGridColumns";
    import { ICustomGridItemSubfieldContext, CustomGridItemSubfieldBase } from "PosApi/Extend/Views/CustomGridItemSubfield";
    import { ProxyEntities } from "PosApi/Entities";
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    export import ICartViewToExtensionViewControllerMessageTypeMap = Commerce.Extensibility.ICartViewToExtensionViewControllerMessageTypeMap;
    export import IExtensionViewControllerToCartViewMessageTypeMap = Commerce.Extensibility.IExtensionViewControllerToCartViewMessageTypeMap;
    export import CartLineSelectedData = Commerce.Extensibility.CartLineSelectedData;
    export import TenderLineSelectedData = Commerce.Extensibility.TenderLineSelectedData;
    export import CartChangedData = Commerce.Extensibility.CartChangedData;
    export import SetSelectedCartLinesData = Commerce.Extensibility.SetSelectedCartLinesData;
    export interface IExtensionCartViewControllerContext extends IExtensionViewControllerContext<IExtensionViewControllerToCartViewMessageTypeMap, ICartViewToExtensionViewControllerMessageTypeMap> {
    }
    /**
     * Represents the extenesion's cart view controller base class.
     * @remarks All view controller extensions for the cart view should derive from this class.
     */
    export abstract class CartExtensionViewControllerBase extends ExtensionViewControllerBase<IExtensionViewControllerToCartViewMessageTypeMap, ICartViewToExtensionViewControllerMessageTypeMap> {
        protected readonly context: IExtensionCartViewControllerContext;
        /**
         * The handler for the cart line selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "CartLineSelected" message is received.
         */
        protected cartLineSelectedHandler: (data: CartLineSelectedData) => void;
        /**
         * The handler for the cart line selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "CartLineSelectionCleared" message is received.
         */
        protected cartLineSelectionClearedHandler: () => void;
        /**
         * The handler for the tender line selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "TenderLineSelected" message is received.
         */
        protected tenderLineSelectedHandler: (data: TenderLineSelectedData) => void;
        /**
         * The handler for the tender line selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "TenderLineSelectionCleared" message is received.
         */
        protected tenderLineSelectionClearedHandler: () => void;
        /**
         * The handler for the cart changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "CartChanged" message is received.
         */
        protected cartChangedHandler: (data: CartChangedData) => void;
        /**
         * The handler for adding item or customer processing state message.
         * @remarks Derived classes should set the handler to execute functionality when a "ProcessingAddItemOrCustomerChangedHandler" message is received.
         */
        protected processingAddItemOrCustomerChangedHandler: (processing: boolean) => void;
        /**
         * The processing state of the view controller.
         */
        private _isProcessing;
        /**
         * Creates a new instance of the CartExtensionViewControllerBase class.
         * @param {IExtensionCartViewControllerContext} context The view controller context.
         */
        constructor(context: IExtensionCartViewControllerContext);
        /**
         * Gets a value indicating whether or not the view controller is processing.
         * @return {boolean} True if the view controller is processing. False otherwise.
         */
        protected get isProcessing(): boolean;
        /**
         * Sets a value indicating whether or not the view controller is processing.
         * @param {boolean} value True if the view controller is processing. False otherwise.
         */
        protected set isProcessing(value: boolean);
        /**
         * Selects the cart lines shown on the page.
         * @param {SetSelectedCartLinesData} setSelectedCartLinesData The SetSelectedCartLines message data.
         */
        protected setSelectedCartLines(setSelectedCartLinesData: SetSelectedCartLinesData): void;
    }
    export interface ICustomLinesGridColumnContext extends ICustomGridColumnContext {
    }
    export interface ICustomPaymentsGridColumnContext extends ICustomGridColumnContext {
    }
    export interface ICustomDeliveryGridColumnContext extends ICustomGridColumnContext {
    }
    /**
     * The base class for lines grid custom column extension.
     */
    export abstract class CustomLinesGridColumnBase extends CustomGridColumnBase<ProxyEntities.CartLine> {
    }
    /**
     * The base class for payments grid custom column extension.
     */
    export abstract class CustomPaymentsGridColumnBase extends CustomGridColumnBase<ProxyEntities.TenderLine> {
    }
    /**
     * The base class for delivery grid custom column extension.
     */
    export abstract class CustomDeliveryGridColumnBase extends CustomGridColumnBase<ProxyEntities.CartLine> {
    }
    export interface ICustomLinesGridItemSubfieldContext extends ICustomGridItemSubfieldContext {
    }
    /**
     * The base class for lines grid custom column extension.
     */
    export abstract class CustomLinesGridItemSubfieldBase extends CustomGridItemSubfieldBase<ProxyEntities.CartLine> {
    }
    export import ICartViewToCustomControlMessageTypeMap = Commerce.Extensibility.ICartViewToCustomControlMessageTypeMap;
    export import ICustomControlToCartViewMessageTypeMap = Commerce.Extensibility.ICustomControlToCartViewMessageTypeMap;
    export import ICartViewCustomControlState = Commerce.Extensibility.ICartViewCustomControlState;
    /**
     * Represents the cart view custom control context. It contains message channel it will use to communicate with POS.
     */
    export interface ICartViewCustomControlContext extends ICustomControlContext<ICustomControlToCartViewMessageTypeMap, ICartViewToCustomControlMessageTypeMap> {
    }
    /**
     * Represents the base class for all extension controls on the cart page.
     * @remarks Custom controls in extensions should derive from this class.
     */
    export abstract class CartViewCustomControlBase extends CustomControlBase<ICustomControlToCartViewMessageTypeMap, ICartViewToCustomControlMessageTypeMap> {
        /**
         * The handler for the cart line selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "CartLineSelected" message is received.
         */
        protected cartLineSelectedHandler: (data: CartLineSelectedData) => void;
        /**
         * The handler for the cart line selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "CartLineSelectionCleared" message is received.
         */
        protected cartLineSelectionClearedHandler: () => void;
        /**
         * The handler for the tender line selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "TenderLineSelected" message is received.
         */
        protected tenderLineSelectedHandler: (data: TenderLineSelectedData) => void;
        /**
         * The handler for the tender line selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "TenderLineSelectionCleared" message is received.
         */
        protected tenderLineSelectionClearedHandler: () => void;
        /**
         * The handler for the cart changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "CartChanged" message is received.
         */
        protected cartChangedHandler: (data: CartChangedData) => void;
        /**
         * The handler for adding item or customer processing state message.
         * @remarks Derived classes should set the handler to execute functionality when a "ProcessingAddItemOrCustomerChangedHandler" message is received.
         */
        protected processingAddItemOrCustomerChangedHandler: (processing: boolean) => void;
        /**
         * Creates a new instance of the CartViewCustomControlBase class.
         * @param {string} id The control identifier.
         * @param {ICartViewCustomControlContext} context The control context.
         */
        constructor(id: string, context: ICartViewCustomControlContext);
        /**
         * Initializes the custom control.
         * @param {ICartViewCustomControlState} state The initial state for the custom control.
         */
        protected abstract init(state: ICartViewCustomControlState): void;
        /**
         * Selects the cart lines shown on the page.
         * @param {SetSelectedCartLinesData} setSelectedCartLinesData The SetSelectedCartLines message data.
         */
        protected setSelectedCartLines(setSelectedCartLinesData: SetSelectedCartLinesData): void;
    }
    /**
     * Represents the cart view totals panel custom field context.
     */
    export interface ICartViewTotalsPanelCustomFieldContext extends IExtensionContext {
    }
    /**
     * Represents the base class for all totals panel custom fields on the cart page.
     * @remarks Custom fields in extensions should derive from this class.
     */
    export abstract class CartViewTotalsPanelCustomFieldBase {
        /**
         * The extension context.
         */
        protected readonly context: ICartViewTotalsPanelCustomFieldContext;
        /**
         * Creates a new instance of the class.
         * @param {ICartViewTotalsPanelCustomFieldContext} context The extension context.
         */
        constructor(context: ICartViewTotalsPanelCustomFieldContext);
        /**
         * The custom field compute value.
         * @param {ProxyEntities.Cart} cart The cart.
         * @return {string} The field value.
         */
        abstract computeValue(cart: ProxyEntities.Cart): string;
    }
}
declare module "PosApi/Extend/Views/CustomListColumns" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    export import ICustomListColumn = Commerce.Extensibility.ICustomListColumn;
    export interface ICustomColumnsContext extends IExtensionContext {
    }
}
declare module "PosApi/Extend/Views/CustomSearchFilters" {
    import { ProxyEntities } from "PosApi/Entities";
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    export import ISearchFilterDefinition = Commerce.Extensibility.ISearchFilterDefinition;
    /**
     * Represents the search filter definition context.
     */
    export interface ISearchFilterDefinitionContext extends IExtensionContext {
    }
    /**
     * Represents the base class for all custom search filter definitions.
     * @remarks Extension search filter defenitions should not directly inherit from this class.
     *          They should inherit from the derived class specific to the type of search filter definition to be added.
     */
    export abstract class CustomSearchFilterDefinitionBase implements ISearchFilterDefinition {
        protected abstract readonly labelValue: string;
        protected abstract readonly id: string;
        protected readonly context: ISearchFilterDefinitionContext;
        private static readonly KEY_FORMAT_STRING;
        private readonly _filterType;
        /**
         * Creates a new instance of the CustomSearchFilterDefinitionBase class.
         * @param {ProxyEntities.SearchFilterType} filterType The filter type.
         * @param {ISearchFilterDefinitionContext} context The search filter definition context.
         */
        constructor(filterType: ProxyEntities.SearchFilterType, context: ISearchFilterDefinitionContext);
        /**
         * Gets the search filter definition type.
         * @returns {ProxyEntities.SearchFilterType} The search filter definition type.
         */
        get filterType(): ProxyEntities.SearchFilterType;
        /**
         * Gets the search filter definition key.
         * @returns {string} The search filter definition key.
         */
        get key(): string;
        /**
         * Gets the search filter definition label.
         * @returns {string} The search filter definition label.
         */
        get label(): string;
    }
    export import ITextSearchFilterDefinition = Commerce.Extensibility.ITextSearchFilterDefinition;
    /**
     * Represents the base class for all custom text search filter definitions.
     * @remarks All custom text search filter definitions should derive directly from this class.
     */
    export abstract class CustomTextSearchFilterDefinitionBase extends CustomSearchFilterDefinitionBase implements ITextSearchFilterDefinition {
        /**
         * Creates a new instance of the CustomTextSearchFilterDefinitionBase class.
         * @param {ISearchFilterDefinitionContext} context The search filter definition context.
         */
        constructor(context: ISearchFilterDefinitionContext);
    }
}
declare module "PosApi/Extend/Views/CustomSortColumnDefinitions" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    export import ICustomSortColumnDefinition = Commerce.Extensibility.ICustomSortColumnDefinition;
    /**
     * Represents the custom sort column definition context.
     */
    export interface ICustomSortColumnDefinitionContext extends IExtensionContext {
    }
    /**
     * Represents the base class for all custom sort column definitions.
     */
    export abstract class CustomSortColumnDefinitionBase implements ICustomSortColumnDefinition {
        protected readonly context: ICustomSortColumnDefinitionContext;
        private static readonly ID_FORMAT_STRING;
        /**
         * Creates a new instance of the CustomSortColumnDefinitionBase class.
         * @param {ICustomSortColumnDefinitionContext} context The sort column definition context.
         */
        constructor(context: ICustomSortColumnDefinitionContext);
        /**
         * Gets the sort column id.
         * @returns {string} The sort column id.
         */
        get id(): string;
        /**
         * Gets the sort column label.
         * @returns {string} The sort column label.
         */
        abstract label(): string;
        /**
         * Gets the sort column name.
         * @returns {string} The sort column name.
         */
        abstract columnName(): string;
    }
}
declare module "PosApi/Extend/Views/CustomerAddEditView" {
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { ProxyEntities } from "PosApi/Entities";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { CustomControlBase, ICustomControlContext } from "PosApi/Extend/Views/CustomControls";
    export import ICustomerAddEditToExtensionCommandMessageTypeMap = Commerce.Extensibility.ICustomerAddEditToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToCustomerAddEditMessageTypeMap = Commerce.Extensibility.IExtensionCommandToCustomerAddEditMessageTypeMap;
    export import ICustomerAddEditExtensionCommandState = Commerce.Extensibility.ICustomerAddEditExtensionCommandState;
    export import CustomerAddEditCustomerChangedData = Commerce.Extensibility.CustomerAddEditCustomerChangedData;
    export import CustomerAddEditCustomerUpdatedData = Commerce.Extensibility.CustomerAddEditCustomerUpdatedData;
    /**
     * Represents the command context. It contains the initial state of the command, and the message channel the command will use to communicate with POS.
     */
    export interface ICustomerAddEditExtensionCommandContext extends IExtensionCommandContext<ICustomerAddEditToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToCustomerAddEditMessageTypeMap, ICustomerAddEditToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the customer add/edit page.
     * @remarks All commands added to the customer add/edit page should derive from this class.
     */
    export abstract class CustomerAddEditExtensionCommandBase extends ExtensionCommandBase<ICustomerAddEditToExtensionCommandMessageTypeMap> {
        protected readonly context: ICustomerAddEditExtensionCommandContext;
        /**
         * The handler for the customer updated message.
         * @remarks Derived classes should set the handler to execute functionality when a "CustomerUpdated" message is received.
         */
        protected customerUpdatedHandler: (data: CustomerAddEditCustomerUpdatedData) => void;
        private _customer;
        /**
         * Creates a new instance of the CustomerAddEditExtensionCommandBase class.
         * @param {ICustomerAddEditExtensionCommandContext} context The command context.
         */
        constructor(context: ICustomerAddEditExtensionCommandContext);
        /**
         * Gets the customer.
         * @return {Customer} The customer.
         */
        protected get customer(): ProxyEntities.Customer;
        /**
         * Sets the customer.
         * @param {Customer} Sets the customer and notifies the customer add/edit view of the change.
         */
        protected set customer(value: ProxyEntities.Customer);
    }
    export import ICustomerAddEditToCustomControlMessageTypeMap = Commerce.Extensibility.ICustomerAddEditToCustomControlMessageTypeMap;
    export import ICustomControlToCustomerAddEditMessageTypeMap = Commerce.Extensibility.ICustomControlToCustomerAddEditMessageTypeMap;
    export import ICustomerAddEditCustomControlState = Commerce.Extensibility.ICustomerAddEditCustomControlState;
    /**
     * Represents the custom control context. It contains message channel it will use to communicate with POS.
     */
    export interface ICustomerAddEditCustomControlContext extends ICustomControlContext<ICustomControlToCustomerAddEditMessageTypeMap, ICustomerAddEditToCustomControlMessageTypeMap> {
    }
    /**
     * Represents the base class for all extension controls on the add\edit customer page.
     * @remarks Custom controls in extensions should derive from this class.
     */
    export abstract class CustomerAddEditCustomControlBase extends CustomControlBase<ICustomControlToCustomerAddEditMessageTypeMap, ICustomerAddEditToCustomControlMessageTypeMap> {
        /**
         * The handler for the customer changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "CustomerUpdated" message is received.
         */
        protected customerUpdatedHandler: (data: CustomerAddEditCustomerUpdatedData) => void;
        private _customer;
        private _isVisible;
        /**
         * Creates a new instance of the CustomerDetailCustomControlBase class.
         * @param {string} id The control identifier.
         * @param {CustomerDetailCustomControlBase} context The control context.
         */
        constructor(id: string, context: ICustomerAddEditCustomControlContext);
        /**
         * Initializes the custom control.
         * @param {ICustomerDetailCustomControlState} state The initial state for the custom control.
         */
        protected abstract init(state: ICustomerAddEditCustomControlState): void;
        /**
         * Gets a value indicating whether or not the custom control is visible.
         * @return {boolean} True if the custom control is visible. False otherwise.
         */
        protected get isVisible(): boolean;
        /**
         * Sets a value indicating whether or not the custom control is visible.
         * @param {boolean} value True if the custom control is visble. False otherwise.
         */
        protected set isVisible(value: boolean);
        /**
         * Gets the customer.
         * @return {Customer} The customer.
         */
        protected get customer(): ProxyEntities.Customer;
        /**
         * Sets the customer.
         * @param {Customer} Sets the customer and notifies the customer add/edit view of the change.
         */
        protected set customer(value: ProxyEntities.Customer);
    }
}
declare module "PosApi/Extend/Views/CustomerDetailsView" {
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { CustomControlBase, ICustomControlContext } from "PosApi/Extend/Views/CustomControls";
    export import CustomerDetailsAffiliationAddedData = Commerce.Extensibility.CustomerDetailsAffiliationAddedData;
    export import CustomerDetailsLoyaltyCardsLoadedData = Commerce.Extensibility.CustomerDetailsLoyaltyCardsLoadedData;
    export import CustomerDetailsWishListsLoadedData = Commerce.Extensibility.CustomerDetailsWishListsLoadedData;
    export import ICustomerDetailsExtensionCommandState = Commerce.Extensibility.ICustomerDetailsExtensionCommandState;
    export import ICustomerDetailsToExtensionCommandMessageTypeMap = Commerce.Extensibility.ICustomerDetailsToExtensionCommandMessageTypeMap;
    /**
     * Represents the base class for all extension commands on the customer details page.
     * @remarks All commands added to the customer details page should derive from this class.
     */
    export abstract class CustomerDetailsExtensionCommandBase extends ExtensionCommandBase<ICustomerDetailsToExtensionCommandMessageTypeMap> {
        /**
         * The handler for the affiliation added message.
         * @remarks Derived classes should set the handler to execute functionality when a "AffiliationAdded" message is received.
         */
        protected affiliationAddedHandler: (data: CustomerDetailsAffiliationAddedData) => void;
        /**
         * The handler for the loyalty cards loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "LoyaltyCardsLoaded" message is received.
         */
        protected loyaltyCardsLoadedHandler: (data: CustomerDetailsLoyaltyCardsLoadedData) => void;
        /**
         * The handler for the wish lists loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "WishListsLoaded" message is received.
         */
        protected wishListsLoadedHandler: (data: CustomerDetailsWishListsLoadedData) => void;
        /**
         * Creates a new instance of the CustomerDetailsExtensionCommandBase class.
         * @param {IExtensionCommandContext<ICustomerDetailsToExtensionCommandMessageTypeMap>} context The command context.
         */
        constructor(context: IExtensionCommandContext<ICustomerDetailsToExtensionCommandMessageTypeMap>);
        /**
         * Initializes the command.
         * @param {ICustomerDetailsExtensionCommandState} state The initial state for the command.
         */
        protected abstract init(state: ICustomerDetailsExtensionCommandState): void;
    }
    export import ICustomerDetailsToCustomControlMessageTypeMap = Commerce.Extensibility.ICustomerDetailsToCustomControlMessageTypeMap;
    export import ICustomControlToCustomerDetailsMessageTypeMap = Commerce.Extensibility.ICustomControlToCustomerDetailsMessageTypeMap;
    export import ICustomerDetailsCustomControlState = Commerce.Extensibility.ICustomerDetailsCustomControlState;
    /**
     * Represents the customer details custom control context. It contains message channel it will use to communicate with POS.
     */
    export interface ICustomerDetailsCustomControlContext extends ICustomControlContext<ICustomControlToCustomerDetailsMessageTypeMap, ICustomerDetailsToCustomControlMessageTypeMap> {
    }
    /**
     * Represents the base class for all extension controls on the customer details page.
     * @remarks Custom controls in extensions should derive from this class.
     */
    export abstract class CustomerDetailsCustomControlBase extends CustomControlBase<ICustomControlToCustomerDetailsMessageTypeMap, ICustomerDetailsToCustomControlMessageTypeMap> {
        /**
         * The handler for the affiliation added message.
         * @remarks Derived classes should set the handler to execute functionality when a "AffiliationAdded" message is received.
         */
        protected affiliationAddedHandler: (data: CustomerDetailsAffiliationAddedData) => void;
        /**
         * The handler for the loyalty cards loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "LoyaltyCardsLoaded" message is received.
         */
        protected loyaltyCardsLoadedHandler: (data: CustomerDetailsLoyaltyCardsLoadedData) => void;
        /**
         * The handler for the wish lists loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "WishListsLoaded" message is received.
         */
        protected wishListsLoadedHandler: (data: CustomerDetailsWishListsLoadedData) => void;
        private _isVisible;
        /**
         * Creates a new instance of the CustomerDetailsCustomControlBase class.
         * @param {string} id The control identifier.
         * @param {ICustomerDetailsCustomControlContext} context The control context.
         */
        constructor(id: string, context: ICustomerDetailsCustomControlContext);
        /**
         * Gets a value indicating whether or not the custom control is visible.
         * @return {boolean} True if the command is visible. False otherwise.
         */
        protected get isVisible(): boolean;
        /**
         * Sets a value indicating whether or not the custom control is visible.
         * @param {boolean} value True if the command is visble. False otherwise.
         */
        protected set isVisible(value: boolean);
        /**
         * Initializes the custom control.
         * @param {ICustomerDetailsCustomControlState} state The initial state for the custom control.
         */
        protected abstract init(state: ICustomerDetailsCustomControlState): void;
    }
}
declare module "PosApi/Extend/Views/FulfillmentLineView" {
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ProxyEntities } from "PosApi/Entities";
    export import IFulfillmentLineExtensionCommandState = Commerce.Extensibility.IFulfillmentLineExtensionCommandState;
    export import IFulfillmentLineToExtensionCommandMessageTypeMap = Commerce.Extensibility.IFulfillmentLineToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToFulfillmentLineMessageTypeMap = Commerce.Extensibility.IExtensionCommandToFulfillmentLineMessageTypeMap;
    export import FulfillmentLinesSelectedData = Commerce.Extensibility.FulfillmentLinesSelectedData;
    export import FulfillmentLinePackingSlipSelectedData = Commerce.Extensibility.FulfillmentLinePackingSlipSelectedData;
    export import SetSelectedFulfillmentLinesData = Commerce.Extensibility.SetSelectedFulfillmentLinesData;
    export import FulfillmentLinesLoadedData = Commerce.Extensibility.FulfillmentLinesLoadedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IFulfillmentLineExtensionCommandContext extends IExtensionCommandContext<IFulfillmentLineToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToFulfillmentLineMessageTypeMap, IFulfillmentLineToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the FulfillmentLine page.
     * @remarks All commands added to the FulfillmentLine page should derive from this class.
     */
    export abstract class FulfillmentLineExtensionCommandBase extends ExtensionCommandBase<IFulfillmentLineToExtensionCommandMessageTypeMap> {
        protected readonly context: IFulfillmentLineExtensionCommandContext;
        /**
         * The handler for the fulfillment lines selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "FulfillmentLinesSelected" message is received.
         */
        protected fulfillmentLinesSelectionHandler: (data: FulfillmentLinesSelectedData) => void;
        /**
         * The handler for the fulfillment lines selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "FulfillmentLinesSelectionCleared" message is received.
         */
        protected fulfillmentLinesSelectionClearedHandler: () => void;
        /**
         * The handler for the packing slip selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "PackingSlipSelected" message is received.
         */
        protected packingSlipSelectedHandler: (data: FulfillmentLinePackingSlipSelectedData) => void;
        /**
         * The handler for the packing slip selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "PackingSlipSelectionCleared" message is received.
         */
        protected packingSlipSelectionClearedHandler: () => void;
        /**
         * The handler for the FulfillmentLinesLoaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "FulfillmentLinesLoaded" message is received.
         */
        protected fulfillmentLinesLoadedHandler: (data: FulfillmentLinesLoadedData) => void;
        /**
         * Creates a new instance of the FulfillmentLineExtensionCommandBase class.
         * @param {IFulfillmentLineExtensionCommandContext} context The command context.
         */
        constructor(context: IFulfillmentLineExtensionCommandContext);
        /**
         * Refreshes the fulfillment lines shown on the page.
         */
        protected refreshFulfillmentLines(): void;
        /**
         * Selects the fulfillment lines shown on the page.
         * @param {SetSelectedFulfillmentLinesData} setSelectedFulfillmentLinesData The SetSelectedFulfillmentLines message data.
         */
        protected setSelectedFulfillmentLines(setSelectedFulfillmentLinesData: SetSelectedFulfillmentLinesData): void;
    }
    /**
     * Represents a column to display in the fulfillment lines list on FulfillmentLineView.
     */
    export interface IFulfillmentLinesListColumn extends ICustomListColumn<ProxyEntities.FulfillmentLine> {
    }
}
declare module "PosApi/Extend/Views/HealthCheckView" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    export import IHealthCheckEntity = Commerce.Client.Entities.IHealthCheckEntity;
    export import IHealthCheckStatus = Commerce.Client.Entities.IHealthCheckStatus;
    export import IHealthCheckSetupDetail = Commerce.Extensibility.IHealthCheckSetupDetail;
    export import ICustomHealthCheckEntity = Commerce.Extensibility.ICustomHealthCheckEntity;
    export interface ICustomHealthCheckContext extends IExtensionContext {
    }
    /**
     * The custom health check base class.
     */
    export abstract class CustomHealthCheckBase implements ICustomHealthCheckEntity {
        readonly name: string;
        readonly entityType: string;
        readonly setupDetails: IHealthCheckSetupDetail[];
        /**
         * The health check extension context.
         */
        protected readonly context: ICustomHealthCheckContext;
        /**
         * Creates a new instance of the class.
         * @param {ICustomHealthCheckContext} context The extension context.
         * @param {string} name The health check name.
         * @param {string} entityType The health check entity type.
         * @param {IHealthCheckSetupDetail[]} setupDetails The list of health check setup items.
         */
        constructor(context: ICustomHealthCheckContext, name: string, entityType: string, setupDetails: IHealthCheckSetupDetail[]);
        /**
         * Executes the health check test.
         * @returns {Promise<IHealthCheckStatus>} The promise containing the health check status.
         */
        abstract executeHealthCheckAsync(): Promise<IHealthCheckStatus>;
    }
}
declare module "PosApi/Extend/Views/InventoryDocumentListView" {
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    export import IInventoryDocumentListExtensionCommandState = Commerce.Extensibility.IInventoryDocumentListExtensionCommandState;
    export import IInventoryDocumentListToExtensionCommandMessageTypeMap = Commerce.Extensibility.IInventoryDocumentListToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToInventoryDocumentListMessageTypeMap = Commerce.Extensibility.IExtensionCommandToInventoryDocumentListMessageTypeMap;
    export import InventoryDocumentListInventoryDocumentsLoadedData = Commerce.Extensibility.InventoryDocumentListInventoryDocumentsLoadedData;
    export import InventoryDocumentListDocumentSelectedData = Commerce.Extensibility.InventoryDocumentListDocumentSelectedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IInventoryDocumentListExtensionCommandContext extends IExtensionCommandContext<IInventoryDocumentListToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToInventoryDocumentListMessageTypeMap, IInventoryDocumentListToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the inventory document list page.
     * @remarks All commands added to the InventoryDocumentList page should derive from this class.
     */
    export abstract class InventoryDocumentListExtensionCommandBase extends ExtensionCommandBase<IInventoryDocumentListToExtensionCommandMessageTypeMap> {
        protected readonly context: IInventoryDocumentListExtensionCommandContext;
        /**
         * The handler for the inventory documents loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "InventoryDocumentsLoaded" message is received.
         */
        protected inventoryDocumentsLoadedHandler: (data: InventoryDocumentListInventoryDocumentsLoadedData) => void;
        /**
         * The handler for the document selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "DocumentSelected" message is received.
         */
        protected documentSelectedHandler: (data: InventoryDocumentListDocumentSelectedData) => void;
        /**
         * The handler for the document selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "DocumentSelectionCleared" message is received.
         */
        protected documentSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the InventoryDocumentListExtensionCommandBase class.
         * @param {IInventoryDocumentListExtensionCommandContext} context The command context.
         */
        constructor(context: IInventoryDocumentListExtensionCommandContext);
    }
}
declare module "PosApi/Extend/Views/InventoryDocumentShippingAndReceivingView" {
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    export import IInventoryDocumentShippingAndReceivingExtensionCommandState = Commerce.Extensibility.IInventoryDocumentShippingAndReceivingExtensionCommandState;
    export import IInventoryDocumentShippingAndReceivingToExtensionCommandMessageTypeMap = Commerce.Extensibility.IInventoryDocumentShippingAndReceivingToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToInventoryDocumentShippingAndReceivingMessageTypeMap = Commerce.Extensibility.IExtensionCommandToInventoryDocumentShippingAndReceivingMessageTypeMap;
    export import DocumentLinesSelectedData = Commerce.Extensibility.DocumentLinesSelectedData;
    export import PackingSlipSelectedData = Commerce.Extensibility.InventoryDocumentShippingAndReceivingPackingSlipSelectedData;
    export import DocumentLinesLoadedData = Commerce.Extensibility.DocumentLinesLoadedData;
    export import DocumentLineUpdatedData = Commerce.Extensibility.DocumentLineUpdatedData;
    export import ModeUpdatedData = Commerce.Extensibility.ModeUpdatedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IInventoryDocumentShippingAndReceivingExtensionCommandContext extends IExtensionCommandContext<IInventoryDocumentShippingAndReceivingToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToInventoryDocumentShippingAndReceivingMessageTypeMap, IInventoryDocumentShippingAndReceivingToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the InventoryDocumentShippingAndReceiving page.
     * @remarks All commands added to the InventoryDocumentShippingAndReceiving page should derive from this class.
     */
    export abstract class InventoryDocumentShippingAndReceivingExtensionCommandBase extends ExtensionCommandBase<IInventoryDocumentShippingAndReceivingToExtensionCommandMessageTypeMap> {
        protected readonly context: IInventoryDocumentShippingAndReceivingExtensionCommandContext;
        /**
         * The handler for the mode updated message.
         * @remarks Derived classes should set the handler to execute functionality when a "ModeUpdated" message is received.
         */
        protected modeUpdatedHandler: (data: ModeUpdatedData) => void;
        /**
         * The handler for the document lines selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "DocumentLinesSelected" message is received.
         */
        protected documentLinesSelectedHandler: (data: DocumentLinesSelectedData) => void;
        /**
         * The handler for the document lines selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "DocumentLinesSelectionCleared" message is received.
         */
        protected documentLinesSelectionClearedHandler: () => void;
        /**
         * The handler for the packing slip selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "PackingSlipSelected" message is received.
         */
        protected packingSlipSelectedHandler: (data: PackingSlipSelectedData) => void;
        /**
         * The handler for the packing slip selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "PackingSlipSelectionCleared" message is received.
         */
        protected packingSlipSelectionClearedHandler: () => void;
        /**
         * The handler for the document lines loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "DocumentLinesLoaded" message is received.
         */
        protected documentLinesLoadedHandler: (data: DocumentLinesLoadedData) => void;
        /**
         * The handler for the document lines updated message.
         * @remarks Derived classes should set the handler to execute functionality when a "DocumentLineUpdated" message is received.
         */
        protected documentLineUpdatedHandler: (data: DocumentLineUpdatedData) => void;
        /**
         * Creates a new instance of the InventoryDocumentShippingAndReceivingExtensionCommandBase class.
         * @param {IInventoryDocumentShippingAndReceivingExtensionCommandContext} context The command context.
         */
        constructor(context: IInventoryDocumentShippingAndReceivingExtensionCommandContext);
        /**
         * Refreshes the document lines shown on the page.
         */
        protected refreshDocumentLines(): void;
    }
}
declare module "PosApi/Extend/Views/MenuCommands" {
    import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    export import IExtensionMenuCommandMessageTypeMap = Commerce.Extensibility.IExtensionMenuCommandMessageTypeMap;
    export import IViewToExtensionMenuCommandMessageTypeMap = Commerce.Extensibility.IViewToExtensionMenuCommandMessageTypeMap;
    export import IExtensionMenuCommand = Commerce.Extensibility.IExtensionMenuCommand;
    /**
     * Represents the menu command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IExtensionMenuCommandContext<TCommandToPageMap extends IExtensionMenuCommandMessageTypeMap, TPageToCommandMap extends IViewToExtensionMenuCommandMessageTypeMap> extends IExtensionContext {
        messageChannel: IMessageChannelEndpoint<TCommandToPageMap, TPageToCommandMap>;
    }
    /**
     * Represents the base class for all extension menu commands.
     * Extension menu commands are used to add aditional items to existing POS menu controls that support extensions.
     */
    export abstract class ExtensionMenuCommandBase<TCommandToPageMap extends IExtensionMenuCommandMessageTypeMap, TPageToCommandMap extends IViewToExtensionMenuCommandMessageTypeMap> implements IExtensionMenuCommand {
        /**
         * The menu command identifier.
         */
        abstract readonly id: string;
        /**
         * The menu command label.
         * @remarks This is the label that represents the command in the menu.
         */
        abstract label: string;
        protected readonly context: IExtensionMenuCommandContext<TCommandToPageMap, TPageToCommandMap>;
        private _isProcessing;
        private _canExecute;
        /**
         * Creates a new instance of the ExtensionMenuCommandBase class.
         * @param {IExtensionMenuCommandContext<TCommandToPageMap, TPageToCommandMap>} context The command context.
         */
        constructor(context: IExtensionMenuCommandContext<TCommandToPageMap, TPageToCommandMap>);
        /**
         * Gets a value indicating whether or not the command is processing.
         * @return {boolean} True if the command is processing. False otherwise.
         */
        protected get isProcessing(): boolean;
        /**
         * Sets a value indicating whether or not the command is processing.
         * @param {boolean} value True if the command is processing. False otherwise.
         */
        protected set isProcessing(value: boolean);
        /**
         * Gets a value indicating whether or not the command is processing.
         * @return {boolean} True if the command can execute. False otherwise.
         */
        protected get canExecute(): boolean;
        /**
         * Sets a value indicating whether or not the command can execute.
         * @param {boolean} value True if the command can execute. False otherwise.
         */
        protected set canExecute(value: boolean);
        /**
         * Disposes the command releasing its resources.
         */
        dispose(): void;
        /**
         * Initializes the menu command.
         * @param {TPageToCommandMap["Initialize"]} context The command state.
         */
        protected abstract init(state: TPageToCommandMap["Initialize"]): void;
        /**
         * Executes the menu command.
         */
        protected abstract execute(): void;
    }
}
declare module "PosApi/Extend/Views/InventoryLookupMatrixView" {
    import { ExtensionMenuCommandBase, IExtensionMenuCommandContext } from "PosApi/Extend/Views/MenuCommands";
    export import IInventoryLookupMatrixExtensionMenuCommandState = Commerce.Extensibility.IInventoryLookupMatrixExtensionMenuCommandState;
    export import IInventoryLookupMatrixToExtensionMenuCommandMessageTypeMap = Commerce.Extensibility.IInventoryLookupMatrixToExtensionMenuCommandMessageTypeMap;
    export import IExtensionMenuCommandToInventoryLookupMatrixMessageTypeMap = Commerce.Extensibility.IExtensionMenuCommandToInventoryLookupMatrixMessageTypeMap;
    export import InventoryLookupMatrixItemAvailabilitySelectedData = Commerce.Extensibility.InventoryLookupMatrixItemAvailabilitySelectedData;
    export import InventoryLookupMatrixStoreChangedData = Commerce.Extensibility.InventoryLookupMatrixStoreChangedData;
    /**
     * Represents the command context. It contains the initial state of the command, and the message channel the command will use to communicate with POS.
     */
    export interface IInventoryLookupMatrixExtensionMenuCommandContext extends IExtensionMenuCommandContext<IExtensionMenuCommandToInventoryLookupMatrixMessageTypeMap, IInventoryLookupMatrixToExtensionMenuCommandMessageTypeMap> {
    }
    /**
     * Represents the base class for all extension menu commands on the InventoryLookupMatrixView.
     */
    export abstract class InventoryLookupMatrixExtensionMenuCommandBase extends ExtensionMenuCommandBase<IExtensionMenuCommandToInventoryLookupMatrixMessageTypeMap, IInventoryLookupMatrixToExtensionMenuCommandMessageTypeMap> {
        protected readonly context: IInventoryLookupMatrixExtensionMenuCommandContext;
        /**
         * The handler for the item availability selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "ItemAvailabilitySelected" message is received.
         */
        protected itemAvailabilitySelectedHandler: (data: InventoryLookupMatrixItemAvailabilitySelectedData) => void;
        /**
         * The handler for the store changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "StoreChanged" message is received.
         */
        protected storeChangedHandler: (data: InventoryLookupMatrixStoreChangedData) => void;
        /**
         * Creates a new instance of the InventoryLookupMatrixExtensionMenuCommandBase class.
         * @param {IInventoryLookupMatrixExtensionMenuCommandContext} context The menu command context.
         * @remarks All commands added to the inventory lookup matrix page should derive from this class.
         */
        constructor(context: IInventoryLookupMatrixExtensionMenuCommandContext);
        /**
         * Initializes the command.
         * @param {IInventoryLookupMatrixExtensionMenuCommandState} state The initial state for the command.
         */
        protected abstract init(state: IInventoryLookupMatrixExtensionMenuCommandState): void;
    }
}
declare module "PosApi/Extend/Views/InventoryLookupView" {
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ProxyEntities } from "PosApi/Entities";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    export import IInventoryLookupExtensionCommandState = Commerce.Extensibility.IInventoryLookupExtensionCommandState;
    export import IInventoryLookupToExtensionCommandMessageTypeMap = Commerce.Extensibility.IInventoryLookupToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToInventoryLookupMessageTypeMap = Commerce.Extensibility.IExtensionCommandToInventoryLookupMessageTypeMap;
    export import InventoryLookupProductChangedData = Commerce.Extensibility.InventoryLookupProductChangedData;
    export import InventoryLookupLocationSelectedData = Commerce.Extensibility.InventoryLookupLocationSelectedData;
    /**
     * Represents the command context. It contains the initial state of the command, and the message channel the command will use to communicate with POS.
     */
    export interface IInventoryLookupExtensionCommandContext extends IExtensionCommandContext<IInventoryLookupToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToInventoryLookupMessageTypeMap, IInventoryLookupToExtensionCommandMessageTypeMap>;
    }
    export abstract class InventoryLookupExtensionCommandBase extends ExtensionCommandBase<IInventoryLookupToExtensionCommandMessageTypeMap> {
        protected readonly context: IInventoryLookupExtensionCommandContext;
        /**
         * The handler for the product changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "ProductChanged" message is received.
         */
        protected productChangedHandler: (data: InventoryLookupProductChangedData) => void;
        /**
         * The handler for the location selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "LocationSelected" message is received.
         */
        protected locationSelectionHandler: (data: InventoryLookupLocationSelectedData) => void;
        /**
         * The handler for the location selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "LocationSelectionCleared" message is received.
         */
        protected locationSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the InventoryLookupExtensionCommandBase class.
         * @param {IInventoryLookupExtensionCommandContext} context The command context.
         * @remarks All commands added to the inventory lookup page should derive from this class.
         */
        constructor(context: IInventoryLookupExtensionCommandContext);
    }
    /**
     * Represents a column to display in the Stores list on InventoryLookupView.
     */
    export interface IInventoryByStoreListColumn extends ICustomListColumn<ProxyEntities.OrgUnitAvailability> {
    }
}
declare module "PosApi/Extend/Views/ManageShiftsView" {
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    export import IManageShiftsExtensionCommandState = Commerce.Extensibility.IManageShiftsExtensionCommandState;
    export import IManageShiftsToExtensionCommandMessageTypeMap = Commerce.Extensibility.IManageShiftsToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToManageShiftsMessageTypeMap = Commerce.Extensibility.IExtensionCommandToManageShiftsMessageTypeMap;
    export import ShiftSelectedData = Commerce.Extensibility.ShiftSelectedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IManageShiftsExtensionCommandContext extends IExtensionCommandContext<IManageShiftsToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToManageShiftsMessageTypeMap, IManageShiftsToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the  ManageShifts page.
     * @remarks All commands added to the  ManageShifts page should derive from this class.
     */
    export abstract class ManageShiftsExtensionCommandBase extends ExtensionCommandBase<IManageShiftsToExtensionCommandMessageTypeMap> {
        protected readonly context: IManageShiftsExtensionCommandContext;
        /**
         * The handler for the shift selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "ShiftSelected" message is received.
         */
        protected shiftSelectedHandler: (data: ShiftSelectedData) => void;
        /**
         * The handler for the shifts selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "ShiftSelectionCleared" message is received.
         */
        protected shiftSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the ManageShiftsExtensionCommandBase class.
         * @param {IManageShiftsExtensionCommandContext} context The command context.
         */
        constructor(context: IManageShiftsExtensionCommandContext);
        /**
         * Refreshes the shifts shown on the page.
         */
        protected refreshShifts(): void;
    }
}
declare module "PosApi/Extend/Views/PaymentView" {
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    export import IPaymentViewToExtensionCommandMessageTypeMap = Commerce.Extensibility.IPaymentViewToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToPaymentViewMessageTypeMap = Commerce.Extensibility.IExtensionCommandToPaymentViewMessageTypeMap;
    export import IPaymentViewExtensionCommandState = Commerce.Extensibility.IPaymentViewExtensionCommandState;
    export import PaymentViewPaymentCardChanged = Commerce.Extensibility.PaymentViewPaymentCardChanged;
    export import PaymentViewAmountChanged = Commerce.Extensibility.PaymentViewAmountChanged;
    export import GiftCardBalanceCheckedData = Commerce.Extensibility.GiftCardBalanceCheckedData;
    export import UpdatePaymentAmountData = Commerce.Extensibility.UpdatePaymentAmountData;
    /**
     * Represents the command context. It contains the initial state of the command, and the message channel the command will use to communicate with POS.
     */
    export interface IPaymentViewExtensionCommandContext extends IExtensionCommandContext<IPaymentViewToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToPaymentViewMessageTypeMap, IPaymentViewToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the customer add/edit page.
     * @remarks All commands added to the customer add/edit page should derive from this class.
     */
    export abstract class PaymentViewExtensionCommandBase extends ExtensionCommandBase<IPaymentViewToExtensionCommandMessageTypeMap> {
        protected readonly context: IPaymentViewExtensionCommandContext;
        /**
         * The handler for the payment card changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "PaymentCardChanged" message is received.
         */
        protected paymentViewPaymentCardChangedHandler: (data: PaymentViewPaymentCardChanged) => void;
        /**
         * The handler for the payment amount changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "PaymentAmountChanged" message is received.
         */
        protected paymentViewAmountChangedHandler: (data: PaymentViewAmountChanged) => void;
        /**
         * The handler for the gift card balance checked message.
         * @remarks Derived classes should set the handler to execute functionality when a "GiftCardBalanceChecked" message is received.
         */
        protected giftCardBalanceCheckedHandler: (data: GiftCardBalanceCheckedData) => void;
        /**
         * Creates a new instance of the PaymentExtensionCommandBase class.
         * @param {IPaymentExtensionCommandContext} context The command context.
         */
        constructor(context: IPaymentViewExtensionCommandContext);
        /**
         * Updates the payment amount shown on the page.
         * @param {UpdatePaymentAmountData} data The new payment amount data.
         */
        protected updatePaymentAmount(data: UpdatePaymentAmountData): void;
    }
}
declare module "PosApi/Extend/Views/PickingAndReceivingDetailsView" {
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ClientEntities } from "PosApi/Entities";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    export import IPickingAndReceivingDetailsExtensionCommandState = Commerce.Extensibility.IPickingAndReceivingDetailsExtensionCommandState;
    export import IPickingAndReceivingDetailsToExtensionCommandMessageTypeMap = Commerce.Extensibility.IPickingAndReceivingDetailsToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToPickingAndReceivingDetailsMessageTypeMap = Commerce.Extensibility.IExtensionCommandToPickingAndReceivingDetailsMessageTypeMap;
    export import JournalSavedData = Commerce.Extensibility.JournalSavedData;
    export import JournalLineSelectedData = Commerce.Extensibility.JournalLineSelectedData;
    export import JournalLinesChangedData = Commerce.Extensibility.JournalLinesChangedData;
    export import PickingAndReceivingDetailsReceiptSelectedData = Commerce.Extensibility.PickingAndReceivingDetailsReceiptSelectedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IPickingAndReceivingDetailsExtensionCommandContext extends IExtensionCommandContext<IPickingAndReceivingDetailsToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToPickingAndReceivingDetailsMessageTypeMap, IPickingAndReceivingDetailsToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the picking and receiving details page.
     * @remarks All commands added to the picking and receiving details page should derive from this class.
     */
    export abstract class PickingAndReceivingDetailsExtensionCommandBase extends ExtensionCommandBase<IPickingAndReceivingDetailsToExtensionCommandMessageTypeMap> {
        protected readonly context: IPickingAndReceivingDetailsExtensionCommandContext;
        /**
         * The handler for the journal saved message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalSaved" message is received.
         */
        protected journalSavedHandler: (data: JournalSavedData) => void;
        /**
         * The handler for the order line selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalLineSelected" message is received.
         */
        protected journalLineSelectedHandler: (data: JournalLineSelectedData) => void;
        /**
         * The handler for the order line selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalLineSelectionCleared" message is received.
         */
        protected journalLineSelectionClearedHandler: () => void;
        /**
         * The handler for the order lines changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalLinesChanged" message is received.
         */
        protected journalLinesChangedHandler: (data: JournalLinesChangedData) => void;
        /**
         * The handler for the receipt selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "ReceiptSelected" message is received.
         */
        protected receiptSelectionHandler: (data: PickingAndReceivingDetailsReceiptSelectedData) => void;
        /**
         * The handler for the receipt selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "ReceiptSelectionCleared" message is received.
         */
        protected receiptSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the PickingAndReceivingDetailsExtensionCommandBase class.
         * @param {IPickingAndReceivingDetailsExtensionCommandContext} context The command context.
         */
        constructor(context: IPickingAndReceivingDetailsExtensionCommandContext);
    }
    /**
     * Represents a column to display in the order lines list on PickingAndReceivingDetailsView.
     */
    export interface IOrderLinesListColumn extends ICustomListColumn<ClientEntities.IPickingAndReceivingOrderLine> {
    }
}
declare module "PosApi/Extend/Views/PriceCheckView" {
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { CustomControlBase, ICustomControlContext } from "PosApi/Extend/Views/CustomControls";
    export import IPriceCheckToExtensionCommandMessageTypeMap = Commerce.Extensibility.IPriceCheckToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToPriceCheckMessageTypeMap = Commerce.Extensibility.IExtensionCommandToPriceCheckMessageTypeMap;
    export import IPriceCheckExtensionCommandState = Commerce.Extensibility.IPriceCheckExtensionCommandState;
    export import PriceCheckPriceCheckCompletedData = Commerce.Extensibility.PriceCheckPriceCheckCompletedData;
    export import PriceCheckCustomerChangedData = Commerce.Extensibility.PriceCheckCustomerChangedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IPriceCheckExtensionCommandContext extends IExtensionCommandContext<IPriceCheckToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToPriceCheckMessageTypeMap, IPriceCheckToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the price check page.
     * @remarks All commands added to the customer price check page should derive from this class.
     */
    export abstract class PriceCheckExtensionCommandBase extends ExtensionCommandBase<IPriceCheckToExtensionCommandMessageTypeMap> {
        protected readonly context: IPriceCheckExtensionCommandContext;
        /**
         * The handler for the product changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "PriceCheckCompleted" message is received.
         */
        protected priceCheckCompletedHandler: (data: PriceCheckPriceCheckCompletedData) => void;
        /**
         * The handler for the customer changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "CustomerChanged" message is received.
         */
        protected customerChangedHandler: (customer: PriceCheckCustomerChangedData) => void;
        /**
         * Creates a new instance of the PriceCheckExtensionCommandBase class.
         * @param {IPriceCheckExtensionCommandContext} context The command context.
         */
        constructor(context: IPriceCheckExtensionCommandContext);
    }
    export import IPriceCheckToCustomControlMessageTypeMap = Commerce.Extensibility.IPriceCheckToCustomControlMessageTypeMap;
    export import ICustomControlToPriceCheckMessageTypeMap = Commerce.Extensibility.ICustomControlToPriceCheckMessageTypeMap;
    export import IPriceCheckCustomControlState = Commerce.Extensibility.IPriceCheckCustomControlState;
    /**
     * Represents the Price Check custom control context. It contains message channel it will use to communicate with POS.
     */
    export interface IPriceCheckCustomControlContext extends ICustomControlContext<ICustomControlToPriceCheckMessageTypeMap, IPriceCheckToCustomControlMessageTypeMap> {
    }
    /**
     * Represents the base class for all extension controls on the price check view page.
     * @remarks Custom controls in extensions should derive from this class.
     */
    export abstract class PriceCheckCustomControlBase extends CustomControlBase<ICustomControlToPriceCheckMessageTypeMap, IPriceCheckToCustomControlMessageTypeMap> {
        /**
         * The handler for the product changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "PriceCheckCompleted" message is received.
         */
        protected priceCheckCompletedHandler: (data: PriceCheckPriceCheckCompletedData) => void;
        /**
         * The handler for the customer changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "CustomerChanged" message is received.
         */
        protected customerChangedHandler: (customer: PriceCheckCustomerChangedData) => void;
        private _isVisible;
        /**
         * Creates a new instance of the PriceCheckCustomControlBase class.
         * @param {string} id The control identifier.
         * @param {IPriceCheckCustomControlContext} context The control context.
         */
        constructor(id: string, context: IPriceCheckCustomControlContext);
        /**
         * Gets a value indicating whether or not the custom control is visible.
         * @return {boolean} True if the custom control is visible. False otherwise.
         */
        protected get isVisible(): boolean;
        /**
         * Sets a value indicating whether or not the custom control is visible.
         * @param {boolean} value True if the custom control is visible. False otherwise.
         */
        protected set isVisible(value: boolean);
        /**
         * Initializes the custom control.
         * @param {IPriceCheckCustomControlState} state The initial state for the custom control.
         */
        protected abstract init(state: IPriceCheckCustomControlState): void;
    }
}
declare module "PosApi/Extend/Views/ReportDetailsView" {
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    export import IReportDetailsExtensionCommandState = Commerce.Extensibility.IReportDetailsExtensionCommandState;
    export import IReportDetailsToExtensionCommandMessageTypeMap = Commerce.Extensibility.IReportDetailsToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToReportDetailsMessageTypeMap = Commerce.Extensibility.IExtensionCommandToReportDetailsMessageTypeMap;
    export import ReportDataLoadedData = Commerce.Extensibility.ReportDataLoadedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IReportDetailsExtensionCommandContext extends IExtensionCommandContext<IReportDetailsToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToReportDetailsMessageTypeMap, IReportDetailsToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the report details page.
     * @remarks All commands added to the report details page should derive from this class.
     */
    export abstract class ReportDetailsExtensionCommandBase extends ExtensionCommandBase<IReportDetailsToExtensionCommandMessageTypeMap> {
        protected readonly context: IReportDetailsExtensionCommandContext;
        /**
         * The handler for the ReportDataLoadedData message.
         * @remarks Derived classes should set the handler to execute functionality when a "ReportDataLoadedData" message is received.
         */
        protected reportDataLoadedDataHandler: (data: ReportDataLoadedData) => void;
        /**
         * Creates a new instance of the ReportDetailsExtensionCommandBase class.
         * @param {IReportDetailsExtensionCommandContext} context The command context.
         */
        constructor(context: IReportDetailsExtensionCommandContext);
    }
}
declare module "PosApi/Extend/Views/ResumeCartView" {
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ClientEntities } from "PosApi/Entities";
    export import IResumeCartExtensionCommandState = Commerce.Extensibility.IResumeCartExtensionCommandState;
    export import IResumeCartToExtensionCommandMessageTypeMap = Commerce.Extensibility.IResumeCartToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToResumeCartMessageTypeMap = Commerce.Extensibility.IExtensionCommandToResumeCartMessageTypeMap;
    export import ResumeCartSuspendedCartsSelectedData = Commerce.Extensibility.ResumeCartSuspendedCartsSelectedData;
    /**
     * Represents the command context. It contains the initial state of the command, and the message channel the command will use to communicate with POS.
     */
    export interface IResumeCartExtensionCommandContext extends IExtensionCommandContext<IResumeCartToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToResumeCartMessageTypeMap, IResumeCartToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the resume cart page.
     * @remarks All commands added to the resume cart page should derive from this class.
     */
    export abstract class ResumeCartExtensionCommandBase extends ExtensionCommandBase<IResumeCartToExtensionCommandMessageTypeMap> {
        protected readonly context: IResumeCartExtensionCommandContext;
        /**
         * The handler for the suspended carts selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "SuspendedCartsSelected" message is received.
         */
        protected suspendedCartsSelectedHandler: (data: ResumeCartSuspendedCartsSelectedData) => void;
        /**
         * The handler for the suspended carts selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "SuspendedCartsSelectionCleared" message is received.
         */
        protected suspendedCartsSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the ResumeCartExtensionCommandBase class.
         * @param {IResumeCartExtensionCommandContext} context The command context.
         */
        constructor(context: IResumeCartExtensionCommandContext);
    }
    /**
     * Represents a column to display in the suspended cart list on ResumeCartView.
     */
    export interface ISuspendedCartsListColumn extends ICustomListColumn<ClientEntities.ISuspendedCart> {
    }
}
declare module "PosApi/Extend/Views/ReturnTransactionView" {
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { ProxyEntities } from "PosApi/Entities";
    import { ICustomGridItemSubfieldContext, CustomGridItemSubfieldBase } from "PosApi/Extend/Views/CustomGridItemSubfield";
    export import IReturnTransactionExtensionCommandState = Commerce.Extensibility.IReturnTransactionExtensionCommandState;
    export import IReturnTransactionToExtensionCommandMessageTypeMap = Commerce.Extensibility.IReturnTransactionToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToReturnTransactionMessageTypeMap = Commerce.Extensibility.IExtensionCommandToReturnTransactionMessageTypeMap;
    export import ReturnTransactionTransactionLineSelectedData = Commerce.Extensibility.ReturnTransactionTransactionLineSelectedData;
    export import ReturnTransactionTransactionSelectedData = Commerce.Extensibility.ReturnTransactionTransactionSelectedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IReturnTransactionExtensionCommandContext extends IExtensionCommandContext<IReturnTransactionToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToReturnTransactionMessageTypeMap, IReturnTransactionToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the return transaction page.
     * @remarks All commands added to the return transaction page should derive from this class.
     */
    export abstract class ReturnTransactionExtensionCommandBase extends ExtensionCommandBase<IReturnTransactionToExtensionCommandMessageTypeMap> {
        protected readonly context: IReturnTransactionExtensionCommandContext;
        /**
         * The handler for the TransactionLineSelected message.
         * @remarks Derived classes should set the handler to execute functionality when a "TransactionLineSelected" message is received.
         */
        protected transactionLineSelectedHandler: (data: ReturnTransactionTransactionLineSelectedData) => void;
        /**
         * The handler for the TransactionLinesSelectionCleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "TransactionLinesSelectionCleared" message is received.
         */
        protected transactionLineSelectionClearedHandler: () => void;
        /**
         * The handler for the TransactionSelected message.
         * @remarks Derived classes should set the handler to execute functionality when a "TransactionSelected" message is received.
         */
        protected transactionSelectedHandler: (data: ReturnTransactionTransactionSelectedData) => void;
        /**
         * The handler for the TransactionSelectionCleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "TransactionSelectionCleared" message is received.
         */
        protected transactionSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the ReturnTransactionExtensionCommandBase class.
         * @param {IReturnTransactionExtensionCommandContext} context The command context.
         */
        constructor(context: IReturnTransactionExtensionCommandContext);
    }
    export interface ICustomSalesOrderLinesGridItemSubfieldContext extends ICustomGridItemSubfieldContext {
    }
    /**
     * The base class for lines grid custom column extension.
     */
    export abstract class CustomSalesOrderLinesGridItemSubfieldBase extends CustomGridItemSubfieldBase<ProxyEntities.SalesLine> {
    }
}
declare module "PosApi/Extend/Views/SalesInvoiceDetailsView" {
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    export import ISalesInvoiceDetailsExtensionCommandState = Commerce.Extensibility.ISalesInvoiceDetailsExtensionCommandState;
    export import ISalesInvoiceDetailsToExtensionCommandMessageTypeMap = Commerce.Extensibility.ISalesInvoiceDetailsToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToSalesInvoiceDetailsMessageTypeMap = Commerce.Extensibility.IExtensionCommandToSalesInvoiceDetailsMessageTypeMap;
    export import InvoiceLinesSelectedData = Commerce.Extensibility.InvoiceLinesSelectedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface ISalesInvoiceDetailsExtensionCommandContext extends IExtensionCommandContext<ISalesInvoiceDetailsToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToSalesInvoiceDetailsMessageTypeMap, ISalesInvoiceDetailsToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the sales invoice details page.
     * @remarks All commands added to the SalesInvoiceDetails page should derive from this class.
     */
    export abstract class SalesInvoiceDetailsExtensionCommandBase extends ExtensionCommandBase<ISalesInvoiceDetailsToExtensionCommandMessageTypeMap> {
        protected readonly context: ISalesInvoiceDetailsExtensionCommandContext;
        /**
         * The handler for the invoice lines selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "InvoiceLinesSelected" message is received.
         */
        protected invoiceLinesSelectionHandler: (data: InvoiceLinesSelectedData) => void;
        /**
         * The handler for the invoice line selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "InvoiceLineSelectionCleared" message is received.
         */
        protected invoiceLineSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the SalesInvoiceDetailsExtensionCommandBase class.
         * @param {ISalesInvoiceDetailsExtensionCommandContext} context The command context.
         */
        constructor(context: ISalesInvoiceDetailsExtensionCommandContext);
    }
}
declare module "PosApi/Extend/Views/SalesInvoicesView" {
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ProxyEntities } from "PosApi/Entities";
    /**
     * Represents a column to display in the sales invoices list on SalesInvoicesView.
     */
    export interface ISalesInvoicesListColumn extends ICustomListColumn<ProxyEntities.SalesInvoice> {
    }
}
declare module "PosApi/Extend/Views/SearchOrdersView" {
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ClientEntities } from "PosApi/Entities";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    export import ISerchOrdersExtensionCommandState = Commerce.Extensibility.ISerchOrdersExtensionCommandState;
    export import ISearchOrdersToExtensionCommandMessageTypeMap = Commerce.Extensibility.ISearchOrdersToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToSearchOrdersMessageTypeMap = Commerce.Extensibility.IExtensionCommandToSearchOrdersMessageTypeMap;
    export import SearchOrdersSelectedData = Commerce.Extensibility.SearchOrdersSelectedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface ISearchOrdersExtensionCommandContext extends IExtensionCommandContext<ISearchOrdersToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToSearchOrdersMessageTypeMap, ISearchOrdersToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the search orders page.
     * @remarks All commands added to the search orders page should derive from this class.
     */
    export abstract class SearchOrdersExtensionCommandBase extends ExtensionCommandBase<ISearchOrdersToExtensionCommandMessageTypeMap> {
        protected readonly context: ISearchOrdersExtensionCommandContext;
        /**
         * The handler for the order selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "OrderSelected" message is received.
         * @deprecated
         */
        protected orderSelectionHandler: (data: SearchOrdersSelectedData) => void;
        /**
         * The handler for the order selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "OrderSelectionCleared" message is received.
         */
        protected orderSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the SearchOrdersExtensionCommandBase class.
         * @param {ISearchOrdersExtensionCommandContext} context The command context.
         */
        constructor(context: ISearchOrdersExtensionCommandContext);
    }
    /**
     * Represents a column to display in the Orders list on SearchOrdersView.
     */
    export interface IOrdersListColumn extends ICustomListColumn<ClientEntities.ISalesOrderDetails> {
    }
}
declare module "PosApi/Extend/Views/SearchPickingAndReceivingView" {
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ClientEntities } from "PosApi/Entities";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    export import ISearchPickingAndReceivingExtensionCommandState = Commerce.Extensibility.ISearchPickingAndReceivingExtensionCommandState;
    export import ISearchPickingAndReceivingToExtensionCommandMessageTypeMap = Commerce.Extensibility.ISearchPickingAndReceivingToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToSearchPickingAndReceivingMessageTypeMap = Commerce.Extensibility.IExtensionCommandToSearchPickingAndReceivingMessageTypeMap;
    export import OrderLineSelectedData = Commerce.Extensibility.OrderLineSelectedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface ISearchPickingAndReceivingExtensionCommandContext extends IExtensionCommandContext<ISearchPickingAndReceivingToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToSearchPickingAndReceivingMessageTypeMap, ISearchPickingAndReceivingToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the search picking and receiving page.
     * @remarks All commands added to the search picking and receiving page should derive from this class.
     */
    export abstract class SearchPickingAndReceivingExtensionCommandBase extends ExtensionCommandBase<ISearchPickingAndReceivingToExtensionCommandMessageTypeMap> {
        protected readonly context: ISearchPickingAndReceivingExtensionCommandContext;
        /**
         * The handler for the order selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "OrderLineSelected" message is received.
         */
        protected orderLineSelectedHandler: (data: OrderLineSelectedData) => void;
        /**
         * The handler for the order selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "OrderLineSelectionCleared" message is received.
         */
        protected orderLineSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the SearchPickingAndReceivingExtensionCommandBase class.
         * @param {ISearchPickingAndReceivingExtensionCommandContext} context The command context.
         */
        constructor(context: ISearchPickingAndReceivingExtensionCommandContext);
        /**
         * Refreshes the orders shown on the page.
         */
        protected refreshOrders(): void;
    }
    /**
     * Represents a column to display in the Orders list on SearchPickingAndReceivingView.
     */
    export interface IOrdersListColumn extends ICustomListColumn<ClientEntities.IPickingAndReceivingOrder> {
    }
}
declare module "PosApi/Extend/Views/SearchStockCountView" {
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ProxyEntities } from "PosApi/Entities";
    /**
     * Represents a column to display in the stock count list on SearchStockCountView.
     */
    export interface IStockCountJournalsListColumn extends ICustomListColumn<ProxyEntities.StockCountJournal> {
    }
}
declare module "PosApi/Extend/Views/SearchView" {
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { ProxyEntities } from "PosApi/Entities";
    /**
     * Represents a column to display in the list on the Product Search tab of SearchView.
     */
    export interface IProductSearchColumn extends ICustomListColumn<ProxyEntities.ProductSearchResult> {
    }
    /**
     * Represents a column to display in the list on the Product Search tab of SearchView.
     */
    export interface ICustomerSearchColumn extends ICustomListColumn<ProxyEntities.GlobalCustomer> {
    }
    export import IProductSearchToExtensionCommandMessageTypeMap = Commerce.Extensibility.IProductSearchToExtensionCommandMessageTypeMap;
    export import IProductSearchExtensionCommandState = Commerce.Extensibility.IProductSearchExtensionCommandState;
    export import ProductSearchSearchResultsLoadedData = Commerce.Extensibility.ProductSearchSearchResultsLoadedData;
    export import ProductSearchSearchResultSelectedData = Commerce.Extensibility.ProductSearchSearchResultSelectedData;
    /**
     * Represents the base class for all product search extension commands on the search page.
     * @remarks All product search commands added to the search page should derive from this class.
     */
    export abstract class ProductSearchExtensionCommandBase extends ExtensionCommandBase<IProductSearchToExtensionCommandMessageTypeMap> {
        /**
         * The handler for the search results loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "SearchResultsLoaded" message is received.
         */
        protected searchResultsLoadedHandler: (data: ProductSearchSearchResultsLoadedData) => void;
        /**
         * The handler for the search result selected loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "SearchResultSelected" message is received.
         */
        protected searchResultsSelectedHandler: (data: ProductSearchSearchResultSelectedData) => void;
        /**
         * The handler for the search result selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "SearchResultSelectionCleared" message is received.
         */
        protected searchResultSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the ProductSearchExtensionCommandBase class.
         * @param {IExtensionCommandContext<IProductSearchToExtensionCommandMessageTypeMap>} context The command context.
         */
        constructor(context: IExtensionCommandContext<IProductSearchToExtensionCommandMessageTypeMap>);
    }
    export import CustomerSearchSearchResultsLoadedData = Commerce.Extensibility.CustomerSearchSearchResultsLoadedData;
    export import CustomerSearchSearchResultSelectedData = Commerce.Extensibility.CustomerSearchSearchResultSelectedData;
    export import ICustomerSearchToExtensionCommandMessageTypeMap = Commerce.Extensibility.ICustomerSearchToExtensionCommandMessageTypeMap;
    export import ICustomerSearchExtensionCommandState = Commerce.Extensibility.ICustomerSearchExtensionCommandState;
    /**
     * Represents the base class for all customer search extension commands on the search page.
     * @remarks All customer search commands added to the search page should derive from this class.
     */
    export abstract class CustomerSearchExtensionCommandBase extends ExtensionCommandBase<ICustomerSearchToExtensionCommandMessageTypeMap> {
        /**
         * The handler for the search results loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "SearchResultsLoaded" message is received.
         */
        protected searchResultsLoadedHandler: (data: CustomerSearchSearchResultsLoadedData) => void;
        /**
         * The handler for the search result selected loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "SearchResultSelected" message is received.
         */
        protected searchResultsSelectedHandler: (data: CustomerSearchSearchResultSelectedData) => void;
        /**
         * The handler for the search result selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "SearchResultSelectionCleared" message is received.
         */
        protected searchResultSelectionClearedHandler: () => void;
        /**
         * Creates a new instance of the CustomerSearchExtensionCommandBase class.
         * @param {IExtensionCommandContext<ICustomerSearchToExtensionCommandMessageTypeMap>} context The command context.
         */
        constructor(context: IExtensionCommandContext<ICustomerSearchToExtensionCommandMessageTypeMap>);
    }
}
declare module "PosApi/Extend/Views/ShippingMethodsView" {
    import { ExtensionViewControllerBase, IExtensionViewControllerContext } from "PosApi/Extend/Views/ViewControllers";
    import { ProxyEntities } from "PosApi/Entities";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    export import IShippingMethodsViewToExtensionViewControllerMessageTypeMap = Commerce.Extensibility.IShippingMethodsViewToExtensionViewControllerMessageTypeMap;
    export import IExtensionViewControllerToShippingMethodsViewMessageTypeMap = Commerce.Extensibility.IExtensionViewControllerToShippingMethodsViewMessageTypeMap;
    export import ShippingAddressChangedData = Commerce.Extensibility.ShippingAddressChangedData;
    export import ShippingAddressUpdatedData = Commerce.Extensibility.ShippingAddressUpdatedData;
    export interface IExtensionShippingMethodsViewControllerContext extends IExtensionViewControllerContext<IExtensionViewControllerToShippingMethodsViewMessageTypeMap, IShippingMethodsViewToExtensionViewControllerMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionViewControllerToShippingMethodsViewMessageTypeMap, IShippingMethodsViewToExtensionViewControllerMessageTypeMap>;
    }
    /**
     * Represents the extension's shipping method view controller base class.
     * @remarks All view controller extensions for the cart view should derive from this class.
     */
    export abstract class ShippingMethodsExtensionViewControllerBase extends ExtensionViewControllerBase<IExtensionViewControllerToShippingMethodsViewMessageTypeMap, IShippingMethodsViewToExtensionViewControllerMessageTypeMap> {
        protected readonly context: IExtensionShippingMethodsViewControllerContext;
        /**
         * The handler for the shipping address changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "ShippingAddressChanged" message is received.
         */
        protected shippingAddressUpdatedHandler: (data: ShippingAddressUpdatedData) => void;
        private _shippingAddress;
        /**
         * Creates a new instance of the ShippingMethodsExtensionViewControllerBase class.
         * @param {IExtensionShippingMethodsViewControllerContext} context The view controller context.
         */
        constructor(context: IExtensionShippingMethodsViewControllerContext);
        /**
         * Gets the shipping address.
         * @return {Address} The shipping address.
         */
        protected get shippingAddress(): ProxyEntities.Address;
        /**
         * Sets the shipping address.
         * @param {Address} value Sets the shipping address and notifies the shipping methods view of the change.
         */
        protected set shippingAddress(value: ProxyEntities.Address);
    }
}
declare module "PosApi/Extend/Views/ShowJournalView" {
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ProxyEntities } from "PosApi/Entities";
    import { ICustomGridItemSubfieldContext, CustomGridItemSubfieldBase } from "PosApi/Extend/Views/CustomGridItemSubfield";
    export import IShowJournalExtensionCommandState = Commerce.Extensibility.IShowJournalExtensionCommandState;
    export import IShowJournalToExtensionCommandMessageTypeMap = Commerce.Extensibility.IShowJournalToExtensionCommandMessageTypeMap;
    export import ShowJournalJournalSelectedData = Commerce.Extensibility.ShowJournalJournalSelectedData;
    export import ShowJournalReceiptSelectedData = Commerce.Extensibility.ShowJournalReceiptSelectedData;
    export import ShowJournalJournalTransactionsLoadedData = Commerce.Extensibility.ShowJournalJournalTransactionsLoadedData;
    export abstract class ShowJournalExtensionCommandBase extends ExtensionCommandBase<IShowJournalToExtensionCommandMessageTypeMap> {
        /**
         * The handler for the journal selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalSelected" message is received.
         */
        protected journalSelectionHandler: (data: ShowJournalJournalSelectedData) => void;
        /**
         * The handler for the journal selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalSelectionCleared" message is received.
         */
        protected journalSelectionClearedHandler: () => void;
        /**
         * The handler for the receipt selected message.
         * @remarks Derived classes should set the handler to execute functionality when a "ReceiptSelected" message is received.
         */
        protected receiptSelectionHandler: (data: ShowJournalReceiptSelectedData) => void;
        /**
         * The handler for the receipt selection cleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "ReceiptSelectionCleared" message is received.
         */
        protected receiptSelectionClearedHandler: () => void;
        /**
         * The handler for the journal transactions loaded message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalTransactionsLoaded" message is received.
         */
        protected journalTransactionsLoadedHandler: (data: ShowJournalJournalTransactionsLoadedData) => void;
        /**
         * Creates a new instance of the ShowJournalExtensionCommandBase class.
         * @param {IExtensionCommandContext<IShowJournalToExtensionCommandMessageTypeMap>} context The command context.
         * @remarks All commands added to the show journal page should derive from this class.
         */
        constructor(context: IExtensionCommandContext<IShowJournalToExtensionCommandMessageTypeMap>);
        /**
         * Initializes the command.
         * @param {Extensibility.IShowJournalExtensionCommandState} state The initial state for the command.
         */
        protected abstract init(state: IShowJournalExtensionCommandState): void;
    }
    /**
     * Represents a column to display on a list of transactions, which is located in the top half of ShowJouralView.
     */
    export interface IShowJournalTransactionListColumn extends ICustomListColumn<ProxyEntities.Transaction> {
    }
    /**
     * Represents a column to display on a list of customer order history, which is located in the top half of ShowJouralView.
     */
    export interface IShowJournalCustomerOrderHistoryListColumn extends ICustomListColumn<ProxyEntities.SalesOrder> {
    }
    /**
     * Represents the default context for a lines grid extension.
     */
    export interface ICustomLinesGridItemSubfieldContext extends ICustomGridItemSubfieldContext {
    }
    /**
     * Represents the default context for a payments grid extension.
     */
    export interface ICustomPaymentsGridItemSubfieldContext extends ICustomGridItemSubfieldContext {
    }
    /**
     * The base class for lines grid custom column extension.
     */
    export abstract class CustomLinesGridItemSubfieldBase extends CustomGridItemSubfieldBase<ProxyEntities.SalesLine> {
    }
    /**
     * The base class for payments grid custom column extension.
     */
    export abstract class CustomPaymentsGridItemSubfieldBase extends CustomGridItemSubfieldBase<ProxyEntities.TenderLine> {
    }
}
declare module "PosApi/Extend/Views/SimpleProductDetailsView" {
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    import { CustomControlBase, ICustomControlContext } from "PosApi/Extend/Views/CustomControls";
    export import ISimpleProductDetailsToExtensionCommandMessageTypeMap = Commerce.Extensibility.ISimpleProductDetailsToExtensionCommandMessageTypeMap;
    export import SimpleProductDetailsProductChangedData = Commerce.Extensibility.SimpleProductDetailsProductChangedData;
    export import ISimpleProductDetailsExtensionCommandState = Commerce.Extensibility.ISimpleProductDetailsExtensionCommandState;
    export abstract class SimpleProductDetailsExtensionCommandBase extends ExtensionCommandBase<ISimpleProductDetailsToExtensionCommandMessageTypeMap> {
        /**
         * The handler for the product changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "ProductChanged" message is received.
         */
        protected productChangedHandler: (data: SimpleProductDetailsProductChangedData) => void;
        /**
         * Creates a new instance of the SimpleProductDetailsExtensionCommandBase class.
         * @param {IExtensionCommandContext<ISimpleProductDetailsToExtensionCommandMessageTypeMap>} context The command context.
         * @remarks All commands added to the simple product details page should derive from this class.
         */
        constructor(context: IExtensionCommandContext<ISimpleProductDetailsToExtensionCommandMessageTypeMap>);
        /**
         * Initializes the command.
         * @param {Extensibility.ISimpleProductDetailsExtensionCommandState} state The initial state for the command.
         */
        protected abstract init(state: ISimpleProductDetailsExtensionCommandState): void;
    }
    export import ISimpleProductDetailsToCustomControlMessageTypeMap = Commerce.Extensibility.ISimpleProductDetailsToCustomControlMessageTypeMap;
    export import ICustomControlToSimpleProductDetailsMessageTypeMap = Commerce.Extensibility.ICustomControlToSimpleProductDetailsMessageTypeMap;
    export import ISimpleProductDetailsCustomControlState = Commerce.Extensibility.ISimpleProductDetailsCustomControlState;
    /**
     * Represents the SimpleProduct details custom control context. It contains message channel it will use to communicate with POS.
     */
    export interface ISimpleProductDetailsCustomControlContext extends ICustomControlContext<ICustomControlToSimpleProductDetailsMessageTypeMap, ISimpleProductDetailsToCustomControlMessageTypeMap> {
    }
    /**
     * Represents the base class for all extension controls on the simple product details page.
     * @remarks Custom controls in extensions should derive from this class.
     */
    export abstract class SimpleProductDetailsCustomControlBase extends CustomControlBase<ICustomControlToSimpleProductDetailsMessageTypeMap, ISimpleProductDetailsToCustomControlMessageTypeMap> {
        /**
         * The handler for the product changed message.
         * @remarks Derived classes should set the handler to execute functionality when a "ProductChanged" message is received.
         */
        protected productChangedHandler: (data: SimpleProductDetailsProductChangedData) => void;
        private _isVisible;
        /**
         * Creates a new instance of the SimpleProductDetailsCustomControlBase class.
         * @param {string} id The control identifier.
         * @param {ISimpleProductDetailsCustomControlContext} context The control context.
         */
        constructor(id: string, context: ISimpleProductDetailsCustomControlContext);
        /**
         * Gets a value indicating whether or not the custom control is visible.
         * @return {boolean} True if the custom control is visible. False otherwise.
         */
        protected get isVisible(): boolean;
        /**
         * Sets a value indicating whether or not the custom control is visible.
         * @param {boolean} value True if the custom control is visble. False otherwise.
         */
        protected set isVisible(value: boolean);
        /**
         * Initializes the custom control.
         * @param {ISimpleProductDetailsCustomControlState} state The initial state for the custom control.
         */
        protected abstract init(state: ISimpleProductDetailsCustomControlState): void;
    }
}
declare module "PosApi/Extend/Views/StockCountDetailsView" {
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ClientEntities } from "PosApi/Entities";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    /**
     * Represents a column to display in the stock count lines on StockCountDetailsView.
     */
    export interface IStockCountLinesColumn extends ICustomListColumn<ClientEntities.IStockCountLine> {
    }
    export import IStockCountDetailsExtensionCommandState = Commerce.Extensibility.IStockCountDetailsExtensionCommandState;
    export import IStockCountDetailsToExtensionCommandMessageTypeMap = Commerce.Extensibility.IStockCountDetailsToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToStockCountDetailsMessageTypeMap = Commerce.Extensibility.IExtensionCommandToStockCountDetailsMessageTypeMap;
    export import StockCountDetailsJournalLineSelectedData = Commerce.Extensibility.StockCountDetailsJournalLineSelectedData;
    export import StockCountDetailsJournalLinesUpdatedData = Commerce.Extensibility.StockCountDetailsJournalLinesUpdatedData;
    export import StockCountDetailsJournalSavedData = Commerce.Extensibility.StockCountDetailsJournalSavedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface IStockCountDetailsExtensionCommandContext extends IExtensionCommandContext<IStockCountDetailsToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToStockCountDetailsMessageTypeMap, IStockCountDetailsToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the stock count details page.
     * @remarks All commands added to the stock count details page should derive from this class.
     */
    export abstract class StockCountDetailsExtensionCommandBase extends ExtensionCommandBase<IStockCountDetailsToExtensionCommandMessageTypeMap> {
        protected readonly context: IStockCountDetailsExtensionCommandContext;
        /**
         * The handler for the JournalLineSelected message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalLineSelected" message is received.
         */
        protected journalLineSelectedHandler: (data: StockCountDetailsJournalLineSelectedData) => void;
        /**
         * The handler for the JournalLineSelectionCleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalLineSelectionCleared" message is received.
         */
        protected journalLineSelectionClearedHandler: () => void;
        /**
         * The handler for the JournalLinesUpdated message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalLinesUpdated" message is received.
         */
        protected journalLinesUpdatedHandler: (data: StockCountDetailsJournalLinesUpdatedData) => void;
        /**
         * The handler for the JournalSaved message.
         * @remarks Derived classes should set the handler to execute functionality when a "JournalSaved" message is received.
         */
        protected journalSavedHandler: (data: StockCountDetailsJournalSavedData) => void;
        /**
         * Creates a new instance of the StockCountDetailsExtensionCommandBase class.
         * @param {IStockCountDetailsExtensionCommandContext} context The command context.
         */
        constructor(context: IStockCountDetailsExtensionCommandContext);
    }
}
declare module "PosApi/Extend/Views/TransferOrderDetailsView" {
    import { ICustomListColumn } from "PosApi/Extend/Views/CustomListColumns";
    import { ProxyEntities } from "PosApi/Entities";
    import { IMessageChannelEndpoint } from "PosApi/Framework/Messaging";
    import { ExtensionCommandBase, IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
    /**
     * Represents a column to display in the transfer order lines list on TransferOrderDetailsView.
     */
    export interface ITransferOrderLinesListColumn extends ICustomListColumn<ProxyEntities.TransferOrderLine> {
    }
    export import ITransferOrderDetailsExtensionCommandState = Commerce.Extensibility.ITransferOrderDetailsExtensionCommandState;
    export import ITransferOrderDetailsToExtensionCommandMessageTypeMap = Commerce.Extensibility.ITransferOrderDetailsToExtensionCommandMessageTypeMap;
    export import IExtensionCommandToTransferOrderDetailsMessageTypeMap = Commerce.Extensibility.IExtensionCommandToTransferOrderDetailsMessageTypeMap;
    export import TransferOrderLineSelectedData = Commerce.Extensibility.TransferOrderLineSelectedData;
    export import TransferOrderUpdatedData = Commerce.Extensibility.TransferOrderUpdatedData;
    /**
     * Represents the command context. It contains the message channel the command will use to communicate with POS.
     */
    export interface ITransferOrderDetailsExtensionCommandContext extends IExtensionCommandContext<ITransferOrderDetailsToExtensionCommandMessageTypeMap> {
        messageChannel: IMessageChannelEndpoint<IExtensionCommandToTransferOrderDetailsMessageTypeMap, ITransferOrderDetailsToExtensionCommandMessageTypeMap>;
    }
    /**
     * Represents the base class for all extension commands on the transfer order details page.
     * @remarks All commands added to the transfer order details page should derive from this class.
     */
    export abstract class TransferOrderDetailsExtensionCommandBase extends ExtensionCommandBase<ITransferOrderDetailsToExtensionCommandMessageTypeMap> {
        protected readonly context: ITransferOrderDetailsExtensionCommandContext;
        /**
         * The handler for the TransferOrderLineSelected message.
         * @remarks Derived classes should set the handler to execute functionality when a "TransferOrderLineSelected" message is received.
         */
        protected transferOrderLineSelectedHandler: (data: TransferOrderLineSelectedData) => void;
        /**
         * The handler for the TransferOrderLineSelectionCleared message.
         * @remarks Derived classes should set the handler to execute functionality when a "TransferOrderLineSelectionCleared" message is received.
         */
        protected transferOrderLineSelectionClearedHandler: () => void;
        /**
         * The handler for the TransferOrderUpdated message.
         * @remarks Derived classes should set the handler to execute functionality when a "TransferOrderUpdated" message is received.
         */
        protected transferOrderUpdatedHandler: (data: TransferOrderUpdatedData) => void;
        /**
         * Creates a new instance of the TransferOrderDetailsExtensionCommandBase class.
         * @param {ITransferOrderDetailsExtensionCommandContext} context The command context.
         */
        constructor(context: ITransferOrderDetailsExtensionCommandContext);
        /**
         * Refreshes the transfer order details shown on the page.
         */
        protected refreshTransferOrderDetails(): void;
    }
}
//# sourceMappingURL=Pos.Api.d.ts.map