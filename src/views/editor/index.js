// styles
import 'style!vendor/stylesheets/typeahead.css';

// js
import typeahead from 'typeahead.js';

// react-specific
import Formsy from 'formsy-react';
import React from 'react';
import {History} from 'react-router';

import {
    Input,
    Textarea,
    Row
} from 'formsy-react-components';

// our components
import TU from 'src/typeahead.js';
import API from 'src/api.js';
import FF from 'src/formfields.js';

// === constants ===

// the backup doesn't support non-language links, so we use hardcoded
// 'fi' instead for the link language
var EXT_LINK_NO_LANGUAGE = 'fi';


// === code ===

var EditorPage = React.createClass({

    mixins: [History],

    getInitialState() {
        return {data: {},
        isPreview: false,
        isDone: false,
        layout: 'horizontal',
        apiErrorMsg: ''
        };
    },

    updateData(data) {
        return this.setState({
            data: data
        });
    },

    switchToPreview() {
        return this.setState({
            isPreview: true,
            isDone: false
        });
    },

    switchToEdit(event) {
        if (event) {
            event.preventDefault();
        }
        return this.setState({
            isPreview: false,
            isDone: false,
            apiErrorMsg: ''
        });
    },

    switchToDone() {
        return this.setState({
            isPreview: false,
            isDone: true
        });
    },

    convertDataToLEFormat(d) {

        // === offers ===
        if ('location_id' in d) {
            if (d.location_id.length > 0) {
                d['location'] = {'@id': d['location_id']};
            }
            delete d['location_id'];
        }

        // === offers ===
        d['offers'] = [{}];
        d['offers'][0]['info_url'] = {};
        d['offers'][0]['price'] = {};
        d['offers'][0]['description'] = {};

        d['offers'][0]['is_free'] = d['offers_is_free'];
        d['offers'][0]['info_url']['fi'] = d['offers_info_url_fi'];
        d['offers'][0]['info_url']['en'] = d['offers_info_url_en'];
        d['offers'][0]['info_url']['sv'] = d['offers_info_url_sv'];
        d['offers'][0]['price']['fi'] = d['offers_price_fi'];
        d['offers'][0]['price']['en'] = d['offers_price_en'];
        d['offers'][0]['price']['sv'] = d['offers_price_sv'];
        d['offers'][0]['description']['fi'] = d['offers_description_fi'];
        d['offers'][0]['description']['en'] = d['offers_description_en'];
        d['offers'][0]['description']['sv'] = d['offers_description_sv'];

        delete d['offers_is_free'];
        delete d['offers_info_url_fi'];
        delete d['offers_info_url_en'];
        delete d['offers_info_url_sv'];
        delete d['offers_price_fi'];
        delete d['offers_price_en'];
        delete d['offers_price_sv'];
        delete d['offers_description_fi'];
        delete d['offers_description_en'];
        delete d['offers_description_sv'];

        // === external links ===
        d['external_links'] = [];
        var iterable = ['extlink_twitter', 'extlink_facebook', 'extlink_instagram'];
        for (var i = 0, key; i < iterable.length; i++) {
            key = iterable[i];
            if (d.indexOf(key) >= 0) {
                var val = {};
                val['name'] = key;
                val['link'] = d['extlink_twitter'];
                val['language'] = EXT_LINK_NO_LANGUAGE;
                d['external_links'].push(val);
            }
            delete d[key];
        }

        // === pack hel_main, hel_target, and hel_event_lang into keywords ===
        d['keywords'] = [];

        // === hel_main ===
        if (d.hel_main) {
            for (var j = 0, val; j < d.hel_main.length; j++) {
                // TODO: implement
                val = d.hel_main[j];
                undefined;
            }
            delete d.hel_main;
        }

        // === hel_target ===
        if (d.hel_target) {
            for (var k = 0, val; k < d.hel_target.length; k++) {
                // TODO: implement
                val = d.hel_target[k];
                undefined;
            }
            delete d.hel_target;
        }

        // === hel_event_lang ===
        if (d.hel_event_lang) {
            for (var i1 = 0, val; i1 < d.hel_event_lang.length; i1++) {
                // TODO: implement
                val = d.hel_event_lang[i1];
                undefined;
            }
            delete d.hel_event_lang;
        }

        return d;
    },

    getLocation(d) {
        var ret = null;
        if ('location' in d && d['location']) {
            if ('@id' in d['location'] && d['location']['@id']) {
                $.ajax({
                    type: 'GET',
                    url: d['location']['@id'],
                    dataType: 'json',
                    complete(response) {
                        return ret = $.parseJSON(response.responseText);
                    },
                    async: false
                });
            }
        }
        return ret;
    },

    convertDataToGUIFormat(d) {

        var ret = {
            'event_status': d.event_status,
            'data_source': d.data_source,
            'publisher': d.publisher,
            'id': d.id
        };

        // simple fields
        var iterable = [
            'image'
        ];
        for (var i = 0, key; i < iterable.length; i++) {
            key = iterable[i];
            if (key in d) {
                ret[key] = d[key];
            }
        }

        // translateble fields
        var iterable1 = [
            'description',
            'headline',
            'info_url',
            'location_extra_info',
            'name',
            'short_description',
        ];
        for (var j = 0, field; j < iterable1.length; j++) {
            field = iterable1[j];
            if (field in d && d[field]) {
                var iterable2 = ['fi', 'sv', 'en'];
                for (var k = 0, lang; k < iterable2.length; k++) {
                    lang = iterable2[k];
                    if (lang in d[field]) {
                        ret[field + '_' + lang] = d[field][lang];
                    }
                }
            }
        }

        // location
        var loc = this.getLocation(d);
        if (loc) {
            ret.location_id = loc.id;
            ret.__location_search_field = loc.name.fi;
        }

        // time fields / initial fields
        if (d.start_time) {
            ret.__start_time_date = API.formatDate(d.start_time);
            ret.__start_time_time = API.formatTime(d.start_time);
        }
        if (d.end_time) {
            ret.__end_time_date = API.formatDate(d.end_time);
            ret.__end_time_time = API.formatTime(d.end_time);
        }

        // offers
        // TODO: rewrite this to add support for multiple offers
        if (d.offers && d.offers.length > 0) {
            if (d.offers.length > 1) {
                var err = new Error('Multiple offers not supported');
                alert(Error(err));
                throw err;
            } else {
                var offer = d.offers[0];
                ret.offers_is_free = offer.is_free;
                var iterable3 = [
                    'price',
                    'description',
                    'info_url',
                ];
                for (var i1 = 0, field; i1 < iterable3.length; i1++) {
                    field = iterable3[i1];
                    if (field in offer && offer[field]) {
                        var iterable4 = ['fi', 'sv', 'en'];
                        for (var i2 = 0, lang; i2 < iterable4.length; i2++) {
                            lang = iterable4[i2];
                            if (lang in offer[field]) {
                                key = 'offers_' + field + '_' + lang;
                                ret[key] = offer[field][lang];
                            }
                        }
                    }
                }
            }
        }

        // external links
        if (d.external_links) {
            ret['external_links'] = d.external_links;
        }

        return ret;
    },

    postEventData(event) {
        this.setState({
            apiErrorMsg: ''
        });

        event.preventDefault();
        var d = this.state.data;
        d.start_time = API.getStartTime(d);
        d.end_time = API.getEndTime(d);

        // prune out the tmp fields
        for (var k in d) {
            var v = d[k];
            if (k.startsWith('__')) {
                delete d[k];
            }
        }

        d = this.convertDataToLEFormat(d);

        // are we updating or creating a new event?
        if (this.props.params.action === 'update') {
            var url = this.props.params.eventId;
            var method = 'PUT';
            d['id'] = this.state.data.id;
        } else {
            url = `${appSettings.api_base}/event/`;
            method = 'POST';
        }

        var handler = (function(result) { return console.log('success'); }).bind(this);

        return $.ajax({
            contentType: 'application/json',
            type: method,
            url: url,
            crossDomain: true,
            data: JSON.stringify(d),
            dataType: 'json',
        })
        .done( (function() {
            console.log('done');
            return this.switchToDone();
        }
        ).bind(this)
        .fail( (function(data) {
            console.log('fail');
            return this.setState({
                apiErrorMsg: JSON.stringify(data)
            });
        }
        ).bind(this)
        )
        );
    },

    componentDidMount() {

        if (this.props.params.action === 'update') {
            var url = this.props.params.eventId + '?format=json';
            return $.getJSON(url)
            .done((function(data) {
                this.updateData(this.convertDataToGUIFormat(data));
                this.switchToPreview();
                return this.switchToEdit();
            }
            ).bind(this))
            .fail(function(data) {
                return this.setState({
                    apiErrorMsg: JSON.stringify(data)
                });
            }
            );
        }
    },

    componentDidUpdate(prevProps, prevState) {

        // populate form data if we're returning form preview to edit mode
        if (this.refs.formContainer && (!this.state.isPreview && prevState.isPreview)) {
            return this.refs.formContainer.resetData(this.state.data);
        }
    },

    render() {
        if (this.state.isPreview) {
            if (this.state.apiErrorMsg && this.state.apiErrorMsg.length > 0) {
                let errorStyle = { color: 'red !important' };
                var err = (
                    <span style={errorStyle}>
                        {this.state.apiErrorMsg}
                    </span>
                );
            }
            return (
                <div>
                    <h2>Vahvista tapahtuman tallennus</h2>
                    <Formsy.Form
                        className="form-horizontal"
                        ref="previewForm"
                    >
                        <Input
                            name="ignore"
                            value={this.state.data.headline_fi}
                            label="Otsikko"
                            type="text"
                            disabled
                        />
                        <Input
                            name="ignore2"
                            value={this.state.data.__location_search_field}
                            label="Paikka"
                            type="text"
                            disabled
                        />
                        <Input
                            name="ignore3"
                            value={API.getStartTime(this.state.data)}
                            label="Alkuaika"
                            type="text"
                            disabled
                        />
                        <Textarea
                            name="ignore4"
                            rows={8}
                            cols={40}
                            label="Kaikki tapahtuman tiedot JSON-muodossa"
                            value={JSON.stringify(this.state.data)}
                            disabled
                        />
                        {err}
                        <Row layout={this.state.layout}>
                            <input
                                className="btn btn-default"
                                type="submit"
                                defaultValue="Muokkaa tietoja"
                                onClick={this.switchToEdit}
                            />
                            &nbsp;
                            <input
                                className="btn btn-primary"
                                type="submit"
                                onClick={this.postEventData}
                                defaultValue="Lähetä tiedot LinkedEvents-tietokantaan"
                            />
                        </Row>
                    </Formsy.Form>
                </div>
            )
        } else if (this.state.isDone) {
            return (
                <div>
                    Tapahtuman tiedot tallennettu.
                </div>
            )
        } else {
            return (
                <div>
                    <EditEventForm
                        eventId={this.props.params.eventId}
                        switchToPreview={this.switchToPreview}
                        updateData={this.updateData}
                        ref="formContainer"
                        __eventData={this.state.data}
                        action={this.props.params.action}
                    />
                </div>
            )
        }
    }
});


