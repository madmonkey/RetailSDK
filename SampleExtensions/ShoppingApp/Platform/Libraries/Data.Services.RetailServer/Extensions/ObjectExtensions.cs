/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client.Data.Services.RetailServer
{
    using Entities;
    using System;
    using System.Reflection;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    /// <summary>
    /// Encapsulates functionality used to extend the <see cref="System.Object"/> class.
    /// </summary>
    internal static class ObjectExtensions
    {
        private static readonly JsonSerializerSettings SerializationSettings = new JsonSerializerSettings
        {
            TypeNameHandling = TypeNameHandling.None,
            NullValueHandling = NullValueHandling.Ignore,
            ContractResolver = new CommerceContractResolver()
        };

        /// <summary>
        /// Serializes the object to JSON.
        /// </summary>
        /// <param name="source">The source.</param>
        /// <returns>The JSON string.</returns>
        public static string SerializeToJsonObject(this object source)
        {
            return JsonConvert.SerializeObject(source, SerializationSettings);
        }

        /// <summary>
        /// The commerce contract resolver.
        /// </summary>
        private class CommerceContractResolver : DefaultContractResolver
        {
            private static readonly Type PagedResultType = typeof(PagedResult<>);

            /// <summary>
            /// Determines which contract type is created for the given type.
            /// </summary>
            /// <param name="objectType">Type of the object.</param>
            /// <returns>A <see cref="JsonContract"/> for the given type.</returns>
            protected override JsonContract CreateContract(Type objectType)
            {
                // Interfaces.g.cs defines all functions contract from CRT client manager to Proxy adapter layer and the return types
                // of which are limited to: primitive, Object and PagedResult<> for collection, thus it is safe to have PagedResult<>
                // serialized as Object type rather than Array type so that additional properties could be retained.
                if (objectType.GetTypeInfo().IsGenericType && objectType.GetGenericTypeDefinition() == PagedResultType)
                {
                    return this.CreateObjectContract(objectType);
                }
                else
                {
                    return base.CreateContract(objectType);
                }
            }
        }
    }
}