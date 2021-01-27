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
    using Android.Content;
    using Android.OS;

    namespace ShoppingApp.Droid
    {
        [Activity(Label = "@string/app_name", Theme = "@style/ShoppingAppTheme.Splash", MainLauncher = true, NoHistory = true)]
        public class SplashActivity : Activity
        {
            protected override void OnCreate(Bundle savedInstanceState)
            {
                AppContainer.Instance = new AppContainer();

                base.OnCreate(savedInstanceState);

                var intent = new Intent(this, typeof(MainActivity));
                this.StartActivity(intent);
            }
        }
    }
}