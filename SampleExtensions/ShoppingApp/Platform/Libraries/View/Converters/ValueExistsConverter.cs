/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using System;
using System.Globalization;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.View.Converters
{
    /// <summary>
    /// String to bool converter.
    /// </summary>
    class ValueExistsConverter : IValueConverter
    {
        /// <summary>
        /// Converts a string to a boolean which indicates if the string is not null and whitepsace.
        /// </summary>
        /// <param name="value">The value to be converted.</param>
        /// <param name="targetType">The target type.</param>
        /// <param name="parameter">The parameter.</param>
        /// <param name="culture">The current culture.</param>
        /// <returns>True if the value is a string which is not null or whitespace; false otherwise.</returns>
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value == null)
            {
                return false;
            }
            else if (value is string && string.IsNullOrWhiteSpace((string)value))
            {
                return false;
            }
            else if (value is int && (int)value == 0)
            {
                return false;
            }
            else if (value is decimal && (decimal)value == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
