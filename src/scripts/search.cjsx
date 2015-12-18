# styles
require 'react-bootstrap-daterangepicker/css/daterangepicker.css'

# jquery
$ = require 'jquery'
window.jQuery = $

# js
moment = require 'moment'

# react-specific
DateRangePicker = require 'react-bootstrap-daterangepicker'
React = require 'react'
RB = require 'react-bootstrap'

# Material-UI components
RaisedButton = require 'material-ui/lib/raised-button'

# === code ===

dateFormat = (timeStr) ->
    if not timeStr
        return ''
    return moment(timeStr).format('YYYY-MM-DD')


EventRow = React.createClass
    render: ->
        e = @props.event
        name = (
            e.name.fi or e.name.en or e.name.sv or
            e.headline.fi or e.headline.en or e.headline.sv
        )

        url = "/#/event/update/" + encodeURIComponent(e['@id'])
        <tr key={e['@id']}>
            <td><a href={url}>{name}</a></td>
            <td>{dateFormat(e.start_time)}</td>
            <td>{dateFormat(e.end_time)}</td>
            <td>{e.publisher}</td>
        </tr>


EventTable = React.createClass
    render: ->
        rows = []
        @props.events.forEach ((event) ->
            rows.push <EventRow event={event} key={event.id} />
        ).bind(this)
        <table className="table-striped" width="100%">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Start date</th>
                    <th>End date</th>
                    <th>Publisher</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>


SearchBar = React.createClass

    handleChange: ->
        @props.onUserInput @refs.filterTextInput.value

    handleSubmit: (event) ->
        event.preventDefault()
        @props.onFormSubmit()

    componentDidMount: ->
        @refs.filterTextInput.focus()

    formatLabel: ->
        start = @props.startDate.format('YYYY-MM-DD')
        end = @props.endDate.format('YYYY-MM-DD')
        if start == end
            return start
        else
            return start + ' - ' + end

    getRanges: ->
        'Today': [
          moment()
          moment()
        ]
        'Yesterday': [
          moment().subtract(1, 'days')
          moment().subtract(1, 'days')
        ]
        'Last 7 Days': [
          moment().subtract(6, 'days')
          moment()
        ]
        'Last 30 Days': [
          moment().subtract(29, 'days')
          moment()
        ]
        'This Month': [
          moment().startOf('month')
          moment().endOf('month')
        ]
        'Last Month': [
          moment().subtract(1, 'month').startOf('month')
          moment().subtract(1, 'month').endOf('month')
        ]

    render: ->
        label = @formatLabel() + ' '
        <form
            onSubmit={@handleSubmit}
            className="MyForm"
        >
            <input
                type="text"
                placeholder="Search..."
                value={@props.filterText}
                ref="filterTextInput"
                onChange={@handleChange}
                className="form-control"
            />
            <DateRangePicker
                startDate={@props.startDate}
                endDate={@props.endDate}
                ranges={@getRanges()}
                onEvent={@props.onDateRangePickerEvent}
                style={padding: '0.5em 0em 0.5em 0em'}
            >
                <RB.Button
                    className="selected-date-range-btn"
                    style={{width:'100%'}}
                >
                    <div className="pull-left">
                        <RB.Glyphicon glyph="calendar" />
                    </div>
                    <div className="pull-right">
                        <span>{label}</span>
                        <span className="caret"></span>
                    </div>
                </RB.Button>
            </DateRangePicker>
                <RaisedButton
                    primary={true}
                    type="submit"
                    label="Hae tapahtumia"
                    onClick={@handleSubmit}
                />
            <p>
            </p>
        </form>


FilterableEventTable = React.createClass

    getInitialState: ->
        filterText: ''
        startDate: moment().startOf('month')
        endDate: moment().endOf('month')
        events: []
        apiErrorMsg: ''

    handleUserInput: (filterText) ->
        @setState
            filterText: filterText,

    handleDateRangePickerEvent: (event, picker) ->
        if event.type is 'apply'
            @setState
                startDate: picker.startDate
                endDate: picker.endDate
            @updateTable()

    updateTable: ->
        if not @state.filterText
            return
        url = "#{appSettings.api_base}/event/?text=#{@state.filterText}"
        if @state.startDate
            url += "&start=#{@state.startDate.format('YYYY-MM-DD')}"
        if @state.endDate
            url += "&end=#{@state.endDate.format('YYYY-MM-DD')}"
        $.getJSON(url, ((result) ->
            @setState
                events: result.data
                apiErrorMsg: ''
        ).bind(this))
        .error (() ->
            @setState
                apiErrorMsg: 'Error connecting to server.'
                events: []
        ).bind(this)

    render: ->
        results = null
        if @state.events.length > 0
            results = (
                <div>
                    <hr />
                    <EventTable
                        events={@state.events}
                        filterText={@state.filterText}
                    />
                </div>
            )
        err = ''
        if @state.apiErrorMsg.length > 0
            err = (
                <span style={color: 'red !important'}>
                    Error connecting to server.
                </span>
            )
        <div
            style={padding: '0em 2em 0.5em 0em'}
        >
            <SearchBar
                filterText={@state.filterText}
                startDate={@state.startDate}
                endDate={@state.endDate}
                onUserInput={@handleUserInput}
                onDateRangePickerEvent={@handleDateRangePickerEvent}
                onFormSubmit={@updateTable}
            />
            {err}
            {results}
        </div>


SearchPage = React.createClass
    render: ->
        <div>
            <FilterableEventTable events={[]} />
        </div>


module.exports =
    SearchPage: SearchPage
