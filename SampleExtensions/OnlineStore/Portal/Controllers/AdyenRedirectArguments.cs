namespace Contoso.Retail.Ecommerce.Web.Storefront.Controllers
{
    /// <summary>
    /// Represents Redirect Arguments used in Adyen POST response.
    /// </summary>
    public class AdyenRedirectArguments
    {
        /// <summary>
        /// The MD parameter.
        /// </summary>
        public string MD { get; set; }

        /// <summary>
        /// The PaRes parameter.
        /// </summary>
        public string PaRes { get; set; }
    }
}