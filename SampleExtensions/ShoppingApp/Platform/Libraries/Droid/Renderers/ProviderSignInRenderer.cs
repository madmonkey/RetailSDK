/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Android.App;
using Xamarin.Forms;
using Contoso.Commerce.Client.ShoppingApp.View.Pages.Authentication;
using Contoso.Commerce.Client.ShoppingApp.Droid.Renderers;
using Xamarin.Forms.Platform.Android;
using Android.Content;

[assembly: ExportRenderer(typeof(ProviderSignInPage), typeof(ProviderSignInRenderer))]
namespace Contoso.Commerce.Client.ShoppingApp.Droid.Renderers
{
    class ProviderSignInRenderer : PageRenderer
    {
        public ProviderSignInRenderer(Context context) : base(context)
        {
        }

        protected override void OnElementChanged(ElementChangedEventArgs<Page> e)
        {
            base.OnElementChanged(e);
            var page = e.NewElement as ProviderSignInPage;
            var activity = Context as Activity;
            var intent = page.Authenticator.GetUI(activity);
            intent.SetFlags(ActivityFlags.NoAnimation);
            activity.StartActivity(intent);
            activity.OverridePendingTransition(0, 0);
        }
    }
}