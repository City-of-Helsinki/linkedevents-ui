import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import Select from 'react-select';
import {FormControl} from 'react-bootstrap';
import {get} from 'lodash';

const OrganizationSelector = (props) => {
    const {formType, selectedOption, options, onChange} = props;
    const label = selectedOption.label ? selectedOption.label : ''

    return (
        <div className='hel-text-field'>
            <label className='hel-label'>
                <FormattedMessage id='event-publisher' />
            </label>
            {formType === 'update' ? (
                <FormControl value={label} disabled />
            ) : options.length > 1 ? (
                <Select
                    clearable={false}
                    defaultValue={options[0]}
                    value={selectedOption}
                    options={options}
                    onChange={onChange}
                />
            ) : (
                <FormControl value={get(options, '[0].label', '')} disabled />
            )}
        </div>
    );
};

OrganizationSelector.propTypes = {
    options: PropTypes.arrayOf(PropTypes.object),
    formType: PropTypes.oneOf(['update', 'create']),
    selectedOption: PropTypes.object,
    onChange: PropTypes.func,
}

export default OrganizationSelector;
