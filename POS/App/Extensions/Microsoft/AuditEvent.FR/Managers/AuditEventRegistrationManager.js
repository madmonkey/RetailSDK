System.register(["PosApi/Consume/Device", "PosApi/Consume/SalesOrders", "PosApi/Consume/Employees", "PosApi/Consume/Peripherals", "PosApi/Consume/StoreOperations", "PosApi/Entities", "PosApi/TypeExtensions", "../Entities/FranceExtensibleAuditEventType"], function (exports_1, context_1) {
    "use strict";
    var Device_1, Device_2, SalesOrders_1, Employees_1, Peripherals_1, StoreOperations_1, Entities_1, TypeExtensions_1, FranceExtensibleAuditEventType_1, AuditEventRegistrationManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Device_1_1) {
                Device_1 = Device_1_1;
                Device_2 = Device_1_1;
            },
            function (SalesOrders_1_1) {
                SalesOrders_1 = SalesOrders_1_1;
            },
            function (Employees_1_1) {
                Employees_1 = Employees_1_1;
            },
            function (Peripherals_1_1) {
                Peripherals_1 = Peripherals_1_1;
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
            function (FranceExtensibleAuditEventType_1_1) {
                FranceExtensibleAuditEventType_1 = FranceExtensibleAuditEventType_1_1;
            }
        ],
        execute: function () {
            AuditEventRegistrationManager = (function () {
                function AuditEventRegistrationManager(extensionContext) {
                    this.extensionContext = extensionContext;
                }
                AuditEventRegistrationManager.prototype.registerConnectionStatusChangeAsync = function (connectionStatusType, previousConnectionStatusType) {
                    var message;
                    var auditEventType;
                    var shouldRegister = false;
                    switch (connectionStatusType) {
                        case Entities_1.ClientEntities.ConnectionStatusType.Online:
                            if (!TypeExtensions_1.ObjectExtensions.isNullOrUndefined(previousConnectionStatusType) &&
                                previousConnectionStatusType !== Entities_1.ClientEntities.ConnectionStatusType.Online) {
                                message = this.extensionContext.resources.getString(AuditEventRegistrationManager.OFFLINE_MODE_OFF_EVENT_MESSAGE_RESOURCE_ID);
                                auditEventType = FranceExtensibleAuditEventType_1.FranceExtensibleAuditEventType.OfflineModeOff;
                                shouldRegister = true;
                            }
                            break;
                        case Entities_1.ClientEntities.ConnectionStatusType.ManualOffline:
                        case Entities_1.ClientEntities.ConnectionStatusType.SeamlessOffline:
                            if (previousConnectionStatusType !== Entities_1.ClientEntities.ConnectionStatusType.ManualOffline &&
                                previousConnectionStatusType !== Entities_1.ClientEntities.ConnectionStatusType.SeamlessOffline) {
                                message = this.extensionContext.resources.getString(AuditEventRegistrationManager.OFFLINE_MODE_ON_EVENT_MESSAGE_RESOURCE_ID);
                                auditEventType = FranceExtensibleAuditEventType_1.FranceExtensibleAuditEventType.OfflineModeOn;
                                shouldRegister = true;
                            }
                            break;
                        default:
                            break;
                    }
                    if (!shouldRegister) {
                        return Promise.resolve();
                    }
                    var eventData = {
                        auditEventTypeValue: auditEventType.Value,
                        eventMessage: message,
                        source: AuditEventRegistrationManager.CONNECTION_STATUS_CHANGE_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventRegistrationManager.prototype.updateAndPrintReceipts = function (salesOrder, receiptAndPrinterPairs) {
                    var _this = this;
                    return this._recreateSalesReceiptsForSalesOrder(salesOrder)
                        .then(function (recreatedReceipts) {
                        var receiptsToPrint = receiptAndPrinterPairs.filter(function (pair) {
                            return (!TypeExtensions_1.ObjectExtensions.isNullOrUndefined(pair) && !TypeExtensions_1.ObjectExtensions.isNullOrUndefined(pair.receipt)
                                && pair.receipt.ReceiptTypeValue !== Entities_1.ProxyEntities.ReceiptType.SalesReceipt);
                        })
                            .map(function (pair) {
                            return pair.receipt;
                        })
                            .concat(recreatedReceipts);
                        var printRequest = new Peripherals_1.PrinterPrintRequest(receiptsToPrint);
                        return _this.extensionContext.runtime.executeAsync(printRequest);
                    });
                };
                AuditEventRegistrationManager.prototype.registerPrintReceiptCopyAsync = function (salesOrder) {
                    var eventData = {
                        auditEventTypeValue: FranceExtensibleAuditEventType_1.FranceExtensibleAuditEventType.PrintReceiptCopy.Value,
                        eventMessage: TypeExtensions_1.StringExtensions.format(this.extensionContext.resources.getString(AuditEventRegistrationManager.PRINT_RECEIPT_COPY_EVENT_MESSAGE_RESOURCE_ID), salesOrder.Id),
                        source: AuditEventRegistrationManager.PRINT_RECEIPT_COPY_EVENT_SOURCE,
                        transactionReference: {
                            Channel: salesOrder.ChannelId,
                            Store: salesOrder.StoreId,
                            Terminal: salesOrder.TerminalId,
                            TransactionId: salesOrder.Id
                        },
                        extensionProperties: []
                    };
                    var receiptIdExtensionProperty = {
                        Key: AuditEventRegistrationManager.RECEIPT_ID_KEY_ID,
                        Value: {
                            StringValue: salesOrder.ReceiptId
                        }
                    };
                    eventData.extensionProperties.push(receiptIdExtensionProperty);
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventRegistrationManager.prototype.registerPurgeTransactionsDataAsync = function () {
                    var eventData = {
                        auditEventTypeValue: FranceExtensibleAuditEventType_1.FranceExtensibleAuditEventType.PurgeTransactionsData.Value,
                        eventMessage: this.extensionContext.resources.getString(AuditEventRegistrationManager.PURGE_TRANSACTIONS_DATA_EVENT_MESSAGE_RESOURCE_ID),
                        source: AuditEventRegistrationManager.PURGE_TRANSACTIONS_DATA_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventRegistrationManager.prototype.registerUserLogOn = function (employee) {
                    var eventData = {
                        auditEventTypeValue: FranceExtensibleAuditEventType_1.FranceExtensibleAuditEventType.UserLogOn.Value,
                        eventMessage: TypeExtensions_1.StringExtensions.format(this.extensionContext.resources.getString(AuditEventRegistrationManager.USER_LOGON_EVENT_MESSAGE_RESOURCE_ID), employee.StaffId),
                        source: AuditEventRegistrationManager.USER_LOGON_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventRegistrationManager.prototype.registerUserLogOff = function (employee) {
                    var eventData = {
                        staff: employee.StaffId,
                        auditEventTypeValue: FranceExtensibleAuditEventType_1.FranceExtensibleAuditEventType.UserLogOff.Value,
                        eventMessage: TypeExtensions_1.StringExtensions.format(this.extensionContext.resources.getString(AuditEventRegistrationManager.USER_LOGOFF_EVENT_MESSAGE_RESOURCE_ID), employee.StaffId),
                        source: AuditEventRegistrationManager.USER_LOGOFF_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventRegistrationManager.prototype._recreateSalesReceiptsForSalesOrder = function (salesOrder) {
                    var _this = this;
                    var salesOrderId = TypeExtensions_1.StringExtensions.EMPTY;
                    var queryBySalesId = false;
                    if (!TypeExtensions_1.StringExtensions.isNullOrWhitespace(salesOrder.Id)
                        && TypeExtensions_1.StringExtensions.compare(salesOrder.Id, salesOrder.SalesId, true) !== 0) {
                        salesOrderId = salesOrder.Id;
                    }
                    else if (!TypeExtensions_1.StringExtensions.isNullOrWhitespace(salesOrder.SalesId)) {
                        salesOrderId = salesOrder.SalesId;
                        queryBySalesId = true;
                    }
                    return Promise.all([
                        this.extensionContext.runtime.executeAsync(new Device_2.GetHardwareProfileClientRequest())
                            .then(function (response) {
                            return response.data.result;
                        }),
                        this.extensionContext.runtime.executeAsync(new Device_1.GetDeviceConfigurationClientRequest())
                            .then(function (response) {
                            return response.data.result;
                        })
                    ])
                        .then(function (results) {
                        var hardwareProfile = results[0];
                        var deviceConfiguration = results[1];
                        var criteria = {
                            IsCopy: true,
                            IsRemoteTransaction: salesOrder.StoreId !== deviceConfiguration.StoreNumber,
                            IsPreview: false,
                            QueryBySalesId: queryBySalesId,
                            ReceiptTypeValue: Entities_1.ProxyEntities.ReceiptType.SalesReceipt,
                            HardwareProfileId: hardwareProfile.ProfileId
                        };
                        var getReceiptsRequest = new SalesOrders_1.GetReceiptsClientRequest(salesOrderId, criteria);
                        return _this.extensionContext.runtime.executeAsync(getReceiptsRequest);
                    })
                        .then(function (response) {
                        return response.data.result;
                    });
                };
                AuditEventRegistrationManager.prototype._registerCustomAuditEventAsync = function (eventData) {
                    var _this = this;
                    return this.extensionContext.runtime.executeAsync(new Device_1.GetDeviceConfigurationClientRequest())
                        .then(function (response) {
                        var deviceConfiguration = response.data.result;
                        if (!deviceConfiguration.AuditEnabled) {
                            return Promise.resolve();
                        }
                        var getStaffIdAsync;
                        if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(eventData.staff) || TypeExtensions_1.StringExtensions.isEmpty(eventData.staff)) {
                            getStaffIdAsync = _this.extensionContext.runtime.executeAsync(new Employees_1.GetLoggedOnEmployeeClientRequest())
                                .then(function (response) {
                                var currentEmployee = response.data.result;
                                return TypeExtensions_1.ObjectExtensions.isNullOrUndefined(currentEmployee) ? TypeExtensions_1.StringExtensions.EMPTY : currentEmployee.StaffId;
                            });
                        }
                        else {
                            getStaffIdAsync = Promise.resolve(eventData.staff);
                        }
                        return getStaffIdAsync.then(function (staffId) {
                            var request = new StoreOperations_1.RegisterCustomAuditEventClientRequest(eventData.auditEventTypeValue, eventData.channel || deviceConfiguration.ChannelId, eventData.store || deviceConfiguration.StoreNumber, eventData.terminal || deviceConfiguration.TerminalId, staffId, eventData.source, eventData.eventMessage, Entities_1.ProxyEntities.AuditLogTraceLevel.Trace, eventData.transactionReference, eventData.extensionProperties);
                            return _this.extensionContext.runtime.executeAsync(request)
                                .then(function () { return Promise.resolve(); });
                        });
                    }).catch(function (reason) {
                        _this.extensionContext.logger.logError(TypeExtensions_1.StringExtensions.format(_this.extensionContext.resources.getString(AuditEventRegistrationManager.AUDIT_EVENT_REGISTRATION_ERROR_MESSAGE_RESOURCE_ID), eventData.source, JSON.stringify(reason)));
                    });
                };
                AuditEventRegistrationManager.CONNECTION_STATUS_CHANGE_EVENT_SOURCE = "AuditEvent.FR.Extension.AuditEventRegistrationManager.registerConnectionStatusChange()";
                AuditEventRegistrationManager.PRINT_RECEIPT_COPY_EVENT_SOURCE = "AuditEvent.FR.Extension.AuditEventRegistrationManager.registerPrintReceiptCopyAsync()";
                AuditEventRegistrationManager.PURGE_TRANSACTIONS_DATA_EVENT_SOURCE = "AuditEvent.FR.Extension.registerPurgeTransactionsData()";
                AuditEventRegistrationManager.USER_LOGON_EVENT_SOURCE = "AuditEvent.FR.Extension.registerUserLogOn()";
                AuditEventRegistrationManager.USER_LOGOFF_EVENT_SOURCE = "AuditEvent.FR.Extension.registerUserLogOff()";
                AuditEventRegistrationManager.OFFLINE_MODE_ON_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_offline_mode_on_event_message";
                AuditEventRegistrationManager.OFFLINE_MODE_OFF_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_offline_mode_off_event_message";
                AuditEventRegistrationManager.PRINT_RECEIPT_COPY_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_print_receipt_copy_event_message";
                AuditEventRegistrationManager.PURGE_TRANSACTIONS_DATA_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_purge_transactions_data_event_message";
                AuditEventRegistrationManager.USER_LOGON_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_user_logon_event_message";
                AuditEventRegistrationManager.USER_LOGOFF_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_user_logoff_event_message";
                AuditEventRegistrationManager.AUDIT_EVENT_REGISTRATION_ERROR_MESSAGE_RESOURCE_ID = "Audit_event_registration_error_message";
                AuditEventRegistrationManager.RECEIPT_ID_KEY_ID = "RECEIPT_ID_335496B6-3F44-4EBF-B644-1F91B4DEFC8F";
                return AuditEventRegistrationManager;
            }());
            exports_1("AuditEventRegistrationManager", AuditEventRegistrationManager);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // D/K9rOsz3zrBBqmLASnvEiBj1swtDb9F1zmRtuhI9lug
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgaftfAuTAJpeZ
// SIG // sGCrS926Xoz4I46g+3P4simUXVnlHLowgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // EYQ0k+w5pT+I1srMDM5jvRdWD2jfNEzjbHjjQPy9z9X3
// SIG // Hcq5B6iVcAI5Wv7EHUzA5JBuc59es4IWJpI1/ROb8TUp
// SIG // 4QG66HDnlF6Rs9dVYb2ieDS8v8j3E7zsRVI0gfu6sNL8
// SIG // YEamd/YJVJVNnRM0k/+YSh0xb5+J0jqcp3I93Og795As
// SIG // 8rtVNaXeB2zOB3qT0W2Qsjdr4HP3MvBun0ndhPIoIJB9
// SIG // qnaHCDTgXgO+3NAFY8ci9JSlEaItHpiq6bcAcNdZrpVK
// SIG // 71sMQHac863lmQnCV/pewt+504dHnf+SShQJJHNW+Q3H
// SIG // puBQ21ppwf+xfJoBbNawllH2ljzrfMh8IKGCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCAtaAHXD47MHWUd
// SIG // 6Vzb5n7CrB+hu1CThhvCEEbkNc1+mwIGXz0tSNNsGBMy
// SIG // MDIwMDgyMzA0MDI0Ny44NTRaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjowODQyLTRCRTYtQzI5QTEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjwwggTxMIID2aADAgECAhMzAAABCX6CvR57
// SIG // 02EiAAAAAAEJMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTkx
// SIG // NFoXDTIxMDEyMTIzMTkxNFowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOjA4NDItNEJFNi1DMjlBMSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuMMhEGUCBxoJ
// SIG // LkP9VJ63U+43pWt+W1wqQfY2EpXPmxYlw7NSy19We/Z5
// SIG // C+GVH4/sLTqzezshKl1dn4IsHYtLmf1t9aM3Ojk3GN4B
// SIG // fshqdGT0wgOOt80nQQkqR6RhunO18mF4oPHET0Lju0b+
// SIG // XRacaT5Q8qTLctfjpYBXGVGKDEkGm1uEFLvO8jN4WezE
// SIG // 7ky2bLise/nQ8ycSAGxsHnAjUrD3dA9sxP1sEfiwiJ7H
// SIG // vuFBa62GD8CSrDzInzt1L5ghey3f65si0Gxna0escFzJ
// SIG // s3OBwQTk+cMrWujqdAmHZ1Hp7MTif6oBDcP3zU1j134I
// SIG // JrPAy7DibYU2KxtkJA0q9wIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFKWkknNMg0L8QnGI59So7zY/bklGMB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBADhY
// SIG // hwOLB0dLkBKuk0wuRv/Jbga8qDkPpBbiVOYlwE0l3tAa
// SIG // 3Ulc5Sqt6pBOhB763FxYM5dShyxYtm4LIfCYj5Qyx3y5
// SIG // n05BTcSxB69+TBUz8GvSd1OGn6wpO2mLGCBNCbIgxd/k
// SIG // WNuBx4eksNJ4yENSvMh+Twufnr5I/pYeZOpoUH+O9pvF
// SIG // XP3yzz7TrHcnnMzhMOXIrV79c1CDSVsB8tpt3kJerpcQ
// SIG // N7IGKQM3ZvjULX/6ItMkOkJpEEpnfq6W4JOraotY/4jo
// SIG // NBAkZpitMLb32hL48MVOu2JMcMoNfPJES4QAM+ne/0vx
// SIG // Rq6vr9O8wlScca9GRKArWkxZe8yf6mgwggZxMIIEWaAD
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
// SIG // MDg0Mi00QkU2LUMyOUExJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVAArBvLsdZyIJdH5HLYAWto86YngAoIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi7EjrMCIYDzIwMjAwODIzMDk0NjE5
// SIG // WhgPMjAyMDA4MjQwOTQ2MTlaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOLsSOsCAQAwCgIBAAICHMMCAf8wBwIB
// SIG // AAICEcwwCgIFAOLtmmsCAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQApPOuJDtqA
// SIG // As5VhPERbMWMnlAoyiWPBS8KlxoQx0YeJMC+QLDPF5qe
// SIG // 4n1h6CtWrWIZ8N9IsuRw7v9Bs6Kv9vsl1AJHDYxxSzcM
// SIG // olD+BUepxKv0MKOAaMjhtwl77805RD2YORrP/ppmY+JW
// SIG // lKXBuGxVQGJMdHIGj51q9RDcowmeujGCAw0wggMJAgEB
// SIG // MIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAABCX6CvR5702EiAAAAAAEJMA0GCWCGSAFlAwQCAQUA
// SIG // oIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQw
// SIG // LwYJKoZIhvcNAQkEMSIEIOiuKnfZpbDi/c2hXPNgy8jI
// SIG // AtSpf9UuxvthhAiiPk3TMIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgglT4YQYbSjI8YhNv3N2HQ3Ad/tXk
// SIG // 27MFY13/nqWdUo8wgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAQl+gr0ee9NhIgAAAAAB
// SIG // CTAiBCAY5kY8E3q2Gov8GbZBkDgjoW9cGYnBXuhm4Nho
// SIG // TeR2JTANBgkqhkiG9w0BAQsFAASCAQAGOly+1o23Nf1g
// SIG // PDozaEcUbETu3MBdiTLHaV62ASiQXrTb/5/2HSvH1Mjd
// SIG // ge86cNNiJQClBO4yeJjcDxitDkt1Oe+4FaUsfLy9d13N
// SIG // vzeSi04dagFpdLs+xAJfvPOvl3qIF6U3EUpSPF07mHIU
// SIG // TGGQ++jCnhAIO/P0lY+whNkFJUy1/PXZv6CJg1HMYSWl
// SIG // JoPjlh8WxLIWS3jzre2wAKmXT2Cpfx066VNLQ6dM8hqQ
// SIG // ylYAnDD27GkA3mPQZ+qVVf1J85b68pIH5pHq2ggUWjJo
// SIG // akBMT2KAjXdiWmWN9SXCNUjAGhiD0Ru9IvUYT/LZqkEZ
// SIG // R4rsTEPRRca97+NEXpPC
// SIG // End signature block
