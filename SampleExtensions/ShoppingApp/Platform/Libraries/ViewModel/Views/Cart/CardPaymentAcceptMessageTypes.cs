/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    public class CardPaymentAcceptMessageTypes
    {
        // Messages defined by Shopping app
        public const string HostReady = "msax-cc-hostready";

        // Messages defined by Payment
        public const string CardPrefix = "msax-cc-cardprefix";
        public const string Error = "msax-cc-error";
        public const string Height = "msax-cc-height";
        public const string Result = "msax-cc-result";
        public const string Submit = "msax-cc-submit";
    }
}
