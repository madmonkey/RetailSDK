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

    [CLSCompliant(false)]
    public partial class EvaluationModeSettingsPage : EvaluationModeSettingsPageXaml
    {
        public EvaluationModeSettingsPage()
        {
            InitializeComponent();
        }

        async void CancelButtonClicked(object sender, EventArgs e)
        {
            await Navigation.PopModalAsync();
        }

        void SaveButtonClicked(object sender, System.EventArgs e)
        {
            App.Current.GoToRoot();
        }

        void ResetButtonClicked(object sender, EventArgs e)
        {
            App.Current.GoToRoot();
        }
    }

    [CLSCompliant(false)]
    public class EvaluationModeSettingsPageXaml : ModelBoundContentPage<ViewModel.EvaluationModeSettingsPage> { }
}
