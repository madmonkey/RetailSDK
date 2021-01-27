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
    using Autofac;
    using Contoso.Commerce.Client.Data.Services;
    using Contoso.Commerce.Client.Data.Services.RetailServer;
    using Contoso.Commerce.Client.Plugins;
    using Contoso.Commerce.Client.ShoppingApp.Droid.Plugins;
    using Plugin.Toasts;

    namespace ShoppingApp.Droid
    {
        public class AppContainer : Contoso.Commerce.Client.ShoppingApp.Droid.AppContainer
        {
            protected override void RegisterDependencies(ContainerBuilder cb)
            {
                base.RegisterDependencies(cb);

                cb.RegisterType<ManagerFactory>().As<IManagerFactory>();
                cb.RegisterType<Plugins.EntryAssembly>().As<IEntryAssembly>();
                cb.RegisterType<ToastNotification>().As<IToastNotificator>();
            }
        }
    }
}