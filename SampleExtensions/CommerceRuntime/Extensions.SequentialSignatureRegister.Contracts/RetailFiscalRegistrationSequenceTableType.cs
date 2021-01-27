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
        using Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Data;
        using Microsoft.Dynamics.Commerce.Runtime.Data.Types;

        /// <summary>
        /// Represents a table-value type parameter for retail fiscal registration sequence table.
        /// </summary>
        public sealed class RetailFiscalRegistrationSequenceTableType : TableType
        {
            // Table type column names.
            internal const string DataAreaIdColumnName = "DATAAREAID";
            internal const string ChannelIdColumnName = "CHANNELID";
            internal const string SequenceTypeColumnName = "SEQUENCETYPE";
            internal const string SequentialNumberColumnName = "SEQUENTIALNUMBER";
            internal const string LastRegisterResponseColumnName = "LASTREGISTERRESPONSE";
            internal const string StoreColumnName = "STORE";
            internal const string TerminalColumnName = "TERMINAL";

            // Table type name.
            private const string TableTypeName = "RETAILFISCALREGISTRATIONSEQUENCETABLETYPE";

            /// <summary>
            /// Initializes a new instance of the <see cref="RetailFiscalRegistrationSequenceTableType"/> class.
            /// </summary>
            /// <param name="sequentialSignatureData">The sequential signature data.</param>
            /// <param name="sequenceType">The sequence type.</param>
            /// <param name="dataAreaId">The data area identifier.</param>
            /// <param name="channelId">The channel identifier.</param>
            /// <param name="storeNumber">The store number.</param>
            /// <param name="terminalId">The terminal identifier.</param>
            public RetailFiscalRegistrationSequenceTableType(SequentialSignatureData sequentialSignatureData, int sequenceType, string dataAreaId, long channelId, string storeNumber, string terminalId)
                : base(TableTypeName)
            {
                this.CreateTableSchema();

                var row = this.CreateDataRow(sequentialSignatureData, sequenceType, dataAreaId, channelId, storeNumber, terminalId);
                this.DataTable.Rows.Add(row);
            }

            /// <summary>
            /// Creates the table schema.
            /// </summary>
            /// <remark>The order of columns here must match the RETAILFISCALREGISTRATIONSEQUENCETABLETYPE</remark>
            protected override void CreateTableSchema()
            {
                this.DataTable.Columns.Add(DataAreaIdColumnName, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(ChannelIdColumnName, typeof(long)).DefaultValue = 0;
                this.DataTable.Columns.Add(SequenceTypeColumnName, typeof(int)).DefaultValue = 0;
                this.DataTable.Columns.Add(SequentialNumberColumnName, typeof(int)).DefaultValue = 0;
                this.DataTable.Columns.Add(LastRegisterResponseColumnName, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(StoreColumnName, typeof(string)).DefaultValue = string.Empty;
                this.DataTable.Columns.Add(TerminalColumnName, typeof(string)).DefaultValue = string.Empty;
            }

            /// <summary>
            /// Creates the data row.
            /// </summary>
            /// <param name="sequentialSignatureData">The sequential signature data.</param>
            /// <param name="sequenceType">The sequence type.</param>
            /// <param name="dataAreaId">The data area identifier.</param>
            /// <param name="channelId">The channel identifier.</param>
            /// <param name="storeNumber">The store number.</param>
            /// <param name="terminalId">The terminal identifier.</param>
            /// <returns>The data row.</returns>
            private DataRow CreateDataRow(SequentialSignatureData sequentialSignatureData, int sequenceType, string dataAreaId, long channelId, string storeNumber, string terminalId)
            {
                DataRow row = this.DataTable.NewRow();

                row[RetailTransactionTableSchema.DataAreaIdColumn] = dataAreaId;
                row[RetailTransactionTableSchema.ChannelIdColumn] = channelId;
                row[SequenceTypeColumnName] = sequenceType;
                row[SequentialNumberColumnName] = sequentialSignatureData.SequentialNumber;
                row[LastRegisterResponseColumnName] = sequentialSignatureData.Signature;
                row[RetailTransactionTableSchema.StoreColumn] = storeNumber;
                row[RetailTransactionTableSchema.TerminalColumn] = terminalId;

                return row;
            }
        }
    }
}
