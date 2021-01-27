/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Entities;
using Contoso.Commerce.Client.Data.Services;
using Contoso.Commerce.Client.Data.Services.Authentication;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using Xamarin.Forms;
using Contoso.Commerce.Client.Localization;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Services
{
    public abstract class ServiceBase
    {
        protected ServiceBase(DataService dataService)
        {
            DataService = dataService;
        }

        protected DataService DataService { get; private set; }

        protected long ChannelId { get; private set; }

        protected string CountryRegionId { get; private set; }

        protected string Currency { get; private set; }

        protected string Locale
        {
            get
            {
                return DataService.ManagerFactory.Locale;
            }
            private set
            {
                DataService.ManagerFactory.Locale = value;
            }
        }

        protected async Task EnsureChannelSettingsRetrieved()
        {
            if (ChannelId == 0)
            {
                IOrgUnitManager orgUnitManager = DataService.ManagerFactory.GetManager<IOrgUnitManager>();
                ChannelConfiguration channelConfiguration = await orgUnitManager.GetOrgUnitConfiguration();
                ChannelId = channelConfiguration.RecordId;
                CountryRegionId = channelConfiguration.CountryRegionId;
                Currency = channelConfiguration.Currency;

                if (!channelConfiguration.Languages.Any(l => string.Equals(l.LanguageId, this.Locale, StringComparison.OrdinalIgnoreCase)))
                {
                    // If current locale is not supported by retail server then switch to default.
                    Locale = channelConfiguration.DefaultLanguageId;
                }
            }
        }

        protected async Task<IEnumerable<T>> GetAll<T>(Func<QueryResultSettings, Task<PagedResult<T>>> operation) where T : CommerceEntity
        {
            int top = 100;
            QueryResultSettings queryResultSettings = new QueryResultSettings { Paging = new PagingInfo { Top = top, Skip = 0 } };

            var resultList = new List<T>();
            PagedResult<T> pagedResult;
            do
            {
                pagedResult = await operation(queryResultSettings);
                resultList.AddRange(pagedResult.Results);
                queryResultSettings.Paging.Skip += top;
            } while (pagedResult.Count() == top);

            return resultList;
        }
    }
}