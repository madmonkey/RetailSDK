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
    using Settings;
    using System;
    using System.Windows.Input;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public class EvaluationModeSettingsPage : PageBase
    {
        string _DataServiceUrl;
        public string DataServiceUrl
        {
            get
            {
                return _DataServiceUrl;
            }
            set
            {
                SetProperty(ref _DataServiceUrl, value);
            }
        }

        string _MediaBaseUrl;
        public string MediaBaseUrl
        {
            get
            {
                return _MediaBaseUrl;
            }
            set
            {
                SetProperty(ref _MediaBaseUrl, value);
            }
        }

        string _CardPaymentHostPageUrl;
        public string CardPaymentHostPageUrl
        {
            get
            {
                return _CardPaymentHostPageUrl;
            }
            set
            {
                SetProperty(ref _CardPaymentHostPageUrl, value);
            }
        }

        string _OperatingUnitNumber;
        public string OperatingUnitNumber
        {
            get
            {
                return _OperatingUnitNumber;
            }
            set
            {
                SetProperty(ref _OperatingUnitNumber, value);
            }
        }

        public EvaluationModeSettingsPage()
        {
            _DataServiceUrl = SettingsManager.Instance.ServiceSettings.DataServiceUrl?.ToString();
            _MediaBaseUrl = SettingsManager.Instance.ServiceSettings.MediaBaseUrl?.ToString();
            _CardPaymentHostPageUrl = SettingsManager.Instance.ServiceSettings.CardPaymentHostPageUrl?.ToString();
            _OperatingUnitNumber = SettingsManager.Instance.ServiceSettings.OperatingUnitNumber;
            SaveSettingsCommand = new Command(ExecuteSaveSettingsCommand);
            ResetSettingsCommand = new Command(ExecuteResetSettingsCommand);
        }

        public ICommand SaveSettingsCommand { get; private set; }

        void ExecuteSaveSettingsCommand()
        {
            SettingsManager.Instance.ServiceSettings.ClearAll();
            SettingsManager.Instance.ServiceSettings.DataServiceUrl = new Uri(DataServiceUrl);
            SettingsManager.Instance.ServiceSettings.MediaBaseUrl = new Uri(MediaBaseUrl);
            SettingsManager.Instance.ServiceSettings.CardPaymentHostPageUrl = new Uri(CardPaymentHostPageUrl);
            SettingsManager.Instance.ServiceSettings.OperatingUnitNumber = OperatingUnitNumber;
            Services.ServiceManager.Invalidate();
        }

        public ICommand ResetSettingsCommand { get; private set; }

        void ExecuteResetSettingsCommand()
        {
            SettingsManager.Instance.ServiceSettings.ClearAll();
            Services.ServiceManager.Invalidate();
        }
    }
}
