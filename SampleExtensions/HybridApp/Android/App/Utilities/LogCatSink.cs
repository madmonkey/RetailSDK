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
    namespace Commerce.Client.Pos
    {
        using System;
        using global::Android.Util;
        using Microsoft.Dynamics.Retail.Diagnostics;

        /// <summary>
        /// Logs events to the logcat event log.
        /// </summary>
        public class LogCatSink : IEmergencySink
        {
            /// <summary>
            /// Gets the name of the Event Source used by the Event Log Sink.
            /// </summary>
            public string EventSourceName { get; private set; }

            /// <summary>
            /// Writes a simple message to the emergency sink using string formatting.
            /// </summary>
            /// <param name="level">The level of the event.</param>
            /// <param name="logMessage">The formatted message to write.</param>
            /// <param name="args">The arguments to the formatted message string.</param>
            public void WriteEvent(EventLevel level, string logMessage, params object[] args)
            {
                try
                {
                    string message = string.Format(logMessage, args);
                    switch (level)
                    {
                        case EventLevel.Critical:
                            Log.Wtf(this.EventSourceName, message);
                            break;
                        case EventLevel.Error:
                            Log.Error(this.EventSourceName, message);
                            break;
                        case EventLevel.Informational:
                        case EventLevel.LogAlways:
                        case EventLevel.Undefined:
                            Log.Info(this.EventSourceName, message);
                            break;
                        case EventLevel.Warning:
                            Log.Warn(this.EventSourceName, message);
                            break;
                        case EventLevel.Verbose:
                            Log.Verbose(this.EventSourceName, message);
                            break;
                    }
                }
                catch (Exception)
                {
                    // Failures in the emergency sink should not take down the application.
                }
            }

            /// <summary>
            /// Initializes log sink based on configuration.
            /// </summary>
            /// <param name="diagnosticsSinkConfig">The diagnostics sink configuration.</param>
            /// <param name="diagnosticsApplicationConfigElement">The diagnostics application configuration.</param>
            public void InitializeConfig(IDiagnosticsSinkConfigElement diagnosticsSinkConfig, IDiagnosticsApplicationConfigElement diagnosticsApplicationConfigElement)
            {
                this.EventSourceName = diagnosticsSinkConfig.GetPropertyValue("eventSourceName");
            }
        }
    }
}