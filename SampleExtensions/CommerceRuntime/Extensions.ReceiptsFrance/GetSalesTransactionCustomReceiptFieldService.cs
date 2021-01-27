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
    namespace Commerce.Runtime.ReceiptsFrance
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Commerce.Runtime.CommonFrance;
        using Commerce.Runtime.CommonFrance.Messages;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
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
            /// Certification category.
            /// </summary>
            private const string CertificationCategory = "B";

            /// <summary>
            /// Certificate number.
            /// </summary>
            private const string CertificateNumber = "18/0203";

            private ISalesTransactionRegistrationStrategy registrationStrategy;
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

                this.Initialize(request);

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
            protected void Initialize(Request request)
            {
                ThrowIf.Null(request, "request");

                this.registrationStrategy = new SalesTransactionRegistrationStrategy(request.RequestContext);
                this.localizationHelper = new ReceiptLocalizationHelper(request.RequestContext);
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
                    case "SEQUENTIALNUMBER":
                        receiptFieldValue = this.GetSequentialNumber(request);
                        break;
                    case "TRANSACTIONTYPE":
                        receiptFieldValue = this.GetTransactionType(request);
                        break;
                    case "DIGITALSIGNATURE":
                        receiptFieldValue = this.GetDigitalSignature(request);
                        break;
                    case "ISFIRSTDIGITALSIGNATURE":
                        receiptFieldValue = this.IsFirstDigitalSignature(request);
                        break;
                    case "REPRINTNUMBER":
                        receiptFieldValue = await this.GetReprintNumberAsync(request).ConfigureAwait(false);
                        break;
                    case "SALESTOTAL":
                        receiptFieldValue = await this.GetSalesTotalAsync(request).ConfigureAwait(false);
                        break;
                    case "SALESTOTALTAX":
                        receiptFieldValue = await this.GetSalesTotalTaxAsync(request).ConfigureAwait(false);
                        break;
                    case "SALESTOTALINCLUDETAX":
                        receiptFieldValue = await this.GetSalesTotalIncludeTaxAsync(request).ConfigureAwait(false);
                        break;
                    case "SALESTAXAMOUNT":
                        receiptFieldValue = await this.GetSalesTaxAmountAsync(request).ConfigureAwait(false);
                        break;
                    case "SALESTAXBASIS":
                        receiptFieldValue = await this.GetSalesTotalTaxBasisAsync(request).ConfigureAwait(false);
                        break;
                    case "BUILDNUMBER":
                        receiptFieldValue = this.GetBuildNumber(request);
                        break;
                    case "CERTIFICATIONCATEGORY":
                        receiptFieldValue = this.GetCertificationCategory();
                        break;
                    case "CERTIFICATENUMBER":
                        receiptFieldValue = this.GetCertificateNumber();
                        break;
                    case "LINECOUNT":
                        receiptFieldValue = this.GetLineCount(request);
                        break;
                    default:
                        return new NotHandledResponse();
                }

                return new GetCustomReceiptFieldServiceResponse(receiptFieldValue);
            }

            /// <summary>
            /// Parses register response and retrieves sequential signature data.
            /// </summary>
            /// <param name="salesOrder">Sales order containing register response to be processed.</param>
            /// <returns>Sequential signature data.</returns>
            private SequentialSignatureRegisterableData GetSequentialSignatureData(SalesOrder salesOrder)
            {
                var fiscalTransactions = salesOrder.FiscalTransactions;

                if (fiscalTransactions == null)
                {
                    return null;
                }

                var registerResponseFiscalTransaction = fiscalTransactions.OrderByDescending(item => item.LineNumber)
                    .FirstOrDefault(item => !string.IsNullOrWhiteSpace(item.RegisterResponse) && !item.ReceiptCopy);

                if (registerResponseFiscalTransaction == null)
                {
                    return null;
                }

                return SerializationHelper.DeserializeSequentialSignatureDataFromJson<SequentialSignatureRegisterableData>(registerResponseFiscalTransaction.RegisterResponse);
            }

            /// <summary>
            /// Gets the cash transaction sequential number custom field value.
            /// </summary>
            /// <param name="request">Request to be processed.</param>
            /// <returns>The cash transaction sequential number custom field value.</returns>
            private string GetSequentialNumber(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                var salesOrder = request.SalesOrder;
                ThrowIf.Null(salesOrder, "request.SalesOrder");

                var signatureData = this.GetSequentialSignatureData(salesOrder);

                return signatureData?.SequentialNumber.ToString() ?? string.Empty;
            }

            /// <summary>
            /// Gets the transaction type custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The transaction type custom field value.</returns>
            private string GetTransactionType(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                var salesOrder = request.SalesOrder;
                ThrowIf.Null(salesOrder, "salesOrder");

                if (salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.AsyncCustomerOrder ||
                    salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.CustomerOrder)
                {
                    return this.localizationHelper.Translate(TransactionTypeLabelNames.CustomerOrder);
                }
                else if (salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.Sales)
                {
                    return this.localizationHelper.Translate(TransactionTypeLabelNames.Sales);
                }
                else if (salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.IncomeExpense && salesOrder.IncomeExpenseTotalAmount < 0)
                {
                    return this.localizationHelper.Translate(TransactionTypeLabelNames.Income);
                }
                else if (salesOrder.ExtensibleSalesTransactionType == ExtensibleSalesTransactionType.IncomeExpense && salesOrder.IncomeExpenseTotalAmount > 0)
                {
                    return this.localizationHelper.Translate(TransactionTypeLabelNames.Expense);
                }
                else
                {
                    return string.Empty;
                }
            }

            /// <summary>
            /// Gets the digital signature custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The digital signature custom field value.</returns>
            private string GetDigitalSignature(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                var salesOrder = request.SalesOrder;
                ThrowIf.Null(salesOrder, "salesOrder");

                var signatureData = this.GetSequentialSignatureData(salesOrder);
                string signature = string.Empty;
                if (signatureData != null)
                {
                    signature = string.Format(
                        "{0}{1}{2}{3}",
                        signatureData.Signature.Substring(2, 1),
                        signatureData.Signature.Substring(6, 1),
                        signatureData.Signature.Substring(12, 1),
                        signatureData.Signature.Substring(18, 1));
                }

                return signature;
            }

            /// <summary>
            /// Determines whether the sales transaction is first in signing sequence.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>Returns "Y" if it is digital signature, returns "N" otherwise.</returns>
            private string IsFirstDigitalSignature(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                var salesOrder = request.SalesOrder;
                ThrowIf.Null(salesOrder, "request.SalesOrder");

                string isFirstSignature = string.Empty;
                var signatureData = this.GetSequentialSignatureData(salesOrder);

                if (signatureData != null)
                {
                    isFirstSignature = FiscalDataToRegisterFormatter.GetFormattedPostponement(signatureData.SequentialNumber);
                }

                return isFirstSignature;
            }

            /// <summary>
            /// Gets the reprint number custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The reprint number custom field value.</returns>
            private async Task<string> GetReprintNumberAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                int result = 0;
                if (request.IsCopy)
                {
                    var receiptReprintNumberRequest = new GetTransactionReprintNumberServiceRequest(
                        request.SalesOrder.ChannelId,
                        request.SalesOrder.StoreId,
                        request.SalesOrder.TerminalId,
                        request.SalesOrder.Id);

                    var resultResponse = await request.RequestContext.ExecuteAsync<GetTransactionReprintNumberServiceResponse>(receiptReprintNumberRequest).ConfigureAwait(false);
                    result = resultResponse.ReprintNumber + 1;
                }

                return result.ToString();
            }

            /// <summary>
            /// Gets the sales total amount custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The sales total amount custom field value.</returns>
            private async Task<string> GetSalesTotalAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                var salesOrder = request.SalesOrder;
                ThrowIf.Null(salesOrder, "salesOrder");

                decimal amount = this.registrationStrategy.GetSaleLines(salesOrder)
                    .Select(line => line.NetAmountWithNoTax())
                    .DefaultIfEmpty(0)
                    .Sum();

                return await this.localizationHelper.FormatCurrencyAsync(amount).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets the tax total amount custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The tax total amount custom field value.</returns>
            private async Task<string> GetSalesTotalTaxAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                var salesOrder = request.SalesOrder;
                ThrowIf.Null(salesOrder, "salesOrder");

                decimal amount = this.registrationStrategy.GetSaleLines(salesOrder)
                    .Select(line => line.TaxAmount)
                    .DefaultIfEmpty(0)
                    .Sum();

                return await this.localizationHelper.FormatCurrencyAsync(amount).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets the total amount with tax custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The total amount with tax custom field value.</returns>
            private async Task<string> GetSalesTotalIncludeTaxAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                var salesOrder = request.SalesOrder;
                ThrowIf.Null(salesOrder, "salesOrder");

                decimal amount = this.registrationStrategy.GetSaleLines(salesOrder)
                    .Select(line => line.TotalAmount)
                    .DefaultIfEmpty(0)
                    .Sum();

                return await this.localizationHelper.FormatCurrencyAsync(amount).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets the tax amount per tax code custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The tax amount per tax code custom field value.</returns>
            private async Task<string> GetSalesTaxAmountAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                var salesOrder = request.SalesOrder;
                ThrowIf.Null(salesOrder, "salesOrder");

                var salesLines = this.registrationStrategy.GetSaleLines(salesOrder);
                if (salesLines.Any())
                {
                    decimal amount = salesLines
                        .SelectMany(line => line.TaxLines)
                        .Where(tax => tax.TaxCode == request.TaxLine.TaxCode)
                        .Select(tax => tax.Amount)
                        .DefaultIfEmpty(0)
                        .Sum();

                    return await this.localizationHelper.FormatCurrencyAsync(amount).ConfigureAwait(false);
                }
                else
                {
                    return string.Empty;
                }
            }

            /// <summary>
            /// Gets the tax basis per tax code custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The tax basis per tax code custom field value.</returns>
            private async Task<string> GetSalesTotalTaxBasisAsync(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                var salesOrder = request.SalesOrder;
                ThrowIf.Null(salesOrder, "request.SalesOrder");

                var salesLines = this.registrationStrategy.GetSaleLines(salesOrder);
                if (salesLines.Any())
                {
                    decimal amount = salesLines
                        .SelectMany(line => line.TaxLines)
                        .Where(tax => tax.TaxCode == request.TaxLine.TaxCode)
                        .Select(tax => tax.TaxBasis)
                        .DefaultIfEmpty(0)
                        .Sum();

                    return await this.localizationHelper.FormatCurrencyAsync(amount).ConfigureAwait(false);
                }
                else
                {
                    return string.Empty;
                }
            }

            /// <summary>
            /// Gets the build number custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>The build number custom field value.</returns>
            private string GetBuildNumber(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                return this.registrationStrategy.GetBuildNumber(request.SalesOrder);
            }

            /// <summary>
            /// Gets the certification category custom field value.
            /// </summary>
            /// <returns>The certificate category custom field value.</returns>
            private string GetCertificationCategory()
            {
                return CertificationCategory;
            }

            /// <summary>
            /// Gets the certificate number custom field value.
            /// </summary>
            /// <returns>The certificate number custom field value.</returns>
            private string GetCertificateNumber()
            {
                return CertificateNumber;
            }

            /// <summary>
            /// Gets the line count custom field value.
            /// </summary>
            /// <param name="request">The service request to get custom receipt field value.</param>
            /// <returns>Line count custom field value.</returns>
            private string GetLineCount(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                var salesOrder = request.SalesOrder;
                ThrowIf.Null(salesOrder, "salesOrder");

                return salesOrder.ActiveSalesLines.Count().ToString();
            }

            /// <summary>
            /// Contains transaction types text label names.
            /// </summary>
            private static class TransactionTypeLabelNames
            {
                internal const string CustomerOrder = "CustomerOrder";
                internal const string Sales = "Sales";
                internal const string Income = "Income";
                internal const string Expense = "Expense";
            }
        }
    }
}
