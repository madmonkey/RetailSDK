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
    using Plugin.Toasts;
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Windows.Input;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public class CheckoutDeliveryOptionsPage : PageBase
    {
        public event EventHandler DeliveryOptionsLoaded;

        private ObservableCollection<DeliveryOption> _deliveryOption;

        public ObservableCollection<DeliveryOption> DeliveryOptions
        {
            get { return _deliveryOption; }
            set { SetProperty(ref _deliveryOption, value); }
        }

        private DeliveryOption _selectedDeliveryOption;

        public DeliveryOption SelectedDeliveryOption
        {
            get { return _selectedDeliveryOption; }
            set { SetProperty(ref _selectedDeliveryOption, value); }
        }

        public CheckoutDeliveryOptionsPage(ObservableCollection<DeliveryOption> deliveryOptions)
        {
            DeliveryOptions = deliveryOptions;

            LoadDeliveryOptionCommand = new Command(ExecuteLoadDeliveryOptionCommand);

            SaveDeliveryOptionCommand = new AsyncCommand(ExecuteSaveDeliveryOptionCommand, this);
        }

        public ICommand LoadDeliveryOptionCommand { get; private set; }
        public AsyncCommand SaveDeliveryOptionCommand { get; private set; }

        private async Task ExecuteSaveDeliveryOptionCommand()
        {
            await ServiceManager.CartService.UpdateDeliveryOption(SelectedDeliveryOption);
        }

        private void ExecuteLoadDeliveryOptionCommand()
        {
            SelectedDeliveryOption = DeliveryOptions.Where(dOption => String.Equals(dOption.Data.Code, ServiceManager.CartService.CheckoutCart.Data.DeliveryMode)).FirstOrDefault();

            DeliveryOptionsLoaded?.Invoke(this, null);

            IsInitialized = true;
        }
    }
}