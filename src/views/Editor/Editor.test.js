import configureStore from 'redux-mock-store'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

import initializeAppSettingsForJest from '../../utils/jestAppSettings'
import testReduxIntWrapper from '../../utils/testReduxIntWrapper'
initializeAppSettingsForJest()
import Editor from './index'

// findDOMNode mock is needed because we use React 15 with Material-UI v1. When upgrading to React 16 this mock can be removed.
jest.mock('react-dom', () => ({
  findDOMNode: () => {}
}))

const mockStore = configureStore([thunk])
let store

const initialStoreNewEvent = {
  subEvents: {
    isFetching: false,
    fetchComplete: false,
    items: [],
    error: null
  },
  user: {
    id: '0a423e5a-d34a-11e7-9a41-c2a5d78378ac',
    firstName: '',
    lastName: '',
    username: 'u-bjbd4wwtjii6pgsbyks5pa3yvq',
    emails: [
      {
        value: 'foo@foo.com'
      }
    ],
    provider: 'helsinki',
    _raw: '{"last_login":"2018-01-19T07:33:42.102250Z","username":"u-ajbd4wwtjii6pgsbyks5pa3yvq","email":"foo@foo.com","date_joined":"2017-11-27T08:07:41.123918Z","first_name":"","last_name":"","uuid":"0a423e5a-d34a-11e7-9a41-c2a5d78378ac","department_name":null}',
    _json: {
      last_login: '2018-01-19T07:33:42.102250Z',
      username: 'u-ajbd4wwtjii6pgsbyks5pa3yvq',
      email: 'foo@foo.com',
      date_joined: '2017-11-27T08:07:41.123918Z',
      first_name: '',
      last_name: '',
      uuid: '0a423e5a-d34a-11e7-9a41-c2a5d78378ac',
      department_name: null
    },
    token: 'sometoken',
    organization: 'ahjo:02100'
  },
  editor: {
    values: {
      sub_events: {}
    },
    languages: [
      {
        id: 'en',
        translation_available: true,
        name: {
          fi: 'englanti'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/en/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'sv',
        translation_available: true,
        name: {
          fi: 'ruotsi'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/sv/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'fi',
        translation_available: true,
        name: {
          fi: 'suomi'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/fi/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      }
    ],
    contentLanguages: [
      'fi'
    ],
    keywordSets: [
      {
        id: 'helfi:topics',
        keywords: [
          {
            id: 'helfi:11',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 63,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Daycare and education',
              fi: 'Päivähoito ja koulutus',
              sv: 'Dagvård och utbildning'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:11/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:13',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 139,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Housing and environment',
              fi: 'Asuminen ja ympäristö',
              sv: 'Boende och miljö'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:13/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          }
        ],
        usage: 'keyword',
        created_time: '2015-01-13T12:00:00Z',
        last_modified_time: '2015-01-13T12:00:00Z',
        data_source: 'helfi',
        image: null,
        organization: null,
        name: {
          en: 'www.hel.fi themes',
          fi: 'www.hel.fi-aihepiirit',
          sv: 'www.hel.fi-teman'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword_set/helfi:topics/',
        '@context': 'http://schema.org',
        '@type': 'KeywordSet'
      },
      {
        id: 'helfi:audiences',
        keywords: [
          {
            id: 'helfi:5',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 76,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Elderly',
              fi: 'Vanhukset',
              sv: 'Äldre'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:5/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:1',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 142,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Children and families',
              fi: 'Lapset ja lapsiperheet',
              sv: 'Barn och barnfamiljer'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:1/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          }
        ],
        usage: 'audience',
        created_time: null,
        last_modified_time: null,
        data_source: 'helfi',
        image: null,
        organization: null,
        name: {
          en: 'www.hel.fi resident groups',
          fi: 'www.hel.fi-kohderyhmät',
          sv: 'www.hel.fi-invånargrupper'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword_set/helfi:audiences/',
        '@context': 'http://schema.org',
        '@type': 'KeywordSet'
      },
      {
        id: 'helsinki:audiences',
        keywords: [
          {
            id: 'yso:p7179',
            alt_labels: [
              'funktionshindrade',
              'monivammaiset',
              'multihandikappade',
              'invalidit',
              'invalider',
              'personer med handikapp',
              'people with disabilities',
              'personer med funktionshinder'
            ],
            created_time: '2014-06-23T11:37:28.866000Z',
            last_modified_time: '2017-09-05T14:42:43.882641Z',
            aggregate: false,
            deprecated: false,
            n_events: 10,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'disabled people',
              fi: 'vammaiset',
              sv: 'handikappade'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p7179/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'yso:p4354',
            alt_labels: [
              'spädbarn',
              'lapset',
              'imeväisikäiset',
              'barn'
            ],
            created_time: '2014-06-23T11:37:27.705000Z',
            last_modified_time: '2017-09-05T14:42:54.041059Z',
            aggregate: false,
            deprecated: false,
            n_events: 18597,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'children (age groups)',
              fi: 'lapset (ikäryhmät)',
              sv: 'barn (åldersgrupper)'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p4354/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          }
        ],
        usage: 'audience',
        created_time: null,
        last_modified_time: '2017-03-17T13:12:38.934562Z',
        data_source: 'helsinki',
        image: null,
        organization: null,
        name: {
          en: 'Helsinki audiences',
          fi: 'Helsinki kohderyhmät',
          sv: 'Helsingfors invånargrupper'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword_set/helsinki:audiences/',
        '@context': 'http://schema.org',
        '@type': 'KeywordSet'
      }
    ],
    validationErrors: {},
    validateFor: null,
    isSending: false
  }
}

const initialStoreExistingEvent = {
  subEvents: {
    isFetching: false,
    fetchComplete: false,
    items: [],
    error: null
  },
  user: {
    id: '0a423e5a-d34a-11e7-9a41-c2a5d78378ac',
    firstName: '',
    lastName: '',
    username: 'u-bjbd4wwtjii6pgsbyks5pa3yvq',
    emails: [
      {
        value: 'foo@foo.com'
      }
    ],
    provider: 'helsinki',
    _raw: '{"last_login":"2018-01-19T07:33:42.102250Z","username":"u-ajbd4wwtjii6pgsbyks5pa3yvq","email":"foo@foo.com","date_joined":"2017-11-27T08:07:41.123918Z","first_name":"","last_name":"","uuid":"0a423e5a-d34a-11e7-9a41-c2a5d78378ac","department_name":null}',
    _json: {
      last_login: '2018-01-19T07:33:42.102250Z',
      username: 'u-ajbd4wwtjii6pgsbyks5pa3yvq',
      email: 'foo@foo.com',
      date_joined: '2017-11-27T08:07:41.123918Z',
      first_name: '',
      last_name: '',
      uuid: '0a423e5a-d34a-11e7-9a41-c2a5d78378ac',
      department_name: null
    },
    token: 'sometoken',
    organization: 'ahjo:02100'
  },
  editor: {
    values: {
      id: 'helsinki:afqxukccli',
      name: {
        sv: 'ExampleEventForUnitTests_otsikkosv',
        fi: 'ExampleEventForUnitTests_otsikkofi'
      },
      short_description: {
        sv: 'En kort beskrivning',
        fi: 'Lyhyt suomeksi'
      },
      description: {
        sv: '<p>Kuvaus ruotsiksi</p>',
        fi: '<p>Kuvaus suomeksi</p>'
      },
      info_url: {
        sv: 'http://bar.sv',
        fi: 'http://foo.fi'
      },
      provider: {
        sv: 'Jårkkari',
        fi: 'Järkkäri'
      },
      event_status: 'EventScheduled',
      publication_status: 'public',
      organization: 'ahjo:02100',
      location: {
        id: 'matko:587',
        divisions: [
          {
            type: 'sub_district',
            ocd_id: 'ocd-division/country:fi/kunta:helsinki/osa-alue:kruununhaka',
            municipality: 'Helsinki',
            name: {
              sv: 'Kronohagen',
              fi: 'Kruununhaka'
            }
          },
          {
            type: 'district',
            ocd_id: 'ocd-division/country:fi/kunta:helsinki/peruspiiri:vironniemi',
            municipality: 'Helsinki',
            name: {
              sv: 'Estnäs',
              fi: 'Vironniemi'
            }
          },
          {
            type: 'neighborhood',
            ocd_id: 'ocd-division/country:fi/kunta:helsinki/kaupunginosa:kruununhaka',
            municipality: 'Helsinki',
            name: {
              sv: 'Kronohagen',
              fi: 'Kruununhaka'
            }
          },
          {
            type: 'muni',
            ocd_id: 'ocd-division/country:fi/kunta:helsinki',
            municipality: null,
            name: {
              sv: 'Helsingfors',
              fi: 'Helsinki'
            }
          }
        ],
        custom_data: null,
        created_time: null,
        last_modified_time: '2017-09-04T14:05:13.317545Z',
        email: null,
        contact_type: null,
        address_region: null,
        postal_code: null,
        post_office_box_num: null,
        address_country: null,
        deleted: false,
        n_events: 0,
        data_source: 'matko',
        image: null,
        publisher: 'ytj:0586977-6',
        parent: null,
        replaced_by: null,
        position: {
          coordinates: [
            24.9521506,
            60.1707042
          ],
          type: 'Point'
        },
        name: {
          en: 'The Cathedral Crypt',
          sv: 'Domkyrkans krypta',
          fi: 'Tuomiokirkon krypta'
        },
        address_locality: null,
        description: {
          en: 'The crypt of the church was originally a cellar where the heating devices and firewood storage were located. The facility with its earth floor was renovated in the 1972-73 in accordance with architect Tarja Salmio-Toiviainen\'s plan. The heart of the crypt is a small chapel. Concerts and exhibitions, and in summer Café Krypta.',
          sv: 'Domkyrkans krypta var ursprungligen Domkyrkans källare där man bl.a. förvarade veden som kyrkan värmdes med. Källaren med jordgolv stod sedan tom i nästan hundra år. Åren 1972-73 renoverades den grundligt enligt arkitekt Tarja Salmio-Toiviainens ritningar efter vilket den togs i bruk i församlingen. Dess hjärta är ett litet kapell. Förutom utrymme för församlingen, ordnas här konserter och utställningar. Sommartid Café Krypta. I Domkyrkans krypta anordnas evenemang och utställningar.',
          fi: 'Tuomiokirkon krypta rakennettiin alun perin kirkon kellariksi, jossa sijaitsivat kirkon lämmityslaitteet ja halkovarastot. Maalattiainen kellari oli tyhjillään yli sata vuotta. Krypta remontoitiin vuosina 1972-73 arkkitehti Tarja Salmio-Toiviaisen suunnitelmien mukaan ja otettiin sen jälkeen toiminnalliseen käyttöön. Sen sydän on pieni kappeli. Krypta toimii seurakunnan hartaus- ja kokoontumispaikkana, ja siellä järjestetään myös konsertteja ja näyttelyitä. Kesäisin kryptassa toimii Café Krypta.'
        },
        street_address: null,
        telephone: null,
        info_url: {
          en: 'http://www.helsinginseurakunnat.fi/seurakunnat/tuomiokirkkoseurakunta/touristinformation.html',
          sv: 'http://www.helsinginseurakunnat.fi/seurakunnat/tuomiokirkkoseurakunta/touristinformation.html',
          fi: 'http://www.helsinginseurakunnat.fi/seurakunnat/tuomiokirkkoseurakunta/yhteystiedot_0/kirkot/tuomiokirkko/tuomiokirkonkrypta.html'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/place/matko:587/',
        '@context': 'http://schema.org',
        '@type': 'Place'
      },
      location_extra_info: {
        sv: 'Det händer på kryptan',
        fi: 'Kryptassa tapahtuu'
      },
      offers: [
        {
          is_free: false,
          price: {
            sv: '10000 kronor',
            fi: '110 euroa'
          },
          description: {
            sv: 'hintaruotsiksi',
            fi: 'hintasuomeksi'
          },
          info_url: {
            sv: 'http://kryptatapahtuma.sv',
            fi: 'http://kryptatapahtuma.fi'
          }
        }
      ],
      sub_events: {},
      hel_main: [
        'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:12/',
        'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:13/'
      ],
      keywords: [
        {
          value: 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p360/',
          label: 'kulttuuritapahtumat'
        },
        {
          value: 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p1103/',
          label: 'retkeily'
        }
      ],
      audience: [
        'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:2/',
        'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p11617/',
        'https://api.hel.fi/linkedevents-test/v1/keyword/helsinki:aflfbatkwe/'
      ],
      in_language: [
        'https://api.hel.fi/linkedevents-test/v1/language/fi/',
        'https://api.hel.fi/linkedevents-test/v1/language/sv/'
      ],
      extlink_facebook: 'http://kasvokirja.fi',
      extlink_twitter: 'http://twiitti.fi',
      extlink_instagram: 'http://instataan.com',
      start_time: '2038-02-12T13:16:00Z',
      end_time: '2038-02-12T15:18:00Z'
    },
    languages: [
      {
        id: 'en',
        translation_available: true,
        name: {
          fi: 'englanti'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/en/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'sv',
        translation_available: true,
        name: {
          fi: 'ruotsi'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/sv/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'fi',
        translation_available: true,
        name: {
          fi: 'suomi'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/fi/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'ru',
        translation_available: false,
        name: {
          fi: 'venäjä'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/ru/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'et',
        translation_available: false,
        name: {
          fi: 'viro'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/et/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'fr',
        translation_available: false,
        name: {
          fi: 'ranska'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/fr/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'so',
        translation_available: false,
        name: {
          fi: 'somali'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/so/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'es',
        translation_available: false,
        name: {
          fi: 'espanja'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/es/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'tr',
        translation_available: false,
        name: {
          fi: 'turkki'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/tr/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'zh',
        translation_available: false,
        name: {
          fi: 'kiina'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/zh/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'fa',
        translation_available: false,
        name: {
          fi: 'persia'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/fa/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      },
      {
        id: 'ar',
        translation_available: false,
        name: {
          fi: 'arabia'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/language/ar/',
        '@context': 'http://schema.org',
        '@type': 'Language'
      }
    ],
    contentLanguages: [
      'fi',
      'sv'
    ],
    keywordSets: [
      {
        id: 'helfi:topics',
        keywords: [
          {
            id: 'helfi:11',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 63,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Daycare and education',
              sv: 'Dagvård och utbildning',
              fi: 'Päivähoito ja koulutus'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:11/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:13',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 139,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Housing and environment',
              sv: 'Boende och miljö',
              fi: 'Asuminen ja ympäristö'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:13/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:12',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 496,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Culture and leisure',
              sv: 'Kultur och fritid',
              fi: 'Kulttuuri ja vapaa-aika'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:12/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:8',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 43,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'City administration',
              sv: 'Staden och förvaltning',
              fi: 'Kaupunki ja hallinto'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:8/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:9',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 152,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Social services and health care',
              sv: 'Social- och hälsovård',
              fi: 'Sosiaali- ja terveyspalvelut'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:9/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:10',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 151,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Maps and transport',
              sv: 'Kartor och trafik',
              fi: 'Liikenne ja kartat'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:10/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          }
        ],
        usage: 'keyword',
        created_time: '2015-01-13T12:00:00Z',
        last_modified_time: '2015-01-13T12:00:00Z',
        data_source: 'helfi',
        image: null,
        organization: null,
        name: {
          en: 'www.hel.fi themes',
          sv: 'www.hel.fi-teman',
          fi: 'www.hel.fi-aihepiirit'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword_set/helfi:topics/',
        '@context': 'http://schema.org',
        '@type': 'KeywordSet'
      },
      {
        id: 'helfi:audiences',
        keywords: [
          {
            id: 'helfi:5',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 76,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Elderly',
              sv: 'Äldre',
              fi: 'Vanhukset'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:5/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:1',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 142,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Children and families',
              sv: 'Barn och barnfamiljer',
              fi: 'Lapset ja lapsiperheet'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:1/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:3',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 67,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Immigrants',
              sv: 'Invandrare',
              fi: 'Maahanmuuttajat'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:3/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:7',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 9,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Associations',
              sv: 'Föreningar',
              fi: 'Yhdistykset'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:7/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:4',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 9,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Disabled',
              sv: 'Funktionshindrade',
              fi: 'Vammaiset'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:4/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:2',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 98,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Youth',
              sv: 'Unga',
              fi: 'Nuoret'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:2/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helfi:6',
            alt_labels: [],
            created_time: '2015-01-13T12:00:00Z',
            last_modified_time: '2015-01-13T12:00:00Z',
            aggregate: false,
            deprecated: false,
            n_events: 8,
            data_source: 'helfi',
            image: null,
            publisher: null,
            name: {
              en: 'Entrepreneurs',
              sv: 'Företagare',
              fi: 'Yritykset'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helfi:6/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          }
        ],
        usage: 'audience',
        created_time: null,
        last_modified_time: null,
        data_source: 'helfi',
        image: null,
        organization: null,
        name: {
          en: 'www.hel.fi resident groups',
          sv: 'www.hel.fi-invånargrupper',
          fi: 'www.hel.fi-kohderyhmät'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword_set/helfi:audiences/',
        '@context': 'http://schema.org',
        '@type': 'KeywordSet'
      },
      {
        id: 'helsinki:audiences',
        keywords: [
          {
            id: 'yso:p7179',
            alt_labels: [
              'funktionshindrade',
              'monivammaiset',
              'multihandikappade',
              'invalidit',
              'invalider',
              'personer med handikapp',
              'people with disabilities',
              'personer med funktionshinder'
            ],
            created_time: '2014-06-23T11:37:28.866000Z',
            last_modified_time: '2017-09-05T14:42:43.882641Z',
            aggregate: false,
            deprecated: false,
            n_events: 10,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'disabled people',
              sv: 'handikappade',
              fi: 'vammaiset'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p7179/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'yso:p4354',
            alt_labels: [
              'spädbarn',
              'lapset',
              'imeväisikäiset',
              'barn'
            ],
            created_time: '2014-06-23T11:37:27.705000Z',
            last_modified_time: '2017-09-05T14:42:54.041059Z',
            aggregate: false,
            deprecated: false,
            n_events: 18597,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'children (age groups)',
              sv: 'barn (åldersgrupper)',
              fi: 'lapset (ikäryhmät)'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p4354/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'yso:p13050',
            alt_labels: [],
            created_time: '2014-06-23T11:37:23.969000Z',
            last_modified_time: '2017-09-05T14:42:42.446458Z',
            aggregate: false,
            deprecated: false,
            n_events: 199,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'families with children',
              sv: 'barnfamiljer',
              fi: 'lapsiperheet'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p13050/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'yso:p6165',
            alt_labels: [
              'immigranter',
              'immigrantit'
            ],
            created_time: '2014-06-23T11:37:28.630000Z',
            last_modified_time: '2017-09-05T14:42:31.057402Z',
            aggregate: false,
            deprecated: false,
            n_events: 7494,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'immigrants',
              sv: 'invandrare',
              fi: 'maahanmuuttajat'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p6165/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'yso:p11617',
            alt_labels: [
              'tonåringar',
              'nuoriso',
              'teini-ikäiset',
              'unga'
            ],
            created_time: '2014-06-23T11:37:27.563000Z',
            last_modified_time: '2017-09-05T14:43:00.842671Z',
            aggregate: false,
            deprecated: false,
            n_events: 12983,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'young people',
              sv: 'ungdomar',
              fi: 'nuoret'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p11617/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'yso:p3128',
            alt_labels: [
              'businesses',
              'affärsföretag',
              'liikeyritykset'
            ],
            created_time: '2014-06-23T11:37:24.651000Z',
            last_modified_time: '2017-09-05T14:42:58.508500Z',
            aggregate: false,
            deprecated: false,
            n_events: 8,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'enterprises',
              sv: 'företag',
              fi: 'yritykset'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p3128/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'yso:p1393',
            alt_labels: [
              'seurat -- järjestötoiminta',
              'yhdistykset'
            ],
            created_time: '2014-06-23T11:37:27.364000Z',
            last_modified_time: '2017-09-05T14:42:36.625794Z',
            aggregate: false,
            deprecated: false,
            n_events: 9,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'associations',
              sv: 'föreningar',
              fi: 'järjestöt'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p1393/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'yso:p2434',
            alt_labels: [
              'ikäihmiset',
              'ikä-ihmiset',
              'gamlingar'
            ],
            created_time: '2014-06-23T11:37:30.235000Z',
            last_modified_time: '2017-09-05T14:43:05.106064Z',
            aggregate: false,
            deprecated: false,
            n_events: 4286,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'elderly',
              sv: 'åldringar',
              fi: 'vanhukset'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p2434/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'yso:p12297',
            alt_labels: [
              'mentalvårdsklienter',
              'klienter inom psykisk rehabilitering',
              'psykiska rehabiliteringspatienter'
            ],
            created_time: '2014-06-23T11:37:29.472000Z',
            last_modified_time: '2017-09-05T14:43:12.305002Z',
            aggregate: false,
            deprecated: false,
            n_events: 0,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'patients in psychiatric rehabilitation',
              sv: 'klienter i psykisk rehabilitering',
              fi: 'mielenterveyskuntoutujat'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p12297/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'yso:p23886',
            alt_labels: [
              'rehabiliterade missbrukare',
              'klienter i missbrukarvård',
              'klienter i missbruksvård',
              'klienter i missbruksrehabilitering',
              'rehabiliteringspatienter (missbruk)'
            ],
            created_time: '2014-06-23T11:37:30.575000Z',
            last_modified_time: '2017-09-05T14:42:53.995580Z',
            aggregate: false,
            deprecated: false,
            n_events: 8,
            data_source: 'yso',
            image: null,
            publisher: 'hy:kansalliskirjasto',
            name: {
              en: 'substance abuse rehabilitation patients',
              sv: 'klienter i missbrukarrehabilitering',
              fi: 'päihdekuntoutujat'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/yso:p23886/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helsinki:aflfbatkwe',
            alt_labels: [],
            created_time: null,
            last_modified_time: '2017-03-17T13:12:38.921627Z',
            aggregate: false,
            deprecated: false,
            n_events: 0,
            data_source: 'helsinki',
            image: null,
            publisher: null,
            name: {
              fi: 'omaishoitoperheet'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helsinki:aflfbatkwe/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          },
          {
            id: 'helsinki:aflfbat76e',
            alt_labels: [],
            created_time: null,
            last_modified_time: '2017-03-17T13:12:38.926826Z',
            aggregate: false,
            deprecated: false,
            n_events: 0,
            data_source: 'helsinki',
            image: null,
            publisher: null,
            name: {
              fi: 'palvelukeskuskortti'
            },
            '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword/helsinki:aflfbat76e/',
            '@context': 'http://schema.org',
            '@type': 'Keyword'
          }
        ],
        usage: 'audience',
        created_time: null,
        last_modified_time: '2017-03-17T13:12:38.934562Z',
        data_source: 'helsinki',
        image: null,
        organization: null,
        name: {
          en: 'Helsinki audiences',
          sv: 'Helsingfors invånargrupper',
          fi: 'Helsinki kohderyhmät'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/keyword_set/helsinki:audiences/',
        '@context': 'http://schema.org',
        '@type': 'KeywordSet'
      }
    ],
    validationErrors: {},
    validateFor: null,
    isSending: false,
    validationStatus: 'resolve'
  }
}

describe('Editor Snapshot', () => {
  it('should render view correctly when new event', () => {
    store = mockStore(initialStoreNewEvent)
    const componentProps = {
      match: {
        params: {
          action: 'create',
          eventId: 'new?_k=dn954b'
        }
      }
    } // Props which are added to component
    const componentToTest = <Editor {...componentProps} />
    const renderedValue = renderer.create(testReduxIntWrapper(store, componentToTest)).toJSON()

    expect(renderedValue).toMatchSnapshot()
  })

  it('should render view correctly when editing existing event', () => {
    store = mockStore(initialStoreExistingEvent)
    const componentProps = {
      match: {
        params: {
          action: 'update',
          eventId: 'helsinki:afqxukccli'
        }
      }
    } // Props which are added to component
    const componentToTest = <Editor {...componentProps} />
    const renderedValue = renderer.create(testReduxIntWrapper(store, componentToTest)).toJSON()

    expect(renderedValue).toMatchSnapshot()

  })
})
