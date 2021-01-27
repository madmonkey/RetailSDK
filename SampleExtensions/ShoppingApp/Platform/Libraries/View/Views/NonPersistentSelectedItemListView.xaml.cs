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

namespace Contoso.Commerce.Client.ShoppingApp.View.Views
{
    using System;
    using System.Windows.Input;
    using Xamarin.Forms;
    using System.Linq;
    using System.Collections.Specialized;

    [CLSCompliant(false)]
    public partial class NonPersistentSelectedItemListView : ListView
    {
        public NonPersistentSelectedItemListView()
        {
            InitializeComponent();

            // This prevents the ugly default highlighting of the selected cell upon navigating back to a list view.
            // The side effect is that the list view will no longer be maintaining the most recently selected item (if you're into that kind of thing).
            // Probably not the best way to remove that default SelectedItem styling, but simple and straighforward.
            ItemSelected += (sender, e) => SelectedItem = null;

            ItemAppearing += OnItemApearing;
            this.PropertyChanged += NonPersistentSelectedItemListView_PropertyChanged;
        }

        private void NonPersistentSelectedItemListView_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == ItemsSourceProperty.PropertyName)
            {
                ((INotifyCollectionChanged)ItemsSource).CollectionChanged += OnItemsSourceCollectionChanged;
                UpdateHeight();
            }
        }

        private void OnItemsSourceCollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
        {
            UpdateHeight();
        }

        private void UpdateHeight()
        {
            int count = 0;
            foreach (var item in ItemsSource)
            {
                count++;
            }

            HeightRequest = RowHeight * count;
        }

        public const string LoadMoreCommandPropertyName = "LoadMoreCommand";

        public static BindableProperty LoadMoreCommandProperty = BindableProperty.Create(
            propertyName: LoadMoreCommandPropertyName,
            returnType: typeof(ICommand),
            defaultBindingMode: BindingMode.OneWay,
            declaringType: typeof(NonPersistentSelectedItemListView));

        public ICommand LoadMoreCommand
        {
            get
            {
                return (ICommand)GetValue(LoadMoreCommandProperty);
            }
            set
            {
                SetValue(LoadMoreCommandProperty, value);
            }
        }

        void OnItemApearing(object sender, ItemVisibilityEventArgs e)
        {
            Object last = null;

            // get the last item on the view's ItemSource
            foreach (var item in this.ItemsSource)
            {
                last = item;
            }

            // check if user has scrolled and reached end of the list by checking if 
            // the item appearing is the last item on the list.
            if (object.ReferenceEquals(e.Item, last))
            {
                var command = LoadMoreCommand;
                if (command != null && command.CanExecute(e.Item))
                {
                    command.Execute(e.Item);
                }
            }

        }
    }
}

