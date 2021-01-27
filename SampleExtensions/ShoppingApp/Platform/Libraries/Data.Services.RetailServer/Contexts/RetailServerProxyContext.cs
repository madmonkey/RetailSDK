/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client.Data.Services.RetailServer
{
    using Entities;
    using Services.Authentication;
    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using System.Threading.Tasks;
    using System.IO;

    /// <summary>
    /// Interface to commerce context.
    /// </summary>
    public class RetailServerProxyContext : IContext
    {
        IContext serverContext;
        ServiceOperationDecorator operationHandler;

        public RetailServerProxyContext(IContext serverContext, ServiceOperationDecorator operationHandler)
        {
            this.serverContext = serverContext;
            this.operationHandler = operationHandler;
        }

        public string Locale
        {
            get
            {
                return serverContext.Locale;
            }

            set
            {
                serverContext.Locale = value;
            }
        }

        public Task ExecuteAuthenticationOperationAsync(string operation, params OperationParameter[] operationParameters)
        {
            return operationHandler.ExecuteAsync(() =>
            {
                return serverContext.ExecuteAuthenticationOperationAsync(operation, operationParameters);
            });
        }

        public Task<T> ExecuteAuthenticationOperationSingleResultAsync<T>(string operation, params OperationParameter[] operationParameters)
        {
            return operationHandler.ExecuteAsync<T>(() =>
            {
                return serverContext.ExecuteAuthenticationOperationSingleResultAsync<T>(operation, operationParameters);
            });
        }

        public Task ExecuteOperationAsync(string entitySet, string entitySetTypeName, string operation, bool isAction, params OperationParameter[] operationParameters)
        {
            return operationHandler.ExecuteAsync(() =>
            {
                return serverContext.ExecuteOperationAsync(entitySet, entitySetTypeName, operation, isAction, operationParameters);
            });
        }

        public Task<PagedResult<T>> ExecuteOperationAsync<T>(string entitySet, string entitySetTypeName, string operation, bool isAction, QueryResultSettings queryResultSettings, ICollection<string> expandProperties, params OperationParameter[] operationParameters)
        {
            return operationHandler.ExecuteAsync(() =>
            {
                return serverContext.ExecuteOperationAsync<T>(entitySet, entitySetTypeName, operation, isAction, queryResultSettings, expandProperties, operationParameters);
            });
        }

        public Task<T> ExecuteOperationSingleResultAsync<T>(string entitySet, string entitySetTypeName, string operation, bool isAction, ICollection<string> expandProperties, params OperationParameter[] operationParameters)
        {
            return operationHandler.ExecuteAsync(() =>
            {
                return serverContext.ExecuteOperationSingleResultAsync<T>(entitySet, entitySetTypeName, operation, isAction, expandProperties, operationParameters);
            });
        }

        public string GetDeviceToken()
        {
            return serverContext.GetDeviceToken();
        }

        public string GetOperatingUnitNumber()
        {
            return serverContext.GetOperatingUnitNumber();
        }

        public UserToken GetUserToken()
        {
            return serverContext.GetUserToken();
        }

        public void SetAppSessionId(Guid appSessionId)
        {
            serverContext.SetAppSessionId(appSessionId);
        }

        public void SetDeviceToken(string deviceToken)
        {
            serverContext.SetDeviceToken(deviceToken);
        }

        public void SetOperatingUnitNumber(string operatingUnitNumber)
        {
            serverContext.SetOperatingUnitNumber(operatingUnitNumber);
        }

        public void SetUserSessionId(Guid userSessionId)
        {
            serverContext.SetAppSessionId(userSessionId);
        }

        public void SetUserToken(UserToken userToken)
        {
            serverContext.SetUserToken(userToken);
        }

        Task<T> IContext.Create<T>(string entitySet, T entity)
        {
            return operationHandler.ExecuteAsync(() =>
            {
                return serverContext.Create(entitySet, entity);
            });
        }

        Task IContext.Delete<T>(string entitySet, T entity)
        {
            return operationHandler.ExecuteAsync(() =>
            {
                return serverContext.Delete(entitySet, entity);
            });
        }

        Task<T> IContext.Read<T>(string entitySet, Expression<Func<T, bool>> predicate, ICollection<string> expandProperties, params OperationParameter[] operationParameters)
        {
            return operationHandler.ExecuteAsync(() =>
            {
                return serverContext.Read(entitySet, predicate, expandProperties, operationParameters);
            });
        }

        Task<PagedResult<T>> IContext.ReadAll<T>(string entitySet, ICollection<string> expandProperties, QueryResultSettings queryResultSettings)
        {
            return operationHandler.ExecuteAsync(() =>
            {
                return serverContext.ReadAll<T>(entitySet, expandProperties, queryResultSettings);
            });
        }

        Task<T> IContext.Update<T>(string entitySet, T entity)
        {
            return operationHandler.ExecuteAsync(() =>
            {
                return serverContext.Update(entitySet, entity);
            });
        }

        public Task<Stream> ReadStream<T>(string entitySet, Expression<Func<T, bool>> predicate, params OperationParameter[] operationParameters) where T : ICommerceEntity
        {
            return serverContext.ReadStream<T>(entitySet, predicate, operationParameters);
        }

        public void BeginBatch()
        {
            serverContext.BeginBatch();
        }

        public Task ExecuteBatchAsync()
        {
            return serverContext.ExecuteBatchAsync();
        }

        public Task ExecuteBatchAsync(List<ParametersGroup> requests, List<TaskCompletionSource<object>> tasks)
        {
            return serverContext.ExecuteBatchAsync(requests, tasks);
        }

        public T GetSingleEntity<T>(Task<object> task)
        {
            return serverContext.GetSingleEntity<T>(task);
        }

        public PagedResult<T> GetPagedResult<T>(Task<object> task)
        {
            return serverContext.GetPagedResult<T>(task);
        }
    }
}
