/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { SaveAttributesOnCartClientRequest, SaveAttributesOnCartClientResponse } from "PosApi/Consume/Cart";
import { GetApplicationVersionClientRequest, GetApplicationVersionClientResponse } from "PosApi/Consume/Device";
import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { IExtensionContext } from "PosApi/Framework/ExtensionContext";

/**
 * Implements build number adding logic.
 */
export default class BuildNumberManager {

    /**
     * Sales order extension property key for build number.
     */
    private static readonly BUILD_NUMBER_KEY_ID: string = "BUILD_NUMBER_068160BD_AB37_4E88_93FF_418E842BD803";

    private extensionContext: IExtensionContext;

    /**
     * Initializes a new instance of BuildNumberManager class.
     * @param {IExtensionContext} extension context to be used.
     */
    constructor(extensionContext: IExtensionContext) {
        this.extensionContext = extensionContext;
    }

    /**
     * Adds build number to cart attributes.
     * @param {ProxyEntities.Cart} cart The cart.
     * @returns {Promise<ClientEntities.ICancelable>} The cancelable result.
     */
    public addBuildNumberToCart(cart: ProxyEntities.Cart): Promise<ClientEntities.ICancelable> {
        return this.extensionContext.runtime.executeAsync(new GetApplicationVersionClientRequest())
            .then((response: ClientEntities.ICancelableDataResult<GetApplicationVersionClientResponse>):
                Promise<ClientEntities.ICancelableDataResult<SaveAttributesOnCartClientResponse>> => {

                let buildNumberAttribute: ProxyEntities.AttributeTextValue = new ProxyEntities.AttributeTextValueClass();
                buildNumberAttribute.Name = BuildNumberManager.BUILD_NUMBER_KEY_ID;
                buildNumberAttribute.TextValue = response.data.result;

                return this.extensionContext.runtime.executeAsync(new SaveAttributesOnCartClientRequest([buildNumberAttribute]));
            })
            .then((response: ClientEntities.ICancelableDataResult<SaveAttributesOnCartClientResponse>): Promise<ClientEntities.ICancelable> => {
                this.extensionContext.logger.logInformational("Build number manager: Build number adding succeeded");
                return Promise.resolve({ canceled: false });
            })
            .catch((reason: any) => {
                this.extensionContext.logger.logError("Build number manager: Build number adding failed, error message: " + JSON.stringify(reason));
                return Promise.resolve({ canceled: false });
            });
    }
}