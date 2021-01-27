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
    namespace Commerce.Runtime.ReceiptsNorway
    {
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// The extended service to get custom sales receipt field.
        /// </summary>
        public class GetSalesTransactionCustomReceiptFieldService : IRequestHandlerAsync
        {
            /// <summary>
            /// Localization helper class instance.
            /// </summary>
            private ReceiptLocalizationHelper localizationHelper;

            /// <summary>
            /// Gets the supported request types.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(GetSalesTransactionCustomReceiptFieldServiceRequest),
                    };
                }
            }

            /// <summary>
            /// Executes the requests.
            /// </summary>
            /// <param name="request">The request parameter.</param>
            /// <returns>The GetReceiptServiceResponse that contains the formatted receipts.</returns>
            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");

                this.InitializeLocalizationHelperInstance(request);

                Type requestedType = request.GetType();

                if (requestedType == typeof(GetSalesTransactionCustomReceiptFieldServiceRequest))
                {
                    return await this.GetCustomReceiptFieldForSalesTransactionReceiptsAsync((GetSalesTransactionCustomReceiptFieldServiceRequest)request).ConfigureAwait(false);
                }

                throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }

            /// <summary>
            /// Initializes localization helper class instance from service request.
            /// </summary>
            /// <param name="request">Service request.</param>
            protected void InitializeLocalizationHelperInstance(Request request)
            {
                ThrowIf.Null(request, "request");

                this.localizationHelper = new ReceiptLocalizationHelper(request.RequestContext);
            }

            /// <summary>
            /// Wraps single line string to multiple lines according to specified maximum line length.
            /// </summary>
            /// <param name="sourceString">String to be wrapped.</param>
            /// <param name="maxLength">The maximum length of single line.</param>
            /// <returns>The wrapped string.</returns>
            private static string WrapString(string sourceString, int maxLength)
            {
                if (maxLength <= 0)
                {
                    return sourceString;
                }

                string tempLine = sourceString ?? string.Empty;
                string resultString = string.Empty;

                // Iterate till the tempLine length becomes less than fieldLength.
                while (tempLine.Length > maxLength)
                {
                    resultString += string.Concat(tempLine.Substring(0, maxLength), Environment.NewLine);
                    tempLine = tempLine.Substring(maxLength);
                }

                resultString += tempLine;

                return resultString;
            }

            /// <summary>
            /// Gets the custom receipt field value for sales receipt.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The value of custom receipt field.</returns>
            private async Task<Response> GetCustomReceiptFieldForSalesTransactionReceiptsAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                ThrowIf.Null(request.SalesOrder, "sales order");

                string receiptFieldName = request.CustomReceiptField;
                string receiptFieldValue = string.Empty;

                switch (receiptFieldName)
                {
                    case "RECEIPTTITLE":
                        receiptFieldValue = this.GetSalesReceiptTitleValue(request);
                        break;

                    case "ISGIFTCARD":
                        receiptFieldValue = this.GetIsGiftCardValue(request);
                        break;

                    case "SALESTOTALEXT":
                        receiptFieldValue = await this.GetSalesTotalAmountExtValueAsync(request).ConfigureAwait(false);
                        break;

                    case "TAXTOTALEXT":
                        receiptFieldValue = await this.GetTaxTotalAmountExtValueAsync(request).ConfigureAwait(false);
                        break;

                    case "TOTALWITHTAXEXT":
                        receiptFieldValue = await this.GetTotalAmountWithTaxExtValueAsync(request).ConfigureAwait(false);
                        break;

                    case "AMOUNTPERTAXEXT":
                        receiptFieldValue = await this.GetTaxAmountExtValueAsync(request).ConfigureAwait(false);
                        break;

                    case "CASHTRANSACTIONSEQUENTIALNUMBER":
                        receiptFieldValue = this.GetSequentialNumber(request);
                        break;
                    default:
                        return new NotHandledResponse();
                }

                int receiptFieldLength = request.ReceiptItemInfo == null ? 0 : request.ReceiptItemInfo.Length;
                var returnValue = WrapString(receiptFieldValue, receiptFieldLength);

                return new GetCustomReceiptFieldServiceResponse(returnValue);
            }

            /// <summary>
            /// Gets the receipt title custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The receipt title custom field value.</returns>
            private string GetSalesReceiptTitleValue(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                string resultValue = string.Empty;

                switch (request.ReceiptType)
                {
                    case ReceiptType.SalesReceipt:
                        if (!SalesTransactionHelper.GetSalesLinesExt(request.SalesOrder).IsNullOrEmpty())
                        {
                            // Following line copies the core logic to determine the receipt transaction type.
                            var receiptTransactionType = NumberSequenceSeedTypeHelper.GetReceiptTransactionType(
                                request.SalesOrder.ExtensibleSalesTransactionType,
                                request.SalesOrder.TotalAmount,
                                request.SalesOrder.CustomerOrderMode);

                            if (receiptTransactionType.Equals(ReceiptTransactionType.Sale))
                            {
                                resultValue = this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceSales);
                            }
                            else if (receiptTransactionType.Equals(ReceiptTransactionType.Return))
                            {
                                resultValue = this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceSalesReturn);
                            }
                            else
                            {
                                resultValue = this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceNotPurchase);
                            }
                        }
                        else
                        {
                            resultValue = this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceNotPurchase);
                        }

                        break;

                    case ReceiptType.SalesOrderReceipt:
                    case ReceiptType.PickupReceipt:
                        if (request.SalesOrder.ExtensibleSalesTransactionType.Equals(ExtensibleSalesTransactionType.CustomerOrder) || request.SalesOrder.ExtensibleSalesTransactionType.Equals(ExtensibleSalesTransactionType.AsyncCustomerOrder))
                        {
                            var salesOrderSalesLinesExt = SalesTransactionHelper.GetSalesLinesExt(request.SalesOrder);
                            if (!salesOrderSalesLinesExt.IsNullOrEmpty())
                            {
                                if (request.SalesOrder.CustomerOrderMode.Equals(CustomerOrderMode.Return))
                                {
                                    resultValue = this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceCustomerOrderReturn);
                                }
                                else
                                {
                                    resultValue = this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceCustomerOrderSales);
                                }
                            }
                            else
                            {
                                resultValue = string.Format("{0} - {1}", this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceCustomerOrderDeposit), this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceNotPurchase));
                            }
                        }
                        else
                        {
                            resultValue = this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceNotPurchase);
                        }

                        break;

                    case ReceiptType.QuotationReceipt:
                        if (request.SalesOrder.ExtensibleSalesTransactionType.Equals(ExtensibleSalesTransactionType.CustomerOrder) || request.SalesOrder.ExtensibleSalesTransactionType.Equals(ExtensibleSalesTransactionType.AsyncCustomerOrder))
                        {
                            resultValue = string.Format("{0} - {1}", this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceProvisional), this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceNotPurchase));
                        }
                        else
                        {
                            resultValue = this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceNotPurchase);
                        }

                        break;

                    default:
                        resultValue = this.localizationHelper.Translate(ReceiptConstants.LocalizationResourceNotPurchase);
                        break;
                }

                return resultValue;
            }

            /// <summary>
            /// Gets the gift card flag custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The gift card flag custom field value.</returns>
            private string GetIsGiftCardValue(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                string resultValue = this.localizationHelper.Translate(request.SalesLine.IsGiftCardLine ?
                    ReceiptConstants.LocalizationResourceYes : ReceiptConstants.LocalizationResourceNo);

                return resultValue;
            }

            /// <summary>
            /// Gets the sales total amount custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The sales total amount custom field value.</returns>
            private async Task<string> GetSalesTotalAmountExtValueAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                string totalSalesAmountFieldValue = string.Empty;

                if (request.TaxLine == null && request.SalesLine == null)
                {
                    decimal totalSalesAmount = SalesTransactionHelper.GetTotalSalesAmountExt(request.SalesOrder);
                    totalSalesAmountFieldValue = await this.localizationHelper.FormatCurrencyAsync(totalSalesAmount).ConfigureAwait(false);
                }

                return totalSalesAmountFieldValue;
            }

            /// <summary>
            /// Gets the tax total amount custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The tax total amount custom field value.</returns>
            private async Task<string> GetTaxTotalAmountExtValueAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                string taxAmountFieldValue = string.Empty;

                if (request.TaxLine == null && request.SalesLine == null)
                {
                    decimal taxAmount = SalesTransactionHelper.GetTotalTaxAmountExt(request.SalesOrder);
                    taxAmountFieldValue = await this.localizationHelper.FormatCurrencyAsync(taxAmount).ConfigureAwait(false);
                }

                return taxAmountFieldValue;
            }

            /// <summary>
            /// Gets the total amount with tax custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The total amount with tax custom field value.</returns>
            private async Task<string> GetTotalAmountWithTaxExtValueAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                string totalAmountFieldValue = string.Empty;

                if (request.TaxLine == null && request.SalesLine == null)
                {
                    decimal totalAmount = SalesTransactionHelper.GetTotalAmountWithTaxExt(request.SalesOrder);
                    totalAmountFieldValue = await this.localizationHelper.FormatCurrencyAsync(totalAmount).ConfigureAwait(false);
                }

                return totalAmountFieldValue;
            }

            /// <summary>
            /// Gets the tax amount per tax code custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The tax amount per tax code custom field value.</returns>
            private async Task<string> GetTaxAmountExtValueAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                string taxAmountPerTaxCodeFieldValue = string.Empty;

                if (request.TaxLine != null)
                {
                    decimal taxAmountPerTax = SalesTransactionHelper.GetTaxAmountPerTaxCodeExt(request.SalesOrder, request.TaxLine.TaxCode);
                    taxAmountPerTaxCodeFieldValue = await this.localizationHelper.FormatCurrencyAsync(taxAmountPerTax).ConfigureAwait(false);
                }

                return taxAmountPerTaxCodeFieldValue;
            }

            /// <summary>
            /// Gets the cash transaction sequential number custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The cash transaction sequential number custom field value.</returns>
            private string GetSequentialNumber(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                return SalesTransactionHelper.GetSequentialNumber(request.SalesOrder);
            }
        }
    }
}
