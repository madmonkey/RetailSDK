/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    using Data.Services;
    using Entities;
    using Extensions;
    using Localization;
    using Services;
    using System;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;

    [CLSCompliant(false)]
    public class OrderHistoryPage: PageBase
    {
        private const int PageSize = 20;

        ObservableCollection<Order> _orders;

        public ObservableCollection<Order> Orders
        {
            get { return _orders; }
            set { SetProperty(ref _orders, value); }
        }

        public OrderHistoryPage()
        {
            _orders = new ObservableCollection<Order>();
            LoadOrdersCommand = new AsyncCommand(ExecuteLoadOrdersCommand, this);
            LoadMoreOrdersCommand = new AsyncCommand(ExecuteLoadMoreOrdersCommand, this);
        }

        /// <summary>
        /// Command to load orders
        /// </summary>
        public AsyncCommand LoadOrdersCommand { get; private set; }

        async Task ExecuteLoadOrdersCommand()
        {
            try
            {
                var _orders = (await ServiceManager.CustomerService.GetOrderHistory(string.Empty, PageSize, 0));

                Orders = new ObservableCollection<Order>(_orders);

                // If retrieved order count is not less than page size set CanLoadMore to true.
                this.CanLoadMore = Orders.Count() == PageSize;

                IsInitialized = true;
            }
            catch (DataServiceException e)
            {
                if (e.HttpStatusCode == HttpStatusCode.Forbidden)
                {
                    await HandleExceptionAsync(e, Translator.Instance.GetTranslation(nameof(TextResources.Pages_OrderHistoryPage_CustomerNotSignedUp)));
                }
                else
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Command to load orders
        /// </summary>
        public AsyncCommand LoadMoreOrdersCommand { get; private set; }

        // TODO: Not being used. Either remove this or extend async command to set the CanExecute delegate on the command. 
        Boolean CanExecuteLoadMoreOrdersCommand()
        {
            return this.CanLoadMore;
        }

        async Task ExecuteLoadMoreOrdersCommand()
        {
            var _orders = (await ServiceManager.CustomerService.GetOrderHistory(string.Empty, PageSize, Orders.Count));

            // If retrieved order count is not less than page size set CanLoadMore to true.
            this.CanLoadMore = (_orders.Count() == PageSize);

            Orders.AddRange(_orders);
        }
    }
}
