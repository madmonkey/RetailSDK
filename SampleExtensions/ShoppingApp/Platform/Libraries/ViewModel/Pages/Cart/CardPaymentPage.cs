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
    using System;

    [CLSCompliant(false)]
    public class CardPaymentPage : PageBase
    {
        private bool _IsContinueEnabled;
        public bool IsContinueEnabled
        {
            get { return _IsContinueEnabled; }
            set { SetProperty(ref _IsContinueEnabled, value); }
        }

        private CardPaymentView _cardPaymentView;
        public CardPaymentView CardPaymentView
        {
            get { return _cardPaymentView; }
            set { SetProperty(ref _cardPaymentView, value); }
        }

        public CardPaymentPage()
        {
            this.PropertyChanged += CardPaymentPage_PropertyChanged;
            CardPaymentView = new CardPaymentView();
        }


        private void CardPaymentPage_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(IsBusy))
            {
                SetIsContinueEnabled();
            }
            else if(e.PropertyName == nameof(CardPaymentView))
            {
                CardPaymentView.PropertyChanged += CardPaymentView_PropertyChanged;
            }
        }

        private void CardPaymentView_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(CardPaymentView.IsBusy) || e.PropertyName == nameof(CardPaymentView.IsInitialized))
            {
                SetIsContinueEnabled();
            }
        }

        private void SetIsContinueEnabled()
        {
            IsContinueEnabled = !IsBusy && CardPaymentView.IsInitialized && !CardPaymentView.IsBusy;
        }
    }
}

