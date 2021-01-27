/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Autofac;
using Contoso.Commerce.Client.Data.Services;
using Contoso.Commerce.Client.Data.Services.RetailServer;
using Contoso.Commerce.Client.Localization;
using Contoso.Commerce.Client.Plugins;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Pages;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Plugins;
using Plugin.Settings.Abstractions;
using Plugin.Toasts;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests
{
    public class AppContainer : Client.AppContainer
    {
        protected override void RegisterDependencies(ContainerBuilder cb)
        {
            base.RegisterDependencies(cb);

            cb.RegisterType<ManagerFactory>().As<IManagerFactory>();
            cb.RegisterType<Localize>().As<ILocalize>().SingleInstance();
            cb.RegisterType<EntryAssembly>().As<IEntryAssembly>().SingleInstance();
            cb.RegisterType<ShoppingCartPageTest>().As<IToastNotificator>();
            cb.RegisterType<Plugins.Settings>().As<ISettings>();
        }
    }
}

