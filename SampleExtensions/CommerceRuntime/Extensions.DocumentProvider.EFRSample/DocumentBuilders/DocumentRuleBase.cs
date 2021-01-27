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
    namespace Commerce.Runtime.DocumentProvider.EFRSample.DocumentBuilders
    {
        using System;
        using System.Collections.Generic;
        using System.Collections.ObjectModel;
        using System.Linq;
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentHelpers;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.Extensions;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;

        /// <summary>
        /// The base document rule.
        /// </summary>
        public abstract class DocumentRuleBase : IDocumentRule
        {
            /// <summary>
            /// The request.
            /// </summary>
            protected GetFiscalDocumentDocumentProviderRequest request;

            /// <summary>
            /// The sales order.
            /// </summary>
            protected SalesOrder salesOrder;

            /// <summary>
            /// Initializes a new instance of the <see cref="DocumentRuleBase" /> class.
            /// </summary>
            /// <param name="request">Retail transaction to register.</param>
            /// <param name="salesOrder">Type of registration sequence.</param>
            public DocumentRuleBase(GetFiscalDocumentDocumentProviderRequest request, SalesOrder salesOrder)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(salesOrder, nameof(salesOrder));

                this.request = request;
                this.salesOrder = salesOrder;
            }

            /// <summary>
            /// Adds country/region specific receipt positions to the collection of receipt positions.
            /// </summary>
            /// <param name="positions">The collection of receipt positions.</param>
            public virtual void AddCountryRegionSpecificPositions(List<ReceiptPosition> positions)
            {
            }

            /// <summary>
            /// Adds receipt positions for customer account deposit.
            /// </summary>
            public virtual void AddCustomerAccountDepositPositions(List<ReceiptPosition> positions)
            {
            }

            /// <summary>
            /// Checks if the document generation required.
            /// </summary>
            /// <returns>True if document generation required; False otherwise.</returns>
            public abstract bool IsDocumentGenerationRequired();

            /// <summary>
            /// Creates receipt taxes for customer account deposit transaction.
            /// </summary>
            /// <returns>The receipt taxes collection.</returns>
            public virtual List<ReceiptTax> CreateCustomerAccountDepositReceiptTaxes()
            {
                return new List<ReceiptTax>();
            }

            /// <summary>
            /// Creates receipt taxes for sales transaction.
            /// </summary>
            /// <returns>The receipt taxes collection.</returns>
            public abstract List<ReceiptTax> CreateSalesTransactionReceiptTaxes();

            /// <summary>
            /// Adds localization information to receipt.
            /// </summary>
            /// <param name="receipt">The receipt.</param>
            public virtual void AddLocalizationInfoToReceipt(DataModelEFR.Documents.Receipt receipt)
            {
            }

            /// <summary>
            /// Adds localization information to receipt payment.
            /// </summary>
            /// <param name="payment">The receipt payment.</param>
            public virtual void AddLocalizationInfoToPayment(DataModelEFR.Documents.ReceiptPayment payment)
            {
            }

            /// <summary>
            /// Gets the customer account deposit transaction type string.
            /// </summary>
            /// <returns>Returns an empty string.</returns>
            public virtual string GetCustomerAccountDepositTransactionType()
            {
                return string.Empty;
            }

            /// <summary>
            /// Get the receipt payment for deposit payment.
            /// </summary>
            /// <returns>The receipt payment for deposit payment.</returns>
            public abstract ReceiptPayment GetDepositTenderLine();

            /// <summary>
            /// Gets the non-fiscal transaction type string.
            /// </summary>
            /// <returns>The non-fiscal transaction type string.</returns>
            public virtual string GetNonFiscalTransactionType()
            {
                return string.Empty;
            }

            /// <summary>
            /// Gets the sales line for document creation.
            /// </summary>
            /// <returns>The sales lines collection.</returns>
            public abstract IEnumerable<SalesLine> GetSalesLines();

            /// <summary>
            /// Gets the tax groups for sales line.
            /// </summary>
            /// <param name="salesLine">The sales line.</param>
            /// <returns>The tax groups string.</returns>
            public abstract string GetSalesLineTaxGroups(SalesLine salesLine);

            /// <summary>
            /// Checks if the positions can be created.
            /// </summary>
            /// <returns>True if positions can be created; False otherwise.</returns>
            public virtual bool CanСreatePositions()
            {
                return true;
            }


            /// <summary>
            /// Sets the referenced receipt position's fields.
            /// </summary>
            /// <param name="receiptPosition">The receipt position.</param>
            /// <param name="salesLine">The sales line.</param>
            public virtual async Task SetReferenceFieldsAsync(ReceiptPosition receiptPosition, SalesLine salesLine)
            {
                var originSalesOrderResponse = await salesLine.GetOriginSalesOrderAsync(request.RequestContext).ConfigureAwait(false);

                receiptPosition.ReferenceDateTime = originSalesOrderResponse?.CreatedDateTime.DateTime ?? DateTime.MinValue;
                receiptPosition.ReferenceTransactionLocation = salesLine.ReturnStore;
                receiptPosition.ReferenceTransactionTerminal = salesLine.ReturnTerminalId;
                receiptPosition.ReferenceTransactionNumber = salesLine.ReturnTransactionId;
                receiptPosition.ReferencePositionNumber = SalesTransactionHelper.ConvertLineNumberToPositionNumber(salesLine.ReturnLineNumber);
            }

            /// <summary>
            /// Creates receipt payments.
            /// </summary>
            /// <returns>The receipt payments.</returns>
            public abstract Task<List<ReceiptPayment>> CreateReceiptPaymentsAsync();

            /// <summary>
            /// Creates receipt payments without currency information.
            /// </summary>
            /// <returns>The receipt payments.</returns>
            public virtual async Task<List<ReceiptPayment>> CreateReceiptPaymentsWithoutCurrencyAsync()
            {
                List<ReceiptPayment> receiptPayments = new List<ReceiptPayment>();

                var tenderLinesGrpByTenderTypeId = salesOrder.TenderLinesGrpByTenderTypeId();

                var getChannelTenderTypesDataRequest = new GetChannelTenderTypesDataRequest(request.RequestContext.GetPrincipal().ChannelId, QueryResultSettings.AllRecords);
                ReadOnlyCollection<TenderType> channelTenderTypes = request.RequestContext.Runtime.Execute<EntityDataServiceResponse<TenderType>>(getChannelTenderTypesDataRequest, request.RequestContext).PagedEntityCollection.Results;
                var payCustomerAccountTypes = channelTenderTypes.Where(c => c.OperationType == RetailOperation.PayCustomerAccount);

                foreach (var tenderLine in tenderLinesGrpByTenderTypeId)
                {
                    var payment = new ReceiptPayment
                    {
                        Description = await SalesTransactionHelper.GetTenderTypeNameAsync(request.RequestContext, tenderLine.Key).ConfigureAwait(false),
                        Amount = tenderLine.Sum(l => l.Amount),
                        UniqueIdentifier = string.Empty,
                        PaymentTypeGroup = string.Empty
                    };

                    if (tenderLine.Any(c => !string.IsNullOrWhiteSpace(c.GiftCardId)) || payCustomerAccountTypes.Any(c => c.TenderTypeId == tenderLine.Key))
                    {
                        AddLocalizationInfoToPayment(payment);
                    }
                    receiptPayments.Add(payment);
                }

                if (salesOrder.PrepaymentAmountAppliedOnPickup != 0)
                {
                    receiptPayments.Add(GetDepositTenderLine());
                }

                return receiptPayments;
            }

            /// <summary>
            /// Creates receipt payments with currency information.
            /// </summary>
            /// <returns>The receipt payments.</returns>
            public virtual async Task<List<ReceiptPayment>> CreateReceiptPaymentsWithCurrencyAsync()
            {
                List<ReceiptPayment> receiptPayments = new List<ReceiptPayment>();
                var tenderLines = salesOrder.ActiveTenderLines;

                var getChannelTenderTypesDataRequest = new GetChannelTenderTypesDataRequest(request.RequestContext.GetPrincipal().ChannelId, QueryResultSettings.AllRecords);
                var channelTenderTypes = request.RequestContext.Runtime.Execute<EntityDataServiceResponse<TenderType>>(getChannelTenderTypesDataRequest, request.RequestContext).PagedEntityCollection;
                var giftCardTenderTypeId = channelTenderTypes.Single(c => c.OperationType == RetailOperation.PayGiftCertificate).TenderTypeId;
                var payCustomerAccountTenderTypeId = channelTenderTypes.Single(c => c.OperationType == RetailOperation.PayCustomerAccount).TenderTypeId;

                foreach (var line in tenderLines)
                {
                    var payment = new ReceiptPayment
                    {
                        Description = await SalesTransactionHelper.GetTenderTypeNameAsync(request.RequestContext, line.TenderTypeId).ConfigureAwait(false),
                        Amount = line.Amount,
                        UniqueIdentifier = line.CreditMemoId,
                        PaymentTypeGroup = ConfigurationController.GetTenderTypeMapping(request.FiscalIntegrationFunctionalityProfile)[line.TenderTypeId]
                    };

                    if (salesOrder.CurrencyCode != line.Currency)
                    {
                        payment.ForeignCurrencyCode = line.Currency;
                        payment.ForeignAmount = line.AmountInTenderedCurrency;
                    }

                    if (line.TenderTypeId == giftCardTenderTypeId)
                    {
                        payment.UniqueIdentifier = line.GiftCardId;
                    }
                    receiptPayments.Add(payment);
                }

                return receiptPayments;
            }

            /// <summary>
            /// Creates receipt customer data.
            /// </summary>
            /// <param name="receipt">The receipt.</param>
            public virtual void AddCustomerDataToReceipt(DataModelEFR.Documents.Receipt receipt){ }

            /// <summary>
            /// Adds localization information to customer account deposit receipt payment.
            /// </summary>
            /// <param name="payment">The receipt payment.</param>
            /// <param name="tenderTypeId">The payment tender type id.</param>
            public virtual void AddLocalizationInfoToCustomerPayment(ReceiptPayment payment, string tenderTypeId)
            {
            }

            /// <summary>
            /// Calculates total payment amount.
            /// </summary>
            /// <returns>The total payment amount.</returns>
            public abstract decimal GetTotalAmount();
        }

    }
}
