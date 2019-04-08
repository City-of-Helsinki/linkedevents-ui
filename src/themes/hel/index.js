let Colors = require('material-ui/colors')
let Spacing = require('material-ui/styles/spacing')
import {createMuiTheme} from 'material-ui/styles'


const {red, blue} = Colors

let helCoat = {
    light: '#5aa0f9',
    main: '#0072c6',
    dark: '#004795',
    contrastText: '#fff',
}

let helFog = {
    light: '#d2fcff',
    main: '#9fc9eb',
    dark: '#6e98b9',
    contrastText: '#fff',
}

let helTram = {
    light: '#4ec373',
    main: '#009246',
    dark: '#00631b',
    contrastText: '#fff',
}

let helCopper = {
    light: '#63ffd8',
    main: '#00d7a7',
    dark: '#00a478',
    contrastText: '#fff',
}

let helGray = {
    black: '#343434',
    light: '#ebedf1',
    main: '#abb2bd',
    dark: '#525a65',
    contrastText: '#fff',
}

let helBrick = {
    light: '#f75d43',
    main: '#bd2719',
    dark: '#850000',
    contrastText: '#fff',
}

let primary = blue
let secondary = red
let background = blue

if (appSettings.ui_mode === 'events') {
    background = helCoat.main
    primary = helCoat
    secondary = helBrick
}
if (appSettings.ui_mode === 'courses') {
    background = helTram.main
    primary = helTram
    secondary = helBrick
}

let helRawStyle = {
    outline: 'none',
    spacing: Spacing,
    fontFamily: 'HelsinkiGrotesk, Roboto, sans-serif',
    palette: {
        primary: primary,
        secondary: secondary,
        primary2Color: primary.dark,
        primary3Color: helGray.dark,
        accent1Color: primary.light,
        accent2Color: primary.main,
        accent3Color: helGray.main,
        textColor: helGray.black,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: helGray.light,
        disabledColor: helGray.light,
    },
    overrides: {
        MuiButton: {
            root: {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.8em',
                lineHeight: '36px',
                raisedAccent: {
                    color: primary,
                },
            },
        },
        MuiInput: {
            root: {
                textColor: helGray.black,
                hintColor: helGray.light,
                floatingLabelColor: helGray.black,
                backgroundColor: '#ffffff',
                disabled: {
                    color: helGray.light,
                },
                focused: {
                    color: secondary.main,
                },
            },
        },
        MuiToolbar: {
            root: {
                backgroundColor: background,
            },
        },
        MuiSnackbar: {
            root: {
                backgroundColor: background,
            },
        },
        MuiSnackbarContent: {
            root: {
                backgroundColor: background,
            },
        },
        MuiTable: {
            root: {
                backgroundColor: '#ffffff',
            },
        },
    },
}

let helHeaderRawStyle = {
    spacing: Spacing,
    fontFamily: 'HelsinkiGrotesk, Roboto, sans-serif',
    palette: {
        primary: primary,
        primary2Color: primary.dark,
        primary3Color: helGray.dark,
        accent1Color: primary.light,
        accent2Color: primary.main,
        accent3Color: helGray.main,
        textColor: helGray.black,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: helGray.light,
        disabledColor: helGray.light,
    },
    overrides: {
        MuiButton: {
            root: {
                textTransform: 'none',
                fontWeight: 300,
                textColor: '#ffffff',
                outline: 'none',
            },
        },
        MuiInput: {
            root: {
                floatingLabelColor: helGray.black,
            },
        },
    },
}


let helTheme = createMuiTheme(helRawStyle)
let headerTheme = createMuiTheme(helHeaderRawStyle)

// Override specific component styles
headerTheme.mixins.toolbar.backgroundColor = background
headerTheme.mixins.toolbar.height = 56
headerTheme.mixins.toolbar.titleFontSize = 20
headerTheme.mixins.toolbar.iconColor = '#ffffff'
headerTheme.mixins.toolbar.separatorColor = '#ffffff'
headerTheme.mixins.toolbar.menuHoverColor = '#ffffff'

export {
    helTheme as HelTheme,
    headerTheme as HeaderTheme,
}
