/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

/* tslint:disable */
import { ProxyEntities } from "PosApi/Entities";
import { Entities } from "./DataServiceEntities.g";
import { DataServiceRequest, DataServiceResponse } from "PosApi/Consume/DataService";
export { ProxyEntities };
export { Entities };

  export namespace StoreOperations {

  export class SalesTransactionSignatureServiceIsReadyResponse extends DataServiceResponse {
    public result: boolean;
  }

  export class SalesTransactionSignatureServiceIsReadyRequest<TResponse extends SalesTransactionSignatureServiceIsReadyResponse> extends DataServiceRequest<TResponse> {
    /**
     * Constructor
     */
      public constructor(correlationId: string) {
        super();

        this._entitySet = "";
        this._entityType = "";
        this._method = "SalesTransactionSignatureServiceIsReady";
        this._parameters = { correlationId: correlationId };
        this._isAction = true;
        this._returnType = null;
        this._isReturnTypeCollection = false;
        
      }
  }

  export class GetLastFiscalTransactionResponse extends DataServiceResponse {
    public result: ProxyEntities.FiscalTransaction;
  }

  export class GetLastFiscalTransactionRequest<TResponse extends GetLastFiscalTransactionResponse> extends DataServiceRequest<TResponse> {
    /**
     * Constructor
     */
      public constructor(storeNumber: string, terminalId: string) {
        super();

        this._entitySet = "";
        this._entityType = "";
        this._method = "GetLastFiscalTransaction";
        this._parameters = { storeNumber: storeNumber, terminalId: terminalId };
        this._isAction = true;
        this._returnType = ProxyEntities.FiscalTransactionClass;
        this._isReturnTypeCollection = false;
        
      }
  }

  export class GetLastSequentialSignatureResponse extends DataServiceResponse {
    public result: Entities.SequentialSignatureData;
  }

  export class GetLastSequentialSignatureRequest<TResponse extends GetLastSequentialSignatureResponse> extends DataServiceRequest<TResponse> {
    /**
     * Constructor
     */
      public constructor(storeNumber: string, terminalId: string, registrationSequenceTypeValue: number) {
        super();

        this._entitySet = "";
        this._entityType = "";
        this._method = "GetLastSequentialSignature";
        this._parameters = { storeNumber: storeNumber, terminalId: terminalId, registrationSequenceTypeValue: registrationSequenceTypeValue };
        this._isAction = true;
        this._returnType = Entities.SequentialSignatureData;
        this._isReturnTypeCollection = false;
        
      }
  }

}
