/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import * as Triggers from "PosApi/Extend/Triggers/TransactionTriggers";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { ObjectExtensions, StringExtensions } from "PosApi/TypeExtensions";
import {
    GetCurrentCartClientRequest, GetCurrentCartClientResponse,
    SaveAttributesOnCartClientRequest, SaveAttributesOnCartClientResponse
} from "PosApi/Consume/Cart";
import {
    GetCustomerClientRequest, GetCustomerClientResponse,
} from "PosApi/Consume/Customer";
import { ShowMessageDialogClientRequest, ShowMessageDialogClientResponse } from "PosApi/Consume/Dialogs";

/**
 * Example implementation of an PreEndTransactionTrigger trigger that logs to the console.
 */
export default class PreEndTransactionTrigger extends Triggers.PreEndTransactionTrigger {
    private static B2B_CUSTOMER_ATTRIBUTE_NAME: string = "B2B";
    private static B2B_CART_ATTRIBUTE_NAME: string = "B2B String";
    private static B2B_ATTRIBUTE_VALUE_TRUE: string = "True";
    private static B2B_ATTRIBUTE_VALUE_FALSE: string = "False";
    private static DIALOG_RESULT_YES: string = "yes";
    private static DIALOG_RESULT_NO: string = "no";
    private static DIALOG_YES_BUTTON_ID: string = "B2B_PreEndTransactionTrigger_MessageDialog_Yes";
    private static DIALOG_NO_BUTTON_ID: string = "B2B_PreEndTransactionTrigger_MessageDialog_No";

