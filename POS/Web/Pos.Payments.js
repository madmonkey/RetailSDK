"use strict";
var Commerce;
(function (Commerce) {
    var Peripherals;
    (function (Peripherals) {
        var HardwareStation;
        (function (HardwareStation) {
            "use strict";
        })(HardwareStation = Peripherals.HardwareStation || (Peripherals.HardwareStation = {}));
    })(Peripherals = Commerce.Peripherals || (Commerce.Peripherals = {}));
})(Commerce || (Commerce = {}));
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
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var AddPreAuthorizedPaymentsToCartClientRequestHandler = (function (_super) {
                __extends(AddPreAuthorizedPaymentsToCartClientRequestHandler, _super);
                function AddPreAuthorizedPaymentsToCartClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AddPreAuthorizedPaymentsToCartClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.AddPreAuthorizedPaymentsToCartClientRequest;
                };
                AddPreAuthorizedPaymentsToCartClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to the AddPreAuthorizedPaymentsToCartClientRequestHandler executeAsync: "
                            + "request cannot be null or undefined.");
                    }
                    Commerce.RetailLogger.posAddPreAuthorizedPaymentsStarted(request.correlationId);
                    var cartTenderLines = this.context.applicationSession.userSession.transaction.cart.TenderLines;
                    var authorizedTenderLines = cartTenderLines.filter(function (tenderLine) {
                        return tenderLine.ProcessingTypeValue === Commerce.Proxy.Entities.PaymentProcessingType.Deferred
                            && tenderLine.StatusValue === Commerce.Proxy.Entities.TenderLineStatus.PendingCommit;
                    });
                    var unauthorizedTenderLine = Commerce.ArrayExtensions.firstOrUndefined(cartTenderLines, function (tenderLine) {
                        return tenderLine.ProcessingTypeValue === Commerce.Proxy.Entities.PaymentProcessingType.Deferred
                            && tenderLine.StatusValue === Commerce.Proxy.Entities.TenderLineStatus.NotProcessed;
                    });
                    var outerQueue = new Commerce.AsyncQueue;
                    return outerQueue.enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.IsHardwareStationActiveClientRequest(request.correlationId)))
                            .map(function (result) {
                            return result.data.result.isActive;
                        });
                    }).enqueue(function (isHardwareStationActive) {
                        var isCustomerOrderPickup = (!Commerce.ObjectExtensions.isNullOrUndefined(_this.context.applicationSession.userSession.transaction.cart)
                            && _this.context.applicationSession.userSession.transaction.cart.CartTypeValue === Commerce.Proxy.Entities.CartType.CustomerOrder
                            && _this.context.applicationSession.userSession.transaction.cart.CustomerOrderModeValue === Commerce.Proxy.Entities.CustomerOrderMode.Pickup);
                        if (!isCustomerOrderPickup
                            || !(Commerce.ArrayExtensions.hasElements(authorizedTenderLines) || !Commerce.ObjectExtensions.isNullOrUndefined(unauthorizedTenderLine))
                            || _this.context.applicationSession.userSession.transaction.cart.AmountDue <= 0) {
                            Commerce.RetailLogger.posAddPreAuthorizedPaymentsNotApplicable(request.correlationId, isCustomerOrderPickup, isHardwareStationActive, authorizedTenderLines.length, !Commerce.ObjectExtensions.isNullOrUndefined(unauthorizedTenderLine));
                            return Commerce.AsyncResult.createResolved({
                                canceled: false,
                                data: new Payments.AddPreAuthorizedPaymentsToCartClientResponse(_this.context.applicationSession.userSession.transaction.cart)
                            });
                        }
                        else if (!isHardwareStationActive && !_this._useCommerceEngineForCNPProcessing()) {
                            Commerce.RetailLogger.posAddPreAuthorizedPaymentsCannotBeProcessedDueToConfiguration(request.correlationId, authorizedTenderLines.length, !Commerce.ObjectExtensions.isNullOrUndefined(unauthorizedTenderLine));
                            return Commerce.AsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_UNABLE_TO_PROCESS_PREVIOUS_PAYMENT)]);
                        }
                        else {
                            var asyncQueue_1 = new Commerce.AsyncQueue();
                            asyncQueue_1.enqueue(function () {
                                var useAvailablePaymentOption = {
                                    key: "UseAvailablePayment",
                                    primaryText: _this.context.stringResourceManager.getString("string_3443"),
                                    iconClass: "iconPaymentCard"
                                };
                                var useDifferentPaymentOption = {
                                    key: "UseDifferentPayment",
                                    primaryText: _this.context.stringResourceManager.getString("string_3444"),
                                    iconClass: "iconBulletedList"
                                };
                                var activityRequest = new Payments.GetPaymentOptionInputClientRequest(request.correlationId, _this.context.stringResourceManager.getString("string_3441"), _this.context.stringResourceManager.getString("string_3442"), [useAvailablePaymentOption, useDifferentPaymentOption], false);
                                return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(activityRequest))
                                    .done(function (result) {
                                    if (Commerce.ObjectExtensions.isNullOrUndefined(result.data) ||
                                        result.data.result.key === useDifferentPaymentOption.key) {
                                        Commerce.RetailLogger.posAddPreAuthorizedPaymentsCancelled(request.correlationId);
                                        asyncQueue_1.cancel();
                                    }
                                });
                            });
                            authorizedTenderLines.forEach(function (tenderLine) {
                                asyncQueue_1.enqueue(function () {
                                    if (_this.context.applicationSession.userSession.transaction.cart.AmountDue > 0) {
                                        var tenderLineAmount_1;
                                        if (tenderLine.AuthorizedAmount <= _this.context.applicationSession.userSession.transaction.cart.AmountDue) {
                                            tenderLineAmount_1 = tenderLine.AuthorizedAmount;
                                        }
                                        else {
                                            tenderLineAmount_1 = _this.context.applicationSession.userSession.transaction.cart.AmountDue;
                                        }
                                        Commerce.RetailLogger.posAddPreAuthorizedPaymentsUpdateAuthorizedTenderLineStarted(request.correlationId, tenderLine.AuthorizedAmount, tenderLineAmount_1, tenderLine.PaymentRefRecId);
                                        var updatedAuthorizedTenderLine = Commerce.ObjectExtensions.clone(tenderLine);
                                        updatedAuthorizedTenderLine.Amount = tenderLineAmount_1;
                                        updatedAuthorizedTenderLine.ProcessingTypeValue = Commerce.Proxy.Entities.PaymentProcessingType.Recalled;
                                        return _this._updatePreprocessedTenderLineInCartAsync(request.correlationId, updatedAuthorizedTenderLine)
                                            .done(function () {
                                            Commerce.RetailLogger.posAddPreAuthorizedPaymentsUpdateAuthorizedTenderLineSucceeded(request.correlationId, tenderLine.AuthorizedAmount, tenderLineAmount_1, tenderLine.PaymentRefRecId);
                                        }).fail(function (errors) {
                                            Commerce.RetailLogger.posAddPreAuthorizedPaymentsUpdateAuthorizedTenderLineFailed(request.correlationId, tenderLine.AuthorizedAmount, tenderLineAmount_1, tenderLine.PaymentRefRecId, Commerce.Framework.ErrorConverter.serializeError(errors));
                                        });
                                    }
                                    else {
                                        return Commerce.VoidAsyncResult.createResolved();
                                    }
                                });
                            });
                            if (_this._useCommerceEngineForCNPProcessing()) {
                                asyncQueue_1.enqueue(function () {
                                    var tenderLineAmount = _this.context.applicationSession.userSession.transaction.cart.AmountDue;
                                    if (tenderLineAmount > 0 && !Commerce.ObjectExtensions.isNullOrUndefined(unauthorizedTenderLine)) {
                                        Commerce.RetailLogger.posAddPreAuthorizedPaymentsAddCardTokenCartTenderLineStarted(request.correlationId);
                                        var cartTenderLine = {
                                            Amount: tenderLineAmount,
                                            Currency: _this.context.applicationSession.deviceConfiguration.Currency,
                                            TenderTypeId: unauthorizedTenderLine.TenderTypeId,
                                            CardTypeId: unauthorizedTenderLine.CardTypeId,
                                            TokenizedPaymentCard: {
                                                CardTypeId: unauthorizedTenderLine.CardTypeId,
                                                TenderType: unauthorizedTenderLine.TenderTypeId,
                                                CardTokenInfo: {
                                                    CardToken: unauthorizedTenderLine.CardToken,
                                                    MaskedCardNumber: unauthorizedTenderLine.MaskedCardNumber,
                                                    ServiceAccountId: unauthorizedTenderLine.CardPaymentAccountId
                                                }
                                            },
                                            ProcessingTypeValue: Commerce.Proxy.Entities.PaymentProcessingType.Recalled
                                        };
                                        var addTenderLineToCartRequest = new Commerce.AddTenderLineToCartClientRequest(cartTenderLine, request.correlationId);
                                        var addTenderLineToCartResponse = Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(addTenderLineToCartRequest));
                                        return asyncQueue_1.cancelOn(addTenderLineToCartResponse)
                                            .done(function (result) {
                                            if (result.canceled) {
                                                Commerce.RetailLogger.posAddPreAuthorizedPaymentsAddCardTokenCartTenderLineCancelled(request.correlationId);
                                            }
                                            else {
                                                Commerce.RetailLogger.posAddPreAuthorizedPaymentsAddCardTokenCartTenderLineSucceeded(request.correlationId);
                                            }
                                        }).fail(function (errors) {
                                            Commerce.RetailLogger.posAddPreAuthorizedPaymentsAddCardTokenCartTenderLineFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                                        });
                                    }
                                    else {
                                        return Commerce.AsyncResult.createResolved();
                                    }
                                });
                            }
                            else {
                                var authorizationTenderLineToVoidOnFailure_1 = null;
                                asyncQueue_1.enqueue(function () {
                                    var tenderLineAmount = _this.context.applicationSession.userSession.transaction.cart.AmountDue;
                                    if (tenderLineAmount > 0 && !Commerce.ObjectExtensions.isNullOrUndefined(unauthorizedTenderLine)) {
                                        Commerce.RetailLogger.posAddPreAuthorizedPaymentsUpdateAuthorizeCardTokenStarted(request.correlationId, tenderLineAmount);
                                        return asyncQueue_1.cancelOn(_this._authorizeCardTokenAsync(request.correlationId, unauthorizedTenderLine, tenderLineAmount)
                                            .recoverOnFailure(function () {
                                            Commerce.RetailLogger.posAddPreAuthorizedPaymentsAuthorizeCardTokenRetryStarted(request.correlationId, tenderLineAmount);
                                            return _this._authorizeCardTokenAsync(request.correlationId, unauthorizedTenderLine, tenderLineAmount);
                                        }).done(function () {
                                            Commerce.RetailLogger.posAddPreAuthorizedPaymentsAuthorizeCardTokenSucceeded(request.correlationId, tenderLineAmount);
                                        }).fail(function (errors) {
                                            Commerce.RetailLogger.posAddPreAuthorizedPaymentsAuthorizeCardTokenFailed(request.correlationId, tenderLineAmount, Commerce.Framework.ErrorConverter.serializeError(errors));
                                        }));
                                    }
                                    else {
                                        return Commerce.AsyncResult.createResolved({ canceled: false, data: null });
                                    }
                                }).enqueue(function (result) {
                                    if (Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                                        Commerce.RetailLogger.posAddPreAuthorizedPaymentsAuthorizeCardTokenSkipped(request.correlationId, _this.context.applicationSession.userSession.transaction.cart.AmountDue, !Commerce.ObjectExtensions.isNullOrUndefined(unauthorizedTenderLine));
                                        return Commerce.AsyncResult.createResolved(result);
                                    }
                                    authorizationTenderLineToVoidOnFailure_1 = {
                                        Amount: result.data.ApprovedAmount,
                                        AuthorizedAmount: result.data.ApprovedAmount,
                                        Authorization: result.data.PaymentSdkData,
                                        CardToken: unauthorizedTenderLine.CardToken,
                                        Currency: _this.context.applicationSession.deviceConfiguration.Currency,
                                        TenderTypeId: unauthorizedTenderLine.TenderTypeId,
                                        CardTypeId: unauthorizedTenderLine.CardTypeId,
                                        StatusValue: Commerce.Proxy.Entities.TenderLineStatus.PendingCommit,
                                        IsVoidable: true,
                                        CardProcessorStatusValue: Commerce.Proxy.Entities.CreditCardProcessorStatus.Approved
                                    };
                                    if (result.data.IsApproved &&
                                        result.data.ApprovedAmount !== _this.context.applicationSession.userSession.transaction.cart.AmountDue) {
                                        return _this._approvePartialPaymentAsync(request.correlationId, _this.context.applicationSession.userSession.transaction.cart.AmountDue, result.data, authorizationTenderLineToVoidOnFailure_1)
                                            .map(function () {
                                            return result;
                                        });
                                    }
                                    else {
                                        return Commerce.AsyncResult.createResolved(result);
                                    }
                                }).enqueue(function (result) {
                                    if (Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                                        return Commerce.VoidAsyncResult.createResolved();
                                    }
                                    else if (result.data.IsApproved) {
                                        Commerce.RetailLogger.posAddPreAuthorizedPaymentsUpdateUnauthorizedTenderLineStarted(request.correlationId);
                                        var updatedUnauthorizedTenderLine = Commerce.ObjectExtensions.clone(unauthorizedTenderLine);
                                        updatedUnauthorizedTenderLine.Amount = result.data.ApprovedAmount;
                                        updatedUnauthorizedTenderLine.StatusValue = Commerce.Proxy.Entities.TenderLineStatus.PendingCommit;
                                        updatedUnauthorizedTenderLine.Authorization = result.data.PaymentSdkData;
                                        updatedUnauthorizedTenderLine.ProcessingTypeValue = Commerce.Proxy.Entities.PaymentProcessingType.Recalled;
                                        return _this._updatePreprocessedTenderLineInCartAsync(request.correlationId, updatedUnauthorizedTenderLine)
                                            .done(function () {
                                            Commerce.RetailLogger.posAddPreAuthorizedPaymentsUpdateUnauthorizedTenderLineSucceeded(request.correlationId);
                                        }).recoverOnFailure(function (errors) {
                                            Commerce.RetailLogger.posAddPreAuthorizedPaymentsUpdateUnauthorizedTenderLineFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                                            var asyncResult = new Commerce.VoidAsyncResult();
                                            _this._voidPaymentAsync(request.correlationId, _this.context.applicationSession.userSession.transaction.cart.AmountDue, result.data, authorizationTenderLineToVoidOnFailure_1, errors).always(function () {
                                                asyncResult.reject(errors);
                                            });
                                            return asyncResult;
                                        });
                                    }
                                    else {
                                        Commerce.RetailLogger.posAddPreAuthorizedPaymentsAuthorizeCardTokenNotApproved(request.correlationId);
                                        return Commerce.AsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_UNABLE_AUTHORIZE_OR_REFUND)]);
                                    }
                                });
                            }
                            return asyncQueue_1.run()
                                .fail(function (errors) {
                                Commerce.RetailLogger.posAddPreAuthorizedPaymentsFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                            }).map(function (result) {
                                Commerce.RetailLogger.posAddPreAuthorizedPaymentsSucceeded(request.correlationId);
                                return {
                                    canceled: result.canceled,
                                    data: result.canceled ?
                                        null :
                                        new Payments.AddPreAuthorizedPaymentsToCartClientResponse(_this.context.applicationSession.userSession.transaction.cart)
                                };
                            });
                        }
                    }).run().map(function (result) {
                        return result.data;
                    }).getPromise();
                };
                AddPreAuthorizedPaymentsToCartClientRequestHandler.prototype._useCommerceEngineForCNPProcessing = function () {
                    return this.context.applicationSession.deviceConfiguration.CardNotPresentProcessingConfigurationValue
                        === Commerce.Proxy.Entities.CardNotPresentProcessingConfiguration.UseCommerceEngine;
                };
                AddPreAuthorizedPaymentsToCartClientRequestHandler.prototype._updatePreprocessedTenderLineInCartAsync = function (correlationId, tenderLine) {
                    var cartManager = this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                    return cartManager.updatePreprocessedTenderLineInCartAsync(correlationId, tenderLine);
                };
                AddPreAuthorizedPaymentsToCartClientRequestHandler.prototype._authorizeCardTokenAsync = function (correlationId, tenderLine, amount) {
                    var cardTokenXml = tenderLine.CardToken;
                    var paymentServiceAccountId = tenderLine.CardPaymentAccountId;
                    var request = new Commerce.Peripherals.CardPaymentAuthorizeCardTokenPeripheralRequest(correlationId, amount, cardTokenXml, paymentServiceAccountId);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request))
                        .map(function (result) {
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : result.data.paymentInfo
                        };
                    });
                };
                AddPreAuthorizedPaymentsToCartClientRequestHandler.prototype._voidPaymentAsync = function (correlationId, amountDue, paymentInfo, tenderLine, errors) {
                    var voidPaymentFailureMessage = Payments.ErrorCodes.PAYMENT_AUTHORIZED_VOID_FAILED;
                    var request = new Payments.VoidPaymentClientRequest(correlationId, paymentInfo, tenderLine, amountDue, Commerce.Proxy.Entities.PeripheralPaymentType.CardPaymentController, voidPaymentFailureMessage, errors);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request)).map(function () { return void 0; });
                };
                AddPreAuthorizedPaymentsToCartClientRequestHandler.prototype._approvePartialPaymentAsync = function (correlationId, amountDue, paymentInfo, tenderLine) {
                    var request = new Payments.ApprovePartialPaymentClientRequest(correlationId, paymentInfo, tenderLine, amountDue, Commerce.Proxy.Entities.PeripheralPaymentType.CardPaymentController);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request)).map(function () { return void 0; });
                };
                return AddPreAuthorizedPaymentsToCartClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.AddPreAuthorizedPaymentsToCartClientRequestHandler = AddPreAuthorizedPaymentsToCartClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var ApprovePartialPaymentClientRequestHandler = (function (_super) {
                __extends(ApprovePartialPaymentClientRequestHandler, _super);
                function ApprovePartialPaymentClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ApprovePartialPaymentClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.ApprovePartialPaymentClientRequest;
                };
                ApprovePartialPaymentClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the ApprovePartialPaymentClientRequestHandler received an invalid request.");
                    }
                    Commerce.RetailLogger.posApprovePartialPaymentStarted(request.correlationId, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType]);
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        return asyncQueue.cancelOn(_this._callApprovePartialAmountActivity(request.correlationId, request.authorizationPaymentInfo.ApprovedAmount, request.fullAmountDue));
                    }).enqueue(function (result) {
                        if (result.data) {
                            Commerce.RetailLogger.posApprovePartialPaymentApproved(request.correlationId);
                            return Commerce.AsyncResult.createResolved();
                        }
                        else {
                            Commerce.RetailLogger.posApprovePartialPaymentNotApproved(request.correlationId);
                            var voidPaymentFailureMessage = Payments.ErrorCodes.PAYMENT_PARTIAL_VOID_FAILED;
                            var voidPaymentRequest = new Payments.VoidPaymentClientRequest(request.correlationId, request.authorizationPaymentInfo, request.authorizationTenderLine, request.fullAmountDue, request.peripheralType, voidPaymentFailureMessage);
                            return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(voidPaymentRequest))
                                .recoverOnFailure(function () {
                                return Commerce.AsyncResult.createRejected(null);
                            }));
                        }
                    });
                    return asyncQueue.run()
                        .fail(function (errors) {
                        Commerce.RetailLogger.posApprovePartialPaymentFailed(request.correlationId, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType], Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).map(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posApprovePartialPaymentCancelled(request.correlationId, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType]);
                        }
                        else {
                            Commerce.RetailLogger.posApprovePartialPaymentSucceeded(request.correlationId, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType]);
                        }
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new Payments.ApprovePartialPaymentClientResponse(null)
                        };
                    }).getPromise();
                };
                ApprovePartialPaymentClientRequestHandler.prototype._callApprovePartialAmountActivity = function (correlationId, amountAuthorized, amountRequested) {
                    var currencyCode = this.context.applicationSession.channelConfiguration.Currency;
                    var approvePartialAmountInputClientRequest = new Payments.ApprovePartialAmountInputClientRequest(correlationId, amountAuthorized, currencyCode, amountRequested, currencyCode);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(approvePartialAmountInputClientRequest))
                        .map(function (result) {
                        return {
                            canceled: false,
                            data: Commerce.ObjectExtensions.isNullOrUndefined(result.data) ? null : result.data.result.isApproved
                        };
                    });
                };
                return ApprovePartialPaymentClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.ApprovePartialPaymentClientRequestHandler = ApprovePartialPaymentClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var AuthorizeCardTokenAndAddToCartClientRequestHandler = (function (_super) {
                __extends(AuthorizeCardTokenAndAddToCartClientRequestHandler, _super);
                function AuthorizeCardTokenAndAddToCartClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AuthorizeCardTokenAndAddToCartClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.AuthorizeCardTokenAndAddToCartClientRequest;
                };
                AuthorizeCardTokenAndAddToCartClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to AuthorizeCardTokenAndAddToCartClientRequestHandler execute: "
                            + "request cannot be null or undefined.");
                    }
                    var asyncQueue = new Commerce.AsyncQueue();
                    var authorizePaymentInfo;
                    var newAuthorizationTenderLine = null;
                    var isAuthorizationVoidable = false;
                    asyncQueue.enqueue(function () {
                        Commerce.RetailLogger.posAuthorizeCardTokenStarted(request.correlationId, request.amountToAuthorize);
                        var authorizeCardTokenRequest = new Commerce.Peripherals.CardPaymentAuthorizeCardTokenPeripheralRequest(request.correlationId, request.amountToAuthorize, request.cardToken, request.paymentServiceAccountId);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(authorizeCardTokenRequest)))
                            .done(function (result) {
                            if (result.canceled) {
                                Commerce.RetailLogger.posAuthorizeCardTokenCancelled(request.correlationId, request.amountToAuthorize);
                            }
                            else {
                                Commerce.RetailLogger.posAuthorizeCardTokenSucceeded(request.correlationId, request.amountToAuthorize);
                            }
                            authorizePaymentInfo = result.canceled ? null : result.data.paymentInfo;
                        }).fail(function (errors) {
                            Commerce.RetailLogger.posAuthorizeCardTokenFailed(request.correlationId, request.amountToAuthorize, Commerce.Framework.ErrorConverter.serializeError(errors));
                        });
                    }).enqueue(function () {
                        if (!authorizePaymentInfo.IsApproved) {
                            Commerce.RetailLogger.posAuthorizeCardTokenNotApproved(request.correlationId);
                            return Commerce.AsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_UNABLE_AUTHORIZE_OR_REFUND)]);
                        }
                        newAuthorizationTenderLine = {
                            CardToken: request.cardToken,
                            AuthorizedAmount: authorizePaymentInfo.ApprovedAmount,
                            Authorization: authorizePaymentInfo.PaymentSdkData,
                            Currency: _this.context.applicationSession.deviceConfiguration.Currency,
                            MaskedCardNumber: request.maskedCardNumber,
                            TenderTypeId: request.tenderTypeId,
                            ProcessingTypeValue: Commerce.Proxy.Entities.PaymentProcessingType.Deferred,
                            StatusValue: Commerce.Proxy.Entities.TenderLineStatus.PendingCommit,
                            IsVoidable: true,
                            CardProcessorStatusValue: Commerce.Proxy.Entities.CreditCardProcessorStatus.Approved
                        };
                        if (Commerce.ObjectExtensions.isNullOrUndefined(request.cardTypeId)) {
                            Commerce.RetailLogger.posAuthorizeCardTokenRequestCardTypeIdIsNullOrUndefined(request.correlationId);
                            isAuthorizationVoidable = true;
                            return asyncQueue.cancelOn(_this._getCardTypeAsync(request.correlationId, request.tenderTypeId, authorizePaymentInfo))
                                .map(function (result) {
                                if (!result.canceled) {
                                    newAuthorizationTenderLine.CardTypeId = result.data.TypeId;
                                    isAuthorizationVoidable = false;
                                }
                            }).recoverOnFailure(function (errors) {
                                var error = [new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_UNABLE_AUTHORIZE_OR_REFUND)];
                                Commerce.RetailLogger.posGettingCardTypedIdUsingMaskedCardNumberFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(error));
                                return Commerce.AsyncResult.createRejected(error);
                            });
                        }
                        else {
                            newAuthorizationTenderLine.CardTypeId = request.cardTypeId;
                            Commerce.RetailLogger.posAuthorizeCardTokenRequestCardTypeIdSetOnTenderLine(request.correlationId);
                            return Commerce.AsyncResult.createResolved();
                        }
                    }).enqueue(function () {
                        if (authorizePaymentInfo.IsApproved && authorizePaymentInfo.ApprovedAmount !== request.amountToAuthorize) {
                            return _this._approvePartialPaymentAsync(request.correlationId, request.amountToAuthorize, authorizePaymentInfo, newAuthorizationTenderLine);
                        }
                        else {
                            return Commerce.VoidAsyncResult.createResolved();
                        }
                    }).enqueue(function () {
                        isAuthorizationVoidable = true;
                        var previousAuthorizedTenderLine = Commerce.ArrayExtensions.firstOrUndefined(_this.context.applicationSession.userSession.transaction.cart.TenderLines.filter(function (tenderLine) {
                            return tenderLine.AuthorizedAmount !== 0
                                && tenderLine.Amount === 0
                                && tenderLine.StatusValue !== Commerce.Proxy.Entities.TenderLineStatus.Voided;
                        }));
                        var isCustomerOrderEdition = (!Commerce.ObjectExtensions.isNullOrUndefined(_this.context.applicationSession.userSession.transaction.cart)
                            && _this.context.applicationSession.userSession.transaction.cart.CartTypeValue === Commerce.Proxy.Entities.CartType.CustomerOrder
                            && _this.context.applicationSession.userSession.transaction.cart
                                .CustomerOrderModeValue === Commerce.Proxy.Entities.CustomerOrderMode.CustomerOrderCreateOrEdit
                            && !Commerce.StringExtensions.isNullOrWhitespace(_this.context.applicationSession.userSession.transaction.cart.SalesId));
                        if (isCustomerOrderEdition && !Commerce.ObjectExtensions.isNullOrUndefined(previousAuthorizedTenderLine)) {
                            Commerce.RetailLogger.posVoidPreviousAuthorizedTenderLineStarted(request.correlationId, previousAuthorizedTenderLine.PaymentRefRecId);
                            var operationRequest = new Payments.Operations.VoidPaymentOperationRequest(request.correlationId, [previousAuthorizedTenderLine], true);
                            return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(operationRequest))
                                .done(function (result) {
                                if (result.canceled) {
                                    Commerce.RetailLogger.posVoidPreviousAuthorizedTenderLineCancelled(request.correlationId, previousAuthorizedTenderLine.PaymentRefRecId);
                                }
                                else {
                                    Commerce.RetailLogger.posVoidPreviousAuthorizedTenderLineSucceeded(request.correlationId, previousAuthorizedTenderLine.PaymentRefRecId);
                                }
                            }).fail(function (errors) {
                                Commerce.RetailLogger.posVoidPreviousAuthorizedTenderLineFailed(request.correlationId, previousAuthorizedTenderLine.PaymentRefRecId, Commerce.Framework.ErrorConverter.serializeError(errors));
                            }));
                        }
                        else {
                            Commerce.RetailLogger.posVoidPreviousAuthorizedTenderLineNotApplicable(request.correlationId);
                            return Commerce.AsyncResult.createResolved();
                        }
                    }).enqueue(function () {
                        Commerce.RetailLogger.posAddAuthorizedDeferredTenderLineToCartStarted(request.correlationId);
                        var addTenderLineRequest = new Commerce.AddPreprocessedTenderLineToCartClientRequest(newAuthorizationTenderLine);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(addTenderLineRequest)))
                            .done(function (result) {
                            if (result.canceled) {
                                Commerce.RetailLogger.posAddAuthorizedDeferredTenderLineToCartCancelled(request.correlationId);
                            }
                            else {
                                Commerce.RetailLogger.posAddAuthorizedDeferredTenderLineToCartSucceeded(request.correlationId);
                            }
                        }).fail(function (errors) {
                            Commerce.RetailLogger.posAddAuthorizedDeferredTenderLineToCartFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                        });
                    });
                    return asyncQueue.run()
                        .recoverOnFailure(function (errors) {
                        if (isAuthorizationVoidable) {
                            var asyncResult_1 = new Commerce.AsyncResult();
                            _this._voidPaymentAsync(request.correlationId, newAuthorizationTenderLine.AuthorizedAmount, authorizePaymentInfo, newAuthorizationTenderLine, errors).always(function () {
                                asyncResult_1.reject(errors);
                            });
                            return asyncResult_1;
                        }
                        else {
                            return Commerce.AsyncResult.createRejected(errors);
                        }
                    }).map(function (result) {
                        return {
                            canceled: result.canceled,
                            data: result.canceled ?
                                null :
                                new Payments.AuthorizeCardTokenAndAddToCartClientResponse(_this.context.applicationSession.userSession.transaction.cart)
                        };
                    }).getPromise();
                };
                AuthorizeCardTokenAndAddToCartClientRequestHandler.prototype._getCardTypeAsync = function (correlationId, tenderTypeId, paymentInfo) {
                    var tenderType = this.context.applicationContext.tenderTypesMap.getTenderByTypeId(tenderTypeId);
                    var cardInfo = {
                        CardNumber: paymentInfo.CardNumberMasked,
                        CardTypeId: paymentInfo.CardType.toString()
                    };
                    Commerce.RetailLogger.posGettingCardTypedIdUsingMaskedCardNumberStarted(correlationId);
                    var request = new Payments.GetCardTypeClientRequest(correlationId, tenderType, paymentInfo.CardNumberMasked, cardInfo, true);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request))
                        .map(function (result) {
                        Commerce.RetailLogger.posGettingCardTypedIdUsingMaskedCardNumberSucceeded(correlationId);
                        return { canceled: result.canceled, data: result.canceled ? null : result.data.result };
                    });
                };
                AuthorizeCardTokenAndAddToCartClientRequestHandler.prototype._voidPaymentAsync = function (correlationId, amountDue, paymentInfo, tenderLine, errors) {
                    var voidPaymentFailureMessage = Payments.ErrorCodes.PAYMENT_AUTHORIZED_VOID_FAILED;
                    var request = new Payments.VoidPaymentClientRequest(correlationId, paymentInfo, tenderLine, amountDue, Commerce.Proxy.Entities.PeripheralPaymentType.CardPaymentController, voidPaymentFailureMessage, errors);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request)).map(function () { return void 0; });
                };
                AuthorizeCardTokenAndAddToCartClientRequestHandler.prototype._approvePartialPaymentAsync = function (correlationId, amountDue, paymentInfo, tenderLine) {
                    var request = new Payments.ApprovePartialPaymentClientRequest(correlationId, paymentInfo, tenderLine, amountDue, Commerce.Proxy.Entities.PeripheralPaymentType.CardPaymentController);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request)).map(function () { return void 0; });
                };
                return AuthorizeCardTokenAndAddToCartClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.AuthorizeCardTokenAndAddToCartClientRequestHandler = AuthorizeCardTokenAndAddToCartClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var AuthorizeOrRefundPaymentClientRequestHandler = (function (_super) {
                __extends(AuthorizeOrRefundPaymentClientRequestHandler, _super);
                function AuthorizeOrRefundPaymentClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AuthorizeOrRefundPaymentClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.AuthorizeOrRefundPaymentClientRequest;
                };
                AuthorizeOrRefundPaymentClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to AuthorizeOrRefundPaymentClientRequestHandler execute: "
                            + "request cannot be null or undefined.");
                    }
                    Commerce.RetailLogger.posAuthorizeOrRefundPaymentStarted(request.correlationId, request.isRefundOperation, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType]);
                    var asyncQueue = new Commerce.AsyncQueue();
                    var authorizeOrRefundResult = null;
                    var preProcessedTenderLine = null;
                    var tenderLineId;
                    var getCardTypeErrors = [];
                    var isVoidingRequired = false;
                    var voidPaymentMessageId = Commerce.StringExtensions.EMPTY;
                    asyncQueue.enqueue(function () {
                        if (request.peripheralType === Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal && !request.skipPaymentRecoveryCheck) {
                            var checkRecoveryRequest = new Commerce.CheckForRecoveredPaymentTransactionClientRequest(request.correlationId, request.paymentAmount, Payments.TransactionReferenceAllowedActions.Any);
                            return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(checkRecoveryRequest))
                                .map(function (response) {
                                if (Commerce.ObjectExtensions.isNullOrUndefined(response) ||
                                    response.canceled ||
                                    Commerce.ObjectExtensions.isNullOrUndefined(response.data) ||
                                    Commerce.ObjectExtensions.isNullOrUndefined(response.data.result)) {
                                    return { canceled: true, data: null };
                                }
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(response.data.result.completeId)) {
                                    tenderLineId = response.data.result.completeId.TenderLineId;
                                }
                                return { canceled: false, data: response.data };
                            }));
                        }
                        Commerce.RetailLogger.posRecoveredPaymentTransactionCheckSkipped(request.correlationId, "not supported peripheral type(" +
                            Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType] + ") and/or 'skip' flag set in request(" +
                            request.skipPaymentRecoveryCheck + ")");
                        return Commerce.AsyncResult.createResolved({ canceled: false, data: new Commerce.CheckForRecoveredPaymentTransactionClientResponse(null) });
                    }).enqueue(function (response) {
                        var transactionReferenceContainer = response.data.result;
                        if (request.isRefundOperation) {
                            return asyncQueue.cancelOn(_this._refundPaymentAsync(request.correlationId, request.paymentAmount, request.peripheralType, request.tenderInfo, request.tenderType, request.voiceApprovalCode, request.isManualCardEntry, transactionReferenceContainer)
                                .done(function (result) {
                                if (!result.canceled) {
                                    authorizeOrRefundResult = result.data;
                                }
                            }));
                        }
                        else {
                            return asyncQueue.cancelOn(_this._authorizePaymentAsync(request.correlationId, request.paymentAmount, request.peripheralType, request.tenderInfo, request.tenderType, request.voiceApprovalCode, request.isManualCardEntry, transactionReferenceContainer)
                                .done(function (result) {
                                if (!result.canceled) {
                                    authorizeOrRefundResult = result.data;
                                }
                            }));
                        }
                    }).enqueue(function () {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(authorizeOrRefundResult.paymentInfo) && !authorizeOrRefundResult.paymentInfo.IsApproved) {
                            return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.ClearPaymentTransactionReferenceDataClientRequest(request.correlationId, "Authorize/refund was not approved.", request.paymentAmount.toString()))).map(function () {
                                return { canceled: true, data: null };
                            }));
                        }
                        if (Commerce.ObjectExtensions.isNullOrUndefined(request.cardType)) {
                            var cardInfo = {
                                CardNumber: authorizeOrRefundResult.paymentInfo.CardNumberMasked,
                                CardTypeId: authorizeOrRefundResult.paymentInfo.CardType.toString()
                            };
                            return asyncQueue.cancelOn(_this._getCardTypeAsync(request.correlationId, cardInfo, cardInfo.CardNumber, request.isSwipe, request.tenderType, request.cardTypeSelectedForTenderDiscount)
                                .recoverOnFailure(function (errors) {
                                getCardTypeErrors = errors;
                                isVoidingRequired = true;
                                voidPaymentMessageId = request.isRefundOperation ?
                                    Payments.ErrorCodes.PAYMENT_CAPTURED_VOID_FAILED :
                                    Payments.ErrorCodes.PAYMENT_AUTHORIZED_VOID_FAILED;
                                return Commerce.AsyncResult.createResolved({ canceled: false, data: null });
                            }));
                        }
                        else {
                            return Commerce.AsyncResult.createResolved({ canceled: false, data: request.cardType });
                        }
                    }).enqueue(function (result) {
                        var cardTypeId = Commerce.ObjectExtensions.isNullOrUndefined(result.data)
                            ? Commerce.Proxy.Entities.CardType[Commerce.Proxy.Entities.CardType.Unknown].toUpperCase()
                            : result.data.TypeId;
                        var createTenderLineRequest = new Payments.CreatePreProcessedTenderLineClientRequest(request.correlationId, cardTypeId, request.currencyCode, request.isRefundOperation, authorizeOrRefundResult.paymentInfo, request.tenderType, tenderLineId);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(createTenderLineRequest))
                            .done(function (result) {
                            if (!result.canceled) {
                                preProcessedTenderLine = result.data.result;
                            }
                        }));
                    }).enqueue(function () {
                        if (isVoidingRequired) {
                            return Commerce.AsyncResult.createRejected(getCardTypeErrors);
                        }
                        var foundPayment = null;
                        var isPartialApprovalWhenFoundTransaction = false;
                        var paymentTransactionReferenceData = Commerce.ObjectExtensions.isNullOrUndefined(authorizeOrRefundResult.transactionReferenceContainer) ?
                            null : authorizeOrRefundResult.transactionReferenceContainer.completeId;
                        if (request.peripheralType === Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                            foundPayment = Commerce.ObjectExtensions.isNullOrUndefined(authorizeOrRefundResult.transactionReferenceContainer) ?
                                null : authorizeOrRefundResult.transactionReferenceContainer.foundTransaction;
                            isPartialApprovalWhenFoundTransaction = !Commerce.ObjectExtensions.isNullOrUndefined(foundPayment) &&
                                !Commerce.ObjectExtensions.isNullOrUndefined(paymentTransactionReferenceData) &&
                                request.paymentAmount !== authorizeOrRefundResult.paymentInfo.ApprovedAmount &&
                                paymentTransactionReferenceData.Amount === request.paymentAmount;
                        }
                        var isPartialApprovalWhenNotFoundTransaction = Commerce.ObjectExtensions.isNullOrUndefined(foundPayment) &&
                            request.paymentAmount !== authorizeOrRefundResult.paymentInfo.ApprovedAmount;
                        if (request.isRefundOperation || !(isPartialApprovalWhenNotFoundTransaction || isPartialApprovalWhenFoundTransaction)) {
                            if (request.peripheralType === Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                                var serializedCorrelationId = JSON.stringify(paymentTransactionReferenceData);
                                var isTransactionRecovered = !Commerce.ObjectExtensions.isNullOrUndefined(foundPayment);
                                Commerce.RetailLogger.posPaymentSkippedPartialCheck(serializedCorrelationId, request.paymentAmount, authorizeOrRefundResult.paymentInfo.ApprovedAmount, isTransactionRecovered, request.correlationId);
                            }
                            return Commerce.AsyncResult.createResolved({ canceled: false });
                        }
                        var partialApprovalRequest = new Payments.ApprovePartialPaymentClientRequest(request.correlationId, authorizeOrRefundResult.paymentInfo, preProcessedTenderLine, request.paymentAmount, request.peripheralType);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(partialApprovalRequest))
                            .map(function (result) {
                            return { canceled: result.canceled };
                        }));
                    }).enqueue(function () {
                        preProcessedTenderLine.IsPolicyBypassed = request.isExemptFromReturnPolicy;
                        var addTenderLineToCartRequest = new Commerce.AddPreprocessedTenderLineToCartClientRequest(preProcessedTenderLine, request.correlationId);
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(addTenderLineToCartRequest))
                            .fail(function (errors) {
                            isVoidingRequired = true;
                            voidPaymentMessageId = request.isRefundOperation
                                ? Payments.ErrorCodes.PAYMENT_CAPTURED_VOID_FAILED
                                : Payments.ErrorCodes.PAYMENT_AUTHORIZED_VOID_FAILED;
                        });
                    }).enqueue(function (result) {
                        if (request.peripheralType === Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                            return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.ClearPaymentTransactionReferenceDataClientRequest(request.correlationId, "Pay card authorize/refund completed successfully.", request.paymentAmount.toString())))
                                .map(function () {
                                return result;
                            }));
                        }
                        return asyncQueue.cancelOn(Commerce.AsyncResult.createResolved(result));
                    });
                    var asyncResultToReturn = new Commerce.AsyncResult();
                    asyncQueue.run()
                        .fail(function (errors) {
                        Commerce.RetailLogger.posAuthorizeOrRefundPaymentFailed(request.correlationId, request.isRefundOperation, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType], Commerce.Framework.ErrorConverter.serializeError(errors));
                        if (isVoidingRequired) {
                            var voidPaymentRequest = new Payments.VoidPaymentClientRequest(request.correlationId, authorizeOrRefundResult.paymentInfo, preProcessedTenderLine, request.paymentAmount, request.peripheralType, voidPaymentMessageId, errors);
                            Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(voidPaymentRequest))
                                .always(function () {
                                asyncResultToReturn.reject(errors);
                            });
                        }
                        else if (request.peripheralType === Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                            var updateLinesRequest = new Commerce.PaymentTerminalUpdateLinesRequest(_this.context.applicationSession.userSession.transaction.cart, request.correlationId);
                            Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(updateLinesRequest)).always(function () {
                                asyncResultToReturn.reject(errors);
                            });
                        }
                        else {
                            asyncResultToReturn.reject(errors);
                        }
                    }).done(function (result) {
                        if (!result.canceled) {
                            Commerce.RetailLogger.posAuthorizeOrRefundPaymentSucceeded(request.correlationId, request.isRefundOperation, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType]);
                            asyncResultToReturn.resolve({
                                canceled: false,
                                data: new Payments.AuthorizeOrRefundPaymentClientResponse(authorizeOrRefundResult.paymentInfo)
                            });
                        }
                        else {
                            Commerce.RetailLogger.posAuthorizeOrRefundPaymentCancelled(request.correlationId, request.isRefundOperation, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType]);
                            var paymentErrors_1 = [new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_UNABLE_AUTHORIZE_OR_REFUND)];
                            if (request.peripheralType === Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                                var updateLinesRequest = new Commerce.PaymentTerminalUpdateLinesRequest(_this.context.applicationSession.userSession.transaction.cart, request.correlationId);
                                Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(updateLinesRequest)).always(function () {
                                    asyncResultToReturn.reject(paymentErrors_1);
                                });
                            }
                            else {
                                asyncResultToReturn.reject(paymentErrors_1);
                            }
                        }
                    });
                    return asyncResultToReturn.getPromise();
                };
                AuthorizeOrRefundPaymentClientRequestHandler.prototype._refundPaymentAsync = function (correlationId, paymentAmount, peripheralType, tenderInfo, tenderType, voiceApprovalCode, isManualCardEntry, transactionReferenceContainer) {
                    var _this = this;
                    if (peripheralType === Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                        var request = new Commerce.PaymentTerminalRefundPaymentActivityRequest(tenderType.ConnectorId, Math.abs(paymentAmount), tenderInfo, voiceApprovalCode, isManualCardEntry, null, correlationId);
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request))
                            .recoverOnFailure(function (errors) {
                            var printAsyncResult = new Commerce.AsyncResult();
                            if (Commerce.ArrayExtensions.hasElements(errors)) {
                                var declinedPaymentInfo = void 0;
                                var error = Payments.Utilities.PaymentErrorHelper.getError(errors, Payments.HardwareStationError);
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(error)) {
                                    declinedPaymentInfo = error.paymentInfo;
                                }
                                Payments.Utilities.PaymentHelper.printDeclinedOrVoidedCardPaymentReceiptAsync(correlationId, paymentAmount, declinedPaymentInfo, tenderType, _this.context.applicationSession, _this.context)
                                    .always(function () {
                                    printAsyncResult.reject(errors);
                                });
                            }
                            else {
                                printAsyncResult.reject(errors);
                            }
                            return printAsyncResult;
                        }).map(function (result) {
                            var paymentTransactionData = null;
                            if (!result.canceled) {
                                paymentTransactionData = {
                                    paymentInfo: result.data.result,
                                    transactionReferenceContainer: transactionReferenceContainer
                                };
                            }
                            return { canceled: result.canceled, data: paymentTransactionData };
                        });
                    }
                    else {
                        var request = new Commerce.CardPaymentRefundPaymentRequest(tenderType.ConnectorId, Math.abs(paymentAmount), tenderInfo, null, correlationId);
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request))
                            .map(function (result) {
                            var paymentTransactionData = null;
                            if (!result.canceled) {
                                paymentTransactionData = {
                                    paymentInfo: result.data.result,
                                    transactionReferenceContainer: transactionReferenceContainer
                                };
                            }
                            return { canceled: result.canceled, data: paymentTransactionData };
                        });
                    }
                };
                AuthorizeOrRefundPaymentClientRequestHandler.prototype._authorizePaymentAsync = function (correlationId, paymentAmount, peripheralType, tenderInfo, tenderType, voiceApprovalCode, isManualCardEntry, transactionReferenceContainer) {
                    var _this = this;
                    var paymentTransactionReferenceData = Commerce.ObjectExtensions.isNullOrUndefined(transactionReferenceContainer) ? null : transactionReferenceContainer.completeId;
                    if (peripheralType === Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                        var serializedId = JSON.stringify(paymentTransactionReferenceData);
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(transactionReferenceContainer) &&
                            !Commerce.ObjectExtensions.isNullOrUndefined(transactionReferenceContainer.foundTransaction)) {
                            var paymentTransactionData = {
                                paymentInfo: transactionReferenceContainer.foundTransaction,
                                transactionReferenceContainer: transactionReferenceContainer
                            };
                            var foundAuthResult = Commerce.AsyncResult.createResolved({ canceled: false, data: paymentTransactionData });
                            Commerce.RetailLogger.posPaymentSkippingDuplicateAuthorization(serializedId, correlationId);
                            return foundAuthResult;
                        }
                        Commerce.RetailLogger.posPaymentDuplicateAuthorizationNotFound(serializedId, correlationId);
                        var request = new Commerce.PaymentTerminalAuthorizePaymentActivityRequest(tenderType.ConnectorId, paymentAmount, tenderInfo, voiceApprovalCode, isManualCardEntry, null, correlationId, paymentTransactionReferenceData);
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request))
                            .recoverOnFailure(function (errors) {
                            var printAsyncResult = new Commerce.AsyncResult();
                            if (Commerce.ArrayExtensions.hasElements(errors)) {
                                var declinedPaymentInfo = void 0;
                                var error = Payments.Utilities.PaymentErrorHelper.getError(errors, Payments.HardwareStationError);
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(error)) {
                                    declinedPaymentInfo = error.paymentInfo;
                                }
                                Payments.Utilities.PaymentHelper.printDeclinedOrVoidedCardPaymentReceiptAsync(correlationId, paymentAmount, declinedPaymentInfo, tenderType, _this.context.applicationSession, _this.context).always(function () {
                                    printAsyncResult.reject(errors);
                                });
                            }
                            else {
                                printAsyncResult.reject(errors);
                            }
                            return printAsyncResult;
                        }).map(function (result) {
                            var paymentTransactionData = null;
                            if (!result.canceled) {
                                paymentTransactionData = {
                                    paymentInfo: result.data.result,
                                    transactionReferenceContainer: transactionReferenceContainer
                                };
                            }
                            return { canceled: result.canceled, data: paymentTransactionData };
                        });
                    }
                    else {
                        var request = new Commerce.CardPaymentAuthorizePaymentRequest(tenderType.ConnectorId, paymentAmount, tenderInfo, null, correlationId);
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request))
                            .map(function (result) {
                            var paymentTransactionData = null;
                            if (!result.canceled) {
                                paymentTransactionData = {
                                    paymentInfo: result.data.result,
                                    transactionReferenceContainer: transactionReferenceContainer
                                };
                            }
                            return { canceled: result.canceled, data: paymentTransactionData };
                        });
                    }
                };
                AuthorizeOrRefundPaymentClientRequestHandler.prototype._getCardTypeAsync = function (correlationId, cardInfo, cardNumber, isSwipe, tenderType, cardTypeSelectedForTenderDiscount) {
                    var request = new Payments.GetCardTypeClientRequest(correlationId, tenderType, cardNumber, cardInfo, isSwipe, null, cardTypeSelectedForTenderDiscount);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request))
                        .map(function (result) {
                        return { canceled: result.canceled, data: result.canceled ? null : result.data.result };
                    });
                };
                return AuthorizeOrRefundPaymentClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.AuthorizeOrRefundPaymentClientRequestHandler = AuthorizeOrRefundPaymentClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            "use strict";
            var BeginTransactionClientRequestHandler = (function (_super) {
                __extends(BeginTransactionClientRequestHandler, _super);
                function BeginTransactionClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BeginTransactionClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.BeginTransactionClientRequest;
                };
                BeginTransactionClientRequestHandler.prototype.executeAsync = function (request) {
                    return Payments.Utilities.PaymentHelper.beginTransactionAsync(this.context, this.context.applicationSession.userSession)
                        .map(function () {
                        return {
                            data: new Payments.BeginTransactionClientResponse(),
                            canceled: false
                        };
                    }).getPromise();
                };
                return BeginTransactionClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.BeginTransactionClientRequestHandler = BeginTransactionClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var CheckForRecoveredPaymentTransactionClientRequestHandler = (function (_super) {
                __extends(CheckForRecoveredPaymentTransactionClientRequestHandler, _super);
                function CheckForRecoveredPaymentTransactionClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CheckForRecoveredPaymentTransactionClientRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.CheckForRecoveredPaymentTransactionClientRequest;
                };
                CheckForRecoveredPaymentTransactionClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method of CheckForRecoveredPaymentTransactionClientRequestHandler received a null or undefined request.");
                    }
                    if (!Payments.Utilities.PaymentHelper.isAuthorize(request.paymentAmount)) {
                        Commerce.RetailLogger.posPaymentSkippedDuplicateProtectionForNonAuthorize(request.correlationId, request.paymentAmount);
                        var emptyContainer = this._getEmptyContainer();
                        var emptyDataResult = {
                            data: new Commerce.CheckForRecoveredPaymentTransactionClientResponse(emptyContainer),
                            canceled: false
                        };
                        return Commerce.AsyncResult.createResolved(emptyDataResult).
                            getPromise();
                    }
                    var validTransactionReferenceWasFoundInStorage = false;
                    var transactionReferenceDataRaw;
                    var transactionReferenceData;
                    var queue = new Commerce.AsyncQueue();
                    queue.enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.GetPaymentTransactionReferenceDataClientRequest(request.correlationId)))
                            .map(function (result) {
                            return result.data.result.data;
                        });
                    }).enqueue(function (result) {
                        transactionReferenceDataRaw = result;
                        if (!Commerce.StringExtensions.isNullOrWhitespace(transactionReferenceDataRaw)) {
                            try {
                                transactionReferenceData = JSON.parse(transactionReferenceDataRaw);
                            }
                            catch (error) {
                                var formattedError = Commerce.Framework.ErrorConverter.serializeError(error);
                                Commerce.RetailLogger.posPaymentDeserializedTransactionReferenceMalformed(transactionReferenceDataRaw, formattedError, request.correlationId);
                            }
                            if (Commerce.ObjectExtensions.isNullOrUndefined(transactionReferenceData)) {
                                return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.ClearPaymentTransactionReferenceDataClientRequest(request.correlationId, "The transaction reference data is malformed", null)));
                            }
                            else {
                                var tenderlines = _this.context.applicationSession.userSession.transaction.cart.TenderLines;
                                var foundTenderLineByTransactionReference = false;
                                if (Commerce.ArrayExtensions.hasElements(tenderlines)) {
                                    foundTenderLineByTransactionReference = tenderlines.some(function (tenderLine) {
                                        return Commerce.StringExtensions.compare(transactionReferenceData.TenderLineId, tenderLine.TenderLineId, true) === 0;
                                    });
                                }
                                if (foundTenderLineByTransactionReference) {
                                    return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.ClearPaymentTransactionReferenceDataClientRequest(request.correlationId, "Cart already contains a Tender Line corresponding to currently stored Payment Transaction Reference.", null)));
                                }
                                else {
                                    validTransactionReferenceWasFoundInStorage = true;
                                }
                            }
                        }
                        return Commerce.AsyncResult.createResolved();
                    }).enqueue(function () {
                        if (!validTransactionReferenceWasFoundInStorage) {
                            Commerce.RetailLogger.posPaymentTransactionReferenceDataNotFoundInStorage(request.correlationId);
                            if (request.allowedActions === Payments.TransactionReferenceAllowedActions.Any) {
                                return _this._retrieveAndStorePaymentTransactionReferenceId(request.paymentAmount, request.correlationId);
                            }
                            else {
                                var emptyContainer = _this._getEmptyContainer();
                                return Commerce.AsyncResult.createResolved(emptyContainer);
                            }
                        }
                        else {
                            Commerce.RetailLogger.posPaymentTransactionReferenceDataFoundInStorage(transactionReferenceDataRaw, request.correlationId);
                            return _this._getTransactionByTransactionReference(transactionReferenceData, request.correlationId, 3);
                        }
                    }).enqueue(function (correlationContainer) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(correlationContainer.completeId) &&
                            Commerce.ObjectExtensions.isNullOrUndefined(correlationContainer.foundTransaction) &&
                            request.allowedActions) {
                            return Commerce.AsyncResult.createResolved(correlationContainer);
                        }
                        if (Commerce.ObjectExtensions.isNullOrUndefined(correlationContainer.foundTransaction)) {
                            if (validTransactionReferenceWasFoundInStorage) {
                                var serializedCorrelationId = JSON.stringify(correlationContainer.completeId);
                                Commerce.RetailLogger.posPaymentReacquiringTransactionReference(serializedCorrelationId, request.correlationId);
                                return _this._retrieveAndStorePaymentTransactionReferenceId(request.paymentAmount, request.correlationId);
                            }
                            return Commerce.AsyncResult.createResolved(correlationContainer);
                        }
                        else {
                            var serializedTransactionReference = JSON.stringify(correlationContainer.completeId);
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(request.paymentAmount) && (correlationContainer.completeId.Amount !== request.paymentAmount)) {
                                var correlationContainerAmountIsNull = Commerce.ObjectExtensions.isNullOrUndefined(correlationContainer.completeId.Amount);
                                var correlationContainerAmountIsZero = correlationContainer.completeId.Amount === 0;
                                var requestPaymentAmountIsZero = request.paymentAmount === 0;
                                var recoveredTransactionAmountIsZero = correlationContainer.foundTransaction.ApprovedAmount === 0;
                                var amountInContainerMatchesRecoveredAmount = correlationContainer.completeId.Amount === correlationContainer.foundTransaction.ApprovedAmount;
                                var requestedAmountBiggerThanContainerAmount = request.paymentAmount > correlationContainer.completeId.Amount;
                                var requestedAmountBiggerThanRecoveredAmount = request.paymentAmount > correlationContainer.foundTransaction.ApprovedAmount;
                                var messageString = Commerce.StringExtensions.format("correlationContainerAmountIsNull:'{0}'; correlationContainerAmountIsZero:'{1}';" +
                                    " requestPaymentAmountIsZero:'{2}'; recoveredTransactionAmountIsZero:'{3}'; amountInContainerMatchesRecoveredAmount:'{4}';" +
                                    " requestedAmountBiggerThanContainerAmount:'{5}'; requestedAmountBiggerThanRecoveredAmount:'{6}'.", correlationContainerAmountIsNull, correlationContainerAmountIsZero, requestPaymentAmountIsZero, recoveredTransactionAmountIsZero, amountInContainerMatchesRecoveredAmount, requestedAmountBiggerThanContainerAmount, requestedAmountBiggerThanRecoveredAmount);
                                Commerce.RetailLogger.posRecoveredPaymentTransactionDetailsForDifferentAmount(messageString, request.correlationId);
                                return _this._informAboutFoundDuplicateForDifferentAmount(request.allowedActions, request.paymentAmount, correlationContainer, serializedTransactionReference, request.correlationId)
                                    .map(function (value) {
                                    correlationContainer.foundTransactionHasDifferentAmount = true;
                                    return correlationContainer;
                                });
                            }
                            else {
                                return _this._informAboutFoundDuplicateForTheSameAmount(correlationContainer, request.allowedActions, serializedTransactionReference, request.correlationId);
                            }
                        }
                    }).enqueue(function (correlationContainer) {
                        return Commerce.AsyncResult.createResolved(new Commerce.CheckForRecoveredPaymentTransactionClientResponse(correlationContainer));
                    });
                    return queue.run().getPromise();
                };
                CheckForRecoveredPaymentTransactionClientRequestHandler.prototype._retrieveAndStorePaymentTransactionReferenceId = function (paymentAmount, correlationId) {
                    var _this = this;
                    var terminalId = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.REGISTER_ID_KEY);
                    var eftTerminalId = this.context.applicationContext.activeEftTerminalId;
                    var getIdRequest = new Commerce.PaymentTerminalGetTransactionReferenceIdRequest(terminalId, eftTerminalId, correlationId);
                    var command = Payments.Utilities.PaymentHelper.isAuthorize(paymentAmount) ?
                        Payments.Utilities.PaymentHelper.DUPLICATE_PROTECTION_COMMAND_AUTHORIZE : Payments.Utilities.PaymentHelper.DUPLICATE_PROTECTION_COMMAND_REFUND;
                    var transactionReferenceData;
                    return new Commerce.AsyncQueue().enqueue(function () {
                        transactionReferenceData = {
                            Command: command,
                            IdFromConnector: null,
                            InitiatedDate: Commerce.DateExtensions.now,
                            UniqueTransactionId: _this._getInvoiceNumber(_this.context.applicationSession.userSession.transaction.cart.Id),
                            Amount: paymentAmount,
                            TenderLineId: Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid()
                        };
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(getIdRequest))
                            .fail(function (errors) {
                            var serializedErrors = Commerce.Framework.ErrorConverter.serializeError(errors);
                            Commerce.RetailLogger.posPaymentFailedToRetrievePaymentTransactionReferenceId(correlationId, serializedErrors);
                        });
                    }).enqueue(function (value) {
                        if (Commerce.StringExtensions.isNullOrWhitespace(value.data.result)) {
                            Commerce.RetailLogger.posPaymentTransactionReferenceIdNotSupported(correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posPaymentTransactionReferenceIdRetrievedFromConnector(value.data.result, correlationId);
                            transactionReferenceData.IdFromConnector = value.data.result;
                        }
                        var serializedTransactionReference = JSON.stringify(transactionReferenceData);
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.SetPaymentTransactionReferenceDataClientRequest(correlationId, serializedTransactionReference)))
                            .map(function () {
                            Commerce.RetailLogger.posPaymentTransactionReferenceDataWasStored(serializedTransactionReference, correlationId);
                            var result = {
                                completeId: transactionReferenceData, foundTransaction: null, foundTransactionHasDifferentAmount: null
                            };
                            return result;
                        });
                    }).run().map(function (result) {
                        return result.data;
                    });
                };
                CheckForRecoveredPaymentTransactionClientRequestHandler.prototype._getTransactionByTransactionReference = function (paymentTransactionReferenceData, correlationId, retriesLeft) {
                    var _this = this;
                    var getTransactionByCorrelationIdRequest = new Commerce.PaymentTerminalGetTransactionByTransactionReferenceRequest(paymentTransactionReferenceData, correlationId);
                    var queue = new Commerce.AsyncQueue();
                    var getTransactionByCorrelationIdFailed = false;
                    return queue.enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(getTransactionByCorrelationIdRequest))
                            .recoverOnFailure(function (errors) {
                            getTransactionByCorrelationIdFailed = true;
                            var serializedCorrelationId = JSON.stringify(paymentTransactionReferenceData);
                            var serializedErrors = Commerce.Framework.ErrorConverter.serializeError(errors);
                            Commerce.RetailLogger.posPaymentFailedToRetrieveTransactionByTransactionReferenceData(serializedCorrelationId, serializedErrors, correlationId);
                            return Commerce.AsyncResult.createResolved({
                                canceled: false, data: new Commerce.PaymentTerminalGetTransactionByTransactionReferenceResponse(null)
                            });
                        });
                    }).enqueue(function (result) {
                        if ((Commerce.ObjectExtensions.isNullOrUndefined(result.data.result) ||
                            !Commerce.ArrayExtensions.hasElements(result.data.result.Errors)) &&
                            !getTransactionByCorrelationIdFailed) {
                            var resultContainer = {
                                completeId: paymentTransactionReferenceData,
                                foundTransaction: result.data.result,
                                foundTransactionHasDifferentAmount: null
                            };
                            Commerce.RetailLogger.posPaymentGetPaymentTransactionByTransactionReferenceNoErrors(correlationId);
                            return Commerce.AsyncResult.createResolved(resultContainer);
                        }
                        else {
                            var predicate = function (paymentError) {
                                var parsedPaymentErrorCode = parseInt(paymentError.Code, 10);
                                switch (parsedPaymentErrorCode) {
                                    case Payments.Utilities.ErrorCode.RetrievalTransactionByReferenceInProgress:
                                        Commerce.RetailLogger.posPaymentGetPaymentTransactionByTransactionReferenceWillBeRetried(parsedPaymentErrorCode, retriesLeft, correlationId);
                                        return true;
                                    case Payments.Utilities.ErrorCode.NoTransactionFoundByTransactionReference:
                                    case Payments.Utilities.ErrorCode.TransactionRetrievalByReferenceNotSupported:
                                    case Payments.Utilities.ErrorCode.DuplicateTransactionResultUnknown:
                                        Commerce.RetailLogger.posPaymentGetPaymentTransactionByTransactionReferenceWillNotBeRetried(parsedPaymentErrorCode, retriesLeft, correlationId);
                                        return false;
                                    default:
                                        Commerce.RetailLogger.posPaymentStopRetrievingTransactionByReferenceDueToUnknownError(parsedPaymentErrorCode, retriesLeft, correlationId);
                                        return false;
                                }
                            };
                            if (retriesLeft > 0 && (getTransactionByCorrelationIdFailed || Commerce.ArrayExtensions.firstOrUndefined(result.data.result.Errors, predicate))) {
                                Commerce.RetailLogger.posPaymentRetryRetrievingTransactionByReferenceData(retriesLeft, correlationId);
                                return _this._getTransactionByTransactionReference(paymentTransactionReferenceData, correlationId, --retriesLeft);
                            }
                            else {
                                var returnResult = {
                                    completeId: paymentTransactionReferenceData,
                                    foundTransaction: null,
                                    foundTransactionHasDifferentAmount: null
                                };
                                return Commerce.AsyncResult.createResolved(returnResult);
                            }
                        }
                    }).run().map(function (queueResult) {
                        return queueResult.data;
                    });
                };
                CheckForRecoveredPaymentTransactionClientRequestHandler.prototype._informAboutFoundDuplicateForTheSameAmount = function (correlationContainer, allowedActions, serializedTransactionReference, correlationId) {
                    var _this = this;
                    var OK_RESULT_VALUE = "OK_RESULT";
                    var DELETE_RESULT_VALUE = "DELETE_RESULT";
                    var okButtonId = "okButtonClick";
                    var cancelButtonId = "cancelButtonClick";
                    var dialogRequest;
                    var messageText;
                    var isRemoveAvailable = false;
                    var okButton = {
                        id: okButtonId,
                        label: this.context.stringResourceManager.getString("string_29072"),
                        isPrimary: true,
                        result: OK_RESULT_VALUE
                    };
                    switch (allowedActions) {
                        case Payments.TransactionReferenceAllowedActions.Remove:
                            messageText = Commerce.StringExtensions.format(this.context.stringResourceManager.getString("string_29071"), this._formatCurrency(correlationContainer.foundTransaction.ApprovedAmount));
                            isRemoveAvailable = true;
                            break;
                        case Payments.TransactionReferenceAllowedActions.Read:
                            messageText = Commerce.StringExtensions.format(this.context.stringResourceManager.getString("string_29068"), this._formatCurrency(correlationContainer.foundTransaction.ApprovedAmount));
                            break;
                        default:
                            messageText = Commerce.StringExtensions.format(this.context.stringResourceManager.getString("string_29065"), this._formatCurrency(correlationContainer.foundTransaction.ApprovedAmount));
                            break;
                    }
                    Commerce.RetailLogger.posPaymentInformedUserRecoveredTransactionSameAmount(allowedActions.toString(), serializedTransactionReference, correlationId);
                    if (isRemoveAvailable) {
                        var removeButton = {
                            id: cancelButtonId,
                            label: this.context.stringResourceManager.getString("string_29073"),
                            isPrimary: false,
                            result: DELETE_RESULT_VALUE
                        };
                        dialogRequest = new Commerce.ShowMessageDialogClientRequest({
                            title: this.context.stringResourceManager.getString("string_29067"),
                            message: messageText,
                            showCloseX: false,
                            button1: okButton,
                            button2: removeButton
                        });
                    }
                    else {
                        okButton.label = this.context.stringResourceManager.getString("string_75");
                        dialogRequest = new Commerce.ShowMessageDialogClientRequest({
                            title: this.context.stringResourceManager.getString("string_29067"),
                            message: messageText,
                            showCloseX: false,
                            button1: okButton
                        });
                    }
                    var asyncResult = new Commerce.AsyncResult();
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(dialogRequest));
                    }).enqueue(function (response) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(response.data) && response.data.result.dialogResult === DELETE_RESULT_VALUE) {
                            return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.ClearPaymentTransactionReferenceDataClientRequest(correlationId, "user forced the deletion", null))).done(function () {
                                correlationContainer.foundTransactionHasDifferentAmount = false;
                                correlationContainer.foundTransaction = null;
                                correlationContainer.completeId = null;
                            });
                        }
                        return Commerce.AsyncResult.createResolved();
                    });
                    asyncQueue.run().done(function () {
                        asyncResult.resolve(correlationContainer);
                    }).fail(function () {
                        asyncResult.resolve(correlationContainer);
                    });
                    return asyncResult;
                };
                CheckForRecoveredPaymentTransactionClientRequestHandler.prototype._informAboutFoundDuplicateForDifferentAmount = function (allowedActions, paymentAmount, correlationContainer, serializedTransactionReference, correlationId) {
                    var messageResx;
                    if (allowedActions === Payments.TransactionReferenceAllowedActions.Read) {
                        messageResx = "string_29077";
                    }
                    else {
                        messageResx = "string_29066";
                    }
                    var messageText = Commerce.StringExtensions.format(this.context.stringResourceManager.getString(messageResx), this._formatCurrency(correlationContainer.foundTransaction.ApprovedAmount));
                    var messageInputRequest = new Payments.DisplayPaymentMessageDialogInputClientRequest(correlationId, this.context.stringResourceManager.getString("string_29067"), messageText, this.context.stringResourceManager.getString("string_75"));
                    Commerce.RetailLogger.posPaymentInformedUserRecoveredTransactionDifferentAmount(paymentAmount, serializedTransactionReference, correlationId);
                    var asyncResult = new Commerce.AsyncResult();
                    Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(messageInputRequest)).always(function () {
                        asyncResult.resolve({ canceled: false });
                    });
                    return asyncResult;
                };
                CheckForRecoveredPaymentTransactionClientRequestHandler.prototype._formatCurrency = function (amount) {
                    var currency = this.context.applicationSession.deviceConfiguration.Currency;
                    var formattedAmount = Commerce.NumberExtensions.formatCurrency(amount, currency);
                    return formattedAmount;
                };
                CheckForRecoveredPaymentTransactionClientRequestHandler.prototype._getEmptyContainer = function () {
                    var emptyContainer = {
                        completeId: null,
                        foundTransaction: null,
                        foundTransactionHasDifferentAmount: null,
                    };
                    return emptyContainer;
                };
                CheckForRecoveredPaymentTransactionClientRequestHandler.prototype._getInvoiceNumber = function (cartId) {
                    var cardIdLength = 6;
                    var positionOfCartId = cartId.lastIndexOf("-") + 1;
                    var filteredCartId = cartId.substr(positionOfCartId);
                    var invoiceNumber = (filteredCartId.length > cardIdLength) ? filteredCartId.substr(filteredCartId.length - cardIdLength, cardIdLength) :
                        Commerce.StringExtensions.padLeft(filteredCartId, "0", cardIdLength);
                    return invoiceNumber;
                };
                return CheckForRecoveredPaymentTransactionClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.CheckForRecoveredPaymentTransactionClientRequestHandler = CheckForRecoveredPaymentTransactionClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            "use strict";
            var ClearMerchantInformationClientRequestHandler = (function (_super) {
                __extends(ClearMerchantInformationClientRequestHandler, _super);
                function ClearMerchantInformationClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ClearMerchantInformationClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.ClearMerchantInformationClientRequest;
                };
                ClearMerchantInformationClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to ClearMerchantInformationClientRequest execute: request cannot be null or undefined");
                    }
                    var hardwareProfile = this.context.applicationSession.hardwareProfile;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(hardwareProfile) || hardwareProfile.EftTypeId !== Commerce.Proxy.Entities.EFTType.PaymentSDK) {
                        Commerce.RetailLogger.clearMerchantPropertiesCancelled(Commerce.ObjectExtensions.isNullOrUndefined(hardwareProfile), request.correlationId);
                        return Promise.resolve({
                            canceled: true,
                            data: null
                        });
                    }
                    var correlationId = request.correlationId;
                    var environmentId = null;
                    var envConfig = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.ENVIRONMENT_CONFIGURATION_KEY);
                    if (!Commerce.StringExtensions.isNullOrWhitespace(envConfig)) {
                        var environmentConfiguration = JSON.parse(envConfig);
                        environmentId = environmentConfiguration.EnvironmentId;
                    }
                    var hardwareProfileId = hardwareProfile.ProfileId;
                    if (Commerce.StringExtensions.isNullOrWhitespace(environmentId) || Commerce.ObjectExtensions.isNullOrUndefined(hardwareProfile.RecordId)) {
                        Commerce.RetailLogger.activitiesSaveMerchantInformationMissingIdentifier(hardwareProfileId, environmentId, hardwareProfile.RecordId, correlationId, "ClearMerchantInformationClientRequestHandler");
                        return Promise.reject([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.HARDWARESTATION_MISSING_MERCHANT_INFO_IDENTIFIER)]);
                    }
                    var clearMerchantInfoRequest = {
                        EnvironmentId: environmentId,
                        HardwareProfileId: hardwareProfileId,
                        HardwareProfileRecId: hardwareProfile.RecordId.toString(),
                        PaymentMerchantInformation: Commerce.StringExtensions.EMPTY
                    };
                    return Payments.Utilities.MerchantInformationHelper.clearMerchantInformationLocalAsync(clearMerchantInfoRequest, this.context.runtime, hardwareProfileId, correlationId)
                        .map(function () {
                        var response = {
                            canceled: false,
                            data: new Payments.ClearMerchantInformationClientResponse(void 0)
                        };
                        return response;
                    }).recoverOnFailure(function (errors) {
                        if (Payments.Utilities.PaymentErrorHelper.hasError(errors, Payments.ErrorCodes.PERIPHERALS_HARDWARESTATION_COMMUNICATION_FAILED)) {
                            errors.splice(0, 1, new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.MICROSOFT_DYNAMICS_POS_CLIENTBROKER_COMMUNICATION_ERROR.serverErrorCode));
                        }
                        return Commerce.VoidAsyncResult.createRejected(errors);
                    }).getPromise();
                };
                return ClearMerchantInformationClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.ClearMerchantInformationClientRequestHandler = ClearMerchantInformationClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var ComposeTenderInfoForCardPaymentClientRequestHandler = (function (_super) {
                __extends(ComposeTenderInfoForCardPaymentClientRequestHandler, _super);
                function ComposeTenderInfoForCardPaymentClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ComposeTenderInfoForCardPaymentClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.ComposeTenderInfoForCardPaymentClientRequest;
                };
                ComposeTenderInfoForCardPaymentClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to ComposeTenderInfoForCardPaymentClientRequestHandler execute: "
                            + "request cannot be null or undefined.");
                    }
                    Commerce.RetailLogger.posPreprocessCardPaymentInfoStarted(request.correlationId);
                    var asyncQueue = new Commerce.AsyncQueue();
                    var cashBackAmount = 0;
                    var pinInformation = null;
                    asyncQueue.enqueue(function () {
                        if (request.paymentAmount > 0
                            && request.cardType.CardTypeValue === Commerce.Proxy.Entities.CardType.InternationalDebitCard
                            && request.cardType.CashBackLimit > 0
                            && request.paymentAmount === _this.context.applicationSession.userSession.transaction.cart.AmountDue) {
                            var getcashBackRequest = new Payments.GetCashBackAmountClientRequest(request.correlationId, request.cardType, request.currencyCode);
                            return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(getcashBackRequest)))
                                .done(function (result) {
                                cashBackAmount = result.canceled ? 0 : result.data.result;
                            });
                        }
                        else {
                            return Commerce.AsyncResult.createResolved({ canceled: false });
                        }
                    }).enqueue(function () {
                        var tenderLineToValidate = {
                            Amount: request.paymentAmount,
                            Currency: request.currencyCode,
                            TenderTypeId: request.tenderTypeId,
                            CashBackAmount: cashBackAmount,
                            CardTypeId: request.cardType.TypeId
                        };
                        var cartManager = _this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                        return cartManager.validateTenderLineForAddAsync(tenderLineToValidate);
                    }).enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.IsPaymentTerminalAvailableClientRequest(request.correlationId)))
                            .map(function (result) {
                            return result.data.result.isAvailable;
                        });
                    }).enqueue(function (isPaymentTerminalAvailable) {
                        if (request.cardType.CardTypeValue === Commerce.Proxy.Entities.CardType.InternationalDebitCard
                            && !isPaymentTerminalAvailable) {
                            var getPinRequest = new Payments.GetPinUsingPinPadClientRequest(request.correlationId, cashBackAmount, request.paymentCard.CardNumber, request.paymentAmount);
                            return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(getPinRequest)))
                                .done(function (result) {
                                pinInformation = result.canceled ? null : result.data.result;
                            });
                        }
                        else {
                            return Commerce.AsyncResult.createResolved({ canceled: false });
                        }
                    }).enqueue(function () {
                        var tenderInfo = {
                            TenderId: request.tenderTypeId,
                            CardNumber: request.paymentCard.CardNumber,
                            CardTypeId: request.cardType.CardTypeValue.toString(),
                            Track1: request.paymentCard.Track1,
                            Track2: request.paymentCard.Track2,
                            Track3: request.paymentCard.Track3,
                            EncryptedPin: request.paymentCard.EncryptedPin,
                            AdditionalSecurityData: request.paymentCard.AdditionalSecurityData,
                            CCID: request.paymentCard.CCID,
                            VoiceAuthorizationCode: request.paymentCard.VoiceAuthorizationCode,
                            IsSwipe: request.paymentCard.IsSwipe,
                            Name: request.paymentCard.NameOnCard,
                            Country: request.paymentCard.Country,
                            Address: request.paymentCard.Address1,
                            Zip: request.paymentCard.Zip,
                            ExpirationMonth: request.paymentCard.ExpirationMonth,
                            ExpirationYear: request.paymentCard.ExpirationYear,
                            CashbackAmount: cashBackAmount
                        };
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(pinInformation)) {
                            tenderInfo.EncryptedPin = pinInformation.encryptedPin;
                            tenderInfo.AdditionalSecurityData = pinInformation.additionalSecurityData;
                        }
                        return Commerce.AsyncResult.createResolved(tenderInfo);
                    });
                    return asyncQueue.run()
                        .map(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posPreprocessCardPaymentInfoCancelled(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posPreprocessCardPaymentInfoSucceeded(request.correlationId);
                        }
                        return { canceled: result.canceled, data: result.canceled ? null : new Payments.ComposeTenderInfoForCardPaymentClientResponse(result.data) };
                    }).fail(function (errors) {
                        Commerce.RetailLogger.posPreprocessCardPaymentInfoFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).getPromise();
                };
                return ComposeTenderInfoForCardPaymentClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.ComposeTenderInfoForCardPaymentClientRequestHandler = ComposeTenderInfoForCardPaymentClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var CreatePreProcessedTenderLineClientRequestHandler = (function (_super) {
                __extends(CreatePreProcessedTenderLineClientRequestHandler, _super);
                function CreatePreProcessedTenderLineClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CreatePreProcessedTenderLineClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.CreatePreProcessedTenderLineClientRequest;
                };
                CreatePreProcessedTenderLineClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the CreatePreProcessedTenderLineClientRequestHandler received a null or undefined request.");
                    }
                    var preProcessedTenderLine = {
                        Authorization: request.paymentInfo.PaymentSdkData,
                        CardTypeId: request.cardTypeId,
                        Currency: request.currencyCode,
                        MaskedCardNumber: request.paymentInfo.CardNumberMasked,
                        TenderTypeId: request.tenderType.TenderTypeId,
                        TenderLineId: request.tenderLineId
                    };
                    if (request.isRefundOperation) {
                        preProcessedTenderLine.IsVoidable = true;
                        preProcessedTenderLine.Amount = request.paymentInfo.ApprovedAmount * -1;
                        preProcessedTenderLine.StatusValue = Commerce.Proxy.Entities.TenderLineStatus.Committed;
                    }
                    else {
                        preProcessedTenderLine.CashBackAmount = request.paymentInfo.CashbackAmount;
                        preProcessedTenderLine.Amount = request.paymentInfo.ApprovedAmount;
                        preProcessedTenderLine.IsVoidable = true;
                        preProcessedTenderLine.StatusValue = Commerce.Proxy.Entities.TenderLineStatus.PendingCommit;
                    }
                    if (request.tenderType.OperationId === Commerce.Proxy.Entities.RetailOperation.PayGiftCertificate) {
                        preProcessedTenderLine.GiftCardId = request.paymentInfo.CardNumberMasked;
                    }
                    if (request.paymentInfo.PaymentSdkContentType === Commerce.Client.Entities.PaymentSdkContentType.AuthorizationAndCardToken) {
                        preProcessedTenderLine.CardToken = request.paymentInfo.PaymentSdkData;
                    }
                    return Promise.resolve({ canceled: false, data: new Payments.CreatePreProcessedTenderLineClientResponse(preProcessedTenderLine) });
                };
                return CreatePreProcessedTenderLineClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.CreatePreProcessedTenderLineClientRequestHandler = CreatePreProcessedTenderLineClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetAndProcessCardPaymentAcceptPageResultClientRequestHandler = (function (_super) {
                __extends(GetAndProcessCardPaymentAcceptPageResultClientRequestHandler, _super);
                function GetAndProcessCardPaymentAcceptPageResultClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetAndProcessCardPaymentAcceptPageResultClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetAndProcessCardPaymentAcceptPageResultClientRequest;
                };
                GetAndProcessCardPaymentAcceptPageResultClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to GetAndProcessCardPaymentAcceptPageResultClientRequestHandler execute: "
                            + "request cannot be null or undefined.");
                    }
                    var isAuthorize = !request.isTokenizePayment && request.paymentAmount >= 0;
                    var isRefund = !request.isTokenizePayment && request.paymentAmount < 0;
                    var cardPaymentAcceptResult = null;
                    var cardType = request.cardType;
                    Commerce.RetailLogger.posProcessCardPaymentAcceptPageResultStarted(request.correlationId, isAuthorize, isRefund, request.isTokenizePayment);
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        var cartManager = _this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                        return cartManager.retrieveCardPaymentAcceptResult(request.resultAccessCode)
                            .done(function (result) {
                            cardPaymentAcceptResult = result;
                        }).recoverOnFailure(function (errors) {
                            return Commerce.AsyncResult.createRejected(Payments.Utilities.PaymentErrorHelper.ConvertToClientErrors(errors));
                        });
                    }).enqueue(function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(cardPaymentAcceptResult)) {
                            Commerce.RetailLogger.posCardPaymentAcceptPageResultNullOrUndefined(request.correlationId);
                            return Commerce.VoidAsyncResult.createRejected([
                                new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_UNABLETORETRIEVECARDPAYMENTACCEPTRESULT)
                            ]);
                        }
                        else if (isAuthorize && Commerce.ObjectExtensions.isNullOrUndefined(cardPaymentAcceptResult.TenderLine)) {
                            Commerce.RetailLogger.posCardPaymentAcceptPageResultTenderLineNullOrUndefined(request.correlationId);
                            return Commerce.VoidAsyncResult.createRejected([
                                new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_UNABLETORETRIEVECARDPAYMENTACCEPTRESULT)
                            ]);
                        }
                        else if ((isRefund || request.isTokenizePayment) && Commerce.ObjectExtensions.isNullOrUndefined(cardPaymentAcceptResult.TokenizedPaymentCard)) {
                            Commerce.RetailLogger.posCardPaymentAcceptPageResultTokenizedPaymentCardNullOrUndefined(request.correlationId);
                            return Commerce.VoidAsyncResult.createRejected([
                                new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_UNABLETORETRIEVECARDPAYMENTACCEPTRESULT)
                            ]);
                        }
                        else {
                            return Commerce.VoidAsyncResult.createResolved();
                        }
                    }).enqueue(function () {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(cardType)) {
                            var cardPrefix = cardPaymentAcceptResult.TokenizedPaymentCard.CardTokenInfo.MaskedCardNumber;
                            return asyncQueue.cancelOn(_this._getCardTypeAsync(request.correlationId, cardPrefix, request.tenderType, request.cardTypeSelectedForTenderDiscount)
                                .done(function (result) {
                                cardType = result.canceled ? null : result.data;
                            }));
                        }
                        else {
                            return Commerce.VoidAsyncResult.createResolved();
                        }
                    }).enqueue(function () {
                        if (isAuthorize) {
                            cardPaymentAcceptResult.TenderLine.CardTypeId = cardType.TypeId;
                            return asyncQueue.cancelOn(_this._handleAuthorizeAsync(request.correlationId, cardPaymentAcceptResult, request.tenderType))
                                .map(function () {
                                return Commerce.VoidAsyncResult.createResolved();
                            });
                        }
                        else if (isRefund) {
                            cardPaymentAcceptResult.TokenizedPaymentCard.CardTypeId = cardType.TypeId;
                            return asyncQueue.cancelOn(_this._handleRefundAsync(request.correlationId, cardPaymentAcceptResult, cardType, request.paymentAmount, request.tenderType, request.isExemptFromReturnPolicy))
                                .map(function () {
                                return Commerce.VoidAsyncResult.createResolved();
                            });
                        }
                        else {
                            cardPaymentAcceptResult.TokenizedPaymentCard.CardTypeId = cardType.TypeId;
                            cardPaymentAcceptResult.TokenizedPaymentCard.TenderType = request.tenderType.TenderTypeId;
                            return Commerce.VoidAsyncResult.createResolved();
                        }
                    });
                    return asyncQueue.run()
                        .map(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posProcessCardPaymentAcceptPageResultCancelled(request.correlationId, isAuthorize, isRefund, request.isTokenizePayment);
                        }
                        else {
                            Commerce.RetailLogger.posProcessCardPaymentAcceptPageResultSucceeded(request.correlationId, isAuthorize, isRefund, request.isTokenizePayment);
                        }
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new Payments.GetAndProcessCardPaymentAcceptPageResultClientResponse(cardPaymentAcceptResult)
                        };
                    }).fail(function (errors) {
                        Commerce.RetailLogger.posProcessCardPaymentAcceptPageResultFailed(request.correlationId, isAuthorize, isRefund, request.isTokenizePayment, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).getPromise();
                };
                GetAndProcessCardPaymentAcceptPageResultClientRequestHandler.prototype._getCardTypeAsync = function (correlationId, cardPrefix, tenderType, cardTypeSelectedForTenderDiscount) {
                    var request = new Payments.GetCardTypeClientRequest(correlationId, tenderType, cardPrefix, null, true, true, cardTypeSelectedForTenderDiscount);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request))
                        .map(function (result) {
                        return { canceled: result.canceled, data: result.canceled ? null : result.data.result };
                    });
                };
                GetAndProcessCardPaymentAcceptPageResultClientRequestHandler.prototype._handleAuthorizeAsync = function (correlationId, cardPaymentAcceptResult, tenderType) {
                    var _this = this;
                    var preProcessedTenderLine = cardPaymentAcceptResult.TenderLine;
                    preProcessedTenderLine.TenderTypeId = tenderType.TenderTypeId;
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        var request = new Commerce.AddPreprocessedTenderLineToCartClientRequest(preProcessedTenderLine);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(request))
                            .recoverOnFailure(function (errors) {
                            return _this._handleCartVersionErrors(correlationId, errors).map(function (result) {
                                return {
                                    data: null,
                                    canceled: result.canceled
                                };
                            });
                        }));
                    }).enqueue(function () {
                        if (Commerce.ArrayExtensions.hasElements(cardPaymentAcceptResult.PaymentSdkErrors)) {
                            var localizeMessage = _this.context.stringResourceManager.getString(Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_UNABLETORETRIEVECARDPAYMENTACCEPTRESULT);
                            var paymentException = {
                                ErrorResourceId: Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_UNABLETORETRIEVECARDPAYMENTACCEPTRESULT,
                                LocalizedMessage: localizeMessage,
                                PaymentSdkErrors: cardPaymentAcceptResult.PaymentSdkErrors
                            };
                            var error = new Payments.CommercePaymentError(correlationId, paymentException);
                            return Commerce.VoidAsyncResult.createRejected(Payments.Utilities.PaymentErrorHelper.ConvertToClientErrors([error]));
                        }
                        else {
                            return Commerce.VoidAsyncResult.createResolved();
                        }
                    });
                    return asyncQueue.run();
                };
                GetAndProcessCardPaymentAcceptPageResultClientRequestHandler.prototype._handleRefundAsync = function (correlationId, cardPaymentAcceptResult, cardType, paymentAmount, tenderType, isExemptFromReturnPolicy) {
                    var _this = this;
                    var cartTenderLine = {
                        TokenizedPaymentCard: cardPaymentAcceptResult.TokenizedPaymentCard,
                        Amount: paymentAmount,
                        TenderTypeId: tenderType.TenderTypeId,
                        Currency: this.context.applicationSession.channelConfiguration.Currency,
                        CardTypeId: cardType.TypeId,
                        IsPolicyBypassed: isExemptFromReturnPolicy
                    };
                    return this._addCartTenderLineToCartAsync(correlationId, cartTenderLine, tenderType)
                        .recoverOnFailure(function (errors) {
                        return _this._handleCartVersionErrors(correlationId, errors);
                    });
                };
                GetAndProcessCardPaymentAcceptPageResultClientRequestHandler.prototype._handleCartVersionErrors = function (correlationId, errors) {
                    var _this = this;
                    var cartVersionErrorQueue = new Commerce.AsyncQueue();
                    return cartVersionErrorQueue.enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.HandleCartVersionErrorClientRequest(correlationId, errors)));
                    }).enqueue(function (response) {
                        if (!response.canceled) {
                            return cartVersionErrorQueue.cancelOn(Commerce.AsyncResult.createResolved({
                                canceled: true,
                                data: null
                            }));
                        }
                        else {
                            return Commerce.AsyncResult.createRejected(Payments.Utilities.PaymentErrorHelper.ConvertToClientErrors(errors));
                        }
                    }).run();
                };
                GetAndProcessCardPaymentAcceptPageResultClientRequestHandler.prototype._addCartTenderLineToCartAsync = function (correlationId, tenderLine, tenderType) {
                    var _this = this;
                    Commerce.RetailLogger.posPaymentAddCartTenderLineStarted(correlationId, tenderType.OperationId, tenderType.OperationName);
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        var preTriggerOptions = {
                            cart: _this.context.applicationSession.userSession.transaction.cart,
                            tenderLine: tenderLine
                        };
                        var preTriggerResult = _this.context.triggerManager.execute(Commerce.Triggers.CancelableTriggerType.PreAddTenderLine, preTriggerOptions);
                        return asyncQueue.cancelOn(preTriggerResult);
                    }).enqueue(function () {
                        var addTenderLineToCartRequest = new Commerce.AddTenderLineToCartClientRequest(tenderLine);
                        var addTenderLineToCartResponse = Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(addTenderLineToCartRequest));
                        return asyncQueue.cancelOn(addTenderLineToCartResponse);
                    });
                    return asyncQueue.run().done(function (result) {
                        if (!result.canceled) {
                            Commerce.RetailLogger.posPaymentAddCartTenderLineSucceeded(correlationId, tenderType.OperationId, tenderType.OperationName);
                        }
                        else {
                            Commerce.RetailLogger.posPaymentAddCartTenderLineCancelled(correlationId, tenderType.OperationId, tenderType.OperationName);
                        }
                    }).fail(function (errors) {
                        Commerce.RetailLogger.posPaymentAddCartTenderLineFailed(correlationId, tenderType.OperationId, tenderType.OperationName, Commerce.Framework.ErrorConverter.serializeError(errors));
                    });
                };
                return GetAndProcessCardPaymentAcceptPageResultClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetAndProcessCardPaymentAcceptPageResultClientRequestHandler = GetAndProcessCardPaymentAcceptPageResultClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetAndUpdateTenderLineSignatureClientRequestHandler = (function (_super) {
                __extends(GetAndUpdateTenderLineSignatureClientRequestHandler, _super);
                function GetAndUpdateTenderLineSignatureClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetAndUpdateTenderLineSignatureClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetAndUpdateTenderLineSignatureClientRequest;
                };
                GetAndUpdateTenderLineSignatureClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the GetAndUpdateTenderLineSignatureClientRequestHandler received a null or undefined request.");
                    }
                    Commerce.RetailLogger.posGetAndUpdateTenderLineSignatureRequestStarted(request.correlationId);
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        var getSignatureRequest = new Payments.GetSignatureClientRequest(request.correlationId);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(getSignatureRequest)));
                    }).enqueue(function (response) {
                        var signatureData = Commerce.StringExtensions.isNullOrWhitespace(response.data.result) ? Commerce.StringExtensions.EMPTY : response.data.result;
                        var updateTenderLineSignatureRequest = new Payments.UpdateTenderLineSignatureServiceRequest(request.correlationId, request.tenderLineId, signatureData);
                        return Commerce.StringExtensions.isNullOrWhitespace(signatureData)
                            ? asyncQueue.cancelOn(Commerce.AsyncResult.createResolved({ canceled: true, data: null }))
                            : asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(updateTenderLineSignatureRequest)));
                    });
                    return asyncQueue.run()
                        .fail(function (errors) {
                        Commerce.RetailLogger.posGetAndUpdateTenderLineSignatureRequestFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).map(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posGetAndUpdateTenderLineSignatureRequestCancelled(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posGetAndUpdateTenderLineSignatureRequestSucceeded(request.correlationId);
                        }
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new Payments.GetAndUpdateTenderLineSignatureClientResponse(result.data.cart)
                        };
                    }).getPromise();
                };
                return GetAndUpdateTenderLineSignatureClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetAndUpdateTenderLineSignatureClientRequestHandler = GetAndUpdateTenderLineSignatureClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var DEPOSIT_ONLY = "DepositOnly";
            var DEPOSIT_AND_AUTHORIZE = "DepositAndAuthorize";
            var GetAuthorizationOptionsClientRequestHandler = (function (_super) {
                __extends(GetAuthorizationOptionsClientRequestHandler, _super);
                function GetAuthorizationOptionsClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetAuthorizationOptionsClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetAuthorizationOptionsClientRequest;
                };
                GetAuthorizationOptionsClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the GetAuthorizationOptionsClientRequestHandler received an invalid request.");
                    }
                    Commerce.RetailLogger.posGetAuthorizationOptionsStarted(request.correlationId);
                    var cardTokenTenderLines = this.context.applicationSession.userSession.transaction.cart.TenderLines.filter(function (tenderLine) {
                        return !Commerce.StringExtensions.isNullOrWhitespace(tenderLine.CardToken)
                            && tenderLine.StatusValue !== Commerce.Proxy.Entities.TenderLineStatus.Voided;
                    });
                    var asyncQueue = new Commerce.AsyncQueue;
                    return asyncQueue.enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.IsHardwareStationActiveClientRequest(request.correlationId)))
                            .map(function (result) {
                            return result.data.result.isActive;
                        });
                    }).enqueue(function (isHardwareStationActive) {
                        var asyncResult = new Commerce.AsyncResult();
                        if (Commerce.ArrayExtensions.hasElements(cardTokenTenderLines)
                            && isHardwareStationActive
                            && _this.context.applicationSession.channelConfiguration.EnableOmniChannelPayments) {
                            asyncResult = _this._promptAuthorizationOptionsWithCardTokens(request.correlationId, cardTokenTenderLines);
                        }
                        else {
                            asyncResult = _this._promptStandardAuthorizationOptions(request.correlationId);
                        }
                        return asyncResult.map(function (result) {
                            if (result.canceled) {
                                Commerce.RetailLogger.posGetAuthorizationOptionsCancelled(request.correlationId);
                            }
                            else {
                                Commerce.RetailLogger.posGetAuthorizationOptionsSucceeded(request.correlationId, result.data.tokenize, Commerce.ObjectExtensions.isNullOrUndefined(result.data.tenderLineToAuthorize), Commerce.ObjectExtensions.isNullOrUndefined(result.data.tenderLineToAuthorize) ? null : result.data.tenderLineToAuthorize.PaymentRefRecId);
                            }
                            return {
                                canceled: result.canceled,
                                data: result.canceled ? null : new Payments.GetAuthorizationOptionsClientResponse(result.data)
                            };
                        }).fail(function (errors) {
                            Commerce.RetailLogger.posGetAuthorizationOptionsFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                        });
                    }).run().map(function (result) {
                        return result.data;
                    }).getPromise();
                };
                GetAuthorizationOptionsClientRequestHandler.prototype._promptStandardAuthorizationOptions = function (correlationId) {
                    var requirePaymentForFulfillment = this.context.applicationSession.deviceConfiguration.RequirePaymentForFulfillmentValue;
                    var paymentOptions;
                    var dialogMessage;
                    if (requirePaymentForFulfillment === Commerce.Proxy.Entities.RequirePaymentForFulfillment.AllowPayLater) {
                        dialogMessage = this.context.stringResourceManager.getString("string_4314");
                        paymentOptions = [
                            {
                                Action: DEPOSIT_ONLY,
                                DisplayText: this.context.stringResourceManager.getString("string_4316")
                            },
                            {
                                Action: DEPOSIT_AND_AUTHORIZE,
                                DisplayText: this.context.stringResourceManager.getString("string_4315")
                            }
                        ];
                    }
                    else {
                        dialogMessage = this.context.stringResourceManager.getString("string_3453");
                        paymentOptions = [
                            {
                                Action: DEPOSIT_AND_AUTHORIZE,
                                DisplayText: this.context.stringResourceManager.getString("string_4315")
                            }
                        ];
                    }
                    var activityRequest = new Payments.SelectPaymentOptionInputClientRequest(correlationId, paymentOptions, this.context.stringResourceManager.getString("string_4313"), dialogMessage);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(activityRequest))
                        .map(function (result) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                            var resultValue = void 0;
                            if (result.data.result.paymentOption === DEPOSIT_ONLY
                                || result.data.result.paymentOption === DEPOSIT_AND_AUTHORIZE) {
                                resultValue = result.data.result.paymentOption;
                            }
                            return { canceled: false, data: { tokenize: resultValue === DEPOSIT_AND_AUTHORIZE } };
                        }
                        else {
                            return { canceled: true, data: null };
                        }
                    });
                };
                GetAuthorizationOptionsClientRequestHandler.prototype._promptAuthorizationOptionsWithCardTokens = function (correlationId, cardTokenTenderLines) {
                    var _this = this;
                    var paymentOptions = [];
                    cardTokenTenderLines.forEach(function (tenderLine, index) {
                        var paymentOption = {
                            key: index.toString(),
                            primaryText: _this.context.stringResourceManager.getString("string_3445"),
                            secondaryText: Payments.Utilities.PaymentHelper.getTruncatedCardNumber(tenderLine.MaskedCardNumber, _this.context),
                            iconClass: "iconPaymentCard"
                        };
                        paymentOptions.push(paymentOption);
                    });
                    var useDifferentPaymentOption = {
                        key: "UseDifferentPayment",
                        primaryText: this.context.stringResourceManager.getString("string_3447"),
                        iconClass: "iconBulletedList"
                    };
                    paymentOptions.push(useDifferentPaymentOption);
                    var requirePaymentForFulfillment = this.context.applicationSession.deviceConfiguration.RequirePaymentForFulfillmentValue;
                    var dialogMessage = this.context.stringResourceManager.getString("string_3452");
                    var payLaterOption = {
                        key: "PayBalanceLater",
                        primaryText: this.context.stringResourceManager.getString("string_3448"),
                        iconClass: "iconRecent"
                    };
                    if (requirePaymentForFulfillment === Commerce.Proxy.Entities.RequirePaymentForFulfillment.AllowPayLater) {
                        paymentOptions.push(payLaterOption);
                        dialogMessage = this.context.stringResourceManager.getString("string_3450");
                    }
                    var activityRequest = new Payments.GetPaymentOptionInputClientRequest(correlationId, this.context.stringResourceManager.getString("string_3449"), dialogMessage, paymentOptions, true);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(activityRequest))
                        .map(function (result) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                            return { canceled: true, data: null };
                        }
                        else if (result.data.result.key === useDifferentPaymentOption.key) {
                            return { canceled: false, data: { tokenize: true } };
                        }
                        else if (result.data.result.key === payLaterOption.key) {
                            return { canceled: false, data: { tokenize: false } };
                        }
                        else {
                            var tenderLineIndex = parseInt(result.data.result.key, 10);
                            if (tenderLineIndex >= 0 && tenderLineIndex < cardTokenTenderLines.length) {
                                var tenderLine = cardTokenTenderLines[tenderLineIndex];
                                return { canceled: false, data: { tokenize: false, tenderLineToAuthorize: tenderLine } };
                            }
                            else {
                                return { canceled: true, data: null };
                            }
                        }
                    });
                };
                return GetAuthorizationOptionsClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetAuthorizationOptionsClientRequestHandler = GetAuthorizationOptionsClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetCardPaymentAcceptPointServiceRequestHandler = (function (_super) {
                __extends(GetCardPaymentAcceptPointServiceRequestHandler, _super);
                function GetCardPaymentAcceptPointServiceRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetCardPaymentAcceptPointServiceRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetCardPaymentAcceptPointServiceRequest;
                };
                GetCardPaymentAcceptPointServiceRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    var asyncQueue = new Commerce.AsyncQueue().enqueue(function () {
                        var cartManager = _this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                        return cartManager.getCardPaymentAcceptPoint(request.cardPaymentEnabled, request.cardTokenizationEnabled);
                    }).enqueue(function (result) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(result)
                            && !Commerce.StringExtensions.isNullOrWhitespace(result.AcceptPageUrl)
                            && !Commerce.StringExtensions.isNullOrWhitespace(result.MessageOrigin)) {
                            return Commerce.AsyncResult.createResolved(result);
                        }
                        else {
                            return Commerce.AsyncResult.createRejected([
                                new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_UNABLETOGETCARDPAYMENTACCEPTPOINT)
                            ]);
                        }
                    });
                    return asyncQueue.run().map(function (result) {
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new Payments.GetCardPaymentAcceptPointServiceResponse(result.data)
                        };
                    }).recoverOnFailure(function (errors) {
                        if (errors[0].ErrorCode.toUpperCase() === Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_REALTIMESERVICENOTSUPPORTED.serverErrorCode) {
                            errors = [new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.NOT_SUPPORTED_IN_OFFLINE_MODE_WHEN_HARDWARE_STATION_NOT_ACTIVE)];
                        }
                        return Commerce.AsyncResult.createRejected(errors);
                    }).getPromise();
                };
                return GetCardPaymentAcceptPointServiceRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetCardPaymentAcceptPointServiceRequestHandler = GetCardPaymentAcceptPointServiceRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetCardTypeClientRequestHandler = (function (_super) {
                __extends(GetCardTypeClientRequestHandler, _super);
                function GetCardTypeClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetCardTypeClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetCardTypeClientRequest;
                };
                GetCardTypeClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to GetCardTypeClientRequestHandler execute: request cannot be null or undefined.");
                    }
                    var asyncQueue = new Commerce.AsyncQueue();
                    Commerce.RetailLogger.posPaymentGetCardTypeStarted(request.correlationId);
                    asyncQueue.enqueue(function () {
                        if (!request.retrieveUsingTenderType) {
                            var getPaymentCardTypeRequest = new Commerce.GetPaymentCardTypeByBinRangeClientRequest(request.cardNumber, request.isSwipe, request.cardInfo, null, request.correlationId);
                            return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(getPaymentCardTypeRequest)))
                                .map(function (result) {
                                return result.canceled ? null : result.data.result;
                            });
                        }
                        else {
                            return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Payments.GetAllCardTypesClientRequest(request.correlationId)))
                                .map(function (response) {
                                var filteredCardTypes = response.data.cardTypes.filter(function (cardType) {
                                    return cardType.PaymentMethodId === request.tenderType.TenderTypeId
                                        && (cardType.CardTypeValue === Commerce.Proxy.Entities.CardType.InternationalCreditCard
                                            || cardType.CardTypeValue === Commerce.Proxy.Entities.CardType.CorporateCard)
                                        && Payments.Utilities.PaymentHelper.isAssociatedCardType(cardType, request.cardNumber);
                                });
                                return filteredCardTypes;
                            });
                        }
                    }).enqueue(function (filteredCardTypes) {
                        if (request.tenderType.OperationId === Commerce.Proxy.Entities.RetailOperation.PayGiftCertificate) {
                            return _this._filterByGiftCardType(request.correlationId, filteredCardTypes, request.tenderType);
                        }
                        else {
                            var asyncResult_2 = new Commerce.AsyncResult();
                            asyncQueue.cancelOn(_this._filterByUserSelection(filteredCardTypes, request.correlationId))
                                .done(function (result) {
                                if (!result.canceled &&
                                    !Commerce.ObjectExtensions.isNullOrUndefined(request.cardTypeSelectedForTenderDiscount) &&
                                    result.data.TypeId !== request.cardTypeSelectedForTenderDiscount.TypeId) {
                                    asyncResult_2.reject([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.INVALID_CARD_USED_FOR_TENDER_DISCOUNTS)]);
                                }
                                else {
                                    asyncResult_2.resolve(result.data);
                                }
                            }).fail(function (errors) {
                                asyncResult_2.reject(errors);
                            });
                            return asyncResult_2;
                        }
                    });
                    return asyncQueue.run()
                        .fail(function (errors) {
                        Commerce.RetailLogger.posPaymentGetCardTypeFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).map(function (result) {
                        if (!result.canceled) {
                            Commerce.RetailLogger.posPaymentGetCardTypeSucceeded(request.correlationId, result.data.TypeId);
                        }
                        else {
                            Commerce.RetailLogger.posPaymentGetCardTypeCancelled(request.correlationId);
                        }
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new Payments.GetCardTypeClientResponse(result.data)
                        };
                    }).getPromise();
                };
                GetCardTypeClientRequestHandler.prototype._filterByGiftCardType = function (correlationId, cardTypes, tenderType) {
                    var _this = this;
                    var giftCardType = Commerce.ArrayExtensions.firstOrUndefined(cardTypes, function (cardType) {
                        var isGiftCardTypeVal = cardType.CardTypeValue === Commerce.Proxy.Entities.CardType.GiftCard;
                        var isSameTenderType = Commerce.StringExtensions.compare(cardType.PaymentMethodId, tenderType.TenderTypeId, true) === 0;
                        return isGiftCardTypeVal && isSameTenderType;
                    });
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(giftCardType)) {
                        return Commerce.AsyncResult.createResolved(giftCardType);
                    }
                    else {
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(new Payments.GetAllCardTypesClientRequest(correlationId)))
                            .map(function (response) {
                            var giftCardType = Commerce.ArrayExtensions.firstOrUndefined(response.data.cardTypes, function (cardType) {
                                var isGiftCardTypeVal = cardType.CardTypeValue === Commerce.Proxy.Entities.CardType.GiftCard;
                                var isSameTenderType = Commerce.StringExtensions.compare(cardType.PaymentMethodId, tenderType.TenderTypeId, true) === 0;
                                return isGiftCardTypeVal && isSameTenderType;
                            });
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(giftCardType)) {
                                return giftCardType;
                            }
                            else {
                                return _this._createUnknownCardInfo();
                            }
                        }).recoverOnFailure(function (errors) {
                            var unknownCardTypeInfo = _this._createUnknownCardInfo();
                            return Commerce.AsyncResult.createResolved(unknownCardTypeInfo);
                        });
                    }
                };
                GetCardTypeClientRequestHandler.prototype._filterByUserSelection = function (cardTypes, correlationId) {
                    if (!Commerce.ArrayExtensions.hasElements(cardTypes)) {
                        return Commerce.AsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_CARD_NOT_SUPPORTED)]);
                    }
                    else if (cardTypes.length === 1) {
                        return Commerce.AsyncResult.createResolved({ canceled: false, data: cardTypes[0] });
                    }
                    else {
                        var selectCardTypeRequest = new Payments.SelectCardTypeClientRequest(correlationId, cardTypes);
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(selectCardTypeRequest))
                            .map(function (result) {
                            return {
                                canceled: result.canceled,
                                data: result.data.result
                            };
                        });
                    }
                };
                GetCardTypeClientRequestHandler.prototype._createUnknownCardInfo = function () {
                    var cardTypeInfo = {
                        RecordId: 0,
                        TypeId: Commerce.Proxy.Entities.CardType[Commerce.Proxy.Entities.CardType.Unknown].toUpperCase(),
                        Name: Commerce.Proxy.Entities.CardType[Commerce.Proxy.Entities.CardType.Unknown].toUpperCase(),
                        CardTypeValue: Commerce.Proxy.Entities.CardType.Unknown,
                        Issuer: Commerce.Proxy.Entities.CardType[Commerce.Proxy.Entities.CardType.Unknown].toUpperCase(),
                        NumberFrom: "0",
                        NumberTo: "0",
                        CashBackLimit: 0,
                        AllowManualInput: false,
                        CheckModulus: false,
                        ExtensionProperties: []
                    };
                    return cardTypeInfo;
                };
                return GetCardTypeClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetCardTypeClientRequestHandler = GetCardTypeClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetCashBackAmountClientRequestHandler = (function (_super) {
                __extends(GetCashBackAmountClientRequestHandler, _super);
                function GetCashBackAmountClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetCashBackAmountClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetCashBackAmountClientRequest;
                };
                GetCashBackAmountClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to GetCashBackAmountClientRequest execute: request cannot be null or undefined.");
                    }
                    var asyncQueue = new Commerce.AsyncQueue();
                    var cashBackAmount = 0;
                    Commerce.RetailLogger.posGetCashBackAmountClientRequestStarted(request.correlationId);
                    asyncQueue.enqueue(function () {
                        var currencyAmount = { CurrencyCode: request.currencyCode, ConvertedAmount: 1 };
                        var getDenominationsListRequest = new Payments.GetDenominationListClientRequest(request.correlationId, currencyAmount);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(getDenominationsListRequest)));
                    }).enqueue(function (result) {
                        var getCashBackAmountInputClientRequest = new Payments.GetCashBackAmountInputClientRequest(request.correlationId, 0, result.data.result, request.cardType.CashBackLimit);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(getCashBackAmountInputClientRequest))
                            .map(function (result) {
                            cashBackAmount = result.canceled ? 0 : result.data.result.cashBack;
                            return { canceled: result.canceled };
                        }));
                    });
                    return asyncQueue.run()
                        .map(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posGetCashBackAmountClientRequestCancelled(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posGetCashBackAmountClientRequestSucceeded(request.correlationId, cashBackAmount);
                        }
                        return { canceled: result.canceled, data: result.canceled ? null : new Payments.GetCashBackAmountClientResponse(cashBackAmount) };
                    }).fail(function (errors) {
                        Commerce.RetailLogger.posGetCashBackAmountClientRequestFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).getPromise();
                };
                return GetCashBackAmountClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetCashBackAmountClientRequestHandler = GetCashBackAmountClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetCurrencyAmountsClientRequestHandler = (function (_super) {
                __extends(GetCurrencyAmountsClientRequestHandler, _super);
                function GetCurrencyAmountsClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetCurrencyAmountsClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetCurrencyAmountsClientRequest;
                };
                GetCurrencyAmountsClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the GetCurrencyAmountsClientRequestHandler received an invalid request.");
                    }
                    Commerce.RetailLogger.posGetCurrencyAmountsStarted(request.correlationId, request.amount, request.retrieveForAllCurrencies);
                    return this._getCurrencyAmounts(request.amount, request.retrieveForAllCurrencies)
                        .fail(function (errors) {
                        Commerce.RetailLogger.posGetCurrencyAmountsFailed(request.correlationId, request.amount, request.retrieveForAllCurrencies, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).map(function (result) {
                        Commerce.RetailLogger.posGetCurrencyAmountsSucceeded(request.correlationId, request.amount, request.retrieveForAllCurrencies);
                        return {
                            canceled: false,
                            data: new Payments.GetCurrencyAmountsClientResponse(result)
                        };
                    }).getPromise();
                };
                GetCurrencyAmountsClientRequestHandler.prototype._getCurrencyAmounts = function (amount, allCurrencies) {
                    if (!allCurrencies) {
                        var currencyAmount = {
                            CurrencyCode: this.context.applicationSession.deviceConfiguration.Currency,
                            ConvertedAmount: amount,
                            RoundedConvertedAmount: amount
                        };
                        return Commerce.AsyncResult.createResolved([currencyAmount]);
                    }
                    else {
                        var paymentManager = this.context.managerFactory.getManager(Commerce.Model.Managers.IPaymentManagerName);
                        return paymentManager.getCurrenciesAmount(this.context.applicationSession.deviceConfiguration.Currency, amount);
                    }
                };
                return GetCurrencyAmountsClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetCurrencyAmountsClientRequestHandler = GetCurrencyAmountsClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetDenominationListClientRequestHandler = (function (_super) {
                __extends(GetDenominationListClientRequestHandler, _super);
                function GetDenominationListClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetDenominationListClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetDenominationListClientRequest;
                };
                GetDenominationListClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the GetDenominationListClientRequestHandler received an invalid request.");
                    }
                    Commerce.RetailLogger.posGetCurrencyDenominationListStarted(request.correlationId, request.currencyAmount.CurrencyCode, request.currencyAmount.ConvertedAmount);
                    return this._getDenominationList(request.currencyAmount.CurrencyCode, request.currencyAmount.ConvertedAmount)
                        .fail(function (errors) {
                        Commerce.RetailLogger.posGetCurrencyDenominationListFailed(request.correlationId, request.currencyAmount.CurrencyCode, request.currencyAmount.ConvertedAmount, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).map(function (result) {
                        Commerce.RetailLogger.posGetCurrencyDenominationListSucceeded(request.correlationId, request.currencyAmount.CurrencyCode, request.currencyAmount.ConvertedAmount);
                        return {
                            canceled: false,
                            data: new Payments.GetDenominationListClientResponse(result)
                        };
                    }).getPromise();
                };
                GetDenominationListClientRequestHandler.prototype._getDenominationList = function (currencyCode, amount) {
                    var _this = this;
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(new Commerce.GetCashDeclarationsMapClientRequest(null)))
                        .map(function (response) {
                        var cashDeclarationDictionary = response.data.cashDeclarationsMap;
                        var denominations = [];
                        if (cashDeclarationDictionary.hasItem(currencyCode) && (amount >= 0)) {
                            denominations = cashDeclarationDictionary.getItem(currencyCode);
                        }
                        if (Commerce.ArrayExtensions.hasElements(denominations)) {
                            denominations = denominations.filter(function (value) {
                                return value.CashTypeValue === Commerce.Proxy.Entities.CashType.Note;
                            });
                            if (_this.context.applicationSession.deviceConfiguration.DenominationsToDisplayValue
                                === Commerce.Proxy.Entities.RetailDenominationsToDisplay.GreaterOrEqualToAmountDue) {
                                denominations = denominations.filter(function (value) {
                                    return value.Amount >= amount;
                                });
                            }
                            denominations.reverse();
                            denominations =
                                denominations.filter(function (value, index, array) {
                                    if (index !== 0) {
                                        return value.Amount !== array[index - 1].Amount;
                                    }
                                    return true;
                                });
                        }
                        return denominations;
                    });
                };
                return GetDenominationListClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetDenominationListClientRequestHandler = GetDenominationListClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            "use strict";
            var GetGiftCardByIdClientRequestHandler = (function (_super) {
                __extends(GetGiftCardByIdClientRequestHandler, _super);
                function GetGiftCardByIdClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetGiftCardByIdClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetGiftCardByIdClientRequest;
                };
                GetGiftCardByIdClientRequestHandler.prototype.executeAsync = function (request) {
                    return Payments.Utilities.PaymentHelper.getGiftCardByIdAsync(request.tenderType, request.giftCardId, request.correlationId, this.context)
                        .map(function (card) {
                        return {
                            data: new Payments.GetGiftCardByIdClientResponse(card),
                            canceled: false
                        };
                    }).getPromise();
                };
                return GetGiftCardByIdClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetGiftCardByIdClientRequestHandler = GetGiftCardByIdClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetPaymentCardTypeByBinRangeClientRequestHandler = (function (_super) {
                __extends(GetPaymentCardTypeByBinRangeClientRequestHandler, _super);
                function GetPaymentCardTypeByBinRangeClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetPaymentCardTypeByBinRangeClientRequestHandler.prototype.supportedRequestType = function () {
                    return Commerce.GetPaymentCardTypeByBinRangeClientRequest;
                };
                GetPaymentCardTypeByBinRangeClientRequestHandler.prototype.executeAsync = function (request) {
                    var isSwipe = request.isSwipe;
                    var cardInfo = request.cardInfo;
                    var paymentCardNumber = request.paymentCardNumber;
                    var cardTypeIdString = cardInfo ? cardInfo.CardTypeId : null;
                    var cardTypeId = parseInt(cardTypeIdString, 10);
                    var isCreditCard = Payments.Utilities.PaymentHelper.isCreditCard(cardTypeId);
                    var isDebitCard = Payments.Utilities.PaymentHelper.isDebitCard(cardTypeId);
                    var filteredCardTypes = [];
                    if (!isSwipe && !isDebitCard) {
                        isCreditCard = true;
                    }
                    return this.context.runtime.executeAsync(new Payments.GetAllCardTypesClientRequest(request.correlationId))
                        .then(function (response) {
                        var ignoredCardTypes = [];
                        filteredCardTypes = response.data.cardTypes.filter(function (cardType) {
                            if (!isSwipe && !cardType.AllowManualInput) {
                                return false;
                            }
                            if ((isCreditCard && !Payments.Utilities.PaymentHelper.isCreditCard(cardType.CardTypeValue))
                                || (isDebitCard && !Payments.Utilities.PaymentHelper.isDebitCard(cardType.CardTypeValue))) {
                                return false;
                            }
                            if (Payments.Utilities.PaymentHelper.isAssociatedCardType(cardType, paymentCardNumber)) {
                                if (cardType.CardTypeValue === cardTypeId) {
                                    return true;
                                }
                                else {
                                    ignoredCardTypes.push(cardType.TypeId);
                                }
                            }
                            return false;
                        });
                        if (Commerce.ArrayExtensions.hasElements(ignoredCardTypes)) {
                            Commerce.RetailLogger.posPaymentCardTypeFilterByBinRangeIgnoreCardTypeIds(request.correlationId, ignoredCardTypes.toString(), cardTypeId);
                        }
                        return Promise.resolve({
                            canceled: false,
                            data: new Commerce.GetPaymentCardTypeByBinRangeClientResponse(filteredCardTypes)
                        });
                    });
                };
                return GetPaymentCardTypeByBinRangeClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetPaymentCardTypeByBinRangeClientRequestHandler = GetPaymentCardTypeByBinRangeClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetReturnOptionsClientRequestHandler = (function (_super) {
                __extends(GetReturnOptionsClientRequestHandler, _super);
                function GetReturnOptionsClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetReturnOptionsClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetReturnOptionsClientRequest;
                };
                GetReturnOptionsClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to GetReturnOptionsClientRequestHandler execute: request cannot be null or undefined.");
                    }
                    var cartManager = this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                    return cartManager.getReturnOptions(this.context.applicationSession.userSession.transaction.cart.Id)
                        .map(function (result) {
                        var response;
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(result) && !Commerce.StringExtensions.isNullOrWhitespace(request.tenderTypeId)) {
                            result = result.filter(function (amount) {
                                return amount.TenderTypeId === request.tenderTypeId;
                            });
                        }
                        response = new Payments.GetReturnOptionsClientResponse(result);
                        return {
                            canceled: Commerce.ObjectExtensions.isNullOrUndefined(result),
                            data: response
                        };
                    }).getPromise();
                };
                return GetReturnOptionsClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetReturnOptionsClientRequestHandler = GetReturnOptionsClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetTenderBasedDiscountClientRequestHandler = (function (_super) {
                __extends(GetTenderBasedDiscountClientRequestHandler, _super);
                function GetTenderBasedDiscountClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetTenderBasedDiscountClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetTenderBasedDiscountClientRequest;
                };
                GetTenderBasedDiscountClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to GetTenderBasedDiscountClientRequestHandler execute: request cannot be null or undefined.");
                    }
                    var asyncQueue = new Commerce.AsyncQueue();
                    var cartManager = this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                    Commerce.RetailLogger.posGetTenderBasedDiscountStarted(request.correlationId);
                    asyncQueue.enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Payments.GetAllCardTypesClientRequest(request.correlationId)))
                            .map(function (response) {
                            var filteredCardTypes = response.data.cardTypes.filter(function (cardType) {
                                return cardType.PaymentMethodId === request.tenderType.TenderTypeId;
                            });
                            return filteredCardTypes;
                        });
                    }).enqueue(function (cardList) {
                        if (Commerce.ArrayExtensions.hasElements(cardList)) {
                            var cardTypeListWithTenderDiscount_1 = [];
                            var distinctCardTypesAvailable_1 = 0;
                            cardList.forEach(function (cardType) {
                                if (!Commerce.ArrayExtensions.hasElements(cardTypeListWithTenderDiscount_1.filter(function (value) {
                                    return value.TypeId === cardType.TypeId;
                                }))) {
                                    distinctCardTypesAvailable_1 = distinctCardTypesAvailable_1 + 1;
                                    if (cardType.HasTenderDiscount) {
                                        cardTypeListWithTenderDiscount_1.push(cardType);
                                    }
                                }
                            });
                            if (Commerce.ArrayExtensions.hasElements(cardTypeListWithTenderDiscount_1)) {
                                if (distinctCardTypesAvailable_1 > 1) {
                                    var inputRequest = new Payments.SelectCardTypeForTenderBasedDiscountInputClientRequest(request.correlationId, cardTypeListWithTenderDiscount_1);
                                    return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(inputRequest)))
                                        .map(function (result) {
                                        if (!Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                                            return {
                                                canceled: false,
                                                data: result.data.result
                                            };
                                        }
                                        return { canceled: true, data: null };
                                    });
                                }
                                else {
                                    return Commerce.AsyncResult.createResolved({ canceled: false, data: cardTypeListWithTenderDiscount_1[0] });
                                }
                            }
                        }
                        return Commerce.AsyncResult.createResolved({ canceled: false, data: null });
                    }).enqueue(function (result) {
                        if (result.canceled) {
                            asyncQueue.cancel();
                            return Commerce.AsyncResult.createResolved(null);
                        }
                        else if (Commerce.ObjectExtensions.isNullOrUndefined(result.data) || Commerce.StringExtensions.isNullOrWhitespace(result.data.TypeId)) {
                            return Commerce.AsyncResult.createResolved(null);
                        }
                        else {
                            var tenderLine = {
                                TenderTypeId: request.tenderType.TenderTypeId,
                                CardTypeId: result.data.TypeId,
                                Amount: _this.context.applicationSession.userSession.transaction.cart.AmountDue
                            };
                            return cartManager.calculateTenderDiscountAsync(tenderLine, _this.context.applicationSession.userSession.transaction.cart.Version)
                                .map(function (response) {
                                return {
                                    cardType: result.data,
                                    tenderDiscountLine: response
                                };
                            });
                        }
                    });
                    return asyncQueue.run()
                        .fail(function (errors) {
                        Commerce.RetailLogger.posGetTenderBasedDiscountFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).map(function (result) {
                        if (!result.canceled) {
                            Commerce.RetailLogger.posGetTenderBasedDiscountSucceeded(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posGetTenderBasedDiscountCancelled(request.correlationId);
                        }
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new Payments.GetTenderBasedDiscountClientResponse(result.data)
                        };
                    }).getPromise();
                };
                return GetTenderBasedDiscountClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetTenderBasedDiscountClientRequestHandler = GetTenderBasedDiscountClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var RefundCaptureTokenAndAddToCartClientRequestHandler = (function (_super) {
                __extends(RefundCaptureTokenAndAddToCartClientRequestHandler, _super);
                function RefundCaptureTokenAndAddToCartClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                RefundCaptureTokenAndAddToCartClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.RefundCaptureTokenAndAddToCartClientRequest;
                };
                RefundCaptureTokenAndAddToCartClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to RefundCaptureTokenAndAddToCartClientRequestHandler execute: "
                            + "request cannot be null or undefined.");
                    }
                    var asyncQueue = new Commerce.AsyncQueue();
                    var refundPaymentInfo;
                    var newRefundTenderLine = null;
                    var refundAmount = Math.abs(this.context.applicationSession.userSession.transaction.cart.AmountDue) < request.refundableTenderLine.RefundableAmount
                        ? Math.abs(this.context.applicationSession.userSession.transaction.cart.AmountDue) : request.refundableTenderLine.RefundableAmount;
                    var cardNotPresentProcessingConfiguration = this.context.applicationSession.deviceConfiguration.CardNotPresentProcessingConfigurationValue;
                    Commerce.RetailLogger.posRefundCaptureTokenAndAddToCartStarted(request.correlationId, refundAmount);
                    if (cardNotPresentProcessingConfiguration === Commerce.Proxy.Entities.CardNotPresentProcessingConfiguration.UseCommerceEngine) {
                        asyncQueue.enqueue(function () {
                            Commerce.RetailLogger.posAddLinkedRefundCartTenderLineStarted(request.correlationId, request.refundableTenderLine.LineNumber, request.refundableTenderLine.PaymentRefRecId);
                            var cartTenderLine = {
                                Amount: refundAmount * -1,
                                Currency: _this.context.applicationSession.deviceConfiguration.Currency,
                                TenderTypeId: request.refundableTenderLine.TenderTypeId,
                                CardTypeId: request.refundableTenderLine.CardTypeId,
                                ProcessingTypeValue: Commerce.Proxy.Entities.PaymentProcessingType.LinkedRefund,
                                IsLinkedRefund: true,
                                LinkedPaymentStore: request.refundableTenderLine.StoreId,
                                LinkedPaymentTerminalId: request.refundableTenderLine.TerminalId,
                                LinkedPaymentTransactionId: request.refundableTenderLine.TransactionId,
                                LinkedPaymentLineNumber: request.refundableTenderLine.LineNumber,
                                LinkedPaymentCurrency: request.refundableTenderLine.Currency,
                                LinkedPaymentRefRecId: request.refundableTenderLine.PaymentRefRecId
                            };
                            var addTenderLineToCartRequest = new Commerce.AddTenderLineToCartClientRequest(cartTenderLine, request.correlationId);
                            var addTenderLineToCartResponse = Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(addTenderLineToCartRequest));
                            return asyncQueue.cancelOn(addTenderLineToCartResponse)
                                .done(function (result) {
                                if (result.canceled) {
                                    Commerce.RetailLogger.posAddLinkedRefundCartTenderLineCancelled(request.correlationId);
                                }
                                else {
                                    Commerce.RetailLogger.posAddLinkedRefundCartTenderLineSucceeded(request.correlationId);
                                }
                            }).fail(function (errors) {
                                Commerce.RetailLogger.posAddLinkedRefundCartTenderLineFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                            });
                        });
                    }
                    else {
                        asyncQueue.enqueue(function () {
                            Commerce.RetailLogger.posRefundCaptureTokenStarted(request.correlationId, refundAmount);
                            var refundCaptureTokenRequest = new Commerce.Peripherals.CardPaymentRefundCaptureTokenPeripheralRequest(request.correlationId, refundAmount, request.refundableTenderLine.CaptureToken, request.refundableTenderLine.CardPaymentAccountId);
                            return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(refundCaptureTokenRequest)))
                                .done(function (result) {
                                if (result.canceled) {
                                    Commerce.RetailLogger.posRefundCaptureTokenCancelled(request.correlationId, refundAmount);
                                }
                                else {
                                    Commerce.RetailLogger.posRefundCaptureTokenSucceeded(request.correlationId, refundAmount);
                                }
                                refundPaymentInfo = result.canceled ? null : result.data.result;
                            }).fail(function (errors) {
                                Commerce.RetailLogger.posRefundCaptureTokenFailed(request.correlationId, refundAmount, Commerce.Framework.ErrorConverter.serializeError(errors));
                            });
                        }).enqueue(function () {
                            if (!refundPaymentInfo.IsApproved) {
                                Commerce.RetailLogger.posRefundCaptureTokenNotApproved(request.correlationId);
                                return Commerce.AsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_UNABLE_AUTHORIZE_OR_REFUND)]);
                            }
                            return Commerce.VoidAsyncResult.createResolved();
                        }).enqueue(function () {
                            Commerce.RetailLogger.posAddRefundedTenderLineToCartStarted(request.correlationId);
                            newRefundTenderLine = {
                                CaptureToken: request.refundableTenderLine.CaptureToken,
                                Amount: refundPaymentInfo.ApprovedAmount * -1,
                                Authorization: refundPaymentInfo.PaymentSdkData,
                                Currency: _this.context.applicationSession.deviceConfiguration.Currency,
                                TenderTypeId: request.refundableTenderLine.TenderTypeId,
                                CardTypeId: request.refundableTenderLine.CardTypeId,
                                ProcessingTypeValue: Commerce.Proxy.Entities.PaymentProcessingType.LinkedRefund,
                                StatusValue: Commerce.Proxy.Entities.TenderLineStatus.Committed,
                                IsVoidable: true,
                                CardProcessorStatusValue: Commerce.Proxy.Entities.CreditCardProcessorStatus.Approved,
                                IsLinkedRefund: true,
                                LinkedPaymentStore: request.refundableTenderLine.StoreId,
                                LinkedPaymentTerminalId: request.refundableTenderLine.TerminalId,
                                LinkedPaymentTransactionId: request.refundableTenderLine.TransactionId,
                                LinkedPaymentLineNumber: request.refundableTenderLine.LineNumber,
                                LinkedPaymentCurrency: request.refundableTenderLine.Currency,
                                LinkedPaymentRefRecId: request.refundableTenderLine.PaymentRefRecId
                            };
                            var addTenderLineRequest = new Commerce.AddPreprocessedTenderLineToCartClientRequest(newRefundTenderLine);
                            return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(addTenderLineRequest)))
                                .done(function (result) {
                                if (result.canceled) {
                                    Commerce.RetailLogger.posAddRefundedTenderLineToCartCancelled(request.correlationId);
                                }
                                else {
                                    Commerce.RetailLogger.posAddRefundedTenderLineToCartSucceeded(request.correlationId);
                                }
                            }).recoverOnFailure(function (errors) {
                                Commerce.RetailLogger.posAddRefundedTenderLineToCartFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                                var asyncResult = new Commerce.AsyncResult();
                                _this._voidPaymentAsync(request.correlationId, refundPaymentInfo.ApprovedAmount, refundPaymentInfo, newRefundTenderLine, errors).always(function () {
                                    asyncResult.reject(errors);
                                });
                                return asyncResult;
                            });
                        });
                    }
                    return asyncQueue.run()
                        .map(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posRefundCaptureTokenAndAddToCartCancelled(request.correlationId, refundAmount);
                        }
                        else {
                            Commerce.RetailLogger.posRefundCaptureTokenAndAddToCartSucceeded(request.correlationId, refundAmount);
                        }
                        return {
                            canceled: result.canceled,
                            data: result.canceled ?
                                null :
                                new Payments.RefundCaptureTokenAndAddToCartClientResponse(_this.context.applicationSession.userSession.transaction.cart)
                        };
                    }).fail(function (errors) {
                        Commerce.RetailLogger.posRefundCaptureTokenAndAddToCartFailed(request.correlationId, refundAmount, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).getPromise();
                };
                RefundCaptureTokenAndAddToCartClientRequestHandler.prototype._voidPaymentAsync = function (correlationId, refundAmount, paymentInfo, tenderLine, errors) {
                    var voidPaymentFailureMessage = Payments.ErrorCodes.PAYMENT_AUTHORIZED_VOID_FAILED;
                    var request = new Payments.VoidPaymentClientRequest(correlationId, paymentInfo, tenderLine, refundAmount, Commerce.Proxy.Entities.PeripheralPaymentType.CardPaymentController, voidPaymentFailureMessage, errors);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(request)).map(function () { return void 0; });
                };
                return RefundCaptureTokenAndAddToCartClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.RefundCaptureTokenAndAddToCartClientRequestHandler = RefundCaptureTokenAndAddToCartClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            "use strict";
            var SaveMerchantInformationClientRequestHandler = (function (_super) {
                __extends(SaveMerchantInformationClientRequestHandler, _super);
                function SaveMerchantInformationClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SaveMerchantInformationClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.SaveMerchantInformationClientRequest;
                };
                SaveMerchantInformationClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to SaveMerchantInformationClientRequestHandler execute: request cannot be null or undefined");
                    }
                    var hardwareProfile = request.hardwareProfile;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(hardwareProfile) || hardwareProfile.EftTypeId !== Commerce.Proxy.Entities.EFTType.PaymentSDK) {
                        return Promise.resolve({
                            canceled: true,
                            data: new Payments.SaveMerchantInformationClientResponse(void 0)
                        });
                    }
                    var correlationId = request.correlationId;
                    var environmentId = null;
                    var envConfig = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.ENVIRONMENT_CONFIGURATION_KEY);
                    if (!Commerce.StringExtensions.isNullOrWhitespace(envConfig)) {
                        var environmentConfiguration = JSON.parse(envConfig);
                        environmentId = environmentConfiguration.EnvironmentId;
                    }
                    var hardwareProfileId = hardwareProfile.ProfileId;
                    if (Commerce.StringExtensions.isNullOrWhitespace(environmentId) || Commerce.ObjectExtensions.isNullOrUndefined(hardwareProfile.RecordId)) {
                        Commerce.RetailLogger.activitiesSaveMerchantInformationMissingIdentifier(hardwareProfileId, environmentId, hardwareProfile.RecordId, correlationId, "SaveMerchantInformationClientRequestHandler");
                        return Promise.reject([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.HARDWARESTATION_MISSING_MERCHANT_INFO_IDENTIFIER)]);
                    }
                    var hardwareProfileRecordId = hardwareProfile.RecordId.toString();
                    var paymentMerchantInfoAsyncQueue = new Commerce.AsyncQueue();
                    var asyncQueue = paymentMerchantInfoAsyncQueue.enqueue(function () {
                        var merchantInfoExistsRequest = {
                            EnvironmentId: environmentId,
                            HardwareProfileRecId: hardwareProfileRecordId
                        };
                        return Payments.Utilities.MerchantInformationHelper.merchantInformationLocalExistsAsync(merchantInfoExistsRequest, _this.context.runtime, hardwareProfileId, correlationId)
                            .map(function (result) {
                            var localMerchantPropertiesHash = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.PAYMENT_MERCHANT_PROPERTIES_HASH_VALUE);
                            localMerchantPropertiesHash = Commerce.StringExtensions.isNullOrWhitespace(localMerchantPropertiesHash) || !result ?
                                Commerce.StringExtensions.EMPTY : localMerchantPropertiesHash;
                            Commerce.RetailLogger.activitiesSaveMerchantInformationCurrentState(hardwareProfileId, localMerchantPropertiesHash, result, correlationId);
                            return localMerchantPropertiesHash;
                        })
                            .recoverOnFailure(function (errors) {
                            if (Commerce.ArrayExtensions.hasElements(errors)) {
                                if (Payments.Utilities.PaymentErrorHelper.hasError(errors, Payments.ErrorCodes.HARDWARESTATION_LOCAL_MERCHANT_INFO_NOT_SUPPORTED)) {
                                    asyncQueue.cancel();
                                    return Commerce.VoidAsyncResult.createResolved();
                                }
                                if (Payments.Utilities.PaymentErrorHelper.hasError(errors, Payments.ErrorCodes.PERIPHERALS_HARDWARESTATION_COMMUNICATION_FAILED)) {
                                    errors.splice(0, 1, new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.MICROSOFT_DYNAMICS_POS_CLIENTBROKER_COMMUNICATION_ERROR.serverErrorCode));
                                }
                            }
                            return Commerce.VoidAsyncResult.createRejected(errors);
                        });
                    }).enqueue(function (localMerchantPropertiesHash) {
                        var channelManager = _this.context.managerFactory.getManager(Commerce.Model.Managers.IChannelManagerName);
                        Commerce.RetailLogger.activitiesSaveMerchantInformationRequestingFromServer(hardwareProfileId, localMerchantPropertiesHash, correlationId);
                        return channelManager.getPaymentPropertiesIfModifiedAsync(hardwareProfileId, localMerchantPropertiesHash)
                            .recoverOnFailure(function (errors) {
                            var isCommunicationException = _this._isCommunicationException(errors);
                            if (!Commerce.StringExtensions.isNullOrWhitespace(localMerchantPropertiesHash)) {
                                var paymentInformation = {
                                    PaymentConnectorPropertiesXml: Commerce.StringExtensions.EMPTY,
                                    MerchantPropertiesHashValue: Commerce.StringExtensions.EMPTY
                                };
                                if (isCommunicationException) {
                                    Commerce.RetailLogger.activitiesSaveMerchantInformationRetailServerFailedWithCommunicationException(hardwareProfileId, localMerchantPropertiesHash, correlationId);
                                }
                                else {
                                    Commerce.RetailLogger.activitiesSaveMerchantInformationDownloadFailed(hardwareProfileId, localMerchantPropertiesHash, correlationId);
                                }
                                return Commerce.AsyncResult.createResolved(paymentInformation);
                            }
                            Commerce.RetailLogger.activitiesSaveMerchantInformationFailed(hardwareProfileId, correlationId);
                            return Commerce.VoidAsyncResult.createRejected(errors);
                        });
                    }).enqueue(function (paymentMerchantInformationFromHQ) {
                        var remoteMerchantPropertiesHash = paymentMerchantInformationFromHQ.MerchantPropertiesHashValue;
                        var paymentConnectorPropertiesXml = paymentMerchantInformationFromHQ.PaymentConnectorPropertiesXml;
                        if (Commerce.StringExtensions.isNullOrWhitespace(paymentConnectorPropertiesXml) &&
                            Commerce.StringExtensions.isNullOrWhitespace(remoteMerchantPropertiesHash)) {
                            Commerce.RetailLogger.activitiesSaveMerchantInformationRequestedFromServerNotChanged(hardwareProfileId, correlationId);
                            return Commerce.VoidAsyncResult.createResolved();
                        }
                        else if (Commerce.StringExtensions.isNullOrWhitespace(paymentConnectorPropertiesXml) &&
                            !Commerce.StringExtensions.isNullOrWhitespace(remoteMerchantPropertiesHash)) {
                            Commerce.RetailLogger.activitiesSaveMerchantInformationRequestedFromServerNotValid(hardwareProfileId, remoteMerchantPropertiesHash, correlationId);
                            var merchantInfoValidationError = new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDMERCHANTPROPERTY, false);
                            return Commerce.VoidAsyncResult.createRejected([merchantInfoValidationError]);
                        }
                        Commerce.RetailLogger.activitiesSaveMerchantInformationRequestedFromServerChanged(hardwareProfileId, remoteMerchantPropertiesHash, correlationId);
                        if (!Commerce.StringExtensions.isNullOrWhitespace(remoteMerchantPropertiesHash)) {
                            Commerce.ApplicationStorage.setItem(Commerce.ApplicationStorageIDs.PAYMENT_MERCHANT_PROPERTIES_HASH_VALUE, remoteMerchantPropertiesHash);
                        }
                        var paymentMerchantInfoRequest = {
                            HardwareProfileId: hardwareProfileId,
                            PaymentMerchantInformation: paymentConnectorPropertiesXml,
                            EnvironmentId: environmentId,
                            HardwareProfileRecId: hardwareProfileRecordId
                        };
                        return Payments.Utilities.MerchantInformationHelper.saveMerchantInformationLocalAsync(paymentMerchantInfoRequest, _this.context.runtime, hardwareProfileId, correlationId)
                            .recoverOnFailure(function (errors) {
                            if (Commerce.ArrayExtensions.hasElements(errors)) {
                                if (Payments.Utilities.PaymentErrorHelper.hasError(errors, "Microsoft_Dynamics_Commerce_HardwareStation_PaymentMerchantInformationStorageError")) {
                                    Commerce.RetailLogger.activitiesSaveMerchantInformationNotSupportedForSharedHardwareStation(correlationId);
                                    asyncQueue.cancel();
                                    return Commerce.VoidAsyncResult.createResolved();
                                }
                                if (Payments.Utilities.PaymentErrorHelper.hasError(errors, Payments.ErrorCodes.PERIPHERALS_HARDWARESTATION_COMMUNICATION_FAILED)) {
                                    errors.splice(0, 1, new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.MICROSOFT_DYNAMICS_POS_CLIENTBROKER_COMMUNICATION_ERROR.serverErrorCode));
                                }
                            }
                            return Commerce.VoidAsyncResult.createRejected(errors);
                        });
                    }).enqueue(function () {
                        return Commerce.AsyncResult.createResolved(new Payments.SaveMerchantInformationClientResponse(void 0));
                    });
                    return asyncQueue.run().getPromise();
                };
                SaveMerchantInformationClientRequestHandler.prototype._isCommunicationException = function (errors) {
                    var isCommunicationFailure = Payments.Utilities.PaymentErrorHelper.hasError(errors, Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_HEADQUARTERCOMMUNICATIONFAILURE.serverErrorCode);
                    var isTimeOutError = Payments.Utilities.PaymentErrorHelper.hasError(errors, Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_TRANSACTIONSERVICETIMEOUT.serverErrorCode);
                    var isCommunicationException = isCommunicationFailure || isTimeOutError;
                    return isCommunicationException;
                };
                return SaveMerchantInformationClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.SaveMerchantInformationClientRequestHandler = SaveMerchantInformationClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            "use strict";
            var SelectAllowedRefundOptionClientRequestHandler = (function (_super) {
                __extends(SelectAllowedRefundOptionClientRequestHandler, _super);
                function SelectAllowedRefundOptionClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SelectAllowedRefundOptionClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.SelectAllowedRefundOptionClientRequest;
                };
                SelectAllowedRefundOptionClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the SelectAllowedRefundOptionClientRequestHandler received an invalid request.");
                    }
                    var asyncQueue = new Commerce.AsyncQueue();
                    var userCanOverrideReturnPolicy;
                    asyncQueue.enqueue(function () {
                        var currentUser = _this.context.applicationSession.userSession.employee;
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.CheckUserCanOverrideReturnPolicyClientRequest(request.correlationId, currentUser)))
                            .done(function (response) {
                            userCanOverrideReturnPolicy = response.data.result.isOverridableByUser;
                        });
                    }).enqueue(function () {
                        var getReturnOptionsClientRequest = new Payments.GetReturnOptionsClientRequest(request.correlationId);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(getReturnOptionsClientRequest)));
                    }).enqueue(function (response) {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Payments.GetAllowedReturnOptionsClientRequest(request.correlationId, response.data.result)));
                    }).enqueue(function (response) {
                        var refundOptions = response.data.result;
                        var activityRequest = new Commerce.SelectAllowedRefundOptionInputClientRequest(request.correlationId, _this.context.applicationSession.userSession.transaction.cart.AmountDue, refundOptions, userCanOverrideReturnPolicy);
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(activityRequest))
                            .map(function (result) {
                            return result.data;
                        });
                    });
                    return asyncQueue.run()
                        .map(function (result) {
                        return {
                            canceled: Commerce.ObjectExtensions.isNullOrUndefined(result.data),
                            data: Commerce.ObjectExtensions.isNullOrUndefined(result.data) ? null :
                                new Payments.SelectAllowedRefundOptionClientResponse(result.data.result)
                        };
                    }).getPromise();
                };
                return SelectAllowedRefundOptionClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.SelectAllowedRefundOptionClientRequestHandler = SelectAllowedRefundOptionClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var SelectCardTypeClientRequestHandler = (function (_super) {
                __extends(SelectCardTypeClientRequestHandler, _super);
                function SelectCardTypeClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SelectCardTypeClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.SelectCardTypeClientRequest;
                };
                SelectCardTypeClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the SelectCardTypeClientRequestHandler received an invalid request.");
                    }
                    Commerce.RetailLogger.posSelectCardTypeStarted(request.correlationId);
                    var inputRequest = new Payments.SelectCardTypeInputClientRequest(request.correlationId, request.cardTypes);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(inputRequest))
                        .fail(function (errors) {
                        Commerce.RetailLogger.posSelectCardTypeFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).map(function (result) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                            Commerce.RetailLogger.posSelectCardTypeCancelled(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posSelectCardTypeSucceeded(request.correlationId, result.data.result.TypeId);
                        }
                        return {
                            canceled: Commerce.ObjectExtensions.isNullOrUndefined(result.data),
                            data: Commerce.ObjectExtensions.isNullOrUndefined(result.data) ? null : new Payments.SelectCardTypeClientResponse(result.data.result)
                        };
                    }).getPromise();
                };
                return SelectCardTypeClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.SelectCardTypeClientRequestHandler = SelectCardTypeClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            "use strict";
            var SelectLinkedRefundClientRequestHandler = (function (_super) {
                __extends(SelectLinkedRefundClientRequestHandler, _super);
                function SelectLinkedRefundClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SelectLinkedRefundClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.SelectLinkedRefundClientRequest;
                };
                SelectLinkedRefundClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the SelectLinkedRefundClientRequestHandler received an invalid request.");
                    }
                    Commerce.RetailLogger.posSelectLinkedRefundDialogStarted(request.correlationId);
                    var refundableTenderLines = this.context.applicationSession.userSession.transaction.cart.RefundableTenderLines.filter(function (tenderLine) {
                        return (tenderLine.RefundableAmount !== 0 && !Commerce.StringExtensions.isNullOrWhitespace(tenderLine.CaptureToken));
                    });
                    var activityRequest = new Commerce.SelectLinkedRefundInputClientRequest(request.correlationId, this.context.applicationSession.userSession.transaction.cart.AmountDue, request.tenderType, refundableTenderLines);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(activityRequest))
                        .map(function (result) {
                        var wasCanceled = Commerce.ObjectExtensions.isNullOrUndefined(result.data);
                        if (wasCanceled) {
                            Commerce.RetailLogger.posSelectLinkedRefundDialogCanceled(request.correlationId);
                        }
                        else if (!Commerce.ObjectExtensions.isNullOrUndefined(result.data.result)) {
                            Commerce.RetailLogger.posSelectLinkedRefundDialogRefundableLineSelected(request.correlationId, result.data.result.LinkedPaymentTerminalId, result.data.result.LinkedPaymentTransactionId, result.data.result.LinkedPaymentStore, result.data.result.LinkedPaymentLineNumber);
                        }
                        else {
                            Commerce.RetailLogger.posSelectLinkedRefundDialogPayCardSelected(request.correlationId);
                        }
                        return {
                            canceled: wasCanceled,
                            data: wasCanceled ? null : new Payments.SelectLinkedRefundClientResponse(result.data.result)
                        };
                    }).getPromise();
                };
                return SelectLinkedRefundClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.SelectLinkedRefundClientRequestHandler = SelectLinkedRefundClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var SelectTransactionPaymentMethodClientRequestHandler = (function (_super) {
                __extends(SelectTransactionPaymentMethodClientRequestHandler, _super);
                function SelectTransactionPaymentMethodClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SelectTransactionPaymentMethodClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.SelectTransactionPaymentMethodClientRequest;
                };
                SelectTransactionPaymentMethodClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the SelectTransactionPaymentMethodClientRequestHandler received an invalid request.");
                    }
                    var paymentDialogOptions = this._getTenderTypeOptions(request.showOnlyReturnWithoutReceiptTenders);
                    var asyncQueue = new Commerce.AsyncQueue();
                    return asyncQueue.enqueue(function () {
                        var request = new Commerce.TenderCounting.GetTenderTypeForSalesTransactionsClientRequest(null);
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(request))
                            .map(function (response) {
                            return response.data.tenderTypes;
                        });
                    }).enqueue(function (tenderTypesResult) {
                        var triggerOptions = {
                            tenderTypes: tenderTypesResult,
                            cart: _this.context.applicationSession.userSession.transaction.cart
                        };
                        return asyncQueue.cancelOn(_this.context.triggerManager.execute(Commerce.Triggers.CancelableTriggerType.PreSelectTransactionPaymentMethod, triggerOptions));
                    }).enqueue(function (triggerResult) {
                        var activityRequest = new Payments.SelectTenderTypeInputClientRequest(request.correlationId, triggerResult.data.tenderTypes, paymentDialogOptions.title, paymentDialogOptions.message);
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(activityRequest))
                            .map(function (result) {
                            if (Commerce.ObjectExtensions.isNullOrUndefined(result.data) || Commerce.ObjectExtensions.isNullOrUndefined(result.data.result)) {
                                asyncQueue.cancel();
                                return null;
                            }
                            else {
                                return result.data.result;
                            }
                        });
                    }).run().map(function (queueResult) {
                        return {
                            canceled: queueResult.canceled,
                            data: queueResult.canceled ? null : new Payments.SelectTransactionPaymentMethodClientResponse(queueResult.data)
                        };
                    }).getPromise();
                };
                SelectTransactionPaymentMethodClientRequestHandler.prototype._getTenderTypeOptions = function (showOnlyReturnWithoutReceiptTenders) {
                    var dialogOptions = {};
                    if (showOnlyReturnWithoutReceiptTenders) {
                        dialogOptions.title = this.context.stringResourceManager.getString("string_4489");
                        dialogOptions.message = this.context.stringResourceManager.getString("string_29709");
                    }
                    else {
                        var isCustomerOrderCreateOrEdition = (!Commerce.ObjectExtensions.isNullOrUndefined(this.context.applicationSession.userSession.transaction.cart)
                            && this.context.applicationSession.userSession.transaction.cart.CartTypeValue === Commerce.Proxy.Entities.CartType.CustomerOrder
                            && this.context.applicationSession.userSession.transaction.cart
                                .CustomerOrderModeValue === Commerce.Proxy.Entities.CustomerOrderMode.CustomerOrderCreateOrEdit);
                        if (isCustomerOrderCreateOrEdition) {
                            dialogOptions.title = this.context.stringResourceManager.getString("string_4317");
                            dialogOptions.message = this.context.stringResourceManager.getString("string_4318");
                        }
                        else {
                            dialogOptions.title = this.context.stringResourceManager.getString("string_100");
                            dialogOptions.message = this.context.stringResourceManager.getString("string_101");
                        }
                    }
                    return dialogOptions;
                };
                return SelectTransactionPaymentMethodClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.SelectTransactionPaymentMethodClientRequestHandler = SelectTransactionPaymentMethodClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var TokenizePaymentCardClientRequestHandler = (function (_super) {
                __extends(TokenizePaymentCardClientRequestHandler, _super);
                function TokenizePaymentCardClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TokenizePaymentCardClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.TokenizePaymentCardClientRequest;
                };
                TokenizePaymentCardClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    var correlationId = TsLogging.Utils.generateGuid();
                    var cancelableAsyncQueue = new Commerce.AsyncQueue();
                    var asyncQueue = cancelableAsyncQueue.enqueue(function () {
                        var request = new Commerce.TenderCounting.GetTenderTypeForSalesTransactionsClientRequest(correlationId);
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(request))
                            .map(function (response) {
                            return response.data.tenderTypes.
                                filter(function (tenderType) { return tenderType.OperationId === Commerce.Operations.RetailOperation.PayCard; });
                        });
                    }).enqueue(function (tenderTypesResult) {
                        var activityRequest = new Payments.SelectTenderTypeInputClientRequest(request.correlationId, tenderTypesResult, _this.context.stringResourceManager.getString("string_4319"), _this.context.stringResourceManager.getString("string_4320"));
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(activityRequest))
                            .map(function (result) {
                            var selectTenderTypeCanceled = Commerce.ObjectExtensions.isNullOrUndefined(result.data)
                                || Commerce.ObjectExtensions.isNullOrUndefined(result.data.result);
                            if (selectTenderTypeCanceled) {
                                cancelableAsyncQueue.cancel();
                                return null;
                            }
                            else {
                                return result.data.result;
                            }
                        });
                    }).enqueue(function (tenderType) {
                        var operationRequest = new Payments.Operations.TokenizedPaymentCardOperationRequest(Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid(), tenderType);
                        return cancelableAsyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(operationRequest))).map(function (result) {
                            return result.canceled ? null : result.data.tokenizedCard;
                        });
                    });
                    return asyncQueue.run()
                        .map(function (result) {
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new Payments.TokenizePaymentCardClientResponse(result.data)
                        };
                    }).getPromise();
                };
                return TokenizePaymentCardClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.TokenizePaymentCardClientRequestHandler = TokenizePaymentCardClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            var Handlers;
            (function (Handlers) {
                "use strict";
                var TokenizedPaymentCardOperationRequestHandler = (function (_super) {
                    __extends(TokenizedPaymentCardOperationRequestHandler, _super);
                    function TokenizedPaymentCardOperationRequestHandler() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    TokenizedPaymentCardOperationRequestHandler.prototype.supportedRequestType = function () {
                        return Operations.TokenizedPaymentCardOperationRequest;
                    };
                    TokenizedPaymentCardOperationRequestHandler.prototype.executeAsync = function (request) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                            throw new Error("The executeAsync method for the TokenizedPaymentCardOperationRequestHandler received a null or undefined request.");
                        }
                        var operationOptions = {
                            correlationId: request.correlationId,
                            tenderType: request.tenderType,
                            isTokenizePayment: true
                        };
                        var legacyOperationRequest = new Commerce.LegacyOperationRequest(Commerce.Operations.RetailOperation.PayCard, request.correlationId);
                        legacyOperationRequest.options = operationOptions;
                        legacyOperationRequest.skipManagerPermissionChecks = request.skipManagerPermissionChecks;
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(legacyOperationRequest))
                            .map(function (result) {
                            var data;
                            if (!result.canceled) {
                                data = result.data.data;
                            }
                            return {
                                canceled: result.canceled,
                                data: result.canceled ? null : new Operations.TokenizedPaymentCardOperationResponse(data)
                            };
                        }).getPromise();
                    };
                    return TokenizedPaymentCardOperationRequestHandler;
                }(Commerce.PosRequestHandlerBase));
                Handlers.TokenizedPaymentCardOperationRequestHandler = TokenizedPaymentCardOperationRequestHandler;
            })(Handlers = Operations.Handlers || (Operations.Handlers = {}));
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var UpdateTenderLineSignatureServiceRequestHandler = (function (_super) {
                __extends(UpdateTenderLineSignatureServiceRequestHandler, _super);
                function UpdateTenderLineSignatureServiceRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UpdateTenderLineSignatureServiceRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.UpdateTenderLineSignatureServiceRequest;
                };
                UpdateTenderLineSignatureServiceRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    var cartManager = this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                    return cartManager.updateTenderLineSignature(request.tenderLineId, request.signatureData)
                        .getPromise()
                        .then(function () {
                        return Promise.resolve({
                            canceled: false,
                            data: new Payments.UpdateTenderLineSignatureServiceResponse(_this.context.applicationSession.userSession.transaction.cart)
                        });
                    });
                };
                return UpdateTenderLineSignatureServiceRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.UpdateTenderLineSignatureServiceRequestHandler = UpdateTenderLineSignatureServiceRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var ValidateAndUpdateTenderLineSignatureClientRequestHandler = (function (_super) {
                __extends(ValidateAndUpdateTenderLineSignatureClientRequestHandler, _super);
                function ValidateAndUpdateTenderLineSignatureClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ValidateAndUpdateTenderLineSignatureClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.ValidateAndUpdateTenderLineSignatureClientRequest;
                };
                ValidateAndUpdateTenderLineSignatureClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the ValidateAndUpdateTenderLineSignatureClientRequestHandler received an invalid request.");
                    }
                    Commerce.RetailLogger.posValidateAndUpdateTenderLineSignatureRequestStarted(request.correlationId);
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        Commerce.RetailLogger.posIsValidatingSignatureFromExternalSource(request.correlationId);
                        var validateSignatureRequest = new Payments.ValidateSignatureClientRequest(request.correlationId, false, request.signatureData, true);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(validateSignatureRequest))
                            .map(function (result) {
                            var didValidationFail = result.canceled ? true : !result.data.result;
                            return {
                                canceled: didValidationFail,
                                data: didValidationFail ? null : new Payments.ValidateSignatureClientResponse(true)
                            };
                        }));
                    }).enqueue(function (response) {
                        var updateTenderLineSignatureRequest = new Payments.UpdateTenderLineSignatureServiceRequest(request.correlationId, request.tenderLineId, request.signatureData);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(updateTenderLineSignatureRequest)));
                    });
                    return asyncQueue.run()
                        .map(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posValidateAndUpdateTenderLineSignatureRequestCancelled(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posValidateAndUpdateTenderLineSignatureRequestSucceeded(request.correlationId);
                        }
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new Payments.ValidateAndUpdateTenderLineSignatureClientResponse(result.data.cart)
                        };
                    }).fail(function (errors) {
                        Commerce.RetailLogger.posValidateAndUpdateTenderLineSignatureRequestFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).getPromise();
                };
                return ValidateAndUpdateTenderLineSignatureClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.ValidateAndUpdateTenderLineSignatureClientRequestHandler = ValidateAndUpdateTenderLineSignatureClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var VoidPaymentClientRequestHandler = (function (_super) {
                __extends(VoidPaymentClientRequestHandler, _super);
                function VoidPaymentClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                VoidPaymentClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.VoidPaymentClientRequest;
                };
                VoidPaymentClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the VoidPaymentClientRequestHandler received an invalid request.");
                    }
                    Commerce.RetailLogger.posVoidPaymentStarted(request.correlationId, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType]);
                    return this._voidPayment(request.correlationId, request.peripheralType, request.paymentErrors, request.paymentAmount, request.authorizationPaymentInfo, request.authorizationTenderLine, request.voidFailureMessageId)
                        .fail(function (errors) {
                        Commerce.RetailLogger.posVoidPaymentFailed(request.correlationId, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType], Commerce.ObjectExtensions.isNullOrUndefined(errors) ? Commerce.StringExtensions.EMPTY : Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).map(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posVoidPaymentCancelled(request.correlationId, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType]);
                        }
                        else {
                            Commerce.RetailLogger.posVoidPaymentSucceeded(request.correlationId, Commerce.Proxy.Entities.PeripheralPaymentType[request.peripheralType]);
                        }
                        return { canceled: result.canceled, data: result.canceled ? null : new Payments.VoidPaymentClientResponse(null) };
                    }).getPromise();
                };
                VoidPaymentClientRequestHandler.prototype._voidPayment = function (correlationId, peripheralType, paymentErrors, paymentAmount, paymentInfo, preProcessedTenderLine, voidFailureMessageId) {
                    var _this = this;
                    var asyncQueue = new Commerce.AsyncQueue();
                    var preventRecoveryOnFailure = false;
                    asyncQueue.enqueue(function () {
                        return asyncQueue.cancelOn(_this._executeVoidPaymentOnPeripheralAsync(correlationId, peripheralType, paymentInfo, preProcessedTenderLine))
                            .map(function (result) {
                            return result.data;
                        });
                    }).enqueue(function (voidPaymentInfo) {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(voidPaymentInfo) && voidPaymentInfo.IsApproved) {
                            return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.ClearPaymentTransactionReferenceDataClientRequest(correlationId, "Void payment successfully completed", paymentInfo.ApprovedAmount.toString())));
                        }
                        else {
                            return Commerce.AsyncResult.createResolved({
                                canceled: true,
                                data: null
                            });
                        }
                    }).enqueue(function (result) {
                        if (result.canceled === false) {
                            if (Payments.Utilities.PaymentErrorHelper.hasError(paymentErrors, Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_INVALIDCARTVERSION.serverErrorCode)) {
                                Commerce.RetailLogger.posVoidPaymentInvalidCardVersion(correlationId);
                                preventRecoveryOnFailure = true;
                                return Commerce.VoidAsyncResult.createRejected(paymentErrors);
                            }
                            else if (Commerce.StringExtensions.isNullOrWhitespace(preProcessedTenderLine.CardTypeId)) {
                                Commerce.RetailLogger.posVoidedTenderLineMissingCardTypeId(correlationId);
                                return Commerce.VoidAsyncResult.createRejected(paymentErrors);
                            }
                            else {
                                Commerce.RetailLogger.posVoidPaymentAddVoidedTenderLineStarted(correlationId);
                                var voidedPreprocessedTenderLine = preProcessedTenderLine;
                                voidedPreprocessedTenderLine.StatusValue = Commerce.Proxy.Entities.TenderLineStatus.Voided;
                                var addVoidedTenderLineToCartRequest = new Commerce.AddPreprocessedTenderLineToCartClientRequest(voidedPreprocessedTenderLine, correlationId);
                                var rejectOnAddVoidedTenderLineAsyncResult_1 = new Commerce.VoidAsyncResult();
                                Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(addVoidedTenderLineToCartRequest))
                                    .done(function (result) {
                                    if (result.canceled) {
                                        Commerce.RetailLogger.posVoidPaymentAddVoidedTenderLineCancelled(correlationId);
                                    }
                                    else {
                                        Commerce.RetailLogger.posVoidPaymentAddVoidedTenderLineSucceeded(correlationId);
                                    }
                                    rejectOnAddVoidedTenderLineAsyncResult_1.reject(paymentErrors);
                                }).fail(function (addVoidedTenderLineErrors) {
                                    Commerce.RetailLogger.posVoidPaymentAddVoidedTenderLineFailed(correlationId, Commerce.Framework.ErrorConverter.serializeError(addVoidedTenderLineErrors));
                                    if (Commerce.ObjectExtensions.isNullOrUndefined(paymentErrors)) {
                                        rejectOnAddVoidedTenderLineAsyncResult_1.reject(addVoidedTenderLineErrors);
                                    }
                                    else {
                                        rejectOnAddVoidedTenderLineAsyncResult_1.reject(paymentErrors.concat(addVoidedTenderLineErrors));
                                    }
                                });
                                preventRecoveryOnFailure = true;
                                return rejectOnAddVoidedTenderLineAsyncResult_1;
                            }
                        }
                        else {
                            return Commerce.VoidAsyncResult.createRejected(null);
                        }
                    });
                    return asyncQueue.run()
                        .recoverOnFailure(function (voidPaymentErrors) {
                        if (preventRecoveryOnFailure) {
                            Commerce.RetailLogger.posVoidPaymentPreventRecoveryOnFailure(correlationId);
                            return Commerce.AsyncResult.createRejected(voidPaymentErrors);
                        }
                        return _this._handleVoidPaymentFailure(correlationId, peripheralType, paymentErrors, voidPaymentErrors, paymentAmount, paymentInfo, preProcessedTenderLine, voidFailureMessageId)
                            .recoverOnFailure(function (errors) {
                            if (paymentInfo.ApprovedAmount !== paymentAmount) {
                                var partialPayRequest = new Payments.ApprovePartialPaymentClientRequest(correlationId, paymentInfo, preProcessedTenderLine, paymentAmount, peripheralType);
                                return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(partialPayRequest));
                            }
                            else {
                                return Commerce.AsyncResult.createRejected(errors);
                            }
                        });
                    });
                };
                VoidPaymentClientRequestHandler.prototype._executeVoidPaymentOnPeripheralAsync = function (correlationId, peripheralType, paymentInfo, preProcessedTenderLine) {
                    var _this = this;
                    var tenderType = this.context.applicationContext.tenderTypesMap.getTenderByTypeId(preProcessedTenderLine.TenderTypeId);
                    var tenderInfo = { TenderId: null, CardTypeId: preProcessedTenderLine.CardTypeId };
                    if (peripheralType === Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                        Commerce.RetailLogger.posVoidPaymentUsingPaymentTerminalVoidStarted(correlationId);
                        var voidInfo_1 = null;
                        var asyncQueue_2 = new Commerce.AsyncQueue();
                        asyncQueue_2.enqueue(function () {
                            var voidPaymentRequest = new Commerce.PaymentTerminalVoidPaymentRequest(tenderType.ConnectorId, tenderInfo, paymentInfo.ApprovedAmount, paymentInfo.PaymentSdkData, null, correlationId);
                            return asyncQueue_2.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(voidPaymentRequest)));
                        }).enqueue(function (result) {
                            voidInfo_1 = result.data.result;
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(voidInfo_1) && voidInfo_1.IsApproved) {
                                var asyncResult_3 = new Commerce.VoidAsyncResult();
                                Payments.Utilities.PaymentHelper.printDeclinedOrVoidedCardPaymentReceiptAsync(correlationId, voidInfo_1.ApprovedAmount, voidInfo_1, tenderType, _this.context.applicationSession, _this.context).always(function () {
                                    asyncResult_3.resolve();
                                });
                                return asyncResult_3;
                            }
                            else {
                                return Commerce.VoidAsyncResult.createResolved();
                            }
                        });
                        return asyncQueue_2.run()
                            .map(function (result) {
                            if (result.canceled) {
                                Commerce.RetailLogger.posVoidPaymentUsingPaymentTerminalVoidCancelled(correlationId);
                            }
                            else {
                                Commerce.RetailLogger.posVoidPaymentUsingPaymentTerminalVoidSucceeded(correlationId);
                            }
                            return { canceled: result.canceled, data: voidInfo_1 };
                        }).fail(function (errors) {
                            Commerce.RetailLogger.posVoidPaymentUsingPaymentTerminalVoidFailed(correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                        });
                    }
                    else {
                        Commerce.RetailLogger.posVoidPaymentUsingCardPaymentVoidStarted(correlationId);
                        var voidPaymentRequest = new Commerce.CardPaymentVoidPaymentRequest(tenderType.ConnectorId, paymentInfo.ApprovedAmount, tenderInfo, paymentInfo.PaymentSdkData, null, correlationId);
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(voidPaymentRequest))
                            .fail(function (errors) {
                            Commerce.RetailLogger.posVoidPaymentUsingCardPaymentVoidFailed(correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                        }).map(function (result) {
                            if (result.canceled) {
                                Commerce.RetailLogger.posVoidPaymentUsingCardPaymentVoidCancelled(correlationId);
                            }
                            else {
                                Commerce.RetailLogger.posVoidPaymentUsingCardPaymentVoidSucceeded(correlationId);
                            }
                            return { canceled: result.canceled, data: result.canceled ? null : result.data.result };
                        });
                    }
                };
                VoidPaymentClientRequestHandler.prototype._handleVoidPaymentFailure = function (correlationId, peripheralType, originalPaymentErrors, voidPaymentErrors, paymentAmount, paymentInfo, preProcessedTenderLine, voidFailureMessageId) {
                    var _this = this;
                    Commerce.RetailLogger.posVoidPaymentRecoverOnFailure(correlationId, voidFailureMessageId, Commerce.Framework.ErrorConverter.serializeError(voidPaymentErrors));
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.ShowPresetButtonMessageDialogClientRequest(correlationId, {
                            title: "string_4909",
                            message: voidFailureMessageId,
                            buttonCombination: Commerce.MessageBoxButtons.RetryNo
                        })))
                            .map(function (result) {
                            return result.data.result;
                        });
                    }).enqueue(function (result) {
                        if (result.dialogResult === Commerce.Client.Entities.Dialogs.PresetResultValues.RETRY) {
                            Commerce.RetailLogger.posVoidPaymentRetrying(correlationId, Commerce.Proxy.Entities.PeripheralPaymentType[peripheralType]);
                            return asyncQueue.cancelOn(_this._voidPayment(correlationId, peripheralType, originalPaymentErrors, paymentAmount, paymentInfo, preProcessedTenderLine, voidFailureMessageId));
                        }
                        else if (paymentInfo.ApprovedAmount !== paymentAmount) {
                            return Commerce.AsyncResult.createRejected(voidPaymentErrors);
                        }
                        else {
                            return _this._executeUpdateLinesOnPeripheralAsync(correlationId, peripheralType, voidPaymentErrors);
                        }
                    });
                    return asyncQueue.run();
                };
                VoidPaymentClientRequestHandler.prototype._executeUpdateLinesOnPeripheralAsync = function (correlationId, peripheralType, voidPaymentErrors) {
                    if (peripheralType === Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                        var updateLinesRequest = new Commerce.PaymentTerminalUpdateLinesRequest(this.context.applicationSession.userSession.transaction.cart, correlationId);
                        var rejectOnUpdateLinesAsyncResult_1 = new Commerce.AsyncResult();
                        Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(updateLinesRequest))
                            .always(function () {
                            rejectOnUpdateLinesAsyncResult_1.reject(voidPaymentErrors);
                        });
                        return rejectOnUpdateLinesAsyncResult_1;
                    }
                    else {
                        return Commerce.AsyncResult.createRejected(voidPaymentErrors);
                    }
                };
                return VoidPaymentClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.VoidPaymentClientRequestHandler = VoidPaymentClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            var Handlers;
            (function (Handlers) {
                "use strict";
                var VoidPaymentOperationRequestHandler = (function (_super) {
                    __extends(VoidPaymentOperationRequestHandler, _super);
                    function VoidPaymentOperationRequestHandler() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    VoidPaymentOperationRequestHandler.prototype.supportedRequestType = function () {
                        return Operations.VoidPaymentOperationRequest;
                    };
                    VoidPaymentOperationRequestHandler.prototype.executeAsync = function (request) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                            throw new Error("The executeAsync method for the VoidPaymentOperationRequestHandler received a null or undefined request.");
                        }
                        var operationOptions = {
                            correlationId: request.correlationId,
                            tenderLines: request.tenderLines,
                            autoForceVoid: request.autoForceVoid
                        };
                        var legacyOperationRequest = new Commerce.LegacyOperationRequest(Commerce.Operations.RetailOperation.VoidPayment, request.correlationId);
                        legacyOperationRequest.options = operationOptions;
                        legacyOperationRequest.skipManagerPermissionChecks = request.skipManagerPermissionChecks;
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(legacyOperationRequest))
                            .map(function (result) {
                            return {
                                canceled: result.canceled,
                                data: result.canceled ? null : new Operations.VoidPaymentOperationResponse()
                            };
                        }).getPromise();
                    };
                    return VoidPaymentOperationRequestHandler;
                }(Commerce.PosRequestHandlerBase));
                Handlers.VoidPaymentOperationRequestHandler = VoidPaymentOperationRequestHandler;
            })(Handlers = Operations.Handlers || (Operations.Handlers = {}));
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            "use strict";
            var PaymentTermAddBalanceToGiftCardPeripheralRequest = Commerce.Peripherals.PaymentTerminalAddBalanceToGiftCardPeripheralRequest;
            var AddBalanceToGiftCardClientRequestHandler = (function (_super) {
                __extends(AddBalanceToGiftCardClientRequestHandler, _super);
                function AddBalanceToGiftCardClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AddBalanceToGiftCardClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.AddBalanceToGiftCardClientRequest;
                };
                AddBalanceToGiftCardClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    var cartManager = this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request.tenderType) || Commerce.StringExtensions.isNullOrWhitespace(request.tenderType.ConnectorId)) {
                        return cartManager.refillGiftCardAsync(request.giftCardId, request.amount, request.currency, request.lineDescription, request.tenderType.TenderTypeId)
                            .map(function (result) {
                            return {
                                canceled: false,
                                data: new Payments.AddBalanceToGiftCardClientResponse(result)
                            };
                        }).getPromise();
                    }
                    else {
                        var paymentInfo_1;
                        var giftCardTypeId = Commerce.Proxy.Entities.CardType.GiftCard;
                        var tenderInfo_1 = {
                            TenderId: null,
                            CardNumber: request.giftCardId,
                            CardTypeId: giftCardTypeId.toString()
                        };
                        var isApproved_1 = false;
                        var asyncQueue_3 = new Commerce.AsyncQueue();
                        var balance_1 = 0.0;
                        asyncQueue_3.enqueue(function () {
                            var paymentTerminal = _this.context.peripherals.paymentTerminal;
                            var cardPayment = _this.context.peripherals.cardPayment;
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(paymentTerminal) && paymentTerminal.isActive) {
                                var addbalanceGiftCardRequest = new PaymentTermAddBalanceToGiftCardPeripheralRequest(request.correlationId, request.amount, tenderInfo_1, request.tenderType.ConnectorId, null);
                                return asyncQueue_3.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(addbalanceGiftCardRequest)))
                                    .map(function (result) {
                                    paymentInfo_1 = result.data.paymentInfo;
                                    isApproved_1 = result.data.paymentInfo.IsApproved;
                                    balance_1 = result.data.paymentInfo.AvailableBalanceAmount;
                                    return result.data.paymentInfo;
                                });
                            }
                            else if (!Commerce.ObjectExtensions.isNullOrUndefined(cardPayment)) {
                                return cardPayment.addBalanceToGiftCard(request.correlationId, request.amount, tenderInfo_1, request.tenderType.ConnectorId, null)
                                    .done(function (result) {
                                    paymentInfo_1 = result;
                                    isApproved_1 = result.IsApproved;
                                    balance_1 = result.AvailableBalanceAmount;
                                });
                            }
                            else {
                                var errors = [];
                                errors.push(new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_TERMINAL_NOT_CONFIGURED));
                                return Commerce.VoidAsyncResult.createRejected(errors);
                            }
                        }).enqueue(function () {
                            if (isApproved_1) {
                                var thirdPartyGiftCardInfo = new Commerce.Proxy.Entities.ThirdPartyGiftCardInfoClass();
                                thirdPartyGiftCardInfo.Authorization = paymentInfo_1.PaymentSdkData;
                                thirdPartyGiftCardInfo.Amount = request.amount;
                                var cartLine = {
                                    Price: request.amount,
                                    ItemId: request.tenderType.GiftCardItem,
                                    IsGiftCardLine: true,
                                    GiftCardId: paymentInfo_1.CardNumberMasked,
                                    GiftCardBalance: balance_1,
                                    GiftCardOperationValue: Commerce.Proxy.Entities.GiftCardOperationType.AddTo,
                                    GiftCardTypeValue: Commerce.Proxy.Entities.RetailGiftCardType.ExternalGiftCard,
                                    Comment: request.tenderType.GiftCardItem,
                                    Quantity: 1.0,
                                    ThirdPartyGiftCardInfo: thirdPartyGiftCardInfo
                                };
                                return cartManager.addCartLinesToCartAsync([cartLine]);
                            }
                            else {
                                var errors = new Array();
                                errors.push(new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.GIFT_CARD_NOT_APPROVED));
                                return Commerce.VoidAsyncResult.createRejected(errors);
                            }
                        });
                        return asyncQueue_3.run().map(function (result) {
                            return {
                                canceled: result.canceled,
                                data: result.canceled ? null : new Payments.AddBalanceToGiftCardClientResponse(_this.context.applicationSession.userSession.transaction.cart)
                            };
                        }).getPromise();
                    }
                };
                return AddBalanceToGiftCardClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.AddBalanceToGiftCardClientRequestHandler = AddBalanceToGiftCardClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            var Handlers;
            (function (Handlers) {
                "use strict";
                var AddToGiftCardOperationRequestHandler = (function (_super) {
                    __extends(AddToGiftCardOperationRequestHandler, _super);
                    function AddToGiftCardOperationRequestHandler() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    AddToGiftCardOperationRequestHandler.prototype.supportedRequestType = function () {
                        return Commerce.AddToGiftCardOperationRequest;
                    };
                    AddToGiftCardOperationRequestHandler.prototype.executeAsync = function (request) {
                        var inputRequest = new Payments.AddToGiftCardInputClientRequest(request.correlationId, request.tenderTypeId);
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(inputRequest))
                            .map(function (result) {
                            return {
                                canceled: result.canceled,
                                data: result.canceled ? null : new Commerce.AddToGiftCardOperationResponse()
                            };
                        }).getPromise();
                    };
                    return AddToGiftCardOperationRequestHandler;
                }(Commerce.PosRequestHandlerBase));
                Handlers.AddToGiftCardOperationRequestHandler = AddToGiftCardOperationRequestHandler;
            })(Handlers = Operations.Handlers || (Operations.Handlers = {}));
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            "use strict";
            var CashOutGiftCardClientRequestHandler = (function (_super) {
                __extends(CashOutGiftCardClientRequestHandler, _super);
                function CashOutGiftCardClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CashOutGiftCardClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.CashOutGiftCardClientRequest;
                };
                CashOutGiftCardClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the CashOutGiftCardOperationRequestHandler received a null or undefined request.");
                    }
                    var isInternalGiftCard = Commerce.StringExtensions.isNullOrWhitespace(request.tenderType.ConnectorId);
                    if (isInternalGiftCard) {
                        return this._cashOutInternalGiftCardAsync(request.giftCardId, request.amount, request.currency, request.lineDescription, request.tenderType);
                    }
                    else {
                        return this._cashOutThirdPartyGiftCardAsync(request.correlationId, request.giftCardId, request.amount, request.currency, request.lineDescription, request.tenderType, request.extensionTransactionProperties);
                    }
                };
                CashOutGiftCardClientRequestHandler.prototype._cashOutInternalGiftCardAsync = function (giftCardId, amount, currency, lineDescription, tenderType) {
                    var cartManager = this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                    return cartManager.cashOutGiftCardAsync(giftCardId, amount, currency, lineDescription, tenderType.TenderTypeId)
                        .map(function (result) {
                        return { canceled: false, data: new Payments.CashOutGiftCardClientResponse(result) };
                    }).getPromise();
                };
                CashOutGiftCardClientRequestHandler.prototype._cashOutThirdPartyGiftCardAsync = function (correlationId, giftCardId, amount, currency, lineDescription, tenderType, extensionTransactionProperties) {
                    var _this = this;
                    var paymentTerminal = this.context.peripherals.paymentTerminal;
                    var giftCardTypeId = Commerce.Proxy.Entities.CardType.GiftCard;
                    var tenderInfo = {
                        TenderId: tenderType.TenderTypeId,
                        CardNumber: giftCardId,
                        CardTypeId: giftCardTypeId.toString()
                    };
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        if (!Commerce.ObjectExtensions.isNullOrUndefined(paymentTerminal)) {
                            return paymentTerminal.cashOutGiftCard(amount, tenderType.ConnectorId, tenderInfo, extensionTransactionProperties, correlationId);
                        }
                        else {
                            return Commerce.AsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_TERMINAL_NOT_CONFIGURED)]);
                        }
                    }).enqueue(function (result) {
                        if (result.IsApproved) {
                            var thirdPartyGiftCardInfo = new Commerce.Proxy.Entities.ThirdPartyGiftCardInfoClass();
                            thirdPartyGiftCardInfo.Authorization = result.PaymentSdkData;
                            thirdPartyGiftCardInfo.Amount = amount;
                            var cartLine = {
                                Price: -1 * amount,
                                ItemId: tenderType.GiftCardItem,
                                IsGiftCardLine: true,
                                GiftCardId: giftCardId,
                                GiftCardBalance: 0,
                                GiftCardOperationValue: Commerce.Proxy.Entities.GiftCardOperationType.CashOut,
                                GiftCardTypeValue: Commerce.Proxy.Entities.RetailGiftCardType.ExternalGiftCard,
                                Comment: tenderType.GiftCardItem,
                                Quantity: 1.0,
                                ThirdPartyGiftCardInfo: thirdPartyGiftCardInfo
                            };
                            var cartManager = _this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                            return cartManager.addCartLinesToCartAsync([cartLine]);
                        }
                        else {
                            var errors = new Array();
                            errors.push(new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.GIFT_CARD_NOT_APPROVED));
                            return Commerce.VoidAsyncResult.createRejected(errors);
                        }
                    });
                    return asyncQueue.run()
                        .map(function (result) {
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new Payments.CashOutGiftCardClientResponse(_this.context.applicationSession.userSession.transaction.cart)
                        };
                    }).getPromise();
                };
                return CashOutGiftCardClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.CashOutGiftCardClientRequestHandler = CashOutGiftCardClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            var Handlers;
            (function (Handlers) {
                "use strict";
                var CashOutGiftCardOperationRequestHandler = (function (_super) {
                    __extends(CashOutGiftCardOperationRequestHandler, _super);
                    function CashOutGiftCardOperationRequestHandler() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    CashOutGiftCardOperationRequestHandler.prototype.supportedRequestType = function () {
                        return Operations.CashOutGiftCardOperationRequest;
                    };
                    CashOutGiftCardOperationRequestHandler.prototype.executeAsync = function (request) {
                        if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                            throw new Error("The executeAsync method for the CashOutGiftCardOperationRequestHandler received a null or undefined request.");
                        }
                        var operationOptions = {
                            correlationId: request.correlationId,
                            tenderType: request.tenderType
                        };
                        var legacyOperationRequest = new Commerce.LegacyOperationRequest(Commerce.Operations.RetailOperation.CashOutGiftCard, request.correlationId);
                        legacyOperationRequest.options = operationOptions;
                        legacyOperationRequest.skipManagerPermissionChecks = request.skipManagerPermissionChecks;
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(legacyOperationRequest))
                            .map(function (result) {
                            return {
                                canceled: result.canceled,
                                data: result.canceled ? null : new Operations.CashOutGiftCardOperationResponse()
                            };
                        }).getPromise();
                    };
                    return CashOutGiftCardOperationRequestHandler;
                }(Commerce.PosRequestHandlerBase));
                Handlers.CashOutGiftCardOperationRequestHandler = CashOutGiftCardOperationRequestHandler;
            })(Handlers = Operations.Handlers || (Operations.Handlers = {}));
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            var Handlers;
            (function (Handlers) {
                "use strict";
                var CheckGiftCardBalanceOperationRequestHandler = (function (_super) {
                    __extends(CheckGiftCardBalanceOperationRequestHandler, _super);
                    function CheckGiftCardBalanceOperationRequestHandler() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    CheckGiftCardBalanceOperationRequestHandler.prototype.supportedRequestType = function () {
                        return Commerce.CheckGiftCardBalanceOperationRequest;
                    };
                    CheckGiftCardBalanceOperationRequestHandler.prototype.executeAsync = function (request) {
                        var _this = this;
                        var asyncQueue = new Commerce.AsyncQueue();
                        var nonSalesTransaction = { Id: Commerce.StringExtensions.EMPTY };
                        var giftCard;
                        var correlationId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                        asyncQueue.enqueue(function () {
                            return _this._getGiftCardById(request.tenderTypeId, correlationId);
                        }).enqueue(function (result) {
                            giftCard = result.data;
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(giftCard)) {
                                nonSalesTransaction.ForeignCurrency = giftCard.CardCurrencyCode;
                                nonSalesTransaction.TransactionTypeValue = Commerce.Proxy.Entities.TransactionType.GiftCardInquiry;
                                nonSalesTransaction.Description = Commerce.StringExtensions.EMPTY;
                                nonSalesTransaction.ShiftId = _this.context.applicationSession.userSession.shift.ShiftId.toString();
                                nonSalesTransaction.ShiftTerminalId = _this.context.applicationSession.userSession.shift.TerminalId;
                                nonSalesTransaction.GiftCardBalance = giftCard.Balance;
                                nonSalesTransaction.GiftCardIssueAmount = giftCard.GiftCardIssueAmount;
                                nonSalesTransaction.GiftCardActiveFrom = giftCard.GiftCardActiveFrom;
                                nonSalesTransaction.GiftCardExpireDate = giftCard.GiftCardExpireDate;
                                nonSalesTransaction.GiftCardHistoryDetails = giftCard.GiftCardHistoryDetails;
                                nonSalesTransaction.GiftCardIdMasked = giftCard.Id;
                                var request_1 = new Commerce.CreateNonSalesTransactionServiceRequest(correlationId, nonSalesTransaction);
                                return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(request_1)));
                            }
                            return Commerce.AsyncResult.createResolved();
                        }).enqueue(function () {
                            if (!Commerce.StringExtensions.isNullOrWhitespace(nonSalesTransaction.Id)) {
                                return _this._printGiftCardInquiryReceiptAsync(nonSalesTransaction.Id, correlationId);
                            }
                            return Commerce.AsyncResult.createResolved();
                        });
                        return asyncQueue.run().map(function (result) {
                            return {
                                canceled: result.canceled,
                                data: new Commerce.CheckGiftCardBalanceOperationResponse()
                            };
                        }).getPromise();
                    };
                    CheckGiftCardBalanceOperationRequestHandler.prototype._getGiftCardById = function (tenderTypeId, correlationId) {
                        var activityRequest = new Payments.CheckGiftCardBalanceInputClientRequest(correlationId, tenderTypeId);
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(activityRequest))
                            .map(function (result) {
                            return {
                                canceled: result.canceled,
                                data: result.canceled ? null : result.data.giftCard
                            };
                        });
                    };
                    CheckGiftCardBalanceOperationRequestHandler.prototype._printGiftCardInquiryReceiptAsync = function (nonSalesTransactionId, correlationId) {
                        var _this = this;
                        var printReceiptsAsyncQueue = new Commerce.AsyncQueue();
                        printReceiptsAsyncQueue.enqueue(function () {
                            var salesOrderManager = _this.context.managerFactory.getManager(Commerce.Model.Managers.ISalesOrderManagerName);
                            return salesOrderManager.getReceiptsForPrintAsync(nonSalesTransactionId, false, Commerce.Proxy.Entities.ReceiptType.GiftCardInquiry, false, _this.context.applicationSession.userSession.shift.ShiftId, _this.context.applicationSession.userSession.shift.TerminalId, false, null, _this.context.applicationSession.hardwareProfile.ProfileId);
                        }).enqueue(function (receipts) {
                            var receiptClientRequest = new Commerce.PrintReceiptInputClientRequest(correlationId, receipts);
                            return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(receiptClientRequest)).fail(function (errors) {
                                Commerce.RetailLogger.printGiftCardInquiryReceiptFailed(correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                            });
                        });
                        return printReceiptsAsyncQueue.run().recoverOnFailure(function (errors) {
                            var request = new Commerce.Framework.ShowErrorMessageClientRequest(correlationId, errors);
                            _this.context.runtime.executeAsync(request);
                            return Commerce.AsyncResult.createResolved();
                        });
                    };
                    return CheckGiftCardBalanceOperationRequestHandler;
                }(Commerce.PosRequestHandlerBase));
                Handlers.CheckGiftCardBalanceOperationRequestHandler = CheckGiftCardBalanceOperationRequestHandler;
            })(Handlers = Operations.Handlers || (Operations.Handlers = {}));
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetGiftCardByIdServiceRequestHandler = (function (_super) {
                __extends(GetGiftCardByIdServiceRequestHandler, _super);
                function GetGiftCardByIdServiceRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetGiftCardByIdServiceRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetGiftCardByIdServiceRequest;
                };
                GetGiftCardByIdServiceRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.StringExtensions.isNullOrWhitespace(request.giftCardId)) {
                        var errors = [new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_GIFT_CARD_NUMBER_EMPTY)];
                        return Commerce.VoidAsyncResult.createRejected(errors).getPromise();
                    }
                    var paymentManager = this.context.managerFactory.getManager(Commerce.Model.Managers.IPaymentManagerName);
                    return paymentManager.getGiftCardById(request.giftCardId, null, null, null, null)
                        .map(function (giftCard) {
                        return {
                            canceled: false,
                            data: new Payments.GetGiftCardByIdServiceResponse(giftCard)
                        };
                    }).getPromise();
                };
                return GetGiftCardByIdServiceRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetGiftCardByIdServiceRequestHandler = GetGiftCardByIdServiceRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetGiftCardClientRequestHandler = (function (_super) {
                __extends(GetGiftCardClientRequestHandler, _super);
                function GetGiftCardClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetGiftCardClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetGiftCardClientRequest;
                };
                GetGiftCardClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("Invalid parameters passed to GetGiftCardClientRequestHandler execute: request cannot be null or undefined.");
                    }
                    Commerce.RetailLogger.posGetGiftCardRequestStarted(request.correlationId);
                    var asyncResult = new Commerce.AsyncResult();
                    if (request.isManualEntryAllowed) {
                        asyncResult = this._getGiftCardNumberForManualEntry(request.correlationId, request.defaultGiftCardId, request.isManualEntryAllowed);
                    }
                    else if (request.isExternalGiftCard) {
                        asyncResult = this._getGiftCardNumberFromPaymentTerminal(request.correlationId);
                    }
                    else {
                        asyncResult = Commerce.AsyncResult.createResolved({ canceled: true, data: null });
                    }
                    return asyncResult.map(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posGetGiftCardRequestCancelled(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posGetGiftCardRequestSucceeded(request.correlationId);
                        }
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : new Payments.GetGiftCardClientResponse(result.data)
                        };
                    }).recoverOnFailure(function (errors) {
                        Commerce.RetailLogger.posGetGiftCardRequestFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                        return Commerce.AsyncResult.createResolved({ canceled: true, data: null });
                    }).getPromise();
                };
                GetGiftCardClientRequestHandler.prototype._getGiftCardNumberForManualEntry = function (correlationId, defaultGiftCardId, isManualEntryAllowed) {
                    var getGiftCardInputClientRequest = new Payments.GetGiftCardInputClientRequest(correlationId, defaultGiftCardId, null, isManualEntryAllowed);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(getGiftCardInputClientRequest))
                        .map(function (result) {
                        return {
                            canceled: result.canceled,
                            data: result.canceled ? null : { giftCardId: result.data.giftCardId, giftCardEntryType: result.data.giftCardEntryType }
                        };
                    });
                };
                GetGiftCardClientRequestHandler.prototype._getGiftCardNumberFromPaymentTerminal = function (correlationId) {
                    var _this = this;
                    var asyncQueue = new Commerce.AsyncQueue;
                    return asyncQueue.enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.IsPaymentTerminalAvailableClientRequest(correlationId)))
                            .map(function (result) {
                            return result.data.result.isAvailable;
                        });
                    }).enqueue(function (isPaymentTerminalAvailable) {
                        if (!isPaymentTerminalAvailable) {
                            Commerce.RetailLogger.posGetGiftCardRequestPaymentTerminalNotConfigured(correlationId);
                            return Commerce.AsyncResult.createResolved({ canceled: true, data: null });
                        }
                        return _this.context.peripherals.paymentTerminal.retrievePrivateTender(correlationId, 0.0, true, null)
                            .map(function (cardInfo) {
                            var isCardInfoValid = !Commerce.ObjectExtensions.isNullOrUndefined(cardInfo)
                                && !Commerce.StringExtensions.isNullOrWhitespace(cardInfo.CardNumber);
                            var paymentTerminalResult = {
                                giftCardId: isCardInfoValid ? cardInfo.CardNumber : Commerce.StringExtensions.EMPTY,
                                giftCardEntryType: isCardInfoValid ? Commerce.Client.Entities.GiftCardEntryType.PaymentTerminal : null
                            };
                            return { canceled: !isCardInfoValid, data: !isCardInfoValid ? null : paymentTerminalResult };
                        }).recoverOnFailure(function (errors) {
                            Commerce.RetailLogger.posGetGiftCardRequestRetrievePrivateTenderFailed(correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                            return Commerce.AsyncResult.createResolved({ canceled: true, data: null });
                        });
                    }).run().map(function (result) {
                        return result.data;
                    });
                };
                return GetGiftCardClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetGiftCardClientRequestHandler = GetGiftCardClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            "use strict";
            var PaymentTerminalActivateGiftCardPeripheralRequest = Commerce.Peripherals.PaymentTerminalActivateGiftCardPeripheralRequest;
            var IssueGiftCardClientRequestHandler = (function (_super) {
                __extends(IssueGiftCardClientRequestHandler, _super);
                function IssueGiftCardClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                IssueGiftCardClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.IssueGiftCardClientRequest;
                };
                IssueGiftCardClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    var cartManager = this.context.managerFactory.getManager(Commerce.Model.Managers.ICartManagerName);
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request.tenderType) || Commerce.StringExtensions.isNullOrWhitespace(request.tenderType.ConnectorId)) {
                        return cartManager.issueGiftCardToCartAsync(request.giftCardId, request.amount, request.currency, request.lineDescription, request.tenderType.TenderTypeId)
                            .map(function (result) {
                            return {
                                canceled: false,
                                data: new Payments.IssueGiftCardClientResponse(result)
                            };
                        }).getPromise();
                    }
                    else {
                        var asyncQueue_4 = new Commerce.AsyncQueue();
                        var giftCardTypeId = Commerce.Proxy.Entities.CardType.GiftCard;
                        var tenderInfo_2 = {
                            TenderId: null,
                            CardNumber: request.giftCardId,
                            CardTypeId: giftCardTypeId.toString()
                        };
                        var isApproved_2 = false;
                        var paymentInfo_2;
                        var scanResult_1 = null;
                        asyncQueue_4.enqueue(function () {
                            var paymentTerminal = _this.context.peripherals.paymentTerminal;
                            var cardPayment = _this.context.peripherals.cardPayment;
                            if (!Commerce.ObjectExtensions.isNullOrUndefined(paymentTerminal) && paymentTerminal.isActive) {
                                var activateGiftCardRequest = new PaymentTerminalActivateGiftCardPeripheralRequest(request.correlationId, request.amount, tenderInfo_2, request.tenderType.ConnectorId, null);
                                return asyncQueue_4.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(activateGiftCardRequest)))
                                    .map(function (result) {
                                    paymentInfo_2 = result.data.paymentInfo;
                                    isApproved_2 = result.data.paymentInfo.IsApproved;
                                    return result.data.paymentInfo;
                                });
                            }
                            else if (!Commerce.ObjectExtensions.isNullOrUndefined(cardPayment)) {
                                return cardPayment.activateGiftCard(request.correlationId, request.amount, tenderInfo_2, request.tenderType.ConnectorId, null)
                                    .done(function (result) {
                                    paymentInfo_2 = result;
                                    isApproved_2 = result.IsApproved;
                                });
                            }
                            else {
                                var errors = [];
                                errors.push(new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_TERMINAL_NOT_CONFIGURED));
                                return Commerce.VoidAsyncResult.createRejected(errors);
                            }
                        });
                        if (!Commerce.StringExtensions.isNullOrWhitespace(request.tenderType.GiftCardItem)) {
                            asyncQueue_4.enqueue(function () {
                                var scanResultRequest = new Commerce.GetScanResultClientRequest(request.tenderType.GiftCardItem, request.correlationId);
                                return asyncQueue_4.cancelOn(Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(scanResultRequest))).done(function (result) {
                                    if (!result.canceled && !Commerce.ObjectExtensions.isNullOrUndefined(result.data)) {
                                        scanResult_1 = result.data.result;
                                    }
                                });
                            });
                        }
                        asyncQueue_4.enqueue(function () {
                            if (isApproved_2) {
                                var thirdPartyGiftCardInfo = new Commerce.Proxy.Entities.ThirdPartyGiftCardInfoClass();
                                thirdPartyGiftCardInfo.Authorization = paymentInfo_2.PaymentSdkData;
                                thirdPartyGiftCardInfo.Amount = request.amount;
                                var description = _this.context.stringResourceManager.getString("string_5152");
                                if (!Commerce.ObjectExtensions.isNullOrUndefined(scanResult_1)
                                    && !Commerce.ObjectExtensions.isNullOrUndefined(scanResult_1.Product)
                                    && !Commerce.StringExtensions.isNullOrWhitespace(scanResult_1.Product.Description)) {
                                    description = scanResult_1.Product.Description;
                                }
                                else if (!Commerce.StringExtensions.isNullOrWhitespace(request.tenderType.Name)) {
                                    description = request.tenderType.Name;
                                }
                                var cartLine = {
                                    Price: request.amount,
                                    ItemId: request.tenderType.GiftCardItem,
                                    IsGiftCardLine: true,
                                    GiftCardId: paymentInfo_2.CardNumberMasked,
                                    GiftCardBalance: request.amount,
                                    GiftCardOperationValue: Commerce.Proxy.Entities.GiftCardOperationType.Issue,
                                    GiftCardTypeValue: Commerce.Proxy.Entities.RetailGiftCardType.ExternalGiftCard,
                                    Description: description,
                                    Comment: request.tenderType.GiftCardItem,
                                    Quantity: 1.0,
                                    ThirdPartyGiftCardInfo: thirdPartyGiftCardInfo
                                };
                                return cartManager.addCartLinesToCartAsync([cartLine]);
                            }
                            else {
                                var errors = new Array();
                                errors.push(new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.GIFT_CARD_NOT_APPROVED));
                                return Commerce.VoidAsyncResult.createRejected(errors);
                            }
                        }).enqueue(function () {
                            _this._updateThirdPartyGiftCardInfoInCartLines(paymentInfo_2, request.giftCardId);
                            return Commerce.VoidAsyncResult.createResolved();
                        });
                        return asyncQueue_4.run().map(function (result) {
                            return {
                                canceled: result.canceled,
                                data: result.canceled ? null : new Payments.IssueGiftCardClientResponse(_this.context.applicationSession.userSession.transaction.cart)
                            };
                        }).getPromise();
                    }
                };
                IssueGiftCardClientRequestHandler.prototype._updateThirdPartyGiftCardInfoInCartLines = function (paymentInfo, giftCardId) {
                    this.context.applicationSession.userSession.transaction.cart.CartLines.forEach(function (cartLine, index, cartLines) {
                        if (cartLine.IsGiftCardLine && Commerce.StringExtensions.compare(cartLine.GiftCardId, giftCardId, true) === 0) {
                            var thirdPartyGiftCardInfo = new Commerce.Proxy.Entities.ThirdPartyGiftCardInfoClass();
                            thirdPartyGiftCardInfo.Amount = paymentInfo.ApprovedAmount;
                            thirdPartyGiftCardInfo.Authorization = paymentInfo.PaymentSdkData;
                            cartLine.ThirdPartyGiftCardInfo = thirdPartyGiftCardInfo;
                            cartLines[index] = cartLine;
                        }
                    });
                };
                return IssueGiftCardClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.IssueGiftCardClientRequestHandler = IssueGiftCardClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            var Handlers;
            (function (Handlers) {
                "use strict";
                var IssueGiftCardOperationRequestHandler = (function (_super) {
                    __extends(IssueGiftCardOperationRequestHandler, _super);
                    function IssueGiftCardOperationRequestHandler() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    IssueGiftCardOperationRequestHandler.prototype.supportedRequestType = function () {
                        return Commerce.IssueGiftCardOperationRequest;
                    };
                    IssueGiftCardOperationRequestHandler.prototype.executeAsync = function (request) {
                        var activityRequest = new Payments.IssueGiftCardInputClientRequest(request.correlationId, request.tenderTypeId);
                        return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(activityRequest))
                            .map(function (result) {
                            return {
                                canceled: result.canceled,
                                data: result.canceled ? null : new Commerce.IssueGiftCardOperationResponse()
                            };
                        }).getPromise();
                    };
                    return IssueGiftCardOperationRequestHandler;
                }(Commerce.PosRequestHandlerBase));
                Handlers.IssueGiftCardOperationRequestHandler = IssueGiftCardOperationRequestHandler;
            })(Handlers = Operations.Handlers || (Operations.Handlers = {}));
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetSignatureClientRequestHandler = (function (_super) {
                __extends(GetSignatureClientRequestHandler, _super);
                function GetSignatureClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetSignatureClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetSignatureClientRequest;
                };
                GetSignatureClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the GetSignatureClientRequestHandler received a null or undefined request.");
                    }
                    Commerce.RetailLogger.posGetSignatureRequestStarted(request.correlationId);
                    var asyncQueue = new Commerce.AsyncQueue;
                    return asyncQueue.enqueue(function () {
                        return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(new Commerce.Peripherals.HardwareStation.IsHardwareStationActiveClientRequest(request.correlationId)))
                            .map(function (result) {
                            return result.data.result.isActive;
                        });
                    }).enqueue(function (isHardwareStationActive) {
                        var asyncResult = new Commerce.AsyncResult();
                        if (isHardwareStationActive &&
                            !Commerce.ObjectExtensions.isNullOrUndefined(_this.context.peripherals) &&
                            !Commerce.ObjectExtensions.isNullOrUndefined(_this.context.peripherals.signatureCapture) &&
                            _this.context.applicationSession.hardwareProfile.SignatureCaptureDeviceTypeValue !== Commerce.Proxy.Entities.PeripheralDeviceType.None) {
                            Commerce.RetailLogger.posGetSignatureRequestIsRetrievingFromDevice(request.correlationId);
                            asyncResult = _this._getSignatureFromDevice(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posGetSignatureRequestIsRetrievingFromPOS(request.correlationId);
                            asyncResult = _this._getSignatureFromPOS(request.correlationId);
                        }
                        return asyncResult.done(function (result) {
                            if (result.canceled) {
                                Commerce.RetailLogger.posGetSignatureRequestCancelled(request.correlationId);
                            }
                            else {
                                Commerce.RetailLogger.posGetSignatureRequestSucceeded(request.correlationId);
                            }
                        }).fail(function (errors) {
                            Commerce.RetailLogger.posGetSignatureRequestFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                        });
                    }).run().map(function (result) {
                        return result.data;
                    }).getPromise();
                };
                GetSignatureClientRequestHandler.prototype._getSignatureFromPOS = function (correlationId) {
                    var getSignatureFromPOSRequest = new Payments.GetSignatureFromPOSClientRequest(correlationId);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(getSignatureFromPOSRequest))
                        .map(function (result) {
                        return { canceled: result.canceled, data: result.canceled ? null : new Payments.GetSignatureClientResponse(result.data.result) };
                    });
                };
                GetSignatureClientRequestHandler.prototype._getSignatureFromDevice = function (correlationId) {
                    var getSignatureFromDeviceRequest = new Payments.GetSignatureFromDeviceClientRequest(correlationId);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(getSignatureFromDeviceRequest))
                        .map(function (result) {
                        return { canceled: result.canceled, data: result.canceled ? null : new Payments.GetSignatureClientResponse(result.data.result) };
                    });
                };
                return GetSignatureClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetSignatureClientRequestHandler = GetSignatureClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetSignatureFromDeviceClientRequestHandler = (function (_super) {
                __extends(GetSignatureFromDeviceClientRequestHandler, _super);
                function GetSignatureFromDeviceClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetSignatureFromDeviceClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetSignatureFromDeviceClientRequest;
                };
                GetSignatureFromDeviceClientRequestHandler.prototype.executeAsync = function (request) {
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the GetSignatureFromDeviceClientRequestHandler received a null or undefined request.");
                    }
                    Commerce.RetailLogger.posGetSignatureFromDeviceRequestStarted(request.correlationId);
                    return this._getSignatureFromDevice(request.correlationId)
                        .done(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posGetSignatureFromDeviceRequestCancelled(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posGetSignatureFromDeviceRequestSucceeded(request.correlationId);
                        }
                    }).fail(function (errors) {
                        Commerce.RetailLogger.posGetSignatureFromDeviceRequestFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).getPromise();
                };
                GetSignatureFromDeviceClientRequestHandler.prototype._getSignatureFromDevice = function (correlationId) {
                    var _this = this;
                    var getSignatureFromDeviceQueue = new Commerce.AsyncQueue();
                    getSignatureFromDeviceQueue.enqueue(function () {
                        return _this._callGetSignatureFromDeviceActivity(correlationId)
                            .recoverOnFailure(function (errors) {
                            return _this._callGetSignatureFromDeviceActivity(correlationId);
                        });
                    }).enqueue(function (response) {
                        if (response.canceled) {
                            return Commerce.AsyncResult.createResolved({ canceled: false, data: Commerce.StringExtensions.EMPTY });
                        }
                        else {
                            var validateSignatureRequest = new Payments.ValidateSignatureClientRequest(correlationId, true, response.data);
                            return Commerce.AsyncResult.fromPromise(_this.context.runtime.executeAsync(validateSignatureRequest))
                                .map(function (result) {
                                return { canceled: result.canceled, data: result.canceled ? null : (result.data.result ? response.data : Commerce.StringExtensions.EMPTY) };
                            });
                        }
                    }).enqueue(function (result) {
                        if (result.canceled) {
                            return getSignatureFromDeviceQueue.cancelOn(_this._getSignatureFromDevice(correlationId))
                                .map(function (result) {
                                return result.data;
                            });
                        }
                        else {
                            return Commerce.AsyncResult.createResolved(new Payments.GetSignatureFromDeviceClientResponse(result.data));
                        }
                    });
                    return getSignatureFromDeviceQueue.run();
                };
                GetSignatureFromDeviceClientRequestHandler.prototype._callGetSignatureFromDeviceActivity = function (correlationId) {
                    var getSignatureFromDeviceInputClientRequest = new Payments.GetSignatureFromDeviceInputClientRequest(correlationId);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(getSignatureFromDeviceInputClientRequest))
                        .map(function (result) {
                        var wasActivityCancelled = result.data.status !== Payments.SignatureActivityResult.OK;
                        return { canceled: wasActivityCancelled, data: wasActivityCancelled ? null : result.data.signatureData };
                    });
                };
                return GetSignatureFromDeviceClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetSignatureFromDeviceClientRequestHandler = GetSignatureFromDeviceClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var GetSignatureFromPOSClientRequestHandler = (function (_super) {
                __extends(GetSignatureFromPOSClientRequestHandler, _super);
                function GetSignatureFromPOSClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GetSignatureFromPOSClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.GetSignatureFromPOSClientRequest;
                };
                GetSignatureFromPOSClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the GetSignatureFromPOSClientRequestHandler received a null or undefined request.");
                    }
                    Commerce.RetailLogger.posGetSignatureFromPOSRequestStarted(request.correlationId);
                    return this._getSignatureFromPOS(request.correlationId)
                        .recoverOnFailure(function (errors) {
                        Commerce.RetailLogger.posGetSignatureFromPOSRequestRetryDueToFailure(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                        return _this._getSignatureFromPOS(request.correlationId);
                    }).done(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posGetSignatureFromPOSRequestCancelled(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posGetSignatureFromPOSRequestSucceeded(request.correlationId);
                        }
                    }).fail(function (errors) {
                        Commerce.RetailLogger.posGetSignatureFromPOSRequestFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).getPromise();
                };
                GetSignatureFromPOSClientRequestHandler.prototype._getSignatureFromPOS = function (correlationId) {
                    var getSignatureFromPOSInputClientRequest = new Payments.GetSignatureFromPOSInputClientRequest(correlationId);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(getSignatureFromPOSInputClientRequest))
                        .map(function (result) {
                        var wasActivityCancelled = result.data.status !== Payments.SignatureActivityResult.OK;
                        return {
                            canceled: wasActivityCancelled,
                            data: wasActivityCancelled ? null : new Payments.GetSignatureFromPOSClientResponse(result.data.signature)
                        };
                    });
                };
                return GetSignatureFromPOSClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.GetSignatureFromPOSClientRequestHandler = GetSignatureFromPOSClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Handlers;
        (function (Handlers) {
            var ValidateSignatureClientRequestHandler = (function (_super) {
                __extends(ValidateSignatureClientRequestHandler, _super);
                function ValidateSignatureClientRequestHandler() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ValidateSignatureClientRequestHandler.prototype.supportedRequestType = function () {
                    return Payments.ValidateSignatureClientRequest;
                };
                ValidateSignatureClientRequestHandler.prototype.executeAsync = function (request) {
                    var _this = this;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(request)) {
                        throw new Error("The executeAsync method for the ValidateSignatureClientRequestHandler received a null or undefined request.");
                    }
                    Commerce.RetailLogger.posValidateSignatureRequestStarted(request.correlationId);
                    return this._validateSignatureInPOS(request.correlationId, request.allowRecapture, request.signatureData, request.allowDecline)
                        .recoverOnFailure(function (errors) {
                        Commerce.RetailLogger.posValidateSignatureRequestRetryDueToFailure(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                        return _this._validateSignatureInPOS(request.correlationId, request.allowRecapture, request.signatureData, request.allowDecline);
                    }).done(function (result) {
                        if (result.canceled) {
                            Commerce.RetailLogger.posValidateSignatureRequestCancelled(request.correlationId);
                        }
                        else {
                            Commerce.RetailLogger.posValidateSignatureRequestSucceeded(request.correlationId);
                        }
                    }).fail(function (errors) {
                        Commerce.RetailLogger.posValidateSignatureRequestFailed(request.correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                    }).getPromise();
                };
                ValidateSignatureClientRequestHandler.prototype._validateSignatureInPOS = function (correlationId, allowRecapture, signatureData, allowDecline) {
                    var validateSignatureClientRequest = new Payments.ValidateSignatureInPOSInputClientRequest(correlationId, allowRecapture, signatureData, allowDecline);
                    return Commerce.AsyncResult.fromPromise(this.context.runtime.executeAsync(validateSignatureClientRequest))
                        .map(function (result) {
                        var triggerRecapture = result.data.result === Payments.SignatureActivityResult.Recapture;
                        var wasValidationSuccessful = result.data.result === Payments.SignatureActivityResult.OK;
                        return { canceled: triggerRecapture, data: triggerRecapture ? null : new Payments.ValidateSignatureClientResponse(wasValidationSuccessful) };
                    });
                };
                return ValidateSignatureClientRequestHandler;
            }(Commerce.PosRequestHandlerBase));
            Handlers.ValidateSignatureClientRequestHandler = ValidateSignatureClientRequestHandler;
        })(Handlers = Payments.Handlers || (Payments.Handlers = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Utilities;
        (function (Utilities) {
            "use strict";
            var MerchantInformationHelper = (function () {
                function MerchantInformationHelper() {
                }
                MerchantInformationHelper.saveMerchantInformationLocalAsync = function (request, runtime, hardwareProfileId, correlationId) {
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        return MerchantInformationHelper._getLocalHardwareStation(correlationId, hardwareProfileId, runtime);
                    }).enqueue(function (result) {
                        if (result.canceled || result.data == null) {
                            return Commerce.AsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.HARDWARESTATION_LOCAL_MERCHANT_INFO_NOT_SUPPORTED)]);
                        }
                        else {
                            return Commerce.AsyncResult.fromPromise(runtime.executeAsync(new Commerce.Peripherals.HardwareStation.HardwareStationRequest(correlationId, result.data, "Security", "SaveMerchantInformationLocal", request)))
                                .map(function (response) {
                                return response.data.result;
                            });
                        }
                    });
                    return asyncQueue.run().map(function (result) {
                        return result.data;
                    });
                };
                MerchantInformationHelper.merchantInformationLocalExistsAsync = function (request, runtime, hardwareProfileId, correlationId) {
                    var asyncQueue = new Commerce.AsyncQueue();
                    asyncQueue.enqueue(function () {
                        return MerchantInformationHelper._getLocalHardwareStation(correlationId, hardwareProfileId, runtime);
                    }).enqueue(function (result) {
                        if (result.canceled || result.data == null) {
                            return Commerce.AsyncResult.createRejected([new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.HARDWARESTATION_LOCAL_MERCHANT_INFO_NOT_SUPPORTED)]);
                        }
                        else {
                            return Commerce.AsyncResult.fromPromise(runtime.executeAsync(new Commerce.Peripherals.HardwareStation.HardwareStationRequest(correlationId, result.data, "Security", "MerchantInformationLocalExists", request)))
                                .map(function (response) {
                                return response.data.result;
                            });
                        }
                    });
                    return asyncQueue.run().map(function (result) {
                        return result.data;
                    });
                };
                MerchantInformationHelper.clearMerchantInformationLocalAsync = function (request, runtime, hardwareProfileId, correlationId) {
                    var hardwareStation = MerchantInformationHelper._constructLocalHardwareStation(hardwareProfileId);
                    return Commerce.AsyncResult.fromPromise(runtime.executeAsync(new Commerce.Peripherals.HardwareStation.HardwareStationRequest(correlationId, hardwareStation, "Security", "SaveMerchantInformationLocal", request)))
                        .map(function (response) {
                        return response.data.result;
                    });
                };
                MerchantInformationHelper._getLocalHardwareStation = function (correlationId, hardwareProfileId, runtime) {
                    var serializedValue = Commerce.ApplicationStorage.getItem(Commerce.ApplicationStorageIDs.ACTIVE_HARDWARE_STATION);
                    var hardwareStation = null;
                    if (!Commerce.StringExtensions.isNullOrWhitespace(serializedValue)) {
                        hardwareStation = JSON.parse(serializedValue);
                    }
                    if (Commerce.ObjectExtensions.isNullOrUndefined(hardwareStation)) {
                        return Commerce.AsyncResult.fromPromise(runtime.executeAsync(new Commerce.Peripherals.HardwareStation.IsLocalHardwareStationSupportedClientRequest(correlationId)))
                            .map(function (result) {
                            Commerce.RetailLogger.activeHardwareStationNotSet(correlationId, result.data.result.isSupported);
                            if (result.data.result.isSupported) {
                                hardwareStation = MerchantInformationHelper._constructLocalHardwareStation(hardwareProfileId);
                            }
                            else {
                                Commerce.RetailLogger.hardwareStationLocalMerchantPropertiesNotSupported(correlationId);
                                hardwareStation = null;
                            }
                            return {
                                data: hardwareStation,
                                canceled: Commerce.ObjectExtensions.isNullOrUndefined(hardwareStation) ? true : result.canceled
                            };
                        });
                    }
                    else {
                        return Commerce.AsyncResult.createResolved({ data: hardwareStation, canceled: false });
                    }
                };
                MerchantInformationHelper._constructLocalHardwareStation = function (hardwareProfileId) {
                    return {
                        recordId: 0,
                        hostName: "localhost",
                        description: "Local Hardwarestation",
                        url: Commerce.Peripherals.HardwareStation.localStation,
                        profileId: hardwareProfileId,
                        isActive: undefined,
                        isPaired: undefined,
                        eftTerminalId: undefined,
                        hardwareConfigurations: undefined
                    };
                };
                return MerchantInformationHelper;
            }());
            Utilities.MerchantInformationHelper = MerchantInformationHelper;
        })(Utilities = Payments.Utilities || (Payments.Utilities = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Utilities;
        (function (Utilities) {
            "use strict";
            var ErrorCode;
            (function (ErrorCode) {
                ErrorCode[ErrorCode["None"] = 0] = "None";
                ErrorCode[ErrorCode["RetrievalTransactionByReferenceInProgress"] = 22155] = "RetrievalTransactionByReferenceInProgress";
                ErrorCode[ErrorCode["NoTransactionFoundByTransactionReference"] = 22156] = "NoTransactionFoundByTransactionReference";
                ErrorCode[ErrorCode["TransactionRetrievalByReferenceNotSupported"] = 22157] = "TransactionRetrievalByReferenceNotSupported";
                ErrorCode[ErrorCode["DuplicateTransactionResultUnknown"] = 22158] = "DuplicateTransactionResultUnknown";
            })(ErrorCode = Utilities.ErrorCode || (Utilities.ErrorCode = {}));
            var PaymentErrorHelper = (function () {
                function PaymentErrorHelper() {
                }
                PaymentErrorHelper.ConvertToClientErrors = function (errors) {
                    var paymentErrors = [];
                    var paymentSdkErrors = [];
                    for (var i = 0; i < errors.length; i++) {
                        var paymentException = errors[i].commerceException;
                        if (paymentException != null && Commerce.ArrayExtensions.hasElements(paymentException.PaymentSdkErrors)) {
                            paymentSdkErrors = PaymentErrorHelper.ConvertPaymentSdkErrorsToClientErrors(paymentException.PaymentSdkErrors);
                        }
                        if (Commerce.ArrayExtensions.hasElements(paymentSdkErrors)) {
                            paymentErrors = paymentErrors.concat(paymentSdkErrors);
                        }
                        else {
                            paymentErrors.push(PaymentErrorHelper.MapPaymentSdkErrorToClientError(errors[i]));
                        }
                    }
                    return paymentErrors;
                };
                PaymentErrorHelper.hasError = function (errors, errorType) {
                    return Commerce.Framework.ErrorConverter.hasError(errors, errorType, PaymentErrorHelper._convertErrorCodesToMap());
                };
                PaymentErrorHelper.getError = function (errors, errorType) {
                    var errorsOfType = errors.filter(function (error) {
                        return error instanceof errorType;
                    });
                    return Commerce.ArrayExtensions.firstOrUndefined(errorsOfType);
                };
                PaymentErrorHelper._convertErrorCodesToMap = function () {
                    return function (err) {
                        return Payments.ErrorCodes[err];
                    };
                };
                PaymentErrorHelper.ConvertPaymentSdkErrorsToClientErrors = function (errors) {
                    var paymentErrors = [];
                    for (var i = 0; i < errors.length; i++) {
                        var code = Commerce.StringExtensions.isNullOrWhitespace(errors[i].Code) ?
                            Payments.ErrorCodes.PaymentErrorTypeEnum[Payments.ErrorCodes.GENERAL_EXCEPTION_ERROR_CODE] :
                            errors[i].Code;
                        paymentErrors.push(new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_EXCEPTION_NAMESPACE + code.toUpperCase(), false, errors[i].Message));
                    }
                    return paymentErrors;
                };
                PaymentErrorHelper.MapPaymentSdkErrorToClientError = function (error) {
                    var result = Payments.ErrorCodes.PaymentErrorTypeEnum[error.ErrorCode];
                    var paymentError = Commerce.ObjectExtensions.isNullOrUndefined(result) ? error
                        : new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_EXCEPTION_NAMESPACE + result.toUpperCase(), false, error.ExternalLocalizedErrorMessage);
                    return paymentError;
                };
                return PaymentErrorHelper;
            }());
            Utilities.PaymentErrorHelper = PaymentErrorHelper;
        })(Utilities = Payments.Utilities || (Payments.Utilities = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Utilities;
        (function (Utilities) {
            "use strict";
            var PaymentHelper = (function () {
                function PaymentHelper() {
                }
                PaymentHelper.isAuthorize = function (amount) {
                    return amount >= 0;
                };
                PaymentHelper.beginTransactionAsync = function (context, userSession) {
                    var asyncQueue = new Commerce.AsyncQueue();
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(context.peripherals)
                        && !Commerce.ObjectExtensions.isNullOrUndefined(context.peripherals.paymentTerminal)
                        && Commerce.StringExtensions.isNullOrWhitespace(context.peripherals.paymentTerminal.lockToken)) {
                        var updateLines_1 = true;
                        asyncQueue.enqueue(function () {
                            var beginTransRequest = new Commerce.PaymentTerminalBeginTransactionRequest();
                            return Commerce.AsyncResult.fromPromise(context.runtime.executeAsync(beginTransRequest))
                                .recoverOnFailure(function (errors) {
                                updateLines_1 = false;
                                if (PaymentHelper.canUseTerminalAfterErrors(errors)) {
                                    return Commerce.VoidAsyncResult.createResolved();
                                }
                                return Commerce.VoidAsyncResult.createRejected(errors);
                            });
                        }).enqueue(function () {
                            if (context.peripherals.cardPayment) {
                                var request = new Commerce.CardPaymentBeginTransactionRequest();
                                return Commerce.AsyncResult.fromPromise(context.runtime.executeAsync(request)).map(function (result) { return void 0; });
                            }
                            return Commerce.VoidAsyncResult.createResolved();
                        }).enqueue(function () {
                            if (!updateLines_1) {
                                return Commerce.AsyncResult.createResolved();
                            }
                            var updateLinesRequest = new Commerce.PaymentTerminalUpdateLinesRequest(userSession.transaction.cart);
                            return Commerce.AsyncResult.fromPromise(context.runtime.executeAsync(updateLinesRequest));
                        });
                    }
                    return asyncQueue.run().map(function (result) { return void 0; });
                };
                PaymentHelper.getStoreCountryRegionISOCode = function (storeInformation) {
                    var storeAddress = storeInformation.OrgUnitAddress;
                    if (Commerce.ObjectExtensions.isNullOrUndefined(storeAddress)) {
                        storeAddress = new Commerce.Proxy.Entities.AddressClass();
                    }
                    if (Commerce.StringExtensions.isNullOrWhitespace(storeAddress.TwoLetterISORegionName)) {
                        storeAddress.TwoLetterISORegionName = "US";
                    }
                    return storeAddress.TwoLetterISORegionName;
                };
                PaymentHelper.isAssociatedCardType = function (cardType, cardNumber) {
                    if (cardNumber) {
                        var maskNumFrom = parseInt(cardType.NumberFrom, undefined);
                        var maskNumTo = parseInt(cardType.NumberTo, undefined);
                        var maskLength = cardType.NumberFrom.length;
                        var cardSubStr = void 0;
                        cardSubStr = (cardNumber.length > maskLength) ? parseInt(cardNumber.substr(0, maskLength), undefined) : parseInt(cardNumber, undefined);
                        if ((maskNumFrom <= cardSubStr) && (cardSubStr <= maskNumTo)) {
                            return true;
                        }
                    }
                    return false;
                };
                PaymentHelper.isDebitCard = function (cardTypeId) {
                    return cardTypeId === Commerce.Proxy.Entities.CardType.InternationalDebitCard;
                };
                PaymentHelper.getGiftCardByIdAsync = function (tenderType, giftCardId, correlationId, context) {
                    var paymentTerminal = context.peripherals.paymentTerminal;
                    var giftCardTypeId = Commerce.Proxy.Entities.CardType.GiftCard;
                    var tenderInfo = {
                        TenderId: null,
                        CardNumber: giftCardId,
                        CardTypeId: giftCardTypeId
                    };
                    if (Commerce.ObjectExtensions.isNullOrUndefined(tenderType) || Commerce.StringExtensions.isNullOrWhitespace(tenderType.ConnectorId)) {
                        var request = new Payments.GetGiftCardByIdServiceRequest(correlationId, giftCardId);
                        return Commerce.AsyncResult.fromPromise(context.runtime.executeAsync(request))
                            .map(function (response) {
                            return response.canceled ? null : response.data.giftCard;
                        });
                    }
                    else if (!Commerce.ObjectExtensions.isNullOrUndefined(paymentTerminal) && paymentTerminal.isActive) {
                        var request = new Commerce.PaymentTerminalEnquireGiftCardBalancePeripheralRequest(correlationId, tenderType.ConnectorId, tenderInfo);
                        return Commerce.AsyncResult.fromPromise(context.runtime.executeAsync(request))
                            .map(function (response) {
                            return PaymentHelper.mapEnquireGiftCardBalancePeripheralResponse(response, context.applicationSession);
                        });
                    }
                    else if (!Commerce.ObjectExtensions.isNullOrUndefined(context.peripherals.cardPayment)) {
                        var request = new Commerce.CardPaymentEnquireGiftCardBalancePeripheralRequest(correlationId, tenderType.ConnectorId, tenderInfo);
                        return Commerce.AsyncResult.fromPromise(context.runtime.executeAsync(request))
                            .map(function (response) {
                            return PaymentHelper.mapEnquireGiftCardBalancePeripheralResponse(response, context.applicationSession);
                        });
                    }
                    else {
                        var errors = new Array();
                        errors.push(new Commerce.Proxy.Entities.Error(Payments.ErrorCodes.PAYMENT_TERMINAL_NOT_CONFIGURED));
                        return Commerce.AsyncResult.createRejected(errors);
                    }
                };
                PaymentHelper.isCreditCard = function (cardTypeId) {
                    return cardTypeId === Commerce.Proxy.Entities.CardType.InternationalCreditCard
                        || cardTypeId === Commerce.Proxy.Entities.CardType.CorporateCard;
                };
                PaymentHelper.getMaskedNumber = function (originalNumber, useAlternateMaskCharacter) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(originalNumber) && !Commerce.StringExtensions.isEmpty(originalNumber) && originalNumber.length > 4) {
                        var numberPrefixLength = originalNumber.length - 4;
                        var last4Digits = originalNumber.substr(numberPrefixLength);
                        useAlternateMaskCharacter = Commerce.ObjectExtensions.isNullOrUndefined(useAlternateMaskCharacter) ? false : useAlternateMaskCharacter;
                        var characterMask = useAlternateMaskCharacter ? PaymentHelper.alternateMaskChar : PaymentHelper.maskChar;
                        var numberPrefix = Commerce.StringExtensions.padLeft(Commerce.StringExtensions.EMPTY, characterMask, numberPrefixLength);
                        return numberPrefix + last4Digits;
                    }
                    else {
                        return originalNumber;
                    }
                };
                PaymentHelper.getTruncatedCardNumber = function (originalNumber, context) {
                    if (!Commerce.ObjectExtensions.isNullOrUndefined(originalNumber) && !Commerce.StringExtensions.isEmpty(originalNumber) && originalNumber.length > 4) {
                        var numberPrefixLength = originalNumber.length - 4;
                        var last4Digits = originalNumber.substr(numberPrefixLength);
                        return Commerce.StringExtensions.format(context.stringResourceManager.getString("string_3446"), last4Digits);
                    }
                    else {
                        return Commerce.StringExtensions.EMPTY;
                    }
                };
                PaymentHelper.canUseTerminalAfterErrors = function (errors) {
                    return !Utilities.PaymentErrorHelper.hasError(errors, Payments.ErrorCodes.PERIPHERALS_HARDWARESTATION_NOTCONFIGURED)
                        && !Utilities.PaymentErrorHelper.hasError(errors, Payments.ErrorCodes.PAYMENT_TERMINAL_NOT_CONFIGURED)
                        && !Utilities.PaymentErrorHelper.hasError(errors, Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_COMMUNICATIONERROR)
                        && !Utilities.PaymentErrorHelper.hasError(errors, Payments.ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_PAYMENTTERMINAL_ERROR);
                };
                PaymentHelper.printDeclinedOrVoidedCardPaymentReceiptAsync = function (correlationId, paymentAmount, paymentInfo, tenderType, appSession, context) {
                    var isHardwareProfileConfigured = !Commerce.StringExtensions.isNullOrWhitespace(appSession.hardwareProfile.ProfileId);
                    if ((appSession.deviceConfiguration.PrintReceiptsOnCardDecline)
                        && isHardwareProfileConfigured && !Commerce.ObjectExtensions.isNullOrUndefined(paymentInfo)
                        && !Commerce.StringExtensions.isNullOrWhitespace(paymentInfo.PaymentSdkData)) {
                        var isRefundOperation = paymentAmount < 0;
                        var cardTypeId = Commerce.ObjectExtensions.isNullOrUndefined(paymentInfo.CardType)
                            || Commerce.StringExtensions.isNullOrWhitespace(paymentInfo.CardType.toString())
                            ? Commerce.Proxy.Entities.CardType.Unknown.toString().toUpperCase()
                            : paymentInfo.CardType.toString();
                        var printDeclinedOrVoidedCardReceiptsRequest = new Commerce.PrintDeclinedOrVoidedCardReceiptsClientRequest(correlationId, cardTypeId, appSession.deviceConfiguration.Currency, appSession.hardwareProfile.ProfileId, isRefundOperation, paymentInfo, tenderType);
                        return Commerce.AsyncResult.fromPromise(context.runtime.executeAsync(printDeclinedOrVoidedCardReceiptsRequest))
                            .map(function (result) {
                            return Commerce.VoidAsyncResult.createResolved();
                        }).recoverOnFailure(function (errors) {
                            Commerce.RetailLogger.printDeclinedOrVoidedCardPaymentReceiptsFailed(correlationId, Commerce.Framework.ErrorConverter.serializeError(errors));
                            return Commerce.VoidAsyncResult.createResolved();
                        });
                    }
                    else {
                        return Commerce.VoidAsyncResult.createResolved();
                    }
                };
                PaymentHelper.createRecoveredTransactionCheckQueue = function (operationName, runtime, correlationId) {
                    var asyncQueue = new Commerce.AsyncQueue();
                    if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                        correlationId = Microsoft.Dynamics.Diagnostics.TypeScriptCore.Utils.generateGuid();
                    }
                    asyncQueue.enqueue(function () {
                        var checkRecoveryRequest = new Commerce.CheckForRecoveredPaymentTransactionClientRequest(correlationId, null, Payments.TransactionReferenceAllowedActions.Read);
                        return asyncQueue.cancelOn(Commerce.AsyncResult.fromPromise(runtime.executeAsync(checkRecoveryRequest))).done(function (result) {
                            if (result.canceled || !Commerce.ObjectExtensions.isNullOrUndefined(result.data.result.foundTransaction)) {
                                Commerce.RetailLogger.posOperationCanceledDueToRecoveredPayment(operationName, correlationId);
                                asyncQueue.cancel();
                            }
                        });
                    });
                    return asyncQueue;
                };
                PaymentHelper.mapEnquireGiftCardBalancePeripheralResponse = function (response, appSession) {
                    if (response.canceled) {
                        return null;
                    }
                    var giftCard = {
                        Id: response.data.paymentInfo.CardNumberMasked,
                        Balance: response.data.paymentInfo.AvailableBalanceAmount,
                        CardCurrencyCode: appSession.deviceConfiguration.Currency
                    };
                    return giftCard;
                };
                PaymentHelper.DUPLICATE_PROTECTION_COMMAND_AUTHORIZE = "sale";
                PaymentHelper.DUPLICATE_PROTECTION_COMMAND_REFUND = "refund";
                PaymentHelper.maskChar = "*";
                PaymentHelper.alternateMaskChar = "X";
                return PaymentHelper;
            }());
            Utilities.PaymentHelper = PaymentHelper;
        })(Utilities = Payments.Utilities || (Payments.Utilities = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));

