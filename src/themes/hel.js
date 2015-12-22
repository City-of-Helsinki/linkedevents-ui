import ThemeManager from 'material-ui/lib/styles/theme-manager';

let Colors = require('material-ui/lib/styles/colors');
let ColorManipulator = require('material-ui/lib/utils/color-manipulator');
let Spacing = require('material-ui/lib/styles/spacing');

let helRawStyle = {
    spacing: Spacing,
    fontFamily: 'Karbid Comp, Roboto, sans-serif',
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
};

let helTheme = ThemeManager.getMuiTheme(helRawStyle);

// Override specific component styles
helTheme.toolbar.backgroundColor = '#0072c6';
helTheme.toolbar.height = 56;
helTheme.toolbar.titleFontSize = 20;
helTheme.toolbar.iconColor = '#ffffff';
helTheme.toolbar.separatorColor = '#ffffff';
helTheme.toolbar.menuHoverColor = '#ffffff';

export default helTheme;
