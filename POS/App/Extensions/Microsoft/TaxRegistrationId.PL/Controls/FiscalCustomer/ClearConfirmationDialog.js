System.register(["./FiscalCustomerDialogBase", "../../TaxRegistrationIdPolandConstants"], function (exports_1, context_1) {
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
    var FiscalCustomerDialogBase_1, TaxRegistrationIdPolandConstants_1, ClearConfirmationDialog;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (FiscalCustomerDialogBase_1_1) {
                FiscalCustomerDialogBase_1 = FiscalCustomerDialogBase_1_1;
            },
            function (TaxRegistrationIdPolandConstants_1_1) {
                TaxRegistrationIdPolandConstants_1 = TaxRegistrationIdPolandConstants_1_1;
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
                            id: TaxRegistrationIdPolandConstants_1.default.YES_BUTTON_ID,
                            label: this.getResx("Tax_Registration_ID_PL_Yes_Button_Label"),
                            isPrimary: true,
                            onClick: function () { return _this._onYesButtonClick(); }
                        },
                        button2: {
                            id: TaxRegistrationIdPolandConstants_1.default.NO_BUTTON_ID,
                            label: this.getResx("Tax_Registration_ID_PL_No_Button_Label"),
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
// SIG // MIIkDgYJKoZIhvcNAQcCoIIj/zCCI/sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // OrWIIZ1li1G5OvyLqfKC67Mcq4H34LoH81y3e2wGJEWg
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQg7xHTbgf3tBKI
// SIG // +wJk5ofrMLorMFZRBXel1z/Pg64hYRMwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // GgUJ8iw3fXm+U84+hsp1VSoLRjb1KwcFX2LETpH9yZhm
// SIG // KUIjlp2XD4Nuoc4CN2KteK1+cbZxPcIyxZUYo0sq+ney
// SIG // 0E/g+RPo4YywP4nLAB4CYZ3hyhbwX3QC8Oe1JpaYkerx
// SIG // 4nWv9dUtjg4al7nEHiYXMj3B5JGXRSZZBsyDUe4vsvEp
// SIG // JNcLlu1Z4XtmaQ8y5gnE1nR0ImYxKOwAFMD05KDCywAr
// SIG // vgNR3SRqhxF7B4N0aAQiPH1e2FEYntrOFt32puxuJU71
// SIG // xvF5wvg0JdOPW0hPVXcf2113mElW7+ZglSg3lgcwXaw6
// SIG // HYm+eJ9pDiFQ5NaxzhKD5LeQWnMMPG3Al6GCEvEwghLt
// SIG // BgorBgEEAYI3AwMBMYIS3TCCEtkGCSqGSIb3DQEHAqCC
// SIG // EsowghLGAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFVBgsq
// SIG // hkiG9w0BCRABBKCCAUQEggFAMIIBPAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCDugX0TMCTTBAny
// SIG // 8fMQkRLdbfOm5z+gxQ6rK1esJuzhTwIGXzvjWnM5GBMy
// SIG // MDIwMDgyMzA0MDI0OS45NThaMASAAgH0oIHUpIHRMIHO
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEmMCQG
// SIG // A1UECxMdVGhhbGVzIFRTUyBFU046NjBCQy1FMzgzLTI2
// SIG // MzUxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFNlcnZpY2Wggg5EMIIE9TCCA92gAwIBAgITMwAAASbf
// SIG // uksiuYKCBwAAAAABJjANBgkqhkiG9w0BAQsFADB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTEyMTkw
// SIG // MTE0NTlaFw0yMTAzMTcwMTE0NTlaMIHOMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3NvZnQgT3Bl
// SIG // cmF0aW9ucyBQdWVydG8gUmljbzEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046NjBCQy1FMzgzLTI2MzUxJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Uw
// SIG // ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCe
// SIG // ML6GnE7zDZV0E7XxfwseTpd19H3I1DTL4y4E5juflh2C
// SIG // RW6e9uT9/qrxSg0UB1hCNUs9IAduLq1QyI14wYeTVTSV
// SIG // TECSNrZbb+zOP+CG4WSW98c0Fuy6JRKGWFGWpwU1Lspc
// SIG // vaLAoOKOY6FYk9hrZssSvhb+ZAttJdqKXmnqbXfxO3Hg
// SIG // wBUTPO4YjQrCvyh8gvvPrMJ5YOIEznsus0Koc4DbBuh6
// SIG // 4ywbg7Q7PYswDMEtslk9E+dkAPYd0PgdQvabNnzCjHvg
// SIG // x6RvtHOtQ/eGIenFdlx4m+EgQp8CBWQHmRNlCeKjwDUm
// SIG // KMyPDx/hOawk90lamLx6Lvex7F7z9iNzAgMBAAGjggEb
// SIG // MIIBFzAdBgNVHQ4EFgQUSausHxewfphCjdFYpl/GozQO
// SIG // YUEwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8UzaFqF
// SIG // bVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWlj
// SIG // VGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoGCCsGAQUF
// SIG // BwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQ
// SIG // Q0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0TAQH/BAIwADAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsF
// SIG // AAOCAQEAQJb7nWjpb/Qn87+em51+NXMxerS7RyweOpel
// SIG // 1HIfqjTeOWZjkxcC6LdyY8Eq5+KMnEPakxE9UxQ2HdUD
// SIG // Q9C4l5is/TqgV2oukvF3cgkBGb3y/NoyALPacLAEOl71
// SIG // fYzcmz0rUYBf7DgDPw3sn5no/U4PRXEcF2p5NqoM3WWT
// SIG // W/BqBM3u39aK3ExdEPPSFF1iJZsBMEBWBdcI5/OzeGcS
// SIG // /Wf8QNpv0dc4sxcpVj/5qWpgp1X2WS5GnxSzVDVZnL3P
// SIG // vYDO73HibN+3d8nWm5OMEejm0d+LFmi6aZsj5bCNUKuS
// SIG // 7umyQlqF82LlqZKCuqBHqdYDC+kkQtxylUt1LHGYbTCC
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
// SIG // bGVzIFRTUyBFU046NjBCQy1FMzgzLTI2MzUxJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wi
// SIG // IwoBATAHBgUrDgMCGgMVAApnMjlpmcRK6atOgfHcuqDG
// SIG // ev/8oIGDMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTAwDQYJKoZIhvcNAQEFBQACBQDi7FBrMCIYDzIw
// SIG // MjAwODIzMDYxODE5WhgPMjAyMDA4MjQwNjE4MTlaMHcw
// SIG // PQYKKwYBBAGEWQoEATEvMC0wCgIFAOLsUGsCAQAwCgIB
// SIG // AAICJYsCAf8wBwIBAAICEPQwCgIFAOLtoesCAQAwNgYK
// SIG // KwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAqAKMAgC
// SIG // AQACAwehIKEKMAgCAQACAwGGoDANBgkqhkiG9w0BAQUF
// SIG // AAOBgQCy34sVD7ZFta+OLdZZSPP/4tL+SYEYPr9OJKD8
// SIG // 3saIDXU/uAE4n7iRBIq8zI9SQQdIGXmBytIrE7tl1TRB
// SIG // s63fkgodXq6VyTY3zFRgnq39ABC80oVV+RQWnBlcGhSp
// SIG // AvlkJgDHtvfr+wElz7Bkwd5X5DtSaQO/2lz2Efg+Kq/8
// SIG // pjGCAw0wggMJAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABJt+6SyK5goIHAAAAAAEmMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYL
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIH8Psu0+
// SIG // awnitStw10R7kYTLa9qZSvNbNW895Bo2995IMIH6Bgsq
// SIG // hkiG9w0BCRACLzGB6jCB5zCB5DCBvQQgNv3P7569XnAM
// SIG // 72qTlmdsRnwJM65H6RnK7zFtOwkJdQ8wgZgwgYCkfjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAASbf
// SIG // uksiuYKCBwAAAAABJjAiBCAnQAXY/kXVd/uAwnmUJRKE
// SIG // u1EhxgZS0w6X3T4J85tqtzANBgkqhkiG9w0BAQsFAASC
// SIG // AQB0KVnHqlR9AmItuTo3SGCd7GVfHAQ+zouvefpua20E
// SIG // wCmU4zep/kKak3tXBbVI1VGjGiUF+jYPmEx1crIJZQoW
// SIG // sYyhq+irfomESWplI7OyjyAFdQJCDzCr5lwAfHNBuJpM
// SIG // 1OIhBBg5pvzmkWf24M871YxrDR04hGRfJYuiEe4oTbFn
// SIG // 44t/fnz8OgwMgmMm6morE2micLPVVtgQO7B45SB5MefI
// SIG // wE0Aze0rdchMnmJstu+6XjOztMGNthryadOGQ9dhZUSY
// SIG // UE00oynZigseLYWenB0pE5DLCB0EwDcD9R0Ru55tbi8f
// SIG // nGyyDLenKWh0iiplX3RklCKr1hU4yL9MFKY0
// SIG // End signature block
