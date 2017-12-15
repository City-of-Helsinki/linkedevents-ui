export var schema = {
    "definitions": {},
    "$schema": "http://json-schema.org/draft-06/schema#",
    "id": "http://example.com/example.json",
    "type": "object",
    "properties": {
        "api_base": {
            "id": "/properties/api_base",
            "type": "string",
            "title": "The Api_base URL",
            "description": "URL that points to LinkedEvents API endpoint",
            "default": "https://api.hel.fi/linkedevents-test/v1",
            "format": "uri"
        },
        "local_storage_user_expiry_time": {
            "id": "/properties/local_storage_user_expiry_time",
            "type": "integer",
            "title": "The Local_storage_user_expiry_time Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": 0
        },
        "helsinkiAuthId": {
            "id": "/properties/helsinkiAuthId",
            "type": "string",
            "title": "The Helsinkiauthid Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": ""
        },
        "helsinkiAuthSecret": {
            "id": "/properties/helsinkiAuthSecret",
            "type": "string",
            "title": "The Helsinkiauthsecret Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": ""
        },
        "helsinkiTargetApp": {
            "id": "/properties/helsinkiTargetApp",
            "type": "string",
            "title": "The Helsinkitargetapp Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": ""
        },
        "nocache": {
            "id": "/properties/nocache",
            "type": "boolean",
            "title": "The Nocache Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": false
        },
        "raven_id": {
            "id": "/properties/raven_id",
            "type": "boolean",
            "title": "The Raven_id Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": false
        },
        "publicUrl": {
            "id": "/properties/publicUrl",
            "type": "string",
            "title": "The Publicurl Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": ""
        },
        "sessionSecret": {
            "id": "/properties/sessionSecret",
            "type": "string",
            "title": "The Sessionsecret Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": ""
        },
        "LE_PRODUCTION_INSTANCE": {
            "id": "/properties/LE_PRODUCTION_INSTANCE",
            "type": "string",
            "title": "The Le_production_instance Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": ""
        },
        "APP_MODE": {
            "id": "/properties/APP_MODE",
            "type": "string",
            "title": "The App_mode Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": ""
        },
        "commit_hash": {
            "id": "/properties/commit_hash",
            "type": "string",
            "title": "The Commit_hash Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": ""
        },
        "type": {
            "id": "/properties/type",
            "type": "string",
            "title": "The Type Schema.",
            "description": "An explanation about the purpose of this instance.",
            "default": ""
        }
    }
}
