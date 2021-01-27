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
    namespace Commerce.Runtime.DocumentProvider.EpsonFP90IIISample.DocumentBuilders
    {
        using System;
        using System.Collections.Generic;
        using System.Collections.ObjectModel;
        using System.Linq;
        using System.Threading.Tasks;
        using System.Xml.Linq;
        using Contoso.Commerce.Runtime.DocumentProvider.EpsonFP90IIISample.Constants;
        using Contoso.Commerce.Runtime.DocumentProvider.EpsonFP90IIISample.Helpers;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel.Italy.Entities;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.TaxRegistrationIdItaly.Messages;

        /// <summary>
        /// Generates fiscal receipt document.
        /// </summary>
        public static class DocumentBuilder
        {
            /// <summary>
            /// Builds fiscal receipt document.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="adjustedSalesOrder">The adjusted sales order.</param>
            /// <returns>The generated fiscal document string.</returns>
            public static async Task<string> BuildAsync(GetFiscalDocumentDocumentProviderRequest request, SalesOrder adjustedSalesOrder)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(adjustedSalesOrder, nameof(adjustedSalesOrder));

                XDocument doc = new XDocument();
                XElement rootElement = DocumentElementBuilder.XElement(DocumentElementConstants.RootForSalesOrder);

                rootElement = await BuildStartElementAsync(request, adjustedSalesOrder, rootElement).ConfigureAwait(false);
                rootElement = await BuildBodyAsync(request, adjustedSalesOrder, rootElement).ConfigureAwait(false);
                rootElement = await BuildFooterAsync(request, adjustedSalesOrder, rootElement).ConfigureAwait(false);
                rootElement = BuildEndElement(request, rootElement);

                doc.Add(rootElement);

                return doc.ToString();
            }

            /// <summary>
            /// Builds start element for the fiscal receipt document.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="adjustedSalesOrder">The adjusted sales order.</param>
            /// <param name="rootElement">The document root element.</param>
            /// <returns>The updated document root element.</returns>
            public static async Task<XElement> BuildStartElementAsync(GetFiscalDocumentDocumentProviderRequest request, SalesOrder adjustedSalesOrder, XElement rootElement)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(adjustedSalesOrder, nameof(adjustedSalesOrder));

                // Company logo, it will upload manually via tool provided by Epson. Do not print if chosen "false" value of "Print fiscal data in reseipt header" property in configuration.
                if (ConfigurationController.ParsePrintFiscalDatatInReceiptHeader(request.FiscalIntegrationFunctionalityProfile))
                {
                    // Company name, name of the Operating unit linked with the current store.
                    string DeviceNumber = request.RequestContext.GetPrincipal()?.DeviceNumber ?? string.Empty;
                    foreach (string splitString in StringProcessor.SplitStringByWords(DeviceNumber, DocumentAttributeConstants.MaxHeaderAttributeLength).Take(DocumentAttributeConstants.ReceiptFieldStoreAddressLinesLimit))
                    {
                        rootElement = DocumentElementBuilder.BuildPrintRecMessageElement(rootElement, splitString, DocumentAttributeConstants.ReceiptHeaderMessageType, GetNextHeaderLineIndex(rootElement).ToString());
                    }

                    // Address
                    string OrgUnitFullAddress = request.RequestContext.GetOrgUnit()?.OrgUnitFullAddress ?? string.Empty;
                    foreach (string splitString in StringProcessor.SplitStringByWords(OrgUnitFullAddress.Replace("\n", DocumentAttributeConstants.Space), DocumentAttributeConstants.MaxHeaderAttributeLength).Take(DocumentAttributeConstants.ReceiptFieldCompanyLinesLimit))
                    {
                        rootElement = DocumentElementBuilder.BuildPrintRecMessageElement(rootElement, splitString, DocumentAttributeConstants.ReceiptHeaderMessageType, GetNextHeaderLineIndex(rootElement).ToString());
                    }

                    // VAT number, the tax identification number (TIN) specified on the Store.
                    rootElement = await FillStoreVATNumberAsync(request.RequestContext, rootElement).ConfigureAwait(false);

                    // Cashier name
                    string UserId = request.RequestContext.GetPrincipal()?.UserId ?? string.Empty;
                    rootElement = DocumentElementBuilder.BuildPrintRecMessageElement(rootElement, UserId, DocumentAttributeConstants.ReceiptHeaderMessageType, GetNextHeaderLineIndex(rootElement).ToString());
                }

                // Adds customer name and sales ID above receipt header if the sales order is customer order.
                if (adjustedSalesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.CustomerOrder)
                {
                    rootElement = await CustomerOrderDocumentBuilder.BuildHeaderAsync(request, rootElement, adjustedSalesOrder).ConfigureAwait(false);
                }

                rootElement = await BuildRefundStartElementAsync(request, adjustedSalesOrder, rootElement).ConfigureAwait(false);

                XElement beginFiscalReceipt = DocumentElementBuilder.XElement(DocumentElementConstants.BeginFiscalReceipt);
                beginFiscalReceipt.Add(new XAttribute(DocumentAttributeConstants.Operator, DocumentAttributeConstants.DefaultOperatorId));
                rootElement.Add(beginFiscalReceipt);

                return rootElement;
            }

            /// <summary>
            /// Builds end element for the fiscal receipt document.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="rootElement">The document root element.</param>
            /// <returns>The updated document root element.</returns>
            public static XElement BuildEndElement(GetFiscalDocumentDocumentProviderRequest request, XElement rootElement)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(rootElement, nameof(rootElement));

                XElement endFiscalReceipt = DocumentElementBuilder.XElement(DocumentElementConstants.EndFiscalReceipt);
                endFiscalReceipt.Add(DocumentElementBuilder.XAttribute(DocumentAttributeConstants.Operator, DocumentAttributeConstants.DefaultOperatorId));

                rootElement.Add(endFiscalReceipt);

                return rootElement;
            }

            /// <summary>
            /// Gets number of the next header row after existing, if receipt has no rows in header returns 1.
            /// </summary>
            /// <param name="parentelement"> The parent element.</param>
            /// <returns>Index of the next line in header</returns>
            public static int GetNextHeaderLineIndex(XElement parentElement)
            {
                int rowIndex;

                int.TryParse((from c in parentElement.Elements("printRecMessage")
                              where c.Attribute("messageType").Value == "1"
                              select c.Attribute("index").Value).Max(), out rowIndex);

                return rowIndex + 1;
            }

            /// <summary>
            /// Builds the body section for the fiscal receipt document.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="adjustedSalesOrder">The adjusted sales order.</param>
            /// <param name="rootElement">The document root element.</param>
            /// <returns>The updated document root element.</returns>
            private static async Task<XElement> BuildBodyAsync(GetFiscalDocumentDocumentProviderRequest request, SalesOrder adjustedSalesOrder, XElement rootElement)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(adjustedSalesOrder, nameof(adjustedSalesOrder));

                IEnumerable<SalesLine> salesLines = adjustedSalesOrder.ActiveSalesLines;
                IEnumerable<string> itemIds = salesLines.Select(l => l.ItemId);
                ReadOnlyCollection<Item> products = await SalesOrderHelper.GetProductsByItemIDAsync(request.RequestContext, itemIds).ConfigureAwait(false);
                var discountFiscalTexts = new Lazy<Task<List<FiscalIntegrationSalesDiscountFiscalText>>>(async () => await SalesOrderHelper.GetDiscountFiscalTextForSalesOrderAsync(request, adjustedSalesOrder).ConfigureAwait(false));

                // Lines
                foreach (var salesLine in salesLines)
                {
                    ChannelConfiguration channelConfiguration = request.RequestContext.GetChannelConfiguration();

                    // For customer order, should print standard fiscal receipt for pick up operation and for the lines with delivery mode "carry out" when create or edit customer order.
                    bool isCarryingOutLine = SalesOrderHelper.IsCustomerOrderCreateOrEdit(adjustedSalesOrder) && salesLine.DeliveryMode == channelConfiguration.CarryoutDeliveryModeCode;

                    // For customer order, should print standard fiscal receipt for customer order pick up lines and return lines that has quantity.
                    bool isPickingUpOrReturningLine = SalesOrderHelper.IsCustomerOrderPickupOrReturn(adjustedSalesOrder, channelConfiguration) && salesLine.Quantity != 0;

                    if (adjustedSalesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.Sales
                        || adjustedSalesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.SalesInvoice
                        || isCarryingOutLine
                        || isPickingUpOrReturningLine)
                    {
                        // Item code, Item name, Quantity
                        rootElement = DocumentElementBuilder.BuildPrintRecItemOrRecFundElement(rootElement, adjustedSalesOrder, salesLine, products, request);

                        // Amount, a fiscal printer calculates amount automatically.

                        // Additional description of discounts for the fiscal receipt
                        string fiscalText = string.Empty;

                        if (salesLine.DiscountAmount != decimal.Zero && salesLine.DiscountLines.Any())
                        {
                            List<FiscalIntegrationSalesDiscountFiscalText> printDiscountFiscalTexts = new List<FiscalIntegrationSalesDiscountFiscalText>();
                            var discountFiscalTextsValue = await discountFiscalTexts.Value.ConfigureAwait(false);
                            printDiscountFiscalTexts.AddRange(discountFiscalTextsValue.Where(line =>
                            line.SalesLineNumber == salesLine.LineNumber
                            && line.DiscountLineType == DiscountLineType.PeriodicDiscount));
                            printDiscountFiscalTexts.AddRange(discountFiscalTextsValue.Where(line =>
                            line.SalesLineNumber == salesLine.LineNumber
                            && line.DiscountLineType == DiscountLineType.ManualDiscount
                            && (line.ManualDiscountType == ManualDiscountType.LineDiscountAmount
                            || line.ManualDiscountType == ManualDiscountType.LineDiscountPercent)));
                            printDiscountFiscalTexts.AddRange(discountFiscalTextsValue.Where(line =>
                            line.SalesLineNumber == salesLine.LineNumber
                            && line.DiscountLineType == DiscountLineType.ManualDiscount
                            && (line.ManualDiscountType == ManualDiscountType.TotalDiscountAmount
                            || line.ManualDiscountType == ManualDiscountType.TotalDiscountPercent)));

                            fiscalText = string.Join(" ", printDiscountFiscalTexts.Where(text => text.DiscountFiscalTexts.Count > 0).Select(x => x.ToString()));
                            fiscalText = string.IsNullOrWhiteSpace(fiscalText) ? string.Empty : fiscalText;
                        }

                        //According to the legislation, we have to print all the legal text for discounts in receipt.
                        //We are splitting text by lines, because length of the text field is limited by printer.
                        List<string> splittedFiscalText = StringProcessor.SplitStringByWords(fiscalText, DocumentAttributeConstants.MaxAttributeLength);

                        foreach (string textPart in splittedFiscalText.Take(splittedFiscalText.Count - 1))
                        {
                            rootElement = DocumentElementBuilder.BuildPrintRecMessageElement(rootElement, textPart, DocumentAttributeConstants.DefaultMessageType);
                        }

                        rootElement = DocumentElementBuilder.BuildPrintRecItemOrSubtotalAdjustment(rootElement, salesLine.DiscountAmount, true, DocumentAttributeConstants.PrintRecItemAdjustmentTypeValue, description: splittedFiscalText.LastOrDefault());
                    }
                }

                // Payments
                rootElement = await PaymentInfoBuilder.FillPaymentsAsync(rootElement, request, adjustedSalesOrder).ConfigureAwait(false);

                return rootElement;
            }

            /// <summary>
            /// Builds the footer section for the fiscal receipt document.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="adjustedSalesOrder">The adjusted sales order.</param>
            /// <param name="rootElement">The document root element.</param>
            /// <returns>The updated document root element.</returns>
            private static async Task<XElement> BuildFooterAsync(GetFiscalDocumentDocumentProviderRequest request, SalesOrder adjustedSalesOrder, XElement rootElement)
            {
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(adjustedSalesOrder, nameof(adjustedSalesOrder));

                // Fiscal customer lottery code number.
                rootElement = await DocumentBuilder.BuildFiscalCustomerLotteryCodeAsync(request.RequestContext, rootElement, adjustedSalesOrder).ConfigureAwait(false);

                string barcodeType = ConfigurationController.ParseReceiptNumberBarcodeType(request.FiscalIntegrationFunctionalityProfile);

                if (string.IsNullOrEmpty(barcodeType))
                {
                    // Receipt number
                    rootElement = DocumentElementBuilder.BuildPrintRecMessageElement(rootElement, adjustedSalesOrder.ReceiptId, DocumentAttributeConstants.DefaultMessageType);
                }
                else
                {
                    // Barcode
                    rootElement = DocumentElementBuilder.BuildPrintStandardBarCodeElement(rootElement, adjustedSalesOrder.ReceiptId, barcodeType);
                }

                return rootElement;
            }

            /// <summary>
            /// Builds end element for the fiscal receipt document.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="adjustedSalesOrder">The adjusted sales order.</param>
            /// <param name="rootElement">The document root element.</param>
            /// <returns>The updated document root element.</returns>
            private static async Task<XElement> BuildRefundStartElementAsync(GetFiscalDocumentDocumentProviderRequest request, SalesOrder adjustedSalesOrder, XElement rootElement)
            {
                ThrowIf.Null(adjustedSalesOrder, nameof(adjustedSalesOrder));
                ThrowIf.Null(request, nameof(request));
                ThrowIf.Null(request.RequestContext, nameof(request.RequestContext));
                ThrowIf.Null(rootElement, nameof(rootElement));

                bool isReturnByTransaction = SalesOrderHelper.IsReturnByTransaction(adjustedSalesOrder);
                bool isReturn = isReturnByTransaction || SalesOrderHelper.IsReturnProduct(adjustedSalesOrder);

                if (isReturn)
                {
                    // Refund messages format : REFUND zzzz nnnn ddmmyyyy sssssssssss.
                    int zReportNumber = FiscalPrinterResponseConstants.DefaultZRepNumber;
                    int fiscalReceiptNumber = FiscalPrinterResponseConstants.DefaultFiscalReceiptNumber;
                    string fiscalReceiptDate = adjustedSalesOrder.BusinessDate != null ? adjustedSalesOrder.BusinessDate.Value.ToString(FiscalPrinterResponseConstants.DateFormatForFiscalDocument) : DateTime.Now.ToString(FiscalPrinterResponseConstants.DateFormatForFiscalDocument);
                    string serialNumber = FiscalPrinterResponseConstants.DefaultFiscalSerialNumber;

                    if (isReturnByTransaction && adjustedSalesOrder.CheckActiveSalesLinesReturnTransactionId())
                    {
                        // Gets original sales order.
                        SalesOrder originalSalesOrder = await SalesOrderHelper.GetOriginalSalesOrderForReturnAsync(request.RequestContext, adjustedSalesOrder).ConfigureAwait(false);

                        // Gets fiscal transaction.
                        FiscalTransaction fiscalTransaction = null;
                        if (originalSalesOrder != null)
                        {
                            fiscalTransaction = originalSalesOrder.FiscalTransactions.Where(f => f.ConnectorGroup == request.FiscalIntegrationFunctionalityProfileGroupId && f.ConnectorName == request.FiscalIntegrationTechnicalProfile.ConnectorName).SingleOrDefault();

                            fiscalReceiptDate = originalSalesOrder.BusinessDate != null ? originalSalesOrder.BusinessDate.Value.ToString(FiscalPrinterResponseConstants.DateFormatForFiscalDocument) : fiscalReceiptDate;

                            if (fiscalTransaction != null)
                            {
                                fiscalReceiptDate = fiscalTransaction.TransDateTime.ToString(FiscalPrinterResponseConstants.DateFormatForFiscalDocument);

                                if (fiscalTransaction.RegistrationStatus == FiscalIntegrationRegistrationStatus.Completed && !string.IsNullOrWhiteSpace(fiscalTransaction.RegisterResponse))
                                {
                                    XElement registerResponseXElement = XElement.Parse(fiscalTransaction.RegisterResponse);

                                    if (registerResponseXElement.Attributes(FiscalPrinterResponseConstants.Success).FirstOrDefault().Value.Equals("true"))
                                    {
                                        zReportNumber = Convert.ToInt32(FiscalPrinterResponseParser.ParseRegisterResponseInfo(registerResponseXElement, FiscalPrinterResponseConstants.ZRepNumberElement));
                                        fiscalReceiptNumber = Convert.ToInt32(FiscalPrinterResponseParser.ParseRegisterResponseInfo(registerResponseXElement, FiscalPrinterResponseConstants.FiscalReceiptNumberElement));
                                        fiscalReceiptDate = FiscalPrinterResponseParser.ParseRegisterResponseInfo(registerResponseXElement, FiscalPrinterResponseConstants.FiscalReceiptDateElement);
                                        serialNumber = string.IsNullOrWhiteSpace(fiscalTransaction.RegisterInfo) ? FiscalPrinterResponseConstants.DefaultFiscalSerialNumber : fiscalTransaction.RegisterInfo;
                                    }
                                }
                            }
                        }
                    }

                    string refundMessage = string.Format("REFUND {0} {1} {2} {3}", zReportNumber.ToString(FiscalPrinterResponseConstants.NumberFormat), fiscalReceiptNumber.ToString(FiscalPrinterResponseConstants.NumberFormat), fiscalReceiptDate, serialNumber);
                    rootElement = DocumentElementBuilder.BuildPrintRecMessageElement(rootElement, refundMessage, DocumentAttributeConstants.DefaultMessageType);
                }

                return rootElement;
            }

            /// <summary>
            /// Fills in the store VAT number, if VAT number isn't empty, builds printRecMessageElement. 
            /// </summary>
            /// <param name="context">The request context.</param>
            /// <param name="parentElement">The parent element.</param>
            /// <returns>The updated xml element.</returns>
            private static async Task<XElement> FillStoreVATNumberAsync(RequestContext context, XElement parentElement)
            {
                GetDeviceConfigurationDataRequest getDeviceConfigurationDataRequest = new GetDeviceConfigurationDataRequest();
                SingleEntityDataServiceResponse<DeviceConfiguration> deviceConfiguration = await context.ExecuteAsync<SingleEntityDataServiceResponse<DeviceConfiguration>>(getDeviceConfigurationDataRequest).ConfigureAwait(false);
                string vatNumber = deviceConfiguration.Entity.TaxIdNumber;

                if (!string.IsNullOrWhiteSpace(vatNumber))
                {
                    parentElement = DocumentElementBuilder.BuildPrintRecMessageElement(parentElement, vatNumber + DocumentAttributeConstants.Space + DocumentAttributeConstants.PIVA, DocumentAttributeConstants.ReceiptHeaderMessageType, GetNextHeaderLineIndex(parentElement).ToString());
                }

                return parentElement;
            }

            /// <summary>
            /// Builds the fiscal customer lottery code element.
            /// </summary>
            /// <param name="context">The request context.</param>
            /// <param name="parentElement">The parent element.</param>
            /// <param name="salesOrder">The sales order.</param>
            /// <returns>The element containing the fiscal customer lottery code element.</returns>
            private static async Task<XElement> BuildFiscalCustomerLotteryCodeAsync(RequestContext context, XElement parentElement, SalesOrder salesOrder)
            {
                if (context.Runtime.GetRequestHandlers<IRequestHandler>(typeof(GetFiscalCustomerDataDataRequest)).IsNullOrEmpty())
                {
                    return parentElement;
                }

                var request = new GetFiscalCustomerDataDataRequest(salesOrder.Id, salesOrder.TerminalId);
                var fiscalCustomerDataResponse = await context.ExecuteAsync<SingleEntityDataServiceResponse<FiscalCustomerData>>(request).ConfigureAwait(false);

                var fiscalCustomerData = fiscalCustomerDataResponse.Entity;

                if (fiscalCustomerData == null)
                {
                    return parentElement;
                }

                return DocumentElementBuilder.BuildFiscalCustomerLotteryCodeElement(parentElement, fiscalCustomerData.LotteryCode);
            }
        }
    }
}
