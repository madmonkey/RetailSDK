"use strict";
var Commerce;
(function (Commerce) {
    var Client;
    (function (Client) {
        var Entities;
        (function (Entities) {
            "use strict";
            function isIFufillmentLineDetails(arg) {
                if (Commerce.ObjectExtensions.isNullOrUndefined(arg)) {
                    return false;
                }
                var argAsIFulfillmentLineDetails = arg;
                return argAsIFulfillmentLineDetails.ReasonCodeLines !== undefined &&
                    argAsIFulfillmentLineDetails.Description !== undefined &&
                    argAsIFulfillmentLineDetails.ProductName !== undefined &&
                    argAsIFulfillmentLineDetails.SalesId !== undefined &&
                    argAsIFulfillmentLineDetails.ItemId !== undefined;
            }
            Entities.isIFufillmentLineDetails = isIFufillmentLineDetails;
        })(Entities = Client.Entities || (Client.Entities = {}));
    })(Client = Commerce.Client || (Commerce.Client = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Client;
    (function (Client) {
        var Entities;
        (function (Entities) {
            var Dialogs;
            (function (Dialogs) {
                "use strict";
                var PresetDialogButtonType;
                (function (PresetDialogButtonType) {
                    PresetDialogButtonType[PresetDialogButtonType["OK"] = 0] = "OK";
                    PresetDialogButtonType[PresetDialogButtonType["CANCEL"] = 1] = "CANCEL";
                    PresetDialogButtonType[PresetDialogButtonType["YES"] = 2] = "YES";
                    PresetDialogButtonType[PresetDialogButtonType["NO"] = 3] = "NO";
                    PresetDialogButtonType[PresetDialogButtonType["RETRY"] = 4] = "RETRY";
                })(PresetDialogButtonType = Dialogs.PresetDialogButtonType || (Dialogs.PresetDialogButtonType = {}));
                var PresetResultValues;
                (function (PresetResultValues) {
                    PresetResultValues["OK"] = "OK_RESULT";
                    PresetResultValues["CANCEL"] = "CANCEL_RESULT";
                    PresetResultValues["YES"] = "YES_RESULT";
                    PresetResultValues["NO"] = "NO_RESULT";
                    PresetResultValues["RETRY"] = "RETRY_RESULT";
                })(PresetResultValues = Dialogs.PresetResultValues || (Dialogs.PresetResultValues = {}));
            })(Dialogs = Entities.Dialogs || (Entities.Dialogs = {}));
        })(Entities = Client.Entities || (Client.Entities = {}));
    })(Client = Commerce.Client || (Commerce.Client = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Client;
    (function (Client) {
        var Entities;
        (function (Entities) {
            "use strict";
        })(Entities = Client.Entities || (Client.Entities = {}));
    })(Client = Commerce.Client || (Commerce.Client = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Client;
    (function (Client) {
        var Entities;
        (function (Entities) {
            "use strict";
        })(Entities = Client.Entities || (Client.Entities = {}));
    })(Client = Commerce.Client || (Commerce.Client = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            HardwareStation.localStation = "IPC://LOCALHOST";
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var MessageType;
    (function (MessageType) {
        MessageType[MessageType["Info"] = 0] = "Info";
        MessageType[MessageType["Error"] = 1] = "Error";
    })(MessageType = Commerce.MessageType || (Commerce.MessageType = {}));
    var MessageBoxButtons;
    (function (MessageBoxButtons) {
        MessageBoxButtons[MessageBoxButtons["Default"] = 0] = "Default";
        MessageBoxButtons[MessageBoxButtons["OKCancel"] = 1] = "OKCancel";
        MessageBoxButtons[MessageBoxButtons["YesNo"] = 2] = "YesNo";
        MessageBoxButtons[MessageBoxButtons["RetryNo"] = 3] = "RetryNo";
    })(MessageBoxButtons = Commerce.MessageBoxButtons || (Commerce.MessageBoxButtons = {}));
    var DialogResult;
    (function (DialogResult) {
        DialogResult[DialogResult["Close"] = 0] = "Close";
        DialogResult[DialogResult["OK"] = 1] = "OK";
        DialogResult[DialogResult["Cancel"] = 2] = "Cancel";
        DialogResult[DialogResult["Yes"] = 3] = "Yes";
        DialogResult[DialogResult["No"] = 4] = "No";
    })(DialogResult = Commerce.DialogResult || (Commerce.DialogResult = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Operations;
    (function (Operations) {
        "use strict";
    })(Operations = Commerce.Operations || (Commerce.Operations = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Operations;
    (function (Operations) {
        "use strict";
        Operations.RetailOperation = Commerce.Proxy.Entities.RetailOperation;
    })(Operations = Commerce.Operations || (Commerce.Operations = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Operations;
    (function (Operations) {
        "use strict";
    })(Operations = Commerce.Operations || (Commerce.Operations = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Operations;
    (function (Operations) {
        "use strict";
    })(Operations = Commerce.Operations || (Commerce.Operations = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Operations;
    (function (Operations) {
        "use strict";
    })(Operations = Commerce.Operations || (Commerce.Operations = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Client;
    (function (Client) {
        var Entities;
        (function (Entities) {
            "use strict";
        })(Entities = Client.Entities || (Client.Entities = {}));
    })(Client = Commerce.Client || (Commerce.Client = {}));
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
    var Carts;
    (function (Carts) {
        "use strict";
        var AddSalesRepresentativeToCartServiceRequest = (function (_super) {
            __extends(AddSalesRepresentativeToCartServiceRequest, _super);
            function AddSalesRepresentativeToCartServiceRequest(correlationId, cart) {
                var _this = _super.call(this, correlationId) || this;
                _this.cart = cart;
                return _this;
            }
            return AddSalesRepresentativeToCartServiceRequest;
        }(Commerce.ServiceRequest));
        Carts.AddSalesRepresentativeToCartServiceRequest = AddSalesRepresentativeToCartServiceRequest;
    })(Carts = Commerce.Carts || (Commerce.Carts = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Carts;
    (function (Carts) {
        "use strict";
        var AddSalesRepresentativeToCartServiceResponse = (function (_super) {
            __extends(AddSalesRepresentativeToCartServiceResponse, _super);
            function AddSalesRepresentativeToCartServiceResponse(cart) {
                var _this = _super.call(this) || this;
                _this.cart = cart;
                return _this;
            }
            return AddSalesRepresentativeToCartServiceResponse;
        }(Commerce.ServiceResponse));
        Carts.AddSalesRepresentativeToCartServiceResponse = AddSalesRepresentativeToCartServiceResponse;
    })(Carts = Commerce.Carts || (Commerce.Carts = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var CheckUserCanOverrideReturnPolicyClientRequest = (function (_super) {
        __extends(CheckUserCanOverrideReturnPolicyClientRequest, _super);
        function CheckUserCanOverrideReturnPolicyClientRequest(correlationId, employee) {
            var _this = _super.call(this, correlationId) || this;
            _this.employee = employee;
            return _this;
        }
        return CheckUserCanOverrideReturnPolicyClientRequest;
    }(Commerce.ClientRequest));
    Commerce.CheckUserCanOverrideReturnPolicyClientRequest = CheckUserCanOverrideReturnPolicyClientRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var CheckUserCanOverrideReturnPolicyClientResponse = (function (_super) {
        __extends(CheckUserCanOverrideReturnPolicyClientResponse, _super);
        function CheckUserCanOverrideReturnPolicyClientResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CheckUserCanOverrideReturnPolicyClientResponse;
    }(Commerce.ClientResponse));
    Commerce.CheckUserCanOverrideReturnPolicyClientResponse = CheckUserCanOverrideReturnPolicyClientResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var GetCashDeclarationsMapClientRequest = (function (_super) {
        __extends(GetCashDeclarationsMapClientRequest, _super);
        function GetCashDeclarationsMapClientRequest(correlationId) {
            return _super.call(this, correlationId) || this;
        }
        return GetCashDeclarationsMapClientRequest;
    }(Commerce.ClientRequest));
    Commerce.GetCashDeclarationsMapClientRequest = GetCashDeclarationsMapClientRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var GetCashDeclarationsMapClientResponse = (function (_super) {
        __extends(GetCashDeclarationsMapClientResponse, _super);
        function GetCashDeclarationsMapClientResponse(cashDeclarationsMap) {
            var _this = _super.call(this, cashDeclarationsMap) || this;
            _this.cashDeclarationsMap = cashDeclarationsMap;
            return _this;
        }
        return GetCashDeclarationsMapClientResponse;
    }(Commerce.ClientResponse));
    Commerce.GetCashDeclarationsMapClientResponse = GetCashDeclarationsMapClientResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TenderCounting;
    (function (TenderCounting) {
        "use strict";
        var GetTenderTypeForSalesTransactionsClientRequest = (function (_super) {
            __extends(GetTenderTypeForSalesTransactionsClientRequest, _super);
            function GetTenderTypeForSalesTransactionsClientRequest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetTenderTypeForSalesTransactionsClientRequest;
        }(Commerce.ClientRequest));
        TenderCounting.GetTenderTypeForSalesTransactionsClientRequest = GetTenderTypeForSalesTransactionsClientRequest;
    })(TenderCounting = Commerce.TenderCounting || (Commerce.TenderCounting = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var TenderCounting;
    (function (TenderCounting) {
        "use strict";
        var GetTenderTypeForSalesTransactionsClientResponse = (function (_super) {
            __extends(GetTenderTypeForSalesTransactionsClientResponse, _super);
            function GetTenderTypeForSalesTransactionsClientResponse(tenderTypes) {
                var _this = _super.call(this, tenderTypes) || this;
                _this.tenderTypes = tenderTypes;
                return _this;
            }
            return GetTenderTypeForSalesTransactionsClientResponse;
        }(Commerce.ClientResponse));
        TenderCounting.GetTenderTypeForSalesTransactionsClientResponse = GetTenderTypeForSalesTransactionsClientResponse;
    })(TenderCounting = Commerce.TenderCounting || (Commerce.TenderCounting = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var HandleCartVersionErrorClientRequest = (function (_super) {
        __extends(HandleCartVersionErrorClientRequest, _super);
        function HandleCartVersionErrorClientRequest(correlationId, errors) {
            var _this = _super.call(this, correlationId) || this;
            _this.errors = errors;
            return _this;
        }
        return HandleCartVersionErrorClientRequest;
    }(Commerce.ClientRequest));
    Commerce.HandleCartVersionErrorClientRequest = HandleCartVersionErrorClientRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var HandleCartVersionErrorClientResponse = (function (_super) {
        __extends(HandleCartVersionErrorClientResponse, _super);
        function HandleCartVersionErrorClientResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return HandleCartVersionErrorClientResponse;
    }(Commerce.ClientResponse));
    Commerce.HandleCartVersionErrorClientResponse = HandleCartVersionErrorClientResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var HardwareStationRequest = (function (_super) {
                __extends(HardwareStationRequest, _super);
                function HardwareStationRequest(correlationId, hardwareStation, peripheral, action, data, timeout, suppressGlobalErrorEvent) {
                    var _this = _super.call(this, correlationId) || this;
                    _this.hardwareStation = hardwareStation;
                    _this.peripheral = peripheral;
                    _this.action = action;
                    _this.data = data || null;
                    _this.timeout = timeout || null;
                    _this.suppressGlobalErrorEvent = suppressGlobalErrorEvent || null;
                    return _this;
                }
                return HardwareStationRequest;
            }(Commerce.ClientRequest));
            HardwareStation.HardwareStationRequest = HardwareStationRequest;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var HardwareStationResponse = (function (_super) {
                __extends(HardwareStationResponse, _super);
                function HardwareStationResponse() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return HardwareStationResponse;
            }(Commerce.ClientResponse));
            HardwareStation.HardwareStationResponse = HardwareStationResponse;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var IsLocalHardwareStationSupportedClientRequest = (function (_super) {
                __extends(IsLocalHardwareStationSupportedClientRequest, _super);
                function IsLocalHardwareStationSupportedClientRequest() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return IsLocalHardwareStationSupportedClientRequest;
            }(Commerce.ClientRequest));
            HardwareStation.IsLocalHardwareStationSupportedClientRequest = IsLocalHardwareStationSupportedClientRequest;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var IsLocalHardwareStationSupportedClientResponse = (function (_super) {
                __extends(IsLocalHardwareStationSupportedClientResponse, _super);
                function IsLocalHardwareStationSupportedClientResponse() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return IsLocalHardwareStationSupportedClientResponse;
            }(Commerce.ClientResponse));
            HardwareStation.IsLocalHardwareStationSupportedClientResponse = IsLocalHardwareStationSupportedClientResponse;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var PrintDeclinedOrVoidedCardReceiptsClientRequest = (function (_super) {
        __extends(PrintDeclinedOrVoidedCardReceiptsClientRequest, _super);
        function PrintDeclinedOrVoidedCardReceiptsClientRequest(correlationId, cardTypeId, currencyCode, hardwareProfileId, isRefundOperation, paymentInfo, tenderType) {
            var _this = this;
            if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                throw new Error("Invalid option passed to constructor for PrintDeclinedOrVoidedCardReceiptsClientRequest: correlationId is null or empty.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(cardTypeId)) {
                throw new Error("Invalid option passed to constructor for PrintDeclinedOrVoidedCardReceiptsClientRequest: cardTypeId is invalid.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(currencyCode)) {
                throw new Error("Invalid option passed to constructor for PrintDeclinedOrVoidedCardReceiptsClientRequest: currencyCode is invalid.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(isRefundOperation)) {
                throw new Error("Invalid option passed to constructor for PrintDeclinedOrVoidedCardReceiptsClientRequest: isRefundOperation is invalid.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(hardwareProfileId)) {
                throw new Error("Invalid option passed to constructor for PrintDeclinedOrVoidedCardReceiptsClientRequest: hardwareProfileId is invalid.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(paymentInfo)) {
                throw new Error("Invalid option passed to constructor for PrintDeclinedOrVoidedCardReceiptsClientRequest: paymentInfo is invalid.");
            }
            else if (Commerce.StringExtensions.isNullOrWhitespace(paymentInfo.PaymentSdkData)) {
                throw new Error("Invalid option passed to constructor for PrintDeclinedOrVoidedCardReceiptsClientRequest: PaymentSdkData cannot be invalid.");
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(tenderType)) {
                throw new Error("Invalid option passed to constructor for PrintDeclinedOrVoidedCardReceiptsClientRequest: tenderType cannot be invalid.");
            }
            _this = _super.call(this, correlationId) || this;
            _this.cardTypeId = cardTypeId;
            _this.currencyCode = currencyCode;
            _this.isRefundOperation = isRefundOperation;
            _this.hardwareProfileId = hardwareProfileId;
            _this.paymentInfo = paymentInfo;
            _this.tenderType = tenderType;
            return _this;
        }
        return PrintDeclinedOrVoidedCardReceiptsClientRequest;
    }(Commerce.ClientRequest));
    Commerce.PrintDeclinedOrVoidedCardReceiptsClientRequest = PrintDeclinedOrVoidedCardReceiptsClientRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var PrintDeclinedOrVoidedCardReceiptsClientResponse = (function (_super) {
        __extends(PrintDeclinedOrVoidedCardReceiptsClientResponse, _super);
        function PrintDeclinedOrVoidedCardReceiptsClientResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return PrintDeclinedOrVoidedCardReceiptsClientResponse;
    }(Commerce.ClientResponse));
    Commerce.PrintDeclinedOrVoidedCardReceiptsClientResponse = PrintDeclinedOrVoidedCardReceiptsClientResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var ShowPresetButtonMessageDialogClientResponse = (function (_super) {
        __extends(ShowPresetButtonMessageDialogClientResponse, _super);
        function ShowPresetButtonMessageDialogClientResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ShowPresetButtonMessageDialogClientResponse;
    }(Commerce.ClientResponse));
    Commerce.ShowPresetButtonMessageDialogClientResponse = ShowPresetButtonMessageDialogClientResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var ShowPresetButtonMessageDialogClientRequest = (function (_super) {
        __extends(ShowPresetButtonMessageDialogClientRequest, _super);
        function ShowPresetButtonMessageDialogClientRequest(correlationId, options) {
            var _this = _super.call(this, correlationId) || this;
            if (Commerce.ObjectExtensions.isNullOrUndefined(options)) {
                throw new Error("ShowPresetButtonMessageDialogClientRequest: required parameter options is null or undefined.");
            }
            _this.options = options;
            return _this;
        }
        return ShowPresetButtonMessageDialogClientRequest;
    }(Commerce.ClientRequest));
    Commerce.ShowPresetButtonMessageDialogClientRequest = ShowPresetButtonMessageDialogClientRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var PrintReceiptInputClientRequest = (function (_super) {
        __extends(PrintReceiptInputClientRequest, _super);
        function PrintReceiptInputClientRequest(correlationId, receipts) {
            var _this = _super.call(this, correlationId) || this;
            _this.receipts = receipts;
            return _this;
        }
        return PrintReceiptInputClientRequest;
    }(Commerce.ClientRequest));
    Commerce.PrintReceiptInputClientRequest = PrintReceiptInputClientRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var PrintReceiptInputClientResponse = (function (_super) {
        __extends(PrintReceiptInputClientResponse, _super);
        function PrintReceiptInputClientResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return PrintReceiptInputClientResponse;
    }(Commerce.ClientResponse));
    Commerce.PrintReceiptInputClientResponse = PrintReceiptInputClientResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var SelectAllowedRefundOptionInputClientRequest = (function (_super) {
        __extends(SelectAllowedRefundOptionInputClientRequest, _super);
        function SelectAllowedRefundOptionInputClientRequest(correlationId, amountDue, allowedRefundOptions, shouldShowAllPaymentMethodsOption) {
            var _this = _super.call(this, correlationId) || this;
            _this.amountDue = amountDue;
            _this.allowedRefundOptions = allowedRefundOptions;
            _this.shouldShowAllPaymentMethodsOption = shouldShowAllPaymentMethodsOption;
            return _this;
        }
        return SelectAllowedRefundOptionInputClientRequest;
    }(Commerce.ClientRequest));
    Commerce.SelectAllowedRefundOptionInputClientRequest = SelectAllowedRefundOptionInputClientRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var SelectAllowedRefundOptionInputClientResponse = (function (_super) {
        __extends(SelectAllowedRefundOptionInputClientResponse, _super);
        function SelectAllowedRefundOptionInputClientResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SelectAllowedRefundOptionInputClientResponse;
    }(Commerce.ClientResponse));
    Commerce.SelectAllowedRefundOptionInputClientResponse = SelectAllowedRefundOptionInputClientResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var SelectLinkedRefundInputClientRequest = (function (_super) {
        __extends(SelectLinkedRefundInputClientRequest, _super);
        function SelectLinkedRefundInputClientRequest(correlationId, amountDue, tenderType, tenderLines) {
            var _this = _super.call(this, correlationId) || this;
            _this.amountDue = amountDue;
            _this.tenderType = tenderType;
            _this.tenderLines = tenderLines;
            return _this;
        }
        return SelectLinkedRefundInputClientRequest;
    }(Commerce.ClientRequest));
    Commerce.SelectLinkedRefundInputClientRequest = SelectLinkedRefundInputClientRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var SelectLinkedRefundInputClientResponse = (function (_super) {
        __extends(SelectLinkedRefundInputClientResponse, _super);
        function SelectLinkedRefundInputClientResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SelectLinkedRefundInputClientResponse;
    }(Commerce.ClientResponse));
    Commerce.SelectLinkedRefundInputClientResponse = SelectLinkedRefundInputClientResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var LegacyOperationResponse = (function (_super) {
        __extends(LegacyOperationResponse, _super);
        function LegacyOperationResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return LegacyOperationResponse;
    }(Commerce.Response));
    Commerce.LegacyOperationResponse = LegacyOperationResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var LegacyOperationRequest = (function (_super) {
        __extends(LegacyOperationRequest, _super);
        function LegacyOperationRequest(operationId, correlationId) {
            var _this = _super.call(this, operationId, correlationId) || this;
            _this.skipOperationPipeline = false;
            return _this;
        }
        return LegacyOperationRequest;
    }(Commerce.OperationRequest));
    Commerce.LegacyOperationRequest = LegacyOperationRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
        var CardPaymentRefundCaptureTokenPeripheralRequest = (function (_super) {
            __extends(CardPaymentRefundCaptureTokenPeripheralRequest, _super);
            function CardPaymentRefundCaptureTokenPeripheralRequest(correlationId, amount, captureTokenXml, paymentServiceAccountId, extensionTransactionProperties) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the CardPaymentRefundCaptureTokenPeripheralResponse constructor: "
                        + "correlationId cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(amount)) {
                    throw new Error("Invalid parameters passed to the CardPaymentRefundCaptureTokenPeripheralResponse constructor: "
                        + "amount cannot be null or undefined.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(captureTokenXml)) {
                    throw new Error("Invalid parameters passed to the CardPaymentRefundCaptureTokenPeripheralResponse constructor: "
                        + "captureTokenXml cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.amount = amount;
                _this.captureTokenXml = captureTokenXml;
                _this.paymentServiceAccountId = paymentServiceAccountId;
                _this.extensionTransactionProperties = extensionTransactionProperties;
                return _this;
            }
            return CardPaymentRefundCaptureTokenPeripheralRequest;
        }(Commerce.Request));
        Peripherals.CardPaymentRefundCaptureTokenPeripheralRequest = CardPaymentRefundCaptureTokenPeripheralRequest;
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        "use strict";
        var CardPaymentRefundCaptureTokenPeripheralResponse = (function (_super) {
            __extends(CardPaymentRefundCaptureTokenPeripheralResponse, _super);
            function CardPaymentRefundCaptureTokenPeripheralResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CardPaymentRefundCaptureTokenPeripheralResponse;
        }(Commerce.ClientResponse));
        Peripherals.CardPaymentRefundCaptureTokenPeripheralResponse = CardPaymentRefundCaptureTokenPeripheralResponse;
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var ClearPaymentTransactionReferenceDataClientRequest = (function (_super) {
                __extends(ClearPaymentTransactionReferenceDataClientRequest, _super);
                function ClearPaymentTransactionReferenceDataClientRequest(correlationId, removalReason, additionalData) {
                    var _this = _super.call(this, correlationId) || this;
                    _this.removalReason = removalReason;
                    _this.additionalData = additionalData;
                    return _this;
                }
                return ClearPaymentTransactionReferenceDataClientRequest;
            }(Commerce.ClientRequest));
            HardwareStation.ClearPaymentTransactionReferenceDataClientRequest = ClearPaymentTransactionReferenceDataClientRequest;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var ClearPaymentTransactionReferenceDataClientResponse = (function (_super) {
                __extends(ClearPaymentTransactionReferenceDataClientResponse, _super);
                function ClearPaymentTransactionReferenceDataClientResponse() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ClearPaymentTransactionReferenceDataClientResponse;
            }(Commerce.ClientResponse));
            HardwareStation.ClearPaymentTransactionReferenceDataClientResponse = ClearPaymentTransactionReferenceDataClientResponse;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var GetPaymentTransactionReferenceDataClientRequest = (function (_super) {
                __extends(GetPaymentTransactionReferenceDataClientRequest, _super);
                function GetPaymentTransactionReferenceDataClientRequest(correlationId) {
                    return _super.call(this, correlationId) || this;
                }
                return GetPaymentTransactionReferenceDataClientRequest;
            }(Commerce.ClientRequest));
            HardwareStation.GetPaymentTransactionReferenceDataClientRequest = GetPaymentTransactionReferenceDataClientRequest;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var GetPaymentTransactionReferenceDataClientResponse = (function (_super) {
                __extends(GetPaymentTransactionReferenceDataClientResponse, _super);
                function GetPaymentTransactionReferenceDataClientResponse() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return GetPaymentTransactionReferenceDataClientResponse;
            }(Commerce.ClientResponse));
            HardwareStation.GetPaymentTransactionReferenceDataClientResponse = GetPaymentTransactionReferenceDataClientResponse;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var IsHardwareStationActiveClientRequest = (function (_super) {
                __extends(IsHardwareStationActiveClientRequest, _super);
                function IsHardwareStationActiveClientRequest(correlationId) {
                    return _super.call(this, correlationId) || this;
                }
                return IsHardwareStationActiveClientRequest;
            }(Commerce.Request));
            HardwareStation.IsHardwareStationActiveClientRequest = IsHardwareStationActiveClientRequest;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var IsHardwareStationActiveClientResponse = (function (_super) {
                __extends(IsHardwareStationActiveClientResponse, _super);
                function IsHardwareStationActiveClientResponse() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return IsHardwareStationActiveClientResponse;
            }(Commerce.ClientResponse));
            HardwareStation.IsHardwareStationActiveClientResponse = IsHardwareStationActiveClientResponse;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var IsPaymentTerminalAvailableClientRequest = (function (_super) {
                __extends(IsPaymentTerminalAvailableClientRequest, _super);
                function IsPaymentTerminalAvailableClientRequest(correlationId) {
                    return _super.call(this, correlationId) || this;
                }
                return IsPaymentTerminalAvailableClientRequest;
            }(Commerce.Request));
            HardwareStation.IsPaymentTerminalAvailableClientRequest = IsPaymentTerminalAvailableClientRequest;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var IsPaymentTerminalAvailableClientResponse = (function (_super) {
                __extends(IsPaymentTerminalAvailableClientResponse, _super);
                function IsPaymentTerminalAvailableClientResponse() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return IsPaymentTerminalAvailableClientResponse;
            }(Commerce.ClientResponse));
            HardwareStation.IsPaymentTerminalAvailableClientResponse = IsPaymentTerminalAvailableClientResponse;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var SetPaymentTransactionReferenceDataClientRequest = (function (_super) {
                __extends(SetPaymentTransactionReferenceDataClientRequest, _super);
                function SetPaymentTransactionReferenceDataClientRequest(correlationId, transactionReferenceData) {
                    var _this = _super.call(this, correlationId) || this;
                    _this.transactionReferenceData = transactionReferenceData;
                    return _this;
                }
                return SetPaymentTransactionReferenceDataClientRequest;
            }(Commerce.ClientRequest));
            HardwareStation.SetPaymentTransactionReferenceDataClientRequest = SetPaymentTransactionReferenceDataClientRequest;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
            var SetPaymentTransactionReferenceDataClientResponse = (function (_super) {
                __extends(SetPaymentTransactionReferenceDataClientResponse, _super);
                function SetPaymentTransactionReferenceDataClientResponse() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return SetPaymentTransactionReferenceDataClientResponse;
            }(Commerce.ClientResponse));
            HardwareStation.SetPaymentTransactionReferenceDataClientResponse = SetPaymentTransactionReferenceDataClientResponse;
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));

// SIG // Begin signature block
// SIG // MIIj/gYJKoZIhvcNAQcCoIIj7zCCI+sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // Nn1D0nAPzkeATX6yHtZRA7KQ00JhTXjpdctad1INOcSg
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
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCASVpjE2/oiARF3BACN
// SIG // xc7QhNCQXLexI9vKVznvgJqAgTCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBWqgLz
// SIG // RA0hLKaUGPodHUdy7wUVPwglRU5lYZXxyQ5Vs9gVb8Et
// SIG // lEbaXxELT8uZsSy5sQSv+hRCo2kDld8Wu51JFzi75rlu
// SIG // b76ddSohF23RHePQGaaqswg0OBO0TqRzQQsYQ49/Rc4a
// SIG // BLaxrxVXddqtsyn0tib8f9XEbWeomL3vf3CJOnpyd7En
// SIG // XVL+HPjt073FhKopc44hbjRW3fj25Rq4SRBsgg2+8MjV
// SIG // /1huxq05rOphttn8T+8ivTo3741YvNvRF2dsWFbuUk3s
// SIG // LT/9Nz+gkKsUfC58ch8H/D0ZMrx80bMXh/SseD5Gif8L
// SIG // DzoE+hBjWJvaKxNSM0hHSf4DWpkpoYIS5TCCEuEGCisG
// SIG // AQQBgjcDAwExghLRMIISzQYJKoZIhvcNAQcCoIISvjCC
// SIG // EroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3
// SIG // DQEJEAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEIDeOJuKY9qj1MIGQTWNE
// SIG // 3uvBd6o3JxJY4F8iSK+twd+EAgZfOqnO9T8YEzIwMjAw
// SIG // ODIzMDQwMjQ1Ljg4OFowBIACAfSggdCkgc0wgcoxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29m
// SIG // dCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRo
// SIG // YWxlcyBUU1MgRVNOOkQ2QkQtRTNFNy0xNjg1MSUwIwYD
// SIG // VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNl
// SIG // oIIOPDCCBPEwggPZoAMCAQICEzMAAAEeDrzlSxaiAxsA
// SIG // AAAAAR4wDQYJKoZIhvcNAQELBQAwfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTAwHhcNMTkxMTEzMjE0MDQwWhcN
// SIG // MjEwMjExMjE0MDQwWjCByjELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3Bl
// SIG // cmF0aW9uczEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // RDZCRC1FM0U3LTE2ODUxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3
// SIG // DQEBAQUAA4IBDwAwggEKAoIBAQDOE7cYEKL89fBcrqzt
// SIG // /Bt1qpVfnrSxYwlYgs3r3C/tGlZeFEoncyqOa+RRYGQf
// SIG // W+p3AJHwCcWH+sZkONhw5raY7vnCtjtuKt8bvqNQ0aew
// SIG // xXd9utR5wWVUX5xKEezwCIfXnpwavixR+Gd6QKy91Ncv
// SIG // E8FXQVPdVhDr3FMizOqkqchyHYrj4M9LgtxbkiDycaxs
// SIG // av3X68TttcwpBcMCn2obFSZjCaUVzHbGr6EfoL03Teab
// SIG // x0WZrEe2x7QT0ZkYQBCYmJS1UXQSAVVjqb1wnMXr7+1H
// SIG // 8fHLrd1/dtM2DsR/DXwnwEoz9Z1Upreflph3d1V2IbV9
// SIG // zKOefXgp/IB2aRS7AgMBAAGjggEbMIIBFzAdBgNVHQ4E
// SIG // FgQUjBMo55F4RuBL+36bP9mvJ9pmilswHwYDVR0jBBgw
// SIG // FoAU1WM6XIoxkPNDe3xGG8UzaFqFbVUwVgYDVR0fBE8w
// SIG // TTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
// SIG // L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIw
// SIG // MTAtMDctMDEuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggr
// SIG // BgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0w
// SIG // MS5jcnQwDAYDVR0TAQH/BAIwADATBgNVHSUEDDAKBggr
// SIG // BgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEALmTcjnWW
// SIG // I5CCEyJUDSXodjSHPN2w3oiARSDvg5jI27H2hj7r9C+/
// SIG // +eMU5kfkzI9mTJ/3m1uaUyaGvWO+aGXfF6hTvyhGAQo2
// SIG // oclwuQccPqVqk+9ARrIPptCHRmGhQAyWEJujVgtWrWN/
// SIG // KtKLHH6GWIBkeExySJF2aTfu7j69cgPz5DDSvl3UmghU
// SIG // Bl1uTXUh/0MeQskhdwfJ4BKUaLO2qAAXmlQH42tRVasa
// SIG // 0qNYMdPm7xF1YQVlr1EBnvm9lUHTab0NqVF+Eu6kbn3L
// SIG // Us0ogHgWmBAmkQjWOaytaLywMIhHdwYOyp7SwaJUHx69
// SIG // cP1XNrOdoknGhUXodOHSXX4hbTCCBnEwggRZoAMCAQIC
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
// SIG // b25zMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpENkJE
// SIG // LUUzRTctMTY4NTElMCMGA1UEAxMcTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUA
// SIG // OckG4+3pqzET/o43WLrKWYzKsNyggYMwgYCkfjB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0B
// SIG // AQUFAAIFAOLsaF4wIhgPMjAyMDA4MjMxMjAwMzBaGA8y
// SIG // MDIwMDgyNDEyMDAzMFowdzA9BgorBgEEAYRZCgQBMS8w
// SIG // LTAKAgUA4uxoXgIBADAKAgEAAgIQQgIB/zAHAgEAAgIR
// SIG // kDAKAgUA4u253gIBADA2BgorBgEEAYRZCgQCMSgwJjAM
// SIG // BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAID
// SIG // AYagMA0GCSqGSIb3DQEBBQUAA4GBADtA8KWLfrDaLbzG
// SIG // 0G9j3/ISQQCt35YlnyYUTEI6GtKySEkYlySh4R1EtmF7
// SIG // TjMflM9Q/Y2ZAN7bE4ZCn9o5JTy4kW6kpWeHFwHeB00g
// SIG // +fJ4ZjlcZ2YVkfMILm+CVSovcKMejcke+oywKDUPCnjc
// SIG // r0ukh/3vOKL6Fdpc3A+xf3SfMYIDDTCCAwkCAQEwgZMw
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEe
// SIG // DrzlSxaiAxsAAAAAAR4wDQYJYIZIAWUDBAIBBQCgggFK
// SIG // MBoGCSqGSIb3DQEJAzENBgsqhkiG9w0BCRABBDAvBgkq
// SIG // hkiG9w0BCQQxIgQgJEUx/nPuVU1sjzIx2AFvF2xi166U
// SIG // ba60Hy8W2aqy9LUwgfoGCyqGSIb3DQEJEAIvMYHqMIHn
// SIG // MIHkMIG9BCBzO+RYw99xOlHlvaefPKE3cS3NJdWU8foi
// SIG // BBwPjdZfRzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABHg685UsWogMbAAAAAAEeMCIE
// SIG // IJ/0nDJktzfDgfpd5om2eBS0Sy0QY6oYcfUM2WCNFgnr
// SIG // MA0GCSqGSIb3DQEBCwUABIIBAIrj8PF8Q4v4vRArs7k7
// SIG // NpwUZiZRDYtTNL30mmo6SS71yfhtUUbhAT3jan5Ca7es
// SIG // Ag6GE4aqFkf/7UC8MPoxplNATBr22hyN3iC8pWA/gM7C
// SIG // Q5Qo46Ml1tbKNMuy1ZM36zhqLqNZivhmYBHRt9Yl/PWu
// SIG // Pz0DrVjEKcaegpLZW0HmE+lN7IoPozDr0kDyXZHe3MRV
// SIG // hZR0Ub1rHioQykYYU291rCgYBQKXwUYdWSs/bROKJjVr
// SIG // EgBxWM9WA7EKblvNVGCCIati9/IZHsjMeFpDXX3sqjLU
// SIG // EwUl0aKFH+7dz+SMR/CRCp29mhDkzUsmv18rCc99f+L2
// SIG // o9t2uAwVKSESnZw=
// SIG // End signature block
