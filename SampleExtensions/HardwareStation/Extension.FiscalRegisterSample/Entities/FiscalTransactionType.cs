namespace Contoso
{
    namespace Commerce.HardwareStation.FiscalRegisterSample
    {
        /// <summary>
        /// Enumerate types of fiscal transactions.
        /// </summary>
        public enum FiscalTransactionType
        {
            /// <summary>
            ///  Regular transaction.
            /// </summary>
            Normal = 0,

            /// <summary>
            ///  Copy of receipt.
            /// </summary>
            Copy = 1,
        }
    }
}
