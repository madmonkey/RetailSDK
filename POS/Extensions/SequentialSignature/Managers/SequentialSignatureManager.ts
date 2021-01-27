/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { StringExtensions } from "PosApi/TypeExtensions";
import { GetConnectionStatusClientRequest, GetConnectionStatusClientResponse } from "PosApi/Consume/Device";
import { GetDeviceConfigurationClientRequest, GetDeviceConfigurationClientResponse } from "PosApi/Consume/Device";
import { GetOfflinePendingTransactionCountClientRequest, GetOfflinePendingTransactionCountClientResponse } from "PosApi/Consume/StoreOperations";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { StoreOperations } from "../Entities/DataServiceRequests.g";
import { Entities } from "../Entities/DataServiceEntities.g";
import { ISequentialSignatureRegisterableData } from "../Entities/ISequentialSignatureRegisterableData";
import { FiscalRegistrationSequenceType } from "../Entities/FiscalRegistrationSequenceType";
import { IRegisterableSequentialEvent } from "../Entities/IRegisterableSequentialEvent";
import { LastSignatureDataManager } from "./LastSignatureDataManager";
import { RegistrationLockManager } from "./RegistrationLockManager";
import { SignatureDataValidationManager } from "./SignatureDataValidationManager";
import { ISignatureRecoveryStrategy } from "../SignatureStrategy/ISignatureRecoveryStrategy";

/**
 * Implements sequential events signature logic.
 */
export default class SequentialSignatureManager {
    /**
     * String resource IDs.
     */
    private static readonly SIGNATURE_SERVICE_ERROR_RESOURCE_ID: string = "Signature_service_error";
    private static readonly FISCAL_TRANSACTION_PARSING_FAILED_RESOURCE_ID: string = "Fiscal_transaction_parsing_failed";
    private static readonly SIGNATURE_RECOVERY_ERROR_RESOURCE_ID: string = "Signature_recovery_error";

    private _extensionContext: IExtensionContext;

    /**
     * Initializes a new instance of the SignatureManager class.
     * @param {IExtensionContext} extensionContext The extension context contained runtime to execute async requests.
     */
    constructor(extensionContext: IExtensionContext) {
        this._extensionContext = extensionContext;
    }

    /**
     * Runs on logon recovery logic.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     * @param {ISignatureRecoveryStrategy} signatureRecoveryStrategy The signature recovery strategy.
     * @return {Promise<void>} The void result.
     */
    public onLogonRecovery(
        sequenceType: FiscalRegistrationSequenceType,
        signatureRecoveryStrategy: ISignatureRecoveryStrategy
    ): Promise<void> {
        let lastSequentialSignatureData: Entities.SequentialSignatureData =
            LastSignatureDataManager.getLastSequentialSignature(sequenceType);

        if (!ObjectExtensions.isNullOrUndefined(lastSequentialSignatureData)) {
            return Promise.resolve();
        }

        // suppress exceptions due to this recovery is optional and could be done on pre signature.
        return this._lastSignatureFullRecovery(sequenceType, signatureRecoveryStrategy, { suppressExceptions: true });
    }

    /**
     * Runs pre signature logic.
     * @param {IRegisterableSequentialEvent} registarableEvent The registerable sequential event.
     * @return {Promise<void>} The void result.
     */
    public preSignature(registerableEvent: IRegisterableSequentialEvent): Promise<void> {
        let sequenceType: FiscalRegistrationSequenceType = registerableEvent.getFiscalRegistrationSequenceType();

        return this._checkSignatureServiceIsReady()
            .then(() => {
                return this._checkRegistrationLockedAsync(registerableEvent);
            })
            .then((isLocked: boolean) => {
                let lastSequentialSignatureData: Entities.SequentialSignatureData = LastSignatureDataManager.getLastSequentialSignature(sequenceType);

                if (ObjectExtensions.isNullOrUndefined(lastSequentialSignatureData) || isLocked) {
                    return this._lastSignatureFullRecovery(sequenceType, registerableEvent.getSignatureRecoveryStrategy(), { suppressExceptions: false });
                }

                return Promise.resolve();
            })
            .then(() => {
                let lastSequentialSignatureData: Entities.SequentialSignatureData = LastSignatureDataManager.getLastSequentialSignature(sequenceType);

                return registerableEvent.updateWithLastSignatureAsync(lastSequentialSignatureData);
            })
            .then(() => {
                return RegistrationLockManager.setRegistrationLock(sequenceType, registerableEvent.getLockId());
            });
    }

