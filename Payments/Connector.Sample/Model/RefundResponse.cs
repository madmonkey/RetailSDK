/*
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
*/
namespace Microsoft.Dynamics
{
    namespace Retail.SampleConnector.Portable
    {
        using System;
        using System.Collections.Generic;
        using Microsoft.Dynamics.Retail.PaymentSDK.Portable;
        using Microsoft.Dynamics.Retail.PaymentSDK.Portable.Constants;

        /// <summary>
        /// Response for <see cref="RefundRequest"/>.
        /// </summary>
        /// <seealso cref="Microsoft.Dynamics.Retail.SampleConnector.Portable.ResponseBase" />
        internal class RefundResponse : ResponseBase
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="RefundResponse" /> class.
            /// Contains attributes associated with a Refund response.
            /// Also contains a helper method to convert <see cref="RefundResponse"/> object into a <see cref="Response"/> object.
            /// </summary>
            /// <param name="locale">The locale value derived from the request.</param>
            /// <param name="serviceAccountId">Service Account ID associated with the Merchant Account derived from the request.</param>
            /// <param name="connectorName">Name of the connector.</param>
            internal RefundResponse(string locale, string serviceAccountId, string connectorName)
                : base(locale, serviceAccountId, connectorName)
            {
            }

            /// <summary>
            /// Gets or sets the card type associated with the Refund response.
            /// </summary>
            internal string CardType { get; set; }

            /// <summary>
            ///  Gets or sets the last four digits of the card number associated with the Refund response.
            /// </summary>
            internal string Last4Digit { get; set; }

            /// <summary>
            ///  Gets or sets the card token string associated with the Refund response.
            /// </summary>
            internal string CardToken { get; set; }

            /// <summary>
            /// Gets or sets the card's unique ID associated with the Refund response.
            /// </summary>
            internal string UniqueCardId { get; set; }

            /// <summary>
            /// Gets or sets the provider transaction ID associated with the Refund response.
            /// </summary>
            internal string ProviderTransactionId { get; set; }

            /// <summary>
            /// Gets or sets the approval code associated with the Refund response.
            /// </summary>
            internal string ApprovalCode { get; set; }

            /// <summary>
            /// Gets or sets the response code associated with the Refund response.
            /// </summary>
            internal string ResponseCode { get; set; }

            /// <summary>
            /// Gets or sets the approved amount associated with the Refund response.
            /// </summary>
            internal decimal? ApprovedAmount { get; set; }

            /// <summary>
            /// Gets or sets the currency code associated with the Refund response.
            /// </summary>
            internal string CurrencyCode { get; set; }

            /// <summary>
            /// Gets or sets the refund result associated with the Refund response.
            /// </summary>
            internal string RefundResult { get; set; }

            /// <summary>
            /// Gets or sets the provider message associated with the Refund response.
            /// </summary>
            internal string ProviderMessage { get; set; }

            /// <summary>
            /// Gets or sets the transaction type associated with the Refund response.
            /// </summary>
            internal string TransactionType { get; set; }

            /// <summary>
            /// Gets or sets the transaction date and time associated with the Refund response.
            /// </summary>
            internal DateTime? TransactionDateTime { get; set; }

            /// <summary>
            /// Gets or sets the payment tracking identifier.
            /// </summary>
            internal string PaymentTrackingId { get; set; }

            /// <summary>
            /// Will convert the passed-in <see cref="RefundResponse"/> object into a <see cref="Response"/> object.
            /// </summary>
            /// <param name="refundResponse"><see cref="RefundResponse"/> object to be parsed and converted into a <see cref="Response"/> object.</param>
            /// <returns><see cref="Response"/> object derived from the parsing of the passed-in <see cref="RefundResponse"/> object.</returns>
            internal static Response ConvertTo(RefundResponse refundResponse)
            {
                var response = new Response();
                refundResponse.WriteBaseProperties(response);

                var properties = new List<PaymentProperty>();
                if (response.Properties != null)
                {
                    properties.AddRange(response.Properties);
                }

                var refundRespnseProperties = new List<PaymentProperty>();
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.CardType, refundResponse.CardType);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.Last4Digits, refundResponse.Last4Digit);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.CardToken, refundResponse.CardToken);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.UniqueCardId, refundResponse.UniqueCardId);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.ProviderTransactionId, refundResponse.ProviderTransactionId);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.ApprovalCode, refundResponse.ApprovalCode);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.ResponseCode, refundResponse.ResponseCode);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.ApprovedAmount, refundResponse.ApprovedAmount);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.CurrencyCode, refundResponse.CurrencyCode);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.RefundResult, refundResponse.RefundResult);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.ProviderMessage, refundResponse.ProviderMessage);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.TransactionType, refundResponse.TransactionType);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.TransactionDateTime, refundResponse.TransactionDateTime);
                PaymentUtilities.AddPropertyIfPresent(refundRespnseProperties, GenericNamespace.RefundResponse, RefundResponseProperties.PaymentTrackingId, refundResponse.PaymentTrackingId);
                properties.Add(new PaymentProperty(GenericNamespace.RefundResponse, RefundResponseProperties.Properties, refundRespnseProperties.ToArray()));

                response.Properties = properties.ToArray();
                return response;
            }
        }
    }
}
