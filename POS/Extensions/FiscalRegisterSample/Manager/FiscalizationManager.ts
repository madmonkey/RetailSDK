/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { GetDeviceConfigurationClientRequest, GetDeviceConfigurationClientResponse } from "PosApi/Consume/Device";
import { GetHardwareProfileClientRequest, GetHardwareProfileClientResponse } from "PosApi/Consume/Device";
import { GetLoggedOnEmployeeClientRequest, GetLoggedOnEmployeeClientResponse } from "PosApi/Consume/Employees";
import { HardwareStationStatusRequest, HardwareStationStatusResponse } from "PosApi/Consume/Peripherals";
import { GetSalesOrdersWithNoFiscalTransactionsRequest, GetSalesOrdersWithNoFiscalTransactionsResponse } from "PosApi/Consume/StoreOperations";
import { SaveFiscalTransactionClientRequest } from "PosApi/Consume/StoreOperations";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { IRuntime } from "PosApi/Framework/Runtime";
import { ArrayExtensions, ObjectExtensions } from "PosApi/TypeExtensions";
import { RunRefiscalizationDialog, RunRefiscalizationDialogResult } from "./../Dialogs/RunRefiscalizationMessageDialog";
import { SkipRefiscalizeDialog, SkipRefiscalizeDialogResult } from "./../Dialogs/SkipRefiscalizeDialog";
import { ConfirmSkipRefiscalizationDialog, ConfirmSkipRefiscalizationDialogResult } from "./../Dialogs/ConfirmSkipRefiscalizationDialog";
import SkipFiscalizationOperationRequest from "./../Operations/SkipFiscalizationOperationRequest";
import SkipFiscalizationOperationResponse from "./../Operations/SkipFiscalizationOperationResponse";
import { IFiscalRegister } from "./../Peripherals/IFiscalRegister";
import FiscalRegister from "./../Peripherals/HardwareStation/FiscalRegister";
import * as HardwareStation from "./../Peripherals/HardwareStation/HardwareStationContextExtensions";
import { ErrorHelper, IErrorWithErrorCode } from "./../Utilities/ErrorHelper";
import { ICancelableRepeatCheck } from "./../Utilities/ICancelableRepeatCheck";

/**
 * Implements fiscalization logic.
 */
export default class FiscalizationManager {
    private static FISCAL_REGISTER_NOT_ENABLED_ERROR_RESOURCE_ID: string = "Fiscal_register_not_enabled_error";
    private static FISCAL_REGISTER_NOT_AVAILABLE_ERROR_RESOURCE_ID: string = "Fiscal_register_not_available_error";

    private extensionContext: IExtensionContext;

    /**
     * Initializes a new instance of the FiscalizationManager class.
     * @param {IExtensionContext} extensionContext The extension context contained runtime to execute async requests.
     */
    constructor(extensionContext: IExtensionContext) {
        this.extensionContext = extensionContext;
    }

    /**
     * Checkes whether fiscal register is ready for fiscalization operation.
     * @return {Promise<void>} The result of fiscal register readyness check.
     */
    public checkReadyForFiscalization(): Promise<void> {
        return this.fiscalRegisterIsEnabled().then((isEnabled: boolean): Promise<void> => {
            if (!isEnabled) {
                return Promise.reject(new ClientEntities.ExtensionError(
                    this.extensionContext.resources.getString(FiscalizationManager.FISCAL_REGISTER_NOT_ENABLED_ERROR_RESOURCE_ID)));
            }

            let fiscalRegister: IFiscalRegister = new FiscalRegister(this.extensionContext.runtime);
            // Checks that HW station fiscal register is ready for registration
            return fiscalRegister.isReady()
                .then((): Promise<void> => {
                    return Promise.resolve();
                })
                .catch((reason: any) => {
                    this.extensionContext.logger.logError("FiscalRegisterSample checkReadyForFiscalization error: " + JSON.stringify(reason));
                    let errors: IErrorWithErrorCode[] = <IErrorWithErrorCode[]>reason;

                    // Errors handled by HardwareStation extension
                    if (!ObjectExtensions.isNullOrUndefined(errors) && ArrayExtensions.hasElements(errors)
                        && ErrorHelper.errorResourceIdEnum.some((resourceId: string) => { return resourceId === errors[0].ErrorCode; })) {

                        return Promise.reject(reason);
                    }

                    return Promise.reject(new ClientEntities.ExtensionError(
                        this.extensionContext.resources.getString(FiscalizationManager.FISCAL_REGISTER_NOT_AVAILABLE_ERROR_RESOURCE_ID)));
                });
        });
    }

