/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Contoso.Commerce.Client.Data.Entities;
using ViewModelEntities = Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Services
{
    public class CategoryService : ServiceBase
    {
        public CategoryService(DataService dataService) : base(dataService)
        {
        }

        private List<ViewModelEntities.Category> categories;

        /// <summary>
        /// Refresh items from the server.
        /// </summary>
        public Task Refresh()
        {
            return getAllCategories();
        }

        /// <summary>
        /// Gets sub categories.
        /// </summary>
        /// <param name="parentCategoryId">The id of the category for which the sub categories need to be retrieved.</param>
        /// <returns>A collection of categories.</returns>
        public async Task<IEnumerable<ViewModelEntities.Category>> GetSubCategoriesAsync(long? parentCategoryId)
        {
            if (categories == null)
            {
                await getAllCategories();
            }

            // Instead of showing the root category, show its children.
            if (parentCategoryId.GetValueOrDefault() == 0)
            {
                var rootCategorySet = subCategories(0);

                if (!rootCategorySet.Any())
                {
                    return Enumerable.Empty<ViewModelEntities.Category>();
                }

                parentCategoryId = rootCategorySet.First().Data.RecordId;
            }

            return subCategories(parentCategoryId.Value);
        }

        private async Task getAllCategories()
        {
            await EnsureChannelSettingsRetrieved();

            ICategoryManager manager = DataService.ManagerFactory.GetManager<ICategoryManager>();

            int top = 1000;
            QueryResultSettings queryResultSettings = new QueryResultSettings()
            {
                Paging = new PagingInfo { Skip = 0, Top = top }
            };

            categories = new List<ViewModelEntities.Category>();
            PagedResult<Category> categoryResult;

            do
            {
                categoryResult = await manager.GetCategories(ChannelId, queryResultSettings);
                categories.AddRange(categoryResult.Select(c => new ViewModelEntities.Category(c)));
                queryResultSettings.Paging.Skip += top;
            } while (categoryResult.Count() == top);

            foreach (var c in categories)
            {
                if (subCategories(c.Data.RecordId).Count() > 0)
                {
                    c.HasSubCategories = true;
                }
                else
                {
                    c.HasSubCategories = false;
                }
            }
        }

        private IEnumerable<ViewModelEntities.Category> subCategories(long parentCategoryId)
        {
            return categories.Where(cw => cw.Data.ParentCategory == parentCategoryId);
        }
    }
}
