/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

// The MIT License (MIT)
// 
// Copyright (c) 2015 Xamarin
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

namespace Contoso.Commerce.Client.ShoppingApp.View.Statics
{
    using System;
    using ViewModel.Configurations;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public class Palette
    {
        private static readonly Lazy<Palette> current = new Lazy<Palette>(() => new Palette());

        public static Palette Current
        {
            get
            {
                return current.Value;
            }
        }

        /// <summary>
        ///  Primary color. Navigation/Action bar.
        /// </summary>
        public Color Primary
        {
            get
            {
                return ConfigurationManager.Instance.PalletConfiguration.Primary;
            }
        }

        /// <summary>
        /// Secondary color. Device status bar on Android.
        /// </summary>
        public Color PrimaryDark
        {
            get
            {
                return ConfigurationManager.Instance.PalletConfiguration.PrimaryDark;
            }
        }

        /// <summary>
        /// Ternary color. Accent color on Android.
        /// </summary>
        public Color Accent 
        {
            get
            {
                return ConfigurationManager.Instance.PalletConfiguration.Accent;
            }
        }

        /// <summary>
        /// Button background color.
        /// </summary>
        public Color ActionButtonBackground
        {
            get
            {
                return ConfigurationManager.Instance.PalletConfiguration.ActionButtonBackground;
            }
        }

        /// <summary>
        /// Button text color.
        /// </summary>
        public Color ActionButtonText
        {
            get
            {
                return ConfigurationManager.Instance.PalletConfiguration.ActionButtonText;
            }
        }

        /// <summary>
        /// Primary (dark) label color.
        /// </summary>
        public static readonly Color TEXT_DARK = Color.FromHex("4D4D4D");

        /// <summary>
        /// Secondary (light) label color.
        /// </summary>
        public static readonly Color TEXT_LIGHT = Color.FromHex("999999");

        /// <summary>
        /// A separator color.
        /// </summary>
        public static readonly Color SEPARATOR = Color.FromHex("DDDDDD");

        /// <summary>
        /// A shade of red that Google uses.
        /// </summary>
        public static readonly Color GOOGLE_BACKGROUND = Color.FromHex("4285F4");

        /// <summary>
        /// White color for text.
        /// </summary>
        public static readonly Color GOOGLE_TEXT = Color.White;

        /// <summary>
        /// Color for displaying pricing.
        /// </summary>
        public static readonly Color PRICE = Color.Green;

        /// <summary>
        /// Color for displaying discounts.
        /// </summary>
        public static readonly Color Discount = Color.Green;

        /// <summary>
        /// Color for displaying Uri.
        /// </summary>
        public static readonly Color Hyperlink = Color.Blue;
    }
}