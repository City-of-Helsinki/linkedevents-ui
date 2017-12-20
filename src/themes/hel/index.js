let Colors = require('material-ui/colors')
let Spacing = require('material-ui/styles/spacing')
import { createMuiTheme } from 'material-ui/styles'

let helRawStyle = {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: Colors.cyan500,
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
                lineHeight: '36px'
           },
        },
        MuiInput: {
            root: {
                textColor: Colors.black,
                hintColor: Colors.darkBlack300,
                floatingLabelColor: Colors.black,
                backgroundColor: '#ffffff',
                disabled: {
                    color: Colors.darkBlack300
                },
                error: {
                    color: Colors.red500
                },
                focused: {
                    color: Colors.cyan500
                }
            },
        },
        MuiToolbar: {
            root: {
                backgroundColor: '#0072c6',
            },
        },
        MuiSnackbar: {
            root: {
                backgroundColor: '#0072c6',
            },
        },
        MuiSnackbarContent: {
            root: {
                backgroundColor: '#0072c6',
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
        primary1Color: Colors.cyan500,
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
headerTheme.mixins.toolbar.backgroundColor = '#0072c6'
headerTheme.mixins.toolbar.height = 56
headerTheme.mixins.toolbar.titleFontSize = 20
headerTheme.mixins.toolbar.iconColor = '#ffffff'
headerTheme.mixins.toolbar.separatorColor = '#ffffff'
headerTheme.mixins.toolbar.menuHoverColor = '#ffffff'

export {
    helTheme as HelTheme,
    headerTheme as HeaderTheme
}
