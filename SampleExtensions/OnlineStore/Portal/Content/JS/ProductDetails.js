"use strict";
function addItemSuccessCallback(data) {
    console.log("Add Item Result: ");
    console.log(data);

    if (data) {
        // successfully added

        // add 1 dynamically to number of items in cart in header
        $("#cart-qty").html(parseInt($("#cart-qty").html()) + parseInt($("#item-quantity").val()));

        $(document).trigger('UpdateShoppingCart', [data]);

    } else {
        alert("An error occurred while adding your item to the cart, please refresh the page and try again");
    }
}

function addItemFailureCallback(data) {
    var errorElement = $("#body-wrapper").find(".msg-error");
    if (data.responseJSON && data.responseJSON.length > 0 && data.responseJSON[0].LocalizedErrorMessage) {        
        errorElement[0].textContent = data.responseJSON[0].LocalizedErrorMessage;
    } else {
        errorElement[0].textContent = "An error occurred while adding your item to the cart, please refresh the page and try again";
    }
}

function addLinesToWishListSuccessCallback(data) {
    console.log("Add Item Result: ");
    console.log(data);

    if (data) {
        $("#AddToWishListModal").modal('hide');
        var errorElement = $("#body-wrapper").find(".msg-info");
        errorElement[0].textContent = "You have succesfully added this product to your wish list."
    } else {
        alert("An error occurred while adding your item to the wish list, please refresh the page and try again");
    }
}

function addLinesToWishListFailureCallback(data) {
    var errorElement = $("#body-wrapper").find(".msg-error");
    if (data.responseJSON && data.responseJSON.length > 0 && data.responseJSON[0].LocalizedErrorMessage) {
        errorElement[0].textContent = data.responseJSON[0].LocalizedErrorMessage;
    } else {
        errorElement[0].textContent = "An error occurred while adding your item to the wish list, please refresh the page and try again";
    }
}

function isAuthenticatedSessionSuccessCallback(data) {
    if (!data) {
        $("#add-to-wishList-btn").hide();
    }
}

function isAuthenticatedSessionFailureCallback(data) {
    var errorElement = $("#body-wrapper").find(".msg-error");
    if (data.responseJSON && data.responseJSON.length > 0 && data.responseJSON[0].LocalizedErrorMessage) {
        errorElement[0].textContent = data.responseJSON[0].LocalizedErrorMessage;
    } else {
        errorElement[0].textContent = "An unexpected error has occured, please refresh the page";
    }
}

function createWishListSuccessCallback(data) {
    console.log("Add Item Result: ");
    console.log(data);

    if (data) {
        var productId = $("#product-details-product-id").val();
        if (productId != 0 && productId != undefined) {
            var wishListLine = { "ProductId": productId, "Quantity": $("#item-quantity").val(), "Price": ($("#giftcardAmount") != null) ? $("#giftcardAmount").val() : null };
            var data = {
                "wishListId": data.Id,
                "wishListLines": [wishListLine]
            };

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/WishList/AddLinesToWishList",
                data: JSON.stringify(data),
                success: addLinesToWishListSuccessCallback,
                error: addLinesToWishListFailureCallback
            });
        }
        else {
            var errorElement = $("#body-wrapper").find(".msg-error");
            errorElement[0].textContent = "No such product";
        }
    } else {
        alert("An error occurred while adding your item to the wish list, please refresh the page and try again");
    }
}

function createWishListFailureCallback(data) {
    var errorElement = $("#body-wrapper").find(".msg-error");
    if (data.responseJSON && data.responseJSON.length > 0 && data.responseJSON[0].LocalizedErrorMessage) {
        errorElement[0].textContent = data.responseJSON[0].LocalizedErrorMessage;
    } else {
        errorElement[0].textContent = "An error occurred while creating your wish list, please refresh the page and try again";
    }
}

