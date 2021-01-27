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
    namespace Commerce.Runtime.XZReportsFrance
    {
        using System;
        using System.Collections.Generic;
        using System.Collections.ObjectModel;
        using System.Linq;
        using System.Threading.Tasks;
        using System.Transactions;
        using Commerce.Runtime.CommonFrance;
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
            // Sprocs names set.
            private const string InsertSalesTransExtSprocName = "INSERTSALESTRANSEXT";

            // Sprocs variables set.
            private const string ChannelIdVariableName = "@bi_ChannelId";
            private const string TerminalIdVariableName = "@nvc_TerminalId";
            private const string TransactionIdVariableName = "@nvc_TransactionId";
            private const string SalesTransExtVariableName = "@TVP_SALESTRANSEXT";

            // Columns set.
            private const string LineNumColumn = "LINENUM";
            private const string SkipReportsColumn = "SKIPREPORTS";

            // Table type names set.
            private const string SalesTransExtTableTypeName = "RETAILTRANSACTIONSALESTRANSEXTTABLETYPE";

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
                using (var transactionScope = CreateReadCommittedTransactionScope())
                {
                    // Execute original logic.
                    var requestHandler = new Microsoft.Dynamics.Commerce.Runtime.DataServices.SqlServer.DataServices.SalesTransactionDataService();
                    response = request.RequestContext.Runtime.Execute<NullResponse>(request, request.RequestContext, requestHandler, false);

                    // Extension logic.
                    if (request.RequestContext.GetChannelConfiguration().CountryRegionISOCode == CountryRegionISOCode.FR)
                    {
                        response = await SaveSalesTransactionExtAsync(request).ConfigureAwait(false);
                    }

                    transactionScope.Complete();
                }

                return response;
            }

            /// <summary>
            /// Creates the transaction scope with ReadCommitted isolation.
            /// </summary>
            /// <returns>The transaction scope.</returns>
            private static TransactionScope CreateReadCommittedTransactionScope()
            {
                var options = new TransactionOptions()
                {
                    IsolationLevel = IsolationLevel.ReadCommitted
                };

                return new TransactionScope(TransactionScopeOption.Required, options, TransactionScopeAsyncFlowOption.Enabled);
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

                return new NullResponse();
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

                var dataAreaId = context.GetChannelConfiguration().InventLocationDataAreaId;
                var strategy = new SalesTransactionRegistrationStrategy(context);
                var salesLines = strategy.GetSaleLines(salesTransaction);

                Collection<SalesLineExt> salesLinesExt = new Collection<SalesLineExt>();
                var salesLinesToSkip = salesTransaction.SalesLines.Except(salesLines);

                foreach (SalesLine salesLine in salesLinesToSkip)
                {
                    SalesLineExt salesLineExt = new SalesLineExt
                    {
                        DataAreaId = dataAreaId,
                        StoreId = salesTransaction.StoreId,
                        TerminalId = salesTransaction.TerminalId,
                        TransactionId = salesTransaction.Id,
                        LineNumber = salesLine.LineNumber,
                        SkipReports = true
                    };

                    salesLinesExt.Add(salesLineExt);
                }

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

                var dataAreaId = context.GetChannelConfiguration().InventLocationDataAreaId;
                var totalAdjustmentAmount = CalculateTotalAdjustmentAmount(salesTransaction, context);

                if (totalAdjustmentAmount == decimal.Zero)
                {
                    return;
                }

                Collection<TenderLineExt> tenderLinesExt = new Collection<TenderLineExt>();
                IEnumerable<TenderLine> activeTenderLines = salesTransaction.TenderLines
                    .Where(tenderLine => (!tenderLine.IsHistorical && !tenderLine.IsChangeLine && !tenderLine.IsVoided))
                    .OrderByDescending(l => Math.Abs(l.Amount));

                foreach (TenderLine tenderLine in activeTenderLines)
                {
                    if (totalAdjustmentAmount != decimal.Zero)
                    {
                        decimal tenderLineAdjustment = decimal.Zero;

                        if (Math.Abs(tenderLine.Amount) >= Math.Abs(totalAdjustmentAmount))
                        {
                            tenderLineAdjustment = -totalAdjustmentAmount;
                            totalAdjustmentAmount = decimal.Zero;
                        }
                        else
                        {
                            tenderLineAdjustment = -tenderLine.Amount;
                            totalAdjustmentAmount -= tenderLine.Amount;
                        }

                        TenderLineExt tenderLineExt = new TenderLineExt();
                        tenderLineExt.DataAreaId = dataAreaId;
                        tenderLineExt.StoreId = salesTransaction.StoreId;
                        tenderLineExt.TerminalId = salesTransaction.TerminalId;
                        tenderLineExt.TransactionId = salesTransaction.Id;
                        tenderLineExt.LineNumber = tenderLine.LineNumber;
                        tenderLineExt.AmountInChannelCurrencyAdjustment = tenderLineAdjustment;

                        tenderLinesExt.Add(tenderLineExt);
                    }
                }

                var insertRequest = new InsertTenderLineExtTableDataRequest(tenderLinesExt);
                await context.Runtime.ExecuteAsync<NullResponse>(insertRequest, context).ConfigureAwait(false);
            }

            /// <summary>
            /// Calculates the total adjustment amount.
            /// </summary>
            /// <param name="salesTransaction">The sales transaction.</param>
            /// <param name="context">The request context.</param>
            /// <returns>The total adjustment amount.</returns>
            private static decimal CalculateTotalAdjustmentAmount(SalesTransaction salesTransaction, RequestContext context)
            {
                decimal totalAdjustmentAmount = decimal.Zero;
                var strategy = new SalesTransactionRegistrationStrategy(context);
                var salesLines = strategy.GetSaleLines(salesTransaction);

                switch (salesTransaction.CartType)
                {
                    case CartType.Shopping:
                        var skippedLines = salesTransaction.ActiveSalesLines.Except(salesLines);
                        totalAdjustmentAmount = skippedLines.Sum(l => l.TotalAmount);

                        break;

                    case CartType.CustomerOrder:
                        if (IsPrepaymentSupported(salesTransaction))
                        {
                            var carryoutLinesTotalAmount = salesLines.Sum(l => l.TotalAmount);
                            decimal requiredDepositAmount = salesTransaction.RequiredDepositAmount;
                            decimal prepaymentAmountPaid = salesTransaction.PrepaymentAmountPaid;
                            decimal cancellationCharge = salesTransaction.CancellationCharge ?? decimal.Zero;
                            totalAdjustmentAmount = requiredDepositAmount - prepaymentAmountPaid + cancellationCharge - carryoutLinesTotalAmount;
                        }

                        break;
                }

                return totalAdjustmentAmount;
            }

            /// <summary>
            /// Checks if the sales transaction supports prepayment operations.
            /// </summary>
            /// <param name="transaction">The sales transaction.</param>
            /// <returns>True if prepayment operations is supported; otherwise, false.</returns>
            private static bool IsPrepaymentSupported(SalesTransaction transaction)
            {
                return transaction.CustomerOrderMode == CustomerOrderMode.CustomerOrderCreateOrEdit ||
                       transaction.CustomerOrderMode == CustomerOrderMode.Cancellation;
            }
        }
    }
}
