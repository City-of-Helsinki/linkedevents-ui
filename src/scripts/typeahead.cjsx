$ = require 'jquery'
Bloodhound = require 'typeahead.js/dist/bloodhound.min.js'

engine = new Bloodhound(
    initialize: true
    queryTokenizer: Bloodhound.tokenizers.whitespace
    datumTokenizer: (d) ->
        tokens = Bloodhound.tokenizers.whitespace(d.value)
        $.each tokens, (k, v) ->
            i = 0
            while i + 1 < v.length
                tokens.push v.substr(i, v.length)
                i++
        tokens 
    prefetch:
        url: "#{appSettings.api_base}/place/?page_size=10000" 
        filter: (places) ->
            # Map the remote source JSON array to a JavaScript object array
            return $.map places.data, (place) ->
                return {
                    value: place.name.fi
                    id: place.id
                    street_address: (
                        if place.street_address
                        then place.street_address.fi
                        else ''
                    )
                  }
      ttl: 10000
)
engine.initialize()

module.exports =
    bloodhoundInstance: engine
    substringMatcher: (strs) ->
        (q, cb) ->
            matches = undefined
            substringRegex = undefined
            # an array that will be populated with substring matches
            matches = []
            # regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i')
            # iterate through the pool of strings and for any string that
            # contains the substring `q`, add it to the `matches` array
            $.each strs, (i, str) ->
                if substrRegex.test(str)
                    matches.push str
                return
            cb matches
            return
