/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { Response } from "PosApi/Create/RequestHandlers";

/**
 * Operation response of skipping fiscalization.
 */
export default class SkipFiscalizationOperationResponse extends Response {

    /**
     * The staff id who skipped the registration.
     */
    public staffId: string;

    /**
     * Initializes a new instance of the SkipFiscalizationOperationResponse class.
     * @param {string} staffId The staff ID.
     */
    constructor(staffId: string) {
        super();
        this.staffId = staffId;
    }
}