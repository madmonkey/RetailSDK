/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client.ShoppingApp.View.Statics
{
    public static class Sizes
    {
        public readonly static double ChevronSizeDouble = 20;
        public static int ChevronSizeInt { get { return (int)ChevronSizeDouble; } }

        public readonly static double ListActivityIndicatorDouble = 50;
        public static int ListActivityIndicatorInt { get { return (int)ListActivityIndicatorDouble; } }

        public readonly static double CategoryListRowSizeDouble = 110;
        public static int CategoryListRowSizeInt { get { return (int)CategoryListRowSizeDouble; } }
    }
}
