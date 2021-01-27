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
    using Android.App;
    using Android.Content.PM;
    using Android.OS;
    using Contoso.Commerce.Client.ShoppingApp.View;
    using Plugin.Toasts;
    using Xamarin.Forms.Platform.Android;

    namespace ShoppingApp.Droid
    {
        /// <summary>
        /// Represents the Activity to display when the application starts up.
        /// </summary>
        [Activity(ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation, ScreenOrientation = ScreenOrientation.Portrait)]
        public class MainActivity : FormsAppCompatActivity
        {
            protected override void OnCreate(Bundle bundle)
            {
                base.OnCreate(bundle);

                global::Xamarin.Forms.Forms.Init(this, bundle);

                ToolbarResource = Resource.Layout.toolbar;
                TabLayoutResource = Resource.Layout.tabs;

                ToastNotification.Init(this);

                this.LoadApplication(new App());
            }
        }
    }
}