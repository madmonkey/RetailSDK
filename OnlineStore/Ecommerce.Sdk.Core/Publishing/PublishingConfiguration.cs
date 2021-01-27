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
        /// <summary>
        /// Publishing configuration class.
        /// </summary>
        public sealed class PublishingConfiguration
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="PublishingConfiguration"/> class.
            /// </summary>
            /// <param name="categoriesPageSize">Accepts categories PageSize.</param>
            /// <param name="productAttributesPageSize">Accepts productAttributes PageSize. </param>
            /// <param name="forceNoCatalogPublishing">Accepts forceNoCatalogPublishing.</param>
            /// <param name="crtListingPageSize">Accepts CRT Listing PageSize.</param>
            /// <param name="forceTimingInfoLogging">Accepts forceTimingInfoLogging.</param>
            /// <param name="deletedListingsPageSize">Page Size use to retrieve deleted listings.</param>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "crt", Justification = "CRT is well known term, it states for CommerceRuntime.")]
            public PublishingConfiguration(int categoriesPageSize, int productAttributesPageSize, bool forceNoCatalogPublishing, int crtListingPageSize, bool forceTimingInfoLogging, long deletedListingsPageSize)
            {
                this.CategoriesPageSize = categoriesPageSize;
                this.ProductAttributesPageSize = productAttributesPageSize;
                this.ForceNoCatalogPublishing = forceNoCatalogPublishing;
                this.CRTListingPageSize = crtListingPageSize;
                this.ForceTimingInfoLogging = forceTimingInfoLogging;
                this.DeletedListingsPageSize = deletedListingsPageSize;
            }
    
            /// <summary>
            /// Gets a value for CategoriesPageSize.
            /// </summary>
            public int CategoriesPageSize
            {
                get;
                private set;
            }
    
            /// <summary>
            /// Gets a value for ProductAttributesPageSize.
            /// </summary>
            public int ProductAttributesPageSize
            {
                get;
                private set;
            }
    
            /// <summary>
            /// Gets a value indicating whether to ForceNoCatalogPublishing.
            /// </summary>
            public bool ForceNoCatalogPublishing
            {
                get;
                private set;
            }
    
            /// <summary>
            /// Gets a value indicating whether for CRTListingPageSize.
            /// </summary>
            public int CRTListingPageSize
            {
                get;
                private set;
            }
    
            /// <summary>
            /// Gets a value indicating whether to ForceTimingInfoLogging.
            /// </summary>
            public bool ForceTimingInfoLogging
            {
                get;
                private set;
            }

            /// <summary>
            /// Gets page size for GetDeletedListings operation.
            /// </summary>
            public long DeletedListingsPageSize
            {
                get;
                private set;
            }
        }
    }
}
