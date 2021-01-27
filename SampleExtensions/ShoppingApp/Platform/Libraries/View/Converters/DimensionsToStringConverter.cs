/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Localization;
using System;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.View.Converters
{
    /// <summary>
    /// Converts a list of Dimensions to a comma separated dimension values.
    /// </summary>
    class DimensionsToStringConverter : IValueConverter
    {
        /// <summary>
        /// Converts a list of Dimensions to a comma separated dimension values.
        /// </summary>
        /// <param name="value">The value to be converted.</param>
        /// <param name="targetType">The target type.</param>
        /// <param name="parameter">The parameter.</param>
        /// <param name="culture">The current culture.</param>
        /// <returns></returns>
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if(value == null || !(value is ObservableCollection<ProductDimension>))
            {
                return string.Empty;
            }

            var dimensions = (ObservableCollection<ProductDimension>)value;
            return string.Join(
                Translator.Instance.GetTranslation(nameof(TextResources.Separator_String)), 
                dimensions.Select(d => d.DimensionValue?.Value ?? string.Empty)
                );
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
