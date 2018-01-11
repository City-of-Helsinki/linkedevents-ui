// Use Formsy React validation rules as a base https://github.com/christianalfoni/formsy-react

import moment from 'moment'
import { includes } from 'lodash';

/**
 * Notice that all the validation functions follow the Formsy's parameter setup (values, value)
 * where values are all the form valus and value the tested field value
 */

let _isExisty = function _isExisty(value) {
  return value !== null && value !== undefined;
}

let isEmpty = function isEmpty(value) {
  return value === '';
}

const _containsAllLanguages = function _containsAllLanguages(value, languages) {
    let requiredLanguages = new Set(languages)
    _.forOwn(value, (item, key) => {
        if (item.length && item.length > 0) {
            requiredLanguages.delete(key)
        }
    })
    return requiredLanguages.size === 0
}

const _isUrl = function(values, value) {
    const urlRegexp = new RegExp(
        "^" +
          // protocol identifier
          "(?:(?:https?:|ftps?:)?//)?" +
          // user:pass authentication
          "(?:\\S+(?::\\S*)?@)?" +
          "(?:" +
            // IP address exclusion
            // private & local networks
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broacast addresses
            // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
          "|" +
            // host name
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
            // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
            // TLD identifier
            "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
            // TLD may end with dot
            "\\.?" +
          ")" +
          // port number
          "(?::\\d{2,5})?" +
          // resource path
          "(?:[/?#]\\S*)?" +
        "$", "i"
      )

    return validations.matchRegexp(values, value, urlRegexp)
}

