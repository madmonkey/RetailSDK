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
        using System;
        using System.Collections.Generic;
        using System.Diagnostics;
        using System.Globalization;
        using System.IO;
        using System.Linq;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.RetailProxy;
        using Microsoft.Dynamics.Commerce.RetailProxy.Authentication;
        using Microsoft.IdentityModel.Clients.ActiveDirectory;

        /// <summary>
        /// Encapsulates logic to handle Channel and Catalog publishing.
        /// </summary>
        public class Publisher
        {
            private const string KeySyncAnchor = "SyncAnchor";
            private const string RetailServerSpn = "https://commerce.dynamics.com";

            private readonly PublishingConfiguration publishingConfig = null;
            private readonly string clientId;
            private readonly string clientSecret;
            private readonly Uri retailServerUri;
            private readonly string operatingUnitNumber;
            private readonly Uri authority;

            private ChannelConfiguration channelConfiguration;

            /// <summary>
            /// Initializes a new instance of the <see cref="Publisher"/> class.
            /// </summary>
            /// <param name="publishingConfig">The publishing config.</param>
            /// <param name="operatingUnitNumber">The channel's operating unit number.</param>
            /// <param name="retailServerUri">The retail server's Url.</param>
            /// <param name="authority">Azure Active Directory authority.</param>
            /// <param name="clientId">AAD client id.</param>
            /// <param name="clientSecret">AAD client secret.</param>
            public Publisher(PublishingConfiguration publishingConfig, string operatingUnitNumber, Uri retailServerUri, Uri authority, string clientId, string clientSecret)
            {
                this.clientId = clientId;
                this.clientSecret = clientSecret;
                this.retailServerUri = retailServerUri;
                this.authority = authority;
                this.operatingUnitNumber = operatingUnitNumber;

                this.publishingConfig = publishingConfig;
            }

            /// <summary>
            /// Gets the publishing configuration.
            /// </summary>
            public PublishingConfiguration PublishingConfiguration
            {
                get
                {
                    return this.publishingConfig;
                }
            }

            /// <summary>
            /// Initiates a channel publishing process.
            /// </summary>
            /// <param name="channelPublisher">Instance of the object which implements IChannelPublisher.</param>
            /// <returns>Return publishing parameters.</returns>
            /// <remarks>Retrieves the channel info from the CRT, then executes callbacks for the supplied IChannelPublisher and finally updates the channel publishing status in CRT/AX.</remarks>
            public async Task<PublishingParameters> PublishChannel(IChannelPublisher channelPublisher)
            {
                if (channelPublisher == null)
                {
                    throw new ArgumentNullException(nameof(channelPublisher));
                }

                ManagerFactory factory = await this.CreateManagerFactory();
                IOrgUnitManager orgUnitManager = factory.GetManager<IOrgUnitManager>();
                this.channelConfiguration = await orgUnitManager.GetOrgUnitConfiguration();

                IStoreOperationsManager storeOperationsManager = factory.GetManager<IStoreOperationsManager>();

                OnlineChannelPublishStatusType publishingStatus = (OnlineChannelPublishStatusType)(await storeOperationsManager.GetOnlineChannelPublishStatus());

                if (publishingStatus != OnlineChannelPublishStatusType.Published
                    && publishingStatus != OnlineChannelPublishStatusType.InProgress)
                {
                    throw new ChannelNotPublishedException(Resources.ErrorChannelNotInPublishedState, publishingStatus);
                }

                IEnumerable<Category> categories;
                Dictionary<long, IEnumerable<AttributeCategory>> categoriesAttributes;

                // always load the categories but process them only if the channel is not published yet.
                try
                {
                    var categoriesInfo = await this.LoadCategories(factory);
                    categories = categoriesInfo.Item1;
                    categoriesAttributes = categoriesInfo.Item2;
                    int categoriesCount = categories.Count();
                    
                    if (categoriesCount == 0)
                    {
                        throw new InvalidDataException(string.Format(
                            "Navigation categories count returned is '{0}'. Error details {1}",
                            categoriesCount,
                            Resources.ErrorNoNavigationCategories));
                    }

                    // Loading product attributes schema from CRT
                    IEnumerable<AttributeProduct> productAttributes = await this.LoadProductAttributes(factory);
                    channelPublisher.OnValidateProductAttributes(productAttributes);

                    int listingAttributesCount = productAttributes.Count();
                    
                    if (listingAttributesCount == 0)
                    {
                        throw new InvalidDataException(string.Format(
                            "Listing Attributes Count returned is '{0}'. Error details '{1}'",
                            listingAttributesCount,
                            Resources.ErrorNoSchemaAttributes));
                    }

                    ChannelLanguage language = this.channelConfiguration.Languages.Single(l => l.IsDefault);
                    CultureInfo culture = new CultureInfo(language.LanguageId);

                    PublishingParameters parameters = new PublishingParameters
                    {
                        Categories = categories,
                        CategoriesAttributes = categoriesAttributes,
                        ProductsAttributes = productAttributes,
                        ChannelDefaultCulture = culture,
                        GiftCartItemId = this.channelConfiguration.GiftCardItemId
                    };

                    if (publishingStatus == OnlineChannelPublishStatusType.InProgress)
                    {
                        channelPublisher.OnChannelInformationAvailable(parameters, true);
                        await storeOperationsManager.SetOnlineChannelPublishStatus((int)OnlineChannelPublishStatusType.Published, null);
                        Trace.WriteLine("Successfully changed the channel's publishing status to Published.");
                    }
                    else
                    {
                        channelPublisher.OnChannelInformationAvailable(parameters, false);
                    }

                    return parameters;
                }
                catch (Exception ex)
                {
                    
                    string error = string.Format(CultureInfo.InvariantCulture, Resources.ErrorChannelPublishingFailed, ex.Message, DateTime.Now);
                    await storeOperationsManager.SetOnlineChannelPublishStatus((int)OnlineChannelPublishStatusType.Failed, error);
                    throw;
                }
            }

            /// <summary>
            /// Initiates a catalog publishing.
            /// </summary>
            /// <param name="catalogPublisher">Instance of the object which implements ICatalogPublisher.</param>
            /// <returns>True if changed products were found in CRT, False otherwise.</returns>
            /// <remarks>Retrieves the channel's catalogs from CRT and then checks whether CRT contains changed products for each of the catalogs. If changed products are found then
            /// ICatalogPublisher's callbacks are executed to let the caller's code process changed products.</remarks>
            public async Task<bool> PublishCatalog(ICatalogPublisher catalogPublisher)
            {
                if (catalogPublisher == null)
                {
                    throw new ArgumentNullException(nameof(catalogPublisher));
                }

                List<long> productCatalogIds = new List<long>(1);

                // If catalogs were published to this channel, a given product will be published into SP for each catalog
                // in which it appears, so catalogless publishing would not yield different results for those products.
                // If, however, a product was published directly from the assortment, that product will only be detected
                // and published to SP if the ForceCataloglessPublishing flag is set to 'true' (1) in the job configuration file.
                // The semantics of forcing catalogless publishing as strict, in that catalog-less products will be published
                // if and only if the flag is set. That means, for instance, that if the flag is not set and there are no
                // catalogs published to this channel, the SP job will not detect/publish any products to SP.
                if (this.publishingConfig.ForceNoCatalogPublishing)
                {
                    productCatalogIds.Add(0);
                }

                ManagerFactory factory = await this.CreateManagerFactory();

                IProductManager productManager = factory.GetManager<IProductManager>();

                IEnumerable<ProductCatalog> productCatalogs = await this.GetCatalogs(factory);
                foreach (ProductCatalog productCatalog in productCatalogs)
                {
                    productCatalogIds.Add(productCatalog.RecordId);
                }

                bool deletesFound = await this.DeleteProducts(productCatalogs, catalogPublisher, productManager);

                ChangedProductsSearchCriteria searchCriteria = new ChangedProductsSearchCriteria
                {
                    Context = new ProjectionDomain { ChannelId = this.channelConfiguration.RecordId }
                };

                searchCriteria.Context.ChannelId = this.channelConfiguration.RecordId;

                QueryResultSettings productsQuerySettings = new QueryResultSettings { Paging = new PagingInfo { Top = this.publishingConfig.CRTListingPageSize, Skip = 0 } };

                bool changesFound = false;

                try
                {
                    searchCriteria.Session = await productManager.BeginReadChangedProducts(searchCriteria);

                    if (searchCriteria.Session.TotalNumberOfProducts > 0)
                    {
                        int totalProductsCount = 0;

                        // loop through the product catalogs, retrieving products.
                        foreach (long productCatalogId in productCatalogIds)
                        {
                            // set the catalog id on the search criteria
                            searchCriteria.Context.CatalogId = productCatalogId;

                            // reset counters.
                            searchCriteria.Session.NumberOfProductsRead = 0;
                            searchCriteria.Session.NumberOfProductsReadInCurrentPage = 0;

                            int pageNumberForCatalog = 0;
                            int catalogProductsCount = 0;

                            // BeginReadChangedProducts returns total number of changed products but that number doesn't take into account a catalog
                            // As a result, it is possible that, while calling ReadChangedProducts with specific (other than 0) catalog the amount
                            // of actually returned products will be less or more than requested page size. Because of that the decision when to stop
                            // iterative calls to RS should be made by comparing Number Of Products Requested (via Max Page Size) so far
                            // with Total Number Of Changed Products returned by BeginReadChanged Products.
                            long numberOfProductsRequested = 0;

                            PagedResult<Product> products;

                            // inner loop: load changes, page by page, up to catalog max size
                            do
                            {
                                changesFound = true;
                                productsQuerySettings.Paging.Skip = numberOfProductsRequested;
                                try
                                {
                                    products = await productManager.ReadChangedProducts(searchCriteria, productsQuerySettings);
                                }
                                catch (UserAuthenticationException userAuthException)
                                {
                                    if (userAuthException.ErrorResourceId == SecurityErrors.Microsoft_Dynamics_Commerce_Runtime_InvalidUserToken.ToString())
                                    {
                                        // log warning info
                                        System.Diagnostics.Trace.TraceWarning("Retry on security token expiration. " + userAuthException.Message);

                                        // retry with new token
                                        factory = await this.CreateManagerFactory();
                                        productManager = factory.GetManager<IProductManager>();
                                        products = await productManager.ReadChangedProducts(searchCriteria, productsQuerySettings);
                                    }
                                    else
                                    {
                                        throw;
                                    }
                                }

                                int numberOfReadProducts = products.Results.Count();
                                totalProductsCount += numberOfReadProducts;
                                catalogProductsCount += numberOfReadProducts;

                                await catalogPublisher.OnChangedProductsFound(products, pageNumberForCatalog, productCatalogId);
                                pageNumberForCatalog++;
                                numberOfProductsRequested = productsQuerySettings.Paging.Skip.Value + productsQuerySettings.Paging.Top.Value;
                            }
                            while (numberOfProductsRequested < searchCriteria.Session.TotalNumberOfProducts.Value);

                            catalogPublisher.OnCatalogReadCompleted(productCatalogId);
                        }   // for each product catalog
                    } // if changed products were found
                }
                finally
                {
                    await productManager.EndReadChangedProducts(searchCriteria.Session);
                }

                return changesFound || deletesFound;
            }

            /// <summary>
            /// Creates listing publishing status.
            /// </summary>
            /// <param name="catalogId">The catalog ID.</param>
            /// <param name="listingId">The listing ID which is either product or variant RecordId.</param>
            /// <param name="language">The language.</param>
            /// <param name="action">The publishing action.</param>
            /// <param name="tag">Tag specific to the target channel.</param>
            /// <returns>Instance of ListingPublishStatus.</returns>
            public ListingPublishStatus CreatePublishingStatus(long catalogId, long listingId, string language, PublishingAction action, string tag)
            {
                ListingPublishStatus publishStatus = new ListingPublishStatus
                {
                    CatalogId = catalogId,
                    ChannelId = this.channelConfiguration.RecordId,
                    ChannelListingId = listingId.ToString(),
                    LanguageId = language,
                    AppliedActionValue = (int)action,
                    PublishStatusValue = (int)ListingPublishingActionStatus.Done,
                    ListingModifiedDateTime = System.DateTimeOffset.UtcNow,
                    ProductId = listingId,
                    Tag = tag
                };

                return publishStatus;
            }

            /// <summary>
            /// Stores set of Listing Publishing Statuses.
            /// </summary>
            /// <param name="statuses">The statuses to be stored.</param>
            /// <returns>The task.</returns>
            public async Task StorePublishingStatuses(IEnumerable<ListingPublishStatus> statuses)
            {
                if (statuses == null)
                {
                    throw new ArgumentNullException(nameof(statuses));
                }

                ManagerFactory factory = await this.CreateManagerFactory();
                IProductManager productManager = factory.GetManager<IProductManager>();
                await productManager.UpdateListingPublishingStatus(statuses);
            }

            /// <summary>
            /// Deletes listings by catalogs IDs.
            /// </summary>
            /// <param name="catalogsIds">The catalogs' IDs.</param>
            /// <returns>The task.</returns>
            public async Task DeleteListingsByCatalogs(IEnumerable<long> catalogsIds)
            {
                if (catalogsIds == null)
                {
                    throw new ArgumentNullException(nameof(catalogsIds));
                }

                ManagerFactory factory = await this.CreateManagerFactory();
                IProductManager productManager = factory.GetManager<IProductManager>();
                await productManager.DeleteListingsByCatalogs(catalogsIds);
            }

            /// <summary>
            /// Deletes listings by languages.
            /// </summary>
            /// <param name="languages">The languages.</param>
            /// <returns>The task.</returns>
            public async Task DeleteListingsByLanguages(IEnumerable<string> languages)
            {
                if (languages == null)
                {
                    throw new ArgumentNullException(nameof(languages));
                }

                ManagerFactory factory = await this.CreateManagerFactory();
                IProductManager productManager = factory.GetManager<IProductManager>();
                await productManager.DeleteListingsByLanguages(languages);
            }

            /// <summary>
            /// Retrieves set of catalogs published to the channel.
            /// </summary>
            /// <param name="factory">Instance of ManagerFactory.</param>
            /// <returns>Collection of catalogs published to the channel.</returns>
            internal async Task<IEnumerable<ProductCatalog>> GetCatalogs(ManagerFactory factory)
            {
                QueryResultSettings catalogsQuerySettings = new QueryResultSettings { Paging = new PagingInfo { Top = this.publishingConfig.CRTListingPageSize, Skip = 0 } };

                IProductCatalogManager catalogManager = factory.GetManager<IProductCatalogManager>();

                IEnumerable<ProductCatalog> productCatalogs = (await catalogManager.GetCatalogs(this.channelConfiguration.RecordId, activeOnly: true, queryResultSettings: catalogsQuerySettings)).Results;
                return productCatalogs;
            }

            /// <summary>
            /// Loads AX categories and their attributes.
            /// </summary>
            /// <param name="factory">The instance of ManagerFactory.</param>
            /// <returns>Categories and categories' attributes.</returns>
            private async Task<Tuple<IEnumerable<Category>, Dictionary<long, IEnumerable<AttributeCategory>>>> LoadCategories(ManagerFactory factory)
            {
                ////******** Reading categories *****************
                PagingInfo pagingInfo = new PagingInfo() { Top = this.publishingConfig.CategoriesPageSize, Skip = 0 };
                QueryResultSettings getCategoriesCriteria = new QueryResultSettings() { Paging = pagingInfo };

                List<Category> categories = new List<Category>();

                IEnumerable<Category> currentPageCategories;
                ICategoryManager categoryManager = factory.GetManager<ICategoryManager>();
                do
                {
                    currentPageCategories = await categoryManager.GetCategories(this.channelConfiguration.RecordId, getCategoriesCriteria);
                    categories.AddRange(currentPageCategories);
                    getCategoriesCriteria.Paging.Skip = getCategoriesCriteria.Paging.Skip + this.publishingConfig.CategoriesPageSize;
                }
                while (currentPageCategories.Count() == getCategoriesCriteria.Paging.Top);

                // ******* Reading categories' attributes
                QueryResultSettings getCategoryAttributesCriteria = new QueryResultSettings() { Paging = new PagingInfo { Top = this.publishingConfig.CategoriesPageSize, Skip = 0 } };
                Dictionary<long, IEnumerable<AttributeCategory>> categoryAttributesMap = new Dictionary<long, IEnumerable<AttributeCategory>>();
                foreach (Category category in categories)
                {
                    getCategoryAttributesCriteria.Paging.Skip = 0;
                    List<AttributeCategory> allCategoryAttributes = new List<AttributeCategory>();
                    IEnumerable<AttributeCategory> categoryAttributes;
                    do
                    {
                        categoryAttributes = await categoryManager.GetAttributes(category.RecordId, getCategoryAttributesCriteria);
                        allCategoryAttributes.AddRange(categoryAttributes);
                        getCategoryAttributesCriteria.Paging.Skip = getCategoryAttributesCriteria.Paging.Skip + this.publishingConfig.CategoriesPageSize;
                    }
                    while (categoryAttributes.Count() == getCategoryAttributesCriteria.Paging.Top);

                    categoryAttributesMap.Add(category.RecordId, allCategoryAttributes);
                }

                var result = new Tuple<IEnumerable<Category>, Dictionary<long, IEnumerable<AttributeCategory>>>(categories, categoryAttributesMap);
                return result;
            }

            /// <summary>
            /// Loads AX product attributes.
            /// </summary>
            /// <param name="factory">The instance of ManagerFactory.</param>
            /// <returns>Returns product attributes.</returns>
            private async Task<IEnumerable<AttributeProduct>> LoadProductAttributes(ManagerFactory factory)
            {
                QueryResultSettings getProductAttributesCriteria = new QueryResultSettings { Paging = new PagingInfo { Top = this.publishingConfig.ProductAttributesPageSize, Skip = 0 } };
                IProductManager productManager = factory.GetManager<IProductManager>();
                List<AttributeProduct> attributes = new List<AttributeProduct>();
                IEnumerable<AttributeProduct> currentAttributePage;
                do
                {
                    currentAttributePage = await productManager.GetChannelProductAttributes(getProductAttributesCriteria);
                    attributes.AddRange(currentAttributePage);
                    getProductAttributesCriteria.Paging.Skip = getProductAttributesCriteria.Paging.Skip + getProductAttributesCriteria.Paging.Top;
                }
                while (currentAttributePage.Count() == getProductAttributesCriteria.Paging.Top);

                return attributes;
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "Refactoring will be costly at this stage. Should be taken up in next cycle.")]
            private async Task<bool> DeleteProducts(
              IEnumerable<ProductCatalog> productCatalogs,
              ICatalogPublisher catalogPublisher,
              IProductManager productManager)
            {
                if (productCatalogs == null)
                {
                    throw new ArgumentNullException(nameof(productCatalogs));
                }

                if (catalogPublisher == null)
                {
                    throw new ArgumentNullException(nameof(catalogPublisher));
                }

                bool changesDetected = false;

                QueryResultSettings batchSettings = new QueryResultSettings { Paging = new PagingInfo { Top = this.publishingConfig.CRTListingPageSize, Skip = 0 } };

                // 1: delete listings for the catalogs which are no longer exist in AX (were retracted for instance).
                PagedResult<long> catalogsToBeDeleted = await productManager.GetDeletedCatalogs(batchSettings);
                if (catalogsToBeDeleted.Any())
                {
                    await catalogPublisher.OnDeleteProductsByCatalogIdRequested(catalogsToBeDeleted.ToList());
                    changesDetected = true;
                }

                // 2. delete listings for languages which are no longer exist on the channel, this is another fast operation (in terms of querying CRT).
                PagedResult<string> languagesToBeDeleted = await productManager.GetDeletedLanguages(batchSettings);
                if (languagesToBeDeleted.Any())
                {
                    await catalogPublisher.OnDeleteProductsByLanguageIdRequested(languagesToBeDeleted.ToList());
                    changesDetected = true;
                }

                // 3: Finally read all listings left from published listings table and ask CRT whehter the product still available there or not
                foreach (ProductCatalog catalog in productCatalogs)
                {
                    List<List<ListingPublishStatus>> catalogStatuses = new List<List<ListingPublishStatus>>();
                    long skip = 0;
                    DeletedListingsResult deletedListingsResult;
                    do
                    {
                        deletedListingsResult = await productManager.GetDeletedListings(catalog.RecordId, skip, top: this.publishingConfig.DeletedListingsPageSize);
                        skip += this.publishingConfig.DeletedListingsPageSize;

                        if (deletedListingsResult.DeletedListings.Count > 0)
                        {
                            changesDetected = true;

                            catalogPublisher.OnDeleteIndividualProductsRequested(deletedListingsResult.DeletedListings);

                            List<ListingPublishStatus> statuses = new List<ListingPublishStatus>(deletedListingsResult.DeletedListings.Count);
                            catalogStatuses.Add(statuses);
                            foreach (ListingIdentity id in deletedListingsResult.DeletedListings)
                            {
                                ListingPublishStatus publishStatus = this.CreatePublishingStatus(
                                    catalog.RecordId,
                                    id.ProductId.Value,
                                    id.LanguageId,
                                    PublishingAction.Delete,
                                    id.Tag);

                                statuses.Add(publishStatus);
                            }
                        }
                    }
                    while (deletedListingsResult.HasMorePublishedListings.Value);

                    foreach (List<ListingPublishStatus> statusesPage in catalogStatuses)
                    {
                        await productManager.UpdateListingPublishingStatus(statusesPage);
                    }
                }

                return changesDetected;
            }

            private async Task<ManagerFactory> CreateManagerFactory()
            {
                AuthenticationContext authenticationContext = new AuthenticationContext(this.authority.ToString(), false);
                AuthenticationResult authResult = null;
                authResult = await authenticationContext.AcquireTokenAsync(RetailServerSpn, new ClientCredential(this.clientId, this.clientSecret));

                ClientCredentialsToken clientCredentialsToken = new ClientCredentialsToken(authResult.AccessToken);
                RetailServerContext retailServerContext = RetailServerContext.Create(this.retailServerUri, this.operatingUnitNumber, clientCredentialsToken);
                ManagerFactory factory = ManagerFactory.Create(retailServerContext);
                return factory;
            }
        }
    }
}