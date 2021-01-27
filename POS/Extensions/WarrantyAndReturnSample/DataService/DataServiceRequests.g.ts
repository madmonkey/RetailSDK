/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */


import { ProxyEntities } from "PosApi/Entities";
import { Entities } from "./DataServiceEntities.g";
import { DataServiceRequest, DataServiceResponse } from "PosApi/Consume/DataService";
export { ProxyEntities };
export { Entities };

export namespace WarrantyPlan {
    // Entity Set WarrantyPlan
    export class GetWarrantyPlanFromProductResponse extends DataServiceResponse {
        public result: Entities.WarrantyPlan[];
    }

    export class GetWarrantyPlanFromProductRequest<TResponse extends GetWarrantyPlanFromProductResponse> extends DataServiceRequest<TResponse> {
        /**
         * Constructor
         */
        public constructor(ProductId: number) {
            super();

            this._entitySet = "WarrantyPlan";
            this._method = "GetWarrantyPlanFromProduct";
            this._parameters = { ProductId: ProductId };
            this._isAction = true;
            this._returnType = Entities.WarrantyPlan;
            this._isReturnTypeCollection = true;

        }
    }

}
