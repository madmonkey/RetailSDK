System.register(["./FiscalCustomerDialogBase", "../../TaxRegistrationIdItalyConstants"], function (exports_1, context_1) {
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
    var FiscalCustomerDialogBase_1, TaxRegistrationIdItalyConstants_1, ClearConfirmationDialog;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (FiscalCustomerDialogBase_1_1) {
                FiscalCustomerDialogBase_1 = FiscalCustomerDialogBase_1_1;
            },
            function (TaxRegistrationIdItalyConstants_1_1) {
                TaxRegistrationIdItalyConstants_1 = TaxRegistrationIdItalyConstants_1_1;
            }
        ],
        execute: function () {
            ClearConfirmationDialog = (function (_super) {
                __extends(ClearConfirmationDialog, _super);
                function ClearConfirmationDialog() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ClearConfirmationDialog.prototype.open = function (options) {
                    this._onBeforeClose = options.onBeforeClose;
                    return _super.prototype.open.call(this, options);
                };
                ClearConfirmationDialog.prototype._getTemplatedDialogOptions = function (options) {
                    var _this = this;
                    return {
                        title: options.title,
                        subTitle: options.subTitle,
                        onCloseX: function () { return _this._onNoButtonClick(); },
                        button1: {
                            id: TaxRegistrationIdItalyConstants_1.default.YES_BUTTON_ID,
                            label: this.getResx("Yes_Button_Label"),
                            isPrimary: true,
                            onClick: function () { return _this._onYesButtonClick(); }
                        },
                        button2: {
                            id: TaxRegistrationIdItalyConstants_1.default.NO_BUTTON_ID,
                            label: this.getResx("No_Button_Label"),
                            isPrimary: false,
                            onClick: function () { return _this._onNoButtonClick(); }
                        }
                    };
                };
                ClearConfirmationDialog.prototype._onYesButtonClick = function () {
                    this._closeDialogWithResult({ canceled: false });
                    return false;
                };
                ClearConfirmationDialog.prototype._onNoButtonClick = function () {
                    this._closeDialogWithResult({ canceled: true });
                    return false;
                };
                return ClearConfirmationDialog;
            }(FiscalCustomerDialogBase_1.default));
            exports_1("default", ClearConfirmationDialog);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkAQYJKoZIhvcNAQcCoIIj8jCCI+4CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // 3VRXHR31DnbsPnkYQghIDw875hag7L9ChexgJlO2+ZOg
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
// SIG // ghXUMIIV0AIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABiK9S1rmSbej5AAAAAAGIMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBJzAZBgkqhkiG9w0BCQMxDAYK
// SIG // KwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYKKwYB
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgT2R0XPOfCL2z
// SIG // tT7QA+pK0xiIB6Ay0cEVM29+vZR8Ca8wgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // Nf6Gh8ayiOYBEiFKTkU8IKMiDsrh7MBBvzW+A6ptBw6X
// SIG // 4i2q9Hdmwa2PI++hzBb01n5L3RUgRscHtDYOjCOPOiC8
// SIG // R/8k2YTDXnO2iiF9ST2PkF6vkJhLBpOp6szwmS3Hekvg
// SIG // +FvMUUFilre0MdBlsgvNB9wHZm3oQKufHxJTKAnjpuxe
// SIG // Pa47ZvIAFzAt+lj3GfmH8M+I7lq9iMQ42kRNgrGM+JCQ
// SIG // jUcN/qOGdfmaiq0XspJ3ih+zjeW1j6fTJYZ9HGf6HTHM
// SIG // SlLgOEdIURljOcEkrbTgzk2yC/Yx2q8rYxbv89M7XBO+
// SIG // jH8OOGFsOETaGJs5l6Ri0AUfpoAua6D3TaGCEuQwghLg
// SIG // BgorBgEEAYI3AwMBMYIS0DCCEswGCSqGSIb3DQEHAqCC
// SIG // Er0wghK5AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFQBgsq
// SIG // hkiG9w0BCRABBKCCAT8EggE7MIIBNwIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCCNzuXd/LKvqxzZ
// SIG // TTzGPAfHLd7DEciozFt/8XGdsK1avAIGXz0rl4bLGBIy
// SIG // MDIwMDgyMzA0MDI0OC45OVowBIACAfSggdCkgc0wgcox
// SIG // CzAJBgNVBAYTAlVTMQswCQYDVQQIEwJXQTEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJl
// SIG // bGFuZCBPcGVyYXRpb25zIExpbWl0ZWQxJjAkBgNVBAsT
// SIG // HVRoYWxlcyBUU1MgRVNOOjhENDEtNEJGNy1CM0I3MSUw
// SIG // IwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2
// SIG // aWNloIIOPDCCBPEwggPZoAMCAQICEzMAAAEKUsg5AVLR
// SIG // cEsAAAAAAQowDQYJKoZIhvcNAQELBQAwfDELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBIDIwMTAwHhcNMTkxMDIzMjMxOTE1
// SIG // WhcNMjEwMTIxMjMxOTE1WjCByjELMAkGA1UEBhMCVVMx
// SIG // CzAJBgNVBAgTAldBMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTAr
// SIG // BgNVBAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlv
// SIG // bnMgTGltaXRlZDEmMCQGA1UECxMdVGhhbGVzIFRTUyBF
// SIG // U046OEQ0MS00QkY3LUIzQjcxJTAjBgNVBAMTHE1pY3Jv
// SIG // c29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqG
// SIG // SIb3DQEBAQUAA4IBDwAwggEKAoIBAQC7PhutlKFwxZ+G
// SIG // ePU/V0pMke215HSX8PcLX1hjYUbyCERBFs7/wEwrbwMI
// SIG // ZdOo7NDqcIUhXXt3kxg1OqBJxuozVcCJ8JwRy/VI79p1
// SIG // ZeLbSv3aMMxouOzoqaNL/Dmb8CT9UEcqq3PF18vMv1cZ
// SIG // fk8ZphuVSGPM0eWsJvE1kfPXCJsYzsZturq0jEI6XBh9
// SIG // hpuKQq8KSXvoqCE37EZWrYWy3uhRJnsrd4Tq2YgYsyWQ
// SIG // /aQF20db73ZWwItXG4TUly4IQ0pcQi9/UH3fsVu06q8/
// SIG // yNvc7MfIcmnYOUPOyFMBh0EW519K/mg/xYgMhtmZlnzm
// SIG // vHnr5npzJTiwbBuhnwUnAgMBAAGjggEbMIIBFzAdBgNV
// SIG // HQ4EFgQU+ESUpf06TE1Q3pH4Oq0BopFxhSgwHwYDVR0j
// SIG // BBgwFoAU1WM6XIoxkPNDe3xGG8UzaFqFbVUwVgYDVR0f
// SIG // BE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENB
// SIG // XzIwMTAtMDctMDEuY3JsMFoGCCsGAQUFBwEBBE4wTDBK
// SIG // BggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0w
// SIG // Ny0wMS5jcnQwDAYDVR0TAQH/BAIwADATBgNVHSUEDDAK
// SIG // BggrBgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEAVJeu
// SIG // fNQV8t3TcyWq0Su3nVYZfdRcV6isTp0Zj5gjBKZ8VEpE
// SIG // 3AR7xyYu3QQ7F7PJNXr7991hPKs9w8O+BHeToXmwd4oT
// SIG // GiGOupyPEBrfJVD1IllqRdlUrNodbNu8y4DyRybOPQn9
// SIG // jr+mTntoWyn+Sv6W7lo13DlXdaCK0linATp+hlCwGtNM
// SIG // 81GEhdUwec8STqzb7ucLpPL1ksgmFh4zKou6K0kYq8SJ
// SIG // GEPw9jOQYmcuSOnrUgIOT/TRlVm++Vcuie2HfZmih5n3
// SIG // /7vrSj2DaVSEXyhoscIHWLzZ1QKFd3Nm6VQTBDkJlaHx
// SIG // YiNBlJS6847W9XQV86p03BwPJe4V0jCCBnEwggRZoAMC
// SIG // AQICCmEJgSoAAAAAAAIwDQYJKoZIhvcNAQELBQAwgYgx
// SIG // CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9u
// SIG // MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xMjAwBgNVBAMTKU1pY3Jv
// SIG // c29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eSAy
// SIG // MDEwMB4XDTEwMDcwMTIxMzY1NVoXDTI1MDcwMTIxNDY1
// SIG // NVowfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMd
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwggEi
// SIG // MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCpHQ28
// SIG // dxGKOiDs/BOX9fp/aZRrdFQQ1aUKAIKF++18aEssX8XD
// SIG // 5WHCdrc+Zitb8BVTJwQxH0EbGpUdzgkTjnxhMFmxMEQP
// SIG // 8WCIhFRDDNdNuDgIs0Ldk6zWczBXJoKjRQ3Q6vVHgc2/
// SIG // JGAyWGBG8lhHhjKEHnRhZ5FfgVSxz5NMksHEpl3RYRNu
// SIG // KMYa+YaAu99h/EbBJx0kZxJyGiGKr0tkiVBisV39dx89
// SIG // 8Fd1rL2KQk1AUdEPnAY+Z3/1ZsADlkR+79BL/W7lmsqx
// SIG // qPJ6Kgox8NpOBpG2iAg16HgcsOmZzTznL0S6p/TcZL2k
// SIG // AcEgCZN4zfy8wMlEXV4WnAEFTyJNAgMBAAGjggHmMIIB
// SIG // 4jAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4EFgQU1WM6
// SIG // XIoxkPNDe3xGG8UzaFqFbVUwGQYJKwYBBAGCNxQCBAwe
// SIG // CgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB
// SIG // /wQFMAMBAf8wHwYDVR0jBBgwFoAU1fZWy4/oolxiaNE9
// SIG // lJBb186aGMQwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYtMjMuY3JsMFoG
// SIG // CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXRfMjAxMC0wNi0yMy5jcnQwgaAGA1UdIAEB
// SIG // /wSBlTCBkjCBjwYJKwYBBAGCNy4DMIGBMD0GCCsGAQUF
// SIG // BwIBFjFodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vUEtJ
// SIG // L2RvY3MvQ1BTL2RlZmF1bHQuaHRtMEAGCCsGAQUFBwIC
// SIG // MDQeMiAdAEwAZQBnAGEAbABfAFAAbwBsAGkAYwB5AF8A
// SIG // UwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3DQEB
// SIG // CwUAA4ICAQAH5ohRDeLG4Jg/gXEDPZ2joSFvs+umzPUx
// SIG // vs8F4qn++ldtGTCzwsVmyWrf9efweL3HqJ4l4/m87WtU
// SIG // VwgrUYJEEvu5U4zM9GASinbMQEBBm9xcF/9c+V4XNZgk
// SIG // Vkt070IQyK+/f8Z/8jd9Wj8c8pl5SpFSAK84Dxf1L3mB
// SIG // ZdmptWvkx872ynoAb0swRCQiPM/tA6WWj1kpvLb9BOFw
// SIG // nzJKJ/1Vry/+tuWOM7tiX5rbV0Dp8c6ZZpCM/2pif93F
// SIG // SguRJuI57BlKcWOdeyFtw5yjojz6f32WapB4pm3S4Zz5
// SIG // Hfw42JT0xqUKloakvZ4argRCg7i1gJsiOCC1JeVk7Pf0
// SIG // v35jWSUPei45V3aicaoGig+JFrphpxHLmtgOR5qAxdDN
// SIG // p9DvfYPw4TtxCd9ddJgiCGHasFAeb73x4QDf5zEHpJM6
// SIG // 92VHeOj4qEir995yfmFrb3epgcunCaw5u+zGy9iCtHLN
// SIG // HfS4hQEegPsbiSpUObJb2sgNVZl6h3M7COaYLeqN4DMu
// SIG // Ein1wC9UJyH3yKxO2ii4sanblrKnQqLJzxlBTeCG+Sqa
// SIG // oxFmMNO7dDJL32N79ZmKLxvHIa9Zta7cRDyXUHHXodLF
// SIG // VeNp3lfB0d4wwP3M5k37Db9dT+mdHhk4L7zPWAUu7w2g
// SIG // UDXa7wknHNWzfjUeCLraNtvTX4/edIhJEqGCAs4wggI3
// SIG // AgEBMIH4oYHQpIHNMIHKMQswCQYDVQQGEwJVUzELMAkG
// SIG // A1UECBMCV0ExEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsGA1UE
// SIG // CxMkTWljcm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9ucyBM
// SIG // aW1pdGVkMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo4
// SIG // RDQxLTRCRjctQjNCNzElMCMGA1UEAxMcTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIa
// SIG // AxUAOb12pXHRf+5RrRVyRXbiGmhj3vmggYMwgYCkfjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDANBgkqhkiG
// SIG // 9w0BAQUFAAIFAOLsRzowIhgPMjAyMDA4MjMwOTM5MDZa
// SIG // GA8yMDIwMDgyNDA5MzkwNlowdzA9BgorBgEEAYRZCgQB
// SIG // MS8wLTAKAgUA4uxHOgIBADAKAgEAAgIKGgIB/zAHAgEA
// SIG // AgIRljAKAgUA4u2YugIBADA2BgorBgEEAYRZCgQCMSgw
// SIG // JjAMBgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIB
// SIG // AAIDAYagMA0GCSqGSIb3DQEBBQUAA4GBAEp5xYQX+ih8
// SIG // tX3Gm/YopkkQ1CJyTOUcDe1RqJBb8xq2DzSiKDDMtpGg
// SIG // rbpz9xVfEF00tAxZXA9rER4Tu2Tz6YyHU9JxlV+96QO8
// SIG // rGGxj7tj1lzr7/ZDtT84a7SYVbn/MiWyakUhpRNdNyKa
// SIG // qLYa3wDdbS072XfQ635ZmeIGQiWhMYIDDTCCAwkCAQEw
// SIG // gZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMd
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMA
// SIG // AAEKUsg5AVLRcEsAAAAAAQowDQYJYIZIAWUDBAIBBQCg
// SIG // ggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG9w0BCRABBDAv
// SIG // BgkqhkiG9w0BCQQxIgQge4BXZ6J1IxI7FOcBPWoXSnQd
// SIG // +8ntS/LFAUGktn9LaokwgfoGCyqGSIb3DQEJEAIvMYHq
// SIG // MIHnMIHkMIG9BCBXAzYkM7qhDCgN6EbxXbZtR3HNkNZa
// SIG // GSMYHzfL5NKsqjCBmDCBgKR+MHwxCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFBDQSAyMDEwAhMzAAABClLIOQFS0XBLAAAAAAEK
// SIG // MCIEIBqZiGzGyIFc26q+oooMu/H2aOjzZBnUZTqvwvMj
// SIG // KN1IMA0GCSqGSIb3DQEBCwUABIIBAB1Xd/nEysPo4D+K
// SIG // asVFb6I02i2f3iVTt+3vDsBsy+tCJR1yYcgd6NgEALPd
// SIG // R0M7pdpYgbBFgX1UWo4xozmVhhTHGVpIG/+/DKlDODk0
// SIG // 3AsRQBbBN0Y9qJuFlcaXwEbWwZIBFVfcWp3g4iCXeVyG
// SIG // weZ9AvVN57aQtmUnv0fpf8+hjOHlDJYhooItn9s4+Fc4
// SIG // KnZIkIcNtOK9abJ89aeK176U26dTd5QNVz5S97g1kI4S
// SIG // 3VdP+k21QciHrbjOdjruD0fQHfjnWAAOEorPnUwMonEW
// SIG // iNxiCTp9JKmIBDYto6Z0bA6v6w1tevXODUOD0oeJrGmo
// SIG // iqQ9SWibopgjFc9dMDM=
// SIG // End signature block
