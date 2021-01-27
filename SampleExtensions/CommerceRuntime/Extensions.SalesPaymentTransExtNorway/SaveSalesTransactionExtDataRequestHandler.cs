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
    namespace Commerce.Runtime.SalesTransactionSignatureNorway
    {
        using System;
        using System.Collections.Generic;
        using System.Collections.ObjectModel;
        using System.Linq;
        using System.Threading.Tasks;
        using System.Transactions;
        using Commerce.Runtime.SalesPaymentTransExt.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using SalesLineExt = Commerce.Runtime.DataModel.SalesLineExt;
        using TenderLineExt = Commerce.Runtime.DataModel.TenderLineExt;

        /// <summary>
        /// The data request handler for sales transaction extension.
        /// </summary>
        public sealed class SaveSalesTransactionExtDataRequestHandler : SingleAsyncRequestHandler<SaveSalesTransactionDataRequest>
        {
            private const string ChannelIdVariableName = "@bi_ChannelId";
            private const string TerminalIdVariableName = "@nvc_TerminalId";
            private const string TransactionIdVariableName = "@nvc_TransactionId";

            private const string IncrementGrandTotalsNorwaySprocName = "INCREMENTGRANDTOTALSNORWAY";

            /// <summary>
            /// Executes the workflow to save sales transaction extension.
            /// </summary>
            /// <param name="request">The request.</param>
            /// <returns>The response.</returns>
            protected override async Task<Response> Process(SaveSalesTransactionDataRequest request)
            {
                ThrowIf.Null(request, "request");

                NullResponse response;

                using (var databaseContext = new DatabaseContext(request.RequestContext))
                using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    // Execute original logic.
                    var requestHandler = new Microsoft.Dynamics.Commerce.Runtime.DataServices.SqlServer.DataServices.SalesTransactionDataService();
                    response = request.RequestContext.Runtime.Execute<NullResponse>(request, request.RequestContext, requestHandler, false);

                    // Extension logic.
                    if (request.RequestContext.GetChannelConfiguration().CountryRegionISOCode == CountryRegionISOCode.NO)
                    {
                        response = await SaveSalesTransactionExtAsync(request).ConfigureAwait(false);
                    }

                    transactionScope.Complete();
                }

                return response;
            }

            /// <summary>
            /// Saves the sales transaction extensions.
            /// </summary>
            /// <param name="request">The data request.</param>
            /// <returns>The response.</returns>
            private static async Task<NullResponse> SaveSalesTransactionExtAsync(SaveSalesTransactionDataRequest request)
            {
                ThrowIf.Null(request, "request");

                await InsertSalesLinesExtAsync(request.SalesTransaction, request.RequestContext).ConfigureAwait(false);
                await InsertTenderLinesExtAsync(request.SalesTransaction, request.RequestContext).ConfigureAwait(false);

                await IncrementGrandTotalsAsync(request.SalesTransaction, request).ConfigureAwait(false);

                return new NullResponse();
            }

            /// <summary>
            /// Increments grand totals counters.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="request">The request.</param>
            private static async Task IncrementGrandTotalsAsync(SalesTransaction salesTransaction, Request request)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");
                ThrowIf.Null(request, "context");
                ThrowIf.Null(request.RequestContext, "requestContext");

                ParameterSet parameters = new ParameterSet();
                parameters[ChannelIdVariableName] = request.RequestContext.GetPrincipal().ChannelId;
                parameters[TerminalIdVariableName] = salesTransaction.TerminalId;
                parameters[TransactionIdVariableName] = salesTransaction.Id;

                using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                {
                    int errorCode = await databaseContext.ExecuteStoredProcedureScalarAsync(IncrementGrandTotalsNorwaySprocName, parameters, request.QueryResultSettings).ConfigureAwait(false);

                    if (errorCode != (int)DatabaseErrorCodes.Success)
                    {
                        throw new StorageException(StorageErrors.Microsoft_Dynamics_Commerce_Runtime_CriticalStorageError, errorCode);
                    }
                }
            }

            /// <summary>
            /// Inserts sales lines extensions.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="context">The request context.</param>
            private static async Task InsertSalesLinesExtAsync(SalesTransaction salesTransaction, RequestContext context)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");
                ThrowIf.Null(context, "context");

                IEnumerable<SalesLineExt> salesLinesExt = GetSalesLinesExt(salesTransaction, context.GetChannelConfiguration().InventLocationDataAreaId);

                var insertRequest = new InsertSalesLineExtTableDataRequest(salesLinesExt);
                await context.Runtime.ExecuteAsync<NullResponse>(insertRequest, context).ConfigureAwait(false);
            }

            /// <summary>
            /// Inserts tender lines extensions.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="context">The request context.</param>
            private static async Task InsertTenderLinesExtAsync(SalesTransaction salesTransaction, RequestContext context)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");
                ThrowIf.Null(context, "context");

                IEnumerable<TenderLineExt> tenderLinesExt = GetTenderLinesExt(salesTransaction, context.GetChannelConfiguration().InventLocationDataAreaId);

                var insertRequest = new InsertTenderLineExtTableDataRequest(tenderLinesExt);
                await context.Runtime.ExecuteAsync<NullResponse>(insertRequest, context).ConfigureAwait(false);
            }

            /// <summary>
            /// Gets the sales lines extension collection.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="dataAreaId">The data area id.</param>
            /// <returns>The sales lines extension collection.</returns>
            private static IEnumerable<SalesLineExt> GetSalesLinesExt(SalesTransaction salesTransaction, string dataAreaId)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");

                Collection<SalesLineExt> salesLinesExt = new Collection<SalesLineExt>();

                foreach (SalesLine salesLine in salesTransaction.SalesLines)
                {
                    AttributeTextValue skipReportAttribute = salesLine.AttributeValues.SingleOrDefault(attribute => string.Equals(attribute.Name, SalesTransactionExtManager.SkipReportsAttributeName, StringComparison.OrdinalIgnoreCase)) as AttributeTextValue;

                    if (skipReportAttribute != null && string.Equals(skipReportAttribute.TextValue, SalesTransactionExtManager.SkipReportsAttributeYesValue, StringComparison.OrdinalIgnoreCase))
                    {
                        SalesLineExt salesLineExt = new SalesLineExt();
                        salesLineExt.DataAreaId = dataAreaId;
                        salesLineExt.StoreId = salesTransaction.StoreId;
                        salesLineExt.TerminalId = salesTransaction.TerminalId;
                        salesLineExt.TransactionId = salesTransaction.Id;
                        salesLineExt.LineNumber = salesLine.LineNumber;
                        salesLineExt.SkipReports = true;

                        salesLinesExt.Add(salesLineExt);
                    }
                }

                return salesLinesExt;
            }

            /// <summary>
            /// Gets the tender lines extension collection.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="dataAreaId">The data area id.</param>
            /// <returns>The tender lines extension collection.</returns>
            private static IEnumerable<TenderLineExt> GetTenderLinesExt(SalesTransaction salesTransaction, string dataAreaId)
            {
                ThrowIf.Null(salesTransaction, "salesTransaction");

                Collection<TenderLineExt> tenderLinesExt = new Collection<TenderLineExt>();

                IEnumerable<TenderLine> nonHistoricalTenderLines = salesTransaction.TenderLines.Where(l => !l.IsHistorical);

                foreach (TenderLine tenderLine in nonHistoricalTenderLines)
                {
                    decimal adjustmentAmount = Convert.ToDecimal(tenderLine.GetProperty(SalesTransactionExtManager.AmountInChannelCurrencyAdjustmentPropName));

                    if (adjustmentAmount != decimal.Zero)
                    {
                        TenderLineExt tenderLineExt = new TenderLineExt();
                        tenderLineExt.DataAreaId = dataAreaId;
                        tenderLineExt.StoreId = salesTransaction.StoreId;
                        tenderLineExt.TerminalId = salesTransaction.TerminalId;
                        tenderLineExt.TransactionId = salesTransaction.Id;
                        tenderLineExt.LineNumber = tenderLine.LineNumber;
                        tenderLineExt.AmountInChannelCurrencyAdjustment = adjustmentAmount;

                        tenderLinesExt.Add(tenderLineExt);
                    }
                }

                return tenderLinesExt;
            }
        }
    }
}
