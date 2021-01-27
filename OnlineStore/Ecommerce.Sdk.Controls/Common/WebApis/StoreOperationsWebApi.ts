/// <reference path="../Helpers/Core.ts" />
/// <reference path="../Helpers/AsyncResult.ts" />

"use strict";

// Web services proxy
// Encapsulates ajax calls to the Ajax services.
module Microsoft.Dynamics.Retail.Ecommerce.Sdk.Controls {
    export class StoreOperationsWebApi {
        private static proxy;

        public static GetProxy() {
            this.proxy = new AjaxProxy(msaxValues.msax_StoreOperationsWebApiUrl + '/');
        }

        public static GetCountryRegionInfo(languageId: string, callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.CountryRegionInfo[]> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.CountryRegionInfo[]>(callerContext);

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            var data = {
                'languageId': languageId,
                'queryResultSettings': Core.getDefaultQueryResultSettings()
            };

            this.proxy.SubmitRequest(
                "GetCountryRegionInfo",
                data,
                (response) => {
                    asyncResult.resolve(response);
                },
                (errors: ErrorResponse) => {
                    asyncResult.reject(errors.responseJSON);
                });

            return asyncResult;
        }

        public static GetStateProvinceInfo(countryCode: string, callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.StateProvinceInfo[]> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.StateProvinceInfo[]>(callerContext);

            var data = {
                'countryCode': countryCode,
                'queryResultSettings': Core.getDefaultQueryResultSettings()
            };

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            this.proxy.SubmitRequest(
                "GetStateProvinceInfo",
                data,
                (response) => {
                    asyncResult.resolve(response);
                },
                (errors: ErrorResponse) => {
                    asyncResult.reject(errors.responseJSON);
                });

            return asyncResult;
        }
        
        public static GetGiftCardBalance(giftCardNumber: string, callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.GiftCard> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.GiftCard>(callerContext);

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            var data = {
                "giftCardId": giftCardNumber
            };

            this.proxy.SubmitRequest(
                "GetGiftCardInformation",
                data,
                (response) => {
                    asyncResult.resolve(response);
                },
                (errors: ErrorResponse) => {
                    asyncResult.reject(errors.responseJSON);
                });

            return asyncResult;
        }

        public static RetrieveCardPaymentAcceptResult(cardPaymentResultAccessCode: string, callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.CardPaymentAcceptResult> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.CardPaymentAcceptResult>(callerContext);

            var data = {
                "cardPaymentResultAccessCode": cardPaymentResultAccessCode
            };

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            this.proxy.SubmitRequest(
                "RetrieveCardPaymentAcceptResult",
                data,
                (response) => {
                    asyncResult.resolve(response);
                },
                (errors: ErrorResponse) => {
                    asyncResult.reject(errors.responseJSON);
                });

            return asyncResult;
        }
    }
}