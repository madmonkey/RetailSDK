/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Services;
using Contoso.Commerce.Client.Data.Services.Authentication;
using Contoso.Commerce.Client.Localization;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Settings;
using System;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Services
{
    public class ServiceManager
    {
        private DataService dataService;

        private static volatile ServiceManager current;
        private static object syncRoot = new Object();

        public static ServiceManager Current
        {
            get
            {
                if (current == null)
                {
                    lock (syncRoot)
                    {
                        if (current == null)
                        {
                            current = new ServiceManager(SettingsManager.Instance.ServiceSettings);
                        }
                    }
                }
                return current;
            }
        }

        private ServiceManager(Uri dataServiceUrl, string operatingUnitNumber)
        {
            dataService = new DataService(dataServiceUrl, operatingUnitNumber, CrossLocalize.Localize.Culture.Name);
            CartService = new CartService(dataService);
            CategoryService = new CategoryService(dataService);
            ProductService = new ProductService(dataService);
            CustomerService = new CustomerService(dataService);
			CartService = new CartService(dataService);
            StoreOperationsService = new StoreOperationsService(dataService);
        }
        
        public ServiceManager(ServiceSettings serviceSettings) : this(serviceSettings.DataServiceUrl, serviceSettings.OperatingUnitNumber)
        {
        }

        public static void Invalidate()
        {
            lock (syncRoot)
            {
                current = null;
            }
        }

        public CartService CartService { get; private set; }

        public StoreOperationsService StoreOperationsService { get; private set; }

        public CategoryService CategoryService { get; private set; }

        public ProductService ProductService { get; private set; }

        public CustomerService CustomerService { get; private set; }

        /// <summary>
        /// Gets or sets the logged in user's token to the retail context.
        /// </summary>
        public UserToken UserToken
        {
            get
            {
                return dataService.ManagerFactory.UserToken;
            }
            set
            {
                dataService.ManagerFactory.UserToken = value;
            }
        }
    }
}
