// react-specific
import React from 'react';
import  {
    Input,
    Textarea,
    Select,
    Checkbox,
    CheckboxGroup,
    RadioGroup,
    Row
} from 'formsy-react-components';

// // aliases
// var Input = FRC.Input;
// var Textarea = FRC.Textarea;
// var Select = FRC.Select;
// var Checkbox = FRC.Checkbox;
// var CheckboxGroup = FRC.CheckboxGroup;
// var RadioGroup = FRC.RadioGroup;
// var Row = FRC.Row;

// our components
import API from './api.js';

// constants
const sharedProps = {
    layout: 'horizontal',
    validatePristine: false,
    disabled: false
};

const enStyle = {
    display: 'none',
    color: 'green !important'
};

const svStyle = {
    display: 'none',
    color: 'blue !important'
};

// options
let helMainOptions = API.loadHelMainOptions();
let helTargetOptions = API.loadHelTargetOptions();
let helEventLangOptions = API.loadHelEventLangOptions();

let transparentStyle = {
    position: 'relative',
    verticalAlign: 'top',
    backgroundColor: 'transparent'
};

let editEventFields = function(location_id, catchHelTargetAll, catchHelEventLangAll) {
    return (<div>
        <Input
            type="hidden"
            name="event_status"
            value="EventScheduled"
        />
        <fieldset>
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
            <span style={enStyle}>
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
            <span style={svStyle}>
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
            <Textarea
                {...sharedProps}
                rows={3}
                cols={40}
                name="short_description_fi"
                label="Lyhyt kuvaus"
                placeholder="Tähän kenttään voit syöttää korkeintaan 140 merkkiä."
                help="Tapahtuman lyhyt kuvaus."
                validations="maxLength:140"
                validationErrors={{
                    maxLength: 'Syötäthän tähän kenttään korkeintaan 140 merkkiä.'
                }}
                required
            />
            <span style={enStyle}>
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
                        maxLength: 'Syötäthän tähän kenttään korkeintaan 140 merkkiä.'
                    }}
                />
            </span>
            <span style={svStyle}>
                <Textarea
                    {...sharedProps}
                    rows={3}
                    cols={40}
                    name="short_description_sv"
                    label="Lyhyt kuvaus [sv]"
                    placeholder="Tähän kenttään voit syöttää korkeintaan 140 merkkiä."
                    help="Tapahtuman lyhyt kuvaus."
                    validations="maxLength:140"
                    validationErrors={{
                        maxLength: 'Syötäthän tähän kenttään korkeintaan 140 merkkiä.'
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
                required
            />
            <span style={enStyle}>
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
            <span style={svStyle}>
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
            <span style={enStyle}>
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
            <span style={svStyle}>
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
            <legend>Tapahtuman kuva</legend>
            <Input
                {...sharedProps}
                name="image"
                id="image"
                value=""
                label="Linkki kuvaan"
                type="url"
                placeholder=""
                help="Kuvan osoite eli URL, lisää alkuun http://.
                    Kuvan enimmäismitoiksi suositellaan 1080x720 px ja
                    enimmäiskooksi 500 Kt. Varmistathan myös
                    tekijänoikeudet!"
            />
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
                label="Alkamisaika"
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
                label="Päättymisaika"
                type="time"
                placeholder=""
            />
        </fieldset>
        <fieldset>
            <legend>Tapahtumapaikka</legend>
            Aloita kirjoittamaan kenttään tapahtumapaikan nimen alkua
            ja valitse oikea paikka alle ilmestyvästä listasta. Jos
            et löydä paikkaa tällä tavoin, kirjoita tapahtumapaikka
            tai osoite lisätietokenttään.
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
                        style={ transparentStyle }
                    />
                </div>
            </div>
            <Input
                {...sharedProps}
                name="location_id"
                id="location_id"
                value={location_id}
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
            <span style={enStyle}>
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
            <span style={svStyle}>
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
                name="offers_price_fi"
                id="offers_price_fi"
                value=""
                label="Hinta"
                type="text"
                placeholder=""
            />
            <span style={enStyle}>
                <Input
                    {...sharedProps}
                    name="offers_price_en"
                    id="offers_price_en"
                    value=""
                    label="Hinta [en]"
                    type="text"
                    placeholder=""
                />
            </span>
            <span style={svStyle}>
                <Input
                    {...sharedProps}
                    name="offers_price_sv"
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
            <span style={enStyle}>
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
            <span style={svStyle}>
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
                type="url"
                placeholder=""
            />
            <span style={enStyle}>
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
            <span style={svStyle}>
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
            <legend>Tapahtuma sosiaalisessa mediassa</legend>
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
            <legend>Tapahtuman luokittelu</legend>
            <CheckboxGroup
                {...sharedProps}
                name="hel_main"
                value={[]}
                label="Hel.fi-pääkategoria"
                help="Määrittele, mihin kategoriaan tapahtuna kuuluu
                    hel.fi-sivustolla."
                options={helMainOptions}
                multiple
                required
            />
            <CheckboxGroup
                {...sharedProps}
                name="hel_target"
                ref="helTarget"
                value={[]}
                label="Hel.fi-kohderyhmät"
                help="Määrittele, mille erityiskohderyhmille tapahtuma
                    on suunnattu hel.fi-sivustolla. Voit valita
                    useampia."
                options={helTargetOptions}
                onChange={catchHelTargetAll}
                multiple
                required
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
                options={helEventLangOptions}
                onChange={catchHelEventLangAll}
                multiple
            />
        </fieldset>
        </div>
    )
};

let updateEventHidden = function(eventData) {
    return (
        <div>
            <Input
                type="hidden"
                name="data_source"
                value={eventData.data_source}
            />
            <Input
                type="hidden"
                name="publisher"
                value={eventData.publisher}
            />
            <Input
                type="hidden"
                name="id"
                value={eventData.id}
                />
        </div>
    )
};

export default {
    editEventFields: editEventFields,
    updateEventHidden: updateEventHidden,
    helTargetOptions: helTargetOptions,
    helEventLangOptions: helEventLangOptions
}
