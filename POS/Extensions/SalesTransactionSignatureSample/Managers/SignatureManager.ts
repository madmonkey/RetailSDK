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
import { ArrayExtensions, ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";
import { IRegisterableSequentialEvent } from "../../SequentialSignature/Entities/IRegisterableSequentialEvent";
import { FiscalRegistrationSequenceType } from "../../SequentialSignature/Entities/FiscalRegistrationSequenceType";
import { ISignatureRecoveryStrategy } from "../../SequentialSignature/SignatureStrategy/ISignatureRecoveryStrategy";
import { SignatureRecoveryStrategyDefault } from "../../SequentialSignature/SignatureStrategy/SignatureRecoveryStrategyDefault";
import GetSignatureRecoveryStrategyRequest from "../../SequentialSignature/SignatureStrategy/GetSignatureRecoveryStrategyRequest";
import GetSignatureRecoveryStrategyResponse from "../../SequentialSignature/SignatureStrategy/GetSignatureRecoveryStrategyResponse";
import { RegisterableSequentialSalesEvent } from "../Entities/RegisterableSequentialSalesEvent";
import RecoverSignatureOnLogonRequest from "../../SequentialSignature/Messages/RecoverSignatureOnLogonRequest";
import RecoverSignatureOnLogonResponse from "../../SequentialSignature/Messages/RecoverSignatureOnLogonResponse";
import PreSignatureRequest from "../../SequentialSignature/Messages/PreSignatureRequest";
import PreSignatureResponse from "../../SequentialSignature/Messages/PreSignatureResponse";
import PostSignatureRequest from "../../SequentialSignature/Messages/PostSignatureRequest";
import PostSignatureResponse from "../../SequentialSignature/Messages/PostSignatureResponse";

/**
 * Implements Sales transaction signature logic.
 */
export default class SignatureManager {
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
        return this._getSignatureRecoveryStrategy()
            .then((signatureRecoveryStrategy: ISignatureRecoveryStrategy) => {
                let request: RecoverSignatureOnLogonRequest<RecoverSignatureOnLogonResponse> =
                    new RecoverSignatureOnLogonRequest<RecoverSignatureOnLogonResponse>();

                request.sequenceType = FiscalRegistrationSequenceType.Sales;
                request.signatureRecoveryStrategy = signatureRecoveryStrategy;

                return this._extensionContext.runtime.executeAsync<RecoverSignatureOnLogonResponse>(request);
            }).then(() => void 0);
    }

    /**
     * Runs the pre-signature logic.
     * @param {ProxyEntities.Cart} cart The cart.
     * @return {Promise<void>} The cancelable result.
     */
    public preSignature(cart: ProxyEntities.Cart): Promise<void> {
        return this._getSignatureRecoveryStrategy()
            .then((signatureRecoveryStrategy: ISignatureRecoveryStrategy) => {
                let registerableSequenceEvent: IRegisterableSequentialEvent = new RegisterableSequentialSalesEvent(
                    this._extensionContext,
                    signatureRecoveryStrategy, cart.Id
                );

                let request: PreSignatureRequest<PostSignatureResponse> = new PreSignatureRequest<PostSignatureResponse>();
                request.registerableEvent = registerableSequenceEvent;

                return this._extensionContext.runtime.executeAsync<PreSignatureResponse>(request);
            }).then(() => void 0);
    }

    /**
     * Runs the post-signature logic.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order.
     * @return {Promise<void>} The void result.
     */
    public postSignature(salesOrder: ProxyEntities.SalesOrder): Promise<void> {
        let fiscalTransaction: ProxyEntities.FiscalTransaction = ArrayExtensions.firstOrUndefined(
            salesOrder.FiscalTransactions,
            (fiscalTransaction: ProxyEntities.FiscalTransaction) => {
                return !fiscalTransaction.ReceiptCopy && !ObjectExtensions.isNullOrUndefined(fiscalTransaction.RegisterResponse);
            }
        );
        let isSigned: boolean = !ObjectExtensions.isNullOrUndefined(fiscalTransaction);
        let request: PostSignatureRequest<PostSignatureResponse> = new PostSignatureRequest<PostSignatureResponse>();

        request.isSigned = isSigned;
        request.registerResponse = isSigned ? fiscalTransaction.RegisterResponse : StringExtensions.EMPTY;
        request.sequenceType = FiscalRegistrationSequenceType.Sales;

        return this._extensionContext.runtime.executeAsync<PostSignatureResponse>(request)
            .then(() => void 0);
    }

    /**
     * Gets the signature recovery strategy.
     */
    private _getSignatureRecoveryStrategy(): Promise<ISignatureRecoveryStrategy> {
        return this._extensionContext.runtime.executeAsync<GetSignatureRecoveryStrategyResponse>(new GetSignatureRecoveryStrategyRequest())
            .then((result: ClientEntities.ICancelableDataResult<GetSignatureRecoveryStrategyResponse>): ISignatureRecoveryStrategy => {
                return result.data.signatureRecoveryStrategy;
            })
            .catch((reason: any): ISignatureRecoveryStrategy => {
                this._extensionContext.logger.logWarning(
                    "Sequential manager: GetSignatureRecoveryStrategyRequest execution was failed:" + JSON.stringify(reason)
                );

                return new SignatureRecoveryStrategyDefault();
            });
    }
}