function getWishListsSuccessCallback(data) {
    $leftScrollButton = $(document).find('.left-scroll-list .msax-Button');
    $rightScrollButton = $(document).find('.right-scroll-list .msax-Button');
    $WishListAddTilesContainer = $(document).find('.msax-WishListTilesContainer');
    $noWishListsText = $(document).find('.no-wishlists-text');
    $WishListAddTilesContainer.empty();
    $WishListAddTilesContainer.prev().show();
    $WishListAddTilesContainer.next().show();
    if (data.length <= 3) {
        $leftScrollButton.hide();
        $rightScrollButton.hide();
    }
    else {
        $leftScrollButton.show();
        $rightScrollButton.show();
    }
    if (data.length == 0) {
        $noWishListsText.show();
    }
    else {
        $noWishListsText.hide();
    }
    for (var i = 0; i < data.length; i++) {
        var wishList = data[i];
        var tileMarkup = null;
        if (wishList.IsFavorite == true) {
            tileMarkup = $('<div class="tile-view-content"><a href="javascript:void(0);" class="msax-ListTile" id="valueId:null"><div class="tile-view-details-box"></div></a><span class="msax-Star"><b>&#9733;</b></span></div>');
        } else {
            tileMarkup = $('<div class="tile-view-content"><a href="javascript:void(0);" class="msax-ListTile" id="valueId:null"><div class="tile-view-details-box"></div></a></div>');
        }
        var $tileMarkupText = tileMarkup.find('.tile-view-details-box');
        $tileMarkupText.text(wishList.Name);
        var $tileListId = tileMarkup.find('.msax-ListTile');
        $tileListId.val(wishList.Id);
        $WishListAddTilesContainer.append(tileMarkup);
    }

    // if the click event handler has already been bound we want to unbind it first
    $leftScrollButton.unbind("click");
    $rightScrollButton.unbind("click");

    $leftScrollButton.click(function (event) {
        event.preventDefault();
        var $firstVisibleTile, $prevTile, $nextTile;
        $firstVisibleTile = $prevTile = $nextTile = $WishListAddTilesContainer.find('.msax-Visible').first();
        var leftScrollPossible = true;

        // Show the previous three tiles
        for (var i = 0; i < 3; i++) {
            $prevTile = $prevTile.prev();

            if ($prevTile.length > 0) {
                $prevTile.show();
                $prevTile.addClass('msax-Visible');
            } else {
                leftScrollPossible = false;
                return false;
            }
        }

        // Hide the current three tiles only if a previous window of three tiles were made visible.
        if (leftScrollPossible) {
            for (var i = 0; i < 3; i++) {
                if ($nextTile.length > 0) {
                    $nextTile.hide();
                    $nextTile.removeClass('msax-Visible');
                } else {
                    return false;
                }

                $nextTile = $nextTile.next();
            }
        }
    });

    $rightScrollButton.click(function (event) {
        event.preventDefault();
        var $lastVisibleTile, $prevTile, $nextTile;
        $lastVisibleTile = $prevTile = $nextTile = $WishListAddTilesContainer.find('.msax-Visible').last();
        var rightScrollPossible = true;
        var first = true;

        // Show the next three tiles
        for (var i = 0; i < 3; i++) {
            $nextTile = $nextTile.next();

            if ($nextTile.length > 0) {
                $nextTile.show();
                $nextTile.addClass('msax-Visible');
                first = false;
            } else {
                if (first) {
                    first = false; // This is required for right scroll because if there is no tile on the right side it means righ scoll is not possible, but rightmost window could have just 1/2 tiles.
                    rightScrollPossible = false;
                    return false;
                }
            }
        }

        // Hide the current three tiles only if a next window of three tiles were made visible.
        if (rightScrollPossible) {
            for (var i = 0; i < 3; i++) {
                if ($prevTile.length > 0) {
                    $prevTile.hide();
                    $prevTile.removeClass('msax-Visible');
                } else {
                    return false;
                }

                $prevTile = $prevTile.prev();
            }
        }
    });

    // Show the first three tiles on first time load
    $WishListAddTilesContainer.find('.tile-view-content').each(function (index) {
        if (index > 2) {
            $(this).hide();
        } else {
            $(this).addClass('msax-Visible');
        }
    });

    $(".msax-ListTile").click(function () {
        var tile = $(this);
        var productId = $("#product-details-product-id").val();
        if (productId != 0 && productId != undefined) {
            var wishListLine = { "ProductId": productId, "Quantity": $("#item-quantity").val(), "Price": ($("#giftcardAmount") != null) ? $("#giftcardAmount").val() : null };
            var data = {
                "wishListId": tile.val(),
                "wishListLines": [wishListLine]
            };

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/WishList/AddLinesToWishList",
                data: JSON.stringify(data),
                success: addLinesToWishListSuccessCallback,
                error: addLinesToWishListFailureCallback
            });
        }
        else {
            var errorElement = $("#body-wrapper").find(".msg-error");
            errorElement[0].textContent = "No such product";
        }
    });
}

