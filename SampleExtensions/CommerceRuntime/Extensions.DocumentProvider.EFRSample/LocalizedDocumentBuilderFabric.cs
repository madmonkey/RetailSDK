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
    namespace Commerce.Runtime.DocumentProvider.EFRSample
    {
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentBuilders;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using System;

        /// <summary>
        /// Contains helper methods for localized document builder.
        /// </summary>
        public static class LocalizedDocumentBuilderFabric
        {
            /// <summary>
            /// Gets the concrete instance of document rule.
            /// </summary>
            /// <param name="context">Request context.</param>
            /// <returns>An instance of document rule.</returns>
            public static IDocumentRule GetLocalizedDocumentRule(GetFiscalDocumentDocumentProviderRequest request, SalesOrder salesOrder)
            {
                var countryRegionCode = request.RequestContext.GetChannelConfiguration().CountryRegionISOCode;

                switch (countryRegionCode)
                {
                    case CountryRegionISOCode.AT:
                        return new DocumentRuleAT(request, salesOrder);
                    case CountryRegionISOCode.CZ:
                        return new DocumentRuleCZ(request, salesOrder);
                    case CountryRegionISOCode.DE:
                        return new DocumentRuleDE(request, salesOrder);
                    default:
                        throw new NotSupportedException(string.Format(System.Globalization.CultureInfo.InvariantCulture, "Country/region code '{0}' is not supported.", countryRegionCode.ToString()));
                }
            }
        }
    }
}
