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
        using System.Threading;
        using System.Threading.Tasks;
        using Android.App;
        using Android.Webkit;

        /// <summary>
        /// Supports calls to/from Javascript.
        /// </summary>
        internal static class JavascriptHelpers
        {
            /// <summary>
            /// Executes the provided javascript in the webview.
            /// </summary>
            /// <param name="activity">The activity context to make the Javascript call.</param>
            /// <param name="webView">The webview.</param>
            /// <param name="javascript">The javacript text to execute in the webview.</param>
            /// <returns>Returns a result of the executed javascript.</returns>
            public static async Task<string> EvaluateJavascriptAsync(Activity activity, WebView webView, string javascript)
            {
                ManualResetEvent semaphore = new ManualResetEvent(false);
                string response = string.Empty;
                activity.RunOnUiThread(() =>
                {
                    try
                    {
                        webView.EvaluateJavascript(string.Format("javascript: {0}", javascript), new JavascriptResult((string result) =>
                        {
                            response = result;
                            semaphore.Set();
                        }));
                    }
                    catch (Exception)
                    {
                        semaphore.Set();
                        throw;
                    }
                });

                await Task.Run(() => { semaphore.WaitOne(); });
                return response;
            }

            /// <summary>
            /// Handles the result of a javascript call.
            /// </summary>
            internal class JavascriptResult : Java.Lang.Object, IValueCallback
            {
                /// <summary>
                /// The action to call when the Javascript call has returned.
                /// </summary>
                private Action<string> _callback;

                /// <summary>
                /// Initializes a new instance of the <see cref="JavascriptResult"/> class.
                /// </summary>
                /// <param name="callback">The action to call when the Javascript call has returned.</param>
                public JavascriptResult(Action<string> callback = null)
                {
                    this._callback = callback;
                }

                /// <summary>
                /// Gets the value of the JavascriptResult.
                /// </summary>
                public string Value { get; private set; }

                /// <summary>
                /// Method called when the EvaluateJavascript call has completed.
                /// </summary>
                /// <param name="result">The result of the javascript call.</param>
                public void OnReceiveValue(Java.Lang.Object result)
                {
                    this.Value = (result == null) ? string.Empty : ((Java.Lang.String)result).ToString();
                    this._callback?.Invoke(this.Value);
                }
            }
        }
    }
}