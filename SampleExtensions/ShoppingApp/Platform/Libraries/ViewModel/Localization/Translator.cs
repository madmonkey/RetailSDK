/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Localization;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Localization
{
    public class Translator
    {
        private CultureInfo culture;

        private static readonly Lazy<Translator> instance = new Lazy<Translator>(() => new Translator(CultureInfo.CurrentUICulture));

        public static Translator Instance
        {
            get
            {
                return instance.Value;
            }
        }

        public Translator(CultureInfo culture)
        {
            this.culture = culture;
        }
        public string GetTranslation(string key)
        {
            if (key == null)
                return "";

            string translation = EntryAssemblyTextResources.ResourceManager.GetString(key, this.culture);
            if (translation != null)
            {
                return translation;
            }

            translation = TextResources.ResourceManager.GetString(key, this.culture);
            if (translation == null)
            {
#if DEBUG
                throw new ArgumentException(
                    String.Format("Key '{0}' was not found in TextResources for culture '{1}'.", key, this.culture.Name),
                    "Text");
#else
                translation = key; // HACK: returns the key, which GETS DISPLAYED TO THE USER
#endif
            }
            return translation;
        }

        public string GetEnumTranslation(Enum e)
        {
            string key = TranslationKey.ForEnum(e);

            string translation = this.GetTranslation(key);

            return translation != null ? translation : Enum.GetName(e.GetType(), e);
        }
    }
}
