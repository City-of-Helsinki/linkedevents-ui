# console.log appSettings

require 'bootstrap/dist/css/bootstrap.css'
require 'react-bootstrap-daterangepicker/css/daterangepicker.css'

conf = 
    baseUrl: appSettings.static_url
    bundles:
        # Work around a problem with module names ending with ".js"
        "spin": ["spin.js"]
    map:
        "*":
            ReactBootstrap: "react-bootstrap"
            React: "react"
    paths:
        app: 'scripts'
        'react-bootstrap/lib': 'components/react-bootstrap'

# console.log conf
requirejs.config conf

define (require) ->
    $ = require 'jquery'
    window.jQuery = $
    bootstrap = require 'bootstrap'
    Router = require 'react-router'
    React = require 'react'
    RB = require 'react-bootstrap'
    RBR = require 'react-router-bootstrap'
    Loader = require 'react-loader'
    DateRangePicker = require 'react-bootstrap-daterangepicker'
    moment = require 'moment'
    momenttz = require 'moment-timezone'
    #mui = require 'material-ui'
    _ = require 'underscore'

    dateFormat = (timeStr) ->
        if not timeStr 
            return ''
        return moment(timeStr).format('YYYY-MM-DD')

    EventRow = React.createClass
        render: ->
            e = @props.event
            name = e.name.fi or e.name.en or e.name.sv
            url = e['@id'] + '?format=json'
            <tr key={e['@id']}>
                <td><a target="_new" href={url}>{name}</a></td>
                <td>{dateFormat(e.start_time)}</td>
                <td>{dateFormat(e.end_time)}</td>
                <td>{e.data_source}</td>
            </tr>

    EventTable = React.createClass
        render: ->
            rows = []
            @props.events.forEach ((event) ->
                rows.push <EventRow event={event} />
            ).bind(this)
            <table className="table-striped" width="100%">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Data source</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>

    SearchBar = React.createClass
        handleChange: ->
            @props.onUserInput(
                @refs.filterTextInput.getDOMNode().value,
            )
        componentDidMount: ->
            @refs.filterTextInput.getDOMNode().focus()
        render: ->
            start = @props.startDate.format('YYYY-MM-DD')
            end = @props.endDate.format('YYYY-MM-DD')
            label = start + ' - ' + end
            if start == end
                label = start
            label += ' '
            ranges =
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
            <form onSubmit={@onFormSubmit} className="MyForm">
                <input
                    type="text"
                    placeholder="Search..."
                    value={@props.filterText}
                    ref="filterTextInput"
                    onChange={@handleChange}
                    className="form-control"
                />
                <p>
                    <DateRangePicker startDate={@props.startDate}
                                     endDate={@props.endDate}
                                     ranges={ranges}
                                     onEvent={@props.onDateRangePickerEvent}>
                        <RB.Button className="selected-date-range-btn"
                                   style={{width:'100%'}}>
                            <div className="pull-left">
                                <RB.Glyphicon glyph="calendar" />
                            </div>
                            <div className="pull-right">
                                <span>{label}</span>
                                <span className="caret"></span>
                            </div>
                        </RB.Button>
                    </DateRangePicker>
                </p>
                <p>
                    <input
                        type="submit"
                        value="Hae tapahtumia"
                        onClick={@props.onFormSubmit}
                        className="applyBtn btn btn-sm btn-primary"
                    />
                </p>
            </form>

    FilterableEventTable = React.createClass
        getInitialState: ->
            filterText: ''
            startDate: moment().startOf('month')
            endDate: moment().endOf('month')
            events: [] 
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
            console.log url
            $.getJSON url, ((result) ->
                console.log url 
                console.log result
                @setState
                    events: result.data
            ).bind(this)
        render: ->
            <div>
                <SearchBar
                    filterText={@state.filterText}
                    startDate={@state.startDate}
                    endDate={@state.endDate}
                    onUserInput={@handleUserInput}
                    onDateRangePickerEvent={@handleDateRangePickerEvent}
                    onFormSubmit={@updateTable}
                />
                <EventTable
                    events={@state.events}
                    filterText={@state.filterText}
                />
            </div>

    FrontPage = React.createClass
        render: ->
            <div>
                <FilterableEventTable events={[]} /> 
            </div>

    App = React.createClass
        render: ->
            <div>
                <RB.Navbar brand='Linked Events'>
                    <RB.Nav>
                        <RB.NavItem href="/">Etusivu</RB.NavItem>
                    </RB.Nav>
                </RB.Navbar>
                <div className="container">
                    <Router.RouteHandler />
                </div>
            </div>

    routes =
        <Router.Route name="app" path="/" handler={App}>
            <Router.DefaultRoute name="front" handler={FrontPage} />
        </Router.Route>

    Router.run routes, (Handler) ->
        React.render <Handler/>, document.body
