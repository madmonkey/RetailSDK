System.register(["PosApi/Extend/Triggers/ProductTriggers", "../Managers/AuditEventManager", "../Managers/CartManager"], function (exports_1, context_1) {
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
    var Triggers, AuditEventManager_1, CartManager_1, PostSetQuantityTrigger;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Triggers_1) {
                Triggers = Triggers_1;
            },
            function (AuditEventManager_1_1) {
                AuditEventManager_1 = AuditEventManager_1_1;
            },
            function (CartManager_1_1) {
                CartManager_1 = CartManager_1_1;
            }
        ],
        execute: function () {
            PostSetQuantityTrigger = (function (_super) {
                __extends(PostSetQuantityTrigger, _super);
                function PostSetQuantityTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PostSetQuantityTrigger.prototype.execute = function (options) {
                    var originalCart = CartManager_1.default.Instance.preOperationCartState;
                    var auditEventManager = new AuditEventManager_1.default(this.context);
                    return auditEventManager.registerQuantityCorrection(originalCart, options.cart, options.cartLines);
                };
                return PostSetQuantityTrigger;
            }(Triggers.PostSetQuantityTrigger));
            exports_1("default", PostSetQuantityTrigger);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIj/gYJKoZIhvcNAQcCoIIj7zCCI+sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // X7HNHlehN5Wv3QxaduNG1xFgFChn3lVdqojDK8IvFtyg
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
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCCwQTO+Q8Wc3FCA9FQA
// SIG // 4Ss+iQ1NLAQ8tjzIH9A+0OUaizCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQAuR4oL
// SIG // BODQhajYK/3AhEMFmoss9j+v9wq0WXNbML6LIDJTbgw3
// SIG // j0UovYQNtJFDPTrjRhjQd+104yssppOadipPh43IHmJz
// SIG // D/cJS4NT1pM9xExLkpfKChPljduE+49FTq+jpQcHhQ5B
// SIG // T/OfN4NUaIQgobIZd2ZcgWAgh5aUR3Rh+mm89jY2wmQ/
// SIG // 6uJSMJhpBveP8THCPWL1NluZQufM7Zss8ivLCZq9NmsD
// SIG // QtxMPIcCHmEOvxNeby85UQfECO6mWgJexfdE4lTFYkXA
// SIG // 1q6k/BkiRRoYiFc+EuWOfAvhUHxFpZtfRNwaX+b5kPOa
// SIG // osi6zB7w1VLvaiD+TK46hUH+X26CoYIS5TCCEuEGCisG
// SIG // AQQBgjcDAwExghLRMIISzQYJKoZIhvcNAQcCoIISvjCC
// SIG // EroCAQMxDzANBglghkgBZQMEAgEFADCCAVEGCyqGSIb3
// SIG // DQEJEAEEoIIBQASCATwwggE4AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEICGeBB+34wvGXjrP9WLv
// SIG // ETjCVEpzNe7XiODwqZ7Y+EuIAgZfOtZaQ1QYEzIwMjAw
// SIG // ODIzMDQwMjQ5LjE1MVowBIACAfSggdCkgc0wgcoxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29m
// SIG // dCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRo
// SIG // YWxlcyBUU1MgRVNOOjQ5QkMtRTM3QS0yMzNDMSUwIwYD
// SIG // VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNl
// SIG // oIIOPDCCBPEwggPZoAMCAQICEzMAAAEXMWB+B3YxngkA
// SIG // AAAAARcwDQYJKoZIhvcNAQELBQAwfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTAwHhcNMTkxMTEzMjE0MDM0WhcN
// SIG // MjEwMjExMjE0MDM0WjCByjELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3Bl
// SIG // cmF0aW9uczEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // NDlCQy1FMzdBLTIzM0MxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3
// SIG // DQEBAQUAA4IBDwAwggEKAoIBAQDGoVKfLa3NA8rIexFW
// SIG // 9hNORuKty0RJHVp9cm5S9TzwV1pLt2b0IhuS34m/6dT3
// SIG // Z2tITxhCuDgpi4MH/ZRFfyoBWLfifYAZAOny4gfPJ7xY
// SIG // SueSYz5kV5f3Bb0iUtThO8iKZzD0qDvTs7Ck/Cb9prU6
// SIG // OSybSsYXbnTd153lrRXOv/LXgzkU1j9ai8OVnfi/DC8Z
// SIG // sdhAA5CVVqdBtLDUSgyCgyj6Gm61EOB6ev+TGeT8+L2P
// SIG // FmWyg3IyOaYU4mCF/KH17Kam68DpDmQhkrUvp8cKEh+L
// SIG // b2FzUH3gfAYyKsE/X+T9n9rJ6hdjJRWE+oVhuP6BFPZi
// SIG // TyjK1GBS3Br+ku0rAgMBAAGjggEbMIIBFzAdBgNVHQ4E
// SIG // FgQUrlTbVt+Jiw/aTrTku/g4ZOitwwUwHwYDVR0jBBgw
// SIG // FoAU1WM6XIoxkPNDe3xGG8UzaFqFbVUwVgYDVR0fBE8w
// SIG // TTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29t
// SIG // L3BraS9jcmwvcHJvZHVjdHMvTWljVGltU3RhUENBXzIw
// SIG // MTAtMDctMDEuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggr
// SIG // BgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraS9jZXJ0cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0w
// SIG // MS5jcnQwDAYDVR0TAQH/BAIwADATBgNVHSUEDDAKBggr
// SIG // BgEFBQcDCDANBgkqhkiG9w0BAQsFAAOCAQEAX9eFGaV5
// SIG // il343zaD0iCwX4ozTEHbBU0ZlPBfdQhTA4TeR+jOLLNB
// SIG // VlmOlI5nhdGRJ8XoDrYClC4YBS2WyGHvB5QdU2ObKoHF
// SIG // 9Km7b5uGwXyKL0pxG67WOQCBFu5njGsnv5br10MrnIng
// SIG // B07XtwGwU/qud74pO6loQMXw8GXK4X8LfyZkQ7puXeFA
// SIG // Gbh37MxEPtOy/oYze4FGTMoO7p0BZOSxaNPYbzntPJV9
// SIG // w2yIcU/apPcIJEiEi9X/q1n8EVJvIBrtSxxqCI7OGaPJ
// SIG // QOZBp22EKBiBMf31XPFdy/VFECjZlsXqgxEZsh1h/pRx
// SIG // WLuU036vdev+E0/wf4sQs3JnjDCCBnEwggRZoAMCAQIC
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
// SIG // b25zMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjo0OUJD
// SIG // LUUzN0EtMjMzQzElMCMGA1UEAxMcTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUA
// SIG // nfRlKh4RUfN6uJlchlzaRGMwQdKggYMwgYCkfjB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0B
// SIG // AQUFAAIFAOLr7DwwIhgPMjAyMDA4MjMwMzEwNTJaGA8y
// SIG // MDIwMDgyNDAzMTA1MlowdzA9BgorBgEEAYRZCgQBMS8w
// SIG // LTAKAgUA4uvsPAIBADAKAgEAAgIaQAIB/zAHAgEAAgIR
// SIG // nTAKAgUA4u09vAIBADA2BgorBgEEAYRZCgQCMSgwJjAM
// SIG // BgorBgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAID
// SIG // AYagMA0GCSqGSIb3DQEBBQUAA4GBACH1wyPTMOU/3psH
// SIG // vDr5MCFaHtdXrKX2hqOfW3USgsVPrcrK/s5yMN25xLrh
// SIG // 4pQ+TPavOiesSDHHKeXBKzhOoRf2vLoY+MwSlUbofqy6
// SIG // bnssmRWW3LVMrNZIIZ70vJ345AYSEA7hFWKjQDFvNnJp
// SIG // UidPTzHEg6OwKXBKAOzkBYleMYIDDTCCAwkCAQEwgZMw
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEX
// SIG // MWB+B3YxngkAAAAAARcwDQYJYIZIAWUDBAIBBQCgggFK
// SIG // MBoGCSqGSIb3DQEJAzENBgsqhkiG9w0BCRABBDAvBgkq
// SIG // hkiG9w0BCQQxIgQgizaL2aZdl0Lq8Iq0LzkZL7W1g7YN
// SIG // pQH8SeZtFg9Si7AwgfoGCyqGSIb3DQEJEAIvMYHqMIHn
// SIG // MIHkMIG9BCBsaWbI4rJZzF+6mB+PamU50s2ERAmJ3+ru
// SIG // OB/I2thfJDCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABFzFgfgd2MZ4JAAAAAAEXMCIE
// SIG // IDmUGBd0bl2axPySmgVhnAqN3p6DrtMJEaDEPki71+lr
// SIG // MA0GCSqGSIb3DQEBCwUABIIBAGpJ5OFsLf12IX0lDel9
// SIG // yEWNkbyYRPL2CZQWI1yzjBnS4biYoZrQAAn4Oa+HYhrW
// SIG // BkGOk4DG7xRMvgMyBsKNTzZjhh+s5dVIalOE5B+JpMIU
// SIG // +AB70VpVHbdX7Qo4F2p48Pu4V9Tii27Akt2s/nfdDJ+k
// SIG // wCiwITEqcrCofU3ojAx3OHUQ3QVUIpn7u73m4AgrwAZ0
// SIG // jk1qo1T77gQVoG9q+acTMZrYFy3FY7/AFmvaysFeZRw9
// SIG // K4HaOi+EUU/tUluM52t9qtg91H5LxVtLfbSI6f0N5R0a
// SIG // mPuwOTSEuJvMaE8iePc9O6AMuF923NRCOaD3MQSV8bQw
// SIG // PRunnfGT0ia6DsQ=
// SIG // End signature block
