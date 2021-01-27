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
        using System.Linq;
        using System.Threading.Tasks;
        using Android.App;
        using Android.Content;
        using Android.Content.PM;
        using Android.Graphics;
        using Android.OS;
        using Android.Preferences;
        using Android.Runtime;
        using Android.Views;
        using Android.Webkit;
        using Microsoft.Dynamics.Commerce.Pos.Hybrid.Framework;
        using Microsoft.Dynamics.Commerce.Pos.Hybrid.Framework.Device;
        using Microsoft.Dynamics.Commerce.Pos.Hybrid.Framework.Instrumentation;
        using Microsoft.Dynamics.Retail.Diagnostics;

        [Activity(
            Label = "Retail Modern POS",
            MainLauncher = true,
            Theme = "@android:style/Theme.Black.NoTitleBar",
            ConfigurationChanges = ConfigChanges.Orientation | ConfigChanges.KeyboardHidden | ConfigChanges.ScreenSize)]
        public class PosActivity : Activity
        {
            private const string WebConfigName = "Pos.config";
            private static readonly string[] AadHostUrls = { "login.windows.net", "login.chinacloudapi.cn", "sts.microsoft.com", "sts.windows.net" };
            private WebView webView;
            private AndroidRemoteTaskManager androidRemoteTaskManager;

            /// <summary>
            /// Called when the operating system has determined that it is a good time for a process to trim unneeded memory from its process.
            /// </summary>
            /// <param name="level">The level.</param>
            public override void OnTrimMemory([GeneratedEnum] TrimMemory level)
            {
                this.FlushTelemetryEvents();
                base.OnTrimMemory(level);
            }

            /// <summary>
            /// Handles a KeyEvent from the Android device.
            /// </summary>
            /// <param name="keyEvent">The KeyEvent.</param>
            /// <returns>True if this event was consumed, false otherwise.</returns>
            public override bool DispatchKeyEvent(KeyEvent keyEvent)
            {
                // Navigate back in POS when the Android back button is pressed down
                if (keyEvent?.KeyCode == Keycode.Back && keyEvent.Action == KeyEventActions.Down)
                {
                    if (Android.OS.Build.VERSION.SdkInt >= Android.OS.BuildVersionCodes.Kitkat)
                    {
                        // The code to communicate with the hosted instance uses the webview method EvaluateJavascript.
                        // The EvaluateJavascriptAsync method queues the action to take on the UI thread once the current actions on the UI thread has completed.
                        // As the DispatchKeyEvent is on the UI thread, run the function in a new task so the UI thread is not deadlocked.
                        Task.Run(async () =>
                        {
                            NavigateBackOutgoingTask task = new NavigateBackOutgoingTask();
                            await this.androidRemoteTaskManager.RunOutgoingTask(null, task).ConfigureAwait(false);
                        });

                        return true;
                    }
                }

                return base.DispatchKeyEvent(keyEvent);
            }

            protected override void OnCreate(Bundle bundle)
            {
                base.OnCreate(bundle);
                InstrumentationInitializer.Initialize(GetDefaultDiagnosticsConfig());

                this.SetContentView(Resource.Layout.Pos);

                this.webView = this.FindViewById<WebView>(Resource.Id.webView);
#if DEBUG
                WebView.SetWebContentsDebuggingEnabled(true);
#endif
                this.webView.Settings.JavaScriptEnabled = true;
                this.webView.Settings.DomStorageEnabled = true;
                this.webView.SetWebViewClient(new HybridWebViewClient(this));

                if (Android.OS.Build.VERSION.SdkInt >= Android.OS.BuildVersionCodes.Lollipop)
                {
                    // Enable cross site cookies for OAuth
                    CookieManager.Instance.SetAcceptThirdPartyCookies(this.webView, true);
                }

                // Setup the message handler between the host instance and CloudPOS
                POSRemoteMessageHandler posRemoteMessageHandler = new POSRemoteMessageHandler(this, this.webView);
                this.webView.AddJavascriptInterface(posRemoteMessageHandler, "androidMessageHandler");
                this.androidRemoteTaskManager = new AndroidRemoteTaskManager(posRemoteMessageHandler);

                // Load CloudPOS
                this.LoadCloudPos(() =>
                        this.StartActivityForResult(new Intent(this, typeof(SettingsActivity)), 0));
            }

            protected override void OnActivityResult(int requestCode, [GeneratedEnum] Result resultCode, Intent data)
            {
                this.LoadCloudPos(() => this.Finish());
            }

            protected override void OnDestroy()
            {
                this.FlushTelemetryEvents();
                base.OnDestroy();
            }

            protected override void OnPause()
            {
                this.FlushTelemetryEvents();
                base.OnPause();
            }

            /// <summary>
            /// Gets the default configuration for diagnostics.
            /// </summary>
            /// <returns>The environment configuration.</returns>
            private static DiagnosticsConfig GetDefaultDiagnosticsConfig()
            {
                var posConfig = (PosConfiguration)XmlAssetReader.ReadAssetFile(
                        WebConfigName,
                        typeof(PosConfiguration));

                return posConfig.DiagnosticsConfig;
            }

            private void FlushTelemetryEvents()
            {
                InstrumentationInitializer.FlushEvents();
            }

            /// <summary>
            /// Loads the Cloud Pos Url.
            /// </summary>
            /// <param name="failureAction">The failure action.</param>
            private void LoadCloudPos(Action failureAction)
            {
                var cloudPosUrl = PreferenceManager.GetDefaultSharedPreferences(this).ReadCloudPosUrl();

                if (string.IsNullOrWhiteSpace(cloudPosUrl))
                {
                    failureAction();
                }
                else
                {
                    this.webView.LoadUrl(cloudPosUrl);
                }
            }

            private class HybridWebViewClient : WebViewClient
            {
                private readonly Activity parentActivity;

                /// <summary>
                /// Initializes a new instance of the <see cref="HybridWebViewClient"/> class.
                /// </summary>
                /// <param name="parentActivity">The parent activity of this webview.</param>
                public HybridWebViewClient(Activity parentActivity)
                {
                    this.parentActivity = parentActivity;
                }

#if __ANDROID_24__
                /// <summary>
                /// A chance to take over the control when a new url is about to be loaded.
                /// </summary>
                /// <param name="view">The WebView that is initiating the callback.</param>
                /// <param name="request">The request to be loaded.</param>
                /// <returns>True if request is overridden, false otherwise.</returns>
                public override bool ShouldOverrideUrlLoading(WebView view, IWebResourceRequest request)
                {
                    if (request.HasGesture

                        // WebView Version 75.0+ seems regresed; For authentication redirecton, it sets HasGesture = true
                        // Following mitigation helps for this sceanrio.
                        && !string.IsNullOrWhiteSpace(request.Url.Host)
                        && !PosActivity.AadHostUrls.Any(url => request.Url.Host.EndsWith(url, StringComparison.OrdinalIgnoreCase)))
                    {
                        // If request is initiated from user action, launch with external activity.
                        return this.OpenUrl(request.Url);
                    }

                    return false;
                }
#endif

                /// <summary>
                /// Notify the host application that a page has started loading.
                /// </summary>
                /// <param name="view">The WebView that is initiating the callback.</param>
                /// <param name="url">The url to be loaded.</param>
                /// <param name="favicon">The favicon for this page if it already exists in the database.</param>
                public override void OnPageStarted(WebView view, string url, Bitmap favicon)
                {
                    base.OnPageStarted(view, url, favicon);
                    view.Visibility = ViewStates.Visible;
                }

                /// <summary>
                /// Notify the host application that a page has finished loading.
                /// </summary>
                /// <param name="view">The WebView that is initiating the callback.</param>
                /// <param name="url">The url of the page. </param>
                public override void OnPageFinished(WebView view, string url)
                {
                    base.OnPageFinished(view, url);
                    view.Visibility = ViewStates.Visible;
                }

                /// <summary>
                /// Report an error to the host application.
                /// </summary>
                /// <param name="view">The WebView that is initiating the callback.</param>
                /// <param name="request">The error code corresponding to an ERROR_* value.</param>
                /// <param name="error">The error object. </param>
                public override void OnReceivedError(WebView view, IWebResourceRequest request, WebResourceError error)
                {
                    base.OnReceivedError(view, request, error);
                    view.Visibility = ViewStates.Visible;
                }

                /// <summary>Opens the url with system registered activity.</summary>
                /// <param name="url">Url to open.</param>
                /// <returns>True.</returns>
                private bool OpenUrl(Android.Net.Uri url)
                {
                    using (var intent = new Intent(Intent.ActionView, url))
                    {
                        this.parentActivity.StartActivity(intent);
                    }

                    return true;
                }
            }
        }
    }
}
