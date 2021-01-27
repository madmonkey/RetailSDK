/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ProxyEntities } from "PosApi/Entities";
import { IRuntime } from "PosApi/Framework/Runtime";
import { Entities } from "../Entities/DataServiceEntities.g";
import { FiscalRegistrationSequenceType } from "../Entities/FiscalRegistrationSequenceType";

/**
 * Signature recovery strategy interface to handle country/region-specific signature recovery logic.
 */
export interface ISignatureRecoveryStrategy {
    /**
     * Gets default sequential signature for the first signature in sequence.
     */
    getDefaultSequentialSignature(): Entities.SequentialSignatureData;

    /**
     * Recovers the last signature.
     * @param {IRuntime} runtime The runtime to execute async requests.
     * @param {ProxyEntities.DeviceConfiguration} deviceConfiguration The device configuration.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     * @returns {Promise<Entities.SequentialSignatureData>} The async result with SequentialSignatureData.
     */
    recoverLastSignatureAsync(
        runtime: IRuntime,
        deviceConfiguration: ProxyEntities.DeviceConfiguration,
        sequenceType: FiscalRegistrationSequenceType
    ): Promise<Entities.SequentialSignatureData>;
}