var EditEventForm = React.createClass({

    getInitialState() {
        return {canSubmit: false,
        layout: 'horizontal',
        validatePristine: false,
        disabled: false,
        location_id: '',
        enStyle: {display: 'none', color: 'green !important'},
        svStyle: {display: 'none', color: 'blue !important'}
        };
    },

    componentDidUpdate() {
        // @trackActionChanges()

        // set up typeahead

        var taOptions = {
            hint: true,
            highlight: true,
            minLength: 1
        };

        var taDatasets = {
            limit: 25,
            display: 'value',
            templates: {
                suggestion(model) {
                   return '<div><class="place_name">' +
                   model.value +
                   '</span><br><span class="place_address">' +
                   model.street_address +
                   '</span></div>';
                },
                empty(d) {
                    return '<p class="repo-name">No Matches</p>';
                }
            },
            source: TU.bloodhoundInstance.ttAdapter()
        };

        var taSelectHandler = (function(evt, item) {
            this.setState({
                location_id: item.id
            });
            return this.refs.__location_search_field.value = item.value;
        }
        ).bind(this);

        var taEm = $('#__location_search_field');
        taEm.typeahead(taOptions, taDatasets);
        return taEm.on('typeahead:selected', taSelectHandler);
    },

    enableButton() {
        return this.setState({
            canSubmit: true
        });
    },

    disableButton() {
        return this.setState({
            canSubmit: false
        });
    },

    preview(data) {
        data.__location_search_field = this.refs.__location_search_field.value;
        this.props.updateData(data);
        return this.props.switchToPreview();
    },

    resetData(data) {
        // called eg. after we return from preview back to editing the event
        this.refs.editForm.reset(data);
        return this.refs.__location_search_field.value = data.__location_search_field;
    },

    toggleEn() {
        var style = $.extend({}, this.state.enStyle);
        style.display  = style.display === 'none' ? 'inline' : 'none';
        return this.setState({
            enStyle: style
        });
    },

    toggleSv() {
        var style = $.extend({}, this.state.svStyle);
        style.display  = style.display === 'none' ? 'inline' : 'none';
        return this.setState({
            svStyle: style
        });
    },

    checkAndUncheckAll(cbGroup, allKey, newValues, getEveryItemFunc) {
        var oldValues = cbGroup.getValue();

        // uncheck every item, if 'all' is unchecked
        if ((oldValues.indexOf(allKey) >= 0) && (newValues.indexOf(allKey) < 0)) {
            newValues = [];

        // uncheck 'all', if any other items are unchecked
        } else if ((oldValues.indexOf(allKey) >= 0) && (newValues.length < oldValues.length)) {
            newValues = newValues.filter(function(item) { return item !== allKey; });

        // check every item, if 'all' is checked
        } else if ((newValues.indexOf(allKey) >= 0) && (oldValues.indexOf(allKey) < 0)) {
            newValues = getEveryItemFunc();
        }

        return cbGroup.setValue(newValues);
    },

    checkAndUncheckAllV2(cbGroup, noneKey, newValues, getEveryItemFunc) {
        var oldValues = cbGroup.getValue();

        // uncheck every item, if 'none' is checked
        if ((newValues.indexOf(noneKey) >= 0) && (oldValues.indexOf(noneKey) < 0)) {
            newValues = [noneKey];

        // uncheck 'none', if any other items are checked
        } else if ((oldValues.indexOf(noneKey) >= 0) && (newValues.length > oldValues.length)) {
            newValues = newValues.filter(function(item) { return item !== noneKey; });
        }

        return cbGroup.setValue(newValues);
    },

    catchHelTargetAll(emName, newValues) {
        return this.checkAndUncheckAllV2(this.refs.helTarget, 'all', newValues, function() {
            var result = [];
            for (var i = 0, obj; i < FF.helTargetOptions.length; i++) {
                obj = FF.helTargetOptions[i];
                result.push(obj.value);
            }
            return result;
        }).bind(this);
    },

    catchHelEventLangAll(emName, newValues) {
        return this.checkAndUncheckAll(this.refs.helEventLang,'all',newValues, function() {
            var result = [];
            for (var i = 0, obj; i < FF.helEventLangOptions.length; i++) {
                obj = FF.helEventLangOptions[i];
                result.push(obj.value);
            }
            return result;
        }).bind(this);
    },

    getFormFields() {
        if (this.props.action === 'update') {
            return (
                <div>
                    {FF.updateEventHidden(this.props.__eventData)}
                    {FF.editEventFields(this.state.location_id, this.catchHelTargetAll, this.catchHelEventLangAll)}
                </div>
            );
        } else {
            return FF.editEventFields(this.state.location_id, this.catchHelTargetAll, this.catchHelEventLangAll);
        }
    },

    render() {
        var sharedProps = {
            layout: this.state.layout,
            validatePristine: this.state.validatePristine,
            disabled: this.state.disabled
        };

        // TODO: move to scss
        let paddingStyle = { paddingBottom: "1em" };
        let greenStyle = {color: 'green'};
        let blueStyle = {color: 'blue'};


        return (
            <div className="row">
                <h2>Lisää uusi tapahtuma</h2>
                {this.props.action}
                {this.props.eventId}
                <div style={paddingStyle}>
                    Kielet
                    <a style={greenStyle} onClick={this.toggleEn}>EN</a> |
                    <a style={blueStyle} onClick={this.toggleSv}>SV</a>
                </div>
                <Formsy.Form className="form-horizontal"
                             onSubmit={this.preview}
                             onValid={this.enableButton}
                             onInvalid={this.disableButton}
                             ref="editForm"
                             >
                    <legend>Tapahtuman kuvaus</legend>
                    {this.getFormFields()}
                    <Row layout={this.state.layout}>
                        <input
                            className="btn btn-primary"
                            type="submit" defaultValue="Siirry esikatseluun"
                        />
                    </Row>
                </Formsy.Form>
            </div>
        )
    }
});


export default EditorPage;
