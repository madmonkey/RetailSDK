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
        using System.Runtime.Serialization;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Framework;

        /// <summary>
        /// The extensible audit event type enumeration class with additional audit events for France.
        /// </summary>
        public class FranceExtensibleAuditEventType : ExtensibleAuditEventType
        {
            /// <summary>
            /// Offline mode on audit event type name.
            /// </summary>
            private const string OfflineModeOnName = "OfflineModeOn";

            /// <summary>
            /// Offline mode off audit event type name.
            /// </summary>
            private const string OfflineModeOffName = "OfflineModeOff";

            /// <summary>
            /// Training mode on audit event type name.
            /// </summary>
            private const string TrainingModeOnName = "TrainingModeOn";

            /// <summary>
            /// Training mode off audit event type name.
            /// </summary>
            private const string TrainingModeOffName = "TrainingModeOff";

            /// <summary>
            /// Close shift audit event type name.
            /// </summary>
            private const string CloseShiftName = "CloseShift";

            /// <summary>
            /// Initializes a new instance of the <see cref="FranceExtensibleAuditEventType"/> class.
            /// </summary>
            /// <param name="name">The name of the audit event type.</param>
            /// <param name="value">The value of the audit event type.</param>
            protected FranceExtensibleAuditEventType(string name, int value)
                : base(name, value)
            {
            }

            /// <summary>
            /// Gets offline mode on audit event.
            /// </summary>
            [IgnoreDataMember]
            public static ExtensibleAuditEventType OfflineModeOn
            {
                get
                {
                    return ExtensibleEnumeration<ExtensibleAuditEventType>.GetByName(OfflineModeOnName);
                }
            }

            /// <summary>
            /// Gets offline mode off audit event.
            /// </summary>
            [IgnoreDataMember]
            public static ExtensibleAuditEventType OfflineModeOff
            {
                get
                {
                    return ExtensibleEnumeration<ExtensibleAuditEventType>.GetByName(OfflineModeOffName);
                }
            }

            /// <summary>
            /// Gets training mode on audit event.
            /// </summary>
            [IgnoreDataMember]
            public static ExtensibleAuditEventType TrainingModeOn
            {
                get
                {
                    return ExtensibleEnumeration<ExtensibleAuditEventType>.GetByName(TrainingModeOnName);
                }
            }

            /// <summary>
            /// Gets training mode off audit event.
            /// </summary>
            [IgnoreDataMember]
            public static ExtensibleAuditEventType TrainingModeOff
            {
                get
                {
                    return ExtensibleEnumeration<ExtensibleAuditEventType>.GetByName(TrainingModeOffName);
                }
            }

            /// <summary>
            /// Gets close shift audit event.
            /// </summary>
            [IgnoreDataMember]
            public static ExtensibleAuditEventType CloseShift
            {
                get
                {
                    return ExtensibleEnumeration<ExtensibleAuditEventType>.GetByName(CloseShiftName);
                }
            }
        }
    }
}