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
System.register("PosApi/Entities", [], function (exports_1, context_1) {
    "use strict";
    var ProxyEntities, ClientEntities;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("ProxyEntities", ProxyEntities = Commerce.Proxy.Entities);
            exports_1("ClientEntities", ClientEntities = Commerce.Client.Entities);
        }
    };
});
System.register("PosApi/TypeExtensions", [], function (exports_2, context_2) {
    "use strict";
    var StringExtensions, ArrayExtensions, ObjectExtensions, DateExtensions;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            exports_2("StringExtensions", StringExtensions = Commerce.StringExtensions);
            exports_2("ArrayExtensions", ArrayExtensions = Commerce.ArrayExtensions);
            exports_2("ObjectExtensions", ObjectExtensions = Commerce.ObjectExtensions);
            exports_2("DateExtensions", DateExtensions = Commerce.DateExtensions);
        }
    };
});
System.register("PosApi/Consume/Authentication", [], function (exports_3, context_3) {
    "use strict";
    var LogOffOperationRequest, LogOffOperationResponse, LockRegisterOperationRequest, LockRegisterOperationResponse;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            exports_3("LogOffOperationRequest", LogOffOperationRequest = Commerce.LogOffOperationRequest);
            exports_3("LogOffOperationResponse", LogOffOperationResponse = Commerce.LogOffOperationResponse);
            exports_3("LockRegisterOperationRequest", LockRegisterOperationRequest = Commerce.LockRegisterOperationRequest);
            exports_3("LockRegisterOperationResponse", LockRegisterOperationResponse = Commerce.LockRegisterOperationResponse);
        }
    };
});
System.register("PosApi/Consume/Cart", [], function (exports_4, context_4) {
    "use strict";
    var AddPreprocessedTenderLineToCartClientRequest, AddPreprocessedTenderLineToCartClientResponse, AddTenderLineToCartClientRequest, AddTenderLineToCartClientResponse, ConcludeTransactionClientRequest, ConcludeTransactionClientResponse, GetCurrentCartClientRequest, GetCurrentCartClientResponse, GetKeyedInPriceClientRequest, GetKeyedInPriceClientResponse, GetKeyedInQuantityClientRequest, GetKeyedInQuantityClientResponse, GetPickupDateClientRequest, GetPickupDateClientResponse, GetReasonCodeLinesClientRequest, GetReasonCodeLinesClientResponse, GetReceiptEmailAddressClientRequest, GetReceiptEmailAddressClientResponse, GetShippingChargeClientRequest, GetShippingChargeClientResponse, GetShippingDateClientRequest, GetShippingDateClientResponse, RefreshCartClientRequest, RefreshCartClientResponse, ResumeSuspendedCartClientRequest, ResumeSuspendedCartClientResponse, SaveAttributesOnCartClientRequest, SaveAttributesOnCartClientResponse, SaveAttributesOnCartLinesClientRequest, SaveAttributesOnCartLinesClientResponse, SaveExtensionPropertiesOnCartClientRequest, SaveExtensionPropertiesOnCartClientResponse, SaveExtensionPropertiesOnCartLinesClientRequest, SaveExtensionPropertiesOnCartLinesClientResponse, SaveReasonCodeLinesOnCartClientRequest, SaveReasonCodeLinesOnCartClientResponse, SaveReasonCodeLinesOnCartLinesClientRequest, SaveReasonCodeLinesOnCartLinesClientResponse, SelectSalesLinesForPickUpClientRequest, SelectSalesLinesForPickUpClientResponse, SetCartAttributesClientRequest, SetCartAttributesClientResponse, ShowChangeDueClientRequest, ShowChangeDueClientResponse, AddAffiliationOperationRequest, AddAffiliationOperationResponse, AddCouponsOperationRequest, AddCouponsOperationResponse, AddExpenseAccountLineToCartOperationRequest, AddExpenseAccountLineToCartOperationResponse, AddItemToCartOperationResponse, AddItemToCartOperationRequest, AddLoyaltyCardToCartOperationRequest, AddLoyaltyCardToCartOperationResponse, CalculateTotalOperationRequest, CalculateTotalOperationResponse, CarryoutSelectedProductsOperationRequest, CarryoutSelectedProductsOperationResponse, ChangeCartLineUnitOfMeasureOperationRequest, ChangeCartLineUnitOfMeasureOperationResponse, CreateCustomerOrderOperationRequest, CreateCustomerOrderOperationResponse, CreateCustomerQuoteOperationRequest, CreateCustomerQuoteOperationResponse, CustomerAccountDepositOperationRequest, CustomerAccountDepositOperationResponse, DepositOverrideOperationRequest, DepositOverrideOperationResponse, EditCustomerOrderOperationRequest, EditCustomerOrderOperationResponse, LineDiscountAmountOperationResponse, LineDiscountAmountOperationRequest, LineDiscountPercentOperationResponse, LineDiscountPercentOperationRequest, OverrideLineTaxFromListOperationRequest, OverrideLineTaxFromListOperationResponse, OverrideLineTaxOperationRequest, OverrideLineTaxOperationResponse, OverrideTransactionTaxOperationRequest, OverrideTransactionTaxOperationResponse, PickupAllOperationRequest, PickupAllOperationResponse, PriceOverrideOperationRequest, PriceOverrideOperationResponse, ReturnCartLineOperationRequest, ReturnCartLineOperationResponse, ReturnItemOperationRequest, ReturnItemOperationResponse, ReturnTransactionOperationRequest, ReturnTransactionOperationResponse, SetCartLineCommentOperationRequest, SetCartLineCommentOperationResponse, SetCartLineQuantityOperationRequest, SetCartLineQuantityOperationResponse, SetCustomerOnCartOperationRequest, SetCustomerOnCartOperationResponse, SetTransactionCommentOperationRequest, SetTransactionCommentOperationResponse, ShipAllCartLinesOperationRequest, ShipAllCartLinesOperationResponse, ShipSelectedCartLinesOperationRequest, ShipSelectedCartLinesOperationResponse, SuspendCurrentCartOperationRequest, SuspendCurrentCartOperationResponse, TotalDiscountAmountOperationResponse, TotalDiscountAmountOperationRequest, TotalDiscountPercentOperationResponse, TotalDiscountPercentOperationRequest, VoidCartLineOperationRequest, VoidCartLineOperationResponse, VoidTenderLineOperationRequest, VoidTenderLineOperationResponse, VoidTransactionOperationRequest, VoidTransactionOperationResponse, CreateEmptyCartServiceRequest, CreateEmptyCartServiceResponse, GetTaxOverridesServiceRequest, GetTaxOverridesServiceResponse, UpdateTenderLineSignatureServiceRequest, UpdateTenderLineSignatureServiceResponse;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            // Client Messages
            exports_4("AddPreprocessedTenderLineToCartClientRequest", AddPreprocessedTenderLineToCartClientRequest = Commerce.AddPreprocessedTenderLineToCartClientRequest);
            exports_4("AddPreprocessedTenderLineToCartClientResponse", AddPreprocessedTenderLineToCartClientResponse = Commerce.AddPreprocessedTenderLineToCartClientResponse);
            exports_4("AddTenderLineToCartClientRequest", AddTenderLineToCartClientRequest = Commerce.AddTenderLineToCartClientRequest);
            exports_4("AddTenderLineToCartClientResponse", AddTenderLineToCartClientResponse = Commerce.AddTenderLineToCartClientResponse);
            exports_4("ConcludeTransactionClientRequest", ConcludeTransactionClientRequest = Commerce.ConcludeTransactionClientRequest);
            exports_4("ConcludeTransactionClientResponse", ConcludeTransactionClientResponse = Commerce.ConcludeTransactionClientResponse);
            exports_4("GetCurrentCartClientRequest", GetCurrentCartClientRequest = Commerce.GetCurrentCartClientRequest);
            exports_4("GetCurrentCartClientResponse", GetCurrentCartClientResponse = Commerce.GetCurrentCartClientResponse);
            exports_4("GetKeyedInPriceClientRequest", GetKeyedInPriceClientRequest = Commerce.GetKeyedInPriceClientRequest);
            exports_4("GetKeyedInPriceClientResponse", GetKeyedInPriceClientResponse = Commerce.GetKeyedInPriceClientResponse);
            exports_4("GetKeyedInQuantityClientRequest", GetKeyedInQuantityClientRequest = Commerce.GetKeyedInQuantityClientRequest);
            exports_4("GetKeyedInQuantityClientResponse", GetKeyedInQuantityClientResponse = Commerce.GetKeyedInQuantityClientResponse);
            exports_4("GetPickupDateClientRequest", GetPickupDateClientRequest = Commerce.GetPickupDateClientRequest);
            exports_4("GetPickupDateClientResponse", GetPickupDateClientResponse = Commerce.GetPickupDateClientResponse);
            exports_4("GetReasonCodeLinesClientRequest", GetReasonCodeLinesClientRequest = Commerce.GetReasonCodeLinesClientRequest);
            exports_4("GetReasonCodeLinesClientResponse", GetReasonCodeLinesClientResponse = Commerce.GetReasonCodeLinesClientResponse);
            exports_4("GetReceiptEmailAddressClientRequest", GetReceiptEmailAddressClientRequest = Commerce.GetReceiptEmailAddressClientRequest);
            exports_4("GetReceiptEmailAddressClientResponse", GetReceiptEmailAddressClientResponse = Commerce.GetReceiptEmailAddressClientResponse);
            exports_4("GetShippingChargeClientRequest", GetShippingChargeClientRequest = Commerce.GetShippingChargeClientRequest);
            exports_4("GetShippingChargeClientResponse", GetShippingChargeClientResponse = Commerce.GetShippingChargeClientResponse);
            exports_4("GetShippingDateClientRequest", GetShippingDateClientRequest = Commerce.GetShippingDateClientRequest);
            exports_4("GetShippingDateClientResponse", GetShippingDateClientResponse = Commerce.GetShippingDateClientResponse);
            exports_4("RefreshCartClientRequest", RefreshCartClientRequest = Commerce.RefreshCartClientRequest);
            exports_4("RefreshCartClientResponse", RefreshCartClientResponse = Commerce.RefreshCartClientResponse);
            exports_4("ResumeSuspendedCartClientRequest", ResumeSuspendedCartClientRequest = Commerce.ResumeSuspendedCartClientRequest);
            exports_4("ResumeSuspendedCartClientResponse", ResumeSuspendedCartClientResponse = Commerce.ResumeSuspendedCartClientResponse);
            exports_4("SaveAttributesOnCartClientRequest", SaveAttributesOnCartClientRequest = Commerce.SaveAttributesOnCartClientRequest);
            exports_4("SaveAttributesOnCartClientResponse", SaveAttributesOnCartClientResponse = Commerce.SaveAttributesOnCartClientResponse);
            exports_4("SaveAttributesOnCartLinesClientRequest", SaveAttributesOnCartLinesClientRequest = Commerce.SaveAttributesOnCartLinesClientRequest);
            exports_4("SaveAttributesOnCartLinesClientResponse", SaveAttributesOnCartLinesClientResponse = Commerce.SaveAttributesOnCartLinesClientResponse);
            exports_4("SaveExtensionPropertiesOnCartClientRequest", SaveExtensionPropertiesOnCartClientRequest = Commerce.SaveExtensionPropertiesOnCartClientRequest);
            exports_4("SaveExtensionPropertiesOnCartClientResponse", SaveExtensionPropertiesOnCartClientResponse = Commerce.SaveExtensionPropertiesOnCartClientResponse);
            exports_4("SaveExtensionPropertiesOnCartLinesClientRequest", SaveExtensionPropertiesOnCartLinesClientRequest = Commerce.SaveExtensionPropertiesOnCartLinesClientRequest);
            exports_4("SaveExtensionPropertiesOnCartLinesClientResponse", SaveExtensionPropertiesOnCartLinesClientResponse = Commerce.SaveExtensionPropertiesOnCartLinesClientResponse);
            exports_4("SaveReasonCodeLinesOnCartClientRequest", SaveReasonCodeLinesOnCartClientRequest = Commerce.SaveReasonCodeLinesOnCartClientRequest);
            exports_4("SaveReasonCodeLinesOnCartClientResponse", SaveReasonCodeLinesOnCartClientResponse = Commerce.SaveReasonCodeLinesOnCartClientResponse);
            exports_4("SaveReasonCodeLinesOnCartLinesClientRequest", SaveReasonCodeLinesOnCartLinesClientRequest = Commerce.SaveReasonCodeLinesOnCartLinesClientRequest);
            exports_4("SaveReasonCodeLinesOnCartLinesClientResponse", SaveReasonCodeLinesOnCartLinesClientResponse = Commerce.SaveReasonCodeLinesOnCartLinesClientResponse);
            exports_4("SelectSalesLinesForPickUpClientRequest", SelectSalesLinesForPickUpClientRequest = Commerce.SelectSalesLinesForPickUpClientRequest);
            exports_4("SelectSalesLinesForPickUpClientResponse", SelectSalesLinesForPickUpClientResponse = Commerce.SelectSalesLinesForPickUpClientResponse);
            exports_4("SetCartAttributesClientRequest", SetCartAttributesClientRequest = Commerce.SetCartAttributesClientRequest);
            exports_4("SetCartAttributesClientResponse", SetCartAttributesClientResponse = Commerce.SetCartAttributesClientResponse);
            exports_4("ShowChangeDueClientRequest", ShowChangeDueClientRequest = Commerce.ShowChangeDueClientRequest);
            exports_4("ShowChangeDueClientResponse", ShowChangeDueClientResponse = Commerce.ShowChangeDueClientResponse);
            // Operation Messages
            exports_4("AddAffiliationOperationRequest", AddAffiliationOperationRequest = Commerce.AddAffiliationOperationRequest);
            exports_4("AddAffiliationOperationResponse", AddAffiliationOperationResponse = Commerce.AddAffiliationOperationResponse);
            exports_4("AddCouponsOperationRequest", AddCouponsOperationRequest = Commerce.AddCouponsOperationRequest);
            exports_4("AddCouponsOperationResponse", AddCouponsOperationResponse = Commerce.AddCouponsOperationResponse);
            exports_4("AddExpenseAccountLineToCartOperationRequest", AddExpenseAccountLineToCartOperationRequest = Commerce.AddExpenseAccountLineToCartOperationRequest);
            exports_4("AddExpenseAccountLineToCartOperationResponse", AddExpenseAccountLineToCartOperationResponse = Commerce.AddExpenseAccountLineToCartOperationResponse);
            exports_4("AddItemToCartOperationResponse", AddItemToCartOperationResponse = Commerce.AddItemToCartOperationResponse);
            exports_4("AddItemToCartOperationRequest", AddItemToCartOperationRequest = Commerce.AddItemToCartOperationRequest);
            exports_4("AddLoyaltyCardToCartOperationRequest", AddLoyaltyCardToCartOperationRequest = Commerce.AddLoyaltyCardToCartOperationRequest);
            exports_4("AddLoyaltyCardToCartOperationResponse", AddLoyaltyCardToCartOperationResponse = Commerce.AddLoyaltyCardToCartOperationResponse);
            exports_4("CalculateTotalOperationRequest", CalculateTotalOperationRequest = Commerce.CalculateTotalOperationRequest);
            exports_4("CalculateTotalOperationResponse", CalculateTotalOperationResponse = Commerce.CalculateTotalOperationResponse);
            exports_4("CarryoutSelectedProductsOperationRequest", CarryoutSelectedProductsOperationRequest = Commerce.CarryoutSelectedProductsOperationRequest);
            exports_4("CarryoutSelectedProductsOperationResponse", CarryoutSelectedProductsOperationResponse = Commerce.CarryoutSelectedProductsOperationResponse);
            exports_4("ChangeCartLineUnitOfMeasureOperationRequest", ChangeCartLineUnitOfMeasureOperationRequest = Commerce.ChangeCartLineUnitOfMeasureOperationRequest);
            exports_4("ChangeCartLineUnitOfMeasureOperationResponse", ChangeCartLineUnitOfMeasureOperationResponse = Commerce.ChangeCartLineUnitOfMeasureOperationResponse);
            exports_4("CreateCustomerOrderOperationRequest", CreateCustomerOrderOperationRequest = Commerce.CreateCustomerOrderOperationRequest);
            exports_4("CreateCustomerOrderOperationResponse", CreateCustomerOrderOperationResponse = Commerce.CreateCustomerOrderOperationResponse);
            exports_4("CreateCustomerQuoteOperationRequest", CreateCustomerQuoteOperationRequest = Commerce.CreateCustomerQuoteOperationRequest);
            exports_4("CreateCustomerQuoteOperationResponse", CreateCustomerQuoteOperationResponse = Commerce.CreateCustomerQuoteOperationResponse);
            exports_4("CustomerAccountDepositOperationRequest", CustomerAccountDepositOperationRequest = Commerce.CustomerAccountDepositOperationRequest);
            exports_4("CustomerAccountDepositOperationResponse", CustomerAccountDepositOperationResponse = Commerce.CustomerAccountDepositOperationResponse);
            exports_4("DepositOverrideOperationRequest", DepositOverrideOperationRequest = Commerce.DepositOverrideOperationRequest);
            exports_4("DepositOverrideOperationResponse", DepositOverrideOperationResponse = Commerce.DepositOverrideOperationResponse);
            exports_4("EditCustomerOrderOperationRequest", EditCustomerOrderOperationRequest = Commerce.EditCustomerOrderOperationRequest);
            exports_4("EditCustomerOrderOperationResponse", EditCustomerOrderOperationResponse = Commerce.EditCustomerOrderOperationResponse);
            exports_4("LineDiscountAmountOperationResponse", LineDiscountAmountOperationResponse = Commerce.LineDiscountAmountOperationResponse);
            exports_4("LineDiscountAmountOperationRequest", LineDiscountAmountOperationRequest = Commerce.LineDiscountAmountOperationRequest);
            exports_4("LineDiscountPercentOperationResponse", LineDiscountPercentOperationResponse = Commerce.LineDiscountPercentOperationResponse);
            exports_4("LineDiscountPercentOperationRequest", LineDiscountPercentOperationRequest = Commerce.LineDiscountPercentOperationRequest);
            exports_4("OverrideLineTaxFromListOperationRequest", OverrideLineTaxFromListOperationRequest = Commerce.OverrideLineTaxFromListOperationRequest);
            exports_4("OverrideLineTaxFromListOperationResponse", OverrideLineTaxFromListOperationResponse = Commerce.OverrideLineTaxFromListOperationResponse);
            exports_4("OverrideLineTaxOperationRequest", OverrideLineTaxOperationRequest = Commerce.OverrideLineTaxOperationRequest);
            exports_4("OverrideLineTaxOperationResponse", OverrideLineTaxOperationResponse = Commerce.OverrideLineTaxOperationResponse);
            exports_4("OverrideTransactionTaxOperationRequest", OverrideTransactionTaxOperationRequest = Commerce.OverrideTransactionTaxOperationRequest);
            exports_4("OverrideTransactionTaxOperationResponse", OverrideTransactionTaxOperationResponse = Commerce.OverrideTransactionTaxOperationResponse);
            exports_4("PickupAllOperationRequest", PickupAllOperationRequest = Commerce.PickupAllOperationRequest);
            exports_4("PickupAllOperationResponse", PickupAllOperationResponse = Commerce.PickupAllOperationResponse);
            exports_4("PriceOverrideOperationRequest", PriceOverrideOperationRequest = Commerce.PriceOverrideOperationRequest);
            exports_4("PriceOverrideOperationResponse", PriceOverrideOperationResponse = Commerce.PriceOverrideOperationResponse);
            exports_4("ReturnCartLineOperationRequest", ReturnCartLineOperationRequest = Commerce.ReturnCartLineOperationRequest);
            exports_4("ReturnCartLineOperationResponse", ReturnCartLineOperationResponse = Commerce.ReturnCartLineOperationResponse);
            exports_4("ReturnItemOperationRequest", ReturnItemOperationRequest = Commerce.ReturnItemOperationRequest);
            exports_4("ReturnItemOperationResponse", ReturnItemOperationResponse = Commerce.ReturnItemOperationResponse);
            exports_4("ReturnTransactionOperationRequest", ReturnTransactionOperationRequest = Commerce.ReturnTransactionOperationRequest);
            exports_4("ReturnTransactionOperationResponse", ReturnTransactionOperationResponse = Commerce.ReturnTransactionOperationResponse);
            exports_4("SetCartLineCommentOperationRequest", SetCartLineCommentOperationRequest = Commerce.SetCartLineCommentOperationRequest);
            exports_4("SetCartLineCommentOperationResponse", SetCartLineCommentOperationResponse = Commerce.SetCartLineCommentOperationResponse);
            exports_4("SetCartLineQuantityOperationRequest", SetCartLineQuantityOperationRequest = Commerce.SetCartLineQuantityOperationRequest);
            exports_4("SetCartLineQuantityOperationResponse", SetCartLineQuantityOperationResponse = Commerce.SetCartLineQuantityOperationResponse);
            exports_4("SetCustomerOnCartOperationRequest", SetCustomerOnCartOperationRequest = Commerce.SetCustomerOnCartOperationRequest);
            exports_4("SetCustomerOnCartOperationResponse", SetCustomerOnCartOperationResponse = Commerce.SetCustomerOnCartOperationResponse);
            exports_4("SetTransactionCommentOperationRequest", SetTransactionCommentOperationRequest = Commerce.SetTransactionCommentOperationRequest);
            exports_4("SetTransactionCommentOperationResponse", SetTransactionCommentOperationResponse = Commerce.SetTransactionCommentOperationResponse);
            exports_4("ShipAllCartLinesOperationRequest", ShipAllCartLinesOperationRequest = Commerce.Cart.ShipAllCartLinesOperationRequest);
            exports_4("ShipAllCartLinesOperationResponse", ShipAllCartLinesOperationResponse = Commerce.Cart.ShipAllCartLinesOperationResponse);
            exports_4("ShipSelectedCartLinesOperationRequest", ShipSelectedCartLinesOperationRequest = Commerce.Cart.ShipSelectedCartLinesOperationRequest);
            exports_4("ShipSelectedCartLinesOperationResponse", ShipSelectedCartLinesOperationResponse = Commerce.Cart.ShipSelectedCartLinesOperationResponse);
            exports_4("SuspendCurrentCartOperationRequest", SuspendCurrentCartOperationRequest = Commerce.SuspendCurrentCartOperationRequest);
            exports_4("SuspendCurrentCartOperationResponse", SuspendCurrentCartOperationResponse = Commerce.SuspendCurrentCartOperationResponse);
            exports_4("TotalDiscountAmountOperationResponse", TotalDiscountAmountOperationResponse = Commerce.TotalDiscountAmountOperationResponse);
            exports_4("TotalDiscountAmountOperationRequest", TotalDiscountAmountOperationRequest = Commerce.TotalDiscountAmountOperationRequest);
            exports_4("TotalDiscountPercentOperationResponse", TotalDiscountPercentOperationResponse = Commerce.TotalDiscountPercentOperationResponse);
            exports_4("TotalDiscountPercentOperationRequest", TotalDiscountPercentOperationRequest = Commerce.TotalDiscountPercentOperationRequest);
            exports_4("VoidCartLineOperationRequest", VoidCartLineOperationRequest = Commerce.VoidCartLineOperationRequest);
            exports_4("VoidCartLineOperationResponse", VoidCartLineOperationResponse = Commerce.VoidCartLineOperationResponse);
            exports_4("VoidTenderLineOperationRequest", VoidTenderLineOperationRequest = Commerce.VoidTenderLineOperationRequest);
            exports_4("VoidTenderLineOperationResponse", VoidTenderLineOperationResponse = Commerce.VoidTenderLineOperationResponse);
            exports_4("VoidTransactionOperationRequest", VoidTransactionOperationRequest = Commerce.VoidTransactionOperationRequest);
            exports_4("VoidTransactionOperationResponse", VoidTransactionOperationResponse = Commerce.VoidTransactionOperationResponse);
            // Service Requests/Responses - Each request response pair maps to a Retail Server API.
            exports_4("CreateEmptyCartServiceRequest", CreateEmptyCartServiceRequest = Commerce.CreateEmptyCartServiceRequest);
            exports_4("CreateEmptyCartServiceResponse", CreateEmptyCartServiceResponse = Commerce.CreateEmptyCartServiceResponse);
            exports_4("GetTaxOverridesServiceRequest", GetTaxOverridesServiceRequest = Commerce.GetTaxOverridesServiceRequest);
            exports_4("GetTaxOverridesServiceResponse", GetTaxOverridesServiceResponse = Commerce.GetTaxOverridesServiceResponse);
            exports_4("UpdateTenderLineSignatureServiceRequest", UpdateTenderLineSignatureServiceRequest = Commerce.Payments.UpdateTenderLineSignatureServiceRequest);
            exports_4("UpdateTenderLineSignatureServiceResponse", UpdateTenderLineSignatureServiceResponse = Commerce.Payments.UpdateTenderLineSignatureServiceResponse);
        }
    };
});
System.register("PosApi/Consume/Categories", [], function (exports_5, context_5) {
    "use strict";
    var GetCategoriesServiceRequest, GetCategoriesServiceResponse;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            exports_5("GetCategoriesServiceRequest", GetCategoriesServiceRequest = Commerce.Categories.GetCategoriesServiceRequest);
            exports_5("GetCategoriesServiceResponse", GetCategoriesServiceResponse = Commerce.Categories.GetCategoriesServiceResponse);
        }
    };
});
System.register("PosApi/Consume/Controls", [], function (exports_6, context_6) {
    "use strict";
    var DataListInteractionMode, DirectionalHint;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------
             -------------------------------------------------------------     Data List Interfaces    ------------------------------------------------------------------
             ------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            exports_6("DataListInteractionMode", DataListInteractionMode = Commerce.Extensibility.DataListInteractionMode);
            exports_6("DirectionalHint", DirectionalHint = Commerce.Extensibility.DirectionalHint);
        }
    };
});
System.register("PosApi/Consume/Customer", [], function (exports_7, context_7) {
    "use strict";
    var GetCustomerClientRequest, GetCustomerClientResponse, SelectCustomerClientRequest, SelectCustomerClientResponse, CreateCustomerServiceRequest, CreateCustomerServiceResponse, UpdateCustomerServiceRequest, UpdateCustomerServiceResponse;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            // Client Messages
            exports_7("GetCustomerClientRequest", GetCustomerClientRequest = Commerce.GetCustomerClientRequest);
            exports_7("GetCustomerClientResponse", GetCustomerClientResponse = Commerce.GetCustomerClientResponse);
            exports_7("SelectCustomerClientRequest", SelectCustomerClientRequest = Commerce.Customers.SelectCustomerClientRequest);
            exports_7("SelectCustomerClientResponse", SelectCustomerClientResponse = Commerce.Customers.SelectCustomerClientResponse);
            // Service Requests/Responses - Each request response pair maps to a Retail Server API.
            exports_7("CreateCustomerServiceRequest", CreateCustomerServiceRequest = Commerce.CreateCustomerServiceRequest);
            exports_7("CreateCustomerServiceResponse", CreateCustomerServiceResponse = Commerce.CreateCustomerServiceResponse);
            exports_7("UpdateCustomerServiceRequest", UpdateCustomerServiceRequest = Commerce.UpdateCustomerServiceRequest);
            exports_7("UpdateCustomerServiceResponse", UpdateCustomerServiceResponse = Commerce.UpdateCustomerServiceResponse);
        }
    };
});
System.register("PosApi/Consume/DataService", [], function (exports_8, context_8) {
    "use strict";
    var DataServiceRequest, DataServiceResponse;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
            exports_8("DataServiceRequest", DataServiceRequest = Commerce.DataService.DataServiceRequest);
            exports_8("DataServiceResponse", DataServiceResponse = Commerce.DataService.DataServiceResponse);
        }
    };
});
System.register("PosApi/Consume/Device", [], function (exports_9, context_9) {
    "use strict";
    var GetActiveHardwareStationClientRequest, GetActiveHardwareStationClientResponse, GetApplicationVersionClientRequest, GetApplicationVersionClientResponse, GetChannelConfigurationClientRequest, GetChannelConfigurationClientResponse, GetDeviceConfigurationClientRequest, GetDeviceConfigurationClientResponse, GetExtensionProfileClientRequest, GetExtensionProfileClientResponse, GetHardwareProfileClientRequest, GetHardwareProfileClientResponse, GetAuthenticationTokenClientRequest, GetAuthenticationTokenClientResponse, GetConnectionStatusClientRequest, GetConnectionStatusClientResponse, HealthCheckOperationRequest, HealthCheckOperationResponse;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            exports_9("GetActiveHardwareStationClientRequest", GetActiveHardwareStationClientRequest = Commerce.GetActiveHardwareStationClientRequest);
            exports_9("GetActiveHardwareStationClientResponse", GetActiveHardwareStationClientResponse = Commerce.GetActiveHardwareStationClientResponse);
            exports_9("GetApplicationVersionClientRequest", GetApplicationVersionClientRequest = Commerce.GetApplicationVersionClientRequest);
            exports_9("GetApplicationVersionClientResponse", GetApplicationVersionClientResponse = Commerce.GetApplicationVersionClientResponse);
            exports_9("GetChannelConfigurationClientRequest", GetChannelConfigurationClientRequest = Commerce.GetChannelConfigurationClientRequest);
            exports_9("GetChannelConfigurationClientResponse", GetChannelConfigurationClientResponse = Commerce.GetChannelConfigurationClientResponse);
            exports_9("GetDeviceConfigurationClientRequest", GetDeviceConfigurationClientRequest = Commerce.GetDeviceConfigurationClientRequest);
            exports_9("GetDeviceConfigurationClientResponse", GetDeviceConfigurationClientResponse = Commerce.GetDeviceConfigurationClientResponse);
            exports_9("GetExtensionProfileClientRequest", GetExtensionProfileClientRequest = Commerce.GetExtensionProfileClientRequest);
            exports_9("GetExtensionProfileClientResponse", GetExtensionProfileClientResponse = Commerce.GetExtensionProfileClientResponse);
            exports_9("GetHardwareProfileClientRequest", GetHardwareProfileClientRequest = Commerce.GetHardwareProfileClientRequest);
            exports_9("GetHardwareProfileClientResponse", GetHardwareProfileClientResponse = Commerce.GetHardwareProfileClientResponse);
            exports_9("GetAuthenticationTokenClientRequest", GetAuthenticationTokenClientRequest = Commerce.GetAuthenticationTokenClientRequest);
            exports_9("GetAuthenticationTokenClientResponse", GetAuthenticationTokenClientResponse = Commerce.GetAuthenticationTokenClientResponse);
            exports_9("GetConnectionStatusClientRequest", GetConnectionStatusClientRequest = Commerce.GetConnectionStatusClientRequest);
            exports_9("GetConnectionStatusClientResponse", GetConnectionStatusClientResponse = Commerce.GetConnectionStatusClientResponse);
            exports_9("HealthCheckOperationRequest", HealthCheckOperationRequest = Commerce.HealthCheckOperationRequest);
            exports_9("HealthCheckOperationResponse", HealthCheckOperationResponse = Commerce.HealthCheckOperationResponse);
        }
    };
});
System.register("PosApi/Consume/Diagnostics", [], function (exports_10, context_10) {
    "use strict";
    var GetSessionInfoClientRequest, GetSessionInfoClientResponse;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
            exports_10("GetSessionInfoClientRequest", GetSessionInfoClientRequest = Commerce.GetSessionInfoClientRequest);
            exports_10("GetSessionInfoClientResponse", GetSessionInfoClientResponse = Commerce.GetSessionInfoClientResponse);
        }
    };
});
System.register("PosApi/Consume/Dialogs", [], function (exports_11, context_11) {
    "use strict";
    var ShowMessageDialogClientRequest, ShowMessageDialogClientResponse, ShowAlphanumericInputDialogError, ShowAlphanumericInputDialogClientRequest, ShowAlphanumericInputDialogClientResponse, ShowNumericInputDialogError, ShowNumericInputDialogClientRequest, ShowNumericInputDialogClientResponse, ShowListInputDialogError, ShowListInputDialogClientRequest, ShowListInputDialogClientResponse, ShowTextInputDialogError, ShowTextInputDialogClientRequest, ShowTextInputDialogClientResponse;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [],
        execute: function () {
            exports_11("ShowMessageDialogClientRequest", ShowMessageDialogClientRequest = Commerce.ShowMessageDialogClientRequest);
            exports_11("ShowMessageDialogClientResponse", ShowMessageDialogClientResponse = Commerce.ShowMessageDialogClientResponse);
            exports_11("ShowAlphanumericInputDialogError", ShowAlphanumericInputDialogError = Commerce.Client.Entities.ShowAlphanumericInputDialogError);
            exports_11("ShowAlphanumericInputDialogClientRequest", ShowAlphanumericInputDialogClientRequest = Commerce.ShowAlphanumericInputDialogClientRequest);
            exports_11("ShowAlphanumericInputDialogClientResponse", ShowAlphanumericInputDialogClientResponse = Commerce.ShowAlphanumericInputDialogClientResponse);
            exports_11("ShowNumericInputDialogError", ShowNumericInputDialogError = Commerce.Client.Entities.ShowNumericInputDialogError);
            exports_11("ShowNumericInputDialogClientRequest", ShowNumericInputDialogClientRequest = Commerce.ShowNumericInputDialogClientRequest);
            exports_11("ShowNumericInputDialogClientResponse", ShowNumericInputDialogClientResponse = Commerce.ShowNumericInputDialogClientResponse);
            exports_11("ShowListInputDialogError", ShowListInputDialogError = Commerce.Client.Entities.ShowListInputDialogError);
            exports_11("ShowListInputDialogClientRequest", ShowListInputDialogClientRequest = Commerce.ShowListInputDialogClientRequest);
            exports_11("ShowListInputDialogClientResponse", ShowListInputDialogClientResponse = Commerce.ShowListInputDialogClientResponse);
            exports_11("ShowTextInputDialogError", ShowTextInputDialogError = Commerce.Client.Entities.ShowTextInputDialogError);
            exports_11("ShowTextInputDialogClientRequest", ShowTextInputDialogClientRequest = Commerce.ShowTextInputDialogClientRequest);
            exports_11("ShowTextInputDialogClientResponse", ShowTextInputDialogClientResponse = Commerce.ShowTextInputDialogClientResponse);
        }
    };
});
System.register("PosApi/Consume/Employees", [], function (exports_12, context_12) {
    "use strict";
    var GetLoggedOnEmployeeClientRequest, GetLoggedOnEmployeeClientResponse;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
            exports_12("GetLoggedOnEmployeeClientRequest", GetLoggedOnEmployeeClientRequest = Commerce.GetLoggedOnEmployeeClientRequest);
            exports_12("GetLoggedOnEmployeeClientResponse", GetLoggedOnEmployeeClientResponse = Commerce.GetLoggedOnEmployeeClientResponse);
        }
    };
});
System.register("PosApi/Consume/Formatters", [], function (exports_13, context_13) {
    "use strict";
    var BooleanFormatter, CurrencyFormatter, DateFormatter, PurchaseTransferOrderTypeFormatter, TransactionTypeFormatter;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [],
        execute: function () {
            // tslint:disable-next-line:variable-name
            exports_13("BooleanFormatter", BooleanFormatter = {
                toYesNo: function (value) { return Commerce.Extensibility.ValueFormatterManager.instance.YesNoBooleanFormatter(value); }
            });
            // tslint:disable-next-line:variable-name
            exports_13("CurrencyFormatter", CurrencyFormatter = {
                toCurrency: function (value) { return Commerce.Extensibility.ValueFormatterManager.instance.PriceFormatter(value); }
            });
            // tslint:disable-next-line:variable-name
            exports_13("DateFormatter", DateFormatter = {
                toShortDateAndTime: function (value) { return Commerce.Extensibility.ValueFormatterManager.instance.ShortDateAndTimeFormatter(value); },
                toShortDate: function (value) { return Commerce.Extensibility.ValueFormatterManager.instance.ShortDateFormatter(value); }
            });
            // tslint:disable-next-line:variable-name
            exports_13("PurchaseTransferOrderTypeFormatter", PurchaseTransferOrderTypeFormatter = {
                toName: function (value) {
                    return Commerce.Extensibility.ValueFormatterManager.instance.PurchaseTransferOrderTypeFormatter(value);
                }
            });
            // tslint:disable-next-line:variable-name
            exports_13("TransactionTypeFormatter", TransactionTypeFormatter = {
                toName: function (value, entryStatusValue) {
                    return Commerce.Extensibility.ValueFormatterManager.instance.TransactionTypeFormatter(value, entryStatusValue);
                }
            });
        }
    };
});
System.register("PosApi/Consume/OrgUnits", [], function (exports_14, context_14) {
    "use strict";
    var GetOrgUnitConfigurationClientRequest, GetOrgUnitConfigurationClientResponse, GetOrgUnitTenderTypesClientRequest, GetOrgUnitTenderTypesClientResponse, InventoryLookupOperationRequest, InventoryLookupOperationResponse;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
            exports_14("GetOrgUnitConfigurationClientRequest", GetOrgUnitConfigurationClientRequest = Commerce.GetOrgUnitConfigurationClientRequest);
            exports_14("GetOrgUnitConfigurationClientResponse", GetOrgUnitConfigurationClientResponse = Commerce.GetOrgUnitConfigurationClientResponse);
            exports_14("GetOrgUnitTenderTypesClientRequest", GetOrgUnitTenderTypesClientRequest = Commerce.GetOrgUnitTenderTypesClientRequest);
            exports_14("GetOrgUnitTenderTypesClientResponse", GetOrgUnitTenderTypesClientResponse = Commerce.GetOrgUnitTenderTypesClientResponse);
            exports_14("InventoryLookupOperationRequest", InventoryLookupOperationRequest = Commerce.InventoryLookupOperationRequest);
            exports_14("InventoryLookupOperationResponse", InventoryLookupOperationResponse = Commerce.InventoryLookupOperationResponse);
        }
    };
});
System.register("PosApi/Consume/Payments", [], function (exports_15, context_15) {
    "use strict";
    var GetGiftCardByIdServiceRequest, GetGiftCardByIdServiceResponse, GetPaymentCardTypeByBinRangeClientRequest, GetPaymentCardTypeByBinRangeClientResponse;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [],
        execute: function () {
            exports_15("GetGiftCardByIdServiceRequest", GetGiftCardByIdServiceRequest = Commerce.Payments.GetGiftCardByIdServiceRequest);
            exports_15("GetGiftCardByIdServiceResponse", GetGiftCardByIdServiceResponse = Commerce.Payments.GetGiftCardByIdServiceResponse);
            exports_15("GetPaymentCardTypeByBinRangeClientRequest", GetPaymentCardTypeByBinRangeClientRequest = Commerce.GetPaymentCardTypeByBinRangeClientRequest);
            exports_15("GetPaymentCardTypeByBinRangeClientResponse", GetPaymentCardTypeByBinRangeClientResponse = Commerce.GetPaymentCardTypeByBinRangeClientResponse);
        }
    };
});
System.register("PosApi/Consume/Peripherals", [], function (exports_16, context_16) {
    "use strict";
    var CardPaymentAuthorizeCardTokenPeripheralRequest, CardPaymentAuthorizeCardTokenPeripheralResponse, CardPaymentAuthorizePaymentRequest, CardPaymentAuthorizePaymentResponse, CardPaymentBeginTransactionRequest, CardPaymentBeginTransactionResponse, CardPaymentCapturePaymentRequest, CardPaymentCapturePaymentResponse, CardPaymentEndTransactionRequest, CardPaymentEndTransactionResponse, CardPaymentEnquireGiftCardBalancePeripheralRequest, CardPaymentEnquireGiftCardBalancePeripheralResponse, CardPaymentExecuteTaskRequest, CardPaymentExecuteTaskResponse, CardPaymentRefundPaymentRequest, CardPaymentRefundPaymentResponse, CardPaymentVoidPaymentRequest, CardPaymentVoidPaymentResponse, CashDrawerIsOpenRequest, CashDrawerIsOpenResponse, CashDrawerOpenRequest, CashDrawerOpenResponse, HardwareStationDeviceActionRequest, HardwareStationDeviceActionResponse, HardwareStationStatusRequest, HardwareStationStatusResponse, LineDisplayDisplayLinesRequest, LineDisplayDisplayLinesResponse, PaymentTerminalActivateGiftCardPeripheralRequest, PaymentTerminalActivateGiftCardPeripheralResponse, PaymentTerminalAddBalanceToGiftCardPeripheralRequest, PaymentTerminalAddBalanceToGiftCardPeripheralResponse, PaymentTerminalAuthorizePaymentActivityRequest, PaymentTerminalAuthorizePaymentActivityResponse, PaymentTerminalAuthorizePaymentRequest, PaymentTerminalAuthorizePaymentResponse, PaymentTerminalBeginTransactionRequest, PaymentTerminalBeginTransactionResponse, PaymentTerminalCancelOperationRequest, PaymentTerminalCancelOperationResponse, PaymentTerminalCapturePaymentRequest, PaymentTerminalCapturePaymentResponse, PaymentTerminalEndTransactionRequest, PaymentTerminalEndTransactionResponse, PaymentTerminalEnquireGiftCardBalancePeripheralRequest, PaymentTerminalEnquireGiftCardBalancePeripheralResponse, PaymentTerminalExecuteTaskRequest, PaymentTerminalExecuteTaskResponse, PaymentTerminalFetchTokenPeripheralRequest, PaymentTerminalFetchTokenPeripheralResponse, PaymentTerminalGetTransactionReferenceIdRequest, PaymentTerminalGetTransactionReferenceIdResponse, PaymentTerminalGetTransactionByTransactionReferenceRequest, PaymentTerminalGetTransactionByTransactionReferenceResponse, PaymentTerminalRefundPaymentActivityRequest, PaymentTerminalRefundPaymentActivityResponse, PaymentTerminalRefundPaymentRequest, PaymentTerminalRefundPaymentResponse, PaymentTerminalUpdateLinesRequest, PaymentTerminalUpdateLinesResponse, PaymentTerminalVoidPaymentRequest, PaymentTerminalVoidPaymentResponse, PrinterPrintRequest, PrinterPrintResponse, ScaleReadRequest, ScaleReadResponse;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [],
        execute: function () {
            exports_16("CardPaymentAuthorizeCardTokenPeripheralRequest", CardPaymentAuthorizeCardTokenPeripheralRequest = Commerce.Peripherals.CardPaymentAuthorizeCardTokenPeripheralRequest);
            exports_16("CardPaymentAuthorizeCardTokenPeripheralResponse", CardPaymentAuthorizeCardTokenPeripheralResponse = Commerce.Peripherals.CardPaymentAuthorizeCardTokenPeripheralResponse);
            exports_16("CardPaymentAuthorizePaymentRequest", CardPaymentAuthorizePaymentRequest = Commerce.CardPaymentAuthorizePaymentRequest);
            exports_16("CardPaymentAuthorizePaymentResponse", CardPaymentAuthorizePaymentResponse = Commerce.CardPaymentAuthorizePaymentResponse);
            exports_16("CardPaymentBeginTransactionRequest", CardPaymentBeginTransactionRequest = Commerce.CardPaymentBeginTransactionRequest);
            exports_16("CardPaymentBeginTransactionResponse", CardPaymentBeginTransactionResponse = Commerce.CardPaymentBeginTransactionResponse);
            exports_16("CardPaymentCapturePaymentRequest", CardPaymentCapturePaymentRequest = Commerce.CardPaymentCapturePaymentRequest);
            exports_16("CardPaymentCapturePaymentResponse", CardPaymentCapturePaymentResponse = Commerce.CardPaymentCapturePaymentResponse);
            exports_16("CardPaymentEndTransactionRequest", CardPaymentEndTransactionRequest = Commerce.CardPaymentEndTransactionRequest);
            exports_16("CardPaymentEndTransactionResponse", CardPaymentEndTransactionResponse = Commerce.CardPaymentEndTransactionResponse);
            exports_16("CardPaymentEnquireGiftCardBalancePeripheralRequest", CardPaymentEnquireGiftCardBalancePeripheralRequest = Commerce.CardPaymentEnquireGiftCardBalancePeripheralRequest);
            exports_16("CardPaymentEnquireGiftCardBalancePeripheralResponse", CardPaymentEnquireGiftCardBalancePeripheralResponse = Commerce.CardPaymentEnquireGiftCardBalancePeripheralResponse);
            exports_16("CardPaymentExecuteTaskRequest", CardPaymentExecuteTaskRequest = Commerce.CardPaymentExecuteTaskRequest);
            exports_16("CardPaymentExecuteTaskResponse", CardPaymentExecuteTaskResponse = Commerce.CardPaymentExecuteTaskResponse);
            exports_16("CardPaymentRefundPaymentRequest", CardPaymentRefundPaymentRequest = Commerce.CardPaymentRefundPaymentRequest);
            exports_16("CardPaymentRefundPaymentResponse", CardPaymentRefundPaymentResponse = Commerce.CardPaymentRefundPaymentResponse);
            exports_16("CardPaymentVoidPaymentRequest", CardPaymentVoidPaymentRequest = Commerce.CardPaymentVoidPaymentRequest);
            exports_16("CardPaymentVoidPaymentResponse", CardPaymentVoidPaymentResponse = Commerce.CardPaymentVoidPaymentResponse);
            exports_16("CashDrawerIsOpenRequest", CashDrawerIsOpenRequest = Commerce.CashDrawerIsOpenRequest);
            exports_16("CashDrawerIsOpenResponse", CashDrawerIsOpenResponse = Commerce.CashDrawerIsOpenResponse);
            exports_16("CashDrawerOpenRequest", CashDrawerOpenRequest = Commerce.CashDrawerOpenRequest);
            exports_16("CashDrawerOpenResponse", CashDrawerOpenResponse = Commerce.CashDrawerOpenResponse);
            exports_16("HardwareStationDeviceActionRequest", HardwareStationDeviceActionRequest = Commerce.HardwareStationDeviceActionRequest);
            exports_16("HardwareStationDeviceActionResponse", HardwareStationDeviceActionResponse = Commerce.HardwareStationDeviceActionResponse);
            exports_16("HardwareStationStatusRequest", HardwareStationStatusRequest = Commerce.HardwareStationStatusRequest);
            exports_16("HardwareStationStatusResponse", HardwareStationStatusResponse = Commerce.HardwareStationStatusResponse);
            exports_16("LineDisplayDisplayLinesRequest", LineDisplayDisplayLinesRequest = Commerce.LineDisplayDisplayLinesRequest);
            exports_16("LineDisplayDisplayLinesResponse", LineDisplayDisplayLinesResponse = Commerce.LineDisplayDisplayLinesResponse);
            exports_16("PaymentTerminalActivateGiftCardPeripheralRequest", PaymentTerminalActivateGiftCardPeripheralRequest = Commerce.Peripherals.PaymentTerminalActivateGiftCardPeripheralRequest);
            exports_16("PaymentTerminalActivateGiftCardPeripheralResponse", PaymentTerminalActivateGiftCardPeripheralResponse = Commerce.Peripherals.PaymentTerminalActivateGiftCardPeripheralResponse);
            exports_16("PaymentTerminalAddBalanceToGiftCardPeripheralRequest", PaymentTerminalAddBalanceToGiftCardPeripheralRequest = Commerce.Peripherals.PaymentTerminalAddBalanceToGiftCardPeripheralRequest);
            exports_16("PaymentTerminalAddBalanceToGiftCardPeripheralResponse", PaymentTerminalAddBalanceToGiftCardPeripheralResponse = Commerce.Peripherals.PaymentTerminalAddBalanceToGiftCardPeripheralResponse);
            exports_16("PaymentTerminalAuthorizePaymentActivityRequest", PaymentTerminalAuthorizePaymentActivityRequest = Commerce.PaymentTerminalAuthorizePaymentActivityRequest);
            exports_16("PaymentTerminalAuthorizePaymentActivityResponse", PaymentTerminalAuthorizePaymentActivityResponse = Commerce.PaymentTerminalAuthorizePaymentActivityResponse);
            exports_16("PaymentTerminalAuthorizePaymentRequest", PaymentTerminalAuthorizePaymentRequest = Commerce.PaymentTerminalAuthorizePaymentRequest);
            exports_16("PaymentTerminalAuthorizePaymentResponse", PaymentTerminalAuthorizePaymentResponse = Commerce.PaymentTerminalAuthorizePaymentResponse);
            exports_16("PaymentTerminalBeginTransactionRequest", PaymentTerminalBeginTransactionRequest = Commerce.PaymentTerminalBeginTransactionRequest);
            exports_16("PaymentTerminalBeginTransactionResponse", PaymentTerminalBeginTransactionResponse = Commerce.PaymentTerminalBeginTransactionResponse);
            exports_16("PaymentTerminalCancelOperationRequest", PaymentTerminalCancelOperationRequest = Commerce.PaymentTerminalCancelOperationRequest);
            exports_16("PaymentTerminalCancelOperationResponse", PaymentTerminalCancelOperationResponse = Commerce.PaymentTerminalCancelOperationResponse);
            exports_16("PaymentTerminalCapturePaymentRequest", PaymentTerminalCapturePaymentRequest = Commerce.PaymentTerminalCapturePaymentRequest);
            exports_16("PaymentTerminalCapturePaymentResponse", PaymentTerminalCapturePaymentResponse = Commerce.PaymentTerminalCapturePaymentResponse);
            exports_16("PaymentTerminalEndTransactionRequest", PaymentTerminalEndTransactionRequest = Commerce.PaymentTerminalEndTransactionRequest);
            exports_16("PaymentTerminalEndTransactionResponse", PaymentTerminalEndTransactionResponse = Commerce.PaymentTerminalEndTransactionResponse);
            exports_16("PaymentTerminalEnquireGiftCardBalancePeripheralRequest", PaymentTerminalEnquireGiftCardBalancePeripheralRequest = Commerce.PaymentTerminalEnquireGiftCardBalancePeripheralRequest);
            exports_16("PaymentTerminalEnquireGiftCardBalancePeripheralResponse", PaymentTerminalEnquireGiftCardBalancePeripheralResponse = Commerce.PaymentTerminalEnquireGiftCardBalancePeripheralResponse);
            exports_16("PaymentTerminalExecuteTaskRequest", PaymentTerminalExecuteTaskRequest = Commerce.PaymentTerminalExecuteTaskRequest);
            exports_16("PaymentTerminalExecuteTaskResponse", PaymentTerminalExecuteTaskResponse = Commerce.PaymentTerminalExecuteTaskResponse);
            exports_16("PaymentTerminalFetchTokenPeripheralRequest", PaymentTerminalFetchTokenPeripheralRequest = Commerce.PaymentTerminalFetchTokenPeripheralRequest);
            exports_16("PaymentTerminalFetchTokenPeripheralResponse", PaymentTerminalFetchTokenPeripheralResponse = Commerce.PaymentTerminalFetchTokenPeripheralResponse);
            exports_16("PaymentTerminalGetTransactionReferenceIdRequest", PaymentTerminalGetTransactionReferenceIdRequest = Commerce.PaymentTerminalGetTransactionReferenceIdRequest);
            exports_16("PaymentTerminalGetTransactionReferenceIdResponse", PaymentTerminalGetTransactionReferenceIdResponse = Commerce.PaymentTerminalGetTransactionReferenceIdResponse);
            exports_16("PaymentTerminalGetTransactionByTransactionReferenceRequest", PaymentTerminalGetTransactionByTransactionReferenceRequest = Commerce.PaymentTerminalGetTransactionByTransactionReferenceRequest);
            exports_16("PaymentTerminalGetTransactionByTransactionReferenceResponse", PaymentTerminalGetTransactionByTransactionReferenceResponse = Commerce.PaymentTerminalGetTransactionByTransactionReferenceResponse);
            exports_16("PaymentTerminalRefundPaymentActivityRequest", PaymentTerminalRefundPaymentActivityRequest = Commerce.PaymentTerminalRefundPaymentActivityRequest);
            exports_16("PaymentTerminalRefundPaymentActivityResponse", PaymentTerminalRefundPaymentActivityResponse = Commerce.PaymentTerminalRefundPaymentActivityResponse);
            exports_16("PaymentTerminalRefundPaymentRequest", PaymentTerminalRefundPaymentRequest = Commerce.PaymentTerminalRefundPaymentRequest);
            exports_16("PaymentTerminalRefundPaymentResponse", PaymentTerminalRefundPaymentResponse = Commerce.PaymentTerminalRefundPaymentResponse);
            exports_16("PaymentTerminalUpdateLinesRequest", PaymentTerminalUpdateLinesRequest = Commerce.PaymentTerminalUpdateLinesRequest);
            exports_16("PaymentTerminalUpdateLinesResponse", PaymentTerminalUpdateLinesResponse = Commerce.PaymentTerminalUpdateLinesResponse);
            exports_16("PaymentTerminalVoidPaymentRequest", PaymentTerminalVoidPaymentRequest = Commerce.PaymentTerminalVoidPaymentRequest);
            exports_16("PaymentTerminalVoidPaymentResponse", PaymentTerminalVoidPaymentResponse = Commerce.PaymentTerminalVoidPaymentResponse);
            exports_16("PrinterPrintRequest", PrinterPrintRequest = Commerce.PrinterPrintRequest);
            exports_16("PrinterPrintResponse", PrinterPrintResponse = Commerce.PrinterPrintResponse);
            exports_16("ScaleReadRequest", ScaleReadRequest = Commerce.ScaleReadRequest);
            exports_16("ScaleReadResponse", ScaleReadResponse = Commerce.ScaleReadResponse);
        }
    };
});
System.register("PosApi/Consume/Products", [], function (exports_17, context_17) {
    "use strict";
    var GetCurrentProductCatalogStoreClientRequest, GetCurrentProductCatalogStoreClientResponse, GetProductsByIdsClientRequest, GetProductsByIdsClientResponse, GetSerialNumberClientRequest, GetSerialNumberClientResponse, SelectProductClientRequest, SelectProductClientResponse, SelectProductVariantClientRequest, SelectProductVariantClientResponse, GetActivePricesServiceRequest, GetActivePricesServiceResponse, GetRefinerValuesByTextServiceRequest, GetRefinerValuesByTextServiceResponse;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [],
        execute: function () {
            // Client Messages
            exports_17("GetCurrentProductCatalogStoreClientRequest", GetCurrentProductCatalogStoreClientRequest = Commerce.Products.GetCurrentProductCatalogStoreClientRequest);
            exports_17("GetCurrentProductCatalogStoreClientResponse", GetCurrentProductCatalogStoreClientResponse = Commerce.Products.GetCurrentProductCatalogStoreClientResponse);
            exports_17("GetProductsByIdsClientRequest", GetProductsByIdsClientRequest = Commerce.Products.GetProductsByIdsClientRequest);
            exports_17("GetProductsByIdsClientResponse", GetProductsByIdsClientResponse = Commerce.Products.GetProductsByIdsClientResponse);
            exports_17("GetSerialNumberClientRequest", GetSerialNumberClientRequest = Commerce.Products.GetSerialNumberClientRequest);
            exports_17("GetSerialNumberClientResponse", GetSerialNumberClientResponse = Commerce.Products.GetSerialNumberClientResponse);
            exports_17("SelectProductClientRequest", SelectProductClientRequest = Commerce.Products.SelectProductClientRequest);
            exports_17("SelectProductClientResponse", SelectProductClientResponse = Commerce.Products.SelectProductClientResponse);
            exports_17("SelectProductVariantClientRequest", SelectProductVariantClientRequest = Commerce.Products.SelectProductVariantClientRequest);
            exports_17("SelectProductVariantClientResponse", SelectProductVariantClientResponse = Commerce.Products.SelectProductVariantClientResponse);
            // Service Requests/Responses - Each request response pair maps to a Retail Server API.
            exports_17("GetActivePricesServiceRequest", GetActivePricesServiceRequest = Commerce.Products.GetActivePricesServiceRequest);
            exports_17("GetActivePricesServiceResponse", GetActivePricesServiceResponse = Commerce.Products.GetActivePricesServiceResponse);
            exports_17("GetRefinerValuesByTextServiceRequest", GetRefinerValuesByTextServiceRequest = Commerce.Products.GetRefinerValuesByTextServiceRequest);
            exports_17("GetRefinerValuesByTextServiceResponse", GetRefinerValuesByTextServiceResponse = Commerce.Products.GetRefinerValuesByTextServiceResponse);
        }
    };
});
System.register("PosApi/Consume/SalesOrders", [], function (exports_18, context_18) {
    "use strict";
    var GetCancellationChargeClientRequest, GetCancellationChargeClientResponse, GetGiftReceiptsClientRequest, GetGiftReceiptsClientResponse, GetReceiptsClientRequest, GetReceiptsClientResponse, GetSalesOrderDetailsBySalesIdServiceRequest, GetSalesOrderDetailsBySalesIdServiceResponse, GetSalesOrderDetailsByTransactionIdClientRequest, GetSalesOrderDetailsByTransactionIdClientResponse, MarkAsPickedServiceRequest, MarkAsPickedServiceResponse, PrintPackingSlipClientRequest, PrintPackingSlipClientResponse, RegisterPrintReceiptCopyEventRequest, RegisterPrintReceiptCopyEventResponse, SelectCustomerOrderTypeClientRequest, SelectCustomerOrderTypeClientResponse, PickUpCustomerOrderLinesClientRequest, PickUpCustomerOrderLinesClientResponse, SearchSalesTransactionsByReceiptIdServiceRequest, SearchSalesTransactionsByReceiptIdServiceResponse;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [],
        execute: function () {
            exports_18("GetCancellationChargeClientRequest", GetCancellationChargeClientRequest = Commerce.SalesOrders.GetCancellationChargeClientRequest);
            exports_18("GetCancellationChargeClientResponse", GetCancellationChargeClientResponse = Commerce.SalesOrders.GetCancellationChargeClientResponse);
            exports_18("GetGiftReceiptsClientRequest", GetGiftReceiptsClientRequest = Commerce.SalesOrders.GetGiftReceiptsClientRequest);
            exports_18("GetGiftReceiptsClientResponse", GetGiftReceiptsClientResponse = Commerce.SalesOrders.GetGiftReceiptsClientResponse);
            exports_18("GetReceiptsClientRequest", GetReceiptsClientRequest = Commerce.GetReceiptsClientRequest);
            exports_18("GetReceiptsClientResponse", GetReceiptsClientResponse = Commerce.GetReceiptsClientResponse);
            exports_18("GetSalesOrderDetailsBySalesIdServiceRequest", GetSalesOrderDetailsBySalesIdServiceRequest = Commerce.SalesOrders.GetSalesOrderDetailsBySalesIdServiceRequest);
            exports_18("GetSalesOrderDetailsBySalesIdServiceResponse", GetSalesOrderDetailsBySalesIdServiceResponse = Commerce.SalesOrders.GetSalesOrderDetailsBySalesIdServiceResponse);
            exports_18("GetSalesOrderDetailsByTransactionIdClientRequest", GetSalesOrderDetailsByTransactionIdClientRequest = Commerce.GetSalesOrderDetailsByTransactionIdClientRequest);
            exports_18("GetSalesOrderDetailsByTransactionIdClientResponse", GetSalesOrderDetailsByTransactionIdClientResponse = Commerce.GetSalesOrderDetailsByTransactionIdClientResponse);
            exports_18("MarkAsPickedServiceRequest", MarkAsPickedServiceRequest = Commerce.SalesOrders.MarkAsPickedServiceRequest);
            exports_18("MarkAsPickedServiceResponse", MarkAsPickedServiceResponse = Commerce.SalesOrders.MarkAsPickedServiceResponse);
            exports_18("PrintPackingSlipClientRequest", PrintPackingSlipClientRequest = Commerce.PrintPackingSlipClientRequest);
            exports_18("PrintPackingSlipClientResponse", PrintPackingSlipClientResponse = Commerce.PrintPackingSlipClientResponse);
            exports_18("RegisterPrintReceiptCopyEventRequest", RegisterPrintReceiptCopyEventRequest = Commerce.RegisterPrintReceiptCopyEventRequest);
            exports_18("RegisterPrintReceiptCopyEventResponse", RegisterPrintReceiptCopyEventResponse = Commerce.RegisterPrintReceiptCopyEventResponse);
            exports_18("SelectCustomerOrderTypeClientRequest", SelectCustomerOrderTypeClientRequest = Commerce.SalesOrders.SelectCustomerOrderTypeClientRequest);
            exports_18("SelectCustomerOrderTypeClientResponse", SelectCustomerOrderTypeClientResponse = Commerce.SalesOrders.SelectCustomerOrderTypeClientResponse);
            exports_18("PickUpCustomerOrderLinesClientRequest", PickUpCustomerOrderLinesClientRequest = Commerce.SalesOrders.PickUpCustomerOrderLinesClientRequest);
            exports_18("PickUpCustomerOrderLinesClientResponse", PickUpCustomerOrderLinesClientResponse = Commerce.SalesOrders.PickUpCustomerOrderLinesClientResponse);
            exports_18("SearchSalesTransactionsByReceiptIdServiceRequest", SearchSalesTransactionsByReceiptIdServiceRequest = Commerce.SalesOrders.SearchSalesTransactionsByReceiptIdServiceRequest);
            exports_18("SearchSalesTransactionsByReceiptIdServiceResponse", SearchSalesTransactionsByReceiptIdServiceResponse = Commerce.SalesOrders.SearchSalesTransactionsByReceiptIdServiceResponse);
        }
    };
});
System.register("PosApi/Consume/ScanResults", [], function (exports_19, context_19) {
    "use strict";
    var GetScanResultClientRequest, GetScanResultClientResponse;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [],
        execute: function () {
            exports_19("GetScanResultClientRequest", GetScanResultClientRequest = Commerce.GetScanResultClientRequest);
            exports_19("GetScanResultClientResponse", GetScanResultClientResponse = Commerce.GetScanResultClientResponse);
        }
    };
});
System.register("PosApi/Consume/Shifts", [], function (exports_20, context_20) {
    "use strict";
    var GetCurrentShiftClientRequest, GetCurrentShiftClientResponse, CloseShiftOperationRequest, CloseShiftOperationResponse;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [],
        execute: function () {
            // Client Messages
            exports_20("GetCurrentShiftClientRequest", GetCurrentShiftClientRequest = Commerce.GetCurrentShiftClientRequest);
            exports_20("GetCurrentShiftClientResponse", GetCurrentShiftClientResponse = Commerce.GetCurrentShiftClientResponse);
            // Operation Messages
            exports_20("CloseShiftOperationRequest", CloseShiftOperationRequest = Commerce.CloseShiftOperationRequest);
            exports_20("CloseShiftOperationResponse", CloseShiftOperationResponse = Commerce.CloseShiftOperationResponse);
        }
    };
});
System.register("PosApi/Consume/StockCountJournals", [], function (exports_21, context_21) {
    "use strict";
    var SyncAllStockCountJournalsClientRequest, SyncAllStockCountJournalsClientResponse;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [],
        execute: function () {
            // Client Messages
            exports_21("SyncAllStockCountJournalsClientRequest", SyncAllStockCountJournalsClientRequest = Commerce.SyncAllStockCountJournalsClientRequest);
            exports_21("SyncAllStockCountJournalsClientResponse", SyncAllStockCountJournalsClientResponse = Commerce.SyncAllStockCountJournalsClientResponse);
        }
    };
});
System.register("PosApi/Consume/StoreOperations", [], function (exports_22, context_22) {
    "use strict";
    var CreateBankDropTransactionClientRequest, CreateBankDropTransactionClientResponse, CreateFloatEntryTransactionClientRequest, CreateFloatEntryTransactionClientResponse, CreateSafeDropTransactionClientRequest, CreateSafeDropTransactionClientResponse, CreateStartingAmountTransactionClientRequest, CreateStartingAmountTransactionClientResponse, CreateTenderDeclarationTransactionClientRequest, CreateTenderDeclarationTransactionClientResponse, CreateTenderRemovalTransactionClientRequest, CreateTenderRemovalTransactionClientResponse, DeclareStartingAmountClientRequest, DeclareStartingAmountClientResponse, GetCountedTenderDetailAmountClientRequest, GetCountedTenderDetailAmountClientResponse, GetDenominationTotalsClientRequest, GetDenominationTotalsClientResponse, GetOfflinePendingTransactionCountClientRequest, GetOfflinePendingTransactionCountClientResponse, GetPickingAndReceivingOrdersClientRequest, GetPickingAndReceivingOrdersClientResponse, GetReportParametersClientRequest, GetReportParametersClientResponse, GetSalesOrdersWithNoFiscalTransactionsRequest, GetSalesOrdersWithNoFiscalTransactionsResponse, GetStartingAmountClientRequest, GetStartingAmountClientResponse, GetTenderDetailsClientRequest, GetTenderDetailsClientResponse, RegisterCustomAuditEventClientRequest, RegisterCustomAuditEventClientResponse, SaveFiscalTransactionClientRequest, SaveFiscalTransactionClientResponse, SelectZipCodeInfoClientRequest, SelectZipCodeInfoClientResponse, BankDropOperationRequest, BankDropOperationResponse, DeclareStartAmountOperationRequest, DeclareStartAmountOperationResponse, IssueLoyaltyCardOperationRequest, IssueLoyaltyCardOperationResponse, LoyaltyCardPointsBalanceOperationRequest, LoyaltyCardPointsBalanceOperationResponse, SafeDropOperationRequest, SafeDropOperationResponse, TenderDeclarationOperationRequest, TenderDeclarationOperationResponse, TenderRemovalOperationRequest, TenderRemovalOperationResponse, CreateNonSalesTransactionServiceRequest, CreateNonSalesTransactionServiceResponse, GetCommissionSalesGroupsServiceRequest, GetCommissionSalesGroupsServiceResponse, GetCurrenciesServiceRequest, GetCurrenciesServiceResponse, GetSrsReportDataSetServiceRequest, GetSrsReportDataSetServiceResponse, SearchCommissionSalesGroupsServiceRequest, SearchCommissionSalesGroupsServiceResponse;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [],
        execute: function () {
            // Client Messages
            exports_22("CreateBankDropTransactionClientRequest", CreateBankDropTransactionClientRequest = Commerce.TenderCounting.CreateBankDropTransactionClientRequest);
            exports_22("CreateBankDropTransactionClientResponse", CreateBankDropTransactionClientResponse = Commerce.TenderCounting.CreateBankDropTransactionClientResponse);
            exports_22("CreateFloatEntryTransactionClientRequest", CreateFloatEntryTransactionClientRequest = Commerce.CashManagement.CreateFloatEntryTransactionClientRequest);
            exports_22("CreateFloatEntryTransactionClientResponse", CreateFloatEntryTransactionClientResponse = Commerce.CashManagement.CreateFloatEntryTransactionClientResponse);
            exports_22("CreateSafeDropTransactionClientRequest", CreateSafeDropTransactionClientRequest = Commerce.TenderCounting.CreateSafeDropTransactionClientRequest);
            exports_22("CreateSafeDropTransactionClientResponse", CreateSafeDropTransactionClientResponse = Commerce.TenderCounting.CreateSafeDropTransactionClientResponse);
            exports_22("CreateStartingAmountTransactionClientRequest", CreateStartingAmountTransactionClientRequest = Commerce.CashManagement.CreateStartingAmountTransactionClientRequest);
            exports_22("CreateStartingAmountTransactionClientResponse", CreateStartingAmountTransactionClientResponse = Commerce.CashManagement.CreateStartingAmountTransactionClientResponse);
            exports_22("CreateTenderDeclarationTransactionClientRequest", CreateTenderDeclarationTransactionClientRequest = Commerce.TenderCounting.CreateTenderDeclarationTransactionClientRequest);
            exports_22("CreateTenderDeclarationTransactionClientResponse", CreateTenderDeclarationTransactionClientResponse = Commerce.TenderCounting.CreateTenderDeclarationTransactionClientResponse);
            exports_22("CreateTenderRemovalTransactionClientRequest", CreateTenderRemovalTransactionClientRequest = Commerce.CashManagement.CreateTenderRemovalTransactionClientRequest);
            exports_22("CreateTenderRemovalTransactionClientResponse", CreateTenderRemovalTransactionClientResponse = Commerce.CashManagement.CreateTenderRemovalTransactionClientResponse);
            exports_22("DeclareStartingAmountClientRequest", DeclareStartingAmountClientRequest = Commerce.DeclareStartingAmountClientRequest);
            exports_22("DeclareStartingAmountClientResponse", DeclareStartingAmountClientResponse = Commerce.DeclareStartingAmountClientResponse);
            exports_22("GetCountedTenderDetailAmountClientRequest", GetCountedTenderDetailAmountClientRequest = Commerce.TenderCounting.GetCountedTenderDetailAmountClientRequest);
            exports_22("GetCountedTenderDetailAmountClientResponse", GetCountedTenderDetailAmountClientResponse = Commerce.TenderCounting.GetCountedTenderDetailAmountClientResponse);
            exports_22("GetDenominationTotalsClientRequest", GetDenominationTotalsClientRequest = Commerce.GetDenominationTotalsClientRequest);
            exports_22("GetDenominationTotalsClientResponse", GetDenominationTotalsClientResponse = Commerce.GetDenominationTotalsClientResponse);
            exports_22("GetOfflinePendingTransactionCountClientRequest", GetOfflinePendingTransactionCountClientRequest = Commerce.GetOfflinePendingTransactionCountClientRequest);
            exports_22("GetOfflinePendingTransactionCountClientResponse", GetOfflinePendingTransactionCountClientResponse = Commerce.GetOfflinePendingTransactionCountClientResponse);
            exports_22("GetPickingAndReceivingOrdersClientRequest", GetPickingAndReceivingOrdersClientRequest = Commerce.StoreOperations.GetPickingAndReceivingOrdersClientRequest);
            exports_22("GetPickingAndReceivingOrdersClientResponse", GetPickingAndReceivingOrdersClientResponse = Commerce.StoreOperations.GetPickingAndReceivingOrdersClientResponse);
            exports_22("GetReportParametersClientRequest", GetReportParametersClientRequest = Commerce.GetReportParametersClientRequest);
            exports_22("GetReportParametersClientResponse", GetReportParametersClientResponse = Commerce.GetReportParametersClientResponse);
            exports_22("GetSalesOrdersWithNoFiscalTransactionsRequest", GetSalesOrdersWithNoFiscalTransactionsRequest = Commerce.GetSalesOrdersWithNoFiscalTransactionsRequest);
            exports_22("GetSalesOrdersWithNoFiscalTransactionsResponse", GetSalesOrdersWithNoFiscalTransactionsResponse = Commerce.GetSalesOrdersWithNoFiscalTransactionsResponse);
            exports_22("GetStartingAmountClientRequest", GetStartingAmountClientRequest = Commerce.CashManagement.GetStartingAmountClientRequest);
            exports_22("GetStartingAmountClientResponse", GetStartingAmountClientResponse = Commerce.CashManagement.GetStartingAmountClientResponse);
            exports_22("GetTenderDetailsClientRequest", GetTenderDetailsClientRequest = Commerce.GetTenderDetailsClientRequest);
            exports_22("GetTenderDetailsClientResponse", GetTenderDetailsClientResponse = Commerce.GetTenderDetailsClientResponse);
            exports_22("RegisterCustomAuditEventClientRequest", RegisterCustomAuditEventClientRequest = Commerce.RegisterCustomAuditEventClientRequest);
            exports_22("RegisterCustomAuditEventClientResponse", RegisterCustomAuditEventClientResponse = Commerce.RegisterCustomAuditEventClientResponse);
            exports_22("SaveFiscalTransactionClientRequest", SaveFiscalTransactionClientRequest = Commerce.SaveFiscalTransactionClientRequest);
            exports_22("SaveFiscalTransactionClientResponse", SaveFiscalTransactionClientResponse = Commerce.SaveFiscalTransactionClientResponse);
            exports_22("SelectZipCodeInfoClientRequest", SelectZipCodeInfoClientRequest = Commerce.SelectZipCodeInfoClientRequest);
            exports_22("SelectZipCodeInfoClientResponse", SelectZipCodeInfoClientResponse = Commerce.SelectZipCodeInfoClientResponse);
            // Operation Messages
            exports_22("BankDropOperationRequest", BankDropOperationRequest = Commerce.BankDropOperationRequest);
            exports_22("BankDropOperationResponse", BankDropOperationResponse = Commerce.BankDropOperationResponse);
            exports_22("DeclareStartAmountOperationRequest", DeclareStartAmountOperationRequest = Commerce.DeclareStartAmountOperationRequest);
            exports_22("DeclareStartAmountOperationResponse", DeclareStartAmountOperationResponse = Commerce.DeclareStartAmountOperationResponse);
            exports_22("IssueLoyaltyCardOperationRequest", IssueLoyaltyCardOperationRequest = Commerce.IssueLoyaltyCardOperationRequest);
            exports_22("IssueLoyaltyCardOperationResponse", IssueLoyaltyCardOperationResponse = Commerce.IssueLoyaltyCardOperationResponse);
            exports_22("LoyaltyCardPointsBalanceOperationRequest", LoyaltyCardPointsBalanceOperationRequest = Commerce.LoyaltyCardPointsBalanceOperationRequest);
            exports_22("LoyaltyCardPointsBalanceOperationResponse", LoyaltyCardPointsBalanceOperationResponse = Commerce.LoyaltyCardPointsBalanceOperationResponse);
            exports_22("SafeDropOperationRequest", SafeDropOperationRequest = Commerce.SafeDropOperationRequest);
            exports_22("SafeDropOperationResponse", SafeDropOperationResponse = Commerce.SafeDropOperationResponse);
            exports_22("TenderDeclarationOperationRequest", TenderDeclarationOperationRequest = Commerce.TenderDeclarationOperationRequest);
            exports_22("TenderDeclarationOperationResponse", TenderDeclarationOperationResponse = Commerce.TenderDeclarationOperationResponse);
            exports_22("TenderRemovalOperationRequest", TenderRemovalOperationRequest = Commerce.TenderRemovalOperationRequest);
            exports_22("TenderRemovalOperationResponse", TenderRemovalOperationResponse = Commerce.TenderRemovalOperationResponse);
            // Service Requests/Responses - Each request response pair maps to a Retail Server API.
            exports_22("CreateNonSalesTransactionServiceRequest", CreateNonSalesTransactionServiceRequest = Commerce.CreateNonSalesTransactionServiceRequest);
            exports_22("CreateNonSalesTransactionServiceResponse", CreateNonSalesTransactionServiceResponse = Commerce.CreateNonSalesTransactionServiceResponse);
            exports_22("GetCommissionSalesGroupsServiceRequest", GetCommissionSalesGroupsServiceRequest = Commerce.GetCommissionSalesGroupsServiceRequest);
            exports_22("GetCommissionSalesGroupsServiceResponse", GetCommissionSalesGroupsServiceResponse = Commerce.GetCommissionSalesGroupsServiceResponse);
            exports_22("GetCurrenciesServiceRequest", GetCurrenciesServiceRequest = Commerce.GetCurrenciesServiceRequest);
            exports_22("GetCurrenciesServiceResponse", GetCurrenciesServiceResponse = Commerce.GetCurrenciesServiceResponse);
            exports_22("GetSrsReportDataSetServiceRequest", GetSrsReportDataSetServiceRequest = Commerce.Reports.GetSrsReportDataSetServiceRequest);
            exports_22("GetSrsReportDataSetServiceResponse", GetSrsReportDataSetServiceResponse = Commerce.Reports.GetSrsReportDataSetServiceResponse);
            exports_22("SearchCommissionSalesGroupsServiceRequest", SearchCommissionSalesGroupsServiceRequest = Commerce.SearchCommissionSalesGroupsServiceRequest);
            exports_22("SearchCommissionSalesGroupsServiceResponse", SearchCommissionSalesGroupsServiceResponse = Commerce.SearchCommissionSalesGroupsServiceResponse);
        }
    };
});
System.register("PosApi/Framework/Runtime", [], function (exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("PosApi/Framework/Logging", [], function (exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("PosApi/Framework/Navigation", [], function (exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("PosApi/Framework/ControlFactory", [], function (exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("PosApi/Framework/ExtensionContext", [], function (exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("PosApi/Create/Controls", [], function (exports_28, context_28) {
    "use strict";
    var ExtensionControlBase;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [],
        execute: function () {
            /**
             * Represents a POS Controls.
             */
            ExtensionControlBase = /** @class */ (function () {
                function ExtensionControlBase(context) {
                    this.context = context;
                }
                return ExtensionControlBase;
            }());
            exports_28("ExtensionControlBase", ExtensionControlBase);
        }
    };
});
System.register("PosApi/Create/Dialogs", ["PosApi/TypeExtensions"], function (exports_29, context_29) {
    "use strict";
    var TypeExtensions_1, ExtensionTemplatedDialogBase;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (TypeExtensions_1_1) {
                TypeExtensions_1 = TypeExtensions_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents template dialog.
             * Dialog renders template with context provided.
             * On result it returns context back with updated values if any.
             */
            ExtensionTemplatedDialogBase = /** @class */ (function () {
                function ExtensionTemplatedDialogBase() {
                    /**
                     * Capture or not the global input for NumPad when typing.
                     */
                    this.captureGlobalInputForNumPad = false;
                    this.context = this._templatedDialogContext;
                    this._onBarcodeScanned = null;
                    this._onMsrSwiped = null;
                    this._isOpen = false;
                    this._proxyControl = this._createTemplatedDialogProxyControl(this);
                }
                Object.defineProperty(ExtensionTemplatedDialogBase.prototype, "numPadInputBroker", {
                    /**
                     * Gets the numpad input broker which serves as publisher\subscriber between view's numpad and the peripheral layer.
                     * @return {Commerce.Peripherals.NumPadInputBroker} The instance of the broker.
                     */
                    get: function () {
                        return this._proxyControl.numPadInputBroker();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionTemplatedDialogBase.prototype, "onBarcodeScanned", {
                    /**
                     * Gets the handler for bacode scanner when it reads a barcode.
                     * @returns {(barcode: string) => void} The barcode scanned handler.
                     */
                    get: function () {
                        return this._onBarcodeScanned;
                    },
                    /**
                     * Sets the handler for bacode scanner when it reads a barcode.
                     * @remarks Derived classes should set the handler on its constructor.
                     */
                    set: function (impl) {
                        if (!TypeExtensions_1.ObjectExtensions.isFunction(impl)) {
                            throw new Error("ExtensionTemplatedDialogBase.onBarcodeScanned - The barcode scanned handler must be a function.");
                        }
                        else if (this._isOpen) {
                            throw new Error("ExtensionTemplatedDialogBase.onBarcodeScanned - Cannot set the barcode scanned handler after the dialog has been opened.");
                        }
                        this._onBarcodeScanned = impl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionTemplatedDialogBase.prototype, "onMsrSwiped", {
                    /**
                     * Gets the handler for magnetic stripe reader when a card is swiped.
                     * @returns {(cardInfo: ClientEntities.ICardInfo) => void} The MSR swiped handler.
                     */
                    get: function () {
                        return this._onMsrSwiped;
                    },
                    /**
                     * Sets the handler for magnetic stripe reader when a card is swiped.
                     * @remarks Derived classes should set the handler on its constructor to handle MSR Swipe.
                     */
                    set: function (impl) {
                        if (!TypeExtensions_1.ObjectExtensions.isFunction(impl)) {
                            throw new Error("ExtensionTemplatedDialogBase.onMsrSwiped - The MSR swiped handler must be a function.");
                        }
                        else if (this._isOpen) {
                            throw new Error("ExtensionTemplatedDialogBase.onMsrSwiped - Cannot set the MSR swiped handler after the dialog has been opened.");
                        }
                        this._onMsrSwiped = impl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionTemplatedDialogBase.prototype, "isProcessing", {
                    /**
                     * Sets the modal dialog indeterminate wait visibility value.
                     */
                    set: function (visible) {
                        this._proxyControl.setIsProcessing(visible);
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Opens POS dialog control.
                 * Method should be called by dialog extension and pass necessary parameters.
                 * @param {ITemplatedDialogOptions} dialogOptions Dialog options.
                 */
                ExtensionTemplatedDialogBase.prototype.openDialog = function (dialogOptions) {
                    this._proxyControl.openDialog(dialogOptions);
                    this._isOpen = true;
                };
                /**
                 * Closes POS dialog control.
                 */
                ExtensionTemplatedDialogBase.prototype.closeDialog = function () {
                    this._proxyControl.closeDialog();
                    this._isOpen = false;
                };
                /**
                 * Disable modal dialog button using id.
                 * @param {string} buttonId Button id.
                 * @param {boolean} disabled Disabled state.
                 */
                ExtensionTemplatedDialogBase.prototype.setButtonDisabledState = function (buttonId, disabled) {
                    this._proxyControl.setButtonDisabledState(buttonId, disabled);
                };
                return ExtensionTemplatedDialogBase;
            }());
            exports_29("ExtensionTemplatedDialogBase", ExtensionTemplatedDialogBase);
        }
    };
});
System.register("PosApi/Create/RequestHandlers", [], function (exports_30, context_30) {
    "use strict";
    var Request, Response, RequestHandler, ExtensionRequestBase, ExtensionRequestHandlerBase;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [],
        execute: function () {
            exports_30("Request", Request = Commerce.Request);
            exports_30("Response", Response = Commerce.Response);
            exports_30("RequestHandler", RequestHandler = Commerce.RequestHandler);
            /**
             * Represents the base class for new extension requests.
             * @remarks All extension requests should derive from this class.
             */
            ExtensionRequestBase = /** @class */ (function (_super) {
                __extends(ExtensionRequestBase, _super);
                /**
                 * Creates a new instance of the ExtensionRequestBase class.
                 * @param {string} [correlationId] The identifier used to correlate events related to this request.
                 */
                function ExtensionRequestBase(correlationId) {
                    return _super.call(this, correlationId) || this;
                }
                return ExtensionRequestBase;
            }(Request));
            exports_30("ExtensionRequestBase", ExtensionRequestBase);
            /**
             * Represents the base class for all extension request handlers.
             */
            ExtensionRequestHandlerBase = /** @class */ (function (_super) {
                __extends(ExtensionRequestHandlerBase, _super);
                /**
                 * Creates a new instance of the ExtensionRequestHandlerBase class.
                 * @param {IExtensionRequestHandlerContext} context
                 */
                function ExtensionRequestHandlerBase(context) {
                    var _this = _super.call(this) || this;
                    _this.context = context;
                    return _this;
                }
                return ExtensionRequestHandlerBase;
            }(RequestHandler));
            exports_30("ExtensionRequestHandlerBase", ExtensionRequestHandlerBase);
        }
    };
});
System.register("PosApi/Create/Operations", ["PosApi/Create/RequestHandlers"], function (exports_31, context_31) {
    "use strict";
    var RequestHandlers_1, ExtensionOperationRequestBase, ExtensionOperationRequestHandlerBase;
    var __moduleName = context_31 && context_31.id;
    return {
        setters: [
            function (RequestHandlers_1_1) {
                RequestHandlers_1 = RequestHandlers_1_1;
            }
        ],
        execute: function () {
            exports_31("ExtensionOperationRequestBase", ExtensionOperationRequestBase = Commerce.Extensibility.ExtensionOperationRequestBase);
            /**
             * Base class for operation request handler extension.
             */
            ExtensionOperationRequestHandlerBase = /** @class */ (function (_super) {
                __extends(ExtensionOperationRequestHandlerBase, _super);
                function ExtensionOperationRequestHandlerBase(context) {
                    var _this = _super.call(this) || this;
                    _this.context = context;
                    return _this;
                }
                return ExtensionOperationRequestHandlerBase;
            }(RequestHandlers_1.RequestHandler));
            exports_31("ExtensionOperationRequestHandlerBase", ExtensionOperationRequestHandlerBase);
        }
    };
});
System.register("PosApi/Framework/Messaging", [], function (exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("PosApi/Create/Views", ["PosApi/TypeExtensions"], function (exports_33, context_33) {
    "use strict";
    var TypeExtensions_2, ExtensionViewControllerBase, Icons, CustomViewControllerBase, CustomCommand, CustomCommandBar, CustomViewControllerBaseState;
    var __moduleName = context_33 && context_33.id;
    return {
        setters: [
            function (TypeExtensions_2_1) {
                TypeExtensions_2 = TypeExtensions_2_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension view controllers.
             * @remarks All extension view controllers should derive from this class.
             * @deprecated Please extend CustomViewControllerBase instead of extending this class. Extending this class is no
             * longer supported in the independent packaging model.
             */
            ExtensionViewControllerBase = /** @class */ (function (_super) {
                __extends(ExtensionViewControllerBase, _super);
                /**
                 * Base controller constructor.
                 * @param {IExtensionViewControllerContext} context View context.
                 * @param {boolean} saveInHistory Allows multiple instances of the same view to be saved in history seqientially.
                 *  Example: Categories view for drill down feature.
                 */
                function ExtensionViewControllerBase(context, saveInHistory) {
                    var _this = _super.call(this, saveInHistory) || this;
                    /**
                     * Capture or not the global input for NumPad when typing.
                     */
                    _this.captureGlobalInputForNumPad = false;
                    _this.context = context;
                    _this._numPadInputBroker = new Commerce.Peripherals.NumPadInputBroker();
                    return _this;
                }
                Object.defineProperty(ExtensionViewControllerBase.prototype, "numPadInputBroker", {
                    /**
                     * Gets the numpad input broker which serves as publisher\subscriber between view's numpad and the peripheral layer.
                     * @return {Commerce.Peripherals.NumPadInputBroker} The instance of the broker.
                     */
                    get: function () {
                        return this._numPadInputBroker;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ExtensionViewControllerBase;
            }(Commerce.Extensibility.DisposableViewControllerBase));
            exports_33("ExtensionViewControllerBase", ExtensionViewControllerBase);
            /**
             * Enum containing the list of supported icons.
             */
            exports_33("Icons", Icons = Commerce.ViewModels.Icons);
            /**
             * The base class that custom view controllers implement.
             */
            CustomViewControllerBase = /** @class */ (function () {
                function CustomViewControllerBase(context, config) {
                    if (TypeExtensions_2.ObjectExtensions.isNullOrUndefined(context)) {
                        throw new Error("CustomViewControllerBase constructor requires defined context.");
                    }
                    this.context = context;
                    this.state = new CustomViewControllerBaseState(context, config);
                    this.context.messageChannel.start();
                }
                /**
                 * Called when view is shown.
                 */
                CustomViewControllerBase.prototype.onShown = function () {
                    // No-op can be overridden by derived classes to add custom logic.
                    return;
                };
                /**
                 * Called when view is hidden.
                 */
                CustomViewControllerBase.prototype.onHidden = function () {
                    // No-op can be overridden by derived classes to add custom logic.
                    return;
                };
                return CustomViewControllerBase;
            }());
            exports_33("CustomViewControllerBase", CustomViewControllerBase);
            /**
             * Implementation of the ICommand interface responsible for notifiying POS when the state is updated.
             */
            CustomCommand = /** @class */ (function () {
                /**
                 * Creates a new instance of the CustomCommandState class.
                 * @param {ICustomViewControllerContext} context The view controller context.
                 * @param {ICommandDefinition} definition The command definition.
                 */
                function CustomCommand(context, definition) {
                    if (TypeExtensions_2.ObjectExtensions.isNullOrUndefined(context)) {
                        throw new Error("CustomCommand constructor called with invalid parameters: context cannot be null or undefined.");
                    }
                    else if (TypeExtensions_2.ObjectExtensions.isNullOrUndefined(definition)) {
                        throw new Error("CustomCommand constructor called with invalid parameters: command definition cannot be null or undefined.");
                    }
                    else if (!TypeExtensions_2.ObjectExtensions.isFunction(definition.execute)) {
                        throw new Error("CustomCommand constructor called with invalid parameters: command definition must provide an implementation for execute.");
                    }
                    else if (TypeExtensions_2.StringExtensions.isNullOrWhitespace(definition.name)) {
                        throw new Error("CustomCommand constructor called with invalid parameters: command definition must provide a name.");
                    }
                    else if (TypeExtensions_2.StringExtensions.isNullOrWhitespace(definition.icon)) {
                        throw new Error("CustomCommand constructor called with invalid parameters: command definition must provide an icon.");
                    }
                    this.icon = definition.icon;
                    this.name = definition.name;
                    this.label = definition.label;
                    this._canExecute = definition.canExecute;
                    this._isVisible = definition.isVisible;
                    this._messageChannel = context.messageChannel;
                    this._executeImpl = definition.execute;
                }
                Object.defineProperty(CustomCommand.prototype, "canExecute", {
                    /**
                     * Gets the can execute value.
                     * @returns {boolean} True if the command can execute. False otherwise.
                     */
                    get: function () {
                        return this._canExecute;
                    },
                    /**
                     * Sets the can execute value.
                     * @param {boolean} value True if the command can execute. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._canExecute) {
                            this._canExecute = value;
                            this._messageChannel.sendMessage("CommandCanExecuteChanged", { commandName: this.name, canExecute: this._canExecute });
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CustomCommand.prototype, "isVisible", {
                    /**
                     * Gets the value indicating whether or not the command should be visible.
                     * @returns {boolean} True if the command is visible. False otherwise.
                     */
                    get: function () {
                        return this._isVisible;
                    },
                    /**
                     * Sets the is visible value.
                     * @param {boolean} value True if the command should be visible. False otherwise.
                     */
                    set: function (value) {
                        if (this._isVisible !== value) {
                            this._isVisible = value;
                            this._messageChannel.sendMessage("CommandIsVisibleChanged", { commandName: this.name, isVisible: this._isVisible });
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Executes the command.
                 * @param {CustomViewControllerExecuteCommandArgs} args The command arguments.
                 */
                CustomCommand.prototype.execute = function (args) {
                    this._executeImpl(args);
                };
                return CustomCommand;
            }());
            /**
             * Command bar implementation responsible for managing the commands.
             */
            CustomCommandBar = /** @class */ (function () {
                /**
                 * Creates a new instance of the CustomCommandBar class.
                 * @param {ICustomViewControllerContext} context The view controller context for the view controller that contains the command bar.
                 * @param {ICommandBarConfiguration} [config] The command bar configuration, if any.
                 */
                function CustomCommandBar(context, config) {
                    if (TypeExtensions_2.ObjectExtensions.isNullOrUndefined(config) || !TypeExtensions_2.ArrayExtensions.hasElements(config.commands)) {
                        this._commands = [];
                    }
                    else {
                        var commandsByName_1 = Object.create(null);
                        this._commands = config.commands.map(function (def) {
                            var commandState = new CustomCommand(context, def);
                            if (!TypeExtensions_2.ObjectExtensions.isNullOrUndefined(commandsByName_1[commandState.name])) {
                                throw new Error("Invalid configuration provided CustomCommandBar. More than one command with command name: " + commandState.name);
                            }
                            commandsByName_1[commandState.name] = commandState;
                            return commandState;
                        });
                        context.messageChannel.addMessageHandler("ExecuteCommand", function (data) {
                            var command = commandsByName_1[data.commandName];
                            if (command instanceof CustomCommand) {
                                command.execute(data);
                            }
                        });
                    }
                }
                Object.defineProperty(CustomCommandBar.prototype, "commands", {
                    /**
                     * Gets a copy of the collection of command bar commands.
                     * @returns {Commerce.Extensibility.ICommand[]} The command bar commands.
                     */
                    get: function () {
                        return this._commands.slice();
                    },
                    enumerable: true,
                    configurable: true
                });
                return CustomCommandBar;
            }());
            /**
             * The class for tracking custom view controller base state.
             */
            CustomViewControllerBaseState = /** @class */ (function () {
                /**
                 * Creates a new instance of the CustomViewControllerBaseState class.
                 * @param {ICustomViewControllerContext} context The view controller context.
                 * @param {ICustomViewControllerConfiguration} config The view controller configuration.
                 */
                function CustomViewControllerBaseState(context, config) {
                    config = config || { title: TypeExtensions_2.StringExtensions.EMPTY, commandBar: { commands: [] } };
                    this._context = context;
                    this._title = config.title;
                    this._isProcessing = false;
                    this._commandBar = new CustomCommandBar(context, config.commandBar);
                }
                Object.defineProperty(CustomViewControllerBaseState.prototype, "title", {
                    /**
                     * Gets the title for the view.
                     * @return {string} The title for the view.
                     */
                    get: function () {
                        return this._title;
                    },
                    /**
                     * Sets the title for the view.
                     * @param {string} newTitle The title for the view.
                     */
                    set: function (newTitle) {
                        if (this._title !== newTitle) {
                            this._title = newTitle;
                            this._context.messageChannel.sendMessage("TitleChanged", this._title);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CustomViewControllerBaseState.prototype, "isProcessing", {
                    /**
                     * Gets a value indicating whether or not the view is processing.
                     * @return {boolean} True if the command is processing. False otherwise.
                     */
                    get: function () {
                        return this._isProcessing;
                    },
                    /**
                     * Sets a value indicating whether or not the view is processing.
                     * @param {boolean} value True if the custom control is processing. False otherwise.
                     */
                    set: function (newIsProcessing) {
                        if (this._isProcessing !== newIsProcessing) {
                            this._isProcessing = newIsProcessing;
                            this._context.messageChannel.sendMessage("IsProcessingChanged", this._isProcessing);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CustomViewControllerBaseState.prototype, "commandBar", {
                    /**
                     * Gets the command bar state.
                     * @returns {Readonly<ICommandBar>} The command bar state.
                     */
                    get: function () {
                        return this._commandBar;
                    },
                    enumerable: true,
                    configurable: true
                });
                return CustomViewControllerBaseState;
            }());
        }
    };
});
System.register("PosApi/Extend/Views/CustomControls", [], function (exports_34, context_34) {
    "use strict";
    var CustomControlBase;
    var __moduleName = context_34 && context_34.id;
    return {
        setters: [],
        execute: function () {
            /**
             * The base class for all custom controls.
             * @remarks Custom controls in extensions should not directly inherit from this class. Instead custom controls should inherit from the derived class
             * for the page to be extended.
             */
            CustomControlBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the CustomControlBase class.
                 * @param {string} id The control identifier.
                 * @param {ICustomControlContext<TExtToPage, TPageToExtMap>} context The custom control context.
                 */
                function CustomControlBase(id, context) {
                    var _this = this;
                    this.context = context;
                    this._isProcessing = false;
                    this._id = id;
                    this.context.messageChannel.addMessageHandler("Initialize", function (data) {
                        _this.init(data);
                    });
                    this.context.messageChannel.addMessageHandler("Dispose", function () {
                        _this.dispose();
                    });
                    // Start the message channel to begin receiving messages.
                    this.context.messageChannel.start();
                }
                Object.defineProperty(CustomControlBase.prototype, "id", {
                    /**
                     * Gets the control's identifier.
                     * @returns {string} The identifier.
                     */
                    get: function () {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CustomControlBase.prototype, "isProcessing", {
                    /**
                     * Gets a value indicating whether or not the custom control is processing.
                     * @return {boolean} True if the custom control is processing. False otherwise.
                     */
                    get: function () {
                        return this._isProcessing;
                    },
                    /**
                     * Sets a value indicating whether or not the custom control is processing.
                     * @param {boolean} value True if the custom control is processing. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isProcessing) {
                            this._isProcessing = value;
                            this.context.messageChannel.sendMessage("IsProcessingChanged", this._isProcessing);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Disposes the control releasing its resources.
                 */
                CustomControlBase.prototype.dispose = function () {
                    Commerce.ObjectExtensions.disposeAllProperties(this);
                };
                return CustomControlBase;
            }());
            exports_34("CustomControlBase", CustomControlBase);
        }
    };
});
System.register("PosApi/Extend/DualDisplay", [], function (exports_35, context_35) {
    "use strict";
    var DualDisplayCustomControlBase;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [],
        execute: function () {
            /**
             * Represents the base class for all extension controls on the cart page.
             * @remarks Custom controls in extensions should derive from this class.
             */
            DualDisplayCustomControlBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the DualDisplayCustomControlBase class.
                 * @param {string} id The control identifier.
                 * @param {ICartViewCustomControlContext} context The control context.
                 */
                function DualDisplayCustomControlBase(id, context) {
                    var _this = this;
                    // Initializes fields.
                    this.context = context;
                    this._isProcessing = false;
                    this._id = id;
                    // Adds the message handlers.
                    this.context.messageChannel.addMessageHandler("Initialize", function (data) {
                        _this.init(data);
                    });
                    this.context.messageChannel.addMessageHandler("Dispose", function () {
                        _this.dispose();
                    });
                    this.context.messageChannel.addMessageHandler("CartChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.cartChangedHandler)) {
                            _this.cartChangedHandler(data);
                        }
                    });
                    this.context.messageChannel.addMessageHandler("CustomerChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.customerChangedHandler)) {
                            _this.customerChangedHandler(data);
                        }
                    });
                    this.context.messageChannel.addMessageHandler("DualDisplayConfigurationChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.dualDisplayConfigurationChangedHandler)) {
                            _this.dualDisplayConfigurationChangedHandler(data);
                        }
                    });
                    this.context.messageChannel.addMessageHandler("LogOnStatusChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.logOnStatusChangedHandler)) {
                            _this.logOnStatusChangedHandler(data);
                        }
                    });
                    // Start the message channel to begin receiving messages.
                    this.context.messageChannel.start();
                }
                Object.defineProperty(DualDisplayCustomControlBase.prototype, "id", {
                    /**
                     * Gets the control's identifier.
                     * @returns {string} The identifier.
                     */
                    get: function () {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Disposes the control releasing its resources.
                 */
                DualDisplayCustomControlBase.prototype.dispose = function () {
                    Commerce.ObjectExtensions.disposeAllProperties(this);
                };
                Object.defineProperty(DualDisplayCustomControlBase.prototype, "isProcessing", {
                    /**
                     * Gets a value indicating whether or not the dual display custom control is processing.
                     * @return {boolean} True if the dual display custom control is processing. False otherwise.
                     */
                    get: function () {
                        return this._isProcessing;
                    },
                    /**
                     * Sets a value indicating whether or not the dual display custom control is processing.
                     * @param {boolean} value True if the dual display custom control is processing. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isProcessing) {
                            this._isProcessing = value;
                            this.context.messageChannel.sendMessage("IsProcessingChanged", this._isProcessing);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return DualDisplayCustomControlBase;
            }());
            exports_35("DualDisplayCustomControlBase", DualDisplayCustomControlBase);
        }
    };
});
System.register("PosApi/Extend/RequestHandlers/RequestHandlers", [], function (exports_36, context_36) {
    "use strict";
    var RequestHandler, ReplacementRequestHandlerBase;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [],
        execute: function () {
            RequestHandler = Commerce.RequestHandler;
            /**
             * Represents the base for a asynchronous replacement request handler.
             */
            ReplacementRequestHandlerBase = /** @class */ (function (_super) {
                __extends(ReplacementRequestHandlerBase, _super);
                /**
                 * Creates a new instance of the ExtensionRequestHandlerBase class.
                 * @param {IExtensionRequestHandlerContext} context
                 */
                function ReplacementRequestHandlerBase(context) {
                    var _this = _super.call(this) || this;
                    _this.context = context;
                    return _this;
                }
                /**
                 * Executes the default request handler asynchronously.
                 * @param {Request<TResponse>} request The request.
                 * @return {Promise<Client.Entities.ICancelableDataResult<TResponse>>} The promise with a cancelable result containing the response.
                 */
                ReplacementRequestHandlerBase.prototype.defaultExecuteAsync = function (request) {
                    return Promise.reject("The implementation for the defaultExecuteAsync has not been set.");
                };
                return ReplacementRequestHandlerBase;
            }(RequestHandler));
            exports_36("ReplacementRequestHandlerBase", ReplacementRequestHandlerBase);
        }
    };
});
System.register("PosApi/Extend/RequestHandlers/CartRequestHandlers", ["PosApi/Extend/RequestHandlers/RequestHandlers", "PosApi/Consume/Cart"], function (exports_37, context_37) {
    "use strict";
    var RequestHandlers_2, Cart_1, AddTenderLineToCartClientRequestHandler, GetKeyedInPriceClientRequestHandler, GetKeyedInQuantityClientRequestHandler, GetPickupDateClientRequestHandler, GetShippingDateClientRequestHandler, ShowChangeDueClientRequestHandler, GetReceiptEmailAddressClientRequestHandler, DepositOverrideOperationRequestHandler, GetShippingChargeClientRequestHandler;
    var __moduleName = context_37 && context_37.id;
    return {
        setters: [
            function (RequestHandlers_2_1) {
                RequestHandlers_2 = RequestHandlers_2_1;
            },
            function (Cart_1_1) {
                Cart_1 = Cart_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all replacement for AddTenderLineToCartClientRequestHandler.
             * @remarks All replacement for AddTenderLineToCartClientRequestHandler should derive from this class.
             */
            AddTenderLineToCartClientRequestHandler = /** @class */ (function (_super) {
                __extends(AddTenderLineToCartClientRequestHandler, _super);
                function AddTenderLineToCartClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<AddTenderLineToCartClientResponse>} The supported abstract or concrete operation request type.
                 */
                AddTenderLineToCartClientRequestHandler.prototype.supportedRequestType = function () {
                    return Cart_1.AddTenderLineToCartClientRequest;
                };
                return AddTenderLineToCartClientRequestHandler;
            }(RequestHandlers_2.ReplacementRequestHandlerBase));
            exports_37("AddTenderLineToCartClientRequestHandler", AddTenderLineToCartClientRequestHandler);
            /**
             * Represents the base class for all replacement for GetKeyedInPriceClientRequestHandler.
             * @remarks All replacement for GetKeyedInPriceClientRequestHandler should derive from this class.
             */
            GetKeyedInPriceClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetKeyedInPriceClientRequestHandler, _super);
                function GetKeyedInPriceClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetKeyedInPriceClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetKeyedInPriceClientRequestHandler.prototype.supportedRequestType = function () {
                    return Cart_1.GetKeyedInPriceClientRequest;
                };
                return GetKeyedInPriceClientRequestHandler;
            }(RequestHandlers_2.ReplacementRequestHandlerBase));
            exports_37("GetKeyedInPriceClientRequestHandler", GetKeyedInPriceClientRequestHandler);
            /**
             * Represents the base class for all replacement for GetKeyedInQuantityClientRequestHandler.
             * @remarks All replacement for GetKeyedInQuantityClientRequestHandler should derive from this class.
             */
            GetKeyedInQuantityClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetKeyedInQuantityClientRequestHandler, _super);
                function GetKeyedInQuantityClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetKeyedInQuantityClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetKeyedInQuantityClientRequestHandler.prototype.supportedRequestType = function () {
                    return Cart_1.GetKeyedInQuantityClientRequest;
                };
                return GetKeyedInQuantityClientRequestHandler;
            }(RequestHandlers_2.ReplacementRequestHandlerBase));
            exports_37("GetKeyedInQuantityClientRequestHandler", GetKeyedInQuantityClientRequestHandler);
            /**
             * Represents the base class for all replacement for GetPickupDateClientRequestHandler.
             * @remarks All replacement for GetPickupDateClientRequestHandler should derive from this class.
             */
            GetPickupDateClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetPickupDateClientRequestHandler, _super);
                function GetPickupDateClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetPickupDateClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetPickupDateClientRequestHandler.prototype.supportedRequestType = function () {
                    return Cart_1.GetPickupDateClientRequest;
                };
                return GetPickupDateClientRequestHandler;
            }(RequestHandlers_2.ReplacementRequestHandlerBase));
            exports_37("GetPickupDateClientRequestHandler", GetPickupDateClientRequestHandler);
            /**
             * Represents the base class for all replacement for GetShippingDateClientRequestHandler.
             * @remarks All replacement for GetShippingDateClientRequestHandler should derive from this class.
             */
            GetShippingDateClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetShippingDateClientRequestHandler, _super);
                function GetShippingDateClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetShippingDateClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetShippingDateClientRequestHandler.prototype.supportedRequestType = function () {
                    return Cart_1.GetShippingDateClientRequest;
                };
                return GetShippingDateClientRequestHandler;
            }(RequestHandlers_2.ReplacementRequestHandlerBase));
            exports_37("GetShippingDateClientRequestHandler", GetShippingDateClientRequestHandler);
            /**
             * Represents the base class for all replacement for ShowChangeDueClientRequestHandler.
             * @remarks All replacement for ShowChangeDueClientRequestHandler should derive from this class.
             */
            ShowChangeDueClientRequestHandler = /** @class */ (function (_super) {
                __extends(ShowChangeDueClientRequestHandler, _super);
                function ShowChangeDueClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<ShowChangeDueClientResponse>} The supported abstract or concrete operation request type.
                 */
                ShowChangeDueClientRequestHandler.prototype.supportedRequestType = function () {
                    return Cart_1.ShowChangeDueClientRequest;
                };
                return ShowChangeDueClientRequestHandler;
            }(RequestHandlers_2.ReplacementRequestHandlerBase));
            exports_37("ShowChangeDueClientRequestHandler", ShowChangeDueClientRequestHandler);
            /**
             * Represents the base class for all replacement GetReceiptEmailAddressClientRequestHandler.
             * @remarks All replacement GetReceiptEmailAddressClientRequestHandler should derive from this class.
             */
            GetReceiptEmailAddressClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetReceiptEmailAddressClientRequestHandler, _super);
                function GetReceiptEmailAddressClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetReceiptEmailAddressClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetReceiptEmailAddressClientRequestHandler.prototype.supportedRequestType = function () {
                    return Cart_1.GetReceiptEmailAddressClientRequest;
                };
                return GetReceiptEmailAddressClientRequestHandler;
            }(RequestHandlers_2.ReplacementRequestHandlerBase));
            exports_37("GetReceiptEmailAddressClientRequestHandler", GetReceiptEmailAddressClientRequestHandler);
            /**
             * Represents the base class for all replacement DepositOverrideOperationRequestHandler.
             * @remarks All replacement DepositOverrideOperationRequestHandler should derive from this class.
             */
            DepositOverrideOperationRequestHandler = /** @class */ (function (_super) {
                __extends(DepositOverrideOperationRequestHandler, _super);
                function DepositOverrideOperationRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<DepositOverrideOperationResponse>} The supported abstract or concrete operation request type.
                 */
                DepositOverrideOperationRequestHandler.prototype.supportedRequestType = function () {
                    return Cart_1.DepositOverrideOperationRequest;
                };
                return DepositOverrideOperationRequestHandler;
            }(RequestHandlers_2.ReplacementRequestHandlerBase));
            exports_37("DepositOverrideOperationRequestHandler", DepositOverrideOperationRequestHandler);
            /**
             * Represents the base class for all replacement for GetShippingChargeClientRequestHandler.
             * @remarks All replacement for GetShippingChargeClientRequestHandler should derive from this class.
             */
            GetShippingChargeClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetShippingChargeClientRequestHandler, _super);
                function GetShippingChargeClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetShippingChargeClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetShippingChargeClientRequestHandler.prototype.supportedRequestType = function () {
                    return Cart_1.GetShippingChargeClientRequest;
                };
                return GetShippingChargeClientRequestHandler;
            }(RequestHandlers_2.ReplacementRequestHandlerBase));
            exports_37("GetShippingChargeClientRequestHandler", GetShippingChargeClientRequestHandler);
        }
    };
});
System.register("PosApi/Extend/RequestHandlers/PaymentRequestHandlers", ["PosApi/Extend/RequestHandlers/RequestHandlers", "PosApi/Consume/Payments"], function (exports_38, context_38) {
    "use strict";
    var RequestHandlers_3, Payments_1, Payments_2, GetGiftCardByIdServiceRequestHandler, GetPaymentCardTypeByBinRangeClientRequestHandler;
    var __moduleName = context_38 && context_38.id;
    return {
        setters: [
            function (RequestHandlers_3_1) {
                RequestHandlers_3 = RequestHandlers_3_1;
            },
            function (Payments_1_1) {
                Payments_1 = Payments_1_1;
                Payments_2 = Payments_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all replacement GetGiftCardByIdServiceRequestHandler.
             * @remarks All replacement GetGiftCardByIdServiceRequestHandler should derive from this class.
             */
            GetGiftCardByIdServiceRequestHandler = /** @class */ (function (_super) {
                __extends(GetGiftCardByIdServiceRequestHandler, _super);
                function GetGiftCardByIdServiceRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetGiftCardByIdServiceResponse>} The supported abstract or concrete operation request type.
                 */
                GetGiftCardByIdServiceRequestHandler.prototype.supportedRequestType = function () {
                    return Payments_1.GetGiftCardByIdServiceRequest;
                };
                return GetGiftCardByIdServiceRequestHandler;
            }(RequestHandlers_3.ReplacementRequestHandlerBase));
            exports_38("GetGiftCardByIdServiceRequestHandler", GetGiftCardByIdServiceRequestHandler);
            /**
             * Represents the base class for all replacement GetPaymentCardTypeByBinRangeClientRequestHandler.
             * @remarks All replacement GetPaymentCardTypeByBinRangeClientRequestHandler should derive from this class.
             */
            GetPaymentCardTypeByBinRangeClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetPaymentCardTypeByBinRangeClientRequestHandler, _super);
                function GetPaymentCardTypeByBinRangeClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetPaymentCardTypeByBinRangeClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetPaymentCardTypeByBinRangeClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments_2.GetPaymentCardTypeByBinRangeClientRequest;
                };
                return GetPaymentCardTypeByBinRangeClientRequestHandler;
            }(RequestHandlers_3.ReplacementRequestHandlerBase));
            exports_38("GetPaymentCardTypeByBinRangeClientRequestHandler", GetPaymentCardTypeByBinRangeClientRequestHandler);
        }
    };
});
System.register("PosApi/Extend/RequestHandlers/PeripheralsRequestHandlers", ["PosApi/Extend/RequestHandlers/RequestHandlers", "PosApi/Consume/Peripherals"], function (exports_39, context_39) {
    "use strict";
    var RequestHandlers_4, Peripherals_1, CardPaymentAuthorizeCardTokenPeripheralRequestHandler, CardPaymentAuthorizePaymentRequestHandler, CardPaymentCapturePaymentRequestHandler, CardPaymentExecuteTaskRequestHandler, CardPaymentRefundPaymentRequestHandler, CardPaymentVoidPaymentRequestHandler, CardPaymentBeginTransactionRequestHandler, CardPaymentEndTransactionRequestHandler, CardPaymentEnquireGiftCardBalancePeripheralRequestHandler, PaymentTerminalActivateGiftCardPeripheralRequestHandler, PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler, PaymentTerminalAuthorizePaymentActivityRequestHandler, PaymentTerminalAuthorizePaymentRequestHandler, PaymentTerminalCapturePaymentRequestHandler, PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler, PaymentTerminalExecuteTaskRequestHandler, PaymentTerminalFetchTokenPeripheralRequestHandler, PaymentTerminalGetTransactionReferenceIdRequestHandler, PaymentTerminalGetTransactionByTransactionReferenceRequestHandler, PaymentTerminalRefundPaymentActivityRequestHandler, PaymentTerminalRefundPaymentRequestHandler, PaymentTerminalUpdateLinesRequestHandler, PaymentTerminalVoidPaymentRequestHandler, PaymentTerminalBeginTransactionRequestHandler, PaymentTerminalCancelOperationRequestHandler, PaymentTerminalEndTransactionRequestHandler, CashDrawerOpenRequestHandler;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [
            function (RequestHandlers_4_1) {
                RequestHandlers_4 = RequestHandlers_4_1;
            },
            function (Peripherals_1_1) {
                Peripherals_1 = Peripherals_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all replacement CardPaymentAuthorizeCardTokenPeripheralRequestHandler.
             * @remarks All replacement CardPaymentAuthorizeCardTokenPeripheralRequestHandler should derive from this class.
             */
            CardPaymentAuthorizeCardTokenPeripheralRequestHandler = /** @class */ (function (_super) {
                __extends(CardPaymentAuthorizeCardTokenPeripheralRequestHandler, _super);
                function CardPaymentAuthorizeCardTokenPeripheralRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CardPaymentAuthorizeCardTokenPeripheralResponse>} The supported abstract or concrete operation request type.
                 */
                CardPaymentAuthorizeCardTokenPeripheralRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.CardPaymentAuthorizeCardTokenPeripheralRequest;
                };
                return CardPaymentAuthorizeCardTokenPeripheralRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("CardPaymentAuthorizeCardTokenPeripheralRequestHandler", CardPaymentAuthorizeCardTokenPeripheralRequestHandler);
            /**
             * Represents the base class for all replacement CardPaymentAuthorizePaymentRequestHandler.
             * @remarks All replacement CardPaymentAuthorizePaymentRequestHandler should derive from this class.
             */
            CardPaymentAuthorizePaymentRequestHandler = /** @class */ (function (_super) {
                __extends(CardPaymentAuthorizePaymentRequestHandler, _super);
                function CardPaymentAuthorizePaymentRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CardPaymentAuthorizePaymentResponse>} The supported abstract or concrete operation request type.
                 */
                CardPaymentAuthorizePaymentRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.CardPaymentAuthorizePaymentRequest;
                };
                return CardPaymentAuthorizePaymentRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("CardPaymentAuthorizePaymentRequestHandler", CardPaymentAuthorizePaymentRequestHandler);
            /**
             * Represents the base class for all replacement CardPaymentCapturePaymentRequestHandler.
             * @remarks All replacement CardPaymentCapturePaymentRequestHandler should derive from this class.
             */
            CardPaymentCapturePaymentRequestHandler = /** @class */ (function (_super) {
                __extends(CardPaymentCapturePaymentRequestHandler, _super);
                function CardPaymentCapturePaymentRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CardPaymentCapturePaymentResponse>} The supported abstract or concrete operation request type.
                 */
                CardPaymentCapturePaymentRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.CardPaymentCapturePaymentRequest;
                };
                return CardPaymentCapturePaymentRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("CardPaymentCapturePaymentRequestHandler", CardPaymentCapturePaymentRequestHandler);
            /**
             * Represents the base class for all replacement CardPaymentExecuteTaskRequestHandler.
             * @remarks All replacement CardPaymentExecuteTaskRequestHandler should derive from this class.
             */
            CardPaymentExecuteTaskRequestHandler = /** @class */ (function (_super) {
                __extends(CardPaymentExecuteTaskRequestHandler, _super);
                function CardPaymentExecuteTaskRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CardPaymentExecuteTaskResponse>} The supported abstract or concrete operation request type.
                 */
                CardPaymentExecuteTaskRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.CardPaymentExecuteTaskRequest;
                };
                return CardPaymentExecuteTaskRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("CardPaymentExecuteTaskRequestHandler", CardPaymentExecuteTaskRequestHandler);
            /**
             * Represents the base class for all replacement CardPaymentRefundPaymentRequestHandler.
             * @remarks All replacement CardPaymentRefundPaymentRequestHandler should derive from this class.
             */
            CardPaymentRefundPaymentRequestHandler = /** @class */ (function (_super) {
                __extends(CardPaymentRefundPaymentRequestHandler, _super);
                function CardPaymentRefundPaymentRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CardPaymentRefundPaymentResponse>} The supported abstract or concrete operation request type.
                 */
                CardPaymentRefundPaymentRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.CardPaymentRefundPaymentRequest;
                };
                return CardPaymentRefundPaymentRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("CardPaymentRefundPaymentRequestHandler", CardPaymentRefundPaymentRequestHandler);
            /**
             * Represents the base class for all replacement CardPaymentVoidPaymentRequestHandler.
             * @remarks All replacement CardPaymentVoidPaymentRequestHandler should derive from this class.
             */
            CardPaymentVoidPaymentRequestHandler = /** @class */ (function (_super) {
                __extends(CardPaymentVoidPaymentRequestHandler, _super);
                function CardPaymentVoidPaymentRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CardPaymentVoidPaymentResponse>} The supported abstract or concrete operation request type.
                 */
                CardPaymentVoidPaymentRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.CardPaymentVoidPaymentRequest;
                };
                return CardPaymentVoidPaymentRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("CardPaymentVoidPaymentRequestHandler", CardPaymentVoidPaymentRequestHandler);
            /**
             * Represents the base class for all replacement CardPaymentBeginTransactionRequestHandler.
             * @remarks All replacement CardPaymentBeginTransactionRequestHandler should derive from this class.
             */
            CardPaymentBeginTransactionRequestHandler = /** @class */ (function (_super) {
                __extends(CardPaymentBeginTransactionRequestHandler, _super);
                function CardPaymentBeginTransactionRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CardPaymentBeginTransactionResponse>} The supported abstract or concrete operation request type.
                 */
                CardPaymentBeginTransactionRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.CardPaymentBeginTransactionRequest;
                };
                return CardPaymentBeginTransactionRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("CardPaymentBeginTransactionRequestHandler", CardPaymentBeginTransactionRequestHandler);
            /**
             * Represents the base class for all replacement CardPaymentEndTransactionRequestHandler.
             * @remarks All replacement CardPaymentEndTransactionRequestHandler should derive from this class.
             */
            CardPaymentEndTransactionRequestHandler = /** @class */ (function (_super) {
                __extends(CardPaymentEndTransactionRequestHandler, _super);
                function CardPaymentEndTransactionRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CardPaymentEndTransactionResponse>} The supported abstract or concrete operation request type.
                 */
                CardPaymentEndTransactionRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.CardPaymentEndTransactionRequest;
                };
                return CardPaymentEndTransactionRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("CardPaymentEndTransactionRequestHandler", CardPaymentEndTransactionRequestHandler);
            /**
             * Represents the base class for all replacement CardPaymentEnquireGiftCardBalancePeripheralRequestHandler.
             * @remarks All replacement CardPaymentEnquireGiftCardBalancePeripheralRequestHandler should derive from this class.
             */
            CardPaymentEnquireGiftCardBalancePeripheralRequestHandler = /** @class */ (function (_super) {
                __extends(CardPaymentEnquireGiftCardBalancePeripheralRequestHandler, _super);
                function CardPaymentEnquireGiftCardBalancePeripheralRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CardPaymentEnquireGiftCardBalancePeripheralResponse>} The supported abstract or concrete operation request type.
                 */
                CardPaymentEnquireGiftCardBalancePeripheralRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.CardPaymentEnquireGiftCardBalancePeripheralRequest;
                };
                return CardPaymentEnquireGiftCardBalancePeripheralRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("CardPaymentEnquireGiftCardBalancePeripheralRequestHandler", CardPaymentEnquireGiftCardBalancePeripheralRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalActivateGiftCardPeripheralRequestHandler.
             * @remarks All replacement PaymentTerminalActivateGiftCardPeripheralRequestHandler should derive from this class.
             */
            PaymentTerminalActivateGiftCardPeripheralRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalActivateGiftCardPeripheralRequestHandler, _super);
                function PaymentTerminalActivateGiftCardPeripheralRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalActivateGiftCardPeripheralResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalActivateGiftCardPeripheralRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalActivateGiftCardPeripheralRequest;
                };
                return PaymentTerminalActivateGiftCardPeripheralRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalActivateGiftCardPeripheralRequestHandler", PaymentTerminalActivateGiftCardPeripheralRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler.
             * @remarks All replacement PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler should derive from this class.
             */
            PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler, _super);
                function PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalAddBalanceToGiftCardPeripheralResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalAddBalanceToGiftCardPeripheralRequest;
                };
                return PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler", PaymentTerminalAddBalanceToGiftCardPeripheralRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalAuthorizePaymentActivityRequestHandler.
             * @remarks All replacement PaymentTerminalAuthorizePaymentActivityRequestHandler should derive from this class.
             */
            PaymentTerminalAuthorizePaymentActivityRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalAuthorizePaymentActivityRequestHandler, _super);
                function PaymentTerminalAuthorizePaymentActivityRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalAuthorizePaymentActivityResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalAuthorizePaymentActivityRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalAuthorizePaymentActivityRequest;
                };
                return PaymentTerminalAuthorizePaymentActivityRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalAuthorizePaymentActivityRequestHandler", PaymentTerminalAuthorizePaymentActivityRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalAuthorizePaymentRequestHandler.
             * @remarks All replacement PaymentTerminalAuthorizePaymentRequestHandler should derive from this class.
             */
            PaymentTerminalAuthorizePaymentRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalAuthorizePaymentRequestHandler, _super);
                function PaymentTerminalAuthorizePaymentRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalAuthorizePaymentResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalAuthorizePaymentRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalAuthorizePaymentRequest;
                };
                return PaymentTerminalAuthorizePaymentRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalAuthorizePaymentRequestHandler", PaymentTerminalAuthorizePaymentRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalCapturePaymentRequestHandler.
             * @remarks All replacement PaymentTerminalCapturePaymentRequestHandler should derive from this class.
             */
            PaymentTerminalCapturePaymentRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalCapturePaymentRequestHandler, _super);
                function PaymentTerminalCapturePaymentRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalCapturePaymentResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalCapturePaymentRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalCapturePaymentRequest;
                };
                return PaymentTerminalCapturePaymentRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalCapturePaymentRequestHandler", PaymentTerminalCapturePaymentRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler.
             * @remarks All replacement PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler should derive from this class.
             */
            PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler, _super);
                function PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalEnquireGiftCardBalancePeripheralResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalEnquireGiftCardBalancePeripheralRequest;
                };
                return PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler", PaymentTerminalEnquireGiftCardBalancePeripheralRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalExecuteTaskRequestHandler.
             * @remarks All replacement PaymentTerminalExecuteTaskRequestHandler should derive from this class.
             */
            PaymentTerminalExecuteTaskRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalExecuteTaskRequestHandler, _super);
                function PaymentTerminalExecuteTaskRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalExecuteTaskResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalExecuteTaskRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalExecuteTaskRequest;
                };
                return PaymentTerminalExecuteTaskRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalExecuteTaskRequestHandler", PaymentTerminalExecuteTaskRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalFetchTokenPeripheralRequestHandler.
             * @remarks All replacement PaymentTerminalFetchTokenPeripheralRequestHandler should derive from this class.
             */
            PaymentTerminalFetchTokenPeripheralRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalFetchTokenPeripheralRequestHandler, _super);
                function PaymentTerminalFetchTokenPeripheralRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalFetchTokenPeripheralResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalFetchTokenPeripheralRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalFetchTokenPeripheralRequest;
                };
                return PaymentTerminalFetchTokenPeripheralRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalFetchTokenPeripheralRequestHandler", PaymentTerminalFetchTokenPeripheralRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalGetTransactionReferenceIdRequestHandler.
             * @remarks All replacement PaymentTerminalGetTransactionReferenceIdRequestHandler should derive from this class.
             */
            PaymentTerminalGetTransactionReferenceIdRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalGetTransactionReferenceIdRequestHandler, _super);
                function PaymentTerminalGetTransactionReferenceIdRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalGetTransactionReferenceIdResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalGetTransactionReferenceIdRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalGetTransactionReferenceIdRequest;
                };
                return PaymentTerminalGetTransactionReferenceIdRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalGetTransactionReferenceIdRequestHandler", PaymentTerminalGetTransactionReferenceIdRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalGetTransactionByTransactionReferenceRequestHandler.
             * @remarks All replacement PaymentTerminalGetTransactionByTransactionReferenceRequestHandler should derive from this class.
             */
            PaymentTerminalGetTransactionByTransactionReferenceRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalGetTransactionByTransactionReferenceRequestHandler, _super);
                function PaymentTerminalGetTransactionByTransactionReferenceRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalGetTransactionByTransactionReferenceResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalGetTransactionByTransactionReferenceRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalGetTransactionByTransactionReferenceRequest;
                };
                return PaymentTerminalGetTransactionByTransactionReferenceRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalGetTransactionByTransactionReferenceRequestHandler", PaymentTerminalGetTransactionByTransactionReferenceRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalRefundPaymentActivityRequestHandler.
             * @remarks All replacement PaymentTerminalRefundPaymentActivityRequestHandler should derive from this class.
             */
            PaymentTerminalRefundPaymentActivityRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalRefundPaymentActivityRequestHandler, _super);
                function PaymentTerminalRefundPaymentActivityRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalRefundPaymentActivityResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalRefundPaymentActivityRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalRefundPaymentActivityRequest;
                };
                return PaymentTerminalRefundPaymentActivityRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalRefundPaymentActivityRequestHandler", PaymentTerminalRefundPaymentActivityRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalRefundPaymentRequestHandler.
             * @remarks All replacement PaymentTerminalRefundPaymentRequestHandler should derive from this class.
             */
            PaymentTerminalRefundPaymentRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalRefundPaymentRequestHandler, _super);
                function PaymentTerminalRefundPaymentRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalRefundPaymentResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalRefundPaymentRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalRefundPaymentRequest;
                };
                return PaymentTerminalRefundPaymentRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalRefundPaymentRequestHandler", PaymentTerminalRefundPaymentRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalUpdateLinesRequestHandler.
             * @remarks All replacement PaymentTerminalUpdateLinesRequestHandler should derive from this class.
             */
            PaymentTerminalUpdateLinesRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalUpdateLinesRequestHandler, _super);
                function PaymentTerminalUpdateLinesRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalUpdateLinesResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalUpdateLinesRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalUpdateLinesRequest;
                };
                return PaymentTerminalUpdateLinesRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalUpdateLinesRequestHandler", PaymentTerminalUpdateLinesRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalVoidPaymentRequestHandler.
             * @remarks All replacement PaymentTerminalVoidPaymentRequestHandler should derive from this class.
             */
            PaymentTerminalVoidPaymentRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalVoidPaymentRequestHandler, _super);
                function PaymentTerminalVoidPaymentRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalVoidPaymentResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalVoidPaymentRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalVoidPaymentRequest;
                };
                return PaymentTerminalVoidPaymentRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalVoidPaymentRequestHandler", PaymentTerminalVoidPaymentRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalBeginTransactionRequestHandler.
             * @remarks All replacement PaymentTerminalBeginTransactionRequestHandler should derive from this class.
             */
            PaymentTerminalBeginTransactionRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalBeginTransactionRequestHandler, _super);
                function PaymentTerminalBeginTransactionRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalBeginTransactionResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalBeginTransactionRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalBeginTransactionRequest;
                };
                return PaymentTerminalBeginTransactionRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalBeginTransactionRequestHandler", PaymentTerminalBeginTransactionRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalCancelOperationRequestHandler.
             * @remarks All replacement PaymentTerminalCancelOperationRequestHandler should derive from this class.
             */
            PaymentTerminalCancelOperationRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalCancelOperationRequestHandler, _super);
                function PaymentTerminalCancelOperationRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalCancelOperationResponse>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalCancelOperationRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalCancelOperationRequest;
                };
                return PaymentTerminalCancelOperationRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalCancelOperationRequestHandler", PaymentTerminalCancelOperationRequestHandler);
            /**
             * Represents the base class for all replacement PaymentTerminalEndRequestHandler.
             * @remarks All replacement PaymentTerminalEndRequestHandler should derive from this class.
             */
            PaymentTerminalEndTransactionRequestHandler = /** @class */ (function (_super) {
                __extends(PaymentTerminalEndTransactionRequestHandler, _super);
                function PaymentTerminalEndTransactionRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PaymentTerminalEndTransactionRequestHandler>} The supported abstract or concrete operation request type.
                 */
                PaymentTerminalEndTransactionRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.PaymentTerminalEndTransactionRequest;
                };
                return PaymentTerminalEndTransactionRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("PaymentTerminalEndTransactionRequestHandler", PaymentTerminalEndTransactionRequestHandler);
            /**
             * Represents the base class for all replacement CashDrawerOpenRequestHandler.
             * @remarks All replacement CashDrawerOpenRequestHandler should derive from this class.
             */
            CashDrawerOpenRequestHandler = /** @class */ (function (_super) {
                __extends(CashDrawerOpenRequestHandler, _super);
                function CashDrawerOpenRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<OpenCashDrawerOperationResponse>} The supported abstract or concrete operation request type.
                 */
                CashDrawerOpenRequestHandler.prototype.supportedRequestType = function () {
                    return Peripherals_1.CashDrawerOpenRequest;
                };
                return CashDrawerOpenRequestHandler;
            }(RequestHandlers_4.ReplacementRequestHandlerBase));
            exports_39("CashDrawerOpenRequestHandler", CashDrawerOpenRequestHandler);
        }
    };
});
System.register("PosApi/Extend/RequestHandlers/ProductsRequestHandlers", ["PosApi/Extend/RequestHandlers/RequestHandlers", "PosApi/Consume/Products"], function (exports_40, context_40) {
    "use strict";
    var RequestHandlers_5, Products_1, GetSerialNumberClientRequestHandler, GetRefinerValuesByTextServiceRequestHandler;
    var __moduleName = context_40 && context_40.id;
    return {
        setters: [
            function (RequestHandlers_5_1) {
                RequestHandlers_5 = RequestHandlers_5_1;
            },
            function (Products_1_1) {
                Products_1 = Products_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all replacement GetSerialNumberClientRequestHandler.
             * @remarks All replacement GetSerialNumberClientRequestHandler should derive from this class.
             */
            GetSerialNumberClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetSerialNumberClientRequestHandler, _super);
                function GetSerialNumberClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetSerialNumberClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetSerialNumberClientRequestHandler.prototype.supportedRequestType = function () {
                    return Products_1.GetSerialNumberClientRequest;
                };
                return GetSerialNumberClientRequestHandler;
            }(RequestHandlers_5.ReplacementRequestHandlerBase));
            exports_40("GetSerialNumberClientRequestHandler", GetSerialNumberClientRequestHandler);
            /**
             * Represents the base class for all replacement for GetRefinerValuesByTextServiceRequestHandler.
             * @remarks All replacement for GetRefinerValuesByTextServiceRequestHandler should derive from this class.
             */
            GetRefinerValuesByTextServiceRequestHandler = /** @class */ (function (_super) {
                __extends(GetRefinerValuesByTextServiceRequestHandler, _super);
                function GetRefinerValuesByTextServiceRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetRefinerValuesByTextServiceResponse>} The supported abstract or concrete operation request type.
                 */
                GetRefinerValuesByTextServiceRequestHandler.prototype.supportedRequestType = function () {
                    return Products_1.GetRefinerValuesByTextServiceRequest;
                };
                return GetRefinerValuesByTextServiceRequestHandler;
            }(RequestHandlers_5.ReplacementRequestHandlerBase));
            exports_40("GetRefinerValuesByTextServiceRequestHandler", GetRefinerValuesByTextServiceRequestHandler);
        }
    };
});
System.register("PosApi/Extend/RequestHandlers/SalesOrdersRequestHandlers", ["PosApi/Extend/RequestHandlers/RequestHandlers", "PosApi/Consume/SalesOrders"], function (exports_41, context_41) {
    "use strict";
    var RequestHandlers_6, SalesOrders_1, GetGiftReceiptsClientRequestHandler, SelectCustomerOrderTypeClientRequestHandler, GetCancellationChargeClientRequestHandler;
    var __moduleName = context_41 && context_41.id;
    return {
        setters: [
            function (RequestHandlers_6_1) {
                RequestHandlers_6 = RequestHandlers_6_1;
            },
            function (SalesOrders_1_1) {
                SalesOrders_1 = SalesOrders_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all replacement GetGiftReceiptsClientRequestHandler.
             * @remarks All replacement GetGiftReceiptsClientRequestHandler should derive from this class.
             */
            GetGiftReceiptsClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetGiftReceiptsClientRequestHandler, _super);
                function GetGiftReceiptsClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetGiftReceiptsClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetGiftReceiptsClientRequestHandler.prototype.supportedRequestType = function () {
                    return SalesOrders_1.GetGiftReceiptsClientRequest;
                };
                return GetGiftReceiptsClientRequestHandler;
            }(RequestHandlers_6.ReplacementRequestHandlerBase));
            exports_41("GetGiftReceiptsClientRequestHandler", GetGiftReceiptsClientRequestHandler);
            /**
             * Represents the base class for all replacement for SelectCustomerOrderTypeClientRequestHandler.
             * @remarks All replacement for SelectCustomerOrderTypeClientRequestHandler should derive from this class.
             */
            SelectCustomerOrderTypeClientRequestHandler = /** @class */ (function (_super) {
                __extends(SelectCustomerOrderTypeClientRequestHandler, _super);
                function SelectCustomerOrderTypeClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<SelectCustomerOrderTypeClientResponse>} The supported abstract or concrete operation request type.
                 */
                SelectCustomerOrderTypeClientRequestHandler.prototype.supportedRequestType = function () {
                    return SalesOrders_1.SelectCustomerOrderTypeClientRequest;
                };
                return SelectCustomerOrderTypeClientRequestHandler;
            }(RequestHandlers_6.ReplacementRequestHandlerBase));
            exports_41("SelectCustomerOrderTypeClientRequestHandler", SelectCustomerOrderTypeClientRequestHandler);
            /**
             * Represents the base class for all replacement for GetCancellationChargeClientRequestHandler.
             * @remarks All replacement for GetCancellationChargeClientRequestHandler should derive from this class.
             */
            GetCancellationChargeClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetCancellationChargeClientRequestHandler, _super);
                function GetCancellationChargeClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetCancellationChargeClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetCancellationChargeClientRequestHandler.prototype.supportedRequestType = function () {
                    return SalesOrders_1.GetCancellationChargeClientRequest;
                };
                return GetCancellationChargeClientRequestHandler;
            }(RequestHandlers_6.ReplacementRequestHandlerBase));
            exports_41("GetCancellationChargeClientRequestHandler", GetCancellationChargeClientRequestHandler);
        }
    };
});
System.register("PosApi/Extend/RequestHandlers/ScanResultsRequestHandlers", ["PosApi/Extend/RequestHandlers/RequestHandlers", "PosApi/Consume/ScanResults"], function (exports_42, context_42) {
    "use strict";
    var RequestHandlers_7, ScanResults_1, GetScanResultClientRequestHandler;
    var __moduleName = context_42 && context_42.id;
    return {
        setters: [
            function (RequestHandlers_7_1) {
                RequestHandlers_7 = RequestHandlers_7_1;
            },
            function (ScanResults_1_1) {
                ScanResults_1 = ScanResults_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all replacement GetScanResultClientRequestHandler.
             * @remarks All replacement GetScanResultClientRequestHandler should derive from this class.
             */
            GetScanResultClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetScanResultClientRequestHandler, _super);
                function GetScanResultClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetScanResultClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetScanResultClientRequestHandler.prototype.supportedRequestType = function () {
                    return ScanResults_1.GetScanResultClientRequest;
                };
                return GetScanResultClientRequestHandler;
            }(RequestHandlers_7.ReplacementRequestHandlerBase));
            exports_42("GetScanResultClientRequestHandler", GetScanResultClientRequestHandler);
        }
    };
});
System.register("PosApi/Extend/RequestHandlers/StoreFulfillmentRequestHandlers", ["PosApi/Extend/RequestHandlers/RequestHandlers", "PosApi/Consume/SalesOrders"], function (exports_43, context_43) {
    "use strict";
    var RequestHandlers_8, SalesOrders_2, PrintPackingSlipClientRequestHandler;
    var __moduleName = context_43 && context_43.id;
    return {
        setters: [
            function (RequestHandlers_8_1) {
                RequestHandlers_8 = RequestHandlers_8_1;
            },
            function (SalesOrders_2_1) {
                SalesOrders_2 = SalesOrders_2_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all replacement PrintPackingSlipClientRequestHandler.
             * @remarks All replacement PrintPackingSlipClientRequestHandler should derive from this class.
             */
            PrintPackingSlipClientRequestHandler = /** @class */ (function (_super) {
                __extends(PrintPackingSlipClientRequestHandler, _super);
                function PrintPackingSlipClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<PrintPackingSlipClientResponse>} The supported abstract or concrete operation request type.
                 */
                PrintPackingSlipClientRequestHandler.prototype.supportedRequestType = function () {
                    return SalesOrders_2.PrintPackingSlipClientRequest;
                };
                return PrintPackingSlipClientRequestHandler;
            }(RequestHandlers_8.ReplacementRequestHandlerBase));
            exports_43("PrintPackingSlipClientRequestHandler", PrintPackingSlipClientRequestHandler);
        }
    };
});
System.register("PosApi/Extend/RequestHandlers/StoreOperationsRequestHandlers", ["PosApi/Extend/RequestHandlers/RequestHandlers", "PosApi/Consume/StoreOperations"], function (exports_44, context_44) {
    "use strict";
    var RequestHandlers_9, StoreOperations_1, CreateTenderRemovalTransactionClientRequestHandler, CreateFloatEntryTransactionClientRequestHandler, CreateStartingAmountTransactionClientRequestHandler, GetReportParametersClientRequestHandler, GetStartingAmountClientRequestHandler, LoyaltyCardPointsBalanceOperationRequestHandler, SelectZipCodeInfoClientRequestHandler, GetPickingAndReceivingOrdersClientRequestHandler;
    var __moduleName = context_44 && context_44.id;
    return {
        setters: [
            function (RequestHandlers_9_1) {
                RequestHandlers_9 = RequestHandlers_9_1;
            },
            function (StoreOperations_1_1) {
                StoreOperations_1 = StoreOperations_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all replacement CreateTenderRemovalTransactionClientRequestHandler.
             * @remarks All replacement CreateTenderRemovalTransactionClientRequestHandler should derive from this class.
             */
            CreateTenderRemovalTransactionClientRequestHandler = /** @class */ (function (_super) {
                __extends(CreateTenderRemovalTransactionClientRequestHandler, _super);
                function CreateTenderRemovalTransactionClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CreateTenderRemovalTransactionClientResponse>} The supported abstract or concrete operation request type.
                 */
                CreateTenderRemovalTransactionClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_1.CreateTenderRemovalTransactionClientRequest;
                };
                return CreateTenderRemovalTransactionClientRequestHandler;
            }(RequestHandlers_9.ReplacementRequestHandlerBase));
            exports_44("CreateTenderRemovalTransactionClientRequestHandler", CreateTenderRemovalTransactionClientRequestHandler);
            /**
             * Represents the base class for all replacement CreateFloatEntryTransactionClientRequestHandler.
             * @remarks All replacement CreateFloatEntryTransactionClientRequestHandler should derive from this class.
             */
            CreateFloatEntryTransactionClientRequestHandler = /** @class */ (function (_super) {
                __extends(CreateFloatEntryTransactionClientRequestHandler, _super);
                function CreateFloatEntryTransactionClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CreateTenderRemovalTransactionClientResponse>} The supported abstract or concrete operation request type.
                 */
                CreateFloatEntryTransactionClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_1.CreateFloatEntryTransactionClientRequest;
                };
                return CreateFloatEntryTransactionClientRequestHandler;
            }(RequestHandlers_9.ReplacementRequestHandlerBase));
            exports_44("CreateFloatEntryTransactionClientRequestHandler", CreateFloatEntryTransactionClientRequestHandler);
            /**
             * Represents the base class for all replacement CreateStartingAmountTransactionClientRequestHandler.
             * @remarks All replacement CreateStartingAmountTransactionClientRequestHandler should derive from this class.
             */
            CreateStartingAmountTransactionClientRequestHandler = /** @class */ (function (_super) {
                __extends(CreateStartingAmountTransactionClientRequestHandler, _super);
                function CreateStartingAmountTransactionClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CreateStartingAmountTransactionClientResponse>} The supported abstract or concrete operation request type.
                 */
                CreateStartingAmountTransactionClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_1.CreateStartingAmountTransactionClientRequest;
                };
                return CreateStartingAmountTransactionClientRequestHandler;
            }(RequestHandlers_9.ReplacementRequestHandlerBase));
            exports_44("CreateStartingAmountTransactionClientRequestHandler", CreateStartingAmountTransactionClientRequestHandler);
            /**
             * Represents the base class for all replacement GetReportParametersClientRequestHandler.
             * @remarks All replacement GetReportParametersClientRequestHandler should derive from this class.
             */
            GetReportParametersClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetReportParametersClientRequestHandler, _super);
                function GetReportParametersClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetReportParametersClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetReportParametersClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_1.GetReportParametersClientRequest;
                };
                return GetReportParametersClientRequestHandler;
            }(RequestHandlers_9.ReplacementRequestHandlerBase));
            exports_44("GetReportParametersClientRequestHandler", GetReportParametersClientRequestHandler);
            /**
             * Represents the base class for all replacement GetStartingAmountClientRequestHandler.
             * @remarks All replacement GetStartingAmountClientRequestHandler should derive from this class.
             */
            GetStartingAmountClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetStartingAmountClientRequestHandler, _super);
                function GetStartingAmountClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetStartingAmountClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetStartingAmountClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_1.GetStartingAmountClientRequest;
                };
                return GetStartingAmountClientRequestHandler;
            }(RequestHandlers_9.ReplacementRequestHandlerBase));
            exports_44("GetStartingAmountClientRequestHandler", GetStartingAmountClientRequestHandler);
            /**
             * Represents the base class for all replacement LoyaltyCardPointsBalanceOperationRequestHandler.
             * @remarks All replacement LoyaltyCardPointsBalanceOperationRequestHandler should derive from this class.
             */
            LoyaltyCardPointsBalanceOperationRequestHandler = /** @class */ (function (_super) {
                __extends(LoyaltyCardPointsBalanceOperationRequestHandler, _super);
                function LoyaltyCardPointsBalanceOperationRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<LoyaltyCardPointsBalanceOperationResponse>} The supported abstract or concrete operation request type.
                 */
                LoyaltyCardPointsBalanceOperationRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_1.LoyaltyCardPointsBalanceOperationRequest;
                };
                return LoyaltyCardPointsBalanceOperationRequestHandler;
            }(RequestHandlers_9.ReplacementRequestHandlerBase));
            exports_44("LoyaltyCardPointsBalanceOperationRequestHandler", LoyaltyCardPointsBalanceOperationRequestHandler);
            /**
             * Represents the base class for all replacement SelectZipCodeInfoClientRequestHandler.
             * @remarks All replacement SelectZipCodeInfoClientRequestHandler should derive from this class.
             */
            SelectZipCodeInfoClientRequestHandler = /** @class */ (function (_super) {
                __extends(SelectZipCodeInfoClientRequestHandler, _super);
                function SelectZipCodeInfoClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<SelectZipCodeInfoClientResponse>} The supported abstract or concrete operation request type.
                 */
                SelectZipCodeInfoClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_1.SelectZipCodeInfoClientRequest;
                };
                return SelectZipCodeInfoClientRequestHandler;
            }(RequestHandlers_9.ReplacementRequestHandlerBase));
            exports_44("SelectZipCodeInfoClientRequestHandler", SelectZipCodeInfoClientRequestHandler);
            /**
             * Represents the base class for all replacement GetPickingAndReceivingOrdersClientRequestHandler.
             * @remarks All replacement GetPickingAndReceivingOrdersClientRequestHandler should derive from this class.
             */
            GetPickingAndReceivingOrdersClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetPickingAndReceivingOrdersClientRequestHandler, _super);
                function GetPickingAndReceivingOrdersClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<SelectZipCodeInfoClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetPickingAndReceivingOrdersClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_1.GetPickingAndReceivingOrdersClientRequest;
                };
                return GetPickingAndReceivingOrdersClientRequestHandler;
            }(RequestHandlers_9.ReplacementRequestHandlerBase));
            exports_44("GetPickingAndReceivingOrdersClientRequestHandler", GetPickingAndReceivingOrdersClientRequestHandler);
        }
    };
});
System.register("PosApi/Extend/RequestHandlers/TenderCountingRequestHandlers", ["PosApi/Extend/RequestHandlers/RequestHandlers", "PosApi/Consume/StoreOperations"], function (exports_45, context_45) {
    "use strict";
    var RequestHandlers_10, StoreOperations_2, StoreOperations_3, StoreOperations_4, StoreOperations_5, StoreOperations_6, CreateSafeDropTransactionClientRequestHandler, GetTenderDetailsClientRequestHandler, CreateBankDropTransactionClientRequestHandler, CreateTenderDeclarationTransactionClientRequestHandler, GetCountedTenderDetailAmountClientRequestHandler;
    var __moduleName = context_45 && context_45.id;
    return {
        setters: [
            function (RequestHandlers_10_1) {
                RequestHandlers_10 = RequestHandlers_10_1;
            },
            function (StoreOperations_2_1) {
                StoreOperations_2 = StoreOperations_2_1;
                StoreOperations_3 = StoreOperations_2_1;
                StoreOperations_4 = StoreOperations_2_1;
                StoreOperations_5 = StoreOperations_2_1;
                StoreOperations_6 = StoreOperations_2_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all replacement CreateSafeDropTransactionClientRequestHandler.
             * @remarks All replacement CreateSafeDropTransactionClientRequestHandler should derive from this class.
             */
            CreateSafeDropTransactionClientRequestHandler = /** @class */ (function (_super) {
                __extends(CreateSafeDropTransactionClientRequestHandler, _super);
                function CreateSafeDropTransactionClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CreateSafeDropTransactionClientResponse>} The supported abstract or concrete operation request type.
                 */
                CreateSafeDropTransactionClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_2.CreateSafeDropTransactionClientRequest;
                };
                return CreateSafeDropTransactionClientRequestHandler;
            }(RequestHandlers_10.ReplacementRequestHandlerBase));
            exports_45("CreateSafeDropTransactionClientRequestHandler", CreateSafeDropTransactionClientRequestHandler);
            /**
             * Represents the base class for all replacement GetTenderDetailsClientRequestHandler.
             * @remarks All replacement GetTenderDetailsClientRequestHandler should derive from this class.
             */
            GetTenderDetailsClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetTenderDetailsClientRequestHandler, _super);
                function GetTenderDetailsClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetTenderDetailsClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetTenderDetailsClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_3.GetTenderDetailsClientRequest;
                };
                return GetTenderDetailsClientRequestHandler;
            }(RequestHandlers_10.ReplacementRequestHandlerBase));
            exports_45("GetTenderDetailsClientRequestHandler", GetTenderDetailsClientRequestHandler);
            /**
             * Represents the base class for all replacement CreateBankDropTransactionClientRequestHandler.
             * @remarks All replacement CreateBankDropTransactionClientRequestHandler should derive from this class.
             */
            CreateBankDropTransactionClientRequestHandler = /** @class */ (function (_super) {
                __extends(CreateBankDropTransactionClientRequestHandler, _super);
                function CreateBankDropTransactionClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CreateBankDropTransactionClientResponse>} The supported abstract or concrete operation request type.
                 */
                CreateBankDropTransactionClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_4.CreateBankDropTransactionClientRequest;
                };
                return CreateBankDropTransactionClientRequestHandler;
            }(RequestHandlers_10.ReplacementRequestHandlerBase));
            exports_45("CreateBankDropTransactionClientRequestHandler", CreateBankDropTransactionClientRequestHandler);
            /**
             * Represents the base class for all replacement CreateTenderDeclarationTransactionClientRequestHandler.
             * @remarks All replacement CreateTenderDeclarationTransactionClientRequestHandler should derive from this class.
             */
            CreateTenderDeclarationTransactionClientRequestHandler = /** @class */ (function (_super) {
                __extends(CreateTenderDeclarationTransactionClientRequestHandler, _super);
                function CreateTenderDeclarationTransactionClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<CreateTenderDeclarationTransactionClientResponse>} The supported abstract or concrete operation request type.
                 */
                CreateTenderDeclarationTransactionClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_5.CreateTenderDeclarationTransactionClientRequest;
                };
                return CreateTenderDeclarationTransactionClientRequestHandler;
            }(RequestHandlers_10.ReplacementRequestHandlerBase));
            exports_45("CreateTenderDeclarationTransactionClientRequestHandler", CreateTenderDeclarationTransactionClientRequestHandler);
            /**
             * Represents the base class for all replacement GetCountedTenderDetailAmountClientRequestHandler.
             * @remarks All replacement GetCountedTenderDetailAmountClientRequestHandler should derive from this class.
             */
            GetCountedTenderDetailAmountClientRequestHandler = /** @class */ (function (_super) {
                __extends(GetCountedTenderDetailAmountClientRequestHandler, _super);
                function GetCountedTenderDetailAmountClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Gets the supported request type.
                 * @return {AbstractRequestType<GetCountedTenderDetailAmountClientResponse>} The supported abstract or concrete operation request type.
                 */
                GetCountedTenderDetailAmountClientRequestHandler.prototype.supportedRequestType = function () {
                    return StoreOperations_6.GetCountedTenderDetailAmountClientRequest;
                };
                return GetCountedTenderDetailAmountClientRequestHandler;
            }(RequestHandlers_10.ReplacementRequestHandlerBase));
            exports_45("GetCountedTenderDetailAmountClientRequestHandler", GetCountedTenderDetailAmountClientRequestHandler);
        }
    };
});
System.register("PosApi/Extend/Triggers/Triggers", [], function (exports_46, context_46) {
    "use strict";
    var CancelableTriggerResult, CancelableTriggerType, NonCancelableTriggerType, TriggerBase, NonCancelableTriggerBase, CancelableTriggerBase;
    var __moduleName = context_46 && context_46.id;
    return {
        setters: [],
        execute: function () {
            exports_46("CancelableTriggerResult", CancelableTriggerResult = Commerce.Triggers.CancelableTriggerResult);
            exports_46("CancelableTriggerType", CancelableTriggerType = Commerce.Triggers.CancelableTriggerType);
            exports_46("NonCancelableTriggerType", NonCancelableTriggerType = Commerce.Triggers.NonCancelableTriggerType);
            /**
             * Represents a POS Trigger.
             */
            TriggerBase = /** @class */ (function (_super) {
                __extends(TriggerBase, _super);
                function TriggerBase(context) {
                    var _this = _super.call(this) || this;
                    _this.context = context;
                    return _this;
                }
                return TriggerBase;
            }(Commerce.Triggers.Trigger));
            exports_46("TriggerBase", TriggerBase);
            /**
             * Represents a Non-cancelable POS Trigger.
             */
            NonCancelableTriggerBase = /** @class */ (function (_super) {
                __extends(NonCancelableTriggerBase, _super);
                function NonCancelableTriggerBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return NonCancelableTriggerBase;
            }(TriggerBase));
            exports_46("NonCancelableTriggerBase", NonCancelableTriggerBase);
            /**
             * Represents a Cancelable POS Trigger.
             */
            CancelableTriggerBase = /** @class */ (function (_super) {
                __extends(CancelableTriggerBase, _super);
                function CancelableTriggerBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CancelableTriggerBase;
            }(TriggerBase));
            exports_46("CancelableTriggerBase", CancelableTriggerBase);
        }
    };
});
System.register("PosApi/Extend/Triggers/ApplicationTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_47, context_47) {
    "use strict";
    var Triggers_1, ApplicationStartTrigger, ApplicationSuspendTrigger, PostConnectionStatusChangeTrigger, PreLogOnTrigger, PostLogOnTrigger, PostLogOffTrigger, PreLockTerminalTrigger, PostLockTerminalTrigger, PreUnlockTerminalTrigger, PostDeviceActivationTrigger, PreElevateUserTrigger, PreOpenUrlTrigger;
    var __moduleName = context_47 && context_47.id;
    return {
        setters: [
            function (Triggers_1_1) {
                Triggers_1 = Triggers_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all ApplicationStart triggers.
             * @remarks All ApplicationStart triggers should derive from this class.
             */
            ApplicationStartTrigger = /** @class */ (function (_super) {
                __extends(ApplicationStartTrigger, _super);
                function ApplicationStartTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ApplicationStartTrigger;
            }(Triggers_1.NonCancelableTriggerBase));
            exports_47("ApplicationStartTrigger", ApplicationStartTrigger);
            /**
             * Represents the base class for all ApplicationSuspend triggers.
             * @remarks All ApplicationSuspend triggers should derive from this class.
             */
            ApplicationSuspendTrigger = /** @class */ (function (_super) {
                __extends(ApplicationSuspendTrigger, _super);
                function ApplicationSuspendTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ApplicationSuspendTrigger;
            }(Triggers_1.NonCancelableTriggerBase));
            exports_47("ApplicationSuspendTrigger", ApplicationSuspendTrigger);
            /**
             * Represents the base class for all PostConnectionStatusChange triggers.
             * @remarks All PostConnectionStatusChange triggers should derive from this class.
             */
            PostConnectionStatusChangeTrigger = /** @class */ (function (_super) {
                __extends(PostConnectionStatusChangeTrigger, _super);
                function PostConnectionStatusChangeTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostConnectionStatusChangeTrigger;
            }(Triggers_1.NonCancelableTriggerBase));
            exports_47("PostConnectionStatusChangeTrigger", PostConnectionStatusChangeTrigger);
            /**
             * Represents the base class for all PreLogOn triggers.
             * @remarks All PreLogOn triggers should derive from this class.
             */
            PreLogOnTrigger = /** @class */ (function (_super) {
                __extends(PreLogOnTrigger, _super);
                function PreLogOnTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreLogOnTrigger;
            }(Triggers_1.CancelableTriggerBase));
            exports_47("PreLogOnTrigger", PreLogOnTrigger);
            /**
             * Represents the base class for all PostLogOn triggers.
             * @remarks All PostLogOn triggers should derive from this class.
             */
            PostLogOnTrigger = /** @class */ (function (_super) {
                __extends(PostLogOnTrigger, _super);
                function PostLogOnTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostLogOnTrigger;
            }(Triggers_1.NonCancelableTriggerBase));
            exports_47("PostLogOnTrigger", PostLogOnTrigger);
            /**
             * Represents the base class for all PostLogOff triggers.
             * @remarks All PostLogOff triggers should derive from this class.
             */
            PostLogOffTrigger = /** @class */ (function (_super) {
                __extends(PostLogOffTrigger, _super);
                function PostLogOffTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostLogOffTrigger;
            }(Triggers_1.NonCancelableTriggerBase));
            exports_47("PostLogOffTrigger", PostLogOffTrigger);
            /**
             * Represents the base class for all PreLockTerminal triggers.
             * @remarks All PreLockTerminal triggers should derive from this class.
             */
            PreLockTerminalTrigger = /** @class */ (function (_super) {
                __extends(PreLockTerminalTrigger, _super);
                function PreLockTerminalTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreLockTerminalTrigger;
            }(Triggers_1.CancelableTriggerBase));
            exports_47("PreLockTerminalTrigger", PreLockTerminalTrigger);
            /**
             * Represents the base class for all PostLockTerminal triggers.
             * @remarks All PostLockTerminal triggers should derive from this class.
             */
            PostLockTerminalTrigger = /** @class */ (function (_super) {
                __extends(PostLockTerminalTrigger, _super);
                function PostLockTerminalTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostLockTerminalTrigger;
            }(Triggers_1.NonCancelableTriggerBase));
            exports_47("PostLockTerminalTrigger", PostLockTerminalTrigger);
            /**
             * Represents the base class for all PreUnlockTerminal triggers.
             * @remarks All PreUnlockTerminal triggers should derive from this class.
             */
            PreUnlockTerminalTrigger = /** @class */ (function (_super) {
                __extends(PreUnlockTerminalTrigger, _super);
                function PreUnlockTerminalTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreUnlockTerminalTrigger;
            }(Triggers_1.CancelableTriggerBase));
            exports_47("PreUnlockTerminalTrigger", PreUnlockTerminalTrigger);
            /**
             * Represents the base class for all PostDeviceActivation triggers.
             * @remarks All PostDeviceActivation triggers should derive from this class.
             */
            PostDeviceActivationTrigger = /** @class */ (function (_super) {
                __extends(PostDeviceActivationTrigger, _super);
                function PostDeviceActivationTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostDeviceActivationTrigger;
            }(Triggers_1.NonCancelableTriggerBase));
            exports_47("PostDeviceActivationTrigger", PostDeviceActivationTrigger);
            /**
             * Represents the base class for all PreElevateUser triggers.
             * The elevate operation is done in the OperationPipeline, during the manager override.
             * The PreElevate trigger is executed after receiving the credentials and right before attempting to authenticate
             * the manager.
             * @remarks All PreElevateUser triggers should derive from this class.
             */
            PreElevateUserTrigger = /** @class */ (function (_super) {
                __extends(PreElevateUserTrigger, _super);
                function PreElevateUserTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreElevateUserTrigger;
            }(Triggers_1.CancelableTriggerBase));
            exports_47("PreElevateUserTrigger", PreElevateUserTrigger);
            /**
             * Represents the base class for all PreOpenUrl triggers.
             * @remarks All PreOpenUrl triggers should derive from this class.
             */
            PreOpenUrlTrigger = /** @class */ (function (_super) {
                __extends(PreOpenUrlTrigger, _super);
                function PreOpenUrlTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreOpenUrlTrigger;
            }(Triggers_1.CancelableTriggerBase));
            exports_47("PreOpenUrlTrigger", PreOpenUrlTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/AuditEventTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_48, context_48) {
    "use strict";
    var Triggers_2, PreRegisterAuditEventTrigger, PostRegisterAuditEventTrigger;
    var __moduleName = context_48 && context_48.id;
    return {
        setters: [
            function (Triggers_2_1) {
                Triggers_2 = Triggers_2_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PreRegisterAuditEvent triggers.
             * @remarks All PreRegisterAuditEvent triggers should derive from this class.
             */
            PreRegisterAuditEventTrigger = /** @class */ (function (_super) {
                __extends(PreRegisterAuditEventTrigger, _super);
                function PreRegisterAuditEventTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreRegisterAuditEventTrigger;
            }(Triggers_2.CancelableTriggerBase));
            exports_48("PreRegisterAuditEventTrigger", PreRegisterAuditEventTrigger);
            /**
             * Represents the base class for all PostRegisterAuditEvent triggers.
             * @remarks All PostRegisterAuditEvent triggers should derive from this class.
             */
            PostRegisterAuditEventTrigger = /** @class */ (function (_super) {
                __extends(PostRegisterAuditEventTrigger, _super);
                function PostRegisterAuditEventTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostRegisterAuditEventTrigger;
            }(Triggers_2.NonCancelableTriggerBase));
            exports_48("PostRegisterAuditEventTrigger", PostRegisterAuditEventTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/CashManagementTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_49, context_49) {
    "use strict";
    var Triggers_3, PreTenderDeclarationTrigger, PostTenderDeclarationTrigger, PreFloatEntryTrigger, PostFloatEntryTrigger;
    var __moduleName = context_49 && context_49.id;
    return {
        setters: [
            function (Triggers_3_1) {
                Triggers_3 = Triggers_3_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PreTenderDeclaration triggers.
             * @remarks All PreTenderDeclaration triggers should derive from this class.
             */
            PreTenderDeclarationTrigger = /** @class */ (function (_super) {
                __extends(PreTenderDeclarationTrigger, _super);
                function PreTenderDeclarationTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreTenderDeclarationTrigger;
            }(Triggers_3.CancelableTriggerBase));
            exports_49("PreTenderDeclarationTrigger", PreTenderDeclarationTrigger);
            /**
             * Represents the base class for all PostTenderDeclaration triggers.
             * @remarks All PostTenderDeclaration triggers should derive from this class.
             */
            PostTenderDeclarationTrigger = /** @class */ (function (_super) {
                __extends(PostTenderDeclarationTrigger, _super);
                function PostTenderDeclarationTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostTenderDeclarationTrigger;
            }(Triggers_3.NonCancelableTriggerBase));
            exports_49("PostTenderDeclarationTrigger", PostTenderDeclarationTrigger);
            /**
             * Represents the base class for all PreFloatEntry triggers.
             * @remarks All PreFloatEntry triggers should derive from this class.
             */
            PreFloatEntryTrigger = /** @class */ (function (_super) {
                __extends(PreFloatEntryTrigger, _super);
                function PreFloatEntryTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreFloatEntryTrigger;
            }(Triggers_3.CancelableTriggerBase));
            exports_49("PreFloatEntryTrigger", PreFloatEntryTrigger);
            /**
             * Represents the base class for all PostFloatEntry triggers.
             * @remarks All PostFloatEntry triggers should derive from this class.
             */
            PostFloatEntryTrigger = /** @class */ (function (_super) {
                __extends(PostFloatEntryTrigger, _super);
                function PostFloatEntryTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostFloatEntryTrigger;
            }(Triggers_3.NonCancelableTriggerBase));
            exports_49("PostFloatEntryTrigger", PostFloatEntryTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/CustomerTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_50, context_50) {
    "use strict";
    var Triggers_4, PreCustomerAddTrigger, PostCustomerAddTrigger, PreCustomerClearTrigger, PostCustomerClearTrigger, PreCustomerSetTrigger, PreCustomerSearchTrigger, PostCustomerSearchTrigger, PreGetLoyaltyCardBalanceTrigger, PreDisplayLoyaltyCardBalanceTrigger, PostGetLoyaltyCardBalanceTrigger, PreCustomerSaveTrigger, PostCustomerSaveTrigger, PostIssueLoyaltyCardTrigger, PreSaveCustomerAddressTrigger;
    var __moduleName = context_50 && context_50.id;
    return {
        setters: [
            function (Triggers_4_1) {
                Triggers_4 = Triggers_4_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PreCustomerAdd triggers.
             * @remarks All PreCustomerAdd triggers should derive from this class.
             */
            PreCustomerAddTrigger = /** @class */ (function (_super) {
                __extends(PreCustomerAddTrigger, _super);
                function PreCustomerAddTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreCustomerAddTrigger;
            }(Triggers_4.CancelableTriggerBase));
            exports_50("PreCustomerAddTrigger", PreCustomerAddTrigger);
            /**
             * Represents the base class for all PostCustomerAdd triggers.
             * @remarks All PostCustomerAdd triggers should derive from this class.
             */
            PostCustomerAddTrigger = /** @class */ (function (_super) {
                __extends(PostCustomerAddTrigger, _super);
                function PostCustomerAddTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostCustomerAddTrigger;
            }(Triggers_4.NonCancelableTriggerBase));
            exports_50("PostCustomerAddTrigger", PostCustomerAddTrigger);
            /**
             * Represents the base class for all PreCustomerClear triggers.
             * @remarks All PreCustomerClear triggers should derive from this class.
             */
            PreCustomerClearTrigger = /** @class */ (function (_super) {
                __extends(PreCustomerClearTrigger, _super);
                function PreCustomerClearTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreCustomerClearTrigger;
            }(Triggers_4.CancelableTriggerBase));
            exports_50("PreCustomerClearTrigger", PreCustomerClearTrigger);
            /**
             * Represents the base class for all PostCustomerClear triggers.
             * @remarks All PostCustomerClear triggers should derive from this class.
             */
            PostCustomerClearTrigger = /** @class */ (function (_super) {
                __extends(PostCustomerClearTrigger, _super);
                function PostCustomerClearTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostCustomerClearTrigger;
            }(Triggers_4.NonCancelableTriggerBase));
            exports_50("PostCustomerClearTrigger", PostCustomerClearTrigger);
            /**
             * Represents the base class for all PreCustomerSet triggers.
             * @remarks All PreCustomerSet triggers should derive from this class.
             */
            PreCustomerSetTrigger = /** @class */ (function (_super) {
                __extends(PreCustomerSetTrigger, _super);
                function PreCustomerSetTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreCustomerSetTrigger;
            }(Triggers_4.CancelableTriggerBase));
            exports_50("PreCustomerSetTrigger", PreCustomerSetTrigger);
            /**
             * Represents the base class for all PreCustomerSearch triggers.
             * @remarks All PreCustomerSearch triggers should derive from this class.
             */
            PreCustomerSearchTrigger = /** @class */ (function (_super) {
                __extends(PreCustomerSearchTrigger, _super);
                function PreCustomerSearchTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreCustomerSearchTrigger;
            }(Triggers_4.CancelableTriggerBase));
            exports_50("PreCustomerSearchTrigger", PreCustomerSearchTrigger);
            /**
             * Represents the base class for all PostCustomerSearch triggers.
             * @remarks All PostCustomerSearch triggers should derive from this class.
             */
            PostCustomerSearchTrigger = /** @class */ (function (_super) {
                __extends(PostCustomerSearchTrigger, _super);
                function PostCustomerSearchTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostCustomerSearchTrigger;
            }(Triggers_4.NonCancelableTriggerBase));
            exports_50("PostCustomerSearchTrigger", PostCustomerSearchTrigger);
            /**
             * Represents the base class for all PreGetLoyaltyCardBalance triggers.
             * @remarks All PreGetLoyaltyCardBalance triggers should derive from this class.
             * @remarks The PreGetLoyaltyCardBalanceTrigger is executed prior to running the get loyalty card balance operation.
             */
            PreGetLoyaltyCardBalanceTrigger = /** @class */ (function (_super) {
                __extends(PreGetLoyaltyCardBalanceTrigger, _super);
                function PreGetLoyaltyCardBalanceTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreGetLoyaltyCardBalanceTrigger;
            }(Triggers_4.CancelableTriggerBase));
            exports_50("PreGetLoyaltyCardBalanceTrigger", PreGetLoyaltyCardBalanceTrigger);
            /**
             * Represents the base class for all PreDisplayLoyaltyCardBalance triggers.
             * @remarks All PreDisplayLoyaltyCardBalance triggers should derive from this class.
             * @remarks The PreDisplayLoyaltyCardBalanceTrigger is executed prior to showing the loyalty card balance details dialog.
             */
            PreDisplayLoyaltyCardBalanceTrigger = /** @class */ (function (_super) {
                __extends(PreDisplayLoyaltyCardBalanceTrigger, _super);
                function PreDisplayLoyaltyCardBalanceTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreDisplayLoyaltyCardBalanceTrigger;
            }(Triggers_4.CancelableTriggerBase));
            exports_50("PreDisplayLoyaltyCardBalanceTrigger", PreDisplayLoyaltyCardBalanceTrigger);
            /**
             * Represents the base class for all PostGetLoyaltyCardBalance triggers.
             * @remarks All PostGetLoyaltyCardBalance triggers should derive from this class.
             * @remarks The PostGetLoyaltyCardBalanceTrigger is executed when LoyaltyRequest operation is done.
             */
            PostGetLoyaltyCardBalanceTrigger = /** @class */ (function (_super) {
                __extends(PostGetLoyaltyCardBalanceTrigger, _super);
                function PostGetLoyaltyCardBalanceTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostGetLoyaltyCardBalanceTrigger;
            }(Triggers_4.NonCancelableTriggerBase));
            exports_50("PostGetLoyaltyCardBalanceTrigger", PostGetLoyaltyCardBalanceTrigger);
            /**
             * Represents the base class for all PreCustomerSave triggers.
             * @remarks All PreCustomerSave triggers should derive from this class.
             * @remarks The PreCustomerSaveTrigger is executed prior to saving customer.
             * @remarks This includes when creating a new customer and when editing an existing one.
             */
            PreCustomerSaveTrigger = /** @class */ (function (_super) {
                __extends(PreCustomerSaveTrigger, _super);
                function PreCustomerSaveTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreCustomerSaveTrigger;
            }(Triggers_4.CancelableTriggerBase));
            exports_50("PreCustomerSaveTrigger", PreCustomerSaveTrigger);
            /**
             * Represents the base class for all PostCustomerSave triggers.
             * @remarks All PostCustomerSave triggers should derive from this class.
             * @remarks The PostCustomerSaveTrigger is executed after saving customer.
             * @remarks This includes when creating a new customer.
             */
            PostCustomerSaveTrigger = /** @class */ (function (_super) {
                __extends(PostCustomerSaveTrigger, _super);
                function PostCustomerSaveTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostCustomerSaveTrigger;
            }(Triggers_4.NonCancelableTriggerBase));
            exports_50("PostCustomerSaveTrigger", PostCustomerSaveTrigger);
            /**
             * Represents the base class for all PostIssueLoyaltyCard triggers.
             * @remarks All PostIssueLoyaltyCard triggers should derive from this class.
             * @remarks The PostIssueLoyaltyCardTrigger is executed after saving customer.
             * @remarks The PostIssueLoyaltyCardTrigger is executed when IssueLoyaltyCardServiceRequest operation is done.
             */
            PostIssueLoyaltyCardTrigger = /** @class */ (function (_super) {
                __extends(PostIssueLoyaltyCardTrigger, _super);
                function PostIssueLoyaltyCardTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostIssueLoyaltyCardTrigger;
            }(Triggers_4.NonCancelableTriggerBase));
            exports_50("PostIssueLoyaltyCardTrigger", PostIssueLoyaltyCardTrigger);
            /**
             * Represents the base class for all PreSaveCustomerAddress triggers.
             * @remarks All PreSaveCustomerAddress triggers should derive from this class.
             * @remarks The PreSaveCustomerAddress is executed before updating the customer address.
             */
            PreSaveCustomerAddressTrigger = /** @class */ (function (_super) {
                __extends(PreSaveCustomerAddressTrigger, _super);
                function PreSaveCustomerAddressTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreSaveCustomerAddressTrigger;
            }(Triggers_4.CancelableTriggerBase));
            exports_50("PreSaveCustomerAddressTrigger", PreSaveCustomerAddressTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/DiscountTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_51, context_51) {
    "use strict";
    var Triggers_5, PreAddCouponTrigger, PostAddCouponTrigger, PreLineDiscountAmountTrigger, PostLineDiscountAmountTrigger, PreLineDiscountPercentTrigger, PostLineDiscountPercentTrigger, PreTotalDiscountAmountTrigger, PostTotalDiscountAmountTrigger, PreTotalDiscountPercentTrigger, PostTotalDiscountPercentTrigger;
    var __moduleName = context_51 && context_51.id;
    return {
        setters: [
            function (Triggers_5_1) {
                Triggers_5 = Triggers_5_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PreAddCoupon triggers.
             * @remarks All PreAddCoupon triggers should derive from this class.
             */
            PreAddCouponTrigger = /** @class */ (function (_super) {
                __extends(PreAddCouponTrigger, _super);
                function PreAddCouponTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreAddCouponTrigger;
            }(Triggers_5.CancelableTriggerBase));
            exports_51("PreAddCouponTrigger", PreAddCouponTrigger);
            /**
             * Represents the base class for all PostAddCoupon triggers.
             * @remarks All PostAddCoupon triggers should derive from this class.
             */
            PostAddCouponTrigger = /** @class */ (function (_super) {
                __extends(PostAddCouponTrigger, _super);
                function PostAddCouponTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostAddCouponTrigger;
            }(Triggers_5.NonCancelableTriggerBase));
            exports_51("PostAddCouponTrigger", PostAddCouponTrigger);
            /**
             * Represents the base class for all PreLineDiscountAmount triggers.
             * @remarks All PreLineDiscountAmount triggers should derive from this class.
             */
            PreLineDiscountAmountTrigger = /** @class */ (function (_super) {
                __extends(PreLineDiscountAmountTrigger, _super);
                function PreLineDiscountAmountTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreLineDiscountAmountTrigger;
            }(Triggers_5.CancelableTriggerBase));
            exports_51("PreLineDiscountAmountTrigger", PreLineDiscountAmountTrigger);
            /**
             * Represents the base class for all PostLineDiscountAmount triggers.
             * @remarks All PostLineDiscountAmount triggers should derive from this class.
             */
            PostLineDiscountAmountTrigger = /** @class */ (function (_super) {
                __extends(PostLineDiscountAmountTrigger, _super);
                function PostLineDiscountAmountTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostLineDiscountAmountTrigger;
            }(Triggers_5.NonCancelableTriggerBase));
            exports_51("PostLineDiscountAmountTrigger", PostLineDiscountAmountTrigger);
            /**
             * Represents the base class for all PreLineDiscountPercent triggers.
             * @remarks All PreLineDiscountPercent triggers should derive from this class.
             */
            PreLineDiscountPercentTrigger = /** @class */ (function (_super) {
                __extends(PreLineDiscountPercentTrigger, _super);
                function PreLineDiscountPercentTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreLineDiscountPercentTrigger;
            }(Triggers_5.CancelableTriggerBase));
            exports_51("PreLineDiscountPercentTrigger", PreLineDiscountPercentTrigger);
            /**
             * Represents the base class for all PostLineDiscountPercent triggers.
             * @remarks All PostLineDiscountPercent triggers should derive from this class.
             */
            PostLineDiscountPercentTrigger = /** @class */ (function (_super) {
                __extends(PostLineDiscountPercentTrigger, _super);
                function PostLineDiscountPercentTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostLineDiscountPercentTrigger;
            }(Triggers_5.NonCancelableTriggerBase));
            exports_51("PostLineDiscountPercentTrigger", PostLineDiscountPercentTrigger);
            /**
             * Represents the base class for all PreTotalDiscountAmount triggers.
             * @remarks All PreTotalDiscountAmount triggers should derive from this class.
             */
            PreTotalDiscountAmountTrigger = /** @class */ (function (_super) {
                __extends(PreTotalDiscountAmountTrigger, _super);
                function PreTotalDiscountAmountTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreTotalDiscountAmountTrigger;
            }(Triggers_5.CancelableTriggerBase));
            exports_51("PreTotalDiscountAmountTrigger", PreTotalDiscountAmountTrigger);
            /**
             * Represents the base class for all PostTotalDiscountAmount triggers.
             * @remarks All PostTotalDiscountAmount triggers should derive from this class.
             */
            PostTotalDiscountAmountTrigger = /** @class */ (function (_super) {
                __extends(PostTotalDiscountAmountTrigger, _super);
                function PostTotalDiscountAmountTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostTotalDiscountAmountTrigger;
            }(Triggers_5.NonCancelableTriggerBase));
            exports_51("PostTotalDiscountAmountTrigger", PostTotalDiscountAmountTrigger);
            /**
             * Represents the base class for all PreTotalDiscountPercent triggers.
             * @remarks All PreTotalDiscountPercent triggers should derive from this class.
             */
            PreTotalDiscountPercentTrigger = /** @class */ (function (_super) {
                __extends(PreTotalDiscountPercentTrigger, _super);
                function PreTotalDiscountPercentTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreTotalDiscountPercentTrigger;
            }(Triggers_5.CancelableTriggerBase));
            exports_51("PreTotalDiscountPercentTrigger", PreTotalDiscountPercentTrigger);
            /**
             * Represents the base class for all PostTotalDiscountPercent triggers.
             * @remarks All PostTotalDiscountPercent triggers should derive from this class.
             */
            PostTotalDiscountPercentTrigger = /** @class */ (function (_super) {
                __extends(PostTotalDiscountPercentTrigger, _super);
                function PostTotalDiscountPercentTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostTotalDiscountPercentTrigger;
            }(Triggers_5.NonCancelableTriggerBase));
            exports_51("PostTotalDiscountPercentTrigger", PostTotalDiscountPercentTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/OperationTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_52, context_52) {
    "use strict";
    var Triggers_6, PreOperationTrigger, PostOperationTrigger, OperationFailureTrigger;
    var __moduleName = context_52 && context_52.id;
    return {
        setters: [
            function (Triggers_6_1) {
                Triggers_6 = Triggers_6_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PreOperation triggers.
             * @remarks All PreOperation triggers should derive from this class.
             */
            PreOperationTrigger = /** @class */ (function (_super) {
                __extends(PreOperationTrigger, _super);
                function PreOperationTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreOperationTrigger;
            }(Triggers_6.CancelableTriggerBase));
            exports_52("PreOperationTrigger", PreOperationTrigger);
            /**
             * Represents the base class for all PostOperation triggers.
             * @remarks All PostOperation triggers should derive from this class.
             */
            PostOperationTrigger = /** @class */ (function (_super) {
                __extends(PostOperationTrigger, _super);
                function PostOperationTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostOperationTrigger;
            }(Triggers_6.NonCancelableTriggerBase));
            exports_52("PostOperationTrigger", PostOperationTrigger);
            /**
             * Represents the base class for all OperationFailure triggers.
             * @remarks All OperationFailure triggers should derive from this class.
             */
            OperationFailureTrigger = /** @class */ (function (_super) {
                __extends(OperationFailureTrigger, _super);
                function OperationFailureTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return OperationFailureTrigger;
            }(Triggers_6.NonCancelableTriggerBase));
            exports_52("OperationFailureTrigger", OperationFailureTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/PaymentTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_53, context_53) {
    "use strict";
    var Triggers_7, PreAddTenderLineTrigger, PrePaymentTrigger, PostPaymentTrigger, PreVoidPaymentTrigger, PostVoidPaymentTrigger, PostGetGiftCardNumberTrigger;
    var __moduleName = context_53 && context_53.id;
    return {
        setters: [
            function (Triggers_7_1) {
                Triggers_7 = Triggers_7_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PreAddTenderLine triggers.
             * @remarks All PreAddTenderLine triggers should derive from this class.
             */
            PreAddTenderLineTrigger = /** @class */ (function (_super) {
                __extends(PreAddTenderLineTrigger, _super);
                function PreAddTenderLineTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreAddTenderLineTrigger;
            }(Triggers_7.CancelableTriggerBase));
            exports_53("PreAddTenderLineTrigger", PreAddTenderLineTrigger);
            /**
             * Represents the base class for all PrePayment triggers.
             * @remarks All PrePayment triggers should derive from this class.
             */
            PrePaymentTrigger = /** @class */ (function (_super) {
                __extends(PrePaymentTrigger, _super);
                function PrePaymentTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PrePaymentTrigger;
            }(Triggers_7.CancelableTriggerBase));
            exports_53("PrePaymentTrigger", PrePaymentTrigger);
            /**
             * Represents the base class for all PostPayment triggers.
             * @remarks All PostPayment triggers should derive from this class.
             */
            PostPaymentTrigger = /** @class */ (function (_super) {
                __extends(PostPaymentTrigger, _super);
                function PostPaymentTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostPaymentTrigger;
            }(Triggers_7.NonCancelableTriggerBase));
            exports_53("PostPaymentTrigger", PostPaymentTrigger);
            /**
             * Represents the base class for all PreVoidPayment triggers.
             * @remarks All PreVoidPayment triggers should derive from this class.
             */
            PreVoidPaymentTrigger = /** @class */ (function (_super) {
                __extends(PreVoidPaymentTrigger, _super);
                function PreVoidPaymentTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreVoidPaymentTrigger;
            }(Triggers_7.CancelableTriggerBase));
            exports_53("PreVoidPaymentTrigger", PreVoidPaymentTrigger);
            /**
             * Represents the base class for all PostVoidPayment triggers.
             * @remarks All PostVoidPayment triggers should derive from this class.
             */
            PostVoidPaymentTrigger = /** @class */ (function (_super) {
                __extends(PostVoidPaymentTrigger, _super);
                function PostVoidPaymentTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostVoidPaymentTrigger;
            }(Triggers_7.NonCancelableTriggerBase));
            exports_53("PostVoidPaymentTrigger", PostVoidPaymentTrigger);
            /**
             * Represents the base class for all PostGetGiftCardNumber triggers.
             * @remarks All PostGetGiftCardNumberTrigger triggers should derive from this class.
             */
            PostGetGiftCardNumberTrigger = /** @class */ (function (_super) {
                __extends(PostGetGiftCardNumberTrigger, _super);
                function PostGetGiftCardNumberTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostGetGiftCardNumberTrigger;
            }(Triggers_7.CancelableTriggerBase));
            exports_53("PostGetGiftCardNumberTrigger", PostGetGiftCardNumberTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/PeripheralTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_54, context_54) {
    "use strict";
    var Triggers_8, PostOpenCashDrawerTrigger;
    var __moduleName = context_54 && context_54.id;
    return {
        setters: [
            function (Triggers_8_1) {
                Triggers_8 = Triggers_8_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PostOpenCashDrawer triggers.
             * @remarks All PostOpenCashDrawer triggers should derive from this class.
             */
            PostOpenCashDrawerTrigger = /** @class */ (function (_super) {
                __extends(PostOpenCashDrawerTrigger, _super);
                function PostOpenCashDrawerTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostOpenCashDrawerTrigger;
            }(Triggers_8.NonCancelableTriggerBase));
            exports_54("PostOpenCashDrawerTrigger", PostOpenCashDrawerTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/PrintingTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_55, context_55) {
    "use strict";
    var Triggers_9, PrePrintReceiptCopyTrigger, PostReceiptPromptTrigger;
    var __moduleName = context_55 && context_55.id;
    return {
        setters: [
            function (Triggers_9_1) {
                Triggers_9 = Triggers_9_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PrePrintReceiptCopy triggers.
             * @remarks All PrePrintReceiptCopy triggers should derive from this class.
             */
            PrePrintReceiptCopyTrigger = /** @class */ (function (_super) {
                __extends(PrePrintReceiptCopyTrigger, _super);
                function PrePrintReceiptCopyTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PrePrintReceiptCopyTrigger;
            }(Triggers_9.CancelableTriggerBase));
            exports_55("PrePrintReceiptCopyTrigger", PrePrintReceiptCopyTrigger);
            /**
             * Represents the base class for all PostReceiptPromptTrigger triggers.
             * @remarks All PostReceiptPromptTrigger triggers should derive from this class.
             */
            PostReceiptPromptTrigger = /** @class */ (function (_super) {
                __extends(PostReceiptPromptTrigger, _super);
                function PostReceiptPromptTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostReceiptPromptTrigger;
            }(Triggers_9.NonCancelableTriggerBase));
            exports_55("PostReceiptPromptTrigger", PostReceiptPromptTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/ProductTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_56, context_56) {
    "use strict";
    var Triggers_10, PostGetSerialNumberTrigger, PreProductSaleTrigger, PostProductSaleTrigger, PreReturnProductOperationTrigger, PreReturnProductTrigger, PostReturnProductTrigger, PreSetQuantityTrigger, PostSetQuantityTrigger, PrePriceOverrideTrigger, PostPriceOverrideTrigger, PreClearQuantityTrigger, PostClearQuantityTrigger, PreVoidProductsTrigger, PostVoidProductsTrigger, PostPriceCheckTrigger;
    var __moduleName = context_56 && context_56.id;
    return {
        setters: [
            function (Triggers_10_1) {
                Triggers_10 = Triggers_10_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PostGetSerialNumber triggers.
             * @remarks All PostGetSerialNumber triggers should derive from this class.
             */
            PostGetSerialNumberTrigger = /** @class */ (function (_super) {
                __extends(PostGetSerialNumberTrigger, _super);
                function PostGetSerialNumberTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostGetSerialNumberTrigger;
            }(Triggers_10.NonCancelableTriggerBase));
            exports_56("PostGetSerialNumberTrigger", PostGetSerialNumberTrigger);
            /**
             * Represents the base class for all PreProductSale triggers.
             * @remarks All PreProductSale triggers should derive from this class.
             */
            PreProductSaleTrigger = /** @class */ (function (_super) {
                __extends(PreProductSaleTrigger, _super);
                function PreProductSaleTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreProductSaleTrigger;
            }(Triggers_10.CancelableTriggerBase));
            exports_56("PreProductSaleTrigger", PreProductSaleTrigger);
            /**
             * Represents the base class for all PostProductSale triggers.
             * @remarks All PostProductSale triggers should derive from this class.
             */
            PostProductSaleTrigger = /** @class */ (function (_super) {
                __extends(PostProductSaleTrigger, _super);
                function PostProductSaleTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostProductSaleTrigger;
            }(Triggers_10.NonCancelableTriggerBase));
            exports_56("PostProductSaleTrigger", PostProductSaleTrigger);
            /**
             * Represents the base class for all PreReturnProductOperation triggers.
             * @remarks All PreReturnProductOperation triggers should derive from this class.
             */
            PreReturnProductOperationTrigger = /** @class */ (function (_super) {
                __extends(PreReturnProductOperationTrigger, _super);
                function PreReturnProductOperationTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreReturnProductOperationTrigger;
            }(Triggers_10.CancelableTriggerBase));
            exports_56("PreReturnProductOperationTrigger", PreReturnProductOperationTrigger);
            /**
             * Represents the base class for all PreReturnProduct triggers.
             * @remarks All PreReturnProduct triggers should derive from this class.
             */
            PreReturnProductTrigger = /** @class */ (function (_super) {
                __extends(PreReturnProductTrigger, _super);
                function PreReturnProductTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreReturnProductTrigger;
            }(Triggers_10.CancelableTriggerBase));
            exports_56("PreReturnProductTrigger", PreReturnProductTrigger);
            /**
             * Represents the base class for all PostReturnProduct triggers.
             * @remarks All PostReturnProduct triggers should derive from this class.
             */
            PostReturnProductTrigger = /** @class */ (function (_super) {
                __extends(PostReturnProductTrigger, _super);
                function PostReturnProductTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostReturnProductTrigger;
            }(Triggers_10.NonCancelableTriggerBase));
            exports_56("PostReturnProductTrigger", PostReturnProductTrigger);
            /**
             * Represents the base class for all PreSetQuantity triggers.
             * @remarks All PreSetQuantity triggers should derive from this class.
             */
            PreSetQuantityTrigger = /** @class */ (function (_super) {
                __extends(PreSetQuantityTrigger, _super);
                function PreSetQuantityTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreSetQuantityTrigger;
            }(Triggers_10.CancelableTriggerBase));
            exports_56("PreSetQuantityTrigger", PreSetQuantityTrigger);
            /**
             * Represents the base class for all PostSetQuantity triggers.
             * @remarks All PostSetQuantity triggers should derive from this class.
             */
            PostSetQuantityTrigger = /** @class */ (function (_super) {
                __extends(PostSetQuantityTrigger, _super);
                function PostSetQuantityTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostSetQuantityTrigger;
            }(Triggers_10.NonCancelableTriggerBase));
            exports_56("PostSetQuantityTrigger", PostSetQuantityTrigger);
            /**
             * Represents the base class for all PrePriceOverride triggers.
             * @remarks All PrePriceOverride triggers should derive from this class.
             */
            PrePriceOverrideTrigger = /** @class */ (function (_super) {
                __extends(PrePriceOverrideTrigger, _super);
                function PrePriceOverrideTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PrePriceOverrideTrigger;
            }(Triggers_10.CancelableTriggerBase));
            exports_56("PrePriceOverrideTrigger", PrePriceOverrideTrigger);
            /**
             * Represents the base class for all PostPriceOverride triggers.
             * @remarks All PostPriceOverride triggers should derive from this class.
             */
            PostPriceOverrideTrigger = /** @class */ (function (_super) {
                __extends(PostPriceOverrideTrigger, _super);
                function PostPriceOverrideTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostPriceOverrideTrigger;
            }(Triggers_10.NonCancelableTriggerBase));
            exports_56("PostPriceOverrideTrigger", PostPriceOverrideTrigger);
            /**
             * Represents the base class for all PreClearQuantity triggers.
             * @remarks All PreClearQuantity triggers should derive from this class.
             */
            PreClearQuantityTrigger = /** @class */ (function (_super) {
                __extends(PreClearQuantityTrigger, _super);
                function PreClearQuantityTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreClearQuantityTrigger;
            }(Triggers_10.CancelableTriggerBase));
            exports_56("PreClearQuantityTrigger", PreClearQuantityTrigger);
            /**
             * Represents the base class for all PostClearQuantity triggers.
             * @remarks All PostClearQuantity triggers should derive from this class.
             */
            PostClearQuantityTrigger = /** @class */ (function (_super) {
                __extends(PostClearQuantityTrigger, _super);
                function PostClearQuantityTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostClearQuantityTrigger;
            }(Triggers_10.NonCancelableTriggerBase));
            exports_56("PostClearQuantityTrigger", PostClearQuantityTrigger);
            /**
             * Represents the base class for all PreVoidProducts triggers.
             * @remarks All PreVoidProducts triggers should derive from this class.
             */
            PreVoidProductsTrigger = /** @class */ (function (_super) {
                __extends(PreVoidProductsTrigger, _super);
                function PreVoidProductsTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreVoidProductsTrigger;
            }(Triggers_10.CancelableTriggerBase));
            exports_56("PreVoidProductsTrigger", PreVoidProductsTrigger);
            /**
             * Represents the base class for all PostVoidProducts triggers.
             * @remarks All PostVoidProducts triggers should derive from this class.
             */
            PostVoidProductsTrigger = /** @class */ (function (_super) {
                __extends(PostVoidProductsTrigger, _super);
                function PostVoidProductsTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostVoidProductsTrigger;
            }(Triggers_10.NonCancelableTriggerBase));
            exports_56("PostVoidProductsTrigger", PostVoidProductsTrigger);
            /**
             * Represents the base class for all PostPriceCheck triggers.
             * @remarks All PostPriceCheck triggers should derive from this class.
             */
            PostPriceCheckTrigger = /** @class */ (function (_super) {
                __extends(PostPriceCheckTrigger, _super);
                function PostPriceCheckTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostPriceCheckTrigger;
            }(Triggers_10.NonCancelableTriggerBase));
            exports_56("PostPriceCheckTrigger", PostPriceCheckTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/ReasonCodeTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_57, context_57) {
    "use strict";
    var Triggers_11, PostGetReasonCodeLineTrigger;
    var __moduleName = context_57 && context_57.id;
    return {
        setters: [
            function (Triggers_11_1) {
                Triggers_11 = Triggers_11_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PostGetReasonCodeLine triggers.
             * @remarks All PostGetReasonCodeLine triggers should derive from this class.
             */
            PostGetReasonCodeLineTrigger = /** @class */ (function (_super) {
                __extends(PostGetReasonCodeLineTrigger, _super);
                function PostGetReasonCodeLineTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostGetReasonCodeLineTrigger;
            }(Triggers_11.CancelableTriggerBase));
            exports_57("PostGetReasonCodeLineTrigger", PostGetReasonCodeLineTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/SalesOrderTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_58, context_58) {
    "use strict";
    var Triggers_12, PreChangeShippingOriginTrigger, PreCreatePackingSlipTrigger, PostCreatePackingSlipTrigger, PreGetFulfillmentLinesTrigger, PreMarkFulfillmentLinesAsPackedTrigger, PostMarkFulfillmentLinesAsPackedTrigger, PreRecallCustomerOrderTrigger, PostRecallCustomerOrderTrigger, PostReturnInvoicedSalesLinesTrigger, PrePickUpCustomerOrderLinesTrigger, PreSearchOrdersTrigger, PreShipFulfillmentLinesTrigger, PostShipFulfillmentLinesTrigger, PreResendEmailReceiptTrigger;
    var __moduleName = context_58 && context_58.id;
    return {
        setters: [
            function (Triggers_12_1) {
                Triggers_12 = Triggers_12_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PreChangeShippingOrigin triggers.
             * @remarks All PreChangeShippingOrigin triggers should derive from this class.
             */
            PreChangeShippingOriginTrigger = /** @class */ (function (_super) {
                __extends(PreChangeShippingOriginTrigger, _super);
                function PreChangeShippingOriginTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreChangeShippingOriginTrigger;
            }(Triggers_12.CancelableTriggerBase));
            exports_58("PreChangeShippingOriginTrigger", PreChangeShippingOriginTrigger);
            /**
             * Represents the base class for all PreCreatePackingSlip triggers.
             * @remarks All PreCreatePackingSlip triggers should derive from this class.
             */
            PreCreatePackingSlipTrigger = /** @class */ (function (_super) {
                __extends(PreCreatePackingSlipTrigger, _super);
                function PreCreatePackingSlipTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreCreatePackingSlipTrigger;
            }(Triggers_12.CancelableTriggerBase));
            exports_58("PreCreatePackingSlipTrigger", PreCreatePackingSlipTrigger);
            /**
             * Represents the base class for all PostCreatePackingSlip triggers.
             * @remarks All PostCreatePackingSlip triggers should derive from this class.
             */
            PostCreatePackingSlipTrigger = /** @class */ (function (_super) {
                __extends(PostCreatePackingSlipTrigger, _super);
                function PostCreatePackingSlipTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostCreatePackingSlipTrigger;
            }(Triggers_12.NonCancelableTriggerBase));
            exports_58("PostCreatePackingSlipTrigger", PostCreatePackingSlipTrigger);
            /**
             * Represents the base class for all PreGetFulfillmentLines triggers.
             */
            PreGetFulfillmentLinesTrigger = /** @class */ (function (_super) {
                __extends(PreGetFulfillmentLinesTrigger, _super);
                function PreGetFulfillmentLinesTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreGetFulfillmentLinesTrigger;
            }(Triggers_12.CancelableTriggerBase));
            exports_58("PreGetFulfillmentLinesTrigger", PreGetFulfillmentLinesTrigger);
            /**
             * Represents the base class for all PreMarkFulfillmentLinesAsPacked triggers.
             * @remarks All PreMarkFulfillmentLinesAsPacked triggers should derive from this class.
             */
            PreMarkFulfillmentLinesAsPackedTrigger = /** @class */ (function (_super) {
                __extends(PreMarkFulfillmentLinesAsPackedTrigger, _super);
                function PreMarkFulfillmentLinesAsPackedTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreMarkFulfillmentLinesAsPackedTrigger;
            }(Triggers_12.CancelableTriggerBase));
            exports_58("PreMarkFulfillmentLinesAsPackedTrigger", PreMarkFulfillmentLinesAsPackedTrigger);
            /**
             * Represents the base class for all PostMarkFulfillmentLinesAsPacked triggers.
             * @remarks All PostMarkFulfillmentLinesAsPacked triggers should derive from this class.
             */
            PostMarkFulfillmentLinesAsPackedTrigger = /** @class */ (function (_super) {
                __extends(PostMarkFulfillmentLinesAsPackedTrigger, _super);
                function PostMarkFulfillmentLinesAsPackedTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostMarkFulfillmentLinesAsPackedTrigger;
            }(Triggers_12.NonCancelableTriggerBase));
            exports_58("PostMarkFulfillmentLinesAsPackedTrigger", PostMarkFulfillmentLinesAsPackedTrigger);
            /**
             * Represents the base class for all PreRecallCustomerOrder triggers.
             * @remarks All PreRecallCustomerOrder triggers should derive from this class.
             */
            PreRecallCustomerOrderTrigger = /** @class */ (function (_super) {
                __extends(PreRecallCustomerOrderTrigger, _super);
                function PreRecallCustomerOrderTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreRecallCustomerOrderTrigger;
            }(Triggers_12.CancelableTriggerBase));
            exports_58("PreRecallCustomerOrderTrigger", PreRecallCustomerOrderTrigger);
            /**
             * Represents the base class for all PostRecallCustomerOrder triggers.
             * @remarks All PostRecallCustomerOrder triggers should derive from this class.
             */
            PostRecallCustomerOrderTrigger = /** @class */ (function (_super) {
                __extends(PostRecallCustomerOrderTrigger, _super);
                function PostRecallCustomerOrderTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostRecallCustomerOrderTrigger;
            }(Triggers_12.NonCancelableTriggerBase));
            exports_58("PostRecallCustomerOrderTrigger", PostRecallCustomerOrderTrigger);
            /**
             * Represents the base class for all PostReturnInvoicedSalesLines triggers.
             * @remarks All PostReturnInvoicedSalesLines triggers should derive from this class.
             */
            PostReturnInvoicedSalesLinesTrigger = /** @class */ (function (_super) {
                __extends(PostReturnInvoicedSalesLinesTrigger, _super);
                function PostReturnInvoicedSalesLinesTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostReturnInvoicedSalesLinesTrigger;
            }(Triggers_12.NonCancelableTriggerBase));
            exports_58("PostReturnInvoicedSalesLinesTrigger", PostReturnInvoicedSalesLinesTrigger);
            /**
             * Represents the base class for all PrePickUpCustomerOrderLines triggers.
             * @remarks All PrePickUpCustomerOrderLines triggers should derive from this class.
             */
            PrePickUpCustomerOrderLinesTrigger = /** @class */ (function (_super) {
                __extends(PrePickUpCustomerOrderLinesTrigger, _super);
                function PrePickUpCustomerOrderLinesTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PrePickUpCustomerOrderLinesTrigger;
            }(Triggers_12.CancelableTriggerBase));
            exports_58("PrePickUpCustomerOrderLinesTrigger", PrePickUpCustomerOrderLinesTrigger);
            /**
             * Represents the base class for all PreSearchOrdersTrigger triggers.
             * @remarks All PreSearchOrdersTrigger triggers should derive from this class.
             */
            PreSearchOrdersTrigger = /** @class */ (function (_super) {
                __extends(PreSearchOrdersTrigger, _super);
                function PreSearchOrdersTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreSearchOrdersTrigger;
            }(Triggers_12.CancelableTriggerBase));
            exports_58("PreSearchOrdersTrigger", PreSearchOrdersTrigger);
            /**
             * Represents the base class for all PreShipFulfillmentLinesTrigger triggers.
             * @remarks All PreShipFulfillmentLinesTrigger triggers should derive from this class.
             */
            PreShipFulfillmentLinesTrigger = /** @class */ (function (_super) {
                __extends(PreShipFulfillmentLinesTrigger, _super);
                function PreShipFulfillmentLinesTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreShipFulfillmentLinesTrigger;
            }(Triggers_12.CancelableTriggerBase));
            exports_58("PreShipFulfillmentLinesTrigger", PreShipFulfillmentLinesTrigger);
            /**
             * Represents the base class for all PostShipFulfillmentLinesTrigger triggers.
             * @remarks All PostShipFulfillmentLinesTrigger triggers should derive from this class.
             */
            PostShipFulfillmentLinesTrigger = /** @class */ (function (_super) {
                __extends(PostShipFulfillmentLinesTrigger, _super);
                function PostShipFulfillmentLinesTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostShipFulfillmentLinesTrigger;
            }(Triggers_12.NonCancelableTriggerBase));
            exports_58("PostShipFulfillmentLinesTrigger", PostShipFulfillmentLinesTrigger);
            /**
             * Represents the base class for all PreResendEmailReceiptTrigger triggers.
             * @remarks All PreResendEmailReceiptTrigger triggers should derive from this class.
             */
            PreResendEmailReceiptTrigger = /** @class */ (function (_super) {
                __extends(PreResendEmailReceiptTrigger, _super);
                function PreResendEmailReceiptTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreResendEmailReceiptTrigger;
            }(Triggers_12.CancelableTriggerBase));
            exports_58("PreResendEmailReceiptTrigger", PreResendEmailReceiptTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/ShiftTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_59, context_59) {
    "use strict";
    var Triggers_13, PostOpenShiftTrigger, PreCloseShiftTrigger;
    var __moduleName = context_59 && context_59.id;
    return {
        setters: [
            function (Triggers_13_1) {
                Triggers_13 = Triggers_13_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PostOpenShift triggers.
             * @remarks All PostOpenShift triggers should derive from this class.
             */
            PostOpenShiftTrigger = /** @class */ (function (_super) {
                __extends(PostOpenShiftTrigger, _super);
                function PostOpenShiftTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostOpenShiftTrigger;
            }(Triggers_13.NonCancelableTriggerBase));
            exports_59("PostOpenShiftTrigger", PostOpenShiftTrigger);
            /**
             * Represents the base class for all PreCloseShift triggers.
             * @remarks All PreCloseShift triggers should derive from this class.
             */
            PreCloseShiftTrigger = /** @class */ (function (_super) {
                __extends(PreCloseShiftTrigger, _super);
                function PreCloseShiftTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreCloseShiftTrigger;
            }(Triggers_13.CancelableTriggerBase));
            exports_59("PreCloseShiftTrigger", PreCloseShiftTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/TaxOverrideTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_60, context_60) {
    "use strict";
    var Triggers_14, PreOverrideLineProductTaxTrigger, PostOverrideLineProductTaxTrigger, PreOverrideTransactionTaxTrigger, PostOverrideTransactionTaxTrigger;
    var __moduleName = context_60 && context_60.id;
    return {
        setters: [
            function (Triggers_14_1) {
                Triggers_14 = Triggers_14_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PreOverrideLineProductTax triggers.
             * @remarks All PreOverrideLineProductTax triggers should derive from this class.
             */
            PreOverrideLineProductTaxTrigger = /** @class */ (function (_super) {
                __extends(PreOverrideLineProductTaxTrigger, _super);
                function PreOverrideLineProductTaxTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreOverrideLineProductTaxTrigger;
            }(Triggers_14.CancelableTriggerBase));
            exports_60("PreOverrideLineProductTaxTrigger", PreOverrideLineProductTaxTrigger);
            /**
             * Represents the base class for all PostOverrideLineProductTax triggers.
             * @remarks All PostOverrideLineProductTax triggers should derive from this class.
             */
            PostOverrideLineProductTaxTrigger = /** @class */ (function (_super) {
                __extends(PostOverrideLineProductTaxTrigger, _super);
                function PostOverrideLineProductTaxTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostOverrideLineProductTaxTrigger;
            }(Triggers_14.NonCancelableTriggerBase));
            exports_60("PostOverrideLineProductTaxTrigger", PostOverrideLineProductTaxTrigger);
            /**
             * Represents the base class for all PreOverrideTransactionTax triggers.
             * @remarks All PreOverrideTransactionTax triggers should derive from this class.
             */
            PreOverrideTransactionTaxTrigger = /** @class */ (function (_super) {
                __extends(PreOverrideTransactionTaxTrigger, _super);
                function PreOverrideTransactionTaxTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreOverrideTransactionTaxTrigger;
            }(Triggers_14.CancelableTriggerBase));
            exports_60("PreOverrideTransactionTaxTrigger", PreOverrideTransactionTaxTrigger);
            /**
             * Represents the base class for all PostOverrideTransactionTax triggers.
             * @remarks All PostOverrideTransactionTax triggers should derive from this class.
             */
            PostOverrideTransactionTaxTrigger = /** @class */ (function (_super) {
                __extends(PostOverrideTransactionTaxTrigger, _super);
                function PostOverrideTransactionTaxTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostOverrideTransactionTaxTrigger;
            }(Triggers_14.NonCancelableTriggerBase));
            exports_60("PostOverrideTransactionTaxTrigger", PostOverrideTransactionTaxTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/TransactionTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_61, context_61) {
    "use strict";
    var Triggers_15, BeginTransactionTrigger, PreConfirmReturnTransactionTrigger, PreReturnTransactionTrigger, PreReturnTransactionOperationTrigger, PostReturnTransactionTrigger, PreEndTransactionTrigger, PostEndTransactionTrigger, PreVoidTransactionTrigger, PostVoidTransactionTrigger, PreSuspendTransactionTrigger, PostSuspendTransactionTrigger, PreRecallTransactionTrigger, PostRecallTransactionTrigger, PostCartCheckoutTrigger, PreSelectTransactionPaymentMethod, PreShipSelectedCartLinesTrigger;
    var __moduleName = context_61 && context_61.id;
    return {
        setters: [
            function (Triggers_15_1) {
                Triggers_15 = Triggers_15_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all BeginTransaction triggers.
             * @remarks All BeginTransaction triggers should derive from this class.
             */
            BeginTransactionTrigger = /** @class */ (function (_super) {
                __extends(BeginTransactionTrigger, _super);
                function BeginTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return BeginTransactionTrigger;
            }(Triggers_15.NonCancelableTriggerBase));
            exports_61("BeginTransactionTrigger", BeginTransactionTrigger);
            /**
             * Represents the base class for all PreConfirmReturnTransaction triggers.
             * @remarks All PreConfirmReturnTransaction triggers should derive from this class.
             */
            PreConfirmReturnTransactionTrigger = /** @class */ (function (_super) {
                __extends(PreConfirmReturnTransactionTrigger, _super);
                function PreConfirmReturnTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreConfirmReturnTransactionTrigger;
            }(Triggers_15.CancelableTriggerBase));
            exports_61("PreConfirmReturnTransactionTrigger", PreConfirmReturnTransactionTrigger);
            /**
             * Represents the base class for all PreReturnTransaction triggers.
             * @remarks All PreReturnTransaction triggers should derive from this class.
             */
            PreReturnTransactionTrigger = /** @class */ (function (_super) {
                __extends(PreReturnTransactionTrigger, _super);
                function PreReturnTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreReturnTransactionTrigger;
            }(Triggers_15.CancelableTriggerBase));
            exports_61("PreReturnTransactionTrigger", PreReturnTransactionTrigger);
            /**
             * Represents the base class for all PreReturnTransactionOperation triggers.
             * @remarks All PreReturnTransactionOperation triggers should derive from this class.
             */
            PreReturnTransactionOperationTrigger = /** @class */ (function (_super) {
                __extends(PreReturnTransactionOperationTrigger, _super);
                function PreReturnTransactionOperationTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreReturnTransactionOperationTrigger;
            }(Triggers_15.CancelableTriggerBase));
            exports_61("PreReturnTransactionOperationTrigger", PreReturnTransactionOperationTrigger);
            /**
             * Represents the base class for all PostReturnTransaction triggers.
             * @remarks All PostReturnTransaction triggers should derive from this class.
             */
            PostReturnTransactionTrigger = /** @class */ (function (_super) {
                __extends(PostReturnTransactionTrigger, _super);
                function PostReturnTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostReturnTransactionTrigger;
            }(Triggers_15.NonCancelableTriggerBase));
            exports_61("PostReturnTransactionTrigger", PostReturnTransactionTrigger);
            /**
             * Represents the base class for all PreEndTransaction triggers.
             * @remarks All PreEndTransaction triggers should derive from this class.
             */
            PreEndTransactionTrigger = /** @class */ (function (_super) {
                __extends(PreEndTransactionTrigger, _super);
                function PreEndTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreEndTransactionTrigger;
            }(Triggers_15.CancelableTriggerBase));
            exports_61("PreEndTransactionTrigger", PreEndTransactionTrigger);
            /**
             * Represents the base class for all PostEndTransaction triggers.
             * @remarks All PostEndTransaction triggers should derive from this class.
             */
            PostEndTransactionTrigger = /** @class */ (function (_super) {
                __extends(PostEndTransactionTrigger, _super);
                function PostEndTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostEndTransactionTrigger;
            }(Triggers_15.NonCancelableTriggerBase));
            exports_61("PostEndTransactionTrigger", PostEndTransactionTrigger);
            /**
             * Represents the base class for all PreVoidTransaction triggers.
             * @remarks All PreVoidTransaction triggers should derive from this class.
             * @remarks These triggers will be executed after the user confirms they want to void the transaction, but prior to voiding the transaction.
             */
            PreVoidTransactionTrigger = /** @class */ (function (_super) {
                __extends(PreVoidTransactionTrigger, _super);
                function PreVoidTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreVoidTransactionTrigger;
            }(Triggers_15.CancelableTriggerBase));
            exports_61("PreVoidTransactionTrigger", PreVoidTransactionTrigger);
            /**
             * Represents the base class for all PostVoidTransaction triggers.
             * @remarks All PostVoidTransaction triggers should derive from this class.
             */
            PostVoidTransactionTrigger = /** @class */ (function (_super) {
                __extends(PostVoidTransactionTrigger, _super);
                function PostVoidTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostVoidTransactionTrigger;
            }(Triggers_15.NonCancelableTriggerBase));
            exports_61("PostVoidTransactionTrigger", PostVoidTransactionTrigger);
            /**
             * Represents the base class for all PreSuspendTransaction triggers.
             * @remarks All PreSuspendTransaction triggers should derive from this class.
             */
            PreSuspendTransactionTrigger = /** @class */ (function (_super) {
                __extends(PreSuspendTransactionTrigger, _super);
                function PreSuspendTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreSuspendTransactionTrigger;
            }(Triggers_15.CancelableTriggerBase));
            exports_61("PreSuspendTransactionTrigger", PreSuspendTransactionTrigger);
            /**
             * Represents the base class for all PostSuspendTransaction triggers.
             * @remarks All PostSuspendTransaction triggers should derive from this class.
             */
            PostSuspendTransactionTrigger = /** @class */ (function (_super) {
                __extends(PostSuspendTransactionTrigger, _super);
                function PostSuspendTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostSuspendTransactionTrigger;
            }(Triggers_15.NonCancelableTriggerBase));
            exports_61("PostSuspendTransactionTrigger", PostSuspendTransactionTrigger);
            /**
             * Represents the base class for all PreRecallTransaction triggers.
             * @remarks All PreRecallTransaction triggers should derive from this class.
             */
            PreRecallTransactionTrigger = /** @class */ (function (_super) {
                __extends(PreRecallTransactionTrigger, _super);
                function PreRecallTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreRecallTransactionTrigger;
            }(Triggers_15.CancelableTriggerBase));
            exports_61("PreRecallTransactionTrigger", PreRecallTransactionTrigger);
            /**
             * Represents the base class for all PostRecallTransaction triggers.
             * @remarks All PostRecallTransaction triggers should derive from this class.
             */
            PostRecallTransactionTrigger = /** @class */ (function (_super) {
                __extends(PostRecallTransactionTrigger, _super);
                function PostRecallTransactionTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostRecallTransactionTrigger;
            }(Triggers_15.NonCancelableTriggerBase));
            exports_61("PostRecallTransactionTrigger", PostRecallTransactionTrigger);
            /**
             * Represents the base class for all PostCartCheckout triggers.
             * @remarks All PostCartCheckout triggers should derive from this class.
             */
            PostCartCheckoutTrigger = /** @class */ (function (_super) {
                __extends(PostCartCheckoutTrigger, _super);
                function PostCartCheckoutTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PostCartCheckoutTrigger;
            }(Triggers_15.NonCancelableTriggerBase));
            exports_61("PostCartCheckoutTrigger", PostCartCheckoutTrigger);
            /**
             * Represents the base class for all PreSelectTransactionPaymentMethod triggers.
             * @remarks All PreSelectTransactionPaymentMethod triggers should derive from this class.
             */
            PreSelectTransactionPaymentMethod = /** @class */ (function (_super) {
                __extends(PreSelectTransactionPaymentMethod, _super);
                function PreSelectTransactionPaymentMethod() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreSelectTransactionPaymentMethod;
            }(Triggers_15.CancelableTriggerBase));
            exports_61("PreSelectTransactionPaymentMethod", PreSelectTransactionPaymentMethod);
            /**
             * Represents the base class for all PreShipSelectedCartLinesTrigger triggers.
             * @remarks All PreShipSelectedCartLinesTrigger triggers should derive from this class.
             */
            PreShipSelectedCartLinesTrigger = /** @class */ (function (_super) {
                __extends(PreShipSelectedCartLinesTrigger, _super);
                function PreShipSelectedCartLinesTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreShipSelectedCartLinesTrigger;
            }(Triggers_15.CancelableTriggerBase));
            exports_61("PreShipSelectedCartLinesTrigger", PreShipSelectedCartLinesTrigger);
        }
    };
});
System.register("PosApi/Extend/Triggers/TransferOrderTriggers", ["PosApi/Extend/Triggers/Triggers"], function (exports_62, context_62) {
    "use strict";
    var Triggers_16, PreCreateTransferOrderTrigger, PreUpdateTransferOrderTrigger;
    var __moduleName = context_62 && context_62.id;
    return {
        setters: [
            function (Triggers_16_1) {
                Triggers_16 = Triggers_16_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all PreCreateTransferOrderTrigger triggers.
             * @remarks All PreCreateTransferOrderTrigger triggers should derive from this class.
             */
            PreCreateTransferOrderTrigger = /** @class */ (function (_super) {
                __extends(PreCreateTransferOrderTrigger, _super);
                function PreCreateTransferOrderTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreCreateTransferOrderTrigger;
            }(Triggers_16.CancelableTriggerBase));
            exports_62("PreCreateTransferOrderTrigger", PreCreateTransferOrderTrigger);
            /**
             * Represents the base class for all PreUpdateTransferOrderTrigger triggers.
             * @remarks All PreUpdateTransferOrderTrigger triggers should derive from this class.
             */
            PreUpdateTransferOrderTrigger = /** @class */ (function (_super) {
                __extends(PreUpdateTransferOrderTrigger, _super);
                function PreUpdateTransferOrderTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return PreUpdateTransferOrderTrigger;
            }(Triggers_16.CancelableTriggerBase));
            exports_62("PreUpdateTransferOrderTrigger", PreUpdateTransferOrderTrigger);
        }
    };
});
System.register("PosApi/Extend/Views/AppBarCommands", [], function (exports_63, context_63) {
    "use strict";
    var ExtensionCommandBase;
    var __moduleName = context_63 && context_63.id;
    return {
        setters: [],
        execute: function () {
            /**
             * Represents an extension command.
             */
            ExtensionCommandBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the ExtensionCommandBase class.
                 * @param {IExtensionCommandContext<TMap>} context The command context.
                 */
                function ExtensionCommandBase(context) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                        throw "Invalid parameters passed to the ExtensionCommandBase constructor: context is a required parameter.";
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(context.messageChannel)) {
                        throw "Invalid parameters passed to the ExtensionCommandBase constructor: context must contain the message channel.";
                    }
                    this.extraClass = "";
                    this.id = "";
                    this.label = "";
                    this.context = context;
                    this._isProcessing = false;
                    this._canExecute = false;
                    this._isVisible = false;
                    this.context.messageChannel.addMessageHandler("Initialize", function (data) {
                        _this.init(data);
                    });
                    this.context.messageChannel.addMessageHandler("Dispose", function () {
                        _this.dispose();
                    });
                    this.context.messageChannel.addMessageHandler("Execute", function () {
                        _this.execute();
                    });
                    // Start the message channel to begin receiving messages.
                    this.context.messageChannel.start();
                }
                Object.defineProperty(ExtensionCommandBase.prototype, "isProcessing", {
                    /**
                     * Gets a value indicating whether or not the command is processing.
                     * @return {boolean} True if the command is processing. False otherwise.
                     */
                    get: function () {
                        return this._isProcessing;
                    },
                    /**
                     * Sets a value indicating whether or not the command is processing.
                     * @param {boolean} value True if the command is processing. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isProcessing) {
                            this._isProcessing = value;
                            this.context.messageChannel.sendMessage("IsProcessingChanged", this._isProcessing);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionCommandBase.prototype, "canExecute", {
                    /**
                     * Gets a value indicating whether or not the command is processing.
                     * @return {boolean} True if the command can execute. False otherwise.
                     */
                    get: function () {
                        return this._canExecute;
                    },
                    /**
                     * Sets a value indicating whether or not the command can execute.
                     * @param {boolean} value True if the command can execute. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._canExecute) {
                            this._canExecute = value;
                            this.context.messageChannel.sendMessage("CanExecuteChanged", this._canExecute);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionCommandBase.prototype, "isVisible", {
                    /**
                     * Gets a value indicating whether or not the command is visible.
                     * @return {boolean} True if the command is visible. False otherwise.
                     */
                    get: function () {
                        return this._isVisible;
                    },
                    /**
                     * Sets a value indicating whether or not the command is visible.
                     * @param {boolean} value True if the command is visble. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isVisible) {
                            this._isVisible = value;
                            this.context.messageChannel.sendMessage("VisibilityChanged", this._isVisible);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Disposes the command releasing its resources.
                 */
                ExtensionCommandBase.prototype.dispose = function () {
                    Commerce.ObjectExtensions.disposeAllProperties(this);
                };
                return ExtensionCommandBase;
            }());
            exports_63("ExtensionCommandBase", ExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/AddressAddEditView", ["PosApi/Extend/Views/AppBarCommands", "PosApi/Extend/Views/CustomControls"], function (exports_64, context_64) {
    "use strict";
    var AppBarCommands_1, CustomControls_1, AddressAddEditExtensionCommandBase, AddressAddEditCustomControlBase;
    var __moduleName = context_64 && context_64.id;
    return {
        setters: [
            function (AppBarCommands_1_1) {
                AppBarCommands_1 = AppBarCommands_1_1;
            },
            function (CustomControls_1_1) {
                CustomControls_1 = CustomControls_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the address add/edit page.
             * @remarks All commands added to the address add/edit page should derive from this class.
             */
            AddressAddEditExtensionCommandBase = /** @class */ (function (_super) {
                __extends(AddressAddEditExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the AddressAddEditExtensionCommandBase class.
                 * @param {IAddressAddEditExtensionCommandContext} context The command context.
                 */
                function AddressAddEditExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("Initialize", function (data) {
                        _this._address = data.address;
                    });
                    _this.context.messageChannel.addMessageHandler("AddressUpdated", function (data) {
                        if (Commerce.StringExtensions.compare(JSON.stringify(data.address), JSON.stringify(_this._address), false) !== 0) {
                            _this._address = data.address;
                            if (Commerce.ObjectExtensions.isFunction(_this.addressUpdatedHandler)) {
                                _this.addressUpdatedHandler(data);
                            }
                        }
                    });
                    return _this;
                }
                Object.defineProperty(AddressAddEditExtensionCommandBase.prototype, "address", {
                    /**
                     * Gets the address.
                     * @return {ProxyEntities.Address} The address.
                     */
                    get: function () {
                        return Commerce.ObjectExtensions.clone(this._address);
                    },
                    /**
                     * Sets the address.
                     * @param {ProxyEntities.Address} Sets the address and notifies the address add/edit view of the change.
                     */
                    set: function (value) {
                        if (Commerce.StringExtensions.compare(JSON.stringify(value), JSON.stringify(this._address), false) !== 0) {
                            this._address = value;
                            var data = { address: this._address };
                            this.context.messageChannel.sendMessage("UpdateAddress", data);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return AddressAddEditExtensionCommandBase;
            }(AppBarCommands_1.ExtensionCommandBase));
            exports_64("AddressAddEditExtensionCommandBase", AddressAddEditExtensionCommandBase);
            /**
             * Represents the base class for all extension controls on the Address add edit page.
             * @remarks Custom controls in extensions should derive from this class.
             */
            AddressAddEditCustomControlBase = /** @class */ (function (_super) {
                __extends(AddressAddEditCustomControlBase, _super);
                /**
                 * Creates a new instance of the AddressAddEditCustomControlBase class.
                 * @param {string} id The control identifier.
                 * @param {IAddressAddEditCustomControlContext} context The control context.
                 */
                function AddressAddEditCustomControlBase(id, context) {
                    var _this = _super.call(this, id, context) || this;
                    _this.context.messageChannel.addMessageHandler("Initialize", function (data) {
                        _this._address = data.address;
                    });
                    _this.context.messageChannel.addMessageHandler("AddressUpdated", function (data) {
                        if (Commerce.StringExtensions.compare(JSON.stringify(data.address), JSON.stringify(_this._address), false) !== 0) {
                            _this._address = data.address;
                            if (Commerce.ObjectExtensions.isFunction(_this.addressUpdatedHandler)) {
                                _this.addressUpdatedHandler(data);
                            }
                        }
                    });
                    _this._isVisible = false;
                    return _this;
                }
                Object.defineProperty(AddressAddEditCustomControlBase.prototype, "isVisible", {
                    /**
                     * Gets a value indicating whether or not the custom control is visible.
                     * @return {boolean} True if the custom control is visible. False otherwise.
                     */
                    get: function () {
                        return this._isVisible;
                    },
                    /**
                     * Sets a value indicating whether or not the custom control is visible.
                     * @param {boolean} value True if the custom control is visble. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isVisible) {
                            this._isVisible = value;
                            this.context.messageChannel.sendMessage("VisibilityChanged", this._isVisible);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AddressAddEditCustomControlBase.prototype, "address", {
                    /**
                     * Gets the address.
                     * @return {ProxyEntities.Address} The address.
                     */
                    get: function () {
                        return Commerce.ObjectExtensions.clone(this._address);
                    },
                    /**
                     * Sets the address. Will send a message to POS core to notify it of the updated address.
                     * @param {ProxyEntities.Address} value Sets the address.
                     */
                    set: function (value) {
                        if (Commerce.StringExtensions.compare(JSON.stringify(value), JSON.stringify(this._address), false) !== 0) {
                            this._address = value;
                            var data = { address: this._address };
                            this.context.messageChannel.sendMessage("UpdateAddress", data);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return AddressAddEditCustomControlBase;
            }(CustomControls_1.CustomControlBase));
            exports_64("AddressAddEditCustomControlBase", AddressAddEditCustomControlBase);
        }
    };
});
System.register("PosApi/Extend/Views/ViewControllers", [], function (exports_65, context_65) {
    "use strict";
    var ExtensionViewControllerBase;
    var __moduleName = context_65 && context_65.id;
    return {
        setters: [],
        execute: function () {
            /**
             * Represents an extension view controller base.
             */
            ExtensionViewControllerBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the ExtensionViewControllerBase class.
                 * @param {IExtensionViewControllerContext<TMap>} context The view controller context.
                 */
                function ExtensionViewControllerBase(context) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                        throw "Invalid parameters passed to the ExtensionViewControllerBase constructor: context is a required parameter.";
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(context.messageChannel)) {
                        throw "Invalid parameters passed to the ExtensionViewControllerBase constructor: context must contain the message channel.";
                    }
                    this.context = context;
                    this.context.messageChannel.addMessageHandler("Initialize", function (data) {
                        _this.init(data);
                    });
                    // Start the message channel to begin receiving messages.
                    this.context.messageChannel.start();
                }
                /**
                 * Initializes the command.
                 * @param {TMap["Initialize"]} context The command state.
                 */
                ExtensionViewControllerBase.prototype.init = function (state) {
                    // NOP
                };
                return ExtensionViewControllerBase;
            }());
            exports_65("ExtensionViewControllerBase", ExtensionViewControllerBase);
        }
    };
});
System.register("PosApi/Extend/Views/CustomGridColumns", [], function (exports_66, context_66) {
    "use strict";
    var CustomGridColumnAlignment, CustomGridColumnBase;
    var __moduleName = context_66 && context_66.id;
    return {
        setters: [],
        execute: function () {
            exports_66("CustomGridColumnAlignment", CustomGridColumnAlignment = Commerce.Extensibility.CustomGridColumnAlignment);
            /**
             * The base class for grid custom column extension.
             */
            CustomGridColumnBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the class.
                 * @param {ICustomGridColumnContext} context The extension context.
                 */
                function CustomGridColumnBase(context) {
                    this.context = context;
                }
                return CustomGridColumnBase;
            }());
            exports_66("CustomGridColumnBase", CustomGridColumnBase);
        }
    };
});
System.register("PosApi/Extend/Views/CustomGridItemSubfield", [], function (exports_67, context_67) {
    "use strict";
    var CustomGridItemSubfieldBase;
    var __moduleName = context_67 && context_67.id;
    return {
        setters: [],
        execute: function () {
            /**
             * The base class for custom grid item subfield extension.
             */
            CustomGridItemSubfieldBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the class.
                 * @param {ICustomGridItemSubfieldContext} context The extension context.
                 */
                function CustomGridItemSubfieldBase(context) {
                    this.context = context;
                }
                return CustomGridItemSubfieldBase;
            }());
            exports_67("CustomGridItemSubfieldBase", CustomGridItemSubfieldBase);
        }
    };
});
System.register("PosApi/Extend/Views/CartView", ["PosApi/Extend/Views/ViewControllers", "PosApi/Extend/Views/CustomControls", "PosApi/Extend/Views/CustomGridColumns", "PosApi/Extend/Views/CustomGridItemSubfield"], function (exports_68, context_68) {
    "use strict";
    var ViewControllers_1, CustomControls_2, CustomGridColumns_1, CustomGridItemSubfield_1, CartExtensionViewControllerBase, CustomLinesGridColumnBase, CustomPaymentsGridColumnBase, CustomDeliveryGridColumnBase, CustomLinesGridItemSubfieldBase, CartViewCustomControlBase, CartViewTotalsPanelCustomFieldBase;
    var __moduleName = context_68 && context_68.id;
    return {
        setters: [
            function (ViewControllers_1_1) {
                ViewControllers_1 = ViewControllers_1_1;
            },
            function (CustomControls_2_1) {
                CustomControls_2 = CustomControls_2_1;
            },
            function (CustomGridColumns_1_1) {
                CustomGridColumns_1 = CustomGridColumns_1_1;
            },
            function (CustomGridItemSubfield_1_1) {
                CustomGridItemSubfield_1 = CustomGridItemSubfield_1_1;
            }
        ],
        execute: function () {
            /**
             * Represents the extenesion's cart view controller base class.
             * @remarks All view controller extensions for the cart view should derive from this class.
             */
            CartExtensionViewControllerBase = /** @class */ (function (_super) {
                __extends(CartExtensionViewControllerBase, _super);
                /**
                 * Creates a new instance of the CartExtensionViewControllerBase class.
                 * @param {IExtensionCartViewControllerContext} context The view controller context.
                 */
                function CartExtensionViewControllerBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this._isProcessing = false;
                    _this.context.messageChannel.addMessageHandler("CartLineSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.cartLineSelectedHandler)) {
                            _this.cartLineSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("CartLineSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.cartLineSelectionClearedHandler)) {
                            _this.cartLineSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("TenderLineSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.tenderLineSelectedHandler)) {
                            _this.tenderLineSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("TenderLineSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.tenderLineSelectionClearedHandler)) {
                            _this.tenderLineSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("ProcessingAddItemOrCustomerChanged", function (processing) {
                        if (Commerce.ObjectExtensions.isFunction(_this.processingAddItemOrCustomerChangedHandler)) {
                            _this.processingAddItemOrCustomerChangedHandler(processing);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("CartChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.cartChangedHandler)) {
                            _this.cartChangedHandler(data);
                        }
                    });
                    return _this;
                }
                Object.defineProperty(CartExtensionViewControllerBase.prototype, "isProcessing", {
                    /**
                     * Gets a value indicating whether or not the view controller is processing.
                     * @return {boolean} True if the view controller is processing. False otherwise.
                     */
                    get: function () {
                        return this._isProcessing;
                    },
                    /**
                     * Sets a value indicating whether or not the view controller is processing.
                     * @param {boolean} value True if the view controller is processing. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isProcessing) {
                            this._isProcessing = value;
                            this.context.messageChannel.sendMessage("IsProcessingChanged", this._isProcessing);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Selects the cart lines shown on the page.
                 * @param {SetSelectedCartLinesData} setSelectedCartLinesData The SetSelectedCartLines message data.
                 */
                CartExtensionViewControllerBase.prototype.setSelectedCartLines = function (setSelectedCartLinesData) {
                    this.context.messageChannel.sendMessage("SetSelectedCartLines", setSelectedCartLinesData);
                };
                return CartExtensionViewControllerBase;
            }(ViewControllers_1.ExtensionViewControllerBase));
            exports_68("CartExtensionViewControllerBase", CartExtensionViewControllerBase);
            /**
             * The base class for lines grid custom column extension.
             */
            CustomLinesGridColumnBase = /** @class */ (function (_super) {
                __extends(CustomLinesGridColumnBase, _super);
                function CustomLinesGridColumnBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CustomLinesGridColumnBase;
            }(CustomGridColumns_1.CustomGridColumnBase));
            exports_68("CustomLinesGridColumnBase", CustomLinesGridColumnBase);
            /**
             * The base class for payments grid custom column extension.
             */
            CustomPaymentsGridColumnBase = /** @class */ (function (_super) {
                __extends(CustomPaymentsGridColumnBase, _super);
                function CustomPaymentsGridColumnBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CustomPaymentsGridColumnBase;
            }(CustomGridColumns_1.CustomGridColumnBase));
            exports_68("CustomPaymentsGridColumnBase", CustomPaymentsGridColumnBase);
            /**
             * The base class for delivery grid custom column extension.
             */
            CustomDeliveryGridColumnBase = /** @class */ (function (_super) {
                __extends(CustomDeliveryGridColumnBase, _super);
                function CustomDeliveryGridColumnBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CustomDeliveryGridColumnBase;
            }(CustomGridColumns_1.CustomGridColumnBase));
            exports_68("CustomDeliveryGridColumnBase", CustomDeliveryGridColumnBase);
            /**
             * The base class for lines grid custom column extension.
             */
            CustomLinesGridItemSubfieldBase = /** @class */ (function (_super) {
                __extends(CustomLinesGridItemSubfieldBase, _super);
                function CustomLinesGridItemSubfieldBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CustomLinesGridItemSubfieldBase;
            }(CustomGridItemSubfield_1.CustomGridItemSubfieldBase));
            exports_68("CustomLinesGridItemSubfieldBase", CustomLinesGridItemSubfieldBase);
            /**
             * Represents the base class for all extension controls on the cart page.
             * @remarks Custom controls in extensions should derive from this class.
             */
            CartViewCustomControlBase = /** @class */ (function (_super) {
                __extends(CartViewCustomControlBase, _super);
                /**
                 * Creates a new instance of the CartViewCustomControlBase class.
                 * @param {string} id The control identifier.
                 * @param {ICartViewCustomControlContext} context The control context.
                 */
                function CartViewCustomControlBase(id, context) {
                    var _this = _super.call(this, id, context) || this;
                    _this.context.messageChannel.addMessageHandler("CartLineSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.cartLineSelectedHandler)) {
                            _this.cartLineSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("CartLineSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.cartLineSelectionClearedHandler)) {
                            _this.cartLineSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("TenderLineSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.tenderLineSelectedHandler)) {
                            _this.tenderLineSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("TenderLineSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.tenderLineSelectionClearedHandler)) {
                            _this.tenderLineSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("CartChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.cartChangedHandler)) {
                            _this.cartChangedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("ProcessingAddItemOrCustomerChanged", function (processing) {
                        if (Commerce.ObjectExtensions.isFunction(_this.processingAddItemOrCustomerChangedHandler)) {
                            _this.processingAddItemOrCustomerChangedHandler(processing);
                        }
                    });
                    return _this;
                }
                /**
                 * Selects the cart lines shown on the page.
                 * @param {SetSelectedCartLinesData} setSelectedCartLinesData The SetSelectedCartLines message data.
                 */
                CartViewCustomControlBase.prototype.setSelectedCartLines = function (setSelectedCartLinesData) {
                    this.context.messageChannel.sendMessage("SetSelectedCartLines", setSelectedCartLinesData);
                };
                return CartViewCustomControlBase;
            }(CustomControls_2.CustomControlBase));
            exports_68("CartViewCustomControlBase", CartViewCustomControlBase);
            /**
             * Represents the base class for all totals panel custom fields on the cart page.
             * @remarks Custom fields in extensions should derive from this class.
             */
            CartViewTotalsPanelCustomFieldBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the class.
                 * @param {ICartViewTotalsPanelCustomFieldContext} context The extension context.
                 */
                function CartViewTotalsPanelCustomFieldBase(context) {
                    this.context = context;
                }
                return CartViewTotalsPanelCustomFieldBase;
            }());
            exports_68("CartViewTotalsPanelCustomFieldBase", CartViewTotalsPanelCustomFieldBase);
        }
    };
});
System.register("PosApi/Extend/Views/CustomListColumns", [], function (exports_69, context_69) {
    "use strict";
    var __moduleName = context_69 && context_69.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("PosApi/Extend/Views/CustomSearchFilters", ["PosApi/Entities", "PosApi/TypeExtensions"], function (exports_70, context_70) {
    "use strict";
    var Entities_1, TypeExtensions_3, CustomSearchFilterDefinitionBase, CustomTextSearchFilterDefinitionBase;
    var __moduleName = context_70 && context_70.id;
    return {
        setters: [
            function (Entities_1_1) {
                Entities_1 = Entities_1_1;
            },
            function (TypeExtensions_3_1) {
                TypeExtensions_3 = TypeExtensions_3_1;
            }
        ],
        execute: function () {
            CustomSearchFilterDefinitionBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the CustomSearchFilterDefinitionBase class.
                 * @param {ProxyEntities.SearchFilterType} filterType The filter type.
                 * @param {ISearchFilterDefinitionContext} context The search filter definition context.
                 */
                function CustomSearchFilterDefinitionBase(filterType, context) {
                    this.context = context;
                    this._filterType = filterType;
                }
                Object.defineProperty(CustomSearchFilterDefinitionBase.prototype, "filterType", {
                    /**
                     * Gets the search filter definition type.
                     * @returns {ProxyEntities.SearchFilterType} The search filter definition type.
                     */
                    get: function () {
                        return this._filterType;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CustomSearchFilterDefinitionBase.prototype, "key", {
                    /**
                     * Gets the search filter definition key.
                     * @returns {string} The search filter definition key.
                     */
                    get: function () {
                        return TypeExtensions_3.StringExtensions.format(CustomSearchFilterDefinitionBase.KEY_FORMAT_STRING, this.context.extensionPackageInfo.publisher, this.context.extensionPackageInfo.name, this.id);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CustomSearchFilterDefinitionBase.prototype, "label", {
                    /**
                     * Gets the search filter definition label.
                     * @returns {string} The search filter definition label.
                     */
                    get: function () {
                        return this.labelValue;
                    },
                    enumerable: true,
                    configurable: true
                });
                CustomSearchFilterDefinitionBase.KEY_FORMAT_STRING = "{0}_{1}_{2}";
                return CustomSearchFilterDefinitionBase;
            }());
            exports_70("CustomSearchFilterDefinitionBase", CustomSearchFilterDefinitionBase);
            /**
             * Represents the base class for all custom text search filter definitions.
             * @remarks All custom text search filter definitions should derive directly from this class.
             */
            CustomTextSearchFilterDefinitionBase = /** @class */ (function (_super) {
                __extends(CustomTextSearchFilterDefinitionBase, _super);
                /**
                 * Creates a new instance of the CustomTextSearchFilterDefinitionBase class.
                 * @param {ISearchFilterDefinitionContext} context The search filter definition context.
                 */
                function CustomTextSearchFilterDefinitionBase(context) {
                    return _super.call(this, Entities_1.ProxyEntities.SearchFilterType.Text, context) || this;
                }
                return CustomTextSearchFilterDefinitionBase;
            }(CustomSearchFilterDefinitionBase));
            exports_70("CustomTextSearchFilterDefinitionBase", CustomTextSearchFilterDefinitionBase);
        }
    };
});
System.register("PosApi/Extend/Views/CustomSortColumnDefinitions", ["PosApi/TypeExtensions"], function (exports_71, context_71) {
    "use strict";
    var TypeExtensions_4, CustomSortColumnDefinitionBase;
    var __moduleName = context_71 && context_71.id;
    return {
        setters: [
            function (TypeExtensions_4_1) {
                TypeExtensions_4 = TypeExtensions_4_1;
            }
        ],
        execute: function () {
            CustomSortColumnDefinitionBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the CustomSortColumnDefinitionBase class.
                 * @param {ICustomSortColumnDefinitionContext} context The sort column definition context.
                 */
                function CustomSortColumnDefinitionBase(context) {
                    this.context = context;
                }
                Object.defineProperty(CustomSortColumnDefinitionBase.prototype, "id", {
                    /**
                     * Gets the sort column id.
                     * @returns {string} The sort column id.
                     */
                    get: function () {
                        return TypeExtensions_4.StringExtensions.format(CustomSortColumnDefinitionBase.ID_FORMAT_STRING, this.context.extensionPackageInfo.publisher, this.context.extensionPackageInfo.name, this.columnName());
                    },
                    enumerable: true,
                    configurable: true
                });
                CustomSortColumnDefinitionBase.ID_FORMAT_STRING = "{0}_{1}_{2}";
                return CustomSortColumnDefinitionBase;
            }());
            exports_71("CustomSortColumnDefinitionBase", CustomSortColumnDefinitionBase);
        }
    };
});
System.register("PosApi/Extend/Views/CustomerAddEditView", ["PosApi/Extend/Views/AppBarCommands", "PosApi/Extend/Views/CustomControls"], function (exports_72, context_72) {
    "use strict";
    var AppBarCommands_2, CustomControls_3, CustomerAddEditExtensionCommandBase, CustomerAddEditCustomControlBase;
    var __moduleName = context_72 && context_72.id;
    return {
        setters: [
            function (AppBarCommands_2_1) {
                AppBarCommands_2 = AppBarCommands_2_1;
            },
            function (CustomControls_3_1) {
                CustomControls_3 = CustomControls_3_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the customer add/edit page.
             * @remarks All commands added to the customer add/edit page should derive from this class.
             */
            CustomerAddEditExtensionCommandBase = /** @class */ (function (_super) {
                __extends(CustomerAddEditExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the CustomerAddEditExtensionCommandBase class.
                 * @param {ICustomerAddEditExtensionCommandContext} context The command context.
                 */
                function CustomerAddEditExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("Initialize", function (data) {
                        _this._customer = data.customer;
                    });
                    _this.context.messageChannel.addMessageHandler("CustomerUpdated", function (data) {
                        _this._customer = data.customer;
                        if (Commerce.ObjectExtensions.isFunction(_this.customerUpdatedHandler)) {
                            _this.customerUpdatedHandler(data);
                        }
                    });
                    return _this;
                }
                Object.defineProperty(CustomerAddEditExtensionCommandBase.prototype, "customer", {
                    /**
                     * Gets the customer.
                     * @return {Customer} The customer.
                     */
                    get: function () {
                        return Commerce.ObjectExtensions.clone(this._customer);
                    },
                    /**
                     * Sets the customer.
                     * @param {Customer} Sets the customer and notifies the customer add/edit view of the change.
                     */
                    set: function (value) {
                        if (Commerce.StringExtensions.compare(JSON.stringify(value), JSON.stringify(this._customer), false) !== 0) {
                            this._customer = value;
                            var data = { customer: this._customer };
                            this.context.messageChannel.sendMessage("CustomerChanged", data);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return CustomerAddEditExtensionCommandBase;
            }(AppBarCommands_2.ExtensionCommandBase));
            exports_72("CustomerAddEditExtensionCommandBase", CustomerAddEditExtensionCommandBase);
            /**
             * Represents the base class for all extension controls on the add\edit customer page.
             * @remarks Custom controls in extensions should derive from this class.
             */
            CustomerAddEditCustomControlBase = /** @class */ (function (_super) {
                __extends(CustomerAddEditCustomControlBase, _super);
                /**
                 * Creates a new instance of the CustomerDetailCustomControlBase class.
                 * @param {string} id The control identifier.
                 * @param {CustomerDetailCustomControlBase} context The control context.
                 */
                function CustomerAddEditCustomControlBase(id, context) {
                    var _this = _super.call(this, id, context) || this;
                    _this.context.messageChannel.addMessageHandler("Initialize", function (data) {
                        _this._customer = data.customer;
                    });
                    _this.context.messageChannel.addMessageHandler("CustomerUpdated", function (data) {
                        _this._customer = data.customer;
                        if (Commerce.ObjectExtensions.isFunction(_this.customerUpdatedHandler)) {
                            _this.customerUpdatedHandler(data);
                        }
                    });
                    _this._isVisible = false;
                    return _this;
                }
                Object.defineProperty(CustomerAddEditCustomControlBase.prototype, "isVisible", {
                    /**
                     * Gets a value indicating whether or not the custom control is visible.
                     * @return {boolean} True if the custom control is visible. False otherwise.
                     */
                    get: function () {
                        return this._isVisible;
                    },
                    /**
                     * Sets a value indicating whether or not the custom control is visible.
                     * @param {boolean} value True if the custom control is visble. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isVisible) {
                            this._isVisible = value;
                            this.context.messageChannel.sendMessage("VisibilityChanged", this._isVisible);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CustomerAddEditCustomControlBase.prototype, "customer", {
                    /**
                     * Gets the customer.
                     * @return {Customer} The customer.
                     */
                    get: function () {
                        return Commerce.ObjectExtensions.clone(this._customer);
                    },
                    /**
                     * Sets the customer.
                     * @param {Customer} Sets the customer and notifies the customer add/edit view of the change.
                     */
                    set: function (value) {
                        if (Commerce.StringExtensions.compare(JSON.stringify(value), JSON.stringify(this._customer), false) !== 0) {
                            this._customer = value;
                            var data = { customer: this._customer };
                            this.context.messageChannel.sendMessage("CustomerChanged", data);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return CustomerAddEditCustomControlBase;
            }(CustomControls_3.CustomControlBase));
            exports_72("CustomerAddEditCustomControlBase", CustomerAddEditCustomControlBase);
        }
    };
});
System.register("PosApi/Extend/Views/CustomerDetailsView", ["PosApi/Extend/Views/AppBarCommands", "PosApi/Extend/Views/CustomControls"], function (exports_73, context_73) {
    "use strict";
    var AppBarCommands_3, CustomControls_4, CustomerDetailsExtensionCommandBase, CustomerDetailsCustomControlBase;
    var __moduleName = context_73 && context_73.id;
    return {
        setters: [
            function (AppBarCommands_3_1) {
                AppBarCommands_3 = AppBarCommands_3_1;
            },
            function (CustomControls_4_1) {
                CustomControls_4 = CustomControls_4_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the customer details page.
             * @remarks All commands added to the customer details page should derive from this class.
             */
            CustomerDetailsExtensionCommandBase = /** @class */ (function (_super) {
                __extends(CustomerDetailsExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the CustomerDetailsExtensionCommandBase class.
                 * @param {IExtensionCommandContext<ICustomerDetailsToExtensionCommandMessageTypeMap>} context The command context.
                 */
                function CustomerDetailsExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("AffiliationAdded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.affiliationAddedHandler)) {
                            _this.affiliationAddedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("LoyaltyCardsLoaded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.loyaltyCardsLoadedHandler)) {
                            _this.loyaltyCardsLoadedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("WishListsLoaded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.wishListsLoadedHandler)) {
                            _this.wishListsLoadedHandler(data);
                        }
                    });
                    return _this;
                }
                return CustomerDetailsExtensionCommandBase;
            }(AppBarCommands_3.ExtensionCommandBase));
            exports_73("CustomerDetailsExtensionCommandBase", CustomerDetailsExtensionCommandBase);
            /**
             * Represents the base class for all extension controls on the customer details page.
             * @remarks Custom controls in extensions should derive from this class.
             */
            CustomerDetailsCustomControlBase = /** @class */ (function (_super) {
                __extends(CustomerDetailsCustomControlBase, _super);
                /**
                 * Creates a new instance of the CustomerDetailsCustomControlBase class.
                 * @param {string} id The control identifier.
                 * @param {ICustomerDetailsCustomControlContext} context The control context.
                 */
                function CustomerDetailsCustomControlBase(id, context) {
                    var _this = _super.call(this, id, context) || this;
                    _this._isVisible = false;
                    _this.context.messageChannel.addMessageHandler("AffiliationAdded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.affiliationAddedHandler)) {
                            _this.affiliationAddedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("LoyaltyCardsLoaded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.loyaltyCardsLoadedHandler)) {
                            _this.loyaltyCardsLoadedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("WishListsLoaded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.wishListsLoadedHandler)) {
                            _this.wishListsLoadedHandler(data);
                        }
                    });
                    return _this;
                }
                Object.defineProperty(CustomerDetailsCustomControlBase.prototype, "isVisible", {
                    /**
                     * Gets a value indicating whether or not the custom control is visible.
                     * @return {boolean} True if the command is visible. False otherwise.
                     */
                    get: function () {
                        return this._isVisible;
                    },
                    /**
                     * Sets a value indicating whether or not the custom control is visible.
                     * @param {boolean} value True if the command is visble. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isVisible) {
                            this._isVisible = value;
                            this.context.messageChannel.sendMessage("VisibilityChanged", this._isVisible);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return CustomerDetailsCustomControlBase;
            }(CustomControls_4.CustomControlBase));
            exports_73("CustomerDetailsCustomControlBase", CustomerDetailsCustomControlBase);
        }
    };
});
System.register("PosApi/Extend/Views/FulfillmentLineView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_74, context_74) {
    "use strict";
    var AppBarCommands_4, FulfillmentLineExtensionCommandBase;
    var __moduleName = context_74 && context_74.id;
    return {
        setters: [
            function (AppBarCommands_4_1) {
                AppBarCommands_4 = AppBarCommands_4_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the FulfillmentLine page.
             * @remarks All commands added to the FulfillmentLine page should derive from this class.
             */
            FulfillmentLineExtensionCommandBase = /** @class */ (function (_super) {
                __extends(FulfillmentLineExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the FulfillmentLineExtensionCommandBase class.
                 * @param {IFulfillmentLineExtensionCommandContext} context The command context.
                 */
                function FulfillmentLineExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("FulfillmentLinesSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.fulfillmentLinesSelectionHandler)) {
                            _this.fulfillmentLinesSelectionHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("FulfillmentLinesSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.fulfillmentLinesSelectionClearedHandler)) {
                            _this.fulfillmentLinesSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("PackingSlipSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.packingSlipSelectedHandler)) {
                            _this.packingSlipSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("PackingSlipSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.packingSlipSelectionClearedHandler)) {
                            _this.packingSlipSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("FulfillmentLinesLoaded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.fulfillmentLinesLoadedHandler)) {
                            _this.fulfillmentLinesLoadedHandler(data);
                        }
                    });
                    return _this;
                }
                /**
                 * Refreshes the fulfillment lines shown on the page.
                 */
                FulfillmentLineExtensionCommandBase.prototype.refreshFulfillmentLines = function () {
                    this.context.messageChannel.sendMessage("RefreshFulfillmentLines", undefined);
                };
                /**
                 * Selects the fulfillment lines shown on the page.
                 * @param {SetSelectedFulfillmentLinesData} setSelectedFulfillmentLinesData The SetSelectedFulfillmentLines message data.
                 */
                FulfillmentLineExtensionCommandBase.prototype.setSelectedFulfillmentLines = function (setSelectedFulfillmentLinesData) {
                    this.context.messageChannel.sendMessage("SetSelectedFulfillmentLines", setSelectedFulfillmentLinesData);
                };
                return FulfillmentLineExtensionCommandBase;
            }(AppBarCommands_4.ExtensionCommandBase));
            exports_74("FulfillmentLineExtensionCommandBase", FulfillmentLineExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/HealthCheckView", [], function (exports_75, context_75) {
    "use strict";
    var CustomHealthCheckBase;
    var __moduleName = context_75 && context_75.id;
    return {
        setters: [],
        execute: function () {
            /**
             * The custom health check base class.
             */
            CustomHealthCheckBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the class.
                 * @param {ICustomHealthCheckContext} context The extension context.
                 * @param {string} name The health check name.
                 * @param {string} entityType The health check entity type.
                 * @param {IHealthCheckSetupDetail[]} setupDetails The list of health check setup items.
                 */
                function CustomHealthCheckBase(context, name, entityType, setupDetails) {
                    this.context = context;
                    this.name = name;
                    this.entityType = entityType;
                    this.setupDetails = setupDetails;
                }
                return CustomHealthCheckBase;
            }());
            exports_75("CustomHealthCheckBase", CustomHealthCheckBase);
        }
    };
});
System.register("PosApi/Extend/Views/InventoryDocumentListView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_76, context_76) {
    "use strict";
    var AppBarCommands_5, InventoryDocumentListExtensionCommandBase;
    var __moduleName = context_76 && context_76.id;
    return {
        setters: [
            function (AppBarCommands_5_1) {
                AppBarCommands_5 = AppBarCommands_5_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the inventory document list page.
             * @remarks All commands added to the InventoryDocumentList page should derive from this class.
             */
            InventoryDocumentListExtensionCommandBase = /** @class */ (function (_super) {
                __extends(InventoryDocumentListExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the InventoryDocumentListExtensionCommandBase class.
                 * @param {IInventoryDocumentListExtensionCommandContext} context The command context.
                 */
                function InventoryDocumentListExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("InventoryDocumentsLoaded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.inventoryDocumentsLoadedHandler)) {
                            _this.inventoryDocumentsLoadedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("DocumentSelected", function (data) {
                        // DocumentSelected message with null argument is sent to other child components when selection is cleared.
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(data.inventoryDocument) &&
                            Commerce.ObjectExtensions.isFunction(_this.documentSelectedHandler)) {
                            _this.documentSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("DocumentSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.documentSelectionClearedHandler)) {
                            _this.documentSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                return InventoryDocumentListExtensionCommandBase;
            }(AppBarCommands_5.ExtensionCommandBase));
            exports_76("InventoryDocumentListExtensionCommandBase", InventoryDocumentListExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/InventoryDocumentShippingAndReceivingView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_77, context_77) {
    "use strict";
    var AppBarCommands_6, InventoryDocumentShippingAndReceivingExtensionCommandBase;
    var __moduleName = context_77 && context_77.id;
    return {
        setters: [
            function (AppBarCommands_6_1) {
                AppBarCommands_6 = AppBarCommands_6_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the InventoryDocumentShippingAndReceiving page.
             * @remarks All commands added to the InventoryDocumentShippingAndReceiving page should derive from this class.
             */
            InventoryDocumentShippingAndReceivingExtensionCommandBase = /** @class */ (function (_super) {
                __extends(InventoryDocumentShippingAndReceivingExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the InventoryDocumentShippingAndReceivingExtensionCommandBase class.
                 * @param {IInventoryDocumentShippingAndReceivingExtensionCommandContext} context The command context.
                 */
                function InventoryDocumentShippingAndReceivingExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("ModeUpdated", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.modeUpdatedHandler)) {
                            _this.modeUpdatedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("DocumentLinesSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.documentLinesSelectedHandler)) {
                            _this.documentLinesSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("DocumentLinesSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.documentLinesSelectionClearedHandler)) {
                            _this.documentLinesSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("PackingSlipSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.packingSlipSelectedHandler)) {
                            _this.packingSlipSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("PackingSlipSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.packingSlipSelectionClearedHandler)) {
                            _this.packingSlipSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("DocumentLinesLoaded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.documentLinesLoadedHandler)) {
                            _this.documentLinesLoadedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("DocumentLineUpdated", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.documentLineUpdatedHandler)) {
                            _this.documentLineUpdatedHandler(data);
                        }
                    });
                    return _this;
                }
                /**
                 * Refreshes the document lines shown on the page.
                 */
                InventoryDocumentShippingAndReceivingExtensionCommandBase.prototype.refreshDocumentLines = function () {
                    this.context.messageChannel.sendMessage("RefreshDocumentLines", undefined);
                };
                return InventoryDocumentShippingAndReceivingExtensionCommandBase;
            }(AppBarCommands_6.ExtensionCommandBase));
            exports_77("InventoryDocumentShippingAndReceivingExtensionCommandBase", InventoryDocumentShippingAndReceivingExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/MenuCommands", [], function (exports_78, context_78) {
    "use strict";
    var ExtensionMenuCommandBase;
    var __moduleName = context_78 && context_78.id;
    return {
        setters: [],
        execute: function () {
            /**
             * Represents the base class for all extension menu commands.
             * Extension menu commands are used to add aditional items to existing POS menu controls that support extensions.
             */
            ExtensionMenuCommandBase = /** @class */ (function () {
                /**
                 * Creates a new instance of the ExtensionMenuCommandBase class.
                 * @param {IExtensionMenuCommandContext<TCommandToPageMap, TPageToCommandMap>} context The command context.
                 */
                function ExtensionMenuCommandBase(context) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(context)) {
                        throw "Invalid parameters passed to the ExtensionMenuCommandBase constructor: context is a required parameter.";
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(context.messageChannel)) {
                        throw "Invalid parameters passed to the ExtensionMenuCommandBase constructor: context must contain the message channel.";
                    }
                    this.context = context;
                    this._isProcessing = false;
                    this._canExecute = false;
                    this.context.messageChannel.addMessageHandler("Initialize", function (data) {
                        _this.init(data);
                    });
                    this.context.messageChannel.addMessageHandler("Dispose", function () {
                        _this.dispose();
                    });
                    this.context.messageChannel.addMessageHandler("Execute", function () {
                        _this.execute();
                    });
                    // Start the message channel to begin receiving messages.
                    this.context.messageChannel.start();
                }
                Object.defineProperty(ExtensionMenuCommandBase.prototype, "isProcessing", {
                    /**
                     * Gets a value indicating whether or not the command is processing.
                     * @return {boolean} True if the command is processing. False otherwise.
                     */
                    get: function () {
                        return this._isProcessing;
                    },
                    /**
                     * Sets a value indicating whether or not the command is processing.
                     * @param {boolean} value True if the command is processing. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isProcessing) {
                            this._isProcessing = value;
                            this.context.messageChannel.sendMessage("IsProcessingChanged", this._isProcessing);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExtensionMenuCommandBase.prototype, "canExecute", {
                    /**
                     * Gets a value indicating whether or not the command is processing.
                     * @return {boolean} True if the command can execute. False otherwise.
                     */
                    get: function () {
                        return this._canExecute;
                    },
                    /**
                     * Sets a value indicating whether or not the command can execute.
                     * @param {boolean} value True if the command can execute. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._canExecute) {
                            this._canExecute = value;
                            this.context.messageChannel.sendMessage("CanExecuteChanged", this._canExecute);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Disposes the command releasing its resources.
                 */
                ExtensionMenuCommandBase.prototype.dispose = function () {
                    Commerce.ObjectExtensions.disposeAllProperties(this);
                };
                return ExtensionMenuCommandBase;
            }());
            exports_78("ExtensionMenuCommandBase", ExtensionMenuCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/InventoryLookupMatrixView", ["PosApi/Extend/Views/MenuCommands"], function (exports_79, context_79) {
    "use strict";
    var MenuCommands_1, InventoryLookupMatrixExtensionMenuCommandBase;
    var __moduleName = context_79 && context_79.id;
    return {
        setters: [
            function (MenuCommands_1_1) {
                MenuCommands_1 = MenuCommands_1_1;
            }
        ],
        execute: function () {
            /* tslint:enable:max-line-length */
            /**
             * Represents the base class for all extension menu commands on the InventoryLookupMatrixView.
             */
            InventoryLookupMatrixExtensionMenuCommandBase = /** @class */ (function (_super) {
                __extends(InventoryLookupMatrixExtensionMenuCommandBase, _super);
                /**
                 * Creates a new instance of the InventoryLookupMatrixExtensionMenuCommandBase class.
                 * @param {IInventoryLookupMatrixExtensionMenuCommandContext} context The menu command context.
                 * @remarks All commands added to the inventory lookup matrix page should derive from this class.
                 */
                function InventoryLookupMatrixExtensionMenuCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("Initialize", function (data) {
                        _this.init(data);
                    });
                    _this.context.messageChannel.addMessageHandler("ItemAvailabilitySelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.itemAvailabilitySelectedHandler)) {
                            _this.itemAvailabilitySelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("StoreChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.itemAvailabilitySelectedHandler)) {
                            _this.storeChangedHandler(data);
                        }
                    });
                    return _this;
                }
                return InventoryLookupMatrixExtensionMenuCommandBase;
            }(MenuCommands_1.ExtensionMenuCommandBase));
            exports_79("InventoryLookupMatrixExtensionMenuCommandBase", InventoryLookupMatrixExtensionMenuCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/InventoryLookupView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_80, context_80) {
    "use strict";
    var AppBarCommands_7, InventoryLookupExtensionCommandBase;
    var __moduleName = context_80 && context_80.id;
    return {
        setters: [
            function (AppBarCommands_7_1) {
                AppBarCommands_7 = AppBarCommands_7_1;
            }
        ],
        execute: function () {
            InventoryLookupExtensionCommandBase = /** @class */ (function (_super) {
                __extends(InventoryLookupExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the InventoryLookupExtensionCommandBase class.
                 * @param {IInventoryLookupExtensionCommandContext} context The command context.
                 * @remarks All commands added to the inventory lookup page should derive from this class.
                 */
                function InventoryLookupExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("ProductChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.productChangedHandler)) {
                            _this.productChangedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("LocationSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.locationSelectionHandler)) {
                            _this.locationSelectionHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("LocationSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.locationSelectionClearedHandler)) {
                            _this.locationSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                return InventoryLookupExtensionCommandBase;
            }(AppBarCommands_7.ExtensionCommandBase));
            exports_80("InventoryLookupExtensionCommandBase", InventoryLookupExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/ManageShiftsView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_81, context_81) {
    "use strict";
    var AppBarCommands_8, ManageShiftsExtensionCommandBase;
    var __moduleName = context_81 && context_81.id;
    return {
        setters: [
            function (AppBarCommands_8_1) {
                AppBarCommands_8 = AppBarCommands_8_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the  ManageShifts page.
             * @remarks All commands added to the  ManageShifts page should derive from this class.
             */
            ManageShiftsExtensionCommandBase = /** @class */ (function (_super) {
                __extends(ManageShiftsExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the ManageShiftsExtensionCommandBase class.
                 * @param {IManageShiftsExtensionCommandContext} context The command context.
                 */
                function ManageShiftsExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("ShiftSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.shiftSelectedHandler)) {
                            _this.shiftSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("ShiftSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.shiftSelectionClearedHandler)) {
                            _this.shiftSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                /**
                 * Refreshes the shifts shown on the page.
                 */
                ManageShiftsExtensionCommandBase.prototype.refreshShifts = function () {
                    this.context.messageChannel.sendMessage("RefreshShifts", undefined);
                };
                return ManageShiftsExtensionCommandBase;
            }(AppBarCommands_8.ExtensionCommandBase));
            exports_81("ManageShiftsExtensionCommandBase", ManageShiftsExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/PaymentView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_82, context_82) {
    "use strict";
    var AppBarCommands_9, PaymentViewExtensionCommandBase;
    var __moduleName = context_82 && context_82.id;
    return {
        setters: [
            function (AppBarCommands_9_1) {
                AppBarCommands_9 = AppBarCommands_9_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the customer add/edit page.
             * @remarks All commands added to the customer add/edit page should derive from this class.
             */
            PaymentViewExtensionCommandBase = /** @class */ (function (_super) {
                __extends(PaymentViewExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the PaymentExtensionCommandBase class.
                 * @param {IPaymentExtensionCommandContext} context The command context.
                 */
                function PaymentViewExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("PaymentCardChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.paymentViewPaymentCardChangedHandler)) {
                            _this.paymentViewPaymentCardChangedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("PaymentAmountChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.paymentViewAmountChangedHandler)) {
                            _this.paymentViewAmountChangedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("GiftCardBalanceChecked", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.giftCardBalanceCheckedHandler)) {
                            _this.giftCardBalanceCheckedHandler(data);
                        }
                    });
                    return _this;
                }
                /**
                 * Updates the payment amount shown on the page.
                 * @param {UpdatePaymentAmountData} data The new payment amount data.
                 */
                PaymentViewExtensionCommandBase.prototype.updatePaymentAmount = function (data) {
                    this.context.messageChannel.sendMessage("UpdatePaymentAmount", data);
                };
                return PaymentViewExtensionCommandBase;
            }(AppBarCommands_9.ExtensionCommandBase));
            exports_82("PaymentViewExtensionCommandBase", PaymentViewExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/PickingAndReceivingDetailsView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_83, context_83) {
    "use strict";
    var AppBarCommands_10, PickingAndReceivingDetailsExtensionCommandBase;
    var __moduleName = context_83 && context_83.id;
    return {
        setters: [
            function (AppBarCommands_10_1) {
                AppBarCommands_10 = AppBarCommands_10_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the picking and receiving details page.
             * @remarks All commands added to the picking and receiving details page should derive from this class.
             */
            PickingAndReceivingDetailsExtensionCommandBase = /** @class */ (function (_super) {
                __extends(PickingAndReceivingDetailsExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the PickingAndReceivingDetailsExtensionCommandBase class.
                 * @param {IPickingAndReceivingDetailsExtensionCommandContext} context The command context.
                 */
                function PickingAndReceivingDetailsExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("JournalSaved", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalSavedHandler)) {
                            _this.journalSavedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("JournalLineSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalLineSelectedHandler)) {
                            _this.journalLineSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("JournalLineSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalLineSelectionClearedHandler)) {
                            _this.journalLineSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("JournalLinesChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalLinesChangedHandler)) {
                            _this.journalLinesChangedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("ReceiptSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.receiptSelectionHandler)) {
                            _this.receiptSelectionHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("ReceiptSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.receiptSelectionClearedHandler)) {
                            _this.receiptSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                return PickingAndReceivingDetailsExtensionCommandBase;
            }(AppBarCommands_10.ExtensionCommandBase));
            exports_83("PickingAndReceivingDetailsExtensionCommandBase", PickingAndReceivingDetailsExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/PriceCheckView", ["PosApi/Extend/Views/AppBarCommands", "PosApi/Extend/Views/CustomControls"], function (exports_84, context_84) {
    "use strict";
    var AppBarCommands_11, CustomControls_5, PriceCheckExtensionCommandBase, PriceCheckCustomControlBase;
    var __moduleName = context_84 && context_84.id;
    return {
        setters: [
            function (AppBarCommands_11_1) {
                AppBarCommands_11 = AppBarCommands_11_1;
            },
            function (CustomControls_5_1) {
                CustomControls_5 = CustomControls_5_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the price check page.
             * @remarks All commands added to the customer price check page should derive from this class.
             */
            PriceCheckExtensionCommandBase = /** @class */ (function (_super) {
                __extends(PriceCheckExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the PriceCheckExtensionCommandBase class.
                 * @param {IPriceCheckExtensionCommandContext} context The command context.
                 */
                function PriceCheckExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("PriceCheckCompleted", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.priceCheckCompletedHandler)) {
                            _this.priceCheckCompletedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("CustomerChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.customerChangedHandler)) {
                            _this.customerChangedHandler(data);
                        }
                    });
                    return _this;
                }
                return PriceCheckExtensionCommandBase;
            }(AppBarCommands_11.ExtensionCommandBase));
            exports_84("PriceCheckExtensionCommandBase", PriceCheckExtensionCommandBase);
            /**
             * Represents the base class for all extension controls on the price check view page.
             * @remarks Custom controls in extensions should derive from this class.
             */
            PriceCheckCustomControlBase = /** @class */ (function (_super) {
                __extends(PriceCheckCustomControlBase, _super);
                /**
                 * Creates a new instance of the PriceCheckCustomControlBase class.
                 * @param {string} id The control identifier.
                 * @param {IPriceCheckCustomControlContext} context The control context.
                 */
                function PriceCheckCustomControlBase(id, context) {
                    var _this = _super.call(this, id, context) || this;
                    _this.context.messageChannel.addMessageHandler("Initialize", function (state) {
                        if (Commerce.ObjectExtensions.isFunction(_this.init)) {
                            _this.init(state);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("PriceCheckCompleted", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.priceCheckCompletedHandler)) {
                            _this.priceCheckCompletedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("CustomerChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.customerChangedHandler)) {
                            _this.customerChangedHandler(data);
                        }
                    });
                    _this._isVisible = false;
                    return _this;
                }
                Object.defineProperty(PriceCheckCustomControlBase.prototype, "isVisible", {
                    /**
                     * Gets a value indicating whether or not the custom control is visible.
                     * @return {boolean} True if the custom control is visible. False otherwise.
                     */
                    get: function () {
                        return this._isVisible;
                    },
                    /**
                     * Sets a value indicating whether or not the custom control is visible.
                     * @param {boolean} value True if the custom control is visible. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isVisible) {
                            this._isVisible = value;
                            this.context.messageChannel.sendMessage("VisibilityChanged", this._isVisible);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return PriceCheckCustomControlBase;
            }(CustomControls_5.CustomControlBase));
            exports_84("PriceCheckCustomControlBase", PriceCheckCustomControlBase);
        }
    };
});
System.register("PosApi/Extend/Views/ReportDetailsView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_85, context_85) {
    "use strict";
    var AppBarCommands_12, ReportDetailsExtensionCommandBase;
    var __moduleName = context_85 && context_85.id;
    return {
        setters: [
            function (AppBarCommands_12_1) {
                AppBarCommands_12 = AppBarCommands_12_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the report details page.
             * @remarks All commands added to the report details page should derive from this class.
             */
            ReportDetailsExtensionCommandBase = /** @class */ (function (_super) {
                __extends(ReportDetailsExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the ReportDetailsExtensionCommandBase class.
                 * @param {IReportDetailsExtensionCommandContext} context The command context.
                 */
                function ReportDetailsExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("ReportDataLoadedData", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.reportDataLoadedDataHandler)) {
                            _this.reportDataLoadedDataHandler(data);
                        }
                    });
                    return _this;
                }
                return ReportDetailsExtensionCommandBase;
            }(AppBarCommands_12.ExtensionCommandBase));
            exports_85("ReportDetailsExtensionCommandBase", ReportDetailsExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/ResumeCartView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_86, context_86) {
    "use strict";
    var AppBarCommands_13, ResumeCartExtensionCommandBase;
    var __moduleName = context_86 && context_86.id;
    return {
        setters: [
            function (AppBarCommands_13_1) {
                AppBarCommands_13 = AppBarCommands_13_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the resume cart page.
             * @remarks All commands added to the resume cart page should derive from this class.
             */
            ResumeCartExtensionCommandBase = /** @class */ (function (_super) {
                __extends(ResumeCartExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the ResumeCartExtensionCommandBase class.
                 * @param {IResumeCartExtensionCommandContext} context The command context.
                 */
                function ResumeCartExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("SuspendedCartsSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.suspendedCartsSelectedHandler)) {
                            _this.suspendedCartsSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("SuspendedCartsSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.suspendedCartsSelectionClearedHandler)) {
                            _this.suspendedCartsSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                return ResumeCartExtensionCommandBase;
            }(AppBarCommands_13.ExtensionCommandBase));
            exports_86("ResumeCartExtensionCommandBase", ResumeCartExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/ReturnTransactionView", ["PosApi/Extend/Views/AppBarCommands", "PosApi/Extend/Views/CustomGridItemSubfield"], function (exports_87, context_87) {
    "use strict";
    var AppBarCommands_14, CustomGridItemSubfield_2, ReturnTransactionExtensionCommandBase, CustomSalesOrderLinesGridItemSubfieldBase;
    var __moduleName = context_87 && context_87.id;
    return {
        setters: [
            function (AppBarCommands_14_1) {
                AppBarCommands_14 = AppBarCommands_14_1;
            },
            function (CustomGridItemSubfield_2_1) {
                CustomGridItemSubfield_2 = CustomGridItemSubfield_2_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the return transaction page.
             * @remarks All commands added to the return transaction page should derive from this class.
             */
            ReturnTransactionExtensionCommandBase = /** @class */ (function (_super) {
                __extends(ReturnTransactionExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the ReturnTransactionExtensionCommandBase class.
                 * @param {IReturnTransactionExtensionCommandContext} context The command context.
                 */
                function ReturnTransactionExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("TransactionLineSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.transactionLineSelectedHandler)) {
                            _this.transactionLineSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("TransactionLineSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.transactionLineSelectionClearedHandler)) {
                            _this.transactionLineSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("TransactionSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.transactionSelectedHandler)) {
                            _this.transactionSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("TransactionSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.transactionSelectionClearedHandler)) {
                            _this.transactionSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                return ReturnTransactionExtensionCommandBase;
            }(AppBarCommands_14.ExtensionCommandBase));
            exports_87("ReturnTransactionExtensionCommandBase", ReturnTransactionExtensionCommandBase);
            /**
             * The base class for lines grid custom column extension.
             */
            CustomSalesOrderLinesGridItemSubfieldBase = /** @class */ (function (_super) {
                __extends(CustomSalesOrderLinesGridItemSubfieldBase, _super);
                function CustomSalesOrderLinesGridItemSubfieldBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CustomSalesOrderLinesGridItemSubfieldBase;
            }(CustomGridItemSubfield_2.CustomGridItemSubfieldBase));
            exports_87("CustomSalesOrderLinesGridItemSubfieldBase", CustomSalesOrderLinesGridItemSubfieldBase);
        }
    };
});
System.register("PosApi/Extend/Views/SalesInvoiceDetailsView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_88, context_88) {
    "use strict";
    var AppBarCommands_15, SalesInvoiceDetailsExtensionCommandBase;
    var __moduleName = context_88 && context_88.id;
    return {
        setters: [
            function (AppBarCommands_15_1) {
                AppBarCommands_15 = AppBarCommands_15_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the sales invoice details page.
             * @remarks All commands added to the SalesInvoiceDetails page should derive from this class.
             */
            SalesInvoiceDetailsExtensionCommandBase = /** @class */ (function (_super) {
                __extends(SalesInvoiceDetailsExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the SalesInvoiceDetailsExtensionCommandBase class.
                 * @param {ISalesInvoiceDetailsExtensionCommandContext} context The command context.
                 */
                function SalesInvoiceDetailsExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("InvoiceLinesSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.invoiceLinesSelectionHandler)) {
                            _this.invoiceLinesSelectionHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("InvoiceLineSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.invoiceLineSelectionClearedHandler)) {
                            _this.invoiceLineSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                return SalesInvoiceDetailsExtensionCommandBase;
            }(AppBarCommands_15.ExtensionCommandBase));
            exports_88("SalesInvoiceDetailsExtensionCommandBase", SalesInvoiceDetailsExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/SalesInvoicesView", [], function (exports_89, context_89) {
    "use strict";
    var __moduleName = context_89 && context_89.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("PosApi/Extend/Views/SearchOrdersView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_90, context_90) {
    "use strict";
    var AppBarCommands_16, SearchOrdersExtensionCommandBase;
    var __moduleName = context_90 && context_90.id;
    return {
        setters: [
            function (AppBarCommands_16_1) {
                AppBarCommands_16 = AppBarCommands_16_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the search orders page.
             * @remarks All commands added to the search orders page should derive from this class.
             */
            SearchOrdersExtensionCommandBase = /** @class */ (function (_super) {
                __extends(SearchOrdersExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the SearchOrdersExtensionCommandBase class.
                 * @param {ISearchOrdersExtensionCommandContext} context The command context.
                 */
                function SearchOrdersExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("OrderSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.orderSelectionHandler)) {
                            _this.orderSelectionHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("OrderSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.orderSelectionClearedHandler)) {
                            _this.orderSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                return SearchOrdersExtensionCommandBase;
            }(AppBarCommands_16.ExtensionCommandBase));
            exports_90("SearchOrdersExtensionCommandBase", SearchOrdersExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/SearchPickingAndReceivingView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_91, context_91) {
    "use strict";
    var AppBarCommands_17, SearchPickingAndReceivingExtensionCommandBase;
    var __moduleName = context_91 && context_91.id;
    return {
        setters: [
            function (AppBarCommands_17_1) {
                AppBarCommands_17 = AppBarCommands_17_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the search picking and receiving page.
             * @remarks All commands added to the search picking and receiving page should derive from this class.
             */
            SearchPickingAndReceivingExtensionCommandBase = /** @class */ (function (_super) {
                __extends(SearchPickingAndReceivingExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the SearchPickingAndReceivingExtensionCommandBase class.
                 * @param {ISearchPickingAndReceivingExtensionCommandContext} context The command context.
                 */
                function SearchPickingAndReceivingExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("OrderLineSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.orderLineSelectedHandler)) {
                            _this.orderLineSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("OrderLineSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.orderLineSelectionClearedHandler)) {
                            _this.orderLineSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                /**
                 * Refreshes the orders shown on the page.
                 */
                SearchPickingAndReceivingExtensionCommandBase.prototype.refreshOrders = function () {
                    this.context.messageChannel.sendMessage("RefreshOrders", undefined);
                };
                return SearchPickingAndReceivingExtensionCommandBase;
            }(AppBarCommands_17.ExtensionCommandBase));
            exports_91("SearchPickingAndReceivingExtensionCommandBase", SearchPickingAndReceivingExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/SearchStockCountView", [], function (exports_92, context_92) {
    "use strict";
    var __moduleName = context_92 && context_92.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("PosApi/Extend/Views/SearchView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_93, context_93) {
    "use strict";
    var AppBarCommands_18, ProductSearchExtensionCommandBase, CustomerSearchExtensionCommandBase;
    var __moduleName = context_93 && context_93.id;
    return {
        setters: [
            function (AppBarCommands_18_1) {
                AppBarCommands_18 = AppBarCommands_18_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all product search extension commands on the search page.
             * @remarks All product search commands added to the search page should derive from this class.
             */
            ProductSearchExtensionCommandBase = /** @class */ (function (_super) {
                __extends(ProductSearchExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the ProductSearchExtensionCommandBase class.
                 * @param {IExtensionCommandContext<IProductSearchToExtensionCommandMessageTypeMap>} context The command context.
                 */
                function ProductSearchExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("SearchResultsLoaded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.searchResultsLoadedHandler)) {
                            _this.searchResultsLoadedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("SearchResultSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.searchResultsSelectedHandler)) {
                            _this.searchResultsSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("SearchResultSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.searchResultSelectionClearedHandler)) {
                            _this.searchResultSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                return ProductSearchExtensionCommandBase;
            }(AppBarCommands_18.ExtensionCommandBase));
            exports_93("ProductSearchExtensionCommandBase", ProductSearchExtensionCommandBase);
            /**
             * Represents the base class for all customer search extension commands on the search page.
             * @remarks All customer search commands added to the search page should derive from this class.
             */
            CustomerSearchExtensionCommandBase = /** @class */ (function (_super) {
                __extends(CustomerSearchExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the CustomerSearchExtensionCommandBase class.
                 * @param {IExtensionCommandContext<ICustomerSearchToExtensionCommandMessageTypeMap>} context The command context.
                 */
                function CustomerSearchExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("SearchResultsLoaded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.searchResultsLoadedHandler)) {
                            _this.searchResultsLoadedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("SearchResultSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.searchResultsSelectedHandler)) {
                            _this.searchResultsSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("SearchResultSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.searchResultSelectionClearedHandler)) {
                            _this.searchResultSelectionClearedHandler();
                        }
                    });
                    return _this;
                }
                return CustomerSearchExtensionCommandBase;
            }(AppBarCommands_18.ExtensionCommandBase));
            exports_93("CustomerSearchExtensionCommandBase", CustomerSearchExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/ShippingMethodsView", ["PosApi/Extend/Views/ViewControllers"], function (exports_94, context_94) {
    "use strict";
    var ViewControllers_2, ShippingMethodsExtensionViewControllerBase;
    var __moduleName = context_94 && context_94.id;
    return {
        setters: [
            function (ViewControllers_2_1) {
                ViewControllers_2 = ViewControllers_2_1;
            }
        ],
        execute: function () {
            /**
             * Represents the extension's shipping method view controller base class.
             * @remarks All view controller extensions for the cart view should derive from this class.
             */
            ShippingMethodsExtensionViewControllerBase = /** @class */ (function (_super) {
                __extends(ShippingMethodsExtensionViewControllerBase, _super);
                /**
                 * Creates a new instance of the ShippingMethodsExtensionViewControllerBase class.
                 * @param {IExtensionShippingMethodsViewControllerContext} context The view controller context.
                 */
                function ShippingMethodsExtensionViewControllerBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("ShippingAddressUpdated", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.shippingAddressUpdatedHandler)) {
                            _this.shippingAddressUpdatedHandler(data);
                        }
                    });
                    return _this;
                }
                Object.defineProperty(ShippingMethodsExtensionViewControllerBase.prototype, "shippingAddress", {
                    /**
                     * Gets the shipping address.
                     * @return {Address} The shipping address.
                     */
                    get: function () {
                        return Commerce.ObjectExtensions.clone(this._shippingAddress);
                    },
                    /**
                     * Sets the shipping address.
                     * @param {Address} value Sets the shipping address and notifies the shipping methods view of the change.
                     */
                    set: function (value) {
                        if (Commerce.StringExtensions.compare(JSON.stringify(value), JSON.stringify(this._shippingAddress), false) !== 0) {
                            this._shippingAddress = value;
                            var data = { shippingAddress: this._shippingAddress };
                            this.context.messageChannel.sendMessage("ShippingAddressChanged", data);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return ShippingMethodsExtensionViewControllerBase;
            }(ViewControllers_2.ExtensionViewControllerBase));
            exports_94("ShippingMethodsExtensionViewControllerBase", ShippingMethodsExtensionViewControllerBase);
        }
    };
});
System.register("PosApi/Extend/Views/ShowJournalView", ["PosApi/Extend/Views/AppBarCommands", "PosApi/Extend/Views/CustomGridItemSubfield"], function (exports_95, context_95) {
    "use strict";
    var AppBarCommands_19, CustomGridItemSubfield_3, ShowJournalExtensionCommandBase, CustomLinesGridItemSubfieldBase, CustomPaymentsGridItemSubfieldBase;
    var __moduleName = context_95 && context_95.id;
    return {
        setters: [
            function (AppBarCommands_19_1) {
                AppBarCommands_19 = AppBarCommands_19_1;
            },
            function (CustomGridItemSubfield_3_1) {
                CustomGridItemSubfield_3 = CustomGridItemSubfield_3_1;
            }
        ],
        execute: function () {
            ShowJournalExtensionCommandBase = /** @class */ (function (_super) {
                __extends(ShowJournalExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the ShowJournalExtensionCommandBase class.
                 * @param {IExtensionCommandContext<IShowJournalToExtensionCommandMessageTypeMap>} context The command context.
                 * @remarks All commands added to the show journal page should derive from this class.
                 */
                function ShowJournalExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("JournalSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalSelectionHandler)) {
                            _this.journalSelectionHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("JournalSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalSelectionClearedHandler)) {
                            _this.journalSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("ReceiptSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.receiptSelectionHandler)) {
                            _this.receiptSelectionHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("ReceiptSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.receiptSelectionClearedHandler)) {
                            _this.receiptSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("JournalTransactionsLoaded", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalTransactionsLoadedHandler)) {
                            _this.journalTransactionsLoadedHandler(data);
                        }
                    });
                    return _this;
                }
                return ShowJournalExtensionCommandBase;
            }(AppBarCommands_19.ExtensionCommandBase));
            exports_95("ShowJournalExtensionCommandBase", ShowJournalExtensionCommandBase);
            /**
             * The base class for lines grid custom column extension.
             */
            CustomLinesGridItemSubfieldBase = /** @class */ (function (_super) {
                __extends(CustomLinesGridItemSubfieldBase, _super);
                function CustomLinesGridItemSubfieldBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CustomLinesGridItemSubfieldBase;
            }(CustomGridItemSubfield_3.CustomGridItemSubfieldBase));
            exports_95("CustomLinesGridItemSubfieldBase", CustomLinesGridItemSubfieldBase);
            /**
             * The base class for payments grid custom column extension.
             */
            CustomPaymentsGridItemSubfieldBase = /** @class */ (function (_super) {
                __extends(CustomPaymentsGridItemSubfieldBase, _super);
                function CustomPaymentsGridItemSubfieldBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CustomPaymentsGridItemSubfieldBase;
            }(CustomGridItemSubfield_3.CustomGridItemSubfieldBase));
            exports_95("CustomPaymentsGridItemSubfieldBase", CustomPaymentsGridItemSubfieldBase);
        }
    };
});
System.register("PosApi/Extend/Views/SimpleProductDetailsView", ["PosApi/Extend/Views/AppBarCommands", "PosApi/Extend/Views/CustomControls"], function (exports_96, context_96) {
    "use strict";
    var AppBarCommands_20, CustomControls_6, SimpleProductDetailsExtensionCommandBase, SimpleProductDetailsCustomControlBase;
    var __moduleName = context_96 && context_96.id;
    return {
        setters: [
            function (AppBarCommands_20_1) {
                AppBarCommands_20 = AppBarCommands_20_1;
            },
            function (CustomControls_6_1) {
                CustomControls_6 = CustomControls_6_1;
            }
        ],
        execute: function () {
            SimpleProductDetailsExtensionCommandBase = /** @class */ (function (_super) {
                __extends(SimpleProductDetailsExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the SimpleProductDetailsExtensionCommandBase class.
                 * @param {IExtensionCommandContext<ISimpleProductDetailsToExtensionCommandMessageTypeMap>} context The command context.
                 * @remarks All commands added to the simple product details page should derive from this class.
                 */
                function SimpleProductDetailsExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("ProductChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.productChangedHandler)) {
                            _this.productChangedHandler(data);
                        }
                    });
                    return _this;
                }
                return SimpleProductDetailsExtensionCommandBase;
            }(AppBarCommands_20.ExtensionCommandBase));
            exports_96("SimpleProductDetailsExtensionCommandBase", SimpleProductDetailsExtensionCommandBase);
            /**
             * Represents the base class for all extension controls on the simple product details page.
             * @remarks Custom controls in extensions should derive from this class.
             */
            SimpleProductDetailsCustomControlBase = /** @class */ (function (_super) {
                __extends(SimpleProductDetailsCustomControlBase, _super);
                /**
                 * Creates a new instance of the SimpleProductDetailsCustomControlBase class.
                 * @param {string} id The control identifier.
                 * @param {ISimpleProductDetailsCustomControlContext} context The control context.
                 */
                function SimpleProductDetailsCustomControlBase(id, context) {
                    var _this = _super.call(this, id, context) || this;
                    _this.context.messageChannel.addMessageHandler("ProductChanged", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.productChangedHandler)) {
                            _this.productChangedHandler(data);
                        }
                    });
                    _this._isVisible = false;
                    return _this;
                }
                Object.defineProperty(SimpleProductDetailsCustomControlBase.prototype, "isVisible", {
                    /**
                     * Gets a value indicating whether or not the custom control is visible.
                     * @return {boolean} True if the custom control is visible. False otherwise.
                     */
                    get: function () {
                        return this._isVisible;
                    },
                    /**
                     * Sets a value indicating whether or not the custom control is visible.
                     * @param {boolean} value True if the custom control is visble. False otherwise.
                     */
                    set: function (value) {
                        if (value !== this._isVisible) {
                            this._isVisible = value;
                            this.context.messageChannel.sendMessage("VisibilityChanged", this._isVisible);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return SimpleProductDetailsCustomControlBase;
            }(CustomControls_6.CustomControlBase));
            exports_96("SimpleProductDetailsCustomControlBase", SimpleProductDetailsCustomControlBase);
        }
    };
});
System.register("PosApi/Extend/Views/StockCountDetailsView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_97, context_97) {
    "use strict";
    var AppBarCommands_21, StockCountDetailsExtensionCommandBase;
    var __moduleName = context_97 && context_97.id;
    return {
        setters: [
            function (AppBarCommands_21_1) {
                AppBarCommands_21 = AppBarCommands_21_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the stock count details page.
             * @remarks All commands added to the stock count details page should derive from this class.
             */
            StockCountDetailsExtensionCommandBase = /** @class */ (function (_super) {
                __extends(StockCountDetailsExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the StockCountDetailsExtensionCommandBase class.
                 * @param {IStockCountDetailsExtensionCommandContext} context The command context.
                 */
                function StockCountDetailsExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("JournalLineSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalLineSelectedHandler)) {
                            _this.journalLineSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("JournalLineSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalLineSelectionClearedHandler)) {
                            _this.journalLineSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("JournalLinesUpdated", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalLinesUpdatedHandler)) {
                            _this.journalLinesUpdatedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("JournalSaved", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.journalSavedHandler)) {
                            _this.journalSavedHandler(data);
                        }
                    });
                    return _this;
                }
                return StockCountDetailsExtensionCommandBase;
            }(AppBarCommands_21.ExtensionCommandBase));
            exports_97("StockCountDetailsExtensionCommandBase", StockCountDetailsExtensionCommandBase);
        }
    };
});
System.register("PosApi/Extend/Views/TransferOrderDetailsView", ["PosApi/Extend/Views/AppBarCommands"], function (exports_98, context_98) {
    "use strict";
    var AppBarCommands_22, TransferOrderDetailsExtensionCommandBase;
    var __moduleName = context_98 && context_98.id;
    return {
        setters: [
            function (AppBarCommands_22_1) {
                AppBarCommands_22 = AppBarCommands_22_1;
            }
        ],
        execute: function () {
            /**
             * Represents the base class for all extension commands on the transfer order details page.
             * @remarks All commands added to the transfer order details page should derive from this class.
             */
            TransferOrderDetailsExtensionCommandBase = /** @class */ (function (_super) {
                __extends(TransferOrderDetailsExtensionCommandBase, _super);
                /**
                 * Creates a new instance of the TransferOrderDetailsExtensionCommandBase class.
                 * @param {ITransferOrderDetailsExtensionCommandContext} context The command context.
                 */
                function TransferOrderDetailsExtensionCommandBase(context) {
                    var _this = _super.call(this, context) || this;
                    _this.context.messageChannel.addMessageHandler("TransferOrderLineSelected", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.transferOrderLineSelectedHandler)) {
                            _this.transferOrderLineSelectedHandler(data);
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("TransferOrderLineSelectionCleared", function () {
                        if (Commerce.ObjectExtensions.isFunction(_this.transferOrderLineSelectionClearedHandler)) {
                            _this.transferOrderLineSelectionClearedHandler();
                        }
                    });
                    _this.context.messageChannel.addMessageHandler("TransferOrderUpdated", function (data) {
                        if (Commerce.ObjectExtensions.isFunction(_this.transferOrderUpdatedHandler)) {
                            _this.transferOrderUpdatedHandler(data);
                        }
                    });
                    return _this;
                }
                /**
                 * Refreshes the transfer order details shown on the page.
                 */
                TransferOrderDetailsExtensionCommandBase.prototype.refreshTransferOrderDetails = function () {
                    this.context.messageChannel.sendMessage("RefreshTransferOrderDetails", undefined);
                };
                return TransferOrderDetailsExtensionCommandBase;
            }(AppBarCommands_22.ExtensionCommandBase));
            exports_98("TransferOrderDetailsExtensionCommandBase", TransferOrderDetailsExtensionCommandBase);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIj/wYJKoZIhvcNAQcCoIIj8DCCI+wCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // NWo3XtWNHDfhA7r696OP6fSFG34VeQKHCWgahnD1v1eg
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgKXySjHScu2cn
// SIG // mYPk+UUBl8BucBegVGX0KgLxwW4jmeUwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // duWhj0d295fHgGFD6032agGUACllo5KlK+F4fz8pgVfm
// SIG // TLYOXXfX9XSfAZr1JGhRwlN8UN8+8kELI+A9eZMZ7FOx
// SIG // gQFPGZ9/axfZyObkYFF5w7Vc5Grtp0eJXmT6ymzrhE0d
// SIG // K6DHXAucAGnylVYr0wmMetjfKZDIXxUAhQJMTO70oHjf
// SIG // u7sSh1g0P5vasjs+b6pheOoq06TUgWCgBytwZRR1Qf5H
// SIG // JHfN9xf7zXW20lwG8CKuokhbS/ELDtqZn6uSt3H61PnN
// SIG // Jlxgr949zl/qEwRqtkTVESxUeSC4PqjC/T43dz0FWxZr
// SIG // hcRzGZ8YjtV2rN39KqwaNrzzRnXIvjWKFqGCEuIwghLe
// SIG // BgorBgEEAYI3AwMBMYISzjCCEsoGCSqGSIb3DQEHAqCC
// SIG // ErswghK3AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCCGWcz8NCDv0ek3
// SIG // 2HQcphfuGMFroOFo3osQY6MD/XLSeAIGXz1D0VLeGBMy
// SIG // MDIwMDgyMzA0MDI0OC4xNjFaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjpBMjQwLTRCODItMTMwRTEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjkwggTxMIID2aADAgECAhMzAAABEQ0Cnu7U
// SIG // 7QXUAAAAAAERMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTky
// SIG // MFoXDTIxMDEyMTIzMTkyMFowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOkEyNDAtNEI4Mi0xMzBFMSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoxLSghPBG2mL
// SIG // ge4MluXZlDebAaDFhVmlG/nkT99zDBud76h5FQ/nzwXX
// SIG // m1K4U1uxV3AOR5yXs+XNznWduegvYMMcDtF7JZWQVkzF
// SIG // aEUw3bDFVeoqjYmdj3O6CEjpd43Q6FEgzms6CdeL0BN2
// SIG // Cu9czEeP9fFfGfTnDEj/GqBpe2l7Z5HP7o6wJDY+h02p
// SIG // x2xv66ryp09FRRWQMDzyoiniCZWYH9daGp2O1nWMhjIf
// SIG // S8RTljZ8c2lweVpHFaPwHn8crKg8kyP4OmxZ2sdW11XW
// SIG // V/8PraXqQ0/xUEYm4WVO/YYm0JnlIHv2AfBuFwMcI33W
// SIG // TJnTH2+OC4y0cdUSNnbTLwIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFPpw3kELqHZYwxDD0AxXUN+2+QHyMB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBAI+G
// SIG // a11EmK7iBhaUXleGwZHDB2O2fnEaNKc+ebjjWT31bRsu
// SIG // Qo8MAzUS1FXu3uC43DaMTD9sz0Ql69RNNyT3OJUD7NdW
// SIG // 4RY7JVgN38z1Fq+8gTL2V8WXTKxp12gONrTBtCi4erMy
// SIG // EzOAXAuEPZoh4B0gvS4RzT7P4AJ9wmRkTWMJcbF7GCQe
// SIG // tJ6r43h9POviiTTdRtZzwhUdiGKy4OLmXcCWEzh7tllM
// SIG // MmZYdcgikTithZHXtJQUCvET3lO6sKpkwnNWEryzTfIj
// SIG // gyV1fVF6OKwWUea7iU25Q2Ws25GEE2MQ68LCIXvqXXrO
// SIG // pG7yV5cumGOIVMETjiNB4OB0FOTxRoMwggZxMIIEWaAD
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
// SIG // QTI0MC00QjgyLTEzMEUxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVAEHu5u28eifPfZuTiZaGGxtfn3THoIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi7F93MCIYDzIwMjAwODIzMTEyMjMx
// SIG // WhgPMjAyMDA4MjQxMTIyMzFaMHQwOgYKKwYBBAGEWQoE
// SIG // ATEsMCowCgIFAOLsX3cCAQAwBwIBAAICCk4wBwIBAAIC
// SIG // EZwwCgIFAOLtsPcCAQAwNgYKKwYBBAGEWQoEAjEoMCYw
// SIG // DAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgCAQAC
// SIG // AwGGoDANBgkqhkiG9w0BAQUFAAOBgQCBVFFYLMfwuTyT
// SIG // uNaWJi5Yp+yw6e2VIZh+NaghFpDTmQbD4BBApSQkFwXE
// SIG // U5cwnVJfxlNdod8IC1TUF1kwiND1fK1bw7lPtdh2ou5/
// SIG // a1fHSgdlj+4Bw+ZsckX4HE5d9xGD9VLCaZ96I/UdtETp
// SIG // cE8K4v9hFh8GxipMp//I6qVafDGCAw0wggMJAgEBMIGT
// SIG // MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAAB
// SIG // EQ0Cnu7U7QXUAAAAAAERMA0GCWCGSAFlAwQCAQUAoIIB
// SIG // SjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQwLwYJ
// SIG // KoZIhvcNAQkEMSIEIFWgKCI4CNgEyJp4uRekS5JF0lN/
// SIG // 2w+iOuu7EoUmn30LMIH6BgsqhkiG9w0BCRACLzGB6jCB
// SIG // 5zCB5DCBvQQgjj4Sr6IFHhpBoWsbQmbjf1LQ9U+A/sg8
// SIG // XDsFc+kotlswgZgwgYCkfjB8MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EgMjAxMAITMwAAARENAp7u1O0F1AAAAAABETAi
// SIG // BCB2pjMWktEVZxVOzLkQrcCV5j8Fo2ypt0lZuY12aJbG
// SIG // tzANBgkqhkiG9w0BAQsFAASCAQCQwvHcxbJ93CRyw15+
// SIG // BYnzupgN4elxr/sdxCPvwn1W7e/c8Yyu0rF3Kf2N2T5T
// SIG // CIeMxbkb9MGMXm1ssBY9fCBuOLTeLLhrlWWbquidXIxr
// SIG // ncz3zocZo9osrYr8KTb9cASj2OrhZF5FjPsWvN5teQ7D
// SIG // BXonEqPeyfKUK6zprP45q1QXqy0xhJhJXCAvmUIMjpfq
// SIG // zK8Bt7DUN+Fof3Xe9f523cGuFkxzXmfQfrJj1+4o8+65
// SIG // Ne8peqMqC4MxBYFg7I+lUF8pfHqheZi97G+O+wt95N2G
// SIG // D1Ayvwp/u86SQiJi2O9GcFX29pqK1B1q8FcVkAuZn8+b
// SIG // u5WKPMp+irhNnOlV
// SIG // End signature block
