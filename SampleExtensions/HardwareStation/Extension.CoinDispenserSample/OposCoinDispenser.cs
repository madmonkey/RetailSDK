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
    namespace Commerce.HardwareStation.CoinDispenserSample
    {
        using System;
        using System.Collections.Generic;
        using Interop.OPOSCoinDispenser;
        using Microsoft.Dynamics.Commerce.HardwareStation;
        using Microsoft.Dynamics.Commerce.HardwareStation.Peripherals;
        using Microsoft.Dynamics.Commerce.Runtime.Handlers;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// The cash dispenser device of OPOS type.
        /// </summary>
        public class OposCoinDispenser : INamedRequestHandler, IDisposable
        {
            private const string CoinDispenserInstanceNameFormat = "OposCoinDispenser_{0}";

            private IOPOSCoinDispenser oposCoinDispenser;
            private string oposCoinDispenserInstanceName;
            private readonly object asyncLock = new object();

            /// <summary>
            /// Gets the unique name for this request handler.
            /// </summary>
            public string HandlerName
            {
                get { return PeripheralType.Opos; }
            }

            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(OpenCoinDispenserDeviceRequest),
                        typeof(DispenseChangeCoinDispenserDeviceRequest),
                        typeof(CloseCoinDispenserDeviceRequest)
                    };
                }
            }

            /// <summary>
            /// Represents the entry point for the cash drawer device request handler.
            /// </summary>
            /// <param name="request">The incoming request message.</param>
            /// <returns>The outgoing response message.</returns>
            public Response Execute(Request request)
            {
                ThrowIf.Null(request, "request");

                Type requestType = request.GetType();

                if (requestType == typeof(OpenCoinDispenserDeviceRequest))
                {
                    var openRequest = (OpenCoinDispenserDeviceRequest)request;

                    this.Open(openRequest.DeviceName);
                }
                else if (requestType == typeof(DispenseChangeCoinDispenserDeviceRequest))
                {
                    var dispenseChangeRequest = (DispenseChangeCoinDispenserDeviceRequest)request;

                    this.DispenseChange(dispenseChangeRequest.Amount);
                }
                else if (requestType == typeof(CloseCoinDispenserDeviceRequest))
                {
                    this.Close();
                }
                else
                {
                    throw new NotSupportedException(string.Format("Request '{0}' is not supported.", requestType));
                }

                return new NullResponse();
            }

            /// <summary>
            /// Disposes the coin dispenser.
            /// </summary>
            public void Dispose()
            {
                this.Dispose(true);

                GC.SuppressFinalize(this);
            }

            /// <summary>
            /// Disposes the coin dispenser objects if <paramref name="disposing"/> is set to <c>true</c>>.
            /// </summary>
            /// <param name="disposing">Disposing flag set to true.</param>
            protected virtual void Dispose(bool disposing)
            {
                if (disposing)
                {
                    this.Close();
                }
            }

            /// <summary>
            /// Opens a peripheral.
            /// </summary>
            /// <param name="peripheralName">Name of the peripheral.</param>
            private void Open(string peripheralName)
            {
                this.oposCoinDispenserInstanceName = string.Format(CoinDispenserInstanceNameFormat, peripheralName);

                // OPOS Service objects are not thread safe.
                // We will acquire the lock on currently opened coin dispenser to avoid multithread operations on same SO.

                DeviceLockContainer.ExecuteOpos(this.asyncLock, this.oposCoinDispenserInstanceName, OposHelper.CurrentThreadId, () =>
                {
                    this.oposCoinDispenser = OPOSDeviceManager<IOPOSCoinDispenser>.Instance.AcquireDeviceHandle<OPOSCoinDispenserClass>();

                    // Open
                    this.oposCoinDispenser.Open(peripheralName);
                    OposHelper.CheckResultCode(this, this.oposCoinDispenser.ResultCode);

                    // Claim
                    this.oposCoinDispenser.ClaimDevice(OposHelper.ClaimTimeOut);
                    OposHelper.CheckResultCode(this, this.oposCoinDispenser.ResultCode);

                    // Enable
                    this.oposCoinDispenser.DeviceEnabled = true;
                    OposHelper.CheckResultCode(this, this.oposCoinDispenser.ResultCode);
                });
            }

            /// <summary>
            /// Collect the change in the cash dispenser.
            /// </summary>
            /// <param name="amount">The change value.</param>
            private void DispenseChange(int amount)
            {
                DeviceLockContainer.ExecuteOpos(this.asyncLock, this.oposCoinDispenserInstanceName, OposHelper.CurrentThreadId, () =>
                {
                    this.oposCoinDispenser = OPOSDeviceManager<IOPOSCoinDispenser>.Instance.AcquireDeviceHandle<OPOSCoinDispenserClass>();

                    // Send the cash change into the coin dispenser.
                    if (this.oposCoinDispenser != null && this.oposCoinDispenser.DeviceEnabled)
                    {
                        this.oposCoinDispenser.DispenseChange(amount);
                        OposHelper.CheckResultCode(this, this.oposCoinDispenser.ResultCode);
                    }
                    else
                    {
                        throw new PeripheralException("Must open CoinDispensor before dispensing change.");
                    }
                });
            }

            /// <summary>
            /// Closes the cash dispenser device.
            /// </summary>
            private void Close()
            {
                try
                {
                    DeviceLockContainer.ExecuteOpos(this.asyncLock, this.oposCoinDispenserInstanceName, OposHelper.CurrentThreadId, () =>
                    {
                        this.oposCoinDispenser = OPOSDeviceManager<IOPOSCoinDispenser>.Instance.AcquireDeviceHandle<OPOSCoinDispenserClass>();

                        // Close the cash dispenser. 
                        if (this.oposCoinDispenser != null)
                        {
                            // Disabled
                            this.oposCoinDispenser.DeviceEnabled = false;

                            // Release
                            this.oposCoinDispenser.ReleaseDevice();

                            // Close
                            this.oposCoinDispenser.Close();

                            this.oposCoinDispenser = null;
                        }
                    });
                }
                finally
                {
                    // We have contract with Coin Dispenser controller to call close for sure when done interacting with coin dispenser.
                    // This way we ensure to release the lock.

                    if (this.oposCoinDispenser != null)
                    {
                        OPOSDeviceManager<IOPOSCoinDispenser>.Instance.ReleaseDeviceHandle(this.oposCoinDispenser);
                    }
                }
            }
        }
    }
}