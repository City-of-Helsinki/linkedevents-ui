# styles
require 'style!vendor/stylesheets/typeahead.css'

# jquery
$ = require 'jquery'
window.jQuery = $

# js
bootstrap = require 'bootstrap'
typeahead = require 'typeahead.js'

# react-specific
Formsy = require 'formsy-react'
FRC = require 'formsy-react-components'
Loader = require 'react-loader'
React = require 'react'
ReactDOM = require 'react-dom'
Router = require 'react-router'
RB = require 'react-bootstrap'

# aliases
Input = FRC.Input
Textarea = FRC.Textarea
Select = FRC.Select
Checkbox = FRC.Checkbox
CheckboxGroup = FRC.CheckboxGroup
RadioGroup = FRC.RadioGroup
Row = FRC.Row

# our components
TU = require 'src/scripts/typeahead.cjsx'
API = require 'src/scripts/api.cjsx'
FF = require 'src/scripts/formfields.cjsx'


# === constants ===

# the backup doesn't support non-language links, so we use hardcoded
# 'fi' instead for the link language
EXT_LINK_NO_LANGUAGE = 'fi'


# === code ===

EditorPage = React.createClass

    mixins: [Router.History]

    getInitialState: ->
        data: {}
        isPreview: false
        isDone: false
        layout: 'horizontal'
        apiErrorMsg: ''

    updateData: (data) ->
        @setState
            data: data

    switchToPreview: ->
        @setState
            isPreview: true
            isDone: false

    switchToEdit: (event) ->
        if event
            event.preventDefault()
        @setState
            isPreview: false
            isDone: false
            apiErrorMsg: ''

    switchToDone: ->
        @setState
            isPreview: false
            isDone: true

    convertDataToLEFormat: (d) ->

        # === offers ===
        if 'location_id' of d
            if d.location_id.length > 0
                d['location'] = {'@id': d['location_id']}
            delete d['location_id']

        # === offers ===
        d['offers'] = [{}]
        d['offers'][0]['info_url'] = {}
        d['offers'][0]['price'] = {}
        d['offers'][0]['description'] = {}

        d['offers'][0]['is_free'] = d['offers_is_free']
        d['offers'][0]['info_url']['fi'] = d['offers_info_url_fi']
        d['offers'][0]['info_url']['en'] = d['offers_info_url_en']
        d['offers'][0]['info_url']['sv'] = d['offers_info_url_sv']
        d['offers'][0]['price']['fi'] = d['offers_price_fi']
        d['offers'][0]['price']['en'] = d['offers_price_en']
        d['offers'][0]['price']['sv'] = d['offers_price_sv']
        d['offers'][0]['description']['fi'] = d['offers_description_fi']
        d['offers'][0]['description']['en'] = d['offers_description_en']
        d['offers'][0]['description']['sv'] = d['offers_description_sv']

        delete d['offers_is_free']
        delete d['offers_info_url_fi']
        delete d['offers_info_url_en']
        delete d['offers_info_url_sv']
        delete d['offers_price_fi']
        delete d['offers_price_en']
        delete d['offers_price_sv']
        delete d['offers_description_fi']
        delete d['offers_description_en']
        delete d['offers_description_sv']

        # === external links ===
        d['external_links'] = []
        for key in ['extlink_twitter', 'extlink_facebook', 'extlink_instagram']
            if key in d
                val = {}
                val['name'] = key
                val['link'] = d['extlink_twitter']
                val['language'] = EXT_LINK_NO_LANGUAGE
                d['external_links'].push val
            delete d[key]

        # === pack hel_main, hel_target, and hel_event_lang into keywords ===
        d['keywords'] = []

        # === hel_main ===
        if d.hel_main
            for val in d.hel_main
                # TODO: implement
                undefined
            delete d.hel_main

        # === hel_target ===
        if d.hel_target
            for val in d.hel_target
                # TODO: implement
                undefined
            delete d.hel_target

        # === hel_event_lang ===
        if d.hel_event_lang
            for val in d.hel_event_lang
                # TODO: implement
                undefined
            delete d.hel_event_lang

        return d

    getLocation: (d) ->
        ret = null
        if 'location' of d and d['location']
            if '@id' of d['location'] and d['location']['@id']
                $.ajax({
                    type: 'GET'
                    url: d['location']['@id']
                    dataType: 'json'
                    complete: (response) ->
                        ret = $.parseJSON(response.responseText)
                    async: false
                })
        return ret

    convertDataToGUIFormat: (d) ->

        ret = {
            'event_status': d.event_status
            'data_source': d.data_source
            'publisher': d.publisher
            'id': d.id
        }

        # simple fields
        for key in [
            'image'
        ]
            if key of d
                ret[key] = d[key]

        # translateble fields
        for field in [
            'description',
            'headline',
            'info_url',
            'location_extra_info',
            'name',
            'short_description',
        ]
            if field of d and d[field]
                for lang in ['fi', 'sv', 'en']
                    if lang of d[field]
                        ret[field + '_' + lang] = d[field][lang]

        # location
        loc = @getLocation(d)
        if loc
            ret.location_id = loc.id
            ret.__location_search_field = loc.name.fi

        # time fields / initial fields
        if d.start_time
            ret.__start_time_date = API.formatDate(d.start_time)
            ret.__start_time_time = API.formatTime(d.start_time)
        if d.end_time
            ret.__end_time_date = API.formatDate(d.end_time)
            ret.__end_time_time = API.formatTime(d.end_time)

        # offers
        # TODO: rewrite this to add support for multiple offers
        if d.offers and d.offers.length > 0
            if d.offers.length > 1
                err = new Error('Multiple offers not supported')
                alert Error(err)
                throw err
            else
                offer = d.offers[0]
                ret.offers_is_free = offer.is_free
                for field in [
                    'price',
                    'description',
                    'info_url',
                ]
                    if field of offer and offer[field]
                        for lang in ['fi', 'sv', 'en']
                            if lang of offer[field]
                                key = 'offers_' + field + '_' + lang
                                ret[key] = offer[field][lang]

        # external links
        if d.external_links
            ret['external_links'] = d.external_links

        return ret

    postEventData: (event) ->
        @setState
            apiErrorMsg: ''

        event.preventDefault()
        d = @state.data
        d.start_time = API.getStartTime(d)
        d.end_time = API.getEndTime(d)

        # prune out the tmp fields
        for k, v of d
            if k.startsWith('__')
                delete d[k]

        d = @convertDataToLEFormat(d)

        # are we updating or creating a new event?
        if @props.params.action == 'update'
            url = @props.params.eventId
            method = 'PUT'
            d['id'] = @state.data.id
        else
            url = "#{appSettings.api_base}/event/"
            method = 'POST'

        handler = ((result) -> console.log 'success').bind(this)

        $.ajax({
            contentType: 'application/json',
            type: method,
            url: url,
            crossDomain: true,
            data: JSON.stringify(d),
            dataType: 'json',
        })
        .done (() ->
            console.log 'done'
            @switchToDone()
        ).bind(this)
        .fail ((data) ->
            console.log 'fail'
            @setState
                apiErrorMsg: JSON.stringify(data)
        ).bind(this)

    componentDidMount: () ->

        if @props.params.action is 'update'
            url = @props.params.eventId + '?format=json'
            $.getJSON(url)
            .done(((data) ->
                @updateData(@convertDataToGUIFormat(data))
                @switchToPreview()
                @switchToEdit()
            ).bind(this))
            .fail((data) ->
                @setState
                    apiErrorMsg: JSON.stringify(data)
            )

    componentDidUpdate: (prevProps, prevState) ->

        # populate form data if we're returning form preview to edit mode
        if @refs.formContainer and (!@state.isPreview && prevState.isPreview)
            @refs.formContainer.resetData(@state.data)

    render: ->
        if @state.isPreview
            if @state.apiErrorMsg and @state.apiErrorMsg.length > 0
                err = (
                    <span style={color: 'red !important'}>
                        {@state.apiErrorMsg}
                    </span>
                )
            return (
                <div>
                    <h2>Vahvista tapahtuman tallennus</h2>
                    <Formsy.Form
                        className="form-horizontal"
                        ref="previewForm"
                    >
                        <Input
                            name="ignore"
                            value={@state.data.headline_fi}
                            label="Otsikko"
                            type="text"
                            disabled
                        />
                        <Input
                            name="ignore2"
                            value={@state.data.__location_search_field}
                            label="Paikka"
                            type="text"
                            disabled
                        />
                        <Input
                            name="ignore3"
                            value={API.getStartTime(@state.data)}
                            label="Alkuaika"
                            type="text"
                            disabled
                        />
                        <Textarea
                            name="ignore4"
                            rows={8}
                            cols={40}
                            label="Kaikki tapahtuman tiedot JSON-muodossa"
                            value={JSON.stringify(@state.data)}
                            disabled
                        />
                        {err}
                        <Row layout={@state.layout}>
                            <input
                                className="btn btn-default"
                                type="submit"
                                defaultValue="Muokkaa tietoja"
                                onClick={@switchToEdit}
                            />
                            &nbsp;
                            <input
                                className="btn btn-primary"
                                type="submit"
                                onClick={@postEventData}
                                defaultValue="Lähetä tiedot LinkedEvents-tietokantaan"
                            />
                        </Row>
                    </Formsy.Form>
                </div>
            )
        else if @state.isDone
            <div>
                Tapahtuman tiedot tallennettu.
            </div>
        else
            <div>
                <EditEventForm
                    eventId={@props.params.eventId}
                    switchToPreview={@switchToPreview}
                    updateData={@updateData}
                    ref="formContainer"
                    __eventData={@state.data}
                    action={@props.params.action}
                />
            </div>


