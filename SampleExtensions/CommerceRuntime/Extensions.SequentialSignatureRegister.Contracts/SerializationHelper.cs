/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso
{
    namespace Commerce.Runtime.SequentialSignatureRegister.Contracts
    {
        using System.IO;
        using System.Runtime.Serialization.Json;
        using System.Text;
        using Microsoft.Dynamics.Commerce.Runtime;

        /// <summary>
        /// Encapsulates the serialization logic.
        /// </summary>
        public static class SerializationHelper
        {
            /// <summary>
            /// Serializes <c>SequentialSignatureData</c> to JSON string.
            /// </summary>
            /// <param name="sequentialSignatureRegisterableData">Sequential signature data to serialize.</param>
            /// <returns><c>SequentialSignatureData</c> serialized to JSON string.</returns>
            public static string SerializeSequentialSignatureDataToJson(SequentialSignatureRegisterableData sequentialSignatureRegisterableData)
            {
                ThrowIf.Null(sequentialSignatureRegisterableData, "sequentialSignatureRegisterableData");

                using (var memoryStream = new MemoryStream())
                {
                    string jsonString = string.Empty;
                    DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(sequentialSignatureRegisterableData.GetType());
                    jsonSerializer.WriteObject(memoryStream, sequentialSignatureRegisterableData);
                    memoryStream.Position = 0;
                    StreamReader reader = new StreamReader(memoryStream);
                    jsonString = reader.ReadToEnd();

                    return jsonString;
                }
            }

            /// <summary>
            /// Deserializes objects extending <c>SequentialSignatureData</c> from JSON string.
            /// </summary>
            /// <typeparam name="T">The type extending <c>SequentialSignatureData</c>, which input string should be deserialized to.</typeparam>
            /// <param name="source">The serialized JSON string.</param>
            /// <returns>Object deserialized from JSON string.</returns>
            public static T DeserializeSequentialSignatureDataFromJson<T>(string source) where T : SequentialSignatureRegisterableData
            {
                if (string.IsNullOrEmpty(source))
                {
                    return null;
                }

                using (MemoryStream memoryStream = new MemoryStream(Encoding.Unicode.GetBytes(source)))
                {
                    var serializer = new DataContractJsonSerializer(typeof(T));
                    return (T)serializer.ReadObject(memoryStream);
                }
            }
        }
    }
}