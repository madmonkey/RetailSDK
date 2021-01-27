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
    namespace Commerce.Runtime.SalesTransactionSignatureNorway
    {
        using System;
        using System.Collections.Generic;
        using System.Linq;
        using Commerce.Runtime.SequentialSignatureRegister.Contracts;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime;
        using System.Threading.Tasks;

        /// <summary>
        /// Norway-specific registration adapter for <c>SalesTransaction</c>.
        /// </summary>
        public class RegistrableEventSalesTransactionAdapterNorway : RegistrableEventSalesTransactionAdapter
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="RegistrableEventSalesTransactionAdapterNorway" /> class.
            /// </summary>
            /// <param name="transaction">The sales transaction to register.</param>
            /// <param name="requestContext">The request context.</param>
            public RegistrableEventSalesTransactionAdapterNorway(SalesTransaction transaction, RequestContext requestContext)
                : base(transaction, requestContext)
            {
            }

            /// <summary>
            /// Determines whether registration of event is required.
            /// </summary>
            /// <returns>True if event should be registered; False otherwise.</returns>
            public override bool IsRegistrationRequired()
            {
                return SalesTransactionSigningStrategy.IsSigningRequired(this.SalesTransaction);
            }

            /// <summary>
            /// Gets string representation of data to register.
            /// </summary>
            /// <returns>String representation of data to register.</returns>
            public override async Task<string> GetDataToRegisterAsync()
            {
                long sequentialNumber = this.SequentialNumber;
                string lastRegisterResponse = this.GetPreviousTransactionSignature(this.SalesTransaction);
                DateTimeOffset timeNow = this.RequestContext.GetNowInChannelTimeZone();

                IEnumerable<SalesLine> salesLinesForSigning = SalesTransactionSigningStrategy.GetSaleLinesForSigning(this.SalesTransaction);
                decimal transactionAmntIn = salesLinesForSigning.Sum(line => line.TotalAmount);
                decimal transactionAmntEx = salesLinesForSigning.Sum(line => line.TotalAmount - line.TaxAmount);

                List<string> dataToRegisterFields = new List<string>();

                dataToRegisterFields.Add(lastRegisterResponse);
                dataToRegisterFields.Add(FiscalDataToRegisterFormatter.GetFormattedDate(timeNow));
                dataToRegisterFields.Add(FiscalDataToRegisterFormatter.GetFormattedTime(timeNow));
                dataToRegisterFields.Add(FiscalDataToRegisterFormatter.GetFormattedSequentialNumber(sequentialNumber));
                dataToRegisterFields.Add(FiscalDataToRegisterFormatter.GetFormattedAmount(transactionAmntIn));
                dataToRegisterFields.Add(FiscalDataToRegisterFormatter.GetFormattedAmount(transactionAmntEx));

                return await Task.FromResult(FiscalDataToRegisterFormatter.GetFormattedDataToRegister(dataToRegisterFields));
            }

            /// <summary>
            /// Persists register response after successful registration.
            /// </summary>
            public override async Task PersistRegisterResponseAsync()
            {
                // Left empty on purpose.
                // It's only stub to handle async signature 
                await Task.CompletedTask;
            }
        }
    }
}
