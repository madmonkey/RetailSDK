"use strict";
var Commerce;
(function (Commerce) {
    "use strict";
    var ObjectExtensions = (function () {
        function ObjectExtensions() {
        }
        ObjectExtensions.isNull = function (object) {
            return (object === null);
        };
        ObjectExtensions.isUndefined = function (object) {
            return (typeof object === "undefined");
        };
        ObjectExtensions.isOfType = function (object, type) {
            return !ObjectExtensions.isUndefined(object) && object instanceof type;
        };
        ObjectExtensions.isNullOrUndefined = function (object) {
            return ObjectExtensions.isNull(object)
                || ObjectExtensions.isUndefined(object);
        };
        ObjectExtensions.isFunction = function (object) {
            return typeof object === "function";
        };
        ObjectExtensions.isObject = function (variable) {
            return typeof variable === "object";
        };
        ObjectExtensions.isNumber = function (variable) {
            return typeof variable === "number";
        };
        ObjectExtensions.isString = function (variable) {
            return typeof variable === "string";
        };
        ObjectExtensions.isBoolean = function (variable) {
            return typeof variable === "boolean";
        };
        ObjectExtensions.isPrimitive = function (variable) {
            return variable !== Object(variable);
        };
        ObjectExtensions.clone = function (origObject) {
            return ObjectExtensions.safeClone(origObject, []);
        };
        ObjectExtensions.forEachKeyValuePair = function (object, iterator) {
            if (ObjectExtensions.isNullOrUndefined(object)) {
                return;
            }
            var keys = Object.keys(object);
            var stop = false;
            for (var i = 0; !stop && i < keys.length; i++) {
                var key = keys[i];
                stop = iterator(key, object[key]) === false;
            }
        };
        ObjectExtensions.groupBy = function (inputArray, keySelector) {
            var groupedArray = [];
            if (!Commerce.ArrayExtensions.hasElements(inputArray)) {
                return groupedArray;
            }
            inputArray.forEach(function (element) {
                var groupKey = keySelector(element);
                if (typeof (groupedArray[groupKey]) === "undefined") {
                    groupedArray[groupKey] = [];
                }
                groupedArray[groupKey].push(element);
            });
            return groupedArray;
        };
        ObjectExtensions.tryDispose = function (disposableObject) {
            if (!ObjectExtensions.isNullOrUndefined(disposableObject)
                && ObjectExtensions.isFunction(disposableObject.dispose)
                && !disposableObject[ObjectExtensions.DISPOSED_FLAG]
                && !disposableObject.dispose[ObjectExtensions.DISPOSED_FLAG]) {
                if (Object.isExtensible(disposableObject)) {
                    disposableObject[ObjectExtensions.DISPOSED_FLAG] = true;
                }
                else {
                    disposableObject.dispose[ObjectExtensions.DISPOSED_FLAG] = true;
                }
                disposableObject.dispose();
                return true;
            }
            return false;
        };
        ObjectExtensions.disposeAllProperties = function (obj) {
            if (!ObjectExtensions.isNullOrUndefined(obj) && ObjectExtensions.isObject(obj)) {
                for (var propertyKey in obj) {
                    if (obj.hasOwnProperty(propertyKey)) {
                        var property = obj[propertyKey];
                        if (Array.isArray(property)) {
                            for (var itemIndex in property) {
                                if (property.hasOwnProperty(itemIndex)) {
                                    ObjectExtensions.tryDispose(property[itemIndex]);
                                }
                            }
                        }
                        else {
                            ObjectExtensions.tryDispose(property);
                        }
                        delete obj[propertyKey];
                        property = null;
                    }
                }
            }
        };
        ObjectExtensions.safeClone = function (origObject, cloneMap) {
            if (ObjectExtensions.isNullOrUndefined(origObject)) {
                return origObject;
            }
            var newObj;
            if (origObject instanceof Array) {
                if (!cloneMap.some(function (val) {
                    if (val.id === origObject) {
                        newObj = val.value;
                        return true;
                    }
                    return false;
                })) {
                    newObj = [];
                    cloneMap.push({ id: origObject, value: newObj });
                    for (var i = 0; i < origObject.length; i++) {
                        if (typeof origObject[i] === "object") {
                            newObj.push(ObjectExtensions.safeClone(origObject[i], cloneMap));
                        }
                        else {
                            newObj.push(origObject[i]);
                        }
                    }
                }
            }
            else if (origObject instanceof Date) {
                newObj = new Date(origObject.valueOf());
            }
            else if (origObject instanceof Object) {
                if (!cloneMap.some(function (val) {
                    if (val.id === origObject) {
                        newObj = val.value;
                        return true;
                    }
                    return false;
                })) {
                    newObj = ObjectExtensions.extend(origObject);
                    cloneMap.push({ id: origObject, value: newObj });
                    for (var property in newObj) {
                        if (newObj.hasOwnProperty(property)) {
                            if (typeof newObj[property] === "object") {
                                if (property === "__metadata") {
                                    newObj[property] = ObjectExtensions.extend(origObject[property]);
                                }
                                else {
                                    newObj[property] = ObjectExtensions.safeClone(origObject[property], cloneMap);
                                }
                            }
                        }
                    }
                }
            }
            else {
                newObj = origObject;
            }
            return newObj;
        };
        ObjectExtensions.extend = function (source) {
            var newObj = $.extend(false, {}, source);
            ObjectExtensions.copyOverKeysWithUndefinedValues(source, newObj);
            return newObj;
        };
        ObjectExtensions.copyOverKeysWithUndefinedValues = function (source, target) {
            Object.keys(source).forEach(function (key) {
                if (ObjectExtensions.isUndefined(target[key])) {
                    target[key] = undefined;
                }
            });
        };
        ObjectExtensions.DISPOSED_FLAG = "_dax_disposed";
        return ObjectExtensions;
    }());
    Commerce.ObjectExtensions = ObjectExtensions;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var ArrayExtensions = (function () {
        function ArrayExtensions() {
        }
        ArrayExtensions.hasElements = function (array) {
            return !Commerce.ObjectExtensions.isNullOrUndefined(array) && array.length > 0;
        };
        ArrayExtensions.hasElement = function (array, element, equalityComparer) {
            if (!ArrayExtensions.hasElements(array)) {
                return false;
            }
            var equals = ArrayExtensions._getEqualityComparer(equalityComparer);
            for (var i in array) {
                if (equals(array[i], element)) {
                    return true;
                }
            }
            return false;
        };
        ArrayExtensions.countElements = function (array) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(array)) {
                return 0;
            }
            return array.length;
        };
        ArrayExtensions.distinct = function (array, equalityComparer) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(array)) {
                return null;
            }
            if (!ArrayExtensions.hasElements(array)) {
                return [];
            }
            var equals = ArrayExtensions._getEqualityComparer(equalityComparer);
            var distinct = [];
            o: for (var i = 0, n = array.length; i < n; i++) {
                for (var x = 0, y = distinct.length; x < y; x++) {
                    if (equals(distinct[x], array[i])) {
                        continue o;
                    }
                }
                distinct.push(array[i]);
            }
            return distinct;
        };
        ArrayExtensions.difference = function (left, right, equalityComparer) {
            return ArrayExtensions._differenceOrIntersect(left, right, true, equalityComparer);
        };
        ArrayExtensions.firstOrUndefined = function (array, predicate) {
            if (!ArrayExtensions.hasElements(array)) {
                return undefined;
            }
            if (Commerce.ObjectExtensions.isFunction(predicate)) {
                for (var i = 0; i < array.length; i++) {
                    if (predicate(array[i])) {
                        return array[i];
                    }
                }
                return undefined;
            }
            else {
                return array[0];
            }
        };
        ArrayExtensions.lastOrUndefined = function (array, predicate) {
            if (!ArrayExtensions.hasElements(array)) {
                return undefined;
            }
            if (Commerce.ObjectExtensions.isFunction(predicate)) {
                for (var i = array.length - 1; i >= 0; i--) {
                    if (predicate(array[i])) {
                        return array[i];
                    }
                }
                return undefined;
            }
            else {
                return array[array.length - 1];
            }
        };
        ArrayExtensions.findIndex = function (array, predicate) {
            if (!ArrayExtensions.hasElements(array) || !Commerce.ObjectExtensions.isFunction(predicate)) {
                return -1;
            }
            for (var i = 0; i < array.length; i++) {
                if (predicate(array[i], i, array)) {
                    return i;
                }
            }
            return -1;
        };
        ArrayExtensions.sum = function (array, selector, predicate) {
            var usePredicate = false;
            if (predicate) {
                usePredicate = Commerce.ObjectExtensions.isFunction(predicate);
            }
            if (!Commerce.ObjectExtensions.isFunction(selector)) {
                throw "Selector is not a Function";
            }
            if (!ArrayExtensions.hasElements(array)) {
                return 0;
            }
            return array.reduce(function (accumulator, element) {
                var elementValue;
                if (usePredicate) {
                    elementValue = predicate(element) ? selector(element) : 0;
                }
                else {
                    elementValue = selector(element);
                }
                return accumulator + elementValue;
            }, 0);
        };
        ArrayExtensions._differenceOrIntersect = function (left, right, difference, equalityComparer) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(left) || Commerce.ObjectExtensions.isNullOrUndefined(right)) {
                return null;
            }
            return left.filter(function (value) {
                var existsInRight = ArrayExtensions.hasElement(right, value, equalityComparer);
                return difference ? !existsInRight : existsInRight;
            });
        };
        ArrayExtensions._getDefaultEqualityComparer = function () {
            return function (left, right) { return left === right; };
        };
        ArrayExtensions._getEqualityComparer = function (equalityComparer) {
            return (equalityComparer) ? equalityComparer : ArrayExtensions._getDefaultEqualityComparer();
        };
        return ArrayExtensions;
    }());
    Commerce.ArrayExtensions = ArrayExtensions;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var DateExtensions = (function () {
        function DateExtensions() {
        }
        DateExtensions.setTimeToLastSecondOfDay = function (date) {
            date.setHours(23, 59, 59);
        };
        DateExtensions.isTodayOrFutureDate = function (date) {
            return DateExtensions.isTodayDate(date) || DateExtensions.isFutureDate(date);
        };
        DateExtensions.isFutureDate = function (date) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(date)) {
                return false;
            }
            var yearFutureDate = date.getFullYear();
            var monthFutureDate = date.getMonth();
            var dayOfMonthFutureDate = date.getDate();
            var now = DateExtensions.now;
            var yearNow = now.getFullYear();
            var monthNow = now.getMonth();
            var dayOfMonthNow = now.getDate();
            if (yearFutureDate > yearNow) {
                return true;
            }
            else if (yearFutureDate === yearNow && monthFutureDate > monthNow) {
                return true;
            }
            else if (yearFutureDate === yearNow && monthFutureDate === monthNow && dayOfMonthFutureDate > dayOfMonthNow) {
                return true;
            }
            return false;
        };
        DateExtensions.compareDates = function (dateA, dateB) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(dateA) || Commerce.ObjectExtensions.isNullOrUndefined(dateB)) {
                throw Error("invalid arguments");
            }
            var yearDateA = dateA.getFullYear();
            var monthDateA = dateA.getMonth();
            var dayOfMonthDateA = dateA.getDate();
            var yearDateB = dateB.getFullYear();
            var monthDateB = dateB.getMonth();
            var dayOfMonthDateB = dateB.getDate();
            if (yearDateA > yearDateB) {
                return 1;
            }
            else if (yearDateA === yearDateB && monthDateA > monthDateB) {
                return 1;
            }
            else if (yearDateA === yearDateB && monthDateA === monthDateB && dayOfMonthDateA > dayOfMonthDateB) {
                return 1;
            }
            else if (yearDateA === yearDateB && monthDateA === monthDateB && dayOfMonthDateA === dayOfMonthDateB) {
                return 0;
            }
            return -1;
        };
        DateExtensions.isTodayDate = function (date) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(date)) {
                return false;
            }
            var year = date.getFullYear();
            var month = date.getMonth();
            var dayOfMonth = date.getDate();
            var now = DateExtensions.now;
            return now.getFullYear() === year && now.getMonth() === month && now.getDate() === dayOfMonth;
        };
        DateExtensions.getDate = function (dateTime) {
            if (dateTime == null) {
                dateTime = new Date();
            }
            var newDate = new Date(dateTime.getTime());
            newDate.setHours(0, 0, 0, 0);
            return newDate;
        };
        DateExtensions.addDays = function (dateTime, days) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(dateTime)) {
                dateTime = DateExtensions.now;
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(days) || days === 0) {
                return dateTime;
            }
            var newDate = new Date(dateTime.getTime());
            newDate.setDate(dateTime.getDate() + days);
            return newDate;
        };
        Object.defineProperty(DateExtensions, "now", {
            get: function () {
                return new Date();
            },
            enumerable: true,
            configurable: true
        });
        DateExtensions.areEqual = function (left, right) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(left) || Commerce.ObjectExtensions.isNullOrUndefined(right)) {
                return false;
            }
            return left.getTime() === right.getTime();
        };
        DateExtensions.getMinDate = function () {
            return new Date(1, 1, 1);
        };
        DateExtensions.isValidDate = function (object) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(object)) {
                return false;
            }
            return (!isNaN(Date.parse(object.toString())));
        };
        DateExtensions.convertStringToDateObject = function (value) {
            return OData.jsonLightReadStringPropertyValue(value, "Edm.DateTimeOffset", false);
        };
        return DateExtensions;
    }());
    Commerce.DateExtensions = DateExtensions;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var EnumExtensions = (function () {
        function EnumExtensions() {
        }
        EnumExtensions.getNumericValues = function (e) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(e)) {
                return [];
            }
            return EnumExtensions.getObjValues(e)
                .filter(function (v) { return Commerce.ObjectExtensions.isNumber(v); });
        };
        EnumExtensions.getStringValues = function (e) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(e)) {
                return [];
            }
            return EnumExtensions.getObjValues(e)
                .filter(function (v) { return Commerce.ObjectExtensions.isString(v); });
        };
        EnumExtensions.getValues = function (e) {
            return EnumExtensions.getNumericValues(e);
        };
        EnumExtensions.getObjValues = function (e) {
            var objValues = Object.keys(e).map(function (k) { return e[k]; });
            return objValues;
        };
        return EnumExtensions;
    }());
    Commerce.EnumExtensions = EnumExtensions;
})(Commerce || (Commerce = {}));
var Commerce;
(function (Commerce) {
    "use strict";
    var StringExtensions = (function () {
        function StringExtensions() {
        }
        Object.defineProperty(StringExtensions, "EMPTY", {
            get: function () {
                return "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StringExtensions, "NEW_LINE", {
            get: function () {
                return "\r\n";
            },
            enumerable: true,
            configurable: true
        });
        StringExtensions.isEmpty = function (object) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(object)) {
                if (!Commerce.ObjectExtensions.isString(object)) {
                    throw new Error("StringExtensions.isEmpty() has received input parameter not of type string.");
                }
                return object === "";
            }
            return false;
        };
        StringExtensions.isEmptyOrWhitespace = function (object) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(object)) {
                if (!Commerce.ObjectExtensions.isString(object)) {
                    throw new Error("StringExtensions.isEmptyOrWhitespace() has received input parameter not of type string.");
                }
                return object === "" || object.trim() === "";
            }
            return false;
        };
        StringExtensions.isNullOrWhitespace = function (object) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(object)) {
                if (!Commerce.ObjectExtensions.isString(object)) {
                    throw new Error("StringExtensions.isNullOrWhitespace() has received input parameter not of type string.");
                }
                return object === "" || object.trim() === "";
            }
            return true;
        };
        StringExtensions.padLeft = function (str, padString, length) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(str)) {
                if (!Commerce.ObjectExtensions.isString(str)) {
                    throw new Error("StringExtensions.padLeft() has received input parameter not of type string.");
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(padString)) {
                    while (str.length < length) {
                        str = padString + str;
                    }
                }
            }
            return str;
        };
        StringExtensions.padRight = function (str, padString, length) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(str)) {
                if (!Commerce.ObjectExtensions.isString(str)) {
                    throw new Error("StringExtensions.padRight() has received input parameter not of type string.");
                }
                if (!Commerce.ObjectExtensions.isNullOrUndefined(padString)) {
                    while (str.length < length) {
                        str += padString;
                    }
                }
            }
            return str;
        };
        StringExtensions.format = function (object) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            if (!Commerce.ObjectExtensions.isNullOrUndefined(object) && !Commerce.ObjectExtensions.isString(object)) {
                throw new Error("StringExtensions.format() has received input parameter not of type string.");
            }
            if (StringExtensions.isNullOrWhitespace(object)) {
                return object;
            }
            if (params == null) {
                throw new Error("StringExtensions.format() Invalid parameter (params) cannot be null.");
            }
            for (var i = 0; i < params.length; i++) {
                if (params[i] == null) {
                    throw new Error("StringExtensions.format() Invalid parameter (at index " + i + ") cannot be null or undefined.");
                }
                var param = params[i].toString().replace(/\$/gi, "$$$$");
                var regexp = new RegExp("\\{" + i + "\\}", "gi");
                object = object.replace(regexp, param);
            }
            return object;
        };
        StringExtensions.compare = function (object, comparisonObject, ignoreCase) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(object) && Commerce.ObjectExtensions.isNullOrUndefined(comparisonObject)) {
                return 0;
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(object)) {
                return -1;
            }
            else if (Commerce.ObjectExtensions.isNullOrUndefined(comparisonObject)) {
                return 1;
            }
            var val1 = ignoreCase ? object.toLowerCase() : object;
            var val2 = ignoreCase ? comparisonObject.toLowerCase() : comparisonObject;
            return val1 < val2 ? -1 : val1 > val2 ? 1 : 0;
        };
        StringExtensions.replaceAll = function (txt, txtToReplace, valueToReplaceWith) {
            return txt.replace(new RegExp(txtToReplace, "g"), valueToReplaceWith);
        };
        StringExtensions.cleanUri = function (uri) {
            if (!Commerce.ObjectExtensions.isNullOrUndefined(uri)) {
                uri = uri.trim();
            }
            if (StringExtensions.isNullOrWhitespace(uri)) {
                return "";
            }
            var cutoffIndex = uri.length - 1;
            while (cutoffIndex >= 0
                && (uri[cutoffIndex] === "/"
                    || uri[cutoffIndex] === "\\")) {
                --cutoffIndex;
            }
            return uri.substr(0, cutoffIndex + 1);
        };
        StringExtensions.beginsWith = function (str, prefix, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = false; }
            if (Commerce.ObjectExtensions.isNullOrUndefined(str) || Commerce.ObjectExtensions.isNullOrUndefined(prefix)) {
                return false;
            }
            if (prefix.length > str.length) {
                return false;
            }
            var originalString = (caseSensitive) ? str : str.toLowerCase();
            var subString = (caseSensitive) ? prefix : prefix.toLowerCase();
            return originalString.indexOf(subString) === 0;
        };
        StringExtensions.endsWith = function (str, suffix, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = false; }
            if (Commerce.ObjectExtensions.isNullOrUndefined(str) || Commerce.ObjectExtensions.isNullOrUndefined(suffix)) {
                return false;
            }
            if (suffix.length > str.length) {
                return false;
            }
            var originalString = (caseSensitive) ? str : str.toLowerCase();
            var subString = (caseSensitive) ? suffix : suffix.toLowerCase();
            return originalString.indexOf(subString, originalString.length - subString.length) !== -1;
        };
        StringExtensions.formattedJoin = function (stringArray, formatString) {
            if (Commerce.ObjectExtensions.isNullOrUndefined(formatString)) {
                throw new Error("StringExtensions.formattedJoin() Invalid parameter (formatString) cannot be null.");
            }
            if (Commerce.ObjectExtensions.isNullOrUndefined(stringArray)) {
                return StringExtensions.EMPTY;
            }
            var formattedResult = StringExtensions.EMPTY;
            for (var i = 0; i < stringArray.length; i++) {
                if (!StringExtensions.isNullOrWhitespace(stringArray[i])) {
                    if (StringExtensions.isEmpty(formattedResult)) {
                        formattedResult = stringArray[i];
                    }
                    else {
                        formattedResult = StringExtensions.format(formatString, formattedResult, stringArray[i]);
                    }
                }
            }
            return formattedResult;
        };
        return StringExtensions;
    }());
    Commerce.StringExtensions = StringExtensions;
})(Commerce || (Commerce = {}));

