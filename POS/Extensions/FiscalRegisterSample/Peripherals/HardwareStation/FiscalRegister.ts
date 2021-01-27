/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { HardwareStationDeviceActionRequest, HardwareStationDeviceActionResponse } from "PosApi/Consume/Peripherals";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IRuntime } from "PosApi/Framework/Runtime";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { IFiscalRegister } from "./../../Peripherals/IFiscalRegister";
import * as HardwareStation from "./../../Peripherals/HardwareStation/HardwareStationContextExtensions";

/**
 * Interacts with the HW station fiscal register.
 */
export default class FiscalRegister implements IFiscalRegister {
    private static FISCAL_REGISTER_DEVICE_NAME: string = "FiscalRegister";
    private static FISCAL_REGISTER_IS_READY_REQUEST_NAME: string = "IsReady";
    private static FISCAL_REGISTER_REGISTER_FISCAL_TRANSACTION_REQUEST_NAME: string = "RegisterFiscalTransaction";

    private extensionContextRuntime: IRuntime;

    /**
     * Initializes a new instance of the FiscalRegister class.
     * @param {IRuntime} extensionContextRuntime The extension context runtime to execute async requests.
     */
    constructor(extensionContextRuntime: IRuntime) {
        this.extensionContextRuntime = extensionContextRuntime;
    }

    /**
     * Creates a new fiscal transaction registration request.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order to register.
     * @param {HardwareStation.FiscalRegisterTransactionType} fiscalTransactionType Transaction type, original or receipt copy.
     * @param {string} storeTaxRegNumber The store tax identification number.
     * @param {string} fiscalRegisterConfiguration The fiscal register configuration.
     * @return {HardwareStation.IFiscalRegistrationRequest} The created request.
     */
    public static getFiscalRegistrationRequest(
        salesOrder: ProxyEntities.SalesOrder,
        fiscalTransactionType: HardwareStation.FiscalRegisterTransactionType,
        storeTaxRegNumber: string,
        fiscalRegisterConfiguration: string)
        : HardwareStation.IFiscalRegistrationRequest {

        let taxInfos: HardwareStation.IFiscalTaxInfo[] = salesOrder.TaxLines.map((taxLine: ProxyEntities.TaxLine): HardwareStation.IFiscalTaxInfo => {
            let taxInfo: HardwareStation.IFiscalTaxInfo = {
                TaxCode: taxLine.TaxCode,
                TaxAmount: taxLine.Amount,
                TaxPercentage: taxLine.Percentage
            };

            return taxInfo;
        });

        let isSaleReturn: boolean = salesOrder.SalesLines.some((salesLine: ProxyEntities.SalesLine) => {
            return (!ObjectExtensions.isNullOrUndefined(salesLine)
                && !salesLine.IsVoided
                && salesLine.Quantity < 0);
        });

        let fiscalTransaction: HardwareStation.IFiscalTransactionInfo = {
            StoreId: salesOrder.StoreId,
            StoreTaxRegNumber: storeTaxRegNumber,
            TerminalId: salesOrder.TerminalId,
            TransactionType: fiscalTransactionType,
            IsReturn: isSaleReturn,
            ReceiptId: salesOrder.ReceiptId,
            TransactionDate: salesOrder.CreatedDateTime,
            TotalAmount: salesOrder.TotalAmount,
            TaxLines: taxInfos,
            TimezoneOffsetInMinutes: salesOrder.CreatedDateTime.getTimezoneOffset()
        };

        return <HardwareStation.IFiscalRegistrationRequest>{
            FiscalTransaction: fiscalTransaction,
            Configuration: fiscalRegisterConfiguration
        };
    }

    /**
     * Checks if HW station fiscal register is ready for registration operation.
     * @return {Promise<boolean>} True if fiscal printer is ready for registration, otherwise false.
     */
    public isReady(): Promise<boolean> {
        let isReadyRequest: HardwareStationDeviceActionRequest<HardwareStationDeviceActionResponse> =
            new HardwareStationDeviceActionRequest(FiscalRegister.FISCAL_REGISTER_DEVICE_NAME, FiscalRegister.FISCAL_REGISTER_IS_READY_REQUEST_NAME, true);

        return this.extensionContextRuntime.executeAsync(isReadyRequest)
            .then((result: ClientEntities.ICancelableDataResult<HardwareStationDeviceActionResponse>): boolean => {
                return result.data.response;
            });
    }

    /**
     * Registers fiscal transaction on the HW station fiscal register.
     * @param {HardwareStation.IFiscalRegistrationRequest} fiscalRegistrationRequest The fiscal registration request.
     * @return {Promise<HardwareStation.IFiscalRegistrationResults>} The result of the fiscal registration.
     */
    public registerFiscalTransaction(fiscalRegistrationRequest: HardwareStation.IFiscalRegistrationRequest)
        : Promise<HardwareStation.IFiscalRegistrationResults> {
        let registerFiscalTransactionRequest: HardwareStationDeviceActionRequest<HardwareStationDeviceActionResponse> =
            new HardwareStationDeviceActionRequest(FiscalRegister.FISCAL_REGISTER_DEVICE_NAME,
                FiscalRegister.FISCAL_REGISTER_REGISTER_FISCAL_TRANSACTION_REQUEST_NAME, fiscalRegistrationRequest);

        return this.extensionContextRuntime.executeAsync(registerFiscalTransactionRequest)
            .then((result: ClientEntities.ICancelableDataResult<HardwareStationDeviceActionResponse>): HardwareStation.IFiscalRegistrationResults => {
                return result.data.response;
            });
    }
}
