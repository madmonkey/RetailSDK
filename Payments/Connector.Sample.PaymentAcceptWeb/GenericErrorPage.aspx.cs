namespace Contoso
{
    namespace Retail.SampleConnector.PaymentAcceptWeb
    {
        using System;
    
        /// <summary>
        /// The error page.
        /// </summary>
        public partial class GenericErrorPage : System.Web.UI.Page
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
                this.ViewStateUserKey = Session.SessionID;
            }
        }
    }
}
