/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Autofac;
using System;
using System.Globalization;

namespace Contoso.Commerce.Client.Plugins
{
    public class CrossCrypto
    {
        private static readonly Lazy<ICrypto> crypto = new Lazy<ICrypto>(() => AppContainer.Resolve<ICrypto>());

        public static ICrypto Crypto
        {
            get
            {
                return crypto.Value;
            }
        }
    }
}

