/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Entities;
using Contoso.Commerce.Client.Data.Services;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Authentication;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities;
using Plugin.Toasts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Services
{
    public class CustomerService : ServiceBase
    {
        public CustomerService(DataService dataService) : base(dataService)
        {
        }

        public async Task<Customer> GetCustomer()
        {
            var customerManager = DataService.ManagerFactory.GetManager<ICustomerManager>();
            return await customerManager.Read(string.Empty);
        }

        /// <summary>
        /// Gets the order history for the logged in customer.
        /// </summary>
        /// <param name="accountNumber">The customer's accout number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="skipCount">The number of items to skip.</param>
        /// <returns>A <c>Task</c> of a collection of <c>Order</c> objects.</returns>
        public async Task<IEnumerable<Order>> GetOrderHistory(string accountNumber, int pageSize, int skipCount)
        {
            if (!AuthenticationStatus.Instance.HasValidToken()) throw new UnauthorizedAccessException("Protected request. User not authenticated");

            await EnsureChannelSettingsRetrieved();

            QueryResultSettings queryResultSettings = new QueryResultSettings { Paging = new PagingInfo { Top = pageSize, Skip = skipCount } };

            ICustomerManager customerManager = DataService.ManagerFactory.GetManager<ICustomerManager>();
            PagedResult<SalesOrder> salesOrders = await customerManager.GetOrderHistory(accountNumber, queryResultSettings);

            var orders = from so in salesOrders
                         select new Order(so);

            return orders;
        }

        /// <summary>
        /// Gets the order lines for the specified order.
        /// </summary>
        /// <param name="order">The order object.</param>
        /// <returns>A <c>Task</c> of a collection of <c>OrderLine</c> objects.</returns>
        public async Task<IEnumerable<OrderLine>> GetOrderLines(Order order)
        {
            if (!AuthenticationStatus.Instance.HasValidToken()) throw new UnauthorizedAccessException("Protected request. User not authenticated");

            await EnsureChannelSettingsRetrieved();

            // Sales orders retrieved using GetOrdrHistory do not populate the SalesLines property, 
            // hence get the full sales order object using GetSalesOrderDetailsByTransactionId() method.

            ISalesOrderManager salesOrderManager = DataService.ManagerFactory.GetManager<ISalesOrderManager>();
            SalesOrder salesOrderDetail = await salesOrderManager.GetSalesOrderDetailsByTransactionId(order.Data.Id, 0);

            var validSalesLines = salesOrderDetail.SalesLines.Where(sl => sl.IsVoided == false).ToArray();

            var orderedProductIds = validSalesLines.Select(sl => sl.ProductId ?? 0).ToArray();

            IProductManager productManager = DataService.ManagerFactory.GetManager<IProductManager>();

            int top = orderedProductIds.Count();

            QueryResultSettings queryResultSettings = new QueryResultSettings { Paging = new PagingInfo { Top = top, Skip = 0 } };

            List<SimpleProduct> orderedProducts = new List<SimpleProduct>();
            PagedResult<SimpleProduct> pagedProductResult;
            do
            {
                pagedProductResult = (await productManager.GetByIds(0, orderedProductIds, queryResultSettings));
                orderedProducts.AddRange(pagedProductResult.Results);
                queryResultSettings.Paging.Skip = orderedProducts.Count();
            }
            while (pagedProductResult.Count() != 0 && orderedProducts.Count() != top);
            // if count of retrieved products is same as expected number of products exit while loop
            // if count of retrieved products is not zero but hasn;t reached the expected product count continue to read more. 
            // This is done to take care of the edge case where we may have specified a pagesize greater than the limit set on retail server.


            var orderLines = from sl in validSalesLines
                             join p in orderedProducts
                             on sl.ProductId equals p.RecordId
                             select new OrderLine(sl, p);


            return orderLines;
        }

        public async Task<Address> GetPrimaryAddress()
        {
            if (!AuthenticationStatus.Instance.HasValidToken())
                return null;

            var customerManager = DataService.ManagerFactory.GetManager<ICustomerManager>();

            var signedIncustomer = await customerManager.Read(string.Empty);

            Data.Entities.Address primaryAddress = signedIncustomer.Addresses.FirstOrDefault(a => (a.IsPrimary.Value == true));

            return primaryAddress == null ? null : new Address(primaryAddress);
        }

        public async Task UpdatePrimaryAddress(Data.Entities.Address address)
        {
            bool isFound = false;
            var customerManager = DataService.ManagerFactory.GetManager<ICustomerManager>();

            if (!AuthenticationStatus.Instance.HasValidToken()) throw new UnauthorizedAccessException("Protected request. User not authenticated");

            Customer signedIncustomer = await customerManager.Read(string.Empty);

            for (int addressIndex = 0; addressIndex < signedIncustomer.Addresses.Count; addressIndex++)
            {
                //Update the existing address
                if (signedIncustomer.Addresses[addressIndex].IsPrimary.Value == true)
                {
                    signedIncustomer.Addresses[addressIndex] = address;
                    isFound = true;
                }
            }

            // Add new address if Primary Address does not exist
            if (isFound == false)
            {
                address.IsPrimary = true;
                signedIncustomer.Addresses.Add(address);
            }

            await customerManager.Update(signedIncustomer);
        }

    }
}