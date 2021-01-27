/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */


namespace Contoso.Commerce.Client.ShoppingApp.View.Pages
{
    using Base;
    using System;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public partial class AboutPage: AboutPageXaml
    {
        public AboutPage()
        {
            InitializeComponent();
        }

        void OnTermsOfUseControlTapped(object sender, EventArgs e)
        {
            if (ViewModel.TermsOfUseUrl != null)
            {
                Device.OpenUri(ViewModel.TermsOfUseUrl);
            }
        }

        void OnPrivacyPolicyControlTapped(object sender, EventArgs e)
        {
            if (ViewModel.PrivacyPolicyUrl != null)
            {
                Device.OpenUri(ViewModel.PrivacyPolicyUrl);
            }
        }

        void OnThirdPartyNoticesControlTapped(object sender, EventArgs e)
        {
            if (ViewModel.ThirdPartyNotices != null)
            {
                Device.OpenUri(ViewModel.ThirdPartyNotices);
            }
        }
    }

    [CLSCompliant(false)]
    public class AboutPageXaml : ModelBoundContentPage<ViewModel.AboutPage> { }
}
