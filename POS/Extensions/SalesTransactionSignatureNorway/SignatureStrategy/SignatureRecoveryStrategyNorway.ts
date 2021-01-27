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
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { Entities } from "../../SequentialSignature/Entities/DataServiceEntities.g";
import { StoreOperations } from "../../SequentialSignature/Entities/DataServiceRequests.g";
import { FiscalRegistrationSequenceType } from "../../SequentialSignature/Entities/FiscalRegistrationSequenceType";
import { ISequentialSignatureRegisterableData } from "../../SequentialSignature/Entities/ISequentialSignatureRegisterableData";
import { ISignatureRecoveryStrategy } from "../../SequentialSignature/SignatureStrategy/ISignatureRecoveryStrategy";

/**
 * Norway-specific signature recovery strategy implementation.
 */
export class SignatureRecoveryStrategyNorway implements ISignatureRecoveryStrategy {
    /**
     * Represents the default sequential signature for Norway
     */
    private static DEFAULT_SEQUENTIAL_SIGNATURE: Entities.SequentialSignatureData = {
        SequentialNumber: 0,
        Signature: "0",
        ExtensionProperties: []
    };

    /**
     * Gets default sequential signature for the first signature in sequence.
     */
    public getDefaultSequentialSignature(): Entities.SequentialSignatureData {
        return SignatureRecoveryStrategyNorway.DEFAULT_SEQUENTIAL_SIGNATURE;
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
            new StoreOperations.GetLastFiscalTransactionRequest(deviceConfiguration.StoreNumber, deviceConfiguration.TerminalId)
        ).then((response: ClientEntities.ICancelableDataResult<StoreOperations.GetLastFiscalTransactionResponse>): ProxyEntities.FiscalTransaction => {
            return response.data.result;
        }).then((fiscalTransaction: ProxyEntities.FiscalTransaction): Promise<Entities.SequentialSignatureData> => {
            let lastSequentialSignature: Entities.SequentialSignatureData = null;

            if (!ObjectExtensions.isNullOrUndefined(fiscalTransaction) && !ObjectExtensions.isNullOrUndefined(fiscalTransaction.RegisterResponse)) {
                let signedTransactionData: ISequentialSignatureRegisterableData = JSON.parse(fiscalTransaction.RegisterResponse);

                lastSequentialSignature = {
                    Signature: signedTransactionData.Signature,
                    SequentialNumber: signedTransactionData.SequentialNumber,
                    ExtensionProperties: []
                };
            }

            return Promise.resolve(lastSequentialSignature);
        });
    }
}
