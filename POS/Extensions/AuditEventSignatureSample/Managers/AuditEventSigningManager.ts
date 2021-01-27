/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { ArrayExtensions, ObjectExtensions, DateExtensions, StringExtensions } from "PosApi/TypeExtensions";
import { IRegisterableSequentialEvent } from "../../SequentialSignature/Entities/IRegisterableSequentialEvent";
import { FiscalRegistrationSequenceType } from "../../SequentialSignature/Entities/FiscalRegistrationSequenceType";
import { ISignatureRecoveryStrategy } from "../../SequentialSignature/SignatureStrategy/ISignatureRecoveryStrategy";
import { SignatureRecoveryStrategyDefault } from "../../SequentialSignature/SignatureStrategy/SignatureRecoveryStrategyDefault";
import { RegisterableSequentialAuditEvent } from "../Entities/RegisterableSequentialAuditEvent";
import GetSignatureRecoveryStrategyRequest from "../../SequentialSignature/SignatureStrategy/GetSignatureRecoveryStrategyRequest";
import GetSignatureRecoveryStrategyClientResponse from "../../SequentialSignature/SignatureStrategy/GetSignatureRecoveryStrategyResponse";
import RecoverSignatureOnLogonRequest from "../../SequentialSignature/Messages/RecoverSignatureOnLogonRequest";
import RecoverSignatureOnLogonResponse from "../../SequentialSignature/Messages/RecoverSignatureOnLogonResponse";
import PreSignatureRequest from "../../SequentialSignature/Messages/PreSignatureRequest";
import PreSignatureResponse from "../../SequentialSignature/Messages/PreSignatureResponse";
import PostSignatureRequest from "../../SequentialSignature/Messages/PostSignatureRequest";
import PostSignatureResponse from "../../SequentialSignature/Messages/PostSignatureResponse";

/**
 * Implements the aduit event signing logic.
 */
export default class AuditEventSigningManager {
    private _extensionContext: IExtensionContext;

    /**
     * Initializes a new instance of the SignatureManager class.
     * @param {IExtensionContext} extensionContext The extension context contained runtime to execute async requests.
     */
    constructor(extensionContext: IExtensionContext) {
        this._extensionContext = extensionContext;
    }

    /**
     * Runs the logon recovery logic.
     * @return {Promise<void>} The void result.
     */
    public onLogonRecovery(): Promise<void> {
        return this._getSignatureStrategy()
            .then((strategy: ISignatureRecoveryStrategy): Promise<void> => {
                let recoverTechnicalEventRequest: RecoverSignatureOnLogonRequest<RecoverSignatureOnLogonResponse> =
                    new RecoverSignatureOnLogonRequest<RecoverSignatureOnLogonResponse>();

                recoverTechnicalEventRequest.sequenceType = FiscalRegistrationSequenceType.TechnicalEvent;
                recoverTechnicalEventRequest.signatureRecoveryStrategy = strategy;

                let recoverReceiptCopyRequest: RecoverSignatureOnLogonRequest<RecoverSignatureOnLogonResponse> =
                    new RecoverSignatureOnLogonRequest<RecoverSignatureOnLogonResponse>();

                recoverReceiptCopyRequest.sequenceType = FiscalRegistrationSequenceType.ReceiptCopy;
                recoverReceiptCopyRequest.signatureRecoveryStrategy = strategy;

                return Promise.all([
                    this._extensionContext.runtime.executeAsync<RecoverSignatureOnLogonResponse>(recoverTechnicalEventRequest),
                    this._extensionContext.runtime.executeAsync<RecoverSignatureOnLogonResponse>(recoverReceiptCopyRequest)
                ]).then(() => void 0);
            });
    }

    /**
     * Runs the pre-signature logic.
     * @param {ProxyEntities.AuditEvent} auditEvent The audit event.
     * @return {Promise<void>} The cancelable result.
     */
    public preSignature(auditEvent: ProxyEntities.AuditEvent): Promise<void> {
        return this._getSignatureStrategy()
            .then((strategy: ISignatureRecoveryStrategy) => {
                // We need to generate the EventId locally to use it as a lock identifier.
                auditEvent.EventId = this._createEventId();

                let registrableSequentialEvent: IRegisterableSequentialEvent = new RegisterableSequentialAuditEvent(
                    this._extensionContext,
                    strategy,
                    auditEvent);

                let request: PreSignatureRequest<PostSignatureResponse> = new PreSignatureRequest<PostSignatureResponse>();
                request.registerableEvent = registrableSequentialEvent;

                return this._extensionContext.runtime.executeAsync<PreSignatureResponse>(request);
            }).then(() => void 0);
    }

    /**
     * Runs the post-signature logic.
     * @param {ProxyEntities.AuditEvent} auditEvent The audit event.
     * @return {Promise<void>} The void result.
     */
    public postSignature(auditEvent: ProxyEntities.AuditEvent): Promise<void> {
        return this._getSignatureStrategy()
            .then((strategy: ISignatureRecoveryStrategy) => {
                let registrableSequentialEvent: IRegisterableSequentialEvent = new RegisterableSequentialAuditEvent(
                    this._extensionContext,
                    strategy,
                    auditEvent);
                let fiscalTransaction: ProxyEntities.AuditEventFiscalTransaction = ArrayExtensions.firstOrUndefined(
                    auditEvent.FiscalTransactions,
                    (fiscalTransaction: ProxyEntities.AuditEventFiscalTransaction) => {
                        return !ObjectExtensions.isNullOrUndefined(fiscalTransaction.RegisterResponse);
                    }
                );
                let isSigned: boolean = !ObjectExtensions.isNullOrUndefined(fiscalTransaction);
                let request: PostSignatureRequest<PostSignatureResponse> = new PostSignatureRequest<PostSignatureResponse>();

                request.isSigned = isSigned;
                request.registerResponse = isSigned ? fiscalTransaction.RegisterResponse : StringExtensions.EMPTY;
                request.sequenceType = registrableSequentialEvent.getFiscalRegistrationSequenceType();

                return this._extensionContext.runtime.executeAsync<PostSignatureResponse>(request);
            }).then(() => void 0);
    }

    /**
     * Gets the signature strategy.
     */
    private _getSignatureStrategy(): Promise<ISignatureRecoveryStrategy> {
        return this._extensionContext.runtime.executeAsync<GetSignatureRecoveryStrategyClientResponse>(new GetSignatureRecoveryStrategyRequest())
            .then((result: ClientEntities.ICancelableDataResult<GetSignatureRecoveryStrategyClientResponse>): ISignatureRecoveryStrategy => {
                return result.data.signatureRecoveryStrategy;
            })
            .catch((reason: any): ISignatureRecoveryStrategy => {
                return new SignatureRecoveryStrategyDefault();
            });
    }

    /**
     * Creates a new identifier for an audit event.
     * @returns {Number}
     */
    private _createEventId(): number {
        let epochTicks: number = 621355968000000000;
        let ticksPerMillisecond: number = 10000;
        let utcNowMilliseconds: number = DateExtensions.now.getTime();
        let utcNowTicks: number = epochTicks + (utcNowMilliseconds * ticksPerMillisecond);
        return utcNowTicks;
    }
}
