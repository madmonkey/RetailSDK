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

namespace Contoso.Commerce.Client.ShoppingApp.View.Views
{
    using System;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public partial class HybridWebView : View, IDisposable
    {
        public HybridWebView()
        {
            this.HorizontalOptions = LayoutOptions.FillAndExpand;
            this.VerticalOptions = LayoutOptions.FillAndExpand;
        }

        public static readonly BindableProperty UrlProperty = BindableProperty.Create(
            propertyName: "Url",
            returnType: typeof(string),
            declaringType: typeof(HybridWebView),
            defaultValue: default(string));

        public string Url
        {
            get { return (string)GetValue(UrlProperty); }
            set { SetValue(UrlProperty, value); }
        }

        public event EventHandler<EvalRequestedEventArgs> EvalRequested;

        public event EventHandler<MessageReceivedEventArgs> MessageReceived;

        public void Eval(string script)
        {
            OnEvalRequested(script);
        }

        protected void OnEvalRequested(string script)
        {
            EvalRequested?.Invoke(this, new EvalRequestedEventArgs(script));
        }

        public void Receive(string message)
        {
            OnMessageReceived(message);
        }

        protected void OnMessageReceived(string message)
        {
            MessageReceived?.Invoke(this, new MessageReceivedEventArgs(message));
        }

        public void Dispose()
        {
            Clear(EvalRequested);
            Clear(MessageReceived);
        }

        private void Clear<T>(EventHandler<T> eventHandler)
        {
            if (eventHandler != null)
            {
                foreach (EventHandler<T> handler in eventHandler.GetInvocationList())
                    eventHandler -= handler;
            }
        }
    }
}