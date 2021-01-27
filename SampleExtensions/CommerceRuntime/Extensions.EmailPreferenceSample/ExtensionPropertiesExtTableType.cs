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
    namespace Commerce.Runtime.EmailPreferenceSample
    {
        using System.Collections.Generic;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;
        using Microsoft.Dynamics.Commerce.Runtime.Helpers;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Represents a table-value type parameter for sales line extension table.
        /// </summary>
        public sealed class ExtensionPropertiesExtTableType : TableType
        {
            private const string TableTypeName = "[ext].EXTENSIONPROPERTIESTABLETYPE";

            /// <summary>
            /// Initializes a new instance of the <see cref="ExtensionPropertiesExtTableType"/> class.
            /// </summary>
            /// <param name="parentRecordId">The parent record id.</param>
            /// <param name="properties">The properties.</param>
            public ExtensionPropertiesExtTableType(long parentRecordId, ICollection<CommerceProperty> properties)
            : base(TableTypeName)
            {
                ThrowIf.Null(properties, "properties");

                this.CreateTableSchema();

                foreach (CommerceProperty property in properties)
                {
                    DataRow row = this.GetDataRow(parentRecordId, property);
                    this.DataTable.Rows.Add(row);
                }
            }

            /// <summary>
            /// Creates the table schema.
            /// </summary>
            /// <remarks>
            /// The order of the data table columns MUST match the order specified in the TVP.
            /// </remarks>
            protected override void CreateTableSchema()
            {
                this.DataTable.Columns.Add(PropertyBagTableTypeFields.ParentRecordId, typeof(long));
                this.DataTable.Columns.Add(PropertyBagTableTypeFields.PropertyName, typeof(string)).MaxLength = 512;
                this.DataTable.Columns.Add(PropertyBagTableTypeFields.PropertyValue, typeof(string)).MaxLength = 512;
            }

            /// <summary>
            /// Gets the data row.
            /// </summary>
            /// <param name="parentRecordId">The parent record id.</param>
            /// <param name="property">The property.</param>
            /// <returns>A data row.</returns>
            private DataRow GetDataRow(long parentRecordId, CommerceProperty property)
            {
                DataRow row = this.DataTable.NewRow();

                row[PropertyBagTableTypeFields.ParentRecordId] = parentRecordId;
                row[PropertyBagTableTypeFields.PropertyName] = property.Key;

                var value = property.Value;
                if (value.HasBeenSet)
                {
                    row[PropertyBagTableTypeFields.PropertyValue] = value.GetPropertyValue().ToString();
                }

                return row;
            }

            /// <summary>
            /// Encapsulates all of the column names of the property bag table-value parameter.
            /// </summary>
            private static class PropertyBagTableTypeFields
            {
                internal const string ParentRecordId = "PARENTRECID";
                internal const string PropertyName = "PROPERTYNAME";
                internal const string PropertyValue = "PROPERTYVALUE";
            }
        }
    }
}
