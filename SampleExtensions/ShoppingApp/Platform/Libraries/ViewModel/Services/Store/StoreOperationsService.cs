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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Services
{
    public class StoreOperationsService : ServiceBase
    {
        private List<CardTypeInfo> cardTypes = null;
        private List<CountryRegionInfo> countryList = null;

        public StoreOperationsService(DataService dataService) : base(dataService)
        {
        }

        public async Task EnsureCardTypes()
        {
            if (cardTypes == null)
            {
                IStoreOperationsManager storeOperationsManager = DataService.ManagerFactory.GetManager<IStoreOperationsManager>();
                cardTypes = (await this.GetAll<CardTypeInfo>(qs => storeOperationsManager.GetCardTypes(qs))).ToList();
            }
        }

        public string GetCardTypeFromCardPrefix(string cardPrefix)
        {
            List<CardTypeInfo> filteredCreditCardTypes = filterCreditCardTypes(cardPrefix);
            if (filteredCreditCardTypes.Count == 0)
            {
                return null;
            }

            return filteredCreditCardTypes[0]?.TypeId;
        }

        private List<CardTypeInfo> filterCreditCardTypes(string cardPrefix)
        {
            var filteredCardTypes = new List<CardTypeInfo>();

            foreach (var cardType in cardTypes)
            {
                // Check that the card type is credit card
                if (cardType.CardTypeValue != (int)CardType.InternationalCreditCard &&
                    cardType.CardTypeValue != (int)CardType.CorporateCard)
                {
                    continue;
                }

                if (this.IsAssociatedCardType(cardType, cardPrefix))
                {
                    filteredCardTypes.Add(cardType);
                }
            }

            return filteredCardTypes;
        }


        private bool IsAssociatedCardType(CardTypeInfo cardType, string cardNumber)
        {
            if (!string.IsNullOrWhiteSpace(cardNumber))
            {
                var maskNumFrom = ParseInt(cardType.NumberFrom);
                var maskNumTo = ParseInt(cardType.NumberTo);
                var maskLength = cardType.NumberFrom.Length;
                var cardSubStr = (cardNumber.Length > maskLength) ? ParseInt(cardNumber.Substring(0, maskLength)) : ParseInt(cardNumber);
                if ((maskNumFrom <= cardSubStr) && (cardSubStr <= maskNumTo)) {
                    return true;
                }
            }

            return false;
        }

        private int? ParseInt(string s)
        {
            int value;
            if (int.TryParse(s, out value))
            {
                return value;
            }
            return null;
        }

        public async Task<IEnumerable<CountryRegionInfo>> GetCountryRegions()
        {
            if (countryList == null)
            {
                await EnsureChannelSettingsRetrieved();

                QueryResultSettings queryResultSetting = new QueryResultSettings
                {
                    Paging = new PagingInfo { Top = 500, Skip = 0 }
                };

                IStoreOperationsManager storeOperationsManager = DataService.ManagerFactory.GetManager<IStoreOperationsManager>();

                countryList = (await storeOperationsManager.GetCountryRegionsByLanguageId(Locale, queryResultSetting)).Results.OrderBy(c => c.LongName).ToList();
                int index = countryList.FindIndex(c => c.CountryRegionId == CountryRegionId);
                if (index > 0)
                {
                    var country = countryList[index];
                    countryList.RemoveAt(index);
                    countryList.Insert(0, country);
                }
            }

            return countryList;
        }

        public async Task<IEnumerable<TenderType>> GetTenderTypes()
        {
            IStoreOperationsManager storeOperationsManager = DataService.ManagerFactory.GetManager<IStoreOperationsManager>();
            return await this.GetAll((qs) => storeOperationsManager.GetTenderTypes(qs));
        }
    }
}
