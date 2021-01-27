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
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { Entities as DataServiceEntities } from "../../SequentialSignature/Entities/DataServiceEntities.g";
import { FiscalRegistrationSequenceType } from "../../SequentialSignature/Entities/FiscalRegistrationSequenceType";
import { IRegisterableSequentialEvent } from "../../SequentialSignature/Entities/IRegisterableSequentialEvent";
import { ISignatureRecoveryStrategy } from "../../SequentialSignature/SignatureStrategy/ISignatureRecoveryStrategy";

/**
 * Represents registerable sequential audit event.
 */
export class RegisterableSequentialAuditEvent implements IRegisterableSequentialEvent {
    /**
     *  Audit event extension properties key to store last signature.
     */
    private static readonly LAST_SIGNATURE_KEY_ID: string = "LAST_SIGNATURE_E2D913FA-DC7F-4637-9FAB-3C8051B0708E";

    /**
     *  Audit event extension properties key to store last sequential number.
     */
    private static readonly LAST_SEQUENTIAL_NUMBER_KEY_ID: string = "LAST_SEQUENTIAL_NUMBER_744D9EEF-E3C7-4D8D-9269-2E4807388988";

    private _extensionContext: IExtensionContext;
    private _signatureStrategy: ISignatureRecoveryStrategy;
    private _auditEvent: ProxyEntities.AuditEvent;

    /**
     * Initializes a new instance of the RegisterableSequenceAuditEvent class.
     * @param {IExtensionContext} extensionContext The extension context contained runtime to execute async requests.
     * @param {ISignatureStrategy} strategy The signature strategy.
     * @param {ProxyEntities.AuditEvent} auditEvent The audit event.
     */
    constructor(extensionContext: IExtensionContext, strategy: ISignatureRecoveryStrategy, auditEvent: ProxyEntities.AuditEvent) {
        this._extensionContext = extensionContext;
        this._signatureStrategy = strategy;
        this._auditEvent = auditEvent;
    }

    /**
     * Gets signature strategy.
     * @returns {ISignatureStrategy} The signature strategy.
     */
    public getSignatureRecoveryStrategy(): ISignatureRecoveryStrategy {
        return this._signatureStrategy;
    }

    /**
     * Gets fiscal registration sequence type.
     * @returns {FiscalRegistrationSequenceType} The fiscal registration sequence type.
     */
    public getFiscalRegistrationSequenceType(): FiscalRegistrationSequenceType {
        let auditEventType: number = this._auditEvent.AuditEventTypeValue;
        let result: FiscalRegistrationSequenceType;

        switch (auditEventType) {
            case ClientEntities.ExtensibleAuditEventType.PrintReceiptCopy.Value:
                result = FiscalRegistrationSequenceType.ReceiptCopy;
                break;
            default:
                result = FiscalRegistrationSequenceType.TechnicalEvent;
        }

        return result;
    }

    /**
     * Asynchronously updates this event with last signature.
     * @param {DataServiceEntities.SequentialSignatureData} sequentialSignatureData The sequential signature data.
     * @returns {Promise<void>} Asynchronous result.
     */
    public updateWithLastSignatureAsync(sequentialSignatureData: DataServiceEntities.SequentialSignatureData): Promise<void> {
        let lastSignatureProperty: ProxyEntities.CommerceProperty = {
            Key: RegisterableSequentialAuditEvent.LAST_SIGNATURE_KEY_ID,
            Value: { StringValue: sequentialSignatureData.Signature }
        };

        let lastSequentialNumberProperty: ProxyEntities.CommerceProperty = {
            Key: RegisterableSequentialAuditEvent.LAST_SEQUENTIAL_NUMBER_KEY_ID,
            Value: { LongValue: sequentialSignatureData.SequentialNumber }
        };

        // Sanitize extension properties.
        if (ObjectExtensions.isNullOrUndefined(this._auditEvent.ExtensionProperties)) {
            this._auditEvent.ExtensionProperties = [];
        }

        this._auditEvent.ExtensionProperties.push(lastSignatureProperty, lastSequentialNumberProperty);

        return Promise.resolve();
    }

    /**
     * Gets lock identifier.
     * @returns {string} The lock identifier.
     */
    public getLockId(): string {
        return this._auditEvent.EventId.toString();
    }
}
