# styles
require 'style!../vendor/stylesheets/typeahead.css'

# jquery
$ = require 'jquery'
window.jQuery = $

# js
bootstrap = require 'bootstrap'
typeahead = require 'typeahead.js'

# react-specific
DateRangePicker = require 'react-bootstrap-daterangepicker'
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
TU = require './typeahead.cjsx'
API = require './api.cjsx'
Editor = require './editor.cjsx'


# === code ===

AddEvent = React.createClass

    mixins: [Router.History]

    getInitialState: ->
        data: {}
        isPreview: false
        layout: 'horizontal'
        apiErrorMsg: ''

    updateData: (data) ->
        @setState
            data: data
    
    switchToPreview: ->
        @setState
            isPreview: true 

    switchToEdit: (event) ->
        event.preventDefault()
        @setState
            isPreview: false
            apiErrorMsg: ''


    postEventData: (event) ->
        @setState
            apiErrorMsg: ''

        event.preventDefault()
        d = @state.data
        d.start_time = API.getStartTime(d)
        d.end_time = API.getEndTime(d)

        # prune out the tmp fields
        for key in d
            if key.startsWith('__')
                delete d[key]

        $.post("#{appSettings.api_base}/event/", d, ((result) ->
            console.log 'success'
        ).bind(this))
        .done (() ->
            console.log 'done'
            @history.pushState(null, 'search')
        )
        .fail ((data) ->
            console.log 'fail'
            @setState
                apiErrorMsg: JSON.stringify(data)
        ).bind(this)

    componentDidUpdate: (prevProps, prevState) ->
        # populate form data if we're returning form preview to edit mode
        if (!@state.isPreview && prevState.isPreview)
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
        <div>
            <AddEventForm
                switchToPreview={@switchToPreview} 
                updateData={@updateData}
                ref="formContainer"
            />
        </div>


