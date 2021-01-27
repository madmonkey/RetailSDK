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
        using System.Globalization;
        using System.Linq;
        using System.Xml.Linq;
        using Microsoft.Dynamics.Commerce.Runtime;
        using ShiftLineNorway = Commerce.Runtime.DataModel.ShiftLineNorway;
        using ShiftNorway = Commerce.Runtime.DataModel.ShiftNorway;

        /// <summary>
        /// Builds XML for custom Norwegian X/Z report.
        /// </summary>
        public static class XZReportsXMLBuilder
        {
            /// <summary>
            /// Builds custom Norwegian X/Z report data in XML format.
            /// </summary>
            /// <param name="shift">Current shift.</param>
            /// <returns>XML string.</returns>
            public static string Build(ShiftNorway shift)
            {
                ThrowIf.Null(shift, "shift");

                XDocument reportDoc = new XDocument();
                IEnumerable<ShiftLineNorway> groupLines;
                ShiftLineNorway groupLine;
                ShiftLineNorway defaultShiftLineNorway = new ShiftLineNorway();

                XElement reportRoot = XZReportsXMLBuilder.XElement(XZReportsConstants.Root);

                reportRoot.Add(new XAttribute(XNamespace.Xmlns + XZReportsConstants.XMLElementNameSpacePrefix, XZReportsConstants.XMLElementNameSpace));

                XElement reportElement = XZReportsXMLBuilder.XElement(XZReportsConstants.EventReport);

                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.ReportID, shift.ReportId));

                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.ReportType, shift.ReportType.ToString()));
                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.CompanyIdent, shift.OrganizationNumber));
                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.CompanyName, shift.OrganizationName));
                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.ReportDate, string.Format(XZReportsConstants.ReportDateFormat, shift.ShiftDateTime.Date)));

                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.ReportTime, string.Format(XZReportsConstants.ReportTimeFormat, shift.ShiftDateTime.DateTime)));
                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.RegisterID, shift.TerminalId));

                reportElement.Add(XZReportsXMLBuilder.BuildNamedReportGroup(
                                        XZReportsConstants.ReportTotalCashSales,
                                        XZReportsXMLBuilder.XElement(XZReportsConstants.TotalCashSaleAmnt, string.Format(CultureInfo.InvariantCulture, "{0:0.00}", shift.TotalCashSales))));

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportArtGroup);
                reportElement.Add(XZReportsXMLBuilder.BuildLineGroup(
                                        XZReportsConstants.ReportArtGroups,
                                        groupLines,
                                        new string[] { XZReportsConstants.ArtGroupID },
                                        XZReportsConstants.ArtGroupNum,
                                        XZReportsConstants.ArtGroupAmnt,
                                        null,
                                        null,
                                        true));

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportPayment);
                reportElement.Add(XZReportsXMLBuilder.BuildLineGroup(
                                        XZReportsConstants.ReportPayments,
                                        groupLines,
                                        new string[] { XZReportsConstants.PaymentType },
                                        XZReportsConstants.PaymentNum,
                                        XZReportsConstants.PaymentAmnt,
                                        null,
                                        null,
                                        true));

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportEmpPayment);
                reportElement.Add(XZReportsXMLBuilder.BuildLineGroup(
                                        XZReportsConstants.ReportEmpPayments,
                                        groupLines,
                                        new string[] { XZReportsConstants.EmpID, XZReportsConstants.PaymentType },
                                        XZReportsConstants.PaymentNum,
                                        XZReportsConstants.PaymentAmnt,
                                        null,
                                        null,
                                        true));

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportCashSaleVat);
                reportElement.Add(XZReportsXMLBuilder.BuildLineGroup(
                                        XZReportsConstants.ReportCashSalesVat,
                                        groupLines,
                                        new string[] { XZReportsConstants.VatCode },
                                        null,
                                        XZReportsConstants.CashSaleAmnt,
                                        XZReportsConstants.VatAmnt,
                                        XZReportsConstants.VatPerc,
                                        false));

                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.ReportOpeningChangeFloat, string.Format(CultureInfo.InvariantCulture, "{0:0.00}", shift.OpeningChangeAmount)));

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportEmpOpeningChangeFloat);
                reportElement.Add(XZReportsXMLBuilder.BuildLineGroup(
                                        XZReportsConstants.ReportEmpOpeningChangeFloats,
                                        groupLines,
                                        new string[] { XZReportsConstants.EmpID },
                                        null,
                                        XZReportsConstants.OpeningChangeFloatAmnt,
                                        null,
                                        null,
                                        true));

                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.ReportReceiptNum, shift.SalesReceiptCount));
                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.ReportOpenCashBoxNum, shift.CashDrawerOpen));

                groupLine = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportReceiptCopy).DefaultIfEmpty(defaultShiftLineNorway).FirstOrDefault();
                if (groupLine != null)
                {
                    XZReportsXMLBuilder.AppendReportLine(
                        reportElement,
                        groupLine,
                        null,
                        XZReportsConstants.ReportReceiptCopyNum,
                        XZReportsConstants.ReportReceiptCopyAmnt,
                        null,
                        null,
                        true);
                }

                groupLine = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportReceiptProforma).DefaultIfEmpty(defaultShiftLineNorway).FirstOrDefault();
                if (groupLine != null)
                {
                    XZReportsXMLBuilder.AppendReportLine(
                    reportElement,
                    groupLine,
                    null,
                    XZReportsConstants.ReportReceiptProformaNum,
                    XZReportsConstants.ReportReceiptProformaAmnt,
                    null,
                    null,
                    true);
                }

                groupLine = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportReturn).DefaultIfEmpty(defaultShiftLineNorway).FirstOrDefault();
                if (groupLine != null)
                {
                    XZReportsXMLBuilder.AppendReportLine(
                        reportElement,
                        groupLine,
                        null,
                        XZReportsConstants.ReportReturnNum,
                        XZReportsConstants.ReportReturnAmnt,
                        null,
                        null,
                        true);
                }

                groupLine = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportDiscount).DefaultIfEmpty(defaultShiftLineNorway).FirstOrDefault();
                if (groupLine != null)
                {
                    XZReportsXMLBuilder.AppendReportLine(
                    reportElement,
                    groupLine,
                    null,
                    XZReportsConstants.ReportDiscountNum,
                    XZReportsConstants.ReportDiscountAmnt,
                    null,
                    null,
                    true);
                }

                groupLine = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportVoidTrans).DefaultIfEmpty(defaultShiftLineNorway).FirstOrDefault();
                if (groupLine != null)
                {
                    XZReportsXMLBuilder.AppendReportLine(
                    reportElement,
                    groupLine,
                    null,
                    XZReportsConstants.ReportVoidTransNum,
                    XZReportsConstants.ReportVoidTransAmnt,
                    null,
                    null,
                    true);
                }

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportCorrLine);
                reportElement.Add(XZReportsXMLBuilder.BuildLineGroup(
                                        XZReportsConstants.ReportCorrLines,
                                        groupLines,
                                        new string[] { XZReportsConstants.CorrLineType },
                                        XZReportsConstants.CorrLineNum,
                                        XZReportsConstants.CorrLineAmnt,
                                        null,
                                        null,
                                        true));

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportPriceInquiry);
                reportElement.Add(XZReportsXMLBuilder.BuildLineGroup(
                                        XZReportsConstants.ReportPriceInquiries,
                                        groupLines,
                                        new string[] { XZReportsConstants.PriceInquiryGroup },
                                        XZReportsConstants.PriceInquiryNum,
                                        XZReportsConstants.PriceInquiryAmnt,
                                        null,
                                        null,
                                        true));

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportOtherCorr);
                reportElement.Add(XZReportsXMLBuilder.BuildLineGroup(
                                        XZReportsConstants.ReportOtherCorrs,
                                        groupLines,
                                        new string[] { XZReportsConstants.OtherCorrType },
                                        XZReportsConstants.OtherCorrNum,
                                        null,
                                        null,
                                        null,
                                        true));

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportPayIn);
                reportElement.Add(XZReportsXMLBuilder.BuildLineGroup(
                                        XZReportsConstants.ReportPayIns,
                                        groupLines,
                                        new string[] { XZReportsConstants.PayInType },
                                        XZReportsConstants.PayInNum,
                                        XZReportsConstants.PayInAmnt,
                                        null,
                                        null,
                                        true));

                groupLines = shift.ShiftLines.Where(l => l.GroupName == XZReportsConstants.ReportPayOut);
                reportElement.Add(XZReportsXMLBuilder.BuildLineGroup(
                                        XZReportsConstants.ReportPayOuts,
                                        groupLines,
                                        new string[] { XZReportsConstants.PayOutType },
                                        XZReportsConstants.PayOutNum,
                                        XZReportsConstants.PayOutAmnt,
                                        null,
                                        null,
                                        true));

                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.ReportGrandTotalSales, string.Format(CultureInfo.InvariantCulture, "{0:0.00}", shift.GrandTotalSales)));
                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.ReportGrandTotalReturn, string.Format(CultureInfo.InvariantCulture, "{0:0.00}", shift.GrandTotalReturns)));
                reportElement.Add(XZReportsXMLBuilder.XElement(XZReportsConstants.ReportGrandTotalSalesNet, string.Format(CultureInfo.InvariantCulture, "{0:0.00}", shift.GrandTotalNet)));

                reportRoot.Add(reportElement);
                reportDoc.Add(reportRoot);

                return reportDoc.ToString();
            }

            /// <summary>
            /// Builds named group of lines.
            /// </summary>
            /// <param name="groupId">XML tag for group name.</param>
            /// <param name="groupLines">Lines in the group.</param>
            /// <param name="groupElementIds">XML tags for group element names.</param>
            /// <param name="countId">XML tag for count field.</param>
            /// <param name="amountId">XML tag for amount field.</param>
            /// <param name="taxAmountId">XML tag for tax amount field.</param>
            /// <param name="taxRateId">XML tag for tax rate field.</param>
            /// <param name="withTax">Flag indicating whether total or net amount is needed.</param>
            /// <returns>XML element.</returns>
            private static XElement BuildLineGroup(
                string groupId,
                IEnumerable<ShiftLineNorway> groupLines,
                string[] groupElementIds,
                string countId,
                string amountId,
                string taxAmountId,
                string taxRateId,
                bool withTax)
            {
                XElement groupElement = XZReportsXMLBuilder.XElement(groupId);

                if (groupLines != null)
                {
                    IEnumerable<ShiftLineNorway> sortedGroupLines = groupLines.OrderBy(l => l.GroupElementName);

                    foreach (ShiftLineNorway line in sortedGroupLines)
                    {
                        XElement lineElement = XZReportsXMLBuilder.BuildNamedReportLine(
                                                    line,
                                                    groupElementIds,
                                                    countId,
                                                    amountId,
                                                    taxAmountId,
                                                    taxRateId,
                                                    withTax);

                        groupElement.Add(lineElement);
                    }
                }

                return groupElement;
            }

            /// <summary>
            /// Builds named group of report elements.
            /// </summary>
            /// <param name="groupId">The group name.</param>
            /// <param name="groupContent">The group content.</param>
            /// <returns>XML element.</returns>
            private static XElement BuildNamedReportGroup(string groupId, XElement groupContent)
            {
                return XZReportsXMLBuilder.XElement(groupId, groupContent);
            }

            /// <summary>
            /// Builds XML element for named report line.
            /// </summary>
            /// <param name="shiftLine">Shift line.</param>
            /// <param name="groupElementIds">XML tags for group element names.</param>
            /// <param name="countId">XML tag for count field.</param>
            /// <param name="amountId">XML tag for amount field.</param>
            /// <param name="taxAmountId">XML tag for tax amount field.</param>
            /// <param name="taxRateId">XML tag for tax rate field.</param>
            /// <param name="withTax">Flag indicating whether total or net amount is needed.</param>
            /// <returns>XML element.</returns>
            private static XElement BuildNamedReportLine(
                ShiftLineNorway shiftLine,
                string[] groupElementIds,
                string countId,
                string amountId,
                string taxAmountId,
                string taxRateId,
                bool withTax)
            {
                XElement namedLine = XZReportsXMLBuilder.XElement(shiftLine.GroupName);

                XZReportsXMLBuilder.AppendReportLine(
                    namedLine,
                    shiftLine,
                    groupElementIds,
                    countId,
                    amountId,
                    taxAmountId,
                    taxRateId,
                    withTax);

                return namedLine;
            }

            /// <summary>
            /// Appends report line.
            /// </summary>
            /// <param name="parent">Parent XML element.</param>
            /// <param name="shiftLine">Shift line.</param>
            /// <param name="groupElementIds">XML tags for group element names.</param>
            /// <param name="countId">XML tag for count field.</param>
            /// <param name="amountId">XML tag for amount field.</param>
            /// <param name="taxAmountId">XML tag for tax amount field.</param>
            /// <param name="taxRateId">XML tag for tax rate field.</param>
            /// <param name="withTax">Flag indicating whether total or net amount is needed.</param>
            private static void AppendReportLine(
                XElement parent,
                ShiftLineNorway shiftLine,
                string[] groupElementIds,
                string countId,
                string amountId,
                string taxAmountId,
                string taxRateId,
                bool withTax)
            {
                if (groupElementIds != null)
                {
                    XZReportsXMLBuilder.AppendLineGroupElementNames(parent, shiftLine.GroupElementName, groupElementIds);
                }

                if (!string.IsNullOrEmpty(countId))
                {
                    parent.Add(XZReportsXMLBuilder.XElement(countId, shiftLine.Count));
                }

                if (!string.IsNullOrEmpty(amountId))
                {
                    decimal amount = withTax ? shiftLine.NetAmount + shiftLine.TaxAmount : shiftLine.NetAmount;
                    string formattedValue = string.Format(CultureInfo.InvariantCulture, "{0:0.00}", amount);
                    parent.Add(XZReportsXMLBuilder.XElement(amountId, formattedValue));
                }

                if (!string.IsNullOrEmpty(taxAmountId))
                {
                    string formattedValue = string.Format(CultureInfo.InvariantCulture, "{0:0.00}", shiftLine.TaxAmount);
                    parent.Add(XZReportsXMLBuilder.XElement(taxAmountId, formattedValue));
                }

                if (!string.IsNullOrEmpty(taxRateId))
                {
                    string formattedValue = string.Format(CultureInfo.InvariantCulture, "{0:0.000}", shiftLine.TaxRate);
                    parent.Add(XZReportsXMLBuilder.XElement(taxRateId, formattedValue));
                }
            }

            /// <summary>
            /// Appends group elements name to the parent as separate XML elements.
            /// </summary>
            /// <param name="parent">Parent XML element.</param>
            /// <param name="groupElementNames">Group element names combined in a single string.</param>
            /// <param name="groupElementIds">XML tags for group element names.</param>
            private static void AppendLineGroupElementNames(XElement parent, string groupElementNames, string[] groupElementIds)
            {
                string[] groupElementNameValues = groupElementNames.Split(XZReportsConstants.GroupElementNamesDelimiter);

                if (groupElementNameValues.Length != groupElementIds.Length)
                {
                    throw new ArgumentException("Number of group element names and number of group element ids do not match.");
                }

                var grouElementPairs = groupElementNameValues.Zip(groupElementIds, (v, id) => new { Value = v, Id = id });

                foreach (var groupElementPair in grouElementPairs)
                {
                    parent.Add(XZReportsXMLBuilder.XElement(groupElementPair.Id, groupElementPair.Value));
                }
            }

            /// <summary>
            /// Creates new XML element.
            /// </summary>
            /// <param name="elementId">Element identifier.</param>
            /// <returns>New XML element.</returns>
            private static XElement XElement(string elementId)
            {
                return new XElement(XZReportsXMLBuilder.XElementName(elementId));
            }

            /// <summary>
            /// Creates new XML element.
            /// </summary>
            /// <param name="elementId">Element identifier.</param>
            /// <param name="value">Element content.</param>
            /// <returns>New XML element.</returns>
            private static XElement XElement(string elementId, object value)
            {
                return new XElement(XZReportsXMLBuilder.XElementName(elementId), value);
            }

            /// <summary>
            /// Converts element identifier to XML element tag.
            /// </summary>
            /// <param name="elementId">Element identifier.</param>
            /// <returns>The converted XML element tag.</returns>
            private static XName XElementName(string elementId)
            {
                XNamespace n1 = XZReportsConstants.XMLElementNameSpace;
                return string.IsNullOrWhiteSpace(elementId) ? null : n1 + elementId;
            }
        }
    }
}
