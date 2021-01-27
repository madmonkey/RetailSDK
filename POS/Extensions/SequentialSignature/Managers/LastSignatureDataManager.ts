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
import { SignatureDataValidationManager } from "./SignatureDataValidationManager";

/**
 * Implements getting/setting of last used SequentialSignatureData logic.
 */
export class LastSignatureDataManager {
    /**
     * Last sequential signature data key in local storage.
     */
    private static readonly LAST_SALES_TRANSACTION_SEQUENTIAL_SIGNATURE_KEY: string = "LAST_SEQUENTIAL_SIGNATURE_4DDAB597-69E6-41C3-BA63-9FEFCFF3A112";
    private static readonly LAST_TECHNICAL_EVENT_SEQUENTIAL_SIGNATURE_KEY: string
        = "LAST_TECHNICAL_EVENT_SEQUENTIAL_SIGNATURE_015BD413-408F-4ABF-9215-BC2BD0F828FE";
    private static readonly LAST_RECEIPT_PRINT_COPY_SEQUENTIAL_SIGNATURE_KEY: string
        = "LAST_RECEIPT_PRINT_COPY_SEQUENTIAL_SIGNATURE_1A3C8B84-53D5-4BA4-9333-1AFCAF935144";

    /**
     * Gets the last sequential signature data of specified type.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     * @returns {DataServiceEntities.SequentialSignatureData} The last sequential signature data
     */
    public static getLastSequentialSignature(sequenceType: FiscalRegistrationSequenceType): DataServiceEntities.SequentialSignatureData {
        let serializedData: string = window.localStorage.getItem(LastSignatureDataManager.resolveKey(sequenceType));

        // JSON.parse may throw an error
        try {
            let lastSequentialSignature: DataServiceEntities.SequentialSignatureData = JSON.parse(serializedData);

            if (SignatureDataValidationManager.isValidSequentialSignatureDataObject(lastSequentialSignature)) {
                return lastSequentialSignature;
            }
        } catch (error) {
            // Suppress parsing exceptions due to recovery of last signature is implemented.
        }

        return null;
    }

    /**
     * Sets the last sequential signature data of specified type.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     * @param {ISequentialSignatureData} newValue The new value of last sequential signature data.
     */
    public static setLastSequentialSignature(sequenceType: FiscalRegistrationSequenceType, newValue: DataServiceEntities.SequentialSignatureData): void {
        window.localStorage.setItem(LastSignatureDataManager.resolveKey(sequenceType), JSON.stringify(newValue));
    }

    /**
     * Resolves application storage key by fiscal registration sequence type.
     * @param {FiscalRegistrationSequenceType} sequenceType The fiscal registration sequence type to resolve.
     * @return {string} The string key of sequence type in local storage.
     */
    public static resolveKey(sequenceType: FiscalRegistrationSequenceType): string {
        let storageKey: string;
        switch (sequenceType) {
            case FiscalRegistrationSequenceType.Sales:
                storageKey = LastSignatureDataManager.LAST_SALES_TRANSACTION_SEQUENTIAL_SIGNATURE_KEY;
                break;
            case FiscalRegistrationSequenceType.TechnicalEvent:
                storageKey = LastSignatureDataManager.LAST_TECHNICAL_EVENT_SEQUENTIAL_SIGNATURE_KEY;
                break;
            case FiscalRegistrationSequenceType.ReceiptCopy:
                storageKey = LastSignatureDataManager.LAST_RECEIPT_PRINT_COPY_SEQUENTIAL_SIGNATURE_KEY;
                break;
            default:
                throw "Unsupported fiscal registration sequence type: " + sequenceType;
        }

        return storageKey;
    }
}