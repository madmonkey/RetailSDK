namespace Contoso
{
    /*
    SAMPLE CODE NOTICE
    
    THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
    OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
    THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
    NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
    */
    namespace Retail.SampleConnector.MerchantWeb
    {
        using System;
        using System.Web;
    
        /// <summary>
        /// The start page where you select the transaction type for the card payment.
        /// </summary>
        public partial class StartPage : System.Web.UI.Page
        {
            /// <summary>
            /// Loads the content of the page.
            /// </summary>
            /// <param name="sender">The sender.</param>
            /// <param name="e">The event data.</param>
            protected void Page_Load(object sender, EventArgs e)
            {
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
            /// Handles the event that the next button is clicked.
            /// </summary>
            /// <param name="sender">The sender.</param>
            /// <param name="e">The event data.</param>
            protected void NextButton_Click(object sender, EventArgs e)
            {
                string url = string.Format(
                    "PaymentPage.aspx?industrytype={0}&type={1}&token={2}&swipe={3}&voice={4}&sameasshipping={5}&locale={6}"
                    + "&pagewidth={7}&fontsize={8}&fontfamily={9}&pagebackgroundcolor={10}&labelcolor={11}"
                    + "&textbackgroundcolor={12}&textcolor={13}&disabledtextbackgroundcolor={14}&columnnumber={15}",
                    this.IndustryTypeDropDownList.SelectedItem.Text,
                    this.TransactionTypeHiddenField.Value,
                    string.IsNullOrEmpty(this.SupportCardTokenizationHiddenField.Value) ? "false" : this.SupportCardTokenizationHiddenField.Value,
                    string.IsNullOrEmpty(this.SupportCardSwipeHiddenField.Value) ? "false" : this.SupportCardSwipeHiddenField.Value,
                    string.IsNullOrEmpty(this.SupportVoiceAuthorizationHiddenField.Value) ? "false" : this.SupportVoiceAuthorizationHiddenField.Value,
                    this.ShowSameAsShippingAddressCheckBox.Checked,
                    Uri.EscapeDataString(this.LocaleTextBox.Text),
                    Uri.EscapeDataString(this.PageWidthTextBox.Text),
                    Uri.EscapeDataString(this.FontSizeTextBox.Text),
                    Uri.EscapeDataString(this.FontFamilyTextBox.Text),
                    Uri.EscapeDataString(this.PageBackgroundColorTextBox.Text),
                    Uri.EscapeDataString(this.LabelColorTextBox.Text),
                    Uri.EscapeDataString(this.TextBackgroundColorTextBox.Text),
                    Uri.EscapeDataString(this.TextColorTextBox.Text),
                    Uri.EscapeDataString(this.DisabledTextBackgroundColorTextBox.Text),
                    Uri.EscapeDataString(this.ColumnNumberTextBox.Text));
                Server.Transfer(url);
            }
        }
    }
}