    /**
     * Runs post signature logic.
     * @param {boolean} isSigned The flag indicating whether the registrable event was signed.
     * @param {string} registerResponse The register response.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     * @return {Promise<void>} The void result.
     */
    public postSignature(
        isSigned: boolean,
        registerResponse: string,
        sequenceType: FiscalRegistrationSequenceType): Promise<void> {

        let storeLastSignatureResult: Promise<void>;

        if (isSigned) {
            storeLastSignatureResult = this._storeLastSignatureFromResponse(registerResponse, sequenceType);
        } else {
            storeLastSignatureResult = Promise.resolve();
        }

        return storeLastSignatureResult
            .then(() => {
                this._releaseLock(sequenceType);
            });
    }

    /**
     * Gets the last signature from fiscal transaction and stores it in local storage.
     * @param {string} registerResponse The register response.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     * @return {Promise<void>} The void result.
     */
    private _storeLastSignatureFromResponse(registerResponse: string, sequenceType: FiscalRegistrationSequenceType): Promise<void> {
        let signedTransactionData: ISequentialSignatureRegisterableData;

        try {
            signedTransactionData = JSON.parse(registerResponse);
        } catch (error) {
            let errorMessage: string = this._extensionContext.resources.getString(SequentialSignatureManager.FISCAL_TRANSACTION_PARSING_FAILED_RESOURCE_ID);

            this._extensionContext.logger.logError(errorMessage + " Error:" + JSON.stringify(error));

            return Promise.reject(new ClientEntities.ExtensionError(errorMessage));
        }

        if (!SignatureDataValidationManager.isValidSequentialSignatureDataObject(signedTransactionData)) {
            let errorMessage: string = this._extensionContext.resources.getString(SequentialSignatureManager.FISCAL_TRANSACTION_PARSING_FAILED_RESOURCE_ID);

            this._extensionContext.logger.logError(errorMessage + " Signed transaction data:" + JSON.stringify(signedTransactionData));

            return Promise.reject(new ClientEntities.ExtensionError(errorMessage));
        }

        let lastSequentialSignature: Entities.SequentialSignatureData = {
            Signature: signedTransactionData.Signature,
            SequentialNumber: signedTransactionData.SequentialNumber,
            ExtensionProperties: []
        };

        LastSignatureDataManager.setLastSequentialSignature(sequenceType, lastSequentialSignature);

        return Promise.resolve();
    }

    /**
     * Releases registration lock for the specified sequence type.
     * @param {FiscalRegistrationSequenceType} sequenceType The sequence type.
     * @returns The void result.
     */
    private _releaseLock(sequenceType: FiscalRegistrationSequenceType): void {
        RegistrationLockManager.releaseRegistrationLock(sequenceType);
    }

    /**
     * Ckecks the signature service readiness.
     * @return {Promise<ClientEntities.ICancelable>} The cancelable async result.
     */
    private _checkSignatureServiceIsReady(): Promise<ClientEntities.ICancelable> {
        return this._extensionContext.runtime.executeAsync(
            new StoreOperations.SalesTransactionSignatureServiceIsReadyRequest(this._extensionContext.logger.getNewCorrelationId())
        )
            .then((response: ClientEntities.ICancelableDataResult<StoreOperations.SalesTransactionSignatureServiceIsReadyResponse>)
                : Promise<ClientEntities.ICancelable> => {

                // We should reject the procedure if an incorrect response is received or the service is not ready.
                if (!ObjectExtensions.isNullOrUndefined(response) && !ObjectExtensions.isNullOrUndefined(response.data)
                    && ObjectExtensions.isBoolean(response.data.result) && response.data.result) {
                    return Promise.resolve({ canceled: false });
                }

                let errorMessage: string = this._extensionContext.resources.getString(SequentialSignatureManager.SIGNATURE_SERVICE_ERROR_RESOURCE_ID);

                this._extensionContext.logger.logError(errorMessage + " Response:" + JSON.stringify(response));

                return Promise.reject(new ClientEntities.ExtensionError(errorMessage));

            })
            .catch((reason: any) => {
                let errorMessage: string = this._extensionContext.resources.getString(SequentialSignatureManager.SIGNATURE_SERVICE_ERROR_RESOURCE_ID);

                this._extensionContext.logger.logError(errorMessage + " Error:" + JSON.stringify(reason));

                return Promise.reject(new ClientEntities.ExtensionError(errorMessage));
            });
    }

