import PropTypes from 'prop-types'

const constants = {
    API_HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },

    APP_SET_FLASHMSG: 'APP_SET_FLASHMSG',
    APP_CLEAR_FLASHMSG: 'APP_CLEAR_FLASHMSG',
    APP_CONFIRM_ACTION: 'APP_CONFIRM_ACTION',
    APP_DO_ACTION: 'APP_DO_ACTION',
    APP_CANCEL_ACTION: 'APP_CANCEL_ACTION',

    REQUEST_EVENTS: 'REQUEST_EVENTS',
    RECEIVE_EVENTS: 'RECEIVE_EVENTS',
    RECEIVE_SUPER_EVENT: 'RECEIVE_SUPER_EVENT',
    RECEIVE_EVENT_FOR_EDITING: 'RECEIVE_EVENT_FOR_EDITING',
    RECEIVE_EVENTS_ERROR: 'RECEIVE_EVENTS_ERROR',
    RECEIVE_EVENT_DETAILS: 'RECEIVE_EVENT_DETAILS',
    REQUEST_EVENT: 'REQUEST_EVENT',
    RECEIVE_EVENT_DETAILS_ERROR: 'RECEIVE_EVENT_DETAILS_ERROR',
    CLEAR_EVENT_DETAILS: 'CLEAR_EVENT_DETAILS',
    CLEAR_SUPER_EVENT_DETAILS: 'CLEAR_SUPER_EVENT_DETAILS',
    EVENT_DELETED: 'EVENT_DELETED',
    REQUEST_USER_EVENTS: 'REQUEST_USER_EVENTS',
    RECEIVE_USER_EVENTS: 'RECEIVE_USER_EVENTS',
    RECEIVE_USER_EVENTS_ERROR: 'RECEIVE_USER_EVENTS_ERROR',
    RESET_USER_EVENTS_FETCHING: 'RESET_USER_EVENTS_FETCHING',
    SET_USER_EVENTS_SORTORDER: 'SET_USER_EVENTS_SORTORDER',
    REQUEST_SUB_EVENTS: 'REQUEST_SUB_EVENTS',
    RECEIVE_SUB_EVENTS: 'RECEIVE_SUB_EVENTS',
    RECEIVE_SUB_EVENTS_ERROR: 'RECEIVE_SUB_EVENTS_ERROR',
    RECEIVE_SUB_EVENTS_FROM_SUPER: 'RECEIVE_SUB_EVENTS_FROM_SUPER',
    REQUEST_SUB_EVENTS_FROM_SUPER: 'REQUEST_SUB_EVENTS_FROM_SUPER',
    CLEAR_SUB_EVENTS: 'CLEAR_SUB_EVENTS',

    REQUEST_IMAGES: 'REQUEST_IMAGES',
    RECEIVE_IMAGES: 'RECEIVE_IMAGES',
    SELECT_IMAGE_BY_ID: 'SELECT_IMAGE_BY_ID',

    RECEIVE_USERDATA: 'RECEIVE_USERDATA',
    CLEAR_USERDATA: 'CLEAR_USERDATA',

    EDITOR_RECEIVE_KEYWORDSETS: 'EDITOR_RECEIVE_KEYWORDSETS',
    EDITOR_RECEIVE_LANGUAGES: 'EDITOR_RECEIVE_LANGUAGES',
    EDITOR_SETDATA: 'EDITOR_SETDATA',
    EDITOR_UPDATE_SUB_EVENT: 'EDITOR_UPDATE_SUB_EVENT',
    EDITOR_DELETE_SUB_EVENT: 'EDITOR_DELETE_SUB_EVENT',
    EDITOR_SORT_SUB_EVENTS: 'EDITOR_SORT_SUB_EVENTS',
    EDITOR_ADD_OFFER: 'EDITOR_ADD_OFFER',
    EDITOR_DELETE_OFFER: 'EDITOR_DELETE_OFFER',
    EDITOR_SET_FREE_OFFERS: 'EDITOR_SET_FREE_OFFERS',
    EDITOR_SETLANGUAGES: 'EDITOR_SETLANGUAGES',
    EDITOR_REPLACEDATA: 'EDITOR_REPLACEDATA',
    EDITOR_CLEARDATA: 'EDITOR_CLEARDATA',
    EDITOR_SENDDATA: 'EDITOR_SENDDATA',
    EDITOR_SENDDATA_COMPLETE: 'EDITOR_SENDDATACOMPLETE',
    EDITOR_SENDDATA_ERROR: 'EDITOR_SENDDATA_ERROR',
    EDITOR_SENDDATA_SUCCESS: 'EDITOR_SENDDATA_SUCCESS',
    SET_VALIDATION_ERRORS: 'SET_VALIDATION_ERRORS',
    VALIDATE_FOR: 'VALIDATE_FOR',

    ORG_FETCH_ADMIN: 'ORG_FETCH_ADMIN',
    ORG_FETCH_ADMIN_FAILED: 'ORG_FETCH_ADMIN_FAILED',
    ORG_FETCH_ADMIN_SUCCESS: 'ORG_FETCH_ADMIN_SUCCESS',

    IMAGE_UPLOAD_SUCCESS: 'IMAGE_UPLOAD_SUCCESS',
    IMAGE_UPLOAD_ERROR: 'IMAGE_UPLOAD_ERROR',

    DEFAULT_LOCALE: 'fi',

    APPLICATION_SUPPORT_TRANSLATION: ['fi', 'en'],
    // currently there is only finnish translation in i18n

    // Locale actions
    LOCALE_ACTIONS: {
        LOCALE_SET: 'LOCALE_SET',
        LOCALE_RESET: 'LOCALE_RESET',
    },
    
    // Local storage keys
    EDITOR_VALUES: 'EDITOR_VALUES',

    // Super event types
    SUPER_EVENT_TYPE_RECURRING: 'recurring',
    SUPER_EVENT_TYPE_UMBRELLA: 'umbrella',

    // Event schedule values
    EVENT_STATUS: {
        SCHEDULED: 'EventScheduled',
        CANCELLED: 'EventCancelled',
        POSTPONED: 'EventPostponed',
        RESCHEDULED: 'EventRescheduled',
    },

    PUBLICATION_STATUS: {
        DRAFT: 'draft',
        PUBLIC: 'public',
    },

    VALIDATION_STATUS: {
        CLEARED: 'cleared', // When form is cleared we also clear validation errors and set this status
        RESOLVE: 'resolve', // When form has validation errors and user is on editor page
    },

    EVENT_CREATION: {
        CREATE: 'create',
        DELETE: 'delete',
        CANCEL: 'cancel',
        PUBLISH: 'publish',
        UPDATE: 'update',
        SUCCESS: 'success',
        SAVE_DRAFT: 'savedraft',
        SAVE_PUBLIC: 'savepublic',
        CREATE_SUCCESS: 'event-creation-create-success',
        DELETE_SUCCESS: 'event-creation-delete-success',
        CANCEL_SUCCESS: 'event-creation-cancel-success',
        PUBLISH_SUCCESS: 'event-creation-publish-success',
        MULTIPLE_EVENTS_SUCCESS: 'event-creation-multipleevents-success',
        SAVE_PUBLIC_SUCCESS: 'event-creation-savepublic-success',
        SAVE_DRAFT_SUCCESS: 'event-creation-savedraft-success',
        DEFAULT_SUCCESS: 'event-creation-default-success',
        UPDATE_SUCCESS: 'event-creation-update-success',
    },

    VALIDATION_RULES: {
        IS_URL: 'isUrl',
        IS_DATE: 'isDate',
        IS_TIME: 'isTime',
        IS_INT: 'isInt',
        LONG_STRING:'longString',
        MEDIUM_STRING: 'mediumString',
        SHORT_STRING: 'shortString',
        HAS_PRICE: 'hasPrice',
        REQUIRE_MULTI: 'requiredMulti',
        AFTER_START_TIME: 'afterStartTime',
        AFTER_ENROLMENT_START_TIME: 'afterEnrolmentStartTime',
        IN_THE_FUTURE: 'inTheFuture',
        DAY_WITHIN_INTERVAL: 'daysWithinInterval',
        REQUIRED_IN_CONTENT_LANGUAGE: 'requiredInContentLanguages',
        REQUIRED: 'required',
        REQUIRED_FOR_COURSES: 'requiredForCourses',
        REQUIRED_STRING: 'requiredString',
        REQUIRED_STRING_FOR_COURSES: 'requiredStringForCourses',
        REQUIRE_AT_ID: 'requiredAtId',
        AT_LEAST_ONE: 'atLeastOne',
        IS_MORE_THAN_ONE: 'isMoreThanOne',
        AT_LEAST_ONE_IS_TRUE: 'atLeastOneIsTrue',
        DEFAULT_END_IN_FUTURE: 'defaultEndInTheFuture',
    },

    CHARACTER_LIMIT: {
        SHORT_STRING: 160,
        MEDIUM_STRING: 400,
        LONG_STRING: 5000,
    },

    TABLE_DATA_SHAPE: PropTypes.shape({
        events: PropTypes.array,
        count: PropTypes.number,
        paginationPage: PropTypes.number,
        pageSize: PropTypes.number,
        fetchComplete: PropTypes.bool,
        sortBy: PropTypes.string,
        sortDirection: PropTypes.string,
        tableColumns: PropTypes.arrayOf(
            PropTypes.oneOf([
                'checkbox',
                'name',
                'publisher',
                'start_time',
                'end_time',
                'last_modified_time',
                'date_published',
                'event_time',
            ]),
        ),
        selectedRows: PropTypes.array,
    }),
}

export default constants
