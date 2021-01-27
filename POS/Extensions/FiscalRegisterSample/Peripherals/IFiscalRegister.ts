/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as HardwareStation from "./../Peripherals/HardwareStation/HardwareStationContextExtensions";

/**
 * Provides interface for interaction with the HW station fiscal register.
 */
export interface IFiscalRegister {
    /**
     * Checks if HW station fiscal register is ready for registration operation.
     * @return {Promise<boolean>} True if fiscal printer is ready for registration, otherwise false.
     */
    isReady(): Promise<boolean>;

    /**
     * Registers fiscal transaction on the HW station fiscal register.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order to register.
     * @param {HardwareStation.FiscalRegisterTransactionType} fiscalTransactionType Transaction type, original or receipt copy.
     * @return {Promise<Peripherals.HardwareStation.IFiscalRegistrationResults>} The result of the fiscal registration.
     */
    registerFiscalTransaction(fiscalRegistrationRequest: HardwareStation.IFiscalRegistrationRequest): Promise<HardwareStation.IFiscalRegistrationResults>;
}