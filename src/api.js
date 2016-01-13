import moment from 'moment'

class API {
    static loadHelMainOptions() {
        // console.log '@TODO: get the hel_main options dynamically?'
        return [
          {
            value: 'asuminen-ja-ymparisto',
            label: 'Asuminen ja ympäristö'
          },
          {
            value: 'kulttuuri-ja-vapaa-aika',
            label: 'Kulttuuri ja vapaa-aika'
          },
          {
            value: 'paivahoito-ja-koulutus',
            label: 'Päivähoito ja koulutus'
          },
          {
            value: 'liikenne-ja-kartat',
            label: 'Liikenne ja kartat'
          },
          {
            value: 'sosiaali-ja-terveyspalvelut',
            label: 'Sosiaali- ja terveyspalvelut'
          },
          {
            value: 'kaupunki-ja-hallinto',
            label: 'Kaupunki ja hallinto'
          }
        ]
    }
    static loadHelTargetOptions() {
        // console.log '@TODO: get the hel_target options dynamically?'
        return [
          {
            value: 'all',
            label: 'Ei erityiskohderyhmää'
          },
          {
            value: 'yhdistykset',
            label: 'Yhdistykset'
          },
          {
            value: 'yrittajat',
            label: 'Yrittäjät'
          },
          {
            value: 'maahanmuuttajat',
            label: 'Maahanmuuttajat'
          },
          {
            value: 'vanhukset',
            label: 'Vanhukset'
          },
          {
            value: 'vammaiset',
            label: 'Vammaiset'
          },
          {
            value: 'nuoret',
            label: 'Nuoret'
          },
          {
            value: 'lapset-ja-lapsiperheet',
            label: 'Lapset ja lapsiperheet'
          }
        ]
    }
    static loadHelEventLangOptions() {
        // console.log '@TODO: get the hel_event_lang options dynamically?'
        return [
          {
            value: 'venaja',
            label: 'Venäjä'
          },
          {
            value: 'ranska',
            label: 'Ranska'
          },
          {
            value: 'saksa',
            label: 'Saksa'
          },
          {
            value: 'englanti',
            label: 'Englanti'
          },
          {
            value: 'ruotsi',
            label: 'Ruotsi'
          },
          {
            value: 'suomi',
            label: 'Suomi'
          }
        ]
    }

    static getStartTime(d) {
        return this.formatDatetimeString(d.__start_time_date, d.__start_time_time)
    }

    static getEndTime(d) {
        return this.formatDatetimeString(d.__end_time_date, d.__end_time_time)
    }

    static formatDatetimeString(dateString, timeString) {
        if (!dateString) {
            return null
        }
        if (!timeString) {
            timeString = '00:00'
        }
        var obj = moment(dateString + ' ' + timeString, 'YYYY-MM-DD HH:mm')
        return obj.format()
    }

    static formatDate(datetimeString) {
        var obj = moment(datetimeString)
        return obj.format('YYYY-MM-DD')
    }

    static formatTime(datetimeString) {
        var obj = moment(datetimeString)
        return obj.format('HH:mm')
    }

    static eventInfoLanguages() {
        return [
            {
              value: 'fi',
              label: 'in-fi'
            },
            {
              value: 'sv',
              label: 'in-sv'
            },
            {
              value: 'en',
              label: 'in-en'
            }
        ]
    }
}

export default API
