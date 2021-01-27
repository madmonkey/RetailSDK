(function () {
    "use strict";

    var loader = {
        loadScript: function (path, done) {
            var url = path;
            var scriptTag = document.createElement("script");
            scriptTag.type = "text/javascript";
            scriptTag.onload = done;
            scriptTag.src = url;
            document.head.appendChild(scriptTag);
        },

        // Load stylesheet.
        loadStyleSheet: function (path, id) {
            var url = path;
            var fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", url);

            if (id) {
                fileref.setAttribute("id", id);
            }

            document.head.appendChild(fileref);
        }
    };

    var MapWrapper = function () {

        var ErrorEvent = function (errorMessage) {
            this.message = errorMessage;
        };

        var MapMessages = {
            ERROR: "error",
            INFOBOX_HYPERLINK_CLICKED: "infoboxHyperlinkClicked",
            INITIALIZATION_ERROR: "initialization_error",
            LOADED: "loaded",
            READY: "ready",
            SEARCH_SUCCESS: "searchSuccess",
            UPDATE_LOCATIONS: "updateLocations"
        };

        var DistanceUnit = { Miles: 0, Kilometers: 1 };

        var protocol = document.location.protocol.indexOf("ms-appx") !== -1
            ? "ms-appx:"    // in case ms-appx is part of the protocol, we are inside an win8-app
            : document.location.protocol;

        var domain = protocol + "//" + document.location.host;

        var map = null;
        var mapsAPIKey = null;
        var mapScriptLoadAttempts = 5; // max load attempt count, delay 500 ms between
        var previousZoomValue = null;
        var previousCenter = null;
        var distanceUnitValue = DistanceUnit.Miles;
        var currentCssTheme = "";
        var accentColorLoaded = false;
        var currentTextDirection = null;
        var currentInfobox = null;
        var currentInfoboxClickId = null;
        var currentInfoboxClickEvent = null;
        var currentClickEvent = null;

        var requiredModules = [
            "Microsoft.Maps.Search"
        ];

        var posLightThemeElementId = "";
        var posDarkThemeElementId = "";
        var winUILightThemeElementId = "";
        var winUIDarkThemeElementId = "";

        return {
            processMessage: function (msg) {
                if (!msg || !msg.data || msg.origin !== domain) {
                    return;
                }
                var call = JSON.parse(msg.data);

                if (!call.functionName) {
                    throw "Message does not contain a valid function name.";
                }
                var target = this[call.functionName];

                if (typeof target != "function") {
                    throw "The function name does not resolve to an actual function";
                }

                target.apply(this, call.args);
            },

            notifyParent: function (event, args) {
                if (!args) args = {};

                args["event"] = event;
                window.parent.postMessage(JSON.stringify(args), domain);
            },

            addListener: function () {
                window.addEventListener("message", this.processMessage.bind(this), false);
            },

            loadModules: function () {
                for (var moduleIndex in requiredModules) {
                    if (requiredModules.hasOwnProperty(moduleIndex)) {

                        var module = requiredModules[moduleIndex];
                        Microsoft.Maps.loadModule(module, { callback: this.onModuleLoaded.bind(this, module) });
                    }
                }
            },

            onModuleLoaded: function (module) {
                var moduleIndex = requiredModules.indexOf(module);
                requiredModules.splice(moduleIndex, 1);
                if (requiredModules.length === 0) {
                    this.initMap();
                }
            },

            init: function (credentials) {

                // make sure that all is loaded
                if (typeof Microsoft === "undefined" || !Microsoft.Maps.hasOwnProperty("loadModule")) {
                    if (mapScriptLoadAttempts-- > 0) {
                        setTimeout(this.init.bind(this, credentials), 500);
                    } else {
                        this.notifyParent.call(this, MapMessages.INITIALIZATION_ERROR, new ErrorEvent("Map cannot be initialized"));
                    }

                    return;
                }

                if (!credentials) {
                    this.notifyParent.call(this, MapMessages.ERROR, new ErrorEvent("Bing maps api key is missing"));
                    return;
                }

                mapsAPIKey = credentials;

                this.loadModules.call(this);
            },

            initMap: function () {

                map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), {
                    credentials: mapsAPIKey,
                    mapTypeId: Microsoft.Maps.MapTypeId.road,
                    showBreadcrumb: false
                });

                previousZoomValue = map.getZoom();
                previousCenter = map.getCenter();

                Microsoft.Maps.Events.addThrottledHandler(map, "viewchangestart", this.viewChangeStart.bind(this), 1000);
                Microsoft.Maps.Events.addThrottledHandler(map, "viewchangeend", this.viewChangeEnd.bind(this), 1000);

                this.notifyParent.call(this, MapMessages.LOADED);
                mapLoaded = true;
            },

            pinLocation: function (latitude, longitude, text) {

                if (!this.checkMap()) {
                    return;
                }

                var location = new Microsoft.Maps.Location(latitude, longitude);
                var pushpin = new Microsoft.Maps.Pushpin(location, { text: text });

                map.entities.push(pushpin);
            },

            removeAllPushpins: function () {

                if (!this.checkMap()) {
                    return;
                }

                for (var i = map.entities.getLength() - 1; i >= 0; i--) {
                    var pushpin = map.entities.get(i);
                    if (pushpin instanceof Microsoft.Maps.Pushpin) {
                        map.entities.removeAt(i);
                    };
                }
            },

            // Remove infobox(es) from Bing maps.
            removeInfobox: function () {
                var element = document.getElementById(currentInfoboxClickId);
                if (element && currentInfoboxClickEvent) {
                    element.removeEventListener("click", currentInfoboxClickEvent);
                }
                currentClickEvent = null;

                if (currentInfobox) {
                    currentInfobox.setMap(null);
                    currentInfobox = null;
                }
            },

            // Show infobox on Bing maps.
            setInfobox: function (latitude, longitude, closeButtonId, title, text) {

                if (this.checkMap()) {
                    this.removeInfobox();

                    // A buffer limit to use to specify the infobox must be away from the edges of the map.
                    var buffer = 9;

                    var infoboxOptions = {
                        width: 350, height: 150, showCloseButton: false, zIndex: 0,
                        offset: new Microsoft.Maps.Point(0, buffer), showPointer: true,
                        title: title, description: text
                    };

                    currentInfobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions);
                    currentInfobox.setMap(map);

                    var location = new Microsoft.Maps.Location(latitude, longitude);
                    currentInfobox.setLocation(location);

                    // Move map if infobox is partially hidden.
                    var infoboxOffset = currentInfobox.getOffset();
                    var infoboxAnchor = currentInfobox.getAnchor();
                    var infoboxLocation = map.tryLocationToPixel(location, Microsoft.Maps.PixelReference.control);

                    var dx = infoboxLocation.x + infoboxOffset.x - infoboxAnchor.x;
                    var dy = infoboxLocation.y - buffer - infoboxAnchor.y;

                    if (dy < buffer) { // Infobox overlaps with top of map.
                        // Offset in opposite direction.
                        dy *= -1;
 
                        // Add buffer from the top edge of the map.
                        dy += buffer;
                    } else {
                        dy = map.getHeight() - infoboxLocation.y + infoboxAnchor.y - currentInfobox.getHeight();

                        // If dy is greater than buffer then it does not overlap.
                        if (dy > buffer) {
                            dy = 0;
                        } else {
                            // Add a buffer from the bottom edge of the map.
                            dy -= buffer;
                        }
                    }
 
                    // Check to see if overlapping with left side of map.
                    if (dx < buffer) {    

                        // Offset in opposite direction.
                        dx *= -1;
 
                        // Add a buffer from the left edge of the map.
                        dx += buffer;
                    } else { // Check to see if overlapping with right side of map.
                        
                        dx = map.getWidth() - infoboxLocation.x + infoboxAnchor.x - currentInfobox.getWidth();
 
                        // If dx is greater than buffer then it does not overlap.
                        if (dx > buffer) {
                            dx = 0;
                        } else {
                            // Add a buffer from the right edge of the map.
                            dx -= buffer;
                        }
                    }
 
                    // Adjust the map so infobox is in view.
                    if (dx !== 0 || dy !== 0) {
                        var centerPixel = map.tryLocationToPixel(map.getCenter());
                        centerPixel.x -= dx;
                        centerPixel.y -= dy;
                        map.setView({ center: map.tryPixelToLocation(centerPixel) });
                    }

                    if (closeButtonId) {
                        var infoBox = document.getElementById(closeButtonId);
                        if (infoBox) {
                            currentInfoboxClickId = closeButtonId;

                            var self = this;
                            currentClickEvent = function (mouseEvent) {
                                self.removeInfobox();
                            };
                            currentInfoboxClickEvent = currentClickEvent;
                            infoBox.addEventListener("click", currentClickEvent);
                        }
                    }
                }
            },

            setMapView: function (latitude, longitude, zoom) {

                if (!this.checkMap()) {
                    return;
                }

                var view = {};
                if (latitude != null && longitude != null) {
                    view['center'] = new Microsoft.Maps.Location(latitude, longitude);
                }
                if (zoom) {
                    view['zoom'] = zoom;
                }

                map.setView(view);
            },

            searchByAddress: function (address) {
                if (!this.checkMap()) {
                    this.notifyParent.call(this, MapMessages.INITIALIZATION_ERROR, new ErrorEvent("Map cannot be initialized"));
                    return;
                }

                var searchManager = new Microsoft.Maps.Search.SearchManager(map);

                var request = {
                    where: address,
                    count: 1,
                    callback: onSearchSuccess.bind(this),
                    errorCallback: onSearchFailed.bind(this)
                };

                searchManager.geocode(request);

                function onSearchSuccess(result) {
                    if (result) {
                        map.entities.clear();
                        var topResult = result.results && result.results[0];
                        var resultData = {};
                        if (topResult) {
                            map.setView({ center: topResult.location, zoom: 10 });
                            resultData.searchResult = topResult;
                            resultData.radius = this.getExcircleRadius(map.getBounds());
                        }

                        this.notifyParent.call(this, MapMessages.SEARCH_SUCCESS, resultData);
                    }
                }

                function onSearchFailed(result) {
                    this.notifyParent.call(this, MapMessages.ERROR, result);
                }
            },

            checkMap: function () {
                if (map === null) {
                    return false;
                }
                return true;
            },

            viewChangeStart: function () {
                previousZoomValue = map.getZoom();
                previousCenter = map.getCenter();
            },

            viewChangeEnd: function () {
                var newZoomValue = map.getZoom();
                var newBounds = map.getBounds();

                // We are starting search only when panning or when zooming out
                if ((this.isNotZeroLocation(newBounds.center) && this.isNotZeroLocation(previousCenter) && !Microsoft.Maps.Location.areEqual(newBounds.center, previousCenter))
                    || newZoomValue < previousZoomValue) {
                    this.notifyParent.call(this, MapMessages.UPDATE_LOCATIONS, { longitude: newBounds.center.longitude, latitude: newBounds.center.latitude, radius: this.getExcircleRadius(newBounds) });

                    previousZoomValue = newZoomValue;
                    previousCenter = newBounds.center;
                }
            },

            isNotZeroLocation: function (location) {

                // The smallest latitude and longitude value that we are taking into account as non-zero
                // other values less than EPSILON are considered as equal to zero
                var EPSILON = 0.0001;

                return Math.abs(location.latitude) > EPSILON && Math.abs(location.longitude) > EPSILON;
            },

            // This method is used for maximum distance calculation when searching stores.
            // Returns the radius of the excircle of the current map view based on rib with max length.
            getExcircleRadius: function (locationRect) {

                var conversionValue = this.getUnitConversion();

                var width = Math.abs(conversionValue * locationRect.width * Math.cos(locationRect.center.latitude * (Math.PI / 180)));
                var height = conversionValue * locationRect.height;

                var maxLength = Math.max(width, height);

                return maxLength / Math.sqrt(2);
            },

            getUnitConversion: function () {
                var MILES_PER_1_LATITUDE_DEGREE = 69.055; // average number of miles per latitude degree. Actual value changes from 68.703 to 69.407 miles
                var KILOMETERS_PER_1_LATITUDE_DEGREE = 111.133; // average number of kilometers per latitude degree. Actual value changes from 110.567 to 111.699 kilometers

                return distanceUnitValue === DistanceUnit.Miles ? MILES_PER_1_LATITUDE_DEGREE : KILOMETERS_PER_1_LATITUDE_DEGREE;
            },

            //Initialize CSS element theme identifier.
            initializeThemeElementIds: function (posLightThemeId, posDarkThemeId, winUILightThemeId, winUIDarkThemeId) {
                posLightThemeElementId = posLightThemeId,
                posDarkThemeElementId = posDarkThemeId,
                winUILightThemeElementId = winUILightThemeId,
                winUIDarkThemeElementId = winUIDarkThemeId
            },

            // Remove stylesheet by identifier.
            removeStyleSheetById: function (id) {
                $("head link[id=" + id + "]").remove();
            },

            // Apply CSS theme.
            applyCSSTheme: function (theme) {
                if (currentCssTheme === theme) {
                    return;
                }

                var infoboxSelector = "body";
                if (theme === "dark") {
                    loader.loadStyleSheet("../../../Libraries/winjs/css/ui-dark.css", winUIDarkThemeElementId);
                    loader.loadStyleSheet("../../../Stylesheets/Themes/PosDarkTheme.css", posDarkThemeElementId);

                    //apply selected theme on infobox
                    $(infoboxSelector).removeClass(currentCssTheme);
                    $(infoboxSelector).addClass(theme);

                    currentCssTheme = theme;

                    // after loading the correct CSS files, remove the unnecessary ones, if applicable
                    if (document.getElementById(posLightThemeElementId)) {
                        this.removeStyleSheetById(posLightThemeElementId);
                    }
                    if (document.getElementById(winUILightThemeElementId)) {
                        this.removeStyleSheetById(winUILightThemeElementId);
                    }
                } else if (theme === "light") {
                    loader.loadStyleSheet("../../../Libraries/winjs/css/ui-light.css", winUILightThemeElementId);
                    loader.loadStyleSheet("../../../Stylesheets/Themes/PosLightTheme.css", posLightThemeElementId);

                    //apply selected theme on infobox
                    $(infoboxSelector).removeClass(currentCssTheme);
                    $(infoboxSelector).addClass(theme);
                    currentCssTheme = theme;

                    // after loading the correct CSS files, remove the unnecessary ones, if applicable
                    if (document.getElementById(posDarkThemeElementId)) {
                        this.removeStyleSheetById(posDarkThemeElementId);
                    }
                    if (document.getElementById(winUIDarkThemeElementId)) {
                        this.removeStyleSheetById(winUIDarkThemeElementId);
                    }
                }
                loader.loadStyleSheet("../../../Stylesheets/Main.min.css");
            },

            // Apply accent color.
            applyAccentColor: function (accentColor) {
                if (accentColorLoaded) {
                    return;
                }

                var styleSheet = null;
                for (var i = 0; i < document.styleSheets.length; i++) {
                    if (document.styleSheets[i].href && document.styleSheets[i].href.match("Main.min.css$")) {
                        styleSheet = document.styleSheets[i];
                        break;
                    }
                }

                if (!styleSheet) {
                    return;
                }

                if (styleSheet.addRule) {
                    styleSheet.addRule("a, a:active, a:hover", "color: " + accentColor + " !important");
                } else if (styleSheet.insertRule) {
                    styleSheet.insertRule("a, a:active, a:hover { color: " + accentColor + " !important }");
                }

                accentColorLoaded = true;
            },

            // Apply text direction.
            applyTextDirection: function (textDirection) {
                if (currentTextDirection === textDirection) {
                    return;
                }

                $("body").attr("dir", textDirection);
                currentTextDirection = textDirection;
            },

            start: function () {
                MapWrapper.addListener();
                this.notifyParent.call(this, MapMessages.READY);
            }
        };
    }();

    // load css style sheets
    loader.loadScript('../../../Libraries/jQuery.min.js', function () {
        MapWrapper.start();
    });
})();
// SIG // Begin signature block
// SIG // MIIkDgYJKoZIhvcNAQcCoIIj/zCCI/sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // C90UDQhNIWJWPIKcfuEtKi/y7zilreNRLDiUI9Aw2feg
// SIG // gg2FMIIGAzCCA+ugAwIBAgITMwAAAYivUta5km3o+QAA
// SIG // AAABiDANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTIwMDMwNDE4Mzk0OFoX
// SIG // DTIxMDMwMzE4Mzk0OFowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // kgja8hPgnsMtpuLf2u+MGewvWE8L9T8guAbzP5EljzbP
// SIG // J9EU3vhb2H1PhPbn9Le52JQMx4yvqZYn9gYQ/jYHYSFE
// SIG // PLFcFjt/bY70ER4z9v/70ryH5ppEaDC9SIZ47PZEImUM
// SIG // 2EQ2GEafcUkGJkcEI5OYZfP1O0YDokA4rVR2lOwU9TCP
// SIG // dpX2UbiCAw2AXb17W3JWCTFTsKmbb9Dvc0Aq3rekfn0U
// SIG // hmgzXxBKXCCy/g+0VdzOLmiROE2uigDnb1fjFWiadWFx
// SIG // U2TyraYxzunfaR0D2YhuzXQukG50RprGuPLjUK2+gH5i
// SIG // ygyNS6d9VjKIE2l+bWX/gmU/T0rr4zgizQIDAQABo4IB
// SIG // gjCCAX4wHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFI/USS/czaz3C9dEWXTECF2T
// SIG // ezBvMFQGA1UdEQRNMEukSTBHMS0wKwYDVQQLEyRNaWNy
// SIG // b3NvZnQgSXJlbGFuZCBPcGVyYXRpb25zIExpbWl0ZWQx
// SIG // FjAUBgNVBAUTDTIzMDAxMis0NTgzODYwHwYDVR0jBBgw
// SIG // FoAUSG5k5VAF04KqFzc3IrVtqMp1ApUwVAYDVR0fBE0w
// SIG // SzBJoEegRYZDaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraW9wcy9jcmwvTWljQ29kU2lnUENBMjAxMV8yMDEx
// SIG // LTA3LTA4LmNybDBhBggrBgEFBQcBAQRVMFMwUQYIKwYB
// SIG // BQUHMAKGRWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9w
// SIG // a2lvcHMvY2VydHMvTWljQ29kU2lnUENBMjAxMV8yMDEx
// SIG // LTA3LTA4LmNydDAMBgNVHRMBAf8EAjAAMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQAp16PIY6exXk/h+okJVdwnBp5Emxby
// SIG // KSmGn4M2AhaN1B2NVR2CVW+YxxDvKBtukKgRC5mpOjEy
// SIG // Pq2t1ijExoRNbBCJaME3KeCALPGucKQoelX+Gf2wLSKa
// SIG // T96d4F5Nl/FF03PlsY0GLA5BYks6PzgWuYZHVtYOBKTu
// SIG // N5fZo06AXahD7SF7Gex4tf+suICtD5jIsBvCzKUp9J/6
// SIG // Ehxo61DQYByT8YLOt0pX+fEBgc57l4kWl5n01A3a74Ua
// SIG // HHcSDIvJ10MFgAjIkMyUkcwT+UtsFKu5zAKo2k23l4Sa
// SIG // g9khVR3VGJSq7r7T0sG56kkVkxiPLOBRF7fky98OSZ8F
// SIG // WZmZFBaIqEAzDIxcmirq3SeqZ8269YekFtEfe31nPMRC
// SIG // MyyDolNq48FgLZUKhTvCjYspI2BshH+S8gCSgDvqyXfX
// SIG // 7GEflQWriBEKGJo51G01zEmNi3+SjJblpQzhlYfKul45
// SIG // gXHKWk/vLQn8aWlWD4tZ3J8E8Gj0L1avEY1g0Qez2vK7
// SIG // h4I9hyRYuvfoXKu5lseZ01Lc8xWu0UmXxOWtWuQLgZhj
// SIG // Ua+3/HDX2tNfrYlo1SpNWvoCVAUj9LCMXnBW1Ul02e26
// SIG // nmpeOV0gyIrGQZFm/vN0213UxjA0lBSkwHbQvq9+Rn7D
// SIG // fEFcufR2+WWMwF3M4YEZpOzchOow9GJuUyoluTCCB3ow
// SIG // ggVioAMCAQICCmEOkNIAAAAAAAMwDQYJKoZIhvcNAQEL
// SIG // BQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xMjAwBgNVBAMT
// SIG // KU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhv
// SIG // cml0eSAyMDExMB4XDTExMDcwODIwNTkwOVoXDTI2MDcw
// SIG // ODIxMDkwOVowfjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYG
// SIG // A1UEAxMfTWljcm9zb2Z0IENvZGUgU2lnbmluZyBQQ0Eg
// SIG // MjAxMTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoC
// SIG // ggIBAKvw+nIQHC6t2G6qghBNNLrytlghn0IbKmvpWlCq
// SIG // uAY4GgRJun/DDB7dN2vGEtgL8DjCmQawyDnVARQxQtOJ
// SIG // DXlkh36UYCRsr55JnOloXtLfm1OyCizDr9mpK656Ca/X
// SIG // llnKYBoF6WZ26DJSJhIv56sIUM+zRLdd2MQuA3WraPPL
// SIG // bfM6XKEW9Ea64DhkrG5kNXimoGMPLdNAk/jj3gcN1Vx5
// SIG // pUkp5w2+oBN3vpQ97/vjK1oQH01WKKJ6cuASOrdJXtjt
// SIG // 7UORg9l7snuGG9k+sYxd6IlPhBryoS9Z5JA7La4zWMW3
// SIG // Pv4y07MDPbGyr5I4ftKdgCz1TlaRITUlwzluZH9TupwP
// SIG // rRkjhMv0ugOGjfdf8NBSv4yUh7zAIXQlXxgotswnKDgl
// SIG // mDlKNs98sZKuHCOnqWbsYR9q4ShJnV+I4iVd0yFLPlLE
// SIG // tVc/JAPw0XpbL9Uj43BdD1FGd7P4AOG8rAKCX9vAFbO9
// SIG // G9RVS+c5oQ/pI0m8GLhEfEXkwcNyeuBy5yTfv0aZxe/C
// SIG // HFfbg43sTUkwp6uO3+xbn6/83bBm4sGXgXvt1u1L50kp
// SIG // pxMopqd9Z4DmimJ4X7IvhNdXnFy/dygo8e1twyiPLI9A
// SIG // N0/B4YVEicQJTMXUpUMvdJX3bvh4IFgsE11glZo+TzOE
// SIG // 2rCIF96eTvSWsLxGoGyY0uDWiIwLAgMBAAGjggHtMIIB
// SIG // 6TAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4EFgQUSG5k
// SIG // 5VAF04KqFzc3IrVtqMp1ApUwGQYJKwYBBAGCNxQCBAwe
// SIG // CgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB
// SIG // /wQFMAMBAf8wHwYDVR0jBBgwFoAUci06AjGQQ7kUBU7h
// SIG // 6qfHMdEjiTQwWgYDVR0fBFMwUTBPoE2gS4ZJaHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvTWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIyLmNy
// SIG // bDBeBggrBgEFBQcBAQRSMFAwTgYIKwYBBQUHMAKGQmh0
// SIG // dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMv
// SIG // TWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIyLmNydDCB
// SIG // nwYDVR0gBIGXMIGUMIGRBgkrBgEEAYI3LgMwgYMwPwYI
// SIG // KwYBBQUHAgEWM2h0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2lvcHMvZG9jcy9wcmltYXJ5Y3BzLmh0bTBABggr
// SIG // BgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBwAG8AbABp
// SIG // AGMAeQBfAHMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkq
// SIG // hkiG9w0BAQsFAAOCAgEAZ/KGpZjgVHkaLtPYdGcimwuW
// SIG // EeFjkplCln3SeQyQwWVfLiw++MNy0W2D/r4/6ArKO79H
// SIG // qaPzadtjvyI1pZddZYSQfYtGUFXYDJJ80hpLHPM8QotS
// SIG // 0LD9a+M+By4pm+Y9G6XUtR13lDni6WTJRD14eiPzE32m
// SIG // kHSDjfTLJgJGKsKKELukqQUMm+1o+mgulaAqPyprWElj
// SIG // HwlpblqYluSD9MCP80Yr3vw70L01724lruWvJ+3Q3fMO
// SIG // r5kol5hNDj0L8giJ1h/DMhji8MUtzluetEk5CsYKwsat
// SIG // ruWy2dsViFFFWDgycScaf7H0J/jeLDogaZiyWYlobm+n
// SIG // t3TDQAUGpgEqKD6CPxNNZgvAs0314Y9/HG8VfUWnduVA
// SIG // KmWjw11SYobDHWM2l4bf2vP48hahmifhzaWX0O5dY0Hj
// SIG // Wwechz4GdwbRBrF1HxS+YWG18NzGGwS+30HHDiju3mUv
// SIG // 7Jf2oVyW2ADWoUa9WfOXpQlLSBCZgB/QACnFsZulP0V3
// SIG // HjXG0qKin3p6IvpIlR+r+0cjgPWe+L9rt0uX4ut1eBrs
// SIG // 6jeZeRhL/9azI2h15q/6/IvrC4DqaTuv/DDtBEyO3991
// SIG // bWORPdGdVk5Pv4BXIqF4ETIheu9BCrE/+6jMpF3BoYib
// SIG // V3FWTkhFwELJm3ZbCoBIa/15n8G9bW1qyVJzEw16UM0x
// SIG // ghXhMIIV3QIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABiK9S1rmSbej5AAAAAAGIMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBJzAZBgkqhkiG9w0BCQMxDAYK
// SIG // KwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYKKwYB
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgfxghQz1EmTbM
// SIG // gaxMJFWG+x7OswUbk1YHN5YzaR0r7k0wgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // diXNF8QQAU1faVTLtfeDEi/uVfbaTFQGy3fAjJOkvf49
// SIG // D9fAiapOy0ukTQ9V6hZLz3mU3cAL+ZQsIEHLixN7GEWi
// SIG // 9ua3iVDUTMC0WdFEP5RBhhLj/JubDvyq63bdvrsyM48+
// SIG // trS/68xicHTKrzF6MT2n5kDycbobkyS3vJp50JPh4+Hu
// SIG // kYgj1zd9Ksv585ddmC6ALD6icobdcbF1+rghOCUX4lx4
// SIG // ZgrpM3ne86Uog69IhKuHAoWhq3rmmiLTPn8DyFQbd1do
// SIG // 2BjvqXw1tAx9TGgiHf/k3reaU75GPN8WFEHCw6zuN2ct
// SIG // eR39z/lvIAH4SgrnpTNt6RVAebEmPdXKWKGCEvEwghLt
// SIG // BgorBgEEAYI3AwMBMYIS3TCCEtkGCSqGSIb3DQEHAqCC
// SIG // EsowghLGAgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFVBgsq
// SIG // hkiG9w0BCRABBKCCAUQEggFAMIIBPAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCDEFpe3b4cCjOgi
// SIG // CeMAdUY9w6A6bHMAtXOctZ1hcqPM/AIGXzvk2807GBMy
// SIG // MDIwMDgyMzA0MDI0Ni43MjVaMASAAgH0oIHUpIHRMIHO
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEmMCQG
// SIG // A1UECxMdVGhhbGVzIFRTUyBFU046RjdBNi1FMjUxLTE1
// SIG // MEExJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFNlcnZpY2Wggg5EMIIE9TCCA92gAwIBAgITMwAAASWL
// SIG // 3otsciYx3QAAAAABJTANBgkqhkiG9w0BAQsFADB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0xOTEyMTkw
// SIG // MTE0NThaFw0yMTAzMTcwMTE0NThaMIHOMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3NvZnQgT3Bl
// SIG // cmF0aW9ucyBQdWVydG8gUmljbzEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046RjdBNi1FMjUxLTE1MEExJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Uw
// SIG // ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDQ
// SIG // ex9jdmBb7OHJwSYmMUorZNwAcv8Vy36TlJuzcVx7G+lF
// SIG // qt2zjWOMlSOMkm1XoAuJ8VZ5ShBedADXDGDKxHNZhLu3
// SIG // EW8x5ot/IOk6izLTlAFtvIXOgzXs/HaOM72XHKykMZHA
// SIG // dL/fpZtASM5PalmsXX4Ol8lXkm9jR55K56C7q9+hDU+2
// SIG // tjGHaE1ZWlablNUXBhaZgtCJCd60UyZvgI7/uNzcafj0
// SIG // /Vw2bait9nDAVd24yt/XCZnHY3yX7ZsHjIuHpsl+PpDX
// SIG // ai1Dwe9p0ryCZsl9SOMHextIHe9qlTbtWYJ8WtWLoH9d
// SIG // EMQxVLnmPPDOVmBj7LZhSji38N9Vpz/FAgMBAAGjggEb
// SIG // MIIBFzAdBgNVHQ4EFgQU86rK5Qcm+QE5NBXGCPIiCBdD
// SIG // JPgwHwYDVR0jBBgwFoAU1WM6XIoxkPNDe3xGG8UzaFqF
// SIG // bVUwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWlj
// SIG // VGltU3RhUENBXzIwMTAtMDctMDEuY3JsMFoGCCsGAQUF
// SIG // BwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNUaW1TdGFQ
// SIG // Q0FfMjAxMC0wNy0wMS5jcnQwDAYDVR0TAQH/BAIwADAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDCDANBgkqhkiG9w0BAQsF
// SIG // AAOCAQEAkxxZPGEgIgAhsqZNTZk58V1vQiJ5ja2xHl5T
// SIG // qGA6Hwj5SioLg3FSLiTmGV+BtFlpYUtkneB4jrZsuNpM
// SIG // tfbTMdG7p/xAyIVtwvXnTXqKlCD1T9Lcr94pVedzHGJz
// SIG // L1TYNQyZJBouCfzkgkzccOuFOfeWPfnMTiI5UBW5Odmo
// SIG // yHPQWDSGHoboW1dTKqXeJtuVDTYbHTKs4zjfCBMFjmyl
// SIG // Ru52Zpiz+9MBeRj4iAeou0F/3xvIzepoIKgUWCZ9mmVi
// SIG // WEkVwCtTGbV8eK73KeEE0tfMU/YY2UmoGPc8YwburDEf
// SIG // elegLW+YHkfrcGAGlftCmqtOdOLeghLoG0Ubx/B7sTCC
// SIG // BnEwggRZoAMCAQICCmEJgSoAAAAAAAIwDQYJKoZIhvcN
// SIG // AQELBQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xMjAwBgNV
// SIG // BAMTKU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1
// SIG // dGhvcml0eSAyMDEwMB4XDTEwMDcwMTIxMzY1NVoXDTI1
// SIG // MDcwMTIxNDY1NVowfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
// SIG // AoIBAQCpHQ28dxGKOiDs/BOX9fp/aZRrdFQQ1aUKAIKF
// SIG // ++18aEssX8XD5WHCdrc+Zitb8BVTJwQxH0EbGpUdzgkT
// SIG // jnxhMFmxMEQP8WCIhFRDDNdNuDgIs0Ldk6zWczBXJoKj
// SIG // RQ3Q6vVHgc2/JGAyWGBG8lhHhjKEHnRhZ5FfgVSxz5NM
// SIG // ksHEpl3RYRNuKMYa+YaAu99h/EbBJx0kZxJyGiGKr0tk
// SIG // iVBisV39dx898Fd1rL2KQk1AUdEPnAY+Z3/1ZsADlkR+
// SIG // 79BL/W7lmsqxqPJ6Kgox8NpOBpG2iAg16HgcsOmZzTzn
// SIG // L0S6p/TcZL2kAcEgCZN4zfy8wMlEXV4WnAEFTyJNAgMB
// SIG // AAGjggHmMIIB4jAQBgkrBgEEAYI3FQEEAwIBADAdBgNV
// SIG // HQ4EFgQU1WM6XIoxkPNDe3xGG8UzaFqFbVUwGQYJKwYB
// SIG // BAGCNxQCBAweCgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGG
// SIG // MA8GA1UdEwEB/wQFMAMBAf8wHwYDVR0jBBgwFoAU1fZW
// SIG // y4/oolxiaNE9lJBb186aGMQwVgYDVR0fBE8wTTBLoEmg
// SIG // R4ZFaHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9j
// SIG // cmwvcHJvZHVjdHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYt
// SIG // MjMuY3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcw
// SIG // AoY+aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9j
// SIG // ZXJ0cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcnQw
// SIG // gaAGA1UdIAEB/wSBlTCBkjCBjwYJKwYBBAGCNy4DMIGB
// SIG // MD0GCCsGAQUFBwIBFjFodHRwOi8vd3d3Lm1pY3Jvc29m
// SIG // dC5jb20vUEtJL2RvY3MvQ1BTL2RlZmF1bHQuaHRtMEAG
// SIG // CCsGAQUFBwICMDQeMiAdAEwAZQBnAGEAbABfAFAAbwBs
// SIG // AGkAYwB5AF8AUwB0AGEAdABlAG0AZQBuAHQALiAdMA0G
// SIG // CSqGSIb3DQEBCwUAA4ICAQAH5ohRDeLG4Jg/gXEDPZ2j
// SIG // oSFvs+umzPUxvs8F4qn++ldtGTCzwsVmyWrf9efweL3H
// SIG // qJ4l4/m87WtUVwgrUYJEEvu5U4zM9GASinbMQEBBm9xc
// SIG // F/9c+V4XNZgkVkt070IQyK+/f8Z/8jd9Wj8c8pl5SpFS
// SIG // AK84Dxf1L3mBZdmptWvkx872ynoAb0swRCQiPM/tA6WW
// SIG // j1kpvLb9BOFwnzJKJ/1Vry/+tuWOM7tiX5rbV0Dp8c6Z
// SIG // ZpCM/2pif93FSguRJuI57BlKcWOdeyFtw5yjojz6f32W
// SIG // apB4pm3S4Zz5Hfw42JT0xqUKloakvZ4argRCg7i1gJsi
// SIG // OCC1JeVk7Pf0v35jWSUPei45V3aicaoGig+JFrphpxHL
// SIG // mtgOR5qAxdDNp9DvfYPw4TtxCd9ddJgiCGHasFAeb73x
// SIG // 4QDf5zEHpJM692VHeOj4qEir995yfmFrb3epgcunCaw5
// SIG // u+zGy9iCtHLNHfS4hQEegPsbiSpUObJb2sgNVZl6h3M7
// SIG // COaYLeqN4DMuEin1wC9UJyH3yKxO2ii4sanblrKnQqLJ
// SIG // zxlBTeCG+SqaoxFmMNO7dDJL32N79ZmKLxvHIa9Zta7c
// SIG // RDyXUHHXodLFVeNp3lfB0d4wwP3M5k37Db9dT+mdHhk4
// SIG // L7zPWAUu7w2gUDXa7wknHNWzfjUeCLraNtvTX4/edIhJ
// SIG // EqGCAtIwggI7AgEBMIH8oYHUpIHRMIHOMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3NvZnQgT3Bl
// SIG // cmF0aW9ucyBQdWVydG8gUmljbzEmMCQGA1UECxMdVGhh
// SIG // bGVzIFRTUyBFU046RjdBNi1FMjUxLTE1MEExJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wi
// SIG // IwoBATAHBgUrDgMCGgMVAEXTL+FQbc2G+3MXXvIRKVr2
// SIG // oXCnoIGDMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTAwDQYJKoZIhvcNAQEFBQACBQDi7FH6MCIYDzIw
// SIG // MjAwODIzMDYyNDU4WhgPMjAyMDA4MjQwNjI0NThaMHcw
// SIG // PQYKKwYBBAGEWQoEATEvMC0wCgIFAOLsUfoCAQAwCgIB
// SIG // AAICHPkCAf8wBwIBAAICEZowCgIFAOLto3oCAQAwNgYK
// SIG // KwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAqAKMAgC
// SIG // AQACAwehIKEKMAgCAQACAwGGoDANBgkqhkiG9w0BAQUF
// SIG // AAOBgQCU8FVIW29vUzOBCeDgXvm86i70+HyZlIP1nEW6
// SIG // ifuXuAk1tNgYp/gccaT4xtlkdvYBLru91J8o4o2yDbAG
// SIG // XjfzL/c7mfHUMhZEtcYgDEMcML7EirACrlTiqcY6Ogiv
// SIG // uNCCd9NpaU+un8wtkAo28hM8pcaLyl45vC9dBptIZ6NL
// SIG // RzGCAw0wggMJAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABJYvei2xyJjHdAAAAAAElMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYL
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIL8FQgan
// SIG // 96bg2hr2GYRwPJCJKuZFwBO9/WErJh0psFRYMIH6Bgsq
// SIG // hkiG9w0BCRACLzGB6jCB5zCB5DCBvQQgXd/Gsi5vMF/6
// SIG // iX2CDh+VfmL5RvqaFkFwluiyje9B9w4wgZgwgYCkfjB8
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAASWL
// SIG // 3otsciYx3QAAAAABJTAiBCBcjAJ7/n1HI5lkgBqtqy8n
// SIG // K6V1W1gjGBCZC6wDmP1ZyzANBgkqhkiG9w0BAQsFAASC
// SIG // AQCjBRl0qrOysNdkkQTGuVs9p/G20F1BJISMWL9BQq0k
// SIG // 4cxcmKMTz5N/RgR7m6MNMWBLM3voFgrISRFdn2J8vz+J
// SIG // 5a6JL8ZWpQWMFibHNm2QNa6pyoSvWUH1wb4YOe8dv76S
// SIG // oeUtJj59Qtmrn1+C5cPD4BClygmhkdoinz4caWjvUPnw
// SIG // G8GugY4VG2zGQicjysv/c705R5titFOCbQz01epcSl3b
// SIG // NrCiFSQFKgjCMohNZPTDvOz1xrxmU/4iufdtwokP9YD3
// SIG // EANvpQNYeTQ6+0I7IDXaf2quJZMwmrKT7pNzQdzS0T3n
// SIG // Cm95TKG2wvT0AqKA6bbeywUEqeF4ygJY6WIm
// SIG // End signature block
