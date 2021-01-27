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
        using Android.App;
        using Android.OS;
        using Android.Preferences;
        using Android.Text;
        using Android.Widget;

        [Activity(Label = "Settings")]
        public class SettingsActivity : Activity
        {
            private Button saveButton = null;

            protected override void OnCreate(Bundle savedInstanceState)
            {
                base.OnCreate(savedInstanceState);
                this.SetContentView(Resource.Layout.Settings);

                this.saveButton = this.FindViewById<Button>(Resource.Id.saveSettings);
                this.saveButton.Click += (sender, args) => this.OnSaveButtonClicked();

                EditText textCloudPosUrlEditText = this.FindViewById<EditText>(Resource.Id.textCloudPosUrl);
                textCloudPosUrlEditText.TextChanged += this.OnTextCloudPosUrlTextChanged;
            }

            private void OnSaveButtonClicked()
            {
                var textCloudPosUrl = this.FindViewById<EditText>(Resource.Id.textCloudPosUrl);
                var cloudPosUrl = textCloudPosUrl.Text.Trim();

                if (!string.IsNullOrWhiteSpace(cloudPosUrl))
                {
                    PreferenceManager.GetDefaultSharedPreferences(this).SaveCloudPosUrl(cloudPosUrl);
                    this.Finish();
                }
            }

            private void OnTextCloudPosUrlTextChanged(object sender, TextChangedEventArgs e)
            {
                if (this.saveButton != null)
                {
                    // Enabled the save button only if the text is valid uri.
                    bool isAValidURI = Uri.TryCreate(e.Text.ToString(), UriKind.Absolute, out Uri uriResult)
                        && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
                    this.saveButton.Enabled = isAValidURI;
                }
            }
        }
    }
}