EditEventForm = React.createClass

    getInitialState: ->
        canSubmit: false
        layout: 'horizontal'
        validatePristine: false
        disabled: false
        location_id: ''
        enStyle: {display: 'none', color: 'green !important'}
        svStyle: {display: 'none', color: 'blue !important'}

    componentDidUpdate: ->
        # @trackActionChanges()

        # set up typeahead

        taOptions =
            hint: true
            highlight: true
            minLength: 1

        taDatasets=
            limit: 25
            display: 'value'
            templates:
                suggestion: (model) ->
                   '<div><class="place_name">' +
                   model.value +
                   '</span><br><span class="place_address">' +
                   model.street_address +
                   '</span></div>'
                empty: (d) ->
                    '<p class="repo-name">No Matches</p>'
            source: TU.bloodhoundInstance.ttAdapter()

        taSelectHandler = ((evt, item) ->
            @setState
                location_id: item.id
            @refs.__location_search_field.value = item.value
        ).bind(this)

        taEm = $('#__location_search_field')
        taEm.typeahead(taOptions, taDatasets)
        taEm.on('typeahead:selected', taSelectHandler)

    enableButton: ->
        @setState
            canSubmit: true

    disableButton: ->
        @setState
            canSubmit: false

    preview: (data) ->
        data.__location_search_field = @refs.__location_search_field.value
        @props.updateData(data)
        @props.switchToPreview()

    resetData: (data) ->
        # called eg. after we return from preview back to editing the event
        @refs.editForm.reset(data)
        @refs.__location_search_field.value = data.__location_search_field

    toggleEn:  ->
        style = $.extend({}, @state.enStyle)
        style.display  = if style.display is 'none' then 'inline' else 'none'
        @setState
            enStyle: style

    toggleSv:  ->
        style = $.extend({}, @state.svStyle)
        style.display  = if style.display is 'none' then 'inline' else 'none'
        @setState
            svStyle: style

    checkAndUncheckAll: (cbGroup, allKey, newValues, getEveryItemFunc) ->
        oldValues = cbGroup.getValue()

        # uncheck every item, if 'all' is unchecked
        if (allKey in oldValues) and (allKey not in newValues)
            newValues = []

        # uncheck 'all', if any other items are unchecked
        else if (allKey in oldValues) and (newValues.length < oldValues.length)
            newValues = newValues.filter (item) -> item isnt allKey

        # check every item, if 'all' is checked
        else if (allKey in newValues) and (allKey not in oldValues)
            newValues = getEveryItemFunc()

        cbGroup.setValue(newValues)

    checkAndUncheckAllV2: (cbGroup, noneKey, newValues, getEveryItemFunc) ->
        oldValues = cbGroup.getValue()

        # uncheck every item, if 'none' is checked
        if (noneKey in newValues) and (noneKey not in oldValues)
            newValues = [noneKey]

        # uncheck 'none', if any other items are checked
        else if (noneKey in oldValues) and (newValues.length > oldValues.length)
            newValues = newValues.filter (item) -> item isnt noneKey

        cbGroup.setValue(newValues)

    catchHelTargetAll: (emName, newValues) ->
        @checkAndUncheckAllV2(
            @refs.helTarget,
            'all',
            newValues,
            (() -> (obj.value for obj in FF.helTargetOptions)).bind(this)
        )

    catchHelEventLangAll: (emName, newValues) ->
        @checkAndUncheckAll(
            @refs.helEventLang,
            'all',
            newValues,
            (() -> (obj.value for obj in FF.helEventLangOptions)).bind(this)
        )

    getFormFields: () ->
        if @props.action is 'update'
            return (
                <div>
                    {FF.updateEventHidden(@props.__eventData)}
                    {FF.editEventFields(@state.location_id, @catchHelTargetAll, @catchHelEventLangAll)}
                </div>
            )
        else
            return FF.editEventFields(@state.location_id, @catchHelTargetAll, @catchHelEventLangAll)

    render: ->
        sharedProps =
            layout: @state.layout
            validatePristine: @state.validatePristine
            disabled: @state.disabled


        <div className="row">
            <h2>Lisää uusi tapahtuma</h2>
            {@props.action}
            {@props.eventId}
            <div style={paddingBottom: "1em"}>
                Kielet
                <a
                    style={color: 'green'}
                    onClick={@toggleEn}
                >EN</a>
                |
                <a style={color: 'blue'} onClick={@toggleSv}>SV</a>
            </div>
            <Formsy.Form className="form-horizontal"
                         onSubmit={@preview}
                         onValid={@enableButton}
                         onInvalid={@disableButton}
                         ref="editForm"
                         >
                <legend>Tapahtuman kuvaus</legend>
                {@getFormFields()}
                <Row layout={@state.layout}>
                    <input
                        className="btn btn-primary"
                        type="submit" defaultValue="Siirry esikatseluun"
                    />
                </Row>
            </Formsy.Form>
        </div>


module.exports =
    EditorPage: EditorPage
