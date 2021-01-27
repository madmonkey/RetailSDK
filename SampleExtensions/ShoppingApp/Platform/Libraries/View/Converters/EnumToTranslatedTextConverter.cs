/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Localization;
using Contoso.Commerce.Client.ShoppingApp.View.Localization;
using System;
using System.Globalization;
using System.Reflection;
using Xamarin.Forms;
namespace Contoso.Commerce.Client.ShoppingApp.View.Converters
{
    /// <summary>
    /// Converts the label of an Enum to a text translated to the current culture.
    /// </summary>
    class EnumToTranslatedTextConverter : IValueConverter
    {
        /// <summary>
        /// Converts the label of an Enum to a text translated to the current culture.
        /// The resource string for the label should be in the form 'Enum_{EnumTypeName}_{EnumValueLabel}'.
        /// </summary>
        /// <param name="value">The value to be converted.</param>
        /// <param name="targetType">The target type.</param>
        /// <param name="parameter">The parameter.</param>
        /// <param name="culture">The curent culture.</param>
        /// <returns>The translated text for the label of the specified enum value.</returns>
        /// <remarks>An empty string is returned if value is not an enum</remarks>
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value != null && value.GetType().GetTypeInfo().IsEnum)
            {
                TranslateExtension translateExtension = new TranslateExtension
                {
                    Text = TranslationKey.ForEnum((Enum)value)
                };

                string translation = (string)translateExtension.ProvideValue(null);

                return translation != null ? translation : Enum.GetName(value.GetType(), (int)value);
            }
            else
            {
                return string.Empty;
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
