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
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var CommercePaymentError = (function (_super) {
            __extends(CommercePaymentError, _super);
            function CommercePaymentError(correlationId, exception) {
                var _this = _super.call(this, correlationId, exception) || this;
                _this.name = "CommercePaymentError";
                _this.__proto__ = CommercePaymentError.prototype;
                return _this;
            }
            return CommercePaymentError;
        }(Commerce.Framework.CommerceExceptionError));
        Payments.CommercePaymentError = CommercePaymentError;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var ErrorCodes;
        (function (ErrorCodes) {
            "use strict";
            ErrorCodes.PAYMENT_EXCEPTION_NAMESPACE = "MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_";
            ErrorCodes.GENERAL_EXCEPTION_ERROR_CODE = "22149";
            ErrorCodes.PAYMENT_CREDIT_MEMO_NEGATIVE_BALANCE = "string_29827";
            ErrorCodes.PAYMENT_INFORMATION_INCOMPLETE = "string_1137";
            ErrorCodes.PAYMENT_INVALID_NUMBER = "string_1138";
            ErrorCodes.PAYMENT_CARD_NOT_SUPPORTED = "string_1139";
            ErrorCodes.PAYMENT_CASH_PAYMENT_NOT_AVAILABLE = "string_1142";
            ErrorCodes.PAYMENT_CARD_PAYMENT_NOT_AVAILABLE = "string_1158";
            ErrorCodes.PAYMENT_UNABLE_TO_LOAD_CURRENCY_AMOUNTS = "string_1143";
            ErrorCodes.PAYMENT_CUSTOMER_ACCOUNT_NOT_SET = "string_1154";
            ErrorCodes.PAYMENT_AMOUNT_CANNOT_BE_ZERO = "string_1159";
            ErrorCodes.PAYMENT_CARD_TRACK_DATA_EMPTY = "string_1166";
            ErrorCodes.PAYMENT_CARD_NUMBER_EMPTY = "string_1167";
            ErrorCodes.PAYMENT_ONLY_ONE_CUSTOMER_ACCOUNT_PAYMENT_ALLOWED = "string_1188";
            ErrorCodes.PAYMENT_AUTHORIZED_VOID_FAILED = "string_1189";
            ErrorCodes.PAYMENT_CAPTURED_VOID_FAILED = "string_1190";
            ErrorCodes.PAYMENT_PARTIAL_VOID_FAILED = "string_7205";
            ErrorCodes.PAYMENT_UNABLE_AUTHORIZE_OR_REFUND = "string_4931";
            ErrorCodes.PAYMENT_CARD_SECURITY_CODE_EMPTY = "string_1168";
            ErrorCodes.PAYMENT_CREDIT_MEMO_NUMBER_EMPTY = "string_1169";
            ErrorCodes.PAYMENT_LOYALTY_CARD_NUMBER_EMPTY = "string_1170";
            ErrorCodes.PAYMENT_GIFT_CARD_NUMBER_EMPTY = "string_1171";
            ErrorCodes.PAYMENT_CUSTOMER_ACCOUNT_EMPTY = "string_1172";
            ErrorCodes.PAYMENT_INVALID_CARD_NUMBER = "string_1175";
            ErrorCodes.PAYMENT_INVALID_SECURITY_CODE = "string_1176";
            ErrorCodes.PAYMENT_INVALID_ZIP_CODE = "string_1177";
            ErrorCodes.PAYMENT_CAPTURED_PAYMENT_COULD_NOT_BE_UPDATED_ON_SERVER = "string_29703";
            ErrorCodes.PAYMENT_AMOUNT_MUST_LESS_THAN_ZERO = "string_1178";
            ErrorCodes.PAYMENT_AMOUNT_MUST_GREATER_THAN_ZERO = "string_1179";
            ErrorCodes.PAYMENT_PREVIOUS_PAYMENT_CAPTURE_FAILED = "string_29070";
            ErrorCodes.PAYMENT_TERMINAL_LOCK_NOT_OBTAINED = "string_7223";
            ErrorCodes.PAYMENT_TERMINAL_NOT_CONFIGURED = "string_29859";
            ErrorCodes.PAYMENT_UNABLE_TO_PROCESS_PREVIOUS_PAYMENT = "string_29084";
            ErrorCodes.CARD_PAYMENT_NOT_CONFIGURED = "string_29864";
            ErrorCodes.GIFT_CARD_NOT_APPROVED = "string_29860";
            ErrorCodes.INVALID_CARD_USED_FOR_TENDER_DISCOUNTS = "string_29078";
            ErrorCodes.NOT_SUPPORTED_IN_OFFLINE_MODE_WHEN_HARDWARE_STATION_NOT_ACTIVE = "string_29839";
            ErrorCodes.CANNOT_CHANGE_HARDWARE_STATION_WHEN_PAYMENT_DONE = "string_6009";
            ErrorCodes.HARDWARESTATION_CHANGE_ERROR_LINE_DISPLAY_ACTIVE = "string_6014";
            ErrorCodes.HARDWARESTATION_BALANCE_TOKEN_ERROR = "string_7204";
            ErrorCodes.HARDWARESTATION_MUST_BE_PAIRED_BEFORE_ACTIVATE = "string_6010";
            ErrorCodes.HARDWARESTATION_SWITCH_NOT_ALLOWED_TO_NONSHARED = "string_6017";
            ErrorCodes.HARDWARESTATION_LOCAL_MERCHANT_INFO_NOT_SUPPORTED = "string_4974";
            ErrorCodes.HARDWARESTATION_MISSING_MERCHANT_INFO_IDENTIFIER = "string_4975";
            ErrorCodes.HARDWARESTATION_MISSING_USER_OR_DEVICE_TOKEN = "string_4977";
            ErrorCodes.SHIFT_NOT_ALLOWED_ON_ACTIVE_HARDWARE_PROFILE = "string_6018";
            ErrorCodes.SHIFT_USING_ACTIVE_HARDWARESTATION_DRAWER = "string_6034";
            ErrorCodes.CREDIT_MEMO_INVALID_AMOUNT = "string_29800";
            ErrorCodes.CANNOT_PAYMENT_TRANSACTION_COMPLETED = "string_4356";
            ErrorCodes.CALCULATE_TOTAL_BEFORE_PAYMENT = "string_4373";
            ErrorCodes.PERIPHERALS_HARDWARESTATION_NOTCONFIGURED = "string_4908";
            ErrorCodes.PERIPHERALS_HARDWARESTATION_COMMUNICATION_FAILED = "string_4914";
            ErrorCodes.PERIPHERALS_HARDWARESTATION_API_NOTFOUND = "string_4978";
            ErrorCodes.PERIPHERALS_BARCODE_SCANNER_NOTFOUND = "string_4900";
            ErrorCodes.PERIPHERALS_BARCODE_SCANNER_ENABLE_FAILED = "string_4901";
            ErrorCodes.PERIPHERALS_CASHDRAWER_ALREADY_OPENED = "string_4936";
            ErrorCodes.PERIPHERALS_MSR_NOTFOUND = "string_4902";
            ErrorCodes.PERIPHERALS_MSR_ENABLE_FAILED = "string_4903";
            ErrorCodes.PERIPHERALS_PRINTER_FAILED = "string_4904";
            ErrorCodes.PERIPHERAL_PAYMENT_UNKNOWN_ERROR = "string_4919";
            ErrorCodes.PERIPHERAL_UNSUPPORTED_PRINTERTYPE_ERROR = "string_4937";
            ErrorCodes.PERIPHERAL_DUALDISPLAY_RESPONSE_NOT_RECEIVED = "string_4940";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_PRINTER_ERROR = "string_4904";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_CASHDRAWER_ERROR = "string_4905";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_PAYMENTTERMINAL_ERROR = "string_4907";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_DUALDISPLAY_ERROR = "string_4918";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_PAIRINGERROR = "string_6011";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_PINPAD_ERROR = "string_4923";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_LINEDISPLAY_ERROR = "string_4925";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_PERIPHERALISLOCKED = "string_4927";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_BARCODESCANNER_ERROR = "string_4933";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_MAGNETICSWIPEREADER_ERROR = "string_4934";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_HARDWARESTATION_SCALE_CALIBRATIONERROR = "string_4938";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTREQUIRESMERCHANTPROPERTIES = "string_29400";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_BALANCEAMOUNTEXCEEDSMAXIMUMALLOWEDVALUE = "string_29355";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_CHANGEBACKISNOTALLOWED = "string_29356";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_INCORRECTPAYMENTAMOUNTSIGN = "string_29357";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_OVERTENDERAMOUNTEXCEEDSMAXIMUMALLOWEDVALUE = "string_29358";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEEDSMAXIMUMAMOUNTPERLINE = "string_29359";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEEDSMAXIMUMAMOUNTPERTRANSACTION = "string_29360";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEEDSMINIMUMAMOUNTPERLINE = "string_29361";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEEDSMINIMUMAMOUNTPERTRANSACTION = "string_29362";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTMUSTBEUSEDTOFINALIZETRANSACTION = "string_29363";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_TENDERLINECANNOTBEVOIDED = "string_29826";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_UNABLETORETRIEVECARDPAYMENTACCEPTRESULT = "string_7206";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_UNABLETOGETCARDPAYMENTACCEPTPOINT = "string_4377";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTALREADYVOIDED = "string_29293";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_INVALIDPAYMENTREQUEST = "string_29293";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_INVALIDLOYALTYCARDNUMBER = "string_29286";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_USERSESSIONNOTOPENED = "string_29054";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_CUSTOMERACCOUNTPAYMENTEXCEEDSTOTALAMOUNTFORCARRYOUTITEMS = "string_29417";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_GIFTCARDPAYMENTNOTSUPPORTED = "string_5117";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDOPERATION = "string_29601";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_APPLICATIONERROR = "string_29602";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_GENERICCHECKDETAILSFORERROR = "string_29603";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_DONOTAUTHORIZED = "string_29604";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_USERABORTED = "string_29605";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_LOCALENOTSUPPORTED = "string_29606";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDMERCHANTPROPERTY = "string_29607";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_COMMUNICATIONERROR = "string_29608";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDARGUMENTCARDTYPENOTSUPPORTED = "string_29609";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_VOICEAUTHORIZATIONNOTSUPPORTED = "string_29610";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_REAUTHORIZATIONNOTSUPPORTED = "string_29611";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_MULTIPLECAPTURENOTSUPPORTED = "string_29612";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_BATCHCAPTURENOTSUPPORTED = "string_29613";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_UNSUPPORTEDCURRENCY = "string_29614";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_UNSUPPORTEDCOUNTRY = "string_29615";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CANNOTREAUTHORIZEPOSTCAPTURE = "string_29616";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CANNOTREAUTHORIZEPOSTVOID = "string_29617";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_IMMEDIATECAPTURENOTSUPPORTED = "string_29618";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CARDEXPIRED = "string_29619";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_REFERTOISSUER = "string_29620";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_NOREPLY = "string_29621";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_HOLDCALLORPICKUPCARD = "string_29622";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDAMOUNT = "string_29623";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_ACCOUNTLENGTHERROR = "string_29624";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_ALREADYREVERSED = "string_29625";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CANNOTVERIFYPIN = "string_29626";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDCARDNUMBER = "string_29627";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDCVV2 = "string_29628";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CASHBACKNOTAVAILABLE = "string_29629";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CARDTYPEVERIFICATIONERROR = "string_29630";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_DECLINE = "string_29631";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_ENCRYPTIONERROR = "string_29632";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_NOACTIONTAKEN = "string_29633";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_NOSUCHISSUER = "string_29634";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_PINTRIESEXCEEDED = "string_29635";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_SECURITYVIOLATION = "string_29636";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_SERVICENOTALLOWED = "string_29637";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_STOPRECURRING = "string_29638";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_WRONGPIN = "string_29639";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CVV2MISMATCH = "string_29640";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_DUPLICATETRANSACTION = "string_29641";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_REENTER = "string_29642";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_AMOUNTEXCEEDLIMIT = "string_29643";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_AUTHORIZATIONEXPIRED = "string_29644";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_AUTHORIZATIONALREADYCOMPLETED = "string_29645";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_AUTHORIZATIONISVOIDED = "string_29646";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_PROCESSORDUPLICATEBATCH = "string_29647";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_AUTHORIZATIONFAILURE = "string_29648";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDMERCHANTCONFIGURATION = "string_29649";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDEXPIRATIONDATE = "string_29650";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDCARDHOLDERNAMEFIRSTNAMEREQUIRED = "string_29651";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDCARDHOLDERNAMELASTNAMEREQUIRED = "string_29652";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_FILTERDECLINE = "string_29653";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDADDRESS = "string_29654";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CVV2REQUIRED = "string_29655";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CARDTYPENOTSUPPORTED = "string_29656";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_UNIQUEINVOICENUMBERREQUIRED = "string_29657";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_POSSIBLEDUPLICATE = "string_29658";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_PROCESSORREQUIRESLINKEDREFUND = "string_29659";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CRYPTOBOXUNAVAILABLE = "string_29660";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CVV2DECLINED = "string_29661";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_MERCHANTIDINVALID = "string_29662";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_TRANNOTALLOWED = "string_29663";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_TERMINALNOTFOUND = "string_29664";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDEFFECTIVEDATE = "string_29665";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INSUFFICIENTFUNDS = "string_29666";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_REAUTHORIZATIONMAXREACHED = "string_29667";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_REAUTHORIZATIONNOTALLOWED = "string_29668";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_DATEOFBIRTHERROR = "string_29669";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_ENTERLESSERAMOUNT = "string_29670";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_HOSTKEYERROR = "string_29671";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDCASHBACKAMOUNT = "string_29672";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDTRANSACTION = "string_29673";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_IMMEDIATECAPTUREREQUIRED = "string_29674";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_IMMEDIATECAPTUREREQUIREDMAC = "string_29675";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_MACREQUIRED = "string_29676";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_BANKCARDNOTSET = "string_29677";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDREQUEST = "string_29678";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDTRANSACTIONFEE = "string_29679";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_NOCHECKINGACCOUNT = "string_29680";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_NOSAVINGSACCOUNT = "string_29681";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_RESTRICTEDCARDTEMPORARILYDISALLOWEDFROMINTERCHANGE = "string_29682";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_MACSECURITYFAILURE = "string_29683";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_EXCEEDSWITHDRAWALFREQUENCYLIMIT = "string_29684";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDCAPTUREDATE = "string_29685";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_NOKEYSAVAILABLE = "string_29686";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_KMESYNCERROR = "string_29687";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_KPESYNCERROR = "string_29688";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_KMACSYNCERROR = "string_29689";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_RESUBMITEXCEEDSLIMIT = "string_29690";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_SYSTEMPROBLEMERROR = "string_29691";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_ACCOUNTNUMBERNOTFOUNDFORROW = "string_29692";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDTOKENINFOPARAMETERFORROW = "string_29693";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_EXCEPTIONTHROWNFORROW = "string_29694";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_TRANSACTIONAMOUNTEXCEEDSREMAINING = "string_29695";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDARGUMENTTENDERACCOUNTNUMBER = "string_29696";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDCARDTRACKDATA = "string_29697";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDRESULTACCESSCODE = "string_29698";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_GENERALEXCEPTION = "string_29699";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_INVALIDVOICEAUTHORIZATIONCODE = "string_29700";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CASHBACKAMOUNTEXCEEDSTOTALAMOUNT = "string_29701";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_EXECUTETASKNOTSUPPORTED = "string_29704";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CARDNOTACTIVATED = "string_29705";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_CARDALREADYACTIVATED = "string_29706";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_UNASSIGNEDTENDERTYPEOPERATION = "string_29707";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_RETURNWITHOUTRECEIPTPAYMENT = "string_29709";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_REFUNDMORETHANPOLICYALLOWS = "string_7224";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_TENDERTYPENOTALLOWEDBYPOLICY = "string_7225";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_PAYMENTEXCEPTION_PAYCASHQUICKNOTALLOWEDBYRETURNPOLICY = "string_7226";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_HEADQUARTERCOMMUNICATIONFAILURE = {
                serverErrorCode: "MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_HEADQUARTERCOMMUNICATIONFAILURE",
                clientErrorCode: "DA2009",
                messageResource: "string_29240"
            };
            ErrorCodes.MICROSOFT_DYNAMICS_POS_CLIENTBROKER_COMMUNICATION_ERROR = {
                serverErrorCode: "MICROSOFT_DYNAMICS_POS_CLIENTBROKER_COMMUNICATION_ERROR",
                clientErrorCode: "DA3014",
                messageResource: "string_29841",
                messageDetailsResource: ["string_29842", "string_29843"]
            };
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_TRANSACTIONSERVICETIMEOUT = {
                serverErrorCode: "MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_TRANSACTIONSERVICETIMEOUT",
                clientErrorCode: "DA2006",
                messageResource: "string_27160"
            };
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_REALTIMESERVICENOTSUPPORTED = {
                serverErrorCode: "MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_REALTIMESERVICENOTSUPPORTED",
                messageResource: "string_29831"
            };
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_INVALIDCARTVERSIONERROR_MESSAGEBODY = "string_29855";
            ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_INVALIDCARTVERSION = {
                serverErrorCode: "Microsoft_Dynamics_Commerce_Runtime_InvalidCartVersion",
                messageResource: ErrorCodes.MICROSOFT_DYNAMICS_COMMERCE_RUNTIME_INVALIDCARTVERSIONERROR_MESSAGEBODY
            };
            var PaymentErrorTypeEnum = (function () {
                function PaymentErrorTypeEnum() {
                }
                PaymentErrorTypeEnum[20001] = "InvalidOperation";
                PaymentErrorTypeEnum[20002] = "ApplicationError";
                PaymentErrorTypeEnum[20003] = "GenericCheckDetailsForError";
                PaymentErrorTypeEnum[20004] = "DONotAuthorized";
                PaymentErrorTypeEnum[20005] = "UserAborted";
                PaymentErrorTypeEnum[20119] = "InvalidArgumentTenderAccountNumber";
                PaymentErrorTypeEnum[21001] = "LocaleNotSupported";
                PaymentErrorTypeEnum[21002] = "InvalidMerchantProperty";
                PaymentErrorTypeEnum[21033] = "InvalidVoiceAuthorizationCode";
                PaymentErrorTypeEnum[21035] = "CashBackAmountExceedsTotalAmount";
                PaymentErrorTypeEnum[22001] = "CommunicationError";
                PaymentErrorTypeEnum[22010] = "InvalidArgumentCardTypeNotSupported";
                PaymentErrorTypeEnum[22011] = "VoiceAuthorizationNotSupported";
                PaymentErrorTypeEnum[22012] = "ReauthorizationNotSupported";
                PaymentErrorTypeEnum[22013] = "MultipleCaptureNotSupported";
                PaymentErrorTypeEnum[22014] = "BatchCaptureNotSupported";
                PaymentErrorTypeEnum[22015] = "UnsupportedCurrency";
                PaymentErrorTypeEnum[22016] = "UnsupportedCountry";
                PaymentErrorTypeEnum[22017] = "CannotReauthorizePostCapture";
                PaymentErrorTypeEnum[22018] = "CannotReauthorizePostVoid";
                PaymentErrorTypeEnum[22019] = "ImmediateCaptureNotSupported";
                PaymentErrorTypeEnum[22050] = "CardExpired";
                PaymentErrorTypeEnum[22051] = "ReferToIssuer";
                PaymentErrorTypeEnum[22052] = "NoReply";
                PaymentErrorTypeEnum[22053] = "HoldCallOrPickupCard";
                PaymentErrorTypeEnum[22054] = "InvalidAmount";
                PaymentErrorTypeEnum[22055] = "AccountLengthError";
                PaymentErrorTypeEnum[22056] = "AlreadyReversed";
                PaymentErrorTypeEnum[22057] = "CannotVerifyPin";
                PaymentErrorTypeEnum[22058] = "InvalidCardNumber";
                PaymentErrorTypeEnum[22059] = "InvalidCVV2";
                PaymentErrorTypeEnum[22060] = "CashBackNotAvailable";
                PaymentErrorTypeEnum[22061] = "CardTypeVerificationError";
                PaymentErrorTypeEnum[22062] = "Decline";
                PaymentErrorTypeEnum[22063] = "EncryptionError";
                PaymentErrorTypeEnum[22065] = "NoActionTaken";
                PaymentErrorTypeEnum[22066] = "NoSuchIssuer";
                PaymentErrorTypeEnum[22067] = "PinTriesExceeded";
                PaymentErrorTypeEnum[22068] = "SecurityViolation";
                PaymentErrorTypeEnum[22069] = "ServiceNotAllowed";
                PaymentErrorTypeEnum[22070] = "StopRecurring";
                PaymentErrorTypeEnum[22071] = "WrongPin";
                PaymentErrorTypeEnum[22072] = "CVV2Mismatch";
                PaymentErrorTypeEnum[22073] = "DuplicateTransaction";
                PaymentErrorTypeEnum[22074] = "Reenter";
                PaymentErrorTypeEnum[22075] = "AmountExceedLimit";
                PaymentErrorTypeEnum[22076] = "AuthorizationExpired";
                PaymentErrorTypeEnum[22077] = "AuthorizationAlreadyCompleted";
                PaymentErrorTypeEnum[22078] = "AuthorizationIsVoided";
                PaymentErrorTypeEnum[22090] = "ProcessorDuplicateBatch";
                PaymentErrorTypeEnum[22100] = "AuthorizationFailure";
                PaymentErrorTypeEnum[22102] = "InvalidMerchantConfiguration";
                PaymentErrorTypeEnum[22103] = "InvalidExpirationDate";
                PaymentErrorTypeEnum[22104] = "InvalidCardholderNameFirstNameRequired";
                PaymentErrorTypeEnum[22105] = "InvalidCardholderNameLastNameRequired";
                PaymentErrorTypeEnum[22106] = "FilterDecline";
                PaymentErrorTypeEnum[22107] = "InvalidAddress";
                PaymentErrorTypeEnum[22108] = "CVV2Required";
                PaymentErrorTypeEnum[22109] = "CardTypeNotSupported";
                PaymentErrorTypeEnum[22110] = "UniqueInvoiceNumberRequired";
                PaymentErrorTypeEnum[22111] = "PossibleDuplicate";
                PaymentErrorTypeEnum[22112] = "ProcessorRequiresLinkedRefund";
                PaymentErrorTypeEnum[22113] = "CryptoBoxUnavailable";
                PaymentErrorTypeEnum[22114] = "CVV2Declined";
                PaymentErrorTypeEnum[22115] = "MerchantIdInvalid";
                PaymentErrorTypeEnum[22116] = "TranNotAllowed";
                PaymentErrorTypeEnum[22117] = "TerminalNotFound";
                PaymentErrorTypeEnum[22118] = "InvalidEffectiveDate";
                PaymentErrorTypeEnum[22119] = "InsufficientFunds";
                PaymentErrorTypeEnum[22120] = "ReauthorizationMaxReached";
                PaymentErrorTypeEnum[22121] = "ReauthorizationNotAllowed";
                PaymentErrorTypeEnum[22122] = "DateOfBirthError";
                PaymentErrorTypeEnum[22123] = "EnterLesserAmount";
                PaymentErrorTypeEnum[22124] = "HostKeyError";
                PaymentErrorTypeEnum[22125] = "InvalidCashBackAmount";
                PaymentErrorTypeEnum[22126] = "InvalidTransaction";
                PaymentErrorTypeEnum[22127] = "ImmediateCaptureRequired";
                PaymentErrorTypeEnum[22128] = "ImmediateCaptureRequiredMAC";
                PaymentErrorTypeEnum[22129] = "MACRequired";
                PaymentErrorTypeEnum[22130] = "BankcardNotSet";
                PaymentErrorTypeEnum[22131] = "InvalidRequest";
                PaymentErrorTypeEnum[22132] = "InvalidTransactionFee";
                PaymentErrorTypeEnum[22133] = "NoCheckingAccount";
                PaymentErrorTypeEnum[22134] = "NoSavingsAccount";
                PaymentErrorTypeEnum[22135] = "RestrictedCardTemporarilyDisallowedFromInterchange";
                PaymentErrorTypeEnum[22136] = "MACSecurityFailure";
                PaymentErrorTypeEnum[22137] = "ExceedsWithdrawalFrequencyLimit";
                PaymentErrorTypeEnum[22138] = "InvalidCaptureDate";
                PaymentErrorTypeEnum[22139] = "NoKeysAvailable";
                PaymentErrorTypeEnum[22140] = "KMESyncError";
                PaymentErrorTypeEnum[22141] = "KPESyncError";
                PaymentErrorTypeEnum[22142] = "KMACSyncError";
                PaymentErrorTypeEnum[22143] = "ResubmitExceedsLimit";
                PaymentErrorTypeEnum[22144] = "SystemProblemError";
                PaymentErrorTypeEnum[22145] = "AccountNumberNotFoundForRow";
                PaymentErrorTypeEnum[22146] = "InvalidTokenInfoParameterForRow";
                PaymentErrorTypeEnum[22147] = "ExceptionThrownForRow";
                PaymentErrorTypeEnum[22148] = "TransactionAmountExceedsRemaining";
                PaymentErrorTypeEnum[22149] = "GeneralException";
                PaymentErrorTypeEnum[22150] = "InvalidCardTrackData";
                PaymentErrorTypeEnum[22151] = "InvalidResultAccessCode";
                PaymentErrorTypeEnum[22152] = "ExecuteTaskNotSupported";
                PaymentErrorTypeEnum[22153] = "CardNotActivated";
                PaymentErrorTypeEnum[22154] = "CardAlreadyActivated";
                PaymentErrorTypeEnum[22155] = "RetrievalTransactionByReferenceInProgress";
                PaymentErrorTypeEnum[22156] = "NoTransactionFoundByTransactionReference";
                PaymentErrorTypeEnum[22157] = "TransactionRetrievalByReferenceNotSupported";
                PaymentErrorTypeEnum[22158] = "DuplicateTransactionResultUnknown";
                PaymentErrorTypeEnum[22159] = "GiftCardNumberNotFound";
                return PaymentErrorTypeEnum;
            }());
            ErrorCodes.PaymentErrorTypeEnum = PaymentErrorTypeEnum;
        })(ErrorCodes = Payments.ErrorCodes || (Payments.ErrorCodes = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var HardwareStationError = (function (_super) {
            __extends(HardwareStationError, _super);
            function HardwareStationError(errorCode, externalLocalizedErrorMessage, paymentInfo) {
                var _this = _super.call(this, errorCode, false, externalLocalizedErrorMessage) || this;
                _this.__proto__ = HardwareStationError.prototype;
                _this.paymentInfo = paymentInfo;
                return _this;
            }
            Object.defineProperty(HardwareStationError.prototype, "isLocalized", {
                get: function () {
                    return !Commerce.StringExtensions.isNullOrWhitespace(this.ExternalLocalizedErrorMessage);
                },
                enumerable: true,
                configurable: true
            });
            return HardwareStationError;
        }(Commerce.Proxy.Entities.Error));
        Payments.HardwareStationError = HardwareStationError;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var PaymentTransactionReferenceContainer = (function () {
            function PaymentTransactionReferenceContainer() {
            }
            return PaymentTransactionReferenceContainer;
        }());
        Payments.PaymentTransactionReferenceContainer = PaymentTransactionReferenceContainer;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Proxy;
    (function (Proxy) {
        var Entities;
        (function (Entities) {
            "use strict";
            var PeripheralType;
            (function (PeripheralType) {
                PeripheralType[PeripheralType["None"] = 0] = "None";
                PeripheralType[PeripheralType["OPOS"] = 1] = "OPOS";
                PeripheralType[PeripheralType["Windows"] = 2] = "Windows";
                PeripheralType[PeripheralType["Device"] = 3] = "Device";
                PeripheralType[PeripheralType["Network"] = 4] = "Network";
                PeripheralType[PeripheralType["Fallback"] = 5] = "Fallback";
            })(PeripheralType = Entities.PeripheralType || (Entities.PeripheralType = {}));
            var PeripheralDeviceType;
            (function (PeripheralDeviceType) {
                PeripheralDeviceType[PeripheralDeviceType["None"] = 0] = "None";
                PeripheralDeviceType[PeripheralDeviceType["OPOS"] = 1] = "OPOS";
                PeripheralDeviceType[PeripheralDeviceType["Windows"] = 2] = "Windows";
                PeripheralDeviceType[PeripheralDeviceType["Network"] = 3] = "Network";
            })(PeripheralDeviceType = Entities.PeripheralDeviceType || (Entities.PeripheralDeviceType = {}));
        })(Entities = Proxy.Entities || (Proxy.Entities = {}));
    })(Proxy = Commerce.Proxy || (Commerce.Proxy = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Proxy;
    (function (Proxy) {
        var Entities;
        (function (Entities) {
            "use strict";
            var PeripheralPaymentType;
            (function (PeripheralPaymentType) {
                PeripheralPaymentType[PeripheralPaymentType["None"] = 0] = "None";
                PeripheralPaymentType[PeripheralPaymentType["CardPaymentController"] = 1] = "CardPaymentController";
                PeripheralPaymentType[PeripheralPaymentType["PaymentTerminal"] = 2] = "PaymentTerminal";
                PeripheralPaymentType[PeripheralPaymentType["RetailServer"] = 3] = "RetailServer";
                PeripheralPaymentType[PeripheralPaymentType["CardPaymentAccept"] = 4] = "CardPaymentAccept";
            })(PeripheralPaymentType = Entities.PeripheralPaymentType || (Entities.PeripheralPaymentType = {}));
        })(Entities = Proxy.Entities || (Proxy.Entities = {}));
    })(Proxy = Commerce.Proxy || (Commerce.Proxy = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SignatureActivityResult;
        (function (SignatureActivityResult) {
            SignatureActivityResult[SignatureActivityResult["OK"] = 0] = "OK";
            SignatureActivityResult[SignatureActivityResult["Cancelled"] = 1] = "Cancelled";
            SignatureActivityResult[SignatureActivityResult["Recapture"] = 2] = "Recapture";
        })(SignatureActivityResult = Payments.SignatureActivityResult || (Payments.SignatureActivityResult = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var TransactionReferenceAllowedActions;
        (function (TransactionReferenceAllowedActions) {
            TransactionReferenceAllowedActions[TransactionReferenceAllowedActions["Any"] = 0] = "Any";
            TransactionReferenceAllowedActions[TransactionReferenceAllowedActions["Read"] = 1] = "Read";
            TransactionReferenceAllowedActions[TransactionReferenceAllowedActions["Remove"] = 2] = "Remove";
        })(TransactionReferenceAllowedActions = Payments.TransactionReferenceAllowedActions || (Payments.TransactionReferenceAllowedActions = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ActivateHardwareStationClientResponse = (function (_super) {
            __extends(ActivateHardwareStationClientResponse, _super);
            function ActivateHardwareStationClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ActivateHardwareStationClientResponse;
        }(Commerce.ClientResponse));
        Payments.ActivateHardwareStationClientResponse = ActivateHardwareStationClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ActivateHardwareStationClientRequest = (function (_super) {
            __extends(ActivateHardwareStationClientRequest, _super);
            function ActivateHardwareStationClientRequest(correlationId, hardwareStationProfile) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to ActivateHardwareStationClientRequest: correlationId cannot be null or empty string.");
                }
                if (Commerce.ObjectExtensions.isNullOrUndefined(hardwareStationProfile)) {
                    throw new Error("Invalid option passed to ActivateHardwareStationClientRequest: hardwareStationProfile cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.hardwareStationProfile = hardwareStationProfile;
                return _this;
            }
            return ActivateHardwareStationClientRequest;
        }(Commerce.ClientRequest));
        Payments.ActivateHardwareStationClientRequest = ActivateHardwareStationClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var AddPreAuthorizedPaymentsToCartClientRequest = (function (_super) {
            __extends(AddPreAuthorizedPaymentsToCartClientRequest, _super);
            function AddPreAuthorizedPaymentsToCartClientRequest(correlationId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the AddPreAuthorizedPaymentsToCartClientRequest constructor: "
                        + "correlationId cannot be null or empty.");
                }
                _this = _super.call(this, correlationId) || this;
                return _this;
            }
            return AddPreAuthorizedPaymentsToCartClientRequest;
        }(Commerce.ClientRequest));
        Payments.AddPreAuthorizedPaymentsToCartClientRequest = AddPreAuthorizedPaymentsToCartClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var AddPreAuthorizedPaymentsToCartClientResponse = (function (_super) {
            __extends(AddPreAuthorizedPaymentsToCartClientResponse, _super);
            function AddPreAuthorizedPaymentsToCartClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return AddPreAuthorizedPaymentsToCartClientResponse;
        }(Commerce.ClientResponse));
        Payments.AddPreAuthorizedPaymentsToCartClientResponse = AddPreAuthorizedPaymentsToCartClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ApprovePartialPaymentClientRequest = (function (_super) {
            __extends(ApprovePartialPaymentClientRequest, _super);
            function ApprovePartialPaymentClientRequest(correlationId, authorizationPaymentInfo, authorizationTenderLine, fullAmountDue, peripheralType) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for ApprovePartialPaymentClientRequest: correlationId is invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(authorizationPaymentInfo)) {
                    throw new Error("Invalid option passed to constructor for ApprovePartialPaymentClientRequest: authorizationPaymentInfo is invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(authorizationTenderLine)) {
                    throw new Error("Invalid option passed to constructor for ApprovePartialPaymentClientRequest: Invalid authorizationTenderLine.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(fullAmountDue)) {
                    throw new Error("Invalid option passed to constructor for ApprovePartialPaymentClientRequest: fullAmountDue is invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(peripheralType)) {
                    throw new Error("Invalid option passed to constructor for ApprovePartialPaymentClientRequest: peripheralType cannot be invalid.");
                }
                else if (peripheralType !== Commerce.Proxy.Entities.PeripheralPaymentType.CardPaymentController
                    && peripheralType !== Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                    throw new Error("Invalid option passed to constructor for ApprovePartialPaymentClientRequest: unsupported peripheralType.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.authorizationPaymentInfo = authorizationPaymentInfo;
                _this.authorizationTenderLine = authorizationTenderLine;
                _this.fullAmountDue = fullAmountDue;
                _this.peripheralType = peripheralType;
                return _this;
            }
            return ApprovePartialPaymentClientRequest;
        }(Commerce.ClientRequest));
        Payments.ApprovePartialPaymentClientRequest = ApprovePartialPaymentClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ApprovePartialPaymentClientResponse = (function (_super) {
            __extends(ApprovePartialPaymentClientResponse, _super);
            function ApprovePartialPaymentClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ApprovePartialPaymentClientResponse;
        }(Commerce.ClientResponse));
        Payments.ApprovePartialPaymentClientResponse = ApprovePartialPaymentClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var AuthorizeCardTokenAndAddToCartClientRequest = (function (_super) {
            __extends(AuthorizeCardTokenAndAddToCartClientRequest, _super);
            function AuthorizeCardTokenAndAddToCartClientRequest(correlationId, cardToken, cardTypeId, tenderTypeId, amountToAuthorize, maskedCardNumber, paymentServiceAccountId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the AuthorizeCardTokenAndAddToCartClientRequest constructor: "
                        + "correlationId cannot be null or undefined.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(cardToken)) {
                    throw new Error("Invalid parameters passed to the AuthorizeCardTokenAndAddToCartClientRequest constructor: "
                        + "cardToken cannot be null or undefined.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(tenderTypeId)) {
                    throw new Error("Invalid parameters passed to the AuthorizeCardTokenAndAddToCartClientRequest constructor: "
                        + "tenderTypeId cannot be null or undefined.");
                }
                else if (Commerce.NumberExtensions.isNullOrNaN(amountToAuthorize)) {
                    throw new Error("Invalid parameters passed to the AuthorizeCardTokenAndAddToCartClientRequest constructor: "
                        + "amountToAuthorize cannot be null or NaN.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cardToken = cardToken;
                _this.cardTypeId = cardTypeId;
                _this.tenderTypeId = tenderTypeId;
                _this.amountToAuthorize = amountToAuthorize;
                _this.maskedCardNumber = maskedCardNumber || Commerce.StringExtensions.EMPTY;
                _this.paymentServiceAccountId = paymentServiceAccountId || null;
                return _this;
            }
            return AuthorizeCardTokenAndAddToCartClientRequest;
        }(Commerce.ClientRequest));
        Payments.AuthorizeCardTokenAndAddToCartClientRequest = AuthorizeCardTokenAndAddToCartClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var AuthorizeCardTokenAndAddToCartClientResponse = (function (_super) {
            __extends(AuthorizeCardTokenAndAddToCartClientResponse, _super);
            function AuthorizeCardTokenAndAddToCartClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return AuthorizeCardTokenAndAddToCartClientResponse;
        }(Commerce.ClientResponse));
        Payments.AuthorizeCardTokenAndAddToCartClientResponse = AuthorizeCardTokenAndAddToCartClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var AuthorizeOrRefundPaymentClientRequest = (function (_super) {
            __extends(AuthorizeOrRefundPaymentClientRequest, _super);
            function AuthorizeOrRefundPaymentClientRequest(correlationId, currencyCode, isManualCardEntry, isSwipe, paymentAmount, peripheralType, tenderInfo, tenderType, cardType, voiceApprovalCode, skipPaymentRecoveryCheck, cardTypeSelectedForTenderDiscount, isExemptFromReturnPolicy) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for AuthorizeOrRefundPaymentClientRequest: correlationId cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(currencyCode)) {
                    throw new Error("Invalid option passed to constructor for AuthorizeOrRefundPaymentClientRequest: currencyCode cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(isManualCardEntry)) {
                    throw new Error("Invalid option passed to constructor for AuthorizeOrRefundPaymentClientRequest: isManualCardEntry cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(isSwipe)) {
                    throw new Error("Invalid option passed to constructor for AuthorizeOrRefundPaymentClientRequest: isSwipe cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(paymentAmount)) {
                    throw new Error("Invalid option passed to constructor for AuthorizeOrRefundPaymentClientRequest: paymentAmount cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(peripheralType)) {
                    throw new Error("Invalid option passed to constructor for AuthorizeOrRefundPaymentClientRequest: peripheralType cannot be invalid.");
                }
                else if (peripheralType !== Commerce.Proxy.Entities.PeripheralPaymentType.CardPaymentController
                    && peripheralType !== Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                    throw new Error("Invalid option passed to constructor for AuthorizeOrRefundPaymentClientRequest: unsupported peripheralType.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(tenderType)) {
                    throw new Error("Invalid option passed to constructor for AuthorizeOrRefundPaymentClientRequest: tenderType cannot be invalid.");
                }
                else if (tenderType.OperationId === Commerce.Proxy.Entities.RetailOperation.PayGiftCertificate
                    && Commerce.StringExtensions.isNullOrWhitespace(tenderType.ConnectorId)) {
                    throw new Error("Invalid option passed to constructor for AuthorizeOrRefundPaymentClientRequest:" +
                        "connectorId is invalid for a payGiftCertificate tender type.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cardType = cardType;
                _this.currencyCode = currencyCode;
                _this.isManualCardEntry = isManualCardEntry;
                _this.isRefundOperation = paymentAmount < 0;
                _this.isSwipe = isSwipe;
                _this.paymentAmount = paymentAmount;
                _this.peripheralType = peripheralType;
                _this.tenderInfo = tenderInfo;
                _this.tenderType = tenderType;
                _this.voiceApprovalCode = voiceApprovalCode;
                _this.skipPaymentRecoveryCheck = skipPaymentRecoveryCheck === true;
                _this.cardTypeSelectedForTenderDiscount = cardTypeSelectedForTenderDiscount;
                _this.isExemptFromReturnPolicy = !Commerce.ObjectExtensions.isNullOrUndefined(isExemptFromReturnPolicy) ? isExemptFromReturnPolicy : false;
                return _this;
            }
            return AuthorizeOrRefundPaymentClientRequest;
        }(Commerce.ClientRequest));
        Payments.AuthorizeOrRefundPaymentClientRequest = AuthorizeOrRefundPaymentClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var AuthorizeOrRefundPaymentClientResponse = (function (_super) {
            __extends(AuthorizeOrRefundPaymentClientResponse, _super);
            function AuthorizeOrRefundPaymentClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return AuthorizeOrRefundPaymentClientResponse;
        }(Commerce.ClientResponse));
        Payments.AuthorizeOrRefundPaymentClientResponse = AuthorizeOrRefundPaymentClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var BeginTransactionClientRequest = (function (_super) {
            __extends(BeginTransactionClientRequest, _super);
            function BeginTransactionClientRequest(correlationId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to BeginTransactionClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                return _this;
            }
            return BeginTransactionClientRequest;
        }(Commerce.ClientRequest));
        Payments.BeginTransactionClientRequest = BeginTransactionClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var BeginTransactionClientResponse = (function (_super) {
            __extends(BeginTransactionClientResponse, _super);
            function BeginTransactionClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return BeginTransactionClientResponse;
        }(Commerce.ClientResponse));
        Payments.BeginTransactionClientResponse = BeginTransactionClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var CheckForRecoveredPaymentTransactionClientRequest = (function (_super) {
        __extends(CheckForRecoveredPaymentTransactionClientRequest, _super);
        function CheckForRecoveredPaymentTransactionClientRequest(correlationId, paymentAmount, allowedActions) {
            var _this = this;
            if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                throw new Error("The constructor of CheckForRecoveredPaymentTransactionClientRequest requires not empty correlationId.");
            }
            _this = _super.call(this, correlationId) || this;
            _this.paymentAmount = paymentAmount;
            _this.allowedActions = allowedActions;
            return _this;
        }
        return CheckForRecoveredPaymentTransactionClientRequest;
    }(Commerce.ClientRequest));
    Commerce.CheckForRecoveredPaymentTransactionClientRequest = CheckForRecoveredPaymentTransactionClientRequest;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var CheckForRecoveredPaymentTransactionClientResponse = (function (_super) {
        __extends(CheckForRecoveredPaymentTransactionClientResponse, _super);
        function CheckForRecoveredPaymentTransactionClientResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CheckForRecoveredPaymentTransactionClientResponse;
    }(Commerce.ClientResponse));
    Commerce.CheckForRecoveredPaymentTransactionClientResponse = CheckForRecoveredPaymentTransactionClientResponse;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ClearMerchantInformationClientResponse = (function (_super) {
            __extends(ClearMerchantInformationClientResponse, _super);
            function ClearMerchantInformationClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ClearMerchantInformationClientResponse;
        }(Commerce.ClientResponse));
        Payments.ClearMerchantInformationClientResponse = ClearMerchantInformationClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ClearMerchantInformationClientRequest = (function (_super) {
            __extends(ClearMerchantInformationClientRequest, _super);
            function ClearMerchantInformationClientRequest(correlationId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to ClearMerchantInformationClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                return _this;
            }
            return ClearMerchantInformationClientRequest;
        }(Commerce.ClientRequest));
        Payments.ClearMerchantInformationClientRequest = ClearMerchantInformationClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ComposeTenderInfoForCardPaymentClientRequest = (function (_super) {
            __extends(ComposeTenderInfoForCardPaymentClientRequest, _super);
            function ComposeTenderInfoForCardPaymentClientRequest(correlationId, cardType, currencyCode, paymentAmount, paymentCard, tenderTypeId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for ComposeTenderInfoForCardPaymentClientRequest: correlationId cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(cardType)) {
                    throw new Error("Invalid option passed to constructor for ComposeTenderInfoForCardPaymentClientRequest: cardType cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(currencyCode)) {
                    throw new Error("Invalid option passed to constructor for ComposeTenderInfoForCardPaymentClientRequest: currencyCode cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(paymentAmount)) {
                    throw new Error("Invalid option passed to constructor for ComposeTenderInfoForCardPaymentClientRequest: paymentAmount cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(paymentCard)) {
                    throw new Error("Invalid option passed to constructor for ComposeTenderInfoForCardPaymentClientRequest: paymentCard cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(tenderTypeId)) {
                    throw new Error("Invalid option passed to constructor for ComposeTenderInfoForCardPaymentClientRequest: tenderTypeId cannot be invalid.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cardType = cardType;
                _this.currencyCode = currencyCode;
                _this.paymentAmount = paymentAmount;
                _this.paymentCard = paymentCard;
                _this.tenderTypeId = tenderTypeId;
                return _this;
            }
            return ComposeTenderInfoForCardPaymentClientRequest;
        }(Commerce.ClientRequest));
        Payments.ComposeTenderInfoForCardPaymentClientRequest = ComposeTenderInfoForCardPaymentClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ComposeTenderInfoForCardPaymentClientResponse = (function (_super) {
            __extends(ComposeTenderInfoForCardPaymentClientResponse, _super);
            function ComposeTenderInfoForCardPaymentClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ComposeTenderInfoForCardPaymentClientResponse;
        }(Commerce.ClientResponse));
        Payments.ComposeTenderInfoForCardPaymentClientResponse = ComposeTenderInfoForCardPaymentClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var CreatePreProcessedTenderLineClientRequest = (function (_super) {
            __extends(CreatePreProcessedTenderLineClientRequest, _super);
            function CreatePreProcessedTenderLineClientRequest(correlationId, cardTypeId, currencyCode, isRefundOperation, paymentInfo, tenderType, tenderLineId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for CreatePreProcessedTenderLineClientRequest: correlationId cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(cardTypeId)) {
                    throw new Error("Invalid option passed to constructor for CreatePreProcessedTenderLineClientRequest: cardTypeId cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(currencyCode)) {
                    throw new Error("Invalid option passed to constructor for CreatePreProcessedTenderLineClientRequest: currencyCode cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(isRefundOperation)) {
                    throw new Error("Invalid option passed to constructor for CreatePreProcessedTenderLineClientRequest: isRefundOperation cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(paymentInfo)) {
                    throw new Error("Invalid option passed to constructor for CreatePreProcessedTenderLineClientRequest: paymentInfo cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(tenderType)) {
                    throw new Error("Invalid option passed to constructor for CreatePreProcessedTenderLineClientRequest: tenderType cannot be invalid.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cardTypeId = cardTypeId;
                _this.currencyCode = currencyCode;
                _this.isRefundOperation = isRefundOperation;
                _this.paymentInfo = paymentInfo;
                _this.tenderType = tenderType;
                _this.tenderLineId = tenderLineId;
                return _this;
            }
            return CreatePreProcessedTenderLineClientRequest;
        }(Commerce.ClientRequest));
        Payments.CreatePreProcessedTenderLineClientRequest = CreatePreProcessedTenderLineClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var CreatePreProcessedTenderLineClientResponse = (function (_super) {
            __extends(CreatePreProcessedTenderLineClientResponse, _super);
            function CreatePreProcessedTenderLineClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CreatePreProcessedTenderLineClientResponse;
        }(Commerce.ClientResponse));
        Payments.CreatePreProcessedTenderLineClientResponse = CreatePreProcessedTenderLineClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetAllCardTypesClientRequest = (function (_super) {
            __extends(GetAllCardTypesClientRequest, _super);
            function GetAllCardTypesClientRequest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetAllCardTypesClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetAllCardTypesClientRequest = GetAllCardTypesClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetAllCardTypesClientResponse = (function (_super) {
            __extends(GetAllCardTypesClientResponse, _super);
            function GetAllCardTypesClientResponse(cardTypes) {
                var _this = _super.call(this, cardTypes) || this;
                _this.cardTypes = cardTypes;
                return _this;
            }
            return GetAllCardTypesClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetAllCardTypesClientResponse = GetAllCardTypesClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetAllowedReturnOptionsClientRequest = (function (_super) {
            __extends(GetAllowedReturnOptionsClientRequest, _super);
            function GetAllowedReturnOptionsClientRequest(correlationId, tenderTypeAmounts) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to GetAllowedReturnOptionsClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderTypeAmounts = tenderTypeAmounts;
                return _this;
            }
            return GetAllowedReturnOptionsClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetAllowedReturnOptionsClientRequest = GetAllowedReturnOptionsClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetAllowedReturnOptionsClientResponse = (function (_super) {
            __extends(GetAllowedReturnOptionsClientResponse, _super);
            function GetAllowedReturnOptionsClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetAllowedReturnOptionsClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetAllowedReturnOptionsClientResponse = GetAllowedReturnOptionsClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetAndProcessCardPaymentAcceptPageResultClientRequest = (function (_super) {
            __extends(GetAndProcessCardPaymentAcceptPageResultClientRequest, _super);
            function GetAndProcessCardPaymentAcceptPageResultClientRequest(correlationId, isTokenizePayment, paymentAmount, resultAccessCode, tenderType, cardType, cardTypeSelectedForTenderDiscount, isExemptFromReturnPolicy) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for GetAndProcessCardPaymentAcceptPageResultClientRequest: "
                        + "correlationId cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(isTokenizePayment)) {
                    throw new Error("Invalid option passed to constructor for GetAndProcessCardPaymentAcceptPageResultClientRequest: "
                        + "isTokenizePayment cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(paymentAmount)) {
                    throw new Error("Invalid option passed to constructor for GetAndProcessCardPaymentAcceptPageResultClientRequest: "
                        + "paymentAmount cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(resultAccessCode)) {
                    throw new Error("Invalid option passed to constructor for GetAndProcessCardPaymentAcceptPageResultClientRequest: "
                        + "resultAccessCode cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(tenderType)) {
                    throw new Error("Invalid option passed to constructor for GetAndProcessCardPaymentAcceptPageResultClientRequest: "
                        + "tenderType cannot be invalid.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.isTokenizePayment = isTokenizePayment;
                _this.paymentAmount = paymentAmount;
                _this.resultAccessCode = resultAccessCode;
                _this.tenderType = tenderType;
                _this.cardType = cardType;
                _this.cardTypeSelectedForTenderDiscount = cardTypeSelectedForTenderDiscount;
                _this.isExemptFromReturnPolicy = !Commerce.ObjectExtensions.isNullOrUndefined(isExemptFromReturnPolicy) ? isExemptFromReturnPolicy : false;
                return _this;
            }
            return GetAndProcessCardPaymentAcceptPageResultClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetAndProcessCardPaymentAcceptPageResultClientRequest = GetAndProcessCardPaymentAcceptPageResultClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetAndProcessCardPaymentAcceptPageResultClientResponse = (function (_super) {
            __extends(GetAndProcessCardPaymentAcceptPageResultClientResponse, _super);
            function GetAndProcessCardPaymentAcceptPageResultClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetAndProcessCardPaymentAcceptPageResultClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetAndProcessCardPaymentAcceptPageResultClientResponse = GetAndProcessCardPaymentAcceptPageResultClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetAndUpdateTenderLineSignatureClientRequest = (function (_super) {
            __extends(GetAndUpdateTenderLineSignatureClientRequest, _super);
            function GetAndUpdateTenderLineSignatureClientRequest(correlationId, tenderLineId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for GetAndUpdateTenderLineSignatureClientRequest: correlationId cannot be null or empty string.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(tenderLineId)) {
                    throw new Error("Invalid option passed to constructor for GetAndUpdateTenderLineSignatureClientRequest: tenderLineId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderLineId = tenderLineId;
                return _this;
            }
            return GetAndUpdateTenderLineSignatureClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetAndUpdateTenderLineSignatureClientRequest = GetAndUpdateTenderLineSignatureClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetAndUpdateTenderLineSignatureClientResponse = (function (_super) {
            __extends(GetAndUpdateTenderLineSignatureClientResponse, _super);
            function GetAndUpdateTenderLineSignatureClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetAndUpdateTenderLineSignatureClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetAndUpdateTenderLineSignatureClientResponse = GetAndUpdateTenderLineSignatureClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetAuthorizationOptionsClientRequest = (function (_super) {
            __extends(GetAuthorizationOptionsClientRequest, _super);
            function GetAuthorizationOptionsClientRequest(correlationId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the GetAuthorizationOptionsClientRequest constructor: "
                        + "correlationId cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                return _this;
            }
            return GetAuthorizationOptionsClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetAuthorizationOptionsClientRequest = GetAuthorizationOptionsClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetAuthorizationOptionsClientResponse = (function (_super) {
            __extends(GetAuthorizationOptionsClientResponse, _super);
            function GetAuthorizationOptionsClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetAuthorizationOptionsClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetAuthorizationOptionsClientResponse = GetAuthorizationOptionsClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetCardPaymentAcceptPointServiceRequest = (function (_super) {
            __extends(GetCardPaymentAcceptPointServiceRequest, _super);
            function GetCardPaymentAcceptPointServiceRequest(correlationId, cardPaymentEnabled, cardTokenizationEnabled) {
                var _this = _super.call(this, correlationId) || this;
                _this.cardPaymentEnabled = cardPaymentEnabled;
                _this.cardTokenizationEnabled = cardTokenizationEnabled;
                return _this;
            }
            return GetCardPaymentAcceptPointServiceRequest;
        }(Commerce.ClientRequest));
        Payments.GetCardPaymentAcceptPointServiceRequest = GetCardPaymentAcceptPointServiceRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetCardPaymentAcceptPointServiceResponse = (function (_super) {
            __extends(GetCardPaymentAcceptPointServiceResponse, _super);
            function GetCardPaymentAcceptPointServiceResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetCardPaymentAcceptPointServiceResponse;
        }(Commerce.ClientResponse));
        Payments.GetCardPaymentAcceptPointServiceResponse = GetCardPaymentAcceptPointServiceResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetCardTypeClientRequest = (function (_super) {
            __extends(GetCardTypeClientRequest, _super);
            function GetCardTypeClientRequest(correlationId, tenderType, cardNumber, cardInfo, isSwipe, retrieveUsingTenderType, cardTypeSelectedForTenderDiscount) {
                var _this = this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(tenderType)) {
                    throw new Error("Invalid parameters passed to the GetCardTypeClientRequest constructor: tenderType cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(cardNumber)) {
                    throw new Error("Invalid parameters passed to the GetCardTypeClientRequest constructor: cardNumber cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(isSwipe)) {
                    throw new Error("Invalid parameters passed to the GetCardTypeClientRequest constructor: isSwipe cannot be null or undefined.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the GetCardTypeClientRequest constructor: correlationId cannot be null or undefined.");
                }
                if ((Commerce.ObjectExtensions.isNullOrUndefined(retrieveUsingTenderType) || !retrieveUsingTenderType)
                    && Commerce.ObjectExtensions.isNullOrUndefined(cardInfo)) {
                    throw new Error("Invalid parameters passed to the GetCardTypeClientRequest constructor: cardInfo cannot be null or undefined when"
                        + " retrieveUsingTenderType is not provided or is false.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cardInfo = cardInfo;
                _this.cardNumber = cardNumber;
                _this.isSwipe = isSwipe;
                _this.tenderType = tenderType;
                _this.retrieveUsingTenderType = Commerce.ObjectExtensions.isNullOrUndefined(retrieveUsingTenderType) ? false : retrieveUsingTenderType;
                _this.cardTypeSelectedForTenderDiscount = cardTypeSelectedForTenderDiscount;
                return _this;
            }
            return GetCardTypeClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetCardTypeClientRequest = GetCardTypeClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetCardTypeClientResponse = (function (_super) {
            __extends(GetCardTypeClientResponse, _super);
            function GetCardTypeClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetCardTypeClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetCardTypeClientResponse = GetCardTypeClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetCashBackAmountClientRequest = (function (_super) {
            __extends(GetCashBackAmountClientRequest, _super);
            function GetCashBackAmountClientRequest(correlationId, cardType, currencyCode) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for GetCashBackAmountClientRequest: correlationId cannot be an invalid string.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(cardType)) {
                    throw new Error("Invalid option passed to constructor for GetCashBackAmountClientRequest: cardType cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(currencyCode)) {
                    throw new Error("Invalid option passed to constructor for GetCashBackAmountClientRequest: currencyCode cannot be invalid.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cardType = cardType;
                _this.currencyCode = currencyCode;
                return _this;
            }
            return GetCashBackAmountClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetCashBackAmountClientRequest = GetCashBackAmountClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetCashBackAmountClientResponse = (function (_super) {
            __extends(GetCashBackAmountClientResponse, _super);
            function GetCashBackAmountClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetCashBackAmountClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetCashBackAmountClientResponse = GetCashBackAmountClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetCurrencyAmountsClientRequest = (function (_super) {
            __extends(GetCurrencyAmountsClientRequest, _super);
            function GetCurrencyAmountsClientRequest(correlationId, amount, retrieveForAllCurrencies) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the GetCurrencyAmountsClientRequest constructor: correlationId cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(amount)) {
                    throw new Error("Invalid parameters passed to the GetCurrencyAmountsClientRequest constructor: amount cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(retrieveForAllCurrencies)) {
                    throw new Error("Invalid parameters passed to the GetCurrencyAmountsClientRequest constructor: " +
                        "retrieveForAllCurrencies cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.amount = amount;
                _this.retrieveForAllCurrencies = retrieveForAllCurrencies;
                return _this;
            }
            return GetCurrencyAmountsClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetCurrencyAmountsClientRequest = GetCurrencyAmountsClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetCurrencyAmountsClientResponse = (function (_super) {
            __extends(GetCurrencyAmountsClientResponse, _super);
            function GetCurrencyAmountsClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetCurrencyAmountsClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetCurrencyAmountsClientResponse = GetCurrencyAmountsClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetDenominationListClientRequest = (function (_super) {
            __extends(GetDenominationListClientRequest, _super);
            function GetDenominationListClientRequest(correlationId, currencyAmount) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the GetDenominationListClientRequest constructor: correlationId cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(currencyAmount)) {
                    throw new Error("Invalid parameters passed to the GetDenominationListClientRequest constructor: currencyAmount cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.currencyAmount = currencyAmount;
                return _this;
            }
            return GetDenominationListClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetDenominationListClientRequest = GetDenominationListClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetDenominationListClientResponse = (function (_super) {
            __extends(GetDenominationListClientResponse, _super);
            function GetDenominationListClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetDenominationListClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetDenominationListClientResponse = GetDenominationListClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetGiftCardByIdClientRequest = (function (_super) {
            __extends(GetGiftCardByIdClientRequest, _super);
            function GetGiftCardByIdClientRequest(correlationId, tenderType, giftCardId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to GetGiftCardByIdClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderType = tenderType;
                _this.giftCardId = giftCardId;
                return _this;
            }
            return GetGiftCardByIdClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetGiftCardByIdClientRequest = GetGiftCardByIdClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetGiftCardByIdClientResponse = (function (_super) {
            __extends(GetGiftCardByIdClientResponse, _super);
            function GetGiftCardByIdClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetGiftCardByIdClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetGiftCardByIdClientResponse = GetGiftCardByIdClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetLoyaltyCardClientRequest = (function (_super) {
            __extends(GetLoyaltyCardClientRequest, _super);
            function GetLoyaltyCardClientRequest(correlationId, defaultLoyaltyCardId) {
                var _this = this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(defaultLoyaltyCardId)) {
                    throw new Error("Invalid parameters passed to the GetLoyaltyCardClientRequest constructor: defaultLoyaltyCardId cannot be null or undefined.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the GetLoyaltyCardClientRequest constructor: correlationId cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.defaultLoyaltyCardId = defaultLoyaltyCardId;
                return _this;
            }
            return GetLoyaltyCardClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetLoyaltyCardClientRequest = GetLoyaltyCardClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetLoyaltyCardClientResponse = (function (_super) {
            __extends(GetLoyaltyCardClientResponse, _super);
            function GetLoyaltyCardClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetLoyaltyCardClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetLoyaltyCardClientResponse = GetLoyaltyCardClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetPinUsingPinPadClientRequest = (function (_super) {
            __extends(GetPinUsingPinPadClientRequest, _super);
            function GetPinUsingPinPadClientRequest(correlationId, cashBackAmount, cardNumber, paymentAmount) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for GetPinUsingPinPadClientRequest: correlationId cannot be an invalid string.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(cashBackAmount)) {
                    throw new Error("Invalid option passed to constructor for GetPinUsingPinPadClientRequest: cashBackAmount cannot be an invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(cardNumber)) {
                    throw new Error("Invalid option passed to constructor for GetPinUsingPinPadClientRequest: cardNumber cannot be an invalid string.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(paymentAmount)) {
                    throw new Error("Invalid option passed to constructor for GetPinUsingPinPadClientRequest: paymentAmount cannot be an invalid.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cashBackAmount = cashBackAmount;
                _this.cardNumber = cardNumber;
                _this.paymentAmount = paymentAmount;
                return _this;
            }
            return GetPinUsingPinPadClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetPinUsingPinPadClientRequest = GetPinUsingPinPadClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetPinUsingPinPadClientResponse = (function (_super) {
            __extends(GetPinUsingPinPadClientResponse, _super);
            function GetPinUsingPinPadClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetPinUsingPinPadClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetPinUsingPinPadClientResponse = GetPinUsingPinPadClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetReturnOptionsClientRequest = (function (_super) {
            __extends(GetReturnOptionsClientRequest, _super);
            function GetReturnOptionsClientRequest(correlationId, tenderTypeId) {
                if (tenderTypeId === void 0) { tenderTypeId = null; }
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the GetReturnOptionsClientRequest constructor: correlation id cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderTypeId = tenderTypeId;
                return _this;
            }
            return GetReturnOptionsClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetReturnOptionsClientRequest = GetReturnOptionsClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetReturnOptionsClientResponse = (function (_super) {
            __extends(GetReturnOptionsClientResponse, _super);
            function GetReturnOptionsClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetReturnOptionsClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetReturnOptionsClientResponse = GetReturnOptionsClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetTenderBasedDiscountClientRequest = (function (_super) {
            __extends(GetTenderBasedDiscountClientRequest, _super);
            function GetTenderBasedDiscountClientRequest(correlationId, tenderType) {
                var _this = this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(tenderType)) {
                    throw new Error("Invalid parameters passed to the GetTenderBasedDiscountClientRequest constructor: tenderType cannot be null or undefined.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the GetTenderBasedDiscountClientRequest constructor: correlationId cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderType = tenderType;
                return _this;
            }
            return GetTenderBasedDiscountClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetTenderBasedDiscountClientRequest = GetTenderBasedDiscountClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetTenderBasedDiscountClientResponse = (function (_super) {
            __extends(GetTenderBasedDiscountClientResponse, _super);
            function GetTenderBasedDiscountClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetTenderBasedDiscountClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetTenderBasedDiscountClientResponse = GetTenderBasedDiscountClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var RefundCaptureTokenAndAddToCartClientRequest = (function (_super) {
            __extends(RefundCaptureTokenAndAddToCartClientRequest, _super);
            function RefundCaptureTokenAndAddToCartClientRequest(correlationId, refundableTenderLine) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the RefundCaptureTokenAndAddToCartClientRequest constructor: "
                        + "correlationId cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(refundableTenderLine)) {
                    throw new Error("Invalid parameters passed to the RefundCaptureTokenAndAddToCartClientRequest constructor: "
                        + "refundableTenderLine cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.refundableTenderLine = refundableTenderLine;
                return _this;
            }
            return RefundCaptureTokenAndAddToCartClientRequest;
        }(Commerce.ClientRequest));
        Payments.RefundCaptureTokenAndAddToCartClientRequest = RefundCaptureTokenAndAddToCartClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var RefundCaptureTokenAndAddToCartClientResponse = (function (_super) {
            __extends(RefundCaptureTokenAndAddToCartClientResponse, _super);
            function RefundCaptureTokenAndAddToCartClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return RefundCaptureTokenAndAddToCartClientResponse;
        }(Commerce.ClientResponse));
        Payments.RefundCaptureTokenAndAddToCartClientResponse = RefundCaptureTokenAndAddToCartClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SaveMerchantInformationClientResponse = (function (_super) {
            __extends(SaveMerchantInformationClientResponse, _super);
            function SaveMerchantInformationClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SaveMerchantInformationClientResponse;
        }(Commerce.ClientResponse));
        Payments.SaveMerchantInformationClientResponse = SaveMerchantInformationClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SaveMerchantInformationClientRequest = (function (_super) {
            __extends(SaveMerchantInformationClientRequest, _super);
            function SaveMerchantInformationClientRequest(correlationId, hardwareProfile) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to SaveMerchantInformationClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.hardwareProfile = hardwareProfile;
                return _this;
            }
            return SaveMerchantInformationClientRequest;
        }(Commerce.ClientRequest));
        Payments.SaveMerchantInformationClientRequest = SaveMerchantInformationClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectAllowedRefundOptionClientRequest = (function (_super) {
            __extends(SelectAllowedRefundOptionClientRequest, _super);
            function SelectAllowedRefundOptionClientRequest(correlationId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for SelectAllowedRefundOptionClientRequest: correlationId cannot be null or empty.");
                }
                _this = _super.call(this, correlationId) || this;
                return _this;
            }
            return SelectAllowedRefundOptionClientRequest;
        }(Commerce.ClientRequest));
        Payments.SelectAllowedRefundOptionClientRequest = SelectAllowedRefundOptionClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectAllowedRefundOptionClientResponse = (function (_super) {
            __extends(SelectAllowedRefundOptionClientResponse, _super);
            function SelectAllowedRefundOptionClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SelectAllowedRefundOptionClientResponse;
        }(Commerce.ClientResponse));
        Payments.SelectAllowedRefundOptionClientResponse = SelectAllowedRefundOptionClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectCardTypeClientRequest = (function (_super) {
            __extends(SelectCardTypeClientRequest, _super);
            function SelectCardTypeClientRequest(correlationId, cardTypes) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the SelectCardTypeClientRequest constructor: correlationId cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(cardTypes)) {
                    throw new Error("Invalid parameters passed to the SelectCardTypeClientRequest constructor: cardTypes cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cardTypes = cardTypes;
                return _this;
            }
            return SelectCardTypeClientRequest;
        }(Commerce.ClientRequest));
        Payments.SelectCardTypeClientRequest = SelectCardTypeClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectCardTypeClientResponse = (function (_super) {
            __extends(SelectCardTypeClientResponse, _super);
            function SelectCardTypeClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SelectCardTypeClientResponse;
        }(Commerce.ClientResponse));
        Payments.SelectCardTypeClientResponse = SelectCardTypeClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectLinkedRefundClientRequest = (function (_super) {
            __extends(SelectLinkedRefundClientRequest, _super);
            function SelectLinkedRefundClientRequest(correlationId, tenderType) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for SelectLinkedRefundClientRequest: correlationId cannot be invalid.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderType = tenderType;
                return _this;
            }
            return SelectLinkedRefundClientRequest;
        }(Commerce.ClientRequest));
        Payments.SelectLinkedRefundClientRequest = SelectLinkedRefundClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectLinkedRefundClientResponse = (function (_super) {
            __extends(SelectLinkedRefundClientResponse, _super);
            function SelectLinkedRefundClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SelectLinkedRefundClientResponse;
        }(Commerce.ClientResponse));
        Payments.SelectLinkedRefundClientResponse = SelectLinkedRefundClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectTransactionPaymentMethodClientRequest = (function (_super) {
            __extends(SelectTransactionPaymentMethodClientRequest, _super);
            function SelectTransactionPaymentMethodClientRequest(correlationId, showOnlyReturnWithoutReceiptTenders) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the SelectTransactionPaymentMethodClientRequest constructor: correlationId cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.showOnlyReturnWithoutReceiptTenders = showOnlyReturnWithoutReceiptTenders;
                return _this;
            }
            return SelectTransactionPaymentMethodClientRequest;
        }(Commerce.ClientRequest));
        Payments.SelectTransactionPaymentMethodClientRequest = SelectTransactionPaymentMethodClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectTransactionPaymentMethodClientResponse = (function (_super) {
            __extends(SelectTransactionPaymentMethodClientResponse, _super);
            function SelectTransactionPaymentMethodClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SelectTransactionPaymentMethodClientResponse;
        }(Commerce.ClientResponse));
        Payments.SelectTransactionPaymentMethodClientResponse = SelectTransactionPaymentMethodClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var TokenizePaymentCardClientRequest = (function (_super) {
            __extends(TokenizePaymentCardClientRequest, _super);
            function TokenizePaymentCardClientRequest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return TokenizePaymentCardClientRequest;
        }(Commerce.ClientRequest));
        Payments.TokenizePaymentCardClientRequest = TokenizePaymentCardClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var TokenizePaymentCardClientResponse = (function (_super) {
            __extends(TokenizePaymentCardClientResponse, _super);
            function TokenizePaymentCardClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return TokenizePaymentCardClientResponse;
        }(Commerce.ClientResponse));
        Payments.TokenizePaymentCardClientResponse = TokenizePaymentCardClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ValidateAndUpdateTenderLineSignatureClientRequest = (function (_super) {
            __extends(ValidateAndUpdateTenderLineSignatureClientRequest, _super);
            function ValidateAndUpdateTenderLineSignatureClientRequest(correlationId, signatureData, tenderLineId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for ValidateAndUpdateTenderLineSignatureClientRequest: correlationId cannot be an invalid string.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(tenderLineId)) {
                    throw new Error("Invalid option passed to constructor for ValidateAndUpdateTenderLineSignatureClientRequest: tenderLineId cannot be an invalid string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.signatureData = signatureData;
                _this.tenderLineId = tenderLineId;
                return _this;
            }
            return ValidateAndUpdateTenderLineSignatureClientRequest;
        }(Commerce.ClientRequest));
        Payments.ValidateAndUpdateTenderLineSignatureClientRequest = ValidateAndUpdateTenderLineSignatureClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ValidateAndUpdateTenderLineSignatureClientResponse = (function (_super) {
            __extends(ValidateAndUpdateTenderLineSignatureClientResponse, _super);
            function ValidateAndUpdateTenderLineSignatureClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ValidateAndUpdateTenderLineSignatureClientResponse;
        }(Commerce.ClientResponse));
        Payments.ValidateAndUpdateTenderLineSignatureClientResponse = ValidateAndUpdateTenderLineSignatureClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var VoidPaymentClientRequest = (function (_super) {
            __extends(VoidPaymentClientRequest, _super);
            function VoidPaymentClientRequest(correlationId, authorizationPaymentInfo, authorizationTenderLine, paymentAmount, peripheralType, voidFailureMessageId, paymentErrors) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for VoidPaymentClientRequest: correlationId cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(authorizationPaymentInfo)) {
                    throw new Error("Invalid option passed to constructor for VoidPaymentClientRequest: authorizationPaymentInfo cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(authorizationTenderLine)) {
                    throw new Error("Invalid option passed to constructor for VoidPaymentClientRequest: authorizationTenderLine cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(paymentAmount)) {
                    throw new Error("Invalid option passed to constructor for VoidPaymentClientRequest: paymentAmount cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(peripheralType)) {
                    throw new Error("Invalid option passed to constructor for VoidPaymentClientRequest: peripheralType cannot be invalid.");
                }
                else if (peripheralType !== Commerce.Proxy.Entities.PeripheralPaymentType.CardPaymentController
                    && peripheralType !== Commerce.Proxy.Entities.PeripheralPaymentType.PaymentTerminal) {
                    throw new Error("Invalid option passed to constructor for VoidPaymentClientRequest: unsupported peripheralType.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(voidFailureMessageId)) {
                    throw new Error("Invalid option passed to constructor for VoidPaymentClientRequest: voidFailureMessageId cannot be invalid.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.authorizationTenderLine = authorizationTenderLine;
                _this.paymentAmount = paymentAmount;
                _this.authorizationPaymentInfo = authorizationPaymentInfo;
                _this.peripheralType = peripheralType;
                _this.voidFailureMessageId = voidFailureMessageId;
                _this.paymentErrors = paymentErrors || null;
                return _this;
            }
            return VoidPaymentClientRequest;
        }(Commerce.ClientRequest));
        Payments.VoidPaymentClientRequest = VoidPaymentClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var VoidPaymentClientResponse = (function (_super) {
            __extends(VoidPaymentClientResponse, _super);
            function VoidPaymentClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return VoidPaymentClientResponse;
        }(Commerce.ClientResponse));
        Payments.VoidPaymentClientResponse = VoidPaymentClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var AddBalanceToGiftCardClientResponse = (function (_super) {
            __extends(AddBalanceToGiftCardClientResponse, _super);
            function AddBalanceToGiftCardClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return AddBalanceToGiftCardClientResponse;
        }(Commerce.ClientResponse));
        Payments.AddBalanceToGiftCardClientResponse = AddBalanceToGiftCardClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var AddBalanceToGiftCardClientRequest = (function (_super) {
            __extends(AddBalanceToGiftCardClientRequest, _super);
            function AddBalanceToGiftCardClientRequest(correlationId, tenderType, giftCardId, amount, currency, lineDescription) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for AddBalanceToGiftCardClientRequest: correlationId cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(giftCardId)) {
                    throw new Error("Invalid option passed to constructor for AddBalanceToGiftCardClientRequest: giftCardId cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(amount)) {
                    throw new Error("Invalid option passed to constructor for AddBalanceToGiftCardClientRequest: amount cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(currency)) {
                    throw new Error("Invalid option passed to constructor for AddBalanceToGiftCardClientRequest: currency cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(lineDescription)) {
                    throw new Error("Invalid option passed to constructor for AddBalanceToGiftCardClientRequest: lineDescription cannot be invalid.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderType = tenderType;
                _this.giftCardId = giftCardId;
                _this.amount = amount;
                _this.currency = currency;
                _this.lineDescription = lineDescription;
                return _this;
            }
            return AddBalanceToGiftCardClientRequest;
        }(Commerce.ClientRequest));
        Payments.AddBalanceToGiftCardClientRequest = AddBalanceToGiftCardClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var CashOutGiftCardClientResponse = (function (_super) {
            __extends(CashOutGiftCardClientResponse, _super);
            function CashOutGiftCardClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CashOutGiftCardClientResponse;
        }(Commerce.ClientResponse));
        Payments.CashOutGiftCardClientResponse = CashOutGiftCardClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var CashOutGiftCardClientRequest = (function (_super) {
            __extends(CashOutGiftCardClientRequest, _super);
            function CashOutGiftCardClientRequest(correlationId, amount, currency, giftCardId, lineDescription, tenderType, extensionTransactionProperties) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for CashOutGiftCardClientRequest: correlationId cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(amount)) {
                    throw new Error("Invalid option passed to constructor for CashOutGiftCardClientRequest: amount cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(currency)) {
                    throw new Error("Invalid option passed to constructor for CashOutGiftCardClientRequest: currency cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(giftCardId)) {
                    throw new Error("Invalid option passed to constructor for CashOutGiftCardClientRequest: giftCardId cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(lineDescription)) {
                    throw new Error("Invalid option passed to constructor for CashOutGiftCardClientRequest: lineDescription cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(tenderType)) {
                    throw new Error("Invalid option passed to constructor for CashOutGiftCardClientRequest: tenderType cannot be invalid.");
                }
                else if (tenderType.OperationId !== Commerce.Proxy.Entities.RetailOperation.PayGiftCertificate) {
                    throw new Error("Invalid option passed to constructor for CashOutGiftCardClientRequest: tenderType operation needs to of type PayByGift.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.amount = amount;
                _this.currency = currency;
                _this.giftCardId = giftCardId;
                _this.lineDescription = lineDescription;
                _this.tenderType = tenderType;
                _this.extensionTransactionProperties = extensionTransactionProperties;
                return _this;
            }
            return CashOutGiftCardClientRequest;
        }(Commerce.ClientRequest));
        Payments.CashOutGiftCardClientRequest = CashOutGiftCardClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetGiftCardClientRequest = (function (_super) {
            __extends(GetGiftCardClientRequest, _super);
            function GetGiftCardClientRequest(correlationId, defaultGiftCardId, isManualEntryAllowed, isExternalGiftCard) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid parameters passed to the GetGiftCardClientRequest constructor: correlationId cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(defaultGiftCardId)) {
                    throw new Error("Invalid parameters passed to the GetGiftCardClientRequest constructor: defaultGiftCardId cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(isManualEntryAllowed)) {
                    throw new Error("Invalid parameters passed to the GetGiftCardClientRequest constructor: isManualEntryAllowed cannot be null or undefined.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(isExternalGiftCard)) {
                    throw new Error("Invalid parameters passed to the GetGiftCardClientRequest constructor: isExternalGiftCard cannot be null or undefined.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.defaultGiftCardId = defaultGiftCardId;
                _this.isExternalGiftCard = isExternalGiftCard;
                _this.isManualEntryAllowed = isManualEntryAllowed;
                return _this;
            }
            return GetGiftCardClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetGiftCardClientRequest = GetGiftCardClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetGiftCardClientResponse = (function (_super) {
            __extends(GetGiftCardClientResponse, _super);
            function GetGiftCardClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetGiftCardClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetGiftCardClientResponse = GetGiftCardClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var IssueGiftCardClientResponse = (function (_super) {
            __extends(IssueGiftCardClientResponse, _super);
            function IssueGiftCardClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return IssueGiftCardClientResponse;
        }(Commerce.ClientResponse));
        Payments.IssueGiftCardClientResponse = IssueGiftCardClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var IssueGiftCardClientRequest = (function (_super) {
            __extends(IssueGiftCardClientRequest, _super);
            function IssueGiftCardClientRequest(correlationId, tenderType, giftCardId, amount, currency, lineDescription) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for IssueGiftCardClientRequest: correlationId cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(giftCardId)) {
                    throw new Error("Invalid option passed to constructor for IssueGiftCardClientRequest: giftCardId cannot be invalid.");
                }
                else if (Commerce.ObjectExtensions.isNullOrUndefined(amount)) {
                    throw new Error("Invalid option passed to constructor for IssueGiftCardClientRequest: amount cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(currency)) {
                    throw new Error("Invalid option passed to constructor for IssueGiftCardClientRequest: currency cannot be invalid.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(lineDescription)) {
                    throw new Error("Invalid option passed to constructor for IssueGiftCardClientRequest: lineDescription cannot be invalid.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderType = tenderType;
                _this.giftCardId = giftCardId;
                _this.amount = amount;
                _this.currency = currency;
                _this.lineDescription = lineDescription;
                return _this;
            }
            return IssueGiftCardClientRequest;
        }(Commerce.ClientRequest));
        Payments.IssueGiftCardClientRequest = IssueGiftCardClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ApprovePartialAmountInputClientRequest = (function (_super) {
            __extends(ApprovePartialAmountInputClientRequest, _super);
            function ApprovePartialAmountInputClientRequest(correlationId, amountAuthorized, amountAuthorizedCurrencyCode, amountRequested, amountRequestedCurrencyCode) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to ApprovePartialAmountInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.amountAuthorized = amountAuthorized;
                _this.amountAuthorizedCurrencyCode = amountAuthorizedCurrencyCode;
                _this.amountRequested = amountRequested;
                _this.amountRequestedCurrencyCode = amountRequestedCurrencyCode;
                return _this;
            }
            return ApprovePartialAmountInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.ApprovePartialAmountInputClientRequest = ApprovePartialAmountInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ApprovePartialAmountInputClientResponse = (function (_super) {
            __extends(ApprovePartialAmountInputClientResponse, _super);
            function ApprovePartialAmountInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ApprovePartialAmountInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.ApprovePartialAmountInputClientResponse = ApprovePartialAmountInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var DisplayPaymentMessageDialogInputClientRequest = (function (_super) {
            __extends(DisplayPaymentMessageDialogInputClientRequest, _super);
            function DisplayPaymentMessageDialogInputClientRequest(correlationId, title, messageText, buttonText) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to DisplayPaymentMessageDialogInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.title = title;
                _this.messageText = messageText;
                _this.buttonText = buttonText;
                return _this;
            }
            return DisplayPaymentMessageDialogInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.DisplayPaymentMessageDialogInputClientRequest = DisplayPaymentMessageDialogInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var DisplayPaymentMessageDialogInputClientResponse = (function (_super) {
            __extends(DisplayPaymentMessageDialogInputClientResponse, _super);
            function DisplayPaymentMessageDialogInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return DisplayPaymentMessageDialogInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.DisplayPaymentMessageDialogInputClientResponse = DisplayPaymentMessageDialogInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetCashBackAmountInputClientRequest = (function (_super) {
            __extends(GetCashBackAmountInputClientRequest, _super);
            function GetCashBackAmountInputClientRequest(correlationId, cashBackAmount, denominations, maximumCashBackAmount) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to GetCashBackAmountInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cashBackAmount = cashBackAmount;
                _this.denominations = denominations;
                _this.maximumCashBackAmount = maximumCashBackAmount;
                return _this;
            }
            return GetCashBackAmountInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetCashBackAmountInputClientRequest = GetCashBackAmountInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetCashBackAmountInputClientResponse = (function (_super) {
            __extends(GetCashBackAmountInputClientResponse, _super);
            function GetCashBackAmountInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetCashBackAmountInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetCashBackAmountInputClientResponse = GetCashBackAmountInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetPaymentOptionInputClientRequest = (function (_super) {
            __extends(GetPaymentOptionInputClientRequest, _super);
            function GetPaymentOptionInputClientRequest(correlationId, title, description, paymentOptions, isCancelAllowed) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to GetPaymentOptionInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.title = title;
                _this.description = description;
                _this.paymentOptions = paymentOptions;
                _this.isCancelAllowed = isCancelAllowed;
                return _this;
            }
            return GetPaymentOptionInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetPaymentOptionInputClientRequest = GetPaymentOptionInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetPaymentOptionInputClientResponse = (function (_super) {
            __extends(GetPaymentOptionInputClientResponse, _super);
            function GetPaymentOptionInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetPaymentOptionInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetPaymentOptionInputClientResponse = GetPaymentOptionInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetSignatureFromDeviceInputClientRequest = (function (_super) {
            __extends(GetSignatureFromDeviceInputClientRequest, _super);
            function GetSignatureFromDeviceInputClientRequest(correlationId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to GetSignatureFromDeviceInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                return _this;
            }
            return GetSignatureFromDeviceInputClientRequest;
        }(Commerce.Request));
        Payments.GetSignatureFromDeviceInputClientRequest = GetSignatureFromDeviceInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetSignatureFromDeviceInputClientResponse = (function (_super) {
            __extends(GetSignatureFromDeviceInputClientResponse, _super);
            function GetSignatureFromDeviceInputClientResponse(signatureData, status) {
                var _this = _super.call(this) || this;
                _this.signatureData = signatureData;
                _this.status = status;
                return _this;
            }
            return GetSignatureFromDeviceInputClientResponse;
        }(Commerce.Response));
        Payments.GetSignatureFromDeviceInputClientResponse = GetSignatureFromDeviceInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetSignatureFromPOSInputClientRequest = (function (_super) {
            __extends(GetSignatureFromPOSInputClientRequest, _super);
            function GetSignatureFromPOSInputClientRequest(correlationId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to GetSignatureFromPOSInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                return _this;
            }
            return GetSignatureFromPOSInputClientRequest;
        }(Commerce.Request));
        Payments.GetSignatureFromPOSInputClientRequest = GetSignatureFromPOSInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetSignatureFromPOSInputClientResponse = (function (_super) {
            __extends(GetSignatureFromPOSInputClientResponse, _super);
            function GetSignatureFromPOSInputClientResponse(signature, status) {
                var _this = _super.call(this) || this;
                _this.signature = signature;
                _this.status = status;
                return _this;
            }
            return GetSignatureFromPOSInputClientResponse;
        }(Commerce.Response));
        Payments.GetSignatureFromPOSInputClientResponse = GetSignatureFromPOSInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectCardTypeForTenderBasedDiscountInputClientRequest = (function (_super) {
            __extends(SelectCardTypeForTenderBasedDiscountInputClientRequest, _super);
            function SelectCardTypeForTenderBasedDiscountInputClientRequest(correlationId, cardTypeListWithTenderDiscount) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to SelectCardTypeForTenderBasedDiscountInputClientRequest:" +
                        " correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cardTypeListWithTenderDiscount = cardTypeListWithTenderDiscount;
                return _this;
            }
            return SelectCardTypeForTenderBasedDiscountInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.SelectCardTypeForTenderBasedDiscountInputClientRequest = SelectCardTypeForTenderBasedDiscountInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectCardTypeForTenderBasedDiscountInputClientResponse = (function (_super) {
            __extends(SelectCardTypeForTenderBasedDiscountInputClientResponse, _super);
            function SelectCardTypeForTenderBasedDiscountInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SelectCardTypeForTenderBasedDiscountInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.SelectCardTypeForTenderBasedDiscountInputClientResponse = SelectCardTypeForTenderBasedDiscountInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectCardTypeInputClientRequest = (function (_super) {
            __extends(SelectCardTypeInputClientRequest, _super);
            function SelectCardTypeInputClientRequest(correlationId, cardTypes) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to SelectCardTypeInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.cardTypes = cardTypes;
                return _this;
            }
            return SelectCardTypeInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.SelectCardTypeInputClientRequest = SelectCardTypeInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectCardTypeInputClientResponse = (function (_super) {
            __extends(SelectCardTypeInputClientResponse, _super);
            function SelectCardTypeInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SelectCardTypeInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.SelectCardTypeInputClientResponse = SelectCardTypeInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectPaymentOptionInputClientRequest = (function (_super) {
            __extends(SelectPaymentOptionInputClientRequest, _super);
            function SelectPaymentOptionInputClientRequest(correlationId, paymentOptions, title, message) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to SelectPaymentOptionInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.paymentOptions = paymentOptions;
                _this.title = title;
                _this.message = message;
                return _this;
            }
            return SelectPaymentOptionInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.SelectPaymentOptionInputClientRequest = SelectPaymentOptionInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectPaymentOptionInputClientResponse = (function (_super) {
            __extends(SelectPaymentOptionInputClientResponse, _super);
            function SelectPaymentOptionInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SelectPaymentOptionInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.SelectPaymentOptionInputClientResponse = SelectPaymentOptionInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectTenderTypeInputClientRequest = (function (_super) {
            __extends(SelectTenderTypeInputClientRequest, _super);
            function SelectTenderTypeInputClientRequest(correlationId, tenderTypes, title, message) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to SelectTenderTypeInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderTypes = tenderTypes;
                _this.title = title;
                _this.message = message;
                return _this;
            }
            return SelectTenderTypeInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.SelectTenderTypeInputClientRequest = SelectTenderTypeInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var SelectTenderTypeInputClientResponse = (function (_super) {
            __extends(SelectTenderTypeInputClientResponse, _super);
            function SelectTenderTypeInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SelectTenderTypeInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.SelectTenderTypeInputClientResponse = SelectTenderTypeInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ValidateSignatureInPOSInputClientRequest = (function (_super) {
            __extends(ValidateSignatureInPOSInputClientRequest, _super);
            function ValidateSignatureInPOSInputClientRequest(correlationId, allowRecapture, signature, allowDecline) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to ValidateSignatureInPOSInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.allowRecapture = allowRecapture;
                _this.signature = signature;
                _this.allowDecline = allowDecline;
                return _this;
            }
            return ValidateSignatureInPOSInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.ValidateSignatureInPOSInputClientRequest = ValidateSignatureInPOSInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ValidateSignatureInPOSInputClientResponse = (function (_super) {
            __extends(ValidateSignatureInPOSInputClientResponse, _super);
            function ValidateSignatureInPOSInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ValidateSignatureInPOSInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.ValidateSignatureInPOSInputClientResponse = ValidateSignatureInPOSInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var AddToGiftCardInputClientRequest = (function (_super) {
            __extends(AddToGiftCardInputClientRequest, _super);
            function AddToGiftCardInputClientRequest(correlationId, tenderTypeId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to AddToGiftCardInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderTypeId = tenderTypeId;
                return _this;
            }
            return AddToGiftCardInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.AddToGiftCardInputClientRequest = AddToGiftCardInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var AddToGiftCardInputClientResponse = (function (_super) {
            __extends(AddToGiftCardInputClientResponse, _super);
            function AddToGiftCardInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return AddToGiftCardInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.AddToGiftCardInputClientResponse = AddToGiftCardInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var CheckGiftCardBalanceInputClientRequest = (function (_super) {
            __extends(CheckGiftCardBalanceInputClientRequest, _super);
            function CheckGiftCardBalanceInputClientRequest(correlationId, tenderTypeId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to CheckGiftCardBalanceInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderTypeId = tenderTypeId;
                return _this;
            }
            return CheckGiftCardBalanceInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.CheckGiftCardBalanceInputClientRequest = CheckGiftCardBalanceInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var CheckGiftCardBalanceInputClientResponse = (function (_super) {
            __extends(CheckGiftCardBalanceInputClientResponse, _super);
            function CheckGiftCardBalanceInputClientResponse(giftCard) {
                var _this = _super.call(this) || this;
                _this.giftCard = giftCard;
                return _this;
            }
            return CheckGiftCardBalanceInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.CheckGiftCardBalanceInputClientResponse = CheckGiftCardBalanceInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetGiftCardInputClientRequest = (function (_super) {
            __extends(GetGiftCardInputClientRequest, _super);
            function GetGiftCardInputClientRequest(correlationId, defaultGiftCardId, descriptionStringResourceId, tenderTypeAllowManualEntry) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to GetGiftCardInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.defaultGiftCardId = defaultGiftCardId;
                _this.descriptionStringResourceId = descriptionStringResourceId;
                _this.tenderTypeAllowManualEntry = tenderTypeAllowManualEntry;
                return _this;
            }
            return GetGiftCardInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetGiftCardInputClientRequest = GetGiftCardInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetGiftCardInputClientResponse = (function (_super) {
            __extends(GetGiftCardInputClientResponse, _super);
            function GetGiftCardInputClientResponse(giftCardId, giftCardEntryType) {
                var _this = _super.call(this) || this;
                _this.giftCardId = giftCardId;
                _this.giftCardEntryType = giftCardEntryType;
                return _this;
            }
            return GetGiftCardInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetGiftCardInputClientResponse = GetGiftCardInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var IssueGiftCardInputClientRequest = (function (_super) {
            __extends(IssueGiftCardInputClientRequest, _super);
            function IssueGiftCardInputClientRequest(correlationId, tenderTypeId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to IssueGiftCardInputClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.tenderTypeId = tenderTypeId;
                return _this;
            }
            return IssueGiftCardInputClientRequest;
        }(Commerce.ClientRequest));
        Payments.IssueGiftCardInputClientRequest = IssueGiftCardInputClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var IssueGiftCardInputClientResponse = (function (_super) {
            __extends(IssueGiftCardInputClientResponse, _super);
            function IssueGiftCardInputClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return IssueGiftCardInputClientResponse;
        }(Commerce.ClientResponse));
        Payments.IssueGiftCardInputClientResponse = IssueGiftCardInputClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetSignatureClientRequest = (function (_super) {
            __extends(GetSignatureClientRequest, _super);
            function GetSignatureClientRequest(correlationId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for GetSignatureClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                return _this;
            }
            return GetSignatureClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetSignatureClientRequest = GetSignatureClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetSignatureClientResponse = (function (_super) {
            __extends(GetSignatureClientResponse, _super);
            function GetSignatureClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetSignatureClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetSignatureClientResponse = GetSignatureClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetSignatureFromDeviceClientRequest = (function (_super) {
            __extends(GetSignatureFromDeviceClientRequest, _super);
            function GetSignatureFromDeviceClientRequest(correlationId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for GetSignatureFromDeviceClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                return _this;
            }
            return GetSignatureFromDeviceClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetSignatureFromDeviceClientRequest = GetSignatureFromDeviceClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetSignatureFromDeviceClientResponse = (function (_super) {
            __extends(GetSignatureFromDeviceClientResponse, _super);
            function GetSignatureFromDeviceClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetSignatureFromDeviceClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetSignatureFromDeviceClientResponse = GetSignatureFromDeviceClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetSignatureFromPOSClientRequest = (function (_super) {
            __extends(GetSignatureFromPOSClientRequest, _super);
            function GetSignatureFromPOSClientRequest(correlationId) {
                var _this = this;
                if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for GetSignatureFromPOSClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                return _this;
            }
            return GetSignatureFromPOSClientRequest;
        }(Commerce.ClientRequest));
        Payments.GetSignatureFromPOSClientRequest = GetSignatureFromPOSClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var GetSignatureFromPOSClientResponse = (function (_super) {
            __extends(GetSignatureFromPOSClientResponse, _super);
            function GetSignatureFromPOSClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return GetSignatureFromPOSClientResponse;
        }(Commerce.ClientResponse));
        Payments.GetSignatureFromPOSClientResponse = GetSignatureFromPOSClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ValidateSignatureClientRequest = (function (_super) {
            __extends(ValidateSignatureClientRequest, _super);
            function ValidateSignatureClientRequest(correlationId, allowRecapture, signatureData, allowDecline) {
                var _this = this;
                if (Commerce.ObjectExtensions.isNullOrUndefined(allowRecapture)) {
                    throw new Error("Invalid option passed to constructor for ValidateSignatureClientRequest: allowRecapture cannot be null or undefined.");
                }
                else if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                    throw new Error("Invalid option passed to constructor for ValidateSignatureClientRequest: correlationId cannot be null or empty string.");
                }
                _this = _super.call(this, correlationId) || this;
                _this.allowRecapture = allowRecapture;
                _this.signatureData = signatureData;
                _this.allowDecline = Commerce.ObjectExtensions.isNullOrUndefined(allowDecline) ? false : allowDecline;
                return _this;
            }
            return ValidateSignatureClientRequest;
        }(Commerce.ClientRequest));
        Payments.ValidateSignatureClientRequest = ValidateSignatureClientRequest;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        "use strict";
        var ValidateSignatureClientResponse = (function (_super) {
            __extends(ValidateSignatureClientResponse, _super);
            function ValidateSignatureClientResponse() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ValidateSignatureClientResponse;
        }(Commerce.ClientResponse));
        Payments.ValidateSignatureClientResponse = ValidateSignatureClientResponse;
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            "use strict";
            var CashOutGiftCardOperationRequest = (function (_super) {
                __extends(CashOutGiftCardOperationRequest, _super);
                function CashOutGiftCardOperationRequest(correlationId, tenderType) {
                    var _this = this;
                    if (Commerce.StringExtensions.isNullOrWhitespace(correlationId)) {
                        throw new Error("Invalid option passed to constructor for CashOutGiftCardOperationRequest: correlationId cannot be invalid.");
                    }
                    else if (Commerce.ObjectExtensions.isNullOrUndefined(tenderType)) {
                        throw new Error("Invalid option passed to constructor for CashOutGiftCardOperationRequest: tenderType cannot be invalid.");
                    }
                    _this = _super.call(this, Commerce.Proxy.Entities.RetailOperation.CashOutGiftCard, correlationId) || this;
                    _this.tenderType = tenderType;
                    _this.skipManagerPermissionChecks = true;
                    return _this;
                }
                return CashOutGiftCardOperationRequest;
            }(Commerce.OperationRequest));
            Operations.CashOutGiftCardOperationRequest = CashOutGiftCardOperationRequest;
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            "use strict";
            var CashOutGiftCardOperationResponse = (function (_super) {
                __extends(CashOutGiftCardOperationResponse, _super);
                function CashOutGiftCardOperationResponse() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CashOutGiftCardOperationResponse;
            }(Commerce.Response));
            Operations.CashOutGiftCardOperationResponse = CashOutGiftCardOperationResponse;
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            "use strict";
            var TokenizedPaymentCardOperationRequest = (function (_super) {
                __extends(TokenizedPaymentCardOperationRequest, _super);
                function TokenizedPaymentCardOperationRequest(correlationId, tenderType) {
                    var _this = _super.call(this, Commerce.Proxy.Entities.RetailOperation.PayCard, correlationId) || this;
                    _this.tenderType = tenderType;
                    _this.skipManagerPermissionChecks = false;
                    return _this;
                }
                return TokenizedPaymentCardOperationRequest;
            }(Commerce.OperationRequest));
            Operations.TokenizedPaymentCardOperationRequest = TokenizedPaymentCardOperationRequest;
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            "use strict";
            var TokenizedPaymentCardOperationResponse = (function (_super) {
                __extends(TokenizedPaymentCardOperationResponse, _super);
                function TokenizedPaymentCardOperationResponse(tokenizedCard) {
                    var _this = _super.call(this) || this;
                    _this.tokenizedCard = tokenizedCard;
                    return _this;
                }
                return TokenizedPaymentCardOperationResponse;
            }(Commerce.Response));
            Operations.TokenizedPaymentCardOperationResponse = TokenizedPaymentCardOperationResponse;
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            "use strict";
            var VoidPaymentOperationRequest = (function (_super) {
                __extends(VoidPaymentOperationRequest, _super);
                function VoidPaymentOperationRequest(correlationId, tenderLines, autoForceVoid) {
                    var _this = _super.call(this, Commerce.Proxy.Entities.RetailOperation.VoidPayment, correlationId) || this;
                    _this.tenderLines = tenderLines;
                    _this.autoForceVoid = autoForceVoid;
                    _this.skipManagerPermissionChecks = true;
                    return _this;
                }
                return VoidPaymentOperationRequest;
            }(Commerce.OperationRequest));
            Operations.VoidPaymentOperationRequest = VoidPaymentOperationRequest;
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    var Payments;
    (function (Payments) {
        var Operations;
        (function (Operations) {
            "use strict";
            var VoidPaymentOperationResponse = (function (_super) {
                __extends(VoidPaymentOperationResponse, _super);
                function VoidPaymentOperationResponse() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return VoidPaymentOperationResponse;
            }(Commerce.Response));
            Operations.VoidPaymentOperationResponse = VoidPaymentOperationResponse;
        })(Operations = Payments.Operations || (Payments.Operations = {}));
    })(Payments = Commerce.Payments || (Commerce.Payments = {}));
})(Commerce || (Commerce = {}));

// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // 76G8pfJNseUlNxz/3vYXvvwMaikZiYa//8CaN0lLJYyg
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
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgJKZm0/eDDnNa
// SIG // R4m3vPJUWsg2MXbh9Xtcjn0I3gaQ0/swgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // CQ305f4Yera0Fg4fr2U/GkvXUyXYO8tKhHihUluB4LKA
// SIG // vSAPrCyBfO5h0DvI3GP67F/173jj1OVr0b8+iLOMX57F
// SIG // Iwg7BU27Xft4wPCpWNRqDZr8/3VFT9jSzw0OmNIk2Y/r
// SIG // aSaGcYwkQUnrC57KNsYnwRAYr54nOQZBfCJ7PJk29iNi
// SIG // 70Y/+Y7Cfl+jYPD1/s61pMDwM6s7yLEYrcgW8n5ISctd
// SIG // SkilPlNpBHaAXxM4iK/38k0YrVa9eB/uYVfbOwT8PRa2
// SIG // BoGiFg2rS23DL0z8iNlYp9tMM7mKDAxUuLlfiqq0LMAX
// SIG // DvkbIWOO8mR3Joj3o/W7tVoXuLysWFa6VKGCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCBAHEmWNdZEPg3p
// SIG // 6Sj9bEoXarHW7YMHTWDS+ydWa006/QIGXz0tUEjkGBMy
// SIG // MDIwMDgyMzA0MDI0OC4xMjVaMASAAgH0oIHQpIHNMIHK
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
// SIG // LwYJKoZIhvcNAQkEMSIEIDcFXep5Plz9Im14r26XaotS
// SIG // o1v/vbXzbvGKLdRPIfSvMIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgNI/QziBTPjokl/FwJFwF4r0UdCzx
// SIG // wOnFVPwEwBNcc4gwgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAQvk+b6Pb0wd0AAAAAAB
// SIG // CzAiBCA5udfQ2Y/UoPJCKg5eTSvEcxnNqgNrUtuCaQTI
// SIG // 3Dd1ozANBgkqhkiG9w0BAQsFAASCAQCUVdZT/TAd05gk
// SIG // JVhv0WWOn1XS1kvJb1muV3/JoP+xJjtH61t4lswr2Tf6
// SIG // GvHdoipmCpuTGIuZnjsCXOAUZW0mnCcnqq4KFb6lNkok
// SIG // jFQuG4zVf1caBGuv1a3jDxPDNMV7RLiugrrbIPW8PoeO
// SIG // 7Ymn+7BSN4+NOCWuQR5F+VzNWSyc4MZxs+nisdHge/EV
// SIG // 7gi18N/nuhfspuF9U1z6l4sRaeyTS5Ja+rSppRpB3GA6
// SIG // SgHachkGxY35fzh/5N6f9v3cZIDC6v1SSU7dol5Y75o7
// SIG // /g+3TEqW06bz4r98MdQ/CWGgYawNnxue5RLmkhP+O6n9
// SIG // hHTMWC2FlP24dMAgovE6
// SIG // End signature block
