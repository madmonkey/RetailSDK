System.register(["PosApi/Entities", "./DataServiceEntities.g", "PosApi/Consume/DataService"], function (exports_1, context_1) {
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
    var Entities_1, DataServiceEntities_g_1, DataService_1, StoreOperations;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Entities_1_1) {
                Entities_1 = Entities_1_1;
            },
            function (DataServiceEntities_g_1_1) {
                DataServiceEntities_g_1 = DataServiceEntities_g_1_1;
            },
            function (DataService_1_1) {
                DataService_1 = DataService_1_1;
            }
        ],
        execute: function () {
            exports_1("ProxyEntities", Entities_1.ProxyEntities);
            exports_1("Entities", DataServiceEntities_g_1.Entities);
            (function (StoreOperations) {
                var GetBusinessVerticalsIndiaResponse = (function (_super) {
                    __extends(GetBusinessVerticalsIndiaResponse, _super);
                    function GetBusinessVerticalsIndiaResponse() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return GetBusinessVerticalsIndiaResponse;
                }(DataService_1.DataServiceResponse));
                StoreOperations.GetBusinessVerticalsIndiaResponse = GetBusinessVerticalsIndiaResponse;
                var GetBusinessVerticalsIndiaRequest = (function (_super) {
                    __extends(GetBusinessVerticalsIndiaRequest, _super);
                    function GetBusinessVerticalsIndiaRequest() {
                        var _this = _super.call(this) || this;
                        _this._entitySet = "";
                        _this._entityType = "";
                        _this._method = "GetBusinessVerticalsIndia";
                        _this._parameters = {};
                        _this._isAction = true;
                        _this._returnType = DataServiceEntities_g_1.Entities.BusinessVerticalIndia;
                        _this._isReturnTypeCollection = true;
                        return _this;
                    }
                    return GetBusinessVerticalsIndiaRequest;
                }(DataService_1.DataServiceRequest));
                StoreOperations.GetBusinessVerticalsIndiaRequest = GetBusinessVerticalsIndiaRequest;
            })(StoreOperations || (StoreOperations = {}));
            exports_1("StoreOperations", StoreOperations);
        }
    };
});

// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // SkreOy+sQXb6BGW3/5LGMhn2W+wjJhOWbjq9EpMe08Wg
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgrPMivyCa8HK6
// SIG // 21yvMmrsKwiNbRCEUuEpSQUjearfzqEwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // bsvCng6NDLnYrFQfVfyu3lMzgwql04+Z7HbzuhEf2E6f
// SIG // 82rftq6wJLoaVwisg8VLC32tp9VJOj2JElbc5SWaR/UP
// SIG // bg/Fz8glUUF3u8CFs4c12lTLpLV8z+fMkPTx6HJAaVoW
// SIG // Knk0A4aEKpFFHPDpPda0BzB3CaMRMP5WKt7FILTYwnV6
// SIG // HpNyEg2bE00TCJZuDXXvyWSDTnlDyv3VNjXncNinx3QQ
// SIG // bD8nv7ARsniI7PfU9vPU82YyRuNJ5uS3b+EI6bBUnio2
// SIG // 41sO6VQHKGTJ49wflYEEF2V3RKbYDxcbZvZDTsmcYlBI
// SIG // tGAjufBVl+kAGQQQJyIwZuqPONZemsQ5hKGCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCCG8LQl0vOIssJD
// SIG // YolC3DrDYIZ7EjmTLBJK7Is+wWf1JQIGXz0tUEjiGBMy
// SIG // MDIwMDgyMzA0MDI0Ny43MjRaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjozQkQ0LTRCODAtNjlDMzEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjwwggTxMIID2aADAgECAhMzAAABC+T5vo9v
// SIG // TB3QAAAAAAELMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTkx
// SIG // NVoXDTIxMDEyMTIzMTkxNVowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOjNCRDQtNEI4MC02OUMzMSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlwLVnUYxQbjP
// SIG // g9p4VCi1blr/XGXKtf/HpspEAaZQ4ovA6sMAjZw9MyYc
// SIG // +5/eFrVoxbHOSi/3RfIClkzER+TFU2uXcQibulbWaG3P
// SIG // rM7TPtCTzOVZnG/+w/gJRRERgJEBhsTv2eH8Rx9fxHGf
// SIG // 4sFIps2n14wTpSEN0UsVAI/fNJYrgMjQq4/CXbpxkd51
// SIG // Ukb8SbVqVGb5SFK2GOCw5iSbBbCPILHIdy63IZj3gZKM
// SIG // bL8u0aSoXDkLU2GnA+PL8+3809nInIiagF8Wbe37YfLI
// SIG // KiolFEQlbkpXFClwV5v9XXGAiqjqFM9mBrtotLeCv19e
// SIG // yVmeY3Tdb8as0kGvT+Dx8QIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFK0f2eodih6c4JgNUERl//dtXt7vMB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBACbo
// SIG // o52p7za0ut3vOwitIMCJiPAuCXYcSyz5wOpv6VEl1npf
// SIG // Sgmt7feTUTTt+jYHpg8YbJM+61R4lIoG9aSXZvkweUoY
// SIG // Ng5T4tVIXQk2jeZU1mfqxwBXwyOItoHSjsHcroO95uY2
// SIG // tnanw05dg4uWscHAYA7xrGS3wZvmhrrdr1BgQYNUIzCn
// SIG // 6kBqjCQmMFzxnR5sETdVDeTKTkQZE5pNgxFlo0ZtCykN
// SIG // f3leCmIlOXFeBgtP/P6v1+9cG68Hch9mcr4dpiDhPuE/
// SIG // ZmXOx9As2fEHakx3dsW009RkjUXnmGJZ05FpQohC42JC
// SIG // Jx1H8LpgtaQrmTH+CEzcOyo3jhj8ig0wggZxMIIEWaAD
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
// SIG // M0JENC00QjgwLTY5QzMxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVAPH9+R0xalPc8IoSPZLZrD4KcDBSoIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi7EjyMCIYDzIwMjAwODIzMDk0NjI2
// SIG // WhgPMjAyMDA4MjQwOTQ2MjZaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOLsSPICAQAwCgIBAAICE8gCAf8wBwIB
// SIG // AAICEbIwCgIFAOLtmnICAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQCkNQQJqOWf
// SIG // QOmhZXofOjMMyNuVwAt6O1rrXhwVnxILUvjjB6Q1s7yl
// SIG // /gaYFWLh/+/gxHrSQezfbOqw29H22uYMpNZgFAsbhYC9
// SIG // Hc86z5r3i5S/zWQbMSipU3xubU93gQMJd3wrTr5y9Y5t
// SIG // rgRlkrgAESJIioOkvOZK8kH0GX9OdjGCAw0wggMJAgEB
// SIG // MIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAABC+T5vo9vTB3QAAAAAAELMA0GCWCGSAFlAwQCAQUA
// SIG // oIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQw
// SIG // LwYJKoZIhvcNAQkEMSIEIES1me5Jc5BW8AC4M8jGn2/9
// SIG // 4HT98KFSiIMPra2IcX5SMIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgNI/QziBTPjokl/FwJFwF4r0UdCzx
// SIG // wOnFVPwEwBNcc4gwgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAQvk+b6Pb0wd0AAAAAAB
// SIG // CzAiBCA5udfQ2Y/UoPJCKg5eTSvEcxnNqgNrUtuCaQTI
// SIG // 3Dd1ozANBgkqhkiG9w0BAQsFAASCAQBd+UNSXxGkoZ2l
// SIG // EtHRemyiprv8s1pS/enA67mvCq5uumMPokmZjvs+uKVg
// SIG // 2iiDhk7+K3RlfIHmzUhEHXJ+ydiUPJF1uyCncA/H4XGK
// SIG // HSkv+yJOLFu9BiCx4CN7QIM+OXWX+7g9L3WhbKp8jUWr
// SIG // DSbahiRyjDU2fzl8NVRRNK1RYuS3YeOVKtopJq6za9Xy
// SIG // dvQxJiiPsNTjnKiEs0V3/05HzUn1nU6xCgMRJuupaXjx
// SIG // mXrv6XjYtfx1HGw60J0pMBkIOoMBmp38WZgOjWrf+Z0q
// SIG // O+Mm44Ptf4kPcHPcVTLOmkZLL/lx17p76PKcZNKJAfPB
// SIG // 9MX8NVx/lAH4L3bmM7HW
// SIG // End signature block
