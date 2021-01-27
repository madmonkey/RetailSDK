/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client
{
    using System;
    using System.Collections;
    using System.Diagnostics;

    /// <summary>
    /// Encapsulates helper methods used to validate arguments.
    /// </summary>
    /// <remarks>
    /// The methods defined in this class satisfy the CA1062 violation.
    /// </remarks>
    public static class ThrowIf
    {
        /// <summary>
        /// Throws ArgumentNullException if the argument is null, otherwise passes it through.
        /// </summary>
        /// <typeparam name="T">The argument type.</typeparam>
        /// <param name="arg">The argument to check.</param>
        /// <param name="parameterName">The parameter name of the argument.</param>
        [DebuggerStepThrough]
        public static void Null<T>([ValidatedNotNull]T arg, string parameterName) where T : class
        {
            if (arg == null)
            {
                throw new ArgumentNullException(parameterName);
            }
        }

        /// <summary>
        /// Throws an ArgumentNullException if the string is null or only whitespace.
        /// </summary>
        /// <param name="arg">The argument to check.</param>
        /// <param name="parameterName">The parameter name of the argument.</param>
        [DebuggerStepThrough]
        public static void NullOrWhiteSpace([ValidatedNotNull]string arg, string parameterName)
        {
            if (string.IsNullOrWhiteSpace(arg))
            {
                throw new ArgumentNullException(parameterName);
            }
        }

        /// <summary>
        /// Throws an ArgumentException if the argument is null or empty.
        /// </summary>
        /// <param name="arg">The argument to check.</param>
        /// <param name="parameterName">The parameter name of the argument.</param>
        [DebuggerStepThrough]
        public static void NullOrEmpty([ValidatedNotNull]ICollection arg, string parameterName)
        {
            if (arg == null)
            {
                throw new ArgumentNullException(parameterName);
            }

            if (arg.Count == 0)
            {
                throw new ArgumentException("The specified collection cannot be empty.", parameterName);
            }
        }

        /// <summary>
        /// Throws ArgumentOutOfRangeException if the argument is empty GUID.
        /// </summary>
        /// <param name="value">The argument to check.</param>
        /// <param name="parameterName">The parameter name of the argument.</param>
        [DebuggerStepThrough]
        public static void EmptyGuid(Guid value, string parameterName)
        {
            if (value == Guid.Empty)
            {
                throw new ArgumentOutOfRangeException(parameterName, "Guid should not be empty.");
            }
        }

        /// <summary>
        /// Throws ArgumentOutOfRangeException if the enumeration value is undefined.
        /// </summary>
        /// <param name="enumeration">The argument to check.</param>
        /// <param name="parameterName">The parameter name of the argument.</param>
        [DebuggerStepThrough]
        public static void Undefined(Enum enumeration, string parameterName)
        {
            ThrowIf.Null(enumeration, "enumeration");

            if (!Enum.IsDefined(enumeration.GetType(), enumeration))
            {
                throw new ArgumentOutOfRangeException(parameterName, "Enum value should exists in a specified enumeration.");
            }
        }

        /// <summary>
        /// Secret attribute that tells the CA1062 validate arguments rule that this method validates the argument is not null.
        /// </summary>
        [AttributeUsage(AttributeTargets.Parameter)]
        private sealed class ValidatedNotNullAttribute : Attribute
        {
        }
    }
}