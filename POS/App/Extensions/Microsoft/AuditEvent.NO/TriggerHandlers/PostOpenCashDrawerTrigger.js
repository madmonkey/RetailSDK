System.register(["PosApi/Extend/Triggers/PeripheralTriggers", "../Managers/AuditEventManager"], function (exports_1, context_1) {
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
    var Triggers, AuditEventManager_1, PostOpenCashDrawerTrigger;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Triggers_1) {
                Triggers = Triggers_1;
            },
            function (AuditEventManager_1_1) {
                AuditEventManager_1 = AuditEventManager_1_1;
            }
        ],
        execute: function () {
            PostOpenCashDrawerTrigger = (function (_super) {
                __extends(PostOpenCashDrawerTrigger, _super);
                function PostOpenCashDrawerTrigger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PostOpenCashDrawerTrigger.prototype.execute = function (options) {
                    var auditEventManager = new AuditEventManager_1.default(this.context);
                    return auditEventManager.registerOpenCashDrawerAsync();
                };
                return PostOpenCashDrawerTrigger;
            }(Triggers.PostOpenCashDrawerTrigger));
            exports_1("default", PostOpenCashDrawerTrigger);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkCgYJKoZIhvcNAQcCoIIj+zCCI/cCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // Y3kfhHOnsqoYveZQWLq1nXuKKBh+iEXJfm5BCwyi34Gg
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
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFeEw
// SIG // ghXdAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAGHchdyFVlAxwkAAAAAAYcwDQYJYIZI
// SIG // AWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEE
// SIG // AYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCCoy5xpIyompsTetqBj
// SIG // KdLtpfx5zlAnItCgNK7/eIDETTCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQC6vr77
// SIG // 3HpCgmgVXrg1Lyy0iGANMrIuDWFkICjcAiecB8HscFN8
// SIG // KF3vplXzyR7AnAaS4mgYNKkC+PKFEVIWolurSDdMgwXz
// SIG // BJTLbsHJ2Rj7EbTV1SwDm2EjXjcqcmpvLHzSHJl2WQEp
// SIG // vOOl9q9Sy8NjCsOwsoIzwPmq7Uxb2guuied6WrFuObP/
// SIG // i3weZkT/55qvT9+3fGdq49PHQZEQB50/EgVGpp/x3Okd
// SIG // IBz1ebaJCWO6t19NZdjOwlJwpgYbHn2E8C1AMufDQ0PL
// SIG // uEUL5oe8ZT6w6QXGJ0vP7Hb14IEfkKLTZqgII6eIKzKb
// SIG // 7ptM3x+oANI9V3WJNYXH1nuMuYoioYIS8TCCEu0GCisG
// SIG // AQQBgjcDAwExghLdMIIS2QYJKoZIhvcNAQcCoIISyjCC
// SIG // EsYCAQMxDzANBglghkgBZQMEAgEFADCCAVUGCyqGSIb3
// SIG // DQEJEAEEoIIBRASCAUAwggE8AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEIFrt1STCM352/LyW/i50
// SIG // S0gic2IZGiXEdkgg6N6itqUVAgZfPAgD03sYEzIwMjAw
// SIG // ODIzMDQwMzQzLjk5OVowBIACAfSggdSkgdEwgc4xCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29m
// SIG // dCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNvMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjo4OTdBLUUzNTYtMTcwMTEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDkQwggT1MIID3aADAgECAhMzAAABLCKvRZd1
// SIG // +RvuAAAAAAEsMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTIxOTAxMTUw
// SIG // M1oXDTIxMDMxNzAxMTUwM1owgc4xCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRp
// SIG // b25zIFB1ZXJ0byBSaWNvMSYwJAYDVQQLEx1UaGFsZXMg
// SIG // VFNTIEVTTjo4OTdBLUUzNTYtMTcwMTElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAPK1zgSS
// SIG // q+MxAYo3qpCtQDxSMPPJy6mm/wfEJNjNUnYtLFBwl1BU
// SIG // S5trEk/t41ldxITKehs+ABxYqo4Qxsg3Gy1ugKiwHAnY
// SIG // iiekfC+ZhptNFgtnDZIn45zC0AlVr/6UfLtsLcHCh1XE
// SIG // lLUHfEC0nBuQcM/SpYo9e3l1qY5NdMgDGxCsmCKdiZfY
// SIG // XIu+U0UYIBhdzmSHnB3fxZOBVcr5htFHEBBNt/rFJlm/
// SIG // A4yb8oBsp+Uf0p5QwmO/bCcdqB15JpylOhZmWs0sUfJK
// SIG // lK9ErAhBwGki2eIRFKsQBdkXS9PWpF1w2gIJRvSkDEaC
// SIG // f+lbGTPdSzHSbfREWOF9wY3iYj8CAwEAAaOCARswggEX
// SIG // MB0GA1UdDgQWBBRRahZSGfrCQhCyIyGH9DkiaW7L0zAf
// SIG // BgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNoWoVtVTBW
// SIG // BgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNUaW1T
// SIG // dGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYIKwYBBQUHAQEE
// SIG // TjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0YVBDQV8y
// SIG // MDEwLTA3LTAxLmNydDAMBgNVHRMBAf8EAjAAMBMGA1Ud
// SIG // JQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IB
// SIG // AQBPFxHIwi4vAH49w9Svmz6K3tM55RlW5pPeULXdut2R
// SIG // qy6Ys0+VpZsbuaEoxs6Z1C3hMbkiqZFxxyltxJpuHTyG
// SIG // Tg61zfNIF5n6RsYF3s7IElDXNfZznF1/2iWc6uRPZK8r
// SIG // xxUJ/7emYXZCYwuUY0XjsCpP9pbRRKeJi6r5arSyI+Nf
// SIG // KxvgoM21JNt1BcdlXuAecdd/k8UjxCscffanoK2n6LFw
// SIG // 1PcZlEO7NId7o+soM2C0QY5BYdghpn7uqopB6ixyFIIk
// SIG // DXFub+1E7GmAEwfU6VwEHL7y9rNE8bd+JrQs+yAtkkHy
// SIG // 9FmXg/PsGq1daVzX1So7CJ6nyphpuHSN3VfTMIIGcTCC
// SIG // BFmgAwIBAgIKYQmBKgAAAAAAAjANBgkqhkiG9w0BAQsF
// SIG // ADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMp
// SIG // TWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9y
// SIG // aXR5IDIwMTAwHhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAx
// SIG // MjE0NjU1WjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
// SIG // VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
// SIG // MDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
// SIG // AKkdDbx3EYo6IOz8E5f1+n9plGt0VBDVpQoAgoX77Xxo
// SIG // SyxfxcPlYcJ2tz5mK1vwFVMnBDEfQRsalR3OCROOfGEw
// SIG // WbEwRA/xYIiEVEMM1024OAizQt2TrNZzMFcmgqNFDdDq
// SIG // 9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHPk0ySwcSm
// SIG // XdFhE24oxhr5hoC732H8RsEnHSRnEnIaIYqvS2SJUGKx
// SIG // Xf13Hz3wV3WsvYpCTUBR0Q+cBj5nf/VmwAOWRH7v0Ev9
// SIG // buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn
// SIG // 9NxkvaQBwSAJk3jN/LzAyURdXhacAQVPIk0CAwEAAaOC
// SIG // AeYwggHiMBAGCSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQW
// SIG // BBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkrBgEEAYI3
// SIG // FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYD
// SIG // VR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTV9lbLj+ii
// SIG // XGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBHhkVo
// SIG // dHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9w
// SIG // cm9kdWN0cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0yMy5j
// SIG // cmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5o
// SIG // dHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRz
// SIG // L01pY1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNydDCBoAYD
// SIG // VR0gAQH/BIGVMIGSMIGPBgkrBgEEAYI3LgMwgYEwPQYI
// SIG // KwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9QS0kvZG9jcy9DUFMvZGVmYXVsdC5odG0wQAYIKwYB
// SIG // BQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AUABvAGwAaQBj
// SIG // AHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZI
// SIG // hvcNAQELBQADggIBAAfmiFEN4sbgmD+BcQM9naOhIW+z
// SIG // 66bM9TG+zwXiqf76V20ZMLPCxWbJat/15/B4vceoniXj
// SIG // +bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb3FwX/1z5
// SIG // Xhc1mCRWS3TvQhDIr79/xn/yN31aPxzymXlKkVIArzgP
// SIG // F/UveYFl2am1a+THzvbKegBvSzBEJCI8z+0DpZaPWSm8
// SIG // tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnxzplmkIz/
// SIG // amJ/3cVKC5Em4jnsGUpxY517IW3DnKOiPPp/fZZqkHim
// SIG // bdLhnPkd/DjYlPTGpQqWhqS9nhquBEKDuLWAmyI4ILUl
// SIG // 5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kWumGnEcua2A5H
// SIG // moDF0M2n0O99g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/n
// SIG // MQekkzr3ZUd46PioSKv33nJ+YWtvd6mBy6cJrDm77MbL
// SIG // 2IK0cs0d9LiFAR6A+xuJKlQ5slvayA1VmXqHczsI5pgt
// SIG // 6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdCosnPGUFN
// SIG // 4Ib5KpqjEWYw07t0MkvfY3v1mYovG8chr1m1rtxEPJdQ
// SIG // cdeh0sVV42neV8HR3jDA/czmTfsNv11P6Z0eGTgvvM9Y
// SIG // BS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950iEkSoYIC
// SIG // 0jCCAjsCAQEwgfyhgdSkgdEwgc4xCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xKTAnBgNVBAsTIE1pY3Jvc29mdCBPcGVyYXRp
// SIG // b25zIFB1ZXJ0byBSaWNvMSYwJAYDVQQLEx1UaGFsZXMg
// SIG // VFNTIEVTTjo4OTdBLUUzNTYtMTcwMTElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEB
// SIG // MAcGBSsOAwIaAxUADE5OKSMoNx/mYxYWap1RTOohbJ2g
// SIG // gYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
// SIG // VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
// SIG // MDANBgkqhkiG9w0BAQUFAAIFAOLrzF0wIhgPMjAyMDA4
// SIG // MjIyMDU0NTNaGA8yMDIwMDgyMzIwNTQ1M1owdzA9Bgor
// SIG // BgEEAYRZCgQBMS8wLTAKAgUA4uvMXQIBADAKAgEAAgIa
// SIG // OQIB/zAHAgEAAgIRlTAKAgUA4u0d3QIBADA2BgorBgEE
// SIG // AYRZCgQCMSgwJjAMBgorBgEEAYRZCgMCoAowCAIBAAID
// SIG // B6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEBBQUAA4GB
// SIG // ACXqEMppmWG62WKl4GHAwjvnTg/FvOrsBus0CAvNQxlN
// SIG // Znt2dV5Dm0J52tbyFUjwp4R709JP9tb4QNR9ghxPtMcN
// SIG // RWm7kTYpr0C/qJYkEstSiWOUJUNIyKE1gVK1FXSJ3EYC
// SIG // YetwJWsOv4nVSybgbi+ZR6vWoQ1xmfErXOMuOHpAMYID
// SIG // DTCCAwkCAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTACEzMAAAEsIq9Fl3X5G+4AAAAAASwwDQYJYIZI
// SIG // AWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
// SIG // 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQguogE6g6/0enr
// SIG // VXsGeuAu3THOkC6GiQCgtQ9cFXWlJPswgfoGCyqGSIb3
// SIG // DQEJEAIvMYHqMIHnMIHkMIG9BCBbn/0uFFh42hTM5XOo
// SIG // KdXevBaiSxmYK9Ilcn9nu5ZH4TCBmDCBgKR+MHwxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAABLCKvRZd1
// SIG // +RvuAAAAAAEsMCIEIP77qwrqqSQkWPxa/KsTiyDI1Tur
// SIG // /TzWM58Y/KQSC8gGMA0GCSqGSIb3DQEBCwUABIIBAGCl
// SIG // Y5JRkrUG1dtUzPZ4CZx1SSFD1YTFgh9sfGOlFJERolqx
// SIG // LQJnmHDk2dRJm2ccQ0CcKpYt1mMjOVRnuUPEXGFxR3Nz
// SIG // bu3HU84JEjzFJEKPyd/bsCubpzqOvnpfnWJCNPgqrgD0
// SIG // xx2IKU0LRF4rEINSp7VonQTgHCTbbeVQ5QilC9kL6QFi
// SIG // E+v31DhkmR7qDGFe/kkGeZWiZUiktoP2cTwzPtjsRml+
// SIG // z2JJdcL3blz+1YeIujgZu5GjSGsePEwqD/zFBLJajxEU
// SIG // Dr0e61cLcQei4lDcn8SXxorPlLhc8eEtG9EEX1koA5aE
// SIG // KeuE9HohxfC3oo9YcIgJTw1q8I28IZ4=
// SIG // End signature block
