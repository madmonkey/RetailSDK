/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client.Data.Services
{
    using Entities;
    using System;
    using System.CodeDom.Compiler;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// Base Interface for Managers.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IEntityManager
    {
    }
    
    /// <summary>
    /// Interface for Store Operations Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IStoreOperationsManager : IEntityManager
    {
        
        /// <summary>
        /// RoundAmountByTenderType method.
        /// </summary>
        /// <param name="amount">The amount.</param>
        /// <param name="tenderTypeId">The tenderTypeId.</param>
        /// <returns>decimal object.</returns>
        Task<decimal> RoundAmountByTenderType(decimal amount, string tenderTypeId);
    
        /// <summary>
        /// StartSession method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        Task StartSession(string transactionId);
    
        /// <summary>
        /// EndSession method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        Task EndSession(string transactionId);
    
        /// <summary>
        /// ActivateDevice method.
        /// </summary>
        /// <param name="deviceNumber">The deviceNumber.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="deviceId">The deviceId.</param>
        /// <param name="forceActivate">The forceActivate.</param>
        /// <param name="deviceType">The deviceType.</param>
        /// <returns>DeviceActivationResult object.</returns>
        Task<DeviceActivationResult> ActivateDevice(string deviceNumber, string terminalId, string deviceId, bool forceActivate, int? deviceType);
    
        /// <summary>
        /// DeactivateDevice method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        Task DeactivateDevice(string transactionId);
    
        /// <summary>
        /// CreateHardwareStationToken method.
        /// </summary>
        /// <returns>CreateHardwareStationTokenResult object.</returns>
        Task<CreateHardwareStationTokenResult> CreateHardwareStationToken();
    
        /// <summary>
        /// ValidateHardwareStationToken method.
        /// </summary>
        /// <param name="deviceNumber">The deviceNumber.</param>
        /// <param name="hardwareStationToken">The hardwareStationToken.</param>
        /// <returns>ValidateHardwareStationTokenResult object.</returns>
        Task<ValidateHardwareStationTokenResult> ValidateHardwareStationToken(string deviceNumber, string hardwareStationToken);
    
        /// <summary>
        /// GetBarcodeById method.
        /// </summary>
        /// <param name="barcodeId">The barcodeId.</param>
        /// <returns>Barcode object.</returns>
        Task<Barcode> GetBarcodeById(string barcodeId);
    
        /// <summary>
        /// GetButtonGridById method.
        /// </summary>
        /// <param name="buttonGridId">The buttonGridId.</param>
        /// <returns>ButtonGrid object.</returns>
        Task<ButtonGrid> GetButtonGridById(string buttonGridId);
    
        /// <summary>
        /// GetButtonGridsByIds method.
        /// </summary>
        /// <param name="getButtonGridsByIdsCriteria">The getButtonGridsByIdsCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ButtonGrid.</returns>
        Task<PagedResult<ButtonGrid>> GetButtonGridsByIds(GetButtonGridsByIdsCriteria getButtonGridsByIdsCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCardTypes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CardTypeInfo.</returns>
        Task<PagedResult<CardTypeInfo>> GetCardTypes(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetSupportedPaymentCardTypes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of string.</returns>
        Task<PagedResult<string>> GetSupportedPaymentCardTypes(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCities method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="stateProvinceId">The stateProvinceId.</param>
        /// <param name="countyId">The countyId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CityInfo.</returns>
        Task<PagedResult<CityInfo>> GetCities(string countryRegionId, string stateProvinceId, string countyId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCountryRegionsByLanguageId method.
        /// </summary>
        /// <param name="languageId">The languageId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CountryRegionInfo.</returns>
        Task<PagedResult<CountryRegionInfo>> GetCountryRegionsByLanguageId(string languageId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCounties method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="stateProvinceId">The stateProvinceId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CountyInfo.</returns>
        Task<PagedResult<CountyInfo>> GetCounties(string countryRegionId, string stateProvinceId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCreditMemoById method.
        /// </summary>
        /// <param name="creditMemoId">The creditMemoId.</param>
        /// <returns>CreditMemo object.</returns>
        Task<CreditMemo> GetCreditMemoById(string creditMemoId);
    
        /// <summary>
        /// GetDownloadInterval method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <returns>string object.</returns>
        Task<string> GetDownloadInterval(string dataStoreName);
    
        /// <summary>
        /// GetTerminalDataStoreName method.
        /// </summary>
        /// <param name="terminalId">The terminalId.</param>
        /// <returns>string object.</returns>
        Task<string> GetTerminalDataStoreName(string terminalId);
    
        /// <summary>
        /// GetDownloadLink method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <param name="downloadSessionId">The downloadSessionId.</param>
        /// <returns>string object.</returns>
        Task<string> GetDownloadLink(string dataStoreName, long downloadSessionId);
    
        /// <summary>
        /// GetDownloadSessions method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DownloadSession.</returns>
        Task<PagedResult<DownloadSession>> GetDownloadSessions(string dataStoreName, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetInitialDownloadSessions method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DownloadSession.</returns>
        Task<PagedResult<DownloadSession>> GetInitialDownloadSessions(string dataStoreName, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetUploadJobDefinitions method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of string.</returns>
        Task<PagedResult<string>> GetUploadJobDefinitions(string dataStoreName, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetUploadInterval method.
        /// </summary>
        /// <param name="dataStoreName">The dataStoreName.</param>
        /// <returns>string object.</returns>
        Task<string> GetUploadInterval(string dataStoreName);
    
        /// <summary>
        /// PostOfflineTransactions method.
        /// </summary>
        /// <param name="offlineTransactionForMPOS">The offlineTransactionForMPOS.</param>
        /// <returns>bool object.</returns>
        Task<bool> PostOfflineTransactions(IEnumerable<string> offlineTransactionForMPOS);
    
        /// <summary>
        /// GetRetailTrialPlanOffer method.
        /// </summary>
        /// <returns>bool object.</returns>
        Task<bool> GetRetailTrialPlanOffer();
    
        /// <summary>
        /// GetLatestNumberSequence method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of NumberSequenceSeedData.</returns>
        Task<PagedResult<NumberSequenceSeedData>> GetLatestNumberSequence(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// CalculateTotalCurrencyAmount method.
        /// </summary>
        /// <param name="currenciesAmount">The currenciesAmount.</param>
        /// <returns>CurrencyAmount object.</returns>
        Task<CurrencyAmount> CalculateTotalCurrencyAmount(IEnumerable<CurrencyRequest> currenciesAmount);
    
        /// <summary>
        /// GetDiscountCode method.
        /// </summary>
        /// <param name="discountCode">The discountCode.</param>
        /// <returns>DiscountCode object.</returns>
        Task<DiscountCode> GetDiscountCode(string discountCode);
    
        /// <summary>
        /// GetDiscountCodesByOfferId method.
        /// </summary>
        /// <param name="offerId">The offerId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DiscountCode.</returns>
        Task<PagedResult<DiscountCode>> GetDiscountCodesByOfferId(string offerId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetDiscountCodesByKeyword method.
        /// </summary>
        /// <param name="keyword">The keyword.</param>
        /// <param name="activeDate">The activeDate.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DiscountCode.</returns>
        Task<PagedResult<DiscountCode>> GetDiscountCodesByKeyword(string keyword, DateTimeOffset activeDate, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetDistricts method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="stateProvinceId">The stateProvinceId.</param>
        /// <param name="countyId">The countyId.</param>
        /// <param name="cityName">The cityName.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DistrictInfo.</returns>
        Task<PagedResult<DistrictInfo>> GetDistricts(string countryRegionId, string stateProvinceId, string countyId, string cityName, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetHardwareStationProfiles method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of HardwareStationProfile.</returns>
        Task<PagedResult<HardwareStationProfile>> GetHardwareStationProfiles(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetHardwareProfileById method.
        /// </summary>
        /// <param name="hardwareProfileId">The hardwareProfileId.</param>
        /// <returns>HardwareProfile object.</returns>
        Task<HardwareProfile> GetHardwareProfileById(string hardwareProfileId);
    
        /// <summary>
        /// GetLocalizedStrings method.
        /// </summary>
        /// <param name="languageId">The languageId.</param>
        /// <param name="textId">The textId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of LocalizedString.</returns>
        Task<PagedResult<LocalizedString>> GetLocalizedStrings(string languageId, int? textId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetOperationPermissionById method.
        /// </summary>
        /// <param name="operationId">The operationId.</param>
        /// <returns>OperationPermission object.</returns>
        Task<OperationPermission> GetOperationPermissionById(int operationId);
    
        /// <summary>
        /// GetReasonCodesById method.
        /// </summary>
        /// <param name="reasonCodeGroupId">The reasonCodeGroupId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ReasonCode.</returns>
        Task<PagedResult<ReasonCode>> GetReasonCodesById(string reasonCodeGroupId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// SearchReportDataSet method.
        /// </summary>
        /// <param name="reportId">The reportId.</param>
        /// <param name="parameters">The parameters.</param>
        /// <returns>ReportDataSet object.</returns>
        Task<ReportDataSet> SearchReportDataSet(string reportId, IEnumerable<CommerceProperty> parameters);
    
        /// <summary>
        /// GetReportDataSetById method.
        /// </summary>
        /// <param name="reportId">The reportId.</param>
        /// <returns>ReportDataSet object.</returns>
        Task<ReportDataSet> GetReportDataSetById(string reportId);
    
        /// <summary>
        /// GetIncomeExpenseAccounts method.
        /// </summary>
        /// <param name="incomeExpenseAccountType">The incomeExpenseAccountType.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of IncomeExpenseAccount.</returns>
        Task<PagedResult<IncomeExpenseAccount>> GetIncomeExpenseAccounts(int incomeExpenseAccountType, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetStateProvinces method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of StateProvinceInfo.</returns>
        Task<PagedResult<StateProvinceInfo>> GetStateProvinces(string countryRegionId, QueryResultSettings queryResultSettings);
    
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
        Task<PagedResult<ZipCodeInfo>> GetZipCodes(string countryRegionId, string stateProvinceId, string countyId, string cityName, string district, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetAddressFromZipCode method.
        /// </summary>
        /// <param name="countryRegionId">The countryRegionId.</param>
        /// <param name="zipPostalCode">The zipPostalCode.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ZipCodeInfo.</returns>
        Task<PagedResult<ZipCodeInfo>> GetAddressFromZipCode(string countryRegionId, string zipPostalCode, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// DisassembleKitTransactions method.
        /// </summary>
        /// <param name="kitTransaction">The kitTransaction.</param>
        /// <returns>KitTransaction object.</returns>
        Task<KitTransaction> DisassembleKitTransactions(KitTransaction kitTransaction);
    
        /// <summary>
        /// IssueLoyaltyCard method.
        /// </summary>
        /// <param name="loyaltyCard">The loyaltyCard.</param>
        /// <returns>LoyaltyCard object.</returns>
        Task<LoyaltyCard> IssueLoyaltyCard(LoyaltyCard loyaltyCard);
    
        /// <summary>
        /// GetLoyaltyCard method.
        /// </summary>
        /// <param name="cardNumber">The cardNumber.</param>
        /// <returns>LoyaltyCard object.</returns>
        Task<LoyaltyCard> GetLoyaltyCard(string cardNumber);
    
        /// <summary>
        /// GetCustomerLoyaltyCards method.
        /// </summary>
        /// <param name="accountNumber">The accountNumber.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of LoyaltyCard.</returns>
        Task<PagedResult<LoyaltyCard>> GetCustomerLoyaltyCards(string accountNumber, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetLoyaltyCardTransactions method.
        /// </summary>
        /// <param name="cardNumber">The cardNumber.</param>
        /// <param name="rewardPointId">The rewardPointId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of LoyaltyCardTransaction.</returns>
        Task<PagedResult<LoyaltyCardTransaction>> GetLoyaltyCardTransactions(string cardNumber, string rewardPointId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// SearchJournalTransactions method.
        /// </summary>
        /// <param name="searchCriteria">The searchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Transaction.</returns>
        Task<PagedResult<Transaction>> SearchJournalTransactions(TransactionSearchCriteria searchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetGiftCard method.
        /// </summary>
        /// <param name="giftCardId">The giftCardId.</param>
        /// <returns>GiftCard object.</returns>
        Task<GiftCard> GetGiftCard(string giftCardId);
    
        /// <summary>
        /// GetNonSalesTransactions method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="shiftTerminalId">The shiftTerminalId.</param>
        /// <param name="nonSalesTenderTypeValue">The nonSalesTenderTypeValue.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of NonSalesTransaction.</returns>
        Task<PagedResult<NonSalesTransaction>> GetNonSalesTransactions(string shiftId, string shiftTerminalId, int nonSalesTenderTypeValue, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// CreateNonSalesTransaction method.
        /// </summary>
        /// <param name="nonSalesTransaction">The nonSalesTransaction.</param>
        /// <returns>NonSalesTransaction object.</returns>
        Task<NonSalesTransaction> CreateNonSalesTransaction(NonSalesTransaction nonSalesTransaction);
    
        /// <summary>
        /// CreateDropAndDeclareTransaction method.
        /// </summary>
        /// <param name="dropAndDeclareTransaction">The dropAndDeclareTransaction.</param>
        /// <returns>DropAndDeclareTransaction object.</returns>
        Task<DropAndDeclareTransaction> CreateDropAndDeclareTransaction(DropAndDeclareTransaction dropAndDeclareTransaction);
    
        /// <summary>
        /// GetTaxOverrides method.
        /// </summary>
        /// <param name="overrideBy">The overrideBy.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of TaxOverride.</returns>
        Task<PagedResult<TaxOverride>> GetTaxOverrides(string overrideBy, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCustomerBalance method.
        /// </summary>
        /// <param name="accountNumber">The accountNumber.</param>
        /// <param name="invoiceAccountNumber">The invoiceAccountNumber.</param>
        /// <returns>CustomerBalances object.</returns>
        Task<CustomerBalances> GetCustomerBalance(string accountNumber, string invoiceAccountNumber);
    
        /// <summary>
        /// InitiateLinkToExistingCustomer method.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <param name="emailTemplateId">The emailTemplateId.</param>
        /// <param name="emailProperties">The emailProperties.</param>
        /// <returns>LinkToExistingCustomerResult object.</returns>
        Task<LinkToExistingCustomerResult> InitiateLinkToExistingCustomer(string email, string emailTemplateId, IEnumerable<NameValuePair> emailProperties);
    
        /// <summary>
        /// FinalizeLinkToExistingCustomer method.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <returns>LinkToExistingCustomerResult object.</returns>
        Task<LinkToExistingCustomerResult> FinalizeLinkToExistingCustomer(string email);
    
        /// <summary>
        /// UnlinkFromExistingCustomer method.
        /// </summary>
        Task UnlinkFromExistingCustomer();
    
        /// <summary>
        /// GetOfflineSyncStatus method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OfflineSyncStatsLine.</returns>
        Task<PagedResult<OfflineSyncStatsLine>> GetOfflineSyncStatus(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetOfflinePendingTransactionCount method.
        /// </summary>
        /// <returns>long object.</returns>
        Task<long> GetOfflinePendingTransactionCount();
    
        /// <summary>
        /// UpdateDownloadSession method.
        /// </summary>
        /// <param name="downloadSession">The downloadSession.</param>
        /// <returns>bool object.</returns>
        Task<bool> UpdateDownloadSession(DownloadSession downloadSession);
    
        /// <summary>
        /// UpdateApplicationVersion method.
        /// </summary>
        /// <param name="appVersion">The appVersion.</param>
        Task UpdateApplicationVersion(string appVersion);
    
        /// <summary>
        /// GetStorageAccessTokenForUpload method.
        /// </summary>
        /// <returns>StorageAccessToken object.</returns>
        Task<StorageAccessToken> GetStorageAccessTokenForUpload();
    
        /// <summary>
        /// GetBusinessProcessModelLibraries method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Framework.</returns>
        Task<PagedResult<Framework>> GetBusinessProcessModelLibraries(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetBusinessProcessModelLibrary method.
        /// </summary>
        /// <param name="businessProcessModelFrameworkLineId">The businessProcessModelFrameworkLineId.</param>
        /// <param name="hierarchyDepth">The hierarchyDepth.</param>
        /// <returns>Framework object.</returns>
        Task<Framework> GetBusinessProcessModelLibrary(int businessProcessModelFrameworkLineId, int hierarchyDepth);
    
        /// <summary>
        /// SearchTaskGuidesByTitle method.
        /// </summary>
        /// <param name="businessProcessModelFrameworkLineId">The businessProcessModelFrameworkLineId.</param>
        /// <param name="taskGuideSearchText">The taskGuideSearchText.</param>
        /// <param name="queryTypeValue">The queryTypeValue.</param>
        /// <returns>TaskGuidesSearchResult object.</returns>
        Task<TaskGuidesSearchResult> SearchTaskGuidesByTitle(int businessProcessModelFrameworkLineId, string taskGuideSearchText, int queryTypeValue);
    
        /// <summary>
        /// GenerateBusinessProcessModelPackage method.
        /// </summary>
        /// <param name="taskRecording">The taskRecording.</param>
        /// <returns>string object.</returns>
        Task<string> GenerateBusinessProcessModelPackage(Recording taskRecording);
    
        /// <summary>
        /// DownloadRecording method.
        /// </summary>
        /// <param name="businessProcessModelLineId">The businessProcessModelLineId.</param>
        /// <returns>Recording object.</returns>
        Task<Recording> DownloadRecording(int businessProcessModelLineId);
    
        /// <summary>
        /// LoadRecordingFromFile method.
        /// </summary>
        /// <param name="recordingUrl">The recordingUrl.</param>
        /// <returns>Recording object.</returns>
        Task<Recording> LoadRecordingFromFile(string recordingUrl);
    
        /// <summary>
        /// GenerateRecordingFile method.
        /// </summary>
        /// <param name="taskRecording">The taskRecording.</param>
        /// <returns>string object.</returns>
        Task<string> GenerateRecordingFile(Recording taskRecording);
    
        /// <summary>
        /// GenerateTrainingDocument method.
        /// </summary>
        /// <param name="taskRecording">The taskRecording.</param>
        /// <returns>string object.</returns>
        Task<string> GenerateTrainingDocument(Recording taskRecording);
    
        /// <summary>
        /// GenerateRecordingBundle method.
        /// </summary>
        /// <param name="taskRecording">The taskRecording.</param>
        /// <returns>string object.</returns>
        Task<string> GenerateRecordingBundle(Recording taskRecording);
    
        /// <summary>
        /// UploadRecording method.
        /// </summary>
        /// <param name="taskRecording">The taskRecording.</param>
        /// <param name="businessProcessModelLineId">The businessProcessModelLineId.</param>
        Task UploadRecording(Recording taskRecording, int businessProcessModelLineId);
    
        /// <summary>
        /// GetButtonGrids method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ButtonGrid.</returns>
        Task<PagedResult<ButtonGrid>> GetButtonGrids(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCashDeclarations method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CashDeclaration.</returns>
        Task<PagedResult<CashDeclaration>> GetCashDeclarations(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCountryRegions method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CountryRegionInfo.</returns>
        Task<PagedResult<CountryRegionInfo>> GetCountryRegions(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCustomerGroups method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CustomerGroup.</returns>
        Task<PagedResult<CustomerGroup>> GetCustomerGroups(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetDeliveryOptions method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DeliveryOption.</returns>
        Task<PagedResult<DeliveryOption>> GetDeliveryOptions(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetEnvironmentConfiguration method.
        /// </summary>
        /// <returns>EnvironmentConfiguration object.</returns>
        Task<EnvironmentConfiguration> GetEnvironmentConfiguration();
    
        /// <summary>
        /// GetDeviceConfiguration method.
        /// </summary>
        /// <returns>DeviceConfiguration object.</returns>
        Task<DeviceConfiguration> GetDeviceConfiguration();
    
        /// <summary>
        /// GetLanguages method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SupportedLanguage.</returns>
        Task<PagedResult<SupportedLanguage>> GetLanguages(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetAffiliations method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Affiliation.</returns>
        Task<PagedResult<Affiliation>> GetAffiliations(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetOperationPermissions method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OperationPermission.</returns>
        Task<PagedResult<OperationPermission>> GetOperationPermissions(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetReasonCodes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ReasonCode.</returns>
        Task<PagedResult<ReasonCode>> GetReasonCodes(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetReturnOrderReasonCodes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ReasonCode.</returns>
        Task<PagedResult<ReasonCode>> GetReturnOrderReasonCodes(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetSalesTaxGroups method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesTaxGroup.</returns>
        Task<PagedResult<SalesTaxGroup>> GetSalesTaxGroups(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetTenderTypes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of TenderType.</returns>
        Task<PagedResult<TenderType>> GetTenderTypes(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetUnitsOfMeasure method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of UnitOfMeasure.</returns>
        Task<PagedResult<UnitOfMeasure>> GetUnitsOfMeasure(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetDiscountCodes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DiscountCode.</returns>
        Task<PagedResult<DiscountCode>> GetDiscountCodes(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCurrencies method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Currency.</returns>
        Task<PagedResult<Currency>> GetCurrencies(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCurrenciesAmount method.
        /// </summary>
        /// <param name="currencyCode">The currencyCode.</param>
        /// <param name="amount">The amount.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CurrencyAmount.</returns>
        Task<PagedResult<CurrencyAmount>> GetCurrenciesAmount(string currencyCode, decimal amount, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetCommissionSalesGroups method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CommissionSalesGroup.</returns>
        Task<PagedResult<CommissionSalesGroup>> GetCommissionSalesGroups(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetPaymentMerchantInformation method.
        /// </summary>
        /// <param name="hardwareProfileId">The hardwareProfileId.</param>
        /// <returns>PaymentMerchantInformation object.</returns>
        Task<PaymentMerchantInformation> GetPaymentMerchantInformation(string hardwareProfileId);
    
        /// <summary>
        /// GetOnlineChannelPublishStatus method.
        /// </summary>
        /// <returns>int object.</returns>
        Task<int> GetOnlineChannelPublishStatus();
    
        /// <summary>
        /// SetOnlineChannelPublishStatus method.
        /// </summary>
        /// <param name="publishingStatus">The publishingStatus.</param>
        /// <param name="statusMessage">The statusMessage.</param>
        Task SetOnlineChannelPublishStatus(int publishingStatus, string statusMessage);
    
        /// <summary>
        /// GetAvailableDevices method.
        /// </summary>
        /// <param name="deviceType">The deviceType.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Device.</returns>
        Task<PagedResult<Device>> GetAvailableDevices(int deviceType, QueryResultSettings queryResultSettings);
    
    }
    
    /// <summary>
    /// Interface for Category Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface ICategoryManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<Category> Create(Category entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<Category> Read(long recordId, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<Category>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<Category> Update(Category entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(Category entity);
        
        /// <summary>
        /// GetCategories method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Category.</returns>
        Task<PagedResult<Category>> GetCategories(long channelId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetAttributes method.
        /// </summary>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of AttributeCategory.</returns>
        Task<PagedResult<AttributeCategory>> GetAttributes(long categoryId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetChildren method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Category.</returns>
        Task<PagedResult<Category>> GetChildren(long channelId, long categoryId, QueryResultSettings queryResultSettings);
    
    }
    
    /// <summary>
    /// Interface for Cart Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface ICartManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<Cart> Create(Cart entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<Cart> Read(string id, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<Cart>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<Cart> Update(Cart entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(Cart entity);
        
        /// <summary>
        /// Checkout method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="receiptEmail">The receiptEmail.</param>
        /// <param name="tokenizedPaymentCard">The tokenizedPaymentCard.</param>
        /// <param name="receiptNumberSequence">The receiptNumberSequence.</param>
        /// <param name="cartTenderLines">The cartTenderLines.</param>
        /// <returns>SalesOrder object.</returns>
        Task<SalesOrder> Checkout(string id, string receiptEmail, TokenizedPaymentCard tokenizedPaymentCard, string receiptNumberSequence, IEnumerable<CartTenderLine> cartTenderLines);
    
        /// <summary>
        /// GetPaymentsHistory method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of TenderLine.</returns>
        Task<PagedResult<TenderLine>> GetPaymentsHistory(string id, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetLineDeliveryOptions method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="lineShippingAddresses">The lineShippingAddresses.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesLineDeliveryOption.</returns>
        Task<PagedResult<SalesLineDeliveryOption>> GetLineDeliveryOptions(string id, IEnumerable<LineShippingAddress> lineShippingAddresses, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetDeliveryPreferences method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>CartDeliveryPreferences object.</returns>
        Task<CartDeliveryPreferences> GetDeliveryPreferences(string id);
    
        /// <summary>
        /// GetDeliveryOptions method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="shippingAddress">The shippingAddress.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of DeliveryOption.</returns>
        Task<PagedResult<DeliveryOption>> GetDeliveryOptions(string id, Address shippingAddress, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// UpdateLineDeliverySpecifications method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="lineDeliverySpecifications">The lineDeliverySpecifications.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> UpdateLineDeliverySpecifications(string id, IEnumerable<LineDeliverySpecification> lineDeliverySpecifications);
    
        /// <summary>
        /// UpdateDeliverySpecification method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="deliverySpecification">The deliverySpecification.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> UpdateDeliverySpecification(string id, DeliverySpecification deliverySpecification);
    
        /// <summary>
        /// Void method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="reasonCodeLines">The reasonCodeLines.</param>
        /// <returns>SalesOrder object.</returns>
        Task<SalesOrder> Void(string id, IEnumerable<ReasonCodeLine> reasonCodeLines);
    
        /// <summary>
        /// AddCartLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartLines">The cartLines.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> AddCartLines(string id, IEnumerable<CartLine> cartLines);
    
        /// <summary>
        /// UpdateCartLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartLines">The cartLines.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> UpdateCartLines(string id, IEnumerable<CartLine> cartLines);
    
        /// <summary>
        /// VoidCartLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartLines">The cartLines.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> VoidCartLines(string id, IEnumerable<CartLine> cartLines);
    
        /// <summary>
        /// RemoveCartLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartLineIds">The cartLineIds.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> RemoveCartLines(string id, IEnumerable<string> cartLineIds);
    
        /// <summary>
        /// AddTenderLine method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartTenderLine">The cartTenderLine.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> AddTenderLine(string id, CartTenderLine cartTenderLine);
    
        /// <summary>
        /// AddPreprocessedTenderLine method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="preprocessedTenderLine">The preprocessedTenderLine.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> AddPreprocessedTenderLine(string id, TenderLine preprocessedTenderLine);
    
        /// <summary>
        /// ValidateTenderLineForAdd method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="tenderLine">The tenderLine.</param>
        Task ValidateTenderLineForAdd(string id, TenderLine tenderLine);
    
        /// <summary>
        /// UpdateTenderLineSignature method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="tenderLineId">The tenderLineId.</param>
        /// <param name="signatureData">The signatureData.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> UpdateTenderLineSignature(string id, string tenderLineId, string signatureData);
    
        /// <summary>
        /// Copy method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="targetCartType">The targetCartType.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> Copy(string id, int targetCartType);
    
        /// <summary>
        /// VoidTenderLine method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="tenderLineId">The tenderLineId.</param>
        /// <param name="reasonCodeLines">The reasonCodeLines.</param>
        /// <param name="isPreprocessed">The isPreprocessed.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> VoidTenderLine(string id, string tenderLineId, IEnumerable<ReasonCodeLine> reasonCodeLines, bool? isPreprocessed);
    
        /// <summary>
        /// IssueGiftCard method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="giftCardId">The giftCardId.</param>
        /// <param name="amount">The amount.</param>
        /// <param name="currencyCode">The currencyCode.</param>
        /// <param name="lineDescription">The lineDescription.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> IssueGiftCard(string id, string giftCardId, decimal amount, string currencyCode, string lineDescription);
    
        /// <summary>
        /// RefillGiftCard method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="giftCardId">The giftCardId.</param>
        /// <param name="amount">The amount.</param>
        /// <param name="currencyCode">The currencyCode.</param>
        /// <param name="lineDescription">The lineDescription.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> RefillGiftCard(string id, string giftCardId, decimal amount, string currencyCode, string lineDescription);
    
        /// <summary>
        /// Suspend method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> Suspend(string id);
    
        /// <summary>
        /// Resume method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> Resume(string id);
    
        /// <summary>
        /// RemoveDiscountCodes method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="discountCodes">The discountCodes.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> RemoveDiscountCodes(string id, IEnumerable<string> discountCodes);
    
        /// <summary>
        /// GetSuspended method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Cart.</returns>
        Task<PagedResult<Cart>> GetSuspended(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// Search method.
        /// </summary>
        /// <param name="cartSearchCriteria">The cartSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Cart.</returns>
        Task<PagedResult<Cart>> Search(CartSearchCriteria cartSearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// OverrideCartLinePrice method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cartLineId">The cartLineId.</param>
        /// <param name="price">The price.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> OverrideCartLinePrice(string id, string cartLineId, decimal price);
    
        /// <summary>
        /// GetCardPaymentAcceptPoint method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="cardPaymentAcceptSettings">The cardPaymentAcceptSettings.</param>
        /// <returns>CardPaymentAcceptPoint object.</returns>
        Task<CardPaymentAcceptPoint> GetCardPaymentAcceptPoint(string id, CardPaymentAcceptSettings cardPaymentAcceptSettings);
    
        /// <summary>
        /// RetrieveCardPaymentAcceptResult method.
        /// </summary>
        /// <param name="resultAccessCode">The resultAccessCode.</param>
        /// <returns>CardPaymentAcceptResult object.</returns>
        Task<CardPaymentAcceptResult> RetrieveCardPaymentAcceptResult(string resultAccessCode);
    
        /// <summary>
        /// RecallOrder method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="salesId">The salesId.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> RecallOrder(string transactionId, string salesId);
    
        /// <summary>
        /// RecallQuote method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="quoteId">The quoteId.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> RecallQuote(string transactionId, string quoteId);
    
        /// <summary>
        /// RecalculateOrder method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> RecalculateOrder(string id);
    
        /// <summary>
        /// GetPromotions method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>CartPromotions object.</returns>
        Task<CartPromotions> GetPromotions(string id);
    
        /// <summary>
        /// RecallSalesInvoice method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="invoiceId">The invoiceId.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> RecallSalesInvoice(string transactionId, string invoiceId);
    
        /// <summary>
        /// UpdateCommissionSalesGroup method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="cartLineId">The cartLineId.</param>
        /// <param name="commissionSalesGroup">The commissionSalesGroup.</param>
        /// <param name="isUserInitiated">The isUserInitiated.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> UpdateCommissionSalesGroup(string transactionId, string cartLineId, string commissionSalesGroup, bool isUserInitiated);
    
        /// <summary>
        /// AddDiscountCode method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="discountCode">The discountCode.</param>
        /// <returns>Cart object.</returns>
        Task<Cart> AddDiscountCode(string id, string discountCode);
    
    }
    
    /// <summary>
    /// Interface for Customer Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface ICustomerManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<Customer> Create(Customer entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="accountNumber">The accountNumber.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<Customer> Read(string accountNumber, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<Customer>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<Customer> Update(Customer entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(Customer entity);
        
        /// <summary>
        /// Search method.
        /// </summary>
        /// <param name="customerSearchCriteria">The customerSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of GlobalCustomer.</returns>
        Task<PagedResult<GlobalCustomer>> Search(CustomerSearchCriteria customerSearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetOrderHistory method.
        /// </summary>
        /// <param name="accountNumber">The accountNumber.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesOrder.</returns>
        Task<PagedResult<SalesOrder>> GetOrderHistory(string accountNumber, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetPurchaseHistory method.
        /// </summary>
        /// <param name="accountNumber">The accountNumber.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of PurchaseHistory.</returns>
        Task<PagedResult<PurchaseHistory>> GetPurchaseHistory(string accountNumber, QueryResultSettings queryResultSettings);
    
    }
    
    /// <summary>
    /// Interface for Employee Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IEmployeeManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<Employee> Create(Employee entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="staffId">The staffId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<Employee> Read(string staffId, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<Employee>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<Employee> Update(Employee entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(Employee entity);
        
        /// <summary>
        /// GetActivities method.
        /// </summary>
        /// <param name="employeeActivitySearchCriteria">The employeeActivitySearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of EmployeeActivity.</returns>
        Task<PagedResult<EmployeeActivity>> GetActivities(EmployeeActivitySearchCriteria employeeActivitySearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetManagerActivityView method.
        /// </summary>
        /// <param name="employeeActivitySearchCriteria">The employeeActivitySearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of EmployeeActivity.</returns>
        Task<PagedResult<EmployeeActivity>> GetManagerActivityView(EmployeeActivitySearchCriteria employeeActivitySearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// RegisterActivity method.
        /// </summary>
        /// <param name="staffId">The staffId.</param>
        /// <param name="employeeActivityType">The employeeActivityType.</param>
        /// <returns>DateTimeOffset object.</returns>
        Task<DateTimeOffset> RegisterActivity(string staffId, int employeeActivityType);
    
        /// <summary>
        /// GetAccessibleOrgUnits method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnit.</returns>
        Task<PagedResult<OrgUnit>> GetAccessibleOrgUnits(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetLatestActivity method.
        /// </summary>
        /// <returns>EmployeeActivity object.</returns>
        Task<EmployeeActivity> GetLatestActivity();
    
        /// <summary>
        /// GetCurrentEmployee method.
        /// </summary>
        /// <returns>Employee object.</returns>
        Task<Employee> GetCurrentEmployee();
    
    }
    
    /// <summary>
    /// Interface for SalesOrder Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface ISalesOrderManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<SalesOrder> Create(SalesOrder entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<SalesOrder> Read(string id, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<SalesOrder>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<SalesOrder> Update(SalesOrder entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(SalesOrder entity);
        
        /// <summary>
        /// SearchSalesTransactionsByReceiptId method.
        /// </summary>
        /// <param name="receiptId">The receiptId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesOrder.</returns>
        Task<PagedResult<SalesOrder>> SearchSalesTransactionsByReceiptId(string receiptId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// Search method.
        /// </summary>
        /// <param name="salesOrderSearchCriteria">The salesOrderSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesOrder.</returns>
        Task<PagedResult<SalesOrder>> Search(SalesOrderSearchCriteria salesOrderSearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// SearchOrders method.
        /// </summary>
        /// <param name="orderSearchCriteria">The orderSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesOrder.</returns>
        Task<PagedResult<SalesOrder>> SearchOrders(OrderSearchCriteria orderSearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetReceipts method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="receiptRetrievalCriteria">The receiptRetrievalCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Receipt.</returns>
        Task<PagedResult<Receipt>> GetReceipts(string id, ReceiptRetrievalCriteria receiptRetrievalCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetByReceiptId method.
        /// </summary>
        /// <param name="receiptId">The receiptId.</param>
        /// <param name="orderStoreNumber">The orderStoreNumber.</param>
        /// <param name="orderTerminalId">The orderTerminalId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesOrder.</returns>
        Task<PagedResult<SalesOrder>> GetByReceiptId(string receiptId, string orderStoreNumber, string orderTerminalId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetSalesOrderDetailsByTransactionId method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="searchLocationValue">The searchLocationValue.</param>
        /// <returns>SalesOrder object.</returns>
        Task<SalesOrder> GetSalesOrderDetailsByTransactionId(string transactionId, int searchLocationValue);
    
        /// <summary>
        /// GetSalesOrderDetailsBySalesId method.
        /// </summary>
        /// <param name="salesId">The salesId.</param>
        /// <returns>SalesOrder object.</returns>
        Task<SalesOrder> GetSalesOrderDetailsBySalesId(string salesId);
    
        /// <summary>
        /// GetSalesOrderDetailsByQuotationId method.
        /// </summary>
        /// <param name="quotationId">The quotationId.</param>
        /// <returns>SalesOrder object.</returns>
        Task<SalesOrder> GetSalesOrderDetailsByQuotationId(string quotationId);
    
        /// <summary>
        /// GetInvoicesBySalesId method.
        /// </summary>
        /// <param name="salesId">The salesId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SalesInvoice.</returns>
        Task<PagedResult<SalesInvoice>> GetInvoicesBySalesId(string salesId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// CreatePickingList method.
        /// </summary>
        /// <param name="salesId">The salesId.</param>
        Task CreatePickingList(string salesId);
    
        /// <summary>
        /// CreatePickingListForItems method.
        /// </summary>
        /// <param name="salesId">The salesId.</param>
        /// <param name="pickAndPackSalesLineParameters">The pickAndPackSalesLineParameters.</param>
        /// <returns>string object.</returns>
        Task<string> CreatePickingListForItems(string salesId, IEnumerable<PickAndPackSalesLineParameter> pickAndPackSalesLineParameters);
    
        /// <summary>
        /// GetPickingLists method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of PickingList.</returns>
        Task<PagedResult<PickingList>> GetPickingLists(string id, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// CreatePackingSlip method.
        /// </summary>
        /// <param name="salesId">The salesId.</param>
        Task CreatePackingSlip(string salesId);
    
    }
    
    /// <summary>
    /// Interface for Shift Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IShiftManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<Shift> Create(Shift entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<Shift> Read(long shiftId, string terminalId, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<Shift>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<Shift> Update(Shift entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(Shift entity);
        
        /// <summary>
        /// Open method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="cashDrawer">The cashDrawer.</param>
        /// <param name="isShared">The isShared.</param>
        /// <returns>Shift object.</returns>
        Task<Shift> Open(long? shiftId, string cashDrawer, bool isShared);
    
        /// <summary>
        /// Close method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="forceClose">The forceClose.</param>
        /// <returns>Shift object.</returns>
        Task<Shift> Close(long shiftId, string terminalId, string transactionId, bool forceClose);
    
        /// <summary>
        /// BlindClose method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="forceClose">The forceClose.</param>
        /// <returns>Shift object.</returns>
        Task<Shift> BlindClose(long shiftId, string terminalId, string transactionId, bool forceClose);
    
        /// <summary>
        /// Resume method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="cashDrawer">The cashDrawer.</param>
        /// <returns>Shift object.</returns>
        Task<Shift> Resume(long shiftId, string terminalId, string cashDrawer);
    
        /// <summary>
        /// Use method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <returns>Shift object.</returns>
        Task<Shift> Use(long shiftId, string terminalId);
    
        /// <summary>
        /// Suspend method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="transactionId">The transactionId.</param>
        /// <returns>Shift object.</returns>
        Task<Shift> Suspend(long shiftId, string terminalId, string transactionId);
    
        /// <summary>
        /// GetByStatus method.
        /// </summary>
        /// <param name="statusValue">The statusValue.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Shift.</returns>
        Task<PagedResult<Shift>> GetByStatus(int statusValue, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetXReport method.
        /// </summary>
        /// <param name="shiftId">The shiftId.</param>
        /// <param name="terminalId">The terminalId.</param>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="hardwareProfileId">The hardwareProfileId.</param>
        /// <returns>Receipt object.</returns>
        Task<Receipt> GetXReport(long shiftId, string terminalId, string transactionId, string hardwareProfileId);
    
        /// <summary>
        /// GetZReport method.
        /// </summary>
        /// <param name="transactionId">The transactionId.</param>
        /// <param name="hardwareProfileId">The hardwareProfileId.</param>
        /// <returns>Receipt object.</returns>
        Task<Receipt> GetZReport(string transactionId, string hardwareProfileId);
    
    }
    
    /// <summary>
    /// Interface for StockCountJournal Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IStockCountJournalManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<StockCountJournal> Create(StockCountJournal entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<StockCountJournal> Read(string journalId, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<StockCountJournal>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<StockCountJournal> Update(StockCountJournal entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(StockCountJournal entity);
        
        /// <summary>
        /// Sync method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of StockCountJournal.</returns>
        Task<PagedResult<StockCountJournal>> Sync(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// SyncTransactions method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of StockCountJournalTransaction.</returns>
        Task<PagedResult<StockCountJournalTransaction>> SyncTransactions(string journalId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// RemoveJournal method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        Task RemoveJournal(string journalId);
    
        /// <summary>
        /// RemoveTransaction method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        /// <param name="itemId">The itemId.</param>
        /// <param name="inventSizeId">The inventSizeId.</param>
        /// <param name="inventColorId">The inventColorId.</param>
        /// <param name="inventStyleId">The inventStyleId.</param>
        /// <param name="configurationId">The configurationId.</param>
        Task RemoveTransaction(string journalId, string itemId, string inventSizeId, string inventColorId, string inventStyleId, string configurationId);
    
        /// <summary>
        /// RemoveStockCountLineByLineId method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        /// <param name="stockCountLineId">The stockCountLineId.</param>
        Task RemoveStockCountLineByLineId(string journalId, long stockCountLineId);
    
        /// <summary>
        /// RemoveStockCountLineByProductRecId method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        /// <param name="productId">The productId.</param>
        Task RemoveStockCountLineByProductRecId(string journalId, long productId);
    
        /// <summary>
        /// Commit method.
        /// </summary>
        /// <param name="journalId">The journalId.</param>
        Task Commit(string journalId);
    
    }
    
    /// <summary>
    /// Interface for OrgUnit Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IOrgUnitManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<OrgUnit> Create(OrgUnit entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="orgUnitNumber">The orgUnitNumber.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<OrgUnit> Read(string orgUnitNumber, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<OrgUnit>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<OrgUnit> Update(OrgUnit entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(OrgUnit entity);
        
        /// <summary>
        /// GetTillLayout method.
        /// </summary>
        /// <returns>TillLayout object.</returns>
        Task<TillLayout> GetTillLayout();
    
        /// <summary>
        /// Search method.
        /// </summary>
        /// <param name="storeSearchCriteria">The storeSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnit.</returns>
        Task<PagedResult<OrgUnit>> Search(SearchStoreCriteria storeSearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetOrgUnitLocationsByArea method.
        /// </summary>
        /// <param name="searchArea">The searchArea.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnitLocation.</returns>
        Task<PagedResult<OrgUnitLocation>> GetOrgUnitLocationsByArea(SearchArea searchArea, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetOrgUnitConfiguration method.
        /// </summary>
        /// <returns>ChannelConfiguration object.</returns>
        Task<ChannelConfiguration> GetOrgUnitConfiguration();
    
        /// <summary>
        /// GetAvailableInventory method.
        /// </summary>
        /// <param name="itemId">The itemId.</param>
        /// <param name="variantId">The variantId.</param>
        /// <param name="barcode">The barcode.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnitAvailability.</returns>
        Task<PagedResult<OrgUnitAvailability>> GetAvailableInventory(string itemId, string variantId, string barcode, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetAvailableInventoryNearby method.
        /// </summary>
        /// <param name="itemIds">The itemIds.</param>
        /// <param name="searchArea">The searchArea.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnitAvailability.</returns>
        Task<PagedResult<OrgUnitAvailability>> GetAvailableInventoryNearby(IEnumerable<ItemUnit> itemIds, SearchArea searchArea, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetTerminalInfo method.
        /// </summary>
        /// <param name="orgUnitNumber">The orgUnitNumber.</param>
        /// <param name="deviceType">The deviceType.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of TerminalInfo.</returns>
        Task<PagedResult<TerminalInfo>> GetTerminalInfo(string orgUnitNumber, int deviceType, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetProductAvailability method.
        /// </summary>
        /// <param name="productId">The productId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of OrgUnitAvailability.</returns>
        Task<PagedResult<OrgUnitAvailability>> GetProductAvailability(long productId, QueryResultSettings queryResultSettings);
    
    }
    
    /// <summary>
    /// Interface for Product Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IProductManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<Product> Create(Product entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<Product> Read(long recordId, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<Product>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<Product> Update(Product entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(Product entity);
        
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
        Task<PagedResult<ProductDimensionValue>> GetDimensionValues(long recordId, long channelId, int dimension, IEnumerable<ProductDimension> matchingDimensionValues, ProductVariantResolutionOnKitSelectionContext kitVariantResolutionContext, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetVariantsByDimensionValues method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="matchingDimensionValues">The matchingDimensionValues.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SimpleProduct.</returns>
        Task<PagedResult<SimpleProduct>> GetVariantsByDimensionValues(long recordId, long channelId, IEnumerable<ProductDimension> matchingDimensionValues, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetVariantsByComponentsInSlots method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="matchingSlotToComponentRelationship">The matchingSlotToComponentRelationship.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SimpleProduct.</returns>
        Task<PagedResult<SimpleProduct>> GetVariantsByComponentsInSlots(long recordId, long channelId, IEnumerable<ComponentInSlotRelation> matchingSlotToComponentRelationship, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetByIds method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="productIds">The productIds.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of SimpleProduct.</returns>
        Task<PagedResult<SimpleProduct>> GetByIds(long channelId, IEnumerable<long> productIds, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// Compare method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="productIds">The productIds.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductComparisonLine.</returns>
        Task<PagedResult<ProductComparisonLine>> Compare(long channelId, long catalogId, IEnumerable<long> productIds, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetRecommendedProducts method.
        /// </summary>
        /// <param name="productIds">The productIds.</param>
        /// <param name="customerId">The customerId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        Task<PagedResult<ProductSearchResult>> GetRecommendedProducts(IEnumerable<long> productIds, string customerId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// RefineSearchByCategory method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="refinementCriteria">The refinementCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        Task<PagedResult<ProductSearchResult>> RefineSearchByCategory(long channelId, long catalogId, long categoryId, IEnumerable<ProductRefinerValue> refinementCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// RefineSearchByText method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="searchText">The searchText.</param>
        /// <param name="refinementCriteria">The refinementCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        Task<PagedResult<ProductSearchResult>> RefineSearchByText(long channelId, long catalogId, string searchText, IEnumerable<ProductRefinerValue> refinementCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// Search method.
        /// </summary>
        /// <param name="productSearchCriteria">The productSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Product.</returns>
        Task<PagedResult<Product>> Search(ProductSearchCriteria productSearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetRefiners method.
        /// </summary>
        /// <param name="productSearchCriteria">The productSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRefiner.</returns>
        Task<PagedResult<ProductRefiner>> GetRefiners(ProductSearchCriteria productSearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// Changes method.
        /// </summary>
        /// <param name="productSearchCriteria">The productSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Product.</returns>
        Task<PagedResult<Product>> Changes(ChangedProductsSearchCriteria productSearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// BeginReadChangedProducts method.
        /// </summary>
        /// <param name="changedProductSearchCriteria">The changedProductSearchCriteria.</param>
        /// <returns>ReadChangedProductsSession object.</returns>
        Task<ReadChangedProductsSession> BeginReadChangedProducts(ChangedProductsSearchCriteria changedProductSearchCriteria);
    
        /// <summary>
        /// ReadChangedProducts method.
        /// </summary>
        /// <param name="productSearchCriteria">The productSearchCriteria.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of Product.</returns>
        Task<PagedResult<Product>> ReadChangedProducts(ChangedProductsSearchCriteria productSearchCriteria, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetDeletedListings method.
        /// </summary>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ListingIdentity.</returns>
        Task<PagedResult<ListingIdentity>> GetDeletedListings(long catalogId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// EndReadChangedProducts method.
        /// </summary>
        /// <param name="session">The session.</param>
        Task EndReadChangedProducts(ReadChangedProductsSession session);
    
        /// <summary>
        /// UpdateListingPublishingStatus method.
        /// </summary>
        /// <param name="publishingStatuses">The publishingStatuses.</param>
        Task UpdateListingPublishingStatus(IEnumerable<ListingPublishStatus> publishingStatuses);
    
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
        Task<PagedResult<ProductPrice>> GetPrices(string itemId, string inventoryDimensionId, string barcode, string customerAccountNumber, string unitOfMeasureSymbol, decimal quantity, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetProductAvailabilities method.
        /// </summary>
        /// <param name="itemIds">The itemIds.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductAvailableQuantity.</returns>
        Task<PagedResult<ProductAvailableQuantity>> GetProductAvailabilities(IEnumerable<long> itemIds, long channelId, QueryResultSettings queryResultSettings);
    
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
        Task<PagedResult<ProductPrice>> GetActivePrices(ProjectionDomain projectDomain, IEnumerable<long> productIds, DateTimeOffset activeDate, string customerId, IEnumerable<AffiliationLoyaltyTier> affiliationLoyaltyTiers, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetFilteredSlotComponents method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="slotId">The slotId.</param>
        /// <param name="selectedComponents">The selectedComponents.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductComponent.</returns>
        Task<PagedResult<ProductComponent>> GetFilteredSlotComponents(long recordId, long channelId, long slotId, IEnumerable<ComponentInSlotRelation> selectedComponents, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetComponentByProductSlotRelation method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="componentRelation">The componentRelation.</param>
        /// <returns>ProductComponent object.</returns>
        Task<ProductComponent> GetComponentByProductSlotRelation(long channelId, ComponentInSlotRelation componentRelation);
    
        /// <summary>
        /// SearchByCategory method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        Task<PagedResult<ProductSearchResult>> SearchByCategory(long channelId, long catalogId, long categoryId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// SearchByText method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="searchText">The searchText.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        Task<PagedResult<ProductSearchResult>> SearchByText(long channelId, long catalogId, string searchText, QueryResultSettings queryResultSettings);
    
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
        Task<PagedResult<SearchSuggestion>> GetSearchSuggestions(long channelId, long catalogId, string searchText, string hitPrefix, string hitSuffix, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetRefinersByCategory method.
        /// </summary>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRefiner.</returns>
        Task<PagedResult<ProductRefiner>> GetRefinersByCategory(long catalogId, long categoryId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetRefinersByText method.
        /// </summary>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="searchText">The searchText.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRefiner.</returns>
        Task<PagedResult<ProductRefiner>> GetRefinersByText(long catalogId, string searchText, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetRefinerValuesByCategory method.
        /// </summary>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="categoryId">The categoryId.</param>
        /// <param name="refinerId">The refinerId.</param>
        /// <param name="refinerSourceValue">The refinerSourceValue.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRefinerValue.</returns>
        Task<PagedResult<ProductRefinerValue>> GetRefinerValuesByCategory(long catalogId, long categoryId, long refinerId, int refinerSourceValue, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetRefinerValuesByText method.
        /// </summary>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="searchText">The searchText.</param>
        /// <param name="refinerId">The refinerId.</param>
        /// <param name="refinerSourceValue">The refinerSourceValue.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRefinerValue.</returns>
        Task<PagedResult<ProductRefinerValue>> GetRefinerValuesByText(long catalogId, string searchText, long refinerId, int refinerSourceValue, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetChannelProductAttributes method.
        /// </summary>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of AttributeProduct.</returns>
        Task<PagedResult<AttributeProduct>> GetChannelProductAttributes(QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetById method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <returns>SimpleProduct object.</returns>
        Task<SimpleProduct> GetById(long recordId, long channelId);
    
        /// <summary>
        /// GetAttributeValues method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of AttributeValue.</returns>
        Task<PagedResult<AttributeValue>> GetAttributeValues(long recordId, long channelId, long catalogId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetMediaLocations method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of MediaLocation.</returns>
        Task<PagedResult<MediaLocation>> GetMediaLocations(long recordId, long channelId, long catalogId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetMediaBlobs method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of MediaBlob.</returns>
        Task<PagedResult<MediaBlob>> GetMediaBlobs(long recordId, long channelId, long catalogId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetDefaultComponents method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductComponent.</returns>
        Task<PagedResult<ProductComponent>> GetDefaultComponents(long recordId, long channelId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetSlotComponents method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="slotId">The slotId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductComponent.</returns>
        Task<PagedResult<ProductComponent>> GetSlotComponents(long recordId, long channelId, long slotId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetRelationTypes method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductRelationType.</returns>
        Task<PagedResult<ProductRelationType>> GetRelationTypes(long recordId, long channelId, long catalogId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetRelatedProducts method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="channelId">The channelId.</param>
        /// <param name="catalogId">The catalogId.</param>
        /// <param name="relationTypeId">The relationTypeId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductSearchResult.</returns>
        Task<PagedResult<ProductSearchResult>> GetRelatedProducts(long recordId, long channelId, long catalogId, long relationTypeId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetUnitsOfMeasure method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of UnitOfMeasure.</returns>
        Task<PagedResult<UnitOfMeasure>> GetUnitsOfMeasure(long recordId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// GetPrice method.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="customerAccountNumber">The customerAccountNumber.</param>
        /// <param name="unitOfMeasureSymbol">The unitOfMeasureSymbol.</param>
        /// <returns>ProductPrice object.</returns>
        Task<ProductPrice> GetPrice(long recordId, string customerAccountNumber, string unitOfMeasureSymbol);
    
    }
    
    /// <summary>
    /// Interface for ProductCatalog Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IProductCatalogManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<ProductCatalog> Create(ProductCatalog entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="recordId">The recordId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<ProductCatalog> Read(long recordId, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<ProductCatalog>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<ProductCatalog> Update(ProductCatalog entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(ProductCatalog entity);
        
        /// <summary>
        /// GetCatalogs method.
        /// </summary>
        /// <param name="channelId">The channelId.</param>
        /// <param name="activeOnly">The activeOnly.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of ProductCatalog.</returns>
        Task<PagedResult<ProductCatalog>> GetCatalogs(long channelId, bool activeOnly, QueryResultSettings queryResultSettings);
    
    }
    
    /// <summary>
    /// Interface for CommerceList Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface ICommerceListManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<CommerceList> Create(CommerceList entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<CommerceList> Read(long id, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<CommerceList>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<CommerceList> Update(CommerceList entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(CommerceList entity);
        
        /// <summary>
        /// GetByCustomer method.
        /// </summary>
        /// <param name="customerId">The customerId.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of CommerceList.</returns>
        Task<PagedResult<CommerceList>> GetByCustomer(string customerId, QueryResultSettings queryResultSettings);
    
        /// <summary>
        /// AddLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListLines">The commerceListLines.</param>
        /// <returns>CommerceList object.</returns>
        Task<CommerceList> AddLines(long id, IEnumerable<CommerceListLine> commerceListLines);
    
        /// <summary>
        /// UpdateLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListLines">The commerceListLines.</param>
        /// <returns>CommerceList object.</returns>
        Task<CommerceList> UpdateLines(long id, IEnumerable<CommerceListLine> commerceListLines);
    
        /// <summary>
        /// RemoveLines method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListLines">The commerceListLines.</param>
        /// <returns>CommerceList object.</returns>
        Task<CommerceList> RemoveLines(long id, IEnumerable<CommerceListLine> commerceListLines);
    
        /// <summary>
        /// MoveLines method.
        /// </summary>
        /// <param name="commerceListLines">The commerceListLines.</param>
        /// <param name="destinationId">The destinationId.</param>
        /// <returns>CommerceList object.</returns>
        Task<CommerceList> MoveLines(IEnumerable<CommerceListLine> commerceListLines, long destinationId);
    
        /// <summary>
        /// CopyLines method.
        /// </summary>
        /// <param name="commerceListLines">The commerceListLines.</param>
        /// <param name="destinationId">The destinationId.</param>
        /// <returns>CommerceList object.</returns>
        Task<CommerceList> CopyLines(IEnumerable<CommerceListLine> commerceListLines, long destinationId);
    
        /// <summary>
        /// AddContributors method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListContributors">The commerceListContributors.</param>
        /// <returns>CommerceList object.</returns>
        Task<CommerceList> AddContributors(long id, IEnumerable<CommerceListContributor> commerceListContributors);
    
        /// <summary>
        /// RemoveContributors method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListContributors">The commerceListContributors.</param>
        /// <returns>CommerceList object.</returns>
        Task<CommerceList> RemoveContributors(long id, IEnumerable<CommerceListContributor> commerceListContributors);
    
        /// <summary>
        /// CreateInvitations method.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="commerceListInvitations">The commerceListInvitations.</param>
        /// <returns>CommerceList object.</returns>
        Task<CommerceList> CreateInvitations(long id, IEnumerable<CommerceListInvitation> commerceListInvitations);
    
        /// <summary>
        /// AcceptInvitation method.
        /// </summary>
        /// <param name="invitationToken">The invitationToken.</param>
        /// <param name="customerId">The customerId.</param>
        Task AcceptInvitation(string invitationToken, string customerId);
    
    }
    
    /// <summary>
    /// Interface for TransferOrder Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface ITransferOrderManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<TransferOrder> Create(TransferOrder entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<TransferOrder> Read(string orderId, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<TransferOrder>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<TransferOrder> Update(TransferOrder entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(TransferOrder entity);
        
        /// <summary>
        /// Commit method.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        Task Commit(string orderId);
    
    }
    
    /// <summary>
    /// Interface for PurchaseOrder Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IPurchaseOrderManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<PurchaseOrder> Create(PurchaseOrder entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<PurchaseOrder> Read(string orderId, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<PurchaseOrder>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<PurchaseOrder> Update(PurchaseOrder entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(PurchaseOrder entity);
        
        /// <summary>
        /// Commit method.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        Task Commit(string orderId);
    
    }
    
    /// <summary>
    /// Interface for PickingList Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IPickingListManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<PickingList> Create(PickingList entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<PickingList> Read(string orderId, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<PickingList>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<PickingList> Update(PickingList entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(PickingList entity);
        
        /// <summary>
        /// Commit method.
        /// </summary>
        /// <param name="orderId">The orderId.</param>
        Task Commit(string orderId);
    
    }
    
    /// <summary>
    /// Interface for Warehouse Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IWarehouseManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<Warehouse> Create(Warehouse entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="inventLocation">The inventLocation.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<Warehouse> Read(string inventLocation, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<Warehouse>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<Warehouse> Update(Warehouse entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(Warehouse entity);
        
        /// <summary>
        /// GetWarehouseById method.
        /// </summary>
        /// <param name="inventLocation">The inventLocation.</param>
        /// <returns>Warehouse object.</returns>
        Task<Warehouse> GetWarehouseById(string inventLocation);
    
        /// <summary>
        /// GetLocations method.
        /// </summary>
        /// <param name="inventLocation">The inventLocation.</param>
        /// <param name="queryResultSettings">The queryResultSettings.</param>
        /// <returns>Collection of WarehouseLocation.</returns>
        Task<PagedResult<WarehouseLocation>> GetLocations(string inventLocation, QueryResultSettings queryResultSettings);
    
    }
    
    /// <summary>
    /// Interface for ScanResult Manager.
    /// </summary>
    [GeneratedCodeAttribute("Microsoft.Dynamics.Commerce.RetailProxy", "1.0")]
    public interface IScanResultManager : IEntityManager
    {
        /// <summary>
        /// Creates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity after creation.</returns>
        Task<ScanResult> Create(ScanResult entity);

        /// <summary>
        /// Reads the entity with specified identifier.
        /// </summary>
        /// <param name="scannedText">The scannedText.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The entity.</returns>
        Task<ScanResult> Read(string scannedText, ICollection<string> expandProperties = null);
      
        /// <summary>
        /// Read all entities with specified query settings.
        /// </summary>
        /// <param name="queryResultSettings">The query result settings.</param>
        /// <param name="expandProperties">The navigation properties to be expanded.</param>
        /// <returns>The collection of entities.</returns>
        Task<PagedResult<ScanResult>> ReadAll(QueryResultSettings queryResultSettings, ICollection<string> expandProperties = null);

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity.</returns>
        Task<ScanResult> Update(ScanResult entity);

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns>Nothing.</returns>
        Task Delete(ScanResult entity);
        
    }
    
 }
