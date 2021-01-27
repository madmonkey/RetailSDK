/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Authentication
{
    class QueryStringHelper
    {
        public static List<KeyValuePair<string, string>> ParseNoDecode(string query)
        {
            ThrowIf.Null(query, nameof(query));
            if (query.StartsWith("?"))
            {
                query = query.Substring(1);
            }
            var result = new List<KeyValuePair<string, string>>();
            string[] pairs = query.Split('&');
            foreach (string pair in pairs)
            {
                string[] fields = pair.Split('=');
                result.Add(new KeyValuePair<string, string>(fields[0], fields.Length > 1 ? fields[1] : null));
            }
            return result;
        }

        public static string ConstructNoEncode(IEnumerable<KeyValuePair<string, string>> keyValuePairs)
        {
            ThrowIf.Null(keyValuePairs, nameof(keyValuePairs));
            StringBuilder sb = new StringBuilder();
            foreach (var pair in keyValuePairs)
            {
                if (sb.Length > 0)
                {
                    sb.Append('&');
                }
                sb.Append(pair.Key);
                if (pair.Value != null)
                {
                    sb.Append('=');
                    sb.Append(pair.Value);
                }
            }
            return sb.ToString();
        }
    }
}
