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
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;
        using static Contoso.Commerce.Runtime.DocumentProvider.EpsonFP90IIISample.DocumentBuilders.PaymentInfoBuilder;

        /// <summary>
        /// Builds related xml document elements.
        /// </summary>
        public static class DocumentElementBuilder
        {
            /// <summary>
            /// Builds PrintRecItemAdjustment element or PrintSubtotalAdjustment element according the input attribute 'element'.
            /// The PrintRecItemAdjustment element is used for the dicount amount of a sales line, the PrintSubtotalAdjustment is used for the total discount amount of a sales order.
            /// </summary>
            /// <param name="parentElement">The parent element.</param>
            /// <param name="discountAmount">The value of amount attribute.</param>
            /// <param name="isSalesLine">A bool value indicates current record is salesLine or salesOrder.</param>
            /// <param name="adjustmentType">The value of adjustmentType attribute.</param>
            /// <param name="justification">The value of justification attribute.</param>
            /// <param name="operatorId">The value of operatorId attribute.</param>
            /// <param name="description">The value of description attribute.</param>
            /// <returns>The PrintRecItemAdjustment element or PrintSubtotalAdjustment element.</returns>
            public static XElement BuildPrintRecItemOrSubtotalAdjustment(XElement parentElement, decimal discountAmount, bool isSalesLine, string adjustmentType, string justification = DocumentAttributeConstants.DefaultJustification, string operatorId = DocumentAttributeConstants.DefaultOperatorId, string description = "")
            {
                ThrowIf.Null(parentElement, nameof(parentElement));
                ThrowIf.NullOrWhiteSpace(operatorId, nameof(operatorId));
                ThrowIf.NullOrWhiteSpace(justification, nameof(justification));
                ThrowIf.NullOrWhiteSpace(adjustmentType, nameof(adjustmentType));

                if (discountAmount != 0)
                {
                    string element;
                    if (isSalesLine)
                    {
                        element = DocumentElementConstants.PrintRecItemAdjustment;
                    }
                    else
                    {
                        element = DocumentElementConstants.PrintRecSubtotalAdjustment;
                    }

                    string discountDescription = string.IsNullOrEmpty(description) ? DocumentLocalizerHelper.Translate(DocumentAttributeConstants.DiscountAppliedResourceId) : description;

                    XElement printRecItemAdjustmentElement = XElement(element);
                    printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.Operator, operatorId));
                    printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.Description, discountDescription));
                    printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.AdjustmentType, adjustmentType));
                    printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.Amount, Math.Abs(Math.Round(discountAmount, 2))));
                    printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.Justification, justification));

                    parentElement.Add(printRecItemAdjustmentElement);
                }

                return parentElement;
            }

            /// <summary>
            /// Builds PrintRecMessage element for the fiscal receipt document.
            /// </summary>
            /// <param name="parentElement">The parent element.</param>
            /// <param name="message">The value of message attribute.</param>
            /// <param name="messageType">The value of messageType attribute.</param>
            /// <param name="operatorId">The value of operatorId attribute.</param>
            /// <param name="index">The value of index attribute.</param>
            /// <param name="font">The value of font attribute.</param>
            /// <param name="comment">The value of comment attribute.</param>
            /// <returns>The PrintRecMessage element.</returns>
            public static XElement BuildPrintRecMessageElement(XElement parentElement, string message, string messageType, string index = "", string operatorId = DocumentAttributeConstants.DefaultOperatorId, string font = "", string comment = "")
            {
                ThrowIf.Null(parentElement, nameof(parentElement));
                ThrowIf.NullOrWhiteSpace(operatorId, nameof(operatorId));
                ThrowIf.NullOrWhiteSpace(messageType, nameof(messageType));

                //Do not print row in header if number of rows large than maximum allowable or incorrect.
                if (messageType == DocumentAttributeConstants.ReceiptHeaderMessageType && !IsAddPrintRecMessageElementAllowed(index, messageType))
                {
                    return parentElement;
                }

                XElement printRecMessageElement = XElement(DocumentElementConstants.PrintRecMessage);
                printRecMessageElement.Add(XAttribute(DocumentAttributeConstants.Operator, operatorId));
                printRecMessageElement.Add(XAttribute(DocumentAttributeConstants.Message, message));
                printRecMessageElement.Add(XAttribute(DocumentAttributeConstants.MessageType, messageType));

                if (!string.IsNullOrWhiteSpace(index))
                {
                    printRecMessageElement.Add(XAttribute(DocumentAttributeConstants.Index, index));
                }

                if (!string.IsNullOrWhiteSpace(font))
                {
                    printRecMessageElement.Add(XAttribute(DocumentAttributeConstants.Font, font));
                }

                if (!string.IsNullOrWhiteSpace(comment))
                {
                    printRecMessageElement.Add(XAttribute(DocumentAttributeConstants.Comment, comment));
                }

                parentElement.Add(printRecMessageElement);

                return parentElement;
            }

            /// <summary>
            /// Builds PrintRecItem element or PrintRecFund element, if current sales line is return line, builds PrintRecFund elemen, else builds PrintRecItem line.
            /// </summary>
            /// <param name="parentElement">The parent element.</param>
            /// <param name="adjustedSalesOrder">The adjusted sales order.</param>
            /// <param name="salesLine">The sales line.</param>
            /// <param name="products">The products of sales line.</param>
            /// <param name="request">The request.</param>
            /// <param name="justification">The value of justification attribute.</param>
            /// <param name="operatorId">The value of operatorId attribute.</param>
            /// <returns>The PrintRecItem element or PrintRecFund element.</returns>
            public static XElement BuildPrintRecItemOrRecFundElement(XElement parentElement, SalesOrder adjustedSalesOrder, SalesLine salesLine, ReadOnlyCollection<Item> products, GetFiscalDocumentDocumentProviderRequest request, string justification = DocumentAttributeConstants.DefaultJustification, string operatorId = DocumentAttributeConstants.DefaultOperatorId)
            {
                ThrowIf.Null(parentElement, nameof(parentElement));
                ThrowIf.Null(salesLine, nameof(salesLine));
                ThrowIf.Null(request, nameof(request));
                ThrowIf.NullOrWhiteSpace(operatorId, nameof(operatorId));
                ThrowIf.NullOrWhiteSpace(justification, nameof(justification));

                string description;
                string productName = GetProductNameByItemID(salesLine.ItemId, products);
                int maxLength = 37;
                decimal taxRatePercentSalesLine = Math.Round(salesLine.TaxRatePercent, 2);
                XElement printRecItemOrRefundElement;

                bool isReturn = SalesOrderHelper.IsReturnByTransaction(adjustedSalesOrder) || SalesOrderHelper.IsReturnProduct(adjustedSalesOrder);

                if (isReturn)
                {
                    printRecItemOrRefundElement = XElement(DocumentElementConstants.PrintRecRefund);
                }
                else
                {
                    printRecItemOrRefundElement = XElement(DocumentElementConstants.PrintRecItem);
                }

                description = salesLine.ItemId + DocumentAttributeConstants.Space + productName;

                // Truncate the description(itemId + product name) if the length is longger than 37.
                printRecItemOrRefundElement.Add(XAttribute(DocumentAttributeConstants.Description, description.Length > maxLength ? description.Substring(0, maxLength) : description));
                printRecItemOrRefundElement.Add(XAttribute(DocumentAttributeConstants.Operator, operatorId));
                printRecItemOrRefundElement.Add(XAttribute(DocumentAttributeConstants.Quantity, Math.Abs(Math.Round(salesLine.Quantity, 2))));
                printRecItemOrRefundElement.Add(XAttribute(DocumentAttributeConstants.UnitPrice, Math.Round(salesLine.Price, 2)));

                // VAT rate settings 1 : 21.00 ; 2 : 10.00 ; 3 : 4.00 ; 4 : 0.00
                // Finds an appropriate department value (left side of each combination, integer values 1, 2 …), if value not found, then apply the 1st value.
                string department = DocumentAttributeConstants.DefaultDepartment;
                Dictionary<int, string> vatRates = ConfigurationController.ParseSupportedVATRates(request.FiscalIntegrationFunctionalityProfile);

                if (vatRates.TryGetValue(SalesOrderHelper.ConvertSalesTaxRateToInt(taxRatePercentSalesLine), out department) == false)
                {
                    throw new ArgumentException("The transaction " + adjustedSalesOrder.ReceiptId
                        + " couldn’t be registered on a fiscal device or service due to the missing VAT data mapping (vat rate percentage is " + taxRatePercentSalesLine + "). Please contact your system administrator.");
                }

                printRecItemOrRefundElement.Add(XAttribute(DocumentAttributeConstants.Department, department));
                printRecItemOrRefundElement.Add(XAttribute(DocumentAttributeConstants.Justification, justification));

                parentElement.Add(printRecItemOrRefundElement);

                return parentElement;
            }

            /// <summary>
            /// Builds PrintRecTotal element for the fiscal receipt document.
            /// </summary>
            /// <param name="parentElement">The parent element.</param>
            /// <param name="request">The request.</param>
            /// <param name="adjustedSalesOrder">The adjusted sales order.</param>
            /// <param name="tenderTypeId">The tender type ID.</param>
            /// <param name="paymentAmount">The payment amount.</param>
            /// <param name="depositPaymentType">The deposit payment type.</param>
            /// <param name="operatorId">The value of operatorId attribute.</param>
            /// <param name="justification">The value of justification attribute.</param>
            /// <returns>The PrintRecTotal element.</returns>
            public static async Task<XElement> BuildPrintRecTotalAsync(XElement parentElement, GetFiscalDocumentDocumentProviderRequest request, SalesOrder adjustedSalesOrder, string tenderTypeId = null, decimal paymentAmount = 0, string depositPaymentType = null, string operatorId = DocumentAttributeConstants.DefaultOperatorId, string justification = DocumentAttributeConstants.DefaultJustification)
            {
                ThrowIf.Null(parentElement, nameof(parentElement));
                ThrowIf.Null(request, nameof(request));
                ThrowIf.NullOrWhiteSpace(operatorId, nameof(operatorId));

                XElement printRecItemAdjustmentElement = XElement(DocumentElementConstants.PrintRecTotal);

                // Credit notes only require the operator attribute.
                printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.Operator, operatorId));

                bool isReturn = SalesOrderHelper.IsReturnByTransaction(adjustedSalesOrder) || SalesOrderHelper.IsReturnProduct(adjustedSalesOrder);

                if (!isReturn)
                {
                    string index = string.Empty;

                    if (tenderTypeId != null && depositPaymentType != null)
                    {
                        throw new ArgumentException("The arguments tenderTypeId and depositPaymentType can not have value at the same.");
                    }
                    else if (tenderTypeId != null)
                    {
                        List<string> paymentInfo = await PaymentInfoBuilder.GetPaymentInfoAsync(request.RequestContext, request.FiscalIntegrationFunctionalityProfile, tenderTypeId).ConfigureAwait(false);

                        if (paymentInfo.IsNullOrEmpty())
                        {
                            throw new ArgumentException(String.Format("The argument {0} can not be empty.", nameof(paymentInfo)), nameof(paymentInfo));
                        }

                        printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.Description, paymentInfo[0]));
                        printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.PaymentType, paymentInfo[1]));

                        index = paymentInfo[2];
                    }
                    else if (depositPaymentType != null)
                    {
                        int depositPaymentTypeId = (int)Enum.Parse(typeof(PrinterPaymentType), depositPaymentType);
                        printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.Description, depositPaymentType));
                        printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.PaymentType, depositPaymentTypeId));
                        index = ResolveIndexAttribute(depositPaymentTypeId);
                    }

                    printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.Payment, Math.Round(paymentAmount, 2)));

                    if (!string.IsNullOrEmpty(index))
                    {
                        printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.Index, index));
                    }

                    if (!string.IsNullOrWhiteSpace(justification))
                    {
                        printRecItemAdjustmentElement.Add(XAttribute(DocumentAttributeConstants.Justification, justification));
                    }
                }

                parentElement.Add(printRecItemAdjustmentElement);

                return parentElement;
            }

            /// <summary>
            /// Builds standard printBarCode element.
            /// </summary>
            /// <param name="parentElement">The parent element.</param>
            /// <param name="code">The value of code attribute.</param>
            /// <param name="codeType">The value of codeType attribute.</param>
            /// <param name="operatorId">The value of operatorId attribute.</param>
            /// <param name="position">The value of position attribute.</param>
            /// <param name="width">The value of width attribute.</param>
            /// <param name="height">The value of height attribute.</param>
            /// <param name="hRIPosition">The value of hRIPosition attribute.</param>
            /// <param name="hRIFont">The value of hRIFont attribute.</param>
            /// <returns>The printBarCode element.</returns>
            public static XElement BuildPrintStandardBarCodeElement(XElement parentElement, string code, string codeType, string operatorId = DocumentAttributeConstants.DefaultOperatorId, string position = DocumentAttributeConstants.DefaultPosition, string width = DocumentAttributeConstants.DefaultWidth,
                string height = DocumentAttributeConstants.DefaultHeight, string hRIPosition = DocumentAttributeConstants.DefaultHRIPosition, string hRIFont = DocumentAttributeConstants.DefaultHRIFont)
            {
                ThrowIf.Null(parentElement, nameof(parentElement));
                ThrowIf.NullOrWhiteSpace(code, nameof(code));
                ThrowIf.NullOrWhiteSpace(codeType, nameof(codeType));
                ThrowIf.NullOrWhiteSpace(operatorId, nameof(operatorId));
                ThrowIf.NullOrWhiteSpace(position, nameof(position));
                ThrowIf.NullOrWhiteSpace(width, nameof(width));
                ThrowIf.NullOrWhiteSpace(height, nameof(height));
                ThrowIf.NullOrWhiteSpace(hRIPosition, nameof(hRIPosition));
                ThrowIf.NullOrWhiteSpace(hRIFont, nameof(hRIFont));

                XElement printBarCodeElement = XElement(DocumentElementConstants.printBarCode);
                printBarCodeElement.Add(XAttribute(DocumentAttributeConstants.Operator, operatorId));
                printBarCodeElement.Add(XAttribute(DocumentAttributeConstants.Position, position));
                printBarCodeElement.Add(XAttribute(DocumentAttributeConstants.Width, width));
                printBarCodeElement.Add(XAttribute(DocumentAttributeConstants.Height, height));
                printBarCodeElement.Add(XAttribute(DocumentAttributeConstants.HRIPosition, hRIPosition));
                printBarCodeElement.Add(XAttribute(DocumentAttributeConstants.HRIFont, hRIFont));
                printBarCodeElement.Add(XAttribute(DocumentAttributeConstants.CodeType, codeType));

                // If the property 'ReceiptNumberBarcodeType' has value "CODE128", add two characters "{A" at the beginning of the "code" attribute.
                printBarCodeElement.Add(XAttribute(DocumentAttributeConstants.Code, codeType.Equals(DocumentAttributeConstants.BarCodeTypeCODE128, StringComparison.OrdinalIgnoreCase) ? "{A" + code : code));

                parentElement.Add(printBarCodeElement);

                return parentElement;
            }

            /// <summary>
            /// Builds the fiscal customer lottery code element.
            /// </summary>
            /// <param name="parentElement">The parent element.</param>
            /// <param name="lotteryCode">The lottery code.</param>
            /// <param name="operatorId">The operator ID (2-digit).</param>
            /// <returns>The element containing the lottery code element.</returns>
            public static XElement BuildFiscalCustomerLotteryCodeElement(XElement parentElement, string lotteryCode, string operatorId = DocumentAttributeConstants.DefaultTaxCodeOperatorId)
            {
                ThrowIf.Null(parentElement, nameof(parentElement));
                ThrowIf.NullOrWhiteSpace(lotteryCode, nameof(lotteryCode));
                ThrowIf.NullOrWhiteSpace(operatorId, nameof(operatorId));

                var directIOElement = new XElement(DocumentElementConstants.directIO);
                var notUsed = "0000";
                directIOElement.Add(new XAttribute(DocumentAttributeConstants.Command, DocumentElementConstants.lotteryCodeDirectIOCommand));
                directIOElement.Add(new XAttribute(DocumentAttributeConstants.Data, $"{operatorId}{lotteryCode} {notUsed}"));
                parentElement.Add(directIOElement);

                return parentElement;
            }

            /// <summary>
            /// Creates new XML element.
            /// </summary>
            /// <param name="elementId">Element identifier.</param>
            /// <returns>New XML element.</returns>
            public static XElement XElement(string elementId)
            {
                return new XElement(elementId);
            }

            /// <summary>
            /// Creates new XML attribute.
            /// </summary>
            /// <param name="attribute">Element attribute identifier.</param>
            /// <param name="value">The value of element attribute.</param>
            /// <returns>New XML element attribute.</returns>
            public static XAttribute XAttribute(string attribute, object value)
            {
                return new XAttribute(attribute, value);
            }

            /// <summary>
            /// Get the product name by its item ID.
            /// </summary>
            /// <param name="itemId">The product item ID.</param>
            /// <param name="products">The list of products in the sales order.</param>
            /// <returns>The product name.</returns>
            private static string GetProductNameByItemID(string itemId, ReadOnlyCollection<Item> products)
            {
                ThrowIf.Null(products, nameof(products));

                string productName = string.Empty;
                List<string> namesList = (from item in products
                                          where item.ItemId == itemId
                                          select item.Name).ToList();

                if (namesList.Count > 0)
                {
                    productName = namesList.First();
                }

                return productName;
            }

            /// <summary>
            /// Validates if PrintRecMessage element can be added to the document.
            /// </summary>
            /// <param name="indexAttributeValue">The value of index attribute.</param>
            /// <param name="messageTypeAttributeValue">The value of MessageType attribute.</param>
            /// <returns>True if adding element is allowed, false if not allowed.</returns>
            private static bool IsAddPrintRecMessageElementAllowed(string indexAttributeValue, string messageTypeAttributeValue)
            {
                int index;

                return int.TryParse(indexAttributeValue, out index) && index <= DocumentAttributeConstants.ReceiptHeaderTotalLinesLimit;
            }
        }
    }
}
