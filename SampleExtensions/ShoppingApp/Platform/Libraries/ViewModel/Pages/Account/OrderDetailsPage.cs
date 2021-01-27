/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Services;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    [CLSCompliant(false)]
    public class OrderDetailsPage : PageBase
    {
        public OrderDetailsPage(Order order)
        {
            _order = order;
            _orderLines = new ObservableCollection<OrderLine>();
            LoadOrderDetailsCommand = new AsyncCommand(ExecuteLoadOrderDetailsCommand, this);
        }

        private Order _order;
        public Order Order
        {
            get { return _order; }
            set { SetProperty(ref _order, value); }
        }

        ObservableCollection<OrderLine> _orderLines;
        public ObservableCollection<OrderLine> OrderLines
        {
            get { return _orderLines; }
            set { SetProperty(ref _orderLines, value); }
        }

        /// <summary>
        /// Command to load order details.
        /// </summary>
        public AsyncCommand LoadOrderDetailsCommand { get; private set; }

        private async Task ExecuteLoadOrderDetailsCommand()
        {
            var orderLines = (await ServiceManager.CustomerService.GetOrderLines(_order));

            OrderLines = new ObservableCollection<OrderLine>(orderLines);

            IsInitialized = true;
        }
    }
}
