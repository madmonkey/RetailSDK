/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IExtensionCommandContext } from "PosApi/Extend/Views/AppBarCommands";
import * as CustomerDetailsView from "PosApi/Extend/Views/CustomerDetailsView";
import { ArrayExtensions } from "PosApi/TypeExtensions";
import { Customers } from "../../DataService/DataServiceRequests.g";

export default class CustomerCrossLoyaltyCommand extends CustomerDetailsView.CustomerDetailsExtensionCommandBase {

    private _customer: ProxyEntities.Customer;
    private _loyaltyCards: ProxyEntities.LoyaltyCard[];

    /**
     * Creates a new instance of the CustomerCrossLoyaltyCommand class.
     * @param {IExtensionCommandContext<CustomerDetailsView.ICustomerDetailsToExtensionCommandMessageTypeMap>} context The command context.
     * @remarks The command context contains APIs through which a command can communicate with POS.
     */
    constructor(context: IExtensionCommandContext<CustomerDetailsView.ICustomerDetailsToExtensionCommandMessageTypeMap>) {
        super(context);

        this.id = "customerCrossLoyaltyCommand";
        this.label = "Cross Loyalty Discount";
        this.extraClass = "iconLightningBolt";

        this.loyaltyCardsLoadedHandler = (data: CustomerDetailsView.CustomerDetailsLoyaltyCardsLoadedData): void => {
            this._loyaltyCards = data.loyaltyCards;
        };
    }

    /**
     * Initializes the command.
     * @param {CustomerDetailsView.ICustomerDetailsExtensionCommandState} state The state used to initialize the command.
     */
    protected init(state: CustomerDetailsView.ICustomerDetailsExtensionCommandState): void {
        if (!state.isSelectionMode) {
            this.isVisible = true;
            this.canExecute = true;
            this._customer = state.customer;
        }
    }

    /**
     * Executes the command.
     */
    protected execute(): void {
        // Customer 2003 has loyalty cards.
        if (ArrayExtensions.hasElements(this._loyaltyCards)) {
            this.isProcessing = true;

            let request: Customers.GetCrossLoyaltyCardDiscountActionRequest<Customers.GetCrossLoyaltyCardDiscountActionResponse>
                = new Customers.GetCrossLoyaltyCardDiscountActionRequest<Customers.GetCrossLoyaltyCardDiscountActionResponse>(this._loyaltyCards[0].CardNumber);

            this.context.runtime.executeAsync(request)
                .then((result: ClientEntities.ICancelableDataResult<Customers.GetCrossLoyaltyCardDiscountActionResponse>) => {
                    this.isProcessing = false;
                    if (!result.canceled) {
                        let message: string = "Cross Loyalty Card Discount " + result.data.result;
                        this.context.logger.logInformational(message);
                        window.alert(message);
                    }
                })
                .catch(() => this.isProcessing = false);
        }
    }
}