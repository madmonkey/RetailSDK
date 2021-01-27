System.register(["PosApi/Consume/Device", "PosApi/Consume/StoreOperations", "PosApi/Consume/Employees", "PosApi/Consume/Peripherals", "PosApi/Consume/SalesOrders", "PosApi/Entities", "PosApi/TypeExtensions", "./CustomExtensibleAuditEventType"], function (exports_1, context_1) {
    "use strict";
    var Device_1, Device_2, StoreOperations_1, Employees_1, Peripherals_1, SalesOrders_1, Entities_1, TypeExtensions_1, TypeExtensions_2, CustomExtensibleAuditEventType_1, ReceiptsManager, AuditEventManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Device_1_1) {
                Device_1 = Device_1_1;
                Device_2 = Device_1_1;
            },
            function (StoreOperations_1_1) {
                StoreOperations_1 = StoreOperations_1_1;
            },
            function (Employees_1_1) {
                Employees_1 = Employees_1_1;
            },
            function (Peripherals_1_1) {
                Peripherals_1 = Peripherals_1_1;
            },
            function (SalesOrders_1_1) {
                SalesOrders_1 = SalesOrders_1_1;
            },
            function (Entities_1_1) {
                Entities_1 = Entities_1_1;
            },
            function (TypeExtensions_1_1) {
                TypeExtensions_1 = TypeExtensions_1_1;
                TypeExtensions_2 = TypeExtensions_1_1;
            },
            function (CustomExtensibleAuditEventType_1_1) {
                CustomExtensibleAuditEventType_1 = CustomExtensibleAuditEventType_1_1;
            }
        ],
        execute: function () {
            ReceiptsManager = (function () {
                function ReceiptsManager(extensionContext) {
                    this.extensionContext = extensionContext;
                }
                ReceiptsManager.prototype.updateAndPrintReceiptsCopy = function (salesOrder, receiptAndPrinterPairs) {
                    var _this = this;
                    return this._recreateSalesReceiptsForSalesOrderAsync(salesOrder)
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
                ReceiptsManager.prototype._recreateSalesReceiptsForSalesOrderAsync = function (salesOrder) {
                    var _this = this;
                    var salesOrderId = TypeExtensions_2.StringExtensions.EMPTY;
                    var queryBySalesId = false;
                    var getDeviceConfigurationAsync = this._getDeviceConfigurationAsync();
                    var getHardwareProfileAsync = this._getHardwareProfileAsync();
                    if (!TypeExtensions_2.StringExtensions.isNullOrWhitespace(salesOrder.Id)
                        && TypeExtensions_2.StringExtensions.compare(salesOrder.Id, salesOrder.SalesId, true) !== 0) {
                        salesOrderId = salesOrder.Id;
                    }
                    else if (!TypeExtensions_2.StringExtensions.isNullOrWhitespace(salesOrder.SalesId)) {
                        salesOrderId = salesOrder.SalesId;
                        queryBySalesId = true;
                    }
                    return Promise.all([getHardwareProfileAsync, getDeviceConfigurationAsync])
                        .then(function (results) {
                        var hardwareProfile = results[0], deviceConfiguration = results[1];
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
                ReceiptsManager.prototype._getDeviceConfigurationAsync = function () {
                    var request = new Device_1.GetDeviceConfigurationClientRequest();
                    return this.extensionContext.runtime.executeAsync(request).then(function (response) {
                        return response.canceled ?
                            Promise.reject("The response has been canceled.") :
                            Promise.resolve(response.data.result);
                    });
                };
                ReceiptsManager.prototype._getHardwareProfileAsync = function () {
                    var request = new Device_2.GetHardwareProfileClientRequest();
                    return this.extensionContext.runtime.executeAsync(request).then(function (response) {
                        return response.canceled ?
                            Promise.reject("The response has been canceled.") :
                            Promise.resolve(response.data.result);
                    });
                };
                return ReceiptsManager;
            }());
            exports_1("ReceiptsManager", ReceiptsManager);
            AuditEventManager = (function () {
                function AuditEventManager(extensionContext) {
                    this.extensionContext = extensionContext;
                }
                AuditEventManager.prototype.registerPrintReceiptCopyAsync = function (salesOrder) {
                    var eventData = {
                        auditEventTypeValue: Entities_1.ClientEntities.ExtensibleAuditEventType.PrintReceiptCopy.Value,
                        eventMessage: TypeExtensions_2.StringExtensions.format(this.extensionContext.resources.getString(AuditEventManager.PRINT_RECEIPT_COPY_EVENT_MESSAGE_RESOURCE_ID), salesOrder.Id),
                        source: AuditEventManager.PRINT_RECEIPT_COPY_EVENT_SOURCE,
                        transactionReference: {
                            Channel: salesOrder.ChannelId,
                            Store: salesOrder.StoreId,
                            Terminal: salesOrder.TerminalId,
                            TransactionId: salesOrder.Id
                        },
                        extensionProperties: []
                    };
                    var receiptIdExtensionProperty = {
                        Key: AuditEventManager.RECEIPT_ID_KEY_ID,
                        Value: {
                            StringValue: salesOrder.ReceiptId
                        }
                    };
                    eventData.extensionProperties.push(receiptIdExtensionProperty);
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventManager.prototype.registerPurgeTransactionsDataAsync = function () {
                    var eventData = {
                        auditEventTypeValue: CustomExtensibleAuditEventType_1.CustomExtensibleAuditEventType.PurgeTransactionsData.Value,
                        eventMessage: this.extensionContext.resources.getString(AuditEventManager.PURGE_TRANSACTIONS_DATA_EVENT_MESSAGE_RESOURCE_ID),
                        source: AuditEventManager.PURGE_TRANSACTIONS_DATA_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventManager.prototype.registerCloseShiftAsync = function () {
                    var eventData = {
                        auditEventTypeValue: CustomExtensibleAuditEventType_1.CustomExtensibleAuditEventType.CloseShift.Value,
                        eventMessage: this.extensionContext.resources.getString(AuditEventManager.CLOSE_SHIFT_EVENT_MESSAGE_RESOURCE_ID),
                        source: AuditEventManager.CLOSE_SHIFT_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventManager.prototype.registerUserLogOnAsync = function (employee) {
                    var eventData = {
                        auditEventTypeValue: CustomExtensibleAuditEventType_1.CustomExtensibleAuditEventType.UserLogOn.Value,
                        eventMessage: TypeExtensions_2.StringExtensions.format(this.extensionContext.resources.getString(AuditEventManager.USER_LOGON_EVENT_MESSAGE_RESOURCE_ID), employee.StaffId),
                        source: AuditEventManager.USER_LOGON_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventManager.prototype.registerUserLogOffAsync = function (employee) {
                    var eventData = {
                        auditEventTypeValue: CustomExtensibleAuditEventType_1.CustomExtensibleAuditEventType.UserLogOff.Value,
                        eventMessage: TypeExtensions_2.StringExtensions.format(this.extensionContext.resources.getString(AuditEventManager.USER_LOGOFF_EVENT_MESSAGE_RESOURCE_ID), employee.StaffId),
                        source: AuditEventManager.USER_LOGOFF_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventManager.prototype.registerConnectionStatusChangeAsync = function (connectionStatusType, previousConnectionStatusType) {
                    var message;
                    var auditEventType;
                    var shouldRegister = false;
                    switch (connectionStatusType) {
                        case Entities_1.ClientEntities.ConnectionStatusType.Online:
                            if (!TypeExtensions_1.ObjectExtensions.isNullOrUndefined(previousConnectionStatusType) &&
                                previousConnectionStatusType !== Entities_1.ClientEntities.ConnectionStatusType.Online) {
                                message = this.extensionContext.resources.getString(AuditEventManager.OFFLINE_MODE_OFF_EVENT_MESSAGE_RESOURCE_ID);
                                auditEventType = CustomExtensibleAuditEventType_1.CustomExtensibleAuditEventType.OfflineModeOff;
                                shouldRegister = true;
                            }
                            break;
                        case Entities_1.ClientEntities.ConnectionStatusType.ManualOffline:
                        case Entities_1.ClientEntities.ConnectionStatusType.SeamlessOffline:
                            if (previousConnectionStatusType !== Entities_1.ClientEntities.ConnectionStatusType.ManualOffline &&
                                previousConnectionStatusType !== Entities_1.ClientEntities.ConnectionStatusType.SeamlessOffline) {
                                message = this.extensionContext.resources.getString(AuditEventManager.OFFLINE_MODE_ON_EVENT_MESSAGE_RESOURCE_ID);
                                auditEventType = CustomExtensibleAuditEventType_1.CustomExtensibleAuditEventType.OfflineModeOn;
                                shouldRegister = true;
                            }
                            break;
                        default:
                            break;
                    }
                    if (!shouldRegister) {
                        return Promise.resolve(Entities_1.ClientEntities.FiscalRegistrationResult.None);
                    }
                    var eventData = {
                        auditEventTypeValue: auditEventType.Value,
                        eventMessage: message,
                        source: AuditEventManager.CONNECTION_STATUS_CHANGE_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEventAsync(eventData);
                };
                AuditEventManager.prototype._registerCustomAuditEventAsync = function (eventData) {
                    var _this = this;
                    return this.extensionContext.runtime.executeAsync(new Device_1.GetDeviceConfigurationClientRequest())
                        .then(function (response) {
                        var deviceConfiguration = response.data.result;
                        if (!deviceConfiguration.AuditEnabled) {
                            return Promise.resolve(Entities_1.ClientEntities.FiscalRegistrationResult.Failed);
                        }
                        var getStaffIdAsync;
                        if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(eventData.staff) || TypeExtensions_2.StringExtensions.isEmpty(eventData.staff)) {
                            getStaffIdAsync = _this.extensionContext.runtime.executeAsync(new Employees_1.GetLoggedOnEmployeeClientRequest())
                                .then(function (response) {
                                var currentEmployee = response.data.result;
                                return TypeExtensions_1.ObjectExtensions.isNullOrUndefined(currentEmployee) ? TypeExtensions_2.StringExtensions.EMPTY : currentEmployee.StaffId;
                            });
                        }
                        else {
                            getStaffIdAsync = Promise.resolve(eventData.staff);
                        }
                        return getStaffIdAsync.then(function (staffId) {
                            var request = new StoreOperations_1.RegisterCustomAuditEventClientRequest(eventData.auditEventTypeValue, eventData.channel || deviceConfiguration.ChannelId, eventData.store || deviceConfiguration.StoreNumber, eventData.terminal || deviceConfiguration.TerminalId, staffId, eventData.source, eventData.eventMessage, Entities_1.ProxyEntities.AuditLogTraceLevel.Trace, eventData.transactionReference, eventData.extensionProperties);
                            return _this.extensionContext.runtime.executeAsync(request)
                                .then(function (response) {
                                return Promise.resolve(response.data.fiscalRegistrationResult);
                            });
                        });
                    }).catch(function (reason) {
                        _this.extensionContext.logger.logError(TypeExtensions_2.StringExtensions.format(_this.extensionContext.resources.getString(AuditEventManager.AUDIT_EVENT_REGISTRATION_ERROR_MESSAGE_RESOURCE_ID), eventData.source, JSON.stringify(reason)));
                        return Promise.resolve(Entities_1.ClientEntities.FiscalRegistrationResult.Failed);
                    });
                };
                AuditEventManager.PRINT_RECEIPT_COPY_EVENT_SOURCE = "AuditEvent.Common.Extension.AuditEventManager.registerPrintReceiptCopyAsync()";
                AuditEventManager.CONNECTION_STATUS_CHANGE_EVENT_SOURCE = "AuditEvent.Common.Extension.AuditEventManager.registerConnectionStatusChange()";
                AuditEventManager.PURGE_TRANSACTIONS_DATA_EVENT_SOURCE = "AuditEvent.Common.Extension.AuditEventManager.registerPurgeTransactionsData()";
                AuditEventManager.USER_LOGON_EVENT_SOURCE = "AuditEvent.Common.Extension.AuditEventManager.registerUserLogOn()";
                AuditEventManager.USER_LOGOFF_EVENT_SOURCE = "AuditEvent.Common.Extension.AuditEventManager.registerUserLogOff()";
                AuditEventManager.CLOSE_SHIFT_EVENT_SOURCE = "AuditEvent.Common.Extension.AuditEventManager.registerCloseShift()";
                AuditEventManager.OFFLINE_MODE_ON_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_offline_mode_on_event_message";
                AuditEventManager.OFFLINE_MODE_OFF_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_offline_mode_off_event_message";
                AuditEventManager.PURGE_TRANSACTIONS_DATA_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_purge_transactions_data_event_message";
                AuditEventManager.USER_LOGON_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_user_logon_event_message";
                AuditEventManager.USER_LOGOFF_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_user_logoff_event_message";
                AuditEventManager.CLOSE_SHIFT_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_user_close_shift_event_message";
                AuditEventManager.PRINT_RECEIPT_COPY_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_print_receipt_copy_event_message";
                AuditEventManager.AUDIT_EVENT_REGISTRATION_ERROR_MESSAGE_RESOURCE_ID = "Audit_event_registration_error_message";
                AuditEventManager.RECEIPT_ID_KEY_ID = "RECEIPT_ID_335496B6-3F44-4EBF-B644-1F91B4DEFC8F";
                return AuditEventManager;
            }());
            exports_1("AuditEventManager", AuditEventManager);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIj/gYJKoZIhvcNAQcCoIIj7zCCI+sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // VDOhcUJ5MdgSjgAntbJTt1Xf6Gw+slT1I3S9kLKJ3feg
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
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCAFBGnxEosj0bwyFwsb
// SIG // M6RjfBVABTvJcF6oBgPwmq6tvTCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQB5S3ug
// SIG // FWYSA2RaiCjZJFYak8Pfp8Dm6AiWdoYLyRlToEvCIQto
// SIG // u47WfNpdAhBVQ612igmIxXxiXZK1qtak6lKNUgiRtKjc
// SIG // R9WPszzIhOf4R0C4ymyvEWI4uE8P4IRBEwNHvfhnd1mJ
// SIG // AbF8w1HlLRxJvIVZZvlv9jcuZywtaEkNZm1zZJ6iLvHp
// SIG // GCX5UUGvAeiB18931Lj0bG4AkwodG8N14uAPVNr9DUUy
// SIG // XRoOq9y0lLuKIGGhLyUiPW6W/22x34AvdcWc6hh+PHvN
// SIG // cdgH1ltqA4CCVMT8bDx21Izf4RmYNsS33tax8xSmOC/b
// SIG // LzzietRDxpou9tO0nGi6OL3UMIDyoYIS5TCCEuEGCisG
// SIG // AQQBgjcDAwExghLRMIISzQYJKoZIhvcNAQcCoIISvjCC
// SIG // EroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3
// SIG // DQEJEAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEII3dZeGizmhl+SgblpH5
// SIG // nZuhGF8MjjZfYa21ZgbMokZYAgZfOqnO9VcYEzIwMjAw
// SIG // ODIzMDQwMjQ3LjU1N1owBIACAfSggdCkgc0wgcoxCzAJ
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
// SIG // hkiG9w0BCQQxIgQgaKPdo8nfnUGCAnNwJGC8HOdCXA8H
// SIG // 1+ROzVJL58YNZL4wgfoGCyqGSIb3DQEJEAIvMYHqMIHn
// SIG // MIHkMIG9BCBzO+RYw99xOlHlvaefPKE3cS3NJdWU8foi
// SIG // BBwPjdZfRzCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABHg685UsWogMbAAAAAAEeMCIE
// SIG // IJ/0nDJktzfDgfpd5om2eBS0Sy0QY6oYcfUM2WCNFgnr
// SIG // MA0GCSqGSIb3DQEBCwUABIIBAEViOsn/LUPJb6krzas2
// SIG // kXvQ4GEOqx5D8hNDF8MQ7M5laYuD5bUvglGfZLdzDUr5
// SIG // D0C4gnnXDYVmJBzmuyoimDi3FnhjRBPucgTl+L514xRZ
// SIG // UWiH+dl4kQNl6KuhKC1NpzkgeWI+qfh+JlRc7BeEY7yc
// SIG // y+V5+SlYzjQJf+rMLHfVlRcYXFOwzgXxUbLdEU1D21PA
// SIG // si9XvUIp619U6ZOg1vM+rOLAtewB0pwc8n09r+2MKuAh
// SIG // rDOZJmeWLQS8261VhdFyt7OdmGGPyNQfwdUflnV/Kfa0
// SIG // 9eFFTV/idJZux9H60HQK0K963aZ1PDHSzxVUGD/cH5pX
// SIG // Ndg4pk7jJtl0+9Q=
// SIG // End signature block
