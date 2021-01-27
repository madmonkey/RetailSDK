/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client.Data.Services
{
    using Authentication;
    using System;
    using System.Globalization;

    public interface IManagerFactory
    {
        void Initialize(Uri serviceUrl, string operatingUnitNumber, string locale);

        /// <summary>
        /// Gets the manager.
        /// </summary>
        /// <typeparam name="T">The type of entity manager.</typeparam>
        /// <returns>The instance of the manager.</returns>
        T GetManager<T>() where T : IEntityManager;

        UserToken UserToken { get;  set; }

        string Locale { get;  set; }
    }
}
