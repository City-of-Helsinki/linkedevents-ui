import PropTypes from 'prop-types';
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './HelDatePicker.scss'

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

    handleChange = (date) => {	
        // the component should empty when desired	
        this.setState({	
            date: date,	
        })	
        this.props.onChange('date', date)
    }
    
    handleBlur = () => {
        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur()
        }
    }
    
    UNSAFE_componentWillReceiveProps(nextProps) {	
        if(! _.isEqual(nextProps.defaultValue, this.props.defaultValue)) {	
            // Bootstrap or React textarea has a bug where null value gets interpreted	
            // as uncontrolled, so no updates are done	
            this.setState({date: nextProps.defaultValue ? nextProps.defaultValue : ''})	
            //}	
        }	
    }

    render() {
        return (
            <div className='hel-text-field'>
                <DatePicker
                    {...this.props}
                    placeholderText={this.props.placeholder}
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
    placeholder: PropTypes.string,
}

export default HelDatePicker
