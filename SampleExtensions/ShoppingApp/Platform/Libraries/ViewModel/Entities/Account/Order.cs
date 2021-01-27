/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Contoso.Commerce.Client.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities
{
    public class Order : EntityBase<SalesOrder>
    {
        public Order(Data.Entities.SalesOrder salesOrder):base(salesOrder)
        {
        }

        public string OrderNumber
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(Data.ChannelReferenceId))
                {
                    return Data.ChannelReferenceId;
                }
                else if (!string.IsNullOrWhiteSpace(Data.SalesId))
                {
                    return Data.SalesId;
                }
                else
                {
                    return Data.ReceiptId;
                }
            }
        }

        public SalesStatus Status
        {
            get
            {
                return (SalesStatus)Data.StatusValue;
            }
        }

        public string ShippingCityStateZipCode
        {
            get
            {
                return string.Format("{0}, {1} {2}", Data.ShippingAddress.City, Data.ShippingAddress.State, Data.ShippingAddress.ZipCode);
            }
        }
    }
}
