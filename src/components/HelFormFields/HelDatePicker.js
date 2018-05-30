import PropTypes from 'prop-types';
import React from 'react'
import HelTextField from './HelTextField.js'
import DatePicker from 'react-datepicker/dist/react-datepicker.js'
import 'react-datepicker/dist/react-datepicker.css'
import './HelDatePicker.scss'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import moment from 'moment'

class HelDatePicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: this.props.defaultValue,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        
    }
    
    componentDidMount() {
        this.props.onChange('date', this.state.date)
    }

    handleChange(date) {
        if (date._pf.nullInput) {
            this.setState({
                date: undefined,
            })
            this.props.onChange('date', undefined)
        } else if (date.isValid()) {
            this.setState({
                date: date,
            })
            this.props.onChange('date', date)
        }
    }

    handleBlur() {
        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur()
        }
    }

    componentWillReceiveProps(nextProps) {
        if(! _.isEqual(nextProps.defaultValue, this.props.defaultValue)) {
            if (moment(nextProps.defaultValue).isValid()) {
                this.setState({date: nextProps.defaultValue})
            }
        }
    }
    render() {
        return (
            <div className='hel-text-field'>
                <DatePicker
                    placeholderText='pp.kk.vvvv'
                    selected={this.state.date}
                    autoOk={true}
                    name={this.props.name}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    locale="fi"
                />
            </div>

        )
    }
}

HelDatePicker.propTypes = {
    defaultValue: PropTypes.object,
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
}

export default connect((state) => ({
    editor: state.editor,
}))(HelDatePicker)
