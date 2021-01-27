/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.ShoppingApp.View.Statics;
using System;
using System.Collections.Generic;
using System.Globalization;
using Contoso.Commerce.Client.Data.Entities;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.View.Converters
{
    /// <summary>
    /// Convertes the <c>SalesStatus</c> enum value to a corresponding text color value that will be used to write the text on the view.
    /// </summary>
    public class SalesStatusColorConverter: IValueConverter
    {
        /// <summary>
        /// Convertes the <c>SalesStatus</c> enum value to a corresponding text color value that will be used to write the text on the view.
        /// </summary>
        /// <param name="value">The value to be converted.</param>
        /// <param name="targetType">The target type.</param>
        /// <param name="parameter">The parameter.</param>
        /// <param name="culture">The current culture.</param>
        /// <returns>The <c>Color</c> object.</returns>
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if(value == null || !(value is SalesStatus))
            {
                return string.Empty;
            }

            switch ((SalesStatus)value)
            {
                case SalesStatus.Processing:
                case SalesStatus.Created:
                case SalesStatus.Unknown:
                    return Color.Blue;
                case SalesStatus.Delivered:
                    return Color.Green;
                case SalesStatus.Canceled:
                case SalesStatus.Lost:
                    return Color.Red;
                default:
                    return Palette.TEXT_LIGHT;
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
