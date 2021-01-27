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
        using Android.Content;

        /// <summary>
        /// Preference extensions.
        /// </summary>
        internal static class PreferenceExtensions
        {
            private const string RetailCloudPosUrlSetting = "RetailCloudPosUrl";

            /// <summary>
            /// Reads the Retail Cloud Pos Url from settings.
            /// </summary>
            /// <param name="preferences">The preferences.</param>
            /// <returns>The cloud pos url.</returns>
            public static string ReadCloudPosUrl(this ISharedPreferences preferences)
            {
                return preferences.GetString(PreferenceExtensions.RetailCloudPosUrlSetting, string.Empty);
            }

            /// <summary>
            /// Saves the Retail Cloud Pos Url from settings.
            /// </summary>
            /// <param name="preferences">The preferences.</param>
            /// <param name="url">The cloud pos url.</param>
            public static void SaveCloudPosUrl(this ISharedPreferences preferences, string url)
            {
                ISharedPreferencesEditor editor = preferences.Edit();

                editor.PutString(PreferenceExtensions.RetailCloudPosUrlSetting, url);
                editor.Commit();
            }
        }
    }
}