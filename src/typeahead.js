import $ from 'jquery'
import jQuery from 'jquery';
import Bloodhound from 'typeahead.js/dist/bloodhound.min.js'

let engine = new Bloodhound({
    initialize: true,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    datumTokenizer: function(d) {
        let tokens = Bloodhound.tokenizers.whitespace(d.value);
        $.each(tokens, function (k, v) {
            for(let i = 0; i + 1 < v.length; i++) {
                tokens.push(v.substr(i, v.length));
            }
        });
        return tokens;
    },
    prefetch: {
        url: appSettings.api_base + "/place/?page_size=10000",
        filter: (places) => {
            // Map the remote source JSON array to a JavaScript object array
            return $.map(places.data, (place) => {
                return {
                    value: place.name.fi,
                    id: place.id,
                    street_address: place.street_address ? place.street_address.fi : ''
                }
            });
        },
        ttl: 10000
    }
    // NOTE: remote is not used
    // remote: {
    //     url: appSettings.api_base + "/place/?q=%QUERY",
    //     wildcard: '%QUERY',
    //     filter: (places) => {
    //         // Map the remote source JSON array to a JavaScript object array
    //         return $.map(places.data, (place) => ({
    //             value: place.name.fi,
    //             id: place.id,
    //             street_address: place.street_address ? place.street_address.fi : ''
    //         }));
    //     }
    // }
});

engine.initialize();

export default {
    bloodhoundInstance: engine,
    substringMatcher: (strings) => {
        return (q, callback) => {
            let matches = undefined;
            let substringRegex = undefined;
            // an array that will be populated with substring matches
            matches = [];
            // regex used to determine if a string contains the substring `q`
            let substrRegex = new RegExp(q, 'i');
            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strings, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
                return;
            });
            callback(matches);
            return;
        };
    }
}
