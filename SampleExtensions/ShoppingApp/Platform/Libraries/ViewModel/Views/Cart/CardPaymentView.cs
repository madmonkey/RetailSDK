/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    using Data.Entities;
    using Services;
    using System;
    using System.Threading.Tasks;

    [CLSCompliant(false)]
    public class CardPaymentView : ViewModelBase
    {
        private CardPaymentAcceptPoint cardPaymentAcceptPoint;
        public CardPaymentAcceptPoint CardPaymentAcceptPoint
        {
            get { return cardPaymentAcceptPoint; }
            set { SetProperty(ref cardPaymentAcceptPoint, value); }
        }

        private CardPaymentAcceptResult cardPaymentAcceptResult;
        public CardPaymentAcceptResult CardPaymentAcceptResult
        {
            get { return cardPaymentAcceptResult; }
            set { SetProperty(ref cardPaymentAcceptResult, value); }
        }

        private string cardPrefix;
        public string CardPrefix
        {
            get { return cardPrefix; }
            set
            {
                SetProperty(ref cardPrefix, value);

                CardType = ServiceManager.StoreOperationsService.GetCardTypeFromCardPrefix(CardPrefix);
            }
        }

        private string cardType;
        public string CardType
        {
            get { return cardType; }
            set { SetProperty(ref cardType, value); }
        }

        public AsyncCommand SubmitCommand { get; private set; }

        public CardPaymentView()
        {
            LoadCommand = new AsyncCommand(ExecuteLoadCommand, this);
            SubmitCommand = new AsyncCommand<string>(ExecuteSubmitCommand, this);
        }

        /// <summary>
        /// Command to load accounts
        /// </summary>
        public AsyncCommand LoadCommand { get; private set; }

        private async Task ExecuteLoadCommand()
        {
            await ServiceManager.StoreOperationsService.EnsureCardTypes();
            CardPaymentAcceptPoint = await ServiceManager.CartService.GetCardPaymentAcceptPoint(SettingsManager.ServiceSettings.CardPaymentHostPageUrl);
            IsInitialized = true;
        }

        private async Task ExecuteSubmitCommand(string cardPaymentResultAccessCode)
        {
            var cardPaymentAcceptResult = await ServiceManager.CartService.GetCardPaymentAcceptResult(cardPaymentResultAccessCode);
            await ServiceManager.CartService.AddCartTenderLine(cardPaymentAcceptResult, CardType, ServiceManager.StoreOperationsService);
        }
    }
}

