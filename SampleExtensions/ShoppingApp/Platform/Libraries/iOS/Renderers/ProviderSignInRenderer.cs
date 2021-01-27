/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Xamarin.Forms;
using Xamarin.Forms.Platform.iOS;
using Contoso.Commerce.Client.ShoppingApp.View.Pages.Authentication;
using Contoso.Commerce.Client.ShoppingApp.iOS.Renderers;
using UIKit;

[assembly: ExportRenderer(typeof(ProviderSignInPage), typeof(ProviderLoginPageRenderer))]

namespace Contoso.Commerce.Client.ShoppingApp.iOS.Renderers
{
    public class ProviderLoginPageRenderer : PageRenderer
    {
        UIViewController _AuthController;
        bool _authFlowCompleted;
        bool _authControllerPresented;

        protected override void OnElementChanged(VisualElementChangedEventArgs e)
        {
            base.OnElementChanged(e);
            _authFlowCompleted = false;
            _authControllerPresented = false;

            var page = e.NewElement as ProviderSignInPage;
            page.Authenticator.Completed += (sender, eventArgs) =>
            {
                _authFlowCompleted = true;

                if (_authControllerPresented)
                {
                    DismissViewController(false, null);
                }
            };

            _AuthController = page.Authenticator.GetUI();
        }

        public override void ViewDidAppear(bool animated)
        {
            base.ViewDidAppear(animated);

            if (!_authFlowCompleted)
            {
                PresentViewController(_AuthController, false, () =>
                                       _authControllerPresented = true);
            }
        }
    }
}

