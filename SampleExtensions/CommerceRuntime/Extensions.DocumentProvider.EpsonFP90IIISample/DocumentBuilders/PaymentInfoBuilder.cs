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
    namespace Commerce.Runtime.DocumentProvider.EpsonFP90IIISample.DocumentBuilders
    {
        using System.Collections.Generic;
        using System.Linq;
        using System.Threading.Tasks;
        using System.Xml.Linq;
        using Contoso.Commerce.Runtime.DocumentProvider.EpsonFP90IIISample.Constants;
        using Contoso.Commerce.Runtime.DocumentProvider.EpsonFP90IIISample.Helpers;
        using Microsoft.Dynamics.Commerce.Runtime;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.DataServices.Messages;
        using Microsoft.Dynamics.Commerce.Runtime.FiscalIntegration.DocumentProvider.Messages;

        /// <summary>
        /// Helper class for getting payment information
        /// </summary>
        public static class PaymentInfoBuilder
        {
            /// <summary>
            /// The supported payment method in fiscal printer.
            /// </summary>
            public enum PrinterPaymentType { Cash, Cheque, CreditOrCreditCard, Ticket }

            /// <summary>
            /// Gets the payment type and index attribute of the fiscal printer by the payment method supported in HQ.
            /// </summary>
            /// <param name="context">The current request context.</param>
            /// <param name="functionalityProfile">The functionality profile.</param>
            /// <param name="tenderTypeId">The tender type ID in HQ.</param>
            /// <returns>An array which contains the value of payment attribute and index attribute.</returns>
            public static async Task<List<string>> GetPaymentInfoAsync(RequestContext context, FiscalIntegrationFunctionalityProfile functionalityProfile, string tenderTypeId)
            {
                ThrowIf.Null(functionalityProfile, nameof(functionalityProfile));

                List<string> paymentInfo = new List<string>();
                Dictionary<string, int> tenderTypeMappings = ConfigurationController.ParseSupportedTenderTypeMappings(functionalityProfile);
                var getChannelTenderTypesDataRequest = new GetChannelTenderTypesDataRequest(context.GetPrincipal().ChannelId, QueryResultSettings.AllRecords);

                int printerTenderType;
                var tenderTypesResponse = await context.Runtime.ExecuteAsync<EntityDataServiceResponse<TenderType>>(getChannelTenderTypesDataRequest, context).ConfigureAwait(false);
                var tenderTypes = tenderTypesResponse.PagedEntityCollection.Results;
                TenderType tenderType = tenderTypes.Where(type => type.TenderTypeId == tenderTypeId).SingleOrDefault();
                bool isPrinterTenderTypeResolved = ResolvePrinterTenderType(tenderTypeMappings, tenderType, out printerTenderType);

                if (isPrinterTenderTypeResolved)
                {
                    string indexAttribute = ResolveIndexAttribute(printerTenderType, tenderType);
                    paymentInfo.Add(tenderType?.Name ?? string.Empty);
                    paymentInfo.Add(printerTenderType.ToString());
                    paymentInfo.Add(indexAttribute);
                }

                return paymentInfo;
            }

            /// <summary>
            /// Fills in the payment information. 
            /// </summary>
            /// <param name="parentElement">The parent element.</param>
            /// <param name="request">The request.</param>
            /// <param name="adjustedSalesOrder">The adjusted sales order.</param>
            /// <returns>The updated xml element.</returns>
            public static async Task<XElement> FillPaymentsAsync(XElement parentElement, GetFiscalDocumentDocumentProviderRequest request, SalesOrder adjustedSalesOrder)
            {
                bool isReturn = SalesOrderHelper.IsReturnByTransaction(adjustedSalesOrder) || SalesOrderHelper.IsReturnProduct(adjustedSalesOrder);

                if (isReturn)
                {
                    parentElement = await DocumentElementBuilder.BuildPrintRecTotalAsync(parentElement, request, adjustedSalesOrder, null, decimal.Zero).ConfigureAwait(false);
                }
                else
                {
                    // The customer order deposit amount applied to the sales transaction must be tread as a payment, and it should in first order.
                    // Build PrintRecTotal element for deposit amount.
                    if (SalesOrderHelper.IsPrepaymentAmountAppliedOnPickup(adjustedSalesOrder))
                    {
                        parentElement = await DocumentElementBuilder.BuildPrintRecTotalAsync(parentElement, request, adjustedSalesOrder, null, adjustedSalesOrder.PrepaymentAmountAppliedOnPickup, ConfigurationController.ParseDepositPaymentType(request.FiscalIntegrationFunctionalityProfile)).ConfigureAwait(false);
                    }

                    IList<TenderLine> paymentLines = SalesOrderHelper.GetPaymentLines(adjustedSalesOrder);

                    //If product has 100% discount
                    if (paymentLines.Count == 0 && adjustedSalesOrder.ActiveSalesLines.Count > 0)
                    {
                        parentElement = await DocumentElementBuilder.BuildPrintRecTotalAsync(parentElement, request, adjustedSalesOrder).ConfigureAwait(false);
                    }
                    else
                    {
                        foreach (var tenderLine in paymentLines)
                        {
                            parentElement = await DocumentElementBuilder.BuildPrintRecTotalAsync(parentElement, request, adjustedSalesOrder, tenderLine.TenderTypeId, tenderLine.Amount).ConfigureAwait(false);
                        }
                    }
                }

                return parentElement;
            }

            /// <summary>
            /// Resolves the value of attribute index according printer tender type from user configuration.
            /// </summary>
            /// <param name="printerTenderType">The printer tender type number.</param>
            /// <param name="tenderType">The tender type.</param>
            /// <returns>The value of attribute index.</returns>
            public static string ResolveIndexAttribute(int printerTenderType, TenderType tenderType = null)
            {
                string index;

                switch (printerTenderType)
                {
                    case (int)PrinterPaymentType.Cash:
                        index = DocumentAttributeConstants.DefaultIndexForCash;
                        break;
                    case (int)PrinterPaymentType.CreditOrCreditCard:
                        index = tenderType?.OperationId == (int)RetailOperation.PayCreditMemo
                            ? DocumentAttributeConstants.DefaultIndexForCreditMemo
                            : DocumentAttributeConstants.DefaultIndexForCreditAndTicket;
                        break;
                    case (int)PrinterPaymentType.Ticket:
                        index = DocumentAttributeConstants.DefaultIndexForCreditAndTicket;
                        break;
                    default:
                        index = string.Empty;
                        break;
                }

                return index;
            }

            /// <summary>
            /// Resolves the printer tender type according tender type mappings and operation.
            /// </summary>
            /// <param name="tenderTypeMappings">The tender type mappings from HQ configuration.</param>
            /// <param name="tenderType">The tender type.</param>
            /// <param name="printerTenderType">The resolved printer tender type.</param>
            /// <returns>True if resolving was successful otherwise False.</returns>
            private static bool ResolvePrinterTenderType(Dictionary<string, int> tenderTypeMappings, TenderType tenderType, out int printerTenderType)
            {
                bool isResolved = true;
                bool isMapped = tenderTypeMappings.TryGetValue(tenderType.TenderTypeId, out printerTenderType);

                if (!isMapped)
                {
                    if (tenderType?.OperationId == (int)RetailOperation.PayCreditMemo)
                    {
                        printerTenderType = (int)PrinterPaymentType.CreditOrCreditCard;
                    } else
                    {
                        isResolved = false;
                    }
                }

                return isResolved;
            }
        }
    }
}