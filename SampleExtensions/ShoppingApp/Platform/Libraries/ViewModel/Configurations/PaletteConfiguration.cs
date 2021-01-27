/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Configurations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using Xamarin.Forms;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Configurations
{
    [CLSCompliant(false)]
    public class PalletConfiguration : ConfigurationBase
    {
        public Color Primary
        {
            get
            {
                return ColorFor("Primary");
            }
        }

        public Color PrimaryDark
        {
            get
            {
                return ColorFor("PrimaryDark");
            }
        }

        public Color Accent
        {
            get
            {
                return ColorFor("Accent");
            }
        }

        public Color AddToCart
        {
            get
            {
                return ColorFor("AddToCart");
            }
        }

        public Color ActionButtonBackground
        {
            get
            {
                return ColorFor("ActionButtonBackground");
            }
        }
        
        public Color ActionButtonText
        {
            get
            {
                return ColorFor("ActionButtonText");
            }
        }

        public PalletConfiguration(XElement element) : base(element)
        {
        }

        public Color ColorFor(string key)
        {
            return (Color)new ColorTypeConverter().ConvertFromInvariantString(Element.Element(key)?.Value);
        }
    }
}
