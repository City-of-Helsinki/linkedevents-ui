moment = require 'moment'

class API
    @loadHelMainOptions: ->
        # console.log '@TODO: get the hel_main options dynamically?'
        [
          {
            value: 'asuminen-ja-ymparisto'
            label: 'Asuminen ja ympäristö'
          }
          {
            value: 'kulttuuri-ja-vapaa-aika'
            label: 'Kulttuuri ja vapaa-aika'
          }
          {
            value: 'paivahoito-ja-koulutus'
            label: 'Päivähoito ja koulutus'
          }
          {
            value: 'liikenne-ja-kartat'
            label: 'Liikenne ja kartat'
          }
          {
            value: '-sosiaali-ja-terveyspalvelut'
            label: 'Sosiaali- ja terveyspalvelut'
          }
          {
            value: 'kaupunki-ja-hallinto'
            label: 'Kaupunki ja hallinto'
          }
        ] 
    @loadHelTargetOptions: ->
        # console.log '@TODO: get the hel_target options dynamically?'
        [
          {
            value: 'all'
            label: 'Ei erityiskohderyhmää'
          }
          {
            value: 'yhdistykset'
            label: 'Yhdistykset'
          }
          {
            value: 'yrittajat'
            label: 'Yrittäjät'
          }
          {
            value: 'maahanmuuttajat'
            label: 'Maahanmuuttajat'
          }
          {
            value: 'vanhukset'
            label: 'Vanhukset'
          }
          {
            value: 'vammaiset'
            label: 'Vammaiset'
          }
          {
            value: 'nuoret'
            label: 'Nuoret'
          }
          {
            value: 'lapset-ja-lapsiperheet'
            label: 'Lapset ja lapsiperheet'
          }
        ] 
    @loadHelEventLangOptions: ->
        # console.log '@TODO: get the hel_event_lang options dynamically?'
        [
          {
            value: 'all'
            label: 'Sopii kaikenkielisille'
          }
          {
            value: 'venaja'
            label: 'Venäjä'
          }
          {
            value: 'ranska'
            label: 'Ranska'
          }
          {
            value: 'saksa'
            label: 'Saksa'
          }
          {
            value: 'englanti'
            label: 'Englanti'
          }
          {
            value: 'ruotsi'
            label: 'Ruotsi'
          }
          {
            value: 'suomi'
            label: 'Suomi'
          }
        ]

    @getStartTime: (d) ->
        return @formatDatetimeString(d.__start_time_date, d.__start_time_time)

    @getEndTime: (d) ->
        return @formatDatetimeString(d.__end_time_date, d.__end_time_time)
        
    @formatDatetimeString: (dateString, timeString) ->
        if not dateString
            return null
        if not timeString
            timeString = '00:00'
        obj = moment(dateString + ' ' + timeString, 'YYYY-MM-DD HH:mm')
        return obj.format()

    @formatDate: (datetimeString) ->
        obj = moment(datetimeString)
        return obj.format('YYYY-MM-DD')

    @formatTime: (datetimeString) ->
        obj = moment(datetimeString)
        return obj.format('HH:mm')

module.exports = API
