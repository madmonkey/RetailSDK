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
    namespace Commerce.Client.Pos
    {
        using System;
        using System.IO;
        using System.Xml;
        using System.Xml.Serialization;

        /// <summary>
        /// XML Asset Reader class.
        /// </summary>
        public static class XmlAssetReader
        {
            /// <summary>
            /// Reads and parse asset file.
            /// </summary>
            /// <param name="filename">Name of file to read.</param>
            /// <param name="type">The type of the object to serialize to.</param>
            /// <returns>Serialized object.</returns>
            public static object ReadAssetFile(string filename, Type type)
            {
                object result;

                using (var asset = global::Android.App.Application.Context.Assets.Open(filename))
                using (var reader = new StreamReader(asset))
                {
                    var serializer = new XmlSerializer(type);
                    using (var xmlReader = XmlReader.Create(reader))
                    {
                        result = serializer.Deserialize(xmlReader);
                    }
                }

                return result;
            }
        }
    }
}