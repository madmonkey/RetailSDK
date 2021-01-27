/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { GetGiftReceiptsClientRequestHandler } from "PosApi/Extend/RequestHandlers/SalesOrdersRequestHandlers";
import { GetGiftReceiptsClientRequest, GetGiftReceiptsClientResponse } from "PosApi/Consume/SalesOrders";
import { ClientEntities } from "PosApi/Entities";

/**
 * Override request handler class for getting gift receipts.
 */
export default class GetGiftReceiptsClientRequestHandlerExt extends GetGiftReceiptsClientRequestHandler {

    /**
     * Executes the request handler asynchronously.
     * @param {GetGiftReceiptsClientRequest<GetGiftReceiptsClientResponse>} The request containing the response.
     * @return {Promise<ICancelableDataResult<GetGiftReceiptsClientResponse>>} The cancelable promise containing the response.
     */
    public executeAsync(request: GetGiftReceiptsClientRequest<GetGiftReceiptsClientResponse>):
        Promise<ClientEntities.ICancelableDataResult<GetGiftReceiptsClientResponse>> {
        if (request.isPreview) {
            // Case of show journal - use default handler
            return this.defaultExecuteAsync(request);
        } else {
            // Case of end transaction - override handler
            let response: Promise<ClientEntities.ICancelableDataResult<GetGiftReceiptsClientResponse>> =
                new Promise<ClientEntities.ICancelableDataResult<GetGiftReceiptsClientResponse>>(
                    (resolve: (date: ClientEntities.ICancelableDataResult<GetGiftReceiptsClientResponse>) => void, reject: (reason?: any) => void) => {
                        this._getGiftReceiptForAllSalesLinesAsync(request, resolve, reject);
                    });

            return response;
        }
    }

    /**
     * Check to see if all the sales lines are selected, if not then call the default handler again.
     * @param {GetGiftReceiptsClientResponse} request The request.
     * @param {(date: ClientEntities.ICancelableDataResult<GetGiftReceiptsClientResponse>) => void} resolve The resolve callback.
     * @param {(reason?: any) => void} reject The reject callback.
     */
    private _getGiftReceiptForAllSalesLinesAsync(request: GetGiftReceiptsClientRequest<GetGiftReceiptsClientResponse>,
        resolve: (date: ClientEntities.ICancelableDataResult<GetGiftReceiptsClientResponse>) => void,
        reject: (reason?: any) => void): void {

        this.defaultExecuteAsync(request).then((value: ClientEntities.ICancelableDataResult<GetGiftReceiptsClientResponse>) => {
            if (value.canceled) {
                resolve({ canceled: true, data: null });
            } else if (request.salesOrder.SalesLines.length !== value.data.result.selectedSalesLines.length) {
                this._getGiftReceiptForAllSalesLinesAsync(request, resolve, reject);
            } else {
                resolve({ canceled: false, data: new GetGiftReceiptsClientResponse(value.data.result) });
            }
        }).catch((reason: any) => {
            reject(reason);
        });
    }
}
