/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso
{
    namespace Commerce.Runtime.DocumentProvider.CleanCashSample
    {
        using Microsoft.Dynamics.Commerce.Runtime;
        using System.Collections.Generic;
        using System.Linq;

        /// <summary>
        /// Incapsulates tax code to tax group mapping.
        /// </summary>
        public class TaxCodesMapping
        {
            private const string TaxCodeDoesNotHaveCorrespondingControlUnitVATGroup = "The tax code {0} does not have a corresponding control unit VAT group.";

            /// <summary>
            /// Mapping tax code to tax group.
            /// </summary>
            private Dictionary<string, int> mapping;

            /// <summary>
            /// Initializes a new instance of the <see cref="TaxCodesMapping"/> class.
            /// </summary>
            /// <param name="mapping">The tax codes mapping.</param>
            public TaxCodesMapping(Dictionary<string, int> mapping)
            {
                this.mapping = mapping;
            }

            /// <summary>
            /// Gets the CleanCash VAT register id by tax code.
            /// </summary>
            /// <param name="taxGroup">The tax group.</param>
            /// <returns>The CleanCash VAT register id.</returns>
            public int this[string taxGroup]
            {
                get {
                    int cleanCashVATRegisterId;

                    if (mapping != null && mapping.TryGetValue(taxGroup, out cleanCashVATRegisterId))
                    {
                        return cleanCashVATRegisterId;
                    }
                    else
                    {
                        throw new DataValidationException(DataValidationErrors.Microsoft_Dynamics_Commerce_Runtime_RequiredValueNotFound, TaxCodeDoesNotHaveCorrespondingControlUnitVATGroup);
                    }
                }
            }
        }
    }
}
