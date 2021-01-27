/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using System;
using System.Collections.ObjectModel;
using Contoso.Commerce.Client.Data.Entities;
using Contoso.Commerce.Client.ShoppingApp.ViewModel.Entities;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel
{
    public class Dimension : EntityBase<ProductDimension>
    {
        public Dimension(ProductDimension productDimension) : base(productDimension)
        {
            Options = new ObservableCollection<ProductDimensionValue>();
            SelectedOptionIndex = -1;
        }

        public int DisplayOrderIndex
        {
            get; set;
        }

        private int _selectedOptionIndex;
        public int SelectedOptionIndex
        {
            get
            {
                return _selectedOptionIndex;
            }
            set
            {
                _selectedOptionIndex = value;

                if (_selectedOptionIndex >= 0)
                {
                    this.Data.DimensionValue = Options[_selectedOptionIndex];
                }
                else
                {
                    this.Data.DimensionValue = null;
                }
            }
        }

        private bool _isEnabled;
        public bool IsEnabled
        {
            get
            {
                return _isEnabled;
            }
            set
            {
                SetProperty(ref _isEnabled, value);
            }
        }

        public ObservableCollection<ProductDimensionValue> Options
        {
            get; set;
        }

    }
}

