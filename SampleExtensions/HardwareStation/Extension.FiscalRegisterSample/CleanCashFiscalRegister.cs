namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        using System;
        using System.Collections.Generic;
        using System.Composition;
        using System.Globalization;
        using System.IO;
        using System.Runtime.InteropServices;
        using System.Runtime.Serialization.Json;
        using System.Text;
        using System.Threading;
        using Interop.CleanCash_1_1;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.Messages;

        /// <summary>
        /// Class implements sample of integration with Clean Cash fiscal register.
        /// </summary>
        public class CleanCashFiscalRegister : IRequestHandler, IDisposable
        {
            private const string CleanCashMutexName = "CleanCashFiscalRegister";
            private const int CleanCashMutexLockTimeOut = 60000; // 1 Minute
            private const string FiscalRegisterConfigSectionName = "FiscalRegister";

            private const string ConnectionStringIsNotSpecifiedErrorMessage = "Fiscal register connection string is not specified in the '{0}' section of the fiscal register configuration file.";
            private const string FailedToOpenConnectionErrorMessage = "Failed to connect to the fiscal register. The error code is {0} and the connection string is {1}.";
            private const string FailedToCheckStatusErrorMessage = "Failed to check the status of the fiscal register. The error code is {0} and the connection string is {1}.";
            private const string FailedToRegisterPOSErrorMessage = "Failed to register POS in the fiscal register. The error code is {0}. The extended error code is {1}.";
            private const string FailedToStartReceiptErrorMessage = "Failed to start a new receipt in the fiscal register. The error code is {0}. The extended error code is {1}.";
            private const string FailedToSendReceiptErrorMessage = "Failed to register a receipt in the fiscal register. The error code is {0}. The extended error code is {1}.";
            private const string FailedToCloseConnectionErrorMessage = "Failed to close the connection to the fiscal register. The error code is {0} and the connection string is {1}.";
            private const string MappingToIncorrectVATGroupErrorMessage = "The tax code {0} is mapped to the control unit VAT group number {1}, which is not within a valid range.";
            private const string MappingToMultipleVATGroupErrorMessage = "The tax code {0} is mapped to multiple control unit VAT groups.";

            private Communication cleanCashInteropDriver = null;
            private Mutex cleanCashMutex = null;

            /// <summary>
            /// Gets the collection of supported request types by this handler.
            /// </summary>
            public IEnumerable<Type> SupportedRequestTypes
            {
                get
                {
                    return new[]
                    {
                        typeof(IsReadyFiscalRegisterDeviceRequest),
                        typeof(RegisterFiscalTransactionFiscalRegisterDeviceRequest)
                    };
                }
            }

            /// <summary>
            /// Represents the entry point for the Clean Cash Fiscal Register device request handler.
            /// </summary>
            /// <param name="request">The incoming request message.</param>
            /// <returns>The outgoing response message.</returns>
            public Response Execute(Request request)
            {
                ThrowIf.Null(request, "request");

                Type requestType = request.GetType();

                if (requestType == typeof(IsReadyFiscalRegisterDeviceRequest))
                {
                    return new IsReadyFiscalRegisterDeviceResponse(this.IsReady());
                }
                else if (requestType == typeof(RegisterFiscalTransactionFiscalRegisterDeviceRequest))
                {
                    var registerFiscalTransactionRequest = (RegisterFiscalTransactionFiscalRegisterDeviceRequest)request;
                    return new RegisterFiscalTransactionFiscalRegisterDeviceResponse(this.RegisterFiscalTransaction(registerFiscalTransactionRequest.FiscalTransaction, registerFiscalTransactionRequest.Configuration));
                }
                else
                {
                    throw new NotSupportedException(string.Format("Request '{0}' is not supported.", requestType));
                }
            }

            /// <summary>
            /// Checks if fiscal register is ready for registration operation or not.
            /// </summary>
            /// <returns><c>True</c> if fiscal register is ready, <c>false</c> otherwise.</returns>
            public bool IsReady()
            {
                this.OpenCleanCashUnit();
                this.CloseCleanCashUnit();

                return true;
            }

            /// <summary>
            /// Registers fiscal transaction.
            /// </summary>
            /// <param name="fiscalTransaction">Fiscal transaction.</param>
            /// <param name="configuration">Fiscal register configuration.</param>
            /// <returns>The results of the fiscal registration.</returns>
            public FiscalRegistrationResults RegisterFiscalTransaction(FiscalTransactionInfo fiscalTransaction, string configuration)
            {
                var cleanCashRequest = new CleanCashRequest(fiscalTransaction, GetTaxMappingFromConfiguration(configuration));

                this.OpenCleanCashUnit();

                this.CheckResultCode(this.cleanCashInteropDriver.RegisterPos(cleanCashRequest.OrgNumber, cleanCashRequest.TerminalId), FailedToRegisterPOSErrorMessage);
                this.CheckResultCode(this.cleanCashInteropDriver.StartReceipt(), FailedToStartReceiptErrorMessage);
                this.CheckResultCode(
                    this.cleanCashInteropDriver.SendReceipt(
                        cleanCashRequest.TransactionDate,
                        cleanCashRequest.ReceiptId,
                        cleanCashRequest.TransactionType,
                        cleanCashRequest.TotalAmount,
                        cleanCashRequest.NegativeAmount,
                        cleanCashRequest.VAT1,
                        cleanCashRequest.VAT2,
                        cleanCashRequest.VAT3,
                        cleanCashRequest.VAT4),
                    FailedToSendReceiptErrorMessage);

                var cleanCashResponse = new CleanCashResponse(this.cleanCashInteropDriver.UnitId, this.cleanCashInteropDriver.LastControlCode);
                this.CloseCleanCashUnit();

                return CreateFiscalRegistrationResults(cleanCashResponse);
            }

            /// <summary>
            /// Dispose the clean cash and mutex object if the clean cash driver is not closed correctly.
            /// </summary>
            public void Dispose()
            {
                this.Dispose(true);
                GC.SuppressFinalize(this);
            }

            /// <summary>
            /// Dispose the clean cash  objects if disposing is set to true.
            /// </summary>
            /// <param name="disposing">Disposing flag set to true.</param>
            protected virtual void Dispose(bool disposing)
            {
                if (disposing)
                {
                    this.CloseCleanCashUnit(true);
                }
            }

            /// <summary>
            /// Creates fiscal transaction registration result from the clean cash response.
            /// </summary>
            /// <param name="cleanCashResponse">Clean cash fiscal register response.</param>
            /// <returns>Fiscal transaction registration result.</returns>
            private static FiscalRegistrationResults CreateFiscalRegistrationResults(CleanCashResponse cleanCashResponse)
            {
                string jsonResponse;

                using (var stream = new MemoryStream())
                {
                    var serializer = new DataContractJsonSerializer(typeof(CleanCashResponse));
                    serializer.WriteObject(stream, cleanCashResponse);

                    jsonResponse = Encoding.UTF8.GetString(stream.ToArray());
                }

                return new FiscalRegistrationResults(jsonResponse);
            }

            /// <summary>
            /// Gets the tax mapping settings from the fiscal register functional configuration.
            /// </summary>
            /// <param name="configuration">The serialized string with the functional configuration.</param>
            /// <returns>The dictionary of HQ tax codes mapped with fiscal register VAT class numbers.</returns>
            private static Dictionary<string, int> GetTaxMappingFromConfiguration(string configuration)
            {
                var taxMapping = new Dictionary<string, int>();

                FiscalRegisterFunctionalConfiguration functionalConfiguration;
                try
                {
                    functionalConfiguration = FiscalRegisterFunctionalConfigurationLoader.GetFunctionalConfiguration(configuration);
                }
                catch (Exception ex)
                {
                    throw new FiscalRegisterException(FiscalRegisterException.FiscalRegisterFunctionalConfigurationErrorResourceId, ex.Message, ex);
                }

                foreach (var taxMappingItem in functionalConfiguration.TaxMapping)
                {
                    if (!VatNumberIsValid(taxMappingItem.VATnumber))
                    {
                        throw new FiscalRegisterException(FiscalRegisterException.FiscalRegisterFunctionalConfigurationErrorResourceId, MappingToIncorrectVATGroupErrorMessage, taxMappingItem.TaxCode, taxMappingItem.VATnumber);
                    }

                    if (taxMapping.ContainsKey(taxMappingItem.TaxCode))
                    {
                        throw new FiscalRegisterException(FiscalRegisterException.FiscalRegisterFunctionalConfigurationErrorResourceId, MappingToMultipleVATGroupErrorMessage, taxMappingItem.TaxCode);
                    }

                    taxMapping.Add(taxMappingItem.TaxCode, taxMappingItem.VATnumber);
                }

                return taxMapping;
            }

            /// <summary>
            /// Checks VAT number is valid.
            /// </summary>
            /// <param name="vatNumber">VAT number.</param>
            /// <returns>True if the VAT number is valid. False otherwise.</returns>
            private static bool VatNumberIsValid(int vatNumber)
            {
                return 1 <= vatNumber && vatNumber <= 4;
            }

            /// <summary>
            /// Instantiates and initializes Clean Cash control unit driver instance.
            /// </summary>
            private void OpenCleanCashUnit()
            {
                if (this.cleanCashInteropDriver == null)
                {
                    string connectionString = FiscalRegisterConfiguration.Instance.FiscalRegisterConfigSection.ConnectionString;

                    if (string.IsNullOrEmpty(connectionString))
                    {
                        throw new FiscalRegisterException(FiscalRegisterException.FiscalRegisterConnectionConfigurationErrorResourceId, ConnectionStringIsNotSpecifiedErrorMessage, FiscalRegisterConfigSectionName);
                    }

                    this.CreateMutex();

                    this.cleanCashInteropDriver = new Communication();

                    this.CheckResultCode(this.cleanCashInteropDriver.Open(connectionString), FailedToOpenConnectionErrorMessage);
                    this.CheckResultCode(this.cleanCashInteropDriver.CheckStatus(), FailedToCheckStatusErrorMessage);
                }
            }

            /// <summary>
            /// Closes Clean Cash control unit.
            /// </summary>
            /// <param name="skipValidation">Skip the closing command result validation.</param>
            private void CloseCleanCashUnit(bool skipValidation = false)
            {
                if (this.cleanCashInteropDriver != null)
                {
                    CommunicationResult resultCode = this.cleanCashInteropDriver.Close();

                    if (!skipValidation)
                    {
                        this.CheckResultCode(resultCode, FailedToCloseConnectionErrorMessage);
                    }

                    this.DisposeCleanCashDriverInstance();
                    this.DisposeMutex();
                }
            }

            /// <summary>
            /// Creates Clean Cash control unit mutex.
            /// </summary>
            private void CreateMutex()
            {
                if (this.cleanCashMutex == null)
                {
                    this.cleanCashMutex = new Mutex(false, CleanCashMutexName);
                }

                if (!this.cleanCashMutex.WaitOne(CleanCashMutexLockTimeOut))
                {
                    throw new IOException(string.Format(CultureInfo.InvariantCulture, "Failed to acquire lock on mutex '{0}'.", CleanCashMutexName));
                }
            }

            /// <summary>
            /// Disposes Clean Cash control unit mutex.
            /// </summary>
            private void DisposeMutex()
            {
                if (this.cleanCashMutex != null)
                {
                    try
                    {
                        this.cleanCashMutex.ReleaseMutex();
                    }
                    catch (ApplicationException)
                    {
                        // The calling thread does not own the mutex. Ignore this.
                    }
                    finally
                    {
                        this.cleanCashMutex.Dispose();
                    }

                    this.cleanCashMutex = null;
                }
            }

            /// <summary>
            /// Checks result of control unit operation for any errors.
            /// </summary>
            /// <param name="resultCode">Result code.</param>
            /// <param name="errorMessage">Error message.</param>
            private void CheckResultCode(CommunicationResult resultCode, string errorMessage)
            {
                if (resultCode != CommunicationResult.RC_SUCCESS)
                {
                    int extendedErrorCode = 0;

                    if (this.cleanCashInteropDriver != null)
                    {
                        extendedErrorCode = this.cleanCashInteropDriver.LastExtendedError;
                    }

                    this.CloseCleanCashUnit(true);
                    throw new FiscalRegisterException(FiscalRegisterException.FiscalRegisterErrorResourceId, errorMessage, resultCode, extendedErrorCode);
                }
            }

            /// <summary>
            /// Disposes the Clean Cash control unit driver COM object instance.
            /// </summary>
            private void DisposeCleanCashDriverInstance()
            {
                if (this.cleanCashInteropDriver != null)
                {
                    Marshal.ReleaseComObject(this.cleanCashInteropDriver);
                    this.cleanCashInteropDriver = null;
                }
            }
        }
    }
}
