/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Entities;
using Microsoft.OData.Client;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.Data.Services.RetailServer
{
    public class ServiceOperationDecorator
    {
        public async Task ExecuteAsync(Func<Task> serviceOperation)
        {
            try
            {
                await serviceOperation();
            }
            // TODO: catch specific exceptions, not System.Exception
            catch (Exception e)
            {
                // TODO: log
                throw ToDataServiceException(e);
            }
        }

        public async Task<T> ExecuteAsync<T>(Func<Task<T>> serviceOperation)
        {
            try
            {
                return await serviceOperation();
            }
            // TODO: catch specific exceptions, not System.Exception
            catch (Exception e)
            {
                // TODO: log
                throw ToDataServiceException(e);
            }
        }

        public async Task<PagedResult<T>> ExecuteAsync<T>(Func<Task<PagedResult<T>>> serviceOperation)
        {
            try
            {
                return await serviceOperation();
            }
            // TODO: catch specific exceptions, not System.Exception
            catch (Exception e)
            {
                // TODO: log
                throw ToDataServiceException(e);
            }
        }

        private DataServiceException ToDataServiceException(Exception e)
        {
            return new DataServiceException(e, GetHttpStatusCode(e));
        }

        private HttpStatusCode? GetHttpStatusCode(Exception e)
        {
            for (Exception innerException = e.InnerException; innerException != null; innerException = innerException.InnerException)
            {
                if (innerException is WebException)
                {
                    return ((innerException as WebException)?.Response as HttpWebResponse)?.StatusCode;
                }

                if (innerException is DataServiceQueryException)
                {
                    return (HttpStatusCode)(innerException as DataServiceQueryException)?.Response?.StatusCode;
                }
            }

            return null;
        }
    }
}
