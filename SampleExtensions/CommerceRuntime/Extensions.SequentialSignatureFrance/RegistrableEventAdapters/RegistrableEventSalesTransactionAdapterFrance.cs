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
    namespace Commerce.Runtime.SequentialSignatureFrance
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using System.Web;
        using Commerce.Runtime.CommonFrance;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using SequentialSignatureData = Commerce.Runtime.DataModel.SequentialSignatureData;

        /// <summary>
        /// France-specific registration adapter for <c>SalesTransaction</c>.
        /// </summary>
        public class RegistrableEventSalesTransactionAdapterFrance : RegistrableEventSalesTransactionAdapter
        {
            private ISalesTransactionRegistrationStrategy RegistrationStrategy;
            private DateTimeOffset RegistrationTime;

            /// <summary>
            /// Initializes a new instance of the <see cref="RegistrableEventSalesTransactionAdapterFrance" /> class.
            /// </summary>
            /// <param name="transaction">The sales transaction to register.</param>
            /// <param name="requestContext">The request context.</param>
            /// <param name="registrationTime">The registration time. Optional.</param>
            public RegistrableEventSalesTransactionAdapterFrance(SalesTransaction transaction, RequestContext requestContext, DateTimeOffset? registrationTime = null)
                : base(transaction, requestContext)
            {
                this.RegistrationStrategy = new SalesTransactionRegistrationStrategy(requestContext);
                this.RegistrationTime = registrationTime ?? requestContext.GetNowInChannelTimeZone();
            }

            /// <summary>
            /// Determines whether registration of event is required.
            /// </summary>
            /// <returns>True if event should be registered; False otherwise.</returns>
            public override bool IsRegistrationRequired()
            {
                return this.RegistrationStrategy.IsRegistrationRequired(this.SalesTransaction);
            }

            /// <summary>
            /// Gets string representation of data to register.
            /// </summary>
            /// <returns>String representation of data to register.</returns>
            public override async Task<string> GetDataToRegisterAsync()
            {
                List<string> dataToRegisterFields = new List<string>();

                string terminalId = this.RequestContext.GetTerminalId();
                long sequentialNumber = this.SequentialNumber;
                string lastRegisterResponse = this.GetPreviousTransactionSignature(this.SalesTransaction);
                IEnumerable<SalesLine> salesLines = this.RegistrationStrategy.GetSaleLines(this.SalesTransaction);
                int salesLineCount = await this.GetAggregatedSalesLineCountAsync(this.SalesTransaction).ConfigureAwait(false);

                var formatter = new FiscalDataToRegisterFormatter(this.RequestContext);
                dataToRegisterFields.Add(await formatter.GetFormattedTotalSalesAmountsByTaxRateAsync(salesLines).ConfigureAwait(false));
                dataToRegisterFields.Add(await formatter.GetFormattedTotalSalesAmountAsync(salesLines).ConfigureAwait(false));
                dataToRegisterFields.Add(formatter.GetFormattedDateTime(this.RegistrationTime));
                dataToRegisterFields.Add(terminalId);
                dataToRegisterFields.Add(formatter.GetFormattedSequentialNumber(sequentialNumber));
                dataToRegisterFields.Add(formatter.GetFormattedTransactionType(this.SalesTransaction.ExtensibleSalesTransactionType));
                dataToRegisterFields.Add(FiscalDataToRegisterFormatter.GetFormattedPostponement(sequentialNumber));
                dataToRegisterFields.Add(lastRegisterResponse);
                dataToRegisterFields.Add(formatter.GetFormattedSalesLineCount(salesLineCount));

                return formatter.GetFormattedDataToRegister(dataToRegisterFields);
            }

            /// <summary>
            /// Updates the event with fiscal register response string.
            /// </summary>
            /// <param name="sequentialSignatureRegisterableData">Sequential signature data to be serialized.</param>
            public override void UpdateWithRegisterResponse(SequentialSignatureRegisterableData sequentialSignatureRegisterableData)
            {
                ThrowIf.Null(sequentialSignatureRegisterableData, "sequentialSignatureRegisterableData");

                var sequentialSignatureDataFrance = new SequentialSignatureDataFrance()
                {
                    Signature = FiscalDataToRegisterFormatter.ConvertBase64ToBase64Url(sequentialSignatureRegisterableData.Signature),
                    DataToSign = sequentialSignatureRegisterableData.DataToSign,
                    KeyThumbprint = sequentialSignatureRegisterableData.KeyThumbprint,
                    SequentialNumber = sequentialSignatureRegisterableData.SequentialNumber,
                    BuildNumber = this.RegistrationStrategy.GetBuildNumber(this.SalesTransaction)
                };

                base.UpdateWithRegisterResponse(sequentialSignatureDataFrance);
            }

            /// <summary>
            /// Persists register response after successful registration.
            /// </summary>
            public override async Task PersistRegisterResponseAsync()
            {
                var registerResponseFiscalTransaction = this.SalesTransaction.FiscalTransactions
                    .OrderByDescending(item => item.LineNumber)
                    .FirstOrDefault(item => !string.IsNullOrWhiteSpace(item.RegisterResponse) && !item.ReceiptCopy);

                if (registerResponseFiscalTransaction != null)
                {
                    var registeredSequentialSignatureData = SerializationHelper.DeserializeSequentialSignatureDataFromJson<SequentialSignatureRegisterableData>(registerResponseFiscalTransaction.RegisterResponse);
                    var sequentialSignature = new SequentialSignatureData()
                    {
                        Signature = registeredSequentialSignatureData.Signature,
                        SequentialNumber = registeredSequentialSignatureData.SequentialNumber
                    };

                    var updateSequentialSignatureServiceRequest = new UpdateSequentialSignatureServiceRequest(sequentialSignature, this.SalesTransaction.StoreId, this.SalesTransaction.TerminalId, (int)this.SequenceType);
                    await this.RequestContext.ExecuteAsync<NullResponse>(updateSequentialSignatureServiceRequest).ConfigureAwait(false);
                }
            }

            /// <summary>
            /// Gets active aggregated sales lines count.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <returns>Count of active aggregated sales lines.</returns>
            private async Task<int> GetAggregatedSalesLineCountAsync(SalesTransaction salesTransaction)
            {
                var request = new AggregateSalesLinesCollectionRequest(salesTransaction.SalesLines);
                var response = await this.RequestContext.ExecuteAsync<AggregateSalesLinesCollectionResponse>(request).ConfigureAwait(false);
                return response.SalesLines.Count(x => !x.IsVoided);
            }
        }
    }
}
