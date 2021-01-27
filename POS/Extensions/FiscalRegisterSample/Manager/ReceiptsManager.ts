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
import { GetReceiptsClientRequest, GetReceiptsClientResponse } from "PosApi/Consume/SalesOrders";
import { RegisterPrintReceiptCopyEventRequest, RegisterPrintReceiptCopyEventResponse } from "PosApi/Consume/SalesOrders";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { ObjectExtensions } from "PosApi/TypeExtensions";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";
import { StringExtensions } from "PosApi/TypeExtensions";
import { PrinterPrintRequest, PrinterPrintResponse } from "PosApi/Consume/Peripherals";

/**
 * Handles receipts generation logic.
 */
export default class ReceiptsManager {

    private static PRINT_RECEIPT_COPY_SOURCE: string = "ReceiptManager.registerPrintReceiptCopyEvent";

    private extensionContext: IExtensionContext;

    /**
     * Initializes a new instance of the FiscalizationManager class.
     * @param {IExtensionContext} extensionContext The extension context runtime to execute async requests.
     */
    constructor(extensionContext: IExtensionContext) {
        this.extensionContext = extensionContext;
    }

    /**
     * Updates and prints the receipts for the specified sales order.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order.
     * @param {{receipt: ProxyEntities.Receipt; printer: ProxyEntities.Printer;}[]} Array of receipt and printer pairs for printing.
     * @return {Promise<ICanceble>} The result of receipts printing.
     */
    public updateAndPrintReceipts(
        salesOrder: ProxyEntities.SalesOrder,
        receiptAndPrinterPairs: {
            receipt: ProxyEntities.Receipt;
            printer: ProxyEntities.Printer;
        }[])
        : Promise<ClientEntities.ICancelable> {

        return this.recreateSalesReceiptsForSalesOrder(salesOrder)
            .then((recreatedReceipts: ProxyEntities.Receipt[]): Promise<ClientEntities.ICancelable> => {
                let receiptsToPrint: ProxyEntities.Receipt[] =
                    receiptAndPrinterPairs.filter(
                        (pair: { receipt: ProxyEntities.Receipt; printer: ProxyEntities.Printer; }) => {
                            return (!ObjectExtensions.isNullOrUndefined(pair) && !ObjectExtensions.isNullOrUndefined(pair.receipt)
                                && pair.receipt.ReceiptTypeValue !== ProxyEntities.ReceiptType.SalesReceipt);
                        })
                        .map(
                        (pair: { receipt: ProxyEntities.Receipt; printer: ProxyEntities.Printer; }) => {
                            return pair.receipt;
                        })
                        .concat(recreatedReceipts);

                let printRequest: PrinterPrintRequest<PrinterPrintResponse> = new PrinterPrintRequest(receiptsToPrint);
                return this.extensionContext.runtime.executeAsync(printRequest);
            });
    }

    /**
     * Registers the receipt copy printing event.
     * @param {ProxyEntities.SalesOrder} salesOrder The sales order.
     * @return {Promise<ICanceble>} The result of receipt copy printing event registration.
     */
    public registerPrintReceiptCopyEvent(salesOrder: ProxyEntities.SalesOrder): Promise<ClientEntities.ICancelable> {
        return this.extensionContext.runtime.executeAsync(new GetDeviceConfigurationClientRequest())
            .then((response: ClientEntities.ICancelableDataResult<GetDeviceConfigurationClientResponse>): Promise<ClientEntities.ICancelable> => {
                let deviceConfiguration: ProxyEntities.DeviceConfiguration = response.data.result;

                if (deviceConfiguration.AuditEnabled) {
                    let registerReceiptCopyEventRequest: RegisterPrintReceiptCopyEventRequest<RegisterPrintReceiptCopyEventResponse> =
                        new RegisterPrintReceiptCopyEventRequest(salesOrder, ReceiptsManager.PRINT_RECEIPT_COPY_SOURCE);
                    return this.extensionContext.runtime.executeAsync(registerReceiptCopyEventRequest);
                } else {
                    return Promise.resolve<ClientEntities.ICancelable>({ canceled: false });
                }
            });
    }

    /**
     * Gets the recreated receipts for a sales order.
     * @param {ProxyEntities.SalesOrder} salesOrder: The sales order.
     * @return {Promise<ProxyEntities.Receipt[]>} The async result with the receipts.
     */
    private recreateSalesReceiptsForSalesOrder(salesOrder: ProxyEntities.SalesOrder): Promise<ProxyEntities.Receipt[]> {
        let salesOrderId: string = StringExtensions.EMPTY;
        let queryBySalesId: boolean = false;

        if (!StringExtensions.isNullOrWhitespace(salesOrder.Id)
            && StringExtensions.compare(salesOrder.Id, salesOrder.SalesId, true) !== 0) {
            salesOrderId = salesOrder.Id;
        } else if (!StringExtensions.isNullOrWhitespace(salesOrder.SalesId)) {
            salesOrderId = salesOrder.SalesId;
            queryBySalesId = true;
        }

        return Promise.all([
            this.extensionContext.runtime.executeAsync(new GetHardwareProfileClientRequest())
                .then((response: ClientEntities.ICancelableDataResult<GetHardwareProfileClientResponse>): ProxyEntities.HardwareProfile => {
                    return response.data.result;
                }),
            this.extensionContext.runtime.executeAsync(new GetDeviceConfigurationClientRequest())
                .then((response: ClientEntities.ICancelableDataResult<GetDeviceConfigurationClientResponse>): ProxyEntities.DeviceConfiguration => {
                    return response.data.result;
                })])
            .then((results: any[]): Promise<ClientEntities.ICancelableDataResult<GetReceiptsClientResponse>> => {
                let hardwareProfile: ProxyEntities.HardwareProfile = results[0];
                let deviceConfiguration: ProxyEntities.DeviceConfiguration = results[1];

                let criteria: ProxyEntities.ReceiptRetrievalCriteria = {
                    IsCopy: true,
                    IsRemoteTransaction: salesOrder.StoreId !== deviceConfiguration.StoreNumber,
                    IsPreview: false,
                    QueryBySalesId: queryBySalesId,
                    ReceiptTypeValue: ProxyEntities.ReceiptType.SalesReceipt,
                    HardwareProfileId: hardwareProfile.ProfileId
                };

                let getReceiptsRequest: GetReceiptsClientRequest<GetReceiptsClientResponse> = new GetReceiptsClientRequest(salesOrderId, criteria);
                return this.extensionContext.runtime.executeAsync(getReceiptsRequest);
            })
            .then((response: ClientEntities.ICancelableDataResult<GetReceiptsClientResponse>): ProxyEntities.Receipt[] => {
                return response.data.result;
            });
    }
}
