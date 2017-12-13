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
        accent2Color: '#0072c6', // Toolbar color
        accent3Color: Colors.grey500,
        textColor: Colors.black,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: Colors.darkBlack300,
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
        accent2Color: '#0072c6', // Toolbar color
        accent3Color: Colors.grey500,
        textColor: Colors.black,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: Colors.darkBlack300,
    },
}

let helTheme = createMuiTheme(helRawStyle)
let headerTheme = createMuiTheme(helHeaderRawStyle)

//helTheme.palette.shades.light.text.primary = helRawStyle.palette.textColor
// helTheme.textField.textColor = helRawStyle.palette.textColor
//helTheme.palette.shades.light.text.hint = helRawStyle.palette.disabledColor
// helTheme.textField.hintColor = helRawStyle.palette.disabledColor
//helTheme.palette.shades.light.input.labelText = helRawStyle.palette.textColor

// helTheme.textField.floatingLabelColor = helRawStyle.palette.textColor
// helTheme.textField.disabledTextColor = helRawStyle.palette.disabledColor
// helTheme.textField.errorColor = Colors.red500
// helTheme.textField.focusColor = helRawStyle.palette.primary1Color
// helTheme.textField.backgroundColor = '#ffffff'

// helTheme.flatButton.textTransform = 'none'
// helTheme.raisedButton.textTransform = 'none'

// helTheme.flatButton.fontWeight = 300
// helTheme.raisedButton.fontWeight = 300

// // Override specific component styles
// Original: headerTheme.toolbar.backgroundColor = '#0072c6'
headerTheme.mixins.toolbar.backgroundColor = '#0072c6'
headerTheme.mixins.toolbar.height = 56
headerTheme.mixins.toolbar.titleFontSize = 20
headerTheme.mixins.toolbar.iconColor = '#ffffff'
headerTheme.mixins.toolbar.separatorColor = '#ffffff'
headerTheme.mixins.toolbar.menuHoverColor = '#ffffff'

// headerTheme.flatButton.textColor = '#ffffff'
// headerTheme.flatButton.textTransform = 'none'
// headerTheme.flatButton.fontWeight = 300

// headerTheme.textField.floatingLabelColor = helRawStyle.palette.textColor


export {
    helTheme as HelTheme,
    headerTheme as HeaderTheme
}