// SIG // Begin signature block
// SIG // MIIj/QYJKoZIhvcNAQcCoIIj7jCCI+oCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // XYvwyNlRgyGKhiTfbdK/tVtXrJjQF6QmB/aR2YvPiNqg
// SIG // gg2BMIIF/zCCA+egAwIBAgITMwAAAYdyF3IVWUDHCQAA
// SIG // AAABhzANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTIwMDMwNDE4Mzk0N1oX
// SIG // DTIxMDMwMzE4Mzk0N1owdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // zrfJC3Oz90+zCiIaLmB3sDBZp6vAMruxToWQkGm1cAad
// SIG // lUuFsgdkHuE0AU/Ggc5wDQxD4xyjXT0/F8+XDWpYulx3
// SIG // n0vIv1l7RdL0rD/DRL+pgR7gNqdX8NsAfxdHR7Cdxn2e
// SIG // XNLDyY5JbImKj8OfcSeeJDPdSDoIjtjlM4zQJYz4m4wl
// SIG // nx+1M0NUzx3OHcHopbPBhCK2wUW+yFsIjmy9do1k+GIe
// SIG // 9TUILyfRZ+vlIQ/cdrpN3S4/OL8LdTbhUIrSicSFdH1b
// SIG // ETUd2m0FTi6qQ7oG69EszS+qPMczhy+Tl4hhsIOnpIlw
// SIG // Nf9l12O8lRXN/bZXnQ7WY0ozW3sdc88ElwIDAQABo4IB
// SIG // fjCCAXowHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFIaL+GcjvemsZCXTI6c7ts1V
// SIG // ziXLMFAGA1UdEQRJMEekRTBDMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEWMBQG
// SIG // A1UEBRMNMjMwMDEyKzQ1ODM4NTAfBgNVHSMEGDAWgBRI
// SIG // bmTlUAXTgqoXNzcitW2oynUClTBUBgNVHR8ETTBLMEmg
// SIG // R6BFhkNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // b3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3JsMGEGCCsGAQUFBwEBBFUwUzBRBggrBgEFBQcw
// SIG // AoZFaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9w
// SIG // cy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQEL
// SIG // BQADggIBAIsZskuhOr6a1g/ShTSAfRuc8jLiI2QDrlCd
// SIG // RCv1ZYOhW92R1441MAEyiHF2xbhQulq+Cja1OA2P7AVa
// SIG // pmm+QAv43t26VKY7caRMqlKrT3N9MBIP6zvb5ipqiqCz
// SIG // 09+7L3NjVQZhjZfvOajuH1f8OwseydAW6pNfSnETXY7e
// SIG // niqE50zxwR5VR0CB2aTMWnGxTgJCa6gFZGGXc+4pDV08
// SIG // VfhkW9+rQuAcjDcRNgxe7xXb2omT9AlWeQcidoAIVzHS
// SIG // vfrrMc1ZPdd6inXtTgLlnb/q53apACJvH1JUZ6+LGkgo
// SIG // O3CG1MAgn9desFCexLiQ4NLx3soZwnh5wW8h90WZBxIt
// SIG // qH5n4JxSEiWQ3TAHlWRlTodtCaedFwc6qJKT83mes3Nf
// SIG // 4MiCzcolYBPkT5I51ELIXdX9TzIJ97Z7Ngs+2yYlVGqh
// SIG // Dt5/akRYMuSbi2nulMHhnwHjqN3YC2cYpCs2LN4QzGhL
// SIG // SavCD+9XF+0F3upZzJl1Px3X89qfPe2XfpFPr2byiN3M
// SIG // C37lUICtkWds/inNyt3UT89q18nCuVwrkWZrxmm/1m62
// SIG // Ygu8CUGqYAaHZbTCORjHRawYPSHhe/6z+BKlUF3irXr0
// SIG // 5WV46bjYYY7kftgzLf3Vrn416YlvdW6N2h+hGozgC15q
// SIG // MYJbQqdSu4a0uoJrL4/eHC0X+dEEOFPEMIIHejCCBWKg
// SIG // AwIBAgIKYQ6Q0gAAAAAAAzANBgkqhkiG9w0BAQsFADCB
// SIG // iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // IDIwMTEwHhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEw
// SIG // OTA5WjB+MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQD
// SIG // Ex9NaWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDEx
// SIG // MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
// SIG // q/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4Bjga
// SIG // BEm6f8MMHt03a8YS2AvwOMKZBrDIOdUBFDFC04kNeWSH
// SIG // fpRgJGyvnkmc6Whe0t+bU7IKLMOv2akrrnoJr9eWWcpg
// SIG // GgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato88tt8zpc
// SIG // oRb0RrrgOGSsbmQ1eKagYw8t00CT+OPeBw3VXHmlSSnn
// SIG // Db6gE3e+lD3v++MrWhAfTVYoonpy4BI6t0le2O3tQ5GD
// SIG // 2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDstrjNYxbc+/jLT
// SIG // swM9sbKvkjh+0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOE
// SIG // y/S6A4aN91/w0FK/jJSHvMAhdCVfGCi2zCcoOCWYOUo2
// SIG // z3yxkq4cI6epZuxhH2rhKEmdX4jiJV3TIUs+UsS1Vz8k
// SIG // A/DRelsv1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL
// SIG // 5zmhD+kjSbwYuER8ReTBw3J64HLnJN+/RpnF78IcV9uD
// SIG // jexNSTCnq47f7Fufr/zdsGbiwZeBe+3W7UvnSSmnEyim
// SIG // p31ngOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8Hh
// SIG // hUSJxAlMxdSlQy90lfdu+HggWCwTXWCVmj5PM4TasIgX
// SIG // 3p5O9JawvEagbJjS4NaIjAsCAwEAAaOCAe0wggHpMBAG
// SIG // CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTlUAXT
// SIG // gqoXNzcitW2oynUClTAZBgkrBgEEAYI3FAIEDB4KAFMA
// SIG // dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx
// SIG // 0SOJNDBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4G
// SIG // CCsGAQUFBwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3J0MIGfBgNV
// SIG // HSAEgZcwgZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEF
// SIG // BQcCARYzaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
// SIG // aW9wcy9kb2NzL3ByaW1hcnljcHMuaHRtMEAGCCsGAQUF
// SIG // BwICMDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5
// SIG // AF8AcwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQBn8oalmOBUeRou09h0ZyKbC5YR4WOS
// SIG // mUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0epo/Np
// SIG // 22O/IjWll11lhJB9i0ZQVdgMknzSGksc8zxCi1LQsP1r
// SIG // 4z4HLimb5j0bpdS1HXeUOeLpZMlEPXh6I/MTfaaQdION
// SIG // 9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtYSWMfCWlu
// SIG // WpiW5IP0wI/zRive/DvQvTXvbiWu5a8n7dDd8w6vmSiX
// SIG // mE0OPQvyCInWH8MyGOLwxS3OW560STkKxgrCxq2u5bLZ
// SIG // 2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZiWhub6e3dMNA
// SIG // BQamASooPoI/E01mC8CzTfXhj38cbxV9Rad25UAqZaPD
// SIG // XVJihsMdYzaXht/a8/jyFqGaJ+HNpZfQ7l1jQeNbB5yH
// SIG // PgZ3BtEGsXUfFL5hYbXw3MYbBL7fQccOKO7eZS/sl/ah
// SIG // XJbYANahRr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbS
// SIG // oqKfenoi+kiVH6v7RyOA9Z74v2u3S5fi63V4GuzqN5l5
// SIG // GEv/1rMjaHXmr/r8i+sLgOppO6/8MO0ETI7f33VtY5E9
// SIG // 0Z1WTk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZO
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFdQw
// SIG // ghXQAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAGHchdyFVlAxwkAAAAAAYcwDQYJYIZI
// SIG // AWUDBAIBBQCgggEnMBkGCSqGSIb3DQEJAzEMBgorBgEE
// SIG // AYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3
// SIG // AgEVMC8GCSqGSIb3DQEJBDEiBCCKL6PSo6CMiANszZna
// SIG // 8z1/CVD/57XvSqAp2kpujitLlzCBugYKKwYBBAGCNwIB
// SIG // DDGBqzCBqKCBiYCBhgBTAGkAbQBwAGwAaQBmAHkAQwBv
// SIG // AG0AbQBlAHIAYwBlAC4ATQBpAGMAcgBvAHMAbwBmAHQA
// SIG // RAB5AG4AYQBtAGkAYwBzAC4AQwBvAG4AbgBlAGMAdABv
// SIG // AHIALgBQAG8AcgB0AGEAYgBsAGUALgByAGUAcwBvAHUA
// SIG // cgBjAGUAcwAuAGQAbABsoRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQBMqXzV
// SIG // wdJXWt3a5bQyRwwKAdiKAQnrlExfr9RpqJK0iopb+HqF
// SIG // dCGieRLUrJZTD8iF4A72BTJ8fiNpAJhTzHdNSOoerPNG
// SIG // cNNqzhzDVX5x1qHADFchI5lQjhvJUKAj3qhrT5TZDh3H
// SIG // ccNzprZu2I9aHh83es41bpbcmnKwXXy4tM7ljq86t0uL
// SIG // E6jQk4ZjIme6qqF9cl6wRGLXUj6YTRMa+yK2U82im5PL
// SIG // Se8Ls7J5YsmsLX0hZtnScFGHmQGxMpm8k0OdKWieRFWK
// SIG // NbwXzWf0hOLQV/qwPRJpwVcJmXsLMF5YjScwpQ1So2E2
// SIG // jg1FM09EWt0j8r1x5xuPaNADz2B7oYIS5DCCEuAGCisG
// SIG // AQQBgjcDAwExghLQMIISzAYJKoZIhvcNAQcCoIISvTCC
// SIG // ErkCAQMxDzANBglghkgBZQMEAgEFADCCAVAGCyqGSIb3
// SIG // DQEJEAEEoIIBPwSCATswggE3AgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEIC0jiZN2JoX26/mj4h0E
// SIG // y/V0nEPZygvCwdwnOqVBWkD0AgZfOqnO9SgYEjIwMjAw
// SIG // ODIzMDQwMjQyLjc4WjAEgAIB9KCB0KSBzTCByjELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0
// SIG // IEFtZXJpY2EgT3BlcmF0aW9uczEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046RDZCRC1FM0U3LTE2ODUxJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wg
// SIG // gg48MIIE8TCCA9mgAwIBAgITMwAAAR4OvOVLFqIDGwAA
// SIG // AAABHjANBgkqhkiG9w0BAQsFADB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMDAeFw0xOTExMTMyMTQwNDBaFw0y
// SIG // MTAyMTEyMTQwNDBaMIHKMQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSUwIwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVy
// SIG // YXRpb25zMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpE
// SIG // NkJELUUzRTctMTY4NTElMCMGA1UEAxMcTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgU2VydmljZTCCASIwDQYJKoZIhvcN
// SIG // AQEBBQADggEPADCCAQoCggEBAM4TtxgQovz18FyurO38
// SIG // G3WqlV+etLFjCViCzevcL+0aVl4USidzKo5r5FFgZB9b
// SIG // 6ncAkfAJxYf6xmQ42HDmtpju+cK2O24q3xu+o1DRp7DF
// SIG // d3261HnBZVRfnEoR7PAIh9eenBq+LFH4Z3pArL3U1y8T
// SIG // wVdBU91WEOvcUyLM6qSpyHIdiuPgz0uC3FuSIPJxrGxq
// SIG // /dfrxO21zCkFwwKfahsVJmMJpRXMdsavoR+gvTdN5pvH
// SIG // RZmsR7bHtBPRmRhAEJiYlLVRdBIBVWOpvXCcxevv7Ufx
// SIG // 8cut3X920zYOxH8NfCfASjP1nVSmt5+WmHd3VXYhtX3M
// SIG // o559eCn8gHZpFLsCAwEAAaOCARswggEXMB0GA1UdDgQW
// SIG // BBSMEyjnkXhG4Ev7fps/2a8n2maKWzAfBgNVHSMEGDAW
// SIG // gBTVYzpcijGQ80N7fEYbxTNoWoVtVTBWBgNVHR8ETzBN
// SIG // MEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NybC9wcm9kdWN0cy9NaWNUaW1TdGFQQ0FfMjAx
// SIG // MC0wNy0wMS5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsG
// SIG // AQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NlcnRzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAx
// SIG // LmNydDAMBgNVHRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBCwUAA4IBAQAuZNyOdZYj
// SIG // kIITIlQNJeh2NIc83bDeiIBFIO+DmMjbsfaGPuv0L7/5
// SIG // 4xTmR+TMj2ZMn/ebW5pTJoa9Y75oZd8XqFO/KEYBCjah
// SIG // yXC5Bxw+pWqT70BGsg+m0IdGYaFADJYQm6NWC1atY38q
// SIG // 0oscfoZYgGR4THJIkXZpN+7uPr1yA/PkMNK+XdSaCFQG
// SIG // XW5NdSH/Qx5CySF3B8ngEpRos7aoABeaVAfja1FVqxrS
// SIG // o1gx0+bvEXVhBWWvUQGe+b2VQdNpvQ2pUX4S7qRufctS
// SIG // zSiAeBaYECaRCNY5rK1ovLAwiEd3Bg7KntLBolQfHr1w
// SIG // /Vc2s52iScaFReh04dJdfiFtMIIGcTCCBFmgAwIBAgIK
// SIG // YQmBKgAAAAAAAjANBgkqhkiG9w0BAQsFADCBiDELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWljcm9zb2Z0
// SIG // IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIwMTAw
// SIG // HhcNMTAwNzAxMjEzNjU1WhcNMjUwNzAxMjE0NjU1WjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDCCASIwDQYJ
// SIG // KoZIhvcNAQEBBQADggEPADCCAQoCggEBAKkdDbx3EYo6
// SIG // IOz8E5f1+n9plGt0VBDVpQoAgoX77XxoSyxfxcPlYcJ2
// SIG // tz5mK1vwFVMnBDEfQRsalR3OCROOfGEwWbEwRA/xYIiE
// SIG // VEMM1024OAizQt2TrNZzMFcmgqNFDdDq9UeBzb8kYDJY
// SIG // YEbyWEeGMoQedGFnkV+BVLHPk0ySwcSmXdFhE24oxhr5
// SIG // hoC732H8RsEnHSRnEnIaIYqvS2SJUGKxXf13Hz3wV3Ws
// SIG // vYpCTUBR0Q+cBj5nf/VmwAOWRH7v0Ev9buWayrGo8noq
// SIG // CjHw2k4GkbaICDXoeByw6ZnNPOcvRLqn9NxkvaQBwSAJ
// SIG // k3jN/LzAyURdXhacAQVPIk0CAwEAAaOCAeYwggHiMBAG
// SIG // CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBTVYzpcijGQ
// SIG // 80N7fEYbxTNoWoVtVTAZBgkrBgEEAYI3FAIEDB4KAFMA
// SIG // dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAfBgNVHSMEGDAWgBTV9lbLj+iiXGJo0T2UkFvX
// SIG // zpoYxDBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcmwwWgYIKwYB
// SIG // BQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0Nl
// SIG // ckF1dF8yMDEwLTA2LTIzLmNydDCBoAYDVR0gAQH/BIGV
// SIG // MIGSMIGPBgkrBgEEAYI3LgMwgYEwPQYIKwYBBQUHAgEW
// SIG // MWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9QS0kvZG9j
// SIG // cy9DUFMvZGVmYXVsdC5odG0wQAYIKwYBBQUHAgIwNB4y
// SIG // IB0ATABlAGcAYQBsAF8AUABvAGwAaQBjAHkAXwBTAHQA
// SIG // YQB0AGUAbQBlAG4AdAAuIB0wDQYJKoZIhvcNAQELBQAD
// SIG // ggIBAAfmiFEN4sbgmD+BcQM9naOhIW+z66bM9TG+zwXi
// SIG // qf76V20ZMLPCxWbJat/15/B4vceoniXj+bzta1RXCCtR
// SIG // gkQS+7lTjMz0YBKKdsxAQEGb3FwX/1z5Xhc1mCRWS3Tv
// SIG // QhDIr79/xn/yN31aPxzymXlKkVIArzgPF/UveYFl2am1
// SIG // a+THzvbKegBvSzBEJCI8z+0DpZaPWSm8tv0E4XCfMkon
// SIG // /VWvL/625Y4zu2JfmttXQOnxzplmkIz/amJ/3cVKC5Em
// SIG // 4jnsGUpxY517IW3DnKOiPPp/fZZqkHimbdLhnPkd/DjY
// SIG // lPTGpQqWhqS9nhquBEKDuLWAmyI4ILUl5WTs9/S/fmNZ
// SIG // JQ96LjlXdqJxqgaKD4kWumGnEcua2A5HmoDF0M2n0O99
// SIG // g/DhO3EJ3110mCIIYdqwUB5vvfHhAN/nMQekkzr3ZUd4
// SIG // 6PioSKv33nJ+YWtvd6mBy6cJrDm77MbL2IK0cs0d9LiF
// SIG // AR6A+xuJKlQ5slvayA1VmXqHczsI5pgt6o3gMy4SKfXA
// SIG // L1QnIffIrE7aKLixqduWsqdCosnPGUFN4Ib5KpqjEWYw
// SIG // 07t0MkvfY3v1mYovG8chr1m1rtxEPJdQcdeh0sVV42ne
// SIG // V8HR3jDA/czmTfsNv11P6Z0eGTgvvM9YBS7vDaBQNdrv
// SIG // CScc1bN+NR4Iuto229Nfj950iEkSoYICzjCCAjcCAQEw
// SIG // gfihgdCkgc0wgcoxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJTAj
// SIG // BgNVBAsTHE1pY3Jvc29mdCBBbWVyaWNhIE9wZXJhdGlv
// SIG // bnMxJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkQ2QkQt
// SIG // RTNFNy0xNjg1MSUwIwYDVQQDExxNaWNyb3NvZnQgVGlt
// SIG // ZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQA5
// SIG // yQbj7emrMRP+jjdYuspZjMqw3KCBgzCBgKR+MHwxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQSAyMDEwMA0GCSqGSIb3DQEB
// SIG // BQUAAgUA4uxoXjAiGA8yMDIwMDgyMzEyMDAzMFoYDzIw
// SIG // MjAwODI0MTIwMDMwWjB3MD0GCisGAQQBhFkKBAExLzAt
// SIG // MAoCBQDi7GheAgEAMAoCAQACAhBCAgH/MAcCAQACAhGQ
// SIG // MAoCBQDi7bneAgEAMDYGCisGAQQBhFkKBAIxKDAmMAwG
// SIG // CisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEAAgMB
// SIG // hqAwDQYJKoZIhvcNAQEFBQADgYEAO0DwpYt+sNotvMbQ
// SIG // b2Pf8hJBAK3fliWfJhRMQjoa0rJISRiXJKHhHUS2YXtO
// SIG // Mx+Uz1D9jZkA3tsThkKf2jklPLiRbqSlZ4cXAd4HTSD5
// SIG // 8nhmOVxnZhWR8wgub4JVKi9wox6NyR76jLAoNQ8KeNyv
// SIG // S6SH/e84ovoV2lzcD7F/dJ8xggMNMIIDCQIBATCBkzB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAAR4O
// SIG // vOVLFqIDGwAAAAABHjANBglghkgBZQMEAgEFAKCCAUow
// SIG // GgYJKoZIhvcNAQkDMQ0GCyqGSIb3DQEJEAEEMC8GCSqG
// SIG // SIb3DQEJBDEiBCCtBy86KqG5/DHSRM+p8oY3YjXMZMPb
// SIG // kUBiokW4R7thTjCB+gYLKoZIhvcNAQkQAi8xgeowgecw
// SIG // geQwgb0EIHM75FjD33E6UeW9p588oTdxLc0l1ZTx+iIE
// SIG // HA+N1l9HMIGYMIGApH4wfDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAg
// SIG // UENBIDIwMTACEzMAAAEeDrzlSxaiAxsAAAAAAR4wIgQg
// SIG // n/ScMmS3N8OB+l3mibZ4FLRLLRBjqhhx9QzZYI0WCesw
// SIG // DQYJKoZIhvcNAQELBQAEggEAdvD67xMZVJmH3zRdyrqq
// SIG // 9jVZTZuaTQ2VWAWLZXQyJ51JrjnFu4YHQmSCi9ZKbT4c
// SIG // trqg6oi5Y/ptN2V6PgeIipvq4u6dzTxtFNoZHINn2wDD
// SIG // oTBHgE5dkppQuqUR5fJFlzEDfKCbEzpJVyBgipjx+0Q2
// SIG // ycmciT13FodBs6SrFx6dY+QPSGKwncGw6huq9MH8tXJf
// SIG // jwZVddBGrON1iMKVGpS8GaJ7HnN4D/XNWaiPCH5373Eu
// SIG // TDI7v46RuIr5fzuxGY6q28FgsyGlES7cyUoAyK51dpGX
// SIG // RjhSohqFS1UjLgxTf8FZT3NIsBbnKaHZ/HKRVLMbl9qZ
// SIG // V7hJqAaKmL4+4Q==
// SIG // End signature block
