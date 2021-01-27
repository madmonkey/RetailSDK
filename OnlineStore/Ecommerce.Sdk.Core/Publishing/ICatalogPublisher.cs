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
    namespace Retail.Ecommerce.Sdk.Core.Publishing
    {
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.RetailProxy;

        /// <summary>
        /// Encapsulates set of callbacks used to complete a catalog publishing.
        /// </summary>
        public interface ICatalogPublisher
        {
            /// <summary>
            /// Indicates that changed (new or modified) products were found in CRT.
            /// </summary>
            /// <param name="changedProducts">The products which were changed.</param>
            /// <param name="pageNumberInCatalog">Page number used while retrieving products from CRT. Can be used by clients for diagnostics purposes.</param>
            /// <param name="catalogId">The catalog ID which contains the changed products.</param>
            /// <returns>The Task.</returns>
            /// <remarks>The class which implements this method should expect this method to be called multiple times. Number of times it is called depends on page size used while initializing the Publisher.</remarks>
            Task OnChangedProductsFound(IEnumerable<Product> changedProducts, int pageNumberInCatalog, long catalogId);

            /// <summary>
            /// Indicates the all changed products for the given, passed via the catalogId parameter, catalog were retrieved (in form of multiple previous calls by meanings of OnChangedProductsFound).
            /// </summary>
            /// <param name="catalogId">THe catalog Id.</param>
            /// <remarks>This method is called once for every channel's catalog once all changed products were already read. Implementation of this method could, for instance, initiate a publishing to the target channel.</remarks>
            void OnCatalogReadCompleted(long catalogId);

            /// <summary>
            /// Indicates that deleted catalogs were found in CRT.
            /// </summary>
            /// <param name="catalogs">Deleted catalogs.</param>
            /// <returns>The Task.</returns>
            Task OnDeleteProductsByCatalogIdRequested(IEnumerable<long> catalogs);

            /// <summary>
            /// Indicates that deleted languages, belonging to the channel, were found in CRT.
            /// </summary>
            /// <param name="languageIds">Deleted languages.</param>
            /// <returns>The Task.</returns>
            Task OnDeleteProductsByLanguageIdRequested(IEnumerable<string> languageIds);

            /// <summary>
            /// Indicates that individually deleted products were found in CRT.
            /// </summary>
            /// <param name="ids">Deleted products' IDs.</param>
            void OnDeleteIndividualProductsRequested(IEnumerable<ListingIdentity> ids);
        }
    }
}
