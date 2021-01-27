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
    namespace Commerce.Client.Pos
    {
        using System;
        using System.Diagnostics.CodeAnalysis;
        using Foundation;
        using UIKit;
        using WebKit;

        /// <summary>
        /// Class encapsulates the Pos application view controller.
        /// </summary>
        [SuppressMessage("Microsoft.Design", "CA1010:CollectionsShouldImplementGenericInterface", Justification = "By design for Xamarin.")]
        public class PosViewController : UIViewController, IWKNavigationDelegate, IWKUIDelegate, IWKScriptMessageHandler
        {
            private const string NativeCallScheme = "commerce";
            private WKWebView webView;
            public EventHandler<NSUrlRequest> HandleNativeCall;

            /// <summary>
            /// Initializes a new instance of the <see cref="PosViewController"/> class.
            /// </summary>
            public PosViewController()
            {
                WKUserContentController userContentController = new WKUserContentController();
                userContentController.AddScriptMessageHandler(this, "taskMessageFromPOSToIOS");

                WKWebViewConfiguration configuration = new WKWebViewConfiguration();
                configuration.UserContentController = userContentController;

                this.webView = new WKWebView(this.View.Bounds, configuration);
                this.webView.AutoresizingMask = UIViewAutoresizing.FlexibleWidth | UIViewAutoresizing.FlexibleHeight;
                this.webView.NavigationDelegate = this;
                this.webView.UIDelegate = this;

                this.View.AddSubview(this.webView);

                if (NSHttpCookieStorage.SharedStorage.AcceptPolicy != NSHttpCookieAcceptPolicy.Always)
                {
                    NSHttpCookieStorage.SharedStorage.AcceptPolicy = NSHttpCookieAcceptPolicy.Always;
                }
            }

            /// <summary>
            /// Called prior to the <see cref="P:UIKit.UIViewController.View" /> being added to the view hierarchy.
            /// </summary>
            /// <param name="animated">If the appearance will be animated.</param>
            public override void ViewWillAppear(bool animated)
            {
                base.ViewWillAppear(animated);

                this.NavigationController.NavigationBarHidden = true;
            }

            /// <summary>
            /// Browses the specified URL.
            /// </summary>
            /// <param name="url">The URL.</param>
            public void Browse(string url)
            {
                if (string.IsNullOrWhiteSpace(url))
                {
                    this.DisplayMessage(Application.GetLocalizedString("MissingCloudPosUrl"));
                }
                else
                {
                    this.webView.LoadRequest(new NSUrlRequest(new NSUrl(url)));
                }
            }

            /// <summary>
            /// Method that is called when a navigation fails.
            /// </summary>
            /// <param name="webView">The web view.</param>
            /// <param name="navigation">The navigation.</param>
            /// <param name="error">The error.</param>
            [Export("webView:didFailNavigation:withError:")]
            public void DidFailNavigation(WKWebView webView, WKNavigation navigation, NSError error)
            {
                OnWebViewLoadError(error);
            }

            /// <summary>
            /// Method that is called when a navigation fails after data has begun to load.
            /// </summary>
            /// <param name="webView">The web view.</param>
            /// <param name="navigation">The navigation.</param>
            /// <param name="error">The error.</param>
            [Export("webView:didFailProvisionalNavigation:withError:")]
            public void DidFailProvisionalNavigation(WKWebView webView, WKNavigation navigation, NSError error)
            {
                OnWebViewLoadError(error);
            }

            /// <summary>
            /// Creates and configures a new WKWebView.
            /// </summary>
            /// <param name="webView">The web view.</param>
            /// <param name="configuration">The configuration object.</param>
            /// <param name="navigationAction">The navigation action.</param>
            /// <param name="windowFeatures">The windowFeatures object.</param>
            [Export("webView:createWebViewWithConfiguration:forNavigationAction:windowFeatures:")]
            public WKWebView CreateWebView(WKWebView webView,
                                           WKWebViewConfiguration configuration,
                                           WKNavigationAction navigationAction,
                                           WKWindowFeatures windowFeatures)
            {
                // When hosted app uses window.open to navigate, then open url with associated app (e.g. browser, email)
                if (navigationAction.TargetFrame == null)
                {
                    UIApplication.SharedApplication.OpenUrl(navigationAction.Request.Url);
                }

                return null;
            }

            /// <summary>
            /// Assigns an action to be taken after the specified navigationResponse has been either canceled or allowed.
            /// </summary>
            /// <param name="webView">The web view.</param>
            /// <param name="navigationAction">The navigation action.</param>
            /// <param name="decisionHandler">The decision handler.</param>
            [Export("webView:decidePolicyForNavigationAction:decisionHandler:")]
            public void DecidePolicy(WKWebView webView, WKNavigationAction navigationAction, Action<WKNavigationActionPolicy> decisionHandler)
            {
                if (navigationAction.NavigationType == WKNavigationType.LinkActivated)
                {
                    // When hosted app uses .herf to navigate, then open url with associated app (e.g. email, dialer)
                    UIApplication.SharedApplication.OpenUrl(navigationAction.Request.Url);
                    decisionHandler(WKNavigationActionPolicy.Cancel);
                }
                else if (!string.Equals(navigationAction.Request.Url.Scheme, PosViewController.NativeCallScheme, StringComparison.OrdinalIgnoreCase))
                {
                    decisionHandler(WKNavigationActionPolicy.Allow);
                }
                else
                {
                    if (HandleNativeCall != null)
                    {
                        this.HandleNativeCall(this.webView, navigationAction.Request);
                    }

                    decisionHandler(WKNavigationActionPolicy.Cancel);
                }
            }

            /// <summary>
            /// Releases the resources used by the PosViewController object.
            /// </summary>
            /// <param name="disposing">If set to <see langword="true" />, the method is invoked directly and will dispose manage
            /// and unmanaged resources;   If set to <see langword="false" /> the method is being called by the garbage collector
            /// finalizer and should only release unmanaged resources.</param>
            protected override void Dispose(bool disposing)
            {
                if (disposing && this.webView != null)
                {
                    this.webView.Dispose();
                    this.webView = null;
                }

                base.Dispose(disposing);
            }

            /// <summary>
            /// Displays a message on the web view control.
            /// </summary>
            /// <param name="message">The message to display.</param>
            private void DisplayMessage(string message)
            {
                const string HtmlMessageFormat = "<div style='position: relative; top: 25%; height:25%; text-align: center'><h2>{0}</h2></div>";
                var formattedMessage = string.Format(HtmlMessageFormat, message);

                this.webView.LoadHtmlString(formattedMessage, null);
            }

            private void OnWebViewLoadError(NSError error)
            {
                // If the URL redirects to another URL, we receive an NSURLErrorCancelled error.
                // We can safely ignore this error and continue.
                if (error.Code == (long)NSUrlError.Cancelled)
                {
                    return;
                }

                this.DisplayMessage(error.LocalizedDescription);
            }

            /// <summary>
            /// Handles a message call from POS
            /// </summary>
            /// <param name="userContentController">User content controller.</param>
            /// <param name="message">Message.</param>
            public void DidReceiveScriptMessage(WKUserContentController userContentController, WKScriptMessage message)
            {
                throw new NotImplementedException(nameof(this.DidReceiveScriptMessage));
            }
        }
    }
}