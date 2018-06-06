const constants = {

    APP_SET_FLASHMSG: 'APP_SET_FLASHMSG',
    APP_CLEAR_FLASHMSG: 'APP_CLEAR_FLASHMSG',
    APP_CONFIRM_ACTION: 'APP_CONFIRM_ACTION',
    APP_DO_ACTION: 'APP_DO_ACTION',
    APP_CANCEL_ACTION: 'APP_CANCEL_ACTION',

    REQUEST_EVENTS: 'REQUEST_EVENTS',
    RECEIVE_EVENTS: 'RECEIVE_EVENTS',
    RECEIVE_EVENT_FOR_EDITING: 'RECEIVE_EVENT_FOR_EDITING',
    RECEIVE_EVENTS_ERROR: 'RECEIVE_EVENTS_ERROR',
    RECEIVE_EVENT_DETAILS: 'RECEIVE_EVENT_DETAILS',
    REQUEST_EVENT: 'REQUEST_EVENT',
    RECEIVE_EVENT_DETAILS_ERROR: 'RECEIVE_EVENT_DETAILS_ERROR',
    EVENT_DELETED: 'EVENT_DELETED',
    REQUEST_USER_EVENTS: 'REQUEST_USER_EVENTS',
    RECEIVE_USER_EVENTS: 'RECEIVE_USER_EVENTS',
    RECEIVE_USER_EVENTS_ERROR: 'RECEIVE_USER_EVENTS_ERROR',
    RESET_USER_EVENTS_FETCHING: 'RESET_USER_EVENTS_FETCHING',
    SET_USER_EVENTS_SORTORDER: 'SET_USER_EVENTS_SORTORDER',
    REQUEST_SUB_EVENTS: 'REQUEST_SUB_EVENTS',
    RECEIVE_SUB_EVENTS: 'RECEIVE_SUB_EVENTS',
    RECEIVE_SUB_EVENTS_ERROR: 'RECEIVE_SUB_EVENTS_ERROR',

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

    IMAGE_UPLOAD_SUCCESS: 'IMAGE_UPLOAD_SUCCESS',
    IMAGE_UPLOAD_ERROR: 'IMAGE_UPLOAD_ERROR',

    // Local storage keys
    EDITOR_VALUES: 'EDITOR_VALUES',

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

    DEFAULT_CHARACTER_LIMIT: 400,
    VALIDATION_RULES: {
        IS_URL: 'isUrl',
        IS_DATE: 'isDate',
        IS_TIME: 'isTime',
        LONG_STRING:'longString',
        SHORT_STRING: 'shortString',
        HAS_PRICE: 'hasPrice',
        REQUIRE_MULTI: 'requireMulti',
        AFTER_START_TIME: 'afterStartTime',
        IN_THE_FUTURE: 'inTheFuture',
        DAY_WITHIN_INTERVAL: 'daysWithinInterval',
        REQUIRED_IN_CONTENT_LANGUAGE: 'requiredInContentLanguages',
        REQUIRED_STRING: 'requiredString',
        REQUIRE_AT_ID: 'requiredAtId',
        AT_LEAST_ONE: 'atLeastOne',
        IS_MORE_THAN_ONE: 'isMoreThanOne',
        AT_LEAST_ONE_IS_TRUE: 'atLeastOneIsTrue',
    },
}

export default constants
