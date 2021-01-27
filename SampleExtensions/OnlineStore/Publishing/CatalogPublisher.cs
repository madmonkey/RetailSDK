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
    namespace Retail.Ecommerce.Publishing
    {
        using System;
        using System.Collections.Generic;
        using System.Diagnostics;
        using System.Linq;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.RetailProxy;
        using Retail.Ecommerce.Sdk.Core.Publishing;

        internal class CatalogPublisher : ICatalogPublisher
        {
            private readonly Publisher publisher;

            public CatalogPublisher(Publisher publisher)
            {
                this.publisher = publisher;
            }

            /// <summary>
            /// Indicates the all changed products for the given, passed via the catalogId parameter, catalog were retrieved (in form of multiple previous calls by meanings of OnChangedProductsFound).
            /// </summary>
            /// <param name="catalogId">The catalog identifier.</param>
            /// <remarks>This method is called once for every channel's catalog once all changed products were already read. Implementation of this method could, for instance, initiate a publishing to the target channel.</remarks>
            public void OnCatalogReadCompleted(long catalogId)
            {
                Trace.TraceInformation("Catalog read completed. CatalogID={0}.", catalogId);

                // Your code to handle received products could be here or in OnChangedProductsFound callback
                // in case you want more granular handling, the decision is up to you and depends on your specific implementation details.
                // Once your code completes inserting the products into the target channel (like Search Index for instance) you need to
                // create publishing status for the listings so:
                // a) it is available in AX UI for review
                // b) it can be used by CRT to detect deleted products.
                // An example of creating a publishing status can be seen in the OnChangedProductsFound
            }

            /// <summary>
            /// Indicates that changed (new or modified) products were found in CRT.
            /// </summary>
            /// <param name="products">The products which were changed.</param>
            /// <param name="pageNumberInCatalog">Page number used while retrieving products from CRT. Can be used by clients for diagnostics purposes.</param>
            /// <param name="catalogId">The catalog ID which contains the changed products.</param>
            /// <returns>The task.</returns>
            /// <remarks>The class which implements this method should expect this method to be called multiple times. Number of times it is called depends on page size used while initializing the Publisher.</remarks>
            public async Task OnChangedProductsFound(IEnumerable<Product> products, int pageNumberInCatalog, long catalogId)
            {
                if (products == null)
                {
                    throw new ArgumentNullException(nameof(products));
                }

                Trace.TraceInformation("Page read completed. Products read in this page={0}, The page number={1}, CatalogID={2}", products.Count(), pageNumberInCatalog, catalogId);

                List<ListingPublishStatus> statuses = new List<ListingPublishStatus>();

                // Enumerating the products.
                foreach (Product product in products)
                {
                    // Accessing the product's translations.
                    foreach (ProductPropertyTranslation productPropertyTranslation in product.ProductProperties)
                    {
                        // Enumerating properties' values corresponding to the current translation.
                        foreach (ProductProperty property in productPropertyTranslation.TranslatedProperties)
                        {
                            // Process the product property's values here.
                            Trace.WriteLine(string.Format("{0}({1})={2}", property.KeyName, (ProductPropertyType)property.PropertyTypeValue, property.ValueString));
                        }

                        // If the product is standalone one then creating the publishing status based on the Product's RecordID.
                        if (!product.IsMasterProduct)
                        {
                            ListingPublishStatus publishStatus = this.publisher.CreatePublishingStatus(catalogId, product.RecordId, productPropertyTranslation.TranslationLanguage, PublishingAction.Publish, product.RecordId.ToString());
                            statuses.Add(publishStatus);
                        }
                    }

                    // Check whether it makes sense to try accessing the product's variants.
                    if (product.IsMasterProduct)
                    {
                        // Enumearing the variants.
                        foreach (ProductVariant variant in product.CompositionInformation.VariantInformation.Variants)
                        {
                            // Enumerating available variants' translations.
                            foreach (ProductPropertyTranslation variantPropertyTranslation in variant.PropertiesAsList)
                            {
                                // Enumerating properties' values corresponding to the current translation.
                                foreach (ProductProperty variantProperty in variantPropertyTranslation.TranslatedProperties)
                                {
                                    // Process the variant property's values here.
                                    Trace.WriteLine(string.Format("{0}({1})={2}", variantProperty.KeyName, (ProductPropertyType)variantProperty.PropertyTypeValue, variantProperty.ValueString));
                                }

                                ListingPublishStatus publishStatus = this.publisher.CreatePublishingStatus(catalogId, variant.DistinctProductVariantId.Value, variantPropertyTranslation.TranslationLanguage, PublishingAction.Publish, variant.DistinctProductVariantId.Value.ToString());
                                statuses.Add(publishStatus);
                            }
                        }
                    }
                }

                await this.publisher.StorePublishingStatuses(statuses);
            }

            /// <summary>
            /// Indicates that deleted catalogs were found in CRT.
            /// </summary>
            /// <param name="catalogs">Deleted catalogs.</param>
            /// <returns>The Task.</returns>
            public async Task OnDeleteProductsByCatalogIdRequested(IEnumerable<long> catalogs)
            {
                Trace.WriteLine(string.Format("Detected {0} deleted catalogs", catalogs.Count()));

                // Put here your code to remove listings by catalogs from your search index.
                await this.publisher.DeleteListingsByCatalogs(catalogs);
            }

            /// <summary>
            /// Indicates that deleted languages, belonging to the channel, were found in CRT.
            /// </summary>
            /// <param name="languageIds">Deleted languages.</param>
            /// <returns>The Task.</returns>
            public async Task OnDeleteProductsByLanguageIdRequested(IEnumerable<string> languageIds)
            {
                Trace.WriteLine(string.Format("Detected {0} deleted languages", languageIds.Count()));

                // Put here your code to remove listings by languages from your search index.
                await this.publisher.DeleteListingsByLanguages(languageIds);
            }

            /// <summary>
            /// Indicates that individually deleted products were detected.
            /// </summary>
            /// <param name="ids">Deleted products' IDs.</param>
            public void OnDeleteIndividualProductsRequested(IEnumerable<ListingIdentity> ids)
            {
                Trace.WriteLine(string.Format("Found {0} deleted products.", ids.Count()));
            }
        }
    }
}