/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

/// <reference path="../Helpers/Core.ts" />
/// <reference path="../Helpers/AsyncResult.ts" />

"use strict";

// Web services proxy
// Encapsulates ajax calls to the Ajax services.
module Contoso.Retail.Ecommerce.Sdk.Controls {
    export class WishListWebApi {

        private static proxy;

        public static GetProxy() {
            this.proxy = new AjaxProxy(msaxValues.msax_WishListWebApiUrl + '/');
        }

        public static GetWishList(wishListId: number, callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.CommerceList> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.CommerceList>(callerContext);

            var data = {
                'wishListId': wishListId
            };

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            this.proxy.SubmitRequest(
                "GetWishList",
                data,
                (response) => {
                    asyncResult.resolve(response);
                },
                (errors: ErrorResponse) => {
                    asyncResult.reject(errors.responseJSON);
                });

            return asyncResult;
        }

        public static CreateWishList(wishListName: string, callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.CommerceList> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.CommerceList>(callerContext);

            var data = {
                'wishListName': wishListName
            };

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            this.proxy.SubmitRequest(
                "CreateWishList",
                data,
                (response) => {
                    asyncResult.resolve(response);
                },
                (errors: ErrorResponse) => {
                    asyncResult.reject(errors.responseJSON);
                });

            return asyncResult;
        }

        public static DeleteWishList(wishListId: string, callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.CommerceList> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.CommerceList>(callerContext);

            var data = {
                'wishListId': wishListId
            };

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            this.proxy.SubmitRequest(
                "DeleteWishList",
                data,
                (response) => {
                    asyncResult.resolve(response);
                },
                (errors: ErrorResponse) => {
                    asyncResult.reject(errors.responseJSON);
                });

            return asyncResult;
        }

        public static UpdateWishList(wishList: CommerceProxy.Entities.CommerceList, callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.CommerceList> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.CommerceList>(callerContext);

            var data = {
                'wishList': wishList
            };

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            this.proxy.SubmitRequest(
                "UpdateWishListProperties",
                data,
                (response) => {
                    asyncResult.resolve(response);
                },
                (errors: ErrorResponse) => {
                    asyncResult.reject(errors.responseJSON);
                });

            return asyncResult;
        }

        public static AddLinesToWishList(wishListId: number, wishListLines: CommerceProxy.Entities.CommerceListLine[], callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.CommerceList> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.CommerceList>(callerContext);

            var data = {
                'wishListId': wishListId,
                'wishListLines': wishListLines
            };

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            this.proxy.SubmitRequest(
                "AddLinesToWishList",
                data,
                (response) => {
                    asyncResult.resolve(response);
                },
                (errors: ErrorResponse) => {
                    asyncResult.reject(errors.responseJSON);
                });

            return asyncResult;
        }

        public static RemoveItemsFromWishList(wishListId: number, lineIds: number[], callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.CommerceList> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.CommerceList>(callerContext);

            var data = {
                'wishListId': wishListId,
                'lineIds': lineIds
            };

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            this.proxy.SubmitRequest(
                "RemoveItemsFromWishList",
                data,
                (response) => {
                    asyncResult.resolve(response);
                },
                (errors: ErrorResponse) => {
                    asyncResult.reject(errors.responseJSON);
                });

            return asyncResult;
        }

        public static UpdateLinesOnWishList(wishListId: number, wishListLines: CommerceProxy.Entities.CommerceListLine[], callerContext: any): CommerceProxy.IAsyncResult<CommerceProxy.Entities.CommerceList> {
            var asyncResult = new CommerceProxy.AsyncResult<CommerceProxy.Entities.CommerceList>(callerContext);

            var data = {
                'wishListId': wishListId,
                'wishListLines': wishListLines
            };

            if (Utils.isNullOrUndefined(this.proxy)) {
                this.GetProxy();
            }

            this.proxy.SubmitRequest(
                "UpdateLinesOnWishList",
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