    /**
     * Fiscalizes sales order.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order to register.
     * @param {boolean} isCopy Receipt copy flag. True when receipt copy is registered, False when original sales order is registered.
     * @return {Promise<void>} The result of the fiscal registration.
     */
    public fiscalize(salesOrder: ProxyEntities.SalesOrder, isCopy: boolean): Promise<void> {
        return this.fiscalRegisterIsEnabled().then((isEnabled: boolean): Promise<void> => {
            if (!isEnabled) {
                return Promise.reject(new ClientEntities.ExtensionError(
                    this.extensionContext.resources.getString(FiscalizationManager.FISCAL_REGISTER_NOT_ENABLED_ERROR_RESOURCE_ID)));
            }

            let deviceConfiguration: ProxyEntities.DeviceConfiguration;
            let currentEmployee: ProxyEntities.Employee;
            let hardwareProfile: ProxyEntities.HardwareProfile;

            return Promise.all([
                this.extensionContext.runtime.executeAsync(new GetDeviceConfigurationClientRequest())
                    .then((response: ClientEntities.ICancelableDataResult<GetDeviceConfigurationClientResponse>): ProxyEntities.DeviceConfiguration => {
                        return response.data.result;
                    }),
                this.extensionContext.runtime.executeAsync(new GetLoggedOnEmployeeClientRequest())
                    .then((response: ClientEntities.ICancelableDataResult<GetLoggedOnEmployeeClientResponse>): ProxyEntities.Employee => {
                        return response.data.result;
                    }),
                this.extensionContext.runtime.executeAsync(new GetHardwareProfileClientRequest())
                    .then((response: ClientEntities.ICancelableDataResult<GetHardwareProfileClientResponse>): ProxyEntities.HardwareProfile => {
                        return response.data.result;
                    })])
                .then((results: any[]): Promise<HardwareStation.IFiscalRegistrationResults> => {

                    deviceConfiguration = results[0];
                    currentEmployee = results[1];
                    hardwareProfile = results[2];

                    let fiscalRegister: IFiscalRegister = new FiscalRegister(this.extensionContext.runtime);

                    let fiscalTransactionType: HardwareStation.FiscalRegisterTransactionType = isCopy ?
                        HardwareStation.FiscalRegisterTransactionType.Copy :
                        HardwareStation.FiscalRegisterTransactionType.Original;

                    return fiscalRegister.registerFiscalTransaction(
                        FiscalRegister.getFiscalRegistrationRequest(
                            salesOrder,
                            fiscalTransactionType,
                            deviceConfiguration.TaxIdNumber,
                            hardwareProfile.FiscalRegisterConfiguration));
                })
                .then((result: HardwareStation.IFiscalRegistrationResults): Promise<void> => {
                    return this.saveFiscalTransaction(this.packFiscalTransaction(
                        salesOrder, result.Response, isCopy, deviceConfiguration, currentEmployee.StaffId))
                        .then((): Promise<void> => {
                            return Promise.resolve();
                        });
                })
                .catch((reason: any) => {
                    this.extensionContext.logger.logError("FiscalRegisterSample fiscalize error: " + JSON.stringify(reason));
                    let errors: IErrorWithErrorCode[] = <IErrorWithErrorCode[]>reason;

                    // Errors handled by HardwareStation extension
                    if (!ObjectExtensions.isNullOrUndefined(errors) && ArrayExtensions.hasElements(errors)
                        && ErrorHelper.errorResourceIdEnum.some((resourceId: string) => { return resourceId === errors[0].ErrorCode; })) {

                        return Promise.reject(reason);
                    }

                    return Promise.reject(new ClientEntities.ExtensionError(
                        this.extensionContext.resources.getString(FiscalizationManager.FISCAL_REGISTER_NOT_AVAILABLE_ERROR_RESOURCE_ID)));
                });
        });
    }

    /**
     * Check whether all completed transactions are registered.
     * @return {Promise<ClientEntities.ICancelable>} Return cancelable checking result.
     */
    public checkCompletedTransactionsRegistered(): Promise<ClientEntities.ICancelable> {
        return this.checkCompletedTransactionsRegisteredLoop();
    }

    /**
     * Indicates whether fiscal register device is enabled
     * @return {boolean} True if fiscal register device is enabled; otherwise false.
     */
    private fiscalRegisterIsEnabled(): Promise<boolean> {
        return this.extensionContext.runtime.executeAsync(new HardwareStationStatusRequest())
            .then((response: ClientEntities.ICancelableDataResult<HardwareStationStatusResponse>): boolean => {
                return response.data.isActive;
            });
    }

