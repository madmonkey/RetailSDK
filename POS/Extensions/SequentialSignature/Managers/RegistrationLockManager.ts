/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { StringExtensions } from "PosApi/TypeExtensions";
import { FiscalRegistrationSequenceType } from "../Entities/FiscalRegistrationSequenceType";

/**
 * Implements getting/setting of registration lock logic.
 */
export class RegistrationLockManager {
    /**
     * Storage keys for submitting event IDs.
     */
    private static readonly SUBMITTING_SALES_ID_KEY: string = "SUBMITTING_SALES_ID_KEY_73E8B26B-C5D5-4F08-8CB2-A7B80AED821C";
    private static readonly SUBMITTING_TECHNICAL_EVENT_ID_KEY: string = "SUBMITTING_TECHNICAL_EVENT_ID_KEY_490FC464-6AE1-451E-96B6-A1B7DE300ECD";
    private static readonly SUBMITTING_RECEIPT_COPY_ID_KEY: string = "SUBMITTING_RECEIPT_COPY_ID_KEY_CC4DA2F3-D3D8-4626-8799-5E01E395AF55";

    /**
     * Gets registration lock of specified type.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     */
    public static getRegistrationLock(sequenceType: FiscalRegistrationSequenceType): string {
        let registrationLock: string = window.localStorage.getItem(RegistrationLockManager.resolveKey(sequenceType));

        return registrationLock;
    }

    /**
     * Sets the registration lock of specified type.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     * @param {string} newValue The new value of registration lock.
     */
    public static setRegistrationLock(sequenceType: FiscalRegistrationSequenceType, newValue: string): void {
        window.localStorage.setItem(RegistrationLockManager.resolveKey(sequenceType), newValue);
    }

    /**
     * Sets the registration lock of specified type.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     */
    public static releaseRegistrationLock(sequenceType: FiscalRegistrationSequenceType): void {
        RegistrationLockManager.setRegistrationLock(sequenceType, StringExtensions.EMPTY);
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
                storageKey = RegistrationLockManager.SUBMITTING_SALES_ID_KEY;
                break;
            case FiscalRegistrationSequenceType.TechnicalEvent:
                storageKey = RegistrationLockManager.SUBMITTING_TECHNICAL_EVENT_ID_KEY;
                break;
            case FiscalRegistrationSequenceType.ReceiptCopy:
                storageKey = RegistrationLockManager.SUBMITTING_RECEIPT_COPY_ID_KEY;
                break;
            default:
                throw "Unsupported fiscal registration sequence type: " + sequenceType;
        }

        return storageKey;
    }
}
