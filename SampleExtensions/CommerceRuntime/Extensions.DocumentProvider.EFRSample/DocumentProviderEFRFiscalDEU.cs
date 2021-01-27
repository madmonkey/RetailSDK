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
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentBuilders;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentBuilders.GermanyBuilders;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentHelpers;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.Serializers;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Handlers;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// The document provider for EFSTA (European Fiscal Standards Association) Fiscal Register (version 1.8.3) specific for Germany.
        /// </summary>
        public class DocumentProviderEFRFiscalDEU : INamedRequestHandlerAsync
        {
            private const string ServiceName = "EFR";
            private const string StartDateTimeElementName = "StartD";
            private const string FinishDateTimeElementName = "FinishD";
            private const string SecurityCodeElementName = "Serial";
            private const string SequenceNumberElementName = "SignCnt";
            private const string SignatureElementName = "Sign";
            private const string InfoElementName = "Info";

            /// <summary>
            /// Gets the unique name for this request handler.
            /// </summary>
            public string HandlerName => "FiscalEFRSampleDEU";

            /// <summary>
            /// Gets the supported fiscal integration event type.
            /// </summary>
            public IEnumerable<int> SupportedRegistrableFiscalEventsId => new[]
            {
                (int)FiscalIntegrationEventType.BeginSale,
                (int)FiscalIntegrationEventType.Sale,
                (int)FiscalIntegrationEventType.CustomerAccountDeposit,
                (int)FiscalIntegrationEventType.CreateCustomerOrder,
                (int)FiscalIntegrationEventType.EditCustomerOrder,
                (int)FiscalIntegrationEventType.CancelCustomerOrder,
                (int)FiscalIntegrationEventType.VoidTransaction,
                (int)FiscalIntegrationEventType.SuspendTransaction,
                (int)FiscalIntegrationEventType.FloatEntry,
                (int)FiscalIntegrationEventType.SafeDrop,
                (int)FiscalIntegrationEventType.BankDrop,
                (int)FiscalIntegrationEventType.RemoveTender,
                (int)FiscalIntegrationEventType.StartingAmount,
                (int)FiscalIntegrationEventType.IncomeAccounts,
                (int)FiscalIntegrationEventType.ExpenseAccounts,
                (int)FiscalIntegrationEventType.CloseShift,
                (int)FiscalIntegrationEventType.RecallTransaction
            };

            /// <summary>
            /// Gets the supported non-fiscal integration event type.
            /// </summary>
            public IEnumerable<int> SupportedRegistrableNonFiscalEventsId => Enumerable.Empty<int>();

            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes => new[]
            {
                typeof(GetFiscalDocumentDocumentProviderRequest),
                typeof(GetSupportedRegistrableEventsDocumentProviderRequest),
                typeof(GetFiscalRegisterResponseToSaveDocumentProviderRequest),
                typeof(GetFiscalTransactionExtendedDataDocumentProviderRequest)
            };

            /// <summary>
            /// Executes the specified request using the specified request context and handler.
            /// </summary>
            /// <param name="request">The request to execute.</param>
            /// <returns>The response of the request from the request handler.</returns>
            public Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, nameof(request));

                switch (request)
                {
                    case GetSupportedRegistrableEventsDocumentProviderRequest getSupportedRegistrableEventsDocumentProviderRequest:
                        return GetSupportedRegistrableEventsAsync();

                    case GetFiscalDocumentDocumentProviderRequest getFiscalDocumentDocumentProviderRequest:
                        return GetFiscalDocumentResponseAsync(getFiscalDocumentDocumentProviderRequest);

                    case GetFiscalTransactionExtendedDataDocumentProviderRequest getFiscalTransactionExtendedDataDocumentProviderRequest:
                        return Task.FromResult<Response>(GetFiscalTransactionExtendedData(getFiscalTransactionExtendedDataDocumentProviderRequest));

                    case GetFiscalRegisterResponseToSaveDocumentProviderRequest getFiscalRegisterResponseToSaveDocumentProviderRequest:
                        return GetFiscalRegisterResponseToSaveAsync(getFiscalRegisterResponseToSaveDocumentProviderRequest);

                    default:
                        throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
                }
            }

            /// <summary>
            /// Gets the supported registerable events document provider response.
            /// </summary>
            /// <returns>The supported registerable events document provider response.</returns>
            private Task<Response> GetSupportedRegistrableEventsAsync()
            {
                var response = new GetSupportedRegistrableEventsDocumentProviderResponse(this.SupportedRegistrableFiscalEventsId.ToList(), this.SupportedRegistrableNonFiscalEventsId.ToList());
                return Task.FromResult<Response>(response);
            }

            /// <summary>
            /// Gets the fiscal registration result.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The response.</returns>
            public Task<Response> GetFiscalRegisterResponseToSaveAsync(GetFiscalRegisterResponseToSaveDocumentProviderRequest request)
            {
                var response = new GetFiscalRegisterResponseToSaveDocumentProviderResponse(request.FiscalRegistrationResult.Response);
                return Task.FromResult<Response>(response);
            }

            /// <summary>
            /// Gets the GetFiscalTransactionExtendedDataDocumentProviderResponse.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The GetFiscalTransactionExtendedDataDocumentProviderResponse.</returns>
            private GetFiscalTransactionExtendedDataDocumentProviderResponse GetFiscalTransactionExtendedData(GetFiscalTransactionExtendedDataDocumentProviderRequest request)
            {
                var extendedData = new List<CommerceProperty>();
                string documentNumber = string.Empty;

                if (XmlSerializer<SalesTransactionRegistrationResponse>.TryDeserialize(request.FiscalRegistrationResult?.Response, out var salesTransactionResponse))
                {
                    Func<string, string> GetFiscalTagFieldValue = (string elementName) => salesTransactionResponse.FiscalData?.FiscalTags.SingleOrDefault(ft => ft.FieldName == elementName)?.FieldValue;

                    CommerceProperty[] commerceProperties = new[]
                    {
                        new CommerceProperty(ExtensibleFiscalRegistrationExtendedDataType.QRCode.Name, salesTransactionResponse.FiscalData?.FiscalQRCode),
                        new CommerceProperty(ExtensibleFiscalRegistrationExtendedDataType.ServiceTransactionId.Name, salesTransactionResponse.FiscalData?.TransactionId),
                        new CommerceProperty(ExtensibleFiscalRegistrationExtendedDataType.ServiceSecurityCode.Name, GetFiscalTagFieldValue(SecurityCodeElementName)),
                        new CommerceProperty(ExtensibleFiscalRegistrationExtendedDataType.TransactionStart.Name, GetFiscalTagFieldValue(StartDateTimeElementName)),
                        new CommerceProperty(ExtensibleFiscalRegistrationExtendedDataType.TransactionEnd.Name, GetFiscalTagFieldValue(FinishDateTimeElementName)),
                        new CommerceProperty(ExtensibleFiscalRegistrationExtendedDataType.SequenceNumber.Name, GetFiscalTagFieldValue(SequenceNumberElementName)),
                        new CommerceProperty(ExtensibleFiscalRegistrationExtendedDataType.Signature.Name, GetFiscalTagFieldValue(SignatureElementName)),
                        new CommerceProperty(ExtensibleFiscalRegistrationExtendedDataType.Info.Name, GetFiscalTagFieldValue(InfoElementName))
                    };
                    extendedData.AddRange(commerceProperties);
                    documentNumber = salesTransactionResponse.FiscalData?.TransactionId;
                } else if (XmlSerializer<BeginSaleRegistrationResponse>.TryDeserialize(request.FiscalRegistrationResult?.Response, out var beginSaleRegistrationResponse))
                {
                    documentNumber = beginSaleRegistrationResponse.FiscalData?.TransactionId;
                    extendedData.Add(new CommerceProperty(ExtensibleFiscalRegistrationExtendedDataType.TransactionStart.Name, beginSaleRegistrationResponse.FiscalData?.StartDateTime));
                }

                var noneRegistrationTypes = new[] { FiscalIntegrationEventType.BeginSale, FiscalIntegrationEventType.RecallTransaction };
                var registrationType = noneRegistrationTypes.Contains(request.FiscalRegistrationResult.FiscalRegistrationEventType)
                    ? ExtensibleFiscalRegistrationType.None
                    : ExtensibleFiscalRegistrationType.CashSale;

                return new GetFiscalTransactionExtendedDataDocumentProviderResponse(
                    documentNumber ?? string.Empty,
                    registrationType,
                    ServiceName,
                    request.RequestContext.GetPrincipal().CountryRegionIsoCode,
                    extendedData);
            }

            /// <summary>
            /// Gets the fiscal document document provider response.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The fiscal document document provider response.</returns>
            private async Task<Response> GetFiscalDocumentResponseAsync(GetFiscalDocumentDocumentProviderRequest request)
            {
                FiscalIntegrationEventType eventType = request.FiscalDocumentRetrievalCriteria.FiscalRegistrationEventType;
                IDocumentBuilder builder = null;
                IFiscalIntegrationDocument document = null;

                switch (eventType)
                {
                    case FiscalIntegrationEventType.CreateCustomerOrder:
                    case FiscalIntegrationEventType.EditCustomerOrder:
                    case FiscalIntegrationEventType.CancelCustomerOrder:
                    case FiscalIntegrationEventType.Sale:
                        if (DocumentProviderHelper.IsSalesOrderFiscalizationRequired(request.SalesOrder))
                        {
                            builder = new SalesTransactionBuilder(request, request.SalesOrder);
                        }

                        break;
                    case FiscalIntegrationEventType.CustomerAccountDeposit:
                        builder = new CustomerAccountDepositTransactionBuilder(request, request.SalesOrder);
                        break;

                    case FiscalIntegrationEventType.BeginSale:
                        builder = new BeginSaleBuilder(request, request.FiscalDocumentRetrievalCriteria.TransactionId);
                        break;

                    case FiscalIntegrationEventType.CloseShift:
                        builder = new DocumentBuilders.GermanyBuilders.ZReportBuilder(request);
                        break;

                    case FiscalIntegrationEventType.FloatEntry:
                    case FiscalIntegrationEventType.RemoveTender:
                    case FiscalIntegrationEventType.StartingAmount:
                        builder = new NonSalesTransactionBuilder(request, request.FiscalDocumentRetrievalCriteria.TransactionId);
                        break;

                    case FiscalIntegrationEventType.BankDrop:
                    case FiscalIntegrationEventType.SafeDrop:
                        builder = new BankSafeDropBuilder(request, request.FiscalDocumentRetrievalCriteria.TransactionId);
                        break;

                    case FiscalIntegrationEventType.IncomeAccounts:
                        builder = new IncomeAccountsBuilder(request, request.FiscalDocumentRetrievalCriteria.TransactionId);
                        break;

                    case FiscalIntegrationEventType.ExpenseAccounts:
                        builder = new ExpenseAccountsBuilder(request, request.FiscalDocumentRetrievalCriteria.TransactionId);
                        break;

                    case FiscalIntegrationEventType.VoidTransaction:
                    case FiscalIntegrationEventType.SuspendTransaction:
                        builder = await GetVoidTransactionDocumentBuilderAsync(request).ConfigureAwait(false);
                        break;

                    case FiscalIntegrationEventType.RecallTransaction:
                        builder = await GetFiscalDocumentBuilderForRecallEventAsync(request).ConfigureAwait(false);
                        break;

                    default:
                        throw new NotSupportedException(string.Format("Fiscal integration event type '{0}' is not supported.", eventType));
                }

                if (builder != null)
                {
                    document = await builder.BuildAsync().ConfigureAwait(false);
                }

                FiscalIntegrationDocument fiscalIntegrationDocument = document != null ?
                    new FiscalIntegrationDocument(FiscalDocumentSerializer.Serialize(document), FiscalIntegrationDocumentGenerationResultType.Succeeded) :
                    new FiscalIntegrationDocument(string.Empty, FiscalIntegrationDocumentGenerationResultType.NotRequired);
                
                return new GetFiscalDocumentDocumentProviderResponse(fiscalIntegrationDocument);
            }

            /// <summary>
            /// Gets the fiscal integration document builder for void or suspend event types.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The fiscal integration receipt document builder.</returns>
            private async Task<IDocumentBuilder> GetVoidTransactionDocumentBuilderAsync(GetFiscalDocumentDocumentProviderRequest request)
            {
                var salesOrder = await GetSalesOrderAsync(request.RequestContext, request.FiscalDocumentRetrievalCriteria.IsRemoteTransaction, request.FiscalDocumentRetrievalCriteria.TransactionId).ConfigureAwait(false);

                bool shouldSkipRegister = salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.IncomeExpense ||
                    salesOrder.CustomerOrderType == CustomerOrderType.Quote;

                if (shouldSkipRegister)
                {
                    return null;
                }

                return new VoidTransactionBuilder(request, salesOrder);
            }

            /// <summary>
            /// Gets the fiscal integration document builder for recall event type.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The fiscal integration receipt document builder.</returns>
            private async Task<IDocumentBuilder> GetFiscalDocumentBuilderForRecallEventAsync(GetFiscalDocumentDocumentProviderRequest request)
            {
                var cartSearchCriteria = new CartSearchCriteria(request.FiscalDocumentRetrievalCriteria.TransactionId);
                var getCartServiceRequest = new GetCartServiceRequest(cartSearchCriteria, QueryResultSettings.SingleRecord);
                var cart = (await request.RequestContext.ExecuteAsync<GetCartServiceResponse>(getCartServiceRequest).ConfigureAwait(false)).Carts.Single();

                bool shouldSkipRegister = cart.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.IncomeExpense ||
                    cart.CustomerOrderMode == CustomerOrderMode.QuoteCreateOrEdit;

                if (shouldSkipRegister)
                {
                    return null;
                }

                return new BeginSaleBuilder(request, cart);
            }

            /// <summary>
            /// Gets the sales order.
            /// </summary>
            /// <param name="requestContext">The request context.</param>
            /// <param name="isRemoteTransaction">Gets or sets a value indicating whether the fiscal document is for Remote transaction or not.</param>
            /// <param name="transactionId">The transaction identifier.</param>
            /// <returns>The sales order.></returns>
            private async Task<SalesOrder> GetSalesOrderAsync(RequestContext requestContext, bool isRemoteTransaction, string transactionId)
            {
                SearchLocation searchLocationType = isRemoteTransaction ? SearchLocation.All : SearchLocation.Local;
                var getSalesOrderRequest = new GetSalesOrderDetailsByTransactionIdServiceRequest(transactionId, searchLocationType);

                return (await requestContext.ExecuteAsync<GetSalesOrderDetailsServiceResponse>(getSalesOrderRequest).ConfigureAwait(false)).SalesOrder;
            }
        }
    }
}
