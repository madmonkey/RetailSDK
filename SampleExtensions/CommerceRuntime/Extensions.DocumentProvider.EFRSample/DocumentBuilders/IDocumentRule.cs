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
    namespace Commerce.Runtime.DocumentProvider.EFRSample.DocumentBuilders
    {
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using Contoso.Commerce.Runtime.DocumentProvider.DataModelEFR.Documents;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;

        /// <summary>
        /// Document builder rule.
        /// </summary>
        /// <remarks>Document rule interface to support document creation for multiple countries/regions.</remarks>
        public interface IDocumentRule
        {
            /// <summary>
            /// Adds country/region specific receipt positions to the collection of receipt positions.
            /// </summary>
            /// <param name="positions">The collection of receipt positions.</param>
            void AddCountryRegionSpecificPositions(List<ReceiptPosition> positions);

            /// <summary>
            /// Adds receipt positions for customer account deposit.
            /// </summary>
            void AddCustomerAccountDepositPositions(List<ReceiptPosition> positions);

            /// <summary>
            /// Checks if the document generation required.
            /// </summary>
            /// <returns>True if document generation required; False otherwise.</returns>
            bool IsDocumentGenerationRequired();

            /// <summary>
            /// Creates receipt taxes for customer account deposit transaction.
            /// </summary>
            /// <returns>The receipt taxes collection.</returns>
            List<ReceiptTax> CreateCustomerAccountDepositReceiptTaxes();

            /// <summary>
            /// Creates receipt taxes for sales transaction.
            /// </summary>
            /// <returns>The receipt taxes collection.</returns>
            List<ReceiptTax> CreateSalesTransactionReceiptTaxes();

            /// <summary>
            /// Adds localization information to receipt.
            /// </summary>
            /// <param name="receipt">The receipt.</param>
            void AddLocalizationInfoToReceipt(DataModelEFR.Documents.Receipt receipt);

            /// <summary>
            /// Adds localization information to receipt payment.
            /// </summary>
            /// <param name="payment">The receipt payment.</param>
            void AddLocalizationInfoToPayment(DataModelEFR.Documents.ReceiptPayment payment);

            /// <summary>
            /// Gets the customer account deposit transaction type string.
            /// </summary>
            /// <returns>Returns an empty string.</returns>
            string GetCustomerAccountDepositTransactionType();
 
            /// <summary>
            /// Get the receipt payment for deposit payment.
            /// </summary>
            /// <returns>The receipt payment for deposit payment.</returns>
            ReceiptPayment GetDepositTenderLine();

            /// <summary>
            /// Gets the non-fiscal transaction type string.
            /// </summary>
            /// <returns>The non-fiscal transaction type string.</returns>
            string GetNonFiscalTransactionType();

            /// <summary>
            /// Gets the sales line for document creation.
            /// </summary>
            /// <returns>The sales lines collection.</returns>
            IEnumerable<SalesLine> GetSalesLines();

            /// <summary>
            /// Gets the tax groups for sales line.
            /// </summary>
            /// <param name="salesLine">The sales line.</param>
            /// <returns>The tax groups string.</returns>
            string GetSalesLineTaxGroups(SalesLine salesLine);

            /// <summary>
            /// Checks if the positions can be created.
            /// </summary>
            /// <returns>True if positions can be created; False otherwise.</returns>
            bool CanСreatePositions();

            /// <summary>
            /// Sets the referenced receipt position's fields.
            /// </summary>
            /// <param name="receiptPosition">The receipt position.</param>
            /// <param name="salesLine">The sales line.</param>
            Task SetReferenceFieldsAsync(ReceiptPosition receiptPosition, SalesLine salesLine);

            /// <summary>
            /// Creates receipt payments.
            /// </summary>
            /// <returns>The receipt payments.</returns>
            Task<List<ReceiptPayment>> CreateReceiptPaymentsAsync();

            /// <summary>
            /// Creates receipt payments without currency information.
            /// </summary>
            /// <returns>The receipt payments.</returns>
            Task<List<ReceiptPayment>> CreateReceiptPaymentsWithoutCurrencyAsync();

            /// <summary>
            /// Creates receipt payments with currency information.
            /// </summary>
            /// <returns>The receipt payments.</returns>
            Task<List<ReceiptPayment>> CreateReceiptPaymentsWithCurrencyAsync();

            /// <summary>
            /// Creates receipt customer data.
            /// </summary>
            /// <param name="receipt">The receipt.</param>
            void AddCustomerDataToReceipt(DataModelEFR.Documents.Receipt receipt);

            /// <summary>
            /// Adds localization information to customer account deposit receipt payment.
            /// </summary>
            /// <param name="payment">The receipt payment.</param>
            /// <param name="tenderTypeId">The payment tender type id.</param>
            void AddLocalizationInfoToCustomerPayment(ReceiptPayment payment, string tenderTypeId);

            /// <summary>
            /// Calculates total payment amount.
            /// </summary>
            /// <returns>The total payment amount.</returns>
            decimal GetTotalAmount();
        }
    }
}