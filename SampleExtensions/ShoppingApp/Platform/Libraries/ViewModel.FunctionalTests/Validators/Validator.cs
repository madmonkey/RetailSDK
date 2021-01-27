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
using Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests
{
    public static class Validator
    {
        public static void AssertEqual<TEntity, TData>(string expectedFileName, ICollection<TEntity> actual, IContractResolver contractResolver)
            where TEntity : EntityBase<TData>
            where TData : CommerceEntity
        {
            string expectedJson = File.ReadAllText($@"Data\{expectedFileName}.json");
            //string expectedJson = Serialize<TEntity, TData>(JsonConvert.DeserializeObject<ICollection<TEntity>>(expectedJsonRaw), contractResolver);
            string actualJson = Serialize<TEntity, TData>(actual, contractResolver);
            if (expectedJson != actualJson)
            {
                Console.WriteLine(actual.ToJsonIndented());
            }
            Assert.AreEqual(expectedJson, actualJson);
        }

        private static string Serialize<TEntity, TData>(ICollection<TEntity> entities, IContractResolver contractResolver)
            where TEntity : EntityBase<TData>
            where TData : CommerceEntity
        {
            return JsonConvert.SerializeObject(entities, Formatting.Indented, new JsonSerializerSettings { ContractResolver = contractResolver });
        }

        public static void AssertEqual<TEntity, TData>(string expectedFileName, TEntity actual, IContractResolver contractResolver)
            where TEntity : EntityBase<TData>
            where TData : CommerceEntity
        {
            string expectedJson = File.ReadAllText($@"Data\{expectedFileName}.json");
            string actualJson = Serialize<TEntity, TData>(actual, contractResolver);
            if (expectedJson != actualJson)
            {
                Console.WriteLine(actual.ToJsonIndented());
            }
            Assert.AreEqual(expectedJson, actualJson);
        }

        private static string Serialize<TEntity, TData>(TEntity entity, IContractResolver contractResolver)
            where TEntity : EntityBase<TData>
            where TData : CommerceEntity
        {
            return JsonConvert.SerializeObject(entity, Formatting.Indented, new JsonSerializerSettings { ContractResolver = contractResolver });
        }
    }
}
