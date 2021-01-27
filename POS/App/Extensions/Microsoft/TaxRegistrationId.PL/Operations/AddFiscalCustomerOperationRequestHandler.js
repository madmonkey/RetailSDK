System.register(["PosApi/Consume/Cart", "PosApi/Create/Operations", "./AddFiscalCustomerOperationRequest", "./AddFiscalCustomerOperationResponse", "PosApi/TypeExtensions", "../Controls/FiscalCustomer/FiscalCustomerActionDialog", "PosApi/Consume/Customer", "../Controls/FiscalCustomer/EditFiscalCustomerDialog", "../TaxRegistrationIdPolandConstants", "../Controls/FiscalCustomer/ClearConfirmationDialog", "../Helpers/ExtensionPropertyHelper", "../Entities/FiscalCustomerActionType"], function (exports_1, context_1) {
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
    var Cart_1, Operations_1, AddFiscalCustomerOperationRequest_1, AddFiscalCustomerOperationResponse_1, TypeExtensions_1, FiscalCustomerActionDialog_1, Customer_1, EditFiscalCustomerDialog_1, TaxRegistrationIdPolandConstants_1, ClearConfirmationDialog_1, ExtensionPropertyHelper_1, FiscalCustomerActionType_1, AddFiscalCustomerOperationRequestHandler;
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
            function (TaxRegistrationIdPolandConstants_1_1) {
                TaxRegistrationIdPolandConstants_1 = TaxRegistrationIdPolandConstants_1_1;
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
                        title: this.context.resources.getString("Tax_Registration_ID_PL_Enter_Manually_Action_Label"),
                        subTitle: this.context.resources.getString("Tax_Registration_ID_PL_Edit_Fiscal_Customer_Dialog_Subtitle"),
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
                        var vatId = TypeExtensions_1.StringExtensions.EMPTY;
                        var customer = response.data.result;
                        var primaryAddress = _this._getPrimaryAddress(customer);
                        if (!TypeExtensions_1.ObjectExtensions.isNullOrUndefined(primaryAddress)) {
                            var extensionPropertyValue = ExtensionPropertyHelper_1.default.getExtensionPropertyByName(primaryAddress.ExtensionProperties, TaxRegistrationIdPolandConstants_1.default.CUSTOMER_TAX_REGISTRATION_EXTENSION_PROPERTY_NAME);
                            if (!TypeExtensions_1.ObjectExtensions.isNullOrUndefined(extensionPropertyValue)
                                && !TypeExtensions_1.StringExtensions.isNullOrWhitespace(extensionPropertyValue.StringValue)) {
                                var taxRegistration = JSON.parse(extensionPropertyValue.StringValue);
                                vatId = taxRegistration.RegistrationNumber;
                            }
                        }
                        var fiscalCustomerData = {
                            VatId: vatId
                        };
                        var options = {
                            title: _this.context.resources.getString("Tax_Registration_ID_PL_Copy_From_Transaction_Customer_Action_Label"),
                            subTitle: _this.context.resources.getString("Tax_Registration_ID_PL_Check_Fiscal_Customer_Dialog_Subtitle"),
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
                        title: this.context.resources.getString("Tax_Registration_ID_PL_Clear_Action_Label"),
                        subTitle: this.context.resources.getString("Tax_Registration_ID_PL_Clear_Dialog_Message"),
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
                    return ExtensionPropertyHelper_1.default.saveCartExtensionPropertyAsync(this.context.runtime, cart, TaxRegistrationIdPolandConstants_1.default.FISCAL_CUSTOMER_DATA_EXTENSION_PROPERTY_NAME, extensionPropertyValue, correlationId);
                };
                return AddFiscalCustomerOperationRequestHandler;
            }(Operations_1.ExtensionOperationRequestHandlerBase));
            exports_1("default", AddFiscalCustomerOperationRequestHandler);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // JYxqTsR/kl1qqXv1Qm5lC3XF432Jpcgn+nRnQ1mG2Uyg
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
// SIG // ghXVMIIV0QIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABiK9S1rmSbej5AAAAAAGIMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBJzAZBgkqhkiG9w0BCQMxDAYK
// SIG // KwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYKKwYB
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgMiy7N7xGwZPc
// SIG // on7+FRin1AJW2ZDi8Sx20egLoyHgtP0wgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // jmNuWZJOZepihwGuQTG35UrWjwppWX4/58oaI2bt+DDY
// SIG // wffaVdu2dZEUMGnSFWNcgc7AznpGokk12GVCmNpGUr5l
// SIG // FSE62QIB61IDoBfn41B69z5OPvfaKJsTmNMNnD/ZUErg
// SIG // 3j1cQI4EYTG+stiYX3Tb7Jm7t3GXkJO9p0na7xN8rQSu
// SIG // vCl3X1S8OR4RxQuPVovSEEtrbGIrVP3bbUIafo7eW3Zu
// SIG // 0IsMjQ6zoz+fgAVc4saqUHsVeu+txj+aROM8w6viLnNN
// SIG // hvSw6BICndB59vn5vu91aMPXmqSZP2Su1xMfNy9uzm8M
// SIG // w0UGmYnMdKa5KVbSNgN4EnKnsFOY+z6yt6GCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCDClgWA84qZ25gJ
// SIG // t2wn7m+WUfx9jkndGUYfvKzkRp0+KwIGXz0rl4a8GBMy
// SIG // MDIwMDgyMzA0MDI0OC4yODZaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjo4RDQxLTRCRjctQjNCNzEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjwwggTxMIID2aADAgECAhMzAAABClLIOQFS
// SIG // 0XBLAAAAAAEKMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTkx
// SIG // NVoXDTIxMDEyMTIzMTkxNVowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOjhENDEtNEJGNy1CM0I3MSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuz4brZShcMWf
// SIG // hnj1P1dKTJHtteR0l/D3C19YY2FG8ghEQRbO/8BMK28D
// SIG // CGXTqOzQ6nCFIV17d5MYNTqgScbqM1XAifCcEcv1SO/a
// SIG // dWXi20r92jDMaLjs6KmjS/w5m/Ak/VBHKqtzxdfLzL9X
// SIG // GX5PGaYblUhjzNHlrCbxNZHz1wibGM7Gbbq6tIxCOlwY
// SIG // fYabikKvCkl76KghN+xGVq2Fst7oUSZ7K3eE6tmIGLMl
// SIG // kP2kBdtHW+92VsCLVxuE1JcuCENKXEIvf1B937FbtOqv
// SIG // P8jb3OzHyHJp2DlDzshTAYdBFudfSv5oP8WIDIbZmZZ8
// SIG // 5rx56+Z6cyU4sGwboZ8FJwIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFPhElKX9OkxNUN6R+DqtAaKRcYUoMB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBAFSX
// SIG // rnzUFfLd03MlqtErt51WGX3UXFeorE6dGY+YIwSmfFRK
// SIG // RNwEe8cmLt0EOxezyTV6+/fdYTyrPcPDvgR3k6F5sHeK
// SIG // ExohjrqcjxAa3yVQ9SJZakXZVKzaHWzbvMuA8kcmzj0J
// SIG // /Y6/pk57aFsp/kr+lu5aNdw5V3WgitJYpwE6foZQsBrT
// SIG // TPNRhIXVMHnPEk6s2+7nC6Ty9ZLIJhYeMyqLuitJGKvE
// SIG // iRhD8PYzkGJnLkjp61ICDk/00ZVZvvlXLonth32ZooeZ
// SIG // 9/+760o9g2lUhF8oaLHCB1i82dUChXdzZulUEwQ5CZWh
// SIG // 8WIjQZSUuvOO1vV0FfOqdNwcDyXuFdIwggZxMIIEWaAD
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
// SIG // oFA12u8JJxzVs341Hgi62jbb01+P3nSISRKhggLOMIIC
// SIG // NwIBATCB+KGB0KSBzTCByjELMAkGA1UEBhMCVVMxCzAJ
// SIG // BgNVBAgTAldBMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
// SIG // BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMg
// SIG // TGltaXRlZDEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // OEQ0MS00QkY3LUIzQjcxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVADm9dqVx0X/uUa0VckV24hpoY975oIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi7Ec6MCIYDzIwMjAwODIzMDkzOTA2
// SIG // WhgPMjAyMDA4MjQwOTM5MDZaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOLsRzoCAQAwCgIBAAICChoCAf8wBwIB
// SIG // AAICEZYwCgIFAOLtmLoCAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQBKecWEF/oo
// SIG // fLV9xpv2KKZJENQickzlHA3tUaiQW/Matg80oigwzLaR
// SIG // oK26c/cVXxBdNLQMWVwPaxEeE7tk8+mMh1PScZVfvekD
// SIG // vKxhsY+7Y9Zc6+/2Q7U/OGu0mFW5/zIlsmpFIaUTXTci
// SIG // mqi2Gt8A3W0tO9l30Ot+WZniBkIloTGCAw0wggMJAgEB
// SIG // MIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAABClLIOQFS0XBLAAAAAAEKMA0GCWCGSAFlAwQCAQUA
// SIG // oIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQw
// SIG // LwYJKoZIhvcNAQkEMSIEIDC8utQ9WrXn3niwnGAvoYBb
// SIG // EZXqVzi9dMebDza85T32MIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgVwM2JDO6oQwoDehG8V22bUdxzZDW
// SIG // WhkjGB83y+TSrKowgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAQpSyDkBUtFwSwAAAAAB
// SIG // CjAiBCAamYhsxsiBXNuqvqKKDLvx9mjo82QZ1GU6r8Lz
// SIG // IyjdSDANBgkqhkiG9w0BAQsFAASCAQCXxUi0akGFBA05
// SIG // ywgLEyV3DhCFpmVBGkWiRB5BLn2wwT/G9ximvpCIuJgS
// SIG // tSdLvHNJBv7FGPpJ2EqAGiIqtfwQh1lqEr3HbLG5zBU9
// SIG // WtQ7GzP9xDAkYvnzyRu/we51L0jEop39RRUcAfno+DLR
// SIG // sj3dxwE1s3oH63OenJJzw2ZR19l0l2otPIJlPwoFd/F9
// SIG // cPEM+Q+y44UdSmQzrode+AKzfsQNANT0Vsk4IbihE3zv
// SIG // BmxYqYjAq7FQAMjGrXh4en2cDWNBQ8p6SeA1dLxwJAUZ
// SIG // AC3SqYRy6L0CNxfjZY1XJsGwGz4V9H8HzRU87VtVvCiq
// SIG // eEDdr90rarkVz/5IzPO4
// SIG // End signature block
