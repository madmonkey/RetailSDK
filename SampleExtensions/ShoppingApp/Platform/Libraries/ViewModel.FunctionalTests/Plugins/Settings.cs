/**
 * SAMPLE CODE NOTICE
 *
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

using Plugin.Settings.Abstractions;
using System;
using System.Collections.Generic;

namespace Contoso.Commerce.Client.ShoppingApp.ViewModel.FunctionalTests.Plugins
{
    public class Settings : ISettings
    {
        Dictionary<string, object> settings = new Dictionary<string, object>();

        public bool AddOrUpdateValue<T>(string key, T value)
        {
            if (value == null)
            {
                bool exists = settings.ContainsKey(key);
                Remove(key);
                return exists;
            }

            string oldValue = null;
            if (settings.ContainsKey(key))
            {
                oldValue = settings[key]?.ToString();
            }

            string newValue = value?.ToString();
            settings[key] = value;

            return oldValue != newValue;
        }

        public bool AddOrUpdateValue(string key, decimal value, string fileName = null)
        {
            return this.AddOrUpdateValue(key, value);
        }

        public bool AddOrUpdateValue(string key, bool value, string fileName = null)
        {
            return this.AddOrUpdateValue(key, value);
        }

        public bool AddOrUpdateValue(string key, long value, string fileName = null)
        {
            return this.AddOrUpdateValue(key, value);
        }

        public bool AddOrUpdateValue(string key, string value, string fileName = null)
        {
            return this.AddOrUpdateValue(key, value);
        }

        public bool AddOrUpdateValue(string key, int value, string fileName = null)
        {
            return this.AddOrUpdateValue(key, value);
        }

        public bool AddOrUpdateValue(string key, float value, string fileName = null)
        {
            return this.AddOrUpdateValue(key, value);
        }

        public bool AddOrUpdateValue(string key, DateTime value, string fileName = null)
        {
            return this.AddOrUpdateValue(key, value);
        }

        public bool AddOrUpdateValue(string key, Guid value, string fileName = null)
        {
            return this.AddOrUpdateValue(key, value);
        }

        public bool AddOrUpdateValue(string key, double value, string fileName = null)
        {
            return this.AddOrUpdateValue(key, value);
        }

        public void Clear(string fileName = null)
        {
            throw new NotImplementedException();
        }

        public bool Contains(string key, string fileName = null)
        {
            return settings.ContainsKey(key);
        }

        public T GetValueOrDefault<T>(string key, T defaultValue = default(T))
        {
            if (settings.ContainsKey(key))
            {
                return (T)settings[key];
            }
            return defaultValue;
        }

        public decimal GetValueOrDefault(string key, decimal defaultValue, string fileName = null)
        {
            return GetValueOrDefault(key, defaultValue);
        }

        public bool GetValueOrDefault(string key, bool defaultValue, string fileName = null)
        {
            return GetValueOrDefault(key, defaultValue);
        }

        public long GetValueOrDefault(string key, long defaultValue, string fileName = null)
        {
            return GetValueOrDefault(key, defaultValue);
        }

        public string GetValueOrDefault(string key, string defaultValue, string fileName = null)
        {
            return GetValueOrDefault(key, defaultValue);
        }

        public int GetValueOrDefault(string key, int defaultValue, string fileName = null)
        {
            return GetValueOrDefault(key, defaultValue);
        }

        public float GetValueOrDefault(string key, float defaultValue, string fileName = null)
        {
            return GetValueOrDefault(key, defaultValue);
        }

        public DateTime GetValueOrDefault(string key, DateTime defaultValue, string fileName = null)
        {
            return GetValueOrDefault(key, defaultValue);
        }

        public Guid GetValueOrDefault(string key, Guid defaultValue, string fileName = null)
        {
            return GetValueOrDefault(key, defaultValue);
        }

        public double GetValueOrDefault(string key, double defaultValue, string fileName = null)
        {
            return GetValueOrDefault(key, defaultValue);
        }

        public bool OpenAppSettings()
        {
            throw new NotImplementedException();
        }

        public void Remove(string key)
        {
            settings.Remove(key);
        }

        public void Remove(string key, string fileName = null)
        {
            settings.Remove(key);
        }
    }
}
