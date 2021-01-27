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
    namespace Commerce.Runtime.WarrantyAndReturnSample
    {
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// Class that implements triggers for the SearchJournalTransactionsServiceRequest request type.
        /// </summary>
        public class SearchJournalTransactionsServiceTriggers : IRequestTriggerAsync
        {
            private const string ReturnMaxDaysParameterName = "ReturnMaxDays";
            private const string ReturnRemainingDaysExtensionPropertyName = "ReturnRemainingDays";
            private const string ServiceChargePercentageParameterName = "ServiceChargePercentage";
            private const string ServiceChargeAmountExtensionPropertyName = "ServiceChargeAmount";

            /// <summary>
            /// Gets the supported requests for this trigger.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[] { typeof(SearchJournalTransactionsServiceRequest) };
                }
            }

            /// <summary>
            /// Pre trigger code.
            /// </summary>
            /// <param name="request">The request.</param>
            public async Task OnExecuting(Request request)
            {
                //it's only stub to handle async signature 
                await Task.CompletedTask;
            }

            /// <summary>
            /// Post trigger code.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <param name="response">The response.</param>
            public async Task OnExecuted(Request request, Response response)
            {
                ThrowIf.Null(request, "request");
                ThrowIf.Null(response, "response");

                PagedResult<Transaction> transactions = ((SearchJournalTransactionsServiceResponse)response).Transactions;
                if (transactions.IsNullOrEmpty())
                {
                    return;
                }

                var config = await this.GetConfigurationParametersAsync(request).ConfigureAwait(false);
                var returnMaxDays = config.Item1;
                var serviceChargePercentage = config.Item2;

                await this.AddExtensionPropertiesToTransactionsAsync(request, transactions, returnMaxDays, serviceChargePercentage).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets the known configuration parameters.
            /// </summary>
            /// <param name="request">The main request of the triggers.</param>
            /// <returns>
            /// Returns a tuple of the return maximum days and the service charge percentage from the configuration.
            /// </returns>
            private async Task<(int?, decimal?)> GetConfigurationParametersAsync(Request request)
            {
                int? returnMaxDays = null;
                decimal? serviceChargePercentage = null;

                var configurationRequest = new GetConfigurationParametersDataRequest(request.RequestContext.GetPrincipal().ChannelId);
                var configurationResponse = await request.RequestContext.ExecuteAsync<EntityDataServiceResponse<RetailConfigurationParameter>>(configurationRequest).ConfigureAwait(false);

                foreach (RetailConfigurationParameter configuration in configurationResponse)
                {
                    if (string.Equals(ReturnMaxDaysParameterName, configuration.Name, StringComparison.OrdinalIgnoreCase))
                    {
                        int intValue;
                        if (int.TryParse(configuration.Value, out intValue))
                        {
                            returnMaxDays = intValue;
                        }
                    }
                    else if (string.Equals(ServiceChargePercentageParameterName, configuration.Name, StringComparison.OrdinalIgnoreCase))
                    {
                        decimal decimalValue;
                        if (decimal.TryParse(configuration.Value, out decimalValue))
                        {
                            serviceChargePercentage = decimalValue;
                        }
                    }
                }

                return (returnMaxDays, serviceChargePercentage);
            }

            /// <summary>
            /// Adds the calculate values as extension properties to each transaction.
            /// </summary>
            /// <param name="request">The main request of the triggers.</param>
            /// <param name="transactions">The list of transactions that returned by the main request handler.</param>
            /// <param name="returnMaxDays">The configuration value for the return maximum days.</param>
            /// <param name="serviceChargePercentage">The configuration value for the service charge percentage.</param>
            private async Task AddExtensionPropertiesToTransactionsAsync(Request request, PagedResult<Transaction> transactions, int? returnMaxDays, decimal? serviceChargePercentage)
            {
                foreach (Transaction transaction in transactions)
                {
                    if (returnMaxDays != null)
                    {
                        // Calculate and append "return remaining days"
                        int transactionLifeInDays = (int)Math.Floor(DateTimeOffset.Now.Subtract(transaction.CreatedDateTime).TotalDays);
                        int remainingDays = Math.Max(0, (int)returnMaxDays - transactionLifeInDays);
                        transaction.SetProperty(ReturnRemainingDaysExtensionPropertyName, remainingDays);
                    }

                    if (serviceChargePercentage != null)
                    {
                        // Calculate and append "service charge amount"
                        decimal serviceChargeAmount = transaction.TotalAmount * (decimal)serviceChargePercentage / 100;
                        var roundingRequest = new GetRoundedValueServiceRequest(serviceChargeAmount, request.RequestContext.GetOrgUnit().Currency);
                        var roundingResponse = await request.RequestContext.ExecuteAsync<GetRoundedValueServiceResponse>(roundingRequest).ConfigureAwait(false);
                        if (roundingResponse != null)
                        {
                            transaction.SetProperty(ServiceChargeAmountExtensionPropertyName, roundingResponse.RoundedValue);
                        }
                    }
                }
            }
        }
    }
}