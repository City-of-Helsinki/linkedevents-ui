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

describe('Editor Snapshot', () => {
  beforeEach(() => {
    store = mockStore(initialStore)
  })

  it('should render view correctly', () => {
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
})
