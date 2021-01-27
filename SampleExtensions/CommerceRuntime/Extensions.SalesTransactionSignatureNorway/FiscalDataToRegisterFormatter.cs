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
        using System.Globalization;

        /// <summary>
        /// Encapsulates formatting operations required to prepare data for fiscal registration.
        /// </summary>
        internal static class FiscalDataToRegisterFormatter
        {
            private const string FieldDelimiter = ";";

            private const string TimeFormat = "hh:mm:ss";

            private const string DateFormat = "yyyy-MM-dd";

            /// <summary>
            /// Gets formatted data to register string for specified collection of separate fields.
            /// </summary>
            /// <param name="dataToRegisterFields">Separate fields of data to register string.</param>
            /// <returns>Formatted string.</returns>
            public static string GetFormattedDataToRegister(IEnumerable<string> dataToRegisterFields)
            {
                return string.Join(FieldDelimiter, dataToRegisterFields);
            }

            /// <summary>
            /// Gets formatted date.
            /// </summary>
            /// <param name="date">The date to be formatted.</param>
            /// <returns>Formatted string.</returns>
            public static string GetFormattedDate(DateTimeOffset date)
            {
                return date.ToString(DateFormat);
            }

            /// <summary>
            /// Gets formatted time.
            /// </summary>
            /// <param name="time">The time to be formatted.</param>
            /// <returns>Formatted string.</returns>
            public static string GetFormattedTime(DateTimeOffset time)
            {
                return time.ToString(TimeFormat);
            }

            /// <summary>
            /// Gets formatted sequential number.
            /// </summary>
            /// <param name="sequentialNumber">The sequential number to be formatted.</param>
            /// <returns>Formatted string.</returns>
            public static string GetFormattedSequentialNumber(long sequentialNumber)
            {
                return sequentialNumber.ToString();
            }

            /// <summary>
            /// Gets formatted amount.
            /// </summary>
            /// <param name="amount">The amount to be formatted.</param>
            /// <returns>Formatted string.</returns>
            public static string GetFormattedAmount(decimal amount)
            {
                return amount.ToString("0.00", CultureInfo.InvariantCulture);
            }
        }
    }
}