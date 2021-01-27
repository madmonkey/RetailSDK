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
    namespace Commerce.Runtime.SequentialSignatureRegister
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using Commerce.Runtime.DataModel;
        using Commerce.Runtime.SequentialSignatureRegister.Configuration;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts.Messages;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.Services.Messages;

        /// <summary>
        /// The extended service to sign sales transaction.
        /// </summary>
        public class SequentialSignatureRegisterService : IRequestHandlerAsync
        {
            private const string RetailFiscalTransactionViewName = "RETAILFISCALTRANSACTIONVIEW";

            private const string RetailFiscalTransactionViewSchemaName = "crt";

            // Parameter names
            private const string ChannelIdParamName = "@bi_ChannelId";
            private const string TerminalIdParamName = "@nvc_TerminalId";
            private const string StoreIdParamName = "@nvc_StoreId";
            private const string DataAreaIdParamName = "@nvc_DataAreaId";
            private const string SequenceTypeParamName = "@i_SequenceType";
            private const string FiscalRegistrationSequenceParamName = "@TVP_FISCALREGISTRATIONSEQUENCE";

            private const string GetFiscalRegitrationSequenceSprocName = "GETFISCALREGITRATIONSEQUENCE";
            private const string UpdateFiscalRegistrationSequenceSprocName = "UPDATEFISCALREGISTRATIONSEQUENCE";

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
                        typeof(PerformSequentialEventRegistrationServiceRequest),
                        typeof(UpdateSequentialSignatureServiceRequest),
                        typeof(GetLastSequentialSignatureDataRequest),
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
                    return await Task.FromResult(this.IsReady((SalesTransactionSignatureServiceIsReadyRequest)request)).ConfigureAwait(false);
                }
                else if (requestedType == typeof(GetLastFiscalTransactionRequest))
                {
                    return await this.GetLastFiscalTransactionAsync((GetLastFiscalTransactionRequest)request).ConfigureAwait(false);
                }
                else if (requestedType == typeof(PerformSequentialEventRegistrationServiceRequest))
                {
                    return await this.PerformSequentialEventRegistrationAsync((PerformSequentialEventRegistrationServiceRequest)request).ConfigureAwait(false);
                }
                else if (requestedType == typeof(UpdateSequentialSignatureServiceRequest))
                {
                    return await this.UpdateSequentialSignatureAsync((UpdateSequentialSignatureServiceRequest)request).ConfigureAwait(false);
                }
                else if (requestedType == typeof(GetLastSequentialSignatureDataRequest))
                {
                    return await this.GetLastSequentialSignatureAsync((GetLastSequentialSignatureDataRequest)request).ConfigureAwait(false);
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

            /// <summary>
            /// Performs sequential event registration, sign event and update event with signature.
            /// </summary>
            /// <param name="request">The service request to perform sequential event registration.</param>
            /// <returns>The null response.</returns>
            private async Task<Response> PerformSequentialEventRegistrationAsync(PerformSequentialEventRegistrationServiceRequest request)
            {
                var registrableEvent = request.RegistrableEvent;

                var dataToRegister = await registrableEvent.GetDataToRegisterAsync().ConfigureAwait(false);

                SequentialSignatureRegisterConfigSection configurationSection = SequentialSignatureRegisterConfiguration.GetInstance(request.RequestContext.LanguageId).SalesTransactionSignatureConfigSection;
                string certificateThumbprint = configurationSection.CertificateThumbprint;
                string certificateStoreName = configurationSection.CertificateStoreName;
                string certificateStoreLocation = configurationSection.CertificateStoreLocation;

                string encoding = request.Encoding;
                string hashAlgorithm = request.HashAlgorithm;

                CertificateSignatureServiceRequest signatureRequest;
                if (!string.IsNullOrEmpty(certificateStoreName) && !string.IsNullOrEmpty(certificateStoreLocation))
                {
                    signatureRequest = new CertificateSignatureServiceRequest(dataToRegister, encoding, hashAlgorithm, certificateThumbprint, certificateStoreName, certificateStoreLocation);
                }
                else
                {
                    signatureRequest = new CertificateSignatureServiceRequest(dataToRegister, encoding, hashAlgorithm, certificateThumbprint);
                }

                CertificateSignatureServiceResponse response = await request.RequestContext.ExecuteAsync<CertificateSignatureServiceResponse>(signatureRequest).ConfigureAwait(false);

                var signedData = new SequentialSignatureRegisterableData()
                {
                    Signature = response.Signature,
                    DataToSign = dataToRegister,
                    KeyThumbprint = certificateThumbprint,
                    SequentialNumber = request.RegistrableEvent.SequentialNumber
                };

                registrableEvent.UpdateWithRegisterResponse(signedData);

                return new NullResponse();
            }

            /// <summary>
            /// Updates RetailFiscalRegistrationSequence table with last sequential signature.
            /// </summary>
            /// <param name="request">The updating sequential signature request.</param>
            /// <returns>The null response.</returns>
            private async Task<Response> UpdateSequentialSignatureAsync(UpdateSequentialSignatureServiceRequest request)
            {
                ThrowIf.Null(request, "request");

                using (RetailFiscalRegistrationSequenceTableType reportTableType = new RetailFiscalRegistrationSequenceTableType(
                    request.SequentialSignatureData,
                    request.RegistrationSequenceType,
                    request.RequestContext.GetChannelConfiguration().InventLocationDataAreaId,
                    request.RequestContext.GetPrincipal().ChannelId,
                    request.StoreNumber,
                    request.TerminalId))
                {
                    int returnCode;
                    ParameterSet parameters = new ParameterSet();
                    parameters[FiscalRegistrationSequenceParamName] = reportTableType;
                    using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                    {
                        returnCode = await databaseContext.ExecuteStoredProcedureNonQueryAsync(UpdateFiscalRegistrationSequenceSprocName, parameters, resultSettings: null).ConfigureAwait(false);
                    }

                    if (returnCode != (int)DatabaseErrorCodes.Success)
                    {
                        throw new StorageException(
                            StorageErrors.Microsoft_Dynamics_Commerce_Runtime_CriticalStorageError,
                            returnCode,
                            string.Format("Unable to execute the stored procedure {0}.", UpdateFiscalRegistrationSequenceSprocName));
                    }
                }

                return new NullResponse();
            }

            /// <summary>
            /// Gets the last sequential signature for terminal by sequential type.
            /// </summary>
            /// <param name="request">The data request to get the sequential signature for terminal.</param>
            /// <returns>The last sequential signature for terminal.</returns>
            private async Task<Response> GetLastSequentialSignatureAsync(GetLastSequentialSignatureDataRequest request)
            {
                ThrowIf.Null(request, "request");

                SequentialSignatureData lastSequentialSignatureData;

                ParameterSet parameters = new ParameterSet();
                parameters[DataAreaIdParamName] = request.RequestContext.GetChannelConfiguration().InventLocationDataAreaId;
                parameters[ChannelIdParamName] = request.RequestContext.GetPrincipal().ChannelId;
                parameters[StoreIdParamName] = request.StoreNumber;
                parameters[TerminalIdParamName] = request.TerminalId;
                parameters[SequenceTypeParamName] = request.RegistrationSequenceType;

                using (DatabaseContext databaseContext = new DatabaseContext(request.RequestContext))
                {
                    var result = await databaseContext.ExecuteStoredProcedureAsync<SequentialSignatureData>(GetFiscalRegitrationSequenceSprocName, parameters, request.QueryResultSettings).ConfigureAwait(false);
                    lastSequentialSignatureData = result.Item2.SingleOrDefault();
                }

                return new GetLastSequentialSignatureDataResponse(lastSequentialSignatureData);
            }
        }
    }
}
