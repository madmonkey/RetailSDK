/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */
namespace Contoso.Commerce.Client.Pos
{
    using Android.App;
    using Android.Webkit;
    using Java.Interop;
    using Microsoft.Dynamics.Commerce.Pos.Hybrid.Framework;
    using Newtonsoft.Json;

    /// <summary>
    /// Class handles incoming request tasks and responses to the hosted POS instance. Implements <see cref="IRemoteMessagingHandler"/>.
    /// </summary>
    public class POSRemoteMessageHandler : Java.Lang.Object, IRemoteMessageTaskHandler
    {
        /// <summary>
        /// The activity context to send and receive the messages.
        /// </summary>
        private readonly Activity activity;

        /// <summary>
        /// The webview that is hosting the POS instance.
        /// </summary>
        private readonly WebView webView;

        /// <summary>
        /// The handler to handle a received message.
        /// </summary>
        private ReceiveMessageHandler receiveMessageHandler;

        /// <summary>Initializes a new instance of the <see cref="POSRemoteMessageHandler"/> class.</summary>
        /// <param name="activity">The activity context to send and receive the messages.</param>
        /// <param name="webView">The webview that is hosting the POS instance.</param>
        public POSRemoteMessageHandler(Activity activity, WebView webView)
        {
            this.activity = activity;
            this.webView = webView;
        }

        /// <summary>
        /// Sends a message.
        /// </summary>
        /// <param name="remoteTaskRequestData">The remote task request data.</param>
        /// <returns>The success/fail information of sending the message.</returns>
        public string Send(RemoteTaskRequestData remoteTaskRequestData)
        {
            const string HostedJavascriptMethod = "Commerce.Host.Android.AndroidRemoteTaskMessageHandler.instance.receive({0})";

            // Use the object directly in javascript
            // Adding quotes to create a parameter in a serialized string can cause conflict with the quoting in a serialized string.
            // This approach uses the serialized string to create an object in POS and then references the serialized string as a data member of the object.
            string packStr = JsonConvert.SerializeObject(remoteTaskRequestData);

            // Send the message to POS
            string javascriptCall = string.Format(HostedJavascriptMethod, packStr);
            return JavascriptHelpers.EvaluateJavascriptAsync(this.activity, this.webView, javascriptCall).Result;
        }

        /// <summary>
        /// Receives a message.
        /// </summary>
        /// <param name="remoteTaskRequestData">The remote task request data.</param>
        /// <returns>The result of scheduling the task to run.</returns>
        public string Receive(RemoteTaskRequestData remoteTaskRequestData)
        {
            return this.receiveMessageHandler(remoteTaskRequestData);
        }

        /// <summary>
        /// Receives a message from POS.
        /// </summary>
        /// <param name="correlationId">The correlation id.</param>
        /// <param name="taskInstanceId">The id of the task instance.</param>
        /// <param name="messageType">The message type.</param>
        /// <param name="message">The message received.</param>
        /// <returns>The result of scheduling the task to run.</returns>
        [Export]
        [JavascriptInterface]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("StyleCop.CSharp.NamingRules", "SA1300:Element must begin with upper-case letter", Justification = "Javascript export function")]
        public string taskMessageFromPOSToAndroid(string correlationId, string taskInstanceId, string messageType, string message)
        {
            RemoteTaskRequestData remoteTaskRequestData = new RemoteTaskRequestData(correlationId, taskInstanceId, messageType, message);
            return this.Receive(remoteTaskRequestData);
        }

        /// <summary>
        /// Sets the handler to handle a received message.
        /// </summary>
        /// <param name="receiveMessageHandler">The message handler.</param>
        public void SetMessageReceiveHandler(ReceiveMessageHandler receiveMessageHandler)
        {
            this.receiveMessageHandler = receiveMessageHandler;
        }
    }
}