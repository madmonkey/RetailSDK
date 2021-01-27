System.register(["PosApi/Extend/Views/AddressAddEditView", "PosApi/TypeExtensions", "../../Entities/DataServiceEntities.g", "../../Entities/GSTType", "../../Entities/TaxRegistrationType", "../../Entities/TaxType", "../../Managers/TaxRegistrationIdManager"], function (exports_1, context_1) {
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
    var AddressAddEditView_1, TypeExtensions_1, DataServiceEntities_g_1, GSTType_1, TaxRegistrationType_1, TaxType_1, TaxRegistrationIdManager_1, AddressTaxRegistrationIdFieldsControl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (AddressAddEditView_1_1) {
                AddressAddEditView_1 = AddressAddEditView_1_1;
            },
            function (TypeExtensions_1_1) {
                TypeExtensions_1 = TypeExtensions_1_1;
            },
            function (DataServiceEntities_g_1_1) {
                DataServiceEntities_g_1 = DataServiceEntities_g_1_1;
            },
            function (GSTType_1_1) {
                GSTType_1 = GSTType_1_1;
            },
            function (TaxRegistrationType_1_1) {
                TaxRegistrationType_1 = TaxRegistrationType_1_1;
            },
            function (TaxType_1_1) {
                TaxType_1 = TaxType_1_1;
            },
            function (TaxRegistrationIdManager_1_1) {
                TaxRegistrationIdManager_1 = TaxRegistrationIdManager_1_1;
            }
        ],
        execute: function () {
            AddressTaxRegistrationIdFieldsControl = (function (_super) {
                __extends(AddressTaxRegistrationIdFieldsControl, _super);
                function AddressTaxRegistrationIdFieldsControl(id, context) {
                    var _this = _super.call(this, id, context) || this;
                    _this.gstTypeValue = ko.observable(null);
                    _this.gstRegistrationNumber = ko.observable(TypeExtensions_1.StringExtensions.EMPTY);
                    _this.tinRegistrationNumber = ko.observable(TypeExtensions_1.StringExtensions.EMPTY);
                    _this.gstBusinessVerticalsValue = ko.observable(null);
                    _this.gstBusinessVerticals = ko.observableArray([]);
                    _this.gstTypes = ko.observableArray(_this._getGstTypeToNameMap());
                    _this.taxRegistrationIdManager = new TaxRegistrationIdManager_1.default(context);
                    return _this;
                }
                AddressTaxRegistrationIdFieldsControl.prototype.onReady = function (element) {
                    ko.applyBindingsToNode(element, {
                        template: {
                            name: AddressTaxRegistrationIdFieldsControl.TEMPLATE_ID,
                            data: this
                        }
                    });
                };
                AddressTaxRegistrationIdFieldsControl.prototype.getResx = function (key) {
                    return this.context.resources.getString(key);
                };
                AddressTaxRegistrationIdFieldsControl.prototype.init = function (state) {
                    var _this = this;
                    this.isVisible = true;
                    var loadDictionaryPromise = this._loadDictionariesAsync();
                    loadDictionaryPromise.then(function () {
                        _this._loadExtensionPropertyValue();
                        _this.gstTypeValue(_this._getGstTypeValue());
                        _this.gstRegistrationNumber(_this._getGstRegistrationNumberValue());
                        _this.gstBusinessVerticalsValue(_this._getGstBusinessVerticalsValue());
                        _this.tinRegistrationNumber(_this._getTinRegistrationNumberValue());
                        _this.gstTypeValue.subscribe(function (newValue) {
                            _this._setGstTypeValue(newValue);
                            _this.updateExtensionPropertyValue();
                        });
                        _this.gstRegistrationNumber.subscribe(function (newValue) {
                            _this._setGstRegistrationNumberValue(newValue);
                            _this.updateExtensionPropertyValue();
                        });
                        _this.gstBusinessVerticalsValue.subscribe(function (newValue) {
                            _this._setGstBusinessVerticalsValue(newValue);
                            _this.updateExtensionPropertyValue();
                        });
                        _this.tinRegistrationNumber.subscribe(function (newValue) {
                            _this._setTinRegistrationNumberValue(newValue);
                            _this.updateExtensionPropertyValue();
                        });
                    });
                };
                AddressTaxRegistrationIdFieldsControl.prototype._loadDictionariesAsync = function () {
                    var _this = this;
                    return this.taxRegistrationIdManager.getBusinessVerticals().then(function (businessVerticals) {
                        _this.gstBusinessVerticals.push.apply(_this.gstBusinessVerticals, businessVerticals);
                        return Promise.resolve();
                    })
                        .catch(function (ex) {
                        _this.context.logger.logError("AddressTaxRegistrationIdFieldsControl._loadDictionariesAsync(): " + ex.message);
                    });
                };
                AddressTaxRegistrationIdFieldsControl.prototype._loadExtensionPropertyValue = function () {
                    try {
                        var propertyValue = this._getPropertyValue(AddressTaxRegistrationIdFieldsControl.ADDRESS_EXTENSION_PROPERTY_KEY);
                        if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(propertyValue) || TypeExtensions_1.StringExtensions.isNullOrWhitespace(propertyValue.StringValue)) {
                            this.addressTaxInformation = new DataServiceEntities_g_1.Entities.AddressTaxInformationIndia();
                        }
                        else {
                            this.addressTaxInformation = JSON.parse(propertyValue.StringValue);
                        }
                    }
                    catch (ex) {
                        this.context.logger.logError("AddressTaxRegistrationIdFieldsControl._loadExtensionPropertyValue(): " + ex.message);
                        throw ex;
                    }
                };
                AddressTaxRegistrationIdFieldsControl.prototype.updateExtensionPropertyValue = function () {
                    try {
                        var serializedTaxInformation = JSON.stringify(this.addressTaxInformation);
                        var propertyValue = { StringValue: serializedTaxInformation };
                        this._addOrUpdateExtensionProperty(AddressTaxRegistrationIdFieldsControl.ADDRESS_EXTENSION_PROPERTY_KEY, propertyValue);
                    }
                    catch (ex) {
                        this.context.logger.logError("AddressTaxRegistrationIdFieldsControl.updateExtensionPropertyValue(): " + ex.message);
                        throw ex;
                    }
                };
                AddressTaxRegistrationIdFieldsControl.prototype._getPropertyValue = function (propertyName) {
                    var address = this.address;
                    var extensionProperties = address.ExtensionProperties;
                    extensionProperties = extensionProperties || [];
                    return extensionProperties.filter(function (prop) { return prop.Key === propertyName; })
                        .map(function (prop) { return prop.Value; })[0];
                };
                AddressTaxRegistrationIdFieldsControl.prototype._addOrUpdateExtensionProperty = function (key, newValue) {
                    var address = this.address;
                    var extensionProperty = TypeExtensions_1.ArrayExtensions.firstOrUndefined(address.ExtensionProperties, function (property) {
                        return property.Key === key;
                    });
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(extensionProperty)) {
                        var newProperty = {
                            Key: key,
                            Value: newValue
                        };
                        if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(address.ExtensionProperties)) {
                            address.ExtensionProperties = [];
                        }
                        address.ExtensionProperties.push(newProperty);
                    }
                    else {
                        extensionProperty.Value = newValue;
                    }
                    this.address = address;
                };
                AddressTaxRegistrationIdFieldsControl.prototype._getGstTypeToNameMap = function () {
                    var _this = this;
                    return Object.keys(GSTType_1.GstType)
                        .filter(function (key) { return !isNaN(Number(GSTType_1.GstType[key])); })
                        .map(function (key) {
                        var element = {
                            Id: GSTType_1.GstType[key],
                            Type: key,
                            Name: _this.getResx(key)
                        };
                        return element;
                    });
                };
                AddressTaxRegistrationIdFieldsControl.prototype._getGstTypeValue = function () {
                    var taxRegistrationNumber = this.addressTaxInformation.GstinRegistrationNumber;
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(taxRegistrationNumber)) {
                        return TypeExtensions_1.StringExtensions.EMPTY;
                    }
                    var gstType = TypeExtensions_1.ArrayExtensions.firstOrUndefined(this.gstTypes(), function (gstType) {
                        return gstType.Id === taxRegistrationNumber.Type;
                    });
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(gstType)) {
                        return TypeExtensions_1.StringExtensions.EMPTY;
                    }
                    return gstType.Type;
                };
                AddressTaxRegistrationIdFieldsControl.prototype._getGstRegistrationNumberValue = function () {
                    var taxRegistrationNumber = this.addressTaxInformation.GstinRegistrationNumber;
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(taxRegistrationNumber)) {
                        return TypeExtensions_1.StringExtensions.EMPTY;
                    }
                    return taxRegistrationNumber.RegistrationNumber;
                };
                AddressTaxRegistrationIdFieldsControl.prototype._getGstBusinessVerticalsValue = function () {
                    var taxRegistrationNumber = this.addressTaxInformation.GstinRegistrationNumber;
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(taxRegistrationNumber)) {
                        return TypeExtensions_1.StringExtensions.EMPTY;
                    }
                    var businessVertical = TypeExtensions_1.ArrayExtensions.firstOrUndefined(this.gstBusinessVerticals(), function (bv) {
                        return bv.RecId === taxRegistrationNumber.BusinessVerticals;
                    });
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(businessVertical)) {
                        return TypeExtensions_1.StringExtensions.EMPTY;
                    }
                    return businessVertical.Name;
                };
                AddressTaxRegistrationIdFieldsControl.prototype._getTinRegistrationNumberValue = function () {
                    var taxRegistrationNumber = this.addressTaxInformation.TinRegistrationNumber;
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(taxRegistrationNumber)) {
                        return TypeExtensions_1.StringExtensions.EMPTY;
                    }
                    return taxRegistrationNumber.RegistrationNumber;
                };
                AddressTaxRegistrationIdFieldsControl.prototype._setGstTypeValue = function (newValue) {
                    var gstType = TypeExtensions_1.ArrayExtensions.firstOrUndefined(this.gstTypes(), function (gstType) {
                        return gstType.Type === newValue;
                    });
                    var taxRegistrationNumber = this._getTaxRegistrationNumberForEditing(TaxType_1.TaxType.Gst);
                    if (!TypeExtensions_1.ObjectExtensions.isNullOrUndefined(gstType)) {
                        taxRegistrationNumber.Type = gstType.Id;
                    }
                    else {
                        this._clearGstRegistrationNumber();
                        this.gstRegistrationNumber(null);
                        this.gstBusinessVerticalsValue(null);
                    }
                };
                AddressTaxRegistrationIdFieldsControl.prototype._setGstRegistrationNumberValue = function (newValue) {
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(newValue)) {
                        return;
                    }
                    if (TypeExtensions_1.StringExtensions.isEmptyOrWhitespace(newValue)) {
                        this._clearGstRegistrationNumber();
                        this.gstTypeValue(null);
                        this.gstBusinessVerticalsValue(null);
                        return;
                    }
                    var taxRegistrationNumber = this._getTaxRegistrationNumberForEditing(TaxType_1.TaxType.Gst);
                    taxRegistrationNumber.RegistrationNumber = newValue;
                };
                AddressTaxRegistrationIdFieldsControl.prototype._setGstBusinessVerticalsValue = function (newValue) {
                    var businessVertical = TypeExtensions_1.ArrayExtensions.firstOrUndefined(this.gstBusinessVerticals(), function (bv) {
                        return bv.Name === newValue;
                    });
                    var taxRegistrationNumber = this._getTaxRegistrationNumberForEditing(TaxType_1.TaxType.Gst);
                    if (!TypeExtensions_1.ObjectExtensions.isNullOrUndefined(businessVertical)) {
                        taxRegistrationNumber.BusinessVerticals = businessVertical.RecId;
                    }
                    else {
                        taxRegistrationNumber.BusinessVerticals = 0;
                    }
                };
                AddressTaxRegistrationIdFieldsControl.prototype._clearGstRegistrationNumber = function () {
                    this.addressTaxInformation.Gstin = 0;
                    this.addressTaxInformation.GstinRegistrationNumber = null;
                };
                AddressTaxRegistrationIdFieldsControl.prototype._setTinRegistrationNumberValue = function (newValue) {
                    if (TypeExtensions_1.StringExtensions.isEmptyOrWhitespace(newValue)) {
                        this.addressTaxInformation.Tin = 0;
                        this.addressTaxInformation.TinRegistrationNumber = null;
                        return;
                    }
                    var taxRegistrationNumber = this._getTaxRegistrationNumberForEditing(TaxType_1.TaxType.VAT);
                    taxRegistrationNumber.RegistrationNumber = newValue;
                };
                AddressTaxRegistrationIdFieldsControl.prototype._getTaxRegistrationNumberForEditing = function (taxType) {
                    var taxRegistrationNumber = null;
                    switch (taxType) {
                        case TaxType_1.TaxType.Gst:
                            taxRegistrationNumber = this.addressTaxInformation.GstinRegistrationNumber;
                            if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(taxRegistrationNumber)) {
                                taxRegistrationNumber = new DataServiceEntities_g_1.Entities.TaxRegistrationNumberIndia();
                                this.addressTaxInformation.GstinRegistrationNumber = taxRegistrationNumber;
                            }
                            break;
                        case TaxType_1.TaxType.VAT:
                            taxRegistrationNumber = this.addressTaxInformation.TinRegistrationNumber;
                            if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(taxRegistrationNumber)) {
                                taxRegistrationNumber = new DataServiceEntities_g_1.Entities.TaxRegistrationNumberIndia();
                                this.addressTaxInformation.TinRegistrationNumber = taxRegistrationNumber;
                            }
                            break;
                        default:
                            throw Error("The tax type " + taxType + " is not supported");
                    }
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(taxRegistrationNumber.TaxType)) {
                        taxRegistrationNumber.TaxType = taxType;
                    }
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(taxRegistrationNumber.RegistrationType)) {
                        taxRegistrationNumber.RegistrationType = TaxRegistrationType_1.TaxRegistrationType.Customers;
                    }
                    if (TypeExtensions_1.ObjectExtensions.isNullOrUndefined(taxRegistrationNumber.RecId) || taxRegistrationNumber.RecId !== 0) {
                        taxRegistrationNumber.RecId = 0;
                    }
                    return taxRegistrationNumber;
                };
                AddressTaxRegistrationIdFieldsControl.TEMPLATE_ID = "AddressAddEdit_TaxRegistrationIdFields";
                AddressTaxRegistrationIdFieldsControl.ADDRESS_EXTENSION_PROPERTY_KEY = "AddressTaxInformation";
                return AddressTaxRegistrationIdFieldsControl;
            }(AddressAddEditView_1.AddressAddEditCustomControlBase));
            exports_1("default", AddressTaxRegistrationIdFieldsControl);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // ATVZukB5ZLH5jKh6sh60clQMb25aIgwdOKyUu78XaQ2g
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgrVodrd2kIguW
// SIG // CAZRdmfpSFBN1xLGjjVg8ReB71WdjMUwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // HKAV3MW4qIM1JZJJ6nhfbtaNcT2/yuszeavQsGiiXupk
// SIG // whWIaANTQmBO4WC9EXOG1wcUD34MIfVulGa0eTq0L2Fn
// SIG // 5FSIgBU/vNcUPWE0V2dUUnUMU73CBnUn7BqBDp2TjflQ
// SIG // 6ZMGFeAX6BVlItewffRHu7y/OQ9UHB+De82nqbfFwdTl
// SIG // nuHNECVjC/w5qsbiIbf6f+QOCprt3kVz+wV22Vz+Zec0
// SIG // 3f3U1wJiTRosNMB0lLzhAOAXO9QcAyB4dOEM5SW6eMpp
// SIG // g5MWoCY4ptTozmcG2k8Jjk1bnPJ/geD/1ufRAGphYZtl
// SIG // fhByxJ0zEKU765sp0r2Ccs8JUIavf79Xt6GCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCD8nwE2iNo9CA2l
// SIG // 4vfaqo200jnswGobYxDWWj5Hpt3TewIGXz1cRSvLGBMy
// SIG // MDIwMDgyMzA0MDI0OC4wMTJaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjpGQzQxLTRCRDQtRDIyMDEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjwwggTxMIID2aADAgECAhMzAAABEiRzozWG
// SIG // aRMPAAAAAAESMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTky
// SIG // MVoXDTIxMDEyMTIzMTkyMVowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOkZDNDEtNEJENC1EMjIwMSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu6qZFTcvUER3
// SIG // cKUQtII+fc65iE3g/nzOFBWXlhq0natrEhYiFban6yB2
// SIG // g63om0QbMNOFeMHJqYGm3ZRfvBgTYOEWfmjyKStpNuUK
// SIG // TBmFSSxUkrGxDjgVkhyKkGH8ccm0tC7bp96hnQaibH3Y
// SIG // ZXzKvi+BN2gJcsRMH5Pag2bh1Fd8vRMlMHxyw4bBKWWw
// SIG // pKTSG40bxbGu8CXesKGRAQXdaSXu5smJqyjJc3l4b9JN
// SIG // xsI77b05ftEwnU4IwqWKaLafgQDaqVB9knFmaVnrnvBS
// SIG // +2iA3YrVbnkxll51Cr3HhPTwL0IlCbKmyn5VzKS+TCB7
// SIG // SUk+emsVreWqTcMj/q8eCQIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFNI6cB8LTElgKyq0wjLMBsZ2ZVtdMB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBADkR
// SIG // L6+Rr9IK9WNFlicuz6GQuZX3YQOb552L+/8QLNlrlf3V
// SIG // ARdRLxP9qc+tRMui6Y06H6xMT+WShwmrVVtLTUERI+Gv
// SIG // kc9hZz7/oMflUVZe1sD2mV3SIl8IZlCr3KLeXXGlFVEF
// SIG // ccYAc3J0y3P/ZwhP/xOqGcPEKzDwra4qKuhIiBMXk5E7
// SIG // mzu2LL0893ZgXQ33P4CBbXx6e0xWo4Ev38tiOrXTK2rU
// SIG // AnndOSyYOaEiFmLxbNMWsMYumqDDdRapwttcQCEQBJjg
// SIG // zdPVf9Ma66apKiKfDlP987i0CvgUZm6fK0gD/tgTgB20
// SIG // atNJGhqG3eard9HxbD2qhum8J9i9R+AwggZxMIIEWaAD
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
// SIG // RkM0MS00QkQ0LUQyMjAxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVABLgK9aEKr7Q8p7XpXg4xcwzAoq8oIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi688pMCIYDzIwMjAwODIzMDEwNjQ5
// SIG // WhgPMjAyMDA4MjQwMTA2NDlaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOLrzykCAQAwCgIBAAICHzMCAf8wBwIB
// SIG // AAICEY8wCgIFAOLtIKkCAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQAiMRLaRzCy
// SIG // hrRsuGsjI1AI2WtPBiuprm+UFSQBpIOz38Ju6640xoh8
// SIG // pB2MNGWICpxx6Kr5PDn7m0AbinoQRvoFQFrvaPPFAocE
// SIG // Ty5ioBMhmBEkFvqLUNkkDuGJZRgal9q5yw2FqzP+u5ZC
// SIG // 8Wjq+zZZ1JnlB/sU+tEuHRdk7uKmizGCAw0wggMJAgEB
// SIG // MIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAABEiRzozWGaRMPAAAAAAESMA0GCWCGSAFlAwQCAQUA
// SIG // oIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQw
// SIG // LwYJKoZIhvcNAQkEMSIEIPS9dYAIRmGHm1B3B8sBSCDp
// SIG // 0A8iyTiRDJt9iBN232jvMIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgJBKwgr/oIhqKqTnIKXhi2KT7J37J
// SIG // GDCPgxE0dZc6llMwgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAARIkc6M1hmkTDwAAAAAB
// SIG // EjAiBCCD7DydT4d7nK4bMesrGH/zRm1COBGPA2k8YdeN
// SIG // xSTvVDANBgkqhkiG9w0BAQsFAASCAQBwuUT0PE3ZrSu3
// SIG // 6NqiA/dLLPeRYvARzd9thdN9OjKOwCZklBY4No3Z3IyP
// SIG // +afQK6UkGWqQHKOagMSRsWTUoFgPW6oZjGlyk+vwtGbq
// SIG // EsXsKPtoR1x1x0iSbIownS8Gz/pYbIpXaN9K20yF2qxC
// SIG // kcaK3hTuH1bTMre3YICeogxIV3btHQfUf9xX5MI+nfkr
// SIG // MKFhAVVcQeP3nT5jUb9HNIapIU6P6vJ1jnVWLxSjg1Dc
// SIG // 8DlXZtNpo5qMOs3oK1Us+BRitqNDWNJp+8ucZxSE83mr
// SIG // USCbLKLWAFpDn2rYWIgjsFKLjFcjly5sFBpM5pU4VLrY
// SIG // Z0S/OSym/SOIS+argbj4
// SIG // End signature block
