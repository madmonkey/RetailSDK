System.register(["./FiscalCustomerDialogBase", "../../TaxRegistrationIdPolandConstants", "../../Entities/FiscalCustomerActionType"], function (exports_1, context_1) {
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
    var FiscalCustomerDialogBase_1, TaxRegistrationIdPolandConstants_1, FiscalCustomerActionType_1, FiscalCustomerActionDialog;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (FiscalCustomerDialogBase_1_1) {
                FiscalCustomerDialogBase_1 = FiscalCustomerDialogBase_1_1;
            },
            function (TaxRegistrationIdPolandConstants_1_1) {
                TaxRegistrationIdPolandConstants_1 = TaxRegistrationIdPolandConstants_1_1;
            },
            function (FiscalCustomerActionType_1_1) {
                FiscalCustomerActionType_1 = FiscalCustomerActionType_1_1;
            }
        ],
        execute: function () {
            FiscalCustomerActionDialog = (function (_super) {
                __extends(FiscalCustomerActionDialog, _super);
                function FiscalCustomerActionDialog() {
                    var _this = _super.call(this) || this;
                    _this.hasTransactionCustomer = ko.observable(false);
                    _this.hasFiscalCustomer = ko.observable(false);
                    return _this;
                }
                FiscalCustomerActionDialog.prototype.open = function (options) {
                    this._onBeforeClose = options.onBeforeClose;
                    this.hasTransactionCustomer(options.hasTransactionCustomer);
                    this.hasFiscalCustomer(options.hasFiscalCustomer);
                    return _super.prototype.open.call(this, options);
                };
                FiscalCustomerActionDialog.prototype._getTemplatedDialogOptions = function (options) {
                    var _this = this;
                    return {
                        title: this.getResx("Tax_Registration_ID_PL_Fiscal_Customer_Action_Dialog_Title"),
                        subTitle: this.getResx("Tax_Registration_ID_PL_Fiscal_Customer_Action_Dialog_SubTitle"),
                        onCloseX: function () { return _this._onCancelButtonClick(); },
                        button1: {
                            id: TaxRegistrationIdPolandConstants_1.default.CANCEL_BUTTON_ID,
                            label: this.getResx("Tax_Registration_ID_PL_Cancel_Button_Label"),
                            onClick: function () { return _this._onCancelButtonClick(); }
                        }
                    };
                };
                FiscalCustomerActionDialog.prototype._onEnterManuallyActionButtonClick = function () {
                    this._closeDialogWithResult({
                        canceled: false,
                        data: {
                            fiscalCustomerAction: FiscalCustomerActionType_1.FiscalCustomerActionType.EnterManually
                        }
                    });
                };
                FiscalCustomerActionDialog.prototype._onCopyFromTransactionCustomerActionButtonClick = function () {
                    this._closeDialogWithResult({
                        canceled: false,
                        data: {
                            fiscalCustomerAction: FiscalCustomerActionType_1.FiscalCustomerActionType.CopyFromTransactionCustomer
                        }
                    });
                };
                FiscalCustomerActionDialog.prototype._onClearActionButtonClick = function () {
                    this._closeDialogWithResult({
                        canceled: false,
                        data: {
                            fiscalCustomerAction: FiscalCustomerActionType_1.FiscalCustomerActionType.Clear
                        }
                    });
                };
                FiscalCustomerActionDialog.prototype._onCancelButtonClick = function () {
                    this._closeDialogWithResult({ canceled: true, data: null });
                    return true;
                };
                return FiscalCustomerActionDialog;
            }(FiscalCustomerDialogBase_1.default));
            exports_1("default", FiscalCustomerActionDialog);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIj/gYJKoZIhvcNAQcCoIIj7zCCI+sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // saJXUM7CoS9EdvVIQu5u5Zrwiaz0UE84e5tavsoGhLSg
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
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCCHuruzjFXOJDRgI8qS
// SIG // ttKAUQBw5fVfHywYJw5yJTV4bzCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQC40+3U
// SIG // nmLBLqCSFWDyywEPs3eM4IzNhOU8L7xGWduPfRvX1tfK
// SIG // qZPoCFhdDfnrfr7LG4zumW2EO7R8x0meVwqBtMbpr93c
// SIG // FhNNc418c/31+7JkhaNwPEFWn5tWgs4RF3Lz0l25TThf
// SIG // meHdidFfnR4CvYTjibrmoA9RRL3DXf2MP5h0zNnAbdKj
// SIG // BBD3B9nV8Vd813jmPL4diZ2R6qtofqALpFy64E7P6ENl
// SIG // QyqfvfQ4aArMXF1SzmAqPrWQNgu4FT8lDj6tlKONBs9+
// SIG // dxAeuXht1yCXQNHPj9HnTS5WVPBgjYKUYUkxWc97/Kb2
// SIG // TWqff70StbEU2J7Ez193GBEiegEsoYIS5TCCEuEGCisG
// SIG // AQQBgjcDAwExghLRMIISzQYJKoZIhvcNAQcCoIISvjCC
// SIG // EroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3
// SIG // DQEJEAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEICw/Dhoe/y10bNeCBzev
// SIG // kPMIts/GrWKRL4Ed57nSnOdoAgZfOtY7Sa8YEzIwMjAw
// SIG // ODIzMDQwMjQ3Ljg3NlowBIACAfSggdCkgc0wgcoxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29m
// SIG // dCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRo
// SIG // YWxlcyBUU1MgRVNOOkFFMkMtRTMyQi0xQUZDMSUwIwYD
// SIG // VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNl
// SIG // oIIOPDCCBPEwggPZoAMCAQICEzMAAAEWkyLqv7stTeYA
// SIG // AAAAARYwDQYJKoZIhvcNAQELBQAwfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTAwHhcNMTkxMTEzMjE0MDM0WhcN
// SIG // MjEwMjExMjE0MDM0WjCByjELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3Bl
// SIG // cmF0aW9uczEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // QUUyQy1FMzJCLTFBRkMxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3
// SIG // DQEBAQUAA4IBDwAwggEKAoIBAQDQ+Bvz/b3qJ78uPata
// SIG // r4wiUxnCRJTBmwgp3jva3J5U7I1wqCpIJPjNC/PaR35U
// SIG // PuVhY3dXRRIvmiKl2n7GnvAfsIAcLvM1TbU+N0dY86La
// SIG // iQiU/JOKStAGjCj4w5X1eB3daoyclIoRqeTtCZIeAmKY
// SIG // nar9lFHn7Rnm5lF6MkeRBwmZMHwar/CDYT+CO5GX+IZr
// SIG // h8Ym7RwdJSJfvybkUTJppzVeeSpp9KphHypvuyfdlW3+
// SIG // W1uIZQmvzviiLZtl25S0IxHRCJZZ8EwTFwtXgDp6uYL3
// SIG // xxtu+L+lBvWnWXu9dPY1F4P7GQWrMqfRwDdWL1xzkuMO
// SIG // Fj3UvXxG4ciBTeodAgMBAAGjggEbMIIBFzAdBgNVHQ4E
// SIG // FgQU5b9eK7gX6BfNR+UfeTT+V8ghVQswHwYDVR0jBBgw
// SIG // FoAU1WM6XIoxkPNDe3xGG8UzaFqFbVUwVgYDVR0fBE8w
// SIG // TTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
// SIG // L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIw
// SIG // MTAtMDctMDEuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggr
// SIG // BgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0w
// SIG // MS5jcnQwDAYDVR0TAQH/BAIwADATBgNVHSUEDDAKBggr
// SIG // BgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEANoNq19qp
// SIG // o9sDL+lJ0rx7xd3M3q/33v01JYtSw0eg0EWnKvUVMZy/
// SIG // B/RIoh97TKC3yzymWQBjExR+1SY6c746cZdSBM6t5cjD
// SIG // jO2x6mi2t4dwvT3j5ufs5QYs8xrnoZCKLdZSCIY8/SB8
// SIG // 1eFdypJ130eZeMyEp9GfSM4pEQlM+o8ctdLFwDVJVOuD
// SIG // wkO2QP7JZXO64CRKilMbG0mnk9ythSsxvudbVygh7u2x
// SIG // CJI+nrEVXMp9cVQn1XMAKG5wT7ympculX/FTen/W9/QO
// SIG // AtkykjbabACBt78TrCDINIrIdcjhSyIiVJgBK/4iUo61
// SIG // xfOtdXQhFBR1HIgLVmJZYv9iCDCCBnEwggRZoAMCAQIC
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
// SIG // b25zMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpBRTJD
// SIG // LUUzMkItMUFGQzElMCMGA1UEAxMcTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUA
// SIG // h01b3PJPoIsbWoIM1z76zOzdlkOggYMwgYCkfjB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0B
// SIG // AQUFAAIFAOLr7A4wIhgPMjAyMDA4MjMwMzEwMDZaGA8y
// SIG // MDIwMDgyNDAzMTAwNlowdzA9BgorBgEEAYRZCgQBMS8w
// SIG // LTAKAgUA4uvsDgIBADAKAgEAAgIhjgIB/zAHAgEAAgIR
// SIG // sDAKAgUA4u09jgIBADA2BgorBgEEAYRZCgQCMSgwJjAM
// SIG // BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAID
// SIG // AYagMA0GCSqGSIb3DQEBBQUAA4GBACg5fSJ/W58675mE
// SIG // 3BuhLijtP35/MY7jCoGFuyoxK32cD6Ar4Zy6uWbhRFGL
// SIG // G+GpoJfwE/rUKUqo7KxhiDrO/xu6dIp2sZ4kUcd0/CKf
// SIG // ENkHgDwVt5i7usZX3Vki0tfVyE/qO1EN4ayDVJim7bq+
// SIG // 4Y7j5nriN6qI5AzKjr9HkXoKMYIDDTCCAwkCAQEwgZMw
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEW
// SIG // kyLqv7stTeYAAAAAARYwDQYJYIZIAWUDBAIBBQCgggFK
// SIG // MBoGCSqGSIb3DQEJAzENBgsqhkiG9w0BCRABBDAvBgkq
// SIG // hkiG9w0BCQQxIgQgwtNG32FVlFgTYe/0LP9S/xETRKoH
// SIG // Tiq4IGer37WIhMUwgfoGCyqGSIb3DQEJEAIvMYHqMIHn
// SIG // MIHkMIG9BCCDIpT2pGApCJdcKZshNt20sQ2FjGogyEFo
// SIG // z6Je0sGQyjCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABFpMi6r+7LU3mAAAAAAEWMCIE
// SIG // ICSHi8V1QDEBMDyHIi1vWwjDAo3VOBJBTEHLfzY6NXvj
// SIG // MA0GCSqGSIb3DQEBCwUABIIBAMHJPmQkLNyJkkdMcnO0
// SIG // aohghnW6Pk4MDzLPE4SXUQk5TOtCF7sjewNeYo0p9x7t
// SIG // GF7gpMDSMEFWtBS131steC6KZYiebgMMr1WyVdWq0Xku
// SIG // 1vGdYcx219ba/wt0LjcUwanCLbmSltYYnyrhRU1/1/u0
// SIG // ZRc1VOGyOEzfwkwWll4UKhuMxDjqT6Wupd9WLAS2n6MK
// SIG // vMV8/AnSBUkl/GYg8tk9bHzSJ+ybm29shTRWtu1xTN0G
// SIG // TPXnKesEXIiMLRl1v3Ahk9VmE4RkOxKBZ318tKrlRsc+
// SIG // 5jtDKypwMv1S/uBO2gDNM3TRPcBlk18N95CBnkf+6RyO
// SIG // DpabWDFkqhAnk7A=
// SIG // End signature block
