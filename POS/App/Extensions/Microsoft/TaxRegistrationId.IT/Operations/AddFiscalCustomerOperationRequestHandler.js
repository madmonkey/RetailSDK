System.register(["PosApi/Consume/Cart", "PosApi/Create/Operations", "./AddFiscalCustomerOperationRequest", "./AddFiscalCustomerOperationResponse", "PosApi/TypeExtensions", "../Controls/FiscalCustomer/FiscalCustomerActionDialog", "PosApi/Consume/Customer", "../Controls/FiscalCustomer/EditFiscalCustomerDialog", "../TaxRegistrationIdItalyConstants", "../Controls/FiscalCustomer/ClearConfirmationDialog", "../Helpers/ExtensionPropertyHelper", "../Entities/FiscalCustomerActionType"], function (exports_1, context_1) {
    "use strict";
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
    var Cart_1, Operations_1, AddFiscalCustomerOperationRequest_1, AddFiscalCustomerOperationResponse_1, TypeExtensions_1, FiscalCustomerActionDialog_1, Customer_1, EditFiscalCustomerDialog_1, TaxRegistrationIdItalyConstants_1, ClearConfirmationDialog_1, ExtensionPropertyHelper_1, FiscalCustomerActionType_1, AddFiscalCustomerOperationRequestHandler;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Cart_1_1) {
                Cart_1 = Cart_1_1;
            },
            function (Operations_1_1) {
                Operations_1 = Operations_1_1;
            },
            function (AddFiscalCustomerOperationRequest_1_1) {
                AddFiscalCustomerOperationRequest_1 = AddFiscalCustomerOperationRequest_1_1;
            },
            function (AddFiscalCustomerOperationResponse_1_1) {
                AddFiscalCustomerOperationResponse_1 = AddFiscalCustomerOperationResponse_1_1;
            },
            function (TypeExtensions_1_1) {
                TypeExtensions_1 = TypeExtensions_1_1;
            },
            function (FiscalCustomerActionDialog_1_1) {
                FiscalCustomerActionDialog_1 = FiscalCustomerActionDialog_1_1;
            },
            function (Customer_1_1) {
                Customer_1 = Customer_1_1;
            },
            function (EditFiscalCustomerDialog_1_1) {
                EditFiscalCustomerDialog_1 = EditFiscalCustomerDialog_1_1;
            },
            function (TaxRegistrationIdItalyConstants_1_1) {
                TaxRegistrationIdItalyConstants_1 = TaxRegistrationIdItalyConstants_1_1;
            },
            function (ClearConfirmationDialog_1_1) {
                ClearConfirmationDialog_1 = ClearConfirmationDialog_1_1;
            },
            function (ExtensionPropertyHelper_1_1) {
                ExtensionPropertyHelper_1 = ExtensionPropertyHelper_1_1;
            },
            function (FiscalCustomerActionType_1_1) {
                FiscalCustomerActionType_1 = FiscalCustomerActionType_1_1;
            }
        ],
        execute: function () {
            AddFiscalCustomerOperationRequestHandler = (function (_super) {
                __extends(AddFiscalCustomerOperationRequestHandler, _super);
                function AddFiscalCustomerOperationRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AddFiscalCustomerOperationRequestHandler.prototype.supportedRequestType = function () {
                    return AddFiscalCustomerOperationRequest_1.default;
                };
                AddFiscalCustomerOperationRequestHandler.prototype.executeAsync = function (request) {
                    var correlationId = request.correlationId;
                    return this._requestFiscalCustomerDataAsync(correlationId)
                        .then(function (result) {
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new AddFiscalCustomerOperationResponse_1.default()
                        };
                    });
                };
                AddFiscalCustomerOperationRequestHandler.prototype._requestFiscalCustomerDataAsync = function (correlationId) {
                    var _this = this;
                    return this.context.runtime.executeAsync(new Cart_1.GetCurrentCartClientRequest(correlationId))
                        .then(function (response) {
                        if (response.canceled) {
                            return Promise.resolve({ canceled: true, data: null });
                        }
                        var cart = response.data.result;
                        var fiscalCustomerData = ExtensionPropertyHelper_1.default.getCartFiscalCustomerData(cart);
                        var fiscalCustomerActionDialogOptions = {
                            hasTransactionCustomer: !TypeExtensions_1.StringExtensions.isNullOrWhitespace(cart.CustomerId),
                            hasFiscalCustomer: !TypeExtensions_1.ObjectExtensions.isNullOrUndefined(fiscalCustomerData)
                        };
                        var dialog = new FiscalCustomerActionDialog_1.default();
                        return dialog.open(fiscalCustomerActionDialogOptions)
                            .then(function (result) { return _this._onFiscalCustomerActionDialogClosed(result, cart, fiscalCustomerData, correlationId); });
                    });
                };
                AddFiscalCustomerOperationRequestHandler.prototype._onFiscalCustomerActionDialogClosed = function (result, cart, fiscalCustomer, correlationId) {
                    if (result.canceled) {
                        return Promise.resolve(result);
                    }
                    var dialogResult;
                    switch (result.data.fiscalCustomerAction) {
                        case FiscalCustomerActionType_1.FiscalCustomerActionType.EnterManually:
                            dialogResult = this._editFiscalCustomerManuallyAsync(cart, fiscalCustomer, correlationId);
                            break;
                        case FiscalCustomerActionType_1.FiscalCustomerActionType.CopyFromTransactionCustomer:
                            dialogResult = this._copyFromTransactionCustomerAsync(cart, correlationId);
                            break;
                        case FiscalCustomerActionType_1.FiscalCustomerActionType.Clear:
                            dialogResult = this._clearFiscalCustomerAsync(cart, correlationId);
                            break;
                        default:
                            dialogResult = Promise.reject(new Error("'" + result.data.fiscalCustomerAction + "' is not supported."));
                    }
                    return dialogResult;
                };
                AddFiscalCustomerOperationRequestHandler.prototype._editFiscalCustomerManuallyAsync = function (cart, fiscalCustomerData, correlationId) {
                    var _this = this;
                    var options = {
                        title: this.context.resources.getString("Enter_Manually_Action_Label"),
                        subTitle: this.context.resources.getString("Edit_Fiscal_Customer_Dialog_Subtitle"),
                        fiscalCustomerData: fiscalCustomerData,
                        readOnly: false,
                        onBeforeClose: function (dialog, result) { return _this._onEditFiscalCustomerDialogBeforeClose(cart, result, correlationId); }
                    };
                    return new EditFiscalCustomerDialog_1.default().open(options).then(function (result) { return _this._onEditFiscalCustomerDialogClosed(result, correlationId); });
                };
                AddFiscalCustomerOperationRequestHandler.prototype._copyFromTransactionCustomerAsync = function (cart, correlationId) {
                    var _this = this;
                    return this.context.runtime.executeAsync(new Customer_1.GetCustomerClientRequest(cart.CustomerId, correlationId))
                        .then(function (response) {
                        if (response.canceled) {
                            return Promise.resolve(response);
                        }
                        var lotteryCode = TypeExtensions_1.StringExtensions.EMPTY;
                        var customer = response.data.result;
                        var primaryAddress = _this._getPrimaryAddress(customer);
                        if (!TypeExtensions_1.ObjectExtensions.isNullOrUndefined(primaryAddress)) {
                            var extensionPropertyValue = ExtensionPropertyHelper_1.default.getExtensionPropertyByName(primaryAddress.ExtensionProperties, TaxRegistrationIdItalyConstants_1.default.CUSTOMER_TAX_REGISTRATION_EXTENSION_PROPERTY_NAME);
                            if (!TypeExtensions_1.ObjectExtensions.isNullOrUndefined(extensionPropertyValue)
                                && !TypeExtensions_1.StringExtensions.isNullOrWhitespace(extensionPropertyValue.StringValue)) {
                                var taxRegistration = JSON.parse(extensionPropertyValue.StringValue);
                                lotteryCode = taxRegistration.RegistrationNumber;
                            }
                        }
                        var fiscalCustomerData = {
                            LotteryCode: lotteryCode
                        };
                        var options = {
                            title: _this.context.resources.getString("Copy_From_Transaction_Customer_Action_Label"),
                            subTitle: _this.context.resources.getString("Check_Fiscal_Customer_Dialog_Subtitle"),
                            fiscalCustomerData: fiscalCustomerData,
                            readOnly: true,
                            onBeforeClose: function (dialog, result) { return _this._onEditFiscalCustomerDialogBeforeClose(cart, result, correlationId); }
                        };
                        return new EditFiscalCustomerDialog_1.default().open(options).then(function (result) { return _this._onEditFiscalCustomerDialogClosed(result, correlationId); });
                    });
                };
                AddFiscalCustomerOperationRequestHandler.prototype._getPrimaryAddress = function (customer) {
                    return TypeExtensions_1.ArrayExtensions.firstOrUndefined(customer.Addresses, function (address) {
                        return address.IsPrimary === true;
                    });
                };
                AddFiscalCustomerOperationRequestHandler.prototype._onEditFiscalCustomerDialogBeforeClose = function (cart, result, correlationId) {
                    if (result.canceled) {
                        return Promise.resolve(true);
                    }
                    return this._setCartFiscalCustomerDataAsync(cart, result.data.fiscalCustomerData, correlationId).then(function () { return true; });
                };
                AddFiscalCustomerOperationRequestHandler.prototype._onEditFiscalCustomerDialogClosed = function (result, correlationId) {
                    if (result.canceled) {
                        return this._requestFiscalCustomerDataAsync(correlationId);
                    }
                    return Promise.resolve(result);
                };
                AddFiscalCustomerOperationRequestHandler.prototype._clearFiscalCustomerAsync = function (cart, correlationId) {
                    var _this = this;
                    var options = {
                        title: this.context.resources.getString("Clear_Action_Label"),
                        subTitle: this.context.resources.getString("Clear_Fiscal_Code_Dialog_Message"),
                        onBeforeClose: function (dialog, result) { return _this._onClearConfirmationDialogBeforeClose(cart, result, correlationId); }
                    };
                    return new ClearConfirmationDialog_1.default().open(options).then(function (result) { return _this._onClearConfirmationDialogClosed(result, correlationId); });
                };
                AddFiscalCustomerOperationRequestHandler.prototype._onClearConfirmationDialogBeforeClose = function (cart, result, correlationId) {
                    if (result.canceled) {
                        return Promise.resolve(true);
                    }
                    return this._setCartFiscalCustomerDataAsync(cart, null, correlationId).then(function () { return true; });
                };
                AddFiscalCustomerOperationRequestHandler.prototype._onClearConfirmationDialogClosed = function (result, correlationId) {
                    if (result.canceled) {
                        return this._requestFiscalCustomerDataAsync(correlationId);
                    }
                    return Promise.resolve(result);
                };
                AddFiscalCustomerOperationRequestHandler.prototype._setCartFiscalCustomerDataAsync = function (cart, fiscalCustomerData, correlationId) {
                    var fiscalCustomerSerialized = JSON.stringify(fiscalCustomerData);
                    var extensionPropertyValue = {
                        StringValue: fiscalCustomerSerialized
                    };
                    return ExtensionPropertyHelper_1.default.saveCartExtensionPropertyAsync(this.context.runtime, cart, TaxRegistrationIdItalyConstants_1.default.FISCAL_CUSTOMER_DATA_EXTENSION_PROPERTY_NAME, extensionPropertyValue, correlationId);
                };
                return AddFiscalCustomerOperationRequestHandler;
            }(Operations_1.ExtensionOperationRequestHandlerBase));
            exports_1("default", AddFiscalCustomerOperationRequestHandler);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkDgYJKoZIhvcNAQcCoIIj/zCCI/sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // myOtA7NALM4DntLaOHVtlb/ECmC+X6Zcrm4MERpWki6g
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgrdINK0DM7cni
// SIG // 4x2vzvj/7kNGubY8+3cEZOEuYKu8T9UwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // VDcvyNPDSGpLE+gPpMNiQsknn4WLnJcbKiqqV2djz3J+
// SIG // b0+efNv27JPkqz1LxJ4YSNyFyf2x2TfCJUXSDd7zuhIa
// SIG // jGclams0ktSbTTEs+XmyG8+AO1Wjy+YPJjWDtosOJjzp
// SIG // bS0o9vvnQvDwXacqG2Ioj2Gx5FlIIeAlwftaRfkohjU9
// SIG // 1TWpQ/A+AccREKDTDp40HsjG+lIRV4SieXMOSYuTybW8
// SIG // yITDuI7vwgvDMmgYG505gJVAc4INlqw70bqJwd1VBpLf
// SIG // aYEdOVGIFSU7OYd14DZoOTTiv+w6fOYEgSCIN1iOSccm
// SIG // +wit2FG8UQrmYDpEA2Clzpcuss7hLpBW86GCEvEwghLt
// SIG // BgorBgEEAYI3AwMBMYIS3TCCEtkGCSqGSIb3DQEHAqCC
// SIG // EsowghLGAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFVBgsq
// SIG // hkiG9w0BCRABBKCCAUQEggFAMIIBPAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCDefLLmif07p76T
// SIG // CR3jT0TT1WP2rLjO0AjY3X+oHuvs5wIGXzvljGqeGBMy
// SIG // MDIwMDgyMzA0MDI1MS4wNTJaMASAAgH0oIHUpIHRMIHO
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
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIDYDnAiy
// SIG // 1evbZXsGWmsMrbTskzl2upMLthY9FJXWTdfxMIH6Bgsq
// SIG // hkiG9w0BCRACLzGB6jCB5zCB5DCBvQQgvEVqi68FUnfv
// SIG // 3BsQ3wakuG9bT14aDxawuteb1dboFNowgZgwgYCkfjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAASig
// SIG // DoHhNtVPwgAAAAABKDAiBCCrtywDQ4+oO/28q4trziVO
// SIG // SIb91wyeowerhFsxJNxURDANBgkqhkiG9w0BAQsFAASC
// SIG // AQAP8IVdiHOplcwMN0e66GP2EHO9NEXtaIOz3UGt/TJy
// SIG // hdT8I+ZPZrNU87n75k3CVjUvHzkY7HvniwHZTfPdJ3tg
// SIG // 04hFm28GZXhzXNhiOfT68SLny2ZUa5dgW/ICPBmQOD9R
// SIG // V0cFdpg5BXnHT5EUTtyOx2+vbeAdsBdiw4rp4p4G3LOt
// SIG // Xn+sLEVYqn2gVXYRQLXhByvmSBQCQ9SZcoLuz1t1nNAZ
// SIG // qm7ebb3rbssTYx5BSPAx5q8f6cXQSBl+dh+vndakSifg
// SIG // 00MtZFttZ+jiAGdABxjwJ2cDyCgw1vS3DFcEWP0pAYKT
// SIG // DQVfBQpZN+OYWI8fbKy858TrVdFCnWYr/iW8
// SIG // End signature block
