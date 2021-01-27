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
    namespace Commerce.Runtime.FiscalRegisterReceiptSample
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Runtime.Serialization.Json;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// The extended service to get custom receipt field.
        /// </summary>
        /// <remarks>
        /// To print custom receipt fields containing fiscal transaction data on a receipt, one must:
        /// 1. Create new custom fields in the Dynamics 365 Retail Custom fields form.
        ///    Field names must match the names specified in the code below. Spaces and case are ignored, i.e. "Fiscal register control code" and "Fiscal register Id". 
        /// 2. Create new text labels for these fields in the Language text form on the POS tab. Update created custom fields with language text Ids.
        /// 3. Open receipt designer in the Receipt formats form and add created custom fields to the template.
        /// </remarks>
        public class GetCustomReceiptFieldsService : IRequestHandlerAsync
        {
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

                Type requestedType = request.GetType();

                if (requestedType == typeof(GetSalesTransactionCustomReceiptFieldServiceRequest))
                {
                    return await Task.FromResult(this.GetCustomReceiptFieldForSalesTransactionReceipts((GetSalesTransactionCustomReceiptFieldServiceRequest)request));
                }

                throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }

            /// <summary>
            /// Gets the current fiscal transaction.
            /// </summary>
            /// <param name="salesOrder">Sales order.</param>
            /// <param name="receiptCopy">Receipt copy flag.</param>
            /// <returns>The fiscal transaction.</returns>
            private static FiscalTransaction GetFiscalTransaction(SalesOrder salesOrder, bool receiptCopy)
            {
                FiscalTransaction fiscalTransaction =
                    salesOrder.FiscalTransactions.Where(ft => ft.ReceiptCopy == receiptCopy).OrderByDescending(ft => ft.CreatedDateTime).FirstOrDefault();

                return fiscalTransaction;
            }

            /// <summary>
            /// Gets the clean cash fiscal register response data object from the fiscal transaction.
            /// </summary>
            /// <param name="fiscalTransaction">Fiscal transaction.</param>
            /// <returns>The clean cash fiscal register response object.</returns>
            private static CleanCashRegisterResponseData GetCleanCashFiscalRegisterResponseData(FiscalTransaction fiscalTransaction)
            {
                CleanCashRegisterResponseData registerResponse = null;

                if (fiscalTransaction != null && !string.IsNullOrEmpty(fiscalTransaction.RegisterResponse))
                {
                    using (var memoryStream = new System.IO.MemoryStream(System.Text.Encoding.UTF8.GetBytes(fiscalTransaction.RegisterResponse)))
                    {
                        var jsonDeserializer = new DataContractJsonSerializer(typeof(CleanCashRegisterResponseData));
                        registerResponse = (CleanCashRegisterResponseData)jsonDeserializer.ReadObject(memoryStream);
                    }
                }

                return registerResponse;
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
            private Response GetCustomReceiptFieldForSalesTransactionReceipts(GetSalesTransactionCustomReceiptFieldServiceRequest request)
            {
                ThrowIf.Null(request.SalesOrder, "sales order");

                string receiptFieldName = request.CustomReceiptField;
                string receiptFieldValue = string.Empty;

                if (request.ReceiptType == ReceiptType.SalesReceipt && !request.IsPreview)
                {
                    // Note: Fiscal data is not filled in the preview mode.
                    var fiscalTransaction = GetFiscalTransaction(request.SalesOrder, request.IsCopy);
                    var registerResponse = GetCleanCashFiscalRegisterResponseData(fiscalTransaction);

                    switch (receiptFieldName)
                    {
                        case "FISCALREGISTERCONTROLCODE":
                            {
                                receiptFieldValue = registerResponse == null ? string.Empty : registerResponse.ControlCode;
                            }

                            break;

                        case "FISCALREGISTERID":
                            {
                                receiptFieldValue = registerResponse == null ? string.Empty : registerResponse.DeviceId;
                            }

                            break;
                    }
                }

                int receiptFieldLength = request.ReceiptItemInfo == null ? 0 : request.ReceiptItemInfo.Length;
                var returnValue = WrapString(receiptFieldValue, receiptFieldLength);
                return new GetCustomReceiptFieldServiceResponse(returnValue);
            }
        }
    }
}