    /**
     * Checks whether all completed transactions are registered in loop while checking repeat is required and not canceled.
     * @return {Promise<ICancelableRepeatCheck>} Return cancelable result.
     */
    private checkCompletedTransactionsRegisteredLoop(): Promise<ICancelableRepeatCheck> {
        return this.checkRefiscalizationRequired().then((result: ICancelableRepeatCheck) => {
            if (!result.canceled && result.repeatCheck) {
                return this.checkCompletedTransactionsRegisteredLoop();
            }

            return Promise.resolve(result);
        });
    }

    /**
     * Checks whether all completed transactions are registered and start refiscalization if required.
     * @return {Promise<ClientEntities.ICancelable>} The cancelable result of checking.
     */
    private checkRefiscalizationRequired(): Promise<ICancelableRepeatCheck> {
        return this.getSalesOrdersWithNoFiscalTransactions()
            .then((salesOrders: ProxyEntities.SalesOrder[]): Promise<ICancelableRepeatCheck> => {
                if (salesOrders.length === 0) {
                    return Promise.resolve({ canceled: false, repeatCheck: false });
                }

                return this.startRefiscalization(salesOrders).then((result: ClientEntities.ICancelable): ICancelableRepeatCheck => {
                    return <ICancelableRepeatCheck>{ canceled: result.canceled, repeatCheck: true };
                });
            });
    }

    /**
     * Get sales orders with no fiscal transasction.
     * @return {Promise<ProxyEntities.SalesOrder[]>} Sales orders with no fiscal transaction.
     */
    private getSalesOrdersWithNoFiscalTransactions(): Promise<ProxyEntities.SalesOrder[]> {
        let runtime: IRuntime = this.extensionContext.runtime;

        return runtime.executeAsync(new GetDeviceConfigurationClientRequest())
            .then((response: ClientEntities.ICancelableDataResult<GetDeviceConfigurationClientResponse>): ProxyEntities.DeviceConfiguration => {
                return response.data.result;
            })
            .then((deviceConfiguration: ProxyEntities.DeviceConfiguration)
                : Promise<ClientEntities.ICancelableDataResult<GetSalesOrdersWithNoFiscalTransactionsResponse>> => {
                return runtime.executeAsync(
                    new GetSalesOrdersWithNoFiscalTransactionsRequest(deviceConfiguration.StoreNumber, deviceConfiguration.TerminalId));
            })
            .then((response: ClientEntities.ICancelableDataResult<GetSalesOrdersWithNoFiscalTransactionsResponse>): ProxyEntities.SalesOrder[] => {
                if (ObjectExtensions.isNullOrUndefined(response) || ObjectExtensions.isNullOrUndefined(response.data)) {
                    return [];
                }

                return response.data.result;
            });
    }

    /**
     * Show message dialog and start refiscalization if required.
     * @param {ProxyEntities.SalesOrder[]} salesOrders Sales orders to register.
     * @return {Promise<ClientEntities.ICancelable>} The cancelable result of the fiscal registration.
     */
    private startRefiscalization(salesOrders: ProxyEntities.SalesOrder[]): Promise<ClientEntities.ICancelable> {
        return RunRefiscalizationDialog.show(this.extensionContext, salesOrders.length)
            .then((result: RunRefiscalizationDialogResult): Promise<ClientEntities.ICancelable> => {
                if (result !== RunRefiscalizationDialogResult.OkResult) {
                    return Promise.resolve({ canceled: true });
                }

                let promiseExecutionSequence: Promise<ClientEntities.ICancelable> = Promise.resolve({ canceled: false });
                salesOrders.forEach((salesOrder: ProxyEntities.SalesOrder) => {
                    promiseExecutionSequence = promiseExecutionSequence.then((result: ClientEntities.ICancelable): Promise<ClientEntities.ICancelable> => {
                        if (result.canceled) {
                            return Promise.resolve(result);
                        }

                        return this.fiscalize(salesOrder, false)
                            .then((): Promise<ClientEntities.ICancelable> => {
                                return Promise.resolve({ canceled: false });
                            })
                            .catch(() => {
                                return this.onFiscalizeError(salesOrder);
                            });
                    });
                });

                return promiseExecutionSequence;
            });
    }

    /**
     * Handle fiscal register error while refiscalize.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order raised the fiscal register error.
     * @return {Promise<ClientEntities.ICancelable>} The cancelable result of the fiscal register error handling .
     */
    private onFiscalizeError(salesOrder: ProxyEntities.SalesOrder): Promise<ClientEntities.ICancelable> {
        return SkipRefiscalizeDialog.show(this.extensionContext, salesOrder)
            .then((result: SkipRefiscalizeDialogResult): Promise<ClientEntities.ICancelable> => {
                if (result !== SkipRefiscalizeDialogResult.SkipResult) {
                    return Promise.resolve({ canceled: true });
                }

                return this.skipFiscalize(salesOrder)
                    .then((response: ClientEntities.ICancelable): ClientEntities.ICancelable => {
                        return { canceled: response.canceled };
                    });
            });
    }

