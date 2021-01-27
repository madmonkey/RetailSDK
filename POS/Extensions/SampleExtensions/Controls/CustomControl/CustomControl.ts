/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { ExtensionControlBase, IControlContext } from "PosApi/Create/Controls";

/**
 * Custom control call back on application
 */
export default class CustomControl extends ExtensionControlBase {
    // This will be called on application start.
    constructor(extensionContext: IControlContext) {
        // context exists but use of runtime in here maybe limited (Example: user not logged in yet)
        super(extensionContext);

        ko.bindingHandlers.microsoftSampleExtensionsCustomControl = new CustomKnockoutControl(extensionContext);
    }
}

/**
 * Knockout handler sample
 */
class CustomKnockoutControl implements KnockoutBindingHandler {
    private _extensionContext: IControlContext;

    constructor(context: IControlContext) {
        this._extensionContext = context;
    }

    public init(element: Element, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): any {
        let values: string = ko.utils.unwrapObservable(valueAccessor()) || {};
        element.className = "Microsot_Pos_Extensibility_Samples_CustomControl";

        ko.applyBindingsToNode(element, {
            template: {
                name: "Microsot_Pos_Extensibility_Samples_CustomControlTemplate1",
                data: values
            }
        });

        return { controlsDescendantBindings: true };
    }
}