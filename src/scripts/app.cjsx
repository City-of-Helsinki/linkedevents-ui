require 'bootstrap/dist/css/bootstrap.css'
require '!style!css!sass!../styles/main.scss';

conf =
    baseUrl: appSettings.static_url
    bundles:
        # Work around a problem with module names ending with ".js"
        "spin": ["spin.js"]
    map:
        "*":
            React: "react"
            ReactBootstrap: "react-bootstrap"
    paths:
        app: 'scripts'
        'react-bootstrap/lib': 'components/react-bootstrap'

# console.log conf
requirejs.config conf

define (require) ->
    # imports
    React = require 'react'
    ReactDOM = require 'react-dom'
    Router = require 'react-router'

    # Material-ui components
    Toolbar = require 'material-ui/lib/toolbar/toolbar'
    ToolbarGroup = require 'material-ui/lib/toolbar/toolbar-group'
    ToolbarSeparator = require 'material-ui/lib/toolbar/toolbar-separator'
    ToolbarTitle = require 'material-ui/lib/toolbar/toolbar-title'
    FlatButton = require 'material-ui/lib/flat-button'
    FontIcon = require 'material-ui/lib/font-icon'

    # pages
    Editor = require './editor.cjsx'
    Search = require './search.cjsx'

    # Initialize tap event plugin (used by material-ui components)
    injectTapEventPlugin = require 'react-tap-event-plugin'
    injectTapEventPlugin()

    App = React.createClass
        render: ->
            <div className="test-class">
                <Toolbar>
                    <ToolbarGroup key={0} float="left">
                        <ToolbarTitle text="Linked Events" />
                    </ToolbarGroup>
                    <ToolbarGroup key={1} float="left">
                        <FlatButton linkButton={true} label="Hae tapahtumia" primary={true} href="/#/search" />
                    </ToolbarGroup>
                    <ToolbarGroup key={2} float="right">
                        <FlatButton linkButton={true} label="Lisää uusi tapahtuma" href="/#/event/create/new">
                            <FontIcon className="material-icons">add</FontIcon>
                        </FlatButton>
                    </ToolbarGroup>
                </Toolbar>
                <div
                    className="container"
                >
                    {@props.children}
                </div>
            </div>

    ReactDOM.render(
        <Router.Router>
            <Router.Route path="/" component={App}>
                <Router.Route path="search" component={Search.SearchPage} />
                <Router.Route
                    path="event/:action/:eventId"
                    component={Editor.Editor}
                />
            </Router.Route>
        </Router.Router>,
        document.getElementById 'content'
    )
