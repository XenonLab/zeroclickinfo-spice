//@xe.com
"use strict";
(function(env) {
    env.ddg_spice_currency = function(api_result) {
        //do more checks
        if (!api_result || !api_result.conversion || !api_result.topConversions || !api_result.conversion.length || api_result.conversion.length === 0 || !api_result.topConversions.length || api_result.topConversions.length === 0) {
            Spice.failed('currency');
        }
        var results = [];
        var mainConv = api_result.conversion;
        var topCovs = api_result.topConversions;
        //flag the input to get different output
        //if is pair get paris tile layout
        if (mainConv["from-currency-symbol"] != mainConv["to-currency-symbol"]) {
            mainConv.isPair = true;
            results.push(mainConv);
        }
        //if is one input currency get single tile ouput
        else {
            mainConv.isSingle = true;
            mainConv["to-currency-symbol"] = topCovs[0]["to-currency-symbol"];
            mainConv["conversion-rate"] = topCovs[0]["conversion-rate"];
            results.push(mainConv);
            for (var i = 0; i < topCovs.length; i++) {
                results.push(topCovs[i]);
            }
        }
        //meta variable
        var xeTime = mainConv["rate-utc-timestamp"].match(/\b\d{4}[-.]\d{2}[-.]\d{2}\s\d{2}\:\d{2}\b/);
        var liveUrl = 'http://www.xe.com/currencyconverter/convert/?Amount=1&From=' + mainConv["from-currency-symbol"] + '&To=' + mainConv["to-currency-symbol"];
        var switch_template = function() {
            return ((is_mobile) ? Spice.currency.currency_item_mobile : Spice.currency.currency_item);
        };
        var switch_heading = function() {
            return (' Mid-market rates:  ' + xeTime + '  UTC');
        };
        var switch_alMeta = function() {
            return ((mainConv.isPair) ? '' : '<a href="' + liveUrl + '">View live rates</a>');
        };
        var switch_sourceName = function() {
            return ((mainConv.isPair) ? '' : 'XE.com');
        };
        var round=function(amount){
             return Math.round(amount * 100) / 100;
        };
        var check_flag = function(item) {
            item = item.toLowerCase() .toString();
            return DDG.settings.region.getLargeIconURL(item.substring(0, 2));
        };
        
        Spice.add({
            id: 'currency',
            name: 'Currency',
            data: results,
            meta: {
                heading: switch_heading(),
                sourceUrl: "http://www.xe.com",
                sourceName: switch_sourceName(),
                altMeta: switch_alMeta(),
                variableTileWidth: true,
            },
            normalize: function(item) {
                return {
                    fromCurrencySymbol: item["from-currency-symbol"],
                    toCurrencySymbol: item["to-currency-symbol"],
                    amount: item["from-amount"],
                    convertedAmount:  round(item["converted-amount"]),
                    rate: item["conversion-rate"],
                    inverseRate: item["conversion-inverse"],
                    xeUrl: 'http://www.xe.com/currencycharts/?from=' + item["from-currency-symbol"] + '&to=' + item["to-currency-symbol"],
                    fromFlag: check_flag(item["from-currency-symbol"]),
                    toFlag: check_flag(item["to-currency-symbol"]),
                    currencyName: item["to-currency-name"],
                    liveUrl: liveUrl,
                    xeTime: xeTime,
                };
            },
            templates: {
                item: switch_template(),
            }
        });
    };
}(this));
//change font size if number lenght over 10
Handlebars.registerHelper("amountFontSize", function(amount) {
    return ((amount.toString().length>6) ? 2 : 3);
});
