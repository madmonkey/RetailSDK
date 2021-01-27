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
        using System.Linq;
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.DocumentHelpers;
        using Contoso.Commerce.Runtime.DocumentProvider.EFRSample.Extensions;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;

        /// <summary>
        /// Builds a sales transaction registration request document.
        /// </summary>
        public class SalesTransactionBuilder : IDocumentBuilder
        {
            /// <summary>
            /// The request.
            /// </summary>
            private GetFiscalDocumentDocumentProviderRequest request;

            /// <summary>
            /// The sales order.
            /// </summary>
            private SalesOrder salesOrder;

            /// <summary>
            /// The transaction builder document rule.
            /// </summary>
            private IDocumentRule documentRule;

            /// <summary>
            /// Initializes a new instance of the <see cref="SalesTransactionBuilder"/> class.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="salesOrder">The sales order.</param>
            public SalesTransactionBuilder(GetFiscalDocumentDocumentProviderRequest request, SalesOrder salesOrder)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(salesOrder, nameof(salesOrder));

                this.request = request;
                this.salesOrder = salesOrder;
                this.documentRule = LocalizedDocumentBuilderFabric.GetLocalizedDocumentRule(request, salesOrder);
            }

            /// <summary>
            /// Builds fiscal integration document.
            /// </summary>
            /// <returns>The sales transaction receipt document.</returns>
            public async Task<IFiscalIntegrationDocument> BuildAsync()
            {
                if (!documentRule.IsDocumentGenerationRequired())
                {
                    return null;
                }
                var receipt = await this.CreateReceiptAsync().ConfigureAwait(false);
                receipt.Header = this.CreateReceiptHeader();
                receipt.PositionLines = await this.CreateReceiptPositionLines().ConfigureAwait(false);
                receipt.Payments = await documentRule.CreateReceiptPaymentsAsync().ConfigureAwait(false);
                receipt.Taxes = this.CreateReceiptTaxes();
                receipt.Footer = this.CreateReceiptFooter();
                return new SalesTransactionRegistrationRequest
                {
                    Receipt = receipt
                };
            }

            /// <summary>
            /// Creates receipt.
            /// </summary>
            /// <returns>The receipt.</returns>
            private async Task<DataModelEFR.Documents.Receipt> CreateReceiptAsync()
            {
                DataModelEFR.Documents.Receipt receipt = new DataModelEFR.Documents.Receipt
                {
                    CountryRegionISOCode = request.RequestContext.GetChannelConfiguration().CountryRegionISOCode,
                    TransactionLocation = salesOrder.StoreId,
                    TransactionTerminal = salesOrder.TerminalId,
                    TotalAmount = documentRule.GetTotalAmount(),
                    OperatorId = salesOrder.StaffId,
                    OperatorName = await SalesTransactionHelper.GetOperatorNameAsync(request.RequestContext, salesOrder.StaffId).ConfigureAwait(false),
                    NonFiscalTransactionType = documentRule.GetNonFiscalTransactionType(),
                    IsTrainingTransaction = 0
                };
                documentRule.AddLocalizationInfoToReceipt(receipt);
                documentRule.AddCustomerDataToReceipt(receipt);

                return receipt;
            }

            /// <summary>
            /// Creates receipt header.
            /// </summary>
            /// <returns>The receipt header.</returns>
            private ReceiptHeader CreateReceiptHeader()
            {
                if (string.IsNullOrWhiteSpace(salesOrder.CustomerId))
                {
                    return null;
                }

                return new ReceiptHeader
                {
                    Txt = salesOrder.CustomerId
                };
            }

            /// <summary>
            /// Creates receipt position lines.
            /// </summary>
            /// <returns>The receipt position lines.</returns>
            private async Task<ReceiptPositionLines> CreateReceiptPositionLines()
            {
                if (!documentRule.CanСreatePositions())
                {
                    return null;
                }
                // get sales lines here && pass to methods
                IEnumerable<SalesLine> salesLines = documentRule.GetSalesLines();

                ReceiptPositionLines receiptPositionLines = new ReceiptPositionLines
                {
                    ReceiptPositions = await this.CreateReceiptPositionsAsync(salesLines).ConfigureAwait(false),
                    ReceiptPositionModifiers = this.CreateReceiptPositionModifiers(salesLines)
                };

                return receiptPositionLines;
            }

            /// <summary>
            /// Creates receipt positions.
            /// </summary>
            /// <returns>The receipt positions.</returns>
            private async Task<List<ReceiptPosition>> CreateReceiptPositionsAsync(IEnumerable<SalesLine> salesLines)
            {
                List<ReceiptPosition> receiptPositions = new List<ReceiptPosition>();
                IEnumerable<string> itemIds = salesLines.Select(l => l.ItemId);

                var itemsDictionary = itemIds.Any()
                    ? SalesTransactionHelper.GetProducts(request.RequestContext, itemIds)
                    : new Dictionary<string, Item>();

                foreach (SalesLine salesLine in salesLines)
                {
                    itemsDictionary.TryGetValue(salesLine.ItemId, out var item);

                    ReceiptPosition receiptPosition = new ReceiptPosition
                    {
                        PositionNumber = SalesTransactionHelper.ConvertLineNumberToPositionNumber(salesLine.LineNumber),
                        ItemNumber = salesLine.ItemId,
                        ItemIdentity = salesLine.ItemIdentity(),
                        Description = item?.Description,
                        TaxGroup = documentRule.GetSalesLineTaxGroups(salesLine),
                        Amount = salesLine.GrossAmount,
                        Quantity = salesLine.Quantity,
                        QuantityUnit = salesLine.UnitOfMeasureSymbol,
                        UnitPrice = salesLine.Price
                    };
                    await this.SetReferenceFieldsAsync(receiptPosition, salesLine).ConfigureAwait(false);
                    receiptPositions.Add(receiptPosition);
                }
                documentRule.AddCountryRegionSpecificPositions(receiptPositions);

                return receiptPositions;
            }

            /// <summary>
            /// Sets reference fields.
            /// </summary>
            /// <param name="receiptPosition">The receipt position.</param>
            /// <param name="salesLine">The sales line.</param>
            private async Task SetReferenceFieldsAsync(ReceiptPosition receiptPosition, SalesLine salesLine)
            {
                receiptPosition.ReferenceDateTime = DateTime.MinValue;
                receiptPosition.ReferenceTransactionLocation = string.Empty;
                receiptPosition.ReferenceTransactionTerminal = string.Empty;
                receiptPosition.ReferenceTransactionNumber = string.Empty;
                receiptPosition.ReferencePositionNumber = 0;

                if (!salesLine.IsReturnLine())
                {
                    return;
                }

                if (salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.Sales)
                {
                    await documentRule.SetReferenceFieldsAsync(receiptPosition, salesLine).ConfigureAwait(false);
                }
            }

            /// <summary>
            /// Creates receipt position modifiers.
            /// </summary>
            /// <returns>The receipt position modifiers.</returns>
            private List<ReceiptPositionModifier> CreateReceiptPositionModifiers(IEnumerable<SalesLine> salesLines)
            {
                List<ReceiptPositionModifier> receiptPositionModifiers = new List<ReceiptPositionModifier>();

                foreach (SalesLine salesLine in salesLines)
                {
                    IEnumerable<DiscountLine> sortedDiscounts = salesLine.DiscountLines
                        .OrderBy(pct => pct.Percentage)
                        .ThenBy(amnt => amnt.EffectiveAmount);

                    foreach (DiscountLine discountLine in sortedDiscounts)
                    {
                        receiptPositionModifiers.Add(
                            new ReceiptPositionModifier
                            {
                                PositionNumber = SalesTransactionHelper.ConvertLineNumberToPositionNumber(salesLine.LineNumber),
                                Description = discountLine.DiscountName(),
                                Amount = -discountLine.EffectiveAmount
                            });
                    }
                }

                return receiptPositionModifiers;
            }

            /// <summary>
            /// Creates receipt taxes.
            /// </summary>
            /// <returns>The receipt taxes.</returns>
            private List<ReceiptTax> CreateReceiptTaxes()
            {
                return documentRule.CreateSalesTransactionReceiptTaxes();
            }

            /// <summary>
            /// Creates receipt footer.
            /// </summary>
            /// <returns>The receipt footer.</returns>
            private ReceiptFooter CreateReceiptFooter()
            {
                return null;
            }
        }
    }
}
