console.log appSettings

require 'bootstrap/dist/css/bootstrap.css'

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

console.log conf
requirejs.config conf

format_date = (date) ->
    arr = date.split('-')
    arr.reverse()
    return arr.join '.'

define (require) ->
    $ = require 'jquery'
    window.jQuery = $
    bootstrap = require 'bootstrap'
    Router = require 'react-router'
    React = require 'react'
    RB = require 'react-bootstrap'
    RBR = require 'react-router-bootstrap'
    Loader = require 'react-loader'
    DateRangePicker = require 'bootstrap-daterangepicker'
    moment = require 'moment'
    momenttz = require 'moment-timezone'
    #mui = require 'material-ui'
    _ = require 'underscore'

    FrontPage = React.createClass
        handlePurposeClick: (arg1, arg2) ->
            console.log arg1
            console.log arg2

        render: ->
            <div>
                <h2>Linked Events</h2>
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
