﻿/**
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
        using System.Runtime.Serialization;

        /// <summary>
        /// Registration sequence type enumeration.
        /// </summary>
        [DataContract]
        public enum RegistrationSequenceType : int
        {
            /// <summary>
            /// Default value.
            /// </summary>
            [EnumMember]
            None = 0,

            /// <summary>
            /// Value reserved for sequential events related to sales transaction .
            /// </summary>
            [EnumMember]
            Sales = 1,

            /// <summary>
            /// Value reserved for sequential events related to printing a copy of receipt.
            /// </summary>
            [EnumMember]
            ReceiptCopy = 2,

            /// <summary>
            /// Value reserved for sequential events related to shift closing.
            /// </summary>
            [EnumMember]
            ShiftClose = 3,

            /// <summary>
            /// Value reserved for sequential technical event.
            /// </summary>
            [EnumMember]
            TechnicalEvent = 4
        }
    }
}