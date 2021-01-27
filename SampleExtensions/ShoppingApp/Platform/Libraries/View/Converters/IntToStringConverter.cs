/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Entities;
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
	class IntToStringConverter : IValueConverter
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
			if (value == null || !(value is int))
			{
				return string.Empty;
			}

			return System.Convert.ToString((int)value);
		}

		public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
		{
			int result;
			if (value == null || !(value is string && int.TryParse((string)value, out result)))
			{
				return 0;
			}
			else 
			{
				return result;
			}
		}
	}
}
