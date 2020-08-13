import './HelSelect.scss'

import React, {Fragment, useRef, useEffect} from 'react'
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async'
import {createFilter} from 'react-select'
import {setData as setDataAction} from '../../actions/editor'
import {connect} from 'react-redux'
import {get, isNil} from 'lodash'
import ValidationPopover from '../ValidationPopover'
import client from '../../api/client'
import {injectIntl} from 'react-intl'
import {getStringWithLocale} from '../../utils/locale';

const HelSelect = ({
    intl,
    setData,
    isClearable,
    isMultiselect,
    name,
    setDirtyState,
    resource,
    legend,
    selectedValue,
    validationErrors,
    placeholderId,
    customOnChangeHandler,
    optionalWrapperAttributes,
    currentLocale,
    required,
})  => {
    const labelRef = useRef(null)
    const selectInputRef = useRef(null)

    // react-select doesnt support attributes aria-required or required
    // this is a workaround way to add aria-required to react-select
    useEffect(() => {
        if (required && selectInputRef.current) {
            selectInputRef.current.select.select.inputRef.setAttribute('aria-required', 'true');
        }
    }, [selectInputRef.current, required])
    
    const onChange = (value) => {
        // let the custom handler handle the change if given
        if (typeof customOnChangeHandler === 'function') {
            customOnChangeHandler(value)
        // otherwise set data
        } else {
            if (isNil(value)) {
                setData({[name]: null})
            } else {
                if (name === 'keywords') {
                    setData({[name]: value})
                }
                if (name === 'location') {
                    setData({[name]: {
                        name: value.names,
                        id: value.value,
                        '@id': value['@id'],
                        position: value.position,
                    }})
                }
            }
        }

        if (setDirtyState) {
            setDirtyState()
        }
    }

    const getKeywordOptions = async (input) => {
        const queryParams = {
            show_all_keywords: 1,
            data_source: 'yso',
            text: input,
        }

        try {
            const response = await client.get(`${resource}`, queryParams)
            const options = response.data.data

            return options.map((item) => {
                return ({
                    value: item['@id'],
                    label: getStringWithLocale(item,'name', currentLocale || intl.locale),
                    n_events: item.n_events,
                    name: item.name,
                })
            })
        } catch (e) {
            throw Error(e)
        }
    }

    const getLocationOptions = async (input) => {
        const queryParams = {
            show_all_places: 1,
            text: input,
        }

        try {
            const response = await client.get(`${resource}`, queryParams)
            const options = response.data.data

            return options.map(item => {
                let previewLabel = get(item, ['name', 'fi'], '')
                let itemNames = get(item, 'name', '')
                let names = {}
                const keys = Object.keys(itemNames)

                keys.forEach(lang => {
                    names[`${lang}`] = `${itemNames[`${lang}`]}`;
                });

                if (item.data_source !== 'osoite' && item.street_address) {
                    const address = getStringWithLocale(item,'street_address', currentLocale || intl.locale)

                    previewLabel = `${itemNames[`${intl.locale}`] || itemNames.fi} (${address})`;
                    keys.forEach(lang => {
                        names[`${lang}`] = `${itemNames[`${lang}`]} (${getStringWithLocale(item, 'street_address',`${lang}`)})`;
                    });
                }

                return {
                    label: previewLabel,
                    value: item.id,
                    '@id': `/v1/${resource}/${item.id}/`,
                    id: item.id,
                    n_events: item.n_events,
                    position: item.position,
                    names: names,
                }
            })
        } catch (e) {
            throw Error(e)
        }
    }

    const getOptions = async (input) => {
        if (name === 'keywords') {
            return getKeywordOptions(input)
        }
        if (name === 'location') {
            return getLocationOptions(input)
        }
    }

    const getDefaultValue = () => {
        if (!selectedValue || Object.keys(selectedValue).length === 0) {
            return null
        }
        if (name === 'keywords') {
            return selectedValue.map((item) => {
                return ({
                    label: getStringWithLocale(item,'label', currentLocale || intl.locale),
                    value: item.value,
                })
            })
        }
        if (name === 'location') {
            return ({
                label: getStringWithLocale(selectedValue,'name', currentLocale || intl.locale),
                value: selectedValue.id,
            })
        }
    }

    const formatOption = (item) => (
        <React.Fragment>
            {item.label}
            {item && typeof item.n_events === 'number' &&
                <small>
                    <br/>
                    {intl.formatMessage(
                        {id: `format-select-count`},
                        {count: item.n_events}
                    )}
                </small>
            }
        </React.Fragment>
    )

    const filterOptions = (candidate, input) => {
        // no need to filter data returned by the api, text filter might have matched to non-displayed fields
        return true
    }

    return (
        <div {...optionalWrapperAttributes}>
            <h3 id={legend} ref={labelRef}>
                {legend}{required ? '*' : ''}
            </h3>
            <AsyncSelect
                aria-labelledby={legend}
                isClearable={isClearable}
                isMulti={isMultiselect}
                value={getDefaultValue()}
                loadOptions={getOptions}
                onChange={onChange}
                placeholder={intl.formatMessage({id: placeholderId})}
                loadingMessage={() => intl.formatMessage({id: 'loading'})}
                noOptionsMessage={() => intl.formatMessage({id: 'search-no-results'})}
                filterOption={filterOptions}
                formatOptionLabel={formatOption}
                aria-label={intl.formatMessage({id: placeholderId})}
                ref={selectInputRef}
            />
            <div className='select-popover'>
                <ValidationPopover
                    anchor={labelRef.current}
                    validationErrors={validationErrors}
                />
            </div>
        </div>
    )
}

HelSelect.defaultProps = {
    placeholderId: 'select',
    isClearable: true,
    isMultiselect: false,
    required: false,
}

HelSelect.propTypes = {
    intl: PropTypes.object,
    setData: PropTypes.func,
    name: PropTypes.string,
    isClearable: PropTypes.bool,
    isMultiselect: PropTypes.bool,
    setDirtyState: PropTypes.func,
    resource: PropTypes.string,
    legend: PropTypes.string,
    validationErrors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    selectedValue: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    placeholderId: PropTypes.string,
    customOnChangeHandler: PropTypes.func,
    optionalWrapperAttributes: PropTypes.object,
    currentLocale: PropTypes.string,
    required: PropTypes.bool,
}

const mapDispatchToProps = (dispatch) => ({
    setData: (value) => dispatch(setDataAction(value)),
})

export default connect(null, mapDispatchToProps)(injectIntl(HelSelect))