    /**
     * Executes the trigger functionality.
     * @param {Triggers.IPreEndTransactionTriggerOptions} options The options provided to the trigger.
     */
    public execute(options: Triggers.IPreEndTransactionTriggerOptions): Promise<ClientEntities.ICancelable> {
        console.log("Executing PreEndTransactionTrigger with options " + JSON.stringify(options) + ".");

        let currentCart: ProxyEntities.Cart;
        return this.context.runtime.executeAsync<GetCurrentCartClientResponse>(new GetCurrentCartClientRequest())
            .then((getCurrentCartClientResponse: ClientEntities.ICancelableDataResult<GetCurrentCartClientResponse>):
                Promise<ClientEntities.ICancelableDataResult<GetCustomerClientResponse>> => {

                currentCart = getCurrentCartClientResponse.data.result;

                // Gets the current customer.
                let result: Promise<ClientEntities.ICancelableDataResult<GetCustomerClientResponse>>;
                if (!ObjectExtensions.isNullOrUndefined(currentCart) && !ObjectExtensions.isNullOrUndefined(currentCart.CustomerId)) {
                    let getCurrentCustomerClientRequest: GetCustomerClientRequest<GetCustomerClientResponse> =
                        new GetCustomerClientRequest(currentCart.CustomerId);
                    result = this.context.runtime.executeAsync<GetCustomerClientResponse>(getCurrentCustomerClientRequest);
                } else {
                    result = Promise.resolve({ canceled: false, data: new GetCustomerClientResponse(null) });
                }

                return result;
            })
            .then((getCurrentCustomerClientResponse: ClientEntities.ICancelableDataResult<GetCustomerClientResponse>):
                Promise<ClientEntities.ICancelableDataResult<ShowMessageDialogClientResponse>> => {

                let currentCustomer: ProxyEntities.Customer = getCurrentCustomerClientResponse.data.result;

                // If the cart is a customer order with a B2B customer, then we display a dialog to determine if the order should be B2B.
                let result: Promise<ClientEntities.ICancelableDataResult<ShowMessageDialogClientResponse>>;
                if (!ObjectExtensions.isNullOrUndefined(currentCart)
                    && currentCart.CustomerOrderModeValue === ProxyEntities.CustomerOrderMode.CustomerOrderCreateOrEdit
                    && !ObjectExtensions.isNullOrUndefined(currentCustomer)
                    && this.isCustomerB2B(currentCustomer)) {

                    let yesButton: ClientEntities.Dialogs.IDialogResultButton = {
                        id: PreEndTransactionTrigger.DIALOG_YES_BUTTON_ID,
                        label: this.context.resources.getString("string_0"), // "Yes"
                        result: PreEndTransactionTrigger.DIALOG_RESULT_YES
                    };
                    let noButton: ClientEntities.Dialogs.IDialogResultButton = {
                        id: PreEndTransactionTrigger.DIALOG_NO_BUTTON_ID,
                        label: this.context.resources.getString("string_1"), // "No"
                        result: PreEndTransactionTrigger.DIALOG_RESULT_NO
                    };
                    let showMessageDialogClientRequestOptions: ClientEntities.Dialogs.IMessageDialogOptions = {
                        title: this.context.resources.getString("string_2"), // "B2B Order"
                        subTitle: StringExtensions.EMPTY,
                        message: this.context.resources.getString("string_3"), // "Do you want to mark this order as a B2B order?"
                        button1: yesButton,
                        button2: noButton
                    };
                    let showMessageDialogClientRequest: ShowMessageDialogClientRequest<ShowMessageDialogClientResponse> =
                        new ShowMessageDialogClientRequest(showMessageDialogClientRequestOptions);

                    result = this.context.runtime.executeAsync<ShowMessageDialogClientResponse>(showMessageDialogClientRequest);
                } else {
                    result = Promise.resolve({ canceled: false, data: new ShowMessageDialogClientResponse(null) });
                }

                return result;
            })
            .then((showMessageDialogClientResponse: ClientEntities.ICancelableDataResult<ShowMessageDialogClientResponse>):
                Promise<ClientEntities.ICancelableDataResult<SaveAttributesOnCartClientResponse>> => {

                let result: Promise<ClientEntities.ICancelableDataResult<SaveAttributesOnCartClientResponse>>;

                if (!showMessageDialogClientResponse.canceled && !ObjectExtensions.isNullOrUndefined(showMessageDialogClientResponse.data.result)) {
                    // Save the B2B attribute value depending on the dialog result.
                    let messageDialogResult: ClientEntities.Dialogs.IMessageDialogResult = showMessageDialogClientResponse.data.result;

                    let attributeValue: ProxyEntities.AttributeTextValue = new ProxyEntities.AttributeTextValueClass();
                    attributeValue.Name = PreEndTransactionTrigger.B2B_CART_ATTRIBUTE_NAME;
                    attributeValue.TextValue = messageDialogResult.dialogResult === PreEndTransactionTrigger.DIALOG_RESULT_YES ?
                        PreEndTransactionTrigger.B2B_ATTRIBUTE_VALUE_TRUE : PreEndTransactionTrigger.B2B_ATTRIBUTE_VALUE_FALSE;
                    let attributeValues: ProxyEntities.AttributeValueBase[] = [attributeValue];
                    let saveAttributesOnCartRequest: SaveAttributesOnCartClientRequest<SaveAttributesOnCartClientResponse> =
                        new SaveAttributesOnCartClientRequest(attributeValues);
                    result = this.context.runtime.executeAsync(saveAttributesOnCartRequest);
                } else {
                    result = Promise.resolve({ canceled: false, data: null });
                }

                return result;
            });
    }

    /**
     * Returns whether or not the given customer is a B2B customer.
     * @param {ProxyEntities.Customer} customer The customer.
     * @returns {boolean} Whether or not the given customer is a B2B customer.
     */
    private isCustomerB2B(customer: ProxyEntities.Customer): boolean {
        let isB2B: boolean = false;

        if (!ObjectExtensions.isNullOrUndefined(customer.Attributes)) {
            for (let i: number = 0; i < customer.Attributes.length; i++) {
                let currentAttribute: ProxyEntities.CustomerAttribute = customer.Attributes[i];
                if (currentAttribute.Name === PreEndTransactionTrigger.B2B_CUSTOMER_ATTRIBUTE_NAME) {
                    if (!ObjectExtensions.isNullOrUndefined(currentAttribute.AttributeValue.BooleanValue)) {
                        isB2B = currentAttribute.AttributeValue.BooleanValue;
                    }

                    break;
                }
            }
        }

        return isB2B;
    }
}