// SIG // Begin signature block
// SIG // MIIj/QYJKoZIhvcNAQcCoIIj7jCCI+oCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // UEZ7fiybphxTzeOyJQczIg80PXF4eNXgmpqO60I4TGSg
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
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCBbQHor4R6yI4tRBeiT
// SIG // rg3ai9+iXIrjAzlIhZ93hg88zjCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQA/P8fN
// SIG // W0RFzLPjqIKggEUCriyfMXAA6H0kjrgGdn8ODfrLC50w
// SIG // k2U9vNntqDlkc/7d2LpGX64aUdT1g7r4K5dNjNrme4Yw
// SIG // XJxJTA7jVmvdVJPC3wUwl1DjlpOtZuc7OY2nKq3qyLcA
// SIG // eSIyaQkqmZOi8fMGD1fBq8pzKd4FLqDW6L2Jf368A/ok
// SIG // eLF0FyOp0J1WwKZIcVFT3n4uk7e59bAK8a4At9O+BpBy
// SIG // NbBNtwXBBcoeMWlXfF7ailqg1QfuP/y5UtvAP0PLHTUK
// SIG // H577vR4LMvRAR8lm3F3ICmEqNJZmeGxyoQeqh3A493wI
// SIG // FtwBBx3eS/xUNWM4gG4DsNu1p335oYIS5DCCEuAGCisG
// SIG // AQQBgjcDAwExghLQMIISzAYJKoZIhvcNAQcCoIISvTCC
// SIG // ErkCAQMxDzANBglghkgBZQMEAgEFADCCAVAGCyqGSIb3
// SIG // DQEJEAEEoIIBPwSCATswggE3AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEIIVw7RKfamEQymRgZ5Wm
// SIG // R1exU7L8RVEAG+rUYaPgVH9sAgZfOtNQPhYYEjIwMjAw
// SIG // ODIzMDQwMjQ3LjcxWjAEgAIB9KCB0KSBzTCByjELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0
// SIG // IEFtZXJpY2EgT3BlcmF0aW9uczEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046MjI2NC1FMzNFLTc4MEMxJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wg
// SIG // gg48MIIE8TCCA9mgAwIBAgITMwAAARj+OvfZG9SxMwAA
// SIG // AAABGDANBgkqhkiG9w0BAQsFADB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMDAeFw0xOTExMTMyMTQwMzVaFw0y
// SIG // MTAyMTEyMTQwMzVaMIHKMQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSUwIwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVy
// SIG // YXRpb25zMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjoy
// SIG // MjY0LUUzM0UtNzgwQzElMCMGA1UEAxMcTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcN
// SIG // AQEBBQADggEPADCCAQoCggEBAML4A1wRfz81GPW3liRd
// SIG // gHVkc/FBLCuE459dfVzlp6zS3aBMjo54fie1zCnJO9KT
// SIG // v70EFWipO8fB9sNmZvXmdD3ir5Q98Gpr/ybW16z/oVu3
// SIG // UB5UfLgHLUBUWLpiLW9Z3dtVHJjZIB5WicjMQUYa1C95
// SIG // G/ZiPqNsIcTb7E/dD4ByDHB4TyXr+cA3lL+ZMMpXZ+Uc
// SIG // 1CD53lf1JI3sx0sLk4AmBLLfvgiL8CdgQrIiCc4UlWQj
// SIG // GQsPE7KudX+A5GWhrHJUaUN6acsE1qHCzGeaSukKFzC8
// SIG // OJ4DHiD9nV8nT4L7B0D4S0DuuuCdGSOEod9aRmPjRubH
// SIG // galB0mYXXMBnQXECAwEAAaOCARswggEXMB0GA1UdDgQW
// SIG // BBTxW+WwLg9gCdg5T/TmI+v4tMcoPjAfBgNVHSMEGDAW
// SIG // gBTVYzpcijGQ80N7fEYbxTNoWoVtVTBWBgNVHR8ETzBN
// SIG // MEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAx
// SIG // MC0wNy0wMS5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsG
// SIG // AQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAx
// SIG // LmNydDAMBgNVHRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IBAQBzJZ2+DpyC
// SIG // z/8CbGhBmb5YBKknNRcQ+EynfRtZzkfILBAH4xrpg+dx
// SIG // KgV1y3/lXUrin+sxwwsGfkvMQtUf67O2DoRErjxi1slv
// SIG // 0Dsmn58lmPuWhdo/2ZU/u0mza0a65txekZuCjkcYKOfu
// SIG // DMwEdjjlDwtJx9rUkVAQCJLaAIopGWsoywZohuL5S4G2
// SIG // xtDwmSe+aITAILBKZFNfS+IBm6ybiYlWooF7cGaP7IEM
// SIG // lVZy/QzKsRhDvihrRVJbckFz7FKupPYmCbYJzoiVJubw
// SIG // CyJUT9VzjJqF+Yt54Ud9NysrR+W7pUbON/UY0DVINdHh
// SIG // tSKesGWLeV+HC0qHHrHl5GxKMIIGcTCCBFmgAwIBAgIK
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
// SIG // bnMxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjIyNjQt
// SIG // RTMzRS03ODBDMSUwIwYDVQQDExxNaWNyb3NvZnQgVGlt
// SIG // ZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQDN
// SIG // 15vXIC9raQknaYV8N15J8Ukx3KCBgzCBgKR+MHwxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQSAyMDEwMA0GCSqGSIb3DQEB
// SIG // BQUAAgUA4uvpMjAiGA8yMDIwMDgyMzAyNTc1NFoYDzIw
// SIG // MjAwODI0MDI1NzU0WjB3MD0GCisGAQQBhFkKBAExLzAt
// SIG // MAoCBQDi6+kyAgEAMAoCAQACAhx2AgH/MAcCAQACAhHO
// SIG // MAoCBQDi7TqyAgEAMDYGCisGAQQBhFkKBAIxKDAmMAwG
// SIG // CisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMB
// SIG // hqAwDQYJKoZIhvcNAQEFBQADgYEATJ4mi+GE+j4xBdSA
// SIG // 28Ugso1tF0UEEBzCRhz3yO3b9i9cVkMKwwu5r9P0FEIl
// SIG // qE9CqcHzGZ8JF3vPPgQ2VGX57eGROlSN71XpqOPbHfBO
// SIG // iBAEuxc02ecE3zOGHm9SscEt8y/LNzjx7ZlfS0Ok11co
// SIG // Ey7emCzWb/VMrU4pUJHwZf4xggMNMIIDCQIBATCBkzB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAARj+
// SIG // OvfZG9SxMwAAAAABGDANBglghkgBZQMEAgEFAKCCAUow
// SIG // GgYJKoZIhvcNAQkDMQ0GCyqGSIb3DQEJEAEEMC8GCSqG
// SIG // SIb3DQEJBDEiBCB3lsDdpJKBJPjdUjcUwXsGQ34QrMWD
// SIG // ogwCF0p4mxy2/DCB+gYLKoZIhvcNAQkQAi8xgeowgecw
// SIG // geQwgb0EIKDPBxSbqlIDjwBVL72bln6TpwcftbI2O8+K
// SIG // XSgyDQf3MIGYMIGApH4wfDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAg
// SIG // UENBIDIwMTACEzMAAAEY/jr32RvUsTMAAAAAARgwIgQg
// SIG // 6Xth62hw8WU+MusSFo8o2ygYCJN3b1OmvInm8G12Rv4w
// SIG // DQYJKoZIhvcNAQELBQAEggEAMRuM0IAs+Me7qj0TapHG
// SIG // 3DA3cKDH6HtBiaxnu9np/9cOj4YzKZwqr3LzhcUBNN6u
// SIG // 8dB4dObOXPzolWNaVC5Lrcltre7Tlfcf8ja65tk6PUn4
// SIG // KMCGZ6MdJz22u9qp3OZF8L6x8xuYfGio9Zi+24nEbTPY
// SIG // rH3jugyItHEeOll4Q6Yfn6lHTKY7xvYNw+nARjC4LUX6
// SIG // 8qFEftE7COqFzBP9jq1puZ7qQQRMY5tIVe2KA4cmUb7K
// SIG // nyycdDCdgGXTDVQa9gheEoVnUsGuFVzOnN9S6OkTbS5W
// SIG // WgSgUA/yuKjccd9+JJJo58htlz2QxMajnUxv9BDExd+A
// SIG // PS/nV2w4R1Rbvg==
// SIG // End signature block
