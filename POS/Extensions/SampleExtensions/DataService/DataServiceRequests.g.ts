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

export namespace StoreHours {
    // Entity Set StoreDayHours
    export class GetStoreDaysByStoreResponse extends DataServiceResponse {
        public result: Entities.StoreDayHours[];
    }

    export class GetStoreDaysByStoreRequest<TResponse extends GetStoreDaysByStoreResponse> extends DataServiceRequest<TResponse> {
        /**
         * Constructor
         */
        public constructor(StoreNumber: string) {
            super();

            this._entitySet = "StoreHours";
            this._entityType = "StoreDayHours";
            this._method = "GetStoreDaysByStore";
            this._parameters = { StoreNumber: StoreNumber };
            this._isAction = true;
            this._returnType = Entities.StoreDayHours;
            this._isReturnTypeCollection = true;

        }
    }

    export class UpdateStoreDayHoursResponse extends DataServiceResponse {
        public result: Entities.StoreDayHours;
    }

    export class UpdateStoreDayHoursRequest<TResponse extends UpdateStoreDayHoursResponse> extends DataServiceRequest<TResponse> {
        /**
         * Constructor
         */
        public constructor(id: number, storeDayHours: Entities.StoreDayHours) {
            super();

            this._entitySet = "StoreHours";
            this._entityType = "StoreDayHours";
            this._method = "UpdateStoreDayHours";
            this._parameters = { storeDayHours: storeDayHours };
            this._isAction = true;
            this._returnType = Entities.StoreDayHours;
            this._isReturnTypeCollection = false;
            this._keys = { Id: id };
        }
    }

}

export namespace Customers {
    // Entity Set Customer
    export class GetCrossLoyaltyCardDiscountActionResponse extends DataServiceResponse {
        public result: number;
    }

    export class GetCrossLoyaltyCardDiscountActionRequest<TResponse extends GetCrossLoyaltyCardDiscountActionResponse> extends DataServiceRequest<TResponse> {
        /**
         * Constructor
         */
        public constructor(LoyaltyCardNumber: string) {
            super();

            this._entitySet = "Customers";
            this._entityType = "Customer";
            this._method = "GetCrossLoyaltyCardDiscountAction";
            this._parameters = { LoyaltyCardNumber: LoyaltyCardNumber };
            this._isAction = true;
            this._returnType = null;
            this._isReturnTypeCollection = false;

        }
    }

}
