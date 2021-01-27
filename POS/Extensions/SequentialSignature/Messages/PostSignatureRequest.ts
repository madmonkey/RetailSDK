/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ExtensionRequestBase } from "PosApi/Create/RequestHandlers";
import { FiscalRegistrationSequenceType } from "../Entities/FiscalRegistrationSequenceType";
import PostSignatureResponse from "./PostSignatureResponse";

/**
 * The request to execute post signature logic.
 */
export default class PostSignatureRequest<TResponse extends PostSignatureResponse> extends ExtensionRequestBase<TResponse> {
    public isSigned: boolean;
    public registerResponse: string;
    public sequenceType: FiscalRegistrationSequenceType;
}