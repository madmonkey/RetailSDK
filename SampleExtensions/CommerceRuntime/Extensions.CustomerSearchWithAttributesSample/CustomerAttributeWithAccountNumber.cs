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
    namespace Commerce.Runtime.DataModel
    {
        using System.Diagnostics.CodeAnalysis;
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.ComponentModel.DataAnnotations;

        /// <summary>
        /// Represents a customer attribute, with the added utility of knowing the customer account number this attribute belongs to.
        /// </summary>
        [SuppressMessage("Microsoft.Performance", "CA1812:AvoidUninstantiatedInternalClasses", Justification = "False positive. This class is instantiated by calls to databaseContext.ReadEntity.")]
        public class CustomerAttributeWithAccountNumber : Microsoft.Dynamics.Commerce.Runtime.DataModel.CustomerAttribute
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="CustomerAttributeWithAccountNumber"/> class.
            /// </summary>
            public CustomerAttributeWithAccountNumber()
                : base()
            {
            }

            /// <summary>
            /// Gets or sets the account number of the customer this attribute belongs to.
            /// </summary>
            [DataMember]
            [Column(AccountNumberColumn)]
            public string AccountNumber
            {
                get { return (string)this[AccountNumberColumn] ?? string.Empty; }
                set { this[AccountNumberColumn] = value; }
            }
        }
    }
}
