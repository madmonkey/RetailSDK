/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { SaveExtensionPropertiesOnCartClientRequest } from "PosApi/Consume/Cart";
import { ProxyEntities } from "PosApi/Entities";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { Entities as DataServiceEntities } from "../../SequentialSignature/Entities/DataServiceEntities.g";
import { FiscalRegistrationSequenceType } from "../../SequentialSignature/Entities/FiscalRegistrationSequenceType";
import { IRegisterableSequentialEvent } from "../../SequentialSignature/Entities/IRegisterableSequentialEvent";
import { ISignatureRecoveryStrategy } from "../../SequentialSignature/SignatureStrategy/ISignatureRecoveryStrategy";

/**
 * Represents the registerable sequential sales event.
 */
export class RegisterableSequentialSalesEvent implements IRegisterableSequentialEvent {
    /**
     *  Sales order extension properties key to store last signature.
     */
    private static readonly LAST_SIGNATURE_KEY_ID: string = "LAST_SIGNATURE_E2D913FA-DC7F-4637-9FAB-3C8051B0708E";

    /**
     *  Sales order extension properties key to store last sequential number.
     */
    private static readonly LAST_SEQUENTIAL_NUMBER_KEY_ID: string = "LAST_SEQUENTIAL_NUMBER_744D9EEF-E3C7-4D8D-9269-2E4807388988";

    private _extensionContext: IExtensionContext;
    private _signatureRecoveryStrategy: ISignatureRecoveryStrategy;
    private _lockId: string;

    /**
     * Initializes a new instance of the RegisterableSequentialSalesEvent class.
     * @param {IExtensionContext} extensionContext The extension context contained runtime to execute async requests.
     * @param {ISignatureRecoveryStrategy} signatureRecoveryStrategy The signature recovery strategy.
     * @param {string} lockId The lock identifier.
     */
    constructor(extensionContext: IExtensionContext, signatureRecoveryStrategy: ISignatureRecoveryStrategy, lockId: string) {
        this._extensionContext = extensionContext;
        this._signatureRecoveryStrategy = signatureRecoveryStrategy;
        this._lockId = lockId;
    }

    /**
     * Gets signature recovery strategy.
     * @returns {ISignatureRecoveryStrategy} The signature recovery strategy.
     */
    public getSignatureRecoveryStrategy(): ISignatureRecoveryStrategy {
        return this._signatureRecoveryStrategy;
    }

    /**
     * Gets fiscal registration sequence type.
     * @returns {FiscalRegistrationSequenceType} The fiscal registration sequence type.
     */
    public getFiscalRegistrationSequenceType(): FiscalRegistrationSequenceType {
        return FiscalRegistrationSequenceType.Sales;
    }

    /**
     * Asynchronously updates this event with last signature
     * @param {DataServiceEntities.SequentialSignatureData} sequentialSignatureData The sequential signature data.
     * @returns {Promise<void>} Asynchronous result.
     */
    public updateWithLastSignatureAsync(sequentialSignatureData: DataServiceEntities.SequentialSignatureData): Promise<void> {
        let lastSignatureProperty: ProxyEntities.CommerceProperty = {
            Key: RegisterableSequentialSalesEvent.LAST_SIGNATURE_KEY_ID,
            Value: { StringValue: sequentialSignatureData.Signature }
        };

        let lastSequentialNumberProperty: ProxyEntities.CommerceProperty = {
            Key: RegisterableSequentialSalesEvent.LAST_SEQUENTIAL_NUMBER_KEY_ID,
            Value: { LongValue: sequentialSignatureData.SequentialNumber }
        };

        return this._extensionContext.runtime.executeAsync(new SaveExtensionPropertiesOnCartClientRequest(
            [lastSignatureProperty, lastSequentialNumberProperty]
        )).then(() => {
            return Promise.resolve();
        });
    }

    /**
     * Gets lock identifier
     * @returns {string} The lock identifier.
     */
    public getLockId(): string {
        return this._lockId;
    }
}
