/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Localization;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    public class AttributeValue : EntityBase<Data.Entities.AttributeValue>
	{
		public AttributeValue(Data.Entities.AttributeValue attributeValue) : base(attributeValue)
		{
		}

        public string Value
        {
            get
            {
                switch ((AttributeDataType)Data.DataTypeValue)
                {
                    case AttributeDataType.Currency:
                        return string.Format(Translator.Instance.GetTranslation(nameof(TextResources.AttributeDataTypeFormatCurrency)), Data.CurrencyCode, Data.CurrencyValue);
                    case AttributeDataType.DateTime:
                        return string.Format(Translator.Instance.GetTranslation(nameof(TextResources.AttributeDataTypeFormatDateTime)), Data.DateTimeOffsetValue);
                    case AttributeDataType.Decimal:
                        return string.Format(Translator.Instance.GetTranslation(nameof(TextResources.AttributeDataTypeFormatDecimal)), Data.FloatValue);
                    case AttributeDataType.Integer:
                        return string.Format(Translator.Instance.GetTranslation(nameof(TextResources.AttributeDataTypeFormatInteger)));
                    case AttributeDataType.Text:
                        return Data.TextValue;
                    case AttributeDataType.TrueFalse:
                        return string.Format(Translator.Instance.GetTranslation(nameof(TextResources.AttributeDataTypeFormatBoolean)), Data.BooleanValue);
                    default:
                        return string.Empty;
                }
            }
        }
	}
}