function getWishListsFailureCallback(data) {
    var errorElement = $("#body-wrapper").find(".msg-error");
    if (data.responseJSON && data.responseJSON.length > 0 && data.responseJSON[0].LocalizedErrorMessage) {
        errorElement[0].textContent = data.responseJSON[0].LocalizedErrorMessage;
    } else {
        errorElement[0].textContent = "An error occurred while getting your wish lists, please refresh the page and try again";
    }
}

$("#plus-qty").click(function () {
    var inputVal = parseInt($("#item-quantity").val());
    if (!isNaN(inputVal))
    {
        inputVal++;
    }

    $("#item-quantity").val(inputVal);
    $("#item-quantity").trigger("change");
});

$("#minus-qty").click(function () {
    var inputVal = parseInt($("#item-quantity").val());
    if (!isNaN(inputVal)) {
        inputVal--;
    }

    $("#item-quantity").val(inputVal);
    $("#item-quantity").trigger("change");
});

$("#item-quantity").change(function () {
    var inputVal = parseInt($("#item-quantity").val());
    if (inputVal <= 1 || isNaN(inputVal)) {
        inputVal = 1;
        $("#plus-qty").prop("disabled", false);
        $("#minus-qty").prop("disabled", true);
    }
    else if (inputVal >= 999)
    {
        inputVal = 999;
        $("#plus-qty").prop("disabled", true);
        $("#minus-qty").prop("disabled", false);
    }
    else
    {
        $("#plus-qty").prop("disabled", false);
        $("#minus-qty").prop("disabled", false);
    }

    $("#item-quantity").val(inputVal);
});
// SIG // Begin signature block
// SIG // MIIkAgYJKoZIhvcNAQcCoIIj8zCCI+8CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // kGGbIUHYGq5r+Jh56iu5kNbZFP+er8m2YUWy2qy60uCg
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
// SIG // ghXVMIIV0QIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABiK9S1rmSbej5AAAAAAGIMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBJzAZBgkqhkiG9w0BCQMxDAYK
// SIG // KwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYKKwYB
// SIG // BAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgC12vvN37cZaB
// SIG // tlQkOOmUMzcz3TSs1mr/UZgmNE9lPwkwgboGCisGAQQB
// SIG // gjcCAQwxgaswgaiggYmAgYYAUwBpAG0AcABsAGkAZgB5
// SIG // AEMAbwBtAG0AZQByAGMAZQAuAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0AEQAeQBuAGEAbQBpAGMAcwAuAEMAbwBuAG4AZQBj
// SIG // AHQAbwByAC4AUABvAHIAdABhAGIAbABlAC4AcgBlAHMA
// SIG // bwB1AHIAYwBlAHMALgBkAGwAbKEagBhodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // Pvee9sq8o7uAtOgUV4rnEw7qIqnrVG9StJq9F8pN1OCJ
// SIG // sjnreMK0995pSHpEAkU7wzazkPYUnNG/C0BR9QypxgsX
// SIG // YHfwjPwAvT7flyeAwd0Py1bM/c3fctETM1Kapu4ODfdY
// SIG // ATbhNCl/lKZltJy1ptEbElzde+A//fQjcjR1dgl/G5ae
// SIG // ALaj8p18gQWOYw1G1AvTYGFzFQ+gByG0PhY518Nu1GZ6
// SIG // RTsPYnD1CshF8oYjqbmP8QyE4X7GihA8KBzQsvskrsrR
// SIG // a225uM5zP8CyrELgtQlT6y64pUCxOR0JjGDXRRkfW3kE
// SIG // iTaJZKW8LRM6zMv/c72WGTVw/YQxNupi76GCEuUwghLh
// SIG // BgorBgEEAYI3AwMBMYIS0TCCEs0GCSqGSIb3DQEHAqCC
// SIG // Er4wghK6AgEDMQ8wDQYJYIZIAWUDBAIBBQAwggFRBgsq
// SIG // hkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYKKwYBBAGE
// SIG // WQoDATAxMA0GCWCGSAFlAwQCAQUABCCsLtwsWQvm/PlU
// SIG // vsqi69xxUj/m4QYDQbY6pXX5djQrkQIGXz0tSNQuGBMy
// SIG // MDIwMDgyMzA0MDM0My44NDVaMASAAgH0oIHQpIHNMIHK
// SIG // MQswCQYDVQQGEwJVUzELMAkGA1UECBMCV0ExEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMSYwJAYDVQQL
// SIG // Ex1UaGFsZXMgVFNTIEVTTjowODQyLTRCRTYtQzI5QTEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZaCCDjwwggTxMIID2aADAgECAhMzAAABCX6CvR57
// SIG // 02EiAAAAAAEJMA0GCSqGSIb3DQEBCwUAMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTAyMzIzMTkx
// SIG // NFoXDTIxMDEyMTIzMTkxNFowgcoxCzAJBgNVBAYTAlVT
// SIG // MQswCQYDVQQIEwJXQTEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJjAkBgNVBAsTHVRoYWxlcyBUU1Mg
// SIG // RVNOOjA4NDItNEJFNi1DMjlBMSUwIwYDVQQDExxNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuMMhEGUCBxoJ
// SIG // LkP9VJ63U+43pWt+W1wqQfY2EpXPmxYlw7NSy19We/Z5
// SIG // C+GVH4/sLTqzezshKl1dn4IsHYtLmf1t9aM3Ojk3GN4B
// SIG // fshqdGT0wgOOt80nQQkqR6RhunO18mF4oPHET0Lju0b+
// SIG // XRacaT5Q8qTLctfjpYBXGVGKDEkGm1uEFLvO8jN4WezE
// SIG // 7ky2bLise/nQ8ycSAGxsHnAjUrD3dA9sxP1sEfiwiJ7H
// SIG // vuFBa62GD8CSrDzInzt1L5ghey3f65si0Gxna0escFzJ
// SIG // s3OBwQTk+cMrWujqdAmHZ1Hp7MTif6oBDcP3zU1j134I
// SIG // JrPAy7DibYU2KxtkJA0q9wIDAQABo4IBGzCCARcwHQYD
// SIG // VR0OBBYEFKWkknNMg0L8QnGI59So7zY/bklGMB8GA1Ud
// SIG // IwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1VMFYGA1Ud
// SIG // HwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1RpbVN0YVBD
// SIG // QV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcBAQROMEww
// SIG // SgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENBXzIwMTAt
// SIG // MDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYDVR0lBAww
// SIG // CgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQADggEBADhY
// SIG // hwOLB0dLkBKuk0wuRv/Jbga8qDkPpBbiVOYlwE0l3tAa
// SIG // 3Ulc5Sqt6pBOhB763FxYM5dShyxYtm4LIfCYj5Qyx3y5
// SIG // n05BTcSxB69+TBUz8GvSd1OGn6wpO2mLGCBNCbIgxd/k
// SIG // WNuBx4eksNJ4yENSvMh+Twufnr5I/pYeZOpoUH+O9pvF
// SIG // XP3yzz7TrHcnnMzhMOXIrV79c1CDSVsB8tpt3kJerpcQ
// SIG // N7IGKQM3ZvjULX/6ItMkOkJpEEpnfq6W4JOraotY/4jo
// SIG // NBAkZpitMLb32hL48MVOu2JMcMoNfPJES4QAM+ne/0vx
// SIG // Rq6vr9O8wlScca9GRKArWkxZe8yf6mgwggZxMIIEWaAD
// SIG // AgECAgphCYEqAAAAAAACMA0GCSqGSIb3DQEBCwUAMIGI
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNy
// SIG // b3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkg
// SIG // MjAxMDAeFw0xMDA3MDEyMTM2NTVaFw0yNTA3MDEyMTQ2
// SIG // NTVaMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMIIB
// SIG // IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqR0N
// SIG // vHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvtfGhLLF/F
// SIG // w+Vhwna3PmYrW/AVUycEMR9BGxqVHc4JE458YTBZsTBE
// SIG // D/FgiIRUQwzXTbg4CLNC3ZOs1nMwVyaCo0UN0Or1R4HN
// SIG // vyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLBxKZd0WET
// SIG // bijGGvmGgLvfYfxGwScdJGcSchohiq9LZIlQYrFd/Xcf
// SIG // PfBXday9ikJNQFHRD5wGPmd/9WbAA5ZEfu/QS/1u5ZrK
// SIG // sajyeioKMfDaTgaRtogINeh4HLDpmc085y9Euqf03GS9
// SIG // pAHBIAmTeM38vMDJRF1eFpwBBU8iTQIDAQABo4IB5jCC
// SIG // AeIwEAYJKwYBBAGCNxUBBAMCAQAwHQYDVR0OBBYEFNVj
// SIG // OlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQBgjcUAgQM
// SIG // HgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAPBgNVHRMB
// SIG // Af8EBTADAQH/MB8GA1UdIwQYMBaAFNX2VsuP6KJcYmjR
// SIG // PZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6
// SIG // Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1
// SIG // Y3RzL01pY1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNybDBa
// SIG // BggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6
// SIG // Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWlj
// SIG // Um9vQ2VyQXV0XzIwMTAtMDYtMjMuY3J0MIGgBgNVHSAB
// SIG // Af8EgZUwgZIwgY8GCSsGAQQBgjcuAzCBgTA9BggrBgEF
// SIG // BQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL1BL
// SIG // SS9kb2NzL0NQUy9kZWZhdWx0Lmh0bTBABggrBgEFBQcC
// SIG // AjA0HjIgHQBMAGUAZwBhAGwAXwBQAG8AbABpAGMAeQBf
// SIG // AFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkqhkiG9w0B
// SIG // AQsFAAOCAgEAB+aIUQ3ixuCYP4FxAz2do6Ehb7Prpsz1
// SIG // Mb7PBeKp/vpXbRkws8LFZslq3/Xn8Hi9x6ieJeP5vO1r
// SIG // VFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/XPleFzWY
// SIG // JFZLdO9CEMivv3/Gf/I3fVo/HPKZeUqRUgCvOA8X9S95
// SIG // gWXZqbVr5MfO9sp6AG9LMEQkIjzP7QOllo9ZKby2/QTh
// SIG // cJ8ySif9Va8v/rbljjO7Yl+a21dA6fHOmWaQjP9qYn/d
// SIG // xUoLkSbiOewZSnFjnXshbcOco6I8+n99lmqQeKZt0uGc
// SIG // +R38ONiU9MalCpaGpL2eGq4EQoO4tYCbIjggtSXlZOz3
// SIG // 9L9+Y1klD3ouOVd2onGqBooPiRa6YacRy5rYDkeagMXQ
// SIG // zafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA3+cxB6ST
// SIG // OvdlR3jo+KhIq/fecn5ha293qYHLpwmsObvsxsvYgrRy
// SIG // zR30uIUBHoD7G4kqVDmyW9rIDVWZeodzOwjmmC3qjeAz
// SIG // LhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8ZQU3ghvkq
// SIG // mqMRZjDTu3QyS99je/WZii8bxyGvWbWu3EQ8l1Bx16HS
// SIG // xVXjad5XwdHeMMD9zOZN+w2/XU/pnR4ZOC+8z1gFLu8N
// SIG // oFA12u8JJxzVs341Hgi62jbb01+P3nSISRKhggLOMIIC
// SIG // NwIBATCB+KGB0KSBzTCByjELMAkGA1UEBhMCVVMxCzAJ
// SIG // BgNVBAgTAldBMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNV
// SIG // BAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMg
// SIG // TGltaXRlZDEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // MDg0Mi00QkU2LUMyOUExJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVAArBvLsdZyIJdH5HLYAWto86YngAoIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQEFBQACBQDi7EjrMCIYDzIwMjAwODIzMDk0NjE5
// SIG // WhgPMjAyMDA4MjQwOTQ2MTlaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOLsSOsCAQAwCgIBAAICHMMCAf8wBwIB
// SIG // AAICEcwwCgIFAOLtmmsCAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQApPOuJDtqA
// SIG // As5VhPERbMWMnlAoyiWPBS8KlxoQx0YeJMC+QLDPF5qe
// SIG // 4n1h6CtWrWIZ8N9IsuRw7v9Bs6Kv9vsl1AJHDYxxSzcM
// SIG // olD+BUepxKv0MKOAaMjhtwl77805RD2YORrP/ppmY+JW
// SIG // lKXBuGxVQGJMdHIGj51q9RDcowmeujGCAw0wggMJAgEB
// SIG // MIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAABCX6CvR5702EiAAAAAAEJMA0GCWCGSAFlAwQCAQUA
// SIG // oIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQw
// SIG // LwYJKoZIhvcNAQkEMSIEIPyCfWjswVoggKQXjnSWbEmD
// SIG // 9N+xzgI3eoFl+/Qos70dMIH6BgsqhkiG9w0BCRACLzGB
// SIG // 6jCB5zCB5DCBvQQgglT4YQYbSjI8YhNv3N2HQ3Ad/tXk
// SIG // 27MFY13/nqWdUo8wgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAQl+gr0ee9NhIgAAAAAB
// SIG // CTAiBCAY5kY8E3q2Gov8GbZBkDgjoW9cGYnBXuhm4Nho
// SIG // TeR2JTANBgkqhkiG9w0BAQsFAASCAQBg2j0ZH48PEuaz
// SIG // NOl3uimQY90emgOCsxnNm3RD31/+X5iK4xRBJl39r+8x
// SIG // /KdCATy5PX7f0zowi8/HxuL/PAz/Y6RMz5+XKJvMvhB0
// SIG // VsJDiqcEEde75gWsGG3d2Y/FcB1MlMrkhXNwF/JhQEvJ
// SIG // 9G1s8DbGwwuBw8g7B8PbL579H1CXMSR80Oy4UhYgmb9R
// SIG // 0AIfSYKpGD6sWg1dc/t0fjy5Slw9I0L7UBz8+jVBq7xY
// SIG // CcxTMXdlKMa5d79XU7LlJT39lysODayHU8IcI82bWtNF
// SIG // H4DBokTxUaeV3GD4unVh2m19SDN40jB2uOVHmwR8AQBF
// SIG // ry64AkANnaDKXFwAvtEO
// SIG // End signature block
