/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

// Copyright 2011 Xamarin Inc
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

using Android.Content;
using Contoso.Commerce.Client.ShoppingApp.Droid.Renderers;
using Contoso.Commerce.Client.ShoppingApp.View.Views;
using System.ComponentModel;
using Xamarin.Forms;
using Xamarin.Forms.Internals;
using Xamarin.Forms.Platform.Android;

[assembly: ExportRenderer(typeof(HybridWebView), typeof(HybridWebViewRenderer))]
namespace Contoso.Commerce.Client.ShoppingApp.Droid.Renderers
{
    public class HybridWebViewRenderer : ViewRenderer<HybridWebView, Android.Webkit.WebView>
    {
        private const string JavaScriptFunction = @"
function invokeCSharpAction(message) 
{ 
    javaScriptBridge.invokeAction(message); 
}
";

        private readonly Context context;

        public HybridWebViewRenderer(Context context) : base(context)
        {
            this.context = context;
        }

        protected override void OnElementChanged(ElementChangedEventArgs<HybridWebView> e)
        {
            base.OnElementChanged(e);

            if (Control == null)
            {
                var webView = new Android.Webkit.WebView(this.context);
                webView.Settings.JavaScriptEnabled = true;
                SetNativeControl(webView);
            }
            if (e.OldElement != null)
            {
                e.OldElement.EvalRequested -= OnEvalRequested;
                Control.RemoveJavascriptInterface("javaScriptBridge");
                var hybridWebView = e.OldElement as HybridWebView;
                hybridWebView.Dispose();
            }
            if (e.NewElement != null)
            {
                Control.AddJavascriptInterface(new JavaScriptBridge(this), "javaScriptBridge");
                LoadElementUrl();
                e.NewElement.EvalRequested += OnEvalRequested;
            }
        }

        protected override void OnElementPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            base.OnElementPropertyChanged(sender, e);

            if (this.Element == null || this.Control == null)
                return;

            if (e.PropertyName == HybridWebView.UrlProperty.PropertyName)
            {
                LoadElementUrl();
            }
        }

        private void OnEvalRequested(object sender, EvalRequestedEventArgs eventArg)
        {
            Control.LoadUrl("javaScript:" + eventArg.Script);
        }

        private void LoadElementUrl()
        {
            if (!string.IsNullOrWhiteSpace(Element.Url))
            {
                Control.LoadUrl(Element.Url);
                Control.LoadUrl(string.Format("javaScript: {0}", JavaScriptFunction));
            }
        }
    }
}
