/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ObjectExtensions } from "PosApi/TypeExtensions";
import { Entities } from "../Entities/DataServiceEntities.g";
import { ISequentialSignatureRegisterableData } from "../Entities/ISequentialSignatureRegisterableData";

/**
 * Implements signature data validation logic.
 */
export class SignatureDataValidationManager {
    /**
     * Checks object is valid sequential signature data.
     * @param {Entities.SequentialSignatureData | ISequentialSignatureRegisterableData} variable The variable storing the sequential signature data.
     */
    public static isValidSequentialSignatureDataObject(variable: Entities.SequentialSignatureData | ISequentialSignatureRegisterableData): boolean {
        return !ObjectExtensions.isNullOrUndefined(variable) &&
            ObjectExtensions.isObject(variable) &&
            ObjectExtensions.isNumber(variable.SequentialNumber) &&
            ObjectExtensions.isString(variable.Signature);
    }
}