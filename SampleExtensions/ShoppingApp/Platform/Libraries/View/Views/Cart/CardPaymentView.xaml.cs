/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */


namespace Contoso.Commerce.Client.ShoppingApp.View.Views
{
    using Newtonsoft.Json;
    using Plugin.Toasts;
    using System;
    using System.Text;
    using ViewModel;
    using ViewModel.Localization;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public partial class CardPaymentView : CardPaymentViewXaml
    {
        public CardPaymentView()
        {
            InitializeComponent();
        }

        public event EventHandler<CardSubmittedEventArgs> CardSubmitted;

        public void SubmitCard()
        {
            WebView.Eval("submitCard()");
        }

        protected void OnCardSubmitted()
        {
            CardSubmitted?.Invoke(this, new CardSubmittedEventArgs());
        }

        async void WebViewMessageReceived(object sender, MessageReceivedEventArgs e)
        {
            try
            {
                CardPaymentAcceptMessageBase cardPaymentAcceptMessageBase = JsonConvert.DeserializeObject<CardPaymentAcceptMessageBase>(e.Message);
                string infoMessageValue = null;

                if (cardPaymentAcceptMessageBase.Type != CardPaymentAcceptMessageTypes.Error)
                {
                    CardPaymentAcceptInfoMessage cardPaymentAcceptInfoMessage = JsonConvert.DeserializeObject<CardPaymentAcceptInfoMessage>(e.Message);
                    infoMessageValue = cardPaymentAcceptInfoMessage.Value;
                }

                IToastNotificator notificator = AppContainer.Resolve<IToastNotificator>();
                switch (cardPaymentAcceptMessageBase.Type)
                {
                    case CardPaymentAcceptMessageTypes.CardPrefix:
                        ViewModel.CardPrefix = infoMessageValue;
                        if (string.IsNullOrWhiteSpace(ViewModel.CardType))
                        {
                            await notificator.Notify(new NotificationOptions
                            {
                                Title = Translator.Instance.GetTranslation(nameof(TextResources.Enum_ToastNotificationType_Error)),
                                Description = Translator.Instance.GetTranslation(nameof(TextResources.Views_CardPaymentView_CardTypeNotSupported)),
                            });
                        }

                        break;
                    case CardPaymentAcceptMessageTypes.Error:
                        CardPaymentAcceptErrorMessage errorMessage = JsonConvert.DeserializeObject<CardPaymentAcceptErrorMessage>(e.Message);
                        StringBuilder sb = new StringBuilder();
                        foreach (CardPaymentAcceptError error in errorMessage.Value)
                        {
                            if (sb.Length > 0)
                            {
                                sb.AppendLine();
                            }
                            sb.Append(error.Message);
                        }

                        await notificator.Notify(new NotificationOptions
                        {
                            Title = Translator.Instance.GetTranslation(nameof(TextResources.Enum_ToastNotificationType_Error)),
                            Description = sb.ToString(),
                        });
                        break;
                    case CardPaymentAcceptMessageTypes.HostReady:
                        await ViewModel.LoadCommand.ExecuteAsync();

                        if (ViewModel.CardPaymentAcceptPoint == null)
                        {
                            return;
                        }

                        var cardPaymentAcceptPoint = (Data.Entities.CardPaymentAcceptPoint)ViewModel.CardPaymentAcceptPoint.Clone();
                        int columnNumber = Device.Idiom == TargetIdiom.Phone ? 1 : 2;
                        cardPaymentAcceptPoint.AcceptPageUrl += $"&columnnumber={columnNumber}";
                        WebView.Eval($"setCardPaymentAcceptPoint('{JsonConvert.SerializeObject(cardPaymentAcceptPoint)}')");
                        break;
                    case CardPaymentAcceptMessageTypes.Result:
                        await ViewModel.SubmitCommand.ExecuteAsync(infoMessageValue);
                        OnCardSubmitted();
                        break;
                }
            }
            catch (JsonException ex)
            {
                await ViewModel.HandleExceptionAsync(ex);
            }
        }
    }

    [CLSCompliant(false)]
    public abstract class CardPaymentViewXaml : ModelBoundContentView<ViewModel.CardPaymentView> { }
}
