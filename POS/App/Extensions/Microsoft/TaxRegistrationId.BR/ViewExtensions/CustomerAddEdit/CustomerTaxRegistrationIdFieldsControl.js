System.register(["PosApi/Entities", "PosApi/Extend/Views/CustomerAddEditView", "PosApi/TypeExtensions", "../../Entities/TaxIdentifiersData"], function (exports_1, context_1) {
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
    var Entities_1, CustomerAddEditView_1, TypeExtensions_1, TaxIdentifiersData_1, CustomerTaxRegistrationIdFieldsControl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Entities_1_1) {
                Entities_1 = Entities_1_1;
            },
            function (CustomerAddEditView_1_1) {
                CustomerAddEditView_1 = CustomerAddEditView_1_1;
            },
            function (TypeExtensions_1_1) {
                TypeExtensions_1 = TypeExtensions_1_1;
            },
            function (TaxIdentifiersData_1_1) {
                TaxIdentifiersData_1 = TaxIdentifiersData_1_1;
            }
        ],
        execute: function () {
            CustomerTaxRegistrationIdFieldsControl = (function (_super) {
                __extends(CustomerTaxRegistrationIdFieldsControl, _super);
                function CustomerTaxRegistrationIdFieldsControl(id, context) {
                    var _this = _super.call(this, id, context) || this;
                    _this.taxIdentifiers = null;
                    _this.isOrganization = ko.observable(false);
                    _this.cnpjCpfNumber = ko.observable(null);
                    _this.ieNumber = ko.observable(null);
                    _this.ccmNumber = ko.observable(null);
                    _this.customerUpdatedHandler = _this._customerUpdatedHandler;
                    return _this;
                }
                CustomerTaxRegistrationIdFieldsControl.prototype.onReady = function (element) {
                    ko.applyBindingsToNode(element, {
                        template: {
                            name: CustomerTaxRegistrationIdFieldsControl.TEMPLATE_ID,
                            data: this
                        }
                    });
                };
                CustomerTaxRegistrationIdFieldsControl.prototype.getResx = function (key) {
                    return this.context.resources.getString(key);
                };
                CustomerTaxRegistrationIdFieldsControl.prototype.init = function (state) {
                    var _this = this;
                    this._loadExtensionPropertyValue();
                    this.cnpjCpfNumber(this.taxIdentifiers.CnpjCpfNumber);
                    this.ieNumber(this.taxIdentifiers.IENumber);
                    this.ccmNumber(this.taxIdentifiers.CcmNumber);
                    this.isVisible = true;
                    this.cnpjCpfNumber.subscribe(function (newValue) {
                        _this.taxIdentifiers.CnpjCpfNumber = newValue;
                        _this.updateExtensionPropertyValue();
                    });
                    this.ieNumber.subscribe(function (newValue) {
                        _this.taxIdentifiers.IENumber = newValue;
                        _this.updateExtensionPropertyValue();
                    });
                    this.ccmNumber.subscribe(function (newValue) {
                        _this.taxIdentifiers.CcmNumber = newValue;
                        _this.updateExtensionPropertyValue();
                    });
                };
                CustomerTaxRegistrationIdFieldsControl.prototype._customerUpdatedHandler = function (data) {
                    this.isOrganization(data.customer.CustomerTypeValue === Entities_1.ProxyEntities.CustomerType.Organization);
                };
                CustomerTaxRegistrationIdFieldsControl.prototype._loadExtensionPropertyValue = function () {
                    try {
                        var propertyValue = this._getPropertyValue(CustomerTaxRegistrationIdFieldsControl.CUSTOMER_EXTENSION_PROPERTY_KEY);
                        if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(propertyValue) || TypeExtensions_1.StringExtensions.isNullOrWhitespace(propertyValue.StringValue)) {
                            this.taxIdentifiers = new TaxIdentifiersData_1.TaxIdentifiersData();
                        }
                        else {
                            this.taxIdentifiers = JSON.parse(propertyValue.StringValue);
                        }
                    }
                    catch (ex) {
                        this.context.logger.logError("CustomerTaxRegistrationIdFieldsControl._loadExtensionPropertyValue(): " + ex.message);
                        throw ex;
                    }
                };
                CustomerTaxRegistrationIdFieldsControl.prototype.updateExtensionPropertyValue = function () {
                    try {
                        var serializedTaxInformation = JSON.stringify(this.taxIdentifiers);
                        var propertyValue = { StringValue: serializedTaxInformation };
                        this._addOrUpdateExtensionProperty(CustomerTaxRegistrationIdFieldsControl.CUSTOMER_EXTENSION_PROPERTY_KEY, propertyValue);
                    }
                    catch (ex) {
                        this.context.logger.logError("CustomerTaxRegistrationIdFieldsControl.updateExtensionPropertyValue(): " + ex.message);
                        throw ex;
                    }
                };
                CustomerTaxRegistrationIdFieldsControl.prototype._getPropertyValue = function (propertyName) {
                    var customer = this.customer;
                    var extensionProperties = customer.ExtensionProperties;
                    extensionProperties = extensionProperties || [];
                    return extensionProperties.filter(function (prop) { return prop.Key === propertyName; })
                        .map(function (prop) { return prop.Value; })[0];
                };
                CustomerTaxRegistrationIdFieldsControl.prototype._addOrUpdateExtensionProperty = function (key, newValue) {
                    var customer = this.customer;
                    var extensionProperty = TypeExtensions_1.ArrayExtensions.firstOrUndefined(customer.ExtensionProperties, function (property) {
                        return property.Key === key;
                    });
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(extensionProperty)) {
                        var newProperty = {
                            Key: key,
                            Value: newValue
                        };
                        if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(customer.ExtensionProperties)) {
                            customer.ExtensionProperties = [];
                        }
                        customer.ExtensionProperties.push(newProperty);
                    }
                    else {
                        extensionProperty.Value = newValue;
                    }
                    this.customer = customer;
                };
                CustomerTaxRegistrationIdFieldsControl.TEMPLATE_ID = "CustomerAddEdit_TaxRegistrationIdFields";
                CustomerTaxRegistrationIdFieldsControl.CUSTOMER_EXTENSION_PROPERTY_KEY = "CustomerTaxIdentifiers_1BBE352C-A90C-4C1A-BBC6-AFAB59CA477D";
                return CustomerTaxRegistrationIdFieldsControl;
            }(CustomerAddEditView_1.CustomerAddEditCustomControlBase));
            exports_1("default", CustomerTaxRegistrationIdFieldsControl);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIj/QYJKoZIhvcNAQcCoIIj7jCCI+oCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // fgj4k9fAr8qVWvABytx+5DrNX1kYEwvpHxtSpFoswO+g
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
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFdQw
// SIG // ghXQAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAGHchdyFVlAxwkAAAAAAYcwDQYJYIZI
// SIG // AWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEE
// SIG // AYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCCphPuFQ958cHQnMHiJ
// SIG // KQ13TmFakOh/lLA1e3ShDuYTnDCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQCIEkln
// SIG // pJs0TdmFLmMnx+9pWjh/3L7Sbi1iHic5tqRxbT+r8LU0
// SIG // HVfOeAnZu2FRPnQgJialYsF85oF+5xkZkHsCwesa1Krx
// SIG // AJ8yhIlWtrFETxFF+6D5uoJeF9xHaAA1ntqxWrS8lE4T
// SIG // B4b5H8j4+8iRJfGxb+ma8+PCd4eySNMr7Bz6SfP61+Wh
// SIG // 6iRzusVnQDi+7sAHULpi5QMUZ4apJitOGaAPPVObUpDT
// SIG // bni4563i7tCUUfP5SC6fE7/RTHuVazHI/2XRSkRQGI+K
// SIG // yv84OOUWpbyKPvjUUyP0dQMXkzt0PlO41w90+P1w+/wB
// SIG // oRUBo6mtNSW0zrzORNOethM05dL+oYIS5DCCEuAGCisG
// SIG // AQQBgjcDAwExghLQMIISzAYJKoZIhvcNAQcCoIISvTCC
// SIG // ErkCAQMxDzANBglghkgBZQMEAgEFADCCAVAGCyqGSIb3
// SIG // DQEJEAEEoIIBPwSCATswggE3AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEILSsWUux0nNpyZsNSTz1
// SIG // nBkO/dJBry+9ZiJMPYHoXGjXAgZfOqnO9WQYEjIwMjAw
// SIG // ODIzMDQwMjQ4LjUzWjAEgAIB9KCB0KSBzTCByjELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0
// SIG // IEFtZXJpY2EgT3BlcmF0aW9uczEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046RDZCRC1FM0U3LTE2ODUxJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wg
// SIG // gg48MIIE8TCCA9mgAwIBAgITMwAAAR4OvOVLFqIDGwAA
// SIG // AAABHjANBgkqhkiG9w0BAQsFADB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMDAeFw0xOTExMTMyMTQwNDBaFw0y
// SIG // MTAyMTEyMTQwNDBaMIHKMQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSUwIwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVy
// SIG // YXRpb25zMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpE
// SIG // NkJELUUzRTctMTY4NTElMCMGA1UEAxMcTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcN
// SIG // AQEBBQADggEPADCCAQoCggEBAM4TtxgQovz18FyurO38
// SIG // G3WqlV+etLFjCViCzevcL+0aVl4USidzKo5r5FFgZB9b
// SIG // 6ncAkfAJxYf6xmQ42HDmtpju+cK2O24q3xu+o1DRp7DF
// SIG // d3261HnBZVRfnEoR7PAIh9eenBq+LFH4Z3pArL3U1y8T
// SIG // wVdBU91WEOvcUyLM6qSpyHIdiuPgz0uC3FuSIPJxrGxq
// SIG // /dfrxO21zCkFwwKfahsVJmMJpRXMdsavoR+gvTdN5pvH
// SIG // RZmsR7bHtBPRmRhAEJiYlLVRdBIBVWOpvXCcxevv7Ufx
// SIG // 8cut3X920zYOxH8NfCfASjP1nVSmt5+WmHd3VXYhtX3M
// SIG // o559eCn8gHZpFLsCAwEAAaOCARswggEXMB0GA1UdDgQW
// SIG // BBSMEyjnkXhG4Ev7fps/2a8n2maKWzAfBgNVHSMEGDAW
// SIG // gBTVYzpcijGQ80N7fEYbxTNoWoVtVTBWBgNVHR8ETzBN
// SIG // MEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAx
// SIG // MC0wNy0wMS5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsG
// SIG // AQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAx
// SIG // LmNydDAMBgNVHRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IBAQAuZNyOdZYj
// SIG // kIITIlQNJeh2NIc83bDeiIBFIO+DmMjbsfaGPuv0L7/5
// SIG // 4xTmR+TMj2ZMn/ebW5pTJoa9Y75oZd8XqFO/KEYBCjah
// SIG // yXC5Bxw+pWqT70BGsg+m0IdGYaFADJYQm6NWC1atY38q
// SIG // 0oscfoZYgGR4THJIkXZpN+7uPr1yA/PkMNK+XdSaCFQG
// SIG // XW5NdSH/Qx5CySF3B8ngEpRos7aoABeaVAfja1FVqxrS
// SIG // o1gx0+bvEXVhBWWvUQGe+b2VQdNpvQ2pUX4S7qRufctS
// SIG // zSiAeBaYECaRCNY5rK1ovLAwiEd3Bg7KntLBolQfHr1w
// SIG // /Vc2s52iScaFReh04dJdfiFtMIIGcTCCBFmgAwIBAgIK
// SIG // YQmBKgAAAAAAAjANBgkqhkiG9w0BAQsFADCBiDELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWljcm9zb2Z0
// SIG // IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIwMTAw
// SIG // HhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAxMjE0NjU1WjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDCCASIwDQYJ
// SIG // KoZIhvcNAQEBBQADggEPADCCAQoCggEBAKkdDbx3EYo6
// SIG // IOz8E5f1+n9plGt0VBDVpQoAgoX77XxoSyxfxcPlYcJ2
// SIG // tz5mK1vwFVMnBDEfQRsalR3OCROOfGEwWbEwRA/xYIiE
// SIG // VEMM1024OAizQt2TrNZzMFcmgqNFDdDq9UeBzb8kYDJY
// SIG // YEbyWEeGMoQedGFnkV+BVLHPk0ySwcSmXdFhE24oxhr5
// SIG // hoC732H8RsEnHSRnEnIaIYqvS2SJUGKxXf13Hz3wV3Ws
// SIG // vYpCTUBR0Q+cBj5nf/VmwAOWRH7v0Ev9buWayrGo8noq
// SIG // CjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn9NxkvaQBwSAJ
// SIG // k3jN/LzAyURdXhacAQVPIk0CAwEAAaOCAeYwggHiMBAG
// SIG // CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBTVYzpcijGQ
// SIG // 80N7fEYbxTNoWoVtVTAZBgkrBgEEAYI3FAIEDB4KAFMA
// SIG // dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAfBgNVHSMEGDAWgBTV9lbLj+iiXGJo0T2UkFvX
// SIG // zpoYxDBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcmwwWgYIKwYB
// SIG // BQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0Nl
// SIG // ckF1dF8yMDEwLTA2LTIzLmNydDCBoAYDVR0gAQH/BIGV
// SIG // MIGSMIGPBgkrBgEEAYI3LgMwgYEwPQYIKwYBBQUHAgEW
// SIG // MWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9QS0kvZG9j
// SIG // cy9DUFMvZGVmYXVsdC5odG0wQAYIKwYBBQUHAgIwNB4y
// SIG // IB0ATABlAGcAYQBsAF8AUABvAGwAaQBjAHkAXwBTAHQA
// SIG // YQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZIhvcNAQELBQAD
// SIG // ggIBAAfmiFEN4sbgmD+BcQM9naOhIW+z66bM9TG+zwXi
// SIG // qf76V20ZMLPCxWbJat/15/B4vceoniXj+bzta1RXCCtR
// SIG // gkQS+7lTjMz0YBKKdsxAQEGb3FwX/1z5Xhc1mCRWS3Tv
// SIG // QhDIr79/xn/yN31aPxzymXlKkVIArzgPF/UveYFl2am1
// SIG // a+THzvbKegBvSzBEJCI8z+0DpZaPWSm8tv0E4XCfMkon
// SIG // /VWvL/625Y4zu2JfmttXQOnxzplmkIz/amJ/3cVKC5Em
// SIG // 4jnsGUpxY517IW3DnKOiPPp/fZZqkHimbdLhnPkd/DjY
// SIG // lPTGpQqWhqS9nhquBEKDuLWAmyI4ILUl5WTs9/S/fmNZ
// SIG // JQ96LjlXdqJxqgaKD4kWumGnEcua2A5HmoDF0M2n0O99
// SIG // g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/nMQekkzr3ZUd4
// SIG // 6PioSKv33nJ+YWtvd6mBy6cJrDm77MbL2IK0cs0d9LiF
// SIG // AR6A+xuJKlQ5slvayA1VmXqHczsI5pgt6o3gMy4SKfXA
// SIG // L1QnIffIrE7aKLixqduWsqdCosnPGUFN4Ib5KpqjEWYw
// SIG // 07t0MkvfY3v1mYovG8chr1m1rtxEPJdQcdeh0sVV42ne
// SIG // V8HR3jDA/czmTfsNv11P6Z0eGTgvvM9YBS7vDaBQNdrv
// SIG // CScc1bN+NR4Iuto229Nfj950iEkSoYICzjCCAjcCAQEw
// SIG // gfihgdCkgc0wgcoxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJTAj
// SIG // BgNVBAsTHE1pY3Jvc29mdCBBbWVyaWNhIE9wZXJhdGlv
// SIG // bnMxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkQ2QkQt
// SIG // RTNFNy0xNjg1MSUwIwYDVQQDExxNaWNyb3NvZnQgVGlt
// SIG // ZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQA5
// SIG // yQbj7emrMRP+jjdYuspZjMqw3KCBgzCBgKR+MHwxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQSAyMDEwMA0GCSqGSIb3DQEB
// SIG // BQUAAgUA4uxoXjAiGA8yMDIwMDgyMzEyMDAzMFoYDzIw
// SIG // MjAwODI0MTIwMDMwWjB3MD0GCisGAQQBhFkKBAExLzAt
// SIG // MAoCBQDi7GheAgEAMAoCAQACAhBCAgH/MAcCAQACAhGQ
// SIG // MAoCBQDi7bneAgEAMDYGCisGAQQBhFkKBAIxKDAmMAwG
// SIG // CisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMB
// SIG // hqAwDQYJKoZIhvcNAQEFBQADgYEAO0DwpYt+sNotvMbQ
// SIG // b2Pf8hJBAK3fliWfJhRMQjoa0rJISRiXJKHhHUS2YXtO
// SIG // Mx+Uz1D9jZkA3tsThkKf2jklPLiRbqSlZ4cXAd4HTSD5
// SIG // 8nhmOVxnZhWR8wgub4JVKi9wox6NyR76jLAoNQ8KeNyv
// SIG // S6SH/e84ovoV2lzcD7F/dJ8xggMNMIIDCQIBATCBkzB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAAR4O
// SIG // vOVLFqIDGwAAAAABHjANBglghkgBZQMEAgEFAKCCAUow
// SIG // GgYJKoZIhvcNAQkDMQ0GCyqGSIb3DQEJEAEEMC8GCSqG
// SIG // SIb3DQEJBDEiBCCOxm6NZOfLHwKc3iQTAjGb8Mx90J+K
// SIG // yK5EkwsBM8TesDCB+gYLKoZIhvcNAQkQAi8xgeowgecw
// SIG // geQwgb0EIHM75FjD33E6UeW9p588oTdxLc0l1ZTx+iIE
// SIG // HA+N1l9HMIGYMIGApH4wfDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAg
// SIG // UENBIDIwMTACEzMAAAEeDrzlSxaiAxsAAAAAAR4wIgQg
// SIG // n/ScMmS3N8OB+l3mibZ4FLRLLRBjqhhx9QzZYI0WCesw
// SIG // DQYJKoZIhvcNAQELBQAEggEAAmK/UIwyVjhvW1qNZUio
// SIG // u14Lg7CryPCv/fUQNVMwFhUgTsxmjTpyolDr+1zEVO1M
// SIG // eHJ7TWfnZdJM4UWKchiRn5MUhvr1OpTyByrM94jTKwtW
// SIG // pTDrU4PuvDowmHewFD+lgsySYNK58pyZBnq5QIzdfzEc
// SIG // 7n556LkyFoOkGuFiooNp4kmH2nPHPD4sIArBF7OkH7CR
// SIG // BgM0aIoM2U9hRaXuRsSwtCCGAPnoEHbpcg5GZL2WOg3E
// SIG // YLkV/aeR9iFp7iCKO7VhMUFZAK1emIGw0OuE1ZCHW2IR
// SIG // Yxxnw6g+NbMD+L6Wu5EAtDIkB1LhcFRQdrAKhanwSqVe
// SIG // UuJC84Z3AJJxFA==
// SIG // End signature block
