let Colors = require('material-ui/colors')
let Spacing = require('material-ui/styles/spacing')
import {createMuiTheme} from 'material-ui/styles'


const {green, lightGreen, cyan, blue, lightBlue} = Colors


let helColor = {
    A200: '#00bcd4',
    helTram: '#009246',
    helCopper: '#00d7a7',
    helCoat: '#0072c6',
    helFog: '#9fc9eb',
}

let primary = blue
let secondary = cyan
let background = blue

if (appSettings.ui_mode === 'events') {
    background = helColor.helCoat
    primary = blue
    secondary = lightBlue
}
if (appSettings.ui_mode === 'courses') {
    background = helColor.helTram
    primary = green
    secondary = lightGreen
}

let helRawStyle = {
    outline: 'none',
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary: primary,
        secondary: secondary,
        primary2Color: Colors.cyan700,
        primary3Color: Colors.gray700,
        accent1Color: '#48a3e7',
        accent2Color: '#0072c6',
        accent3Color: Colors.grey500,
        textColor: Colors.black,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: Colors.darkBlack300,
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
                textColor: Colors.black,
                hintColor: Colors.darkBlack300,
                floatingLabelColor: Colors.black,
                backgroundColor: '#ffffff',
                disabled: {
                    color: Colors.darkBlack300,
                },
                error: {
                    color: Colors.red500,
                },
                focused: {
                    color: Colors.cyan500,
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
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary: primary,
        primary2Color: Colors.cyan700,
        primary3Color: Colors.gray700,
        accent1Color: '#48a3e7',
        accent2Color: '#0072c6',
        accent3Color: Colors.grey500,
        textColor: Colors.black,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: Colors.darkBlack300,
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
                floatingLabelColor: Colors.black,
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
