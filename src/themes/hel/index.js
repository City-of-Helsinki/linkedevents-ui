import ThemeManager from 'material-ui/lib/styles/theme-manager'

let Colors = require('material-ui/lib/styles/colors')
let ColorManipulator = require('material-ui/lib/utils/color-manipulator')
let Spacing = require('material-ui/lib/styles/spacing')

let helRawStyle = {
    spacing: Spacing,
    fontFamily: 'KarbidComp, Roboto, sans-serif',
    palette: {
        primary1Color: Colors.cyan500,
        primary2Color: Colors.cyan700,
        primary3Color: Colors.lightBlack,
        accent1Color: Colors.pinkA200,
        accent2Color: '#0072c6', // Toolbar color
        accent3Color: Colors.grey500,
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    },
}

let helHeaderRawStyle = {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: Colors.cyan500,
        primary2Color: Colors.cyan700,
        primary3Color: Colors.lightBlack,
        accent1Color: Colors.pinkA200,
        accent2Color: '#0072c6', // Toolbar color
        accent3Color: Colors.grey500,
        textColor: Colors.white,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    },
}

let helTheme = ThemeManager.getMuiTheme(helRawStyle)
let headerTheme = ThemeManager.getMuiTheme(helHeaderRawStyle)

helTheme.textField.textColor = helRawStyle.palette.textColor
helTheme.textField.hintColor = helRawStyle.palette.disabledColor
helTheme.textField.floatingLabelColor = helRawStyle.palette.textColor
helTheme.textField.disabledTextColor = helRawStyle.palette.disabledColor
helTheme.textField.errorColor = Colors.red500
helTheme.textField.focusColor = helRawStyle.palette.primary1Color
helTheme.textField.backgroundColor = '#ffffff'
helTheme.textField.borderColor = 'rgba(0,0,0,0)'


// Override specific component styles
headerTheme.toolbar.backgroundColor = '#0072c6'
headerTheme.toolbar.height = 56
headerTheme.toolbar.titleFontSize = 20
headerTheme.toolbar.iconColor = '#ffffff'
headerTheme.toolbar.separatorColor = '#ffffff'
headerTheme.toolbar.menuHoverColor = '#ffffff'
headerTheme.flatButton.textColor = '#ffffff'
headerTheme.flatButton.textTransform = 'none'
headerTheme.flatButton.fontWeight = 200

export {
    helTheme as HelTheme,
    headerTheme as HeaderTheme
}
