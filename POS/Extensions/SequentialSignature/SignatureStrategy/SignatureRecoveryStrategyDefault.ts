/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IRuntime } from "PosApi/Framework/Runtime";
import { StringExtensions } from "PosApi/TypeExtensions";
import { Entities } from "../Entities/DataServiceEntities.g";
import { StoreOperations } from "../Entities/DataServiceRequests.g";
import { FiscalRegistrationSequenceType } from "../Entities/FiscalRegistrationSequenceType";
import { ISignatureRecoveryStrategy } from "./ISignatureRecoveryStrategy";

/**
 * Default signature recovery strategy implementation.
 */
export class SignatureRecoveryStrategyDefault implements ISignatureRecoveryStrategy {

    private static DEFAULT_SEQUENTIAL_SIGNATURE: Entities.SequentialSignatureData = {
        SequentialNumber: 0,
        Signature: StringExtensions.EMPTY,
        ExtensionProperties: []
    };

    /**
     * Gets default sequential signature for the first signature in sequence.
     */
    public getDefaultSequentialSignature(): Entities.SequentialSignatureData {
        return SignatureRecoveryStrategyDefault.DEFAULT_SEQUENTIAL_SIGNATURE;
    }

    /**
     * Recovers the last signature.
     * @param {IRuntime} runtime The runtime to execute async requests.
     * @param {ProxyEntities.DeviceConfiguration} deviceConfiguration The device configuration.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     * @returns {Promise<Entities.SequentialSignatureData>} The async resilt with SequentialSignatureData.
     */
    public recoverLastSignatureAsync(
        runtime: IRuntime,
        deviceConfiguration: ProxyEntities.DeviceConfiguration,
        sequenceType: FiscalRegistrationSequenceType
    ): Promise<Entities.SequentialSignatureData> {
        return runtime.executeAsync(
            new StoreOperations.GetLastSequentialSignatureRequest(
                deviceConfiguration.StoreNumber,
                deviceConfiguration.TerminalId,
                sequenceType.valueOf()
            )
        ).then((response: ClientEntities.ICancelableDataResult<StoreOperations.GetLastSequentialSignatureResponse>)
            : Entities.SequentialSignatureData => {
            return response.data.result;
        });
    }
}
