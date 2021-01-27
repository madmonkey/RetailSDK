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
    using Data.Services;
    using Plugin.Toasts;
    using System;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using System.Windows.Input;
    using Xamarin.Forms;

    [CLSCompliant(false)]
    public class AsyncCommand : ICommand
    {
        private ViewModelBase viewModel;
        private Command command;
        private Func<Task> asyncAction;
        private Func<object, Task> asyncActionWithParam;

        public event EventHandler CanExecuteChanged;

        public AsyncCommand(Func<Task> asyncAction, ViewModelBase viewModel)
        {
            ThrowIf.Null(asyncAction, nameof(asyncAction));
            ThrowIf.Null(viewModel, nameof(viewModel));

            this.viewModel = viewModel;
            this.asyncAction = asyncAction;
            command = new Command(async () => await ExecuteAsync());
        }

        public AsyncCommand(Func<object, Task> asyncAction, ViewModelBase viewModel)
        {
            ThrowIf.Null(asyncAction, nameof(asyncAction));
            ThrowIf.Null(viewModel, nameof(viewModel));

            this.viewModel = viewModel;
            asyncActionWithParam = asyncAction;
            command = new Command(async (param) => await ExecuteAsync(param));
        }

        public bool CanExecute(object parameter)
        {
            return command.CanExecute(parameter);
        }

        public void ChangeCanExecute()
        {
            command.ChangeCanExecute();
        }

        public void Execute(object parameter)
        {
            command.Execute(parameter);
        }

        public async Task ExecuteAsync(object parameter = null)
        {
            this.ChangeCanExecute();
            try
            {
                if (asyncAction != null)
                {
                    await viewModel.ExecuteAsyncAction(asyncAction);
                }
                else
                {
                    await viewModel.ExecuteAsyncAction(asyncActionWithParam, parameter);
                }
            }
            catch (DataServiceException e)
            {
                await viewModel.HandleExceptionAsync(e);
            }
            this.ChangeCanExecute();
        }
    }

    [CLSCompliant(false)]
    public class AsyncCommand<T> : AsyncCommand
    {
        public AsyncCommand(Func<T, Task> asyncAction, ViewModelBase viewModel) : base(o => asyncAction((T)o), viewModel)
        {
        }

        public Task ExecuteAsync(T parameter)
        {
            return base.ExecuteAsync(parameter);
        }
    }
}