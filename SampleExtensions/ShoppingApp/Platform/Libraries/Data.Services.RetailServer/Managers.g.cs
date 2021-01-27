/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client.Data.Services.RetailServer
{
    using Entities;
    using System;
    using System.CodeDom.Compiler;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;

    /// <summary>
    /// Class implements Store Operations Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class StoreOperationsManager : IStoreOperationsManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="StoreOperationsManager"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public StoreOperationsManager(IContext context)
        {
            this.context = context;
        }


        /// <summary>
        /// RoundAmountByTenderType method.
        /// </summary>
        /// <param name="amount">The amount.</param>
        /// <param name="tenderTypeId">The tenderTypeId.</param>
        /// <returns>decimal object.</returns>
        public async Task<decimal> RoundAmountByTenderType(decimal amount, string tenderTypeId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<decimal>(
                "",
                "StoreOperations",
                "RoundAmountByTenderType",
                true, null, OperationParameter.Create("amount", amount, false),
                  OperationParameter.Create("tenderTypeId", tenderTypeId, false));
        }

        /// <summary>
        /// StartSession method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        public async Task StartSession(string transactionId)
        {
            await this.context.ExecuteOperationAsync(
                "",
                "StoreOperations",
                "StartSession",
                true, OperationParameter.Create("transactionId", transactionId, false));
        }

        /// <summary>
        /// EndSession method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        public async Task EndSession(string transactionId)
        {
            await this.context.ExecuteOperationAsync(
                "",
                "StoreOperations",
                "EndSession",
                true, OperationParameter.Create("transactionId", transactionId, false));
        }

        /// <summary>
        /// ActivateDevice method.
        /// </summary>
        /// <param name="deviceNumber">The deviceNumber.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="deviceId">The deviceId.</param>
        /// <param name="forceActivate">The forceActivate.</param>
        /// <param name="deviceType">The deviceType.</param>
        /// <returns>DeviceActivationResult object.</returns>
        public async Task<DeviceActivationResult> ActivateDevice(string deviceNumber, string terminalId, string deviceId, bool forceActivate, int? deviceType)
        {
            return await this.context.ExecuteOperationSingleResultAsync<DeviceActivationResult>(
                "",
                "StoreOperations",
                "ActivateDevice",
                true, null, OperationParameter.Create("deviceNumber", deviceNumber, false),
                  OperationParameter.Create("terminalId", terminalId, false),
                  OperationParameter.Create("deviceId", deviceId, false),
                  OperationParameter.Create("forceActivate", forceActivate, false),
                  OperationParameter.Create("deviceType", deviceType, false));
        }

        /// <summary>
        /// DeactivateDevice method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        public async Task DeactivateDevice(string transactionId)
        {
            await this.context.ExecuteOperationAsync(
                "",
                "StoreOperations",
                "DeactivateDevice",
                true, OperationParameter.Create("transactionId", transactionId, false));
        }

        /// <summary>
        /// CreateHardwareStationToken method.
        /// </summary>
        /// <returns>CreateHardwareStationTokenResult object.</returns>
        public async Task<CreateHardwareStationTokenResult> CreateHardwareStationToken()
        {
            return await this.context.ExecuteOperationSingleResultAsync<CreateHardwareStationTokenResult>(
                "",
                "StoreOperations",
                "CreateHardwareStationToken",
                true, null);
        }

        /// <summary>
        /// ValidateHardwareStationToken method.
        /// </summary>
        /// <param name="deviceNumber">The deviceNumber.</param>
        /// <param name="hardwareStationToken">The hardwareStationToken.</param>
        /// <returns>ValidateHardwareStationTokenResult object.</returns>
        public async Task<ValidateHardwareStationTokenResult> ValidateHardwareStationToken(string deviceNumber, string hardwareStationToken)
        {
            return await this.context.ExecuteOperationSingleResultAsync<ValidateHardwareStationTokenResult>(
                "",
                "StoreOperations",
                "ValidateHardwareStationToken",
                true, null, OperationParameter.Create("deviceNumber", deviceNumber, false),
                  OperationParameter.Create("hardwareStationToken", hardwareStationToken, false));
        }

        /// <summary>
        /// GetBarcodeById method.
        /// </summary>
        /// <param name="barcodeId">The barcodeId.</param>
        /// <returns>Barcode object.</returns>
        public async Task<Barcode> GetBarcodeById(string barcodeId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Barcode>(
                "",
                "StoreOperations",
                "GetBarcodeById",
                true, null, OperationParameter.Create("barcodeId", barcodeId, false));
        }

        /// <summary>
        /// GetButtonGridById method.
        /// </summary>
        /// <param name="buttonGridId">The buttonGridId.</param>
        /// <returns>ButtonGrid object.</returns>
        public async Task<ButtonGrid> GetButtonGridById(string buttonGridId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<ButtonGrid>(
                "",
                "StoreOperations",
                "GetButtonGridById",
                true, null, OperationParameter.Create("buttonGridId", buttonGridId, false));
        }

        /// <summary>
        /// GetButtonGridsByIds method.
        /// </summary>
        /// <param name="getButtonGridsByIdsCriteria">The getButtonGridsByIdsCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ButtonGrid.</returns>
        public async Task<PagedResult<ButtonGrid>> GetButtonGridsByIds(GetButtonGridsByIdsCriteria getButtonGridsByIdsCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ButtonGrid>(
                "",
                "StoreOperations",
                "GetButtonGridsByIds",
                true, queryResultSettings, null, OperationParameter.Create("getButtonGridsByIdsCriteria", getButtonGridsByIdsCriteria, false));
        }

        /// <summary>
        /// GetCardTypes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CardTypeInfo.</returns>
        public async Task<PagedResult<CardTypeInfo>> GetCardTypes(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<CardTypeInfo>(
                "",
                "StoreOperations",
                "GetCardTypes",
                true, queryResultSettings, null);
        }

        /// <summary>
        /// GetSupportedPaymentCardTypes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of string.</returns>
        public async Task<PagedResult<string>> GetSupportedPaymentCardTypes(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<string>(
                "",
                "StoreOperations",
                "GetSupportedPaymentCardTypes",
                true, queryResultSettings, null);
        }

        /// <summary>
        /// GetCities method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="stateProvinceId">The stateProvinceId.</param>
        /// <param name="countyId">The countyId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CityInfo.</returns>
        public async Task<PagedResult<CityInfo>> GetCities(string countryRegionId, string stateProvinceId, string countyId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<CityInfo>(
                "",
                "StoreOperations",
                "GetCities",
                true, queryResultSettings, null, OperationParameter.Create("countryRegionId", countryRegionId, false),
                  OperationParameter.Create("stateProvinceId", stateProvinceId, false),
                  OperationParameter.Create("countyId", countyId, false));
        }

        /// <summary>
        /// GetCountryRegionsByLanguageId method.
        /// </summary>
        /// <param name="languageId">The languageId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CountryRegionInfo.</returns>
        public async Task<PagedResult<CountryRegionInfo>> GetCountryRegionsByLanguageId(string languageId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<CountryRegionInfo>(
                "",
                "StoreOperations",
                "GetCountryRegionsByLanguageId",
                true, queryResultSettings, null, OperationParameter.Create("languageId", languageId, false));
        }

        /// <summary>
        /// GetCounties method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="stateProvinceId">The stateProvinceId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CountyInfo.</returns>
        public async Task<PagedResult<CountyInfo>> GetCounties(string countryRegionId, string stateProvinceId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<CountyInfo>(
                "",
                "StoreOperations",
                "GetCounties",
                true, queryResultSettings, null, OperationParameter.Create("countryRegionId", countryRegionId, false),
                  OperationParameter.Create("stateProvinceId", stateProvinceId, false));
        }

        /// <summary>
        /// GetCreditMemoById method.
        /// </summary>
        /// <param name="creditMemoId">The creditMemoId.</param>
        /// <returns>CreditMemo object.</returns>
        public async Task<CreditMemo> GetCreditMemoById(string creditMemoId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CreditMemo>(
                "",
                "StoreOperations",
                "GetCreditMemoById",
                true, null, OperationParameter.Create("creditMemoId", creditMemoId, false));
        }

        /// <summary>
        /// GetDownloadInterval method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <returns>string object.</returns>
        public async Task<string> GetDownloadInterval(string dataStoreName)
        {
            return await this.context.ExecuteOperationSingleResultAsync<string>(
                "",
                "StoreOperations",
                "GetDownloadInterval",
                true, null, OperationParameter.Create("dataStoreName", dataStoreName, false));
        }

        /// <summary>
        /// GetTerminalDataStoreName method.
        /// </summary>
        /// <param name="terminalId">The terminalId.</param>
        /// <returns>string object.</returns>
        public async Task<string> GetTerminalDataStoreName(string terminalId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<string>(
                "",
                "StoreOperations",
                "GetTerminalDataStoreName",
                true, null, OperationParameter.Create("terminalId", terminalId, false));
        }

        /// <summary>
        /// GetDownloadLink method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <param name="downloadSessionId">The downloadSessionId.</param>
        /// <returns>string object.</returns>
        public async Task<string> GetDownloadLink(string dataStoreName, long downloadSessionId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<string>(
                "",
                "StoreOperations",
                "GetDownloadLink",
                true, null, OperationParameter.Create("dataStoreName", dataStoreName, false),
                  OperationParameter.Create("downloadSessionId", downloadSessionId, false));
        }

        /// <summary>
        /// GetDownloadSessions method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DownloadSession.</returns>
        public async Task<PagedResult<DownloadSession>> GetDownloadSessions(string dataStoreName, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<DownloadSession>(
                "",
                "StoreOperations",
                "GetDownloadSessions",
                true, queryResultSettings, null, OperationParameter.Create("dataStoreName", dataStoreName, false));
        }

        /// <summary>
        /// GetInitialDownloadSessions method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DownloadSession.</returns>
        public async Task<PagedResult<DownloadSession>> GetInitialDownloadSessions(string dataStoreName, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<DownloadSession>(
                "",
                "StoreOperations",
                "GetInitialDownloadSessions",
                true, queryResultSettings, null, OperationParameter.Create("dataStoreName", dataStoreName, false));
        }

        /// <summary>
        /// GetUploadJobDefinitions method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of string.</returns>
        public async Task<PagedResult<string>> GetUploadJobDefinitions(string dataStoreName, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<string>(
                "",
                "StoreOperations",
                "GetUploadJobDefinitions",
                true, queryResultSettings, null, OperationParameter.Create("dataStoreName", dataStoreName, false));
        }

        /// <summary>
        /// GetUploadInterval method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <returns>string object.</returns>
        public async Task<string> GetUploadInterval(string dataStoreName)
        {
            return await this.context.ExecuteOperationSingleResultAsync<string>(
                "",
                "StoreOperations",
                "GetUploadInterval",
                true, null, OperationParameter.Create("dataStoreName", dataStoreName, false));
        }

        /// <summary>
        /// PostOfflineTransactions method.
        /// </summary>
        /// <param name="offlineTransactionForMPOS">The offlineTransactionForMPOS.</param>
        /// <returns>bool object.</returns>
        public async Task<bool> PostOfflineTransactions(IEnumerable<string> offlineTransactionForMPOS)
        {
            return await this.context.ExecuteOperationSingleResultAsync<bool>(
                "",
                "StoreOperations",
                "PostOfflineTransactions",
                true, null, OperationParameter.Create("offlineTransactionForMPOS", offlineTransactionForMPOS, false));
        }

        /// <summary>
        /// GetRetailTrialPlanOffer method.
        /// </summary>
        /// <returns>bool object.</returns>
        public async Task<bool> GetRetailTrialPlanOffer()
        {
            return await this.context.ExecuteOperationSingleResultAsync<bool>(
                "",
                "StoreOperations",
                "GetRetailTrialPlanOffer",
                true, null);
        }

        /// <summary>
        /// GetLatestNumberSequence method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of NumberSequenceSeedData.</returns>
        public async Task<PagedResult<NumberSequenceSeedData>> GetLatestNumberSequence(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<NumberSequenceSeedData>(
                "",
                "StoreOperations",
                "GetLatestNumberSequence",
                true, queryResultSettings, null);
        }

        /// <summary>
        /// CalculateTotalCurrencyAmount method.
        /// </summary>
        /// <param name="currenciesAmount">The currenciesAmount.</param>
        /// <returns>CurrencyAmount object.</returns>
        public async Task<CurrencyAmount> CalculateTotalCurrencyAmount(IEnumerable<CurrencyRequest> currenciesAmount)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CurrencyAmount>(
                "",
                "StoreOperations",
                "CalculateTotalCurrencyAmount",
                true, null, OperationParameter.Create("currenciesAmount", currenciesAmount, false));
        }

        /// <summary>
        /// GetDiscountCode method.
        /// </summary>
        /// <param name="discountCode">The discountCode.</param>
        /// <returns>DiscountCode object.</returns>
        public async Task<DiscountCode> GetDiscountCode(string discountCode)
        {
            return await this.context.ExecuteOperationSingleResultAsync<DiscountCode>(
                "",
                "StoreOperations",
                "GetDiscountCode",
                true, null, OperationParameter.Create("discountCode", discountCode, false));
        }

        /// <summary>
        /// GetDiscountCodesByOfferId method.
        /// </summary>
        /// <param name="offerId">The offerId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DiscountCode.</returns>
        public async Task<PagedResult<DiscountCode>> GetDiscountCodesByOfferId(string offerId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<DiscountCode>(
                "",
                "StoreOperations",
                "GetDiscountCodesByOfferId",
                true, queryResultSettings, null, OperationParameter.Create("offerId", offerId, false));
        }

        /// <summary>
        /// GetDiscountCodesByKeyword method.
        /// </summary>
        /// <param name="keyword">The keyword.</param>
        /// <param name="activeDate">The activeDate.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DiscountCode.</returns>
        public async Task<PagedResult<DiscountCode>> GetDiscountCodesByKeyword(string keyword, DateTimeOffset activeDate, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<DiscountCode>(
                "",
                "StoreOperations",
                "GetDiscountCodesByKeyword",
                true, queryResultSettings, null, OperationParameter.Create("keyword", keyword, false),
                  OperationParameter.Create("activeDate", activeDate, false));
        }

        /// <summary>
        /// GetDistricts method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="stateProvinceId">The stateProvinceId.</param>
        /// <param name="countyId">The countyId.</param>
        /// <param name="cityName">The cityName.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DistrictInfo.</returns>
        public async Task<PagedResult<DistrictInfo>> GetDistricts(string countryRegionId, string stateProvinceId, string countyId, string cityName, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<DistrictInfo>(
                "",
                "StoreOperations",
                "GetDistricts",
                true, queryResultSettings, null, OperationParameter.Create("countryRegionId", countryRegionId, false),
                  OperationParameter.Create("stateProvinceId", stateProvinceId, false),
                  OperationParameter.Create("countyId", countyId, false),
                  OperationParameter.Create("cityName", cityName, false));
        }

        /// <summary>
        /// GetHardwareStationProfiles method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of HardwareStationProfile.</returns>
        public async Task<PagedResult<HardwareStationProfile>> GetHardwareStationProfiles(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<HardwareStationProfile>(
                "",
                "StoreOperations",
                "GetHardwareStationProfiles",
                true, queryResultSettings, null);
        }

        /// <summary>
        /// GetHardwareProfileById method.
        /// </summary>
        /// <param name="hardwareProfileId">The hardwareProfileId.</param>
        /// <returns>HardwareProfile object.</returns>
        public async Task<HardwareProfile> GetHardwareProfileById(string hardwareProfileId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<HardwareProfile>(
                "",
                "StoreOperations",
                "GetHardwareProfileById",
                true, null, OperationParameter.Create("hardwareProfileId", hardwareProfileId, false));
        }

        /// <summary>
        /// GetLocalizedStrings method.
        /// </summary>
        /// <param name="languageId">The languageId.</param>
        /// <param name="textId">The textId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of LocalizedString.</returns>
        public async Task<PagedResult<LocalizedString>> GetLocalizedStrings(string languageId, int? textId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<LocalizedString>(
                "",
                "StoreOperations",
                "GetLocalizedStrings",
                true, queryResultSettings, null, OperationParameter.Create("languageId", languageId, false),
                  OperationParameter.Create("textId", textId, false));
        }

        /// <summary>
        /// GetOperationPermissionById method.
        /// </summary>
        /// <param name="operationId">The operationId.</param>
        /// <returns>OperationPermission object.</returns>
        public async Task<OperationPermission> GetOperationPermissionById(int operationId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<OperationPermission>(
                "",
                "StoreOperations",
                "GetOperationPermissionById",
                true, null, OperationParameter.Create("operationId", operationId, false));
        }

        /// <summary>
        /// GetReasonCodesById method.
        /// </summary>
        /// <param name="reasonCodeGroupId">The reasonCodeGroupId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ReasonCode.</returns>
        public async Task<PagedResult<ReasonCode>> GetReasonCodesById(string reasonCodeGroupId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ReasonCode>(
                "",
                "StoreOperations",
                "GetReasonCodesById",
                true, queryResultSettings, null, OperationParameter.Create("reasonCodeGroupId", reasonCodeGroupId, false));
        }

        /// <summary>
        /// SearchReportDataSet method.
        /// </summary>
        /// <param name="reportId">The reportId.</param>
        /// <param name="parameters">The parameters.</param>
        /// <returns>ReportDataSet object.</returns>
        public async Task<ReportDataSet> SearchReportDataSet(string reportId, IEnumerable<CommerceProperty> parameters)
        {
            return await this.context.ExecuteOperationSingleResultAsync<ReportDataSet>(
                "",
                "StoreOperations",
                "SearchReportDataSet",
                true, null, OperationParameter.Create("reportId", reportId, false),
                  OperationParameter.Create("parameters", parameters, false));
        }

        /// <summary>
        /// GetReportDataSetById method.
        /// </summary>
        /// <param name="reportId">The reportId.</param>
        /// <returns>ReportDataSet object.</returns>
        public async Task<ReportDataSet> GetReportDataSetById(string reportId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<ReportDataSet>(
                "",
                "StoreOperations",
                "GetReportDataSetById",
                true, null, OperationParameter.Create("reportId", reportId, false));
        }

        /// <summary>
        /// GetIncomeExpenseAccounts method.
        /// </summary>
        /// <param name="incomeExpenseAccountType">The incomeExpenseAccountType.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of IncomeExpenseAccount.</returns>
        public async Task<PagedResult<IncomeExpenseAccount>> GetIncomeExpenseAccounts(int incomeExpenseAccountType, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<IncomeExpenseAccount>(
                "",
                "StoreOperations",
                "GetIncomeExpenseAccounts",
                true, queryResultSettings, null, OperationParameter.Create("incomeExpenseAccountType", incomeExpenseAccountType, false));
        }

        /// <summary>
        /// GetStateProvinces method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of StateProvinceInfo.</returns>
        public async Task<PagedResult<StateProvinceInfo>> GetStateProvinces(string countryRegionId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<StateProvinceInfo>(
                "",
                "StoreOperations",
                "GetStateProvinces",
                true, queryResultSettings, null, OperationParameter.Create("countryRegionId", countryRegionId, false));
        }

        /// <summary>
        /// GetZipCodes method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="stateProvinceId">The stateProvinceId.</param>
        /// <param name="countyId">The countyId.</param>
        /// <param name="cityName">The cityName.</param>
        /// <param name="district">The district.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ZipCodeInfo.</returns>
        public async Task<PagedResult<ZipCodeInfo>> GetZipCodes(string countryRegionId, string stateProvinceId, string countyId, string cityName, string district, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ZipCodeInfo>(
                "",
                "StoreOperations",
                "GetZipCodes",
                true, queryResultSettings, null, OperationParameter.Create("countryRegionId", countryRegionId, false),
                  OperationParameter.Create("stateProvinceId", stateProvinceId, false),
                  OperationParameter.Create("countyId", countyId, false),
                  OperationParameter.Create("cityName", cityName, false),
                  OperationParameter.Create("district", district, false));
        }

        /// <summary>
        /// GetAddressFromZipCode method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="zipPostalCode">The zipPostalCode.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ZipCodeInfo.</returns>
        public async Task<PagedResult<ZipCodeInfo>> GetAddressFromZipCode(string countryRegionId, string zipPostalCode, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ZipCodeInfo>(
                "",
                "StoreOperations",
                "GetAddressFromZipCode",
                true, queryResultSettings, null, OperationParameter.Create("countryRegionId", countryRegionId, false),
                  OperationParameter.Create("zipPostalCode", zipPostalCode, false));
        }

        /// <summary>
        /// DisassembleKitTransactions method.
        /// </summary>
        /// <param name="kitTransaction">The kitTransaction.</param>
        /// <returns>KitTransaction object.</returns>
        public async Task<KitTransaction> DisassembleKitTransactions(KitTransaction kitTransaction)
        {
            return await this.context.ExecuteOperationSingleResultAsync<KitTransaction>(
                "",
                "StoreOperations",
                "DisassembleKitTransactions",
                true, null, OperationParameter.Create("kitTransaction", kitTransaction, false));
        }

        /// <summary>
        /// IssueLoyaltyCard method.
        /// </summary>
        /// <param name="loyaltyCard">The loyaltyCard.</param>
        /// <returns>LoyaltyCard object.</returns>
        public async Task<LoyaltyCard> IssueLoyaltyCard(LoyaltyCard loyaltyCard)
        {
            return await this.context.ExecuteOperationSingleResultAsync<LoyaltyCard>(
                "",
                "StoreOperations",
                "IssueLoyaltyCard",
                true, null, OperationParameter.Create("loyaltyCard", loyaltyCard, false));
        }

        /// <summary>
        /// GetLoyaltyCard method.
        /// </summary>
        /// <param name="cardNumber">The cardNumber.</param>
        /// <returns>LoyaltyCard object.</returns>
        public async Task<LoyaltyCard> GetLoyaltyCard(string cardNumber)
        {
            return await this.context.ExecuteOperationSingleResultAsync<LoyaltyCard>(
                "",
                "StoreOperations",
                "GetLoyaltyCard",
                true, null, OperationParameter.Create("cardNumber", cardNumber, false));
        }

        /// <summary>
        /// GetCustomerLoyaltyCards method.
        /// </summary>
        /// <param name="accountNumber">The accountNumber.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of LoyaltyCard.</returns>
        public async Task<PagedResult<LoyaltyCard>> GetCustomerLoyaltyCards(string accountNumber, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<LoyaltyCard>(
                "",
                "StoreOperations",
                "GetCustomerLoyaltyCards",
                true, queryResultSettings, null, OperationParameter.Create("accountNumber", accountNumber, false));
        }

        /// <summary>
        /// GetLoyaltyCardTransactions method.
        /// </summary>
        /// <param name="cardNumber">The cardNumber.</param>
        /// <param name="rewardPointId">The rewardPointId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of LoyaltyCardTransaction.</returns>
        public async Task<PagedResult<LoyaltyCardTransaction>> GetLoyaltyCardTransactions(string cardNumber, string rewardPointId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<LoyaltyCardTransaction>(
                "",
                "StoreOperations",
                "GetLoyaltyCardTransactions",
                true, queryResultSettings, null, OperationParameter.Create("cardNumber", cardNumber, false),
                  OperationParameter.Create("rewardPointId", rewardPointId, false));
        }

        /// <summary>
        /// SearchJournalTransactions method.
        /// </summary>
        /// <param name="searchCriteria">The searchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Transaction.</returns>
        public async Task<PagedResult<Transaction>> SearchJournalTransactions(TransactionSearchCriteria searchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Transaction>(
                "",
                "StoreOperations",
                "SearchJournalTransactions",
                true, queryResultSettings, null, OperationParameter.Create("searchCriteria", searchCriteria, false));
        }

        /// <summary>
        /// GetGiftCard method.
        /// </summary>
        /// <param name="giftCardId">The giftCardId.</param>
        /// <returns>GiftCard object.</returns>
        public async Task<GiftCard> GetGiftCard(string giftCardId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<GiftCard>(
                "",
                "StoreOperations",
                "GetGiftCard",
                true, null, OperationParameter.Create("giftCardId", giftCardId, false));
        }

        /// <summary>
        /// GetNonSalesTransactions method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="shiftTerminalId">The shiftTerminalId.</param>
        /// <param name="nonSalesTenderTypeValue">The nonSalesTenderTypeValue.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of NonSalesTransaction.</returns>
        public async Task<PagedResult<NonSalesTransaction>> GetNonSalesTransactions(string shiftId, string shiftTerminalId, int nonSalesTenderTypeValue, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<NonSalesTransaction>(
                "",
                "StoreOperations",
                "GetNonSalesTransactions",
                true, queryResultSettings, null, OperationParameter.Create("shiftId", shiftId, false),
                  OperationParameter.Create("shiftTerminalId", shiftTerminalId, false),
                  OperationParameter.Create("nonSalesTenderTypeValue", nonSalesTenderTypeValue, false));
        }

        /// <summary>
        /// CreateNonSalesTransaction method.
        /// </summary>
        /// <param name="nonSalesTransaction">The nonSalesTransaction.</param>
        /// <returns>NonSalesTransaction object.</returns>
        public async Task<NonSalesTransaction> CreateNonSalesTransaction(NonSalesTransaction nonSalesTransaction)
        {
            return await this.context.ExecuteOperationSingleResultAsync<NonSalesTransaction>(
                "",
                "StoreOperations",
                "CreateNonSalesTransaction",
                true, null, OperationParameter.Create("nonSalesTransaction", nonSalesTransaction, false));
        }

        /// <summary>
        /// CreateDropAndDeclareTransaction method.
        /// </summary>
        /// <param name="dropAndDeclareTransaction">The dropAndDeclareTransaction.</param>
        /// <returns>DropAndDeclareTransaction object.</returns>
        public async Task<DropAndDeclareTransaction> CreateDropAndDeclareTransaction(DropAndDeclareTransaction dropAndDeclareTransaction)
        {
            return await this.context.ExecuteOperationSingleResultAsync<DropAndDeclareTransaction>(
                "",
                "StoreOperations",
                "CreateDropAndDeclareTransaction",
                true, null, OperationParameter.Create("dropAndDeclareTransaction", dropAndDeclareTransaction, false));
        }

        /// <summary>
        /// GetTaxOverrides method.
        /// </summary>
        /// <param name="overrideBy">The overrideBy.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of TaxOverride.</returns>
        public async Task<PagedResult<TaxOverride>> GetTaxOverrides(string overrideBy, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<TaxOverride>(
                "",
                "StoreOperations",
                "GetTaxOverrides",
                true, queryResultSettings, null, OperationParameter.Create("overrideBy", overrideBy, false));
        }

        /// <summary>
        /// GetCustomerBalance method.
        /// </summary>
        /// <param name="accountNumber">The accountNumber.</param>
        /// <param name="invoiceAccountNumber">The invoiceAccountNumber.</param>
        /// <returns>CustomerBalances object.</returns>
        public async Task<CustomerBalances> GetCustomerBalance(string accountNumber, string invoiceAccountNumber)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CustomerBalances>(
                "",
                "StoreOperations",
                "GetCustomerBalance",
                true, null, OperationParameter.Create("accountNumber", accountNumber, false),
                  OperationParameter.Create("invoiceAccountNumber", invoiceAccountNumber, false));
        }

        /// <summary>
        /// InitiateLinkToExistingCustomer method.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <param name="emailTemplateId">The emailTemplateId.</param>
        /// <param name="emailProperties">The emailProperties.</param>
        /// <returns>LinkToExistingCustomerResult object.</returns>
        public async Task<LinkToExistingCustomerResult> InitiateLinkToExistingCustomer(string email, string emailTemplateId, IEnumerable<NameValuePair> emailProperties)
        {
            return await this.context.ExecuteOperationSingleResultAsync<LinkToExistingCustomerResult>(
                "",
                "StoreOperations",
                "InitiateLinkToExistingCustomer",
                true, null, OperationParameter.Create("email", email, false),
                  OperationParameter.Create("emailTemplateId", emailTemplateId, false),
                  OperationParameter.Create("emailProperties", emailProperties, false));
        }

        /// <summary>
        /// FinalizeLinkToExistingCustomer method.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <returns>LinkToExistingCustomerResult object.</returns>
        public async Task<LinkToExistingCustomerResult> FinalizeLinkToExistingCustomer(string email)
        {
            return await this.context.ExecuteOperationSingleResultAsync<LinkToExistingCustomerResult>(
                "",
                "StoreOperations",
                "FinalizeLinkToExistingCustomer",
                true, null, OperationParameter.Create("email", email, false));
        }

        /// <summary>
        /// UnlinkFromExistingCustomer method.
        /// </summary>
        public async Task UnlinkFromExistingCustomer()
        {
            await this.context.ExecuteOperationAsync(
                "",
                "StoreOperations",
                "UnlinkFromExistingCustomer",
                true);
        }

        /// <summary>
        /// GetOfflineSyncStatus method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OfflineSyncStatsLine.</returns>
        public async Task<PagedResult<OfflineSyncStatsLine>> GetOfflineSyncStatus(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<OfflineSyncStatsLine>(
                "",
                "StoreOperations",
                "GetOfflineSyncStatus",
                true, queryResultSettings, null);
        }

        /// <summary>
        /// GetOfflinePendingTransactionCount method.
        /// </summary>
        /// <returns>long object.</returns>
        public async Task<long> GetOfflinePendingTransactionCount()
        {
            return await this.context.ExecuteOperationSingleResultAsync<long>(
                "",
                "StoreOperations",
                "GetOfflinePendingTransactionCount",
                true, null);
        }

        /// <summary>
        /// UpdateDownloadSession method.
        /// </summary>
        /// <param name="downloadSession">The downloadSession.</param>
        /// <returns>bool object.</returns>
        public async Task<bool> UpdateDownloadSession(DownloadSession downloadSession)
        {
            return await this.context.ExecuteOperationSingleResultAsync<bool>(
                "",
                "StoreOperations",
                "UpdateDownloadSession",
                true, null, OperationParameter.Create("downloadSession", downloadSession, false));
        }

        /// <summary>
        /// UpdateApplicationVersion method.
        /// </summary>
        /// <param name="appVersion">The appVersion.</param>
        public async Task UpdateApplicationVersion(string appVersion)
        {
            await this.context.ExecuteOperationAsync(
                "",
                "StoreOperations",
                "UpdateApplicationVersion",
                true, OperationParameter.Create("appVersion", appVersion, false));
        }

        /// <summary>
        /// GetStorageAccessTokenForUpload method.
        /// </summary>
        /// <returns>StorageAccessToken object.</returns>
        public async Task<StorageAccessToken> GetStorageAccessTokenForUpload()
        {
            return await this.context.ExecuteOperationSingleResultAsync<StorageAccessToken>(
                "",
                "StoreOperations",
                "GetStorageAccessTokenForUpload",
                true, null);
        }

        /// <summary>
        /// GetBusinessProcessModelLibraries method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Framework.</returns>
        public async Task<PagedResult<Framework>> GetBusinessProcessModelLibraries(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Framework>(
                "",
                "StoreOperations",
                "GetBusinessProcessModelLibraries",
                true, queryResultSettings, null);
        }

        /// <summary>
        /// GetBusinessProcessModelLibrary method.
        /// </summary>
        /// <param name="businessProcessModelFrameworkLineId">The businessProcessModelFrameworkLineId.</param>
        /// <param name="hierarchyDepth">The hierarchyDepth.</param>
        /// <returns>Framework object.</returns>
        public async Task<Framework> GetBusinessProcessModelLibrary(int businessProcessModelFrameworkLineId, int hierarchyDepth)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Framework>(
                "",
                "StoreOperations",
                "GetBusinessProcessModelLibrary",
                true, null, OperationParameter.Create("businessProcessModelFrameworkLineId", businessProcessModelFrameworkLineId, false),
                  OperationParameter.Create("hierarchyDepth", hierarchyDepth, false));
        }

        /// <summary>
        /// SearchTaskGuidesByTitle method.
        /// </summary>
        /// <param name="businessProcessModelFrameworkLineId">The businessProcessModelFrameworkLineId.</param>
        /// <param name="taskGuideSearchText">The taskGuideSearchText.</param>
        /// <param name="queryTypeValue">The queryTypeValue.</param>
        /// <returns>TaskGuidesSearchResult object.</returns>
        public async Task<TaskGuidesSearchResult> SearchTaskGuidesByTitle(int businessProcessModelFrameworkLineId, string taskGuideSearchText, int queryTypeValue)
        {
            return await this.context.ExecuteOperationSingleResultAsync<TaskGuidesSearchResult>(
                "",
                "StoreOperations",
                "SearchTaskGuidesByTitle",
                true, null, OperationParameter.Create("businessProcessModelFrameworkLineId", businessProcessModelFrameworkLineId, false),
                  OperationParameter.Create("taskGuideSearchText", taskGuideSearchText, false),
                  OperationParameter.Create("queryTypeValue", queryTypeValue, false));
        }

        /// <summary>
        /// GenerateBusinessProcessModelPackage method.
        /// </summary>
        /// <param name="taskRecording">The taskRecording.</param>
        /// <returns>string object.</returns>
        public async Task<string> GenerateBusinessProcessModelPackage(Recording taskRecording)
        {
            return await this.context.ExecuteOperationSingleResultAsync<string>(
                "",
                "StoreOperations",
                "GenerateBusinessProcessModelPackage",
                true, null, OperationParameter.Create("taskRecording", taskRecording, false));
        }

        /// <summary>
        /// DownloadRecording method.
        /// </summary>
        /// <param name="businessProcessModelLineId">The businessProcessModelLineId.</param>
        /// <returns>Recording object.</returns>
        public async Task<Recording> DownloadRecording(int businessProcessModelLineId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Recording>(
                "",
                "StoreOperations",
                "DownloadRecording",
                true, null, OperationParameter.Create("businessProcessModelLineId", businessProcessModelLineId, false));
        }

        /// <summary>
        /// LoadRecordingFromFile method.
        /// </summary>
        /// <param name="recordingUrl">The recordingUrl.</param>
        /// <returns>Recording object.</returns>
        public async Task<Recording> LoadRecordingFromFile(string recordingUrl)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Recording>(
                "",
                "StoreOperations",
                "LoadRecordingFromFile",
                true, null, OperationParameter.Create("recordingUrl", recordingUrl, false));
        }

        /// <summary>
        /// GenerateRecordingFile method.
        /// </summary>
        /// <param name="taskRecording">The taskRecording.</param>
        /// <returns>string object.</returns>
        public async Task<string> GenerateRecordingFile(Recording taskRecording)
        {
            return await this.context.ExecuteOperationSingleResultAsync<string>(
                "",
                "StoreOperations",
                "GenerateRecordingFile",
                true, null, OperationParameter.Create("taskRecording", taskRecording, false));
        }

        /// <summary>
        /// GenerateTrainingDocument method.
        /// </summary>
        /// <param name="taskRecording">The taskRecording.</param>
        /// <returns>string object.</returns>
        public async Task<string> GenerateTrainingDocument(Recording taskRecording)
        {
            return await this.context.ExecuteOperationSingleResultAsync<string>(
                "",
                "StoreOperations",
                "GenerateTrainingDocument",
                true, null, OperationParameter.Create("taskRecording", taskRecording, false));
        }

        /// <summary>
        /// GenerateRecordingBundle method.
        /// </summary>
        /// <param name="taskRecording">The taskRecording.</param>
        /// <returns>string object.</returns>
        public async Task<string> GenerateRecordingBundle(Recording taskRecording)
        {
            return await this.context.ExecuteOperationSingleResultAsync<string>(
                "",
                "StoreOperations",
                "GenerateRecordingBundle",
                true, null, OperationParameter.Create("taskRecording", taskRecording, false));
        }

        /// <summary>
        /// UploadRecording method.
        /// </summary>
        /// <param name="taskRecording">The taskRecording.</param>
        /// <param name="businessProcessModelLineId">The businessProcessModelLineId.</param>
        public async Task UploadRecording(Recording taskRecording, int businessProcessModelLineId)
        {
            await this.context.ExecuteOperationAsync(
                "",
                "StoreOperations",
                "UploadRecording",
                true, OperationParameter.Create("taskRecording", taskRecording, false),
                  OperationParameter.Create("businessProcessModelLineId", businessProcessModelLineId, false));
        }

        /// <summary>
        /// GetButtonGrids method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ButtonGrid.</returns>
        public async Task<PagedResult<ButtonGrid>> GetButtonGrids(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ButtonGrid>(
                "",
                "StoreOperations",
                "GetButtonGrids",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetCashDeclarations method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CashDeclaration.</returns>
        public async Task<PagedResult<CashDeclaration>> GetCashDeclarations(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<CashDeclaration>(
                "",
                "StoreOperations",
                "GetCashDeclarations",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetCountryRegions method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CountryRegionInfo.</returns>
        public async Task<PagedResult<CountryRegionInfo>> GetCountryRegions(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<CountryRegionInfo>(
                "",
                "StoreOperations",
                "GetCountryRegions",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetCustomerGroups method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CustomerGroup.</returns>
        public async Task<PagedResult<CustomerGroup>> GetCustomerGroups(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<CustomerGroup>(
                "",
                "StoreOperations",
                "GetCustomerGroups",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetDeliveryOptions method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DeliveryOption.</returns>
        public async Task<PagedResult<DeliveryOption>> GetDeliveryOptions(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<DeliveryOption>(
                "",
                "StoreOperations",
                "GetDeliveryOptions",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetEnvironmentConfiguration method.
        /// </summary>
        /// <returns>EnvironmentConfiguration object.</returns>
        public async Task<EnvironmentConfiguration> GetEnvironmentConfiguration()
        {
            return await this.context.ExecuteOperationSingleResultAsync<EnvironmentConfiguration>(
                "",
                "StoreOperations",
                "GetEnvironmentConfiguration",
                false, null);
        }

        /// <summary>
        /// GetDeviceConfiguration method.
        /// </summary>
        /// <returns>DeviceConfiguration object.</returns>
        public async Task<DeviceConfiguration> GetDeviceConfiguration()
        {
            return await this.context.ExecuteOperationSingleResultAsync<DeviceConfiguration>(
                "",
                "StoreOperations",
                "GetDeviceConfiguration",
                false, null);
        }

        /// <summary>
        /// GetLanguages method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SupportedLanguage.</returns>
        public async Task<PagedResult<SupportedLanguage>> GetLanguages(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SupportedLanguage>(
                "",
                "StoreOperations",
                "GetLanguages",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetAffiliations method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Affiliation.</returns>
        public async Task<PagedResult<Affiliation>> GetAffiliations(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Affiliation>(
                "",
                "StoreOperations",
                "GetAffiliations",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetOperationPermissions method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OperationPermission.</returns>
        public async Task<PagedResult<OperationPermission>> GetOperationPermissions(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<OperationPermission>(
                "",
                "StoreOperations",
                "GetOperationPermissions",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetReasonCodes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ReasonCode.</returns>
        public async Task<PagedResult<ReasonCode>> GetReasonCodes(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ReasonCode>(
                "",
                "StoreOperations",
                "GetReasonCodes",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetReturnOrderReasonCodes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ReasonCode.</returns>
        public async Task<PagedResult<ReasonCode>> GetReturnOrderReasonCodes(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ReasonCode>(
                "",
                "StoreOperations",
                "GetReturnOrderReasonCodes",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetSalesTaxGroups method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesTaxGroup.</returns>
        public async Task<PagedResult<SalesTaxGroup>> GetSalesTaxGroups(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SalesTaxGroup>(
                "",
                "StoreOperations",
                "GetSalesTaxGroups",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetTenderTypes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of TenderType.</returns>
        public async Task<PagedResult<TenderType>> GetTenderTypes(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<TenderType>(
                "",
                "StoreOperations",
                "GetTenderTypes",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetUnitsOfMeasure method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of UnitOfMeasure.</returns>
        public async Task<PagedResult<UnitOfMeasure>> GetUnitsOfMeasure(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<UnitOfMeasure>(
                "",
                "StoreOperations",
                "GetUnitsOfMeasure",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetDiscountCodes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DiscountCode.</returns>
        public async Task<PagedResult<DiscountCode>> GetDiscountCodes(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<DiscountCode>(
                "",
                "StoreOperations",
                "GetDiscountCodes",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetCurrencies method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Currency.</returns>
        public async Task<PagedResult<Currency>> GetCurrencies(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Currency>(
                "",
                "StoreOperations",
                "GetCurrencies",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetCurrenciesAmount method.
        /// </summary>
        /// <param name="currencyCode">The currencyCode.</param>
        /// <param name="amount">The amount.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CurrencyAmount.</returns>
        public async Task<PagedResult<CurrencyAmount>> GetCurrenciesAmount(string currencyCode, decimal amount, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<CurrencyAmount>(
                "",
                "StoreOperations",
                "GetCurrenciesAmount",
                false, queryResultSettings, null, OperationParameter.Create("currencyCode", currencyCode, false),
                  OperationParameter.Create("amount", amount, false));
        }

        /// <summary>
        /// GetCommissionSalesGroups method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CommissionSalesGroup.</returns>
        public async Task<PagedResult<CommissionSalesGroup>> GetCommissionSalesGroups(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<CommissionSalesGroup>(
                "",
                "StoreOperations",
                "GetCommissionSalesGroups",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetPaymentMerchantInformation method.
        /// </summary>
        /// <param name="hardwareProfileId">The hardwareProfileId.</param>
        /// <returns>PaymentMerchantInformation object.</returns>
        public async Task<PaymentMerchantInformation> GetPaymentMerchantInformation(string hardwareProfileId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<PaymentMerchantInformation>(
                "",
                "StoreOperations",
                "GetPaymentMerchantInformation",
                false, null, OperationParameter.Create("hardwareProfileId", hardwareProfileId, false));
        }

        /// <summary>
        /// GetOnlineChannelPublishStatus method.
        /// </summary>
        /// <returns>int object.</returns>
        public async Task<int> GetOnlineChannelPublishStatus()
        {
            return await this.context.ExecuteOperationSingleResultAsync<int>(
                "",
                "StoreOperations",
                "GetOnlineChannelPublishStatus",
                false, null);
        }

        /// <summary>
        /// SetOnlineChannelPublishStatus method.
        /// </summary>
        /// <param name="publishingStatus">The publishingStatus.</param>
        /// <param name="statusMessage">The statusMessage.</param>
        public async Task SetOnlineChannelPublishStatus(int publishingStatus, string statusMessage)
        {
            await this.context.ExecuteOperationAsync(
                "",
                "StoreOperations",
                "SetOnlineChannelPublishStatus",
                true, OperationParameter.Create("publishingStatus", publishingStatus, false),
                  OperationParameter.Create("statusMessage", statusMessage, false));
        }

        /// <summary>
        /// GetAvailableDevices method.
        /// </summary>
        /// <param name="deviceType">The deviceType.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Device.</returns>
        public async Task<PagedResult<Device>> GetAvailableDevices(int deviceType, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Device>(
                "",
                "StoreOperations",
                "GetAvailableDevices",
                false, queryResultSettings, null, OperationParameter.Create("deviceType", deviceType, false));
        }

    }

    /// <summary>
    /// Class implements Category Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class CategoryManager : ICategoryManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="Category"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public CategoryManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<Category> Create(Category entity)
        {
            return await this.context.Create<Category>("Categories", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<Category> Read(long recordId, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<Category>(
                    "Categories",
                    e => e.RecordId == recordId,
                    expandProperties,
                    OperationParameter.Create("RecordId", recordId, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<Category>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<Category>("Categories", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<Category> Update(Category entity)
        {
            return await this.context.Update<Category>("Categories", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(Category entity)
        {
            await this.context.Delete<Category>("Categories", entity);
        }

        // Operations

        /// <summary>
        /// GetCategories method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Category.</returns>
        public async Task<PagedResult<Category>> GetCategories(long channelId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Category>(
                "Categories",
                "Category",
                "GetCategories",
                true, queryResultSettings, null, OperationParameter.Create("channelId", channelId, false));
        }

        /// <summary>
        /// GetAttributes method.
        /// </summary>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of AttributeCategory.</returns>
        public async Task<PagedResult<AttributeCategory>> GetAttributes(long categoryId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<AttributeCategory>(
                "Categories",
                "Category",
                "GetAttributes",
                false, queryResultSettings, null, OperationParameter.Create("categoryId", categoryId, false));
        }

        /// <summary>
        /// GetChildren method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Category.</returns>
        public async Task<PagedResult<Category>> GetChildren(long channelId, long categoryId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Category>(
                "Categories",
                "Category",
                "GetChildren",
                true, queryResultSettings, null, OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("categoryId", categoryId, false));
        }

    }

    /// <summary>
    /// Class implements Cart Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class CartManager : ICartManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="Cart"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public CartManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<Cart> Create(Cart entity)
        {
            return await this.context.Create<Cart>("Carts", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<Cart> Read(string id, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<Cart>(
                    "Carts",
                    e => e.Id == id,
                    expandProperties,
                    OperationParameter.Create("Id", id, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<Cart>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<Cart>("Carts", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<Cart> Update(Cart entity)
        {
            return await this.context.Update<Cart>("Carts", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(Cart entity)
        {
            await this.context.Delete<Cart>("Carts", entity);
        }

        // Operations

        /// <summary>
        /// Checkout method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="receiptEmail">The receiptEmail.</param>
        /// <param name="tokenizedPaymentCard">The tokenizedPaymentCard.</param>
        /// <param name="receiptNumberSequence">The receiptNumberSequence.</param>
        /// <param name="cartTenderLines">The cartTenderLines.</param>
        /// <returns>SalesOrder object.</returns>
        public async Task<SalesOrder> Checkout(string id, string receiptEmail, TokenizedPaymentCard tokenizedPaymentCard, string receiptNumberSequence, IEnumerable<CartTenderLine> cartTenderLines)
        {
            return await this.context.ExecuteOperationSingleResultAsync<SalesOrder>(
                "Carts",
                "Cart",
                "Checkout",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("receiptEmail", receiptEmail, false),
                  OperationParameter.Create("tokenizedPaymentCard", tokenizedPaymentCard, false),
                  OperationParameter.Create("receiptNumberSequence", receiptNumberSequence, false),
                  OperationParameter.Create("cartTenderLines", cartTenderLines, false));
        }

        /// <summary>
        /// GetPaymentsHistory method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of TenderLine.</returns>
        public async Task<PagedResult<TenderLine>> GetPaymentsHistory(string id, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<TenderLine>(
                "Carts",
                "Cart",
                "GetPaymentsHistory",
                true, queryResultSettings, null, OperationParameter.Create("Id", id, true));
        }

        /// <summary>
        /// GetLineDeliveryOptions method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="lineShippingAddresses">The lineShippingAddresses.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesLineDeliveryOption.</returns>
        public async Task<PagedResult<SalesLineDeliveryOption>> GetLineDeliveryOptions(string id, IEnumerable<LineShippingAddress> lineShippingAddresses, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SalesLineDeliveryOption>(
                "Carts",
                "Cart",
                "GetLineDeliveryOptions",
                true, queryResultSettings, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("lineShippingAddresses", lineShippingAddresses, false));
        }

        /// <summary>
        /// GetDeliveryPreferences method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>CartDeliveryPreferences object.</returns>
        public async Task<CartDeliveryPreferences> GetDeliveryPreferences(string id)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CartDeliveryPreferences>(
                "Carts",
                "Cart",
                "GetDeliveryPreferences",
                true, null, OperationParameter.Create("Id", id, true));
        }

        /// <summary>
        /// GetDeliveryOptions method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="shippingAddress">The shippingAddress.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DeliveryOption.</returns>
        public async Task<PagedResult<DeliveryOption>> GetDeliveryOptions(string id, Address shippingAddress, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<DeliveryOption>(
                "Carts",
                "Cart",
                "GetDeliveryOptions",
                true, queryResultSettings, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("shippingAddress", shippingAddress, false));
        }

        /// <summary>
        /// UpdateLineDeliverySpecifications method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="lineDeliverySpecifications">The lineDeliverySpecifications.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> UpdateLineDeliverySpecifications(string id, IEnumerable<LineDeliverySpecification> lineDeliverySpecifications)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "UpdateLineDeliverySpecifications",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("lineDeliverySpecifications", lineDeliverySpecifications, false));
        }

        /// <summary>
        /// UpdateDeliverySpecification method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="deliverySpecification">The deliverySpecification.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> UpdateDeliverySpecification(string id, DeliverySpecification deliverySpecification)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "UpdateDeliverySpecification",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("deliverySpecification", deliverySpecification, false));
        }

        /// <summary>
        /// Void method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="reasonCodeLines">The reasonCodeLines.</param>
        /// <returns>SalesOrder object.</returns>
        public async Task<SalesOrder> Void(string id, IEnumerable<ReasonCodeLine> reasonCodeLines)
        {
            return await this.context.ExecuteOperationSingleResultAsync<SalesOrder>(
                "Carts",
                "Cart",
                "Void",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("reasonCodeLines", reasonCodeLines, false));
        }

        /// <summary>
        /// AddCartLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartLines">The cartLines.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> AddCartLines(string id, IEnumerable<CartLine> cartLines)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "AddCartLines",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("cartLines", cartLines, false));
        }

        /// <summary>
        /// UpdateCartLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartLines">The cartLines.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> UpdateCartLines(string id, IEnumerable<CartLine> cartLines)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "UpdateCartLines",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("cartLines", cartLines, false));
        }

        /// <summary>
        /// VoidCartLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartLines">The cartLines.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> VoidCartLines(string id, IEnumerable<CartLine> cartLines)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "VoidCartLines",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("cartLines", cartLines, false));
        }

        /// <summary>
        /// RemoveCartLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartLineIds">The cartLineIds.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> RemoveCartLines(string id, IEnumerable<string> cartLineIds)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "RemoveCartLines",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("cartLineIds", cartLineIds, false));
        }

        /// <summary>
        /// AddTenderLine method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartTenderLine">The cartTenderLine.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> AddTenderLine(string id, CartTenderLine cartTenderLine)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "AddTenderLine",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("cartTenderLine", cartTenderLine, false));
        }

        /// <summary>
        /// AddPreprocessedTenderLine method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="preprocessedTenderLine">The preprocessedTenderLine.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> AddPreprocessedTenderLine(string id, TenderLine preprocessedTenderLine)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "AddPreprocessedTenderLine",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("preprocessedTenderLine", preprocessedTenderLine, false));
        }

        /// <summary>
        /// ValidateTenderLineForAdd method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="tenderLine">The tenderLine.</param>
        public async Task ValidateTenderLineForAdd(string id, TenderLine tenderLine)
        {
            await this.context.ExecuteOperationAsync(
                "Carts",
                "Cart",
                "ValidateTenderLineForAdd",
                true, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("tenderLine", tenderLine, false));
        }

        /// <summary>
        /// UpdateTenderLineSignature method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="tenderLineId">The tenderLineId.</param>
        /// <param name="signatureData">The signatureData.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> UpdateTenderLineSignature(string id, string tenderLineId, string signatureData)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "UpdateTenderLineSignature",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("tenderLineId", tenderLineId, false),
                  OperationParameter.Create("signatureData", signatureData, false));
        }

        /// <summary>
        /// Copy method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="targetCartType">The targetCartType.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> Copy(string id, int targetCartType)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "Copy",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("targetCartType", targetCartType, false));
        }

        /// <summary>
        /// VoidTenderLine method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="tenderLineId">The tenderLineId.</param>
        /// <param name="reasonCodeLines">The reasonCodeLines.</param>
        /// <param name="isPreprocessed">The isPreprocessed.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> VoidTenderLine(string id, string tenderLineId, IEnumerable<ReasonCodeLine> reasonCodeLines, bool? isPreprocessed)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "VoidTenderLine",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("tenderLineId", tenderLineId, false),
                  OperationParameter.Create("reasonCodeLines", reasonCodeLines, false),
                  OperationParameter.Create("isPreprocessed", isPreprocessed, false));
        }

        /// <summary>
        /// IssueGiftCard method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="giftCardId">The giftCardId.</param>
        /// <param name="amount">The amount.</param>
        /// <param name="currencyCode">The currencyCode.</param>
        /// <param name="lineDescription">The lineDescription.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> IssueGiftCard(string id, string giftCardId, decimal amount, string currencyCode, string lineDescription)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "IssueGiftCard",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("giftCardId", giftCardId, false),
                  OperationParameter.Create("amount", amount, false),
                  OperationParameter.Create("currencyCode", currencyCode, false),
                  OperationParameter.Create("lineDescription", lineDescription, false));
        }

        /// <summary>
        /// RefillGiftCard method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="giftCardId">The giftCardId.</param>
        /// <param name="amount">The amount.</param>
        /// <param name="currencyCode">The currencyCode.</param>
        /// <param name="lineDescription">The lineDescription.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> RefillGiftCard(string id, string giftCardId, decimal amount, string currencyCode, string lineDescription)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "RefillGiftCard",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("giftCardId", giftCardId, false),
                  OperationParameter.Create("amount", amount, false),
                  OperationParameter.Create("currencyCode", currencyCode, false),
                  OperationParameter.Create("lineDescription", lineDescription, false));
        }

        /// <summary>
        /// Suspend method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> Suspend(string id)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "Suspend",
                true, null, OperationParameter.Create("Id", id, true));
        }

        /// <summary>
        /// Resume method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> Resume(string id)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "Resume",
                true, null, OperationParameter.Create("Id", id, true));
        }

        /// <summary>
        /// RemoveDiscountCodes method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="discountCodes">The discountCodes.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> RemoveDiscountCodes(string id, IEnumerable<string> discountCodes)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "RemoveDiscountCodes",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("discountCodes", discountCodes, false));
        }

        /// <summary>
        /// GetSuspended method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Cart.</returns>
        public async Task<PagedResult<Cart>> GetSuspended(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Cart>(
                "Carts",
                "Cart",
                "GetSuspended",
                true, queryResultSettings, null);
        }

        /// <summary>
        /// Search method.
        /// </summary>
        /// <param name="cartSearchCriteria">The cartSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Cart.</returns>
        public async Task<PagedResult<Cart>> Search(CartSearchCriteria cartSearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Cart>(
                "Carts",
                "Cart",
                "Search",
                true, queryResultSettings, null, OperationParameter.Create("cartSearchCriteria", cartSearchCriteria, false));
        }

        /// <summary>
        /// OverrideCartLinePrice method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartLineId">The cartLineId.</param>
        /// <param name="price">The price.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> OverrideCartLinePrice(string id, string cartLineId, decimal price)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "OverrideCartLinePrice",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("cartLineId", cartLineId, false),
                  OperationParameter.Create("price", price, false));
        }

        /// <summary>
        /// GetCardPaymentAcceptPoint method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cardPaymentAcceptSettings">The cardPaymentAcceptSettings.</param>
        /// <returns>CardPaymentAcceptPoint object.</returns>
        public async Task<CardPaymentAcceptPoint> GetCardPaymentAcceptPoint(string id, CardPaymentAcceptSettings cardPaymentAcceptSettings)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CardPaymentAcceptPoint>(
                "Carts",
                "Cart",
                "GetCardPaymentAcceptPoint",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("cardPaymentAcceptSettings", cardPaymentAcceptSettings, false));
        }

        /// <summary>
        /// RetrieveCardPaymentAcceptResult method.
        /// </summary>
        /// <param name="resultAccessCode">The resultAccessCode.</param>
        /// <returns>CardPaymentAcceptResult object.</returns>
        public async Task<CardPaymentAcceptResult> RetrieveCardPaymentAcceptResult(string resultAccessCode)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CardPaymentAcceptResult>(
                "Carts",
                "Cart",
                "RetrieveCardPaymentAcceptResult",
                true, null, OperationParameter.Create("resultAccessCode", resultAccessCode, false));
        }

        /// <summary>
        /// RecallOrder method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="salesId">The salesId.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> RecallOrder(string transactionId, string salesId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "RecallOrder",
                true, null, OperationParameter.Create("transactionId", transactionId, false),
                  OperationParameter.Create("salesId", salesId, false));
        }

        /// <summary>
        /// RecallQuote method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="quoteId">The quoteId.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> RecallQuote(string transactionId, string quoteId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "RecallQuote",
                true, null, OperationParameter.Create("transactionId", transactionId, false),
                  OperationParameter.Create("quoteId", quoteId, false));
        }

        /// <summary>
        /// RecalculateOrder method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> RecalculateOrder(string id)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "RecalculateOrder",
                true, null, OperationParameter.Create("Id", id, true));
        }

        /// <summary>
        /// GetPromotions method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>CartPromotions object.</returns>
        public async Task<CartPromotions> GetPromotions(string id)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CartPromotions>(
                "Carts",
                "Cart",
                "GetPromotions",
                true, null, OperationParameter.Create("Id", id, true));
        }

        /// <summary>
        /// RecallSalesInvoice method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="invoiceId">The invoiceId.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> RecallSalesInvoice(string transactionId, string invoiceId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "RecallSalesInvoice",
                true, null, OperationParameter.Create("transactionId", transactionId, false),
                  OperationParameter.Create("invoiceId", invoiceId, false));
        }

        /// <summary>
        /// UpdateCommissionSalesGroup method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="cartLineId">The cartLineId.</param>
        /// <param name="commissionSalesGroup">The commissionSalesGroup.</param>
        /// <param name="isUserInitiated">The isUserInitiated.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> UpdateCommissionSalesGroup(string transactionId, string cartLineId, string commissionSalesGroup, bool isUserInitiated)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "UpdateCommissionSalesGroup",
                true, null, OperationParameter.Create("transactionId", transactionId, false),
                  OperationParameter.Create("cartLineId", cartLineId, false),
                  OperationParameter.Create("commissionSalesGroup", commissionSalesGroup, false),
                  OperationParameter.Create("isUserInitiated", isUserInitiated, false));
        }

        /// <summary>
        /// AddDiscountCode method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="discountCode">The discountCode.</param>
        /// <returns>Cart object.</returns>
        public async Task<Cart> AddDiscountCode(string id, string discountCode)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Cart>(
                "Carts",
                "Cart",
                "AddDiscountCode",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("discountCode", discountCode, false));
        }

    }

    /// <summary>
    /// Class implements Customer Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class CustomerManager : ICustomerManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="Customer"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public CustomerManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<Customer> Create(Customer entity)
        {
            return await this.context.Create<Customer>("Customers", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="accountNumber">The accountNumber.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<Customer> Read(string accountNumber, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<Customer>(
                    "Customers",
                    e => e.AccountNumber == accountNumber,
                    expandProperties,
                    OperationParameter.Create("AccountNumber", accountNumber, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<Customer>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<Customer>("Customers", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<Customer> Update(Customer entity)
        {
            return await this.context.Update<Customer>("Customers", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(Customer entity)
        {
            await this.context.Delete<Customer>("Customers", entity);
        }

        // Operations

        /// <summary>
        /// Search method.
        /// </summary>
        /// <param name="customerSearchCriteria">The customerSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of GlobalCustomer.</returns>
        public async Task<PagedResult<GlobalCustomer>> Search(CustomerSearchCriteria customerSearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<GlobalCustomer>(
                "Customers",
                "Customer",
                "Search",
                true, queryResultSettings, null, OperationParameter.Create("customerSearchCriteria", customerSearchCriteria, false));
        }

        /// <summary>
        /// GetOrderHistory method.
        /// </summary>
        /// <param name="accountNumber">The accountNumber.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesOrder.</returns>
        public async Task<PagedResult<SalesOrder>> GetOrderHistory(string accountNumber, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SalesOrder>(
                "Customers",
                "Customer",
                "GetOrderHistory",
                true, queryResultSettings, null, OperationParameter.Create("AccountNumber", accountNumber, true));
        }

        /// <summary>
        /// GetPurchaseHistory method.
        /// </summary>
        /// <param name="accountNumber">The accountNumber.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of PurchaseHistory.</returns>
        public async Task<PagedResult<PurchaseHistory>> GetPurchaseHistory(string accountNumber, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<PurchaseHistory>(
                "Customers",
                "Customer",
                "GetPurchaseHistory",
                false, queryResultSettings, null, OperationParameter.Create("AccountNumber", accountNumber, true));
        }

    }

    /// <summary>
    /// Class implements Employee Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class EmployeeManager : IEmployeeManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="Employee"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public EmployeeManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<Employee> Create(Employee entity)
        {
            return await this.context.Create<Employee>("Employees", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="staffId">The staffId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<Employee> Read(string staffId, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<Employee>(
                    "Employees",
                    e => e.StaffId == staffId,
                    expandProperties,
                    OperationParameter.Create("StaffId", staffId, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<Employee>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<Employee>("Employees", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<Employee> Update(Employee entity)
        {
            return await this.context.Update<Employee>("Employees", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(Employee entity)
        {
            await this.context.Delete<Employee>("Employees", entity);
        }

        // Operations

        /// <summary>
        /// GetActivities method.
        /// </summary>
        /// <param name="employeeActivitySearchCriteria">The employeeActivitySearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of EmployeeActivity.</returns>
        public async Task<PagedResult<EmployeeActivity>> GetActivities(EmployeeActivitySearchCriteria employeeActivitySearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<EmployeeActivity>(
                "Employees",
                "Employee",
                "GetActivities",
                true, queryResultSettings, null, OperationParameter.Create("employeeActivitySearchCriteria", employeeActivitySearchCriteria, false));
        }

        /// <summary>
        /// GetManagerActivityView method.
        /// </summary>
        /// <param name="employeeActivitySearchCriteria">The employeeActivitySearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of EmployeeActivity.</returns>
        public async Task<PagedResult<EmployeeActivity>> GetManagerActivityView(EmployeeActivitySearchCriteria employeeActivitySearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<EmployeeActivity>(
                "Employees",
                "Employee",
                "GetManagerActivityView",
                true, queryResultSettings, null, OperationParameter.Create("employeeActivitySearchCriteria", employeeActivitySearchCriteria, false));
        }

        /// <summary>
        /// RegisterActivity method.
        /// </summary>
        /// <param name="staffId">The staffId.</param>
        /// <param name="employeeActivityType">The employeeActivityType.</param>
        /// <returns>DateTimeOffset object.</returns>
        public async Task<DateTimeOffset> RegisterActivity(string staffId, int employeeActivityType)
        {
            return await this.context.ExecuteOperationSingleResultAsync<DateTimeOffset>(
                "Employees",
                "Employee",
                "RegisterActivity",
                true, null, OperationParameter.Create("StaffId", staffId, true),
                OperationParameter.Create("employeeActivityType", employeeActivityType, false));
        }

        /// <summary>
        /// GetAccessibleOrgUnits method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnit.</returns>
        public async Task<PagedResult<OrgUnit>> GetAccessibleOrgUnits(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<OrgUnit>(
                "Employees",
                "Employee",
                "GetAccessibleOrgUnits",
                true, queryResultSettings, null);
        }

        /// <summary>
        /// GetLatestActivity method.
        /// </summary>
        /// <returns>EmployeeActivity object.</returns>
        public async Task<EmployeeActivity> GetLatestActivity()
        {
            return await this.context.ExecuteOperationSingleResultAsync<EmployeeActivity>(
                "Employees",
                "Employee",
                "GetLatestActivity",
                true, null);
        }

        /// <summary>
        /// GetCurrentEmployee method.
        /// </summary>
        /// <returns>Employee object.</returns>
        public async Task<Employee> GetCurrentEmployee()
        {
            return await this.context.ExecuteOperationSingleResultAsync<Employee>(
                "Employees",
                "Employee",
                "GetCurrentEmployee",
                false, null);
        }

    }

    /// <summary>
    /// Class implements SalesOrder Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class SalesOrderManager : ISalesOrderManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="SalesOrder"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public SalesOrderManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<SalesOrder> Create(SalesOrder entity)
        {
            return await this.context.Create<SalesOrder>("SalesOrders", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<SalesOrder> Read(string id, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<SalesOrder>(
                    "SalesOrders",
                    e => e.Id == id,
                    expandProperties,
                    OperationParameter.Create("Id", id, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<SalesOrder>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<SalesOrder>("SalesOrders", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<SalesOrder> Update(SalesOrder entity)
        {
            return await this.context.Update<SalesOrder>("SalesOrders", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(SalesOrder entity)
        {
            await this.context.Delete<SalesOrder>("SalesOrders", entity);
        }

        // Operations

        /// <summary>
        /// SearchSalesTransactionsByReceiptId method.
        /// </summary>
        /// <param name="receiptId">The receiptId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesOrder.</returns>
        public async Task<PagedResult<SalesOrder>> SearchSalesTransactionsByReceiptId(string receiptId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SalesOrder>(
                "SalesOrders",
                "SalesOrder",
                "SearchSalesTransactionsByReceiptId",
                true, queryResultSettings, null, OperationParameter.Create("receiptId", receiptId, false));
        }

        /// <summary>
        /// Search method.
        /// </summary>
        /// <param name="salesOrderSearchCriteria">The salesOrderSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesOrder.</returns>
        public async Task<PagedResult<SalesOrder>> Search(SalesOrderSearchCriteria salesOrderSearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SalesOrder>(
                "SalesOrders",
                "SalesOrder",
                "Search",
                true, queryResultSettings, null, OperationParameter.Create("salesOrderSearchCriteria", salesOrderSearchCriteria, false));
        }

        /// <summary>
        /// SearchOrders method.
        /// </summary>
        /// <param name="orderSearchCriteria">The orderSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesOrder.</returns>
        public async Task<PagedResult<SalesOrder>> SearchOrders(OrderSearchCriteria orderSearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SalesOrder>(
                "SalesOrders",
                "SalesOrder",
                "SearchOrders",
                true, queryResultSettings, null, OperationParameter.Create("orderSearchCriteria", orderSearchCriteria, false));
        }

        /// <summary>
        /// GetReceipts method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="receiptRetrievalCriteria">The receiptRetrievalCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Receipt.</returns>
        public async Task<PagedResult<Receipt>> GetReceipts(string id, ReceiptRetrievalCriteria receiptRetrievalCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Receipt>(
                "SalesOrders",
                "SalesOrder",
                "GetReceipts",
                true, queryResultSettings, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("receiptRetrievalCriteria", receiptRetrievalCriteria, false));
        }

        /// <summary>
        /// GetByReceiptId method.
        /// </summary>
        /// <param name="receiptId">The receiptId.</param>
        /// <param name="orderStoreNumber">The orderStoreNumber.</param>
        /// <param name="orderTerminalId">The orderTerminalId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesOrder.</returns>
        public async Task<PagedResult<SalesOrder>> GetByReceiptId(string receiptId, string orderStoreNumber, string orderTerminalId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SalesOrder>(
                "SalesOrders",
                "SalesOrder",
                "GetByReceiptId",
                true, queryResultSettings, null, OperationParameter.Create("receiptId", receiptId, false),
                  OperationParameter.Create("orderStoreNumber", orderStoreNumber, false),
                  OperationParameter.Create("orderTerminalId", orderTerminalId, false));
        }

        /// <summary>
        /// GetSalesOrderDetailsByTransactionId method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="searchLocationValue">The searchLocationValue.</param>
        /// <returns>SalesOrder object.</returns>
        public async Task<SalesOrder> GetSalesOrderDetailsByTransactionId(string transactionId, int searchLocationValue)
        {
            return await this.context.ExecuteOperationSingleResultAsync<SalesOrder>(
                "SalesOrders",
                "SalesOrder",
                "GetSalesOrderDetailsByTransactionId",
                false, null, OperationParameter.Create("transactionId", transactionId, false),
                  OperationParameter.Create("searchLocationValue", searchLocationValue, false));
        }

        /// <summary>
        /// GetSalesOrderDetailsBySalesId method.
        /// </summary>
        /// <param name="salesId">The salesId.</param>
        /// <returns>SalesOrder object.</returns>
        public async Task<SalesOrder> GetSalesOrderDetailsBySalesId(string salesId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<SalesOrder>(
                "SalesOrders",
                "SalesOrder",
                "GetSalesOrderDetailsBySalesId",
                false, null, OperationParameter.Create("salesId", salesId, false));
        }

        /// <summary>
        /// GetSalesOrderDetailsByQuotationId method.
        /// </summary>
        /// <param name="quotationId">The quotationId.</param>
        /// <returns>SalesOrder object.</returns>
        public async Task<SalesOrder> GetSalesOrderDetailsByQuotationId(string quotationId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<SalesOrder>(
                "SalesOrders",
                "SalesOrder",
                "GetSalesOrderDetailsByQuotationId",
                false, null, OperationParameter.Create("quotationId", quotationId, false));
        }

        /// <summary>
        /// GetInvoicesBySalesId method.
        /// </summary>
        /// <param name="salesId">The salesId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesInvoice.</returns>
        public async Task<PagedResult<SalesInvoice>> GetInvoicesBySalesId(string salesId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SalesInvoice>(
                "SalesOrders",
                "SalesOrder",
                "GetInvoicesBySalesId",
                true, queryResultSettings, null, OperationParameter.Create("salesId", salesId, false));
        }

        /// <summary>
        /// CreatePickingList method.
        /// </summary>
        /// <param name="salesId">The salesId.</param>
        public async Task CreatePickingList(string salesId)
        {
            await this.context.ExecuteOperationAsync(
                "SalesOrders",
                "SalesOrder",
                "CreatePickingList",
                true, OperationParameter.Create("salesId", salesId, false));
        }

        /// <summary>
        /// CreatePickingListForItems method.
        /// </summary>
        /// <param name="salesId">The salesId.</param>
        /// <param name="pickAndPackSalesLineParameters">The pickAndPackSalesLineParameters.</param>
        /// <returns>string object.</returns>
        public async Task<string> CreatePickingListForItems(string salesId, IEnumerable<PickAndPackSalesLineParameter> pickAndPackSalesLineParameters)
        {
            return await this.context.ExecuteOperationSingleResultAsync<string>(
                "SalesOrders",
                "SalesOrder",
                "CreatePickingListForItems",
                true, null, OperationParameter.Create("salesId", salesId, false),
                  OperationParameter.Create("pickAndPackSalesLineParameters", pickAndPackSalesLineParameters, false));
        }

        /// <summary>
        /// GetPickingLists method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of PickingList.</returns>
        public async Task<PagedResult<PickingList>> GetPickingLists(string id, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<PickingList>(
                "SalesOrders",
                "SalesOrder",
                "GetPickingLists",
                false, queryResultSettings, null, OperationParameter.Create("Id", id, true));
        }

        /// <summary>
        /// CreatePackingSlip method.
        /// </summary>
        /// <param name="salesId">The salesId.</param>
        public async Task CreatePackingSlip(string salesId)
        {
            await this.context.ExecuteOperationAsync(
                "SalesOrders",
                "SalesOrder",
                "CreatePackingSlip",
                true, OperationParameter.Create("salesId", salesId, false));
        }

    }

    /// <summary>
    /// Class implements Shift Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class ShiftManager : IShiftManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="Shift"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public ShiftManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<Shift> Create(Shift entity)
        {
            return await this.context.Create<Shift>("Shifts", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<Shift> Read(long shiftId, string terminalId, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<Shift>(
                    "Shifts",
                    e => e.ShiftId == shiftId && e.TerminalId == terminalId,
                    expandProperties,
                    OperationParameter.Create("ShiftId", shiftId, true),
                  OperationParameter.Create("TerminalId", terminalId, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<Shift>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<Shift>("Shifts", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<Shift> Update(Shift entity)
        {
            return await this.context.Update<Shift>("Shifts", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(Shift entity)
        {
            await this.context.Delete<Shift>("Shifts", entity);
        }

        // Operations

        /// <summary>
        /// Open method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="cashDrawer">The cashDrawer.</param>
        /// <param name="isShared">The isShared.</param>
        /// <returns>Shift object.</returns>
        public async Task<Shift> Open(long? shiftId, string cashDrawer, bool isShared)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Shift>(
                "Shifts",
                "Shift",
                "Open",
                true, null, OperationParameter.Create("shiftId", shiftId, false),
                  OperationParameter.Create("cashDrawer", cashDrawer, false),
                  OperationParameter.Create("isShared", isShared, false));
        }

        /// <summary>
        /// Close method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="forceClose">The forceClose.</param>
        /// <returns>Shift object.</returns>
        public async Task<Shift> Close(long shiftId, string terminalId, string transactionId, bool forceClose)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Shift>(
                "Shifts",
                "Shift",
                "Close",
                true, null, OperationParameter.Create("ShiftId", shiftId, true),
                  OperationParameter.Create("TerminalId", terminalId, true),
                OperationParameter.Create("transactionId", transactionId, false),
                  OperationParameter.Create("forceClose", forceClose, false));
        }

        /// <summary>
        /// BlindClose method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="forceClose">The forceClose.</param>
        /// <returns>Shift object.</returns>
        public async Task<Shift> BlindClose(long shiftId, string terminalId, string transactionId, bool forceClose)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Shift>(
                "Shifts",
                "Shift",
                "BlindClose",
                true, null, OperationParameter.Create("ShiftId", shiftId, true),
                  OperationParameter.Create("TerminalId", terminalId, true),
                OperationParameter.Create("transactionId", transactionId, false),
                  OperationParameter.Create("forceClose", forceClose, false));
        }

        /// <summary>
        /// Resume method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="cashDrawer">The cashDrawer.</param>
        /// <returns>Shift object.</returns>
        public async Task<Shift> Resume(long shiftId, string terminalId, string cashDrawer)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Shift>(
                "Shifts",
                "Shift",
                "Resume",
                true, null, OperationParameter.Create("ShiftId", shiftId, true),
                  OperationParameter.Create("TerminalId", terminalId, true),
                OperationParameter.Create("cashDrawer", cashDrawer, false));
        }

        /// <summary>
        /// Use method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <returns>Shift object.</returns>
        public async Task<Shift> Use(long shiftId, string terminalId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Shift>(
                "Shifts",
                "Shift",
                "Use",
                true, null, OperationParameter.Create("ShiftId", shiftId, true),
                  OperationParameter.Create("TerminalId", terminalId, true));
        }

        /// <summary>
        /// Suspend method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="transactionId">The transactionId.</param>
        /// <returns>Shift object.</returns>
        public async Task<Shift> Suspend(long shiftId, string terminalId, string transactionId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Shift>(
                "Shifts",
                "Shift",
                "Suspend",
                true, null, OperationParameter.Create("ShiftId", shiftId, true),
                  OperationParameter.Create("TerminalId", terminalId, true),
                OperationParameter.Create("transactionId", transactionId, false));
        }

        /// <summary>
        /// GetByStatus method.
        /// </summary>
        /// <param name="statusValue">The statusValue.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Shift.</returns>
        public async Task<PagedResult<Shift>> GetByStatus(int statusValue, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Shift>(
                "Shifts",
                "Shift",
                "GetByStatus",
                false, queryResultSettings, null, OperationParameter.Create("statusValue", statusValue, false));
        }

        /// <summary>
        /// GetXReport method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="hardwareProfileId">The hardwareProfileId.</param>
        /// <returns>Receipt object.</returns>
        public async Task<Receipt> GetXReport(long shiftId, string terminalId, string transactionId, string hardwareProfileId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Receipt>(
                "Shifts",
                "Shift",
                "GetXReport",
                false, null, OperationParameter.Create("ShiftId", shiftId, true),
                  OperationParameter.Create("TerminalId", terminalId, true),
                OperationParameter.Create("transactionId", transactionId, false),
                  OperationParameter.Create("hardwareProfileId", hardwareProfileId, false));
        }

        /// <summary>
        /// GetZReport method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="hardwareProfileId">The hardwareProfileId.</param>
        /// <returns>Receipt object.</returns>
        public async Task<Receipt> GetZReport(string transactionId, string hardwareProfileId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Receipt>(
                "Shifts",
                "Shift",
                "GetZReport",
                false, null, OperationParameter.Create("transactionId", transactionId, false),
                  OperationParameter.Create("hardwareProfileId", hardwareProfileId, false));
        }

    }

    /// <summary>
    /// Class implements StockCountJournal Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class StockCountJournalManager : IStockCountJournalManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="StockCountJournal"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public StockCountJournalManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<StockCountJournal> Create(StockCountJournal entity)
        {
            return await this.context.Create<StockCountJournal>("StockCountJournals", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<StockCountJournal> Read(string journalId, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<StockCountJournal>(
                    "StockCountJournals",
                    e => e.JournalId == journalId,
                    expandProperties,
                    OperationParameter.Create("JournalId", journalId, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<StockCountJournal>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<StockCountJournal>("StockCountJournals", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<StockCountJournal> Update(StockCountJournal entity)
        {
            return await this.context.Update<StockCountJournal>("StockCountJournals", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(StockCountJournal entity)
        {
            await this.context.Delete<StockCountJournal>("StockCountJournals", entity);
        }

        // Operations

        /// <summary>
        /// Sync method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of StockCountJournal.</returns>
        public async Task<PagedResult<StockCountJournal>> Sync(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<StockCountJournal>(
                "StockCountJournals",
                "StockCountJournal",
                "Sync",
                true, queryResultSettings, null);
        }

        /// <summary>
        /// SyncTransactions method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of StockCountJournalTransaction.</returns>
        public async Task<PagedResult<StockCountJournalTransaction>> SyncTransactions(string journalId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<StockCountJournalTransaction>(
                "StockCountJournals",
                "StockCountJournal",
                "SyncTransactions",
                true, queryResultSettings, null, OperationParameter.Create("JournalId", journalId, true));
        }

        /// <summary>
        /// RemoveJournal method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        public async Task RemoveJournal(string journalId)
        {
            await this.context.ExecuteOperationAsync(
                "StockCountJournals",
                "StockCountJournal",
                "RemoveJournal",
                true, OperationParameter.Create("JournalId", journalId, true));
        }

        /// <summary>
        /// RemoveTransaction method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        /// <param name="itemId">The itemId.</param>
        /// <param name="inventSizeId">The inventSizeId.</param>
        /// <param name="inventColorId">The inventColorId.</param>
        /// <param name="inventStyleId">The inventStyleId.</param>
        /// <param name="configurationId">The configurationId.</param>
        public async Task RemoveTransaction(string journalId, string itemId, string inventSizeId, string inventColorId, string inventStyleId, string configurationId)
        {
            await this.context.ExecuteOperationAsync(
                "StockCountJournals",
                "StockCountJournal",
                "RemoveTransaction",
                true, OperationParameter.Create("JournalId", journalId, true),
                OperationParameter.Create("itemId", itemId, false),
                  OperationParameter.Create("inventSizeId", inventSizeId, false),
                  OperationParameter.Create("inventColorId", inventColorId, false),
                  OperationParameter.Create("inventStyleId", inventStyleId, false),
                  OperationParameter.Create("configurationId", configurationId, false));
        }

        /// <summary>
        /// RemoveStockCountLineByLineId method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        /// <param name="stockCountLineId">The stockCountLineId.</param>
        public async Task RemoveStockCountLineByLineId(string journalId, long stockCountLineId)
        {
            await this.context.ExecuteOperationAsync(
                "StockCountJournals",
                "StockCountJournal",
                "RemoveStockCountLineByLineId",
                true, OperationParameter.Create("JournalId", journalId, true),
                OperationParameter.Create("stockCountLineId", stockCountLineId, false));
        }

        /// <summary>
        /// RemoveStockCountLineByProductRecId method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        /// <param name="productId">The productId.</param>
        public async Task RemoveStockCountLineByProductRecId(string journalId, long productId)
        {
            await this.context.ExecuteOperationAsync(
                "StockCountJournals",
                "StockCountJournal",
                "RemoveStockCountLineByProductRecId",
                true, OperationParameter.Create("JournalId", journalId, true),
                OperationParameter.Create("productId", productId, false));
        }

        /// <summary>
        /// Commit method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        public async Task Commit(string journalId)
        {
            await this.context.ExecuteOperationAsync(
                "StockCountJournals",
                "StockCountJournal",
                "Commit",
                true, OperationParameter.Create("JournalId", journalId, true));
        }

    }

    /// <summary>
    /// Class implements OrgUnit Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class OrgUnitManager : IOrgUnitManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="OrgUnit"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public OrgUnitManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<OrgUnit> Create(OrgUnit entity)
        {
            return await this.context.Create<OrgUnit>("OrgUnits", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="orgUnitNumber">The orgUnitNumber.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<OrgUnit> Read(string orgUnitNumber, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<OrgUnit>(
                    "OrgUnits",
                    e => e.OrgUnitNumber == orgUnitNumber,
                    expandProperties,
                    OperationParameter.Create("OrgUnitNumber", orgUnitNumber, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<OrgUnit>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<OrgUnit>("OrgUnits", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<OrgUnit> Update(OrgUnit entity)
        {
            return await this.context.Update<OrgUnit>("OrgUnits", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(OrgUnit entity)
        {
            await this.context.Delete<OrgUnit>("OrgUnits", entity);
        }

        // Operations

        /// <summary>
        /// GetTillLayout method.
        /// </summary>
        /// <returns>TillLayout object.</returns>
        public async Task<TillLayout> GetTillLayout()
        {
            return await this.context.ExecuteOperationSingleResultAsync<TillLayout>(
                "OrgUnits",
                "OrgUnit",
                "GetTillLayout",
                true, null);
        }

        /// <summary>
        /// Search method.
        /// </summary>
        /// <param name="storeSearchCriteria">The storeSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnit.</returns>
        public async Task<PagedResult<OrgUnit>> Search(SearchStoreCriteria storeSearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<OrgUnit>(
                "OrgUnits",
                "OrgUnit",
                "Search",
                true, queryResultSettings, null, OperationParameter.Create("storeSearchCriteria", storeSearchCriteria, false));
        }

        /// <summary>
        /// GetOrgUnitLocationsByArea method.
        /// </summary>
        /// <param name="searchArea">The searchArea.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnitLocation.</returns>
        public async Task<PagedResult<OrgUnitLocation>> GetOrgUnitLocationsByArea(SearchArea searchArea, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<OrgUnitLocation>(
                "OrgUnits",
                "OrgUnit",
                "GetOrgUnitLocationsByArea",
                true, queryResultSettings, null, OperationParameter.Create("searchArea", searchArea, false));
        }

        /// <summary>
        /// GetOrgUnitConfiguration method.
        /// </summary>
        /// <returns>ChannelConfiguration object.</returns>
        public async Task<ChannelConfiguration> GetOrgUnitConfiguration()
        {
            return await this.context.ExecuteOperationSingleResultAsync<ChannelConfiguration>(
                "OrgUnits",
                "OrgUnit",
                "GetOrgUnitConfiguration",
                true, null);
        }

        /// <summary>
        /// GetAvailableInventory method.
        /// </summary>
        /// <param name="itemId">The itemId.</param>
        /// <param name="variantId">The variantId.</param>
        /// <param name="barcode">The barcode.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnitAvailability.</returns>
        public async Task<PagedResult<OrgUnitAvailability>> GetAvailableInventory(string itemId, string variantId, string barcode, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<OrgUnitAvailability>(
                "OrgUnits",
                "OrgUnit",
                "GetAvailableInventory",
                true, queryResultSettings, null, OperationParameter.Create("itemId", itemId, false),
                  OperationParameter.Create("variantId", variantId, false),
                  OperationParameter.Create("barcode", barcode, false));
        }

        /// <summary>
        /// GetAvailableInventoryNearby method.
        /// </summary>
        /// <param name="itemIds">The itemIds.</param>
        /// <param name="searchArea">The searchArea.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnitAvailability.</returns>
        public async Task<PagedResult<OrgUnitAvailability>> GetAvailableInventoryNearby(IEnumerable<ItemUnit> itemIds, SearchArea searchArea, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<OrgUnitAvailability>(
                "OrgUnits",
                "OrgUnit",
                "GetAvailableInventoryNearby",
                true, queryResultSettings, null, OperationParameter.Create("itemIds", itemIds, false),
                  OperationParameter.Create("searchArea", searchArea, false));
        }

        /// <summary>
        /// GetTerminalInfo method.
        /// </summary>
        /// <param name="orgUnitNumber">The orgUnitNumber.</param>
        /// <param name="deviceType">The deviceType.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of TerminalInfo.</returns>
        public async Task<PagedResult<TerminalInfo>> GetTerminalInfo(string orgUnitNumber, int deviceType, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<TerminalInfo>(
                "OrgUnits",
                "OrgUnit",
                "GetTerminalInfo",
                false, queryResultSettings, null, OperationParameter.Create("OrgUnitNumber", orgUnitNumber, true),
                OperationParameter.Create("deviceType", deviceType, false));
        }

        /// <summary>
        /// GetProductAvailability method.
        /// </summary>
        /// <param name="productId">The productId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnitAvailability.</returns>
        public async Task<PagedResult<OrgUnitAvailability>> GetProductAvailability(long productId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<OrgUnitAvailability>(
                "OrgUnits",
                "OrgUnit",
                "GetProductAvailability",
                false, queryResultSettings, null, OperationParameter.Create("productId", productId, false));
        }

    }

    /// <summary>
    /// Class implements Product Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class ProductManager : IProductManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="Product"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public ProductManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<Product> Create(Product entity)
        {
            return await this.context.Create<Product>("Products", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<Product> Read(long recordId, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<Product>(
                    "Products",
                    e => e.RecordId == recordId,
                    expandProperties,
                    OperationParameter.Create("RecordId", recordId, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<Product>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<Product>("Products", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<Product> Update(Product entity)
        {
            return await this.context.Update<Product>("Products", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(Product entity)
        {
            await this.context.Delete<Product>("Products", entity);
        }

        // Operations

        /// <summary>
        /// GetDimensionValues method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="dimension">The dimension.</param>
        /// <param name="matchingDimensionValues">The matchingDimensionValues.</param>
        /// <param name="kitVariantResolutionContext">The kitVariantResolutionContext.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductDimensionValue.</returns>
        public async Task<PagedResult<ProductDimensionValue>> GetDimensionValues(long recordId, long channelId, int dimension, IEnumerable<ProductDimension> matchingDimensionValues, ProductVariantResolutionOnKitSelectionContext kitVariantResolutionContext, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductDimensionValue>(
                "Products",
                "Product",
                "GetDimensionValues",
                true, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("dimension", dimension, false),
                  OperationParameter.Create("matchingDimensionValues", matchingDimensionValues, false),
                  OperationParameter.Create("kitVariantResolutionContext", kitVariantResolutionContext, false));
        }

        /// <summary>
        /// GetVariantsByDimensionValues method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="matchingDimensionValues">The matchingDimensionValues.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SimpleProduct.</returns>
        public async Task<PagedResult<SimpleProduct>> GetVariantsByDimensionValues(long recordId, long channelId, IEnumerable<ProductDimension> matchingDimensionValues, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SimpleProduct>(
                "Products",
                "Product",
                "GetVariantsByDimensionValues",
                true, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("matchingDimensionValues", matchingDimensionValues, false));
        }

        /// <summary>
        /// GetVariantsByComponentsInSlots method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="matchingSlotToComponentRelationship">The matchingSlotToComponentRelationship.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SimpleProduct.</returns>
        public async Task<PagedResult<SimpleProduct>> GetVariantsByComponentsInSlots(long recordId, long channelId, IEnumerable<ComponentInSlotRelation> matchingSlotToComponentRelationship, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SimpleProduct>(
                "Products",
                "Product",
                "GetVariantsByComponentsInSlots",
                true, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("matchingSlotToComponentRelationship", matchingSlotToComponentRelationship, false));
        }

        /// <summary>
        /// GetByIds method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="productIds">The productIds.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SimpleProduct.</returns>
        public async Task<PagedResult<SimpleProduct>> GetByIds(long channelId, IEnumerable<long> productIds, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SimpleProduct>(
                "Products",
                "Product",
                "GetByIds",
                true, queryResultSettings, null, OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("productIds", productIds, false));
        }

        /// <summary>
        /// Compare method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="productIds">The productIds.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductComparisonLine.</returns>
        public async Task<PagedResult<ProductComparisonLine>> Compare(long channelId, long catalogId, IEnumerable<long> productIds, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductComparisonLine>(
                "Products",
                "Product",
                "Compare",
                true, queryResultSettings, null, OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("productIds", productIds, false));
        }

        /// <summary>
        /// GetRecommendedProducts method.
        /// </summary>
        /// <param name="productIds">The productIds.</param>
        /// <param name="customerId">The customerId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        public async Task<PagedResult<ProductSearchResult>> GetRecommendedProducts(IEnumerable<long> productIds, string customerId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductSearchResult>(
                "Products",
                "Product",
                "GetRecommendedProducts",
                true, queryResultSettings, null, OperationParameter.Create("productIds", productIds, false),
                  OperationParameter.Create("customerId", customerId, false));
        }

        /// <summary>
        /// RefineSearchByCategory method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="refinementCriteria">The refinementCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        public async Task<PagedResult<ProductSearchResult>> RefineSearchByCategory(long channelId, long catalogId, long categoryId, IEnumerable<ProductRefinerValue> refinementCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductSearchResult>(
                "Products",
                "Product",
                "RefineSearchByCategory",
                true, queryResultSettings, null, OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("categoryId", categoryId, false),
                  OperationParameter.Create("refinementCriteria", refinementCriteria, false));
        }

        /// <summary>
        /// RefineSearchByText method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="searchText">The searchText.</param>
        /// <param name="refinementCriteria">The refinementCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        public async Task<PagedResult<ProductSearchResult>> RefineSearchByText(long channelId, long catalogId, string searchText, IEnumerable<ProductRefinerValue> refinementCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductSearchResult>(
                "Products",
                "Product",
                "RefineSearchByText",
                true, queryResultSettings, null, OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("searchText", searchText, false),
                  OperationParameter.Create("refinementCriteria", refinementCriteria, false));
        }

        /// <summary>
        /// Search method.
        /// </summary>
        /// <param name="productSearchCriteria">The productSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Product.</returns>
        public async Task<PagedResult<Product>> Search(ProductSearchCriteria productSearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Product>(
                "Products",
                "Product",
                "Search",
                true, queryResultSettings, null, OperationParameter.Create("productSearchCriteria", productSearchCriteria, false));
        }

        /// <summary>
        /// GetRefiners method.
        /// </summary>
        /// <param name="productSearchCriteria">The productSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRefiner.</returns>
        public async Task<PagedResult<ProductRefiner>> GetRefiners(ProductSearchCriteria productSearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductRefiner>(
                "Products",
                "Product",
                "GetRefiners",
                true, queryResultSettings, null, OperationParameter.Create("productSearchCriteria", productSearchCriteria, false));
        }

        /// <summary>
        /// Changes method.
        /// </summary>
        /// <param name="productSearchCriteria">The productSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Product.</returns>
        public async Task<PagedResult<Product>> Changes(ChangedProductsSearchCriteria productSearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Product>(
                "Products",
                "Product",
                "Changes",
                true, queryResultSettings, null, OperationParameter.Create("productSearchCriteria", productSearchCriteria, false));
        }

        /// <summary>
        /// BeginReadChangedProducts method.
        /// </summary>
        /// <param name="changedProductSearchCriteria">The changedProductSearchCriteria.</param>
        /// <returns>ReadChangedProductsSession object.</returns>
        public async Task<ReadChangedProductsSession> BeginReadChangedProducts(ChangedProductsSearchCriteria changedProductSearchCriteria)
        {
            return await this.context.ExecuteOperationSingleResultAsync<ReadChangedProductsSession>(
                "Products",
                "Product",
                "BeginReadChangedProducts",
                true, null, OperationParameter.Create("changedProductSearchCriteria", changedProductSearchCriteria, false));
        }

        /// <summary>
        /// ReadChangedProducts method.
        /// </summary>
        /// <param name="productSearchCriteria">The productSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Product.</returns>
        public async Task<PagedResult<Product>> ReadChangedProducts(ChangedProductsSearchCriteria productSearchCriteria, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<Product>(
                "Products",
                "Product",
                "ReadChangedProducts",
                true, queryResultSettings, null, OperationParameter.Create("productSearchCriteria", productSearchCriteria, false));
        }

        /// <summary>
        /// GetDeletedListings method.
        /// </summary>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ListingIdentity.</returns>
        public async Task<PagedResult<ListingIdentity>> GetDeletedListings(long catalogId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ListingIdentity>(
                "Products",
                "Product",
                "GetDeletedListings",
                true, queryResultSettings, null, OperationParameter.Create("catalogId", catalogId, false));
        }

        /// <summary>
        /// EndReadChangedProducts method.
        /// </summary>
        /// <param name="session">The session.</param>
        public async Task EndReadChangedProducts(ReadChangedProductsSession session)
        {
            await this.context.ExecuteOperationAsync(
                "Products",
                "Product",
                "EndReadChangedProducts",
                true, OperationParameter.Create("session", session, false));
        }

        /// <summary>
        /// UpdateListingPublishingStatus method.
        /// </summary>
        /// <param name="publishingStatuses">The publishingStatuses.</param>
        public async Task UpdateListingPublishingStatus(IEnumerable<ListingPublishStatus> publishingStatuses)
        {
            await this.context.ExecuteOperationAsync(
                "Products",
                "Product",
                "UpdateListingPublishingStatus",
                true, OperationParameter.Create("publishingStatuses", publishingStatuses, false));
        }

        /// <summary>
        /// GetPrices method.
        /// </summary>
        /// <param name="itemId">The itemId.</param>
        /// <param name="inventoryDimensionId">The inventoryDimensionId.</param>
        /// <param name="barcode">The barcode.</param>
        /// <param name="customerAccountNumber">The customerAccountNumber.</param>
        /// <param name="unitOfMeasureSymbol">The unitOfMeasureSymbol.</param>
        /// <param name="quantity">The quantity.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductPrice.</returns>
        public async Task<PagedResult<ProductPrice>> GetPrices(string itemId, string inventoryDimensionId, string barcode, string customerAccountNumber, string unitOfMeasureSymbol, decimal quantity, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductPrice>(
                "Products",
                "Product",
                "GetPrices",
                true, queryResultSettings, null, OperationParameter.Create("itemId", itemId, false),
                  OperationParameter.Create("inventoryDimensionId", inventoryDimensionId, false),
                  OperationParameter.Create("barcode", barcode, false),
                  OperationParameter.Create("customerAccountNumber", customerAccountNumber, false),
                  OperationParameter.Create("unitOfMeasureSymbol", unitOfMeasureSymbol, false),
                  OperationParameter.Create("quantity", quantity, false));
        }

        /// <summary>
        /// GetProductAvailabilities method.
        /// </summary>
        /// <param name="itemIds">The itemIds.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductAvailableQuantity.</returns>
        public async Task<PagedResult<ProductAvailableQuantity>> GetProductAvailabilities(IEnumerable<long> itemIds, long channelId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductAvailableQuantity>(
                "Products",
                "Product",
                "GetProductAvailabilities",
                true, queryResultSettings, null, OperationParameter.Create("itemIds", itemIds, false),
                  OperationParameter.Create("channelId", channelId, false));
        }

        /// <summary>
        /// GetActivePrices method.
        /// </summary>
        /// <param name="projectDomain">The projectDomain.</param>
        /// <param name="productIds">The productIds.</param>
        /// <param name="activeDate">The activeDate.</param>
        /// <param name="customerId">The customerId.</param>
        /// <param name="affiliationLoyaltyTiers">The affiliationLoyaltyTiers.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductPrice.</returns>
        public async Task<PagedResult<ProductPrice>> GetActivePrices(ProjectionDomain projectDomain, IEnumerable<long> productIds, DateTimeOffset activeDate, string customerId, IEnumerable<AffiliationLoyaltyTier> affiliationLoyaltyTiers, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductPrice>(
                "Products",
                "Product",
                "GetActivePrices",
                true, queryResultSettings, null, OperationParameter.Create("projectDomain", projectDomain, false),
                  OperationParameter.Create("productIds", productIds, false),
                  OperationParameter.Create("activeDate", activeDate, false),
                  OperationParameter.Create("customerId", customerId, false),
                  OperationParameter.Create("affiliationLoyaltyTiers", affiliationLoyaltyTiers, false));
        }

        /// <summary>
        /// GetFilteredSlotComponents method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="slotId">The slotId.</param>
        /// <param name="selectedComponents">The selectedComponents.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductComponent.</returns>
        public async Task<PagedResult<ProductComponent>> GetFilteredSlotComponents(long recordId, long channelId, long slotId, IEnumerable<ComponentInSlotRelation> selectedComponents, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductComponent>(
                "Products",
                "Product",
                "GetFilteredSlotComponents",
                true, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("slotId", slotId, false),
                  OperationParameter.Create("selectedComponents", selectedComponents, false));
        }

        /// <summary>
        /// GetComponentByProductSlotRelation method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="componentRelation">The componentRelation.</param>
        /// <returns>ProductComponent object.</returns>
        public async Task<ProductComponent> GetComponentByProductSlotRelation(long channelId, ComponentInSlotRelation componentRelation)
        {
            return await this.context.ExecuteOperationSingleResultAsync<ProductComponent>(
                "Products",
                "Product",
                "GetComponentByProductSlotRelation",
                true, null, OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("componentRelation", componentRelation, false));
        }

        /// <summary>
        /// SearchByCategory method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        public async Task<PagedResult<ProductSearchResult>> SearchByCategory(long channelId, long catalogId, long categoryId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductSearchResult>(
                "Products",
                "Product",
                "SearchByCategory",
                false, queryResultSettings, null, OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("categoryId", categoryId, false));
        }

        /// <summary>
        /// SearchByText method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="searchText">The searchText.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        public async Task<PagedResult<ProductSearchResult>> SearchByText(long channelId, long catalogId, string searchText, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductSearchResult>(
                "Products",
                "Product",
                "SearchByText",
                false, queryResultSettings, null, OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("searchText", searchText, false));
        }

        /// <summary>
        /// GetSearchSuggestions method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="searchText">The searchText.</param>
        /// <param name="hitPrefix">The hitPrefix.</param>
        /// <param name="hitSuffix">The hitSuffix.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SearchSuggestion.</returns>
        public async Task<PagedResult<SearchSuggestion>> GetSearchSuggestions(long channelId, long catalogId, string searchText, string hitPrefix, string hitSuffix, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<SearchSuggestion>(
                "Products",
                "Product",
                "GetSearchSuggestions",
                false, queryResultSettings, null, OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("searchText", searchText, false),
                  OperationParameter.Create("hitPrefix", hitPrefix, false),
                  OperationParameter.Create("hitSuffix", hitSuffix, false));
        }

        /// <summary>
        /// GetRefinersByCategory method.
        /// </summary>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRefiner.</returns>
        public async Task<PagedResult<ProductRefiner>> GetRefinersByCategory(long catalogId, long categoryId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductRefiner>(
                "Products",
                "Product",
                "GetRefinersByCategory",
                false, queryResultSettings, null, OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("categoryId", categoryId, false));
        }

        /// <summary>
        /// GetRefinersByText method.
        /// </summary>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="searchText">The searchText.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRefiner.</returns>
        public async Task<PagedResult<ProductRefiner>> GetRefinersByText(long catalogId, string searchText, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductRefiner>(
                "Products",
                "Product",
                "GetRefinersByText",
                false, queryResultSettings, null, OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("searchText", searchText, false));
        }

        /// <summary>
        /// GetRefinerValuesByCategory method.
        /// </summary>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="refinerId">The refinerId.</param>
        /// <param name="refinerSourceValue">The refinerSourceValue.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRefinerValue.</returns>
        public async Task<PagedResult<ProductRefinerValue>> GetRefinerValuesByCategory(long catalogId, long categoryId, long refinerId, int refinerSourceValue, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductRefinerValue>(
                "Products",
                "Product",
                "GetRefinerValuesByCategory",
                false, queryResultSettings, null, OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("categoryId", categoryId, false),
                  OperationParameter.Create("refinerId", refinerId, false),
                  OperationParameter.Create("refinerSourceValue", refinerSourceValue, false));
        }

        /// <summary>
        /// GetRefinerValuesByText method.
        /// </summary>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="searchText">The searchText.</param>
        /// <param name="refinerId">The refinerId.</param>
        /// <param name="refinerSourceValue">The refinerSourceValue.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRefinerValue.</returns>
        public async Task<PagedResult<ProductRefinerValue>> GetRefinerValuesByText(long catalogId, string searchText, long refinerId, int refinerSourceValue, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductRefinerValue>(
                "Products",
                "Product",
                "GetRefinerValuesByText",
                false, queryResultSettings, null, OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("searchText", searchText, false),
                  OperationParameter.Create("refinerId", refinerId, false),
                  OperationParameter.Create("refinerSourceValue", refinerSourceValue, false));
        }

        /// <summary>
        /// GetChannelProductAttributes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of AttributeProduct.</returns>
        public async Task<PagedResult<AttributeProduct>> GetChannelProductAttributes(QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<AttributeProduct>(
                "Products",
                "Product",
                "GetChannelProductAttributes",
                false, queryResultSettings, null);
        }

        /// <summary>
        /// GetById method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <returns>SimpleProduct object.</returns>
        public async Task<SimpleProduct> GetById(long recordId, long channelId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<SimpleProduct>(
                "Products",
                "Product",
                "GetById",
                false, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false));
        }

        /// <summary>
        /// GetAttributeValues method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of AttributeValue.</returns>
        public async Task<PagedResult<AttributeValue>> GetAttributeValues(long recordId, long channelId, long catalogId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<AttributeValue>(
                "Products",
                "Product",
                "GetAttributeValues",
                false, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false));
        }

        /// <summary>
        /// GetMediaLocations method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of MediaLocation.</returns>
        public async Task<PagedResult<MediaLocation>> GetMediaLocations(long recordId, long channelId, long catalogId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<MediaLocation>(
                "Products",
                "Product",
                "GetMediaLocations",
                false, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false));
        }

        /// <summary>
        /// GetMediaBlobs method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of MediaBlob.</returns>
        public async Task<PagedResult<MediaBlob>> GetMediaBlobs(long recordId, long channelId, long catalogId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<MediaBlob>(
                "Products",
                "Product",
                "GetMediaBlobs",
                false, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false));
        }

        /// <summary>
        /// GetDefaultComponents method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductComponent.</returns>
        public async Task<PagedResult<ProductComponent>> GetDefaultComponents(long recordId, long channelId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductComponent>(
                "Products",
                "Product",
                "GetDefaultComponents",
                false, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false));
        }

        /// <summary>
        /// GetSlotComponents method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="slotId">The slotId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductComponent.</returns>
        public async Task<PagedResult<ProductComponent>> GetSlotComponents(long recordId, long channelId, long slotId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductComponent>(
                "Products",
                "Product",
                "GetSlotComponents",
                false, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("slotId", slotId, false));
        }

        /// <summary>
        /// GetRelationTypes method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRelationType.</returns>
        public async Task<PagedResult<ProductRelationType>> GetRelationTypes(long recordId, long channelId, long catalogId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductRelationType>(
                "Products",
                "Product",
                "GetRelationTypes",
                false, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false));
        }

        /// <summary>
        /// GetRelatedProducts method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="relationTypeId">The relationTypeId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        public async Task<PagedResult<ProductSearchResult>> GetRelatedProducts(long recordId, long channelId, long catalogId, long relationTypeId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductSearchResult>(
                "Products",
                "Product",
                "GetRelatedProducts",
                false, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("catalogId", catalogId, false),
                  OperationParameter.Create("relationTypeId", relationTypeId, false));
        }

        /// <summary>
        /// GetUnitsOfMeasure method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of UnitOfMeasure.</returns>
        public async Task<PagedResult<UnitOfMeasure>> GetUnitsOfMeasure(long recordId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<UnitOfMeasure>(
                "Products",
                "Product",
                "GetUnitsOfMeasure",
                false, queryResultSettings, null, OperationParameter.Create("RecordId", recordId, true));
        }

        /// <summary>
        /// GetPrice method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="customerAccountNumber">The customerAccountNumber.</param>
        /// <param name="unitOfMeasureSymbol">The unitOfMeasureSymbol.</param>
        /// <returns>ProductPrice object.</returns>
        public async Task<ProductPrice> GetPrice(long recordId, string customerAccountNumber, string unitOfMeasureSymbol)
        {
            return await this.context.ExecuteOperationSingleResultAsync<ProductPrice>(
                "Products",
                "Product",
                "GetPrice",
                false, null, OperationParameter.Create("RecordId", recordId, true),
                OperationParameter.Create("customerAccountNumber", customerAccountNumber, false),
                  OperationParameter.Create("unitOfMeasureSymbol", unitOfMeasureSymbol, false));
        }

    }

    /// <summary>
    /// Class implements ProductCatalog Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class ProductCatalogManager : IProductCatalogManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProductCatalog"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public ProductCatalogManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<ProductCatalog> Create(ProductCatalog entity)
        {
            return await this.context.Create<ProductCatalog>("Catalogs", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<ProductCatalog> Read(long recordId, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<ProductCatalog>(
                    "Catalogs",
                    e => e.RecordId == recordId,
                    expandProperties,
                    OperationParameter.Create("RecordId", recordId, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<ProductCatalog>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<ProductCatalog>("Catalogs", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<ProductCatalog> Update(ProductCatalog entity)
        {
            return await this.context.Update<ProductCatalog>("Catalogs", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(ProductCatalog entity)
        {
            await this.context.Delete<ProductCatalog>("Catalogs", entity);
        }

        // Operations

        /// <summary>
        /// GetCatalogs method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="activeOnly">The activeOnly.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductCatalog.</returns>
        public async Task<PagedResult<ProductCatalog>> GetCatalogs(long channelId, bool activeOnly, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<ProductCatalog>(
                "Catalogs",
                "ProductCatalog",
                "GetCatalogs",
                true, queryResultSettings, null, OperationParameter.Create("channelId", channelId, false),
                  OperationParameter.Create("activeOnly", activeOnly, false));
        }

    }

    /// <summary>
    /// Class implements CommerceList Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class CommerceListManager : ICommerceListManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="CommerceList"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public CommerceListManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<CommerceList> Create(CommerceList entity)
        {
            return await this.context.Create<CommerceList>("CommerceLists", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<CommerceList> Read(long id, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<CommerceList>(
                    "CommerceLists",
                    e => e.Id == id,
                    expandProperties,
                    OperationParameter.Create("Id", id, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<CommerceList>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<CommerceList>("CommerceLists", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<CommerceList> Update(CommerceList entity)
        {
            return await this.context.Update<CommerceList>("CommerceLists", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(CommerceList entity)
        {
            await this.context.Delete<CommerceList>("CommerceLists", entity);
        }

        // Operations

        /// <summary>
        /// GetByCustomer method.
        /// </summary>
        /// <param name="customerId">The customerId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CommerceList.</returns>
        public async Task<PagedResult<CommerceList>> GetByCustomer(string customerId, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<CommerceList>(
                "CommerceLists",
                "CommerceList",
                "GetByCustomer",
                true, queryResultSettings, null, OperationParameter.Create("customerId", customerId, false));
        }

        /// <summary>
        /// AddLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListLines">The commerceListLines.</param>
        /// <returns>CommerceList object.</returns>
        public async Task<CommerceList> AddLines(long id, IEnumerable<CommerceListLine> commerceListLines)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CommerceList>(
                "CommerceLists",
                "CommerceList",
                "AddLines",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("commerceListLines", commerceListLines, false));
        }

        /// <summary>
        /// UpdateLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListLines">The commerceListLines.</param>
        /// <returns>CommerceList object.</returns>
        public async Task<CommerceList> UpdateLines(long id, IEnumerable<CommerceListLine> commerceListLines)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CommerceList>(
                "CommerceLists",
                "CommerceList",
                "UpdateLines",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("commerceListLines", commerceListLines, false));
        }

        /// <summary>
        /// RemoveLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListLines">The commerceListLines.</param>
        /// <returns>CommerceList object.</returns>
        public async Task<CommerceList> RemoveLines(long id, IEnumerable<CommerceListLine> commerceListLines)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CommerceList>(
                "CommerceLists",
                "CommerceList",
                "RemoveLines",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("commerceListLines", commerceListLines, false));
        }

        /// <summary>
        /// MoveLines method.
        /// </summary>
        /// <param name="commerceListLines">The commerceListLines.</param>
        /// <param name="destinationId">The destinationId.</param>
        /// <returns>CommerceList object.</returns>
        public async Task<CommerceList> MoveLines(IEnumerable<CommerceListLine> commerceListLines, long destinationId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CommerceList>(
                "CommerceLists",
                "CommerceList",
                "MoveLines",
                true, null, OperationParameter.Create("commerceListLines", commerceListLines, false),
                  OperationParameter.Create("destinationId", destinationId, false));
        }

        /// <summary>
        /// CopyLines method.
        /// </summary>
        /// <param name="commerceListLines">The commerceListLines.</param>
        /// <param name="destinationId">The destinationId.</param>
        /// <returns>CommerceList object.</returns>
        public async Task<CommerceList> CopyLines(IEnumerable<CommerceListLine> commerceListLines, long destinationId)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CommerceList>(
                "CommerceLists",
                "CommerceList",
                "CopyLines",
                true, null, OperationParameter.Create("commerceListLines", commerceListLines, false),
                  OperationParameter.Create("destinationId", destinationId, false));
        }

        /// <summary>
        /// AddContributors method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListContributors">The commerceListContributors.</param>
        /// <returns>CommerceList object.</returns>
        public async Task<CommerceList> AddContributors(long id, IEnumerable<CommerceListContributor> commerceListContributors)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CommerceList>(
                "CommerceLists",
                "CommerceList",
                "AddContributors",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("commerceListContributors", commerceListContributors, false));
        }

        /// <summary>
        /// RemoveContributors method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListContributors">The commerceListContributors.</param>
        /// <returns>CommerceList object.</returns>
        public async Task<CommerceList> RemoveContributors(long id, IEnumerable<CommerceListContributor> commerceListContributors)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CommerceList>(
                "CommerceLists",
                "CommerceList",
                "RemoveContributors",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("commerceListContributors", commerceListContributors, false));
        }

        /// <summary>
        /// CreateInvitations method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListInvitations">The commerceListInvitations.</param>
        /// <returns>CommerceList object.</returns>
        public async Task<CommerceList> CreateInvitations(long id, IEnumerable<CommerceListInvitation> commerceListInvitations)
        {
            return await this.context.ExecuteOperationSingleResultAsync<CommerceList>(
                "CommerceLists",
                "CommerceList",
                "CreateInvitations",
                true, null, OperationParameter.Create("Id", id, true),
                OperationParameter.Create("commerceListInvitations", commerceListInvitations, false));
        }

        /// <summary>
        /// AcceptInvitation method.
        /// </summary>
        /// <param name="invitationToken">The invitationToken.</param>
        /// <param name="customerId">The customerId.</param>
        public async Task AcceptInvitation(string invitationToken, string customerId)
        {
            await this.context.ExecuteOperationAsync(
                "CommerceLists",
                "CommerceList",
                "AcceptInvitation",
                true, OperationParameter.Create("invitationToken", invitationToken, false),
                  OperationParameter.Create("customerId", customerId, false));
        }

    }

    /// <summary>
    /// Class implements TransferOrder Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class TransferOrderManager : ITransferOrderManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="TransferOrder"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public TransferOrderManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<TransferOrder> Create(TransferOrder entity)
        {
            return await this.context.Create<TransferOrder>("TransferOrders", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<TransferOrder> Read(string orderId, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<TransferOrder>(
                    "TransferOrders",
                    e => e.OrderId == orderId,
                    expandProperties,
                    OperationParameter.Create("OrderId", orderId, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<TransferOrder>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<TransferOrder>("TransferOrders", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<TransferOrder> Update(TransferOrder entity)
        {
            return await this.context.Update<TransferOrder>("TransferOrders", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(TransferOrder entity)
        {
            await this.context.Delete<TransferOrder>("TransferOrders", entity);
        }

        // Operations

        /// <summary>
        /// Commit method.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        public async Task Commit(string orderId)
        {
            await this.context.ExecuteOperationAsync(
                "TransferOrders",
                "TransferOrder",
                "Commit",
                true, OperationParameter.Create("OrderId", orderId, true));
        }

    }

    /// <summary>
    /// Class implements PurchaseOrder Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class PurchaseOrderManager : IPurchaseOrderManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="PurchaseOrder"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public PurchaseOrderManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<PurchaseOrder> Create(PurchaseOrder entity)
        {
            return await this.context.Create<PurchaseOrder>("PurchaseOrders", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<PurchaseOrder> Read(string orderId, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<PurchaseOrder>(
                    "PurchaseOrders",
                    e => e.OrderId == orderId,
                    expandProperties,
                    OperationParameter.Create("OrderId", orderId, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<PurchaseOrder>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<PurchaseOrder>("PurchaseOrders", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<PurchaseOrder> Update(PurchaseOrder entity)
        {
            return await this.context.Update<PurchaseOrder>("PurchaseOrders", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(PurchaseOrder entity)
        {
            await this.context.Delete<PurchaseOrder>("PurchaseOrders", entity);
        }

        // Operations

        /// <summary>
        /// Commit method.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        public async Task Commit(string orderId)
        {
            await this.context.ExecuteOperationAsync(
                "PurchaseOrders",
                "PurchaseOrder",
                "Commit",
                true, OperationParameter.Create("OrderId", orderId, true));
        }

    }

    /// <summary>
    /// Class implements PickingList Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class PickingListManager : IPickingListManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="PickingList"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public PickingListManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<PickingList> Create(PickingList entity)
        {
            return await this.context.Create<PickingList>("PickingLists", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<PickingList> Read(string orderId, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<PickingList>(
                    "PickingLists",
                    e => e.OrderId == orderId,
                    expandProperties,
                    OperationParameter.Create("OrderId", orderId, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<PickingList>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<PickingList>("PickingLists", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<PickingList> Update(PickingList entity)
        {
            return await this.context.Update<PickingList>("PickingLists", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(PickingList entity)
        {
            await this.context.Delete<PickingList>("PickingLists", entity);
        }

        // Operations

        /// <summary>
        /// Commit method.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        public async Task Commit(string orderId)
        {
            await this.context.ExecuteOperationAsync(
                "PickingLists",
                "PickingList",
                "Commit",
                true, OperationParameter.Create("OrderId", orderId, true));
        }

    }

    /// <summary>
    /// Class implements Warehouse Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class WarehouseManager : IWarehouseManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="Warehouse"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public WarehouseManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<Warehouse> Create(Warehouse entity)
        {
            return await this.context.Create<Warehouse>("Warehouses", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="inventLocation">The inventLocation.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<Warehouse> Read(string inventLocation, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<Warehouse>(
                    "Warehouses",
                    e => e.InventLocation == inventLocation,
                    expandProperties,
                    OperationParameter.Create("InventLocation", inventLocation, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<Warehouse>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<Warehouse>("Warehouses", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<Warehouse> Update(Warehouse entity)
        {
            return await this.context.Update<Warehouse>("Warehouses", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(Warehouse entity)
        {
            await this.context.Delete<Warehouse>("Warehouses", entity);
        }

        // Operations

        /// <summary>
        /// GetWarehouseById method.
        /// </summary>
        /// <param name="inventLocation">The inventLocation.</param>
        /// <returns>Warehouse object.</returns>
        public async Task<Warehouse> GetWarehouseById(string inventLocation)
        {
            return await this.context.ExecuteOperationSingleResultAsync<Warehouse>(
                "Warehouses",
                "Warehouse",
                "GetWarehouseById",
                false, null, OperationParameter.Create("InventLocation", inventLocation, true));
        }

        /// <summary>
        /// GetLocations method.
        /// </summary>
        /// <param name="inventLocation">The inventLocation.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of WarehouseLocation.</returns>
        public async Task<PagedResult<WarehouseLocation>> GetLocations(string inventLocation, QueryResultSettings queryResultSettings)
        {
            return await this.context.ExecuteOperationAsync<WarehouseLocation>(
                "Warehouses",
                "Warehouse",
                "GetLocations",
                false, queryResultSettings, null, OperationParameter.Create("InventLocation", inventLocation, true));
        }

    }

    /// <summary>
    /// Class implements ScanResult Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    internal class ScanResultManager : IScanResultManager
    {
        private IContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="ScanResult"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public ScanResultManager(IContext context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        public async Task<ScanResult> Create(ScanResult entity)
        {
            return await this.context.Create<ScanResult>("ScanResults", entity);
        }

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="scannedText">The scannedText.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        public async Task<ScanResult> Read(string scannedText, ICollection<string> expandProperties = null)
        {
            return await this.context.Read<ScanResult>(
                    "ScanResults",
                    e => e.ScannedText == scannedText,
                    expandProperties,
                    OperationParameter.Create("ScannedText", scannedText, true));
        }

        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        public async Task<PagedResult<ScanResult>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null)
        {
            return await this.context.ReadAll<ScanResult>("ScanResults", expandProperties, queryResultSettings);
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        public async Task<ScanResult> Update(ScanResult entity)
        {
            return await this.context.Update<ScanResult>("ScanResults", entity);
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>No return.</returns>
        public async Task Delete(ScanResult entity)
        {
            await this.context.Delete<ScanResult>("ScanResults", entity);
        }

        // Operations

    }
}
