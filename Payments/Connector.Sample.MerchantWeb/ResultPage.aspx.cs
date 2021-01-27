/*
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
*/
namespace Contoso
{
    namespace Retail.SampleConnector.MerchantWeb
    {
        using System;

        /// <summary>
        /// The result page showing the result of payment.
        /// </summary>
        public partial class ResultPage : System.Web.UI.Page
        {
            /// <summary>
            /// Loads the content of the page.
            /// </summary>
            /// <param name="sender">The sender.</param>
            /// <param name="e">The event data.</param>
            protected void Page_Load(object sender, EventArgs e)
            {
                // Warning: This is only a sample to show token is retrieved. 
                // In production, never return the token to the client.
                this.CardTokenTextBox.Text = Request.QueryString["cardTokenResult"];
                this.AuthorizationResultTextBox.Text = Request.QueryString["authorizationResult"];
                this.CaptureResultTextBox.Text = Request.QueryString["captureResult"];
                this.VoidResultTextBox.Text = Request.QueryString["voidResult"];
                this.ErrorsTextBox.Text = Request.QueryString["errors"];
            }

            /// <summary>
            /// Initializes the page.
            /// </summary>
            /// <param name="sender">The sender.</param>
            /// <param name="e">The event data.</param>
            protected void Page_Init(object sender, EventArgs e)
            {
                this.ViewStateUserKey = new Guid().ToString();
            }

            /// <summary>
            /// Handles the event when the start over button is clicked.
            /// </summary>
            /// <param name="sender">The sender.</param>
            /// <param name="e">The event data.</param>
            protected void StartOverButton_Click(object sender, EventArgs e)
            {
                Response.Redirect("StartPage.aspx");
            }
        }
    }
}