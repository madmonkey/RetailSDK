/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

/**
 * Fiscal register registration of fiscal transaction request.
 */
export interface IFiscalRegistrationRequest {
    FiscalTransaction: IFiscalTransactionInfo;
    Configuration: string;
}

/**
 * Fiscal register transaction type.
 */
export enum FiscalRegisterTransactionType {
    /**
     * Original transaction.
     */
    Original = 0,
    /**
     * Copy of receipt.
     */
    Copy = 1,
}

/**
 * Fiscal register transaction
 * @remarks Provides interface for fiscal transaction data passed in the fiscal registration request.
 */
export interface IFiscalTransactionInfo {
    StoreId: string;
    StoreTaxRegNumber: string;
    TerminalId: string;
    TransactionType: FiscalRegisterTransactionType;
    IsReturn: boolean;
    ReceiptId: string;
    TransactionDate: Date;
    TotalAmount: number;
    TaxLines: IFiscalTaxInfo[];
    TimezoneOffsetInMinutes: number;
}

/**
 * Fiscal register transaction taxes.
 * @remarks Provides interface for fiscal transaction taxes data passed in the fiscal registration request.
 */
export interface IFiscalTaxInfo {
    TaxCode: string;
    TaxAmount: number;
    TaxPercentage: number;
}

/**
 * Fiscal registration results.
 * @remarks Provides interface for retrieving results of the fiscal registration operation on the HW Station fiscal register.
 */
export interface IFiscalRegistrationResults {
    Response: string;
}
