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
    namespace Commerce.Runtime.XZReportsNorway
    {
        using System;
        using System.Collections.Generic;
        using System.Collections.ObjectModel;
        using System.Linq;
        using System.Text;
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using ShiftLineNorway = Commerce.Runtime.DataModel.ShiftLineNorway;
        using ShiftNorway = Commerce.Runtime.DataModel.ShiftNorway;
        using XZReportType = Commerce.Runtime.DataModel.XZReportType;

        /// <summary>
        /// Builds receipt for custom Norwegian X/Z report.
        /// </summary>
        public static class XZReportsReceiptBuilder
        {
            /// <summary>
            /// Builds custom Norwegian X/Z report receipt.
            /// </summary>
            /// <param name="shift">Norway shift data.</param>
            /// <param name="receiptType">Receipt type.</param>
            /// <param name="formatter">Receipt formatter.</param>
            /// <param name="terminal">The terminal for which formatted receipts are to be generated.</param>
            /// <param name="hardwareProfile">The hardware profile for which formatted receipts are to be generated.</param>
            /// <returns>The formatted receipt.</returns>
            public static async Task<Receipt> BuildAsync(ShiftNorway shift, ReceiptType receiptType, XZReportsFormatter formatter, Terminal terminal, HardwareProfile hardwareProfile)
            {
                ThrowIf.Null(shift, "shift");
                ThrowIf.Null(formatter, "formatter");
                
                Receipt receipt = new Receipt();

                receipt.Width = XZReportsFormatter.PaperWidth;
                receipt.ReceiptTitle = receiptType.ToString();
                receipt.TransactionId = string.Empty;
                receipt.ReceiptId = string.Empty;
                receipt.ReceiptType = receiptType;

                receipt.Header = XZReportsReceiptBuilder.BuildHeader(formatter, shift);
                receipt.Body = await XZReportsReceiptBuilder.BuildBodyAsync(formatter, shift).ConfigureAwait(false);
                receipt.Printers = XZReportsReceiptBuilder.SetPrinters(terminal, hardwareProfile, receiptType);

                return receipt;
            }

            /// <summary>
            /// Builds custom Norwegian X/Z report receipt header.
            /// </summary>
            /// <param name="formatter">Reports formatter.</param>
            /// <param name="shift">Norway shift data.</param>
            /// <returns>Receipt header string.</returns>
            private static string BuildHeader(XZReportsFormatter formatter, ShiftNorway shift)
            {
                StringBuilder reportLayout = new StringBuilder(7500);

                switch (shift.ReportType)
                {
                    case XZReportType.XReport:
                        XZReportsReceiptBuilder.AppendReportLine(formatter, reportLayout, 0, XZReportsConstants.XReport);
                        break;

                    case XZReportType.ZReport:
                        XZReportsReceiptBuilder.AppendReportLine(formatter, reportLayout, 0, XZReportsConstants.ZReport);
                        break;
                }

                XZReportsReceiptBuilder.AppendReportLine(formatter, reportLayout, 0, 0, XZReportsConstants.ReportID, shift.ReportId);
                XZReportsReceiptBuilder.AppendReportLine(formatter, reportLayout, 0, 0, XZReportsConstants.CompanyIdent, shift.OrganizationNumber);
                XZReportsReceiptBuilder.AppendReportLine(formatter, reportLayout, 0, 0, XZReportsConstants.CompanyName, shift.OrganizationName);
                XZReportsReceiptBuilder.AppendReportLine(formatter, reportLayout, 0, 0, XZReportsConstants.ReportDate, string.Format(XZReportsConstants.ReportDateFormat, shift.ShiftDateTime.Date));

                XZReportsReceiptBuilder.AppendReportLine(formatter, reportLayout, 0, 0, XZReportsConstants.ReportTime, string.Format(XZReportsConstants.ReportTimeFormat, shift.ShiftDateTime.DateTime));
                XZReportsReceiptBuilder.AppendReportLine(formatter, reportLayout, 0, 0, XZReportsConstants.RegisterID, shift.TerminalId);

                return reportLayout.ToString();
            }

            /// <summary>
            /// Builds custom Norwegian X/Z report receipt body.
            /// </summary>
            /// <param name="formatter">Reports formatter.</param>
            /// <param name="shift">Norway shift data.</param>
            /// <returns>Receipt body string.</returns>
            private static async Task<string> BuildBodyAsync(XZReportsFormatter formatter, ShiftNorway shift)
            {
                StringBuilder reportLayout = new StringBuilder(2500);
                IEnumerable<ShiftLineNorway> groupLines;

                reportLayout.AppendLine();

                XZReportsReceiptBuilder.AppendReportLine(
                    formatter,
                    reportLayout,
                    0,
                    0,
                    XZReportsConstants.ReportTotalCashSales,
                    await formatter.FormatCurrencyAsync(shift.TotalCashSales).ConfigureAwait(false));

                reportLayout.AppendLine();

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportArtGroup);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter, 
                    reportLayout, 
                    groupLines, 
                    XZReportsConstants.ReportArtGroup,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportPayment);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportPayment,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportEmpPayment);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportEmpPayment,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportCashSaleVat);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportCashSaleVat,
                    false,
                    true,
                    true,
                    true,
                    false).ConfigureAwait(false);
                
                XZReportsReceiptBuilder.AppendReportLine(
                    formatter,
                    reportLayout,
                    0,
                    0,
                    XZReportsConstants.ReportOpeningChangeFloat,
                    await formatter.FormatCurrencyAsync(shift.OpeningChangeAmount).ConfigureAwait(false));

                reportLayout.AppendLine();

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportEmpOpeningChangeFloat);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportEmpOpeningChangeFloat,
                    false,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                XZReportsReceiptBuilder.AppendReportLine(formatter, reportLayout, 0, 0, XZReportsConstants.ReportReceiptNum, shift.SalesReceiptCount);
                XZReportsReceiptBuilder.AppendReportLine(formatter, reportLayout, 0, 0, XZReportsConstants.ReportOpenCashBoxNum, shift.CashDrawerOpen);

                reportLayout.AppendLine();

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportReceiptCopy);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportReceiptCopy,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportReceiptProforma);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportReceiptProforma,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportReturn);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportReturn,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportDiscount);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportDiscount,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportVoidTrans);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportVoidTrans,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportCorrLine);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportCorrLine,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportPriceInquiry);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportPriceInquiry,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportOtherCorr);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportOtherCorr,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportPayIn);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportPayIn,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportPayOut);
                await XZReportsReceiptBuilder.BuildLineGroupAsync(
                    formatter,
                    reportLayout,
                    groupLines,
                    XZReportsConstants.ReportPayOut,
                    true,
                    true,
                    false,
                    false,
                    true).ConfigureAwait(false);

                XZReportsReceiptBuilder.AppendReportLine(
                    formatter,
                    reportLayout,
                    0,
                    0,
                    XZReportsConstants.ReportGrandTotalSales,
                    await formatter.FormatCurrencyAsync(shift.GrandTotalSales).ConfigureAwait(false));
                XZReportsReceiptBuilder.AppendReportLine(
                    formatter,
                    reportLayout,
                    0,
                    0,
                    XZReportsConstants.ReportGrandTotalReturn,
                    await formatter.FormatCurrencyAsync(shift.GrandTotalReturns).ConfigureAwait(false));
                XZReportsReceiptBuilder.AppendReportLine(
                    formatter,
                    reportLayout,
                    0,
                    0,
                    XZReportsConstants.ReportGrandTotalSalesNet,
                    await formatter.FormatCurrencyAsync(shift.GrandTotalNet).ConfigureAwait(false));

                return reportLayout.ToString();
            }

            /// <summary>
            /// Sets printers for receipt.
            /// </summary>
            /// <param name="terminal">The terminal for which formatted receipts are to be generated.</param>
            /// <param name="hardwareProfile">The hardware profile for which formatted receipts are to be generated.</param>
            /// <param name="receiptType">The type of the receipt to be printed.</param>
            /// <returns>A collection of printers.</returns>
            private static ReadOnlyCollection<Printer> SetPrinters(Terminal terminal, HardwareProfile hardwareProfile, ReceiptType receiptType)
            {
                if (hardwareProfile != null &&
                    hardwareProfile.Printers != null &&
                    hardwareProfile.Printers.Any())
                {
                    HardwareProfilePrinter hardwareProfilePrinter = hardwareProfile.Printers.FirstOrDefault(printer => printer.DeviceType != DeviceType.None);
                    if (hardwareProfilePrinter != null)
                    {
                        Printer receiptPrinter = new Printer();
                        receiptPrinter.ReceiptType = receiptType;
                        receiptPrinter.PrintBehavior = PrintBehavior.Always;
                        receiptPrinter.ReceiptLayoutId = null;
                        receiptPrinter.Terminal = terminal == null ? 0 : terminal.RecordId;
                        receiptPrinter.HardwareProfileId = hardwareProfile.ProfileId;
                        receiptPrinter.Name = hardwareProfilePrinter.DeviceName;
                        receiptPrinter.PrinterType = (int)hardwareProfilePrinter.DeviceType;

                        return new List<Printer>() { receiptPrinter }.AsReadOnly();
                    }
                }

                return new List<Printer>().AsReadOnly();
            }

            /// <summary>
            /// Builds line group.
            /// </summary>
            /// <param name="formatter">Reports formatter.</param>
            /// <param name="receiptString">The receipt string.</param>
            /// <param name="groupLines">Shift lines in the group.</param>
            /// <param name="groupName">Group name.</param>
            /// <param name="printCount">Flag indicating whether to print counter field for lines in the group.</param>
            /// <param name="printAmount">Flag indicating whether to print amount field for lines in the group.</param>
            /// <param name="printTaxAmount">Flag indicating whether to print tax amount field for lines in the group.</param>
            /// <param name="printTaxRate">Flag indicating whether to print tax rate field for lines in the group.</param>
            /// <param name="withTax">Flag indicating whether total or net amount is needed.</param>
            private static async Task BuildLineGroupAsync(
                XZReportsFormatter formatter, 
                StringBuilder receiptString, 
                IEnumerable<ShiftLineNorway> groupLines, 
                string groupName,
                bool printCount,
                bool printAmount,
                bool printTaxAmount,
                bool printTaxRate,
                bool withTax)
            {
                XZReportsReceiptBuilder.BuildSubtitle(formatter, receiptString, groupName);

                string[] previousGroupElementNames = null;

                if (groupLines == null || !groupLines.Any())
                {
                    XZReportsReceiptBuilder.AppendReportLine(formatter, receiptString, 0, XZReportsConstants.None);
                }
                else
                {
                    IEnumerable<ShiftLineNorway> sortedGroupLines = groupLines.OrderBy(l => l.GroupElementName);

                    foreach (ShiftLineNorway line in sortedGroupLines)
                    {
                        int leftTab = 0;

                        if (!string.IsNullOrEmpty(line.GroupElementName))
                        {
                            leftTab = XZReportsReceiptBuilder.BuildGroupElement(formatter, receiptString, line.GroupElementName, ref previousGroupElementNames);
                        }

                        if (printCount)
                        {
                            XZReportsReceiptBuilder.AppendReportLine(formatter, receiptString, leftTab, 0, XZReportsConstants.ReceiptCount, line.Count);
                        }

                        if (printAmount)
                        {
                            XZReportsReceiptBuilder.AppendReportLine(
                                formatter,
                                receiptString,
                                leftTab,
                                0,
                                XZReportsConstants.ReceiptAmount,
                                await formatter.FormatCurrencyAsync(withTax ? line.NetAmount + line.TaxAmount : line.NetAmount).ConfigureAwait(false));
                        }

                        if (printTaxAmount)
                        {
                            XZReportsReceiptBuilder.AppendReportLine(
                                formatter,
                                receiptString,
                                leftTab,
                                0,
                                XZReportsConstants.ReceiptTaxAmount,
                                await formatter.FormatCurrencyAsync(line.TaxAmount).ConfigureAwait(false));
                        }

                        if (printTaxRate)
                        {
                            XZReportsReceiptBuilder.AppendReportLine(
                                formatter,
                                receiptString,
                                leftTab,
                                0,
                                XZReportsConstants.ReceiptTaxRate,
                                await formatter.FormatNumberAsync(line.TaxRate).ConfigureAwait(false));
                        }

                        receiptString.AppendLine();
                    }
                }
                
                receiptString.AppendLine();
            }

            /// <summary>
            /// Builds receipt text for element of the group.
            /// </summary>
            /// <param name="formatter">Reports formatter.</param>
            /// <param name="receiptString">The receipt string.</param>
            /// <param name="groupElementNames">String containing names of element in the group.</param>
            /// <param name="previousGroupElementNames">Names of the previous element in the group.</param>
            /// <returns>Names of the element in the group.</returns>
            private static int BuildGroupElement(XZReportsFormatter formatter, StringBuilder receiptString, string groupElementNames, ref string[] previousGroupElementNames)
            {
                string[] groupElementNameValues = groupElementNames.Split(XZReportsConstants.GroupElementNamesDelimiter);
                string[] previousGroupElementNameValues = previousGroupElementNames ?? new string[groupElementNameValues.Length];

                if (groupElementNameValues.Length != previousGroupElementNameValues.Length)
                {
                    throw new ArgumentException("Current and previous numbers of group element names do not match.");
                }

                var groupElementPairs = groupElementNameValues.Zip(previousGroupElementNameValues, (c, p) => new { Current = c, Previous = p });

                int leftTab = 0;
                bool printElementName = false;

                foreach (var groupElementPair in groupElementPairs)
                {
                    printElementName = printElementName || (groupElementPair.Current != groupElementPair.Previous);

                    if (printElementName)
                    {
                        string groupElementName = formatter.Translate(groupElementPair.Current);

                        if (string.IsNullOrEmpty(groupElementName))
                        {
                            groupElementName = groupElementPair.Current;
                        }

                        string formattedLine = formatter.FormatTextLine(leftTab, groupElementName);
                        receiptString.AppendLine(formattedLine);
                    }

                    leftTab++;
                }

                previousGroupElementNames = groupElementNameValues;

                return leftTab;
            }

            /// <summary>
            /// Appends report line.
            /// </summary>
            /// <param name="formatter">Reports formatter.</param>
            /// <param name="receiptString">The receipt string.</param>
            /// <param name="leftTab">Left tabulation size.</param>
            /// <param name="rightTab">Right tabulation size.</param>
            /// <param name="titleResourceId">Resource Identifier.</param>
            /// <param name="value">Value of tender item.</param>
            private static void AppendReportLine(XZReportsFormatter formatter, StringBuilder receiptString, int leftTab, int rightTab, string titleResourceId, object value)
            {
                string formattedLine = formatter.FormatLine(leftTab, rightTab, titleResourceId, value);
                receiptString.AppendLine(formattedLine);
            }

            /// <summary>
            /// Appends report line.
            /// </summary>
            /// <param name="formatter">Reports formatter.</param>
            /// <param name="receiptString">The receipt string.</param>
            /// <param name="leftTab">Left tabulation size.</param>
            /// <param name="titleResourceId">Resource Identifier.</param>
            private static void AppendReportLine(XZReportsFormatter formatter, StringBuilder receiptString, int leftTab, string titleResourceId)
            {
                string formattedLine = formatter.FormatLine(leftTab, titleResourceId);
                receiptString.AppendLine(formattedLine);
            }

            /// <summary>
            /// Builds a report subtitle.
            /// </summary>
            /// <param name="formatter">Reports formatter.</param>
            /// <param name="receiptString">The receipt string.</param>
            /// <param name="titleResourceId">Resource Identifier.</param>
            private static void BuildSubtitle(XZReportsFormatter formatter, StringBuilder receiptString, string titleResourceId)
            {
                string text = formatter.Translate(titleResourceId);

                receiptString.AppendLine(text);
                receiptString.AppendLine(XZReportsFormatter.LineSeparator);
            }
        }
    }
}
