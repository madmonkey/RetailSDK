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
    namespace Commerce.Runtime.SalesTransactionSignatureSample
    {
        using System;
        using System.Collections.Generic;
        using System.Globalization;
        using System.IO;
        using System.Linq;
        using System.Runtime.Serialization.Json;
        using System.Text;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;
        using SalesTransactionSignatureSample.Configuration;

        /// <summary>
        /// Class that implements a post trigger for the GetCustomerDataRequest request type.
        /// </summary>
        public class CreateSalesOrderServiceRequestTrigger : IRequestTriggerAsync
        {
            /// <summary>
            /// Represents custom resource identifier for exceptions.
            /// </summary>
            private const string CustomExceptionResourceId = "CUSTOM_SALES_TRANSACTION_SIGNATURE_SERVICE_RESOURCE_ID";

            /// <summary>
            /// The signature service configuration file not found error.
            /// </summary>
            private const string LastSalesTransactionMissingExceptionMessageResourceId = "Signing_LastSalesTransactionMissingExceptionMessage";

            /// <summary>
            /// Last sequential number key in sales transaction extension properties collection.
            /// </summary>
            /// <remarks>This key ID must match POS transaction extension property key ID.</remarks>
            private const string LastSequentialNumberKeyId = "LAST_SEQUENTIAL_NUMBER_744D9EEF-E3C7-4D8D-9269-2E4807388988";

            /// <summary>
            /// Last transaction signature key in sales transaction extension properties collection.
            /// </summary>
            /// <remarks>This key ID must match POS transaction extension property key ID.</remarks>
            private const string LastSignatureKeyId = "LAST_SIGNATURE_E2D913FA-DC7F-4637-9FAB-3C8051B0708E";

            /// <summary>
            /// Skip signing key in sales order extension properties collection.
            /// <remarks>This key ID must match POS transaction extension property key ID.</remarks>
            /// </summary>
            private const string SalesOrderSigningWasSkippedKeyId = "SIGNING_WAS_SKIPPED_5D29DCBF-622C-45ED-8EE1-E48547D9D1DC";

            /// <summary>
            /// Attribute name for sequential number.
            /// </summary>
            private const string SequentialNumberAttributeName = "Sequential_Number_BA0318C9-EF66-4FFB-9910-939CD1FACE56";

            /// <summary>
            /// Represents sales transaction signature signing strategy.
            /// </summary>
            private readonly SalesTransactionSignatureSigningStrategy signingStrategy;

            /// <summary>
            /// Represents current request culture.
            /// </summary>
            private string cultureName = string.Empty;

            /// <summary>
            /// Initializes a new instance of the <see cref="CreateSalesOrderServiceRequestTrigger"/> class.
            /// </summary>
            public CreateSalesOrderServiceRequestTrigger()
            {
                this.signingStrategy = new SalesTransactionSignatureSigningStrategy();
            }

            /// <summary>
            /// Gets the supported requests for this trigger.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[] { typeof(CreateSalesOrderServiceRequest) };
                }
            }

            /// <summary>
            /// Post trigger code.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="response">The response.</param>
            public async Task OnExecuted(Request request, Response response)
            {
                ThrowIf.Null(request, "request");

                bool signingWasSkipped = (bool?)request.GetProperty(SalesOrderSigningWasSkippedKeyId) ?? false;

                // Notify POS whether signing of sales transaction was skipped or not
                var createSalesOrderServiceResponse = (CreateSalesOrderServiceResponse)response;
                createSalesOrderServiceResponse.SalesOrder.SetProperty(SalesOrderSigningWasSkippedKeyId, signingWasSkipped);

                // It's only stub to handle async signature 
                await Task.CompletedTask;
            }

            /// <summary>
            /// Pre trigger code to fill fiscal transaction data.
            /// </summary>
            /// <param name="request">The request.</param>
            public async Task OnExecuting(Request request)
            {
                ThrowIf.Null(request, "request");

                if (request is CreateSalesOrderServiceRequest createSalesOrderServiceRequest)
                {
                    await this.SignTransactionAsync(createSalesOrderServiceRequest).ConfigureAwait(false);
                }
            }

            /// <summary>
            /// Signs transaction data.
            /// </summary>
            /// <param name="request">The request.</param>
            private async Task SignTransactionAsync(CreateSalesOrderServiceRequest request)
            {
                ThrowIf.Null(request.Transaction, "request.Transaction");
                ThrowIf.Null(request.RequestContext, "request.RequestContext");

                var salesTransaction = request.Transaction;
                var context = request.RequestContext;

                this.cultureName = context.LanguageId;

                if (!this.signingStrategy.IsSigningRequired(salesTransaction))
                {
                    request.SetProperty(SalesOrderSigningWasSkippedKeyId, true);
                    return;
                }

                string serializedSignature;
                try
                {
                    var signature = await this.SignTransactionDataAsync(context, salesTransaction).ConfigureAwait(false);
                    serializedSignature = this.SerializeSignedTransaction(signature);
                }
                catch (Exception ex)
                {
                    throw new CommerceException(CustomExceptionResourceId, ex, ex.Message) { LocalizedMessage = ex.Message };
                }

                var fiscalTransaction = new FiscalTransaction()
                {
                    StoreId = salesTransaction.StoreId,
                    TerminalId = salesTransaction.TerminalId,
                    TransactionId = salesTransaction.Id,
                    LineNumber = 1,
                    RegisterResponse = serializedSignature,
                    ReceiptCopy = false,
                    RegisterStoreId = context.GetDeviceConfiguration().StoreNumber,
                    RegisterTerminalId = context.GetDeviceConfiguration().TerminalId,
                    StaffId = salesTransaction.StaffId
                };

                salesTransaction.FiscalTransactions.Add(fiscalTransaction);
            }

            /// <summary>
            /// Serializes signed transaction to JSON string.
            /// </summary>
            /// <param name="data">Signed transaction data.</param>
            /// <returns>JSON string.</returns>
            private string SerializeSignedTransaction(SignedTransactionData data)
            {
                string json;

                using (var stream = new MemoryStream())
                {
                    var serializer = new DataContractJsonSerializer(typeof(SignedTransactionData));
                    serializer.WriteObject(stream, data);
                    byte[] bytes = stream.ToArray();
                    json = Encoding.UTF8.GetString(stream.ToArray(), 0, bytes.Length);
                }

                return json;
            }

            /// <summary>
            /// Signs transaction data.
            /// </summary>
            /// <param name="context">Request context.</param>
            /// <param name="salesTransaction">Transaction to sign.</param>
            /// <returns>Signed transaction data.</returns>
            private async Task<SignedTransactionData> SignTransactionDataAsync(RequestContext context, SalesTransaction salesTransaction)
            {
                long sequentialNumber = this.IncrementSequentialNumber(this.GetPreviousSequentialNumber(salesTransaction));
                string dataToSign = this.GetDataToSign(context, salesTransaction, sequentialNumber);

                SalesTransactionSignatureConfigSection configurationSection = SalesTransactionSignatureConfiguration.GetInstance(this.cultureName).SalesTransactionSignatureConfigSection;
                string certificateThumbprint = configurationSection.CertificateThumbprint;
                string certificateStoreName = configurationSection.CertificateStoreName;
                string certificateStoreLocation = configurationSection.CertificateStoreLocation;

                const string Encoding = "UTF-8"; // Requirement from Norweigian tax authority.
                const string HashAlgorithm = "SHA256"; // Requirement from Norweigian tax authority.

                CertificateSignatureServiceRequest signatureRequest;
                if (!string.IsNullOrEmpty(certificateStoreName) && !string.IsNullOrEmpty(certificateStoreLocation))
                {
                    signatureRequest = new CertificateSignatureServiceRequest(dataToSign, Encoding, HashAlgorithm, certificateThumbprint, certificateStoreName, certificateStoreLocation);
                }
                else
                {
                    signatureRequest = new CertificateSignatureServiceRequest(dataToSign, Encoding, HashAlgorithm, certificateThumbprint);
                }

                CertificateSignatureServiceResponse response = await context.ExecuteAsync<CertificateSignatureServiceResponse>(signatureRequest).ConfigureAwait(false);

                var signedData = new SignedTransactionData()
                {
                    Signature = response.Signature,
                    DataToSign = dataToSign,
                    KeyThumbprint = certificateThumbprint,
                    SequentialNumber = sequentialNumber
                };

                // Save sequential number value to transaction attribute to make it easier to read this value in Receipt Service.
                this.SaveSequentialNumberTransactionAttribute(salesTransaction, sequentialNumber);

                return signedData;
            }

            /// <summary>
            /// Save sequential number value to transaction attributes collection.
            /// </summary>
            /// <param name="salesTransaction">Transaction to sign.</param>
            /// <param name="sequentialNumber">Signed transaction sequential number.</param>
            private void SaveSequentialNumberTransactionAttribute(SalesTransaction salesTransaction, long sequentialNumber)
            {
                AttributeTextValue sequentialNumberReceiptTextAttribute = salesTransaction.AttributeValues.SingleOrDefault(attribute => string.Equals(attribute.Name, SequentialNumberAttributeName, StringComparison.OrdinalIgnoreCase)) as AttributeTextValue;

                if (sequentialNumberReceiptTextAttribute == null)
                {
                    salesTransaction.AttributeValues.Add(new AttributeTextValue() { Name = SequentialNumberAttributeName, TextValue = sequentialNumber.ToString() });
                }
                else
                {
                    sequentialNumberReceiptTextAttribute.TextValue = sequentialNumber.ToString();
                }
            }

            /// <summary>
            /// Gets the data to sign.
            /// </summary>
            /// <param name="context">Request context.</param>
            /// <param name="salesTransaction">Transaction to sign.</param>
            /// <param name="sequentialNumber">Signed transaction sequential number.</param>
            /// <returns>Signed transaction data.</returns>
            private string GetDataToSign(RequestContext context, SalesTransaction salesTransaction, long sequentialNumber)
            {
                string prevSignature = this.GetPreviousTransactionSignature(salesTransaction);

                DateTimeOffset timeNow = context.GetNowInChannelTimeZone();

                string transactionDate = timeNow.ToString("yyyy-MM-dd");
                string transactionTime = timeNow.ToString("hh:mm:ss");

                IEnumerable<SalesLine> salesLinesForSigning = this.signingStrategy.GetSaleLinesForSigning(salesTransaction);
                string transactionAmntIn = salesLinesForSigning.Sum(line => line.TotalAmount).ToString("0.00", CultureInfo.InvariantCulture);
                string transactionAmntEx = salesLinesForSigning.Sum(line => line.TotalAmount - line.TaxAmount).ToString("0.00", CultureInfo.InvariantCulture);

                return string.Format("{0};{1};{2};{3};{4};{5}", prevSignature, transactionDate, transactionTime, sequentialNumber, transactionAmntIn, transactionAmntEx);
            }

            /// <summary>
            /// Get previous signature from sales transaction.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <returns>The previous signature.</returns>
            private string GetPreviousTransactionSignature(SalesTransaction salesTransaction)
            {
                var lastSignatureObject = salesTransaction.GetProperty(LastSignatureKeyId);

                if (lastSignatureObject != null && lastSignatureObject.GetType() == typeof(string))
                {
                    return (string)lastSignatureObject;
                }
                else
                {
                    var exceptionMessage = SalesTransactionSignatureLocalizer.Instance.Translate(this.cultureName, LastSalesTransactionMissingExceptionMessageResourceId);
                    throw new ArgumentException(exceptionMessage, "salesTransaction");
                }
            }

            /// <summary>
            /// Get previous sequential number from sales transaction.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <returns>The previous signature.</returns>
            private long GetPreviousSequentialNumber(SalesTransaction salesTransaction)
            {
                var lastSequentialNumberObject = salesTransaction.GetProperty(LastSequentialNumberKeyId);

                if (lastSequentialNumberObject != null && lastSequentialNumberObject.GetType() == typeof(long))
                {
                    return (long)lastSequentialNumberObject;
                }
                else
                {
                    var exceptionMessage = SalesTransactionSignatureLocalizer.Instance.Translate(this.cultureName, LastSalesTransactionMissingExceptionMessageResourceId);
                    throw new ArgumentException(exceptionMessage, "salesTransaction");
                }
            }

            /// <summary>
            /// Increment previous sequential number from signed sales transaction.
            /// </summary>
            /// <param name="previousSequentialNumber">The previous sequential number.</param>
            /// <returns>The next sequential number.</returns>
            private long IncrementSequentialNumber(long previousSequentialNumber)
            {
                return previousSequentialNumber + 1;
            }
        }
    }
}
