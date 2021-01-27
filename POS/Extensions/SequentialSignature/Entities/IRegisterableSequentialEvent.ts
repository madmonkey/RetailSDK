/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { Entities as DataServiceEntities } from "../Entities/DataServiceEntities.g";
import { FiscalRegistrationSequenceType } from "../Entities/FiscalRegistrationSequenceType";
import { ISignatureRecoveryStrategy } from "../SignatureStrategy/ISignatureRecoveryStrategy";

/**
 * Represents the interface for all registerable sequential events.
 */
export interface IRegisterableSequentialEvent {
    /**
     * Gets the signature recovery strategy.
     * @returns {ISignatureRecoveryStrategy} The signature recovery strategy.
     */
    getSignatureRecoveryStrategy(): ISignatureRecoveryStrategy;

    /**
     * Gets fiscal registration sequence type.
     * @returns {FiscalRegistrationSequenceType} The fiscal registration sequence type.
     */
    getFiscalRegistrationSequenceType(): FiscalRegistrationSequenceType;

    /**
     * Asynchronously updates this event with last signature
     * @param {DataServiceEntities.SequentialSignatureData} sequentialSignatureData The sequential signature data.
     * @returns {Promise<void>} Asynchronous result.
     */
    updateWithLastSignatureAsync(sequentialSignatureData: DataServiceEntities.SequentialSignatureData): Promise<void>;

    /**
     * Gets lock Identifier
     * @returns {string} The lock Identifier.
     */
    getLockId(): string;
}
