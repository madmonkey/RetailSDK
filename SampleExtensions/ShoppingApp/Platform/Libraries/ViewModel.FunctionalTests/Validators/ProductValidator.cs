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
using System.Text;
using System.Threading.Tasks;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities;
using Newtonsoft.Json.Serialization;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.ContractResolvers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Validators
{
    public static class ProductValidator
    {
        public static void AssertEqual(string expected, ICollection<ProductSearchResult> actual)
        {
            Validator.AssertEqual<ProductSearchResult, Data.Entities.ProductSearchResult>(expected, actual, ProductSearchResultContractResolver.Instance);
        }


        public static void AssertEqual(string expected, Product actual)
        {
            Validator.AssertEqual<Product, Data.Entities.SimpleProduct>(expected, actual, ProductContractResolver.Instance);
        }
       
    }
}
