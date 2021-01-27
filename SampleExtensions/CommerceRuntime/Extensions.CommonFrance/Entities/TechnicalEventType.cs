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
    namespace Commerce.Runtime.CommonFrance
    {
        using System.Runtime.Serialization;

        /// <summary>
        /// Technical event type.
        /// </summary>
        [DataContract]
        public enum TechnicalEventType : int
        {
            /// <summary>
            /// Unknown technical event.
            /// </summary>
            [EnumMember]
            Unknown = 0,

            /// <summary>
            /// The offline mode activated event.
            /// </summary>
            [EnumMember]
            OfflineModeOn = 70,

            /// <summary>
            /// The training mode activated and deactivated event.
            /// </summary>
            [EnumMember]
            Training = 100,

            /// <summary>
            /// The offline mode deactivated event.
            /// </summary>
            [EnumMember]
            OfflineModeOff = 120,

            /// <summary>
            /// The user logon and logoff event.
            /// </summary>
            [EnumMember]
            Log = 130,

            /// <summary>
            /// The purge transactions data event type.
            /// </summary>
            [EnumMember]
            PurgeTransactionsData = 200
        }
    }
}
