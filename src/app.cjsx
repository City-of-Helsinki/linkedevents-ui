require 'bootstrap/dist/css/bootstrap.css'

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
    RB = require 'react-bootstrap'
    Router = require 'react-router'

    # pages
    Editor = require './editor.cjsx'
    Search = require './search.cjsx'

    App = React.createClass
        render: ->
            <div>
                <RB.Navbar>
                    <RB.Navbar.Header>
                        <RB.Navbar.Brand>
                            Linked Events
                        </RB.Navbar.Brand>
                    </RB.Navbar.Header>
                    <RB.Nav>
                        <RB.NavItem eventKey={1} href="/#/search">
                            Hae tapahtumia
                        </RB.NavItem>
                        <RB.NavItem eventKey={2} href="/#/event/create/new">
                            Lisää uusi tapahtuma
                        </RB.NavItem>
                    </RB.Nav>
                </RB.Navbar>
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