    /**
     * Checks registration is locked for specified registerable event.
     * @param{IRegisterableSequentialEvent} registerableEvent The registerable event.
     * @returns {Promise<boolean>} The boolean async result.
     */
    private _checkRegistrationLockedAsync(registerableEvent: IRegisterableSequentialEvent): Promise<boolean> {
        // Possibly there was an error if stored sumbitting secuence event id is not empty and different from current ID.
        let sequenceType: FiscalRegistrationSequenceType = registerableEvent.getFiscalRegistrationSequenceType();
        let registrationLock: string = RegistrationLockManager.getRegistrationLock(sequenceType) || StringExtensions.EMPTY;

        // Skip recovery if not required.
        if (StringExtensions.isEmptyOrWhitespace(registrationLock) || registrationLock === registerableEvent.getLockId()) {
            return Promise.resolve(false);
        }

        return Promise.resolve(true);
    }

    /**
     * Recovery the last signature from Channel DB.
     * @param {FiscalRegistrationSequenceType } sequenceType The sequence type.
     * @param {ISignatureRecoveryStrategy} signatureRecoveryStrategy The sequential signature recovery strategy.
     * @param {{ suppressExceptions: boolean }} options Options containing suppress exceptions flag, determines whether it should suppress exceptions or not.
     */
    private _lastSignatureFullRecovery(
        sequenceType: FiscalRegistrationSequenceType,
        signatureRecoveryStrategy: ISignatureRecoveryStrategy,
        options: { suppressExceptions: boolean }
    ): Promise<void> {
        return this._isDatabaseOnlineAndSynced()
            .then((isOnlineAndSynced: boolean): ProxyEntities.DeviceConfiguration => {
                if (!isOnlineAndSynced) {
                    // We can't ensure last signature recovering if DB isn't online and synced.
                    let errorMessage: string = this._extensionContext.resources.getString(SequentialSignatureManager.SIGNATURE_RECOVERY_ERROR_RESOURCE_ID);
                    return Promise.reject(new ClientEntities.ExtensionError(errorMessage));
                }

                return this._extensionContext.runtime.executeAsync(new GetDeviceConfigurationClientRequest())
                    .then((response: ClientEntities.ICancelableDataResult<GetDeviceConfigurationClientResponse>): ProxyEntities.DeviceConfiguration => {
                        return response.data.result;
                    });
            })
            .then((deviceConfiguration: ProxyEntities.DeviceConfiguration): Promise<Entities.SequentialSignatureData> => {
                return signatureRecoveryStrategy.recoverLastSignatureAsync(this._extensionContext.runtime, deviceConfiguration, sequenceType);
            })
            .then((lastSequentialSignature: Entities.SequentialSignatureData): Promise<void> => {
                if (SignatureDataValidationManager.isValidSequentialSignatureDataObject(lastSequentialSignature)) {
                    LastSignatureDataManager.setLastSequentialSignature(sequenceType, lastSequentialSignature);
                } else {
                    LastSignatureDataManager.setLastSequentialSignature(sequenceType, signatureRecoveryStrategy.getDefaultSequentialSignature());
                }

                return Promise.resolve();
            })
            .catch((reason: any) => {
                if (options.suppressExceptions) {
                    this._extensionContext.logger.logWarning(
                        "Sequential signature manager: The recovery was failed, but error is suppressed:" + JSON.stringify(reason)
                    );

                    return Promise.resolve();
                }

                return Promise.reject(reason);
            });
    }

    /**
     * Checks that data base is online and synced.
     * @return {Promise<boolean>} The boolean async result.
     */
    private _isDatabaseOnlineAndSynced(): Promise<boolean> {
        return this._extensionContext.runtime.executeAsync(new GetConnectionStatusClientRequest())
            .then((response: ClientEntities.ICancelableDataResult<GetConnectionStatusClientResponse>): boolean => {
                return response.data.result === ClientEntities.ConnectionStatusType.Online;
            })
            .then((isOnline: boolean): Promise<boolean> => {
                if (isOnline) {
                    return this._checkOfflineDataBaseIsSynced();
                } else {
                    return Promise.resolve(false);
                }
            });
    }

    /**
     * Checks that offline data base is synced.
     * @return {Promise<boolean>} The boolean async result.
     */
    private _checkOfflineDataBaseIsSynced(): Promise<boolean> {
        return this._extensionContext.runtime.executeAsync(new GetOfflinePendingTransactionCountClientRequest())
            .then((response: ClientEntities.ICancelableDataResult<GetOfflinePendingTransactionCountClientResponse>): number => {
                return response.data.result;
            })
            .then((pendingTransactionsCount: number): boolean => {
                return pendingTransactionsCount === 0;
            });
    }
}
