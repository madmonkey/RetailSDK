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
    using Authentication;
    using Contoso.Commerce.Client.ShoppingApp.ViewModel.Toasts;
    using Data.Services;
    using Localization;
    using Plugin.Toasts;
    using System;
    using System.Collections.ObjectModel;
    using System.Net;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;

    [CLSCompliant(false)]
    public class CheckoutAddressPage : PageBase
    {
        public event EventHandler AddressLoaded;

        private ObservableCollection<string> _countryCodes;
        public ObservableCollection<string> CountryCodes
        {
            get { return _countryCodes; }
            set { SetProperty(ref _countryCodes, value); }
        }

        private string _confirmEmailAddress;
        public string ConfirmEmailAddress
        {
            get { return _confirmEmailAddress; }
            set { SetProperty(ref _confirmEmailAddress, value); }
        }

        private Address _address;
        public Address Address
        {
            get { return _address; }
            set { SetProperty(ref _address, value); }
        }

        private bool _shouldSaveAddress;
        public bool ShouldSaveAddress
        {
            get { return _shouldSaveAddress; }
            set { SetProperty(ref _shouldSaveAddress, value); }
        }

        private bool _isToggleVisible;
        public bool IsToggleVisible
        {
            get { return _isToggleVisible; }
            set { SetProperty(ref _isToggleVisible, value); }
        }

        ObservableCollection<DeliveryOption> _deliveryOptions;
        public ObservableCollection<DeliveryOption> DeliveryOptions
        {
            get { return _deliveryOptions; }
            set { SetProperty(ref _deliveryOptions, value); }
        }

        public CheckoutAddressPage()
        {
            //Get list of country codes from Config.xml file.
            //CountryCodes = ConfigurationManager.ServiceConfiguration.CountryRegions;
            CountryCodes = new ObservableCollection<string>(new[] { "USA" });
            Address = new Address(new Data.Entities.Address());
            DeliveryOptions = new ObservableCollection<DeliveryOption>();

            LoadAddressCommand = new AsyncCommand(ExecuteLoadAddressCommand, this);
            LoadDeliveryOptionsCommand = new AsyncCommand(ExecuteLoadDeliveryOptionsCommand, this);
        }

        public AsyncCommand LoadAddressCommand { get; private set; }

        private async Task ExecuteLoadAddressCommand()
        {
            this.IsToggleVisible = false;

            Address checkoutAddress = null;

            var address = ServiceManager.CartService.CheckoutCart.Data.ShippingAddress;
            if (address != null)
            {
                // Clone address so that invalid address changes will not be persisted to the cart.
                checkoutAddress = new Address((Data.Entities.Address)address.Clone());
            }
            else if (AuthenticationStatus.Instance.HasValidToken())
            {
                try
                {
                    checkoutAddress = await ServiceManager.CustomerService.GetPrimaryAddress();
                    if (checkoutAddress != null)
                    {
                        IsToggleVisible = true;
                    }
                }
                catch (DataServiceException e)
                {
                    string message = null;
                    ToastNotificationType notificationType = ToastNotificationType.Error;

                    if (e.HttpStatusCode == HttpStatusCode.Forbidden)
                    {
                        AuthenticationStatus.Instance.SignOut();

                        message = Translator.Instance.GetTranslation(nameof(TextResources.Pages_CheckoutAddressPage_CustomerNotSignedUp));
                        notificationType = ToastNotificationType.Warning;
                    }

                    await HandleExceptionAsync(e, message, notificationType);
                }
            }

            if (checkoutAddress == null)
            {
                checkoutAddress = new Address(new Data.Entities.Address());
            }

            Address = checkoutAddress;

            ConfirmEmailAddress = Address.Data.Email;

            AddressLoaded?.Invoke(this, null);

            IsInitialized = true;
        }

        public AsyncCommand LoadDeliveryOptionsCommand { get; private set; }

        private async Task ExecuteLoadDeliveryOptionsCommand()
        {
            var notificator = AppContainer.Resolve<IToastNotificator>();

            var notificationOptions = new NotificationOptions
            {
                Title = Translator.Instance.GetTranslation(nameof(TextResources.Pages_CheckoutAddressPage_ValidationFailed))
            };

            if (string.IsNullOrWhiteSpace(Address.Data.Email) ||
                string.IsNullOrWhiteSpace(Address.Data.Name) ||
                string.IsNullOrWhiteSpace(Address.Data.Street) ||
                string.IsNullOrWhiteSpace(Address.Data.City) ||
                string.IsNullOrWhiteSpace(Address.Data.State) ||
                string.IsNullOrWhiteSpace(Address.Data.ZipCode))
            {
                notificationOptions.Description = Translator.Instance.GetTranslation(nameof(TextResources.Pages_CheckoutAddressPage_AddressIsEmptyMessage));
                await notificator.Notify(notificationOptions);
            }
            else if (!Regex.IsMatch(Address.Data.State, "^[A-Z]{2}$"))
            {
                notificationOptions.Description = Translator.Instance.GetTranslation(nameof(TextResources.Pages_CheckoutAddressPage_StateCodeInvalidFormat));
                await notificator.Notify(notificationOptions);
            }
            else if (!Address.Data.Email.Equals(ConfirmEmailAddress))
            {
                notificationOptions.Description = Translator.Instance.GetTranslation(nameof(TextResources.Pages_CheckoutAddressPage_EmailNotEqual_Error));
                await notificator.Notify(notificationOptions);
            }
            else
            { 
                string nonAlphaNumericPattern = @"[^0-9A-Za-z]";
                var filteredEmail = Regex.Replace(Address.Data.Email ?? string.Empty, nonAlphaNumericPattern, string.Empty);

                if (filteredEmail.Length < 5)
                {
                    notificationOptions.Description = Translator.Instance.GetTranslation(nameof(TextResources.Pages_CheckoutAddressPage_EmailNotValid_Error));
                    await notificator.Notify(notificationOptions);
                }
                else
                { 
                    ServiceManager.CartService.CheckoutCart.Data.ShippingAddress = Address.Data;

                    try
                    {
                        if (ShouldSaveAddress == true)
                        {
                            await ServiceManager.CustomerService.UpdatePrimaryAddress(Address.Data);
                        }
                    }
                    catch (DataServiceException e)
                    {
                        await HandleExceptionAsync(e,
                            Translator.Instance.GetTranslation(nameof(TextResources.Pages_CheckoutAddressPage_UpdatePrimaryAddress_Error)),
                            ToastNotificationType.Warning);
                    }

                    try
                    {
                        DeliveryOptions = await ServiceManager.CartService.GetCartDeliveryOptions(ServiceManager.CartService.CheckoutCart.Data.ShippingAddress);
                    }
                    catch (DataServiceException e)
                    {
                        await HandleExceptionAsync(e,
                            Translator.Instance.GetTranslation(nameof(TextResources.Pages_CheckoutAddressPage_DeliveryOption_Error)),
                            ToastNotificationType.Error);
                    }
                }
            }
        }
    }
}