var validations = {
    isDefaultRequiredValue: function isDefaultRequiredValue(values, value) {
        return value === undefined || value === '';
    },
    isExisty: function isExisty(values, value) {
        return _isExisty(value);
    },
    matchRegexp: function matchRegexp(values, value, regexp) {
        return !_isExisty(value) || isEmpty(value) || regexp.test(value);
    },
    isUndefined: function isUndefined(values, value) {
        return value === undefined;
    },
    isEmptyString: function isEmptyString(values, value) {
        return isEmpty(value);
    },
    isEmail: function isEmail(values, value) {
        return validations.matchRegexp(values, value, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i);
    },
    isUrl: function isUrl(values, value) {
        if (typeof value === 'object') {
            return _.every(value, (item) => {
                return _isUrl(values, item)
            })
        }
        return _isUrl(values, value)
    },
    isTrue: function isTrue(values, value) {
        return value === true;
    },
    isFalse: function isFalse(values, value) {
        return value === false;
    },
    isNumeric: function isNumeric(values, value) {
        if (typeof value === 'number') {
            return true;
        }
        return validations.matchRegexp(values, value, /^[-+]?(?:\d*[.])?\d+$/);
    },
    isAlpha: function isAlpha(values, value) {
        return validations.matchRegexp(values, value, /^[A-Z]+$/i);
    },
    isAlphanumeric: function isAlphanumeric(values, value) {
        return validations.matchRegexp(values, value, /^[0-9A-Z]+$/i);
    },
    isInt: function isInt(values, value) {
        return validations.matchRegexp(values, value, /^(?:[-+]?(?:0|[1-9]\d*))$/);
    },
    isFloat: function isFloat(values, value) {
        return validations.matchRegexp(values, value, /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][\+\-]?(?:\d+))?$/);
    },
    isWords: function isWords(values, value) {
        return validations.matchRegexp(values, value, /^[A-Z\s]+$/i);
    },
    isSpecialWords: function isSpecialWords(values, value) {
        return validations.matchRegexp(values, value, /^[A-Z\s\u00C0-\u017F]+$/i);
    },
    isLength: function isLength(values, value, length) {
        return !_isExisty(value) || isEmpty(value) || value.length === length;
    },
    equals: function equals(values, value, eql) {
        return !_isExisty(value) || isEmpty(value) || value == eql;
    },
    equalsField: function equalsField(values, value, field) {
        return value == values[field];
    },
    maxLength: function maxLength(values, value, length) {
        return !_isExisty(value) || value.length <= length;
    },
    minLength: function minLength(values, value, length) {
        return !_isExisty(value) || isEmpty(value) || value.length >= length;
    },
    isTime: function isTime(values, value) {
        return validations.matchRegexp(values, value, /(24:00)|(^(2[0-3]|1[0-9]|0[0-9]|[0-9])((:|\.)[0-5][0-9]))?$/i);
    },
    isDate: function isDate(values, value) {
        return validations.matchRegexp(values, value, /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/i);
    },
    afterStartTime: function afterStartTime(values, value) {
        if(!values.start_time || !value) { return true }

        let time = new Date(value)
        let start_time = new Date(values.start_time)

        if(time - start_time >= 0) {
            return true;
        }

        return false;
    },
    inTheFuture: function inTheFuture(values, value) {

        if(!value) {return true}

        let now = new Date()
        let time = new Date(value)

        if (time - now >= 0) {
            return true;
        }

        return false;
    },
    required: function required(values, value) {
        return _isExisty(value)
    },
    requiredString: function requiredString(values, value) {
        if(typeof value === 'string' && value.length > 0) {
            return true
        }
        return false
    },
    requiredMulti: function requiredMulti(values, value) {
        if(typeof value !== 'object' || !value) {
            return false
        }
        if(_.keys(value).length === 0) {
            return false
        }
        let hasOneValue = false

        _.each(value, item => {
            if(item.length && item.length > 0) {
                hasOneValue = true
            }
        })

        return hasOneValue
    },
    requiredAtId: function requiredAtId(values, value) {
        if(typeof value !== 'object' || !value) {
            return false
        }
        if(typeof value['@id'] !== 'string') {
            return false
        }
        if(value['@id'].length === 0) {
            return false
        }

        return true
    },
    atLeastOne: function atLeastOne(values, value) {
        if(value && value.length && value.length > 0) {
            return true
        }
        return false
    },
    shortString: function shortString(values, value) {
         if(typeof value === 'object') {
            let hasOneOver160 = false
            _.each(value, item => {
                if(item.length > 160) {
                    hasOneOver160 = true
                }
            })
            return !hasOneOver160

        } else if(typeof value === 'string') {
            if(value.length > 160) {
                return false
            }
        }
        return true
    },
    longString: function longString() {
            return true
    },
    requiredInContentLanguages: function requiredInContentLanguages(values, value) {
        if (typeof value !== 'object') {
            return false
        }
        return _containsAllLanguages(value, values._contentLanguages)
    },
    offerIsFreeOrHasPrice: function offerIsFreeOrHasPrice(values, value, key) {
        if (typeof value !== 'object') {
            return false
        }
        return _containsAllLanguages(value[key], values._contentLanguages)
    },
    atLeastOneIsTrue: function atLeastOneIsTrue(values, value) {
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                if(value[key]) {
                    return true
                }
            }
        }
        return false
    },
    isMoreThanOne: function isMoreThanOne(values, value) {
        return value > 0 ? true : false
    },
    daysWithinInterval: function daysWithinInterval(values, value) {
        if (!(value < 6)) { return true }
        const { start_day_index, end_day_index, daysSelected } = values
        const dayCodes = {
            monday: 0,
            tuesday: 1,
            wednesday: 2,
            thursday: 3,
            friday: 4,
            saturday: 5,
            sunday: 6
        };
        let daysSelectedState = [];
        let betweenInterval;

        if (start_day_index <= end_day_index) {
            betweenInterval = true
        } else {
            betweenInterval = false
        }

        for (const key in daysSelected) {
            if (daysSelected[key] === true) {
                if (betweenInterval) {
                    daysSelectedState.push(start_day_index <= dayCodes[key] && dayCodes[key] <= end_day_index)
                } else {
                    daysSelectedState.push(dayCodes[key] <= end_day_index || start_day_index <= dayCodes[key])
                }
            }
        }

        if (includes(daysSelectedState, false)) {
            return false;
        } else {
            return true;
        }
    },
    hasPrice: function hasPrice(values, value, key) {
        if (value.is_free !== undefined && !value.is_free) {
            const validateLanguages = (value) => {
                let hasFinnish = true;
                let hasEnglish = true;
                let hasSwedish = true;
                let hasLanguage = false
                if (value.fi) {
                  hasLanguage = true
                  hasFinnish = !!value.fi.length
                }
                if (value.en) {
                  hasLanguage = true
                  hasEnglish = !!value.en.length
                }
                if (value.sv) {
                  hasLanguage = true
                  hasSwedish = !!value.sv.length
                }
                return hasLanguage && hasFinnish && hasEnglish && hasSwedish
            }
            return value[key] && validateLanguages(value[key])
        } else {
            return true
        }
    }
};

module.exports = validations;
