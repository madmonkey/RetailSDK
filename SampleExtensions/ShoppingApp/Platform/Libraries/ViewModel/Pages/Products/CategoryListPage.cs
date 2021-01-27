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
    using Entities;
    using Services;
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Threading.Tasks;

    [CLSCompliant(false)]
    public class CategoryListPage : PageBase
    {
        Category _parentCategory;

        public Category ParentCategory
        {
            get { return _parentCategory; }
            set { SetProperty(ref _parentCategory, value); }
        }

        ObservableCollection<Category> _SubCategories;

        public ObservableCollection<Category> SubCategories
        {
            get { return _SubCategories; }
            set { SetProperty(ref _SubCategories, value); }
        }

        public CategoryListPage(Category parentCategory = null)
        {
            ParentCategory = parentCategory;

            SubCategories = new ObservableCollection<Category>();

            LoadCategoriesCommand = new AsyncCommand(ExecuteLoadCategoriesCommand, this);
        }

        /// <summary>
        /// Command to load accounts
        /// </summary>
        public AsyncCommand LoadCategoriesCommand { get; private set; }

        private async Task ExecuteLoadCategoriesCommand()
        {
            SubCategories = new ObservableCollection<Category>(await this.GetSubCategoriesAsync());
        }

        private Task<IEnumerable<Category>> GetSubCategoriesAsync()
        {
            return ServiceManager.CategoryService.GetSubCategoriesAsync(ParentCategory?.Data?.RecordId);
        }
    }
}

