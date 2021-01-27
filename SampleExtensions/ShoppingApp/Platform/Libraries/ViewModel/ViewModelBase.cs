/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

// The MIT License (MIT)
// 
// Copyright (c) 2015 Xamarin
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    using Client.Localization;
    using Configurations;
    using Contoso.Commerce.Client.ShoppingApp.ViewModel.Toasts;
    using Localization;
    using Plugin.Toasts;
    using Services;
    using Settings;
    using System;
    using System.Diagnostics;
    using System.Threading.Tasks;

    [CLSCompliant(false)]
    public abstract class ViewModelBase : ObservableBase
    {
        bool isInitialized;

        public bool IsInitialized
        { 
            get { return isInitialized; }
            set { SetProperty(ref isInitialized, value); }
        }

        bool needsRefresh;

        public bool NeedsRefresh
        {
            get { return needsRefresh; }
            set { SetProperty(ref needsRefresh, value); }
        }

        bool canLoadMore;
        public bool CanLoadMore
        {
            get { return canLoadMore; }
            set { SetProperty(ref canLoadMore, value); }
        }
        
        bool isBusy;

        public bool IsBusy
        {
            get { return isBusy; }
            set { SetProperty(ref isBusy, value); }
        }

        public ConfigurationManager ConfigurationManager { get; private set; }
        public SettingsManager SettingsManager { get; private set; }
        public ServiceManager ServiceManager { get; private set; }

        protected ViewModelBase(): this(ConfigurationManager.Instance, SettingsManager.Instance, ServiceManager.Current)
        {
        }

        /// <remarks>Multithread should pass a separate service manager.</remarks>
        protected ViewModelBase(ConfigurationManager configurationManager, SettingsManager settingsManager, ServiceManager serviceManager)
        {
            ConfigurationManager = configurationManager;
            SettingsManager = settingsManager;
            ServiceManager = serviceManager;
        }

        public async Task ExecuteAsyncAction(Func<Task> asyncAction)
        {
            if (IsBusy)
                return;

            IsBusy = true;

            await asyncAction();

            IsBusy = false;
        }

        public async Task ExecuteAsyncAction(Func<object, Task> asyncAction, object param)
        {
            if (IsBusy)
                return;

            IsBusy = true;

            await asyncAction(param);

            IsBusy = false;
        }

        public async Task HandleExceptionAsync(Exception e, string message = null, ToastNotificationType notificationType = ToastNotificationType.Error)
        {
            Debug.WriteLine(e);

            IsBusy = false;

            var notificator = AppContainer.Resolve<IToastNotificator>();

            if (message == null)
            {
                message = ConfigurationManager.ServiceConfiguration.IsEvaluationModeEnabled ?
                    Translator.Instance.GetTranslation(nameof(TextResources.ServiceNotAvailableEvaluationMode)) :
                    Translator.Instance.GetTranslation(nameof(TextResources.ServiceNotAvailable));
            }

            int durationSeconds = 5;

            bool debugMode = ConfigurationManager.ServiceConfiguration.DebugMode;
#if DEBUG
            debugMode = true;
#endif
            if (debugMode)
            {
                message += Environment.NewLine + e.ToString();
                durationSeconds = 30;
            }

            var tapped = await notificator.Notify(new NotificationOptions
            {
                Title = Translator.Instance.GetEnumTranslation(notificationType),
                Description = message
            });
        }
    }
}