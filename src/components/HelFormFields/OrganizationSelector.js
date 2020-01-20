import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import Select from 'react-select';
import {get} from 'lodash';
import {HelSelectTheme, HelSelectStyles} from '../../themes/react-select'
import {TextField} from '@material-ui/core'
import {HelMaterialTheme} from '../../themes/material-ui'
import helBrandColors from '../../themes/hel/hel-brand-colors'

const OrganizationSelector = ({formType, selectedOption, options, onChange}) => {
    const label = selectedOption.label ? selectedOption.label : ''
    const labelStyles = {
        color: helBrandColors.gray.black70,
        display: 'block',
        fontSize: '90%',
        margin: `${HelMaterialTheme.spacing(3)}px 0 ${HelMaterialTheme.spacing(1)}px`,
    }

    return (
        <React.Fragment>
            {formType === 'update' ? (
                <TextField
                    fullWidth
                    disabled
                    label={<FormattedMessage id='event-publisher' />}
                    value={label}
                />
            ) : options.length > 1 ? (
                <React.Fragment>
                    <span style={labelStyles}>
                        <FormattedMessage id='event-publisher' />
                    </span>
                    <Select
                        isClearable={false}
                        defaultValue={options[0]}
                        value={selectedOption}
                        options={options}
                        onChange={onChange}
                        theme={HelSelectTheme}
                        styles={HelSelectStyles}
                    />
                </React.Fragment>
            ) : (
                <TextField
                    fullWidth
                    disabled
                    label={<FormattedMessage id='event-publisher' />}
                    value={get(options, '[0].label', '')}
                />
            )}
        </React.Fragment>
    );
};

OrganizationSelector.propTypes = {
    options: PropTypes.arrayOf(PropTypes.object),
    formType: PropTypes.oneOf(['update', 'create']),
    selectedOption: PropTypes.object,
    onChange: PropTypes.func,
}

export default OrganizationSelector;
