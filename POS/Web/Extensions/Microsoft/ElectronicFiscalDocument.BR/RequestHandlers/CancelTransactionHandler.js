System.register(["PosApi/Create/RequestHandlers", "PosApi/Entities", "../Messages/CancelTransactionRequest", "../Messages/CancelTransactionResponse", "PosApi/Consume/Cart", "PosApi/TypeExtensions", "PosApi/Consume/Device", "../Helpers/ExtensionPropertyHelper", "../EFDBrazilConstants"], function (exports_1, context_1) {
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
    var RequestHandlers_1, Entities_1, CancelTransactionRequest_1, CancelTransactionResponse_1, Cart_1, TypeExtensions_1, Device_1, ExtensionPropertyHelper_1, EFDBrazilConstants_1, CancelTransactionHandler;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (RequestHandlers_1_1) {
                RequestHandlers_1 = RequestHandlers_1_1;
            },
            function (Entities_1_1) {
                Entities_1 = Entities_1_1;
            },
            function (CancelTransactionRequest_1_1) {
                CancelTransactionRequest_1 = CancelTransactionRequest_1_1;
            },
            function (CancelTransactionResponse_1_1) {
                CancelTransactionResponse_1 = CancelTransactionResponse_1_1;
            },
            function (Cart_1_1) {
                Cart_1 = Cart_1_1;
            },
            function (TypeExtensions_1_1) {
                TypeExtensions_1 = TypeExtensions_1_1;
            },
            function (Device_1_1) {
                Device_1 = Device_1_1;
            },
            function (ExtensionPropertyHelper_1_1) {
                ExtensionPropertyHelper_1 = ExtensionPropertyHelper_1_1;
            },
            function (EFDBrazilConstants_1_1) {
                EFDBrazilConstants_1 = EFDBrazilConstants_1_1;
            }
        ],
        execute: function () {
            CancelTransactionHandler = (function (_super) {
                __extends(CancelTransactionHandler, _super);
                function CancelTransactionHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CancelTransactionHandler.prototype.supportedRequestType = function () {
                    return CancelTransactionRequest_1.default;
                };
                CancelTransactionHandler.prototype.executeAsync = function (cancelRequest) {
                    var _this = this;
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(cancelRequest)) {
                        return Promise.resolve({ canceled: true, data: null });
                    }
                    if (cancelRequest.salesOrder.SalesLines.some(function (salesLine) { return salesLine.ReturnQuantity > 0; })) {
                        var errorMessage = this.context.resources.getString("EFD_BR_Sales_Order_Has_Returned_Items_Message");
                        return Promise.reject(new Entities_1.ClientEntities.ExtensionError(errorMessage));
                    }
                    var deviceConfiguration;
                    return this.context.runtime.executeAsync(new Device_1.GetDeviceConfigurationClientRequest(cancelRequest.correlationId))
                        .then(function (response) {
                        if (response.canceled) {
                            return Promise.resolve({ canceled: true, data: null });
                        }
                        deviceConfiguration = response.data.result;
                        if (TypeExtensions_1.StringExtensions.isEmptyOrWhitespace(deviceConfiguration.NfcEVoided)) {
                            var errorMessage = _this.context.resources.getString("EFD_BR_No_Cancel_Reason_Code_Error_Message");
                            return Promise.reject([new Entities_1.ClientEntities.ExtensionError(errorMessage)]);
                        }
                        var getReasonCodesRequest = new Cart_1.GetReasonCodeLinesClientRequest([deviceConfiguration.NfcEVoided], cancelRequest.correlationId);
                        return _this.context.runtime.executeAsync(getReasonCodesRequest);
                    })
                        .then(function (response) {
                        if (response.canceled) {
                            return Promise.resolve({ canceled: true, data: null });
                        }
                        var request = new Cart_1.SaveReasonCodeLinesOnCartClientRequest(response.data.result);
                        return _this.context.runtime.executeAsync(request);
                    })
                        .then(function (response) {
                        if (response.canceled) {
                            return Promise.resolve({ canceled: true, data: null });
                        }
                        var returnRequest = new Cart_1.ReturnTransactionOperationRequest(cancelRequest.correlationId, cancelRequest.salesOrder, cancelRequest.salesOrder.SalesLines);
                        return _this.context.runtime.executeAsync(returnRequest);
                    })
                        .then(function (response) {
                        if (response.canceled) {
                            return Promise.resolve({ canceled: true, data: null });
                        }
                        var propertyValue = {
                            StringValue: EFDBrazilConstants_1.default.RETAIL_TRANSACTION_CANCEL_SUB_TYPE
                        };
                        return ExtensionPropertyHelper_1.default.saveCartExtensionPropertyAsync(_this.context.runtime, response.data.cart, EFDBrazilConstants_1.default.RETAIL_TRANSACTION_SUB_TYPE_PROPERTY_NAME, propertyValue, cancelRequest.correlationId);
                    })
                        .then(function (response) {
                        if (response.canceled) {
                            return Promise.resolve({ canceled: true, data: null });
                        }
                        _this.context.navigator.navigateToPOSView("CartView");
                        var tenderLine = {
                            Amount: response.data.result.AmountDue,
                            TenderTypeId: "1",
                            Currency: deviceConfiguration.Currency
                        };
                        return _this.context.runtime.executeAsync(new Cart_1.AddTenderLineToCartClientRequest(tenderLine, cancelRequest.correlationId));
                    })
                        .then(function (response) {
                        if (response.canceled) {
                            return Promise.resolve({ canceled: true, data: new CancelTransactionResponse_1.default() });
                        }
                        return _this.context.runtime.executeAsync(new Cart_1.ConcludeTransactionClientRequest(cancelRequest.correlationId))
                            .then(function (response) {
                            return Promise.resolve({ canceled: response.canceled, data: new CancelTransactionResponse_1.default() });
                        });
                    });
                };
                return CancelTransactionHandler;
            }(RequestHandlers_1.ExtensionRequestHandlerBase));
            exports_1("default", CancelTransactionHandler);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkDgYJKoZIhvcNAQcCoIIj/zCCI/sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // zR6y0nGfRChfRab5PdsRLUDexAQUQQvsZJs/C/LnI4Og
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQglIujP+4r1zCA
// SIG // i6abtMXYUv7UHkgBRV7uzZEMEK0/zkwwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // J4l+BULJCLlYT/APFiDCPQiVvhrhjUbgMbWn5pJcDRpu
// SIG // vYHl2ii3AQT1/+pBezUEkJLBtEuEA3TFlY8ylGae8BMp
// SIG // SIOK2TiqS99I4MvyiyC6jvkYWrAhgh4R8Yos9mig7W3X
// SIG // UyT/IaTa2wovlHDv8l5LljtWI8Zu6c7Jjv1qmNP9WYe7
// SIG // IkKFAeQcExnKEFropBIf5jhDjhtuWQobxVb+Rf9V42Qc
// SIG // TA+mJfliIBtqEMAmFIj/t4ULong0FPjYcqeI5A1fJBKe
// SIG // kSeXQuNEk4h4t4B6a65AZ1/oujfDEhYMpKRymCO6RXwa
// SIG // F7NCO82sbebAUE2RcikeInfv/wZdSU7wJqGCEvEwghLt
// SIG // BgorBgEEAYI3AwMBMYIS3TCCEtkGCSqGSIb3DQEHAqCC
// SIG // EsowghLGAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFVBgsq
// SIG // hkiG9w0BCRABBKCCAUQEggFAMIIBPAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCDDoXbnxrU/NqPd
// SIG // i0FKIUCW6Hv2ZK4Mmv6jEMXVFCqD3AIGXzvk283FGBMy
// SIG // MDIwMDgyMzA0MDI0OS42NjFaMASAAgH0oIHUpIHRMIHO
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEmMCQG
// SIG // A1UECxMdVGhhbGVzIFRTUyBFU046RjdBNi1FMjUxLTE1
// SIG // MEExJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFNlcnZpY2Wggg5EMIIE9TCCA92gAwIBAgITMwAAASWL
// SIG // 3otsciYx3QAAAAABJTANBgkqhkiG9w0BAQsFADB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTEyMTkw
// SIG // MTE0NThaFw0yMTAzMTcwMTE0NThaMIHOMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3NvZnQgT3Bl
// SIG // cmF0aW9ucyBQdWVydG8gUmljbzEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046RjdBNi1FMjUxLTE1MEExJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Uw
// SIG // ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDQ
// SIG // ex9jdmBb7OHJwSYmMUorZNwAcv8Vy36TlJuzcVx7G+lF
// SIG // qt2zjWOMlSOMkm1XoAuJ8VZ5ShBedADXDGDKxHNZhLu3
// SIG // EW8x5ot/IOk6izLTlAFtvIXOgzXs/HaOM72XHKykMZHA
// SIG // dL/fpZtASM5PalmsXX4Ol8lXkm9jR55K56C7q9+hDU+2
// SIG // tjGHaE1ZWlablNUXBhaZgtCJCd60UyZvgI7/uNzcafj0
// SIG // /Vw2bait9nDAVd24yt/XCZnHY3yX7ZsHjIuHpsl+PpDX
// SIG // ai1Dwe9p0ryCZsl9SOMHextIHe9qlTbtWYJ8WtWLoH9d
// SIG // EMQxVLnmPPDOVmBj7LZhSji38N9Vpz/FAgMBAAGjggEb
// SIG // MIIBFzAdBgNVHQ4EFgQU86rK5Qcm+QE5NBXGCPIiCBdD
// SIG // JPgwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8UzaFqF
// SIG // bVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWlj
// SIG // VGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoGCCsGAQUF
// SIG // BwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQ
// SIG // Q0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0TAQH/BAIwADAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsF
// SIG // AAOCAQEAkxxZPGEgIgAhsqZNTZk58V1vQiJ5ja2xHl5T
// SIG // qGA6Hwj5SioLg3FSLiTmGV+BtFlpYUtkneB4jrZsuNpM
// SIG // tfbTMdG7p/xAyIVtwvXnTXqKlCD1T9Lcr94pVedzHGJz
// SIG // L1TYNQyZJBouCfzkgkzccOuFOfeWPfnMTiI5UBW5Odmo
// SIG // yHPQWDSGHoboW1dTKqXeJtuVDTYbHTKs4zjfCBMFjmyl
// SIG // Ru52Zpiz+9MBeRj4iAeou0F/3xvIzepoIKgUWCZ9mmVi
// SIG // WEkVwCtTGbV8eK73KeEE0tfMU/YY2UmoGPc8YwburDEf
// SIG // elegLW+YHkfrcGAGlftCmqtOdOLeghLoG0Ubx/B7sTCC
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
// SIG // bGVzIFRTUyBFU046RjdBNi1FMjUxLTE1MEExJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wi
// SIG // IwoBATAHBgUrDgMCGgMVAEXTL+FQbc2G+3MXXvIRKVr2
// SIG // oXCnoIGDMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTAwDQYJKoZIhvcNAQEFBQACBQDi7FH6MCIYDzIw
// SIG // MjAwODIzMDYyNDU4WhgPMjAyMDA4MjQwNjI0NThaMHcw
// SIG // PQYKKwYBBAGEWQoEATEvMC0wCgIFAOLsUfoCAQAwCgIB
// SIG // AAICHPkCAf8wBwIBAAICEZowCgIFAOLto3oCAQAwNgYK
// SIG // KwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAqAKMAgC
// SIG // AQACAwehIKEKMAgCAQACAwGGoDANBgkqhkiG9w0BAQUF
// SIG // AAOBgQCU8FVIW29vUzOBCeDgXvm86i70+HyZlIP1nEW6
// SIG // ifuXuAk1tNgYp/gccaT4xtlkdvYBLru91J8o4o2yDbAG
// SIG // XjfzL/c7mfHUMhZEtcYgDEMcML7EirACrlTiqcY6Ogiv
// SIG // uNCCd9NpaU+un8wtkAo28hM8pcaLyl45vC9dBptIZ6NL
// SIG // RzGCAw0wggMJAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABJYvei2xyJjHdAAAAAAElMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYL
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIJfyLLnL
// SIG // QAK7Qjsg2KIRtMLaROxlWsKbANrsi+ORnajQMIH6Bgsq
// SIG // hkiG9w0BCRACLzGB6jCB5zCB5DCBvQQgXd/Gsi5vMF/6
// SIG // iX2CDh+VfmL5RvqaFkFwluiyje9B9w4wgZgwgYCkfjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAASWL
// SIG // 3otsciYx3QAAAAABJTAiBCBcjAJ7/n1HI5lkgBqtqy8n
// SIG // K6V1W1gjGBCZC6wDmP1ZyzANBgkqhkiG9w0BAQsFAASC
// SIG // AQBjNnmdRfiOYa9NjitXZFpl5zBxGLJHlKvGtPFiiG+n
// SIG // Vk+70Z4tF+Yq0/JpCO7xCWPHbEJsQGz0DiDQ/WLj1t5f
// SIG // hMmGHt8sBvJqbYmsg6yDDREEqzVYMlj0nRJ7HY3/plyL
// SIG // nCpjMDN9rpPR/S41H8ab4N97pRSMI508esIM9Jz0mQ1L
// SIG // S3BV9s2SVvClS3bbIkjKJDZrBGEKrS10cT0/Q+y+CD+i
// SIG // Dbnhxf/gkyHlhQsUqyycLm1gYvIZLTqoNCJ+SGexTs7O
// SIG // TVSZNsfja9LlxqW/8PsfnkecWrcf3Mrx34DdQe1jyogS
// SIG // prGHZPcbEwEeQoLPB7Zsf85GJbzuoGS+AoVf
// SIG // End signature block