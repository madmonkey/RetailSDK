/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

/**
 * Fiscal registration sequence type.
 * Maps to the RetailFiscalRegistrationSequenceType enumeration in AX.
 *
 * @enum {number}
 */
export enum FiscalRegistrationSequenceType {

    /**
     * Fiscal sequence type is not specified.
     */
    None = 0,

    /**
     * Sales transation.
     */
    Sales = 1,

    /**
     * Copy of receipt.
     */
    ReceiptCopy = 2,

    /**
     * Shift closing.
     */
    ShiftClose = 3,

    /**
     * Technical event.
     */
    TechnicalEvent = 4
}
