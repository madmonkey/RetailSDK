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
    namespace Commerce.Runtime.SalesPaymentTransExt
    {
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Commerce.Runtime.SalesPaymentTransExt.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// The data request handler for sales transaction extension in SQLServer.
        /// </summary>
        public sealed class SalesTransactionExtSqlServerDataService : IRequestHandlerAsync
        {
            private const string SalesTransactionExtSourceTablePrm = "@tvp_SalesTransExt";
            private const string PaymentTransactionExtSourceTablePrm = "@tvp_PaymentTransExt";

            private const string InsertSalesTransactionExtSpProcName = "INSERTSALESTRANSEXT";
            private const string InsertPaymentTransactionExtSpProcName = "INSERTPAYMENTTRANSEXT";

            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(InsertSalesLineExtTableDataRequest),
                        typeof(InsertTenderLineExtTableDataRequest)
                    };
                }
            }

            /// <summary>
            /// Gets the sales transaction extension to be saved.
            /// </summary>
            /// <param name="request">The request message.</param>
            /// <returns>The response message.</returns>
            public async Task<Response> Execute(Request request)
            {
                ThrowIf.Null(request, "request");

                if (request is InsertSalesLineExtTableDataRequest insSalesTransactionExtRequest)
                {
                    using (SalesLineExtTableType salesLineExtTable = new SalesLineExtTableType(insSalesTransactionExtRequest.SalesLinesExt))
                    {
                        return await InsertExtTableAsync(insSalesTransactionExtRequest, salesLineExtTable.DataTable, SalesTransactionExtSourceTablePrm, InsertSalesTransactionExtSpProcName).ConfigureAwait(false);
                    }
                }
                else if (request is InsertTenderLineExtTableDataRequest insPaymentTransactionExtRequest)
                {
                    using (TenderLineExtTableType tenderLineExtTable = new TenderLineExtTableType(insPaymentTransactionExtRequest.TenderLinesExt))
                    {
                        return await InsertExtTableAsync(insPaymentTransactionExtRequest, tenderLineExtTable.DataTable, PaymentTransactionExtSourceTablePrm, InsertPaymentTransactionExtSpProcName).ConfigureAwait(false);
                    }
                }

                return new NullResponse();
            }

            /// <summary>
            /// Inserts the extension table.
            /// </summary>
            /// <param name="request">The data request.</param>
            /// <param name="sourceTable">The source table.</param>
            /// <param name="sourceTableNamePrm">The source table parameter name.</param>
            /// <param name="insertProcName">The stored procedure to perform insertion.</param>
            /// <returns>The response.</returns>
            private static async Task<NullResponse> InsertExtTableAsync(Request request, DataTable sourceTable, string sourceTableNamePrm, string insertProcName)
            {
                ThrowIf.Null(request, "request");
                ThrowIf.Null(sourceTable, "sourceTable");

                if (sourceTable.Rows.Count > 0)
                {
                    ParameterSet parameters = new ParameterSet();
                    parameters[DatabaseAccessor.ChannelIdVariableName] = request.RequestContext.GetPrincipal().ChannelId;
                    parameters[sourceTableNamePrm] = sourceTable;

                    int errorCode;

                    using (var databaseContext = new DatabaseContext(request.RequestContext))
                    {
                        errorCode = await databaseContext.ExecuteStoredProcedureNonQueryAsync(insertProcName, parameters, resultSettings: null).ConfigureAwait(false);
                    }

                    if (errorCode != (int)DatabaseErrorCodes.Success)
                    {
                        throw new StorageException(StorageErrors.Microsoft_Dynamics_Commerce_Runtime_CriticalStorageError, errorCode);
                    }
                }

                return new NullResponse();
            }
        }
    }
}