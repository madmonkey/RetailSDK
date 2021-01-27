System.register(["PosApi/Consume/Device", "PosApi/Consume/Employees", "PosApi/Consume/StoreOperations", "PosApi/Entities", "PosApi/TypeExtensions", "../Entities/AustriaExtensibleAuditEventType"], function (exports_1, context_1) {
    "use strict";
    var Device_1, Employees_1, StoreOperations_1, Entities_1, TypeExtensions_1, AustriaExtensibleAuditEventType_1, AuditEventManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Device_1_1) {
                Device_1 = Device_1_1;
            },
            function (Employees_1_1) {
                Employees_1 = Employees_1_1;
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
            function (AustriaExtensibleAuditEventType_1_1) {
                AustriaExtensibleAuditEventType_1 = AustriaExtensibleAuditEventType_1_1;
            }
        ],
        execute: function () {
            AuditEventManager = (function () {
                function AuditEventManager(extensionContext) {
                    this._extensionContext = extensionContext;
                }
                AuditEventManager.prototype.registerTaxOverride = function (cart, cartLines, taxOverride) {
                    var logString = TypeExtensions_1.StringExtensions.format(this._extensionContext.resources.getString(AuditEventManager.TAX_OVERRIDE_EVENT_MESSAGE_RESOURCE_ID), cart.Id, cartLines.toString(), taxOverride.Code);
                    var customAuditEventsData = {
                        auditEventTypeValue: Entities_1.ClientEntities.ExtensibleAuditEventType.TaxOverride.Value,
                        message: logString,
                        source: AuditEventManager.TAX_OVERRIDE_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEvents(customAuditEventsData);
                };
                AuditEventManager.prototype.registerCloseShift = function () {
                    var logString = TypeExtensions_1.StringExtensions.format(this._extensionContext.resources.getString(AuditEventManager.CLOSE_SHIFT_EVENT_MESSAGE_RESOURCE_ID));
                    var customAuditEventsData = {
                        auditEventTypeValue: AustriaExtensibleAuditEventType_1.AustriaExtensibleAuditEventType.CloseShift.Value,
                        message: logString,
                        source: AuditEventManager.CLOSE_SHIFT_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEvents(customAuditEventsData);
                };
                AuditEventManager.prototype.registerOpenShift = function (shiftId) {
                    var logString = TypeExtensions_1.StringExtensions.format(this._extensionContext.resources.getString(AuditEventManager.OPEN_SHIFT_EVENT_MESSAGE_RESOURCE_ID), shiftId);
                    var customAuditEventsData = {
                        auditEventTypeValue: AustriaExtensibleAuditEventType_1.AustriaExtensibleAuditEventType.OpenShift.Value,
                        message: logString,
                        source: AuditEventManager.OPEN_SHIFT_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEvents(customAuditEventsData);
                };
                AuditEventManager.prototype.registerPriceOverride = function () {
                    var logString = TypeExtensions_1.StringExtensions.format(this._extensionContext.resources.getString(AuditEventManager.PRICE_OVERRIDE_EVENT_MESSAGE_RESOURCE_ID));
                    var customAuditEventsData = {
                        auditEventTypeValue: AustriaExtensibleAuditEventType_1.AustriaExtensibleAuditEventType.PriceOverride.Value,
                        message: logString,
                        source: AuditEventManager.PRICE_OVERRIDE_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEvents(customAuditEventsData);
                };
                AuditEventManager.prototype.registerUserLogOn = function (employee) {
                    var logString = TypeExtensions_1.StringExtensions.format(this._extensionContext.resources.getString(AuditEventManager.USER_LOGON_EVENT_MESSAGE_RESOURCE_ID), employee.StaffId);
                    var eventData = {
                        auditEventTypeValue: AustriaExtensibleAuditEventType_1.AustriaExtensibleAuditEventType.UserLogOn.Value,
                        message: logString,
                        source: AuditEventManager.USER_LOGON_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEvents(eventData);
                };
                AuditEventManager.prototype.registerUserLogOff = function (employee) {
                    var logString = TypeExtensions_1.StringExtensions.format(this._extensionContext.resources.getString(AuditEventManager.USER_LOGOFF_EVENT_MESSAGE_RESOURCE_ID), employee.StaffId);
                    var eventData = {
                        auditEventTypeValue: AustriaExtensibleAuditEventType_1.AustriaExtensibleAuditEventType.UserLogOff.Value,
                        message: logString,
                        source: AuditEventManager.USER_LOGOFF_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEvents(eventData);
                };
                AuditEventManager.prototype.registerVoidTransaction = function (cartId) {
                    var logString = TypeExtensions_1.StringExtensions.format(this._extensionContext.resources.getString(AuditEventManager.VOID_TRANSACTION_EVENT_MESSAGE_RESOURCE_ID), cartId);
                    var eventData = {
                        auditEventTypeValue: AustriaExtensibleAuditEventType_1.AustriaExtensibleAuditEventType.TransactionVoid.Value,
                        message: logString,
                        source: AuditEventManager.VOID_TRANSACTION_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEvents(eventData);
                };
                AuditEventManager.prototype.registerVoidProducts = function (cart, voidedCartLines) {
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(cart) ||
                        !TypeExtensions_1.ArrayExtensions.hasElements(voidedCartLines)) {
                        return Promise.resolve();
                    }
                    var voidedLines = voidedCartLines.map(function (cartLine) {
                        return TypeExtensions_1.StringExtensions.format("{0}, #: {1}", cartLine.Description, cartLine.LineNumber);
                    }).join("; ");
                    var logString = TypeExtensions_1.StringExtensions.format(this._extensionContext.resources.getString(AuditEventManager.VOID_PRODUCTS_EVENT_MESSAGE_RESOURCE_ID), voidedLines);
                    var eventData = {
                        auditEventTypeValue: AustriaExtensibleAuditEventType_1.AustriaExtensibleAuditEventType.ItemVoid.Value,
                        message: logString,
                        source: AuditEventManager.VOID_PRODUCTS_EVENT_SOURCE
                    };
                    return this._registerCustomAuditEvents(eventData);
                };
                AuditEventManager.prototype._registerCustomAuditEvents = function (eventData) {
                    var _this = this;
                    var deviceConfiguration;
                    return this._extensionContext.runtime.executeAsync(new Device_1.GetDeviceConfigurationClientRequest())
                        .then(function (response) {
                        deviceConfiguration = response.data.result;
                    })
                        .then(function () {
                        if (!deviceConfiguration.AuditEnabled) {
                            return Promise.resolve();
                        }
                        return _this._performAuditEventRegistration(eventData, deviceConfiguration);
                    });
                };
                AuditEventManager.prototype._performAuditEventRegistration = function (eventData, deviceConfiguration) {
                    var _this = this;
                    return this._extensionContext.runtime.executeAsync(new Employees_1.GetLoggedOnEmployeeClientRequest())
                        .then(function (response) {
                        return response.data.result;
                    })
                        .then(function (currentEmployee) {
                        var staffId = TypeExtensions_1.ObjectExtensions.isNullOrUndefined(currentEmployee) ? TypeExtensions_1.StringExtensions.EMPTY : currentEmployee.StaffId;
                        var request;
                        request = new StoreOperations_1.RegisterCustomAuditEventClientRequest(eventData.auditEventTypeValue, deviceConfiguration.ChannelId, deviceConfiguration.StoreNumber, deviceConfiguration.TerminalId, staffId, eventData.source, eventData.message, Entities_1.ProxyEntities.AuditLogTraceLevel.Trace);
                        return _this._extensionContext.runtime.executeAsync(request)
                            .then(function () { return Promise.resolve(); });
                    })
                        .catch(function (reason) {
                        _this._extensionContext.logger.logError(TypeExtensions_1.StringExtensions.format(_this._extensionContext.resources.getString(AuditEventManager.REGISTER_ERROR_MESSAGE_RESOURCE_ID), AustriaExtensibleAuditEventType_1.AustriaExtensibleAuditEventType.getByValue(eventData.auditEventTypeValue).Name, JSON.stringify(reason)));
                        return Promise.resolve();
                    });
                };
                AuditEventManager.TAX_OVERRIDE_EVENT_SOURCE = "Microsoft.AuditEvent.AT.AuditEventManager.registerTaxOverride";
                AuditEventManager.CLOSE_SHIFT_EVENT_SOURCE = "Microsoft.AuditEvent.AT.AuditEventManager.registerCloseShift";
                AuditEventManager.OPEN_SHIFT_EVENT_SOURCE = "Microsoft.AuditEvent.AT.AuditEventManager.registerOpenShift";
                AuditEventManager.PRICE_OVERRIDE_EVENT_SOURCE = "Microsoft.AuditEvent.AT.AuditEventManager.registerPriceOverride";
                AuditEventManager.USER_LOGON_EVENT_SOURCE = "Microsoft.AuditEvent.AT.AuditEventManager.registerUserLogOn";
                AuditEventManager.USER_LOGOFF_EVENT_SOURCE = "Microsoft.AuditEvent.AT.AuditEventManager.registerUserLogOff";
                AuditEventManager.VOID_PRODUCTS_EVENT_SOURCE = "Microsoft.AuditEvent.AT.AuditEventManager.registerVoidProducts";
                AuditEventManager.VOID_TRANSACTION_EVENT_SOURCE = "Microsoft.AuditEvent.AT.AuditEventManager.registerVoidTransaction";
                AuditEventManager.TAX_OVERRIDE_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_AT_tax_override_event_message";
                AuditEventManager.CLOSE_SHIFT_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_AT_close_shift_event_message";
                AuditEventManager.OPEN_SHIFT_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_AT_open_shift_event_message";
                AuditEventManager.PRICE_OVERRIDE_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_AT_price_override_event_message";
                AuditEventManager.USER_LOGON_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_AT_logon_event_message";
                AuditEventManager.USER_LOGOFF_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_AT_logoff_event_message";
                AuditEventManager.VOID_PRODUCTS_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_AT_void_products_message";
                AuditEventManager.VOID_TRANSACTION_EVENT_MESSAGE_RESOURCE_ID = "Audit_event_AT_void_transaction_message";
                AuditEventManager.REGISTER_ERROR_MESSAGE_RESOURCE_ID = "Audit_event_registration_error_message";
                return AuditEventManager;
            }());
            exports_1("default", AuditEventManager);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // adSQN+e7TL2VxulkfwntMK5EhJgG4ROJvn60UjUk+YGg
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQg0F+fkstSXseY
// SIG // D060vZrg/7n09WlSpityBCyg6OIPqDowgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // MKSDQx4qwMYPOTwF8a3i9mImn94AubeyZNO6t1JHdn6x
// SIG // SrZfxa4IWqRwU6V1D7/66vi941ys3ahe7Q3Eoi6V8tdH
// SIG // A36tKZg2J0ARNJO6XQhx0WZ2Fpsk+3ZPGr9eSwwq8AgF
// SIG // 6rYunKaBeswE02VeLY0u20L94GXI0IrWSr48MC7X7StL
// SIG // CC0m/ocJgDeVEDxzqgqqAPAbEnt9D1jz1aEXzMMTZ+wF
// SIG // 62XW0F3RAMQD7f9ZVNnNFXMk+Xg7FcfVTS+GnnDU+TEz
// SIG // wpfxrBndmQ/mFfFIsu7Nc9ngmwU3r/7lko6OjjEX+tIo
// SIG // WhCKT/0GH82dAUhHlonARiPWexHbkmMrE6GCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCB2SGBJwGs5ndLa
// SIG // DfHA/slgI1Tu5x3KhSBDwnkXWiHVqgIGXxIB8oU6GBMy
// SIG // MDIwMDgyMzA0MDI0Ny42MjhaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjpFMDQxLTRCRUUtRkE3RTEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgc2Vy
// SIG // dmljZaCCDjwwggTxMIID2aADAgECAhMzAAABB343aJiH
// SIG // WjfWAAAAAAEHMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAwODE3Mzgz
// SIG // NVoXDTIxMDEwMzE3MzgzNVowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOkUwNDEtNEJFRS1GQTdFMSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBzZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1LqjlJW2nloq
// SIG // 4MGwsIYTSDqk7IaaPkHUmMQLfSZ5HrpUBXiq0OqzkhAl
// SIG // 8cIDoy/0zTCF7ZIoNTGonxTjerIv0YvgLFfBrq0KeH8p
// SIG // ScywzBXSXBkqVdwhkXaQ29GrvJDUC5p2bsS8QC/dUe//
// SIG // 95h9kA0CNtMNxtOrPl7/Po7PcEJLFwH3JV19UyaASMdT
// SIG // 4tRRqgp2NypVvNfj5Yc9E+MkrZtTIJ6h+ESmMj3XHpqQ
// SIG // mAvwSNOD4dhCS/rkEHwH2HW3/bxqqSmI7LpLZ1q+bqMA
// SIG // 9x+QLfsd5WB+a8+CQpXio3i6Qf4++B+1WdCOXkxG5bPX
// SIG // tpRCmlM2/aNMI54w3PreAQIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFDTh45cZSCVzHD/Z/9KIGHV/Keh3MB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBABjd
// SIG // /+11ksxxio5OOOMPtqtQ95OwYf2WoVL1hxSehFClOby8
// SIG // xBrHbICUr1lx2Q0a6X+a3FBkMo55aNYQGNZg7XjShbrI
// SIG // Uum3ncXMTxyY3pVWfTdv3ufv+8y7tfGI5ysOWxbu3Vqm
// SIG // ATCNydBTq+elyTidSk7TIiYacbom/hVsvqcoVVYBxk1B
// SIG // 7lHWxNPXWPVsbkbG6W+A3VgFjazwwelQDjudEHxI/tLV
// SIG // vsxeod0YQUyNIpY9PgM4FxPug8ie/26+mlbwhLzUScxO
// SIG // mpCZzMp/5M5gt9i8b0WVihMFg0dBZ83l4+cp0krWeoon
// SIG // 0wT+4Kog7InYLsYfgRV+x8YTdXh3+40wggZxMIIEWaAD
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
// SIG // RTA0MS00QkVFLUZBN0UxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIHNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVAMMLvrX4Bt6wu0Wa8bhTtgpmUnz4oIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi6/WTMCIYDzIwMjAwODIzMDM1MDQz
// SIG // WhgPMjAyMDA4MjQwMzUwNDNaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOLr9ZMCAQAwCgIBAAICGagCAf8wBwIB
// SIG // AAICEZUwCgIFAOLtRxMCAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQAaR7jrXfg2
// SIG // eCO3Z8wuIYMWrK9HGz4i3eDf2bJDopLXAWzEI+vWVLLb
// SIG // 7L10H9kQ9gPhi7bh2nDamTPUn36KA9Mr9kgxgz286GUz
// SIG // p5ngJSMjut1iBnUwovoMMuWSMrswRoDSsc+vke8VkMf3
// SIG // DLi6vtDRfbz8Ik2LiHbSEcBEDfgiPTGCAw0wggMJAgEB
// SIG // MIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAABB343aJiHWjfWAAAAAAEHMA0GCWCGSAFlAwQCAQUA
// SIG // oIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQw
// SIG // LwYJKoZIhvcNAQkEMSIEIE3CzU1JbhIvy8WOxuQRI6a8
// SIG // bT3NMLRSXybrc/HRPqXKMIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgQWLwo+KRZMIbpmoAE59IC4fX3Qzc
// SIG // yJkJCjXjrUY/yx4wgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAQd+N2iYh1o31gAAAAAB
// SIG // BzAiBCAKfFMrZ+ZVBdjTGzRmRuG3zHCThQPBnMWzoPX8
// SIG // 4ShAhjANBgkqhkiG9w0BAQsFAASCAQBXdn6uCFDHin+a
// SIG // PHeaRGIlD6C0VsebFsSZHe8ER9ookXjicISaOJkaf6x4
// SIG // rsm8YdLFLKlPWd6ONE5HNGS/FhhKbWL5VVY49va8S+Mm
// SIG // OJbqV5neBACeeLtqNMbes3531U4luZp+8rY0HqFvTKeb
// SIG // mebpkUvEhe5HgjEBP/OXUNLYS2+TE+Mtk9KrjzGbpTn8
// SIG // 7+gOWQnJrH9LdiiiJR4PhIeK+tpJPX6ixe+4hfc12EcA
// SIG // wQ6/r/GJWUS675zA5oU8PmWyMLJCtJPutsC5Ap/J1oOA
// SIG // 6rbJkfWwsldUgIJrpywHCFPJ3ID1PyTCAdx8kVQwB2SW
// SIG // hAdOtgYa+NVAtjwYe5A+
// SIG // End signature block