    /**
     * Skip fiscalization.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order relaited to fiscal register error.
     * @return {Promise<ClientEntities.ICancelable>} The cancelable result of the fiscal register error handling.
     */
    private skipFiscalize(salesOrder: ProxyEntities.SalesOrder): Promise<ClientEntities.ICancelable> {
        let staffId: string;

        let request: SkipFiscalizationOperationRequest<SkipFiscalizationOperationResponse> = new SkipFiscalizationOperationRequest(
            this.extensionContext.extensionPackageInfo.id);
        return this.extensionContext.runtime.executeAsync(request)
            .then((response: ClientEntities.ICancelableDataResult<SkipFiscalizationOperationResponse>) => {
                staffId = response.data.staffId;

                return ConfirmSkipRefiscalizationDialog.show(this.extensionContext, salesOrder);
            })
            .then((result: ConfirmSkipRefiscalizationDialogResult): Promise<ClientEntities.ICancelable> => {
                if (result !== ConfirmSkipRefiscalizationDialogResult.OkResult) {
                    return Promise.resolve({ canceled: true });
                }

                return this.manualFiscalization(salesOrder, staffId);
            });
    }

    /**
     * Manual fiscalization by signing off by manager or allowed operator.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order relaited to fiscal register error.
     * @param {string} staffIdSignedOff The staffId of signed off operator.
     * @return {Promise<ClientEntities.ICancelable>} The cancelable result of the fiscal register error handling.
     */
    private manualFiscalization(salesOrder: ProxyEntities.SalesOrder, staffIdSignedOff: string): Promise<ClientEntities.ICancelable> {
        let fiscalRegisterResponse: any = {};
        fiscalRegisterResponse.ControlCode = "Manual";
        fiscalRegisterResponse.DeviceId = staffIdSignedOff;
        let fiscalRegisterResponseString: string = JSON.stringify(fiscalRegisterResponse);

        return Promise.all([
            this.extensionContext.runtime.executeAsync(new GetDeviceConfigurationClientRequest())
                .then((response: ClientEntities.ICancelableDataResult<GetDeviceConfigurationClientResponse>): ProxyEntities.DeviceConfiguration => {
                    return response.data.result;
                }),
            this.extensionContext.runtime.executeAsync(new GetLoggedOnEmployeeClientRequest())
                .then((response: ClientEntities.ICancelableDataResult<GetLoggedOnEmployeeClientResponse>): ProxyEntities.Employee => {
                    return response.data.result;
                })])
            .then((results: any[]): Promise<ClientEntities.ICancelable> => {
                let deviceConfiguration: ProxyEntities.DeviceConfiguration = results[0];
                let currentEmployee: ProxyEntities.Employee = results[1];

                return this.saveFiscalTransaction(this.packFiscalTransaction(
                    salesOrder, fiscalRegisterResponseString, false, deviceConfiguration, currentEmployee.StaffId));
            });
    }

    /**
     * Packs the fiscal transaction.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order relaited to fiscal register error.
     * @param {string} fiscalRegisterResponse The staffId of signed off operator.
     * @param {boolean} isCopy The receipt is duplicate flag.
     * @param {ProxyEntities.DeviceConfiguration} deviceConfiguration The device configuration.
     * @param {string} staffId The curent operator staffId.
     * @return {ProxyEntities.FiscalTransaction} The packed fiscalTransaction.
     */
    private packFiscalTransaction(
        salesOrder: ProxyEntities.SalesOrder,
        fiscalRegisterResponse: string,
        isCopy: boolean,
        deviceConfiguration: ProxyEntities.DeviceConfiguration,
        staffId: string)
        : ProxyEntities.FiscalTransaction {
        return {
            StoreId: salesOrder.StoreId,
            TerminalId: salesOrder.TerminalId,
            TransactionId: salesOrder.Id,
            LineNumber: 1,
            RegisterResponse: fiscalRegisterResponse,
            ReceiptCopy: isCopy,
            RegisterStoreId: deviceConfiguration.StoreNumber,
            RegisterTerminalId: deviceConfiguration.TerminalId,
            StaffId: staffId
        };
    }

    /**
     * Save the fiscal transaction.
     * @param {ProxyEntities.FiscalTransaction} fiscalTransaction The fiscal transaction to save.
     * @return {Promise<ClientEntities.ICancelable>} The cancelable result of the fiscal transaction saving.
     */
    private saveFiscalTransaction(fiscalTransaction: ProxyEntities.FiscalTransaction): Promise<ClientEntities.ICancelable> {
        return this.extensionContext.runtime.executeAsync(new SaveFiscalTransactionClientRequest(fiscalTransaction));
    }
}
