System.register(["PosApi/Consume/Device", "PosApi/Consume/Peripherals", "PosApi/Consume/StoreOperations", "PosApi/Entities", "PosApi/TypeExtensions", "../Messages/PrintAdvanceInvoiceResponse"], function (exports_1, context_1) {
    "use strict";
    var Device_1, Device_2, Peripherals_1, Peripherals_2, StoreOperations_1, Entities_1, TypeExtensions_1, PrintAdvanceInvoiceResponse_1, PrintAdvanceInvoiceManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Device_1_1) {
                Device_1 = Device_1_1;
                Device_2 = Device_1_1;
            },
            function (Peripherals_1_1) {
                Peripherals_1 = Peripherals_1_1;
                Peripherals_2 = Peripherals_1_1;
            },
            function (StoreOperations_1_1) {
                StoreOperations_1 = StoreOperations_1_1;
            },
            function (Entities_1_1) {
                Entities_1 = Entities_1_1;
            },
            function (TypeExtensions_1_1) {
                TypeExtensions_1 = TypeExtensions_1_1;
            },
            function (PrintAdvanceInvoiceResponse_1_1) {
                PrintAdvanceInvoiceResponse_1 = PrintAdvanceInvoiceResponse_1_1;
            }
        ],
        execute: function () {
            PrintAdvanceInvoiceManager = (function () {
                function PrintAdvanceInvoiceManager(extensionContext) {
                    this._extensionContext = extensionContext;
                }
                PrintAdvanceInvoiceManager.isAdvanceInvoiceCreatedForDepositAsync = function (context) {
                    var request = new Device_1.GetDeviceConfigurationClientRequest();
                    return context.runtime.executeAsync(request)
                        .then(function (response) {
                        var isAdvanceInvoiceCreatedForDeposit = false;
                        if (!response.canceled) {
                            var useAdvanceInvoiceProp = {
                                Key: "UseAdvanceInvoice", Value: { BooleanValue: true }
                            };
                            isAdvanceInvoiceCreatedForDeposit = TypeExtensions_1.ArrayExtensions.hasElement(response.data.result.ExtensionProperties, useAdvanceInvoiceProp, function (left, right) {
                                return left.Key === right.Key &&
                                    left.Value.BooleanValue === right.Value.BooleanValue;
                            });
                        }
                        return Promise.resolve(isAdvanceInvoiceCreatedForDeposit);
                    });
                };
                PrintAdvanceInvoiceManager.isAdvanceInvoiceCanBePrinted = function (salesOrder, isOrderOperation) {
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(salesOrder)) {
                        return false;
                    }
                    if (TypeExtensions_1.StringExtensions.isNullOrWhitespace(salesOrder.SalesId)) {
                        return false;
                    }
                    if (salesOrder.TransactionTypeValue !== Entities_1.ProxyEntities.TransactionType.CustomerOrder &&
                        salesOrder.TransactionTypeValue !== Entities_1.ProxyEntities.TransactionType.AsyncCustomerOrder) {
                        return false;
                    }
                    if (isOrderOperation) {
                        if (salesOrder.CustomerOrderModeValue !== Entities_1.ProxyEntities.CustomerOrderMode.CustomerOrderCreateOrEdit &&
                            salesOrder.CustomerOrderModeValue !== Entities_1.ProxyEntities.CustomerOrderMode.Cancellation) {
                            return false;
                        }
                    }
                    return true;
                };
                PrintAdvanceInvoiceManager.prototype.printAsync = function (printRequest) {
                    var _this = this;
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(printRequest)) {
                        return Promise.resolve({ canceled: true, data: null });
                    }
                    return this._isReportCanBePrintedAsync()
                        .then(function (isReportCanBePrinted) {
                        if (!isReportCanBePrinted) {
                            return Promise.resolve({ canceled: true, data: null });
                        }
                        return _this._getAdvanceInvoiceReportDataSetAsync(printRequest)
                            .then(function (reportDataSet) {
                            return _this._printAdvanceInvoiceReportDataSetAsync(reportDataSet);
                        });
                    });
                };
                PrintAdvanceInvoiceManager.prototype._isReportCanBePrintedAsync = function () {
                    var _this = this;
                    return this._isHardwareStationActiveAsync()
                        .then(function (isHardwareStationActive) {
                        if (isHardwareStationActive) {
                            return _this._initWindowsPrinterNameAsync();
                        }
                        else {
                            return Promise.resolve(false);
                        }
                    });
                };
                PrintAdvanceInvoiceManager.prototype._isHardwareStationActiveAsync = function () {
                    var request = new Peripherals_2.HardwareStationStatusRequest();
                    return this._extensionContext.runtime.executeAsync(request)
                        .then(function (response) {
                        return Promise.resolve(response.data.isActive);
                    });
                };
                PrintAdvanceInvoiceManager.prototype._initWindowsPrinterNameAsync = function () {
                    var _this = this;
                    this._windowsPrinterName = TypeExtensions_1.StringExtensions.EMPTY;
                    var request = new Device_2.GetHardwareProfileClientRequest();
                    return this._extensionContext.runtime.executeAsync(request)
                        .then(function (response) {
                        if (!response.canceled) {
                            var printers = response.data.result.Printers;
                            if (!TypeExtensions_1.ObjectExtensions.isNullOrUndefined(printers)) {
                                var windowsPrinters = printers.filter(function (printer) {
                                    return printer.DeviceTypeValue === Entities_1.ProxyEntities.DeviceType.WindowsPrinter;
                                });
                                if (TypeExtensions_1.ArrayExtensions.hasElements(windowsPrinters)) {
                                    _this._windowsPrinterName = windowsPrinters[0].DeviceName;
                                }
                            }
                        }
                        if (TypeExtensions_1.StringExtensions.isNullOrWhitespace(_this._windowsPrinterName)) {
                            var errorMessage = _this._extensionContext.resources.getString("Windows_Printer_Not_Defined");
                            _this._extensionContext.logger.logError(_this._extensionContext.resources.getString("Advance_Invoice_Printing_Error") +
                                " " +
                                errorMessage);
                            return Promise.reject([new Entities_1.ClientEntities.ExtensionError(errorMessage)]);
                        }
                        else {
                            return Promise.resolve(true);
                        }
                    });
                };
                PrintAdvanceInvoiceManager.prototype._getAdvanceInvoiceReportDataSetAsync = function (printRequest) {
                    var reportId = "CustAdvanceInvoice";
                    var reportParameters = [];
                    this._addStringParameter("SalesOrderId", printRequest.salesOrderId, reportParameters);
                    this._addStringParameter("TransactionId", printRequest.transactionId, reportParameters);
                    this._addStringParameter("StoreId", printRequest.storeId, reportParameters);
                    this._addStringParameter("TerminalId", printRequest.terminalId, reportParameters);
                    this._addStringParameter("FileFormat", Entities_1.ProxyEntities.SrsReportFileFormat.Image.toString(), reportParameters);
                    var getSrsReportDataSetServiceRequest = new StoreOperations_1.GetSrsReportDataSetServiceRequest(this._extensionContext.logger.getNewCorrelationId(), reportId, reportParameters);
                    return this._extensionContext.runtime.executeAsync(getSrsReportDataSetServiceRequest)
                        .then(function (response) {
                        return Promise.resolve(response.data.reportDataSet);
                    });
                };
                PrintAdvanceInvoiceManager.prototype._printAdvanceInvoiceReportDataSetAsync = function (reportDataSet) {
                    var _this = this;
                    if (!this._isReportDataSetAvailable(reportDataSet)) {
                        return Promise.resolve({ canceled: true, data: null });
                    }
                    var imagePrinterPrintRequest = new Peripherals_1.HardwareStationDeviceActionRequest("Printer", "PrintImage", reportDataSet.Output.map(function (reportRow) {
                        return { ImageAsBase64String: reportRow.RowData[0].Value.StringValue, DeviceName: _this._windowsPrinterName };
                    }));
                    return this._extensionContext.runtime.executeAsync(imagePrinterPrintRequest)
                        .then(function (response) {
                        return Promise.resolve({ canceled: response.canceled, data: new PrintAdvanceInvoiceResponse_1.default() });
                    });
                };
                PrintAdvanceInvoiceManager.prototype._addStringParameter = function (parameterKey, parameterValue, parameters) {
                    var parameter = new Entities_1.ProxyEntities.CommercePropertyClass();
                    parameter.Key = parameterKey;
                    parameter.Value = new Entities_1.ProxyEntities.CommercePropertyValueClass();
                    parameter.Value.StringValue = parameterValue;
                    parameters.push(parameter);
                };
                PrintAdvanceInvoiceManager.prototype._isReportDataSetAvailable = function (reportDataSet) {
                    return !TypeExtensions_1.ObjectExtensions.isNullOrUndefined(reportDataSet) &&
                        TypeExtensions_1.ArrayExtensions.hasElements(reportDataSet.Output);
                };
                return PrintAdvanceInvoiceManager;
            }());
            exports_1("default", PrintAdvanceInvoiceManager);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // irwVXZS6BiY89KCqRDb2JXcHRvzeBPPdsgLjEGVu3KCg
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQghvxps+3Lh5Ca
// SIG // H7f5ESzfT6NIUij51m4/KbH32vLC61cwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // BqqlJ+g4413m08eZCqmAUgFmw8PbVwuFa3J5YfctDq8/
// SIG // swMIuuaL9B9u3QRKnjS5Xqkk5kliTKchoccqa6kVWJHd
// SIG // Rcs6wkMc9XbF/TD1LTRsSBKdCtvleMuvpmSvF+GNE5eQ
// SIG // cCuiENtE+mi4U4cXv694FiZo8e0ydrZWLLSTXgWF0UZu
// SIG // 989UCdLoaLHUoBazxqv0Z5BIdVUfnxMpEnVpVlf1f1Am
// SIG // mre46oQceH+CF4uwreETqjml6w1WtAyzNJFu6KfRacil
// SIG // g/UWaxrEnDB90hswarCcgEK0EANDRknvHyOOv7EvuXIj
// SIG // 6C4kfIJFpSRe8DcPXac27pJ8XSHp7yp12KGCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCB13Kq8s8W2DOjS
// SIG // 2f1uPQoTR4iz0PWHVv8vvDarVJGgqwIGXz1EKhi2GBMy
// SIG // MDIwMDgyMzA0MDI0My41ODVaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjpEMDgyLTRCRkQtRUVCQTEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjwwggTxMIID2aADAgECAhMzAAABE7Nwhz36
// SIG // 8MgkAAAAAAETMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTky
// SIG // MVoXDTIxMDEyMTIzMTkyMVowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOkQwODItNEJGRC1FRUJBMSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvK3EHQFc+nmZ
// SIG // hgumEk3M6BIC6KA1DIPU67YgRc9DGFNGcbflRToaMivP
// SIG // V2DUC60DTAOI51VHCLWJStGFsRLDOjA3IWsBYFajR7ma
// SIG // gbYUT87TEeZGHGvPYFQjejk+qe5CBKstqgGNlnEPyRXl
// SIG // usIk7246W9tebdCwzg0jW9oMaMPP1reyEaNSj4sxKrEF
// SIG // xQAiCaO1z7rR9q8o+RakCRqmfud8KSzNw8osURkwIz2o
// SIG // phQCHtj7qVmY7nUUlTyxg3bM5Son1JMIBtyQx6ddggl3
// SIG // G0zJgJWhDbphOAWHo6owgi+P7XoTlgjDnzPWCOuu3eVU
// SIG // vKzYOjlDLkxgkdSfbF3GEQIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFNqZhHIbL+4XCO+SkRQfPCOAzp1SMB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBAA95
// SIG // zLCAr5HfZIiuz/1ndGtbYVx3z0umO4o6JMe7mCSPywti
// SIG // 1yNp6vBTf2gDwKQ+l2caenAm03IwAAWxVd3oL6zRl16b
// SIG // 6aDPXx4Xt9HTdVzp6IbBm10jDZfMaHYudjsUfRgzOI55
// SIG // qmPIpPfKLo8YWKoXKfaYnC+Ax7XZkWrClaCTrvqkitfA
// SIG // aB4/Q2lH1lWygCtD3a118MfmXUTB11X4o57VRr5nnoK4
// SIG // oH94NWaz+OMeOlRqI1LcLXDv6yuPu44lG0N0UElPLPCH
// SIG // ELtyFYRVUvyFHer5CorLU4uHzAEUFureCGOzB8wwbLdG
// SIG // q//jyVHjPt3/fkDlSuxhR3iPBbpNXSgwggZxMIIEWaAD
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
// SIG // RDA4Mi00QkZELUVFQkExJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVAD1XVpFg052IY9KYOAmyEwqXuO6VoIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi7F/QMCIYDzIwMjAwODIzMTEyNDAw
// SIG // WhgPMjAyMDA4MjQxMTI0MDBaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOLsX9ACAQAwCgIBAAICA90CAf8wBwIB
// SIG // AAICEc0wCgIFAOLtsVACAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQAfyWUkmHJe
// SIG // 0U0dI3nC5FrKZg6SmE1+z7JHwaCohB+i+VX3ggyGxZfK
// SIG // d8KAvxDC5JJdYfS1a6XMFwD1igReNuxNsalzBI4kEe/9
// SIG // LFkLDt47uIVVWQcbjyllOxM4J4C2b9SX2nOTipycbxrE
// SIG // ywkcpAv7EPMfoiI3hekLL3DG1iS4QDGCAw0wggMJAgEB
// SIG // MIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAABE7Nwhz368MgkAAAAAAETMA0GCWCGSAFlAwQCAQUA
// SIG // oIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQw
// SIG // LwYJKoZIhvcNAQkEMSIEIPvY/aoaYtACr0DgFzoxa0ba
// SIG // 3bGxUONV9yEzzNP8VC/yMIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgp9oXxI97H6tU5Vd6qSp0UoHPjJCl
// SIG // GZQbMZrwv2uAW60wgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAROzcIc9+vDIJAAAAAAB
// SIG // EzAiBCBoOCFCnwUHWSuqgV4FpDVtNs5p0DwTFx6OOz2c
// SIG // gmehcDANBgkqhkiG9w0BAQsFAASCAQBQx22BZc1kyZeS
// SIG // aicOeSKxeRAB6QHPE9vVdAv7agJUk9S/Y/hU4TswqicE
// SIG // hQTJV1e2CnwDcxQoJ8ZXkrFckIR843PpnnZ3b0TukwtS
// SIG // eBAPADtHhl5PlRNScNXWt2/f6pTdkAqsi89d2HxvAZhD
// SIG // N83GxsD0v3p2LO3njlPXqtBMQSiRfjuXG5dJvfF1GY3s
// SIG // EiLqObjjCAoX3g0izVY3qwSvU7cwA/WfmV43phmMKnIB
// SIG // Z9QSFO5f7VHefLogsofADcJkzOZ6GBJUDfPE+psV5ybg
// SIG // 5o80nKf724oRNjheLBQIxePZxfqsfovM3InKKj91tzxs
// SIG // bgywgJZR7WdFZpeHsyLg
// SIG // End signature block
