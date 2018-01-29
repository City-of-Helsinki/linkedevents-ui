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

const initialStore = {
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
              fi: 'Kulttuuri ja vapaa-aika',
              sv: 'Kultur och fritid'
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
              fi: 'Kaupunki ja hallinto',
              sv: 'Staden och förvaltning'
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
              fi: 'Sosiaali- ja terveyspalvelut',
              sv: 'Social- och hälsovård'
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
              fi: 'Liikenne ja kartat',
              sv: 'Kartor och trafik'
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
              fi: 'Maahanmuuttajat',
              sv: 'Invandrare'
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
              fi: 'Yhdistykset',
              sv: 'Föreningar'
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
              fi: 'Vammaiset',
              sv: 'Funktionshindrade'
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
              fi: 'Nuoret',
              sv: 'Unga'
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
              fi: 'Yritykset',
              sv: 'Företagare'
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
              fi: 'lapsiperheet',
              sv: 'barnfamiljer'
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
              fi: 'maahanmuuttajat',
              sv: 'invandrare'
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
              fi: 'nuoret',
              sv: 'ungdomar'
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
              fi: 'yritykset',
              sv: 'företag'
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
              fi: 'järjestöt',
              sv: 'föreningar'
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
              fi: 'vanhukset',
              sv: 'åldringar'
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
              fi: 'mielenterveyskuntoutujat',
              sv: 'klienter i psykisk rehabilitering'
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
              fi: 'päihdekuntoutujat',
              sv: 'klienter i missbrukarrehabilitering'
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

describe('Editor Snapshot', () => {
  beforeEach(() => {
    store = mockStore(initialStore)
  })

  it('should render view correctly', () => {
    const componentProps = {
      params: {
        action: 'create',
        eventId: 'new?_k=dn954b'
      }
    } // Props which are added to component
    const componentToTest = <Editor {...componentProps} />
    // const renderedValue = renderer.create(testReduxIntWrapper(store, componentToTest)).toJSON()

    // expect(renderedValue).toMatchSnapshot()
  })
})
