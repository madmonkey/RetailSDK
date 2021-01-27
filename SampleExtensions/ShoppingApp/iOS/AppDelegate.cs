/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Foundation;
using Contoso.Commerce.Client.ShoppingApp.View;
using Contoso.Commerce.Client.ShoppingApp.View.Statics;
using Plugin.Toasts;
using UIKit;
using Xamarin.Forms.Platform.iOS;

namespace Contoso
{
    namespace ShoppingApp.iOS
    {
        // The UIApplicationDelegate for the application. This class is responsible for launching the 
        // User Interface of the application, as well as listening (and optionally responding) to 
        // application events from iOS.
        [Register("AppDelegate")]
        public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate
        {
            //
            // This method is invoked when the application has loaded and is ready to run. In this 
            // method you should instantiate the window, load the UI into it and then make the window
            // visible.
            //
            // You have 17 seconds to return from this method, or iOS will terminate your application.
            //
            public override bool FinishedLaunching(UIApplication app, NSDictionary options)
            {
                global::Xamarin.Forms.Forms.Init();

                UITabBar.Appearance.TintColor = Palette.Current.Primary.ToUIColor();
                ToastNotification.Init();

                LoadApplication(new App());

                return base.FinishedLaunching(app, options);
            }
        }
    }
}