AddEventForm = React.createClass

    getInitialState: ->
        canSubmit: false
        layout: 'horizontal'
        validatePristine: false
        disabled: false
        helMainOptions: API.loadHelMainOptions()
        helTargetOptions: API.loadHelTargetOptions()
        helEventLangOptions: API.loadHelEventLangOptions()
        location_id: ''
        enStyle: {display: 'none', color: 'green !important'}
        svStyle: {display: 'none', color: 'blue !important'}

    componentDidUpdate: ->
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

    catchHelTargetAll: (emName, newValues) ->
        @checkAndUncheckAll(
            @refs.helTarget,
            'all',
            newValues,
            (() -> (obj.value for obj in @state.helTargetOptions)).bind(this)
        )

    catchHelEventLangAll: (emName, newValues) ->
        @checkAndUncheckAll(
            @refs.helEventLang,
            'all',
            newValues,
            (() -> (obj.value for obj in @state.helEventLangOptions)).bind(this)
        )

    render: ->
        sharedProps = 
            layout: @state.layout
            validatePristine: @state.validatePristine
            disabled: @state.disabled
        <div className="row">
            <h2>Lisää uusi tapahtuma</h2>
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
                <fieldset>
                    <legend>Tapahtuman kuvaus</legend>
                    <Input
                        {...sharedProps}
                        name="headline_fi"
                        id="headline_fi"
                        ref="headlineFi"
                        value=""
                        label="Otsikko"
                        type="text"
                        placeholder=""
                        autoFocus
                        required
                    />
                    <span style={@state.enStyle}>
                        <Input
                            {...sharedProps}
                            name="headline_en"
                            id="headline_en"
                            value=""
                            label="Otsikko [en]"
                            type="text"
                            placeholder=""
                        />
                    </span>
                    <span style={@state.svStyle}>
                        <Input
                            {...sharedProps}
                            name="headline_sv"
                            id="headline_sv"
                            value=""
                            label="Otsikko [sv]"
                            type="text"
                            placeholder=""
                        />
                    </span>
                    <Input
                        {...sharedProps}
                        name="secondary_headline_fi"
                        id="secondary_headline_fi"
                        value=""
                        label="Toissijainen otsikko"
                        type="text"
                        placeholder=""
                    />
                    <span style={@state.enStyle}>
                        <Input
                            {...sharedProps}
                            name="secondary_headline_en"
                            id="secondary_headline_en"
                            value=""
                            label="Toissijainen otsikko [en]"
                            type="text"
                            placeholder=""
                        />
                    </span>
                    <span style={@state.svStyle}>
                        <Input
                            {...sharedProps}
                            name="secondary_headline_sv"
                            id="secondary_headline_sv"
                            value=""
                            label="Toissijainen otsikko [sv]"
                            type="text"
                            placeholder=""
                        />
                    </span>
                    <Textarea
                        {...sharedProps}
                        rows={3}
                        cols={40}
                        name="short_description_fi"
                        label="Lyhyt kuvaus"
                        placeholder="Tähän kenttään voit syöttää korkeintaan
                            140 merkkiä."
                        help="Tapahtuman lyhyt kuvaus."
                        validations="maxLength:140"
                        validationErrors={{
                            maxLength: 'Syötäthän tähän kenttään korkeintaan
                                140 merkkiä.'
                        }}
                    />
                    <span style={@state.enStyle}>
                        <Textarea
                            {...sharedProps}
                            rows={3}
                            cols={40}
                            name="short_description_en"
                            label="Lyhyt kuvaus [en]"
                            placeholder="Tähän kenttään voit syöttää korkeintaan
                                140 merkkiä."
                            help="Tapahtuman lyhyt kuvaus."
                            validations="maxLength:140"
                            validationErrors={{
                                maxLength: 'Syötäthän tähän kenttään korkeintaan
                                    140 merkkiä.'
                            }}
                        />
                    </span>
                    <span style={@state.svStyle}>
                        <Textarea
                            {...sharedProps}
                            rows={3}
                            cols={40}
                            name="short_description_sv"
                            label="Lyhyt kuvaus [sv]"
                            placeholder="Tähän kenttään voit syöttää korkeintaan
                                140 merkkiä."
                            help="Tapahtuman lyhyt kuvaus."
                            validations="maxLength:140"
                            validationErrors={{
                                maxLength: 'Syötäthän tähän kenttään korkeintaan
                                    140 merkkiä.'
                            }}
                        />
                    </span>
                    <Textarea
                        {...sharedProps}
                        rows={3}
                        cols={40}
                        name="description_fi"
                        label="Kuvaus"
                        placeholder=""
                        help="Tapahtuman pitkä kuvaus, kerro tapahtumastasi
                            yksityiskohtaisemmin."
                    />
                    <span style={@state.enStyle}>
                        <Textarea
                            {...sharedProps}
                            rows={3}
                            cols={40}
                            name="description_en"
                            label="Kuvaus [en]"
                            placeholder=""
                            help="Tapahtuman pitkä kuvaus, kerro tapahtumastasi
                                yksityiskohtaisemmin."
                        />
                    </span>
                    <span style={@state.svStyle}>
                        <Textarea
                            {...sharedProps}
                            rows={3}
                            cols={40}
                            name="description_sv"
                            label="Kuvaus [sv]"
                            placeholder=""
                            help="Tapahtuman pitkä kuvaus, kerro tapahtumastasi
                                yksityiskohtaisemmin."
                        />
                    </span>
                    <Input
                        {...sharedProps}
                        name="info_url_fi"
                        id="info_url_fi"
                        value=""
                        label="Tapahtuman kotisivu"
                        type="url"
                        placeholder=""
                        help="Linkki tapahtuman kotisivulle, lisää alkuun
                            http://"
                    />
                    <span style={@state.enStyle}>
                        <Input
                            {...sharedProps}
                            name="info_url_en"
                            id="info_url_en"
                            value=""
                            label="Tapahtuman kotisivu [en]"
                            type="url"
                            placeholder=""
                            help="Linkki tapahtuman kotisivulle, lisää alkuun
                                http://"
                        />
                    </span>
                    <span style={@state.svStyle}>
                        <Input
                            {...sharedProps}
                            name="info_url_sv"
                            id="info_url_sv"
                            value=""
                            label="Tapahtuman kotisivu [sv]"
                            type="url"
                            placeholder=""
                            help="Linkki tapahtuman kotisivulle, lisää alkuun
                                http://"
                        />
                    </span>
                </fieldset>
                <fieldset>
                    <legend>Tapahtuman ajankohta</legend>
                    <Input
                        {...sharedProps}
                        name="__start_time_date"
                        value=""
                        label="Alkamispäivämäärä"
                        type="date"
                        placeholder=""
                        required
                    />
                    <Input
                        {...sharedProps}
                        name="__start_time_time"
                        value=""
                        label="Alkamisajankohta"
                        type="time"
                        placeholder=""
                    />
                    <Input
                        {...sharedProps}
                        name="__end_time_date"
                        value=""
                        label="Päättymispäivämäärä"
                        type="date"
                        placeholder=""
                    />
                    <Input
                        {...sharedProps}
                        name="__end_time_time"
                        value=""
                        label="Päättymisajankohta"
                        type="time"
                        placeholder=""
                    />
                </fieldset>
                <fieldset>
                    <legend>Tapahtumapaikka</legend>
                    Aloita kirjoittamaan kenttään tapahtumapaikan nimen alkua
                    ja valitse oikea paikka alle ilmestyvästä listasta. Jos
                    et löydä paikkaa tällä tavoin, kirjoita tapahtumapaikka
                    lisätietokenttään.
                    <div className="form-group row">
                        <label className="control-label col-sm-3">
                            Paikka
                        </label>
                        <div className="col-sm-9" id="scrollable-dropdown-menu">
                            <input
                                type="text"
                                placeholder="Hae paikkaa..."
                                name="__location_search_field"
                                data-trigger="hover"
                                data-placement="top"
                                data-toggle="popover"
                                id="__location_search_field"
                                ref="__location_search_field"
                                className="typeahead form-control tt-input"
                                data-original-title=""
                                title=""
                                autoComplete="off"
                                spellCheck="false"
                                dir="auto"
                                style={
                                    position: 'relative';
                                    verticalAlign: 'top';
                                    backgroundColor: 'transparent';
                                }
                            />
                        </div>
                    </div>
                    <Input
                        {...sharedProps}
                        name="location_id"
                        id="location_id"
                        value={@state.location_id}
                        label="Paikan ID"
                        type="text"
                        placeholder=""
                        disabled
                    />
                    <Textarea
                        {...sharedProps}
                        rows={3}
                        cols={40}
                        name="location_extra_info_fi"
                        label="Paikan lisätiedot"
                        placeholder=""
                        help=""
                    />
                    <span style={@state.enStyle}>
                        <Textarea
                            {...sharedProps}
                            rows={3}
                            cols={40}
                            name="location_extra_info_en"
                            label="Paikan lisätiedot [en]"
                            placeholder=""
                            help=""
                        />
                    </span>
                    <span style={@state.svStyle}>
                        <Textarea
                            {...sharedProps}
                            rows={3}
                            cols={40}
                            name="location_extra_info_sv"
                            label="Paikan lisätiedot [sv]"
                            placeholder=""
                            help=""
                        />
                    </span>
                </fieldset>
                <fieldset>
                    <legend>Hintatiedot</legend>
                    Valitse onko tapahtumaan vapaa pääsy tai lisää tapahtuman
                    hinta tekstimuodossa (esim. 5€/7€). Voit lisätä
                    lisätietoja tapahtuman lipunmyynnistä, paikkavarauksista
                    jne. Lisää myös mahdollinen linkki lipunmyyntiin.
                    <Checkbox
                        {...sharedProps}
                        name="offers_is_free"
                        value={false}
                        label=""
                        rowLabel="Maksuton"
                    />
                    <Input
                        {...sharedProps}
                        name="offers_price"
                        id="offers_price_fi"
                        value=""
                        label="Hinta"
                        type="text"
                        placeholder=""
                    />
                    <span style={@state.enStyle}>
                        <Input
                            {...sharedProps}
                            name="offers_price"
                            id="offers_price_en"
                            value=""
                            label="Hinta [en]"
                            type="text"
                            placeholder=""
                        />
                    </span>
                    <span style={@state.svStyle}>
                        <Input
                            {...sharedProps}
                            name="offers_price"
                            id="offers_price_sv"
                            value=""
                            label="Hinta [sv]"
                            type="text"
                            placeholder=""
                        />
                    </span>
                    <Textarea
                        {...sharedProps}
                        rows={3}
                        cols={40}
                        name="offers_description_fi"
                        label="Hintatietojen kuvaus"
                        placeholder=""
                        help="Kerro tässä, jos tapahtumaan on
                              ennakkoilmoittautuminen."
                    />
                    <span style={@state.enStyle}>
                        <Textarea
                            {...sharedProps}
                            rows={3}
                            cols={40}
                            name="offers_description_en"
                            label="Hintatietojen kuvaus [en]"
                            placeholder=""
                            help=""
                        />
                    </span>
                    <span style={@state.svStyle}>
                        <Textarea
                            {...sharedProps}
                            rows={3}
                            cols={40}
                            name="offers_description_sv"
                            label="Hintatietojen kuvaus [sv]"
                            placeholder=""
                            help=""
                        />
                    </span>
                    <Input
                        {...sharedProps}
                        name="offers_info_url_fi"
                        id="offers_info_url_fi"
                        value=""
                        label="Linkki lipunmyyntiin"
                        type="text"
                        placeholder=""
                    />
                    <span style={@state.enStyle}>
                        <Input
                            {...sharedProps}
                            name="offers_info_url_en"
                            id="offers_info_url_en"
                            value=""
                            label="Linkki lipunmyyntiin [en]"
                            type="text"
                            placeholder=""
                        />
                    </span>
                    <span style={@state.svStyle}>
                        <Input
                            {...sharedProps}
                            name="offers_info_url_sv"
                            id="offers_info_url_sv"
                            value=""
                            label="Linkki lipunmyyntiin [sv]"
                            type="text"
                            placeholder=""
                        />
                    </span>
                </fieldset>
                <fieldset>
                    <legend>Muut lisätiedot</legend>
                    <Input
                        {...sharedProps}
                        name="image"
                        id="image"
                        value=""
                        label="Tapahtuman kuva"
                        type="url"
                        placeholder=""
                        help="Kuvan osoite eli URL, lisää alkuun http://. 
                            Kuvan enimmäismitoiksi suositellaan 1080x720 px ja
                            enimmäiskooksi 500 Kt. Varmistathan myös
                            tekijänoikeudet!"
                    />
                    <Input
                        {...sharedProps}
                        name="extlink_facebook"
                        id="extlink_facebook"
                        value=""
                        label="Facebook"
                        type="url"
                        placeholder=""
                        help=""
                    />
                    <Input
                        {...sharedProps}
                        name="extlink_instagram"
                        id="extlink_instagram"
                        value=""
                        label="Instagram"
                        type="url"
                        placeholder=""
                        help=""
                    />
                    <Input
                        {...sharedProps}
                        name="extlink_twitter"
                        id="extlink_twitter"
                        value=""
                        label="Twitter"
                        type="url"
                        placeholder=""
                        help=""
                    />
                </fieldset>
                <fieldset>
                    <legend>Helsingin kaupungin luokittelutiedot</legend>
                    <CheckboxGroup
                        {...sharedProps}
                        name="hel_main"
                        value={[]}
                        label="Pääkategoria"
                        help="Määrittele, mihin kategoriaan tapahtuna kuuluu
                            hel.fi-sivustolla."
                        options={@state.helMainOptions}
                        multiple
                    />
                    <CheckboxGroup
                        {...sharedProps}
                        name="hel_target"
                        ref="helTarget"
                        value={[]}
                        label="Kohderyhmät"
                        help="Määrittele, mille erityiskohderyhmille tapahtuma
                            on suunnattu hel.fi-sivustolla. Voit valita
                            useampia."
                        options={@state.helTargetOptions}
                        onChange={@catchHelTargetAll}
                        multiple
                    />
                    <CheckboxGroup
                        {...sharedProps}
                        name="hel_event_lang"
                        ref="helEventLang"
                        value={[]}
                        label="Tapahtuman kielet"
                        help="Valitse tapahtuman kielet. Esimerkiksi
                            suomenkielisen teatteriesityksen kohdalla
                            valitaan vain Suomi, valokuvanäyttelyn kohdalla
                            voidaan valita kaikki kielet."
                        options={@state.helEventLangOptions}
                        onChange={@catchHelEventLangAll}
                        multiple
                    />
                </fieldset>
                <Row layout={@state.layout}>
                    <input
                        className="btn btn-primary"
                        type="submit" defaultValue="Siirry esikatseluun"
                    />
                </Row>
            </Formsy.Form>
        </div>


module.exports =
    AddEvent: AddEvent
