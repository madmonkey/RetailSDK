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
        using System.Linq;
        using System.Threading.Tasks;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// The extended service to sign sales transaction.
        /// </summary>
        public class SalesTransactionSignatureService : IRequestHandlerAsync
        {
            private const string RetailFiscalTransactionViewName = "RETAILFISCALTRANSACTIONVIEW";

            private const string RetailFiscalTransactionViewSchemaName = "crt";

            /// <summary>
            /// Gets the supported request types.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(SalesTransactionSignatureServiceIsReadyRequest),
                        typeof(GetLastFiscalTransactionRequest),
                    };
                }
            }

            /// <summary>
            /// Executes the requests.
            /// </summary>
            /// <param name="request">The request parameter.</param>
            /// <returns>The <c>SalesTransactionSignatureServiceIsReadyResponse</c>.</returns>
            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");

                Type requestedType = request.GetType();

                if (requestedType == typeof(SalesTransactionSignatureServiceIsReadyRequest))
                {
                    return await Task.FromResult(this.IsReady((SalesTransactionSignatureServiceIsReadyRequest)request));
                }
                else if (requestedType == typeof(GetLastFiscalTransactionRequest))
                {
                    return await this.GetLastFiscalTransactionAsync((GetLastFiscalTransactionRequest)request).ConfigureAwait(false);
                }

                throw new NotSupportedException(string.Format("Request '{0}' is not supported.", request.GetType()));
            }

            /// <summary>
            /// Checks the sales transaction signature service readiness.
            /// </summary>
            /// <param name="request">The service request to get service readiness status.</param>
            /// <returns>The service readiness status.</returns>
            private Response IsReady(SalesTransactionSignatureServiceIsReadyRequest request)
            {
                ThrowIf.Null(request, "request");

                return new SalesTransactionSignatureServiceIsReadyResponse(true);
            }

            /// <summary>
            /// Get the last fiscal transaction for terminal.
            /// </summary>
            /// <param name="request">The service request to get the last fiscal transaction for terminal.</param>
            /// <returns>The last fiscal transaction for terminal.</returns>
            private async Task<Response> GetLastFiscalTransactionAsync(GetLastFiscalTransactionRequest request)
            {
                ThrowIf.Null(request, "request");

                FiscalTransaction lastFiscalTransaction;
                RequestContext context = request.RequestContext;
                var pagingInfo = new PagingInfo(top: 1);
                var sortingInfo = new SortingInfo(RetailTransactionTableSchema.CreatedDateTimeColumn, isDescending: true);
                var queryResultSettings = new QueryResultSettings(pagingInfo, sortingInfo);

                using (DatabaseContext databaseContext = new DatabaseContext(context))
                {
                    var query = new SqlPagedQuery(queryResultSettings)
                    {
                        DatabaseSchema = RetailFiscalTransactionViewSchemaName,
                        From = RetailFiscalTransactionViewName
                    };

                    var whereClauses = new List<string>();

                    whereClauses.Add(string.Format("{0} = @{0}", RetailTransactionTableSchema.StoreColumn));
                    query.Parameters["@" + RetailTransactionTableSchema.StoreColumn] = request.StoreNumber;

                    whereClauses.Add(string.Format("{0} = @{0}", RetailTransactionTableSchema.TerminalColumn));
                    query.Parameters["@" + RetailTransactionTableSchema.TerminalColumn] = request.TerminalId;

                    if (whereClauses.Count != 0)
                    {
                        query.Where = string.Join(" AND ", whereClauses);
                    }

                    PagedResult<FiscalTransaction> pagedResult = await databaseContext.ReadEntityAsync<FiscalTransaction>(query).ConfigureAwait(false);
                    lastFiscalTransaction = pagedResult.FirstOrDefault();
                }

                return new GetLastFiscalTransactionResponse(lastFiscalTransaction);
            }
        }
    }
}
